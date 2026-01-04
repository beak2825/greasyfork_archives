// ==UserScript==
// @name         升学e网通自动点击工具
// @namespace    myitian.ewt360.video-autoclick
// @version      1.01
// @description  自动点击“升学e网通”课程视频。
// @author       张语诚ZYC
// @match        http://web.ewt360.com/site-study/*
// @match        https://web.ewt360.com/site-study/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @license MIT
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/448431/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/448431/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

var int=window.setInterval(function(){var cX = $("div[class='earnest_check_mask_box']");cX.click();},4000);