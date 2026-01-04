// ==UserScript==
// @name         Dostavista. HelpdeskEddy +
// @namespace    http://tampermonkey.net/
// @version      1.5.1.1
// @description  Дополнительные возможности для HelpdeskEddy
// @author       Dostavista
// @match        https://dvcouriers.helpdeskeddy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496377/Dostavista%20HelpdeskEddy%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/496377/Dostavista%20HelpdeskEddy%20%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Стили для блока "Активные заказы" */

        .active-order-button {
            margin-bottom: 10px;
            display: block;
            padding: 5px 10px;
            border-radius: 5px;
            width: 120px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            background-color: white;
        }

        .active-order-button.vip {
            border: 1px solid #e1ad01;
            color: #000;
        }

        .active-order-button.vip:hover {
            background-color: #FCF7E3 !important;
        }

        .active-order-button:not(.vip) {
            border: 1px solid #ABABAB;
            color: #000;
        }

        .active-order-button:not(.vip):hover {
            background-color: #EEEEEE !important;
        }

        .active-orders-container {
            margin-top: 10px;
        }

        .active-orders-container span {
            font-weight: bold;
            border-top: 1px solid #e4e7ed;
            display: inline-block;
            width: 100%;
            line-height: 30px;
        }

        .no-active-orders {
            color: #888;
            margin-bottom: 10px;
        }

        /* Стили для кнопки "Нужна помощь" */

        .get-help-button-container {
            display: flex;
            width: 100%;
            margin-right: 10px;
            justify-content: flex-end;
        }

        .get-help-button {
            display: block;
            padding: 7px 10px;
            border-radius: 5px;
            width: 120px;
            background-color: #4C9A18;
            text-align: center;
            color: white;
            font-weight: bold;
        }

        .get-help-button:hover {
            color: white;
        }

        .get-help-button-inactive {
            background-color: #A8A8A8;
        }

        /* Стили для служебных тегов */
        .hide-service-tag {
            display: none !important;
        }

        /* Стили для свитчера функции автозакрытия вкладки */

        .toggle-container {
            display: inline-block;
        }

        .autoclose-toggle {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
            text-align: center;
        }

        .autoclose-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 17px;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 13px;
            width: 13px;
            left: 2px;
            bottom: 2px;
            border-radius: 50%;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .autoclose-toggle input:checked + .slider {
            background-color: #5CBB1C;
        }

        .autoclose-toggle input:focus + .slider {
            box-shadow: 0 0 1px #5CBB1C;
        }

        .autoclose-toggle input:checked + .slider:before {
            -webkit-transform: translateX(13px);
            -ms-transform: translateX(13px);
            transform: translateX(13px);
        }

        `);


    // --------------------------------------------------------------------------------------
    // Функционал формирования блока "Активные заказы" с кнопками-ссылками из номеров заказов
    // --------------------------------------------------------------------------------------

    // Селектор с номерами заказов
    const orderNumbersSelector = "#ticket-app > section > section > div.ticket > div.ticket-left-block > div.ticket-user > div.ticket-user__field > div.ticket-user__fields.ticket-user__custom-fields.ticket-user__custom-fields-group-2 > div.ticket-user__field.ticket-user__custom-field-8 > div.ticket-user__field-value > span.ticket-user__field-value-text";

    /**
     * Создает кнопку-ссылку на заказ, выбирая оформление в зависимости от типа заказа
     * @param {string} orderNumber - номер заказа
     * @param {boolean} isVIP - True, если заказ ВИП, false - если нет
     * @returns {HTMLAnchorElement}
     */
    function createOrderButton(orderNumber, isVIP) {
        const button = document.createElement('a');
        button.href = `https://dispatcher.dostavista.ru/dispatcher/orders/view/${orderNumber}`;
        button.target = '_blank';
        button.textContent = `${isVIP ? '⭐️' : '🛒'} Заказ ${orderNumber}`;
        button.classList.add('active-order-button');
        if (isVIP) {
            button.classList.add('vip');
        }
        return button;
    }

    /**
     * Формирует основной блок "Активные заказы" с данными
     */
    function processOrderNumbers() {
        const elements = document.querySelectorAll(orderNumbersSelector);
        elements.forEach(element => {
            if (element.dataset.processed) {
                return;
            }

            const orderNumbersText = element.textContent.trim();
            const orderNumbersArray = orderNumbersText === "no_active_order" ? [] : orderNumbersText.split(',').map(num => num.trim());

            const newButtonsContainer = element.closest(".ticket-left-block").querySelector(".ticket-user__basic-fields");

            // Основной контейнер
            const activeOrdersContainer = document.createElement('div');
            activeOrdersContainer.classList.add('active-orders-container');

            // Стили заголовка "Активные заказы"
            const activeOrdersText = document.createElement('span');
            activeOrdersText.textContent = 'Активные заказы';
            activeOrdersContainer.appendChild(activeOrdersText);

            // Если заказов нет, выводим информацию об этом
            if (orderNumbersText === "no_active_order") {
                const noActiveOrdersText = document.createElement('div');
                noActiveOrdersText.textContent = 'Активных заказов, возможно, нет';
                noActiveOrdersText.classList.add('no-active-orders');
                activeOrdersContainer.appendChild(noActiveOrdersText);
            } else { // Если есть, формируем из них кнопки-ссылки
                const buttonsContainer = document.createElement('div');

                orderNumbersArray.forEach(order => {
                    const isVIP = order.toLowerCase().includes('vip');
                    const orderNumber = order.replace(/\D/g, '').trim();
                    if (orderNumber) {
                        const orderLink = createOrderButton(orderNumber, isVIP);
                        buttonsContainer.appendChild(orderLink);
                    }
                });

                activeOrdersContainer.appendChild(buttonsContainer);
            }

            if (newButtonsContainer) {
                newButtonsContainer.appendChild(activeOrdersContainer);
            }

            element.dataset.processed = 'true';
        });
    }


    // --------------------------------------------------------------------------------------
    // Функционал создания кнопки "Нужна помощь"
    // --------------------------------------------------------------------------------------

    const bottomPanelSelector = "#pane-post > div > div.el-row";
    const departmentNameSelector = "#ticket-app > section > section > div.ticket > div.ticket-right-block > div > div.ticket-fields__basic > div.ticket-fields__field.ticket-fields__field-department > div.ticket-fields__field-input > div > div.el-select-dropdown.el-popper.ticket-fields__field-input.select-infinite-scroll-department > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li.el-select-dropdown__item.selected";

    /**
     * Создает кнопку-ссылку "Нужна помощь".
     * Кнопка ведет в Телеграмм, в рабочий чат той группы, на которой находится заявка (Enteprise, HRPartners)
     */
    function createGetHelpButton() {

        const bottomPanelElement = document.querySelector(bottomPanelSelector);

        if (bottomPanelElement.dataset.added) {
            return;
        }

        // Получаем имя департамента
        const departmentNameElement = document.querySelector(departmentNameSelector);
        const departmentName = departmentNameElement.textContent.trim();
        console.log(departmentName);

        bottomPanelElement.style.display = 'flex';
        bottomPanelElement.style.alignItems = 'center';

        const panelLeftSelector = document.querySelector("#pane-post > div > div.el-row > div.el-col.el-col-16");
        panelLeftSelector.style.width = 'auto';
        panelLeftSelector.style.whiteSpace = 'nowrap';

        // Ссылки на рабочие чаты группы Enteprise и HRPartners
        const TG_LINK_ENTERPRISE_CHAT = 'https://t.me/c/1976342459/1/87986';
        const TG_LINK_HRPARTNERS_CHAT = 'https://t.me/+_rVxfO_MscdhMWJi';

        const getHelpButton = document.createElement('a');
        getHelpButton.classList.add('get-help-button');
        if (departmentName == 'Enterprise') {
            getHelpButton.href = TG_LINK_ENTERPRISE_CHAT;
        }
        else if (departmentName == 'HR Partners') {
            getHelpButton.href = TG_LINK_HRPARTNERS_CHAT;
        }
        else {
            getHelpButton.classList.add('get-help-button-inactive');
        }
        getHelpButton.target = '_blank';
        getHelpButton.textContent = 'Нужна помощь';

        const getHelpContainer = document.createElement('div');
        getHelpContainer.classList.add('get-help-button-container');

        getHelpContainer.appendChild(getHelpButton);
        bottomPanelElement.insertBefore(getHelpContainer, panelLeftSelector);

        bottomPanelElement.dataset.added = 'true';
    }

    // --------------------------------------------------------------------------------------
    // Функционал подсвечивания служебных тегов  AIzaSyAAP3zIttcAvatYDwCf0Yi57tFeSgpBt5Y
    // --------------------------------------------------------------------------------------

    const FUTURE_TAG_PREFIX = '$_';

    /**
     * Словарь ключевых слов, словосочетаний, тегов в общем
     */
    const HIDE_KEYWORDS = [
        'лия: assigned', 'лия: closed', 'бот_роман: closed',
        'ночной_бот: assigned', 'ночной_бот: closed',
        'enterprise_bot: closed', 'enterprise_bot: assigned', 'enterprise_bot: assigned to team',
        'partners_bot: closed', 'partners_bot: assigned', 'partners_bot: assigned to team',
        'partners_bot_no_active: closed', 'partners_bot_no_active: assigned', 'partners_bot_no_active: assigned to team',
        'cs bot. assigned', 'cs. assigned to lia', 'cs n/a bot. assigned',
        'добрый_бот: closed', 'добрый_бот_н/а: closed',
        'ночной_бот_partners: assigned', 'ночной_бот_partners: closed',
        'cs na bot to cs', 'cs. lia: closed', 'cs bot. operator call', 'cs na bot. operator call',
        'parks_tg', 'disp_status notification', 'edu_status notification',
        'beznal_status notification', 'approval_delivery status notification',
        'approval_tg', 'clients_tg', 'скк филатова. проверено', 'partner_courier',
        'перевод из enterprise', 'перевод из hr partners',
        'авто-закрытие. старт', 'авто-закрытие. успешно',
        'partners: не рабочее время', 'ps. исходящее обращение', 'авто-закрытие. неуспешно'
    ];

    /**
     * Проверяет передаваемый текст через словарь ключевых слов, а также на наличие префикса.
     * @param {string} text - Текст, который нужно проверить.
     * @returns {boolean} True если текст находится в словаре/имеет префикс, false - если нет
     */
    function shouldHide(text) {
        return HIDE_KEYWORDS.some(keyword => text.includes(keyword)) || text.startsWith(FUTURE_TAG_PREFIX);
    }

    /**
     * Окрашивает передаваемый span элемент.
     * @param {HTMLElement} span - span элемент
     */
    function applyHidingStyle(span) {
        span.classList.add('hide-service-tag');
    }

    /**
     * Окрашивает тег, если в нем есть ключевая фраза, слово, или если он начинается с определенного префикса
     */
    function hideTags() {
        const tagsContainer = document.querySelector("#ticket-app > section > section > div.ticket > div.ticket-right-block > div > div.ticket-fields__basic > div.ticket-fields__field.ticket-fields__field-tags > div.ticket-fields__field-input.ticket-fields__field-input_tags > div > div.el-select__tags > span");

        if (!tagsContainer) {
            console.log("Tags container not found");
            return;
        }

        const tagSpans = tagsContainer.querySelectorAll('span.el-tag.el-tag--info.el-tag--mini.el-tag--light');

        tagSpans.forEach(span => {
            const textSpan = span.querySelector('span.el-select__tags-text');
            if (textSpan && shouldHide(textSpan.innerText.trim())) {
                applyHidingStyle(span);
            }
        });
    }

    // --------------------------------------------------------------------------------------
    // Функционал закрытия вкладки при нажатии на кнопку "Закрыть" или "Заморозить"
    // --------------------------------------------------------------------------------------

    /**
     * Функция для создания переключателя на странице
     */
    function createToggleSwitch() {

        const topBarElement = document.querySelector("#ticket-app > section > section > div.ticket-topbar > div.el-row > div:nth-child(1) > div.ticket-topbar-actions > div");

        const toggleContainer = document.createElement('div');
        toggleContainer.classList.add('toggle-container');
        toggleContainer.textContent = 'Автозакрытие вкладки: ';
        toggleContainer.style.fontSize = '12px';
        toggleContainer.style.marginLeft = '10px';

        const toggleLabel = document.createElement('label');
        toggleLabel.classList.add('autoclose-toggle');

        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';

        const slider = document.createElement('span');
        slider.classList.add('slider');

        // Устанавливаем начальное значение из localStorage
        toggleCheckbox.checked = localStorage.getItem('autoCloseEnabled') === 'true';

        // Обработчик изменения состояния чекбокса
        toggleCheckbox.addEventListener('change', function() {
            localStorage.setItem('autoCloseEnabled', toggleCheckbox.checked);
        });

        toggleContainer.appendChild(toggleLabel);
        toggleLabel.appendChild(toggleCheckbox);
        toggleLabel.appendChild(slider);
        topBarElement.appendChild(toggleContainer);
    }

    /**
     * Функция закрывает активную вкладку заявки спустя N милисекунд, если был осуществлён клик по целевым элементам
     */
    function closeActiveTab(){
        const closeConversationButtonElement = document.querySelector("#ticket-custom-field-18 > span > div");
        const freezeConversationButtonElement = document.querySelector("#ticket-custom-field-12 > span > div");
        const closeTabElement = document.querySelector("#ticket-app > section > section > div.ticket-topbar > div.ticket-tabs > div.ticket-tabs__tab.ticket-tabs__tab_active > i");
        const autoCloseEnabled = localStorage.getItem('autoCloseEnabled') === 'true';

        // Проверяем, что элементы найдены
        if (closeConversationButtonElement && freezeConversationButtonElement && closeTabElement && autoCloseEnabled) {
            // Добавляем обработчик клика на триггерный элемент
            closeConversationButtonElement.addEventListener('click', function() {
                // Имитируем клик на целевом элементе
                setTimeout(function() {
                    // Закрываем вкладку через 3 секунды
                    closeTabElement.click();
                }, 1800); // 3000 миллисекунд = 3 секунды
            });
            freezeConversationButtonElement.addEventListener('click', function() {
                // Имитируем клик на целевом элементе
                setTimeout(function() {
                    // Закрываем вкладку через 3 секунды
                    closeTabElement.click();
                }, 1800); // 3000 миллисекунд = 3 секунды
            });
        } else {
            console.warn('Trigger or target element not found.');
        }
    }


    /**
     * Запуск скрипта
     */
    function startScript() {
        waitForElement();
        createToggleSwitch();
    }

    /**
     * Отслеживание изменения элементов, т.к. при переходе по заявкам (например) страница не обновляется. Запуск функций при каждом изменении
     */
    function waitForElement() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    processOrderNumbers();
                    createGetHelpButton();
                    hideTags();
                    closeActiveTab();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Ждем загрузки страницы и только потом запускаем скрипт
     */
    window.addEventListener('load', startScript);

})();