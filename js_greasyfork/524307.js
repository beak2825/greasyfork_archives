// ==UserScript==
// @name         Auto-Click "Wyślij natychmiast" (z opóźnieniem)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatycznie klika w ikonkę "Wyślij natychmiast" z opóźnieniem 5 sekund między kliknięciami, tylko raz na wiersz
// @author       Dawid
// @match        *://premiumtechpanel.sellasist.pl/admin/messages/edit?type=all&created_at_from=&created_at_to=&receiver=&status=error&new_filters=1*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/524307/Auto-Click%20%22Wy%C5%9Blij%20natychmiast%22%20%28z%20op%C3%B3%C5%BAnieniem%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524307/Auto-Click%20%22Wy%C5%9Blij%20natychmiast%22%20%28z%20op%C3%B3%C5%BAnieniem%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let clickQueue = [];
    let isProcessing = false;

    function processQueue() {
        if (clickQueue.length === 0) {
            isProcessing = false;
            return;
        }

        isProcessing = true;
        const icon = clickQueue.shift();
        icon.click();
        console.log('Kliknięto w ikonę "Wyślij natychmiast" z opóźnieniem');
        icon.classList.add('clicked-icon');

        setTimeout(processQueue, 5000);
    }
    function addIconsToQueue() {
        const icons = document.querySelectorAll('img[title="Wyślij natychmiast"]:not(.clicked-icon)');
        icons.forEach(icon => {
            if (!clickQueue.includes(icon)) {
                clickQueue.push(icon);
            }
        });

        if (!isProcessing) {
            processQueue();
        }
    }

    window.addEventListener('load', addIconsToQueue);

    const observer = new MutationObserver(() => {
        addIconsToQueue();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();