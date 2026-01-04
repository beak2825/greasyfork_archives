// ==UserScript==
// @name         极安全网
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在当前页面打开超链接
// @author       You
// @match        https://www.lisect.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378273/%E6%9E%81%E5%AE%89%E5%85%A8%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/378273/%E6%9E%81%E5%AE%89%E5%85%A8%E7%BD%91.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    $(".box a[target=_blank]").removeAttr("target");
    $("a:contains(字幕组)").attr("href", "http://www.zmz2019.com/");
});