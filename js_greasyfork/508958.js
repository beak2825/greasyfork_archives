// ==UserScript==
// @name         Auto Close Modal on lmarena.ai
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically dismiss the modal on lmarena.ai
// @author       You
// @match        https://lmarena.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508958/Auto%20Close%20Modal%20on%20lmarenaai.user.js
// @updateURL https://update.greasyfork.org/scripts/508958/Auto%20Close%20Modal%20on%20lmarenaai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override window.alert to auto-dismiss the alert pop-up
    window.alert = function() {
        console.log("Alert auto-dismissed");
    };

})();
