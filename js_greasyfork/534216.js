// ==UserScript==
// @name         Claude Chat TOC Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a Table of Contents to navigate between responses in Claude chat
// @author       You
// @match        https://*.anthropic.com/*
// @match        *://claude.ai/*
// @icon         https://claude.ai/favicon.ico
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/534216/Claude%20Chat%20TOC%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/534216/Claude%20Chat%20TOC%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config
    const config = {
        updateInterval: 1000, // Check for new messages every 1 second
        tocWidth: '250px',
        tocMaxHeight: '80vh',
        accentColor: '#6952dc',
        togglerSize: '36px',
        animationSpeed: '0.3s',
        darkMode: {
            tocBgColor: '#1e1e1e',
            tocBorderColor: '#333',
            textColor: '#e0e0e0',
            userBgColor: '#2a2a2a',
            claudeBgColor: '#2d2540',
            userBorderColor: '#444',
            claudeBorderColor: '#4e3d80'
        },
        lightMode: {
            tocBgColor: '#f8f9fa',
            tocBorderColor: '#ddd',
            textColor: '#333',
            userBgColor: '#eef0f3',
            claudeBgColor: '#f4f1fe',
            userBorderColor: '#d0d5dd',
            claudeBorderColor: '#d1c7f9'
        }
    };

    // Check if dark mode is enabled
    function isDarkMode() {
        // Check if the page has a dark background
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ||
            document.body.classList.contains('dark-mode') ||
            getComputedStyle(document.body).backgroundColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)?.slice(1).map(Number).reduce((a, b) => a + b) < 382;
    }

    // Get theme based on current color scheme
    function getTheme() {
        return isDarkMode() ? config.darkMode : config.lightMode;
    }

    // Wait for the chat content to load
    function waitForChat() {
        const interval = setInterval(() => {
            // Different DOM selectors for claude.ai vs anthropic.com
            if (document.querySelector('.flex-1.flex.flex-col.gap-3') ||
                document.querySelector('.conversation-container') ||
                document.querySelector('.message-container')) {
                clearInterval(interval);
                initTOC();

                // Listen for theme changes
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

                // Additional listener for custom theme toggles
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class' ||
                            mutation.attributeName === 'data-theme' ||
                            mutation.type === 'attributes') {
                            updateTheme();
                        }
                    });
                });

                observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['class', 'data-theme']
                });
            }
        }, 500);
    }

    // Update theme for TOC elements
    function updateTheme() {
        const tocContainer = document.getElementById('claude-toc-container');
        if (!tocContainer) return;

        const theme = getTheme();

        // Update container
        tocContainer.style.background = theme.tocBgColor;
        tocContainer.style.borderColor = theme.tocBorderColor;
        tocContainer.style.color = theme.textColor;

        // Update header
        const header = tocContainer.querySelector('h3');
        if (header) {
            header.style.borderBottom = `1px solid ${theme.tocBorderColor}`;
        }

        // Force TOC update to refresh entry styles
        updateTOC(true);
    }

    // Initialize the TOC
    function initTOC() {
        const theme = getTheme();

        // Create TOC container
        const tocContainer = document.createElement('div');
        tocContainer.id = 'claude-toc-container';
        tocContainer.style.cssText = `
            position: fixed;
            top: 70px;
            right: -${config.tocWidth};
            width: ${config.tocWidth};
            max-height: ${config.tocMaxHeight};
            background: ${theme.tocBgColor};
            border-left: 1px solid ${theme.tocBorderColor};
            border-bottom: 1px solid ${theme.tocBorderColor};
            border-radius: 0 0 0 8px;
            overflow-y: auto;
            z-index: 1000;
            transition: right ${config.animationSpeed} ease;
            box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.1);
            padding: 10px;
            color: ${theme.textColor};
        `;

        // Create TOC toggler with Claude logo
        const tocToggler = document.createElement('div');
        tocToggler.id = 'claude-toc-toggler';
        tocToggler.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 139 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.07 30.79c-5.02 0-8.46-2.8-10.08-7.11a19.2 19.2 0 0 1-1.22-7.04C6.77 9.41 10 4.4 17.16 4.4c4.82 0 7.78 2.1 9.48 7.1h2.06l-.28-6.9c-2.88-1.86-6.48-2.81-10.87-2.81-6.16 0-11.41 2.77-14.34 7.74A16.77 16.77 0 0 0 1 18.2c0 5.53 2.6 10.42 7.5 13.15a17.51 17.51 0 0 0 8.74 2.06c4.78 0 8.57-.91 11.93-2.5l.87-7.62h-2.1c-1.26 3.48-2.76 5.57-5.25 6.68-1.22.55-2.76.83-4.62.83Z"/>
            </svg>
        `;
        tocToggler.style.cssText = `
            position: fixed;
            top: 70px;
            right: 0;
            width: ${config.togglerSize};
            height: ${config.togglerSize};
            background: ${config.accentColor};
            border-radius: 8px 0 0 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1001;
            color: white;
            box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.2);
        `;

        // Create TOC header
        const tocHeader = document.createElement('div');
        tocHeader.innerHTML = `<h3 style="margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid ${theme.tocBorderColor};">Table of Contents</h3>`;

        // Create TOC content
        const tocContent = document.createElement('div');
        tocContent.id = 'claude-toc-content';
        tocContent.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        // Assemble TOC
        tocContainer.appendChild(tocHeader);
        tocContainer.appendChild(tocContent);

        // Add to document
        document.body.appendChild(tocToggler);
        document.body.appendChild(tocContainer);

        // Toggle TOC visibility
        let tocVisible = false;
        tocToggler.addEventListener('click', () => {
            tocVisible = !tocVisible;
            tocContainer.style.right = tocVisible ? '0' : `-${config.tocWidth}`;

            // Use Claude logo consistently, just rotate it when panel is open
            tocToggler.style.transform = tocVisible ? 'rotate(180deg)' : 'rotate(0deg)';

            // Update theme when toggling (in case it changed)
            if (tocVisible) {
                const theme = getTheme();
                tocContainer.style.background = theme.tocBgColor;
                tocContainer.style.borderColor = theme.tocBorderColor;
                tocContainer.style.color = theme.textColor;

                // Also update header border color
                tocContainer.querySelector('h3').style.borderBottom = `1px solid ${theme.tocBorderColor}`;

                // Refresh TOC entries to apply current theme
                updateTOC();
            }
        });

        // Start monitoring for messages
        updateTOC();
        setInterval(updateTOC, config.updateInterval);
    }

    // Update the TOC content
    function updateTOC(forceRefresh = false) {
        const tocContent = document.getElementById('claude-toc-content');
        if (!tocContent) return;

        // Get all messages
        let messages = [];

        // User messages (questions) - support both claude.ai and anthropic.com
        const userSelectors = [
            '.group.relative.inline-flex.gap-2.bg-bg-300.rounded-xl', // anthropic.com
            '.user-message', // alternative
            '[data-message-author="user"]', // claude.ai
            '.message.user' // another alternative
        ];

        let userMessages = [];
        for (const selector of userSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                userMessages = Array.from(elements);
                break;
            }
        }

        userMessages.forEach((msg, index) => {
            let textElement = msg.querySelector('[data-testid="user-message"]') ||
                              msg.querySelector('.message-content') ||
                              msg;

            const textContent = textElement?.textContent?.trim();
            if (textContent) {
                messages.push({
                    type: 'user',
                    content: truncateText(textContent, 50),
                    element: msg,
                    index: index
                });
            }
        });

        // Claude responses - support both claude.ai and anthropic.com
        const claudeSelectors = [
            '.group.relative.-tracking-\\[0\\.015em\\]', // anthropic.com
            '.claude-message', // alternative
            '[data-message-author="assistant"]', // claude.ai
            '.message.assistant' // another alternative
        ];

        let claudeMessages = [];
        for (const selector of claudeSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                claudeMessages = Array.from(elements);
                break;
            }
        }

        claudeMessages.forEach((msg, index) => {
            // Get the first paragraph of Claude's response
            let textElement = msg.querySelector('.whitespace-pre-wrap.break-words') ||
                              msg.querySelector('.message-content') ||
                              msg.querySelector('p');

            const textContent = textElement?.textContent?.trim();
            if (textContent) {
                messages.push({
                    type: 'claude',
                    content: truncateText(textContent, 50),
                    element: msg,
                    index: index
                });
            }
        });

        // Sort messages by their position in the DOM
        messages.sort((a, b) => {
            const posA = getElementPosition(a.element);
            const posB = getElementPosition(b.element);
            return posA - posB;
        });

        // Create TOC entries
        const currentEntries = tocContent.querySelectorAll('.toc-entry');
        if (currentEntries.length !== messages.length || forceRefresh) {
            // Clear and rebuild TOC if message count changed
            tocContent.innerHTML = '';

            const theme = getTheme();

            messages.forEach((msg, index) => {
                const entry = document.createElement('div');
                entry.className = 'toc-entry';
                entry.dataset.index = index;
                entry.dataset.type = msg.type;

                // Styled based on message type
                const bgColor = msg.type === 'user' ? theme.userBgColor : theme.claudeBgColor;
                const borderColor = msg.type === 'user' ? theme.userBorderColor : theme.claudeBorderColor;

                entry.style.cssText = `
                    padding: 8px 10px;
                    border-radius: 6px;
                    background-color: ${bgColor};
                    border-left: 3px solid ${borderColor};
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: normal;
                    color: ${theme.textColor};
                    transition: all 0.2s ease;
                    margin-bottom: 6px;
                `;

                // Add sequential number and icon prefix based on message type
                const msgNumber = index + 1;
                const prefix = msg.type === 'user' ?
                    `<span style="font-weight: bold; margin-right: 5px;">${msgNumber}.</span> 👤 ` :
                    `<span style="font-weight: bold; margin-right: 5px;">${msgNumber}.</span> <svg width="14" height="14" viewBox="0 0 139 34" fill="currentColor" style="display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M18.07 30.79c-5.02 0-8.46-2.8-10.08-7.11a19.2 19.2 0 0 1-1.22-7.04C6.77 9.41 10 4.4 17.16 4.4c4.82 0 7.78 2.1 9.48 7.1h2.06l-.28-6.9c-2.88-1.86-6.48-2.81-10.87-2.81-6.16 0-11.41 2.77-14.34 7.74A16.77 16.77 0 0 0 1 18.2c0 5.53 2.6 10.42 7.5 13.15a17.51 17.51 0 0 0 8.74 2.06c4.78 0 8.57-.91 11.93-2.5l.87-7.62h-2.1c-1.26 3.48-2.76 5.57-5.25 6.68-1.22.55-2.76.83-4.62.83Z"/></svg> `;

                entry.innerHTML = `${prefix}${msg.content}`;

                // Add click event to scroll to message
                entry.addEventListener('click', () => {
                    msg.element.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Highlight the message briefly
                    highlightElement(msg.element);
                });

                // Hover effect
                entry.addEventListener('mouseenter', () => {
                    entry.style.transform = 'translateX(3px)';
                    entry.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                    entry.style.fontWeight = 'bold';
                });

                entry.addEventListener('mouseleave', () => {
                    entry.style.transform = 'translateX(0)';
                    entry.style.boxShadow = 'none';
                    entry.style.fontWeight = 'normal';
                });

                tocContent.appendChild(entry);
            });
        }
    }

    // Helper function to get element's vertical position
    function getElementPosition(element) {
        return element.getBoundingClientRect().top + window.scrollY;
    }

    // Helper function to truncate text
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    // Helper function to highlight an element briefly
    function highlightElement(element) {
        const originalBackground = element.style.background;
        const originalTransition = element.style.transition;

        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = isDarkMode()
            ? 'rgba(105, 82, 220, 0.3)'
            : 'rgba(105, 82, 220, 0.15)';

        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            element.style.backgroundColor = originalBackground;
            setTimeout(() => {
                element.style.transition = originalTransition;
            }, 500);
        }, 1000);
    }

    // Start the script
    waitForChat();
})();