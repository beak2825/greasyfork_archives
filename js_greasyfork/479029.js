// ==UserScript==
// @name         师学通-平江县中小学教师信息技术2.0-代刷
// @namespace    刷课V软件定制：vx,shuake345
// @version      0.3
// @description  自动换课|自动学习|刷课VX：shuake345
// @author       刷课VX：shuake345
// @match        *://*.stu.teacher.com.cn/course/*
// @match        *://*.stu.teacher.com.cn/studyPlan*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479029/%E5%B8%88%E5%AD%A6%E9%80%9A-%E5%B9%B3%E6%B1%9F%E5%8E%BF%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF20-%E4%BB%A3%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/479029/%E5%B8%88%E5%AD%A6%E9%80%9A-%E5%B9%B3%E6%B1%9F%E5%8E%BF%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF20-%E4%BB%A3%E5%88%B7.meta.js
// ==/UserScript==

(function () {
    //'use strict';
    var timeneed

     document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        console.log('隐藏');

    } else if (document.visibilityState == "visible") {
        if(document.URL.search('pointView')>1){
            sx()
        }
         if(document.URL.search('list')>1){
    setTimeout(gb,1242)
    }

    }
});
    function fh() {
		window.history.go(-1)
	}
    function gb(){
        window.close()
    }

    function sx() {
		window.location.reload()
	}

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function shutdownTab(){
        window.opener=null;
        window.open('','_self');
        window.close();
    }

    function insertLogoAndTextAfter(cssSelector, text){
        if (!document.querySelector("#yxwfz-logo")) {
            
        } else {
            document.querySelector("#yxwfz-text").innerHTML = text;
        }
    }

    function getCoursesListGoal() {
        if (document.querySelectorAll("em").length) {
            return parseInt(document.querySelectorAll("em")[0].innerText.match(/\d+(?=分钟)/)) - parseInt(
                document.querySelectorAll("em")[1].innerText.match(/\d+(?=分钟)/)[0]);
        } else {
            return 300;
        }
    }

    function getCourseProgress(courseDivItem) {
        if (courseDivItem.firstElementChild.lastElementChild.className == "item-infos pass") {
            return 1;
        } else if (courseDivItem.firstElementChild.lastElementChild.lastElementChild.childElementCount ==
            1) {
            return 0;
        } else {
            return 0.01 * parseInt(courseDivItem.firstElementChild.lastElementChild.lastElementChild
                .lastElementChild.innerText.match(/\d+(?=%)/)[0]);
        }
    }

    async function courseList() {
        await sleep(500);
        //课程选择
        let minutesTotal = getCoursesListGoal();
        document.querySelector("ul.filter-data > li:nth-child(3) > div > div.content > div:nth-child(3) > span").click();
        await sleep(500);
        if (document.querySelectorAll("div.item").length == 0) {
            document.querySelector("ul.filter-data > li:nth-child(3) > div > div.content > div:nth-child(1) > span").click();
        }
        await sleep(500);
        let courses = document.querySelectorAll("div.item");
        if (minutesTotal > 0) {
            console.log("目标学时：" + minutesTotal +"分钟");
            // 插入辅助标识
            insertLogoAndTextAfter("p.title > span","目标：" + minutesTotal +"分钟");
            for (var i = 0; i < courses.length; i++) {
                let jindubi = getCourseProgress(courses[i]);
                let minutes = (1 - jindubi) * parseInt(courses[i].firstElementChild.firstElementChild.lastElementChild
                    .innerText.match(/\d+(?=分钟)/)[0]);
                    minutes = minutes < minutesTotal ? minutes : minutesTotal;
                if (jindubi == 1) {
                    continue;
                } else {
                    courses[i].firstChild.firstChild.click();
                    setTimeout(gb, minutes * 60 * 1000);
                    insertLogoAndTextAfter("p.title > span","已打开第" + (i + 1) + "个课程，将在<span id = yxwfz-minutes>" + minutes.toFixed(2) + "</span>分钟后关闭");
                    function countMinute() {
                        document.querySelector("#yxwfz-minutes").innerText = minutes.toFixed(2);
                        minutes = minutes - 1;
                        setTimeout(countMinute, 60 * 1000);
                    }
                    countMinute();
                    break;
                }
            }
        } else {
        }
    }

    function kanke() {

        // 插入辅助标识
        insertLogoAndTextAfter("span.icon.primary","");

        //处理播放器事件
        if (document.querySelector("video")) {
            let playerH5 = document.querySelector("video");
            playerH5.volume = 0; //不想听声音
            if (playerH5.paused) {
                playerH5.play(); //不要暂停，播下去
            }
        }

        //处理各种突发事件
        if (document.querySelector("div.ended-mask").style.display == "") {
            if (document.querySelector("p.next")){
                document.querySelector("p.next").click();
                console.log("一个看完，看下一个内容");
                document.querySelector("#yxwfz-text").innerText = "一个看完，看下一个内容";
            } else {
                console.log("播放完毕，即将关闭页面");
                document.querySelector("#yxwfz-text").innerText = "播放完毕，即将关闭页面";
                shutdownTab();
            }
        }
        if (document.querySelector("div.alarmClock-wrapper").style.display == "") {
            document.querySelector("div.alarmClock-wrapper").click();
            console.log("点继续看课");
            document.querySelector("#yxwfz-text").innerText = "点继续看课";
        }
        if (document.querySelector("div.scoring-wrapper").style.display == "") {
            document.querySelector('div.commit > button.ivu-btn').disabled=false;
            document.querySelector('div.commit > button.ivu-btn').click();
            console.log("给老师评价");
            document.querySelector("#yxwfz-text").innerText = "给老师评价";
        }
        if (document.querySelectorAll("button.ivu-btn.ivu-btn-text").length == 2) {
            document.querySelectorAll("button.ivu-btn.ivu-btn-text")[1].click();
            console.log("打开了其他播放页面，即将关闭本页面");
            document.querySelector("#yxwfz-text").innerText = "打开了其他播放页面，即将关闭本页面";
        }
        if (document.querySelector(".state > span").innerText.match(/您已完成看课总时长/)) {
            console.log("课时已达成，即将关闭页面");
            document.querySelector("#yxwfz-text").innerText = "课时已达成，即将关闭页面";
            shutdownTab();
        }
        //检测运行是否良好
        document.querySelector("#yxwfz-text").innerText = document.querySelector(".state > span").innerText;
    }

    function start() {
        //判断是哪个页面
        if (location.pathname=="/train/guide/course/list") {
            courseList();
        } else if (location.pathname.match(/\/grain\/course\/\d*\/detail/)) {
            setInterval(kanke, 5000);
        } else {
            setTimeout(start,10000);
        }
    }

    console.log("脚本加载正常");
    setTimeout(start, 3000);
    function zy(){
        if(document.URL.search('pointView')>1){
    var xialaanniu=document.querySelectorAll('[class="task-btns"]')
    for (var i=0;i<xialaanniu.length;i++){
        xialaanniu[i].click()
        }
            setTimeout(xuanzheshijian,2415)
    }
    }
    setTimeout(zy,5424)
    function xuanzheshijian(){//dianji
    var anniu=document.querySelectorAll('[class="num"]')
    for (var i=0;i<anniu.length;i++){
        if(anniu[i].innerText== "开始学习"){//已看时间<120分钟
            if(parseInt(anniu[i].offsetParent.previousElementSibling.innerText.replace(/[^\d]/g,'')) <timeneed){
            anniu[i].click()
            break;
            }
            }
    }
    }

    function sy(){
         if(document.URL.search('courseSourceId')>1){
    if(document.querySelector('div.action-timer>span>span').innerText.search('已完成看')>0){
    setTimeout(gb,1242)
    }
         }
    }
    setInterval(sy,15424)

})();
