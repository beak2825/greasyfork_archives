// ==UserScript==
// @name         Watch TV With You
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  用于同步H5 video标签的暂停、播放、拖拽进度条的事件，可以让多人同步进度条，一直看视频，脚本目前测试了腾讯视频、哔哩哔哩、YouTube三个平台，理论上其他平台也支持，可自行修改脚本中的@match标签。后台基于websocket协议提供服务，后台源码地址：https://github.com/baofeidyz/wtwu。作者不提供后台服务。
// @author       baofeidyz
// @include      *://v.qq.com/x/cover/*.html
// @include      *://*.youtube.com/watch?v=*
// @include      *://*.bilibili.com/video/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/421174/Watch%20TV%20With%20You.user.js
// @updateURL https://update.greasyfork.org/scripts/421174/Watch%20TV%20With%20You.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在这里修改websocket服务地址，后台源码地址请见@description
    var websockerServerUrl = "wss://你的域名:端口/wtwu/room/房间ID";
    var ws;
    var video;
    var lastActTime = new Date().getTime();
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            var v =document.getElementsByTagName("video");

            video = v[0];
            if(!video){
                return;
            }
            video.addEventListener("pause",function(){
                var now = new Date().getTime();
                if (now - lastActTime > 50) {
                    console.log("pause");
                    sendMessage('PAUSE');
                } else {
                    lastActTime = now;
                }
            });
            video.addEventListener("play",function(){
                var now = new Date().getTime();
                if (now - lastActTime > 50) {
                    console.log("play");
                    sendMessage('PLAY');
                } else {
                    lastActTime = now;
                }
            });
            video.addEventListener("seeked",function(param){
                console.log(video.currentTime);
                sendMessage('SEEKED', video.currentTime);
            });

            ws = new WebSocket(websockerServerUrl);

            ws.onopen = function () {
                console.log("连接成功");
            };

            ws.onclose = function (e) {
                console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
                console.log(e)
            }

            // 当服务端处理完成后会将数据发送回来
            ws.onmessage = function (evt) {
                var result= evt.data;
                var data = JSON.parse(event.data)
                if ( data.type === 'PAUSE'){
                    pause();
                }
                if (data.type === 'PLAY'){
                    play();
                }
                if (data.type === 'SEEKED'){
                    if(video.currentTime -1 <= data.currentTime && video.currentTime + 1 >= data.currentTime){
                        return;
                    } else {
                        seeked(data.currentTime);
                    }
                }
            };
        }
    };
    // Your code here...
    function pause(){
        video.pause();
    }
    function play(){
        video.play();
    }
    function seeked(currentTime){
        video.currentTime = currentTime;
    }
    function sendMessage(type, currentTime){
        var data = {
            type, currentTime
        };
        data.type = type;
        data.currentTime = currentTime;
        ws.send(JSON.stringify(data));
    }


})();