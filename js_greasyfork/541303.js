// ==UserScript==
// @name         屏幕录制按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面右下角添加屏幕录制按钮，录制后自动下载视频
// @author       你的名字
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541303/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/541303/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止重复插入
    if (window.hasScreenRecorderButton) return;
    window.hasScreenRecorderButton = true;

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '开始录屏';
    btn.style.position = 'fixed';
    btn.style.right = '30px';
    btn.style.bottom = '30px';
    btn.style.zIndex = 99999;
    btn.style.padding = '12px 20px';
    btn.style.background = '#1976d2';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '16px';

    document.body.appendChild(btn);

    let mediaRecorder;
    let recordedChunks = [];

    btn.onclick = async function() {
        if (btn.textContent === '开始录屏') {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });
                recordedChunks = [];
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = function(e) {
                    if (e.data.size > 0) {
                        recordedChunks.push(e.data);
                    }
                };

                mediaRecorder.onstop = function() {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'screen-recording.webm';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 100);
                };

                mediaRecorder.start();
                btn.textContent = '结束录屏';

                // 录制时关闭流后自动停止
                stream.getVideoTracks()[0].onended = () => {
                    if (mediaRecorder.state !== 'inactive') {
                        mediaRecorder.stop();
                        btn.textContent = '开始录屏';
                    }
                };
            } catch (err) {
                alert('录屏失败：' + err.message);
            }
        } else if (btn.textContent === '结束录屏') {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
            btn.textContent = '开始录屏';
        }
    };
})();