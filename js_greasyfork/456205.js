// ==UserScript==
// @name         【最新版】青书学堂自动刷课时，解放双手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  【最新版】青书学堂自动后台静音播放脚本，增加自动跳过课程简介、教学大纲，点击开始学习自动到播放页，青书学堂更新后很多插件都用不了只能自己修复
// @author       xuzifeng
// @match        *://*.qingshuxuetang.com/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/456205/%E3%80%90%E6%9C%80%E6%96%B0%E7%89%88%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%97%B6%EF%BC%8C%E8%A7%A3%E6%94%BE%E5%8F%8C%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456205/%E3%80%90%E6%9C%80%E6%96%B0%E7%89%88%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%97%B6%EF%BC%8C%E8%A7%A3%E6%94%BE%E5%8F%8C%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var i
    var href = location.href
    if (href.indexOf('nodeId') > -1) {
        var params = new UrlSearch()
        const courseArr = params.nodeId.split('jbxx')
        console.log('当前地址:',courseArr);
        // 跳过基本信息页（课程介绍、教学大纲）直接进入课程讲授
        if (courseArr.length == 2) {
            //视频第一页
            const kcjs = `kcjs_1_1`
            //拼接地址
            Videokcjs(params.teachPlanId,params.periodId,params.courseId,kcjs)
        }
        // 视频课程地址是否带参数
        if (courseArr == "") {
            //视频第一页
            const kcjs = `kcjs_1`
            //拼接地址
            Videokcjs(params.teachPlanId,params.periodId,params.courseId,kcjs)
        }
        setTimeout(function() {
            var video = document.getElementsByTagName("video")[0]
            console.log('找到视频组件,开始静音并自动播放...', video)
            var params = new UrlSearch()
            // 课程ID
            var courseId = params.courseId
            const courseArr = params.nodeId.split('_')
            // 播放的视频的key
            var nextKey = ''
            // 非播放页面转到播放页
            if(video ===undefined){
                console.log('找不到视频组件', video)
                nextKey = `kcjs_${Number(courseArr[1]) + 1}_1`
                //拼接地址
                Videokcjs(params.teachPlanId,params.periodId,params.courseId,nextKey)
            }
            //设置播放进度为0
            video.currentTime = 0
            // 设置静音并播放
            video.muted = true
            // 设置倍速播放 支持以下速率: [2, 1.5, 1.2, 0.5] ；默认开启 如有问题请手动注释下面这行代码；或者邮箱反馈我
            video.playbackRate = 0.5
            video.play()
            console.log('长度:',courseArr);
            //正常播放
            if (courseArr.length == 2) {
                nextKey = `kcjs_${Number(courseArr[1]) + 1}`
                console.log('下一页:',nextKey);
            } else if (courseArr.length == 3) {
                nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
                console.log('下一页:',nextKey);
            }
            const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&nodeId=${nextKey}`
            console.log(params, 'currentId:', params.nodeId, 'nextKey:', nextKey, 'nextUrl:', nextUrl)
            // 视频播放结束,自动下一条视频
            video.addEventListener("ended",function(){
                location.replace(nextUrl);
            })
        }, 5000)

        // 打印播放进度
        getvideoprogress();
    }
})();
function Videokcjs(teachPlanId,periodId,courseId,key) {
    const Url = `https://${window.location.host}${window.location.pathname}?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${key}`
    location.replace(Url);
}
function UrlSearch() {
    var name,value;
    var str=location.href; //取得整个地址栏
    console.log('当前整个地址:',str);
    var num=str.indexOf("?")
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        }
    }
}

// 检测当前播放的进度
function getvideoprogress() {
    setInterval(function () {
        var vid = document.getElementsByTagName("video")[0]
        var currentTime=vid.currentTime.toFixed(1);
        console.log('当前进度:', currentTime);
    }, 10000);
}
