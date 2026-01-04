// ==UserScript==
// @name         B站评论自动填充
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在B站视频播放页添加一个按钮并自动填充剪切板内的文字，用以解决B站视频评论输入框内多行文本直接粘贴时出现的额外空行
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511758/B%E7%AB%99%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/511758/B%E7%AB%99%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

// (function() {
//     'use strict';

//     // Your code here...
// })();

main();

function main() {
    window.addEventListener('load', addButton);
}

function addButton() {
    console.log('页面加载完毕')
    const buttonHTML = `
        <div id="custom-button-container">
            <button id="custom-button">点击粘贴</button>
        </div>
    `;

    const buttonStyle = `
        <style>
            #custom-button-container {
                margin-right: 10px;
            }
            #custom-button {
                padding: 5px 10px;
                background-color: #00a1d6;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            #custom-button:hover {
                background-color: #0082b4;
            }
        </style>
    `;

    const buttonSelectors = ['*','#header','*','#commentbox','*','#comment-area','#footer'];
    const inputSelectors = ['#body', '#editor', '*', '#input', '*'];

    const baseElement = document.querySelector('#commentapp');

    waitForElement(baseElement, function(element) {
        element.parentElement.insertAdjacentHTML('afterend', buttonStyle);
        element.insertAdjacentHTML('afterbegin', buttonHTML);
        waitForElement(element.parentElement, async function(inputEle) {
            element.querySelector('#custom-button-container').querySelector('#custom-button').addEventListener('click', async function() {
                await pasteTextToComment(inputEle)
            });
            console.log('按钮添加完毕')
        }, inputSelectors)
    }, buttonSelectors)

}

function waitForElement(baseEle, callback, selectors) {

    if (!baseEle) {
        console.error('根元素 #commentapp 未找到');
        return;
    }

    getElementWithShadowRoot(baseEle, selectors, callback, 0);
}

// 递归查找元素，并依次处理 shadowRoot
function getElementWithShadowRoot(baseElement, selectors, callback, index = 0) {
    // 如果已经处理完所有选择器，返回目标对象
    if (index >= selectors.length) {
        callback(baseElement)
        return;
    }

    const currentSelector = selectors[index];

    pollForElement(baseElement, currentSelector, function(nextElement) {
        // 如果有 shadowRoot，进入 shadowRoot 继续查找
        if (nextElement.shadowRoot) {
            getElementWithShadowRoot(nextElement.shadowRoot, selectors, callback, index + 1);
        } else {
            getElementWithShadowRoot(nextElement, selectors, callback, index + 1);
        }
    });
}

// 轮询查找每一层的元素，直到找到目标元素为止
function pollForElement(baseElement, selector, callback) {
    const interval = setInterval(() => {
        const element = baseElement.querySelector(selector);
        if (element) {
            clearInterval(interval); // 找到元素后停止轮询
            callback(element); // 调用回调函数，继续查找下一个层级
        }
    }, 100); // 每隔 500ms 轮询一次

    // 设置超时时间，防止无限轮询（比如 10 秒）
    setTimeout(() => {
        clearInterval(interval);
    }, 10000); // 超时 10 秒
}

async function pasteTextToComment(commentEle) {
    commentEle.querySelector('*').style.setProperty('display', 'none')
    const clipboardText = await navigator.clipboard.readText()
    const inputField = commentEle.querySelector('.brt-editor')
    inputField.innerText = clipboardText

    const inputEvent = new Event('input', { bubbles: true });
    inputField.dispatchEvent(inputEvent);

    inputField.dispatchEvent(inputEvent);
}