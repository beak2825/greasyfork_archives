// ==UserScript==
// @name         5ch Donguri Button Adder (Mobile)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add donguri system buttons to 5ch (Mobile version)
// @match        https://itest.5ch.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493349/5ch%20Donguri%20Button%20Adder%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493349/5ch%20Donguri%20Button%20Adder%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日時を抽出する関数
    function extractDateTime(text) {
        const dateTimeRegex = /\d{4}\/\d{2}\/\d{2}\(.\) \d{2}:\d{2}:\d{2}\.\d{2}/;
        const match = text.match(dateTimeRegex);
        return match ? match[0] : '';
    }

    // 新しい投稿を監視し、ボタンを追加する関数
    function observeNewPosts(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const newPosts = mutation.addedNodes;
                newPosts.forEach(post => {
                    if (post.nodeType === Node.ELEMENT_NODE && post.classList.contains('threadview_response-list')) {
                        addButtons(post);
                    }
                });
            }
        }
    }

    // 投稿にボタンを追加する関数
    function addButtons(post) {
        if (post.querySelector('.confirm-button')) return;

        // confirmボタンを作成
        const buttonConfirm = createButton('confirm', 'https://donguri.5ch.net/confirm');

        // fireボタンを作成
        const buttonFire = createButton('fire', 'https://donguri.5ch.net/fire');

        // ボタンを投稿に追加
        post.appendChild(buttonConfirm);
        post.appendChild(buttonFire);
    }

    // ボタンを作成する関数
    function createButton(text, baseUrl) {
        const button = document.createElement('button');
        button.classList.add(`${text}-button`);
        button.textContent = text;
        button.style.marginLeft = '5px';
        button.style.width = '50px';
        button.style.fontSize = '10px';
        button.style.padding = '5px';
        button.style.lineHeight = '1.2';
        button.addEventListener('click', function() {
            const url = window.location.href.replace(/https:\/\/itest\.5ch\.net\/.*\/test\//, "https://itest.5ch.net/test/");
            const date = extractDateTime(this.closest('.threadview_response-list').querySelector('.threadview_response_info').textContent);
            const encodedUrl = encodeURIComponent(url);
            const encodedDate = encodeURIComponent(date);
            const requestUrl = `${baseUrl}?url=${encodedUrl}&date=${encodedDate}`;
            window.open(requestUrl, '_blank');
        });
        return button;
    }

    // 既存の投稿にボタンを追加
    const posts = document.querySelectorAll('.threadview_response-list');
    posts.forEach(addButtons);

    // 新しい投稿を監視し、ボタンを追加
    const observer = new MutationObserver(observeNewPosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();