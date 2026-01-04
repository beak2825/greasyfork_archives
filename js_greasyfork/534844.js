// ==UserScript==
// @name         GeoGuessr Full Multiplayer Lockdown
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Fully disables Multiplayer in GeoGuessr: blocks tab, task, and in-game buttons if reached accidentally or by link paste.
// @author       Causey
// @match        https://www.geoguessr.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534844/GeoGuessr%20Full%20Multiplayer%20Lockdown.user.js
// @updateURL https://update.greasyfork.org/scripts/534844/GeoGuessr%20Full%20Multiplayer%20Lockdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DISABLED_STYLE = 'pointer-events: none; opacity: 0.4; cursor: not-allowed;';

    function disableMultiplayerTab() {
        const observer = new MutationObserver(() => {
            const tabs = document.querySelectorAll('a[href*="/multiplayer"]');
            tabs.forEach(tab => {
                tab.setAttribute('style', DISABLED_STYLE);
                tab.setAttribute('title', 'Multiplayer disabled by script');
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function hideMultiplayerTask() {
        const observer = new MutationObserver(() => {
            const taskEl = document.querySelector('[data-qa="game-round-task"]');
            if (taskEl) taskEl.style.display = 'none';
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function disablePlayButtons() {
        const observer = new MutationObserver(() => {
            const playButtons = document.querySelectorAll('button');
            playButtons.forEach(btn => {
                const label = btn.textContent?.toLowerCase();
                if (label && (label.includes('play') || label.includes('start') || label.includes('ready'))) {
                    btn.setAttribute('disabled', 'true');
                    btn.setAttribute('style', DISABLED_STYLE);
                    btn.textContent = 'Disabled';
                }
            });

            const clickableDivs = document.querySelectorAll('div[role="button"]');
            clickableDivs.forEach(div => {
                const label = div.textContent?.toLowerCase();
                if (label && (label.includes('play') || label.includes('start') || label.includes('ready'))) {
                    div.setAttribute('style', DISABLED_STYLE);
                    div.textContent = 'Disabled';
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            disableMultiplayerTab();
            hideMultiplayerTask();
            disablePlayButtons();
        }, 1000);
    });
})();

