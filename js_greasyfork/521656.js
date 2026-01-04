// ==UserScript==
// @name         自动评教脚本（带控制窗口）
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  自动评教并添加可拖动的控制窗口
// @author       你的名字
// @match        *://jwxt.jwc.ccsu.cn/*
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/521656/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B8%A6%E6%8E%A7%E5%88%B6%E7%AA%97%E5%8F%A3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521656/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B8%A6%E6%8E%A7%E5%88%B6%E7%AA%97%E5%8F%A3%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建控制窗口
    const controlPanel = document.createElement('div');
    controlPanel.id = 'control-panel';
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '50px';
    controlPanel.style.right = '50px';
    controlPanel.style.width = '200px';
    controlPanel.style.backgroundColor = '#f9f9f9';
    controlPanel.style.border = '1px solid #ccc';
    controlPanel.style.padding = '10px';
    controlPanel.style.zIndex = '10000';
    controlPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    controlPanel.style.cursor = 'move';

    controlPanel.innerHTML = `
        <h4 style="margin: 0; font-size: 16px;">评教工具</h4>
        <button id="start-evaluation" style="margin: 10px 0; width: 100%;">自动评教</button>
        <button id="close-panel" style="width: 100%;">关闭窗口</button>
    `;

    document.body.appendChild(controlPanel);

    // 绑定拖动事件
    let isDragging = false;
    let offsetX, offsetY;
    controlPanel.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - controlPanel.offsetLeft;
        offsetY = e.clientY - controlPanel.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            controlPanel.style.left = `${e.clientX - offsetX}px`;
            controlPanel.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 自动评教逻辑
    function autoEvaluate() {
        // 自动勾选“很满意”
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (radio.classList.contains("radio-pjf") && radio.dataset.dyf === "100") {
                radio.checked = true;
            }
        });

        // 自动填写评语
        const commentBox = document.querySelector('textarea');
        if (commentBox) {
            commentBox.value = "老师教学认真，课程内容丰富，受益匪浅。";
        }

        // 不再自动点击提交按钮
        alert("评教已完成，您可以手动提交！");
    }

    // 绑定按钮事件
    document.getElementById('start-evaluation').addEventListener('click', autoEvaluate);
    document.getElementById('close-panel').addEventListener('click', () => {
        controlPanel.remove();
    });
})();
