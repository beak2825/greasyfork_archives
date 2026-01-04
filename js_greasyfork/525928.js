// ==UserScript==
// @name         Skip Intro
// @namespace    Violentmonkey Scripts
// @version      1.0
// @run-at       document-body
// @license      CC BY-NC
// @description  Skip the Intro (Forever)
// @author       Unknown Hacker
// @match        https://*.playcode.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525928/Skip%20Intro.user.js
// @updateURL https://update.greasyfork.org/scripts/525928/Skip%20Intro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickPrimaryButton() {
        const button = document.querySelector('.btn--primary');
        if (button) {
            button.click();
            console.log('Primary button clicked!');
        }
    }

    window.addEventListener('load', clickPrimaryButton);
})();
