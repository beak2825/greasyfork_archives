// ==UserScript==
// @name         bLUE Mentions
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mention users by @-tagging them on the bLUE Websight
// @author       Account Insurance
// @match        https://*.websight.blue/thread/*
// @license      GNU General Public License, version 2
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/473897/bLUE%20Mentions.user.js
// @updateURL https://update.greasyfork.org/scripts/473897/bLUE%20Mentions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let suggestionBox;
    let currentIndex = -1;

    const CURRENT_USER = Array.from(document.querySelectorAll('a'))
        .find(a => /^\/profile\/.+/.test(a.getAttribute('href')))
        .textContent;

    function createSuggestionBox() {
        suggestionBox = document.createElement('div');
        suggestionBox.style.position = 'absolute';
        suggestionBox.style.zIndex = '1000';
        suggestionBox.style.border = '1px solid #ccc';
        suggestionBox.style.backgroundColor = '#fff';
        suggestionBox.style.width = '200px';
        suggestionBox.style.maxHeight = '200px';
        suggestionBox.style.overflowY = 'auto';
        document.body.appendChild(suggestionBox);
    }

    const getSuggestions = throttle(query => getUsers(query.slice(1)), 250);

    function throttle(func, delay) {
        let lastExecution = Date.now() - delay;

        return function(...args) {
            const now = Date.now();

            if (now - lastExecution >= delay) {
                lastExecution = now;
                return func(...args);
            }
        };
    }


    async function updateSuggestions(query) {
        const results = await getSuggestions(query);
        suggestionBox.innerHTML = '';
        results?.forEach((user, index) => {
            const entry = document.createElement('div');
            entry.textContent = user.username;
            entry.addEventListener('mousedown', () => {
                event.stopPropagation();
                const textarea = document.getElementById('reply-content');
                const value = textarea.value;
                textarea.value = value.replace(/@[^ ]*$/, '@' + user.id.replace(/%20/g, '+'));
                suggestionBox.style.display = 'none';
            });
            entry.addEventListener('mouseover', () => {
                currentIndex = index;
                highlightEntry(index);
            });
            suggestionBox.appendChild(entry);
        });
    }

    function highlightEntry(index) {
        const children = Array.from(suggestionBox.children);
        children.forEach((child, idx) => {
            if (idx === index) {
                child.style.backgroundColor = '#e0e0e0';
            } else {
                child.style.backgroundColor = '';
            }
        });
    }

    function initListeners() {
        const textarea = document.getElementById('reply-content');
        textarea.addEventListener('keyup', async (event) => {
            const match = event.target.value.match(/@[^ ]*$/);
            if (match) {
                if (![13, 27, 38, 40].includes(event.keyCode)) {
                    suggestionBox.style.display = 'block';
                    const coords = textarea.getBoundingClientRect();
                    suggestionBox.style.left = (coords.left + window.scrollX) + 'px';
                    suggestionBox.style.top = (coords.top - suggestionBox.offsetHeight + window.scrollY) + 'px';
                    await updateSuggestions(match[0]);
                }
            } else {
                suggestionBox.style.display = 'none';
            }

            if (suggestionBox.childElementCount > 0) { // Check if the suggestions box has child elements
                if (event.keyCode === 38 || event.keyCode === 40) { // arrow up or down
                    event.preventDefault(); // Prevent default behavior
                    event.stopPropagation(); // Prevent default behavior

                    const total = suggestionBox.children.length;
                    if (event.keyCode === 38) { // arrow up
                        currentIndex = currentIndex <= 0 ? 0 : (currentIndex - 1 + total) % total;
                    } else { // arrow down
                        currentIndex = (currentIndex + 1) % total;
                    }
                    highlightEntry(currentIndex);
                } else if (event.keyCode === 13) { // enter
                    event.preventDefault(); // Prevent default behavior
                    event.stopPropagation(); // Prevent default behavior

                    const userElement = suggestionBox.children[currentIndex];
                    const mousedownEvent = new MouseEvent('mousedown');
                    userElement.dispatchEvent(mousedownEvent);
                }
            }

            if (event.keyCode === 27) { // escape
                suggestionBox.style.display = 'none';
                suggestionBox.children[currentIndex].style.backgroundColor = "#fff";
                currentIndex = -1
            }
        }, true);

        textarea.addEventListener('blur', () => {
            suggestionBox.style.display = 'none';
            suggestionBox.children[currentIndex].style.backgroundColor = "#fff";
            currentIndex = -1
        });
    }

    async function post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString()
        });
        return response.text();
    }

    function extractMentions(text) {
        const mentionRegex = /@([a-zA-Z0-9%20+]+)/g;
        const mentions = [];
        let match;
        while ((match = mentionRegex.exec(text)) !== null) {
            mentions.push(match[1]);
        }
        return mentions;
    }

    const form = document.getElementById('reply-form');
    form.addEventListener('submit', async (event) => {
        const messageContent = document.getElementById('reply-content').value;
        const mentions = extractMentions(messageContent);

        if (mentions.length) {
            event.preventDefault();
            event.stopPropagation();

            // Manually submit form
            const formData = new FormData(form);
            const response = await fetch(`${form.action}?ajax=1`, {
                method: 'POST',
                body: formData
            });
            document.getElementById('reply-content').value = '';
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const messageId = doc.querySelector('.message-container.post.own-post').id;
            const url = new URL(window.location.href);

            const msgNumber = parseInt(messageId.replace('msg-', ''));

            const startRange = Math.floor((msgNumber - 1) / 50) * 50 + 1;
            const endRange = startRange + 49;

            const pathParts = url.pathname.split('/');
            pathParts[pathParts.length - 1] = `${startRange}-${endRange}`;
            url.pathname = pathParts.join('/');

            // Update the hash.
            url.hash = messageId;

            const redirectURL = url.toString();


            const topicTitle = document.querySelector("h1").querySelector("span").textContent.trim();
            const truncatedTitle = topicTitle.length > 30 ? topicTitle.substring(0, 30) + '...' : topicTitle;

            for (const mention of mentions) {
                const postData = {
                    "to-zone": window.location.hostname.split('.')[0],
                    "to-id": mention,
                    "thread-title": `Tagged by ${CURRENT_USER} in "${truncatedTitle}"`,
                    "thread-tags": "tags",
                    "thread-content": `*${CURRENT_USER} tagged you in [this topic](${redirectURL}).*\n\nThis is an automatically generated message.`
                };

                await post('/pm', postData);
            }
        }
    }, true);

    async function getUsers(value) {
        const response = await fetch(`/users/?q=${encodeURIComponent(value)}`, {
            method: 'GET',
            credentials: 'include'
        })
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return parseHTMLContent(doc);
    }

    function parseHTMLContent(document) {
        const users = [];

        const messageTops = document.querySelectorAll('.message-top');
        const messageBodies = document.querySelectorAll('.message-body');

        for (let i = 0; i < messageTops.length; i++) {
            let user = {};

            const anchorElement = messageTops[i].querySelector('a');
            user.username = anchorElement.textContent;
            user.id = new URL(anchorElement.href).pathname.split('/').pop();
            users.push(user);
        }

        return users;
    }


    function init() {
        createSuggestionBox();
        initListeners();
    }

    init();

})();