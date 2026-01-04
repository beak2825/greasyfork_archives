// ==UserScript==
// @name         Merge Broken Words
// @namespace    http://tampermonkey.net/
// @version      9
// @description  Merges broken words that might end up due to OCR. Like "t hat" instead of "that." A naive implementation.
// @match        *://ranobes.top/*
// @match        *://ranobes.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ranobes.top
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520336/Merge%20Broken%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/520336/Merge%20Broken%20Words.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A naive greedy approach.
    let validWords;

    // Some wordlists:
    // Doesn't have many words: https://www.mit.edu/~ecprice/wordlist.10000
    // Contains common misspellings, etc. aswell: https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_alpha.txt

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://websites.umich.edu/~jlawler/wordlist",
        onload: function(response) {
            const words = response.responseText.split('\n');
            const allowed = new Set(["i", "a"]);
            const exceptions = new Set(['th', 'ha', 'iwo']);

            // What a mess...
            // This is where deep learning would be nice ig...

            validWords = new Set(words
                                 .map(word => word.trim().toLowerCase())
                                 .filter(word => !exceptions.has(word) && (word.length > 1 || allowed.has(word)))
                                );

            processParagraphs();
        }
    });

    function processParagraphs() {
        const section = document.querySelector(".story #arrticle");
        let paragraphs = Array.from(section.querySelectorAll("p"));

        section.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                paragraphs.push(child);
            }
        })

        function cleanWord(word) {
            word = word.toLowerCase();
            if (/^\w+['’]/.test(word)) { // Otherwise single-qouted words or those at the edge of sentences will cause issues.
                word = word.replace(/(['’].*)|(n['’]t*)/, "") // Remove contractions like "'s", "'re"
            }
            return word.replace(/[^\w]/g, ""); // Remove remaining non-alphanumeric characters
        }

        let mergedWordsLog = [];

        paragraphs.forEach(p => {
            let text = p.textContent;
            let words = text.split(/\s+/);
            let mergedWords = [];

            for (let i = 0; i < words.length; i++) {
                if (i < words.length - 1) {
                    const wordCurrent = cleanWord(words[i].replace(/.*-/, '')); // Dealing with hyphenated words.
                    const wordNext = cleanWord(words[i + 1].replace(/-.*/, ''));
                    const bothValid = validWords.has(wordCurrent) && validWords.has(wordNext);

                    const merged = wordCurrent + wordNext;
                    if (
                        !bothValid &&
                        (validWords.has(merged) ||
                         // Naive approach to remove plural, maybe could use some stemming algo.
                         (merged.length > 2 && validWords.has(merged.replace(/s$/, '')))
                        )
                    ) {
                        mergedWordsLog.push([words[i], words[i + 1]]);
                        mergedWords.push(words[i] + words[i + 1]);
                        i++; // Skip the next word since it's merged
                        continue;
                    }
                }
                mergedWords.push(words[i]);
            }

            p.textContent = mergedWords.join(" ");
        });

        console.table(mergedWordsLog);
    }
})();