// ==UserScript==
// @name         Perplexity AI Enhanced Floating Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a beautiful floating copy button for code blocks on perplexity.ai, positioned further to the right
// @match        https://www.perplexity.ai/*
// @icon         https://play-lh.googleusercontent.com/6STp0lYx2ctvQ-JZpXA1LeAAZIlq6qN9gpy7swLPlRhmp-hfvZePcBxqwVkqN2BH1g
// @author       Chirooon (https://github.com/Chirooon)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512333/Perplexity%20AI%20Enhanced%20Floating%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/512333/Perplexity%20AI%20Enhanced%20Floating%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const floatingButton = document.createElement('button');
    floatingButton.setAttribute('aria-label', 'Copy Code');
    floatingButton.setAttribute('type', 'button');
    floatingButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    `;
    floatingButton.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 21px;
        z-index: 9998;
        display: none;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: #4a4a4a;
        color: #ffffff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(floatingButton);

    let currentCodeBlock = null;

    function updateButtonVisibility() {
        const codeBlocks = document.querySelectorAll('pre');
        let visible = false;

        for (const codeBlock of codeBlocks) {
            const rect = codeBlock.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                visible = true;
                currentCodeBlock = codeBlock;
                break;
            }
        }

        floatingButton.style.display = visible ? 'flex' : 'none';
    }

    floatingButton.addEventListener('click', () => {
        if (currentCodeBlock) {
            const codeText = currentCodeBlock.textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                floatingButton.style.backgroundColor = '#2ecc71';
                floatingButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                setTimeout(() => {
                    floatingButton.style.backgroundColor = '#4a4a4a';
                    floatingButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            });
        }
    });

    floatingButton.addEventListener('mouseover', () => {
        floatingButton.style.transform = 'scale(1.1)';
        floatingButton.style.backgroundColor = '#5a5a5a';
    });

    floatingButton.addEventListener('mouseout', () => {
        floatingButton.style.transform = 'scale(1)';
        floatingButton.style.backgroundColor = '#4a4a4a';
    });

    window.addEventListener('scroll', updateButtonVisibility);
    window.addEventListener('resize', updateButtonVisibility);

    updateButtonVisibility();
})();