// ==UserScript==
// @name         教评助手
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Automate certain actions on a webpage with a stylish button trigger
// @author       Bailu
// @match        https://my.gdip.edu.cn/EducationEvaluation/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520926/%E6%95%99%E8%AF%84%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520926/%E6%95%99%E8%AF%84%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义sleep函数
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 定义函数来等待元素加载
    async function waitForElement(selector) {
        while (document.querySelector(selector) === null) {
            await sleep(1000); // 等待1秒
        }
        return document.querySelector(selector);
    }

    // 定义example函数
    async function example(i) {
        let c = document.querySelectorAll(".table-item-action span:nth-child(2) button.el-button--text");
        for (let c1 of c) {
            let e = await waitForElement(".table-item-action span:nth-child(2) button.el-button--text");
            e.click();
            await sleep(1000);
            if (document.querySelector(".player-video video") != null) {
                await sleep(200);
                document.querySelector(".el-checkbox span").click();
                document.querySelector(".player-video video").play();
                await sleep(30 * 1000);
                document.querySelector(".player-video video").currentTime = 180;
                await sleep(1000);
                document.querySelector("span .el-button--primary").click();
            }
            await sleep(1000);

            if (i == 0) {
                // 合格
                var a = document.querySelectorAll("label.el-radio:nth-child(2)");
            } else if (i == 1) {
                // 满分
                var a = document.querySelectorAll("label.el-radio:nth-child(1)");
            }
            await sleep(1000);
            a.forEach((e) => {
                e.click();
            });
            await sleep(1000);
            let b = document.querySelector("button.el-button--primary");
            b.click();
            await sleep(1000);
        }
    }

    // 创建并添加美化后的按钮
    function addButton() {
        const button1 = document.createElement('button');
        button1.textContent = '全部合格';
        button1.id = 'runAutomationButton';
        document.body.appendChild(button1);

        const button2 = document.createElement('button');
        button2.textContent = '全部满分';
        button2.id = 'otherActionButton';
        document.body.appendChild(button2);

        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #runAutomationButton, #otherActionButton {
                padding: 10px 20px;
                font-size: 16px;
                color: #fff;
                background-color: #007bff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                outline: none;
                position: fixed;
                top: 100px;
                z-index: 9999;
                transition: background-color 0.3s ease;
            }
            #runAutomationButton:hover, #otherActionButton:hover {
                background-color: #0056b3;
            }
            #runAutomationButton {
                right: 10px; /* 第一个按钮在右边距10px的位置 */
            }
            #otherActionButton {
                right: 120px; /* 第二个按钮在第一个按钮的左边，右边距120px */
            }
        `;
        document.head.appendChild(style);

        // 添加第一个按钮的点击事件
        button1.onclick = function () {
            example(0); // 假设默认为合格，可以根据需要修改
        };

        // 添加第二个按钮的点击事件
        button2.onclick = function () {
            example(1); // 假设默认为合格，可以根据需要修改
        };

    }

    // 页面加载完毕后添加按钮
    window.addEventListener('load', addButton);
})();