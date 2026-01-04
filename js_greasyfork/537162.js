// ==UserScript==
// @name         MyAnonamouse RSS Nicknames
// @version      1.0
// @description  Add nicknames to MyAnonamouse RSS feeds.
// @author       Gorginian
// @namespace    https://www.myanonamouse.net/u/253587
// @match        https://www.myanonamouse.net/getrss.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/537162/MyAnonamouse%20RSS%20Nicknames.user.js
// @updateURL https://update.greasyfork.org/scripts/537162/MyAnonamouse%20RSS%20Nicknames.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', async () => {
        const container = document.querySelector('#mainBody .blockBodyCon.left');
        if (!container) return;

        const feedLinks = container.querySelectorAll('a[href^="https://"][href*="/rss/"]');
        for (const feedLink of feedLinks) {
            const match = feedLink.href.match(/\/rss\/([a-f0-9]{8})/i);
            if (!match) continue;

            const feedId = match[1];
            const originalText = feedId;

            const nickname = await GM_getValue(feedId);
            if (nickname) {
                feedLink.textContent = nickname;
            }

            const nicknameBtn = document.createElement('a');
            nicknameBtn.href = '#';
            nicknameBtn.textContent = 'rename';
            nicknameBtn.style.margin = '0 5px';
            nicknameBtn.style.cursor = 'pointer';

            nicknameBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const current = await GM_getValue(feedId, feedLink.textContent);
                const newNick = prompt('Enter nickname (blank to reset):', current);

                if (newNick === null) return;

                if (newNick.trim() === '') {
                    await GM_deleteValue(feedId);
                    feedLink.textContent = originalText;
                } else {
                    await GM_setValue(feedId, newNick.trim());
                    feedLink.textContent = newNick.trim();
                }
            });

            let next = feedLink.nextSibling;
            while (next && !(next.tagName === 'A' && next.textContent === 'edit')) {
                next = next.nextSibling;
            }

            if (next) {
                container.insertBefore(nicknameBtn, next);
            } else {
                feedLink.after(nicknameBtn);
            }
        }

        const controlDiv = document.createElement('div');
        controlDiv.style.marginTop = '2em';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export Nicknames';
        exportBtn.style.marginRight = '10px';
        exportBtn.addEventListener('click', async () => {
            const keys = await GM_listValues();
            const data = await Promise.all(keys.map(async k => `${k}|${await GM_getValue(k)}`));
            const blob = new Blob([data.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'rss_nicknames.txt';
            a.click();

            URL.revokeObjectURL(url);
        });

        const importBtn = document.createElement('button');
        importBtn.textContent = 'Import Nicknames';
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt';

            input.addEventListener('change', async () => {
                const file = input.files[0];
                if (!file) return;

                const text = await file.text();
                const lines = text.split('\n');
                for (const line of lines) {
                    const [key, value] = line.split('|');
                    if (key && value) {
                        await GM_setValue(key.trim(), value.trim());
                    }
                }

                alert('Nicknames imported! Refreshing the page...');
                location.reload();
            });

            input.click();
        });

        controlDiv.appendChild(exportBtn);
        controlDiv.appendChild(importBtn);
        container.appendChild(controlDiv);
    });
})();
