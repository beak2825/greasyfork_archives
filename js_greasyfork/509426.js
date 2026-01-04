// ==UserScript==
// @name         Steam Workshop Open in Steam
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds an open in steam button next to workshop item titles.
// @match        https://steamcommunity.com/workshop/filedetails/?id=*
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509426/Steam%20Workshop%20Open%20in%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/509426/Steam%20Workshop%20Open%20in%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addOpenInSteamButton() {
        const workshopId = new URLSearchParams(window.location.search).get('id');
        if (!workshopId) return;

        const titleElement = document.querySelector('.workshopItemDetailsHeader .workshopItemTitle');

        if (titleElement && !document.querySelector('#openInSteamBtn')) {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 10px;
            `;

            titleElement.parentNode.insertBefore(container, titleElement);
            container.appendChild(titleElement);

            const button = document.createElement('a');
            button.id = 'openInSteamBtn';
            button.className = 'btnv6_blue_hoverfade btn_medium';
            button.href = 'steam://url/CommunityFilePage/' + workshopId;
            button.innerHTML = '<span>Open in Steam</span>';
            button.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                padding: 0 12px;
                height: 32px;
                line-height: 32px;
                white-space: nowrap;
                min-width: 90px;
                max-width: 100px;
            `;

            container.appendChild(button);
        }
    }

    function initialize() {
        let attempts = 0;
        const maxAttempts = 20;

        function tryAdd() {
            if (attempts >= maxAttempts) return;

            if (document.readyState === 'complete') {
                addOpenInSteamButton();
            } else {
                attempts++;
                setTimeout(tryAdd, 500);
            }
        }

        tryAdd();
    }

    initialize();

    const observer = new MutationObserver((mutations) => {
        if (!document.querySelector('#openInSteamBtn')) {
            addOpenInSteamButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();