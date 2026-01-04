// ==UserScript==
// @name Danbooru to Gelbooru Search Switcher and vice versa
// @namespace https://greasyfork.org/en/users/187317-funkyjustin
// @version 0.9
// @description Add buttons to switch between Danbooru and Gelbooru searches
// @author FunkyJustin
// @license MIT
// @match https://danbooru.donmai.us/*
// @match https://gelbooru.com/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491016/Danbooru%20to%20Gelbooru%20Search%20Switcher%20and%20vice%20versa.user.js
// @updateURL https://update.greasyfork.org/scripts/491016/Danbooru%20to%20Gelbooru%20Search%20Switcher%20and%20vice%20versa.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Add CSS styles
    GM_addStyle(`
    .search-button {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        text-decoration: none;
        z-index: 9999;
        opacity: 0.5; /* Initially set opacity to 0.5 */
        transition: opacity 0.3s ease; /* Add transition effect */
    }
    .search-button:hover {
        opacity: 1; /* Set opacity to 1 when hovering over the button */
    }
    `);
    // Function to clean and encode tags for URL
    function prepareTags(tags) {
        if (!tags) return '';
        return tags.split(/\s+/).map(t => t.trim()).filter(t => t.length > 0).join('+');
    }
    // Add button to switch to Gelbooru search
    function addGelbooruButton() {
        const url = new URL(window.location.href);
        const tags = url.searchParams.get('tags');
        if (!tags) return;
        const cleanTags = prepareTags(tags);
        if (!cleanTags) return;
        const gelbooruURL = `https://gelbooru.com/index.php?page=post&s=list&tags=${cleanTags}`;
        let gelbooruButton = document.createElement("a");
        gelbooruButton.textContent = "Search on Gelbooru";
        gelbooruButton.href = gelbooruURL;
        gelbooruButton.target = "_blank";
        gelbooruButton.classList.add("search-button");
        document.body.appendChild(gelbooruButton);
    }
    // Add button to switch back to Danbooru search
    function addDanbooruButton() {
        const url = new URL(window.location.href);
        const tags = url.searchParams.get('tags');
        if (!tags) return;
        const cleanTags = prepareTags(tags);
        if (!cleanTags) return;
        const danbooruURL = `https://danbooru.donmai.us/posts?tags=${cleanTags}`;
        let danbooruButton = document.createElement("a");
        danbooruButton.textContent = "Search on Danbooru";
        danbooruButton.href = danbooruURL;
        danbooruButton.target = "_blank";
        danbooruButton.classList.add("search-button");
        document.body.appendChild(danbooruButton);
    }
    // Check if on Danbooru search page and add Gelbooru button
    if (window.location.hostname === 'danbooru.donmai.us' &&
        window.location.pathname === '/posts' &&
        new URL(window.location.href).searchParams.has('tags')) {
        addGelbooruButton();
    }
    // Check if on Gelbooru search page and add Danbooru button
    if (window.location.hostname === 'gelbooru.com' &&
        window.location.pathname === '/index.php' &&
        new URL(window.location.href).searchParams.get('page') === 'post' &&
        new URL(window.location.href).searchParams.get('s') === 'list' &&
        new URL(window.location.href).searchParams.has('tags')) {
        addDanbooruButton();
    }
})();