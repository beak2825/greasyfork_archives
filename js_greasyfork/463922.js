// ==UserScript==
// @name         油猴新标签打开
// @namespace    none
// @version      0.1.2
// @description  哒哒伽的第一个测试脚本，用来在油猴页面点击链接跳转新的页面打开！
// @author       哒哒伽
// @include      *://greasyfork.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463922/%E6%B2%B9%E7%8C%B4%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/463922/%E6%B2%B9%E7%8C%B4%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var alists = document.getElementsByTagName("a");
    for (let i = 0; i < alists.length; i++) {
        alists[i].setAttribute('target', '_blank')
    }
})();