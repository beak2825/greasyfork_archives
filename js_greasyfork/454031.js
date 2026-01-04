// ==UserScript==
// @name         QBO Bank Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skips the dashboard and goes directly to the bank tab when switching clients in Quickbooks Online (QBO).
// @author       JR
// @match        https://qbo.intuit.com/app/homepage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quickbooks.intuit.com/
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/454031/QBO%20Bank%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/454031/QBO%20Bank%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    location.replace ("https://qbo.intuit.com/app/banking");
})();