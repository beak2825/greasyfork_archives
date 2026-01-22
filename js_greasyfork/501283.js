// ==UserScript==
// @name         Jump to Anna's Archive From Z-Library
// @namespace    http://tampermonkey.net/
// @version      20260121
// @description  Jump to Anna's Archive From Z-Library's book information page
// @author       lefty
// @match       https://*.z-lib.gs/*
// @match       https://z-lib.gs/*
// @match       https://*.z-lib.gd/*
// @match       https://z-lib.gd/*
// @match       https://z-library.sk/*
// @match       https://*.z-library.sk/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=1lib.sk
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501283/Jump%20to%20Anna%27s%20Archive%20From%20Z-Library.user.js
// @updateURL https://update.greasyfork.org/scripts/501283/Jump%20to%20Anna%27s%20Archive%20From%20Z-Library.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let path = window.location.pathname;
    let match = path.match(/\/book\/(\d+)\//);
    let zlib_id;

    if (match) {
        zlib_id = match[1];
        console.log(zlib_id); // 输出 1130240
    } else {
        console.log('No match found');
    }

    let anna_url = "https://annas-archive.li/search?q=%22zlib:" + zlib_id + "%22";

    // 查找书名元素
    let bookTitleElement = document.querySelector('.book-title');

    if (bookTitleElement) {
        // 创建链接元素
        let annaLink = document.createElement('a');
        annaLink.href = anna_url;
        annaLink.className = 'color1';
        annaLink.textContent = ' -> Anna\'s Archive';
        annaLink.target = '_blank'; // 在新标签页中打开链接

        // 将链接添加到书名元素后面
        bookTitleElement.appendChild(annaLink);
    } else {
        console.log('Book title element not found');
    }
})();
