// ==UserScript==
// @name         house checker
// @namespace    https://shinoa.tech/
// @version      1.0
// @description  house script check
// @author       christopher wayne love 30
// @match        https://logs.shinoa.tech/tech/house
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533965/house%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/533965/house%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkedPlayers = {};

    const style = document.createElement('style');
    style.textContent = `
        .house-checker-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .house-checker-content {
            background-color: #121212;
            padding: 20px;
            border-radius: 5px;
            max-width: 500px;
            width: 100%;
            color: white;
        }
        .house-checker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .house-checker-close {
            cursor: pointer;
            font-size: 20px;
        }
        .house-checker-input-group {
            display: flex;
            margin-bottom: 15px;
        }
        .house-checker-input {
            flex: 1;
            padding: 8px;
            margin-right: 10px;
            background-color: #1E1E1E;
            border: 1px solid #333;
            color: white;
            border-radius: 3px;
        }
        .house-checker-button {
            background-color: #1976D2;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        }
        .house-checker-button:hover {
            background-color: #1565C0;
        }
        .house-checker-button:disabled {
            background-color: #636363;
            cursor: not-allowed;
        }
        .house-checker-progress {
            margin-top: 15px;
            font-size: 14px;
        }
        .house-checker-results {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 15px;
            border: 1px solid #333;
            padding: 10px;
            background-color: #1E1E1E;
        }
        .result-item {
            margin-bottom: 5px;
            padding: 5px;
            border-bottom: 1px solid #333;
        }
        .banned {
            color: #F44336;
        }
        .not-banned {
            color: #4CAF50;
        }
        .cached {
            font-style: italic;
        }
    `;
    document.head.appendChild(style);

    function addCheckerButton() {
        const container = document.querySelector('div.row.justify-center');
        if (!container) return;

        const checkerButton = document.createElement('button');
        checkerButton.className = 'v-btn v-btn--has-bg theme--dark v-size--default house-checker-button';
        checkerButton.style.height = '40px';
        checkerButton.style.marginLeft = '10px';
        checkerButton.style.marginBottom = '3px';
        checkerButton.innerHTML = '<span class="v-btn__content">Чекер домов</span>';

        checkerButton.addEventListener('click', showCheckerModal);
        container.appendChild(checkerButton);
    }

    function showCheckerModal() {
        const modal = document.createElement('div');
        modal.className = 'house-checker-modal';
        modal.innerHTML = `
            <div class="house-checker-content">
                <div class="house-checker-header">
                    <h3>Чекер домов</h3>
                    <span class="house-checker-close">&times;</span>
                </div>
                <div class="house-checker-input-group">
                    <input type="number" class="house-checker-input" id="startId" placeholder="Начальный ID">
                    <input type="number" class="house-checker-input" id="endId" placeholder="Конечный ID">
                    <button class="house-checker-button" id="startCheck">Проверить</button>
                </div>
                <div class="house-checker-progress" id="progressInfo"></div>
                <div class="house-checker-results" id="results"></div>
            </div>
        `;

        document.body.appendChild(modal);

        document.querySelector('.house-checker-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('startCheck').addEventListener('click', function() {
            const startId = parseInt(document.getElementById('startId').value);
            const endId = parseInt(document.getElementById('endId').value);

            if (isNaN(startId) || isNaN(endId) || startId > endId) {
                alert('Пожалуйста, введите корректный диапазон ID');
                return;
            }

            this.disabled = true;
            startHouseCheck(startId, endId).finally(() => {
                this.disabled = false;
            });
        });
    }

    async function startHouseCheck(startId, endId) {
        const progressInfo = document.getElementById('progressInfo');
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        const totalHouses = endId - startId + 1;
        let checked = 0;

        for (let id = startId; id <= endId; id++) {
            progressInfo.textContent = `Проверка: ${id} (${checked + 1}/${totalHouses})`;

            try {
                fillIdInput(id);
                await sleep(500);

                clickLoadButton();
                await sleep(1500);

                const owner = getOwnerFromPage();

                if (!owner || owner === '') {
                    logResult(id, 'Нет владельца', false, resultsContainer, false);
                    checked++;
                    continue;
                }

                let isBanned;
                let isCached = false;

                if (owner in checkedPlayers) {
                    isBanned = checkedPlayers[owner];
                    isCached = true;
                    console.log(`Используем кешированные данные для ${owner}: ${isBanned ? 'заблокирован' : 'не заблокирован'}`);
                } else {
                    isBanned = await checkPlayerBan(owner);
                    checkedPlayers[owner] = isBanned;
                }

                logResult(id, owner, isBanned, resultsContainer, isCached);

            } catch (error) {
                console.error(`Ошибка при проверке дома ID ${id}:`, error);
                logResult(id, 'Ошибка: ' + error.message, false, resultsContainer, false);
            }

            checked++;
            await sleep(1000);
        }

        progressInfo.textContent = `Проверка завершена. Проверено ${checked} домов.`;
    }

    function fillIdInput(id) {
        const idInput = document.querySelector('input[type="text"]');
        if (!idInput) {
            throw new Error('Поле для ввода ID не найдено');
        }

        idInput.value = id;
        idInput.dispatchEvent(new Event('input', { bubbles: true }));
        idInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function clickLoadButton() {
        let loadButton = document.querySelector('button[type="submut"]');

        if (!loadButton) {
            loadButton = document.querySelector('button[type="submit"]');
        }

        if (!loadButton) {
            const buttons = document.querySelectorAll('button');
            for (const button of buttons) {
                const buttonText = button.textContent.toLowerCase();
                if (buttonText.includes('загрузить') || buttonText.includes('поиск') ||
                    buttonText.includes('проверить') || buttonText.includes('найти')) {
                    loadButton = button;
                    break;
                }
            }

            if (!loadButton && buttons.length > 0) {
                loadButton = buttons[0];
            }
        }

        if (!loadButton) {
            throw new Error('Кнопка загрузки информации не найдена');
        }

        if (loadButton.disabled) {
            loadButton.disabled = false;
        }

        loadButton.click();
    }

    function getOwnerFromPage() {
        const rows = document.querySelectorAll('tr');
        let owner = null;

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const label = cells[0].textContent.trim();
                if (label === 'Владелец') {
                    owner = cells[1].textContent.trim();
                    break;
                }
            }
        }

        return owner;
    }

    async function checkPlayerBan(nickname) {
        const banCheckWindow = window.open('https://logs.shinoa.tech/tech/punish', '_blank');

        const checkBanStatus = () => {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    try {
                        if (banCheckWindow.document.readyState === 'complete') {
                            clearInterval(checkInterval);

                            const nickInput = banCheckWindow.document.querySelector('input[type="text"]');
                            if (!nickInput) {
                                banCheckWindow.close();
                                resolve(false);
                                return;
                            }

                            nickInput.value = nickname;
                            nickInput.dispatchEvent(new Event('input', { bubbles: true }));

                            setTimeout(() => {
                                let loadButton = banCheckWindow.document.querySelector('button[type="submit"]');

                                if (!loadButton) {
                                    loadButton = banCheckWindow.document.querySelector('button[type="submut"]');
                                }

                                if (!loadButton) {
                                    const buttons = banCheckWindow.document.querySelectorAll('button');
                                    for (const button of buttons) {
                                        const buttonText = button.textContent.toLowerCase();
                                        if (buttonText.includes('проверить') || buttonText.includes('поиск') ||
                                            buttonText.includes('загрузить') || buttonText.includes('найти')) {
                                            loadButton = button;
                                            break;
                                        }
                                    }

                                    if (!loadButton && buttons.length > 0) {
                                        loadButton = buttons[0];
                                    }
                                }

                                if (loadButton) {
                                    if (loadButton.disabled) {
                                        loadButton.disabled = false;
                                    }
                                    loadButton.click();

                                    setTimeout(() => {
                                        const banInfo = banCheckWindow.document.querySelector('div.v-card__title');
                                        const isBanned = banInfo && banInfo.textContent.trim() === 'Блокировка';

                                        banCheckWindow.close();
                                        resolve(isBanned);
                                    }, 1500);
                                } else {
                                    banCheckWindow.close();
                                    resolve(false);
                                }
                            }, 500);
                        }
                    } catch (error) {
                        clearInterval(checkInterval);
                        console.error("Ошибка при проверке блокировки:", error);
                        try {
                            banCheckWindow.close();
                        } catch (e) {}
                        resolve(false);
                    }
                }, 500);

                setTimeout(() => {
                    clearInterval(checkInterval);
                    try {
                        banCheckWindow.close();
                    } catch (e) {}
                    resolve(false);
                }, 10000);
            });
        };

        return await checkBanStatus();
    }

    function logResult(id, nickname, isBanned, container, isCached) {
        const statusClass = isBanned === true ? 'banned' : 'not-banned';
        const statusText = isBanned === true ? 'заблокирован' : 'не заблокирован';
        const cachedClass = isCached ? 'cached' : '';
        const cachedText = isCached ? ' (кеш)' : '';

        console.log(`ID: ${id}, Ник: ${nickname}, Статус: ${statusText}${cachedText}`);

        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${statusClass} ${cachedClass}`;
        resultItem.textContent = `ID: ${id}, Ник: ${nickname}, Статус: ${statusText}${cachedText}`;
        container.appendChild(resultItem);

        container.scrollTop = container.scrollHeight;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window.addEventListener('load', addCheckerButton);

    if (document.readyState === 'complete') {
        addCheckerButton();
    }
})();