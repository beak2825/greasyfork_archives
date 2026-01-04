/*jshint esversion: 10 */
/* globals OLCore, unsafeWindow, OLi18n, GM_getValue, GM_setValue, GM_addStyle, GM_info */

// ==UserScript==
// @name           OLSettings
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.4.6
// @license        LGPLv3
// @description    Settings for Toolbox
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/434618/OLSettings.user.js
// @updateURL https://update.greasyfork.org/scripts/434618/OLSettings.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 12.10.2021 Release
 * 0.1.1 25.10.2021 + numericSettings
                    css fixing
 * 0.1.2 04.11.2021 + callback function
                    + OLSettings.add
 * 0.1.3 09.01.2022 + StadiumExportUniform
 * 0.2.0 24.01.2022 i18n support
                    + Toolbox language
 * 0.2.1 10.06.2022 Bugfix number input event
 * 0.2.2 25.06.2022 + new settings type "popup"
                    + setting sort playernames by surname
 * 0.2.3 13.07.2022 Bugfix Popup Settings
                    Changelog
 * 0.2.4 27.07.2022 Changelog 0.9.3
 * 0.2.5 10.08.2022 Changelog 0.9.4
 * 0.2.6 16.08.2022 Changelog 0.9.5
 * 0.2.7 12.12.2022 Changelog 0.9.6-9
 * 0.2.8 13.01.2023 Changelog 0.10.0
 * 0.3.0 23.08.2023 Changelog 0.10.1, 0.11.0
                    + new settings type "multiselect"
                    + new settings "AgeLineup"
 * 0.3.1 30.08.2023 Changelog 0.11.1
 * 0.4.0 20.11.2024 OL 2.0
 * 0.4.1 23.11.2024 Settingsbutton in officeSettings
 * 0.4.2 26.11.2024 Settingsbutton in officeSettings
 * 0.4.3 15.12.2024 changelog 0.12.4
 * 0.4.4 29.12.2024 changelog 0.12.5
 * 0.4.5 30.10.2024 changelog 0.12.6
 * 0.4.6 30.10.2024 changelog 0.12.7
 *********************************************/
(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    /****
     * Settings
     ****/

    const OLSettings = {};
    let settingsPopup;

    OLSettings.Changelog = [
        {
            'version': "0.12.7",
            'de': [
                "Hotfix: Stadion: Gegnervorschau"
            ],
            'en': [
                "Hotfix: Stadium: opponent preview"
            ]
        },
        {
            'version': "0.12.6",
            'de': [
                "Fix: Stadion: Gegnervorschau",
                "Fix: Stadion: Export der Auslastung"
            ],
            'en': [
                "Fix: Stadium: opponent preview",
                "Fix: Stadium: export data"
            ]
        },
        {
            'version' : "0.12.5",
            'de': ["Anzeige Saison/Woche im Header",
                    "Fix: mittlerer Mausklick im Untermenu",
                    "Quicklinks Layout verbessert",
                    "Fix: Spieler nach Nachnamen sortieren",
                    "Anzeige der Verletzungsdauer/Dauer der Sperre",
                    "Fix: Daten des Kaderexports",
                    "Fix: Anzeige der Friendly-Einnahmen in der Stadionübersicht ab Saison 41",
                    "Fix: Export der Stadionauslastung beim Sportplatz"],
            'en': ["Show season/week in header",
                    "Fix: middle mouse click on sub menu",
                    "improve quicklinks layout",
                    "Fix: sort player by surname",
                    "show duration of injury/ban",
                    "Fix: kader export data",
                    "Fix: show friendly income",
                    "Fix: export sports field utilization"
            ]
        },
        {
            'version' : "0.12.4",
            'de': ["Anpassungen an OL 2.0 (Jugendspieler, Angebote kopieren)"],
            'en': ["Adjustments for OL 2.0 (youth players, copy offers)"]
        },
        {
            'version' : "0.12.3",
            'de': ["Anpassungen an OL 2.0 (Tansfers, Friendlies, Base)"],
            'en': ["Adjustments for OL 2.0 (transfers, friendlies, base)"]
        },
        {
            'version' : "0.12.2",
            'de': ["Anpassungen an OL 2.0 (Bugfixes)"],
            'en': ["Adjustments for OL 2.0 (Bugfixes)"]
        },
        {
            'version' : "0.12.1",
            'de': ["Anpassungen an OL 2.0 (Einstellungen, Vertragsexport, Bugfixes)"],
            'en': ["Adjustments for OL 2.0 (Settings, contract export, bugfixes)"]
        },
        {
            'version' : "0.12.0",
            'de': ["Anpassungen an OL 2.0 (Training, Exporte, Stadion)"],
            'en': ["Adjustments for OL 2.0 (training, exports, stadium)"]
        },
        {
            'version' : "0.11.1",
            'de': ["External Caching beim Update verhindern"],
            'en': ["Avoid external caching on update"]
        },
        {
            'version' : "0.11.0",
            'de': ["Quicklinks","Anzeige Alter bei Aufstellung (optional)","Link zur Aufstellung nach dem Training","Icons für Finanzanzeige"],
            'en': ["Quicklinks","Display age on lineup (optional)","Link to lineup after training","Icons for finance display"]
        },
        {
            'version' : "0.10.1",
            'de': ["Hotfix Angebot neu einstellen"],
            'en': ["Hotfix offer renewal"]
        },
        {
            'version' : "0.10.0",
            'de': ["Eintrittspreise laden/speichern","Bugfix mittlere Maustaste Friendlies"],
            'en': ["load/save ticket prices","Bugfix middle mouse click for friendlies"]
        },
        {
            'version' : "0.9.9",
            'de': ["Hotfix nach OL Update"],
            'en': ["Hotfix after OL Update"]
        },
        {
            'version' : "0.9.8",
            'de': ["Neue Trainings-Intensitäts-Berechnung (hiT nach Rot)"],
            'en': ["New trainings intense calculation (hiT by Rot)"]
        },
        {
            'version' : "0.9.7",
            'de': ["Datumsanzeige bei Friendlies und Angeboten","Mittlere Maustaste öffnet neuen Tag in Hauptnavigation","Kopieren der Transferdaten aus Beobachtungsliste/Angebote"],
            'en': ["Show Dates for SeasonWeeks for friendlies and transferoffers","Middle mouse click for main navigation","Copy transfer data on watchlist/offerlist"]
        },
        {
            'version' : "0.9.6",
            'de': ["Hotfix für Jugendspieler aufdecken"],
            'en': ["Hotfix for youth player unboxing"]
        },
        {
            'version' : "0.9.5",
            'de': ["Hotfix nach OL Update"],
            'en': ["Hotfix after OL Update"]
        },
        {
            'version' : "0.9.4",
            'de': ["Transferliste: Kopieren der Angebots/Gebots-Daten","Öffnen von Links aus der Navigation mit der mittleren Maustaste im neuen Tab"],
            'en': ["Transferlist: Copy offer-/bid-data","Open sub-navigation links in new tab"]
        },
        {
            'version' : "0.9.3",
            'de': ["Bugfix: Spielerexport TM-Angebot","Bugfix: zuletzt angesehener Spieltag", "Entfernt: Anzeige Tabellenplatz bei Spielberichtsanzeige"],
            'en': ["Bugfix: Export player data on offer","Bugfix: Last shown matchday", "Removed: Ranking for matchreport header"]
        },
        {
            'version' : "0.9.2",
            'de': ["Export Spiel-Statistik (eigenes Spiel)", "Anzeige Tabellenplatz bei Spielberichtsanzeige und Spieltagsübersicht", "Kaderexport: alternative Export-Formate", "Kaderexport: Woche, Spieltag und Saison", "Bugfix: Auslastung Logenplätze bei Export der Stadiondaten", "Bugfix: Spieltagsübersicht springt immer auf Spieltag 1", "Bugfix: Stärkeanzeige bei der Spielvorschau (nur UK)"],
            'en': ["Match statistics export (own match)","Display ranking for matchreport header and matchday overview","Squad export: alternative export formats","Squad export: week, matchDay and season", "Bugfix: Utilization of boxes for stadium export", "Bugfix: Matchdaytable always shows matchDay 1 at first", "Bugfix: Show strength on match preview (UK only)"]
        }
    ];

    OLSettings.Settings = [
        {name: "Fitness bei Aufstellung", short: "LineupFitness", descr: "Fitnessanzeige in der Spielerliste (Aufstellung)", default: true, type: "toggle", settingsId: 'main'},
        {name: "Spielerstatus mobil", short: "mobileLineupState", descr: "Anzeige des Spielerstatus ([L][F]) bei mobiler Aufstellungsansicht", default: false, type: "toggle", settingsId: 'main'},
        {name: "Sortierung Nachname", short: "sortPlayerSurname", descr: "Sortierung der Spieler nach Nachname bei Aufstellung/Training/Einstellungen (Listen/Dropdowns)", default: false, type: "toggle", settingsId: 'main'},
        {name: "Sortierung Auswechslung", short: "sortPlayerSubstitution", descr: "Sortierung/Hervorhebung der Spieler im Dropdown bei der Auswechslungs-Einstellung", default: true, type: "toggle", settingsId: 'main'},
        {name: "Stadionauslastung", short: "StadiumUtilization", descr: "Anzeige der Auslastung bei der Stadionübersicht", default: true, type: "toggle", settingsId: 'main'},
        {name: "Einheitlicher Stadiondaten-Export", short: "StadiumExportUniform", descr: "Wenn aktiviert, werden beim Stadiondaten-Export die Daten von Friendly und Ligaspielen im selben Format ausgegeben.", default: true, type: "toggle", settingsId: 'main'},
        {name: "Erweiterter Stadiondaten-Export", short: "StadiumExportExtended", descr: "Wenn aktiviert, werden beim Stadiondaten-Export erweiterte Daten ausgegeben", default: true, type: "toggle", settingsId: 'main'},
        {name: "Jugendspieler verstecken", short: "YouthplayerUnboxing", descr: "NLZ Spieler verdecken und Attribute auf Knopfdruck nach und nach einblenden", default: false, type: "toggle", settingsId: 'main'},
        {name: "\"echte\" Torchancen anzeigen", short: "RealAttempts", descr: "Spielstatistik: Separierung der Torchancen nach Torschüssen und guten Torchancen", default: true, type: "toggle", settingsId: 'main'},
        {name: "Dispo Tipp", short: "DispoTipp", descr: "Anzeige der geschätzten Dispo-Zuteilung zur nächsten Sommerpause", default: false, type: "toggle", settingsId: 'main'},
        {name: "Trainingsgruppen-Filter", short: "TrainingGroupFilter", descr: "Zusätzliche Filter für die Trainingsgruppen", default: true, type: "toggle", settingsId: 'main'},
        {name: "Fitnessfilter Trainingsgruppen", short: "TrainingGroupFitnessFilter", descr: "Fitnesswert für Filter bei Trainingsgruppen", default: 95, type: "number", settingsId: 'main'},
        {name: "Toolbox Sprache", short: "ToolboxLanguage", descr: "Sprache für Toolbox Features", type: "select", options:[{value: "en", text:"en"},{value: "de", text:"de"}], default: OLi18n.shortLang, settingsId: 'main'},
        {name: "Dezimaltrennzeichen (Export)", short: "ToolboxDecimal", descr: "Dezimaltrennzeichen für Datenexport", type: "select", options:[{value: ",", text:","},{value: ".", text:"."}], default: OLi18n.decimalSeparator, settingsId: 'main'}
    ];

    OLSettings.set = function(short, value){
        const settingsData = JSON.parse(GM_getValue("ToolboxSettings") || "{}");
        settingsData[short] = value;
        GM_setValue('ToolboxSettings', JSON.stringify(settingsData));
    };

    OLSettings.get = function(short, defaultValue){
        const settingsData = JSON.parse(GM_getValue('ToolboxSettings') || "{}");
        let settingsValue = settingsData[short];
        const settingsItem = OLSettings.Settings.find(i => i.short === short);
        if (settingsValue === undefined){
            if (defaultValue === undefined && !settingsItem){
                return null;
            }
            settingsValue = defaultValue !== undefined ? defaultValue : settingsItem.default;
            settingsData[short] = settingsValue;
            GM_setValue('ToolboxSettings', JSON.stringify(settingsData));
        }
        return settingsValue;
    };

    OLSettings.add = function(item){
        item = item || {};
        if (OLSettings.Settings.find(i => i.short === item.short && i.settingsId === item.settingsId) === undefined){
            OLSettings.Settings.push(item);
        }
    };

    function settings(opt){
        opt = opt || {};
        opt.id = opt.id || OLCore.guid();
        opt.items = opt.items || OLSettings.Settings.filter(s => s.settingsId === opt.id);

        const popContent = $('<div id="OLToolboxSettingsPopup" />');

        opt.items.forEach(function(item, i){
            const itemLine = $('<div class="OLToolboxSettingsItemCont" />');
            itemLine.attr("title",item.descr);
            const settingsValue = OLSettings.get(item.short, item.default);
            item.name = tt(item.name);
            item.descr = tt(item.descr);
            if (item.type === "toggle"){
                let initValue = settingsValue;
                const toggle = OLCore.UI.toggle({
                    id: item.short,
                    name: item.name,
                    descr: item.descr,
                    initValue: initValue,
                    data: {short: item.short},
                    callback: function(isOn){
                        OLSettings.set(item.short, isOn);
                        if (typeof item.callback === 'function'){
                            item.callback(isOn);
                        }
                    },
                    ctrl: "right"
                });
                toggle.appendTo(itemLine);
                itemLine.appendTo(popContent);
            }
            else if (item.type === "number"){
                let initValue = settingsValue;
                const div = $(`<div lass="OLToolboxSettingsItemLine" style="width:100%" title="${item.descr}"><label class="numLabel">${item.name}</label><input type="number" min="0" max="100" value="${initValue}" /></div>`).appendTo(itemLine);
                div.children("input").on("input", function (evt){
                    const inp = evt.currentTarget;
                    OLSettings.set(item.short, inp.value);
                });
                itemLine.appendTo(popContent);
            }
            else if (item.type === "select"){
                item.options = item.options || [];
                const dropDown = OLCore.UI.dropDown({
                    options: item.options,
                    defaultValue: settingsValue,
                    style: "small",
                    out: "text"
                });
                const div = $(`<div lass="OLToolboxSettingsItemLine" style="width:100%" title="${item.descr}">
                <div style="width:auto;text-align:right;display:inline-block"><label class="numLabel">${item.name}</label></div>
                <div style="width:auto;float:right;display:inline-block;padding-top:5px;">${dropDown}</div>
              </div>`).appendTo(itemLine);
                div.find("div > select").on("change", function (evt){
                    const sel = evt.currentTarget;
                    OLSettings.set(item.short, sel.value);
                });
                itemLine.appendTo(popContent);
            }
            else if (item.type === "popup"){
                const div = $(`<div class="OLToolboxSettingsItemLine" style="width:100%" title="${item.descr}"><label class="numLabel">${item.name}</label></div>`);
                const btn = OLCore.UI.button({
                    title: item.descr,
                    fa: "cog"
                });
                btn.appendTo(div);
                div.appendTo(itemLine);
                btn.on("click", function (evt){
                    const alt = evt.altKey;
                    const ctrl = evt.ctrlKey;
                    const mode = alt ? "alt" : (ctrl ? "ctrl" : "normal");
                    const popTitle = `${item.name}${(alt ? " (" + tt("Alt") + ")" : (ctrl ? " (" + tt("Strg") + ")" : ""))}`;
                    if ($("div#TB_SettingsPopup_" + item.short).length){
                        return;
                    }
                    if (typeof item.generator === "function"){
                        OLCore.UI.popup(item.generator({mode: mode}), {title: popTitle, id: "TB_SettingsPopup_" + item.short});
                    }
                });
                itemLine.appendTo(popContent);
            }
            else if (item.type === "multiselect"){
                const div = $(`<div class="OLToolboxSettingsItemLine" style="width:100%" title="${item.descr}"><label class="numLabel">${item.name}</label></div>`);
                const btn = OLCore.UI.button({
                    title: item.descr,
                    fa: "cog"
                });
                btn.appendTo(div);
                div.appendTo(itemLine);
                btn.on("click", function (evt){

                    let selection = JSON.parse(settingsValue);

                    function saveMultiSelect(short, checked){
                        if (checked){
                            selection.push(short);
                        } else {
                            selection = selection.filter(item => item !== short);
                        }
                        OLSettings.set(item.short, JSON.stringify(selection));
                    }

                    const alt = item.noAlt ? false : evt.altKey;
                    const ctrl = item.noAlt ? false: evt.ctrlKey;
                    const mode = alt ? "alt" : (ctrl ? "ctrl" : "normal");
                    const popTitle = `${item.name}${(alt ? " (" + tt("Alt") + ")" : (ctrl ? " (" + tt("Strg") + ")" : ""))}`;
                    if ($("div#TB_SettingsPopup_" + item.short).length){
                        return;
                    }

                    const cont = $('<div style="padding:5px;" />');
                    for (const itemOpt of item.options){
                        const itemOptId = `TB_Settings_MS_${item.short}_${itemOpt.short}`;
                        const tgl = OLCore.UI.toggle({
                            id: itemOptId,
                            name: itemOpt.name,
                            descr: itemOpt.descr || itemOpt.name,
                            initValue: selection.includes(itemOpt.short),
                            data: {short: item.short},
                            ctrl: "right",
                            callback: function(checked) { saveMultiSelect(itemOpt.short, checked); }
                        });
                        tgl.appendTo(cont);
                    }
                    OLCore.UI.popup(cont, {title: popTitle, id: "TB_SettingsPopup_" + item.short});
                });
                itemLine.appendTo(popContent);
            }
        });
        $(`<div style="display:flex; justify-content: center; padding: 3px; font-size:smaller;color:red;">${tt("Änderungen erst nach Neuladen wirksam")} (F5)</div>`).appendTo(popContent);
        settingsPopup = OLCore.UI.popup(
            popContent,
            {
                title: `Toolbox Einstellungen (v${GM_info.script.version}) <span class="fa fa-info-circle" style="cursor:pointer" title="${tt("Klick für Changelog")}" id="TB_versionInfo"></span>`,
                on:{close:function(){settingsPopup = null;}}
            }
        );
        $("#TB_versionInfo").on("click", function(){
            const changelog = $('<div style="padding:5px;">');
            const lang = OLSettings.get("ToolboxLanguage");
            for (const cl of OLSettings.Changelog){
                changelog.append(`<span style="font-weight:bold; font-size: 22px">v${cl.version}</span>`);
                const ul = $('<ul style="list-style-position:inside; margin:5px; font-size: 18px;" />').appendTo(changelog);
                for (const cll of cl[lang]){
                    ul.append(`<li>${cll}</li>`);
                }
            }
            OLCore.UI.popup(changelog, {title: 'Changelog', scroll: 1});
        });
    }


    function showSettings() {
        if (settingsPopup){
            settingsPopup.close();
            settingsPopup = null;
        } else {
            settings({id: "main"});
        }
    }

    function showSettingsLink() {
        const settingsButtonMobile = $(`<div class="ol-settings-collapse" data-toggle="collapse">
    <div class="ol-settings-collapse-border ol-state-primary-color-9"></div>
    <div class="ol-settings-collapse-icon">
        <div class="fa fa-wrench fa-2x"></div>
    </div>
    <div class="ol-settings-collapse-font">
        <div>Toolbox</div>
    </div>
</div>`).prependTo('div#officeContent');
        settingsButtonMobile.on("click", showSettings);
    }

    /*
    const settingsButton = $(`<div class="fa fa-wrench fa-2x ol-open-manual"
            title="Einstellungen für die Toolbox-Erweiterung"
            style="opacity:.5;pointer-events: auto;cursor:pointer;position:absolute;right:70px;top:8px;width:26px;height:26px;color:white;z-index:1000" />`)
       .appendTo('div#ol-navbar-subnav-container div.ol-content-padding');
     */
    /*

    <div class="ol-settings-collapse" data-toggle="collapse" href="#collapseAccount">
    <div class="ol-settings-collapse-border ol-state-primary-color-9"></div>
    <div class="ol-settings-collapse-icon">
        <div class="ol-user-icon"></div>
    </div>
    <div class="ol-settings-collapse-font">
        <div>Account</div>
        <div>Persönliche Angaben, E-Mail, Passwort</div>
    </div>
</div>

    const settingsButton = $(`<div id="nav_sub_office_toolboxsettings" class="ol-subnav-item ">
    <div class="ol-subnav-icon fa fa-wrench fa-2x"></div>
    <div>
        <div class="ol-subnav-item-headline">${tt("Toolbox")}</div>
        <div class="ol-subnav-item-sub">${tt("Einstellungen für die Toolbox-Erweiterung")}</div>
    </div>
    </div>`).insertAfter('div#nav_sub_office_settings');
    */

    const settingsButton = $(`<div id="sub_nav_toolboxsettings" class="ol-subnav-item">
                <div class="ol-subnav-icon fa fa-wrench fa-2x"></div>
                <div>
                    <div class="ol-subnav-item-headline">Toolbox</div>
                </div>
            </div>`).insertBefore('div#sub_nav_logout');

    settingsButton.on("click", showSettings);

    GM_addStyle(`
       div#OLToolboxSettingsPopup > div {
         display: flex;
         padding: 0 10px;
         /*justify-content: space-between;*/
       }
       div#OLToolboxSettingsPopup input[type="number"] {
         -moz-appearance: auto;
         width: 45px;
         height: 24px;
         vertical-align: middle;
         border-radius: 5px;
         border: solid 1px black;
         text-align: center;
         font-family: Roboto Condensed,sans-serif;
         font-size: 11pt;
         font-weight: bold;
         position: absolute;
         right: 5px;
         margin-top: 5px;
       }
       div#OLToolboxSettingsPopup input[type=number]::-webkit-inner-spin-button,
			 div#OLToolboxSettingsPopup input[type=number]::-webkit-outer-spin-button {
          opacity: 1;
       }
       div#OLToolboxSettingsPopup label.numLabel{
         font-family: Roboto Condensed,sans-serif;
         font-size: 13pt;
         font-weight: 700;
         margin-top: 5px;
       }
       div.OLToolboxSettingsItemLine button{
         float:right;
         height: 26px;
         width: 26px;
         margin-top: 3px;
       }
    `);

    window.OLSettings = OLSettings;

    OLCore.initialize();

    function init(){
        OLCore.waitForKeyElements (
            "div#officeContent",
            showSettingsLink
        );
    }

    init();

})();