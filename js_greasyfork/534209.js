// ==UserScript==
// @name         YouTube Chat Mod Action Icons (All Timeout Durations + Channel Activity)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  If user is mod, insert 🗑️, 🔗, ⏱️, 5️⃣, 🕞, 🕛, 📊 before avatar for each chat message. Each timeout icon triggers the correct duration in the dialog. 📊 opens channel activity.
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534209/YouTube%20Chat%20Mod%20Action%20Icons%20%28All%20Timeout%20Durations%20%2B%20Channel%20Activity%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534209/YouTube%20Chat%20Mod%20Action%20Icons%20%28All%20Timeout%20Durations%20%2B%20Channel%20Activity%29.meta.js
// ==/UserScript==

(function() {
    // --- MOD CHECK LOGIC ---
    function simulateMouseClick(element) {
        if (!element) return;
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            const event = new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            element.dispatchEvent(event);
        });
    }

    function simulateEscapeKey() {
        const escapeEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escapeEvent);
    }

    function deepTextSearch(node, matchText, foundList) {
        if (!node) return false;
        if (node.nodeType === 1) {
            if (node.tagName === 'YT-FORMATTED-STRING') {
                const txt = node.textContent.trim();
                foundList && foundList.push(txt);
                if (txt === matchText) {
                    return true;
                }
            }
            if (node.shadowRoot && deepTextSearch(node.shadowRoot, matchText, foundList)) {
                return true;
            }
            for (const child of node.children) {
                if (deepTextSearch(child, matchText, foundList)) return true;
            }
        }
        return false;
    }

    async function waitForMessageMenuButton() {
        let btn = null;
        for (let i = 0; i < 100; ++i) {
            const msg = document.querySelector('yt-live-chat-text-message-renderer');
            if (msg) {
                btn = msg.querySelector('#menu #menu-button button');
                if (btn) break;
            }
            await new Promise(r => setTimeout(r, 100));
        }
        return btn;
    }
    // --- END MOD CHECK LOGIC ---

    // Timeout options: icon, label
    const timeoutOptions = [
        { icon: '⏱️', label: '10 seconds', title: 'Timeout for 10 seconds' },
        { icon: '5️⃣', label: '5 minutes', title: 'Timeout for 5 minutes' },
        { icon: '🕞', label: '30 minutes', title: 'Timeout for 30 minutes' },
        { icon: '🕛', label: '24 hours', title: 'Timeout for 24 hours' }
    ];

    // Insert icons before avatar for all chat lines, make them clickable
    function insertIcons() {
        const lines = document.querySelectorAll('yt-live-chat-text-message-renderer');
        for (const line of lines) {
            const avatar = line.querySelector('yt-img-shadow#author-photo');
            if (!avatar) continue;

            // Prevent duplicate insertion
            if (avatar.previousElementSibling && avatar.previousElementSibling.classList.contains('mod-icons-wrapper')) continue;

            // Wrapper for all icons
            const wrapper = document.createElement('span');
            wrapper.className = 'mod-icons-wrapper';
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginRight = '4px';

            // Trash can icon
            const trash = document.createElement('span');
            trash.className = 'mod-trash-mark';
            trash.textContent = '🗑️';
            trash.title = 'Remove this message';
            trash.style.marginRight = '2px';
            trash.style.cursor = 'pointer';
            trash.style.verticalAlign = 'middle';
            trash.addEventListener('click', async (e) => {
                e.stopPropagation();
                const menuBtn = line.querySelector('#menu #menu-button button');
                if (!menuBtn) return;
                simulateMouseClick(menuBtn);

                // Wait for menu, then click "Remove"
                for (let tries = 0; tries < 50; ++tries) {
                    const dropdowns = document.querySelectorAll('tp-yt-iron-dropdown');
                    let found = false;
                    for (const dd of dropdowns) {
                        const style = window.getComputedStyle(dd);
                        if (style.display === 'none') continue;
                        const removeItem = Array.from(dd.querySelectorAll('yt-formatted-string'))
                            .find(el => el.textContent.trim() === 'Remove');
                        if (removeItem) {
                            let clickable = removeItem.closest('tp-yt-paper-item, ytd-menu-service-item-renderer');
                            if (!clickable) clickable = removeItem;
                            simulateMouseClick(clickable);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                    await new Promise(r => setTimeout(r, 100));
                }
            });

            // Chain icon (Go to channel)
            const chain = document.createElement('span');
            chain.className = 'mod-chain-mark';
            chain.textContent = '🔗';
            chain.title = 'Go to channel';
            chain.style.marginRight = '2px';
            chain.style.cursor = 'pointer';
            chain.style.verticalAlign = 'middle';
            chain.addEventListener('click', async (e) => {
                e.stopPropagation();
                const menuBtn = line.querySelector('#menu #menu-button button');
                if (!menuBtn) return;
                simulateMouseClick(menuBtn);

                // Wait for menu, then click "Go to channel"
                for (let tries = 0; tries < 50; ++tries) {
                    const dropdowns = document.querySelectorAll('tp-yt-iron-dropdown');
                    let found = false;
                    for (const dd of dropdowns) {
                        const style = window.getComputedStyle(dd);
                        if (style.display === 'none') continue;
                        const goToItem = Array.from(dd.querySelectorAll('yt-formatted-string'))
                            .find(el => el.textContent.trim() === 'Go to channel');
                        if (goToItem) {
                            let clickable = goToItem.closest('tp-yt-paper-item, ytd-menu-navigation-item-renderer');
                            if (!clickable) clickable = goToItem;
                            simulateMouseClick(clickable);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                    await new Promise(r => setTimeout(r, 100));
                }
            });

            // Timeout icons
            for (const opt of timeoutOptions) {
                const timeoutIcon = document.createElement('span');
                timeoutIcon.className = 'mod-timeout-mark';
                timeoutIcon.textContent = opt.icon;
                timeoutIcon.title = opt.title;
                timeoutIcon.style.marginRight = '2px';
                timeoutIcon.style.cursor = 'pointer';
                timeoutIcon.style.verticalAlign = 'middle';
                timeoutIcon.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const menuBtn = line.querySelector('#menu #menu-button button');
                    if (!menuBtn) return;
                    simulateMouseClick(menuBtn);

                    // Step 1: Wait for menu, click "Put user in timeout"
                    let timeoutClicked = false;
                    for (let tries = 0; tries < 50; ++tries) {
                        const dropdowns = document.querySelectorAll('tp-yt-iron-dropdown');
                        for (const dd of dropdowns) {
                            const style = window.getComputedStyle(dd);
                            if (style.display === 'none') continue;
                            const timeoutItem = Array.from(dd.querySelectorAll('yt-formatted-string'))
                                .find(el => el.textContent.trim() === 'Put user in timeout');
                            if (timeoutItem) {
                                let clickable = timeoutItem.closest('tp-yt-paper-item, ytd-menu-service-item-renderer');
                                if (!clickable) clickable = timeoutItem;
                                simulateMouseClick(clickable);
                                timeoutClicked = true;
                                break;
                            }
                        }
                        if (timeoutClicked) break;
                        await new Promise(r => setTimeout(r, 100));
                    }
                    if (!timeoutClicked) return;

                    // Step 2: Wait for the timeout dialog to appear
                    let dialog = null;
                    for (let tries = 0; tries < 50; ++tries) {
                        dialog = document.querySelector('yt-show-action-dialog-renderer');
                        if (dialog && dialog.offsetParent !== null) break;
                        await new Promise(r => setTimeout(r, 100));
                    }
                    if (!dialog) return;

                    // Step 3: Click the correct radio button in the dialog
                    let foundRadio = null;
                    for (let tries = 0; tries < 50; ++tries) {
                        foundRadio = Array.from(dialog.querySelectorAll('tp-yt-paper-radio-button'))
                            .find(rb => {
                                const label = rb.querySelector('yt-formatted-string');
                                return label && label.textContent.trim() === opt.label;
                            });
                        if (foundRadio && foundRadio.getAttribute('aria-checked') !== 'true') {
                            simulateMouseClick(foundRadio);
                            await new Promise(r => setTimeout(r, 100));
                        }
                        if (foundRadio && foundRadio.getAttribute('aria-checked') === 'true') break;
                        await new Promise(r => setTimeout(r, 100));
                    }
                    if (!foundRadio) return;

                    // Step 4: Click Confirm button in the dialog footer only
                    let confirmBtn = null;
                    for (let tries = 0; tries < 50; ++tries) {
                        confirmBtn = dialog.querySelector('#show-action-dialog-primary-action button');
                        if (confirmBtn && confirmBtn.offsetParent !== null && !confirmBtn.disabled) {
                            simulateMouseClick(confirmBtn);
                            break;
                        }
                        await new Promise(r => setTimeout(r, 100));
                    }
                });
                wrapper.appendChild(timeoutIcon);
            }

            // Channel Activity icon
            const activity = document.createElement('span');
            activity.className = 'mod-activity-mark';
            activity.textContent = '📊';
            activity.title = 'Channel Activity';
            activity.style.marginRight = '2px';
            activity.style.cursor = 'pointer';
            activity.style.verticalAlign = 'middle';
            activity.addEventListener('click', async (e) => {
                e.stopPropagation();
                const menuBtn = line.querySelector('#menu #menu-button button');
                if (!menuBtn) return;
                simulateMouseClick(menuBtn);

                // Wait for menu, then click "Channel Activity"
                for (let tries = 0; tries < 50; ++tries) {
                    const dropdowns = document.querySelectorAll('tp-yt-iron-dropdown');
                    let found = false;
                    for (const dd of dropdowns) {
                        const style = window.getComputedStyle(dd);
                        if (style.display === 'none') continue;
                        const activityItem = Array.from(dd.querySelectorAll('yt-formatted-string'))
                            .find(el => el.textContent.trim() === 'Channel Activity');
                        if (activityItem) {
                            let clickable = activityItem.closest('tp-yt-paper-item, ytd-menu-service-item-renderer');
                            if (!clickable) clickable = activityItem;
                            simulateMouseClick(clickable);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                    await new Promise(r => setTimeout(r, 100));
                }
            });
            wrapper.appendChild(activity);

            wrapper.appendChild(trash);
            wrapper.appendChild(chain);
            avatar.parentElement.insertBefore(wrapper, avatar);
        }
    }

    // Observe for new chat lines and chat mode switches
    function observeChatLinesAndMode() {
        // Observe chat lines
        const chatList = document.querySelector('yt-live-chat-item-list-renderer');
        if (chatList && !chatList._modIconsObserved) {
            chatList._modIconsObserved = true;
            const chatObserver = new MutationObserver(() => insertIcons());
            chatObserver.observe(chatList, { childList: true, subtree: true });
        }

        // Observe chat mode switch (Top Chat/Live Chat)
        const modeParent = document.querySelector('yt-live-chat-header-renderer');
        if (modeParent && !modeParent._modIconsObserved) {
            modeParent._modIconsObserved = true;
            const modeObserver = new MutationObserver(() => {
                setTimeout(() => insertIcons(), 200); // Wait for DOM update
            });
            modeObserver.observe(modeParent, { childList: true, subtree: true });
        }
    }

    async function main() {
        // --- MOD CHECK LOGIC ---
        const menuBtn = await waitForMessageMenuButton();
        if (!menuBtn) return;
        simulateMouseClick(menuBtn);

        let tries = 0;
        let found = false;
        const interval = setInterval(() => {
            const dropdowns = document.querySelectorAll('tp-yt-iron-dropdown');
            for (const dd of dropdowns) {
                const style = window.getComputedStyle(dd);
                if (style.display === 'none') continue;
                let foundList = [];
                if (deepTextSearch(dd, 'Go to channel', foundList)) {
                    simulateEscapeKey();
                    found = true;
                    break;
                }
            }
            if (found) {
                clearInterval(interval);
                clearTimeout(timeout);
                insertIcons();
                observeChatLinesAndMode();
                console.log('I am mod');
            }
            if (++tries > 100) clearInterval(interval);
        }, 100);

        const timeout = setTimeout(() => {
            if (!found) {
                console.log('I am not mod');
                clearInterval(interval);
            }
        }, 10000);
        // --- END MOD CHECK LOGIC ---
    }

    window.addEventListener('load', () => setTimeout(main, 1000));
})();
