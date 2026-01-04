// ==UserScript==
// @name         Revert Twitch Chatbox to Old Size
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Revert chat input box to be two lines height always.  No resize.
// @author       CommonKitten
// @match        *://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387617/Revert%20Twitch%20Chatbox%20to%20Old%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/387617/Revert%20Twitch%20Chatbox%20to%20Old%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Credit to twitch user VGAcab for this change
    if (document.readyState === "interactive" || document.readyState === "complete") {
        setTimeout(ApplyFix, 200);
    }
})();

function ApplyFix() {
    document.getElementsByTagName("head")[0].innerHTML += "<style type=\"text/css\">textarea.tw-block.tw-border-radius-medium.tw-font-size-6.tw-full-width.tw-textarea.tw-textarea--no-resize {height: 55px !important;} button.tw-button-icon.tw-button-icon--secondary.tw-interactive {margin-bottom: 15px !important; position: relative !important;}</style>";
}