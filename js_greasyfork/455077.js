// ==UserScript==
// @name         学起Plus自动刷课
// @namespace    https://yaw.ee/
// @version      0.13
// @description  用于弘成学起Plus自动刷课
// @author       Yawee
// @match        *://*.sccchina.net/*
// @match        *://*.chinaedu.net/*
// @require      https://lib.baomitu.com/jquery/1.11.1/jquery.min.js
// @connect      chinaedu.net
// @icon         https://pp.myapp.com/ma_icon/0/icon_53875840_1667990262/256
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455077/%E5%AD%A6%E8%B5%B7Plus%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455077/%E5%AD%A6%E8%B5%B7Plus%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(() => {
        console.log('加载成功');
        var yaweeBtn = '<div id="yawee" style="position:fixed;top:0;left:0;right:0;width:100%;height:50px;line-height:50px;text-align:center;margin:auto;border-radius:0 0 10px 10px;background:#2196f3;color:#fff;z-index:999999">点击此处开启自动刷课</div>';
        var yaweeabsBtn = '<div id="yawee" style="position:absolute;top:0;left:0;right:0;width:100%;height:50px;line-height:50px;text-align:center;margin:auto;border-radius:0 0 10px 10px;background:#2196f3;color:#fff;z-index:999999">点击此处开启自动刷课</div>';
        $('#videoFrame').append(yaweeBtn);
        $('#draggable').children('#video').append(yaweeBtn);
        if(document.getElementsByTagName('iframe')[0]){}else{
            $('.lc-learn-frame__bd').append(yaweeabsBtn);
        }
        $('#yawee').on('click',function(){
            $(this).css('background','#4caf50').text('已开启自动刷课');
            document.getElementsByTagName('video')[0].play();
        });
        //去除弹窗
        $('#pop,#cover').hide();
        setTimeout(() => {
            //如果含有 iframe
            if(document.getElementsByTagName('iframe')[0]){
                var yaweeIframeVideo = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementsByTagName('video')[0];
                yaweeIframeVideo.autoplay = true;
                yaweeIframeVideo.muted = true;
                yaweeIframeVideo.onended = function() {
                    console.log('iframe内课程播放完成');
                    yaweeEnd();
                    yaweeIframeVideo.play();
                };
                $('#yawee').click();
            }
            //如果视频存在
            if(document.getElementsByTagName('video')[0]){
                $('#frameVideo').attr('allow','autoplay');
                $('#videoFrame_video_html5_api').attr('muted','');
                //document.getElementById('video_video_html5_api').muted = true;
                document.getElementsByTagName('video')[0].autoplay = true;
                document.getElementsByTagName('video')[0].muted = true;
                if($('.vjs-control-bar .vjs-playing').length == 1){
                    console.log('课程播放中');
                    $('#yawee').css('background','#4caf50').text('已开启自动刷课');
                }
                document.getElementsByTagName('video')[0].onended = function() {
                    console.log('课程播放完成');
                    yaweeEnd();
                    $(".vjs-big-play-button")[0].click();
                    document.getElementById('videoFrame_video_html5_api').play();
                };
            }else{
                doNext().click();
            }
        },1000);
        function yaweeEnd() {
            // 获取url
            var yaweeUrl = window.location.origin + window.location.pathname;
            //遍历所有课程
            $(".is-learning .activity li").each(function(index){
                if($(this).attr('class') == 'cur'){
                    index = index + 1;
                    var yaweeNext = $(".is-learning .activity li")[index].id.slice(8);
                    doNext().click();
                    //window.location.href = yaweeUrl + '?userCourseId=' + userCourseId.value + '&trainCourseId=' + trainCourseId.value + '&courseVersionId=' + courseVersionId.value + '&courseActivityId=' + yaweeNext;
                }
            });
        }
    })
})();