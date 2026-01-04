// ==UserScript==
// @name         抖音GW
// @namespace    http://tampermonkey.net/
// @version      2024-03-04-17.00
// @description  直播间自动提问
// @author       Praise
// @match        https://live.douyin.com/*
// @icon         https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488958/%E6%8A%96%E9%9F%B3GW.user.js
// @updateURL https://update.greasyfork.org/scripts/488958/%E6%8A%96%E9%9F%B3GW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    getAllHttpData();
    var meInfo;
    var ws;
    // 页面完全加载后执行的代码
    function onPageLoaded() {
        // 延迟执行
        setTimeout(SockerClient, 2*1000); // 延迟2秒执行
        setTimeout(RemoveVideo, 10*1000); // 延迟10秒执行

    }

    function RemoveVideo(){
        // 查找所有的视频元素
        var videoElements = document.querySelectorAll('video');

        // 遍历视频元素并移除它们
        videoElements.forEach(function(video) {
            video.remove();
        });
    }

    function CloseAndOpenNewWeb(newUrl){
        // 关闭当前页面并导航到新的 URL
        window.location.replace(newUrl);
    }

    function SockerClient() {

        //创建一个webSocket实例，执行后，客户端就会与服务端连接
        ws = new WebSocket("ws://localhost:8887");

        //当WebSocket创建成功时，触发onopen事件
        var status = ws.onopen = function(){
            console.log("open");
            ws.send(meInfo); //将当前的账号信息发送到服务端
        }

        //当客户端收到服务端发来的消息时，触发onmessage事件
        ws.onmessage = function(e){
            //e.data 的数据格式也是字符串，手动解析这些数据才能得到其他格式的数据。
            var type = JSON.parse(e.data).type;
            if(type===1){
                const content = JSON.parse(e.data).content;
                console.log("Praise:" + e.data);
                //ws.send(e.data); //将消息发送到服务端
                ZhibiJianpingLun(content);
            }
            if(type===2){
                const content = JSON.parse(e.data).content;
                console.log("Praise:" + e.data);
                //ws.send(e.data); //将消息发送到服务端
                CloseAndOpenNewWeb(content);
            }

        }

        //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
        ws.onclose = function(e){
            console.log("close");
            SockerClient();
        }

        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        ws.onerror = function(e){
            //SockerClient();
            console.log(e.error);
        }
    }

    function ZhibiJianpingLun(text) {
        // 获取 textarea 元素
        var textarea = document.getElementById("chat-textarea");
        // 检查 textarea 是否存在
        if (textarea) {
            //获取输入框焦点
            textarea.focus();
            textarea.value = text+ "\r\n";
            var inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            textarea.dispatchEvent(inputEvent);
        }

        // 获取 svg 元素
        var svgElement = document.querySelector('.webcast-chatroom___send-btn');

        // 检查 svg 元素是否存在
        if (svgElement) {
            // 创建点击事件
            var clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            // 触发发送点击事件
            svgElement.dispatchEvent(clickEvent);
        }
    }

    function getAllHttpData(){
        var originalOpen = XMLHttpRequest.prototype.open;
        var originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url; // 记录请求的URL
            originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            var self = this;

            var originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
                if (self.readyState === 4) {

                    if (self._url.includes('webcast/user/me')) {
                        var meJson = self.responseText;
                        var meJsonObject = JSON.parse(meJson);
                        var id = meJsonObject.data.id;
                        var nickname = meJsonObject.data.nickname;

                        meInfo = JSON.stringify({
                            id: id,
                            nickname: nickname
                        });

                        console.log('Praise:', meInfo);
                    }


                }
            };

            originalSend.apply(this, arguments);
        };
    }



    // Your code here...
    // 当页面完全加载后调用onPageLoaded函数
    window.addEventListener('load', onPageLoaded);
})();