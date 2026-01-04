// ==UserScript==
// @name         3939 fix discord image url
// @namespace    https://greasyfork.org
// @version      0.0.3
// @description  修正來自 discord 網址的問題
// @author       Pixmi
// @icon         http://www.google.com/s2/favicons?domain=https://y3939.net/
// @include      https://y3939.net/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421492/3939%20fix%20discord%20image%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/421492/3939%20fix%20discord%20image%20url.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const observeConfig = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    };

    const disImageRegex = /https\:\/\/images\-ext\-[\d]\.discordapp\.net\/external\/[\w\-\_]+\/https\/(pbs\.twimg\.com\/media\/[\w\-\_]+\.(?:png|jpg|jpeg|gif))/i;
    const chat = document.querySelector('#msg_table');
    const gallery = document.querySelector('#photo_table');

    // 回應function
    function DiceRespond(content) {
        // 輸入框放入BOT內容
        document.getElementById('msg').value = content;
        // 點擊發送按鈕送出訊息
        document.getElementById("btn_send").click();
    }

    function Observer() {
        // 建立rootObserver監控
        let rootObserver = new MutationObserver(function () {
            // 設定要監控的元素
            let chatElement = document.body.querySelector('#msg_table');
            // 確認chatElement已經生成
            if (chatElement) {
                // 結束rootObserver監控
                rootObserver.disconnect();

                // 建立chatObserver監控聊天頻道
                let chatObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        // 有新的發言近來
                        if (mutation.type == 'childList' && mutation.addedNodes[0].classList[0] === 'msg_line') {
                            let link = mutation.addedNodes[0].querySelector('.msg_text a') || false;
                            if (link && disImageRegex.test(link.href)) {
                                let orgUrl = String(link.href);
                                let match = disImageRegex.exec(orgUrl);
                                let fixUrl = `https://${match[1]}?name=orig`;
                                let fixText;
                                if (fixUrl.length > 28) {
                                    fixText = `${fixUrl.substring(0, 22)}.....${fixUrl.substring(fixUrl.length - 8, fixUrl.length)}`;
                                } else {
                                    fixText = fixUrl;
                                }
                                mutation.addedNodes[0].querySelector('.msg_text a').href = fixUrl;
                                mutation.addedNodes[0].querySelector('.msg_text a').textContent = fixText;
                                gallery.querySelectorAll('img.photo_img').forEach(img => {
                                    if (img.src == orgUrl) img.src = fixUrl;
                                });
                            }
                            if (link && /width=[\d]+\&height=[\d]+/i.test(link.href)) {
                                let orgUrl = String(link.href);
                                let fixUrl = orgUrl.replace(/width=[\d]+\&height=[\d]+/i, '');
                                let fixText;
                                if (fixUrl.length > 28) {
                                    fixText = `${fixUrl.substring(0, 22)}.....${fixUrl.substring(fixUrl.length - 8, fixUrl.length)}`;
                                } else {
                                    fixText = fixUrl;
                                }
                                mutation.addedNodes[0].querySelector('.msg_text a').href = fixUrl;
                                mutation.addedNodes[0].querySelector('.msg_text a').textContent = fixText;
                                gallery.querySelectorAll('img.photo_img').forEach(img => {
                                    if (img.src == orgUrl) img.src = fixUrl;
                                });
                            }
                        }
                    });
                });
                chatObserver.observe(chatElement, observeConfig);
            }
        });
        rootObserver.observe(document, observeConfig);
    }

    setTimeout(function () {
        chat.querySelectorAll('a').forEach(link => {
            if (disImageRegex.test(link.href)) {
                let match = disImageRegex.exec(link.href);
                let fixUrl = `https://${match[1]}?name=orig`;
                let fixText;
                if (fixUrl.length > 28) {
                    fixText = `${fixUrl.substring(0, 22)}.....${fixUrl.substring(fixUrl.length - 8, fixUrl.length)}`;
                } else {
                    fixText = fixUrl;
                }
                link.href = fixUrl;
                link.textContent = fixText;
            }
        });
        gallery.querySelectorAll('img.photo_img').forEach(img => {
            if (disImageRegex.test(img.src)) {
                let match = disImageRegex.exec(img.src);
                let fixUrl = `https://${match[1]}?name=orig`;
                img.src = fixUrl;
            }
        });
        // 執行聊天室觀測
        Observer();
    }, 2000);
})();