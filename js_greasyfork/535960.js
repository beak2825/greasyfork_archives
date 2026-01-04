// ==UserScript==
// @name         Force Enable Selection & Right-Click
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Re-enables text selection and right-click on restrictive websites
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535960/Force%20Enable%20Selection%20%20Right-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/535960/Force%20Enable%20Selection%20%20Right-Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 1. FORCE ENABLE TEXT SELECTION =====
    const enableSelection = () => {
        const style = document.createElement('style');
        style.textContent = `
            * {
                user-select: auto !important;
                -webkit-user-select: auto !important;
                -moz-user-select: text !important;
                -ms-user-select: auto !important;
            }
        `;
        document.head.appendChild(style);
    };

    // ===== 2. REMOVE ANTI-SELECTION EVENT LISTENERS =====
    const removeBlockingListeners = () => {
        const events = ['selectstart', 'mousedown', 'dragstart', 'contextmenu', 'copy', 'cut'];
        events.forEach(event => {
            document.addEventListener(event, e => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, true); // Use CAPTURING phase to block early
        });
    };

    // ===== 3. RE-ENABLE RIGHT-CLICK (CONTEXT MENU) =====
    const enableRightClick = () => {
        document.oncontextmenu = null;
        document.addEventListener('contextmenu', e => {
            e.stopPropagation();
        }, true);

        // Remove annoying "Right-click disabled" popups
        const removeNoClickPopups = () => {
            document.querySelectorAll('*').forEach(el => {
                if (getComputedStyle(el).cursor === 'none') {
                    el.style.cursor = 'auto !important';
                }
                if (el.oncontextmenu === false || el.hasAttribute('oncontextmenu')) {
                    el.removeAttribute('oncontextmenu');
                    el.oncontextmenu = null;
                }
            });
        };
        removeNoClickPopups();
    };

    // ===== 4. RUN IMMEDIATELY & AFTER PAGE LOAD =====
    enableSelection();
    removeBlockingListeners();
    enableRightClick();

    window.addEventListener('load', () => {
        enableSelection();
        enableRightClick();
    });

    // Continuously check for new elements (for SPAs like React/Angular)
    setInterval(() => {
        enableRightClick();
    }, 1000);
    // Remove iframes blocking selection (common in document viewers)
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.style.pointerEvents = 'auto !important';
    });
})();