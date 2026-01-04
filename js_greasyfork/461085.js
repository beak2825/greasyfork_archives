// ==UserScript==
// @name         阮一峰博客的评论折叠
// @namespace    xxx
// @version      0.1
// @description  添加一个折叠按钮，把阮一峰博客的评论折叠起来
// @author       xxx
// @match        *://www.ruanyifeng.com/blog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461085/%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E7%9A%84%E8%AF%84%E8%AE%BA%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/461085/%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E7%9A%84%E8%AF%84%E8%AE%BA%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

(function () {
    GM_addStyle(".hide { display: none !important; ")
    $("#comments").addClass("hide")
    $("#comments").before("<div style=\"margin:10px\"><button id=\"fold\">评论折叠展开</button></div>")
    $("#fold").on("click", fold)


})();

function fold() {
    $("#comments").toggleClass("hide");
}
function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function () {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
