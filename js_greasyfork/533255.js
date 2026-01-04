// ==UserScript==
// @name         YouTube Members-only videos Shortcut
// @version      1.0
// @description  Add a "Members-only videos" button next to the YouTube channel name.
// @author       gcobc12632
// @match        https://www.youtube.com/@*
// @match        https://www.youtube.com/channel/*
// @icon         https://www.youtube.com/img/favicon_48.png
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/153594
// @downloadURL https://update.greasyfork.org/scripts/533255/YouTube%20Members-only%20videos%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/533255/YouTube%20Members-only%20videos%20Shortcut.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'my-will-button';

    function createPlaylistUrl(channelId) {
        const playlistId = 'UUMO' + channelId.slice(2);
        return `https://www.youtube.com/playlist?list=${playlistId}`;
    }

    function createButton(playlistUrl) {
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.textContent = 'Members-only';
        button.className = 'will-button';
        button.addEventListener('click', () => {
            window.open(playlistUrl, '_blank');
        });
        return button;
    }

    function injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .will-button {
                padding: 6px 12px;
                background-color: black;
                color: white;
                border: 1px solid white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
                transition: background-color 0.3s;
            }
            .will-button:hover {
                background-color: #222;
            }
            .will-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    function tryInject() {
        const spanWithItemId = document.querySelector('span[itemprop="item"][itemid]');
        const targetSpan = document.querySelector('span.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap');

        if (!spanWithItemId || !targetSpan) return;
        if (document.getElementById(BUTTON_ID)) return;

        const itemid = spanWithItemId.getAttribute('itemid');
        const match = itemid.match(/\/channel\/(UC[\w-]+)/);
        if (!match) return;

        const channelId = match[1];
        const playlistUrl = createPlaylistUrl(channelId);

        const wrapper = document.createElement('div');
        wrapper.className = 'will-wrapper';

        targetSpan.replaceWith(wrapper);
        wrapper.appendChild(targetSpan);

        const button = createButton(playlistUrl);
        wrapper.appendChild(button);
    }

    function observeDOM() {
        const observer = new MutationObserver(() => tryInject());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        injectStyle();
        tryInject();
        observeDOM();
    });
})();
