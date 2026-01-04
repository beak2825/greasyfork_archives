// ==UserScript==
// @name         软考题库
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  统计做题正确率
// @author       duya
// @match        https://www.lightsoft.tech/doquestion/doquestion?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lightsoft.tech
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/490409/%E8%BD%AF%E8%80%83%E9%A2%98%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/490409/%E8%BD%AF%E8%80%83%E9%A2%98%E5%BA%93.meta.js
// ==/UserScript==

var correct_false, answer_correct, answer_my;

(function() {
    'use strict';
    correct_false = GM_getValue("correct_false_GM");
    answer_correct = GM_getValue("answer_correct_GM");
    answer_my = GM_getValue("answer_my_GM");
    if (correct_false == null){
        correct_false = Array(75).fill(0);
    }
    if (answer_correct == null){
        answer_correct = Array(75).fill(0);
    }
    if (answer_my == null){
        answer_my = Array(75).fill(0);
    }
    window.onload = function() {
        listenClick();
        draw();
        createButton();
    }
})();

function changeIndexColor(index, color) {
    let index_elements = document.getElementsByClassName("MuiTypography-root MuiLink-root MuiLink-underlineHover MuiButtonBase-root MuiButton-root MuiButton-contained MuiTypography-colorPrimary");
    let color_code = "";
    switch(color){
        case "red":
            color_code = "#D00000";
            break;
        case "green":
            color_code = "#00D000";
            break;
        case "grey":
            color_code = "#e0e0e0";
    }
    index_elements[index+1].style.backgroundColor = color_code;
}

function listenClick() {
    let button_elements = document.getElementsByClassName("MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlined MuiButton-fullWidth");
    for (let i = 0; i < button_elements.length; i++) {
        button_elements[i].dataset.index = i; // 添加索引
        button_elements[i].addEventListener('click', handleButtonClick);
    }
}

function getNowIndex() {
    let urlParams = new URLSearchParams(window.location.search);
    let index = urlParams.get('index'); // 获取名为 'parameterName' 的查询参数值
    return Number(index)
}

// 定义处理 click 事件的函数
function handleButtonClick(event) {
    setTimeout(function() {
        hideAdAfterClick();
        answer_correct[getNowIndex()] = document.getElementsByClassName("MuiCardContent-root")[1].childNodes[1].childNodes[1].childNodes[0].childNodes[1].textContent;
        answer_my[getNowIndex()] = document.getElementsByClassName("MuiCardContent-root")[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].textContent;
        if(answer_correct[getNowIndex()] == answer_my[getNowIndex()]) {
            correct_false[getNowIndex()] = 1;
        }
        else {
            correct_false[getNowIndex()] = -1;
        }
        GM_setValue("correct_false_GM", correct_false);
        GM_setValue("answer_correct_GM", answer_correct);
        GM_setValue("answer_my_GM", answer_my);
        if(correct_false[getNowIndex()] == 1) {
            document.getElementsByClassName("MuiCardContent-root")[1].childNodes[1].childNodes[2].childNodes[1].childNodes[0].click()
        }
    }, 50);
}

function hideAdAfterClick(){
    document.getElementsByClassName("MuiCardContent-root")[1].childNodes[1].childNodes[3].style.display = "none"; //广告
    document.getElementsByClassName("MuiCardContent-root")[1].childNodes[1].childNodes[7].style.display = "none"; //讨论区，也是广告
}

function draw() {
    // 给做过的题画红绿色
    for(let i = 0; i < correct_false.length; i++){
        if(correct_false[i] == 1) {
            changeIndexColor(i, "green");

        }
        else if(correct_false[i] == -1){
            changeIndexColor(i, "red");
        }
    }
    // 给做过的且错误的题显示答案
    var parrentDiv = document.getElementsByClassName("MuiBox-root jss14")[0];
    if(parrentDiv.childElementCount == 2 && correct_false[getNowIndex()] == -1) {
        var node = document.createElement("div");
        node.className = "MuiBox-root jss999";
        node.style.display = 'flex'; // 或 grid
        node.style.flexDirection = 'column'; // 使子元素垂直排列
        node.style.alignItems = 'center';
        var paragraph1 = document.createElement("p");
        var paragraph2 = document.createElement("p");
        paragraph1.textContent = "你的答案: " + answer_my[getNowIndex()];
        paragraph2.textContent = "正确答案: " + answer_correct[getNowIndex()];
        node.appendChild(paragraph1);
        node.appendChild(paragraph2);
        parrentDiv.appendChild(node);
    }
    // 显示当前分数
    let score = 0;
    for(let s of correct_false) {
        if(s == 1) {
            score += 1;
        }
    }
    var score_div = document.getElementsByClassName("MuiBox-root jss40")[0];
    score_div.innerHTML = "得分：" + String(score);
}

function createButton() {
    // 创建一个按钮元素
    var button = document.createElement('button');
    button.className = 'floating-button'; // 添加类名以便应用上面的CSS样式
    button.textContent = '清除'; // 设置按钮文本

    // 将按钮设置为固定在左下角
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.left = '20px';

    button.addEventListener('click', restart);

    // 将按钮添加到DOM中，通常选择<body>标签作为父节点
    document.body.appendChild(button);
}

function restart() {
    correct_false = Array(75).fill(0);
    answer_correct = Array(75).fill(0);
    answer_my = Array(75).fill(0);
    GM_setValue("correct_false_GM", correct_false);
    document.getElementsByClassName("MuiTypography-root MuiLink-root MuiLink-underlineHover MuiButtonBase-root MuiButton-root MuiButton-contained MuiTypography-colorPrimary")[1].click();
}