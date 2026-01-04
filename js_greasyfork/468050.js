// ==UserScript==
// @name         洛谷隐藏下侧边栏
// @version      0.3
// @description  隐藏下侧边栏
// @match        https://www.luogu.com.cn/*
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/468050/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E4%B8%8B%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/468050/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E4%B8%8B%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const s= document.querySelectorAll('div');
    for (let i = 0; i < s.length; i++) {
        if(s[i].className=='footer'){
            s[i].remove();
        }
    }
})();