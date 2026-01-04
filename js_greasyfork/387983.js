// ==UserScript==
// @name         桃花族视频区预加载修改版
// @namespace    http://tampermonkey.net/
// @version      0.38
// @description  预加载视频图片
// @author       You
// @match        http://*/forum*
// @grant        none
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/387983/%E6%A1%83%E8%8A%B1%E6%97%8F%E8%A7%86%E9%A2%91%E5%8C%BA%E9%A2%84%E5%8A%A0%E8%BD%BD%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/387983/%E6%A1%83%E8%8A%B1%E6%97%8F%E8%A7%86%E9%A2%91%E5%8C%BA%E9%A2%84%E5%8A%A0%E8%BD%BD%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==
//注入页面的脚本文件
//
jQuery(function() {
    var res = '';
    var urls = jQuery('td.num a');
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
                    //res = data.match('zoomfile="(.*?)" file');
                    res = data.match('file="(.*?)" ');
                    if (res !== null) {
                        console.log(e + '------' + res[0] + '------' + res[1]);
                        jQuery("[src='static/image/filetype/image_s.gif']").eq(0).attr({
                            'src': res[1],
                            'width': '500'
                        });
                    } else {
                        res = data.match('file="(.*?)" onmouseover');
                        if (res !== null) {
                            jQuery("[src='static/image/filetype/image_s.gif']").eq(0).attr({
                                'src': res[1],
                                'width': '500'
                            });
                        }
                    }
                }
            })
        });
    });

    defer.done(function() {
        jQuery("#content_2015195").append("ajax全部执行完成<br/>")
    });

    function bt() {
        var urls = jQuery('p.attnm a');
        var s_urls = [];

        for (i = 0; i < urls.length; i++) {
            jQuery('p.attnm a')[i].outerHTML = jQuery('p.attnm a')[i].outerHTML.replace('imc_attachad-ad.html?', 'forum.php?mod=attachment&');
            jQuery('p.attnm a')[i].outerHTML = '<a target="_blank" href=' + jQuery('p.attnm a')[i].href + '>下载地址</a>';
        }
    }

    var ur = window.location.href;
    if (ur.indexOf("viewthread&tid") > 1) {
        //console.log('测试');
        setTimeout(bt, 5000);
    }
})