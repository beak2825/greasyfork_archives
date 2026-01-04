// ==UserScript==
// @name         1337x The Final, Uncompromised Solution
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  A "scorched earth" approach to blocking all pop-ups. It overrides every known browser API and destroys any suspicious element, regardless of site functionality.
// @author       Pvshkin_1
// @match        https://1337x.to/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546079/1337x%20The%20Final%2C%20Uncompromised%20Solution.user.js
// @updateURL https://update.greasyfork.org/scripts/546079/1337x%20The%20Final%2C%20Uncompromised%20Solution.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.info("[1337x Orbital Strike] All variables accounted for. Commencing total annihilation protocol.");

    // --- Phase 1: Preemptive API Neutralization ---
    const originalOpen = window.open;
    const originalEval = window.eval;
    const originalFunction = window.Function;
    const originalSetTimeout = window.setTimeout;

    window.open = (url) => {
        console.warn(`[Blocker] NUKED window.open attempt: ${url}`);
        return null;
    };
    window.eval = (code) => {
        if (typeof code === 'string' && (code.includes('window.open') || code.includes('location.href'))) {
            console.warn(`[Blocker] Intercepted and blocked eval() containing suspicious code.`);
            return;
        }
        return originalEval(code);
    };
    window.Function = function(...args) {
        const body = args.pop();
        if (typeof body === 'string' && (body.includes('window.open') || body.includes('location.href'))) {
            console.warn(`[Blocker] Intercepted and blocked new Function() containing suspicious code.`);
            return () => {};
        }
        return new originalFunction(...args, body);
    };
    window.setTimeout = function(callback, delay, ...args) {
        const callbackCode = callback.toString();
        if (typeof callbackCode === 'string' && (callbackCode.includes('window.open') || callbackCode.includes('location.href'))) {
            console.warn(`[Blocker] NUKED setTimeout call containing suspicious code.`);
            return;
        }
        return originalSetTimeout(callback, delay, ...args);
    };

    // --- Phase 2: Universal Event Suppression ---
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const blockedEvents = ['click', 'mousedown', 'mouseup', 'contextmenu', 'mouseenter', 'mouseover', 'touchstart', 'touchend', 'scroll'];
        const blockedElements = [window, document, document.body];
        if (blockedEvents.includes(type) && blockedElements.includes(this)) {
            console.warn(`[Blocker] NUKED event listener of type "${type}" on a key element.`);
            return;
        }
        originalAddEventListener.call(this, type, listener, options);
    };

    // --- Phase 3: Final Dom Destruction & Interception ---
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'IFRAME' || (node.shadowRoot && node.shadowRoot.mode === 'open')) {
                            console.warn(`[Blocker] NUKED an iframe or Shadow DOM container.`);
                            node.remove();
                        }
                        if ((node.style && node.style.position === 'fixed' && node.style.zIndex > 1000) ||
                            (node.style && node.style.position === 'absolute' && node.style.zIndex > 1000) ||
                            node.matches('.popup-overlay, .ad-modal, #popup-ad, [onclick], [onmousedown]')) {
                            console.warn("[Blocker] NUKED a suspected pop-up element.");
                            node.remove();
                        }
                    }
                });
            }
        }
    });

    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });

        // Manual override for all links to prevent mouse-up shenanigans
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mousedown', (e) => {
                e.stopImmediatePropagation();
            }, true);
            link.addEventListener('mouseup', (e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
                window.location.href = link.href;
            }, true);
        });

    }, 50);

})();