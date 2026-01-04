// ==UserScript==
// @name        btyr
// @namespace    http://tampermonkey.net/
// @version       0.12
// @description  预加载视频图片
// @author       sp365
// @match        https://btyr.xyz/*
// @match        https://btwg.xyz/*
// @match        https://f6a6.com/*
// @match        http*://*/list.php?class=*
// @match        http*://*/movie.php?class=*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @license      none
// @license MIT   none
// @downloadURL https://update.greasyfork.org/scripts/435877/btyr.user.js
// @updateURL https://update.greasyfork.org/scripts/435877/btyr.meta.js
// ==/UserScript==
//注入页面的脚本文件

$(function() {

    function bt(){
        $('.capture img').each(
            function(){
                var src=$(this).attr('src');
                src=src.replace('thumb/','');
                $(this).attr('src', src);
            });

        var url=$('.download a')[0].href;
        var urlstr='';
        var data;
        $.ajax({
            url:url,
            type: 'get',
            data: data,
            success: function(res){
                //console.log(res);
                var href = res.match('[0-9a-zA-Z]{40}');
                // console.log((href));
                $('.download a')[0].href='magnet:?xt=urn:btih:'+href;
                //自己的数据过滤存储处理
            }
        });
    }
    var ur=window.location.href;
    if(ur.indexOf("movie")>1){
        //console.log('测试');
        setTimeout(bt,1000);
    }

    var res = '';
    var urls = document.querySelectorAll('.list li a');
    var s_urls = [];
    var defer = $.Deferred();

    for (i = 0; i < urls.length; i++) {
        console.log(i);
        var url = urls[i].href;
        s_urls.push(url);
    }
    //这一步必须要写，要不然下面的then无法使用
    defer.resolve($("#content_2015195").append(""));
    $.each(s_urls, function(i, e) { //i 是序列，e是数值
        defer = defer.then(function() {
            return $.ajax({
                url: e,
                method: 'get',
                success: function(data) {
                    res = data.match("<img src='(.*?)' width");
                    if (res !== null) {
                        console.log(e + '------' + res[1]);
                        var url = res[1];
                        url=url.replace('thumb/','');
                        document.querySelectorAll('.list li a')[i].outerHTML=document.querySelectorAll('.list li a')[i].outerHTML+'<p><img src="'+document.location.origin+url+'" width=300 />'
                    } else {
                        res = data.match("<img src='(.*?)' width");
                        if (res !== null) {
                            document.querySelectorAll('.list li a')[i].outerHTML=document.querySelectorAll('.list li a')[i].outerHTML+'<p><img src="'+document.location.origin+url+'" width=300 />'
                        }
                    }
                }
            })
        });
    });
    defer.done(function() {
        $("#content_2015195").append("ajax全部执行完成<br/>")
    });
})