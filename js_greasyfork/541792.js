// ==UserScript==
// @name         eBooks
// @name:zh-CN   电子书助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在豆瓣读书页面添加两个获取按钮，点击该按钮后在 Z-library、安娜的档案搜索该书。
// @description:zh-CN 在豆瓣读书页面添加两个获取按钮，点击该按钮后在 Z-library、安娜的档案搜索该书。
// @author       Rainforest & viyi
// @match        https://book.douban.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/541792/eBooks.user.js
// @updateURL https://update.greasyfork.org/scripts/541792/eBooks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建获取按钮元素（Z-Library）
    const getButton = document.createElement("a");
    getButton.href = "#";
    getButton.classList.add("j", "a_show_login", "colbutt", "ll");
    getButton.name = "pbtn-36104107-collect";
    getButton.rel = "nofollow";
    getButton.innerHTML = `
        <span>
            <form method="POST" action="https://www.douban.com/register?reason=collectcollect" class="miniform">
                <input type="submit" class="minisubmit j" value="Z-Library" title="跳转 Z-Library 搜索本书">
            </form>
        </span>
    `;

    // 创建按钮元素（安娜的档案）
    const annasButton = document.createElement("a");
    annasButton.href = "#";
    annasButton.classList.add("j", "a_show_login", "colbutt", "ll");
    annasButton.name = "pbtn-annas-archive";
    annasButton.rel = "nofollow";
    annasButton.innerHTML = `
        <span>
            <form method="POST" action="https://www.douban.com/register?reason=collectcollect" class="miniform">
                <input type="submit" class="minisubmit j" value="安娜的档案" title="跳转「安娜的档案」搜索本书">
            </form>
        </span>
    `;



    // 找到收藏按钮元素并插入获取按钮元素
    const interestDiv = document.querySelector("#interest_sect_level.clearfix");
    if (interestDiv) {
        const lastChild = interestDiv.children[interestDiv.children.length - 1];
        interestDiv.insertBefore(getButton, lastChild);
        interestDiv.insertBefore(annasButton, lastChild);
    }

    // 函数：设置Zlibrary个人二级网址
    function setLibraryHost() {
        // 从 GM_getValue 中获取当前的LIBRARY_HOST变量
        const currentHost = GM_getValue('LIBRARY_HOST', '');

        // 弹出输入框，显示当前的个人二级网址
        const newHost = prompt('请设置 Zlibrary 的个人二级网址（例如 https://lib-xxxx.1lib.ph/）：', currentHost);
        if (newHost) {
            GM_setValue('LIBRARY_HOST', newHost);
            alert('Zlibrary个人二级网址已设置成功！');
        }
    }

    // 注册脚本菜单命令
    GM_registerMenuCommand('设置 Z-Library 个人二级网址', setLibraryHost);
    GM_registerMenuCommand('到 Reddit 获取 Z-Library 的最新可访问地址', () => {
        window.open('https://www.reddit.com/r/zlibrary/wiki/index/access/', '_blank');
    });

    // 监听获取按钮点击事件
    getButton.addEventListener("click", function(event) {
        event.preventDefault();

        // 从 GM_getValue 中获取 LIBRARY_HOST 变量
        const LIBRARY_HOST = GM_getValue('LIBRARY_HOST', '');

        // 如果 LIBRARY_HOST 未设置，则调用设置Zlibrary个人二级网址函数
        if (!LIBRARY_HOST) {
            setLibraryHost();
            return;
        }

        // 获取书名并打开新页面
        const bookName = document.querySelector("span[property='v:itemreviewed']").innerText;
        const url = `${LIBRARY_HOST}s/${encodeURIComponent(bookName)}`;
        window.open(url, "_blank");
    });



    // 监听安娜的档案按钮点击事件
    annasButton.addEventListener("click", function(event) {
        event.preventDefault();
        // 获取书名并打开新页面
        const bookName = document.querySelector("span[property='v:itemreviewed']").innerText;
        const url = `https://zh.annas-archive.org/search?q=${encodeURIComponent(bookName)}`;
        window.open(url, "_blank");
    });
})();
