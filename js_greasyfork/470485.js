// ==UserScript==
// @name         ybt系列智能题目搜索
// @namespace    http://tampermonkey.net/
// @namespace    https://www.luogu.com.cn/user/545986
// @version      0.8.0
// @description  在ybt系列网页上添加智能题目搜索功能
// @icon         https://cdn.luogu.com.cn/upload/image_hosting/4exqhg4v.png
// @author       Jerrycyx,ChatGPT
// @license      Mozilla
// @match        http://oj.woj.ac.cn:8088/*
// @match        http://ybt.ssoier.cn:8088/*
// @match        http://bas.ssoier.cn:8086/*
// @match        http://woj.ssoier.cn:8087/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470485/ybt%E7%B3%BB%E5%88%97%E6%99%BA%E8%83%BD%E9%A2%98%E7%9B%AE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/470485/ybt%E7%B3%BB%E5%88%97%E6%99%BA%E8%83%BD%E9%A2%98%E7%9B%AE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
GM_addStyle(`
    .searchBtn, .searchBox, .jumpBtn{
        outline: none;
        background-color: #f0f0f0;
    }
    .searchBtn.hovered, .jumpBtn.hovered {
        background-color: #ccc;
    }
    .searchBox input {
        background: transparent;
        border: none;
        border-bottom: 1.5px solid Gray !important;
    }
    .searchBtn, .searchBox * {
        outline: none;
    }
`);
(function () {
    'use strict';
    var searchBox = null;
    var searchBtn = null;
    var currentSite;
    if (window.location.href.includes("ybt.ssoier.cn:8088/")) currentSite = "ybt";
    else if (window.location.href.includes("oj.woj.ac.cn:8088/")) currentSite = "woj8088";
    else if (window.location.href.includes("bas.ssoier.cn:8086/")) currentSite = "bas";
    else if (window.location.href.includes("woj.ssoier.cn:8087/")) currentSite = "woj8087";
    // 创建搜索按钮
    function createSearchButton() {
        searchBtn = document.createElement("button");
        searchBtn.innerHTML = "题目搜索";
        searchBtn.classList.add("searchBtn");
        searchBtn.style.position = "fixed";
        searchBtn.style.right = "30px";
        searchBtn.style.bottom = "20px";
        searchBtn.style.padding = "15px 20px";
        searchBtn.style.border = "none";
        searchBtn.style.borderRadius = "5px";
        searchBtn.style.color = "#000";
        searchBtn.style.fontSize = "16px";
        searchBtn.style.transition = "background-color 0.3s";
        searchBtn.addEventListener("mouseover", function () {
            searchBtn.classList.add("hovered");
        });
        searchBtn.addEventListener("mouseout", function () {
            searchBtn.classList.remove("hovered");
        });
        searchBtn.addEventListener("click", function () {
            toggleSearchBox();
        });
        document.body.appendChild(searchBtn);
    }
    // 创建搜索框和跳转按钮
    function createSearchBox() {
        searchBox = document.createElement("div");
        searchBox.classList.add("searchBox");
        searchBox.style.position = "fixed";
        searchBox.style.right = "30px";
        searchBox.style.bottom = "80px";
        searchBox.style.padding = "10px";
        searchBox.style.borderRadius = "5px";
        searchBox.style.display = "none";
        searchBox.style.opacity = "0";
        searchBox.style.transition = "all 0.5s";
        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "请输入题目编号或名称");
        input.style.width = "200px";
        input.style.padding = "5px";
        input.style.marginRight = "10px";
        input.style.borderRadius = "0px";
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                jumpToProblem(input.value);
            }
        });
        searchBox.appendChild(input);
        var jumpBtn = document.createElement("button");
        jumpBtn.innerHTML = "跳转或搜索";
        jumpBtn.classList.add("jumpBtn");
        jumpBtn.style.padding = "5px 10px";
        jumpBtn.style.border = "none";
        jumpBtn.style.borderRadius = "5px";
        jumpBtn.style.color = "#000";
        jumpBtn.style.fontSize = "14px";
        jumpBtn.style.transition = "background-color 0.3s";
        jumpBtn.addEventListener("mouseover", function () {
            jumpBtn.classList.add("hovered");
        });
        jumpBtn.addEventListener("mouseout", function () {
            jumpBtn.classList.remove("hovered");
        });
        jumpBtn.addEventListener("click", function () {
            jumpToProblem(input.value);
        });
        searchBox.appendChild(jumpBtn);
        document.body.appendChild(searchBox);
    }
    // 切换搜索框的显示和隐藏
    function toggleSearchBox() {
        if (searchBox.style.display === "none") {
            showSearchBox();
        } else {
            hideSearchBox();
        }
    }
    // 显示搜索框
    function showSearchBox() {
        searchBox.style.display = "block";
        // 淡入动画
        setTimeout(function () {
            searchBox.style.opacity = "1";
        }, 10);
    }
    // 隐藏搜索框
    function hideSearchBox() {
        searchBox.style.opacity = "0";
        // 淡出动画
        setTimeout(function () {
            searchBox.style.display = "none";
        }, 500);
    }
    // 根据输入内容跳转至对应页面
    function jumpToProblem(content) {
        if (currentSite === "woj8088") {
            if (/^\d{4}$/.test(content)) {
            window.location.href = "http://oj.woj.ac.cn:8088/problem_show.php?pid=" + content;
            } else {
                window.location.href = "http://oj.woj.ac.cn:8088/problem_search.php?xproblem=" + content;
            }
        }
        else if (currentSite === "ybt") {
            if (/^\d{4}$/.test(content)) {
            window.location.href = "http://ybt.ssoier.cn:8088/problem_show.php?pid=" + content;
            } else {
                window.location.href = "http://ybt.ssoier.cn:8088/problem_search.php?xproblem=" + content;
            }
        }
        else if (currentSite === "bas") {
            if (/^\d{4}$/.test(content)) {
            window.location.href = "http://bas.ssoier.cn:8086/problem_show.php?pid=" + content;
            } else {
                window.location.href = "http://bas.ssoier.cn:8086/problem_search.php?xproblem=" + content;
            }
        }
        else if (currentSite === "woj8087") {
            if (/^\d{4}$/.test(content)) {
            window.location.href = "http://woj.ssoier.cn:8087/problem_show.php?pid=" + content;
            } else {
                window.location.href = "http://woj.ssoier.cn:8087/problem_search.php?xproblem=" + content;
            }
        }
    }
    // 主函数
    function main() {
        createSearchButton();
        createSearchBox();
    }
    main();
})();