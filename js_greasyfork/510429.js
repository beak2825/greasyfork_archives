// ==UserScript==
// @name         Автоматический сбор бонусов на Twitch с уведомлениями и кнопкой перевода
// @namespace    http://tampermonkey.net/
// @version      2025-04-05
// @description  Автоматический сбор бонусов на Twitch с уведомлениями и кнопкой перевода сообщений с выбором языка (UA, RU, KZ, BY). Язык запоминается и применяется ко всем сообщениям.
// @author       z1zod, BALCETUL
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510429/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D0%B1%D0%BE%D1%80%20%D0%B1%D0%BE%D0%BD%D1%83%D1%81%D0%BE%D0%B2%20%D0%BD%D0%B0%20Twitch%20%D1%81%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8%20%D0%B8%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%BE%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/510429/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D1%81%D0%B1%D0%BE%D1%80%20%D0%B1%D0%BE%D0%BD%D1%83%D1%81%D0%BE%D0%B2%20%D0%BD%D0%B0%20Twitch%20%D1%81%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8%20%D0%B8%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%BE%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D0%B0.meta.js
// ==/UserScript==
 


/*
Copyright (c) 2024 z1zod, BALCETUL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const settings = {
        notificationsEnabled: true,
        translationContainerEnabled: false,
        notificationPosition: 'top-center',
        soundEnabled: false,
        soundVolume: 30,
        customSound: 'https://www.myinstants.com/media/sounds/pribyl-godzho-satoru.mp3',
        hideTwitchIcons: false  // Настройка: скрывать только выбранные иконки Twitch
    };

    // Чтение и сохранение настроек
    for (const [key, value] of Object.entries(settings)) {
        const savedValue = GM_getValue(key);
        if (savedValue !== undefined) {
            settings[key] = savedValue;
        } else {
            GM_setValue(key, value);
        }
    }

    const notificationPositions = [
        'top-left',
        'top-center',
        'top-right',
        'middle-left',
        'middle-center',
        'middle-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
    ];

    let notificationSound = new Audio(settings.customSound);
    notificationSound.volume = settings.soundVolume / 100;

    function playSound() {
        if (settings.soundEnabled) {
            notificationSound.play();
        }
    }

    function showNotification(message, isEnabled, isBonus = false) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.backgroundColor = isBonus ? '#9147ff' : (isEnabled ? 'green' : 'red');
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '10px';
        notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        notification.style.fontSize = '16px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';

        switch (settings.notificationPosition) {
            case 'top-left':
                notification.style.top = '20px';
                notification.style.left = '20px';
                break;
            case 'top-center':
                notification.style.top = '60px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                break;
            case 'top-right':
                notification.style.top = '20px';
                notification.style.right = '20px';
                break;
            case 'middle-left':
                notification.style.top = '50%';
                notification.style.left = '20px';
                notification.style.transform = 'translateY(-50%)';
                break;
            case 'middle-center':
                notification.style.top = '50%';
                notification.style.left = '50%';
                notification.style.transform = 'translate(-50%, -50%)';
                break;
            case 'middle-right':
                notification.style.top = '50%';
                notification.style.right = '20px';
                notification.style.transform = 'translateY(-50%)';
                break;
            case 'bottom-left':
                notification.style.bottom = '20px';
                notification.style.left = '20px';
                break;
            case 'bottom-center':
                notification.style.bottom = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                break;
            case 'bottom-right':
                notification.style.bottom = '20px';
                notification.style.right = '20px';
                break;
        }

        document.body.appendChild(notification);

        // Плавное появление уведомления
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);

        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);

        playSound();
    }

    function collectBonus() {
        const bonusButton = document.querySelector('button[aria-label="Получить бонус"]');
        if (bonusButton) {
            bonusButton.click();
            console.log('Бонус собран!');
            if (settings.notificationsEnabled) {
                showNotification('🎉 Баллы автоматически получены!', true, true);
            }
        }
    }

    async function translateText(text, lang) {
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.responseData.translatedText;
    }

    function createTranslateButton(messageElement) {
        if (!settings.translationContainerEnabled) return;
        if (messageElement.querySelector('.translate-button')) return;

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s, background-color 0.3s';
        container.style.position = 'absolute';
        container.style.right = '0';
        container.style.top = '2px';
        container.style.padding = '2px 5px';
        container.style.borderRadius = '4px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#0f0f0f';

        const languageSelect = document.createElement('select');
        languageSelect.classList.add('language-select');
        languageSelect.style.backgroundColor = '#1e1e1e';
        languageSelect.style.color = 'white';
        languageSelect.style.border = 'none';
        languageSelect.style.borderRadius = '4px';
        languageSelect.style.padding = '1px 4px';
        languageSelect.style.fontSize = '11px';
        languageSelect.style.fontWeight = '600';
        languageSelect.style.cursor = 'pointer';
        languageSelect.style.marginRight = '10px';

        languageSelect.addEventListener('mouseenter', () => {
            languageSelect.style.backgroundColor = '#333';
        });
        languageSelect.addEventListener('mouseleave', () => {
            languageSelect.style.backgroundColor = '#1e1e1e';
        });

        const options = [
            { value: 'uk', text: 'Українська' },
            { value: 'ru', text: 'Русский' },
            { value: 'kk', text: 'Қазақша' },
            { value: 'be', text: 'Беларуская' }
        ];
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            languageSelect.appendChild(opt);
        });

        const savedLang = localStorage.getItem('selectedLang') || 'uk';
        languageSelect.value = savedLang;

        const translateButton = document.createElement('button');
        translateButton.classList.add('translate-button');
        translateButton.style.backgroundColor = '#9147ff';
        translateButton.style.color = 'white';
        translateButton.style.border = 'none';
        translateButton.style.borderRadius = '4px';
        translateButton.style.padding = '1px 4px';
        translateButton.style.fontSize = '12px';
        translateButton.style.fontWeight = 'bold';
        translateButton.style.cursor = 'pointer';
        translateButton.style.marginLeft = '10px';
        translateButton.innerText = 'Перевести';

        translateButton.addEventListener('mouseenter', () => {
            translateButton.style.backgroundColor = '#772ce8';
        });
        translateButton.addEventListener('mouseleave', () => {
            translateButton.style.backgroundColor = '#9147ff';
        });

        translateButton.addEventListener('click', async () => {
            const originalText = messageElement.querySelector('.text-token').innerText;
            const selectedLang = localStorage.getItem('selectedLang') || 'uk';
            const translatedText = await translateText(originalText, selectedLang);
            messageElement.querySelector('.text-token').innerText = translatedText;
        });

        languageSelect.addEventListener('change', () => {
            localStorage.setItem('selectedLang', languageSelect.value);
        });

        container.appendChild(languageSelect);
        container.appendChild(translateButton);
        messageElement.appendChild(container);

        messageElement.addEventListener('mouseenter', () => {
            container.style.opacity = '1';
        });

        messageElement.addEventListener('mouseleave', () => {
            container.style.opacity = '0';
        });
    }

    function addTranslateButtons() {
        const messages = document.querySelectorAll('.seventv-chat-message-body');
        messages.forEach(messageElement => {
            createTranslateButton(messageElement);
        });
    }

    // Функция для скрытия стандартных иконок Twitch через CSS
    function injectHideIconsCSS() {
        const style = document.createElement('style');
        style.textContent = `[data-badge-id="no_audio"],
[data-badge-id="no_video"],
[data-test-selector="global_badge_none"] {
    display: none !important;
}`;
        document.head.appendChild(style);
    }

    // Функция для удаления контейнеров, содержащих только те значки, которые раньше скрывались
    function removeTwitchBadgeContainers() {
        const containers = document.querySelectorAll('div[class^="Layout-sc-1xcs6mc-"][class*="ijkQYF"]');
        containers.forEach(container => {
            // Если в контейнере есть хотя бы один из искомых значков, удаляем его
            if (container.querySelector('[data-badge-id="no_audio"], [data-badge-id="no_video"], [data-test-selector="global_badge_none"]')) {
                container.remove();
            }
        });
    }

    // MutationObserver для отслеживания динамического добавления элементов с нужными значками
    function observeAndRemoveTwitchBadges() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Если добавленный элемент является контейнером и содержит искомый значок – удаляем его
                            if (node.matches('div[class^="Layout-sc-1xcs6mc-"][class*="ijkQYF"]') &&
                                node.querySelector('[data-badge-id="no_audio"], [data-badge-id="no_video"], [data-test-selector="global_badge_none"]')) {
                                node.remove();
                            } else {
                                // Или ищем внутри добавленного элемента такие контейнеры
                                const badges = node.querySelectorAll('div[class^="Layout-sc-1xcs6mc-"][class*="ijkQYF"]');
                                badges.forEach(el => {
                                    if (el.querySelector('[data-badge-id="no_audio"], [data-badge-id="no_video"], [data-test-selector="global_badge_none"]')) {
                                        el.remove();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Меню настроек
    GM_registerMenuCommand('➖➖➖ Настройки уведомлений ➖➖➖', () => {});
    GM_registerMenuCommand(`Положение уведомлений (текущее: ${settings.notificationPosition})`, () => {
        const currentIndex = notificationPositions.indexOf(settings.notificationPosition);
        const nextIndex = (currentIndex + 1) % notificationPositions.length;
        settings.notificationPosition = notificationPositions[nextIndex];
        GM_setValue('notificationPosition', settings.notificationPosition);
        showNotification(`Положение уведомлений изменено на ${settings.notificationPosition}.`, settings.notificationsEnabled);
    });
    GM_registerMenuCommand(`Уведомления (текущие: ${settings.notificationsEnabled ? 'включено 🟢' : 'отключено 🔴'})`, () => {
        settings.notificationsEnabled = !settings.notificationsEnabled;
        GM_setValue('notificationsEnabled', settings.notificationsEnabled);
        location.reload();
    });
    GM_registerMenuCommand('➖➖➖ Настройки звука ➖➖➖', () => {});
    GM_registerMenuCommand(`Звуковые уведомления (текущие: ${settings.soundEnabled ? 'включено 🟢' : 'отключено 🔴'})`, () => {
        settings.soundEnabled = !settings.soundEnabled;
        GM_setValue('soundEnabled', settings.soundEnabled);
        location.reload();
    });
    GM_registerMenuCommand(`Громкость звука (текущая: ${settings.soundVolume}%)`, () => {
        const newVolume = prompt('Введите громкость (0-100):', settings.soundVolume);
        const volumeValue = parseInt(newVolume, 10);
        if (volumeValue >= 0 && volumeValue <= 100) {
            settings.soundVolume = volumeValue;
            GM_setValue('soundVolume', settings.soundVolume);
            notificationSound.volume = settings.soundVolume / 100;
            showNotification(`Громкость звука изменена на ${settings.soundVolume}%.`, settings.notificationsEnabled);
        } else {
            showNotification('Ошибка: Введите значение от 0 до 100.', settings.notificationsEnabled);
        }
    });
    GM_registerMenuCommand(`Установить пользовательский звук`, () => {
        const newSound = prompt('Введите URL звука:', settings.customSound);
        if (newSound) {
            settings.customSound = newSound;
            GM_setValue('customSound', settings.customSound);
            notificationSound.src = settings.customSound;
            notificationSound.volume = settings.soundVolume / 100;
            showNotification(`Пользовательский звук установлен.`, settings.notificationsEnabled);
        }
    });
    GM_registerMenuCommand(`Удалить пользовательский звук`, () => {
        settings.customSound = 'https://www.myinstants.com/media/sounds/pribyl-godzho-satoru.mp3';
        GM_setValue('customSound', settings.customSound);
        notificationSound.src = settings.customSound;
        notificationSound.volume = settings.soundVolume / 100;
        showNotification(`Пользовательский звук сброшен на умолчание.`, settings.notificationsEnabled);
    });
    GM_registerMenuCommand('➖➖➖ Настройки перевода ➖➖➖', () => {});
    GM_registerMenuCommand(`Перевод (текущие: ${settings.translationContainerEnabled ? 'включено 🟢' : 'отключено 🔴'})`, () => {
        settings.translationContainerEnabled = !settings.translationContainerEnabled;
        GM_setValue('translationContainerEnabled', settings.translationContainerEnabled);
        location.reload();
    });
    GM_registerMenuCommand('➖➖➖ Другие настройки ➖➖➖', () => {});
    GM_registerMenuCommand(`Скрыть стандартные значки Twitch (текущие: ${settings.hideTwitchIcons ? 'включено 🟢' : 'отключено 🔴'})`, () => {
        settings.hideTwitchIcons = !settings.hideTwitchIcons;
        GM_setValue('hideTwitchIcons', settings.hideTwitchIcons);
        location.reload();
    });

    // Если настройка включена, инжектим CSS, удаляем имеющиеся нужные контейнеры и запускаем наблюдение
    if (settings.hideTwitchIcons) {
        injectHideIconsCSS();
        removeTwitchBadgeContainers();
        observeAndRemoveTwitchBadges();
    }

    // Интервалы для выполнения функций
    setInterval(collectBonus, 5000);
    setInterval(addTranslateButtons, 2000);
})();
