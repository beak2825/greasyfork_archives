// ==UserScript==
// @author      Anon
// @description Usuwa zabezpieczenia z forum młodzieżowego karachan.org.
// @icon        https://karachan.org/favicon.ico
// @match       *://*.karachan.org/*
// @name        karachan unlocker
// @namespace   karachan.org
// @version     1.5
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/387931/karachan%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/387931/karachan%20unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.setItem('xD', 'xD');

    const style = document.createElement('style');
    style.textContent = `
        #zjadam_srake, #czaj, #kurwy,
        [src="https://karachan.org/b/src/rakusptakus2.jpg"],
        #smok > span, #jesli-zablokujesz-tego-diva-ukraina-odniesie-zwyciestwo {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        #delform, .board {
            background-image: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    function blockURL(url) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node.src === url || node.href === url)) {
                            node.remove();
                        }
                    });
                }
            });
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    const urlsToBlock = [
        'https://freshscat.com',
        'https://youtube.com/embed/j0aAiKSUzJM',
        'https://koronawirus.netlify.com',
        'https://karachan.org/bolbutthurtu.webm',
        'https://karachan.org/wykop/src/1577811355539470976.webm',
        'https://karachan.org/wykop/src/1584127626835644712.mp4',
        'https://karachan.org/jannn.webm',
        'https://karachan.org/Bursztynek.mp3',
        'https://karachan.org/b/src/rakusptakus2.jpg',
        'https://karachan.org/js/htmlshiv.js'
    ];

    urlsToBlock.forEach(blockURL);

    function removeElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            el.remove();
        });
    }

    function blockScript(text) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.tagName === 'SCRIPT' && node.textContent.includes(text)) {
                            node.remove();
                        }
                    });
                }
            });
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    function onContentLoaded() {
        [
            '#zjadam_srake',
            '#czaj',
            '#kurwy',
            '[src="https://karachan.org/b/src/rakusptakus2.jpg"]',
            '#smok > span',
            '#jesli-zablokujesz-tego-diva-ukraina-odniesie-zwyciestwo'
        ].forEach(removeElement);

        ['#delform', '.board'].forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
                el.style.backgroundImage = 'none';
            });
        });
    }

    blockScript('localStorage.xD');
    blockScript('_0x5215');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onContentLoaded);
    } else {
        onContentLoaded();
    }

    setInterval(onContentLoaded, 1000);
})();