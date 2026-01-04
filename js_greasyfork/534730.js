// ==UserScript==
// @name         Leakedsenpai Usability Enhancer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enhances user experience on leakedsenpai.com (XenForo) with navigation, link previews, post bookmarking, and more
// @author       Grok
// @match        *://leakedsenpai.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534730/Leakedsenpai%20Usability%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/534730/Leakedsenpai%20Usability%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles
    GM_addStyle(`
        #navBar {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
        }
        #navBar a {
            color: #00ffcc;
            margin: 0 10px;
            text-decoration: none;
        }
        #navBar a:hover {
            text-decoration: underline;
        }
        #searchInput {
            margin: 10px;
            padding: 5px;
            width: 200px;
        }
        .highlightLink {
            background: #ffeb3b;
            padding: 2px 5px;
            border-radius: 3px;
        }
        .hidden {
            display: none;
        }
        .stickyHeader {
            position: sticky;
            top: 0;
            background: #fff;
            z-index: 999;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
        .linkPreview {
            position: absolute;
            background: #fff;
            border: 1px solid #ccc;
            padding: 5px;
            z-index: 1000;
            max-width: 300px;
        }
        .bookmarkBtn, .collapseBtn {
            cursor: pointer;
            color: #007bff;
            margin-left: 10px;
            font-size: 12px;
        }
        .bookmarkBtn:hover, .collapseBtn:hover {
            text-decoration: underline;
        }
        .bookmarked {
            background: #e0f7fa;
        }
        .highlightMatch {
            background: #ffeb3b;
        }
    `);

    // Create floating navigation bar
    const navBar = document.createElement('div');
    navBar.id = 'navBar';
    navBar.innerHTML = `
        <a href="/forums">Home</a>
        <a href="/forums#categories">Categories</a>
        <a href="/search">Search</a>
        <input type="text" id="searchInput" placeholder="Filter posts...">
    `;
    document.body.appendChild(navBar);

    // Make thread list header sticky
    const threadListHeader = document.querySelector('.structItemContainer-group, .p-title');
    if (threadListHeader) {
        threadListHeader.classList.add('stickyHeader');
    }

    // Highlight and add preview to external links
    const links = document.querySelectorAll('a[href*="http"]:not([href*="leakedsenpai.com"])');
    links.forEach(link => {
        link.classList.add('highlightLink');
        link.title = `Link: ${link.href}`;
        link.addEventListener('mouseover', (e) => {
            const preview = document.createElement('div');
            preview.className = 'linkPreview';
            preview.textContent = link.href;
            preview.style.left = `${e.pageX + 10}px`;
            preview.style.top = `${e.pageY + 10}px`;
            document.body.appendChild(preview);
        });
        link.addEventListener('mouseout', () => {
            document.querySelectorAll('.linkPreview').forEach(el => el.remove());
        });
    });

    // Add bookmarking and collapse functionality to posts
    const posts = document.querySelectorAll('.message--post');
    posts.forEach((post, index) => {
        const postId = post.id || `post-${index}`;
        post.id = postId;

        // Bookmark button
        const bookmarkBtn = document.createElement('span');
        bookmarkBtn.className = 'bookmarkBtn';
        bookmarkBtn.textContent = GM_getValue(postId, false) ? 'Unbookmark' : 'Bookmark';
        bookmarkBtn.onclick = () => {
            const isBookmarked = GM_getValue(postId, false);
            GM_setValue(postId, !isBookmarked);
            bookmarkBtn.textContent = isBookmarked ? 'Bookmark' : 'Unbookmark';
            post.classList.toggle('bookmarked', !isBookmarked);
        };
        if (GM_getValue(postId, false)) {
            post.classList.add('bookmarked');
        }

        // Collapse button
        const collapseBtn = document.createElement('span');
        collapseBtn.className = 'collapseBtn';
        collapseBtn.textContent = 'Collapse';
        collapseBtn.onclick = () => {
            const content = post.querySelector('.message-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            collapseBtn.textContent = content.style.display === 'none' ? 'Expand' : 'Collapse';
        };

        // Append buttons to post header
        const postHeader = post.querySelector('.message-userDetails') || post.querySelector('.message-cell--user');
        if (postHeader) {
            postHeader.appendChild(bookmarkBtn);
            postHeader.appendChild(collapseBtn);
        }
    });

    // Enhanced search filter with keyword highlighting
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        posts.forEach(post => {
            const content = post.querySelector('.message-content');
            const text = content.textContent.toLowerCase();
            post.classList.toggle('hidden', filter && !text.includes(filter));

            // Highlight matches
            if (filter && text.includes(filter)) {
                const regex = new RegExp(`(${filter})`, 'gi');
                content.innerHTML = content.textContent.replace(regex, '<span class="highlightMatch">$1</span>');
            } else {
                content.innerHTML = content.textContent;
            }
        });
    });

    // Log for debugging
    console.log('Leakedsenpai Usability Enhancer (XenForo) loaded');
})();