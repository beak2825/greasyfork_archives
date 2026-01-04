// ==UserScript==
// @license MIT
// @name         Chặn Thời Gian - Chặn Bộ Đếm
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chặn bộ đếm thời gian + Giao diện + Đồng hồ luôn chạy (reset khi reload)
// @author       Bạn
// @match        *://lms360.edu.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532052/Ch%E1%BA%B7n%20Th%E1%BB%9Di%20Gian%20-%20Ch%E1%BA%B7n%20B%E1%BB%99%20%C4%90%E1%BA%BFm.user.js
// @updateURL https://update.greasyfork.org/scripts/532052/Ch%E1%BA%B7n%20Th%E1%BB%9Di%20Gian%20-%20Ch%E1%BA%B7n%20B%E1%BB%99%20%C4%90%E1%BA%BFm.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isEnabled = localStorage.getItem("vip_pro_max_status") === "true";

    function blockTimers() {
        if (!isEnabled) return;

        console.log("[UserScript] Đã chặn bộ đếm thời gian trên LMS360!");

        window.setInterval = function () { return 0; };
        window.setTimeout = function () { return 0; };

        for (let i = 1; i < 99999; i++) {
            clearInterval(i);
            clearTimeout(i);
        }

        document.addEventListener("visibilitychange", function (event) {
            event.stopImmediatePropagation();
        }, true);

        window.onbeforeunload = null;
        window.onunload = null;

        window.addEventListener("beforeunload", function (event) {
            event.stopImmediatePropagation();
        }, true);

        performance.now = function () { return 0; };
    }

    // ===================== ĐỒNG HỒ ĐẾM THỜI GIAN =====================
let timerInterval;
let seconds = 0;

function startTimer() {
    const timerDisplay = document.getElementById("timer-display");
    clearInterval(timerInterval); // Clear any existing interval
    seconds = 0;
    timerDisplay.textContent = `⏱ Thời gian làm bài: 00:00:00`; // Reset the display

    // Start the timer immediately
    timerInterval = setInterval(() => {
        seconds++;
        let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        let secs = String(seconds % 60).padStart(2, '0');
        timerDisplay.textContent = `⏱ Thời gian làm bài: ${hrs}:${mins}:${secs}`;
    }, 1000);
}

    // ===================== GIAO DIỆN UI =====================

    let div = document.createElement("div");
    div.id = "script-ui";
    div.style = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 250px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        font-size: 14px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.2);
        font-family: Arial, sans-serif;
        cursor: grab;
        transition: transform 0.3s ease, opacity 0.3s ease;
        user-select: none; /* Disable text selection */
    `;
    div.innerHTML = `
        <b>🚀 Chặn Thời Gian - LMS360</b> <br>
        ✅ Trạng thái: <span id="status">${isEnabled ? "Đang bật" : "Đã tắt"}</span> <br>
        <button id="toggle-script" style="
            margin-top: 10px;
            width: 100%;
            background: ${isEnabled ? "red" : "green"};
            color: white;
            border: none;
            padding: 8px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s ease, transform 0.2s ease;
        ">${isEnabled ? "Tắt Script" : "Bật Script"}</button>
        <div id="timer-display" style="
            margin-top: 10px;
            font-weight: bold;
            color: #00ffcc;
            transition: opacity 0.3s ease;
        ">⏱ Thời gian làm bài: 00:00:00</div>
    `;
    document.body.appendChild(div);

    // ===================== KÍCH HOẠT CHỨC NĂNG =====================

    if (isEnabled) blockTimers();
    startTimer();

    document.getElementById("toggle-script").addEventListener("click", function () {
        isEnabled = !isEnabled;
        localStorage.setItem("vip_pro_max_status", isEnabled);
        document.getElementById("status").innerText = isEnabled ? "Đang bật" : "Đã tắt";
        this.innerText = isEnabled ? "Tắt Script" : "Bật Script";
        this.style.background = isEnabled ? "red" : "green";

        // Smooth transition for the button
        this.style.transform = "scale(1.05)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 200);

        // Fade timer display based on script status
        const timerDisplay = document.getElementById("timer-display");
        timerDisplay.style.opacity = isEnabled ? "1" : "0";

        if (isEnabled) {
            blockTimers();
        } else {
            location.reload(); // reset toàn bộ script & timer
        }
    });

    // ===================== DRAG UI =====================

    let offsetX, offsetY, isDragging = false;

    div.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - div.getBoundingClientRect().left;
        offsetY = e.clientY - div.getBoundingClientRect().top;
        div.style.cursor = "grabbing";
    });

    // Use requestAnimationFrame for smoother dragging
    document.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        window.requestAnimationFrame(function () {
            div.style.left = `${e.clientX - offsetX}px`;
            div.style.top = `${e.clientY - offsetY}px`;
        });
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        div.style.cursor = "grab";
    });

})();
