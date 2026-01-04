// ==UserScript==
// @name         Scrollbar Hider
// @description  Hides scrollbars globally but keeps scrolling functionality
// @author       SSL-ACTX
// @version      1.1.0
// @license      MIT
// @grant        none
// @run-at       document-start
// @match        *://*/*
// @namespace https://greasyfork.org/users/1365732
// @downloadURL https://update.greasyfork.org/scripts/507806/Scrollbar%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/507806/Scrollbar%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide scrollbars but retain scrolling functionality
    const scrollbarHiderCSS = `
        /* Remove WebKit-based browsers' scrollbars */
        *::-webkit-scrollbar {
            width: 0;
            height: 0;
        }

        /* Hide scrollbars in Firefox, IE, and Edge */
        * {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
    `;

    // Key combination to toggle scrollbars (default: Ctrl + Alt + M)
    const TOGGLE_KEY_COMBINATION = {
        ctrlKey: true,
        altKey: true,
        key: 'm'  // Key to toggle (lowercase, but we'll handle both cases)
    };

    // Flag to track if scrollbars are currently hidden
    let scrollbarsHidden = false;

    /**
     * Injects the provided CSS into the document.
     */
    const injectCSS = (cssRules) => {
        try {
            const styleElement = document.createElement('style');
            styleElement.id = 'scrollbar-hider-style';
            styleElement.type = 'text/css';
            styleElement.textContent = cssRules;
            document.head.appendChild(styleElement);
        } catch (error) {
            console.error('Failed to inject CSS:', error);
        }
    };

    /**
     * Removes the injected CSS.
     */
    const removeCSS = () => {
        try {
            const styleElement = document.getElementById('scrollbar-hider-style');
            if (styleElement) {
                styleElement.remove();
            }
        } catch (error) {
            console.error('Failed to remove CSS:', error);
        }
    };

    /**
     * Toggles the visibility of scrollbars.
     */
    const toggleScrollbars = () => {
        if (scrollbarsHidden) {
            removeCSS();
        } else {
            injectCSS(scrollbarHiderCSS);
        }
        scrollbarsHidden = !scrollbarsHidden;
        // Save preference in localStorage
        localStorage.setItem('scrollbarsHidden', scrollbarsHidden);
    };

    /**
     * Adds event listener for keypress to toggle scrollbars.
     */
    const addToggleListener = () => {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey === TOGGLE_KEY_COMBINATION.ctrlKey &&
                event.altKey === TOGGLE_KEY_COMBINATION.altKey &&
                (event.key === TOGGLE_KEY_COMBINATION.key || event.key === TOGGLE_KEY_COMBINATION.key.toUpperCase())) {
                event.preventDefault();
                toggleScrollbars();
            }
        });
    };

    // Initialize the script
    scrollbarsHidden = localStorage.getItem('scrollbarsHidden') === 'true';
    if (scrollbarsHidden) {
        injectCSS(scrollbarHiderCSS);
    }
    addToggleListener();
})();
