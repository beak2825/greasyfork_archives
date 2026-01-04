// ==UserScript==
// @name         Toggle Docs Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  toggle comments in google doc. You get a small button on the left bottom of your screen.
// @include      https://*docs.google.*/document/*
// @author       andreask
// @match        https://*docs.google.*/document/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/387197/Toggle%20Docs%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/387197/Toggle%20Docs%20Comments.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
'use strict';
var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.getElementsByTagName("HEAD")[0].appendChild(link);

$("body").append (''
    + '<div class="gmPersistentButton" style="position:fixed;bottom:1em;left:2em;z-index:6666;">'
    + '<button class="material-icons" id="gmContinueBtn" title="toggle comments">toggle_on</button>'
    + '</div>'
);

//--- Activate the button.
 $("#gmContinueBtn").click ( function () {
    var btnValue = this.textContent;
    if (btnValue == "toggle_on") {
        $(".kix-discussion-plugin").hide();
        this.textContent = "toggle_off"
    }
    else {
        $(".kix-discussion-plugin").show();
        this.textContent = "toggle_on"
    }
} );


// $(".kix-discussion-plugin").hide();
