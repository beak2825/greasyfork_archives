// ==UserScript==
// @name        解除网页右键及选词
// @version      V1.1.1
// @description  某些网站可能会禁用选词和右键点击，这个脚本可以解除网页选词及右键功能。
// @author       Sohoad
// @match        *://*/*
// @grant        none
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @namespace https://greasyfork.org/users/1291508
// @downloadURL https://update.greasyfork.org/scripts/533779/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E5%8F%8A%E9%80%89%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/533779/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E5%8F%8A%E9%80%89%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解除右键限制
    document.oncontextmenu = function() { return true; };

    // 解除选词限制
    document.onselectstart = function() { return true; };

    // 解除复制/剪切/粘贴限制
    document.oncopy = document.oncut = document.onpaste = function() { return true; };

    // 移除CSS中的user-select限制
    var style = document.createElement('style');
    style.innerHTML = '* { user-select: text !important; -webkit-user-select: text !important; }';
    document.head.appendChild(style);

    console.log('网页限制已解除');
})();