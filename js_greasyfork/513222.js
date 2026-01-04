// ==UserScript==
// @name         NitroType Perfect Nitros with SFB Highlighting (QWERTY, DVORAK, COLEMAK)
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @version      2.5.1
// @description  Highlights the largest words, single-finger bigrams (SFBs), and custom words/phrases for QWERTY, DVORAK, or COLEMAK layouts. Adds custom color coding for hand-specific characters like 'b' and 'y'.
// @author       Ray Adams/Nate Dogg, Modified by TensorFlow - Dvorak
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513222/NitroType%20Perfect%20Nitros%20with%20SFB%20Highlighting%20%28QWERTY%2C%20DVORAK%2C%20COLEMAK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513222/NitroType%20Perfect%20Nitros%20with%20SFB%20Highlighting%20%28QWERTY%2C%20DVORAK%2C%20COLEMAK%29.meta.js
// ==/UserScript==

(() => {
    // CHANGE THIS to 'QWERTY', 'DVORAK' or 'COLEMAK'
    const keyboardLayout = 'QWERTY';

    const options = {
        highlightColor: '#1b1c25',
        wordHighlightColor: '#5b048a',
        singleFingerBigramColor: '#403dae',
        redForRightHand: 'red',
        blueForLeftHand: 'blue',
        intervalMs: 100
    };

    // Custom wordlist for highlighting (add words or phrases you aim to type differently here)
    const customWords = new Set(['number', "you're"]);

    // SFBs for different keyboard layouts (remove bigrams you don't want to work on)
    const SFBs = new Map([
        ['QWERTY', ['ed', 'de', 'fr', 'rf', 'gt', 'tg', 'bv', 'vb', 'ju', 'uj', 'ki', 'ik', 'nm', 'mn', 'nu', 'un']],
        ['DVORAK', ['pu', 'up', 'ui', 'iu', 'pi', 'ip', 'je', 'ej']],
        ['COLEMAK', ['']]
    ]);

    // Define different layouts.
    const layoutKeys = {
        QWERTY: {
            leftHand: 'qwertasdfgzxcvb',
            rightHand: 'yuiophjklmn',
            targetChars: ['b'] // 'b' is typed by either hand and will be color coded based on which hand should be used. Red = right Blue = Left.
        },
        DVORAK: {
            leftHand: 'aoeuqjkxiyp',
            rightHand: 'dhtsnfgcrlbmwvz',
            targetChars: ['x']
        },
        COLEMAK: {
            leftHand: 'qwfpbjluyarst',
            rightHand: 'neiohjkxvmzcdg',
            targetChars: ['b']
        }
    };

    const client = () => {
        const dashLetters = document.querySelector('.dash-letter');
        if (dashLetters) {
            clearInterval(intervalId);

            // Get all words from the race
            const wordList = [...document.getElementsByClassName('dash-word')].map(word => word.textContent.replace(/\s/g, ''));

            // Find the largest words
            const maxLength = Math.max(...wordList.map(word => word.length));
            const largestWords = wordList.filter(word => word.length === maxLength);

            // Highlight largest words and bigrams
            wordList.forEach((word, index) => {
                const wordElement = document.getElementsByClassName('dash-word')[index];

                // Highlight largest words
                if (largestWords.includes(word)) {
                    wordElement.style.backgroundColor = options.highlightColor;
                }

                // Highlight custom words/phrases
                highlightCustomWords(wordElement);

                // Highlight single-finger bigrams
                highlightSingleFingerBigrams(wordElement);

                // Highlight specific target chars if followed by the same hand's character
                highlightTargetCharsWithSameHand(wordElement, keyboardLayout);
            });
        }
    };

    const highlightCustomWords = (wordElement) => {
        const text = wordElement.textContent.toLowerCase();

        // Loop over each word or phrase in the custom wordlist
        customWords.forEach(word => {
            const startIndex = text.indexOf(word.toLowerCase());
            if (startIndex !== -1) {
                for (let i = 0; i < word.length; i++) {
                    wordElement.querySelector(`.dash-letter:nth-child(${startIndex + i + 1})`).style.color = options.wordHighlightColor;
                }
            }
        });
    };

    const highlightSingleFingerBigrams = (wordElement) => {
        const text = wordElement.textContent;

        // Loop over the text and highlight single-finger bigrams
        for (let i = 0; i < text.length - 1; i++) {
            const bigram = text[i] + text[i + 1];
            if (SFBs.get(keyboardLayout).includes(bigram)) {
                wordElement.querySelector(`.dash-letter:nth-child(${i + 1})`).style.color = options.singleFingerBigramColor;
                wordElement.querySelector(`.dash-letter:nth-child(${i + 2})`).style.color = options.singleFingerBigramColor;
                i++;
            }
        }
    };

    const highlightTargetCharsWithSameHand = (wordElement, layout) => {
        const { leftHand, rightHand, targetChars } = layoutKeys[layout];
        const text = wordElement.textContent.toLowerCase();

        // Check if target characters are followed by the same hand
        for (let i = 0; i < text.length - 1; i++) {
            const currentChar = text[i];
            const nextChar = text[i + 1];

            if (targetChars.includes(currentChar)) {
                if (leftHand.includes(currentChar) && leftHand.includes(nextChar)) {
                    // Highlight target char to suggest typing with the right hand
                    wordElement.querySelector(`.dash-letter:nth-child(${i + 1})`).style.color = options.redForRightHand;
                } else if (rightHand.includes(currentChar) && rightHand.includes(nextChar)) {
                    // Highlight target char to suggest typing with the left hand
                    wordElement.querySelector(`.dash-letter:nth-child(${i + 1})`).style.color = options.blueForLeftHand;
                }
            }
        }
    };

    const intervalId = setInterval(client, options.intervalMs);
})();
