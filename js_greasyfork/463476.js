// ==UserScript==
// @name         Enable Dark theme for script fields in Utah
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable a dark theme on the new SN Monaco Editor.
// @author       dgcst
// @match        https://<instance_name_here>.service-now.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463476/Enable%20Dark%20theme%20for%20script%20fields%20in%20Utah.user.js
// @updateURL https://update.greasyfork.org/scripts/463476/Enable%20Dark%20theme%20for%20script%20fields%20in%20Utah.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        if (monaco) {
            monaco.editor.setTheme('vs-dark');
        }
    } catch (error) {
        // Do nothing
    }
})();