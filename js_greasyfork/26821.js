// ==UserScript==
// @name         腾讯微博批量删除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       imzhi <yxzblue@gmail.com>
// @match        http://t.qq.com/*/mine*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26821/%E8%85%BE%E8%AE%AF%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/26821/%E8%85%BE%E8%AE%AF%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function del() {
        if (!document.querySelector('.delBtn')) {
            location.reload();
        }
        document.querySelector('.delBtn').click();
        setTimeout(function () {
            document.querySelector('.gb_btn.gb_btn1').click();
            delLine();
        }, 500);
    }
    setInterval(del, 15e3);
    del();
})();