// ==UserScript==
// @name         Uooc讨论区自动回复提交
// @namespace    https://github.com/index-null
// @version      4.12
// @description  每隔120~180秒自动复制其他人的回复并提交
// @author       Chuhsing
// @Dedicated_to 小黃鱼
// @match        *://uooc.net.cn/*
// @match        http://uooc.net.cn/*
// @match        https://www.uooc.net.cn/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/514945/Uooc%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/514945/Uooc%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("脚本已加载");
    console.log("Author: Chuhsing");
    console.log("Dedicated_to 小黃鱼");

    // 设置延时
    const minInterval = 120000; // 最小延时 120 秒
    const maxInterval = 180000; // 最大延时 180 秒
    const waitTime = 5000; // 等待页面加载时间，电脑性能较差可以适当延长
    let curData = '';
    // 等待10秒后尝试获取DOM元素
    setTimeout(() => {
        if (checkElements()) {
            // 获取DOM元素
            // 定义要提交的内容
            let testData = getReplys();
            const textarea = document.querySelector('.replay-editor textarea[ng-model="content"]');
            const replyButton = document.querySelector('.replay-editor .replay-editor-btn[ng-click="handelReplay()"]');

            // 第一次提交
            curData = getRandomElement(testData);
            updateTextAreaAndSubmit(textarea, replyButton, curData);
            console.log(`已完成首次提交,内容: ${curData}`);
            console.log(`开始自动提交，每${minInterval/1000} - ${maxInterval/1000}秒随机提交一次...`);

            // // 固定定时器
            // const interval = 120000; // 120秒
            // let submitTimerId = setInterval(() => {
            //     // 更新textarea并提交
            //     curData = getRandomElement(testData);
            //     updateTextAreaAndSubmit(textarea, replyButton, curData);
            //     console.log(`已提交内容: ${curData}`);
            // }, interval);

            // 随机定时器
            let submitTimerId = setInterval(() => {
                // 更新textarea并提交
                const curData = getRandomElement(testData);
                updateTextAreaAndSubmit(textarea, replyButton, curData);
                console.log(`已提交内容: ${curData}`);

                // 重新设置随机延时
                clearInterval(submitTimerId);
                submitTimerId = setInterval(() => {
                    // 更新textarea并提交
                    const curData = getRandomElement(testData);
                    updateTextAreaAndSubmit(textarea, replyButton, curData);
                    console.log(`已提交内容: ${curData}`);
                }, getRandomInterval(minInterval, maxInterval));
            }, getRandomInterval(minInterval, maxInterval));
        }
    }, waitTime);


    // 更新textarea并提交
    function updateTextAreaAndSubmit(textarea, button, content) {
        if (!button.disabled) {
            // 获取当前作用域
            const scope = angular.element(textarea).scope();

            // 更新模型
            scope.$apply(() => {
                scope.content = content;
            });

            // 触发按钮点击事件
            angular.element(button).triggerHandler('click');
        } else {
            console.log("按钮被禁用，无法点击");
        }
    }

    function checkElements() {
        console.log("检查元素是否已加载...");
        // 获取textarea元素
        const textarea = document.querySelector('.replay-editor textarea[ng-model="content"]');
        if (!textarea) {
            console.log("未找到textarea元素，5秒后重试...");
            return false;
        } else {
            console.log("已找到textarea元素，继续检查...");
        }

        // 获取回复按钮
        const replyButton = document.querySelector('.replay-editor .replay-editor-btn[ng-click="handelReplay()"]');
        if (!replyButton) {
            console.log("未找到回复按钮，5秒后重试...");
            return false;
        } else {
            console.log("已找到回复按钮，继续检查...");
        }

        // 如果找到了元素，则设置标志变量并返回true
        console.log("元素均找到，开始自动提交...");
        return true;
    }

    function getReplys() {
        const replyContents = document.querySelectorAll('.Reply-item .Reply-item-content');

        // 创建一个空数组来存储内容
        let contentList = [];

        // 遍历所有元素并将内容添加到数组中
        replyContents.forEach(content => {
            contentList.push(content.textContent.trim());
        });

        // 输出内容列表
        console.log(contentList);
        return contentList;
    }

    function getRandomElement(array) {
        if (array.length === 0) {
            throw new Error("数组为空，无法选择元素");
        }

        // 生成一个随机索引
        const randomIndex = Math.floor(Math.random() * array.length);

        // 返回随机索引对应的元素
        return array[randomIndex];
    }

    // 生成随机延时
    function getRandomInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();