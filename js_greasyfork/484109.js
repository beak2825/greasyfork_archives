// ==UserScript==
// @name         橘子动漫增强
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  橘子动漫增强脚本，添加各种快捷键，自动连播等
// @author       NPC-977
// @match        https://www.mgnacg.com/bangumi/*
// @match        https://play.mknacg.top:8585/*
// @exclude      https://www.mgnacg.com/static/player/prestrain.html
// @exclude      https://www.mgnacg.com/addons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mgnacg.com
// @grant        none
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/484109/%E6%A9%98%E5%AD%90%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/484109/%E6%A9%98%E5%AD%90%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var op = "," //跳过op/ed键
    var slow = "b" //减少播放速度键
    var normal = "n" //恢复正常速度键
    var fast = "m" //加快播放速度键
    var screenshot = "." //截图键
    var widescreen = "/" //宽屏模式快捷键
    var fullscreenbtn = "Enter" //全屏快捷键
    var speed_step = 0.3 //播放速度调整步长（默认每次加/减0.5倍）
    var time_step = 5 //播放时间调整步长（默认每次加/减5秒）
    var auto_next = true //是否自动下一集，是：true，否：false
    var auto_rec = true //是否自动恢复上次观看记录
    //以下内容禁止修改
    function postMessage(type, command, targetwindow, message) {//利用postMessage进行不同源iframe传输消息
        message = message || ''
        targetwindow.postMessage({
            myMessage: {
                type: type,
                command: command,
                message: message
            }
        }, '*');
    }
    if (window === window.top) {//为顶层window（视频区域外）
        var iframe
        var wide_btn
        var nextbtn
        window.addEventListener('load', e => {//加载完成进行初始化
            nextbtn = document.querySelector("body > div.player.bj > div > div.player-right.cor5.bj > div.player-vod-box > div.list-body > div > div > div.check.selected > div.player-anthology > div.anthology-header.top20 > div > div > a:nth-child(3)")
            wide_btn = document.querySelector("body > div.player.bj > div > div.player-left > div.player-switch.fa")
            iframe = document.querySelector("#videoiframe")
            var fjb = document.querySelector("body > div.page.player > div.main > div > div.module.module-player > div.player-rm.rm-list")
            var hengfu = document.querySelector("body > div.page.player > div.main > div > div.module.module-player > div.module-main > div.player-box > div > div.tips-box > div > ul")
            window.targetwindow = iframe.contentWindow
            fjb.remove()
            hengfu.remove()
        });
        window.addEventListener('message', e => {//接受来自视频区域的消息
            if (e.data.myMessage && e.data.myMessage.command){
                switch (e.data.myMessage.command){
                    case 'next':auto_next ? nextbtn.click():null;break
                    case 'ScreenShot':ScreenShot(e.data.myMessage.message);break
                    case 'Widescreen':wide_btn.click();break
                    case 'videoCurrentTime':window.videoCurrentTime = e.data.myMessage.message;break
                }
            }
        });
        window.addEventListener("keydown", e => {//监听按键按下
            switch(e.key){
                case op:e.preventDefault();postMessage('time', 'op',window.targetwindow);break
                case 'ArrowLeft':e.preventDefault();postMessage('time', '-',window.targetwindow);break
                case 'ArrowRight':e.preventDefault();postMessage('time', '+',window.targetwindow);break
                case 'ArrowUp':e.preventDefault();postMessage('volume', '+',window.targetwindow);break
                case 'ArrowDown':e.preventDefault();postMessage('volume', '-',window.targetwindow);break
                case slow:e.preventDefault();postMessage('rate', 'slow',window.targetwindow);break
                case normal:e.preventDefault();postMessage('rate', 'normal',window.targetwindow);break
                case fast:e.preventDefault();postMessage('rate', 'fast',window.targetwindow);break
                case ' ':e.preventDefault();postMessage('pop', 'pop',window.targetwindow);break
                case screenshot:e.preventDefault();postMessage('Screenshot', 'Screenshot',window.targetwindow);break
                case widescreen:e.preventDefault();wide_btn.click();break
                case fullscreenbtn:e.preventDefault();postMessage('fullscreen','fullscreen',window.targetwindow)
            }
        });
        function ScreenShot(data) {//截图功能的视频区域外部功能
            var downloadLink = document.createElement('a');//下载链接
            downloadLink.href = data;//来自视频区域的图片数据
            var ScreenShotName = document.title.replace(/在线观看-橘子动漫/,'')+window.videoCurrentTime//截图名称
            downloadLink.download = ScreenShotName;
            downloadLink.click();
        }
    } else {//为内层window（视频区域）
        var video
        var timer
        var url = window.location.href
        var canvas
        window.onbeforeunload = recordCurrentTime//在页面结束时记录播放进度
        window.addEventListener('load', function () {//视频区域加载完成
            video = window.document.querySelector("video")
            video.addEventListener('loadeddata', function () {//视频加载完成
                addCanvas()
                video.volume = 1
                video.play()
                auto_rec?recoveryPlayRecord():null
                video.addEventListener('ended', function () {
                    postMessage('next', 'next',window.top)
                });
            });
            CreatMessageElement()//自定义消息样式
        });
        window.addEventListener('message', e => {//接受来自视频区域外的消息
            if (e.data.myMessage && e.data.myMessage.command) {
                switch (e.data.myMessage.type){
                    case 'time':modifyCurrentTime(e.data.myMessage.command);break
                    case 'rate':modifyRate(e.data.myMessage.command);break
                    case 'volume':modifyVolume(e.data.myMessage.command);break
                    case 'pop':PlayOrPause();break
                    case 'fullscreen':fullscreen();break
                    case 'Screenshot':ScreenShot();break
                    case 'getVideoCurrentTime':postMessage('videoCurrentTime', 'videoCurrentTime',window.top, secTotime(video.currentTime));break
                }
            }
        });
        window.addEventListener("keydown", e => {//视频区域内监听按键
            switch(e.key){
                case widescreen:e.preventDefault();postMessage('Widescreen','Widescreen',window.top);break
                case op:e.preventDefault();modifyCurrentTime("op");break
                case slow:e.preventDefault();modifyRate('slow');break
                case normal:e.preventDefault();modifyRate('normal');break
                case fast:e.preventDefault();modifyRate('fast');break
                case screenshot:e.preventDefault();ScreenShot();break
                case fullscreenbtn: fullscreen();break
            }
        });
        function recoveryPlayRecord() {//恢复进度
            var recordTime = localStorage.getItem(window.location.href)
            if (recordTime && recordTime > 30 && video.duration - recordTime > 30) {
                video.currentTime = recordTime
                message('已为您恢复上次进度：' + secTotime(recordTime))
            }
        }
        function recordCurrentTime() {//记录播放进度
            localStorage.setItem(window.location.href, video.currentTime)
            console.log(localStorage.getItem(window.location.href))
        }
        function PlayOrPause() {//暂停/播放
            video.paused ? video.play() : video.pause()
            message(video.paused ? '暂停' : '播放')
        }
        function fullscreen() {
            document.webkitFullscreenElement ? video.webkitExitFullscreen() : video.webkitRequestFullscreen()
            //document.querySelector("body > div.artplayer-app > div > div.art-bottom > div.art-controls > div.art-controls-right > div.art-control.art-control-fullscreen.hint--rounded.hint--top").click()
        }
        function modifyCurrentTime(op) { // 修改进度
            switch(op){
                case '+':video.currentTime += time_step;break
                case '-':video.currentTime -= time_step;break
                case 'op':video.currentTime += 90;break
            }
            message('当前进度：' + secTotime(video.currentTime) + '/' + secTotime(video.duration))
        }
        function modifyRate(op) { // 修改倍速
            switch(op){
                case 'fast':video.playbackRate += speed_step;break
                case 'slow':video.playbackRate -= speed_step;break
                case 'normal':video.playbackRate = 1.0;break
            }
            message('当前倍速：' + video.playbackRate)
        }
        function modifyVolume(op) {// 修改音量
            op === '+'?video.volume += 0.1:video.volume -= 0.1
            message('当前音量：' + video.volume * 100)
        }
        function CreatMessageElement() {//自定义消息区域绘制
            const messageElement = document.createElement('div')
            messageElement.textContent = 'Hello! This is a custom message.'
            messageElement.style.position = 'absolute'
            messageElement.style.top = '10px'
            messageElement.style.left = '10px'
            messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
            messageElement.style.color = '#fff'
            messageElement.style.padding = '5px'
            messageElement.style.fontSize = '16px'
            messageElement.style.zIndex = '9999'
            messageElement.style.display = 'none'
            messageElement.id = 'customMessage'
            document.body.appendChild(messageElement)
        }
        function message(text) {//自定义消息区域显示消息方法
            var messageElement = document.querySelector("#customMessage")
            messageElement.textContent = text
            messageElement.style.display = 'block'
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                messageElement.style.display = 'none'
            }, 3000)
        }
        function secTotime(s) {//秒转时间
            var t = '';
            if (s > -1) {
                var hour = Math.floor(s / 3600)
                var min = Math.floor(s / 60) % 60
                var sec = s % 60
                if (hour === 0) {
                    t = ''
                } else if (hour < 10) {
                    t = '0' + hour + ":"
                } else {
                    t = hour + ":"
                }
                if (min < 10) {
                    t += "0"
                }
                t += min + ":"
                if (sec < 10) {
                    t += "0"
                }
                t += sec.toFixed(0)
            }
            return t
        }
        function recoveryRecord(recordTime) {//恢复进度
            video.duration - recordTime > 30 && recordTime > 30 ? video.currentTime = recordTime : null
            message('已为您恢复上次进度：' + secTotime(recordTime))
        }
        function addCanvas() {//增加截图绘制区域
            canvas = document.createElement('canvas')
            canvas.style.width = video.videoWidth
            canvas.style.height = video.videoHeight
            canvas.id = 'canvas'
            document.body.appendChild(canvas)
        }
        function ScreenShot() {//截图的视频区域部分功能
            postMessage('videoCurrentTime', 'videoCurrentTime',window.top, secTotime(video.currentTime))//给视频区域外当前视频时间，作为截图名
            canvas.setAttribute('width',video.videoWidth)
            canvas.setAttribute('height',video.videoHeight)
            canvas.style.display = 'none'
            var base64
            var ctx = canvas.getContext('2d')
            ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight)
            base64 = canvas.toDataURL('images/png')
            postMessage('ScreenShot','ScreenShot',window.top,base64)
        }
    }
})();