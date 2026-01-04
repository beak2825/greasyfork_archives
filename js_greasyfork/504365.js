// ==UserScript==
// @name         2048自动回贴刷新
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  自动回帖后刷新
// @author       zzx114
// @include      *://*2048.com/read.php?tid=*
// @exclude      *://*2048.com/read.php?tid=*&*
// @match        *://*/2048/read.php?tid=*
// @exclude      *://*/2048/read.php?tid=*&*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/504365/2048%E8%87%AA%E5%8A%A8%E5%9B%9E%E8%B4%B4%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/504365/2048%E8%87%AA%E5%8A%A8%E5%9B%9E%E8%B4%B4%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {

    // 添加样式
    GM_addStyle(`
        #settingsDiv {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            padding: 20px;
            background: white;
            border: 1px solid #000;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 1000;
            text-align: center;
        }
        #settingsDiv h3 {
            margin-top: 0;
        }
        #settingsDiv label {
            display: block;
            margin: 10px 0;
        }
        #settingsDiv button {
            margin-top: 20px;
        }
    `);

    // 注册设置菜单命令
    GM_registerMenuCommand("自动回贴刷新设置", showSettings);

    // 设置变量
    let settingsDiv = null;
    const useAlertKey = 'useAlert';
    const useConsoleKey = 'useConsole';
    const defaultUseAlert = true; // 默认使用 alert
    const defaultUseConsole = false; // 默认不使用 console.log
    const replyIntervalKey = 'replyInterval'; // 自定义回复间隔的键
    const defaultReplyInterval = 120; // 默认回复间隔时间（120秒）

    // 显示设置界面
    function showSettings() {
        if (settingsDiv) {
            settingsDiv.style.display = settingsDiv.style.display === 'block' ? 'none' : 'block';
            return;
        }

        settingsDiv = document.createElement('div');
        settingsDiv.id = 'settingsDiv';
        settingsDiv.innerHTML = `
            <h3>自动回贴刷新设置</h3>
            <label><input type="checkbox" id="useAlertCheckbox"> 使用 alert 显示消息</label>
            <label><input type="checkbox" id="useConsoleCheckbox"> 使用 console.log 显示消息</label>
            <label><input type="number" id="replyIntervalInput" placeholder="秒" min="10" max="3600"> 回复间隔（秒）</label>
            <button id="saveSettings">保存设置</button>
        `;

        document.body.appendChild(settingsDiv);

        // 初始化复选框状态
        document.getElementById('useAlertCheckbox').checked = GM_getValue(useAlertKey, defaultUseAlert);
        document.getElementById('useConsoleCheckbox').checked = GM_getValue(useConsoleKey, defaultUseConsole);
        // 初始化自定义回复间隔
        document.getElementById('replyIntervalInput').value = GM_getValue(replyIntervalKey, defaultReplyInterval);

        // 保存设置按钮事件
        document.getElementById('saveSettings').addEventListener('click', () => {
            GM_setValue(useAlertKey, document.getElementById('useAlertCheckbox').checked);
            GM_setValue(useConsoleKey, document.getElementById('useConsoleCheckbox').checked);
            GM_setValue(replyIntervalKey, parseInt(document.getElementById('replyIntervalInput').value, 10) || defaultReplyInterval);
            settingsDiv.style.display = 'none';
        });
    }

    // 显示消息的函数，根据设置使用alert或console.log
    function displayMessage(message) {
        const useAlert = GM_getValue(useAlertKey, defaultUseAlert);
        const useConsole = GM_getValue(useConsoleKey, defaultUseConsole);
        if (useAlert) {
            alert(message);
        }
        if (useConsole) {
            console.log(message);
        }
    }
    // 获取当前 tid
    function getCurrentTid() {
        let m = location.search.match(/tid=(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
    }

    const lastTidKey = "lastReplyTid";
    let currentTid = getCurrentTid();
    let lastTid = parseInt(GM_getValue(lastTidKey, 0), 10);

    // 如果当前 tid <= 上次 tid，直接退出
    if (currentTid <= lastTid) {
        console.log("当前 tid =", currentTid, "，上次 tid =", lastTid, " → 不执行回复");
        return;
    }

    // 自动回贴逻辑
    const replyMessage = "路过顶帖，感谢分享。";
    const lastRunKey = "lastRunTime";

    let lastRunTime = parseInt(GM_getValue(lastRunKey, 0), 10);
    let now = new Date().getTime();
    // 如果时间差小于10秒，则直接退出脚本执行
    if (now - lastRunTime < 10000) {
        return;
    }
    let replyInterval = GM_getValue(replyIntervalKey, defaultReplyInterval) * 1000; // 转换为毫秒
    if (now - lastRunTime >= replyInterval) {
        GM_setValue(lastRunKey, now);
        // 检测页面上是否已存在回复内容
        const existingReplies = document.querySelectorAll("#main > div:nth-child(18)"); // 替换为实际的回复内容选择器
        let isReplyPresent = false;
        existingReplies.forEach((reply) => {
            if (reply.textContent.includes(replyMessage)) {
                isReplyPresent = true;
                return;
            }
        });

        if (!isReplyPresent) {
            setTimeout(() => {
             // const replyButton = document.querySelector("#reply-button"); // 替换为实际的回复按钮选择器
             // if (replyButton) {
            //      replyButton.click();
           //   }

                const replyInput = document.querySelector("textarea#textarea");
                if (replyInput) {
                    replyInput.value = replyMessage;
                } else {
                    alert("没有找到回复输入框！");
                    return;
                }

                const submitButton = document.querySelector("input.btn");
                if (submitButton) {
                const signWin = window.open("https://hjd2048.com/2048/hack.php?H_name=qiandao", "_blank");

                // 回复成功时保存当前 tid
                submitButton.addEventListener("click", () => {
                GM_setValue(lastTidKey, currentTid);
                }, { once: true });

                setTimeout(() => {
                    submitButton.click();
            }, 1000);
        }
            }, 2000); // 等待2秒后再回复

        } else {
            return;
        }
    } else {
        displayMessage("距离上次自动回复没有超过" + replyInterval / 1000 + "秒，请刷新重试");
    }
})();