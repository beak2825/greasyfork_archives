// ==UserScript==
// @name         小报童解除文本无法选择的限制
// @namespace    http://tampermonkey.net/
// @version      202303311512
// @description  gpt来帮我写的简单脚本
// @author       Dulk
// @match        https://xiaobot.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaobot.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462884/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E8%A7%A3%E9%99%A4%E6%96%87%E6%9C%AC%E6%97%A0%E6%B3%95%E9%80%89%E6%8B%A9%E7%9A%84%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/462884/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E8%A7%A3%E9%99%A4%E6%96%87%E6%9C%AC%E6%97%A0%E6%B3%95%E9%80%89%E6%8B%A9%E7%9A%84%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = '.forbidd { user-select: text !important; }';
    document.head.appendChild(style);
    
})();