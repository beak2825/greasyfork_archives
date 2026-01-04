// ==UserScript==
// @name         Split Long Paragraphs
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Splits long paragraphs at the period nearest to the split point.
// @match        *://ranobes.top/*
// @match        *://ranobes.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ranobes.top
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520153/Split%20Long%20Paragraphs.user.js
// @updateURL https://update.greasyfork.org/scripts/520153/Split%20Long%20Paragraphs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ellipsize(s) {
        return s.substring(0, 64).trim().replace(/[^\w\s\d]+$/, "") + "...";
    }

    function log(text) {
        console.log(`Split Long Paragraphs: ${text}`);
    }

    const MAX_WORD_COUNT = 80;
    const section = document.querySelector(".story #arrticle");

    if (!section) {
        return;
    }

    const nodes = Array.from(section.querySelectorAll('p'));

    section.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            nodes.push(child);
        }
    })

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const text = node.textContent.trim();
        const words = text.split(/\s+/);

        // Max word count before splitting
        if (words.length > MAX_WORD_COUNT + Math.floor(MAX_WORD_COUNT / 2)) {
            // Find closest split point to MAX_WORD_COUNT at a period
            const sentences = text.split(/(?<=[^\.]\.)\s+/);
            let sentenceIndex = 0;
            let wordCount = 0;

            for (const sentence of sentences) {
                wordCount += sentence.split(/\s+/).length;
                // log(`${ellipsize(sentence)} totalWordCount:${wordCount}`);

                if (wordCount >= MAX_WORD_COUNT) {
                    break;
                }

                sentenceIndex += 1;
            }

            if (wordCount !== 0) {
                log(`Splitting... \`${ellipsize(text)}\` wordCount:${words.length} sentenceIndex:${sentenceIndex} totalSentences:${sentences.length}`);

                node.textContent = '';

                let p = document.createElement('p');
                p.textContent = sentences.slice(0, sentenceIndex + 1).join(" ").trim();
                node.parentNode.insertBefore(p, node);

                p = document.createElement('p');
                p.textContent = sentences.slice(sentenceIndex + 1).join(" ").trim();
                node.parentNode.insertBefore(p, node);

                nodes.push(p);
                node.remove();
            }
        }
    }
})();
