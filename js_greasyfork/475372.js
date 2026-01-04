// ==UserScript==
// @name         宏远强国一键发送短信提醒客户
// @namespace    https://yz.mba
// @version      1.6
// @description  发送续费提醒
// @author       永至网络科技工作室
// @match        https://aj.2123451.xyz/NEwBoxpilj.php/account/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475372/%E5%AE%8F%E8%BF%9C%E5%BC%BA%E5%9B%BD%E4%B8%80%E9%94%AE%E5%8F%91%E9%80%81%E7%9F%AD%E4%BF%A1%E6%8F%90%E9%86%92%E5%AE%A2%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/475372/%E5%AE%8F%E8%BF%9C%E5%BC%BA%E5%9B%BD%E4%B8%80%E9%94%AE%E5%8F%91%E9%80%81%E7%9F%AD%E4%BF%A1%E6%8F%90%E9%86%92%E5%AE%A2%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 找到 "欠费转正常" 按钮元素
    var normalButton = document.querySelector('.btn-opera-send-code');

    if (normalButton) {
    // 创建一个包含标题、输入框和按钮的容器
    var container = document.createElement('div');
    container.style.display = 'inline-flex'; // 使用inline-flex而不是flex
    container.style.alignItems = 'center'; // 垂直居中对齐
    container.style.whiteSpace = 'nowrap'; // 防止元素换行
    //container.style.border = '1px solid #ccc'; // 添加边框，可以自定义颜色和样式

    // 创建一个标题元素
var label = document.createElement('label');
label.textContent = '通知'; // 标题文本
label.style.fontSize = '15px'; // 设置文本大小为15像素
label.style.marginTop = '5px'; // 在文本顶部添加10像素的外边距，可以根据需要调整此值
label.style.paddingLeft = '20px'; // 在文本左侧添加20像素的内边距，可以根据需要调整此值

// 输入框后面的标题元素
var label2 = document.createElement('label');
label2.textContent = '天内到期用户'; // 标题文本
label2.style.fontSize = '15px'; // 设置文本大小为15像素
label2.style.marginTop = '5px'; // 在文本顶部添加10像素的外边距，可以根据需要调整此值
label2.style.marginRight = '3px'; // 右外边距
//label2.style.paddingLeft = '20px'; // 在文本左侧添加20像素的内边距，可以根据需要调整此值

    // 创建一个输入框元素
    var inputDays = document.createElement('input');
    inputDays.type = 'text';
    inputDays.placeholder = '3';
        inputDays.style.marginLeft = '3px'; // 左外边距
        inputDays.style.marginRight = '3px'; // 右外边距
        inputDays.style.width = '25px'; // 输入框的宽度更窄
        inputDays.style.height = '20px'; // 输入框的高度更短
        inputDays.style.verticalAlign = 'middle'; // 垂直居中对齐
        //inputDays.style.display = 'inline-block'; // 水平对齐

    // 创建一个新按钮元素
    var button = document.createElement('a');
    button.href = 'javascript:;';
    button.className = 'btn btn-primary btn-custom'; // 自定义按钮的类名
    button.title = '发送短信提醒到期'; // 自定义按钮的标题
    button.innerHTML = '<i class="fa fa-custom"></i> 发送短信提醒到期'; // 自定义按钮的内容
    button.style.verticalAlign = 'middle'; // 垂直居中对齐
    button.style.display = 'inline-block'; // 水平对齐
    button.style.textAlign = 'center'; // 文本居中对齐
    button.style.marginRight = '5px'; // 右外边距

// 创建一个新按钮元素
var manualReminderButton = document.createElement('a');
manualReminderButton.href = 'https://code.lau.plus/send.php'; // 设置跳转链接为 https://code.lau.plus/send.php
manualReminderButton.className = 'btn btn-primary btn-custom'; // 使用与原按钮相同的类名
manualReminderButton.title = '手动提醒'; // 自定义按钮的标题
manualReminderButton.innerHTML = '手动提醒'; // 自定义按钮的内容
manualReminderButton.style.verticalAlign = 'middle'; // 垂直居中对齐
manualReminderButton.style.display = 'inline-block'; // 水平对齐
manualReminderButton.style.textAlign = 'center'; // 文本居中对齐


        // 创建一个新按钮元素
    var button2 = document.createElement('a');
    button2.href = 'javascript:;';
    button2.className = 'btn btn-primary btn-custom'; // 自定义按钮的类名
    button2.title = '发送分数通知'; // 自定义按钮的标题
    button2.innerHTML = '<i class="fa fa-custom"></i> 发送分数通知'; // 自定义按钮的内容
    button2.style.verticalAlign = 'middle'; // 垂直居中对齐
    button2.style.display = 'inline-block'; // 水平对齐
    button2.style.textAlign = 'center'; // 文本居中对齐
    button2.style.marginRight = '5px'; // 右外边距



             // 创建一个新按钮元素
    var button3 = document.createElement('a');
    button3.href = 'javascript:;';
    button3.className = 'btn btn-primary btn-custom'; // 自定义按钮的类名
    button3.title = '故障通知'; // 自定义按钮的标题
    button3.innerHTML = '<i class="fa fa-custom"></i> 故障通知'; // 自定义按钮的内容
    button3.style.verticalAlign = 'middle'; // 垂直居中对齐
    button3.style.display = 'inline-block'; // 水平对齐
    button3.style.textAlign = 'center'; // 文本居中对齐
    button3.style.marginRight = '5px'; // 右外边距

    // 将标题、输入框和按钮添加到容器中
    container.appendChild(label);
    container.appendChild(inputDays);
   container.appendChild(label2); // 添加在输入框后面
    container.appendChild(button);
        container.appendChild(button2);
        container.appendChild(button3);
        container.appendChild(manualReminderButton);


    // 在 "欠费转正常" 按钮后面插入容器
    normalButton.parentNode.insertBefore(container, normalButton.nextSibling);





        // 通知按钮
        // 通知按钮
        // 通知按钮
        // 通知按钮
        // 通知按钮
        // 通知按钮点击事件处理函数
        button2.addEventListener('click', function() {
            // 获取用户输入的天数
            var days = parseInt(inputDays.value) || 3; // 默认值为3天

            // 这里放入你的原始代码，使用用户输入的天数进行条件判断
            var result = [];

            var currentDate = new Date();
            var milliseconds = currentDate.getTime();
            fetch("https://aj.2123451.xyz/NEwBoxpilj.php/account/account/index?addtabs=1&sort=id&order=desc&filter=%7B%7D&op=%7B%7D&_="+milliseconds, {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrerPolicy": "no-referrer",
                "body": null,
                "method": "GET"
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                let data = myJson.rows
                const currentTimestamp = Math.floor(Date.now() / 1000);

                const filteredData = data.filter((item) => {
                    const itemTime = Math.floor(item.acctime);
                    return Math.abs(itemTime - currentTimestamp) < days * 86400 || itemTime < currentTimestamp;
                });

                const newArray = filteredData.map((item) => ({ num: item.username, name: item.code, time: item.acctime ,point: item.integral}));

                if (newArray.length === 0) {
                    alert('暂未有人到期');
                } else {
   // 生成初始提醒信息
var numberOfPhones = newArray.length;
var reminderMessage = ``;

// 计算已到期和即将到期的用户数量
var expiredCount = 0;
var upcomingCount = 0;

// 创建一个新的提醒信息变量，用于添加用户信息
var newReminderMessage = '';

// 添加名字、手机号、到期状态和到期时间到新的提醒信息中
for (var i = 0; i < newArray.length; i++) {
    var phoneNumber = newArray[i].num;
    var name = newArray[i].name;
    var index = i + 1; // 计算序号

    var isExpired = false; // 默认为未过期
    var expiryTime = new Date(newArray[i].time * 1000); // 转换为日期格式

    // 检查是否已经过期
    var currentTime = Math.floor(Date.now() / 1000);
    if (newArray[i].time < currentTime) {
        isExpired = true;
        expiredCount++;
    } else {
        upcomingCount++;
    }

    // 添加序号、名字、手机号、过期状态和到期时间到新的提醒信息中
    if (isExpired) {
        newReminderMessage += `${index}. ${name} ${phoneNumber} ❌已到期${expiryTime.toLocaleString()}\n`;
    } else {
        newReminderMessage += `${index}. ${name} ${phoneNumber} ✅未到期${expiryTime.toLocaleString()}\n`;
    }
}


// 合并原来的提醒信息和新的提醒信息
reminderMessage += newReminderMessage;

// 更新提醒信息，显示已到期和即将到期的用户数量
reminderMessage = `在 ${days} 天内共有 ${upcomingCount} 个用户即将到期，有 ${expiredCount} 个用户已到期\n\n${reminderMessage}`;

    // 使用确认对话框显示提醒信息，并提供取消选项
    var confirmResult = confirm(reminderMessage + '\n是否发送通知短信？');
 if (!confirmResult) {
    // 用户点击了取消按钮，取消操作
    return; // 中断操作
}
                    fetch('https://code.lau.plus/tongzhi.php',  {
                        headers: {
                            "accept": "application/json, text/javascript, */*; q=0.01",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "cache-control": "no-cache",
                            "content-type": "application/json",
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        body: JSON.stringify({"data":JSON.stringify(newArray)}),
                        method: "POST",
                        mode:"no-cors"
                    })
                    .then(response => response.text())
                    .then(data => alert("发送成功"))
                    .catch(error => alert('Error:', error));
                }
            });

            // 调用Completion以完成
            completion();
        });
















 button3.addEventListener('click', function() {
            // 获取用户输入的天数
            var days = parseInt(inputDays.value) || 3; // 默认值为3天

            // 这里放入你的原始代码，使用用户输入的天数进行条件判断
            var result = [];

            var currentDate = new Date();
            var milliseconds = currentDate.getTime();
            fetch("https://aj.2123451.xyz/NEwBoxpilj.php/account/account/index?addtabs=1&sort=id&order=desc&filter=%7B%7D&op=%7B%7D&_="+milliseconds, {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrerPolicy": "no-referrer",
                "body": null,
                "method": "GET"
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                let data = myJson.rows
                const currentTimestamp = Math.floor(Date.now() / 1000);

                const filteredData = data.filter((item) => {
                    const itemTime = Math.floor(item.acctime);
                    return Math.abs(itemTime - currentTimestamp) < days * 86400 || itemTime < currentTimestamp;
                });

                const newArray = filteredData.map((item) => ({ num: item.username, name: item.code, time: item.acctime ,point: item.integral}));

                if (newArray.length === 0) {
                    alert('暂未有人到期');
                } else {
   // 生成初始提醒信息
var numberOfPhones = newArray.length;
var reminderMessage = ``;

// 计算已到期和即将到期的用户数量
var expiredCount = 0;
var upcomingCount = 0;

// 创建一个新的提醒信息变量，用于添加用户信息
var newReminderMessage = '';

// 添加名字、手机号、到期状态和到期时间到新的提醒信息中
for (var i = 0; i < newArray.length; i++) {
    var phoneNumber = newArray[i].num;
    var name = newArray[i].name;
    var index = i + 1; // 计算序号

    var isExpired = false; // 默认为未过期
    var expiryTime = new Date(newArray[i].time * 1000); // 转换为日期格式

    // 检查是否已经过期
    var currentTime = Math.floor(Date.now() / 1000);
    if (newArray[i].time < currentTime) {
        isExpired = true;
        expiredCount++;
    } else {
        upcomingCount++;
    }

    // 添加序号、名字、手机号、过期状态和到期时间到新的提醒信息中
    if (isExpired) {
        newReminderMessage += `${index}. ${name} ${phoneNumber} ❌已到期${expiryTime.toLocaleString()}\n`;
    } else {
        newReminderMessage += `${index}. ${name} ${phoneNumber} ✅未到期${expiryTime.toLocaleString()}\n`;
    }
}


// 合并原来的提醒信息和新的提醒信息
reminderMessage += newReminderMessage;

// 更新提醒信息，显示已到期和即将到期的用户数量
reminderMessage = `在 ${days} 天内共有 ${upcomingCount} 个用户即将到期，有 ${expiredCount} 个用户已到期\n\n${reminderMessage}`;

    // 使用确认对话框显示提醒信息，并提供取消选项
    var confirmResult = confirm(reminderMessage + '\n是否发送通知短信？');
 if (!confirmResult) {
    // 用户点击了取消按钮，取消操作
    return; // 中断操作
}
                    fetch('https://code.lau.plus/guzhang.php',  {
                        headers: {
                            "accept": "application/json, text/javascript, */*; q=0.01",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "cache-control": "no-cache",
                            "content-type": "application/json",
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        body: JSON.stringify({"data":JSON.stringify(newArray)}),
                        method: "POST",
                        mode:"no-cors"
                    })
                    .then(response => response.text())
                    .then(data => alert("发送成功"))
                    .catch(error => alert('Error:', error));
                }
            });

            // 调用Completion以完成
            completion();
        });
































        // 按钮点击事件处理函数
        button.addEventListener('click', function() {
            // 获取用户输入的天数
            var days = parseInt(inputDays.value) || 3; // 默认值为3天

            // 这里放入你的原始代码，使用用户输入的天数进行条件判断
            var result = [];

            var currentDate = new Date();
            var milliseconds = currentDate.getTime();
            fetch("https://aj.2123451.xyz/NEwBoxpilj.php/account/account/index?addtabs=1&sort=id&order=desc&filter=%7B%7D&op=%7B%7D&_="+milliseconds, {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrerPolicy": "no-referrer",
                "body": null,
                "method": "GET"
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                let data = myJson.rows
                const currentTimestamp = Math.floor(Date.now() / 1000);

                const filteredData = data.filter((item) => {
                    const itemTime = Math.floor(item.acctime);
                    return Math.abs(itemTime - currentTimestamp) < days * 86400 || itemTime < currentTimestamp;
                });

                const newArray = filteredData.map((item) => ({ num: item.username, name: item.code, time: item.acctime ,point: item.integral}));

                if (newArray.length === 0) {
                    alert('暂未有人到期');
                } else {
   // 生成初始提醒信息
var numberOfPhones = newArray.length;
var reminderMessage = ``;

// 计算已到期和即将到期的用户数量
var expiredCount = 0;
var upcomingCount = 0;

// 创建一个新的提醒信息变量，用于添加用户信息
var newReminderMessage = '';

// 添加名字、手机号、到期状态和到期时间到新的提醒信息中
for (var i = 0; i < newArray.length; i++) {
    var phoneNumber = newArray[i].num;
    var name = newArray[i].name;
    var index = i + 1; // 计算序号

    var isExpired = false; // 默认为未过期
    var expiryTime = new Date(newArray[i].time * 1000); // 转换为日期格式

    // 检查是否已经过期
    var currentTime = Math.floor(Date.now() / 1000);
    if (newArray[i].time < currentTime) {
        isExpired = true;
        expiredCount++;
    } else {
        upcomingCount++;
    }

    // 添加序号、名字、手机号、过期状态和到期时间到新的提醒信息中
    if (isExpired) {
        newReminderMessage += `${index}. ${name} ${phoneNumber} ❌已到期${expiryTime.toLocaleString()}\n`;
    } else {
        newReminderMessage += `${index}. ${name} ${phoneNumber} ✅未到期${expiryTime.toLocaleString()}\n`;
    }
}


// 合并原来的提醒信息和新的提醒信息
reminderMessage += newReminderMessage;

// 更新提醒信息，显示已到期和即将到期的用户数量
reminderMessage = `在 ${days} 天内共有 ${upcomingCount} 个用户即将到期，有 ${expiredCount} 个用户已到期\n\n${reminderMessage}`;

    // 使用确认对话框显示提醒信息，并提供取消选项
    var confirmResult = confirm(reminderMessage + '\n是否发送短信提醒？');
 if (!confirmResult) {
    // 用户点击了取消按钮，取消操作
    return; // 中断操作
}
                    fetch('https://code.lau.plus/',  {
                        headers: {
                            "accept": "application/json, text/javascript, */*; q=0.01",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "cache-control": "no-cache",
                            "content-type": "application/json",
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        body: JSON.stringify({"data":JSON.stringify(newArray)}),
                        method: "POST",
                        mode:"no-cors"
                    })
                    .then(response => response.text())
                    .then(data => alert("发送成功"))
                    .catch(error => alert('Error:', error));
                }
            });

            // 调用Completion以完成
            completion();
        });
    }
})();
