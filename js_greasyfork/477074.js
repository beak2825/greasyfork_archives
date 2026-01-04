// ==UserScript==
// @name         苏州大学成教在线教学平台
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  苏州大学成教在线，自动播放下一个，弹窗屏蔽
// @author       xiajie
// @match        https://cj1060-kfkc.webtrn.cn/*
// @icon         http://webtrn.cn/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/477074/%E8%8B%8F%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%88%90%E6%95%99%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477074/%E8%8B%8F%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%88%90%E6%95%99%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/index.action'){
        console.log('进入课程详情');

        //弹窗点击
        setInterval(function(){
            if($('.layui-layer-btn0').length>0){
                $('.layui-layer-btn0').click();
            }
        },1000);

        //是否播放页面
        setTimeout(function(){
            var text = $('.learn-menu-cur .learn-menu-text').text();
            if(text != '课件'){
                $('#courseware_main_menu a')[0].click();
            }
            setTimeout(function(){
                $('#learn-helper-main').hide();
                $('.shade-div').hide();
            },2000)
        },3000);

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
                for(var i=0;i<len;i++){
                    if($('.s_point').eq(i).hasClass('s_pointerct') == false && $('.s_point').eq(i).attr('completestate') == 0 && $('.s_point').eq(i).attr('itemtype') == 'video'){
                        var p = $('.s_point').eq(10).parent().hasClass('s_sectionwrap');
                        if(p){
                            $('.s_point').eq(i).parent().parent().show();
                            $('.s_point').eq(i).parent().show();
                        }else{
                            $('.s_point').eq(i).parent().show();
                        }
                        $('.s_point').eq(i).click();
                        break;
                    }
                }
            }
        },3000);
    }

    if(window.location.pathname == '/learnspace/learn/learn/templateeight/content_video.action'){
        console.log('播放内容页');

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
            if(now >0 && total > 0 && (now / total)>0.98){
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