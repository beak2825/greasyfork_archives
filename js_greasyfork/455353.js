// ==UserScript==
// @name         职行力视频自动播放
// @namespace    https://www.nekotofu.top/
// @homepage     https://www.nekotofu.top/
// @version      1.3
// @description  自动播放和评价职行力视频。
// @author       misaka10032w
// @match        *://u.exexm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455353/%E8%81%8C%E8%A1%8C%E5%8A%9B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455353/%E8%81%8C%E8%A1%8C%E5%8A%9B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

let autoPlayFlag = false;

const createButton = (id, text, styles) => {
    const button = document.createElement("button");
    button.id = id;
    button.innerHTML = text;
    Object.assign(button.style, styles);
    return button;
};

const initializeButtons = () => {
    if (document.getElementById("autoPlayBtn") === null) {
        const playButton = createButton("autoPlayBtn", "开始刷课", {
            height: "100px",
            width: "200px",
            background: "green",
            color: "white",
            zIndex: "9999",
            position: "absolute"
        });

        const copyButton = createButton("toggleEditableBtn", "页面可复制", {
            height: "20px",
            width: "200px",
            background: "blue",
            color: "white",
            zIndex: "9999",
            position: "absolute"
        });

        const container = document.querySelector("body > ion-app > ng-component > ion-nav > ng-component > exe-menus > div > div > ion-content > div.scroll-content > ion-list");
        container.appendChild(playButton);
        container.appendChild(copyButton);

        document.getElementById("autoPlayBtn").onclick = toggleAutoPlay;
        document.getElementById("toggleEditableBtn").onclick = toggleEditable;
    }
};

const toggleAutoPlay = () => {
    autoPlayFlag = !autoPlayFlag;
    const playButton = document.getElementById("autoPlayBtn");
    playButton.style.background = autoPlayFlag ? "red" : "green";
    playButton.innerHTML = autoPlayFlag ? "停止刷课" : "开始刷课";
};

const toggleEditable = () => {
    const body = document.body;
    body.contentEditable = body.contentEditable === "true" ? "false" : "true";
    document.getElementById("toggleEditableBtn").innerHTML = body.contentEditable;
};

const playCourseContent = () => {
    const courseList = document.querySelectorAll(".course-item");
    let targetCourse = null;

    courseList.forEach(course => {
        if (!course.classList.contains("learned") && !course.classList.contains("exam2_top") && !course.getAttribute("exepower")) {
            targetCourse = course;
        }
    });

    if (targetCourse) {
        if (targetCourse.innerText.includes("文档课件")) {
            handleDocumentCourse(targetCourse);
        } else if (targetCourse.innerText.includes("音频")) {
            handleAudioCourse(targetCourse);
        } else if (targetCourse.innerText.includes("视频")) {
            handleVideoCourse(targetCourse);
        }
    } else {
        evaluateCourse();
    }
};

const handleDocumentCourse = (course) => {
    course.click();
    setTimeout(() => {
        document.querySelector(".exe-win-open-modal .back-button").click();
    }, 5000);
};

const handleAudioCourse = (course) => {
    let audio = document.querySelector("audio");
    if (!audio) {
        course.click();
        audio = document.querySelector("audio");
    }
    audio.muted = true;

    setTimeout(() => {
        if (audio.currentTime.toFixed(0) === audio.duration.toFixed(0)) {
            document.querySelector("#nav > course-detail-page > ion-header > ion-navbar > button").click();
        } else if (audio.paused) {
            audio.play();
        }
    }, 1000);
};

const handleVideoCourse = (course) => {
    console.log(course)
    setTimeout(() => {
        let video = document.querySelector(".player-container video");
        if (!video) {
            course.click();
            console.log("未发现video控件！")
            video = document.querySelector(".player-container video");
        }
        video.muted = true;

        setTimeout(() => {
            if (video.currentTime.toFixed(0) === video.duration.toFixed(0)) {
                document.querySelector("#nav > course-detail-page > ion-header > ion-navbar > button").click();
            } else if (video.paused) {
                video.play();
            }
        }, 3000);
    }, 3000);
};

const evaluateCourse = () => {
    const courseList = document.querySelectorAll(".course-item");
    const lastCourse = courseList[courseList.length - 1];

    if (lastCourse.innerHTML.includes("已评定")) {
        setTimeout(() => {
            document.querySelector(".show-back-button").click();
        }, 2000);
    } else if (lastCourse.innerHTML.includes("评价")) {
        lastCourse.click();
        setTimeout(() => {
            document.querySelector("body > ion-app > ion-modal > div > modal-evaluate > ion-content > div.scroll-content > exe-content > exe-evaluate-modal > section > div > exe-single-dimension > exe-star > button:nth-child(5)").click();
            document.querySelector("body > ion-app > ion-modal > div > modal-evaluate > ion-content > div.scroll-content > exe-content > exe-evaluate-modal > section > div > section > textarea").value = "很好，讲的不错";
            document.querySelector("body > ion-app > ion-modal > div > ng-component > ion-footer > div > button").click();
        }, 2000);

        setTimeout(() => {
            document.querySelector("body > ion-app > ion-modal > div > modal-evaluate > ion-footer > div > button").click();
        }, 3000);
    }
};

setInterval(() => {
    "use strict";
    initializeButtons();
    if (!autoPlayFlag) {
        console.log("刷课停止");
        return;
    }
    console.log("刷课中");

    const coursePage = document.getElementById("introduce");
    if (coursePage) {
        playCourseContent();
    } else if (document.querySelector("#nav > page-learn > ion-content > div.scroll-content > ion-card > exe-segment")?.innerHTML.includes("在学课程")) {
        const studyingCourses = document.querySelector("#nav > page-learn > ion-content > div.scroll-content > ion-card > exe-content:nth-child(2) > ion-list").querySelectorAll("exe-learn-card");
        if (studyingCourses.length) {
            studyingCourses[0].click();
        }
    } else {
        console.log("非课程列表或课程详情");
    }
}, 6000);
