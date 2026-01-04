// ==UserScript==
// @name         Twitter Video Player Volume Fix
// @namespace    http://tampermonkey.net/
// @version      1.03.25
// @description  the script saves and applies your set volume level, when it is off or suddenly too loud!
// @author       6iri6r6r
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         https://avatars.mds.yandex.net/i?id=062579e45305ee7dff7c7b26c4dd7bdced335bbc-16398073-images-thumbs&n=13
// @downloadURL https://update.greasyfork.org/scripts/545095/Twitter%20Video%20Player%20Volume%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/545095/Twitter%20Video%20Player%20Volume%20Fix.meta.js
// ==/UserScript==

(function () {
    const VOLUME_STORAGE_KEY = "XcomTwitter_video_player_MasterVolume";
    const MUTED_STORAGE_KEY = "XcomTwitter_video_MasterVolume_Muted";
    let savedVolume = GM_getValue(VOLUME_STORAGE_KEY, 0.5); // По умолчанию 50%
    let savedMuted = GM_getValue(MUTED_STORAGE_KEY, false); // По умолчанию звук включен

    // Логируем загруженные значения
    console.log("[TwitterVolumeFix] Загружена громкость:", savedVolume);
    console.log("[TwitterVolumeFix] Загружено состояние muted:", savedMuted);

    // Сохраняем громкость
    function saveVolume(volume) {
        if (volume !== savedVolume) {
            savedVolume = volume;
            GM_setValue(VOLUME_STORAGE_KEY, volume);
            console.log("[TwitterVolumeFix] Сохранена громкость:", volume);
        }
    }

    // Сохраняем состояние muted
    function saveMuted(muted) {
        if (muted !== savedMuted) {
            savedMuted = muted;
            GM_setValue(MUTED_STORAGE_KEY, muted);
            console.log("[TwitterVolumeFix] Сохранено состояние muted:", muted);
        }
    }

    // Применяем сохранённые настройки к видео
    function applySettings(video) {
        if (!video) return;
        video.volume = savedVolume; // Применяем точное значение громкости
        video.muted = savedMuted; // Применяем сохранённое состояние muted
        console.log("[TwitterVolumeFix] Применены настройки: volume =", video.volume, ", muted =", video.muted);
    }

    // Отслеживаем клики по кнопке "Игнорировать/Не игнорировать"
    function attachButtonHandlers() {
        document.querySelectorAll('button[aria-label="Игнорировать"], button[aria-label="Не игнорировать"]').forEach((button) => {
            if (!button.dataset.muteHandlerAttached) {
                button.dataset.muteHandlerAttached = "true";
                button.addEventListener("click", () => {
                    const isMuted = button.getAttribute("aria-label") === "Игнорировать";
                    document.querySelectorAll("video").forEach((video) => {
                        video.muted = isMuted;
                        if (!isMuted) {
                            // При unmute восстанавливаем сохранённую громкость
                            video.volume = savedVolume;
                        }
                        saveMuted(isMuted);
                    });
                    console.log("[TwitterVolumeFix] Кнопка нажата, muted =", isMuted, ", volume =", savedVolume);
                });
            }
        });
    }

    // Отслеживаем клики по кнопке "Назад"
    function attachBackButtonHandlers() {
        document.querySelectorAll('button[aria-label="Назад"]').forEach((button) => {
            if (!button.dataset.backHandlerAttached) {
                button.dataset.backHandlerAttached = "true";
                button.addEventListener("click", () => {
                    // При нажатии "Назад" принудительно применяем сохранённые настройки ко всем видео
                    setTimeout(() => {
                        document.querySelectorAll("video").forEach(applySettings);
                        console.log("[TwitterVolumeFix] Нажата кнопка 'Назад', применены настройки: volume =", savedVolume, ", muted =", savedMuted);
                    }, 100); // Задержка для ожидания загрузки видео после навигации
                });
            }
        });
    }

    // Подключаем обработчики к конкретному видео
    function attachVideoHandlers(video) {
        if (!video.dataset.volumeHandlerAttached) {
            video.dataset.volumeHandlerAttached = "true";

            // Применяем настройки при загрузке нового ролика
            video.addEventListener("loadedmetadata", () => applySettings(video));
            video.addEventListener("play", () => applySettings(video));

            // Сохраняем громкость при изменении через слайдер
            video.addEventListener("volumechange", () => {
                if (video.volume !== savedVolume && !video.muted) {
                    saveVolume(video.volume);
                }
            });

            // Сразу применяем для уже загруженного видео
            applySettings(video);
        }
    }

    // Ищем все видео и кнопки на странице
    function processElements() {
        document.querySelectorAll("video").forEach(attachVideoHandlers);
        attachButtonHandlers();
        attachBackButtonHandlers();
    }

    // Наблюдаем за изменениями DOM (SPA-переходы)
    const observer = new MutationObserver(() => processElements());
    observer.observe(document.body, { childList: true, subtree: true });

    // На случай, если элементы уже есть при загрузке
    processElements();
})(); 