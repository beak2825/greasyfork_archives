// ==UserScript==
// @name         乌云镜像站点pre美化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化乌云镜像站点的pre标签,原始超长内容不展示,不方便查看,稍微修改了一下样式.
// @author       Mrxn
// @homepage     https://mrxn.net/
// @supportURL   https://github.com/Mr-xn/
// @license      MIT
// @run-at       document-end
// @match        https://wy.zone.ci/*
// @icon         https://wy.zone.ci/favicon.ico
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zone.ci
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481287/%E4%B9%8C%E4%BA%91%E9%95%9C%E5%83%8F%E7%AB%99%E7%82%B9pre%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481287/%E4%B9%8C%E4%BA%91%E9%95%9C%E5%83%8F%E7%AB%99%E7%82%B9pre%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const all_preelements = document.querySelectorAll('pre');
    for (let index = 0; index < all_preelements.length; index++) {
        // 使用setAttribute方法添加 !important
        all_preelements[index].setAttribute('style', 'overflow-x: scroll !important;');
        // 如果不需要 !important，可以直接赋值
        // all_preelements[index].style.overflowX = 'scroll';
    }
})();