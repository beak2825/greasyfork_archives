// ==UserScript==
// @name         Captcha Detector 
// @version      1.40
// @description  Deteksi CAPTCHA dan otomatis menekan tombol setelah muncul
// @include      https://*/game.php*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/521368/Captcha%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/521368/Captcha%20Detector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function startCountdownAndRedirect(durationMinutes) {
        const countdownDiv = document.createElement('div');
        countdownDiv.style.position = 'fixed';
        countdownDiv.style.bottom = '20px';
        countdownDiv.style.right = '20px';
        countdownDiv.style.padding = '10px';
        countdownDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        countdownDiv.style.color = 'white';
        countdownDiv.style.fontSize = '14px';
        countdownDiv.style.borderRadius = '5px';
        countdownDiv.style.zIndex = 10000;
        document.body.appendChild(countdownDiv);

        let remainingTime = durationMinutes * 60;
        const interval = setInterval(() => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            countdownDiv.textContent = `Redirecting in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            remainingTime--;

            if (remainingTime < 0) {
                clearInterval(interval);
                document.body.removeChild(countdownDiv);
                window.location.href = window.location.href;
            }
        }, 1000);
    }

    function CaptchaDetection() {
        console.log("Mendeteksi Bot Check...");

        const captchaButton = document.querySelector('.btn.btn-default');
        const botProtectionRow = document.querySelector('.bot-protection-row');

        if (captchaButton && botProtectionRow) {
            console.log("Bot check & elemen proteksi ditemukan.");

            const delay = Math.random() * 10 + 10;
            console.log(`Menunggu ${Math.floor(delay)} detik sebelum menekan tombol CAPTCHA.`);

            setTimeout(() => {
                captchaButton.click();
                console.log("Tombol CAPTCHA diklik.");
                startCountdownAndRedirect(Math.floor(Math.random() * 3) + 1); // 1-3 menit
            }, delay * 1000);
        } else {
            console.warn("Elemen CAPTCHA atau proteksi ga ada. Menunggu...");
            observeCaptcha(); // Jalankan observer jika belum ada CAPTCHA
        }
    }


    function observeCaptcha() {
        const observer = new MutationObserver(() => {
            const captchaButton = document.querySelector('.btn.btn-default');
            if (captchaButton) {
                console.log("Elemen CAPTCHA ditemukan, menjalankan CaptchaDetection...");
                observer.disconnect(); // Hentikan observer setelah CAPTCHA ditemukan
                CaptchaDetection();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Jalankan deteksi awal, jika tidak ada CAPTCHA, gunakan observer
    if (document.readyState === "complete") {
        CaptchaDetection();
    } else {
        window.addEventListener("load", CaptchaDetection);
    }

})();
