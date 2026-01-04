// ==UserScript==
// @name        恢复色彩-移除默哀网站全局灰色
// @namespace   https://greasyfork.org/zh-CN/scripts/455667-恢复色彩-移除默哀网站全局灰色
// @match       *://*/*
// @grant       none
// @version     1.3
// @author      lqs1848
// @description 2022/11/30 17:08:29
// @supportURL  https://blog.lqs1848.top/
// @downloadURL https://update.greasyfork.org/scripts/455667/%E6%81%A2%E5%A4%8D%E8%89%B2%E5%BD%A9-%E7%A7%BB%E9%99%A4%E9%BB%98%E5%93%80%E7%BD%91%E7%AB%99%E5%85%A8%E5%B1%80%E7%81%B0%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455667/%E6%81%A2%E5%A4%8D%E8%89%B2%E5%BD%A9-%E7%A7%BB%E9%99%A4%E9%BB%98%E5%93%80%E7%BD%91%E7%AB%99%E5%85%A8%E5%B1%80%E7%81%B0%E8%89%B2.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.body.style.filter='none';
    document.getElementsByTagName('html')[0].style.filter = 'none';
    var arr = document.getElementsByTagName('div');
    for(var i=0;i<arr.length;i++){
      arr[i].style.filter='none';
    }
})();