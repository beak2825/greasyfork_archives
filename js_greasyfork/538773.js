// ==UserScript==
// @name         Discord Helper
// @namespace    https://greasyfork.org/users/1179204
// @version      0.1.2
// @description  Click copy message ID | Shift+Click timestamp | Ctrl+Click message link
// @author       KaKa
// @match        https://discord.com/channels/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538773/Discord%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/538773/Discord%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'discord_helper_enabled';
    let enabled = localStorage.getItem(STORAGE_KEY) !== 'false';

    /* ---------- utils ---------- */

    function flash(el, color) {
        el.style.setProperty('--dh-color', color);
        el.classList.add('dh-flash');

        setTimeout(() => {
            el.classList.remove('dh-flash');
            el.style.removeProperty('--dh-color');
        }, 450);
    }

    function copy(text) {
        return navigator.clipboard.writeText(text);
    }

    function getMessageElement(target) {
        return target.closest('[id^="chat-messages-"]');
    }

    function getMessageId(messageEl) {
        const rawId = messageEl.id.replace('chat-messages-', '');
        const parts = rawId.split('-');
        return parts[1] || parts[0];
    }

    function getTimestamp(messageEl) {
        const timeEl = messageEl.querySelector('time');
        if (!timeEl) return '';

        const iso = timeEl.getAttribute('datetime');
        if (!iso) return '';

        return Math.floor(new Date(iso).getTime() / 1000).toString();
    }


    function getMessageLink(messageId) {
        const parts = location.pathname.split('/');

        // ['', 'channels', guildId | '@me', channelId]
        if (parts.length < 4) return '';

        const guildId = parts[2];
        const channelId = parts[3];

        return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
    }

    /* ---------- click handler ---------- */

    document.addEventListener(
        'click',
        (event) => {
            if (!enabled) return;

            const messageEl = getMessageElement(event.target);
            if (!messageEl) return;

            event.preventDefault();
            event.stopPropagation();

            const messageId = getMessageId(messageEl);

            if (event.shiftKey) {
                const ts = getTimestamp(messageEl);
                if (!ts) return;
                copy(ts).then(() => flash(messageEl, '#FEE75C'));
                return;
            }

            // Ctrl + Click → message link
            if (event.ctrlKey) {
                const link = getMessageLink(messageId);
                copy(link).then(() => flash(messageEl, '#3BA55D'));
                return;
            }

            copy(messageId).then(() => flash(messageEl, '#ED4245'));
        },
        true
    );

    /* ---------- toggle button ---------- */

    GM_addStyle(`
        #dh-toggle {
            position: fixed;
            top: 4px;
            right: 120px;
            width: 25px;
            height: 25px;
            border-radius: 6px;
            background: rgba(88,101,242,0.9);
            color: #fff;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            user-select: none;
            opacity: 0.6;
        }
        .dh-flash {
            position: relative;
            border-radius: 4px;
            box-shadow: 0 0 0 1px var(--dh-color),
                    0 0 12px var(--dh-color);
            transition: box-shadow 0.15s ease;
        }
        #dh-toggle.disabled {
            background: rgba(80,80,80,0.8);
            opacity: 0.35;
        }
        #dh-toggle:hover {
            opacity: 1;
        }
    `);

    function createToggle() {
        const btn = document.createElement('div');
        btn.id = 'dh-toggle';
        btn.textContent = '⧉';
        btn.title = 'Discord Helper Toggle';

        if (!enabled) btn.classList.add('disabled');

        btn.addEventListener('click', () => {
            enabled = !enabled;
            localStorage.setItem(STORAGE_KEY, String(enabled));
            btn.classList.toggle('disabled', !enabled);
        });

        document.body.appendChild(btn);
    }

    createToggle();
})();
