// ==UserScript==
// @name         高效文本文件查看器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  优化文本文件查看体验，支持快速复制、下载及长文本处理
// @author       niweizhuan
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524721/%E9%AB%98%E6%95%88%E6%96%87%E6%9C%AC%E6%96%87%E4%BB%B6%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/524721/%E9%AB%98%E6%95%88%E6%96%87%E6%9C%AC%E6%96%87%E4%BB%B6%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 获取当前页面的URL
	const currentPageUrl = window.location.href;

	// 检查是否为txt文件
	function isTxtFile() {
		// 获取当前页面的Content-Type
		var contentType = document.contentType;

		// 检查Content-Type是否为纯文本
		return contentType === 'text/plain';
	}
	// 异步加载文本内容（流式读取）
	function loadTextContent(url) {
		return fetch(url).then(function(response) {
			if (!response.ok) {
				throw new Error('请检查互联网连接');
			}
			const reader = response.body.getReader();
			const decoder = new TextDecoder('utf-8');
			let content = [];
			return new Promise(function(resolve, reject) {
				function read() {
					reader.read().then(function({
						done,
						value
					}) {
						if (done) {
							resolve(content.join(''));
							return;
						}
						content.push(decoder.decode(value, {
							stream: true
						}));
						read();
					}).catch(reject);
				}
				read();
			});
		}).catch(function(error) {
			alert('加载失败:', error);
			return null;
		});
	}

	// 分段显示内容
	function displayContent(content) {
		const contentElement = document.getElementById('content');
		const loadingElement = document.getElementById('loading');
		const errorElement = document.getElementById('error');

		loadingElement.style.display = 'block';
		errorElement.style.display = 'none';

		if (!content) {
			errorElement.style.display = 'block';
			loadingElement.style.display = 'none';
			return;
		}

		const chunkSize = 10000;
		let offset = 0;
		window.textContentInterval = setInterval(function() {
			const chunk = content.slice(offset, offset + chunkSize);
			const chunkElement = document.createElement('div');
			chunkElement.textContent = chunk;
			contentElement.appendChild(chunkElement);
			offset += chunkSize;
			if (offset >= content.length) {
				clearInterval(window.textContentInterval);
				loadingElement.style.display = 'none';
			}
		}, 100);
	}

	// 初始化页面
	function initializePage() {
		const newPageContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>文本文件查看器</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #f0f0f0;
                    overflow: hidden;
                }
                #header {
                    margin-bottom: 20px;
                }
                #header button {
                    margin-right: 10px;
                    padding: 8px 16px;
                    font-size: 14px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #header button:hover {
                    background-color: #0056b3;
                }
                #content {
                    white-space: pre-wrap;
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    padding: 10px;
                    border-radius: 4px;
                    margin-top: 20px;
                    font-family: monospace;
                    font-size: 14px;
                    max-height: 600px;
                    overflow-y: auto;
                    will-change: transform;
                }
                #error {
                    color: red;
                    font-weight: bold;
                    margin-top: 20px;
                    display: none;
                }
                #loading {
                    text-align: center;
                    margin-top: 50px;
                    display: block;
                }
                #loading img {
                    width: 50px;
                    height: 50px;
                }
                @keyframes rotate {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                .loader {
                    width: 50px;
                    height: 50px;
                    border: 5px solid transparent;
                    border-top-color: #007bff;
                    border-bottom-color: #007bff;
                    border-radius: 50%;
                    animation: rotate 1s linear infinite;
                    margin: 100px auto;
                }
            </style>
        </head>
        <body>
            <div id="header">
                <button id="copyAll">复制全部</button>
                <button id="downloadText">下载文字</button>
            </div>
            <div id="content" class="scroll-container"></div>
            <div id="custom-txt-viewer"></div>
            <div id="error">加载失败，请检查链接是否正确。</div>
            <div id="loading">
                <div class="loader"></div>
                加载中...
            </div>
        </body>
        </html>
        `;

		document.open();
		document.write(newPageContent);
		document.close();

		// 初始化按钮事件
		document.getElementById('copyAll').addEventListener('click', () => {
			const contentElement = document.getElementById('content');
			const content = contentElement.textContent;

			// 如果内容过长，禁止复制并提示用户下载
			if (content.length > 100000) {
				alert('内容过长，无法复制，请使用下载功能保存内容。');
				return;
			}

			const copyButton = document.getElementById('copyAll');
			copyButton.disabled = true;

			if (navigator.clipboard && window.isSecureContext) {
				// 使用Clipboard API复制
				navigator.clipboard.writeText(content)
					.then(() => {
						alert('内容已复制到剪贴板！');
					})
					.catch(err => {
						console.error('复制失败:', err);
						alert('复制失败，请手动复制内容或使用下载功能保存内容。', '详细信息:', err);
					})
					.finally(() => {
						copyButton.disabled = false;
					});
			} else {
				// 使用document.execCommand作为回退方案
				const textArea = document.createElement('textarea');
				textArea.value = content;
				document.body.appendChild(textArea);
				textArea.select();
				try {
					const successful = document.execCommand('copy');
					if (successful) {
						alert('内容已复制到剪贴板！');
					} else {
						alert('复制失败，请手动复制内容或使用下载功能保存内容。');
					}
				} catch (err) {
					console.error('无法执行复制操作:', err);
					alert('复制失败，请手动复制内容或使用下载功能保存内容。', '详细信息:', err);
				} finally {
					document.body.removeChild(textArea);
					copyButton.disabled = false;
				}
			}
		});
		document.getElementById('downloadText').addEventListener('click', function() {
			const contentElement = document.getElementById('content');
			const blob = new Blob([contentElement.textContent], {
				type: 'text/plain'
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'content.txt';
			a.click();
			URL.revokeObjectURL(url);
		});
	}

	// 检查是否为文件并初始化页面
	if (isTxtFile()) {
		initializePage();

		// 加载并显示内容
		(function() {
			loadTextContent(currentPageUrl).then(function(content) {
				if (content) {
					displayContent(content);
				}
			}).catch(function(error) {
				console.error('Error loading content:', error);
			});
		})();
	}
})();