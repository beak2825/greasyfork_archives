// ==UserScript==
// @name         WME Outreach Checker
// @namespace    Dude495
// @version      2021.04.18.01
// @description  Checks if a user has been contacted and listed in the outreach sheet.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/27023-jscolor/code/JSColor.js
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// @license      GNU GPLv3
// @grant        none
/* global W */
/* global $ */
/* global I18n */
/* global WazeWrap */
/* global jscolor */
// @downloadURL https://update.greasyfork.org/scripts/376700/WME%20Outreach%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/376700/WME%20Outreach%20Checker.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const PMImg = 'data:image/png;base64,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';
    var ORCSettings = [];
    var attributes = {
        name: ""
    }
    var currColor;
    var currFColor;
    var RCList = [];
    const ENRegEx = /([A-Za-z ])*: /g;
    const NEORRegEx = /(Read\?:|Responded\?:|Reporter:|Editor:|Contacted:|Rank:)/g
    const INCRegEx = /(.*)\(\d\)/;
    const RRE = /\(\d\)/g;
    var VERSION = GM_info.script.version;
    var SCRIPT_NAME = GM_info.script.name;
    var UPDATE_NOTES = '<ul>State Added<ol style="list-style-type: lower-alpha; padding-bottom: 0;"><li>Illinois</li></ul><ul><ol style="list-style-type: lower-alpha; padding-bottom: 0;"><li></li></li></ul><br><br>';
    //Color Change Box code from BeenThere with premissions of JustinS83
    function LoadSettings(){
        if ($('#ORCcolorPicker1')[0].jscolor && $('#ORCcolorPicker2')[0].jscolor && $('#ORCcolorPicker3')[0].jscolor && $('#ORCcolorPicker4')[0].jscolor){
            $('#ORCcolorPicker1')[0].jscolor.fromString(ORCSettings.CP1);
            $('#ORCcolorPicker2')[0].jscolor.fromString(ORCSettings.CP2);
            $('#ORCcolorPicker3')[0].jscolor.fromString(ORCSettings.CP3);
            $('#ORCcolorPicker4')[0].jscolor.fromString(ORCSettings.CP4);
            $('#ORCfontPicker1')[0].jscolor.fromString(ORCSettings.FP1);
            $('#ORCfontPicker2')[0].jscolor.fromString(ORCSettings.FP2);
            $('#ORCfontPicker3')[0].jscolor.fromString(ORCSettings.FP3);
            $('#ORCfontPicker4')[0].jscolor.fromString(ORCSettings.FP4);
        }
    }
    function updatePanel() {
        $('#ORCMenu-NotContacted > span')[0].style.backgroundColor = ORCSettings.CP1
        $('#ORCMenu-Contacted > span')[0].style.backgroundColor = ORCSettings.CP2
        $('#ORCMenu-Leadership > span')[0].style.backgroundColor = ORCSettings.CP3
        $('#ORCMenu-WhiteListed > span')[0].style.backgroundColor = ORCSettings.CP4
        $('#ORCMenu-NotContacted > span')[0].style.color = ORCSettings.FP1
        $('#ORCMenu-Contacted > span')[0].style.color = ORCSettings.FP2
        $('#ORCMenu-Leadership > span')[0].style.color = ORCSettings.FP3
        $('#ORCMenu-WhiteListed > span')[0].style.color = ORCSettings.FP4
    }
    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                CP1: ORCSettings.CP1,
                CP2: ORCSettings.CP2,
                CP3: ORCSettings.CP3,
                CP4: ORCSettings.CP4,
                FP1: ORCSettings.FP1,
                FP2: ORCSettings.FP2,
                FP3: ORCSettings.FP3,
                FP4: ORCSettings.FP4,
            }
            }
        localStorage.setItem("ORC_Settings", JSON.stringify(localsettings));
        updatePanel();
        runORC();
    }
    function LoadSettingsObj() {
        var loadedSettings;
        try{
            loadedSettings = $.parseJSON(localStorage.getItem("ORC_Settings"));
        }
        catch(err){
            loadedSettings = null;
        }
        var defaultSettings = {
            CP1: "#ff0000",
            CP2: "#F7E000",
            CP3: "#99bbff",
            CP4: "#ffffff",
            FP1: "#ffffff",
            FP2: "#000000",
            FP3: "#000000",
            FP4: "#000000",
        }
        ORCSettings = loadedSettings ? loadedSettings : defaultSettings;
        currColor = ORCSettings.CP1;
        currFColor = ORCSettings.FP1;
    }
    function resetDefault() {
        var loadedSettings;
        try{
            loadedSettings = $.parseJSON(localStorage.getItem("ORC_Settings"));
        }
        catch(err){
            loadedSettings = null;
        }
        var defaultSettings = {
            CP1: "#ff0000",
            CP2: "#F7E000",
            CP3: "#99bbff",
            CP4: "#ffffff",
            FP1: "#ffffff",
            FP2: "#000000",
            FP3: "#000000",
            FP4: "#000000",
        }
        ORCSettings = loadedSettings ? loadedSettings : defaultSettings;
        currColor = ORCSettings.CP1;
        currFColor = ORCSettings.FP1;
        updatePanel();
        LoadSettings();
    }
    function jscolorChanged(){
        ORCSettings.CP1 = "#" + $('#ORCcolorPicker1')[0].jscolor.toString();
        ORCSettings.CP2 = "#" + $('#ORCcolorPicker2')[0].jscolor.toString();
        ORCSettings.CP3 = "#" + $('#ORCcolorPicker3')[0].jscolor.toString();
        ORCSettings.CP4 = "#" + $('#ORCcolorPicker4')[0].jscolor.toString();
        ORCSettings.FP1 = "#" + $('#ORCfontPicker1')[0].jscolor.toString();
        ORCSettings.FP2 = "#" + $('#ORCfontPicker2')[0].jscolor.toString();
        ORCSettings.FP3 = "#" + $('#ORCfontPicker3')[0].jscolor.toString();
        ORCSettings.FP4 = "#" + $('#ORCfontPicker4')[0].jscolor.toString();
        saveSettings();
    }
    function initORCcolorPicker(tries){
        tries = tries || 1;

        if ($('#ORCcolorPicker1')[0].jscolor && $('#ORCcolorPicker2')[0].jscolor) {
            $('#ORCcolorPicker1')[0].jscolor.fromString(ORCSettings.CP1);
            $('#ORCcolorPicker2')[0].jscolor.fromString(ORCSettings.CP2);
            $('#ORCcolorPicker3')[0].jscolor.fromString(ORCSettings.CP3);
            $('#ORCcolorPicker4')[0].jscolor.fromString(ORCSettings.CP4);
            $('#ORCfontPicker1')[0].jscolor.fromString(ORCSettings.FP1);
            $('#ORCfontPicker2')[0].jscolor.fromString(ORCSettings.FP2);
            $('#ORCfontPicker3')[0].jscolor.fromString(ORCSettings.FP3);
            $('#ORCfontPicker4')[0].jscolor.fromString(ORCSettings.FP4);
            $('[id^="ORCcolorPicker"]')[0].jscolor.closeText = 'Close';
            $('[id^="ORCfontPicker"]')[0].jscolor.closeText = 'Close';
            $('#ORCcolorPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#ORCcolorPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#ORCcolorPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#ORCcolorPicker4')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#ORCfontPicker4')[0].jscolor.onChange = jscolorChanged;

        } else if (tries < 1000) {
            setTimeout(function () {initORCcolorPicker(tries++);}, 200);
        }
    }

    const h2K = 'QUl6YVN5QmRBYzY4ZE0t';
    const COUNTRIES = 'United States,Malaysia,Guam,Virgin Islands (U.S.),America Samoa,Northern Mariana Islands,Peutro Rico,Pakistan,Colombia';
    const RegNER = 'Massachusetts,Vermont,New Hampshire,Rhode Island,Maine,Connecticut';
    const RegNOR = 'New York,New Jersey,Delaware,Pennsylvania';
    const RegMAR = 'Maryland,District of Colombia,West Virginia,Virginia';
    const RegSWR = 'Arizona,California,Colorado,Hawaii,Nevada,New Mexico,Utah';
    const RegNWR = 'Alaska,Idaho,Montana,Oregon,Washington,Wyoming';
    const RegSER = 'Alabama,Florida,Georgia';
    const RegOH = 'Ohio';
    const RegIL = 'Illinois'
    const RegIN = 'Indiana';
    const RegMI = 'Michigan';
    const RegWI = 'Wisconsin';
    const RegPLN = 'Iowa,Kansas,Minnesota,Missouri,Nebraska,North Dakota,South Dakota';
    const RegMYS = 'Malaysia';
    const RegPK = 'Pakistan';
    const RegCOL = 'Colombia';
    const RegATR ='Guam,Virgin Islands (U.S.),America Samoa,Northern Mariana Islands,Peutro Rico';
    const SState = [
        RegNER,
        RegNOR,
        RegMAR,
        RegSWR,
        RegOH,
        RegIN,
        RegMI,
        RegWI,
        RegPLN,
        RegIL,
        RegNWR
    ].join(',')
    function injectPMLinkButton(SUBJECT, ID, element, MESSAGE = "", TYPE, username){
        let PMLink = document.createElement('DIV');
        PMLink.className = 'ORCPMBtn';
        PMLink.style.display = 'inline';
        let center = W.map.olMap.center.clone().transform(W.map.getProjectionObject().projCode, W.map.displayProjection.projCode);
        let LON = center.lon;
        let LAT = center.lat;
        let PermaLink = encodeURIComponent('https://www.waze.com/' + I18n.currentLocale() + '/editor?env=' + W.app.getAppRegionCode() + '&lon=' + LON + '&lat=' + LAT + '&zoom=' + W.map.olMap.getZoom() + '&' + TYPE + '=' + ID);
        PMLink.innerHTML = '  <a href="https://www.waze.com/forum/ucp.php?i=pm&mode=compose&username=' + username + '&subject=' + SUBJECT + '&message=' + MESSAGE + '[url=' + PermaLink + ']PermaLink[/url] " target="_blank"><img src=' + PMImg +'></img></a></div>';
        element.after(PMLink);
    }
    function addORCFBttn(element) {
        if (localStorage.getItem('ORCFBttn') == 'true') {
            if ($(element).parent().find('.ORC-FormBttn').length === 0) {
                let URL = $('#ORCResourceList > a')[0].href;
                let ORCFBttn = document.createElement('DIV');
                ORCFBttn.className = 'ORC-FormBttn';
                ORCFBttn.style.display = 'inline';
                ORCFBttn.innerHTML = '  <a href="'+URL+'" target="_blank"><span class="fa fa-envelope-open-o" data-toggle="tooltip" title="Open the Outreach Form."></span></a>  ';
                element.after(ORCFBttn);
            }
        }
    }
    function addPMBttn(element, MESSAGE) {
        if (localStorage.getItem('ORCPM') == 'true') {
            let ID;
            let SUBJECT;
            let TYPE;
            let ORCusername = element.textContent.match(INCRegEx);
            let username = ORCusername[1];
            let CurCountry = W.model.getTopCountry().name;
            if (WazeWrap.hasPlaceSelected()) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    ID = $('#venue-edit-general > ul > li:contains("ID:")')[0].textContent.match(/\d.*/)[0];
                    if (CurCountry == 'Colombia') {
                        SUBJECT = 'Una pregunta sobre este lugar';
                    } else {
                        SUBJECT = 'A question about this Venue';
                    }
                    TYPE = 'venues';
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
            if (WazeWrap.hasSegmentSelected()) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    if (CurCountry == 'Colombia') {
                        SUBJECT = 'Una pregunta sobre este segmento';
                    } else {
                        SUBJECT = 'A question about this Segment';
                    }
                    TYPE = 'segments';
                    ID = $('#segment-edit-general > ul > li:contains("ID:")')[0].textContent.match(/\d.*/)[0];
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
            if (WazeWrap.hasMapCommentSelected()) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    if (CurCountry == 'Colombia') {
                        SUBJECT = 'Una pregunta sobre este comentario de mapa';
                    } else {
                        SUBJECT = 'A question about this Map Comment';
                    }
                    TYPE = 'mapComments';
                    ID = $('.map-comment-feature-editor:contains("ID:")')[0].textContent.match('ID:.*')[0].match(/\d.*/)[0];
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
            if ($('div.map-problem.user-generated.selected').is(':visible') == true) {
                if($(element).parent().find('.ORCPMBtn').length === 0){
                    if (CurCountry == 'Colombia') {
                        SUBJECT = 'Una pregunta sobre esta solicitud de actualización';
                    } else {
                        SUBJECT = 'A question about this Update Request';
                    }
                    TYPE = 'mapUpdateRequest';
                    ID = $('div.map-problem.user-generated.selected').data('id');
                    injectPMLinkButton(SUBJECT, ID, element, MESSAGE, TYPE, username);
                }
            }
        } else
            return;
    }
    const A8B = 'Q0RZVk9KcjBtUWlzSWM3MEpNanRqUWNR';
    function doHighlightUser(element, foundUser) {
        var CurCountry = W.model.getTopCountry().name;
        const whitelistColor = ORCSettings.CP4;
        const whitelistFColor = ORCSettings.FP4
        const inSheetColor = ORCSettings.CP2;
        const inSheetFColor = ORCSettings.FP2
        const notInSheetColor = ORCSettings.CP1;
        const notInSheetFColor = ORCSettings.FP1
        const managementColor = ORCSettings.CP3;
        const managementFColor = ORCSettings.FP3;
        const youColor = ORCSettings.CP4;
        const youFColor = ORCSettings.FP4;
        const isStaffBG = '#ff66b3';
        const isStaffFont = '#000000';
        var ORWL = localStorage.getItem('ORWL').toLowerCase();
        let username = foundUser
        let leadership = getMgtFromSheetList(username);
        let entry = getFromSheetList(username);
        if (COUNTRIES.includes(CurCountry)) {
            if (COUNTRIES.includes(CurCountry)) {
                if (leadership != null) {
                    element.style.cssText += "filter: drop-shadow(0px 0px 5px "+managementColor+")!important;";
                }
                else if (ORWL.includes(username.toLowerCase())) {
                    element.style.cssText += "filter: drop-shadow(0px 0px 5px "+whitelistColor+")!important;";
                }
                else if (entry != null) {
                    if (RegPLN.includes(sessionStorage.getItem('ORCState')) || RegNER.includes(sessionStorage.getItem('ORCState')) || RegNOR.includes(sessionStorage.getItem('ORCState')) || RegWI.includes(sessionStorage.getItem('ORCState'))) {
                        element.style.cssText += "filter: drop-shadow(0px 0px 5px "+inSheetColor+")!important;";
                    }
                    else if (CurCountry == 'Malaysia') {
                        element.style.cssText += "filter: drop-shadow(0px 0px 5px "+inSheetColor+")!important;";
                    }
                    else if (CurCountry == 'Colombia') {
                        element.style.cssText += "filter: drop-shadow(0px 0px 5px "+inSheetColor+")!important;";
                    }
                    else if (RegATR.includes(CurCountry)) {
                        element.style.cssText += "filter: drop-shadow(0px 0px 5px "+inSheetColor+")!important;";
                    }
                    else if (CurCountry == 'Pakistan') {
                        element.style.cssText += "filter: drop-shadow(0px 0px 5px "+inSheetColor+")!important;";
                    } else {
                        element.style.cssText += "filter: drop-shadow(0px 0px 5px "+inSheetColor+")!important;";
                    }
                }
                else {
                    element.style.cssText += "filter: drop-shadow(0px 0px 5px "+notInSheetColor+")!important;"
                }
            }
            else {
                return;
            }
        }
    }
    function doHighlight(element) {
        var CurCountry = W.model.getTopCountry().name;
        const whitelistColor = ORCSettings.CP4;
        const whitelistFColor = ORCSettings.FP4
        const inSheetColor = ORCSettings.CP2;
        const inSheetFColor = ORCSettings.FP2
        const notInSheetColor = ORCSettings.CP1;
        const notInSheetFColor = ORCSettings.FP1
        const managementColor = ORCSettings.CP3;
        const managementFColor = ORCSettings.FP3;
        const youColor = ORCSettings.CP4;
        const youFColor = ORCSettings.FP4;
        const isChampBG = '#2a282b';
        const isChampFont = '#cac6cc';
        const isStaffBG = '#ff66b3';
        const isStaffFont = '#000000';
        let ORCusername = element.textContent.match(INCRegEx);
        var ORWL = localStorage.getItem('ORWL').toLowerCase();
        let ORCME = W.loginManager.user.userName;
        let username = ORCusername[1];
        let RUN = element.textContent.match(RRE);
        let RANK = RUN[0].replace(/\D/,'').replace(/\D/,'');
        let leadership = getMgtFromSheetList(username);
        let knownUsers = getKUFromSheetList(username);
        let entry = getFromSheetList(username);
        let isChamp = getChampsFromSheetList(username);
        if (COUNTRIES.includes(CurCountry)) {
            if (username.toLowerCase() == ORCME.toLowerCase()) {
                element.style.backgroundColor = youColor;
                element.style.color = youFColor;
                if (CurCountry == 'Colombia') {
                    element.title = 'Este Eres tu';
                } else {
                    element.title = 'This is you.';
                };
            }
            else if (leadership != null) {
                element.style.backgroundColor = managementColor;
                element.style.color = managementFColor;
                if (CurCountry == 'Colombia') {
                    element.title = username + ' es liderazgo.';
                } else {
                    element.title = username + ' is Leadership.';
                };
            }
            else if (isChamp != null) {
                element.style.backgroundColor = isChampBG;
                element.style.color = isChampFont;
                element.title = username + ' is a Champ. ('+W.model.getTopCountry().abbr+')';
            }
            else if (ORWL.includes(username.toLowerCase()) || (localStorage.getItem('ORCR4WL') == "true" && RANK >= '4')) {
                element.style.backgroundColor = whitelistColor;
                element.style.color = whitelistFColor;
                if (CurCountry == 'Colombia') {
                    element.title = username + ' en la lista blanca';
                } else {
                    element.title = username + ' is listed in the WhiteList';
                };
            }
            else if (knownUsers != null) {
                element.style.backgroundColor = whitelistColor;
                element.style.color = whitelistFColor;
                if (CurCountry == 'Colombia') {
                    element.title = username + ' es un editor conocido (SM + aprobado)';
                } else {
                    element.title = username + ' is a known editor (SM+ Approved).';
                };
            }
            else if (entry != null) {
                element.style.backgroundColor = inSheetColor;
                element.style.color = inSheetFColor;
                if (CurCountry == 'Colombia') {
                    element.title = username + ' encontrado en la hoja de trabajo. \n\nPor: ' + entry.reporter + '\nFecha: ' + entry.dateC + '\nCiudad: ' + entry.location + '.';
                }
                else if (RegPLN.includes(sessionStorage.getItem('ORCState')) || RegNER.includes(sessionStorage.getItem('ORCState')) || RegNOR.includes(sessionStorage.getItem('ORCState')) || RegWI.includes(sessionStorage.getItem('ORCState'))) {
                    element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nMsg Read: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                }
                else if (RegIL.includes(sessionStorage.getItem('ORCState'))) {
                    element.title = username + ' is located in the outreach spreadsheet. \n\nDate(s): ' + entry.dateC + '.';
                }
                else if (CurCountry == 'Malaysia') {
                    element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nCity: ' + entry.city + '\nState: ' + entry.state + '\nDate(s): ' + entry.dateC + '\nPM Read?:' + entry.forumread + '\nResponse(s): ' + entry.responses + '.';
                }
                else if (RegATR.includes(CurCountry)) {
                    element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '\nJoined GHO/Discord: ' + entry.joined + '.';
                }
                else if (CurCountry == 'Pakistan') {
                    element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nLocation: ' + entry.location + '\nPM Read?: ' + entry.forumread + '\nResponse(s): ' + entry.responses + '\nJoined Slack?: ' + entry.joined + '.';
                } else {
                    element.title = username + ' is located in the outreach spreadsheet. \n\nReporter(s): ' + entry.reporter + '\nDate(s): ' + entry.dateC + '\nResponse(s): ' + entry.responses + '.';
                }
            }
            else if (RANK == '7') {
                element.style.backgroundColor = isStaffBG;
                element.style.coloe = isStaffFont
                element.title = username + ' is Waze Staff.';
            }
            else {
                element.style.backgroundColor = notInSheetColor;
                element.style.color = notInSheetFColor;
                if (CurCountry == 'Colombia') {
                    element.title = username + ' no encontrado en la hoja de trabajo.';
                } else {
                    element.title = username + ' is not located in the outreach spreadsheet.';
                };
            };
        }
        else {
            return;
        }
    }
    function setSpanish() {
        $('#ORCMenu-NotContacted > span')[0].textContent = 'Sin contacto o en la lista blanca.';
        $('#ORCMenu-Contacted > span')[0].textContent = 'han sido contactados';
        $('#ORCMenu-Contacted > span')[0].dataset.originalTitle = ' El usuario ha sido contactado pero no significa que haya respondido.';
        $('#ORCMenu-Leadership > span')[0].textContent = 'Liderazgo.';
        $('#ORCMenu-Leadership > span')[0].dataset.originalTitle = ' Liderazgo del país';
        $('#ORCMenu-WhiteListed > span')[0].textContent = 'Contactado o en la lista blanca.';
        $('#ORCMenu-WhiteListed > span')[0].dataset.originalTitle = ' Todos los editores R4 + se incluirán en la lista blanca si está habilitado';
        $('#ORCSettings > label')[0].textContent = ' Lista blanca automática';
        $('#ORCSettings > label')[0].dataset.originalTitle = 'Lista blanca automática de cualquier editor R4+';
        $('#ORCSettings > label')[1].textContent = ' Habilitar botón de mensaje privado';
        $('#ORCSettings > label')[1].dataset.originalTitle = 'Habilite el botón PM junto al nombre de usuario';
        $('#ORCSettings > label')[2].textContent = ' Habilitar botón de contacto';
        $('#ORCSettings > label')[2].dataset.originalTitle = 'Habilite el botón de contacto junto al nombre de usuario';
        $('#ORCSettingsBtn')[0].textContent = 'Ajustes';
        $('#ORCWLLabel > b > h6')[0].textContent = 'Nombre (s) de usuario que se incluirán en la lista blanca (separados por comas):';
        $('#ORC-resources > p > b')[0].textContent = "Recursos:";
        $('#ORCResetColors')[0].textContent = 'Reiniciar';
        $('#ORCResetColors')[0].dataset.originalTitle = 'Restablecer la configuración de color predeterminada';
        $('#ORCReloadList')[0].dataset.originalTitle = 'Recargar datos';
        $('#ORCColorOpts > font > span')[0].dataset.originalTitle = 'Establecer color de fondo';
        $('#ORCColorOpts > font > span')[1].dataset.originalTitle = 'Establecer color de texto';
        $('#ORCBtn-WLAdd')[0].textContent = 'Añadir';
        $('#SaveWLButton')[0].textContent = 'Salvar';
        $('#ResetWLButton')[0].textContent = 'Reiniciar';
    }
    const W4a = atob(A8B);
    const T9f = atob(h2K);
    function runORC() {
        const JunctBox1 = $('#big-junction-edit-general > ul > li:nth-child(2) > a')[0];
        const JunctBox2 = $('#big-junction-edit-general > ul > li:nth-child(3) > a')[0];
        const LandMark1 = $('#venue-edit-general > ul > li:nth-child(1) > a')[0];
        const LandMark2 = $('#venue-edit-general > ul > li:nth-child(2) > a')[0];
        const Seg1 = $('#segment-edit-general > ul > li:nth-child(2) > a')[0];
        const Seg2 = $('#segment-edit-general > ul > li:nth-child(3) > a')[0];
        const MultiSeg1 = $('#segment-edit-general > ul > li:nth-child(2) > span > a:nth-child(1)');
        const MultiSeg2 = $('#segment-edit-general > ul > li:nth-child(3) > span > a:nth-child(1)');
        const MultiSeg3 = $('#segment-edit-general > ul > li:nth-child(2) > ul > li > a');
        const MultiSeg4 = $('#segment-edit-general > ul > li:nth-child(3) > ul > li > a');
        const MultiSeg5 = $('#segment-edit-general > ul > li:nth-child(3) > span.value > a');
        const MapComment1 = $('#edit-panel > div > div > div.tab-content > div > ul > li:nth-child(1) > a')[0];
        const MapComment2 = $('#edit-panel > div > div > div.tab-content > div > ul > li:nth-child(2) > a')[0];
        const Camera1 = $('#edit-panel > div > div > div > div.tab-content > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(1) > a')[0];
        const Camera2 = $('#edit-panel > div > div > div > div.tab-content > ul.additional-attributes.list-unstyled.side-panel-section > li:nth-child(2) > a')[0];
        const PURBig = $('#dialog-region > div > div > div > div.modal-body > div > div.small.user > a')[0];
        const PUR = $('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user > a')[0];
        const PURChange = $('#panel-container > div > div.place-update > div > div.body > div.scrollable > div.changes > div.reported-by.small > a')[0];
        const MP = $('#panel-container > div > div > div.actions > div > div > div.by > a');
        const URName = $('span.username');
        const URText = $('#panel-container > div > div > div.top-section > div.body > div > div.conversation.section > div.collapsible.content > div > div > ul > li > div > div.text');
        if (localStorage.getItem('ORWL') == null) {
            localStorage.setItem('ORWL', 'ORWList: ');
        }
        if ($('#layer-switcher-item_live_users')[0].checked) {
            let liveUsers = W.map.liveUsersLayer.div.children;//Thanks Joyriding!
            for (var i = 0, len1 = liveUsers.length; i < len1; i++) {
                var keys = Object.keys(liveUsers[i]);
                for (var j = 0, len2 = keys.length; j < len2; j++) {
                    if (keys[j].startsWith('jQuery')) {
                        let titleData = liveUsers[i][keys[j]]["bs.tooltip"];
                        if (titleData != undefined) {
                            let foundUser = liveUsers[i][keys[j]]["bs.tooltip"].options.title;
                            if (foundUser) {
                                doHighlightUser(liveUsers[i], foundUser)
                            } else {
                                return;
                            }
                        }
                    }
                }
            }
        }
        if (WazeWrap.hasPlaceSelected() && PUR == undefined && WazeWrap.getSelectedFeatures()[0].model.attributes.categories[0] !== 'RESIDENCE_HOME' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            $('div.toggleHistory')[0].onclick = setTimeout(function() {
                var HXLandMark = $('#venue-edit-general > div.element-history-region > div > div > div.historyContent > div.transactions > ul > li > div.tx-header > div.tx-summary > div.tx-author-date > a')
                for (let i = 0; i < HXLandMark.length; i++) {
                    doHighlight(HXLandMark[i]);
                    setTimeout(addPMBttn(HXLandMark[i]), 1000);
                    setTimeout(addORCFBttn(HXLandMark[i]), 1500);
                }
            }, 1500)
            if (LandMark1.textContent.includes('(')) {
                if (LandMark1.textContent.includes('staff'))
                    return;
                doHighlight(LandMark1);
                setTimeout(addPMBttn(LandMark1), 1000);
                setTimeout(addORCFBttn(LandMark1), 1500);
            }
            if (LandMark2 !== undefined) {
                if (LandMark2.textContent.includes('(')) {
                    if (LandMark2.textContent.includes('staff'))
                        return;
                    doHighlight(LandMark2);
                    setTimeout(addPMBttn(LandMark2), 1000);
                    setTimeout(addORCFBttn(LandMark2), 1500);
                }
            }
        }
        if (WazeWrap.hasSegmentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            $('div.toggleHistory')[0].onclick = setTimeout(function() {
                var HXSeg = $('#segment-edit-general > div.element-history-region > div > div > div.historyContent > div.transactions > ul > li > div.tx-header > div.tx-summary > div.tx-author-date > a');
                for (let i = 0; i < HXSeg.length; i++) {
                    doHighlight(HXSeg[i]);
                    setTimeout(addPMBttn(HXSeg[i]), 1000);
                    setTimeout(addORCFBttn(HXSeg[i]), 1500);
                }
            }, 1500)
            if ((MultiSeg1.length > '0') && MultiSeg1[0].textContent.includes('(')) {
                $('div.toggleHistory')[0].onclick = setTimeout(function() {
                    var HXMultiSeg = $('#segment-edit-general > div.element-history-region > div > div > div.historyContent > div.transactions > ul > li > div.tx-header > div.tx-summary > div.tx-author-date > a');
                    for (let i = 0; i < HXMultiSeg.length; i++) {
                        doHighlight(HXMultiSeg[i]);
                        setTimeout(addPMBttn(HXMultiSeg[i]), 1000);
                        setTimeout(addORCFBttn(HXMultiSeg[i]), 1500);
                    }
                }, 1500)
                if (MultiSeg1[0].textContent.includes('staff'))
                    return;
                doHighlight(MultiSeg1[0]);
                setTimeout(addPMBttn(MultiSeg1[0]), 1000);
                setTimeout(addORCFBttn(MultiSeg1[0]), 1500);
            }
            if (MultiSeg2.length > '0') {
                if (MultiSeg2[0].textContent.includes('(')) {
                    if (MultiSeg2[0].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg2[0]);
                    setTimeout(addPMBttn(MultiSeg2[0]), 1000);
                    setTimeout(addORCFBttn(MultiSeg2[0]), 1500);
                }
            }
            if (MultiSeg3.length > '0') {
                for (let i = 0; i < MultiSeg3.length; i++) {
                    if (MultiSeg3[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg3[i]);
                    setTimeout(addPMBttn(MultiSeg3[i]), 1000);
                    setTimeout(addORCFBttn(MultiSeg3[i]), 1500);
                }
            }
            if (MultiSeg4.length > '0') {
                for (let i = 0; i < MultiSeg4.length; i++) {
                    if (MultiSeg4[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg4[i]);
                    setTimeout(addPMBttn(MultiSeg4[i]), 1000);
                    setTimeout(addORCFBttn(MultiSeg4[i]), 1500);
                }
            }
            if (MultiSeg5.length > '0') {
                for (let i = 0; i < MultiSeg5.length; i++) {
                    if (MultiSeg5[i].textContent.includes('staff'))
                        return;
                    doHighlight(MultiSeg5[i]);
                    setTimeout(addPMBttn(MultiSeg5[i]), 1000);
                    setTimeout(addORCFBttn(MultiSeg5[i]), 1500);
                }
            }
            if (Seg1 !== undefined) {
                if (Seg1.textContent.includes('(')) {
                    if (Seg1.textContent.includes('staff'))
                        return;
                    let Seg1HX = $('#segment-edit-general > div.element-history-region > div > div > div.historyContent > div.transactions > ul > li > div.tx-header > div.tx-summary > div.tx-author-date > a');
                    doHighlight(Seg1);
                    addPMBttn(Seg1);
                    setTimeout(addORCFBttn(Seg1), 1500);
                    for (let i = 0; i < Seg1HX.legnth; i++) {
                        doHighlight(Seg1HX[i]);
                        setTimeout(addPMBttn(Seg1HX[i]), 1000);
                        setTimeout(addORCFBttn(Seg1HX[i]), 1500);
                    }
                }
            }
            if (Seg2 !== undefined) {
                if (Seg2.textContent.includes('(')) {
                    if (Seg2.textContent.includes('staff'))
                        return;
                    doHighlight(Seg2);
                    setTimeout(addPMBttn(Seg2), 1000);
                    setTimeout(addORCFBttn(Seg2), 1500);
                }
            }
        }
        if (WazeWrap.hasMapCommentSelected() && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (MapComment1.textContent.includes('(')) {
                if (MapComment1.textContent.includes('staff'))
                    return;
                doHighlight(MapComment1);
                for (let i=0; i < URName.length; i++) {
                    doHighlight(URName[i]);
                }
                setTimeout(addPMBttn(MapComment1), 1000);
                setTimeout(addORCFBttn(MapComment1), 1500);
            }
            if (MapComment2.textContent.includes('(')) {
                if (MapComment2.textContent.includes('staff'))
                    return;
                doHighlight(MapComment2);
                setTimeout(addPMBttn(MapComment2), 1000);
                setTimeout(addORCFBttn(MapComment2), 1500);
            }
        }
        if (W.selectionManager.getSelectedFeatures()[0] && WazeWrap.getSelectedFeatures()[0].model.type == 'bigJunction') {
            if (JunctBox1.textContent.includes('(')) {
                if (JunctBox1.textContent.includes('staff'))
                    return;
                doHighlight(JunctBox1);
                setTimeout(addPMBttn(JunctBox1), 1000);
                setTimeout(addORCFBttn(JunctBox1), 1500);
            }
            if (JunctBox2.textContent.includes('(')) {
                if (JunctBox2.textContent.includes('staff'))
                    return;
                doHighlight(JunctBox2);
                setTimeout(addPMBttn(JunctBox2), 1000);
                setTimeout(addORCFBttn(JunctBox2), 1500);
            }
        }
        if (MP.is(':visible')) {
            if (MP[0].textContent.includes('(')) {
                if (MP[0].textContent.includes('staff'))
                    return;
                doHighlight(MP[0]);
                setTimeout(addPMBttn(MP[0]), 1000);
                setTimeout(addORCFBttn(MP[0]), 1500);
            }
        }
        if (W.selectionManager.getSelectedFeatures()[0] && W.selectionManager.getSelectedFeatures()[0].model.type == 'camera' && WazeWrap.getSelectedFeatures()[0].model.attributes.id > '0') {
            if (Camera1.textContent.includes('(')) {
                if (Camera1.textContent.includes('staff'))
                    return;
                doHighlight(Camera1);
                setTimeout(addPMBttn(Camera1), 1000);
                setTimeout(addORCFBttn(Camer1), 1500);
            }
            if (Camera2.textContent.includes('(')) {
                if (Camera2.textContent.includes('staff'))
                    return;
                doHighlight(Camera2);
                setTimeout(addPMBttn(Camera2), 1000);
                setTimeout(addORCFBttn(Camera2), 1500);
            }
        }
        if ($('#panel-container > div > div.place-update > div > div.body > div.scrollable > div > div.add-details > div.small.user').is(':visible')) {
            if (PUR.textContent.includes('(')) {
                if (PUR.textContent.includes('staff'))
                    return;
                doHighlight(PUR);
                setTimeout(addPMBttn(PUR), 1000);
                setTimeout(addORCFBttn(PUR), 1500);
            }
        }
        if ($('#panel-container > div > div.place-update > div > div.body > div.scrollable > div.changes > div.reported-by.small > a').is(':visible')) {
            if (PURChange.textContent.includes('(')) {
                if (PURChange.textContent.includes('staff'))
                    return;
                doHighlight(PURChange);
                setTimeout(addPMBttn(PURChange), 1000);
                setTimeout(addORCFBttn(PURChange), 1500);
            }
        } else {
            let MESSAGE;
            for (let i=0; i < URName.length; i++) {
                if (URName[i].textContent.includes('(')) {
                    doHighlight(URName[i]);
                    if ($('#panel-container > div > div').is(':visible')) {
                        MESSAGE = encodeURIComponent('[quote="' + URName[i].textContent.replace(RRE,"") + '"]' + URText[i].textContent + '[/quote]')
                        setTimeout(addPMBttn(URName[i], MESSAGE), 1000);
                        setTimeout(addORCFBttn(URName[i]), 1500);
                    }
                }
            }
        }
    }
    const u7G = T9f+W4a;
    var ORCFeedList = [];
    const NER = 'https://sheets.googleapis.com/v4/spreadsheets/1Z4JLLLhwYTwkuhEgN3LBlQ5o-VH1kmulb6rReu_kzNM/values/NEOR/?key='+u7G;
    const NOR = 'https://sheets.googleapis.com/v4/spreadsheets/1Z4JLLLhwYTwkuhEgN3LBlQ5o-VH1kmulb6rReu_kzNM/values/NEOR/?key='+u7G;
    const MAR = 'https://sheets.googleapis.com/v4/spreadsheets/1DHqS2fhB_6pk_ZGxLzSgnakn7HPPz_YEmzCprUhFg1o/values/Sheet1/?key='+u7G;
    const SWR = 'https://sheets.googleapis.com/v4/spreadsheets/1VN7Ry4BhDrG1aLbGjDA3RULfjjX5R1TcNojbsPp0BwI/values/Sheet1/?key='+u7G;
    const OH = 'https://sheets.googleapis.com/v4/spreadsheets/1HdXxC11jStR8-XdRBL2wmQx-o846dOzETslOsbtxoM8/values/Form%20Responses%201/?key='+u7G;
    const PLN = 'https://sheets.googleapis.com/v4/spreadsheets/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/values/Plains%20Outreach/?key='+u7G;
    const IL = 'https://sheets.googleapis.com/v4/spreadsheets/1CP5B3i_aGqf7t2NYGerLrbs7klDt4kgvPXPe1W6Rye4/values/Sheet1/?key='+u7G;
    const IN = 'https://sheets.googleapis.com/v4/spreadsheets/1kmYohgu7etJ9CSwN4HOYa7wWIdtotUr0-rflvB1d--8/values/Sheet1/?key='+u7G;
    const MI = 'https://sheets.googleapis.com/v4/spreadsheets/1Mc6nAu770hJeciFZSVPqaSSZ1g34qgForj3fAOpxcyI/values/Outreach/?key='+u7G;
    const WI = 'https://sheets.googleapis.com/v4/spreadsheets/1wk9kDHtiSGqeehApi0twtr90gk_FUVUpf2iA28bua_4/values/New%20Editor%20Contact%20Sheet/?key='+u7G;
    const NWR = 'https://sheets.googleapis.com/v4/spreadsheets/1hD-_0rd1JSug472ORDMu3Evb6iZcdo1L-Oidnvwgc0E/values/Form%20Responses%202/?key='+u7G;
    const SER = 'https://sheets.googleapis.com/v4/spreadsheets/1Axymqxa2EcyKccOMRL0um6z4oPYQ39KKaFspggniyVI/values/ORC%20Database/?key='+u7G;
    const MYS = 'https://sheets.googleapis.com/v4/spreadsheets/103oO-48KkSBe4NUBorRKrMZtWVruhsx5TbaRkrhqkgs/values/Form%20Responses%201/?key='+u7G;
    const ATR = 'https://sheets.googleapis.com/v4/spreadsheets/1Qa1GAlO9lqopFZbvErzp5VDHbcaprZOJ0xbecRhVYhw/values/Form%20Responses%201/?key='+u7G;
    const PK = 'https://sheets.googleapis.com/v4/spreadsheets/1rtBXZzUK7_CnzUumdpMRdMFKovzI2GS0RlkzVzzVl-0/values/Form%20Responses%201/?key='+u7G;
    const COL = 'https://sheets.googleapis.com/v4/spreadsheets/11HJ_8GnMvILy1D9LnAYZRLmjVGB62kJp9DZmU9n2cpg/values/Respuestas%20de%20formulario%201/?key='+u7G;
    async function loadMasterList() {
        var SS;
        if (!localStorage.getItem('ORCSS')) {
            localStorage.setItem('ORCSS', NOR)
            console.log('ORC: Loading Default List (N[EO]R)....');
            SS = localStorage.getItem('ORCSS');
        }
        else {
            SS = localStorage.getItem('ORCSS');
            console.log('ORC: Loading Master Outreach List....');
        }
        await $.getJSON(SS, function(data){
            ORCFeedList = data;
            console.log('ORC: Master Outreach List Loaded....');
        });
    }
    var RegMgt = [];
    var RegKU = [];
    var ChampList = [];
    const ORCLeadershipSS = 'https://sheets.googleapis.com/v4/spreadsheets/1y2hOK3yKzSskCT_lUyuSg-QOe0b8t9Y-4sgeRMkHdF8/values/';
    async function loadLeadershipList() {
        var MgtSheet;
        var MgtReg;
        var KUList;
        let ChampSheet = ORCLeadershipSS + 'Champs_'+W.model.topCountry.abbr+'?key='+u7G;
        if (!localStorage.getItem('ORCSS')) {
            localStorage.setItem('ORCSS', NOR)
            console.log('ORC: Loading Default List (N[EO]R)....');
            MgtSheet = ORCLeadershipSS + 'NEOR/?key='+u7G;
            KUList = ORCLeadershipSS + 'NOR_KU/?key='+u7G;
            MgtReg = 'NOR'
        }
        else if (localStorage.getItem('ORCSS') == NOR) {
            MgtSheet = ORCLeadershipSS + 'NEOR/?key='+u7G;
            KUList = ORCLeadershipSS + 'NOR_KU/?key='+u7G;
            console.log('ORC: Loading N[EO]R Leadership Master List....');
            MgtReg = 'NOR'
        }
        else if (localStorage.getItem('ORCSS') == NER) {
            MgtSheet = ORCLeadershipSS + 'NEOR/?key='+u7G;
            KUList = ORCLeadershipSS + 'NER_KU/?key='+u7G;
            console.log('ORC: Loading N[EO]R Leadership Master List....');
            MgtReg = 'NER'
        }
        else if (localStorage.getItem('ORCSS') == MAR) {
            MgtSheet = ORCLeadershipSS + 'MAR/?key='+u7G;
            KUList = ORCLeadershipSS + 'MAR_KU/?key='+u7G;
            console.log('ORC: Loading MAR Leadership Master List....');
            MgtReg = 'MAR';
        }
        else if (localStorage.getItem('ORCSS') == SWR) {
            MgtSheet = ORCLeadershipSS + 'SWR/?key='+u7G;
            KUList = ORCLeadershipSS + 'SWR_KU/?key='+u7G;
            console.log('ORC: Loading SWR Leadership Master List....');
            MgtReg = 'SWR';
        }
        else if (localStorage.getItem('ORCSS') == OH) {
            MgtSheet = ORCLeadershipSS + 'GLR/?key='+u7G;
            KUList = ORCLeadershipSS + 'GLR_KU/?key='+u7G;
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'OH';
        }
        else if (localStorage.getItem('ORCSS') == MI) {
            MgtSheet = ORCLeadershipSS + 'GLR/?key='+u7G;
            KUList = ORCLeadershipSS + 'GLR_KU/?key='+u7G;
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'MI';
        }
        else if (localStorage.getItem('ORCSS') == IL) {
            MgtSheet = ORCLeadershipSS + 'GLR/?key='+u7G;
            KUList = ORCLeadershipSS + 'GLR_KU/?key='+u7G;
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'IL';
        }
        else if (localStorage.getItem('ORCSS') == IN) {
            MgtSheet = ORCLeadershipSS + 'GLR/?key='+u7G;
            KUList = ORCLeadershipSS + 'GLR_KU/?key='+u7G;
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'IN';
        }
        else if (localStorage.getItem('ORCSS') == WI) {
            MgtSheet = ORCLeadershipSS + 'GLR/?key='+u7G;
            KUList = ORCLeadershipSS + 'GLR_KU/?key='+u7G;
            console.log('ORC: Loading GLR Leadership Master List....');
            MgtReg = 'WI';
        }
        else if (localStorage.getItem('ORCSS') == PLN) {
            MgtSheet = ORCLeadershipSS + 'PLN/?key='+u7G;
            KUList = ORCLeadershipSS + 'PLN_KU/?key='+u7G;
            console.log('ORC: Loading PLN Leadership Master List....');
            MgtReg = 'PLN';
        }
        else if (localStorage.getItem('ORCSS') == NWR) {
            MgtSheet = ORCLeadershipSS + 'NWR/?key='+u7G;
            KUList = ORCLeadershipSS + 'NWR_KU/?key='+u7G;
            console.log('ORC: Loading NWR Leadership Master List....');
            MgtReg = 'NWR';
        }
        else if (localStorage.getItem('ORCSS') == SER) {
            MgtSheet = ORCLeadershipSS + 'SER/?key='+u7G;
            KUList = ORCLeadershipSS + 'SER_KU/?key='+u7G;
            console.log('ORC: Loading SER Leadership Master List....');
            MgtReg = 'SER';
        }
        else if (localStorage.getItem('ORCSS') == MYS) {
            MgtSheet = ORCLeadershipSS + 'Malaysia/?key='+u7G;
            KUList = ORCLeadershipSS + 'Malaysia_KU/?key='+u7G;
            console.log('ORC: Loading Malaysia Leadership Master List....');
            MgtReg = 'MYS';
        }
        else if (localStorage.getItem('ORCSS') == ATR) {
            MgtSheet = ORCLeadershipSS + 'ATR/?key='+u7G;
            KUList = ORCLeadershipSS + 'ATR_KU/?key='+u7G;
            console.log('ORC: Loading ATR Leadership Master List....');
            MgtReg = 'ATR';
        }
        else if (localStorage.getItem('ORCSS') == PK) {
            MgtSheet = ORCLeadershipSS + 'Pakistan/?key='+u7G;
            KUList = ORCLeadershipSS + 'Pakistan_KU/?key='+u7G;
            console.log('ORC: Loading Pakistan Leadership Master List....');
            MgtReg = 'PK';
        }
        else if (localStorage.getItem('ORCSS') == COL) {
            MgtSheet = ORCLeadershipSS + 'Colombia/?key='+u7G;
            KUList = ORCLeadershipSS + 'Colombia_KU/?key='+u7G;
            console.log('ORC: Loading Colombia Leadership Master List....');
            MgtReg = 'COL';
        }
        await $.getJSON(ChampSheet, function(cdata){
            ChampList = cdata;
        });
        await $.getJSON(MgtSheet, function(ldata){
            RegMgt = ldata;
            console.log('ORC: Leadership Masterlist Loaded....');
        });
        await $.getJSON(KUList, function(kudata){
            RegKU = kudata;
        });
    }
    function getMgtFromSheetList(editorName) {
        let MgtList = RegMgt.values.map(obj =>{
            return {username: obj[0]}
        });
        for(let i=0; i<MgtList.length; i++){
            if(MgtList[i].username.toLowerCase() === editorName.toLowerCase()) {
                return MgtList[i];
            }
        }
        return null;
    }
    function getKUFromSheetList(editorName) {
        let KUList = RegKU.values.map(obj =>{
            return {username: obj[0]}
        });
        for(let i=0; i<KUList.length; i++){
            if(KUList[i].username.toLowerCase() === editorName.toLowerCase()) {
                return KUList[i];
            }
        }
        return null;
    }
    function getChampsFromSheetList(editorName) {
        let Champs = ChampList.values.map(obj =>{
            return {username: obj[0]}
        });
        for(let i=0; i<Champs.length; i++){
            if(Champs[i].username.toLowerCase() === editorName.toLowerCase()) {
                return Champs[i];
            }
        }
        return null;
    }
    function getFromSheetList(editorName){
        if (localStorage.getItem('ORCSS') == MAR) {
            let mapped = ORCFeedList.values.slice(0).reverse().map(obj =>{
                return {username: obj[3].trim(), dateC: obj[0], reporter: obj[2], responses: obj[8]
                       }
            });
            for(let i=0; i<mapped.length; i++){
                if(mapped[i].username.toLowerCase() === editorName.toLowerCase()) {
                    return mapped[i];
                }
            }
            return null;
        } else {
            let mapped = ORCFeedList.values.map(obj =>{
                if (localStorage.getItem('ORCSS') == NOR) {
                    return {username: obj[0].replace(ENRegEx,'').replace(NEORRegEx,'').trim(), dateC: obj[2].replace(NEORRegEx,''), forumread: obj[3].replace(NEORRegEx,''), responses: obj[4].replace(NEORRegEx,''), reporter: obj[5].replace(NEORRegEx,'')
                           }
                }
                if (localStorage.getItem('ORCSS') == NER) {
                    return {username: obj[0].replace(ENRegEx,'').replace(NEORRegEx,'').trim(), dateC: obj[2].replace(NEORRegEx,''), forumread: obj[3].replace(NEORRegEx,''), responses: obj[4].replace(NEORRegEx,''), reporter: obj[5].replace(NEORRegEx,'')
                           }
                }
                if (localStorage.getItem('ORCSS') == SWR) {
                    if (obj[4] == null) {
                        return {username: obj[0].trim(), responses: obj[5], reporter: obj[2], dateC: obj[3]
                               }
                    } else {
                        return {username: obj[0].trim(), responses: obj[5], reporter: obj[2], dateC: obj[4]
                               }
                    }
                }
                if (localStorage.getItem('ORCSS') == OH) {
                    return {username: obj[2].trim(), responses: obj[7], reporter: obj[8], dateC: obj[6]
                           }
                }
                if (localStorage.getItem('ORCSS') == IL) {
                    return {username: obj[0].trim(), dateC: obj[3]
                           }
                }
                if (localStorage.getItem('ORCSS') == IN) {
                    return {username: obj[0].trim(), responses: obj[2], reporter: obj[3], dateC: obj[2]
                           }
                }
                if (localStorage.getItem('ORCSS') == MI) {
                    return {username: obj[0].trim(), responses: obj[2], reporter: obj[4], dateC: obj[3]
                           }
                }
                if (localStorage.getItem('ORCSS') == WI) {
                    return {username: obj[0].trim(), forumread: obj[5], responses: obj[6], reporter: obj[4], dateC: obj[3]
                           }
                }
                if (localStorage.getItem('ORCSS') == PLN) {
                    return {username: obj[3].trim(), forumread: obj[7], responses: obj[8], reporter: obj[1], dateC: obj[0]
                           }
                }
                if (localStorage.getItem('ORCSS') == NWR) {
                    return {username: obj[2], forumread: obj[6], responses: obj[7], reporter: obj[1], dateC: obj[0]
                           }
                }
                if (localStorage.getItem('ORCSS') == MYS) {
                    return {username: obj[2].trim(), forumread: obj[8], responses: obj[9], reporter: obj[1], dateC: obj[0], state: obj[4], city: obj[5]
                           }
                }
                if (localStorage.getItem('ORCSS') == ATR) {
                    return {username: obj[1].trim(), joined: obj[7], responses: obj[6], reporter: obj[3], dateC: obj[0]
                           }
                }
                if (localStorage.getItem('ORCSS') == PK) {
                    return {username: obj[1].trim(), joined: obj[8], forumread: obj[6], responses: obj[7], reporter: obj[5], dateC: obj[3], location: obj[4]
                           }
                }
                if (localStorage.getItem('ORCSS') == COL) {//<----------- Colombia
                    return {username: obj[1].trim(), reporter: obj[7], dateC: obj[0], location: obj[3]
                           }
                }
                if (localStorage.getItem('ORCSS') == SER) {
                    return {username: obj[1].trim(), forumread: obj[4], responses: obj[5], reporter: obj[2], dateC: obj[3]
                           }
                }
            });
            for(let i=0; i<mapped.length; i++){
                if(mapped[i].username.toLowerCase() === editorName.toLowerCase()) {
                    return mapped[i];
                }
            }
            return null;
        }
    }
    function updateMasterList() {
        if ($('#ORCRegList')[0].value == 'NER') {
            localStorage.setItem('ORCSS', NER);
        }
        else if ($('#ORCRegList')[0].value == 'NOR') {
            localStorage.setItem('ORCSS', NOR);
        }
        else if ($('#ORCRegList')[0].value == 'MAR') {
            localStorage.setItem('ORCSS', MAR);
        }
        else if ($('#ORCRegList')[0].value == 'SWR') {
            localStorage.setItem('ORCSS', SWR);
        }
        else if ($('#ORCRegList')[0].value == 'OH') {
            localStorage.setItem('ORCSS', OH);
        }
        else if ($('#ORCRegList')[0].value == 'IL') {
            localStorage.setItem('ORCSS', IL);
        }
        else if ($('#ORCRegList')[0].value == 'IN') {
            localStorage.setItem('ORCSS', IN);
        }
        else if ($('#ORCRegList')[0].value == 'MI') {
            localStorage.setItem('ORCSS', MI);
        }
        else if ($('#ORCRegList')[0].value == 'WI') {
            localStorage.setItem('ORCSS', WI);
        }
        else if ($('#ORCRegList')[0].value == 'PLN') {
            localStorage.setItem('ORCSS', PLN);
        }
        else if ($('#ORCRegList')[0].value == 'NWR') {
            localStorage.setItem('ORCSS', NWR);
        }
        else if ($('#ORCRegList')[0].value == 'SER') {
            localStorage.setItem('ORCSS', SER);
        }
        else if ($('#ORCRegList')[0].value == 'MYS') {
            localStorage.setItem('ORCSS', MYS);
        }
        else if ($('#ORCRegList')[0].value == 'ATR') {
            localStorage.setItem('ORCSS', ATR);
        }
        else if ($('#ORCRegList')[0].value == 'PK') {
            localStorage.setItem('ORCSS', PK);
        }
        else if ($('#ORCRegList')[0].value == 'COL') {
            localStorage.setItem('ORCSS', COL);
        }
        setTimeout(loadMasterList, 500);
        setTimeout(loadLeadershipList, 500);
    }
    const NEORResources = '<a href="https://www.bit.ly/NewEditorForm" target="_blank">N(EO)R New Editor Contact Form</a><br><a href="https://www.bit.ly/NewEditorSheet" target="_blank">Published Contacts Sheet</a>';
    const MARResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdfiaBesso7HTlAFxYdIW6oLdEOb0UQ9K9R4zys0gMTiyXpmQ/viewform" target="_blank">MAR New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1DHqS2fhB_6pk_ZGxLzSgnakn7HPPz_YEmzCprUhFg1o/pubhtml" target="_blank">Published Contacts Sheet</a>';
    const SWRResources = '<a href="https://docs.google.com/spreadsheets/d/1VN7Ry4BhDrG1aLbGjDA3RULfjjX5R1TcNojbsPp0BwI/edit#gid=0" target="_blank">Published Contacts Sheet</a>';
    const OHResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSccibGYNPyCDU-oR9MTR5T3q8ZgpoYrdw6sSvXVS4SSSCA6xQ/viewform" target="_blank">Ohio New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/pubhtml?gid=984781548&single=true" target="_blank">Published Contacts Sheet</a>';
    const ILResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLScej-N5UoF14v_qDXKta_D-exZJRRwihU7ldOa4kuHTw9gPAg/viewform" target="_blank">Illinois New Editor Contact Log</a><br><a href="https://docs.google.com/document/d/1eKeOz8Ta2Tx0EgjFM4y3J61tqYUoQXq9NhGTR9CClQs/edit">Illinois Welcome Letter Template</a>';
    const INResources = '<a href="#" target="_blank">Indiana New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1kmYohgu7etJ9CSwN4HOYa7wWIdtotUr0-rflvB1d--8/pubhtml" target="_blank">Published Contacts Sheet</a>';
    const PLNResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSfoXXrC6he-FQqfPgVqvf9aJ5hIOR0IPmGcy63Nw2wC2xEFXQ/viewform" target="_blank">PLN New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/14g6UAznDv8eCjNStimW9RbYxiwwuYdsJkynCgDJf63c/pubhtml?gid=984781548&single=true" target="_blank">Published Contacts Sheet</a>';
    const MIResources = '<a href="#" target="_blank">Michigan New Editor Contact Form</a><br><a href="https://goo.gl/XdFD9e" target="_blank">Published Contacts Sheet</a>';
    const WIResources = '<a href="https://docs.google.com/spreadsheets/d/1wk9kDHtiSGqeehApi0twtr90gk_FUVUpf2iA28bua_4/pubhtml" target="_blank">Published Contacts Sheet</a>';
    const NWRResources = '<a href="https://goo.gl/forms/naZYgt5oWbG5BBjm1" target="_blank">NWR New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1hD-_0rd1JSug472ORDMu3Evb6iZcdo1L-Oidnvwgc0E/edit#gid=97729408">Update Existing Record(s)</a><br><a href="https://docs.google.com/spreadsheets/d/1hD-_0rd1JSug472ORDMu3Evb6iZcdo1L-Oidnvwgc0E/pubhtml" target="_blank">Published Contacts Sheet</a>';
    const SERResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSeZ41NxN-kBQmCvvmMtmqLFYPVOGMmCRgZHnLhgofSHKTPY8A/viewform" target="_blank">SER New Editor Contact Form</a>';
    const MYSResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSf08H5mK-siIkXNS3ECu8oyKQQWthMjrm8smaD0mjiXuufVMQ/viewform" target="_blank">Malaysia New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRqrKMcCW39c5FeYWaLFMln694TR4oNt1Wc9d_JFEugRdCZytG3fzExyIjR1cWHVaSvVWrUQ3vl33Nn/pubhtml?gid=365459402&single=true" target="_blank">Published Contacts Sheet</a>';
    const ATRResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdg7NXrvYffCI7Hukb8zfSEZ7euO0efuWim8lI9cjWkHijd7Q/viewform" target="_blank">ATR New Editor Contact Form</a><br><a href="https://docs.google.com/spreadsheets/d/1Qa1GAlO9lqopFZbvErzp5VDHbcaprZOJ0xbecRhVYhw/edit?usp=sharing" target="_blank">Published Contact Sheet</a>';
    const PKResources = '<a href="http://bit.ly/PakTracker" target="_blank">Pakistan New Editor Contact Form</a><br><a href="http://bit.ly/PakTrackerSheet" target="_blank">Published Contact Sheet</a>';
    const COLResources = '<a href="https://docs.google.com/forms/d/e/1FAIpQLScIXlYh8zkTKKZHwObxL2Ojbul-ZhAwXpiTuXm_F1D63fq2sw/viewform" target="_blank">Nuevo formulario de editor colombiano</a><br><a href="https://docs.google.com/spreadsheets/d/11HJ_8GnMvILy1D9LnAYZRLmjVGB62kJp9DZmU9n2cpg/" target="_blank">Hoja de cálculo publicada</a>';
    function showPanel() {
        $('#ORCSettingsBtn').show();
        $('#ORCResourceList').show();
        $('#RegListDiv').show();
        $('#ORC-State').show();
        $('#ORCColorOpts').show();
        $('#ORC-resources').show();
        $('#ORCWLLabel').show();
        $('#ORWLVal').show();
        $('#ORCBtn-WLAdd').show();
        $('#SaveWLButton').show();
        $('#ResetWLButton').show();
    }
    function hidePanel() {
        $('#ORCSettingsBtn').hide();
        $('#ORCResourceList').hide();
        $('#RegListDiv').hide();
        $('#ORC-State').hide();
        $('#ORCColorOpts').hide();
        $('#ORC-resources').hide();
        $('#ORCWLLabel').hide();
        $('#ORWLVal').hide();
        $('#ORCBtn-WLAdd').hide();
        $('#SaveWLButton').hide();
        $('#ResetWLButton').hide();
    }
    function StateCheck() {
        var State = W.model.getTopState().name
        var Display = document.getElementById('RegListDiv')
        if (W.model.getTopCountry().name == 'United States') {
            if (RegNER.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: N(EO)R</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== NER) {
                    localStorage.setItem('ORCSS', NER);
                    $('#ORCRegList')[0].value = 'NER';
                    $('#ORCResourceList')[0].innerHTML = NEORResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegNOR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: N(EO)R</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== NOR) {
                    localStorage.setItem('ORCSS', NOR);
                    $('#ORCRegList')[0].value = 'NOR';
                    $('#ORCResourceList')[0].innerHTML = NEORResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegMAR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: MAR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== MAR) {
                    localStorage.setItem('ORCSS', MAR);
                    $('#ORCRegList')[0].value = 'MAR';
                    showPanel();
                    $('#ORCResourceList')[0].innerHTML = MARResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegSWR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: SWR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== SWR) {
                    localStorage.setItem('ORCSS', SWR);
                    $('#ORCRegList')[0].value = 'SWR';
                    $('#ORCResourceList')[0].innerHTML = SWRResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                    Display.style.display = "block";
                }
            }
            else if (RegOH.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== OH) {
                    localStorage.setItem('ORCSS', OH);
                    $('#ORCRegList')[0].value = 'OH';
                    showPanel();
                    $('#ORCResourceList')[0].innerHTML = OHResources
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegIL.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== IL) {
                    localStorage.setItem('ORCSS', IL);
                    $('#ORCRegList')[0].value = 'IL';
                    $('#ORCResourceList')[0].innerHTML = ILResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegIN.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== IN) {
                    localStorage.setItem('ORCSS', IN);
                    $('#ORCRegList')[0].value = 'IN';
                    $('#ORCResourceList')[0].innerHTML = INResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegWI.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== WI) {
                    localStorage.setItem('ORCSS', WI);
                    $('#ORCRegList')[0].value = 'WI';
                    $('#ORCResourceList')[0].innerHTML = WIResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegMI.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: GLR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== MI) {
                    localStorage.setItem('ORCSS', MI);
                    $('#ORCRegList')[0].value = 'MI';
                    $('#ORCResourceList')[0].innerHTML = MIResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                    Display.style.display = "block";
                }
            }
            else if (RegPLN.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: PLN</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== PLN) {
                    localStorage.setItem('ORCSS', PLN);
                    $('#ORCRegList')[0].value = 'PLN';
                    $('#ORCResourceList')[0].innerHTML = PLNResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegNWR.includes(State)) {
                $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: NWR</span>';
                Display.style.display = "block";
                if (localStorage.getItem('ORCSS') !== NWR) {
                    localStorage.setItem('ORCSS', NWR);
                    $('#ORCRegList')[0].value = 'NWR';
                    $('#ORCResourceList')[0].innerHTML = NWRResources
                    showPanel();
                    setTimeout(loadMasterList, 100);
                    setTimeout(loadLeadershipList, 100);
                }
            }
            else if (RegSER.includes(State)) {
                let ORCME = W.loginManager.user.userName;
                let Approved = getSERApproved(ORCME);
                if (Approved != null) {
                    $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region: SER</span>';
                    Display.style.display = "block";
                    if (localStorage.getItem('ORCSS') !== SER) {
                        showPanel();
                        localStorage.setItem('ORCSS', SER);
                        $('#ORCRegList')[0].value = 'SER';
                        $('#ORCResourceList')[0].innerHTML = SERResources;
                        $('#ORC-State')[0].innerHTML = 'Current State: ' + State;
                        setTimeout(loadMasterList, 100);
                        setTimeout(loadLeadershipList, 100);
                    }
                    runORC();
                } else {
                    console.warn('You are not authorized to use this script in this region. Please reach out to your leadership if you feel this is in error.');
                    hidePanel();
                    $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">You are NOT AUTHORIZED to use ORC in this region.<br>Please contact your leadership if this is in error.</div></b>';
                    Display.style.display = "none";
                }
            }
            else {
                $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">Current Country: ' + W.model.getTopCountry().name + '<br>Current Region Not Supported.</div></b>';
                hidePanel();
                Display.style.display = "none";
            }
            if (SState.includes(State)) {
                sessionStorage.setItem('ORCState', State);
                runORC();
                showPanel();
                $('#ORC-State')[0].innerHTML = 'Current State: ' + State;
                $('#ORC-State')[0].style.backgroundColor = '';
            }
        }
        else if (W.model.getTopCountry().name == 'Malaysia') {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '.';
            Display.style.display = "block";
            runORC();
            $('#ORC-State')[0].innerHTML = '';
            if (localStorage.getItem('ORCSS') !== MYS) {
                localStorage.setItem('ORCSS', MYS);
                $('#ORCRegList')[0].value = 'MYS';
                showPanel();
                runORC();
                $('#ORCResourceList')[0].innerHTML = MYSResources;
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            }
        }
        else if (W.model.getTopCountry().name == 'Puerto Rico' || W.model.getTopCountry().name == 'Virgin Islands (U.S.)' || W.model.getTopCountry().name == 'Guam' || W.model.getTopCountry().name == 'American Samoa' || W.model.getTopCountry().name == 'Northern Mariana Islands') {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '.';
            Display.style.display = "block";
            runORC();
            if (localStorage.getItem('ORCSS') !== ATR) {
                localStorage.setItem('ORCSS', ATR);
                $('#ORCRegList')[0].value = 'ATR';
                showPanel();
                runORC();
                $('#ORCResourceList')[0].innerHTML = ATRResources;
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            }
        }
        else if (W.model.getTopCountry().name == 'Pakistan') {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">Current Country: ' + W.model.getTopCountry().name + '.';
            Display.style.display = "block";
            runORC();
            $('#ORC-State')[0].innerHTML = '';
            if (localStorage.getItem('ORCSS') !== PK) {
                localStorage.setItem('ORCSS', PK);
                $('#ORCRegList')[0].value = 'PK';
                showPanel();
                runORC();
                $('#ORCResourceList')[0].innerHTML = PKResources;
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            };
        }
        else if (W.model.getTopCountry().name == 'Colombia') {
            $('#ORC-Region')[0].innerHTML = '<span style="color: black; background-color: #ededed">País Actual: ' + W.model.getTopCountry().name + '.';
            Display.style.display = "block";
            runORC();
            setSpanish();
            setTimeout(updatePanel, 200);
            $('#ORC-State')[0].innerHTML = '';
            if (localStorage.getItem('ORCSS') !== COL) {
                localStorage.setItem('ORCSS', COL);
                $('#ORCRegList')[0].value = 'COL';
                showPanel();
                runORC();
                $('#ORCResourceList')[0].innerHTML = COLResources;
                setTimeout(loadMasterList, 100);
                setTimeout(loadLeadershipList, 100);
            };
        } else {
            $('#ORC-Region')[0].innerHTML = '<b><div class="alert alert-danger">Current Country: ' + W.model.getTopCountry().name + '<br>Current Country Not Supported.</div></b>';
            hidePanel();
            $('#ORC-Top > label:nth-child(12)')[0].innerHTML = '';
            Display.style.display = "none";
        };
    }
    function RemoveWLSLabel() {
        $('#ORC-WLSaveMsg')[0].innerHTML = ''
        $('#ORWLVal')[0].value = ''
    }
    function resetRegList() {
        $('#ORCRegList')[0].value = '0'
    }
    function init() {
        $('#layer-switcher-item_live_users')[0].onclick = function(){StateCheck();}
        var mo = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if ($(node).hasClass('conversation-view') || $(node).hasClass('map-comment-feature-editor') || $(node).hasClass('place-update-edit') || $(node).hasClass('mapProblem') || $(node).hasClass('live-user-marker')) StateCheck();
            }));
        });
        mo.observe(document.querySelector('#panel-container'), {childList: true, subtree:true, attributes: true});
        mo.observe($('#edit-panel .contents')[0], {childList:true, subtree:true, attributes: true});
        mo.observe(document.getElementById('edit-panel'), { childList: true, subtree: true, attributes: true });
        mo.observe($("[id^=OpenLayers_Layer_Markers")[0], { childList: true, subtree: true, attributes: true });
        if (WazeWrap.hasSegmentSelected() || WazeWrap.hasPlaceSelected() || WazeWrap.hasMapCommentSelected()) {
            setTimeout(StateCheck, 2000);
        }
    }
    var SERApproved = [];
    async function loadSAUApproved() {
        console.log('ORC: Loading SER Approved Users....');
        var SAUSheet = ORCLeadershipSS + 'SERApproved/?key='+u7G;
        var SAUReg = 'SER'
        await $.getJSON(SAUSheet, function(ldata){
            SERApproved = ldata;
            console.log('ORC: '+SAUReg+' Leadership Masterlist Loaded....');
        });
    }
    function getSERApproved(editorName) {
        let AppList = SERApproved.values.map(obj =>{
            return {username: obj[0]}
        });
        for(let i=0; i<AppList.length; i++){
            if(AppList[i].username.toLowerCase() === editorName.toLowerCase()) {
                return AppList[i];
            }
        }
        return null;
    }
    function createTab() {
        var $section = $('<div>');
        $section.html([
            '<div id="ORC-Top"><div id="ORC-title">',
            '<h1>Outreach Checker</h2></div>',
            '<div id="RegListDiv"><select id="ORCRegList"><option value="0" selected disabled>Country</option><option value="COL">Colombia</option><option value="MYS">Malaysia</option><option value="PK">Pakistan</option><optgroup label="USA"><option value="ATR">ATR</option><option value="MAR">MAR</option><option value="NER">NER</option><option value="NOR">NOR</option><option value="NWR">NWR</option><option value="PLN">PLN</option><option value="SER">SER</option><option value="SWR">SWR</option><option value="3" disabled>GLR</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="MI">Michigan</option><option value="OH">Ohio</option><option value="WI">Wisconsin</option></optgroup></select><button type="button" id="ORCReloadList" class="btn btn-info" class="btn btn-default btn-sm" data-toggle="tooltip" title="Reload Outreach Lists"><span class="fa fa-repeat"></span></button></div>',
            '<br><button id="ORCSettingsBtn" data-toggle="collapse" data-target="#ORCSettings">Settings</button><div id="ORCSettings" class="collapse"><br><input type="checkbox" id="R4WL"> <label data-toggle="tooltip" title="Auto-Whitelist any editor Rank 4+">Auto-WL R4+</label><br><input type="checkbox" id="ORCPM-Btn"> <label data-toggle="tooltip" title="Enable PM button next to usernames">Enable ORCs PM Button</label><br><input type="checkbox" id="ORCF-Btn"> <label data-toggle="tooltip" title="Enable the Outreach button next to usernames">Enable ORCs Outreach Button</label>',
            '<div id="ORCColorOpts">',
            '<font size="1.9"><span data-toggle="tooltip" title="Set Background Color">Bg</span> | <span data-toggle="tooltip" title="Set Font Color">Txt</span>   </font><button type="button" class="btn btn-danger" data-toggle="tooltip" title="Reset to default color settings" id="ORCResetColors">Reset</button>',
            '<br><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker1"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker1"></button><div id="ORCMenu-NotContacted"><span style="color: black; background-color: #ff0000">Not been contacted or whitelisted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker2"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker2"></button><div id="ORCMenu-Contacted"><span style="color: black; background-color: #F7E000" data-toggle="tooltip" title=" User has been contacted but does not mean they have replied.">Has been contacted.</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker3"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker3"></button><div id="ORCMenu-Leadership"><span style="color: black; background-color: #99bbff" data-toggle="tooltip" title="Region Leadership">Regional Management (SM+).</span></div>',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCcolorPicker4"></button><button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:left;width:15px; height:15px;border:2px solid black" id="ORCfontPicker4"></button><div id="ORCMenu-WhiteListed"><span style="color: black; background-color: white" data-toggle="tooltip" title="All R4+ editors will be whitelisted if enabled.">Yourself/Whitelisted users.</span></div>',
            '</div></div></div>',
            '<br><div id="ORC-Region">Current Region: </div>',
            '<div id="ORC-State">Current State: </div>',
            '<div id="ORC-Warning"></div>',
            '<br><div id="ORC-info"></div>',
            '<p><div id="ORC-resources"><p><b>Resources:</b><br></div>',
            '<p><div id="ORC-WhiteList"></div>',
            '</div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('ORC', $section.html());
        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
        var RSClrBtn = document.getElementById('ORCResetColors');
        RSClrBtn.onclick = function() {
            localStorage.removeItem("ORC_Settings");
            resetDefault();
            runORC();
        }
        var P = document.createElement('P');
        var btn = document.createElement("BUTTON");
        btn.id = 'ORCBtn-WLAdd';
        var Button = document.getElementById('ORCBtn');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Add';
        var Title = $('#ORC-title')[0];
        Title.innerHTML += '<small>v' + VERSION + '</small>'
        var WLLabel = document.createElement('LABEL');
        WLLabel.id = 'ORCWLLabel'
        WLLabel.innerHTML = '<br><b><h6>Username(s) to be whitelisted (separated by comma):</h6>';
        var ORCResources = document.getElementById('ORC-resources');
        var tb = document.createElement('INPUT');
        tb.id = 'ORWLVal';
        tb.size = '40';
        tb.setAttribute('type', 'text');
        ORCResources.after(tb);
        tb.after(P);
        P.after(btn);
        tb.before(WLLabel);
        var SaveWL = document.createElement('BUTTON');
        SaveWL.className = 'btn btn-success';
        SaveWL.id = 'SaveWLButton';
        SaveWL.textContent = 'Save';
        btn.after(SaveWL);
        var ResetWL = document.createElement('BUTTON');
        ResetWL.id = 'ResetWLButton';
        ResetWL.className = 'btn btn-danger';
        ResetWL.textContent = 'Reset';
        SaveWL.after(ResetWL);
        var WLSLabel = document.createElement('LABEL')
        WLSLabel.id = 'ORC-WLSaveMsg';
        var P1 = P
        ResetWL.after(P1)
        SaveWL.onclick = function() {
            var copyText = localStorage.getItem('ORWL')
            var copied = $('<textarea id="ORCWLCopy" rows="1" cols="1">').val(copyText.replace('ORC ORWL: ', '')).appendTo('body').select();
            var ORCWLCopy = document.getElementById('ORCWLCopy');
            document.execCommand('copy');
            document.body.removeChild(ORCWLCopy);
            //alert('ORC WhiteList saved to clipboard.');
            P1.after(WLSLabel);
            WLSLabel.innerHTML = '<p><div class="alert alert-success">ORC WhiteList saved to clipboard.</div></p>'
            setTimeout(RemoveWLSLabel, 1000);
        }
        ResetWL.onclick = function() {
            localStorage.setItem('ORWL', 'ORWList: ');
            //alert('ORC WhiteList erased.');
            P1.after(WLSLabel);
            WLSLabel.innerHTML = '<p><div class="alert alert-info">ORC WhiteList reset.</div></p>'
            setTimeout(RemoveWLSLabel, 1000);
        }
        var ReloadListBtn = document.getElementById('ORCReloadList');
        var ORCWarning = document.getElementById('ORC-Warning');
        ReloadListBtn.onclick = function() {
            ORCWarning.after(WLSLabel);
            WLSLabel.innerHTML = '<p><div class="alert alert-info">Reloading Outreach Data....</div></p>';
            loadMasterList();
            loadLeadershipList();
            setTimeout(RemoveWLSLabel, 1500);
        }
        var R4WL = document.getElementById('R4WL')
        if (localStorage.getItem('ORCR4WL') == 'true') {
            $('#R4WL')[0].checked = true
        } else {
            $('#R4WL')[0].checked = false
        }
        R4WL.onclick = function() {
            ORCWarning.after(WLSLabel);
            localStorage.setItem('ORCR4WL', R4WL.checked)
            if (R4WL.checked == true) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">All Editors R4+ will be Auto Whitelisted.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            if (R4WL.checked == false) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">All Editors R4+ will not be Auto Whitelisted.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            StateCheck();
        }
        var ORCPM = document.getElementById('ORCPM-Btn')
        if (localStorage.getItem('ORCPM') == 'true') {
            $('#ORCPM-Btn')[0].checked = true
        } else {
            $('#ORCPM-Btn')[0].checked = false
        }
        ORCPM.onclick = function() {
            ORCWarning.after(WLSLabel);
            localStorage.setItem('ORCPM', ORCPM.checked)
            if (ORCPM.checked == true) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">Enabled ORCs PM Button.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            if (ORCPM.checked == false) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">Disabled ORCs PM Button.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            StateCheck();
        }
        var ORCFBttn = document.getElementById('ORCF-Btn')
        if (localStorage.getItem('ORCFBttn') == 'true') {
            $('#ORCF-Btn')[0].checked = true
        } else {
            $('#ORCF-Btn')[0].checked = false
        }
        ORCFBttn.onclick = function() {
            ORCWarning.after(WLSLabel);
            localStorage.setItem('ORCFBttn', ORCFBttn.checked)
            if (ORCFBttn.checked == true) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">Enabled ORCs Outreach Button.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            if (ORCFBttn.checked == false) {
                $('#ORC-WLSaveMsg')[0].innerHTML = '<p><div class="alert alert-info">Disabled ORCs Outreach Button.</div></p>'
                setTimeout(RemoveWLSLabel, 1500);
            }
            StateCheck();
        }
        let SelectedRegion = $('#ORCRegList')[0];
        if (localStorage.getItem('ORCSS') == MAR) {
            SelectedRegion.value = 'MAR';
        }
        else if (localStorage.getItem('ORCSS') == NER) {
            SelectedRegion.value = 'NER';
        }
        else if (localStorage.getItem('ORCSS') == NOR) {
            SelectedRegion.value = 'NOR';
        }
        else if (localStorage.getItem('ORCSS') == SWR) {
            SelectedRegion.value = 'SWR';
        }
        else if (localStorage.getItem('ORCSS') == OH) {
            SelectedRegion.value = 'OH';
        }
        else if (localStorage.getItem('ORCSS') == IL) {
            SelectedRegion.value = 'IL';
        }
        else if (localStorage.getItem('ORCSS') == IN) {
            SelectedRegion.value = 'IN';
        }
        else if (localStorage.getItem('ORCSS') == MI) {
            SelectedRegion.value = 'MI';
        }
        else if (localStorage.getItem('ORCSS') == WI) {
            SelectedRegion.value = 'WI';
        }
        else if (localStorage.getItem('ORCSS') == PLN) {
            SelectedRegion.value ='PLN';
        }
        else if (localStorage.getItem('ORCSS') == NWR) {
            SelectedRegion.value ='NWR';
        }
        else if (localStorage.getItem('ORCSS') == SER) {
            SelectedRegion.value ='SER';
        }
        else if (localStorage.getItem('ORCSS') == MYS) {
            SelectedRegion.value ='MYS';
        }
        else if (localStorage.getItem('ORCSS') == ATR) {
            SelectedRegion.value = 'ATR';
        }
        else if (localStorage.getItem('ORCSS') == PK) {
            SelectedRegion.value = 'PK';
        }
        else if (localStorage.getItem('ORCSS') == COL) {
            SelectedRegion.value = 'COL';
        }
        SelectedRegion.onchange = function() {
            if (SelectedRegion.value == 'NER' && RegNER.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', NER);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'NOR' && RegNOR.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', NOR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MAR' && RegMAR.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', MAR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'SWR' && RegSWR.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', SWR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'SER' && RegSER.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', SER);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'OH' && RegOH.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', OH);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'IL' && RegIL.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', IL);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'IN' && RegIN.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', IN);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MI' && RegMI.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', MI);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'WI' && RegWI.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', WI);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'PLN' && RegPLN.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', PLN);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'NWR' && RegNWR.includes(W.model.getTopState().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', NWR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'MYS' && RegMYS.includes(W.model.getTopCountry().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', MYS);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'ATR' && RegATR.includes(W.model.getTopCountry().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', ATR);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'PK' && RegPK.includes(W.model.getTopCountry().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', PK);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else if (SelectedRegion.value == 'COL' && RegCOL.includes(W.model.getTopCountry().name)) {
                $('#ORC-Warning')[0].innerHTML = '';
                localStorage.setItem('ORCSS', COL);
                setTimeout(updateMasterList, 500);
                setTimeout(resetRegList, 500);
            }
            else {
                $('#ORC-Warning')[0].innerHTML = '<br><div class="alert alert-danger"><strong>ERROR:</strong> The selected region/state list does not match the current WME location.</span>'
                console.log('ORC: Master Lists not updated.');
                setTimeout(resetRegList, 500);
            }
        }
        var ORCRes = document.getElementById('ORC-resources');
        var ORCResList = document.createElement('LABEL');
        ORCResList.id = 'ORCResourceList'
        if (localStorage.getItem('ORCSS') == NER) {
            ORCResList.innerHTML = NEORResources;
        }
        if (localStorage.getItem('ORCSS') == NOR) {
            ORCResList.innerHTML = NEORResources;
        }
        if (localStorage.getItem('ORCSS') == MAR) {
            ORCResList.innerHTML = MARResources;
        }
        if (localStorage.getItem('ORCSS') == SWR) {
            ORCResList.innerHTML = SWRResources;
        }
        if (localStorage.getItem('ORCSS') == SER) {
            ORCResList.innerHTML = SERResources;
        }
        if (localStorage.getItem('ORCSS') == OH) {
            ORCResList.innerHTML = OHResources;
        }
        if (localStorage.getItem('ORCSS') == IL) {
            ORCResList.innerHTML = ILResources;
        }
        if (localStorage.getItem('ORCSS') == IN) {
            ORCResList.innerHTML = INResources;
        }
        if (localStorage.getItem('ORCSS') == MI) {
            ORCResList.innerHTML = MIResources;
        }
        if (localStorage.getItem('ORCSS') == WI) {
            ORCResList.innerHTML = WIResources;
        }
        if (localStorage.getItem('ORCSS') == PLN) {
            ORCResList.innerHTML = PLNResources;
        }
        if (localStorage.getItem('ORCSS') == NWR) {
            ORCResList.innerHTML = NWRResources;
        }
        if (localStorage.getItem('ORCSS') == MYS) {
            ORCResList.innerHTML = MYSResources;
        }
        if (localStorage.getItem('ORCSS') == ATR) {
            ORCResList.innerHTML = ATRResources;
        }
        if (localStorage.getItem('ORCSS') == PK) {
            ORCResList.innerHTML = PKResources;
        }
        if (localStorage.getItem('ORCSS') == COL) {
            ORCResList.innerHTML = COLResources;
        }
        ORCRes.after(ORCResList);
        btn.onclick = function() {
            //console.log('ORC ORWL: ' + tb.value + ' has been added.');
            if (localStorage.getItem('ORWL') == null) {
                localStorage.setItem('ORWL', 'ORWList: ')
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                P1.after(WLSLabel);
                WLSLabel.innerHTML = '<p><div class="alert alert-success">ORC WhiteList updated.</div></p>'
                runORC();
                setTimeout(RemoveWLSLabel, 1000);
            } else {
                let ORWLOld = localStorage.getItem('ORWL');
                localStorage.setItem('ORWL', ORWLOld += tb.value + ',');
                P1.after(WLSLabel);
                WLSLabel.innerHTML = '<p><div class="alert alert-success">ORC WhiteList updated.</div></p>'
                runORC();
                setTimeout(RemoveWLSLabel, 1000);
            }
        }
        setTimeout(StateCheck, 3000);
        LoadSettingsObj();
        setTimeout(initORCcolorPicker(100), 500);
        init();
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user && WazeWrap.Ready && jscolor && ($('#panel-container').length || $('span.username').length >= 1)) {
            sessionStorage.removeItem('ORCState');
            loadMasterList();
            loadLeadershipList();
            loadSAUApproved();
            createTab();
            setTimeout(function(){if(W.selectionManager._selectedFeatures.length > 0){StateCheck();}}, 15000);
            setTimeout(updatePanel, 1000);
            if (!localStorage.getItem('ORCPM')) {
                localStorage.setItem('ORCPM', 'false');
            }
            if (!localStorage.getItem('ORCSS')) {
                localStorage.setItem('ORCSS', NOR);
            }
            WazeWrap.Events.register("selectionchanged", null, StateCheck);
            WazeWrap.Events.register("moveend", W.map, StateCheck);
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, VERSION, UPDATE_NOTES, "https://greasyfork.org/en/scripts/376700-wme-outreach-checker", "https://www.waze.com/forum/viewtopic.php?f=569&t=275371");
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    setTimeout(bootstrap, 3000);
})();
