// ==UserScript==
// @name         New Button HDRezka -> Flicksbar (not API KP)
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Ищет фильм в Google/DuckDuckGo и автоматически переходит на Flicksbar без использования API Кинопоиска
// @author       CgPT & Vladimir_0202
// @icon         https://icon2.cleanpng.com/lnd/20240915/sf/f756b06ecd171836c2c3ef125178d4.webp
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @match        *://www.google.kz/search*
// @match        *://duckduckgo.com/*
// @match        *://flcksbr.top/*
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538909/New%20Button%20HDRezka%20-%3E%20Flicksbar%20%28not%20API%20KP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538909/New%20Button%20HDRezka%20-%3E%20Flicksbar%20%28not%20API%20KP%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //Добавляем кнопки в меню TamperMonkey
    let menuCommands = {};

    // Описываем функции в массиве
    const features = [
        { key: 'func1Clear', name: 'Очистка Хранилища', description: 'Удаляет сохранённые временные данные (например, постер и описание)' },
        { key: 'func2Redirect', name: 'Запрос при переходе на Flicksbar', description: 'Показывает подтверждение перед редиректом на Flicksbar' },
        { key: 'func3Search', name: 'Редирект через Google или DuckDuckGo ', description: 'Переключение редиректа с Google на DuckDuckGo'}
    ];

    // Регистрируем все пункты меню
    function registerAllMenus() {
        // Удаляем старые команды меню
        for (let id in menuCommands) {
            GM_unregisterMenuCommand(menuCommands[id]);
        }
        menuCommands = {};

        // Регистрируем новые команды
        for (let feature of features) {
            let enabled = GM_getValue(feature.key, true);
            let title = (enabled ? "✅ Вкл: " : "❌ Выкл: ") + feature.name;

            menuCommands[feature.key] = GM_registerMenuCommand(title, () => toggleFeature(feature));
        }
    }

    // Функция переключения состояния
    function toggleFeature(feature) {
        let currentState = GM_getValue(feature.key, true);
        let newState = !currentState;
        GM_setValue(feature.key, newState);

        alert(`${feature.name} ${newState ? '✅ Включен (а)' : '❌ Выключен (а)'}\n\nОписание: ${feature.description}`);

        registerAllMenus(); // Перерегистрировать меню после переключения
    }

    // При старте скрипта
    registerAllMenus();



    const url = window.location.href;

    // === 1. HDrezka: Добавляем кнопку на страницу фильма ===
    if (/^https?:\/\/.*rezk.*\/.*$/.test(url)) {
        // CSS-код
        GM.addStyle(`
         .b-sidecover {
         margin-bottom: 6px;
         }
        `);

        // Сохраняем постер и описание в хранилище Tampermonkey
        const posterEl = document.querySelector('.b-sidecover img');
        const descEl = document.querySelector('.b-post__description_text');
        const yearLink = document.querySelector('.b-post__info a[href*="/year/"]');

        let filmTitle = '';
        const titleEl = document.querySelector('.b-post__title');
        if (titleEl) {
            filmTitle = titleEl.textContent.trim().replace(/\//g, ''); // Убираем все слэши из названия
            console.log('Название фильма (без слэшей):', filmTitle);
        } else {
            console.log('Элемент .b-post__title не найден.');
        }

        let originalTitleText = '';
        const originalTitleEl = document.querySelector('.b-post__origtitle');
        if (originalTitleEl) {
            originalTitleText = originalTitleEl.textContent.trim().replace(/\//g, ''); // Убираем все слэши из названия
            console.log('Оригинальное название фильма (без слэшей):', originalTitleText);
        } else {
            console.log('Элемент .b-post__origtitle не найден.');
        }

        let yearEl = '';
        if (yearLink) {
            yearEl = yearLink.textContent.trim().replace('года', '').trim();
        }
        const raitingEl = document.querySelector('[id^="rating-layer-num-"]');

        const posterHD = posterEl?.src;
        const descriptionHD = descEl?.innerText;
        const titleHD = filmTitle;
        const originalTitleHD = originalTitleText;
        const yearHD = yearEl || '';
        const raitingHD = raitingEl?.innerText?.trim() || '';
        console.log('Рейтинг:', raitingHD);
        const currentUrlHD = window.location.href;

        if (posterHD && descriptionHD) {
            GM_setValue('flicksbar_posterHD', posterHD); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_descriptionHD', descriptionHD); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_titleHD', titleHD); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_originalTitleHD', originalTitleHD); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_yearHD', yearHD); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_raitingHD', raitingHD); // Сохраняем в хранилище Tampermonkey
            GM_setValue('flicksbar_currentUrlHD', currentUrlHD);
            console.log('✅ Постер и описание сохранены в Tampermonkey storage');
        } else {
            console.warn('⚠️ Не удалось найти постер или описание');
        }


        const currentUrl = window.location.href;
        // Проверяем, содержится ли в текущем URL подстрока '/person/'
        if (currentUrl.includes('/person/')) {
            console.log('Скрипт не выполняется на этой странице:', currentUrl);
            return; // Прекращаем выполнение скрипта
        }

        function getFilmDetails() {
            const titleElement = document.querySelector('.b-post__title');
            const originalTitleElement = document.querySelector('.b-post__origtitle');
            const yearLink = document.querySelector('.b-post__info a[href*="/year/"]');
            const typeLink = document.querySelector('.b-post__info a[href*="/series/"]');

            const title = titleElement ? titleElement.textContent.trim() : '';
            const originalTitle = originalTitleElement ? originalTitleElement.textContent.trim() : '';
            let year = '';
            if (yearLink) {
                year = yearLink.textContent.trim().replace('года', '').trim();
            }

            const isSeries = typeLink !== null;
            return { title, originalTitle, year, isSeries };
        }

        function createButton() {
            const button = document.createElement('button');
            button.textContent = 'Смотреть на Flicksbar';
            button.style.padding = '9px';
            button.style.marginTop = '5px';
            button.style.marginBottom = '2px';
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.width = '100%';
            button.style.cursor = 'pointer';
            button.style.transition = 'background-color 0.3s ease';

            // Наведение: делаем цвет темнее
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#0056b3'; // темно-синий
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#007bff'; // обратно как было
            });

            const { title, originalTitle, year } = getFilmDetails();
            button.title = `Поиск: ${title} ${originalTitle} ${year}`;

            button.onclick = () => {
                const { title, originalTitle, year, isSeries } = getFilmDetails();
                if (!title) {
                    alert('Не удалось извлечь информацию о фильме.');
                    return;
                }

                const searchQuery = encodeURIComponent(
                    `${title} ${originalTitle} ${year} кинопоиск резка`
                );
                const flicksbarType = isSeries ? 'series' : 'film';
                const googleUrl = GM_getValue('func3Search', true)
                ? `https://www.google.kz/search?q=${searchQuery}&btnK&flcks_type=${flicksbarType}`
                : `https://duckduckgo.com/?q=${searchQuery}&btnK&flcks_type=${flicksbarType}`;
                window.open(googleUrl, '_blank');
            };

            const sideCover = document.querySelector('.b-sidecover');
            if (sideCover) {
                sideCover.appendChild(button);
            }
        }

        // Запуск как можно раньше, но только после готовности DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createButton);
        } else {
            createButton();
        }
    }

    // === 2. GOOGLE/DuckDuckGo: Автопереход на Flicksbar по найденному ID Кинопоиска ===
    if (/google\.kz\/search/.test(url) || /duckduckgo\.com\//.test(url)) {
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
                //const kpLink = document.querySelector('a[href*="kinopoisk.ru/film/"]');
                const kpLink = document.querySelector('a[href*="kinopoisk.ru/film/"], a[href*="kinopoisk.ru/series/"]');
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
            const currentUrlSearch = decodeURIComponent(window.location.href.toLowerCase());
            const Rezka = currentUrlSearch.includes('резка');

            const preferGoogle = GM_getValue('func3Search', true);

            // ✅ Разрешаем редирект, если:
            // - включён Google и есть параметр flcks_type
            // - включён DuckDuckGo и есть параметр flcks_type
            const allowRedirect =
                  (preferGoogle && type && Rezka) || (!preferGoogle && type && Rezka);
            console.log ('urlParams: ', urlParams)
            console.log ('type: ', type)
            console.log ('preferGoogle: ', preferGoogle)
            console.log ('Rezka: ', Rezka)

            if (!allowRedirect) {
                console.log('Редирект не выполняется: источник не соответствует настройке function3Enabled');
                return;
            }

            //const match = kpLink.href.match(/kinopoisk\.ru\/film\/(\d+)/);
            const match = kpLink.href.match(/kinopoisk\.ru\/(?:film|series)\/(\d+)/);
            if (!match) return;

            const kpId = match[1];
            const flicksbarUrl = `https://flcksbr.top/${type}/${kpId}/`;

            if (GM_getValue('func2Redirect', true)) {
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
if (/flcksbr\.top\/(film|series)\/\d+\/?$/.test(location.href)) {

    // Функция для отображения постера и описания в блоке справа
    function displayMovieInfo(posterHD, descriptionHD, titleHD, originalTitleHD, yearHD, raitingHD) {
        const infoBoxHD = document.getElementById("kinorium-info-hd");
        if (infoBoxHD && posterHD && descriptionHD && titleHD && originalTitleHD && yearHD && raitingHD) {
            infoBoxHD.innerHTML = `
            <p style="font-size:25px;">${titleHD} ${originalTitleHD} ${yearHD} ${raitingHD}</p><br><img src="${posterHD}" alt="Постер" style="width:100%;border-radius:10px;margin-bottom:10px;display:flex;justify-content:center;align-items:center; ">
            <p style="color:white;font-size:16px;line-height:1.4;">${descriptionHD}</p>
        `;
        }
    }

    function clearFlicksbarInfo() {
        console.log('✅ Очистка данных...');
        GM_deleteValue('flicksbar_posterHD');
        GM_deleteValue('flicksbar_descriptionHD');
        GM_deleteValue('flicksbar_titleHD');
        GM_deleteValue('flicksbar_originalTitleHD');
        GM_deleteValue('flicksbar_yearHD');
        GM_deleteValue('flicksbar_raitingHD');
        GM_deleteValue('flicksbar_currentUrlHD');
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

    async function hasAnyHDData() {
        const values = await Promise.all([
            GM_getValue('flicksbar_posterHD', null),
            GM_getValue('flicksbar_descriptionHD', null),
            GM_getValue('flicksbar_titleHD', null),
            GM_getValue('flicksbar_originalTitleHD', null),
            GM_getValue('flicksbar_yearHD', null),
            GM_getValue('flicksbar_raitingHD', null),
            GM_getValue('flicksbar_currentUrlHD', null)
        ]);

        return values.some(val => val && val.toString().trim() !== "");
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
        infoWrapper.id = "kinorium-info-hd";
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
        const posterHD = GM_getValue('flicksbar_posterHD', null);
        const descriptionHD = GM_getValue('flicksbar_descriptionHD', null);
        const titleHD = GM_getValue('flicksbar_titleHD', null);
        const originalTitleHD = GM_getValue('flicksbar_originalTitleHD', null);
        const yearHD = GM_getValue('flicksbar_yearHD', null);
        const raitingHD = GM_getValue('flicksbar_raitingHD', null);
        const currentUrlHD = GM_getValue('flicksbar_currentUrlHD', null);

        const infoContainerHD = document.querySelector("#kinorium-info-hd");
        if (!infoContainerHD) {
            console.log('#kinorium-info-hd element not found on the page.');
            return;
        }

        infoContainerHD.innerHTML = "";

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
        if (titleHD || originalTitleHD || yearHD) {
            const titleElement = document.createElement("div");
            titleElement.innerHTML = `
                 <div style="text-align: center; margin-bottom: 5px;">
                      <div style="font-size: 22px; font-weight: bold;">${titleHD || ""}</div>
                      ${(originalTitleHD || yearHD) ? `
                      <div style="font-size: 18px; margin-top: 2px;">
                           <span style="color: #aaa;">${originalTitleHD || ""}</span>
                           ${yearHD ? `<span style="color: #fff;"> (${yearHD})</span>` : ""}
                      </div>
                      ` : ""}
                 </div>
            `;

            infoContainerHD.appendChild(titleElement);
        }

        // Рейтинг
        if (raitingHD) {
            let ratingColor = "#aaa";
            const ratingNum = parseFloat(raitingHD);
            if (ratingNum < 5) ratingColor = "red";
            else if (ratingNum < 7) ratingColor = "orange";
            else ratingColor = "lightgreen";

            const ratingElement = document.createElement("p");
            ratingElement.textContent = `Рейтинг (HDRezka): ${raitingHD}`;
            ratingElement.style.cssText = `
            font-size: 18px;
            color: ${ratingColor};
            text-align: center;
            margin: 0 0 5px;
        `;
            infoContainerHD.appendChild(ratingElement);
        }

        // Постер
        if (posterHD) {
            const posterElement = document.createElement("img");
            posterElement.src = posterHD;
            posterElement.alt = "Постер фильма";
            posterElement.style.maxWidth = "100%";
            posterElement.style.borderRadius = "12px";
            posterElement.style.display = "block";
            posterElement.style.margin = "0 auto 10px";
            posterElement.className = "fade-in-scale"; // применяем нашу анимацию через класс
            infoContainerHD.appendChild(posterElement);

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
                window.open(currentUrlHD, '_blank');
            });
        }

        // Описание
        if (descriptionHD) {
            const descriptionWrapper = document.createElement("div");
            descriptionWrapper.style.overflowY = "auto";
            descriptionWrapper.style.maxHeight = "300px";
            descriptionWrapper.style.paddingRight = "8px";

            const descPara = document.createElement("p");
            descPara.innerText = descriptionHD;
            descPara.style.fontSize = "16px";
            descPara.style.lineHeight = "1.5";
            descPara.style.textAlign = "justify";
            descPara.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";
            descPara.style.borderRadius = "10px";
            descPara.style.padding = "5px";
            descPara.style.background = "#1c1c1c";
            descPara.className = "fade-in-scale"; // применяем нашу анимацию через класс

            descriptionWrapper.appendChild(descPara);
            infoContainerHD.appendChild(descriptionWrapper);

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
            //restructurePage();
            hasAnyHDData().then(hasData => {
                if (hasData) {
                    restructurePage(); // Только если есть что показывать
                    loadAndDisplayInfo();
                } else {
                    console.log('[restructurePage] Данных нет — контейнер не создаётся.');
                }
            });            
        });
    } else {
        removeAds();
        //restructurePage();
        hasAnyHDData().then(hasData => {
            if (hasData) {
                restructurePage(); // Только если есть что показывать
                loadAndDisplayInfo();
            } else {
                console.log('[restructurePage] Данных нет — контейнер не создаётся.');
            }
        });        
    }

    // Очистка данных при закрытии страницы или переходе на другой сайт
    window.addEventListener("unload", () => {
        if (GM_getValue('func1Clear', true)) {
        console.log("✅ Очистка хранилища...");
        clearFlicksbarInfo(); // Очистка данных
        } else {
           console.log("✅ Очистка хранилища отключена...");
        }

    });

}

})();
