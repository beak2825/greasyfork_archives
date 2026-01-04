// ==UserScript==
// @name         gamer520自动跳转下载+关闭弹窗+百度网盘链接一键跳转
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  点击【立即下载】后自动输入密码并继续，自动关闭弹窗，自动识别百度网盘链接和密码一键跳转
// @license           AGPL-3.0-or-later
// @author       Yokior
// @match        https://www.gamer520.com/*
// @match        https://like.gamer520.com/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519381/gamer520%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD%2B%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97%2B%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/519381/gamer520%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD%2B%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97%2B%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查关闭按钮是否存在
const closeButton = document.querySelector("button[aria-label='Close this dialog']");

// 如果按钮存在，则触发点击事件
if (closeButton) {
    closeButton.click();
    console.log("关闭对话框按钮已被点击。"); // 控制台输出点击事件
} else {
    console.warn("关闭对话框按钮未找到。"); // 控制台输出未找到按钮的警告
}

// 选择要监控的目标元素
const targetElement = document.querySelector(".go-down");

// 函数：目标元素点击后执行
function handleClick() {
    let attempts = 0; // 尝试计数
    const maxAttempts = 5; // 最大重试次数

    const tryClickConfirm = () => {
        const confirmButton = document.querySelector(".swal2-confirm");
        if (confirmButton) {
            // 等待 0.3 秒后点击确认按钮
            setTimeout(() => {
                confirmButton.click();
                console.log("确认按钮已被点击"); // 在控制台输出确认按钮已被点击
            }, 300); // 300毫秒后执行点击
        } else if (attempts < maxAttempts) {
            attempts++;
            console.warn(`确认按钮未找到，正在重试...（尝试次数：${attempts}/${maxAttempts}）`);
            setTimeout(tryClickConfirm, 500); // 再次尝试
        } else {
            console.warn("确认按钮未找到，达到最大重试次数，无法点击"); // 控制台输出未找到按钮的警告
        }
    };

    // 等待 0.5 秒后首次触发尝试
    setTimeout(tryClickConfirm, 500);
}

// 检查目标元素是否存在
if (targetElement) {
    // 添加点击事件监听器
    targetElement.addEventListener('click', handleClick);
} else {
    console.warn("目标元素未找到，无法添加点击事件监听器。");
}


    // 选择指定的 h1 元素
    const h1Element = document.querySelector(".article-content > div:nth-child(1) > div > header > h1");

    // 检查元素是否存在
    if (h1Element) {
        // 获取 h1 内容
        const h1Content = h1Element.textContent.trim();

        // 使用正则表达式检查内容格式并提取密码
        const passwordPattern = /^密码保护：(.+)/; // 正则表达式匹配格式
        const match = h1Content.match(passwordPattern);

        if (match && match[1]) {
            const password = match[1]; // 提取密码部分

            // 选择输入框并输入密码
            const passwordInput = document.querySelector("[name='post_password']");
            if (passwordInput) {
                passwordInput.value = password; // 将密码输入到输入框
                console.log(`已输入密码: ${password}`); // 在控制台输出输入的密码

                // 触发提交按钮的点击事件
                const submitButton = document.querySelector("input[type=submit]");
                if (submitButton) {
                    submitButton.click(); // 点击提交按钮
                    console.log("提交按钮已被点击。"); // 控制台输出点击事件
                } else {
                    console.warn("提交按钮未找到。");
                }
            } else {
                console.warn("输入框未找到。");
            }
        } else {
            console.warn("h1 内容不匹配预期格式。");
        }
    } else {
        console.warn("指定的 h1 元素未找到。");
    }


    // 百度网盘链接按钮
    // 获取包含链接和提取码的容器
const entryContent = document.querySelector("div.entry-content");

// 获取所有的<p>标签
const paragraphs = entryContent.querySelectorAll("p");

// 定义链接和提取码
let linkUrl = '';
let extractionCode = '';

// 遍历所有<p>标签，寻找包含链接和提取码的信息
paragraphs.forEach(p => {
    const anchor = p.querySelector('a');
    if (anchor && anchor.href.startsWith("https://pan.baidu.com")) {
        linkUrl = anchor.href; // 获取链接
    }

    const codeMatch = p.textContent.match(/提取码:\s*(\w+)/);
    if (codeMatch) {
        extractionCode = codeMatch[1]; // 获取提取码
    }
});

// 如果找到了链接和提取码
if (linkUrl && extractionCode) {
    // 创建按钮元素
    const button = document.createElement('button');
    button.innerText = "一键打开百度网盘链接并输入密码";

    // 美化按钮的样式
    button.style.marginLeft = '10px'; // 添加一点样式，便于视觉效果
    button.style.padding = '10px 15px'; // 内边距
    button.style.borderRadius = '5px'; // 圆角
    button.style.backgroundColor = '#4CAF50'; // 背景颜色
    button.style.color = 'white'; // 字体颜色
    button.style.border = 'none'; // 无边框
    button.style.cursor = 'pointer'; // 光标样式
    button.style.fontSize = '14px'; // 字体大小
    button.style.transition = 'background-color 0.3s'; // 背景颜色过渡效果

    // 设置按钮点击事件，跳转到带有提取码的链接，并在新标签中打开
    button.onclick = function () {
        window.open(`${linkUrl}?pwd=${extractionCode}`, '_blank');
    };

    // 将按钮添加到找到的链接后面
    const anchor = entryContent.querySelector(`a[href="${linkUrl}"]`);
    anchor.parentNode.insertBefore(button, anchor.nextSibling);
}



})();
