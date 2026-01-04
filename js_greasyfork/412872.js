// ==UserScript==
// @name         慕课网视频自动播放下一节
// @name:zh-CN   慕课网视频自动播放下一节
// @name:en      Imooc video, auto play next section
// @namespace    http://bbs.91wc.net/imooc-auto-next.htm
// @version      0.1.10
// @description  慕课网视频自动播放下一节，可手动开启/关闭，按回车键可全屏播放
// @description:zh-CN  慕课网视频自动播放下一节，可手动开启/关闭，按回车键可全屏播放
// @description:en  Imooc video, auto play next section, which can be manually turned on/off, press enter to play full screen
// @author       Wilson
// @icon         https://www.imooc.com/favicon.ico
// @match        *://www.imooc.com/video/*
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/412872/%E6%85%95%E8%AF%BE%E7%BD%91%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/412872/%E6%85%95%E8%AF%BE%E7%BD%91%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //等待jQuery加载完成和dom加载完成
    var waitUntil=function(condfunc, callback, interval, trys){
        var getGuid = getGuid||function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        };
        var timer = {}, counter={};
        var waiter = function(condfunc, callback, interval, trys, guid){
            guid = guid || getGuid();
            interval = interval || 100;
            trys = trys || 300;
            counter[guid] = counter[guid] ? counter[guid]++ : 1;
            if(counter[guid]>trys){
                if(timer[guid]) clearTimeout(timer[guid]);
                //callback('fail');
                return;
            }
            timer[guid] = setTimeout(function(){
                if(condfunc()){
                   if(timer[guid]) clearTimeout(timer[guid]);
                    callback('ok');
                } else {
                    if(timer[guid]) clearTimeout(timer[guid]);
                    waiter(condfunc, callback, interval, trys, guid);
                }
            }, interval);
        }
        waiter(condfunc, callback, interval, trys);
    }

    //监控下一节
    var intvelTimer=null, listenNextBtn = function(delay){
        delay = delay || 1000;
        intvelTimer=setInterval(function(){
            //当出现下一节时，开始播放下一节
            if($(".vjs-ended").length > 0 && localStorage.getItem("_w_auto_next")){
                $(".J-next-btn").click();
            }
            //当到达最后一节时，停止监控
            if($(".return-course").length > 0 && localStorage.getItem("_w_auto_next")){
                if(isListeningNextBtn()) stopListenNextBtn();
            }
        }, delay);
    }
    //停止监控下一节
    var stopListenNextBtn = function(){
        if(intvelTimer) clearInterval(intvelTimer);
        intvelTimer = null;
    }
    //是否正在监控下一节
    var isListeningNextBtn = function(){
        return intvelTimer !== null;
    }

    waitUntil(function(){return typeof jQuery !=="undefined" && $(".vjs-remaining-time").length>0}, function(){
        //插入选项
        var autoNextHtml='<div class="video-js vjs-time-control"><label><input id="_w_auto_next_btn" type="checkbox" style="position:relative;top:2px"> 自动播放下一节</label></div>';
        $(".vjs-remaining-time").after(autoNextHtml);
        $("#_w_auto_next_btn").prop("checked", localStorage.getItem("_w_auto_next")?true:false);
        //进度条显示出来，方便快进
        $(".vjs-progress-holder").css("background-color", "#393e42");

        //监控下一节
        listenNextBtn();

        //选项改变事件
        $("#_w_auto_next_btn").on("change", function(){
            var me = $(this);
            if(me.is(":checked")){
                if(!isListeningNextBtn()) listenNextBtn();
                localStorage.setItem("_w_auto_next", 1);
            } else {
                if(isListeningNextBtn()) stopListenNextBtn();
                localStorage.setItem("_w_auto_next", "");
            }
        });

        //回车全屏事件
        $(document).keyup(function(){
            if(event.keyCode==13){
                $(".vjs-fullscreen-control").click();
            }
        });

    });

})();