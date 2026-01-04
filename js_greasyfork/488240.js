// ==UserScript==
// @name         中研企课堂全能小助手
// @namespace    satnip@163.com
// @version      0.0.4-beta
// @description  视频、文档自动播放，自动答题并下载答案
// @author       Caosh
// @match        https://ent.toujianyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toujianyun.com
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488240/%E4%B8%AD%E7%A0%94%E4%BC%81%E8%AF%BE%E5%A0%82%E5%85%A8%E8%83%BD%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488240/%E4%B8%AD%E7%A0%94%E4%BC%81%E8%AF%BE%E5%A0%82%E5%85%A8%E8%83%BD%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    getUrlType();

    // 判断网址类型
    function getUrlType() {
        const url = window.location.href;
        if (url.includes("course")) {
            addAutoExamButton();
        } else if (url.includes("report")) {
            if (GM_getValue("report-use") === "yes") {
                setTimeout(gotoAnswer, 2000);
            }
        } else if (url.includes("answer")) {
            if (GM_getValue("answer-use") === "yes") {
                setTimeout(getAnswer, 2000);
            }
        } else if (url.includes("exercise")) {
            if (GM_getValue("exercise-use") === "yes") {
                setTimeout(autoExam, 2000);
            }
        } else if (url.includes("lesson")) {
            setTimeout(autoProceedChapter, 2000);
        }
    }

    // 添加自动考试按钮
    function addAutoExamButton() {
        console.log("添加自动考试按钮");
        const buttons = document.querySelector("div[class='info-study clearfix']");
        const autoExamButton = GM_addElement(buttons, "button", {
            id: "auto-exam-button",
            textContent: "自动答题",
        });
        autoExamButton.classList.add("btn", "btn-lg", "btn-orange", "filleted");
        autoExamButton.addEventListener("click", startAutoExam);
    }

    // 开始自动考试
    function startAutoExam() {
        const examList = document.querySelectorAll(
            "[class*='new-detail-list-label detail-list-exercise']"
        );
        if (examList && examList.length !== 0) {
            GM_setValue("exercise-use", "no");
            GM_setValue("report-use", "no");
            GM_setValue("answer-use", "no");
            GM_setValue("all-exam-answer", "");
            GM_setValue("current-exam-answer", "");
            GM_setValue("has-answer", "yes");
            traversalExam(0, examList);
        }
    }

    // 自动进入考试页面/答题记录页面，并获取答案
    function traversalExam(index, examList) {
        if (index <= examList.length) {
            if (GM_getValue("has-answer") === "yes") {
                const allExamAnswer = GM_getValue("all-exam-answer");
                const currentExamAnswer = GM_getValue("current-exam-answer");
                GM_setValue("all-exam-answer", allExamAnswer + currentExamAnswer);
                const nextExamButton = examList[index];
                if (nextExamButton) {
                    GM_setValue("current-exam-answer", "");
                    GM_setValue("has-answer", "no");
                    GM_setValue("exercise-use", "yes");
                    GM_setValue("report-use", "yes");
                    nextExamButton.click();
                    traversalExam(index + 1, examList);
                } else {
                    const fileName1 = document.getElementsByClassName("info-title")[0].innerText + ".txt";
                    saveAnswer(GM_getValue("all-exam-answer"), fileName1);
                    GM_setValue("all-exam-answer", "");
                    GM_setValue("current-exam-answer", "");
                    GM_setValue("has-answer", "");
                    GM_setValue("exercise-use", "no");
                    GM_setValue("report-use", "no");
                    alert("当前课程已完成");
                }
            } else {
                setTimeout(() => traversalExam(index, examList), 2000);
            }
        } else {
            const fileName2 = document.getElementsByClassName("info-title")[0].innerText + ".txt";
            saveAnswer(GM_getValue("all-exam-answer"), fileName2);
            GM_setValue("all-exam-answer", "");
            GM_setValue("current-exam-answer", "");
            GM_setValue("has-answer", "");
            GM_setValue("exercise-use", "no");
            GM_setValue("report-use", "no");
            alert("当前课程已完成");
        }
    }

    // 保存文本到本地
    function saveAnswer(text, fileName) {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 从答题记录页进入答案查看页
    function gotoAnswer() {
        const answerButton = document
            .getElementsByClassName("table table-hover table-list")[0]
            .getElementsByTagName("tbody")[0]
            .getElementsByTagName("a")[1];
        GM_setValue("answer-use", "yes");
        GM_setValue("report-use", "no");
        answerButton.click();
    }

    // 自动考试（默认选择A选项后提交）
    function autoExam() {
        const questionList = document.getElementsByClassName("question-wrapper");
        if (questionList.length !== 0) {
            for (let i = 0; i < questionList.length; i++) {
                const question = questionList[i];
                const optionA = question.getElementsByTagName("input")[0];
                if (optionA) {
                    optionA.click();
                }
            }
        }
        const submitButton = document.getElementsByClassName("btn btn-blue J-save-btn")[0];
        if (submitButton) {
            GM_setValue("answer-use", "yes");
            submitButton.click();
        }
        GM_setValue("exercise-use", "no");
    }

    // 获取答案
    function getAnswer() {
        let result = "";
        const map = new Map([
            [0, "A"],
            [1, "B"],
            [2, "C"],
            [3, "D"],
            [4, "E"],
            [5, "F"],
            [6, "G"],
            [7, "H"],
            [8, "I"],
            [9, "J"],
        ]);
        const questionList = document.getElementsByClassName("question-wrapper");
        if (questionList.length === 0) {
            GM_setValue("current-exam-answer", "未获取到题目列表");
            GM_setValue("has-answer", "yes");
            GM_setValue("answer-use", "no");
            window.close();
        } else {
            for (let i = 0; i < questionList.length; i++) {
                const question = questionList[i];
                const questionTitle = question.getElementsByClassName("question-title")[0].innerText + "\n";
                let option = "";
                const questionOptionList = question.getElementsByTagName("li");
                for (let j = 0; j < questionOptionList.length; j++) {
                    option += `${map.get(j)}：${questionOptionList[j].innerText}\n`;
                }
                const questionAnswer = question.getElementsByClassName("question-answer")[0].innerText + "\n";
                result += questionTitle + option + questionAnswer;
            }
            GM_setValue("current-exam-answer", result);
            GM_setValue("has-answer", "yes");
            GM_setValue("answer-use", "no");
            window.close();
        }
    }

    // 自动章节学习
    function autoProceedChapter() {
        // 视频播放
        if (document.getElementsByTagName("video")[0] !== undefined) {
            setInterval(() => {
                const currentVideo = document.getElementsByTagName("video")[0];
                if (currentVideo.paused) {
                    // 获取弹窗中的选项（[1]为A选项）
                    const checkOption = document.getElementsByTagName("input")[1];
                    if (checkOption) {
                        checkOption.checked = true;
                        const submitButton = document.getElementsByClassName("btn btn-blue J-save-answer J-submit-answer")[0];
                        if (submitButton) {
                            submitButton.click();
                        }
                        const continueButton = document.getElementsByClassName("btn btn-blue J-submit-answer btn-continue")[0];
                        if (continueButton) {
                            continueButton.click();
                        }
                    }
                    if (currentVideo.paused) {
                        if (Math.trunc(currentVideo.currentTime) === Math.trunc(currentVideo.duration)) {
                            console.log("视频播放结束，跳转下一视频");
                            nextChapter();
                        } else {
                            console.log("视频播放暂停，恢复播放");
                            currentVideo.play();
                        }
                    }
                }
            }, 3000);
        }
        // 文档阅读
        if (document.getElementsByClassName('doc-controlbar controlbar-type-doc')[0] !== undefined) {
            console.log("进入文档播放页面");
            setInterval(() => {
                // 当前进度（当前页 00:30 | 总时长 01:00 / 23:30）
                const progressTex = document.getElementsByClassName('progress--text')[0].textContent;
                const timeMatch = progressTex.match(/(\d{1,2}:\d{2}(:\d{2})?)\s*\/\s*(\d{1,2}:\d{2}(:\d{2})?)/);
                if (!timeMatch) {
                    console.log("时间解析失败");
                }
                const currentTime = timeMatch[1].trim();
                const totalTime = timeMatch[3].trim();
                console.log(`当前阅读进度：${currentTime} / ${totalTime}`);
                if (currentTime === totalTime) {
                    console.log("当前文档阅读完毕");
                    nextChapter();
                } else {
                    console.log("文档阅读中");
                    const nextIcon = document.getElementsByClassName('iconfont icon-next')[0];
                    const inputElement = document.querySelector('input[name="active_slide_index"]');
                    const currentPage = parseInt(inputElement.dataset.val, 10);
                    const totalPagesText = inputElement.parentElement.textContent.trim();
                    const totalPages = parseInt(totalPagesText.split('/')[1].trim(), 10);
                    if (currentPage !== totalPages) {
                        nextIcon.click();
                    } else {
                        console.log("已经阅读至最后一页，向前阅读");
                        const preIcon = document.getElementsByClassName('iconfont icon-prev')[0];
                        if (currentPage !== 1) {
                            preIcon.click();
                        }
                    }
                }
            }, 30000);
        }
    }

    // 获取当前章节的位置
    function getPosition(currentUrl, chapterList) {
        for (let i = 0; i < chapterList.length; i++) {
            if (currentUrl === chapterList[i].href) {
                return i;
            }
        }
        return -1;
    }

    // 章节跳转
    function nextChapter() {
        const currentChapterUrl = window.location.href;
        const chapterList = document.querySelectorAll("a.catalogue-item.new-catalogue-item");
        const currentPosition = getPosition(currentChapterUrl, chapterList);
        if (currentPosition === -1){
            console.log("未找到当前正在进行的章节");
        }
        if (currentPosition + 1 >= chapterList.length) {
            alert("当前课程学习完毕");
        } else {
            const nextChapterUrl = chapterList[currentPosition + 1].href;
            window.location.href = nextChapterUrl;
        }
    }
})();