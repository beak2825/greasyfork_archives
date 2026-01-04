// ==UserScript==
// @name         Enhanced Hacker News UI
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Enhance Hacker News with better visual hierarchy and typography
// @author       mcnaveen <https://github.com/mcnaveen>
// @match        https://news.ycombinator.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546421/Enhanced%20Hacker%20News%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/546421/Enhanced%20Hacker%20News%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Center layout with max width */
        body {
            max-width: 1000px !important;
            margin: 0 auto !important;
            padding: 0 20px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        /* Main table centering */
        body > center {
            width: 100% !important;
        }

        body > center > table {
            width: 100% !important;
            max-width: 1000px !important;
            margin: 0 auto !important;
        }

        /* Dark mode toggle button */
        #dark-mode-toggle {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ff6600;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        #dark-mode-toggle:hover {
            background: #e55a00;
        }

        /* Improved dark mode - softer colors */
        body.dark-mode {
            background-color: #0d1117 !important;
            color: #c9d1d9 !important;
        }

        body.dark-mode table {
            background-color: #0d1117 !important;
        }

        body.dark-mode .pagetop {
            background-color: #161b22 !important;
            border-bottom: 1px solid #30363d !important;
        }

        body.dark-mode .storylink {
            color: #58a6ff !important;
            font-weight: 700 !important;
        }

        body.dark-mode .storylink:visited {
            color: #bc8cff !important;
        }

        body.dark-mode .storylink:hover {
            color: #79c0ff !important;
        }

        body.dark-mode .hnuser {
            color: #7ee787 !important;
        }

        body.dark-mode .comment {
            color: #c9d1d9 !important;
        }

        body.dark-mode .subtext {
            color: #8b949e !important;
        }

        body.dark-mode .subtext a {
            color: #8b949e !important;
        }

        body.dark-mode .subtext a:hover {
            color: #c9d1d9 !important;
        }

        body.dark-mode .score {
            color: #7ee787 !important;
        }

        body.dark-mode .hnmore a {
            color: #58a6ff !important;
        }

        /* ENHANCED VISUAL HIERARCHY */

        /* Story titles - MUCH BIGGER */
        .storylink {
            font-size: 32px !important;
            line-height: 1.4 !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            display: block !important;
            margin-bottom: 8px !important;
            color: #1a1a1a !important;
        }

        .storylink:hover {
            text-decoration: underline !important;
            color: #ff6600 !important;
        }

        .storylink:visited {
            color: #666 !important;
        }

        /* Metadata - MUCH SMALLER */
        .subtext {
            font-size: 11px !important;
            line-height: 1.3 !important;
            margin-top: 4px !important;
            margin-bottom: 20px !important;
            color: #828282 !important;
            font-weight: 400 !important;
        }

        .subtext a {
            font-weight: 500 !important;
            color: #828282 !important;
            text-decoration: none !important;
        }

        .subtext a:hover {
            color: #ff6600 !important;
            text-decoration: underline !important;
        }

        /* Score styling - smaller and subtle */
        .score {
            font-weight: 600 !important;
            font-size: 11px !important;
            color: #ff6600 !important;
        }

        /* Username styling */
        .hnuser {
            font-weight: 500 !important;
            color: #666 !important;
        }

        /* Better spacing for stories */
        .athing {
            margin-bottom: 24px !important;
            padding: 0 !important;
            border-bottom: 1px solid #f0f0f0 !important;
            padding-bottom: 16px !important;
        }

        body.dark-mode .athing {
            border-bottom-color: #30363d !important;
        }

        /* Story rank number */
        .rank {
            font-size: 11px !important;
            color: #999 !important;
            font-weight: 500 !important;
            width: 30px !important;
            padding-right: 8px !important;
        }

        /* Better comment font size */
        .comment {
            font-size: 15px !important;
            line-height: 1.6 !important;
        }

        /* Navigation improvements */
        .pagetop {
            padding: 12px 0 !important;
            font-size: 14px !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 100 !important;
            background: #f6f6ef !important;
            margin-bottom: 20px !important;
            border-bottom: 1px solid #e6e6e6 !important;
        }

        .pagetop a {
            font-weight: 500 !important;
            margin-right: 12px !important;
        }

        /* Domain highlighting - smaller and more subtle */
        .domain-highlight {
            background: rgba(255, 102, 0, 0.08);
            color: #ff6600;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 600;
            margin-left: 6px;
            border: 1px solid rgba(255, 102, 0, 0.15);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        body.dark-mode .domain-highlight {
            background: rgba(255, 102, 0, 0.15);
            color: #ff9500;
            border-color: rgba(255, 102, 0, 0.3);
        }

        /* Improved vote arrows */
        .votelinks {
            padding-right: 8px !important;
        }

        .votelinks a {
            opacity: 0.7;
            transition: opacity 0.2s, transform 0.2s;
        }

        .votelinks a:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        /* Better comment threading */
        .comment-thread {
            border-left: 3px solid #e1e4e8;
            margin-left: 15px;
            padding-left: 15px;
        }

        body.dark-mode .comment-thread {
            border-left-color: #30363d;
        }

        /* Reading time indicator - very small */
        .reading-time {
            font-size: 10px;
            color: #999;
            margin-left: 6px;
            font-weight: 600;
            background: rgba(0,0,0,0.04);
            padding: 1px 4px;
            border-radius: 2px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        body.dark-mode .reading-time {
            color: #8b949e;
            background: rgba(255,255,255,0.05);
        }

        /* More link styling */
        .hnmore {
            text-align: center !important;
            padding: 20px 0 !important;
        }

        .hnmore a {
            font-size: 16px !important;
            font-weight: 500 !important;
            padding: 10px 20px !important;
            background: #ff6600 !important;
            color: white !important;
            text-decoration: none !important;
            border-radius: 6px !important;
            transition: background 0.2s !important;
        }

        .hnmore a:hover {
            background: #e55a00 !important;
        }

        body.dark-mode .hnmore a {
            background: #ff6600 !important;
        }

        body.dark-mode .hnmore a:hover {
            background: #ff7700 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            body {
                padding: 0 15px !important;
            }

            .storylink {
                font-size: 20px !important;
            }

            .subtext {
                font-size: 10px !important;
            }

            .rank {
                font-size: 10px !important;
            }
        }

        @media (max-width: 480px) {
            .storylink {
                font-size: 18px !important;
            }
        }

        .title {
          font-size: 16px !important;
          padding: 10px 0;
        }

        /* Fix for title containers */
        .titleline {
            margin-bottom: 6px !important;
        }

        /* Adjust spacing between elements */
        .athing .rank,
        .athing .votelinks,
        .athing .titleline {
            vertical-align: top !important;
        }
    `);

    // Dark mode functionality
    function initDarkMode() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.id = 'dark-mode-toggle';
        darkModeToggle.textContent = '🌙 Dark';
        document.body.appendChild(darkModeToggle);

        // Load saved preference
        const isDark = localStorage.getItem('hn-dark-mode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️ Light';
        }

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            darkModeToggle.textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
            localStorage.setItem('hn-dark-mode', isDarkMode);
        });
    }

    // Add domain highlighting
    function highlightDomains() {
        const links = document.querySelectorAll('.storylink');
        links.forEach(link => {
            if (link.href && !link.querySelector('.domain-highlight')) {
                const url = new URL(link.href);
                const domain = url.hostname.replace('www.', '');

                // Add domain badge for external links
                if (!domain.includes('ycombinator.com') && !domain.includes('news.ycombinator.com')) {
                    const domainSpan = document.createElement('span');
                    domainSpan.className = 'domain-highlight';
                    domainSpan.textContent = domain;
                    link.parentNode.appendChild(domainSpan);
                }
            }
        });
    }

    // Add reading time estimates
    function addReadingTime() {
        const storyRows = document.querySelectorAll('.subtext');
        storyRows.forEach(row => {
            if (!row.querySelector('.reading-time')) {
                const commentsLink = row.querySelector('a[href*="item?id="]');
                if (commentsLink && commentsLink.textContent.includes('comment')) {
                    const commentsText = commentsLink.textContent;
                    const commentsMatch = commentsText.match(/(\d+)\s+comment/);
                    if (commentsMatch) {
                        const commentCount = parseInt(commentsMatch[1]);
                        const readingTime = Math.max(1, Math.round(commentCount / 8));
                        const timeSpan = document.createElement('span');
                        timeSpan.className = 'reading-time';
                        timeSpan.textContent = `${readingTime}min`;
                        commentsLink.parentNode.appendChild(timeSpan);
                    }
                }
            }
        });
    }

    // Improve comment threading
    function enhanceCommentThreading() {
        const comments = document.querySelectorAll('.comment');
        comments.forEach(comment => {
            if (!comment.classList.contains('comment-thread')) {
                const indent = comment.querySelector('img[src="s.gif"]');
                if (indent && indent.width > 0) {
                    comment.classList.add('comment-thread');
                }
            }
        });
    }

    // Keyboard shortcuts
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(e.key) {
                case 'j':
                    e.preventDefault();
                    navigateStory('next');
                    break;
                case 'k':
                    e.preventDefault();
                    navigateStory('prev');
                    break;
                case 'o':
                    e.preventDefault();
                    openCurrentStory();
                    break;
                case 'c':
                    e.preventDefault();
                    openCurrentComments();
                    break;
                case 'd':
                    e.preventDefault();
                    document.getElementById('dark-mode-toggle').click();
                    break;
            }
        });
    }

    let currentStoryIndex = 0;

    function navigateStory(direction) {
        const stories = document.querySelectorAll('.athing');
        if (stories.length === 0) return;

        stories.forEach(story => story.style.backgroundColor = '');

        if (direction === 'next') {
            currentStoryIndex = (currentStoryIndex + 1) % stories.length;
        } else {
            currentStoryIndex = (currentStoryIndex - 1 + stories.length) % stories.length;
        }

        const currentStory = stories[currentStoryIndex];
        currentStory.style.backgroundColor = 'rgba(255, 102, 0, 0.05)';
        currentStory.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function openCurrentStory() {
        const stories = document.querySelectorAll('.athing');
        if (stories[currentStoryIndex]) {
            const link = stories[currentStoryIndex].querySelector('.storylink');
            if (link) {
                window.open(link.href, '_blank');
            }
        }
    }

    function openCurrentComments() {
        const stories = document.querySelectorAll('.athing');
        if (stories[currentStoryIndex]) {
            const nextRow = stories[currentStoryIndex].nextElementSibling;
            if (nextRow) {
                const commentsLink = nextRow.querySelector('a[href*="item?id="]');
                if (commentsLink && commentsLink.textContent.includes('comment')) {
                    window.open(commentsLink.href, '_blank');
                }
            }
        }
    }

    // Initialize all enhancements
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initDarkMode();
        highlightDomains();
        addReadingTime();
        enhanceCommentThreading();
        addKeyboardShortcuts();

        // Re-run enhancements for dynamic content
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(() => {
                        highlightDomains();
                        addReadingTime();
                        enhanceCommentThreading();
                    }, 100);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init();
})();