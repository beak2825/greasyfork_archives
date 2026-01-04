// ==UserScript==
// @name         ▶▶抢烟神器(app版第五代)
// @namespace    http://tampermonkey.net/
// @version      0.35
// @description  定时自动提交订单
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467195/%E2%96%B6%E2%96%B6%E6%8A%A2%E7%83%9F%E7%A5%9E%E5%99%A8%28app%E7%89%88%E7%AC%AC%E4%BA%94%E4%BB%A3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467195/%E2%96%B6%E2%96%B6%E6%8A%A2%E7%83%9F%E7%A5%9E%E5%99%A8%28app%E7%89%88%E7%AC%AC%E4%BA%94%E4%BB%A3%29.meta.js
// ==/UserScript==

(function() {
// 创建容器和样式
let container = document.createElement("div");
container.style.position = "fixed"; // 将容器的定位方式改为fixed
container.style.top = "38%";
container.style.left = "50%";
container.style.transform = "translate(-50%, -50%) scale(1.8)";//这里区别于pc版

container.style.padding = "20px";
container.style.background = "lightyellow";
container.style.border = "1px solid #ccc";
container.style.borderRadius = "5px"; // 添加小圆角
container.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.6)"; // 添加阴影效果
container.style.zIndex = "9999";
container.style.userSelect = "none"; // 禁用文本选中

// 创建标题元素
let title = document.createElement("div");
title.innerText = "购物车定时抢烟";
title.classList.add("title"); // 添加标题样式类
Object.assign(title.style, {
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "10px"
});

// 在容器中添加标题元素
container.appendChild(title);

// 创建关闭按钮元素
let closeButton = document.createElement("div");
closeButton.innerHTML = "&#10006;"; // 使用Unicode码表示关闭图标
Object.assign(closeButton.style, {
  position: "absolute",
  top: "5px",
  right: "5px",
  cursor: "pointer",
  fontSize: "20px"
});
closeButton.addEventListener("click", function() {
  container.style.display = "none"; // 点击关闭按钮后隐藏容器
});

// 在容器中添加关闭按钮元素
container.appendChild(closeButton);

let styles = document.createElement("style");
styles.innerHTML = `
  .item {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
  }
  .title {
    font-weight: bold;
  }
`;

// 将容器和样式添加到页面中
document.body.appendChild(container);
document.head.appendChild(styles);

// 添加鼠标长按移动位置和保存位置功能
let isDragging = false; // 记录是否正在拖拽
let positionX = 0; // 记录容器的X坐标
let positionY = 0; // 记录容器的Y坐标
let startX = 0; // 记录鼠标按下时的X坐标
let startY = 0; // 记录鼠标按下时的Y坐标

let titleBar = title; // 将标题元素作为拖动栏
titleBar.style.cursor = "move";

titleBar.addEventListener("mousedown", function(event) {
  if (event.button === 0) { // 判断是否是鼠标左键
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    positionX = container.offsetLeft;
    positionY = container.offsetTop;
  }
});

document.addEventListener("mousemove", function(event) {
  if (isDragging) {
    container.style.left = (positionX + event.clientX - startX) + "px";
    container.style.top = (positionY + event.clientY - startY) + "px";
  }
});

document.addEventListener("mouseup", function(event) {
  if (event.button === 0) { // 判断是否是鼠标左键
    if (isDragging) {
      isDragging = false;
      // 保存容器的位置到本地存储
      localStorage.setItem("containerPositionX", container.style.left);
      localStorage.setItem("containerPositionY", container.style.top);
    }
  }
});

// 从本地存储中获取容器的位置
let savedPositionX = localStorage.getItem("containerPositionX");
let savedPositionY = localStorage.getItem("containerPositionY");
if (savedPositionX && savedPositionY) {
  container.style.left = savedPositionX;
  container.style.top = savedPositionY;
}




/*------------------上面是容器相关的设置-----------------------------*/





// 获取本机时间并显示在容器中的第1个样式中
let bjTimeItem = document.createElement("div");
bjTimeItem.classList.add("item");
let bjTimeTitle = document.createElement("div");
bjTimeTitle.classList.add("title");
bjTimeTitle.innerText = "本机时间：";
let bjTimeValue = document.createElement("div");
bjTimeItem.appendChild(bjTimeTitle);
bjTimeItem.appendChild(bjTimeValue);
container.appendChild(bjTimeItem);

// 获取服务器时间并显示在容器中的第2个样式中
let serverTimeItem = document.createElement("div");
serverTimeItem.classList.add("item");
let serverTimeTitle = document.createElement("div");
serverTimeTitle.classList.add("title");
serverTimeTitle.innerText = "服务器时间(已加取回延迟)：";
let serverTimeValue = document.createElement("div");
serverTimeItem.appendChild(serverTimeTitle);
serverTimeItem.appendChild(serverTimeValue);
container.appendChild(serverTimeItem);

// 计算网络延迟时间并显示在容器中的第3个样式中
let pingItem = document.createElement("div");
pingItem.classList.add("item");
let pingTitle = document.createElement("div");
pingTitle.classList.add("title");
pingTitle.innerText = "网络延迟：";
let pingValue = document.createElement("div");
pingItem.appendChild(pingTitle);
pingItem.appendChild(pingValue);
container.appendChild(pingItem);

// 设定自动点击的时间和提前多少毫秒执行自动点击
let timeInputItem = document.createElement("div");
timeInputItem.classList.add("item");
let timeInputTitle = document.createElement("div");
timeInputTitle.classList.add("title");
timeInputTitle.innerText = "定时提交订单(按服务器时间)：";
let timeInput = document.createElement("input");
timeInput.type = "datetime-local";
let advanceInputTitle = document.createElement("div");
advanceInputTitle.classList.add("title");
advanceInputTitle.innerText = "提前时间(填最小延时/2或默认0)：";
let advanceInput = document.createElement("input");
advanceInput.type = "number";
advanceInput.min = "0";
advanceInput.max = "60000";
advanceInput.step = "1000";
advanceInput.value = "0"; // 设置默认值为0
timeInputItem.appendChild(timeInputTitle);
timeInputItem.appendChild(timeInput);
timeInputItem.appendChild(advanceInputTitle);
timeInputItem.appendChild(advanceInput);
container.appendChild(timeInputItem);

let pingUrl = window.location.href; // 网络延迟测试的 URL

let intervalIds = []; // 定时器的 ID 数组
let isRunning = false; // 是否正在运行


// 更新本机时间
function updateBJTime() {
  let bjTime = new Date();
  let bjTimeValue = document.createElement("div");
  let milliseconds = bjTime.getMilliseconds().toString().padStart(3, '0'); // 在毫秒数前面添加前导零
  bjTimeValue.innerText = bjTime.toLocaleString() + " " + milliseconds + " 毫秒";
  bjTimeItem.replaceChild(bjTimeValue, bjTimeItem.lastChild);
}

setInterval(updateBJTime, 100); // 每隔10毫秒更新一次本机时间的毫秒数



// 更新服务器时间+2秒内自动点击20次"提交订单"
let isClicking = false;
let clickCount = 0;
let targetInterval = 60000; // 每隔60秒自动点击一次
let serverTime; // 保存服务器时间

function updateServerTime() {
  let xhr = new XMLHttpRequest();
  let requestStartTime = new Date().getTime(); // 记录请求开始时间
  xhr.open("HEAD", window.location.href.toString(), true);
  xhr.setRequestHeader("Content-Type", "text/html");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 2) {
      serverTime = new Date(xhr.getResponseHeader("Date"));
      let networkLatency = (new Date().getTime() - requestStartTime) / 2; // 计算网络延迟时间
      serverTime.setMilliseconds(serverTime.getMilliseconds() + networkLatency); // 加上网络延迟时间
      let serverTimeValue = document.createElement("div");
      let milliseconds = serverTime.getMilliseconds().toString().padStart(3, '0'); // 在毫秒数前面添加前导零
      serverTimeValue.innerText = serverTime.toLocaleString() + " " + milliseconds + " 毫秒";
      serverTimeItem.replaceChild(serverTimeValue, serverTimeItem.lastChild);
      // 开始自动点击
      let targetTime = new Date(timeInput.value).getTime();
      let advanceTime = parseInt(advanceInput.value);
      if (serverTime >= targetTime - advanceTime && !isClicking) {
        clickButton();
        timeInput.value = new Date(targetTime + targetInterval);
      }
    }
  };
  xhr.send("");
}

function clickButton() {
  isClicking = true;
  let buttons = document.querySelectorAll("#subbtn, #smt");
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      buttons.forEach((button) => {
        button.click();
      });
      clickCount++;
      if (clickCount >= 20) {
        isClicking = false;
      }
    }, i * 100);
  }
}


setInterval(updateServerTime, 9000); // 每隔9秒更新一次网页服务器时间

// 每隔10毫秒更新一次服务器时间的毫秒数
setInterval(() => {
  if (serverTime) {
    serverTime.setMilliseconds(serverTime.getMilliseconds() + 10);
    let serverTimeValue = document.createElement("div");
    let milliseconds = serverTime.getMilliseconds().toString().padStart(3, '0'); // 在毫秒数前面添加前导零
    serverTimeValue.innerText = serverTime.toLocaleString() + " " + milliseconds + " 毫秒";
    serverTimeItem.replaceChild(serverTimeValue, serverTimeItem.lastChild);
  }
}, 100);





// 更新网络延迟时间
function updatePingTime() {
  let pingStartTime = new Date().getTime();
  fetch(pingUrl, { method: "HEAD" })
    .then(() => {
      let pingEndTime = new Date().getTime();
      let pingTime = (pingEndTime - pingStartTime) / 2; // 计算单程的网络延迟时间
      let pingValue = document.createElement("div");
      pingValue.innerText = pingTime + " 毫秒";
      pingItem.replaceChild(pingValue, pingItem.lastChild);
    });
}


// 创建开始/结束执行按钮
let startBtn = document.createElement("button");
startBtn.innerText = "开始执行";
startBtn.style.marginTop = "10px";
startBtn.addEventListener("click", () => {
  if (!isRunning) { // 如果当前未运行，则开始运行
    // 更新当前时间、本机时间和服务器时间的定时器，每秒钟更新一次
    intervalIds.push(setInterval(updateBJTime, 1000));
    intervalIds.push(setInterval(updateServerTime, 1000));
    intervalIds.push(setInterval(updatePingTime, 1000));

    // 初始情况下更新本机时间、服务器时间和网络延迟时间
    updateBJTime();
    updateServerTime();
    updatePingTime();

    startBtn.innerText = "结束执行";
    isRunning = true;
  } else { // 如果当前正在运行，则结束运行
    intervalIds.forEach(clearInterval); // 清除所有的定时器
    intervalIds = [];
    startBtn.innerText = "开始执行";
    isRunning = false;
  }
});
container.appendChild(startBtn); // 在容器中插入开始/结束执行按钮

})();

