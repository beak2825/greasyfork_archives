// ==UserScript==
// @name         planning-poker-confetti
// @namespace    http://tampermonkey.net/
// @version      2025.09.17
// @description  Confetti for https://planning-poker-agile.web.app/ when all players vote the same score!
// @author       You
// @match        https://planning-poker-agile.web.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web.app
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493394/planning-poker-confetti.user.js
// @updateURL https://update.greasyfork.org/scripts/493394/planning-poker-confetti.meta.js
// ==/UserScript==
console.log('Tampermonkey script loaded');

(function() {
    'use strict';

    function getRandomUnicodeEmoji() {
        // A selection of common emoji ranges in Unicode
        const emojiRanges = [
            [0x1F600, 0x1F64F], // Emoticons
            [0x1F90D, 0x1F9FF], // Supplemental Symbols and Pictographs
            [0x1F680, 0x1F6FF], // Transport & Map Symbols
            [0x1F300, 0x1F5FF], // Miscellaneous Symbols and Pictographs
            [0x2600, 0x26FF], // Miscellaneous Symbols
            [0x2700, 0x27BF], // Dingbats
        ];

        // Pick a random range
        const randomRange = emojiRanges[Math.floor(Math.random() * emojiRanges.length)];

        // Generate a random code point within the chosen range
        const randomCodePoint = Math.floor(Math.random() * (randomRange[1] - randomRange[0] + 1)) + randomRange[0];

        // Convert the code point to a character and return it
        return String.fromCodePoint(randomCodePoint);
    }

    // Add confetti script
    // https://github.com/catdad/canvas-confetti
    const confettiEl = document.createElement('script');
    confettiEl.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    document.body.appendChild(confettiEl);

    let statusObserverAttached = false;

    setTimeout(() => {
        console.log('setTimeout executed');
        const root = document.querySelector('body');
        const rootObserver = new MutationObserver(() => {

            // Only add status observer if the DOM change from root includes the container
            if (!statusObserverAttached && document.querySelector('#root > div > div > div.flex > div.flex > div.w-full > div.flex')) {
                const status = document.querySelector('#root > div > div > div.flex > div.flex > div.w-full > div.flex > span.text-sm');
                const statusObserver = new MutationObserver(() => {

                    //const textInside = document.querySelector('.GameControllerCardHeaderAverageContainer .MuiTypography-root');
                    if (status.innerText.includes('Finished')) {
                        console.log('');

                        // Check that all player cards were same number
                        const playerCards = document.querySelectorAll('div.animate-grow div.flex div.rounded.shadow-lg');
                        let allSame = true;
                        let referencePoint = null;

                        playerCards.forEach((node) => {
                            const playerScore = node.querySelector('div.flex span[class*="text-"]').innerText;

                            if (!isNaN(playerScore)) {
                                // if first found number add it as reference point
                                if (!referencePoint) {
                                    referencePoint = playerScore;
                                } else {
                                    if (playerScore !== referencePoint) {
                                        allSame = false;
                                    }
                                }

                            }
                        });

                        if (allSame) {
                            console.log('Pop da confetti');
                            // do this for 30 seconds
                            var duration = 0.8 * 1000;
                            var end = Date.now() + duration;
                            var scalar = 4;
                            var e1 = window.confetti.shapeFromText({ text: `${getRandomUnicodeEmoji()}`, scalar });
                            var e2 = window.confetti.shapeFromText({ text: `${getRandomUnicodeEmoji()}`, scalar });
                            var e3 = window.confetti.shapeFromText({ text: `${getRandomUnicodeEmoji()}`, scalar });
                            var e4 = window.confetti.shapeFromText({ text: `${getRandomUnicodeEmoji()}`, scalar });
                            (function frame() {
                                // launch a few confetti from the left edge
                                window.confetti({
                                    shapes: [e1, e2],
                                    scalar: 4,
                                    particleCount: 3,
                                    angle: 60,
                                    spread: 120,
                                    origin: { x: 0 }
                                });
                                // and launch a few from the right edge
                                window.confetti({
                                    shapes: [e3, e4],
                                    scalar: 4,
                                    particleCount: 3,
                                    angle: 120,
                                    spread: 120,
                                    origin: { x: 1 }
                                });

                                // keep going until we are out of time
                                if (Date.now() < end) {
                                    requestAnimationFrame(frame);
                                }
                            }());
                        }
                    }
                });

                // Add mutation observer to watch for a round ending
                statusObserver.observe(root, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });

                statusObserverAttached = true;
                rootObserver.disconnect();
            } else {
                console.log('Observer not attached or didnt find the div');
            }
        });

        // Add mutation observer to watch for dom changes
        rootObserver.observe(root, {
            childList: true,
            subtree: true
        });
        document.querySelector('button[type="submit"]').innerHTML += ' 🎉';
    }, 2000);

})();