// ==UserScript==
// @name         赚客吧增强
// @namespace    冉冉同学
// @version      0.2
// @description  赚客吧增强-显示帖子内容中的完整链接
// @author       冉冉同学
// @match        *://*.zuanke8.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421930/%E8%B5%9A%E5%AE%A2%E5%90%A7%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/421930/%E8%B5%9A%E5%AE%A2%E5%90%A7%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('.plc .pcb a').each(function () {
		console.log($(this).text())
		$(this).text($(this).attr('href')).css("word-break","break-all");
    });
})();
