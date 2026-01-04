// ==UserScript==
// @name         萌次元（18moe.vip）自动加载预览图
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        https://18moe.vip/*
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/406486/%E8%90%8C%E6%AC%A1%E5%85%83%EF%BC%8818moevip%EF%BC%89%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/406486/%E8%90%8C%E6%AC%A1%E5%85%83%EF%BC%8818moevip%EF%BC%89%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.jQuery('a[href*="18moe.vip/goto"]').each((i, e) => {
        console.log(e.textContent)
        e.insertAdjacentHTML('afterend','<img src="'+e.textContent+'"/>')
    })

})();