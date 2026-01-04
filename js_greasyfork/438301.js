// ==UserScript==
// @name         B站复制防侵入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili cheers!
// @author       jbts6
// @match        https://www.bilibili.com/read/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438301/B%E7%AB%99%E5%A4%8D%E5%88%B6%E9%98%B2%E4%BE%B5%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/438301/B%E7%AB%99%E5%A4%8D%E5%88%B6%E9%98%B2%E4%BE%B5%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('复制防侵入', navigator.clipboard ? '已启动' : '无效，不支持navigator.clipboard');
    var copyListen = function(e) {
        var text = window.getSelection().toString();
        navigator.clipboard && navigator.clipboard.writeText(text);
    };
    if (document.getElementById('article-content')){
        document.getElementById('article-content').addEventListener('copy', copyListen)
    }
    document.addEventListener('copy', copyListen);
    // Your code here...
})();