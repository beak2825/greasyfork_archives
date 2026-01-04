// ==UserScript==
// @name          Microsoft Rewards reminder
// @name:zh-CN Microsoft Rewards reminder
// @namespace  http://tampermonkey.net/
// @version       1.5
// @description  This userscript automatically checks if you have visited a specified webpage each day (default is [Bing Rewards](https://rewards.bing.com/)).  
// @author        FZXG.dev & OpenAI
// @description:zh-CN        每天弹窗提示用户访问指定网页，点击跳转（在新窗口中）后记录，不跳转则明天继续提醒；使用 GM 存储 API；带关闭按钮。
// @match        *://*/*
// @match        https://rewards.bing.com/*
// @grant         GM.getValue
// @grant         GM.setValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/543186/Microsoft%20Rewards%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/543186/Microsoft%20Rewards%20reminder.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const targetURL = 'https://rewards.bing.com/'; // 👉 替换为你希望跳转的网址
    const storageKey = 'dailyVisitConfirmed';

    const today = new Date();
    const localDate = today.toISOString().split('T')[0]; // 注意：还是 UTC 日期！

    // 正确方式（本地时区）：
    const localDateString = today.getFullYear() + '-' +
          String(today.getMonth() + 1).padStart(2, '0') + '-' +
          String(today.getDate()).padStart(2, '0');

    // 先读GM存储中的访问日期，访问过当天就不弹窗
    const visitedDate = await GM.getValue(storageKey, null);
    if (visitedDate === localDateString) return; // 今天已访问过，直接退出

    // 读OsType判断风格，默认win
    const osType = await GM.getValue('OsType', 'win');

    if (osType === 'mac') {
        showMacModal();
    } else {
        showWinModal();
    }

    // ==========================
    // Win11风格弹窗
    function showWinModal() {
        injectWinStyle();

        const modal = document.createElement('div');
        modal.innerHTML = `
        <div id="popup-overlay">
            <div id="win11-modal">
                <p>今天你还没有访问：<br><strong>${targetURL}</strong></p>
                <button id="goto-btn">点击前往</button>
                <button id="close-btn">关闭</button>
            </div>
        </div>`;
        document.body.appendChild(modal);

        document.getElementById('goto-btn').addEventListener('click', async () => {
            await GM.setValue(storageKey, localDateString);
            window.open(targetURL, '_blank');
            closeModalWin();
        });

        document.getElementById('close-btn').addEventListener('click', () => {
            closeModalWin();
        });

        function closeModalWin() {
            const modalEl = document.getElementById('win11-modal');
            const overlay = document.getElementById('popup-overlay');
            modalEl.classList.add('hide');
            setTimeout(() => overlay.remove(), 200);
        }
    }

    function injectWinStyle() {
        const style = document.createElement('style');
        style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
        }
        #popup-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            display: flex;
            justify-content: center;
            align-items: start;
            padding-top: 20vh;
            background-color: rgba(0, 0, 0, 0);
            z-index: 9999;
        }
        #win11-modal {
            animation: fadeIn 0.3s ease-out forwards;
            background: #fefefe;
            border: 1px solid #d0d0d0;
            padding: 24px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            font-family: 'Segoe UI', sans-serif;
            text-align: center;
            width: 320px;
            max-width: 90vw;
            box-sizing: border-box;
            color: #1f1f1f;
        }
        #win11-modal.hide {
            animation: fadeOut 0.2s ease-in forwards;
        }
        #win11-modal p {
            font-size: 15px;
            margin-bottom: 20px;
        }
        #win11-modal button {
            font-size: 14px;
            padding: 10px 18px;
            margin: 0 5px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        #goto-btn {
            background-color: #0078d4;
            color: white;
        }
        #goto-btn:hover {
            background-color: #005a9e;
        }
        #close-btn {
            background-color: #e5e5e5;
            color: #333;
        }
        #close-btn:hover {
            background-color: #d0d0d0;
        }
        `;
        document.head.appendChild(style);
    }

    // ==========================
    // macOS风格弹窗
    function showMacModal() {
        injectMacStyle();

        const modal = document.createElement('div');
        modal.innerHTML = `
        <div id="popup-overlay">
            <div id="macos-modal">
                <p>今天你还没有访问：<br><strong>${targetURL}</strong></p>
                <button id="goto-btn">点击前往</button>
                <button id="close-btn">关闭</button>
            </div>
        </div>`;
        document.body.appendChild(modal);

        document.getElementById('goto-btn').addEventListener('click', async () => {
            await GM.setValue(storageKey, localDateString);
            window.open(targetURL, '_blank');
            closeModalMac();
        });

        document.getElementById('close-btn').addEventListener('click', () => {
            closeModalMac();
        });

        function closeModalMac() {
            const modalEl = document.getElementById('macos-modal');
            const overlay = document.getElementById('popup-overlay');
            modalEl.classList.add('hide');
            setTimeout(() => overlay.remove(), 200);
        }
    }

    function injectMacStyle() {
        const style = document.createElement('style');
        style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
        }
        #popup-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            display: flex;
            justify-content: center;
            align-items: start;
            padding-top: 20vh;
            background-color: rgba(0, 0, 0, 0.12);
            backdrop-filter: blur(12px);
            z-index: 9999;
        }
        #macos-modal {
            animation: fadeIn 0.3s ease-out forwards;
            background: rgba(255 255 255 / 0.85);
            border-radius: 20px;
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
            padding: 28px 32px;
            width: 320px;
            max-width: 90vw;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
              Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            color: #1c1c1e;
            text-align: center;
            user-select: none;
            box-sizing: border-box;
            backdrop-filter: saturate(180%) blur(20px);
            border: 1px solid rgba(255 255 255 / 0.5);
        }
        #macos-modal.hide {
            animation: fadeOut 0.2s ease-in forwards;
        }
        #macos-modal p {
            font-size: 16px;
            margin-bottom: 24px;
            font-weight: 500;
        }
        #macos-modal button {
            font-size: 15px;
            font-weight: 600;
            padding: 11px 24px;
            border-radius: 14px;
            border: none;
            cursor: pointer;
            transition: background-color 0.25s ease, box-shadow 0.25s ease;
            user-select: none;
            min-width: 100px;
            margin: 0 8px;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.08) inset;
            background-color: rgba(0,0,0,0.05);
            color: #1c1c1e;
        }
        #macos-modal button#goto-btn {
            background: linear-gradient(180deg, #007aff 0%, #0051a8 100%);
            color: white;
            box-shadow:
                0 0 8px #007aff88,
                inset 0 1px 0 rgba(255 255 255 0.3);
        }
        #macos-modal button#goto-btn:hover {
            background: linear-gradient(180deg, #1a8cff 0%, #0062cc 100%);
            box-shadow:
                0 0 12px #1a8cffcc,
                inset 0 1px 0 rgba(255 255 255 0.4);
        }
        #macos-modal button#close-btn {
            background-color: transparent;
            color: #6e6e73;
            box-shadow: none;
        }
        #macos-modal button#close-btn:hover {
            background-color: rgba(0,0,0,0.07);
            color: #1c1c1e;
        }
        `;
        document.head.appendChild(style);
    }

})();
