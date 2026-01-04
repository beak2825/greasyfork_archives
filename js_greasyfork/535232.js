// ==UserScript==
// @name         **OBSOLETE** SYSWISE Portal - Timesheet tweaks
// @namespace    http://office.syswise.com/
// @version      0.1.13
// @description  **OBSOLETE** SYSWISE Portal - Userscript for Timesheet tweaks
// @author       joaquim.perez@syswise.com
// @match        http://DO_NOTHING__office.syswise.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syswise.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535232/%2A%2AOBSOLETE%2A%2A%20SYSWISE%20Portal%20-%20Timesheet%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/535232/%2A%2AOBSOLETE%2A%2A%20SYSWISE%20Portal%20-%20Timesheet%20tweaks.meta.js
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

        const TEMP_HOURS_PATTERNS = [
            "ticket not created yet",
            "CHGX",
            "INCX",
            "!",
            "?"
        ];

        await oPromiseUI5;

        switch (window.location.pathname) {

            case "/intranet-timesheet2/hours/index": // timesheet calendar

                $(".link_log_hours br:nth-child(n+3)").hide();
                $(".link_log_hours a:nth-child(n+2)").hide();
                $(".link_log_hours:has(a[href*='absences'])").css('background', 'linear-gradient(palevioletred,lightyellow,whitesmoke)');

                await Promise.all([
                    sap.ui.core.Lib.load("sap.m"),
                    sap.ui.core.Lib.load("sap.ui.core")
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
                    "sap/ui/layout/form/SimpleForm",
                    "sap/m/Label",
                    "sap/m/Text"
                ], function (Dialog, Button, HTML, MessageToast, Input, JSONModel, Item, MessageStrip, SimpleForm, Label, Text) {

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
                                            if (sTaskName.includes("CHG") || sTaskName.includes("INC")) {
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
                            sap.ui.core.Lib.load("sap.uxap")
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

    });

})();