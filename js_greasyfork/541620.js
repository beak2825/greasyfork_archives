// ==UserScript==
// @name         Claude.ai | Remove active (current) chat by CTRL+SHIFT+BACKSPACE
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Delete active chat in Claude.ai sidebar using Ctrl+Shift+Backspace
// @author       Saymonn
// @match        https://claude.ai/chat*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO8QnSw5ArwqF8PsafiMQ3EsH0Xr9LFLgNpwutam6-FN7UhoQvXeyqIHyNvj907vU5BKU&usqp=CAU
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541620/Claudeai%20%7C%20Remove%20active%20%28current%29%20chat%20by%20CTRL%2BSHIFT%2BBACKSPACE.user.js
// @updateURL https://update.greasyfork.org/scripts/541620/Claudeai%20%7C%20Remove%20active%20%28current%29%20chat%20by%20CTRL%2BSHIFT%2BBACKSPACE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        AUTO_CONFIRM: false,
        WAIT_TIME: 200,
        TIMEOUT: 3000
    };

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = (selector, timeout = CONFIG.TIMEOUT) => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout'));
            }, timeout);
        });
    };

    const simulateClick = element => {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        [
            new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: x, clientY: y, button: 0 }),
            new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y, button: 0 }),
            new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: x, clientY: y, button: 0 }),
            new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y, button: 0 }),
            new MouseEvent('click', { bubbles: true, clientX: x, clientY: y, button: 0 })
        ].forEach(event => element.dispatchEvent(event));

        return true;
    };

    const findActiveMenuButton = () => {
        const selectors = [
            'li a.\\!bg-bg-300',
            'li a[aria-current="page"]',
            'li a[class*="bg-accent"]',
            'li a[class*="active"]'
        ];

        for (const selector of selectors) {
            const activeChat = document.querySelector(selector);
            if (activeChat) {
                const container = activeChat.closest('div.group');
                const menuButton = container?.querySelector('button[aria-haspopup="menu"]');
                if (menuButton) return menuButton;
            }
        }

        const allLinks = document.querySelectorAll('nav li a[href*="/chat"]');
        for (const link of allLinks) {
            if (link.getAttribute('href') === window.location.pathname ||
                link.classList.contains('!bg-bg-300')) {
                const container = link.closest('div.group');
                const menuButton = container?.querySelector('button[aria-haspopup="menu"]');
                if (menuButton) return menuButton;
            }
        }

        return null;
    };

    const findDeleteButton = () => {
        const selectors = [
            '[data-testid="delete-chat-trigger"]',
            '[data-testid*="delete"]',
            'button[aria-label*="Delete"]',
            'button[aria-label*="delete"]',
            '[role="menuitem"]'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent?.toLowerCase() || '';
                const label = element.getAttribute('aria-label')?.toLowerCase() || '';
                if (text.includes('delete') || label.includes('delete')) {
                    return element;
                }
            }
        }

        return null;
    };

    const deleteActiveChat = async () => {
        try {
            const menuButton = findActiveMenuButton();
            if (!menuButton) return;

            simulateClick(menuButton);
            await wait(CONFIG.WAIT_TIME);

            let deleteButton = findDeleteButton();
            if (!deleteButton) {
                simulateClick(menuButton);
                await wait(CONFIG.WAIT_TIME);
                deleteButton = findDeleteButton();
            }

            if (!deleteButton) return;

            deleteButton.click();

            if (CONFIG.AUTO_CONFIRM) {
                try {
                    const confirmButton = await waitForElement('[data-testid="delete-modal-confirm"]');
                    confirmButton.click();
                } catch {
                    const fallbackButton = document.querySelector('button[data-testid="delete-modal-confirm"]');
                    if (fallbackButton) fallbackButton.click();
                }
            }
        } catch (error) {
        }
    };

    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.code === 'Backspace') {
            event.preventDefault();
            deleteActiveChat();
        }
    });

})();