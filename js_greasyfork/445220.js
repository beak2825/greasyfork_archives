// ==UserScript==
// @name Cooldudetyper1
// @version      1.0.2
// @description  Highlights the largest words for perfect nitros.
// @author       Ray Adams
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Ray-Adams/NitroType-Archive
// @namespace https://greasyfork.org/users/916047
// @downloadURL https://update.greasyfork.org/scripts/445220/Cooldudetyper1.user.js
// @updateURL https://update.greasyfork.org/scripts/445220/Cooldudetyper1.meta.js
// ==/UserScript==
 
console.log("'NitroType Perfect Nitros' is no longer maintained, see https://github.com/Ray-Adams/NitroType-Archive for more info.");
 
const options = {
    highlightColor: '#ffff00',
    intervalMs: 100
};
 
(() => {
 
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