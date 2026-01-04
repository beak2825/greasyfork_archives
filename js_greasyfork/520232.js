// ==UserScript==
// @name             Additional script for Firewall
// @namespace        Tamper & Violent & Others Monkey
// @version          0.5
// @description      Additional script for Firewall to Reload the page if HCaptcha is detected, handle Turnstile and reCAPTCHA on Firewall
// @author           Ojo Ngono
// @match            https://faucetme.xyz/firewall
// @match            https://claim.ourcoincash.xyz/firewall
// @match            https://chillfaucet.in/app/firewall
// @icon             https://i.ibb.co.com/XJSPdz0/large.png
// @grant            none
// @license          Copyright OjoNgono
// @downloadURL https://update.greasyfork.org/scripts/520232/Additional%20script%20for%20Firewall.user.js
// @updateURL https://update.greasyfork.org/scripts/520232/Additional%20script%20for%20Firewall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fungsi untuk mengecek keberadaan HCaptcha
    function detectHCaptcha() {
        let hcaptchaFrame = document.querySelector("iframe[src*='hcaptcha.com']");
        return !!hcaptchaFrame; // Mengembalikan true jika HCaptcha ditemukan
    }

    // Fungsi untuk mengecek Turnstile
    function checkTurnstile() {
        let turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        return turnstileResponse && turnstileResponse.value !== '';
    }

    // Fungsi untuk mengecek reCAPTCHA
    function checkRecaptcha() {
        let recaptchaFrame = document.querySelector("iframe[title='reCAPTCHA']");
        if (recaptchaFrame) {
            return window.grecaptcha && window.grecaptcha.getResponse().length !== 0;
        }
        return false;
    }

    // Fungsi untuk mengklik tombol Unlock
    function clickUnlock() {
        let unlockButton = document.querySelector('button.btn.btn-primary.w-md');
        if (unlockButton && unlockButton.innerText.includes('Unlock')) {
            console.log("Captcha resolved! Clicking Unlock button...");
            unlockButton.click();
        }
    }

    // Tambahkan event listener untuk memantau perubahan pada DOM
    window.addEventListener("load", () => {
        console.log("Page fully loaded. Starting checks...");
        
        // Interval untuk mengecek kondisi setiap 2 detik
        setInterval(() => {
            if (detectHCaptcha()) {
                console.log("HCaptcha detected! Reloading the page...");
                location.reload(); // Reload halaman jika HCaptcha terdeteksi
            } else if (checkTurnstile() || checkRecaptcha()) {
                clickUnlock(); // Klik tombol jika captcha lain terselesaikan
            }
        }, 2000);
    });

    // Pantau perubahan DOM untuk elemen dinamis
    const observer = new MutationObserver(() => {
        console.log("DOM mutation detected. Rechecking...");
        if (detectHCaptcha()) {
            console.log("HCaptcha detected via mutation! Reloading the page...");
            location.reload(); // Reload halaman jika HCaptcha terdeteksi melalui perubahan DOM
        } else if (checkTurnstile() || checkRecaptcha()) {
            clickUnlock();
        }
    });

    // Mulai observer pada body
    observer.observe(document.body, { childList: true, subtree: true });
})();
