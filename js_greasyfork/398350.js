// ==UserScript==
// @name         Iconfont 展开我的项目
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.iconfont.cn/manage/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398350/Iconfont%20%E5%B1%95%E5%BC%80%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/398350/Iconfont%20%E5%B1%95%E5%BC%80%E6%88%91%E7%9A%84%E9%A1%B9%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){

        function test() {
            document.getElementsByClassName("nav-lists")[0].style.maxHeight="1000000px";
            document.getElementsByClassName("nav-lists")[1].style.maxHeight="1000000px";
        }
        setTimeout(test, 1000);

    }
    // Your code here...
})();