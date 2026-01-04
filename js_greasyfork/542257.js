// ==UserScript==
// @name         豆包音频下载器 (拦截并剪辑)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  【Web Worker版】编码过程将在后台线程全速运行，切换标签页不再影响处理速度。
// @author       Gemini
// @match        https://www.doubao.com/chat/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542257/%E8%B1%86%E5%8C%85%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28%E6%8B%A6%E6%88%AA%E5%B9%B6%E5%89%AA%E8%BE%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542257/%E8%B1%86%E5%8C%85%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28%E6%8B%A6%E6%88%AA%E5%B9%B6%E5%89%AA%E8%BE%91%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = '[豆包音频下载器]';
    console.log(`${SCRIPT_NAME} 脚本已启动 (v6.0)`);

    // =================================================================================
    // 1. Web Worker 的代码体
    // 将编码逻辑封装在一个字符串中，以便后续创建Worker
    // =================================================================================
    const workerCode = `
        // --- Worker 内部的辅助函数 ---
        function writeString(view, offset, string) {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        // --- Worker 内部的编码函数 ---
        function audioBufferToWav_Async(bufferData, onProgress) {
            return new Promise((resolve) => {
                const { numberOfChannels, length, sampleRate, channelData } = bufferData;
                const bitDepth = 8;
                const result = new Uint8Array(44 + length * numberOfChannels * (bitDepth / 8));
                const view = new DataView(result.buffer);

                writeString(view, 0, 'RIFF');
                view.setUint32(4, 36 + length * numberOfChannels * (bitDepth / 8), true);
                writeString(view, 8, 'WAVE');
                writeString(view, 12, 'fmt ');
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true);
                view.setUint16(22, numberOfChannels, true);
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true);
                view.setUint16(32, numberOfChannels * (bitDepth / 8), true);
                view.setUint16(34, bitDepth, true);
                writeString(view, 36, 'data');
                view.setUint32(40, length * numberOfChannels * (bitDepth / 8), true);

                let offset = 44;
                let currentSample = 0;
                const chunkSize = 8192;

                function processChunk() {
                    const limit = Math.min(currentSample + chunkSize, length);
                    for (let i = currentSample; i < limit; i++) {
                        for (let ch = 0; ch < numberOfChannels; ch++) {
                            let sample = channelData[ch][i];
                            let intSample = Math.floor((sample + 1) / 2 * 255);
                            view.setUint8(offset, intSample);
                            offset += 1;
                        }
                    }
                    currentSample = limit;
                    if (onProgress) {
                        onProgress((currentSample / length) * 100);
                    }
                    if (currentSample < length) {
                        setTimeout(processChunk, 0); // 在worker内部，setTimeout不会被主线程节流
                    } else {
                        resolve(result.buffer);
                    }
                }
                setTimeout(processChunk, 0);
            });
        }

        // --- Worker 的消息监听器 ---
        self.onmessage = (e) => {
            const bufferData = e.data;
            audioBufferToWav_Async(bufferData, (progress) => {
                // 发送进度回主线程
                self.postMessage({ type: 'progress', data: progress });
            }).then(wavBuffer => {
                // 发送完成结果回主线程，并转移所有权（零拷贝）
                self.postMessage({ type: 'done', data: wavBuffer }, [wavBuffer]);
            });
        };
    `;

    // =================================================================================
    // 2. 核心处理流程 (已重构为使用Web Worker)
    // =================================================================================
    function processAndDownloadAudio(url) {
        console.log(`${SCRIPT_NAME} 步骤 3: 开始处理音频...`);
        showNotification('已接管，正在下载和处理...', 'info', true);
        GM_xmlhttpRequest({
            method: 'GET', url: url, responseType: 'arraybuffer',
            onprogress: (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    showNotification(`正在下载原始音频... (${Math.round(progress)}%)`, 'info', true);
                    updateProgress(progress);
                }
            },
            onload: function(response) {
                if (response.status !== 200) { showNotification(`下载音频失败`, 'error'); return; }
                console.log(`${SCRIPT_NAME} 步骤 4: 原始音频下载成功，开始解码...`);
                showNotification('解码中...', 'info', true); updateProgress(0);
                const audioContext = new(unsafeWindow.AudioContext || unsafeWindow.webkitAudioContext)();
                new Promise((resolve, reject) => {
                    audioContext.decodeAudioData(response.response, resolve, reject);
                }).then(originalBuffer => {
                    console.log(`${SCRIPT_NAME} 步骤 5: 音频解码成功，开始剪辑...`);
                    const secondsToTrim = 5;
                    if (originalBuffer.duration <= secondsToTrim) { showNotification(`音频时长不足`, 'error'); return; }
                    const startOffset = Math.floor(secondsToTrim * originalBuffer.sampleRate);
                    const newLength = originalBuffer.length - startOffset;
                    const trimmedBuffer = audioContext.createBuffer(originalBuffer.numberOfChannels, newLength, originalBuffer.sampleRate);
                    for (let i = 0; i < originalBuffer.numberOfChannels; i++) { trimmedBuffer.getChannelData(i).set(originalBuffer.getChannelData(i).subarray(startOffset)); }

                    console.log(`${SCRIPT_NAME} 步骤 6: 剪辑完成，启动Web Worker进行后台编码...`);
                    showNotification('编码中 (后台运行)...', 'info', true); updateProgress(0);

                    // --- Web Worker 启动与通信逻辑 ---
                    const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
                    const workerUrl = URL.createObjectURL(workerBlob);
                    const worker = new Worker(workerUrl);

                    worker.onmessage = (e) => {
                        const { type, data } = e.data;
                        if (type === 'progress') {
                            updateProgress(data);
                        } else if (type === 'done') {
                            console.log(`${SCRIPT_NAME} 步骤 7: 后台编码完成，生成Blob。`);
                            const wavBlob = new Blob([data], { type: 'audio/wav' });
                            const blobUrl = URL.createObjectURL(wavBlob);
                            let filename;
                            try {
                                const urlObject = new URL(url); const attname = urlObject.searchParams.get('attname');
                                if (attname) { filename = attname; }
                            } catch (error) {}
                            if (!filename) { filename = 'doubao_trimmed_audio.wav'; }
                            console.log(`${SCRIPT_NAME} 步骤 8: 生成最终下载按钮。`);
                            showDownloadButton(blobUrl, filename);
                            worker.terminate(); // 结束worker
                            URL.revokeObjectURL(workerUrl); // 释放内存
                        }
                    };

                    // 准备要发送给Worker的数据
                    const channelData = [];
                    const transferable = [];
                    for(let i = 0; i < trimmedBuffer.numberOfChannels; i++) {
                        const data = trimmedBuffer.getChannelData(i);
                        channelData.push(data);
                        transferable.push(data.buffer); // 收集可转移的对象
                    }

                    // 发送数据给Worker，并转移所有权（零拷贝，性能更高）
                    worker.postMessage({
                        numberOfChannels: trimmedBuffer.numberOfChannels,
                        length: trimmedBuffer.length,
                        sampleRate: trimmedBuffer.sampleRate,
                        channelData: channelData,
                    }, transferable);

                }).catch(e => { console.error(`${SCRIPT_NAME} 解码失败。`, e); showNotification('解码音频失败', 'error'); });
            },
            onerror: (err) => { console.error(`${SCRIPT_NAME} 请求音频出错。`, err); showNotification('请求音频出错', 'error'); },
        });
    }

    // =================================================================================
    // 3. XHR 拦截逻辑 (无需修改)
    // =================================================================================
    const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;
    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) { this._hook_url = url; return originalXhrOpen.apply(this, arguments); };
    unsafeWindow.XMLHttpRequest.prototype.send = function() {
        if (this._hook_url && this._hook_url.includes('/api/doubao/do_action_v2')) {
            this.addEventListener('load', function(event) {
                event.stopImmediatePropagation();
                if (this.status === 200 && this.responseText) {
                    try {
                        const outerResponse = JSON.parse(this.responseText);
                        if (outerResponse.code === 0 && outerResponse.data && outerResponse.data.resp) {
                            const innerResponse = JSON.parse(outerResponse.data.resp);
                            const videoUrl = innerResponse.video_url;
                            if (videoUrl && videoUrl.includes('.wav')) { processAndDownloadAudio(videoUrl); }
                        }
                    } catch (e) { console.error(`${SCRIPT_NAME} 解析API响应失败。`, e); }
                }
            }, true);
        }
        return originalXhrSend.apply(this, arguments);
    };

    // =================================================================================
    // 4. UI 通知与下载按钮功能 (无需修改)
    // =================================================================================
    function showNotification(message, type = 'info', showProgress = false) {
        let n = document.getElementById('gm-notification-doubao');
        if (!n) { n = document.createElement('div'); n.id = 'gm-notification-doubao'; (document.body || document.documentElement).appendChild(n); }
        let innerHTML = `<span id="gm-notification-text">${message}</span>`;
        if (showProgress) { innerHTML += `<div id="gm-progress-container" style="background-color:#e0e0e0;border-radius:4px;height:6px;margin-top:8px;overflow:hidden;"><div id="gm-progress-bar" style="width:0%;height:100%;background-color:#fff;transition:width .2s ease;"></div></div>`; }
        n.innerHTML = innerHTML;
        const c = { info: '#2979ff', success: '#00c853', error: '#d50000' };
        Object.assign(n.style, { position: 'fixed', top: '20px', right: '20px', padding: '12px 20px', minWidth: '220px', backgroundColor: c[type], color: 'white', zIndex: '99999', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', fontSize: '14px', fontFamily: 'sans-serif', transition: 'opacity .5s', opacity: '1' });
    }

    function updateProgress(p) { const b = document.getElementById('gm-progress-bar'); if (b) { b.style.width = `${Math.round(p)}%`; } }

    function removeNotification() { const n = document.getElementById('gm-notification-doubao'); if (n) { n.style.opacity = '0'; setTimeout(() => n.remove(), 500); } }

    function showDownloadButton(blobUrl, filename) {
        removeNotification();
        let container = document.getElementById('gm-download-container');
        if (container) container.remove();
        container = document.createElement('div'); container.id = 'gm-download-container';
        const text = document.createElement('span'); text.innerText = '✅ 音频处理完成!';
        const downloadButton = document.createElement('button'); downloadButton.innerText = `点击下载: ${filename}`;
        const closeButton = document.createElement('button'); closeButton.innerText = '✕';
        container.append(text, downloadButton, closeButton); document.body.appendChild(container);
        Object.assign(container.style, { position: 'fixed', top: '20px', right: '20px', padding: '12px', backgroundColor: '#00c853', color: 'white', zIndex: '99999', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '10px' });
        Object.assign(downloadButton.style, { padding: '5px 10px', border: '1px solid white', borderRadius: '4px', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold' });
        Object.assign(closeButton.style, { background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', padding: '0 5px' });
        downloadButton.onclick = () => {
            try {
                const link = document.createElement('a'); link.href = blobUrl; link.download = filename;
                document.body.appendChild(link); link.click(); document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl); container.remove();
            } catch (e) { console.error(`${SCRIPT_NAME} 原生下载方法出错。`, e); alert('下载时发生错误，请查看控制台。'); }
        };
        closeButton.onclick = () => { URL.revokeObjectURL(blobUrl); container.remove(); };
    }
})();