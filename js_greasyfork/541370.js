// ==UserScript==
// @name         Metruyencv - Tự động đọc truyện (v2.3)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Bản hoàn thiện: Tự động cuộn chậm xuống 4/5 trang và click "Chương sau" sau mỗi 45 giây.
// @author       Đối tác lập trình
// @match        *://metruyencv.com/truyen/*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541370/Metruyencv%20-%20T%E1%BB%B1%20%C4%91%E1%BB%99ng%20%C4%91%E1%BB%8Dc%20truy%E1%BB%87n%20%28v23%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541370/Metruyencv%20-%20T%E1%BB%B1%20%C4%91%E1%BB%99ng%20%C4%91%E1%BB%8Dc%20truy%E1%BB%87n%20%28v23%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Biến cấu hình ---
    const INTERVAL_SECONDS = 45;
    const NEXT_CHAPTER_SELECTOR = 'button[data-x-bind="GoNext"]';
    const STORAGE_KEY = 'autoClickModeActive';

    // --- Biến trạng thái toàn cục ---
    let startButton;
    let pageTimeoutID = null;
    let countdownIntervalID = null;
    let lastUrl = '';

    // --- Các hàm xử lý ---

    function slowScroll(targetY, duration) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const currentPosition = startY + (distance * progress);
            
            window.scrollTo(0, currentPosition);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        requestAnimationFrame(animation);
    }

    function waitForElement(selector, callback, timeout = 5000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
            }
        }, 200);
    }

    function clickNextChapter() {
        waitForElement(NEXT_CHAPTER_SELECTOR, (element) => element.click());
    }

    function stopAutoClick() {
        sessionStorage.removeItem(STORAGE_KEY);
        clearTimeout(pageTimeoutID);
        clearInterval(countdownIntervalID);
        if (startButton) updateButtonUI(false);
    }

    function startAutoClick() {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        clickNextChapter();
    }

    function toggleAutoClick() {
        const isRunning = sessionStorage.getItem(STORAGE_KEY) === 'true';
        if (isRunning) stopAutoClick();
        else startAutoClick();
    }

    function updateButtonUI(isRunning) {
        if (!startButton) return;
        if (isRunning) {
            startButton.innerHTML = `Sẽ chuyển sau: ${INTERVAL_SECONDS}s`;
            startButton.style.backgroundColor = '#28a745';
        } else {
            startButton.innerHTML = `Đọc rảnh tay (${INTERVAL_SECONDS}s)`;
            startButton.style.backgroundColor = '#a333c8';
        }
    }

    function startVisualCountdown() {
        let remaining = INTERVAL_SECONDS;
        clearInterval(countdownIntervalID);
        countdownIntervalID = setInterval(() => {
            remaining--;
            if (startButton) startButton.innerHTML = `Sẽ chuyển sau: ${remaining}s`;
            if (remaining <= 0) clearInterval(countdownIntervalID);
        }, 1000);
    }

    function setupButton() {
        if (document.getElementById('autoReadButton')) return;
        startButton = document.createElement('button');
        startButton.id = 'autoReadButton';
        document.body.appendChild(startButton);
        startButton.addEventListener('click', toggleAutoClick);
    }

    function runScriptForPage() {
        setupButton();
        clearTimeout(pageTimeoutID);
        clearInterval(countdownIntervalID);

        const isAutoMode = sessionStorage.getItem(STORAGE_KEY) === 'true';
        updateButtonUI(isAutoMode);

        if (isAutoMode) {
            startVisualCountdown();

            const scrollDuration = (INTERVAL_SECONDS - 5) * 1000;
            setTimeout(() => {
                const pageHeight = document.documentElement.scrollHeight;
                // THAY ĐỔI: Vị trí cuộn mới là 4/5 trang
                const targetY = (pageHeight * 4) / 5;
                slowScroll(targetY, scrollDuration);
            }, 500);

            pageTimeoutID = setTimeout(clickNextChapter, INTERVAL_SECONDS * 1000);
        }
    }

    // --- "Người canh gác" theo dõi URL ---
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            runScriptForPage();
        }
    }, 500);

    // --- Thêm CSS ---
    GM_addStyle(`
        #autoReadButton {
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            padding: 10px 15px; background-color: #a333c8; color: white;
            border: none; border-radius: 5px; font-size: 14px; font-weight: bold;
            cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s, transform 0.2s;
        }
        #autoReadButton:hover { transform: scale(1.05); }
    `);
})();