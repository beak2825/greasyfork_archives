// ==UserScript==
// @name         移除超星视频播放光标监听
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除超星网站播放视频时，对光标监听
// @author       Albresky
// @license      MIT
// @match        *://*.chaoxing.com/*
// @downloadURL https://update.greasyfork.org/scripts/508089/%E7%A7%BB%E9%99%A4%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%85%89%E6%A0%87%E7%9B%91%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/508089/%E7%A7%BB%E9%99%A4%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%85%89%E6%A0%87%E7%9B%91%E5%90%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeMouseListener() {
      $(window).off('mousemove');
      $(document).off('mousemove');
      $(window).off('mouseover');
      $(document).off('mouseover');
    }


    $(setTimeout(removeMouseListener, 2000));
})();