// ==UserScript==
// @name         小红书++
// @namespace    shfeat
// @author       shfeat
// @version      0.1
// @description  显示小红书图片地址
// @include      http*://www.xiaohongshu.com/*
// @connect		 www.xiaohongshu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @require      http://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @homepageURL  https://greasyfork.org/zh-CN/scripts/386546-%E5%B0%8F%E7%BA%A2%E4%B9%A6
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/386546/%E5%B0%8F%E7%BA%A2%E4%B9%A6%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/386546/%E5%B0%8F%E7%BA%A2%E4%B9%A6%2B%2B.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$(document).ready(function() {
        $('.small-pic div i').each(function(i, item){
            var style = $(item).attr('style');
            var url = style.replace(/.+url\("(\/\/[^?]+).+/, '$1');
            $('.note-top').prepend('<p>http:'+url+'</p>');
        });
    });
})();