// ==UserScript==
// @name         Auto-click Content Warnings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-clicks "I understand and wish to proceed" on YouTube videos with sensitive content warnings.
// @author       InariOkami
// @icon           https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/YouTube_icon_%282011-2013%29.svg/512px-YouTube_icon_%282011-2013%29.svg.png?20130131084147
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531635/Auto-click%20Content%20Warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/531635/Auto-click%20Content%20Warnings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickProceedButton() {
        const proceedButton = document.querySelector('button[aria-label="I understand and wish to proceed"]');
        if (proceedButton) {
            proceedButton.click();
        }
    }
    setInterval(clickProceedButton, 1000);
})();