// ==UserScript==
// @name        美团采集助手
// @namespace   top.antness.Tampermonkey
// @version     0.1
// @description  美团信息采集助手，目前可以采集店家名字
// @author       antness
// @match        https://i.meituan.com/s/*
// @icon         https://p0.meituan.net/travelcube/ba8ffd9e91ba069f1d6cd352cd5b9e93803.png
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/475599/%E7%BE%8E%E5%9B%A2%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/475599/%E7%BE%8E%E5%9B%A2%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const time = 1;
    // 初始化函数，用于初始化一个空的allPoiNames和工作状态
    function init() {
        GM_setValue('allPoiNames', []);
        GM_setValue('isWorking', false);
    }

    // 看门函数，用于判断是否在工作中
    function isWorking() {
        return GM_getValue('isWorking', false);
    }
    function isPoiListExist() {
        // 查询页面中class为poiList的dl元素
        const dl = document.querySelector('.poiList');
        // 如果存在，返回true
        if (dl) {
            return true;
        }
        // 如果不存在，返回false
        else {
            return false;
        }
    }
    function delay(seconds) {
        // 计算随机浮动的时间
        const variance = seconds * 0.2;
        const randomVariance = (Math.random() * variance * 2) - variance;
        const delayTime = seconds + randomVariance;
        // 返回一个新的Promise
        return new Promise((resolve) => {
            setTimeout(resolve, delayTime * 1000);
        });
    }
    async function goToNextPage(seconds) {
        await delay(seconds);
        // 获取当前URL
        const url = window.location.href;
        // 使用URLSearchParams对象解析出URL中的p参数的值
        const urlParams = new URLSearchParams(new URL(url).search);
        const currentP = Number(urlParams.get('p'));
        // 将p参数的值加一
        const nextP = currentP + 1;
        // 将新的p参数值替换回URL
        urlParams.set('p', nextP);
        // 使用新的URL进行页面跳转
        window.location.href = url.split('?')[0] + '?' + urlParams.toString();
    }
    // 修改的getPoiName函数
    function getPoiName() {
        // 获取页面中所有的class为poiname的span元素
        const spans = document.querySelectorAll('.poiname');
        // 定义一个空数组来存放结果
        const results = [];
        // 遍历所有的span元素
        for (let i = 0; i < spans.length; i++) {
            // 获取元素的文本内容，并将结果push进数组
            results.push(spans[i].innerText || spans[i].textContent);
        }
        // 从存储中读取之前抓取的数据
        let allPoiNames = GM_getValue('allPoiNames', []);
        // 将新抓取的数据添加到列表中
        allPoiNames = allPoiNames.concat(results);
        // 将更新后的列表保存回存储
        GM_setValue('allPoiNames', allPoiNames);
    }

    function saveToCsv() {
        GM_setValue('isWorking', false);
        // 从存储中读取所有抓取的数据
        const allPoiNames = GM_getValue('allPoiNames', []);
        if (allPoiNames.length === 0) {
            // 当allPoiNames为空时，跳出当前函数
            return;
        }
        // 处理为csv格式的字符串
        const csvContent = '\uFEFF' + allPoiNames.join('\n');
        // 创建一个Blob对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        // 创建一个可以下载的链接
        const url = URL.createObjectURL(blob);
        // 创建一个a标签
        const link = document.createElement('a');
        link.href = url;
        link.download = 'poiNames.csv';
        // 模拟点击事件来实现文件下载
        link.click();
        // 释放创建的URL，以节省内存
        URL.revokeObjectURL(url);
        GM_setValue('allPoiNames', []);
    }

    // 创建面板
    const panel = document.createElement('div');
    panel.style = `
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 200px;
    height: 100px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    z-index: 9999;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;
    const text = document.createElement('p');
    text.textContent = "简单的美团商家店名爬去取 by @antness";
    text.style = `
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    `;

    panel.appendChild(text);
    const startButton = document.createElement('button');

    startButton.textContent = '开始';
    startButton.style = `
    padding: 6px 12px;
    font-size: 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    `;
    startButton.onclick = function () {
        console.log("开始按钮被按下!");
        init();
        GM_setValue('isWorking', true);
        // 开始工作
        if (isPoiListExist()) {
            getPoiName();
            goToNextPage(time);
        } else {
            saveToCsv();
        }
    };
    panel.appendChild(startButton);

    const endButton = document.createElement('button');

    endButton.textContent = '结束';
    endButton.style = `
    padding: 6px 12px;
    font-size: 12px;
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 10px;
    `;
    endButton.onclick = function () {
        console.log("结束按钮被按下!");
        GM_setValue('isWorking', false);
        saveToCsv();
    };

    panel.appendChild(endButton);
    document.body.appendChild(panel);



    // 页面加载完成后，如果在工作中，则继续工作
    window.onload = function () {
        if (isWorking()) {
            if (isPoiListExist()) {
                getPoiName();
                goToNextPage(time);
            } else {
                saveToCsv();
            }
        }
    };
})();