// ==UserScript==
// @name         Save URL to API(bilibili)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Click the "Save" button to send the current URL to the API.
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520222/Save%20URL%20to%20API%28bilibili%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520222/Save%20URL%20to%20API%28bilibili%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #bilibili-note-panel {
          position: absolute;
          z-index: 9999;
          background-color: #f0f0f0;
          color: #333;
          border: 1px solid #ccc;
          padding: 5px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          opacity: 0.9;
          min-width: 150px;
          max-width: 200px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        #bilibili-note-panel.active {
          transform: scale(1.05);
          opacity: 1;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        #bilibili-note-button {
          background-color: #FFB6C1;
          border: none;
          color: white;
          padding: 8px 16px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          margin: 0;
          cursor: pointer;
          border-radius: 6px;
          transition: background-color 0.3s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
          animation: button-pulse 1s infinite;
        }

        #bilibili-note-button:hover {
          background-color: #FF80AB;
        }

        @keyframes button-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        #save-url-button {
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 8px 16px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 6px;
        }
    `);

    // 创建面板
    const panel = document.createElement('div');
    panel.id = 'bilibili-note-panel';
    document.body.appendChild(panel);

    // 创建 "Save" 按钮
    const saveButton = document.createElement('button');
    saveButton.id = 'save-url-button';
    saveButton.textContent = 'Save URL';
    panel.appendChild(saveButton);

    // 设置面板初始位置
    panel.style.top = '10px';
    panel.style.right = '10px';

    // 点击 "Save" 按钮事件
    saveButton.addEventListener('click', function() {
        const currentUrl = window.location.href;

        // 构建要发送的数据, 新增种类 bilibiliurl
        const data = {
            "api_endpoint": "url", // 你可以根据需要修改这个值
            "fixed_value": {
                "url": currentUrl,
                "type": "bilibili_latest_Episode"
            }
        };

        // 发送 POST 请求到 API
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:8964/update_api", // API 服务器地址
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            onload: function(response) {
                console.log("API response:", response.responseText);
                if (response.status >= 200 && response.status < 300) {
                    saveButton.textContent = 'Saved!';
                    setTimeout(() => {
                        saveButton.textContent = 'Save URL';
                    }, 2000);
                } else {
                    saveButton.textContent = 'Error!';
                    setTimeout(() => {
                        saveButton.textContent = 'Save URL';
                    }, 2000);
                }
            },
            onerror: function(error) {
                console.error("API request failed:", error);
                saveButton.textContent = 'Error!';
                setTimeout(() => {
                    saveButton.textContent = 'Save URL';
                }, 2000);
            }
        });
    });
})();