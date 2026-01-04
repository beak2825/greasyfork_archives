// ==UserScript==
// @name         豆瓣搜索Anna和Zlibrary
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在豆瓣读书页面添加搜索Anna和Zlibrary的按钮
// @author       [Briar](https://web.okjike.com/me)
// @match        https://book.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/478755/%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2Anna%E5%92%8CZlibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/478755/%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2Anna%E5%92%8CZlibrary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建搜索按钮函数
    function createSearchButton(buttonText, url) {

        const button = document.createElement("a");

        // 设置按钮样式
        button.style.display = "inline-block";
        button.style.color = "#fff !important";
        button.style.padding = "5px 10px";
        button.style.borderRadius = "3px";
        button.style.backgroundColor = "#e6f7ff";
        button.style.border = "none";
        button.style.textAlign = "center";

        button.href = "#";
        button.classList.add("j", "a_show_login", "colbutt", "ll");
        button.name = "pbtn-search-" + buttonText;
        button.rel = "nofollow";
        button.textContent = buttonText;

        button.addEventListener("click", function(event) {
          event.preventDefault();
          const bookName = document.querySelector("span[property='v:itemreviewed']").innerText;
          const searchUrl = `${url}${encodeURIComponent(bookName)}`;
          window.open(searchUrl, "_blank");
        });

        return button;
    }

    // 创建Anna按钮
    const searchAnnaButton = createSearchButton("A", "https://annas-archive.org/search?q=");

    // 创建Zlibrary按钮
    const searchZlibraryButton = createSearchButton("Z", "https://zlibrary-africa.se/s/");

    // 插入按钮
    const interestDiv = document.querySelector("#interest_sect_level.clearfix");
    if (interestDiv) {
        const lastChild = interestDiv.children[interestDiv.children.length - 1];
        interestDiv.insertBefore(searchAnnaButton, lastChild);
        interestDiv.insertBefore(searchZlibraryButton, lastChild);
    }
})();