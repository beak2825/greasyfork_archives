// ==UserScript==
// @name         B站白色弹幕显示增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  增强B站白色弹幕可见性
// @author       You
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536110/B%E7%AB%99%E7%99%BD%E8%89%B2%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/536110/B%E7%AB%99%E7%99%BD%E8%89%B2%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
        document.removeEventListener('DOMContentLoaded', arguments.callee, false);
        var node = document.createElement('style')
        node.innerText = ".bili-dm, .bili-high-text, .bili-danmaku-x-dm, .bili-danmaku-x-show, .bili-danmaku-x-high-text {text-shadow: 0px 0px 5px purple !important;}"
        document.body.appendChild(node)

    // Your code here...
})();