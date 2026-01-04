// ==UserScript==
// @name         UNWATERIFY ++
// @namespace    http://tampermonkey.net
// @version      0.2.2
// @author       morilog
// @license MIT
// @description  unwaters your island + anti-balloon
// @match        https://summer.hackclub.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545529/UNWATERIFY%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/545529/UNWATERIFY%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const badClasses = [
        'floating-balloon-container',
        'sinkening-water',
        'sinkening-water-2'
    ];

    function yeetMatchingStuff() {
        // yeet water-rock styles
        document.querySelectorAll('style').forEach(styleEl => {
            if (styleEl.textContent.includes('@keyframes water-rock')) {
                console.log('🗑 yeeting style block with water-rock');
                styleEl.remove();
            }
        });

        // yeet sinkening-wave-music
        const waveMusic = document.getElementById('sinkening-wave-music');
        if (waveMusic) {
            console.log('🗑 yeeting sinkening-wave-music');
            waveMusic.remove();
        }

        // yeet bad classes
        badClasses.forEach(cls => {
            document.querySelectorAll(`.${cls}`).forEach(el => {
                console.log(`💥 yeeting .${cls}`);
                el.remove();
            });
        });
    }

    yeetMatchingStuff();

    const observer = new MutationObserver(muts => {
        for (const mut of muts) {
            for (const node of mut.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                // dynamic water-rock styles
                if (node.tagName === 'STYLE' && node.textContent.includes('@keyframes water-rock')) {
                    console.log('🗑 caught dynamic water-rock, yeeting');
                    node.remove();
                }

                // dynamic sinkening-wave-music
                if (node.id === 'sinkening-wave-music') {
                    console.log('🗑 caught dynamic sinkening-wave-music, yeeting');
                    node.remove();
                }

                // dynamic bad classes
                if (node.classList) {
                    badClasses.forEach(cls => {
                        if (node.classList.contains(cls)) {
                            console.log(`💥 caught dynamic .${cls}, yeeting`);
                            node.remove();
                        }
                    });
                }

                // just in case they're nested
                if (node.querySelectorAll) {
                    const selector = ['#sinkening-wave-music']
                        .concat(badClasses.map(c => `.${c}`))
                        .join(', ');
                    node.querySelectorAll(selector).forEach(el => {
                        console.log('🗑💥 yeeting nested bad element');
                        el.remove();
                    });
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();