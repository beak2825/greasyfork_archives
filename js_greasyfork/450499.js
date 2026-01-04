// ==UserScript==
// @name         A姐博客去表情
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A姐博客自动去掉链接表情
// @author       maypu
// @match        http*://www.ahhhhfs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ahhhhfs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450499/A%E5%A7%90%E5%8D%9A%E5%AE%A2%E5%8E%BB%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/450499/A%E5%A7%90%E5%8D%9A%E5%AE%A2%E5%8E%BB%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let entry = document.getElementsByClassName('entry-content');
    if (entry.length>0) {
        let content = entry[0].innerHTML;
        content = content.replaceAll("🙈","");
        content = content.replaceAll("(删掉文字和括号复制到浏览打开)","");
        entry[0].innerHTML = content;
    }
})();