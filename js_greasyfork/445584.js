// ==UserScript==
// @name         NitroType Perfect Nitros
// @namespace    https://github.com/Ray-Adams
// @version      1.0.0
// @description  Highlights the largest words for perfect nitros.
// @author       Ray Adams/Nate Dogg
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445584/NitroType%20Perfect%20Nitros.user.js
// @updateURL https://update.greasyfork.org/scripts/445584/NitroType%20Perfect%20Nitros.meta.js
// ==/UserScript==

(() => {

    const options = {
        highlightColor: 'white',
        intervalMs: 100
    };

    const client = () => {

        if (document.body.contains(document.querySelector('.dash-letter'))) {

            clearInterval(intervalId);

            // Generate word list from DOM
            let wordList = []
            for (let words of document.getElementsByClassName('dash-word')) {
                wordList.push(
                    words.textContent.replace(/\s/g, '')
                )
            }

            // Find the largest words
            let largestWords = [];
            for (let word of wordList) {
                if (typeof largestWords[0] === 'undefined' || largestWords[0].length === word.length) {
                    largestWords.push(word);
                }

                if (word.length > largestWords[0].length) {
                    largestWords = [word];
                }
            }

            // Return all occurrences of a specific value
            Array.prototype.indexesOf=function(t){for(var r=[],n=this.length-1;0<=n;n--)this[n]===t&&r.unshift(n);return r};

            // Find the indexes of the largest words in wordList
            let largestWordIndexes = []
            for (let values of wordList.values()) {
                if (largestWords.includes(values)) largestWordIndexes.push(
                    wordList.indexesOf(values)
                )
            }

            // Flatten array and remove duplicate values
            largestWordIndexes = [...new Set(largestWordIndexes.flat())];

            // Highlight largest words
            for (let indexes of largestWordIndexes) {
                document.getElementsByClassName('dash-word')[indexes].style.backgroundColor = options.highlightColor
            }

        }

    }

    const intervalId = setInterval(client, options.intervalMs);

    console.info('Perfect Nitros Activated.')

})()
