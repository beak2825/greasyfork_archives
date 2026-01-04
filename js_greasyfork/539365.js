// ==UserScript==
// @name         Toggle Chat Cleanup (Timestamps & Used Items) - fishtank.live
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Toggle removing chat timestamps and used items with Shift+Y on fishtank.live. Status shows briefly when toggled.
// @author       Blungs
// @match        https://*.fishtank.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539365/Toggle%20Chat%20Cleanup%20%28Timestamps%20%20Used%20Items%29%20-%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/539365/Toggle%20Chat%20Cleanup%20%28Timestamps%20%20Used%20Items%29%20-%20fishtanklive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = true;
    let hideTimeout;

    // --- Create status element (hidden by default) ---
    const statusIndicator = document.createElement('div');
    statusIndicator.style.position = 'fixed';
    statusIndicator.style.bottom = '10px';
    statusIndicator.style.right = '10px';
    statusIndicator.style.padding = '5px 10px';
    statusIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
    statusIndicator.style.color = '#fff';
    statusIndicator.style.fontSize = '12px';
    statusIndicator.style.borderRadius = '5px';
    statusIndicator.style.zIndex = 9999;
    statusIndicator.style.fontFamily = 'monospace';
    statusIndicator.style.display = 'none';
    document.body.appendChild(statusIndicator);

    function showStatus() {
        statusIndicator.textContent = `Chat Cleanup: ${enabled ? 'ON' : 'OFF'}`;
        statusIndicator.style.display = 'block';
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            statusIndicator.style.display = 'none';
        }, 3000);
    }

    // --- Cleanup functions ---
    function removeTimestamps() {
        if (!enabled) return;
        const timestamps = document.querySelectorAll('.chat-message-default_timestamp__sGwZy');
        timestamps.forEach(el => el.remove());
    }

    function removeUsedItems() {
        if (!enabled) return;
        const usedItems = document.querySelectorAll('[class^="chat-message-happening_item__mi9tp"]');
        usedItems.forEach(el => el.remove());
    }

    function handleMutations() {
        removeTimestamps();
        removeUsedItems();
    }

    // --- MutationObserver ---
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Initial cleanup ---
    handleMutations();

    // --- Keyboard toggle ---
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'y') {
            enabled = !enabled;
            showStatus();
        }
    });
})();
