// ==UserScript==
// @name         学起Plus弘成教育挂课自动连续播放机构版自动下一集自动挂机批量无人值守视频作业
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  弘成教育挂课自动连续播放
// @author       小助手定制
// @match        *://*.chinaedu.net/*
// @require      https://lib.baomitu.com/jquery/1.11.1/jquery.min.js
// @match        *://*.sccchina.net/*
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476666/%E5%AD%A6%E8%B5%B7Plus%E5%BC%98%E6%88%90%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E6%9C%BA%E6%9E%84%E7%89%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E6%89%B9%E9%87%8F%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%A7%86%E9%A2%91%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/476666/%E5%AD%A6%E8%B5%B7Plus%E5%BC%98%E6%88%90%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E6%9C%BA%E6%9E%84%E7%89%88%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E6%89%B9%E9%87%8F%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%A7%86%E9%A2%91%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var floatingBox = document.createElement('div');
    floatingBox.id = 'floating-box';


    GM_addStyle(`
        #floating-box {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 500px;
            height: 200px;
            background-color: #f1f1f1;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            cursor: move;
        }

        #floating-box h3 {
            margin: 10px;
            font-size: 20px;
        }

        #floating-box p {
            margin: 10px;
            font-size: 16px;
        }

        #floating-box a {
            display: block;
            margin: 10px;
            font-size: 16px;
            color: #0000FF;
        }

        #floating-box a:hover {
            text-decoration: underline;
        }
    `);


    floatingBox.innerHTML = '<h3>欢迎使用学起Plus小助手</h3><p>已经开启了自动下一集功能</p><p>更多功能批量,无人值守。机构定制版请联系</p><a href="http://wpa.qq.com/msgrd?v=3&uin=65004368&site=qq&menu=yes">联系方式：QQ65004368</a>';


    document.body.appendChild(floatingBox);

    // 让悬浮框可移动
    makeDraggable(floatingBox);

    // 实现悬浮框可移动的函数
    function makeDraggable(element) {
        // 省略了函数的具体实现，用于实现拖动效果
    }

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



})();