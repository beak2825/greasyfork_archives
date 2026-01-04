// ==UserScript==
// @name         天天基金网删除
// @namespace    http://www.scixiv.com
// @version      0.1
// @description  删除烦人的投资人登录限制
// @author       Hardy Wu
// @match        http://*.eastmoney.com/*
// @grant        All
// @downloadURL https://update.greasyfork.org/scripts/380754/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E7%BD%91%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/380754/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E7%BD%91%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function() {
        var pop = document.querySelector('#pop-content')
        var player = document.querySelector('#backlayer')
        if (pop) pop.remove()
        if (player) player.remove()
        document.body.removeAttribute('scroll')
        document.body.removeAttribute('style')
    }, false);
})();