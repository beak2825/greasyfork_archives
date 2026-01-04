// ==UserScript==
// @name         HeroesWM Clan Crafters v3 + sort (Draggable, Resizable Table – Last Column Drag)
// @namespace    http://tampermonkey.net/
// @version      5.9
// @description  Парсинг крафтеров с сортировкой, выбором режима и изменяемой по высоте таблицей. Заголовок состоит из 6 столбцов (последний – с кнопкой закрытия). В теле таблицы весь последний столбец (ячейки (1,6), (2,6), …) является областью для перетаскивания, которая позволяет перемещать таблицу без резких скачков.
// @author       Your Name
// @include      /^https{0,1}:\/\/(www|my|mirror)\.(heroeswm|178\.248\.235\.15|lordswm)\.(ru|com)\/(clan_info)\.php*
// @grant        GM_addStyle
// @grant        GM_log
// @connect      heroeswm.ru
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540780/HeroesWM%20Clan%20Crafters%20v3%20%2B%20sort%20%28Draggable%2C%20Resizable%20Table%20%E2%80%93%20Last%20Column%20Drag%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540780/HeroesWM%20Clan%20Crafters%20v3%20%2B%20sort%20%28Draggable%2C%20Resizable%20Table%20%E2%80%93%20Last%20Column%20Drag%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLAN_ID = new URL(window.location.href).searchParams.get('id');
    const STORAGE_KEY = `heroeswm-crafters-${CLAN_ID}`;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Переменные для сортировки
    let currentData = null;
    let currentSortKey = null;
    let currentSortDirection = 'asc';

    GM_addStyle(`
        /* Контейнер таблицы */
        #craftersTable {
            position: fixed;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border: 2px solid #8b4513;
            z-index: 9999;
            padding: 0;
            box-shadow: 3px 3px 5px rgba(0,0,0,0.3);
            max-width: calc(100vw - 20px);
            max-height: calc(100vh - 20px);
            overflow: auto;
        }
        /* Ресайз-хэндлы для изменения высоты */
        .resize-handle {
            height: 5px;
            width: 100%;
            cursor: ns-resize;
            background: transparent;
        }
        .resize-handle:hover {
            background: rgba(139,69,19,0.2);
        }
        /* Таблица внутри контейнера */
        #craftersTable table {
            border-collapse: collapse;
            font-size: 12px;
            width: 100%;
        }
        #craftersTable th, #craftersTable td {
            border: 1px solid #8b4513;
            padding: 4px 8px;
            text-align: center;
            word-break: break-word;
        }
        #craftersTable th {
            background-color: #deb887;
            cursor: pointer;
        }
        /* Панель управления */
        .anvil-btn {
            cursor: pointer;
            background: #deb887;
            padding: 5px 10px;
            border: 2px solid #8b4513;
            border-radius: 3px;
            margin: 2px;
            display: inline-flex;
            align-items: center;
            font-size: 14px;
        }
        .buttons-container {
            display: flex;
            gap: 5px;
            margin: 10px 0;
            justify-content: center;
            flex-wrap: wrap;
        }
        .progress {
            background: #deb887;
            color: black;
            padding: 5px 10px;
            border: 2px solid #8b4513;
            border-radius: 3px;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
        }
        /* Заголовок таблицы – одна строка с 6 столбцами.
           Последний столбец содержит только кнопку закрытия */
        thead tr {
            height: 30px;
            line-height: 30px;
            user-select: none;
            background: #deb887;
        }
        th.close-btn {
            width: 30px;
            height: 30px;
            padding: 0;
            margin: 0;
            cursor: pointer;
            background: #deb887;
            border: 2px solid #8b4513;
            border-radius: 3px;
            font-size: 16px;
            text-align: center;
            vertical-align: middle;
        }
        /* Тело таблицы: каждая строка имеет 6 ячеек; последний столбец пустой */
        @media (max-width: 768px) {
            #craftersTable {
                position: relative;
                left: auto;
                top: auto;
                transform: none;
                margin: 10px auto;
                width: 100%;
                max-width: 100%;
            }
        }
    `);

    function findClanBalanceContainer() {
        return document.querySelector('td:has(img[src*="gold.gif"])')?.closest('tr') || document.body;
    }

    // Создаем панель управления
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const viewBtn = createButton('⚒', 'Показать/скрыть таблицу', 'viewBtn');
    const parseBtn = createButton('↺', 'Запустить парсинг', 'parseBtn');

    // Чекбокс для режима последовательного выполнения (по умолчанию не отмечен = параллельно)
    const seqLabel = document.createElement('label');
    seqLabel.className = 'anvil-btn';
    seqLabel.style.userSelect = 'none';
    const sequentialCheckbox = document.createElement('input');
    sequentialCheckbox.type = 'checkbox';
    sequentialCheckbox.id = 'sequentialMode';
    sequentialCheckbox.style.marginRight = '5px';
    seqLabel.appendChild(sequentialCheckbox);
    seqLabel.appendChild(document.createTextNode('Последовательно'));

    const progress = document.createElement('div');
    progress.className = 'progress';
    progress.textContent = 'Обработано: 0/0, Время: 0.000 сек';

    buttonsContainer.append(parseBtn, viewBtn, seqLabel, progress);
    if (isMobile) {
        const balanceContainer = findClanBalanceContainer();
        if (balanceContainer) balanceContainer.after(buttonsContainer);
    } else {
        document.body.appendChild(buttonsContainer);
    }

    function createButton(icon, title, id) {
        const btn = document.createElement('div');
        btn.innerHTML = icon;
        btn.className = 'anvil-btn';
        btn.id = id;
        btn.title = title;
        return btn;
    }

    // fetchDocument с декодированием из windows-1251
    function fetchDocument(url) {
        const startTime = performance.now();
        return fetch(url, { credentials: 'include' })
            .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.arrayBuffer();
        })
            .then(arrayBuffer => {
            const decoder = new TextDecoder('windows-1251');
            const text = decoder.decode(arrayBuffer);
            const networkTime = performance.now() - startTime;
            const parseStart = performance.now();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const parseTime = performance.now() - parseStart;
            const totalTime = performance.now() - startTime;
            return { doc, text, networkTime, parseTime, totalTime };
        });
    }

    async function processPlayerLink(link) {
        try {
            const result = await fetchDocument(link);
            const { doc } = result;
            const playerName = extractPlayerName(doc);
            const crafts = parseCrafts(doc);
            const playerData = hasActiveCrafts(crafts) ? createPlayerData(playerName, crafts) : null;
            return { playerData, totalTime: result.totalTime };
        } catch(e) {
            GM_log(`Ошибка парсинга ${link}: ${e}`);
            return { playerData: null, totalTime: 0 };
        }
    }

    async function parseClanCrafters() {
        const startTime = performance.now();
        let countRequests = 0;
        try {
            parseBtn.style.pointerEvents = 'none';
            progress.style.display = 'inline-flex';
            progress.textContent = 'Обработано: 0/0, Время: 0.000 сек';

            const clanResult = await fetchDocument(window.location.href);
            const clanPage = clanResult.doc;
            const playerLinks = getPlayerLinks(clanPage);
            if (!playerLinks.length) {
                alert('Не найдено игроков!');
                return;
            }
            progress.textContent = `Обработано: 0/${playerLinks.length}, Время: 0.000 сек`;

            const sequentialMode = sequentialCheckbox.checked;
            let responses = [];
            if (sequentialMode) {
                for (const link of playerLinks) {
                    const res = await processPlayerLink(link);
                    responses.push(res);
                    countRequests++;
                    progress.textContent = `Обработано: ${countRequests}/${playerLinks.length}, Время: ${((performance.now()-startTime)/1000).toFixed(3)} сек`;
                }
            } else {
                const promises = playerLinks.map(link =>
                                                 processPlayerLink(link).then(res => {
                    countRequests++;
                    progress.textContent = `Обработано: ${countRequests}/${playerLinks.length}, Время: ${((performance.now()-startTime)/1000).toFixed(3)} сек`;
                    return res;
                })
                                                );
                responses = await Promise.all(promises);
            }

            const results = responses
            .map(r => r.playerData)
            .filter(item => item !== null);
            saveAndDisplay(results);

            const overallTime = ((performance.now()-startTime)/1000).toFixed(3);
            progress.textContent = `Обработано: ${playerLinks.length}/${playerLinks.length}, Время: ${overallTime} сек`;
        } catch(e) {
            alert('Ошибка: ' + e.message);
        } finally {
            parseBtn.style.pointerEvents = 'auto';
        }
    }

    function getPlayerLinks(doc) {
        try {
            return [...doc.querySelectorAll('a[href*="pl_info.php?id="]')]
                .map(a => new URL(a.href, window.location.href).toString())
                .filter((v, i, a) => a.indexOf(v) === i);
        } catch(e) {
            GM_log('Ошибка извлечения ссылок:', e);
            return [];
        }
    }

    function extractPlayerName(doc) {
        const title = doc.querySelector('title')?.textContent || '';
        const match = title.match(/^([^|│]+)/);
        return match?.[1]?.trim() || 'Неизвестно';
    }

    function parseCrafts(doc) {
        const crafts = { blacksmith: 0, craft: 0, weapons: 0, armor: 0, jeweler: 0 };
        const nodes = doc.evaluate(
            "//td[contains(., 'Гильдия') or contains(., 'Мастер') or contains(., 'Ювелир')]",
            doc,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < nodes.snapshotLength; i++) {
            const td = nodes.snapshotItem(i);
            const text = td.textContent.trim();
            updateCrafts(crafts, text);
        }
        return crafts;
    }

    function updateCrafts(crafts, text) {
        const patterns = {
            blacksmith: /Гильдия Кузнецов.*?(\d+)/,
            craft: /Гильдия Оружейников.*?(\d+)/,
            weapons: /Мастер оружия.*?(\d+)/,
            armor: /Мастер доспехов.*?(\d+)/,
            jeweler: /Ювелир.*?(\d+)/
        };
        for (const [key, regex] of Object.entries(patterns)) {
            const match = text.match(regex);
            if (match) crafts[key] = Math.max(crafts[key], parseInt(match[1]));
        }
    }

    function createPlayerData(name, crafts) {
        const guildCraft = crafts.craft;
        return {
            name: name,
            crafts: crafts,
            totalScore: crafts.blacksmith + guildCraft + crafts.weapons + crafts.armor + crafts.jeweler,
            blacksmithScore: Math.min(10 + crafts.blacksmith * 10, 90),
            weaponScore: Math.min(1 + guildCraft, 5) * Math.min(1 + crafts.weapons, 12),
            armorScore: Math.min(1 + guildCraft, 5) * Math.min(1 + crafts.armor, 12),
            jewelerScore: Math.min(1 + guildCraft, 5) * Math.min(1 + crafts.jeweler, 12)
        };
    }

    function hasActiveCrafts(crafts) {
        return Object.values(crafts).some(v => v > 0);
    }

    function saveAndDisplay(data) {
        data.sort((a, b) => b.totalScore - a.totalScore);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showResultsTable(data);
    }

    function showResultsTable(data) {
        currentData = data;
        // Сохраняем позицию таблицы (если уже существует)
        let savedLeft = null, savedTop = null;
        const existing = document.getElementById('craftersTable');
        if (existing) {
            savedLeft = existing.style.left;
            savedTop = existing.style.top;
            existing.remove();
        }
        if (!data.length) {
            alert('Нет данных для отображения');
            return;
        }
        const headers = ['Игрок', 'Кузня', 'Оружие', 'Броня', 'Ювелирка', 'Крестик'];
        const sortKeys = ['name', 'blacksmithScore', 'weaponScore', 'armorScore', 'jewelerScore'];
        let headerHTML = `<tr>`;
        headers.forEach((h, i) => {
            if (i === headers.length - 1) {
                headerHTML += `<th class="close-btn" id="closeBtn">✖</th>`;
            } else {
                let arrow = '';
                if (currentSortKey === sortKeys[i]) {
                    arrow = currentSortDirection === 'asc' ? ' ▲' : ' ▼';
                }
                headerHTML += `<th>${h}${arrow}</th>`;
            }
        });
        headerHTML += `</tr>`;

        // Формируем тело таблицы (последний столбец остаётся пустым)
        let tbodyHTML = data.map((player) => {
            return `<tr>
                    <td>${player.name}</td>
                    <td>${calcForge(player.crafts.blacksmith)}</td>
                    <td>${formatCraft(player.crafts.craft, player.crafts.weapons)}</td>
                    <td>${formatCraft(player.crafts.craft, player.crafts.armor)}</td>
                    <td>${formatCraft(player.crafts.craft, player.crafts.jeweler, 12)}</td>
                    <td></td>
                </tr>`;
        }).join('');

        const container = document.createElement('div');
        container.id = 'craftersTable';
        // Используем сохранённые координаты, если они есть
        container.style.left = savedLeft ? savedLeft : '10px';
        container.style.top = savedTop ? savedTop : '50%';
        if (!container.style.height) {
            container.style.height = '400px';
        }
        container.innerHTML = `
        <div class="resize-handle top"></div>
        <table>
            <thead>
                ${headerHTML}
            </thead>
            <tbody>
                ${tbodyHTML}
            </tbody>
        </table>
        <div class="resize-handle bottom"></div>
    `;
        document.body.appendChild(container);

        // Обработчик кнопки закрытия
        const closeBtn = container.querySelector('#closeBtn');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            container.remove();
        });

        // Прикрепляем обработчик перетаскивания ко всем ячейкам последнего столбца тела таблицы
        attachDragToLastColumn(container);

        // Обработчики клика по заголовкам для сортировки (исключая крестик)
        container.querySelectorAll('th').forEach((th, index) => {
            if (!th.classList.contains('close-btn')) {
                th.addEventListener('click', () => handleSort(index));
            }
        });

        addResizeHandlers(container);
    }

    function attachDragToLastColumn(container) {
        const cells = container.querySelectorAll('tbody tr td:last-child');
        cells.forEach(cell => {
            cell.style.cursor = 'move';
            cell.addEventListener('pointerdown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const initialLeft = container.offsetLeft;
                const initialTop = container.offsetTop;
                cell.setPointerCapture(e.pointerId);
                function onPointerMove(e) {
                    e.preventDefault();
                    container.style.left = (initialLeft + (e.clientX - startX)) + 'px';
                    container.style.top = (initialTop + (e.clientY - startY)) + 'px';
                }
                function onPointerUp(e) {
                    e.preventDefault();
                    cell.releasePointerCapture(e.pointerId);
                    cell.removeEventListener('pointermove', onPointerMove);
                    cell.removeEventListener('pointerup', onPointerUp);
                }
                cell.addEventListener('pointermove', onPointerMove);
                cell.addEventListener('pointerup', onPointerUp);
            });
        });
    }

    function handleSort(columnIndex) {
        if (!currentData) return;
        const sortKeys = ['name', 'blacksmithScore', 'weaponScore', 'armorScore', 'jewelerScore'];
        const sortKey = sortKeys[columnIndex];
        if (currentSortKey === sortKey) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortKey = sortKey;
            currentSortDirection = 'asc';
        }
        const sortedData = [...currentData].sort((a, b) => {
            let aValue, bValue;
            if (sortKey === 'name') {
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                return currentSortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            } else {
                aValue = a[sortKey];
                bValue = b[sortKey];
                return currentSortDirection === 'asc'
                    ? aValue - bValue
                : bValue - aValue;
            }
        });
        showResultsTable(sortedData);
    }

    function calcForge(level) {
        return Math.min(10 + level * 10, 90) + '%';
    }

    function formatCraft(guildLevel, masterLevel, max = 12) {
        if (guildLevel === 0 || masterLevel === 0) return '-';
        const g = Math.min(1 + guildLevel, 5);
        const m = Math.min(1 + masterLevel, max);
        const suffix = masterLevel >= max ? '+р' : '';
        return `${g}×${m}%${suffix}`;
    }

    // Функция изменения высоты (ресайз) остаётся без изменений
    function addResizeHandlers(container) {
        const topHandle = container.querySelector('.resize-handle.top');
        const bottomHandle = container.querySelector('.resize-handle.bottom');
        if (!container.style.height) {
            container.style.height = container.offsetHeight + 'px';
        }
        topHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = container.offsetHeight;
            const startTop = container.offsetTop;
            function onMouseMove(e) {
                const dy = e.clientY - startY;
                const newHeight = startHeight - dy;
                container.style.height = newHeight + 'px';
                container.style.top = (startTop + dy) + 'px';
            }
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        bottomHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = container.offsetHeight;
            function onMouseMove(e) {
                const dy = e.clientY - startY;
                const newHeight = startHeight + dy;
                container.style.height = newHeight + 'px';
            }
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    viewBtn.addEventListener('click', () => {
        const table = document.getElementById('craftersTable');
        if (table) {
            table.remove();
        } else {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            data ? showResultsTable(data) : alert('Данные не найдены!');
        }
    });

    parseBtn.addEventListener('click', () => {
        if (confirm('Обновить данные? Это может занять несколько минут.')) {
            parseClanCrafters();
        }
    });

    window.addEventListener('load', () => {
        if (localStorage.getItem(STORAGE_KEY)) viewBtn.style.display = 'block';
    });

})();