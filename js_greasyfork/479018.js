// ==UserScript==
// @name         电影天堂分页当前窗口打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  电影天堂分页当前窗口打开，不会弹出新窗口打开
// @author       XianwenYu
// @match        https://www.dytt8.net/html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dytt8.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479018/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%88%86%E9%A1%B5%E5%BD%93%E5%89%8D%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/479018/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%88%86%E9%A1%B5%E5%BD%93%E5%89%8D%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
      document.querySelectorAll('.x')[1].childNodes.forEach(v=> {
        v.setAttribute && v.setAttribute("target", "_self")
    })
})();