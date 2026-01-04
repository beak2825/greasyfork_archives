// ==UserScript==
// @name         飞向未来自动升级建筑辅助
// @namespace    http://182.43.19.5:9999
// @version      1.2
// @description  自动检测建筑人口并执行升级操作
// @author       Kinle+GPT
// @match        http://182.43.19.5:9999/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519451/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5%E8%87%AA%E5%8A%A8%E5%8D%87%E7%BA%A7%E5%BB%BA%E7%AD%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/519451/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5%E8%87%AA%E5%8A%A8%E5%8D%87%E7%BA%A7%E5%BB%BA%E7%AD%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isUpgrading = false; // 控制自动升级状态
    let upgradeInterval; // 存储定时器
    const loopInterval = 3000; // 每次循环之间的间隔（毫秒）

    // 创建并插入按钮
    const button = document.createElement('button');
    button.textContent = '启动自动升级';
    button.style.position = 'fixed';
    button.style.bottom = '20px'; // 固定位置
    button.style.left = '50%'; // 横向居中
    button.style.transform = 'translateX(-50%)'; // 横向居中
    button.style.padding = '10px 20px'; // 固定大小
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.userSelect = 'none'; // 禁止选中文字
    button.style.fontSize = '16px'; // 固定字体大小
    button.style.height = '40px'; // 固定高度
    button.style.width = '200px'; // 固定宽度
    document.body.appendChild(button);

    // 按住按钮移动
    button.addEventListener('mousedown', (event) => {
        event.preventDefault(); // 防止默认行为
        const initialX = event.clientX - button.getBoundingClientRect().left;
        const initialY = event.clientY - button.getBoundingClientRect().top;

        const onMouseMove = (moveEvent) => {
            button.style.left = `${moveEvent.clientX - initialX}px`;
            button.style.top = `${moveEvent.clientY - initialY}px`;
            button.style.transform = 'none'; // 移动时取消横向居中的样式
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            button.style.transform = 'translateX(-50%)'; // 释放鼠标时重新横向居中
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });

    // 点击按钮时控制升级状态
    button.addEventListener('click', function() {
        if (!isUpgrading) {
            startUpgrading();
        }
    });

    // 启动自动升级
    async function startUpgrading() {
        isUpgrading = true;
        button.textContent = '正在升级...';
        console.log('自动升级已启动');

        // 循环检查建筑
        while (isUpgrading) {
            await checkBuildings(); // 检查建筑
            await sleep(loopInterval); // 等待3秒再进行下一轮
        }

        button.textContent = '启动自动升级'; // 恢复按钮文本
    }

    // 停止自动升级
    function stopUpgrading() {
        isUpgrading = false;
        button.textContent = '启动自动升级';
        console.log('自动升级已停止');
    }

    // 检查建筑人口并执行操作
    async function checkBuildings() {
        const buildings = Array.from(document.querySelectorAll('.building')); // 假设每个建筑都有 .building 类
        let buildingsToUpgrade = [];

        buildings.forEach(building => {
            const populationElement = building.querySelector('.population'); // 假设人口信息在 .population 类中
            const currentPopulation = populationElement ? parsePopulation(populationElement.textContent.trim()) : 0;
            const buildingName = building.querySelector('.name') ? building.querySelector('.name').textContent.trim() : "";

            // 如果人口小于10T且不是不需要操作的建筑
            if (currentPopulation < 10 * Math.pow(10, 12) && !shouldSkipBuilding(buildingName)) {
                console.log(`检测到建筑人口少于10T: ${currentPopulation}`);
                buildingsToUpgrade.push(building); // 将符合条件的建筑添加到数组中
            }
        });

        // 从最新的建筑开始执行按键操作
        for (let i = buildingsToUpgrade.length - 1; i >= 0; i--) {
            const building = buildingsToUpgrade[i];
            await increasePopulation(building); // 等待每次点击完成
        }

        if (buildingsToUpgrade.length === 0) {
            console.log('所有建筑人口都达到或超过10T，无需操作。');
        }
    }

    // 增加人口功能
    const increasePopulation = (building) => {
        return new Promise((resolve) => {
            const nameElement = building.querySelector('.name');
            const buildingName = nameElement ? nameElement.textContent.trim() : "";

            const rect = building.getBoundingClientRect();
            const mouseX = rect.left + rect.width / 2; // 建筑中心X坐标
            const mouseY = rect.top + rect.height / 2; // 建筑中心Y坐标

            // 创建鼠标事件
            const mouseEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                clientX: mouseX,
                clientY: mouseY,
            });

            // 按下A键
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
            building.dispatchEvent(mouseEvent); // 点击建筑
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true })); // 释放A键

            console.log(`已点击 ${buildingName}`);
            resolve(); // 点击完成
        });
    };

    // 简单的睡眠函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 解析人口字符串（如 "1.4K", "100.6K", "10M", "1T" 等）
    function parsePopulation(populationString) {
        const number = parseFloat(populationString.replace(/[^\d.-]/g, '')); // 提取数字部分
        if (populationString.includes('K')) {
            return number * Math.pow(10, 3); // 千
        } else if (populationString.includes('M')) {
            return number * Math.pow(10, 6); // 百万
        } else if (populationString.includes('B')) {
            return number * Math.pow(10, 9); // 十亿
        } else if (populationString.includes('T')) {
            return number * Math.pow(10, 12); // 万亿
        }
        return number; // 默认返回数字
    }

    // 判断是否是需要跳过的建筑
    function shouldSkipBuilding(buildingName) {
        const skippedBuildings = ["一只大树🌳", "简陋居所", "仓库", "小型城镇"];
        return skippedBuildings.includes(buildingName);
    }

})();
