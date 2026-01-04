// ==UserScript==
// @name       Scwørdle - Scoredle for Wørdle.
// @namespace  http://mathemaniac.org/
// @version    1.1.6
// @description  Adds Scoredle.com like functionality to Wørdle.dk - a Danish Wordle clone. Only activates once you complete your game, shows number of valid words at each step, and on hover shows a list of those words.
// @match        https://xn--wrdle-vua.dk/
// @match        https://www.xn--wrdle-vua.dk/
// @copyright  2022-2024, Sebastian Paaske Tørholm
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/449048/Scw%C3%B8rdle%20-%20Scoredle%20for%20W%C3%B8rdle.user.js
// @updateURL https://update.greasyfork.org/scripts/449048/Scw%C3%B8rdle%20-%20Scoredle%20for%20W%C3%B8rdle.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// v1.1.6 changes:
// - Attempt to gracefully fall back to clipboard if we cannot share text on mobile.
// v1.1.5 changes:
// - Fix slight breakage introduced on platforms without sharing.s
// v1.1.4 changes:
// - Remove errant debug statement.
// v1.1.3 changes:
// - Handle sharing on mobile.
// v1.1.2 changes:
// - Improve mobile support.
// v1.1.1 changes:
// - Hide score on fully completed row.
// v1.1.0 changes:
// - Add scores to share text.

(function () {
    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
    <style>
        .scwørdle {
            visibility: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 1em;
            position: relative;
        }
        .game-has-ended .reveal-out + .scwørdle { visibility: inherit; }
        .game-has-ended .reveal-out.match + .reveal-out.match + .reveal-out.match + .reveal-out.match + .reveal-out.match + .scwørdle { visibility: hidden; }
        .scwørdle .score {
            background-color: #4c96a3;
            color: white;
            padding: .5em;
            border-radius: 10px;
            font-size: 10pt;
            font-weight: bold;
            min-width: 30pt;
            text-align: center;
        }
        .scwørdle .tooltip {
            display: none;
        }
        .scwørdle:hover .tooltip, .schwørdle .score:hover + .tooltip {
            display: inherit;
            position: absolute;
            top: -20px;
            left: -20em;
            background-color: #4c96a3;
            color: white;
            padding: 1em;
            width: 20em;
            max-height: 20em;
            border: 2px solid #2a555c;
            border-radius: 10px;
            overflow-y: scroll;
            z-index: 10;
        }
    </style>
    `);

    for (let row of document.querySelectorAll('.rows .row')) {
        row.insertAdjacentHTML('beforeend', `
            <div class="scwørdle">
               <span class="score"></span>
               <span class="tooltip"></span>
            </div>
        `);
    }

    function decodeWord(O) {
        function p(e) {
            let n = "abcdefghijklmnopqrstuvwxyzæøå";
            return e.split("").map((e, t) => {
                return n[(n.length + (n.indexOf(e) - 2)) % n.length]
            }).join("");
        }
        return p(codeMap.replacements.reduce((e, t, n) => {
            return e.replace(t, codeMap.values[n])
        }, O));
    }

    let decodedWords;
    let state;
    let solution;
    let gameOver = false;
    let scores;

    function initializeWords() {
        try {
            decodedWords = words.map(decodeWord).sort();
            reloadState();
        } catch (e) {
            setTimeout(initializeWords, 200);
        }
    }

    initializeWords();


    function reloadState() {
        state = JSON.parse( localStorage.getItem("state") );
        if (! state || ! decodedWords) return;
        solution = decodeWord(state.d);
        gameOver = state.r !== 0;

        document.querySelector('body').classList.toggle('game-has-ended', gameOver);

        fixScores();
    }

    function computeHint(guessA, word) {
        let wordA = word.split('');
        let hint = [-1, -1, -1, -1, -1];
        let counts = {};

        for (let i = 0; i < 5; i++) {
            counts[wordA[i]] = (counts[wordA[i]] ? counts[wordA[i]] : 0) + 1;

            if (wordA[i] === guessA[i]) {
                hint[i] = 2;
                counts[wordA[i]] -= 1;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (hint[i] != -1) continue;

            if (counts[guessA[i]] > 0) {
                counts[guessA[i]] -= 1;
                hint[i] = 1;
            } else {
                hint[i] = 0;
            }
        }
        return hint;
    }

    function applyHint(words, guess) {
        let gHint = guess[1].join('-');
        return words.filter( (word) => {
            let wHint = computeHint(guess[0], word).join('-');
            return gHint == wHint;
        } );
    }

    function fixScores() {
        let i = 0;
        let validWords = Array.from(decodedWords);
        scores = [];

        for (let scorebox of document.querySelectorAll('.scwørdle .score')) {
            if (state.o.length <= i) continue;

            validWords = applyHint(validWords, state.o[i++]);
            scorebox.innerHTML = scores[i-1] = validWords.length;
            scorebox.nextElementSibling.innerHTML = validWords.join(', ');
        }
    }

    // Get events when localStorage changes. https://stackoverflow.com/a/69380917/79061
    Storage.prototype.setItem = new Proxy(Storage.prototype.setItem, {
        apply(target, thisArg, argumentList) {
            const event = new CustomEvent('storageChanged', {
                detail: {
                    key: argumentList[0],
                    oldValue: thisArg.getItem(argumentList[0]),
                    newValue: argumentList[1],
                },
            });
            let res = Reflect.apply(target, thisArg, argumentList);
            window.dispatchEvent(event);
            return res;
        },
    });

    function rewriteShareString(orig) {
        let shareLines = orig.split(/\n/);

        // If we solve it - omit number from last line, as it's always 1.
        // If we don't solve it, show scores on all lines
        // The last -1 is for a blank line at the end.
        let iterEnd = shareLines.length - (shareLines[0].match(/[1-6]\/6/) ? 2 : 1)

        for (var i = 2; i < iterEnd; i++) {
            shareLines[i] += ` ${scores[i-2]}`;
        }

        return shareLines.join("\n");
    }

    Clipboard.prototype.writeText = new Proxy(Clipboard.prototype.writeText, {
        apply(target, thisArg, argumentList) {
            let shareString = rewriteShareString(argumentList[0]);
            let res = Reflect.apply(target, thisArg, [shareString]);
            return res;
        },
    });

    if (navigator.canShare) {
        Navigator.prototype.share = new Proxy(Navigator.prototype.share, {
            apply(target, thisArg, argumentList) {
                let shareString = rewriteShareString(argumentList[0].text);
                let newData = { text: shareString };
                if (navigator.canShare(newData)) {
                    let res = Reflect.apply(target, thisArg, [newData]);
                } else {
                    // If we can't share text, fall-back to copying to clipboard
                    navigator.clipboard.writeText(argumentList[0].text);
                }
                return res;
            },
        });
    }

    window.addEventListener('storageChanged', function(event) {
        reloadState();
    }, false);
    reloadState();
})();
