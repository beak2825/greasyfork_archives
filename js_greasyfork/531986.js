// ==UserScript==
// @name         Кнопка перехода на Flicksbar из Kinorium (без использования API Кинопоиска)
// @namespace    http://tampermonkey.net/
// @version      1.0.6.0
// @description  Ищет фильм в Google и автоматически переходит на или Reyohoho (опционально можно переключить в меню).
// @author       CgPT & Vladimir_0202
// @icon         https://ru.kinorium.com/favicon.ico
// @match        *://*.kinorium.com/*
// @match        *://flcksbr.top/*
// @match        *://www.google.com/search*
// @match        *://duckduckgo.com/*
// @include      /^https:\/\/.*flicksbar\..*$/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531986/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%B0%20%D0%BD%D0%B0%20Flicksbar%20%D0%B8%D0%B7%20Kinorium%20%28%D0%B1%D0%B5%D0%B7%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20API%20%D0%9A%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531986/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%B0%20%D0%BD%D0%B0%20Flicksbar%20%D0%B8%D0%B7%20Kinorium%20%28%D0%B1%D0%B5%D0%B7%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20API%20%D0%9A%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //Добавляем кнопки в меню TamperMonkey
    let menuCommands = {};

    // Описываем функции в массиве
    const features = [
        { key: 'function1Enabled', type: 'boolean', name: 'Очистка Хранилища', description: 'Удаляет сохранённые временные данные (например, постер и описание)' },
        { key: 'function2Enabled', type: 'boolean', name: 'Запрос при переходе на Flicksbar', description: 'Показывает подтверждение перед редиректом на Flicksbar' },

        {
            key: 'function3Enabled',
            type: 'enum',
            values: ['google', 'duckduckgo'],
            labels: { google: 'Google', duckduckgo: 'DuckDuckGo' },
            icons: { google: '🔍', duckduckgo: '🦆'},
            description: 'Редирект через Google или DuckDuckGo'
        },
        {
            key: 'function4Enabled',
            type: 'enum',
            values: ['flicksbar', 'reyohoho'],
            labels: { flicksbar: 'Flicksbar', reyohoho: 'Reyohoho' },
            icons: { flicksbar: '🎬', reyohoho: '📺'},
            description: 'Переключение сайта назначения'
        }
    ];


    // Регистрируем все пункты меню
    function registerAllMenus() {
        for (let id in menuCommands) {
            GM_unregisterMenuCommand(menuCommands[id]);
        }
        menuCommands = {};

        for (let feature of features) {

            let title;

            if (feature.type === 'boolean') {
                const enabled = GM_getValue(feature.key, true);
                title = (enabled ? '✅ Вкл: ' : '❌ Выкл: ') + feature.name;
            }

            if (feature.type === 'enum') {
                const value = GM_getValue(feature.key, feature.values[0]);
                title = feature.icons[value] + ' ' + feature.labels[value];
            }

            menuCommands[feature.key] =
                GM_registerMenuCommand(title, () => toggleFeature(feature));
        }
    }


    // Функция переключения состояния
    function toggleFeature(feature) {

        // BOOLEAN
        if (feature.type === 'boolean') {
            const current = GM_getValue(feature.key, true);
            const next = !current;
            GM_setValue(feature.key, next);

            alert(`${feature.name}: ${next ? '✅ Включено' : '❌ Выключено'}\n\n${feature.description}`);
        }

        // ENUM
        if (feature.type === 'enum') {
            const current = GM_getValue(feature.key, feature.values[0]);
            const index = feature.values.indexOf(current);
            const next = feature.values[(index + 1) % feature.values.length];

            GM_setValue(feature.key, next);

            alert(`Выбрано: ${feature.icons[next]} ${feature.labels[next]}\n\n${feature.description}`);
        }

        registerAllMenus();
    }

    function initDefaults() {
        for (const feature of features) {
            if (feature.type === 'enum') {
                const value = GM_getValue(feature.key, null);
                if (!feature.values.includes(value)) {
                    GM_setValue(feature.key, feature.values[0]);
                }
            }
        }
    }


    // При старте скрипта
    initDefaults();
    registerAllMenus();

    const url = window.location.href;

    // === 1. KINORIUM: Добавляем кнопку на страницу фильма ===
    if (/kinorium\.com\/\d+\/?$/.test(url)) {

        // Сохраняем постер и описание в хранилище Tampermonkey
        const posterEl = document.querySelector('.jsCarouselImageContainer img') || document.querySelector('.carousel_image-handler img');
        const descEl = document.querySelector('.film-page__text');
        const titleEl = document.querySelector('.film-page__title-text.film-page__itemprop');
        const originalTitleEl = document.querySelector('.film-page__orig_with_comment') || document.querySelector('.film-page__subtitle');
        const yearEl = document.querySelector('.film-page__date a[href*="years_min="]');
        const raitingEl = document.querySelector('.film-page__title-rating')
        || Array.from(document.querySelectorAll('.ratingsBlock li'))
        .find(li => li.textContent.includes('Кинориум'))
        ?.querySelector('.value');

        const poster = posterEl?.src;
        const description = descEl?.innerText;
        const titleTMP = titleEl?.innerText;
        const originalTitleTMP = originalTitleEl?.innerText;
        const yearTMP = yearEl?.innerText || '';
        const raitingTMP = raitingEl?.innerText?.trim() || '';
        const currentUrlTMP = window.location.href;

        if (poster && description) {
            GM_setValue('flicksbar_poster', poster); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_description', description); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_titleTMP', titleTMP); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_originalTitleTMP', originalTitleTMP); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_yearTMP', yearTMP); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_raitingTMP', raitingTMP); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_currentUrlTMP', currentUrlTMP);
            console.log('✅ Постер и описание сохранены в Tampermonkey storage');
        } else {
            console.warn('⚠️ Не удалось найти постер или описание');
        }


        function getFilmDetails() {
            const titleElement = document.querySelector('.film-page__title-text.film-page__itemprop');
            const originalTitleElement = document.querySelector('.film-page__orig_with_comment');
            const typeLink = document.querySelector('.b-post__info a[href*="/series/"]');
            const yearElement = document.querySelector('.film-page__date a[href*="years_min="]');
            const title = titleElement ? titleElement.textContent.trim() : '';
            const originalTitle = originalTitleElement ? originalTitleElement.textContent.trim() : '';
            const year = yearElement ? yearElement.textContent.trim() : '';
            const isSeries = typeLink !== null;
            return { title, originalTitle, year, isSeries };
        }

        function createButton() {
            const button = document.createElement('button');
            button.innerHTML = '<span style="display:inline-flex; align-items:center; justify-content:center; width:20px; height:22px; margin-right:8px; border:2px solid white; border-radius:50%; font-size:12px; padding-left:2px;">▶</span>Смотреть бесплатно Онлайн';
            button.style.cssText = `
                padding: 9px;
                margin-top: -5px;
                margin-bottom: 2px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 3px;
                width: 100%;
                cursor: pointer;
                transition: background-color 0.3s ease;
            `;

            button.addEventListener('mouseenter', () => button.style.backgroundColor = '#0056b3');
            button.addEventListener('mouseleave', () => button.style.backgroundColor = '#007bff');

            const { title, originalTitle, year } = getFilmDetails();
            button.title = `Смотреть "${title} ${originalTitle} ${year}" бесплатно онлайн`;

            button.onclick = () => {
                const { title, originalTitle, year, isSeries } = getFilmDetails();
                if (!title) return alert('Не удалось извлечь информацию о фильме.');
                const searchQuery = encodeURIComponent(`${title} ${originalTitle} ${year} кинопоиск`);
                const flicksbarType = isSeries ? 'series' : 'film';

                const engine = GM_getValue('function3Enabled', 'google')
                const searchUrl =
                      engine === "google"
                ? `https://www.google.com/search?q=${searchQuery}&btnK&flcks_type=${flicksbarType}`
                : `https://duckduckgo.com/?q=${searchQuery}&btnK&flcks_type=${flicksbarType}`;
                window.open(searchUrl, '_blank');
            };

            const sideCover = document.querySelector('.collectionWidget.collectionWidgetData.withFavourites');
            if (sideCover) sideCover.appendChild(button);
            else console.warn('Элемент для вставки кнопки не найден.');
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createButton);
        } else {
            createButton();
        }
    }

    // === 2. GOOGLE: Автопереход на Flicksbar по найденному ID Кинопоиска ===
    if (/google\.com\/search/.test(url) || /duckduckgo\.com\//.test(url)) {
        function showConfirmWithTimeout(flicksbarUrl, timeout = 5000) {
            return new Promise((resolve) => {
                const modal = document.createElement('div');
                Object.assign(modal.style, {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    backgroundColor: '#EEE8AA',
                    border: '1px solid #ccc',
                    zIndex: '9999',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                });

                const message = document.createElement('p');
                message.style.color = 'black';
                message.innerHTML = `<b>Переход на Flicksbar</b> <br><br>Перейти по ссылке: <b>${flicksbarUrl}</b> ?`;
                modal.appendChild(message);

                const okButton = document.createElement('button');
                okButton.textContent = 'Да';
                Object.assign(okButton.style, {
                    marginRight: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                });
                okButton.onclick = () => {
                    resolve(true);
                    modal.remove();
                };
                modal.appendChild(okButton);

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Нет';
                Object.assign(cancelButton.style, {
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                });
                cancelButton.onclick = () => {
                    resolve(false);
                    modal.remove();
                };
                modal.appendChild(cancelButton);

                document.body.appendChild(modal);

                setTimeout(() => {
                    resolve(false); //resolve(true); - если надо чтобы после таймера нажималась кнопка ОK
                    modal.remove();
                }, timeout);
            });
        }

        function observeResults() {
            const observer = new MutationObserver(() => {
                const kpLink = document.querySelector('a[href*="kinopoisk.ru/film/"]');
                if (kpLink) {
                    observer.disconnect(); // Остановить наблюдение
                    tryRedirect(kpLink);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        async function tryRedirect(kpLink) {

            const urlParams = new URLSearchParams(window.location.search);
            const type = urlParams.get('flcks_type'); // фильм / сериал (для Flicksbar)

            const preferGoogle = GM_getValue('function3Enabled', true);

            // ✅ Разрешаем редирект, если:
            // - включён Google и есть параметр flcks_type
            // - включён DuckDuckGo и есть параметр flcks_type
            const allowRedirect =
                  (preferGoogle && type) || (!preferGoogle && type);
            console.log ('urlParams: ', urlParams)
            console.log ('type: ', type)
            console.log ('preferGoogle: ', preferGoogle)

            if (!allowRedirect) {
                console.log('Редирект не выполняется: источник не соответствует настройке function3Enabled');
                return;
            }

            const match = kpLink.href.match(/kinopoisk\.ru\/film\/(\d+)/);
            if (!match) return;

            const kpId = match[1];
            //const urlParams = new URLSearchParams(window.location.search);
            //const type = urlParams.get('flcks_type') || 'film';
            const videoSite = GM_getValue('function4Enabled', 'flicksbar')
            const flicksbarUrl =
                  videoSite === "flicksbar"
            ? `https://flcksbr.top/${type}/${kpId}/`
            : `https://reyohoho.github.io/reyohoho/movie/${kpId}`;

            if (GM_getValue('function2Enabled', true)) {
                const answer = await showConfirmWithTimeout(flicksbarUrl, 5000);
                if (answer) window.location.href = flicksbarUrl;
                else console.log('Переход отменен пользователем или истек таймаут.');
            } else {
                window.location.href = flicksbarUrl;
            }

        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryRedirect);
        } else {
            observeResults();
        }
    }


// === 3. Flicksbar: изменение плеера и добавление постера и описания ===
if (/https?:\/\/(flicksbar\.mom|flcksbr\.top)\/(film|series)\/\d+\/?$/.test(location.href)) {

    // Функция для отображения постера и описания в блоке справа
    function displayMovieInfo(poster, description, titleTMP, originalTitleTMP, yearTMP, raitingTMP) {
        const infoBox = document.getElementById("kinorium-info");
        if (infoBox && poster && description && titleTMP && originalTitleTMP && yearTMP && raitingTMP) {
            infoBox.innerHTML = `
            <p style="font-size:25px;">${titleTMP} ${originalTitleTMP} ${yearTMP} ${raitingTMP}</p><br><img src="${poster}" alt="Постер" style="width:100%;border-radius:10px;margin-bottom:10px;display:flex;justify-content:center;align-items:center; ">
            <p style="color:white;font-size:16px;line-height:1.4;">${description}</p>
        `;
        }
    }

    function clearFlicksbarInfo() {
        console.log('✅ Очистка данных...');
        GM_deleteValue('flicksbar_poster');
        GM_deleteValue('flicksbar_description');
        GM_deleteValue('flicksbar_titleTMP');
        GM_deleteValue('flicksbar_originalTitleTMP');
        GM_deleteValue('flicksbar_yearTMP');
        GM_deleteValue('flicksbar_raitingTMP');
        GM_deleteValue('flicksbar_currentUrlTMP');
    }

    // Убираем рекламу
    function removeAds() {
        const selectors = [
            "#tgWrapper", "#TopAdMb", ".brand", ".topAdPad",
            ".adDown", "body > span", "body > script:first-child"
        ];
        selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.remove();
        });
    }

    // Структурируем страницу
    function restructurePage() {
        const main = document.querySelector(".mainContainer");
        const player = document.querySelector(".kinobox");

        if (!main || !player) return;

        document.documentElement.style.overflowY = "auto"; // Включаем скроллинг на уровне всей страницы
        document.body.style.overflowY = "auto"; // И на body тоже на всякий
        document.body.style.background = "#1c1c1c";

        player.style.minHeight = "0";
        player.style.height = "100%";
        player.style.width = "100%";
        player.style.borderRadius = "8px";

        const layout = document.createElement("div");
        layout.style.display = "flex";
        layout.style.flexWrap = "nowrap"; // не переносить элементы
        layout.style.background = "#1c1c1c";
        layout.style.gap = "10px";
        layout.style.marginTop = "10px";
        layout.style.alignItems = "stretch";
        layout.style.width = "100%";
        layout.style.boxSizing = "border-box";
        layout.classList.add("responsive-layout");

        const left = document.createElement("div");
        left.style.flex = "7 1 0"; // flex-grow, flex-shrink, flex-basis
        left.style.height = "100%";
        left.style.minHeight = "500px";
        left.style.marginLeft = "5px";
        left.style.display = "flex";
        left.style.flexDirection = "column";
        left.style.minWidth = "0"; // чтобы flex мог ужимать
        left.classList.add("responsive-left");
        left.appendChild(player);

        const right = document.createElement("div");
        right.style.flex = "3 1 0";
        right.style.fontFamily = "sans-serif";
        right.style.color = "#eee";
        right.style.borderRadius = "8px";
        right.style.marginRight = "5px";
        right.style.padding = "15px";
        right.style.background = "#222";
        right.style.overflow = "auto";
        right.style.minWidth = "0";
        right.classList.add("responsive-right");

        const infoWrapper = document.createElement("div");
        infoWrapper.id = "kinorium-info";
        infoWrapper.style.flex = "flex";
        infoWrapper.style.flexDirection = "column";
        infoWrapper.style.gap = "20px";
        infoWrapper.style.width = "100%";

        right.appendChild(infoWrapper);
        layout.appendChild(left);
        layout.appendChild(right);

        main.innerHTML = "";
        main.style.display = "inline-block";
        main.style.background = "#1c1c1c";
        main.style.boxSizing = "border-box"; // на всякий
        main.style.width = "100%";
        main.appendChild(layout);

        const style = document.createElement("style");
        style.textContent = `
            @media (max-width: 768px) and (orientation: portrait) {
                .responsive-layout {
                    flex-direction: column !important;
                    margin-top: 2px !important;
                }
                .responsive-left {
                    width: auto !important;
                    height: auto !important;
                    margin: 2px !important;
                    min-height: auto !important;
                }
                .responsive-right {
                    flex: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }


    // Добавялем инфу про фильм
    function loadAndDisplayInfo() {
        const poster = GM_getValue('flicksbar_poster', null);
        const description = GM_getValue('flicksbar_description', null);
        const titleTMP = GM_getValue('flicksbar_titleTMP', null);
        const originalTitleTMP = GM_getValue('flicksbar_originalTitleTMP', null);
        const yearTMP = GM_getValue('flicksbar_yearTMP', null);
        const raitingTMP = GM_getValue('flicksbar_raitingTMP', null);
        const currentUrlTMP = GM_getValue('flicksbar_currentUrlTMP', null);

        const infoContainer = document.querySelector("#kinorium-info");
        if (!infoContainer) {
            console.log('#kinorium-info element not found on the page.');
            return;
        }

        infoContainer.innerHTML = "";

        const dynamicStyle = document.createElement('style');
        dynamicStyle.textContent = `
               @keyframes fadeInScale {
                 0% {
                   opacity: 0;
                   transform: scale(0.95);
                 }
                 100% {
                   opacity: 1;
                   transform: scale(1);
                 }
               }

               .fade-in-scale {
                 animation: fadeInScale 0.8s ease-out;
               }
               `;
        const invisibleScrollbarStyle = document.createElement('style');
        invisibleScrollbarStyle.textContent = `
/* Скроллбар невидим в обычном состоянии */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: transparent;
}

/* Трек (фон полосы) тоже прозрачный */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Ползунок скрыт, но появляется при наведении */
::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
  transition: background 0.3s ease;
}

/* При наведении — появляется аккуратный ползунок */
:hover::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.7);
}

/* Для Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

*:hover {
  scrollbar-color: rgba(150,150,150,0.7) transparent;
}
`;
        document.head.appendChild(invisibleScrollbarStyle);
        document.head.appendChild(dynamicStyle);

        // Заголовок
        if (titleTMP || originalTitleTMP || yearTMP) {
            const titleElement = document.createElement("div");
            titleElement.innerHTML = `
                 <div style="text-align: center; margin-bottom: 5px;">
                      <div style="font-size: 22px; font-weight: bold;">${titleTMP || ""}</div>
                      ${(originalTitleTMP || yearTMP) ? `
                      <div style="font-size: 18px; margin-top: 2px;">
                           <span style="color: #aaa;">${originalTitleTMP || ""}</span>
                           ${yearTMP ? `<span style="color: #fff;"> (${yearTMP})</span>` : ""}
                      </div>
                      ` : ""}
                 </div>
            `;

            infoContainer.appendChild(titleElement);
        }

        // Рейтинг
        if (raitingTMP) {
            let ratingColor = "#aaa";
            const ratingNum = parseFloat(raitingTMP);
            if (ratingNum < 5) ratingColor = "red";
            else if (ratingNum < 7) ratingColor = "orange";
            else ratingColor = "lightgreen";

            const ratingElement = document.createElement("p");
            ratingElement.textContent = `Рейтинг: ${raitingTMP}`;
            ratingElement.style.cssText = `
            font-size: 18px;
            color: ${ratingColor};
            text-align: center;
            margin: 0 0 5px;
        `;
            infoContainer.appendChild(ratingElement);
        }

        // Постер
        if (poster) {
            const posterElement = document.createElement("img");
            posterElement.src = poster;
            posterElement.alt = "Постер фильма";
            posterElement.style.maxWidth = "100%";
            posterElement.style.borderRadius = "12px";
            posterElement.style.display = "block";
            posterElement.style.margin = "0 auto 10px";
            posterElement.className = "fade-in-scale"; // применяем нашу анимацию через класс
            infoContainer.appendChild(posterElement);

            posterElement.addEventListener('mouseover', () => {
            posterElement.style.transform = 'scale(1.005)';
            posterElement.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
            posterElement.style.boxShadow = 'none';
            posterElement.style.cursor = 'pointer';
            });

            posterElement.addEventListener('mouseout', () => {
            posterElement.style.transform = 'scale(1)';
            posterElement.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
            posterElement.style.cursor = 'pointer';
            });

            posterElement.addEventListener('click', () => {
                window.open(currentUrlTMP, '_blank');
            });
        }

        // Описание
        if (description) {
            const descriptionWrapper = document.createElement("div");
            descriptionWrapper.style.overflowY = "auto";
            descriptionWrapper.style.maxHeight = "300px";
            descriptionWrapper.style.paddingRight = "8px";

            const descPara = document.createElement("p");
            descPara.innerText = description;
            descPara.style.fontSize = "16px";
            descPara.style.lineHeight = "1.5";
            descPara.style.textAlign = "justify";
            descPara.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";
            descPara.style.borderRadius = "10px";
            descPara.style.padding = "5px";
            descPara.style.background = "#1c1c1c";
            descPara.className = "fade-in-scale"; // применяем нашу анимацию через класс

            descriptionWrapper.appendChild(descPara);
            infoContainer.appendChild(descriptionWrapper);

            // Плавное уменьшение шрифта при переполнении
            setTimeout(() => {
                let fontSize = 16;
                while (descriptionWrapper.scrollHeight > descriptionWrapper.clientHeight && fontSize > 12) {
                    fontSize--;
                    descPara.style.fontSize = fontSize + "px";
                }
            }, 100);
        }

        console.log('✅ Информация успешно отображена (гибкий режим)');
    }



    // Вызываем всё нужное
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeAds();
            restructurePage();
            loadAndDisplayInfo();
        });
    } else {
        removeAds();
        restructurePage();
        loadAndDisplayInfo();
    }

    // Очистка данных при закрытии страницы или переходе на другой сайт
    window.addEventListener("unload", () => {
        if (GM_getValue('function1Enabled', true)) {
        console.log("✅ Очистка хранилища...");
        clearFlicksbarInfo(); // Очистка данных
        } else {
           console.log("✅ Очистка хранилища отключена...");
        }

    });

}


})();
