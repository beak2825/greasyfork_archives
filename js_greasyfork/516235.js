// ==UserScript==
// @name         豆瓣电子资源助手 - ZLibrary、Anna Archive、XMU 图书馆
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动在豆瓣的书籍页面添加多个电子资源网站入口，支持 ZLibrary、Anna Archive、XMU 图书馆等。
// @match        https://book.douban.com/*
// @grant        none
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/516235/%E8%B1%86%E7%93%A3%E7%94%B5%E5%AD%90%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B%20-%20ZLibrary%E3%80%81Anna%20Archive%E3%80%81XMU%20%E5%9B%BE%E4%B9%A6%E9%A6%86.user.js
// @updateURL https://update.greasyfork.org/scripts/516235/%E8%B1%86%E7%93%A3%E7%94%B5%E5%AD%90%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B%20-%20ZLibrary%E3%80%81Anna%20Archive%E3%80%81XMU%20%E5%9B%BE%E4%B9%A6%E9%A6%86.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 定义一个包含多个 ZLibrary 网站名称和对应 URL 的词典
    const hosts = {
        "ZLib": "https://z-library.sk/s/",
        "Anna": "https://annas-archive.org/search?q=",
        "XMU": "https://catalog.xmu.edu.cn/opac/search_adv.php#/index?sType0=any&q0=",
    };

    // 为每个书目项添加多个 ZLibrary 按钮
    function addZLibraryButtons(subjectItem) {
        // 获取书名链接
        const bookLink = subjectItem.closest('.info').querySelector('h2 a');
        const bookTitle = bookLink ? bookLink.getAttribute('title') : '未知书名';

        // 遍历 hosts 词典，为每个网址生成对应的按钮
        Object.keys(hosts).forEach(hostName => {
            const zlibButton = document.createElement("a");
            zlibButton.textContent = hostName; // 使用网站名称作为按钮文本
            zlibButton.style.marginLeft = '10px';
            zlibButton.style.padding = '0 10px';
            zlibButton.style.color = 'rgb(114, 171, 213)';
            zlibButton.className = "zlib-btn";

            // 为按钮添加点击事件，使用对应的 URL
            zlibButton.addEventListener("click", function() {
                const url = `${hosts[hostName]}${encodeURIComponent(bookTitle)}`;
                window.open(url, "_blank");
            });

            // 将按钮添加到当前的 subject-item
            subjectItem.appendChild(zlibButton);
        });
    }

    // 遍历所有的 subject-item，添加按钮

    let insertDuiXiang = document.querySelectorAll(".subject-item .ft .cart-actions");
    insertDuiXiang.forEach(subjectItem => {
        subjectItem.style.display = 'flex';
        addZLibraryButtons(subjectItem);
    });




    const interestDiv = document.querySelector("#interest_sect_level.clearfix");
    if (interestDiv) {
        const lastChild = interestDiv.children[interestDiv.children.length - 1];
        const bookLink = interestDiv.closest('#wrapper').querySelector('h1 span');
        const bookTitle = bookLink ? bookLink.textContent : '未知书名';

        // 遍历 hosts 词典，为每个网址生成对应的按钮
        Object.keys(hosts).forEach(hostName => {
            const zlibButton = document.createElement("a");
            zlibButton.textContent = hostName; // 使用网站名称作为按钮文本
            zlibButton.style.marginLeft = '10px';
            zlibButton.style.padding = '0 10px';
            zlibButton.style.color = 'rgb(114, 171, 213)';
            zlibButton.className = "zlib-btn";

            // 为按钮添加点击事件，使用对应的 URL
            zlibButton.addEventListener("click", function() {
                const url = `${hosts[hostName]}${encodeURIComponent(bookTitle)}`;
                window.open(url, "_blank");
            });
            interestDiv.style.display = 'flex';
            interestDiv.appendChild(zlibButton);

        })
    }

})();

