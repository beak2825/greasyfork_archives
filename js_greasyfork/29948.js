// ==UserScript==
// @name        崩坏学园2Bug公示板图片自动放大
// @namespace    http://www.mihoyo.tech/
// @version      0.2
// @description  自动缩放Bug公示中的图片到合适的大小
// @author       yyuueexxiinngg
// @match        http://event.mihoyo.com/notice/news.php?*
// @grant        none
// @require    http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/29948/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2Bug%E5%85%AC%E7%A4%BA%E6%9D%BF%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/29948/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2Bug%E5%85%AC%E7%A4%BA%E6%9D%BF%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("img").css({"width":"800px","height":"500px"});

})();