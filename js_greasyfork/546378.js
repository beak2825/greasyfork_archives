// ==UserScript==
// @name         同志网帖子图片爬取工具
// @namespace    https://tampermonkey.net/
// @version      3.2
// @description  并行下载+分块压缩+进度条+直接下载，解决打包慢问题
// @author       优化专家
// @match        *://www.tt1069.com/bbs/thread-*
// @match        *://imgbox.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546378/%E5%90%8C%E5%BF%97%E7%BD%91%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E7%88%AC%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546378/%E5%90%8C%E5%BF%97%E7%BD%91%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E7%88%AC%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入样式（包含进度条）
    GM_addStyle(`
        #imgToolPanel {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 320px !important;
            background: #fff !important;
            border: 2px solid #28a745 !important;
            border-radius: 8px !important;
            box-shadow: 0 0 20px rgba(0,0,0,0.1) !important;
            z-index: 99999 !important;
            padding: 20px !important;
        }
        .btn {
            width: 100% !important;
            padding: 10px !important;
            margin: 10px 0 !important;
            border: none !important;
            border-radius: 4px !important;
            background: #28a745 !important;
            color: white !important;
            cursor: pointer !important;
            font-size: 16px !important;
        }
        .btn:disabled {
            background: #ccc !important;
            cursor: not-allowed !important;
        }
        #zipProgress {
            height: 20px !important;
            background: #f0f0f0 !important;
            border-radius: 4px !important;
            margin: 10px 0 !important;
            display: none !important;
        }
        #zipProgressBar {
            height: 100% !important;
            background: #28a745 !important;
            border-radius: 4px !important;
            width: 0% !important;
            text-align: center !important;
            color: white !important;
            line-height: 20px !important;
        }
        #debugLog {
            min-height: 100px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            margin: 10px 0 !important;
            padding: 10px !important;
            border: 1px solid #eee !important;
            background: #f9f9f9 !important;
            display: none !important;
        }
    `);

    // 创建工具面板（含进度条和直接下载按钮）
    function createToolPanel() {
        const panel = document.createElement('div');
        panel.id = 'imgToolPanel';
        panel.innerHTML = `
            <h2 style="margin:0 0 15px 0;">论坛原图工具</h2>
            <button id="extractBtn" class="btn">提取原图</button>
            <div id="status" style="margin:10px 0;">等待操作...</div>
            <div id="debugLog">
                <strong>调试日志：</strong><br>
                <span id="logContent"></span>
            </div>
            <div id="zipProgress">
                <div id="zipProgressBar">0%</div>
            </div>
            <button id="downloadZipBtn" class="btn" style="display: none;" disabled>打包为ZIP（并行+进度）</button>
            <button id="directDownloadBtn" class="btn" style="display: none;" disabled>直接下载（绕开压缩）</button>
        `;
        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('extractBtn').addEventListener('click', startExtraction);
        document.getElementById('downloadZipBtn').addEventListener('click', downloadAsZip);
        document.getElementById('directDownloadBtn').addEventListener('click', downloadDirectly);
    }

    // 调试日志函数
    function logToPanel(message) {
        const logContent = document.getElementById('logContent');
        const debugLog = document.getElementById('debugLog');
        if (logContent && debugLog) {
            logContent.innerHTML += `${new Date().toLocaleTimeString()} - ${message}<br>`;
            debugLog.style.display = 'block';
        }
        console.log('[脚本日志]', message);
    }

    // 提取原图主逻辑
    function startExtraction() {
        const status = document.getElementById('status');
        const downloadZipBtn = document.getElementById('downloadZipBtn');
        const directDownloadBtn = document.getElementById('directDownloadBtn');
        const extractBtn = document.getElementById('extractBtn');

        if (extractBtn.disabled) {
            logToPanel('提取按钮已禁用，请勿重复点击');
            return;
        }

        status.textContent = '开始提取原图...';
        extractBtn.disabled = true;
        downloadZipBtn.disabled = true;
        directDownloadBtn.disabled = true;
        logToPanel('开始分析页面类型');

        if (window.location.href.includes('tt1069.com/bbs/')) {
            extractForumLinks();
        } else if (window.location.href.includes('imgbox.com/')) {
            extractSingleImage();
        } else {
            status.textContent = '当前页面不支持';
            logToPanel('页面URL不匹配规则');
            extractBtn.disabled = false;
        }
    }

    // 论坛帖子页提取逻辑（多链接）
    function extractForumLinks() {
        logToPanel('进入论坛帖子页逻辑');
        const jumpLinks = Array.from(document.querySelectorAll('a[href*="imgbox.com"]'))
            .map(link => {
                logToPanel(`发现跳转链接：${link.href}`);
                return link.href;
            });

        if (jumpLinks.length === 0) {
            logToPanel('未找到imgbox跳转链接');
            document.getElementById('status').textContent = '无有效链接';
            document.getElementById('extractBtn').disabled = false;
            return;
        }

        logToPanel(`共发现 ${jumpLinks.length} 个跳转链接`);
        document.getElementById('status').textContent = `开始解析 ${jumpLinks.length} 个链接`;

        const originalUrls = [];
        let completed = 0;

        jumpLinks.forEach((link, index) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: link,
                onload: (res) => {
                    if (res.status === 200) {
                        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                        const imgSrc = doc.querySelector('.image-container img')?.src;
                        if (imgSrc) {
                            originalUrls.push(imgSrc);
                            logToPanel(`解析第${index + 1}个链接，提取到原图：${imgSrc}`);
                        } else {
                            logToPanel(`解析第${index + 1}个链接，未找到原图`);
                        }
                    } else {
                        logToPanel(`解析第${index + 1}个链接失败，状态码：${res.status}`);
                    }

                    completed++;
                    if (completed === jumpLinks.length) {
                        document.getElementById('status').textContent = `提取完成！共找到 ${originalUrls.length} 张原图`;
                        document.getElementById('extractBtn').disabled = false;
                        document.getElementById('downloadZipBtn').style.display = 'block';
                        document.getElementById('downloadZipBtn').disabled = false;
                        document.getElementById('directDownloadBtn').style.display = 'block';
                        document.getElementById('directDownloadBtn').disabled = false;
                        window.originalUrls = originalUrls;
                        logToPanel('提取完成，启用下载按钮');
                    }
                },
                onerror: (err) => {
                    logToPanel(`解析第${index + 1}个链接请求失败：${err}`);
                    completed++;
                    if (completed === jumpLinks.length) {
                        document.getElementById('status').textContent = `提取完成！共找到 ${originalUrls.length} 张原图`;
                        document.getElementById('extractBtn').disabled = false;
                        document.getElementById('downloadZipBtn').style.display = 'block';
                        document.getElementById('downloadZipBtn').disabled = false;
                        document.getElementById('directDownloadBtn').style.display = 'block';
                        document.getElementById('directDownloadBtn').disabled = false;
                        window.originalUrls = originalUrls;
                        logToPanel('提取完成，启用下载按钮');
                    }
                }
            });
        });
    }

    // 单图床页面提取逻辑
    function extractSingleImage() {
        logToPanel('进入imgbox跳转页逻辑');
        const imgSrc = document.querySelector('.image-container img')?.src;
        if (!imgSrc) {
            logToPanel('未找到image-container img元素');
            document.getElementById('status').textContent = '无有效原图';
            document.getElementById('extractBtn').disabled = false;
            return;
        }

        logToPanel(`提取到单张原图：${imgSrc}`);
        document.getElementById('status').textContent = '提取完成！找到1张原图';
        document.getElementById('extractBtn').disabled = false;
        document.getElementById('downloadZipBtn').style.display = 'block';
        document.getElementById('downloadZipBtn').disabled = false;
        document.getElementById('directDownloadBtn').style.display = 'block';
        document.getElementById('directDownloadBtn').disabled = false;
        window.originalUrls = [imgSrc];
        logToPanel('提取完成，启用下载按钮');
    }

    // 并行下载+分块压缩+进度显示
    function downloadAsZip() {
        const urls = window.originalUrls || [];
        const zip = new JSZip();
        const progressBar = document.getElementById('zipProgressBar');
        const progressContainer = document.getElementById('zipProgress');
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        logToPanel(`开始并行下载 ${urls.length} 张原图并压缩`);

        const promises = urls.map((url, index) => {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: (res) => {
                        if (res.status === 200) {
                            const fileName = url.split('/').pop();
                            zip.file(fileName, res.response);
                            logToPanel(`第${index + 1}张图加入压缩包：${fileName}`);
                        } else {
                            logToPanel(`第${index + 1}张图下载失败，状态码：${res.status}`);
                        }
                        resolve();
                    },
                    onerror: (err) => {
                        logToPanel(`第${index + 1}张图请求失败：${err}`);
                        resolve();
                    }
                });
            });
        });

        Promise.all(promises).then(() => {
            zip.generateAsync({
                type: 'blob',
                onUpdate: (metadata) => {
                    const percent = metadata.percent.toFixed(2);
                    progressBar.style.width = `${percent}%`;
                    progressBar.textContent = `${percent}%`;
                    logToPanel(`压缩进度：${percent}%`);
                }
            }).then((content) => {
                saveAs(content, `论坛原图_${new Date().getTime()}.zip`);
                progressContainer.style.display = 'none';
                logToPanel('ZIP打包完成并触发下载');
            });
        });
    }

    // 直接下载（绕开压缩，速度最快）
    function downloadDirectly() {
        const urls = window.originalUrls || [];
        logToPanel(`开始直接下载 ${urls.length} 张原图`);
        urls.forEach((url, index) => {
            const fileName = url.split('/').pop();
            GM_download({
                url: url,
                name: fileName,
                onload: () => {
                    logToPanel(`第${index + 1}张图下载完成：${fileName}`);
                },
                onerror: (err) => {
                    logToPanel(`第${index + 1}张图下载失败：${err}`);
                }
            });
        });
    }

    // 初始化脚本
    (function init() {
        logToPanel('脚本开始初始化');
        if (document.getElementById('imgToolPanel')) {
            logToPanel('工具面板已存在，跳过重复创建');
            return;
        }
        createToolPanel();
        logToPanel('工具面板创建完成，等待用户操作');
    })();
})();