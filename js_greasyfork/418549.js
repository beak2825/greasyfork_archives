// ==UserScript==
// @name         解除b站专栏复制限制
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  B站复制限制解除
// @author       m.kaku
// @match        https://www.bilibili.com/read/cv*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/418549/%E8%A7%A3%E9%99%A4b%E7%AB%99%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/418549/%E8%A7%A3%E9%99%A4b%E7%AB%99%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
    // Your code here...
    document.querySelector('div.article-holder').classList.remove('unable-reprint');
    document.querySelector('div.article-holder').addEventListener('copy',function(e){
        e.clipboardData.setData("text",window.getSelection().toString())
    });
}
})();