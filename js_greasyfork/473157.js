// ==UserScript==
// @name         在豆瓣读书中添加Zlibrary检索与anna安娜的档案检索入口 
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  在豆瓣读书页面添加Zlibrary检索与anna安娜的档案检索入口，点击该按钮后在Zlibrary与Anna进行书名检索。
// @author       Kawatabi
// @match        https://book.douban.com/*
// @grant        none
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/473157/%E5%9C%A8%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E4%B8%AD%E6%B7%BB%E5%8A%A0Zlibrary%E6%A3%80%E7%B4%A2%E4%B8%8Eanna%E5%AE%89%E5%A8%9C%E7%9A%84%E6%A1%A3%E6%A1%88%E6%A3%80%E7%B4%A2%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/473157/%E5%9C%A8%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E4%B8%AD%E6%B7%BB%E5%8A%A0Zlibrary%E6%A3%80%E7%B4%A2%E4%B8%8Eanna%E5%AE%89%E5%A8%9C%E7%9A%84%E6%A1%A3%E6%A1%88%E6%A3%80%E7%B4%A2%E5%85%A5%E5%8F%A3.meta.js
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

    // 创建获取Anna按钮元素
    const getAnnaButton = document.createElement("a");
    getAnnaButton.href = "#";
    getAnnaButton.classList.add("j", "a_show_login", "colbutt", "ll");
    getAnnaButton.name = "pbtn-36104107-collect-anna";
    getAnnaButton.rel = "nofollow";
    getAnnaButton.innerHTML = `
        <span>
            <form method="POST" action="https://www.douban.com/register?reason=collectcollect" class="miniform">
                <input type="submit" class="minisubmit j" value="获取Anna" title="获取Anna">
            </form>
        </span>
    `;

    // 创建设置Anna个人二级网址按钮元素
    const setAnnaHostButton = document.createElement("a");
    setAnnaHostButton.href = "#";
    setAnnaHostButton.classList.add("j", "a_show_login", "colbutt", "ll");
    setAnnaHostButton.name = "pbtn-set-anna-host";
    setAnnaHostButton.rel = "nofollow";
    setAnnaHostButton.innerHTML = `
        <span>
            <form method="POST" action="https://www.douban.com/register?reason=collectcollect" class="miniform">
                <input type="submit" class="minisubmit j" value="设置Anna" title="设置Anna" id="setAnnaHostButton">
            </form>
        </span>
    `;

    // 找到收藏按钮元素并插入获取按钮元素和设置Zlibrary个人二级网址按钮元素
    const interestDiv = document.querySelector("#interest_sect_level.clearfix");
    if (interestDiv) {
        const lastChild = interestDiv.children[interestDiv.children.length - 1];
        interestDiv.insertBefore(getButton, lastChild);
        interestDiv.insertBefore(setHostButton, lastChild);
        interestDiv.insertBefore(getAnnaButton, lastChild);
        interestDiv.insertBefore(setAnnaHostButton, lastChild);
    }

    // 函数：设置Zlibrary个人二级网址
    function setLibraryHost() {
        // 从localStorage中获取当前的LIBRARY_HOST变量
        const currentHost = localStorage.getItem('LIBRARY_HOST');

        // 弹出输入框，显示当前的个人二级网址
        const newHost = prompt('请设置 Zlibrary 的个人二级网址（例如 https://zh.1lib.sk/）：', currentHost);
        if (newHost) {
            localStorage.setItem('LIBRARY_HOST', newHost);
            alert('Zlibrary个人二级网址已设置成功！');
        }
    }

    // 函数：设置Anna个人二级网址
    function setAnnaHost() {
        // 从localStorage中获取当前的ANNA_HOST变量
        const currentHost = localStorage.getItem('ANNA_HOST');

        // 弹出输入框，显示当前的个人二级网址
        const newHost = prompt('请设置 Anna 的个人二级网址（例如https://zh.annas-archive.org/search?q=）：', currentHost);
        if (newHost) {
            localStorage.setItem('ANNA_HOST', newHost);
            alert('Anna个人二级网址已设置成功！');
        }
    }

    // 监听获取按钮点击事件
    getButton.addEventListener("click", function(event) {
        event.preventDefault();

        // 从localStorage中获取LIBRARY_HOST变量
        const LIBRARY_HOST = localStorage.getItem('LIBRARY_HOST');

        // 如果LIBRARY_HOST未设置，则调用设置Zlibrary个人二级网址函数
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

    // 监听获取Anna按钮点击事件
    getAnnaButton.addEventListener("click", function(event) {
        event.preventDefault();

        // 从localStorage中获取ANNA_HOST变量
        const ANNA_HOST = localStorage.getItem('ANNA_HOST');

        // 如果ANNA_HOST未设置，则调用设置Anna个人二级网址函数
        if (!ANNA_HOST) {
            setAnnaHost();
            return;
        }

        // 获取书名并打开新页面
        const bookName = document.querySelector("span[property='v:itemreviewed']").innerText;
        const url = `${ANNA_HOST}${encodeURIComponent(bookName)}`;
        window.open(url, "_blank");
    });

    // 监听设置Anna个人二级网址按钮点击事件
    const setAnnaHostButtonListener = document.getElementById("setAnnaHostButton");
    if (setAnnaHostButtonListener) {
        setAnnaHostButtonListener.addEventListener("click", function(event) {
            event.preventDefault();
            setAnnaHost();
        });
    }
})();