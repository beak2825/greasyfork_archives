 // ==UserScript==
// @name         飞书aPaaS生产开发环境显示
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  在界面显示飞书低代码平台aPaaS的生产或开发环境
// @author       You
// @match        *://*.feishuapp.cn/*
// @match        *://*.aedev.feishuapp.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492295/%E9%A3%9E%E4%B9%A6aPaaS%E7%94%9F%E4%BA%A7%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/492295/%E9%A3%9E%E4%B9%A6aPaaS%E7%94%9F%E4%BA%A7%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

let domName = 'myEnvPaaSDrag';
// 定义变量来存储拖动时鼠标位置与元素左上角位置的偏移量
var myEnvPaaSDraggableDiv;
let myEnvPaaSX = 20, myEnvPaaSY =20;

(function () {
    'use strict';
    // 匹配地址
    readPara();
    if (location.href.indexOf('.aedev.feishuapp.cn/') > -1) {
        // 开发环境
        showDev(1)
    } else{
        showDev(0)
    }
})();
function showDev(devFlag) {
    var newDiv = document.createElement("div");
    let text = devFlag?'开发环境':'生产环境'
    let color = devFlag?'green':'red'
    let html = `<div style="font-size:24px;color:${color};cursor:pointer;weight:bold">${text}</div>`
    // newDiv.style.backgroundColor = "#f0f0f0";
    newDiv.id= domName;
    newDiv.style.position = "fixed";
    newDiv.style.left =  myEnvPaaSX + "px";
    newDiv.style.top =  myEnvPaaSY + "px";
    newDiv.innerHTML = html;
    document.body.append(newDiv)

    myEnvPaaSDraggableDiv = document.getElementById(domName);

}
function savePara() {
    localStorage.setItem('myEnvPaaSX', myEnvPaaSX)
    localStorage.setItem('myEnvPaaSY', myEnvPaaSY)
    //console.log('save',myEnvPaaSX,myEnvPaaSY)
}
function readPara() {
    myEnvPaaSX = localStorage.getItem('myEnvPaaSX') ?? myEnvPaaSX
    myEnvPaaSY = localStorage.getItem('myEnvPaaSY') ?? myEnvPaaSY
    //console.log('read',myEnvPaaSX,myEnvPaaSY)
}
// 拖动逻辑
var myEnvPaaSoffsetX , myEnvPaaSoffsetY;
// 当鼠标按下时触发的函数
function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  // 计算鼠标位置与元素左上角的偏移量
  myEnvPaaSoffsetX = e.clientX - myEnvPaaSDraggableDiv.offsetLeft;
  myEnvPaaSoffsetY = e.clientY - myEnvPaaSDraggableDiv.offsetTop;
  // 当鼠标移动时触发函数
  document.onmousemove = dragMouseMove;
  // 当鼠标释放时触发函数
  document.onmouseup = closeDragElement;
}

// 当鼠标移动时触发的函数
function dragMouseMove(e) {
  e = e || window.event;
  e.preventDefault();
  // 计算元素新的位置
  myEnvPaaSX = e.clientX - myEnvPaaSoffsetX;
  myEnvPaaSY = e.clientY - myEnvPaaSoffsetY;
  // 设置元素的新位置
  myEnvPaaSDraggableDiv.style.left = myEnvPaaSX + "px";
  myEnvPaaSDraggableDiv.style.top = myEnvPaaSY + "px";
}

// 当鼠标释放时触发的函数
function closeDragElement() {
  // 停止拖动（移除事件监听）
  document.onmouseup = null;
  document.onmousemove = null;
  savePara()
}

// 当鼠标按下时触发拖动函数
myEnvPaaSDraggableDiv.onmousedown = dragMouseDown;