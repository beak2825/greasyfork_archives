// ==UserScript==
// @name         微博长文转Canvas截图
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将微博长文内容转换为Canvas截图
// @author       YourName
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_addElement
// @resource     html2canvas https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532143/%E5%BE%AE%E5%8D%9A%E9%95%BF%E6%96%87%E8%BD%ACCanvas%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532143/%E5%BE%AE%E5%8D%9A%E9%95%BF%E6%96%87%E8%BD%ACCanvas%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .weibo-screenshot-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: #ff8200;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .weibo-screenshot-btn:hover {
            background-color: #e67300;
        }
        .screenshot-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .screenshot-image {
            max-width: 90%;
            max-height: 80%;
            border: 1px solid #ddd;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .screenshot-btns {
            margin-top: 20px;
        }
        .screenshot-btn {
            margin: 0 10px;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .screenshot-download {
            background-color: #ff8200;
            color: white;
            border: none;
        }
        .screenshot-close {
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
        }
    `);

    // 加载html2canvas
    function loadHtml2Canvas(callback) {
        const html2canvasScript = GM_getResourceText('html2canvas');
        GM_addElement('script', {
            textContent: html2canvasScript
        });
        
        // 等待html2canvas加载完成
        const checkInterval = setInterval(() => {
            if (typeof html2canvas !== 'undefined') {
                clearInterval(checkInterval);
                callback();
            }
        }, 100);
    }

    // 创建截图按钮
    const screenshotBtn = document.createElement('button');
    screenshotBtn.className = 'weibo-screenshot-btn';
    screenshotBtn.textContent = '截图长微博';
    document.body.appendChild(screenshotBtn);

    // 点击按钮事件
    screenshotBtn.addEventListener('click', function() {
        // 找到微博正文内容
        const weiboContent = document.querySelector('.weibo-text');
        if (!weiboContent) {
            alert('未找到微博正文内容！');
            return;
        }

        loadHtml2Canvas(function() {
            // 创建预览容器
            const container = document.createElement('div');
            container.className = 'screenshot-container';
            
            // 创建图片容器
            const imgContainer = document.createElement('div');
            imgContainer.style.textAlign = 'center';
            
            // 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.className = 'screenshot-btns';
            
            // 创建下载按钮
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'screenshot-btn screenshot-download';
            downloadBtn.textContent = '下载图片';
            
            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.className = 'screenshot-btn screenshot-close';
            closeBtn.textContent = '关闭';
            
            // 添加到容器
            btnContainer.appendChild(downloadBtn);
            btnContainer.appendChild(closeBtn);
            container.appendChild(imgContainer);
            container.appendChild(btnContainer);
            document.body.appendChild(container);

            // 使用html2canvas生成截图
            html2canvas(weiboContent, {
                backgroundColor: '#ffffff',
                scale: 2, // 提高分辨率
                logging: false,
                useCORS: true
            }).then(canvas => {
                const img = document.createElement('img');
                img.className = 'screenshot-image';
                img.src = canvas.toDataURL('image/png');
                imgContainer.appendChild(img);

                // 下载按钮事件
                downloadBtn.addEventListener('click', function() {
                    const link = document.createElement('a');
                    link.download = '微博截图_' + new Date().getTime() + '.png';
                    link.href = img.src;
                    link.click();
                });

                // 关闭按钮事件
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(container);
                });
            }).catch(err => {
                console.error('截图生成失败:', err);
                alert('截图生成失败，请重试！');
                document.body.removeChild(container);
            });
        });
    });

    // 只在长微博页面显示按钮
    function checkAndShowButton() {
        const isLongWeibo = window.location.href.includes('/detail/');
        screenshotBtn.style.display = isLongWeibo ? 'block' : 'none';
    }

    // 初始检查
    checkAndShowButton();

    // 监听URL变化
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkAndShowButton();
        }
    }, 500);
})();