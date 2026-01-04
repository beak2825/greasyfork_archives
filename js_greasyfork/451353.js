/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         MouseOverInfo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mouseover infor for OHISD issues
// @author       shasjha
// @match        https://gbujira.us.oracle.com/browse/OHISD*
// @match        https://gbujira.us.oracle.com/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oracle.com
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        window.onurlchange
// @require      http://code.jquery.com/jquery-latest.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451353/MouseOverInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/451353/MouseOverInfo.meta.js
// ==/UserScript==
"use strict"

//mutationObservber for Type in Jira tasks
waitForKeyElements("#summary-val", gmMain);
waitForKeyElements("#edit-issue-dialog", gmEdit);

var pollRenameFields= setInterval (
    function () {
        $("strong[title='Note 2']").prop('title', 'Instructions for SR(Note 2): Frequently asked questions and Management review processes for SRQ');
    }, 111
);

function highlightFields(){
    $("strong[title='Product Categorization']").css("background-color", "yellow");
    $("dt[title='Organizations']").css("background-color", "yellow");
    $("strong[title='Parent SR']").css("background-color", "yellow");
}

function mouseOverInfo(){
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

function gmEdit(){

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

function gmMain () {
    highlightFields();
    mouseOverInfo();

    if(!$("strong[title='Technical Area']").length && !$('#errTechField').length){
        $( ".issue-body-content").prepend( "<p id='errTechField' style='color: red;font-weight: normal;'>Technical Area should be selected</p>" );
    }
    else if($("strong[title='Technical Area']").length){
    $("#errTechField").remove();
    }

    return true;
}