// ==UserScript==
// @name         升学e网通顺畅不暂停学习神器 (2022年7月可用)
// @namespace    codeboy.ewt360.video-autoclick
// @version      1.3
// @description  自动点击“升学e网通”视频播放页的播放按键, 实现视频不暂停；致力于达到更好的效率, 不必再注意视频是否暂停.
// @author       codeboy
// @match        http://web.ewt360.com/site-study/*
// @match        https://web.ewt360.com/site-study/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
/* globals jQuery, $, waitForKeyElements */
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448101/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E9%A1%BA%E7%95%85%E4%B8%8D%E6%9A%82%E5%81%9C%E5%AD%A6%E4%B9%A0%E7%A5%9E%E5%99%A8%20%282022%E5%B9%B47%E6%9C%88%E5%8F%AF%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448101/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E9%A1%BA%E7%95%85%E4%B8%8D%E6%9A%82%E5%81%9C%E5%AD%A6%E4%B9%A0%E7%A5%9E%E5%99%A8%20%282022%E5%B9%B47%E6%9C%88%E5%8F%AF%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){var cX = $("div[id='replaybtn']:visible").click();}, 1000);
})();
