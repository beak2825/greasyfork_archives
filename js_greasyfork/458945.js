/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         OHISD
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Userscript for GBUJira OHISD Tickets
// @author       shasjha
// @match        https://gbujira.oraclecorp.com/browse/OHISD*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oracle.com
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        window.onurlchange
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/458945/OHISD.user.js
// @updateURL https://update.greasyfork.org/scripts/458945/OHISD.meta.js
// ==/UserScript==
"use strict"

//mutationObservber for Type in Jira tasks
waitForKeyElements("#summary-val", gmMain);
waitForKeyElements("#edit-issue-dialog", gmEdit);
waitForKeyElements("#link-issue-dialog", gmLink);
waitForKeyElements("workflow-transition-231-dialog", gmWorkflow);


var pollRenameFields = setInterval(
    function () {
        $("strong[title='Note 2']").prop('title', 'Instructions for SR(Note 2): Frequently asked questions and Management review processes for SRQ');
    }
    , 111
);

function highlightFields() {
    $("strong[title='Product Categorization']").css("background-color", "yellow");
    $("dt[title='Organizations']").css("background-color", "yellow");
    $("strong[title='Parent SR']").css("background-color", "yellow");
}

function reduceLinkingValues() {
    $('#link-type option[value!="is blocked by"][value!="relates to"][value!="is caused by"][value!="is duplicated by"]').remove();
}

function workflowPrompt(){
    if(($('.jira-dialog-heading.jira-dialog-core-heading h2').attr('title')=='Set to Verification' || $('.jira-dialog-heading.jira-dialog-core-heading h2').attr('title')=='Set to In Review') && !$('#promptWorkflow').length )
    {
        $(".buttons-container.form-footer .buttons").prepend("<b id='promptWorkflow' style='color: black;font-weight: normal;background-color: yellow'>Verify if the following fields are populated: Labels, Root Cause Notes, Note 3 (Improvements) </b>. ");
    }
}

function gmLink() {
    reduceLinkingValues();
    return true;

}

function gmWorkflow(){
    workflowPrompt();
    return true;
}


function mouseOverInfo() {
    $("strong[title='Product Categorization']").prop('title', 'Provide two values, for value of first field see field Identifier');//h
    $("strong[title='SR # (MOS)']").prop('title', 'SR number of Collaboration SR in MOS');
    $("dt[title='Organizations']").prop('title', 'Select one value, for value needed see field Customer');//h
    $("strong[title='Current Status']").prop('title', 'Status of Collaboration SR in MOS');
    $("strong[title='Identifier']").prop('title', 'Product from Service Request MOS');
    $("strong[title='Customer']").prop('title', 'Customer from Service Request MOS');
    $("strong[title='Found In (Label)']").prop('title', 'Version from Service Request MOS');
    $("strong[title='Team']").prop('title', 'Value defaulted with creation of ticket, select value of team working on ticket');
    $("strong[title='Note 2']").prop('title', 'Instructions');
    $("strong[title='Parent SR']").prop('title', 'Enter Parent SR number, see Description for value');//h

}

function gmEdit() {

    console.log("inside edit");

    $('label[for="customfield_14916"]').prop('title', 'Provide two values, for value of first field see field Identifier');
    $('label[for="customfield_14916"]').css("background-color", "yellow");

    $('label[for="customfield_14601"]').prop('title', 'SR number of Collaboration SR in MOS');

    $('label[for="customfield_14704-textarea"]').prop('title', 'Select one value, for value needed see field Customer');
    $('label[for="customfield_14704-textarea"]').css("background-color", "yellow");

    $('label[for="customfield_14907"]').prop('title', 'Status of Collaboration SR in MOS');
    $('label[for="customfield_10007"]').prop('title', 'Product from Service Request MOS');
    $('label[for="customfield_15703"]').prop('title', 'Customer from Service Request MOS');
    $('label[for="customfield_15608"]').prop('title', 'Version from Service Request MOS');
    $('label[for="customfield_10006"]').prop('title', 'Value defaulted with creation of ticket, select value of team working on ticket');
    $('label[for="customfield_15305"]').prop('title', 'Instructions');

    $('label[for="customfield_17600"]').prop('title', 'Enter Parent SR number, see Description for value');//h
    $('label[for="customfield_17600"]').css("background-color", "yellow");
    return true;
}

function wikilinkPrompt() {
    if (!$('#customfield_11601-val').length && !$('#errWikiLink').length) {
        let curDateJira = new Date().toJSON().slice(0, 10);
        let creDateJira = $('#created-val .livestamp').attr('datetime').slice(0, 10);

        let currentDate = new Date(curDateJira);
        let createdDate = new Date(creDateJira);

        if (parseInt((currentDate - createdDate) / (1000 * 60 * 60 * 24), 10) > 7) {
            $(".issue-body-content").prepend("<p id='errWikiLink' style='color: black;font-weight: normal;'>Please consider creating a confluence page to structure the analysis</p>");
        }
    }
    else if($('#customfield_11601-val').length){
        $("#errWikiLink").remove();
    }
}

function appendSRLinks(){
    let parentSR = $('#customfield_17600-val').prop('innerText');

    var attatchmentLink = 'https://mos-dcac.us.oracle.com/#/dcac-main?contextNum=' + parentSR;
    var parentSRLink = 'https://mosemp.us.oracle.com/mosspui/src/sr/viewer/index.html#/' + parentSR;

    const procedureLinkSRQ = " https://gbuconfluence.oraclecorp.com/x/1nofCw";
    const procedureLinkAMS = "https://gbuconfluence.oraclecorp.com/x/7JFSCw";

    if(!$('#linksToSRs').length){
        $('#customfield_17600-val').append('<p id="linksToSRs"></p>');

        $('#linksToSRs').append("<a href='"+attatchmentLink+"' target='_blank'>Link to Attachments (Parent SR)&emsp;</a>");
        $('#linksToSRs').append("<a href='"+parentSRLink+"' target='_blank'>Link to Parent SR&emsp;</a>");
        $('#linksToSRs').append("<br><a href='"+procedureLinkSRQ+"' target='_blank'>SRQ OHISD Procedure&emsp;</a>");
        $('#linksToSRs').append("<a href='"+procedureLinkAMS+"' target='_blank'>AMS OHISD Procedure&emsp;</a>");

    }


}

function gmMain() {
    appendSRLinks();
    highlightFields();
    mouseOverInfo();
    wikilinkPrompt();
    workflowPrompt();

    if (!$("strong[title='Technical Area']").length && !$('#errTechField').length) {
        $(".issue-body-content").prepend("<p id='errTechField' style='color: red;font-weight: normal;'>Technical Area should be selected</p>");
    }
    else if ($("strong[title='Technical Area']").length)
        $("#errTechField").remove();

    return true;
}