// ==UserScript==
// @name         小红书++
// @namespace    maple
// @author       maple
// @version      0.1
// @description  显示小红书关键字
// @include      http*://www.xiaohongshu.com/*
// @connect		 www.xiaohongshu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @require      http://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435185/%E5%B0%8F%E7%BA%A2%E4%B9%A6%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/435185/%E5%B0%8F%E7%BA%A2%E4%B9%A6%2B%2B.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$(document).ready(function() {
        var content = $('head meta[name=keywords]').attr('content');
        $('.note-top').prepend('<p>keywords:' +content+'</p>');
    });
})();