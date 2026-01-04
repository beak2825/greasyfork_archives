// ==UserScript==
// @name         Blungs-Tools for fishtank.live
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Script for toggling features.
// @author       Blungs
// @match        https://*.fishtank.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539602/Blungs-Tools%20for%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/539602/Blungs-Tools%20for%20fishtanklive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const state = {
        chatFilter: true,
        avatars: true,
        timestamps: true,
        itemsUsed: true,
        ad: true,
        resize: true,
        top: true,
        left: true,
        right: true,
        stocks: true,
        bottom: true
    };

    const CONSECUTIVE_LIMIT = 4;

    function filterRepeatedChars(text) {
        return text.replace(/(\w)\1{3,}/g, (match, char) => char.repeat(CONSECUTIVE_LIMIT));
    }

    function filterRepeatedPhrases(text) {
        let cleaned = text.trim();
        let changed = true;

        while (changed) {
            changed = false;

            // Repeated word sequences
            const words = cleaned.split(/\s+/);
            for (let size = 6; size >= 2; size--) {
                for (let i = 0; i <= words.length - size * 2; i++) {
                    const phrase = words.slice(i, i + size).join(' ');
                    const next = words.slice(i + size, i + size * 2).join(' ');
                    if (phrase.toLowerCase() === next.toLowerCase()) {
                        cleaned = words.slice(0, i + size).join(' ') + ' ...';
                        changed = true;
                        break;
                    }
                }
                if (changed) break;
            }

            // Repeated character blocks (e.g., EXAMPLEEXAMPLEEXAMPLE)
            if (!changed) {
                for (let size = Math.floor(cleaned.length / 2); size >= 4; size--) {
                    const block = cleaned.slice(0, size);
                    const escaped = block.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const regex = new RegExp(`^(?:${escaped}){2,}`, 'i');
                    if (regex.test(cleaned)) {
                        cleaned = block + '...';
                        changed = true;
                        break;
                    }
                }
            }
        }

        return cleaned;
    }

    function processSpan(span) {
        if (!span || span.dataset.filteredProcessed === "true") return;
        const original = span.textContent.trim();
        if (!original) return;
        let filtered = filterRepeatedChars(original);
        filtered = filterRepeatedPhrases(filtered);
        if (original !== filtered) {
            const wrapper = document.createElement("span");
            wrapper.className = "filtered-spam-message";
            wrapper.dataset.filteredProcessed = "true";
            wrapper.textContent = filtered;
            wrapper.title = original;
            span.style.display = "none";
            span.after(wrapper);
        }
    }

    let chatFilterObserver;
    function observeChatFilter() {
        const chat = document.getElementById('chat-messages');
        if (!chat) return setTimeout(observeChatFilter, 1000);
        if (chatFilterObserver) chatFilterObserver.disconnect();
        chatFilterObserver = new MutationObserver(mutations => {
            if (!state.chatFilter) return;
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'SPAN') {
                        processSpan(node);
                    } else {
                        node.querySelectorAll('span').forEach(processSpan);
                    }
                });
            });
        });
        chatFilterObserver.observe(chat, { childList: true, subtree: true });
        if (state.chatFilter) {
            chat.querySelectorAll('span').forEach(processSpan);
        }
    }

    const avatarSelector = '.chat-message-default_avatar__eVmdi';
    function removeAvatars() {
        if (!state.avatars) return;
        const avatars = document.querySelectorAll(avatarSelector);
        avatars.forEach(el => el.remove());
    }

    const avatarObserver = new MutationObserver(() => {
        if (state.avatars) removeAvatars();
    });
    avatarObserver.observe(document.body, { childList: true, subtree: true });

    function removeTimestamps() {
        if (!state.timestamps) return;
        const timestamps = document.querySelectorAll('.chat-message-default_timestamp__sGwZy');
        timestamps.forEach(el => el.remove());
    }

    function removeUsedItems() {
        if (!state.itemsUsed) return;
        const usedItems = document.querySelectorAll('[class^="chat-message-happening_item__mi9tp"]');
        usedItems.forEach(el => el.remove());
    }

    const cleanupObserver = new MutationObserver(() => {
        removeTimestamps();
        removeUsedItems();
    });
    cleanupObserver.observe(document.body, { childList: true, subtree: true });

    function applyResizeStyle(enabled) {
        const existing = document.getElementById('resize-style');
        if (existing) existing.remove();
        if (!enabled) return;
        const style = document.createElement('style');
        style.id = 'resize-style';
        style.textContent = `
            #chat-messages {
                display: flex !important;
                flex-direction: column !important;
                gap: 0.2em !important;
            }
            #chat-messages * {
                font-size: 0.95em !important;
                line-height: 1em !important;
                margin: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function toggleVisibility(className, show) {
        document.querySelectorAll(`.${className.split(' ').join('.')}`).forEach(el => {
            el.style.display = show ? '' : 'none';
        });
    }

    function toggleAds() {
        toggleVisibility('ads_ads__Z1cPk', state.ad);
    }

    const functionList = {
        'Chat Filter': {
            get enabled() { return state.chatFilter; },
            action() {
                state.chatFilter = !state.chatFilter;
                if (state.chatFilter) observeChatFilter();
                else if (chatFilterObserver) chatFilterObserver.disconnect();
            }
        },
        'Avatars': {
            get enabled() { return state.avatars; },
            action() {
                state.avatars = !state.avatars;
                if (state.avatars) removeAvatars();
            }
        },
        'Timestamps': {
            get enabled() { return state.timestamps; },
            action() {
                state.timestamps = !state.timestamps;
                if (state.timestamps) removeTimestamps();
            }
        },
        'Items Used': {
            get enabled() { return state.itemsUsed; },
            action() {
                state.itemsUsed = !state.itemsUsed;
                if (state.itemsUsed) removeUsedItems();
            }
        },
        'Ad': {
            get enabled() { return state.ad; },
            action() {
                state.ad = !state.ad;
                toggleAds();
            }
        },
        'Resize': {
            get enabled() { return state.resize; },
            action() {
                state.resize = !state.resize;
                applyResizeStyle(state.resize);
            }
        },
        'Top': {
            get enabled() { return state.top; },
            action() {
                state.top = !state.top;
                toggleVisibility('layout_top__MHaU_', state.top);
            }
        },
        'Left': {
            get enabled() { return state.left; },
            action() {
                state.left = !state.left;
                toggleVisibility('layout_left__O2uku', state.left);
            }
        },
        'Right': {
            get enabled() { return state.right; },
            action() {
                state.right = !state.right;
                toggleVisibility('chat_chat__2rdNg', state.right);
            }
        },
        'Stocks Bar': {
            get enabled() { return state.stocks; },
            action() {
                state.stocks = !state.stocks;
                toggleVisibility('stocks-bar_stocks-bar__7kNv8', state.stocks);
            }
        },
        'Bottom': {
            get enabled() { return state.bottom; },
            action() {
                state.bottom = !state.bottom;
                toggleVisibility('layout_center-bottom__yhDOH', state.bottom);
            }
        }
    };

    const chatFunctions = ['Chat Filter', 'Avatars', 'Timestamps', 'Items Used', 'Resize'];
    const layoutFunctions = Object.keys(functionList).filter(f => !chatFunctions.includes(f));

    const menu = document.createElement('div');
    menu.id = 'q-toggle-menu';
    Object.assign(menu.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#222',
        color: '#fff',
        padding: '20px',
        border: '1px solid #555',
        borderRadius: '8px',
        display: 'none',
        zIndex: '9999',
        fontFamily: 'Arial, sans-serif',
        fontSize: '180%',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        userSelect: 'none',
    });
    document.body.appendChild(menu);

    function updateMenu() {
        menu.innerHTML = `
            <div style="position: relative; min-height: 25px;">
                <span id="close-q-menu" style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    cursor: pointer;
                    color: red;
                    font-size: 140%;
                    background: #000;
                    padding: 4px 6px;
                    border-radius: 50%;
                    line-height: 0;
                ">✖</span>
            </div>
            <div style="padding-top: 10px; margin-bottom: 30px; text-align: center;">
                <strong style="color: limegreen; display: inline-block;">Functions Menu</strong>
            </div>
            <div style="display: flex; gap: 40px;">
                <div>
                    <strong style="text-decoration: underline; color: deepskyblue;">Chat</strong>
                    ${chatFunctions.map(key => {
                        const value = functionList[key].enabled;
                        const isInverted = ['Avatars', 'Timestamps', 'Items Used'].includes(key);
                        const status = isInverted ? (value ? 'Off' : 'On') : (value ? 'On' : 'Off');
                        return `
                            <div style="cursor: pointer; padding: 18px 0; border-bottom: 1px solid #444;" onclick="toggleFunction('${key}')">
                                ${key}: ${status}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div>
                    <strong style="text-decoration: underline; color: deepskyblue;">Site Layout</strong>
                    ${layoutFunctions.map(key => `
                        <div style="cursor: pointer; padding: 18px 0; border-bottom: 1px solid #444;" onclick="toggleFunction('${key}')">
                            ${key}: ${functionList[key].enabled ? 'On' : 'Off'}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('close-q-menu').onclick = () => {
            menu.style.display = 'none';
            menuVisible = false;
        };

        // Re-assign toggleFunction handlers without using inline attribute
        const toggles = menu.querySelectorAll('div[onclick]');
        toggles.forEach(div => {
            const matches = div.getAttribute('onclick').match(/toggleFunction\('(.+)'\)/);
            if (!matches) return;
            const key = matches[1];
            div.onclick = () => {
                functionList[key].action();
                updateMenu();
            };
        });
    }

    function isInputFocused() {
        const active = document.activeElement;
        return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    }

    let menuVisible = false;
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'q' || e.key === 'Q') && !isInputFocused() && !e.repeat) {
            e.preventDefault();
            menuVisible = !menuVisible;
            if (menuVisible) {
                updateMenu();
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        }
    });

    if (state.resize) applyResizeStyle(true);
    if (state.chatFilter) observeChatFilter();
    if (state.avatars) removeAvatars();
    if (state.timestamps) removeTimestamps();
    if (state.itemsUsed) removeUsedItems();
    if (state.ad) toggleAds();
    if (!state.top) toggleVisibility('top-bar_links__4FJwt', false);
    if (!state.left) toggleVisibility('layout_left__O2uku', false);
    if (!state.right) toggleVisibility('chat_chat__2rdNg', false);
    if (!state.stocks) toggleVisibility('stocks-bar_stock__X5bf9 stocks-bar_positive__OQyx5', false);
    if (!state.bottom) toggleVisibility('layout_center-bottom__yhDOH', false);

    // Expose toggleFunction globally for inline onclick handlers
    window.toggleFunction = function(key) {
        if (functionList[key]) {
            functionList[key].action();
            updateMenu();
        }
    };
})();
