// ==UserScript==
// @name         Dashvapes bypass age check
// @namespace    sprremix
// @version      0.1
// @description  Bypass (annoying) age check on Dashvapes
// @author       sprremix
// @match        https://www.dashvapes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashvapes.com
// @grant        none
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/456744/Dashvapes%20bypass%20age%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/456744/Dashvapes%20bypass%20age%20check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.cookie.includes("dv19")) {
        document.cookie = "dv19=1; expires=Tue, 19 Jan 2038 04:14:07 GMT; path=/;";
        location.reload();
    }
})();