// ==UserScript==
// @name         Indiana Driving Brilliance Refresher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refreshes Driver ED Page Automatically
// @author       You
// @match        *://onlinedrivers.education/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387379/Indiana%20Driving%20Brilliance%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/387379/Indiana%20Driving%20Brilliance%20Refresher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function start() {
        location.href = "javascript:recordTime();";
        setTimeout(start, 3000);
    }

// boot up the first call
start();
})();