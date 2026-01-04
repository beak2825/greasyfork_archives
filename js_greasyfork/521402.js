// ==UserScript==
// @name         Swag.live Downloader
// @name:ZH-CN   Swag 下载器
// @name:zh-TW   Swag 下載器
// @description  This is a video downloader for theswag.live website.
// @description:zh-TW  下载已经在 swag 上购买的视频(Token 登錄專用)
// @description:zh-CN 下载已经在 swag 上购买的视频(Token 专用)
// @namespace    https://swag.heyra.uk/
// @version      1.1
// @author       Swager
// @match        *://*swag.live/archive?*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://swag.heyra.uk/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/521402/Swaglive%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/521402/Swaglive%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create floating button
    const floatingBtn = document.createElement('div');
    floatingBtn.id = 'floating-icon';
    floatingBtn.innerHTML = `<img src="https://swag.heyra.uk/favicon.ico" alt="icon" style="width:100%;height:100%;">`;
    document.body.appendChild(floatingBtn);

    // Create dialog
    const dialog = document.createElement('div');
    dialog.id = 'custom-dialog';
    dialog.innerHTML = `
        <div id="dialog-content">
            <p id="dialog-message">Dialog content here. Replace with your logic.</p>
            <div id="dialog-actions">
                <button id="cancel-btn">取消</button>
                <button id="confirm-btn">复制并下载</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    // Add styles
    GM_addStyle(`
        #floating-icon {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: #007BFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.3s ease;
            z-index: 1000;
            border: 4px solid rgb(0, 226, 203);
        }
        #floating-icon:hover {
            transform: translateY(-50%) scale(1.1);
        }
        #custom-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 300px;
            padding: 20px;
            background: white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            z-index: 1001;
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        #custom-dialog.active {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        #dialog-content {
            color: rgba(0, 0, 0, 0.6);
            text-align: center;
        }
        #dialog-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        #dialog-actions button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.2s ease;
        }
        #cancel-btn {
        color: white;
            background:  rgb(220, 38, 38);
        }
        #cancel-btn:hover {
        color: white;
            background: rgb(220, 38, 38);
        }
        #confirm-btn {
            background: rgb(0, 226, 203);
            color: white;
        }
        #confirm-btn:hover {
            background: rgb(0, 226, 203);
        }
    `);

    // Toggle dialog visibility
    function toggleDialog(show) {
        if (show) {
            dialog.classList.add('active');
        } else {
            dialog.classList.remove('active');
        }
    }

    // Event listeners
    floatingBtn.addEventListener('click', () => { toggleDialog(true); dialogLogic() });
    document.getElementById('cancel-btn').addEventListener('click', () => toggleDialog(false));
    document.getElementById('confirm-btn').addEventListener('click', () => confirmAction());

    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            // 使用现代异步 Clipboard API
            navigator.clipboard.writeText(text).then(() => {
                console.log('Text copied to clipboard:', text);
            }).catch(err => {
                console.error('Failed to copy text to clipboard:', err);
            });
        } else {
            // 退回到旧方法，使用 document.execCommand
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed'; // 避免滚动条影响
            textArea.style.opacity = '0'; // 隐藏元素
            document.body.appendChild(textArea);
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    console.log('Text copied to clipboard:', text);
                } else {
                    console.error('Failed to copy text to clipboard using execCommand.');
                }
            } catch (err) {
                console.error('Failed to copy text to clipboard:', err);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    // Placeholder for confirm logic
    function confirmAction() {
        toggleDialog(false);
        window.open("https://swag.heyra.uk/", "_blank")
    }

    // Placeholder for dialog logic
    function dialogLogic() {
        var db
        var request = indexedDB.open('localforage', 3)
        request.onsuccess = function () {
            db = request.result
            var tx = db.transaction('keyvaluepairs', 'readonly')
            var store = tx.objectStore('keyvaluepairs')
            var _request = store.getAll('_refreshToken')
            _request.onsuccess = function () {
                var token = _request.result.toString()
                copyToClipboard(token)
                document.getElementById('dialog-message').innerText = "Token 获取成功";
            }
        }
    }
})();