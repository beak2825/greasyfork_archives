// ==UserScript==
// @name         智慧树|知到课程问答（互动分）自动回答问题脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在问题已有回答时，复制第一个答案，自动回答问题并发布回答，随后关闭页面
// @author       ChatGPT&WJ_Sun
// @match        https://qah5.zhihuishu.com/*
// @grant        none
// @icon         https://www.zhihuishu.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468699/%E6%99%BA%E6%85%A7%E6%A0%91%7C%E7%9F%A5%E5%88%B0%E8%AF%BE%E7%A8%8B%E9%97%AE%E7%AD%94%EF%BC%88%E4%BA%92%E5%8A%A8%E5%88%86%EF%BC%89%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94%E9%97%AE%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468699/%E6%99%BA%E6%85%A7%E6%A0%91%7C%E7%9F%A5%E5%88%B0%E8%AF%BE%E7%A8%8B%E9%97%AE%E7%AD%94%EF%BC%88%E4%BA%92%E5%8A%A8%E5%88%86%EF%BC%89%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94%E9%97%AE%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 复制第一个相似元素的内容
    function copyElementContent() {
        var timeElement = document.querySelector('div.set-time');
        var spanElement = timeElement.nextElementSibling.querySelector('span[data-v-ef58c864]');
        var content = spanElement.textContent;
        return content;
    }

    // 点击回答按钮
    function clickAnswerButton() {
        var button = document.querySelector('div.my-answer-btn.ZHIHUISHU_QZMD.tool-show');
        button.click();
    }

    // 在回答框中粘贴内容
    function pasteContentInTextArea(content) {
        var textarea = document.querySelector('textarea.el-textarea__inner');
        textarea.value = content;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 点击发布按钮
    function clickPublishButton() {
        var button = document.querySelector('div.up-btn.ZHIHUISHU_QZMD.set-btn');
        button.click();
    }

    // 延迟执行函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 主要逻辑
    async function main() {
        var content = copyElementContent();
        clickAnswerButton();
        await delay(200);
        pasteContentInTextArea(content);
        await delay(200);
        clickPublishButton();
        await delay(1500);
        window.close(); // 关闭当前页面
    }

    // 延迟执行主函数
    setTimeout(main, 2000);
})();