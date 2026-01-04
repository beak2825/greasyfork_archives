// ==UserScript==
// @name         old.myshows.me
// @namespace    http://tampermonkey.net/
// @version      2025-v35
// @description  С 1 мая 2024 года обещали отключить old.myshows.me. Под ручку с нейросетями попытался починить нужные мне места.
// @             Желательно использовать вместе с внешним видом от другого энтузиаста: https://userstyles.world/style/15722/old-myshows-me (инструкцию ищите там же)
// @author       SanBest93
// @match        https://*.myshows.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myshows.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492441/oldmyshowsme.user.js
// @updateURL https://update.greasyfork.org/scripts/492441/oldmyshowsme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
      * Класс для управления настройками скрипта с сохранением в `localStorage`.
      */
    class Settings {
        /** Добавлены настройки на страницу, собсно, «Настройки» (myshows.me/profile/edit/)
          * Сохраняются в локальное хранение `localStorage`. Удаляются при очистке кэша.
          * Вписывайте ниже значение `value` жёстко, если это критично
          */


        /**
          * Инициализирует настройки с значениями из `localStorage`.
          */
        constructor() {
            /**
              * Объект с настройками скрипта, где ключ — идентификатор настройки, а значение — объект с её параметрами.
              * @type {Object.<string, {value: boolean|string|null, labelText: string, applied: boolean, textContent: string, tooltipText: string}>}
              */
            this.v = {
                ModifyShowTitleLink: { // Ссылка только в русском названии шоу на странице `myshows.me/profile/`
                    value: getItem('ModifyShowTitleLink') ?? false,
                    labelText: '«Мои сериалы»: оставить ссылку только в русском названии',
                    applied: false,
                    textContent: '',
                    tooltipText: ''
                },
                ModifyShowSeasonMeta: { // Замена "5 эпизодов с e1" на "5 эпизодов с e01" на странице `myshows.me/profile/`
                    value: getItem('ModifyShowSeasonMeta') ?? false,
                    labelText: '«Мои сериалы»: замена "N эпизодов с e1" на "N эпизодов с e01"',
                    applied: false,
                    textContent: '',
                    tooltipText: ''
                },
                ModifyProfileNumbers: { // Вывод полных чисел в шапке профиля
                    value: getItem('ModifyProfileNumbers') ?? false,
                    labelText: '«Профиль»: вывод полных чисел в шапке',
                    applied: false,
                    textContent: '',
                    tooltipText: ''
                },
                OriginalTitleIsNeeded: { // Всегда выводить оригинальные названия на странице `myshows.me/profile/next/`
                    value: getItem('OriginalTitleIsNeeded') ?? false,
                    labelText: '«Календарь»: всегда выводить оригинальные названия',
                    applied: false,
                    textContent: '',
                    tooltipText: `Перезагрузите страницу, если настройка не применилась.\nТакое бывает, если открыть /profile/next/ после /profile/edit/`
                },
                ModifyS01E01: { // Замена "1 x 1" на "s01e01" (и ещё по мелочи) на странице `myshows.me/profile/next/`
                    value: getItem('ModifyS01E01') ?? false,
                    labelText: '«Календарь»: замена "1 x 1" на "s01e01" (и ещё по мелочи)',
                    applied: false,
                    textContent: '',
                    tooltipText: ''
                },
                s01e01Postfix: { // Текст после s01e01 на странице `myshows.me/profile/next/`. Мне так удобнее на торрентах искать
                    value: getItem('s01e01Postfix') ?? false,
                    labelText: '«Календарь»: текст после s01e01',
                    applied: false,
                    textContent: getItem('s01e01PostfixValue'),
                    tooltipText: ''
                }
            };
            /**
              * Объект с дополнительными флагами состояния скрипта.
              * @type {Object.<string, boolean>}
              */
            this.o = {
                watchSoonElementsModified: false,
            };
        }

        /**
          * Устанавливает значение свойства настройки или флага выполнения.
          * @param {string} id — Идентификатор настройки или флага.
          * @param {any} value — Новое значение свойства.
          * @param {string} key — Ключ свойства (например, 'value' или 'applied').
          * @returns {void} — Функция не возвращает значений.
          */
        setProperty(id, value, key) {
            if (id in this.v) {
                this.v[id][key] = value;
            } else if (id in this.o) {
                this.o[id] = value;
            }
        }

        /**
          * Получает значение свойства настройки или флага выполнения.
          * @param {string} id — Идентификатор настройки или флага.
          * @param {string} key — Ключ свойства (например, 'value' или 'applied').
          * @returns {any} — Значение свойства или `undefined`, если идентификатор не найден.
          */
        getProperty(id, key) {
            if (id in this.v) {
                return this.v[id][key];
            } else if (id in this.o) {
                return this.o[id];
            }
        }

        /**
          * Устанавливает значение настройки.
          * @param {string} id — Идентификатор настройки.
          * @param {boolean|string|null} value — Новое значение настройки.
          * @returns {void} — Функция не возвращает значений.
          */
        setValue(id, value) {
            this.setProperty(id, value, 'value');
        }

        /**
          * Получает значение настройки.
          * @param {string} id — Идентификатор настройки.
          * @returns {boolean|string|null} — Значение настройки или `undefined`, если настройка не найдена.
          */
        getValue(id) {
            return this.getProperty(id, 'value');
        }

        /**
          * Устанавливает флаг применения настройки.
          * @param {string} id — Идентификатор настройки или флага.
          * @param {boolean} value — Новое значение флага.
          * @returns {void} — Функция не возвращает значений.
          */
        setApplied(id, value) {
            this.setProperty(id, value, 'applied');
        }

        /**
          * Получает флаг применения настройки.
          * @param {string} id - Идентификатор настройки или флага.
          * @returns {boolean|undefined} - Значение флага или `undefined`, если идентификатор не найден.
          */
        getApplied(id) {
            return this.getProperty(id, 'applied');
        }

        /**
          * Сбрасывает все флаги применения настроек и дополнительных состояний.
          * @returns {void} — Функция не возвращает значений.
          */
        resetAllFlags() {
            Object.keys(this.v).forEach(id => this.setApplied(id, false));
            Object.keys(this.o).forEach(id => this.setApplied(id, false));
        }

        /**
          * Возвращает данные для создания чекбокса на основе настройки.
          * @param {string} id — Идентификатор настройки.
          * @returns {{labelText: string, textContent: string, tooltipText: string}|null} - Данные для чекбокса или `null`, если настройка не найдена.
          */
        getCheckboxData(id) {
            return this.v[id] ? {
                labelText: this.v[id].labelText,
                textContent: this.v[id].textContent,
                tooltipText: this.v[id].tooltipText
            } : null;
        }
    }

    let nuxtMap = new Map(); // Сюда будем складывать соответствие showId — titleOriginal
    let STYLE;
    let lastUrl = location.href;
    let observers = new Map(); // Глобальный объект для хранения наблюдателей
    let pendingApiRequests = new Set();
    let apiRequestsInProgress = new Map(); // ID — Promise
    let lastRetryTime = 0;
    const userName = document.querySelector('div.HeaderLogin__username')?.textContent; // Запоминаем userName
    const rowHeight = '30px';
    const months = Array.from({ length: 12 }, (_, i) => { return new Intl.DateTimeFormat('ru', { month: 'long' }).format(new Date(2000, i)); }); // Создаем массив названий месяцев для русской локали
    const defaultTimeout = 200; // Таймаут по умолчанию
    const _Settings = new Settings(); // Создаём экземпляр настроек
    const RETRY_DELAY = 5000;

    /**
      * Класс для хранения данных о шоу и его эпизодах.
      * Используется для структурирования информации о сериалах на странице `/profile/next/`
      * перед сортировкой и генерацией новых элементов DOM.
      */
    class ShowData {
        /**
          * Создаёт экземпляр данных о шоу.
          * @param {number} index — Индекс группы (обычно соответствует дню в календаре).
          * @param {string} showTitle — Название шоу (русское или оригинальное, в зависимости от настроек).
          * @param {string} episodeInfo — Информация об эпизоде в формате, например, "s01e01".
          * @param {string} innerHTML — HTML-код для вставки в DOM, содержащий ссылки и форматированный текст.
          */
        constructor(index, showTitle, episodeInfo, innerHTML) {
            /**
              * Индекс группы, используется для сортировки по дням.
              * @type {number}
              */
            this.index = index;

            /**
              * Название шоу (может быть русским или оригинальным).
              * @type {string}
              */
            this.showTitle = showTitle;

            /**
              * Информация об эпизоде (например, "s01e01").
              * @type {string}
              */
            this.episodeInfo = episodeInfo;

            /**
              * HTML-код для отображения шоу и эпизода в DOM.
              * @type {string}
              */
            this.innerHTML = innerHTML;
        }
    }

    /**
      * Пытается разобрать неполный JSON, добавляя различные комбинации закрывающих скобок рекурсивно.
      * Ограничивает глубину рекурсии для предотвращения бесконечного цикла.
      * @param {string} jsonString — Неполная строка JSON для разбора.
      * @param {number} [maxDepth=10] — (необязательный) Максимальная глубина рекурсии (по умолчанию 10).
      * @param {string} [closingBrackets=''] — (необязательный) Текущая комбинация закрывающих скобок, добавляемая к строке (по умолчанию пустая строка).
      * @param {Array<string>} [possibleClosers=['"', ']', '}']] — (необязательный) Массив возможных закрывающих символов для попыток (по умолчанию ['"', ']', '}']).
      * @returns {Object|null} — Разобранный объект JSON или `null`, если разбор не удался.
      */
    function parseIncompleteJSON(jsonString, maxDepth = 10, closingBrackets = '', possibleClosers = ['"', ']', '}']) {
        // Base case: prevent infinite recursion
        if (maxDepth <= 0) {
            return null;
        }

        // Try to parse the current string with the current closing brackets
        try {
            const attemptedJSON = jsonString + closingBrackets;
            const parsedData = JSON.parse(attemptedJSON);
            console.log("[old.myshows.me] __NUXT_DATA__ успешно разобран с закрывающими скобками: ", closingBrackets || 'null');
            return parsedData;
        } catch (error) {
            // If parsing fails, try adding each possible closing bracket
            for (const closer of possibleClosers) {
                const result = parseIncompleteJSON(
                    jsonString,
                    maxDepth - 1,
                    closingBrackets + closer,
                    possibleClosers
                );

                if (result !== null) {
                    return result;
                }
            }

            // If all combinations fail at this level, return null
            return null;
        }
    }

    /**
      * Получает содержимое элемента `__NUXT_DATA__` и преобразует его в объект JavaScript.
      * @returns {Object|null} — Возвращает объект JavaScript, если парсинг успешен, или `null` в случае ошибки.
      */
    function parseScriptData() {
        const scriptElement = document.getElementById('__NUXT_DATA__');
        if (!scriptElement) return null;

        const parsedData = parseIncompleteJSON(scriptElement?.textContent);
        if (parsedData) {
            return parsedData;
        } else {
            console.error("[old.myshows.me] Не удалось разобрать JSON с любой комбинацией закрывающих скобок");
            return null;
        }
    }

    /**
      * Возвращает значение настройки из `localStorage` по id
      * (`localStorage` — место в браузере пользователя,
      * в котором сайты могут сохранять разные данные)
      * @param {string} id — Имя настройки (см. `_Settings`)
      * @returns {boolean|string} — Значение настройки. На текущий момент: булево, текст
      */
    function getItem(id) {
        const value = localStorage.getItem(id);
        return value === 'true' ? true : value === 'false' ? false : value;
    }

    /**
      * Возвращает id шоу из pathname элемента
      * @param {string} pathname — Значение pathname элемента
      * @returns {boolean|string} — Значение настройки. На текущий момент: булево, текст
      */
    function getShowIdFromPathname(pathname) {
        return pathname.split("/").slice(-2)[0];
    }

    /**
      * Возвращает номер месяца по русскому тексту
      * @param {string} monthName — Полное русское название месяца
      * @returns {number|null} — Номер месяца или null, если такой текст не найден
      */
    function getMonthNumber(monthName) {
        const index = months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());
        return index !== -1 ? index + 1 : null;
    }

    /**
      * Проверяет, изменился ли URL страницы, и сбрасывает флаги в `_Settings`, если изменение произошло.
      * Обновляет значение `lastUrl` текущим адресом.
      * @returns {void} — Функция не возвращает значений.
      */
    function checkUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl; // Запоминаем текущий адрес
            _Settings.resetAllFlags(); // Сбрасываем все флаги
        }
    }

    /**
      * Сравнивает две ссылки, игнорируя завершающие слэши.
      * @param {string} link1 - Первая ссылка для сравнения.
      * @param {string} link2 - Вторая ссылка для сравнения.
      * @returns {boolean} - `true`, если ссылки идентичны, иначе `false`.
      */
    function linksAreSimilar(link1, link2) {
        return link1.replace(/\/$/, '') === link2.replace(/\/$/, '');
    }

    /**
      * Ищет ключ в массиве объектов и возвращает значение первого найденного ключа.
      * Если ключ не найден, возвращает `undefined`.
      * @param {Array} data — Массив объектов, в котором производится поиск.
      * @param {string} key — Ключ, который нужно найти в объектах.
      * @param {number} [N=data.length] — (необязательный) Максимальное количество элементов для поиска (по умолчанию равно длине массива).
      * @returns {*} — Значение первого найденного ключа или `undefined`, если ключ не найден.
      */
    function findKeyInArray(data, key, N = data.length) {
        for (let i = 0; i < Math.min(N, data.length); i += 1) {
            // Проверяем, является ли элемент объектом и содержит ли указанный ключ
            if (typeof data[i] === 'object' && !!data[i] && key in data[i]) {
                // Если да, выводим значение ключа
                return data[i][key];
            }
        }
        return undefined; // Возвращаем undefined, если ключ не найден
    }

    /**
      * Ищет значение в данных `__NUXT_DATA__` по указанному пути.
      * Поддерживает поиск в массивах и объектах, включая структуры с `Reactive` и `ShallowReactive`.
      * Если путь не найден, возвращает `undefined`.
      * @param {Array|Object} data — Данные, в которых производится поиск.
      * @param {string} path — Путь к значению в формате 'key1.key2.key3'.
      * @returns {*} — Найденное значение или `undefined`, если путь не найден.
      */
    function findValueByPath(data, path) {
        // Разделяем путь на компоненты
        let keys = path.split('.');
        let index = 0;
        let currentData = data[index];

        // Проходимся по каждому компоненту пути
        for (let key of keys) {
            if (Array.isArray(currentData) && currentData.length > 0) {
                // Если текущие данные являются массивом, то
                // на 2024.06.18 структура такая, что вид ['Reactive', число];
                // 2025.03.11: ещё может начаться с ['ShallowReactive', число]
                let indexReactive = Math.min(
                    Math.max(currentData[0].indexOf('Reactive'), 0),
                    Math.max(currentData[0].indexOf('ShallowReactive'), 0)
                ) + 1; // Это число
                if (!isNaN(indexReactive) && indexReactive > 0 && indexReactive < currentData.length) {
                    index = currentData[indexReactive];
                    currentData = data[index];
                } else {
                    return undefined; // Если индекс некорректный или за пределами массива
                }
            }
            if (typeof currentData === 'object' && currentData !== null) {
                // Если текущие данные являются объектом
                if (key in currentData) {
                    index = currentData[key];
                    currentData = data[index];
                } else {
                    return undefined; // Если ключ не найден в текущем объекте
                }
            } else {
                return undefined; // Если текущие данные не являются ни объектом, ни массивом
            }
        }
        return currentData;
    }

    /**
      * Создаёт флажок (чекбокс) с меткой и добавляет его в указанный родительский элемент.
      * Поддерживает добавление текстового поля и значка с подсказкой.
      * Состояние флажка сохраняется в `localStorage`.
      * @param {HTMLElement} parent — Родительский элемент, в который будет добавлен флажок.
      * @param {string} id — Уникальный идентификатор флажка.
      * @param {string} labelText — Текст метки флажка.
      * @param {boolean} [textContent] — (необязательный) Если заполнено, добавляет текстовое поле рядом с флажком.
      * @param {string} [tooltipText] — (необязательный) Текст подсказки для значка вопроса.
      * @returns {HTMLElement} — Созданный элемент метки (label).
      */
    function createCheckbox(parent, id, labelText, textContent, tooltipText) {
        // Создаём элемент метки (label)
        const label = document.createElement('label');
        label.className = 'oldMyshowsSettings-label'; // Устанавливаем класс метки

        // Создаём элемент флажка (input)
        const checkbox = document.createElement('input');
        checkbox.className = 'oldMyshowsSettings-checkbox';
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = !!_Settings.getValue(id); // Значение было получено из `localStorage` при создании `_Settings`
        checkbox.addEventListener('change', function() { // Добавляем обработчик события изменения состояния флажка
            localStorage.setItem(id, this.checked); // Сохраняем состояние флажка в `localStorage`
            _Settings.setValue(id, this.checked); // Сохраняем состояние флажка в `_Settings`
        });
        label.appendChild(checkbox); // Добавляем флажок в метку

        // Создаём элемент span для текстового содержимого метки
        const span = document.createElement('span');
        span.innerText = labelText;
        label.appendChild(span); // Добавляем span в метку

        // Если требуется добавить дополнительное текстовое содержимое
        if (textContent === null || !!textContent) {
            const idValue = `${id}Value`; // Генерируем id для дополнительного текстового поля
            const checkboxTextContent = document.createElement('input');
            checkboxTextContent.className = 'oldMyshowsSettings-checkbox-textContent';
            checkboxTextContent.type = 'text';
            checkboxTextContent.id = idValue;
            checkboxTextContent.value = textContent ?? ''; // Значение было получено из `localStorage` при создании `_Settings`
            checkboxTextContent.addEventListener('change', function() { // Добавляем обработчик события изменения значения текстового поля
                localStorage.setItem(idValue, this.value); // Сохраняем значение текстового поля в `localStorage`
                _Settings.v[id].textContent = this.value; // Сохраняем состояние текстового поля в `_Settings`
            });
            label.appendChild(checkboxTextContent); // Добавляем текстовое поле в метку
        }

        // Добавляем значок вопроса с подсказкой
        if (!!tooltipText) {
            const tooltipIcon = document.createElement('span');
            tooltipIcon.className = 'tooltip-icon';
            tooltipIcon.textContent = '?';
            tooltipIcon.title = tooltipText;
            tooltipIcon.style.marginLeft = '5px';
            tooltipIcon.style.color = '#007bff';
            tooltipIcon.style.cursor = 'pointer';
            tooltipIcon.style.textDecoration = 'underline';

            label.appendChild(tooltipIcon);
        }

        parent.appendChild(label); // Добавляем метку в указанный родительский элемент

        return label; // Возвращаем созданную метку
    }

    /**
      * Создает группу настроек с флажками (checkboxes) на странице.
      * @returns {void} — Функция не возвращает значений.
      */
    function createCheckboxes() {
        const groupTitleTextContent = 'Настройки скрипта [old.myshows.me]';

        // Проверяем, существует ли уже наша группа.
        // Если уже существует, прекращаем выполнение функции
        if (document.querySelector('.oldMyshowsSettings')) return;

        const parentElement = document.querySelector('.mb-5'); // Элемент, в который мы хотим добавить новую группу
        const thelastChild = parentElement?.lastChild; // Его последний дочерний элемент
        if (!parentElement || !thelastChild) return;

        // Создаём группу
        let sectionAccordion = document.createElement('div');
        sectionAccordion.classList.add('SectionAccordion');

        // Создаём заголовок для группы
        let sectionAccordionTitle = document.createElement('div');
        sectionAccordionTitle.textContent = groupTitleTextContent;
        sectionAccordionTitle.classList.add('SectionAccordion-title');

        // Создаём контейнер для флажков
        let checkboxesContainer = document.createElement('div');
        checkboxesContainer.classList.add('oldMyshowsSettings');

        // Создаём контейнер для стиля
        let checkboxesStyle = document.createElement('div');
        checkboxesStyle.classList.add('oldMyshowsSettings-style');

        // Проходим по всем настройкам и создаём чекбоксы
        Object.keys(_Settings.v).forEach(id => {
            const checkboxData = _Settings.getCheckboxData(id);
            if (checkboxData) {
                createCheckbox(
                    checkboxesStyle,
                    id,
                    checkboxData.labelText,
                    checkboxData.textContent,
                    checkboxData.tooltipText
                );
            }
        });

        // Добавляем флажки в контейнер
        checkboxesContainer.appendChild(checkboxesStyle);
        checkboxesContainer.classList.toggle('hidden');

        // Добавляем заголовок и контейнер с флажками в сворачиваемую группу
        sectionAccordion.appendChild(sectionAccordionTitle);
        sectionAccordion.appendChild(checkboxesContainer);

        // Добавляем обработчик события клика на заголовок для переключения видимости контейнера с флажками
        sectionAccordionTitle.addEventListener('click', function() {
            checkboxesContainer.classList.toggle('hidden');
        });

        // Вставляем новую группу перед последним дочерним элементом
        parentElement.insertBefore(sectionAccordion, thelastChild);
    }

    /**
      * Заменяет название шоу на оригинальное, используя данные из карты `nuxtMap`.
      * Если название не найдено, пытается обновить карту из DOM или запросить данные через API.
      * @param {Object} show — Объект шоу, содержащий путь (pathname).
      * @param {boolean} [retry=true] — (необязательный) Если `true`, разрешает повторные попытки поиска названия.
      * @returns {string} — Оригинальное название шоу или пустая строка, если название не найдено.
      */
    function fixTitle(show, retry = true) {
        if (!show || !show.pathname) return '';

        const showId = getShowIdFromPathname(show.pathname);
        if (!showId) return '';

        // Проверяем, есть ли уже название в карте
        let title = nuxtMap.get(showId) || '';
        if (title !== '') return title;

        // Если названия нет, но разрешены повторные попытки
        if (retry && Date.now() - lastRetryTime > RETRY_DELAY) {
            lastRetryTime = Date.now();

            // Проверяем, не запрошен ли уже этот ID
            if (!pendingApiRequests.has(showId)) {
                console.log('[old.myshows.me] Название не найдено для showId: ', showId, 'Повторная попытка...');

                // Сначала попробуем обновить map из DOM
                console.log('[old.myshows.me] Вызов createNuxtMap из fixTitle()');
                createNuxtMap(() => {
                    const retryTitle = nuxtMap.get(showId) || '';

                    // Если title всё ещё не найден, запрашиваем через API
                    if (retryTitle === '') {
                        fetchTitleFromAPI(showId);
                    } else {
                        console.log('[old.myshows.me] Название найдено в DOM для showId: ', showId, 'Название: ', retryTitle);
                    }

                    return retryTitle;
                }, 1);
            }
        }

        return nuxtMap.get(showId) || '';
    }

    /**
      * Добавляет префикс (например, 'S' или 'E') к числу, представляющему сезон или серию.
      * Если число меньше 10, добавляет ведущий ноль.
      * @param {string} text — Текст, содержащий число.
      * @param {string} prefix — Префикс, который нужно добавить (например, 'S' для сезона или 'E' для серии).
      * @returns {string} — Строка с добавленным префиксом и числом. Если текст не является числом, возвращает исходный текст.
      */
    function addPrefix(text, prefix) {
        const num = parseInt(text, 10);
        return isNaN(num) ? text : `${prefix}${num < 10 ? '0' : ''}${num}`;
    }

    /**
      * Преобразует строку с информацией об эпизоде (например, "1 x 1 - название эпизода")
      * в объект с полями `se` (сезон и серия в формате 's01e01') и `name` (название эпизода).
      * Если включена настройка `ModifyS01E01`, форматирует сезон и серию.
      * @param {string} episodeText — Строка с информацией об эпизоде.
      * @returns {{ se: string, name: string }} — Объект с двумя полями:
      *   — `se`: строка в формате sXXeYY (например, "s01e01").
      *   — `name`: название эпизода (например, "название эпизода").
      */
    function fixEpisodeInfo(episodeText) {
        let se = '';
        let name = '';

        if (!episodeText) return { se, name }; // Если входная строка пустая или отсутствует, возвращаем пустой объект

        const s01e01Postfix = _Settings.getValue('s01e01Postfix') && _Settings.getCheckboxData('s01e01Postfix').textContent || '';

        if (_Settings.getValue('ModifyS01E01')) {
            // Если включена настройка ModifyS01E01, преобразуем строку в формат s01e01
            const parts = episodeText.split(' '); // Разделяем строку по пробелам
            if (parts.length >= 3) {
                const season = parts[0]; // Номер сезона (первый элемент)
                const episode = parts[2]; // Номер эпизода (третий элемент)
                const s = addPrefix(season, 's'); // Добавляем префикс "s" к номеру сезона
                const e = `${addPrefix(episode, 'e')} ${s01e01Postfix}`.trim(); // Добавляем префикс "e" и, если нужно, постфикс
                se = `${s}${e}`; // Собираем полную строку
                name = parts.slice(3).join(' ').replace(/^-\s*/, '').trim(); // Извлекаем название эпизода, удаляя начальные дефисы и пробелы
            }
        } else {
            // Если настройка ModifyS01E01 выключена, используем другой формат разбора строки
            const parts = episodeText.split(' - '); // Разделяем строку по " - "
            if (parts.length >= 2) {
                se = parts[0].trim(); // Первая часть до " - " — это "s01e01" или аналог
                name = parts.slice(1).join(' - ').trim(); // Остальная часть — название эпизода
            } else {
                se = episodeText.trim(); // Если разделитель " - " отсутствует, вся строка считается частью "se"
            }
        }
        return { se, name }; // Возвращаем объект с результатами
    }

    /**
      * Сортирует элементы эпизодов внутри каждого блока `.WatchSoon-item` по числу дня.
      * Удаляет избыточные ссылки на даты для повторяющихся дней.
      * Ничего не делает, если есть активные запросы к API.
      * @returns {void} — Функция не возвращает значений.
      */
    function sortWatchSoonItems() {
        // PS: 2025.03.11: https://disk.yandex.ru/i/hEe_3lzeFPFlxg — пруф.
        // Отключил полностью все скрипты и стили. Сортировка кривая! Бесит, правим

        // Прекращаем выполнение, если есть активные API-запросы.
        // Это предотвращает рекурсию, вызванную текущей реализацией setupObserver
        if (apiRequestsInProgress.size > 0) return;

        let watchSoonItems = document.querySelectorAll('.WatchSoon-item'); // Получаем все элементы-контейнеры для месяцев из списка WatchSoon
        if (!watchSoonItems) return;

        let changes = 0;
        // Проходим по каждому контейнеру месяца.
        watchSoonItems.forEach(watchSoonItem => {
            let rows = watchSoonItem.querySelectorAll('.Row:not(.WatchSoon-header):not(.FIXED)'); // Выбираем все строки (элементы .Row), исключая заголовок с месяцем
            if (rows.length === 0) return;
            let rowsArray = Array.from(rows);
            let dayText = '';

            // Добавляем атрибут data-day к каждой строке, содержащий номер дня
            rowsArray.forEach(row => {
                const dayElement = row.querySelector('.WatchSoon-left'); // Находим элемент с датой
                if (dayElement) {
                    dayText = dayElement.textContent.replace(/вчера/gi, '-1').replace(/yesterday/gi, '-1').replace(/вчора/gi, '-1')
                        .replace(/сегодня/gi, '0').replace(/today/gi, '0').replace(/сьогодні/gi, '0');
                    const dayNumber = parseInt(dayText.split(' ')[0].trim(), 10); // Извлекаем номер дня
                    if (!isNaN(dayNumber)) {
                        row.dataset.day = dayNumber; // Сохраняем номер дня в dataset
                        if (!row.classList.contains('FIXED')) { row.classList.add('FIXED'); } // Добавляем FIXED только если его нет
                    }
                }
            });

            // Сортируем строки по возрастанию номера дня.
            rowsArray.sort((a, b) => {
                return (a.dataset.day || 0) - (b.dataset.day || 0); // Если data-day отсутствует, используем 0
            });

            // Очищаем контейнер с эпизодами и добавляем отсортированные строки обратно
            const container = watchSoonItem.querySelector('.WatchSoon-episodes');
            if (container) {
                container.innerHTML = ''; // Очищаем контейнер
                rowsArray.forEach(row => {
                    container.appendChild(row); // Добавляем строки в отсортированном порядке
                });
            }

            // Удаляем лишние ссылки на даты, которые дублируются в соседних строках
            let curDay = 0; // Переменная для отслеживания текущего дня
            rows = watchSoonItem.querySelectorAll('.Row:not(.WatchSoon-header)'); // Обновляем список строк
            rowsArray = Array.from(rows);
            rowsArray.forEach(row => {
                if (curDay !== row?.dataset?.day) {
                    curDay = row?.dataset?.day; // Обновляем текущий день, если он изменился
                } else {
                    const redundantLink = row.querySelector('.router-link-exact-active');
                    if (redundantLink) redundantLink.innerHTML = ''; changes += 1; // Если день совпадает с предыдущим, удаляем ссылку на дату
                }
            });
        });

        if (changes !== 0) console.log(`[old.myshows.me] Пересортирован список эпизодов`);
    }

    /**
      * Исправляет текст, который стал занимать несколько строк после обновления сайта.
      * Сортирует элементы эпизодов по дням, названиям шоу и номерам эпизодов.
      * Создаёт новые элементы с исправленным текстом и скрывает оригинальные элементы.
      * Ничего не делает, если есть активные запросы к API.
      * @returns {void} — Функция не возвращает значений.
      */
    function fixWatchSoonElements() {
        const changeIsNeeded = _Settings.getValue('OriginalTitleIsNeeded') ||
              _Settings.getValue('ModifyS01E01') ||
              _Settings.getValue('s01e01PostfixValue');
        if (!changeIsNeeded) return;

        if (apiRequestsInProgress.size > 0) return;

        let ohCrapHereWeGoAgain = false;
        if (_Settings.getApplied('watchSoonElementsModified') && nuxtMap.size > 0) {
            const firstChild = document.querySelector('.OldMyShowsClass')?.firstChild;
            if (!!firstChild && firstChild.textContent === nuxtMap.get(getShowIdFromPathname(firstChild.pathname))) {
                return;
            } else {
                ohCrapHereWeGoAgain = true;
            }
        }

        const watchSoonElements = document.querySelectorAll('.WatchSoon__title-wrapper');
        if (!watchSoonElements) return;

        // Проверяем, есть ли уже элементы OldMyShowsClass
        const existingCustomElements = document.querySelectorAll('.OldMyShowsClass');
        if (!ohCrapHereWeGoAgain && !!watchSoonElements.length && existingCustomElements.length >= watchSoonElements.length) {
            _Settings.setApplied('watchSoonElementsModified', true); // Если элементы уже есть, считаем задачу выполненной
            return;
        }

        const showsData = []; // Массив объектов для сортировки данных о шоу и эпизодах
        let index = -1; // Индекс для сортировки по дням
        let prevWatchSoonLeft = ''; // Для проверки, что текст сменился
        let changes = 0;

        // Заполняем массив объектами на основе данных на странице
        watchSoonElements.forEach(element => {
            const showLink = element.querySelector('.WatchSoon-show');
            const episodeLink = element.querySelector('.WatchSoon-episode');
            if (!showLink || !episodeLink || !episodeLink.textContent.includes(' - ')) return;

            // Находим родительский элемент с классом ".WatchSoon-left"
            let parent = element;
            while (parent && !parent.querySelector('.WatchSoon-left')) {
                parent = parent.parentElement;
            }
            if (!parent) return; // Если не найден родительский элемент, выходим

            // Добавим признак группировки из правой колонки (да, я вижу, что в коде она называется left)
            const watchSoonLeft = parent.querySelector('.WatchSoon-left').textContent.trim();
            if (watchSoonLeft !== prevWatchSoonLeft) {
                prevWatchSoonLeft = watchSoonLeft;
                index += 1;
            }

            let showTitle = _Settings.getValue('OriginalTitleIsNeeded') === true ? fixTitle(showLink) : showLink.textContent;
            showTitle = showTitle === '' ? showLink.textContent : showTitle; // Если ничего не получилось, то всё ещё оставим хоть какой-то текст
            const episodeInfo = fixEpisodeInfo(episodeLink.textContent);
            const innerHTML = `<a href="${showLink.href}" target="_blank">${showTitle}</a>
                               <span> — ${episodeInfo.se} — </span>
                               <a href="${episodeLink.href}" target="_blank">${episodeInfo.name}</a>`;

            // Добавляем данные в массив объектов
            showsData.push(new ShowData(index, showTitle, episodeInfo.se, innerHTML));

            // Скрываем исходный элемент
            if (!element.classList.contains('hidden')) { element.classList.add('hidden'); } // Добавляем hidden только если его нет
        });

        // Сортируем массив по index, затем по showText, затем по episodeInfo
        showsData.sort((a, b) => {
            if (a.index !== b.index) return a.index - b.index;
            if (a.showTitle !== b.showTitle) return a.showTitle.localeCompare(b.showTitle);
            return a.episodeInfo.localeCompare(b.episodeInfo);
        });

        existingCustomElements.forEach(el => el.remove());

        // Вставляем элементы на основе отсортированных данных
        showsData.forEach((data, index) => {
            const newElement = document.createElement('div');
            newElement.innerHTML = data.innerHTML;
            newElement.classList.add('OldMyShowsClass'); // (описание классов см. в initStyle())

            const parent = watchSoonElements[index];
            if (parent) {
                parent.parentNode.insertBefore(newElement, parent.nextSibling);
                changes += 1;
            }
        });

        // Меняем стили через CSS
        initStyle();

        _Settings.setApplied('watchSoonElementsModified', changes !== 0);
        if (changes !== 0) console.log(`[old.myshows.me] Применены настройки для «Календарь»`);
        if (changes !== 0) updateRowsHeightsBasedOnOldMyShowsClass();
    }

    /**
      * Загружает оригинальное название шоу из API по заданному идентификатору (showId).
      * Добавляет полученное название в карту `nuxtMap` и обновляет элементы на странице, если данные получены.
      * Обрабатывает ошибки сети с повторными попытками через 5 секунд до исчерпания лимита попыток.
      * @param {string} showId - Идентификатор шоу для запроса к API.
      * @param {string} [defaultText=''] - Текст по умолчанию, возвращаемый при ошибке.
      * @param {number} [retries=3] - Максимальное количество повторных попыток при ошибке сети.
      * @returns {Promise<string>} - Промис, возвращающий оригинальное название шоу или текст по умолчанию.
      */
    function fetchTitleFromAPI(showId, defaultText = '', retries = 3) {
        // Проверяем, не выполняется ли уже запрос для этого showId
        if (pendingApiRequests.has(showId) || apiRequestsInProgress.has(showId)) {
            // Если запрос уже идёт, возвращаем существующий промис, чтобы избежать дублирования
            return apiRequestsInProgress.get(showId);
        }

        // Логируем начало запроса с указанием showId
        // console.log('[old.myshows.me] Запрос к API для showId:', showId);

        // Добавляем showId в список ожидающих запросов
        pendingApiRequests.add(showId);

        // Создаём промис для выполнения HTTP-запроса к API
        const fetchPromise = fetch('https://api.myshows.me/v2/rpc/', {
            method: 'POST', // Метод запроса — POST
            headers: {
                'Content-Type': 'application/json', // Указываем, что отправляем JSON
                'Accept': 'application/json' // Ожидаем JSON в ответе
            },
            body: JSON.stringify({
                "jsonrpc": "2.0", // Версия JSON-RPC протокола
                "method": "shows.GetById", // Метод API для получения данных о шоу
                "params": {
                    "showId": Number(showId), // Преобразуем showId в число для API
                    "withEpisodes": false // Не запрашиваем эпизоды, только основную информацию
                },
                "id": 1 // Идентификатор запроса
            })
        })
        .then(response => {
            // Проверяем, успешен ли запрос
            if (!response.ok) {
                // Если статус не 200-299, выбрасываем ошибку с кодом статуса
                throw new Error(`API ответил статусом ${response.status}`);
            }
            // Преобразуем ответ в JSON
            return response.json();
        })
        .then(data => {
            // Извлекаем оригинальное название шоу из ответа или используем текст по умолчанию
            const titleOriginal = data?.result?.titleOriginal || defaultText;

            // Логируем успешный результат с полученным названием
            // console.log('[old.myshows.me] Результат API для showId:', showId, 'Название:', titleOriginal);

            // Если название получено (не равно defaultText), сохраняем его в карту
            if (titleOriginal !== defaultText) {
                nuxtMap.set(showId, titleOriginal);

                // Если мы на странице календаря, обновляем элементы после небольшой задержки
                if (location.href.includes('myshows.me/profile/next/')) {
                    // Очищаем предыдущий таймаут, чтобы избежать наложения
                    clearTimeout(window.fixWatchSoonElementsTimeout);
                    // Устанавливаем новый таймаут для обновления элементов
                    window.fixWatchSoonElementsTimeout = setTimeout(() => {
                        // Сбрасываем флаг применения изменений
                        _Settings.setApplied('watchSoonElementsModified', false);
                        // Применяем изменения к элементам календаря
                        fixWatchSoonElements();
                    }, defaultTimeout);
                }
            }

            // Удаляем showId из списков ожидающих и выполняющихся запросов
            pendingApiRequests.delete(showId);
            apiRequestsInProgress.delete(showId);

            // Возвращаем полученное название
            return titleOriginal;
        })
        .catch(error => {
            // Логируем ошибку с указанием showId и её описанием
            console.error('[old.myshows.me] Ошибка API для showId:', showId, error);

            // Удаляем showId из списков, так как запрос завершён (даже с ошибкой)
            pendingApiRequests.delete(showId);
            apiRequestsInProgress.delete(showId);

            // Если ошибка связана с сетью и остались попытки
            if (error.message.includes('Failed to fetch') && retries > 0) {
                // Логируем количество оставшихся попыток
                console.log('[old.myshows.me] Ошибка сети, осталось попыток:', retries);
                // Возвращаем новый промис для повторной попытки
                return new Promise(resolve => {
                    // Ждём заданную задержку перед следующей попыткой
                    setTimeout(() => {
                        // Проверяем, не появилось ли название в карте за это время
                        if (!nuxtMap.has(showId)) {
                            // Рекурсивно вызываем функцию с уменьшенным числом попыток
                            resolve(fetchTitleFromAPI(showId, defaultText, retries - 1));
                        } else {
                            // Если название уже есть, возвращаем его
                            resolve(nuxtMap.get(showId));
                        }
                    }, RETRY_DELAY);
                });
            } else if (error.message.includes('Failed to fetch')) {
                // Если попытки исчерпаны, выводим предупреждение
                console.warn('[old.myshows.me] Исчерпано количество попыток для showId:', showId);
            }

            // В случае окончательной ошибки возвращаем текст по умолчанию
            return defaultText;
        });

        // Сохраняем промис в карту выполняющихся запросов
        apiRequestsInProgress.set(showId, fetchPromise);

        // Возвращаем промис вызывающей стороне
        return fetchPromise;
    }

    /**
      * Пытается загрузить недостающие данные о шоу из API для элементов с классом `.WatchSoon-show`.
      * Собирает уникальные идентификаторы шоу (showId) и инициирует запросы к API для тех, которых нет в карте `nuxtMap`.
      * @returns {void} — Функция не возвращает значений.
      */
    function tryFetchingMissingShowsFromAPI() {
        const showLinks = document.querySelectorAll('.WatchSoon-show');
        if (!showLinks.length) return;

        console.log('[old.myshows.me] Попытка загрузить недостающие шоу из API');

        // Соберем все уникальные showId, чтобы не дублировать запросы
        const uniqueShowIds = new Set();

        showLinks.forEach(showLink => {
            if (!showLink || !showLink.pathname) return;

            const showId = getShowIdFromPathname(showLink.pathname);
            if (!nuxtMap.has(showId) &&
                !pendingApiRequests.has(showId) &&
                !apiRequestsInProgress.has(showId) &&
                !uniqueShowIds.has(showId)) {
                uniqueShowIds.add(showId);
            }
        });

        // Теперь запросим данные для уникальных showId
        uniqueShowIds.forEach(showId => {
            fetchTitleFromAPI(showId);
        });
    }

    /**
      * Создаёт карту `nuxtMap` с соответствием `showId` и `titleOriginal` на основе данных из `__NUXT_DATA__`.
      * Пытается извлечь данные из различных структур (`list`, `userShows`, `profileShows`) или запрашивает их через API, если данные недоступны.
      * Выполняет callback-функцию после завершения, если она передана.
      * @param {Function} [callback] — (необязательный) Функция, вызываемая после создания карты.
      * @param {number} [attempts=1] — (необязательный) Количество оставшихся попыток для повторного выполнения при отсутствии данных.
      * @returns {void} — Функция не возвращает значений.
      */
    function createNuxtMap(callback, attempts = 1) {
        if (apiRequestsInProgress.size > 0) {
            console.log('[old.myshows.me] Ожидаем ответа от API...');
            return;
        }

        console.log('[old.myshows.me] Создание карты nuxtMap, осталось попыток:', attempts, '; размер nuxtMap:', nuxtMap.size);
        if (attempts <= 0) {
            console.warn('[old.myshows.me] Прекращено ожидание __NUXT_DATA__');
            // Если не удалось получить данные из DOM, можно попробовать получить из API
            // для конкретных showId, которые нам нужны в данный момент
            tryFetchingMissingShowsFromAPI();
            if (callback) callback();
            return;
        } // Перенёс это в конец. Не знаю зачем

        const dataObject = parseScriptData();
        if (!dataObject) {
            // console.log('createNuxtMap из начала createNuxtMap()');
            // setTimeout(() => createNuxtMap(callback, attempts - 1), 200);
            return;
        }

        let iShowIDs = findKeyInArray(dataObject, 'list', 30) || findKeyInArray(dataObject, 'userShows', 30);
        if (iShowIDs) {
            const showIDs = dataObject?.[iShowIDs];
            if (Array.isArray(showIDs) && showIDs.length) {
                showIDs.forEach(element => {
                    try {
                        const show = dataObject?.[element]?.show;
                        if (show && dataObject?.[show]?.id && dataObject?.[show]?.titleOriginal) {
                            nuxtMap.set(
                                dataObject[dataObject[show].id].toString().trim(),
                                dataObject[dataObject[show].titleOriginal].trim()
                            );
                        }
                    } catch (error) {
                        console.error('[old.myshows.me] Ошибка при сопоставлении структуры list||userShows:', error);
                    }
                });
                console.log('[old.myshows.me] Карта создана (list||userShows structure)');
                if (callback) callback();
                return;
            }
        }

        const profileShowsIdx = findKeyInArray(dataObject, 'profileShows');
        if (profileShowsIdx) {
            const profileShows = dataObject[profileShowsIdx];
            const showFiltersIdx = profileShows?.showFilters;
            if (showFiltersIdx && Array.isArray(dataObject[showFiltersIdx])) {
                const m1 = dataObject[showFiltersIdx];
                m1.forEach(m1Idx => {
                    const m1Data = dataObject[m1Idx];
                    if (!m1Data || !m1Data.shows) return;
                    const showsIdx = m1Data.shows;
                    if (showsIdx && Array.isArray(dataObject[showsIdx])) {
                        const m2 = dataObject[showsIdx];
                        m2.forEach(m2Idx => {
                            const show = dataObject[m2Idx];
                            if (show && show.id && show.titleOriginal) {
                                try {
                                    nuxtMap.set(
                                        dataObject[show.id].toString().trim(),
                                        dataObject[show.titleOriginal].trim()
                                    );
                                } catch (error) {
                                    console.error('[old.myshows.me] Ошибка при сопоставлении структуры showFilters:', error);
                                }
                            }
                        });
                    }
                });
                console.log('[old.myshows.me] Карта создана (структура showFilters)');
                if (callback) callback();
                return;
            }
        }

        console.log('[old.myshows.me] Подходящая структура в __NUXT_DATA__ не найдена');

        tryFetchingMissingShowsFromAPI();
        if (callback) callback();
        // console.log('[old.myshows.me] createNuxtMap из конца createNuxtMap()');
        // setTimeout(() => createNuxtMap(callback, attempts - 1), 200);
    }

    /**
      * Изменяет отображение чисел в шапке профиля на странице `myshows.me/<userName>/`.
      * Заменяет сокращённые значения ("1к") на полные числа ("1 000") с использованием данных из `__NUXT_DATA__`.
      * Работает только если настройка `ModifyProfileNumbers` включена и изменения ещё не применены.
      * @returns {void} — Функция не возвращает значений.
      */
    function modifyProfileNumbers() {
        if (!_Settings.getValue('ModifyProfileNumbers') || _Settings.getApplied('ModifyProfileNumbers')) return;

        // Выбираем все div с классом UserHeader__stats-row на странице
        const statsRows = document.querySelectorAll('div.UserHeader__stats-row');
        if (!statsRows.length) return;

        // Пытаемся понять, с фильмами или без
        const statsTitles = document.querySelectorAll('.UserHeader__stats-title');
        if (!statsTitles.length) return;
        const withMovies = [...statsTitles].some(el =>
                                                 /(фильм|фільм|movie)\w*/i.test(el.textContent.trim()) // Адаптация для разных языков
                                                ) ? 'statsTotal' : 'stats';

        const dataObject = parseScriptData();
        if (!dataObject) return;
        const path1 = 'data.User.profile.stats.watchedEpisodes';
        const path2 = 'data.User.profile.statsMovies.watchedMovies';
        const path3 = `data.User.profile.${withMovies}.watchedHours`;

        // Ищем значения в __NUXT_DATA__. Могут быть в разных местах в зависимости от открытой страницы
        let value1 = findValueByPath(dataObject, path1);
        if (!value1) value1 = dataObject?.[findKeyInArray(dataObject, path1.split('.').pop())] ?? undefined;
        if (!value1) return;
        let value2 = findValueByPath(dataObject, path2);
        if (!value2) value2 = dataObject?.[findKeyInArray(dataObject, path2.split('.').pop())] ?? undefined;
        if (!value2) return;
        let value3 = findValueByPath(dataObject, path3);
        if (!value3) value3 = dataObject?.[dataObject?.[findKeyInArray(dataObject, `${withMovies}`)]?.watchedHours] ?? undefined;
        if (!value3) return;
        let value4 = Math.ceil(value3 / 24);

        // Сохраняем значения по ключам
        const valueMap = new Map([
            ['э', value1], // эпизодов (рус.)
            ['е', value1], // епізодів (укр.)
            ['e', value1], // episodes (англ.)
            ['ф', value2], // фильмов/фільмів (рус./укр.)
            ['m', value2], // movies (англ.)
            ['ч', value3], // часов (рус.)
            ['г', value3], // години (укр.)
            ['h', value3], // hours (англ.)
            ['д', value4], // дней/днів (рус./укр.)
            ['d', value4], // days (англ.)
        ]);
        let changes = 0;

        // Перебираем коллекцию элементов и меняем их содержимое
        statsRows.forEach(element => {
            const valueElement = element.querySelector('.UserHeader__stats-value');
            const titleElement = element.querySelector('.UserHeader__stats-title');
            if (!valueElement || !titleElement) return;

            // Получаем первую букву подписи
            const key = titleElement.textContent.trim().charAt(0).toLowerCase();

            // Ищем такую в сохранённых
            if (valueMap.has(key)) {
                const value = valueMap.get(key);
                if (value !== undefined && value !== null) {
                    // Если не пустая — присваиваем (без всяких привязок к классам и стилям, может потом)
                    valueElement.textContent = Math.round(value).toLocaleString();
                    changes += 1;
                }
            }
        });

        _Settings.setApplied('ModifyProfileNumbers', changes !== 0);
        if (changes !== 0) console.log(`[old.myshows.me] Применена настройка '${_Settings.getCheckboxData('ModifyProfileNumbers').labelText}'`);
    }

    /**
      * Удаляет ссылку из элемента с классом `Unwatched-showTitle` на странице `myshows.me/profile`,
      * оставляя ссылку только в русском названии шоу (элемент с классом `Unwatched-showTitle-title`).
      * Работает только если настройка `ModifyShowTitleLink` включена и изменения ещё не применены.
      * @returns {void} — Функция не возвращает значений.
      */
    function modifyShowTitleLink() {
        if (!_Settings.getValue('ModifyShowTitleLink') || _Settings.getApplied('ModifyShowTitleLink')) return;

        let elements = document.querySelectorAll('a.Unwatched-showTitle');
        let changes = 0;

        elements.forEach(element => {
            // Получаем значение href из элемента с классом 'Unwatched-showTitle'
            const hrefValue = element.getAttribute('href');

            // Создаём новый элемент <div>
            const newElement = document.createElement('div');
            newElement.className = 'Unwatched-showTitle';

            // Перебираем все дочерние элементы элемента <a>
            while (element.firstChild) {
                // Перемещаем каждый дочерний элемент из <a> в новый <div>
                newElement.appendChild(element.firstChild);
            }

            // Заменяем элемент <a> на новый элемент <div>
            element.parentNode.replaceChild(newElement, element);

            // Ищем внутри нового элемента элементы с классом "Unwatched-showTitle-title" и заменяем их на ссылки
            let titleElements = newElement.querySelectorAll('span.Unwatched-showTitle-title');
            if (!titleElements) return;

            titleElements.forEach(titleElement => {
                const newLink = document.createElement('a');
                newLink.href = hrefValue;
                newLink.className = 'Unwatched-showTitle-title';
                newLink.innerHTML = titleElement.innerHTML;

                // Заменяем элемент <span> на новый элемент <a>
                titleElement.parentNode.replaceChild(newLink, titleElement);
                changes += 1;

                if (!element.classList.contains('FIXED')) { element.classList.add('FIXED'); }
            });
        });

        _Settings.setApplied('ModifyShowTitleLink', changes !== 0);
        if (changes !== 0) console.log(`[old.myshows.me] Применена настройка '${_Settings.getCheckboxData('ModifyShowTitleLink').labelText}'`);
    }

    /**
      * Изменяет текст в элементах с классом `Unwatched-showSeasonMeta` на странице `myshows.me/profile`.
      * Заменяет формат "N эпизодов с eX" на "N эпизодов с e0X" для чисел меньше 10, добавляя ведущий ноль.
      * Работает только если настройка `ModifyShowSeasonMeta` включена и изменения ещё не применены.
      * @returns {void} — Функция не возвращает значений.
      */
    function modifyShowSeasonMeta() {
        if (!_Settings.getValue('ModifyShowSeasonMeta') || _Settings.getApplied('ModifyShowSeasonMeta')) return;

        // Находим все элементы <div> с классом "Unwatched-showSeasonMeta"
        const elements = document.querySelectorAll('div.Unwatched-showSeasonMeta');
        // const regex = / с e(0(?=$)|[1-9]\d*$)/; // Не помню, почему именно так было
        const regex = / (from|с|з) e([0-9])$/i; // Адаптация для разных языков
        let changes = 0;

        // Перебираем каждый элемент
        elements.forEach(element => {
            // Получаем текстовое содержимое элемента
            const text = element.textContent;

            // Ищем подстроку " с e" и последующей цифрой
            const match = text.match(regex);

            // Если подстрока найдена и цифра меньше 10
            if (match) {
                // Заменяем найденную цифру на "0" + цифра.
                // Устанавливаем новый текстовый контент элемента
                element.textContent = text.replace(match[0], ` ${match[1]} e0${match[2]}`);
                changes += 1;
            }
        });

        _Settings.setApplied('ModifyShowSeasonMeta', changes !== 0);
        if (changes !== 0) console.log(`[old.myshows.me] Применена настройка '${_Settings.getCheckboxData('ModifyShowSeasonMeta').labelText}'`);
    }

    /**
      * Обновляет высоту строк (`.Row`) на странице `/profile/next/`
      * на основе высоты элементов с классом `.OldMyShowsClass`.
      * Если высота элемента превышает 20 пикселей (многострочный текст),
      * устанавливает автоматическую высоту, иначе задаёт фиксированную.
      * @returns {void} — Функция не возвращает значений.
      */
    function updateRowsHeightsBasedOnOldMyShowsClass() {
        // Получаем все элементы с классом OldMyShowsClass
        const elements = document.querySelectorAll('.OldMyShowsClass');
        if (!elements.length) return;

        let changes = 0;

        // Перебираем каждый элемент.
        // Если высота больше 20 (то есть содержит текста на несколько строк) — ставим автовысоту у `.Row`
        // 2025.03.13: На текущий момент показывает, что 18.18 — обычная высота. 36.36 — когда текст уже на две строки переносится
        elements.forEach((element) => {
            const closestRow = element.closest('.Row');
            if (closestRow) {
                const heightNow = closestRow.style.getPropertyValue('height') || rowHeight; // Текущая высота. Если пустая, то считаем стандартной
                const heightToBe = element.clientHeight > 20 ? 'auto' : rowHeight;
                if (heightNow !== heightToBe) {
                    closestRow.style.setProperty('height', heightToBe, 'important');
                    changes += 1;
                }
            }
        });

        if (changes !== 0) console.log(`[old.myshows.me] Исправлена высота некоторых строк (${changes} шт.)`);
    }

    /**
      * Инициализирует или обновляет стили CSS для элементов на странице, добавляя их в элемент `<style>`.
      * Создаёт или переиспользует существующий элемент `<style>` в `<head>`, применяя правила для различных разделов сайта.
      * Устанавливает стили с приоритетом `!important` для обеспечения корректного отображения изменений.
      * @returns {void} — Функция не возвращает значений.
      */
    function initStyle() {
        // Получить существующий / создать новый элемент <style>
        STYLE = document.querySelector('style') || document.createElement('style');
        if (!STYLE.parentNode) {
            // Вставить новый элемент <style> в <head>
            document.head.appendChild(STYLE);
        }

        const statsRowColor = 'white';

        // Не будем много раз добавлять одно и то же
        const startPhrase = '/* old.myshows.me.start */';
        const endPhrase = '/* old.myshows.me.end */';

        // Находим индексы начала и конца текста между фразами
        let styleContent = STYLE.textContent;
        const startIndex = styleContent.indexOf(startPhrase);
        const endIndex = styleContent.indexOf(endPhrase) + endPhrase.length;

        if (startIndex !== -1 && endIndex !== -1) {
            // Удаляем существующий текст между startPhrase и endPhrase
            STYLE.textContent = (styleContent.substring(0, startIndex) + styleContent.substring(endIndex)).trim();
        }

        STYLE.textContent += /*CSS*/ `
${startPhrase}

.hidden { display: none; }

/* ============================================================================================= */
/* myshows.me/<userName> */

.UserHeader__stats-row { text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black; color: ${statsRowColor}; }
.UserHeader__stats-title { color: ${statsRowColor} }


/* ============================================================================================= */
/* myshows.me/profile/next/ */

.OldMyShowsClass { font-size: 14px; }
.WatchSoon-episodes .Row { height: ${rowHeight}; padding: 0 10px 0 10px; }
.WatchSoon-date { max-width: 43px; font-weight: 500; font-size: 13px; }
.WatchSoon-date a {	display: flex; flex-wrap: wrap; gap: 0 4px; }
.WatchSoon-date a div:first-child::after { content: ','; }
.WatchSoon-show { font-size: 14px; }
.calendar-day__counter { margin: 0 0 0 2px; } /* Уменьшение отступа между датой и количеством серий в календарике */


/* ============================================================================================= */
/* myshows.me/profile */

.Unwatched-showTitle-inline { display: inline-flex; }
.Unwatched-showTitle-subTitle { display: none; }
.Unwatched-showTitle-title { align-self: auto; padding-right: 10px; }
.Unwatched-season~div .UnwatchedEpisodeItem { height: ${rowHeight}; }
.UnwatchedEpisodeItem__info { display: contents; }


/* ============================================================================================= */
/* myshows.me/profile/edit */

.oldMyshowsSettings-style { display: grid; }
.oldMyshowsSettings-label { display: inline-flex; margin-top: 20px; }
.oldMyshowsSettings-label>* { margin-right: 7px; } /* Увеличение отступа между полем флажка и текстом */
.oldMyshowsSettings-checkbox input[type="checkbox"] { width: 10px; height: 10px; } /* Ширина/высота поля флажка */

${endPhrase}
`.replace(/;\s/g, ' !important;');
    }

    /**
      * Проверяет текущий URL и применяет соответствующие модификации страницы в зависимости от настроек и адреса.
      * Вызывает функции сортировки, исправления элементов и стилей для страниц `/profile/next/`, `/profile/`, `/<userName>/` и `/profile/edit/`.
      * @returns {void} — Функция не возвращает значений.
      */
    function ensureModifications() {
        const currentUrl = window.location.href;
        checkUrlChange();

        if (currentUrl.includes('myshows.me/profile/next/')) {
            sortWatchSoonItems();
            updateRowsHeightsBasedOnOldMyShowsClass();
            if (apiRequestsInProgress.size === 0) {
                if (_Settings.getValue('OriginalTitleIsNeeded') && nuxtMap.size === 0) {
                    createNuxtMap(() => fixWatchSoonElements());
                } else {
                    fixWatchSoonElements();
                }
            }
        }

        if (currentUrl.includes('myshows.me/profile/')) {
            modifyShowTitleLink();
            modifyShowSeasonMeta();
        }

        if (currentUrl.includes('myshows.me/profile/edit/')) {
            createCheckboxes();
        }

       modifyProfileNumbers(); // Оказывается, у других людей тоже есть цифры в профиле xD
       initStyle();
    }

    /**
      * Настраивает наблюдатель (`MutationObserver`) для отслеживания изменений в DOM на странице.
      * При обнаружении изменений, требующих повторного применения модификаций, вызывает `ensureModifications`.
      * Игнорирует изменения в уже модифицированных элементах или скрытых классах.
      * @returns {void} — Функция не возвращает значений.
      */
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldRun = false;
            mutations.forEach(mutation => {
                const currentUrl = window.location.href;
                if (currentUrl.includes('myshows.me/profile/')) {
                    if (mutation.target.querySelector('a.Unwatched-showTitle:not(.FIXED)')) {
                        _Settings.setApplied('ModifyShowTitleLink', false);
                        shouldRun = true;
                    }
                    if (mutation.target.querySelector('div.Unwatched-showSeasonMeta')) {
                        _Settings.setApplied('ModifyShowSeasonMeta', false);
                        shouldRun = true;
                    }
                }
                if (currentUrl.includes('myshows.me/profile/next/') && !document.querySelector('.OldMyShowsClass')) {
                    _Settings.setApplied('watchSoonElementsModified', false);
                    if (!!document.querySelector('.WatchSoon__title-wrapper')) {
                        shouldRun = true;
                    }
                }
                if (mutation.target.querySelector('div.UserHeader__stats-row:not(.FIXED)')) {
                    _Settings.setApplied('ModifyProfileNumbers', false);
                    shouldRun = true;
                }
                if (currentUrl.includes('myshows.me/profile/edit/') &&
                    !document.querySelector('.oldMyshowsSettings')) {
                    shouldRun = true;
                }
            });

            if (shouldRun) {
                console.log('[old.myshows.me] Observer обнаружил изменения, повторное применение модификаций');
                ensureModifications();
            }
        });

        observer.observe(document.querySelector('.Main-content') || document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    /**
      * Выполняет начальную настройку страницы при её загрузке.
      * Устанавливает наблюдатель, применяет модификации и стили с небольшой задержкой.
      * @returns {void} — Функция не возвращает значений.
      */
    function onPageLoad() {
        setupObserver();
        setTimeout(ensureModifications, defaultTimeout);
        initStyle();
    }

    window.addEventListener('load', onPageLoad);
    window.addEventListener('popstate', () => setTimeout(ensureModifications, defaultTimeout));
    window.addEventListener('resize', updateRowsHeightsBasedOnOldMyShowsClass);

    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        setTimeout(ensureModifications, defaultTimeout);
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        setTimeout(ensureModifications, defaultTimeout);
    };

    // С вероятностью 95% какие-то проверки лишние.
    // Но когда пытался сократить их количество — что-нибудь переставало работать

})();