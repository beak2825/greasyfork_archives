// ==UserScript==
// @license RatauCotl
// @name         Нья вирус
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Make text on Roblox look like it's written by a cat-girl and apply a white-pink theme!
// @author       Your Name
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525469/%D0%9D%D1%8C%D1%8F%20%D0%B2%D0%B8%D1%80%D1%83%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/525469/%D0%9D%D1%8C%D1%8F%20%D0%B2%D0%B8%D1%80%D1%83%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to append "nya~" to text nodes
    function appendNya(textNode) {
        if (textNode.nodeType === Node.TEXT_NODE && textNode.nodeValue.trim() !== "") {
            textNode.nodeValue = textNode.nodeValue.trim() + " nya~";
        }
    }

    // Function to recursively traverse the DOM and modify text nodes
    function traverseAndModify(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            appendNya(node);
        } else {
            for (let child of node.childNodes) {
                traverseAndModify(child);
            }
        }
    }

    // Function to apply the white-pink theme
    function applyTheme(isDarkMode) {
        const themeColors = isDarkMode ? {
            background: '#1E1E1E',
            text: '#FF69B4',
            secondaryText: '#FFFFFF',
            accent: '#FF1493',
        } : {
            background: '#FFFFFF',
            text: '#FF69B4',
            secondaryText: '#1E1E1E',
            accent: '#FF1493',
        };

        const style = document.createElement('style');
        style.innerHTML = `
            body {
                background-color: ${themeColors.background} !important;
                color: ${themeColors.text} !important;
                font-family: 'Comic Sans MS', cursive, sans-serif !important;
            }
            a {
                color: ${themeColors.accent} !important;
            }
            .header, .footer, .navbar {
                background-color: ${themeColors.background} !important;
                color: ${themeColors.text} !important;
            }
            .btn-primary {
                background-color: ${themeColors.accent} !important;
                border-color: ${themeColors.accent} !important;
                color: ${themeColors.secondaryText} !important;
            }
            .btn-secondary {
                background-color: ${themeColors.background} !important;
                border-color: ${themeColors.accent} !important;
                color: ${themeColors.text} !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Check if the system is in dark mode
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply the theme based on the system preference
    applyTheme(isDarkMode);

    // Start modifying the text on the page
    traverseAndModify(document.body);

    // Observe the DOM for changes and modify new text nodes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                traverseAndModify(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Listen for changes in the system theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        applyTheme(event.matches);
    });
})();