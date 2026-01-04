// ==UserScript==
// @name         Invidious Like and Dislike Count
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Restore like and dislike count for any Invidious Instance 
// @author       KMan005
// @match        https://iv.ggtyler.dev/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488324/Invidious%20Like%20and%20Dislike%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/488324/Invidious%20Like%20and%20Dislike%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the video ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    // Fetch the like and dislike count
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        },
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            const likeCount = data.likes;
            const dislikeCount = data.dislikes;

            // Display the like count on the webpage within the specified <p> element
            const likesElement = document.getElementById('likes');
            likesElement.innerHTML = `<i class="icon ion-ios-thumbs-up"></i> ${likeCount}`;

            // Display the dislike count on the webpage within the specified <p> element
            const dislikesElement = document.getElementById('dislikes');
            dislikesElement.innerHTML = `<i class="icon ion-ios-thumbs-down"></i> ${dislikeCount}`;

            // Ensure visibility and display properties stay consistent for both elements
            likesElement.style.visibility = 'visible';
            likesElement.style.display = 'block';
            dislikesElement.style.visibility = 'visible';
            dislikesElement.style.display = 'block';
        }
    });

    // Apply CSS styles to the specified <p> elements
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        p#likes, p#dislikes {
            display: block;
            visibility: visible;
            unicode-bidi: plaintext;
            text-align: start;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            overflow-wrap: break-word;
            word-wrap: break-word;
            font-family: sans-serif;
        }
    `;
    document.head.appendChild(styleElement);
})();