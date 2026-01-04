// ==UserScript==
// @name         Right Side Fix
// @namespace    https://pixlr.com/
// @version      1.0
// @description  Allows you to be productive again
// @author       ProfessionalScriptKiddie
// @license      MIT
// @match        *://*.pixlr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544790/Right%20Side%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/544790/Right%20Side%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeRightSpace() {
        const rightSpace = document.getElementById('right-space');
        if (rightSpace) {
            rightSpace.remove();
            console.log('Right Side Fix: Removed #right-space');
        }
    }

    removeRightSpace();

    const observer = new MutationObserver(removeRightSpace);
    observer.observe(document.body, { childList: true, subtree: true });
})();