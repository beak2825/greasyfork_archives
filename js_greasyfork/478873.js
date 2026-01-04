// ==UserScript==
// @name         在新标签页打开帖子 (bbs.oldmantvg.net)
// @version      1.2
// @description  Open threads on bbs.oldmantvg.net in new tab.
// @author       vDtv3vNZoE5d
// @match        https://bbs.oldmantvg.net/*
// @grant        none
// @license MIT
// @namespace http://yournamespace.com
// @downloadURL https://update.greasyfork.org/scripts/478873/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90%20%28bbsoldmantvgnet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478873/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90%20%28bbsoldmantvgnet%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有包含链接的<div class="card-body">元素
    var cardBodies = document.querySelectorAll('div.card-body');

    // 遍历每个<div class="card-body">元素
    for (var i = 0; i < cardBodies.length; i++) {
        var cardBody = cardBodies[i];
        
        // 获取在当前<div class="card-body">内的所有链接
        var links = cardBody.querySelectorAll('a');
        
        // 遍历链接并设置它们在新标签页中打开
        for (var j = 0; j < links.length; j++) {
            links[j].setAttribute('target', '_blank');
        }
    }
})();