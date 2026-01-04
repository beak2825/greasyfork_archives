// ==UserScript==
// @name         回波图
// @namespace    qxj
// @version      2024-07-40
// @description  截屏

// @license MIT
// @author       brady
// @match        http://10.194.17.234/
// @icon      	  https://images.cnblogs.com/cnblogs_com/brady-wang/2377300/o_240205044944_WechatIMG230.jpg
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/502231/%E5%9B%9E%E6%B3%A2%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/502231/%E5%9B%9E%E6%B3%A2%E5%9B%BE.meta.js
// ==/UserScript==

// 每隔几分钟下载一次
var time_every = 5
function getCurrentFormattedDate() {
    const now = new Date();
    const year = now.getFullYear(); // 获取完整的年份(4位,1970-????)
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以要+1
    const day = String(now.getDate()).padStart(2, '0'); // 获取日
    const hours = String(now.getHours()).padStart(2, '0'); // 获取小时
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 获取分钟

    // 使用模板字符串来格式化日期和时间
    return `${year}年${month}月${day}日 ${hours}时${minutes}分`;
}
// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 获取当前时间前十五分钟的时间
function getTimeFifteenMinutesAgo() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 设置input的值
function setInputValues() {
    const input1 = document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(1) > div > input");
    const input2 = document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(2) > div > input");

    if (input1 && input2) {
        console.log("设置雷电时间")
        var now = getCurrentTime();
        var past = getTimeFifteenMinutesAgo();
        console.log(past)
        console.log(now)
        input1.value = past;
        input2.value = now;
        input1.dispatchEvent(new Event('input'));
        input2.dispatchEvent(new Event('input'));
    }
}
 // 定义一个函数来捕获页面内容
function capture() {

        //
        console.log("5秒后雷达截图")

        // 假设你有一个ID为"capture"的元素
        var element = document.getElementById("app");
        if (!element) {
            console.error('Element with ID "capture" not found');
            return;
        }

        html2canvas(element).then(canvas => {
            // 在这里，你可以将canvas保存为图片
            // 例如：创建一个a标签用于下载
            console.log("保存当前页面为图片")
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            var file_name = getCurrentFormattedDate();
            link.download = file_name+'.png';
            link.href = imgData;
            link.click();
        }).catch(error => {
            console.error('Error rendering canvas:', error);
        });
    }



function test()
{
        // 调用函数
    //setInputValues();
    //console.log("雷电查询按钮点击");
    //var leidian = document.querySelector("#app > div.bottom > div > div.menu-product > div.radar-light.tip-panel > div > div:nth-child(3)");
    //leidian.click();

     setTimeout(capture, 1000);
}




(function() {
    'use strict';


    // 动态加载html2canvas
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = function() {
        // 现在html2canvas已经加载，你可以安全地使用它了

        //setTimeout(capture, 10000);
        // 设置每隔5分钟执行一次myFunction

        setInterval(test, time_every*60 * 1000);
    };
    document.head.appendChild(script);

    // 注意：不要在这里调用capture()，因为它会在html2canvas加载之前执行
})();