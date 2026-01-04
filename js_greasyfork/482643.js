// ==UserScript==
// @name         教师研修网辅助
// @namespace    https://github.com/huangdiv/user-scripts/
// @version      0.7
// @description  教师研修网看课自动辅助|自动进入下一个视频（或文件）|视频暂停时自动播放|一次刷完所有看课内容
// @author       huangdiv
// @icon         data:image/png;base64,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
// @match        *://ipx.yanxiu.com/*
// @license      CC-BY-NC-SA-4.0
// @homepageURL  https://greasyfork.org/zh-CN/scripts/431837-教师研修网辅助
// @supportURL   https://github.com/huangdiv/user-scripts/issues/3
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/482643/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/482643/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    //'use strict';

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function shutdownTab() {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }

    function insertLogoAndTextAfter(cssSelector, text) {
        if (!document.querySelector("#yxwfz-logo")) {
            document.querySelector(cssSelector).insertAdjacentHTML('afterEnd',
                "<a href = 'https://greasyfork.org/zh-CN/scripts/431837-教师研修网辅助' target = '_blank'>" +
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
            console.log("目标学时：" + minutesTotal + "分钟");
            // 插入辅助标识
            insertLogoAndTextAfter("p.title > span", "目标：" + minutesTotal + "分钟");
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
                    insertLogoAndTextAfter("p.title > span", "已打开第" + (i + 1) + "个课程，将在<span id = yxwfz-minutes>" + minutes.toFixed(2) + "</span>分钟后刷新");
                    console.log("【教师研修网辅助】\n" + "已打开列表中第" + (i + 1) + "个看课课程");
                    console.log("【教师研修网辅助】\n" + "计时器已启动");

                    function countMinute() {
                        document.querySelector("#yxwfz-minutes").innerText = minutes.toFixed(2);
                        console.log("【教师研修网辅助】\n" + "将在" + (minutes.toFixed(2)) + "分钟后刷新本列表页");
                        minutes = minutes - 1;
                        setTimeout(countMinute, 60 * 1000);
                    }

                    countMinute();
                    break;
                }
            }
        } else {
            console.log("恭喜您已完成看课所需学时！");
            setTimeout(function () {
                alert('恭喜您已完成看课所需学时！\n【教师研修网辅助】\n作者：huangdiv\n网址：http://huangdiv.com');
            }, 1000);
        }
    }

    function kanke() {

        // 插入辅助标识
        insertLogoAndTextAfter("span.icon.primary", "");

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
            if (document.querySelector("p.next")) {
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
            document.querySelector('div.commit > button.ivu-btn').disabled = false;
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
        console.log("【教师研修网辅助】\n" + document.querySelector(".state > span").innerText);
        document.querySelector("#yxwfz-text").innerText = document.querySelector(".state > span").innerText;
    }

    function lookList() {
        let tasksList = document.querySelectorAll('.task-item')
        for (let i = 0; i < tasksList.length; i++) {
            const score1 = tasksList[i].querySelectorAll('.score')[0].textContent
            const score2 = tasksList[i].querySelectorAll('.score')[1].textContent
            if (score1 !== score2) {
                tasksList[i].click()
            }
        }
    }

    function start() {
        //判断是哪个页面
        if (location.pathname == "/train/guide/course/list") {
            console.log("判断为课程列表页面");
            courseList();
        } else if (location.pathname.match(/\/grain\/course\/\d*\/detail/)) {
            console.log("判断为列表页面");
            setInterval(kanke, 5000);
        } else if (location.pathname.match(/\/workspace?projectId/)) {
            setInterval(lookList, 5000);
        } else {
            setTimeout(start, 10000);
        }
    }

    console.log("脚本加载正常");
    setTimeout(start, 3000);

})();
