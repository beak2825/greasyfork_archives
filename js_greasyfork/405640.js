// ==UserScript==
// @name        sht视频预览
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  预加载视频图片
// @author       sht
// @match        https://www.qwewqq.xyz/*
// @match        https://www.reewre123.xyz/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405640/sht%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/405640/sht%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
//注入页面的脚本文件

jQuery(function() {
    var urls = jQuery('a.s.xst').map(function() { return this.href; }).get();
    var defer = jQuery.Deferred();
   defer.resolve(jQuery("#content_2015195").append(""));
    urls.forEach(function(url, i) {
        defer = defer.then(function() {
            return jQuery.ajax({
                url: url,
                method: 'get',
                success: function(data) {
                    var imgSrc = data.match(/\[img\](.*?)\[\/img\]/i) || data.match(/file="(.*?)" onmouseover/);
                    if (imgSrc) {
                        jQuery('a.s.xst').eq(i).append('<img src="' + imgSrc[1] + '" width=500 />');
                    }
                }
            });
        });
    });

    defer.done(function() {
        jQuery("#content_2015195").append("AJAX全部执行完成<br/>");
    });
});
