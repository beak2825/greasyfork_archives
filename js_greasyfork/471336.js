// ==UserScript==
// @name        Substack - Stop Text Selection Quote Popup
// @namespace   Violentmonkey Scripts
// @match       *://*.substack.com/*
// @grant       none
// @version     1.0
// @description Prevent quote popup from appearing when text is selected on Substack.
// @author      Yotam
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/471336/Substack%20-%20Stop%20Text%20Selection%20Quote%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/471336/Substack%20-%20Stop%20Text%20Selection%20Quote%20Popup.meta.js
// ==/UserScript==

document.addEventListener('selectionchange', function(event) {
    event.stopPropagation();
}, true);
