// ==UserScript==
// @name         小李探花
// @namespace    http://tampermonkey.net/
// @version      0.361
// @description  预加载视频图片
// @author       You
// @match        https://tanhuazu.com/*
// @match        https://tanhuazu.xyz/*
// @grant        GM_xmlhttpRequest
// @grant        none
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458932/%E5%B0%8F%E6%9D%8E%E6%8E%A2%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/458932/%E5%B0%8F%E6%9D%8E%E6%8E%A2%E8%8A%B1.meta.js
// ==/UserScript==
//注入页面的脚本文件
jQuery(function() {

    function bt(){
        jQuery('p.attnm a')[0].outerHTML=jQuery('p.attnm a')[0].outerHTML.replace('imc_attachad-ad.html?','forum.php?mod=attachment&');

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://s1.obdown.com/do.php?filename=bdda0c48eca50.torrent",
            onload: function(response) {
                //这里写处理函数
                console.log(response);
            }
        });
    }
    var ur=window.location.href;
    if(ur.indexOf("viewthread&tid")>1){
        //console.log('测试');
        setTimeout(bt,1000);
    }

    var res = '';
    var urls = jQuery('.structItem-title a');
    var s_urls = [];
    var defer = jQuery.Deferred();

    for (i = 0; i < urls.length; i++) {
        console.log(i);
        var url = urls[i].href;
        s_urls.push(url);
        console.log(s_urls);
    }
    //这一步必须要写，要不然下面的then无法使用
    defer.resolve(jQuery("#content_2015195").append(""));
    jQuery.each(s_urls, function(i, e) { //i 是序列，e是数值
        defer = defer.then(function() {
            return jQuery.ajax({
                url: e,
                method: 'get',
                success: function(data) {
                    console.log(data);
                    //res = data.match('zoomfile="(.*?)" file');
                    res = data.match('data-src="(.*?)" data-lb-sidebar-href');
                    if (res !== null) {
                        console.log(e + '------' + res[0]+ '------' + res[1]);
                        document.querySelectorAll('.structItem-title a')[i].outerHTML = document.querySelectorAll('.structItem-title a')[i].outerHTML + '<p><img src="' + res[1] + '" width=500 />';

                    } else {
                        res = data.match('<img class="fancybox-image" src="(.*?)">');
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

})