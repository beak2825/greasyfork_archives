// ==UserScript==
// @name         洛谷系统维护主页显示
// @version      0.3
// @description  主页显示
// @match        https://www.luogu.com.cn/user*
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/485377/%E6%B4%9B%E8%B0%B7%E7%B3%BB%E7%BB%9F%E7%BB%B4%E6%8A%A4%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/485377/%E6%B4%9B%E8%B0%B7%E7%B3%BB%E7%BB%9F%E7%BB%B4%E6%8A%A4%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function work(){
        var s=document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div.introduction.marked");
        if(s&&s.style.display=='none'){
            document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div:nth-child(2)").remove();
            document.querySelector("#app > div.main-container > main > div > div.full-container > section.main > div > div.introduction.marked").style="";
        }
    }
    window.addEventListener('load',function(){
        document.querySelector("#app > div.main-container > main > div > div.card.user-header-container.padding-0 > div.user-header-bottom > div.menu").addEventListener("click",work);
        work();
    },false);
    document.querySelector("#app > div.main-container > main > div > div.card.user-header-container.padding-0 > div.user-header-bottom > div.menu").addEventListener("click",work);
    work();
})();