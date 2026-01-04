// ==UserScript==
// @name         给各种元素添加 skiptranslate 类
// @namespace    yournamespace
// @version      1.0
// @description  给页面中各种元素添加 skiptranslate 类，并每秒运行一次
// @match        file:///*
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483152/%E7%BB%99%E5%90%84%E7%A7%8D%E5%85%83%E7%B4%A0%E6%B7%BB%E5%8A%A0%20skiptranslate%20%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/483152/%E7%BB%99%E5%90%84%E7%A7%8D%E5%85%83%E7%B4%A0%E6%B7%BB%E5%8A%A0%20skiptranslate%20%E7%B1%BB.meta.js
// ==/UserScript==

(function() {
    setInterval(addSkipTranslateClass, 1000); // 每秒运行一次 addSkipTranslateClass 函数

    var arr_cfg = [
    "[class^=enlighter]",
    "a[target=_top]",
    "pre",
    "strong",
    "blockquote",
    "a",
    "i",
    "code",
    "table",
    ".socode",
    ".math",
    ".ssCodeTableBody",
    ".codesnippet",
    ".Codigo",
    ".prettyprint",
    "div.console",
    "span.socode",
    ".codes",
    ".codebox",
    ".codeseg",
    ".regexplain",
    ".match",
    ".syntax",
    ".string",
    "#toc",
    "em"
    ];

    function addSkipTranslateClass() {
        for (var item of arr_cfg) {
            var myNodelist = document.querySelectorAll(item);
            for (var i = 0; i < myNodelist.length; i++) {
                myNodelist[i].classList.add('skiptranslate');
            }
        }
    }
})();
