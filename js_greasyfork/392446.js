// ==UserScript==
// @name         异次元内容过滤
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  异次元网站首页推介内容过滤
// @author       You
// @match        https://www.iplaysoft.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392446/%E5%BC%82%E6%AC%A1%E5%85%83%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/392446/%E5%BC%82%E6%AC%A1%E5%85%83%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#postlist").css("width","980px");
    $(".entry-mixed").css("width","980px");
    $(".entry-mixed .entry-container").css("width","750px");
    $("#section_hot").remove();
    $(".entry-recommend").remove();
    $("[class='entry']").remove();
    $(".entry-cat").css("color","red");
    $("#sidebar").remove();

})();