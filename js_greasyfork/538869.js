// ==UserScript==
// @name         Chub.ai Universal Enhancer (Links, Styles, Pagination, Tooltips)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Makes card titles/tags proper links, styles them, adds pagination, fixes description cutoff, and adds floating title tooltips.
// @author       Marcal91
// @match        https://chub.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538869/Chubai%20Universal%20Enhancer%20%28Links%2C%20Styles%2C%20Pagination%2C%20Tooltips%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538869/Chubai%20Universal%20Enhancer%20%28Links%2C%20Styles%2C%20Pagination%2C%20Tooltips%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Core Functions to Enhance Page Elements ---

    function createTitleLink(cardElement) {
        const titleContainer = cardElement.querySelector('.ant-card-head-title .ant-row > span');
        if (!titleContainer || titleContainer.querySelector('a.chub-card-title-link')) {
            return; // Already processed or no container
        }

        const titleTextSpan = titleContainer.querySelector('span');
        const cardLink = cardElement.closest('a');
        if (!titleTextSpan || !cardLink) return;

        const fullTitleText = titleTextSpan.textContent.trim();
        const cardURL = cardLink.href;

        const linkElement = document.createElement('a');
        linkElement.href = cardURL;
        linkElement.textContent = fullTitleText;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.classList.add('chub-card-title-link');

        // Store the full title in a data attribute for our tooltip to read
        linkElement.dataset.fullTitle = fullTitleText;

        titleTextSpan.parentNode.replaceChild(linkElement, titleTextSpan);
    }

    function convertAllTagsOnPage() {
        const tagWrappers = document.querySelectorAll('span.cursor-pointer:has(> .ant-tag)');
        tagWrappers.forEach(wrapper => {
            if (wrapper.parentElement.tagName.toLowerCase() === 'a') return;

            const tagTextSpan = wrapper.querySelector('.ant-tag > span:first-child');
            if (!tagTextSpan || !tagTextSpan.textContent) return;

            const tagName = tagTextSpan.textContent.trim();
            const tagURL = `https://chub.ai/characters?tags=${encodeURIComponent(tagName)}`;
            const linkElement = document.createElement('a');
            linkElement.href = tagURL;
            linkElement.rel = 'noopener noreferrer';

            wrapper.parentNode.insertBefore(linkElement, wrapper);
            linkElement.appendChild(wrapper);
        });
    }

    function addPagination() {
        const buttonContainer = document.querySelector('.flex.justify-between.mt-4');
        if (!buttonContainer || buttonContainer.querySelector('.pagination-container')) {
            return;
        }

        const currentURL = new URL(window.location.href);
        let currentPage = parseInt(currentURL.searchParams.get('page') || '1', 10);

        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination-container');

        function createPageButton(pageNumber, text) {
            const pageButton = document.createElement('button');
            pageButton.type = 'button';
            pageButton.textContent = text || pageNumber.toString();
            pageButton.classList.add('ant-btn', 'css-s6hibu', 'ant-btn-default', 'pagination-link');

            if (!text && pageNumber === currentPage) {
                pageButton.classList.add('current-page');
            }

            pageButton.addEventListener('click', (event) => {
                event.preventDefault();
                const url = new URL(window.location.href);
                url.searchParams.set('page', pageNumber.toString());
                window.location.href = url.toString();
            });
            return pageButton;
        }

        paginationContainer.appendChild(createPageButton(1, 'First'));

        let startPage = Math.max(1, currentPage - 2);
        let endPage = startPage + 4;
        const assumedTotalPages = 1000;

        if (endPage > assumedTotalPages) {
            endPage = assumedTotalPages;
            startPage = Math.max(1, endPage - 4);
        }
        startPage = Math.max(1, startPage);

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createPageButton(i));
        }

        const goToContainer = document.createElement('div');
        goToContainer.classList.add('go-to-container');
        const pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.placeholder = 'Go to...';
        pageInput.min = '1';
        pageInput.classList.add('pagination-input');
        const goButton = document.createElement('button');
        goButton.type = 'button';
        goButton.textContent = 'Go';
        goButton.classList.add('ant-btn', 'css-s6hibu', 'ant-btn-default', 'pagination-link');

        const navigateToPage = () => {
            const pageNum = pageInput.value;
            if (pageNum && pageNum >= 1) {
                const url = new URL(window.location.href);
                url.searchParams.set('page', pageNum);
                window.location.href = url.toString();
            }
        };

        goButton.addEventListener('click', navigateToPage);
        pageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                navigateToPage();
            }
        });

        goToContainer.appendChild(pageInput);
        goToContainer.appendChild(goButton);
        paginationContainer.appendChild(goToContainer);

        const nextButton = buttonContainer.querySelector('button:last-child');
        buttonContainer.insertBefore(paginationContainer, nextButton);
    }

    // --- Custom Tooltip Logic ---
    function setupGlobalTooltip() {
        // Create the tooltip element
        const tooltip = document.createElement('div');
        tooltip.id = 'chub-custom-tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        // Event delegation: Listen for mouse events on the document
        document.addEventListener('mouseover', (e) => {
            // Check if the hovered element (or its parent) is our title link
            const target = e.target.closest('.chub-card-title-link');
            if (target && target.dataset.fullTitle) {
                tooltip.textContent = target.dataset.fullTitle;
                tooltip.style.display = 'block';
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('.chub-card-title-link');
            if (target) {
                tooltip.style.display = 'none';
            }
        });

        document.addEventListener('mousemove', (e) => {
            // If tooltip is visible, update position
            if (tooltip.style.display === 'block') {
                // Position slightly below and to the right of cursor
                const offset = 15;
                let top = e.clientY + offset;
                let left = e.clientX + offset;

                // Boundary checks to keep it on screen
                if (left + tooltip.offsetWidth > window.innerWidth) {
                    left = window.innerWidth - tooltip.offsetWidth - offset;
                }
                if (top + tooltip.offsetHeight > window.innerHeight) {
                    top = e.clientY - tooltip.offsetHeight - offset;
                }

                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
            }
        });
    }

    // --- Main Execution Logic ---

    function processAllEnhancements() {
        document.querySelectorAll('.ant-card.char-card-class').forEach(createTitleLink);
        convertAllTagsOnPage();
        addPagination();
    }

    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processAllEnhancements, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let lastUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            setTimeout(addPagination, 150);
        }
    }, 500);

    // --- Initial Setup ---
    setTimeout(() => {
        processAllEnhancements();
        setupGlobalTooltip(); // Initialize tooltip once
    }, 500);

    // --- CSS Styles ---
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Visited link styling for card titles */
        .chub-card-title-link { color: white; }
        .chub-card-title-link:visited { color: yellow; }

        /* --- Tooltip Styling --- */
        #chub-custom-tooltip {
            position: fixed;
            background-color: #1f1f1f; /* Dark background */
            color: #e5e0d8;            /* Text color */
            border: 1px solid #5852a5; /* Purple border matching buttons */
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 10000;            /* Ensure it's on top of everything */
            pointer-events: none;      /* Let clicks pass through */
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            max-width: 400px;
            word-wrap: break-word;
        }

        /* --- FIX: Force full description to show on character/lorebook pages --- */
        div.ant-card-meta-description {
            max-height: none !important;
            -webkit-mask-image: none !important;
            mask-image: none !important;
        }
        .show-more-button-container {
            display: none !important;
        }

        /* Pagination container and button styling */
        .pagination-container { display: flex; align-items: center; gap: 0.5rem; }
        .pagination-container .pagination-link {
            background-color: #141414 !important; border: 1px solid #424242 !important;
            color: rgba(242,228,214,0.85) !important; min-width: 32px; height: 32px;
            padding: 0px 15px !important; line-height: 1.5 !important;
            display: inline-flex; align-items: center; justify-content: center;
            border-radius: 6px !important;
        }
        .pagination-container .pagination-link:not(.current-page):hover {
            background-color: #1f1f1f !important; border-color: #5852a5 !important;
            color: #5852a5 !important;
        }
        .pagination-container .pagination-link.current-page {
            background-color: #2e2b74 !important; border-color: #5852a5 !important;
            color: white !important; font-weight: bold;
        }

        /* Go-to-page feature styling */
        .go-to-container { display: flex; gap: 0.25rem; }
        .pagination-input {
            width: 80px; height: 32px; padding: 4px 11px;
            background: #141414; border: 1px solid #424242; border-radius: 6px;
            color: rgba(242,228,214,0.85); font-size: 14px;
        }
        .pagination-input:focus { border-color: #5852a5; outline: none; }
        .pagination-input::-webkit-outer-spin-button, .pagination-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .pagination-input { -moz-appearance: textfield; }

        /* Bigger scrollbar for all tag containers */
        div.custom-scroll:hover::-webkit-scrollbar { height: 8px !important; }
        div.custom-scroll:hover::-webkit-scrollbar-thumb {
            background-color: #888 !important; border-radius: 4px !important;
        }
        div.custom-scroll:hover::-webkit-scrollbar-track {
            background-color: rgba(50, 50, 50, 0.2) !important; border-radius: 4px !important;
        }
    `;
    document.head.appendChild(styleElement);

})();