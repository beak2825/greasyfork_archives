// ==UserScript==
// @name         二维码生成器
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  在任何页面上生成文本或当前URL的二维码，支持快捷键 Ctrl+Q 打开窗口
// @author       wll
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/508086/%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/508086/%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 引入qrcode.min.js库
	const script = document.createElement('script');
	script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
	document.head.appendChild(script);

	// 添加样式
	GM_addStyle(`
        #qr-generator-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            padding: 40px;
            z-index: 1000000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            max-width: 360px;
            width: 100%;
            text-align: center;
        }
        #qr-generator-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }
        #qr-generator-modal textarea {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
        }
        #qr-close-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
        }
        #qr-code {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        .qr-button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        .qr-button:hover {
            background-color: #0056b3;
        }
        #qr-error-message {
            color: red;
            margin-top: 10px;
            display: none;
        }
    `);

	// 添加菜单项
	GM_registerMenuCommand("打开生成器", openQRCodeGenerator);

	// 添加快捷键监听器
	document.addEventListener('keydown', function(event) {
		if (event.ctrlKey && event.key === 'q') {
			// 阻止默认的打印行为
			event.preventDefault();
			openQRCodeGenerator();
		}
	});

	// 创建模态窗口
	function openQRCodeGenerator() {
		// 检查是否已经有模态窗口
		if (document.getElementById('qr-generator-modal')) {
			return;
		}

		// 创建模态窗口
		const modal = document.createElement('div');
		modal.id = 'qr-generator-modal';

		modal.innerHTML = `
            <button id="qr-close-button">&times;</button>
            <h1>二维码生成器</h1><br/>
            <textarea id="qr-text-input" placeholder="输入文本"></textarea><br/>
            <div id="qr-generator-buttons">
                <button id="qr-generate-button" class="qr-button">快速生成</button>
                <button id="qr-reset-button" class="qr-button">重置</button>
                <button id="qr-url-button" class="qr-button">网址转码</button>
            </div><br/>
            <div id="qr-error-message">请输入文本内容</div>
            <div id="qr-code"></div>
        `;

		document.body.appendChild(modal);

		// 绑定事件
		document.getElementById('qr-generate-button').addEventListener('click', generateQRCode);
		document.getElementById('qr-reset-button').addEventListener('click', resetFields);
		document.getElementById('qr-url-button').addEventListener('click', generateURLQRCode);
		document.getElementById('qr-close-button').addEventListener('click', () => modal.remove());

		// 自动获取输入焦点
		document.getElementById('qr-text-input').focus();
	}

	// 生成二维码信息
	function generateQRCode() {
		
		const inputText = document.getElementById("qr-text-input").value;
		const errorMessage = document.getElementById("qr-error-message");
		const qrcodeContainer = document.getElementById("qr-code");

		if (!inputText.trim()) {
			// 显示错误消息
			errorMessage.style.display = "block";
			// 自动获取输入焦点
			document.getElementById('qr-text-input').focus();
			return;
		}

		// 隐藏错误消息
		errorMessage.style.display = "none";
		
		// 清空之前的二维码
		qrcodeContainer.innerHTML = ""; 
		new QRCode(qrcodeContainer, {
			text: inputText,
			width: 256,
			height: 256
		});
	}

	// 重置生成信息
	function resetFields() {
		
		// 清空文本域
		document.getElementById("qr-text-input").value = ""; 
		
		// 清空二维码
		document.getElementById("qr-code").innerHTML = ""; 
		
		// 隐藏错误消息
		document.getElementById("qr-error-message").style.display = "none"; 
		
		// 自动获取输入焦点
		document.getElementById('qr-text-input').focus();
		
	}

	// 将当前网址URL转换成二维码
	function generateURLQRCode() {
		
		const currentURL = window.location.href;
		
		// 清空之前的二维码
		const qrcodeContainer = document.getElementById("qr-code");
		qrcodeContainer.innerHTML = ""; 
		
		new QRCode(qrcodeContainer, {
			text: currentURL,
			width: 256,
			height: 256
		});
	}

})();