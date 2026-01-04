// ==UserScript==
// @name         WNACG Search Box
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a search box to WNACG
// @license MIT
// @author       scbmark
// @icon         https://wnacg.com/favicon.ico
// @match        https://wnacg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510543/WNACG%20Search%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/510543/WNACG%20Search%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 建立搜索框元素
    const searchBox = document.createElement('div');
    searchBox.id = 'q-input';
    searchBox.className = 'input-append';

    // 建立輸入框
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '搜索...';

    // 建立搜索按鈕
    const button = document.createElement('button');
    button.textContent = '搜索';
    button.onclick = function() {
        const searchTerm = input.value;
        window.location.href = `https://wnacg.com/search?q=${encodeURIComponent(searchTerm)}`;
    };

    // 將輸入框和按鈕加到搜索框中
    searchBox.appendChild(input);
    searchBox.appendChild(button);

    const tabs = document.getElementById('tabs');
    if (tabs) {
        tabs.insertAdjacentElement('afterend', searchBox);
    }

    const loginElement = document.getElementById('settings_person');
    if (loginElement) {
        loginElement.remove()
    }
})();
