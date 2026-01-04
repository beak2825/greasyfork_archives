// ==UserScript==
// @name         安徽干部教育在线 全自动
// @namespace    http://tampermonkey.net/
// @version      2024-03-22
// @description  全自动，直到刷完整个题库
// @author       You
// @match        https://www.ahgbjy.gov.cn/*
// @icon         https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license  GPLv3
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/490525/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20%E5%85%A8%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490525/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20%E5%85%A8%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==
//屏蔽弹窗
(function () {
    
    const selectCourseURL = "https://www.ahgbjy.gov.cn/pc/course/courselist.do?categoryid=&year=&coutype=0&mostNInput=0&mostHInput=0&mostTJInput=&keyword="
    //设置选课URL，可以选择必修选修等等

    unsafeWindow.alert = () => { }
    unsafeWindow.confirm = () => false
    unsafeWindow.prompt = () => ""
    var currentURL = window.location.href;
    // 选课页面

    const checkAndReload = () => {//出错则重新加载
        if (document.querySelector("body > img") && document.querySelector("body > img").src === 'https://www.ahgbjy.gov.cn/commons/img/errorimge2.jpg') {
            location.reload()
        }
    }

    function selectCourse() {
        setTimeout(() => {
            for (let doc of document.querySelectorAll("td.trone")) {
                if (doc.querySelector("img.yx") && doc.querySelector("img.yx").src.indexOf("ywc.png") !== -1) {
                    console.log(doc)
                }
            }
            const unFinishList = Array.from(document.querySelectorAll("td.trone")).filter(doc => !(doc.querySelector("img.yx") && doc.querySelector("img.yx").src.indexOf("ywc.png") !== -1))
            if (unFinishList.length === 0) {
                document.getElementsByClassName("pagination")[0].lastChild.previousSibling.previousSibling.firstChild.click()//学完就报错吧 
            } else {
                window.location.href = unFinishList[0].querySelector("a").href
            }
        }, 3000) //等一下checkUserCourse的完成
    }


    // 课程详情页
    function courseDetail() {
        if (document.querySelector("body > div.container > div.row.courserow > div:nth-child(2) > div:nth-child(3) > span").innerText === "课程已学100%") {
            window.location.href = selectCourseURL//重新选课
        } else {
            document.querySelector("body > div.container > div.row.courserow > div:nth-child(2) > div.detail-ks.courseDoBtn > button.btn.btn-default.startlearn").click()
        }
    }

    const playCourse = () => {
        const mainFrame = document.mainFrame.document;//播放器的iframe

        const finishBtn = document.querySelector("#completebtn");

        const startButton = mainFrame.querySelector("div.user_choise")

        if (startButton != null) {//视频课程
            startButton.click()

            setTimeout(() => {
                mainFrame.querySelector("#course_player").currentTime = 0
            }, 3000)

            setInterval(() => {
                const nowTime = mainFrame.querySelector("#course_player").currentTime
                const totalTime = mainFrame.querySelector("#course_player").duration
                if (totalTime - nowTime < 3) {
                    setTimeout(() => { finishBtn.click() }, 5000)
                } else {
                    console.log("播放中 ... ", nowTime, totalTime)
                }
            }, 3000)

        } else {//PPT课程
            mainFrame.querySelector("#continueStudyButton").click()
            setInterval(() => {
                const nowTime = mainFrame.querySelector("#currentTimeLabel").innerText
                const totalTime = mainFrame.querySelector("#totalTimeLabel").innerText
                if (totalTime === nowTime) {
                    setTimeout(() => { finishBtn.click() }, 5000)
                } else {
                    console.log("播放中 ... ", nowTime, totalTime)
                }
            }, 1000)
        }

    }


    function StartFunc() {
        if (currentURL.includes('https://www.ahgbjy.gov.cn/pc/course/courselist.do')) {
            selectCourse(); // 开始选课
        } else if (currentURL.includes('https://www.ahgbjy.gov.cn/pc/course/coursedetail.do')) {
            courseDetail();
        } else if (currentURL.includes('https://www.ahgbjy.gov.cn/pc/course/playscorm.do')) {
            playCourse()
        }

    }


    window.onload = function () {
        // 调用需要在页面加载完成后执行的函数
        checkAndReload()
        StartFunc();
    }
})();
