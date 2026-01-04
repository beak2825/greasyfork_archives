// ==UserScript==
// @name         哔哩漫画一键搜索
// @namespace    https://www.mangacopy.com/
// @version      0.1
// @description  在哔哩漫画的任意一部漫画的详情页，左侧添加有一键搜索按钮，跳转到拷贝漫画进行搜索，
// @author       zy668
// @match        https://manga.bilibili.com/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangacopy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475856/%E5%93%94%E5%93%A9%E6%BC%AB%E7%94%BB%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475856/%E5%93%94%E5%93%A9%E6%BC%AB%E7%94%BB%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSearchButton() {
        const titleText = document.querySelector("head > title").innerText;
        const mangaName = titleText.replace(" - 漫画全集在线观看 - 哔哩哔哩漫画", "");

        let but = document.createElement("button");
        but.innerText = "一键搜索";
        but.style.cursor = "pointer";
        but.style.position="absolute";
        but.style.left="10px";
        but.style.top="100px";
        but.addEventListener("click", function () {
            let url = "https://www.mangacopy.com/search?q=" + encodeURIComponent(mangaName) + "&q_type=";
            console.log(mangaName);
            window.open(url, '_blank');
        });
        document.body.insertBefore(but, document.body.firstChild);
    }

    setTimeout(addSearchButton, 1000);

})();