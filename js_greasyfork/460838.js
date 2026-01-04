// ==UserScript==
// @name         网梯学苑-视频学习
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动播放下一个，弹窗屏蔽
// @author       xiajie
// @match        https://*.webtrn.cn/*
// @icon         http://webtrn.cn/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/460838/%E7%BD%91%E6%A2%AF%E5%AD%A6%E8%8B%91-%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/460838/%E7%BD%91%E6%A2%AF%E5%AD%A6%E8%8B%91-%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.pathname == '/learnspace/learn/learn/templatetwo/index.action'){
        console.log('进入课程详情');
        //去除关闭提示
        window.onbeforeunload = false
        //弹窗点击
        setInterval(function(){
            if($('.layui-layer-btn0').length>0){
                $('.layui-layer-btn0').click();
            }
        },1000);
        //是否播放页面
        setInterval(function(){
            var text = $('.s_mainmenucurrent').text();
            if(text != '课件'){
                $('#courseware_main_menu div').click();
            }
        },5000);

    }
    if(window.location.pathname == '/learnspace/learn/learnhelper/learnHelper-main.action'){
        setTimeout(function(){
            window.closeLearnHelper();
        },3000)
    }

    if(window.location.pathname == '/learnspace/learn/learn/templatetwo/courseware_index.action'){
        console.log('进入视频播放');
        window.isEnd = false;
        //播放完成，点击下一节
        setInterval(function(){
            console.log(isEnd);
            if(isEnd == true){
                isEnd = false;
                var len = $('.s_point').length;
                for(var i=0;i<len;i++){
                    if($('.s_point').eq(i).hasClass('s_pointerct') == false && $('.s_point').eq(i).attr('completestate') == 0 && $('.s_point').eq(i).attr('itemtype') == 'video'){
                        $('.s_point').eq(i).parent().show();
                        $('.s_point').eq(i).click();
                        break;
                    }
                }
                if(i == len){
                    //window.parent.close();
                }
            }
        },3000);
    }

    if(window.location.pathname == '/learnspace/learn/learn/templatetwo/content_video.action'){
        console.log('播放内容页');
        //静音
        setTimeout(function(){
            player.setVolume(0);
        },3000)
        //视频暂停点击
        setInterval(function(){
            if(player.getStatus() !== 'playing'){
                player.play();
            }
        },1000);
        setInterval(function(){
            if($('#container_display_button').css('opacity') == 1){
                $('#container_display_button').click();
            }
        },1000);

        //播放完成检测
        setInterval(function(){
            var now = time_to_sec($('.current-time').text());
            var total = time_to_sec($('.duration').text());
            if(now >0 && total > 0 && (now / total)>0.95){
                window.parent.isEnd = true;
            }
        },500);
        setInterval(function(){
            var now = time_to_sec($('#container_controlbar_elapsed').text());
            var total = time_to_sec($('#container_controlbar_duration').text());
            if(now >0 && total > 0 && (now / total)>0.95){
                window.parent.isEnd = true;
            }
        },500);
    }

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/index.action'){
        console.log('进入课程详情');

        //去除关闭提示
        window.onbeforeunload = false

        //弹窗点击
        setInterval(function(){
            if($('.layui-layer-btn0').length>0){
                $('.layui-layer-btn0').click();
            }
        },1000);

        //是否播放页面
        setInterval(function(){
            var text = $('.learn-menu-cur .learn-menu-text').text();
            if(text != '课件'){
                $('#courseware_main_menu').click();
            }
        },5000);

    }

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/courseware_index.action'){
        console.log('进入视频播放');
        window.isEnd = false;
        //播放完成，点击下一节
        setInterval(function(){
            console.log(isEnd);
            if(isEnd == true){
                isEnd = false;
                var len = $('.s_point').length;
                let index = 0;
                for(var i=0;i<len;i++){
                    if($('.s_point').eq(i).hasClass('s_pointerct') == true){
                        index = i;
                    }
                    if($('.s_point').eq(i).hasClass('s_pointerct') == false && $('.s_point').eq(i).attr('completestate') == 0 && $('.s_point').eq(i).attr('itemtype') == 'video' && i > index){
                        $('.s_point').eq(i).parent().parent().show();
                        $('.s_point').eq(i).parent().show();
                        $('.s_point').eq(i).click();
                        break;
                    }
                }
            }
        },3000);
    }

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/content_video.action'){
        console.log('播放内容页');
        //静音
        setTimeout(function(){
            $('.screen-player-volume .screen-player-btn').click();
        },3000)
        //视频暂停点击
        setInterval(function(){
            if($('#player_pause').css('display') != 'none'){
                $('#player_pause').click();
            }
        },1000);
        //播放完成检测
        setInterval(function(){
            var now = time_to_sec($('#screen_player_time_1').text());
            var total = time_to_sec($('#screen_player_time_2').text());
            if(now >0 && total > 0 && (now / total)>0.95){
                window.parent.isEnd = true;
            }
        },3000);

    }

    function time_to_sec(time) {
        var s = '';
        var hour = 0;
        var min = 0;
        var sec= 0;
        if(time.split(':').length == 1){
            sec = time.split(':')[0];
        }
        if(time.split(':').length == 2){
            min = time.split(':')[0];
            sec = time.split(':')[1];
        }
        if(time.split(':').length == 3){
            hour = time.split(':')[0];
            min = time.split(':')[1];
            sec = time.split(':')[2];
        }

        s = Number(hour*3600) + Number(min*60) + Number(sec);

        return s;
    };
})();