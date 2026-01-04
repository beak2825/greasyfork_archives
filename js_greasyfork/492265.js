// ==UserScript==
// @name         coze窗口调整
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  用于调整coze窗口大小
// @author       pps
// @match        https://www.coze.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492265/coze%E7%AA%97%E5%8F%A3%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/492265/coze%E7%AA%97%E5%8F%A3%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';    let ctrlPressed = false;
    let selectCount = 0;
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const mainKey = isMac ? 'Meta' : 'Control';
    const obj_class = ".w-full.h-full.overflow-hidden";
    const checkInterval = setInterval(function changeWin() {
        selectCount++;
        if (selectCount > 30) {clearInterval(checkInterval);return}
        if(document.querySelector(obj_class) && selectCount <= 30){
            handle(60);
            preHandle();
            clearInterval(checkInterval);
        }
    }, 2000); // 每秒检查一次，可以根据需求调整时间间隔
    const handle = (num) => {
        let mainSize = (Number(num)/ 10) * 4;
        let otherSize = 40 - mainSize;
        document.querySelector(obj_class).style.gridTemplateColumns=`${otherSize}fr ${mainSize}fr`;
    }
    const preHandle = () => {
        const floatingWindow = createFloatingWindow();
        const header = document.getElementById("floatingWindowHeader");

        let isMouseDown = false;
        let offsetX, offsetY;

        header.addEventListener("mousedown", function(event) {
            isMouseDown = true;
            offsetX = event.clientX - floatingWindow.offsetLeft;
            offsetY = event.clientY - floatingWindow.offsetTop;
            document.addEventListener("mousemove", mouseMoveHandler);
        });

        document.addEventListener("mouseup", function() {
            isMouseDown = false;
            document.removeEventListener("mousemove", mouseMoveHandler);
        });

        function mouseMoveHandler(event) {
            if (isMouseDown) {
                floatingWindow.style.left = event.clientX - offsetX + "px";
                floatingWindow.style.top = event.clientY - offsetY + "px";
            }
        }

        document.getElementById("submitButton").addEventListener("click", function() {
            const userInput = document.getElementById("inputField").value;
            handle(userInput);
        });
    };
    document.addEventListener('keydown', function(event) {
        if (event.key === mainKey) {
            ctrlPressed = true;
        } else if (event.key === 'ArrowRight' && ctrlPressed) {
            handle(60);
            ctrlPressed = false;
        } else {
            ctrlPressed = false;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === mainKey) {
            ctrlPressed = false;
        }
    });
    console.log('窗口调整完成');
    // Your code here...
    function createFloatingWindow() {
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'floatingWindow';
        floatingWindow.innerHTML = `
            <div id="floatingWindowHeader">coze窗口调整</div>
            <div style="display:flex">
                 <input type="text" id="inputField" placeholder="输入改动百分比(默认60)">
                 <button id="submitButton" class="semi-button semi-button-primary">调整</button>
            </div>
        `;
        document.body.appendChild(floatingWindow);

        const style = document.createElement('style');
        style.innerHTML = `
            #floatingWindow {
                position: fixed;
                text-align:center;
                top: 50px;
                left: 50px;
                width: 300px;
                padding: 10px;
                background-color: rgba(29,28,35,.6);
                border: 1px solid #ccc;
                border-radius: 8px;
                z-index: 1000;
                cursor: move;
            }

            #floatingWindowHeader {
                padding: 10px;
                cursor: move;
                z-index: 10;
                background-color: #2196F3;
                color: #fff;
                margin-bottom: 10px;
            }

            #inputField {
                width: 80%;
                padding: 5px;
                border-radius: 5px;
                border: none;
                box-sizing: border-box;
                margin-right:5px;
            }
        `;
        document.head.appendChild(style);

        return floatingWindow;
    }
})();