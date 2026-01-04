// ==UserScript==
// @name         Torn - Execute Bonus Highlight
// @namespace    duck.wowow
// @version      0.1
// @description  Adds a red border around your execute gun when the opponent's health goes below the threshold
// @author       Baccy
// @match        https://*.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541021/Torn%20-%20Execute%20Bonus%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/541021/Torn%20-%20Execute%20Bonus%20Highlight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let executeThreshold = null;
    let executeElementContainer = null;
    let progressElement = null;

    const observer = new MutationObserver((mutationsList) => {
        if (!progressElement) {
            const progressBars = document.querySelectorAll('.progress___iG5el.generic___TDjF1.progressOut___r38JJ');
            if (progressBars.length >= 2) progressElement = progressBars[1];
        }

        if (executeThreshold === null) {
            const playerArea = document.querySelector('.playerArea___AEVBU');
            if (playerArea) {
                const executeIcon = playerArea.querySelector('.bonus-attachment-execute');
                if (executeIcon) {
                    const desc = executeIcon.dataset.bonusAttachmentDescription;
                    if (desc) {
                        const match = desc.match(/below\s+(\d+)%/i);
                        if (match) {
                            executeThreshold = parseFloat(match[1]);
                            executeElementContainer = executeIcon.parentElement?.parentElement?.parentElement?.parentElement;
                        }
                    }
                }
            }
        }

        if (progressElement && executeThreshold !== null) {
            const widthStr = progressElement.style.width;
            const widthPercent = parseFloat(widthStr);
            if (!isNaN(widthPercent) && executeElementContainer) executeElementContainer.style.border = widthPercent <= executeThreshold ? '1px solid red' : '';
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
    });

})();