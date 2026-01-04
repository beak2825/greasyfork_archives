// ==UserScript==
// @name         豆瓣资源外站下载器（移动端）
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  用于移动端豆瓣页面的资源外站下载器
// @author       csczq123456
// @match        https://m.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459814/%E8%B1%86%E7%93%A3%E8%B5%84%E6%BA%90%E5%A4%96%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/459814/%E8%B1%86%E7%93%A3%E8%B5%84%E6%BA%90%E5%A4%96%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%EF%BC%89.meta.js
// ==/UserScript==

GM_addStyle(`
    .myDownloadClass {
        background: rgba(0,0,0,0.1);
        border-radius: .06rem;
        padding: .13rem .15rem;
        margin-top: .1rem;
        weight: 33%;
    }
    .myDownloadClass a {
        padding: 0 .15rem 0 0;
    }
`)

// convert string to web element
function parseDom(html) {
  const e = document.createElement('div')
  e.innerHTML = html
  return e.firstChild
}

(function() {
    'use strict';
    var container;
    var links;
    var title = document.querySelector("#subject-header-container > div.sub-info > div > div.sub-title");
    var subject_name = title.innerHTML;
    if (window.location.href.includes("book")) {
        container = document.querySelector("#subject-header-container > div.vendors-link-group");
        links = parseDom("<div class='myDownloadClass'>"+
                               "<a href = 'https://libgen.gs/index.php?req=" + subject_name + "'>libgen</a>"+
                               "<a href = 'https://ebook2.lorefree.com/site/index?s=" + subject_name + "'>lorefree</a>"+
                               "</div>");

    }
    else if (window.location.href.includes("movie")) {
        console.log(1212122);
        container = document.querySelector("#subject-header-container");
        links = parseDom("<div class='myDownloadClass'>"+
                             "<a href = 'https://t-rex.tzfile.com/?s=" + subject_name + "'>霸王龙压制组</a>"+
                             "</div>");
    }
    container.appendChild(links);
})();

