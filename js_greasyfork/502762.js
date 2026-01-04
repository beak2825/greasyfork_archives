// ==UserScript==
// @name         Block the terms alert on LMSYS
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blocks the JS alert that pops up when you open the site
// @author       bmpq
// @match        https://chat.lmsys.org/*
// @match        https://lmarena.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502762/Block%20the%20terms%20alert%20on%20LMSYS.user.js
// @updateURL https://update.greasyfork.org/scripts/502762/Block%20the%20terms%20alert%20on%20LMSYS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the default alert function
    window.alert = function() {
        console.log("Blocked an alert: ", arguments);
    };

})();
