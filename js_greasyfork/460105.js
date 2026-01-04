// ==UserScript==
// @name         在豆瓣读书搜索Zlibrary
// @namespace    http://tampermonkey.net/
// @version      3
// @description  在豆瓣读书页面添加一个获取按钮，点击该按钮后在Zlibrary搜索该书名。
// @author       Rainforest
// @match        https://book.douban.com/*
// @grant        none
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/460105/%E5%9C%A8%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%90%9C%E7%B4%A2Zlibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/460105/%E5%9C%A8%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%90%9C%E7%B4%A2Zlibrary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建获取按钮元素
    const getButton = document.createElement("a");
    getButton.href = "#";
    getButton.classList.add("j", "a_show_login", "colbutt", "ll");
    getButton.name = "pbtn-36104107-collect";
    getButton.rel = "nofollow";
    getButton.innerHTML = `
        <span>
            <form method="POST" action="https://www.douban.com/register?reason=collectcollect" class="miniform">
                <input type="submit" class="minisubmit j" value="获取" title="获取">
            </form>
        </span>
    `;

    // 创建设置Zlibrary个人二级网址按钮元素
    const setHostButton = document.createElement("a");
    setHostButton.href = "#";
    setHostButton.classList.add("j", "a_show_login", "colbutt", "ll");
    setHostButton.name = "pbtn-set-library-host";
    setHostButton.rel = "nofollow";
    setHostButton.innerHTML = `
<span>
            <form method="POST" action="https://www.douban.com/register?reason=collectcollect" class="miniform">
                <input type="submit" class="minisubmit j" value="设置Zlibrary" title="设置Zlibrary" id="setLibraryHostButton">
            </form>
        </span>
    `;

    // 找到收藏按钮元素并插入获取按钮元素
    const interestDiv = document.querySelector("#interest_sect_level.clearfix");
    if (interestDiv) {
        const lastChild = interestDiv.children[interestDiv.children.length - 1];
        interestDiv.insertBefore(getButton, lastChild);
        interestDiv.insertBefore(setHostButton, lastChild);
    }

    // 函数：设置Zlibrary个人二级网址
    function setLibraryHost() {
        // 从 localStorage 中获取当前的LIBRARY_HOST变量
        const currentHost = localStorage.getItem('LIBRARY_HOST');

        // 弹出输入框，显示当前的个人二级网址
        const newHost = prompt('请设置 Zlibrary 的个人二级网址（例如 https://lib-xxxx.1lib.ph/）：', currentHost);
        if (newHost) {
            localStorage.setItem('LIBRARY_HOST', newHost);
            alert('Zlibrary个人二级网址已设置成功！');
        }
    }

    // 监听获取按钮点击事件
    getButton.addEventListener("click", function(event) {
        event.preventDefault();

        // 从 localStorage 中获取 LIBRARY_HOST 变量
        const LIBRARY_HOST = localStorage.getItem('LIBRARY_HOST');

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

    // 监听设置Zlibrary个人二级网址按钮点击事件
    const setLibraryHostButton = document.getElementById("setLibraryHostButton");
    if (setLibraryHostButton) {
        setLibraryHostButton.addEventListener("click", function(event) {
            event.preventDefault();
            setLibraryHost();
        });
    }
})();
