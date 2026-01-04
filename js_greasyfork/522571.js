// ==UserScript==
// @name         Coursera Auto Subtitle
// @namespace    https://github.com/htrnguyen/Coursera-Auto-Subtitle
// @version      1.0
// @description  Automatically enables, enhances, and translates subtitles on Coursera. Features include a draggable icon, customizable language selection, and real-time translation using Google Translate.
// @author       Hà Trọng Nguyễn (htrnguyen)
// @match        https://www.coursera.org/learn/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @license      MIT
// @icon         https://github.com/htrnguyen/Coursera-Auto-Subtitle/raw/main/coursera-auto-subtitle-logo.png
// @downloadURL https://update.greasyfork.org/scripts/522571/Coursera%20Auto%20Subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/522571/Coursera%20Auto%20Subtitle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        translateSubtitles: true,
        maxRetries: 3,
        retryDelay: 1000,
    };

    let isSubtitlesEnabled = false;
    let subtitleDisplayElement = null;
    let targetLanguage = 'en'; // Default language is English

    const LANGUAGES = {
        vi: 'Tiếng Việt',
        en: 'English',
        zh: '中文 (简体)',
        ja: '日本語',
        ko: '한국어',
        fr: 'Français',
    };

    let icon, menu;

    function createDraggableIcon() {
        icon = document.createElement('img');
        icon.src = 'https://github.com/htrnguyen/Coursera-Auto-Subtitle/raw/main/coursera-auto-subtitle-logo.png';
        icon.style.position = 'fixed';
        icon.style.top = '20px';
        icon.style.left = '20px';
        icon.style.zIndex = '9999';
        icon.style.cursor = 'pointer';
        icon.style.width = '32px';
        icon.style.height = '32px';
        icon.style.userSelect = 'none';

        let isDragging = false;
        let offsetX, offsetY;

        icon.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - icon.getBoundingClientRect().left;
            offsetY = event.clientY - icon.getBoundingClientRect().top;
            icon.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const newLeft = event.clientX - offsetX;
                const newTop = event.clientY - offsetY;

                // Giới hạn icon trong phạm vi màn hình
                icon.style.left = `${Math.max(0, Math.min(window.innerWidth - icon.offsetWidth, newLeft))}px`;
                icon.style.top = `${Math.max(0, Math.min(window.innerHeight - icon.offsetHeight, newTop))}px`;

                if (menu) {
                    updateMenuPosition();
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                icon.style.cursor = 'pointer';
            }
        });

        icon.addEventListener('click', (event) => {
            event.stopPropagation();
            showMenu();
        });

        document.body.appendChild(icon);
    }

    function updateMenuPosition() {
        const iconRect = icon.getBoundingClientRect();
        const menuWidth = 180; // Chiều rộng menu
        const menuHeight = 120; // Chiều cao menu (ước lượng)

        // Kiểm tra vị trí icon để hiển thị menu phù hợp
        if (iconRect.left + icon.offsetWidth + menuWidth > window.innerWidth) {
            // Icon ở viền phải, hiển thị menu bên trái
            menu.style.left = `${iconRect.left - menuWidth}px`;
            menu.style.top = `${iconRect.top}px`;
        } else if (iconRect.top + icon.offsetHeight + menuHeight > window.innerHeight) {
            // Icon ở viền dưới, hiển thị menu bên trên
            menu.style.left = `${iconRect.left + icon.offsetWidth}px`;
            menu.style.top = `${iconRect.top - menuHeight}px`;
        } else if (iconRect.top - menuHeight < 0) {
            // Icon ở viền trên, hiển thị menu bên dưới
            menu.style.left = `${iconRect.left + icon.offsetWidth}px`;
            menu.style.top = `${iconRect.top + icon.offsetHeight}px`;
        } else {
            // Mặc định hiển thị menu bên phải
            menu.style.left = `${iconRect.left + icon.offsetWidth}px`;
            menu.style.top = `${iconRect.top}px`;
        }
    }

    function showMenu() {
        if (menu) {
            menu.remove();
            menu = null;
            return;
        }

        menu = document.createElement('div');
        menu.classList.add('subtitle-menu');
        menu.style.position = 'fixed';
        menu.style.backgroundColor = 'white';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '5px';
        menu.style.padding = '10px';
        menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        menu.style.zIndex = '10000';
        menu.style.width = '180px';

        updateMenuPosition();

        const toggleButton = document.createElement('button');
        toggleButton.textContent = isSubtitlesEnabled ? 'Disable Subtitles' : 'Enable Subtitles';
        toggleButton.style.display = 'block';
        toggleButton.style.width = '100%';
        toggleButton.style.marginBottom = '10px';
        toggleButton.style.padding = '8px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '14px';

        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            isSubtitlesEnabled = !isSubtitlesEnabled;
            toggleButton.textContent = isSubtitlesEnabled ? 'Disable Subtitles' : 'Enable Subtitles';
            if (isSubtitlesEnabled) {
                enableSubtitles();
            } else {
                disableSubtitles();
            }
            menu.remove();
            menu = null;
        });

        const languageSelect = document.createElement('select');
        languageSelect.style.display = 'block';
        languageSelect.style.width = '100%';
        languageSelect.style.padding = '8px';
        languageSelect.style.cursor = 'pointer';
        languageSelect.style.fontSize = '14px';

        for (const [code, name] of Object.entries(LANGUAGES)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            if (code === targetLanguage) option.selected = true;
            languageSelect.appendChild(option);
        }

        languageSelect.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        languageSelect.addEventListener('change', (event) => {
            event.stopPropagation();
            targetLanguage = event.target.value;
            if (isSubtitlesEnabled) {
                handleSubtitles();
            }
        });

        menu.appendChild(toggleButton);
        menu.appendChild(languageSelect);
        document.body.appendChild(menu);

        document.addEventListener('click', (event) => {
            if (!menu.contains(event.target) && !icon.contains(event.target)) {
                menu.remove();
                menu = null;
            }
        });
    }

    function enableSubtitles() {
        if (!subtitleDisplayElement) {
            createSubtitleDisplay();
        }
        subtitleDisplayElement.style.display = 'block';
        handleSubtitles();
    }

    function disableSubtitles() {
        if (subtitleDisplayElement) {
            subtitleDisplayElement.style.display = 'none';
        }
    }

    function createSubtitleDisplay() {
        subtitleDisplayElement = document.createElement('div');
        subtitleDisplayElement.style.position = 'absolute';
        subtitleDisplayElement.style.bottom = '20px';
        subtitleDisplayElement.style.left = '50%';
        subtitleDisplayElement.style.transform = 'translateX(-50%)';
        subtitleDisplayElement.style.color = 'white';
        subtitleDisplayElement.style.fontSize = '16px';
        subtitleDisplayElement.style.zIndex = '10000';
        subtitleDisplayElement.style.textAlign = 'center';
        subtitleDisplayElement.style.maxWidth = '80%';
        subtitleDisplayElement.style.whiteSpace = 'pre-wrap';
        subtitleDisplayElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        subtitleDisplayElement.style.padding = '10px';
        subtitleDisplayElement.style.borderRadius = '5px';

        const videoElement = document.querySelector('video.vjs-tech');
        if (videoElement) {
            videoElement.parentElement.appendChild(subtitleDisplayElement);
        }
    }

    async function translateSubtitles(text, targetLang) {
        return new Promise((resolve, reject) => {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data[0] && data[0][0] && data[0][0][0]) {
                            resolve(data[0][0][0]);
                        } else {
                            reject('Translation failed: No translated text');
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: (error) => {
                    reject(error);
                },
            });
        });
    }

    async function handleSubtitles() {
        const videoElement = document.querySelector('video.vjs-tech');
        if (!videoElement) return;

        const tracks = videoElement.textTracks;
        if (!tracks || tracks.length === 0) return;

        const track = tracks[0];
        track.mode = 'hidden';

        track.oncuechange = () => {
            const activeCue = track.activeCues[0];
            if (activeCue && isSubtitlesEnabled) {
                const originalText = activeCue.text;

                if (CONFIG.translateSubtitles && originalText) {
                    translateSubtitles(originalText, targetLanguage)
                        .then((translatedText) => {
                            if (subtitleDisplayElement) {
                                subtitleDisplayElement.textContent = translatedText;
                            }
                        })
                        .catch(() => {});
                }
            }
        };
    }

    window.addEventListener('load', () => {
        createDraggableIcon();
    });
})();
