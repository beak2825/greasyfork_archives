// ==UserScript==
// @name         无空格混排
// @namespace    remove-the-fucking-whitespace
// @version      0.1
// @description 近几年中文互联网技术圈有一种非常不好的风气：用空格来分隔中英文和数字。这个脚本就是来删除其中的空格，让中文网页重新变得可读。
// @author       DING Yu
// @include        http*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27882/%E6%97%A0%E7%A9%BA%E6%A0%BC%E6%B7%B7%E6%8E%92.user.js
// @updateURL https://update.greasyfork.org/scripts/27882/%E6%97%A0%E7%A9%BA%E6%A0%BC%E6%B7%B7%E6%8E%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var s = document.body.innerHTML;
    var p = /([\u4E00-\u9FA5\uF900-\uFA2D])(\s)([a-zA-Z0-9])/g;
    s = s.replace(p, "$1$3");
    p = /([a-zA-Z0-9])(\s)([\u4E00-\u9FA5\uF900-\uFA2D])/g;
    s = s.replace(p, "$1$3");
    document.body.innerHTML = s;

})();