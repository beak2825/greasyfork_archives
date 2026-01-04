// ==UserScript==
// @name         Holotower Hash Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Viberystocrat
// @license      MIT
// @description  Adds # links next to post numbers for original scroll-to-post functionality
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @icon         https://boards.holotower.org/favicon.gif
// @downloadURL https://update.greasyfork.org/scripts/545247/Holotower%20Hash%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/545247/Holotower%20Hash%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HASH_LINK_CLASS = 'hash-link';
    const HASH_PROCESSED_ATTR = 'data-hash-processed';
    const POTENTIAL_QUOTE_LINK_SELECTOR = "a[href*='#'], a[onclick*='highlightReply']";
    const QUOTE_LINK_REGEX = /^>>(\d+)/;

    // Add CSS for the hash links
    GM_addStyle(`
        .${HASH_LINK_CLASS} {
            text-decoration: none !important;
            margin-left: 2px;
            font-weight: normal !important;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        .${HASH_LINK_CLASS}:hover {
            opacity: 1;
            text-decoration: underline !important;
        }
        .intro .${HASH_LINK_CLASS} {
            margin-left: 0px;
        }
    `);

    function getPostIdFromLink(link) {
        if (!link) return null;

        // First try to get from the link text (>>1929580)
        const textMatch = link.textContent?.trim().match(QUOTE_LINK_REGEX);
        if (textMatch) return textMatch[1];

        // Then try to get from href attribute (#1929580)
        const href = link.getAttribute('href');
        if (href) {
            const hrefMatch = href.match(/#(\d+)$/);
            if (hrefMatch) return hrefMatch[1];
        }

        return null;
    }

    function scrollToPost(postId) {
        // First try to find the post on the current page
        const postElement = document.querySelector(`div.post[id$='_${postId}'], #reply_${postId}, #op_${postId}`);

        if (postElement) {
            // Update URL hash
            if (window.location.hash !== `#${postId}`) {
                window.history.replaceState(null, null, `#${postId}`);
            }

            // Scroll to post with smooth behavior
            postElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Add temporary highlight similar to your inline script
            const tempHighlightClass = 'temp-scroll-highlight';
            if (!document.querySelector(`style[data-temp-highlight]`)) {
                GM_addStyle(`
                    .${tempHighlightClass} {
                        transition: outline 0.3s ease-in-out;
                        outline: 2px solid var(--highlight-color, #ff6b6b) !important;
                        outline-offset: 2px;
                    }
                `);
            }

            postElement.classList.add(tempHighlightClass);
            setTimeout(() => {
                postElement.classList.remove(tempHighlightClass);
            }, 1000);
        } else {
            // If post not found on current page, navigate to it via URL
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.split('#')[0]; // Remove existing hash
            window.location.href = `${baseUrl}#${postId}`;
        }
    }

    function addHashLinks(parentElement) {
        if (!parentElement) return;

        const links = parentElement.querySelectorAll(POTENTIAL_QUOTE_LINK_SELECTOR);

        links.forEach(link => {
            // Skip if already processed
            if (link.hasAttribute(HASH_PROCESSED_ATTR)) return;

            const postId = getPostIdFromLink(link);
            if (!postId) return;

            // Check if this is actually a quote link (starts with >>)
            const isQuoteLink = QUOTE_LINK_REGEX.test(link.textContent?.trim() || '');
            if (!isQuoteLink) return;

            // Create the hash link directly after the original link
            const hashLink = document.createElement('a');
            hashLink.href = `#${postId}`;
            hashLink.textContent = '#';
            hashLink.className = HASH_LINK_CLASS;
            hashLink.title = `Scroll to post ${postId}`;

            // Add click handler for the hash link
            hashLink.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                scrollToPost(postId);
            });

            // Insert hash link immediately after the original link
            if (link.nextSibling) {
                link.parentNode.insertBefore(hashLink, link.nextSibling);
            } else {
                link.parentNode.appendChild(hashLink);
            }

            // Mark as processed
            link.setAttribute(HASH_PROCESSED_ATTR, 'true');
        });
    }

    function runInitialProcessing() {
        if (!document.body) return;
        addHashLinks(document.body);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialProcessing);
    } else {
        runInitialProcessing();
    }

    // Observer for dynamically added content
    const observer = new MutationObserver(mutations => {
        if (!document.body) return;

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the node itself is a quote link or contains quote links
                        if (node.matches && node.matches(POTENTIAL_QUOTE_LINK_SELECTOR)) {
                            addHashLinks(node.parentElement);
                        } else if (node.querySelector) {
                            const hasQuoteLinks = node.querySelector(POTENTIAL_QUOTE_LINK_SELECTOR);
                            if (hasQuoteLinks) {
                                addHashLinks(node);
                            }
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Handle browser back/forward navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        if (hash) {
            const postId = hash.substring(1); // Remove the # character
            if (/^\d+$/.test(postId)) { // Check if it's a valid post ID (numbers only)
                setTimeout(() => scrollToPost(postId), 100); // Small delay to ensure page is ready
            }
        }
    });

    // Handle initial page load with hash
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            const postId = hash.substring(1);
            if (/^\d+$/.test(postId)) {
                setTimeout(() => scrollToPost(postId), 500); // Longer delay for initial load
            }
        }
    });

})();