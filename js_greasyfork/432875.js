// ==UserScript==
// @name         谷歌搜索结果居中,输入框扩大
// @namespace    http://tampermonkey.net/
// @version 0.91
// @description  谷歌搜索结果居中，输入框扩大。body切换grid布局，内容居中，搜索框拉长
// @author       nyaxs
// @match        https://www.google.com/search*
// @run-at       document-start
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/432875/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD%2C%E8%BE%93%E5%85%A5%E6%A1%86%E6%89%A9%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/432875/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD%2C%E8%BE%93%E5%85%A5%E6%A1%86%E6%89%A9%E5%A4%A7.meta.js
// ==/UserScript==
 

(function() {
        'use strict';
        var style=document.createElement('style');
        var cssStyle='@media(min-width:1410px){body {display:grid !important; justify-content:center;}  form .RNNXgb{width:70vw !important;} .GeTMDd{width:100% !important}';
        style.innerText=cssStyle;
        document.querySelector('head').appendChild(style);
    }
)();