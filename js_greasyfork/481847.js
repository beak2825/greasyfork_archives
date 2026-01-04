// ==UserScript==https://greasyfork.org/zh-CN
// @name         新版学习通自动重做客观题
// @namespace    https://wuhang.xyz/
// @version      0.1
// @description  【工作原理】（手动打开作业详情页面） -> 随机填选答案 -> 提交 -> （手动打开作业详情页面） -> 查看并保存正确答案 -> 重做 -> 填选正确答案 -> 提交 -> 满分【注意事项】仅适配新版学习通；仅支持单选题、多选题与判断题；只有当作业可重做并且提交后允许查看正确答案时，本脚本才能保证满分提交。
// @author       Matty
// @match        https://mooc1.chaoxing.com/mooc2/mooc-ans/work/*
// @icon         https://wuhang.xyz/upload/%E5%A5%B6%E7%89%9B%E7%8C%AB128.svg
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/481847/%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%87%8D%E5%81%9A%E5%AE%A2%E8%A7%82%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/481847/%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%87%8D%E5%81%9A%E5%AE%A2%E8%A7%82%E9%A2%98.meta.js
// ==/UserScript==


// TODO 适配填空题（typename="填空题"）
// 获取正确答案：document.getElementsByClassName("mark_fill colorGreen").item(【i】).innerText.substring(6)
// 填入正确答案：document.getElementsByClassName("mark_fill colorGreen").item(【i】).innerText  = '正确答案'


if(window.location.href.indexOf("dowork") != -1) {
    doWork();
}
else {
    view();
}
// 取消下面这行代码的注释，即可启用自动提交功能，无需手动确认。
// document.getElementsByClassName("jb_btn jb_btn_92 fr fs14").item(0).click();


function doWork() {
    console.log("开始处理【作业作答】页面！");
    let allQ1 = document.getElementsByClassName("padBom50 questionLi");
    let qLength1 = allQ1.length;
    console.log("当前位于【作业作答】页面，总共有" + qLength1 + "道题目，包括单选题、多选题和判断题。");
    if(! haveAnswers()) {
        for(let i = 0; i < qLength1; i++) {
            let q = allQ1.item(i);
            q.getElementsByTagName("input").item(1).value = isPanduanti(q) ? "true" : "A";
        }
        console.log("第一步：在【作业作答】页面完成第一次做题，选择题全选A，判断题全选对，得分看运气。（注意此时页面上每道题的选项按钮可能还会保持原样，没关系的，不用管它）");
    }
    else {
        let allA1 = getAnswers();
        for(let i = 0; i < qLength1; i++) {
            let q = allQ1.item(i);
            let a = allA1[i];
            q.getElementsByTagName("input").item(1).value = isPanduanti(q) ? (a.rightAnswerValue == "对" ? 'true' : 'false') : a.rightAnswerValue;
        }
        console.log("第三步：从本地存储中取回正确答案，在【作业作答】页面完成第二次做题，100%满分。（注意此时页面上每道题的选项按钮可能还会保持原样，没关系的，不用管它）");
    }
    submitValidate();
}

function view() {
    console.log("开始处理【作业详情】页面！");
    let allQ2 = document.getElementsByClassName("marBom60 questionLi");
    let qLength2 = allQ2.length;
    let allA2 = new Array();
    console.log("当前位于【作业详情】页面，总共有" + qLength2 + "道题目，包括单选题、多选题和判断题。");
    for(let i = 0; i < qLength2; i++) {
        let q = allQ2.item(i);
        allA2.push({
            // 从【作业详情】页面获取题目id，再转换成答案id。【作业作答】页面中对应id的input元素的value属性就是用户作答时已选中的答案。
            answerInputId: q.id.replace('question', 'answer'),
            rightAnswerValue: q.getElementsByClassName("colorGreen marginRight40 fl").item(0).innerText.substring(6)
        });
    }
    console.log("第二步：在【作业详情】页面收集正确答案，并存储到本地。");
    saveAnswersToLocal(allA2);
    redoWork();
}


// 根据URL计算出当前这份学习通作业的唯一id
function getWorkId() {
    let queryVariables = window.location.search.substring(1).split("&");
    let itemId = '';
    // courseId + classId + cpi + workId
    for(let i = 0; i < 4; i++) {
        itemId += queryVariables[i].split("=")[1];
    }
    return itemId;
}

// 将当前这份作业的正确答案保存到本地存储中（对象转换为字符串）
function saveAnswersToLocal(allA) {
    localStorage.setItem(getWorkId(), JSON.stringify(allA));
}

// 检查本地存储中是否已经保存了当前这份作业的正确答案
function haveAnswers() {
    if(localStorage.getItem(getWorkId()) != null) {
        return true;
    }
    else {
        return false;
    }
}

// 从本地存储中获取当前这份作业的正确答案（字符串转换为对象）
function getAnswers() {
    return JSON.parse(localStorage.getItem(getWorkId()));
}

//检查当前div元素是不是属于判断题
function isPanduanti(questionDiv) {
    if(questionDiv.getAttribute("typename") == "判断题") {
        return true;
    }
    else {
        return false;
    }
}