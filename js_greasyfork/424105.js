// ==UserScript==
// @name         Coz's Gmail Spam Number Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Puts bgcolor on folder count.
// @author       Coz Baldwin
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424105/Coz%27s%20Gmail%20Spam%20Number%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/424105/Coz%27s%20Gmail%20Spam%20Number%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'data:text/css,' +
            // Selectors start here
'.TN.bzz.aHS-bnv .aio.UKr6le .bsU {background-color: darkred; padding: 0px 8px !important; border-radius: 5px !important; border: 1px solid #b7b7b7 !important;}'; document.getElementsByTagName("HEAD")[0].appendChild(link);})();
 //div.aim div.TN.bzz.aHS-bnv .bsU