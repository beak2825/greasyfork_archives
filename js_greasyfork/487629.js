// ==UserScript==
// @name         聚水潭指定参数获取
// @namespace    https://rakurai.top
// @version      4.0.6
// @icon         http://107.173.89.17:8888/download?filename=/www/wwwroot/rakurai/title.ico
// @description  获取聚水潭（erp321.com）网页中link_o_id（内部订单号）和 skuweight（克重值）的值自动复制或相加
// @author       RakuRai
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/487629/%E8%81%9A%E6%B0%B4%E6%BD%AD%E6%8C%87%E5%AE%9A%E5%8F%82%E6%95%B0%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/487629/%E8%81%9A%E6%B0%B4%E6%BD%AD%E6%8C%87%E5%AE%9A%E5%8F%82%E6%95%B0%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建一个显示link_o_id数值的固定位置的元素
    var displayElementLeft = document.createElement('div');
    displayElementLeft.style.position = 'fixed';
    displayElementLeft.style.top = '0px';
    displayElementLeft.style.left = '130px';
    displayElementLeft.style.padding = '10px';
    displayElementLeft.style.background = '#FFFFFF'; // 红色背景
    displayElementLeft.style.opacity='0.0';//透明度
    displayElementLeft.style.border = '1px solid #000';
    displayElementLeft.style.display = 'none'; // 初始隐藏
    displayElementLeft.style.color = '#000000'; // 黑色文字
    document.body.appendChild(displayElementLeft);

    // 创建一个显示 skuweight 数值的固定位置的元素
    var displayElementRight = document.createElement('div');
    displayElementRight.style.position = 'fixed';
    displayElementRight.style.top = '0px';
    displayElementRight.style.right = '240px'; // 右上角
    displayElementRight.style.height = '20px';
    displayElementRight.style.width = '5%'; // 宽度设置为屏幕宽度的三分之一
    displayElementRight.style.padding = '10px';
    displayElementRight.style.background = '#ffffff'; // background color
    displayElementRight.style.border = '0px solid #000';
    displayElementRight.style.display = 'none'; // 初始隐藏
    displayElementRight.style.color = '#ff008b'; // 白色文字
    displayElementRight.style.zIndex = '9999'; // 显示在最上层
    displayElementRight.id = 'zkz123456';
    document.body.appendChild(displayElementRight);

    // 存储已经获取到的 link_o_id 和 skuweight 数值，避免重复
    var processedIDs = {};
    var processedWeight = {};

    // 定义函数，用于更新显示的内容
    function updateDisplay() {
        // 找到所有包含 link_o_id 的文本
        var linkOIDMatches = document.body.textContent.matchAll(/link_o_id":(\d+)/g);

        // 存储 link_o_id 数值的数组
        var linkOIDValues = [];

        // 遍历所有匹配项并输出数值到左上角元素中
        for (const match of linkOIDMatches) {
            var linkOIDValue = match[1];
            // 检查该数值是否已经被处理过，如果没有，则添加到数组中并记录
            if (!processedIDs[linkOIDValue]) {
                linkOIDValues.push(linkOIDValue);
                processedIDs[linkOIDValue] = true;
                // 这里可以根据需要进行进一步操作，比如发送给后端，存储在本地等等
            }
        }

        // 如果获取到了 link_o_id 数值，则显示在左上角
        if (linkOIDValues.length > 0) {
            // 将 link_o_id 数值数组连接为一个字符串，每个数值后面加上逗号
            var outputTextLeft = linkOIDValues.join(",\n") + ",";
            // 将整个字符串复制到剪贴板
            GM_setClipboard(outputTextLeft);
            // 将字符串设置为输出框的内容
            displayElementLeft.textContent = outputTextLeft;
            // 显示输出框
            displayElementLeft.style.display = 'block';
        }

        // 获取所有具有指定 class 的元素
        var elements = document.querySelectorAll('.skuweight');

        // 存储数值的数组
        var weightValues = [];

        // 遍历每个元素
        elements.forEach(function(element) {
            // 获取当前元素的文本内容（即数值）
            var weightValue = parseFloat(element.textContent.trim());
            // 添加到存储数值的数组中
            weightValues.push(weightValue);
        });

        // 如果获取到了 skuweight 数值，则显示在右上角
        if (weightValues.length > 0) {
            // 计算数值的总和并保留小数点后两位
            var totalWeight = weightValues.reduce((acc, val) => acc + val, 0).toFixed(2);
            // 将 skuweight 数值总和显示在右上角
            var outputTextRight = "\n\n" + totalWeight;
            // 将字符串设置为输出框的内容
            displayElementRight.textContent = outputTextRight;
            // 显示输出框
            displayElementRight.style.display = 'block';
        }
    }

    // 在指定的节点上添加事件监听器，以便在数据加载时重新执行更新显示的内容的逻辑
    var targetNode = document.body;
    var config = { attributes: true, childList: true, subtree: true };
    var observer = new MutationObserver(function(mutationsList, observer) {
        updateDisplay();
    });
    observer.observe(targetNode, config);

})();
