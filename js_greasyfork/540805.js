// ==UserScript==
// @name         englishnewsinlevels.com增强播放
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  EnglishNewsInLevels 页面根据 level-1/2/3 自动提取对应音频文件并添加播放器
// @match        https://englishnewsinlevels.com/news/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540805/englishnewsinlevelscom%E5%A2%9E%E5%BC%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/540805/englishnewsinlevelscom%E5%A2%9E%E5%BC%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        // 从 URL 提取等级数字，比如 level-1/level-2/level-3
        const urlMatch = window.location.pathname.match(/level-(\d+)/);
        if (!urlMatch) {
            console.warn('[TM] URL 中未匹配到 level-x');
            return;
        }
        const levelNum = urlMatch[1];
        const targetSuffix = `level-${levelNum}.mp3`;
        console.log(`[TM] 目标音频后缀：${targetSuffix}`);

        const html = document.documentElement.innerHTML;
        const regex = new RegExp(`https?:\/\/[^"'<>]+${targetSuffix}`, 'g');
        const matches = Array.from(html.matchAll(regex));

        if (matches.length === 0) {
            console.error(`[TM] 未找到以 ${targetSuffix} 结尾的音频文件`);
            return;
        }

        const mp3Url = matches[0][0];
        console.log(`[TM] 找到 MP3：${mp3Url}`);

        const audio = document.createElement('audio');
        audio.src = mp3Url;
        audio.controls = true;
        audio.loop = true;

        // 样式：左上角，较大播放器，白底黑边
        audio.style.position = 'fixed';
        audio.style.top = '80px';
        audio.style.left = '20px';
        audio.style.zIndex = 9999;
        audio.style.width = '400px';
        audio.style.height = '60px';
        audio.style.backgroundColor = 'white';
        audio.style.border = '2px solid black';
        audio.style.borderRadius = '8px';

        document.body.appendChild(audio);
        console.log('[TM] 播放器已添加（自动匹配等级）');
    });
})();
