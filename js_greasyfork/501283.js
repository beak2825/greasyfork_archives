// ==UserScript==
// @name         Jump to Anna's Archive From Z-Library
// @namespace    http://tampermonkey.net/
// @version      20241111.2
// @description  Jump to Anna's Archive From Z-Library's book information page
// @author       lefty
// @match       https://*.z-lib.gs/*
// @match       https://z-lib.gs/*
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
    let btn = document.createElement("button");
    btn.innerHTML = "Anna's Archive";
    btn.onclick = function () {
        window.open(anna_url, '_blank');
    };

    let paperback_button = document.querySelector('.btn.btn-default.dropdown-toggle.button-paperback');

    // 创建包含类名 "book-details-button" 的 div 元素
    let bookDetailsButtonDiv = document.createElement('div');
    bookDetailsButtonDiv.className = 'book-details-button';

    // 创建包含类名 "btn-group" 的子 div 元素
    let btnGroupDiv = document.createElement('div');
    btnGroupDiv.className = 'btn-group';

    // 创建包含类名 "btn btn-default dropdown-toggle button-anna" 的 button 元素，并设置其文本内容
    let buttonElement = document.createElement('button');
    buttonElement.type = 'button';
    buttonElement.className = 'btn btn-default dropdown-toggle button-paperback';
    buttonElement.textContent = "Anna's Archive";
    buttonElement.onclick = function () {
        window.open(anna_url, '_blank');
    };

    // 将 button 元素添加到 btn-group div 元素
    btnGroupDiv.appendChild(buttonElement);

    // 将 btn-group div 元素添加到 book-details-button div 元素
    bookDetailsButtonDiv.appendChild(btnGroupDiv);
    let paperbackDetailsButtonDiv = paperback_button.parentElement.parentElement;
    paperbackDetailsButtonDiv.parentElement.insertBefore(bookDetailsButtonDiv,paperbackDetailsButtonDiv.nextSibling);
    // Your code here...
})();