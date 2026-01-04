// ==UserScript==
// @name         Reddit Post Filter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hide posts or comments containing specific keywords, by users, or comment authors, with toggle and settings popup
// @author       brfuk
// @license      MIT
// @match        *://*.reddit.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531434/Reddit%20Post%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/531434/Reddit%20Post%20Filter.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Retrieve stored values
    let blockedKeywords = GM_getValue('blockedKeywords', ["test"]);
    let blockedUsers = GM_getValue('blockedUsers', ["test"]);
    let blockedCommenters = GM_getValue('blockedCommenters', ["test"]);
    let filterEnabled = GM_getValue('filterEnabled', true);

    // Add styles
    const style = `
        #popup-container {
            display: none;
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            width: 300px;
            height: 500px;
            overflow: auto;
        }
        #popup-container h2 {
            text-align: center;
        }
        #popup-container label {
            display: block;
            margin-top: 5px;
        }
        #popup-container textarea {
            width: 100%;
            height: 95px;
            margin-top: 1px;
        }
        #popup-container button {
            display: block;
            width: 100%;
            margin-top: 1px;
            padding: 1px 1px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        #popup-container button:hover {
            background-color: #45a049;
        }
        #open-popup-button {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 5px;
            cursor: pointer;
            font-size: 14px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #open-popup-button:hover {
            background-color: #45a049;
        }
    `;

    const popupContainer = document.createElement('div');
    popupContainer.id = 'popup-container';
    popupContainer.style.display = 'none';
    popupContainer.innerHTML = `
        <h2>Modify Keywords and Users</h2>
        <label for="enableFilter">
            <input type="checkbox" id="enableFilter" ${filterEnabled ? "checked" : ""}>
            Enable Filtering
        </label>

        <label for="keywords">Keywords:</label>
        <textarea id="keywords">${blockedKeywords.join("\n")}</textarea>

        <label for="users">Post Authors:</label>
        <textarea id="users">${blockedUsers.join("\n")}</textarea>

        <label for="commenters">Comment Authors:</label>
        <textarea id="commenters">${blockedCommenters.join("\n")}</textarea>

        <button id="save-button">Save</button>
    `;
    document.body.appendChild(popupContainer);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);

    const openButton = document.createElement('button');
    openButton.id = 'open-popup-button';
    openButton.innerText = '⚙️';
    document.body.appendChild(openButton);

    openButton.addEventListener('click', () => {
        popupContainer.style.display = 'block';
    });

    document.getElementById('save-button').addEventListener('click', () => {
        const updatedKeywords = document.getElementById('keywords').value.split("\n").filter(k => k.trim() !== "");
        const updatedUsers = document.getElementById('users').value.split("\n").filter(u => u.trim() !== "");
        const updatedCommenters = document.getElementById('commenters').value.split("\n").filter(c => c.trim() !== "");
        const enableFilter = document.getElementById('enableFilter').checked;

        GM_setValue('blockedKeywords', updatedKeywords);
        GM_setValue('blockedUsers', updatedUsers);
        GM_setValue('blockedCommenters', updatedCommenters);
        GM_setValue('filterEnabled', enableFilter);

        blockedKeywords = updatedKeywords;
        blockedUsers = updatedUsers;
        blockedCommenters = updatedCommenters;
        filterEnabled = enableFilter;

        popupContainer.style.display = 'none';
        hideBlockedPosts();
        hideBlockedComments();
    });

    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'z') {
            popupContainer.style.display = 'block';
        }
    });

//     window.addEventListener('keydown', (event) => {
//         if (event.key === 'Escape') {
//             popupContainer.style.display = 'none';
//         }
//     });

    let escInterceptor = (event) => {
        if (event.key === 'Escape') {
            event.stopImmediatePropagation();
            event.preventDefault();
            popupContainer.style.display = 'none';
            window.removeEventListener('keydown', escInterceptor, true);
        }
    };

    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'z') {
            popupContainer.style.display = 'block';
            window.addEventListener('keydown', escInterceptor, true);
        }
    });

    openButton.addEventListener('click', () => {
        popupContainer.style.display = 'block';
        window.addEventListener('keydown', escInterceptor, true);
    });



    function hideBlockedPosts() {
        if (!filterEnabled) return;

        let posts = document.querySelectorAll('shreddit-post');
        posts.forEach(post => {
            let titleElem = post.querySelector('[id^="post-title"]');
            if (!titleElem) return;

            let titleText = titleElem.innerText.toLowerCase();
            let authorName = post.getAttribute('author');

            if (blockedKeywords.some(keyword => titleText.includes(keyword.toLowerCase()))) {
                console.log(`🔕 Post blocked - Keyword match`);
                post.style.display = 'none';
                return;
            }

            if (blockedUsers.includes(authorName)) {
                console.log(`🔕 Post blocked - Author: ${authorName}`);
                post.style.display = 'none';
            }
        });
    }

    function hideBlockedComments() {
        if (!filterEnabled) return;

        const comments = document.querySelectorAll('shreddit-comment');
        comments.forEach(comment => {
            const commenterName = comment.getAttribute('author');
            if (!commenterName) return;

            if (blockedCommenters.includes(commenterName)) {
                console.log(`💬 Comment blocked - Author: ${commenterName}`);
                comment.style.display = 'none';
            }
        });
    }


    function highlightBlockedUsers() {
        // Mark red only when toggled off
        if (filterEnabled) return;

        const keywords = blockedKeywords.filter(k => k.trim().length > 0);

        // ------- 1. Post author marked red -------
        document.querySelectorAll('shreddit-post').forEach(post => {
            const author = post.getAttribute('author');

            if (blockedUsers.includes(author)) {
                const authorLink = post.querySelector('a[href*="/user/"]');
                if (authorLink) {
                    authorLink.style.color = 'red';
                    console.log(`🔴 Marked post author red: ${author}`);
                }
            }

            // ------- 2. Title marked red -------
            const titleElem = post.querySelector('[id^="post-title"]');
            if (!titleElem) return;

            // Avoid duplicated process
            if (titleElem.dataset.highlighted === "1") return;

            const walker = document.createTreeWalker(
                titleElem,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let textNode;
            while ((textNode = walker.nextNode())) {
                let text = textNode.nodeValue;

                let replaced = false;

                keywords.forEach(keyword => {
                    if (!keyword) return;

                    const reg = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");

                    if (reg.test(text)) {
                        const span = document.createElement("span");
                        span.innerHTML = text.replace(reg, match =>
                                                      `<span style="color:red;">${match}</span>`
                                                     );

                        textNode.parentNode.replaceChild(span, textNode);
                        replaced = true;
                        console.log(`🔴 Highlighted keyword in post title: "${keyword}"`);
                    }
                });

                if (replaced) {
                    // Replaced, skip
                    continue;
                }
            }

            titleElem.dataset.highlighted = "1";
        });

        // ------- 3. Comment author marked red -------
        document.querySelectorAll('shreddit-comment').forEach(comment => {
            const author = comment.getAttribute('author');

            if (blockedCommenters.includes(author)) {
                const authorLink = comment.querySelector('a[href*="/user/"]');
                if (authorLink) {
                    authorLink.style.color = 'red';
                    console.log(`🟥 Marked comment author red: ${author}`);
                }
            }
        });
    }

    // Initialization
    hideBlockedPosts();
    hideBlockedComments();
    highlightBlockedUsers()

    const observer = new MutationObserver(() => {
        hideBlockedPosts();
        hideBlockedComments();
        highlightBlockedUsers()
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
