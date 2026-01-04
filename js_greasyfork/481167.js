// ==UserScript==
// @name         王者荣耀音频下载命名
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  批量下载王者荣耀单英雄页面语音，文件用台词命名。为了防止反爬，每秒下载5个。
// @author       You
// @match        https://world.honorofkings.com/*
// @match        https://pvp.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=honorofkings.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481167/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/481167/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadAudio(mp3URL, speechText, index) {
        return new Promise(resolve => {
            fetch(mp3URL)
                .then(response => response.blob())
                .then(blob => {
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `${index + 1}_${speechText}.mp3`;
                    link.click();
                })
                .catch(error => console.error('Error downloading audio:', error))
                .finally(resolve);
        });
    }

    async function autoDownloadAudio() {
        const voiceItems = document.querySelectorAll('.dinfo-voice-item');

        for (let index = 0; index < voiceItems.length; index++) {
            const voiceItem = voiceItems[index];
            const mp3URL = voiceItem.getAttribute('data-mp3');
            const speechText = voiceItem.querySelector('span').textContent.trim();

            // 下载音频文件
            await downloadAudio(mp3URL, speechText, index);

            // 添加下载延迟（每秒5个）
            if (index % 5 === 4) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒
            }
        }
    }

    // 创建一键下载按钮
    const downloadAllButton = document.createElement('button');
    downloadAllButton.textContent = '下载该英雄所有音频';
    downloadAllButton.style.position = 'fixed';
    downloadAllButton.style.top = '10px';
    downloadAllButton.style.left = '10px';
    downloadAllButton.style.zIndex = '999'; // 添加 z-index
    downloadAllButton.addEventListener('click', autoDownloadAudio);
    downloadAllButton.style.border = '1px solid #e4c289';
    downloadAllButton.style.color = '#e4c289';
    downloadAllButton.style.background = '#151515';
    downloadAllButton.style.padding = '0.5em 1em';

    // 将按钮添加到页面
    document.body.appendChild(downloadAllButton);
})();