// ==UserScript==
// @name         Torn Defender Last Action
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Shows defender's last action and allows API key reset.
// @license      MIT
// @match        www.torn.com/loader.php?sid=attack&user2ID=*
// @connect      api.torn.com
// @author       aquagloop
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/545433/Torn%20Defender%20Last%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/545433/Torn%20Defender%20Last%20Action.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE = 'TORN_API_KEY_LastAction';
    let lastActionTimer = null;
    let lastKnownTimestamp = 0;

    GM_registerMenuCommand('Reset API Key', () => {
        GM_deleteValue(API_KEY_STORAGE);
        alert('Your Torn API key has been removed. The page will reload, and you will be prompted for a new key.');
        window.location.reload();
    });

    function formatTimeAgo(totalSeconds) {
        if (totalSeconds < 0) totalSeconds = 0;
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        if (d > 0) return `${d}d ${h}h ago`;
        if (h > 0) return `${h}h ${m}m ago`;
        if (m > 0) return `${m}m ${s}s ago`;
        return `${s}s ago`;
    }

    function runFeature() {

        const POLLING_INTERVAL_MS = 5000;

        const apiKey = getApiKey();
        if (!apiKey) return;

        const urlParams = new URLSearchParams(window.location.search);
        const defenderId = urlParams.get('user2ID');
        if (!defenderId) return;

        const displayElement = createDisplayElement();
        if (!displayElement) return;

        function getApiKey() {
            let apiKey = GM_getValue(API_KEY_STORAGE, null);
            if (!apiKey) {
                apiKey = prompt('Please enter your Torn API key (Public or Limited Access is fine).');
                if (apiKey) GM_setValue(API_KEY_STORAGE, apiKey);
            }
            return apiKey;
        }

        function createDisplayElement() {
            const titleContainer = document.querySelector('div[class*="titleContainer"]');
            if (!titleContainer) return null;

            Object.assign(titleContainer.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const rightGroup = document.createElement('div');
            Object.assign(rightGroup.style, { display: 'flex', alignItems: 'center', gap: '15px' });
            const backLink = titleContainer.querySelector('a[href*="profiles.php"]');
            const infoPill = document.createElement('div');
            const clockIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;

            Object.assign(infoPill.style, { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '5px 10px', borderRadius: '5px', border: '1px solid #111', color: '#e0e0e0', fontSize: '13px', textShadow: '0 1px 1px #000' });

            const iconSpan = document.createElement('span');
            iconSpan.innerHTML = clockIconSVG;
            Object.assign(iconSpan.style, { display: 'flex', alignItems: 'center', opacity: '0.7' });

            const statusSpan = document.createElement('span');
            statusSpan.textContent = 'Polling...';

            infoPill.appendChild(iconSpan);
            infoPill.appendChild(statusSpan);
            rightGroup.appendChild(infoPill);
            if (backLink) rightGroup.appendChild(backLink);
            titleContainer.appendChild(rightGroup);
            return statusSpan;
        }

        function pollApi() {
             GM_xmlhttpRequest({
                 method: "GET",
                 url: `https://api.torn.com/user/${defenderId}?selections=profile&key=${apiKey}`,
                 onload: function(response) {
                     if (response.status === 200) {
                         const data = JSON.parse(response.responseText);
                         if (data.error) {
                             if (lastActionTimer) clearInterval(lastActionTimer);
                             displayElement.textContent = `API Error`;
                             displayElement.style.color = '#e53935';
                             displayElement.parentElement.title = data.error.error;
                             if (data.error.code === 2) {
                                 // Stop polling for invalid key error
                                 if (apiPollTimer) clearInterval(apiPollTimer);
                             }
                             return;
                         }

                         const newTimestamp = data.last_action ? data.last_action.timestamp : 0;
                         if (newTimestamp > 0 && newTimestamp !== lastKnownTimestamp) {
                             lastKnownTimestamp = newTimestamp;
                             const status = data.last_action.status;
                             let statusColor = '#f0f0f0';

                             if (status === 'Online') statusColor = '#4CAF50';
                             else if (status === 'Idle') statusColor = '#FFC107';

                             displayElement.style.fontWeight = 'bold';
                             displayElement.style.color = statusColor;

                             if (lastActionTimer) clearInterval(lastActionTimer);
                             lastActionTimer = setInterval(() => {
                                 const now = Math.floor(Date.now() / 1000);
                                 const secondsAgo = now - lastKnownTimestamp;
                                 displayElement.textContent = formatTimeAgo(secondsAgo);
                             }, 1000);
                         } else if (!data.last_action) {
                             displayElement.textContent = 'Unknown';
                         }
                     } else {
                         displayElement.textContent = `HTTP Error ${response.status}`;
                         displayElement.style.color = '#e53935';
                     }
                 },
                 onerror: function() {
                     displayElement.textContent = `Network Error`;
                     displayElement.style.color = '#e53935';
                 }
             });
        }


        pollApi();
        const apiPollTimer = setInterval(pollApi, POLLING_INTERVAL_MS);
    }

    const observer = new MutationObserver((mutationsList, obs) => {
        const targetNode = document.querySelector('div[class*="titleContainer"]');
        if (targetNode) {
            runFeature();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();