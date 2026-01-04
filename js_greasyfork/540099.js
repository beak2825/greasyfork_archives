// ==UserScript==
// @name         ChatGPT Modal для всех сайтов
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Добавляет модальное окно с ChatGPT на любой сайт
// @author       Taras V Penzin (apexweb.ru)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @connect www.tampermonkey.net
// @connect self
// @connect localhost
// @connect 8.8.8.8
// @connect api.openai.com
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/540099/ChatGPT%20Modal%20%D0%B4%D0%BB%D1%8F%20%D0%B2%D1%81%D0%B5%D1%85%20%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/540099/ChatGPT%20Modal%20%D0%B4%D0%BB%D1%8F%20%D0%B2%D1%81%D0%B5%D1%85%20%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== НАСТРОЙКИ ==========
    // Задайте здесь ваш OpenAI API ключ
    const API_KEY = '...'; // ЗАМЕНИТЕ НА ВАШ КЛЮЧ!
    // ===============================

    // Ждем полной загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatGPT);
    } else {
        initChatGPT();
    }

    function initChatGPT() {
        console.log('🤖 Инициализация ChatGPT Modal...');

        // Проверяем API ключ
        if (!API_KEY) {
            console.error('🤖 ОШИБКА: Не задан API ключ OpenAI! Отредактируйте скрипт и задайте ваш ключ в переменной API_KEY');
            return;
        }

        // Добавляем стили для модального окна
        GM_addStyle(`
            .chatgpt-modal-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.7) !important;
                z-index: 2147483646 !important;
                display: none !important;
                align-items: center !important;
                justify-content: center !important;
                backdrop-filter: blur(4px) !important;
            }

            .chatgpt-modal-overlay.show {
                display: flex !important;
            }

            .chatgpt-modal {
                background: white !important;
                border-radius: 12px !important;
                width: 90% !important;
                max-width: 600px !important;
                max-height: 80vh !important;
                overflow: hidden !important;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3) !important;
                animation: chatgpt-modal-appear 0.3s ease-out !important;
                position: relative !important;
            }

            @keyframes chatgpt-modal-appear {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .chatgpt-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                padding: 20px !important;
                position: relative !important;
            }

            .chatgpt-modal-title {
                margin: 0 !important;
                font-size: 20px !important;
                font-weight: 600 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }

            .chatgpt-modal-close {
                position: absolute !important;
                right: 15px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                background: none !important;
                border: none !important;
                color: white !important;
                font-size: 24px !important;
                cursor: pointer !important;
                padding: 5px !important;
                border-radius: 50% !important;
                width: 35px !important;
                height: 35px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: background 0.2s !important;
            }

            .chatgpt-modal-close:hover {
                background: rgba(255, 255, 255, 0.2) !important;
            }

            .chatgpt-modal-body {
                padding: 20px !important;
                max-height: 60vh !important;
                overflow-y: auto !important;
            }

            .chatgpt-input-group {
                margin-bottom: 15px !important;
            }

            .chatgpt-label {
                display: block !important;
                margin-bottom: 8px !important;
                font-weight: 600 !important;
                color: #333 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }

            .chatgpt-textarea {
                width: 100% !important;
                min-height: 100px !important;
                padding: 12px !important;
                border: 2px solid #e1e5e9 !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                resize: vertical !important;
                transition: border-color 0.2s !important;
                box-sizing: border-box !important;
            }

            .chatgpt-textarea:focus {
                outline: none !important;
                border-color: #667eea !important;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            }

            .chatgpt-buttons {
                display: flex !important;
                gap: 10px !important;
                margin-top: 20px !important;
            }

            .chatgpt-btn {
                padding: 12px 24px !important;
                border: none !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                outline: none !important;
            }

            .chatgpt-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
            }

            .chatgpt-btn-primary:hover:not(:disabled) {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
            }

            .chatgpt-btn-primary:disabled {
                opacity: 0.6 !important;
                cursor: not-allowed !important;
                transform: none !important;
            }

            .chatgpt-btn-secondary {
                background: #f8f9fa !important;
                color: #6c757d !important;
                border: 2px solid #e9ecef !important;
            }

            .chatgpt-btn-secondary:hover {
                background: #e9ecef !important;
            }

            .chatgpt-response {
                margin-top: 20px !important;
                padding: 15px !important;
                background: #f8f9fa !important;
                border-left: 4px solid #667eea !important;
                border-radius: 0 8px 8px 0 !important;
                white-space: pre-wrap !important;
                line-height: 1.6 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                color: #111;
            }

            .chatgpt-loading {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                color: #667eea !important;
                font-style: italic !important;
            }

            .chatgpt-spinner {
                width: 20px !important;
                height: 20px !important;
                border: 2px solid #e9ecef !important;
                border-top: 2px solid #667eea !important;
                border-radius: 50% !important;
                animation: chatgpt-spin 1s linear infinite !important;
            }

            @keyframes chatgpt-spin {
                to { transform: rotate(360deg); }
            }

            .chatgpt-error {
                color: #dc3545 !important;
                background: #f8d7da !important;
                border-left-color: #dc3545 !important;
            }

            .chatgpt-floating-btn {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 60px !important;
                height: 60px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                border: none !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4) !important;
                z-index: 2147483647 !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: white !important;
                font-size: 24px !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
                outline: none !important;
            }

            .chatgpt-floating-btn:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6) !important;
            }

            .chatgpt-floating-btn:active {
                transform: scale(0.95) !important;
            }
        `);

        // Создаем плавающую кнопку
        function createFloatingButton() {
            // Проверяем, не создана ли уже кнопка
            if (document.getElementById('chatgpt-floating-btn')) {
                console.log('🤖 Кнопка уже существует');
                return document.getElementById('chatgpt-floating-btn');
            }

            const floatingBtn = document.createElement('button');
            floatingBtn.id = 'chatgpt-floating-btn';
            floatingBtn.className = 'chatgpt-floating-btn';
            floatingBtn.innerHTML = '🤖';
            floatingBtn.title = 'Открыть ChatGPT';

            // Добавляем кнопку к body
            document.body.appendChild(floatingBtn);
            console.log('🤖 Плавающая кнопка создана');

            return floatingBtn;
        }

        // Создаем плавающую кнопку
        const floatingBtn = createFloatingButton();

        // Создаем модальное окно
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'chatgpt-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="chatgpt-modal">
                <div class="chatgpt-modal-header">
                    <h3 class="chatgpt-modal-title">ChatGPT Assistant</h3>
                    <button class="chatgpt-modal-close">×</button>
                </div>
                <div class="chatgpt-modal-body">
                    <div class="chatgpt-input-group">
                        <label class="chatgpt-label">Ваш вопрос к ChatGPT:</label>
                        <textarea class="chatgpt-textarea" id="chatgpt-prompt" placeholder="Задайте любой вопрос..."></textarea>
                    </div>

                    <div class="chatgpt-buttons">
                        <button class="chatgpt-btn chatgpt-btn-primary" id="chatgpt-send">Отправить</button>
                        <button class="chatgpt-btn chatgpt-btn-secondary" id="chatgpt-clear">Очистить</button>
                    </div>

                    <div id="chatgpt-response-container"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // Элементы интерфейса
        const modal = modalOverlay.querySelector('.chatgpt-modal');
        const closeBtn = modalOverlay.querySelector('.chatgpt-modal-close');
        const promptTextarea = document.getElementById('chatgpt-prompt');
        const sendBtn = document.getElementById('chatgpt-send');
        const clearBtn = document.getElementById('chatgpt-clear');
        const responseContainer = document.getElementById('chatgpt-response-container');

        // Функция отправки запроса к ChatGPT
        async function sendToChatGPT(prompt) {
            showLoading();
            sendBtn.disabled = true;

            const requestData = {
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    sendBtn.disabled = false;
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            showResponse(`❌ Ошибка API: ${data.error.message}`, true);
                            return;
                        }

                        if (data.choices && data.choices[0] && data.choices[0].message) {
                            showResponse(data.choices[0].message.content);
                        } else {
                            showResponse('❌ Неожиданный формат ответа от API', true);
                        }
                    } catch (e) {
                        showResponse(`❌ Ошибка обработки ответа: ${e.message}`, true);
                    }
                },
                onerror: function() {
                    sendBtn.disabled = false;
                    showResponse('❌ Ошибка сети. Проверьте подключение к интернету.', true);
                },
                ontimeout: function() {
                    sendBtn.disabled = false;
                    showResponse('❌ Превышено время ожидания ответа', true);
                },
                timeout: 30000
            });
        }

        // Функция показа загрузки
        function showLoading() {
            responseContainer.innerHTML = `
                <div class="chatgpt-response">
                    <div class="chatgpt-loading">
                        <div class="chatgpt-spinner"></div>
                        Генерирую ответ...
                    </div>
                </div>
            `;
        }

        // Функция показа ответа
        function showResponse(text, isError = false) {
            const responseDiv = document.createElement('div');
            responseDiv.className = `chatgpt-response ${isError ? 'chatgpt-error' : ''}`;
            responseDiv.textContent = text;

            // Добавляем кнопку копирования для успешных ответов
            if (!isError) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'chatgpt-btn chatgpt-btn-secondary';
                copyBtn.textContent = '📋 Копировать';
                copyBtn.style.marginTop = '10px';
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(text).then(() => {
                        copyBtn.textContent = '✅';
                        setTimeout(() => {
                            copyBtn.textContent = '📋';
                        }, 2000);
                    });
                };
                responseDiv.appendChild(copyBtn);
            }

            responseContainer.innerHTML = '';
            responseContainer.appendChild(responseDiv);
        }

        // Функция открытия модального окна
        function openModal() {
            modalOverlay.classList.add('show');
            setTimeout(() => {
                if (promptTextarea) {
                    promptTextarea.focus();
                }
            }, 100);
        }

        // Функция закрытия модального окна
        function closeModal() {
            modalOverlay.classList.remove('show');
        }

        // Обработчики событий
        if (floatingBtn) {
            floatingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🤖 Кнопка нажата');
                openModal();
            });
        } else {
            console.error('🤖 Не удалось создать плавающую кнопку');
        }

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const prompt = promptTextarea.value.trim();
            if (!prompt) {
                alert('Введите вопрос для ChatGPT');
                return;
            }
            sendToChatGPT(prompt);
        });

        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            promptTextarea.value = '';
            responseContainer.innerHTML = '';
            promptTextarea.focus();
        });

        // Отправка по Enter (Ctrl+Enter)
        promptTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                sendBtn.click();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
                closeModal();
            }
        });

        console.log('🤖 ChatGPT Modal загружен! Ищите плавающую кнопку внизу справа.');

        // Дополнительная проверка через 2 секунды
        setTimeout(() => {
            const btn = document.getElementById('chatgpt-floating-btn');
            if (btn) {
                console.log('🤖 Кнопка найдена и работает!');
            } else {
                console.error('🤖 Кнопка не найдена! Попробуйте перезагрузить страницу.');
                // Пытаемся создать еще раз
                createFloatingButton();
            }
        }, 2000);

    } // Закрываем функцию initChatGPT
})();