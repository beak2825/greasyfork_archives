// ==UserScript==
// @name         题解屏蔽
// @namespace    http://tampermonkey.net/
// @version      2024.7.10
// @description  在点击“查看题解”的时候跳转 nboj
// @author       Zhao_daodao
// @match        https://www.luogu.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500184/%E9%A2%98%E8%A7%A3%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/500184/%E9%A2%98%E8%A7%A3%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 获取按钮将要插入的位置
    let pos = document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.tiny > div.container > div.link-container");
    
    // 创建一个新的按钮元素
    let butt = document.createElement('button');
    
    // 从 localStorage 获取按钮的状态
    let isPressed = localStorage.getItem('buttonState') === 'true';
    
    // 定义按钮状态的字符串数组
    const buttonStates = ['专注模式：关', '专注模式：开'];

    // 根据传入的值返回相应的按钮状态字符串
    function getButtonState(value) {
        return buttonStates[value];
    }

    // 设置按钮的初始文本
    butt.innerText = getButtonState(isPressed ? 1 : 0);
    butt.id = 'free';
    butt.className = 'btn btn-primary';
    
    // 设置按钮的样式
    butt.style.padding = "10px 20px";
    butt.style.backgroundColor = "#ffffff"; // 设置按钮颜色为RGB(38, 38, 38)
    butt.style.color = "rgb(35, 35, 35)";
    butt.style.border = "none";
    butt.style.borderRadius = "5px";
    butt.style.fontSize = "16px";
    butt.style.cursor = "pointer";
    
    // 设置按钮位置，向左移动10像素
    butt.style.position = "relative";
    butt.style.left = "-20px";

    // 添加点击事件，切换按钮状态并保存到 localStorage
    butt.addEventListener('click', function() {
        isPressed = !isPressed;
        localStorage.setItem('buttonState', isPressed);
        butt.innerText = getButtonState(isPressed ? 1 : 0);

        // 新增功能：检查当前页面 URL
    });
    
    // 如果按钮已按下且当前页面是特定 URL，添加点击事件到目标按钮
    if (isPressed && window.location.href.startsWith("https://www.luogu.com.cn/problem/")) {
        let targetButton = document.querySelector("#app > div.main-container > main > div > section.side > div:nth-child(1) > a:nth-child(3)");
        targetButton.addEventListener('click', function() {
            window.open('https://nboj.com/dating/');
        });
    }
    
    // 将按钮添加到页面中
    pos.appendChild(butt);
})();