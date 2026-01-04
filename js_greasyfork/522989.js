// ==UserScript==
// @name Сохранение прогресса видео с настройками и управлением скорости воспроизведения
// @name:en Saving Video Progress with Settings and Playback Speed Control
// @namespace http://tampermonkey.net/
// @version 2.9.1
// @description Сохраняет прогресс для каждого видео автоматически, добавляет управление скоростью воспроизведения, уведомления и окно настроек с возможностью настройки. Поддержка двух языков (русский и английский).
// @description:en Automatically saves progress for each video, adds playback speed control, notifications, and a settings window with customizable options. Supports two languages (Russian and English).
// @author Egor Fox
// @match *://*/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522989/%D0%A1%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B0%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%20%D1%81%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%B8%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D1%81%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D0%B8%20%D0%B2%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/522989/%D0%A1%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B0%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%20%D1%81%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%D0%BC%D0%B8%20%D0%B8%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D0%BC%20%D1%81%D0%BA%D0%BE%D1%80%D0%BE%D1%81%D1%82%D0%B8%20%D0%B2%D0%BE%D1%81%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const videos = document.querySelectorAll('video'); // Находим все видео на странице

    if (!videos.length) return; // Если видео нет, завершаем выполнение скрипта

    let currentNotification = null;
    let settingsWindowOpen = false; // Флаг для отслеживания открыто ли окно настроек

    // Загрузить настройки из localStorage или установить значения по умолчанию
    let settings = {
        notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false',
        autoSaveInterval: parseInt(localStorage.getItem('autoSaveInterval'), 10) || 1000,
        maxPlaybackRate: parseFloat(localStorage.getItem('maxPlaybackRate')) || 3,
        hotkeysEnabled: localStorage.getItem('hotkeysEnabled') !== 'false',
        volumeControlEnabled: localStorage.getItem('volumeControlEnabled') !== 'false', // Добавляем настройку громкости
        language: localStorage.getItem('language') || 'ru' // Поддержка языка
    };

    // Тексты для уведомлений и интерфейса
    const langTexts = {
        ru: {
            settingsTitle: 'Настройки скрипта',
            notificationsLabel: 'Включить уведомления:',
            autoSaveLabel: 'Интервал авто-сохранения (мс):',
            maxSpeedLabel: 'Максимальная скорость (x):',
            volumeControlLabel: 'Включить изменение громкости при прокрутке:',
            hotkeysLabel: 'Включить горячие клавиши:',
            languageLabel: 'Выберите язык:',
            closeButton: 'Закрыть',
            progressRestored: 'Прогресс видео №{index} восстановлен!',
            speedChanged: 'Скорость видео изменена на {speed}x',
            volumeChanged: 'Громкость изменена на {volume}%',
        },
        en: {
            settingsTitle: 'Script Settings',
            notificationsLabel: 'Enable notifications:',
            autoSaveLabel: 'Auto-save interval (ms):',
            maxSpeedLabel: 'Max playback speed (x):',
            volumeControlLabel: 'Enable volume control on scroll:',
            hotkeysLabel: 'Enable hotkeys:',
            languageLabel: 'Choose language:',
            closeButton: 'Close',
            progressRestored: 'Video progress #{index} restored!',
            speedChanged: 'Playback speed changed to {speed}x',
            volumeChanged: 'Volume changed to {volume}%',
        }
    };

    // Функция для отображения уведомлений
    function showNotification(message, backgroundColor) {
        if (!settings.notificationsEnabled) return;

        if (currentNotification) {
            currentNotification.style.display = 'none';
        }

        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.backgroundColor = backgroundColor;
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '8px';
        notification.style.fontSize = '16px';
        notification.style.zIndex = '9999';
        notification.innerText = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);

        currentNotification = notification;
    }

    // Функция для создания окна настроек
    function createSettingsWindow() {
        if (settingsWindowOpen) {
            closeSettingsWindow(); // Закрыть окно, если оно уже открыто
            return;
        }

        settingsWindowOpen = true; // Устанавливаем флаг, что окно открыто

        const settingsOverlay = document.createElement('div');
        settingsOverlay.id = 'settingsOverlay';
        settingsOverlay.style.position = 'fixed';
        settingsOverlay.style.top = '0';
        settingsOverlay.style.left = '0';
        settingsOverlay.style.width = '100%';
        settingsOverlay.style.height = '100%';
        settingsOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        settingsOverlay.style.zIndex = '10000';
        settingsOverlay.style.display = 'flex';
        settingsOverlay.style.justifyContent = 'center';
        settingsOverlay.style.alignItems = 'center';

        const settingsWindow = document.createElement('div');
settingsWindow.style.backgroundColor = '#333';
settingsWindow.style.padding = '30px';
settingsWindow.style.borderRadius = '10px';
settingsWindow.style.width = '500px';
settingsWindow.style.textAlign = 'left';
settingsWindow.style.color = '#fff';
settingsWindow.style.fontFamily = 'Arial, sans-serif';
settingsWindow.style.fontSize = '18px'; // Увеличиваем шрифт


        const title = document.createElement('h2');
        title.innerText = langTexts[settings.language].settingsTitle;
        title.style.textAlign = 'center';
        title.style.marginBottom = '30px';
        title.style.fontSize = '20px';
        settingsWindow.appendChild(title);

        // Настройки уведомлений
        const notificationsLabel = document.createElement('label');
        notificationsLabel.innerText = langTexts[settings.language].notificationsLabel;
        const notificationsCheckbox = document.createElement('input');
        notificationsCheckbox.type = 'checkbox';
        notificationsCheckbox.checked = settings.notificationsEnabled;
        notificationsCheckbox.addEventListener('change', () => {
            settings.notificationsEnabled = notificationsCheckbox.checked;
            localStorage.setItem('notificationsEnabled', settings.notificationsEnabled);
        });
        settingsWindow.appendChild(notificationsLabel);
        settingsWindow.appendChild(notificationsCheckbox);
        settingsWindow.appendChild(document.createElement('br'));

        // Интервал авто-сохранения
        const autoSaveLabel = document.createElement('label');
        autoSaveLabel.innerText = langTexts[settings.language].autoSaveLabel;
        const autoSaveInput = document.createElement('input');
        autoSaveInput.type = 'number';
        autoSaveInput.value = settings.autoSaveInterval;
        autoSaveInput.addEventListener('change', () => {
            settings.autoSaveInterval = parseInt(autoSaveInput.value, 10);
            localStorage.setItem('autoSaveInterval', settings.autoSaveInterval);
        });
        settingsWindow.appendChild(autoSaveLabel);
        settingsWindow.appendChild(autoSaveInput);
        settingsWindow.appendChild(document.createElement('br'));

        // Максимальная скорость воспроизведения
        const maxSpeedLabel = document.createElement('label');
        maxSpeedLabel.innerText = langTexts[settings.language].maxSpeedLabel;
        const maxSpeedInput = document.createElement('input');
        maxSpeedInput.type = 'number';
        maxSpeedInput.step = '0.1';
        maxSpeedInput.value = settings.maxPlaybackRate;
        maxSpeedInput.addEventListener('change', () => {
            settings.maxPlaybackRate = parseFloat(maxSpeedInput.value);
            localStorage.setItem('maxPlaybackRate', settings.maxPlaybackRate);
        });
        settingsWindow.appendChild(maxSpeedLabel);
        settingsWindow.appendChild(maxSpeedInput);
        settingsWindow.appendChild(document.createElement('br'));

        // Включить изменение громкости при прокрутке
        const volumeControlLabel = document.createElement('label');
        volumeControlLabel.innerText = langTexts[settings.language].volumeControlLabel;
        const volumeControlCheckbox = document.createElement('input');
        volumeControlCheckbox.type = 'checkbox';
        volumeControlCheckbox.checked = settings.volumeControlEnabled;
        volumeControlCheckbox.addEventListener('change', () => {
            settings.volumeControlEnabled = volumeControlCheckbox.checked;
            localStorage.setItem('volumeControlEnabled', settings.volumeControlEnabled);
        });
        settingsWindow.appendChild(volumeControlLabel);
        settingsWindow.appendChild(volumeControlCheckbox);
        settingsWindow.appendChild(document.createElement('br'));

        // Включить горячие клавиши
        const hotkeysLabel = document.createElement('label');
        hotkeysLabel.innerText = langTexts[settings.language].hotkeysLabel;
        const hotkeysCheckbox = document.createElement('input');
        hotkeysCheckbox.type = 'checkbox';
        hotkeysCheckbox.checked = settings.hotkeysEnabled;
        hotkeysCheckbox.addEventListener('change', () => {
            settings.hotkeysEnabled = hotkeysCheckbox.checked;
            localStorage.setItem('hotkeysEnabled', settings.hotkeysEnabled);
        });
        settingsWindow.appendChild(hotkeysLabel);
        settingsWindow.appendChild(hotkeysCheckbox);
        settingsWindow.appendChild(document.createElement('br'));

        // Выбор языка
        const languageLabel = document.createElement('label');
        languageLabel.innerText = langTexts[settings.language].languageLabel;
        const languageSelect = document.createElement('select');
        const languages = ['ru', 'en'];
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.innerText = lang === 'ru' ? 'Русский' : 'English';
            languageSelect.appendChild(option);
        });
        languageSelect.value = settings.language;
        languageSelect.addEventListener('change', () => {
            settings.language = languageSelect.value;
            localStorage.setItem('language', settings.language);
            updateSettingsWindow();
        });
        settingsWindow.appendChild(languageLabel);
        settingsWindow.appendChild(languageSelect);
        settingsWindow.appendChild(document.createElement('br'));

        // Кнопка закрытия
        const closeButton = document.createElement('button');
        closeButton.innerText = langTexts[settings.language].closeButton;
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.backgroundColor = '#007BFF';
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';

        closeButton.addEventListener('click', closeSettingsWindow);
        settingsWindow.appendChild(closeButton);
        settingsOverlay.appendChild(settingsWindow);
        document.body.appendChild(settingsOverlay);
    }

    // Функция для обновления окна настроек при смене языка
    function updateSettingsWindow() {
        const settingsOverlay = document.getElementById('settingsOverlay');
        if (settingsOverlay) {
            document.body.removeChild(settingsOverlay);
        }
        createSettingsWindow(); // Пересоздаем окно с новыми данными
    }

    // Функция для закрытия окна настроек
    function closeSettingsWindow() {
        const settingsOverlay = document.getElementById('settingsOverlay');
        if (settingsOverlay) {
            document.body.removeChild(settingsOverlay);
            settingsWindowOpen = false; // Сбрасываем флаг
        }
    }

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyN' || event.code === 'KeyT') {
            createSettingsWindow();
        }
    });

    // Обрабатываем каждое видео
    videos.forEach((video, index) => {
        const videoKey = `videoProgress_${window.location.href}_${index}`;
        const savedTime = localStorage.getItem(videoKey);
        const savedVolume = localStorage.getItem(videoKey + "_volume");

        // Отложим восстановление прогресса на 1 секунды
        video.addEventListener('loadedmetadata', () => {
            setTimeout(() => {
                if (savedTime) {
                    video.currentTime = parseFloat(savedTime);
                    showNotification(langTexts[settings.language].progressRestored.replace("{index}", index + 1), 'rgba(0, 0, 0, 0.6)');
                }

                if (savedVolume !== null) {
                    video.volume = parseFloat(savedVolume);
                }
            }, 1000); // Задержка 1 секундa
        });

        video.addEventListener('timeupdate', () => {
            if (!video.paused && !video.ended) {
                localStorage.setItem(videoKey, video.currentTime); // Сохраняем прогресс при каждом обновлении времени
            }
        });

        video.addEventListener('ended', () => {
            localStorage.removeItem(videoKey);
        });

        video.addEventListener('volumechange', () => {
            localStorage.setItem(videoKey + "_volume", video.volume);
        });

        window.addEventListener('beforeunload', () => {
            localStorage.setItem(videoKey, video.currentTime); // Обновляем прогресс перед закрытием страницы
        });
    });

    window.addEventListener('wheel', (event) => {
        if (!settings.volumeControlEnabled || !event.shiftKey) return;

        const focusedVideo = document.activeElement.tagName === 'VIDEO' ? document.activeElement : videos[0];
        if (!focusedVideo) return;

        const volumeChange = event.deltaY < 0 ? 0.01 : -0.01;
        let newVolume = Math.min(Math.max(focusedVideo.volume + volumeChange, 0), 1);

        // Обновляем громкость плеера
        focusedVideo.volume = newVolume;

        // Показ уведомления при изменении громкости
        showNotification(langTexts[settings.language].volumeChanged.replace("{volume}", (newVolume * 100).toFixed(0)), 'rgba(0, 0, 0, 0.6)');
    });

    window.addEventListener('keydown', (event) => {
        if (!settings.hotkeysEnabled) return;

        const focusedVideo = document.activeElement.tagName === 'VIDEO' ? document.activeElement : videos[0];

        if (!focusedVideo) return;

        if (event.key === 'z' || event.key === 'я') {
            if (focusedVideo.playbackRate > 0.1) {
                focusedVideo.playbackRate -= 0.1;
                showNotification(langTexts[settings.language].speedChanged.replace("{speed}", focusedVideo.playbackRate.toFixed(1)), 'rgba(0, 0, 0, 0.6)');
            }
        } else if (event.key === 'x' || event.key === 'ч') {
            if (focusedVideo.playbackRate < settings.maxPlaybackRate) {
                focusedVideo.playbackRate += 0.1;
                showNotification(langTexts[settings.language].speedChanged.replace("{speed}", focusedVideo.playbackRate.toFixed(1)), 'rgba(0, 0, 0, 0.6)');
            }
        }
    });

})();
