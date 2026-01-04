// ==UserScript==
// @name         fjgb网络学院
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网络学院自动化，自动选择第一个未完成的课程，每10秒判断视频是否学习完成，完成后跳转至下一个。
// @author       You
// @match        http://220.160.52.178/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445301/fjgb%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/445301/fjgb%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //通过进度相等判断 id=showProgress
    //目前当前document.querySelector("#showProgress").textContent.slice(0,8)
    //结束时间document.querySelector("#showProgress").textContent.slice(9,18)
    //目录document.querySelector("#course_title_id")
    //第i个课程进度document.querySelectorAll("font")[i].textContent
    //第i个课程进度颜色document.querySelectorAll("font")[i].color
    //课程数量document.querySelectorAll("font").length
    //判断未完成的红色进度


    //打开年度必修
    if(document.querySelector(".ndbxk"))
    {
        console.log("找到年度必修按钮")
        document.querySelector(".ndbxk").click()
        //延迟等待加载
        setTimeout(function()
        {
            //找到第一个“开始学习”或继“继续学习”进行学习
            for(var x=0;x<document.querySelectorAll("a").length-1;x++)
            {
                if(document.querySelectorAll("a")[x].target=="_blank")
                {
                    if(document.querySelectorAll("a")[x].textContent=="继续学习"||document.querySelectorAll("a")[x].textContent=="开始学习")
                    {
                        //页面跳转
                        console.log("找到未完成课程")
                        location.href=document.querySelectorAll("a")[x].href
                        break;
                    }
                }
            }
        }
        ,1000)
    }

    //视频切换为音频
    document.querySelector("#changeBtn").click()
    //静音
    document.querySelector("#soundBtn").click()
    //移除必修课的font标签
    for(var n=0;n<document.querySelectorAll("font").length-1;n++)
    {
        if(document.querySelectorAll("font")[n].textContent=="[必修课]")
        {
            document.querySelectorAll("font")[n].remove()
        }
    }
    //打开第一个未完成的视频
    for(var i=0;i<document.querySelectorAll("font").length-1;i++)
    {
        if(document.querySelectorAll("font")[i].color=="red")
        {
            document.querySelectorAll("font")[i].click()
            //console.log(document.querySelectorAll("font")[i].textContent)
            console.log("当前是第",i+1,"个视频，共有",document.querySelectorAll("font").length,"个视频")
            break;
        }
    }

    var timer=setInterval
    (
        function()
        {
            //console.log("正在循环")
            //console.log("计时器：当前是第",i+1,"个视频,共有",document.querySelectorAll("font").length,"个视频")
            //如果到了最后一个视频，终止计时器
            if((i+1)==document.querySelectorAll("font").length)
            {
                console.log("已终止计时器")
                clearInterval(timer)
                return 0
            }
            //判断是否到时间
            if(document.querySelector("#showProgress").textContent.slice(0,8)=="00:00:00")
            {
                //console.log("播放下一集")
                document.querySelector("#endnext").click()
            }
        }
        , 10000 );
})();