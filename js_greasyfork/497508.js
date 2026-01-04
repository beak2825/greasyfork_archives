// ==UserScript==
// @name        鱼助手
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://www.ithome.com/*
// @match        https://www.ximalaya.com/*
// @match        https://www.xiaohongshu.com/*
// @match        https://chatgpt.com/*
// @match        https://greasyfork.org/*
// @match        https://www.google.com/*
// @match        https://tongyi.aliyun.com/*
// @match        https://docs.google.com/*
// @match        https://y.qq.com/*
// @match        https://google.com.hk/*
// @match        https://music.163.com/*
// @match        https://getquicker.net/*
// @match        https://beta.music.apple.com/*
// @match        https://sspai.com/*
// @match        https://mm.edrawsoft.cn/*
// @match        https://www.52pojie.cn/*
// @match        https://www.goofish.com/*
// @match        https://www.mjtt5.net/*
// @match        https://www.zhihu.com/*
// @match        https://soft.3dmgame.com/*
// @match        https://www.aliyun.com/*
// @match        https://dida365.com/*
// @match        https://www.taobao.com/*
// @match        https://www.notion.so/*
// @match        https://www.youtube.com/*
// @match        https://www.tongyi.com/*

// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/497508/%E9%B1%BC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/497508/%E9%B1%BC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // URL of Baidu's favicon
    var baiduFaviconUrl = 'https://www.baidu.com/favicon.ico';
    // Title to set for all websites
    var pageTitle = '百度一下';

    // Function to create a new link element for favicon
    function createFaviconLink(url, rel) {
        var link = document.createElement('link');
        link.rel = rel;
        link.href = url;
        document.head.appendChild(link);
    }

    // Function to replace the favicon
    function replaceFavicon(url) {
        var head = document.querySelector('head');
        if (!head) return;

        // Remove all existing favicon link elements
        var linkElements = head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
        linkElements.forEach(function(link) {
            head.removeChild(link);
        });

        // Create new favicon link elements
        createFaviconLink(url, 'icon');
        createFaviconLink(url, 'shortcut icon');
        createFaviconLink(url, 'apple-touch-icon');

        // Force browser to update favicon by creating a new link with a unique URL
        createFaviconLink(url + '?' + new Date().getTime(), 'icon');
    }

    // Function to set the title of the page
    function setPageTitle(title) {
        document.title = title;
    }

    // Ensure the document is fully loaded before replacing favicon and setting title
    function onDocumentReady() {
        replaceFavicon(baiduFaviconUrl);
        setPageTitle(pageTitle);

        // Reapply title and favicon every 5 seconds
        setInterval(function() {
            setPageTitle(pageTitle);
            replaceFavicon(baiduFaviconUrl);
        }, 5000);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        onDocumentReady();
    } else {
        document.addEventListener('DOMContentLoaded', onDocumentReady);
    }
})();