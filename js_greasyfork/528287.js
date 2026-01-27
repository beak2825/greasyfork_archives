// ==UserScript==
// @name         RuTracker Search Filter
// @name:en      RuTracker Search Filter
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @license MIT
// @description  Расширенный фильтр категорий и результатов поиска
// @description:en  Advanced category and search results filter
// @author       С
// @match        https://rutracker.org/forum/tracker.php*
// @match        https://nnmclub.to/forum/tracker.php*
// @match        https://tapochek.net/tracker.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528287/RuTracker%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/528287/RuTracker%20Search%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Флаги для отслеживания применения настроек
    let isApplyingSettings = false;  // в функции applyHiddenCategories
    let isProcessingResults = false;  // в функции processSearchResults
    let isAltModeActive = false;
    let altSelectedCategories = new Set();

    // Конфигурация для различных сайтов
    const siteConfigs = {
        // Конфигурация для RuTracker
        'rutracker.org': {
            // Селекторы для основных элементов
            selectors: {
                selectElement: '#fs-main',  // Селектор списка категорий
                formElement: '#tr-form',  // Селектор формы поиска
                searchInput: 'input[name="nm"]',  // Селектор поля ввода поиска
                searchParam: 'nm',  // Параметр поиска в URL
                categoryParam: 'f',  // Параметр категорий в URL
                optgroupSelector: 'optgroup',  // Селектор групп категорий
                rootCategorySelector: 'option.root_forum.has_sf',  // Селектор родительских категорий с подкатегориями
                legendSelector: 'fieldset legend',  // Селектор легенды для добавления индикатора

                // Селекторы для обработки результатов поиска
                resultsTable: '#tor-tbl',  // Таблица с результатами поиска
                resultRows: 'tbody tr',  // Строки с результатами
                categoryLink: '.f-name a',  // Ссылка на категорию в строке результата
                rowContainer: 'tbody'  // Контейнер для строк результатов
            },

            // Функция для получения ID подкатегорий родительской (корневой) категории
            getSubcategories: function(rootOption, selectElement, allOptions) {
                const rootId = rootOption.value;
                const subCategoryClass = `fp-${rootId}`;
                return Array.from(selectElement.querySelectorAll(`.${subCategoryClass}`));
            },

            // Опции для обработчика отправки формы
            searchMethod: 'POST',  // Метод поиска для запроса: POST или GET
            encodeSearchQuery: false,  // Кодировать ли поисковой запрос? Только если searchMethod GET
            spaceAsPlus: false,  // заменять ли пробелы (%20) на "+" в поисковом запросе. Только если searchMethod GET

            // Функция для создания URL поиска. Только если searchMethod GET
            createSearchUrl: function(categories, searchQuery) {
                return `https://rutracker.org/forum/tracker.php?f=${categories}&nm=${searchQuery}`;
            },

            // Функция для извлечения ID категории из URL ссылки (для результатов поиска)
            extractCategoryId: function(href) {
                const fMatch = href.match(/[?&]f=(\d+)/);
                return fMatch && fMatch[1] ? fMatch[1] : '';
            },

            // Функция для проверки встроенного механизма скрытия результатов
            checkBuiltInHiding: function(resultsTable) {
                // Проверяем наличие встроенного механизма скрытия
                const rows = resultsTable.querySelectorAll('tbody tr');
                return Array.from(rows).some(
                    row => row.textContent &&
                    (row.textContent.includes('Скрыть результаты') ||
                     row.textContent.includes('Показать результаты'))
                );
            },

            // Функция для создания переключателя видимости скрытых результатов
            createToggleRow: function(hiddenRowsCount) {
                const toggleRow = document.createElement('tr');
                toggleRow.className = 'tCenter';

                const toggleCell = document.createElement('td');
                toggleCell.colSpan = '10';
                toggleCell.className = 'row4';
                toggleCell.style.textAlign = 'center';
                toggleCell.style.padding = '5px 0';

                // кнопка
                const toggleLink = document.createElement('div');
                toggleLink.className = 'spoiler-btn';
                toggleLink.style.cursor = 'pointer';
                toggleLink.textContent = `Показать результаты из скрытых категорий (${hiddenRowsCount})`;
                toggleLink.style.fontWeight = 'bold';
                toggleLink.style.padding = '5px';
                toggleLink.style.backgroundColor = '#f0f0f0';
                toggleLink.style.borderRadius = '3px';

                toggleCell.appendChild(toggleLink);
                toggleRow.appendChild(toggleCell);

                return {
                    row: toggleRow,
                    link: toggleLink,
                    showText: `Показать результаты из скрытых категорий (${hiddenRowsCount})`,
                    hideText: `Скрыть результаты из скрытых категорий (${hiddenRowsCount})`,
                    hiddenContainer: {
                        element: 'tbody',  // Тип элемента для контейнера скрытых результатов
                        displayStyle: 'table-row-group',  // CSS display для видимого состояния
                        appendTo: 'table'  // Куда добавлять контейнер (table или rowContainer)
                    }
                };
            },

            // Текст для пользовательского интерфейса
            ui: {
                scriptStatus: '[Фильтры активны]',
                allGroupsPrefix: '[ВСЕ] ',
                helpText: '• Выбор раздела с подразделами включает и сам раздел, и все его подразделы<br>' +
                          '• Опции [ВСЕ] позволяют выбрать все разделы в группе сразу<br>' +
                          '• Зажмите Alt при выборе, чтобы выбирать только родительские разделы<br>' +
                          '• Используйте кнопки над списком для управления видимостью категорий'
            }
        },

        // Конфигурация для tapochek.net
        'tapochek.net': {
            selectors: {
                selectElement: '#fs',  // Селектор списка категорий
                formElement: 'form[action^="tracker.php"]',  // Селектор формы поиска
                searchInput: 'fieldset p.input input[name="nm"]',  // Селектор поля ввода поиска
                searchParam: 'nm',  // Параметр поиска в URL
                categoryParam: 'f',  // Параметр категорий в URL
                optgroupSelector: 'optgroup',  // Селектор групп категорий
                rootCategorySelector: 'option.root_forum.has_sf, option.root_forum',  // Селектор родительских категорий с подкатегориями
                legendSelector: 'fieldset legend',  // Селектор легенды для добавления индикатора

                // Селекторы для обработки результатов поиска
                resultsTable: '#tor-tbl',  // Таблица с результатами поиска
                resultRows: 'tbody tr',  // Строки с результатами
                categoryLink: 'td:nth-child(3) a.gen',  // Ссылка на категорию в строке результата
                rowContainer: 'tbody'  // Контейнер для строк результатов
            },

            // Функция для получения ID подкатегорий родительской (корневой) категории
            getSubcategories: function(rootOption, selectElement, allOptions) {
                const rootIndex = allOptions.indexOf(rootOption);
                const subcategories = [];

                // Проверяем, содержит ли корневая категория класс 'has_sf'
                const hasSubforums = rootOption.classList.contains('has_sf');
                if (!hasSubforums) return [];  // Нет подкатегорий для опций без 'has_sf'

                // Получаем родительский optgroup корневой опции
                const rootOptgroup = rootOption.parentNode;

                // Просматриваем опции после данной корневой категории, пока не встретим другую корневую категорию
                for (let i = rootIndex + 1; i < allOptions.length; i++) {
                    const option = allOptions[i];
                    const optionText = option.textContent || '';

                    // Проверяем, принадлежит ли опция тому же optgroup
                    if (option.parentNode !== rootOptgroup) {
                        break;  // Вышли за пределы группы - останавливаемся
                    }

                    // Проверяем, является ли эта опция вложенной (содержит '|-') и не является ли корневой категорией
                    if (optionText.includes('|-') && !option.classList.contains('root_forum')) {
                        subcategories.push(option);
                    }
                    // Останавливаемся, если встречаем другую корневую категорию 'root_forum'
                    else if (option.classList.contains('root_forum')) {
                        break;
                    }
                }

                return subcategories;
            },

            // Опции для обработчика отправки формы
            searchMethod: 'POST',  // Метод поиска для запроса: POST или GET
            encodeSearchQuery: false,  // Кодировать ли поисковой запрос? Только если searchMethod GET
            spaceAsPlus: true,  // заменять ли пробелы (%20) на "+" в поисковом запросе. Только если searchMethod GET

            // Функция для создания URL поиска. Только если searchMethod GET
            createSearchUrl: function(categories, searchQuery) {
                return `https://tapochek.net/tracker.php?f=${categories}&nm=${searchQuery}`;
            },

            // Функция для извлечения ID категории из URL ссылки (для результатов поиска)
            extractCategoryId: function(href) {
                const fMatch = href.match(/[?&]f=(\d+)/);
                return fMatch && fMatch[1] ? fMatch[1] : '';
            },

            // Функция для проверки встроенного механизма скрытия результатов
            checkBuiltInHiding: function(resultsTable) {
                // Проверяем наличие встроенного механизма скрытия
                const rows = resultsTable.querySelectorAll('tbody tr');
                return Array.from(rows).some(
                    row => row.textContent &&
                    (row.textContent.includes('Скрыть результаты') ||
                     row.textContent.includes('Показать результаты'))
                );
            },

            // Функция для создания переключателя видимости скрытых результатов
            createToggleRow: function(hiddenRowsCount) {
                const toggleRow = document.createElement('tr');
                toggleRow.className = 'tCenter';

                const toggleCell = document.createElement('td');
                toggleCell.colSpan = '10'; // Корректируем в зависимости от количества столбцов в таблице tapochek.net
                toggleCell.className = 'catBottom';
                toggleCell.style.textAlign = 'center';
                toggleCell.style.padding = '5px 0';

                // кнопка
                const toggleLink = document.createElement('div');
                toggleLink.className = 'spoiler-btn';
                toggleLink.style.cursor = 'pointer';
                toggleLink.textContent = `Показать результаты из скрытых категорий (${hiddenRowsCount})`;
                toggleLink.style.fontWeight = 'bold';
                toggleLink.style.padding = '5px';
                toggleLink.style.backgroundColor = '#f0f0f0';
                toggleLink.style.borderRadius = '3px';

                toggleCell.appendChild(toggleLink);
                toggleRow.appendChild(toggleCell);

                return {
                    row: toggleRow,
                    link: toggleLink,
                    showText: `Показать результаты из скрытых категорий (${hiddenRowsCount})`,
                    hideText: `Скрыть результаты из скрытых категорий (${hiddenRowsCount})`,
                    hiddenContainer: {
                        element: 'tbody',  // Тип элемента для контейнера скрытых результатов
                        displayStyle: 'table-row-group',  // CSS display для видимого состояния
                        appendTo: 'table'  // Куда добавлять контейнер (table или rowContainer)
                    }
                };
            },

            // Текст для пользовательского интерфейса
            ui: {
                scriptStatus: '[Фильтры активны]',
                allGroupsPrefix: '[ВСЕ] ',
                helpText: '• Выбор раздела с подразделами включает и сам раздел, и все его подразделы<br>' +
                          '• Опции [ВСЕ] позволяют выбрать все разделы в группе сразу<br>' +
                          '• Зажмите Alt при выборе, чтобы выбирать только родительские разделы<br>' +
                          '• Используйте кнопки над списком для управления видимостью категорий'
            }
        },

        // Конфигурация для nnmclub.to
        'nnmclub.to': {
            selectors: {
                selectElement: '#fs',  // Селектор списка категорий
                formElement: '#search_form',  // Селектор формы поиска
                searchInput: 'td.row1 fieldset.fieldset input[name="nm"]',  // Селектор поля ввода поиска
                searchParam: 'nm',  // Параметр поиска в URL
                categoryParam: 'f',  // Параметр категорий в URL
                optgroupSelector: 'optgroup',  // Селектор групп категорий
                rootCategorySelector: 'option[id^="fs-"]',  // Селектор всех опций с ID
                legendSelector: 'fieldset legend',  // Селектор легенды для добавления индикатора

                // Селекторы для обработки результатов поиска
                resultsTable: '.forumline.tablesorter',  // Таблица с результатами поиска
                resultRows: 'tbody tr',  // Строки с результатами
                categoryLink: 'td:nth-child(2) a.gen',  // Ссылка на категорию в строке результата
                rowContainer: 'tbody'  // Контейнер для строк результатов
            },

            // Функция для получения ID подкатегорий родительской (корневой) категории
            getSubcategories: function(rootOption, selectElement, allOptions) {
                const rootIndex = allOptions.indexOf(rootOption);
                const subcategories = [];

                // Проверяем, является ли данная категория корневой (не содержит '|-' в тексте)
                const rootText = rootOption.textContent || '';
                if (rootText.includes('|-')) return [];  // Не является корневой категорией

                // Получаем родительский optgroup корневой опции
                const rootOptgroup = rootOption.parentNode;
                if (rootOptgroup.nodeName !== 'OPTGROUP') return [];  // Если нет optgroup, возвращаем пустой массив

                // Просматриваем опции после данной корневой категории, пока не встретим другую не вложенную категорию
                for (let i = rootIndex + 1; i < allOptions.length; i++) {
                    const option = allOptions[i];
                    const optionText = option.textContent || '';

                    // Проверяем, принадлежит ли опция тому же optgroup
                    if (option.parentNode !== rootOptgroup) {
                        break;  // Вышли за пределы группы - останавливаемся
                    }

                    // Проверяем, является ли эта опция вложенной (содержит '|-')
                    if (optionText.includes('|-')) {
                        subcategories.push(option);
                    }
                    // Останавливаемся, если встречаем другую не вложенную категорию
                    else {
                        break;
                    }
                }

                return subcategories;
            },

            // Опции для обработчика отправки формы
            searchMethod: 'POST',  // Метод поиска для запроса: POST или GET
            encodeSearchQuery: true,  // Кодировать ли поисковой запрос? Только если searchMethod GET
            spaceAsPlus: false,  // заменять ли пробелы (%20) на "+" в поисковом запросе. Только если searchMethod GET

            // Функция для создания URL поиска. Только если searchMethod GET
            createSearchUrl: function(categories, searchQuery) {
                // Базовый URL без параметров запроса
                const baseUrl = 'https://nnmclub.to/forum/tracker.php';

                // Формируем URL с параметрами f и nm
                return `${baseUrl}?f=${categories}&nm=${searchQuery}`;
            },

            // Функция для извлечения ID категории из URL ссылки (для результатов поиска)
            extractCategoryId: function(href) {
                const fMatch = href.match(/[?&]f=(\d+)/);
                return fMatch && fMatch[1] ? fMatch[1] : '';
            },

            // Функция для проверки встроенного механизма скрытия результатов
            checkBuiltInHiding: function(resultsTable) {
                // Проверяем наличие встроенного механизма скрытия
                const rows = resultsTable.querySelectorAll('tbody tr');
                return Array.from(rows).some(
                    row => row.textContent &&
                    (row.textContent.includes('Скрыть результаты') ||
                     row.textContent.includes('Показать результаты'))
                );
            },

            // Функция для создания переключателя видимости скрытых результатов
            createToggleRow: function(hiddenRowsCount) {
                const toggleRow = document.createElement('tr');
                toggleRow.className = 'tCenter';

                const toggleCell = document.createElement('td');
                toggleCell.colSpan = '11'; // В таблице NNMClub 11 столбцов
                toggleCell.className = 'catBottom';
                toggleCell.style.textAlign = 'center';
                toggleCell.style.padding = '5px 0';

                // кнопка
                const toggleLink = document.createElement('div');
                toggleLink.className = 'spoiler-btn';
                toggleLink.style.cursor = 'pointer';
                toggleLink.textContent = `Показать результаты из скрытых категорий (${hiddenRowsCount})`;
                toggleLink.style.fontWeight = 'bold';
                toggleLink.style.padding = '5px';
                toggleLink.style.backgroundColor = '#f0f0f0';
                toggleLink.style.borderRadius = '3px';

                toggleCell.appendChild(toggleLink);
                toggleRow.appendChild(toggleCell);

                return {
                    row: toggleRow,
                    link: toggleLink,
                    showText: `Показать результаты из скрытых категорий (${hiddenRowsCount})`,
                    hideText: `Скрыть результаты из скрытых категорий (${hiddenRowsCount})`,
                    hiddenContainer: {
                        element: 'tbody',  // Тип элемента для контейнера скрытых результатов
                        displayStyle: 'table-row-group',  // CSS display для видимого состояния
                        appendTo: 'table'  // Куда добавлять контейнер (table или rowContainer)
                    }
                };
            },

            // Текст для пользовательского интерфейса
            ui: {
                scriptStatus: '[Фильтры активны]',
                allGroupsPrefix: '[ВСЕ] ',
                helpText: '• Выбор раздела с подразделами включает и сам раздел, и все его подразделы<br>' +
                          '• Опции [ВСЕ] позволяют выбрать все разделы в группе сразу<br>' +
                          '• Зажмите Alt при выборе, чтобы выбирать только родительские разделы<br>' +
                          '• Используйте кнопки над списком для управления видимостью категорий'
            }
        }

    };

    // Определяем текущий сайт
    const currentHostname = window.location.hostname;
    let currentSite = null;

    // Для отладки - выведем информацию о том, где запущен скрипт
    // console.log(`[Category Enhancer] Запуск на сайте: ${currentHostname}`);
    // console.log(`[Category Enhancer] URL: ${window.location.href}`);

    // Ищем подходящую конфигурацию для текущего сайта
    for (const site in siteConfigs) {
        if (currentHostname.includes(site)) {
            currentSite = siteConfigs[site];
            console.log(`[Category Enhancer] Найдена конфигурация для сайта: ${site}`);
            break;
        }
    }

    // Если нет подходящей конфигурации, выходим
    if (!currentSite) {
        // console.log('[Category Enhancer] Нет конфигурации для текущего сайта');
        return;
    }

    // Функция для восстановления состояния Alt-выбора из localStorage
    function restoreAltStateFromLS(categoryMap) {
        const storageKey = `altSelectedCategories_${currentHostname}`;
        const savedAltCategories = localStorage.getItem(storageKey);

        if (!savedAltCategories) return;

        try {
            const altCategoriesArray = JSON.parse(savedAltCategories);
            altCategoriesArray.forEach(catId => {
                if (categoryMap[catId]) {
                    altSelectedCategories.add(catId);
                }
            });
        } catch (e) {
            console.error('[Category Enhancer] Ошибка восстановления Alt-категорий:', e);
        }
    }

    // Функция для настройки режима "только родительские категории"
    function setupRootOnlyMode(selectElement, categoryMap) {
        // Получаем настройки
        const settingsKey = `categorySettings_${currentHostname}`;
        const savedSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
        const disableAutoSubcategories = savedSettings['disable-auto-subcategories'] !== undefined ?
            savedSettings['disable-auto-subcategories'] : false;

        // Если автовыбор дочерних отключен, не инициализируем Alt
        if (disableAutoSubcategories) return;

        // Отслеживаем нажатие Alt
        document.addEventListener('keydown', function(e) {
            if (e.altKey) {
                isAltModeActive = true;
                // Добавляем визуальную индикацию
                selectElement.style.outline = '3px solid #FF9800';
                selectElement.style.outlineOffset = '2px';
                selectElement.title = '⚡ Режим: выбор ТОЛЬКО родительских разделов (Alt зажат)';
            }
        });

        document.addEventListener('keyup', function(e) {
            if (!e.altKey) {
                isAltModeActive = false;
                // Убираем визуальную индикацию
                selectElement.style.outline = '';
                selectElement.style.outlineOffset = '';
                selectElement.title = '';
            }
        });

        // Отслеживаем изменение выбора
        selectElement.addEventListener('change', function(e) {
            const selected = Array.from(selectElement.selectedOptions).map(opt => opt.value);

            // Обновляем Set категорий, выбранных с Alt
            selected.forEach(categoryId => {
                // Если это родительская категория с подкатегориями
                if (categoryMap[categoryId]) {
                    if (isAltModeActive) {
                        // Добавляем в Set - эта категория выбрана с Alt
                        altSelectedCategories.add(categoryId);
                    } else {
                        // Удаляем из Set - эта категория выбрана без Alt
                        altSelectedCategories.delete(categoryId);
                    }
                }
            });

            // Удаляем из Set категории, которые больше не выбраны
            altSelectedCategories.forEach(categoryId => {
                if (!selected.includes(categoryId)) {
                    altSelectedCategories.delete(categoryId);
                }
            });
        });
    }

    // Функция для обработки результатов поиска и интеграции со встроенным механизмом
    function processSearchResults() {
        // Проверяем, не выполняется ли уже обработка
        if (isProcessingResults) return;
        isProcessingResults = true;

        const selectors = currentSite.selectors;

        // Получаем таблицу результатов поиска согласно конфигурации
        const resultsTable = document.querySelector(selectors.resultsTable);
        if (!resultsTable) {
            // console.log('[Category Enhancer] Таблица результатов поиска не найдена');
            isProcessingResults = false;

            // Если на странице есть результаты, но таблица еще не найдена, повторяем через 300мс
            // if (document.querySelector('.tCenter.hl-tr')) {
                // console.log('[Category Enhancer] Обнаружены результаты, повторная попытка через 300мс');
                // setTimeout(processSearchResults, 300);
            // }

            return;
        }

        // Проверяем, есть ли встроенный механизм скрытия результатов
        if (currentSite.checkBuiltInHiding && currentSite.checkBuiltInHiding(resultsTable)) {
            // console.log('[Category Enhancer] Найден встроенный механизм скрытия результатов, используем его');
            isProcessingResults = false;
            return;
        }

        // Получаем список скрытых категорий
        const storageKey = `hiddenCategories_${currentHostname}`;
        const hiddenCategoriesJSON = localStorage.getItem(storageKey) || '[]';
        const hiddenCategories = JSON.parse(hiddenCategoriesJSON);

        // Создаем множество ID скрытых категорий для быстрого поиска
        const hiddenCategoryIds = new Set();
        hiddenCategories.forEach(cat => {
            if (!cat.type && cat.id) {
                hiddenCategoryIds.add(cat.id);
            }
        });

        // Если нет скрытых категорий, нечего обрабатывать
        if (hiddenCategoryIds.size === 0) {
            isProcessingResults = false;
            return;
        }

        // console.log(`[Category Enhancer] Обрабатываем результаты поиска. Скрытых категорий: ${hiddenCategoryIds.size}`);

        // Массивы для хранения обычных и скрытых результатов
        const visibleRows = [];
        const hiddenRows = [];

        // Проходим по всем строкам таблицы
        const rows = resultsTable.querySelectorAll(selectors.resultRows);

        if (rows.length === 0) {
            // console.log('[Category Enhancer] Не найдены строки с результатами');
            isProcessingResults = false;

            // Если есть результаты, повторяем попытку
            setTimeout(processSearchResults, 300);
            return;
        }

        console.log(`[Category Enhancer] Найдено ${rows.length} строк с результатами (включая две лишние)`);

        rows.forEach(row => {
            // Находим ссылку на категорию
            const categoryLink = row.querySelector(selectors.categoryLink);
            if (!categoryLink) {
                // console.log('[Category Enhancer] Не найдена ссылка на категорию в строке', row);
                // visibleRows.push(row); // Если не можем определить категорию, оставляем видимой, обратить внимание!
                return;
            }

            // Проверяем, соответствует ли URL скрытой категории
            const href = categoryLink.getAttribute('href');
            let categoryId = '';

            // Извлекаем ID категории из URL с помощью функции из конфигурации сайта
            if (currentSite.extractCategoryId) {
                categoryId = currentSite.extractCategoryId(href);
            }

            if (categoryId && hiddenCategoryIds.has(categoryId)) {
                // console.log(`[Category Enhancer] Скрываем результат из скрытой категории ${categoryId}`);
                hiddenRows.push(row);
            } else {
                visibleRows.push(row);
            }
        });

        // Если нет скрытых строк, нечего делать
        if (hiddenRows.length === 0) {
            // console.log('[Category Enhancer] Нет результатов из скрытых категорий');
            isProcessingResults = false;
            return;
        }

        // console.log(`[Category Enhancer] Найдено ${hiddenRows.length} результатов из скрытых категорий`);

        // Очищаем контейнер строк
        const rowContainer = resultsTable.querySelector(selectors.rowContainer);
        if (!rowContainer) {
            // Если нет контейнера строк, используем саму таблицу
            // console.log('[Category Enhancer] Контейнер строк не найден, обработка невозможна');
            isProcessingResults = false;
            return;
        }

        // Удаляем существующий контейнер скрытых результатов, если он есть
        const existingHiddenContainer = document.getElementById('hidden-categories-results');
        if (existingHiddenContainer) {
            existingHiddenContainer.remove();
        }

        const originalRows = Array.from(rowContainer.children);
        originalRows.forEach(row => row.remove());

        // Добавляем видимые строки
        visibleRows.forEach(row => {
            rowContainer.appendChild(row);
        });

        // Создаем элементы управления для скрытых результатов
        const toggleElements = currentSite.createToggleRow(hiddenRows.length);
        rowContainer.appendChild(toggleElements.row);

        // Создаем контейнер для скрытых результатов с учетом конфигурации сайта
        const containerConfig = toggleElements.hiddenContainer || {
            element: 'div',          // По умолчанию используем div
            displayStyle: 'block',   // По умолчанию используем display: block
            appendTo: 'table'        // По умолчанию добавляем к таблице
        };

        // Создаем элемент нужного типа
        const hiddenContainer = document.createElement(containerConfig.element);
        hiddenContainer.id = 'hidden-categories-results';
        hiddenContainer.style.display = 'none';

        // Добавляем скрытые строки
        hiddenRows.forEach(row => {
            hiddenContainer.appendChild(row.cloneNode(true));
        });

        // Вставляем контейнер скрытых результатов в зависимости от конфигурации
        if (containerConfig.appendTo === 'table') {
            resultsTable.appendChild(hiddenContainer);
        } else if (containerConfig.appendTo === 'rowContainer') {
            rowContainer.appendChild(hiddenContainer);
        } else if (containerConfig.appendTo === 'after-container') {
            rowContainer.parentNode.insertBefore(hiddenContainer, rowContainer.nextSibling);
        }

        // Добавляем обработчик клика для переключения видимости
        toggleElements.link.addEventListener('click', function() {
            const hiddenResults = document.getElementById('hidden-categories-results');
            if (hiddenResults.style.display === 'none') {
                hiddenResults.style.display = containerConfig.displayStyle;
                toggleElements.link.textContent = toggleElements.hideText;
                // console.log('[Category Enhancer] Показаны скрытые результаты');
            } else {
                hiddenResults.style.display = 'none';
                toggleElements.link.textContent = toggleElements.showText;
                // console.log('[Category Enhancer] Скрыты результаты');
            }
        });

        // console.log('[Category Enhancer] Обработка результатов поиска успешно завершена');

        // Сбрасываем флаг
        isProcessingResults = false;
    }

    // Главная функция инициализации скрипта
    function initializeScript() {
        const selectors = currentSite.selectors;

        // Получаем основные элементы страницы
        const selectElement = document.querySelector(selectors.selectElement);
        if (!selectElement) {
            // Проверяем все селекты на странице, чтобы помочь с дебагом
            const allSelects = document.querySelectorAll('select');
            allSelects.forEach((select, index) => {
            });
            return;
        } else {
            // console.log(`[Category Enhancer] Найден элемент выбора категорий: id=${selectElement.id}, multiple=${selectElement.multiple}`);
        }

        const formElement = document.querySelector(selectors.formElement);
        if (!formElement) {
            console.error('[Category Enhancer] Не найдена форма поиска:', selectors.formElement);
            // Продолжаем работу даже если не найдена форма, просто исключаем функционал отправки формы
            // console.log('[Category Enhancer] Продолжаем без функционала отправки формы');
        } else {
            // console.log(`[Category Enhancer] Найдена форма поиска: name=${formElement.name}, id=${formElement.id}`);
        }

        // Проверяем параметр поиска в URL и заполняем поле поиска
        if (formElement) {
            fillSearchFieldFromUrl(selectors);
        }

        // Находим родительские категории с подкатегориями
        const rootOptions = selectElement.querySelectorAll(selectors.rootCategorySelector);
        // console.log(`[Category Enhancer] Найдено ${rootOptions.length} родительских категорий с подкатегориями`);

        const optgroups = selectElement.querySelectorAll(selectors.optgroupSelector);
        // console.log(`[Category Enhancer] Найдено ${optgroups.length} групп категорий (optgroup)`);

        // Создаем карту категорий и их подкатегорий
        const categoryMap = buildCategoryMap(rootOptions, selectElement);
        // console.log(`[Category Enhancer] Построена карта категорий: ${Object.keys(categoryMap).length} родительских категорий`);

        restoreAltStateFromLS(categoryMap);

        // Добавляем опции [ВСЕ] для выбора всех элементов в группе
        const optgroupMap = addGroupSelectors(optgroups, selectElement);
        // console.log(`[Category Enhancer] Добавлены селекторы групп: ${Object.keys(optgroupMap).length} групп`);

        // Функция для обновления подсветки для ее сохранения при выборе
        function updateHighlighting() {
            highlightSelectedCategories(selectElement, categoryMap, optgroupMap);
        }

        // Добавляем слушатель события изменения выбора
        selectElement.addEventListener('change', updateHighlighting);
        // console.log('[Category Enhancer] Добавлен обработчик изменения выбора');

        // Переопределяем отправку формы
        if (formElement) {
            setupFormSubmitHandler(formElement, selectElement, categoryMap, optgroupMap, selectors);
            // console.log('[Category Enhancer] Настроена обработка отправки формы');
        }

        // Инициализируем панель инструментов
        createCategoryToolbar(selectElement, optgroups, optgroupMap);
        // console.log('[Category Enhancer] Инициализирована панель инструментов');

        // Добавляем визуальную индикацию активности скрипта
        addVisualIndicators(selectors);
        // console.log('[Category Enhancer] Добавлены визуальные индикаторы');

        // Выполняем начальную подсветку для ее сохранения при выборе
        updateHighlighting();
        // console.log('[Category Enhancer] Выполнена начальная подсветка');

        // Настраиваем автоматическое применение настроек видимости
        setupAutoApply(selectElement);
        // console.log('[Category Enhancer] Настроено автоматическое применение настроек');

        // Настраиваем режим "только родительские категории"
        setupRootOnlyMode(selectElement, categoryMap);

        // console.log('[Category Enhancer] Скрипт успешно инициализирован для сайта', currentHostname);
    }

    // Функция для создания карты категорий и их подкатегорий
    function buildCategoryMap(rootOptions, selectElement) {
        const categoryMap = {};

        // Получаем все опции для анализа на основе их расположения
        const allOptions = Array.from(selectElement.querySelectorAll('option'));

        // Обрабатываем каждую корневую категорию
        rootOptions.forEach(rootOption => {
            const rootId = rootOption.value;
            categoryMap[rootId] = [];

            // Используем метод сайта для получения подкатегорий, если он доступен
            let subcategories = [];
            subcategories = currentSite.getSubcategories(rootOption, selectElement, allOptions);


            // Добавляем значения подкатегорий в карту
            subcategories.forEach(subOption => {
                categoryMap[rootId].push(subOption.value);
            });
        });

        return categoryMap;
    }

    // Функция для добавления селекторов групп
    function addGroupSelectors(optgroups, selectElement) {
        const optgroupMap = {};

        optgroups.forEach((optgroup, index) => {
            let optgroupLabel = optgroup.label || optgroup.getAttribute('label') || `Группа ${index+1}`;
            optgroupLabel = optgroupLabel.trim();
            const optgroupId = `group-${index}`;

            optgroupMap[optgroupId] = [];

            // Получаем все опции в этой группе
            const optgroupOptions = optgroup.querySelectorAll('option');
            optgroupOptions.forEach(option => {
                optgroupMap[optgroupId].push(option.value);
            });

            // Создаем специальную опцию для выбора всей группы
            const groupOption = document.createElement('option');
            groupOption.id = `fs-${optgroupId}`;
            groupOption.value = optgroupId;
            groupOption.className = 'group_selector';
            groupOption.style.fontWeight = 'bold';
            groupOption.style.backgroundColor = '#f0f0ff';
            groupOption.textContent = `${currentSite.ui.allGroupsPrefix}${optgroupLabel.replace('&nbsp;', '').trim()}`;

            // Добавляем опцию в начало группы
            if (optgroup.firstChild) {
                optgroup.insertBefore(groupOption, optgroup.firstChild);
            } else {
                optgroup.appendChild(groupOption);
            }
        });

        return optgroupMap;
    }

    // Функция для подсветки выбранных категорий
    function highlightSelectedCategories(selectElement, categoryMap, optgroupMap) {
        // Получаем все выбранные категории
        const selected = Array.from(selectElement.selectedOptions).map(opt => opt.value);

        // Сбрасываем подсветку
        selectElement.querySelectorAll('option:not(.group_selector)').forEach(opt => {
            opt.style.backgroundColor = '';
        });

        // Подсвечиваем категории
        selected.forEach(categoryId => {
            // Если выбран селектор группы
            if (categoryId.startsWith('group-') && optgroupMap[categoryId]) {
                optgroupMap[categoryId].forEach(subId => {
                    const subOption = document.getElementById(`fs-${subId}`) ||
                                    selectElement.querySelector(`option[value="${subId}"]`);
                    if (subOption && !subOption.classList.contains('group_selector')) {
                        subOption.style.backgroundColor = '#e0e0f0';  // Светло-синяя подсветка для групп
                    }
                });
            }
            // Если выбрана родительская категория с подкатегориями
            else if (categoryMap[categoryId]) {
                // Подсвечиваем родительскую категорию
                const parentOption = document.getElementById(`fs-${categoryId}`) ||
                                    selectElement.querySelector(`option[value="${categoryId}"]`);
                if (parentOption) {
                    parentOption.style.backgroundColor = '#e0f0e0';  // Светло-зеленая подсветка
                }

                // Получаем настройки
                const settingsKey = `categorySettings_${currentHostname}`;
                const savedSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
                const disableAutoSubcategories = savedSettings['disable-auto-subcategories'] !== undefined ?
                    savedSettings['disable-auto-subcategories'] : false;

                // Подсвечиваем подкатегории только если категория не была выбрана с alt
                if (!isAltModeActive && !altSelectedCategories.has(categoryId) && !disableAutoSubcategories) {
                    categoryMap[categoryId].forEach(subId => {
                        const subOption = document.getElementById(`fs-${subId}`) ||
                                        selectElement.querySelector(`option[value="${subId}"]`);
                        if (subOption) {
                            subOption.style.backgroundColor = '#e0f0e0';  // Светло-зеленая подсветка
                        }
                    });
                }
            }
            // Обычная категория
            else {
                const option = document.getElementById(`fs-${categoryId}`) ||
                              selectElement.querySelector(`option[value="${categoryId}"]`);
                if (option) {
                    option.style.backgroundColor = '#e0f0e0';
                }
            }
        });
    }

    // Функция для заполнения поля поиска из URL
    function fillSearchFieldFromUrl(selectors) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSearch = urlParams.get(selectors.searchParam);

        if (urlSearch) {
            const searchInput = document.querySelector(selectors.searchInput);
            if (searchInput && !searchInput.value) {
                searchInput.value = decodeURIComponent(urlSearch);
            }
        }
    }

    // Функция для настройки обработчика отправки формы
    function setupFormSubmitHandler(formElement, selectElement, categoryMap, optgroupMap, selectors) {
        formElement.addEventListener('submit', function(e) {
            // Сохраняем состояние Alt-выбора в localStorage перед отправкой
            const storageKey = `altSelectedCategories_${currentHostname}`;
            const altArray = Array.from(altSelectedCategories);
            localStorage.setItem(storageKey, JSON.stringify(altArray));

            // Получаем все выбранные категории
            const selected = Array.from(selectElement.selectedOptions).map(opt => opt.value);

            // Получаем сохраненные настройки
            const settingsKey = `categorySettings_${currentHostname}`;
            const savedSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
            const excludeHiddenFromSearch = savedSettings['exclude-hidden-categories-from-search'] !== undefined ?
                savedSettings['exclude-hidden-categories-from-search'] : true;

            // Если опция исключения скрытых категорий включена, получаем список скрытых категорий
            let hiddenCategoryIds = new Set();

            if (excludeHiddenFromSearch) {
                const storageKey = `hiddenCategories_${currentHostname}`;
                const hiddenCategoriesJSON = localStorage.getItem(storageKey) || '[]';
                const hiddenCategories = JSON.parse(hiddenCategoriesJSON);

                // Создаем множество ID скрытых категорий для быстрого поиска
                hiddenCategories.forEach(cat => {
                    if (!cat.type) {
                        hiddenCategoryIds.add(cat.id);
                    }
                });

                // console.log(`[Category Enhancer] Исключение скрытых категорий включено. Скрытых категорий: ${hiddenCategoryIds.size}`);
            } else {
                // console.log(`[Category Enhancer] Исключение скрытых категорий отключено.`);
            }

            // Добавляем подкатегории для выбранных родительских категорий или групп
            const finalCategories = [];
            const processedGroupIds = new Set();

            selected.forEach(categoryId => {
                // Если опция исключения включена и категория скрыта, пропускаем ее
                if (excludeHiddenFromSearch && hiddenCategoryIds.has(categoryId)) {
                    return;
                }

                // Проверяем, является ли это селектором группы
                if (categoryId.startsWith('group-')) {
                    if (optgroupMap[categoryId] && !processedGroupIds.has(categoryId)) {
                        // Добавляем категории из этой группы
                        optgroupMap[categoryId].forEach(subId => {
                            if (!excludeHiddenFromSearch || !hiddenCategoryIds.has(subId)) {
                                finalCategories.push(subId);
                            }
                        });
                        processedGroupIds.add(categoryId);
                    }
                }

                // Проверяем, является ли это родительской категорией с подкатегориями
                else if (categoryMap[categoryId]) {
                    // Добавляем саму родительскую категорию
                    finalCategories.push(categoryId);

                    // Получаем настройки
                    const disableAutoSubcategories = savedSettings['disable-auto-subcategories'] !== undefined ?
                        savedSettings['disable-auto-subcategories'] : false;

                    // Добавляем дочерние, только если автовыбор не отключен и категория не выбрана с alt
                    if (!disableAutoSubcategories && !altSelectedCategories.has(categoryId)) {
                        categoryMap[categoryId].forEach(subId => {
                            if (!excludeHiddenFromSearch || !hiddenCategoryIds.has(subId)) {
                                finalCategories.push(subId);
                            }
                        });
                    }
                }
                // Иначе добавляем выбранную категорию напрямую
                else {
                    finalCategories.push(categoryId);
                }
            });

            // Обработка в зависимости от метода поиска (searchMethod)
            switch (currentSite.searchMethod) {
                case 'POST':
                    // Для POST-запроса просто добавляем категории в форму
                    if (finalCategories.length > 0) {
                        // Удаляем все существующие поля категорий
                        formElement.querySelectorAll('input[name="f[]"], input[name="f"]').forEach(field => {
                            field.remove();
                        });

                        // Проверяем, есть ли селект с множественным выбором категорий
                        const categorySelect = formElement.querySelector('select[name="f[]"]');
                        if (categorySelect) {
                            // Если есть селект, очищаем его выбор и выбираем наши категории
                            Array.from(categorySelect.options).forEach(option => {
                                option.selected = finalCategories.includes(option.value);
                            });
                        } else {
                            // Если нет селекта, добавляем скрытые поля
                            finalCategories.forEach(categoryId => {
                                const categoryField = document.createElement('input');
                                categoryField.type = 'hidden';
                                categoryField.name = 'f[]';
                                categoryField.value = categoryId;
                                formElement.appendChild(categoryField);
                            });
                        }

                        console.log(`[Category Enhancer] Установлены категории: ${finalCategories.join(', ')}`);
                    }
                    return true;

                case 'GET':
                    e.preventDefault();

                    // Получаем поисковый запрос из поля ввода или из URL
                    const urlParams = new URLSearchParams(window.location.search);
                    let searchQuery = document.querySelector(selectors.searchInput)?.value || '';

                    // Если поисковый запрос пуст, проверяем URL
                    if (!searchQuery) {
                        const urlSearch = urlParams.get(selectors.searchParam);
                        if (urlSearch) {
                            searchQuery = urlSearch;
                        }
                    }

                    // Формируем URL со всеми категориями для GET-запроса
                    if (finalCategories.length > 0) {
                        const categoriesParam = finalCategories.join(',');

                        // Заменяем поисковой запрос на кодированный вариант, если включено encodeSearchQuery
                        const shouldEncodeSearch = currentSite.encodeSearchQuery !== undefined ?
                            currentSite.encodeSearchQuery : true;

                        // Применяем кодирование, если оно необходимо
                        let processedSearchQuery = shouldEncodeSearch ?
                            encodeURIComponent(searchQuery) : searchQuery;

                        // Заменяем пробелы на +, если включен spaceAsPlus
                        if (currentSite.spaceAsPlus) {
                            processedSearchQuery = shouldEncodeSearch ?
                                processedSearchQuery.replace(/%20/g, '+') :
                                searchQuery.replace(/ /g, '+');
                        }

                        // Создаем URL поиска
                        const finalUrl = currentSite.createSearchUrl(categoriesParam, processedSearchQuery);

                        // Перенаправляем на URL поиска
                        window.location.href = finalUrl;
                    } else {
                        // Если категории не выбраны, отправляем оригинальную форму
                        formElement.submit();
                    }
                    break;
            }
        });
    }

    // Функция для создания панели инструментов категорий
    function createCategoryToolbar(selectElement, optgroups, optgroupMap) {
        const toolbarContainer = document.createElement('div');
        toolbarContainer.id = 'category-toolbar';
        toolbarContainer.style.marginBottom = '5px';

        // Добавляем кнопку для управления видимостью категорий
        const manageCategoriesButton = document.createElement('button');
        manageCategoriesButton.type = 'button';
        manageCategoriesButton.textContent = 'Управление категориями';
        manageCategoriesButton.title = 'Выбрать категории для отображения';
        manageCategoriesButton.style.marginRight = '5px';
        manageCategoriesButton.style.padding = '2px 8px';

        // Добавляем кнопку в контейнер
        toolbarContainer.appendChild(manageCategoriesButton);

        // Вставляем контейнер перед селектом
        selectElement.parentNode.insertBefore(toolbarContainer, selectElement);

        // Создаем модальное окно и управление категориями
        createCategoriesModal(selectElement, optgroups, optgroupMap, manageCategoriesButton);
    }

    // Функция для создания модального окна управления категориями
    function createCategoriesModal(selectElement, optgroups, optgroupMap, manageCategoriesButton) {
        // Создаем модальное окно для управления категориями
        const modal = document.createElement('div');
        modal.id = 'categories-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '9999';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.margin = '10% auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
        modalContent.style.width = '80%';
        modalContent.style.maxWidth = '600px';
        modalContent.style.maxHeight = '70vh';
        modalContent.style.overflow = 'auto';
        modalContent.style.position = 'relative';

        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '15px';
        closeButton.style.fontSize = '24px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Управление видимостью категорий';
        modalTitle.style.marginTop = '0';

        // Создаем контейнер
        const categoryList = document.createElement('div');
        categoryList.id = 'category-list';
        categoryList.style.marginTop = '15px';
        categoryList.style.maxHeight = '50vh';
        categoryList.style.overflow = 'auto';

        // Добавляем раздел для бэкапа/восстановления
        const backupRestoreSection = document.createElement('div');
        backupRestoreSection.style.marginTop = '15px';
        backupRestoreSection.style.paddingTop = '10px';
        backupRestoreSection.style.borderTop = '1px solid #ddd';

        const backupTitle = document.createElement('h4');
        backupTitle.textContent = 'Резервное копирование настроек';
        backupTitle.style.margin = '0 0 10px 0';

        // Создаем кнопки для бэкапа/восстановления
        const backupButton = document.createElement('button');
        backupButton.textContent = 'Создать бэкап';
        backupButton.style.padding = '3px 10px';
        backupButton.style.marginRight = '10px';
        backupButton.onclick = function() {
            createBackup(selectElement);
        };

        const restoreButton = document.createElement('button');
        restoreButton.textContent = 'Восстановить из бэкапа';
        restoreButton.style.padding = '3px 10px';
        restoreButton.onclick = function() {
            restoreFromBackup(selectElement, categoryList);
            modal.style.display = 'none';
        };

        // Добавляем кнопки бэкапа в раздел
        backupRestoreSection.appendChild(backupTitle);
        backupRestoreSection.appendChild(backupButton);
        backupRestoreSection.appendChild(restoreButton);

        // Контейнер для кнопок действий
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '15px';
        buttonContainer.style.textAlign = 'right';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить';
        saveButton.style.padding = '5px 15px';
        saveButton.style.marginLeft = '10px';

        const showAllButton = document.createElement('button');
        showAllButton.textContent = 'Показать все';
        showAllButton.style.padding = '5px 15px';

        const hideAllButton = document.createElement('button');
        hideAllButton.textContent = 'Скрыть все';
        hideAllButton.style.padding = '5px 15px';
        hideAllButton.style.marginRight = '10px';

        buttonContainer.appendChild(hideAllButton);
        buttonContainer.appendChild(showAllButton);
        buttonContainer.appendChild(saveButton);

        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(categoryList);
        modalContent.appendChild(backupRestoreSection); // Добавляем раздел бэкапа
        modalContent.appendChild(buttonContainer);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Добавляем дополнительные настройки после списка категорий
        const additionalSettings = document.createElement('div');
        additionalSettings.style.marginTop = '15px';
        additionalSettings.style.paddingTop = '10px';
        additionalSettings.style.borderTop = '1px solid #ddd';

        const additionalTitle = document.createElement('h4');
        additionalTitle.textContent = 'Дополнительные настройки';
        additionalTitle.style.margin = '0 0 10px 0';

        additionalSettings.appendChild(additionalTitle);

        // Загружаем сохраненные настройки
        const settingsKey = `categorySettings_${currentHostname}`;
        const savedSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');

        // Получаем настройки UI для текущего сайта
        const uiSettings = currentSite.createUiSettings ? currentSite.createUiSettings() : [
            {
                id: 'move-hidden-results',
                label: 'Перемещать результаты скрытых категорий под спойлер',
                type: 'checkbox',
                default: true
            },
            {
                id: 'exclude-hidden-categories-from-search',
                label: 'Исключать при поиске скрытые категории в селекторе выбора разделов',
                type: 'checkbox',
                default: true
            },
            {
                id: 'keep-hidden-categories-visible',
                label: 'Оставлять скрытые категории видимыми в селекторе выбора разделов',
                type: 'checkbox',
                default: false
            },
            {
                id: 'disable-auto-subcategories',
                label: 'Отключить автоматический выбор дочерних категорий',
                type: 'checkbox',
                default: false
            }
        ];

        // Создаем элементы управления для каждой настройки
        const checkboxes = {}; //  Сохраняем чекбоксы

        uiSettings.forEach(setting => {
            const settingContainer = document.createElement('div');
            settingContainer.style.marginBottom = '8px';

            if (setting.type === 'checkbox') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = setting.id;

                // Устанавливаем сохраненное значение или значение по умолчанию
                checkbox.checked = savedSettings[setting.id] !== undefined ?
                    savedSettings[setting.id] : setting.default;

                const label = document.createElement('label');
                label.htmlFor = setting.id;
                label.textContent = setting.label;
                label.style.marginLeft = '5px';
                label.style.cursor = 'pointer';

                // Сохраняем ссылку на чекбокс в объекте
                checkboxes[setting.id] = checkbox;

                settingContainer.appendChild(checkbox);
                settingContainer.appendChild(label);
            }

            additionalSettings.appendChild(settingContainer);
        });

        // Добавляем взаимное исключение между двумя настройками чекбоксов
        if (checkboxes['keep-hidden-categories-visible'] && checkboxes['exclude-hidden-categories-from-search']) {
            checkboxes['keep-hidden-categories-visible'].addEventListener('change', function() {
                if (this.checked) {
                    // Если включили "Оставлять видимыми в селекторе", отключаем "Исключать при поиске в селекторе"
                    checkboxes['exclude-hidden-categories-from-search'].checked = false;
                }
            });

            checkboxes['exclude-hidden-categories-from-search'].addEventListener('change', function() {
                if (this.checked) {
                    // Если включили "Исключать при поиске в селекторе", отключаем "Оставлять видимыми в селекторе"
                    checkboxes['keep-hidden-categories-visible'].checked = false;
                }
            });
        }

        // Вставляем настройки перед разделом бэкапа
        modalContent.insertBefore(additionalSettings, backupRestoreSection);

        // Настраиваем функциональность модального окна
        setupModalFunctionality(modal, manageCategoriesButton, categoryList, saveButton,
                              showAllButton, hideAllButton, selectElement, optgroups, optgroupMap);
    }

    // Функция для создания бэкапа настроек видимости
    function createBackup(selectElement) {
        const storageKey = `hiddenCategories_${currentHostname}`;
        const hiddenCategoriesJSON = localStorage.getItem(storageKey) || '[]';

        // Добавляем информацию о дате и сайте в бэкап
        const backupData = {
            timestamp: new Date().toISOString(),
            site: currentHostname,
            hiddenCategories: JSON.parse(hiddenCategoriesJSON)
        };

        // Конвертируем в JSON строку
        const backupJSON = JSON.stringify(backupData, null, 2);

        // Создаем имя файла с датой и временем
        const now = new Date();
        const dateStr = now.toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const filename = `categories_backup_${currentHostname}_${dateStr}.json`;

        // Создаем ссылку для скачивания
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([backupJSON], {type: 'application/json'}));
        downloadLink.download = filename;

        // Эмулируем клик для запуска скачивания
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        showMessage('Бэкап настроек категорий успешно создан!');
    }

    // Функция для восстановления из бэкапа
    function restoreFromBackup(selectElement, categoryList) {
        // Создаем скрытый input для загрузки файла
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function(e) {
            if (!e.target.files.length) return;

            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                try {
                    const backupData = JSON.parse(event.target.result);

                    // Проверяем формат бэкапа
                    if (!backupData.hiddenCategories || !Array.isArray(backupData.hiddenCategories)) {
                        throw new Error('Неверный формат файла бэкапа');
                    }

                    // Проверяем, подходит ли бэкап для текущего сайта
                    if (backupData.site && backupData.site !== currentHostname) {
                        const confirmRestore = confirm(
                            `Внимание! Этот бэкап создан для сайта ${backupData.site}, а вы сейчас на ${currentHostname}.\n\n` +
                            `Все равно восстановить настройки?`
                        );
                        if (!confirmRestore) return;
                    }

                    // Сохраняем восстановленные данные
                    const storageKey = `hiddenCategories_${currentHostname}`;
                    localStorage.setItem(storageKey, JSON.stringify(backupData.hiddenCategories));

                    // Применяем восстановленные настройки
                    applyHiddenCategories(selectElement);

                    showMessage('Настройки категорий успешно восстановлены!');

                    // Перезагружаем страницу для корректного применения настроек
                    setTimeout(() => window.location.reload(), 2000);
                } catch (error) {
                    console.error('[Category Enhancer] Ошибка восстановления из бэкапа:', error);
                    showMessage('Ошибка при восстановлении настроек. Проверьте файл бэкапа.', true);
                }
            };

            reader.readAsText(file);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    // Функция для обновления чекбоксов в модальном окне согласно текущим настройкам видимости
    function updateModalCheckboxes(categoryList) {
        const storageKey = `hiddenCategories_${currentHostname}`;
        const hiddenCategoriesJSON = localStorage.getItem(storageKey) || '[]';
        const hiddenCategories = JSON.parse(hiddenCategoriesJSON);

        // Создаем множество ID скрытых категорий для быстрого поиска
        const hiddenCategoryIds = new Set();
        hiddenCategories.forEach(cat => {
            hiddenCategoryIds.add(cat.id);
        });

        // Обновляем состояние чекбоксов категорий
        categoryList.querySelectorAll('input[data-category-id]').forEach(checkbox => {
            const categoryId = checkbox.dataset.categoryId;
            // Если категория в списке скрытых, снимаем флажок
            checkbox.checked = !hiddenCategoryIds.has(categoryId);
        });

        // Обновляем состояние чекбоксов групп
        categoryList.querySelectorAll('input[data-optgroup-id]').forEach(checkbox => {
            const optgroupId = checkbox.dataset.optgroupId;
            // Если группа в списке скрытых, снимаем флажок
            const isHidden = hiddenCategories.some(cat =>
                cat.type === 'optgroup' && cat.id === optgroupId
            );
            checkbox.checked = !isHidden;
        });
    }

    // Функция для настройки функциональности модального окна
    function setupModalFunctionality(modal, manageCategoriesButton, categoryList, saveButton,
                                  showAllButton, hideAllButton, selectElement, optgroups, optgroupMap) {
        // Функция для открытия модального окна
        manageCategoriesButton.addEventListener('click', function() {
            // Очищаем список категорий
            categoryList.innerHTML = '';

            // Создаем дерево категорий
            const tree = document.createElement('div');

            // Проходим по всем optgroup и добавляем их как отдельные элементы
            optgroups.forEach((optgroup, index) => {
                const optgroupLabel = optgroup.label || optgroup.getAttribute('label') || `Группа ${index+1}`;
                const optgroupId = `optgroup-${index}`;

                // Находим селектор [ВСЕ] для этой группы, если он существует
                let groupSelectorOption = null;
                let groupSelectorId = null;

                const options = optgroup.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value.startsWith('group-')) {
                        groupSelectorOption = option;
                        groupSelectorId = option.value;
                    }
                });

                // Создаем элемент для заголовка группы
                const groupRow = createGroupRow(optgroup, index, groupSelectorOption,
                                             groupSelectorId, optgroupId, categoryList);
                tree.appendChild(groupRow);

                // Обрабатываем все опции внутри группы, кроме селектора [ВСЕ]
                const filteredOptions = groupSelectorId ?
                    Array.from(options).filter(opt => opt.value !== groupSelectorId) :
                    options;

                filteredOptions.forEach(option => {
                    // Добавляем все оставшиеся опции как подкатегории (уровень 1)
                    addCategoryToList(option, tree, 1, categoryList, groupSelectorId);
                });
            });

            // Добавляем дерево категорий в список
            categoryList.appendChild(tree);

            // Обновляем состояние чекбоксов согласно сохраненным настройкам
            updateModalCheckboxes(categoryList);

            // Показываем модальное окно
            modal.style.display = 'block';
        });

        // Обработчик клика на "Скрыть все"
        hideAllButton.addEventListener('click', function() {
            toggleAllCheckboxes(categoryList, false);
        });

        // Обработчик клика на "Показать все"
        showAllButton.addEventListener('click', function() {
            toggleAllCheckboxes(categoryList, true);
        });

        // Обработчик клика на "Сохранить"
        saveButton.addEventListener('click', function() {
            saveVisibilitySettings(categoryList, selectElement);
            modal.style.display = 'none';
        });

        // Закрытие модального окна при клике вне его содержимого
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Применяем сохраненные настройки видимости
        applyHiddenCategories(selectElement);
    }

    // Функция для создания строки группы в модальном окне
    function createGroupRow(optgroup, index, groupSelectorOption, groupSelectorId, optgroupId, categoryList) {
        // Создаем элемент для заголовка группы
        const groupRow = document.createElement('div');
        groupRow.style.padding = '6px 0 3px 0';
        groupRow.style.marginTop = (index > 0) ? '10px' : '0';
        groupRow.style.borderTop = (index > 0) ? '1px solid #ddd' : 'none';
        groupRow.style.display = 'flex';
        groupRow.style.alignItems = 'center';

        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.dataset.optgroupId = optgroupId;
        if (groupSelectorId) {
            groupCheckbox.dataset.groupSelectorId = groupSelectorId;
            groupCheckbox.dataset.categoryId = groupSelectorId; // Атрибут для связи с подкатегориями
        }
        groupCheckbox.dataset.index = index;
        groupCheckbox.style.marginRight = '5px';

        // Определяем, видна ли группа (проверяем по optgroup)
        const isOptgroupVisible = optgroup.style.display !== 'none';

        // Проверяем, виден ли селектор [ВСЕ]
        const isAllSelectorVisible = groupSelectorOption ?
            groupSelectorOption.style.display !== 'none' : true;

        // Группа видна, если видны и optgroup, и селектор [ВСЕ]
        groupCheckbox.checked = isOptgroupVisible && isAllSelectorVisible;

        const groupLabel = document.createElement('label');

        // Используем оригинальный текст селектора [ВСЕ], если он есть
        const labelText = groupSelectorOption ?
            groupSelectorOption.textContent :
            `${optgroup.label || ''.replace('&nbsp;', '').trim()} (Группа целиком)`;

        groupLabel.textContent = labelText;
        groupLabel.style.cursor = 'pointer';
        groupLabel.style.userSelect = 'none';
        groupLabel.style.fontWeight = 'bold';
        groupLabel.style.fontSize = '14px';
        groupLabel.style.color = '#0066cc';

        // Обработчик для переключения видимости всей группы
        groupCheckbox.addEventListener('change', function() {
            // Находим все опции в этой группе
            const options = optgroup.querySelectorAll('option');

            // Если есть селектор [ВСЕ], исключаем его из списка обычных категорий
            const regularOptions = groupSelectorId ?
                Array.from(options).filter(opt => opt.value !== groupSelectorId) :
                options;

            // Обновляем состояние всех чекбоксов для этой группы
            regularOptions.forEach(option => {
                const categoryId = option.value;
                if (categoryId && categoryId !== '-1' && categoryId !== '') {
                    const checkbox = categoryList.querySelector(`input[data-category-id="${categoryId}"]`);
                    if (checkbox) {
                        checkbox.checked = groupCheckbox.checked;

                        // Если это другой селектор группы, симулируем событие change
                        if (categoryId.startsWith('group-') && categoryId !== groupSelectorId) {
                            const event = new Event('change');
                            checkbox.dispatchEvent(event);
                        }
                    }
                }
            });
        });

        groupLabel.addEventListener('click', function() {
            groupCheckbox.checked = !groupCheckbox.checked;
            const event = new Event('change');
            groupCheckbox.dispatchEvent(event);
        });

        groupRow.appendChild(groupCheckbox);
        groupRow.appendChild(groupLabel);

        return groupRow;
    }

    // Функция для добавления категории в список модального окна
    function addCategoryToList(option, tree, level = 0, categoryList, parentGroupId = null) {
        if (!option) return;

        const categoryId = option.value;
        // Пропускаем пустые или специальные опции
        if (categoryId === '' || categoryId === '-1') return;

        const isVisible = option.style.display !== 'none';

        const row = document.createElement('div');
        row.style.padding = '3px 0';
        row.style.marginLeft = (level * 20) + 'px';
        row.style.display = 'flex';
        row.style.alignItems = 'center';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isVisible;
        checkbox.dataset.categoryId = categoryId;
        checkbox.style.marginRight = '5px';

        // Если это подкатегория и нам передан ID родительской группы
        if (parentGroupId && !categoryId.startsWith('group-')) {
            checkbox.dataset.parentGroup = parentGroupId;

            // Добавляем обработчик для автоматического включения родительской группы
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    // Находим чекбокс группы [ВСЕ]
                    const groupCheckbox = categoryList.querySelector(`input[data-category-id="${parentGroupId}"]`);
                    if (groupCheckbox && !groupCheckbox.checked) {
                        // console.log(`[Category Enhancer] Автоматически включаем группу ${parentGroupId} для категории ${categoryId}`);
                        groupCheckbox.checked = true;
                    }
                }
            });
        }

        const label = document.createElement('label');
        label.textContent = option.textContent;
        label.style.cursor = 'pointer';
        label.style.userSelect = 'none';
        label.style.width = '100%';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';
        label.style.whiteSpace = 'nowrap';

        // Подсветка группы
        if (categoryId.startsWith('group-')) {
            label.style.fontWeight = 'bold';
            label.style.color = '#0066cc';

            // Добавляем обработчик для групповых чекбоксов
            checkbox.addEventListener('change', function() {
                const groupId = categoryId;
                // Выбираем все чекбоксы подкатегорий в этой группе
                if (optgroupMap[groupId]) {
                    optgroupMap[groupId].forEach(subId => {
                        const subCheckbox = categoryList.querySelector(`input[data-category-id="${subId}"]`);
                        if (subCheckbox) {
                            subCheckbox.checked = checkbox.checked;
                        }
                    });
                }
            });
        }

        label.addEventListener('click', function() {
            checkbox.checked = !checkbox.checked;

            // Вызываем событие change вручную
            const event = new Event('change');
            checkbox.dispatchEvent(event);
        });

        row.appendChild(checkbox);
        row.appendChild(label);
        tree.appendChild(row);
    }

    // Функция для переключения всех чекбоксов в модальном окне
    function toggleAllCheckboxes(categoryList, state) {
        const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = state;

            // Если это группа, симулируем событие change для обновления подкатегорий
            if (checkbox.dataset.categoryId && checkbox.dataset.categoryId.startsWith('group-')) {
                const event = new Event('change');
                checkbox.dispatchEvent(event);
            }
        });
    }

    // Функция для сохранения настроек видимости категорий
    function saveVisibilitySettings(categoryList, selectElement) {
        const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]');
        const hiddenCategories = [];

        // Обрабатываем группы категорий (optgroup) в первую очередь
        const optgroupCheckboxes = categoryList.querySelectorAll('input[data-optgroup-id]');
        optgroupCheckboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                const index = checkbox.dataset.index;
                const optgroup = selectElement.querySelectorAll('optgroup')[index];

                if (optgroup) {
                    // Добавляем информацию о скрытой группе
                    hiddenCategories.push({
                        id: checkbox.dataset.optgroupId,
                        name: optgroup.label || `Группа ${index}`,
                        type: 'optgroup',
                        index: index
                    });

                    // Если у группы есть селектор [ВСЕ], добавляем и его тоже
                    if (checkbox.dataset.groupSelectorId) {
                        const groupSelectorId = checkbox.dataset.groupSelectorId;
                        const selectorOption = selectElement.querySelector(`option[value="${groupSelectorId}"]`);
                        if (selectorOption) {
                            hiddenCategories.push({
                                id: groupSelectorId,
                                name: selectorOption.textContent
                            });
                        }
                    }

                    // Добавляем все опции внутри группы
                    const groupOptions = optgroup.querySelectorAll('option');
                    groupOptions.forEach(option => {
                        const categoryId = option.value;
                        // Пропускаем пустые значения и селектор [ВСЕ]
                        if (categoryId && categoryId !== '-1' && categoryId !== '' &&
                            (!checkbox.dataset.groupSelectorId || categoryId !== checkbox.dataset.groupSelectorId)) {
                            hiddenCategories.push({
                                id: categoryId,
                                name: option.textContent,
                                parentGroup: checkbox.dataset.optgroupId
                            });
                        }
                    });
                }
            }
        });

        // Обрабатываем обычные категории
        checkboxes.forEach(checkbox => {
            if (checkbox.dataset.categoryId) {
                const categoryId = checkbox.dataset.categoryId;
                const option = selectElement.querySelector(`option[value="${categoryId}"]`);

                if (option && !checkbox.checked) {
                    // Проверяем, не скрыта ли уже категория как часть скрытой группы
                    const isInHiddenGroup = hiddenCategories.some(
                        cat => cat.id === categoryId && cat.parentGroup
                    );

                    if (!isInHiddenGroup) {
                        // Добавляем категорию только если она ещё не добавлена как часть группы
                        hiddenCategories.push({
                            id: categoryId,
                            name: option.textContent
                        });
                    }
                }
            }
        });

        // Сохраняем дополнительные настройки
        const settingsKey = `categorySettings_${currentHostname}`;
        const settings = {};

        // Получаем настройки UI для текущего сайта
        const uiSettings = currentSite.createUiSettings ? currentSite.createUiSettings() : [
            { id: 'move-hidden-results', default: true },
            { id: 'exclude-hidden-categories-from-search', default: true },
            { id: 'keep-hidden-categories-visible', default: false },
            { id: 'disable-auto-subcategories', default: false }
        ];

        // Собираем значения всех настроек
        uiSettings.forEach(setting => {
            const element = document.getElementById(setting.id);
            if (element) {
                settings[setting.id] = element.checked;
            }
        });

        // Сохраняем список скрытых категорий в localStorage
        const storageKey = `hiddenCategories_${currentHostname}`;
        localStorage.setItem(storageKey, JSON.stringify(hiddenCategories));

        // Выводим в консоль для диагностики
        console.log(`[Category Enhancer] Сохранено ${hiddenCategories.length} скрытых категорий:`, hiddenCategories);
        console.log(`[Category Enhancer] Сохранены настройки:`, settings);

        // Сохраняем дополнительные настройки отдельно
        localStorage.setItem(settingsKey, JSON.stringify(settings));

        // Показываем сообщение пользователю
        showMessage('Настройки категорий сохранены!');

        // Применяем настройки
        applyHiddenCategories(selectElement);

        // Применяем настройки к результатам поиска, если опция включена
        if (settings['move-hidden-results']) {
            processSearchResults();
        }
    }

    // Функция для обновления состояния опций в соответствии с сохраненными настройками
    function applyHiddenCategories(selectElement) {
        // Проверяем флаг, чтобы избежать повторного применения во время выполнения
        if (isApplyingSettings) return;

        isApplyingSettings = true;

        const storageKey = `hiddenCategories_${currentHostname}`;
        const hiddenCategoriesJSON = localStorage.getItem(storageKey) || '[]';
        const hiddenCategories = JSON.parse(hiddenCategoriesJSON);

        // Получаем настройки
        const settingsKey = `categorySettings_${currentHostname}`;
        const savedSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');

        // Проверяем опцию сохранения видимости категорий
        const keepHiddenVisible = savedSettings['keep-hidden-categories-visible'] !== undefined ?
            savedSettings['keep-hidden-categories-visible'] : false;

        // console.log(`[Category Enhancer] Применяем настройки видимости. Сохранять категории видимыми: ${keepHiddenVisible}`);

        // Если опция включена, не скрываем категории в селекторе
        if (keepHiddenVisible) {
            // Удаляем существующие стили скрытия, если они есть
            let styleElem = document.getElementById('category-enhancer-styles');
            if (styleElem) {
                styleElem.textContent = '';
            }
            // console.log('[Category Enhancer] Категории в селекторе оставлены видимыми');

            setTimeout(() => { isApplyingSettings = false; }, 10);
            return;
        }

        // console.log(`[Category Enhancer] Применяем настройки видимости: ${hiddenCategoriesJSON}`);

        // Создаем таблицу стилей для скрытия элементов
        let styleElem = document.getElementById('category-enhancer-styles');
        if (!styleElem) {
            styleElem = document.createElement('style');
            styleElem.id = 'category-enhancer-styles';
            document.head.appendChild(styleElem);
        }

        // Создаем CSS-селекторы для скрытия элементов
        const selectors = [];

        // Создаем множество для отслеживания уже скрытых групп
        const hiddenGroups = new Set();

        // Сначала скрываем группы
        hiddenCategories.forEach(cat => {
            if (cat.type === 'optgroup') {
                const index = cat.index;
                selectors.push(`#${selectElement.id} optgroup:nth-of-type(${parseInt(index) + 1})`);
                hiddenGroups.add(cat.id);
            }
        });

        // Затем скрываем индивидуальные категории
        hiddenCategories.forEach(cat => {
            if (cat.type !== 'optgroup') {
                // Если у категории есть родительская группа, проверяем, скрыта ли уже эта группа
                if (cat.parentGroup && hiddenGroups.has(cat.parentGroup)) {
                    // Группа уже скрыта, отдельно скрывать категорию не нужно
                    return;
                }

                // Если это обычная категория, скрываем только её
                selectors.push(`#${selectElement.id} option[value="${cat.id}"]`);
            }
        });

        // Создаем CSS-правило
        if (selectors.length > 0) {
            const cssRule = `${selectors.join(', ')} { display: none !important; }`;
            styleElem.textContent = cssRule;
            // console.log(`[Category Enhancer] Применено CSS-правило: ${cssRule}`);
        } else {
            styleElem.textContent = '';
        }

        // По завершении работы сбрасываем флаг
        setTimeout(() => {
            isApplyingSettings = false;
        }, 10);
    }

    // Функция для отображения сообщения пользователю
    function showMessage(message, isError = false) {
        const messageElem = document.createElement('div');
        messageElem.textContent = message;
        messageElem.style.position = 'fixed';
        messageElem.style.top = '10px';
        messageElem.style.left = '50%';
        messageElem.style.transform = 'translateX(-50%)';
        messageElem.style.backgroundColor = isError ? '#F44336' : '#4CAF50';
        messageElem.style.color = 'white';
        messageElem.style.padding = '10px 20px';
        messageElem.style.borderRadius = '4px';
        messageElem.style.zIndex = '10000';

        document.body.appendChild(messageElem);

        setTimeout(function() {
            messageElem.style.opacity = '0';
            messageElem.style.transition = 'opacity 0.5s';
            setTimeout(function() {
                document.body.removeChild(messageElem);
            }, 500);
        }, 2000);
    }

    // Функция для добавления визуальных индикаторов на страницу
    function addVisualIndicators(selectors) {
        const legendElement = document.querySelector(selectors.legendSelector);
        if (legendElement) {
            const scriptStatus = document.createElement('span');
            scriptStatus.textContent = ` ${currentSite.ui.scriptStatus}`;
            scriptStatus.style.color = '#008800';
            scriptStatus.style.fontSize = '0.9em';
            legendElement.appendChild(scriptStatus);

            // Добавляем справочный текст
            // const helpText = document.createElement('div');
            // helpText.innerHTML = `<small style="color:#555; margin-top:5px; display:block;">
                // ${currentSite.ui.helpText}
            // </small>`;
            // legendElement.parentNode.insertBefore(helpText, legendElement.nextSibling);
        }
    }

    // Функция для применения настроек при каждой загрузке страницы
    function setupAutoApply(selectElement) {
        // Применяем настройки видимости сразу при загрузке скрипта
        applyHiddenCategories(selectElement);

        // Проверяем, нужно ли обрабатывать результаты поиска
        const settingsKey = `categorySettings_${currentHostname}`;
        const savedSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');

        // Функция, которая выполняет обработку результатов с повторными попытками
        function tryProcessSearchResults() {
            if (savedSettings['move-hidden-results']) {
                processSearchResults();
            }
        }

        // Обрабатываем результаты поиска сразу
        tryProcessSearchResults();

        // После загрузки страницы обрабатываем результаты поиска еще раз
        window.addEventListener('load', function() {
            // console.log('[Category Enhancer] Страница загружена, повторяем обработку результатов');
            tryProcessSearchResults();
        });

        // Наблюдаем за изменениями в DOM для повторного применения настроек
        const observer = new MutationObserver(function(mutations) {
            // Проверяем, касаются ли мутации результатов поиска
            const shouldProcessResults = mutations.some(mutation => {
                return mutation.type === 'childList' &&
                       Array.from(mutation.addedNodes).some(node => {
                           if (node.nodeType !== Node.ELEMENT_NODE) return false;
                           return node.classList &&
                                 (node.classList.contains('tCenter') ||
                                  node.querySelector && node.querySelector(currentSite.selectors.categoryLink));
                       });
            });

            // Если затронуты результаты поиска и включена настройка
            if (shouldProcessResults && savedSettings['move-hidden-results']) {
                // console.log('[Category Enhancer] Обнаружены изменения в результатах поиска, повторяем обработку');
                setTimeout(processSearchResults, 100);
            }

            // Проверяем характер изменений, чтобы избежать лишних вызовов
            const shouldApplyCategories = mutations.some(mutation => {
                // Проверяем, относятся ли изменения к селектору категорий
                return mutation.type === 'childList' &&
                       Array.from(mutation.addedNodes).some(node =>
                           node.nodeName === 'OPTION' || node.nodeName === 'OPTGROUP'
                       );
            });

            if (shouldApplyCategories && !isApplyingSettings) {
                applyHiddenCategories(selectElement);
            }
        });

        // Наблюдаем за изменениями в документе для всех возможных случаев
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Запускаем инициализацию скрипта когда страница загружена
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();