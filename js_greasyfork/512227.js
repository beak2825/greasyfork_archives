// ==UserScript==
// @name         智能管理插件 - 满血版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  提供全方位智能功能的多功能插件
// @author       文熙
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512227/%E6%99%BA%E8%83%BD%E7%AE%A1%E7%90%86%E6%8F%92%E4%BB%B6%20-%20%E6%BB%A1%E8%A1%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512227/%E6%99%BA%E8%83%BD%E7%AE%A1%E7%90%86%E6%8F%92%E4%BB%B6%20-%20%E6%BB%A1%E8%A1%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    let style = document.createElement('style');
    style.innerHTML = `
        .smart-panel {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background-color: #282c34;
            color: white;
            padding: 20px;
            border-radius: 8px;
            width: 320px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .smart-panel h2 {
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            color: #61dafb;
        }
        .smart-panel button {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: none;
            background-color: #61dafb;
            color: black;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .smart-panel button:hover {
            background-color: #21a1f1;
        }
        .panel-section {
            margin-top: 10px;
            display: none;
        }
        .panel-section.active {
            display: block;
        }
        .panel-section p {
            margin: 10px 0;
        }
    `;
    document.head.appendChild(style);

    // 创建美化控制面板
    let controlPanel = document.createElement("div");
    controlPanel.className = "smart-panel";
    controlPanel.innerHTML = `
        <h2>智能管理面板</h2>
        <button id="togglePlayButton">播放/暂停</button>
        <button id="downloadVideoButton">下载视频</button>
        <button id="adjustSpeedButton">调整速度</button>
        <button id="adControlButton">广告控制</button>
        <button id="dynamicAdButton">动态广告</button>
        <button id="networkMonitorButton">网络监测</button>
        <button id="smartToggleButton">启用/禁用智能体</button>
        <button id="inputButton">输入内容</button>

        <div id="togglePlaySection" class="panel-section">
            <h3>播放/暂停</h3>
            <p>点击按钮开始或暂停视频播放。</p>
        </div>

        <div id="downloadVideoSection" class="panel-section">
            <h3>下载视频</h3>
            <p>单击下载当前视频。</p>
        </div>

        <div id="adjustSpeedSection" class="panel-section">
            <h3>调整速度</h3>
            <p>调整视频播放速度。</p>
        </div>

        <div id="adControlSection" class="panel-section">
            <h3>广告控制</h3>
            <p>显示或隐藏广告。</p>
        </div>

        <div id="dynamicAdSection" class="panel-section">
            <h3>动态广告</h3>
            <p>随机展示不同广告。</p>
        </div>

        <div id="networkMonitorSection" class="panel-section">
            <h3>网络监测</h3>
            <p>检测网络速度并提示是否下载视频。</p>
        </div>

        <div id="smartToggleSection" class="panel-section">
            <h3>启用/禁用智能体</h3>
            <p>智能体将帮助您优化视频播放和下载体验。</p>
        </div>

        <div id="inputSection" class="panel-section">
            <h3>用户输入</h3>
            <p>输入一些内容并处理。</p>
        </div>
    `;
    document.body.appendChild(controlPanel);

    // 事件处理函数
    function showSection(sectionId) {
        document.querySelectorAll('.panel-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    // 播放/暂停功能
    document.getElementById("togglePlayButton").addEventListener("click", function() {
        showSection("togglePlaySection");
        togglePlayPause();
    });

    // 下载视频功能
    document.getElementById("downloadVideoButton").addEventListener("click", function() {
        showSection("downloadVideoSection");
        downloadVideo();
    });

    // 调整播放速度功能
    document.getElementById("adjustSpeedButton").addEventListener("click", function() {
        showSection("adjustSpeedSection");
        adjustSpeed();
    });

    // 广告控制功能
    document.getElementById("adControlButton").addEventListener("click", function() {
        showSection("adControlSection");
        toggleAdDisplay();
    });

    // 动态广告功能
    document.getElementById("dynamicAdButton").addEventListener("click", function() {
        showSection("dynamicAdSection");
        showDynamicAd();
    });

    // 网络监测功能
    document.getElementById("networkMonitorButton").addEventListener("click", function() {
        showSection("networkMonitorSection");
        toggleNetworkMonitoring();
    });

    // 启用/禁用智能体功能
    document.getElementById("smartToggleButton").addEventListener("click", function() {
        showSection("smartToggleSection");
        toggleSmartMode();
    });

    // 用户输入功能
    document.getElementById("inputButton").addEventListener("click", function() {
        showSection("inputSection");
        promptUserInput();
    });

    // 全局变量和功能函数
    let videoElements = [];
    let currentVideo = null;
    let adDiv = null;
    let smartModeEnabled = true;
    let isNetworkMonitoring = false;
    let networkSpeed = 0;

    // 智能体功能
    function smartVideoAnalysis() {
        if (currentVideo) {
            // 假设进行一些智能分析
            let videoDuration = currentVideo.duration;
            let videoCurrentTime = currentVideo.currentTime;
            console.log(`视频时长: ${videoDuration}, 当前播放时间: ${videoCurrentTime}`);
            // 自动调整速度，举例为简单算法
            if (videoCurrentTime / videoDuration > 0.5) {
                currentVideo.playbackRate = 1.5;  // 观看过半后加速播放
            }
        }
    }

    function togglePlayPause() {
        if (currentVideo) {
            if (currentVideo.paused) {
                currentVideo.play();
                console.log("视频已播放");
                if (smartModeEnabled) smartVideoAnalysis();  // 智能分析
            } else {
                currentVideo.pause();
                console.log("视频已暂停");
            }
        }
    }

    function downloadVideo() {
        if (currentVideo) {
            let videoUrl = currentVideo.currentSrc;
            let a = document.createElement("a");
            a.href = videoUrl;
            a.download = "downloaded_video.mp4";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log("视频已开始下载");
        }
    }

    function adjustSpeed() {
        if (currentVideo) {
            let currentSpeed = currentVideo.playbackRate;
            let newSpeed = prompt(`当前播放速度为${currentSpeed}，请输入新的播放速度：`, "1.0");
            if (newSpeed && !isNaN(newSpeed)) {
                currentVideo.playbackRate = parseFloat(newSpeed);
                console.log(`播放速度已调整为：${newSpeed}`);
            }
        }
    }

    function toggleAdDisplay() {
        if (adDiv.style.display === "none") {
            adDiv.style.display = "block";
        } else {
            adDiv.style.display = "none";
        }
    }

    function showDynamicAd() {
        let adContents = [
            "<p>广告1: 购买新手机</p>",
            "<p>广告2: 最新游戏上线</p>",
            "<p>广告3: 学习编程，改变未来</p>"
        ];
        let randomAd = adContents[Math.floor(Math.random() * adContents.length)];
        adDiv.innerHTML = randomAd;
        adDiv.style.display = "block";
        console.log("动态广告已显示:", randomAd);
    }

    function toggleSmartMode() {
        smartModeEnabled = !smartModeEnabled;
        console.log(`智能体${smartModeEnabled ? "已启用" : "已禁用"}`);
    }

    function promptUserInput() {
        let userInput = prompt("请输入一些内容：");
        if (userInput) {
            console.log("用户输入的内容是: " + userInput);
        }
    }

    function toggleNetworkMonitoring() {
        isNetworkMonitoring = !isNetworkMonitoring;
        console.log(`网络监测${isNetworkMonitoring ? "已启动" : "已停止"}`);
        if (isNetworkMonitoring) {
            setInterval(checkNetworkSpeed, 5000); // 每5秒检测一次网络速度
        }
    }

    function checkNetworkSpeed() {
        // 模拟网络速度检测
        networkSpeed = Math.random() * 100; // 随机生成一个网络速度
        console.log(`当前网络速度: ${networkSpeed.toFixed(2)} Mbps`);
        if (networkSpeed < 5) {
            alert("网络速度较慢，建议下载视频！");
        }
    }

    // 页面加载时初始化
    window.addEventListener("load", function() {
        findVideoElements();  // 寻找视频元素
        createAdElement();  // 初始化广告元素
    });

    function findVideoElements() {
        videoElements = document.querySelectorAll("video");
        if (videoElements.length > 0) {
            currentVideo = videoElements[0];  // 默认选第一个视频
        } else {
            alert("未找到视频元素");
        }
    }

    function createAdElement() {
        adDiv = document.createElement("div");
        adDiv.innerHTML = "<p>这是一个广告</p><img src='https://via.placeholder.com/150' alt='广告图片'>";
        adDiv.style.position = "fixed";
        adDiv.style.top = "200px";
        adDiv.style.left = "10px";
        adDiv.style.zIndex = "9999";
        adDiv.style.backgroundColor = "#f0f0f0";
        adDiv.style.padding = "10px";
        adDiv.style.border = "1px solid #ccc";
        adDiv.style.display = "none";
        document.body.appendChild(adDiv);
    }

})();