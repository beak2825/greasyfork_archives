// ==UserScript==
// @name         JFK Bumper
// @namespace    http://github.com/Snxhit
// @version      0.1.0
// @description  Get those threads up!
// @author       Snxhit
// @match        https://www.torn.com/index.php
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/travel*
// @icon         https://www.freeiconspng.com/thumbs/up-arrow-png/black-up-arrow-png-6.png
// @grant        none
// @license      mit
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532229/JFK%20Bumper.user.js
// @updateURL https://update.greasyfork.org/scripts/532229/JFK%20Bumper.meta.js
// ==/UserScript==

// VERSION 0.1.0 IS THE FIRST RELEASE VERSION
// THIS IS A SCRIPT WRITTEN IN TAMPERMONKEY

(function () {
    'use strict';

    const THREADS = {
        16407821: 'Misfits',
        16039252: 'Main/2.1',
        16408029: 'Future Killers'
    };
    const STORAGE_KEY = 'bump_checker';

    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        apiKey: '',
        hourLimit: 3,
        bumpMsg: "i like colorful colors so im gonna do a colorful bump yay"
    };

    const containerStyle = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        background: #111;
        color: #fff;
        padding: 0;
        border: 1px solid #444;
        border-radius: 6px;
        font-family: monospace;
        font-size: 14px;
        width: 280px;
        overflow: hidden;
    `;

    const headerStyle = `
        background: #222;
        padding: 8px 10px;
        cursor: pointer;
        border-bottom: 1px solid #333;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const listStyle = `
        list-style: none;
        padding: 10px;
        margin: 0;
    `;

    const settingsStyle = `
        display: none;
        flex-direction: column;
        padding: 10px;
        background: #1a1a1a;
        border-top: 1px solid #333;
        gap: 6px;
    `;

    const gearStyle = `
        color: #aaa;
        cursor: pointer;
        font-size: 16px;
    `;

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function createUI() {
        const container = document.createElement('div');
        container.setAttribute('style', containerStyle);
        container.id = 'bump-checker';

        const header = document.createElement('div');
        header.setAttribute('style', headerStyle);
        header.innerHTML = `<span>📋 Bumpable JFK Threads</span><span id="gear" style="${gearStyle}">⚙️</span>`;

        const list = document.createElement('ul');
        list.setAttribute('style', listStyle);
        list.id = 'bump-list';

        const copyButton = document.createElement('button');
        copyButton.textContent = '📋 Copy Bump Msg';
        copyButton.style = 'width: 100%; background: #222; color: #fff; border: none; padding: 6px; cursor: pointer;';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(settings.bumpMsg || '').then(() => {
                copyButton.textContent = '✅ Copied!';
                setTimeout(() => copyButton.textContent = '📋 Copy Bump Msg', 1500);
            });
        });

        const settingsPanel = document.createElement('div');
        settingsPanel.setAttribute('style', settingsStyle);
        settingsPanel.id = 'settings-panel';

        settingsPanel.innerHTML = `
            <label>API Key:<br><input id="api-key-input" type="text" style="width: 100%;" value="${settings.apiKey}"></label>
            <small style="color: #888;">Only a Public Access key is required!</small>
            <label>Bump Limit (hours):<br><input id="hour-input" type="number" min="0" step="0.1" style="width: 100%;" value="${settings.hourLimit}"></label>
            <label>Bump Message: <br><input id="bump-message" type="text" style="width: 100%;" value="${settings.bumpMsg}"></label>
            <small style="color: #888;">Works in plaintext only, I can't figure out colors yet. (Message is modifiable!)</small>
            <button id="save-settings" style="margin-top: 4px; color: white;">Save Config</button>
        `;

        container.appendChild(header);
        container.appendChild(settingsPanel);
        container.appendChild(list);
        container.appendChild(copyButton);
        document.body.appendChild(container);

        header.addEventListener('click', (e) => {
            if (e.target.id !== 'gear') {
                list.style.display = list.style.display === 'none' ? 'block' : 'none';
                copyButton.style.display = list.style.display;
            }
        });

        document.getElementById('gear').addEventListener('click', (e) => {
            e.stopPropagation();
            const panel = document.getElementById('settings-panel');
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            settings.apiKey = document.getElementById('api-key-input').value.trim();
            settings.bumpMsg = document.getElementById('bump-message').value;
            settings.hourLimit = parseFloat(document.getElementById('hour-input').value);
            saveSettings();
            document.getElementById('bump-list').innerHTML = '';
            runChecks();
        });
    }

    function addListItem(threadId, customName, hoursAgo, isBumpable) {
        const list = document.getElementById('bump-list');
        const item = document.createElement('li');
        const icon = isBumpable ? '❌' : '✅';
        const threadUrl = `https://www.torn.com/forums.php#/p=threads&f=24&t=${threadId}&b=0&a=0`;

        item.innerHTML = `${icon} <a href="${threadUrl}" target="_blank" style="color: #7ec8ff;">${customName}</a> (${hoursAgo.toFixed(2)}h)`;
        list.appendChild(item);
    }

    function checkThread(threadId, customName) {
        const url = `https://api.torn.com/v2/forum/${threadId}/thread?key=${settings.apiKey}`;

        return fetch(url)
            .then(res => res.json())
            .then(data => {
                const lastPostTime = data.thread.last_post_time * 1000;
                const hoursAgo = (Date.now() - lastPostTime) / (1000 * 60 * 60);
                const isBumpable = hoursAgo <= settings.hourLimit;
                addListItem(threadId, customName, hoursAgo, isBumpable);
            })
            .catch(() => {
                addListItem(threadId, `${customName} (error)`, 0, false);
            });
    }

    function runChecks() {
        for (const [threadId, customName] of Object.entries(THREADS)) {
            checkThread(threadId, customName);
        }
    }

    window.addEventListener('load', () => {
        createUI();
        if (settings.apiKey) runChecks();
    });
})();
