// ==UserScript==
// @name         黑猫批量复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用来批量复制单号和复制查询结果
// @author       You
// @match        https://toi.kuronekoyamato.co.jp/cgi-bin/tneko
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuronekoyamato.co.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529480/%E9%BB%91%E7%8C%AB%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/529480/%E9%BB%91%E7%8C%AB%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 tracking-box-header 元素
    let header = document.querySelector("div.tracking-box-header");
    if (!header) {
        console.error("未找到 tracking-box-header 元素");
        return;
    }

    // 创建 textarea 并设置样式
    let textarea = document.createElement("textarea");
    textarea.placeholder = "粘贴多个（最多10个）运单号，每行一个";
    textarea.style.display = "block";
    textarea.style.border = "1px solid #ccc";
    textarea.style.padding = "5px";
    textarea.style.borderRadius = "4px";

    // 创建复制按钮
    let copyButton = document.createElement("button");
    copyButton.textContent = "复制结果";
    copyButton.style.display = "block";
    copyButton.style.border = "1px solid #ccc";
    copyButton.style.padding = "5px 10px";
    copyButton.style.borderRadius = "4px";
    copyButton.style.backgroundColor = "#f8f8f8";
    copyButton.style.visibility = 'hidden'; // 默认隐藏

    // 为清空按钮添加事件
    let clearButtons = document.querySelectorAll('div.tracking-box-clear button.js-clear-form')
    .forEach(button=>{
        button.addEventListener('click',() => {
            textarea.value = '';
            textarea.style.visibility = 'visible';
            copyButton.style.visibility = 'hidden';
        })
    })
    // 绑定 paste 事件
    textarea.addEventListener("paste", function (event) {
        event.preventDefault();
        let pastedText = (event.clipboardData || window.clipboardData).getData("text");
        textarea.value = pastedText;
        let trackingNumbers = pastedText.split(/\r?\n/).map(num => num.trim()).filter(num => num);

        // 限制最多 10 个运单号
        trackingNumbers = trackingNumbers.slice(0, 10);

        // 获取所有输入框
        let inputs = document.querySelectorAll("div.tracking-box-area input");
        if (inputs.length === 0) {
            console.error("未找到输入框");
            return;
        }

        // 填充输入框
        trackingNumbers.forEach((num, index) => {
            if (inputs[index]) {
                inputs[index].value = num;
            }
        });
    });
    // 绑定点击事件，阻止默认行为和事件传播
    copyButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        let trackingAreas = document.querySelectorAll("div.tracking-box-area");
        let validResults = [];

        trackingAreas.forEach(area => {
            let stateElement = area.querySelector("div.data.state");
            if (stateElement) {
                validResults.push(stateElement.textContent.trim());
            }
        });

        let textToCopy = validResults.join("\n");
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("复制成功");
        }).catch(err => {
            console.error("复制失败", err);
        });
    });
    // 页面加载完成后直接检查数据并激活按钮
    function checkAndEnableCopyButton() {
        let trackingAreas = document.querySelectorAll("div.tracking-box-area");
        let validResults = [];

        trackingAreas.forEach(area => {
            let stateElement = area.querySelector("div.data.state");
            if (stateElement) {
                validResults.push(stateElement.textContent.trim());
            }
        });

        if (validResults.length > 0) {
            copyButton.style.visibility = 'visible';
            textarea.style.visibility = 'hidden';
        } else {
            copyButton.style.visibility = 'hidden';
        }
    }

    // 延迟执行确保DOM加载完成
    setTimeout(checkAndEnableCopyButton, 500);

    // 添加 textarea 和按钮到页面
    header.append(textarea, copyButton);
    // Your code here...
})();