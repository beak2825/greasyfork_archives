// ==UserScript==
// @name         lolz thread exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  thread exporter
// @author       eIIiot
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*
// @match        https://zelenka.guru/threads/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523745/lolz%20thread%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/523745/lolz%20thread%20exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTextContent(selector, parent = document) {
        const element = parent.querySelector(selector);
        return element ? element.innerText.trim() : '';
    }

    function extractPostData() {
        const posts = [];
        document.querySelectorAll('li.message').forEach((message) => {
            const author = message.getAttribute('data-author') || '';
            const content = getTextContent('.messageContent .messageText', message);

            posts.push({
                author: author,
                content: content,
            });
        });
        return posts;
    }

    function downloadJSON(data, filename = 'topic.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    const topicTitle = getTextContent('h1[title]');
    const topicAuthor = getTextContent('.message:first-of-type .username');
    const posts = extractPostData();

    const data = {
        title: topicTitle,
        author: topicAuthor,
        posts: posts
    };

    const button = document.createElement('button');
    button.innerText = 'Export to JSON';
    button.style.marginRight = '10px';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#363636';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '6px';
    button.style.transition = 'background-color 0.8s ease';

    button.onmouseover = () => {
        button.style.backgroundColor = 'rgb(45, 45, 45)';
    };

    button.onmouseout = () => {
        button.style.backgroundColor = '#363636';
    };

    button.onclick = () => {
        downloadJSON(data);
    };

    const targetContainer = document.querySelector('.pageNavLinkGroup .linkGroup');
    if (targetContainer) {
        targetContainer.appendChild(button);
    }
})();
