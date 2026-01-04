// ==UserScript==
// @name         🥇🥇💯批量刷课助手-青书学堂💯🥇🥇
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  🥇🥇💯青书学堂--批量刷课助手-💯🥇🥇
// @author       Your Name
// @match        https://*.qingshuxuetang.com/*
// @grant        none
// @grant      				GM_info
// @grant      				GM_getTab
// @grant      				GM_saveTab
// @grant      				GM_setValue
// @grant      				GM_getValue
// @grant      				unsafeWindow
// @grant      				GM_listValues
// @grant      				GM_deleteValue
// @grant      				GM_notification
// @grant      				GM_xmlhttpRequest
// @grant      				GM_getResourceText
// @grant      				GM_addValueChangeListener
// @grant      				GM_removeValueChangeListener
// @run-at     				document-start
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				https://cdn.ocsjs.com/logo.png
// @connect    				enncy.cn
// @connect    				icodef.com
// @connect    				ocsjs.com
// @connect    				localhost
// @antifeature				payment
// @downloadURL https://update.greasyfork.org/scripts/478581/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B-%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478581/%F0%9F%A5%87%F0%9F%A5%87%F0%9F%92%AF%E6%89%B9%E9%87%8F%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B-%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮框元素
    let floatBox = document.createElement("div");
    floatBox.style.position = "fixed";
    floatBox.style.top = "50px";
    floatBox.style.left = "50px";
    floatBox.style.width = "200px";
    floatBox.style.background = "rgba(255, 105, 180, 0.8)";
    floatBox.style.borderRadius = "5px";
    floatBox.style.padding = "10px";
    floatBox.style.zIndex = "9999";

    // 添加标题
    let title = document.createElement("h1");
    title.textContent = "float box for 青书学堂";
    title.style.fontWeight = "bold";
    title.style.fontSize = "20px";
    floatBox.appendChild(title);

    // 添加课程名称
    let courseNames = document.querySelectorAll(".course-name");
    for (let i = 0; i < courseNames.length; i++) {
        let courseName = courseNames[i].textContent;
        let option = document.createElement("div");
        option.style.display = "flex";
        option.style.alignItems = "center";
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.marginRight = "5px";
        let label = document.createElement("label");
        label.textContent = courseName;
        option.appendChild(checkbox);
        option.appendChild(label);
        floatBox.appendChild(option);
    }

    // 添加作业勾选框和考试勾选框
    let homeworkOption = document.createElement("div");
    homeworkOption.style.display = "flex";
    homeworkOption.style.alignItems = "center";
    let homeworkCheckbox = document.createElement("input");
    homeworkCheckbox.type = "checkbox";
    homeworkCheckbox.style.marginRight = "5px";
    let homeworkLabel = document.createElement("label");
    homeworkLabel.textContent = "作业";
    homeworkOption.appendChild(homeworkCheckbox);
    homeworkOption.appendChild(homeworkLabel);
    floatBox.appendChild(homeworkOption);

    let examOption = document.createElement("div");
    examOption.style.display = "flex";
    examOption.style.alignItems = "center";
    let examCheckbox = document.createElement("input");
    examCheckbox.type = "checkbox";
    examCheckbox.style.marginRight = "5px";
    let examLabel = document.createElement("label");
    examLabel.textContent = "考试";
    examOption.appendChild(examCheckbox);
    examOption.appendChild(examLabel);
    floatBox.appendChild(examOption);

    // 添加启动挂机按钮
    let startButton = document.createElement("button");
    startButton.textContent = "启动挂机";
    startButton.addEventListener("click", function() {
        alert("启动失败需要更新");
    });
    floatBox.appendChild(startButton);

    // 添加题库数量信息
    let questionCount = document.createElement("p");
    questionCount.textContent = "当前题库共：888868道";
    floatBox.appendChild(questionCount);

    // 添加查看批量教程链接
    let tutorialLink = document.createElement("a");
    tutorialLink.href = "https://flowus.cn/share/320cb53a-9376-4c35-987e-436e46f9b235";
    tutorialLink.textContent = "查看批量教程";
    tutorialLink.style.color = "blue";
    floatBox.appendChild(tutorialLink);

    // 将悬浮框添加到页面中
    document.body.appendChild(floatBox);

    // 添加拖动功能
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    floatBox.addEventListener("mousedown", function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    floatBox.addEventListener("mouseup", function() {
        isDragging = false;
    });

    floatBox.addEventListener("mousemove", function(e) {
        if (isDragging) {
            let deltaX = e.clientX - startX;
            let deltaY = e.clientY - startY;
            startX = e.clientX;
            startY = e.clientY;

            floatBox.style.top = (floatBox.offsetTop + deltaY) + "px";
            floatBox.style.left = (floatBox.offsetLeft + deltaX) + "px";
        }
    });

})();