// ==UserScript==
// @name         智慧树互动分自动回答
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动回答智慧树互动分
// @author       皮丘呀
// @match        https://qah5.zhihuishu.com/*
// @icon         https://www.zhihuishu.com/favicon.ico
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/482026/%E6%99%BA%E6%85%A7%E6%A0%91%E4%BA%92%E5%8A%A8%E5%88%86%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/482026/%E6%99%BA%E6%85%A7%E6%A0%91%E4%BA%92%E5%8A%A8%E5%88%86%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94.meta.js
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
        await delay(200);
        var content = copyElementContent();
        clickAnswerButton();
        await delay(200);
        pasteContentInTextArea(content);
        await delay(200);
        clickPublishButton();
        await delay(1500);
        window.close(); // 关闭当前页面
    }
    //自动切换问题
    function clickQuestion(){
        var divArray=document.querySelectorAll('div.question-content.ZHIHUISHU_QZMD');
        if(divArray.length==0){
            main();
        }
        divArray.forEach(function(element, index) {
           setTimeout(function() {
               element.click(); // 模拟鼠标点击
               //执行主要函数
               main();
           }, index * 10000);//该时长可随意设置，不建议低于这个值，太短会被禁言
       });
    }
    setTimeout(clickQuestion, 2000);
})();