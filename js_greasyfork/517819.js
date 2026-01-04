// ==UserScript==
// @name         Bloomberg Footnote Popup
// @version      1.1
// @description  Shows Bloomberg article footnotes in a popup similar to Wikipedia
// @author       https://greasyfork.org/en/users/1390485-fdsaasdf
// @match        https://www.bloomberg.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1390485
// @downloadURL https://update.greasyfork.org/scripts/517819/Bloomberg%20Footnote%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/517819/Bloomberg%20Footnote%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles for the popup
    const styles = `
        .citation-popup {
            position: absolute;
            max-width: 300px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            padding: 12px;
            font-size: 14px;
            line-height: 1.4;
            z-index: 1000;
            display: none;
        }
        .citation-popup a {
            color: #2962ff;
            text-decoration: underline;
        }
        .citation-popup a:hover {
            text-decoration: none;
        }
    `;

    // Add styles to the document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'citation-popup';
    document.body.appendChild(popup);

    // Function to position popup near the citation link
    function positionPopup(link) {
        const rect = link.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Position popup below and slightly to the right of the citation
        popup.style.left = (rect.left + scrollX) + 'px';
        popup.style.top = (rect.bottom + scrollY + 5) + 'px';

        // Adjust position if popup would go off-screen
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
            popup.style.left = (window.innerWidth - popupRect.width - 10) + 'px';
        }
    }

    // Function to get citation text from the footnotes section
    function getCitationText(citationId) {
        // Remove 'inline-' prefix to get the footer reference ID
        const footerRefId = citationId.replace('inline-', 'footer-');
        const footnote = document.getElementById(footerRefId);
        if (footnote) {
            // Clone the footnote to preserve its structure
            const footnoteClone = footnote.cloneNode(true);

            // Remove any "View in article" links
            const viewInArticleLinks = footnoteClone.querySelectorAll('a[href^="#inline-ref"]');
            viewInArticleLinks.forEach(link => link.remove());

            // Remove the counter div by matching the class pattern
            const counter = footnoteClone.querySelector('[class*="FootnoteItem_counter-"]');
            if (counter) {
                counter.remove();
            }

            // Get the div that contains all the paragraphs
            const contentDiv = footnoteClone.querySelector('div');
            if (contentDiv) {
                // Replace image placeholders with a more readable format
                const imgPlaceholders = contentDiv.querySelectorAll('p[data-component="paragraph"]');
                imgPlaceholders.forEach(p => {
                    if (p.textContent.includes('[imgviz')) {
                        p.textContent = '[Image]';
                    }
                });

                return contentDiv.innerHTML.trim();
            }

            return footnoteClone.innerHTML.trim();
        }
        return 'Citation not found';
    }

    // Function to show popup
    function showPopup(citationId, link) {
        const citationHtml = getCitationText(citationId);
        popup.innerHTML = citationHtml;
        popup.style.display = 'block';
        positionPopup(link);
    }

    // Function to hide popup with delay for smoother UX
    let hideTimeout;
    function hidePopup() {
        hideTimeout = setTimeout(() => {
            popup.style.display = 'none';
        }, 100); // Small delay to allow for mouse movement between link and popup
    }

    // Function to cancel hide if mouse moves to popup
    function cancelHide() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
    }

    // Find all citation links
    function initializeCitationLinks() {
        // Updated selector to match Bloomberg's HTML structure
        const citationLinks = document.querySelectorAll('a[data-component="footnote-link"]');

        citationLinks.forEach(link => {
            // Show popup on hover
            link.addEventListener('mouseenter', (e) => {
                cancelHide();
                showPopup(link.id, link);
            });

            // Start hide timer when mouse leaves
            link.addEventListener('mouseleave', hidePopup);

            // Prevent default link behavior
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    }

    // Add event listeners to the popup itself
    popup.addEventListener('mouseenter', cancelHide);
    popup.addEventListener('mouseleave', hidePopup);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCitationLinks);
    } else {
        initializeCitationLinks();
    }

    // Handle dynamic content loading (if Bloomberg uses AJAX)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                initializeCitationLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();