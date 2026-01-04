// ==UserScript==
// @name         AutoClickButton
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click a button
// @author       You
// @license MIT
// @match        https://buyin.jinritemai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/470302/AutoClickButton.user.js
// @updateURL https://update.greasyfork.org/scripts/470302/AutoClickButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建配置面板
    var panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '200px';
    panel.style.right = '40px';
    panel.style.zIndex = '1000';
    panel.style.backgroundColor = 'white';
    panel.style.padding = '20px';
    panel.style.border = '1px solid black';
    panel.style.borderRadius = '5px';
    panel.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.1)';
    panel.style.width = '200px';

    // 创建"发红包"按钮
    var sendButton = document.createElement('button');
    sendButton.textContent = '发红包';
    sendButton.style.backgroundColor = 'red';
    sendButton.style.color = 'white';
    sendButton.style.border = 'none';
    sendButton.style.padding = '10px';
    sendButton.style.cursor = 'pointer';
    sendButton.style.width = '100%';
    sendButton.style.borderRadius = '5px';
    panel.appendChild(sendButton);

    // 创建红包有效期输入框
    var validTimeLabel = document.createElement('label');
    validTimeLabel.textContent = '红包有效期（分钟）：';
    panel.appendChild(validTimeLabel);

    var validTimeInput = document.createElement('input');
    validTimeInput.type = 'number';
    validTimeInput.min = '1';
    validTimeInput.value = GM_getValue('validTime', '6');
    validTimeInput.style.marginTop = '10px';
    validTimeInput.style.width = '100%';
    validTimeInput.style.padding = '5px';
    panel.appendChild(validTimeInput);

    // 创建是否自动发送红包复选框
    var autoSendCheck = document.createElement('input');
    autoSendCheck.type = 'checkbox';
    autoSendCheck.checked = GM_getValue('isAutoSend', false);
    autoSendCheck.style.marginTop = '10px';

    var autoSendLabel = document.createElement('label');
    autoSendLabel.textContent = '是否自动发送红包';
    panel.appendChild(autoSendCheck);
    panel.appendChild(autoSendLabel);

    // 创建发送等待过期输入框
    var sendIntervalLabel = document.createElement('label');
    sendIntervalLabel.textContent = '发送等待时间（秒）：';
    sendIntervalLabel.style.display = autoSendCheck.checked ? 'block' : 'none';
    panel.appendChild(sendIntervalLabel);

    var sendIntervalInput = document.createElement('input');
    sendIntervalInput.type = 'number';
    sendIntervalInput.min = '1';
    sendIntervalInput.value = GM_getValue('sendInterval', '20');
    sendIntervalInput.style.marginTop = '10px';
    sendIntervalInput.style.width = '100%';
    sendIntervalInput.style.padding = '5px';
    sendIntervalInput.style.display = autoSendCheck.checked ? 'block' : 'none';
    panel.appendChild(sendIntervalInput);

    // 初始时根据复选框状态设置发送间隔输入框和其标签是否显示
    autoSendCheck.addEventListener('change', function() {
        var display = this.checked ? 'block' : 'none';
        sendIntervalInput.style.display = display;
        sendIntervalLabel.style.display = display;
    });

    // 将配置面板添加到页面
    document.body.appendChild(panel);

    // 发红包函数
    function sendRedPacket() {
        // 从设置中获取有效期和发送间隔
        var validTime = parseInt(validTimeInput.value, 10);
        var isAutoSend = autoSendCheck.checked;
        var sendInterval = parseInt(sendIntervalInput.value, 10);

        // 获取所有行
        var rows = document.querySelectorAll('tr.buyin-table-row');
        var endtime = null;
        var isActive = false;  // 标识是否找到了"生效中"的状态

        // 遍历每一行
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];

            // 检查该行的状态是否为 "生效中"
            var statusCell = row.querySelector('td.buyin-table-cell-fix-right.buyin-table-cell-fix-right-first');
            if (statusCell && statusCell.textContent.trim() === '生效中') {
                isActive = true;  // 找到"生效中"的状态
                console.log(row.querySelectorAll('td')[5].textContent);
                var str = row.querySelectorAll('td')[5].textContent;
                var regex1 = /至 (.*?)领取/;
                var match = str.match(regex1);
                if (match) {
                    endtime = new Date(match[1]);  // 创建代表结束时间的Date对象
                    endtime.setSeconds(endtime.getSeconds() + sendInterval);  // 将endtime增加30秒
                }
                break;  // 找到"生效中"的状态后，不再检查其他行
            }
        }

        if(isActive)
        {
            if(endtime !== null)
            {
                var now = new Date();  // 创建代表当前时间的Date对象

                // 比较当前时间和endtime
                if (now > endtime) {
                    // 如果当前时间大于endtime，继续运行
                    console.log("Continue running");
                } else {
                    // 否则，等待（endtime - now）毫秒后再继续
                    var delay = endtime - now;
                    console.log("Wait for " + delay + " milliseconds");
                    setTimeout(sendRedPacket, delay);
                    return
                }
            }
            else
            {
                setTimeout(sendRedPacket, 30*1000);
                return
            }
        }
        else
        {
            console.log("没有生效中记录")
        }

        function clickcopy(){
            //点击红包列表第一个复制红包
            var spanElements = document.querySelectorAll('.buyin-btn.buyin-btn-link');
            for (var i = 0; i < spanElements.length; i++) {
                if (spanElements[i].textContent.trim() === '复制') {
                    spanElements[i].click();
                    break;
                }
            }
        }

        //定义鼠标单击事件
        var mouseEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true
        });

        //点击选择结束时间控件
        function clicktime(){
            var timeElements = document.querySelectorAll('.auxo-picker-input input');
            for (var i = 0; i < timeElements.length; i++) {
                if (timeElements[i].placeholder.trim() === '请选择时间') {
                    timeElements[i].dispatchEvent(mouseEvent);
                    break;
                }
            }
        }

        //点击时分秒
        function clickhms(){
            // 获取包含时、分、秒的三个ul元素
            var timeColumns = document.querySelectorAll('.auxo-picker-time-panel-column');

            var now = new Date();  // 获取当前时间
            now.setMinutes(now.getMinutes() + validTime);  // 添加有效期时间

            // 获取年、月、日
            var year = now.getFullYear();
            var month = now.getMonth() + 1; // getMonth() 返回的月份是从 0 开始的
            var day = now.getDate();

            // 将月和日格式化为两位数
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;

            // 构造日期字符串
            var dateStr = `${year}-${month}-${day}`;

            // 查找元素
            var dateCell = document.querySelector(`td[title="${dateStr}"]`);
            dateCell.click();

            var hour = now.getHours();  // 获取小时数
            var minute = now.getMinutes();  // 获取分钟数
            var second = now.getSeconds();  // 获取秒数
            console.log(hour + ':' + minute + ':' + second);  // 打印时间
            // 在每个ul元素中找到并点击对应的时、分、秒
            timeColumns[0].querySelectorAll('.auxo-picker-time-panel-cell-inner')[hour].click();

            timeColumns[1].querySelectorAll('.auxo-picker-time-panel-cell-inner')[minute].click();

            timeColumns[2].querySelectorAll('.auxo-picker-time-panel-cell-inner')[second].click();


            var okButton = document.querySelector('.auxo-picker-ok button');
            okButton.click()
        }
        //提交红包
        function sumbitTijiao(){
            var spanElements = document.querySelectorAll('.auxo-space-item button');
            for (var i = 0; i < spanElements.length; i++) {
                if (spanElements[i].textContent.trim() === '提交') {
                    spanElements[i].click();
                    break;
                }
            }
        }

        //点击投放红包
        function clickToufang(){
            var spanElements = document.querySelectorAll('.buyin-btn.buyin-btn-primary');
            for (var i = 0; i < spanElements.length; i++) {
                if (spanElements[i].textContent.trim() === '投放红包') {
                    spanElements[i].click()
                    break;
                }
            }
        }

        //确定投放
        function sumbitToufang(){
            var spanElements = document.querySelectorAll('.buyin-select-selection-item');
            for (var i = 0; i < spanElements.length; i++) {
                if (spanElements[i].textContent.trim() === '5推荐') {
                    spanElements[i].dispatchEvent(mouseEvent);
                    break;
                }
            }
            // 获取所有选项
            var options = document.getElementsByClassName('buyin-select-item-option');

            // 遍历所有选项
            for (var i = 0; i < options.length; i++) {
                // 如果该选项的title属性为"2"
                if (options[i].getAttribute('title') === '2') {
                    // 把它的'aria-selected'属性设置为'true'
                    options[i].click();
                    break;
                }
            }

            var spanElements = document.querySelectorAll('.buyin-select-selector');
            for (var i = 0; i < spanElements.length; i++) {
                if (spanElements[i].textContent.trim() === '10分钟') {
                    spanElements[i].dispatchEvent(mouseEvent);
                    break;
                }
            }
            // 获取所有选项
            var options = document.getElementsByClassName('buyin-select-item-option');

            // 遍历所有选项
            for (var i = 0; i < options.length; i++) {
                // 如果该选项的label属性为"2分钟"
                if (options[i].getAttribute('label') === '2分钟') {
                    // 模拟用户点击这个选项
                    options[i].click();
                    break;
                }
            }
            var spanElements = document.querySelectorAll('.buyin-btn.buyin-btn-primary');
            for (var i = 0; i < spanElements.length; i++) {
                if (spanElements[i].textContent.trim() === '确定') {
                    spanElements[i].click();
                    break;
                }
            }
        }
        setTimeout(function(){
            clickcopy()
        },1000)
        setTimeout(function(){
            clicktime()
        },4000)
        setTimeout(function(){
            clickhms()
        },6000)
        setTimeout(function(){
            sumbitTijiao()
        },8000)

        setTimeout(function(){
            console.log("clickToufang")
            clickToufang()
        },12000)

        setTimeout(function(){
            console.log("sumbitToufang")
            sumbitToufang()
        },14000)

        // 如果设置了自动发送红包，定时发送下一个红包
        if (isAutoSend) {
            setTimeout(sendRedPacket,  40 * 1000);
        }
    }

    // 给按钮添加点击事件
    sendButton.onclick = function() {
        sendRedPacket();
    };
})();