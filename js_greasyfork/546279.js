// ==UserScript==
// @name         HackAPrompt - Focus Mode 🎯
// @namespace    KarthiDreamr.AI.RedTeam.Tools
// @version      2.4
// @description  Youtube Full Screen like Zooming for HackAPrompt Challenges 
// @author       KarthiDreamr & Perplexity (Logic updated by Gemini)
// @match        https://www.hackaprompt.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546279/HackAPrompt%20-%20Focus%20Mode%20%F0%9F%8E%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/546279/HackAPrompt%20-%20Focus%20Mode%20%F0%9F%8E%AF.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- URL Validation: Only run on URLs with exactly 2 segments after /track/ ---
    function isValidURL() {
        const pathname = window.location.pathname;
        // Regex pattern: /track/[segment1]/[segment2] (with optional trailing slash)
        const pattern = /^\/track\/[^\/]+\/[^\/]+\/?$/;
        return pattern.test(pathname);
    }

    // Early exit if URL doesn't match the required pattern
    if (!isValidURL()) {
        console.log('HackAPrompt Script: URL does not match required pattern. Script will not run.');
        return;
    }

    console.log('HackAPrompt Script: Valid URL detected. Initializing...');

    // --- Configuration ---
    const TOGGLE_BUTTON_ID = "hap-isolate-toggle-button";
    const ISOLATED_BODY_CLASS = "hap-isolated-view-active";

    // --- State Variables ---
    let isIsolated = false; // default false; we'll explicitly apply Focus View on init
    let targetElement = null;
    let intervalId = null;

    // --- CSS Injection ---
    GM_addStyle(`

        /* --- FIX: Ensure the TabList remains visible --- */
        body.${ISOLATED_BODY_CLASS} [data-hap-target="true"] [role="tablist"] {
          flex-shrink: 0 !important;
        }

        /* --- FIX: Ensure the bottom 'Points/Button' div remains visible --- */
        body.${ISOLATED_BODY_CLASS} [data-hap-target="true"] .sm\\:mt-auto {
            flex-shrink: 0 !important;
            padding-bottom: 2.3rem !important; /* Adds a little space at the bottom */
        }

        /* --- Toggle Button Styles --- */
        #${TOGGLE_BUTTON_ID} {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999999; /* Must be higher than the focused element */
            background-color: #1a202c;
            color: #e2e8f0;
            border: 1px solid #4a5568;
            border-radius: 25px;
            padding: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            overflow: hidden;
            width: 40px;
            height: 40px;
        }
        #${TOGGLE_BUTTON_ID}:hover { width: 170px; }
        #${TOGGLE_BUTTON_ID} .toggle-icon { flex-shrink: 0; width: 24px; height: 24px; margin: 0; transition: transform 0.3s ease; }
        #${TOGGLE_BUTTON_ID} .toggle-text { white-space: nowrap; opacity: 0; transition: opacity 0.2s ease 0.1s; font-family: sans-serif; font-size: 14px; margin-left: 8px; }
        #${TOGGLE_BUTTON_ID}:hover .toggle-text { opacity: 1; }

        /**************************************************************
         * Promote the target element instead of hiding others
         **************************************************************/

        /* 1. When active, lift the target element and make it a full-screen overlay */
        body.${ISOLATED_BODY_CLASS} [data-hap-target="true"] {
             position: fixed !important;
             top: 0 !important;
             left: 0 !important;
             width: 100vw !important;
             height: 100vh !important;
             z-index: 999990 !important; /* High z-index to cover page content */
             background: #0F172A !important; /* Add a background color to hide content underneath */
             padding: 0 !important;
             margin-top: 0 !important;
             display: flex !important;
             flex-direction: row !important;
        }

        /* 2. Prevent the body from scrolling while in focus mode */
        body.${ISOLATED_BODY_CLASS} {
            overflow: hidden !important;
        }

        /**************************************************************
         * FULL HEIGHT STYLES (These are still needed for the internals)
         **************************************************************/

        body.${ISOLATED_BODY_CLASS} [data-hap-target="true"] .flex-1 {
            flex-grow: 1 !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
        }

        body.${ISOLATED_BODY_CLASS} [data-hap-target="true"] [role="tabpanel"],
        body.${ISOLATED_BODY_CLASS} [data-hap-target="true"] .overflow-y-auto {
            height: 100% !important;
            max-height: none !important;
            flex: 1 !important;
        }

        body.${ISOLATED_BODY_CLASS} [data-hap-target="true"] textarea {
            min-height: 200px !important;
            flex-grow: 1 !important;
        }

        body.${ISOLATED_BODY_CLASS} .h-\\[calc\\(100dvh-8rem\\)\\] { height: 100% !important; }
        body.${ISOLATED_BODY_CLASS} .h-\\[calc\\(100dvh-13rem\\)\\] { height: 100% !important; flex: 1 !important; }
        body.${ISOLATED_BODY_CLASS} .lg\\:h-\\[calc\\(100dvh-8rem\\)\\] { height: 100% !important; }
    `);

    // --- UI helpers ---
    const ICON_EXPAND = `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`;
    const ICON_CONTRACT = `<path d="M15 3h6v6m-11 5L21 3m-3 18h-6v-6m-1-5L3 21"/>`;

    function getButtonParts() {
        const button = document.getElementById(TOGGLE_BUTTON_ID);
        if (!button) return {};
        return {
            button,
            textEl: button.querySelector('.toggle-text'),
            iconEl: button.querySelector('.toggle-icon')
        };
    }

    function setButtonState({ label, iconPath }) {
        const { textEl, iconEl } = getButtonParts();
        if (textEl) textEl.textContent = label;
        if (iconEl) iconEl.innerHTML = iconPath;
    }

    // --- Core Logic: explicit apply/revert to avoid accidental untoggles ---
    function applyFocus() {
        if (!targetElement) return;
        targetElement.setAttribute('data-hap-target', 'true');
        document.body.classList.add(ISOLATED_BODY_CLASS);
        isIsolated = true;
        setButtonState({ label: 'Restore View', iconPath: ICON_CONTRACT });
        console.log('HackAPrompt Script: View Focused.');
    }

    function applyNormal() {
        if (!targetElement) return;
        targetElement.removeAttribute('data-hap-target');
        document.body.classList.remove(ISOLATED_BODY_CLASS);
        isIsolated = false;
        setButtonState({ label: 'Focus View', iconPath: ICON_EXPAND });
        console.log('HackAPrompt Script: View Restored.');
    }

    function toggleView() {
        if (!targetElement) {
            console.warn('HackAPrompt Script: Cannot toggle, target element not found.');
            return;
        }
        if (isIsolated) applyNormal(); else applyFocus();
    }

    function createToggleButton() {
        if (document.getElementById(TOGGLE_BUTTON_ID)) return;
        const button = document.createElement('div');
        button.id = TOGGLE_BUTTON_ID;
        button.title = "Toggle Focus View";
        button.innerHTML = `
            <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${ICON_EXPAND}
            </svg>
            <span class="toggle-text">Focus View</span>`;
        document.body.appendChild(button);
        button.addEventListener('click', toggleView);
    }

    function initialize() {
        if (document.getElementById(TOGGLE_BUTTON_ID) && targetElement) {
            if (intervalId) clearInterval(intervalId);
            return;
        }

        // Find the main two-column container
        const allFlexRows = document.querySelectorAll('div.lg\\:flex-row');
        let foundElement = null;
        for (const container of allFlexRows) {
            const leftPanel = container.querySelector(':scope > div[class*="lg:w-[40%]"]');
            const rightPanel = container.querySelector(':scope > div[class*="lg:w-[58%]"]');
            if (leftPanel && rightPanel) {
                foundElement = container;
                break;
            }
        }

        targetElement = foundElement;

        if (targetElement) {
            console.log('HackAPrompt Isolate Script: Target element located. Initializing controls.');
            createToggleButton();

            // Apply Focus View by default on first init (without toggling away)
            if (!isIsolated) applyFocus();

            if (intervalId) clearInterval(intervalId);
        }
    }

    // Polling mechanism
    intervalId = setInterval(initialize, 500);
    setTimeout(() => {
        if (intervalId) {
            clearInterval(intervalId);
            if (!targetElement) {
                console.warn('HackAPrompt Script: Target element could not be found after 20 seconds.');
            }
        }
    }, 20000);
})();