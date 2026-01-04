// ==UserScript==
// @name         导出广告活动名称
// @namespace    http://www.wukui.fun
// @version      202407293
// @description  在亚马逊广告后台导出广告活动名称的json文件
// @author       You
// @match        https://advertising.amazon.com/cm/campaigns?entityId=*
// @icon         https://www.amazon.com/favicon.ico
// @license      MIT license
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501524/%E5%AF%BC%E5%87%BA%E5%B9%BF%E5%91%8A%E6%B4%BB%E5%8A%A8%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/501524/%E5%AF%BC%E5%87%BA%E5%B9%BF%E5%91%8A%E6%B4%BB%E5%8A%A8%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化存储对象
    var dataStore = {};

    // 确保DOM加载完成后再执行
    (function(){

        // 创建一个包裹两个按钮的容器
        var container = document.createElement('div');
        container.style.position = 'fixed'; // 固定位置
        container.style.left = '3px'; // 左侧距离
        container.style.top = '90%'; // 垂直居中（需要transform辅助）
        container.style.transform = 'translateY(-50%)'; // 往上偏移50%，实现垂直居中
        container.style.zIndex = '999'; // 确保按钮在最上层
        container.style.display = 'flex';
        container.style.flexDirection = 'column'; // 垂直排列按钮

        // 创建第一个按钮
        var button1 = document.createElement('button');
        button1.textContent = '初始化';
        button1.style.marginBottom = '10px'; // 按钮之间的间距
        button1.style.fontSize = '12px'; // 修改字体大小
        button1.style.border = 'none'; // 去掉按钮的默认黑色边框
        button1.style.padding = '5px'; // 添加一些内边距
        button1.style.backgroundColor = '#6891ff'; // 浅蓝色背景
        button1.style.color = '#fff'; // 浅蓝色背景
        button1.onclick = function() {
            console.log('从HTML中提取数据并更新存储对象！');
            // 这里调用你的第一个函数
            function callback(mutationsList, observer) {
                mutationsList.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        console.log('直接子元素数量或顺序发生变化！');
                        extractDataFromHTML();
                        // 处理子元素增删的逻辑
                    } else if (mutation.type === 'attributes') {
                        console.log('直接子元素的属性发生变化！');
                        // 处理属性变化的逻辑
                        console.log('变化的属性名:', mutation.attributeName);

                    }
                });
            }

            const targetNode = document.querySelector('div.ag-pinned-left-cols-container');

            // 只观察子节点列表变更和属性变更，不包括孙级及以下
            const config = { childList: true, attributes: true, subtree: false };

            if (targetNode) {
                const observer = new MutationObserver(callback);
                observer.observe(targetNode, config);
            } else {
                console.warn('未找到目标元素: div.ag-pinned-left-cols-container');
            }
        };
        container.appendChild(button1);

        // 创建第二个按钮
        var button2 = document.createElement('button');
        button2.textContent = '保存数据';
        button2.style.fontSize = '12px'; // 修改字体大小
        button2.style.border = 'none'; // 去掉按钮的默认黑色边框
        button2.style.padding = '5px'; // 添加一些内边距
        button2.style.backgroundColor = '#6891ff'; // 浅蓝色背景
        button2.style.color = '#fff'; // 
        button2.onclick = function() {

            manipulateData();
            console.log('操作数据存储对象！');
            // 这里调用你的第二个函数
        };
        container.appendChild(button2);

        // 将包含按钮的容器添加到body中
        document.body.appendChild(container);
    })();





    // 函数：从HTML中提取数据并更新存储对象
    function extractDataFromHTML() {
        // 确保运行环境可以访问DOM
        const parentElement = document.querySelector("div.ag-pinned-left-cols-container");
        if (!parentElement) return; // 确保查询到了元素

        // 转换children为数组以使用forEach
        const childElements = [...parentElement.children];

        childElements.forEach(childElement => {
            if (childElement.hasAttribute('row-id')) {
                const id = childElement.getAttribute('row-id');
                if (!dataStore.hasOwnProperty(id)) { // 检查ID是否已存在
                    // 假设标题元素与子元素通过data-row-id属性关联
                    //const titleElement = parentElement.querySelector(`a[id^='campaignsDashboard:cell-name'][data-row-id='${id}'] > .cell-renderer-content-text`);
                    const titleElement = childElement.querySelector("a[id^='campaignsDashboard:cell-name'] > .cell-renderer-content-text");
                    let title = titleElement ? titleElement.textContent.trim() : "未知";
                    dataStore[id] = title;
                    //console.log(id,title);
                }
            }
        });
    }

    // 示例函数：操作数据存储对象
    function manipulateData() {
        // 先确保dataStore已经被填充
        if (Object.keys(dataStore).length === 0) {
            console.warn("数据存储对象为空，无法下载。");
            return;
        }

        // 构建JSON字符串
        const jsonDataString = JSON.stringify(dataStore, null, 2); // 第三个参数是缩进量，使输出更易读

        // 创建Blob对象，设置类型为文本
        const blob = new Blob([jsonDataString], { type: "text/plain;charset=utf-8" });

        // 创建一个临时的URL表示这个Blob对象
        const url = URL.createObjectURL(blob);

        // 创建隐藏的可下载链接
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "广告组名称数据.json"; // 设置下载文件名
        downloadLink.style.display = "none";

        // 将链接添加到DOM中
        document.body.appendChild(downloadLink);

        // 触发点击事件开始下载
        downloadLink.click();

        // 下载完成后清理临时创建的对象URL
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        }, 100); // 延迟一会儿以确保下载开始
    }

    // 使用示例
    // 当DOM准备就绪时调用extractDataFromHTML



    // Your code here...
})();