// ==UserScript==
// @name         Text Frequency Analyzer with ASIN Page Support
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Extract text from specific spans based on page URL, remove stop words, and do word frequency analysis.
// @author       Your Name
// @match        https://www.amazon.com/gp/bestsellers*
// @match        https://www.amazon.com/*/dp/*
// @match        https://www.amazon.com/dp/*
// @match        https://www.amazon.com/s?k=*
// @match        https://www.amazon.com/s?*

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504603/Text%20Frequency%20Analyzer%20with%20ASIN%20Page%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/504603/Text%20Frequency%20Analyzer%20with%20ASIN%20Page%20Support.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const stopWords = new Set([
        'with', 'of', 'for', 'and', 'at', 'if', 'to', 'on', 'by', 'from', 'as', 'than', 'too',
        // ...省略其他停用词
        'now'
    ]);

    function extractText() {
        let spans;
        const url = window.location.href;

        if (url.includes('/gp/bestsellers')) {
            spans = document.querySelectorAll('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');
        } else if (url.includes('/s?k=')) {
            spans = document.querySelectorAll('.a-size-base-plus.a-color-base.a-text-normal, .a-size-medium.a-color-base.a-text-normal');
        } else if (url.includes('/dp/')) {
            const titleElement = document.getElementById('productTitle');
            const miniElements = document.querySelectorAll('.a-unordered-list.a-vertical.a-spacing-mini .a-spacing-mini');
            let textContent = titleElement ? titleElement.innerText : '';
            miniElements.forEach(el => {
                textContent += ' ' + el.innerText;
            });
            return textContent.trim();
        } else {
            alert('This script is not configured for this page.');
            return '';
        }

        let textContent = '';
        spans.forEach(span => {
            textContent += span.innerText + ' ';
        });
        return textContent.trim();
    }

    function cleanText(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s\/"'.-]/g, '')  // 保留特定符号
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getWords(text, removeStopWords = true) {
        const words = cleanText(text).split(/\s+/).filter(Boolean);
        if (removeStopWords) {
            return words.filter(word => !stopWords.has(word));
        }
        return words;
    }

    function countFrequencies(words, n) {
        const freqMap = new Map();
        for (let i = 0; i <= words.length - n; i++) {
            const phrase = words.slice(i, i + n).join(' ');
            freqMap.set(phrase, (freqMap.get(phrase) || 0) + 1);
        }
        return Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    }

    function removePreviousHighlights() {
        const highlightedElements = document.querySelectorAll('.highlight');
        highlightedElements.forEach(el => {
            el.outerHTML = el.innerText; // Replace the span with its text content
        });
    }

    function highlightText(phrase) {
        removePreviousHighlights(); // Remove previous highlights

        const url = window.location.href;
        const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

        if (url.includes('/dp/')) {
            const titleElement = document.getElementById('productTitle');
            if (titleElement) {
                titleElement.innerHTML = titleElement.innerHTML.replace(regex, '<span class="highlight">$1</span>');
            }
            const miniElements = document.querySelectorAll('.a-unordered-list.a-vertical.a-spacing-mini .a-spacing-mini');
            miniElements.forEach(el => {
                el.innerHTML = el.innerHTML.replace(regex, '<span class="highlight">$1</span>');
            });
        } else {
            const classesToSearch = [
                '_cDEzb_p13n-sc-css-line-clamp-3_g3dy1',
                'a-size-base-plus.a-color-base.a-text-normal',
                'a-size-medium.a-color-base.a-text-normal'
            ];

            classesToSearch.forEach(className => {
                document.querySelectorAll(`.${className}`).forEach(span => {
                    span.innerHTML = span.innerHTML.replace(regex, '<span class="highlight">$1</span>');
                });
            });
        }
    }

    function displayResults(results) {
        const resultDiv = document.createElement('div');
        resultDiv.style.position = 'fixed';
        resultDiv.style.top = '10px';
        resultDiv.style.right = '10px';
        resultDiv.style.backgroundColor = 'white';
        resultDiv.style.border = '1px solid black';
        resultDiv.style.padding = '10px';
        resultDiv.style.zIndex = '10000';
        resultDiv.style.maxHeight = '90vh';
        resultDiv.style.overflowY = 'auto';
        resultDiv.innerHTML = '<h2>Word Frequency Analysis</h2>';

        results.forEach(([label, data]) => {
            const title = document.createElement('h3');
            title.textContent = label;
            resultDiv.appendChild(title);
            const list = document.createElement('ul');
            data.forEach(([phrase, count]) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${phrase}: ${count}`;
                listItem.addEventListener('click', () => highlightText(phrase));  // 绑定点击事件
                list.appendChild(listItem);
            });
            resultDiv.appendChild(list);
        });

        document.body.appendChild(resultDiv);
    }

    function analyzeText() {
        const text = extractText();
        if (!text) {
            alert('No text found in the specified spans.');
            return;
        }

        const wordsForSingle = getWords(text);
        const wordsForPhrases = getWords(text, false);

        const results = [
            ['Top 10 Single Words', countFrequencies(wordsForSingle, 1)],
            ['Top 10 Two-Word Phrases', countFrequencies(wordsForPhrases, 2)],
            ['Top 10 Three-Word Phrases', countFrequencies(wordsForPhrases, 3)],
            ['Top 10 Four-Word Phrases', countFrequencies(wordsForPhrases, 4)]
        ];

        displayResults(results);
    }

    const highlightStyle = document.createElement('style');
    highlightStyle.innerHTML = `
        .highlight {
            background-color: yellow;
            font-weight: bold;
        }
    `;
    document.head.appendChild(highlightStyle);

    const analyzeButton = document.createElement('button');
    analyzeButton.textContent = 'Analyze Text Frequency';
    analyzeButton.style.position = 'fixed';
    analyzeButton.style.bottom = '10px';
    analyzeButton.style.right = '10px';
    analyzeButton.style.zIndex = '10000';
    analyzeButton.style.padding = '10px 20px';
    analyzeButton.style.backgroundColor = '#007bff';
    analyzeButton.style.color = 'white';
    analyzeButton.style.border = 'none';
    analyzeButton.style.borderRadius = '5px';
    analyzeButton.style.cursor = 'pointer';

    analyzeButton.addEventListener('click', analyzeText);

    document.body.appendChild(analyzeButton);
})();
