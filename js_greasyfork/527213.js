// ==UserScript==
// @name         Microsoft Loop Full Width (Single Element)
// @namespace    http://tampermonkey.net/
// @version      2025-02-17
// @description  Makes Microsoft Loop use full screen width by updating a single element's CSS variable, and restores the original value via a toggle button with a fixed, translucent design.
// @author       Salo
// @match        https://loop.cloud.microsoft/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloud.microsoft
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527213/Microsoft%20Loop%20Full%20Width%20%28Single%20Element%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527213/Microsoft%20Loop%20Full%20Width%20%28Single%20Element%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isActive = true; // Global flag for feature status

    // Store the original value from the target element.
    let originalValue = null;

    // Function to find the target element: the first element whose inline style contains "--max-canvas-content-width"
    function findTargetElement() {
        return document.querySelector('div[style*="--max-canvas-content-width"]');
    }

    // Update the target element's property to the current screen width
    function updateTargetElement() {
        if (!isActive) return;

        const element = findTargetElement();
        if (element) {
            // Store the original value only once
            if (originalValue === null) {
                // If there is no value before, keep it as null so we know to remove it later.
                originalValue = element.style.getPropertyValue('--max-canvas-content-width') || null;
            }
            const screenWidth = window.innerWidth;
            element.style.setProperty('--max-canvas-content-width', screenWidth + 'px');
            console.log('Updated target element with --max-canvas-content-width:', screenWidth + 'px');
        } else {
            console.warn('Target element not found.');
        }
    }

    // Restore the target element's original CSS property value
    function restoreTargetElement() {
        const element = findTargetElement();
        if (element) {
            if (originalValue === null) {
                element.style.removeProperty('--max-canvas-content-width');
                console.log('Removed --max-canvas-content-width property from target element.');
            } else {
                element.style.setProperty('--max-canvas-content-width', originalValue);
                console.log('Restored target element with original --max-canvas-content-width:', originalValue);
            }
        }
    }

    // Set up MutationObserver to update the target element if it is added later
    const observer = new MutationObserver(mutations => {
        if (!isActive) return;
        // Simply try to update the target element, if it's in the DOM.
        updateTargetElement();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Create a floating toggle button with a fixed size and translucent style.
    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'toggleCanvasWidthUpdater';
        // Start with the "minimize" icon (🗕) for active functionality.
        btn.innerHTML = '🗕';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '15px',
            right: '20px',
            zIndex: '9999',
            width: '25px',
            height: '25px',
            // Translucent blue background using RGBA (opacity 0.7)
            backgroundColor: 'rgba(0, 120, 215, 0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '7px',
            cursor: 'pointer',
            fontSize: '12px', // Increase icon size for visibility
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            userSelect: 'none'
        });
        btn.addEventListener('click', () => {
            isActive = !isActive;
            // Toggle between the icons – 🗕 (active) and ⤢ (disabled)
            btn.innerHTML = isActive ? '🗕' : '⤢';
            console.log('Canvas update functionality is now', isActive ? 'enabled' : 'disabled');
            if (isActive) {
                updateTargetElement();
            } else {
                restoreTargetElement();
            }
        });
        document.body.appendChild(btn);
    }

    // Update the target element on load and window resize
    window.addEventListener('load', () => {
        updateTargetElement();
        createToggleButton();
    });
    window.addEventListener('resize', updateTargetElement);

})();
