// ==UserScript==
// @name         HDRezka: Автозамена и переключение CDN с проверкой потока
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  Подменяет заблокированные домены на рабочие CDN, проверяет доступность потока и позволяет переключать CDN вручную через выпадающий список на HDRezka.
// @author       You
// @include      /^https?:\/\/.*rezk.*\/(films|series)\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537991/HDRezka%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20CDN%20%D1%81%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%BE%D0%B9%20%D0%BF%D0%BE%D1%82%D0%BE%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/537991/HDRezka%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20CDN%20%D1%81%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%BE%D0%B9%20%D0%BF%D0%BE%D1%82%D0%BE%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockedHosts = [
        'legium.sambray.org',
        'phantom.sambray.org',
        'sambray.org',
        'stream.voidboost.cc',
        'legium.stream.voidboost.cc',
    ];

    const workingCDNs = [
        'prx2-ams.ukrtelcdn.net',
        'prx-ams.ukrtelcdn.net',
        'ukrtelcdn.net',
        'prx.ukrtelcdn.net',
        'indigo.sambray.org'
    ];

    // Получить случайный рабочий CDN
    function getRandomWorkingCDN() {
        return workingCDNs[Math.floor(Math.random() * workingCDNs.length)];
    }

    // Проверка доступности потока по URL через fetch (HEAD-запрос)
    async function checkStreamAvailable(url) {
        try {
            const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
            // В режиме no-cors ответ всегда opaque, но если ошибки нет — считаем доступным
            return response && (response.status === 200 || response.type === 'opaque');
        } catch (e) {
            return false;
        }
    }

    // Обновить видео и попытаться воспроизвести
    async function updateVideoSource(el, newSrc) {
        el.src = newSrc;
        const videoTag = el.tagName.toLowerCase() === 'video' ? el : el.closest('video');
        if (videoTag) {
            videoTag.load();
            setTimeout(() => {
                videoTag.play().catch(err => {
                    console.warn('[HDRezka Fix] Не удалось autoplay:', err);
                });
            }, 300);
        }
    }

    // Найти первый источник видео и вернуть его элемент и src
    function findVideoSource() {
        // Иногда видео в <video>, иногда в <source>
        const videos = document.querySelectorAll('video, source');
        for (const el of videos) {
            if (el.src) {
                return el;
            }
        }
        return null;
    }

    // Определить текущий CDN из src
    function getCurrentCDN(src) {
        for (const cdn of workingCDNs) {
            if (src.includes(cdn)) return cdn;
        }
        return null;
    }

    // Функция для подмены CDN с проверкой доступности
    async function fixVideoSourceWithCheck() {
        const el = findVideoSource();
        if (!el) {
            console.log('[HDRezka Fix] Видео источник не найден');
            return;
        }

        for (const blockedHost of blockedHosts) {
            if (el.src.includes(blockedHost)) {
                // Перебираем рабочие CDN и ищем доступный
                for (const cdn of shuffleArray(workingCDNs)) {
                    const newSrc = el.src.replace(blockedHost, cdn);
                    const available = await checkStreamAvailable(newSrc);
                    if (available) {
                        console.log(`[HDRezka Fix] Поток доступен на CDN: ${cdn}`);
                        await updateVideoSource(el, newSrc);
                        showCDNInfo(cdn);
                        return;
                    } else {
                        console.log(`[HDRezka Fix] Поток недоступен на CDN: ${cdn}`);
                    }
                }
                console.warn('[HDRezka Fix] Нет доступных CDN для текущего потока');
            }
        }

        // Если текущий CDN рабочий — просто показать его
        const currentCDN = getCurrentCDN(el.src);
        if (currentCDN) {
            showCDNInfo(currentCDN);
        }
    }

    // Функция для показа информации о текущем CDN
    function showCDNInfo(cdn) {
        let container = document.getElementById('cdn-info-container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'cdn-info-container';
            container.style.cssText = `
            background: #85CD77;
            color: white;
            padding: 3px 10px;
            font-weight: bold;
            font-family: Arial, sans-serif;
            border-radius: 2px;
            user-select: none;
            cursor: default;
            white-space: nowrap;
            margin-left: auto;
            flex-shrink: 0;
        `;

            // ВСТАВЛЯЕМ ВНУТРЬ ОБЕРТКИ СПРАВА ОТ КНОПКИ
            const wrapper = document.getElementById('cdn-selector-wrapper');
            if (wrapper) {
                wrapper.appendChild(container);
            }
        }

        container.textContent = `Текущий CDN: ${cdn}`;
    }

    // Создаем выпадающий список для выбора CDN
    function createCDNSelector(currentCDN = workingCDNs[0]) {
        let wrapper = document.getElementById('cdn-selector-wrapper');
        if (wrapper) return;

        wrapper = document.createElement('div');
        wrapper.id = 'cdn-selector-wrapper';
        wrapper.style.cssText = `
         margin: 5px 0 10px 0;
         font-family: Arial, sans-serif;
         user-select: none;
         display: flex;
         flex-wrap: wrap;
         align-items: center;
         gap: 8px;
        `;

        // === Блок с текущим CDN ===
        const cdnInfo = document.createElement('div');
        cdnInfo.id = 'cdn-info-container';
        cdnInfo.style.cssText = `
        background: #85CD77;
        color: white;
        padding: 3px 10px;
        font-weight: bold;
        border-radius: 2px;
        user-select: none;
    `;
        cdnInfo.textContent = `Текущий CDN: ${currentCDN}`;
        wrapper.appendChild(cdnInfo);

        // === Метка и селектор ===
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '8px';

        const label = document.createElement('label');
        label.textContent = 'Выбрать CDN:';
        label.style.color = '#007acc';

        const select = document.createElement('select');
        select.id = 'cdn-selector';
        select.style.padding = '4px 6px';
        select.style.borderRadius = '3px';
        select.style.border = '1px solid #007acc';

        workingCDNs.forEach(cdn => {
            const option = document.createElement('option');
            option.value = cdn;
            option.textContent = cdn;
            if (cdn === currentCDN) option.selected = true;
            select.appendChild(option);
        });

        const btnSwitch = document.createElement('button');
        btnSwitch.textContent = 'Переключить поток';
        btnSwitch.style.cssText = `
        padding: 5px 10px;
        background-color: #007acc;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    `;

        // Наведение: делаем цвет темнее
        btnSwitch.addEventListener('mouseenter', () => {
            btnSwitch.style.backgroundColor = '#0056b3'; // темно-синий
        });

        btnSwitch.addEventListener('mouseleave', () => {
            btnSwitch.style.backgroundColor = '#007acc'; // обратно как было
        });

        btnSwitch.addEventListener('click', async () => {
            const cdn = select.value;
            const el = findVideoSource();
            if (!el) {
                alert('Видео источник не найден');
                return;
            }

            let replaced = false;
            blockedHosts.forEach(blockedHost => {
                if (el.src.includes(blockedHost)) {
                    el.src = el.src.replace(blockedHost, cdn);
                    replaced = true;
                }
            });

            if (!replaced) {
                const currentCDN = getCurrentCDN(el.src);
                if (currentCDN) {
                    el.src = el.src.replace(currentCDN, cdn);
                    replaced = true;
                }
            }

            if (!replaced) {
                alert('Не удалось заменить CDN в URL видео');
                return;
            }

            const available = await checkStreamAvailable(el.src);
            if (!available) {
                alert('Выбранный CDN недоступен');
                return;
            }

            await updateVideoSource(el, el.src);
            showCDNInfo(cdn); // Просто обновляем текст
        });

        controls.appendChild(label);
        controls.appendChild(select);
        controls.appendChild(btnSwitch);
        wrapper.appendChild(controls);

        // Вставляем под описанием
        const target = document.querySelector('.b-post__description_text');
        if (target && target.parentNode) {
            target.parentNode.insertBefore(wrapper, target.nextSibling);
        } else {
            document.body.appendChild(wrapper);
        }
    }

    // Помогает случайно перемешать массив (Fisher-Yates)
    function shuffleArray(array) {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }


    // Основной запуск
    async function main() {
        await fixVideoSourceWithCheck();

        const video = findVideoSource();
        let currentCDN = 'неизвестно';
        if (video && video.src) {
            const cdn = getCurrentCDN(video.src);
            if (cdn) currentCDN = cdn;
        }

        createCDNSelector(currentCDN);
    }


    // Запускаем после загрузки
    window.addEventListener('load', main);

    // И на изменения DOM (если видео загружается динамически)
    const observer = new MutationObserver(() => {
        fixVideoSourceWithCheck();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
