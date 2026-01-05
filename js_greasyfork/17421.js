// ==UserScript==
// @name         O365_Unread_Email_Script
// @author       jasonmclose
// @version      0.1
// @description  Tampermonkey script that changes the background color for unread emails in the Outlook page of Microsoft O365 (Office 365)
// @author       Jason Close
// @match        https://outlook.office365.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @namespace https://greasyfork.org/users/31726
// @downloadURL https://update.greasyfork.org/scripts/17421/O365_Unread_Email_Script.user.js
// @updateURL https://update.greasyfork.org/scripts/17421/O365_Unread_Email_Script.meta.js
// ==/UserScript==
'use strict';

function timerFunction() {
    $("._lvv_l1").find("[aria-label*=Unread]").addClass("unread_email"); 
    $(".unread_email.ms-bg-color-themeLight").removeClass("unread_email");
}

$(document).ready(function() {
    $("head").append('<style type="text/css"></style>');
    var newStyleElement = $("head").children(':last');
    newStyleElement.html('.unread_email{background:#ffc2b3;} .clicked_unread_email{background:#A2D5E1;}');  
    setInterval(timerFunction, 500);
});