// ==UserScript==
// @name         Save a Gemini message to Google Docs
// @namespace    https://x.com/TakashiSasaki/greasyfork/gemini-message-options-shortcut
// @version      0.4.1
// @description  Uses Ctrl+Shift+D to export a Gemini message to Google Docs, injecting per-message export buttons, highlighting UI elements, and outlining dynamic content with the topmost solid and others dashed. Includes injection banner and menu command for debugging.
// @author       Takashi Sasasaki
// @license      MIT
// @homepageURL  https://x.com/TakashiSasaki
// @match        https://gemini.google.com/app/*
// @match        https://gemini.google.com/app
// @icon         https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535471/Save%20a%20Gemini%20message%20to%20Google%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/535471/Save%20a%20Gemini%20message%20to%20Google%20Docs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Injection banner ---
    const SCRIPT_NAME = 'Save a Gemini message to Google Docs';
    const banner = document.createElement('div');
    banner.textContent = SCRIPT_NAME;
    banner.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        z-index: 999999;
        font-size: 12px;
        font-family: sans-serif;
    `;
    document.body.appendChild(banner);

    // --- Configuration ---
    const USE_CTRL_KEY                     = true;
    const USE_SHIFT_KEY                    = true;
    const TRIGGER_KEY_D                    = 'D';
    const SELECTOR_MESSAGE_MENU_BUTTON     = '[data-test-id="more-menu-button"]';
    const SELECTOR_EXPORT_BUTTON           = '[data-test-id="export-button"]';
    const SELECTOR_SHARE_AND_EXPORT_BUTTON = '[data-test-id="share-and-export-menu-button"]';
    const SELECTOR_RESPONSE_CONTAINER      = 'response-container';
    const EXPORT_BTN_CLASS                 = 'gm-export-btn';
    const WAIT_BEFORE_CLICK_HIGHLIGHT_MS   = 150;
    const WAIT_AFTER_MENU_CLICK_MS         = 200;
    const WAIT_AFTER_EXPORT_MENU_CLICK_MS  = 200;
    const WAIT_AFTER_SHARE_BUTTON_CLICK_MS = 200;
    const WAIT_AFTER_ESC_MS                = 150;
    const POLLING_INTERVAL_MS              = 50;
    const MAX_POLLING_TIME_MS              = 3000;

    // --- Highlight styles ---
    const HIGHLIGHT_STYLE = {
        backgroundColor: 'rgba(255,255,0,0.7)',
        border:          '2px solid orange',
        outline:         '2px dashed red',
        zIndex:          '99999',
        transition:      'background-color 0.1s, border 0.1s, outline 0.1s'
    };
    const DEFAULT_STYLE_KEYS = ['backgroundColor','border','outline','zIndex','transition'];

    let lastHighlightedElement = null;
    let lastOriginalStyles     = {};

    // --- Apply & remove highlight on an element ---
    function applyHighlight(el) {
        if (!el) return;
        removeCurrentHighlight();
        lastOriginalStyles = {};
        DEFAULT_STYLE_KEYS.forEach(key => {
            lastOriginalStyles[key] = el.style[key] || '';
        });
        Object.assign(el.style, HIGHLIGHT_STYLE);
        lastHighlightedElement = el;
    }
    function removeCurrentHighlight() {
        if (lastHighlightedElement) {
            Object.assign(lastHighlightedElement.style, lastOriginalStyles);
        }
        lastHighlightedElement = null;
        lastOriginalStyles     = {};
    }

    // --- Visibility helpers ---
    function isElementBasicallyVisible(el) {
        if (!el) return false;
        const s = window.getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && el.offsetParent;
    }
    function isElementInViewport(el) {
        if (!isElementBasicallyVisible(el)) return false;
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
    }

    // --- Sleep helper ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Poll for visible element ---
    async function pollForElement(selector, maxTime, interval) {
        const start = Date.now();
        while (Date.now() - start < maxTime) {
            for (const c of document.querySelectorAll(selector)) {
                if (isElementInViewport(c)) return c;
            }
            await sleep(interval);
        }
        console.warn(`[${SCRIPT_NAME}] pollForElement timed out: ${selector}`);
        return null;
    }

    // --- Find "Export to Docs" menu item ---
    async function findExportToDocsButton(maxTime, interval) {
        const start = Date.now();
        while (Date.now() - start < maxTime) {
            const buttons = document.querySelectorAll(
                'button.mat-ripple.option, button[matripple].option, button.mat-mdc-menu-item'
            );
            for (const btn of buttons) {
                const lab = btn.querySelector('span.item-label, span.mat-mdc-menu-item-text');
                const ico = btn.querySelector('mat-icon[data-mat-icon-name="docs"]');
                if (lab && lab.textContent.trim() === 'Export to Docs' && ico && isElementInViewport(btn)) {
                    return btn;
                }
            }
            await sleep(interval);
        }
        return null;
    }

    // --- Export sequence for a specific container ---
    async function exportFor(container) {
        removeCurrentHighlight();
        const menuBtn = container.querySelector(SELECTOR_MESSAGE_MENU_BUTTON);
        if (!menuBtn || !isElementInViewport(menuBtn)) {
            console.warn(`[${SCRIPT_NAME}] Menu button not found in container`);
            return;
        }
        applyHighlight(menuBtn);
        await sleep(WAIT_BEFORE_CLICK_HIGHLIGHT_MS);
        menuBtn.click();
        await sleep(WAIT_AFTER_MENU_CLICK_MS);

        let exportMenu = await pollForElement(SELECTOR_EXPORT_BUTTON, MAX_POLLING_TIME_MS, POLLING_INTERVAL_MS);
        if (!exportMenu) {
            removeCurrentHighlight();
            document.body.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape', code: 'Escape', keyCode: 27, which: 27,
                bubbles: true, cancelable: true
            }));
            await sleep(WAIT_AFTER_ESC_MS);
            const shareBtn = await pollForElement(SELECTOR_SHARE_AND_EXPORT_BUTTON, MAX_POLLING_TIME_MS, POLLING_INTERVAL_MS);
            if (shareBtn) exportMenu = shareBtn;
        }
        if (exportMenu) {
            applyHighlight(exportMenu);
            await sleep(WAIT_BEFORE_CLICK_HIGHLIGHT_MS);
            exportMenu.click();
            await sleep(WAIT_AFTER_EXPORT_MENU_CLICK_MS);

            const docsBtn = await findExportToDocsButton(MAX_POLLING_TIME_MS, POLLING_INTERVAL_MS);
            if (docsBtn) {
                applyHighlight(docsBtn);
                await sleep(WAIT_BEFORE_CLICK_HIGHLIGHT_MS);
                docsBtn.click();
                console.log(`[${SCRIPT_NAME}] Export to Docs clicked for container.`);
            } else {
                console.warn(`[${SCRIPT_NAME}] 'Export to Docs' button not found.`);
            }
        } else {
            console.error(`[${SCRIPT_NAME}] Neither export menu found.`);
        }
        removeCurrentHighlight();
    }

    // --- Inject Export button into each response-container ---
    function injectExportButtons() {
        document.querySelectorAll(SELECTOR_RESPONSE_CONTAINER).forEach(container => {
            if (container.dataset.hasExportBtn) return;
            const inner = container.querySelector('div');
            if (!inner) return;
            const btn = document.createElement('button');
            btn.textContent = '📄 Export';
            btn.className = EXPORT_BTN_CLASS;
            btn.style.cssText = `
                margin-left: 8px;
                padding: 2px 6px;
                font-size: 12px;
                cursor: pointer;
            `;
            btn.addEventListener('click', e => {
                e.stopPropagation();
                exportFor(container);
            });
            inner.appendChild(btn);
            container.dataset.hasExportBtn = 'true';
        });
    }

    // --- Outline dynamic content, topmost solid others dashed ---
    function processContainers() {
        injectExportButtons();
        // Clear all outlines on inner divs
        document.querySelectorAll(`${SELECTOR_RESPONSE_CONTAINER} > div`).forEach(div => {
            div.style.outline = '';
        });
        // Find visible containers
        const visibles = Array.from(document.querySelectorAll(SELECTOR_RESPONSE_CONTAINER))
            .filter(c => isElementInViewport(c) && c.querySelector('div'));
        if (visibles.length === 0) return;
        // Determine topmost
        visibles.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        const top = visibles[0];
        // Apply outlines
        visibles.forEach(c => {
            const inner = c.querySelector('div');
            if (!inner) return;
            if (c === top) {
                inner.style.outline = '3px solid lime';
            } else {
                inner.style.outline = '3px dashed lime';
            }
        });
    }
    window.addEventListener('load',   processContainers);
    window.addEventListener('scroll',  processContainers);
    window.addEventListener('resize',  processContainers);

    // --- Observe for new containers ---
    new MutationObserver(muts => {
        for (const m of muts) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1 &&
                    (node.matches(SELECTOR_RESPONSE_CONTAINER) || node.querySelector(SELECTOR_RESPONSE_CONTAINER))
                ) {
                    processContainers();
                    return;
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    // --- Keyboard shortcut listener (fallback) ---
    document.addEventListener('keydown', event => {
        if (
            event.ctrlKey === USE_CTRL_KEY &&
            event.shiftKey === USE_SHIFT_KEY &&
            event.key.toUpperCase() === TRIGGER_KEY_D
        ) {
            event.preventDefault();
            event.stopPropagation();
            const topContainer = Array.from(document.querySelectorAll(SELECTOR_RESPONSE_CONTAINER))
                .find(isElementInViewport);
            if (topContainer) exportFor(topContainer);
        }
    }, true);

    // --- Tampermonkey menu command ---
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand(`Check ${SCRIPT_NAME}`, () => {
            alert(`${SCRIPT_NAME} is active`);
        });
    }

    // --- Log load ---
    if (typeof GM_info !== 'undefined' && GM_info.script) {
        console.log(`[${SCRIPT_NAME}] v${GM_info.script.version} loaded and active.`);
    } else {
        console.log(`[${SCRIPT_NAME}] loaded and active.`);
    }
})();
