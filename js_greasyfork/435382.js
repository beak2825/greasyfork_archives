// ==UserScript==
// @name         宝武微学苑挂机脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  跳过挂机判断，自动续播，列表播放完毕自动关闭当前标签页
// @author       SpaceJJ
// @match        http://mooc.baosteel.com/*
// @icon         https://www.google.com/s2/favicons?domain=baosteel.com
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435382/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435382/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// 自动点击下一节
(function () {
        // 定时器自动确认(每两分钟自动检测一次)
    var autoConfirm = setInterval(() => {
        // 判断是否下一节按钮
        if (document.getElementsByClassName('ant-btn ant-btn-primary ant-btn-lg')[0]) {
            // 模拟点击
            console.log("自动确认");
            document.getElementsByClassName('ant-btn ant-btn-primary ant-btn-lg')[0].click();
        }
    },120000 )
var pageOfVideo = 0;//检测页面是否为视频播放页面，默认为否
var count = 0;//超时次数统计
    setTimeout(function a(){
        if(!document.getElementsByTagName('video')[0]){
            count ++;
            if(count >=12){//超时：2min内没找到视频对象，如果是视频播放页则刷新，如果是其他页面则无后续log
                if(pageOfVideo!=0){//视频播放页
                    window.location.reload();//刷新
                }
                else{
                    a();//继续设置定时器，但不log日志
                }
            }
            else{//未超时
                console.log("未找到视频!"+count);
                setTimeout(() => {
                    console.log("重新获取视频对象");
                    a();
                },5000);
            }
        }
        else{
            count = 0;//超时定时器归零
            pageOfVideo = 1;//当有视频对象时，设置为视频播放页
            var vid = document.getElementsByTagName('video')[0];
            var videoChange = setInterval(() => {
                // 判断当前视频是否切换
                if (document.getElementsByTagName('video')[0] != vid ) {
                    // 切换视频重新获得视频对象
                    console.log("视频切换，重置定时器");
                    clearInterval(videoChange);
                    clearInterval(netstat);
                    a();
                }
            }, 1000)
            var netstat = setInterval(() => {//每分钟检测一次
                // 判断当前视频的网络状态，如果不正常则刷新
                if (document.getElementsByTagName('video')[0].networkState != 1) {
                    // 切换视频重新获得视频对象
                    console.log("视频播放网络异常");
                    window.location.reload();//刷新
                }
            }, 60000)
            console.log("视频正常播放，定时启动");
            vid.addEventListener('ended',function(){ //视频播放完的事件
                //这里触发点击事件
                console.log("播放完毕");
                //清除定时器
                clearInterval(videoChange);
                clearInterval(netstat);
                //延迟点击下一节
                setTimeout(() => {
                    if(document.getElementsByClassName('go-survey')[0]){
                        //延迟执行关闭脚本，否则关闭太快被视为未完成当前视频的学习
                        setTimeout(() => {
                            window.close();
                        },10000);
                    }
                    else{
                        document.getElementsByClassName('go-next')[3].click();
                        console.log("点击下一节");
                        setTimeout(() => {
                            a();
                        },5000);
                    }
                },2000);
            });
        }
    },3000);
})();