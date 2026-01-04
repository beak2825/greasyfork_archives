// ==UserScript==
// @name         Pump Card Filter Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Manage blacklisted and highlighted phrases for pump cards
// @author       bob123
// @match        https://neo.bullx.io/neo-vision
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518711/Pump%20Card%20Filter%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/518711/Pump%20Card%20Filter%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Initialize from localStorage or create empty Sets
    let blacklistedPhrases = new Set(JSON.parse(localStorage.getItem('blacklistedPhrases') || '[]'));
    let highlightedPhrases = new Set(JSON.parse(localStorage.getItem('highlightedPhrases') || '[]'));
    let caseSensitive = JSON.parse(localStorage.getItem('caseSensitive') || 'false');
    let managersVisible = JSON.parse(localStorage.getItem('managersVisible') || 'true');

    // Save to localStorage function
    function saveToStorage() {
        localStorage.setItem('blacklistedPhrases', JSON.stringify([...blacklistedPhrases]));
        localStorage.setItem('highlightedPhrases', JSON.stringify([...highlightedPhrases]));
        localStorage.setItem('caseSensitive', JSON.stringify(caseSensitive));
        localStorage.setItem('managersVisible', JSON.stringify(managersVisible));
    }

    const styles = `
        .toggle-managers-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: #2d2d2d;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        .toggle-managers-btn:hover {
            background: #404040;
        }
        .filter-manager {
            position: fixed;
            right: 10px;
            background: #2d2d2d;
            padding: 10px;
            border-radius: 8px;
            width: 200px;
            z-index: 9999;
            color: #fff;
            font-family: Arial, sans-serif;
            max-height: 180px; /* Fixed total height */
            display: flex;
            flex-direction: column;
        }
        .blacklist-manager {
            top: 40px;
        }
        .highlight-manager {
            top: 230px;
        }
        .filter-manager h3 {
            margin: 0 0 5px 0;
            color: #fff;
            font-size: 14px;
            flex-shrink: 0;
        }
        .filter-input {
            width: 100%;
            padding: 3px;
            margin-bottom: 5px;
            background: #404040;
            border: 1px solid #555;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            flex-shrink: 0;
        }
        .phrases-list {
            flex-grow: 1;
            overflow-y: auto;
            margin-top: 5px;
            padding-right: 5px;
            /* Scrollbar styling */
            scrollbar-width: thin;
            scrollbar-color: #666 #2d2d2d;
        }
        /* WebKit scrollbar styling */
        .phrases-list::-webkit-scrollbar {
            width: 6px;
        }
        .phrases-list::-webkit-scrollbar-track {
            background: #2d2d2d;
            border-radius: 3px;
        }
        .phrases-list::-webkit-scrollbar-thumb {
            background-color: #666;
            border-radius: 3px;
            border: 2px solid #2d2d2d;
        }
        .phrase-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px;
            background: #404040;
            margin: 2px 0;
            border-radius: 4px;
            word-break: break-all;
            font-size: 12px;
        }
        .phrase-text {
            flex: 1;
            margin-right: 5px;
        }
        .remove-phrase {
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 1px 4px;
            cursor: pointer;
            flex-shrink: 0;
            font-size: 10px;
        }
        .case-sensitive-toggle {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            font-size: 11px;
            flex-shrink: 0;
        }
        .case-sensitive-toggle input {
            margin-right: 3px;
        }
        .highlight-manager .phrase-item {
            border-left: 2px solid #ff4444;
        }
        .filter-manager.hidden {
            display: none;
        }
    `;

    function createToggleButton() {
        const button = document.createElement('button');
        button.className = 'toggle-managers-btn';
        button.textContent = 'Toggle Filters';
        button.addEventListener('click', () => {
            managersVisible = !managersVisible;
            document.querySelectorAll('.filter-manager').forEach(manager => {
                manager.classList.toggle('hidden', !managersVisible);
            });
            saveToStorage();
        });
        document.body.appendChild(button);
    }

    function createFilterManager(type) {
        const manager = document.createElement('div');
        manager.className = `filter-manager ${type}-manager`;
        if (!managersVisible) {
            manager.classList.add('hidden');
        }
        const title = type === 'blacklist' ? 'Blacklist Manager' : 'Highlight Manager';
        const placeholder = type === 'blacklist' ? 'Enter phrase to blacklist' : 'Enter phrase to highlight';

        manager.innerHTML = `
            <h3>${title}</h3>
            <div class="case-sensitive-toggle">
                <input type="checkbox" id="${type}CaseSensitiveToggle" ${caseSensitive ? 'checked' : ''}>
                <label for="${type}CaseSensitiveToggle">Case Sensitive</label>
            </div>
            <input type="text" class="filter-input" placeholder="${placeholder}">
            <div class="phrases-list"></div>
        `;
        document.body.appendChild(manager);

        const input = manager.querySelector('.filter-input');
        const phrasesList = manager.querySelector('.phrases-list');
        const caseToggle = manager.querySelector(`#${type}CaseSensitiveToggle`);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                if (type === 'blacklist') {
                    blacklistedPhrases.add(input.value.trim());
                } else {
                    highlightedPhrases.add(input.value.trim());
                }
                input.value = '';
                updatePhrasesList(type);
                checkAllCards();
                saveToStorage();
            }
        });

        caseToggle.addEventListener('change', (e) => {
            caseSensitive = e.target.checked;
            checkAllCards();
            saveToStorage();
        });

        return manager;
    }

    function updatePhrasesList(type) {
        const phrases = type === 'blacklist' ? blacklistedPhrases : highlightedPhrases;
        const phrasesList = document.querySelector(`.${type}-manager .phrases-list`);
        phrasesList.innerHTML = '';

        phrases.forEach(phrase => {
            const phraseItem = document.createElement('div');
            phraseItem.className = 'phrase-item';
            phraseItem.innerHTML = `
                <span class="phrase-text">"${phrase}"</span>
                <button class="remove-phrase">×</button>
            `;
            phraseItem.querySelector('.remove-phrase').addEventListener('click', () => {
                phrases.delete(phrase);
                updatePhrasesList(type);
                checkAllCards();
                saveToStorage();
            });
            phrasesList.appendChild(phraseItem);
        });
    }

    function checkText(text, phrase) {
        if (caseSensitive) {
            return text.includes(phrase);
        }
        return text.toLowerCase().includes(phrase.toLowerCase());
    }

    function shouldHide(element) {
        const span = element.querySelector('span.font-normal.text-grey-200.overflow-ellipsis.line-clamp-1.text-xs.\\!leading-\\[12px\\]');
        if (!span) return false;

        const text = span.textContent;
        return Array.from(blacklistedPhrases).some(phrase => checkText(text, phrase));
    }

    function shouldHighlight(element) {
        const span = element.querySelector('span.font-normal.text-grey-200.overflow-ellipsis.line-clamp-1.text-xs.\\!leading-\\[12px\\]');
        if (!span) return false;

        const text = span.textContent;
        return Array.from(highlightedPhrases).some(phrase => checkText(text, phrase));
    }

    function processElement(element) {
        if (!element.classList.contains('pump-card') ||
            !element.classList.contains('group') ||
            !element.classList.contains('row-hover') ||
            (!element.classList.contains('bg-grey-900') && !element.classList.contains('bg-grey-850'))) {
            return;
        }

        if (shouldHide(element)) {
            element.style.display = 'none';
        } else {
            element.style.display = '';
            if (shouldHighlight(element)) {
                element.style.border = '2px solid red';
                element.style.borderRadius = '4px';
            } else {
                element.style.border = '';
                element.style.borderRadius = '';
            }
        }
    }

    function checkAllCards() {
        const cards = document.querySelectorAll('.pump-card.group.row-hover');
        cards.forEach(processElement);
    }

    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('pump-card')) {
                            processElement(node);
                        }
                        const cards = node.querySelectorAll('.pump-card.group.row-hover');
                        cards.forEach(processElement);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    function init() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        createToggleButton();
        createFilterManager('blacklist');
        createFilterManager('highlight');

        // Initialize lists with stored data
        updatePhrasesList('blacklist');
        updatePhrasesList('highlight');

        const observer = startObserver();
        checkAllCards(); // Check existing cards on load

        window.addEventListener('unload', () => {
            observer.disconnect();
        });
    }


    init();
})();