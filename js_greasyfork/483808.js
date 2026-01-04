// ==UserScript==
// @name         Textarea Content Opener with Styled, Wrapped Text and Auto-Click
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Open textarea content in a styled new tab from a specific textarea and click automatically when timer reaches a specific time
// @author       You
// @match        http*://ibt2-toefl-pt.ets.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483808/Textarea%20Content%20Opener%20with%20Styled%2C%20Wrapped%20Text%20and%20Auto-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/483808/Textarea%20Content%20Opener%20with%20Styled%2C%20Wrapped%20Text%20and%20Auto-Click.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var button;
    var addButtonIntervalId;
    var checkTimerIntervalId;

    function addButton() {
        var targetDiv = document.getElementById('iviewer-extendedtext-toolbar');
        if (targetDiv && !button) {
            clearInterval(addButtonIntervalId);

            button = document.createElement("button");
            button.innerHTML = "Open";
            button.style.padding = "5px 8px";
            button.style.backgroundColor = "#4CAF50";
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.marginRight = "5px";

            var button2 = document.createElement("button");
            button2.innerHTML = "Write";
            button2.style.padding = "5px 8px";
            button2.style.backgroundColor = "#4CAF50";
            button2.style.color = "white";
            button2.style.border = "none";
            button2.style.borderRadius = "5px";
            button2.style.cursor = "pointer";
            button2.style.marginRight = "5px";

            targetDiv.insertBefore(button, targetDiv.firstChild);
            targetDiv.insertBefore(button2, targetDiv.firstChild);

            button.addEventListener("click", function () {
                var textarea = document.getElementById("extended_text_response");
                if (textarea) {
                    var text = textarea.value;
                    var newWindow = window.open("", "_blank");

                    var styles = `
                        <style>
                            body {
                                background-color: #f4f4f4;
                                color: #333;
                                padding: 20px;
                                line-height: 1.6;
                            }
                            pre {
                                font-family: 'Arial', sans-serif;
                                font-size: 8mm;
                                background-color: #fff;
                                border: 1px solid #ddd;
                                padding: 15px;
                                border-radius: 5px;
                                box-shadow: 0 2px 4px rgba(0,0,0,.1);
                                overflow: auto;
                                white-space: pre-wrap;
                                word-wrap: break-word;
                            }
                        </style>
                    `;

                    newWindow.document.write(styles + "<pre>" + text + "</pre>");
                    newWindow.document.title = "Textarea Content";
                } else {
                    alert("Textarea not found!");
                }
            });

            button2.addEventListener("click", function () {
                // 弹出一个窗口让用户输入
                var userInput = prompt("请输入一些内容：");

                // 检查用户是否输入了内容
                if (userInput !== null && userInput !== "") {
                    // 获取ID为'extended_text_response'的textarea元素
                    var textArea = document.getElementById('extended_text_response');

                    // 将用户输入的内容设置到textarea中
                    textArea.value = userInput;

                    // 创建一个新的事件
                    var event = new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    });

                    // 触发事件
                    textArea.dispatchEvent(event);
                }
            });
        }
    }

    function checkTimerAndClickButton() {
        var timerDisplay = document.querySelector('strong.timer-display');
        if (timerDisplay && timerDisplay.textContent.trim() === "00:00:01") {
            clearInterval(checkTimerIntervalId);
            if (button) {
                button.click();
            }
        }
    }

    addButtonIntervalId = setInterval(addButton, 500); // Check for the button's div every 500ms
    checkTimerIntervalId = setInterval(checkTimerAndClickButton, 100); // Check the timer every second
})();
