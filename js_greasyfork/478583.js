// ==UserScript==
// @name  🥇🥇💯麦能在线-批量刷课助手💯🥇🥇
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 🥇🥇💯麦能在线-批量刷课助手，如需兼容其他平台，请联系批量定制💯🥇🥇
// @author Your Name
// @match *.cjnep.net/*
// @grant none
// @namespace    https://gitee.com/xiaolv12/yunbanke
// @supportURL   https://gitee.com/xiaolv12/yunbanke
// @icon         https://bkimg.cdn.bcebos.com/pic/4ec2d5628535e5dde7114110e88eb0efce1b9c16c4e1
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      m.met0.top
// @connect      v.met0.top
// @connect      c.met0.top
// @connect      d.met0.top
// @connect      127.0.0.1
// @connect      gitee.com
// @connect      *
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478583/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E9%BA%A6%E8%83%BD%E5%9C%A8%E7%BA%BF-%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478583/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E9%BA%A6%E8%83%BD%E5%9C%A8%E7%BA%BF-%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.meta.js
// ==/UserScript==

(function() {
'use strict';


// 创建悬浮框元素
var floatBox = document.createElement('div');
floatBox.style.position = 'fixed';
floatBox.style.top = '20px';
floatBox.style.right = '20px';
floatBox.style.width = '200px';
floatBox.style.padding = '10px';
floatBox.style.background = 'linear-gradient(to right, #b3e6ff, #ccffcc)';
floatBox.style.borderRadius = '10px';
floatBox.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
floatBox.style.zIndex = '9999';

// 添加标题
var title = document.createElement('h2');
title.innerHTML = 'Float Box for 麦能';
title.style.fontWeight = 'bold';
title.style.fontSize = '18px';
floatBox.appendChild(title);

// 添加introdiv text-center的标题和圆形选择框
var introDivs = document.getElementsByClassName('introdiv text-center');
for (var i = 0; i < introDivs.length; i++) {
    var introDiv = introDivs[i];
    var row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '5px';
    row.appendChild(checkbox);
    var label = document.createElement('label');
    label.innerHTML = introDiv.innerHTML;
    row.appendChild(label);
    floatBox.appendChild(row);
}

  // 添加课件勾选框和作业勾选框
    var coursewareCheckbox = document.createElement('input');
    coursewareCheckbox.type = 'checkbox';
    var coursewareLabel = document.createElement('label');
    coursewareLabel.style.marginRight = '10px';
    coursewareLabel.appendChild(coursewareCheckbox);
    coursewareLabel.appendChild(document.createTextNode('课件'));
    floatBox.appendChild(coursewareLabel);

    var homeworkCheckbox = document.createElement('input');
    homeworkCheckbox.type = 'checkbox';
    var homeworkLabel = document.createElement('label');
    homeworkLabel.style.marginRight = '10px';
    homeworkLabel.appendChild(homeworkCheckbox);
    homeworkLabel.appendChild(document.createTextNode('作业'));
    floatBox.appendChild(homeworkLabel);

// 添加启动挂机按钮
var startButton = document.createElement('button');
startButton.innerHTML = '启动挂机';
startButton.style.display = 'block';
startButton.style.margin = '10px auto';
startButton.style.padding = '5px 10px';
startButton.style.border = 'none';
startButton.style.background = '#ffffff';
startButton.style.borderRadius = '5px';
startButton.style.cursor = 'pointer';
floatBox.appendChild(startButton);

// 点击按钮弹窗显示启动失败需要更新
startButton.addEventListener('click', function() {
    alert('启动失败需要更新');
});

// 添加题库数量
var questionCount = document.createElement('p');
questionCount.innerHTML = '当前题库共：888868道';
floatBox.appendChild(questionCount);

// 添加批量教程链接
var tutorialLink = document.createElement('a');
tutorialLink.href = 'https://flowus.cn/share/320cb53a-9376-4c35-987e-436e46f9b235';
tutorialLink.innerHTML = '查看批量教程';
tutorialLink.style.color = 'blue';
tutorialLink.style.textDecoration = 'underline';
floatBox.appendChild(tutorialLink);

// 将悬浮框添加到页面
document.body.appendChild(floatBox);

// 添加拖动功能
var isDragging = false;
var offsetX = 0;
var offsetY = 0;

floatBox.addEventListener('mousedown', function(event) {
    isDragging = true;
    offsetX = event.clientX - floatBox.offsetLeft;
    offsetY = event.clientY - floatBox.offsetTop;
});

document.addEventListener('mousemove', function(event) {
     if (isDragging) {
            floatBox.style.left = (event.clientX - offsetX) + 'px';
            floatBox.style.top = (event.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
})();