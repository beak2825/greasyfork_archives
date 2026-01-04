// ==UserScript==
// @name         Bypass Missing Information
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide the missing information box. 
// @author       Emerald
// @match        https://www.roblox.com/*
// @license      All Rights Reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475502/Bypass%20Missing%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/475502/Bypass%20Missing%20Information.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.setProperty('display', 'none', 'important');
        }
    }

    const idsToHide = [
        'simplemodal-overlay',
        'simplemodal-container',
        'modalCloseImg',
        'simplemodal-close',
        'simplemodal-wrap',
        'simplemodal-data'
    ];

    idsToHide.forEach(hideElementById);
})();
