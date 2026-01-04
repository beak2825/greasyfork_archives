// ==UserScript==
// @name         宁夏大学-继续教育
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  宁夏大学继续教育，自动播放下一个，弹窗屏蔽
// @author       You
// @match        http://learn.courshare.cn/learnspace/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtrn.cn
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/468582/%E5%AE%81%E5%A4%8F%E5%A4%A7%E5%AD%A6-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/468582/%E5%AE%81%E5%A4%8F%E5%A4%A7%E5%AD%A6-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //去除关闭提示
    window.onbeforeunload = false

    //弹窗点击
    setInterval(function(){
        if($('.layui-layer-btn0').length>0){
            $('.layui-layer-btn0').click();
        }
    },1000);

    if(window.location.pathname == '/learnspace/learn/learn/blue/index.action'){
        console.log('进入课程详情');

        //是否播放页面
        setInterval(function(){
            var text = $('.navIna').text();
            if(text != '课件'){
                $('#courseware_main_menu a')[0].click();
            }
        },5000);

    }

    if(window.location.pathname == '/learnspace/learn/learn/blue/courseware_index.action'){
        console.log('进入课程播放');

        window.isEnd = false;
        //播放完成，点击下一节
        setInterval(function(){
            console.log(isEnd);
            if(isEnd == true){
                isEnd = false;
                var len = $('.vconlist li').length;
                for(var i=0;i<len;i++){
                    var obj = $('.vconlist li').eq(i);
                    var chose = obj.hasClass('select');
                    var status = obj.find('span').attr('class');
                    if(chose == true){
                        var next = i+1;
                        console.log(next);
                        if(next < len){
                            $('.vconlist li').eq(next).parent().parent().show();
                            $('.vconlist li').eq(next).find('a')[0].click();
                        }
                        break;
                        //obj.find('span').attr('class','done');
                    }
                    if(chose == false && status != 'done'){
                        //obj.parent().parent().show();
                        //obj.find('a')[0].click();
                        //break;
                    }
                }
            }
        },3000);
    }

    if(window.location.pathname == '/learnspace/learn/learn/blue/content_courseware.action'){
        console.log('进入视频播放');
        window.isEnd = false;
        setInterval(function(){
            console.log(isEnd);
            if(isEnd == true){
                window.parent.isEnd = isEnd;
            }
        },3000)
    }

    if(window.location.pathname == '/learnspace/learn/rec/normal/media.action'){
        //视频暂停点击
        setInterval(function(){
            if($('#flash_player2_display_button').css('opacity') == 1){
                $('#flash_player2_display_button')[0].click();
            }
        },3000);

        //播放完成检测
        setInterval(function(){
            var now = time_to_sec($('#flash_player_controlbar_elapsed').text());
            var total = time_to_sec($('#flash_player_controlbar_duration').text());
            console.log(now)
            if(now >0 && total > 0 && (now / total)>0.95){
                window.parent.isEnd = true;
            }
        },500);

    }
    if(window.location.pathname == '/learnspace/learn/learn/blue/content_video.action'){
        //视频暂停点击
        setInterval(function(){
            if($('#container_display_button').css('opacity') == 1){
                $('#container_display_button')[0].click();
            }
        },3000);

        //播放完成检测
        setInterval(function(){
            var now = time_to_sec($('#container_controlbar_elapsed').text());
            var total = time_to_sec($('#container_controlbar_duration').text());
            console.log(now)
            if(now >0 && total > 0 && (now / total)>0.95){
                window.parent.isEnd = true;
            }
        },500);
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