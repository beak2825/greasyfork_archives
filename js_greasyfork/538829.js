// ==UserScript==
// @name        ChatGPT bring back date grouping
// @version     2.1
// @author      tiramifue
// @description Brings back the date grouping on chatgpt.com
// @match       https://chatgpt.com/*
// @run-at      document-end
// @namespace   https://greasyfork.org/users/570213
// @license     Apache-2.0
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/538829/ChatGPT%20bring%20back%20date%20grouping.user.js
// @updateURL https://update.greasyfork.org/scripts/538829/ChatGPT%20bring%20back%20date%20grouping.meta.js
// ==/UserScript==

// updated 2025-09-30

(function () {
    'use strict';

    let groupBy = GM_getValue('groupBy', 'updated');

    GM_addStyle(`
.__chat-group-header {
    font-weight: normal;
    padding: 6px 10px;
    font-size: 0.85rem;
    color: #999;
    margin-top: 0;
}

.__chat-group-header:not(:first-of-type) {
    margin-top: 12px;
}

.__chat-date-label {
    position: absolute;
    top: 0;
    right: 12px;
    font-size: 0.7rem;
    color: #888;
    pointer-events: none;
    background-color: transparent;
    line-height: 1;
    text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

.__chat-timestamp {
    position: absolute;
    right: 8px;
    top: -1px;
    font-size: 0.7rem;
    color: #999;
    pointer-events: none;
}
.__hide-timestamps .__chat-timestamp {
    display: none;
}

.__timestamp-icon {
    position: relative;
    display: inline-block;
    opacity: 1;
    transition: opacity 0.2s;
}

.__timestamp-icon.__disabled {
    opacity: 0.5;
}

.__timestamp-icon.__disabled::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 110%;
    height: 0;
    border-top: 2px solid #fff;
    transform: translate(-50%, -50%) rotate(-45deg);
    transform-origin: center;
    pointer-events: none;
}
    `)

    function getDateGroupLabel(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const msInDay = 24 * 60 * 60 * 1000;
        const daysAgo = Math.floor((now - date) / msInDay);
        const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

        if (daysAgo <= 0) return 'Today';
        if (daysAgo === 1) return 'Yesterday';
        if (daysAgo <= 6) return `${daysAgo} days ago`;
        if (daysAgo <= 13) return 'Last week';
        if (daysAgo <= 20) return '2 weeks ago';
        if (daysAgo <= 31) return 'Last month';
        if (monthsAgo <= 11) return `${monthsAgo} months ago`;
        return 'Last year';
    }

    function getReactFiber(dom) {
        for (const key in dom) {
            if (key.startsWith('__reactFiber$')) return dom[key];
        }
        return null;
    }

    function extractChatInfo(fiber) {
        const c = fiber.memoizedProps?.conversation;
        return c
            ? {
            id: c.id,
            title: c.title,
            created: c.create_time,
            updated: c.update_time,
            node: fiber.stateNode
        }
        : null;
    }

    const seenIds = new Set();
    const chatList = [];

    function processNewChatNode(node) {
        const fiber = getReactFiber(node);
        if (!fiber) return;

        let current = fiber;
        while (current && !current.memoizedProps?.conversation) {
            current = current.return;
        }

        if (!current || !current.memoizedProps?.conversation) return;

        const chat = extractChatInfo(current);
        if (chat && !seenIds.has(chat.id)) {
            seenIds.add(chat.id);
            const dateKey = chat[groupBy];
            chat.node = node;
            chatList.push(chat);

            queueRender();
        }
    }

    function groupChatsByGroupName() {
        const groups = new Map();

        for (const chat of chatList) {
            chat.group = getDateGroupLabel(chat[groupBy]);
            if (!groups.has(chat.group)) groups.set(chat.group, []);
            groups.get(chat.group).push(chat);
        }

        return [...groups.entries()].sort((a, b) => {
            const aTime = new Date(a[1][0][groupBy]).getTime();
            const bTime = new Date(b[1][0][groupBy]).getTime();
            return bTime - aTime;
        });
    }

    function clearGroupedChats(chats) {
        chats.querySelectorAll('a[href^="/c/"], .__chat-group-header').forEach(el => el.remove());
    }

    function renderGroupedChats(chats) {
        const observer = chats.__chatObserver;
        if (observer) observer.disconnect();

        clearGroupedChats(chats);
        const groups = groupChatsByGroupName();

        for (const [label, groupedChats] of groups) {
            const currentGroupBy = groupBy;

            const header = document.createElement('div');
            header.className = '__chat-group-header';
            header.textContent = label;
            chats.appendChild(header);

            groupedChats
                .sort((a, b) => new Date(b[currentGroupBy]) - new Date(a[currentGroupBy]))
                .forEach(chat => {
                const existingLabel = chat.node.querySelector('.__chat-timestamp');
                if (existingLabel) existingLabel.remove();

                const timestamp = document.createElement('div');
                timestamp.className = '__chat-timestamp';
                timestamp.textContent = new Date(chat[currentGroupBy]).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric'
                });

                chat.node.style.position = 'relative';
                chat.node.appendChild(timestamp);

                chats.appendChild(chat.node);
            });

        }


        if (observer) observer.observe(chats, { childList: true, subtree: true });
    }


    function sortChats(a, b) {
        return new Date(b[groupBy]) - new Date(a[groupBy]);
    }

    let renderTimer = null;

    function queueRender() {
        if (renderTimer) clearTimeout(renderTimer);
        renderTimer = setTimeout(() => {
            const chats = document.querySelector('#history');
            if (chats) renderGroupedChats(chats);
        }, 200);
    }

    function observeChatList(chats) {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.matches('a[href^="/c/"]')) {
                        processNewChatNode(node);
                    }
                }
                for (const node of mutation.removedNodes) {
                    if (node.nodeType === 1 && node.matches('a[href^="/c/"]')) {
                        const index = chatList.findIndex(c => c.node === node);
                        if (index !== -1) {
                            const removed = chatList.splice(index, 1)[0];
                            seenIds.delete(removed.id);
                            queueRender();
                        }
                    }
                }
            }
        });

        observer.observe(chats, { childList: true, subtree: true });
        chats.__chatObserver = observer;
        chats.querySelectorAll('a[href^="/c/"]').forEach(processNewChatNode);
    }

    function insertToggleButton(chats) {
        const header = chats.parentNode.firstElementChild;
        if (!header || header.querySelector('.__group-toggle')) return;

        // Wrap h2 content to align flexibly
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
    `;

        // Move existing h2 text/content into the wrapper
        while (header.firstChild) {
            wrapper.appendChild(header.firstChild);
        }
        header.appendChild(wrapper);

        const btn = document.createElement('button');
        btn.className = '__group-toggle';
        const icon = '⇅';
        btn.textContent = `${icon} By ${groupBy}`;
        btn.title = 'Click to toggle sorting mode';
        btn.style.cssText = `
        font-size: 0.75rem;
        background-color: #2a2b32;
        border: 1px solid #444;
        border-radius: 999px;
        padding: 3px 10px;
        color: #ccc;
        cursor: pointer;
        transition: background-color 0.2s;
    `;

        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#3a3b42';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = '#2a2b32';
        });

        btn.addEventListener('click', e => {
            e.stopPropagation();
            groupBy = groupBy === 'updated' ? 'created' : 'updated';
            GM_setValue('groupBy', groupBy);
            btn.textContent = `${icon} By ${groupBy}`;
            queueRender();
        });

        const timestampBtn = document.createElement('button');
        timestampBtn.className = '__toggle-timestamps';
        timestampBtn.style.cssText = `
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    background-color: #2a2b32;
    border: 1px solid #444;
    border-radius: 999px;
    padding: 3px 10px;
    color: #ccc;
    cursor: pointer;
    transition: background-color 0.2s;
`;

        const timestampIcon = document.createElement('span');
        timestampIcon.className = '__timestamp-icon';
        timestampIcon.textContent = '🕒';

        function updateTimestampIcon(state) {
            timestampIcon.classList.toggle('__disabled', !state);
        }
        updateTimestampIcon(GM_getValue('showTimestamps', true));


        timestampBtn.appendChild(timestampIcon);
        timestampBtn.title = 'Toggle timestamps';

        timestampBtn.addEventListener('mouseenter', () => {
            timestampBtn.style.backgroundColor = '#3a3b42';
        });
        timestampBtn.addEventListener('mouseleave', () => {
            timestampBtn.style.backgroundColor = '#2a2b32';
        });

        timestampBtn.addEventListener('click', e => {
            e.stopPropagation();
            const current = GM_getValue('showTimestamps', true);
            const next = !current;
            GM_setValue('showTimestamps', next);
            updateTimestampIcon(next);
            const chats = document.querySelector('#history');
            if (chats) chats.classList.toggle('__hide-timestamps', !next);
        });

        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = `
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

        buttonGroup.appendChild(btn);
        buttonGroup.appendChild(timestampBtn);
        wrapper.appendChild(buttonGroup);


    }

    (function watchSidebar() {
        let lastChats = null;

        function setup(chats) {
            if (!chats || chats === lastChats) return;
            lastChats = chats;

            chats.classList.toggle('__hide-timestamps', !GM_getValue('showTimestamps', true));

            insertToggleButton(chats);
            observeChatList(chats);
            renderGroupedChats(chats);
            console.log("ChatGPT grouping: sidebar attached.");
        }

        const rootObserver = new MutationObserver(() => {
            const chats = document.querySelector('#history');
            if (!chats) return;

            if (chats && chats !== lastChats) {
                setup(chats);
            }
        });

        rootObserver.observe(document.body, { childList: true, subtree: true });

        const chatsNow = document.querySelector('#history');
        if (chatsNow) setup(chatsNow);
    })();

    (function disableCollapse() {
        const observer = new MutationObserver(() => {
            const chatsHeader = document.querySelector('#history').parentNode.firstChild;

            if (chatsHeader && !chatsHeader.__noCollapse) {
                chatsHeader.__noCollapse = true;
                chatsHeader.addEventListener('click', e => {
                    if (e.target.closest('.__group-toggle, .__toggle-timestamps')) return;
                    e.stopImmediatePropagation(); // block React’s collapse toggle
                }, true);
                chatsHeader.style.cursor = 'default';
                chatsHeader.querySelectorAll('.__group-toggle, .__toggle-timestamps')
                    .forEach(btn => { btn.style.cursor = 'pointer'; });
                chatsHeader.querySelector('svg').remove();
                console.log('ChatGPT grouping: collapse disabled.');
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    })();
})();