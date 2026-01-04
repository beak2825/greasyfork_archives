// ==UserScript==
// @name         sis001
// @namespace    https://greasyfork.org/zh-CN/scripts/444780-sis001/code
// @version      0.1.5
// @description  sis001论坛预加载视频图片
// @author       sht
// @match        https://104.194.212.31/*
// @match        http://h1s2.com/*
// @grant        none
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444780/sis001.user.js
// @updateURL https://update.greasyfork.org/scripts/444780/sis001.meta.js
// ==/UserScript==
//注入页面的脚本文件

jQuery(function() {
    //1.去除网页广告 2.添加在新窗口打开 3.增加视频图片预览 4.添加种子下载，磁力链接下载

    function urls(guize) {
        var res = '';
        var urls = document.querySelectorAll(guize);
        var s_urls = [];
        var i;
        for (i = 0; i < urls.length; i++) {
            console.log(i);
            var url = urls[i].href;
            s_urls.push(url);
        }
        return s_urls;
    }

    function addimg(shuzu,guize,imgguize) {
        var defer = jQuery.Deferred();
        //这一步必须要写，要不然下面的then无法使用
        defer.resolve(jQuery("#content_2015195").append(""));
        jQuery.each(shuzu, function(i, e) { //i 是序列，e是数值
            defer = defer.then(function() {
                return jQuery.ajax({
                    url: e,
                    method: 'get',
                    success: function(data) {
                        var res = data.match(imgguize);
                        if (res !== null) {
                            console.log(e + '------' + res[1]);
                            document.querySelectorAll(guize)[i].setAttribute('target','_blank');
                            document.querySelectorAll(guize)[i].outerHTML = document.querySelectorAll(guize)[i].outerHTML + '<p><img src="' + res[1] + '" width=400 />';
                        } else {
                            res = data.match('file="(.*?)" onmouseover');
                            if (res !== null) {
                                document.querySelectorAll(guize)[i].outerHTML = document.querySelectorAll(guize)[i].outerHTML + '<img src="' + res[1] + '" width=400 />';
                            }
                        }
                    }
                })
            });
        });
        defer.done(function() {
            jQuery("#content_2015195").append("ajax全部执行完成<br/>")
        });
    }

    var guize='.common span a';
    var guize1='.new span a';
    var guize2='.lock span a';
    var imgguize=/\<img src\=\"(.*?)\"\ border\=\"0\"\ onclick/i;

    function work(guize,imgguize){
        var ss=urls(guize);
        addimg(ss,guize,imgguize);
        jQuery('.ad_text').remove();
        jQuery('#rules').remove();
    }
    work(guize,imgguize)
    work(guize1,imgguize)
    work(guize2,imgguize)

    function bt(){
        var ff=urls('.t_attachlist dt a');
        console.log('aaaa'+ff);
        ff.forEach(function(e,i){
            if(e.indexOf('attachment.php?aid=')>0){
                // console.log('bbbb'+e);
                document.querySelectorAll('.t_attachlist dt a')[i].href = e+'&clickDownload=1';
                document.querySelectorAll('.t_attachlist dt a')[i].innerText='种子下载';

                var magnet=document.querySelectorAll('.t_msgfont')[0].outerText;
                var str = magnet.match('[0-9a-zA-Z]{40}');
                document.querySelectorAll('.t_attachlist dt a')[i+1].href = 'magnet:?xt=urn:btih:'+str;
                document.querySelectorAll('.t_attachlist dt a')[i+1].innerText='磁力下载';
                jQuery('.ad_text').remove();
            }
        })
    }

    var ur=window.location.href;
    if(ur.indexOf("forum")>1){
        console.log('启动了 ');
        setTimeout(bt,500);
    }


})