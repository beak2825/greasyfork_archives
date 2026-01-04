// ==UserScript==
// @name         【kcjs_1_1】青书学堂 河北科大 自刷跳转解析
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  【最新版】青书学堂自动后台静音播放脚本，增加自动跳过课程简介、教学大纲，点击课程进入学习页
// @author       zhdhu
// @match        *://*.qingshuxuetang.com/hbkd/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/493269/%E3%80%90kcjs_1_1%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%20%E6%B2%B3%E5%8C%97%E7%A7%91%E5%A4%A7%20%E8%87%AA%E5%88%B7%E8%B7%B3%E8%BD%AC%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/493269/%E3%80%90kcjs_1_1%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%20%E6%B2%B3%E5%8C%97%E7%A7%91%E5%A4%A7%20%E8%87%AA%E5%88%B7%E8%B7%B3%E8%BD%AC%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i
    var href = location.href
    if (href.indexOf('nodeId') > -1) {
        var params = new UrlSearch()
        var no = params.no
        const courseArr = params.nodeId.split('jbxx')
        console.log('当前地址:',courseArr);
        // 跳过基本信息页（课程介绍、教学大纲）直接进入课程讲授
        var kcjs = ''
        if (courseArr.length == 2) {
            //视频第一页
            kcjs = `kcjs_1_1`
            //拼接地址
            Videokcjs(params.teachPlanId,params.periodId,params.courseId,kcjs,no)
        }
        // 视频课程地址是否带参数
        if (courseArr == "") {
            //视频第一页
            kcjs = `kcjs_1`
            //拼接地址
            Videokcjs(params.teachPlanId,params.periodId,params.courseId,kcjs,no)
        }
        setTimeout(function() {
            var video // = document.getElementsByTagName("video")[0]
                      = document.getElementById("vjs_video_3_html5_api")
            console.log('找到视频组件,开始静音并自动播放...', video)
            var params = new UrlSearch()
            // 课程ID
            var courseId = params.courseId
            const courseArr = params.nodeId.split('_')
            // 播放的视频的key
            var nextKey = ''
            // 非播放页面转到播放页
            if(video.src === ''){
                console.log('找不到视频组件', video)
                // no = undefind
                no ? no = Number(no) + 1 : no = Number(2)
                nextKey = `kcjs_${Number(courseArr[1]) + 1}_1`
                //拼接地址
                Videokcjs(params.teachPlanId,params.periodId,params.courseId,nextKey,no)
            }
            console.log("失败次数",no)

            //设置播放进度为0
            video.currentTime = 0
            // 设置静音并播放
            video.muted = true
            // ****************************************************************************************** //
            // 设置倍速播放 支持以下速率: [2, 1.5, 1.2, 0.5] ；默认开启 如有问题请手动注释下面这行代码；或者邮箱反馈我  //
            // ****************************************************************************************** //
            video.playbackRate = 2
            video.play()
            console.log('长度:',courseArr);
            //根据标题名称判断是否为无效课程
            var videoNameTag = document.getElementsByClassName("lesson-list")
            console.log(videoNameTag[0].innerText)
            const tagN = videoNameTag[0].innerText.substring(0,3).split('-')
            if (videoNameTag[0].innerText !== '') {
            }
            const nextCoureArr = courseArr
            const nn= 0
            console.log('赋值数组:',nextCoureArr,courseArr);
            if (courseArr[1] !== 1 && courseArr[2] !== 1 && tagN[0] == 1 && tagN[1] == 1) {
                //不正常播放
                if (courseArr.length == 2) {
                    nextKey = `kcjs_${Number(courseArr[1]) + 1}`
                    console.log('下一页:',nextKey);
                } else if (courseArr.length == 3) {
                    nextKey = `kcjs_${Number(courseArr[1])+1}_${Number(1)}`
                    console.log('下一页:',nextKey);
                }
                // console.log("不正常播放",no,params.no)
                no ? no = Number(params.no != 'undefined' ? params.no: 0) + 1 : no = 1
                console.log("+++++", no)
            }else {
                //正常播放
                // console.log("正常播放")
                if (courseArr.length == 2) {
                    nextKey = `kcjs_${Number(courseArr[1]) + 1}`
                    console.log('下一页:',nextKey);
                } else if (courseArr.length == 3) {
                    nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
                    console.log('下一页:',nextKey);
                }
                   no ? no = 'undefined' : ''
                // console.log("+++++", no)
            }
            if(no >= 2) {
                window.alert('刷课完成')
                location.replace('https://degree.qingshuxuetang.com/hbkd/Student/Home');
            }
            const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&nodeId=${nextKey}&no=${no}`
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
function Videokcjs(teachPlanId,periodId,courseId,key,no ) {
    const Url = `https://${window.location.host}${window.location.pathname}?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${key}`+ (no !== '' ? '&no= ' + no : no = '&no= 1')
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
        // console.log('当前进度:', currentTime);
    }, 10000);
}
