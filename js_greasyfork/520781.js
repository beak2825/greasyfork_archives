// ==UserScript==
// @name         mumu-DNS测速测试面板
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  DNS服务器测速自动化测试工具
// @author       mumu
// @match        https://www.cesu.net/dns/*
// @license MIT
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520781/mumu-DNS%E6%B5%8B%E9%80%9F%E6%B5%8B%E8%AF%95%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/520781/mumu-DNS%E6%B5%8B%E9%80%9F%E6%B5%8B%E8%AF%95%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本开始运行');

    // 从localStorage读取配置
    const config = {
        urls: localStorage.getItem('dnsTest_urls') || 'www.baidu.com\nwww.qq.com',
        dnsServers: localStorage.getItem('dnsTest_dnsServers') || '114.114.114.114\n8.8.8.8',
        interval: localStorage.getItem('dnsTest_interval') || '60',
        smallInterval: localStorage.getItem('dnsTest_smallInterval') || '3',
        isRunning: localStorage.getItem('dnsTest_isRunning') === 'true',
        currentUrlIndex: parseInt(localStorage.getItem('dnsTest_currentUrlIndex') || '0'),
        currentDnsIndex: parseInt(localStorage.getItem('dnsTest_currentDnsIndex') || '0'),
        lastRoundTime: parseInt(localStorage.getItem('dnsTest_lastRoundTime') || '0'),
        roundCount: parseInt(localStorage.getItem('dnsTest_roundCount') || '0')
    };

    const panel = document.createElement('div');
panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 300px;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-radius: 8px;
`;

// 按钮样式
const buttonStyle = `
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
`;

panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #333;">DNS测速面板</h3>
        <div style="font-size: 12px; color: #666;">v1.0</div>
    </div>
    <div style="margin-bottom: 10px;">
        <div style="margin-bottom: 5px; color: #444;">目标网址(每行一个):</div>
        <textarea id="targetUrls" style="width: 100%; height: 60px; border-radius: 4px; border: 1px solid #ddd; padding: 5px;">${config.urls}</textarea>
    </div>
    <div style="margin-bottom: 10px;">
        <div style="margin-bottom: 5px; color: #444;">DNS服务器(每行一个):</div>
        <textarea id="dnsServers" style="width: 100%; height: 60px; border-radius: 4px; border: 1px solid #ddd; padding: 5px;">${config.dnsServers}</textarea>
    </div>
    <div style="margin-bottom: 10px;">
        <div style="margin-bottom: 5px; color: #444;">轮次间隔时间(秒):</div>
        <input type="number" id="interval" value="${config.interval}" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
    </div>
    <div style="margin-bottom: 10px;">
        <div style="margin-bottom: 5px; color: #444;">检测间隔时间(秒):</div>
        <input type="number" id="smallInterval" value="${config.smallInterval}" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
    </div>
    <div style="text-align: center; margin: 15px 0;">
        <button id="startBtn" style="${buttonStyle} background: #4CAF50; color: white; margin-right: 10px;">${config.isRunning ? '运行中...' : '开始'}</button>
        <button id="stopBtn" style="${buttonStyle} background: #f44336; color: white;">停止</button>
    </div>
    <div id="status" style="margin-top: 10px; color: #666; padding: 5px; background: #f5f5f5; border-radius: 4px;"></div>
    <div id="log" style="margin-top: 10px; max-height: 200px; overflow-y: auto; font-size: 12px; background: #f8f8f8; padding: 5px; border-radius: 4px;"></div>
`;

    document.body.appendChild(panel);

    const statusDiv = panel.querySelector('#status');
    const logDiv = panel.querySelector('#log');
    const startBtn = panel.querySelector('#startBtn');

function addLog(message) {
    const time = new Date().toLocaleTimeString();
    const logItem = document.createElement('div');
    logItem.textContent = `[${time}] ${message}`;
    logDiv.appendChild(logItem); // 改为 appendChild，这样新日志会添加到末尾
    logDiv.scrollTop = logDiv.scrollHeight; // 自动滚动到底部
    console.log(`[${time}] ${message}`);
}


    function saveConfig() {
        localStorage.setItem('dnsTest_urls', document.getElementById('targetUrls').value);
        localStorage.setItem('dnsTest_dnsServers', document.getElementById('dnsServers').value);
        localStorage.setItem('dnsTest_interval', document.getElementById('interval').value);
        localStorage.setItem('dnsTest_smallInterval', document.getElementById('smallInterval').value);
        localStorage.setItem('dnsTest_isRunning', config.isRunning);
        localStorage.setItem('dnsTest_currentUrlIndex', config.currentUrlIndex);
        localStorage.setItem('dnsTest_currentDnsIndex', config.currentDnsIndex);
        localStorage.setItem('dnsTest_lastRoundTime', config.lastRoundTime);
        localStorage.setItem('dnsTest_roundCount', config.roundCount);
    }

    // 等待指定时间
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 等待测试结果
    const waitForResult = () => new Promise((resolve) => {
        let checkResultInterval = setInterval(() => {
            let resultElement = document.querySelector('.result-item');
            if (resultElement) {
                clearInterval(checkResultInterval);
                clearTimeout(timeoutHandler);
                resolve();
            }
        }, 100);

        let timeoutHandler = setTimeout(() => {
            clearInterval(checkResultInterval);
            resolve();
        }, 10000);
    });

    async function runSingleTest() {
        if (!config.isRunning) return;

        const urls = document.getElementById('targetUrls').value.split('\n').filter(url => url.trim());
        const dnsServers = document.getElementById('dnsServers').value.split('\n').filter(dns => dns.trim());
        const now = Date.now();
        const interval = parseInt(document.getElementById('interval').value) * 1000;
        const smallInterval = parseInt(document.getElementById('smallInterval').value) * 1000;

        // 检查是否完成一轮测试
        if (config.currentUrlIndex >= urls.length) {
            config.currentUrlIndex = 0;
            config.currentDnsIndex = 0;
            config.lastRoundTime = now;
            config.roundCount++;
            saveConfig();

            addLog(`完成第 ${config.roundCount} 轮测试`);
            addLog(`等待开始下一轮测试...`);

            let remainingSeconds = Math.ceil(interval / 1000);
            const updateCountdown = async () => {
                while (remainingSeconds > 0 && config.isRunning) {
                    statusDiv.textContent = `等待 ${remainingSeconds} 秒后开始下一轮...`;
                    await sleep(1000);
                    remainingSeconds--;
                }
            };
            await updateCountdown();

            if (config.isRunning) {
                addLog(`开始第 ${config.roundCount + 1} 轮测试`);
                runSingleTest();
            }
            return;
        }

        if (config.currentDnsIndex >= dnsServers.length) {
            config.currentDnsIndex = 0;
            config.currentUrlIndex++;
            saveConfig();
            addLog(`不知道的等1...`);
            //await sleep(smallInterval);
            runSingleTest();
            return;
        }

        const currentUrl = urls[config.currentUrlIndex].trim();
        const currentDns = dnsServers[config.currentDnsIndex].trim();



        statusDiv.textContent = `第 ${config.roundCount + 1} 轮测试: ${currentUrl} - ${currentDns}`;
        addLog(`测试: ${currentUrl} - ${currentDns}`);

        // 填写表单
        document.querySelector("#host").value = currentUrl;
        document.querySelector("#dns_server").value = currentDns;

        // 更新索引
        config.currentDnsIndex++;
        saveConfig();

        addLog(`dns小等 ${smallInterval/1000}秒`);
        // 等待小间隔时间
        await sleep(smallInterval);

        // 点击开始按钮
        //document.querySelector("#screenshots > div > div > div > div:nth-child(2) > div > div.row.align-items-center.mt-3 > div > div:nth-child(1) > button").click();
        check_form()
        // 等待测试完成
        await waitForResult();



        // 继续下一次测试
        if (config.isRunning) {
            runSingleTest();
        }
    }

    startBtn.addEventListener('click', function() {
        config.isRunning = true;
        config.currentUrlIndex = 0;
        config.currentDnsIndex = 0;
        config.lastRoundTime = 0;
        config.roundCount = 0;
        startBtn.textContent = '运行中...';
        saveConfig();
        addLog('开始测试任务');
        addLog(`开始第 ${config.roundCount + 1} 轮测试`);
        runSingleTest();
    });

    document.getElementById('stopBtn').addEventListener('click', function() {
        config.isRunning = false;
        startBtn.textContent = '开始';
        saveConfig();
        addLog('测试任务已停止');
        statusDiv.textContent = '已停止';
    });

    if (config.isRunning) {
        addLog('继续上次的测试任务');
        runSingleTest();
    }
})();
