// ==UserScript==
// @name         MessageCount_by_STaYsON
// @namespace    MessageCount_by_STaYsON
// @version      1.0
// @description  MessageCount
// @author       STaYsON (+ el9in)
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='11.5' height='11.5' stroke='rgb(140,140,140)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E
// @grant        unsafeWindow
// @license      el9in + STaYsON
// @downloadURL https://update.greasyfork.org/scripts/467998/MessageCount_by_STaYsON.user.js
// @updateURL https://update.greasyfork.org/scripts/467998/MessageCount_by_STaYsON.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function init() {
        await sleep(1000);
        const firstItem = document.querySelector('.messageInfo');
        if (firstItem) {
            const authorElement = document.querySelector('.item.as--class.author');
            if (authorElement) {
                const href = firstItem.querySelector('a.username').getAttribute('href');
                const messageCount = await getMessageCount(`https://zelenka.guru/${href}`);
                const newElement = document.createElement('span');
                newElement.classList.add('item', 'as--class', 'author');
                newElement.style.marginLeft = '0px';

                const icon = document.createElement('i');
                icon.classList.add('icon', 'postCounterIcon');
                icon.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='2 -3 43 47' width='11.5' height='11.5' stroke='rgb(140,140,140)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E")`;
                icon.style.width = '11.5px';
                icon.style.height = '11.5px';
                newElement.appendChild(icon);

                const countText = document.createElement('span');
                countText.textContent = messageCount;
                newElement.appendChild(countText);

                authorElement.parentNode.insertBefore(newElement, authorElement.nextSibling);
            }
        }
    }
    async function getMessageCount(url) {
        try {
            await sleep(1000);
            const response = await fetch(url);
            const data = await response.text();
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const element = htmlDoc.querySelector('a[href*="search?users="][href*="&content=post"] .count');
            if (element) return element.textContent;
        } catch (error) {
            return "0";
        }
    }
    init();
})();
