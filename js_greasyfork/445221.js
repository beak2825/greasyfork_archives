// ==UserScript==
// @name         自动关闭张鑫旭博客ADBlock用户特供广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Taiyuuki
// @match      *://www.zhangxinxu.com/*
// @description  张鑫旭是前端界的大佬，他写的几本书我全买了，他的博客可谓业界良心，但他很不厚道的为ADBlock用户提供了专属广告，对此我表示非常理解，所以要自动将其关闭。
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhangxinxu.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/445221/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%A0%E9%91%AB%E6%97%AD%E5%8D%9A%E5%AE%A2ADBlock%E7%94%A8%E6%88%B7%E7%89%B9%E4%BE%9B%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445221/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%A0%E9%91%AB%E6%97%AD%E5%8D%9A%E5%AE%A2ADBlock%E7%94%A8%E6%88%B7%E7%89%B9%E4%BE%9B%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


function filter(node){
    // 方便以后修改
    return node.tagName.match(/^[a-zA-Z]{4}-[a-zA-Z]{2}$/)
}

(function() {
    'use strict';
    // Your code here...
    var root = document.querySelector('body');
    var iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function(node) {
            var style = getComputedStyle(node)
            if (style.position === 'fixed') {
                return NodeFilter.FILTER_ACCEPT;
            } else {
                return NodeFilter.FILTER_REJECT;
            }
        }
    }, false);
    var node = iterator.nextNode();
    while (node != null) {
        if (filter(node)) {
            return node.remove();
        }
        node = iterator.nextNode();
    }
})();