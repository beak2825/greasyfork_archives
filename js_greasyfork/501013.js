// ==UserScript==
// @name         Copy ChatGPT KaTeX Formula to Markdown
// @namespace    http://github.com/PluginsKers
// @version      1.4.1
// @description  Add a copy interaction to KaTeX formulas to copy them as Markdown LaTeX format, with enhanced user interaction and dynamic color scheme support
// @author       PluginsKers
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501013/Copy%20ChatGPT%20KaTeX%20Formula%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/501013/Copy%20ChatGPT%20KaTeX%20Formula%20to%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function debug(message) {
        console.log(`[KaTeX Copy] ${message}`);
    }

    const lightSchemeStyles = `
        .katex-wrapper:hover:not(.katex-copy-highlight) {
            background-color: #e0e0e0;
        }
        .katex-copy-highlight {
            background-color: #ffff99 !important;
            transition: background-color 0.2s ease;
        }
    `;

    const darkSchemeStyles = `
        .katex-wrapper:hover:not(.katex-copy-highlight) {
            background-color: #444;
        }
        .katex-copy-highlight {
            background-color: #888 !important;
            transition: background-color 0.2s ease;
        }
    `;

    const style = document.createElement('style');
    document.head.appendChild(style);

    function updateStyles(colorScheme) {
        if (colorScheme === 'dark') {
            style.textContent = darkSchemeStyles;
        } else {
            style.textContent = lightSchemeStyles;
        }
    }

    // Initial style update based on current color scheme
    const initialColorScheme = document.documentElement.style.getPropertyValue('color-scheme') || 'light';
    updateStyles(initialColorScheme);

    // Observer to monitor changes in color-scheme attribute
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                const newColorScheme = document.documentElement.style.getPropertyValue('color-scheme') || 'light';
                updateStyles(newColorScheme);
            }
        });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Function to add copy interaction to a single KaTeX element
    function addCopyInteraction(katexElement) {
        if (katexElement.classList.contains('copy-interaction-added')) return;

        const wrapper = document.createElement('span');
        wrapper.classList.add('katex-wrapper');

        katexElement.parentNode.insertBefore(wrapper, katexElement);
        wrapper.appendChild(katexElement);

        wrapper.addEventListener('click', async () => {
            const annotation = katexElement.querySelector('.katex-mathml annotation');
            if (!annotation) {
                alert('Error: Could not find LaTeX source');
                return;
            }
            const latexSource = annotation.textContent;
            const markdownLatex = `$${latexSource}$`;
            await navigator.clipboard.writeText(markdownLatex);

            // Highlight the background briefly
            wrapper.classList.add('katex-copy-highlight');
            setTimeout(() => {
                wrapper.classList.remove('katex-copy-highlight');
            }, 100); // Shorten the highlight duration
        });

        katexElement.classList.add('copy-interaction-added');
    }

    // Function to add copy interactions to all KaTeX elements
    function addCopyInteractions() {
        document.querySelectorAll('div.markdown .katex').forEach(addCopyInteraction);
    }

    // Function to wait for page stability
    function waitForPageStability(callback, duration = 1000) {
        let timer;
        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                observer.disconnect();
                callback();
            }, duration);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        timer = setTimeout(() => {
            observer.disconnect();
            callback();
        }, duration);
    }

    // Function to monitor for new elements
    function monitorNewElements() {
        const observer = new MutationObserver(() => {
            if (!document.querySelector('.result-streaming')) {
                addCopyInteractions();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial execution after page stability
    waitForPageStability(() => {
        addCopyInteractions();
        monitorNewElements();
    });
})();