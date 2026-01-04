// ==UserScript==
// @name         Giữ chuột trái để tua nhanh video
// @name:en         Video Speed Controller with Persistent Speed (Auto Reload on Selection)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Giữ chuột trái để phát video ở tốc độ 2x, nhả chuột để trở lại bình thường. Middle click to toggle video speed and hold mouse to temporarily speed up. Speed updates apply instantly. Persistent menu with options like x0.75, x1.25, x3.0, etc.
// @description:en  Middle click to toggle video speed and hold mouse to temporarily speed up. Toggle/hold to speed up video, mark selected speed with ✔, and reload page automatically to apply changes instantly. Supports persistent speed options like x0.5, x0.75, x1.25, x1.5, x2.0, x3.0, and reset to x1.0 default.
// @author       Hoàng Nam
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license            MIT2
// @downloadURL https://update.greasyfork.org/scripts/534175/Gi%E1%BB%AF%20chu%E1%BB%99t%20tr%C3%A1i%20%C4%91%E1%BB%83%20tua%20nhanh%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/534175/Gi%E1%BB%AF%20chu%E1%BB%99t%20tr%C3%A1i%20%C4%91%E1%BB%83%20tua%20nhanh%20video.meta.js
// ==/UserScript==





(function () {
    'use strict';

    let video = null;              // Biến lưu phần tử video đang hoạt động
    let indicator = null;          // Biến hiển thị chữ "x2", "x1.25", ...
	let indicatorTimeout = null;   // Biến timeout để ẩn hộp sau vài giây
    let holdTimeout = null;        // Biến lưu timeout khi giữ chuột
    let isHeld = false;            // Đánh dấu nếu đang giữ chuột

    const normalSpeed = 1.0;       // Tốc độ mặc định của video
    const speedOptions = [0.25, 0.5, 0.75, 1.25, 1.5, 2.0, 3.0];  // Các tùy chọn tốc độ nhanh
    let fastSpeed = normalSpeed;  // Tốc độ sẽ được áp dụng khi tăng tốc

    // Tải tốc độ đã lưu trước đó từ bộ nhớ
    async function loadStoredSpeed() {
        const stored = await GM_getValue('fastSpeed', normalSpeed);
        fastSpeed = parseFloat(stored);
    }

    // Lưu tốc độ mới và reload trang để áp dụng ngay
    async function setStoredSpeed(speed) {
        fastSpeed = speed;
        await GM_setValue('fastSpeed', speed);
        location.reload(); // Tự động làm mới trang
    }

    // Tạo hộp thông báo tốc độ (ví dụ: x2)
    function createIndicator(videoElement) {
        if (indicator) indicator.remove();

        indicator = document.createElement('div');
        indicator.textContent = `x${fastSpeed}`;
        Object.assign(indicator.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '4px 8px',
            borderRadius: '4px',
            zIndex: 9999,
            display: 'none',
            fontFamily: 'Arial, sans-serif',
            pointerEvents: 'none'
        });

        const container = videoElement.parentElement;
        const style = window.getComputedStyle(container);
        // Nếu container không có vị trí thì thêm relative để định vị
        if (style.position === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(indicator);
    }

    // Cập nhật nội dung của hộp hiển thị tốc độ
    function updateIndicatorText() {
        if (indicator) {
            indicator.textContent = `x${video ? video.playbackRate.toFixed(2) : fastSpeed}`;
        }
    }

    // Tìm thẻ video và áp dụng tốc độ nếu cần

    function findAndBindVideo() {
    // Tìm video đang hiển thị trên trang (ví dụ OK.ru)
    let found = document.querySelector('video, #video-player, .vp_video, video.player-media, div.player, div.plyr__video-wrapper');
    // Nếu không có, thử video trong .vp_video
    if (!found) {
        found = document.querySelector('.vp_video video');
    }

    if (!found) {
        // Tìm video được nhúng dưới blob hoặc load động
        const videos = Array.from(document.querySelectorAll('video'));

        for (let v of videos) {
            if (v.readyState > 0 && v.duration > 0) {
                found = v;
                break;
            }
        }
    }

        if (found && found !== video && found.contains(event.target)) {
            video = found;
            createIndicator(video);
// Đoạn script của bạn đang có một chỗ khiến video ngay lập tức áp dụng tốc độ fastSpeed khi được phát hiện,
// if (fastSpeed !== normalSpeed) {
//     video.playbackRate = fastSpeed;
// }

        }
    }

    // Hiển thị hộp tốc độ
function showIndicator() {
    if (indicator) {
        updateIndicatorText();
        indicator.style.display = 'block';


    }
}


    // Ẩn hộp tốc độ
    function hideIndicator() {
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // Khi nhấn chuột: xử lý middle click và giữ chuột
    function onMouseDown(event) {
        if (!video) return;

        if (event.button === 1) { // Nếu là nhấn nút chuột giữa
            if (video.playbackRate === normalSpeed) {
                video.playbackRate = fastSpeed;
                showIndicator();
            } else {
                video.playbackRate = normalSpeed;
                hideIndicator();
            }
            event.preventDefault(); // Ngăn chặn hành vi mặc định (như scroll)
            return;
        }

        // Nếu là chuột trái/phải, chuẩn bị tăng tốc sau khi giữ 600ms
        holdTimeout = setTimeout(() => {
            video.playbackRate = fastSpeed;
            showIndicator();
            isHeld = true;
        }, 600);
    }

    // Khi nhả chuột: trở lại tốc độ bình thường nếu đang giữ
    function onMouseUp() {
        clearTimeout(holdTimeout);
        if (isHeld && video) {
            video.playbackRate = normalSpeed;
            hideIndicator();
            isHeld = false;
        }
    }

    // Tạo menu và đánh dấu tốc độ đã chọn bằng dấu ✔
    async function setupMenuCommands() {
        const storedSpeed = await GM_getValue('fastSpeed', normalSpeed);

        speedOptions.forEach(speed => {
            const label = speed === storedSpeed
                ? `✅ Set Fast Speed to x${speed}`  // Đánh dấu nếu trùng với đã lưu
                : `Set Fast Speed to x${speed}`;
            GM_registerMenuCommand(label, () => {
                setStoredSpeed(speed);  // Khi chọn thì lưu và reload
            });
        });

        const resetLabel = storedSpeed === normalSpeed
            ? '✅ Đặt lại về mặc định (x1.0)'
            : 'Đặt lại về mặc định (x1.0)';
        GM_registerMenuCommand(resetLabel, () => {
            setStoredSpeed(normalSpeed);  // Đặt lại về mặc định
        });
    }

    // Hàm khởi động chính
    async function init() {
        await loadStoredSpeed();     // Tải tốc độ lưu sẵn
        setupMenuCommands();         // Tạo menu tùy chọn tốc độ

        // Gắn sự kiện chuột
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseout', onMouseUp); // Khi chuột rời khỏi cửa sổ

        // Theo dõi DOM để phát hiện video mới xuất hiện
        const observer = new MutationObserver(() => {
            findAndBindVideo();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Tìm video nếu đã có sẵn khi trang tải
        findAndBindVideo();
    }

    init(); // Bắt đầu chạy

})();







