// ==UserScript==
// @name        yesewc1视频预览
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  yesewc1预加载视频图片
// @author       sht
// @match        http://www.yesewc1.com/*
// @grant        none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/423956/yesewc1%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/423956/yesewc1%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
//注入页面的脚本文件

jQuery(function() {
    var res = '';
    var urls = jQuery('a.s.xst');
    var s_urls = [];
    var defer = jQuery.Deferred();

    for (i = 0; i < urls.length; i++) {
        console.log(i);
        var url = urls[i].href;
        s_urls.push(url);
    }
    //这一步必须要写，要不然下面的then无法使用
    defer.resolve(jQuery("#content_2015195").append(""));
    jQuery.each(s_urls, function(i, e) { //i 是序列，e是数值
        defer = defer.then(function() {
            return jQuery.ajax({
                url: e,
                method: 'get',
                success: function(data) {
                    res = data.match(/\[img\](.*?)\[\/img\]/i);
                    if (res !== null) {
                        console.log(e + '------' + res[1]);
                   jQuery('a.s.xst').eq(i).append('<img src="'+res[1]+'" width=500 />');
                    } else {
                        res = data.match('file="(.*?)" onmouseover');
                        if (res !== null) {
                            jQuery('a.s.xst').eq(i).append('<img src="'+res[1]+'" width=500 />');
                        }
                    }
                }
            })
        });
    });
    defer.done(function() {
        jQuery("#content_2015195").append("ajax全部执行完成<br/>")
    });
})