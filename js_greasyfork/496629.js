// ==UserScript==
// @name         百度知了爱学，免登录魔改刷题
// @namespace    http://tampermonkey.net/
// @version      2024-05-31
// @description  百度知了爱学免登录魔改刷题
// @author       silvio27
// @match        https://aistudy.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/496629/%E7%99%BE%E5%BA%A6%E7%9F%A5%E4%BA%86%E7%88%B1%E5%AD%A6%EF%BC%8C%E5%85%8D%E7%99%BB%E5%BD%95%E9%AD%94%E6%94%B9%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/496629/%E7%99%BE%E5%BA%A6%E7%9F%A5%E4%BA%86%E7%88%B1%E5%AD%A6%EF%BC%8C%E5%85%8D%E7%99%BB%E5%BD%95%E9%AD%94%E6%94%B9%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

let ad = document.querySelector(".y-qrcode")
if (ad) {
    ad.remove()
}
let yWrap = document.querySelector(".y-wrap")
if (yWrap) {
    yWrap.style.width = "70%"
}

let next_one = document.createElement("a")
next_one.innerText = ""
let questionId = parseInt(window.location.search.split("=")[1])
next_one.href = `https://aistudy.baidu.com/site/wjzsorv8/7b26160b-2462-44af-98c8-32b869495791?questionId=${questionId + 1}`
// document.querySelector(".y-wrap").style.display = "none"
document.body.appendChild(next_one)
next_one.style.backgroundColor = "lightgrey"
next_one.style.borderRadius = "20px"
next_one.style.margin = "1%"
next_one.style.width = "98%"
next_one.style.height = "50%"
next_one.style.textAlign = "center"
next_one.style.position = "absolute"
next_one.style.right = "0%"
next_one.style.bottom = "20%"
next_one.style.zIndex = "0"
next_one.id = "AAA"

// 等待页面完全加载后执行
window.addEventListener('load', function () {
    // 初始尝试删除目标元素
    setTimeout(() => {


        let iframe = document.querySelector("iframe")
        iframe.style.zIndex = "999"
        iframe.style.position = "relative"


        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document

        iframeDocument.querySelector("#AAA").remove()

        iframeDocument.querySelector(".page-bottom").remove()
        iframeDocument.querySelector(".gt-edu-h5-head-root-container").remove()

        let questionContent = iframeDocument.querySelector(".question-content")
        let correct = questionContent.cloneNode(true)


        iframeDocument.querySelectorAll(".correct-answer").forEach((e) => {
            e.classList.remove("correct-answer")
        })
        iframeDocument.querySelectorAll(".text-correct-answer").forEach((e) => {
            e.classList.remove("text-correct-answer")
        })

        if(!localStorage.getItem("part_index")){
            const initObject = {name: "init", num: 0, start_questionid: 0};
            localStorage.setItem('part_index', JSON.stringify(initObject));
        }


        const part_index_last = JSON.parse(localStorage.getItem('part_index'));


        let point_content = iframeDocument.querySelector(".point-content")
        let content_part_name = point_content.textContent.split("-")[2]
        console.log(content_part_name)
        let num
        let start_questionid = part_index_last['start_questionid']

        if (part_index_last['name'] === content_part_name) {
            num = questionId - part_index_last['start_questionid'] + 1
        } else {
            num = 1
            start_questionid = questionId
        }
        const myObject = {name: content_part_name, num: num, start_questionid: start_questionid};
        localStorage.setItem('part_index', JSON.stringify(myObject));


        let question_content = iframeDocument.querySelector(".question-type-container")
        let trainNum = iframeDocument.querySelector(".train-num")
        iframeDocument.querySelector(".question-type-dis").appendChild(trainNum)
        trainNum.textContent = num + "/" + trainNum.textContent.split("/")[1]
        trainNum.style.marginLeft = "30px"

        question_content.parentNode.insertBefore(point_content, question_content)


        iframeDocument.querySelector(".gt-edu-h5-c-answer-feedback-root-container").remove()
        iframeDocument.querySelector(".point-train-source").remove()

        let answer = iframeDocument.querySelector(".answer-explain-analysis")
        answer.style.display = "none"
        let showAnswer = iframeDocument.createElement("div")
        answer.parentNode.insertBefore(showAnswer, answer)
        showAnswer.style.width = "100%"
        showAnswer.style.height = "300px"
        showAnswer.style.backgroundColor = "lightgreen"
        showAnswer.onclick = function () {
            answer.style.display = ""
            showAnswer.style.display = "none"
            questionContent.parentNode.replaceChild(correct, questionContent)

        }


        // document.querySelector(".y-wrap").style.width = "50%"

    }, 200)
});




