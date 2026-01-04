// ==UserScript==
// @name         Gelbooru Tag Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fetch, display, and copy tags for images on Gelbooru with proper HTML entity decoding
// @match        https://gelbooru.com/index.php?page=post&s=view&id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502488/Gelbooru%20Tag%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/502488/Gelbooru%20Tag%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    function fetchTags(id) {
        const url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&id=${id}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data["post"] && data["post"].length > 0) {
                    const post = data["post"][0];
                    const tags = post["tags"];
                    const parsed = tags.split(' ')
                        .map(tag => decodeHTMLEntities(tag.replace(/_/g, ' ')))
                        .join(', ');
                    displayTags(parsed);
                    GM_setClipboard(parsed);
                } else {
                    displayTags("No tags found for this image.");
                }
            },
            onerror: function(error) {
                console.error('Error fetching tags:', error);
                displayTags("Error fetching tags. Please try again.");
            }
        });
    }

    function displayTags(tags) {
        let tagDisplay = document.getElementById('gelbooru-tag-display');
        if (!tagDisplay) {
            tagDisplay = document.createElement('div');
            tagDisplay.id = 'gelbooru-tag-display';
            tagDisplay.style.padding = '10px';
            tagDisplay.style.margin = '10px 0';
            tagDisplay.style.border = '1px solid #ccc';
            tagDisplay.style.backgroundColor = '#f9f9f9';
            document.querySelector('#tag-list').insertAdjacentElement('beforebegin', tagDisplay);
        }
        tagDisplay.textContent = tags;
    }

    function getPostId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function addFetchButton() {
        const container = document.querySelector('#tag-list');
        if (container) {
            const button = document.createElement('button');
            button.textContent = 'Copy Tags';
            button.style.backgroundColor = '#0275d8';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '6px 12px';
            button.style.margin = '10px 0';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';
            button.style.fontWeight = 'bold';
            button.addEventListener('click', function() {
                const postId = getPostId();
                if (postId) {
                    fetchTags(postId);
                } else {
                    console.error('Unable to find post ID. Please make sure you\'re on a valid Gelbooru post page.');
                }
            });
            container.insertAdjacentElement('beforebegin', button);
        }
    }

    // Run the script when the page is fully loaded
    window.addEventListener('load', addFetchButton);
})();