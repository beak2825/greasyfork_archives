// ==UserScript==
// @name         无损生活播放器悬浮
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  将播放器和搜索栏以悬浮样式显示
// @author       Nihaorz
// @match        https://flac.life/
// @icon         https://flac.life/img/logo.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497274/%E6%97%A0%E6%8D%9F%E7%94%9F%E6%B4%BB%E6%92%AD%E6%94%BE%E5%99%A8%E6%82%AC%E6%B5%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/497274/%E6%97%A0%E6%8D%9F%E7%94%9F%E6%B4%BB%E6%92%AD%E6%94%BE%E5%99%A8%E6%82%AC%E6%B5%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.main .search').css('position', 'fixed').css('left', '10px').css('bottom', '10px');
    // Your code here...
})();