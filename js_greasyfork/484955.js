// ==UserScript==
// @name         bigseller 计算昨天同时销售额
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  0.2 更新每分钟更新一次
// @author       calg
// @match        https://www.bigseller.pro/web/statis/board.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bigseller.pro
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484955/bigseller%20%E8%AE%A1%E7%AE%97%E6%98%A8%E5%A4%A9%E5%90%8C%E6%97%B6%E9%94%80%E5%94%AE%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/484955/bigseller%20%E8%AE%A1%E7%AE%97%E6%98%A8%E5%A4%A9%E5%90%8C%E6%97%B6%E9%94%80%E5%94%AE%E9%A2%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加按钮
   // 获取 class="tit" 的 div
    function gettitdiv() {
        const div2 = document.querySelector(".tit");

        if(div2.classList.contains("tit")){
            clearInterval(intervalId);
            executeFunction()
        }else {
            console.log("tit div not found.");
        }
    }
    // 执行函数
    function executeFunction() {
        // 获取当前时间
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var hour = currentTime.getHours();
        var minute = currentTime.getMinutes();
        var second = currentTime.getSeconds();

        var currentTimeString = year + "-" + month + "-" + day + "+" + hour + ":" + minute + ":" + second;

        // 获取请求对象
        var xhr = new XMLHttpRequest();

        // 监听请求的 readystatechange 事件
        xhr.onreadystatechange = function() {
            // 请求返回时打印请求的返回内容
            if (xhr.readyState === 4) {
                // 获取请求返回的内容
                const response = xhr.responseText;

                // 将 JSON 字符串解析为对象
                const data = JSON.parse(response);

                // 获取 perHourVo 对象
                const perHourVo = data.data.perHourVo;

                // 计算有效内容的数量
                let validCount = 0;
                for (const key in perHourVo) {
                    if (perHourVo[key] !== -1) {
                        validCount++;
                    }
                }

                // 获取 yesPerHourVo 对象
                const yesPerHourVo = data.data.yesPerHourVo;

                // 取对应数量的元素求和
                let sum = 0;
                for (let i = 0; i < validCount; i++) {
                    sum += yesPerHourVo[`perHourSaleAmount${i}`];
                }

                // 获取 `class="tit"` 的 `div`
                const sigDiv = document.querySelector(".tit");

                // 创建 `span` 元素
                const titleSpan = document.createElement("span");
                titleSpan.className = "title";
                titleSpan.textContent = "-昨日同时: ";

                const valueSpan = document.createElement("span");
                valueSpan.className = "value";
                valueSpan.textContent = sum;

                // 将 `span` 元素添加到 `div` 中
                sigDiv.appendChild(titleSpan);
                sigDiv.appendChild(valueSpan);
            }
        };

        // 发送请求
        xhr.open("GET", "https://www.bigseller.pro/api/v1/data/dashboard/orderSaleStat.json?currentTime="+currentTimeString);
        xhr.send();
    }

    function UpdateregularlyFunction() {
        // 获取当前时间
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var hour = currentTime.getHours();
        var minute = currentTime.getMinutes();
        var second = currentTime.getSeconds();

        var currentTimeString = year + "-" + month + "-" + day + "+" + hour + ":" + minute + ":" + second;

        // 获取请求对象
        var xhr = new XMLHttpRequest();

        // 监听请求的 readystatechange 事件
        xhr.onreadystatechange = function() {
            // 请求返回时打印请求的返回内容
            if (xhr.readyState === 4) {
                // 获取请求返回的内容
                const response = xhr.responseText;

                // 将 JSON 字符串解析为对象
                const data = JSON.parse(response);

                // 获取 perHourVo 对象
                const perHourVo = data.data.perHourVo;

                // 计算有效内容的数量
                let validCount = 0;
                for (const key in perHourVo) {
                    if (perHourVo[key] !== -1) {
                        validCount++;
                    }
                }

                // 获取 yesPerHourVo 对象
                const yesPerHourVo = data.data.yesPerHourVo;

                // 取对应数量的元素求和
                let sum = 0;
                for (let i = 0; i < validCount; i++) {
                    sum += yesPerHourVo[`perHourSaleAmount${i}`];
                }

                // 获取 class="tit" 的 div
                const sigDiv = document.querySelector(".tit");

                // 获取 class="value" 的 span
                const valueSpan = sigDiv.querySelector(".value");

                // 修改值
                valueSpan.textContent = sum;
            }
        };

        // 发送请求
        xhr.open("GET", "https://www.bigseller.pro/api/v1/data/dashboard/orderSaleStat.json?currentTime="+currentTimeString);
        xhr.send();
    }
    // 设置一个循环，每隔一段时间执行一次检查
    var intervalId = setInterval(gettitdiv, 500); // 间隔为1秒（1000毫秒）
    var intervalId2 = setInterval(UpdateregularlyFunction, 60000); // 间隔为60秒（1000毫秒），每60秒更新一次
})();