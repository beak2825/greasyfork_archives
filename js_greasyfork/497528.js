// ==UserScript==
// @name         云继教平台-第一版刷课脚本
// @namespace    https://saas.yunteacher.com/
// @version      1.1.2
// @description  云继教平台课刷课
// @author       泉水指挥官
// @match        *://*.yunteacher.com/*
// @icon         http*://www.google.com/s2/favicons?sz=64&domain=yunteacher.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/497528/%E4%BA%91%E7%BB%A7%E6%95%99%E5%B9%B3%E5%8F%B0-%E7%AC%AC%E4%B8%80%E7%89%88%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/497528/%E4%BA%91%E7%BB%A7%E6%95%99%E5%B9%B3%E5%8F%B0-%E7%AC%AC%E4%B8%80%E7%89%88%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(init, 3000)
    let timeSet = new Set();

    function init() {
        console.log("准备初始化")
        const currentUrl = window.location.href;
        if (currentUrl.includes('saas.yunteacher.com/index')) {
            document.querySelector(".avatar").click()
            setTimeout(GoToStudyPage, 2000)
        } else if (currentUrl.includes('saas.yunteacher.com/space/workbench')) {
            setTimeout(GoToStudyPage, 2000)
        } else if (currentUrl.includes('saas.yunteacher.com/module/zzxx/learningTask')) {
            getShouldViewCourse()
        } else {
            console.log("学习页面")
            // 启动定时器
            handleStudyPage();
        }
    }

    function handleStudyPage() {
        timeSet.clear()
        setInterval(function (){
            let hasNoStudyTime = document.querySelector(".notStudied")
            if (hasNoStudyTime) {
                let timeLeft = hasNoStudyTime.textContent.trim()
                console.log("剩余时间 " + timeLeft)
                console.log(timeSet)
                if (timeSet.has(timeLeft)) {
                    console.log("页面卡住了，可能需要刷新")
                    timeSet.clear()
                    location.reload()
                } else {
                    timeSet.add(timeLeft)
                }
            }
        }, 20000)
        setInterval(function () {
            console.log("学习页面-----------")
            const startIdx = document.querySelector(".startLearningDialog");
            if (startIdx) {
                const divStyle = window.getComputedStyle(startIdx);
                console.log(divStyle.display);
                if (divStyle.display !== "none") {
                    console.log("有开始学习按钮，关掉");
                    const start = document.querySelector(".startLearningBtn");
                    start.click();
                }
            }
            console.log('定时器存活');
            let leftBox = document.querySelectorAll(".courseCatalogue_box")
            if (leftBox.length === 0) {
                document.querySelector(".courseCatalogue_item").click();
            }
            const isCompleted = document.querySelector(".completed");
            if (!isCompleted) {
                console.log("当前章节未完成，请继续观看")
                return
            }
            setTimeout(function () {
                console.log("页面加载成功---等待查询待学视频")
                const courseBoxes = document.querySelectorAll('.courseVignette_box');
                console.log(courseBoxes)
                let shouldStop = false;
                // 计算必修的数量
                let vignetteList = document.querySelectorAll(".vignetteCompulsory")
                let curCourseShouldView = 0;
                let curCourseAllView = 0;
                for (const vignette of vignetteList) {
                    if (vignette.textContent.trim() === "必修") {
                        curCourseShouldView++
                    }
                }
                console.log("curCourseShouldView " + curCourseShouldView);


                for (const courseBox of courseBoxes) {
                    let curCourse = courseBox.querySelector('.vignette_title').textContent.trim()
                    console.log("当前遍历的是：" + curCourse)
                    if (shouldStop) {
                        console.log("在观看了。不继续遍历")
                        break;
                    }
                    const vignetteCompulsory = courseBox.querySelector('.vignetteCompulsory').textContent.trim();
                    const learningStatus = courseBox.querySelector('.learningStatus span').textContent.trim();
                    console.log("标题：" + curCourse + " 是否必选：" + vignetteCompulsory + "  学习状态为 " + learningStatus)
                    if (vignetteCompulsory === "必修" && learningStatus === "已学完") {
                        curCourseAllView++
                        console.log("这个必修视频已看完   " + curCourse)
                    }
                    if (courseBox.classList.contains("active")) {
                        console.log("当前正在观看的视频，跳过")
                        continue
                    }
                    if (vignetteCompulsory === "必修" && learningStatus !== "已学完") {
                        console.log("即将观看  " + curCourse);
                        timeSet.clear()
                        courseBox.click();
                        shouldStop = true;
                        break;
                    }
                }
                console.log("curCourseAllView " + curCourseAllView);

                if (curCourseShouldView <= curCourseAllView) {
                    let data = document.querySelector(".course_title").textContent.trim();
                    setStore("list", data)
                    console.log("curCourseAllView " + curCourseAllView);
                    console.log("本章节观看结束，准备跳到下章节");
                    timeSet.clear()
                    // clearInterval(intervalId); // 确保清除定时器
                    window.location.href = "https://saas.yunteacher.com/module/zzxx/learningTask?projectId=1005&roleId=26971";
                }
            }, 2000)
        }, 4000)

    }

    function GoToStudyPage() {
        const btns = document.querySelectorAll(".active_operation");
        console.log("--------------------------------------------------------");
        console.log(btns);
        console.log("--------------------------------------------------------");
        btns.forEach(function (btn) {
            console.log("我跳！")
            btn.click();
        });
    }

    function getShouldViewCourse() {
        const btnLearns = document.querySelectorAll(".learningProcess_box_subLevel_item");
        console.log("长度为 " + btnLearns.length);
        let shouldStop = false;
        let viewedTitle = getStore('list')
        console.log(viewedTitle)
        for (const btnLearn of btnLearns) {
            if (shouldStop) break;
            const items = btnLearn.querySelectorAll('.learningProcess_box_subLevelItem_content_right');
            const itemTitle = btnLearn.querySelector(".learningProcess_box_subLevelItem_content_text").textContent.trim().split("】")[1]
            console.log(itemTitle)
            if (viewedTitle.includes(itemTitle)) {
                console.log("我已经看过了" + itemTitle)
                continue
            }
            console.log("点击查看视频 " + itemTitle)
            btnLearn.click();
            break;
        }
    }

    // data是需要累加的数据
    function setStore(key, data) {
        const list = JSON.parse(localStorage.getItem(key)) || []
        list.push(data)
        localStorage.setItem(key, JSON.stringify(list))
    }

    function getStore(key) {
        return localStorage.getItem(key)
    }
})();
