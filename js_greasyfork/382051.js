// ==UserScript==
// @name         GDC Vault no Survey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       GilbertoBitt
// @match        *.gdcvault.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382051/GDC%20Vault%20no%20Survey.user.js
// @updateURL https://update.greasyfork.org/scripts/382051/GDC%20Vault%20no%20Survey.meta.js
// ==/UserScript==

(function() {
    'use strict';
    sponsorRegPopup = function(bullshit, id_midia, another_bullshit){
        let new_window = window.open("//gdcvault.com/play/" + id_midia, another_bullshit);
        new_window.blur();
    }
    // Your code here...
})();