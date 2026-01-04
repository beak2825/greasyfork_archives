// ==UserScript==
// @name         虎牙弹幕发射机
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  虎牙弹幕发射，喷子利器
// @author       黎曼
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496173/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E5%8F%91%E5%B0%84%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/496173/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E5%8F%91%E5%B0%84%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var message = "😡"; // 自定义发送弹幕
    var interval = 5000;
    var intervalId; // 保存定时器 ID

    // 配置面板
    // 创建配置面板元素
    const configPanel = document.createElement('div');
    configPanel.id = 'configPanel';
    configPanel.style.cssText = 'position: fixed; bottom: 50px; right: 20px; width: 200px; background-color: white; border: 1px solid #ccc; padding: 10px; z-index: 999;';

    // 创建标题元素
    const title = document.createElement('h2');
    title.textContent = '自动发射弹幕配置';
    configPanel.appendChild(title);

    // 创建输入框和按钮元素
    const messageLabel = document.createElement('label');
    messageLabel.textContent = '弹幕内容：';
    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.id = 'messageInput';
    messageInput.placeholder = '输入弹幕内容';
    configPanel.appendChild(messageLabel);
    configPanel.appendChild(messageInput);

    const intervalLabel = document.createElement('label');
    intervalLabel.textContent = '发送间隔（秒）：';
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.id = 'intervalInput';
    intervalInput.placeholder = '发送间隔';
    intervalInput.min = '1';
    configPanel.appendChild(document.createElement('br'));
    configPanel.appendChild(intervalLabel);
    configPanel.appendChild(intervalInput);

    const startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = '开始发送';
    configPanel.appendChild(document.createElement('br'));
    configPanel.appendChild(startButton);

    const stopButton = document.createElement('button');
    stopButton.id = 'stopButton';
    stopButton.textContent = '停止发送';
    configPanel.appendChild(stopButton);

    // 将配置面板添加到页面中
    document.body.appendChild(configPanel);

    document.getElementById('startButton').addEventListener('click', function() {
      // 获取输入框的值并进行处理
      message = document.getElementById('messageInput').value.trim().substring(0, 30);;
      interval = parseInt(document.getElementById('intervalInput').value) * 1000;
        console.log(`${message}, ${interval}`)
        danmu_start();
    });
    document.getElementById('stopButton').addEventListener('click', function() {
        // 获取输入框的值并进行处理
           danmu_stop();
    });


    window.onload = function() {
        'use strict';

        // 获取剧场全屏按钮元素
        var fullscreenButton = document.getElementsByClassName('player-fullpage-btn')[0];
        fullscreenButton.click();
    };

    // 定义发送弹幕的函数
    function sendBarrage() {
        // 获取弹幕输入框和发送按钮元素
        const inputField = document.getElementById('player-full-input-txt');
        const sendButton = document.getElementById('player-full-input-btn');

        // 将弹幕内容填入输入框
        inputField.value = message;
        // 模拟点击发送按钮
        sendButton.click();
        // 获取当前时间
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        console.log(`send ✈ [${timeString}] : ${message}`);

    }

    function danmu_start() {
        console.log("danmu go ✈");

        // 开始定时自动发送弹幕
        setTimeout(function() {
            sendBarrage(); // 首次发送弹幕
            intervalId = setInterval(sendBarrage, interval); // 以后每隔一段时间发送弹幕
        }, interval);
    }

       function danmu_stop() {
           // 停止定时发送弹幕
           if (intervalId) {
               clearInterval(intervalId);
               intervalId = null; // 重置定时器 ID
           }
           console.log("stop ✈");
       }

})();