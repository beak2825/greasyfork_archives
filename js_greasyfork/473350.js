// ==UserScript==
// @name         新农大抢课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  帮你抢课
// @author       new Bing & zhecydn
// @match        https://jwxt.xjau.edu.cn/jwglxt/xsxk/zzxkyzb_cxZzxkYzbIndex.html?gnmkdm=N253512&layout=default&su=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jwxt.xjau.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473350/%E6%96%B0%E5%86%9C%E5%A4%A7%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/473350/%E6%96%B0%E5%86%9C%E5%A4%A7%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮窗
    var floatWindow = document.createElement("div");
    floatWindow.style.position = "fixed";
    floatWindow.style.top = "10px";
    floatWindow.style.right = "10px";
    floatWindow.style.width = "200px";
    floatWindow.style.height = "100px";
    floatWindow.style.backgroundColor = "lightblue";
    floatWindow.style.border = "solid black 2px";
    floatWindow.style.zIndex = "9999";

    // 创建悬浮窗内容
    var title = document.createElement("h3");
    title.textContent = "自动选课";
    title.style.textAlign = "center";

    var statusText = document.createElement("p");
    statusText.textContent = "正在等待查询...";
    statusText.style.textAlign = "center";

    var stopButton = document.createElement("button");
    stopButton.textContent = "停止";
    stopButton.style.display = "block";
    stopButton.style.marginLeft = "auto";
    stopButton.style.marginRight = "auto";
    // 添加悬浮窗内容到悬浮窗
    floatWindow.appendChild(title);
    floatWindow.appendChild(statusText);
    floatWindow.appendChild(stopButton);

    // 添加悬浮窗到页面
    document.body.appendChild(floatWindow);

    // 找到查询按钮和选课按钮
    var queryButton = document.querySelector("button[name='query']");
    var chooseButton = null;

    // 定义一个定时器变量
    var timer = null;

    // 定义一个点击查询的函数
    function clickQuery() {
        statusText.textContent = "正在查询...";
        queryButton.click();
        console.log("Clicked query button");
        setTimeout(checkChoose, 300); // 等待一秒后检查是否出现选课按钮
    }

    // 定义一个检查选课的函数
    function checkChoose() {
        if (document.body.innerHTML.indexOf("选课") > -1) { // 如果页面中有选课的文本
            statusText.textContent = "找到选课按钮，正在选课...";
            chooseButton = document.querySelector("button[onclick^='chooseCourseZzxk']"); // 找到选课按钮
            chooseButton.click(); // 点击选课按钮
            console.log("Clicked choose button");
            stopTimer(); // 停止定时器
        } else { // 如果页面中没有选课的文本
            statusText.textContent = "没有找到选课按钮，继续查询...";
            console.log("No choose button found");
        }
    }
     // 定义一个开始定时器的函数
    function startTimer() {
        timer = setInterval(clickQuery, 500); // 每隔五秒就点击查询一次
        statusText.textContent = "正在等待查询...";
        console.log("Started timer"); // // // //
    } // //

    // 定义一个停止定时器的函数
    function stopTimer() {
        clearInterval(timer); // 清除定时器
        timer = null;
        statusText.textContent = "已停止";
        console.log("Stopped timer");
    }

    // 给停止按钮添加点击事件监听器
    stopButton.addEventListener("click", function() {
        if (timer) { // 如果定时器存在，就停止它
            stopTimer();
        } else { // 如果定时器不存在，就开始它
            startTimer();
        }
    });

    // 开始定时器
    // startTimer();
})();