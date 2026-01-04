// ==UserScript==
// @name         移除百度题库二维码遮罩
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽百度题库推广
// @author       You
// @match        https://tiku.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427047/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E4%BA%8C%E7%BB%B4%E7%A0%81%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/427047/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E4%BA%8C%E7%BB%B4%E7%A0%81%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict'
    document.querySelector('.guid-to-app-mask').remove()

})();