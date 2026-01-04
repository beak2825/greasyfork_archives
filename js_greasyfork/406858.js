// ==UserScript==
// @name         强制页面链接在当前页面打开
// @namespace    https://www.acy.moe
// @supportURL   https://www.acy.moe
// @version      0.2
// @description  强制页面链接在当前页面打开，不再跳转新的标签页
// @author       NEET姬
// @include         http://*
// @include         https://*
// @match             *://*/*
// @downloadURL https://update.greasyfork.org/scripts/406858/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/406858/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("a").attr("target","_self");

})();