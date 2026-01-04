// ==UserScript==
// @name         Kvido Difficulty 5
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatické nastavení stylů pro lazy loaded prvky na stránce
// @author       KvidoTeam
// @match        https://dcbeta.livesport.eu/jsx/live/kvido-input?*
// @match        https://dc.livesport.eu/jsx/live/kvido-input?*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/518348/Kvido%20Difficulty%205.user.js
// @updateURL https://update.greasyfork.org/scripts/518348/Kvido%20Difficulty%205.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateStyles() {
        document.querySelectorAll('.Difficulty-module__difficulty-dark--wMAvW').forEach(element => {
            if (element.getAttribute('title') === 'Difficulty: 5') {
                const siblingSettings = element.parentElement.querySelector('.Settings-module__settings--iKz9z');

                if (siblingSettings) {
                    const statisticsDiv = siblingSettings.querySelector('div[title="Statistics"]');

                    if (statisticsDiv) {
                        statisticsDiv.style.display = 'flex';
                        statisticsDiv.style.justifyContent = 'center';
                        statisticsDiv.style.alignItems = 'center';
                        statisticsDiv.style.backgroundColor = 'rgb(250, 19, 14)';
                        statisticsDiv.style.border = '0.1rem solid rgb(250, 19, 14)';

                        const spanElement = statisticsDiv.querySelector('span');
                        if (spanElement) {
                            spanElement.style.color = 'white';
                        }
                    }
                }
            }
        });
    }

    const observer = new MutationObserver(() => {
        updateStyles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    updateStyles();

})();
