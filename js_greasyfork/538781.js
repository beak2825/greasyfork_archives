// ==UserScript==
// @name         YouTube God Menu v5.3
// @namespace    Marley
// @version      5.3
// @description  Smaller, scrollable, clean black YouTube mod menu with drag and hide features.
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538781/YouTube%20God%20Menu%20v53.user.js
// @updateURL https://update.greasyfork.org/scripts/538781/YouTube%20God%20Menu%20v53.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MENU_ID = 'yt-god-menu';

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = MENU_ID;

        const savedTop = localStorage.getItem('ytMenuTop') || '60px';
        const savedLeft = localStorage.getItem('ytMenuLeft') || '10px';

        Object.assign(menu.style, {
            position: 'fixed',
            top: savedTop,
            left: savedLeft,
            zIndex: '99999',
            background: '#000000',            // pure black background
            color: '#ddd',                   // light grey text
            border: '1px solid #444',       // subtle border
            padding: '8px 12px',
            fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
            borderRadius: '10px',
            width: '180px',
            maxHeight: '320px',
            fontSize: '12px',
            boxShadow: '0 6px 20px rgba(255, 0, 0, 0.5)',
            userSelect: 'none',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            overflowY: 'auto',               // scroll vertical if content too tall
            scrollbarWidth: 'thin',
            scrollbarColor: '#ff0000 #222',
        });

        // Drag bar (smaller height)
        const dragBar = document.createElement('div');
        dragBar.textContent = '📺 YouTube God Menu';
        Object.assign(dragBar.style, {
            cursor: 'grab',
            fontWeight: '700',
            marginBottom: '8px',
            background: '#111',           // slightly lighter black
            padding: '6px 10px',
            borderRadius: '8px',
            boxShadow: '0 3px 8px rgba(255, 0, 0, 0.6)',
            color: '#ff3c3c',             // bright red text
            userSelect: 'none',
            fontSize: '13px',
            textAlign: 'center',
            letterSpacing: '0.04em',
        });

        // Drag logic
        let isDragging = false;
        dragBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            menu.dataset.offsetX = e.clientX - menu.offsetLeft;
            menu.dataset.offsetY = e.clientY - menu.offsetTop;
            dragBar.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newX = e.clientX - menu.dataset.offsetX;
                let newY = e.clientY - menu.dataset.offsetY;

                // Keep menu inside viewport horizontally
                newX = Math.max(0, Math.min(window.innerWidth - menu.offsetWidth, newX));
                // Keep menu inside viewport vertically
                newY = Math.max(0, Math.min(window.innerHeight - menu.offsetHeight, newY));

                menu.style.left = `${newX}px`;
                menu.style.top = `${newY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('ytMenuTop', menu.style.top);
                localStorage.setItem('ytMenuLeft', menu.style.left);
                dragBar.style.cursor = 'grab';
            }
        });

        menu.appendChild(dragBar);

        // Toggle menu content button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Hide';
        styleButton(toggleBtn);
        toggleBtn.style.marginBottom = '8px';
        toggleBtn.onclick = () => {
            if (wrapper.style.display !== 'none') {
                wrapper.style.display = 'none';
                toggleBtn.textContent = 'Show';
            } else {
                wrapper.style.display = 'block';
                toggleBtn.textContent = 'Hide';
            }
        };
        menu.appendChild(toggleBtn);

        // Content wrapper
        const wrapper = document.createElement('div');
        menu.appendChild(wrapper);

        const video = () => document.querySelector('video');

        // Helper to create styled buttons
        function styleButton(btn) {
            Object.assign(btn.style, {
                width: '100%',
                margin: '5px 0',
                padding: '6px',
                border: 'none',
                borderRadius: '7px',
                background: '#1a1a1a',
                color: '#ff4d4d',              // soft red text
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(255, 0, 0, 0.3)',
                transition: 'background-color 0.25s ease',
                fontSize: '12px',
                userSelect: 'none',
            });
            btn.onmouseenter = () => (btn.style.background = '#330000');
            btn.onmouseleave = () => (btn.style.background = '#1a1a1a');
        }

        // Add a button helper
        function addBtn(text, action) {
            const btn = document.createElement('button');
            btn.textContent = text;
            styleButton(btn);
            btn.onclick = action;
            wrapper.appendChild(btn);
        }

        // Playback Controls
        addBtn('▶️ +10s', () => video() && (video().currentTime += 10));
        addBtn('⏪ -10s', () => video() && (video().currentTime -= 10));
        addBtn('⏩ 2x Speed', () => video() && (video().playbackRate = 2));
        addBtn('🐢 0.5x Speed', () => video() && (video().playbackRate = 0.5));
        addBtn('⏸ 1x Speed', () => video() && (video().playbackRate = 1));
        addBtn('🔁 Loop', () => {
            if (!video()) return;
            video().loop = !video().loop;
            alert('Loop: ' + (video().loop ? 'ON' : 'OFF'));
        });

        // Volume Controls
        addBtn('🔊 Volume +10%', () => video() && (video().volume = Math.min(1, video().volume + 0.1)));
        addBtn('🔉 Volume -10%', () => video() && (video().volume = Math.max(0, video().volume - 0.1)));
        addBtn('🔇 Mute/Unmute', () => video() && (video().muted = !video().muted));

        // Display / UI Controls
        addBtn('🎞️ Theater Mode', () => document.querySelector('.ytp-size-button')?.click());
        addBtn('📺 Captions', () => document.querySelector('.ytp-subtitles-button')?.click());
        addBtn('🔁 Autoplay Toggle', () => document.querySelector('ytd-toggle-button-renderer')?.click());
        addBtn('🔳 Mini Player', () => document.querySelector('.ytp-miniplayer-button')?.click());

        // Dark Mode toggle
        addBtn('🌙 Toggle Dark Mode', () => {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        });

        // Light Mode toggle
        addBtn('🌞 Toggle Light Mode', () => {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        });

        // Clear UI toggle
        let hidden = false;
        addBtn('🧹 Toggle Sidebar', () => {
            ['#secondary', '#comments', '#related'].forEach(sel => {
                const el = document.querySelector(sel);
                if (el) el.style.display = hidden ? '' : 'none';
            });
            hidden = !hidden;
        });

        // Game Mode toggle
        let gameMode = false;
        addBtn('🎮 Game Mode', () => {
            const html = document.documentElement;
            const vid = video();
            if (!vid) return;
            if (!gameMode) {
                html.style.overflow = 'hidden';
                document.querySelector('ytd-app').style.display = 'none';
                Object.assign(vid.style, {
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999,
                });
            } else {
                html.style.overflow = '';
                document.querySelector('ytd-app').style.display = '';
                Object.assign(vid.style, {
                    position: '', width: '', height: '', top: '', left: '', zIndex: '',
                });
            }
            gameMode = !gameMode;
        });

        // Popout Window
        addBtn('🪟 Popout Window', () => {
            window.open(window.location.href, '_blank', 'width=900,height=600');
        });

        // Reload Page
        addBtn('🔄 Reload', () => location.reload());

        // Download Video (opens third-party downloader)
        addBtn('📥 Download Video', () => {
            const videoUrl = window.location.href;
            const downloadService = 'https://yt1s.com/en15/youtube-to-mp4';
            const url = `${downloadService}?q=${encodeURIComponent(videoUrl)}`;
            window.open(url, '_blank');
        });

        document.body.appendChild(menu);
    }

    function waitForVideo() {
        if (document.querySelector('video')) {
            createMenu();
        } else {
            setTimeout(waitForVideo, 1000);
        }
    }

    waitForVideo();
})();
