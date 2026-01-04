// ==UserScript==
// @name         HH3D Video Player - Lệ Phi Vũ
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tua, auto next, menu nổi khi xem phim trên hoathinh3d.gg/xem-phim
// @match        https://hoathinh3d.gg/xem-phim*
// @author       Lệ Phi Vũ
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/540715/HH3D%20Video%20Player%20-%20L%E1%BB%87%20Phi%20V%C5%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/540715/HH3D%20Video%20Player%20-%20L%E1%BB%87%20Phi%20V%C5%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Load từ localStorage
    const savedSec = localStorage.getItem("vh_seek_sec") || "60";
    const savedPercent = localStorage.getItem("vh_auto_next") || "95";

    const style = `
    #vh-menu {
        position: fixed;
        top: 100px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: gold;
        padding: 10px;
        border-radius: 12px;
        z-index: 999999;
        font-family: Arial, sans-serif;
        user-select: none;
        min-width: 200px;
    }
    #vh-menu h3 {
        margin: 0;
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        border-bottom: 1px solid gold;
        border-radius: 12px;
        padding-bottom: 4px;
    }
    #vh-body {
        margin-top: 6px;
    }
    #vh-body.hidden {
        display: none;
    }
    #vh-body input {
        width: 60px;
        background: black;
        color: gold;
        border: 1px solid gold;
        border-radius: 4px;
        margin-left: 5px;
    }
    `;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);

    const menu = document.createElement('div');
    menu.id = 'vh-menu';
    menu.innerHTML = `
        <h3 id="vh-title">🎬 HH3D Xem Phim</h3>
        <div id="vh-body">
            <div>
                Tua đến (giây): <input id="vh-seek-sec" type="number" min="0" value="${savedSec}">
            </div>
            <div>
                Auto Next (%): <input id="vh-next-percent" type="number" min="0" max="100" value="${savedPercent}">
            </div>
        </div>
    `;
    document.body.appendChild(menu);

    // === Cập nhật nhãn tên phim + tập + tiến trình
    function updateTitle() {
        const titleEl = document.querySelector('h1.entry-title a');
        const video = getVideo();
        let titleText = '🎬 HH3D Xem Phim';
        if (titleEl) {
            const fullTitle = titleEl.textContent.trim();
            const match = fullTitle.match(/(.+?) Tập (\d+)/);
            if (match) {
                const name = match[1];
                const ep = match[2];
                titleText = `📺 ${name} - Tập ${ep}`;
            }
        }
        if (video && video.duration) {
            const percent = ((video.currentTime / video.duration) * 100).toFixed(0);
            titleText += ` (${percent}%)`;
        }
        document.getElementById('vh-title').textContent = titleText;
    }

    // === Thu gọn khi click tiêu đề
    document.getElementById('vh-title').addEventListener('click', () => {
        const body = document.getElementById('vh-body');
        body.classList.toggle('hidden');
    });

    // === Lưu khi người dùng thay đổi (chỉ chấp nhận số)
    document.getElementById('vh-seek-sec').addEventListener('change', e => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 0) {
            localStorage.setItem("vh_seek_sec", value.toString());
        } else {
            e.target.value = localStorage.getItem("vh_seek_sec") || "60";
        }
    });
    document.getElementById('vh-next-percent').addEventListener('change', e => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            localStorage.setItem("vh_auto_next", value.toString());
        } else {
            e.target.value = localStorage.getItem("vh_auto_next") || "95";
        }
    });

    // === Tìm video
    function getVideo() {
        return document.querySelector('video');
    }

    // === Theo dõi thời lượng video và cập nhật tiêu đề
    setInterval(() => {
        const video = getVideo();
        if (video && video.duration) {
            const percent = ((video.currentTime / video.duration) * 100).toFixed(1);
            const threshold = parseFloat(document.getElementById('vh-next-percent').value || "95");
            if (percent >= threshold && !video.__nexted) {
                video.__nexted = true;
                const nextBtn = document.querySelector('.epfull .active + a');
                if (nextBtn) {
                    window.location.href = nextBtn.href;
                }
            }
            updateTitle(); // Cập nhật tiêu đề với tiến trình
        }
    }, 1000);

    // === Tua video đến số giây được chỉ định
    function seekToSavedTime() {
        const video = getVideo();
        if (video) {
            const sec = parseFloat(document.getElementById('vh-seek-sec').value);
            if (!isNaN(sec) && sec >= 0) {
                video.currentTime = sec;
            }
        }
    }

    // === Phím tắt
    document.addEventListener('keydown', (e) => {
        const video = getVideo();
        if (!video) return;

        switch (e.key) {
            case '+': {
                const nextBtn = document.querySelector('.luotxem.halim-next-episode');
                if (nextBtn) {
                    nextBtn.click();
                    setTimeout(seekToSavedTime, 1000); // Chờ video tải rồi tua
                }
                break;
            }
            case '-': {
                const prevBtn = document.querySelector('.luotxem.halim-prev-episode');
                if (prevBtn) {
                    prevBtn.click();
                    setTimeout(seekToSavedTime, 1000); // Chờ video tải rồi tua
                }
                break;
            }
            case '*': {
                const sec = parseFloat(document.getElementById('vh-seek-sec').value);
                if (!isNaN(sec) && sec >= 0) video.currentTime = sec;
                break;
            }
        }
    });

    // === Di chuyển menu (hỗ trợ 4 hướng)
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    const title = document.getElementById('vh-title');

    title.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // === Đảm bảo menu hiển thị khi fullscreen
    const ensureMenuInFullscreen = () => {
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (fullscreenElement && !fullscreenElement.contains(menu)) {
            fullscreenElement.appendChild(menu);
            menu.style.zIndex = '999999';
        } else if (!document.body.contains(menu)) {
            document.body.appendChild(menu);
        }
    };

    // Theo dõi sự kiện thay đổi toàn màn hình
    document.addEventListener('fullscreenchange', ensureMenuInFullscreen);
    document.addEventListener('webkitfullscreenchange', ensureMenuInFullscreen);
    document.addEventListener('mozfullscreenchange', ensureMenuInFullscreen);
    document.addEventListener('MSFullscreenChange', ensureMenuInFullscreen);

    // Gọi lần đầu để đảm bảo menu hiển thị đúng
    ensureMenuInFullscreen();
})();