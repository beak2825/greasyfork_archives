// ==UserScript==
// @name         remove bg
// @namespace    https://www.douban.com/people/MoNoMilky/
// @version      0.2
// @description  去除豆瓣小组帖子马赛克水印
// @author       bambooom
// @match        https://www.douban.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440229/remove%20bg.user.js
// @updateURL https://update.greasyfork.org/scripts/440229/remove%20bg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.article').css('background', 'none');
})();