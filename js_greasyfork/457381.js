// ==UserScript==
// @name        自动关闭switch520的首次欢迎弹窗
// @namespace   Violentmonkey Scripts
// @match       https://xxxxx520.com/
// @grant       none
// @version     1.0
// @author      -
// @description 2022/12/30 22:16:09
// @downloadURL https://update.greasyfork.org/scripts/457381/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADswitch520%E7%9A%84%E9%A6%96%E6%AC%A1%E6%AC%A2%E8%BF%8E%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/457381/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADswitch520%E7%9A%84%E9%A6%96%E6%AC%A1%E6%AC%A2%E8%BF%8E%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(window.onload=function() {
    'use strict';
    var btn=document.querySelector('div.swal2-container.swal2-center.swal2-fade.swal2-shown > div > div.swal2-header > button');
    btn.click();
    
})();