// ==UserScript==
// @name         SYSWISE Portal - UI tweaks
// @namespace    http://office.syswise.com/
// @version      0.1.17
// @description  SYSWISE Portal - Userscript for UI tweaks
// @author       joaquim.perez@syswise.com
// @match        http://office.syswise.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syswise.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535233/SYSWISE%20Portal%20-%20UI%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/535233/SYSWISE%20Portal%20-%20UI%20tweaks.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    setTimeout(async function () {

        const oWhitelistedUsers = [
            "Sm9hcXVpbSBQZXJleg==",
            "QWlydG9uIENhbWJvYQ==",
            "TnVubyBBZm9uc28=",
            "TnVubyBHYXNwYXI=",
            "UGVkcm8gRmFyaWFz",
            "U29maWEgIFJpYmFz",
            "R2zzcmlhIFNpbHZh",
            "TWFyaWEgU2VjYQ=="
        ];
        const sWelcomeText = $(".header_welcome").text();
        const bIsUserAllowed = oWhitelistedUsers.some(function (sWhitelistedUser) {
            return sWelcomeText.includes(atob(sWhitelistedUser));
        });
        if (!bIsUserAllowed) {
            return;
        }

        /**************************/
        /***** GENERAL TWEAKS *****/
        /**************************/
        const oNoSlavePages = [
            /\/intranet-timesheet2\//,
            /\/intranet-reporting\/$/,
            /\/intranet\//
        ];

        const bShouldHideSlave = oNoSlavePages.some(function (sNoSlavePage) {
            return window.location.pathname.match(sNoSlavePage);
        });
        if (bShouldHideSlave) {
            $("#slave").hide();
            $(".fullwidth-list").css('margin', 0);
        }

        if (window.location == window.parent.location) {
            $("body").css({
                'background-image': "url('https://syswise.com/images/1920x720_1.jpg')",
                'background-color': "rgba(240, 250, 230, 0.8)",
                'background-blend-mode': 'lighten'
            });
        }

        $("#intranetlogo").attr('src', 'https://i.imgur.com/aKmS3HN.png');

        $("#header_logo").css('z-index', 'initial');

        $("#header_class, .header_line, #navbar_main, #navbar_main_wrapper, #navbar_sub_wrapper, #monitor_frame, form, tr:not(.day_header)").css('background', 'none');

        $("html, body").css('height', '100%');

        $("form, .filter").css('background', 'rgba(255,255,255,0.25)');

        $(".day_number").css('font-size', '190%');

        const oTabsToHide = [
            "/intranet-crm-opportunities/",
            "/intranet-portfolio-management/",
            "/intranet/master-data"
        ];

        oTabsToHide.forEach(function (sTabToHide) {
            $(`#navbar_main li:has(a[href='${sTabToHide}'])`).hide();
        });

        const oDeferredUI5 = $.Deferred();
        const oPromiseUI5 = oDeferredUI5.promise();

        const oUI5TimestampReq = await fetch("https://sdk.openui5.org/resources/sap-ui-cachebuster");
        const sUI5Timestamp = await oUI5TimestampReq.text();
        $.ajaxSetup({ cache: true });
        $.getScript(`https://openui5.hana.ondemand.com/resources/${sUI5Timestamp}/sap-ui-core.js`, function () {
            oDeferredUI5.resolve();
        });

        await oPromiseUI5;

        $("body, p, td, #navbar_main_wrapper").css('font-family', "var(--sapFontFamily)");

        await Promise.all([
            sap.ui.core.Lib.load("sap.ui.core"),
            sap.ui.core.Lib.load("sap.m"),
            sap.ui.core.Lib.load("sap.f")
        ]);

        sap.ui.define("com.perezjquim.syswiseportal.uitweaks", [
            "sap/ui/core/BusyIndicator",
            "sap/ui/model/json/JSONModel",
            "sap/m/OverflowToolbar",
            "sap/m/MenuButton",
            "sap/m/Menu",
            "sap/m/MenuItem",
            "sap/m/SearchField",
            "sap/f/ShellBar"
        ], function (BusyIndicator, JSONModel, OverflowToolbar, MenuButton, Menu, MenuItem, SearchField, ShellBar) {

            const oCore = {

                run: function () {
                    $(window).on('beforeunload', function () {
                        BusyIndicator.show(0);
                    });

                    //this._renderShellBar();
                    this._renderMenu();
                    this._renderSearchField();

                    $("#footer, .footer_hack").hide();
                },

                _renderShellBar: function () {
                    const oShellBar = new ShellBar({
                        homeIcon: "https://i.imgur.com/aKmS3HN.png",
                        additionalContent: [
                            new SearchField({
                                search: function (oEvent) {
                                    const sSearchQuery = oEvent.getParameter("query");
                                    $("input[name='query_string']").val(sSearchQuery);
                                    $("input[alt='Go']").click();
                                }
                            })
                        ]
                    });
                    oShellBar.addStyleClass("ZZ_ShellBar");

                    const oCustomContainer = (($("body").prepend(`<div class='sapUiSizeCompact'/>`)).get(0)).firstChild;
                    oShellBar.placeAt(oCustomContainer);

                    $(`
                       <style>
                          .ZZ_ShellBar
                          {
                            background-color: #5dac96;
                          }
                          .ZZ_ShellBar .sapFShellBarHomeIcon:hover
                          {
                            background-color: #4e9883;
                          }
                       </style>
                      `
                    ).appendTo("head");
                },

                _renderMenu: async function () {
                    const oIconMapping = {
                        "/intranet/": "sap-icon://home",
                        "/intranet/projects/": "sap-icon://collaborate",
                        "/intranet-helpdesk/": "sap-icon://crm-service-manager",
                        "/intranet-timesheet2/hours/index": "sap-icon://timesheet",
                        "/intranet-timesheet2/absences/index": "sap-icon://time-off",
                        "/intranet-expenses/": "sap-icon://expense-report",
                        "/intranet-reporting/": "sap-icon://manager-insight",
                        "/intranet/users/view": "sap-icon://user-settings"
                    };

                    const oVisibleMenuItems = Array.from($("#navbar_main > li:visible"));

                    const oExtraMenuItems = [
                        {
                            href: "https://app.smartsheet.com/sheets/gxhVgc2x4q7x6gJ2PpvjHfCvjv2J5p9QCVjFHgF1?view=card&cardLevel=0&cardViewByColumnId=8624564584376196",
                            text: "ABAP Smartsheet",
                            sub_menu_items: [
                                {
                                    href: "https://app.smartsheet.com/b/form/74b2c1cc2b6040ffaf5eaec29cfeb507",
                                    text: "ABAP Smartsheet - Submit a new request"
                                },
                                {
                                    href: "https://app.smartsheet.com/sheets/gxhVgc2x4q7x6gJ2PpvjHfCvjv2J5p9QCVjFHgF1?view=card&cardLevel=0&cardViewByColumnId=8624564584376196",
                                    text: "ABAP Smartsheet - Browse"
                                }
                            ]
                        },
                        {
                            href: "https://sapwisept.sharepoint.com/sites/ShareWise2/Documentos%20Partilhados/Forms/AllItems.aspx?viewid=b7252a06%2D60e7%2D4e18%2D9438%2D26b48b5e4c89",
                            text: "ShareWise",
                            sub_menu_items: [
                                {
                                    href: "https://sapwisept.sharepoint.com/sites/ShareWise2/Documentos%20Partilhados/Forms/AllItems.aspx?viewid=b7252a06%2D60e7%2D4e18%2D9438%2D26b48b5e4c89",
                                    text: "ShareWise - Home"
                                },
                                {
                                    href: "https://sapwisept.sharepoint.com/sites/ShareWise2/Documentos%20Partilhados/Forms/AllItems.aspx?id=%2Fsites%2FShareWise2%2FDocumentos%20Partilhados%2FCustomer%20Support&viewid=b7252a06%2D60e7%2D4e18%2D9438%2D26b48b5e4c89",
                                    text: "ShareWise - Customer Support"
                                }
                            ]
                        }
                    ];

                    const oMenuItemsFinal = oVisibleMenuItems.map(function (oMenuItem) {
                        const oSubMenuItems = oMenuItem.children[1] && Array.from(oMenuItem.children[1].children).map(function (oSubMenuItem) {
                            const oSubSubMenuItems = oSubMenuItem.children[1] && Array.from(oSubMenuItem.children[1].children).map(function (oSubSubMenuItem) {
                                return {
                                    href: oSubSubMenuItem.children[0].href.replace(oSubSubMenuItem.children[0].origin, ""),
                                    text: oSubSubMenuItem.children[0].innerText
                                }
                            });
                            return {
                                href: oSubMenuItem.children[0].href.replace(oSubMenuItem.children[0].origin, ""),
                                text: oSubMenuItem.children[0].innerText.replace("+", "").trim(),
                                sub_menu_items: oSubSubMenuItems
                            }
                        });
                        return {
                            href: oMenuItem.children[0].href.replace(oMenuItem.children[0].origin, ""),
                            text: oMenuItem.children[0].children[1].innerText,
                            sub_menu_items: oSubMenuItems
                        };
                    }).concat(oExtraMenuItems);

                    const oMenuItemsModel = new JSONModel(oMenuItemsFinal);

                    const fnOnPressMenuItem = function (oEvent) {
                        const oSource = oEvent.getSource();
                        const oContext = oSource.getBindingContext("menu_items");
                        const sHref = oContext.getProperty("href");
                        window.location.href = sHref;
                    };

                    const oToolbar = new OverflowToolbar({
                        content:
                        {
                            path: 'menu_items>/',
                            template: new MenuButton({
                                text: '{menu_items>text}',
                                icon:
                                {
                                    path: 'menu_items>href',
                                    formatter: function (sHref) {
                                        return oIconMapping[sHref];
                                    }
                                },
                                type:
                                {
                                    parts: ['menu_items>href', 'menu_items>sub_menu_items'],
                                    formatter: function (sHref, oSubMenuItems) {
                                        if
                                            (
                                            window.location.pathname == sHref
                                            ||
                                            oSubMenuItems && oSubMenuItems.some(oItem => window.location.pathname == oItem.href)
                                            ||
                                            oSubMenuItems && oSubMenuItems.some(oItem => oItem.sub_menu_items && oItem.sub_menu_items.some(oSubItem => window.location.pathname == oSubItem.href))
                                        ) {
                                            return "Emphasized";
                                        }
                                    }
                                },
                                buttonMode: "Split",
                                defaultAction: fnOnPressMenuItem,
                                useDefaultActionOnly: true,
                                menu: new Menu({
                                    items: {
                                        path: 'menu_items>sub_menu_items',
                                        template: new MenuItem({
                                            text: '{menu_items>text}',
                                            press: fnOnPressMenuItem,
                                            items:
                                            {
                                                path: 'menu_items>sub_menu_items',
                                                template: new MenuItem({
                                                    text: '{menu_items>text}',
                                                    press: fnOnPressMenuItem,
                                                }),
                                                templateShareable: false
                                            }
                                        }),
                                        templateShareable: false
                                    }
                                })
                            }),
                            templateShareable: false
                        }
                    });

                    oToolbar.setModel(oMenuItemsModel, "menu_items");
                    const oCustomContainer_Toolbar = (($("#navbar_main_wrapper").prepend(`<div class='sapUiSizeCompact'/>`)).get(0)).firstChild;
                    oToolbar.placeAt(oCustomContainer_Toolbar);
                    $("#navbar_main").hide();
                },

                _renderSearchField: function () {
                    const oSearchField = new SearchField({
                        width: "25rem",
                        search: function (oEvent) {
                            const sSearchQuery = oEvent.getParameter("query");
                            $("input[name='query_string']").val(sSearchQuery);
                            $("input[alt='Go']").click();
                        }
                    });

                    const oCustomContainer_Search = (($("[action='/intranet/search/go-search']").prepend(`<div class='sapUiSizeCompact'/>`)).get(0)).firstChild;
                    oSearchField.placeAt(oCustomContainer_Search);
                    $("input[name='query_string']").hide();
                    $("input[alt='Go']").hide();
                }

            };

            oCore.run();

        });
        /*********************************************************************************************************************************************************/
        /*********************************************************************************************************************************************************/
        /*********************************************************************************************************************************************************/

        /**************************/
        /***** ABSENCE TWEAKS *****/
        /**************************/
        switch (window.location.pathname) {
            // >>>> LIST ABSENCES
            case "/intranet-timesheet2/absences/index":

                $(".fullwidth-list, .footer_hack, #footer").hide();

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
                ], async function (Calendar, JSONModel, DateTypeRange, Sorter, Filter, FilterOperator, BusyIndicator, MultiComboBox, Item, PlanningCalendar, PlanningCalendarRow, CalendarAppointment, IconTabBar, IconTabFilter, FilterBar, FilterField, ComboBox, ScrollContainer) {
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
                                                        return `${sAbsenceTypeDesc} [${sStatus == "16000" ? 'Approved ✅' : 'Requested 🟡'}]`;
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

                const oSearchParams = new URLSearchParams(window.location.search);
                const sFormMode = oSearchParams.get('form_mode');
                const sAbsenceId = oSearchParams.get('absence_id');

                switch (true) {
                    case (sAbsenceId && sFormMode == "display"):
                        //TODO - display detail
                        break;

                    case (!sAbsenceId):
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

                }
                break;
            // <<<< CREATE ABSENCES
        }
        /*********************************************************************************************************************************************************/
        /*********************************************************************************************************************************************************/
        /*********************************************************************************************************************************************************/

        /****************************/
        /***** TIMESHEET TWEAKS *****/
        /****************************/
        const TEMP_HOURS_PATTERNS = [
            "ticket not created yet",
            "CHGX",
            "INCX",
            "!",
            "?"
        ];

        switch (window.location.pathname) {

            case "/intranet-timesheet2/hours/index": // timesheet calendar

                $(".link_log_hours br:nth-child(n+3)").hide();
                $(".link_log_hours a:nth-child(n+2)").hide();
                $(".link_log_hours:has(a[href*='absences'])").css('background', 'linear-gradient(palevioletred,lightyellow,whitesmoke)');

                await Promise.all([
                    sap.ui.core.Lib.load("sap.m"),
                    sap.ui.core.Lib.load("sap.ui.core"),
                    sap.ui.core.Lib.load("sap.ui.layout")
                ]);

                sap.ui.define("com.perezjquim.syswiseportal.timesheettweaks", [
                    "sap/m/Dialog",
                    "sap/m/Button",
                    "sap/ui/core/HTML",
                    "sap/m/MessageToast",
                    "sap/m/Input",
                    "sap/ui/model/json/JSONModel",
                    "sap/ui/core/Item",
                    "sap/m/MessageStrip",
                ], function (Dialog, Button, HTML, MessageToast, Input, JSONModel, Item, MessageStrip) {

                    const oCore = {

                        run: function () {
                            this._prepareTempHoursMessageStrip();
                            this._addExtraHoursButtons();
                        },

                        _prepareTempHoursMessageStrip: async function () {
                            const sUrl = `/intranet-reporting/timesheet-customer-project?preconf=my_hours`;

                            const oTimesheetReq = await fetch(sUrl);
                            const sTimesheetDOM = await oTimesheetReq.text();
                            const oTimesheet = $($.parseHTML(sTimesheetDOM));
                            const oTimesheetTable = (oTimesheet.find('.table_list_simple tbody').toArray())[0];

                            const oTempHours = Array.from(oTimesheetTable.children).filter(function (oTimesheetEntry) {
                                const sTimesheetEntry = oTimesheetEntry.innerText;
                                return TEMP_HOURS_PATTERNS.some(function (sTempHoursSubstring) {
                                    return sTimesheetEntry.includes(sTempHoursSubstring);
                                });
                            }.bind(this));

                            if (oTempHours.length > 0) {
                                const oCustomContainer = (($(".fullwidth-list").prepend(`<div class='sapUiSizeCompact'/>`)).get(0)).firstChild;

                                const oTempHoursFinal = oTempHours.map(function (oTempHour) {
                                    const sDate = oTempHour.children[4].innerText;
                                    const sNotes = oTempHour.children[6].innerText;
                                    return `${sDate} > ${sNotes}`
                                });

                                const oMessageStrip = new MessageStrip({
                                    type: "Warning",
                                    showIcon: true,
                                    enableFormattedText: true,
                                    text: `Temporary hours: <br/>${oTempHoursFinal.join('<br/>')}`
                                });

                                oMessageStrip.placeAt(oCustomContainer);
                            }
                        },

                        _addExtraHoursButtons: async function () {
                            const oProjectsReq = await fetch("/intranet-rest/im_project/?format=json&query=parent_id%20is%20null%20and%20project_status_id%20=%2076");
                            const oProjects = await oProjectsReq.json();

                            const oDays = $(".link_log_hours").toArray();
                            oDays.forEach(async function (oDay) {
                                const oCustomContainer = $(`<div style='margin-right:1rem;' class='sapUiSizeCompact'/>`).appendTo(oDay).get(0);

                                const oCheckHoursButton = this._prepareCheckHoursButton(oDay);
                                oCheckHoursButton.placeAt(oCustomContainer);

                                if (!oDay.innerHTML.includes("hours_confirmed_red")) {
                                    oCheckHoursButton.setEnabled(false);
                                }

                                const oLogHoursButton = this._prepareLogHoursButton(oDay, oProjects);
                                oLogHoursButton.placeAt(oCustomContainer);
                            }.bind(this));
                        },

                        _prepareCheckHoursButton: function (oDay) {
                            const oCheckHoursButton = new Button({
                                width: "10vw",
                                icon: "sap-icon://check-availability",
                                text: "Check hours",
                                press: async function (oEvent) {
                                    const oSource = oEvent.getSource();
                                    const oLogHoursURL = new URL(oDay.firstChild.href);
                                    const sJulianDate = oLogHoursURL.searchParams.get("julian_date");
                                    const sNextJulianDate = String(Number(sJulianDate) + 1);

                                    const oDate = new Date((sJulianDate - 2440587.5) * 86400000);
                                    const sDate = oDate.toISOString().split('T')[0];

                                    const oNextDate = new Date((sNextJulianDate - 2440587.5) * 86400000);
                                    const sNextDate = oNextDate.toISOString().split('T')[0];

                                    const oOwnUserAnchor = $("a[href*='/intranet/users/password-update']").get(0);
                                    const oOwnUserAnchorSearch = new URLSearchParams(oOwnUserAnchor.search);
                                    const sOwnUserId = oOwnUserAnchorSearch.get('user_id');

                                    const sUrl = `/intranet-reporting/timesheet-customer-project?level_of_detail=5&start_date=${sDate}&end_date=${sNextDate}&user_id=${sOwnUserId}`;

                                    const oTimesheetReq = await fetch(sUrl);
                                    const sTimesheetDOM = await oTimesheetReq.text();
                                    const oTimesheet = $($.parseHTML(sTimesheetDOM));
                                    const oTimesheetTable = (oTimesheet.find('.table_list_simple tbody').toArray())[0];

                                    const oDialog = new Dialog({
                                        title: oSource.getText(),
                                        icon: oSource.getIcon(),
                                        contentWidth: "50vw",
                                        contentHeight: "75vh",
                                        busyIndicatorDelay: 0,
                                        content: new HTML({
                                            content: `<iframe id='check-hours-iframe' src='${sUrl}' style='border:none;width: 74vw;height: 72vh;'/>`,
                                            afterRendering: function (oEvent) {
                                                const oIframe = $("#check-hours-iframe");
                                                oIframe.on('load', function () {
                                                    const oContents = oIframe.contents();
                                                    oContents.find("#header_class, #main, #slave, .footer_hack, #footer, .component_header_rounded").hide();
                                                    oContents.find("body").css({
                                                        'background': 'none'
                                                    });
                                                    oContents.find(".fullwidth-list, #monitor_frame, .component, .component_body, .table_list_simple").css({
                                                        'margin': 0,
                                                        'padding': 0
                                                    });
                                                    oContents.find("a").css({
                                                        'cursor': 'auto'
                                                    });

                                                    setTimeout(() => oDialog.setBusy(false));
                                                });
                                            }
                                        }),
                                        beginButton: new Button({
                                            text: "Close",
                                            press: function () {
                                                oDialog.close();
                                            }
                                        }),
                                        afterClose: function () {
                                            oDialog.destroy();
                                        }
                                    });

                                    oDialog.setBusy(true);

                                    oDialog.open();
                                }
                            });
                            return oCheckHoursButton;
                        },

                        _prepareLogHoursButton: function (oDay, oProjects) {
                            const oLogHoursButton = new Button({
                                width: "10vw",
                                icon: "sap-icon://edit",
                                text: "Log hours",
                                press: async function (oEvent) {
                                    const oSource = oEvent.getSource();
                                    const oLogHoursURL = new URL(oDay.firstChild.href);

                                    const onConfirm = function () {
                                        const sTaskName = oInput.getValue();
                                        if (sTaskName) {
                                            oLogHoursURL.searchParams.set("search_task", sTaskName);
                                            if (sTaskName.includes("CHG") || sTaskName.includes("INC") || sTaskName == "Support management") {
                                                oLogHoursURL.searchParams.set("syn", 1);
                                            }
                                            window.location.href = oLogHoursURL.href;
                                            oDialog.close();
                                        }
                                        else {
                                            MessageToast.show("Fill in all the required fields.");
                                        }
                                    };

                                    const oSuggestions = oProjects.data;
                                    const oSuggModel = new JSONModel(oSuggestions);
                                    const oInput = new Input({
                                        required: true,
                                        placeholder: "Project / INC / CHG",
                                        submit: onConfirm,
                                        showSuggestion: true,
                                        suggestionItems:
                                        {
                                            path: 'suggestions>/',
                                            length: 999999,
                                            template: new Item({
                                                text: '{suggestions>project_name}'
                                            })
                                        }
                                    });
                                    oInput.setModel(oSuggModel, "suggestions");

                                    const oDialog = new Dialog({
                                        title: oSource.getText(),
                                        icon: oSource.getIcon(),
                                        contentWidth: "20vw",
                                        contentHeight: "15vh",
                                        content: oInput,
                                        beginButton: new Button({
                                            text: "Confirm",
                                            press: onConfirm
                                        }),
                                        endButton: new Button({
                                            text: "Close",
                                            press: function () {
                                                oDialog.close();
                                            }
                                        }),
                                        afterClose: function () {
                                            oDialog.destroy();
                                        }
                                    });

                                    oDialog.open();
                                }
                            });
                            return oLogHoursButton;
                        }

                    };

                    oCore.run();
                });

                break;

            case "/intranet-timesheet2/hours/new": // log hours

                await Promise.all([
                    sap.ui.core.Lib.load("sap.m")
                ]);

                sap.ui.define("com.perezjquim.syswiseportal.timesheettweaks", [
                    "sap/m/MessageStrip"
                ], function (MessageStrip) {

                    const oCore = {

                        run: function () {
                            this._prepareTempHoursTipMessageStrip();
                        },

                        _prepareTempHoursTipMessageStrip: async function () {
                            const oCustomContainer = (($(".fullwidth-list").prepend(`<div class='sapUiSizeCompact'/>`)).get(0)).firstChild;

                            const oMessageStrip = new MessageStrip({
                                type: "Information",
                                showIcon: true,
                                enableFormattedText: true,
                                text: `In case you want to log a temporary timesheet entry, please leave one of the following notes:<br/> "${TEMP_HOURS_PATTERNS.join(" / ")}"`
                            });

                            oMessageStrip.placeAt(oCustomContainer);
                        }

                    };

                    oCore.run();
                });

                break;

            case "/intranet-helpdesk/new": // ticket detail
                const oSearchParams = new URLSearchParams(window.location.search);
                const sFormMode = oSearchParams.get('form_mode');
                const sTicketId = oSearchParams.get('ticket_id');

                switch (true) {

                    case (sTicketId && sFormMode == "display"):

                        await Promise.all([
                            sap.ui.core.Lib.load("sap.m"),
                            sap.ui.core.Lib.load("sap.ui.core"),
                            sap.ui.core.Lib.load("sap.uxap"),
                            sap.ui.core.Lib.load("sap.ui.layout")
                        ]);

                        sap.ui.define("com.perezjquim.syswiseportal.timesheettweaks", [
                            "sap/uxap/ObjectPageLayout",
                            "sap/uxap/ObjectPageHeader",
                            "sap/m/VBox",
                            "sap/m/ObjectStatus",
                            "sap/uxap/ObjectPageSection",
                            "sap/uxap/ObjectPageSubSection",
                            "sap/ui/layout/form/SimpleForm",
                            "sap/m/Label",
                            "sap/m/Text",
                            "sap/m/Button",
                            "sap/m/ProgressIndicator"
                        ], function (ObjectPageLayout, ObjectPageHeader, VBox, ObjectStatus, ObjectPageSection, ObjectPageSubSection, SimpleForm, Label, Text, Button, ProgressIndicator) {

                            const oCore = {

                                run: function () {
                                    this._renderTicketInfo(sTicketId);
                                },

                                _renderTicketInfo: async function (sTicketId) {
                                    const sAbsenceUrl = `/intranet-rest/im_ticket?format=json&ticket_id=${sTicketId}`;
                                    const oAbsenceReq = await fetch(sAbsenceUrl);
                                    const oAbsence = (await oAbsenceReq.json()).data[0];

                                    const iQuotedHoursFunc = +oAbsence.ticket_quoted_days;
                                    const iQuotedHoursDev = +oAbsence.ticket_quoted_hours_dev;
                                    const iTotalQuotedHours = iQuotedHoursFunc + iQuotedHoursDev;
                                    const iReportedHours = +oAbsence.reported_hours_cache;
                                    const iRemainingHours = iTotalQuotedHours - iReportedHours;
                                    const iBudgetLeftInPerc = iRemainingHours / iTotalQuotedHours * 100;

                                    const sSLA = $(".form-widget:has(input[name='ticket_sla_id'])").text().trim();
                                    const sTicketOwner = $(".form-widget:has(input[name='ticket_assignee'])").text().trim();

                                    const oObjectPage = new ObjectPageLayout({
                                        headerTitle: new ObjectPageHeader({
                                            objectTitle: `Ticket - ${oAbsence.object_name}`,
                                            objectSubtitle: oAbsence.ticket_description,
                                            actions: [
                                                new Button({
                                                    text: "Edit",
                                                    type: "Emphasized",
                                                    icon: "sap-icon://edit",
                                                    press: function (oEvent) {
                                                        $("[name='formbutton:edit']").click();
                                                    }
                                                }),
                                                new Button({
                                                    text: "Go to ShareWise",
                                                    type: "Emphasized",
                                                    press: function (oEvent) {
                                                        const sShareWiseTicketUrl = `https://sapwisept.sharepoint.com/sites/ShareWise2/Documentos%20Partilhados/Forms/AllItems.aspx?id=%2Fsites%2FShareWise2%2FDocumentos%20Partilhados%2FCustomer%20Support&FilterField1=ContentType&FilterValue1=Folder&FilterType1=Computed&FilterOp1=In&viewid=b7252a06%2D60e7%2D4e18%2D9438%2D26b48b5e4c89&q=${oAbsence.object_name}&view=7`;
                                                        window.open(sShareWiseTicketUrl);
                                                    }
                                                })
                                            ]
                                        }),
                                        headerContent: [
                                            new VBox({
                                                items:
                                                    [
                                                        new ObjectStatus({ title: "SLA", text: sSLA }),
                                                        new ObjectStatus({ title: "Ticket Owner", text: sTicketOwner })
                                                    ]
                                            })
                                        ],
                                        sections: [
                                            new ObjectPageSection({
                                                title: "Time Reporting",
                                                titleUppercase: false,
                                                subSections: [
                                                    new ObjectPageSubSection({
                                                        blocks: [
                                                            new SimpleForm({
                                                                labelSpanL: 4,
                                                                labelSpanM: 4,
                                                                layout: "ColumnLayout",
                                                                content: [
                                                                    new Label({ text: "Quoted Hours (Functional Consultant)" }),
                                                                    new Text({ text: `${iQuotedHoursFunc} hours` }),
                                                                    new Label({ text: "Quoted Hours (Technical Consultant)" }),
                                                                    new Text({ text: `${iQuotedHoursDev} hours` }),
                                                                    new Label({ text: "Total Quoted Hours" }),
                                                                    new Text({ text: `${iTotalQuotedHours} hours` }),
                                                                    new Label({ text: "Reported Hours" }),
                                                                    new Text({ text: `${iReportedHours} hours` }),
                                                                    new Label({ text: "Remaining Hours" }),
                                                                    new Text({ text: `${iRemainingHours} hours` }),
                                                                    new Label({ text: "Budget left (%)" }),
                                                                    new ProgressIndicator({
                                                                        percentValue: iBudgetLeftInPerc,
                                                                        displayValue: `${iBudgetLeftInPerc} %`,
                                                                        state: iBudgetLeftInPerc < 20 ? 'Warning' : 'Success'
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    });

                                    const oCustomContainer = $(`<div class='sapUiSizeCompact'/>`).appendTo($("body")).get(0);
                                    oObjectPage.placeAt(oCustomContainer);

                                    $("#fullwidth-list, #main_header, #navbar_sub_wrapper, #slave").hide();
                                }
                            };

                            oCore.run();
                        });
                        break;

                }

                break;
        }
        /*********************************************************************************************************************************************************/
        /*********************************************************************************************************************************************************/
        /*********************************************************************************************************************************************************/

    });

})();