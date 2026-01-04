// ==UserScript==
// @name         RSS+ Enhancer
// @namespace    Eliminater74
// @version      2.6
// @description  Show all RSS/Atom/JSON feeds with UI, smart guessing, copy features, feed counter, and draggable floating icon.
// @author       Eliminater74
// @license      MIT
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/538003/RSS%2B%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538003/RSS%2B%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const foundFeeds = [];

    function isValidFeed(link) {
        const types = [
            "application/rss+xml",
            "application/atom+xml",
            "application/json",
            "application/feed+json"
        ];
        return types.includes(link.type);
    }

    function getFeeds() {
        const links = [...document.querySelectorAll('link')];
        const guesses = [
            '/feed', '/rss', '/rss.xml', '/atom.xml', '/feeds/posts/default', '/?feed=rss2'
        ];

        links.forEach(link => {
            if (isValidFeed(link)) {
                foundFeeds.push({ title: link.title || link.href, href: link.href });
            }
        });

        guesses.forEach(path => {
            try {
                const testURL = new URL(path, location.href).href;
                fetch(testURL, { method: 'GET' }).then(resp => {
                    if (resp.ok) {
                        resp.text().then(txt => {
                            if (txt.includes("<rss") || txt.includes("<feed") || txt.includes("application/json")) {
                                if (!foundFeeds.find(f => f.href === testURL)) {
                                    foundFeeds.push({ title: testURL, href: testURL });
                                    updatePanel();
                                }
                            }
                        });
                    }
                }).catch(() => {});
            } catch {}
        });
    }

    function createUI() {
        const icon = document.createElement('div');
        icon.id = 'rssPlusIcon';
        icon.textContent = '📡';
        icon.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 24px;
            background: #222;
            color: #fff;
            padding: 10px 14px;
            border-radius: 50%;
            z-index: 999999;
            cursor: grab;
            box-shadow: 0 0 10px #000;
            user-select: none;
        `;

        const badge = document.createElement('span');
        badge.id = 'rssCount';
        badge.style.cssText = `
            position: absolute;
            top: -6px;
            right: -6px;
            background: red;
            color: white;
            font-size: 12px;
            border-radius: 50%;
            padding: 2px 5px;
            display: none;
        `;
        icon.appendChild(badge);

        // Drag handling
        let isDragging = false;
        let offsetX, offsetY;

        icon.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - icon.getBoundingClientRect().left;
            offsetY = e.clientY - icon.getBoundingClientRect().top;
            icon.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            icon.style.left = 'unset';
            icon.style.top = e.clientY - offsetY + 'px';
            icon.style.right = 'unset';
            icon.style.left = e.clientX - offsetX + 'px';
            icon.style.bottom = 'unset';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                icon.style.cursor = 'grab';
            }
        });

        icon.onclick = () => {
            const panel = document.getElementById('rssPanel');
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        };

        document.body.appendChild(icon);

        const panel = document.createElement('div');
        panel.id = 'rssPanel';
        panel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: #2c2c2c;
            color: white;
            font-family: sans-serif;
            padding: 10px;
            border-radius: 6px;
            box-shadow: 0 0 15px #000;
            z-index: 999998;
            max-width: 400px;
            min-width: 250px;
            display: none;
        `;

        panel.innerHTML = `<div style="font-weight:bold; margin-bottom: 6px;">RSS Feeds Found:</div><div id="rssFeedList"></div>
            <div style="margin-top: 10px;">
                <button id="rssCopyAll">Copy All</button>
                <button id="rssToggleTheme">Toggle Theme</button>
                <button id="rssHide">Hide</button>
            </div>`;

        document.body.appendChild(panel);

        document.getElementById('rssCopyAll').onclick = () => {
            const text = foundFeeds.map(f => f.href).join('\n');
            GM_setClipboard(text);
            alert("All RSS feed URLs copied to clipboard!");
        };

        document.getElementById('rssToggleTheme').onclick = () => {
            const dark = panel.style.background === 'white';
            panel.style.background = dark ? '#2c2c2c' : 'white';
            panel.style.color = dark ? 'white' : 'black';
        };

        document.getElementById('rssHide').onclick = () => {
            panel.style.display = 'none';
        };
    }

    function updatePanel() {
        const list = document.getElementById('rssFeedList');
        const badge = document.getElementById('rssCount');
        if (!list || !badge) return;

        list.innerHTML = '';
        foundFeeds.forEach(f => {
            const row = document.createElement('div');
            row.style.marginBottom = '6px';

            const link = document.createElement('a');
            link.href = f.href;
            link.target = '_blank';
            link.textContent = f.title.length > 60 ? f.title.slice(0, 60) + '…' : f.title;
            link.style.cssText = `color: #4FC3F7; word-break: break-all;`;

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋';
            copyBtn.style.cssText = `margin-left: 5px;`;
            copyBtn.onclick = () => GM_setClipboard(f.href);

            row.appendChild(link);
            row.appendChild(copyBtn);
            list.appendChild(row);
        });

        badge.style.display = foundFeeds.length ? 'block' : 'none';
        badge.textContent = foundFeeds.length;
    }

    window.addEventListener('load', () => {
        createUI();
        getFeeds();
        setTimeout(updatePanel, 2500);
    });
})();
