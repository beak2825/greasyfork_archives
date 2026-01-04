// ==UserScript==
// @name         网络延时监控|附：外区苹果ID获取|科学上网|点击获取（可查看付费的苹果ID|免费获取小火箭|免费获取clash订阅|免费获取v2ray订阅|获取小火箭IOS订阅|目前订阅9TB流量/月）
// @name:zh-CN   网络延时监控|附：外区苹果ID获取|科学上网|点击获取（可查看付费的苹果ID|免费获取小火箭|免费获取clash订阅|免费获取v2ray订阅|获取小火箭IOS订阅|目前订阅9TB流量/月）
// @name:zh-TW   網絡延時監控|附：外區蘋果ID獲取|科學上網|點擊獲取（可查看付費的蘋果ID|免費獲取小火箭|免費獲取clash訂閱|免費獲取v2ray訂閱|獲取小火箭IOS訂閱|目前訂閱9TB流量/月）
// @name:en         Network Latency Monitor
// @name:ja         ネットワーク遅延モニター
// @name:ko         네트워크 지연 모니터
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description        实用工具-实时监控网络波动，显示在页面底部中心位置，可编辑监控自定义网址。点击获取（可查看付费的苹果ID|免费获取小火箭|免费获取clash订阅|免费获取v2ray订阅|获取小火箭IOS订阅|目前订阅9TB流量/月）
// @description:zh-CN  实用工具-实时监控网络波动，显示在页面底部中心位置，可编辑监控自定义网址。点击获取（可查看付费的苹果ID|免费获取小火箭|免费获取clash订阅|免费获取v2ray订阅|获取小火箭IOS订阅|目前订阅9TB流量/月）
// @description:zh-TW  實用工具-實時監控網絡波動，顯示在頁面底部中心位置，可編輯監控自定義網址。點擊獲取（可查看付費的蘋果ID|免費獲取小火箭|免費獲取clash訂閱|免費獲取v2ray訂閱|獲取小火箭IOS訂閱|目前訂閱9TB流量/月）
// @description:en  Practical tool for real-time monitoring of network fluctuations, displayed at the bottom center of the page, with the ability to edit and customize monitored URLs.
// @description:ja  ネットワークの変動をリアルタイムで監視する実用的なツール。ページの底部中央に表示され、監視対象のURLを編集・カスタマイズできます。
// @description:ko  네트워크 변동을 실시간으로 모니터링하는 실용적인 도구로, 페이지 하단 중앙에 표시되며, 모니터링 대상 URL을 편집하고 사용자 정의할 수 있습니다.
// @author       Nikita
// @match        *://*/*
// @exclude      *://*.hcaptcha.*/*
// @exclude      *://*/captcha/*
// @exclude      *://*/*captcha*
// @exclude      *://*/recaptcha/*
// @exclude      *://*/*recaptcha*
// @exclude      *://*/verification/*
// @exclude      *://*/validate/*
// @exclude      *://*/console/*
// @exclude      *://*/*console*
// @exclude      *://*/vnc/* 
// @exclude      *://*/*vnc*
// @exclude      *://*/auth*
// @exclude      *://*/user*
// @grant        GM_addStyle
// @license      MIT
// @note         23-10-20 1.6.1
// @note         23-08-05 1.5 重构部分代码
// @note         23-08-05 1.4 添加自定义选项
// @note         23-08-05 1.3 排除匹配验证类域名
// @note         23-08-05 1.1 小改动
// @note         23-08-05 1.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/472476/%E7%BD%91%E7%BB%9C%E5%BB%B6%E6%97%B6%E7%9B%91%E6%8E%A7%7C%E9%99%84%EF%BC%9A%E5%A4%96%E5%8C%BA%E8%8B%B9%E6%9E%9CID%E8%8E%B7%E5%8F%96%7C%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%7C%E7%82%B9%E5%87%BB%E8%8E%B7%E5%8F%96%EF%BC%88%E5%8F%AF%E6%9F%A5%E7%9C%8B%E4%BB%98%E8%B4%B9%E7%9A%84%E8%8B%B9%E6%9E%9CID%7C%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%81%AB%E7%AE%AD%7C%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96clash%E8%AE%A2%E9%98%85%7C%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96v2ray%E8%AE%A2%E9%98%85%7C%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%81%AB%E7%AE%ADIOS%E8%AE%A2%E9%98%85%7C%E7%9B%AE%E5%89%8D%E8%AE%A2%E9%98%859TB%E6%B5%81%E9%87%8F%E6%9C%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472476/%E7%BD%91%E7%BB%9C%E5%BB%B6%E6%97%B6%E7%9B%91%E6%8E%A7%7C%E9%99%84%EF%BC%9A%E5%A4%96%E5%8C%BA%E8%8B%B9%E6%9E%9CID%E8%8E%B7%E5%8F%96%7C%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%7C%E7%82%B9%E5%87%BB%E8%8E%B7%E5%8F%96%EF%BC%88%E5%8F%AF%E6%9F%A5%E7%9C%8B%E4%BB%98%E8%B4%B9%E7%9A%84%E8%8B%B9%E6%9E%9CID%7C%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%81%AB%E7%AE%AD%7C%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96clash%E8%AE%A2%E9%98%85%7C%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96v2ray%E8%AE%A2%E9%98%85%7C%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%81%AB%E7%AE%ADIOS%E8%AE%A2%E9%98%85%7C%E7%9B%AE%E5%89%8D%E8%AE%A2%E9%98%859TB%E6%B5%81%E9%87%8F%E6%9C%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
///////////////////////////////  编辑监控自定义  ///////////////////////////////////////////////

    const defaultUrls = [
        { name: '腾讯', url: 'www.qq.com' },                     //自定义监控网址，复制一行重新编辑即可；
        { name: 'GitHub', url: 'api.github.com' },               //自定义监控网址，复制一行重新编辑即可；
        { name: '谷歌', url: 'www.google.com' },                 //自定义监控网址，复制一行重新编辑即可；
    ];

    const opacity = 0.7;                                         //自定义不透明度值(0.0到1.0)； 默认0.6；
    const refreshFrequency = 3000;                               //自定义刷新频率，单位为毫秒，不建议设置小于1000即1秒； 默认3秒/次；
    const borderrgb = 'transparent';                             //自定义边框颜色；默认 透明：transparent； 黑色: black； 白色：white； 蓝色：blue； 红色：red； 绿色：green； 黄色：yellow
    const backgroundColor = `rgba(255, 255, 255, ${opacity})`;   //自定义背景颜色；${opacity})为前面定义的不透明值；网页颜色： https://www.rapidtables.org/zh-CN/web/color/Web_Safe.html

//////////////////////////////////////////////////////////////////////////////////////////////////
const styleElement = document.createElement('style');
styleElement.innerHTML = `
    #latency-display-container {
        display: flex;
        align-items: center;
        background-color: ${backgroundColor};
        padding: 1px 5px;
        border: 1px solid ${borderrgb};
        border-radius: 10px;
        color: black;
        font-size: 9px;
        position: fixed;
        bottom: 3px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        white-space: nowrap;
        }

    #latency-display-container::before {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(255, 255, 255, 1);
        color: black;
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }

    #latency-display-container a {
        color: green;
        font-weight: bold;
    }

    #latency-display-container a:hover {
        text-decoration: none;
    }
`;
    document.head.appendChild(styleElement);

    const usageInstructions = "说明： \n 1. 打开脚本编辑监控自定义网址;\n 2. 实时延时监控刷新 频率3秒/次，数据消耗不到2KB/次；\n 3. 延时信息将显示在底部中心位置，支持左右拖动; \n 4. 0-300ms为深绿色，300-600为绿色，600-1000为黄绿色，1000-2000为橙色，大于2000 红色； \n 5. 点击【获取】（可查看付费ID|获取小火箭|获取clash订阅|获取v2ray订阅）\n 6. 更多 待续更新...\n";

    const currentHost = window.location.hostname;
    defaultUrls.unshift({ name: '本站', url: currentHost });

    let latencyData = {};
    let isDragging = false;
    let offsetX;

    let expanded = true;
    let displayPosition = 'bottom';

    function calculateLatency(url, callback) {
        const startTime = new Date().getTime();
        fetch('https://' + url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
            .then(response => {
                const endTime = new Date().getTime();
                const latency = endTime - startTime;
                callback(url, latency);
            })
            .catch(error => {
                callback(url, 'Timeout');
            });
    }

    function updateLatency() {
        defaultUrls.forEach(item => {
            calculateLatency(item.url, (url, latency) => {
                latencyData[item.name] = latency;
                updateDisplay();
            });
        });
    }

    function updateDisplay() {
        const displayContainer = document.getElementById('latency-display-container');
        if (displayContainer) {
            displayContainer.setAttribute('title', usageInstructions);

            let displayHtml = ``;
            if (expanded) {
                for (const item of defaultUrls) {
                    const name = item.name;
                    const latency = latencyData[name];
                    displayHtml += `${name}: <span style="color: ${getLatencyColor(latency)}; font-weight: bold;">${formatLatency(latency)}</span> | `;
                }
            }
            displayHtml += `<a href="https://free.dabai.in"><span style="color:green ; font-weight: bold;">获取►</span></a>`;

            displayContainer.innerHTML = displayHtml;
        }
    }

    function formatLatency(latency) {
        return latency === 'Timeout' ? '超时' : latency + 'ms';
    }

    function getLatencyColor(latency) {
        if (latency === 'Timeout') {
            return 'gray';
        } else if (latency < 300) {
            return 'darkgreen';
        } else if (latency < 600) {
            return 'green';
        } else if (latency <= 1000) {
            return 'yellowgreen';
        } else if (latency <= 2000) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    function updateDisplayPosition() {
        const displayContainer = document.getElementById('latency-display-container');
        if (displayContainer) {
            if (displayPosition === 'bottom') {
                displayContainer.style.position = 'fixed';
                displayContainer.style.bottom = '10px';
                displayContainer.style.left = '50%';
                displayContainer.style.transform = 'translateX(-50%)';
                displayContainer.style.flexDirection = 'row';
            } else if (displayPosition === 'right') {
                displayContainer.style.position = 'fixed';
                displayContainer.style.top = '50%';
                displayContainer.style.right = '10px';
                displayContainer.style.transform = 'translateY(-50%)';
                displayContainer.style.flexDirection = 'column';
            } else if (displayPosition === 'left') {
                displayContainer.style.position = 'fixed';
                displayContainer.style.top = '50%';
                displayContainer.style.left = '10px';
                displayContainer.style.transform = 'translateY(-50%)';
                displayContainer.style.flexDirection = 'column';
            }
                displayContainer.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - displayContainer.getBoundingClientRect().left;
        });
                window.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const left = event.clientX - offsetX;
                displayContainer.style.left = left + 'px';
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        }
    }

    const displayContainer = document.createElement('div');
    displayContainer.id = 'latency-display-container';
    document.body.appendChild(displayContainer);

    if (window.self === window.top) {
        updateDisplayPosition();
        setInterval(updateLatency,refreshFrequency);
        updateLatency();
    }
})();
