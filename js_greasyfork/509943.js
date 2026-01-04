// ==UserScript==
// @name         Highlight 4chan Posts based on number of replies
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Script for highlighting posts based on number of replies. Changes backlink and quotelink font colors.
// @author       cheebsisaftfck
// @match        http://boards.4chan.org/*
// @match        https://boards.4chan.org/*
// @match        http://sys.4chan.org/*
// @match        https://sys.4chan.org/*
// @match        http://www.4chan.org/*
// @match        https://www.4chan.org/*
// @match        http://boards.4channel.org/*
// @match        https://boards.4channel.org/*
// @match        http://sys.4channel.org/*
// @match        https://sys.4channel.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509943/Highlight%204chan%20Posts%20based%20on%20number%20of%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/509943/Highlight%204chan%20Posts%20based%20on%20number%20of%20replies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create CSS classes for styling posts based on backlink count
    const style = document.createElement('style');
    style.textContent = `
        .highlight-7plus { background-color: #9E1030FF !important; }
        .highlight-4to6 { background-color: #00539CFF !important; }
        .backlink-7plus { color: #9CC3D5FF !important; }
        .backlink-4to6 { color: #EEA47FFF !important; }
    `;
    document.head.appendChild(style);

    // Throttle function to limit how often the MutationObserver callback is executed
    function throttle(fn, wait) {
        let isCalled = false;
        return function(...args) {
            if (!isCalled) {
                fn.apply(this, args);
                isCalled = true;
                setTimeout(() => { isCalled = false; }, wait);
            }
        };
    }

    // Function to reset any existing highlights
    function resetHighlights() {
        // Remove existing highlight classes from posts and backlinks in one pass
        document.querySelectorAll('.highlight-7plus, .highlight-4to6, .backlink-7plus, .backlink-4to6')
            .forEach(el => el.classList.remove('highlight-7plus', 'highlight-4to6', 'backlink-7plus', 'backlink-4to6'));
    }

    // Function to highlight posts with 4 or more backlinks and update quote links
    function highlightPosts() {
        resetHighlights(); // Reset previous highlights

        // Get all posts with class 'post reply' or 'post op' in a single query
        const posts = document.querySelectorAll('div.post');

        const updates = []; // Store updates to apply later in batch

        posts.forEach(post => {
            const container = post.querySelector('span.container');
            if (!container) return;

            const backlinks = container.querySelectorAll('a.backlink');
            const postId = post.id.split('p')[1]; // Extract post ID

            // Batch the updates to be more efficient
            if (backlinks.length >= 7) {
                updates.push({element: container, addClass: 'highlight-7plus'});
                backlinks.forEach(link => updates.push({element: link, addClass: 'backlink-7plus'}));
            } else if (backlinks.length >= 4) {
                updates.push({element: container, addClass: 'highlight-4to6'});
                backlinks.forEach(link => updates.push({element: link, addClass: 'backlink-4to6'}));
            }

            // Update quote links referring to this post in one go
            if (backlinks.length >= 4) {
                const quoteLinks = document.querySelectorAll(`a.quotelink[href$="#p${postId}"]`);
                quoteLinks.forEach(link => {
                    updates.push({
                        element: link,
                        addClass: backlinks.length >= 7 ? 'highlight-7plus' : 'highlight-4to6'
                    });
                });
            }
        });

        // Apply all the updates in one batch to minimize reflows
        updates.forEach(update => update.element.classList.add(update.addClass));
    }

    // Efficiently observe DOM changes for dynamically added content
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = throttle(() => {
            highlightPosts(); // Re-run the highlight function when new content is added
        }, 2000); // CONFIGURE Throttle here (currently 2 seconds)

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Run the highlight function on page load
    window.addEventListener('load', () => {
        highlightPosts();
        observeDOM(); // Start observing for dynamic content
    });

})();
