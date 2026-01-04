// ==UserScript==
// @name         挂机修仙
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  挂机修仙yuis2222
// @author       Dominic Konode
// @match        https://game.yuis.cc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuis.cc
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/522361/%E6%8C%82%E6%9C%BA%E4%BF%AE%E4%BB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/522361/%E6%8C%82%E6%9C%BA%E4%BF%AE%E4%BB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    alert('yuis');

    // 在 `div.main-box` 内部添加一个文本域（textarea）
    const mainBox = document.querySelector('.game-item-box');
    let textArea;
    if (mainBox) {
        textArea = document.createElement('textarea');
        textArea.style.width = '300px';
        textArea.style.height = '700px';
        textArea.style.margin = '0 0 0 0px';
        textArea.style.resize = 'none'; // 禁止文本域调整大小
        textArea.style.fontFamily = 'Arial, sans-serif';
        textArea.style.fontSize = '14px';
        textArea.setAttribute('readonly', true); // 设置为只读
        mainBox.appendChild(textArea);
    }

    // 存储消息列表
    let messageList = [];

    // 获取所有的 .btn 元素
    let buttons = Array.from(document.querySelectorAll('.btn'));
    // 将按钮存储为键值对，键是按钮的文本内容，值是按钮元素
    let buttonMap = {};
    let buttonTextList = ['信息', '吐纳', '历练', '探索', '一键吐纳', '一键历练'];
    // 遍历所有按钮并构建键值对
    buttons.forEach(btn => {
        let buttonText = btn.textContent.trim();  // 获取按钮的文本内容
        if (buttonTextList.includes(buttonText)) {
            buttonMap[buttonText] = btn;  // 将按钮文本作为键，按钮元素作为值
            messageList.unshift(`✅ 找到【${buttonText}】按钮`);
        }
    });

    // 查看信息
    let xinxiBtn = buttonMap['信息'];
    if (xinxiBtn) {
        xinxiBtn.click();
        messageList.unshift('查看信息');
    }
    // 查找所有的 <details> 元素
    let gameControl = document.querySelector('.game-control');
    let detailsList = gameControl.querySelectorAll('details');
    // 遍历所有 <details> 元素，找到包含 "互动" 文本的那个
    let hudongDetails = null;
    detailsList.forEach(detail => {
        // 确保 summary 元素存在再访问 textContent
        let summary = detail.querySelector('summary');
        if (summary && summary.textContent.includes('互动')) {
            hudongDetails = detail;
        }
    });
    // 获取互动次数的文本内容
    let hudongText = hudongDetails.textContent.trim();
    // 使用正则表达式从文本中提取次数数据
    let tunaMatch = hudongText.match(/吐纳次数：(\d+)\/(\d+)/);
    let practiceMatch = hudongText.match(/历练次数：(\d+)\/(\d+)/);
    let exploreMatch = hudongText.match(/探索次数：(\d+)\/(\d+)/);
    let medicineMatch = hudongText.match(/嗑药次数：(\d+)\/(\d+)/);
    // 创建一个对象存储结果
    let hudongData = {};
    // 提取并存储每个次数值
    if (tunaMatch) {
        hudongData.tunaNum = parseInt(tunaMatch[1], 10); // 吐纳已完成次数
        hudongData.tunaTotal = parseInt(tunaMatch[2], 10); // 吐纳总次数
        messageList.unshift(`【吐纳】${tunaNum}/${tunaTotal}`);
    }
    if (practiceMatch) {
        hudongData.practiceNum = parseInt(practiceMatch[1], 10); // 历练已完成次数
        hudongData.practiceTotal = parseInt(practiceMatch[2], 10); // 历练总次数
        messageList.unshift(`【历练】${practiceNum}/${practiceTotal}`);
    }
    if (exploreMatch) {
        hudongData.exploreNum = parseInt(exploreMatch[1], 10); // 探索已完成次数
        hudongData.exploreTotal = parseInt(exploreMatch[2], 10); // 探索总次数
        messageList.unshift(`【探索】${exploreNum}/${exploreTotal}`);
    }
    if (medicineMatch) {
        hudongData.medicineNum = parseInt(medicineMatch[1], 10); // 嗑药已完成次数
        hudongData.medicineTotal = parseInt(medicineMatch[2], 10); // 嗑药总次数
        messageList.unshift(`【嗑药】${medicineNum}/${medicineTotal}`);
    }



    // 定时获取并更新消息列表
    setInterval(() => {
        // 获取所有包含游戏信息的 div 元素
        let gameMessages = document.querySelectorAll('.game-msg-box .game-msg .logs-1 > div[style]');
        // 倒序遍历所有 div 元素
        Array.from(gameMessages).reverse().forEach(msg => {
            let messageText = msg.textContent.trim();
            if (messageText && !messageList.includes(messageText)) {
                messageList.unshift(messageText); // 将新消息添加到列表的前端
            }
        });

        // 4. 更新文本域中的内容
        if (textArea) {
            textArea.value = messageList.join('\n'); // 将消息列表按换行符拼接，并更新到文本域中
        }

    }, 1000);

})();