// ==UserScript==
// @name         HLTV 阅读优化
// @namespace    https://greasyfork.org/zh-CN/scripts/433258
// @version      1.2.0
// @description  HLTV 阅读优化，关闭广告
// @author       StarUDream
// @license      Apache License 2.0
// @match        *://*.hltv.org/*
// @grant        none
// @icon         https://www.hltv.org/img/static/favicon/favicon-16x16.png
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433258/HLTV%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/433258/HLTV%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var $ = window.jQuery;

    $('img[class="day-only"]').not('[title]').remove();
    $('img[class="night-only"]').not('[title]').remove();
    $('body').css('background-image', 'none');
    $('.yabo-firstcol-box').remove();
    $('.world-ranking-right').remove();
    $('#betting').remove();
})();
