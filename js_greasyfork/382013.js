// ==UserScript==
// @namespace    http://www.pish.com
// @name         图灵阅读
// @version      0.0.4
// @grant        none
// @match        https://www.ituring.com.cn/book/tupubarticle/*
// @match        https://www.ituring.com.cn/book/miniarticle/*
// @require      https://cdn.staticfile.org/jquery/3.3.0/jquery.min.js
// @description  提升图灵社区中电子书的在线阅读体验
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/382013/%E5%9B%BE%E7%81%B5%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/382013/%E5%9B%BE%E7%81%B5%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

$('div.container.book-page').siblings('.layout-head').hide();