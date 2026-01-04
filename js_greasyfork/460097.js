// ==UserScript==
// @name 学习通刷学习次数
// @namespace https://mooc2-ans.chaoxing.com/mycourse/*
// @version 0.3
// @description Refreshes page
// @author new Bing & black_zero
// @match https://mooc2-ans.chaoxing.com/mycourse/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460097/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/460097/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==

let counter = localStorage.getItem("counter") || 60; // 从 localStorage 中获取倒计时，如果没有则默认为 60 秒
let refreshCounter = localStorage.getItem("refreshCounter") || 0; // 从 localStorage 中获取刷新的次数，如果没有则默认为 0
let originalTitle = document.title; // 获取原来的标题
document.title = "[刷新次数: " + refreshCounter + "] " + originalTitle; // 修改标题
const myInterval = setInterval(function() {
  // console.log(counter + " seconds left until refresh"); // 在控制台输出倒计时
  // 删除在控制台输出倒计时的代码
  countdown.textContent = counter + " 秒后刷新"; // 在悬浮窗中输出倒计时
  // 添加在悬浮窗中输出倒计时的代码
  if (counter === 0) { // 如果倒计时为 0
      refreshCounter++; // 增加刷新的次数
      counter = localStorage.getItem("counter") || 60; // 重置倒计时
    document.title = "[刷新次数: " + refreshCounter + "] " + originalTitle; // 修改标题
    localStorage.setItem("refreshCounter", refreshCounter); // 存储刷新的次数
    window.location.reload(); // 刷新页面
      }
counter--; // 每 1 秒减少倒计时
}, 1000); // 设置定时器为 1 秒

// 创建一个悬浮窗
const floatWindow = document.createElement("div"); // 创建一个 div 元素
floatWindow.style.position = "fixed"; // 设置定位为固定
floatWindow.style.top = "100px"; // 设置距离顶部 10 像素
floatWindow.style.right = "100px"; // 设置距离右边 10 像素
floatWindow.style.width = "200px"; // 设置宽度为 200 像素
floatWindow.style.height = "250px"; // 设置高度为 200 像素
// 修改高度为 200 像素
floatWindow.style.backgroundColor = "lightblue"; // 设置背景颜色为浅蓝色
floatWindow.style.border = "2px solid black"; // 设置边框为 2 像素的黑色实线
floatWindow.style.zIndex = "9999"; // 设置层叠顺序为最高
floatWindow.style.cursor = "move"; // 设置鼠标样式为移动
floatWindow.style.resize = "both"; // 设置可以调整大小
floatWindow.style.overflow = "auto"; // 设置溢出内容为自动

// 创建一个刷新次数
const refreshCount = document.createElement("p"); // 创建一个 p 元素
refreshCount.style.margin = "10px"; // 设置刷新次数的外边距为 10 像素
refreshCount.textContent = "刷新次数: " + refreshCounter; // 设置刷新次数的文本内容

// 创建一个倒计时
const countdown = document.createElement("p"); // 创建一个 p 元素
countdown.style.margin = "10px"; // 设置倒计时的外边距为 10 像素
countdown.textContent = counter + " 秒后刷新"; // 设置倒计时的文本内容

// 创建一个输入框
const input = document.createElement("input"); // 创建一个 input 元素
input.type = "number"; // 设置输入框的类型为数字
input.value = counter; // 设置输入框的值为倒计时
input.style.margin = "10px"; // 设置输入框的外边距为 10 像素
// 创建一个按钮
const submitButton = document.createElement("button"); // 创建一个 button 元素
submitButton.textContent = "更改刷新间隔"; // 设置按钮的文本内容
submitButton.style.margin = "10px"; // 设置按钮的外边距为 10 像素
submitButton.addEventListener("click", function() { // 给按钮添加一个点击事件监听器
  let value = parseInt(input.value); // 获取输入框的值并转换为整数
  if (value >= 30) { // 如果值大于等于 30
    localStorage.setItem("counter", value); // 存储倒计时
    counter = value; // 重置倒计时
    countdown.textContent = counter + " 秒后刷新"; // 修改悬浮窗中的倒计时
    alert("刷新间隔被设置为" + value + " 秒!"); // 弹出一个提示框
  } else { // 如果值小于 30
    alert("刷新间隔必须至少是30秒!"); // 弹出一个提示框
    input.value = counter; // 恢复输入框的值为倒计时
  }
});

// 创建一个提示
const tip = document.createElement("p"); // 创建一个 p 元素
tip.style.margin = "10px"; // 设置提示的外边距为 10 像素
tip.textContent = "刷新间隔必须至少是30秒!"; // 设置提示的文本内容

// 创建一个按钮
const clearButton = document.createElement("button"); // 创建一个 button 元素
clearButton.textContent = "重置刷新次数"; // 设置按钮的文本内容
clearButton.style.margin = "10px"; // 设置按钮的外边距为 10 像素
clearButton.addEventListener("click", function() { // 给按钮添加一个点击事件监听器
  localStorage.removeItem("refreshCounter"); // 清除 localStorage 中的刷新次数
  refreshCounter = 0; // 重置刷新次数为 0
  document.title = "[刷新次数: " + refreshCounter + "] " + originalTitle; // 修改标题
  refreshCount.textContent = "Refreshed: " + refreshCounter; // 修改悬浮窗中的刷新次数
  alert("重置刷新次数已重置!"); // 弹出一个提示框
});

// 将刷新次数、倒计时、输入框、提交按钮、提示和按钮添加到悬浮窗中
floatWindow.appendChild(refreshCount);
floatWindow.appendChild(countdown);
floatWindow.appendChild(input);
floatWindow.appendChild(submitButton);
// 添加一个提交按钮
floatWindow.appendChild(tip);
floatWindow.appendChild(clearButton);

// 将悬浮窗添加到文档中
document.body.appendChild(floatWindow);

// 定义一些变量，用来记录鼠标的位置和状态
let isDragging = false; // 是否正在拖动
let offsetX = 0; // 拖动时的水平偏移量
let offsetY = 0; // 拖动时的垂直偏移量

// 给悬浮窗添加一个鼠标按下事件监听器
floatWindow.addEventListener("mousedown", function(event) {
  // 判断鼠标是否在悬浮窗的边缘
  let isEdge = event.target === floatWindow && (event.offsetX < 10 || event.offsetX > 190 || event.offsetY < 10 || event.offsetY > 190);
  // 修改边缘判断的条件
  if (!isEdge) { // 如果不在边缘
    isDragging = true; // 设置正在拖动为真
    offsetX = event.clientX - floatWindow.offsetLeft; // 计算水平偏移量
    offsetY = event.clientY - floatWindow.offsetTop; // 计算垂直偏移量
  }
});

// 给悬浮窗添加一个鼠标移动事件监听器
floatWindow.addEventListener("mousemove", function(event) {
  if (isDragging) { // 如果正在拖动
    floatWindow.style.left = event.clientX - offsetX + "px"; // 设置悬浮窗的左边距
    floatWindow.style.top = event.clientY - offsetY + "px"; // 设置悬浮窗的上边距
  }
});

// 给悬浮窗添加一个鼠标松开事件监听器
floatWindow.addEventListener("mouseup", function(event) {
  isDragging = false; // 设置正在拖动为假
});