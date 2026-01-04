// ==UserScript==
// @name         Zoom 网页字幕下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  下载 Zoom 网页版会议实时字幕为 txt 文件
// @author       YJ
// @match        https://*.zoom.us/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531001/Zoom%20%E7%BD%91%E9%A1%B5%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531001/Zoom%20%E7%BD%91%E9%A1%B5%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建下载按钮
    function createDownloadButton() {
        const btn = document.createElement('button');
        btn.innerText = '📥 下载字幕 (.txt)';
        btn.style.position = 'fixed';
        btn.style.top = '80px';
        btn.style.right = '20px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#0f62fe';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.onclick = downloadTranscript;
        document.body.appendChild(btn);
    }

    // 提取并下载字幕
    function downloadTranscript() {
        const items = document.querySelectorAll('.lt-full-transcript__item');
        if (items.length === 0) {
            alert('未找到字幕内容，请确保字幕窗口已打开。');
            return;
        }

        let transcript = '';
        items.forEach(item => {
            const time = item.querySelector('.lt-full-transcript__time')?.innerText?.trim() || '';
            const name = item.querySelector('.lt-full-transcript__display-name')?.innerText?.trim() || '';
            const message = item.querySelector('.lt-full-transcript__message')?.innerText?.trim() || '';
            transcript += `[${time}] ${name ? name + ': ' : ''}${message}\n`;
        });

        const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'zoom_transcript.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 等待页面加载字幕元素
    function waitForTranscript() {
        const checkInterval = setInterval(() => {
            const exists = document.querySelector('.lt-full-transcript__item');
            if (exists) {
                clearInterval(checkInterval);
                createDownloadButton();
            }
        }, 1000);
    }

    waitForTranscript();
})();
