// ==UserScript==
// @name         教师研修网-国培计划（2023）—江西省中小学（幼儿园）专卖版2024-2
// @namespace    教师研修网看课自动辅助
// @version      0.4
// @description  教师研修网看课自动辅助|自动进入下一个视频（或文件）|视频暂停时自动播放|一次刷完所有看课内容
// @author       shuake345
// @match        *://ipx.yanxiu.com/*
// @downloadURL https://update.greasyfork.org/scripts/484443/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91-%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%EF%BC%882023%EF%BC%89%E2%80%94%E6%B1%9F%E8%A5%BF%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%EF%BC%88%E5%B9%BC%E5%84%BF%E5%9B%AD%EF%BC%89%E4%B8%93%E5%8D%96%E7%89%882024-2.user.js
// @updateURL https://update.greasyfork.org/scripts/484443/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91-%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%EF%BC%882023%EF%BC%89%E2%80%94%E6%B1%9F%E8%A5%BF%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%EF%BC%88%E5%B9%BC%E5%84%BF%E5%9B%AD%EF%BC%89%E4%B8%93%E5%8D%96%E7%89%882024-2.meta.js
// ==/UserScript==

(function () {
    //'use strict';

    function sx(){window.location.reload()}

    function gbclose() {
		window.close()
	}
    document.addEventListener("visibilitychange", function() {
        if(document.visibilityState == "hidden") {
        } else if (document.visibilityState == "visible") {
            if(document.URL.search('train/workspace')>1 || document.URL.search('train/guide/course')>1){
                setTimeout(sx,201)}}});

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
            document.querySelector(cssSelector).insertAdjacentHTML('afterEnd',
                "<a href = '-教师研修网辅助' target = '_blank'>" +
                "<span id='yxwfz-logo' style= 'font-weight: 500;color: #ff0000;line-height: 30px;'>【教师研修网辅助】运行中>>>" +
                "<span id='yxwfz-text' style= 'font-weight: 300;color: #00ff00;'>" + text + "</span></span></a>"
            );
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
        let minutesTotal = getCoursesListGoal();
        document.querySelector("ul.filter-data > li:nth-child(3) > div > div.content > div:nth-child(3) > span").click();
        await sleep(500);
        if (document.querySelectorAll("div.item").length == 0) {
            document.querySelector("ul.filter-data > li:nth-child(3) > div > div.content > div:nth-child(1) > span").click();
        }
        await sleep(500);
        let courses = document.querySelectorAll("div.item");
        if (minutesTotal > 0) {
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
                    setTimeout("location.reload();", minutes * 60 * 1000);
                    insertLogoAndTextAfter("p.title > span","已打开第" + (i + 1) + "个课程，将在<span id = yxwfz-minutes>" + minutes.toFixed(2) + "</span>分钟后刷新");
                    function countMinute() {
                        document.querySelector("#yxwfz-minutes").innerText = minutes.toFixed(2);
                        minutes = minutes - 1;
                        setTimeout(countMinute, 60 * 1000);
                    }
                    countMinute();
                    break;
                }
            }
        } 
    }

    function kanke() {

        insertLogoAndTextAfter("span.icon.primary","");

        if (document.querySelector("video")) {
            let playerH5 = document.querySelector("video");
            playerH5.volume = 0; 
            if (playerH5.paused) {
                playerH5.play(); 
            }
        }

        if (document.querySelector("div.ended-mask").style.display == "") {
            if (document.querySelector("p.next")){
                document.querySelector("p.next").click();
                document.querySelector("#yxwfz-text").innerText = "一个看完，看下一个内容";
            } else {
                document.querySelector("#yxwfz-text").innerText = "播放完毕，即将关闭页面";
                shutdownTab();
            }
        }
        if (document.querySelector("div.alarmClock-wrapper").style.display == "") {
            document.querySelector("div.alarmClock-wrapper").click();
            document.querySelector("#yxwfz-text").innerText = "点继续看课";
        }
        if (document.querySelector("div.scoring-wrapper").style.display == "") {
            document.querySelector('div.commit > button.ivu-btn').disabled=false;
            document.querySelector('div.commit > button.ivu-btn').click();
            document.querySelector("#yxwfz-text").innerText = "给老师评价";
        }
        if (document.querySelectorAll("button.ivu-btn.ivu-btn-text").length == 2) {
            document.querySelectorAll("button.ivu-btn.ivu-btn-text")[1].click();
            document.querySelector("#yxwfz-text").innerText = "打开了其他播放页面，即将关闭本页面";
        }
        if (document.querySelector(".state > span").innerText.match(/您已完成看课总时长/)) {
            document.querySelector("#yxwfz-text").innerText = "课时已达成，即将关闭页面";
            shutdownTab();
        }
        document.querySelector("#yxwfz-text").innerText = document.querySelector(".state > span").innerText;
    }

    function start() {
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
    function Liebiaoye(){
    if(document.URL.search('train/workspace')>1){
        var Bank=document.querySelectorAll("div.tabs-wrap > div > div> div.tab-name")
        for (var j=0;j<Bank.length;j++){
            if(Bank[j].innerText=='网络研修'){
                Bank[j].click()
                break;
            }
        }
    }
    }
    setTimeout(Liebiaoye,3200)
    function Sy(){
        if(document.URL.search('grain/course')>1){
            setTimeout(gbclose,60000*10)
        }
    }
    setTimeout(Sy,6542)
    function Bak(){
        var Kc=document.querySelector("div > div > div > div > div.score-wrap > div.score")
        var Kcnum=Kc.length
            if(Kc.innerText!=='10'){
                console.log('看课')
                Kc.click()
            }

        for (var i=0;i<Kc.length;i++){
            if(Kc[i].nextElementSibling.className=="learn-status"){
                if(Kc[i].nextElementSibling.innerText.search(100)<1){
                    Kc[i].nextElementSibling.nextElementSibling.click()
                    break;
                   }else if(i==Kcnum-1){
                         document.querySelector("#app > div > section > section > main > div > div> div > div > aside > ul > li> div.phase-item-wrapper.web.is--selected").parentElement.nextElementSibling.click()
                         setTimeout(Liebiaoye,3200)
                     }
            }else if(Kc[i].nextElementSibling.className=="learn-btn"){
                     Kc[i].nextElementSibling.click()
                break;
                     }
        }
    }
    setTimeout(Bak,5424)
    function CY(){
        if(document.URL.search('train/guide/course')>1){
            if(document.querySelectorAll("div.item-infos.pass").length==12){//next
                document.querySelector("li.ivu-page-next").click()
                setTimeout(CY,2524)
            }else{
        document.querySelectorAll(" div.list-wrapper > div > div> div > div.item-cover > span.img")[0].click()
            }
        }
    }
    setTimeout(CY,2352)

})();
