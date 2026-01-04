// ==UserScript==
// @name         Кураторская Админская Панель | КАП
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Hide or show comments by order number and comment text using filter and edit forms
// @author       Я
// @match        https://a24.biz/admin*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533184/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%9F%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%7C%20%D0%9A%D0%90%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/533184/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%9F%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%7C%20%D0%9A%D0%90%D0%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for UI
        GM_addStyle(`
        #curatorPanel {
            position: fixed;
            bottom: 10px;
            left: 20%;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 10000;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
        }
        #curatorTitle {
            text-align: center;
            margin-bottom: 10px;
        }
        #curatorTitle h2 {
            font-size: 18px;
            margin: 0;
            color: #333;
        }
        #curatorSections {
            display: flex;
            flex-direction: row;
            gap: 10px;
        }
        #commentToggleSection, #popupFormSection, #wipSection {
            flex: 1;
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
        }
        #commentToggleSection h3, #popupFormSection h3, #wipSection h3 {
            margin: 0 0 10px;
            font-size: 16px;
            color: #333;
        }
        #commentToggleSection label, #popupFormSection label, #wipSection label {
            display: block;
            margin: 5px 0;
            font-size: 14px;
            color: #555;
        }
        #commentToggleSection input, #popupFormSection input, #popupFormSection textarea, #wipSection input {
            width: calc(100% - 10px);
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        #popupFormSection textarea {
            height: 60px;
            resize: vertical;
        }
        #commentToggleSection #hideBtn, #commentToggleSection #showBtn, #popupFormSection button, #wipSection button {
            margin: 5px 5px 0 0;
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            background: #28a745;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
        }
        #commentToggleSection #hideBtn:hover, #commentToggleSection #showBtn:hover, #popupFormSection button:hover, #wipSection button:hover {
            background: #218838;
        }
        #commentToggleSection p, #popupFormSection .result, #popupFormSection .error, #wipSection .result, #wipSection .error {
            margin: 5px 0;
            font-size: 14px;
        }
        #popupFormSection .result, #wipSection .result {
            color: #28a745;
        }
        #popupFormSection .error, #wipSection .error {
            color: #dc3545;
        }
        #commentToggleSection #debug {
            display: none;
            max-height: 100px;
            overflow-y: auto;
            font-size: 12px;
            color: #555;
            border: 1px solid #eee;
            padding: 5px;
            border-radius: 4px;
        }
        #positionButtons {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 5px 0;
        }
        #positionButtons .position-btn {
            width: 30px !important;
            height: 30px !important;
            padding: 0;
            font-size: 14px;
            border: 1px solid #ccc;
            background: #e0e0e0;
            color: #333;
            cursor: pointer;
            border-radius: 4px;
        }
        #positionButtons .position-btn.selected {
            background: #28a745 !important;
            color: #fff !important;
            border-color: #218838 !important;
        }
        #positionButtons .position-btn:hover {
            background: #d0d0d0;
        }
        #wipSection {
            text-align: left;
            font-size: 16px;
            color: #666;
        }
        /* Стили для форм */
        #curatorPanel form {
            margin: 0;
            padding: 0;
            border: none;
            background: none;
        }

        #curatorPanel form label {
            display: block;
            margin: 8px 0 4px;
            font-size: 14px;
            color: #555;
        }

        #curatorPanel form input[type="text"],
        #curatorPanel form input[type="number"],
        #curatorPanel form textarea {
            width: 100%;
            padding: 8px;
            margin: 4px 0 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            background: #fff;
            color: #333;
        }

        #curatorPanel form textarea {
            min-height: 60px;
            resize: vertical;
        }

        #curatorPanel form button,
        #curatorPanel form input[type="submit"] {
            width: 80%;
            padding: 8px 16px;
            margin: 8px 0;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
        }

        #curatorPanel form button:hover,
        #curatorPanel form input[type="submit"]:hover {
            background: #218838;
        }

        /* Сброс только конкретных свойств, которые могут наследоваться */
        #curatorPanel input,
        #curatorPanel textarea,
        #curatorPanel button {
            font-family: inherit;
            font-size: inherit;
            line-height: normal;
            margin: 0;
        }

        /* Убираем странные тени и outline'ы */
        #curatorPanel input:focus,
        #curatorPanel textarea:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
            border-color: #28a745;
        }
    `);

    // Create UI
    const panel = document.createElement('div');
    panel.id = 'curatorPanel';
    panel.innerHTML = `
        <div id="curatorTitle">
            <h2>Кураторская панель</h2>
        </div>
        <div id="curatorSections">
            <div id="commentToggleSection">
                <h3>Спрятать/показать комментарии</h3>
                <label>Номер заказа: <input type="text" id="orderNum"></label>
                <label style="padding: 5px; text-align: center; color: red;">Выбор ЛИБО по тексту ЛИБО по номерам коммента</label>
                <label>По тексту комментария (можно часть коммента): <input type="text" id="commentText"></label>
                <label>Какой коментарий по счёту (снизу вверх от 1 до 10, можно выбрать несколько):</label>
                <div id="positionButtons"></div>
                <button id="hideBtn">Спрятать</button>
                <button id="showBtn">Показать</button>
                <p id="status"></p>
                <div id="debug"></div>
            </div>
            <div id="popupFormSection">
                <h3>Направить попап автору</h3>
                <form id="popupForm">
                    <label for="userId">ID эксперта: <input style="margin-top: 5px !important" id="userId" required></label>
                    <label for="comment">Номер заказа: <input style="margin-top: 5px !important" id="commentary" required></label>
                    <button type="submit">Направить попап</button>
                </form>
                <p id="result" class="result"></p>
                <p id="error" class="error"></p>
            </div>
            <div id="wipSection">
                <h3>Провести отказной заказ</h3>
                <form id="complainForm">
                    <label for="complainOrderNum" style="margin: 5px">Номер заказа: <input style="margin-top: 5px !important" type="text" id="complainOrderNum" required></label>
                    <button type="submit">Провести</button>
                </form>
                <p id="complainResult" class="result"></p>
                <p id="complainError" class="error"></p>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // Create toggle buttons for Comment Toggle
    const positionButtons = document.getElementById('positionButtons');
    const buttonStates = Array(10).fill(false); // Track selected state
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'position-btn';
        btn.textContent = i;
        btn.dataset.position = i;
        btn.addEventListener('click', () => {
            const index = i - 1;
            buttonStates[index] = !buttonStates[index];
            btn.classList.toggle('selected', buttonStates[index]);
        });
        positionButtons.appendChild(btn);
    }

    // Comment Toggle elements
    const status = document.getElementById('status');
    const debug = document.getElementById('debug');
    const orderNumInput = document.getElementById('orderNum');
    const commentTextInput = document.getElementById('commentText');
    const hideBtn = document.getElementById('hideBtn');
    const showBtn = document.getElementById('showBtn');

    // Popup Form elements
    const popupForm = document.getElementById('popupForm');
    const complainForm = document.getElementById('complainForm');
    const userIdInput = document.getElementById('userId');
    const complainResultDiv = document.getElementById('complainResult');
    const complainErrorDiv = document.getElementById('complainError');
    const complainOrderNumInput = document.getElementById('complainOrderNum');
    const commentInput = document.getElementById('commentary');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // Function to log debug messages for Comment Toggle
    function logDebug(message) {
        const translations = {
            [`Button ${message.match(/Button (\d+) toggled to selected/)?.[1]} toggled to selected`]: `Кнопка ${message.match(/Button (\d+)/)?.[1]} выбрана`,
            [`Button ${message.match(/Button (\d+) toggled to unselected/)?.[1]} toggled to unselected`]: `Кнопка ${message.match(/Button (\d+)/)?.[1]} снята`,
            'Selected positions: none': 'Выбранные позиции: нет',
            [`Selected positions: ${message.match(/Selected positions: ([\d,\s]+)/)?.[1]}`]: `Выбранные позиции: ${message.match(/Selected positions: ([\d,\s]+)/)?.[1]}`,
            'Toggle buttons reset': 'Кнопки сброшены',
            'Submitting filter form...': 'Отправка формы фильтра...',
            'Filter form submission successful': 'Форма фильтра успешно отправлена',
            [`Filter form submission failed with status ${message.match(/status (\d+)/)?.[1]}`]: `Ошибка отправки формы фильтра, статус ${message.match(/status (\d+)/)?.[1]}`,
            'Network error during filter form submission': 'Сетевая ошибка при отправке формы фильтра',
            'Table #commentsList-table not found in response': 'Таблица #commentsList-table не найдена в ответе',
            [`Found ${message.match(/Found (\d+) rows/)?.[1]} rows in table`]: `Найдено ${message.match(/Found (\d+) rows/)?.[1]} строк в таблице`,
            'No rows found in table': 'Строки в таблице не найдены',
            [`Position ${message.match(/Position (\d+)/)?.[1]}: cid=${message.match(/cid=([\d]+)/)?.[1]}, Order=${message.match(/Order=([^,]+)/)?.[1]}, Comment=${message.match(/Comment=(.+)/)?.[1]}`]:
                `Позиция ${message.match(/Position (\d+)/)?.[1]}: cid=${message.match(/cid=([\d]+)/)?.[1]}, Заказ=${message.match(/Order=([^,]+)/)?.[1]}, Комментарий=${message.match(/Comment=(.+)/)?.[1]}`,
            [`Position ${message.match(/Position (\d+)/)?.[1]} exceeds table rows (${message.match(/\((\d+)\)/)?.[1]})`]:
                `Позиция ${message.match(/Position (\d+)/)?.[1]} превышает количество строк (${message.match(/\((\d+)\)/)?.[1]})`,
            [`Position ${message.match(/Position (\d+)/)?.[1]} order (${message.match(/order \(([^)]+)\)/)?.[1]}) does not match provided order (${message.match(/order \(([^)]+)\)$/)?.[1]})`]:
                `Позиция ${message.match(/Position (\d+)/)?.[1]}, заказ (${message.match(/order \(([^)]+)\)/)?.[1]}) не соответствует указанному заказу (${message.match(/order \(([^)]+)\)$/)?.[1]})`,
            [`Position ${message.match(/Position (\d+)/)?.[1]} missing order, comment, or id`]:
                `Позиция ${message.match(/Position (\d+)/)?.[1]} не содержит заказа, комментария или ID`,
            [`Selected first row: cid=${message.match(/cid=([\d]+)/)?.[1]}, Order=${message.match(/Order=([^,]+)/)?.[1]}, Comment=${message.match(/Comment=(.+)/)?.[1]}`]:
                `Выбрана первая строка: cid=${message.match(/cid=([\d]+)/)?.[1]}, Заказ=${message.match(/Order=([^,]+)/)?.[1]}, Комментарий=${message.match(/Comment=(.+)/)?.[1]}`,
            [`First row order (${message.match(/order \(([^)]+)\)/)?.[1]}) does not match provided order (${message.match(/order \(([^)]+)\)$/)?.[1]})`]:
                `Заказ первой строки (${message.match(/order \(([^)]+)\)/)?.[1]}) не соответствует указанному заказу (${message.match(/order \(([^)]+)\)$/)?.[1]})`,
            'First row missing order, comment, or id': 'Первая строка не содержит заказа, комментария или ID',
            [`Row: cid=${message.match(/cid=([\d]+)/)?.[1]}, Order=${message.match(/Order=([^,]+)/)?.[1]}, Comment=${message.match(/Comment=(.+)/)?.[1]}`]:
                `Строка: cid=${message.match(/cid=([\d]+)/)?.[1]}, Заказ=${message.match(/Order=([^,]+)/)?.[1]}, Комментарий=${message.match(/Comment=(.+)/)?.[1]}`,
            [`Row missing order, comment, or id (cid=${message.match(/cid=([\d]+)/)?.[1]})`]:
                `Строка не содержит заказа, комментария или ID (cid=${message.match(/cid=([\d]+)/)?.[1]})`,
            [`Found matching comment with cid=${message.match(/cid=([\d]+)/)?.[1]}`]:
                `Найден подходящий комментарий с cid=${message.match(/cid=([\d]+)/)?.[1]}`,
            'No matching comment found': 'Подходящий комментарий не найден',
            'No comments found in filter response': 'Комментарии в ответе фильтра не найдены',
            [`Fetching edit form for cid=${message.match(/cid=([\d]+)/)?.[1]}`]:
                `Получение формы редактирования для cid=${message.match(/cid=([\d]+)/)?.[1]}`,
            'Edit form fetched successfully': 'Форма редактирования успешно получена',
            [`Found CSRF token: ${message.match(/token: (.+)/)?.[1]}`]:
                `Найден CSRF-токен: ${message.match(/token: (.+)/)?.[1]}`,
            'No CSRF token found in form': 'CSRF-токен в форме не найден',
            'Edit form not found in response': 'Форма редактирования в ответе не найдена',
            [`Edit form fetch failed with status ${message.match(/status (\d+)/)?.[1]}`]:
                `Ошибка получения формы редактирования, статус ${message.match(/status (\d+)/)?.[1]}`,
            'Network error during edit form fetch': 'Сетевая ошибка при получении формы редактирования',
            [`Submitting edit form for cid=${message.match(/cid=([\d]+)/)?.[1]}, visibility=${message.match(/visibility=([^,]+)/)?.[1]}, text=${message.match(/text=(.+)/)?.[1]}`]:
                `Отправка формы редактирования для cid=${message.match(/cid=([\d]+)/)?.[1]}, видимость=${message.match(/visibility=([^,]+)/)?.[1]}, текст=${message.match(/text=(.+)/)?.[1]}`,
            [`Edit form response for cid=${message.match(/cid=([\d]+)/)?.[1]}: ${message.match(/: (.+)/)?.[1]}`]:
                `Ответ формы редактирования для cid=${message.match(/cid=([\d]+)/)?.[1]}: ${message.match(/: (.+)/)?.[1]}`,
            [`Error in response for cid=${message.match(/cid=([\d]+)/)?.[1]}: ${message.match(/: (.+)/)?.[1]}`]:
                `Ошибка в ответе для cid=${message.match(/cid=([\d]+)/)?.[1]}: ${message.match(/: (.+)/)?.[1]}`,
            [`Edit form submission successful for cid=${message.match(/cid=([\d]+)/)?.[1]}`]:
                `Форма редактирования успешно отправлена для cid=${message.match(/cid=([\d]+)/)?.[1]}`,
            [`Edit form submission failed for cid=${message.match(/cid=([\d]+)/)?.[1]} with status ${message.match(/status (\d+)/)?.[1]}`]:
                `Ошибка отправки формы редактирования для cid=${message.match(/cid=([\d]+)/)?.[1]}, статус ${message.match(/status (\d+)/)?.[1]}`,
            [`Network error during edit form submission for cid=${message.match(/cid=([\d]+)/)?.[1]}`]:
                `Сетевая ошибка при отправке формы редактирования для cid=${message.match(/cid=([\d]+)/)?.[1]}`,
            'Missing order number': 'Отсутствует номер заказа',
            'Both comment text and positions selected; use one or the other': 'Выбраны и текст комментария, и позиции; используйте что-то одно',
            'Submitting complain filter form...': 'Отправка формы фильтра жалоб...',
            'Complain filter form submission successful': 'Форма фильтра жалоб успешно отправлена',
            [`Complain filter form submission failed with status ${message.match(/status (\d+)/)?.[1]}`]: `Ошибка отправки формы фильтра жалоб, статус ${message.match(/status (\d+)/)?.[1]}`,
            'Network error during complain filter form submission': 'Сетевая ошибка при отправке формы фильтра жалоб',
            'No complain table found in response': 'Таблица жалоб не найдена в ответе',
            [`Found ${message.match(/Found (\d+) complain rows/)?.[1]} complain rows in table`]: `Найдено ${message.match(/Found (\d+) complain rows/)?.[1]} строк жалоб в таблице`,
            'No complain rows found in table': 'Строки жалоб в таблице не найдены',
            [`Found complain href: ${message.match(/href: (.+)/)?.[1]}`]: `Найдена ссылка на жалобу: ${message.match(/href: (.+)/)?.[1]}`,
            'No complain href found in table': 'Ссылка на жалобу в таблице не найдена',
            [`Fetching complain form for id=${message.match(/id=([\d]+)/)?.[1]}`]: `Получение формы жалобы для id=${message.match(/id=([\d]+)/)?.[1]}`,
            'Complain form fetched successfully': 'Форма жалобы успешно получена',
            'Complain form not found in response': 'Форма жалобы в ответе не найдена',
            [`Complain form fetch failed with status ${message.match(/status (\d+)/)?.[1]}`]: `Ошибка получения формы жалобы, статус ${message.match(/status (\d+)/)?.[1]}`,
            'Network error during complain form fetch': 'Сетевая ошибка при получении формы жалобы',
            [`Submitting complain form for id=${message.match(/id=([\d]+)/)?.[1]}`]: `Отправка формы жалобы для id=${message.match(/id=([\d]+)/)?.[1]}`,
            'Complain form submission successful': 'Форма жалобы успешно отправлена',
            [`Complain form submission failed with status ${message.match(/status (\d+)/)?.[1]}`]: `Ошибка отправки формы жалобы, статус ${message.match(/status (\d+)/)?.[1]}`,
            'Network error during complain form submission': 'Сетевая ошибка при отправке формы жалобы',
            [`Error in complain response for id=${message.match(/id=([\d]+)/)?.[1]}: ${message.match(/: (.+)/)?.[1]}`]: `Ошибка в ответе жалобы для id=${message.match(/id=([\d]+)/)?.[1]}: ${message.match(/: (.+)/)?.[1]}`
        };

        let translatedMessage = translations[message];
        if (!translatedMessage) {
            for (const [key, value] of Object.entries(translations)) {
                if (key.includes('${') && message.match(key.replace(/\${[^}]+}/g, '(.+)'))) {
                    translatedMessage = value;
                    break;
                }
            }
        }
        translatedMessage = translatedMessage || `[UNTRANSLATED] ${message}`;

        debug.innerHTML += `<p>${translatedMessage}</p>`;
        console.log(`<p>${translatedMessage}</p>`);
        debug.scrollTop = debug.scrollHeight;
    }

    // Function to get selected positions
    function getSelectedPositions() {
        const positions = [];
        buttonStates.forEach((selected, index) => {
            if (selected) positions.push(index + 1);
        });
        logDebug(`Selected positions: ${positions.join(', ') || 'none'}`);
        return positions;
    }

    // Function to reset toggle buttons
    function resetToggleButtons() {
        buttonStates.fill(false);
        document.querySelectorAll('.position-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        logDebug('Toggle buttons reset');
    }

    // Function to parse HTML and find comment IDs and texts
    function findComments(html, orderNum, commentText, positions) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const table = doc.getElementById('commentsList-table');
        if (!table) {
            logDebug('Table #commentsList-table not found in response');
            return [];
        }

        const rows = table.querySelectorAll('tbody tr');
        logDebug(`Found ${rows.length} rows in table`);
        if (rows.length === 0) {
            logDebug('No rows found in table');
            return [];
        }

        const results = [];

        // If positions are selected, process those
        if (positions.length > 0) {
            positions.forEach(pos => {
                const index = pos - 1; // Convert to 0-based index
                if (index >= rows.length) {
                    logDebug(`Position ${pos} exceeds table rows (${rows.length})`);
                    return;
                }
                const row = rows[index];
                const orderCell = row.querySelector('td:nth-child(8)');
                const commentCell = row.querySelector('td:nth-child(4) div');
                const rowId = row.getAttribute('id');
                if (orderCell && commentCell && rowId) {
                    const orderText = orderCell.textContent.trim();
                    const commentTextClean = commentCell.textContent.trim();
                    logDebug(`Position ${pos}: cid=${rowId}, Order=${orderText}, Comment=${commentTextClean}`);
                    if (orderText === orderNum) {
                        results.push({ cid: rowId, commentText: commentTextClean });
                    } else {
                        logDebug(`Position ${pos} order (${orderText}) does not match provided order (${orderNum})`);
                    }
                } else {
                    logDebug(`Position ${pos} missing order, comment, or id`);
                }
            });
            return results;
        }

        // If commentText is empty, select the first row
        if (!commentText) {
            const firstRow = rows[0];
            const orderCell = firstRow.querySelector('td:nth-child(8)');
            const commentCell = firstRow.querySelector('td:nth-child(4) div');
            const rowId = firstRow.getAttribute('id');
            if (orderCell && commentCell && rowId) {
                const orderText = orderCell.textContent.trim();
                const commentTextClean = commentCell.textContent.trim();
                logDebug(`Selected first row: cid=${rowId}, Order=${orderText}, Comment=${commentTextClean}`);
                if (orderText === orderNum) {
                    return [{ cid: rowId, commentText: commentTextClean }];
                } else {
                    logDebug(`First row order (${orderText}) does not match provided order (${orderNum})`);
                }
            } else {
                logDebug('First row missing order, comment, or id');
            }
            return [];
        }

        // Otherwise, find row with partial comment text match
        for (const row of rows) {
            const orderCell = row.querySelector('td:nth-child(8)'); // Order number column
            const commentCell = row.querySelector('td:nth-child(4) div'); // Comment text column
            const rowId = row.getAttribute('id'); // Get cid from row id
            if (orderCell && commentCell && rowId) {
                const orderText = orderCell.textContent.trim();
                const commentTextClean = commentCell.textContent.trim();
                logDebug(`Row: cid=${rowId}, Order=${orderText}, Comment=${commentTextClean}`);
                const orderMatch = orderText === orderNum;
                const commentMatch = commentTextClean.includes(commentText);
                if (orderMatch && commentMatch) {
                    logDebug(`Found matching comment with cid=${rowId}`);
                    return [{ cid: rowId, commentText: commentTextClean }];
                }
            } else {
                logDebug(`Row missing order, comment, or id (cid=${rowId})`);
            }
        }
        logDebug('No matching comment found');
        return [];
    }

    // Function to fetch edit form and extract CSRF token (if any)
    function fetchEditForm(cid, visibility, commentTextClean, callback) {
        logDebug(`Fetching edit form for cid=${cid}`);
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://a24.biz/admin_new/commentEdit/${cid}`,
            onload: function(response) {
                if (response.status === 200) {
                    logDebug('Edit form fetched successfully');
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const form = doc.querySelector('form#filtersForm');
                    let csrfToken = null;
                    if (form) {
                        const csrfInput = form.querySelector('input[name="_csrf"]');
                        if (csrfInput) {
                            csrfToken = csrfInput.value;
                            logDebug(`Found CSRF token: ${csrfToken}`);
                        } else {
                            logDebug('No CSRF token found in form');
                        }
                    } else {
                        logDebug('Edit form not found in response');
                    }
                    callback(cid, visibility, commentTextClean, csrfToken);
                } else {
                    status.textContent = `Ошибка: Не удалось сделать что-то там с cid=${cid} (Status: ${response.status})`;
                    logDebug(`Edit form fetch failed with status ${response.status}`);
                }
            },
            onerror: function() {
                status.textContent = `Произошла ошибка в соединении с интернетом при попытке редактировать коммент с cid=${cid}`;
                logDebug('Network error during edit form fetch');
            }
        });
    }

    // Function to submit edit form for Comment Toggle
    function submitEditForm(cid, visibility, commentTextClean, csrfToken) {
        logDebug(`Submitting edit form for cid=${cid}, visibility=${visibility}, text=${commentTextClean}`);
        const formData = [
            `text=${encodeURIComponent(commentTextClean)}`,
            `comment_visible=${visibility}`,
            `mysubmit=submitbuttonvalue`
        ];
        if (csrfToken) {
            formData.push(`_csrf=${encodeURIComponent(csrfToken)}`);
        }
        const formDataString = formData.join('&');

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://a24.biz/admin_new/commentEdit/${cid}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formDataString,
            onload: function(response) {
                if (response.status === 200) {
                    const responseSnippet = response.responseText.slice(0, 200);
                    logDebug(`Edit form response for cid=${cid}: ${responseSnippet}...`);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const errorDiv = doc.querySelector('.g2[style*="color: red"]');
                    if (errorDiv && errorDiv.textContent.trim()) {
                        status.textContent = `Ошибка: Не удалось поменять комментарий с cid=${cid} - ${errorDiv.textContent.trim()}`;
                        logDebug(`Error in response for CID=${cid}: ${errorDiv.textContent.trim()}`);
                    } else {
                        status.textContent = `Успех: Коммент ${cid} ${visibility === '1' ? 'Спрятан!' : 'Показан!'}`;
                        logDebug(`Edit form submission successful for cid=${cid}`);
                    }
                } else {
                    status.textContent = `Ошибка: Не удалось ${visibility === '1' ? 'спрятать' : 'показать'} комментариий ${cid} (Status: ${response.status})`;
                    logDebug(`Edit form submission failed for cid=${cid} with status ${response.status}`);
                }
            },
            onerror: function() {
                status.textContent = `Error: Network issue during edit form submission for cid=${cid}`;
                logDebug(`Произошла ошибка в соединении с интернетом при попытке редактировать коммент с CID=${cid}`);
            }
        });
    }

    // Function to submit filter form for Comment Toggle
    function submitFilterForm(orderNum, commentText, positions, visibility) {
        logDebug('Submitting filter form...');
        const formData = [
            `email=`,
            `text=${encodeURIComponent(commentText || '')}`,
            `dateFrom=`,
            `dateTo=`,
            `order_id=${encodeURIComponent(orderNum)}`,
            `nick=`,
            `status_files=all`,
            `visible=all`,
            `userSubType=0`,
            `mysubmit=submitbuttonvalue`
        ].join('&');

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://a24.biz/admin/Comments/commentsList',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData,
            onload: function(response) {
                if (response.status === 200) {
                    logDebug('Filter form submission successful');
                    const comments = findComments(response.responseText, orderNum, commentText, positions);
                    if (comments.length > 0) {
                        comments.forEach(({ cid, commentText }) => {
                            fetchEditForm(cid, visibility, commentText, submitEditForm);
                        });
                        resetToggleButtons();
                    } else {
                        status.textContent = 'Ошибка: Не нашёлся такой комментарий';
                        logDebug('No comments found in filter response');
                    }
                } else {
                    status.textContent = `Ошибка: Не удалось даже попытаться найти коммент (Status: ${response.status})`;
                    logDebug(`Filter form submission failed with status ${response.status}`);
                }
            },
            onerror: function() {
                status.textContent = 'Произошла ошибка в соединении с интернетом при попытке редактировать коммент';
                logDebug('Network error during filter form submission');
            }
        });
    }
    // Function to handle hide/show action for Comment Toggle
    function handleAction(visibility) {
        const orderNum = orderNumInput.value.trim();
        const commentText = commentTextInput.value.trim();
        const positions = getSelectedPositions();

        if (!orderNum) {
            status.textContent = 'Пожалуйста, введите номер заказа';
            logDebug('Отсутствует номер заказа');
            return;
        }

        if (positions.length > 0 && commentText) {
            status.textContent = 'Пожалуйста, используйте либо текст комментария, либо кнопки позиций, но не оба';
            logDebug('Выбраны и текст комментария, и позиции; используйте что-то одно');
            return;
        }

        debug.innerHTML = '';
        status.textContent = 'Обработка...';
        submitFilterForm(orderNum, commentText, positions, visibility);
    }

    // Function to parse HTML and find complain href
    function findComplainHref(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tbody = doc.querySelector('tbody');
        if (!tbody) {
            logDebug('Таблица жалоб не найдена в ответе');
            return null;
        }

        const rows = tbody.querySelectorAll('tr');
        logDebug(`Найдено ${rows.length} строк жалоб в таблице`);
        if (rows.length === 0) {
            logDebug('Строки жалоб в таблице не найдены');
            return null;
        }

        const firstRow = rows[0];
        const link = firstRow.querySelector('td:nth-child(4) a');
        if (link && link.href) {
            logDebug(`Найдена ссылка на жалобу: ${link.href}`);
            return link.href;
        } else {
            logDebug('Ссылка на жалобу в таблице не найдена');
            return null;
        }
    }

    // Function to fetch complain form and extract CSRF token
    function fetchComplainForm(complainId, orderNum, callback) {
        logDebug(`Получение формы жалобы для id=${complainId}`);
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://a24.biz/admin_new/orderComplain/${complainId}`,
            onload: function(response) {
                if (response.status === 200) {
                    logDebug('Форма жалобы успешно получена');
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const form = doc.querySelector('form#complain-process-form');
                    let csrfToken = null;
                    if (form) {
                        const csrfInput = form.querySelector('input[name="_csrf"]');
                        if (csrfInput) {
                            csrfToken = csrfInput.value;
                            logDebug(`Найден CSRF-токен: ${csrfToken}`);
                        } else {
                            logDebug('CSRF-токен в форме не найден');
                        }

                        const bidElement = doc.querySelector('#bid');
                        const firstPayElement = doc.querySelector('#firstPay');
                        let payCustomer = '';
                        if (firstPayElement && !isNaN(parseFloat(firstPayElement.textContent))) {
                            payCustomer = parseFloat(firstPayElement.textContent);
                            logDebug(`Найдена сумма firstPay: ${payCustomer}`);
                        } else if (bidElement && !isNaN(parseFloat(bidElement.textContent))) {
                            payCustomer = parseFloat(bidElement.textContent);
                            logDebug(`Найдена сумма bid: ${payCustomer}`);
                        } else {
                            logDebug('Сумма bid или firstPay не найдена');
                        }

                        callback(complainId, orderNum, csrfToken, payCustomer);
                    } else {
                        logDebug('Форма жалобы в ответе не найдена');
                        complainErrorDiv.textContent = `Ошибка: Форма жалобы для id=${complainId} не найдена`;
                    }
                } else {
                    logDebug(`Ошибка получения формы жалобы, статус ${response.status}`);
                    complainErrorDiv.textContent = `Ошибка: Не удалось получить форму жалобы для id=${complainId} (Статус: ${response.status})`;
                }
            },
            onerror: function() {
                logDebug('Сетевая ошибка при получении формы жалобы');
                complainErrorDiv.textContent = `Ошибка: Сетевая проблема при получении формы жалобы для id=${complainId}`;
            }
        });
    }

    // Function to submit complain form
    function submitComplainForm(complainId, orderNum, csrfToken, payCustomer) {
        logDebug(`Отправка формы жалобы для id=${complainId}`);
        const formData = [
            `notChangeRating=on`,
            `pay_author=0`,
            `pay_customer=${encodeURIComponent(payCustomer)}`,
            `complain_select_customer=9`,
            `complain_select_author=10`,
            `customer_explain=${encodeURIComponent('Автор отказался от выполнения заказа.')}`,
            `author_explain=${encodeURIComponent('Автор отказался от выполнения заказа.')}`,
            `grade=1`,
            `submit=Отправить`
        ];
        if (csrfToken) {
            formData.push(`_csrf=${encodeURIComponent(csrfToken)}`);
        }
        const formDataString = formData.join('&');

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://a24.biz/admin_new/orderComplain/${complainId}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formDataString,
            onload: function(response) {
                if (response.status === 200) {
                    logDebug('Форма жалобы успешно отправлена');
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const errorDiv = doc.querySelector('.g2[style*="color: red"]');
                    if (errorDiv && errorDiv.textContent.trim()) {
                        logDebug(`Ошибка в ответе жалобы для id=${complainId}: ${errorDiv.textContent.trim()}`);
                        complainErrorDiv.textContent = `Ошибка: Не удалось обработать жалобу id=${complainId} - ${errorDiv.textContent.trim()}`;
                    } else {
                        complainResultDiv.textContent = `Успех: Жалоба id=${complainId} обработана`;
                        logDebug(`Форма жалобы успешно отправлена для id=${complainId}`);
                    }
                } else {
                    logDebug(`Ошибка отправки формы жалобы, статус ${response.status}`);
                    complainErrorDiv.textContent = `Ошибка: Не удалось обработать жалобу id=${complainId} (Статус: ${response.status})`;
                }
            },
            onerror: function() {
                logDebug('Сетевая ошибка при отправке формы жалобы');
                complainErrorDiv.textContent = `Ошибка: Сетевая проблема при отправке формы жалобы для id=${complainId}`;
            }
        });
    }

    // Function to submit complain filter form
    function submitComplainFilterForm(orderNum) {
        logDebug('Отправка формы фильтра жалоб...');
        const formData = [
            `id=${encodeURIComponent(orderNum)}`,
            `group=all`,
            `dateFrom=`,
            `dateTo=`,
            `status_order_complain=0`,
            `onlyOriginal=`,
            `authorManager=-1`,
            `isNeedAdmin=`,
            `managers=147`,
            `mysubmit=submitbuttonvalue`
        ].join('&');

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://a24.biz/admin_new/orderComplainsAgency',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData,
            onload: function(response) {
                if (response.status === 200) {
                    logDebug('Форма фильтра жалоб успешно отправлена');
                    const complainHref = findComplainHref(response.responseText);
                    if (complainHref) {
                        const complainId = complainHref.match(/orderComplain\/(\d+)/)?.[1];
                        if (complainId) {
                            fetchComplainForm(complainId, orderNum, submitComplainForm);
                        } else {
                            logDebug('ID жалобы не найден в ссылке');
                            complainErrorDiv.textContent = 'Ошибка: Не удалось извлечь ID жалобы';
                        }
                    } else {
                        complainErrorDiv.textContent = 'Ошибка: Жалоба для заказа не найдена';
                    }
                } else {
                    logDebug(`Ошибка отправки формы фильтра жалоб, статус ${response.status}`);
                    complainErrorDiv.textContent = `Ошибка: Не удалось отправить форму фильтра жалоб (Статус: ${response.status})`;
                }
            },
            onerror: function() {
                logDebug('Сетевая ошибка при отправке формы фильтра жалоб');
                complainErrorDiv.textContent = 'Ошибка: Сетевая проблема при отправке формы фильтра жалоб';
            }
        });
    }

    // Event listeners for Comment Toggle
    hideBtn.addEventListener('click', () => handleAction('1'));
    showBtn.addEventListener('click', () => handleAction('0'));

    // Complain Form submission handler
    complainForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const orderNum = complainOrderNumInput.value.trim();

        if (!orderNum) {
            logDebug('Не заполнено поле');
            complainErrorDiv.textContent = 'Пожалуйста, введите номер заказа';
            complainResultDiv.textContent = '';
            return;
        }

        complainResultDiv.textContent = 'Обработка...';
        complainErrorDiv.textContent = '';
        submitComplainFilterForm(orderNum);
    });

    // Popup Form submission handler
    popupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const userId = userIdInput.value.trim();
        const comment = commentInput.value.trim();
        console.log(userId);
        console.log(comment);

        if (!userId || !comment) {
            errorDiv.textContent = 'Пожалуйста, заполните все поля';
            resultDiv.textContent = '';
            return;
        }

        const formData = `reason=1&comment=${encodeURIComponent(comment)}`;

        GM_xmlhttpRequest({
        method: 'POST',
        url: `https://a24.biz/admin_new/ajaxAddWarnPopupToUser/${userId}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData,
        onload: function(response) {
            if (response.status === 200) {
                // Если сервер возвращает 200, считаем успехом (даже если ответ пустой)
                resultDiv.textContent = '✅ Попап успешно отправлен!';
                errorDiv.textContent = '';
            } else {
                errorDiv.textContent = `❌ Ошибка: Не удалось отправить попап (Статус: ${response.status})`;
                resultDiv.textContent = '';
            }
        },
        onerror: function() {
            errorDiv.textContent = '❌ Ошибка: Сетевая проблема при отправке';
            resultDiv.textContent = '';
        }
    });
});


})();