// ==UserScript==
// @name         福利吧 最新浏览 自动签到 高亮热帖
// @namespace http://your-namespace.com
// @version      3.1
// @description  修改最新发帖顺序浏览 自动签到 高亮热贴
// @author       Ella Maietta
// @match        https://www.wnflb2023.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443686/%E7%A6%8F%E5%88%A9%E5%90%A7%20%E6%9C%80%E6%96%B0%E6%B5%8F%E8%A7%88%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%E9%AB%98%E4%BA%AE%E7%83%AD%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443686/%E7%A6%8F%E5%88%A9%E5%90%A7%20%E6%9C%80%E6%96%B0%E6%B5%8F%E8%A7%88%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%E9%AB%98%E4%BA%AE%E7%83%AD%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 签到功能，仅在论坛主页执行
    function autoSignIn() {
        if (window.location.href.indexOf('forum.php') > -1) {
            var signInButton = document.getElementById('fx_checkin_topb');
            var signInStatus = signInButton ? signInButton.querySelector('img').alt : '';

            if (signInButton && signInStatus !== '已签到') {
                console.log('签到按钮可见且未签到，尝试签到...');
                signInButton.click();
                console.log('签到尝试完成。');
            } else if (signInStatus === '已签到') {
                console.log('已经签到，不进行操作。');
            } else {
                console.log('未找到签到按钮，可能页面尚未完全加载或已签到。');
            }
        }
    }

    // 重定向功能，仅在帖子浏览页面执行
    function redirectToSortedView() {
        var match = window.location.href.match(/forum-(\d+)-\d+\.html/);
        if (match && match[1]) {
            var newUrl = `https://www.wnflb2023.com/forum.php?mod=forumdisplay&fid=${match[1]}&filter=author&orderby=dateline`;
            if (window.location.href !== newUrl) {
                window.location.replace(newUrl);
            }
        }
    }

    // 根据热度值改变标题颜色
    function changeTitleColor() {
        document.querySelectorAll('img[title^="热度"]').forEach(function(img) {
            const threadElement = img.closest('tbody');
            if (threadElement) {
                const titleElement = threadElement.querySelector('a.xst');
                if (titleElement) {
                    titleElement.style.color = 'red';
                }
            }
        });
    }

    // 创建一个 MutationObserver 来响应动态加载的内容
    function setupMutationObserver() {
        const targetNode = document.querySelector('#threadlist'); // 假设帖子列表的容器具有ID 'threadlist'
        if (!targetNode) {
            return;
        }

        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    changeTitleColor(); // 当检测到子元素变化时，重新检查并修改标题颜色
                }
            }
        });

        observer.observe(targetNode, config);
    }

    // 根据页面类型执行相应功能
    if (window.location.href.includes('forum-')) {
        redirectToSortedView();
    } else {
        window.addEventListener('DOMContentLoaded', function() {
            autoSignIn();
            changeTitleColor();
            setupMutationObserver();
        });
    }
})();
