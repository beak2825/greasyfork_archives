// ==UserScript==
// @name         小说机
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  成人小说随时随地随机看
// @author       黎曼
// @match        *://*/*
// @icon         data:image/jpeg;base64,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
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496215/%E5%B0%8F%E8%AF%B4%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/496215/%E5%B0%8F%E8%AF%B4%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

     const baseURL = 'https://xn--chq372d2rdzvu.com';
    const proxyURL = 'http://localhost:3000/proxy?url='; // Proxy server URL
    // Create a floating button
    let button = document.createElement('button');
    button.innerText = 'Read Novel';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Create a modal to display novel content
    let modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.zIndex = '10000';
    modal.style.padding = '20px';
    modal.style.overflowY = 'scroll';

    let modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.maxWidth = '800px';
    modalContent.style.margin = 'auto';
    modal.appendChild(modalContent);

    let closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '10px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    modal.appendChild(closeButton);

    // Create a select box for novel types
    let typeSelect = document.createElement('select');
    typeSelect.style.position = 'fixed';
    typeSelect.style.bottom = '50px';
    typeSelect.style.right = '10px';
    typeSelect.style.zIndex = '9999';
    typeSelect.style.padding = '10px';
    typeSelect.style.backgroundColor = '#fff';
    typeSelect.style.color = '#000';
    typeSelect.style.border = '1px solid #ccc';
    typeSelect.style.borderRadius = '5px';
    typeSelect.style.cursor = 'pointer';
    document.body.appendChild(typeSelect);

    document.body.appendChild(modal);

    // Function to fetch novel types
    async function fetchNovelTypes() {
        try {
            console.log('fetchNovelTypes',proxyURL + encodeURIComponent(baseURL))

            let response = await fetch(proxyURL + encodeURIComponent(baseURL));

            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            let types = doc.querySelectorAll('.nav dd a');
            let typeList = [];

            types.forEach(type => {
                let title = type.innerText;
                let link = baseURL + type.getAttribute('href');
                if (link.includes('type')) { // Filter out links containing 'type'
                    typeList.push({ title, link });
                }
            });

            return typeList;
        } catch (error) {
            console.error('Error fetching novel types:', error);
            return [];
        }
    }

    // Populate the type select box with novel types
    async function populateTypeSelect() {
        let types = await fetchNovelTypes();
        types.forEach(type => {
            let option = document.createElement('option');
            option.value = type.link;
            option.innerText = type.title;
            typeSelect.appendChild(option);
        });
    }

    // Function to fetch and parse novel data from a given URL
    async function fetchNovels(pageURL) {
        try {
            let response = await fetch(proxyURL + encodeURIComponent(pageURL));

            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');

            // Extract total pages from the main page
            let totalPages = 1;
            if (pageURL === typeSelect.value) {
                let pageTip = doc.querySelector('.page_tip1');
                if (pageTip) {
                    let match = pageTip.textContent.match(/当前\d+\/(\d+)页/);
                    if (match) {
                        totalPages = parseInt(match[1], 10);
                    }
                }
            }

            let novels = doc.querySelectorAll('a');

            let novelList = [];

            novels.forEach(novel => {
                console.log("✈",novel.href);

                let title = novel.innerText;
                let relativeLink = novel.getAttribute('href');
                // Make sure the link is an absolute URL
                let link = new URL(relativeLink, baseURL).href;
                if (link.includes('detail')) { // Filter out links containing 'detail'
                    novelList.push({ title, link });
                }
            });

            return { novelList, totalPages };
        } catch (error) {
            console.error('Error fetching novels:', error);
            return { novelList: [], totalPages: 1 };
        }
    }

    // Function to fetch novel content
    async function fetchNovelContent(url) {
        try {
            let response = await fetch(proxyURL + encodeURIComponent(url));
            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            // Assuming novel content is within a specific element, update this selector accordingly
            let content = doc.querySelector('.media');
            console.log(response);
            return content ? content.innerHTML : '<p>Content not found.</p>';
        } catch (error) {
            console.error('Error fetching novel content:', error);
            return '<p>Error loading content.</p>';
        }
    }

    // Function to get a random novel from the list
    function getRandomNovel(novelList) {
        let randomIndex = Math.floor(Math.random() * novelList.length);
        return novelList[randomIndex];
    }

    // Function to display a random novel
    async function displayRandomNovel() {
        let typeURL = typeSelect.value;
        let { totalPages } = await fetchNovels(typeURL);

        let randomPage = Math.floor(Math.random() * totalPages) + 1;
        let pageURL = typeURL.replace('.html', `-${randomPage}.html`);

        let { novelList } = await fetchNovels(pageURL);

        console.log(typeURL, pageURL,novelList);
        if (novelList.length > 0) {
            let randomNovel = getRandomNovel(novelList);
            let novelContent = await fetchNovelContent(randomNovel.link);
            modalContent.innerHTML = `<h1>${randomNovel.title}</h1>${novelContent}`;
        } else {
            modalContent.innerHTML = '<h1>No novels found</h1>';
        }
    }

    // Show modal on button click
    button.addEventListener('click', function() {
        modal.style.display = 'block';
        displayRandomNovel();
    });

    // Close modal on close button click
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal on click outside of modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Populate the type select box when the script is loaded
    populateTypeSelect();
})();