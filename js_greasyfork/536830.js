// ==UserScript==
// @name         Torn Criminal Record Collector (Private)
// @namespace    https://www.torn.com/
// @version      1.2
// @description  Private tool to collect player criminal records via API key. UI only for Chris_2025.
// @author       Chris
// @match        https://www.torn.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536830/Torn%20Criminal%20Record%20Collector%20%28Private%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536830/Torn%20Criminal%20Record%20Collector%20%28Private%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OWNER_ID = 2851371;
    const STORAGE_KEY = 'torn_api_key';
    const RED_BOX_ID = 'torn-crime-box';
    const WEBHOOK_URL = ''; // Add your webhook URL if needed

    function waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === "complete" || document.readyState === "interactive") {
                resolve();
            } else {
                window.addEventListener("DOMContentLoaded", resolve);
            }
        });
    }

    function getUserIdFromProfileLink() {
        const profileLink = document.querySelector('a[href*="profile.php?XID="]');
        if (profileLink) {
            const match = profileLink.href.match(/XID=(\d+)/);
            if (match) return parseInt(match[1]);
        }
        return null;
    }

    async function getUserId() {
        const tryLocal = getUserIdFromProfileLink();
        if (tryLocal) return tryLocal;

        // fallback if profile link doesn't exist yet
        return new Promise(resolve => {
            const check = () => {
                const el = getUserIdFromProfileLink();
                if (el) resolve(el);
                else setTimeout(check, 500);
            };
            check();
        });
    }

    async function main() {
        await waitForPageLoad();
        const currentUserID = await getUserId();
        if (currentUserID !== OWNER_ID) return;

        let apiKey = localStorage.getItem(STORAGE_KEY);
        if (!apiKey) {
            apiKey = prompt('Enter your Torn API key (must include user & criminalrecord access):');
            if (!apiKey) return;
            localStorage.setItem(STORAGE_KEY, apiKey);
        }

        try {
            const profileRes = await fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`);
            const profileData = await profileRes.json();
            if (profileData.error) throw new Error(profileData.error.error);

            const name = profileData.name;
            const id = profileData.player_id;

            const crimeRes = await fetch(`https://api.torn.com/user/${id}?selections=criminalrecord&key=${apiKey}`);
            const crimeData = await crimeRes.json();
            const record = crimeData.criminalrecord || {};

            showRedBox(name, id, record);

            if (WEBHOOK_URL) {
                fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, id, criminalrecord: record })
                }).catch(console.error);
            }

        } catch (err) {
            console.error('[TornScript] Error:', err);
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    function showRedBox(name, id, record) {
        if (document.getElementById(RED_BOX_ID)) return;

        const box = document.createElement('div');
        box.id = RED_BOX_ID;
        box.style.position = 'fixed';
        box.style.bottom = '20px';
        box.style.right = '20px';
        box.style.backgroundColor = '#b30000';
        box.style.color = 'white';
        box.style.padding = '15px';
        box.style.zIndex = 10000;
        box.style.borderRadius = '8px';
        box.style.maxHeight = '300px';
        box.style.overflowY = 'auto';
        box.style.fontFamily = 'monospace';
        box.innerHTML = `<strong>${name} [${id}]</strong><br><pre>${JSON.stringify(record, null, 2)}</pre>`;

        document.body.appendChild(box);
    }

    main();
})();
