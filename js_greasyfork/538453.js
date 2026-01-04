// ==UserScript==
// @name         Reddit usernames/icons in feed
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Shows Reddit post author username and icon in post headers
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538453/Reddit%20usernamesicons%20in%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/538453/Reddit%20usernamesicons%20in%20feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function addAuthorInfo(authorName, timeElem, iconUrl) {
        if (!authorName || !timeElem) return;

        let authorLink = document.createElement('a');
        authorLink.href = `https://www.reddit.com/user/${authorName}`;
        authorLink.target = "_blank";
        authorLink.rel = "noopener noreferrer";
        authorLink.className = "author-name whitespace-nowrap text-neutral-content visited:text-neutral-content-weak focus-visible:-outline-offset-1 cursor-pointer no-visited no-underline hover:underline font-bold";
        authorLink.style.display = "inline-flex";
        authorLink.style.alignItems = "center";

        const profileImg = document.createElement('img');
        profileImg.src = iconUrl || `https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png`;
        profileImg.alt = "User";
        profileImg.width = 24;
        profileImg.height = 24;
        profileImg.style.borderRadius = "50%";
        profileImg.style.marginRight = "6px";
        profileImg.style.objectFit = "cover";
        profileImg.style.background = "#eee";
        profileImg.style.position = "relative";
        profileImg.style.top = "8px";

        authorLink.appendChild(profileImg);
        authorLink.appendChild(document.createTextNode(authorName));

        const authorSpan = document.createElement('span');
        authorSpan.className = 'tm-author-info ml-sm text-neutral-content-weak text-12';
        authorSpan.style.display = 'inline-flex';
        authorSpan.style.alignItems = 'center';
        authorSpan.appendChild(authorLink);

        if (timeElem && timeElem.parentElement) {
            if (timeElem.nextSibling) {
                timeElem.parentElement.insertBefore(authorSpan, timeElem.nextSibling);
            } else {
                timeElem.parentElement.appendChild(authorSpan);
            }
        }
    }

    function isFeedPage() {
        const path = window.location.pathname;
        return path === '/' || path.startsWith('/r/popular') || path.startsWith('/user/') || path.startsWith('/r/all');
    }

    function enhanceAuthorInfo() {
        if (!isFeedPage()) return;

        document.querySelectorAll('shreddit-post-overflow-menu').forEach(menu => {
            const authorName = menu.getAttribute('author-name');
            const iconUrl = menu.closest('shreddit-post')?.getAttribute('icon');
            if (!authorName) return;

            let article = menu.closest('article');
            if (!article) return;

            let timeElem = article.querySelector('faceplate-timeago, time');
            if (!timeElem) return;

            if (timeElem.parentElement.querySelector('.tm-author-info')) return;

            addAuthorInfo(authorName, timeElem, iconUrl);
        });

        document.querySelectorAll('shreddit-post[view-type="compactView"]').forEach(post => {
            const authorName = post.getAttribute('author');
            const iconUrl = post.getAttribute('icon');
            if (!authorName) return;

            let timeElem = post.querySelector('faceplate-timeago');
            if (!timeElem) return;

            if (timeElem.parentElement.querySelector('.tm-author-info')) return;

            addAuthorInfo(authorName, timeElem, iconUrl);
        });
    }

    const observer = new MutationObserver(() => enhanceAuthorInfo());
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });

    enhanceAuthorInfo();
})();