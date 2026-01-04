// ==UserScript==
// @name         妖火功能增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  其他人用户操作的管理按钮替换成感谢，对资源帖发送感谢分享；将Enter键替换为快速回复；点击帖子链接时在新窗口打开。
// @author       儒雅随和
// @match        *://yaohuo.me/bbs-*
// @match        *://www.yaohuo.me/bbs-*
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521088/%E5%A6%96%E7%81%AB%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521088/%E5%A6%96%E7%81%AB%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换按钮和发送感谢信息的功能
    window.reply = function (txt) {
        let domTextarea = document.querySelector("textarea");
        domTextarea.value = txt;
        let domInput = document.querySelectorAll("input");
        for (let iii = domInput.length - 1; iii > 0; iii--) {
            if (domInput[iii].value == "快速回复" || domInput[iii].value == "发表回复") {
                domInput[iii].click();
            }
        }
    }

    function replaceTextAndSend() {
        const thankYouMessages = ["感谢分享.", "谢谢分享.", "感谢分享", "谢谢分享", "感谢分享!", "谢谢分享!"];
        const louzhuxinxiDiv = document.querySelector('.louzhuxinxi.subtitle');
        if (louzhuxinxiDiv) {
            const managementButtons = louzhuxinxiDiv.querySelectorAll('a[href*="Book_View_admin"]');
            managementButtons.forEach(button => {
                button.href = "javascript:;";
                button.textContent = "感谢";
                button.onclick = function(event) {
                    event.preventDefault();
                    const randomIndex = Math.floor(Math.random() * thankYouMessages.length);
                    const message = thankYouMessages[randomIndex];
                    window.reply(message);
                };
            });
        }
    }

    function init() {
        const touserid = document.querySelector('input[name="touserid"]').value;
        const myuserid = document.querySelector('input[name="myuserid"]').value;
        if (touserid !== myuserid) {
            replaceTextAndSend();
        }
    }

    // 将 Enter 键替换为快速回复
    const BUTTON_VALUE = '快速回复';
    const buttons = document.querySelectorAll(`input[type="button"][value="${BUTTON_VALUE}"], input[type="submit"][value="${BUTTON_VALUE}"]`);
    if (buttons.length > 0) {
        const button = buttons[0];
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                button.click();
            }
        });
    }

    // 新窗口打开帖子链接
    var linkQueue = [];
    function addClickHandler(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!this.classList.contains('processed')) {
                this.classList.add('processed');
                window.open(this.href, '_blank');
                setTimeout(function() {
                    link.classList.remove('processed');
                }, 500);
            }
        });
    }

    function checkForNewPosts() {
        var postLinks = document.querySelectorAll('.topic-link:not(.processed)');
        for (var i = 0; i < postLinks.length; i++) {
            addClickHandler(postLinks[i]);
            linkQueue.push(postLinks[i]);
        }
    }

    window.addEventListener('scroll', function() {
        checkForNewPosts();
    });

    checkForNewPosts();

    setInterval(function() {
        if (linkQueue.length > 0) {
            var link = linkQueue.shift();
            addClickHandler(link);
        }
    }, 100);

    window.addEventListener('load', function() {
        var keyword = 'book_view_toVote';
        if (window.location.href.indexOf(keyword) !== -1) {
            window.history.back();
        }
    });

    // 执行初始化
    init();
})();
