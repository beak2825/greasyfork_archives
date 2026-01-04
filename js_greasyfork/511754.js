// ==UserScript==
// @name         Dostavista. Админка +
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Дополнительные возможности для внутренней административной панели
// @author       Dostavista
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @connect      innera.space
// @match        https://dispatcher.dostavista.ru/dispatcher/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511754/Dostavista%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%BA%D0%B0%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/511754/Dostavista%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%BA%D0%B0%20%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* Первый блок шапки заказа */
        /* Стили для первого блока шапки заказа */

        .additional > div:nth-child(1) {
            width: 40%;
        }

        /* Второй блок шапки заказа */
        /* Стили для контейнера во втором блоке шапки заказа */

        .main-button-container {
            margin-top: 10px; 
            position: static !important;
            min-width: 100px;
        }

        /* Стили для контейнера кнопки "Последние изменения" и ярлыком с датой обновления */
        
        .news-button-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Стили для всех кнопок в контейнере" */

        .news-button-container button {
            width: 100%;
            padding-top: 6px;
            padding-bottom: 6px;
        }

        /* Стили для ярлыка с датой под кнопкой "Последние изменения" */

        .last-updated-label {
            margin-top: 2px;
            font-size: 12px;
            color: gray;
            align-self: end;
        }

        /* Вид кнопки "Последние изменения", если есть непрочитанные изменения */

        .news-updated {
            background-color: blue;
            color: white;
        }

        /* Вид кнопки "Последние изменения" по умолчанию */

        .news-read {
            background-color: white;
            color: black;
        }

        /* Стили для контейнера "Чат клиента" */

        .client-chat-button-container {
            display: flex;
            margin-top: 10px;
            justify-content: center;
        }

        .client-chat-button-container button {
            padding: 0;
            border: none;
            font: inherit;
            color: #999999;
            background-color: transparent;
            cursor: pointer;
            margin-left: 5px;
            text-decoration: underline;
            text-decoration-style: dotted;
        }

        /* Третий блок шапки заказа */
        /* Стили для таблицы с данными по клиенту */

        .client-info-container {
            position: static !important;
            min-width: 200px;
            width: 250px;
        }

        .client-data-table {
            border-collapse: collapse;
            width: 100%;
        }

        .client-data-table tr:nth-child(even) {
            background-color: #f2f2f2;
        }  

        .client-data-table td {
            padding: 2px;
        }

        /* Стили для контейнера с кнопками под таблицей */

        .client-data-buttons-container {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }

        /* Стили для отключенных кнопок */

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Стили для модальных окон */

        .modal {
            display: none;
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            z-index: 1000;
            padding: 10px;
            max-width: 350px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
    `);

    // --------------------------------------------------------------------------------------
    // Функционал отображения на странице данных из API по клиенту
    // --------------------------------------------------------------------------------------

    /**
     * Функция ищет ID клиента
     * @returns Возвращает найденный ID клиента или null, если ID не был найден
     */
    function getClientId() {
        const clientLink = document.querySelector('#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional > div:nth-child(2) > div > a[href*="/dispatcher/clients/view/"]'); 
        if (clientLink) {
            const href = clientLink.getAttribute('href');
            const clientIdMatch = href.match(/\/dispatcher\/clients\/view\/(\d+)/);
            if (clientIdMatch) {
                console.log(clientIdMatch[1]);
                return clientIdMatch[1];
            }
        }
        return null;
    }

    /**
     * Создает элементы интерфейса для отображения данных по клиенту
     * @param {object} clientData Преобразованный в объект JSON-ответ с данными о клиенте
     */
    function createUI(clientData) {
        // Основной контейнер, куда будем встраивать элементы с данными
        const mainContainer = document.createElement('div');
        mainContainer.classList.add('client-info-container');
        mainContainer.classList.add('add-block');

        const headingSection = document.querySelector("#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional");
        const secondChild = document.querySelector("#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional > div:nth-child(2)");
        const thirdChild = document.querySelector("#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional > div:nth-child(3)");

        // Замещаем третий элемент Основным контейнером
        headingSection.replaceChild(mainContainer, thirdChild); 

        const clientDataContainer = document.createElement('div');
        clientDataContainer.classList.add('client-data-container');
        mainContainer.appendChild(clientDataContainer);

        const dataGrid = document.createElement('table');
        dataGrid.classList.add('client-data-table');
        clientDataContainer.appendChild(dataGrid);

        addRow(dataGrid, 'Реактивация', clientData.can_reactivate);
        addRow(dataGrid, 'Создание дублей', clientData.allow_duplicates);
        addRow(dataGrid, 'Можно ли связываться с получателем', clientData.can_contact_recipient);
        addRow(dataGrid, 'Могут ли курьеры менять время', clientData.couriers_can_change_time);
        addRow(dataGrid, 'Могут ли курьеры менять адрес', clientData.couriers_can_change_addresses);
        addRow(dataGrid, 'Могут ли курьеры вносить ПО', clientData.couriers_can_add_paid_waiting);

        // Контейнер с кнопками, которые находятся под таблицей
        const clientDataButtonsContainer = document.createElement('div');
        clientDataButtonsContainer.classList.add('client-data-buttons-container');
        mainContainer.appendChild(clientDataButtonsContainer);

        addButtonWithModal(clientDataButtonsContainer, 'Условия ПО', clientData.paid_waiting_conditions);
        addButtonWithModal(clientDataButtonsContainer, 'Особенности клиента', clientData.client_features);

        const mainButtonContainer = document.createElement('div');
        mainButtonContainer.classList.add('main-button-container');
        secondChild.appendChild(mainButtonContainer);

        const newsButtonContainer = document.createElement('div');
        newsButtonContainer.classList.add('news-button-container');
        mainButtonContainer.appendChild(newsButtonContainer);

        const newsButton = document.createElement('button');
        newsButton.innerText = 'Последние изменения';
        newsButtonContainer.appendChild(newsButton);

        // Если ссылка на последнюю новость есть, то делаем кнопку с новостью кликабельной, добавляем дату
        if (clientData.last_news_link) {

            const lastUpdatedLabel = document.createElement('div');
            lastUpdatedLabel.className = 'last-updated-label';
            newsButtonContainer.appendChild(lastUpdatedLabel);

            const lastReadDate = localStorage.getItem(`news_last_read_${clientData.client_id}`);
            if (new Date(clientData.updated_at) > new Date(lastReadDate)) {
                newsButton.innerText = 'Посмотреть';
                newsButton.className = 'news-updated';
                lastUpdatedLabel.innerText = 'Есть новость!';
            } else {
                newsButton.className = 'news-read';
                lastUpdatedLabel.innerText = `обновлено: ${new Date(clientData.updated_at).toLocaleDateString()}`;
            }

            newsButton.onclick = function () {
                window.open(clientData.last_news_link, '_blank');
                localStorage.setItem(`news_last_read_${clientData.client_id}`, clientData.updated_at);
                newsButton.innerText = 'Последняя новость';
                newsButton.className = 'news-read';
                lastUpdatedLabel.innerText = `обновлено: ${new Date(clientData.updated_at).toLocaleDateString()}`;
            };
        } else {
            newsButton.innerText = 'Новостей нет';
            newsButton.disabled = true;
            newsButton.classList.add('disabled-button');
        }

        const clientChatButtonContainer = document.createElement('div');
        clientChatButtonContainer.classList.add('client-chat-button-container');
        mainButtonContainer.appendChild(clientChatButtonContainer);

        const clienChatButton = document.createElement('a');
        clienChatButton.innerText = 'Чат клиента';
        clienChatButton.href = clientData.client_chat_link;
        clienChatButton.target = '_blank';

        clientChatButtonContainer.appendChild(clienChatButton);

        addButtonWithModal(clientChatButtonContainer, '(?)', clientData.need_to_notify_client, 'О чем уведомляем клиента?');

    }
    
    /**
     * Функция добавляет новую строку в передаваемый элемент Table
     * @param {HTMLElement.table} table - элемент Table, в который необходимо встроить строку
     * @param {string} label - название строки
     * @param {string} value - значение строки
     */
    function addRow(table, label, value) {
        const row = table.insertRow();
        const valueCell = row.insertCell(0);
        const labelCell = row.insertCell(1);
        valueCell.innerText = value ? '✔️' : '❌';
        labelCell.innerText = label;
    }

    /**
     * Функция создает кнопку в передаваемый элемент, по нажатию на которую отображается поп-ап окно с текстом
     * @param {HTMLElement} container - элемент, в который необходимо встроить кнопку
     * @param {string} label - название кнопки
     * @param {string} text - текст, который будет в поп-ап окне 
     * @param {string} title - текст, отображаемый при наведении на кнопку
     */
    function addButtonWithModal(container, label, text, title = undefined) {

        const button = document.createElement('button');

        if (title) {
            button.title = title;
        }

        button.innerText = label;
        button.onclick = function (event) {
            event.stopPropagation();  // Остановить всплытие события, чтобы избежать немедленного закрытия модального окна

            closeModal(); // Закрыть ранее открытые модальные окна

            const modal = document.createElement('div');
            modal.className = 'modal';

            // Преобразование URL в кликабельные ссылки и сохранение переносов строк
            const processedText = text.replace(/https?:\/\/\S+/gi, (match) => {
                // Регулярное выражение для проверки валидных символов в конце URL
                const validUrlEnd = /^.*?(?=[^\w\-/:#@?&=.%]|$)/i;
                const url = match.match(validUrlEnd)[0];
                const remainingText = match.slice(url.length);
    
                return `<a href="${url}" target="_blank">${url}</a>${remainingText}`;
            }).replace(/\r\n|\n|\r/g, '<br>');

            // Используем innerHTML вместо innerText, чтобы поддерживать HTML-синтаксис
            modal.innerHTML = processedText;

            // Позиционируем модальное окно рядом с кнопкой
            modal.style.left = event.pageX + 'px';
            modal.style.top = event.pagey + 'px';

            container.appendChild(modal);

            modal.style.display = 'block';

            // Задержка перед добавлением обработчика закрытия модального окна
            setTimeout(() => {
                document.addEventListener('click', closeModal, { once: true });
            }, 0);
        };
        container.appendChild(button);
    }

    /**
     * Функция закрывает ранее открытое поп-ап окно
     */
    function closeModal() {
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }
    }

    /**
     * Функция делает все кнопки недоступными
     */
    function disableAllButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
    }

    /**
     * Основная функция, получающая данные из API и вызывающая функцию отрисовки элементов
     * @returns 
     */
    function createClientData() {

        const CLIENT_ID = getClientId();

        if (!CLIENT_ID) {
            console.info('Client ID not found on the page.');
            return;
        }

        const API_URL = `https://dostavista.innera.space/ecid/api/clients/${CLIENT_ID}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            onload: function (response) {
                let clientData;
                try {
                    clientData = JSON.parse(response.responseText);
                } catch (error) {
                    console.error('Failed to parse JSON response.');
                    /* disableAllButtons(); */
                    return;
                }
    
                if (clientData.detail === "No Client matches the given query.") {
                    console.warn('No client data found.');
                    /* createUI(clientData);
                    disableAllButtons(); */
                } else {
                    createUI(clientData);
                }
            },
            onerror: function () {
                console.error('Failed to fetch client data.');
                disableAllButtons();
            }
        });
    }

    // --------------------------------------------------------------------------------------
    // Функционал отображения типа курьера (Обычный, Курьер-партнер, Особый)
    // --------------------------------------------------------------------------------------

    /**
     * Функция для получения содержимого страницы курьера 
     * @param {string} url 
     * @returns 
     */
    function fetchCourierPage(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject("Failed to load page");
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Функция для чтения элемента из HTML-строки
     * @param {string} html 
     * @returns Возвращает эмодзи в зависимости от типа курьера: 🐝 - особый, 🤠 - партнер, 😐 - обычный 
     */
    function readElementFromHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Ищем все элементы внутри #panel > div.profile
        const profileDiv = doc.querySelector("#panel > div.profile");
        if (!profileDiv) {
            console.log('Элемент #panel > div.profile не найден');
            return;
        }

        // Ищем нужный элемент по содержимому
        const partnerCourier = Array.from(profileDiv.querySelectorAll('div > a')).find(el => 
            el.href.includes('courier-partners')
        );

        if (partnerCourier) {
            // Ищем, есть ли упоминание особого
            const specialCourier = partnerCourier.textContent.toLowerCase().includes('особый');
            if (specialCourier) {
                return '🐝'; // Особый
            } else {
                return '🤠'; // Курьер-партнер
            }
        } 
        return '😐'; // Обычный
    }

    function createCourierTypeLabel(text) {
        const courierName = document.querySelector("#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional > div.add-block.autocomplete.result > div > div:nth-child(4) > a");

        courierName.innerText = `${text} ${courierName.innerText}`;
    }

    /**
     * Основная функция, определяющая тип курьера и отрисовывающая нужный элемент на странице
     */
    async function defineCourierType() {
        const courierLink = document.querySelector("#all > div.dispatcher-main-content > div > div > div.heading-section > div.additional > div.add-block.autocomplete.result > div > div:nth-child(4) > a");
        console.log(courierLink.href);
        if (courierLink) {
            let courierType;
            try {
                const html = await fetchCourierPage(courierLink.href);
                courierType = readElementFromHTML(html);
            } catch (error) {
                console.error('Ошибка при получении страницы курьера:', error);
            }
            createCourierTypeLabel(courierType);
        } else {
            console.log('Ссылка на страницу курьера не найдена');
        }
    }

    // --------------------------------------------------------------------------------------
    // Функционал сокрытия списка товаров под спойлер
    // --------------------------------------------------------------------------------------

    function createSpoilersOrderPackages() {
        // Находим все элементы с классом "order-packages"
        const orderPackages = document.querySelectorAll('.order-packages');

        orderPackages.forEach((element, index) => {
            // Создаем контейнер для спойлера
            const spoilerContainer = document.createElement('div');
            spoilerContainer.style.marginBottom = '10px';

            // Создаем кнопку для управления спойлером
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Показать список товаров';
            toggleButton.style.display = 'block';
            toggleButton.style.marginBottom = '5px';

            // Устанавливаем начальное состояние
            let isCollapsed = true;

            // Скрываем содержимое
            element.style.display = 'none';

            // Обработчик клика на кнопку
            toggleButton.addEventListener('click', () => {
                isCollapsed = !isCollapsed;
                element.style.display = isCollapsed ? 'none' : 'block';
                toggleButton.textContent = isCollapsed ? 'Показать список товаров' : 'Скрыть список товаров';
            });

            // Вставляем кнопку и содержимое в контейнер
            element.parentNode.insertBefore(spoilerContainer, element);
            spoilerContainer.appendChild(toggleButton);
            spoilerContainer.appendChild(element);
        });
    }

    // Вызов основных функций 
    createClientData();
    defineCourierType();
    createSpoilersOrderPackages();
})();