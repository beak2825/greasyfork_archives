// ==UserScript==
// @name         炫彩音符
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a music control with colorful "Linux" text at the top right of the page, with a music icon on the top right of the letter 'x'.
// @author       You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493409/%E7%82%AB%E5%BD%A9%E9%9F%B3%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/493409/%E7%82%AB%E5%BD%A9%E9%9F%B3%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载Font Awesome，并在加载完成后初始化脚本
    loadFontAwesome(function() {
        initializeMusicControl();
    });

    function loadFontAwesome(callback) {
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
        link.rel = 'stylesheet';
        link.onload = callback;  // 确保字体图标加载后再执行回调
        document.head.appendChild(link);
    }

    function initializeMusicControl() {
        const musicContainer = document.createElement('div');
        musicContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; display: flex; align-items: center;';

        const songs = [
            "https://mr3.doubanio.com/e58224bcd283b28da8884fd8be08e7e5/0/fm/song/p2741085_128k.mp4",
            "https://mr1.doubanio.com/15f4e360c4f05f4c84bcd7fc722aeb17/0/fm/song/p14581450_128k.mp3",
            "https://mr3.doubanio.com/2648b1b518bbcdbe36834ed11e0d3a5f/0/fm/song/p2937377_128k.mp4",
            "https://vt1.doubanio.com/audio/la_donna_romantica.mp3"
        ];
        let currentSong = 0;
        const audio = document.createElement('audio');
        audio.src = songs[currentSong];
        audio.style.display = 'none';
        document.body.appendChild(audio);
        audio.addEventListener('ended', switchSong);  // 自动播放下一首

        const textColors = ['#FF6347', '#FFD700', '#00BFFF', '#32CD32', '#FF69B4'];
        "LINUX".split('').forEach((char, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char;
            letterSpan.style.color = textColors[index % textColors.length];
            letterSpan.style.fontSize = '14px';
            letterSpan.style.position = 'relative';
            letterSpan.style.cursor = 'pointer';
            musicContainer.appendChild(letterSpan);
            letterSpan.addEventListener('click', togglePlayPause);
            letterSpan.addEventListener('dblclick', function(event) {
                switchSong();
                event.stopPropagation();  // 防止双击事件同时触发单击事件
            });

            if (char === 'X') {
                const musicIcon = document.createElement('i');
                musicIcon.className = 'fas fa-music';
                musicIcon.style.cssText = 'font-size: 12px; color: #1E90FF; position: absolute; top: -10px; right: -10px;';
                letterSpan.appendChild(musicIcon);
            }
        });

        document.body.appendChild(musicContainer);

        function togglePlayPause() {
            if (audio.paused) {
                audio.play();
                updateIcons('#32CD32');  // Green when playing
            } else {
                audio.pause();
                updateIcons('#1E90FF');  // Blue when paused
            }
        }

        function switchSong() {
            currentSong = (currentSong + 1) % songs.length;
            audio.src = songs[currentSong];
            audio.play();
        }

        function updateIcons(color) {
            musicContainer.querySelectorAll('i').forEach(icon => {
                icon.style.color = color;
            });
        }
    }
})();