// ==UserScript==
// @name         YouTube Video AI Summary (Perplexity)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button next to the video title on YouTube to copy URL and open Perplexity AI summary.
// @author       pullso
// @supportURL   https://github.com/pullso/youtube-ai-summary-perplexity/issues
// @license      MIT
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/536644/YouTube%20Video%20AI%20Summary%20%28Perplexity%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536644/YouTube%20Video%20AI%20Summary%20%28Perplexity%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('YouTube Perplexity Summary script loaded');

    // Inject CSS for styling
    const styles = `
        #summaryButton {
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            vertical-align: middle;
            z-index: 1000;
            border-radius: 18px;
            margin-left: auto;
        }
        #summaryButton:hover {
            background-color: #e0e0e0;
        }
        #copyNotification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            display: none;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    let buttonInjected = false;

    function injectSummaryButton() {
        if (buttonInjected) return;

        const titleElement = document.querySelector('#title h1')?.parentElement;
        if (!titleElement) {
            console.warn('Title container not found yet.');
            return;
        }

        // Check if the button already exists
        if (document.getElementById('summaryButton')) {
            buttonInjected = true;
            return;
        }

        // Create the button
        const summaryButton = document.createElement('button');
        summaryButton.id = 'summaryButton';
        summaryButton.textContent = 'Summarize Video';

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'copyNotification';
        notification.textContent = 'URL copied to clipboard!';
        document.body.appendChild(notification);

        // Add click handler
        summaryButton.addEventListener('click', () => {
            const videoUrl = window.location.href;
            GM_setClipboard(videoUrl);
            console.log('URL copied:', videoUrl);

            notification.style.display = 'block';
            setTimeout(() => notification.style.display = 'none', 2000);

            const perplexityUrl = `https://www.perplexity.ai/?q=${encodeURIComponent(videoUrl)}`;
            window.open(perplexityUrl, '_blank');
        });

        // Insert the button next to the title
        titleElement.appendChild(summaryButton);
        console.log('Button added next to the title.');

        buttonInjected = true;
    }

    // Observer for title changes — reset flag
    const titleObserver = new MutationObserver(() => {
        buttonInjected = false;
        injectSummaryButton();
    });

    // Observe changes in the title container
    const titleContainer = document.querySelector('#title');
    if (titleContainer) {
        titleObserver.observe(titleContainer, { childList: true, subtree: true });
    }

    // Observer for the main body in case #title doesn't exist yet
    const bodyObserver = new MutationObserver(() => {
        injectSummaryButton();
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Initial attempt
    injectSummaryButton();

})();
