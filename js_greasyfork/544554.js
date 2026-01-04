// ==UserScript==
// @name         TwitchElo
// @namespace    http://tampermonkey.net/
// @version      2025-08-09
// @description  Check and report twitch chatters LoL Elo
// @author       AECX
// @match        https://www.twitch.tv/*
// @icon         https://share.henke.gg/r/Lsua5w.png
// @grant        GM_addStyle
// @run-at       document-end
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/544554/TwitchElo.user.js
// @updateURL https://update.greasyfork.org/scripts/544554/TwitchElo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const scriptTag = '[Twitch Elo Beta]';
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL
    const SCAN_INTERVAL_MS = 2000; // scan chat lines every 2 seconds

    GM_addStyle(`
    .custom-badge {
        position: relative;
        width: 24px;
        height: 24px;
        margin-right: 4px;
        cursor: pointer;
        vertical-align: middle;
        user-select: none;
    }
    .badge-wrapper {
        position: relative;
        width: 24px;
        height: 24px;
        margin-right: 4px;
        cursor: pointer;
        vertical-align: middle;
        user-select: none;
        display: inline-block;
    }
    .badge-verified::after {
        content: '';
        position: absolute;
        top: -3px;
        right: -3px;
        width: 12px;
        height: 12px;
        background-image: url('https://upload.wikimedia.org/wikipedia/commons/5/50/Yes_Check_Circle.svg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 2;
        pointer-events: none;
    }

        .custom-popup {
            position: absolute;
            z-index: 9999;
            background: #18181b;
            color: white;
            padding: 15px;
            border: 1px solid #555;
            border-radius: 6px;
            box-shadow: 0 0 10px #000;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            max-width: 320px;
            box-sizing: border-box;
            text-align: center;
        }
        .custom-popup img {
            width: 100px;
            margin: 0 auto;
            height: auto;
            display: block;
        }
        .custom-popup button {
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
            border: none;
            background-color: #9147ff;
            color: white;
            align-self: stretch;
        }
    `);

    let userCache = {};
    try {
        const stored = localStorage.getItem('twitchEloUserCache');
        if (stored) userCache = JSON.parse(stored);
    } catch (e) {
        console.warn(scriptTag, 'Failed to load cache', e);
        userCache = {};
    }

    function saveCache() {
        try {
            localStorage.setItem('twitchEloUserCache', JSON.stringify(userCache));
        } catch (e) {
            console.warn(scriptTag, 'Failed to save cache', e);
        }
    }

    function removePopups() {
        document.querySelectorAll('.custom-popup').forEach(p => p.remove());
    }

    function extractUsername(displayName) {
        const m = displayName.match(/\(([^)]+)\)/);
        return m ? m[1] : displayName;
    }

    function insertBadgeBeforeUserEl(userEl, badge) {
        if (userEl.parentElement) {
            userEl.parentElement.insertBefore(badge, userEl);
        }
    }

function addBadge(userEl, username, data) {
    if (!userEl) return;

    if (userEl.parentElement.querySelector('.custom-badge')) return;

    const badgeWrapper = document.createElement('div');
    badgeWrapper.className = 'badge-wrapper custom-badge';

    const badge = document.createElement('img');

    if(data?.status === "Verified") {
        badgeWrapper.classList.add('badge-verified');
    }

    const imageUrl = 'https://raw.githubusercontent.com/InFinity54/LoL_DDragon/refs/heads/master/extras/tier/' + (data?.elo || 'default').toLowerCase() + '.png';
    badge.src = imageUrl;
    badge.style.width = '100%';
    badge.style.height = '100%';

    badgeWrapper.appendChild(badge);

    badgeWrapper.addEventListener('click', e => {
        e.stopPropagation();
        removePopups();

        const popup = document.createElement('div');
        popup.className = 'custom-popup';

        // Only display elo (Bronze, Silver, ...) unless server lp and rank are known (verified) then display details
        let elostring = `${data?.elo}`;

        if (data?.server && data?.lp && data?.rank) {
            if (data?.rank > 7)
            {
                // Master+
                elostring = `${data.server} ${data.elo} ${data.lp}LP`;
            }
            else
            {
                elostring = `${data.server} ${data.elo} ${data.tier}`;
            }
        }

        popup.innerHTML = `
            <div style="margin-bottom:10px; width: 100%;"><strong>${data?.status}</strong>
            <img src="${imageUrl}" alt="Badge Image"/>
            <span>${elostring}</span>
            </div>
            <button id="voteEloBtn">Vote ${username}'s Elo</button>
        `;

        document.body.appendChild(popup);

        const rect = badge.getBoundingClientRect();
        const popupWidth = 320;
        const popupHeight = 220;

        let left = rect.left + window.scrollX;
        if (left + popupWidth > window.scrollX + window.innerWidth) {
            left = window.scrollX + window.innerWidth - popupWidth - 10;
        }
        if (left < window.scrollX) left = window.scrollX + 10;

        let top = rect.top + window.scrollY - popupHeight - 8;
        if (top < window.scrollY) {
            top = rect.bottom + window.scrollY + 8;
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;

        popup.querySelector('#voteEloBtn').addEventListener('click', () => {
            const newPopup = window.open(
                `https://aecx.cc/report.php?user=${encodeURIComponent(username)}`,
                'popupWindow',
                'width=600,height=400'
            );

            const checkPopupClosed = setInterval(() => {
                if (newPopup.closed) {
                    clearInterval(checkPopupClosed);
                }
            }, 500);
        });

        setTimeout(() => {
            document.addEventListener('click', removePopups, { once: true });
        }, 100);
    });

    insertBadgeBeforeUserEl(userEl, badgeWrapper);
}

function fetchBadgeData(username, userEl) {
    fetch(`https://aecx.cc/?username=${encodeURIComponent(username)}`)
        .then(r => r.json())
        .then(data => {
            userCache[username] = {
                status: 'done',
                data,
                fetchedAt: Date.now()
            };
            saveCache();

            if (document.contains(userEl)) {
                addBadge(userEl, username, data);
            }
        })
        .catch(err => {
            console.error(scriptTag, `Failed to fetch badge for ${username}`, err);
            userCache[username] = { status: 'done', data: null, fetchedAt: Date.now() };
            saveCache();
        });
}


    function getUsernameSpan(chatLine) {
        const selectors = [
            'span.seventv-chat-user-username',
            'span.chat-line__username'
        ];
        for (const sel of selectors) {
            const el = chatLine.querySelector(sel);
            if (el) return el;
        }
        return null;
    }

    function processChatLine(chatLine) {
        if (!(chatLine instanceof HTMLElement)) return;

        const userEl = getUsernameSpan(chatLine);
        if (!userEl) return;

        const rawName = userEl.textContent.trim();
        const username = extractUsername(rawName).toLowerCase(); // always use extracted form

        if (chatLine.querySelector('.custom-badge')) return; // already has badge

        const cacheEntry = userCache[username];
        const now = Date.now();

        if (cacheEntry?.status === 'done') {
            addBadge(userEl, username, cacheEntry.data);
            if (!cacheEntry.fetchedAt || now - cacheEntry.fetchedAt > CACHE_TTL) {
                fetchBadgeData(username, userEl);
            }
        } else if (!cacheEntry) {
            userCache[username] = { status: 'pending' };
            fetchBadgeData(username, userEl);
        }
    }

    function scanAllChatLines() {
        let chatContainer = document.querySelector('[role="log"]');
        let chatContainer7TV = document.querySelector('main.seventv-chat-list');

        if (chatContainer7TV)
        {
            chatContainer = chatContainer7TV;
        }

        let chatLines = chatContainer.querySelectorAll('.chat-line__message');
        if (!chatLines) {
            chatLines = chatContainer.querySelectorAll('.seventv-user-message');
        }
        chatLines.forEach(processChatLine);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                if (node.classList.contains('chat-line__message') || node.classList.contains('.seventv-user-message')) {
                    processChatLine(node);
                } else {
                    node.querySelectorAll('.chat-line__message').forEach(processChatLine);
                    node.querySelectorAll('.seventv-user-message').forEach(processChatLine);
                }
            });
        });
    });

    function waitForChat() {
        const chatContainer = document.querySelector('[role="log"]');
        const chatContainer7TV = document.querySelector('main.seventv-chat-list');

        if (chatContainer7TV) {
            console.log('Observing 7TV chat');
            observer.observe(chatContainer7TV, { childList: true, subtree: true });
            scanAllChatLines();
            setInterval(scanAllChatLines, SCAN_INTERVAL_MS);
        }
        else if (chatContainer) {
            console.log('Observing Normal chat');
            observer.observe(chatContainer, { childList: true, subtree: true });
            scanAllChatLines();
            setInterval(scanAllChatLines, SCAN_INTERVAL_MS);
        }
        else {
            setTimeout(waitForChat, 1000);
        }
    }

    // Reload the tool when location (primarily streamer) changes
const observeUrlChange = () => {
  let oldHref = document.location.href;
  const body = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
              setTimeout( ()=>{
                  console.log('waiting for chat');
                  waitForChat();
        }, 3000);
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

window.onload = observeUrlChange;

    window.addEventListener('load', () => {
        setTimeout( ()=>{
        console.log('waiting for chat');
        waitForChat();
        }, 3000);
    });

})();