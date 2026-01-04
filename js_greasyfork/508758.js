// ==UserScript==
// @name         TikTok on YouTube Shorts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Embed TikTok videos on YouTube Shorts page and add a TikTok search bar
// @author       You
// @match        https://www.youtube.com/shorts/*
// @match        https://www.youtube.com/results?search_query=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508758/TikTok%20on%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/508758/TikTok%20on%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addTikTokEmbed() {
        // Ensure this only runs on YouTube Shorts pages
        if (window.location.href.includes("shorts")) {
            // Create an iframe for TikTok video
            const tiktokIframe = document.createElement('iframe');
            tiktokIframe.width = "300";
            tiktokIframe.height = "500";
            tiktokIframe.style.marginTop = "20px";
            tiktokIframe.style.border = "none";
            tiktokIframe.src = "https://www.tiktok.com/embed/v2/VIDEO_ID"; // Replace VIDEO_ID with the actual TikTok video ID

            // Append TikTok iframe below the Shorts video
            const videoContainer = document.querySelector("ytd-rich-grid-media");
            if (videoContainer) {
                videoContainer.appendChild(tiktokIframe);
            }
        }
    }

    function addSearchBar() {
        // Ensure this only runs on YouTube search results pages
        if (window.location.href.includes("search_query")) {
            // Create a search bar for TikTok
            const searchBar = document.createElement('div');
            searchBar.style.marginTop = "20px";
            searchBar.style.padding = "10px";
            searchBar.style.backgroundColor = "#f1f1f1";
            searchBar.style.border = "1px solid #ccc";
            searchBar.style.borderRadius = "5px";
            searchBar.style.textAlign = "center";

            const searchLabel = document.createElement('h3');
            searchLabel.textContent = "From TikTok";
            searchBar.appendChild(searchLabel);

            // Add a form for TikTok search
            const searchForm = document.createElement('form');
            searchForm.action = "https://www.tiktok.com/search";
            searchForm.method = "get";

            const searchInput = document.createElement('input');
            searchInput.type = "text";
            searchInput.name = "q";
            searchInput.placeholder = "Search TikTok...";
            searchInput.style.width = "80%";
            searchInput.style.padding = "5px";
            searchInput.style.marginBottom = "10px";
            searchForm.appendChild(searchInput);

            const searchButton = document.createElement('button');
            searchButton.type = "submit";
            searchButton.textContent = "Search";
            searchButton.style.padding = "5px 10px";
            searchButton.style.cursor = "pointer";
            searchForm.appendChild(searchButton);

            searchBar.appendChild(searchForm);

            // Append the search bar above the search results
            const searchContainer = document.querySelector("#container");
            if (searchContainer) {
                searchContainer.insertBefore(searchBar, searchContainer.firstChild);
            }
        }
    }

    // Run functions initially
    addTikTokEmbed();
    addSearchBar();

    // Observe changes to URL to reload TikTok embed and search bar on page changes
    const observer = new MutationObserver(() => {
        addTikTokEmbed();
        addSearchBar();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
