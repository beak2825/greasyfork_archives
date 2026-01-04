// ==UserScript==
// @name         通用下载助手 
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  快速实现下载功能
// @author       niweizhuan
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525497/%E9%80%9A%E7%94%A8%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/525497/%E9%80%9A%E7%94%A8%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 添加悬浮窗样式
	GM_addStyle(`
        #downloaderOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none;
        }
        #downloaderPopup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            width: 90%; /* 悬浮窗宽度占屏幕宽度的 90% */
            max-width: 400px; /* 最大宽度限制 */
            font-family: Arial, sans-serif;
        }
        #downloaderPopup h3 {
            margin: 0 0 15px;
            font-size: 18px;
            color: #333;
            text-align: center;
        }
        #downloaderPopup input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        #downloaderPopup label {
            display: block;
            margin-bottom: 15px;
            font-size: 14px;
            color: #555;
        }
        #downloaderPopup button {
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #downloaderPopup button:hover {
            background-color: #0056b3;
        }
        #loading {
            display: none;
            margin-top: 15px;
            text-align: center;
            font-size: 14px;
            color: #555;
        }
        #closePopup {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 5vw; /* 按钮大小占屏幕宽度的 5% */
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 5vw; /* 按钮宽度占屏幕宽度的 5% */
            height: 5vw; /* 按钮高度占屏幕宽度的 5% */
            max-width: 24px; /* 最大宽度限制 */
            max-height: 24px; /* 最大高度限制 */
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #closePopup:hover {
            color: #333;
        }
        .custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f0f0f0; /* 浅灰色背景 */
            color: #333; /* 深灰色文字 */
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            display: none;
            animation: slideIn 0.5s ease-out, fadeOut 0.5s 2.5s ease-out forwards;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `);

	// 创建悬浮窗和遮罩层
	const overlay = document.createElement('div');
	overlay.id = 'downloaderOverlay';
	document.body.appendChild(overlay);

	const popup = document.createElement('div');
	popup.id = 'downloaderPopup';
	popup.innerHTML = `
        <button id="closePopup">×</button>
        <h3>下载器</h3>
        <input type="text" id="downloadLink" placeholder="请输入下载链接">
        <label>
            <input type="checkbox" id="forceTxt"> 强制改为 txt 格式
        </label>
        <button id="downloadButton">下载</button>
        <div id="loading">正在处理...</div>
    `;
	document.body.appendChild(popup);

	// 创建自定义通知
	const customNotification = document.createElement('div');
	customNotification.className = 'custom-notification';
	document.body.appendChild(customNotification);

	// 显示自定义通知
	function showNotification(message, duration = 3000) {
		customNotification.textContent = message;
		customNotification.style.display = 'block';
		setTimeout(() => {
			customNotification.style.display = 'none';
		}, duration);
	}

	// 默认隐藏悬浮窗和遮罩层
	popup.style.display = 'none';
	overlay.style.display = 'none';

	// 关闭悬浮窗
	const closePopup = document.getElementById('closePopup');
	const closePopupAndOverlay = () => {
		popup.style.display = 'none';
		overlay.style.display = 'none';
	};

	closePopup.addEventListener('click', closePopupAndOverlay);

	// 点击遮罩层关闭悬浮窗
	overlay.addEventListener('click', closePopupAndOverlay);

	// 注册油猴菜单项
	GM_registerMenuCommand('打开下载器', () => {
		popup.style.display = 'block';
		overlay.style.display = 'block';
	});

	// 下载功能
	const downloadButton = document.getElementById('downloadButton');
	const loadingDiv = document.getElementById('loading');

	downloadButton.addEventListener('click', () => {
		const linkInput = document.getElementById('downloadLink');
		const forceTxtCheckbox = document.getElementById('forceTxt');
		const url = linkInput.value;

		// 验证输入的链接是否为空
		if (!url) {
			alert('内容不能为空');
			return;
		}

		// 判断链接类型（HTTP/HTTPS 或磁力链接）
		const isHttpLink = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url);
		const isMagnetLink = /^magnet:\?xt=urn:btih:[^\s&]+/.test(url);

		if (!isHttpLink && !isMagnetLink) {
			alert('请输入有效的下载链接');
			return;
		}

		// 显示加载状态
		loadingDiv.style.display = 'block';

		if (isHttpLink) {
			// 处理 HTTP/HTTPS 链接
			GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				responseType: 'blob',
				onload: function(response) {
					loadingDiv.style.display = 'none';
					if (response.status === 200) {
						const blob = response.response;
						let fileName;

						// 处理响应头大小写问题
						const headers = response.responseHeaders.toLowerCase();
						const dispositionIndex = headers.indexOf('content-disposition');
						if (dispositionIndex !== -1) {
							const disposition = headers.substring(dispositionIndex + 'content-disposition'.length).split('\n')[0].trim();
							const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
							const matches = filenameRegex.exec(disposition);
							if (matches != null && matches[1]) {
								fileName = matches[1].replace(/['"]/g, '');
							}
						}
						if (!fileName) {
							// 如果没有从响应头中获取到文件名，使用 URL 的最后一部分
							fileName = url.substring(url.lastIndexOf('/') + 1);
						}

						if (forceTxtCheckbox.checked) {
							// 去掉原文件扩展名并添加 .txt
							fileName = fileName.replace(/\.[^/.]+$/, '') + '.txt';
						}

						const link = document.createElement('a');
						let objectUrl;
						try {
							objectUrl = window.URL.createObjectURL(blob);
							link.href = objectUrl;
							link.download = fileName;
							link.click();
						} finally {
							if (objectUrl) {
								window.URL.revokeObjectURL(objectUrl);
							}
						}
					} else {
						alert('下载失败，请检查链接是否有效，状态码: ' + response.status);
					}
				},
				onerror: function(error) {
					loadingDiv.style.display = 'none';
					alert(`下载过程中出现错误，请稍后重试，状态码: ${error.status}，错误信息: ${error.statusText}`);
				}
			});
		} else if (isMagnetLink) {
			// 处理磁力链接
			try {
				const magnetLink = document.createElement('a');
				magnetLink.href = url;
				magnetLink.click();

				// 设置超时检测（5 秒）
				const timeout = 5000; // 5 秒
				const startTime = Date.now();

				// 监听窗口是否失去焦点（表示客户端可能已打开）
				const onBlur = () => {
					showNotification('正在通过默认客户端打开磁力链接...');
					loadingDiv.style.display = 'none'; // 隐藏加载状态
					window.removeEventListener('blur', onBlur);
				};
				window.addEventListener('blur', onBlur);

				// 超时检测
				setTimeout(() => {
					window.removeEventListener('blur', onBlur);
					if (Date.now() - startTime >= timeout) {
						loadingDiv.style.display = 'none'; // 隐藏加载状态
						showNotification('打开客户端失败，请手动复制链接到 BT 客户端。');
						navigator.clipboard.writeText(url).catch((err) => {
							console.error('复制磁力链接失败:', err);
						});
					}
				}, timeout);
			} catch (error) {
				// 如果无法直接打开，复制到剪贴板并提示用户
				loadingDiv.style.display = 'none'; // 隐藏加载状态
				navigator.clipboard.writeText(url).then(() => {
					alert('打开客户端失败，请手动粘贴链接到 BT 客户端。');
				}).catch((err) => {
					console.error('复制磁力链接失败:', err);
				});
			}
		}
	});
})();