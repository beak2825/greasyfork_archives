// ==UserScript==
// @name         轻松看洛谷主页
// @namespace    http://tampermonkey.net/
// @version      2024-01-30
// @description  可以直接看用户主页，不用手动改F12
// @author       Cuiyi_SAI
// @match        https://www.luogu.com.cn/user/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/3.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486014/%E8%BD%BB%E6%9D%BE%E7%9C%8B%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/486014/%E8%BD%BB%E6%9D%BE%E7%9C%8B%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div.introduction.marked").style.display="";
    document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div:nth-child(2)").style.display="none";
})();