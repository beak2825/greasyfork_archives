// ==UserScript==
// @name         Modify GitHub Fork Button Text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change "Fork" button text to "Fork and Apply to YC" on GitHub
// @author       Naveen MC (https://github.com/mcnaveen)
// @match        *://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526012/Modify%20GitHub%20Fork%20Button%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/526012/Modify%20GitHub%20Fork%20Button%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyForkButton() {
        const forkButton = document.querySelector('#fork-button');
        if (forkButton) {
            forkButton.childNodes.forEach(node => {
                if (node.nodeType === 3 && node.nodeValue.trim() === "Fork") {
                    node.nodeValue = "Fork and Apply to YC";
                }
            });
        }
    }

    // Run initially and also on page changes
    modifyForkButton();
    document.addEventListener('pjax:end', modifyForkButton); // For GitHub's dynamic content loading
})();
