// ==UserScript==
// @name         QFZ网大自动学习机
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  支持功能：自动切换章节、自动切换视频、自动提交随机选项以记录答案、根据记录答案自动完成考试
// @author       yuyang
// @match        https://kc.zhixueyun.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481461/QFZ%E7%BD%91%E5%A4%A7%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481461/QFZ%E7%BD%91%E5%A4%A7%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E6%9C%BA.meta.js
// ==/UserScript==
const modal = document.createElement("div")
const modalCss = "overflow:hidden;z-index:999999;position:absolute;width:400px;height:250px;background-color:white;bottom:5%;right:5%;font-size: 18px;padding: 4px;color: black;border: 4px red solid;"
modal.style.cssText = modalCss
modal.innerHTML += "小助手日志<br/>"
document.body.appendChild(modal)

function modalMessage(message) {
    modal.innerHTML += message + "<br/>"
    modal.scrollTop = modal.scrollHeight
}

function logWithColor(text) {
    console.log(`%c${text}`, 'color: #fff; background: #f40; font-size: 15px;border-radius:0 6px 6px 0;padding:6px;');
    modalMessage(text)
}

function waitForElementReady(parent, selector, checker) {
    return new Promise((resolve) => {
        setTimeout(resolve, 5000)
    })
}


window.addEventListener("beforeunload", (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = "";
});

async function pageSubjectDetail() {
    // 课程详情
    logWithColor("课程详情页面")
    await waitForElementReady()
    logWithColor(`记录当前学习课程链接 ${window.location.href}`)
    localStorage.setItem("subject-detail", window.location.href)
    logWithColor("获取章节完成进度:")
    let chapterNodes = [...document.querySelectorAll("[id^='D294studyBtn']")]
    // 名字和完成状态
    const status = chapterNodes.map(node => ({
        title: node.querySelector(".name-des").innerText,
        isComplete: node.querySelector(".operation").querySelector(".small").innerText.includes("重新学习"),
        node: node
    }))
    console.table(status)
    const inComplete = status.find(s => !s.isComplete)
    if (!inComplete) {
        logWithColor("所有课程已完成")
        return
    }

    logWithColor(`找到最近的未完成课程: 「${inComplete.title}」 正在跳转...`)
    inComplete.node.querySelector(".name-des").click()
    setTimeout(() => window.close(), 3000)
}



async function pageStudyCourse() {
    // 获得当前学习是 视频 还是 考试
    // 获取侧边栏信息以当前需要处理的任务
    logWithColor("学习任务页面")
    if (!document.querySelector("#D195container")) {
        logWithColor("等待标识容器D195加载")
        await waitForElementReady(document, "#D195container", () => true)
        logWithColor("标识容器D195加载完成 开始执行")
    }
    const fetchCurrentInfo = () => {
        const sideContainerId = "#D196course-side-catalog"
        const sideItemNodes = [...document.querySelector(sideContainerId).querySelectorAll(".chapter-list-box")]
        const sideItemInfo = sideItemNodes.map(node => ({
            id: node.id,
            name: node.querySelector(`div[title]:not([title=""])`).innerText.replaceAll(/第.*: /g, ""),
            type: node.querySelector(".section-item").querySelector(".item").innerHTML,
            isComplete: (node.querySelector(".section-item").querySelector(".item").innerHTML.includes("视频")
                    && node.querySelector(".section-item").querySelector("span").innerText.includes("重新学习")) ||
                (node.querySelector(".section-item").querySelector(".item").innerHTML.includes("考试")
                    && node.querySelector(".section-item").querySelector("span").innerText.includes("成绩100"))  ||
                (node.querySelector(".section-item").querySelector(".item").innerHTML.includes("文档")
                    && node.querySelector(".section-item").querySelector("span").innerText.includes("重新学习"))
        }))
        logWithColor("当前的学习进度")
        console.table(sideItemInfo)
        const incItem = sideItemInfo.find(info => !info.isComplete)
        if (!incItem) {
            logWithColor("本章已学完")
        } else {
            logWithColor("当前学习任务:" + incItem.name)
        }
        return incItem
    }
    let currentStudyInfo

    while (true) {
        // 更新当前任务
        const res = fetchCurrentInfo()
        if (!res) {
            logWithColor("结束")
            // 没有未完成的任务了
            break
        } else {
            currentStudyInfo = res
        }
        // 处理学习任务
        // 切换对应任务
        document.getElementById(currentStudyInfo.id).click()
        const totalParentSelector = ".player-content"
        await new Promise(resolve => setTimeout(resolve, 5000))
        if (currentStudyInfo.type === "视频") {
            const video = document.querySelector("video")
            video.play()
            // video.setAttribute("autoplay", "true")
            // video.setAttribute("muted", "true")
            video.muted = true
            if (!document.querySelector("#D195container")) {
                logWithColor("视频任务 等待视频加载")
                // await waitForElementReady(document.querySelector(totalParentSelector), "div.vjs-current-time-display", () => true)
                // await waitForElementReady(document.querySelector(totalParentSelector), "div.vjs-control-text", (el) => el.innerHTML.includes("播放"))
                await waitForElementReady(document.querySelector(totalParentSelector), "div", () => !!document.querySelector(totalParentSelector).querySelector(".videojs-referse-btn"))
            }
            logWithColor("视频任务 加载完成")
            // 重新播放按钮
            const refersebtn = document.querySelector(totalParentSelector).querySelector(".vjs-paused")
            if (refersebtn) {
                logWithColor("视频任务 点击恢复播放")
                // document.querySelector(".vjs-play-control").click()
                video.play()
                // refersebtn.click()
            }
            logWithColor("视频任务 等待视频播放中")
            await waitForElementReady(document.querySelector(".catalog-control"), {childList: true}, 0)
        }
        if (currentStudyInfo.type === "考试") {
            if (!document.querySelector(".demand-table")) {
                logWithColor("考试任务 等待考试记录加载")
                await waitForElementReady(document.querySelector(".player-content"), "div.demand-table", (element) => {
                    return element.querySelector(".repeat-exam");
                })
            }
            logWithColor("考试任务 加载完成 检查完成状态")
            const statusNode = document.querySelector(totalParentSelector).querySelector(".neer-status")
            if (!statusNode) {
                logWithColor("考试任务 没有考试记录 点进去开始考试")
                let joinBtn = document.querySelector(totalParentSelector).querySelector(".new-exam")
                if (joinBtn == null) {
                    joinBtn = document.querySelector(totalParentSelector).querySelector(".repeat-exam")
                }
                joinBtn.firstElementChild.click()
                setTimeout(() => window.close(), 3000)
            } else {
                logWithColor(`考试答案 ${getAnswer(currentStudyInfo.name)}`)
                if (getAnswer(currentStudyInfo.name) == null) {
                    logWithColor("考试任务 有记录 进入收集答案")
                    document.querySelector(totalParentSelector).querySelector(".new-exam").click()
                    setTimeout(() => window.close(), 3000)
                } else {
                    logWithColor("考试任务 有答案 进入开始考试")
                    document.querySelector(totalParentSelector).querySelector(".repeat-exam").firstElementChild.click()
                    setTimeout(() => window.close(), 3000)
                }
            }
            return
        }
        if (currentStudyInfo.type === "文档") {
            logWithColor("文档任务 等待文档加载")
            await waitForElementReady()
        }
    }

    logWithColor(`跳转到上次打开的课程详情页面 = ${localStorage.getItem("subject-detail")}`)
    window.open(localStorage.getItem("subject-detail"), "_blank")
    setTimeout(() => window.close(), 3000)
}
async function scoreDetail() {
    logWithColor("考试结果页面")
    const textSelector = "div[data-current='exam/exam/question/types/answer/choise:content']"
    const optionSelect = "div[data-current='exam/exam/question/types/answer/choise:options']"
    if (!document.querySelector(".preview-content")) {
        logWithColor("等待答案加载中")
        await waitForElementReady(document, textSelector, (el) => !!document.querySelector(".show-answer").querySelector(".custom-color-4"))
        logWithColor("答案加载完成")
    }
    logWithColor("正在收集答案")
    const optionList = []
    while (true) {
        // 获取选项信息
        const text = document.querySelector(".preview-content").querySelector(".show-answer").querySelector(".custom-color-4")
        const op = text.innerHTML.split(":")[1].trim()
        optionList.push(op)

        logWithColor(`题目${optionList.length} 选项: ${op} 已记录`)
        const bottomBtn = document.querySelector(".preview-content").querySelector(".m-bottom").firstElementChild
        if (bottomBtn.innerHTML.includes("上一题")) {
            logWithColor("已获取全部题目答案")
            break
        }
        if (bottomBtn.innerHTML.includes("下一题")) {
            logWithColor("加载下个题目")
            bottomBtn.click()
            await waitForElementReady(document, textSelector, (el) => !!document.querySelector(".show-answer").querySelector(".custom-color-4"))
        }
    }

    const answerData = {
        examTitle: document.querySelector(".achievement-head").querySelector(".title").getAttribute("title"),
        optionList
    }

    saveAnswer(answerData)
    logWithColor(`跳转到上次打开的课程详情页面 = ${localStorage.getItem("subject-detail")}`)
    window.open(localStorage.getItem("subject-detail"), "_blank")
    setTimeout(() => window.close(), 3000)

}
const KEY_ANSWER = "QFZ.answer"
function saveAnswer(answer) {
    let pre = localStorage.getItem(KEY_ANSWER)
    let arr = []
    if (pre == null || pre === "") {
        pre = "[]"
        localStorage.setItem(KEY_ANSWER, pre)
    } else {
        arr = JSON.parse(pre)
    }
    answer.examTitle = answer.examTitle.trim()
    if (arr.find(a => a.examTitle === answer.examTitle)) return
    arr.push(answer)
    localStorage.setItem(KEY_ANSWER, JSON.stringify(arr))
}

function getAnswer(title) {
    let pre = localStorage.getItem(KEY_ANSWER)
    if (pre == null) {
        return null
    }
    const arr = JSON.parse(pre)
    const ol = arr.find(a => a.examTitle === title.trim())
    if (ol != null) {
        return ol.optionList
    } else {
        return null
    }
}
async function pageExam() {
    logWithColor("考试页面")
    const textSelector = "div[data-current='exam/exam/question/types/answer/choise:content']"
    if (!document.querySelector(".preview-content")) {
        logWithColor("等待题目加载中")
        await waitForElementReady(document, textSelector, (el) => !!document.querySelector(".question").querySelector("span"))
        logWithColor("题目加载完成")
    }
    const examTitle = document.querySelector(".achievement-head").querySelector(".title").getAttribute("title")
    logWithColor(`当前考试标题: ${examTitle} 尝试获取答案`)
    const answer = getAnswer(examTitle)
    let opList;
    if (answer !== null) {
        logWithColor("找到答案 开始答题")
        opList = answer
    } else {
        logWithColor("未找到答案 随机回答并提交以获取正确答案")
        opList = ["A", "A"]
    }
    // 开始答题
    while (true) {
        const op = opList.shift().split("") // 当前要作答的选项
        // 所有选项列表
        const ddList = document.querySelector("div[data-current='exam/exam/question/types/answer/choise:options']").querySelectorAll("dd")
        logWithColor("进行选择: " + op)
        ddList.forEach(d => {
            const leftNum = d.querySelector(".option-num").innerHTML
            op.forEach(o => {
                if(leftNum.includes(o)) {
                    console.log(d.id)
                    document.getElementById(d.id).querySelector("input").click()
                }
            })
        })
        const bottomBtn = document.querySelector(".preview-content").querySelectorAll(".m-bottom").item(1).firstElementChild
        console.log(bottomBtn)
        if (bottomBtn.innerHTML.includes("上一题")) {
            logWithColor("已作答全部题目 提交试卷")
            break
        }
        if (bottomBtn.innerHTML.includes("下一题")) {
            logWithColor("加载下个题目")
            bottomBtn.click()
            await waitForElementReady(document, textSelector, (el) => !!document.querySelector(".question").querySelector("span"))
        }
    }
    // 提交试卷
    document.querySelector("#D165submit").click()
    await waitForElementReady(document, "#alertify", () => true)
    document.querySelector("#alertify").querySelector(".alertify-button-ok").click()

    logWithColor(`跳转到上次打开的课程详情页面 = ${localStorage.getItem("subject-detail")}`)
    window.open(localStorage.getItem("subject-detail"), "_blank")

    setTimeout(() => window.close(), 3000)
}
(async function() {
    'use strict';
    const href = window.location.href
    if (href.includes("study/subject/detail")) {
        await pageSubjectDetail()
    }
    if (href.includes("study/course/detail")) {
        await pageStudyCourse()
    }
    if (href.includes("exam/exam/front/score-detail")) {
        await scoreDetail()
    }
    if (href.includes("exam/exam/answer-paper")) {
        await pageExam()
    }

})();