// ==UserScript==
// @name         Dark Mode (Weaboo)
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Invert Dark/Light Mode All Websites
// @author       weaboo
// @license      aanriski™ - ©weaboo
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542273/Dark%20Mode%20%28Weaboo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542273/Dark%20Mode%20%28Weaboo%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const styleId = 'invert-mode-style';

    const invertCSS = `
        html {
            filter: invert(1) hue-rotate(180deg) !important;
            background: #000 !important;
        }

        img, video, iframe, picture, canvas, object {
            filter: invert(1) hue-rotate(180deg) !important;
        }
    `;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = invertCSS;

    const tryInject = () => {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head && !document.getElementById(styleId)) {
            head.appendChild(style);
        } else {
            setTimeout(tryInject, 0);
        }
    };

    tryInject();
})();


/**
(function () {
    'use strict';

    const styleId = 'universal-dark-mode-style';

    const darkCSS = `
        html, body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        *, *::before, *::after {
            background-color: transparent !important;
            color: inherit !important;
            border-color: #444 !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }

        a, a * {
            color: #80cbc4 !important;
        }

        header, footer, nav, section, aside, article, div {
            background-color: #1e1e1e !important;
        }

        img, video {
            filter: brightness(0.8) contrast(1.2) !important;
        }

        ::selection {
            background: #555 !important;
            color: #fff !important;
        }

        input, textarea, select, button {
            background-color: #2a2a2a !important;
            color: #e0e0e0 !important;
            border: 1px solid #666 !important;
        }

        [style*="background"], [style*="background-color"] {
            background-color: #1a1a1a !important;
        }
    `;

    // Langsung injeksi style ke <head>, walaupun <head> belum ada
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = darkCSS;

    const tryInject = () => {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head && !document.getElementById(styleId)) {
            head.appendChild(style);
        } else {
            setTimeout(tryInject, 0); // ulang terus sampe <head> muncul
        }
    };

    tryInject();

    // Setelah load, baru tambah toggle dan observer
    window.addEventListener('DOMContentLoaded', () => {
        addToggleButton();
        startObserver();
    });

    // Toggle button
    function addToggleButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '🌓';
        btn.title = 'Toggle Dark Mode';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '99999',
            padding: '10px 15px',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: '0.6'
        });

        btn.onmouseenter = () => btn.style.opacity = '1';
        btn.onmouseleave = () => btn.style.opacity = '0.6';

        let darkEnabled = true;

        btn.onclick = () => {
            darkEnabled = !darkEnabled;
            if (darkEnabled) {
                tryInject();
            } else {
                const s = document.getElementById(styleId);
                if (s) s.remove();
            }
        };

        document.body.appendChild(btn);
    }

    // Observer untuk elemen yang dimuat setelah awal
    const observer = new MutationObserver(() => {
        if (!document.getElementById(styleId)) {
            tryInject();
        }
    });

    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();

**/