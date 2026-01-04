// ==UserScript==
// @name         洛谷隐藏讨论按钮
// @version      0.4
// @description  隐藏讨论按钮
// @match        https://www.luogu.com.cn/*
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/465035/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E8%AE%A8%E8%AE%BA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/465035/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E8%AE%A8%E8%AE%BA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for(let tim=1;tim<=10;tim++){
        setTimeout(function(){
            const s=document.querySelectorAll('a');
            for (let i=0;i<s.length;i++) {
                if(s[i].href.match('/discuss$')){
                    -s[i].remove();
                }
            }
        },1000*tim)
    }
})();
