// ==UserScript==
// @name         删除掘金插件安装提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除掘金插件安装
// @author       You
// @match        https://juejin.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462829/%E5%88%A0%E9%99%A4%E6%8E%98%E9%87%91%E6%8F%92%E4%BB%B6%E5%AE%89%E8%A3%85%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/462829/%E5%88%A0%E9%99%A4%E6%8E%98%E9%87%91%E6%8F%92%E4%BB%B6%E5%AE%89%E8%A3%85%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

     window.addEventListener("load", function() {
         let ext= document.querySelector('.extension');
         if(!!ext){
             ext.remove();
         }
    });
})();