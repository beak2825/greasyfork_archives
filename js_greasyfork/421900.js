// ==UserScript==
// @name         力扣自动全屏
// @namespace    Chalkim
// @version      0.2
// @description  自动为每一个题目展开成全屏模式
// @author       Chalkim
// @match        https://leetcode-cn.com/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421900/%E5%8A%9B%E6%89%A3%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/421900/%E5%8A%9B%E6%89%A3%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = 0;
    var full = null;
    var interval = setInterval(function() {
        if(i > 5 * 60) {
            console.log("载不出来就算了吧憋肝了_(:з」∠)_");
            clearInterval(interval);
        }
        full = document.querySelector("path[d='M6 15H4v5h5v-2H6v-3zM4 9h2V6h3V4H4v5zm14 9h-3v2h5v-5h-2v3zM15 4v2h3v3h2V4h-5z']");
        if(full){
            clearInterval(interval);
            full.parentNode.parentNode.click();
        }
        ++i;
    }, 200);
})();