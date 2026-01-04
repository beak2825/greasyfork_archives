// ==UserScript==
// @name        飞牛网页端一些痛点临时解决方案
// @namespace   nixingshiguang
// @version     1.3
// @description 使用javascript代码，修改一些飞牛控制台的痛点
// @author      逆行时光
// @match       *://10.10.10.3:8001/*
// @exclude     *://10.10.10.3:8001/v*
// @exclude     *://10.10.10.3:8001/p*
// @grant       none
// @supportURL  https://blog.160621.xyz
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/536295/%E9%A3%9E%E7%89%9B%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%B8%80%E4%BA%9B%E7%97%9B%E7%82%B9%E4%B8%B4%E6%97%B6%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536295/%E9%A3%9E%E7%89%9B%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%B8%80%E4%BA%9B%E7%97%9B%E7%82%B9%E4%B8%B4%E6%97%B6%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const scriptTag = "%c[飞牛鼠标修正]%c";
    const styleTag = "color: white; background-color: #4CAF50; font-weight: bold;";
    const resetStyle = "color: inherit; background-color: inherit;";

    // 前进后退按钮组选择器
    const buttonsSelector = '.semi-button-split';

    // 创建一个通用函数处理后退操作
    function handleBackAction() {
        console.log(scriptTag + " 按下：后退键", styleTag, resetStyle);
        const backButtonElement = document.querySelector(buttonsSelector).firstChild;
        if (backButtonElement) {
            console.log(scriptTag + " 尝试点击：后退按钮元素", styleTag, resetStyle, backButtonElement);
            backButtonElement.click();
            return true;
        } else {
            console.log(scriptTag + " %c未找到：后退按钮元素%c", styleTag, "color: red;", resetStyle);
            return false;
        }
    }

    // 创建一个通用函数处理前进操作
    function handleForwardAction() {
        console.log(scriptTag + " 按下：前进键", styleTag, resetStyle);
        const forwardButtonElement = document.querySelector(buttonsSelector).lastChild;
        if (forwardButtonElement) {
            console.log(scriptTag + " 尝试点击：前进按钮元素", styleTag, resetStyle, forwardButtonElement);
            forwardButtonElement.click();
            return true;
        } else {
            console.log(scriptTag + " %c未找到：前进按钮元素%c", styleTag, "color: red;", resetStyle);
            return false;
        }
    }

    // 创建一个通用函数处理删除操作
    function handleDeleteAction() {
        console.log(scriptTag + " 按下：删除键", styleTag, resetStyle);
        const deleteButtonElement = document.querySelectorAll('span.semi-button-content-right')[3];
        if (deleteButtonElement.textContent.trim() === '删除') {
            console.log(scriptTag + " 尝试点击：删除按钮元素", styleTag, resetStyle, deleteButtonElement);
            deleteButtonElement.click();
            return true;
        } else {
            console.log(scriptTag + " %c未找到：删除按钮元素%c", styleTag, "color: red;", resetStyle);
            return false;
        }
    }

    document.addEventListener('mousedown', function (event) {
        if (event.button === 3) { // 后退按钮
            if (handleBackAction()) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        } else if (event.button === 4) { // 前进按钮
            if (handleForwardAction()) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }
    }, true); // 在捕获阶段监听

    document.addEventListener('mouseup', function (event) {
        if (event.button === 3) {
            console.log(scriptTag + " 释放：后退键", styleTag, resetStyle);
            event.preventDefault();
            event.stopPropagation();
            return false;
        } else if (event.button === 4) {
            console.log(scriptTag + " 释放：前进键", styleTag, resetStyle);
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true); // 在捕获阶段监听

    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowRight': // 前进按钮 (Alt+右箭头)
                if (event.altKey && handleForwardAction()) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                break;
            case 'Delete': // 删除按钮
                if (handleDeleteAction()) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                break;
            default:
                return false;
        }
    }, true); // 在捕获阶段监听
})();
