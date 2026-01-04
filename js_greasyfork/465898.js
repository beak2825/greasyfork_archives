// ==UserScript==
// @name         jrkan取消打开网页就弹窗提示
// @namespace    jrkan
// @version      0.1
// @description  取消打开网页就弹窗提示
// @author       ss
// @match        http://www.jrskan.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465898/jrkan%E5%8F%96%E6%B6%88%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E5%B0%B1%E5%BC%B9%E7%AA%97%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/465898/jrkan%E5%8F%96%E6%B6%88%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E5%B0%B1%E5%BC%B9%E7%AA%97%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log(111)
    window.confirm = function(){return true}
})();