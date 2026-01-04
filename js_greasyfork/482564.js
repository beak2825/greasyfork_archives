// ==UserScript==
// @name         cuit自动评教
// @namespace    http://tampermonkey.net/
// @version      2.2.2.3
// @description  下载脚本后在评教页面自动点击即可
// @author       syc
// @match        http://jwgl.cuit.edu.cn/eams/*
// @match        http://jwgl-cuit-edu-cn.webvpn.cuit.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482564/cuit%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482564/cuit%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面加载完成后执行的代码
    window.addEventListener('load', function() {
        // 创建一个按钮容器
        var buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '150px';
        buttonContainer.style.left = '880px';
        buttonContainer.style.cursor = 'move';

        // 创建一个按钮
        var myButton = document.createElement('button');
        myButton.innerHTML = '在评教页面点击';

        // 设置按钮样式
        myButton.style.fontSize = '18px'; // 字体大小
        myButton.style.padding = '15px 30px'; // 内边距
        myButton.style.borderRadius = '12px'; // 圆角
        myButton.style.backgroundColor = '#7FFFD4'; // 背景颜色
        myButton.style.color = 'white'; // 文字颜色
        myButton.style.border = 'none'; // 去除边框
        myButton.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)'; // 阴影效果
        myButton.style.transition = 'background-color 0.3s'; // 添加颜色渐变效果

        // 鼠标悬停时的颜色变化
        myButton.addEventListener('mouseenter', function() {
            myButton.style.backgroundColor = '#76EEC6';
        });

        myButton.addEventListener('mouseleave', function() {
            myButton.style.backgroundColor = '#7FFFD4';
        });

        // 将按钮添加到按钮容器中
        buttonContainer.appendChild(myButton);

        // 添加按钮容器到页面上的body中
        document.body.appendChild(buttonContainer);

        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        buttonContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - parseInt(window.getComputedStyle(buttonContainer).left);
            offsetY = e.clientY - parseInt(window.getComputedStyle(buttonContainer).top);
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                buttonContainer.style.left = (e.clientX - offsetX) + 'px';
                buttonContainer.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        // 点击按钮执行代码的事件处理程序
        myButton.addEventListener('click', function(e) {
            if (!isDragging) {
                alert('网安院院草赵梓凯提醒您，已完成评教');
                var radioArr = document.getElementsByClassName("option-radio");
                for (var i = 0; i < radioArr.length; i++) {
                    if (i % 5 == 0) {
                        console.log(radioArr[i]);
                        radioArr[i].checked = "checked";
                    }
                }
                var divElements1 = document.querySelectorAll(".qBox");
                divElements1.forEach(function(divElement) {
                    var h4Element1 = divElement.getElementsByTagName("h4")[0];
                    if (h4Element1) {
                        if (h4Element1.textContent.includes("本课程中我最愿意选择的听课位置")) {
                            var thirdOption1 = divElement.querySelector(".option-item:nth-child(3) input");
                            if (thirdOption1) {
                                thirdOption1.checked = true;
                            } else {
                                console.log("Third option not found in the div element:", divElement);
                            }
                        }
                    }
                });
                var divElements2 = document.querySelectorAll(".qBox");
                divElements2.forEach(function(divElement) {
                    var h4Element2 = divElement.getElementsByTagName("h4")[0];
                    if (h4Element2) {
                        if (h4Element2.textContent.includes("本课程中老师给我批改作业的次数")) {
                            var thirdOption2 = divElement.querySelector(".option-item:nth-child(3) input");
                            if (thirdOption2) {
                                thirdOption2.checked = true;
                            } else {
                                console.log("Third option not found in the div element:", divElement);
                            }
                        }
                    }
                });
                var divElements3 = document.querySelectorAll(".qBox");
                divElements3.forEach(function(divElement) {
                    var h4Element3 = divElement.getElementsByTagName("h4")[0];
                    if (h4Element3) {
                        if (h4Element3.textContent.includes("我每周课外用在这门课程上的学习时间")) {
                            var thirdOption3 = divElement.querySelector(".option-item:nth-child(3) input");
                            if (thirdOption3) {
                                thirdOption3.checked = true;
                            } else {
                                console.log("Third option not found in the div element:", divElement);
                            }
                        }
                    }
                });
                var divElements4 = document.querySelectorAll(".qBox");
                divElements4.forEach(function(divElement) {
                    var h4Element4 = divElement.getElementsByTagName("h4")[0];
                    if (h4Element4) {
                        if (h4Element4.textContent.includes("本课程中老师给我批改作业(包括实验报告、设计报告等)的次数")) {
                            var thirdOption4 = divElement.querySelector(".option-item:nth-child(3) input");
                            if (thirdOption4) {
                                thirdOption4.checked = true;
                            } else {
                                console.log("Third option not found in the div element:", divElement);
                            }
                        }
                    }
                });
                document.querySelector('.answer-textarea').value = '无';
                var button = document.getElementById('sub');
                setTimeout(function() {
                    button.click();
                }, 1);
            }
        });
    });
})();
