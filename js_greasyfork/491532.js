// ==UserScript==
// @name         MicrosoftScript
// @namespace    3hex
// @version      0.1.1
// @description  自动
// @author       3hex
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @icon         https://az15297.vo.msecnd.net/images/rewards/membercenter/missions/Animated-Icons/bing_icon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491532/MicrosoftScript.user.js
// @updateURL https://update.greasyfork.org/scripts/491532/MicrosoftScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;
    var domain = new URL(currentURL).hostname;

    function getMobileViewport(width, height) {
        return {
            width: width,
            height: height,
            deviceScaleFactor: 1,
            mobile: true
        };
    }

    var num = 0;
    var mode = 0 // 0:PC 1:mobile

    console.log("[info] successful match");

    const timestamp2 = new Date().getTime(); // 获取当前时间戳
    const timestampString = timestamp2.toString();
    const randomIndex = Math.floor(Math.random() * (timestampString.length - 1)) + 1;
    const prefix = parseInt(timestampString.substring(0, randomIndex));
    const postfix = Math.floor(Math.random() * 200) + 1; // 生成随机数在1到200之间
    const timestamp = prefix.toString() + "+" + postfix.toString() + "="; // 修改成字符串拼接形式

    console.log("[info] timestamp:"+timestamp); // 输出当前时间戳

    const div = document.createElement('div');
    const img = document.createElement('img');
    const span = document.createElement('span')

    div.appendChild(img);
    div.appendChild(span);

    img.src = 'https://az15297.vo.msecnd.net/images/rewards/membercenter/missions/Animated-Icons/bing_icon.svg'; // 设置 img 的 src 属性

    img.id = "mrs_img_auto";
    div.style.position = 'fixed'; // 设置定位方式为固定定位
    div.style.top = '15%'; // 设置 img 的上边缘距离屏幕顶部的距离为 0
    div.style.left = '3%'; // 设置 img 的左边缘距离屏幕左侧的距离为 0

    span.textContent = "0";
    span.style.color = "red";
    span.style.fontWeight = 'bold';
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';

    num = parseInt(localStorage.getItem('mrs_count_num'), 10);
    mode = parseInt(localStorage.getItem('mrs_count_mode'), 10);
    if(!isNaN(num) && num != 0) {
        span.textContent = "" + num;
        console.log("[info] count:" + num);
        num = num - 1;
        localStorage.setItem('mrs_count_num', num);

        setTimeout(function() {
             // 生成随机数
            var textarea = document.getElementById('sb_form_q');
                 const randomNumber1 = Math.floor(Math.random() * 100) + 1;
                 const randomNumber2 = Math.floor(Math.random() * 100) + 1;
                 const result = randomNumber1.tostring * randomNumber2;

                 // 将随机数文本设置为textarea的值
                  textarea.value = randomNumber1.toString() + " + " + randomNumber2.toString() + " = "
                  var searchButton = document.getElementById('sb_form_go');

                 // 触发点击事件
                 searchButton.click();
        }, Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000); // 随机延迟5到10秒
    }

    div.addEventListener('click', function() { // 添加点击事件监听器
        const n = window.prompt('Please enter a number（Number of searches）:');
        num = parseInt(n, 10);
         if(!isNaN(num) && num != 0) {
             span.textContent = "" + num;
             console.log("[info] first count:" + num);
             num = num - 1;

             localStorage.setItem('mrs_count_num', num);

             setTimeout(function() {
                 var textarea = document.getElementById('sb_form_q');

                 // 生成随机数
                 const randomNumber1 = Math.floor(Math.random() * 100) + 1;
                 const randomNumber2 = Math.floor(Math.random() * 100) + 1;
                 const result = randomNumber1 * randomNumber2;

                 // 将随机数文本设置为textarea的值
                  textarea.value = randomNumber1.toString() + " + " + randomNumber2.toString() + " = "
                 var searchButton = document.getElementById('sb_form_go');

                 // 触发点击事件
                 searchButton.click();
             }, Math.floor(Math.random() * (7000 - 5000 + 1))); // 随机延迟5到10秒

         } else {
             console.log("[info] cancel");
         }
    });
    document.getElementById('b_content').appendChild(div);

    // 监听键盘按键事件
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'l') {
            if (confirm("Whether you want to stop automatic search? ")) {
                console.log("[info] stop");
                num = 0;
                localStorage.setItem('mrs_count_num', 0);;
            } else {
               console.log("[info] continue :) ");
            }
        }
    });

})();

