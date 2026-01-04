// ==UserScript==
// @name         Ambee Lite
// @version      0.7
// @description  Ambee Elements Remover
// @author       IT FNsP NZ
// @match        https://vacc.ambee.sk/*
// @icon         https://www.google.com/s2/favicons?domain=ambee.sk
// @grant        GM_addStyle
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/67858
// @downloadURL https://update.greasyfork.org/scripts/428533/Ambee%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/428533/Ambee%20Lite.meta.js
// ==/UserScript==

(function() {

    var liteLogo =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKEAAAA5CAMAAABpuruqAAACSVBMVEVHcEwAAAf////swQD///8AAAAAAAMEBi4JCQn///////////+RdgD///////8AACL////////////////muwEAAAT///////////////////////////////////+3t7ehhACAaAD'+
        '////////////////////////////+/v7///////////////+ihABcSwD///8EBCsAABKIbwD////ovQD///////8AAAD///////////////////////////////////95YwDuwwCTeAIABS3////////////NpwD///////+LcgAAAiwAABn///////////////8AAAr///////8AAiwA'+
        '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';

    var hiddenCSS =
        'div.messenger,'+
        '#xsHeader > div.xs-main-header.serverrole-basprod > div.xs-main-menu > div:nth-child(2),'+
        '#xsHeader > div.xs-main-header.serverrole-basprod > div.xs-main-menu > div:nth-child(4),'+
        '#xsHeader > div.xs-main-header.serverrole-basprod > div.xs-main-menu > div:nth-child(5),'+
        '#xsHeader > div.xs-main-header.serverrole-basprod > div.xs-main-menu > div:nth-child(9),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(1),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(2),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(5),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(6),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(7),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(8),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(9),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(10),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(12),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(13),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(14),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(16),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(17),'+
        'div > div.maxHeight > div:nth-child(1) > div > div > ul.overflowY.overflowXHidden > div:nth-child(18),'+
        'div[data-for="emptyRecord"],'+
        'div[data-for="commMsgQueueDialog"],'+
        'button.menu-orgunits,'+
        'button.button-insurance-info,'+
        'button[title="Virtuálna pokladňa"],'+
        'button[title="Prehľad výkonov pacienta"],'+
        'button.tab-anamnesis,'+
        'button.tab-prescription,'+
        'button.tab-request,'+
        'button.tab-sicknessabs,'+
        'button.tab-operation,'+
        'button.tab-scoring,'+
        'button.xs-vertical-tab.overviewTabs.tab-medication,'+
        'button.xs-vertical-tab.tab-ambulance,'+
        'button.xs-vertical-tab.tab-clinicalvalues,'+
        'button.xs-vertical-tab.tab-laboratories,'+
        'button.xs-vertical-tab.tab-requests,'+
        'button.xs-horizontal-tab.tab-capitations,'+
        'button.xs-horizontal-tab.tab-consents,'+
        'button.xs-horizontal-tab.tab-contactpersons,'+
        'button.xs-horizontal-tab.tab-contactaddress,'+
        'button.xs-horizontal-tab.tab-contracts,'+
        '#patientRecordFormContainer > section > div.xs-patient-form-actions.xs-top.forceButtonRight > button.xs-success.xs-outline.button-record-save,'+
        '#patientRecordFormContainer > section > div.xs-patient-form.xs-row > div.xs-patient-form-left > div > div > div:nth-child(1) > div > div > form > div > div:nth-child(4),'+
        '.xs-patient-list-container > div.xs-new-patient > button:nth-child(1),'+
        '.xs-patient-list-container > div.xs-new-patient > button:nth-child(2) { display: none }';

    function hideSaveButton(){
        var saveButton = document.querySelector("#patientRecordFormContainer > section > div.xs-patient-form-actions.xs-top.forceButtonRight > button.xs-success.xs-outline.button-record-save");
        //saveButton.style = "display: none";
        saveButton.style = "border: 1px solid red;";
    }

    var colorCSS =
        'ul i.fa-file-invoice-dollar {color: #f49e01}'+
        'ul i.fal.fa-syringe {color: #00b9ff}'+
        'ul i.fa-file-alt {color: #2db62b}'+
        'ul i.fa-ban {color: #fe0b0b}';

    function changeLogo(){
        var logo = document.querySelector("#xsHeader > div.xs-main-header.serverrole-basprod > div.xs-logo > img").src = liteLogo;
    }

    setTimeout(changeLogo, 18000);
    GM_addStyle(hiddenCSS);
    GM_addStyle(colorCSS);

})();