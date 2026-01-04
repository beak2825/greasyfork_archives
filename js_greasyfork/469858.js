// ==UserScript==
// @name         自动展开手机乐园历史版本
// @namespace    https://axutongxue.com/
// @version      1.0
// @author       阿虚同学
// @description  自动展开手机乐园全部历史版本下载链接
// @license      MIT
// @match        *://*.shouji.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469858/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%89%8B%E6%9C%BA%E4%B9%90%E5%9B%AD%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469858/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%89%8B%E6%9C%BA%E4%B9%90%E5%9B%AD%E5%8E%86%E5%8F%B2%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const moreVersionSpan = document.querySelector('span#moreVersion');
    if (moreVersionSpan && moreVersionSpan.style) {
        moreVersionSpan.removeAttribute('style');
    }
})();