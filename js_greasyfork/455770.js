// ==UserScript==
// @name        微博灰色恢复彩色页面
// @description  仅微博灰色恢复彩色颜面
// @match        https://weibo.com/*
// @grant       none
// @version     1.1
// @author      cv
// @namespace https://greasyfork.org/users/692763
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455770/%E5%BE%AE%E5%8D%9A%E7%81%B0%E8%89%B2%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/455770/%E5%BE%AE%E5%8D%9A%E7%81%B0%E8%89%B2%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function(){
    document.getElementById('plc_frame').querySelector('style').remove();
    
})();