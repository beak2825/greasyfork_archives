// ==UserScript==
// @name         DeepSeek Chat Продвинутый!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет продвинутые функции в DeepSeek!
// @match        https://chat.deepseek.com/*
// @author       YouTubeDrawaria, des.g_company
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat.deepseek.com
// @downloadURL https://update.greasyfork.org/scripts/545105/DeepSeek%20Chat%20%D0%9F%D1%80%D0%BE%D0%B4%D0%B2%D0%B8%D0%BD%D1%83%D1%82%D1%8B%D0%B9%21.user.js
// @updateURL https://update.greasyfork.org/scripts/545105/DeepSeek%20Chat%20%D0%9F%D1%80%D0%BE%D0%B4%D0%B2%D0%B8%D0%BD%D1%83%D1%82%D1%8B%D0%B9%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Селекторы для DeepSeek
    const SELECTORS = {
        CHAT_INPUT_TEXTAREA: 'textarea#chat-input',
        CHAT_INPUT_CONTAINER: '.dd442025._42b6996',
        RESPONSE_CONTAINER: '.ds-markdown.ds-markdown--block',
        MESSAGE_CONTENT: '.ds-markdown-paragraph',
        SEND_BUTTON: '.ds-button.ds-button--primary',
        FILE_INPUT: 'input[type="file"]',
        CHAR_COUNTER: '#deepseek-char-counter'
    };

    // Категоризированные промпты
    const ALL_CATEGORIZED_PROMPTS = {
        "Скрипты/Разработка": [
            { name: "Создать скрипт Drawaria", text: `Создай полный скрипт Tampermonkey для drawaria.online со следующим начальным шаблоном:\n // ==UserScript==\n// @name New Userscript\n// @namespace http://tampermonkey.net/\n// @version 1.0\n// @description try to take over the world!\n// @author YouTubeDrawaria\n// @match https://drawaria.online/*\n// @grant none\n// @license MIT\n// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online\n// ==/UserScript==\n\n(function() {\n    'use strict';\n\n    // Ваш код здесь...\n})();\n` },
            { name: "Продвинутый скрипт Drawaria", text: "Создай полный скрипт Tampermonkey для drawaria.online с расширенными функциями: визуальные эффекты, частицы, анимации, улучшенный интерфейс и особые возможности. Не используй заглушки и внешние файлы." },
            { name: "Улучшить скрипт Drawaria", text: `Улучшай, обновляй, максимизируй, удивляй, создавай реализм и высокий уровень детализации в скрипте для drawaria.online. Хочу элементы X на экране, музыку, эффекты, частицы, блики и хорошо анимированный, детализированный интерфейс со всем. Не используй заглушки, .mp3 и data:image/png;base64. Графику нужно создавать самому, без заменяемых файлов.` },
            { name: "Атрибуты игры", text: `Дай мне атрибуты игры. Включи: иконку игры (<link rel="icon" href="https://drawaria.online/avatar/cache/ab53c430-1b2c-11f0-af95-072f6d4ed084.1749767757401.jpg" type="image/x-icon">) и фоновую музыку с автоматическим воспроизведением при клике: (<audio id="bg-music" src="https://www.myinstants.com/media/sounds/super-mini-juegos-2.mp3" loop></audio><script>const music = document.getElementById('bg-music'); document.body.addEventListener('click', () => { if (music.paused) { music.play(); } });</script>).` },
            { name: "API для Cubic Engine", text: `Предоставь информацию о популярных API, которые не размещены на Vercel, не имеют проблем с CORS при использовании в браузерах/консоли, быстро интегрируются в Cubic Engine / Drawaria, бесплатны и доступны для немедленного использования.` },
            { name: "Интегрировать функцию в Cubic Engine", text: `Для интеграции нового дополнения в модуль Cubic Engine мне нужен полный код обновлённой функции. Это включает кнопку со всеми её свойствами, активаторы с их ID, слушатели этого события и файлы, которые её запускают. Приведи только обновлённый код функции, не весь исходный код Cubic Engine с нуля.` },
            { name: "Скрипт Tampermonkey", text: `Создай полноценный скрипт tampermonkey с продвинутыми функциями. Не используй заглушки или внешние файлы.` },
            { name: "Интеграция API", text: `Предоставь информацию о бесплатных API, которые можно быстро интегрировать без проблем с CORS.` }
        ]
    };

    let featuresInitialized = false;
    let draggableMenu = null; // Глобальная ссылка для перетаскиваемого меню

    /**
     * Создает кнопку в стиле DeepSeek
     */
    function createButton(text, onClick, styles = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'ds-button ds-button--primary ds-button--filled ds-button--rect ds-button--m';
        button.style.cssText = `
            background: linear-gradient(135deg, #1B73FF 0%, #0C5ADB 100%);
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin: 0;
            transition: all 0.3s ease;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(27, 115, 255, 0.2);
            ${Object.entries(styles).map(([key, value]) => `${key}:${value};`).join('')}
        `;
        button.onmouseover = () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 12px rgba(27, 115, 255, 0.3)';
            button.style.background = 'linear-gradient(135deg, #2B7EFF 0%, #1C64E5 100%)';
        };
        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 8px rgba(27, 115, 255, 0.2)';
            button.style.background = 'linear-gradient(135deg, #1B73FF 0%, #0C5ADB 100%)';
        };
        button.onclick = onClick;
        return button;
    }

    /**
     * Создает категоризированный выпадающий список
     */
    function createCategorizedDropdown(categorizedOptions, onSelect, placeholder = "Выбрать Промпт") {
        const select = document.createElement('select');
        select.style.cssText = `
            background: linear-gradient(135deg, #1B73FF 0%, #0C5ADB 100%);
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin: 0;
            min-width: 100%;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(27, 115, 255, 0.2);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Cpolygon%20points%3D%22208%2C80%20128%2C160%2048%2C80%22%20fill%3D%22%23ffffff%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 16px;
        `;

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = placeholder;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        for (const category in categorizedOptions) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            optgroup.style.cssText = 'background: #1a1a1a; color: white;';
            categorizedOptions[category].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.text;
                option.textContent = opt.name;
                option.style.cssText = 'background: #1a1a1a; color: white; padding: 4px;';
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }

        select.onchange = (event) => {
            if (event.target.value) {
                onSelect(event.target.value);
                event.target.value = "";
                defaultOption.selected = true;
            }
        };

        select.onmouseover = () => {
            select.style.transform = 'translateY(-1px)';
            select.style.boxShadow = '0 4px 12px rgba(27, 115, 255, 0.3)';
        };

        select.onmouseout = () => {
            select.style.transform = 'translateY(0)';
            select.style.boxShadow = '0 2px 8px rgba(27, 115, 255, 0.2)';
        };

        return select;
    }

    /**
     * Создает и показывает модальное окно
     */
    function showModal(title, contentHtml) {
        const existingModal = document.getElementById('deepseek-custom-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'deepseek-custom-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #0F0F0F 0%, #1a1a1a 100%);
            color: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            max-width: 80%;
            max-height: 80%;
            overflow-y: auto;
            position: relative;
            border: 1px solid #333;
        `;

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        modalTitle.style.cssText = `
            margin-top: 0;
            margin-bottom: 20px;
            color: #1B73FF;
            font-size: 1.4em;
            text-align: center;
            font-weight: 600;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: #ccc;
            font-size: 1.5em;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        closeButton.onmouseover = () => {
            closeButton.style.backgroundColor = '#333';
            closeButton.style.color = 'white';
        };
        closeButton.onmouseout = () => {
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = '#ccc';
        };
        closeButton.onclick = () => modalOverlay.remove();

        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalTitle);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = contentHtml;
        modalContent.appendChild(contentDiv);

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    /**
     * Устанавливает значение textarea так, чтобы React его распознал
     */
    function setNativeValue(element, value) {
        const lastValue = element.value;
        element.value = value;
        const event = new Event('input', { bubbles: true });
        event.simulated = true;
        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);

        // Также отправляем события изменений для DeepSeek
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
    }

    /**
     * Получает текущее содержимое чата
     */
    function getCurrentChatContent() {
        const responses = document.querySelectorAll(SELECTORS.MESSAGE_CONTENT);
        let chatContent = [];

        responses.forEach((response, index) => {
            const messageText = response.textContent.trim();
            if (messageText) {
                chatContent.push({
                    type: 'DeepSeek',
                    text: messageText,
                    timestamp: new Date().toISOString(),
                    index: index
                });
            }
        });

        return chatContent;
    }

    /**
     * Сохраняет текущий диалог
     */
    function saveCurrentChat() {
        const chatContent = getCurrentChatContent();
        if (chatContent.length === 0) {
            alert('Нет диалога для сохранения.');
            return;
        }

        const chatName = prompt("Введите название для этого диалога:", `DeepSeek Чат ${new Date().toLocaleString()}`);
        if (chatName) {
            try {
                const savedChats = JSON.parse(localStorage.getItem('deepseek_chat_conversations') || '[]');
                savedChats.push({
                    name: chatName,
                    timestamp: new Date().toISOString(),
                    messages: chatContent,
                    url: window.location.href
                });
                localStorage.setItem('deepseek_chat_conversations', JSON.stringify(savedChats));
                alert(`Диалог "${chatName}" успешно сохранен.`);
            } catch (e) {
                console.error("Ошибка при сохранении диалога:", e);
                alert("Ошибка при сохранении диалога.");
            }
        }
    }

    /**
     * Загружает сохраненные диалоги
     */
    function loadSavedChats() {
        const savedChats = JSON.parse(localStorage.getItem('deepseek_chat_conversations') || '[]');
        if (savedChats.length === 0) {
            alert('Нет сохраненных диалогов.');
            return;
        }

        let chatListHtml = '<div style="max-height: 400px; overflow-y: auto;">';
        savedChats.forEach((chat, index) => {
            chatListHtml += `
                <div style="margin-bottom: 15px; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 15px; border-radius: 12px; border: 1px solid #333;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 1.1em; font-weight: 600; color: #1B73FF; margin-bottom: 4px;">${chat.name}</div>
                            <div style="font-size: 0.9em; color: #aaa;">${new Date(chat.timestamp).toLocaleString()}</div>
                            <div style="font-size: 0.8em; color: #888;">${chat.messages.length} ответов</div>
                        </div>
                        <div>
                            <button class="view-chat-btn" data-index="${index}" style="background: #1B73FF; color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; margin-right: 8px; font-size: 12px;">Просмотр</button>
                            <button class="delete-chat-btn" data-index="${index}" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 12px;">Удалить</button>
                        </div>
                    </div>
                </div>
            `;
        });
        chatListHtml += '</div>';

        showModal('Сохраненные Диалоги', chatListHtml);

        // Обработчики событий для кнопок
        document.querySelectorAll('.view-chat-btn').forEach(button => {
            button.onclick = (e) => {
                const index = e.target.dataset.index;
                const chatToView = savedChats[index];
                let chatViewHtml = '<div style="background: #0F0F0F; padding: 15px; border-radius: 12px; max-height: 400px; overflow-y: auto; border: 1px solid #333;">';
                chatToView.messages.forEach((msg, msgIndex) => {
                    chatViewHtml += `
                        <div style="margin-bottom: 15px; padding: 12px; background: #1a1a1a; border-radius: 12px; border-left: 4px solid #1B73FF;">
                            <div style="color: #1B73FF; font-weight: 600; margin-bottom: 8px;">Ответ ${msgIndex + 1}:</div>
                            <div style="color: #e0e0e0; line-height: 1.5;">${msg.text}</div>
                        </div>
                    `;
                });
                chatViewHtml += '</div>';
                showModal(`Просмотр Диалога: ${chatToView.name}`, chatViewHtml);
            };
        });

        document.querySelectorAll('.delete-chat-btn').forEach(button => {
            button.onclick = (e) => {
                const indexToDelete = parseInt(e.target.dataset.index);
                if (confirm(`Вы уверены, что хотите удалить диалог "${savedChats[indexToDelete].name}"?`)) {
                    savedChats.splice(indexToDelete, 1);
                    localStorage.setItem('deepseek_chat_conversations', JSON.stringify(savedChats));
                    alert('Диалог удален.');
                    document.getElementById('deepseek-custom-modal-overlay')?.remove();
                    loadSavedChats();
                }
            };
        });
    }

    /**
     * Экспортирует диалог в текстовый файл
     */
    function exportChatToText() {
        const chatContent = getCurrentChatContent();
        if (chatContent.length === 0) {
            alert('Нет диалога для экспорта.');
            return;
        }

        let exportText = `--- Диалог DeepSeek Chat (${new Date().toLocaleString()}) ---\n\n`;
        chatContent.forEach((msg, index) => {
            exportText += `Ответ ${index + 1}:\n${msg.text}\n\n`;
        });
        exportText += `--- Конец Диалога ---\n`;

        const blob = new Blob([exportText], { type: 'text/plain; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deepseek_chat_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Диалог экспортирован в текстовый файл.');
    }

    /**
     * Вставляет промпт в textarea
     */
    function handlePromptSelection(promptText) {
        const inputTextArea = document.querySelector(SELECTORS.CHAT_INPUT_TEXTAREA);
        if (inputTextArea) {
            setNativeValue(inputTextArea, promptText);
            inputTextArea.focus();
        }
    }

    /**
     * Динамически загружает библиотеки для OCR и обработки файлов
     */
    function loadTesseractJs() {
        return new Promise((resolve, reject) => {
            if (window.Tesseract) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function loadPdfJs() {
        return new Promise((resolve, reject) => {
            if (window.pdfjsLib) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js";
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function loadMammothJs() {
        return new Promise((resolve, reject) => {
            if (window.mammoth) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = "https://unpkg.com/mammoth/mammoth.browser.min.js";
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Обрабатывает импортированные файлы
     */
    async function processDroppedFiles(files) {
        const inputTextArea = document.querySelector(SELECTORS.CHAT_INPUT_TEXTAREA);
        if (!inputTextArea) return;

        let allContent = '';
        for (const file of files) {
            const extension = file.name.split('.').pop().toLowerCase();
            try {
                if (['txt', 'md', 'html', 'css', 'js', 'json'].includes(extension)) {
                    const content = await readFileAsText(file);
                    allContent += `\n\n--- Содержимое ${file.name} ---\n${content}`;
                } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {
                    await loadTesseractJs();
                    const originalText = document.getElementById('deepseek-main-draggable-menu').querySelector('#deepseek-menu-header').textContent;
                    document.getElementById('deepseek-main-draggable-menu').querySelector('#deepseek-menu-header').textContent = 'DeepSeek Продвинутое Меню (Обработка OCR...)';
                    const { data: { text } } = await Tesseract.recognize(file, 'rus+eng');
                    allContent += `\n\n--- OCR из ${file.name} ---\n${text.trim()}`;
                    document.getElementById('deepseek-main-draggable-menu').querySelector('#deepseek-menu-header').textContent = originalText;
                } else if (extension === 'pdf') {
                    await loadPdfJs();
                    const text = await extractTextFromPdf(file);
                    allContent += `\n\n--- Содержимое PDF ${file.name} ---\n${text}`;
                } else if (extension === 'docx') {
                    await loadMammothJs();
                    const text = await extractTextFromDocx(file);
                    allContent += `\n\n--- Содержимое Word ${file.name} ---\n${text}`;
                } else {
                    alert(`Неподдерживаемый тип файла: ${file.name}`);
                    continue;
                }
            } catch (error) {
                console.error(`Ошибка при обработке ${file.name}:`, error);
                alert(`Ошибка при обработке ${file.name}: ${error.message}`);
            }
        }

        if (allContent) {
            const currentValue = inputTextArea.value;
            setNativeValue(inputTextArea, currentValue + allContent);
        }
    }

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    async function extractTextFromPdf(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const loadingTask = window.pdfjsLib.getDocument({ data: typedarray });
                    const pdf = await loadingTask.promise;
                    let text = '';
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const content = await page.getTextContent();
                        text += content.items.map(item => item.str).join(' ') + '\n';
                    }
                    resolve(text);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async function extractTextFromDocx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                    resolve(result.value.trim());
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Добавляет счетчик символов
     */
    function addCharCounter() {
        const inputTextArea = document.querySelector(SELECTORS.CHAT_INPUT_TEXTAREA);
        const inputContainer = document.querySelector(SELECTORS.CHAT_INPUT_CONTAINER);

        if (!inputTextArea || !inputContainer) return;

        // Проверяем, если уже существует
        if (document.querySelector(SELECTORS.CHAR_COUNTER)) return;

        const counter = document.createElement('div');
        counter.id = 'deepseek-char-counter';
        counter.style.cssText = `
            position: absolute;
            bottom: 8px;
            right: 12px;
            font-size: 11px;
            color: #1B73FF;
            background: rgba(27, 115, 255, 0.1);
            padding: 4px 8px;
            border-radius: 8px;
            z-index: 10;
            pointer-events: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid rgba(27, 115, 255, 0.2);
            font-weight: 500;
        `;

        const updateCounter = () => {
            const count = inputTextArea.value.length;
            counter.textContent = `${count} симв.`;
        };

        inputTextArea.addEventListener('input', updateCounter);
        updateCounter();

        inputContainer.style.position = 'relative';
        inputContainer.appendChild(counter);
    }

    /**
     * Настраивает функцию редактирования и повторной отправки сообщений
     */
    function setupEditAndResend() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const responses = node.querySelectorAll ? node.querySelectorAll(SELECTORS.MESSAGE_CONTENT) : [];
                            responses.forEach(addEditFunctionality);
                            if (node.matches && node.matches(SELECTORS.MESSAGE_CONTENT)) {
                                addEditFunctionality(node);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Добавить к существующим элементам
        document.querySelectorAll(SELECTORS.MESSAGE_CONTENT).forEach(addEditFunctionality);
    }

    function addEditFunctionality(element) {
        if (element.dataset.editEnabled) return;
        element.dataset.editEnabled = 'true';

        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.3s ease';
        element.title = 'Нажмите, чтобы использовать этот ответ как промпт';

        element.addEventListener('click', () => {
            const text = element.textContent.trim();
            if (text) {
                const textarea = document.querySelector(SELECTORS.CHAT_INPUT_TEXTAREA);
                if (textarea) {
                    setNativeValue(textarea, text);
                    textarea.focus();
                    element.style.background = 'rgba(27, 115, 255, 0.1)';
                    element.style.borderRadius = '12px';
                    element.style.padding = '8px';
                    setTimeout(() => {
                        element.style.background = '';
                        element.style.borderRadius = '';
                        element.style.padding = '';
                    }, 1000);
                }
            }
        });

        element.addEventListener('mouseenter', () => {
            element.style.background = 'rgba(27, 115, 255, 0.05)';
            element.style.borderRadius = '12px';
            element.style.padding = '8px';
        });

        element.addEventListener('mouseleave', () => {
            if (!element.style.background.includes('0.1')) {
                element.style.background = '';
                element.style.borderRadius = '';
                element.style.padding = '';
            }
        });
    }

    /**
     * Создает главное перетаскиваемое меню
     */
    function createDraggableMainMenu() {
        if (draggableMenu) return draggableMenu;

        draggableMenu = document.createElement('div');
        draggableMenu.id = 'deepseek-main-draggable-menu';
        draggableMenu.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #0F0F0F 0%, #1a1a1a 100%);
            border: 1px solid #333;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            z-index: 10001;
            width: auto;
            max-width: 320px;
            min-width: 220px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            resize: both;
            min-height: 120px;
            backdrop-filter: blur(12px);
        `;

        const menuHeader = document.createElement('div');
        menuHeader.id = 'deepseek-menu-header';
        menuHeader.style.cssText = `
            background: linear-gradient(135deg, #1B73FF 0%, #0C5ADB 100%);
            color: white;
            padding: 12px 16px;
            cursor: grab;
            border-top-left-radius: 14px;
            border-top-right-radius: 14px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        `;
        menuHeader.textContent = 'DeepSeek Продвинутое Меню';

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            line-height: 1;
            padding: 0 5px;
            transition: color 0.2s;
        `;
        closeButton.onmouseover = () => closeButton.style.color = '#eee';
        closeButton.onmouseout = () => closeButton.style.color = 'white';
        closeButton.onclick = () => draggableMenu.style.display = 'none';

        menuHeader.appendChild(closeButton);
        draggableMenu.appendChild(menuHeader);

        const menuContent = document.createElement('div');
        menuContent.id = 'deepseek-menu-content';
        menuContent.style.cssText = `
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
        `;
        draggableMenu.appendChild(menuContent);
        document.body.appendChild(draggableMenu);

        // Функция перетаскивания
        let isDragging = false;
        let offsetX, offsetY;

        menuHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - draggableMenu.getBoundingClientRect().left;
            offsetY = e.clientY - draggableMenu.getBoundingClientRect().top;
            menuHeader.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            draggableMenu.style.left = (e.clientX - offsetX) + 'px';
            draggableMenu.style.top = (e.clientY - offsetY) + 'px';
            draggableMenu.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            menuHeader.style.cursor = 'grab';
            document.body.style.userSelect = '';
        });

        return draggableMenu;
    }

    /**
     * Создает плавающую кнопку для переключения главного меню
     */
    function createToggleMenuButton() {
        const existingToggleButton = document.getElementById('deepseek-toggle-menu-button');
        if (existingToggleButton) return;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'deepseek-toggle-menu-button';
        toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v6h4"/>
            <path d="M12 8V4H8"/>
            <path d="M22 13a8 8 0 0 1-8 8H6a2 2 0 0 0-2 2v-4a2 2 0 0 0-2-2 8 8 0 0 1 8-8h2a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H6C2.686 0 0 2.686 0 6v6c0 3.314 2.686 6 6 6h8c4.418 0 8-3.582 8-8z"/>
        </svg>`;
        toggleButton.title = "Переключить DeepSeek Продвинутое Меню";
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1B73FF 0%, #0C5ADB 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(27, 115, 255, 0.3);
            z-index: 10002;
            transition: all 0.3s ease;
        `;
        toggleButton.onmouseover = () => {
            toggleButton.style.transform = 'scale(1.05)';
            toggleButton.style.boxShadow = '0 6px 20px rgba(27, 115, 255, 0.4)';
        };
        toggleButton.onmouseout = () => {
            toggleButton.style.transform = 'scale(1)';
            toggleButton.style.boxShadow = '0 4px 15px rgba(27, 115, 255, 0.3)';
        };
        toggleButton.onclick = () => {
            if (draggableMenu) {
                draggableMenu.style.display = draggableMenu.style.display === 'none' ? 'flex' : 'none';
            }
        };
        document.body.appendChild(toggleButton);
    }

    /**
     * Инициализирует все функции
     */
    function initializeFeatures() {
        if (featuresInitialized) return;

        const chatInputTextArea = document.querySelector(SELECTORS.CHAT_INPUT_TEXTAREA);
        if (!chatInputTextArea) {
            return;
        }

        featuresInitialized = true;

        const menu = createDraggableMainMenu();
        const menuContent = document.getElementById('deepseek-menu-content');

        // Создать элементы меню
        const promptsDropdown = createCategorizedDropdown(ALL_CATEGORIZED_PROMPTS, handlePromptSelection, "🚀 Выбрать Промпт");
        const saveButton = createButton('💾 Сохранить Диалог', saveCurrentChat, {width: '100%'});
        const loadButton = createButton('📂 Загрузить Диалоги', loadSavedChats, {width: '100%'});
        const exportButton = createButton('📤 Экспорт (TXT)', exportChatToText, {width: '100%'});

        // Скрытый input для файлов
        const fileInputForMenu = document.createElement('input');
        fileInputForMenu.type = 'file';
        fileInputForMenu.multiple = true;
        fileInputForMenu.accept = '.txt,.md,.html,.css,.js,.json,.png,.jpg,.jpeg,.gif,.bmp,.webp,.pdf,.docx';
        fileInputForMenu.style.display = 'none';

        const importButtonInMenu = createButton('📁 Импорт Файлов (OCR)', () => fileInputForMenu.click(), {
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            fontSize: '14px',
            width: '100%',
            marginBottom: '10px'
        });

        // События drag and drop для импорта
        importButtonInMenu.addEventListener('dragover', (e) => {
            e.preventDefault();
            importButtonInMenu.style.background = 'linear-gradient(135deg, #34D399 0%, #10B981 100%)';
            importButtonInMenu.style.boxShadow = '0 6px 12px rgba(16, 185, 129, 0.3)';
        });

        importButtonInMenu.addEventListener('dragleave', () => {
            importButtonInMenu.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            importButtonInMenu.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
        });

        importButtonInMenu.addEventListener('drop', (e) => {
            e.preventDefault();
            importButtonInMenu.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            importButtonInMenu.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
            if (e.dataTransfer.files.length > 0) {
                processDroppedFiles(e.dataTransfer.files);
            }
        });

        fileInputForMenu.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processDroppedFiles(e.target.files);
                e.target.value = '';
            }
        });

        document.body.appendChild(fileInputForMenu);

        // Добавить элементы в меню
        menuContent.appendChild(promptsDropdown);
        menuContent.appendChild(importButtonInMenu);
        menuContent.appendChild(saveButton);
        menuContent.appendChild(loadButton);
        menuContent.appendChild(exportButton);

        // Создать кнопку переключения
        createToggleMenuButton();

        // Инициализировать другие функции
        addCharCounter();
        setupEditAndResend();

        console.log('DeepSeek Chat Продвинутый: Все функции инициализированы.');
    }

    // Наблюдатель для ожидания загрузки интерфейса
    const observer = new MutationObserver((mutations, obs) => {
        if (!featuresInitialized && document.querySelector(SELECTORS.CHAT_INPUT_TEXTAREA)) {
            initializeFeatures();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Попытаться инициализировать немедленно, если уже загружено
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeFeatures, 1000);
    }
})();
