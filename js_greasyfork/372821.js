// ==UserScript==
// @name         音悦台视频免会员看1080p，增加下载视频功能
// @namespace    https://zhang18.top
// @version      0.5.2
// @description  音悦台视频免会员看1080p(如果有，否则选目前清晰度最高)，视频下载，把原来点击下载却进入注册登录界面的链接直接替换成视频下载链接，直接进入下载，支持1080p(同上)，第一次使用会申请跨域请求，请允许该操作。
// @author       ZLOE
// @match        http://v.yinyuetai.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/372821/%E9%9F%B3%E6%82%A6%E5%8F%B0%E8%A7%86%E9%A2%91%E5%85%8D%E4%BC%9A%E5%91%98%E7%9C%8B1080p%EF%BC%8C%E5%A2%9E%E5%8A%A0%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/372821/%E9%9F%B3%E6%82%A6%E5%8F%B0%E8%A7%86%E9%A2%91%E5%85%8D%E4%BC%9A%E5%91%98%E7%9C%8B1080p%EF%BC%8C%E5%A2%9E%E5%8A%A0%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取视频下载链接
    function get_down_url(){
        var text = $('meta[property="og:url"]').attr("content")
        var id = text.split('/')[4]
        //var url = 'http://www.yinyuetai.com/api/info/get-video-urls?videoId='+id
        var url = 'http://www.yinyuetai.com/insite/get-video-info?json=true&videoId='+id
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            dataType: 'JSON',
            onload: function(res) {
                console.log("请求HTML成功！")
                if (res.status == 200) {
                    //jq解析json
                   var find_text =  jQuery.parseJSON(res.response).videoInfo.coreVideoInfo.videoUrlModels
                   try
                   {
                       var find = find_text[3].videoUrl
                   }
                    catch(err){
                        find = find_text.find_text[2].videoUrl
                    }
                    //添加进下载链接

                    $('.down-icon').after('<li class="li down-icon"><a href="'+find+'" target="_blank">下载</a></li>')
                    $('.down-icon').eq(0).remove()

                    //console.log($('#video').attr('src'))
                   //替换视频url
                    if (find.length !=0){
                        play()
                    }
                    else{
                        console.log("没有视频源")
                    }
                }

            }
        });

    }
     //判断是否有链接，有就替换掉播放源
    function play(){
        var find = $('.down-icon a').attr('href')
        $('#video').attr('src',find)
        var to = $('#video').attr('src')
        //验证是否切换成功
        if (to == find){
            console.log("替换播放源成功！")
            $('.vp-resolution-basebar').remove()

        }else{
            window.setTimeout($('#video').attr('src',find),3000)
            console.log("尝试二次替换")
        }

    }
    //强制html5
    function html5(){
        var text = window.location.href
        var a = text.split('/')
        var id = a[4]
        if (id != 'h5'){
        var url = 'http://v.yinyuetai.com/video/h5/'+id
        window.location.href = url
        }else{
            console.log("跳转成功")
        }
    }
    //主控制程序
   html5()
    window.setTimeout( get_down_url,1000)


    // Your code here...
})();