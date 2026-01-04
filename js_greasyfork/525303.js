// ==UserScript==
// @name         RSS: TLDR/Bloomberg Date Cycler
// @version      1.5
// @description  Filter sponsored articles, remove margin classes, and add date navigation on tldr.tech
// @author       Jerry with Claude
// @match        https://tldr.tech/*
// @match        https://www.bloomberg.com/news/articles/*/stock-market-today-dow-s-p-live-updates
// @grant        none
// @homepage https://greasyfork.org/en/scripts/525303

// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/525303/RSS%3A%20TLDRBloomberg%20Date%20Cycler.user.js
// @updateURL https://update.greasyfork.org/scripts/525303/RSS%3A%20TLDRBloomberg%20Date%20Cycler.meta.js
// ==/UserScript==
// https://tldr.tech/api/latest/ai

(function() {
    'use strict';

    // Function to get the next business day
    function getNextBusinessDay(dateStr) {
        const parts = dateStr.split('-').map(Number);
        let nextDay = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

        do {
            nextDay = new Date(nextDay.getTime() + 86400000);
        } while (nextDay.getUTCDay() === 0 || nextDay.getUTCDay() === 6);

        return nextDay;
    }

    // Function to get the previous business day
    function getPreviousBusinessDay(dateStr) {
        const parts = dateStr.split('-').map(Number);
        let prevDay = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

        do {
            prevDay = new Date(prevDay.getTime() - 86400000);
        } while (prevDay.getUTCDay() === 0 || prevDay.getUTCDay() === 6);

        return prevDay;
    }

    // Function to format date as YYYY-MM-DD
    function formatDate(date) {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    }

    // Function to add navigation buttons
    function addNavigationButtons() {
        const currentPath = window.location.pathname;
        const dateMatch = currentPath.match(/\d{4}-\d{2}-\d{2}/);

        // Already exists, don't add again
        if (document.querySelector('#tldr-nav-container')) {
            return;
        }

        if (dateMatch) {
            // Create container for buttons
            const container = document.createElement('div');
            container.id = 'tldr-nav-container';
            container.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 16px;
                display: flex;
                gap: 8px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.9);
                padding: 4px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;

            // Common button styles
            const buttonStyle = `
                padding: 4px 12px;
                background: #6366f1;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.2s;
            `;

            // Create previous day button
            const prevButton = document.createElement('button');
            prevButton.textContent = '← Next';
            prevButton.style.cssText = buttonStyle;

            // Create next day button
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Prev →';
            nextButton.style.cssText = buttonStyle;

            // Add hover effects
            [prevButton, nextButton].forEach(button => {
                button.addEventListener('mouseover', () => {
                    button.style.background = '#4f46e5';
                });
                button.addEventListener('mouseout', () => {
                    button.style.background = '#6366f1';
                });
            });

            // Add click handlers
            nextButton.onclick = () => {
                const prevDay = getPreviousBusinessDay(dateMatch[0]);
                window.location.href = currentPath.replace(dateMatch[0], formatDate(prevDay));
            };

            prevButton.onclick = () => {
                const nextDay = getNextBusinessDay(dateMatch[0]);
                window.location.href = currentPath.replace(dateMatch[0], formatDate(nextDay));
            };

            // Assemble and insert
            container.appendChild(prevButton);
            container.appendChild(nextButton);

            // Insert at the top of the body
            const targetElement = document.body;
            if (targetElement) {
                targetElement.insertBefore(container, targetElement.firstChild);
            }
        }
    }

    // Function to remove unwanted content
    function removeContent() {
        // Remove sponsored articles
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const heading = article.querySelector('h3');
            if (heading && heading.textContent.includes('(Sponsor)')) {
                article.style.display = 'none';
            }
        });

        // Remove elements with specific margin classes
        const marginElements = document.querySelectorAll('.mb-2');
        marginElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Run immediately and also after a short delay to ensure DOM is ready
    function initialize() {
        removeContent();
        addNavigationButtons();

        // Try again after a short delay
        setTimeout(() => {
            removeContent();
            addNavigationButtons();
        }, 2000);
    }

    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Watch for dynamic content changes
    const observer = new MutationObserver(() => {
        removeContent();
        addNavigationButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();