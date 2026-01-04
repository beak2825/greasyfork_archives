// ==UserScript==
// @name         恢复百度地图标记点文本编辑
// @description  同上
// @namespace    https://xpc.im
// @version      0.1
// @author       xiaopc
// @match        https://map.baidu.com/*
// @icon         https://map.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452453/%E6%81%A2%E5%A4%8D%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%E6%A0%87%E8%AE%B0%E7%82%B9%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/452453/%E6%81%A2%E5%A4%8D%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%E6%A0%87%E8%AE%B0%E7%82%B9%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.t = setInterval(()=>[...document.getElementsByTagName("input")].forEach(e => e.disabled=false), 2000);
})();