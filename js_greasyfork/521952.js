// ==UserScript==
// @name         Game Data Collector with Pagination
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Собирает данные об играх с пагинацией и сохранением в XLSX
// @match        https://www.playground.ru/adm/game/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/521952/Game%20Data%20Collector%20with%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/521952/Game%20Data%20Collector%20with%20Pagination.meta.js
// ==/UserScript==

/* global XLSX */

(function() {
    'use strict';

    // Добавляем стили для модальных окон
    const styles = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
    }

    .modal-buttons {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    let currentIndex = 0;
    let isProcessing = false;
    let isPaginationProcessing = false;
    let currentPage = 1;
    let progressBar, progressText, resumeButton, pauseButton, statusText, saveButton, urlInput;

    // Функции для работы с хранилищем
    function getStoredGameIds() {
        return GM_getValue('storedGameIds', []);
    }

    function getStoredData() {
        return GM_getValue('collectedData', []);
    }

    function storeGameIds(ids) {
        GM_setValue('storedGameIds', ids);
    }

    function storeData(data) {
        GM_setValue('collectedData', data);
    }

    function getStoredIndex() {
        return GM_getValue('currentIndex', 0);
    }

    function storeCurrentIndex(index) {
        GM_setValue('currentIndex', index);
    }

    function clearStoredData() {
        GM_setValue('storedGameIds', []);
        GM_setValue('currentIndex', 0);
        GM_setValue('collectedData', []);
        GM_setValue('currentPage', 1);
    }

    // Функция для показа модального окна выбора источника данных
   function showDataSourceSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-content">
            <h3>Выберите источник данных</h3>
            <div class="modal-buttons">
                <button class="btn btn-primary btn-sm" id="browserSource">Использовать собранные ID</button>
                <button class="btn btn-secondary btn-sm" id="fileSource">Загрузить файл с ID</button>
                <button class="btn btn-info btn-sm" id="gistSource">Загрузить из Gist</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('browserSource').onclick = () => {
        modal.remove();
        const storedIds = getStoredGameIds();
        if (storedIds.length === 0) {
            alert('Нет сохранённых ID. Сначала выполните сбор ID из браузера.');
            return;
        }
        startProcessing();
    };

    document.getElementById('fileSource').onclick = () => {
        modal.remove();
        document.getElementById('idFileInput').click();
    };

    document.getElementById('gistSource').onclick = () => {
        modal.remove();
        showGistUrlModal();
    };
}

    function showGistUrlModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-content">
            <h3>Введите URL Gist</h3>
            <input type="text" id="gistUrl" class="form-control"
                   placeholder="https://gist.githubusercontent.com/..."
                   style="margin: 10px 0;">
            <div class="modal-buttons">
                <button class="btn btn-primary btn-sm" id="loadGist">Загрузить</button>
                <button class="btn btn-secondary btn-sm" id="cancelGist">Отмена</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('loadGist').onclick = () => {
        const url = document.getElementById('gistUrl').value.trim();
        if (url) {
            loadGistData(url);
            modal.remove();
        } else {
            alert('Введите корректный URL');
        }
    };

    document.getElementById('cancelGist').onclick = () => {
        modal.remove();
    };
}

// Добавляем функцию для загрузки данных из Gist:
function loadGistData(url) {
    statusText.textContent = 'Загрузка данных из Gist...';

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            try {
                if (response.status !== 200) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }

                const ids = response.responseText.split('\n')
                    .map(id => id.trim())
                    .filter(id => id);

                if (ids.length === 0) {
                    throw new Error('Файл пуст или содержит некорректные данные');
                }

                storeGameIds(ids);
                currentIndex = 0;
                storeCurrentIndex(currentIndex);
                statusText.textContent = `Загружено ${ids.length} ID из Gist`;
                startProcessing();

            } catch (error) {
                alert(`Ошибка при обработке данных: ${error.message}`);
                statusText.textContent = 'Ошибка при загрузке данных из Gist';
            }
        },
        onerror: function(error) {
            alert('Ошибка при загрузке данных из Gist');
            statusText.textContent = 'Ошибка при загрузке данных из Gist';
        }
    });
}

    // Функция для добавления элементов управления
    function addControls() {
        const header = document.querySelector('h1.h2');
        if (header && header.textContent.trim() === 'Игры') {
            const controlsDiv = document.createElement('div');
            controlsDiv.style.marginTop = '10px';

            // Элементы для пагинации
            urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.placeholder = 'Введите URL первой страницы';
            urlInput.className = 'form-control';
            urlInput.style.marginBottom = '10px';

            const idFileInput = document.createElement('input');
            idFileInput.type = 'file';
            idFileInput.style.display = 'none';
            idFileInput.accept = '.txt';
            idFileInput.id = 'idFileInput';
            idFileInput.addEventListener('change', handleFileUpload);

            const startPaginationButton = document.createElement('button');
            startPaginationButton.textContent = 'Начать сбор ID';
            startPaginationButton.className = 'btn btn-primary btn-sm';
            startPaginationButton.addEventListener('click', () => {
                if (urlInput.value) {
                    currentPage = 1;
                    startPaginationProcessing(urlInput.value);
                } else {
                    alert('Введите URL первой страницы');
                }
            });

            pauseButton = document.createElement('button');
            pauseButton.textContent = 'Пауза';
            pauseButton.className = 'btn btn-warning btn-sm';
            pauseButton.style.marginLeft = '10px';
            pauseButton.style.display = 'none';
            pauseButton.addEventListener('click', () => {
                if (isPaginationProcessing) {
                    pausePaginationProcessing();
                } else {
                    pauseProcessing();
                }
            });

            resumeButton = document.createElement('button');
            resumeButton.textContent = 'Продолжить';
            resumeButton.className = 'btn btn-success btn-sm';
            resumeButton.style.marginLeft = '10px';
            resumeButton.style.display = 'none';
            resumeButton.addEventListener('click', () => {
                if (isPaginationProcessing) {
                    resumePaginationProcessing(urlInput.value);
                } else {
                    resumeProcessing();
                }
            });

            const startCollectButton = document.createElement('button');
            startCollectButton.textContent = 'Начать сбор данных';
            startCollectButton.className = 'btn btn-success btn-sm';
            startCollectButton.style.marginLeft = '10px';
            startCollectButton.addEventListener('click', showDataSourceSelectionModal);

            saveButton = document.createElement('button');
            saveButton.textContent = 'Сохранить таблицу';
            saveButton.className = 'btn btn-info btn-sm';
            saveButton.style.marginLeft = '10px';
            saveButton.addEventListener('click', saveToXLSX);

            const clearButton = document.createElement('button');
            clearButton.textContent = 'Очистить данные';
            clearButton.className = 'btn btn-danger btn-sm';
            clearButton.style.marginLeft = '10px';
            clearButton.addEventListener('click', () => {
                if (confirm('Вы уверены? Все собранные данные будут удалены.')) {
                    clearStoredData();
                    location.reload();
                }
            });

            progressBar = document.createElement('progress');
            progressBar.style.width = '100%';
            progressBar.style.display = 'none';
            progressBar.style.marginTop = '10px';

            progressText = document.createElement('div');
            progressText.style.marginTop = '5px';

            statusText = document.createElement('div');
            statusText.style.marginTop = '5px';
            statusText.style.color = '#666';

            controlsDiv.appendChild(urlInput);
            controlsDiv.appendChild(idFileInput);
            controlsDiv.appendChild(startPaginationButton);
            controlsDiv.appendChild(startCollectButton);
            controlsDiv.appendChild(pauseButton);
            controlsDiv.appendChild(resumeButton);
            controlsDiv.appendChild(saveButton);
            controlsDiv.appendChild(clearButton);
            controlsDiv.appendChild(progressBar);
            controlsDiv.appendChild(progressText);
            controlsDiv.appendChild(statusText);

            header.parentNode.insertBefore(controlsDiv, header.nextSibling);

            // Показываем количество собранных данных
            const collectedData = getStoredData();
            if (collectedData.length > 0) {
                statusText.textContent = `В памяти: ${collectedData.length} игр`;
            }
        }
    }

    // Функция для обработки загруженного файла
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const ids = e.target.result.split('\n')
                    .map(id => id.trim())
                    .filter(id => id);

                storeGameIds(ids);
                currentIndex = 0;
                storeCurrentIndex(currentIndex);
                statusText.textContent = `Загружено ${ids.length} ID из файла`;
                startProcessing(); // Автоматически начинаем сбор после загрузки файла
            };
            reader.readAsText(file);
        }
    }

    // Функции для работы с пагинацией
    async function startPaginationProcessing(baseUrl) {
        isPaginationProcessing = true;
        progressBar.style.display = 'block';
        pauseButton.style.display = 'inline-block';
        resumeButton.style.display = 'none';

        const collectedIds = new Set(getStoredGameIds());
        await processNextPage(baseUrl, collectedIds);
    }

    function pausePaginationProcessing() {
        isPaginationProcessing = false;
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'inline-block';
        statusText.textContent = 'Сбор ID приостановлен';
        GM_setValue('currentPage', currentPage);
    }

    function resumePaginationProcessing(baseUrl) {
        currentPage = GM_getValue('currentPage', 1);
        startPaginationProcessing(baseUrl);
    }

    async function processNextPage(baseUrl, collectedIds) {
        if (!isPaginationProcessing) return;

        const url = baseUrl.replace(/[&?]p=\d+/, '') +
                   (baseUrl.includes('?') ? '&' : '?') +
                   `p=${currentPage}`;

        statusText.textContent = `Обработка страницы ${currentPage}...`;

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: resolve,
                    onerror: reject
                });
            });

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            const links = doc.querySelectorAll('a[href^="/adm/game/edit/"]');
            let foundNewIds = false;

            links.forEach(link => {
                const match = link.href.match(/\/edit\/(\d+)/);
                if (match) {
                    const id = match[1];
                    if (!collectedIds.has(id)) {
                        collectedIds.add(id);
                        foundNewIds = true;
                    }
                }
            });

            if (foundNewIds) {
                currentPage++;
                GM_setValue('currentPage', currentPage);
                const idsArray = Array.from(collectedIds);
                storeGameIds(idsArray);
                statusText.textContent = `Найдено ${collectedIds.size} ID`;

                await new Promise(resolve => setTimeout(resolve, 1000));
                await processNextPage(baseUrl, collectedIds);
            } else {
                isPaginationProcessing = false;
                pauseButton.style.display = 'none';
                const finalIds = Array.from(collectedIds);

                const blob = new Blob([finalIds.join('\n')], { type: 'text/plain' });
                const downloadUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink.download = 'collected_ids.txt';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                statusText.textContent = `Сбор ID завершён. Собрано ${finalIds.length} уникальных ID`;
            }

        } catch (error) {
            console.error('Error processing page:', error);
            isPaginationProcessing = false;
            pauseButton.style.display = 'none';
            resumeButton.style.display = 'inline-block';
            statusText.textContent = `Ошибка при обработке страницы ${currentPage}. Нажмите "Продолжить" для повторной попытки.`;
        }
    }

    // Функции для сбора данных об играх
    function startProcessing() {
        const storedIds = getStoredGameIds();
        if (storedIds.length === 0) {
            alert('Нет сохранённых ID игр. Сначала выполните сбор ID.');
            return;
        }

        isProcessing = true;
        progressBar.style.display = 'block';
        progressBar.max = storedIds.length;
        pauseButton.style.display = 'inline-block';
        resumeButton.style.display = 'none';
        updateProgress();
        processNextGame();
    }

    function pauseProcessing() {
        isProcessing = false;
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'inline-block';
        statusText.textContent = 'Сбор данных приостановлен';
    }

    function resumeProcessing() {
        const storedIds = getStoredGameIds();
        if (storedIds.length === 0) {
            alert('Нет сохранённых ID игр. Сначала выполните сбор ID.');
            return;
        }
        currentIndex = getStoredIndex();
        startProcessing();
    }

    function handleError(error, gameId) {
        console.error('Произошла ошибка:', error);
        isProcessing = false;
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'none';

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        modal.innerHTML = `
            <div class="modal-content">
<h3>Ошибка при обработке игры ${gameId}</h3>
                <p>${error.message || 'Не удалось получить данные игры'}</p>
                <div class="modal-buttons">
                    <button class="btn btn-primary btn-sm" id="retryButton">Повторить</button>
                    <button class="btn btn-secondary btn-sm" id="skipButton">Пропустить</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('retryButton').onclick = () => {
            modal.remove();
            isProcessing = true;
            processNextGame();
        };

        document.getElementById('skipButton').onclick = () => {
            modal.remove();
            currentIndex++;
            storeCurrentIndex(currentIndex);
            isProcessing = true;
            processNextGame();
        };
    }

    function updateProgress() {
        const storedIds = getStoredGameIds();
        progressBar.value = currentIndex;
        progressText.textContent = `Прогресс: ${currentIndex} из ${storedIds.length} (${Math.round(currentIndex / storedIds.length * 100)}%)`;
        const collectedData = getStoredData();
        statusText.textContent = `Собрано игр: ${collectedData.length}`;
    }

    // Функция для обработки следующей игры
    function processNextGame() {
        const storedIds = getStoredGameIds();
        if (currentIndex < storedIds.length && isProcessing) {
            const gameId = storedIds[currentIndex];
            statusText.textContent = `Обработка игры ${gameId}...`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.playground.ru/adm/game/edit/${gameId}`,
                overrideMimeType: 'text/html; charset=UTF-8',
                onload: function(response) {
                    try {
                        if (response.status !== 200) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        const url = `https://www.playground.ru/adm/game/edit/${gameId}`;
                        const gameName = doc.querySelector('input[name="name"]').value;
                        const gameDescription = extractGameDescription(doc);
                        const genres = extractGenres(doc);
                        const releaseInfo = extractReleaseInfo(doc);
                        const sysReq = extractSystemRequirements(doc);

                        const collectedData = getStoredData();
                        collectedData.push([url, gameName, gameDescription, genres, releaseInfo, ...sysReq]);
                        storeData(collectedData);

                        currentIndex++;
                        storeCurrentIndex(currentIndex);
                        updateProgress();
                        setTimeout(processNextGame, 1000);
                    } catch (error) {
                        handleError(error, gameId);
                    }
                },
                onerror: function(error) {
                    handleError(error, gameId);
                }
            });
        } else if (currentIndex >= storedIds.length) {
            isProcessing = false;
            pauseButton.style.display = 'none';
            const collectedData = getStoredData();
            statusText.textContent = `Сбор данных завершён. Всего собрано игр: ${collectedData.length}`;
        }
    }

    // Функции для извлечения данных
    function extractGameDescription(doc) {
        const textArea = doc.querySelector('textarea[name="text"]');
        if (textArea) {
            const div = document.createElement('div');
            div.innerHTML = textArea.value;
            return div.innerText.trim();
        }
        return '';
    }

    function extractGenres(doc) {
        const activeTags = doc.querySelector('.active-tags');
        if (activeTags) {
            const tagsText = activeTags.textContent.trim();
            const tags = tagsText.split('#')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
                .join(', ');
            return tags;
        }
        return '';
    }

    function extractReleaseInfo(doc) {
        const platforms = doc.querySelectorAll('.pg-releases .line');
        let releaseInfo = [];

        platforms.forEach(platform => {
            const checkbox = platform.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const platformName = platform.querySelector('.custom-control-label').textContent.trim();
                const day = platform.querySelector('input[title="Число"]').value.padStart(2, '0');
                const month = platform.querySelector('input[title="Месяц"]').value.padStart(2, '0');
                const year = platform.querySelector('input[title="Год"]').value;
                const accuracy = platform.querySelector('select').value;

                let dateStr = '';
                if (day && month && year && accuracy === 'day') {
                    dateStr = `${day}.${month}.${year}`;
                } else if (month && year && accuracy === 'month') {
                    dateStr = `${month}.${year}`;
                } else if (year && accuracy === 'year') {
                    dateStr = year;
                } else if (accuracy === 'cancelled') {
                    dateStr = 'Отменена';
                } else if (accuracy === 'unknown') {
                    dateStr = 'Неизвестно';
                }

                if (dateStr) {
                    releaseInfo.push(`${platformName} - ${dateStr}`);
                }
            }
        });

        return releaseInfo.join('\n');
    }

    function extractSystemRequirements(doc) {
        const fields = ['os', 'cpu', 'gpu', 'ram', 'sound', 'disk', 'net', 'dx', 'misc'];
        const sysReq = [];
        fields.forEach(field => {
            const minInput = doc.querySelector(`input[name="system_requirements[minimal][${field}]"]`);
            const recInput = doc.querySelector(`input[name="system_requirements[recommend][${field}]"]`);
            sysReq.push(minInput ? minInput.value : '');
            sysReq.push(recInput ? recInput.value : '');
        });
        return sysReq;
    }

    // Функция для сохранения в XLSX
    function saveToXLSX() {
        const collectedData = getStoredData();
        if (collectedData.length === 0) {
            alert('Нет данных для сохранения');
            return;
        }

        const headers = [
            "URL", "Название игры", "Описание", "Жанры", "Даты релиза",
            "Мин. ОС", "Рек. ОС",
            "Мин. Процессор", "Рек. Процессор",
            "Мин. Видеокарта", "Рек. Видеокарта",
            "Мин. ОЗУ", "Рек. ОЗУ",
            "Мин. Звук", "Рек. Звук",
            "Мин. Место на диске", "Рек. Место на диске",
            "Мин. Интернет", "Рек. Интернет",
            "Мин. DirectX", "Рек. DirectX",
            "Мин. Другое", "Рек. Другое"
        ];

        const ws = XLSX.utils.aoa_to_sheet([headers, ...collectedData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Game Data");

        const data = [headers, ...collectedData];
        const colWidths = data[0].map((_, i) => ({
            wch: Math.max(...data.map(row => row[i] ? row[i].toString().length : 0))
        }));
        ws['!cols'] = colWidths;

        const dateColumn = 'E';
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            const cell = ws[dateColumn + (R + 1)];
            if (cell) {
                cell.s = { alignment: { wrapText: true, vertical: 'top' } };
            }
        }

        const wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        const blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `game_data_${collectedData.length}_games.xlsx`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // Проверяем загрузку XLSX
    if (typeof XLSX === 'undefined') {
        console.error('XLSX library not loaded!');
        return;
    }

    // Инициализация при загрузке
    addControls();
    const storedIds = getStoredGameIds();
    if (storedIds.length > 0) {
        currentIndex = getStoredIndex();
        resumeButton.style.display = 'inline-block';
        const collectedData = getStoredData();
        statusText.textContent = `Найдена сохранённая сессия (${currentIndex}/${storedIds.length}). Собрано игр: ${collectedData.length}`;
    }

})();