// ==UserScript==
// @name         colab 保持活跃 / make colab keep alive
// @name:zh      colab 保持活跃
// @name:en      colab keep alive
// @name:zh-CN   使 colab 保持活跃
// @name:ja      colab アクティブに保存
// @namespace    https://colab.research.google.com
// @version      2.0
// @description:zh  让colab 保存活跃
// @description:en  make colab keep alive
// @description:zh-CN   让 colab 保存活跃
// @description:ja   Google colab アクティブに保存
// @author       Epool, WangZha
// @match        *://colab.research.google.com/*
// @grant        none
// @license       MIT
// @description make colab keep alive
// @downloadURL https://update.greasyfork.org/scripts/461356/colab%20%E4%BF%9D%E6%8C%81%E6%B4%BB%E8%B7%83%20%20make%20colab%20keep%20alive.user.js
// @updateURL https://update.greasyfork.org/scripts/461356/colab%20%E4%BF%9D%E6%8C%81%E6%B4%BB%E8%B7%83%20%20make%20colab%20keep%20alive.meta.js
// ==/UserScript==

// 定义保持活跃的行为
var timeOutIds = []
function keep_active() {
    'use strict';

    // 定义行为
    function ClickConnect(){
        colab.config
        console.log("Connnect Clicked - Start");
        document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect").click();
        console.log("Connnect Clicked - End");
    }

    // 设置随机行为时间
    var max = 120490
    var min = 60010
    var randomTime = [];
    var currentIndex = 0;
    var nextInterval

    function runInterval() {
        // 执行你的操作
        ClickConnect();

        // 添加下一个随机时间
        randomTime.push(parseInt(Math.random()*(max-min+1)+min,10))

        // 下一个调用的时间间隔为时间序列中的下一个值
        nextInterval = randomTime[currentIndex];
        console.log(`下一次行动${nextInterval}`)

        // 更新索引
        currentIndex++;

        // 使用 setTimeout 函数递归调用，以达到动态更改时间间隔的目的
        timeOutIds.push(setTimeout(runInterval, nextInterval));
    }

    // 第一次调用使用时间序列中的第一个值
    timeOutIds.push(setTimeout(runInterval, 5000));
}

// 创建 button 元素
var button = document.createElement('button');
button.id = 'floating-button';
button.innerText = '保持活跃';

// 创建 style 标签，设置样式
var style = document.createElement('style');
style.innerHTML = `
      #floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 75px;
        height: 35px;
        background-color: #ccc;
        color: #fff;
        border-radius: 23%;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        z-index: 999;
      }

      #floating-button.active {
        background-color: #007bff;
      }
    `;

// 添加按钮事件监听器和 run 函数
var isActive = false;

button.addEventListener('mousedown', function(event) {
    var offsetX = event.clientX - button.offsetLeft;
    var offsetY = event.clientY - button.offsetTop;

    function moveButton(event) {
        button.style.left = (event.clientX - offsetX) + 'px';
        button.style.top = (event.clientY - offsetY) + 'px';
    }

    document.addEventListener('mousemove', moveButton);

    button.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', moveButton);
    });
});

button.addEventListener('click', function() {
    isActive = !isActive;
    if (isActive) {
        button.classList.add('active');
        keep_active();
    } else {
        button.classList.remove('active');
        timeOutIds.forEach(function(id){clearTimeout(id);})
        console.log(`清楚任务${timeOutIds}`)
        timeOutIds = []
    }
});

// 添加元素到工具栏
setTimeout(function(){
    var topToolbar = document.getElementById('top-toolbar')
    console.log(topToolbar)
    if (topToolbar){
        console.log("开始添加元素")
        topToolbar.appendChild(button);
        document.head.appendChild(style);
        console.log("添加完成")
    }
},5000);
