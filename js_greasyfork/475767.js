// ==UserScript==
// @name         random doujin but with tags
// @namespace    pablo
// @version      2.0
// @description  Generates a random doujinshi with personalized tags
// @match        https://nhentai.net/*
// @exclude      https://nhentai.net/g/*/
// @connect      nhentai.net
// @icon         https://i.imgur.com/1lihxY2.png
// @license MIT
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/475767/random%20doujin%20but%20with%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/475767/random%20doujin%20but%20with%20tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiBaseUrl = 'https://nhentai.net/api/galleries/search?query=';

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'MAGIC !';
    button.classList.add('my-button');

    // Create the multi-selection tag list
    const select = document.createElement('select');
    select.style.position = 'static';
    select.style.bottom = '100px';
    select.style.right = '20px';
    select.style.zIndex = '9999';
    select.style.padding = '8px 12px';
    select.style.border = '1px solid #ddd';
    select.style.borderRadius = '5px';
    select.style.fontSize = '14px';
    select.style.backgroundColor = '#fff';
    select.style.color = '#333';
    select.style.maxWidth = '300px';
    select.style.height = '45px';
    select.multiple = true;

    // Define your desired tags (you can add more by following this exemple:(, "tag")
    const desired_tags = ["big breasts", "full color"];

    desired_tags.forEach(tag => {
        const option = document.createElement('option');
        option.textContent = tag;
        select.appendChild(option);
    });

    // Button click event
    button.addEventListener('click', async function() {
        const selectedTags = Array.from(select.selectedOptions, option => option.value);
        if (selectedTags.length > 0) {
            try {
                const randomTag = getRandomTag(selectedTags);
                const doujinshi = await getRandomDoujinshi(randomTag);
                displayDoujinshiDetails(doujinshi, randomTag);
            } catch (error) {
                displayErrorMessage('An error occurred while fetching doujinshi. Please try again later.');
            }
        }
    });

    // Create the container for the button and the select
    const container = document.createElement('li');
    container.appendChild(button);
    container.appendChild(select);

    // Target the <ul> element with class "menu right"
    const ulMenu = document.querySelector('ul.menu.right');
    if (ulMenu) {
        ulMenu.appendChild(container);
    }

    // Add styles
    GM_addStyle(`
       .my-button {
            background-color: #0d0d0d;
            color: white;
            border: none;
            padding: 5px 20px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 0px;
            margin-right: 10px; /* Add margin to separate from other buttons */
        }

        .my-container {
            display: flex;
            align-items: center;
        }
    `);

    function getRandomTag(tags) {
        const randomIndex = Math.floor(Math.random() * tags.length);
        return tags[randomIndex];
    }

   async function getRandomDoujinshi(tag) {
        const response = await fetch(apiBaseUrl + tag);
        const data = await response.json();
        if (data.num_pages > 0) {
            const randomPage = Math.floor(Math.random() * data.num_pages) + 1;
            return getRandomDoujinshiFromPage(tag, randomPage);
        } else {
            throw new Error(`No doujinshi found with tag "${tag}"`);
        }
    }

    async function getRandomDoujinshiFromPage(tag, page) {
        const response = await fetch(apiBaseUrl + tag + '&page=' + page);
        const data = await response.json();
        if (data.result.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.result.length);
            return data.result[randomIndex];
        } else {
            throw new Error(`No doujinshi found with tag "${tag}"`);
        }
    }

    function displayDoujinshiDetails(doujinshi, tag) {
        const title = doujinshi.title.pretty;
        const tags = doujinshi.tags.map(tag => tag.name).join(', ');
        console.log('Doujinshi Title:', title);
        console.log('Tags:', tags);
        console.log(`The doujinshi "${title}" contains the tag "${tag}"`);
        window.open(`https://nhentai.net/g/${doujinshi.id}`, '_blank');
    }

})();