// ==UserScript==
// @name        MT_Player_Stats_Widget
// @namespace 	http://tampermonkey.net/
// @version 	2.5
// @description Скрипт добавляет виджет для отображения статистики игрока на форуме игры "Мир танков"
// @author 		Qwen2.5-Max, Nikolay (Next) Bespalov, and many thanks to @luxero for the information provided ;)
// @match 		http://forum.tanki.su/index.php?/topic/*
// @grant 		GM_xmlhttpRequest
// @grant 		GM_setValue
// @grant 		GM_getValue
// @grant 		GM_listValues
// @grant 		GM_deleteValue
// @connect 	tanki.su
// @connect 	lesta.ru
// @license 	MIT
// @icon64 		data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/528534/MT_Player_Stats_Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/528534/MT_Player_Stats_Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Предварительная загрузка шрифта
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://next-ru.github.io/player_widget/MTSans-RegularCondensed.ttf';
    document.head.appendChild(fontLink);

    // Предварительная загрузка фонового изображения
    const bgImage = new Image();
    bgImage.src = 'https://next-ru.github.io/player_widget/bg-content.png';

    // Время жизни кэша (5 минут)
    const CACHE_TTL = 5 * 60 * 1000;

    // Функция для очистки устаревшего кэша
    function clearOldCache() {
        const now = Date.now();
        const keys = GM_listValues().filter(key => key.startsWith('playerCache_'));
        keys.forEach(key => {
            const cacheData = GM_getValue(key);
            if(now - cacheData.timestamp > CACHE_TTL) {
                GM_deleteValue(key);
            }
        });
    }

    // Вызов функции очистки кэша при запуске скрипта
    clearOldCache();

    // Добавление пользовательского шрифта и стилей
    const style = document.createElement('style');
    style.innerHTML = ` @font-face {
            font-family: 'MTSans RegularCondensed';
            src: url(${fontLink.href}) format('truetype');
            font-weight: 400;
            font-style: normal;
    }
    .regular-condensed {
            font-family: 'MTSans RegularCondensed', sans-serif;
            font-weight: 400;
            font-style: normal;
    }
    .widget-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
    }
    .widget-top,
    .widget-bottom {
            display: flex;
            gap: 8px;
            align-items: flex-start;
    }
    .widget-block.player {
            width: 250px;
    }
    .widget-block.clan {
            min-width: 250px;
            max-width: 300px;
            flex-grow: 1;
    }
    .value {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
    }
    .clan-emblem {
            display: flex;
            justify-content: flex-end;
    }
    .clan-emblem img {
            width: 64px;
            height: 64px;
    }
    `;
    document.head.appendChild(style);

    // Создание элемента для виджета
    let widget = document.createElement('div');
    widget.id = 'player-widget'; // Уникальный ID для виджета
    widget.style.position = 'absolute'; // Позиционирование будет обновляться динамически
    widget.style.backgroundImage = `url(${bgImage.src})`; // Устанавливаем фоновое изображение
    widget.style.backgroundColor = '#000'; // Задаем запасной цвет фона (черный)
    widget.style.color = '#fff'; // Задаем цвет текста (белый)
    widget.style.padding = '8px'; // Добавляем внутренние отступы для лучшей читаемости
    widget.style.borderRadius = '8px'; // Добавляем скругление углов
    widget.style.fontSize = '16px'; // Устанавливаем размер шрифта для текста
    widget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Добавляем тень для объемного эффекта
    widget.style.whiteSpace = 'nowrap'; // Запрещаем перенос текста на новую строку
    widget.style.display = 'none'; // Скрываем виджет при создании
    widget.classList.add('regular-condensed'); // Добавляем CSS-класс для дополнительных стилей
    document.body.appendChild(widget);

    // Функция для обновления позиции виджета
    function updateWidgetPosition(widget, target) {
        const offsetX = 0; // Отступ по горизонтали (в пикселях)
        const offsetY = 15; // Отступ по вертикали (в пикселях)

        const targetRect = target.getBoundingClientRect(); // Получаем координаты целевого элемента
        const widgetRect = widget.getBoundingClientRect(); // Получаем размеры виджета

        let leftPosition = targetRect.right + window.scrollX + offsetX; // Виджет справа от элемента с отступом
        let topPosition;

        // Определяем, где находится целевой элемент: в верхней или нижней части экрана
        const isTargetInUpperHalf = targetRect.top < (window.innerHeight / 2);

        if (isTargetInUpperHalf) {
            // Если целевой элемент в верхней половине экрана, виджет рисуем снизу
            topPosition = targetRect.bottom + window.scrollY + offsetY;
        } else {
            // Если целевой элемент в нижней половине экрана, виджет рисуем сверху
            topPosition = targetRect.top - widgetRect.height + window.scrollY - offsetY;
        }

        // Проверяем, выходит ли виджет за пределы экрана
        if (topPosition < 0) {
            // Если виджет выходит за верхний край, перемещаем его вниз
            topPosition = targetRect.bottom + window.scrollY + offsetY;
        } else if (topPosition + widgetRect.height > window.innerHeight + window.scrollY) {
            // Если виджет выходит за нижний край, перемещаем его вверх
            topPosition = targetRect.top - widgetRect.height + window.scrollY - offsetY;
        }

        // Применяем стили
        Object.assign(widget.style, {
            top: `${topPosition}px`,
            left: `${leftPosition}px`
    });
    }

    // Функция для форматирования времени из Unix-формата
    function formatUnixTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    // Функция для обновления содержимого виджета
    function updateWidgetContent(nickname, spaId, regTimestamp, lastBattleAt, summaryData, statisticsData, clanId, clanInfo, playerClanInfo) {
        // Верхняя секция: информация об игроке
        const playerTopInfo = `
        <div class="value">Никнейм: ${nickname}&nbsp;<a href="https://tanki.su/ru/community/accounts/${spaId}-${nickname}/" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGPC/xhBQAAAG5JREFUGBmFjlEKwCAMQ2fZYfwbG+z+JxD8UPE2XStm64ay/iR9SaFumUytlW3kBEQBG6D33sGr3gdqcs67DeFRaooFIdTyadGWcPj80MmwpNk0+BxS33+lFUspx6iZUjrBVzGRiIK8APZSZg4KLkdURXcsOD5MAAAAAElFTkSuQmCC" alt="Профиль игрока" style="vertical-align: middle;"></a></div>
        <div class="value">Дата регистрации: ${regTimestamp ? formatUnixTime(regTimestamp) : 'Неизвестно'}</div>
        <div class="value">Последний бой: ${lastBattleAt ? formatUnixTime(lastBattleAt) : 'Неизвестно'}</div>
        `;

        // Верхняя секция: эмблема клана (если есть)
        const clanTopInfo = clanInfo ? `
        <img src="https://lesta.ru${clanInfo.large_emblem_url}?nocache=${Date.now()}" alt="Эмблема клана">
        ` : '';

        // Нижняя секция: статистика игрока
        const playerBottomInfo = `
        <div class="value">Личный рейтинг: ${summaryData?.global_rating ?? 'Неизвестно'}</div>
        <div class="value">Бои: ${statisticsData?.battles_count ?? 'Неизвестно'}</div>
        <div class="value">Победы: ${statisticsData?.wins_count_percent != null ? `${statisticsData.wins_count_percent}%` : 'Неизвестно'}</div>
        <div class="value">Средний урон: ${statisticsData?.damage_dealt_avg ?? 'Неизвестно'}</div>
        <div class="value">Попадания: ${summaryData?.hits_ratio != null ? `${summaryData.hits_ratio}%` : 'Неизвестно'}</div>
        <div class="value">Средний опыт за бой: ${statisticsData?.xp_amount_avg ?? 'Неизвестно'}</div>
        <div class="value">Максимум уничтожено за бой: ${statisticsData?.frags_max ?? 'Неизвестно'}</div>
        <div class="value">Максимальный опыт за бой: ${statisticsData?.xp_max ?? 'Неизвестно'}</div>
        <div class="value">Максимальный урон за бой: ${statisticsData?.damage_max ?? 'Неизвестно'}</div>
        <div class="value">Знаки классности «Мастер»: ${summaryData?.mastery ? `${summaryData.mastery.mastery_count}/${summaryData.mastery.vehicles_count}` : 'Неизвестно'}</div>
        `;

        // Нижняя секция: статистика клана (если есть)
        const clanBottomInfo = clanInfo ? `
        <div class="value">Клан-тег: [${clanInfo.tag ?? 'Неизвестно'}]</div>
        <div class="value">Название: ${clanInfo.name ?? 'Неизвестно'}</div>
        <div class="value">Должность: ${playerClanInfo?.localized_name ?? 'Неизвестно'}</div>
        <div class="value">Дней в клане: ${playerClanInfo?.days_in_clan ?? 'Неизвестно'}</div>
        <div class="value">Рейтинг клана: ${clanInfo.rating ?? '-'}</div>
        <div class="value">Позиция клана в общем рейтинге: ${clanInfo.rating_position ?? '-'}</div>
        <div class="value">Активные игроки: ${clanInfo.members_count ?? 'Неизвестно'}</div>
        <div class="value">Среднее количество боёв: ${clanInfo.average_battles_count ?? 'Неизвестно'}</div>
        <div class="value">Средний опыт за бой: ${clanInfo.average_xp_per_battle ?? 'Неизвестно'}</div>
        <div class="value">Средний урон за бой: ${clanInfo.average_damage_per_battle ?? 'Неизвестно'}</div>
        <div class="value">Средний процент побед: ${clanInfo?.average_win_rate != null ? `${clanInfo.average_win_rate}%` : 'Неизвестно'}</div>
        ` : '';

        // Вставляем всё в виджет
        widget.innerHTML = `
        <div class="widget-container">
                <!-- Верхняя часть -->
                <div class="widget-top">
                        <div class="widget-block player">${playerTopInfo}</div>
                        ${clanTopInfo ? `<div class="widget-block clan clan-emblem">${clanTopInfo}</div>` : ''}
                </div>
                <!-- Нижняя часть -->
                <div class="widget-bottom">
                        <div class="widget-block player">${playerBottomInfo}</div>
                        ${clanBottomInfo ? `<div class="widget-block clan">${clanBottomInfo}</div>` : ''}
                </div>
        </div>
        `;
    }

    // Функция для получения данных из кэша
    function getCache(key) {
        const cacheData = GM_getValue(`playerCache_${key}`);
        if(cacheData && Date.now() - cacheData.timestamp < CACHE_TTL) {
            return cacheData.data;
        }
        return null;
    }

    // Функция для сохранения данных в кэш
    function setCache(key, value) {
        GM_setValue(`playerCache_${key}`, {
            timestamp: Date.now(),
            data: value
        });
    }

    // Функция для отображения небольшого текстового сообщения в виджете
    function showWidgetMessage(text) {
        widget.innerHTML = text; // Устанавливаем текст сообщения
        widget.style.display = 'block'; // Делаем виджет видимым
        widget.style.minWidth = '200px'; // Минимальная ширина
        widget.style.minHeight = '50px'; // Минимальная высота
        widget.style.display = 'flex'; // Используем flexbox для центрирования
        widget.style.justifyContent = 'center'; // Центрируем по горизонтали
        widget.style.alignItems = 'center'; // Центрируем по вертикали
    }

    // Функция для получения данных об игроке
    async function fetchData(spaId, nickname) {
        const cacheKey = `${spaId}_${nickname}`;
        const cachedData = getCache(cacheKey);
        if(cachedData) {
            updateWidgetContent(
                nickname,
                spaId,
                cachedData.regTimestamp,
                cachedData.lastBattleAt,
                cachedData.summaryData,
                cachedData.statisticsData,
                cachedData.clanId,
                cachedData.clanInfo,
                cachedData.playerClanInfo
            );
            return;
        }

        let regTimestamp = null;
        let lastBattleAt = null;
        let clanId = null;
        let summaryData = null;
        let statisticsData = null;
        let clanInfo = null;
        let playerClanInfo = null;

        // Параллельные запросы: profileResponse, summaryData и statisticsData
        const [profileResponse, summaryPromise, statisticsPromise] = await Promise.all([
            // Запрос данных профиля игрока
            (async () => {
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://tanki.su/ru/community/accounts/${spaId}-${nickname}/`,
                            headers: {
                                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                "accept-language": "ru-RU,ru;q=0.9",
                                "priority": "u=0, i",
                                "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "document",
                                "sec-fetch-mode": "navigate",
                                "sec-fetch-site": "same-origin",
                                "sec-fetch-user": "?1",
                                "upgrade-insecure-requests": "1"
                            },
                            referrer: "https://tanki.su/ru/community/accounts/",
                            referrerPolicy: "unsafe-url",
                            onload: resolve,
                            onerror: reject
                        });
                    });

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    const scripts = doc.querySelectorAll('script');
                    for(const script of scripts) {
                        const scriptContent = script.textContent;
                        if(scriptContent.includes("USER_DATA")) {
                            const regTimestampMatch = scriptContent.match(/"reg_timestamp":\s*(\d+)/);
                            const lastBattleAtMatch = scriptContent.match(/"last_battle_at":\s*(\d+)/);
                            const clanIdMatch = scriptContent.match(/"id":\s*(\d+)/);

                            if(regTimestampMatch) regTimestamp = parseInt(regTimestampMatch[1], 10);
                            if(lastBattleAtMatch) lastBattleAt = parseInt(lastBattleAtMatch[1], 10);
                            if(clanIdMatch) clanId = parseInt(clanIdMatch[1], 10);
                            break;
                        }
                    }
                } catch {}
            })(),

            // Запрос данных о суммарной статистике игрока
            (async () => {
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://tanki.su/wotup/profile/summary/?spa_id=${spaId}&battle_type=random`,
                            headers: {
                                "accept": "*/*",
                                "accept-language": "ru-RU,ru;q=0.9",
                                "priority": "u=1, i",
                                "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-requested-with": "XMLHttpRequest"
                            },
                            referrer: `https://tanki.su/ru/community/accounts/${spaId}-${nickname}/`,
                            referrerPolicy: "unsafe-url",
                            onload: resolve,
                            onerror: reject
                        });
                    });

                    const rawSummaryData = JSON.parse(response.responseText)?.data ?? null;
                    if(rawSummaryData) {
                        summaryData = {
                            global_rating: rawSummaryData.global_rating,
                            hits_ratio: rawSummaryData.hits_ratio,
                            mastery: rawSummaryData.mastery
                        };
                    }
                } catch {}
            })(),

            // Запрос данных о статистике игрока
            (async () => {
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://tanki.su/wotup/profile/statistics/?spa_id=${spaId}&battle_type=random`,
                            headers: {
                                "accept": "*/*",
                                "accept-language": "ru-RU,ru;q=0.9",
                                "priority": "u=1, i",
                                "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-requested-with": "XMLHttpRequest"
                            },
                            referrer: `https://tanki.su/ru/community/accounts/${spaId}-${nickname}/`,
                            referrerPolicy: "unsafe-url",
                            onload: resolve,
                            onerror: reject
                        });
                    });

                    const rawStatisticsData = JSON.parse(response.responseText)?.data ?? null;
                    if(rawStatisticsData) {
                        statisticsData = {
                            damage_max: rawStatisticsData.damage_max,
                            wins_count_percent: rawStatisticsData.wins_count_percent,
                            battles_count: rawStatisticsData.battles_count,
                            damage_dealt_avg: rawStatisticsData.damage_dealt_avg,
                            xp_amount_avg: rawStatisticsData.xp_amount_avg,
                            frags_max: rawStatisticsData.frags_max,
                            xp_max: rawStatisticsData.xp_max
                        };
                    }
                } catch {}
            })()
        ]);

        // Если игрок в клане, запрашиваем информацию о клане
        if(clanId) {
            const [clanPromise, playersPromise] = await Promise.all([
                // Запрос информации о клане
                (async () => {
                    try {
                        const response = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: `https://lesta.ru/clans/wot/${clanId}/api/claninfo/`,
                                headers: {
                                    "accept": "application/json, text/javascript, */*; q=0.01",
                                    "accept-language": "ru-RU,ru;q=0.9",
                                    "priority": "u=1, i",
                                    "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-requested-with": "XMLHttpRequest"
                                },
                                referrer: `https://lesta.ru/clans/wot/${clanId}/`,
                                referrerPolicy: "strict-origin-when-cross-origin",
                                onload: resolve,
                                onerror: reject
                            });
                        });

                        const clanData = JSON.parse(response.responseText)?.clanview ?? null;
                        if(clanData) {
                            clanInfo = {
                                tag: clanData.clan.tag,
                                name: clanData.clan.name,
                                rating: clanData.rating.rating,
                                average_battles_count: clanData.rating.average_battles_count,
                                rating_position: clanData.rating.rating_position,
                                average_xp_per_battle: clanData.rating.average_xp_per_battle,
                                average_damage_per_battle: clanData.rating.average_damage_per_battle,
                                average_win_rate: clanData.rating.average_win_rate,
                                members_count: clanData.clan.members_count,
                                large_emblem_url: clanData.clan.large_emblem_url
                            };
                        }
                    } catch {}
                })(),

                // Запрос информации о игроке в клане
                (async () => {
                    try {
                        const response = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: `https://lesta.ru/clans/wot/${clanId}/api/players/?offset=0&limit=25&o=-role&timeframe=all&battle_type=default`,
                                headers: {
                                    "accept": "application/json, text/javascript, */*; q=0.01",
                                    "accept-language": "ru-RU,ru;q=0.9",
                                    "priority": "u=1, i",
                                    "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-requested-with": "XMLHttpRequest"
                                },
                                referrer: `https://lesta.ru/clans/wot/${clanId}/players/`,
                                referrerPolicy: "strict-origin-when-cross-origin",
                                onload: resolve,
                                onerror: reject
                            });
                        });

                        const playersData = JSON.parse(response.responseText)?.items ?? null;
                        const player = playersData.find(p => p.id === parseInt(spaId, 10));
                        if(player) {
                            playerClanInfo = {
                                localized_name: player.role.localized_name,
                                days_in_clan: player.days_in_clan
                            };
                        }
                    } catch {}
                })()
            ]);
        }

        // Сохранение данных в кэш
        const playerData = {
            regTimestamp,
            lastBattleAt,
            summaryData,
            statisticsData,
            clanId,
            clanInfo,
            playerClanInfo
        };

        setCache(cacheKey, playerData);

        // Обновление содержимого виджета
        updateWidgetContent(
            nickname,
            spaId,
            playerData.regTimestamp,
            playerData.lastBattleAt,
            playerData.summaryData,
            playerData.statisticsData,
            playerData.clanId,
            playerData.clanInfo,
            playerData.playerClanInfo
        );
    }

    let widgetTimeout = null; // Переменная для хранения таймера
    const WIDGET_TIMEOUT_DELAY = 200; // Задержка перед исчезновением виджета (в миллисекундах)

    // Обработчик наведения мыши на элемент или виджет
    function handleHover(event) {
        const target = event.target;

        // Проверяем, находится ли курсор на элементе
        if (
            target.tagName === 'SPAN' &&
            target.parentElement &&
            target.parentElement.classList.contains('ccw-word')
        ) {
            const parentSpan = target.parentElement;
            const nickname = parentSpan.getAttribute('data-value');
            const authorInfo = parentSpan.closest('.author_info');
            if (authorInfo) {
                const parentAnchor = authorInfo.querySelector('a[hovercard-spaid]');
                if (parentAnchor) {
                    const spaId = parentAnchor.getAttribute('hovercard-spaid');

                    // Отменяем предыдущий таймер, если он был запущен
                    if (widgetTimeout) {
                        clearTimeout(widgetTimeout);
                        widgetTimeout = null;
                    }

                    // Показываем индикатор загрузки
                    showWidgetMessage('Загрузка...');
                    updateWidgetPosition(widget, target);

                    // Загружаем данные и обновляем позицию виджета
                    fetchData(spaId, nickname).then(() => {
                        updateWidgetPosition(widget, target);
                    });
                } else {
                    // Добавляем обработку случая, когда элемент hovercard-spaid не найден
                    showWidgetMessage('SPA ID не найден. Аккаунт удалён.');
                    updateWidgetPosition(widget, target);
                }
            }
        }

        // Если курсор находится на самом виджете, отменяем таймер
        if (target === widget || widget.contains(target)) {
            if (widgetTimeout) {
                clearTimeout(widgetTimeout);
                widgetTimeout = null;
            }
        }
    }

    // Обработчик ухода курсора с элемента или виджета
    function handleMouseOut(event) {
        const target = event.target;

        // Если курсор ушел с элемента или с виджета
        if (
            (target.tagName === 'SPAN' &&
             target.parentElement.classList.contains('ccw-word')) ||
            target === widget ||
            widget.contains(target)
        ) {
            // Запускаем таймер для скрытия виджета
            widgetTimeout = setTimeout(() => {
                widget.innerHTML = ''; // Очищаем содержимое виджета
                widget.style.display = 'none'; // Скрываем виджет
                widgetTimeout = null; // Сбрасываем таймер
            }, WIDGET_TIMEOUT_DELAY);
        }
    }

    document.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseout', handleMouseOut);
})();