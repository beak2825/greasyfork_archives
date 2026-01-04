// ==UserScript==
// @name         Persistent Translator Tooltip with Sidebar and Local Storage
// @namespace    http://tampermonkey.net/
// @author       Zabkas
// @version      1.1
// @description  Translate words on click, show in a tooltip, add to a sidebar list, and store in local storage
// @include      *://*/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481529/Persistent%20Translator%20Tooltip%20with%20Sidebar%20and%20Local%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/481529/Persistent%20Translator%20Tooltip%20with%20Sidebar%20and%20Local%20Storage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the tooltip, sidebar, clear button, and entry layout
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
        .translator-tooltip {
            font-weight: 700;
            color: #000000;
            position: absolute;
            z-index: 10000;
            padding: 2px;
            max-width: 300px;
            border-radius: 0.3em;
            background-color: #ffffdb;
            border: 1px solid #ccc;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            text-align: center;
            font-size: 18px;
            line-height: 1.2;
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s linear 300ms, opacity 300ms;
        }

        .translator-tooltip.visible {
            visibility: visible;
            opacity: 1;
        }

        .translator-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            width: 250px;
            height: 100%;
            background-color: #ffffdb;
            overflow-y: auto;
            border-left: 1px solid #ccc;
            padding: 10px;
            z-index: 10000;
            font-size: 16px;
        }

        .translator-entry {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }

        .translator-entry span:first-child {
            flex: 1;
            text-align: left;
        }

        .translator-entry span:last-child {
            flex: 1;
            text-align: right;
        }

        .translator-entry hr {
            width: 100%;
            margin-top: 5px;
        }

        .clear-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10001;
            cursor: pointer;
            padding: 5px 10px;
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-size: 16px;
        }
    `;
    document.head.appendChild(styleElement);

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'translator-tooltip';
    document.body.appendChild(tooltip);

    // Create sidebar element
    const sidebar = document.createElement('div');
    sidebar.className = 'translator-sidebar';
    document.body.appendChild(sidebar);

    // Create clear button element
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '🗑️ Clear Translations';
    clearButton.className = 'clear-button';
    document.body.appendChild(clearButton);

    // Function to show the tooltip
    function showTooltip(text, x, y) {
        tooltip.textContent = text;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 30}px`;
        tooltip.classList.add('visible');
    }

    // Function to hide the tooltip
    function hideTooltip() {
        tooltip.classList.remove('visible');
    }

    // Function to add word to sidebar list and store in local storage
    function addToSidebar(originalWord, translatedWord) {
        const entry = document.createElement('div');
        entry.className = 'translator-entry';
        entry.innerHTML = `
            <span>${originalWord}</span>
            <span>${translatedWord}</span>
        `;

        sidebar.appendChild(entry);

        // Add a horizontal line after each entry
        const separator = document.createElement('hr');
        sidebar.appendChild(separator);

        // Store in local storage
        const translations = JSON.parse(localStorage.getItem('translations') || '{}');
        translations[originalWord] = translatedWord;
        localStorage.setItem('translations', JSON.stringify(translations));
    }

    // Function to translate word
    function translateWord(word, x, y) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&dj=1&dt=t&dt=rm&q=" + encodeURIComponent(word),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const translatedText = data.sentences[0].trans;
                showTooltip(translatedText, x, y);
                addToSidebar(word, translatedText);
            }
        });
    }

    // Load translations from local storage and add to sidebar
    function loadTranslations() {
        const translations = JSON.parse(localStorage.getItem('translations') || '{}');
        Object.keys(translations).forEach(word => {
            const translatedWord = translations[word];
            if (typeof translatedWord === 'string') {
                const entry = document.createElement('div');
                entry.className = 'translator-entry';
                entry.innerHTML = `
                    <span>${word}</span>
                    <span>${translatedWord}</span>
                `;
                sidebar.appendChild(entry);

                // Add a horizontal line after each entry
                const separator = document.createElement('hr');
                sidebar.appendChild(separator);
            }
        });
    }

    // Function to clear translations from sidebar and local storage
    function clearTranslations() {
        sidebar.innerHTML = '';
        localStorage.removeItem('translations');
    }

    // Event listener for clear button
    clearButton.addEventListener('click', function() {
        clearTranslations();
    });

// Event listener for mouseup to detect text selection
document.addEventListener('mouseup', function(event) {
    const selection = window.getSelection().toString().trim();
    if (selection) { // Remove the condition that checks for a single word
        const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        translateWord(selection, rect.left + window.scrollX, rect.top + window.scrollY);
    }
});

    // Event listener to hide tooltip when clicking anywhere on the page
    document.addEventListener('mousedown', function(event) {
        if (!tooltip.contains(event.target)) {
            hideTooltip();
        }
    }, true);

    // Load stored translations on page load
    loadTranslations();
})();
