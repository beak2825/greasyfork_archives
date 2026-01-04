// ==UserScript==
// @name         YouTube Fullscreen Scroll Disabler
// @namespace    https://youtube.com
// @version      1.0.2
// @description  Disable scrolling when YouTube is in fullscreen mode and hide scrollbar. Also hide certain fullscreen UI elements.
// @author       Lolen10
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/510801/YouTube%20Fullscreen%20Scroll%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/510801/YouTube%20Fullscreen%20Scroll%20Disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store references to hidden elements and their previous display values
    let hiddenElements = [];

    // Store previous overflow values so we can restore them
    let previousOverflow = { html: '', body: '' };
    let styleElementId = 'ytfs-scrollblocker-style';
    let listenersAdded = false;

    // Event listeners for fullscreen change
    document.addEventListener('fullscreenchange', toggleScrollAndContent, false);
    document.addEventListener('webkitfullscreenchange', toggleScrollAndContent, false); // Older WebKit
    document.addEventListener('mozfullscreenchange', toggleScrollAndContent, false);    // Firefox

    // Also handle when the user presses F (YouTube's fullscreen toggle) or when the player switches programmatically.
    // We'll run the toggle function once on script load to handle pages that already are fullscreen (rare).
    setTimeout(toggleScrollAndContent, 500);

    function toggleScrollAndContent() {
        if (isFullScreen()) {
            enterFullscreenMode();
        } else {
            exitFullscreenMode();
        }
    }

    function isFullScreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    }

    // ---------- Fullscreen enter/exit ----------

    function enterFullscreenMode() {
        // Disable scroll input
        disableScroll();

        // Hide content below the #single-column-container (existing behavior)
        removeContentBelowContainer();

        // Hide ytp fullscreen grid main content(s)
        hideBySelectorAll('.ytp-fullscreen-grid-main-content');

        // Hide expand button(s)
        hideBySelectorAll('.ytp-fullscreen-grid-expand-button.ytp-button');
    }

    function exitFullscreenMode() {
        // Re-enable scrolling
        enableScroll();

        // Restore previously hidden elements
        restoreHiddenElements();
    }

    // ---------- Hiding / restoring helpers ----------

    function hideBySelectorAll(selector) {
        const nodes = document.querySelectorAll(selector);
        nodes.forEach(node => {
            // Avoid hiding same node twice
            if (!hiddenElements.some(entry => entry.el === node)) {
                hiddenElements.push({ el: node, prevDisplay: node.style.display || '' });
                node.style.display = 'none';
            }
        });
    }

    // Remove all content below #single-column-container (keeps previous behavior but stores prev display)
    function removeContentBelowContainer() {
        const container = document.getElementById('single-column-container');
        if (container) {
            let nextSibling = container.nextElementSibling;
            while (nextSibling) {
                if (!hiddenElements.some(entry => entry.el === nextSibling)) {
                    hiddenElements.push({ el: nextSibling, prevDisplay: nextSibling.style.display || '' });
                    nextSibling.style.display = 'none';
                }
                nextSibling = nextSibling.nextElementSibling;
            }
        }
    }

    function restoreHiddenElements() {
        hiddenElements.forEach(entry => {
            try {
                entry.el.style.display = entry.prevDisplay;
            } catch (err) {
                // element might have been removed from DOM — ignore
            }
        });
        hiddenElements = [];
    }

    // ---------- Scroll blocking ----------

    function preventScroll(e) {
        // Only prevent if in fullscreen (defensive)
        if (!isFullScreen()) return;
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function preventKeyScroll(e) {
        if (!isFullScreen()) return;
        // Keys that can scroll the page
        const blockedKeys = [
            'PageUp', 'PageDown', 'Home', 'End', ' '
        ];
        if (blockedKeys.includes(e.key)) {
            // Allow if user is focused in an input/textarea/contenteditable
            const target = e.target;
            const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
            const isEditable = target && (target.isContentEditable || tag === 'input' || tag === 'textarea' || target.getAttribute('role') === 'textbox');
            if (!isEditable) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }

    function disableScroll() {
        if (listenersAdded) return; // don't add twice

        // Save previous overflow values
        previousOverflow.html = document.documentElement.style.overflow || '';
        previousOverflow.body = document.body.style.overflow || '';

        // Force hide overflow to block scrollbar-based scrolling as a robust fallback
        try {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } catch (err) {
            // ignore if not allowed
        }

        // Insert style to hide scrollbars (visual)
        if (!document.getElementById(styleElementId)) {
            const style = document.createElement('style');
            style.id = styleElementId;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(
                'html, body { overscroll-behavior: none !important; height: 100% !important; } ' +
                '::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }'
            ));
            (document.head || document.documentElement).appendChild(style);
        }

        // Add wheel & touchmove listeners (passive: false to allow preventDefault)
        window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
        window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });

        // Keydown to block space/arrow/page keys
        window.addEventListener('keydown', preventKeyScroll, { passive: false, capture: true });

        listenersAdded = true;
    }

    function enableScroll() {
        if (!listenersAdded) {
            // still attempt to clean up style/overflow even if listeners weren't marked as added
            cleanupOverflowAndStyle();
            return;
        }

        window.removeEventListener('wheel', preventScroll, { capture: true });
        window.removeEventListener('touchmove', preventScroll, { capture: true });
        window.removeEventListener('keydown', preventKeyScroll, { capture: true });

        cleanupOverflowAndStyle();

        listenersAdded = false;
    }

    function cleanupOverflowAndStyle() {
        // Restore previous overflow values
        try {
            document.documentElement.style.overflow = previousOverflow.html || '';
            document.body.style.overflow = previousOverflow.body || '';
        } catch (err) {
            // ignore
        }

        // Remove style element that hid scrollbars
        const style = document.getElementById(styleElementId);
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }

    // Keep things tidy if the user navigates or the page rebuilds heavy parts of the DOM:
    // If the fullscreen element is removed unexpectedly, make sure we restore.
    const observer = new MutationObserver(() => {
        if (!isFullScreen() && (hiddenElements.length > 0 || listenersAdded)) {
            // Force restore if DOM changed and we are no longer fullscreen
            exitFullscreenMode();
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Clean up on unload
    window.addEventListener('beforeunload', () => {
        try { observer.disconnect(); } catch (e) {}
        enableScroll();
    });

})();
