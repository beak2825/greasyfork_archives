// ==UserScript==
// @name         Bookracy Redirect
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Adds a button to book-related websites to search the current book title on Bookracy.ru
// @author       Gemini
// @match        https://thegreatestbooks.org/*
// @match        https://www.goodreads.com/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538970/Bookracy%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/538970/Bookracy%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Attempts to extract the book title from the current page based on its hostname.
     * It uses specific selectors for known sites and falls back to general H1 tags or document title.
     * @returns {string} The extracted book title, or an empty string if not found.
     */
    function getBookTitle() {
        let title = '';
        const hostname = window.location.hostname;

        // --- Specific rules for different websites ---
        if (hostname.includes('goodreads.com')) {
            // Goodreads: Book title is usually in an h1 with id 'bookTitle'
            const el = document.getElementById('bookTitle');
            if (el) {
                title = el.innerText.trim();
            }
        } else if (hostname.includes('amazon.')) {
            // Amazon (all domains): Book title is usually in an h1 with id 'productTitle' or 'bookTitle'
            const el = document.getElementById('productTitle') || document.getElementById('bookTitle');
            if (el) {
                title = el.innerText.trim();
            }
        } else if (
            hostname.includes('thegreatestbooks.org')
            // Removed: hostname.includes('fivebooks.com')
            // Removed: hostname.includes('mostrecommendedbooks.com')
            // Removed: hostname.includes('redditreads.com')
        ) {
            // General approach for other book list/review sites:
            // Try common header tags for the main title on the page.
            // Prioritize a specific class if known, then general h1.
            let el = document.querySelector('h1.book-title') || document.querySelector('h1');
            if (el) {
                title = el.innerText.trim();
            }
            // Fallback to title tag if h1 not found or empty
            if (!title && document.title) {
                title = document.title;
            }
        }

        // --- General Fallback and Cleaning ---
        // If no specific rule matched or element found, use the document title as a last resort.
        if (!title && document.title) {
            title = document.title;
        }

        // Clean up common suffixes/prefixes often found in titles (e.g., from browser tabs or Goodreads)
        title = title
            .replace(/ - Wikipedia$/, '') // Remove Wikipedia suffix
            .replace(/ \| Goodreads$/, '') // Remove Goodreads suffix
            .replace(/ \| Five Books$/, '') // Remove Five Books suffix
            .replace(/\(Paperback\)/, '') // Remove (Paperback)
            .replace(/\(Hardcover\)/, '') // Remove (Hardcover)
            .replace(/\(Kindle\)/, '') // Remove (Kindle)
            .replace(/ by [A-Za-z\s]+$/, '') // Remove " by Author Name" at the end
            .replace(/ Series$/, '') // Remove " Series"
            .trim(); // Trim any leading/trailing whitespace

        return title;
    }

    /**
     * Creates and appends the "Search on Bookracy" button to the page.
     * The button will be positioned at the bottom right corner of the viewport.
     */
    function createBookracyButton() {
        const bookTitle = getBookTitle();

        // Only create the button if a book title was successfully extracted
        if (!bookTitle) {
            console.log("Book title not found on this page, skipping Bookracy button creation.");
            return;
        }

        const button = document.createElement('button');
        button.innerText = 'Search on Bookracy';

        // Apply basic inline styles for visibility and consistent appearance
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4CAF50; /* Green */
            color: white;
            padding: 10px 18px; /* Slightly more padding for touch targets */
            border: none;
            border-radius: 8px; /* Rounded corners */
            cursor: pointer;
            font-family: 'Inter', sans-serif; /* Use Inter font for consistency */
            font-size: 16px;
            font-weight: 500;
            z-index: 10000; /* Ensure button is above other content */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); /* Stronger shadow for depth */
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
            outline: none; /* Remove focus outline */
        `;

        // Add hover effects for a more interactive feel
        button.onmouseover = function() {
            this.style.backgroundColor = '#45a049'; // Darker green on hover
            this.style.transform = 'scale(1.05)'; // Slightly enlarge on hover
            this.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)'; // Enhanced shadow
        };

        // Revert styles on mouse out
        button.onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
        };

        // Handle button click event
        button.onclick = function() {
            // Encode the book title to ensure it's a valid URL parameter
            const encodedTitle = encodeURIComponent(bookTitle);
            // Construct the Bookracy URL and open it in a new tab
            window.open(`https://bookracy.ru/?q=${encodedTitle}`, '_blank');
        };

        // Append the button to the document body
        document.body.appendChild(button);
    }

    // Ensure the script runs after the DOM is fully loaded.
    // This prevents errors if elements are not yet available.
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createBookracyButton);
    } else {
        // If the DOM is already loaded (e.g., script injected late), run immediately.
        createBookracyButton();
    }
})();
