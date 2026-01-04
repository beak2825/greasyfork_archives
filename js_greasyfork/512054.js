// ==UserScript==
// @name        从douban跳转到其他网站搜书
// @namespace    http://tampermonkey.net/
// @version      7
// @description  在 https://book.douban.com 添加一个“跳转搜书”按钮，默认可跳转到Zlibrary搜书。
// @author       Rainforest,sirrry
// @match        https://book.douban.com/*
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/512054/%E4%BB%8Edouban%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%85%B6%E4%BB%96%E7%BD%91%E7%AB%99%E6%90%9C%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/512054/%E4%BB%8Edouban%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%85%B6%E4%BB%96%E7%BD%91%E7%AB%99%E6%90%9C%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // 创建Anna按钮
    const searchAnnaButton = createSearchButton("Anna图书馆", "https://annas-archive.li/search?q=");

    // 创建Zlibrary按钮
    const searchZlibraryButton = createSearchButton("Zlibrary", "https://zh.z-lib.fm/s/");

    // 创建一元图书按钮
    const searchYiyuanButton = createSearchButton("一元图书", "https://xn--4gqpjo2fxxi.com/search/");

    // 创建101图书按钮
    const search101Button = createSearchButton("101图书目录", "http://www.101vv.com/index/index/search.html?info=");

    // 热点图书
    const searchHotButton = createSearchButton("热点图书", "http://www.happydot.top/?s=");

    // 熊猫图书
    const searchxmButton = createSearchButton("熊猫", "https://xmsoushu.com/#/");

    // 插入按钮
    const interestDiv2 = document.querySelector("#interest_sect_level.clearfix");
    if (interestDiv2) {
        const lastChild = interestDiv2.children[interestDiv2.children.length - 1];
        interestDiv2.insertBefore(searchAnnaButton, lastChild);
        interestDiv2.insertBefore(searchZlibraryButton, lastChild);
        interestDiv2.insertBefore(searchYiyuanButton, lastChild);
        interestDiv2.insertBefore(search101Button, lastChild);
        interestDiv2.insertBefore(searchHotButton, lastChild);
        interestDiv2.insertBefore(searchxmButton, lastChild);
    }


    // 创建获取按钮元素
    const getButton = document.createElement("a");
    getButton.href = "#";
    getButton.classList.add("j", "a_show_login", "colbutt", "ll");
    getButton.name = "pbtn-36104107-collect";
    getButton.rel = "nofollow";
    getButton.innerHTML = `
        <span>
            <form method="POST" action="https://www.douban.com/register?reason=collectcollect" class="miniform">
                <input type="submit" class="minisubmit j" value="跳转搜书" title="跳转搜书">
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
                <input type="submit" class="minisubmit j" value="设置" title="设置自定义搜书网站" id="setLibraryHostButton">
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
        const currentHost = localStorage.getItem('LIBRARY_HOST')?localStorage.getItem('LIBRARY_HOST'):"https://annas-archive.li/search?q=";

        // 弹出输入框，显示当前的个人二级网址
        const newHost = prompt('请设置通用搜索网址（例如 https://zh.z-lib.fm/s/  https://annas-archive.li/search?q=  https://xn--4gqpjo2fxxi.com/search/）：', currentHost);
        if (newHost) {
            localStorage.setItem('LIBRARY_HOST', newHost);
            alert('网址设置成功！');
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
        const url = `${LIBRARY_HOST}${encodeURIComponent(bookName)}`;
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
})();
