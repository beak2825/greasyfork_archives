// ==UserScript==
// @name        AMOLED Dark Mode
// @namespace   AMOLEDDark
// @description Immersive dark mode for AMOLED screens
// @version     1.0
// @author      moony
// @match       *://*/*
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/530048/AMOLED%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530048/AMOLED%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const store = {
        get: () => {
            try { return GM_getValue('amoledDarkLevel', 0); }
            catch (e) { return parseInt(localStorage.getItem('amoledDarkLevel') || 0); }
        },
        set: (v) => {
            try { GM_setValue('amoledDarkLevel', v); }
            catch (e) { localStorage.setItem('amoledDarkLevel', v); }
        }
    };

    let darkLevel = store.get(),
        MAX_LEVELS = 4,
        styleEl = null,
        indicator = null;

    // Apply at document start
    if(document.documentElement) {
        styleEl = document.createElement('style');
        styleEl.className = 'amoled-style';
        document.documentElement.appendChild(styleEl);
        applyLevel(darkLevel);
    }

    // Create indicator when body is available
    document.addEventListener('DOMContentLoaded', () => {
        updateIndicator(darkLevel);
    });

    // Debounced hotkey handler
    let keyTimer;
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === '²') {
            if (keyTimer) return;
            keyTimer = setTimeout(() => { keyTimer = null; }, 300);

            darkLevel = (darkLevel + 1) % (MAX_LEVELS + 1);
            store.set(darkLevel);
            applyLevel(darkLevel);
            updateIndicator(darkLevel);
        }
    });

    function applyLevel(level) {
        if (!styleEl) return;

        if (level === 0) {
            styleEl.textContent = '';
            return;
        }

        let css = `*{background-color:#000!important;color:#fff!important;border-color:#333!important}
                   ::-webkit-scrollbar{width:3px!important;height:3px!important}
                   ::-webkit-scrollbar-thumb{background:#333!important;border-radius:3px!important}
                   ::-webkit-scrollbar-track{background:#000!important}`;

        if (level >= 2) css += 'aside,nav,footer,.sidebar,.ads,.banner,.menu,.navigation,.footer{display:none!important}';
        if (level >= 3) css += 'img,svg,video,iframe,canvas,button:not(.essential){display:none!important}';

        if (level >= 4) {
            css += 'body>*:not(#amoled-indicator){opacity:0.3!important} main,article,.content,#content,.main-content,.post,article *{opacity:1!important}';
        }

        styleEl.textContent = css;
    }

    function updateIndicator(level) {
        if (!document.body) return;

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'amoled-indicator';
            indicator.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#000;color:#fff;padding:5px;border-radius:3px;z-index:9999;font-size:12px;transition:opacity 0.3s;opacity:0.6;';
            indicator.addEventListener('mouseover', () => indicator.style.opacity = '1');
            indicator.addEventListener('mouseout', () => indicator.style.opacity = '0.6');
            document.body.appendChild(indicator);
        }

        const messages = ['Off (Ctrl+² to activate)', 'Pure Black', 'Distraction-Free', 'Text-Only', 'Focus Mode'];
        indicator.textContent = `AMOLED: ${messages[level]}`;

        // Auto-hide indicator after 3 seconds
        setTimeout(() => {
            if (indicator) indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator && indicator.style.opacity === '0')
                    indicator.style.display = 'none';
            }, 300);
        }, 3000);
    }
})();