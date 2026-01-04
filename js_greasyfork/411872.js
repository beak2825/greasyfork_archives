// ==UserScript==
// @name         屏蔽99广告
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  屏蔽99广告脚本
// @author       You
// @match        *://www.91porn.com/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411872/%E5%B1%8F%E8%94%BD99%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/411872/%E5%B1%8F%E8%94%BD99%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    $('.ad_img').hide();
	$('#row iframe').css('display','none');
	$('#videodetails iframe').css('display','none');

   
})();