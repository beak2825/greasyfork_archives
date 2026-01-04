// ==UserScript==
// @name         AI Studio Style Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple script to maximize chat width and apply other core visual improvements to AI Studio.
// @author       AI: Google's Gemini Model
// @match        https://aistudio.google.com/prompts/*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_64x64.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542712/AI%20Studio%20Style%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/542712/AI%20Studio%20Style%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This script applies a fixed set of styles to improve the AI Studio interface.
    // There is no configuration menu; all features are enabled by default.
    const styles = `
        /* --- General Cleanup --- */
        /* Hide top/bottom disclaimer bars and feedback buttons */
        .disclaimer,
        ms-navbar .disclaimer-container,
        ms-chat-turn .turn-footer {
            display: none !important;
        }

        /* --- Full Width Mode --- */
        /* Hide UI elements that constrain width */
        ms-right-side-panel .toggles-container,
        .nav-toggle-wrapper {
            display: none !important;
        }
        /* Remove margin from main editor section */
        ms-chunk-editor > section.chunk-editor-main {
            margin-right: 0 !important;
        }
        /* Adjust padding on the main scroll container */
        ms-autoscroll-container {
            padding-left: 10px !important;
            padding-right: 10px !important;
        }
        /* Make chat view and prompt input use full width */
        .chat-view-container,
        footer .prompt-input-wrapper-container {
            max-width: 100% !important;
        }

        /* --- Readability Improvements --- */
        /* Apply zebra striping to chat turns for better separation */
        ms-chat-turn:nth-of-type(even) > .chat-turn-container {
            background-color: var(--color-surface-container-low, #2a2b2e) !important;
        }
        /* Make turn actions (copy, edit, etc.) always visible without hovering */
        ms-chat-turn .actions.hover-or-edit {
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        /* Make content within a turn use its full width (removes icon indent) */
        ms-prompt-chunk,
        ms-text-chunk {
            flex-direction: column !important;
        }
    `;

    // Inject the styles into the page
    GM_addStyle(styles);

})();