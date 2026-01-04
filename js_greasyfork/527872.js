// ==UserScript==
// @name         Perplexity Prompt Text Ensmallifier
// @namespace    Violentmonkey Scripts
// @match        *://www.perplexity.ai/*
// @grant        none
// @version      2.1
// @license MIT
// @description  Reduces size of prompt text and puts it in a box
// @downloadURL https://update.greasyfork.org/scripts/527872/Perplexity%20Prompt%20Text%20Ensmallifier.user.js
// @updateURL https://update.greasyfork.org/scripts/527872/Perplexity%20Prompt%20Text%20Ensmallifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function detectPerplexityTheme() {
        const bgColor = getComputedStyle(document.body).backgroundColor;
        return bgColor.includes("0.96") || bgColor.includes("0.963") ? 'light' : 'dark';
    }

    function stylePromptHeading() {
        const elements = document.querySelectorAll('h1[class*="group/query"], div[class*="group/query"]');
        const theme = detectPerplexityTheme();

        elements.forEach(el => {
            if (!el.classList.contains('custom-styled')) {
                el.style.padding = '10px';
                el.style.margin = '10px 0';
                el.style.borderRadius = '8px';
                el.style.display = 'block';
                el.style.color = 'inherit';
                el.style.fontSize = '0.875rem'; // 14px
                el.style.fontWeight = '400';
                el.style.lineHeight = '1.1'; // Tighter spacing
                el.style.overflowWrap = 'break-word';

                if (theme === 'dark') {
                    el.style.border = '1.6px solid rgba(255, 255, 255, 0.3)';
                    el.style.background = 'rgba(255, 255, 255, 0.07)';
                } else {
                    el.style.border = '1.6px solid rgba(0, 0, 0, 0.2)'; // Darker gray border
                    el.style.background = 'rgba(0, 0, 0, 0.08)'; // **Stronger gray background**
                }

                el.classList.add('custom-styled');
            }
        });
    }

    // Run once on page load
    stylePromptHeading();

    // Detect Perplexity theme changes (only works on reload)
    const observer = new MutationObserver(() => stylePromptHeading());
    observer.observe(document.body, { childList: true, subtree: true });
})();
