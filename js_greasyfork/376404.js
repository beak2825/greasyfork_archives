// ==UserScript==
// @name         Recaptcha clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicks on the button
// @author       giuseppe-dandrea
// @match        http*://www.google.com/recaptcha/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376404/Recaptcha%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/376404/Recaptcha%20clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() { document.getElementsByClassName("recaptcha-checkbox-checkmark")[0].click(); }, 1000);
})();