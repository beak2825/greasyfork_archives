// ==UserScript==
// @name         师加网能力提升工程学习辅助
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  师加网能力提升工程2.0视频学习辅助，全自动学习。
// @author       You
// @match        http://nlts.teacherplus.cn/*
// @icon         https://www.google.com/s2/favicons?domain=teacherplus.cn
// @grant        none
// @license      No license
// @downloadURL https://update.greasyfork.org/scripts/439281/%E5%B8%88%E5%8A%A0%E7%BD%91%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%B7%A5%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/439281/%E5%B8%88%E5%8A%A0%E7%BD%91%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%B7%A5%E7%A8%8B%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    var i = 0;
    var j = 1;
    function kanke(){
        document.querySelector(".help").innerText = "学习辅助运行中>>>"
        document.querySelector(".help").style.color = "red";
        document.querySelector(".alert.alert-warning.offset-t10").style.color = "red";


        //检测视频是否已被播放,播放完毕标记："fa fa-check text-green"
        let checkIsComplete = function(k){
            var isOver = document.querySelectorAll("#content > div.bs-docs-sidebar > ul > li > a > i ")[k*2].getAttribute("class");
            if(isOver == "fa fa-check text-green"){
                return true;
            }else{
                return false;
            }
        }
        // 切换视频
        let getNextVideo = function(k){
            if(k < itemArr.length)//继续播放其他视频
            {
                console.log("即将播放下一个！");
                if(document.getElementsByClassName("nav nav-list bs-docs-sidenav affix-top")[0].children[k].className != "active")
                {
                    document.getElementsByClassName("f-ib w100 text-etc")[k].click();
                }
            }else//结束播放，返回课程列表页
            {
                console.log("视频学习完成，即将返回！");
                //获取返回课程列表页URL
                var backUrl = window.localStorage.getItem("listPageHref");
                window.location.href = backUrl;
            }
        }

        let tipText = function(k){
            switch(k){
                case 1:
                    document.querySelector(".alert.alert-warning.offset-t10").textContent = "学习辅助值守中>>>视频播放完毕将自动切换 >"
                    break;
                case 2:
                    document.querySelector(".alert.alert-warning.offset-t10").textContent = "学习辅助值守中>>>视频播放完毕将自动切换 >>"
                    break;
                case 3:
                    document.querySelector(".alert.alert-warning.offset-t10").textContent = "学习辅助值守中>>>视频播放完毕将自动切换 >>>"
                    break;
            }
        }

        //获取本页视频数组
        var itemArr = document.getElementsByClassName("nav nav-list bs-docs-sidenav affix-top")[0].children;

        if(checkIsComplete(i) == true)//检测视频是否已学习过。
        {
            console.log("第 " + i + " 项视频已播放完毕！");
            i++;
            if(i >= itemArr.length)//本页没有其他视频
            {
                console.log("视频学习完成，即将返回！");
                //获取返回课程列表页URL
                var backUrl = window.localStorage.getItem("listPageHref");
                window.location.href = backUrl;
            }
        }else
        {
            //以下代码为动态显示提示文本:
            j++;
            if(j > 3){
                j = 1;
            }
            tipText(j);
            //未选中状态下单击选择视频
            if(document.getElementsByClassName("nav nav-list bs-docs-sidenav affix-top")[0].children[i].className != "active"){
                document.getElementsByClassName("f-ib w100 text-etc")[i].click();
            }
            //单击播放按钮
            if(document.getElementsByClassName("vjs-big-play-button").length>0)
            {
                document.getElementsByClassName("vjs-big-play-button")[0].click();
            }

            if(document.getElementsByClassName("modal-title").length > 0)//播放进度完毕提示出现
            {
                document.getElementsByClassName("btn btn-primary")[1].click()
                i++;
                getNextVideo(i);//切换到下一个视频
            };
        }
    }

    function courseList(){
        document.querySelector(".content-block-tit.clearfix").innerText = ">>> 学习助手启用中 >>>"
        //取出所有项目(25项)
        var itemAll = document.querySelectorAll(".project-item-course.collapse.in > table > tbody > tr");

        //console.log(itemAll.length);
        for(var i = 0;i<itemAll.length;i++){
            if(i >= itemAll.length){
                console.log("所有视频播放完毕！");
                return;
            }
            //获取当前课程观看进度
            var progrees = document.querySelectorAll(".project-item-course.collapse.in > table > tbody > tr")[i].getElementsByClassName("small")[1].innerText;
            //console.log(progrees);
            console.log("第 " + i + " 项进度：" + progrees);
            if(progrees != "100.00%"){
                console.log("即将播放第 " + i + " 项");
                document.querySelectorAll(".project-item-course.collapse.in > table > tbody > tr")[i].getElementsByClassName("btn btn-success btnPrepare")[0].click();
                break;
            }
        }
    }

    function start(){
        //match(/\/grain\/course\/\d*\/detail/)  "/project/course/5309243942330614050"
        if(location.pathname.match(/\/project\/course\/\d*/)){
            console.log("课程列表页");
            //存储当前课程列表页地址以备后面视频学习页返回
            window.localStorage.setItem("listPageHref",location.href);
            courseList();
        }else if(location.pathname.match(/\/learning\/course\/*/)){
            console.log("视频列表页");
            if(document.querySelector(".btn.btn-success.task-todo")){
                document.querySelector(".btn.btn-success.task-todo").click();
            }
        }else if(location.pathname.match(/\/learning\/task\/*/)){
            console.log("视频学习页");
            setInterval(kanke,1000);
        }else {
            setTimeout(start,10000);
        }
    }

    //__________________________________
    //程序从此处开始执行：
    console.log("脚本正常加载");
    setTimeout(start,1000);
})();