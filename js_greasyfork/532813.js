// ==UserScript==
// @name         LMS360 - Chặn Thời Gian
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Giao diện hiện đại + Chặn bộ đếm + Kéo thả
// @author       Vo Quan
// @match        *://lms360.edu.vn/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532813/LMS360%20-%20Ch%E1%BA%B7n%20Th%E1%BB%9Di%20Gian.user.js
// @updateURL https://update.greasyfork.org/scripts/532813/LMS360%20-%20Ch%E1%BA%B7n%20Th%E1%BB%9Di%20Gian.meta.js
// ==/UserScript==

(function () {
    'use strict';

let isEnabled = false; // Luôn mặc định bật khi load trang

    function blockTimers() {
        if (!isEnabled) return;

        console.log("[Script] Đã chặn bộ đếm thời gian!");

        window.setInterval = () => 0;
        window.setTimeout = () => 0;

        for (let i = 1; i < 99999; i++) {
            clearInterval(i);
            clearTimeout(i);
        }

        document.addEventListener("visibilitychange", e => e.stopImmediatePropagation(), true);
        window.onbeforeunload = null;
        window.onunload = null;

        window.addEventListener("beforeunload", e => e.stopImmediatePropagation(), true);
        performance.now = () => 0;
    }

    // ============ Timer ============

    let timerInterval;
    let seconds = 0;

    function startTimer() {
        const display = document.getElementById("timer-display");
        clearInterval(timerInterval);
        seconds = 0;
        display.textContent = "00:00:00";

        timerInterval = setInterval(() => {
            seconds++;
            let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
            let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            let secs = String(seconds % 60).padStart(2, '0');
            display.textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }

    // ============ UI =============

    const uiBox = document.createElement("div");
    uiBox.id = "lms-ui-pro";
    uiBox.innerHTML = `
        <div class="lms-box">
            <div class="header" id="drag-handle">
                <div class="logo">
                    <svg width="20" height="20" fill="#00FFC8" viewBox="0 0 24 24"><path d="M5 3a2 2 0 0 0-2 2v2h18V5a2 2 0 0 0-2-2H5zM3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3zm8 3h2v5h-2v-5z"/></svg>
                    <span>Chặn thời gian</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="toggle-script" ${isEnabled ? "checked" : ""}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="status">
                <strong>Trạng thái:</strong> <span id="status">${isEnabled ? "Đang bật" : "Đã tắt"}</span>
            </div>
            <div class="timer">
                <svg width="16" height="16" fill="#00FFC8" viewBox="0 0 24 24"><path d="M12 8v5l4.28 2.54.72-1.21-3.5-2.08V8z"/><path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"/></svg>
                <span id="timer-display">00:00:00</span>
            </div>
        </div>

        <style>
#lms-ui-pro {
    position: fixed;
    top: 30px;
    left: 30px;
    z-index: 99999;
    animation: fadeSlideIn 0.5s ease-out;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    will-change: transform;
    max-width: 100vw;
    box-sizing: border-box;
}

.lms-box {
    background: #1f1f1f;
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 12px 25px rgba(0, 255, 200, 0.2);
    font-family: 'Segoe UI', sans-serif;
    color: #eee;
    width: 280px;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    user-select: none;
    box-sizing: border-box;
}

.lms-box:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(0, 255, 200, 0.3);
}

.lms-box.pressed {
    transform: scale(0.80);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: bold;
    color: #00FFC8;
    font-size: 16px;
}

.status,
.timer {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    font-size: 15px;
}

#timer-display {
    font-weight: bold;
    color: #00FFC8;
    font-size: 17px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 52px;
    height: 28px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #555;
    transition: 0.4s;
    border-radius: 34px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
}

.slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

input:checked + .slider {
    background-color: #00FFC8;
    box-shadow: 0 0 8px rgba(0, 255, 200, 0.6);
}

input:checked + .slider:before {
    transform: translateX(24px);
    background-color: #fff;
}

.switch:hover .slider {
    background-color: #00e6b2;
    box-shadow: 0 0 5px rgba(0, 255, 200, 0.22);
    transition: 0.3s ease;
}

@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}


/* 📱 Responsive cho mobile portrait */
@media (max-width: 480px) {
    #lms-ui-pro {
        top: 10px !important;
        left: 10px !important;
        max-width: 90vw;
    }

    .lms-box {
        width: 260px !important;
        font-size: 13px;
        padding: 12px;
    }

    #timer-display {
        font-size: 15px;
    }

    .switch {
        transform: scale(0.85);
    }

    .logo svg {
        width: 16px;
        height: 16px;
    }
}

        </style>
    `;

    document.body.appendChild(uiBox);

    const timerDiv = document.querySelector("#lms-ui-pro .timer");
    if (timerDiv) {
        timerDiv.style.opacity = "0";
        timerDiv.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        timerDiv.style.transform = "translateY(20px)";
        requestAnimationFrame(() => {
            timerDiv.style.opacity = "1";
            timerDiv.style.transform = "translateY(0)";
        });
    }

    if (isEnabled) blockTimers();
    startTimer();

document.getElementById("toggle-script").addEventListener("change", function () {
    isEnabled = this.checked;
    document.getElementById("status").innerText = isEnabled ? "Đang bật" : "Đã tắt";
    if (isEnabled) blockTimers(); else location.reload();
});


// ============ Drag & Interaction (PC + Mobile + mượt hơn) ============
const lmsBox = document.querySelector("#lms-ui-pro .lms-box");
const dragTarget = document.querySelector("#lms-ui-pro");
const dragHandle = document.querySelector("#lms-ui-pro"); // Toàn bộ khung kéo được

let isMouseDown = false;
let dragging = false;
let offsetX = 0, offsetY = 0;
let touchMoved = false;

// Tạo lớp chặn iframe
const iframeBlocker = document.createElement("div");
iframeBlocker.style.position = "fixed";
iframeBlocker.style.top = "0";
iframeBlocker.style.left = "0";
iframeBlocker.style.width = "100vw";
iframeBlocker.style.height = "100vh";
iframeBlocker.style.zIndex = "99998";
iframeBlocker.style.display = "none";
iframeBlocker.style.cursor = "grabbing";
document.body.appendChild(iframeBlocker);

function handlePressStart(e) {
    if (e.target.closest('.switch')) return;
    isMouseDown = true;
    lmsBox.classList.add("pressed");
}

function handlePressEnd() {
    if (isMouseDown) {
        lmsBox.classList.remove("pressed");
        isMouseDown = false;
    }
}

function startDrag(x, y) {
    dragging = true;
    iframeBlocker.style.display = "block"; // Chặn iframe
    const rect = dragTarget.getBoundingClientRect();
    offsetX = x - rect.left;
    offsetY = y - rect.top;
    document.body.style.userSelect = "none";
}

function duringDrag(x, y) {
    if (!dragging) return;
    dragTarget.style.left = `${x - offsetX}px`;
    dragTarget.style.top = `${y - offsetY}px`;
}

function stopDrag() {
    dragging = false;
    iframeBlocker.style.display = "none"; // Gỡ chặn iframe
    document.body.style.userSelect = "";
}

// PC events
dragHandle.addEventListener("mousedown", (e) => {
    if (e.target.closest('.switch')) return;
    handlePressStart(e);
    startDrag(e.clientX, e.clientY);
});

window.addEventListener("mouseup", () => {
    handlePressEnd();
    stopDrag();
});

window.addEventListener("mousemove", (e) => {
    if (dragging) duringDrag(e.clientX, e.clientY);
});

// Mobile touch events
dragHandle.addEventListener("touchstart", (e) => {
    if (e.target.closest('.switch')) return;
    handlePressStart(e);
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    touchMoved = false;
}, { passive: false });

dragHandle.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    duringDrag(touch.clientX, touch.clientY);
    touchMoved = true;
    e.preventDefault();
}, { passive: false });

dragHandle.addEventListener("touchend", () => {
    stopDrag();
    if (touchMoved) handlePressEnd();
    else setTimeout(() => handlePressEnd(), 100);
}, { passive: false });

// Ngăn chạm nền
dragTarget.addEventListener("touchstart", (e) => {
    if (!e.target.closest('.switch')) e.stopPropagation();
}, { passive: false });

dragTarget.addEventListener("touchend", (e) => {
    e.stopPropagation();
}, { passive: false });

dragTarget.addEventListener("touchmove", (e) => {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });

})();
