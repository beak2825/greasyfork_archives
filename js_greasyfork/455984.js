// ==UserScript==
// @name         黑白灰色网页恢复彩色
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  哀悼日，纪念日等黑白，灰色网页色彩恢复。支持所有网页。高性能。
// @author       zdd
// @license MIT
// @match        *://*
// @match        *://*/*
// @match        *://*.*
// @match        *://*.*/*
// @match        *://*.*.*
// @match        *://*.*.*/*
// @match        *://*.com
// @match        *://*.com/*
// @match        *://*.com.cn
// @match        *://*.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455984/%E9%BB%91%E7%99%BD%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455984/%E9%BB%91%E7%99%BD%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 筛选灰色元素节点去掉灰色
    function traversalUsingNodeIterator(node){
        const filters = {
            acceptNode(node) {
                const isGray = window.getComputedStyle(node).filter.includes('grayscale') || window.getComputedStyle(node).webkitFilter.includes('grayscale')
                return isGray ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        }
        var iterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT, filters);

        node = iterator.nextNode();
        while(node != null){
            node.style.webkitFilter = 'grayScale(0)'
            node.style.filter = 'grayScale(0)'
            node = iterator.nextNode();
        }
    }

    const htmlEle = document.getElementsByTagName('html')[0];
    traversalUsingNodeIterator(htmlEle);
})();