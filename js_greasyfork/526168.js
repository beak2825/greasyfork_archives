// ==UserScript==
// @name         Rakuten Magazine Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download and convert Rakuten magazine pages
// @author       Coelacanth
// @match        https://magazine.rakuten.co.jp/read/*
// @grant        GM_xmlhttpRequest
// @connect      data-cloudauthoring.magazine.rakuten.co.jp
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526168/Rakuten%20Magazine%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/526168/Rakuten%20Magazine%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .magazine-downloader {
            position: fixed;
            right: 20px;
            bottom: 20px;
            padding: 12px 24px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            z-index: 10000;
            font-size: 14px;
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .magazine-downloader:hover {
            background: #45a049;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .magazine-downloader.loading {
            background: #f39c12;
            cursor: wait;
        }
        .debug-info {
            position: fixed;
            right: 20px;
            top: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 10000;
            display: none;
        }
        .progress-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10001;
            text-align: center;
            min-width: 300px;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.3s ease;
        }
        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        }
    `;
    document.head.appendChild(style);

    // 添加调试信息元素
    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    document.body.appendChild(debugInfo);

    // 显示调试信息
    function showDebug(text) {
        debugInfo.style.display = 'block';
        debugInfo.textContent = text;
        console.log(text);
    }

    class MagazineDownloader {
        constructor() {
            this.zip = new JSZip();
            this.pageCount = 0;
            this.currentPage = 0;
        }

        // 从页面源码提取参数
        extractParameters() {
            const scripts = document.getElementsByTagName('script');
            for (const script of scripts) {
                const content = script.textContent;
                if (content && content.includes('var issueId =')) {
                    // 直接提取变量值
                    const issueIdMatch = content.match(/var issueId = "([^"]+)"/);
                    const titleIdMatch = content.match(/var titleId = "([^"]+)"/);
                    const contentUrlMatch = content.match(/var contentUrl = "([^"]+)"/);

                    if (issueIdMatch && titleIdMatch && contentUrlMatch) {
                        // 从contentUrl提取x1
                        const contentUrl = contentUrlMatch[1].replace(/\\\//g, '/');
                        const x1Match = contentUrl.match(/\/([^/]+)\/[^/]+\/[^/]+\/webreaderHTML/);
                        
                        if (x1Match) {
                            const params = {
                                x1: x1Match[1],        // 从URL提取的第一个参数
                                x2: titleIdMatch[1],   // titleId
                                x3: issueIdMatch[1]    // issueId
                            };
                            
                            // 显示提取到的参数
                            showDebug(`提取的参数：\nx1: ${params.x1}\nx2: ${params.x2}\nx3: ${params.x3}`);
                            
                            return params;
                        }
                    }
                }
            }
            throw new Error('无法在页面中找到必要的参数');
        }

        // 显示进度界面
        showProgress() {
            const backdrop = document.createElement('div');
            backdrop.className = 'backdrop';
            
            const overlay = document.createElement('div');
            overlay.className = 'progress-overlay';
            
            overlay.innerHTML = `
                <div class="progress-text">正在下载第 0 页...</div>
                <div class="progress-bar">
                    <div class="progress-bar-fill"></div>
                </div>
                <div class="progress-status"></div>
            `;
            
            backdrop.appendChild(overlay);
            document.body.appendChild(backdrop);
            
            return {
                backdrop,
                updateProgress: (current, total, status) => {
                    const progressText = overlay.querySelector('.progress-text');
                    const progressBar = overlay.querySelector('.progress-bar-fill');
                    const progressStatus = overlay.querySelector('.progress-status');
                    
                    progressText.textContent = `正在下载第 ${current} 页...`;
                    progressBar.style.width = `${(current / total) * 100}%`;
                    if (status) {
                        progressStatus.textContent = status;
                    }
                }
            };
        }

        // 下载单个文件
        async downloadPage(params, pageNum) {
            const pageStr3 = pageNum.toString().padStart(3, '0');  // 三位数格式
            const pageStr2 = pageNum.toString().padStart(2, '0');  // 两位数格式
            
            // 先尝试3位数URL
            const url3 = `https://data-cloudauthoring.magazine.rakuten.co.jp/rem_repository/${params.x1}/${params.x2}/${params.x3}/webreaderHTML/complete/documents/AVED0_A0_L0_P${pageStr3}.pdf`;
            showDebug(`尝试3位数下载: ${url3}`);
            
            try {
                const response3 = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url3,
                        responseType: 'arraybuffer',
                        onload: resolve,
                        onerror: reject
                    });
                });
                
                if (response3.status === 200) {
                    showDebug(`页面 ${pageNum} (3位数) 下载成功，数据大小: ${response3.response.byteLength} 字节`);
                    const jpegData = this.extractJPEG(response3.response);
                    if (jpegData) {
                        showDebug(`页面 ${pageNum} JPEG 提取成功，大小: ${jpegData.byteLength} 字节`);
                        return jpegData;
                    }
                }
            } catch (error) {
                showDebug(`3位数下载失败，尝试2位数格式`);
            }
            
            // 如果3位数失败，尝试2位数URL
            const url2 = `https://data-cloudauthoring.magazine.rakuten.co.jp/rem_repository/${params.x1}/${params.x2}/${params.x3}/webreaderHTML/complete/documents/AVED0_A0_L0_P${pageStr2}.pdf`;
            showDebug(`尝试2位数下载: ${url2}`);
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url2,
                    responseType: 'arraybuffer',
                    onload: response => {
                        if (response.status === 200) {
                            showDebug(`页面 ${pageNum} (2位数) 下载成功，数据大小: ${response.response.byteLength} 字节`);
                            const jpegData = this.extractJPEG(response.response);
                            if (jpegData) {
                                showDebug(`页面 ${pageNum} JPEG 提取成功，大小: ${jpegData.byteLength} 字节`);
                                resolve(jpegData);
                            } else {
                                showDebug(`页面 ${pageNum} 未找到 JPEG 数据`);
                                reject(new Error('No JPEG data found'));
                            }
                        } else {
                            showDebug(`页面 ${pageNum} 所有下载尝试都失败`);
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        showDebug(`页面 ${pageNum} 下载错误: ${error}`);
                        reject(error);
                    }
                });
            });
        }

        // 从PDF提取JPEG
        extractJPEG(pdfData) {
            const data = new Uint8Array(pdfData);
            const jpegStart = this.findSequence(data, [0xFF, 0xD8]);
            const jpegEnd = this.findSequence(data, [0xFF, 0xD9], jpegStart);
            
            if (jpegStart === -1 || jpegEnd === -1) return null;
            return data.slice(jpegStart, jpegEnd + 2);
        }

        // 在二进制数据中查找序列
        findSequence(data, sequence, startFrom = 0) {
            for (let i = startFrom; i < data.length - sequence.length + 1; i++) {
                let found = true;
                for (let j = 0; j < sequence.length; j++) {
                    if (data[i + j] !== sequence[j]) {
                        found = false;
                        break;
                    }
                }
                if (found) return i;
            }
            return -1;
        }

        // 主下载流程
        async start() {
            try {
                const params = this.extractParameters();
                showDebug(`开始下载，参数:\nx1=${params.x1}\nx2=${params.x2}\nx3=${params.x3}`);
                
                const progress = this.showProgress();
                
                // 测试第一页下载
                try {
                    showDebug('尝试下载第一页...');
                    const testData = await this.downloadPage(params, 0);
                    if (!testData) {
                        throw new Error('无法下载第一页');
                    }
                    showDebug('第一页下载成功');
                } catch (error) {
                    showDebug(`第一页下载失败: ${error.message}`);
                    throw new Error(`无法访问文件: ${error.message}`);
                }
                
                // 获取总页数
                let pageNum = 0;
                while (true) {
                    try {
                        showDebug(`检查页面 ${pageNum} 是否存在...`);
                        await this.downloadPage(params, pageNum);
                        pageNum++;
                    } catch (error) {
                        showDebug(`检测到最后一页: ${pageNum - 1}`);
                        break;
                    }
                }
                
                if (pageNum === 0) {
                    throw new Error('未找到可下载的页面');
                }
                
                this.pageCount = pageNum;
                showDebug(`总页数: ${this.pageCount}`);
                progress.updateProgress(0, this.pageCount, '准备下载...');

                // 创建一个数组来存储所有下载的数据
                const downloadedPages = [];
                
                // 下载所有页面
                for (let i = 0; i < this.pageCount; i++) {
                    try {
                        const jpegData = await this.downloadPage(params, i);
                        downloadedPages[i] = jpegData;
                        progress.updateProgress(i + 1, this.pageCount);
                    } catch (error) {
                        console.error(`Error downloading page ${i}:`, error);
                        downloadedPages[i] = null;
                    }
                }

                // 重新排序并保存到ZIP
                // 第一页保持不变
                if (downloadedPages[0]) {
                    this.zip.file('1.jpg', downloadedPages[0]);
                }

                // 从第二页开始，每两页交换顺序
                let newIndex = 2; // 从2开始编号
                for (let i = 1; i < downloadedPages.length; i += 2) {
                    // 确保有下一页
                    if (i + 1 < downloadedPages.length) {
                        // 交换顺序保存
                        if (downloadedPages[i + 1]) {
                            this.zip.file(`${newIndex}.jpg`, downloadedPages[i + 1]);
                        }
                        if (downloadedPages[i]) {
                            this.zip.file(`${newIndex + 1}.jpg`, downloadedPages[i]);
                        }
                        newIndex += 2;
                    } else {
                        // 如果是最后一个单页
                        if (downloadedPages[i]) {
                            this.zip.file(`${newIndex}.jpg`, downloadedPages[i]);
                        }
                    }
                }

                showDebug('页面重排序完成');

                progress.updateProgress(this.pageCount, this.pageCount, '正在生成ZIP文件...');
                
                // 生成并下载ZIP
                const content = await this.zip.generateAsync({type: 'blob'});
                const title = document.title.replace(/[/\\?%*:|"<>]/g, '-');
                const url = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                setTimeout(() => {
                    progress.backdrop.remove();
                    debugInfo.style.display = 'none';
                }, 1000);
                
            } catch (error) {
                console.error('Download error:', error);
                alert('下载失败: ' + error.message);
            }
        }
    }

    // 创建下载按钮
    const button = document.createElement('button');
    button.className = 'magazine-downloader';
    button.textContent = '下载杂志';
    document.body.appendChild(button);

    // 绑定点击事件
    let isDownloading = false;
    button.addEventListener('click', async () => {
        if (isDownloading) return;
        
        try {
            isDownloading = true;
            button.classList.add('loading');
            button.textContent = '准备下载...';
            
            const downloader = new MagazineDownloader();
            await downloader.start();
            
        } catch (error) {
            console.error('Error:', error);
            alert('发生错误: ' + error.message);
        } finally {
            isDownloading = false;
            button.classList.remove('loading');
            button.textContent = '下载杂志';
        }
    });
})();