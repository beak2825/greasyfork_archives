// ==UserScript==
// @name         知乎免登录
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  1.【重要更新】关闭弹窗登录
// @author       galan99
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417656/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/417656/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        if (location.href.includes('www.zhihu.com/question/')) {
            var html = document.querySelector('html')
            var dialog = document.querySelectorAll('.Modal-wrapper')
            dialog.forEach(key => {
                key.style = 'display:none;!important'
            })
            html.style = 'overflow:auto;'
            console.log('知乎加载')
        }
    }
})();