// ==UserScript==
// @name         YouTube Like Hymn UA + Sidebar Settings
// @namespace    https://github.com/custom/yt-like-hymn
// @version      2.0
// @description  При нажатии лайка на YouTube играет гимн Украины 🇺🇦 (с боковой панелью настроек прямо в YouTube)
// @author       SLAVA UKRAINI
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/8e0a5f8b/img/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546191/YouTube%20Like%20Hymn%20UA%20%2B%20Sidebar%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/546191/YouTube%20Like%20Hymn%20UA%20%2B%20Sidebar%20Settings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Значения по умолчанию
    const defaults = {
        enabled: true,
        hymnURL: "https://upload.wikimedia.org/wikipedia/commons/5/54/Ukraine_National_Anthem.ogg",
        volume: 1.0,
        shorts: true
    };

    function getSetting(key) {
        return GM_getValue(key, defaults[key]);
    }

    function setSetting(key, value) {
        GM_setValue(key, value);
    }

    // 🎵 Аудио
    function injectAudioPlayer() {
        if (!document.getElementById("ua-hymn-player")) {
            let audio = document.createElement("audio");
            audio.id = "ua-hymn-player";
            audio.src = getSetting("hymnURL");
            audio.volume = getSetting("volume");
            audio.preload = "auto";
            document.body.appendChild(audio);
        }
    }

    function playHymn() {
        if (!getSetting("enabled")) return;
        const player = document.getElementById("ua-hymn-player");
        if (player) {
            player.src = getSetting("hymnURL");
            player.volume = getSetting("volume");
            player.currentTime = 0;
            player.play().catch(err => console.warn("Автовоспроизведение заблокировано:", err));
        }
    }

    // 📌 Слушаем лайк
    function attachLikeListener() {
        const likeButton = document.querySelector(
            '#menu #top-level-buttons-computed ytd-toggle-button-renderer:nth-child(1) button, #segmented-like-button button'
        );

        if (likeButton && !likeButton.dataset.hymnAttached) {
            likeButton.addEventListener("click", () => {
                if (!getSetting("shorts") && window.location.href.includes("/shorts/")) return;
                playHymn();
            });
            likeButton.dataset.hymnAttached = "true";
            console.log("✅ Гимн Украины привязан к кнопке Лайк");
        }
    }

    // 🎛️ Виджет
    function createSidebar() {
        if (document.getElementById("ua-hymn-sidebar")) return;

        const sidebar = document.createElement("div");
        sidebar.id = "ua-hymn-sidebar";
        sidebar.innerHTML = `
            <div id="ua-hymn-toggle">🇺🇦</div>
            <div id="ua-hymn-panel">
                <h2>⚙️ Настройки гимна</h2>
                <label><input type="checkbox" id="ua-enabled"> Включить проигрывание</label><br>
                <label>Ссылка: <input type="text" id="ua-url" style="width:90%"></label><br>
                <label>Громкость: <input type="range" id="ua-volume" min="0" max="1" step="0.1"></label><br>
                <label><input type="checkbox" id="ua-shorts"> Работать в Shorts</label><br>
                <button id="ua-save">💾 Сохранить</button>
            </div>
        `;
        document.body.appendChild(sidebar);

        // CSS
        const style = document.createElement("style");
        style.textContent = `
            #ua-hymn-sidebar {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                z-index: 999999;
                font-family: Arial, sans-serif;
            }
            #ua-hymn-toggle {
                background: #0057b7;
                color: #ffd700;
                font-size: 24px;
                padding: 10px;
                border-radius: 10px 0 0 10px;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            #ua-hymn-panel {
                display: none;
                background: #111;
                color: #fff;
                padding: 15px;
                width: 250px;
                border-radius: 10px 0 0 10px;
                box-shadow: 0 0 15px rgba(0,0,0,0.8);
            }
            #ua-hymn-panel h2 {
                margin-top: 0;
                color: #00ffea;
                font-size: 18px;
            }
            #ua-save {
                margin-top: 10px;
                background: #007bff;
                color: #fff;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
            }
            #ua-save:hover {
                background: #0056b3;
            }
        `;
        document.head.appendChild(style);

        // Кнопка открытия/закрытия
        const toggle = document.getElementById("ua-hymn-toggle");
        const panel = document.getElementById("ua-hymn-panel");
        toggle.addEventListener("click", () => {
            panel.style.display = (panel.style.display === "block") ? "none" : "block";
        });

        // Подгрузка сохранённых настроек
        document.getElementById("ua-enabled").checked = getSetting("enabled");
        document.getElementById("ua-url").value = getSetting("hymnURL");
        document.getElementById("ua-volume").value = getSetting("volume");
        document.getElementById("ua-shorts").checked = getSetting("shorts");

        // Сохранение
        document.getElementById("ua-save").addEventListener("click", () => {
            setSetting("enabled", document.getElementById("ua-enabled").checked);
            setSetting("hymnURL", document.getElementById("ua-url").value);
            setSetting("volume", parseFloat(document.getElementById("ua-volume").value));
            setSetting("shorts", document.getElementById("ua-shorts").checked);
            alert("✅ Настройки сохранены!");
            injectAudioPlayer();
        });
    }

    // 🚀 Запуск
    injectAudioPlayer();
    createSidebar();

    const observer = new MutationObserver(() => {
        attachLikeListener();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
