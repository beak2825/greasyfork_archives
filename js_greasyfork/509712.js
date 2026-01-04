// ==UserScript==
// @name         Auto Code Activator Gaijin // Автоматическая активация кодов на сайте Gaijin
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Автоматическая активация кодов на сайте Gaijin с функциями сохранения и удаления кодов
// @author       z1zod, BALCETUL
// @match        https://store.gaijin.net/activate.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509712/Auto%20Code%20Activator%20Gaijin%20%20%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20Gaijin.user.js
// @updateURL https://update.greasyfork.org/scripts/509712/Auto%20Code%20Activator%20Gaijin%20%20%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BA%D0%BE%D0%B4%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20Gaijin.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const waitTime = 2000; // Время ожидания после клика
    const refreshInterval = 3000; // Интервал перезагрузки страницы
    const clickInterval = 1000; // Интервал для имитации кликов

    // Функция для ожидания
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Функция для создания панели статуса
    function createStatusPanels() {
        const statusPanel = document.createElement('div');
        statusPanel.id = 'status-panel';
        statusPanel.style.position = 'fixed';
        statusPanel.style.top = '10px';
        statusPanel.style.right = '10px';
        statusPanel.style.width = '300px';
        statusPanel.style.padding = '10px';
        statusPanel.style.backgroundColor = '#333';
        statusPanel.style.color = '#fff';
        statusPanel.style.zIndex = '10000';
        statusPanel.style.borderRadius = '8px';
        statusPanel.style.display = 'flex';
        statusPanel.style.flexDirection = 'column';
        statusPanel.style.gap = '10px';

        // Информационное сообщение над полем ввода кодов
        const infoMessage = document.createElement('div');
        infoMessage.id = 'info-message';
        infoMessage.style.backgroundColor = '#444';
        infoMessage.style.border = '1px solid #666';
        infoMessage.style.borderRadius = '4px';
        infoMessage.style.padding = '10px';
        infoMessage.style.fontSize = '12px';
        infoMessage.style.marginBottom = '10px';
        infoMessage.style.color = '#ccc';
        statusPanel.appendChild(infoMessage);

        const codesInputLabel = document.createElement('label');
        codesInputLabel.textContent = 'Введите коды:';
        statusPanel.appendChild(codesInputLabel);

        const codesInput = document.createElement('textarea');
        codesInput.id = 'codes-input';
        codesInput.style.width = '100%';
        codesInput.style.height = '80px';
        codesInput.style.marginBottom = '10px';
        codesInput.style.backgroundColor = '#555';
        codesInput.style.color = '#fff';
        codesInput.style.border = '1px solid #777';
        codesInput.style.fontSize = '12px';
        statusPanel.appendChild(codesInput);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Начать активацию';
        toggleButton.style.backgroundColor = '#4CAF50';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.padding = '10px 20px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.transition = 'background-color 0.3s';
        toggleButton.addEventListener('mouseover', () => {
            toggleButton.style.backgroundColor = '#45a049';
        });
        toggleButton.addEventListener('mouseout', () => {
            toggleButton.style.backgroundColor = '#4CAF50';
        });
        buttonContainer.appendChild(toggleButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить коды';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.padding = '10px 20px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.borderRadius = '4px';
        saveButton.style.transition = 'background-color 0.3s';
        saveButton.addEventListener('mouseover', () => {
            saveButton.style.backgroundColor = '#45a049';
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.backgroundColor = '#4CAF50';
        });
        buttonContainer.appendChild(saveButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить коды';
        deleteButton.style.backgroundColor = '#f44336';
        deleteButton.style.color = '#fff';
        deleteButton.style.border = 'none';
        deleteButton.style.padding = '10px 20px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.borderRadius = '4px';
        deleteButton.style.transition = 'background-color 0.3s';
        deleteButton.addEventListener('mouseover', () => {
            deleteButton.style.backgroundColor = '#e53935';
        });
        deleteButton.addEventListener('mouseout', () => {
            deleteButton.style.backgroundColor = '#f44336';
        });
        deleteButton.style.fontSize = '12px';
        deleteButton.style.marginTop = '10px';
        buttonContainer.appendChild(deleteButton);

        statusPanel.appendChild(buttonContainer);

        const statusText = document.createElement('div');
        statusText.style.marginTop = '10px';
        statusText.id = 'status-text';
        statusPanel.appendChild(statusText);

        const failedText = document.createElement('div');
        failedText.style.marginTop = '10px';
        failedText.style.color = '#ef5d5d';
        failedText.style.fontSize = '12px';
        failedText.id = 'failed-text';
        statusPanel.appendChild(failedText);

        document.body.appendChild(statusPanel);

        return { statusText, codesInput, saveButton, deleteButton, toggleButton, failedText, infoMessage };
    }

    // Функция для обновления панели статуса
    function updateStatusPanel(activeCount, totalCodes, failedCodes, messageType) {
        const statusText = document.getElementById('status-text');
        const failedText = document.getElementById('failed-text');
        const infoMessage = document.getElementById('info-message');

        if (statusText) {
            statusText.innerHTML = `
                <p>Всего кодов: ${totalCodes}</p>
                <p>Активировано кодов: ${activeCount}</p>
                <p>Неудачные коды: ${failedCodes.length}</p>
            `;
        }

        if (failedText) {
            failedText.innerHTML = failedCodes.length > 0 ? `
                <ul>
                    ${failedCodes.map(code => `<li>${code}</li>`).join('')}
                </ul>
            ` : 'Нет неудачных кодов';
        }

        // Обновляем информационное сообщение
        if (infoMessage) {
            switch (messageType) {
                case 'saved':
                    infoMessage.textContent = 'Коды сохранены.';
                    infoMessage.style.color = '#4CAF50'; // Зеленый цвет для сохранения
                    break;
                case 'completed':
                    infoMessage.textContent = 'Все коды активированы, добавьте новые коды.';
                    infoMessage.style.color = '#ef5d5d'; // Красный цвет для завершения
                    break;
                case 'started':
                    infoMessage.textContent = 'Активация кодов началась.';
                    infoMessage.style.color = '#ccc'; // Серый цвет по умолчанию
                    break;
                case 'stopped':
                    infoMessage.textContent = 'Активация кодов остановлена.';
                    infoMessage.style.color = '#ccc'; // Серый цвет по умолчанию
                    break;
                default:
                    if (totalCodes === 0) {
                        infoMessage.textContent = 'Введите коды в поле ниже и нажмите "Сохранить коды". Если коды закончились, вы увидите сообщение об этом.';
                        infoMessage.style.color = '#ccc'; // Серый цвет по умолчанию
                    } else {
                        infoMessage.textContent = 'Введите коды в поле ниже и нажмите "Сохранить коды".';
                        infoMessage.style.color = '#ccc'; // Серый цвет по умолчанию
                    }
                    break;
            }
        }
    }

    // Обновление данных в localStorage
    function updateLocalStorage() {
        localStorage.setItem('codes', JSON.stringify(codes));
        localStorage.setItem('failedCodes', JSON.stringify(failedCodes));
        localStorage.setItem('currentIndex', currentIndex);
        localStorage.setItem('activeCount', activeCount);
        localStorage.setItem('infoMessageType', infoMessageType);
        localStorage.setItem('isActivating', JSON.stringify(isActivating));
    }

    // Загрузка данных из localStorage
    let codes = JSON.parse(localStorage.getItem('codes') || '[]');
    let failedCodes = JSON.parse(localStorage.getItem('failedCodes') || '[]');
    let currentIndex = parseInt(localStorage.getItem('currentIndex') || '0', 10);
    let activeCount = parseInt(localStorage.getItem('activeCount') || '0', 10);
    let infoMessageType = localStorage.getItem('infoMessageType') || '';
    let isActivating = JSON.parse(localStorage.getItem('isActivating') || 'false');

    // Создаем панель состояния и получаем элементы управления
    const { statusText, codesInput, saveButton, deleteButton, toggleButton, failedText, infoMessage } = createStatusPanels();

    // Устанавливаем начальные значения
    codesInput.value = codes.join('\n');
    updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);

    // Обработчик для кнопки сохранения кодов
    saveButton.addEventListener('click', () => {
        codes = codesInput.value.split('\n').map(code => code.trim()).filter(code => code.length > 0);
        failedCodes = [];
        currentIndex = 0;
        activeCount = 0;
        infoMessageType = 'saved';
        updateLocalStorage();
        updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);
    });

    // Обработчик для кнопки удаления кодов
    deleteButton.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите удалить все коды? Это действие нельзя отменить.')) {
            codes = [];
            failedCodes = [];
            currentIndex = 0;
            activeCount = 0;
            infoMessageType = ''; // Убираем сообщение об удалении
            updateLocalStorage();
            codesInput.value = ''; // Очищаем поле ввода кодов
            updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);
        }
    });

    // Функция для активации кодов
    async function activateCodes() {
        try {
            if (currentIndex >= codes.length) {
                infoMessageType = 'completed';
                isActivating = false; // Останавливаем активацию
                updateLocalStorage();
                updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);
                toggleButton.textContent = 'Начать активацию'; // Обновляем текст кнопки
                toggleButton.style.backgroundColor = '#4CAF50'; // Цвет кнопки для начала активации
                clearInterval(autoActivationIntervalId); // Останавливаем автоматическую активацию
                return;
            }

            const code = codes[currentIndex];

            // Проверяем, если находимся на странице активации
            const inputField = document.querySelector('input[name="key"]');
            if (inputField) {
                inputField.value = code;

                // Нажимаем кнопку активации
                const activateButton = document.querySelector('input[type="submit"][value="Активировать"]');
                if (!activateButton) throw new Error('Кнопка активации не найдена');
                activateButton.click();

                console.log(`Активирую код: ${code}`);

                // Ждем выполнения запроса и перехода на следующ страницу
                await waitFor(waitTime);
            }

            // Проверяем наличие сообщения об ошибке активации на странице
            const errorMessage = document.querySelector('.code-activation__error');
            if (errorMessage) {
                console.log(`Ошибка активации кода: ${code} - ${errorMessage.textContent.trim()}`);
                failedCodes.push(code);
                updateLocalStorage();
                updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);
            }

            // Проверяем наличие сообщения об успешной активации на странице
            const successMessage = document.querySelector('.content-column p a');
            if (successMessage) {
                console.log(`Код успешно активирован: ${code}`);
            }

            // Проверяем наличие кнопки "Вернуться" и нажимаем её
            const returnButton = document.querySelector('input[type="submit"][value="Вернуться"]');
            if (returnButton) {
                console.log('Код активирован, нажимаю кнопку "Вернуться"');

                // Обновляем текущий индекс и количество активированных кодов
                currentIndex++;
                activeCount++;
                updateLocalStorage();
                updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);

                returnButton.click();

                // Ждем возврата на страницу ввода кода
                await waitFor(waitTime);
            }

        } catch (error) {
            console.error(`Ошибка при активации кода ${codes[currentIndex]}:`, error);
        } finally {
            // Перезагружаем страницу для продолжения
            if (isActivating) {
                setTimeout(() => {
                    window.location.reload();
                }, refreshInterval);
            }
        }
    }

    // Функция для имитации кликов
    function startAutoActivation() {
        autoActivationIntervalId = setInterval(() => {
            if (!isActivating) {
                clearInterval(autoActivationIntervalId);
                return;
            }
            activateCodes();
        }, clickInterval);
    }

    // Обработчик для кнопки переключения активации
    let autoActivationIntervalId;

    toggleButton.addEventListener('click', () => {
        if (codes.length === 0) {
            alert('Сначала введите и сохраните коды.');
            return;
        }

        if (isActivating) {
            isActivating = false;
            infoMessageType = 'stopped';
            updateLocalStorage();
            updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);
            clearInterval(autoActivationIntervalId); // Останавливаем автоматическую активацию
            toggleButton.textContent = 'Начать активацию'; // Обновляем текст кнопки
            toggleButton.style.backgroundColor = '#4CAF50'; // Цвет кнопки для начала активации
        } else {
            isActivating = true;
            infoMessageType = 'started';
            updateLocalStorage();
            updateStatusPanel(activeCount, codes.length, failedCodes, infoMessageType);
            startAutoActivation(); // Запускаем автоматическую активацию
            toggleButton.textContent = 'Остановить активацию'; // Обновляем текст кнопки
            toggleButton.style.backgroundColor = '#e53935'; // Цвет кнопки для остановки активации
        }

        // Обновляем состояние кнопки
        toggleButton.style.color = '#fff';
    });

    // Устанавливаем начальные значения кнопок и состояния
    toggleButton.textContent = isActivating ? 'Остановить активацию' : 'Начать активацию';
    toggleButton.style.backgroundColor = isActivating ? '#e53935' : '#4CAF50';
    toggleButton.style.color = '#fff';
    if (isActivating) startAutoActivation(); // Запускаем автоматическую активацию при загрузке, если она была активирована
})();
