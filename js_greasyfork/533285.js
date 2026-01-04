// ==UserScript==
// @name              Gemini Conversation Delete Shortcut
// @namespace         https://greasyfork.org/ja/scripts/533285-gemini-conversation-delete-shortcut
// @version           1.7.7
// @description       Deletes the current Gemini conversation on both mobile and desktop layouts. Uses simplified polling and timing; focuses and highlights the confirm button without automatic click on both layouts. On desktop, after confirm is clicked, conditionally opens side nav if its content width ≤72px, without adding duplicate listeners. The confirm button is now scoped under message-dialog.
// @author            Takashi Sasasaki
// @license           MIT
// @homepageURL       https://x.com/TakashiSasaki
// @supportURL        https://greasyfork.org/ja/scripts/533285-gemini-conversation-delete-shortcut
// @match             https://gemini.google.com/app/*
// @match             https://gemini.google.com/app
// @icon              https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png
// @grant             GM_registerMenuCommand
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/533285/Gemini%20Conversation%20Delete%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/533285/Gemini%20Conversation%20Delete%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Utility to check if an element is visible (only for mobile) ---
    function isElementVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }
        return el.offsetParent !== null;
    }

    // --- Show script status dialog ---
    function showStatusDialog() {
        const mobilePresent = !!document.querySelector(SELECTOR_MOBILE_MENU_BUTTON);
        const mobileVisible = isElementVisible(document.querySelector(SELECTOR_MOBILE_MENU_BUTTON));
        const desktopPresent = !!document.querySelector(SELECTOR_DESKTOP_MENU_BUTTON);
        alert(
            `Gemini Conversation Delete Shortcut is active (version 1.7.7).\n\n` +
            `Mobile menu button (${SELECTOR_MOBILE_MENU_BUTTON}): In DOM=${mobilePresent}, Visible=${mobileVisible}\n` +
            `Desktop menu button (${SELECTOR_DESKTOP_MENU_BUTTON}): In DOM=${desktopPresent}`
        );
    }

    // --- Show help dialog ---
    function showHelp() {
        alert(
            'Gemini Conversation Delete Shortcut Help:\n' +
            'Ctrl+Shift+Backspace → Start deletion sequence (open menu, click Delete, focus/confirm)\n' +
            'Ctrl+Shift+S        → Click final action button (e.g., New Chat)\n' +
            'Ctrl+Shift+?        → Show script status\n' +
            '🗑️ Button next to menu → Manual deletion trigger (mobile only)'
        );
    }

    GM_registerMenuCommand('Show delete shortcut status', showStatusDialog);
    GM_registerMenuCommand('Show shortcuts help', showHelp, 'H');

    // --- Configuration ---
    const SHORTCUT_KEY_CODE             = 'Backspace';
    const USE_CTRL_KEY                  = true;
    const USE_SHIFT_KEY                 = true;
    const USE_ALT_KEY                   = false;
    const USE_META_KEY                  = false;

    const SELECTOR_MOBILE_MENU_BUTTON   = '[data-test-id="conversation-actions-button"]';
    const SELECTOR_DESKTOP_MENU_BUTTON  = 'conversations-list div.selected button';
    const SELECTOR_DELETE_BUTTON        = '[data-test-id="delete-button"]';
    const SELECTOR_CONFIRM_BUTTON       = 'message-dialog button[data-test-id="confirm-button"]';
    const SELECTOR_FINAL_BUTTON         = '#app-root > main > div > button';
    const SELECTOR_SIDE_NAV             = 'bard-sidenav';
    const SELECTOR_SIDE_NAV_TOGGLE      = "button[data-test-id='side-nav-menu-button']";

    const POLLING_INTERVAL              = 100;   // ms
    const MAX_POLLING_TIME              = 1000;  // ms
    const POST_CONFIRM_DELAY            = 200;   // ms

    // --- Utility functions ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function pollForElement(selector, maxTime) {
        const start = Date.now();
        while (Date.now() - start < maxTime) {
            const el = document.querySelector(selector);
            if (el) return el;
            await sleep(POLLING_INTERVAL);
        }
        return null;
    }

    // --- Clear dataset flag when dialog closes (so new listeners can be added next time) ---
    function clearConfirmDatasetOnClose() {
        const confirmBtn = document.querySelector(SELECTOR_CONFIRM_BUTTON);
        if (confirmBtn) {
            delete confirmBtn.dataset.sideNavListenerAdded;
        }
    }

    // Listen for dialog-close clicks (e.g., mat-dialog-close attribute)
    document.body.addEventListener('click', event => {
        if (event.target.closest('[mat-dialog-close]')) {
            clearConfirmDatasetOnClose();
        }
    });

    // --- Main deletion sequence ---
    async function performDeletion() {
        try {
            // 1) Try mobile layout
            const mobileBtn = await pollForElement(SELECTOR_MOBILE_MENU_BUTTON, MAX_POLLING_TIME);
            if (mobileBtn && isElementVisible(mobileBtn)) {
                mobileBtn.click();
                const deleteBtn = await pollForElement(SELECTOR_DELETE_BUTTON, MAX_POLLING_TIME);
                if (!deleteBtn || !isElementVisible(deleteBtn)) throw new Error('Delete not found (mobile)');
                deleteBtn.click();
                const confirmBtn = await pollForElement(SELECTOR_CONFIRM_BUTTON, MAX_POLLING_TIME);
                if (!confirmBtn || !isElementVisible(confirmBtn)) throw new Error('Confirm not found (mobile)');

                // Wait for Angular animation to finish
                await sleep(150);

                // Focus and highlight (use !important to override Angular styles)
                confirmBtn.focus({ preventScroll: false });
                confirmBtn.style.setProperty('background-color', 'lightgreen', 'important');
                confirmBtn.style.setProperty('border', '3px solid green', 'important');
                confirmBtn.style.setProperty('color', 'black', 'important');
                confirmBtn.style.setProperty('outline', '2px dashed darkgreen', 'important');
                // No side-nav logic for mobile
                return;
            }

            // 2) Try desktop layout
            const desktopBtn = await pollForElement(SELECTOR_DESKTOP_MENU_BUTTON, MAX_POLLING_TIME);
            if (desktopBtn) {
                desktopBtn.click();
                const deleteBtn = await pollForElement(`div[role="menu"] button${SELECTOR_DELETE_BUTTON}`, MAX_POLLING_TIME);
                if (!deleteBtn) throw new Error('Delete not found (desktop)');
                deleteBtn.click();
                const confirmBtn = await pollForElement(SELECTOR_CONFIRM_BUTTON, MAX_POLLING_TIME);
                if (!confirmBtn) throw new Error('Confirm not found (desktop)');

                // Wait for Angular animation to finish
                await sleep(150);

                // Focus and highlight (use !important)
                confirmBtn.focus({ preventScroll: false });
                confirmBtn.style.setProperty('background-color', 'lightgreen', 'important');
                confirmBtn.style.setProperty('border', '3px solid green', 'important');
                confirmBtn.style.setProperty('color', 'black', 'important');
                confirmBtn.style.setProperty('outline', '2px dashed darkgreen', 'important');

                // Add side-nav listener only once per dialog instance
                if (!confirmBtn.dataset.sideNavListenerAdded) {
                    confirmBtn.dataset.sideNavListenerAdded = 'true';
                    confirmBtn.addEventListener('click', async () => {
                        // After user clicks confirm, wait and then toggle side-nav if narrow
                        await sleep(POST_CONFIRM_DELAY);
                        const sideNav = document.querySelector(SELECTOR_SIDE_NAV);
                        if (sideNav) {
                            const style = window.getComputedStyle(sideNav);
                            const paddingLeft = parseFloat(style.paddingLeft) || 0;
                            const paddingRight = parseFloat(style.paddingRight) || 0;
                            const contentWidth = sideNav.clientWidth - paddingLeft - paddingRight;
                            if (contentWidth <= 72) {
                                const toggleBtn = document.querySelector(SELECTOR_SIDE_NAV_TOGGLE);
                                if (toggleBtn && toggleBtn.offsetParent !== null) {
                                    toggleBtn.click();
                                }
                            }
                        }
                    }, { once: true });
                }

                return;
            }

            alert('Conversation menu button not found. Cannot delete.');
        } catch (err) {
            console.error('Deletion error:', err.message);
        }
    }

    // --- Keyboard shortcut listener ---
    document.addEventListener('keydown', event => {
        if (
            event.code === SHORTCUT_KEY_CODE &&
            event.ctrlKey === USE_CTRL_KEY &&
            event.shiftKey === USE_SHIFT_KEY &&
            event.altKey === USE_ALT_KEY &&
            event.metaKey === USE_META_KEY
        ) {
            event.preventDefault();
            event.stopPropagation();
            performDeletion();
        }
        else if (event.ctrlKey && event.shiftKey && event.key === '?') {
            event.preventDefault();
            event.stopPropagation();
            showStatusDialog();
        }
        else if (event.ctrlKey && event.shiftKey && (event.key === 'S' || event.key === 's')) {
            event.preventDefault();
            event.stopPropagation();
            const finalBtn = document.querySelector(SELECTOR_FINAL_BUTTON);
            if (finalBtn && isElementVisible(finalBtn)) {
                finalBtn.click();
            } else {
                alert('Final action button not found.');
            }
        }
    }, true);

    // --- Manual delete button insertion for mobile layout only ---
    function insertMobileButton() {
        const mobileBtn = document.querySelector(SELECTOR_MOBILE_MENU_BUTTON);
        const isVisible = isElementVisible(mobileBtn);
        document.querySelectorAll('.delete-shortcut-button').forEach(b => b.remove());

        if (isVisible) {
            let wrapper = mobileBtn.closest('div.menu-button-wrapper') || mobileBtn.parentElement;
            if (!wrapper || !wrapper.classList.contains('menu-button-wrapper')) return;
            const btn = document.createElement('button');
            btn.className = 'delete-shortcut-button';
            btn.title = 'Delete conversation (Ctrl+Shift+Backspace)';
            btn.textContent = '🗑️';
            btn.style.marginLeft = '8px';
            btn.style.padding = '4px';
            btn.style.border = '1px solid red';
            btn.style.background = 'yellow';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '9999';
            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                performDeletion();
            });
            wrapper.parentNode.insertBefore(btn, wrapper.nextSibling);
        }
    }

    let debounce;
    const observer = new MutationObserver(() => {
        clearTimeout(debounce);
        debounce = setTimeout(insertMobileButton, 150);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    setTimeout(insertMobileButton, 500);

})();
