// ==UserScript==
// @name         Click Preview Button
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  Automatically click the JavScript's Preview button, set initial volume and playback speed.
// @author       ChatGPT
// @include      https://javdb*.com/*
// @grant        none
// @license      ChatGPT

// @downloadURL https://update.greasyfork.org/scripts/513227/Click%20Preview%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/513227/Click%20Preview%20Button.meta.js
// ==/UserScript==




// const PREFIX = 'https://get-jav-trailer.lzhjp.duckdns.org/?token=' + TOKEN + '&url=';
const PREFIX = 'http://45.32.23.189:36175/?token=' + TOKEN + '&url=';








const TOKEN = 'SVCvvyEOayAQDnfphGCkKVzDqCNsTLRujleGKvWKyfQ';

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {

        const links = document.querySelectorAll('a');

        // 遍历每个<a>标签
        links.forEach(link => {
            // 检查href是否以 '/actors/' 开头
            if (link.href.startsWith(window.location.origin + '/actors/')) {
                // 如果href中没有 '?t=s,d&sort_type=0'，则追加该内容
                if (!link.href.includes('?t=s,d&sort_type=0')) {
                    link.href += '?t=s,d&sort_type=0';
                }
            }
        });
        //
        //
        //
        //
        
        function modifyVideoAndPlay() {
            const video = document.getElementById('preview-video');
            if (!video) return;

            const source = video.querySelector('source');
            if (!source || !source.src) return;

            const originalSrc = source.src.startsWith('//') ? window.location.protocol + source.src : source.src;
            const newSrc = PREFIX + encodeURIComponent(originalSrc);

            source.src = newSrc;
            video.load();

            video.onloadedmetadata = function () {
                video.currentTime = 4;
                video.playbackRate = 1.5;
                video.volume = 0.25;
                video.muted = false;
                video.loop = true;
                // 延迟播放
                setTimeout(() => {
                    video.play().catch(console.error);
                }, 10);
            };

            // 自动点击 a 标签触发弹窗
            const a = document.querySelector('a.preview-video-container');
            if (a) {
                a.click();
            }
        }

        // 监听 DOM 变化，找到元素后运行
        const observer = new MutationObserver((mutations, obs) => {
            if (document.getElementById('preview-video') && document.querySelector('a.preview-video-container')) {
                modifyVideoAndPlay();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // 冗余保险：页面加载完成后尝试执行一次
        window.addEventListener('load', () => {
            setTimeout(modifyVideoAndPlay, 1000);
        });
        //
        //
        //
        // 获取预览按钮
//         var previewButton = document.querySelector('#x-res button[for="x-video"]');
//         if (previewButton) {
//             // 点击预览按钮
//             previewButton.click();

//             // 等待视频元素加载
//             var video = document.querySelector('#x-video-target');
//             if (video) {
//                 // 设置视频 autoplay, loop 和 preload
//                 video.click();
//                 video.setAttribute('autoplay', 'true');
//                 video.setAttribute('loop', 'true');
//                 video.setAttribute('preload', 'auto');
//                 // video.setAttribute('controls', ''); // 显示控制条
//                 // video.muted = true; // 静音后才可自动播放 // 网站设置>>声音>>允许，即可自动播放非静音视频 
//                 video.playbackRate = 1.75; // 设置初始播放速度为 1.75
//             }
//         }
    });
})();
