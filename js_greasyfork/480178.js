// ==UserScript==
// @name         U校园刷时长-强化版
// @namespace    https://blog.1think2program.cn/
// @version      0.7
// @description  改编了《U校园刷时长》这个脚本（原作者貌似停止维护）
// @author       DaXue（原作者） - 盧瞳
// @
// @match        https://ucontent.unipus.cn/_pc_default/pc.html?cid=*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/480178/U%E6%A0%A1%E5%9B%AD%E5%88%B7%E6%97%B6%E9%95%BF-%E5%BC%BA%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/480178/U%E6%A0%A1%E5%9B%AD%E5%88%B7%E6%97%B6%E9%95%BF-%E5%BC%BA%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

var minTime = [8, 30]; //最短停留时间，默认是3分30秒
var maxTime = [15, 30]; //最大停留时间，默认为5分30秒
var unitInterval = [1, 5]; //循环的单元区间，默认为1-5单元
var maxTestTime = [10, 30]; //单元测试最短停留时间，默认是8分30秒
var minTestTime = [15, 30]; //单元测试最大停留时间，默认为10分30秒
var autojump = 1; //是否开启自动跳过非必修章节功能，0为关闭，1为开启
var feibixiuWaitTime = 15000; //跳过非必修等待的时间，单位毫秒
var jumpTimeOut = 0; //是否开启自动跳过已过截止时间的必修章节
var unitTestStay = 0; //是否单独设置单元测试的时间

var feibixiu = document.getElementsByClassName(
  "taskTipStyle--disrequired-1ZUIG"
);
var bixiu = document.getElementsByClassName("taskTipStyle--required-23n0J");

let waitTime = realTime(minTime[0], minTime[1], maxTime[0], maxTime[1]); // 本次停留时间
let currentUnit = 0; // 当前单元

const timer = creatPanel();

function switch_next(selector, classFlag) {
  let flag = false;
  for (let [index, unit] of document.querySelectorAll(selector).entries()) {
    if (flag) {
      unit.click();
      //防止必修弹窗失效，跳转便刷新页面，1000表示跳转1秒后刷新页面
      setTimeout(() => {
        location.reload();
      }, 1000);
      flag = false;
      break;
    }
    if (unit.classList.contains(classFlag)) {
      flag = true;
    }
  }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function jumpToNextSection() {
  switch_next(".layoutHeaderStyle--circleTabsBox-jQdMo a", "selected");
  switch_next("#header .TabsBox li", "active");
  switch_next("#sidemenu li.group", "active");
}

// 跳转到开头的第一单元
function jumpToFirstSection() {
  console.log("jumpToFirstSection，跳转到第一个单元");
  let items = document.querySelectorAll("#sidemenu li.group");
  for (let item of items) {
    if (getUnitNum(item.textContent) == unitInterval[0]) {
      item.click();
      break;
    }
  }
}

if (autojump == 1) {
  setTimeout(async () => {
    if (feibixiu[0].innerText == "非必修") {
      // debugger;
      // 三十秒后切换，防止检测异常
      waitTime = feibixiuWaitTime;
      await sleep(feibixiuWaitTime);
      jumpToNextSection();
    } else if (bixiu[0].innerText == "必修") {
      return 0;
    }
  }, 3000);
}

// 自动跳过已过截止时间的必修章节
setTimeout(() => {
  try {
    var isTestTimeOut = document.getElementsByClassName(
      "taskTipStyle--warningheadertext-1ch9A"
    );
    if (
      isTestTimeOut[0].innerText ==
        "学习截止时间已过，你可以继续学习，但本次提交得分不计入学习成绩" &&
      jumpTimeOut == 1
    ) {
      jumpToNextSection();
    }
  } catch (a) {
    return 0;
  }
}, 3000);

//计算实际停留时间，防止每个页面停留时间相同
function realTime(minMinutes, minSeconds, maxMinutes, maxSeconds) {
  let rate = Math.random();
  return (
    (minMinutes * 60 +
      minSeconds +
      ((maxMinutes - minMinutes) * 60 + maxSeconds - minSeconds) * rate) *
    1000
  );
}

//自动点击必修弹窗和麦克风弹窗 3000表示延迟3秒，因为弹窗有延迟，主要看反应速度。
setTimeout(() => {
  var x = document.getElementsByClassName("dialog-header-pc--close-yD7oN");
  x[0].click();
  document
    .querySelector("div.dialog-header-pc--dialog-header-2qsXD")
    .parentElement.querySelector("button")
    .click();
}, 3000);

// 如果不是在单元区间内，跳转到第一个单元
setTimeout(() => {
  // 如果不是在单元区间内，跳转到第一个单元
  let unitStr = document.querySelectorAll("#sidemenu li.group.active")[0]
    .textContent;

  currentUnit = getUnitNum(unitStr);

  if (currentUnit < unitInterval[0] || currentUnit > unitInterval[1]) {
    // 不在单元区间内，跳转到第一个单元
    console.log("跳转到第一个单元");
    let items = document.querySelectorAll("#sidemenu li.group");
    for (let item of items) {
      if (getUnitNum(item.textContent) == unitInterval[0]) {
        console.log("找到第一个单元");
        item.click();
        break;
      }
    }
  }
}, 3000);

setTimeout(() => {
  try {
    // 单独设置单元测试的时间
    var unitTest = document.getElementsByClassName(
      "utButtonStyle--toDoButton-1S89L"
    );
    if (unitTestStay == 1 && unitTest[0].innerText == "开始做题") {
      setTimeout(() => {
        jumpToNextSection();
      }, realTime(minTestTime[0], minTestTime[1], maxTestTime[0], maxTestTime[1]));
    }
  } catch (e) {
    setTimeout(() => {
      jumpToNextSection();
    }, realTime(minTime[0], minTime[1], maxTime[0], maxTime[1]));
  }

  setInterval(() => {
    waitTime -= 1000;
    updatePanel();
  }, 1000);

  setTimeout(() => {
    jumpToNextSection();
  }, waitTime);
}, 4000);

function creatPanel() {
  let timerPanel = document.createElement("div");
  timerPanel.id = "timerPanel";
  timerPanel.innerHTML = `
    <div id="timerPanelHeader">章节跳转倒计时</div>
    <div id="timer">准备开始</div>
    <div id="unit">当前单元: </div>
`;
  document.body.appendChild(timerPanel);

  let style = document.createElement("style");
  style.innerHTML = `
    #timerPanel {
        position: fixed;
        top: 0;
        right: 0;
        width: 200px;
        height: 100px;
        background-color: #f1f1f1;
        border: 1px solid #d3d3d3;
        z-index: 9999;
        text-align: center;
    }
    #timerPanelHeader {
        padding: 2px;
        cursor: move;
        background-color: #2196F3;
        color: #fff;
        font-size: 15px;
        text-align: center;
        height: 40px;
    }
    #timer {
        color: #f00;
        line-height: 60px;
        font-size: 25px;
    }
`;
  document.head.appendChild(style);

  let timerPanelHeader = document.getElementById("timerPanelHeader");
  let timer = document.getElementById("timer");
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  timerPanelHeader.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    timerPanel.style.top = timerPanel.offsetTop - pos2 + "px";
    timerPanel.style.left = timerPanel.offsetLeft - pos1 + "px";
  }

  // 在 dragMouseDown 函数中，当鼠标松开时，将面板的位置存储到 localStorage
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    localStorage.setItem("timerPanelTop", timerPanel.style.top);
    localStorage.setItem("timerPanelLeft", timerPanel.style.left);
  }

  // 在页面加载时，从 localStorage 中读取面板的位置
  window.onload = function () {
    let top = localStorage.getItem("timerPanelTop");
    let left = localStorage.getItem("timerPanelLeft");
    if (top && left) {
      timerPanel.style.top = top;
      timerPanel.style.left = left;
    }
  };

  return timer;
}

function getUnitNum(unitStr) {
  //   let unitStr = document.querySelectorAll("#sidemenu li.group.active")[0]
  //     .textContent;
  let parts = unitStr.split(" ");
  let fullNumber = parts[0]; // 获取 "1-1"
  let firstNumber = fullNumber.split("-")[0]; // 获取 "1"
  firstNumber = parseInt(firstNumber);
  return parseInt(firstNumber);
}

function updatePanel() {
  // 更新倒计时
  let milliseconds = waitTime;
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let remainingSeconds = totalSeconds % 60;
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds; // 在一位数前面添加一个 '0'
  }
  timer.textContent = minutes.toString() + ":" + remainingSeconds.toString();
  // 更新单元
  document.getElementById("unit").textContent =
    "当前单元: " + currentUnit.toString() + "单元";
}
