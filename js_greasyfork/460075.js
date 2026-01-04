// ==UserScript==
// @name         For-Baidu-to-Google
// @namespace    none
// @version      2.4
// @description  在百度搜索页面添加一个按钮可以快速跳转到 Google 搜索页面
// @author       RainForest
// @match        https://www.baidu.com/*
// @grant        none
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/460075/For-Baidu-to-Google.user.js
// @updateURL https://update.greasyfork.org/scripts/460075/For-Baidu-to-Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取class为"bg s_btn_wr"的span标签，并插入一个input按钮
    var span = document.querySelector("form#form span.bg.s_btn_wr");
    var input = document.createElement("input");
    input.type = "button";
    input.value = "Google一下";
    input.classList = "bg s_btn googlebutton";

    // 将按钮添加到span的最后面
    span.appendChild(input); 

    // 给class值为 "bg s_btn_wr" 的span标签，增加一个class为Googlebox
    span.classList.add("buttonbox");

    // 给百度一下按钮添加一个class
    var suInput = document.getElementById("su");
    if (suInput) {
        suInput.classList.add("baidubutton");
    }

    // 注入css，调整按钮样式为横排，去掉百度一下右侧的圆角，修改Google一下的背景色。
    var style = document.createElement("style");
    style.textContent = ".s-hotsearch-wrapper{width: auto !important;}.buttonbox { display: inline-flex !important; }.baidubutton, .googlebutton{padding: 0 15px !important;width: auto !important;}.baidubutton { border-radius: 0 !important; }.googlebutton{ background-color: #34a853 !important;}";
    document.documentElement.insertBefore(style, document.documentElement.firstChild);

    // 点击按钮后，获取name为wd的input标签的内容，并在Google搜索
    input.addEventListener("click", function() {
        var keyword = document.querySelector("input[name='wd']").value;
        window.open("https://www.google.com/search?q=" + encodeURIComponent(keyword), '_blank');
    });
})();