// ==UserScript==
// @name         快手自动讲解助手（更新时间：2024.02.05）
// @namespace    com.kwaixiaodian.zs.page.helper1111
// @version      3.0
// @description  在网页上自动发送话术，并判断是否正在讲解
// @author       图南
// @icon         https://static.neituixiaowangzi.com/company/2017/10-28/080930344531413631.png
// @match        https://zs.kwaixiaodian.com/page/helper
// @grant        none
// @license      MIT  
// @downloadURL https://update.greasyfork.org/scripts/475371/%E5%BF%AB%E6%89%8B%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3%E5%8A%A9%E6%89%8B%EF%BC%88%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4%EF%BC%9A20240205%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/475371/%E5%BF%AB%E6%89%8B%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3%E5%8A%A9%E6%89%8B%EF%BC%88%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4%EF%BC%9A20240205%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const settingsDiv = document.createElement('div');
    settingsDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px;
    z-index: 9999;
  `;
    settingsDiv.innerHTML = `
    <h2><strong>快手自动讲解助手1.6 </strong></h2>

    <label>话术列表（每行一个）：</label>
    <br>
    <textarea id="huashuList" rows="5" cols="50" style="resize: none;"></textarea>
    <br>
    <label>发送话术间隔（秒）：</label>
    <input type="number" id="sendInterval" min="1" value="10" />
    <br>
    <label>检测讲解间隔（秒）：</label>
    <input type="number" id="detectInterval" min="1" value="5" />
    <br>
    <label>页面刷新间隔（分钟）：</label>
    <input type="number" id="refreshInterval" min="1" value="10" />
    <br>
    <label>商品序号：</label>
    <input type="number" id="productIndex" min="1" placeholder="序号" style="margin-top: 10px;">
    <br>
    <br>
    <button id="startBtn">开始运行</button>
    <button id="stopBtn">停止运行</button>
    <br>
    <br>
    <h5>作者：图南 微信：xuhuanshan001 </h5>
  `;
    document.body.appendChild(settingsDiv);
    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
  #huashuList, #sendInterval, #detectInterval, #refreshInterval ,#productIndex{
    border: 1px solid #ccc !important;
  }
  #sendInterval, #detectInterval, #refreshInterval ,#productIndex{
    width: 50px;
    margin-right: 10px;
}
`;
    document.head.appendChild(inputStyle);

    const huashuListTextarea = document.getElementById('huashuList');
    const sendIntervalInput = document.getElementById('sendInterval');
    const detectIntervalInput = document.getElementById('detectInterval');
    const refreshIntervalInput = document.getElementById('refreshInterval');
    const productIndexInput = document.getElementById('productIndex');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');

    // 加载保存的设置
    huashuListTextarea.value = localStorage.getItem('huashuList') || '';
    sendIntervalInput.value = localStorage.getItem('sendInterval') || '188';
    detectIntervalInput.value = localStorage.getItem('detectInterval') || '18';
    refreshIntervalInput.value = localStorage.getItem('refreshInterval') || '20';

    let sendHuashuTimeout;
    let detectAndClickTimeout;
    let refreshTimeout;

    startBtn.addEventListener('click', () => {
        let huashu = huashuListTextarea.value.split('\n').filter(line => line.trim() !== '');
        let sendInterval = parseInt(sendIntervalInput.value) * 1000;
        let detectInterval = parseInt(detectIntervalInput.value) * 1000;
        let refreshInterval = parseInt(refreshIntervalInput.value) * 60000;
        let productIndex = parseInt(productIndexInput.value);

        // 保存设置
        localStorage.setItem('huashuList', huashuListTextarea.value);
        localStorage.setItem('sendInterval', sendIntervalInput.value);
        localStorage.setItem('detectInterval', detectIntervalInput.value);
        localStorage.setItem('refreshInterval', refreshIntervalInput.value);

        if (event.isTrusted) localStorage.removeItem('lineIndex');
        let lineIndex = parseInt(localStorage.getItem('lineIndex')) || 0;

        async function sendHuashu() {
            try {


                const inputElement = document.querySelector('div.text-input--pn04f input.ant-input-borderless');
                if (inputElement && lineIndex < huashu.length) {
                    // 清空输入框
                    inputElement.value = '';
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));

                    // 使用下面这行代码替换原本设置 inputElement.value 的代码
                    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(inputElement, huashu[lineIndex]);
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));

                    // 等待一秒后再点击发送按钮
                    setTimeout(() => {
                 //发送按钮
                        const sendButton = document.querySelector('div.text-input--pn04f button.ant-btn-primary');

                        if (sendButton) {
                            sendButton.click();
                        }
                    }, 1000);

                    lineIndex = (lineIndex + 1) % huashu.length;
                    localStorage.setItem('lineIndex', lineIndex);
                }

                sendHuashuTimeout = setTimeout(sendHuashu, sendInterval);

            } catch (error) {
                console.error('sendHuashu error:', error);
                updateStatus('遇到故障', error.message);
            }
        }




       async function detectAndClick() {
    try {
        const endBtnText = "结束讲解";
        const endBtnXPath = `//span[text()='${endBtnText}']`;
        const endBtn = document.evaluate(endBtnXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!endBtn) {
            const startBtnXPath = `//button[@class='ant-btn btn--JXmnr do-not-drag-me loading-color-fix--TUm9i']/span[text()='开始讲解' and ancestor::div[@data-index='${productIndex-1}']]`;
            const startBtn = document.evaluate(startBtnXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (startBtn) {
                startBtn.click();
            }
        }
        detectAndClickTimeout = setTimeout(detectAndClick, detectInterval);
    } catch (error) {
        console.error('detectAndClick error:', error);
        updateStatus('遇到故障', error.message);
    }
}
        function refreshPage() {
            location.reload();
            setTimeout(() => {
                const inputElement = document.querySelector('div.reply-all--i7FFC input.ant-input');
                if (!inputElement) {
                    refreshTimeout = setTimeout(refreshPage, refreshInterval);
                }
            }, 5000);
        }



        clearTimeout(sendHuashuTimeout);
        clearTimeout(detectAndClickTimeout);
        clearTimeout(refreshTimeout);

        sendHuashu();
        detectAndClick();
        refreshTimeout = setTimeout(refreshPage, refreshInterval);
    });


    stopBtn.addEventListener('click', () => {
        clearTimeout(sendHuashuTimeout);
        clearTimeout(detectAndClickTimeout);
        clearTimeout(refreshTimeout);
        localStorage.removeItem('lineIndex'); // 添加这行代码以删除保存的 lineIndex
    });

    // 如果之前保存的lineIndex不为null，说明脚本之前在运行
    if (localStorage.getItem('lineIndex') !== null) {
        startBtn.click();
    }
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  z-index: 9999;
  color: black; /* 初始颜色 */
`;
    statusDiv.innerHTML = `
  <h3>脚本状态</h3>
  <div id="scriptStatus"><strong>未运行</strong></div>
`;
    document.body.appendChild(statusDiv);

    const scriptStatusDiv = document.getElementById('scriptStatus');


    function updateStatus(status, error) {
        scriptStatusDiv.innerText = status;
        if (error) {
            scriptStatusDiv.innerText += `: ${error}`;
        }
        if (status === '运行中') {
            scriptStatusDiv.style.color = 'green';
        } else if (status === '已停止') {
            scriptStatusDiv.style.color = 'red';
        } else if (status === '遇到故障') {
            scriptStatusDiv.style.color = 'orange';
        } else {
            scriptStatusDiv.style.color = 'blue';
        }
    }
    startBtn.addEventListener('click', () => {
        updateStatus('运行中');
    });

    stopBtn.addEventListener('click', () => {
        updateStatus('已停止');
    });

    if (localStorage.getItem('lineIndex') !== null) {
        startBtn.click();
        updateStatus('运行中');
    }
})();
