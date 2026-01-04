// ==UserScript==
// @name         Deposit_In_Threads_by_el9in
// @namespace    Deposit_In_Threads_by_el9in
// @version      0.1
// @description  Deposit In Threads
// @author       el9in
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466848/Deposit_In_Threads_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466848/Deposit_In_Threads_by_el9in.meta.js
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
                const deposit = await getDeposit(`https://zelenka.guru/${href}`);
                const newElement = document.createElement('span');
                newElement.classList.add('item', 'as--class', 'author');
                newElement.style.marginLeft = '0px';
                newElement.textContent = deposit;
                authorElement.parentNode.insertBefore(newElement, authorElement.nextSibling);
            }
        }
    }
    async function getDeposit(url) {
        try {
            await sleep(1000);
            const response = await fetch(url);
            const data = await response.text();
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const element = htmlDoc.querySelector('.amount');
            if (element) return element.textContent;
        } catch (error) {
            return "0 ₽";
        }
    }
    init();
})();