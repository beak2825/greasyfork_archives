// ==UserScript==
// @name         QQ收藏链接重定向
// @namespace    QQ收藏重定向
// @version      0.5
// @description  将你引导至QQ收藏正确指向的链接
// @author       You
// @match       https://sharechain.qq.com/*
// @match       https://c.pc.qq.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/480117/QQ%E6%94%B6%E8%97%8F%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/480117/QQ%E6%94%B6%E8%97%8F%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前页面URL
    const currentURL = new URL(window.location.href);
    // 检查是否为c.pc.qq.com页面
    if (currentURL.hostname === 'c.pc.qq.com') {
        // 获取当前页面URL中的重定向后的链接
        const redirectedURL = new URLSearchParams(currentURL.search).get('url');
        if (redirectedURL) {
            // 重定向到正确的页面
            window.location.href = decodeURIComponent(redirectedURL);
        }
    }

    var redirectUrl = "mqq.weiyun";
    // 获取所有链接
    var links = document.getElementsByTagName('a');

    // 使用异步方式处理链接
    async function processLinks() {
        for (var i = 0; i < links.length; i++) {
            await processLink(links[i]);
        }
    }

    // 处理单个链接
    async function processLink(link) {
        // 检查链接是否包含重定向链接
        if (link.href.includes(redirectUrl)) {
            // 获取重定向链接中的url参数值
            var urlParam = new URL(link.href).searchParams.get("url");

            // 将链接替换为重定向链接中的url参数值
            link.href = decodeURIComponent(urlParam);
        }
    }

    // 调用异步处理链接的函数
    processLinks();

    // 添加监听器以检测网页内容变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 在每次变动后重新处理链接
            processLinks();
        });
    });

    // 配置并启动观察器
    var observerConfig = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, observerConfig);
})();