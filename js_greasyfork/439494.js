// ==UserScript==
// @name         浙师网院自动学习辅助
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  浙师网院视频部分自动学习脚本，用户进入视频学习目录页后，脚本会自动选择学习任务，视频学习页视频自动切换!!
// @author       You
// @match        https://tsgc.uteacher.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      No license
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439494/%E6%B5%99%E5%B8%88%E7%BD%91%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/439494/%E6%B5%99%E5%B8%88%E7%BD%91%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function courseList() {
        document.querySelector(".task_tips").insertAdjacentText('afterEnd','【浙师网院自动学习辅助】正在运行中>>>');
        var itemArr = document.getElementsByClassName("progress-bar");

        var curProgrees;

        //获取项目完成百分比，"width:100%"
        let getItemProgrees = function(k){
            var str = itemArr[k].getAttribute('style');
            var index1 = str.indexOf("width:")+6;
            var index2 = str.indexOf("%");
            var pro = str.substring(index1,index2);
            return Number(pro);
        }

        if(document.readyState=="complete")
        {
            for(var i=0;i<itemArr.length;i++){
                //获取视频完成度
                curProgrees = getItemProgrees(i);
                console.log("第 " + i + " 项进度：" + curProgrees);

                if(curProgrees < 95)
                {
                    console.log("找到未完成学习视频，即将打开。");
                    //console.log(document.querySelectorAll('.title')[i].href);//控制台打印视频URL
                    //window.open(document.querySelectorAll('.title')[i].href);//新窗口打开，但常被拦截而打不开
                    window.open(document.querySelectorAll('.title')[i].href,"_self");//
                    break;
                };
            }
        }
    }

    var i = 0;
    function kanke() {
        //修改温馨提示文本
        document.getElementsByClassName("course_tips")[0].innerText = "【浙师网院自动学习辅助】正在运行中>>>";
        //获取本页视频列表
        var itemArr = document.querySelectorAll('.catgbox_list>li>a');

        //获取视频完成进度
        let getVideoProgree = function(k){
            var str = document.querySelectorAll('.percentage-box>svg>path')[k*2+1].getAttribute("style");
            var index1 = str.indexOf(": ") + 2;
            var index2 = str.indexOf("px,");
            var pro = str.substring(index1,index2);
            return Number(pro);
        }

        // 切换视频
        let getNextVideo = function(k){
            if(k < itemArr.length)//继续播放其他视频
            {
                console.log("即将播放下一个！");
                if(document.querySelectorAll(".catgbox_list>li")[k].className != "active")
                {
                    document.querySelectorAll('.catgbox_list>li>a')[k].click();
                }
            }else//结束播放，返回课程列表页
            {
                console.log("视频学习完成，即将返回！");
                //获取返回URL，如果按返回按钮返回上一级，助手会因页面未刷新而停止运行
                var backUrl = window.localStorage.getItem("listPageHref");
                window.location.href = backUrl;
            }
        }

        var curTime;//当前进度时间变量
        var timeTotal;//视频时间长度变量

        console.log("第 "+ i + " 项完成进度：" + getVideoProgree(i));
        if(getVideoProgree(i) > 240)//如果圆形进度显示完成,正常251.2，但有时视频已播放完成但进度却不到。
        {
            i++;
            //console.log("第 "+ i + " 项完成进度：" + getVideoProgree(i));
            if(i >= itemArr.length)//如果本页已没有其他视频
            {
                console.log("视频学习完成，即将返回！");
                //获取返回URL，如果按返回按钮返回上一级，助手会因页面未刷新而停止运行
                var backUrl = window.localStorage.getItem("listPageHref");
                window.location.href = backUrl;
            }
        }else
        {
            //未选中状态下单击选择视频
            if(document.querySelectorAll(".catgbox_list>li")[i].className != "active"){
                console.log("选中状态：" + document.querySelectorAll(".catgbox_list>li")[i].className);
                document.querySelectorAll('.catgbox_list>li>a')[i].click();
            }
            //单击播放按钮
            if(document.getElementsByClassName('ccH5PlayBtn').length>0)
            {
                document.getElementsByClassName('ccH5PlayBtn')[0].click();
            }

            curTime=document.querySelector('.ccH5TimeCurrent').innerText;//获取当前进度时间
            timeTotal=document.querySelector('.ccH5TimeTotal').innerText;//获取视频时间长度

            if(curTime==timeTotal & document.readyState=="complete" & document.getElementsByClassName('adrPlayBtn').length > 0)//时间检测、网页是否加载完毕、重新播放按钮是否出现
            {
                i++;
                getNextVideo(i);//切换到下一个视频
            };
        }

        //----------------以下为处理弹窗--------------------
        if(document.getElementsByClassName('btn').length>0)//弹窗提示：重新播放、继续播放
        {
            //document.getElementsByClassName('btn')[1].click();//点击重新播放
            document.getElementsByClassName('btn')[1].click();//点击继续播放
        }
        if(document.getElementsByClassName('layui-layer-btn0').length>0)//弹窗提示：该视频已经完成学习,重复观看不会计入学习时长！
        {
            document.getElementsByClassName('layui-layer-btn0')[0].click();//点击确定按钮
        }
    }

    function start(){
        //判断当前是哪个页面
        if(location.pathname=="/Project/Task/"){
            console.log("目录页");
            //存储课程列表页href，供视频页面学习完成后返回之用
            window.localStorage.setItem("listPageHref",window.location.href);
            courseList()
        }else if(location.pathname=="/Project/CoursePlay/"){
            console.log("视频学习页");
            setInterval(kanke, 1000);
        }else{
            setTimeout(start,10000);
        }
    }

    //__________________________________
    //程序从此处开始执行：
    console.log("脚本加载正常");
    setTimeout(start, 1000);
})();