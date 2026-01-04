// ==UserScript==
// @name         超星学习通课件PDF下载助手「2026」
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动转换预览图URL并下载PDF文件（带时间命名）
// @author       MOFAN---QQ3078329197
// @match        *://s3.ananas.chaoxing.com/sv-w*/doc/*/thumb/1.png
// @match        *://s3.cldisk.com/sv-w*/doc/*/thumb/1.png
// @match        *://s3.cldisk.com/sv-w*/doc/*/pdf/*.pdf
// @match        *://s3.ananas.chaoxing.com/sv-w*/doc/*/pdf/*.pdf
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539998/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E4%BB%B6PDF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E3%80%8C2026%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/539998/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E4%BB%B6PDF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E3%80%8C2026%E3%80%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 第一部分：URL转换功能
    const imagePattern = /^(https:\/\/s3\.(?:ananas\.chaoxing\.com|cldisk\.com)\/sv-w\d+\/doc\/.+)\/([a-f0-9]{32})\/thumb\/1\.png$/i;
    const imageMatch = window.location.href.match(imagePattern);

    // 如果是预览图URL，转换到PDF页面
    if (imageMatch) {
        const basePath = imageMatch[1];
        const docId = imageMatch[2];
        const newUrl = `${basePath}/${docId}/pdf/${docId}.pdf`;
        window.location.replace(newUrl);
        return; // 停止后续执行
    }

    // 第二部分：PDF下载功能
    const pdfPattern = /^(https:\/\/s3\.(?:ananas\.chaoxing\.com|cldisk\.com)\/sv-w\d+\/doc\/.+\/pdf\/[a-f0-9]{32}\.pdf)$/i;
    const pdfMatch = window.location.href.match(pdfPattern);

    // 如果是PDF页面URL，设置下载UI
    if (pdfMatch) {
        // 添加UI样式
        const style = document.createElement('style');
        style.textContent = `
            #cx-pdf-download-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.98);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
                text-align: center;
                color: #2c3e50;
            }

            .download-card {
                width: 85%;
                max-width: 500px;
                background: white;
                border-radius: 20px;
                padding: 35px 30px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                border-top: 4px solid #3498db;
                position: relative;
                overflow: hidden;
                transform: scale(0.95);
                animation: cardEntrance 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            }

            @keyframes cardEntrance {
                0% { transform: translateY(30px) scale(0.95); opacity: 0; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }

            .download-decoration {
                position: absolute;
                top: -50px;
                right: -50px;
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(52, 152, 219, 0.1) 0%, rgba(0,0,0,0) 70%);
                border-radius: 50%;
            }

            .download-icon {
                width: 85px;
                height: 85px;
                margin: 0 auto 15px;
                background: linear-gradient(135deg, #3498db, #2c81c9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 8px 25px rgba(52, 152, 219, 0.25);
                animation: pulse 2s infinite;
            }

            .download-icon svg {
                width: 35px;
                height: 35px;
                fill: white;
            }

            .download-title {
                font-size: 26px;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 10px;
            }

            .download-subtitle {
                font-size: 16px;
                color: #7f8c8d;
                margin-bottom: 25px;
                line-height: 1.4;
            }

            .file-info-section {
                background: rgba(52, 152, 219, 0.07);
                border-radius: 15px;
                padding: 18px;
                margin: 20px 0;
                border: 1px dashed rgba(52, 152, 219, 0.15);
            }

            .file-name {
                font-size: 18px;
                font-weight: 600;
                word-break: break-all;
                margin: 10px 0;
                color: #2c3e50;
                padding: 10px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
            }

            .source-info {
                font-size: 14px;
                color: #7f8c8d;
                margin-top: 12px;
            }

            .countdown-section {
                margin: 25px 0;
            }

            .countdown-number {
                font-size: 50px;
                font-weight: 800;
                color: #3498db;
                margin: 15px 0;
                text-shadow: 0 4px 10px rgba(52, 152, 219, 0.2);
            }

            .countdown-label {
                font-size: 16px;
                margin-bottom: 20px;
                color: #7f8c8d;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: #e3eaef;
                border-radius: 4px;
                overflow: hidden;
                margin: 25px 0;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3498db, #2ecc71);
                border-radius: 4px;
                width: 0%;
                transition: width 0.5s ease;
            }

            .status-message {
                margin-top: 20px;
                padding: 8px 18px;
                background: rgba(52, 152, 219, 0.1);
                border-radius: 16px;
                display: inline-block;
                font-size: 14px;
                color: #3498db;
                font-weight: 500;
            }

            .error-message {
                background: rgba(231, 76, 60, 0.1);
                color: #e74c3c;
            }

            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.5); }
                70% { box-shadow: 0 0 0 15px rgba(52, 152, 219, 0); }
                100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
            }

            .time-format-info {
                background: rgba(241, 196, 15, 0.1);
                border-radius: 8px;
                padding: 8px 15px;
                font-size: 13px;
                color: #e67e22;
                margin-top: 10px;
                display: inline-block;
            }

            /* 广告区域样式 */
            .ad-container {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin: 15px 0;
                width: 100%;
            }

            .ad-text {
                font-size: 14px;
                color: #3498db;
                padding: 8px 12px;
                background: rgba(241, 196, 15, 0.15);
                border-radius: 30px;
                transition: all 0.3s;
                flex: 1;
                max-width: 220px;
                text-align: center;
            }

            .ad-button {
                background: linear-gradient(135deg, #2ecc71, #27ae60);
                color: white;
                border: none;
                border-radius: 24px;
                padding: 9px 20px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 10px rgba(46, 204, 113, 0.35);
                text-decoration: none;
                white-space: nowrap;
            }

            .ad-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(46, 204, 113, 0.45);
                background: linear-gradient(135deg, #27ae60, #2ecc71);
            }
        `;
        document.head.appendChild(style);

        // 生成时间格式的文件名
        function getTimeBasedFilename() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            return `${year}.${month}.${day}.${hours}.${minutes}.${seconds}.pdf`;
        }

        // 创建下载UI
        function createDownloadUI() {
            if (document.getElementById('cx-pdf-download-overlay')) return;

            const overlay = document.createElement('div');
            overlay.id = 'cx-pdf-download-overlay';

            // 生成新的基于时间的文件名
            const timeBasedFilename = getTimeBasedFilename();

            overlay.innerHTML = `
                <div class="download-card">
                    <div class="download-decoration"></div>

                    <div class="download-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,17L19,9Z"/>
                        </svg>
                    </div>

                    <h1 class="download-title">超星文档下载器</h1>
                    <p class="download-subtitle">PDF将按当前时间自动命名</p>

                    <div class="file-info-section">
                        <div class="source-info">即将下载的文件：</div>
                        <div class="file-name" id="time-based-filename">${timeBasedFilename}</div>
                        <div class="source-info">来源：${getFileSource()}</div>
                        <div class="time-format-info">文件名格式：年.月.日.时.分.秒.pdf</div>
                    </div>
                    <!-- 广告区域 -->

                    <div class="ad-container">

                        <div class="ad-text">刷课可以添加QQ3078329197</div>

                        <div class="ad-text">超低价格超级稳超级快</div>

                        <a href="https://qm.qq.com/q/ujXdqqP0sM" target="_blank" class="ad-button">点击立即添加</a>

                    </div>

                    <div class="countdown-section">
                        <div class="countdown-number" id="countdown-timer">3</div>
                        <div class="countdown-label">下载将在 <span id="seconds-remaining">3</span> 秒后开始</div>

                        <div class="progress-bar">
                            <div class="progress-fill" id="download-progress"></div>
                        </div>
                    </div>

                    <div class="status-message" id="status-message">准备中...</div>
                </div>
            `;

            document.body.appendChild(overlay);

            // 创建隐藏的下载链接
            const downloadLink = document.createElement('a');
            downloadLink.id = 'direct-download-link';
            downloadLink.href = window.location.href;
            downloadLink.download = timeBasedFilename;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
        }

        // 获取文件来源
        function getFileSource() {
            const hostname = window.location.hostname;
            if (hostname.includes('ananas.chaoxing.com')) {
                return '超星学习平台';
            } else if (hostname.includes('cldisk.com')) {
                return '超星云盘';
            }
            return '超星文档服务';
        }

        // 更新下载状态
        function updateStatus(message) {
            const statusEl = document.getElementById('status-message');
            if (statusEl) {
                statusEl.textContent = message;
            }
        }

        // 启动倒计时
        function startCountdown() {
            const timerEl = document.getElementById('countdown-timer');
            const secondsEl = document.getElementById('seconds-remaining');
            const progressEl = document.getElementById('download-progress');

            let seconds = 3;
            const countdown = setInterval(() => {
                seconds--;

                if (timerEl) timerEl.textContent = seconds;
                if (secondsEl) secondsEl.textContent = seconds;

                const progress = 100 - (seconds / 3 * 100);
                if (progressEl) progressEl.style.width = `${progress}%`;

                updateStatus(`${seconds}秒后自动下载...`);

                if (seconds <= 0) {
                    clearInterval(countdown);
                    triggerDownload();
                }
            }, 1000);
        }

        // 触发下载
        function triggerDownload() {
            updateStatus('正在启动下载...');

            try {
                // 使用隐藏的下载链接
                const downloadLink = document.getElementById('direct-download-link');
                if (downloadLink) {
                    // 在触发前更新时间
                    const newFilename = getTimeBasedFilename();
                    downloadLink.download = newFilename;
                    document.getElementById('time-based-filename').textContent = newFilename;

                    downloadLink.click();
                    updateStatus('下载已启动！请查看浏览器下载');

                    // 2秒后关闭弹窗
                    setTimeout(() => {
                        const overlay = document.getElementById('cx-pdf-download-overlay');
                        if (overlay) {
                            overlay.style.opacity = '0';
                            overlay.style.transform = 'scale(0.95)';
                            setTimeout(() => overlay.remove(), 400);
                        }
                    }, 1500);
                } else {
                    throw new Error('无法找到下载链接');
                }
            } catch (e) {
                updateStatus('错误: ' + e.message);
                console.error('下载错误:', e);
            }
        }

        // 主函数
        function main() {
            // 创建UI
            createDownloadUI();

            // 启动3秒倒计时
            setTimeout(() => {
                startCountdown();
            }, 500);
        }

        // 延迟执行以确保页面加载
        setTimeout(main, 800);
    }
})();