// ==UserScript==
// @name         浏阳教育局慧读自动翻页
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically click next chapter link every second on lyjyj.huidu.com
// @author       You
// @match        http://lyjyj.huidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491449/%E6%B5%8F%E9%98%B3%E6%95%99%E8%82%B2%E5%B1%80%E6%85%A7%E8%AF%BB%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491449/%E6%B5%8F%E9%98%B3%E6%95%99%E8%82%B2%E5%B1%80%E6%85%A7%E8%AF%BB%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        document.querySelector("li.read_next_chapeter a").click();
    }, 10000);
})();
