// ==UserScript==
// @name         HeroesWM Logs Loader
// @namespace    http://tampermonkey.net/
// @version      2.44
// @description  Automatically load multiple pages of battle log, transfers, clan log, and warehouse log
// @author       Any Key Fake Leader
// @license MIT
// @match        https://www.heroeswm.ru/pl_warlog.php*
// @match        https://www.heroeswm.ru/pl_transfers.php*
// @match        https://www.heroeswm.ru/clan_log.php*
// @match        https://www.heroeswm.ru/sklad_log.php*
// @match        https://mirror.heroeswm.ru/pl_warlog.php*
// @match        https://mirror.heroeswm.ru/pl_transfers.php*
// @match        https://mirror.heroeswm.ru/clan_log.php*
// @match        https://mirror.heroeswm.ru/sklad_log.php*
// @match        https://my.lordswm.com/pl_warlog.php*
// @match        https://my.lordswm.com/pl_transfers.php*
// @match        https://my.lordswm.com/clan_log.php*
// @match        https://my.lordswm.com/sklad_log.php*
// @match        https://www.lordswm.com/pl_warlog.php*
// @match        https://www.lordswm.com/pl_transfers.php*
// @match        https://www.lordswm.com/clan_log.php*
// @match        https://www.lordswm.com/sklad_log.php*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/545218/HeroesWM%20Logs%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/545218/HeroesWM%20Logs%20Loader.meta.js
// ==/UserScript==


(function() {
    'use strict';

// Словарь категорий боёв по подкатегориям
const BATTLE_CATEGORIES = {
    'Гильдии': {
        '0': 'Охотников',
        '40': 'Тактиков',
        '66': 'Воров (мобы)',
        '26': 'Воров (игроки)',
        '61': 'Рейнджеров',
        '95': 'Стражей',
        '127': 'Лидеров',
        '135': 'Опасные бандиты',
        '145': 'КСЗС',
        '110': 'Искателей',
        '63': 'Рейнджер-наставник'
    },
    'Наёмники': {
        '8': 'Набеги',
        '5': 'Захватчики',
        '12': 'Армии',
        '7': 'Монстры',
        '28': 'Заговорщики',
        '29': 'Разбойники',
        '10': 'Отряды'
    },
    'Ивенты': {
        '94': 'Портал (парный и старый одиночный)',
        '96': 'Пиратская блокада',
        '99': 'Поиск сокровищ',
        '115': 'Охота на пиратов (парная)',
        '119': 'Защита деревень',
        '120': 'Подземные пещеры',
        '123': 'Пиратские рейды',
        '133': 'Рисковая авантюра',
        '138': 'Экспедиция',
        '139': 'Гильдия Лидеров',
        '140': 'Сезон охоты',
        '142': 'Новый исход орды',
        '143': 'Контрабандисты (старое поле)',
        '144': 'Единство',
        '146': 'Распутье тайн',
        '147': 'Новогоднее дело',
        '148': 'Одиночный портал',
        '117': 'Поиск существ (портал)',
        '150': 'Контрабандисты (новое поле)',
        '151': 'Счёт наёмника',
        '152': 'Гробница'
    },
    'Сурвилурги': {
        '80': 'Защиты',
        '81': 'Захваты',
        '88': 'Перехваты'
    },
    'Турниры': {
        '14': 'Малый турнир',
        '134': 'Парный турнир',
        '113': 'Великое состязание',
        '137': 'Гильдии Лидеров',
        '141': 'На выживание',
        '68': 'Быстрый турнир',
        '37': 'Смешанный турнир'
    },
    'Групповые бои': {
        '1': 'КСЗС (на 4)',
        '24': 'КСЗС (на 6)',
        '21': 'Командные (1х1, 2х2, 3х3)'
    },
    'Другое': {
        '104': 'Налоги',
        '89': 'КБО ПвП',
        '67': 'Нарушители границы',
        '126': 'Группа разбойников',
        '111': 'Армия холода',
        '44': 'Ночные кошмары',
        '51': 'Похитители валентинок'
    },
    'Неизвестное': {
        'unknown': 'Неизвестные типы боёв'
    }
};

// Хранилище для всех загруженных боёв
let allBattlesData = [];

// Определение типа страницы
function getPageType() {
    const path = window.location.pathname;
    if (path.includes('pl_warlog.php')) return 'warlog';
    if (path.includes('pl_transfers.php')) return 'transfers';
    if (path.includes('clan_log.php')) return 'clan_log';
    if (path.includes('sklad_log.php')) return 'sklad_log';
    return 'unknown';
}

// Получение ID из URL (универсальная функция)
function getEntityId() {
    const url = new URL(window.location.href);
    return url.searchParams.get('id');
}

// Получение номера текущей страницы
function getCurrentPage() {
    const url = new URL(window.location.href);
    const pageParam = url.searchParams.get('page');
    return pageParam ? parseInt(pageParam) : 0;
}

// Декодирование windows-1251 контента
function decodeWindows1251(buffer) {
    const decoder = new TextDecoder('windows-1251');
    return decoder.decode(buffer);
}

// Извлечение записей протокола с учетом HTML комментариев
function extractLogLines(html) {
    const lines = [];
    // Обновленный regex учитывает опциональные HTML комментарии перед &nbsp;&nbsp;
    const regex = /(<!--\d+-->)?&nbsp;&nbsp;.*?<BR>/gi;
    const matches = html.match(regex);
    if (matches) {
        lines.push(...matches);
    }
    return lines;
}

// Построение URL для загрузки страницы с сохранением всех параметров
function buildPageUrl(pageType, entityId, pageNum) {
    // Получаем текущий URL
    const currentUrl = new URL(window.location.href);

    // Создаем новый URL на основе текущего
    const newUrl = new URL(currentUrl);

    // Обновляем только параметр page
    newUrl.searchParams.set('page', pageNum.toString());

    // Убеждаемся что id установлен правильно (на случай если его нет в текущем URL)
    if (entityId) {
        newUrl.searchParams.set('id', entityId);
    }

    console.log(`Построен URL для страницы ${pageNum}:`, newUrl.toString());

    return newUrl.toString();
}

// Получение названия типа протокола для отображения
function getLogTypeName(pageType) {
    switch (pageType) {
        case 'warlog': return 'протокола боёв';
        case 'transfers': return 'протокола передач';
        case 'clan_log': return 'протокола клана';
        case 'sklad_log': return 'протокола склада';
        default: return 'протокола';
    }
}

// Обновленная функция создания интерфейса
function createStatusDisplay() {
    const container = document.querySelector('.global_container_block_header');
    if (!container) return;

    const pageCount = localStorage.getItem('hwm_page_count') || '25';
    const pageType = getPageType();
    const logTypeName = getLogTypeName(pageType);
    
    // Получаем сохранённое состояние свёрнутости контейнеров
    const containersCollapsed = localStorage.getItem('hwm_containers_collapsed') === 'true';

    // Контейнер статуса (сворачиваемый)
    const statusContainer = document.createElement('div');
    statusContainer.id = 'status-container';
    statusContainer.className = 'collapsible-container';
    
    // ИСПРАВЛЕНИЕ: Применяем инлайн-стили в зависимости от сохранённого состояния
    if (containersCollapsed) {
        statusContainer.classList.add('collapsed');
        // Устанавливаем свёрнутое состояние сразу
        statusContainer.style.cssText = 'margin: 0; text-align: center; background: #f0f0f0; padding: 0; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 10px; max-height: 0; opacity: 0;';
    } else {
        // Устанавливаем развёрнутое состояние
        statusContainer.style.cssText = 'margin: 10px 0; text-align: center; background: #f0f0f0; padding: 8px; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 10px;';
    }

    const textContainer = document.createElement('div');
    textContainer.style.cssText = 'display: flex; align-items: center;';

    const beforeText = document.createElement('span');
    beforeText.textContent = 'Скрипт отображает ';
    beforeText.style.cssText = 'font-weight: bold; color: #333; margin-right: 5px;';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'pageCount';
    input.min = '1';
    input.max = '100';
    input.value = pageCount;
    input.style.cssText = 'width: 60px; padding: 2px; text-align: center; margin-left: 5px; margin-right: 5px;';
    input.onchange = function() {
        localStorage.setItem('hwm_page_count', this.value);
    };

    const afterText = document.createElement('span');
    afterText.textContent = ' страниц';
    afterText.style.cssText = 'font-weight: bold; color: #333; margin-left: 5px;';

    const copyButton = document.createElement('button');
    copyButton.textContent = `Скопировать HTML код ${logTypeName}`;
    copyButton.style.cssText = 'padding: 4px 12px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
    copyButton.onclick = function() {
        copyLogHTML(copyButton, logTypeName);
    };

    // Кнопка "Запуск" для перезагрузки страниц
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Запуск';
    reloadButton.style.cssText = 'padding: 4px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; margin-left: 10px;';
    reloadButton.onclick = function() {
        allBattlesData = [];
        const logContainer = getLogContainer();
        if (logContainer) {
            logContainer.innerHTML = '';
        }
        loadPagesAutomatically(true);
    };

    textContainer.appendChild(beforeText);
    textContainer.appendChild(input);
    textContainer.appendChild(afterText);
    textContainer.appendChild(reloadButton);

    statusContainer.appendChild(textContainer);
    statusContainer.appendChild(copyButton);

    // Вставляем контейнер статуса
    container.parentNode.insertBefore(statusContainer, container.nextSibling);
    
    // Добавляем кнопку сворачивания в контейнер пагинации
    addToggleButtonToPagination(containersCollapsed);
}


// НОВАЯ функция для добавления кнопки в контейнер пагинации
function addToggleButtonToPagination(containersCollapsed) {
    // Находим контейнер пагинации
    const paginationContainer = document.querySelector('.hwm_pagination');
    if (!paginationContainer) {
        console.log('Контейнер пагинации не найден');
        return;
    }
    
    // Применяем flexbox к контейнеру пагинации
    paginationContainer.style.display = 'flex';
    paginationContainer.style.alignItems = 'center';
    paginationContainer.style.gap = '0px';
    paginationContainer.style.justifyContent = 'center';
    
    // Создаём кнопку сворачивания/разворачивания
    const toggleContainersBtn = document.createElement('button');
    toggleContainersBtn.textContent = containersCollapsed ? '▼' : '▲';
    toggleContainersBtn.className = 'toggle-collapse-btn';
    toggleContainersBtn.title = containersCollapsed ? 'Развернуть панели' : 'Свернуть панели';
    toggleContainersBtn.style.cssText = 'padding: 4px 10px; background: #9C27B0; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px; font-weight: bold; flex-shrink: 0;';
    toggleContainersBtn.onclick = function() {
        toggleContainers(this);
    };
    
    // Вставляем кнопку в начало контейнера пагинации (перед первой ссылкой)
    paginationContainer.prepend(toggleContainersBtn);
}

// Функция для обновления пагинации после загрузки страниц
// Функция для обновления пагинации после загрузки страниц
function updatePagination() {
    const pageCount = parseInt(localStorage.getItem('hwm_page_count') || '25');
    const K = pageCount; // Количество загруженных страниц (включая текущую)
    
    if (K <= 1) return; // Если загружена только текущая страница, ничего не делаем
    
    const paginationContainer = document.querySelector('.hwm_pagination');
    if (!paginationContainer) {
        console.log('Контейнер пагинации не найден');
        return;
    }
    
    // Находим активную ссылку
    const activeLink = paginationContainer.querySelector('a.active');
    if (!activeLink) {
        console.log('Активная ссылка не найдена');
        return;
    }
    
    // Массивы для хранения ссылок до и после активной
    const linksBefore = [];
    const linksAfter = [];
    let foundActive = false;
    
    // Проходим по всем ссылкам в пагинации
    const allLinks = paginationContainer.querySelectorAll('a');
    
    allLinks.forEach(link => {
        // Если это активная ссылка, отмечаем что нашли её
        if (link === activeLink) {
            foundActive = true;
            return; // Пропускаем активную ссылку
        }
        
        // Разделяем ссылки на "до" и "после"
        if (!foundActive) {
            linksBefore.push(link);
        } else {
            linksAfter.push(link);
        }
    });
    
    // Обрабатываем ссылки ДО активной (уменьшаем на K с проверкой на минимум)
    const seenDisplayNumbers = new Set(); // Для отслеживания дубликатов
    const linksToRemove = []; // Ссылки для удаления (дубликаты)
    
    linksBefore.forEach(link => {
        const href = link.getAttribute('href');
        
        // Проверяем, что это не ссылка на "#"
        if (href && href !== '#') {
            try {
                // Обрабатываем ссылку "<" отдельно
                if (link.classList.contains('pi') && link.textContent.trim() === '<') {
                    // Парсим URL
                    const url = new URL(href, window.location.origin);
                    const pageParam = url.searchParams.get('page');
                    
                    if (pageParam !== null) {
                        const oldPageNum = parseInt(pageParam);
                        // Уменьшаем на K-1, но не меньше 0
                        const newPageNum = Math.max(0, oldPageNum - (K - 1));
                        url.searchParams.set('page', newPageNum.toString());
                        link.setAttribute('href', url.pathname + url.search);
                    }
                    return; // Не проверяем на дубликаты для "<"
                }
                
                // Парсим URL для обычных ссылок
                const url = new URL(href, window.location.origin);
                const pageParam = url.searchParams.get('page');
                
                if (pageParam !== null) {
                    const oldPageNum = parseInt(pageParam);
                    // Уменьшаем на K-1, но не меньше 0
                    const newPageNum = Math.max(0, oldPageNum - (K - 1));
                    url.searchParams.set('page', newPageNum.toString());
                    
                    // Обновляем href
                    link.setAttribute('href', url.pathname + url.search);
                    
                    // Обновляем отображаемый номер (в 1-индексации)
                    const oldDisplayNum = parseInt(link.textContent);
                    if (!isNaN(oldDisplayNum)) {
                        // Уменьшаем на K-1, но не меньше 1
                        const newDisplayNum = Math.max(1, oldDisplayNum - (K - 1));
                        
                        // Проверяем на дубликаты
                        if (seenDisplayNumbers.has(newDisplayNum)) {
                            // Это дубликат, помечаем для удаления
                            linksToRemove.push(link);
                        } else {
                            // Уникальное значение, обновляем текст
                            link.textContent = newDisplayNum.toString();
                            seenDisplayNumbers.add(newDisplayNum);
                        }
                    }
                }
            } catch (e) {
                console.error('Ошибка при обновлении ссылки (до):', href, e);
            }
        }
    });
    
    // Удаляем дубликаты
    linksToRemove.forEach(link => {
        link.remove();
    });
    
    // Обрабатываем ссылки ПОСЛЕ активной (увеличиваем на K-1)
    linksAfter.forEach(link => {
        const href = link.getAttribute('href');
        
        // Проверяем, что это не ссылка на "#"
        if (href && href !== '#') {
            try {
                // Парсим URL
                const url = new URL(href, window.location.origin);
                const pageParam = url.searchParams.get('page');
                
                if (pageParam !== null) {
                    // Увеличиваем номер страницы
                    const oldPageNum = parseInt(pageParam);
                    const newPageNum = oldPageNum + (K - 1);
                    url.searchParams.set('page', newPageNum.toString());
                    
                    // Обновляем href
                    link.setAttribute('href', url.pathname + url.search);
                    
                    // Обновляем текст ссылки (если это не ссылка со знаком >)
                    if (!link.classList.contains('pi') && link.textContent.trim() !== '>') {
                        const oldDisplayNum = parseInt(link.textContent);
                        if (!isNaN(oldDisplayNum)) {
                            link.textContent = (oldDisplayNum + (K - 1)).toString();
                        }
                    }
                }
            } catch (e) {
                console.error('Ошибка при обновлении ссылки (после):', href, e);
            }
        }
    });
    
    console.log(`Пагинация обновлена: K=${K}, удалено дубликатов: ${linksToRemove.length}`);
}


// Функция для сворачивания/разворачивания обоих контейнеров одновременно
// Функция для сворачивания/разворачивания обоих контейнеров одновременно
function toggleContainers(button) {
    const statusContainer = document.getElementById('status-container');
    const filterContainer = document.getElementById('battle-filter-container');
    
    // Проверяем, что statusContainer существует
    if (!statusContainer) {
        console.error('Контейнер status-container не найден');
        return;
    }
    
    const isCurrentlyCollapsed = statusContainer.classList.contains('collapsed');
    
    if (isCurrentlyCollapsed) {
        // Разворачиваем
        statusContainer.classList.remove('collapsed');
        statusContainer.style.maxHeight = '';
        statusContainer.style.opacity = '';
        statusContainer.style.padding = '8px';
        statusContainer.style.margin = '10px 0';
        
        // Разворачиваем filterContainer только если он существует (только для warlog)
        if (filterContainer) {
            filterContainer.classList.remove('collapsed');
            filterContainer.style.maxHeight = '';
            filterContainer.style.opacity = '';
            filterContainer.style.padding = '12px';
            filterContainer.style.margin = '10px 0';
        }
        
        button.textContent = '▲';
        button.title = 'Свернуть панели';
        localStorage.setItem('hwm_containers_collapsed', 'false');
    } else {
        // Сворачиваем
        statusContainer.classList.add('collapsed');
        statusContainer.style.maxHeight = '0';
        statusContainer.style.opacity = '0';
        statusContainer.style.padding = '0';
        statusContainer.style.margin = '0';
        
        // Сворачиваем filterContainer только если он существует (только для warlog)
        if (filterContainer) {
            filterContainer.classList.add('collapsed');
            filterContainer.style.maxHeight = '0';
            filterContainer.style.opacity = '0';
            filterContainer.style.padding = '0';
            filterContainer.style.margin = '0';
        }
        
        button.textContent = '▼';
        button.title = 'Развернуть панели';
        localStorage.setItem('hwm_containers_collapsed', 'true');
    }
}



// Функция для сворачивания/разворачивания всех категорий
function toggleAllCategories(expand) {
    const toggles = document.querySelectorAll('.category-toggle');
    const contents = document.querySelectorAll('.subcategory-content');
    const newCollapseStates = {};
    
    // Устанавливаем состояние для всех категорий
    toggles.forEach(toggle => {
        if (expand) {
            toggle.classList.add('expanded');
        } else {
            toggle.classList.remove('expanded');
        }
    });
    
    contents.forEach(content => {
        const subcategoryBlock = content.closest('[data-category]');
        const subcategory = subcategoryBlock ? subcategoryBlock.dataset.category : null;
        
        if (expand) {
            content.classList.add('expanded');
            if (subcategory) {
                newCollapseStates[subcategory] = true;
            }
        } else {
            content.classList.remove('expanded');
            if (subcategory) {
                newCollapseStates[subcategory] = false;
            }
        }
    });
    
    // Сохраняем состояния
    localStorage.setItem('hwm_battle_filter_collapse', JSON.stringify(newCollapseStates));
}

// Функция создания интерфейса фильтрации боёв с сворачиваемыми подкатегориями
function createBattleFilterUI() {
    if (getPageType() !== 'warlog') return;
    
    // Получаем сохранённые настройки
    const savedPreferences = JSON.parse(localStorage.getItem('hwm_battle_filter') || '{}');
    
    // Получаем сохранённые состояния свёрнутости подкатегорий
    const savedCollapseStates = JSON.parse(localStorage.getItem('hwm_battle_filter_collapse') || '{}');
    
    // Получаем сохранённое состояние свёрнутости контейнеров
    const containersCollapsed = localStorage.getItem('hwm_containers_collapsed') === 'true';
    
    // Создаём контейнер
    const filterContainer = document.createElement('div');
    filterContainer.id = 'battle-filter-container';
    filterContainer.className = 'collapsible-container';

    // ИСПРАВЛЕНИЕ: Применяем инлайн-стили в зависимости от сохранённого состояния
    if (containersCollapsed) {
        filterContainer.classList.add('collapsed');
        // Устанавливаем свёрнутое состояние сразу
        filterContainer.style.cssText = 'margin: 0; background: #f0f0f0; padding: 0; border-radius: 4px; max-height: 0; opacity: 0;';
    } else {
        // Устанавливаем развёрнутое состояние
        filterContainer.style.cssText = 'margin: 10px 0; background: #f0f0f0; padding: 12px; border-radius: 4px;';
    }

    
    // Добавляем CSS для треугольников свёрнутости
    const style = document.createElement('style');
    style.textContent = `
        .category-toggle {
            display: inline-block;
            width: 0;
            height: 0;
            margin-right: 8px;
            border-left: 6px solid #666;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            transition: transform 0.3s;
            cursor: pointer;
        }
        .category-toggle.expanded {
            transform: rotate(90deg);
        }
        .subcategory-header {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }
        .subcategory-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .subcategory-content.expanded {
            max-height: 1000px; /* Достаточно большое значение для содержимого */
        }
    `;
    document.head.appendChild(style);
    
    const collapseStyle = document.createElement('style');
    collapseStyle.textContent = `
        .collapsible-container {
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out, padding 0.3s ease-out, margin 0.3s ease-out;
            overflow: hidden;
        }
        .collapsible-container.collapsed {
            max-height: 0 !important;
            opacity: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .toggle-collapse-btn:hover {
            background: #7B1FA2 !important;
            transform: scale(1.05);
        }
        .toggle-collapse-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(collapseStyle);



    
    // Заголовок и кнопки управления
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';
    
    const header = document.createElement('div');
    header.textContent = 'Фильтр боёв:';
    header.style.cssText = 'font-weight: bold; font-size: 14px;';
    
    const buttonsContainer = document.createElement('div');
    
    // Кнопки управления фильтром
    const expandAllBtn = document.createElement('button');
    expandAllBtn.textContent = 'Развернуть все';
    expandAllBtn.style.cssText = 'margin-right: 8px; padding: 4px 8px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;';
    expandAllBtn.onclick = () => toggleAllCategories(true);
    
    const collapseAllBtn = document.createElement('button');
    collapseAllBtn.textContent = 'Свернуть все';
    collapseAllBtn.style.cssText = 'margin-right: 8px; padding: 4px 8px; background: #607D8B; color: white; border: none; border-radius: 3px; cursor: pointer;';
    collapseAllBtn.onclick = () => toggleAllCategories(false);
    
    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Выбрать все';
    selectAllBtn.style.cssText = 'margin-right: 8px; padding: 4px 8px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;';
    selectAllBtn.onclick = selectAllCategories;
    
    const deselectAllBtn = document.createElement('button');
    deselectAllBtn.textContent = 'Отменить все';
    deselectAllBtn.style.cssText = 'padding: 4px 8px; background: #F44336; color: white; border: none; border-radius: 3px; cursor: pointer;';
    deselectAllBtn.onclick = deselectAllCategories;
    
    buttonsContainer.appendChild(expandAllBtn);
    buttonsContainer.appendChild(collapseAllBtn);
    buttonsContainer.appendChild(selectAllBtn);
    buttonsContainer.appendChild(deselectAllBtn);
    
    headerContainer.appendChild(header);
    headerContainer.appendChild(buttonsContainer);
    filterContainer.appendChild(headerContainer);
    
    // Контейнер для подкатегорий
    const categoriesContainer = document.createElement('div');
    categoriesContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 15px;';
    filterContainer.appendChild(categoriesContainer);
    
    // Создаём блоки для каждой подкатегории
    for (const [subcategory, categories] of Object.entries(BATTLE_CATEGORIES)) {
        const subcategoryBlock = document.createElement('div');
        subcategoryBlock.style.cssText = 'background: white; padding: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1; min-width: 200px;';
        subcategoryBlock.dataset.category = subcategory;
        
        // Заголовок подкатегории с треугольником
        const subcategoryHeader = document.createElement('div');
        subcategoryHeader.className = 'subcategory-header';

        // Добавляем треугольник для индикации свёрнутости
        const toggle = document.createElement('span');
        toggle.className = 'category-toggle';
        if (savedCollapseStates[subcategory]) {
            toggle.classList.add('expanded');
        }

        // Создаем чекбокс для выбора/снятия всех подкатегорий
        const toggleAllCheckbox = document.createElement('input');
        toggleAllCheckbox.type = 'checkbox';
        toggleAllCheckbox.className = 'toggle-all-subcategories';
        toggleAllCheckbox.dataset.category = subcategory;
        toggleAllCheckbox.style.marginRight = '5px';

        // Загружаем сохраненное состояние
        const savedToggleAllStates = JSON.parse(localStorage.getItem('hwm_battle_filter_toggle_all') || '{}');
        toggleAllCheckbox.checked = savedToggleAllStates[subcategory] !== false;

        // Добавляем обработчик события
        toggleAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            const subcategory = this.dataset.category;
            const preferences = JSON.parse(localStorage.getItem('hwm_battle_filter') || '{}');
            
            // Получаем все чекбоксы этой категории
            const checkboxes = document.querySelectorAll(`div[data-category="${subcategory}"] .subcategory-content input[type="checkbox"]`);
            
            // Обновляем все чекбоксы
            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                preferences[checkbox.dataset.category] = isChecked;
            });
            
            // Сохраняем состояние выбора всех
            const toggleAllStates = JSON.parse(localStorage.getItem('hwm_battle_filter_toggle_all') || '{}');
            toggleAllStates[subcategory] = isChecked;
            localStorage.setItem('hwm_battle_filter_toggle_all', JSON.stringify(toggleAllStates));
            
            // Сохраняем состояния фильтров
            localStorage.setItem('hwm_battle_filter', JSON.stringify(preferences));
            
            // Применяем фильтры
            filterBattles();
        });

        const titleText = document.createElement('span');
        titleText.textContent = subcategory;
        titleText.style.cssText = 'font-weight: bold; color: #444;';

        subcategoryHeader.appendChild(toggle);
        subcategoryHeader.appendChild(toggleAllCheckbox);
        subcategoryHeader.appendChild(titleText);
        subcategoryHeader.style.cssText = 'margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;';
        
        // Контейнер для содержимого подкатегории
        const contentContainer = document.createElement('div');
        contentContainer.className = 'subcategory-content';
        if (savedCollapseStates[subcategory]) {
            contentContainer.classList.add('expanded');
        }
        
        // Обработчик клика для сворачивания/разворачивания
        subcategoryHeader.addEventListener('click', function() {
            toggle.classList.toggle('expanded');
            contentContainer.classList.toggle('expanded');
            
            // Сохраняем состояние свёрнутости
            const newCollapseStates = JSON.parse(localStorage.getItem('hwm_battle_filter_collapse') || '{}');
            newCollapseStates[subcategory] = contentContainer.classList.contains('expanded');
            localStorage.setItem('hwm_battle_filter_collapse', JSON.stringify(newCollapseStates));
        });
        
        subcategoryBlock.appendChild(subcategoryHeader);
        subcategoryBlock.appendChild(contentContainer);
        
        // Чекбоксы для категорий
        for (const [categoryId, categoryName] of Object.entries(categories)) {
            const checkboxWrapper = document.createElement('label');
            checkboxWrapper.style.cssText = 'display: flex; align-items: center; margin: 5px 0;';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = categoryId;
            checkbox.dataset.category = categoryId;
            // Для категории "Неизвестное" проверяем значение по ключу 'unknown'
            if (subcategory === 'Неизвестное') {
                checkbox.checked = savedPreferences['unknown'] !== false;
            } else {
                checkbox.checked = savedPreferences[categoryId] !== false;
            }
            checkbox.addEventListener('change', updateCategoryPreference);
            
            const label = document.createElement('span');
            label.textContent = ' ' + categoryName;
            label.style.cssText = 'margin-left: 5px;';
            
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            contentContainer.appendChild(checkboxWrapper);
        }
        
        categoriesContainer.appendChild(subcategoryBlock);
    }
    
    // Счетчик отображаемых боёв
    const counterElem = document.createElement('div');
    counterElem.id = 'battleFilterCounter';
    counterElem.style.cssText = 'margin-top: 12px; font-style: italic; text-align: center;';
    counterElem.textContent = 'Загрузка...';
    filterContainer.appendChild(counterElem);
    
    // Добавляем фильтр на страницу
    const container = document.querySelector('.global_container_block_header');
    if (container) {
        container.parentNode.insertBefore(filterContainer, container.nextSibling);
    }
    
    
}

// Выбор всех категорий
function selectAllCategories() {
    const preferences = {};
    const checkboxes = document.querySelectorAll('#battle-filter-container input[type="checkbox"]');
    
    checkboxes.forEach(cb => {
        cb.checked = true;
        preferences[cb.dataset.category] = true;
    });
    
    localStorage.setItem('hwm_battle_filter', JSON.stringify(preferences));
    filterBattles();
}

// Отмена выбора всех категорий
function deselectAllCategories() {
    const preferences = {};
    const checkboxes = document.querySelectorAll('#battle-filter-container input[type="checkbox"]');
    
    checkboxes.forEach(cb => {
        cb.checked = false;
        preferences[cb.dataset.category] = false;
    });
    
    localStorage.setItem('hwm_battle_filter', JSON.stringify(preferences));
    filterBattles();
}

// Обновление предпочтения для категории
function updateCategoryPreference() {
    const preferences = JSON.parse(localStorage.getItem('hwm_battle_filter') || '{}');
    preferences[this.dataset.category] = this.checked;
    localStorage.setItem('hwm_battle_filter', JSON.stringify(preferences));
    filterBattles();
}

// Кешированная ссылка на контейнер лога
let cachedLogContainer = null;

// Улучшенная функция получения контейнера с протоколом
function getLogContainer() {
    // Если у нас есть кешированный контейнер и он всё ещё в DOM
    if (cachedLogContainer && document.contains(cachedLogContainer)) {
        return cachedLogContainer;
    }
    
    // Ищем контейнер заново
    const allContainers = document.querySelectorAll('.global_a_hover');
    
    // Перебираем контейнеры, ища тот, который содержит лог или был ранее использован
    for (const container of allContainers) {
        // Если контейнер содержит лог или просто имеет подходящего родителя
        if (container.innerHTML.includes('&nbsp;&nbsp;') || 
            container.innerHTML === "") {
            cachedLogContainer = container;
            return container;
        }
    }
    
    // Если ничего не нашли, берём первый контейнер
    if (allContainers.length > 0) {
        cachedLogContainer = allContainers[0];
        return cachedLogContainer;
    }
    
    return null;
}

// Обновленная функция автоматической загрузки
async function loadPagesAutomatically(includeCurrentPage = false) {
    const pageCount = parseInt(localStorage.getItem('hwm_page_count') || '25');
    const pageType = getPageType();
    const currentPage = getCurrentPage();
    const entityId = getEntityId();

    if (!entityId) {
        console.error('Не удается определить ID из URL');
        return;
    }

    console.log(`Загружаем ${pageType}, ID: ${entityId}, текущая страница: ${currentPage}`);

    const promises = [];

    // Начинаем с текущей страницы, если указан параметр includeCurrentPage
    const startIndex = includeCurrentPage ? 0 : 1;

    // Создаем промисы для загрузки каждой страницы
    for (let i = startIndex; i < pageCount; i++) {
        const pageNum = currentPage + i;
        const url = buildPageUrl(pageType, entityId, pageNum);

        const promise = fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(buffer => decodeWindows1251(buffer))
            .then(html => extractLogLines(html))
            .catch(error => {
                console.error(`Ошибка загрузки страницы ${pageNum}:`, error);
                return [];
            });

        promises.push(promise);
    }

    try {
        // Ждем загрузки всех страниц
        const results = await Promise.all(promises);

        // Находим правильный контейнер с записями
        const allContainers = document.querySelectorAll('.global_a_hover');
        const logContainer = getLogContainer();
        if (!logContainer) {
            console.error('Не удается найти контейнер с записями');
            return;
        }

        // Получаем существующие записи для проверки дубликатов
        const existingEntries = extractLogLines(logContainer.innerHTML);

        // Объединяем все новые записи
        const allNewEntries = results.flat();

        if (allNewEntries.length > 0) {
            // Фильтруем дубликаты
            const uniqueNewEntries = filterNewEntries(existingEntries, allNewEntries);

            if (uniqueNewEntries.length > 0) {
                // Если это протокол боёв, сохраняем все записи для фильтрации
                if (pageType === 'warlog') {
                    // Объединяем существующие и новые записи
                    allBattlesData = [...existingEntries, ...uniqueNewEntries];
                    
                    // Применяем фильтр к полному набору данных
                    filterBattles();
                    
                    console.log(`Добавлено ${uniqueNewEntries.length} новых уникальных записей`);
                    console.log(`Всего записей загружено: ${allBattlesData.length}`);
                } else {
                    // Для других типов протоколов, просто добавляем новые записи
                    uniqueNewEntries.forEach(entry => {
                        logContainer.insertAdjacentHTML('beforeend', entry + '\n');
                    });
                    
                    console.log(`Добавлено ${uniqueNewEntries.length} новых уникальных записей`);
                    console.log(`Всего записей загружено: ${allNewEntries.length}`);
                    console.log(`Отфильтровано дубликатов: ${allNewEntries.length - uniqueNewEntries.length}`);
                }
            } else {
                console.log('Новых уникальных записей не найдено');
            }
        } else {
            console.log('Не загружено записей с дополнительных страниц');
        }
    } catch (error) {
        console.error('Ошибка при загрузке страниц:', error);
    } finally {
        // Обновляем пагинацию после загрузки всех страниц
        updatePagination();
    }
}

// Обновленная функция копирования (переименована для универсальности)
function copyLogHTML(button, logTypeName) {
    // Находим контейнер с протоколом
    const allContainers = document.querySelectorAll('.global_a_hover');
    const logContainer = getLogContainer();
    if (!logContainer) {
        alert(`Не удается найти контейнер с ${logTypeName}`);
        return;
    }

    // Получаем HTML и декодируем сущности
    const rawHtmlContent = logContainer.innerHTML;
    const htmlContent = replaceAmpEntities(rawHtmlContent);

    console.log(`Размер HTML контента ${logTypeName}:`, htmlContent.length);
    console.log('Первые 200 символов HTML:', htmlContent.substring(0, 200));
    console.log('Замен &amp; на &:', (rawHtmlContent.match(/&amp;/g) || []).length);

    // Пробуем GM_setClipboard
    let copySuccess = false;
    let method = '';

    try {
        GM_setClipboard(htmlContent);
        method = 'text';
        copySuccess = true;
        console.log('GM_setClipboard (text) выполнен');
    } catch (error) {
        console.error('Ошибка GM_setClipboard (text):', error);
    }

    if (!copySuccess) {
        try {
            GM_setClipboard(htmlContent, 'text');
            method = 'text explicit';
            copySuccess = true;
            console.log('GM_setClipboard (text explicit) выполнен');
        } catch (error) {
            console.error('Ошибка GM_setClipboard (text explicit):', error);
        }
    }

    // Проверяем результат через небольшую задержку
    setTimeout(() => {
        checkClipboardContent(copySuccess, method, htmlContent, button, logTypeName);
    }, 100);
}

function checkClipboardContent(copySuccess, method, originalContent, button, logTypeName) {
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(clipboardText => {
            console.log('Содержимое буфера обмена:', clipboardText.length, 'символов');

            if (clipboardText.length > 0) {
                if (clipboardText === originalContent || clipboardText.length > 1000) {
                    console.log('✅ HTML код корректно скопирован');
                    button.style.background = '#4CAF50';
                    button.textContent = 'HTML скопирован!';
                } else {
                    console.log('⚠️ В буфере другой контент');
                    showHTMLModal(originalContent, button, logTypeName);
                    return;
                }
            } else {
                console.log('❌ Буфер обмена пустой');
                showHTMLModal(originalContent, button, logTypeName);
                return;
            }

            setTimeout(() => {
                button.style.background = '#2196F3';
                button.textContent = `Скопировать HTML код ${logTypeName}`;
            }, 3000);

        }).catch(error => {
            console.log('Не удалось прочитать буфер обмена:', error);
            if (copySuccess) {
                button.style.background = '#4CAF50';
                button.textContent = 'HTML скопирован!';
                setTimeout(() => {
                    button.style.background = '#2196F3';
                    button.textContent = `Скопировать HTML код ${logTypeName}`;
                }, 3000);
            } else {
                showHTMLModal(originalContent, button, logTypeName);
            }
        });
    } else {
        if (copySuccess) {
            console.log('Clipboard API недоступен, но GM_setClipboard выполнен');
            button.style.background = '#4CAF50';
            button.textContent = 'HTML скопирован!';
            setTimeout(() => {
                button.style.background = '#2196F3';
                button.textContent = `Скопировать HTML код ${logTypeName}`;
            }, 3000);
        } else {
            showHTMLModal(originalContent, button, logTypeName);
        }
    }
}

// Простая функция замены &amp; на &
function replaceAmpEntities(text) {
    return text.replace(/&amp;/g, '&');
}

// Проверка идентичности записей (точное совпадение)
function areEntriesIdentical(entry1, entry2) {
    return entry1.trim() === entry2.trim();
}

// Фильтрация новых записей, исключение дубликатов
function filterNewEntries(existingEntries, newEntries) {
    const uniqueNewEntries = [];

    for (const newEntry of newEntries) {
        let isDuplicate = false;

        for (const existingEntry of existingEntries) {
            if (areEntriesIdentical(newEntry, existingEntry)) {
                isDuplicate = true;
                break;
            }
        }

        if (!isDuplicate) {
            // Также проверяем против уже добавленных новых записей
            let isAlreadyAdded = false;
            for (const addedEntry of uniqueNewEntries) {
                if (areEntriesIdentical(newEntry, addedEntry)) {
                    isAlreadyAdded = true;
                    break;
                }
            }

            if (!isAlreadyAdded) {
                uniqueNewEntries.push(newEntry);
            }
        }
    }

    return uniqueNewEntries;
}

// Полная функция модального окна
function showHTMLModal(htmlContent, button, logTypeName) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
        align-items: center; justify-content: center;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white; padding: 20px; border-radius: 8px;
        max-width: 90%; max-height: 90%; overflow: auto;
    `;

    const title = document.createElement('h3');
    title.textContent = `HTML код ${logTypeName}`;
    title.style.cssText = 'margin-top: 0; color: #333;';

    const instruction = document.createElement('p');
    instruction.textContent = 'Выделите весь текст (Ctrl+A) и скопируйте (Ctrl+C):';
    instruction.style.cssText = 'color: #666; margin-bottom: 10px;';

    const textarea = document.createElement('textarea');
    textarea.value = htmlContent;
    textarea.style.cssText = `
        width: 700px; height: 400px; font-family: monospace; font-size: 12px;
        border: 1px solid #ccc; padding: 10px; resize: both;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'text-align: center; margin-top: 15px;';

    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Выделить всё';
    selectAllBtn.style.cssText = 'margin-right: 10px; padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;';
    selectAllBtn.onclick = () => {
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.style.cssText = 'padding: 8px 16px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;';
    closeBtn.onclick = () => document.body.removeChild(modal);

    // Собираем модальное окно
    buttonContainer.appendChild(selectAllBtn);
    buttonContainer.appendChild(closeBtn);

    content.appendChild(title);
    content.appendChild(instruction);
    content.appendChild(textarea);
    content.appendChild(buttonContainer);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Автоматически выделяем весь текст
    setTimeout(() => {
        textarea.focus();
        textarea.select();
    }, 100);

    // Обновляем кнопку
    button.style.background = '#FFA500';
    button.textContent = 'Окно открыто';
    setTimeout(() => {
        button.style.background = '#2196F3';
        button.textContent = `Скопировать HTML код ${logTypeName}`;
    }, 3000);
}

// Функция фильтрации боёв
function filterBattles() {
    if (getPageType() !== 'warlog' || !allBattlesData.length) return;
    
    // Получаем предпочтения и проверяем, есть ли хотя бы одна активная категория
    const preferences = JSON.parse(localStorage.getItem('hwm_battle_filter') || '{}');
    let hasActiveCategories = false;
    
    // Проверяем все категории во всех подкатегориях
    for (const subcategory of Object.values(BATTLE_CATEGORIES)) {
        for (const categoryId of Object.keys(subcategory)) {
            if (preferences[categoryId] !== false) {
                hasActiveCategories = true;
                break;
            }
        }
        if (hasActiveCategories) break;
    }
    
    // Результирующий HTML для отображения
    let filteredHTML = '';
    let totalBattles = 0;
    let shownBattles = 0;
    
    // Если все фильтры отключены, показываем сообщение
    if (!hasActiveCategories) {
        const logContainer = getLogContainer();
        if (logContainer) {
            logContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Все фильтры отключены. Выберите хотя бы одну категорию боёв.</div>';
            
            // Обновляем счетчик
            const counterElem = document.getElementById('battleFilterCounter');
            if (counterElem) {
                counterElem.textContent = `Показано 0 из ${allBattlesData.length} боёв`;
            }
        }
        return;
    }
    
    // Проходим по всем записям боёв
    for (const battleEntry of allBattlesData) {
        totalBattles++;
        
        // Извлекаем категорию боя
        const categoryMatch = battleEntry.match(/<!--(\d+)-->/);
        const category = categoryMatch ? categoryMatch[1] : 'unknown';
        
        // Находим, к какой категории относится этот бой
        let foundInCategory = false;
        for (const [subcategoryName, subcategories] of Object.entries(BATTLE_CATEGORIES)) {
            if (subcategoryName !== 'Неизвестное' && subcategories[category]) {
                foundInCategory = true;
                break;
            }
        }
        
        // Определяем, нужно ли показывать бой
        let shouldShowBattle;
        if (foundInCategory) {
            shouldShowBattle = preferences[category] !== false;
        } else {
            shouldShowBattle = preferences['unknown'] !== false;
        }
        
        // Добавляем бой, если он проходит фильтр
        if (shouldShowBattle) {
            filteredHTML += battleEntry + '\n';
            shownBattles++;
        }
    }
    
    // Обновляем отображение
    const logContainer = getLogContainer();
    if (logContainer) {
        logContainer.innerHTML = filteredHTML || '<div style="padding: 20px; text-align: center; color: #666;">Нет боёв, соответствующих выбранным фильтрам.</div>';
        
        // Обновляем счетчик
        const counterElem = document.getElementById('battleFilterCounter');
        if (counterElem) {
            counterElem.textContent = `Показано ${shownBattles} из ${totalBattles} боёв`;
        }
    }
}

// Обновление отображения протокола боёв
function updateBattleLogDisplay(battles) {
    // Находим контейнер с записями
    const allContainers = document.querySelectorAll('.global_a_hover');
    const logContainer = getLogContainer();
    if (!logContainer) return;
    
    // Обновляем HTML контейнера
    logContainer.innerHTML = battles.join('\n');
}

// Initialize when page loads
function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createBattleFilterUI();
            createStatusDisplay();
            loadPagesAutomatically();
            
            // Восстанавливаем состояние кнопки после создания элементов
            const containersCollapsed = localStorage.getItem('hwm_containers_collapsed') === 'true';
            const toggleBtn = document.querySelector('.toggle-collapse-btn');
            if (toggleBtn) {
                toggleBtn.textContent = containersCollapsed ? '▼' : '▲';
                toggleBtn.title = containersCollapsed ? 'Развернуть панели' : 'Свернуть панели';
            }
        });
    } else {
        createBattleFilterUI();
        createStatusDisplay();
        loadPagesAutomatically();
        
        // Восстанавливаем состояние кнопки
        const containersCollapsed = localStorage.getItem('hwm_containers_collapsed') === 'true';
        const toggleBtn = document.querySelector('.toggle-collapse-btn');
        if (toggleBtn) {
            toggleBtn.textContent = containersCollapsed ? '▼' : '▲';
            toggleBtn.title = containersCollapsed ? 'Развернуть панели' : 'Свернуть панели';
        }
    }
}



init();

})();
