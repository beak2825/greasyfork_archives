// ==UserScript==
// @name         R10.net Disable Sebastian
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable Sebastian on R10.net
// @author       ahmetkucukonder
// @match        https://www.r10.net/*
// @icon         https://www.google.com/s2/favicons?domain=r10.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437363/R10net%20Disable%20Sebastian.user.js
// @updateURL https://update.greasyfork.org/scripts/437363/R10net%20Disable%20Sebastian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("merve").style.display = "none";
})();