// ==UserScript==
// @name         Music Menu For Sploop.io
// @version      1
// @description  Press P for Menu
// @author       RektByMateX
// @match        *://sploop.io/*
// @icon         https://sploop.io/img/ui/favicon.png
// @grant        none
// @namespace https://greasyfork.org/users/1037154
// @downloadURL https://update.greasyfork.org/scripts/520661/Music%20Menu%20For%20Sploopio.user.js
// @updateURL https://update.greasyfork.org/scripts/520661/Music%20Menu%20For%20Sploopio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const menu = document.createElement('div');
    menu.id = 'music-menu';
    menu.style.position = 'fixed';
    menu.style.top = '0';
    menu.style.right = '-300px';
    menu.style.width = '300px';
    menu.style.height = '100%';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    menu.style.color = '#fff';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.padding = '20px';
    menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    menu.style.transition = 'right 0.5s ease';
    menu.style.zIndex = '10000';
    menu.innerHTML = `
        <h2 style="text-align: center;" id="music-menu-title">Hudební menu</h2>
        <label for="music-url" id="music-url-label">URL písničky (YouTube):</label>
        <input id="music-url" type="text" style="width: 100%; margin-bottom: 10px; padding: 5px;" placeholder="Paste YouTube URL...">
        <label for="start-time" id="start-time-label">Start Time Seconds...):</label>
        <input id="start-time" type="number" style="width: 100%; margin-bottom: 10px; padding: 5px;" placeholder="Seconds...">
        <button id="play-music" style="width: 100%; padding: 10px; margin-bottom: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px;">Přehrát písničku</button>
        <button id="start-video" style="width: 100%; padding: 10px; margin-bottom: 10px; background-color: #2196F3; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px;">START VIDEO</button>
        <button id="stop-music" style="width: 100%; padding: 10px; background-color: #f44336; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px;">Zastavit</button>
        <div id="video-container" style="margin-top: 20px; display: none;">
            <iframe id="video-frame" width="100%" height="200" style="border: none;" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div id="player" style="margin-top: 20px; display: none;"></div>
        <div id="warning" style="margin-top: 20px; color: red; font-weight: bold;">
            <p id="adblock-warning">POUŽITÍ ADBLOCKU VEDE K NEFUNKČNOSTI VYPNITE HO</p>
            <label for="language-select" style="color: white;">Language:</label>
            <select id="language-select" style="width: 100%; padding: 5px;">
                <option value="cz">Čeština</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="vi">Tiếng Việt</option>
                <option value="ar">العربية</option>
            </select>
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB3B;">
            Script By <a href="https://www.youtube.com/@RektByMateX" target="_blank" style="color: #FF4081; font-weight: bold; text-decoration: underline;">RektByMateX</a>
        </div>
    `;
    document.body.appendChild(menu);

    let menuVisible = false;
    function toggleMenu() {
        menu.style.right = menuVisible ? '-300px' : '0';
        menuVisible = !menuVisible;
        console.log('Menu visible:', menuVisible);  // Debugging line
    }

    let player;
    function createYouTubePlayer(videoId, startTime) {
        if (!player) {
            player = new YT.Player('player', {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: { autoplay: 1, start: startTime },
                events: {
                    onReady: (event) => {
                        event.target.playVideo();
                    }
                }
            });
        } else {
            player.loadVideoById(videoId, startTime);
        }
    }

    function stopYouTubePlayer() {
        if (player) {
            player.stopVideo();
        }
        const iframe = document.getElementById('video-frame');
        iframe.src = '';
        document.getElementById('player').style.display = 'none';
        document.getElementById('video-container').style.display = 'none';
    }

    document.getElementById('play-music').addEventListener('click', () => {
        const url = document.getElementById('music-url').value;
        const startTime = parseInt(document.getElementById('start-time').value) || 0;
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
            createYouTubePlayer(videoId, startTime);
            document.getElementById('player').style.display = 'block';
            document.getElementById('video-container').style.display = 'none';
        } else {
            alert('Neplatný YouTube odkaz.');
        }
    });

    document.getElementById('start-video').addEventListener('click', () => {
        const url = document.getElementById('music-url').value;
        const startTime = parseInt(document.getElementById('start-time').value) || 0;
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
            const iframe = document.getElementById('video-frame');
            iframe.src = `https://www.youtube.com/embed/${videoId}?start=${startTime}&autoplay=1`;
            document.getElementById('video-container').style.display = 'block';
            document.getElementById('player').style.display = 'none';
        } else {
            alert('Neplatný YouTube odkaz.');
        }
    });

    document.getElementById('stop-music').addEventListener('click', () => {
        stopYouTubePlayer();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p') {
            toggleMenu();
        }
    });

    function extractYouTubeVideoId(url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);

    document.getElementById('language-select').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    function changeLanguage(language) {
        const translations = {
            cz: {
                'music-menu-title': 'Hudební menu',
                'music-url-label': 'URL písničky (YouTube):',
                'start-time-label': 'Začátek (sekundy):',
                'play-music': 'Přehrát písničku',
                'start-video': 'Spustit Video',
                'stop-music': 'Zastavit',
                'adblock-warning': 'POUŽITÍ ADBLOCKU VEDE K NEFUNKČNOSTI VYPNITE HO',
                'language-btn': 'Vyberte jazyk'
            },
            en: {
                'music-menu-title': 'Music Menu',
                'music-url-label': 'Song URL (YouTube):',
                'start-time-label': 'Start time (seconds):',
                'play-music': 'Play Song',
                'start-video': 'START VIDEO',
                'stop-music': 'Stop',
                'adblock-warning': 'USING ADBLOCK CAUSES FAILURE, PLEASE DISABLE IT',
                'language-btn': 'Languages'
            },
            ru: {
                'music-menu-title': 'Музыкальное меню',
                'music-url-label': 'URL песни (YouTube):',
                'start-time-label': 'Время начала (секунды):',
                'play-music': 'Воспроизвести песню',
                'start-video': 'Запустить видео',
                'stop-music': 'Остановить',
                'adblock-warning': 'Использование Adblock вызывает сбой, пожалуйста, отключите его',
                'language-btn': 'Языки'
            },
            vi: {
                'music-menu-title': 'Menu Nhạc',
                'music-url-label': 'URL bài hát (YouTube):',
                'start-time-label': 'Thời gian bắt đầu (giây):',
                'play-music': 'Phát bài hát',
                'start-video': 'Bắt đầu Video',
                'stop-music': 'Dừng',
                'adblock-warning': 'SỬ DỤNG ADBLOCK GÂY LỖI, VUI LÒNG TẮT NÓ',
                'language-btn': 'Ngôn ngữ'
            },
            ar: {
                'music-menu-title': 'قائمة الموسيقى',
                'music-url-label': 'رابط الأغنية (YouTube):',
                'start-time-label': 'وقت البداية (ثواني):',
                'play-music': 'تشغيل الأغنية',
                'start-video': 'تشغيل الفيديو',
                'stop-music': 'إيقاف',
                'adblock-warning': 'استخدام Adblock يؤدي إلى عطل ، يرجى تعطيله',
                'language-btn': 'اللغات'
            }
        };

        const text = translations[language] || translations.en;
        document.getElementById('music-menu-title').textContent = text['music-menu-title'];
        document.getElementById('music-url-label').textContent = text['music-url-label'];
        document.getElementById('start-time-label').textContent = text['start-time-label'];
        document.getElementById('play-music').textContent = text['play-music'];
        document.getElementById('start-video').textContent = text['start-video'];
        document.getElementById('stop-music').textContent = text['stop-music'];
        document.getElementById('adblock-warning').textContent = text['adblock-warning'];
        document.getElementById('language-btn').textContent = text['language-btn'];
    }
})();