// ==UserScript==
// @name         Fix ChatGPT Placeholder / Caret
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @version      1.0.1
// @description  Band Aid fix for ChatGpt not having placeholder text and a caret in the question box.
// @namespace https://greasyfork.org/users/1495774
// @downloadURL https://update.greasyfork.org/scripts/542828/Fix%20ChatGPT%20Placeholder%20%20Caret.user.js
// @updateURL https://update.greasyfork.org/scripts/542828/Fix%20ChatGPT%20Placeholder%20%20Caret.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyStyles(pm) {
        pm.style.all = 'unset';
        pm.style.caretColor = 'white';
        pm.style.padding = '0px 0px 0px 0px';
        pm.style.margin = '0px 0px 0px 1px';
        pm.style.fontSize = '16px';
        pm.style.lineHeight = '1.2';
        pm.style.minHeight = '2em';
        pm.style.height = 'auto';
        pm.style.boxSizing = 'border-box';
        pm.style.overflow = 'hidden';
        pm.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.6)');

        pm.setAttribute('contenteditable', 'true');
        pm.focus();
    }

    function fixProseMirror() {
        const pm = document.querySelector('.ProseMirror');
        if (pm) applyStyles(pm);
        else observeForProseMirror();
    }

    let proseObserver;
    function observeForProseMirror() {
        if (proseObserver) proseObserver.disconnect();

        proseObserver = new MutationObserver((mutations, obs) => {
            const pm = document.querySelector('.ProseMirror');
            if (pm) {
                applyStyles(pm);
                obs.disconnect();
            }
        });

        proseObserver.observe(document.body, { childList: true, subtree: true });
    }

    // === Hook into SPA navigation ===
    let lastUrl = location.href;
    const observeUrlChange = () => {
        const checkUrl = () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(fixProseMirror, 200); // Give the DOM time to update
            }
        };

        // Monkey-patch pushState & replaceState
        const origPushState = history.pushState;
        history.pushState = function(...args) {
            origPushState.apply(this, args);
            checkUrl();
        };

        const origReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            origReplaceState.apply(this, args);
            checkUrl();
        };

        window.addEventListener('popstate', checkUrl);
    };

    // Start everything
    fixProseMirror();
    observeUrlChange();
})();
