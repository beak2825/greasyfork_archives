// ==UserScript==
// @name         移动翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用
// @author       You
// @run-at       document-start
// @match        https://m.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471816/%E7%A7%BB%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/471816/%E7%A7%BB%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

setInterval(() => {
    if (document.querySelector(".new-nextpage") != null) {
        document.querySelector(".new-nextpage").innerText = "下一页"
    }
}, 3000);