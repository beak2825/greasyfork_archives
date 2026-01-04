// ==UserScript==
// @name         禁止打开网页跳转新标签
// @namespace    https://www.acy.moe
// @supportURL   https://www.acy.moe
// @version      0.2
// @description  禁止打开网页跳转新标签 使其在当前标签进行跳转
// @author       NEET姬
// @include         http://*
// @include         https://*
// @match             *://*/*
// @downloadURL https://update.greasyfork.org/scripts/406857/%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E8%B7%B3%E8%BD%AC%E6%96%B0%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/406857/%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E8%B7%B3%E8%BD%AC%E6%96%B0%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
$('a[target="_blank"]').removeAttr('target');

})();