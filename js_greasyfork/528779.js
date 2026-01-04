// ==UserScript==
// @name         FunPay Tools V1
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт добавляет панель накрутки, удобную клавиатуру быстрых ответов в чате и быстрый ответ на отзыв на сайте FunPay
// @author       ETHERNITY
// @icon         https://www.google.com/s2/favicons?sz=64&domain=funpay.com
// @match        https://funpay.com/chat/*
// @match        https://funpay.com/orders/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/528779/FunPay%20Tools%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/528779/FunPay%20Tools%20V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация SMM
    const API_KEY = '***'; // Замените на ваш API ключ
    const API_URL = 'https://smmstay.xyz/api/v2'; // Замените на ваш сервис накрутки
    const API_URL1 = 'https://smmstay.xyz/api/v2?action=balance&key=' + API_KEY;


    // Список услуг, редактируйте согласно вашим услугам
    const services = [
        { name: 'Telegram | БЕЗ СПИСАНИЙ САБЫ', id: 2300 },
        { name: 'Telegram | Реакции [Негативные]', id: 2033 },
        { name: 'Telegram | Просмотры | Быстрые', id: 2176 },
        { name: 'Telegram | Реакции [ПОЗИТИВ]', id: 2032 },
        { name: 'Telegram | R14 - ПРЕМИУМ ПОДПИСЧИКИ', id: 2150 },
        { name: 'Telegram | R3 ПОДПИСЧИКИ', id: 1952 },
        { name: 'VK | РУ Подписчики', id: 2266 },
        { name: 'VK | Просмотры на пост', id: 2172 },
        { name: 'VK | Просмотры на видео', id: 2243 },
        { name: 'VK | ЛАЙКИ РОССИЯ ОБЩИЕ', id: 1363 },
        { name: 'YouTube | Подписчики FAKE V3', id: 2189 },
        { name: 'YouTube | ЛАЙКИ [5-20% СПИСАНИЙ]', id: 1955 },
        { name: 'YouTube | ПОДПИСЧИКИ [БОТЫ] ', id: 2244 },
        { name: 'YouTube | ПРОСМОТРЫ SHORTS!', id: 1306 },
        { name: 'YouTube | Просмотры', id: 2280 },
    ];
    // Конфигурация Быстрого ответа
    const CONFIG = {
        responseText: "Благодарю за заказ, ждем вас снова!",
        paramName: "quickResponse",
        checkInterval: 500,
        maxAttempts: 15
    };
    // Конфигурация клавиатуры
    const buttonsConfig = [
        { text: 'Здравствуйте! Продавец на связи. Чем могу быть полезен?', label: 'Здравствуйте!' },
        { text: 'Спасибо за заказ! Мы уже начали его выполнение. Среднее время накрутки - от 5 минут до нескольких часов.', label: 'Ваш заказ в работе' },
        { text: 'Проверьте, пожалуйста, выполнение нами заказа, и подтвердите его на сайте.', label: 'Проверка' },
        { text: 'Оставьте пожалуйста отзыв о работе с нами! Нам важно ваше мнение!', label: 'Оставь отзыв' },
        { text: 'Всего доброго! Удачи Вам и ждем Вас снова!', label: 'Прости, прощай' }
    ];

    GM_addStyle(`
        .fp-quick-btn {
            margin-left: 10px!important;
            padding: 3px 10px!important;
            border-radius: 3px!important;
            background: #198cf3!important;
            color: white!important;
            border: none!important;
            cursor: pointer!important;
        }
        .fp-highlight-box {
            border: 2px solid #198cf3!important;
            animation: fp-highlight 2s ease-in-out;
        }
        @keyframes fp-highlight {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `);

    // Для страницы чата
    if (location.pathname.startsWith('/chat')) {
        const processMessages = () => {
            $('.alert-info, .alert-success').each(function() {
                const $msg = $(this);
                if ($msg.text().includes('написал отзыв к заказу') && !$msg.find('.fp-quick-btn').length) {
                    const orderId = $msg.text().match(/#([A-Z0-9]{8,})/)?.[1];
                    if (orderId) {
                        const $btn = $(`<button class="fp-quick-btn">Быстрый ответ</button>`);
                        $btn.click(() => {
                            GM_openInTab(`https://funpay.com/orders/${orderId}/?${CONFIG.paramName}=1`, {
                                active: true,
                                setParent: true
                            });
                        });
                        $msg.find('a[href*="/orders/"]').after($btn);
                    }
                }
            });
        };

        new MutationObserver(processMessages).observe(document.body, {
            childList: true,
            subtree: true
        });
        processMessages();
    }

    // Для страницы заказа
    if (location.pathname.startsWith('/orders/')) {
        let attempts = 0;
        const interval = setInterval(() => {
            const $form = $('.review-item-answer-form.review-editor-reply');
            const $textarea = $form.find('textarea');
            const urlParams = new URLSearchParams(location.search);

            if ($textarea.length && urlParams.has(CONFIG.paramName)) {
                clearInterval(interval);

                // Заполнение текста
                $textarea.val(CONFIG.responseText).trigger('input');

                // Анимация и скролл
                $form.addClass('fp-highlight-box')
                    .get(0)
                    .scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                // Фокус на текстовое поле
                setTimeout(() => {
                    $textarea.focus();
                    $form.removeClass('fp-highlight-box');
                }, 2000);
            }

            if (++attempts >= CONFIG.maxAttempts) clearInterval(interval);
        }, CONFIG.checkInterval);
    }

    const styles = `
        .quick-buttons-container {
            margin: 10px 0;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .quick-button {
            flex: 1 0 auto;
            position: relative;
            background-color: #4384d0;
            border: none;
            border-radius: 0.25em;
            padding: 0.5em 1em;
            font-size: 85%;
            font-weight: bold;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            cursor: pointer;
            transition: all 0.15s ease;
            text-shadow: 0 1px 1px rgba(0,0,0,0.1);
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .quick-button:hover {
            background-color: #3a73b5;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .quick-button:active {
            background-color: #32629b;
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
    `;

    function createButtonsContainer() {
        const container = document.createElement('div');
        container.className = 'quick-buttons-container';
        return container;
    }

    function createButtons() {
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);

        const textarea = document.querySelector('textarea.form-control');
        if (!textarea) return;

        const container = createButtonsContainer();
        buttonsConfig.forEach(config => {
            const button = document.createElement('button');
            button.className = 'quick-button';
            button.innerHTML = `<span class="chat-msg-author-label">${config.label}</span>`;
            // Добавляем обработчик события
            button.onclick = (e) => {
                e.preventDefault();
                textarea.value = config.text;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.focus();
            };
            container.appendChild(button);
        });

        textarea.parentNode.insertBefore(container, textarea.nextSibling);
    }

    window.addEventListener('load', createButtons);
    // Создаем интерфейс SMM панели
    const panelHTML = `
        <div id="smm-panel" style="position:fixed;top:0;right:0;width:380px;height:100vh;background:#fff;z-index:9999;padding:20px;box-shadow:-2px 0 10px rgba(0,0,0,0.1);overflow-y:auto;">
            <h3 style="margin-top:0;">SMM Панель</h3>
            <div style="margin-bottom:15px;">
                <label>Ссылка:</label>
                <input type="text" id="smm-link" placeholder="https://example.com" style="width:100%;padding:8px;margin-top:5px;">
            </div>
            <div style="margin-bottom:15px;">
                <label>Услуга:</label>
                <select id="smm-service" style="width:100%;padding:8px;margin-top:5px;">
                    ${services.map(s => `<option value="${s.id}">${s.name} (ID:${s.id})</option>`).join('')}
                </select>
            </div>
            <div style="margin-bottom:15px;">
                <label>Количество:</label>
                <div style="display:flex;gap:5px;margin-bottom:5px;">
                    <button type="button" class="qty-btn" data-qty="100">100</button>
                    <button type="button" class="qty-btn" data-qty="500">500</button>
                    <button type="button" class="qty-btn" data-qty="1000">1000</button>
                </div>
                <input type="number" id="smm-quantity" min="1" style="width:100%;padding:8px;">
            </div>
            <button id="smm-submit" style="width:100%;padding:10px;background:#28a745;color:#fff;border:none;cursor:pointer;">Отправить</button>
            <div id="api-response" style="margin-top:15px;padding:10px;display:none;"></div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // ===========================================================================================

// Создаем элемент для отображения баланса
    const balanceButton = document.createElement('div');
    balanceButton.id = 'smm-balance';
    balanceButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; cursor: default; margin-top: 15px; padding: 10px; display: block; background-color: rgb(212, 237, 218); color: rgb(21, 87, 36); border-radius: 4px;';
    balanceButton.textContent = 'Загрузка баланса...';

    document.body.appendChild(balanceButton);

    // Функция обновления баланса
    function updateBalance() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL1,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if(data.balance) {
                        balanceButton.textContent = `Баланс: ${data.balance} руб`;
                        balanceButton.style.backgroundColor = 'rgb(212, 237, 218)';
                        balanceButton.style.color = 'rgb(21, 87, 36)';
                    } else {
                        balanceButton.textContent = 'Ошибка получения баланса';
                        balanceButton.style.backgroundColor = 'rgb(248, 215, 218)';
                        balanceButton.style.color = 'rgb(114, 28, 36)';
                    }
                } catch(e) {
                    balanceButton.textContent = 'Ошибка парсинга ответа';
                    balanceButton.style.backgroundColor = 'rgb(248, 215, 218)';
                    balanceButton.style.color = 'rgb(114, 28, 36)';
                }
            },
            onerror: function(error) {
                balanceButton.textContent = 'Ошибка соединения';
                balanceButton.style.backgroundColor = 'rgb(248, 215, 218)';
                balanceButton.style.color = 'rgb(114, 28, 36)';
            }
        });
    }

    // Обновляем баланс сразу и каждую минуту
    updateBalance();
    setInterval(updateBalance, 60000);

    // Стили для кнопки
    GM_addStyle(`
        #smm-balance {
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        #smm-balance:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
    `);


    // ===========================================================================================

    // Обработчики событий
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('smm-quantity').value = btn.dataset.qty;
        });
    });

    document.getElementById('smm-submit').addEventListener('click', () => {
        const service = document.getElementById('smm-service').value;
        const link = document.getElementById('smm-link').value.trim();
        const quantity = document.getElementById('smm-quantity').value;
        const responseDiv = document.getElementById('api-response');

        if (!service || !link || !quantity) {
            showResponse('Заполните все поля!', 'error');
            return;
        }

        const params = new URLSearchParams({
            action: 'add',
            service: service,
            link: link,
            quantity: quantity,
            key: API_KEY
        });

        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: params.toString(),
            onload: function(response) {
                try {
                    const json = JSON.parse(response.responseText);
                    if (json.error) {
                        showResponse(`Ошибка: ${json.error}`, 'error');
                    } else {
                        showResponse(`Успешно! ID заказа: ${json.order}`, 'success');
                    }
                } catch (e) {
                    showResponse('Ошибка парсинга ответа API', 'error');
                }
            },
            onerror: function(error) {
                showResponse('Ошибка подключения к API', 'error');
            }
        });
    });

    function showResponse(text, type = 'info') {
        const colors = {
            success: '#d4edda',
            error: '#f8d7da',
            info: '#d1ecf1'
        };
        const responseDiv = document.getElementById('api-response');
        responseDiv.style.display = 'block';
        responseDiv.style.backgroundColor = colors[type] || colors.info;
        responseDiv.style.color = type === 'error' ? '#721c24' : '#155724';
        responseDiv.style.borderRadius = '4px';
        responseDiv.textContent = text;
        setTimeout(() => responseDiv.style.display = 'none', 5000);
    }



    GM_addStyle(`
        .qty-btn {
            flex: 1;
            padding: 5px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 3px;
            transition: background 0.2s;
        }
        .qty-btn:hover {
            background: #0056b3;
        }
        #smm-panel input, #smm-panel select {
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        #smm-panel input:focus, #smm-panel select:focus {
            border-color: #80bdff;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
        }
    `);
})();