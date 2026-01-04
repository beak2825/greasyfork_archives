// ==UserScript==
// @name         **OBSOLETE** SYSWISE Portal - Absence tweaks
// @namespace    http://office.syswise.com/
// @version      0.1.23
// @description  **OBSOLETE** SYSWISE Portal - Userscript for Absence tweaks
// @author       joaquim.perez@syswise.com
// @match        http://DO_NOTHING__office.syswise.com/intranet-timesheet2/absences/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syswise.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535231/%2A%2AOBSOLETE%2A%2A%20SYSWISE%20Portal%20-%20Absence%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/535231/%2A%2AOBSOLETE%2A%2A%20SYSWISE%20Portal%20-%20Absence%20tweaks.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    setTimeout(async function () {

        const oWhitelistedUsers = [
            "Joaquim Perez",
            "Airton Camboa",
            "Nuno Afonso",
            "Nuno Gaspar",
            "Pedro Farias",
            "Sofia  Ribas"
        ];
        const sWelcomeText = $(".header_welcome").text();
        const bIsUserAllowed = oWhitelistedUsers.some(function (sWhitelistedUser) {
            return sWelcomeText.includes(sWhitelistedUser);
        });
        if (!bIsUserAllowed) {
            return;
        }

        const oDeferredUI5 = $.Deferred();
        const oPromiseUI5 = oDeferredUI5.promise();

        const oUI5TimestampReq = await fetch("https://openui5.hana.ondemand.com/resources/sap-ui-cachebuster");
        const sUI5Timestamp = await oUI5TimestampReq.text();
        $.ajaxSetup({ cache: true });
        $.getScript(`https://openui5.hana.ondemand.com/resources/${sUI5Timestamp}/sap-ui-core.js`, function () {
            oDeferredUI5.resolve();
        });

        switch (window.location.pathname) {
            // >>>> LIST ABSENCES
            case "/intranet-timesheet2/absences/index":

                $(".fullwidth-list, .footer_hack, #footer").hide();

                await oPromiseUI5;

                const oUsers = $("#user_selection option")
                    .toArray()
                    .filter(function (oOption) {
                        return oOption.innerText.includes("    ")
                    })
                    .map(function (oOption) {
                        return {
                            user_id: oOption.value,
                            user_name: oOption.innerText.trim()
                        };
                    });

                const oCurrentDate = new Date();
                const oMinDate = new Date(oCurrentDate.getFullYear() - 1, 0, 1);
                const sMinDate = oMinDate.toJSON().substring(0, 10);

                const oTeams = [{ team_id: "", team_name: "" }]
                    .concat($("#user_department_id option")
                        .toArray()
                        .filter(function (oOption) {
                            return oOption.innerText.includes("                  ")
                        })
                        .map(function (oOption) {
                            return {
                                team_id: oOption.value,
                                team_name: oOption.innerText.trim()
                            };
                        }));

                var oUserTeamMapPromises = [];

                var oUserTeamMap = {};
                oTeams.forEach(async function (oTeam) {
                    if (oTeam.team_id) {
                        const oDeferred = $.Deferred();
                        const oPromise = oDeferred.promise();
                        oUserTeamMapPromises.push(oPromise);

                        const sAbsencesByTeamUrl = `/intranet-timesheet2/absences/?timescale=custom&user_department_id=${oTeam.team_id}&start_date=${sMinDate}&how_many=999999&output_format=csv`;
                        const oAbsencesByTeamReq = await fetch(sAbsencesByTeamUrl);
                        const sAbsencesByTeamDOM = await oAbsencesByTeamReq.text();
                        const oAbsencesByTeamDOM = $($.parseHTML(sAbsencesByTeamDOM));
                        const oAbsencesByTeamTable = (oAbsencesByTeamDOM.find('.table_list_page tbody').toArray())[0];
                        const oAbsencesByTeam = Array.from(oAbsencesByTeamTable.rows).slice(1);
                        const oDistinctUserIds = [...new Set(oAbsencesByTeam.map(function (oAbsence) {
                            const oUserURL = new URL(oAbsence.cells[3].firstChild.href);
                            const oUserURLSearch = new URLSearchParams(oUserURL.search);
                            const sUserId = oUserURLSearch.get('user_id');
                            return sUserId;
                        }))];

                        oDistinctUserIds.forEach(function (sUserId) {
                            oUserTeamMap[sUserId] = oTeam.team_id;
                        });

                        oDeferred.resolve();
                    }
                });

                const oDeferred_Absences = $.Deferred();
                const oPromise_Absences = oDeferred_Absences.promise();

                var oAbsences = [];

                (async function () {
                    const sAbsencesReqUrl = `/intranet-rest/im_user_absence?format=json&query=end_date > '${sMinDate}' and ( absence_status_id = 16000 or absence_status_id = 16004 ) and owner_id is not null`;
                    const oAbsencesReq = await fetch(sAbsencesReqUrl);
                    oAbsences = await oAbsencesReq.json();

                    oDeferred_Absences.resolve();
                })();

                const oDeferred_BankHolidays = $.Deferred();
                const oPromise_BankHolidays = oDeferred_BankHolidays.promise();
                var oBankHolidaysFinal = [];
                (async function () {
                    const sBankHolidaysReqUrl = `/intranet-rest/im_user_absence?format=json&query=end_date > '${sMinDate}' and absence_type_id = 5005`;
                    const oBankHolidaysReq = await fetch(sBankHolidaysReqUrl);
                    const oBankHolidays = await oBankHolidaysReq.json();
                    oBankHolidaysFinal = oBankHolidays.data.map(function (oBankHoliday) {
                        const oStartDate = new Date(`${oBankHoliday.start_date.substring(0, 10)}T00:00:00`);
                        const oEndDate = new Date(`${oBankHoliday.end_date.substring(0, 10)}T00:00:00`);

                        return Object.assign(oBankHoliday, {
                            start_date_object: oStartDate,
                            end_date_object: oEndDate
                        });
                    });
                    oDeferred_BankHolidays.resolve();
                })();

                await Promise.all([
                    sap.ui.core.Lib.load("sap.m"),
                    sap.ui.core.Lib.load("sap.ui.core"),
                    sap.ui.core.Lib.load("sap.ui.unified"),
                    sap.ui.core.Lib.load("sap.ui.mdc")
                ]);

                sap.ui.define("com.perezjquim.syswiseportal.absences", [
                    "sap/ui/unified/Calendar",
                    "sap/ui/model/json/JSONModel",
                    "sap/ui/unified/DateTypeRange",
                    "sap/ui/model/Sorter",
                    "sap/ui/model/Filter",
                    "sap/ui/model/FilterOperator",
                    "sap/ui/core/BusyIndicator",
                    "sap/m/Label",
                    "sap/m/MultiComboBox",
                    "sap/ui/core/Item",
                    "sap/m/PlanningCalendar",
                    "sap/m/PlanningCalendarRow",
                    "sap/ui/unified/CalendarAppointment",
                    "sap/m/IconTabBar",
                    "sap/m/IconTabFilter",
                    "sap/ui/mdc/FilterBar",
                    "sap/ui/mdc/FilterField",
                    "sap/m/ComboBox",
                    "sap/m/ScrollContainer"
                ], async function (Calendar, JSONModel, DateTypeRange, Sorter, Filter, FilterOperator, BusyIndicator, Label, MultiComboBox, Item, PlanningCalendar, PlanningCalendarRow, CalendarAppointment, IconTabBar, IconTabFilter, FilterBar, FilterField, ComboBox, ScrollContainer) {
                    const oCore = {
                        run: function () {
                            this._renderAbsences();
                        },

                        _renderAbsences: async function () {
                            BusyIndicator.show(0);

                            const oCustomContainer = $(`<div class='sapUiSizeCompact'/>`).appendTo($("body")).get(0);

                            await Promise.all([
                                oUserTeamMapPromises,
                                oPromise_Absences,
                                oPromise_BankHolidays
                            ]);

                            const oUsersModel = new JSONModel(oUsers);
                            const oTeamsModel = new JSONModel(oTeams);
                            const oBankHolidaysModel = new JSONModel(oBankHolidaysFinal);

                            const oAbsenceTypeDetails = {
                                "5000":
                                {
                                    absence_type_desc: "Vacation",
                                    absence_type_color: "orange"
                                },
                                "5001":
                                {
                                    absence_type_desc: "Leave of absence",
                                    absence_type_color: "mediumvioletred"
                                },
                                "5002":
                                {
                                    absence_type_desc: "Excused absence",
                                    absence_type_color: "dodgerblue"
                                }
                            };

                            var oAbsencesFinal = [];

                            oBankHolidaysFinal.forEach(function (oBankHoliday) {
                                oAbsencesFinal.push(Object.assign(oBankHoliday, {
                                    is_bank_holiday: true
                                }));
                            });

                            oAbsences.data.forEach(function (oAbsence) {
                                const oUser = oUsers.find(function (oUser) {
                                    return oUser.user_id == oAbsence.owner_id
                                });

                                if (oUser) {
                                    const oStartDate = new Date(`${oAbsence.start_date.substring(0, 10)}T00:00:00`);
                                    const oEndDate = new Date(`${oAbsence.end_date.substring(0, 10)}T23:59:59`);

                                    oAbsencesFinal.push(Object.assign(oAbsence, {
                                        start_date_object: oStartDate,
                                        end_date_object: oEndDate,
                                        user_name: oUser.user_name,
                                        duration_days_number: Number(oAbsence.duration_days),
                                        team_id: oUserTeamMap[oAbsence.owner_id],
                                        absence_type_desc: oAbsenceTypeDetails[oAbsence.absence_type_id].absence_type_desc,
                                        absence_type_color: oAbsenceTypeDetails[oAbsence.absence_type_id].absence_type_color
                                    }));
                                }
                            });

                            const oAbsencesModel = new JSONModel(oAbsencesFinal);

                            const oTeamComboBox = new ComboBox({
                                items:
                                {
                                    path: 'teams>/',
                                    length: 999999,
                                    template: new Item({
                                        key: '{teams>team_id}',
                                        text: '{teams>team_name}'
                                    })
                                },
                                selectionChange: function (oEvent) {
                                    const oSource = oEvent.getSource();
                                    const sSelectedKey = oSource.getSelectedKey();
                                    const oCalendarDatesBinding = oCalendar.getBinding("specialDates");
                                    const oPlanningCalendarRowBinding = oPlanningCalendar.getBinding("rows");

                                    if (sSelectedKey) {
                                        const oFilter = new Filter("team_id", FilterOperator.EQ, sSelectedKey);

                                        oCalendarDatesBinding.filter([oFilter]);
                                        oPlanningCalendarRowBinding.filter([oFilter]);
                                    }
                                    else {
                                        oCalendarDatesBinding.filter([]);
                                        oPlanningCalendarRowBinding.filter([]);
                                    }

                                    oUserComboBox.setSelectedKeys([]);

                                    this._prepareCalendarDateTooltips(oAbsencesModel.getData(), oTeamComboBox, oUserComboBox);
                                }.bind(this)
                            });

                            const oUserComboBox = new MultiComboBox({
                                showSelectAll: true,
                                items:
                                {
                                    path: 'users>/',
                                    length: 999999,
                                    template: new Item({
                                        key: '{users>user_id}',
                                        text: '{users>user_name}'
                                    })
                                },
                                selectionChange: function (oEvent) {
                                    const oSource = oEvent.getSource();
                                    const bHasSelectedAll = oEvent.getParameter("selectAll");
                                    const oSelectedKeys = oSource.getSelectedKeys();
                                    const oCalendarDatesBinding = oCalendar.getBinding("specialDates");
                                    const oPlanningCalendarRowBinding = oPlanningCalendar.getBinding("rows");

                                    const sSelectedTeam = oTeamComboBox.getSelectedKey();

                                    var oFilters = [];

                                    if (sSelectedTeam) {
                                        oFilters.push(new Filter("team_id", FilterOperator.EQ, sSelectedTeam));
                                    }

                                    if (!bHasSelectedAll && oSelectedKeys.length > 0) {
                                        oFilters.push(new Filter({
                                            filters: oSelectedKeys.map(function (sSelectedKey) {
                                                return new Filter("owner_id", FilterOperator.EQ, sSelectedKey);
                                            })
                                        }));
                                    }

                                    if (oFilters.length > 0) {
                                        const oFilter = new Filter({
                                            filters: oFilters,
                                            and: true
                                        });
                                        oCalendarDatesBinding.filter([oFilter]);
                                        oPlanningCalendarRowBinding.filter([oFilter]);
                                    }
                                    else {
                                        oCalendarDatesBinding.filter([]);
                                        oPlanningCalendarRowBinding.filter([]);
                                    }

                                    this._prepareCalendarDateTooltips(oAbsencesModel.getData(), oTeamComboBox, oUserComboBox);
                                }.bind(this)
                            });

                            const oFilterBar = new FilterBar({
                                showGoButton: false,
                                filterItems:
                                    [
                                        new FilterField({
                                            label: "Team",
                                            propertyKey: "team",
                                            contentEdit: oTeamComboBox
                                        }),
                                        new FilterField({
                                            label: "User",
                                            propertyKey: "user",
                                            contentEdit: oUserComboBox
                                        })
                                    ]
                            });
                            oFilterBar.addStyleClass("sapUiSmallMargin");
                            oFilterBar.setModel(oTeamsModel, "teams");
                            oFilterBar.setModel(oUsersModel, "users");
                            oFilterBar.placeAt(oCustomContainer);

                            const oCalendar = new Calendar({
                                width: "100%",
                                months: 3,
                                showCurrentDateButton: true,
                                showWeekNumbers: false,
                                firstDayOfWeek: 1,
                                specialDates:
                                {
                                    path: 'absences>/',
                                    length: 999999,
                                    template: new DateTypeRange({
                                        startDate: '{absences>start_date_object}',
                                        endDate: '{absences>end_date_object}',
                                        type: {
                                            path: 'absences>is_bank_holiday',
                                            formatter: function (bIsBankHoliday) {
                                                if (bIsBankHoliday) {
                                                    return "NonWorking";
                                                }
                                                else {
                                                    return "Type03";
                                                }
                                            }
                                        }
                                    })
                                },
                                startDateChange: function (oEvent) {
                                    this._prepareCalendarDateTooltips(oAbsencesModel.getData(), oTeamComboBox, oUserComboBox);
                                }.bind(this)
                            });
                            oCalendar.setModel(oAbsencesModel, "absences");
                            this._prepareCalendarDateTooltips(oAbsencesModel.getData(), oTeamComboBox, oUserComboBox);

                            const oAbsencesDetailModel = new JSONModel();
                            this._prepareAbsenceDetailModel(oAbsencesModel.getData(), oAbsencesDetailModel);

                            const oCalendarAppointmentTitleBindingInfo = {
                                parts: ["absences_detail>absence_name", "absences_detail>duration_days_number"],
                                formatter: function (sAbsenceName, iDays) {
                                    return `${sAbsenceName} (${iDays} days)`;
                                }
                            };

                            const oPlanningCalendar = new PlanningCalendar({
                                builtInViews: ["Week"],
                                firstDayOfWeek: 1,
                                showEmptyIntervalHeaders: false,
                                rows:
                                {
                                    path: "absences_detail>/",
                                    filters: [new Filter("user_name", FilterOperator.NE, "")],
                                    length: 999999,
                                    template: new PlanningCalendarRow({
                                        title: "{absences_detail>user_name}",
                                        appointments:
                                        {
                                            path: "absences_detail>absences",
                                            length: 999999,
                                            template: new CalendarAppointment({
                                                startDate: "{absences_detail>start_date_object}",
                                                endDate: "{absences_detail>end_date_object}",
                                                title: oCalendarAppointmentTitleBindingInfo,
                                                tooltip: oCalendarAppointmentTitleBindingInfo,
                                                text: {
                                                    parts: ["absences_detail>absence_type_desc", "absences_detail>absence_status_id"],
                                                    formatter: function (sAbsenceTypeDesc, sStatus) {
                                                        return `${sAbsenceTypeDesc} [${sStatus == "16000" ? 'Active' : 'Requested'}]`;
                                                    }
                                                },
                                                color: "{absences_detail>absence_type_color}"
                                            }),
                                            templateShareable: false
                                        }
                                    }),
                                    templateShareable: false,
                                    sorter: [new Sorter("user_name")]
                                }
                            });
                            oPlanningCalendar.setModel(oAbsencesDetailModel, "absences_detail");

                            const oCalendarViewTabBar = new IconTabBar({
                                expandable: false,
                                select: function (oEvent) {
                                    this._prepareCalendarDateTooltips(oAbsencesModel.getData(), oTeamComboBox, oUserComboBox);
                                }.bind(this),
                                items:
                                    [
                                        new IconTabFilter({
                                            text: "Calendar (Summarized)",
                                            icon: "sap-icon://accelerated",
                                            design: "Horizontal",
                                            content: oCalendar
                                        }),

                                        new IconTabFilter({
                                            text: "Calendar (Detailed)",
                                            icon: "sap-icon://check-availability",
                                            design: "Horizontal",
                                            content: new ScrollContainer({
                                                content: [oPlanningCalendar],
                                                vertical: true,
                                                height: "70vh"
                                            })
                                        })

                                    ]
                            });
                            oCalendarViewTabBar.placeAt(oCustomContainer);

                            setTimeout(() => {
                                $(".ZZ_Absence_ParamsForm .sapUiFormTitle").hide();
                                BusyIndicator.hide();
                            });
                        },

                        _prepareCalendarDateTooltips: async function (oAbsences, oTeamComboBox, oUserComboBox) {
                            do {
                                if ($(".sapUiCalItem").length > 0) {
                                    break;
                                }
                                else {
                                    const oDeferred = $.Deferred();
                                    const oPromise = oDeferred.promise();
                                    setTimeout(() => { oDeferred.resolve(); }, 10);
                                    await oPromise;
                                }
                            } while (true);

                            setTimeout(function () {
                                const oSelectedUsers = oUserComboBox.getSelectedKeys();
                                const sSelectedTeam = oTeamComboBox.getSelectedKey();

                                $(".sapUiCalItem").each(function (oCalendarItem) {
                                    const sSAPDate = $(this).attr('data-sap-day');
                                    const sYear = sSAPDate.substring(0, 4);
                                    const sMonth = sSAPDate.substring(4, 6);
                                    const sDay = sSAPDate.substring(6, 8);
                                    const sDate = `${sYear}-${sMonth}-${sDay}T00:00:00`;
                                    const oDate = new Date(sDate);
                                    const oAbsencesInDate = oAbsences.filter(function (oAbsence) {
                                        return (
                                            oAbsence.start_date_object.getTime() <= oDate.getTime()
                                            &&
                                            oAbsence.end_date_object.getTime() >= oDate.getTime()
                                            &&
                                            (
                                                oSelectedUsers.length == 0
                                                ||
                                                oSelectedUsers.some((sUser) => sUser == oAbsence.owner_id)
                                            )
                                            &&
                                            (
                                                (
                                                    sSelectedTeam
                                                    &&
                                                    oAbsence.team_id == sSelectedTeam
                                                )
                                                ||
                                                (
                                                    !sSelectedTeam
                                                )
                                            )
                                        );
                                    });

                                    var sTooltipText = "";
                                    oAbsencesInDate.forEach(function (oAbsence) {
                                        if (sTooltipText) {
                                            sTooltipText += '\n';
                                        }
                                        if (oAbsence.user_name) {
                                            // normal absence
                                            sTooltipText += `${oAbsence.user_name} (${oAbsence.absence_name})`;
                                        }
                                        else {
                                            // bank holiday
                                            sTooltipText += `::: Bank Holiday - ${oAbsence.absence_name} :::`;
                                        }
                                    });

                                    $(this).attr('title', sTooltipText);
                                });
                            });
                        },

                        _prepareAbsenceDetailModel: function (oAbsences, oAbsenceDetailModel) {
                            const oAbsencesDetail = [];

                            oAbsences.forEach(function (oAbsence) {
                                const oAbsenceDetail = oAbsencesDetail.find(function (oAbsenceDetail) {
                                    return oAbsenceDetail.user_name == oAbsence.user_name
                                });

                                if (oAbsenceDetail) {
                                    oAbsenceDetail.absences.push(oAbsence);
                                }
                                else {
                                    oAbsencesDetail.push({
                                        user_name: oAbsence.user_name,
                                        owner_id: oAbsence.owner_id,
                                        team_id: oAbsence.team_id,
                                        absences: [oAbsence]
                                    });
                                }
                            });

                            oAbsenceDetailModel.setData(oAbsencesDetail);
                        }
                    };

                    oCore.run();
                });
                break;
            // <<<< LIST ABSENCES

            // >>>> CREATE ABSENCES
            case "/intranet-timesheet2/absences/new":

                $(".fullwidth-list, .footer_hack, #footer").hide();

                await oPromiseUI5;

                await Promise.all([
                    sap.ui.core.Lib.load("sap.m"),
                    sap.ui.core.Lib.load("sap.ui.core"),
                    sap.ui.core.Lib.load("sap.ui.unified"),
                    sap.ui.core.Lib.load("sap.ui.layout")
                ]);

                sap.ui.define("com.perezjquim.syswiseportal.absences", [
                    "sap/ui/model/json/JSONModel",
                    "sap/ui/unified/DateTypeRange",
                    "sap/ui/core/BusyIndicator",
                    "sap/ui/layout/form/SimpleForm",
                    "sap/m/Label",
                    "sap/m/ComboBox",
                    "sap/ui/core/Item",
                    "sap/m/Input",
                    "sap/m/DateRangeSelection",
                    "sap/m/Button",
                    "sap/m/MessageToast"
                ], async function (JSONModel, DateTypeRange, BusyIndicator, SimpleForm, Label, ComboBox, Item, Input, DateRangeSelection, Button, MessageToast) {
                    const oCore = {
                        run: function () {
                            this._renderAbsenceCreationForm();
                        },

                        _renderAbsenceCreationForm: async function () {
                            BusyIndicator.show(0);

                            const oCustomContainer = $(`<div class='sapUiSizeCompact'/>`).appendTo($("body")).get(0);

                            const oNewAbsenceModel = new JSONModel({
                                "Type": "5000", // vacation as default
                                "StartDate": new Date(),
                                "EndDate": new Date()
                            });

                            const oCurrentDate = new Date();
                            const oBegOfYearDate = new Date(oCurrentDate.getFullYear() - 1, 1, 1);
                            const sMinDate = oBegOfYearDate.toJSON().substring(0, 10);

                            const sBankHolidaysReqUrl = `/intranet-rest/im_user_absence?format=json&query=end_date > '${sMinDate}' and absence_type_id = 5005`;
                            const oBankHolidaysReq = await fetch(sBankHolidaysReqUrl);
                            const oBankHolidays = await oBankHolidaysReq.json();
                            const oBankHolidaysFinal = oBankHolidays.data.map(function (oBankHoliday) {
                                const oStartDate = new Date(`${oBankHoliday.start_date.substring(0, 10)}T00:00:00`);
                                const oEndDate = new Date(`${oBankHoliday.end_date.substring(0, 10)}T00:00:00`);

                                return Object.assign(oBankHoliday, {
                                    start_date_object: oStartDate,
                                    end_date_object: oEndDate
                                });
                            });
                            const oBankHolidaysModel = new JSONModel(oBankHolidaysFinal);

                            const oAbsenceTypes = $("[name='absence_type_id'] option")
                                .toArray()
                                .filter(function (oOption) {
                                    return !!oOption.value
                                })
                                .map(function (oOption) {
                                    return {
                                        absence_type_id: oOption.value,
                                        absence_type_name: oOption.innerText.trim()
                                    };
                                });
                            const oAbsenceTypeModel = new JSONModel(oAbsenceTypes);

                            const oReplacements = $("[name='vacation_replacement_id'] option")
                                .toArray()
                                .filter(function (oOption) {
                                    return !!oOption.value
                                })
                                .map(function (oOption) {
                                    return {
                                        replacement_id: oOption.value,
                                        replacement_name: oOption.innerText.trim()
                                    };
                                });
                            const oReplacementModel = new JSONModel(oReplacements);

                            const oCreationForm = new SimpleForm({
                                editable: true,
                                emptySpanXL: 2,
                                title: "New Absence",
                                content: [
                                    new Label({ text: "Absence description", required: true }),
                                    new Input({
                                        value: "{new_absence>/Description}",
                                        maxLength: 40,
                                        change: this.onAbsenceDescriptionChange.bind(this)
                                    }),

                                    new Label({ text: "Absence type", required: true }),
                                    new ComboBox({
                                        selectedKey: "{new_absence>/Type}",
                                        items: {
                                            path: 'absence_types>/',
                                            template: new Item({
                                                key: "{absence_types>absence_type_id}",
                                                text: "{absence_types>absence_type_name}"
                                            })
                                        },
                                        change: this.onAbsenceTypeChange.bind(this)
                                    }),

                                    new Label({ text: "Absence period", required: true }),
                                    new DateRangeSelection({
                                        minDate: new Date(sMinDate),
                                        showCurrentDateButton: true,
                                        dateValue: "{new_absence>/StartDate}",
                                        secondDateValue: "{new_absence>/EndDate}",
                                        change: this.onAbsencePeriodChange.bind(this),
                                        specialDates:
                                        {
                                            path: 'bank_holidays>/',
                                            length: 999999,
                                            template: new DateTypeRange({
                                                startDate: '{bank_holidays>start_date_object}',
                                                endDate: '{bank_holidays>end_date_object}',
                                                type: "Type03"
                                            })
                                        }
                                    }),
                                    new Input({
                                        type: "Number",
                                        value: "{new_absence>/Duration}",
                                        description: "days",
                                        change: this.onAbsenceDurationChange.bind(this)
                                    }),

                                    new Label({ text: "Replacement" }),
                                    new ComboBox({
                                        selectedKey: "{new_absence>/Replacement}",
                                        items: {
                                            path: 'replacements>/',
                                            template: new Item({
                                                key: "{replacements>replacement_id}",
                                                text: "{replacements>replacement_name}"
                                            })
                                        },
                                        change: this.onReplacementChange.bind(this)
                                    }),

                                    new Label(),
                                    new Button({
                                        type: "Accept",
                                        icon: "sap-icon://save",
                                        text: "Confirm",
                                        press: this.onSaveAbsence.bind(this)
                                    }),
                                    new Button({
                                        type: "Reject",
                                        icon: "sap-icon://cancel",
                                        text: "Cancel",
                                        press: this.onCancelAbsence.bind(this)
                                    })
                                ]
                            });
                            oCreationForm.setModel(oNewAbsenceModel, "new_absence");
                            oCreationForm.setModel(oAbsenceTypeModel, "absence_types");
                            oCreationForm.setModel(oBankHolidaysModel, "bank_holidays");
                            oCreationForm.setModel(oReplacementModel, "replacements");
                            oCreationForm.placeAt(oCustomContainer);

                            setTimeout(() => BusyIndicator.hide());
                        },

                        onAbsenceDescriptionChange: function (oEvent) {
                            const sNewValue = oEvent.getParameter("newValue");
                            $("[name='absence_name']").val(sNewValue);
                        },

                        onAbsenceTypeChange: function (oEvent) {
                            const oSource = oEvent.getSource();
                            const sSelectedKey = oSource.getSelectedKey();
                            $("[name='absence_type_id']").val(sSelectedKey);
                        },

                        onAbsencePeriodChange: function (oEvent) {
                            const oSource = oEvent.getSource();
                            const oNewAbsenceModel = oSource.getModel("new_absence");
                            const oBankHolidaysModel = oSource.getModel("bank_holidays");

                            const oStartDate = oEvent.getParameter("from");
                            this._setDate("start_date", oStartDate);

                            const oEndDate = oEvent.getParameter("to");
                            this._setDate("end_date", oEndDate);

                            this._determineDuration(oStartDate, oEndDate, oNewAbsenceModel, oBankHolidaysModel);
                        },

                        onAbsenceDurationChange: function (oEvent) {
                            const iNewValue = Number(oEvent.getParameter("newValue") || 0);
                            $("[name='duration_days']").val(iNewValue);
                        },

                        onReplacementChange: function (oEvent) {
                            const oSource = oEvent.getSource();
                            const sSelectedKey = oSource.getSelectedKey();
                            $("[name='vacation_replacement_id']").val(sSelectedKey);
                        },

                        onSaveAbsence: function (oEvent) {
                            const oSource = oEvent.getSource();
                            const oNewAbsenceModel = oSource.getModel("new_absence");
                            const bIsDataFilled = (
                                oNewAbsenceModel.getProperty("/Description")
                                &&
                                oNewAbsenceModel.getProperty("/Type")
                                &&
                                oNewAbsenceModel.getProperty("/StartDate")
                                &&
                                oNewAbsenceModel.getProperty("/EndDate")
                                &&
                                oNewAbsenceModel.getProperty("/Duration")
                            );

                            if (bIsDataFilled) {
                                $("[name='formbutton:ok']").click();
                            }
                            else {
                                MessageToast.show("Please fill in all the required fields.");
                            }
                        },

                        onCancelAbsence: function (oEvent) {
                            $("[name='formbutton:cancel']").click()
                        },

                        _setDate: function (sName, oDate) {
                            $(`[name='${sName}.year']`).val(oDate && oDate.getFullYear());
                            $(`[name='${sName}.month']`).val((oDate && oDate.getMonth()) + 1);
                            $(`[name='${sName}.day']`).val(oDate && oDate.getDate());
                        },

                        _determineDuration: function (oStartDate, oEndDate, oNewAbsenceModel, oBankHolidaysModel) {
                            const oBankHolidays = oBankHolidaysModel.getData();

                            var iDays = 0;

                            var oDate = new Date(oStartDate);

                            while (oDate <= oEndDate) {
                                const iWeekDay = oDate.getDay();
                                const bIsWeekendDay = (iWeekDay == 0 || iWeekDay == 6);
                                const bIsBankHoliday = oBankHolidays.some(function (oBankHoliday) {
                                    return oBankHoliday.start_date_object.toDateString() == oDate.toDateString();
                                });

                                if (!bIsWeekendDay && !bIsBankHoliday) {
                                    iDays++;
                                }

                                oDate.setDate(oDate.getDate() + 1);
                            }

                            $("[name='duration_days']").val(iDays);
                            oNewAbsenceModel.setProperty("/Duration", iDays);
                        },

                    };

                    oCore.run();
                });
                break;
            // <<<< CREATE ABSENCES
        }

    });

})();