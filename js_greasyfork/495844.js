// ==UserScript==
// @name         允许/禁止跳转到外部站点
// @namespace    https://greasyfork.org/zh-CN/users/1305708-ayours
// @version      2.4
// @description  默认允许从当前网页跳转到外部站点，点击按钮后开始拦截，7秒后自动隐藏(点击按钮后重置隐藏时间)，页面刷新后重置。可用于阅读漫画、小说时拦截跳转到广告
// @author       AYour
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495844/%E5%85%81%E8%AE%B8%E7%A6%81%E6%AD%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%A4%96%E9%83%A8%E7%AB%99%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/495844/%E5%85%81%E8%AE%B8%E7%A6%81%E6%AD%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%A4%96%E9%83%A8%E7%AB%99%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockExternalLinks = false;
    let button;
    let hideButtonTimeout;
    let confirmTimeout;

    function createButton() {
        if (button) {
            clearTimeout(hideButtonTimeout);
            button.remove();
        }
        button = document.createElement('button');
        button.id = 'block-external-links-btn';
        button.style.position = 'fixed';
        button.style.bottom = '50px';
        button.style.right = '20px';
        button.style.zIndex = '20000';
        button.textContent = '允许外部链接';
        document.body.appendChild(button);

        button.addEventListener('click', toggleBlockExternalLinks);

        hideButtonTimeout = setTimeout(hideButton, 7000);
    }

    function toggleBlockExternalLinks() {
        blockExternalLinks = !blockExternalLinks;
        button.textContent = blockExternalLinks ? '禁止外部链接' : '允许外部链接';
        clearTimeout(hideButtonTimeout);
        hideButtonTimeout = setTimeout(hideButton, 7000);
    }

    function hideButton() {
        button.style.display = 'none';
    }

    function initialize() {
        createButton();
        document.addEventListener('click', checkExternalLinks);
    }

    function checkExternalLinks(event) {
        var target = event.target;
        while (target != null) {
            if (target.tagName === 'A') {
                var url = new URL(target.href);
                var currentUrl = new URL(window.location.href);
                if (blockExternalLinks && url.origin !== currentUrl.origin) {
                    event.preventDefault();
                    // 自定义确认对话框
                    customConfirm('您确定不跳转到外部链接吗？', function(result) {
                        if (result) {
                            clearTimeout(confirmTimeout);
                        } else {
                            blockExternalLinks = false;
                            button.textContent = '允许外部链接';
                        }
                    });
                    break;
                }
            }
            target = target.parentElement;
        }
    }

    // 自定义确认对话框
    function customConfirm(message, callback) {
        // 创建一个自定义对话框
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '10px';
        dialog.style.border = '1px solid #ccc';
        dialog.textContent = message;

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '不跳转';
        confirmButton.addEventListener('click', function() {
            document.body.removeChild(dialog);
            callback(true);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '要跳转';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(dialog);
            callback(false);
        });

        dialog.appendChild(confirmButton);
        dialog.appendChild(cancelButton);
        document.body.appendChild(dialog);

        // 设置一个2秒的超时，如果用户不点击，则自动选择“不跳转”
        confirmTimeout = setTimeout(function() {
            document.body.removeChild(dialog);
            callback(true);
        }, 2000);
    }

    window.addEventListener('beforeunload', function() {
        blockExternalLinks = false;
        if (button) {
            button.remove();
        }
    });

    initialize();
})();
