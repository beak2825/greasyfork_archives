// ==UserScript==
// @name         JanitorAI QoL Features (Persistent Timestamps, reroll counters & keybinds)
// @namespace    https://greasyfork.org/users/1503549-viserys
// @match        https://janitorai.com/*
// @version      1.0
// @description  A convenient UI with a hover tooltip and a persistent, toggleable timestamp and keybinds. (Arrow keys generate/swipe through replies and autogenerating with \ key. PC only).
// @author       Viserys|||
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545317/JanitorAI%20QoL%20Features%20%28Persistent%20Timestamps%2C%20reroll%20counters%20%20keybinds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545317/JanitorAI%20QoL%20Features%20%28Persistent%20Timestamps%2C%20reroll%20counters%20%20keybinds%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- LOCALSTORAGE SETUP ---
    const STORAGE_KEY_TIMESTAMPS = 'janitorai_timestamps';
    const STORAGE_KEY_TOGGLE = 'janitorai_toggle_state';

    // Load initial state from localStorage, or set defaults.
    let timestamps = JSON.parse(localStorage.getItem(STORAGE_KEY_TIMESTAMPS)) || {};
    let isTimestampPermanentlyVisible = JSON.parse(localStorage.getItem(STORAGE_KEY_TOGGLE)) || false;

    // --- DATA HELPER FUNCTIONS ---
    const saveTimestamps = () => localStorage.setItem(STORAGE_KEY_TIMESTAMPS, JSON.stringify(timestamps));
    const saveToggleState = () => localStorage.setItem(STORAGE_KEY_TOGGLE, JSON.stringify(isTimestampPermanentlyVisible));

    // --- CSS STYLES ---
    const style = document.createElement('style');
    style.textContent = `
    .response-ui-el {
      margin: 10px auto 4px auto; padding: 5px 15px; border-radius: 20px; font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      text-align: center; line-height: 1.5;
    }
    .response-timestamp-previous {
      color: rgba(255, 255, 255, 0.45); background: transparent; display: flex; align-items: center; gap: 6px;
    }
    .response-timestamp-previous .icon {
      width: 12px; height: 12px; stroke: currentColor; opacity: 0.6;
    }
    .response-count-current {
      cursor: pointer; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px) saturate(1.5);
      -webkit-backdrop-filter: blur(8px) saturate(1.5); border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease-in-out; position: relative; font-weight: 500; margin-bottom: 0;
    }
    .response-count-current:hover {
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      border-color: rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.15);
    }
    .response-count-current .custom-tooltip {
      position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) scale(0.95);
      background: rgba(30, 30, 30, 0.7); backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff; padding: 8px 12px; border-radius: 10px; white-space: nowrap; font-size: 13px;
      font-weight: 400; opacity: 0; pointer-events: none; transition: all 0.2s ease;
    }
    .response-count-current:not(.tooltip-disabled):hover .custom-tooltip {
      opacity: 1; transform: translateX(-50%) scale(1); bottom: calc(100% + 12px);
    }
    .response-timestamp-current {
      color: rgba(255, 255, 255, 0.6); padding: 0; margin: 0 auto 8px auto;
      font-size: 11px; font-weight: 400;
    }
    .hidden { display: none; }
    `;
    document.head.appendChild(style);

    // --- HELPER FUNCTIONS ---
    const waitForEl = (selector) => new Promise(resolve => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        const observer = new MutationObserver(() => {
            const found = document.querySelector(selector);
            if (found) { observer.disconnect(); resolve(found); }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    const formatTimestamp = (isoString) => {
        if (!isoString) return 'No timestamp';
        const d = new Date(isoString);
        const timePart = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        const datePart = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
        return `${timePart} ・ ${datePart}`;
    };

    const styleParentLi = (responseEl) => {
        responseEl.style.display = 'flex';
        responseEl.style.flexDirection = 'column';
        responseEl.style.position = 'relative';
    };

    let processAllMessages = () => {};

    // --- UI CREATION FUNCTIONS ---
    function createUIForPreviousMessage(responseListEl) {
        responseListEl.querySelectorAll('.response-ui-el').forEach(el => el.remove());
        const turnIndex = responseListEl.closest('div[data-index]').dataset.index;
        const responseEl = responseListEl.querySelector('li'); // Previous messages only have one LI
        if (!responseEl) return;

        styleParentLi(responseEl);
        const messageId = `turn-${turnIndex}-response-0`;
        const ts = timestamps[messageId];

        const displayEl = document.createElement('div');
        displayEl.className = 'response-ui-el response-timestamp-previous';
        const clockIcon = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
        const textEl = document.createElement('span');
        textEl.innerText = formatTimestamp(ts);

        displayEl.innerHTML = clockIcon;
        displayEl.appendChild(textEl);
        responseEl.appendChild(displayEl);
    }

    function createUIForCurrentMessage(responseListEl) {
        responseListEl.querySelectorAll('.response-ui-el, .hidden').forEach(el => el.remove());
        const items = Array.from(responseListEl.childNodes);
        const turnIndex = responseListEl.closest('div[data-index]').dataset.index;

        items.forEach((responseEl, idx) => {
            if (responseEl.nodeName !== 'LI') return;
            styleParentLi(responseEl);
            const messageId = `turn-${turnIndex}-response-${idx}`;
            const ts = timestamps[messageId];

            const displayEl = document.createElement('div');
            displayEl.innerText = `‹ ${idx + 1}/${items.length} ›`;
            displayEl.className = 'response-ui-el response-count-current';

            const tip = document.createElement('div');
            tip.className = 'custom-tooltip';
            tip.innerText = formatTimestamp(ts);
            displayEl.appendChild(tip);

            const timestampEl = document.createElement('div');
            timestampEl.className = 'response-ui-el response-timestamp-current';
            timestampEl.innerText = formatTimestamp(ts);

            if (isTimestampPermanentlyVisible) {
                displayEl.classList.add('tooltip-disabled');
                timestampEl.classList.remove('hidden');
            } else {
                displayEl.classList.remove('tooltip-disabled');
                timestampEl.classList.add('hidden');
            }

            displayEl.addEventListener('click', () => {
                isTimestampPermanentlyVisible = !isTimestampPermanentlyVisible;
                saveToggleState();
                processAllMessages();
            });

            responseEl.appendChild(displayEl);
            responseEl.appendChild(timestampEl);
        });
    }

    // --- MAIN EXECUTION LOGIC ---
    async function main() {
        const dialogueContainerSelector = 'div:has(> div[data-index])';
        const dialogueContainer = await waitForEl(dialogueContainerSelector);

        processAllMessages = () => {
            // --- DISCOVERY PHASE ---
            let newMessagesFound = false;
            const allTurnContainers = document.querySelectorAll('div[data-index]');
            allTurnContainers.forEach(turnContainer => {
                const turnIndex = turnContainer.dataset.index;
                const responseItems = turnContainer.querySelectorAll('li');
                responseItems.forEach((li, responseIndex) => {
                    const messageId = `turn-${turnIndex}-response-${responseIndex}`;
                    if (!timestamps[messageId]) {
                        timestamps[messageId] = new Date().toISOString();
                        newMessagesFound = true;
                    }
                });
            });

            if (newMessagesFound) {
                saveTimestamps();
            }

            // --- RENDER PHASE ---
            const allListsSelector = 'div[data-index] div:has(> li)';
            const allLists = Array.from(document.querySelectorAll(allListsSelector));
            const lastList = allLists.length > 0 ? allLists[allLists.length - 1] : null;
            if (!lastList) return;

            allLists.forEach(list => {
                if (list === lastList) {
                    createUIForCurrentMessage(list);
                } else {
                    createUIForPreviousMessage(list);
                }
            });
        };

        const observer = new MutationObserver(() => {
            observer.disconnect();
            processAllMessages();
            observer.observe(dialogueContainer, { childList: true, subtree: true });
        });

        processAllMessages();
        observer.observe(dialogueContainer, { childList: true, subtree: true });
    }

    main();
})();

// Keybinds

(function () {
    'use strict';

    // --- Configuration ---
    const manualArrowCooldownMs = 200; // Cooldown for manual arrow key presses in milliseconds.
    const autoRollCooldownMs = 300;    // Cooldown for the auto-roller in milliseconds.
    // ---------------------

    let lastManualClickTimestamp = 0;
    let autoClickInterval = null;

    function isDescendantOfSelector(element, selector) {
        while (element) {
            if (element.matches && element.matches(selector)) return true;
            element = element.parentElement;
        }
        return false;
    }

    function performAccessibleClick(button, previousFocus = null) {
        if (!button) return;

        // Save viewport position
        const scrollX = window.scrollX, scrollY = window.scrollY;

        // Focus without scrolling
        if (button.focus) {
            try {
                button.focus({ preventScroll: true });
            } catch (_) {
                button.focus();  // fallback
            }
        }

        // Dispatch keyboard events if you still want them
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        button.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));

        // Click
        button.click();

        // Restore previous focus (also without scrolling)
        if (previousFocus && previousFocus.focus) {
            setTimeout(() => {
                try {
                    previousFocus.focus({ preventScroll: true });
                } catch (_) {
                    previousFocus.focus();
                }
                // Restore exact scroll just in case
                window.scrollTo(scrollX, scrollY);
            }, 10);
        } else {
            // If no previous focus, still restore scroll
            window.scrollTo(scrollX, scrollY);
        }
    }

    function startAutoClick() {
        if (autoClickInterval) return;
        autoClickInterval = setInterval(() => {
            const focusedElement = document.activeElement;
            const tagName = focusedElement?.tagName.toUpperCase();

            if (
                tagName === 'INPUT' ||
                tagName === 'TEXTAREA' ||
                focusedElement?.isContentEditable ||
                isDescendantOfSelector(focusedElement, '.modal, .dropdown, [role="dialog"], [aria-modal="true"]')
            ) {
                return;
            }

            const rightArrowButton = document.querySelector('button[aria-label="Right"]');
            if (rightArrowButton) {
                performAccessibleClick(rightArrowButton);
            }
        }, autoRollCooldownMs); // <-- Uses the dedicated auto-roll cooldown
        console.log('Auto-generate started.');
    }

    function stopAutoClick() {
        clearInterval(autoClickInterval);
        autoClickInterval = null;
        console.log('Auto-generate stopped.');
    }

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.altKey || event.metaKey) return;

        const focusedElement = document.activeElement;
        const tagName = focusedElement?.tagName.toUpperCase();

        if (
            tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            focusedElement?.isContentEditable ||
            isDescendantOfSelector(focusedElement, '.modal, .dropdown, [role="dialog"], [aria-modal="true"]')
        ) {
            return;
        }

        // Toggle auto-click with \
        if (event.key === '\\') {
            if (autoClickInterval) {
                stopAutoClick();
            } else {
                startAutoClick();
            }
            return;
        }

        // Throttle manual arrow key clicks
        if (Date.now() - lastManualClickTimestamp < manualArrowCooldownMs) return;

        if (event.key === 'ArrowRight') {
            const rightArrowButton = document.querySelector('button[aria-label="Right"]');
            if (rightArrowButton) {
                performAccessibleClick(rightArrowButton, focusedElement);
                lastManualClickTimestamp = Date.now();
            }
        } else if (event.key === 'ArrowLeft') {
            const leftArrowButton = document.querySelector('button[aria-label="Left"]');
            if (leftArrowButton) {
                performAccessibleClick(leftArrowButton, focusedElement);
                lastManualClickTimestamp = Date.now();
            }
        }
    });
})();