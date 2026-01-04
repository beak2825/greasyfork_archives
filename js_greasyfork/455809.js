// ==UserScript==
// @name         国内网站去黑白
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  功能是取消掉国内网站的阴间黑白滤镜，还我彩色世界！大概可以匹配所有网站吧，已测试bilibili、英雄联盟官网。
// @author       Qiluo
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455809/%E5%9B%BD%E5%86%85%E7%BD%91%E7%AB%99%E5%8E%BB%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455809/%E5%9B%BD%E5%86%85%E7%BD%91%E7%AB%99%E5%8E%BB%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('*').forEach((e)=> {    //查找所有节点，匹配使网页变灰的节点，并使用内联样式覆盖
        if(getComputedStyle(e).filter.search('grayscale')!=-1){
           e.setAttribute('style', 'filter:none !important');
        }
    })
    // Your code here...
})();