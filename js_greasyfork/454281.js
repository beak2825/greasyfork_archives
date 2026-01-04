// ==UserScript==
// @name         使网页可编辑
// @namespace    contenteditable
// @version      0.1
// @description  对于网页中无法复制的区域，本脚本为网页启用 contenteditable 属性，使网页可以像编辑器一样自由编辑，解决无法复制问题
// @author       欧阳鹏
// @match        *://blog.csdn.net/*
// @match        *://wenku.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454281/%E4%BD%BF%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/454281/%E4%BD%BF%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.querySelector('body').setAttribute('contenteditable', 'true')
})();