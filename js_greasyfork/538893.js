// ==UserScript==
// @name         洛谷隐藏
// @version      0.4
// @description  洛谷隐藏左侧栏,防止查看题解
// @match        https://www.luogu.com.cn/*
// @author       davidhu1332
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1480957
// @downloadURL https://update.greasyfork.org/scripts/538893/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/538893/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timer = setInterval(() => {
        const s = document.querySelectorAll('div');
        for (let i = 0; i < s.length; i++) {
            if(s[i].className=='side'){
                s[i].remove();
                clearInterval(timer);
            }
        }
    },1000)

})();
