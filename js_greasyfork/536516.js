// ==UserScript==
// @name         YouTube Screenshot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Take screenshots of YouTube videos with P key
// @author       rushplayer
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536516/YouTube%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/536516/YouTube%20Screenshot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getVideoElement() {
        return document.querySelector('video');
    }

    function captureFrame(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // 设置跨域属性
        video.crossOrigin = 'anonymous';
        
        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // 检查是否截图成功
            const imageData = ctx.getImageData(0, 0, 1, 1).data;
            if (imageData[0] === 0 && imageData[1] === 0 && imageData[2] === 0) {
                throw new Error('Black frame detected');
            }
            return canvas;
        } catch (e) {
            console.error('截图失败:', e);
            alert('截图失败: 请确保视频已加载并尝试再次按P键');
            return null;
        }
    }

    function downloadImage(canvas) {
        const now = new Date();
        const filename = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.jpg`;
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg', 0.8);
        link.click();
    }

    function handleKeyPress(e) {
        if (e.key.toLowerCase() === 'p') {
            const video = getVideoElement();
            if (video) {
                const canvas = captureFrame(video);
                if (canvas) downloadImage(canvas);
            }
        }
    }

    document.addEventListener('keydown', handleKeyPress);
})();
