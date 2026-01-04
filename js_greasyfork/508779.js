// ==UserScript==
// @name         获取图片URL和二维码信息并提供复制功能
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description  Ctrl+右键点击图片时:显示URL、并识别其中可能存在的二维码(目前来看png格式最佳)，同时提供下载新生成的二维码功能
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      GPL-3.0
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.3.1/dist/jsQR.min.js
// @require      https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/508779/%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87URL%E5%92%8C%E4%BA%8C%E7%BB%B4%E7%A0%81%E4%BF%A1%E6%81%AF%E5%B9%B6%E6%8F%90%E4%BE%9B%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/508779/%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87URL%E5%92%8C%E4%BA%8C%E7%BB%B4%E7%A0%81%E4%BF%A1%E6%81%AF%E5%B9%B6%E6%8F%90%E4%BE%9B%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #imageUrlPopup {
            position: fixed;
            background: #ffffff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
            width: 200px;
            height: auto;
            overflow-y: auto;
            top: 10px;
            left: 10px;
        }
        #imageUrlPopup p {
            margin: 0 0 10px 0;
            font-weight: bold;
            color: #333;
        }
        #imageUrlPopup textarea {
            width: calc(100% - 16px);
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
            font-size: 14px;
            resize: none;
            min-height: 20px;
            max-height: 150px;
            text-align: justify;
        }
        #imageUrlPopup button {
            width: 100%;
            padding: 8px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        #imageUrlPopup button:hover {
            background-color: #45a049;
        }
        #qrCodeCanvas {
            display: none;
            margin-top: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            max-width: 100%;
            height: auto;
        }
        #downloadQrButton {
            margin-top: 10px;
            background-color: #008CBA;
        }
        #downloadQrButton:hover {
            background-color: #007B9A;
        }
    `);

    let currentPopup = null;
    let ctrlPressed = false;

    // 监听Ctrl键的按下和释放
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Control') ctrlPressed = true;
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'Control') ctrlPressed = false;
    });

    // 监听鼠标右键点击事件
    document.addEventListener('mousedown', function(e) {
        if (ctrlPressed && e.button === 2 && e.target.tagName.toLowerCase() === 'img') {
            e.preventDefault();
            e.stopPropagation();
            showPopup(e.target.src);
            return false;
        }
    }, true);

    // 阻止默认的右键菜单
    document.addEventListener('contextmenu', function(e) {
        if (ctrlPressed && e.target.tagName.toLowerCase() === 'img') {
            e.preventDefault();
            return false;
        }
    }, true);

    // 显示弹出窗口
    function showPopup(imageUrl) {
        if (currentPopup) document.body.removeChild(currentPopup);

        var popup = document.createElement('div');
        popup.id = 'imageUrlPopup';
        popup.innerHTML = `
            <p>图片URL</p>
            <textarea readonly>${imageUrl}</textarea>
            <button id="copyUrlButton">复制URL到剪贴板</button>
            <p id="qrResult">正在识别二维码...</p>
            <textarea id="qrTextarea" readonly style="display:none;"></textarea>
            <button id="copyQrButton" style="display:none;">复制二维码信息</button>
            <canvas id="qrCodeCanvas"></canvas>
            <button id="downloadQrButton" style="display:none;">下载新二维码</button>
        `;

        document.body.appendChild(popup);
        popup.querySelectorAll('textarea').forEach(autoResizeTextarea);
        currentPopup = popup;

        document.getElementById('copyUrlButton').addEventListener('click', function() {
            GM_setClipboard(imageUrl);
            alert('图片URL已复制到剪贴板');
            closePopup();
        });

        document.getElementById('copyQrButton').addEventListener('click', function() {
            GM_setClipboard(document.getElementById('qrTextarea').value);
            alert('二维码信息已复制到剪贴板');
            closePopup();
        });

        document.getElementById('downloadQrButton').addEventListener('click', downloadQRCode);
        document.addEventListener('click', closePopupOnOutsideClick);
        detectQRCode(imageUrl);
    }

    // 检测二维码
    function detectQRCode(imageUrl) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
            // 创建canvas并绘制图片
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 使用jsQR库检测二维码
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            // 更新UI显示检测结果
            const qrResult = document.getElementById('qrResult');
            const qrTextarea = document.getElementById('qrTextarea');
            const copyQrButton = document.getElementById('copyQrButton');
            if (code) {
                qrResult.textContent = "检测到二维码：";
                qrTextarea.value = code.data;
                qrTextarea.style.display = 'block';
                copyQrButton.style.display = 'block';
                autoResizeTextarea(qrTextarea);
                generateQRCode(code.data);
            } else {
                qrResult.textContent = "未检测到二维码";
                qrTextarea.style.display = 'none';
                copyQrButton.style.display = 'none';
            }
        };
        img.onerror = function() {
            document.getElementById('qrResult').textContent = "图片加载失败，无法识别二维码";
            document.getElementById('qrTextarea').style.display = 'none';
            document.getElementById('copyQrButton').style.display = 'none';
        };
        img.src = imageUrl;
    }

    // 生成新的二维码
    function generateQRCode(data) {
        const canvas = document.getElementById('qrCodeCanvas');
        QRCode.toCanvas(canvas, data, function (error) {
            if (error) console.error(error);
            canvas.style.display = 'block';
            document.getElementById('downloadQrButton').style.display = 'block';
        });
    }

    // 下载生成的二维码
    function downloadQRCode() {
        const canvas = document.getElementById('qrCodeCanvas');
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // 自动调整textarea高度
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // 关闭弹出窗口
    function closePopup() {
        if (currentPopup) {
            document.body.removeChild(currentPopup);
            currentPopup = null;
            document.removeEventListener('click', closePopupOnOutsideClick);
        }
    }

    // 点击弹出窗口外部时关闭
    function closePopupOnOutsideClick(event) {
        if (currentPopup && !currentPopup.contains(event.target)) {
            closePopup();
        }
    }
})();