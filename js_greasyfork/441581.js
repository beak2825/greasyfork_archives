// ==UserScript==
// @name         简单的解除右键限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简单的解除右键限制 by wxc
// @author       wxc
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=51test.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441581/%E7%AE%80%E5%8D%95%E7%9A%84%E8%A7%A3%E9%99%A4%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441581/%E7%AE%80%E5%8D%95%E7%9A%84%E8%A7%A3%E9%99%A4%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 解除右键菜单
    document.oncontextmenu = function(){ return true; };
    // 解除文字选择
    document.onselectstart = function(){ return true; };
    // 解除复制
    document.oncopy = function(){ return true; };
    // 解除剪切
    document.oncut = function(){ return true; };
    // 解除粘贴
    document.onpaste = function(){ return true; };
})();