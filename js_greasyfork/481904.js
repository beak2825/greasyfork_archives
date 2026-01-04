// ==UserScript==
// @name         adwindy-microsoft
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  自用微软积分搜索脚本，国际版与国内版通用。在原版本上添加了按钮，点击按钮后执行脚本。解决了原版本打开必应自动运行，导致必应不可用的情况。同时添加了获取百度热搜关键词取代原版的随机字符串关键词，更像人类搜索（需要跨域访问，第一次需要允许该域名，百度域名，安全可靠）。
// @author       liulliu(原版作者青鸟丹心GitHubwanqq)
// @match        https://*.bing.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481904/adwindy-microsoft.user.js
// @updateURL https://update.greasyfork.org/scripts/481904/adwindy-microsoft.meta.js
// ==/UserScript==


// 设置API URL
const apiUrl = "https://top.baidu.com/api/board?platform=wise&tab=realtime";

// 定义一个变量来存储API响应数据
var responseData = null;

(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        onload: function(response) {
            // 在这里处理响应数据
            responseData = response.responseText;
            GM_setValue('responseData', responseData);
            //console.log(GM_getValue('responseData', ""));
        }
    });
})();

// try {
//     console.log(GM_getValue('responseData', ""));
//     JSON.parse(GM_getValue('responseData', ""));
// } catch (error) {
//     console.error("无法解析JSON数据: " + error);
// }

//const randomWord = getRandomWordFromJSON(responseData);
//console.log("随机获取的word值: " + randomWord);


const searchUrl = 'https://www.bing.com/search';
const isDesktop = window.matchMedia("(min-width: 768px)").matches;
const iDesktop = 35;//定义桌面和手机版本，一次刷的数量
const iNotDesktop = 25;
//start();

// 创建按钮
let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position = "fixed";
Container.style.left = "90px";
Container.style.top = "21px";
Container.style['z-index'] = "999999";
Container.innerHTML = `<button id="myCustomize" style="position:absolute; left:30px; top:25px;background-color: red; color: white;">启动</button>`;
document.body.appendChild(Container);

// 获取按钮元素
const executeButton = document.getElementById('myCustomize');

// 添加点击事件监听器
executeButton.addEventListener('click', function () {
    buttunfunction();
});


//const btn = document.getElementById('myCustomize');
if (typeof GM_getValue('ifstart') !== "undefined") {
    // 按钮改为停止
    //Container.innerHTML = `<button id="myCustomize" style="position:absolute; left:30px; top:25px;background-color: red; color: white;">停止</button>`;
    // 变量 ifstart 已经定义
    // 执行你的代码
    //showNotification("提示", "已经点击了执行按钮");
    executeButton.style.backgroundColor = "green";
    executeButton.textContent = `停止 (${GM_getValue('searchCount',0)}/${isDesktop ? iDesktop : iNotDesktop})`;
    start();
} else {
    // 变量 ifstart 未定义
    // 执行其他操作
    executeButton.style.backgroundColor = "red";
    showNotification("提示", "请点击启停按钮开始执行脚本");

    //return;
}

//let ifstart = GM_getValue('ifstart', 1);
// 添加点击事件监听器


// 修改后的按钮点击处理函数
function buttunfunction(){
    //const btn = document.getElementById('myCustomize');

    if (typeof GM_getValue('ifstart') !== "undefined") {
        // 停止操作
        executeButton.style.backgroundColor = "red";
        executeButton.textContent = `启动`;
        GM_deleteValue('searchCount');
        GM_deleteValue('ifstart');
        location.reload();
    } else {
        // 启动操作
        //debugger;
        executeButton.style.backgroundColor = "green";
        executeButton.textContent = `停止 (${GM_getValue('searchCount',0)}/${isDesktop ? iDesktop : iNotDesktop})`;
        GM_setValue('ifstart', 1);
        start();
    }
}


function start(){
    // Check if the current URL is bing.com or cn.bing.com
    if (window.location.hostname.endsWith('.bing.com')) {
        // If it is, execute the random search every 2000 milliseconds (2 seconds)
        const loopCount = isDesktop ? iDesktop : iNotDesktop; // 根据设备类型设置循环次数50 : 30;
        let count = GM_getValue('searchCount', 0); // 从存储器中获取计数器初始值
        //debugger;
        const intervalId = setInterval(function() {
            if (count >= loopCount) {
                clearInterval(intervalId); // 停止循环
                GM_deleteValue('searchCount'); // 删除计数器的值
                GM_deleteValue('ifstart'); // 删除计数器的值
                // 任务完成后恢复颜色
                executeButton.style.backgroundColor = "red";
                executeButton.textContent = "启动";
                //Container.innerHTML = `<button id="myCustomize" style="position:absolute; left:30px; top:25px;background-color: red; color: white;">执行</button>`;
                window.close(); // 关闭 Bing 页面
                return;
            } else{
                executeButton.textContent = `停止 (${count+1}/${isDesktop ? iDesktop : iNotDesktop})`;
            }
            // Generate a random search query
            //const search = generateRandomSearch();
            const search0 = getRandomWordFromJSON();
            const search1 = generateRandomSearch();

            //const search = search0 + search1;
            //const search = search0.slice(0,5)+search1 + search0.slice(6,9)+search1 + search0.slice(9);
            const search = search1;

            // Enter the search query into the Bing search bar
            const searchBox = document.getElementById('sb_form_q');
            searchBox.value = search;
            searchBox.dispatchEvent(new Event('input')); // 触发输入框的输入事件，以便提交表单

            // Submit the search
            const searchForm = document.getElementById('sb_form');
            searchForm.submit();

            // Increment the counter and update the value in storage
            count++;
            GM_setValue('searchCount', count);
        }, 110000);
    }
}

function getRandomWordFromJSON() {
    try {
        // 尝试解析JSON字符串
        let jsonString = GM_getValue('responseData', "");
        const jsonData = JSON.parse(jsonString);

        // 检查数据是否包含"content"属性
        if (jsonData && jsonData.data && jsonData.data.cards) {
            const contentArray = jsonData.data.cards[0].content; // 假设只需要第一个 "content" 中的数据

            if (contentArray && contentArray.length > 0) {
                // 从 "content" 数组中随机选择一个元素
                const randomIndex = Math.floor(Math.random() * contentArray.length);
                const randomWord = contentArray[randomIndex].word;

                return randomWord;
            }
        }
        return "JSON数据格式不正确或数据为空";
    } catch (error) {
        return "解析JSON数据时出错: " + error;
    }
}



function getRandomWordFromJSON1() {
    try {
        // 尝试解析JSON字符串
        //console.log(jsonString);
        let jsonString=GM_getValue('responseData', "");
        const jsonData = JSON.parse(jsonString);
        console.log(typeof jsonData)
        console.log(JSON.stringify(jsonString, null, 2));

        // 检查数据是否包含"word"属性
        if (jsonData && Array.isArray(jsonData.data) && jsonData.data.length > 0) {
            // 从数据中随机选择一个元素
            const randomIndex = Math.floor(Math.random() * jsonData.data.length);
            const randomWord = jsonData.data[randomIndex].word;

            return randomWord;
        } else {
            return "JSON数据格式不正确或数据为空";
        }
    } catch (error) {
        return "解析JSON数据时出错: " + error;
    }
}


function generateRandomSearch() {
    let search = '';
    // 生成一个包含4位数字和1个字母的随机字符串
    for (let i = 0; i < 3; i++) {
        search += Math.floor(Math.random() * 10);
        search += String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    }
    //search += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    return search;
}


// 通知函数
function showNotification(title, text) {
    GM_notification({
        title: title,// 通知标题
        text: text,// 通知文本
        timeout: 5000// 通知消失的时间（毫秒）
    });
}

