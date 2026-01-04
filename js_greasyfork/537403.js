// ==UserScript==
// @name         Participant parser admin - HS Autopair
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Po vložení Event ID automaticky spáruje hráče - není nutné manuálně klikat na tlačítko Pair
// @author       JK
// @match        https://dc.livesport.eu/kvido/parser/participant-admin
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livesport.eu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537403/Participant%20parser%20admin%20-%20HS%20Autopair.user.js
// @updateURL https://update.greasyfork.org/scripts/537403/Participant%20parser%20admin%20-%20HS%20Autopair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const inputElement = document.querySelector('#kvido-parser-event-id');
        const buttonElement = document.querySelector('#kvido-parser-button');

        if (!inputElement || !buttonElement) return;

        observer.disconnect();

        inputElement.addEventListener('input', () => {
            const value = inputElement.value;

            if (value.length === 7 && /^\d+$/.test(value)) {
                buttonElement.click();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();