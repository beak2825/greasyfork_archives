// ==UserScript==
// @name         Microsoft(Bing) Rewards Script
// @namespace    3hex
// @version      0.6.1
// @description  自动获得微软(Microsoft Rewards)/必应奖励(Bing Rewards)。通过设置搜索次数，🤖自动搜索获取积分。支持获得✔电脑搜索🏆、✔移动端搜索🏅、✔Microsoft Edge 奖励✌三种奖励
// @author       3hex
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @icon         https://az15297.vo.msecnd.net/images/rewards/membercenter/missions/Animated-Icons/bing_icon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466396/Microsoft%28Bing%29%20Rewards%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/466396/Microsoft%28Bing%29%20Rewards%20Script.meta.js
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

    const timestamp = new Date().getTime(); // 获取当前时间戳
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
    if(!isNaN(num)&&num!=0)
    {
        span.textContent = ""+num;
        console.log("[info] count:"+num);
        num = num - 1;
        localStorage.setItem('mrs_count_num',num);

        const url = "https://" + domain + "/search?q="+timestamp; // 目标网页的地址
        window.open(url, "_self"); // 在当前页面中打开目标网页
    }

    div.addEventListener('click', function() { // 添加点击事件监听器
        const n = window.prompt('Please enter a number（Number of searches）:');
        num = parseInt(n, 10);
         if(!isNaN(num)&&num!=0) {
             span.textContent = ""+num;
             console.log("[info] first count:"+num);
             num = num - 1;

             localStorage.setItem('mrs_count_num',num);

             const url = "https://cn.bing.com/search?q="+timestamp; // 目标网页的地址
             window.open(url, "_self"); // 在当前页面中打开目标网页

         }else
         {
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
                localStorage.setItem('mrs_count_num',0);;
            } else {
               console.log("[info] continue :) ");
            }
        }
    });

})();

