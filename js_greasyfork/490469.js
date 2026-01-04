// ==UserScript==
// @name         linux.do含水量
// @namespace    linux.do含水量计算
// @version      0.1.2
// @description  快点干燥起来吧
// @author       nulluser
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490469/linuxdo%E5%90%AB%E6%B0%B4%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/490469/linuxdo%E5%90%AB%E6%B0%B4%E9%87%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建一个显示牌的HTML元素
    var displayPanel = document.createElement('div');
    displayPanel.id = 'percentageDisplay';
    displayPanel.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 150px;
        height: 100px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 10px;
        text-align: center;
        line-height: 100px;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999;
    `;

    // 创建一个更新按钮的HTML元素
    var updateButton = document.createElement('button');
    updateButton.id = 'updateButton';
    updateButton.textContent = '更新Linux do含水量';
    updateButton.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 10px;
        width: 150px;
        height: 30px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 15px;
        cursor: pointer;
    `;

    // 更新百分比值
    function updatePercentage() {
        let bad_ids = [11, 16, 34, 17, 18, 19, 29, 36, 35, 22, 26, 25];
        const bad_score = [];
        const good_score = [];
        // 定义要获取的URL数组
        const urls = [
            'https://linux.do/latest.json?order=created',
            'https://linux.do/new.json',
            'https://linux.do/top.json?period=daily'
        ];

        // 使用Promise.all并发获取所有URL的数据
        Promise.all(urls.map(url => fetch(url).then(response => response.json())))
            .then(dataArray => {
                // 所有请求都成功后，这里将会收到一个包含所有JSON数据的数组
                // 数组中的元素顺序与urls数组中的URL顺序相同

                // 将数据合并或处理
                const combinedData = {
                    latest: dataArray[0].topic_list.topics, // 假设第一个URL返回的是最新的数据
                    new: dataArray[1].topic_list.topics,    // 假设第二个URL返回的是新的数据
                    top: dataArray[2].topic_list.topics     // 假设第三个URL返回的是每日热门数据
                };

                // 定义一个函数来处理每个主题的分数
                const processTopic = (topic) => {
                    const score = topic.posts_count + topic.like_count + topic.reply_count;
                    if (bad_ids.includes(topic.category_id)) {
                        bad_score.push(score);
                    } else {
                        good_score.push(score);
                    }
                };

                // 遍历每个主题列表并处理
                combinedData.latest.forEach(processTopic);
                combinedData.new.forEach(processTopic);
                combinedData.top.forEach(processTopic);

                // 计算bad_score和good_score的总和
                const bad_total = bad_score.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const good_total = good_score.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

                // 打印结果
                const percentage = (bad_total / (bad_total + good_total)) * 100;
                console.log(`当前论坛含水量: ${percentage.toFixed(2)}%`);
                displayPanel.textContent = `${percentage.toFixed(2)}%`;

            })
            .catch(error => {
                // 处理任何在请求过程中发生的错误
                console.error('Error fetching data:', error);
            });

    }

    // 初始化显示牌和按钮
    function initializeDisplay() {
        document.body.appendChild(displayPanel);
        document.body.appendChild(updateButton);

        updatePercentage();

        updateButton.addEventListener('click', updatePercentage);
    }

    // 等待页面加载完成后再初始化显示牌
    window.addEventListener('load', initializeDisplay);
})();