/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         FixBy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Operations around FixBy Field(Bugs Only)
// @author       shasjha
// @match        https://gbujira.us.oracle.com/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oracle.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant    GM_addStyle
// @grant    GM.getValue
// @grant        window.onurlchange
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451351/FixBy.user.js
// @updateURL https://update.greasyfork.org/scripts/451351/FixBy.meta.js
// ==/UserScript==
"use strict"

//mutationObservber for Type in Jira tasks
waitForKeyElements("#edit-issue-dialog", gmMain);
waitForKeyElements("#create-issue-dialog", gmCreate);
waitForKeyElements("#issuetype-field", gmCreate);
waitForKeyElements("#rowForcustomfield_15702", gmMove);
waitForKeyElements("#summary-val", gmMain);

//use polling to check if fixby is present, if not display a message
var pollFields= setInterval (
    function () {
        if($('#type-val').text().includes('Bug')){
            if(!$('#rowForcustomfield_15702').length && !$('#errFields').length){
                $( ".issue-body-content").prepend( "<p id='errFields' style='color: red;font-weight: normal;'>Missing Field/s: Fix By</p>" );
            }
            else if($('#rowForcustomfield_15702').length){
                $("#errFields").remove();
            }
    }
    }, 111
);

function errBackPort(){
    if(!$('dt[title="backports"]').length && !$('#errBP').length){
        $( ".issue-body-content").prepend( "<p id='errBP' style='color: red;font-weight: normal;'>Missing Link\s: Backport Bug</p>" );
    }
    else if($('dt[title="backports"]').length)
        $("#errBP").remove();
}

function gmMove(){
        if(!$("#moveFixBy").length){
            $("li.item:last-child").after('<li id="moveFixBy" class="item"></li>');
            $('#rowForcustomfield_15702>div').detach().appendTo('#moveFixBy');
        }

}

function fixByMandate()
{
    let element = $('label:contains("Fix By")');
    if($('label:contains("Fix By"):has(span)').length<2){
        element.append('<span class="visually-hidden">Required</span><span class="aui-icon icon-required" aria-hidden="true"></span>');
    }

    $( "#customfield_15702").keyup(function() {
        if(document.getElementById("customfield_15702").value==="") {
            $( "#edit-issue-submit" ).prop( "disabled", true);
            if($("#customfield_15702-description-error").length==0)
            {
                $("#customfield_15702-description").after('<div class="error" data-field="customfield_15702" id="customfield_15702-description-error">Fix By is required.</div>');
            }
        }
        else {
            $("#customfield_15702-description-error").remove();
            $( "#edit-issue-submit" ).prop( "disabled", false);
        }
    });

}

function gmCreate(){
    if($('#customfield_15702').length){
        let element = $('label:contains("Fix By")');
        if($('label:contains("Fix By"):has(span)').length<2){
            element.append('<span class="visually-hidden">Required</span><span class="aui-icon icon-required" aria-hidden="true"></span>');
        }
    }

    $( "#customfield_15702").keyup(function() {
        if(document.getElementById("customfield_15702").value==="") {
            $( "#create-issue-submit" ).prop( "disabled", true);
            if(!$("#customfield_15702-description-error").length)
            {
                $("#customfield_15702-description").after('<div class="error" data-field="customfield_15702" id="customfield_15702-description-error">Fix By is required.</div>');
            }
        }
        else {
            $("#customfield_15702-description-error").remove();
            $( "#create-issue-submit" ).prop( "disabled", false);
        }
    });

    return true;

}

function gmMain () {
    let type = $('img[title="Bug "]').length;
    if(type){
        fixByMandate();
    }
    const summaryString = $('#summary-val').text();
    if(summaryString.startsWith('BP')){
        errBackPort();
    }

    return true;
}