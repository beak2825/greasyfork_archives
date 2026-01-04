// ==UserScript==
// @name         煎鱼博客自动显示全文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set height to 999999px for element with ID "articles"
// @author       Your Name
// @match        https://eddycjy.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503690/%E7%85%8E%E9%B1%BC%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/503690/%E7%85%8E%E9%B1%BC%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取ID为article的元素
    var element = document.getElementById('articles');

    // 如果元素存在，修改它的样式
    if (element) {
        element.style.position = 'relative';
        element.style.height = '100%';
        element.style.overflow = 'hidden';
    }

})();