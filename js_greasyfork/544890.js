// ==UserScript==
// @name         Twitch BUG Volume 100% Fix
// @namespace    http://tampermonkey.net/
// @version      1.1.9.25
// @description  restoring a preset volume level from storage, preventing 100% noise.
// @author       j56ru45er
// @match        https://www.twitch.tv/*
// @license      MIT
// @icon         https://cdn-icons-png.flaticon.com/512/4340/4340406.png
// @grant        GM.getValue
// @grant        GM.setValue 
// @downloadURL https://update.greasyfork.org/scripts/544890/Twitch%20BUG%20Volume%20100%25%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/544890/Twitch%20BUG%20Volume%20100%25%20Fix.meta.js
// ==/UserScript==

(function () {
    // ======= Предотвращаем многократное выполнение скрипта ======= //
    let internalVolumeUpdate = false;
    if (window.customVolumeScriptLoaded) {
        console.log('Скрипт уже загружен, пропускаем повторный запуск');
        return;
    }
    window.customVolumeScriptLoaded = true;

    // ======= Кастомный ключ для localStorage ======= //
    const VOLUME_KEY = 'twitch__Player_tampermonkey_Volume';

    // ======= Функция для поиска слайдера ======= //
    function getVolumeSlider() {
        console.log('Поиск слайдера громкости...');
        let slider = document.querySelector('[data-a-target="player-volume-slider"]');
        if (slider) {
            console.log('Слайдер найден в обычном DOM:', slider);
            if (slider.closest('[aria-hidden="true"]')) {
                console.warn('Слайдер найден, но находится в элементе с aria-hidden="true", возможны проблемы с доступом');
            }
            return slider;
        }
        console.log('Слайдер не найден в обычном DOM, ищем в Shadow DOM...');
        const shadowHosts = document.querySelectorAll('*');
        for (let host of shadowHosts) {
            if (host.shadowRoot) {
                slider = host.shadowRoot.querySelector('[data-a-target="player-volume-slider"]');
                if (slider) {
                    console.log('Слайдер найден в Shadow DOM:', slider);
                    return slider;
                }
            }
        }
        console.log('Слайдер не найден в Shadow DOM, ищем в iframe...');
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            try {
                slider = iframe.contentDocument?.querySelector('[data-a-target="player-volume-slider"]');
                if (slider) {
                    console.log('Слайдер найден в iframe:', slider);
                    return slider;
                }
            } catch (e) {
                console.warn('Ошибка доступа к iframe:', e);
            }
        }
        console.warn('Слайдер громкости не найден ни в DOM, ни в Shadow DOM, ни в iframe');
        return null;
    }

    // ======= Функция для обновления атрибутов слайдера ======= //
    function updateSliderAttributes(slider, value) {
        console.log(`Обновление атрибутов слайдера: value=${value}`);
        internalVolumeUpdate = true;
        slider.setAttribute('aria-valuenow', Math.round(value * 100));
        slider.setAttribute('aria-valuetext', `${Math.round(value * 100)}%`);
        slider.value = value;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
        internalVolumeUpdate = false;
        const fillElement = slider.parentElement.querySelector('[data-test-selector="tw-range__fill-value-selector"]');
        if (fillElement) {
            fillElement.style.width = `${Math.round(value * 100)}%`;
        }
    }

    // ======= Функция для отслеживания и сохранения громкости ======= //
    function attachWheelListener(slider) {
        const playerContainer = slider.closest('[data-a-target="player-overlay"]') || slider;
        if (!playerContainer) {
            console.warn('Не найден контейнер плеера для прослушивания скролла');
            return;
        }
        playerContainer.addEventListener('wheel', () => {
            setTimeout(() => {
                const newVolume = parseFloat(slider.value);
                if (!internalVolumeUpdate) {
                    console.log(`Обнаружено изменение громкости колесиком: ${newVolume}`);
                    saveVolume(newVolume);
                    updateSliderAttributes(slider, newVolume);
                }
            }, 100);
        }, { passive: true });
        console.log('Обработчик колёсика мыши добавлен');
    }

    // ======= Загрузка сохраненного значения громкости ======= //
    function loadVolume(slider) {
        const savedVolume = localStorage.getItem(VOLUME_KEY);
        console.log(`Загрузка значения из localStorage: ${savedVolume}`);
        if (savedVolume !== null) {
            const volume = parseFloat(savedVolume);
            const currentVolume = parseFloat(slider.value);
            console.log(`Текущая громкость: ${currentVolume}, сохраненная: ${volume}`);
            if (volume !== currentVolume) {
                console.log(`Обновляем слайдер до сохраненной громкости: ${volume}`);
                updateSliderAttributes(slider, volume);
            } else {
                console.log('Текущая громкость совпадает с сохраненной');
            }
        } else {
            console.log(`Нет сохраненной громкости, сохраняем текущую: ${slider.value}`);
            saveVolume(slider.value);
        }
    }

    // ======= Сохранение значения громкости ======= //
    function saveVolume(value) {
        console.log(`Сохранение громкости: ${value} в ключ ${VOLUME_KEY}`);
        localStorage.setItem(VOLUME_KEY, value);
        console.log(`Громкость сохранена: ${value}`);
        console.log(`Подтверждение сохранения: ${localStorage.getItem(VOLUME_KEY)}`);
    }

    // ======= Проверка и исправление бага с громкостью 100% ======= //
    function checkAndFixVolumeBug(slider) {
        console.log('Проверка бага с громкостью 100%...');
        const currentVolume = parseFloat(slider.value);
        console.log(`Текущая громкость слайдера: ${currentVolume}`);
        if (currentVolume === 1.0) {
            console.log('Обнаружена громкость 100%, проверяем сохраненное значение...');
            const savedVolume = localStorage.getItem(VOLUME_KEY);
            if (savedVolume !== null) {
                const volume = parseFloat(savedVolume);
                if (volume !== 1.0) {
                    console.log(`Баг Twitch: громкость 100%, но сохранено ${volume}. Восстанавливаем...`);
                    updateSliderAttributes(slider, volume);
                } else {
                    console.log('Громкость 100% соответствует сохраненному значению');
                }
            } else {
                console.log('Нет сохраненного значения, устанавливаем значение по умолчанию (0.5)');
                const defaultVolume = 0.5;
                updateSliderAttributes(slider, defaultVolume);
                saveVolume(defaultVolume);
            }
        } else {
            console.log('Громкость не 100%, баг не обнаружен');
        }
    }

    // ======= Инициализация слайдера ======= //
    function initializeSlider(attempt = 1, maxAttempts = 65) {
        console.log(`Попытка инициализации слайдера #${attempt}`);
        const volumeSlider = getVolumeSlider();
        if (!volumeSlider) {
            if (attempt < maxAttempts) {
                console.warn(`Слайдер не найден, повторная попытка через 1 секунду (попытка ${attempt}/${maxAttempts})`);
                setTimeout(() => initializeSlider(attempt + 1, maxAttempts), 1000);
            } else {
                console.error('Слайдер не найден после максимального количества попыток');
            }
            return;
        }
        checkAndFixVolumeBug(volumeSlider);
        loadVolume(volumeSlider);
        volumeSlider.addEventListener('input', (event) => {
            if (internalVolumeUpdate) {
                console.log('Пропускаем input из-за внутреннего обновления');
                return;
            }
            const volume = event.target.value;
            console.log(`Слайдер изменен пользователем: новое значение=${volume}`);
            saveVolume(volume);
            updateSliderAttributes(volumeSlider, volume);
        });
        console.log('Обработчик input добавлен к слайдеру');
        attachWheelListener(volumeSlider);
    }

    // ======= Наблюдатель за изменениями в DOM ======= //
    function observePlayerContainer() {
        console.log('Запуск наблюдателя за контейнером плеера...');
        const playerRoot = document.querySelector('[data-a-target="video-player"]')?.parentElement;
        if (!playerRoot) {
            console.warn('Контейнер плеера не найден, повторная попытка через 1с');
            setTimeout(observePlayerContainer, 1000);
            return;
        }
        const observer = new MutationObserver(() => {
            const slider = document.querySelector('[data-a-target="player-volume-slider"]');
            if (slider) {
                console.log('Слайдер обнаружен после изменения контейнера плеера — переинициализация');
                initializeSlider();
            }
        });
        observer.observe(playerRoot, { childList: true, subtree: true });
    }

    // ======= Обработка смены канала ======= //
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            const slider = getVolumeSlider();
            if (slider) {
                console.log('Вкладка активна, принудительно сохраняем текущую громкость');
                saveVolume(slider.value);
            }
        }
    });

    function handleChannelChange() {
        console.log('Смена канала или переход на страницу со стримом');
        let attempts = 0;
        const maxAttempts = 60;
        const interval = setInterval(() => {
            const slider = getVolumeSlider();
            if (slider) {
                console.log('Слайдер найден после смены канала, инициализация...');
                checkAndFixVolumeBug(slider);
                loadVolume(slider);
                clearInterval(interval);
            }
            attempts++;
            if (attempts >= maxAttempts) {
                console.warn('Слайдер так и не появился после смены канала');
                clearInterval(interval);
            }
        }, 1000);
    }

    // ======= Запуск скрипта ======= //
    function startScript() {
        console.log('Запуск скрипта...');
        if (localStorage.getItem('twitch__Player_tampermonkey_Volume')) {
            console.log('Удаляем старый ключ twitch__Player_tampermonkey_Volume из localStorage');
            localStorage.removeItem('twitch__Player_tampermonkey_Volume');
        }
        if (localStorage.getItem(VOLUME_KEY)) {
            console.log(`Ключ ${VOLUME_KEY} уже существует в localStorage`);
        }
        setTimeout(() => {
            console.log('Запуск инициализации слайдера с задержкой...');
            initializeSlider();
            observePlayerContainer();
        }, 500);
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                console.log('URL изменился, предполагается смена канала:', currentUrl);
                lastUrl = currentUrl;
                handleChannelChange();
            }
        }).observe(document, { subtree: true, childList: true });
        if (window.Twitch && window.Twitch.Player) {
            console.log('Twitch Player API обнаружен, добавляем обработчик смены канала');
            try {
                const player = new window.Twitch.Player();
                player.addEventListener(window.Twitch.Player.CHANNEL_CHANGE, handleChannelChange);
            } catch (e) {
                console.warn('Ошибка инициализации Twitch Player:', e);
            }
        } else {
            console.log('Twitch API не обнаружен, используем fallback для смены канала');
            document.addEventListener('channelChange', handleChannelChange);
        }
    }

    // ======= Запуск скрипта ======= //
    startScript();
})();