// ==UserScript==
// @name         IT之家清爽首页
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只留 IT 之家首页新闻列表并隐藏列表里面辣品广告链接
// @author       Bingnme
// @license      MIT
// @match        https://www.ithome.com/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/465047/IT%E4%B9%8B%E5%AE%B6%E6%B8%85%E7%88%BD%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/465047/IT%E4%B9%8B%E5%AE%B6%E6%B8%85%E7%88%BD%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 你的代码在这里...
    var news = document.getElementById("news"); // 获取 id="news" 的元素
    var nnews = document.getElementById("nnews"); // 获取 id="nnews" 的元素
    var np = document.getElementById("n-p");
    var body = document.body; // 获取 body 元素
    body.innerHTML = ""; // 清空 body 的内容
    body.style.marginTop = "3px"; // 添加这一行来把 body 的上边距调整为 3px
    body.style.padding = "0";//把 body 的填充设置为0
    body.appendChild(news); // 把 news 元素添加到 body 中
    news.style.marginTop = "0"; // 添加这一行来把 news 所在的 div 的上边距调整为 0
    news.style.padding = "0";//把 news 的填充设置为0
    news.innerHTML = "";//清空 news 的内容
    news.appendChild(nnews); // 把 nnews 元素添加到 news 中
    nnews.style.margin = "auto"; // 让 nnews 所在的 div 的外边距自动调整
    nnews.style.width = "fit-content"; // 让 nnews 所在的 div 的宽度适应内容
    nnews.style.marginTop = "0"; // 添加这一行来把 nnews 所在的 div 的上边距调整为 0
    nnews.removeChild(nnews.firstElementChild); // 添加这一行来把 nnews 所在的 div 里的第一个 div 清除
    nnews.removeChild(nnews.firstElementChild); // 添加这一行来把 nnews 所在的 div 里的第一个 div 清除
    nnews.style.display = "flex"; // 添加这一行来让 nnews 所在的 div 使用弹性盒子布局
    var nlDivs = document.getElementsByClassName("nl");// 获取所有 class="nl" 的 div 元素
    // 遍历所有的 div 元素
    for (var i = 0; i < nlDivs.length; i++) {
        nlDivs[i].style.marginTop = "0px";// 把 div 的上边距设置为 0px
    }
    np.style.width = "38px";//把元素 n-p 宽设置为38px
    GM_addStyle(".t-b.sel > ul.nl > li > a[href*='/lapin.'] { display: none !important; }");// 添加自定义样式，隐藏含有辣品链接的a元素
    GM_addStyle(".t-b.sel > ul.nl > li > i[class='ad'] { display: none !important; }");// 添加自定义样式，隐藏含有辣品链接的i元素
})();