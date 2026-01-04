// ==UserScript==
// @name         检测图哥防止尴尬-过早客
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  访问过早客论坛时，在当前页面中检测图哥是否回帖。自动模糊图哥回复中的图片，并进行提示，防止尴尬。
// @author       patr1ck
// @match        https://www.guozaoke.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=guozaoke.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500417/%E6%A3%80%E6%B5%8B%E5%9B%BE%E5%93%A5%E9%98%B2%E6%AD%A2%E5%B0%B4%E5%B0%AC-%E8%BF%87%E6%97%A9%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/500417/%E6%A3%80%E6%B5%8B%E5%9B%BE%E5%93%A5%E9%98%B2%E6%AD%A2%E5%B0%B4%E5%B0%AC-%E8%BF%87%E6%97%A9%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 显示通知
    function showNotification() {
        var notification = document.createElement('div');
        notification.id = 'custom-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#ED5349';
        notification.style.color = '#fff';
        notification.style.padding = '30px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = 10000;
        notification.style.fontSize = '32px';
        notification.style.fontWeight = 'bold';
        notification.style.animation = 'shake 0.5s infinite';
        notification.innerText = '图哥出没🫣';

        document.body.appendChild(notification);

        setTimeout(function() {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2500);
    }

    // 添加CSS动画样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
    `;
    document.head.appendChild(style);

    // 检查用户并模糊图片
    function checkUser() {
        var usernames = document.querySelectorAll('span.username');
        usernames.forEach(function(username) {
            if (username.innerText === 'abc_11') {
                var replyItem = username.closest('.reply-item');
                if (replyItem) {
                    var content = replyItem.querySelector('span.content');
                    if (content) {
                        var imgs = content.querySelectorAll('img');
                        if (imgs.length > 0) {
                            showNotification();
                            imgs.forEach(function(img) {
                                var link = img.closest('a');
                                img.style.filter = 'blur(18px)';
                                img.style.transition = 'filter 0.25s';

                                // 点击链接或图片时取消模糊
                                if (link) {
                                    link.addEventListener('click', function(e) {
                                        if (img.style.filter !== 'none') {
                                            e.preventDefault();
                                            img.style.filter = 'none';
                                        }
                                    });
                                } else {
                                    img.addEventListener('click', function() {
                                        if (img.style.filter !== 'none') {
                                            img.style.filter = 'none';
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            }
        });
    }

    // 页面可见时
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            checkUser();
        }
    });

    // 初始加载时
    if (document.visibilityState === 'visible') {
        checkUser();
    }
})();
