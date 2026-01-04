// ==UserScript==
// @name         CogniRead
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  增强型阅读脚本，能够加粗部分单词，并高亮显示词汇表中的特定词汇，同时通过美观的悬浮框展示定义。可通过Alt+B（Windows/Linux）或Control+B（Mac）进行切换。
// @match        *://*/*
// @grant        none
// @license      MIT
// @author       codeboy 
// @icon         https://cdn.icon-icons.com/icons2/609/PNG/512/book-glasses_icon-icons.com_56355.png
// @downloadURL https://update.greasyfork.org/scripts/515140/CogniRead.user.js
// @updateURL https://update.greasyfork.org/scripts/515140/CogniRead.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let cogniEnabled = false;
    let wordData = {};

    // Word list URLs
    const wordListSources = {
        'TOEFL': 'https://raw.githubusercontent.com/CodeBoy2006/english-wordlists/master/TOEFL_abridged.txt',
        'GRE': 'https://raw.githubusercontent.com/CodeBoy2006/english-wordlists/master/GRE_abridged.txt',
        'OALD8': 'https://raw.githubusercontent.com/CodeBoy2006/english-wordlists/master/OALD8_abridged_edited.txt',
        'TEM-8': 'https://raw.githubusercontent.com/CodeBoy2006/english-wordlists/refs/heads/master/%E8%8B%B1%E8%AF%AD%E4%B8%93%E4%B8%9A%E6%98%9F%E6%A0%87%E5%85%AB%E7%BA%A7%E8%AF%8D%E6%B1%87.txt'
    };

    // Load word lists
    async function fetchWordLists() {
        for (let [listName, url] of Object.entries(wordListSources)) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();
                wordData[listName] = processWordList(text);
                console.log(`Loaded ${listName} wordlist with ${Object.keys(wordData[listName]).length} words.`);
            } catch (error) {
                console.error(`Failed to load ${listName} wordlist:`, error);
            }
        }
    }

    // Process word list text
    function processWordList(text) {
        const lines = text.split('\n');
        const dictionary = {};
        lines.forEach(line => {
            const [word, ...rest] = line.split(/\s+/);
            if (word) {
                dictionary[word.toLowerCase()] = rest.join(' ');
            }
        });
        return dictionary;
    }

    // Common suffixes
    const suffixes = ['s', 'es', 'ed', 'ing', 'er', 'est', 'ly'];

    // Match word in lists
    function matchWordInLists(word) {
        word = word.toLowerCase();

        // Direct match
        for (let list in wordData) {
            if (wordData[list].hasOwnProperty(word)) {
                return { word, list, definition: wordData[list][word] };
            }
        }

        // Match after removing common suffixes
        for (let suffix of suffixes) {
            if (word.endsWith(suffix)) {
                let stem = word.slice(0, -suffix.length);
                for (let list in wordData) {
                    if (wordData[list].hasOwnProperty(stem)) {
                        return { word: stem, list, definition: wordData[list][stem] };
                    }
                }
            }
        }

        // Special cases
        if (word.endsWith('ies')) {
            let stem = word.slice(0, -3) + 'y';
            for (let list in wordData) {
                if (wordData[list].hasOwnProperty(stem)) {
                    return { word: stem, list, definition: wordData[list][stem] };
                }
            }
        }
        if (word.endsWith('ves')) {
            let stem = word.slice(0, -3) + 'f';
            for (let list in wordData) {
                if (wordData[list].hasOwnProperty(stem)) {
                    return { word: stem, list, definition: wordData[list][stem] };
                }
            }
        }

        return null;
    }

    function isWordInData(word) {
        return matchWordInLists(word) !== null;
    }

    // Style word
    function styleWord(word) {
        const match = word.match(/^([\w'-]+)([^\w'-]*)$/);
        if (!match) return word;

        const [, cleanWord, punctuation] = match;
        const wordLower = cleanWord.toLowerCase();
        const isHighlighted = isWordInData(cleanWord);

        let boldLength = Math.ceil(cleanWord.length / 2);
        let formattedWord = `<b>${cleanWord.slice(0, boldLength)}</b>${cleanWord.slice(boldLength)}`;

        if (isHighlighted) {
            formattedWord = `<span class="cogni-highlight" data-word="${wordLower}">${formattedWord}</span>`;
        } else {
            formattedWord = `<span class="cogni-word">${formattedWord}</span>`;
        }

        return formattedWord + punctuation;
    }

    // Handle text node
    function handleTextNode(textNode) {
        const words = textNode.textContent.split(/(\s+)/);
        const formattedText = words.map(word => word.trim() ? styleWord(word) : word).join('');
        const span = document.createElement('span');
        span.innerHTML = formattedText;
        textNode.replaceWith(span);
    }

    // Traverse and style text
    function traverseAndStyleText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim().length > 0) {
                handleTextNode(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (!['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName)) {
                Array.from(node.childNodes).forEach(traverseAndStyleText);
            }
        }
    }

    // Initialize tooltip
    function initTooltip() {
        let tooltip = document.createElement('div');
        tooltip.id = 'cogniread-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
            display: none;
            z-index: 9999;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.6;
            color: #333333;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
            opacity: 0;
            transform: translateY(10px);
        `;
        document.body.appendChild(tooltip);

        return tooltip;
    }

    // Display tooltip
    function displayTooltip(word, event) {
        const tooltip = document.getElementById('cogniread-tooltip');
        if (!tooltip) return;

        const matchedWord = matchWordInLists(word);
        if (matchedWord) {
            const { word: matchedWordText, list: sourceList, definition } = matchedWord;

            tooltip.innerHTML = `
                <strong>${word}</strong> ${word !== matchedWordText ? `(${matchedWordText})` : ''}<br>
                ${definition}<br>
                <small>Source: ${sourceList}</small>
            `;
            tooltip.style.display = 'block';

            requestAnimationFrame(() => {
                adjustTooltipPosition(tooltip, event);
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            });
        }
    }

    function removeTooltip() {
        const tooltip = document.getElementById('cogniread-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (tooltip.style.opacity === '0') {
                    tooltip.style.display = 'none';
                }
            }, 200);
        }
    }

    function adjustTooltipPosition(tooltip, event) {
        const tooltipRect = tooltip.getBoundingClientRect();
        let left = event.clientX + 10;
        let top = event.clientY + 10;

        if ((left + tooltipRect.width) > window.innerWidth) {
            left = event.clientX - tooltipRect.width - 10;
        }
        if ((top + tooltipRect.height) > window.innerHeight) {
            top = event.clientY - tooltipRect.height - 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    const updateTooltipPositionDebounced = debounce((tooltip, event) => {
        adjustTooltipPosition(tooltip, event);
    }, 10);

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Inject CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .cogni-word b { color: #000080; }
            .cogni-highlight { background-color: yellow; cursor: pointer; }
            #cogniread-tooltip { font-family: Arial, sans-serif; }
        `;
        document.head.appendChild(style);
    }

    // Enable CogniRead
    async function enableCogniRead() {
        console.log("Applying CogniRead...");
        await fetchWordLists();
        addStyles();
        traverseAndStyleText(document.body);
        initTooltip();
        console.log("CogniRead is now active.");
    }

    // Toggle CogniRead
    function toggleCogniRead() {
        cogniEnabled = !cogniEnabled;
        if (cogniEnabled) {
            enableCogniRead();
        } else {
            location.reload();
        }
    }

    // Set keyboard shortcut
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    document.addEventListener('keydown', function(e) {
        if ((isMacOS && e.ctrlKey && e.key.toLowerCase() === 'b') || (!isMacOS && e.altKey && e.key.toLowerCase() === 'b')) {
            e.preventDefault();
            toggleCogniRead();
        }
    });

    // Event delegation for tooltip display
    document.body.addEventListener('mouseover', function(e) {
        const target = e.target.closest('.cogni-highlight');
        if (target) {
            const word = target.getAttribute('data-word');
            displayTooltip(word, e);
        }
    });

    document.body.addEventListener('mousemove', function(e) {
        const tooltip = document.getElementById('cogniread-tooltip');
        if (tooltip && tooltip.style.display !== 'none') {
            updateTooltipPositionDebounced(tooltip, e);
        }
    });

    document.body.addEventListener('mouseout', function(e) {
        if (!e.relatedTarget || !e.relatedTarget.closest('.cogni-highlight')) {
            removeTooltip();
        }
    });

    window.addEventListener('scroll', debounce(function() {
        const tooltip = document.getElementById('cogniread-tooltip');
        if (tooltip && tooltip.style.display !== 'none') {
            removeTooltip();
        }
    }, 100));

    console.log("CogniRead script loaded. Use Ctrl+B (Mac) or Alt+B (Windows/Linux) to toggle.");
})();