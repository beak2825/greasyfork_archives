// ==UserScript==
// @name         QQ邮箱隐藏全部标记已读按钮
// @namespace    https://zvv.me/
// @version      0.1.1
// @description  经常误按到QQ邮箱的全部标记已读按钮，所以隐藏下。。
// @author       Gh0st
// @match        *mail.qq.com*
// @grant        none
// @include *mail.qq.com*
// @downloadURL https://update.greasyfork.org/scripts/35641/QQ%E9%82%AE%E7%AE%B1%E9%9A%90%E8%97%8F%E5%85%A8%E9%83%A8%E6%A0%87%E8%AE%B0%E5%B7%B2%E8%AF%BB%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/35641/QQ%E9%82%AE%E7%AE%B1%E9%9A%90%E8%97%8F%E5%85%A8%E9%83%A8%E6%A0%87%E8%AE%B0%E5%B7%B2%E8%AF%BB%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("btn_gray btn_space")[4].style.display = "none";
    document.getElementsByClassName("btn_gray btn_space")[9].style.display = "none";
    // Your code here...
})();