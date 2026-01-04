// ==UserScript==
// @name         猫站自动摇摇乐
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  随便搞得答辩代码，只为了实现猫站摇摇乐自动抽奖解放双手。默认5秒钟抽一次 5分钟刷新一次页面。需要改时间的可以自己调
// @author       You
// @match        https://pterclub.com/slot/index.html?slot-202305082233
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pterclub.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472410/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E6%91%87%E6%91%87%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/472410/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E6%91%87%E6%91%87%E4%B9%90.meta.js
// ==/UserScript==

let clickIntervalId, refreshIntervalId;

function clickButton() {
    const button = document.querySelector('.absolute.-top-155px.-right-65px.w-80px.h-80px.border-5px.border-dark.rounded-full.bg-red-400.cursor-pointer.transition-all.duration-500ms.ease-out.animate-ball-light');
    if (button) {
        button.click();
        checkWin();
    }
}

function refreshPage() {
    location.reload();
}

function startScript(clickInterval, refreshInterval) {
    clickIntervalId = setInterval(clickButton, clickInterval);
    refreshIntervalId = setInterval(refreshPage, refreshInterval);
}

function stopScript() {
    clearInterval(clickIntervalId);
    clearInterval(refreshIntervalId);
}

function checkWin() {
    const winElement = document.querySelector('.ml-4.text-lg[data-v-f4cc28e4]');
    if (winElement && winElement.textContent === '获得欧皇大徽章，如已有欧皇大徽章将获得 100,000 克猫粮') {
        alert('抽中欧皇大徽章，自动停止抽奖。');
        stopScript();
    }
}

window.onload = function() {
    GM_addStyle(`
        #controlPanel {
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            border: 2px solid gray;
            padding: 10px;
            text-align: left;
            z-index: 99999;
            display: none;
            width: 200px;
        }
        #controlPanel .row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        #controlPanel .row label {
            margin-left: 5px;
        }
        #controlPanel input[type="text"] {
            border: 1px solid gray;
            margin-top: 5px;
            display: block;
        }
        #saveSettings {
            background-color: skyblue;
            color: white;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            margin-top: 10px;
        }
        #togglePanel {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background-color: blue;
            color: white;
            padding: 5px 10px;
            z-index: 99999;
            cursor: pointer;
        }
    `);

    const controlPanel = document.createElement('div');
    controlPanel.id = 'controlPanel';
    controlPanel.innerHTML = `
        <div class="row">
            <input type="checkbox" id="toggleScript" ${localStorage.getItem('toggleScript') === 'true' ? 'checked' : ''} />
            <label for="toggleScript">启动脚本</label>
        </div>
        <label for="clickInterval">点击间隔（秒）</label>
        <input type="text" id="clickInterval" value="${localStorage.getItem('clickInterval') || '5'}" />
        <label for="refreshInterval">刷新间隔（分钟）</label>
        <input type="text" id="refreshInterval" value="${localStorage.getItem('refreshInterval') || '5'}" />
        <button id="saveSettings">保存设定</button>
    `;
    document.body.appendChild(controlPanel);

    const togglePanel = document.createElement('div');
    togglePanel.id = 'togglePanel';
    togglePanel.innerText = '显示/隐藏控制面板';
    document.body.appendChild(togglePanel);

    togglePanel.addEventListener('click', function() {
        const display = controlPanel.style.display;
        controlPanel.style.display = display === 'none' ? 'block' : 'none';
    });

    document.getElementById('saveSettings').addEventListener('click', function() {
        const toggleScript = document.getElementById('toggleScript').checked;
        let clickInterval = parseInt(document.getElementById('clickInterval').value);
        let refreshInterval = parseInt(document.getElementById('refreshInterval').value);

        if (isNaN(clickInterval) || isNaN(refreshInterval)) {
            alert('输入无效，请输入数字。');
            return;
        }

        localStorage.setItem('toggleScript', toggleScript);
        localStorage.setItem('clickInterval', clickInterval);
        localStorage.setItem('refreshInterval', refreshInterval);

        clickInterval *= 1000; // convert to milliseconds
        refreshInterval *= 60000; // convert to milliseconds

        if (toggleScript) {
            startScript(clickInterval, refreshInterval);
                } else {
            stopScript();
        }

        controlPanel.style.display = 'none'; // hide control panel after saving settings
    });

    // Automatically click the save settings button on page load
    document.getElementById('saveSettings').click();
}