// ==UserScript==
// @name        sis001视频预览
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  预加载视频图片
// @author       sis001
// @match        http://38.103.161.143/*
// @match        http://23.225.172.98/*
// @grant        none
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// http://38.103.161.143/forum/archiver/fid-25.html
// @downloadURL https://update.greasyfork.org/scripts/391089/sis001%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/391089/sis001%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
//注入页面的脚本文件

 var url;
    function qzj(str,b,a){
var bds=b+'(\\S*)'+a;
return str.match(bds)[1];
}
    url=window.location.href;
    if(url.indexOf("forum/archiver/tid")>1){
        ad();
    }

   function ad()
    {
     window.location.href='http://38.103.161.143/forum/viewthread.php?tid='+qzj(url,'tid-','.html');
    }

jQuery(function() {
    var res = '';
    var urls = jQuery('.archiver_threadlist li a');
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
                   jQuery('.archiver_threadlist li a').eq(i).append('<img src="'+res[1]+'" width=500 />');
                    } else {
                        res = data.match('file="(.*?)" onmouseover');
                        if (res !== null) {
                            jQuery('.archiver_threadlist li a').eq(i).append('<img src="'+res[1]+'" width=500 />');
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