// ==UserScript==
// @name         add YouTube Inactivity Pause
// @namespace    http://tampermonkey.net/
// @description  Pauses YouTube video if user is inactive for too long (default 1.5h) "Are you still wathing" but with configurable time 
// @author       frozenheal
// @match        https://www.youtube.com/*
// @grant        none
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/547446/add%20YouTube%20Inactivity%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/547446/add%20YouTube%20Inactivity%20Pause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔧 Settings
    let INACTIVITY_LIMIT_MINUTES = 90; // inactivity time (minutes)
    let CONFIRM_TIMEOUT_SECONDS = 30;  // how many seconds to wait for confirmation

    let lastActivity = Date.now();
    let warningShown = false;
    let confirmTimeout;

    // ---------- Translations ----------
    const translations = {
        en: {
            inactive: "It looks like you've been inactive.<br>Are you still watching?",
            button: "I'm here",
            countdown: (s) => `Auto-pause in ${s} seconds...`
        },
        es: {
            inactive: "Parece que has estado inactivo.<br>¿Sigues viendo?",
            button: "Estoy aquí",
            countdown: (s) => `Pausa automática en ${s} segundos...`
        },
        fr: {
            inactive: "Il semble que vous soyez inactif.<br>Regardez-vous toujours ?",
            button: "Je suis là",
            countdown: (s) => `Pause automatique dans ${s} secondes...`
        },
        de: {
            inactive: "Es scheint, dass Sie inaktiv sind.<br>Schauen Sie noch?",
            button: "Ich bin hier",
            countdown: (s) => `Automatische Pause in ${s} Sekunden...`
        },
        pt: {
            inactive: "Parece que você está inativo.<br>Você ainda está assistindo?",
            button: "Estou aqui",
            countdown: (s) => `Pausa automática em ${s} segundos...`
        },
        ru: {
            inactive: "Похоже, вы неактивны.<br>Вы всё ещё смотрите?",
            button: "Я здесь",
            countdown: (s) => `Автопауза через ${s} секунд...`
        },
        ja: {
            inactive: "操作がありませんでした。<br>まだ見ていますか？",
            button: "見ています",
            countdown: (s) => `${s} 秒後に自動一時停止...`
        },
        zh: {
            inactive: "您似乎处于非活动状态。<br>您还在观看吗？",
            button: "我在这里",
            countdown: (s) => `${s} 秒后自动暂停...`
        },
        hi: {
            inactive: "लगता है आप निष्क्रिय हैं।<br>क्या आप अभी भी देख रहे हैं?",
            button: "मैं यहाँ हूँ",
            countdown: (s) => `${s} सेकंड में ऑटो-पॉज़...`
        },
        ar: {
            inactive: "يبدو أنك غير نشط.<br>هل ما زلت تشاهد؟",
            button: "أنا هنا",
            countdown: (s) => `إيقاف مؤقت تلقائي خلال ${s} ثانية...`
        }
    };

    // Detect language
    let lang = (navigator.language || "en").substring(0,2);
    if (!translations[lang]) lang = "en";
    const t = translations[lang];

    // ---------- Activity monitoring ----------
    function resetTimer() {
        lastActivity = Date.now();
        if (warningShown) {
            hideWarning();
        }
    }

    ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, resetTimer, true);
    });

    // ---------- Inactivity check ----------
    setInterval(() => {
        let inactiveMs = Date.now() - lastActivity;
        if (!warningShown && inactiveMs > INACTIVITY_LIMIT_MINUTES * 60 * 1000) {
            showWarning();
        }
    }, 60 * 1000); // check every minute

    // ---------- Modal window ----------
    function showWarning() {
        warningShown = true;

        let overlay = document.createElement("div");
        overlay.id = "yt-inactivity-overlay";
        overlay.style = `
            position: fixed; top: 0; left: 0; right:0; bottom:0;
            background: rgba(0,0,0,0.8);
            color: white;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            font-size: 20px; z-index: 999999;
        `;
        overlay.innerHTML = `
            <div style="background: #222; padding: 20px; border-radius: 12px; text-align:center;">
                <p>${t.inactive}</p>
                <button id="yt-inactivity-confirm" style="
                    margin-top:10px; padding:10px 20px;
                    background:#ff0000; color:white; border:none;
                    border-radius:8px; font-size:16px; cursor:pointer;">
                    ${t.button}
                </button>
                <p id="yt-inactivity-timer" style="margin-top:10px; font-size:14px; color:#aaa;"></p>
            </div>
        `;
        document.body.appendChild(overlay);

        let timerElem = document.getElementById("yt-inactivity-timer");
        let secondsLeft = CONFIRM_TIMEOUT_SECONDS;

        timerElem.innerText = t.countdown(secondsLeft);

        confirmTimeout = setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) {
                clearInterval(confirmTimeout);
                pauseVideo();
                hideWarning();
            } else {
                timerElem.innerText = t.countdown(secondsLeft);
            }
        }, 1000);

        document.getElementById("yt-inactivity-confirm").onclick = () => {
            clearInterval(confirmTimeout);
            resetTimer();
        };
    }

    function hideWarning() {
        let overlay = document.getElementById("yt-inactivity-overlay");
        if (overlay) overlay.remove();
        warningShown = false;
    }

    // ---------- Pause video ----------
    function pauseVideo() {
        let video = document.querySelector("video");
        if (video && !video.paused) {
            video.pause();
        }
    }

})();
