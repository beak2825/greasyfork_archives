// ==UserScript==
// @name         [马士兵]msb auto camouflage
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  msb auto camouflage
// @author       csyg
// @match        https://www.mashibing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mashibing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530073/%5B%E9%A9%AC%E5%A3%AB%E5%85%B5%5Dmsb%20auto%20camouflage.user.js
// @updateURL https://update.greasyfork.org/scripts/530073/%5B%E9%A9%AC%E5%A3%AB%E5%85%B5%5Dmsb%20auto%20camouflage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        faker();
    },1000);
    function faker() {
        // 假设新的favicon图标URL是'new-favicon.ico'
        var newFaviconUrl = 'https://img-ys011.didistatic.com/static/cooper_cn/ico-dbook.png';
        //var newFaviconUrl = 'file:///users/didi/downloads/wiki.ico';


        // 创建一个新的<link>元素
        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = newFaviconUrl;

        // 查找旧的favicon链接（如果有的话），并移除它
        // 注意：这里我们假设只有一个favicon链接，或者我们只关心第一个
        // 查找并删除所有rel="shortcut icon"的link元素
        var links = document.querySelectorAll('link[rel="shortcut icon"]');
        links.forEach(function(link) {
            link.remove();
        });
        // 查找并删除所有rel="shortcut icon"的link元素
        links= document.querySelectorAll('link[rel="icon"]');
        links.forEach(function(link) {
            link.remove();
        });

        // 将新的<link>元素添加到<head>部分
        var head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(link);

        // 注意：在有些情况下，浏览器可能不会立即显示新的favicon
        // 这取决于浏览器的缓存策略和实现细节

        removeName();
        var myhead = document.head || document.getElementsByTagName('head')[0];
        var title = document.createElement('title');
        title.textContent='知识库 - Cooper';
        myhead.appendChild(title);
    }
    function removeName() {
        var head = document.getElementsByTagName('head')[0];

        // 获取所有<title>标签
        var titles = head.getElementsByTagName('title');

        // 遍历<title>标签并删除
        for (var i = 0; i < titles.length; i++) {
            head.removeChild(titles[i]);
        }
    }
})();
