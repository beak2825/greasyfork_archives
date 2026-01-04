// ==UserScript==
// @name        😋全网首个😋云班课精品课视频_突破已观看进度mosoteach
// @namespace   Violentmonkey Scripts
// @match       *://mooc.mosoteach.cn/course-study/*
// @grant       GM_addStyle
// @version     1.0
// @author      大宇同学
// @icon         https://cdn.jsdelivr.net/npm/davan-cdn@1.0.5/img/home.png
// @description 针对云班课精品课视频_已观看进度的突破_此类课程用强制拖动进度条方法和倍速方法是没有用的
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490074/%F0%9F%98%8B%E5%85%A8%E7%BD%91%E9%A6%96%E4%B8%AA%F0%9F%98%8B%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%B2%BE%E5%93%81%E8%AF%BE%E8%A7%86%E9%A2%91_%E7%AA%81%E7%A0%B4%E5%B7%B2%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6mosoteach.user.js
// @updateURL https://update.greasyfork.org/scripts/490074/%F0%9F%98%8B%E5%85%A8%E7%BD%91%E9%A6%96%E4%B8%AA%F0%9F%98%8B%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%B2%BE%E5%93%81%E8%AF%BE%E8%A7%86%E9%A2%91_%E7%AA%81%E7%A0%B4%E5%B7%B2%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6mosoteach.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 创建控制面板的HTML
    var panelHTML = `
        <div id="controlPanel" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 430px; background-color: #fff; border: 1px solid #FFC0CB; padding: 20px; z-index: 9999;">
            <h2 style="text-align: center;">云班课精品课视频专刷进度小助手_V1.0</h2>
            <h4 style="text-align: center;">By:大宇同学</h4>
            <div style="margin-top: 20px;">
                <div>参数一：<span id="param1"></span></div>
                <div>参数二：<span id="param2"></span></div>
                <div>参数三：<span id="param3"></span></div>
                <div>当前Token：<span id="currentToken"></span></div>
                <br>
                <div style="color: #FF0000; font-size: larger;"><strong>当前进度：</strong><span id="currentProgress"></span>%</div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <p>进度到110%时，请刷新一次页面查看侧边栏的观看进度</p>
                <br>
                <p>如果发现还是已观看XX%，请手动点击刷新继续刷</p>
                <br>
                <p>如果显示已学习，请手动切换到下一课，并手动刷新一下页面即可继续刷进度</p>
            </div>
            <button id="btnAction" style="display: block; margin: 20px auto; background-color: #007bff; color: #fff; border: none; padding: 10px 20px; cursor: pointer;">刷新（每次观看下一个视频时务必要点我刷新）</button>
        </div>
    `;

    // 在页面上添加控制面板
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // 样式
    GM_addStyle(`
        #controlPanel {
            box-shadow: 0px 0px 30px #FFC0CB;
        }
        #btnAction:hover {
            background-color: #0056b3;
        }
    `);

    // 获取当前课程URL参数
    const currentPageUrl = window.location.href;
    // 使用 URL 对象解析 URL
    const url = new URL(currentPageUrl);
    // 获取 pathname 中的部分
    const pathnameParts = url.pathname.split('/');
    // 分别获取所需的部分
    const firstPart = pathnameParts[2];
    const secondPart = pathnameParts[3];
    const thirdPart = url.searchParams.get('currentOid');
    // 找到token
    const token = localStorage.getItem('_token');
    // 显示到控制面板上
    document.getElementById('param1').textContent = firstPart;
    document.getElementById('param2').textContent = secondPart;
    document.getElementById('param3').textContent = thirdPart;
    document.getElementById('currentToken').textContent = token;
    let currentProgress = 0;
    const progressSpan = document.getElementById('currentProgress');

    // 按钮点击事件：执行操作（示例）
    document.getElementById('btnAction').addEventListener('click', function () {
        // 这里可以添加你想要执行的操作
        alert('刷新完成！(´▽`ʃ♡ƪ)');
    });


     // 自增当前进度
     const increaseProgress = setInterval(() => {
        currentProgress++;
        progressSpan.textContent = currentProgress;
        if (currentProgress >= 110) {
            clearInterval(increaseProgress); // 停止自增
        }
    }, 3000); // 每两秒增加1%


     // 按钮点击事件：刷新页面
     document.getElementById('btnAction').addEventListener('click', function() {
        location.reload();
    });


    // 监视 DOM 的变化，并在检测到新的 video 元素时执行删除操作
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeName.toLowerCase() === 'video') {
                    node.parentNode.removeChild(node);
                }
            });
        });
    });

    // 配置 MutationObserver 监视的目标节点和选项
    var observerConfig = { childList: true, subtree: true };

    // 启动 MutationObserver
    observer.observe(document.body, observerConfig);
    ////////////////////////////////////////////////////////
    //请求POST
    // 定义请求参数
var myHeaders = new Headers();
myHeaders.append("Host", "coreapi-proxy.mosoteach.cn");
myHeaders.append("Connection", "close");
myHeaders.append("Content-Length", "20");
myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"");
myHeaders.append("Accept", "application/json, text/plain, */*");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-token", token);
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
myHeaders.append("sec-ch-ua-platform", "Windows");
myHeaders.append("Origin", "https://mooc.mosoteach.cn");
myHeaders.append("Sec-Fetch-Site", "same-site");
myHeaders.append("Sec-Fetch-Mode", "cors");
myHeaders.append("Sec-Fetch-Dest", "empty");
myHeaders.append("Referer", "https://mooc.mosoteach.cn/");
myHeaders.append("Accept-Encoding", "gzip, deflate");
myHeaders.append("Accept-Language", "zh-CN,zh;q=0.9");

var raw = JSON.stringify({
    "watchTo": 9999.9999
});

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
};

// 定义循环次数
var numberOfRequests = 110; // 例如，这里定义为 10 次循环

// 定义延迟时间（毫秒）
var delayBetweenRequests = 3000; // 1秒

// 循环执行请求
for (var i = 0; i < numberOfRequests; i++) {
    setTimeout(function () {
        fetch(`https://coreapi-proxy.mosoteach.cn/index.php/online-courses/${firstPart}/plans/${secondPart}/resources/${thirdPart}/progress`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }, i * delayBetweenRequests); // 这里使用 i * delayBetweenRequests 来实现逐渐增加的延迟
}


})();
