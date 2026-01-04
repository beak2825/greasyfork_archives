// ==UserScript==
// @name         TS: Admin Enhancements (Поиск, Кнопки, Таблицы)
// @version      7.2.2
// @description  Единый скрипт: поиск, кнопки копирования (ID/Booker/Excel/FullID/RRN), улучшение таблиц платежей/чеков.
// @author       sm1le
// @match        https://ts.gs.tatneftm.ru/admin/*
// @grant        none
// @namespace https://greasyfork.org/users/1452753
// @downloadURL https://update.greasyfork.org/scripts/531485/TS%3A%20Admin%20Enhancements%20%28%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%2C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%2C%20%D0%A2%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531485/TS%3A%20Admin%20Enhancements%20%28%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%2C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%2C%20%D0%A2%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%8B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // --- Константы ---
    // =========================================================================
    const ORDER_PAGE_REGEX = /https:\/\/ts\.gs\.tatneftm\.ru\/admin\/orders\/order\/[a-f0-9\-]{36}(\/change\/?|\/?)(\?.*)?$/;
    const PAYMENT_HEADERS_MAP = {
        'cost_complete': 'Итоговая цена',
        'id': 'ID',
        'full_id': 'FULL ID',
        'rc': 'RC',
        'result': 'RESULT'
    };
    const PAYMENT_FIELDS_TO_MOVE = ['id', 'full_id', 'rrn', 'result', 'rc', 'int_ref', 'create_date', 'complete_date'];
    const RECEIPT_FIELDS_PARSE = [
        { regex: /'document_id': '([^']+)'/, label: 'Номер чека' },
        { regex: /'quantity': ([\d.]+)/, label: 'Топливо' },
        { regex: /'price': ([\d.]+)/, label: 'Цена за литр' },
        { regex: /'amount': ([\d.]+)/, label: 'Сумма' },
        { regex: /'text': '([^']+)'/, label: 'Вид топлива' }
    ];

    // =========================================================================
    // --- Утилиты ---
    // =========================================================================

    /** Безопасный querySelector */
    const querySelectorSafe = (selector, context = document) => {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.error(`Ошибка при поиске ${selector}:`, e);
            return null;
        }
    };

    /** Обновляет текстовое содержимое элементов */
    const updateTextContent = (selector, search, replace, context = document) => {
        context.querySelectorAll(selector).forEach(el => {
            if (el.textContent) {
                el.textContent = el.textContent.replace(search, replace);
            }
        });
    };

    /** Применяет базовые стили к кнопке/ссылке */
    function applyButtonStyles(element) {
        Object.assign(element.style, {
            backgroundColor: '#79aec8',
            color: 'aliceblue',
            border: 'none',
            padding: '5px 5px',
            marginLeft: '1px',
            marginTop: '1px',
            marginRight: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
            verticalAlign: 'middle',
            height: '25px',
            boxSizing: 'border-box',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        element.style.paddingTop = '0';
        element.style.paddingBottom = '0';

        element.onmouseenter = () => {
            element.style.backgroundColor = '#5f94b1';
        };

        element.onmouseleave = () => {
            element.style.backgroundColor = '#79aec8';
        };
    }

    /** Проверяет на валидный UUID */
    function isValidUUID(id) {
        if (typeof id !== 'string') return false;
        const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
        return uuidPattern.test(id);
    }

    /** Проверяет на валидный номер карты */
    function isValidCardNumber(number) {
        if (typeof number !== 'string') return false;
        const cardPattern = /^\d{17}$/;
        return cardPattern.test(number);
    }

    /** Редирект на заказ по UUID */
    function redirectToOrderByUUID(uuid) {
        window.location.href = `https://ts.gs.tatneftm.ru/admin/orders/order/${uuid}/change/`;
    }

    /** Редирект на поиск по номеру карты */
    function redirectToOrderByCardNumber(cardNumber) {
        window.location.href = `https://ts.gs.tatneftm.ru/admin/orders/order/?client__card_number=${cardNumber}`;
    }

    /** Показывает временное уведомление */
    function showTemporaryMessage(message, duration = 1500, isSuccess = true) {
        const notification = document.createElement('div');
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 15px',
            borderRadius: '4px',
            color: 'white',
            backgroundColor: isSuccess ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)',
            zIndex: '10001',
            fontSize: '13px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
            textAlign: 'center'
        });

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.addEventListener('transitionend', () => {
                notification.remove();
            }, { once: true });
        }, duration);
    }

    /** Извлекает Order ID из breadcrumbs */
    function extractOrderId(breadcrumbs) {
        if (!breadcrumbs) return '';

        const nodes = Array.from(breadcrumbs.childNodes);
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim().replace(/^›\s*/, '');
                if (isValidUUID(text)) {
                    return text;
                }
            }
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
                const text = node.textContent.trim();
                const hrefUuidMatch = node.href?.match(/([a-f0-9\-]{36})\/?(change)?\/?$/i);
                if (isValidUUID(text)) {
                    return text;
                } else if (hrefUuidMatch && isValidUUID(hrefUuidMatch[1])) {
                    return hrefUuidMatch[1];
                }
            }
        }

        console.warn("Не удалось извлечь Order ID из breadcrumbs.");
        return '';
    }

    /** Обрабатывает ввод в полях поиска */
    function handleSearch(inputValue) {
        const value = inputValue.trim();
        if (isValidUUID(value)) {
            redirectToOrderByUUID(value);
        } else if (isValidCardNumber(value)) {
            redirectToOrderByCardNumber(value);
        } else {
            console.warn("Введен неверный ID или номер карты:", value);
            showTemporaryMessage("Неверный формат ID или номера карты КЧ", 4000, false);
        }
    }

    /** Извлекает текст из readonly div рядом с меткой */
    function getReadonlyValueByLabel(labelText) {
        const labels = document.querySelectorAll('.form-row label');
        for (const label of labels) {
            if (label.textContent.trim().startsWith(labelText)) {
                const readonlyDiv = label.closest('.form-row')?.querySelector('div.readonly');
                if (readonlyDiv) {
                    return readonlyDiv.textContent.trim();
                }
            }
        }
        return '';
    }

    /** Извлекает значение input рядом с меткой */
    function getInputValueByLabel(labelText) {
        const labels = document.querySelectorAll('.form-row label');
        for (const label of labels) {
            if (label.textContent.trim().startsWith(labelText)) {
                const inputId = label.getAttribute('for');
                let inputElement = null;
                if (inputId) {
                    inputElement = document.getElementById(inputId);
                }
                if (!inputElement) {
                    inputElement = label.closest('.form-row')?.querySelector('input, textarea');
                }
                if (inputElement) {
                    return inputElement.value.trim();
                }
            }
        }
        return '';
    }

    /** Парсит дату из русского формата в DD.MM.YYYY */
    function parseRussianDateToDDMMYYYY(dateString) {
        if (!dateString) return '';

        const months = {
            'января': '01',
            'февраля': '02',
            'марта': '03',
            'апреля': '04',
            'мая': '05',
            'июня': '06',
            'июля': '07',
            'августа': '08',
            'сентября': '09',
            'октября': '10',
            'ноября': '11',
            'декабря': '12'
        };

        const match = dateString.match(/(\d{1,2})\s+([а-я]+)\s+(\d{4})/i);
        if (match) {
            const day = match[1].padStart(2, '0');
            const month = months[match[2].toLowerCase()];
            const year = match[3];
            if (day && month && year) {
                return `${day}.${month}.${year}`;
            }
        }

        const simpleDateMatch = dateString.match(/^(\d{2}\.\d{2}\.\d{4})/);
        if (simpleDateMatch) {
            return simpleDateMatch[1];
        }

        console.warn("Не удалось распарсить дату:", dateString);
        return dateString;
    }

    // =========================================================================
    // --- Функции создания элементов интерфейса ---
    // =========================================================================

    /** Создает кнопку копирования ID */
    function createCopyButton(orderId) {
        const copyButton = document.createElement('button');
        copyButton.textContent = '📋 ID';
        copyButton.title = 'Скопировать ID заказа';
        copyButton.type = 'button';

        applyButtonStyles(copyButton);

        copyButton.onclick = async (event) => {
            event.preventDefault();
            try {
                await navigator.clipboard.writeText(orderId);
                console.log('ID скопирован:', orderId);
                showTemporaryMessage('ID скопирован!', 1500, true);
            } catch (err) {
                console.error('Не удалось скопировать ID:', err);
                showTemporaryMessage('Ошибка при копировании ID.', 3000, false);
            }
        };

        return copyButton;
    }

    /** Создает кнопку копирования ссылки Booker */
    function createCopyLinkButton(orderId) {
        const copyLinkButton = document.createElement('button');
        copyLinkButton.textContent = '🔗 Booker';
        copyLinkButton.title = 'Скопировать ссылку на заказ в Booker';
        copyLinkButton.type = 'button';

        applyButtonStyles(copyLinkButton);

        const orderLink = `https://booker.gs.tatneftm.ru/orders/${orderId}/info`;

        copyLinkButton.onclick = async (event) => {
            event.preventDefault();
            try {
                await navigator.clipboard.writeText(orderLink);
                console.log('Ссылка скопирована:', orderLink);
                showTemporaryMessage('Ссылка Booker скопирована!', 1500, true);
            } catch (err) {
                console.error('Не удалось скопировать ссылку:', err);
                showTemporaryMessage('Ошибка при копировании ссылки.', 3000, false);
            }
        };

        return copyLinkButton;
    }

    /** Создает кнопку копирования данных Excel */
    function createCopyExcelButton() {
        const copyExcelButton = document.createElement('button');
        copyExcelButton.textContent = '📋 Excel';
        copyExcelButton.title = 'Скопировать данные для Excel';
        copyExcelButton.type = 'button';

        applyButtonStyles(copyExcelButton);

        copyExcelButton.onclick = async (event) => {
            event.preventDefault();
            try {
                const orderId = extractOrderId(document.querySelector('.breadcrumbs'));
                const clientText = getReadonlyValueByLabel("Клиент");
                const cardNumberMatch = clientText.match(/\b(\d{17})\b/);
                const cardNumber = cardNumberMatch ? cardNumberMatch[1] : '';
                const rrnInput = document.querySelector('input[name="payments-0-rrn"]');
                const rrn = rrnInput ? rrnInput.value : '';
                const fuelText = getReadonlyValueByLabel("Топливо заказа");
                const fuelTypeMatch = fuelText.match(/Цена\s+(.+?)\s+на\s+АЗС/i);
                const fuelType = fuelTypeMatch ? fuelTypeMatch[1].trim() : '';
                const orgText = getReadonlyValueByLabel("Organization");

                let filial = '';
                let organization = '';

                if (orgText.includes('Северо-Запад')) {
                    filial = 'Северо-Запад';
                    organization = 'Северо-Запад';
                } else {
                    const filialMatch = orgText.match(/^([^\s]+)/);
                    filial = filialMatch ? filialMatch[1] : '';
                    const centerFilials = ['Чувашский', 'Казанский', 'Бавлинский', 'Удмуртский', 'Ульяновский', 'Альметьевский', 'Челнинский', 'Марийский', 'Самарский', 'Кемеровский'];
                    const westFilials = ['Московский', 'Подмосковный', 'Приволжский', 'Владимирский', 'Архангельский'];

                    if (centerFilials.some(f => orgText.includes(f))) {
                        organization = 'Центр';
                    } else if (westFilials.some(f => orgText.includes(f))) {
                        organization = 'Запад';
                    } else {
                        const nameAfterDash = orgText.split('—')[1]?.trim();
                        if (nameAfterDash) {
                            if (nameAfterDash.includes('Центр')) organization = 'Центр';
                            else if (nameAfterDash.includes('Запад')) organization = 'Запад';
                            else if (nameAfterDash.includes('Северо-Запад')) organization = 'Северо-Запад';
                            else organization = nameAfterDash;
                        } else {
                            organization = filial;
                        }
                    }
                }

                const azsNumberMatch = fuelText.match(/АЗС\s+с\s+номером\s+(\d+)/i);
                const azsNumber = azsNumberMatch ? azsNumberMatch[1] : '';
                const createDateText = getReadonlyValueByLabel("Дата создания");
                const orderDate = parseRussianDateToDDMMYYYY(createDateText);
                const nalivInput = document.querySelector('input[name="fuel_quantity_complete"]');
                const nalivRaw = nalivInput ? nalivInput.value : '0';
                const naliv = Number(nalivRaw).toFixed(2);

                const data = [orderId, cardNumber, rrn, fuelType, filial, organization, azsNumber, orderDate, naliv].join('\t');
                await navigator.clipboard.writeText(data);
                console.log('Данные для Excel скопированы:\n', data);
                showTemporaryMessage('Данные для Excel скопированы!', 1500, true);
            } catch (err) {
                console.error('Не удалось скопировать данные для Excel:', err);
                showTemporaryMessage('Ошибка при копировании данных.', 3000, false);
            }
        };

        return copyExcelButton;
    }

    /** Создает кнопку копирования для input */
    const createCopyInputButton = (inputElement) => {
        const button = document.createElement('button');
        button.textContent = '📋';
        button.type = 'button';
        button.title = 'Скопировать значение';

        Object.assign(button.style, {
            marginLeft: '5px',
            padding: '4px 7px',
            fontSize: '12px',
            cursor: 'pointer',
            verticalAlign: 'middle',
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            borderRadius: '3px'
        });

        button.onmouseenter = () => button.style.backgroundColor = '#e0e0e0';
        button.onmouseleave = () => button.style.backgroundColor = '#f0f0f0';

        button.onclick = async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const valueToCopy = inputElement.value;
            if (!valueToCopy) {
                showTemporaryMessage('Нечего копировать', 1000, false);
                return;
            }
            try {
                await navigator.clipboard.writeText(valueToCopy);
                showTemporaryMessage('Скопировано!', 1000, true);
            } catch (err) {
                console.error('Ошибка копирования:', err);
                showTemporaryMessage('Ошибка копирования', 1500, false);
            }
        };

        return button;
    };

    /** Создает секцию быстрого поиска */
    function createSearchSection() {
        const searchSection = document.createElement('div');
        searchSection.className = 'module';
        searchSection.id = 'quick-search-module';

        searchSection.innerHTML = `
            <h2>Быстрый поиск</h2>
            <div class="quick-search-content" style="padding: 5px 10px 10px 10px;">
                <div class="quick-search-wrapper">
                    <input type="text" id="quick-search-id-input" placeholder="Введите ID или карту">
                    <button type="button" id="quick-search-button">Поиск</button>
                </div>
            </div>
        `;

        const wrapper = searchSection.querySelector('.quick-search-wrapper');
        const input = searchSection.querySelector('#quick-search-id-input');
        const button = searchSection.querySelector('#quick-search-button');

        Object.assign(wrapper.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        });

        Object.assign(input.style, {
            flexGrow: '1',
            width: 'auto',
            minWidth: '80px',
            marginLeft: '0',
            padding: '5px 8px',
            boxSizing: 'border-box',
            fontSize: '13px'
        });

        applyButtonStyles(button);
        Object.assign(button.style, {
            flexShrink: '0',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '0'
        });

        button.onclick = () => handleSearch(input.value);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch(input.value);
            }
        });

        return searchSection;
    }

    // =========================================================================
    // --- Функции модификации DOM (специфичные для страницы заказа) ---
    // =========================================================================

    /** Обновляет заголовки таблицы платежей */
    const updatePaymentHeaders = () => {
        Object.entries(PAYMENT_HEADERS_MAP).forEach(([className, text]) => {
            const header = querySelectorSafe(`#payments-group th.column-${className}`);
            if (header) header.textContent = text;
        });
    };

    /** Обрабатывает текст полей в таблице платежей */
    const processPaymentFieldText = () => {
        updateTextContent('#payments-group td.field-result p', 'Код ответа платежного шлюза. ', '');
        updateTextContent('#payments-group td.field-rc p', 'Дополнительный код ответа платежного шлюза. ', '');
        updateTextContent('#payments-group td.field-result p', 'Код ответа СБП платежа. Code:', 'СБП:');
    };

    /** Модифицирует таблицу платежей (перенос + кнопки копирования) */
    const processPaymentsTable = () => {
        document.querySelectorAll('#payments-group table').forEach(table => {
            const headerRow = querySelectorSafe('thead tr', table);
            if (!headerRow) return;

            const rows = table.querySelectorAll('tbody .form-row.has_original');
            rows.forEach(row => {
                const newHeaderRow = document.createElement('tr');
                const newValueRow = document.createElement('tr');

                PAYMENT_FIELDS_TO_MOVE.forEach(field => {
                    const fieldTd = querySelectorSafe(`.field-${field}`, row);
                    const headerTh = querySelectorSafe(`.column-${field}`, headerRow);

                    if (fieldTd && headerTh) {
                        const clonedHeaderTh = headerTh.cloneNode(true);
                        const clonedFieldTd = fieldTd.cloneNode(true);

                        if (field === 'full_id' || field === 'rrn') {
                            const inputElement = querySelectorSafe('input', clonedFieldTd);
                            if (inputElement) {
                                const copyButton = createCopyInputButton(inputElement);
                                inputElement.parentNode?.insertBefore(copyButton, inputElement.nextSibling);
                                if (inputElement.parentNode?.tagName === 'DIV') {
                                    Object.assign(inputElement.parentNode.style, {
                                        display: 'flex',
                                        alignItems: 'center'
                                    });
                                    inputElement.style.flexGrow = '1';
                                }
                            }
                        }

                        newHeaderRow.appendChild(clonedHeaderTh);
                        newValueRow.appendChild(clonedFieldTd);
                        fieldTd.remove();
                    }
                });

                row.after(newValueRow);
                row.after(newHeaderRow);
            });

            PAYMENT_FIELDS_TO_MOVE.forEach(field => {
                const header = querySelectorSafe(`.column-${field}`, headerRow);
                if (header) header.remove();
            });
        });

        document.querySelectorAll('#payments-group td.field-id p').forEach(p => {
            const paymentId = p.textContent.trim();
            if (!paymentId) return;
            p.innerHTML = `<a href="/admin/orders/payment/${paymentId}/change/">${paymentId}</a>`;
        });

        const style = document.createElement('style');
        style.textContent = `
            th.original, td.original, td.delete { display: none; }
            input[name$="-full_id"], input[name$="-rrn"], input[name$="-int_ref"] { width: 150px !important; min-width: 150px; }
            td.field-full_id > div, td.field-rrn > div { display: flex !important; align-items: center !important; gap: 5px; }
            td.field-full_id input, td.field-rrn input { flex-grow: 1; width: auto !important; }
            #payments-group thead tr th:last-child { display: none; }
        `;
        document.head.appendChild(style);
    };

    /** Обрабатывает отображение данных чеков */
    const processReceipts = () => {
        document.querySelectorAll('#receipts-group .field-online_cash_register_response_body p').forEach(receiptP => {
            const text = receiptP.textContent?.trim();
            const row = receiptP.closest('tr');
            const originalTd = row?.querySelector('td.original');
            let receiptId, receiptLink;

            if (originalTd) {
                const idInput = originalTd.querySelector('input[name$="-id"]');
                receiptId = idInput?.value;
                const linkElement = originalTd.querySelector('a.inlinechangelink');
                receiptLink = linkElement?.href;
            } else {
                console.warn('Не найдено td.original для строки чека:', row);
            }

            if (!text) {
                receiptP.innerHTML = 'Данные чека отсутствуют';
                return;
            }

            let html;
            if (text === 'Данные чека недоступны' && receiptId && receiptLink) {
                html = `Данные чека: <a href="${receiptLink}">${receiptId}</a>`;
            } else {
                html = RECEIPT_FIELDS_PARSE.map(({ regex, label }) => {
                    const match = text.match(regex);
                    if (match) {
                        const value = match[1];
                        if (label === 'Номер чека' && receiptLink) {
                            return `${label}: <a href="${receiptLink}">${value}</a><br>`;
                        }
                        return `${label}: ${value}<br>`;
                    }
                    return '';
                }).join('') || 'Данные чека недоступны';

                if (text !== 'Данные чека недоступны' && !text.match(RECEIPT_FIELDS_PARSE[0].regex) && receiptId && receiptLink) {
                    html = `Номер чека: <a href="${receiptLink}">${receiptId}</a><br>` + html;
                }
            }

            receiptP.innerHTML = html;
        });
    };

    /** Изменяет текст ссылок на скачивание чеков */
    const processReceiptLinks = () => {
        document.querySelectorAll('#receipts-group td.field-link a[href*="cheques-lk.orangedata.ru"]').forEach(link => {
            link.textContent = 'Скачать';
        });
    };

    // =========================================================================
    // --- Инициализация ---
    // =========================================================================

    /** Инициализирует глобальные модификации (поиск) */
    function initializeGlobalMods() {
        const headerSearchContainer = document.querySelector('.header-search-container');
        if (!headerSearchContainer) {
            console.warn("Контейнер поиска в шапке не найден.");
            return;
        }

        const headerSearchForm = headerSearchContainer.querySelector('.search-form');
        const headerSearchButton = headerSearchForm?.querySelector('button[type="submit"]');
        const headerInputField = headerSearchForm?.querySelector('input[type="text"]');

        if (headerSearchButton) {
            headerSearchButton.textContent = 'Поиск';
            applyButtonStyles(headerSearchButton);
            Object.assign(headerSearchButton.style, {
                marginLeft: '5px',
                marginRight: '0',
                marginTop: '0',
                height: '30px'
            });

            headerSearchButton.addEventListener('click', (event) => {
                if (headerInputField) {
                    event.preventDefault();
                    handleSearch(headerInputField.value);
                }
            });
        }

        if (headerInputField) {
            Object.assign(headerInputField.style, {
                width: '400px',
                verticalAlign: 'middle',
                height: '30px',
                boxSizing: 'border-box'
            });

            headerInputField.placeholder = "Введите ID заказа или карту КЧ";
            headerInputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearch(headerInputField.value);
                }
            });

            if (headerInputField.name === 'q') {
                headerInputField.removeAttribute('name');
            }
        }

        if (headerSearchForm) {
            headerSearchForm.addEventListener('submit', (event) => {
                event.preventDefault();
                if (headerInputField) {
                    handleSearch(headerInputField.value);
                }
            });
        }

        if (!document.getElementById('quick-search-module')) {
            const searchSection = createSearchSection();
            const siebelModule = document.querySelector('.app-siebel.module');

            if (siebelModule?.parentNode) {
                siebelModule.parentNode.insertBefore(searchSection, siebelModule.nextSibling);
                console.log("Секция поиска вставлена после модуля Siebel.");
            } else {
                const firstModule = document.querySelector('#content-main .module, #nav-sidebar .module');
                const targetContainer = firstModule?.parentNode || document.getElementById('content-main') || document.getElementById('nav-sidebar');

                if (targetContainer) {
                    if (firstModule) {
                        targetContainer.insertBefore(searchSection, firstModule.nextSibling);
                        console.warn(`Модуль Siebel не найден, секция поиска вставлена после первого модуля в ${targetContainer.id || 'контейнере'}.`);
                    } else {
                        targetContainer.insertBefore(searchSection, targetContainer.firstChild);
                        console.warn(`Модули не найдены, секция поиска вставлена в начало ${targetContainer.id || 'контейнера'}.`);
                    }
                } else {
                    console.error('Не удалось найти подходящее место для вставки секции быстрого поиска.');
                }
            }
        }
    }

    /** Инициализирует модификации, специфичные для страницы заказа */
    function initializeOrderPageMods() {
        if (!ORDER_PAGE_REGEX.test(window.location.href)) return;

        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (breadcrumbs && !breadcrumbs.querySelector('.copy-order-id-button')) {
            setTimeout(() => {
                if (breadcrumbs.querySelector('.copy-order-id-button')) return;
                const orderId = extractOrderId(breadcrumbs);
                if (orderId) {
                    const copyIdBtn = createCopyButton(orderId);
                    copyIdBtn.classList.add('copy-order-id-button');
                    const copyLinkBtn = createCopyLinkButton(orderId);
                    copyLinkBtn.classList.add('copy-booker-link-button');
                    const copyExcelBtn = createCopyExcelButton();
                    copyExcelBtn.classList.add('copy-excel-data-button');

                    breadcrumbs.appendChild(copyIdBtn);
                    breadcrumbs.appendChild(copyLinkBtn);
                    breadcrumbs.appendChild(copyExcelBtn);
                } else {
                    console.error("Не удалось извлечь Order ID для создания кнопок копирования.");
                }
            }, 50);
        } else if (!breadcrumbs) {
            console.error("Элемент .breadcrumbs не найден на странице заказа.");
        }

        if (!document.body.classList.contains('ts-admin-enhancements-applied')) {
            try {
                updatePaymentHeaders();
                processPaymentFieldText();
                processPaymentsTable();
                processReceipts();
                processReceiptLinks();
                document.body.classList.add('ts-admin-enhancements-applied');
            } catch (error) {
                console.error('Ошибка при применении модификаций таблиц/чеков:', error);
            }
        }
    }

    // --- Запуск инициализации ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGlobalMods);
        document.addEventListener('DOMContentLoaded', initializeOrderPageMods);
    } else {
        initializeGlobalMods();
        initializeOrderPageMods();
    }

})();