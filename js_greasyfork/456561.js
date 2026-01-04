// ==UserScript==
// @name        视频学习
// @namespace    http://tampermonkey.net/
// @homepageURL https://gitee.com/pooorfoool/chromeExtensionForTower
// @version      2.1.1
// @description   适用于：灯塔-干部网络学院
// @author       郭
// @match        https://gbwlxy.dtdjzx.gov.cn/content*
// @match        https://gbwlxy.dtdjzx.gov.cn//content*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456561/%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/456561/%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
(function() {
     'use strict';
/*---------------------------------------------------------
版本:   V2.1.0
描述:   建议通过chrome插件运行
        2.1 添加了信息显示面板

问题：

----------------------------------------------------------*/
//1-17 22:37

setTimeout(watchURL, 3000);
window.open = function (url) { window.location.href = url; }
window.addEventListener("load", createMessageBox);
async function toNextCourse() {
    //1. 定位当前课程
    var currentCourse = document.querySelector(".suspended");
    var rightButton = document.querySelector("div.left-right>div.right>button");
    if (!currentCourse) {
        console.error("无法在本页定位课程,翻页")
        showMessage("无法在本页定位课程,翻页")
        rightButton.click();
        await wait(1);
        return await toNextCourse();
    }
    //2. 获取本页下一个课程
    var nextCourse = currentCourse.parentNode.parentNode.nextSibling;
    if (nextCourse) {
        sessionStorage.setItem("studyStatus", "videoReady")
        nextCourse.click();
        return;
    }
    console.warn("本课程在当前页末尾,需翻页") 
    showMessage("本课程在当前页末尾,翻页")
    //3. 判断是否是最后一课
    if(rightButton.getAttribute("disabled")=="disabled"){
        console.warn("已是最后一页,无法翻页");
        showMessage("已是最后一页,无法翻页")
        console.warn("本课程已是最后一课,学习结束");
        showMessage("本课程已是最后一页,学习结束")
        sessionStorage.setItem("studyStatus", "allEnded");
        return;
    }
    //4. 翻页
    rightButton.click();
    await wait(1); //等待加载
    //5. 获取下一页第一个课程
    var firstCourse = document.querySelector(".course-list-item");
    //6. 点击第一个课程
    sessionStorage.setItem("studyStatus", "videoReady")
    firstCourse.click();
}

function hasExam(){
    return document.querySelector(".rightBottom") !== null
}

function startVideo(){
    var video = document.querySelector("video");
    if (!video) {
        console.error("video not found")
        showMessage("video not found")
        return;
    }
    video.muted=true;
    video.currentTime=video.duration - 20; //学过的可以跳到末尾,以便快速结束本课
    video.play();
    if(!video.paused){
        sessionStorage.setItem("studyStatus", "videoPlaying")
        showMessage("开始播放视频")
    }  
}
function playVideo() {
    var video = document.querySelector("video");
    if (!video) {
        console.error("video not found")
        showMessage("video not found")
        return;
    }
    if (video.ended) {
        if (hasExam()) {
            sessionStorage.setItem("studyStatus", "waitExam")
            return;
        }else{
            sessionStorage.setItem("studyStatus", "videoEnded")
            return;
        }  
    }
    if (video.paused) {
        video.play();
    } 
}

async function watchURL() {
    var url = location.href;
    var studyStatus = sessionStorage.getItem("studyStatus");
    console.info("studyStatus",studyStatus)
    showMessage("程序运行中...")
    if (url.includes("coursedetail")) {
        switch (studyStatus) {
            case null:
                sessionStorage.setItem("studyStatus", "videoReady")
                break;
            case "videoReady":
                startVideo();
                break;
            case "videoPlaying":
                playVideo();
                break;
            case "waitExam":
                console.log("课程结束,等待考试......");
                showMessage("课程结束,等待考试......");
                break;
            case "allEnded":
                console.log("全部学习完毕");
                showMessage("全部学习完毕");
                alert("全部学习完毕");
                break;
            default:
                await toNextCourse();
                break;
        }    
    } else if (url.includes("startExam")) {
        switch (studyStatus) {    
            case "practice":
                //第一次,作答是为获取答案,答完刷新页面,准备开始第二次
                console.log("练习开始")
                showMessage("练习开始")
                await confirmStartExam();
                await fillAnswers();
                await confirmSubmit()
                console.log("练习结束")
                showMessage("练习结束")
                sessionStorage.setItem("studyStatus", "exam")
                await wait(5) //等待记录答案
                history.go(0); //刷新页面
                break;
            case "exam":
                //第二次,根据上次答案作答,答完返回视频,准备开始下一课
                console.log("考试开始")
                showMessage("考试开始")
                await confirmStartExam();
                await fillAnswers(getAnswers());
                await confirmSubmit()
                console.log("考试结束")
                showMessage("考试结束")
                await wait(5) //等等查看成绩
                sessionStorage.setItem("studyStatus", "examEnded")
                history.go(-1); //返回视频
                break;
            case "examEnded":
                console.log("考试结束,等待返回课程页面......")
                showMessage("考试结束,等待返回课程页面......")
                break;
            default:
                sessionStorage.setItem("studyStatus", "practice");
                break;
        }
    } else {
        sessionStorage.removeItem("studyStatus");
        console.log("等待课程页面......");
        showMessage("等待课程页面......")
    }
    setTimeout(watchURL, 3000)
}
function createMessageBox(){
    var messageBox=document.createElement('div')
    messageBox.className='right-fixed-wrap'
    messageBox.id='messageBox'
    messageBox.style.left='10px'
    messageBox.style.top='40%'
    messageBox.style.width="150px"
    messageBox.style.height="300px"
    messageBox.style.padding="5px"
    messageBox.style.fontSize="14px"
    messageBox.style.boxShadow='0 0 10px rgba(0,0,0,1)'
    var parent=document.querySelector('#domhtml')
    if (parent){
        parent.appendChild(messageBox)
    }
    
}
function showMessage(text){
    var messageBox=document.querySelector('#messageBox')
    if(!messageBox) return;
    var oldText=messageBox.innerText
    var textArray=oldText.split('\n')
    textArray.push(text)
    if(textArray.length>10){
        textArray.shift()
    }
    messageBox.innerText=textArray.join('\n')
}


window.confirmStartExam=async function () {
    var confirmBtutton = await waitElementDisplay("div[aria-label='dialog'] button.doingBtn",3)
    if (confirmBtutton) {
        confirmBtutton.click()
    }
}
window.confirmSubmit=async function () {
    let submitButton = await waitElementDisplay("div[aria-label='提示'] button.el-button--primary",3)
    if (submitButton) {
        submitButton.click()
    }
}

window.test=async function () {
    
    
    await wait(5)
    return "abc"
}

window.fillAnswers=async function (answers) {
    answers=answers || Array(30).fill('A')
    const questionList = document.querySelectorAll('.list_item')
    for (const [index, question] of questionList.entries()) {
        //answer=answers.shift()
        let result = await waitElementDisplay(question)
        if (!result) {
            console.log("题目未显示");
            showMessage("题目未显示");
            return;
        }
        // 选择答案
        if (answers[index].includes('A')) {
            question.querySelector('input[value="A"]').click()
            await wait(0.5)
        }
        if (answers[index].includes('B')) {
            question.querySelector('input[value="B"]').click()
            await wait(0.5)
        }
        if (answers[index].includes('C')) {
            question.querySelector('input[value="C"]').click()
            await wait(0.5)
        }
        if (answers[index].includes('D')) {
            question.querySelector('input[value="D"]').click()
            await wait(0.5)
        }
        if (answers[index].includes('E')) {
            question.querySelector('input[value="E"]').click()
            await wait(0.5)
        }
        // 下一题
        question.querySelector(".bast_quest_btn").nextElementSibling.click()
        await wait(1)
    }
}

async function waitElementDisplay(element, count = 10) {
    if (typeof (element) === "string") {
        element = document.querySelector(element)
    }
    if (count === 0) {
        console.log("waitElementDisplay", "timeout");
        return null;
    }
    if (element && element.offsetWidth > 0) {
        return element;
    }
    await wait(1);
    console.log("waitElementDisplay", count);
    return await waitElementDisplay(element, count - 1);
}
function wait(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, seconds * 1000)
    })
}
function getAnswers() {
    const answerString = sessionStorage.getItem("exemManageAnser")
    if (answerString) {
        return JSON.parse(answerString).map(item => item.answer)
    } else {
        return null
    }
}
})();