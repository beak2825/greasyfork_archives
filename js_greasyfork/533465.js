// ==UserScript==
// @name         (VIP) PEFL Features: Ненужные
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Добавляет расширенный функционал для страницы ненужных
// @author       Вы
// @match        *://*/nenuj.php?t=scout*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533465/%28VIP%29%20PEFL%20Features%3A%20%D0%9D%D0%B5%D0%BD%D1%83%D0%B6%D0%BD%D1%8B%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/533465/%28VIP%29%20PEFL%20Features%3A%20%D0%9D%D0%B5%D0%BD%D1%83%D0%B6%D0%BD%D1%8B%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для логирования
    function log(message, data) {
        console.log(`[ХодТоргов] ${message}`, data || '');
    }

    log('Скрипт запущен');

    // Функция для извлечения ID игрока из URL
    function extractPlayerIdFromUrl(url) {
        const match = url.match(/[?&]j=(\d+)/);
        return match ? match[1] : null;
    }

    // Создаем контейнер для времени с флекс-разметкой
    const timeContainer = document.createElement('div');
    timeContainer.style.display = 'flex';
    timeContainer.style.justifyContent = 'space-between';
    timeContainer.style.margin = '10px 0';
    timeContainer.style.padding = '5px';
    timeContainer.style.backgroundColor = '#f0f0f0';
    timeContainer.style.border = '1px solid #ccc';
    timeContainer.style.borderRadius = '3px';

    // Создаем элемент для отображения текущего времени
    const currentTimeDisplay = document.createElement('div');
    currentTimeDisplay.style.fontSize = '14px';
    currentTimeDisplay.style.fontWeight = 'bold';

    // Создаем элемент для заголовка
    const titleDisplay = document.createElement('div');
    titleDisplay.textContent = 'PF-Ненужные';
    titleDisplay.style.fontSize = '16px';
    titleDisplay.style.fontWeight = 'bold';
    titleDisplay.style.color = '#666';

    // Создаем элемент для отображения времени обновления
    const updatedTimeDisplay = document.createElement('div');
    updatedTimeDisplay.style.fontSize = '14px';
    updatedTimeDisplay.style.fontWeight = 'bold';

    // Функция форматирования времени
    function formatTime(date) {
        // Получаем текущее время в UTC
        const now = new Date(date);

        // Форматируем время в московском часовом поясе (UTC+3)
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Europe/Moscow'
        };

        // Возвращаем отформатированное московское время
        return new Intl.DateTimeFormat('ru-RU', options).format(now) + ' (МСК)';
    }

    // Функция обновления текущего времени
    function updateCurrentTime() {
        const now = new Date();
        currentTimeDisplay.innerHTML = '<span style="color:#666;">Текущее время:</span> ' + formatTime(now);
    }

    // Устанавливаем время обновления один раз
    const loadTime = new Date();
    updatedTimeDisplay.innerHTML = '<span style="color:#666;">Обновлено:</span> ' + formatTime(loadTime);

    // Обновляем текущее время сразу и затем каждую секунду
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Добавляем элементы в контейнер
    timeContainer.appendChild(currentTimeDisplay);
    timeContainer.appendChild(titleDisplay);
    timeContainer.appendChild(updatedTimeDisplay);

    // Находим таблицу на странице
    const tables = document.querySelectorAll('table[width="100%"][border="0"]');
    log('Найдено таблиц:', tables.length);

    if (tables.length > 0) {
        // Вставляем элемент с временем перед таблицей
        tables[0].parentNode.insertBefore(timeContainer, tables[0]);
    }

    // Задержка для запросов
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Счетчик запросов (для отслеживания и добавления задержки)
    let requestCounter = 0;

    // Хранилище данных профилей игроков
    let playerProfiles = JSON.parse(localStorage.getItem('playerProfiles') || '{}');
    log('Загружено профилей из localStorage:', Object.keys(playerProfiles).length);

    // Функция для получения дедлайна по позиции
    function getDeadlineByPosition(position) {
        // Приводим к нижнему регистру для упрощения проверки
        position = position.toLowerCase();

        // Проверяем наличие разных позиций по приоритету
        if (position.includes('fw')) {
            return '14:00';
        } else if (position.includes('dm') || position.includes('mf') || position.includes('am')) {
            return '14:30';
        } else if (position.includes('sw') || position.includes('df')) {
            return '15:00';
        } else if (position.includes('gk')) {
            return '15:30';
        } else {
            return 'Н/Д'; // Если позиция не определена
        }
    }

    // Функция для обработки строки контракта
    function processContractString(contractString) {
        // Если контракт содержит пробел, берем только вторую часть (сумму)
        const parts = contractString.split(' ');
        if (parts.length > 1) {
            return parts.slice(1).join(' ');
        }
        return contractString;
    }

    // Функция для извлечения ссылки "убрать"
    function extractRemoveLink(element) {
        // Ищем ссылку с текстом "убрать"
        const links = element.querySelectorAll('a');
        for (let i = 0; i < links.length; i++) {
            if (links[i].textContent.trim() === 'убрать') {
                return links[i].getAttribute('href');
            }
        }
        return null; // Не найдено
    }

    // Функция для извлечения значения интереса
    function extractInterest(element) {
        // Ищем элемент с ID "td4", содержащий информацию об интересе
        const interestCell = element.querySelector('td#td4');
        if (interestCell) {
            // Извлекаем число в скобках из текста
            const match = interestCell.textContent.match(/\((\d+)\)/);
            if (match && match[1]) {
                return parseInt(match[1], 10);
            }
        }
        return null; // Не найдено
    }

    // Функция для получения данных профиля игрока
    async function getPlayerProfile(playerName, profileUrl) {
        // Извлекаем ID игрока из URL
        const playerId = extractPlayerIdFromUrl(profileUrl);

        if (!playerId) {
            log(`Не удалось извлечь ID для игрока ${playerName} из URL ${profileUrl}`);
            return null;
        }

        // Проверяем, есть ли данные в кэше по ID
        if (playerProfiles[playerId]) {
            log(`Данные профиля для игрока ${playerName} (ID: ${playerId}) загружены из кэша`);
            return playerProfiles[playerId];
        }

        log(`Получение данных профиля для ${playerName} (ID: ${playerId}) из ${profileUrl}`);

        // Добавляем задержку перед каждым запросом
        await delay(500 * requestCounter);
        requestCounter++;

        // Формируем полный URL, если это относительный путь
        let fullUrl = profileUrl;
        if (profileUrl.startsWith('/')) {
            fullUrl = window.location.origin + profileUrl;
        } else if (!profileUrl.startsWith('http')) {
            fullUrl = window.location.origin + '/' + profileUrl;
        }

        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: fullUrl,
                    onload: function(response) {
                        if (response.status === 200) {
                            // Создаем временный элемент для парсинга HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = response.responseText;

                            // Извлекаем возраст (только число)
                            let age = extractTextAfterLabel(tempDiv, 'Возраст:');
                            // Оставляем только число, убираем буквы
                            if (age) {
                                const ageMatch = age.match(/\d+/);
                                age = ageMatch ? ageMatch[0] : 'Н/Д';
                            }

                            // Получаем позицию
                            const position = extractTextAfterLabel(tempDiv, 'Позиция:');

                            // Получаем контракт и обрабатываем его
                            const contractRaw = extractTextAfterLabel(tempDiv, 'Контракт:');
                            const contract = processContractString(contractRaw);

                            // Извлекаем данные профиля
                            const playerData = {
                                // Сохраняем имя игрока
                                name: playerName,
                                // Возраст (только число)
                                age: age,
                                // Позиция
                                position: position,
                                // Дедлайн
                                deadline: getDeadlineByPosition(position || ''),
                                // Номинал
                                value: extractValueFromProfile(tempDiv),
                                // Контракт (только сумма)
                                contract: contract,
                                // ID флага
                                flagId: extractFlagId(tempDiv),
                                // Ссылка "убрать"
                                removeLink: extractRemoveLink(tempDiv),
                                // Значение интереса
                                interest: extractInterest(tempDiv)
                            };

                            log(`Данные профиля для ${playerName}:`, playerData);

                            // Сохраняем данные в кэш
                            playerProfiles[playerId] = playerData;
                            localStorage.setItem('playerProfiles', JSON.stringify(playerProfiles));

                            resolve(playerData);
                        } else {
                            log(`Ошибка запроса профиля:`, response.status);
                            resolve(null);
                        }
                    },
                    onerror: function(error) {
                        log(`Ошибка запроса профиля:`, error);
                        resolve(null);
                    }
                });
            } catch (e) {
                log('Исключение при выполнении запроса профиля:', e);
                resolve(null);
            }
        });
    }

    // Функция для извлечения текста после метки
    function extractTextAfterLabel(element, label) {
        // Ищем все текстовые узлы
        const textNodes = [];
        const walkNodes = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walkNodes.nextNode()) {
            textNodes.push(node);
        }

        // Ищем текстовый узел с нашей меткой
        for (let i = 0; i < textNodes.length; i++) {
            if (textNodes[i].textContent.trim() === label) {
                // Если нашли узел с меткой, берем следующий узел
                if (i + 1 < textNodes.length) {
                    return textNodes[i + 1].textContent.trim();
                }
            }
        }

        // Альтернативный метод для поиска: через ячейки таблицы
        const cells = element.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent.trim() === label && i + 1 < cells.length) {
                return cells[i + 1].textContent.trim();
            }
        }

        return 'Н/Д'; // Не найдено
    }

    // Функция для извлечения номинала
    function extractValueFromProfile(element) {
        // Ищем ячейку с ID value0
        const valueCell = element.querySelector('td#value0');
        if (valueCell && valueCell.nextElementSibling) {
            return valueCell.nextElementSibling.textContent.trim();
        }

        // Альтернативный поиск по тексту "Номинал:"
        const cells = element.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent.trim() === 'Номинал:' && i + 1 < cells.length) {
                return cells[i + 1].textContent.trim();
            }
        }

        return 'Н/Д'; // Не найдено
    }

    // Функция для извлечения ID флага
    function extractFlagId(element) {
        // Ищем ячейку с ID nation_img
        const nationCell = element.querySelector('td#nation_img');
        if (nationCell) {
            const flagImg = nationCell.querySelector('img');
            if (flagImg && flagImg.src) {
                // Извлекаем ID из URL флага
                const match = flagImg.src.match(/flags\/mod\/(\d+)\.gif/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }

        return null; // Не найдено
    }

    // Добавляем функцию для фонового удаления игрока
    function removePlayerBackground(removeLink, rowElement) {
        log('Фоновое удаление игрока по ссылке:', removeLink);

        // Формируем полный URL, если это относительный путь
        let fullUrl = removeLink;
        if (removeLink.startsWith('/')) {
            fullUrl = window.location.origin + removeLink;
        } else if (!removeLink.startsWith('http')) {
            fullUrl = window.location.origin + '/' + removeLink;
        }

        // Выполняем запрос для удаления игрока
        GM_xmlhttpRequest({
            method: 'GET',
            url: fullUrl,
            onload: function(response) {
                if (response.status === 200) {
                    log('Игрок успешно удален');

                    // Анимация удаления строки
                    rowElement.style.transition = 'opacity 0.5s ease-out';
                    rowElement.style.opacity = '0';

                    // Удаляем строку после завершения анимации
                    setTimeout(function() {
                        if (rowElement && rowElement.parentNode) {
                            rowElement.parentNode.removeChild(rowElement);
                        }
                    }, 500);
                } else {
                    log('Ошибка при удалении игрока:', response.status);
                    alert('Ошибка при удалении игрока. Попробуйте перезагрузить страницу и повторить попытку.');
                }
            },
            onerror: function(error) {
                log('Ошибка при удалении игрока:', error);
                alert('Ошибка при удалении игрока. Проверьте ваше интернет-соединение и повторите попытку.');
            }
        });
    }

    tables.forEach(table => {
        log('Обработка таблицы');
        // Добавляем бордер к таблице
        table.style.border = '1px solid #000';
        table.style.borderCollapse = 'collapse';

        // Добавляем бордер к ячейкам таблицы
        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '3px';
        });

        // Находим ссылки с именами игроков и меняем их поведение
        const playerLinks = table.querySelectorAll('td:first-child a');

        playerLinks.forEach(link => {
            // Добавляем target="_blank" для открытия в новом окне
            link.setAttribute('target', '_blank');

            // Дополнительно, можно добавить подсветку при наведении
            link.style.textDecoration = 'none';
            link.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#f0f0f0';
            });
            link.addEventListener('mouseout', function() {
                this.style.backgroundColor = '';
            });
        });

        // Функция для преобразования текстовой ставки в числовое значение
        function parseBidValue(bidText) {
            bidText = bidText.trim();

            // Удаляем все теги script, если они есть
            bidText = bidText.replace(/<script[\s\S]*?<\/script>/gi, '');

            // Удаляем все HTML-теги, если они есть
            bidText = bidText.replace(/<[^>]*>/g, '');

            let value = 0;

            if (bidText.includes('тыс.')) {
                // Если ставка в тысячах, умножаем на 1000
                value = parseFloat(bidText) * 1000;
            } else if (bidText.includes('М')) {
                // Если ставка в миллионах, умножаем на 1000000
                value = parseFloat(bidText) * 1000000;
            } else {
                // Попытка просто извлечь число
                const match = bidText.match(/\d+(\.\d+)?/);
                if (match) {
                    value = parseFloat(match[0]);
                }
            }

            return value;
        }

        // Функция для подсчета количества "Отправлено" на странице и проверки наличия определенных фраз
        async function analyzeBidPage(url, index, callback) {
            // Добавляем задержку перед каждым запросом
            await delay(500 * requestCounter);
            requestCounter++;

            // Формируем полный URL, если это относительный путь
            let fullUrl = url;
            if (url.startsWith('nenuj.php')) {
                fullUrl = window.location.origin + '/' + url;
            }

            log(`Выполняем запрос #${requestCounter} к URL:`, fullUrl);

            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: fullUrl,
                    onload: function(response) {
                        log(`Ответ для запроса #${requestCounter}:`, {
                            status: response.status,
                            responseLength: response.responseText ? response.responseText.length : 0
                        });

                        if (response.status === 200) {
                            // Создаем временный элемент для парсинга HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = response.responseText;

                            // Проверяем, что получили в ответе
                            log('HTML-содержимое получено, длина:', tempDiv.innerHTML.length);

                            // Ищем все вхождения "Отправлено" в тексте
                            const text = tempDiv.textContent || tempDiv.innerText;
                            log('Текстовое содержимое, начало:', text.substring(0, 100));

                            // Ищем просто "Отправлено" без звездочек
                            const regex = /Отправлено/g;
                            const matches = text.match(regex);
                            const count = matches ? matches.length : 0;

                            // Проверяем наличие определенных фраз
                            const hasThinkingPhrase = text.includes('Условия контракта ухудшены покупателем, игрок думает');
                            const hasContractOfferedPhrase = text.includes('Контракт предложен');
                            const hasSpecialPhrase = hasThinkingPhrase || hasContractOfferedPhrase;

                            // Анализируем текст над вторым <hr>
                            let textBeforeSecondHr = '';
                            const hrElements = tempDiv.querySelectorAll('hr');
                            if (hrElements.length >= 2) {
                                // Получаем родительский элемент второго <hr>
                                const secondHr = hrElements[1];
                                const parent = secondHr.parentNode;

                                // Ищем все узлы текста до второго <hr>
                                let foundHr = 0;
                                for (let i = 0; i < parent.childNodes.length; i++) {
                                    const node = parent.childNodes[i];

                                    if (node === secondHr) {
                                        // Это второй <hr>, прекращаем искать
                                        break;
                                    }

                                    if (node.nodeName === 'HR') {
                                        // Это первый <hr>, начинаем собирать текст
                                        foundHr = 1;
                                        continue;
                                    }

                                    if (foundHr === 1 && node.nodeType === Node.TEXT_NODE) {
                                        // Собираем текст между первым и вторым <hr>
                                        textBeforeSecondHr += node.textContent;
                                    } else if (foundHr === 1 && node.nodeType === Node.ELEMENT_NODE) {
                                        // Для элементов берём их текстовое содержимое
                                        textBeforeSecondHr += node.textContent;
                                    }
                                }

                                textBeforeSecondHr = textBeforeSecondHr.trim();
                                log(`Текст перед вторым HR: "${textBeforeSecondHr}"`);
                            } else {
                                log('Не найдено двух тегов HR на странице');
                            }

                            // Определяем цвет для окраски суммы
                            let textColor = '#b09a40'; // Более тёмный желтый
                            if (textBeforeSecondHr.includes('Условия контракта ухудшены покупателем, игрок думает') ||
                                textBeforeSecondHr.includes('Контракт предложен')) {
                                textColor = '#445577'; // Более тёмный синий
                            }

                            log(`Найдено "Отправлено" для строки ${index}:`, count);
                            log(`Найдены специальные фразы для строки ${index}:`, hasSpecialPhrase);
                            log(`Цвет текста для строки ${index}:`, textColor);

                            callback(count, hasSpecialPhrase, textColor);
                        } else {
                            log(`Ошибка запроса #${requestCounter}:`, response.status);
                            callback(0, false, 'none'); // В случае ошибки возвращаем 0, false и 'none'
                        }
                    },
                    onerror: function(error) {
                        log(`Ошибка запроса #${requestCounter}:`, error);
                        callback(0, false, 'none'); // В случае ошибки возвращаем 0, false и 'none'
                    }
                });
            } catch (e) {
                log('Исключение при выполнении запроса:', e);
                callback(0, false, 'none');
            }
        }

        // Сортировка строк таблицы
        // Сначала получаем заголовок таблицы (первую строку)
        const headerRow = table.querySelector('tr');

        // Стилизуем заголовок таблицы
        headerRow.style.backgroundColor = '#e0e0e0'; // Светло-серый фон для заголовка
        headerRow.style.fontWeight = 'bold';

        // Добавляем новую ячейку в заголовок для нумерации
        const numHeaderCell = document.createElement('td');
        numHeaderCell.innerHTML = '<b>№</b>';
        numHeaderCell.style.border = '1px solid #ccc';
        numHeaderCell.style.padding = '3px';
        headerRow.insertBefore(numHeaderCell, headerRow.firstChild);

        // Добавляем новые ячейки в заголовок для данных профиля
        const deadlineHeaderCell = document.createElement('td');
        deadlineHeaderCell.innerHTML = '<b>Дедлайн</b>';
        deadlineHeaderCell.style.border = '1px solid #ccc';
        deadlineHeaderCell.style.padding = '3px';
        headerRow.insertBefore(deadlineHeaderCell, headerRow.children[2]); // После имени игрока

        const ageHeaderCell = document.createElement('td');
        ageHeaderCell.innerHTML = '<b>Возраст</b>';
        ageHeaderCell.style.border = '1px solid #ccc';
        ageHeaderCell.style.padding = '3px';
        headerRow.insertBefore(ageHeaderCell, headerRow.children[3]); // После дедлайна

        const positionHeaderCell = document.createElement('td');
        positionHeaderCell.innerHTML = '<b>Позиция</b>';
        positionHeaderCell.style.border = '1px solid #ccc';
        positionHeaderCell.style.padding = '3px';
        headerRow.insertBefore(positionHeaderCell, headerRow.children[4]); // После возраста

        const valueHeaderCell = document.createElement('td');
        valueHeaderCell.innerHTML = '<b>Номинал</b>';
        valueHeaderCell.style.border = '1px solid #ccc';
        valueHeaderCell.style.padding = '3px';
        headerRow.insertBefore(valueHeaderCell, headerRow.children[5]); // После позиции

        const contractHeaderCell = document.createElement('td');
        contractHeaderCell.innerHTML = '<b>Контракт</b>';
        contractHeaderCell.style.border = '1px solid #ccc';
        contractHeaderCell.style.padding = '3px';
        headerRow.insertBefore(contractHeaderCell, headerRow.children[6]); // После номинала

        // Добавляем новую ячейку в заголовок для количества "Отправлено"
        const sentHeaderCell = document.createElement('td');
        sentHeaderCell.innerHTML = '<b>Кол-во ставок</b>';
        sentHeaderCell.style.border = '1px solid #ccc';
        sentHeaderCell.style.padding = '3px';

        // Добавляем новую ячейку в заголовок для статуса хорошего контракта
        const bidContractHeaderCell = document.createElement('td');
        bidContractHeaderCell.innerHTML = '<b>Хор. контракт</b>';
        bidContractHeaderCell.style.border = '1px solid #ccc';
        bidContractHeaderCell.style.padding = '3px';

        // Создаем пустую ячейку для заголовка колонки с "Ход торгов"
        const bidLinkHeaderCell = document.createElement('td');
        bidLinkHeaderCell.style.border = '1px solid #ccc';
        bidLinkHeaderCell.style.padding = '3px';

        // Добавляем в правильном порядке на один столбец влево
        // Сначала находим ячейку, перед которой нужно вставить
        const beforeCell = headerRow.children[headerRow.children.length - 1];

        // Очищаем заголовок и добавляем все ячейки заново в правильном порядке
        // Сохраняем первую ячейку (номер) и удаляем остальные
        const firstHeaderCell = headerRow.firstChild;
        while (headerRow.childNodes.length > 1) {
            headerRow.removeChild(headerRow.lastChild);
        }

        // Добавляем все заголовки по порядку
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Игрок</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Дедлайн</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Возраст</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Позиция</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Номинал</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Контракт</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Интерес</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>ИД</b>'; // Для "2 ИД"
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Макс. ставка</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Кол-во ставок</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = '<b>Хор. контракт</b>';
        headerRow.appendChild(document.createElement('td')).innerHTML = ''; // Для "Ход торгов"

        // Стилизуем все заголовки
        headerRow.querySelectorAll('td').forEach(cell => {
            cell.style.border = '1px solid #ccc';
            cell.style.padding = '3px';
        });

        // Получаем все строки с данными (кроме заголовка)
        const rows = Array.from(table.querySelectorAll('tr')).slice(1);
        log('Найдено строк в таблице:', rows.length);

        // Сортируем строки по критериям
        rows.sort((a, b) => {
            const hasIdA = a.querySelector('td:nth-child(2)').textContent.trim() === '2 ИД';
            const hasIdB = b.querySelector('td:nth-child(2)').textContent.trim() === '2 ИД';

            // Если один имеет 2 ИД, а другой нет
            if (hasIdA && !hasIdB) return -1;
            if (!hasIdA && hasIdB) return 1;

            // Если оба имеют или оба не имеют 2 ИД, сортируем по максимальной ставке
            const bidA = parseBidValue(a.querySelector('td:nth-child(3)').textContent);
            const bidB = parseBidValue(b.querySelector('td:nth-child(3)').textContent);

            if (bidA > bidB) return -1;
            if (bidA < bidB) return 1;

            // Если ставки равны, сортируем по имени
            const nameA = a.querySelector('td:first-child a').textContent.trim();
            const nameB = b.querySelector('td:first-child a').textContent.trim();
            return nameA.localeCompare(nameB, 'ru');
        });

        // Находим ячейки с "Ход торгов" для перемещения их в конец таблицы
        rows.forEach(row => {
            // Находим все ячейки строки
            const rowCells = row.querySelectorAll('td');

            // Ищем ячейку с ссылкой "Ход торгов"
            let bidLinkCell = null;

            for (let i = 0; i < rowCells.length; i++) {
                const links = rowCells[i].querySelectorAll('a');

                for (let j = 0; j < links.length; j++) {
                    const linkText = links[j].textContent.trim();
                    if (linkText === 'Ход торгов' || linkText === 'ход торгов' ||
                        linkText === 'Хoд тoргoв' || linkText === 'хoд тoргoв') {
                        bidLinkCell = rowCells[i];
                        break;
                    }
                }

                if (bidLinkCell) break;
            }

            // Если нашли ячейку с "Ход торгов", помечаем её атрибутом для последующего перемещения
            if (bidLinkCell) {
                bidLinkCell.setAttribute('data-bid-link-cell', 'true');
            }
        });

        // Удаляем все строки из таблицы
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }

        // Добавляем заголовок обратно
        table.appendChild(headerRow);

        // Добавляем отсортированные строки с нумерацией
        let idCounter = 1; // Счетчик для строк с "2 ИД"
        let noIdCounter = 1; // Счетчик для строк без "2 ИД"
        let lastWasWithId = true; // Флаг для определения перехода между группами
        let isFirstRow = true; // Флаг для первой строки

        // Обрабатываем каждую строку
        rows.forEach((row, rowIndex) => {
            // Удаляем ячейку "Ход торгов" из её текущего положения, чтобы добавить в конец
            let bidLinkCell = null;
            const bidLinkCellElement = row.querySelector('td[data-bid-link-cell="true"]');

            if (bidLinkCellElement) {
                bidLinkCell = bidLinkCellElement.cloneNode(true);
                row.removeChild(bidLinkCellElement);
            }

            // Добавляем ячейку с номером
            const numCell = document.createElement('td');

            // Определяем, есть ли у строки "2 ИД"
            const hasId = row.querySelector('td:nth-child(2)').textContent.trim() === '2 ИД';

            // Проверяем переход между группами
            if (!isFirstRow && hasId !== lastWasWithId) {
                // Если переход между группами, добавляем стилизованный разделитель
                const separatorRow = document.createElement('tr');

                // Создаем ячейку, которая растягивается на всю ширину таблицы
                const separatorCell = document.createElement('td');
                separatorCell.colSpan = headerRow.cells.length;
                separatorCell.style.height = '3px';
                separatorCell.style.backgroundColor = '#aabbcc'; // Более мягкий сине-серый цвет
                separatorCell.style.padding = '0';
                separatorCell.style.border = 'none';

                separatorRow.appendChild(separatorCell);
                table.appendChild(separatorRow);

                lastWasWithId = hasId;
            }

            if (isFirstRow) {
                isFirstRow = false;
                lastWasWithId = hasId;
            }

            // Устанавливаем цвет фона в зависимости от группы
            if (hasId) {
                row.style.backgroundColor = '#f8f8f8'; // Светло-серый фон для строк с "2 ИД"
                numCell.textContent = idCounter++;
            } else {
                row.style.backgroundColor = '#e8f4ff'; // Светло-голубой фон для строк без "2 ИД"
                numCell.textContent = noIdCounter++;
            }

            numCell.style.border = '1px solid #ccc';
            numCell.style.padding = '3px';
            numCell.style.textAlign = 'center';

            // Делаем номер строки кликабельным
            numCell.style.cursor = 'pointer';

            // Получаем ссылку на игрока и его имя
            const playerLink = row.querySelector('td:first-child a');
            const playerName = playerLink.textContent.trim();
            const profileUrl = playerLink.getAttribute('href');

            // Проверяем, отмечен ли уже этот игрок в localStorage по ID
            const playerId = extractPlayerIdFromUrl(profileUrl);
            // Проверяем, отмечен ли уже этот игрок в localStorage
            const markedPlayers = JSON.parse(localStorage.getItem('markedPlayers') || '{}');
            const isMarked = playerId && markedPlayers[playerId] === true;

            // Применяем стиль круга, если игрок отмечен
            if (isMarked) {
                numCell.style.backgroundColor = '#ffeecc';
            }

            // Добавляем обработчик события клика
            numCell.addEventListener('click', function(event) {
                // Получаем текущих отмеченных игроков
                const currentMarkedPlayers = JSON.parse(localStorage.getItem('markedPlayers') || '{}');

                const clickedPlayerId = extractPlayerIdFromUrl(profileUrl);
                if (!clickedPlayerId) {
                    log(`Не удалось извлечь ID для игрока ${playerName}`);
                    return;
                }

                // Переключаем состояние отметки по ID
                if (currentMarkedPlayers[clickedPlayerId]) {
                    // Убираем отметку
                    delete currentMarkedPlayers[clickedPlayerId];
                    this.style.borderRadius = '';
                    this.style.border = '1px solid #ccc';
                    this.style.backgroundColor = '';
                } else {
                    // Добавляем отметку
                    currentMarkedPlayers[clickedPlayerId] = true;
                    this.style.backgroundColor = '#ffeecc';
                }

                // Сохраняем обновленный список отмеченных игроков в localStorage
                localStorage.setItem('markedPlayers', JSON.stringify(currentMarkedPlayers));

                // Предотвращаем распространение события
                event.stopPropagation();
            });

            // Вставляем ячейку в начало строки
            row.insertBefore(numCell, row.firstChild);

            // Получаем текущую ячейку с именем игрока
            const nameCell = row.querySelector('td:nth-child(2)');

            // Добавляем ячейки для данных профиля
            const deadlineCell = document.createElement('td');
            deadlineCell.style.border = '1px solid #ccc';
            deadlineCell.style.padding = '3px';
            deadlineCell.style.textAlign = 'center';
            deadlineCell.textContent = 'Загрузка...';

            const ageCell = document.createElement('td');
            ageCell.style.border = '1px solid #ccc';
            ageCell.style.padding = '3px';
            ageCell.style.textAlign = 'center';
            ageCell.textContent = 'Загрузка...';

            const positionCell = document.createElement('td');
            positionCell.style.border = '1px solid #ccc';
            positionCell.style.padding = '3px';
            positionCell.style.textAlign = 'center';
            positionCell.textContent = 'Загрузка...';

            const valueCell = document.createElement('td');
            valueCell.style.border = '1px solid #ccc';
            valueCell.style.padding = '3px';
            valueCell.style.textAlign = 'right';
            valueCell.textContent = 'Загрузка...';

            const contractPlayerCell = document.createElement('td');
            contractPlayerCell.style.border = '1px solid #ccc';
            contractPlayerCell.style.padding = '3px';
            contractPlayerCell.style.textAlign = 'center';
            contractPlayerCell.textContent = 'Загрузка...';

            const interestCell = document.createElement('td');
            interestCell.style.border = '1px solid #ccc';
            interestCell.style.padding = '3px';
            interestCell.style.textAlign = 'center';
            interestCell.textContent = 'Загрузка...';

            // Добавляем ячейку для количества "Отправлено"
            const sentCell = document.createElement('td');
            sentCell.style.border = '1px solid #ccc';
            sentCell.style.padding = '3px';
            sentCell.style.textAlign = 'center';

            // Добавляем ячейку для статуса хорошего контракта
            const bidContractCell = document.createElement('td');
            bidContractCell.style.border = '1px solid #ccc';
            bidContractCell.style.padding = '3px';
            bidContractCell.style.textAlign = 'center';

            // Вставляем новые ячейки после ячейки с именем
            row.insertBefore(deadlineCell, nameCell.nextSibling);
            row.insertBefore(ageCell, deadlineCell.nextSibling);
            row.insertBefore(positionCell, ageCell.nextSibling);
            row.insertBefore(valueCell, positionCell.nextSibling);
            row.insertBefore(contractPlayerCell, valueCell.nextSibling);
            row.insertBefore(interestCell, contractPlayerCell.nextSibling);

            // Получаем данные профиля
            getPlayerProfile(playerName, profileUrl).then(profileData => {
                if (profileData) {
                    // Обновляем ячейку с именем - добавляем флаг
                    if (profileData.flagId) {
                        const flagUrl = `system/img/flags/mod/${profileData.flagId}.gif`;
                        const flagImg = document.createElement('img');
                        flagImg.src = flagUrl;
                        flagImg.style.height = '16px';
                        flagImg.style.marginRight = '5px';
                        flagImg.style.verticalAlign = 'middle';
                        flagImg.style.border = '0';

                        // Вставляем флаг перед текстом имени
                        nameCell.insertBefore(flagImg, nameCell.firstChild);
                    }

                    // Добавляем кнопку "x" для удаления
                    if (profileData.removeLink) {
                        const removeButton = document.createElement('span');
                        removeButton.textContent = ' x';
                        removeButton.style.color = 'red';
                        removeButton.style.fontWeight = 'bold';
                        removeButton.style.cursor = 'pointer';
                        removeButton.style.marginLeft = '5px';
                        removeButton.title = 'Удалить игрока';

                        // Обработчик клика
                        removeButton.addEventListener('click', function(event) {
                            event.preventDefault();
                            event.stopPropagation();

                            if (confirm(`Удалить игрока ${playerName} из листка скаута?`)) {
                                removePlayerBackground(profileData.removeLink, row);
                            }
                        });

                        nameCell.appendChild(removeButton);
                    }

                    // Заполняем ячейки данными
                    deadlineCell.textContent = profileData.deadline;
                    ageCell.textContent = profileData.age;
                    positionCell.textContent = profileData.position;
                    valueCell.textContent = profileData.value;
                    contractPlayerCell.textContent = profileData.contract;

                    // Заполняем ячейку интереса
                    if (profileData.interest !== null && profileData.interest !== undefined) {
                        interestCell.textContent = profileData.interest;
                    } else {
                        interestCell.textContent = '—';
                        interestCell.style.color = '#999'; // Серый цвет для прочерка
                    }
                }
            });

            // Проверяем, имеет ли строка "2 ИД" - только для них делаем запросы для хода торгов
            if (hasId) {
                sentCell.textContent = 'Загрузка...';
                bidContractCell.textContent = '...';

                // Находим ячейку с максимальной ставкой (теперь она будет дальше из-за добавленных ячеек)
                const maxBidCellIndex = 9; // Индекс ячейки с максимальной ставкой после добавления новых ячеек
                const maxBidCell = row.querySelector(`td:nth-child(${maxBidCellIndex + 1})`); // +1 из-за добавленной ячейки нумерации

                // Ищем ссылку "Ход торгов" в строке
                let bidLink = null;

                // Если у нас есть сохраненная ячейка с "Ход торгов"
                if (bidLinkCell) {
                    const links = bidLinkCell.querySelectorAll('a');

                    for (let i = 0; i < links.length; i++) {
                        const linkText = links[i].textContent.trim();
                        const linkHref = links[i].getAttribute('href');

                        // Проверяем текст ссылки (разные варианты написания)
                        if (linkText === 'Ход торгов') {
                            bidLink = linkHref;
                            log(`Строка ${rowIndex}: найдена ссылка "Ход торгов":`, bidLink);
                            break;
                        }

                        // Если не нашли по тексту, проверяем URL на наличие параметра t=list
                        if (!bidLink && linkHref && linkHref.includes('t=list')) {
                            bidLink = linkHref;
                            log(`Строка ${rowIndex}: найдена ссылка по URL (t=list):`, bidLink);
                            break;
                        }
                    }
                }

                // Если нашли ссылку, получаем количество "Отправлено" и проверяем наличие фраз
                if (bidLink) {
                    analyzeBidPage(bidLink, rowIndex, function(count, hasSpecialPhrase, textColor) {
                        // Устанавливаем количество "Отправлено"
                        sentCell.textContent = count;

                        // Создаем кружок для отображения статуса контракта
                        const circle = document.createElement('div');
                        circle.style.width = '12px';
                        circle.style.height = '12px';
                        circle.style.borderRadius = '50%';
                        circle.style.margin = '0 auto'; // Центрируем кружок в ячейке

                        if (hasSpecialPhrase) {
                            // Закрашенный кружок мягкого цвета
                            circle.style.backgroundColor = '#aabbcc'; // Такой же цвет, как у разделителя групп
                        } else {
                            // Полый кружок
                            circle.style.border = '2px solid #aabbcc';
                            circle.style.width = '8px'; // Компенсируем ширину бордера
                            circle.style.height = '8px'; // Компенсируем ширину бордера
                        }

                        // Добавляем кружок в ячейку контракта
                        bidContractCell.innerHTML = '';
                        bidContractCell.appendChild(circle);

                        // Добавляем цветовую индикацию в зависимости от количества (обратный порядок)
                        if (count > 10) {
                            sentCell.style.backgroundColor = '#ffd6d6'; // Светло-красный для больших значений
                        } else if (count > 5) {
                            sentCell.style.backgroundColor = '#ffffd6'; // Светло-желтый для средних значений
                        } else if (count > 0) {
                            sentCell.style.backgroundColor = '#d6ffd6'; // Светло-зеленый для малых значений
                        }

                        // Окрашиваем сумму максимальной ставки в соответствующий цвет
                        if (textColor !== 'none' && maxBidCell) {
                            maxBidCell.style.color = textColor;
                            maxBidCell.style.fontWeight = 'bold';

                            // Добавляем всплывающую подсказку в зависимости от цвета
                            if (textColor === '#b09a40') { // Желтый цвет
                                maxBidCell.title = 'Плохой контракт';
                            } else if (textColor === '#445577') { // Синий цвет
                                maxBidCell.title = 'Хороший контракт';
                            }
                        }
                    });
                } else {
                    log(`Строка ${rowIndex}: ссылка "Ход торгов" не найдена`);
                    sentCell.textContent = 'Н/Д';
                    bidContractCell.textContent = '—';
                }
            } else {
                // Для строк без "2 ИД" просто выводим тире
                sentCell.textContent = '—';
                sentCell.style.color = '#999'; // Серый цвет для символа тире
                bidContractCell.textContent = '—';
                bidContractCell.style.color = '#999'; // Серый цвет для символа тире
            }

            // Добавляем ячейки в конец строки
            row.appendChild(sentCell);
            row.appendChild(bidContractCell);

            // Добавляем ячейку "Ход торгов" в конец строки, если она была найдена
            if (bidLinkCell) {
                row.appendChild(bidLinkCell);
            } else {
                // Создаем пустую ячейку, если у строки нет ссылки "Ход торгов"
                const emptyCell = document.createElement('td');
                emptyCell.style.border = '1px solid #ccc';
                emptyCell.style.padding = '3px';
                row.appendChild(emptyCell);
            }

            // Добавляем строку в таблицу
            table.appendChild(row);
        });

        // Добавляем кнопку для очистки кэша профилей
        const clearCacheButton = document.createElement('button');
        clearCacheButton.textContent = 'Очистить кэш профилей';
        clearCacheButton.style.marginTop = '10px';
        clearCacheButton.style.padding = '5px 10px';
        clearCacheButton.style.backgroundColor = '#f0f0f0';
        clearCacheButton.style.border = '1px solid #ccc';
        clearCacheButton.style.borderRadius = '3px';
        clearCacheButton.style.cursor = 'pointer';

        clearCacheButton.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите очистить кэш профилей игроков? Данные будут загружены заново при следующем обновлении страницы.')) {
                localStorage.removeItem('playerProfiles');
                localStorage.removeItem('markedPlayers'); // Очищаем также и отмеченных игроков
                alert('Кэш профилей очищен. Обновите страницу для загрузки данных заново.');
                location.reload();
            }
        });

        // Добавляем кнопку после таблицы
        table.parentNode.insertBefore(clearCacheButton, table.nextSibling);
    });

    // Добавляем ссылку на форум справа под hr
    const forumLinkContainer = document.createElement('div');
    forumLinkContainer.style.textAlign = 'right';
    forumLinkContainer.style.margin = '10px 0';

    const forumLink = document.createElement('a');
    forumLink.href = '/forums.php?m=posts&p=16393540&arch=#16393540';
    forumLink.textContent = 'Топ аддона на форуме';
    forumLink.target = '_blank'; // Открывать в новом окне
    forumLink.style.textDecoration = 'none';
    forumLink.style.color = '#445577';
    forumLink.style.fontWeight = 'bold';

    forumLinkContainer.appendChild(forumLink);

    // Находим hr и вставляем ссылку после него
    const hrElements = document.querySelectorAll('hr');
    if (hrElements.length > 0) {
        const lastHr = hrElements[hrElements.length - 1];
        lastHr.parentNode.insertBefore(forumLinkContainer, lastHr.nextSibling);
    }
})();