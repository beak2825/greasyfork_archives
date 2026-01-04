// ==UserScript==
// @name         河北民族师范学院-继续教育
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  河北民族师范学院继续教育，自动播放下一个，弹窗屏蔽
// @author       xiajie
// @match        https://xjjwedu-hbmz-kfkc.webtrn.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtrn.cn
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/491775/%E6%B2%B3%E5%8C%97%E6%B0%91%E6%97%8F%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/491775/%E6%B2%B3%E5%8C%97%E6%B0%91%E6%97%8F%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
                    var obj = $('.s_point').eq(i);
                    if(obj.hasClass('s_pointerct') == false && obj.attr('completestate') == 0 && obj.attr('itemtype') == 'video'){
                        var p = obj.parent().hasClass('s_sectionwrap');
                        if(p){
                            obj.parent().parent().show();
                            obj.parent().show();
                        }else{
                            obj.parent().show();
                        }
                        obj.click();
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