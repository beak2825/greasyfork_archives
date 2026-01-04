// ==UserScript==
// @name         快速聚焦在百度搜索页面可以使用Ctrl+Q 快速聚焦搜索框，在其他页面可在右下角显示当前日期和时间
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在百度搜索页面可以使用Ctrl+Q 快速聚焦搜索框，在其他页面可在右下角显示当前日期和时间。
// @author       wulei
// @include *
// @match        https://www.baidu.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// 
// @downloadURL https://update.greasyfork.org/scripts/449853/%E5%BF%AB%E9%80%9F%E8%81%9A%E7%84%A6%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8Ctrl%2BQ%20%E5%BF%AB%E9%80%9F%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A1%86%EF%BC%8C%E5%9C%A8%E5%85%B6%E4%BB%96%E9%A1%B5%E9%9D%A2%E5%8F%AF%E5%9C%A8%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E6%97%A5%E6%9C%9F%E5%92%8C%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/449853/%E5%BF%AB%E9%80%9F%E8%81%9A%E7%84%A6%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8Ctrl%2BQ%20%E5%BF%AB%E9%80%9F%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A1%86%EF%BC%8C%E5%9C%A8%E5%85%B6%E4%BB%96%E9%A1%B5%E9%9D%A2%E5%8F%AF%E5%9C%A8%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E6%97%A5%E6%9C%9F%E5%92%8C%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    'esversion:6';
    if(window.parent!==window)return;
    var fg = document.createDocumentFragment();
    var div = document.createElement("div");
    div.onselectstart = () => false
    setInterval(() => {
        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            week = date.getDay(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();
        div.innerText = `${year}年${month}月${day}日 ${hour}时${minute}分${second}秒 周${week}`
    }, 1000);
    div.setAttribute("class", "qf-date");
    fg.appendChild(div);
    document.body.appendChild(fg);
    //聚焦搜索框
    var arr = [];
    document.onkeydown = function (event) {
        arr.push(event.key)
        if (arr.toString().toUpperCase() === 'CONTROL,Q') {
            var is = false;
            Array.from(document.querySelectorAll("input"))
                .forEach((item) => {
                if (item.type === "text" && !is) {
                    item.focus();
                    is = true
                }
            })

        }
    }
    document.onkeyup = function () {
        arr.length = 0;
    }
    // Your code here...
})();
(function (){
    var style=document.createElement("style")
    style.innerHTML=`.qf-date {
    position: fixed;
    bottom: 3px;
    right: 3px;
    color: rgba(37, 134, 151, 0.281);
    color: red;
    font-size: 11px;
    font-weight: bold;
    /* zoom: 0.5; */
    z-index: 999;
}
`;
    document.head.appendChild(style)
})();