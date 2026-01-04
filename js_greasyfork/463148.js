// ==UserScript==
// @name         闲鱼适配电脑网页
// @namespace    http://tampermonkey/goofish-to-taobao
// @version      1.0.1
// @author       ChatGPT and me
// @license      MIT
// @description  解决在电脑网页端打开闲鱼链接时不能完全显示的问题，访问移动版闲鱼页面时会自动帮你跳转到对应的淘宝页面，更加方便查看信息。
// @match        https://h5.m.goofish.com/*
// @grant        none
// @icon         https://img.alicdn.com/tps/i3/TB1eW1eGXXXXXXAXFXXBS8UGFXX-41-22.png

// @downloadURL https://update.greasyfork.org/scripts/463148/%E9%97%B2%E9%B1%BC%E9%80%82%E9%85%8D%E7%94%B5%E8%84%91%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/463148/%E9%97%B2%E9%B1%BC%E9%80%82%E9%85%8D%E7%94%B5%E8%84%91%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href; // get the current URL
    const regex = /https:\/\/h5\.m\.goofish\.com\/item\?id=(\d+)/; // regex pattern to match the Goofish link
    const match = regex.exec(currentUrl); // search for the Goofish link using regex

    if (match !== null) {
        const itemId = match[1]; // get the item ID number from the regex match
        const newUrl = `https://item.taobao.com/item.htm?id=${itemId}`; // create the new Taobao URL
        window.location.href = newUrl; // redirect to the new Taobao URL
    }
})();