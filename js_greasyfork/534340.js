// ==UserScript==
// @name         Black Russia  Helper
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  [v6.2] UI Оптимизация. Глобальные стили (Шрифт, B/I/U). Больше BBCode. Авто-ник/дата, Категории, сортировка, счетчик, выбор формата даты. Опция авто-отправки. Темный UI. Кнопка помощи.
// @author       Maras Rofls
// @match        *://forum.blackrussia.online/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534340/Black%20Russia%20%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/534340/Black%20Russia%20%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CURRENT_VERSION = '6.2';
    const DATA_KEY = `blackrussia_signatures_helper_v${CURRENT_VERSION}`;
    const PREVIOUS_DATA_KEY = 'blackrussia_signatures_helper_v6.1';
    const DEFAULT_SEPARATOR = '\n\n---\n';
    const DEFAULT_DATETIME_PRESET = 'DD.MM.YYYY HH:mm';
    const MAX_EDITOR_FIND_ATTEMPTS = 20;
    const EDITOR_FIND_INTERVAL = 500; // ms
    const AUTO_SEND_DELAY = 350; // ms

    const DATETIME_PRESETS = {
        'DD.MM.YYYY HH:mm': { dateStyle: 'short', timeStyle: 'short', hour12: false },
        'DD.MM.YY HH:mm': { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false },
        'D MMMMற்றுப்ரம் г., HH:mm': { dateStyle: 'long', timeStyle: 'short', hour12: false },
        'YYYY-MM-DD HH:mm': { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23' },
        'HH:mm DD.MM.YYYY': { timeStyle: 'short', dateStyle: 'short', hour12: false },
    };

     const FONT_LIST = ['По умолчанию', 'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Courier New', 'Comic Sans MS', 'Impact'];

    const defaultData = {
        signatures: [],
        settings: {
            separator: DEFAULT_SEPARATOR,
            dateTimePreset: DEFAULT_DATETIME_PRESET,
            autoSendAfterInsert: false,
            lastSelectedSignatureIndex: -1,
        }
    };

    let appData = JSON.parse(JSON.stringify(defaultData));
    let editorElement = null;
    let mainUiContainer = null;
    let selectSignatureElement = null;
    let insertSignatureButton = null;
    let randomSignatureButton = null;
    let currentUsername = null;

    let modalElement = null;
    let modalListElement = null;
    let modalCategoryFilter = null;
    let modalSortSelect = null;
    let modalFormElement = null;
    let modalNameInput = null;
    let modalContentInput = null;
    let modalCategoryInput = null;
    let modalSaveButton = null;
    let modalSaveAndNewButton = null;
    let modalCancelButton = null;
    let modalSettingsSeparatorInput = null;
    let modalSettingsDateTimeSelect = null;
    let modalSettingsAutoSendCheckbox = null;
    let editingIndex = null;

    let currentSortType = 'name_asc';
    let currentFilterCategory = 'all';

    function loadData() {
        const storedData = GM_getValue(DATA_KEY, null);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const mergedSettings = { ...defaultData.settings, ...(parsedData.settings || {}) };
                appData.signatures = Array.isArray(parsedData.signatures) ? parsedData.signatures : defaultData.signatures;
                appData.settings = mergedSettings;
                 appData.signatures = appData.signatures.filter(isValidSignature).map(migrateSignatureData);
                 if (!DATETIME_PRESETS[appData.settings.dateTimePreset]) {
                     appData.settings.dateTimePreset = DEFAULT_DATETIME_PRESET;
                 }
            } catch (e) {
                console.error(`Signature Helper: Ошибка парсинга данных v${CURRENT_VERSION}. Используются стандартные.`, e);
                appData = JSON.parse(JSON.stringify(defaultData));
                alert(`Не удалось загрузить сохраненные данные Помощника Подписей v${CURRENT_VERSION}. Используются настройки по умолчанию.`);
            }
        } else {
            const previousData = GM_getValue(PREVIOUS_DATA_KEY, null);
            if (previousData) {
                console.log(`Signature Helper: Миграция данных из ${PREVIOUS_DATA_KEY}...`);
                try {
                    const parsedPreviousData = JSON.parse(previousData);
                     const migratedSettings = { ...defaultData.settings, ...(parsedPreviousData.settings || {}) };
                     appData.signatures = Array.isArray(parsedPreviousData.signatures) ? parsedPreviousData.signatures : defaultData.signatures;
                     appData.settings = migratedSettings;
                     appData.signatures = appData.signatures.filter(isValidSignature).map(migrateSignatureData);
                     if (!DATETIME_PRESETS[appData.settings.dateTimePreset]) {
                         appData.settings.dateTimePreset = DEFAULT_DATETIME_PRESET;
                     }
                    console.log(`Signature Helper: Данные ${PREVIOUS_DATA_KEY} успешно перенесены в v${CURRENT_VERSION}.`);
                    saveData();
                } catch (e) {
                    console.error(`Signature Helper: Ошибка миграции данных из ${PREVIOUS_DATA_KEY}. Используются стандартные.`, e);
                    appData = JSON.parse(JSON.stringify(defaultData));
                }
            } else {
                console.log('Signature Helper: Сохраненные данные не найдены, используются стандартные.');
                appData = JSON.parse(JSON.stringify(defaultData));
            }
        }
         appData.signatures = appData.signatures.filter(isValidSignature).map(migrateSignatureData);
    }

    function migrateSignatureData(signature) {
        return {
            name: signature.name || 'Без имени',
            content: signature.content || '',
            usageCount: signature.usageCount || 0,
            category: signature.category || '',
            dateAdded: signature.dateAdded || Date.now(),
            lastUsed: signature.lastUsed || null,
        };
    }

    function saveData() {
        try {
            const dataToSave = {
                signatures: appData.signatures,
                settings: appData.settings
            };
            GM_setValue(DATA_KEY, JSON.stringify(dataToSave));
        } catch (e) {
            console.error('Signature Helper: Ошибка сохранения данных.', e);
            alert('Ошибка сохранения данных Помощника Подписей!');
        }
        updateMainUIState();
        populateSignatureSelect();
    }

    function isValidSignature(item) {
        return typeof item === 'object' && item !== null && typeof item.name === 'string' && typeof item.content === 'string';
    }

    function getUsername() {
        if (currentUsername === null) {
            const userLink = document.querySelector('.p-navgroup-link--user .p-navgroup-linkText');
            if (userLink) currentUsername = userLink.textContent.trim();
            else {
                const avatar = document.querySelector('.p-navgroup-link--user .avatar');
                if (avatar) currentUsername = avatar.getAttribute('alt')?.trim() || '';
            }
            if (!currentUsername) currentUsername = 'Пользователь';
        }
        return currentUsername;
    }

    function getCurrentDateTime(formatPreset = null) {
        const presetKey = formatPreset || appData.settings.dateTimePreset;
        const options = DATETIME_PRESETS[presetKey] || DATETIME_PRESETS[DEFAULT_DATETIME_PRESET];
        const now = new Date();
        let formattedString = '';
        try {
            // Try formatting using Intl first (more reliable for different presets)
            if (presetKey === 'YYYY-MM-DD HH:mm') {
                 // Intl doesn't easily support this exact format with space separator AND 24h cycle consistently
                 const year = now.getFullYear();
                 const month = (now.getMonth() + 1).toString().padStart(2, '0');
                 const day = now.getDate().toString().padStart(2, '0');
                 const hours = now.getHours().toString().padStart(2, '0');
                 const minutes = now.getMinutes().toString().padStart(2, '0');
                 formattedString = `${year}-${month}-${day} ${hours}:${minutes}`;
            } else if (presetKey === 'HH:mm DD.MM.YYYY') {
                 const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
                 const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
                 formattedString = `${timeFormatter.format(now)} ${dateFormatter.format(now)}`;
            } else {
                // Use Intl for other standard formats
                const formatter = new Intl.DateTimeFormat('ru-RU', options);
                formattedString = formatter.format(now);
            }
        } catch (e) {
            console.error(`Signature Helper: Ошибка форматирования даты для пресета ${presetKey}`, e);
            // Fallback to manual formatting if Intl fails
            const d = now;
            formattedString = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        }
        return formattedString;
    }


     function addSignature(name, content, category) {
        if (!name?.trim() || !content) {
            alert('Название и содержание подписи не могут быть пустыми.');
            return false;
        }
        const newSignature = migrateSignatureData({
             name: name.trim(),
             content: content,
             category: category?.trim() || '',
         });
        appData.signatures.push(newSignature);
        return true;
    }

    function updateSignature(index, name, content, category) {
        if (index < 0 || index >= appData.signatures.length) return false;
        if (!name?.trim() || !content) {
            alert('Название и содержание подписи не могут быть пустыми.');
            return false;
        }
        const oldSignature = appData.signatures[index];
        appData.signatures[index] = {
            ...oldSignature,
            name: name.trim(),
            content: content,
            category: category?.trim() || '',
        };
        return true;
    }

    function deleteSignature(index) {
        if (index < 0 || index >= appData.signatures.length) return;
        setTimeout(() => {
            const sigName = appData.signatures[index]?.name || 'Без имени';
            if (confirm(`Вы уверены, что хотите удалить подпись "${sigName}"?`)) {
                appData.signatures.splice(index, 1);
                saveData();
                renderModalList();
                populateSignatureSelect();
            }
        }, 0);
    }

     function duplicateSignature(index) {
        if (index < 0 || index >= appData.signatures.length) return;
        const originalSig = appData.signatures[index];
        const newName = `${originalSig.name} (Копия)`;
        modalNameInput.value = newName;
        modalContentInput.value = originalSig.content;
        modalCategoryInput.value = originalSig.category;
        showModalForm(null);
        modalNameInput.focus();
        modalNameInput.select();
     }

    function findEditorElement() {
        let editor = document.querySelector('.fr-element.fr-view');
        if (editor && editor.isContentEditable) return editor;
        editor = document.querySelector('textarea[name="message"], textarea.input--labelled-textArea, textarea#message');
        return editor;
    }

    function handleInsertion(signatureIndex) {
        if (signatureIndex < 0 || signatureIndex >= appData.signatures.length) return false;

        const signature = appData.signatures[signatureIndex];
        if (!editorElement) {
            editorElement = findEditorElement();
            if (!editorElement) {
                console.warn('Helper: Редактор не найден.');
                alert('Не удалось найти поле редактора для вставки.');
                return false;
            }
        }

        const username = getUsername();
        const dateTime = getCurrentDateTime();
        const userInfoText = `${username} | ${dateTime}`;
        const userSeparatorText = appData.settings.separator.replace(/<br\s*\/?>/gi, '\n'); // Allow <br> or <br/>
        const userSeparatorHtml = appData.settings.separator.replace(/\n/g, '<br>');
        const finalContentText = `${signature.content}${userSeparatorText}${userInfoText}`;
        // Ensure BBCode line breaks are converted for HTML view, but keep existing <br>
        const finalContentHtml = signature.content.replace(/(?<!<br\s*\/?>)\n/g, '<br>') + userSeparatorHtml + userInfoText;


        const previewText = `--- Предпросмотр Подписи ---\n\n${finalContentText}\n\n---------------------------\n\nВставить?`;

        if (!confirm(previewText)) return false;

        let insertSuccess = false;
        try {
            const isTextArea = editorElement.tagName === 'TEXTAREA';
            const isContentEditable = editorElement.isContentEditable;

            if (isTextArea) {
                insertIntoTextarea(finalContentText);
            } else if (isContentEditable) {
                insertIntoContentEditable(finalContentHtml);
            } else {
                throw new Error('Найденный редактор не поддерживается.');
            }
            insertSuccess = true;
        } catch (e) {
            console.error("Signature Helper: Ошибка вставки подписи:", e);
            alert(`Ошибка вставки подписи: ${e.message}`);
            return false;
        }

        signature.usageCount = (signature.usageCount || 0) + 1;
        signature.lastUsed = Date.now();
        appData.settings.lastSelectedSignatureIndex = signatureIndex;
        saveData();

        if (modalElement && modalElement.style.display !== 'none') {
            renderModalList();
        }

        return true;
    }

    function insertIntoTextarea(textToInsert) {
        const currentEditorText = editorElement.value.trim();
        const initialSeparator = currentEditorText.length > 0 ? '\n\n' : '';
        const start = editorElement.selectionStart;
        const end = editorElement.selectionEnd;
        const before = editorElement.value.substring(0, start);
        const after = editorElement.value.substring(end);

        editorElement.value = before + initialSeparator + textToInsert + after;
        editorElement.focus();
        const newCursorPos = start + initialSeparator.length + textToInsert.length;
        editorElement.setSelectionRange(newCursorPos, newCursorPos);
        editorElement.scrollTop = editorElement.scrollHeight; // Scroll to bottom after insert
        // Trigger input event for frameworks that might listen for it
        editorElement.dispatchEvent(new Event('input', { bubbles: true }));
    }


    function insertIntoContentEditable(htmlToInsert) {
         editorElement.focus();
         setTimeout(() => {
             try {
                 // Check if editor already ends with paragraphs/breaks and avoid adding extra ones
                 const currentEditorHTML = editorElement.innerHTML.trim();
                 const endsWithBreak = /<(p|div|br)[\s>]/i.test(currentEditorHTML.slice(-20)); // Simple check if it ends likely with a block/break
                 const initialSeparator = currentEditorHTML.length > 0 && !endsWithBreak ? '<br><br>' : '';

                 document.execCommand('insertHTML', false, initialSeparator + htmlToInsert);
             } catch (e) {
                 console.error("Helper: Ошибка execCommand('insertHTML'):", e);
                 // Fallback attempt (less reliable with cursor position)
                 try {
                     const currentEditorHTML = editorElement.innerHTML.trim();
                      const endsWithBreak = /<(p|div|br)[\s>]/i.test(currentEditorHTML.slice(-20));
                      const initialSeparator = currentEditorHTML.length > 0 && !endsWithBreak ? '<br><br>' : '';
                     // Append at the end as a last resort
                     editorElement.innerHTML += initialSeparator + htmlToInsert;
                 } catch (fallbackError) {
                      console.error("Helper: Резервная вставка не удалась:", fallbackError);
                      throw new Error('Не удалось вставить контент.');
                 }
             }
             // Ensure visibility after insertion
             editorElement.scrollTop = editorElement.scrollHeight;
         }, 50); // Timeout helps ensure focus is set before execCommand
    }


     function triggerAutoSend() {
        if (!appData.settings.autoSendAfterInsert || !editorElement) return;
        setTimeout(() => {
            const form = editorElement.closest('form');
            if (!form) {
                console.warn('Signature Helper: Auto-send failed, could not find parent form.');
                return;
            }
            let submitButton = form.querySelector('button[type="submit"].button--primary, button.button--cta[type="submit"]'); // More specific selectors first
            if (!submitButton) submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) submitButton = form.querySelector('input[type="submit"]');
             if (!submitButton) {
                 // Try common button texts in Russian and English
                 const possibleTexts = ['Отправить', 'Ответить', 'Создать тему', 'Сохранить', 'Save', 'Reply', 'Submit', 'Post reply'];
                 const buttons = form.querySelectorAll('button, input[type="button"], input[type="submit"]');
                 for(const btn of buttons) {
                     const btnText = (btn.textContent || btn.value || '').trim();
                     if (possibleTexts.some(text => btnText.toLowerCase().includes(text.toLowerCase()))) {
                         submitButton = btn;
                         break;
                     }
                 }
             }

            if (submitButton) {
                console.log('Signature Helper: Auto-sending form...');
                submitButton.click();
            } else {
                console.warn('Signature Helper: Auto-send failed, could not find submit button.');
                 // alert('Не удалось найти кнопку отправки для авто-отправки.'); // Optional user feedback
            }
        }, AUTO_SEND_DELAY);
    }


     function updateMainUIState() {
        const hasSignatures = appData.signatures.length > 0;
        if (selectSignatureElement) selectSignatureElement.disabled = !hasSignatures;
        if (insertSignatureButton) insertSignatureButton.disabled = !hasSignatures;
        if (randomSignatureButton) randomSignatureButton.disabled = !hasSignatures;
    }

     function populateSignatureSelect() {
        if (!selectSignatureElement) return;
        const currentSelectedIndex = selectSignatureElement.value; // Remember currently selected value if any
        selectSignatureElement.innerHTML = ''; // Clear existing options

        if (appData.signatures.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'Нет подписей';
            option.disabled = true;
            selectSignatureElement.appendChild(option);
        } else {
            // Group signatures by category
            const categories = {};
            appData.signatures.forEach((sig, index) => {
                const categoryName = sig.category?.trim() || 'Без категории'; // Ensure category is a string
                if (!categories[categoryName]) categories[categoryName] = [];
                categories[categoryName].push({ ...sig, originalIndex: index });
            });

            // Sort category names, placing "Без категории" first
            const sortedCategoryNames = Object.keys(categories).sort((a, b) => {
                 if (a === 'Без категории') return -1;
                 if (b === 'Без категории') return 1;
                 return a.localeCompare(b, 'ru'); // Locale-specific sorting for category names
            });

            // Create optgroups and options
            sortedCategoryNames.forEach(categoryName => {
                const group = document.createElement('optgroup');
                group.label = categoryName;

                // Sort signatures within each category by name
                const signaturesInCategory = categories[categoryName].sort((a, b) => a.name.localeCompare(b.name, 'ru'));

                signaturesInCategory.forEach(sigData => {
                    const option = document.createElement('option');
                    option.value = sigData.originalIndex.toString();
                    option.textContent = sigData.name;
                    // Add tooltip with category and preview (limited length)
                    const preview = sigData.content.substring(0, 100) + (sigData.content.length > 100 ? '...' : '');
                    option.title = `Категория: ${categoryName}\n---\n${preview}`;
                    group.appendChild(option);
                });
                selectSignatureElement.appendChild(group);
            });

            // Restore selection if possible
            const lastIndex = appData.settings.lastSelectedSignatureIndex;
            if (lastIndex !== -1 && selectSignatureElement.querySelector(`option[value="${lastIndex}"]`)) {
                 selectSignatureElement.value = lastIndex.toString();
             } else if (selectSignatureElement.querySelector(`option[value="${currentSelectedIndex}"]`)) {
                 // If last index is invalid, try restoring the previous selection
                selectSignatureElement.value = currentSelectedIndex;
            } else if (selectSignatureElement.options.length > 0) {
                 // Otherwise, select the first available option
                 selectSignatureElement.value = selectSignatureElement.options[0].value;
                 // Update lastSelectedSignatureIndex setting if we selected the first one
                 appData.settings.lastSelectedSignatureIndex = parseInt(selectSignatureElement.value, 10);
            }
        }
        updateMainUIState(); // Update button disabled states
    }


    function showHelpInfo() {
        const helpText = `--- Помощник Подписей Black Russia v${CURRENT_VERSION} ---

Этот скрипт добавляет панель под редактором сообщений для быстрой вставки заранее созданных подписей.

Основные элементы:
- Выпадающий список: Выбор сохраненной подписи (сгруппированы по категориям).
- [Вставить]: Вставка выбранной подписи с предпросмотром. Ваш ник и текущая дата/время будут добавлены в конце согласно настройкам.
- [🎲]: Вставка случайной подписи из списка (также с предпросмотром).
- [⚙️]: Открытие окна управления подписями и настройками.
- [?]: Отображение этой справки.

Окно управления (⚙️):
- Фильтр по категориям и Сортировка: Навигация по списку подписей.
- [+ Добавить подпись]: Открывает форму для создания новой подписи.
- Список подписей: Показывает имя, категорию, количество использований ([N]), дату добавления и последнего использования. При наведении виден текст подписи.
  - [✏️]: Редактировать подпись.
  - [📋]: Дублировать подпись (создать копию).
  - [❌]: Удалить подпись (с подтверждением).
- Настройки:
  - Разделитель: Текст (можно использовать <br> или <br/> для переноса), который вставляется между подписью и блоком "Ник | Дата".
  - Формат даты и времени: Выбор вида отображения даты и времени.
  - Авто-отправка: Опция автоматического нажатия кнопки отправки формы после вставки подписи (используйте с осторожностью!).

Форма добавления/редактирования:
- Название: Обязательное поле для идентификации подписи.
- Категория: Необязательное поле для группировки.
- Глобальные стили: Применение шрифта, жирности (B), курсива (I) или подчеркивания (U) ко ВСЕЙ подписи. Выбор шрифта или нажатие B/I/U обернет весь текст в соответствующие BBCode теги ([font=...], [b], [i], [u]). Повторное нажатие B/I/U уберет тег.
- Содержание подписи: Основной текст вашей подписи. Можно использовать BBCode.
- Панель BBCode: Кнопки для быстрой вставки тегов [b], [i], [u], [strike], [center], [quote], [color], [size], [img], [url].
  - Для [color] и [size] используются выбранные рядом цвет и размер.
  - [🌈]: Применяет случайный цвет ([color=...]) к каждой непустой строке текста.
  - [🕒]: Вставляет текущую дату и время (согласно настройкам) в место курсора.
- Кнопки: "Добавить/Сохранить", "Сохранить и Добавить еще" (только при добавлении), "Отмена" (закрывает форму без сохранения).

При вставке подписи ваш Ник и Дата/Время добавляются автоматически в конец, согласно выбранному формату и разделителю.

Приятного пользования!`;
        alert(helpText);
    }

    function createMainUI(targetEditor) {
         if (document.getElementById('sig-helper-main-ui')) return;

        mainUiContainer = document.createElement('div');
        mainUiContainer.id = 'sig-helper-main-ui';
        mainUiContainer.className = 'sig-helper-main-ui sig-helper-dark';

        selectSignatureElement = document.createElement('select');
        selectSignatureElement.title = 'Выберите подпись (авто-ник/дата)';
        selectSignatureElement.onchange = () => {
             const selectedIndex = parseInt(selectSignatureElement.value, 10);
             if (!isNaN(selectedIndex)) {
                 appData.settings.lastSelectedSignatureIndex = selectedIndex;
                 // No save needed on select change, only on insert
             }
        };
        populateSignatureSelect();

        insertSignatureButton = document.createElement('button');
        insertSignatureButton.type = 'button';
        insertSignatureButton.textContent = 'Вставить';
        insertSignatureButton.className = 'button button--cta';
        insertSignatureButton.title = 'Вставить выбранную подпись (с предпросмотром)';
        insertSignatureButton.onclick = () => {
            const selectedIndex = parseInt(selectSignatureElement.value, 10);
            if (!isNaN(selectedIndex)) {
                if (handleInsertion(selectedIndex)) {
                    triggerAutoSend();
                }
            } else {
                 alert('Пожалуйста, выберите подпись из списка.');
            }
        };

        randomSignatureButton = document.createElement('button');
        randomSignatureButton.type = 'button';
        randomSignatureButton.innerHTML = '🎲';
        randomSignatureButton.className = 'button';
        randomSignatureButton.title = 'Вставить случайную подпись (с предпросмотром)';
        randomSignatureButton.onclick = () => {
            if (appData.signatures.length > 0) {
                const randomIndex = Math.floor(Math.random() * appData.signatures.length);
                 // Select the random signature in the dropdown for visual feedback
                selectSignatureElement.value = randomIndex.toString();
                 // Update setting as if user selected it
                 appData.settings.lastSelectedSignatureIndex = randomIndex;

                if (handleInsertion(randomIndex)) {
                     triggerAutoSend();
                }
            } else {
                alert('Нет сохраненных подписей.');
            }
        };

        const manageButton = document.createElement('button');
        manageButton.type = 'button';
        manageButton.innerHTML = '⚙️';
        manageButton.className = 'button';
        manageButton.title = 'Управление подписями и настройками';
        manageButton.onclick = openManageModal;

        const helpButton = document.createElement('button');
        helpButton.type = 'button';
        helpButton.innerHTML = '?';
        helpButton.className = 'button';
        helpButton.title = 'Помощь и информация о скрипте';
        helpButton.onclick = showHelpInfo;

        mainUiContainer.append(selectSignatureElement, insertSignatureButton, randomSignatureButton, manageButton, helpButton);

        updateMainUIState();

        let insertBeforeElement = targetEditor.closest('.fr-box') || targetEditor.closest('.editorHtml') || targetEditor.parentNode;
        if (insertBeforeElement?.parentNode) {
            insertBeforeElement.parentNode.insertBefore(mainUiContainer, insertBeforeElement);
        } else if(targetEditor?.parentNode) {
             // Fallback: insert directly before the editor itself if no better container found
            targetEditor.parentNode.insertBefore(mainUiContainer, targetEditor);
        } else {
             console.error("Signature Helper: Не удалось найти место для вставки UI.");
        }
    }


    function createManageModal() {
        if (modalElement) return;

        modalElement = document.createElement('div');
        modalElement.id = 'sig-helper-modal';
        modalElement.className = 'sig-helper-modal sig-helper-dark';
        modalElement.style.display = 'none';
        // Close modal if backdrop is clicked
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) {
                closeManageModal();
            }
        });


        const modalContent = document.createElement('div');
        modalContent.className = 'sig-helper-modal-content';
        // Prevent backdrop click from closing when clicking inside content
        modalContent.addEventListener('click', (event) => event.stopPropagation());


        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.className = 'sig-helper-modal-close';
        closeButton.title = 'Закрыть';
        closeButton.onclick = closeManageModal;

        const title = document.createElement('h2');
        title.textContent = 'Управление подписями и настройками';

        // --- Main Area Wrapper (for scrolling list/settings) ---
        const mainArea = document.createElement('div');
        mainArea.className = 'sig-helper-modal-main-area';

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'sig-helper-modal-controls';

        modalCategoryFilter = document.createElement('select');
        modalCategoryFilter.title = 'Фильтр по категории';
        modalCategoryFilter.onchange = () => { currentFilterCategory = modalCategoryFilter.value; renderModalList(); };
        controlsContainer.appendChild(modalCategoryFilter);

        modalSortSelect = document.createElement('select');
        modalSortSelect.title = 'Сортировка списка';
        const sortOptions = {
             'name_asc': 'Имя (А-Я)', 'name_desc': 'Имя (Я-А)', 'usage_desc': 'Чаще используемые', 'usage_asc': 'Реже используемые',
             'date_desc': 'Новые', 'date_asc': 'Старые', 'lastused_desc': 'Недавно использованные', 'lastused_asc': 'Давно использованные' };
        Object.entries(sortOptions).forEach(([value, text]) => {
             const option = document.createElement('option'); option.value = value; option.textContent = text; modalSortSelect.appendChild(option); });
        modalSortSelect.value = currentSortType;
        modalSortSelect.onchange = () => { currentSortType = modalSortSelect.value; renderModalList(); };
        controlsContainer.appendChild(modalSortSelect);

        modalListElement = document.createElement('ul');
        modalListElement.className = 'sig-helper-modal-list';
        modalListElement.addEventListener('click', handleModalListClick);

        const addButton = document.createElement('button');
        addButton.textContent = '+ Добавить подпись';
        addButton.className = 'button button--primary sig-helper-add-button';
        addButton.onclick = () => showModalForm(null);

        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'sig-helper-modal-settings';
        const settingsTitle = document.createElement('h3'); settingsTitle.textContent = 'Настройки';
        settingsContainer.appendChild(settingsTitle);
        createSettingsPane(settingsContainer);

        // Append controls, list, add button, settings to the main scrollable area
        mainArea.append(controlsContainer, modalListElement, addButton, settingsContainer);
        // --- End Main Area Wrapper ---

        createModalForm(); // Create form element (initially hidden)

        // Append title, main scrollable area, and the form (conditionally displayed) to modal content
        modalContent.append(closeButton, title, mainArea, modalFormElement);
        modalElement.appendChild(modalContent);
        document.body.appendChild(modalElement);
    }

     function createSettingsPane(container) {
         const sepLabel = document.createElement('label');
         sepLabel.textContent = 'Разделитель перед Ник/Дата:'; sepLabel.htmlFor = 'sig-helper-settings-separator';
         modalSettingsSeparatorInput = document.createElement('textarea');
         modalSettingsSeparatorInput.id = 'sig-helper-settings-separator'; modalSettingsSeparatorInput.rows = 2;
         modalSettingsSeparatorInput.value = appData.settings.separator; modalSettingsSeparatorInput.placeholder = DEFAULT_SEPARATOR.replace(/\\n/g, '\n'); // Show default line breaks correctly
         modalSettingsSeparatorInput.className = 'sig-helper-settings-input';
         modalSettingsSeparatorInput.addEventListener('change', saveSettings); // Save on change


         const dtLabel = document.createElement('label');
         dtLabel.textContent = 'Формат даты и времени:'; dtLabel.htmlFor = 'sig-helper-settings-datetime';
         modalSettingsDateTimeSelect = document.createElement('select');
         modalSettingsDateTimeSelect.id = 'sig-helper-settings-datetime'; modalSettingsDateTimeSelect.className = 'sig-helper-settings-input';
         Object.keys(DATETIME_PRESETS).forEach(presetKey => {
             const option = document.createElement('option'); option.value = presetKey;
             // Get a formatted example for each preset
             option.textContent = `${presetKey} (Пример: ${getCurrentDateTime(presetKey)})`;
              modalSettingsDateTimeSelect.appendChild(option); });
         modalSettingsDateTimeSelect.value = appData.settings.dateTimePreset;
         modalSettingsDateTimeSelect.addEventListener('change', saveSettings);

         const autoSendLabel = document.createElement('label'); autoSendLabel.className = 'sig-helper-settings-label-checkbox';
         modalSettingsAutoSendCheckbox = document.createElement('input');
         modalSettingsAutoSendCheckbox.type = 'checkbox'; modalSettingsAutoSendCheckbox.id = 'sig-helper-settings-autosend';
         modalSettingsAutoSendCheckbox.checked = appData.settings.autoSendAfterInsert;
          modalSettingsAutoSendCheckbox.addEventListener('change', saveSettings);
         autoSendLabel.appendChild(modalSettingsAutoSendCheckbox);
         autoSendLabel.appendChild(document.createTextNode(' Автоматически отправлять форму после вставки (Рискованно!)'));
         autoSendLabel.title = 'Если включено, скрипт попытается нажать кнопку отправки формы после успешной вставки подписи.';

         container.append(sepLabel, modalSettingsSeparatorInput, dtLabel, modalSettingsDateTimeSelect, autoSendLabel);
     }

     function saveSettings() {
         // Read values from inputs
         let separatorValue = modalSettingsSeparatorInput.value;
         // Ensure default separator if input is empty or only whitespace
         appData.settings.separator = separatorValue.trim() === '' ? DEFAULT_SEPARATOR : separatorValue;
         appData.settings.dateTimePreset = DATETIME_PRESETS[modalSettingsDateTimeSelect.value] ? modalSettingsDateTimeSelect.value : DEFAULT_DATETIME_PRESET;
         appData.settings.autoSendAfterInsert = modalSettingsAutoSendCheckbox.checked;

         // Update UI in case validation changed the value (e.g., empty separator)
         modalSettingsSeparatorInput.value = appData.settings.separator; // Reflect potentially corrected value
         modalSettingsDateTimeSelect.value = appData.settings.dateTimePreset;
         modalSettingsAutoSendCheckbox.checked = appData.settings.autoSendAfterInsert;

         saveData(); // Save the updated appData
     }


    function createModalForm() {
        modalFormElement = document.createElement('div');
        modalFormElement.className = 'sig-helper-modal-form';
        modalFormElement.style.display = 'none'; // Initially hidden

        const formTitle = document.createElement('h3');
        formTitle.id = 'sig-helper-form-title';

        const nameLabel = document.createElement('label'); nameLabel.textContent = 'Название:'; nameLabel.htmlFor = 'sig-helper-name-input';
        modalNameInput = document.createElement('input'); modalNameInput.type = 'text'; modalNameInput.id = 'sig-helper-name-input'; modalNameInput.required = true;

        const categoryLabel = document.createElement('label'); categoryLabel.textContent = 'Категория (необязательно):'; categoryLabel.htmlFor = 'sig-helper-category-input';
        modalCategoryInput = document.createElement('input'); modalCategoryInput.type = 'text'; modalCategoryInput.id = 'sig-helper-category-input'; modalCategoryInput.placeholder = 'Например: RP, Гос. Орг., Жалобы';
        const categoryDatalist = document.createElement('datalist'); categoryDatalist.id = 'sig-helper-categories';
        modalCategoryInput.setAttribute('list', categoryDatalist.id); // Link input to datalist

        // --- Global Styles ---
        const globalStyleContainer = document.createElement('div');
        globalStyleContainer.className = 'sig-helper-global-style-controls';

        const fontLabel = document.createElement('label'); fontLabel.textContent = 'Шрифт:'; fontLabel.htmlFor = 'sig-helper-global-font';
        const fontSelect = document.createElement('select'); fontSelect.id = 'sig-helper-global-font'; fontSelect.title = 'Применить шрифт ко всей подписи';
        FONT_LIST.forEach(fontName => {
            const option = document.createElement('option');
            option.value = fontName === 'По умолчанию' ? '' : fontName; option.textContent = fontName;
            if (fontName !== 'По умолчанию') option.style.fontFamily = fontName; // Show font preview in dropdown
            fontSelect.appendChild(option);
        });
        fontSelect.onchange = () => applyGlobalStyle('font', fontSelect.value);
        fontLabel.appendChild(fontSelect);

        const styleButtonContainer = document.createElement('div'); styleButtonContainer.className = 'sig-helper-global-style-buttons';
        [{ tag: 'b', text: 'B' }, { tag: 'i', text: 'I' }, { tag: 'u', text: 'U' }].forEach(style => {
            const button = document.createElement('button'); button.type = 'button'; button.textContent = style.text; button.id = `sig-helper-global-${style.tag}`;
            button.className = 'button button--small sig-helper-global-style-button'; button.title = `Применить/убрать ${style.tag}-стиль ко всей подписи`;
            button.onclick = () => applyGlobalStyle(style.tag);
            styleButtonContainer.appendChild(button);
        });
        globalStyleContainer.append(fontLabel, styleButtonContainer);
        // --- End Global Styles ---


        const contentLabel = document.createElement('label'); contentLabel.innerHTML = 'Содержание подписи <small>(BBCode)</small>:'; contentLabel.htmlFor = 'sig-helper-content-input';
        modalContentInput = document.createElement('textarea'); modalContentInput.id = 'sig-helper-content-input';
        modalContentInput.rows = 7; modalContentInput.required = true;
        // Update global style UI based on content changes/focus
        modalContentInput.addEventListener('input', debounce(updateGlobalStyleUI, 300));
        modalContentInput.addEventListener('focus', updateGlobalStyleUI);
        modalContentInput.addEventListener('blur', updateGlobalStyleUI); // Also check on blur

        // --- Toolbar ---
        const toolbarContainer = document.createElement('div'); toolbarContainer.className = 'sig-helper-toolbar-container';
        const bbCodeToolbar = document.createElement('div'); bbCodeToolbar.className = 'sig-helper-bbcode-toolbar';

        // Basic tags
        ['b', 'i', 'u'].forEach(tag => bbCodeToolbar.appendChild(createToolbarButton(tag, `[${tag}]`)));
        // Additional tags
        bbCodeToolbar.appendChild(createToolbarButton('strike', 'Зачеркнутый'));
        bbCodeToolbar.appendChild(createToolbarButton('center', 'Центрировать'));
        bbCodeToolbar.appendChild(createToolbarButton('quote', 'Цитата'));

        // Color picker + button
        const colorPicker = document.createElement('input'); colorPicker.type = 'color'; colorPicker.id = 'sig-helper-bbcode-color'; colorPicker.value = '#E0E0E0'; // Default dark theme text color
        colorPicker.title = 'Выбрать цвет для [color]'; colorPicker.className = 'sig-helper-bbcode-control sig-helper-bbcode-colorpicker';
        bbCodeToolbar.appendChild(colorPicker);
        bbCodeToolbar.appendChild(createToolbarButton('color', 'Цвет текста'));

        // Size select + button
        const sizeSelect = document.createElement('select'); sizeSelect.id = 'sig-helper-bbcode-size'; sizeSelect.title = 'Выбрать размер для [size]'; sizeSelect.className = 'sig-helper-bbcode-control';
        for (let i = 1; i <= 7; i++) { const opt = document.createElement('option'); opt.value = i; opt.textContent = ` ${i} `; if (i === 4) opt.selected = true; sizeSelect.appendChild(opt); } // Size 4 is often default
        bbCodeToolbar.appendChild(sizeSelect);
        bbCodeToolbar.appendChild(createToolbarButton('size', 'Размер текста'));

        // Image and Link buttons
        bbCodeToolbar.appendChild(createToolbarButton('img', 'Изображение'));
        bbCodeToolbar.appendChild(createToolbarButton('url', 'Ссылка'));

        // Action buttons (Random color, Insert Date/Time)
        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.className = 'sig-helper-toolbar-actions';

        const randomColorButton = document.createElement('button'); randomColorButton.type = 'button'; randomColorButton.innerHTML = '🌈';
        randomColorButton.title = 'Применить случайный цвет к каждой строке'; randomColorButton.className = 'button button--small'; randomColorButton.onclick = applyRandomLineColors;
        actionButtonsContainer.appendChild(randomColorButton);

        const insertDateTimeButton = document.createElement('button'); insertDateTimeButton.type = 'button'; insertDateTimeButton.innerHTML = '🕒';
        insertDateTimeButton.title = 'Вставить текущую дату/время в текст'; insertDateTimeButton.className = 'button button--small'; insertDateTimeButton.onclick = insertDateTimeIntoContent;
        actionButtonsContainer.appendChild(insertDateTimeButton);

        toolbarContainer.append(bbCodeToolbar, actionButtonsContainer);
        // --- End Toolbar ---

        // --- Form Buttons ---
        const buttonGroup = document.createElement('div'); buttonGroup.className = 'sig-helper-form-buttons';

        modalSaveButton = document.createElement('button'); modalSaveButton.type = 'button'; // Ensure type=button
        modalSaveButton.className = 'button button--cta';
        modalSaveButton.onclick = () => handleModalSave(false);

        modalSaveAndNewButton = document.createElement('button'); modalSaveAndNewButton.type = 'button';
        modalSaveAndNewButton.textContent = 'Сохранить и Добавить еще';
        modalSaveAndNewButton.className = 'button button--primary';
        modalSaveAndNewButton.title = 'Сохранить текущую и очистить форму для добавления следующей';
        modalSaveAndNewButton.onclick = () => handleModalSave(true);

        modalCancelButton = document.createElement('button'); modalCancelButton.type = 'button';
        modalCancelButton.textContent = 'Отмена';
        modalCancelButton.className = 'button';
        modalCancelButton.onclick = hideModalForm; // Use the function to hide the form

        buttonGroup.append(modalSaveButton, modalSaveAndNewButton, modalCancelButton);
        // --- End Form Buttons ---

        // Assemble the form
        modalFormElement.append(
            formTitle,
            nameLabel, modalNameInput,
            categoryLabel, modalCategoryInput, categoryDatalist,
            globalStyleContainer,
            contentLabel, modalContentInput,
            toolbarContainer,
            buttonGroup
        );
    }


     function createToolbarButton(tag, title) {
         const button = document.createElement('button'); button.type = 'button';
         button.textContent = `[${tag}]`; button.className = 'button button--small sig-helper-bbcode-button';
         button.title = title; button.onclick = () => insertBbCode(tag);
         return button;
     }

     function insertDateTimeIntoContent() {
         const currentDateTime = getCurrentDateTime(); const textarea = modalContentInput;
         const start = textarea.selectionStart; const end = textarea.selectionEnd;
         const before = textarea.value.substring(0, start);
         const after = textarea.value.substring(end);

         textarea.value = before + currentDateTime + after;
         textarea.focus();
         // Place cursor after inserted text
         textarea.selectionStart = textarea.selectionEnd = start + currentDateTime.length;
         textarea.dispatchEvent(new Event('input', { bubbles: true })); // Trigger updates
     }


     function insertBbCode(tag) {
        const textarea = modalContentInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        let replacement = '';
        let cursorPosition = start; // Default cursor position if no text selected

        switch (tag) {
            case 'url':
                const url = prompt('Введите URL адрес:', selectedText.startsWith('http') ? selectedText : 'https://');
                if (url === null || url.trim() === '') return;
                const urlText = selectedText || url; // Use selected text or URL itself as text
                replacement = `[url=${url}]${urlText}[/url]`;
                cursorPosition = start + `[url=${url}]`.length + urlText.length + `[/url]`.length; // End of tag
                break;
            case 'img':
                 const imgUrl = prompt('Введите URL изображения:', selectedText.startsWith('http') ? selectedText : 'https://');
                 if (imgUrl === null || imgUrl.trim() === '') return;
                 replacement = `[img]${imgUrl}[/img]`;
                 cursorPosition = start + replacement.length; // End of tag
                 break;
            case 'color':
                 const colorInput = document.getElementById('sig-helper-bbcode-color');
                 const color = colorInput ? colorInput.value : '#E0E0E0';
                 replacement = `[color=${color}]${selectedText || 'текст'}[/color]`;
                 if (selectedText) {
                     cursorPosition = start + replacement.length; // End if text was selected
                 } else {
                     cursorPosition = start + `[color=${color}]`.length; // Inside tag if no text selected
                 }
                 break;
            case 'size':
                 const sizeInput = document.getElementById('sig-helper-bbcode-size');
                 const size = sizeInput ? sizeInput.value : '4';
                 replacement = `[size=${size}]${selectedText || 'текст'}[/size]`;
                  if (selectedText) {
                     cursorPosition = start + replacement.length;
                 } else {
                     cursorPosition = start + `[size=${size}]`.length;
                 }
                 break;
            case 'center':
            case 'strike':
            case 'quote':
            case 'b':
            case 'i':
            case 'u':
            default: // Standard tags like [b]...[/b]
                 replacement = `[${tag}]${selectedText}[/${tag}]`;
                 if (selectedText) {
                      cursorPosition = start + replacement.length;
                 } else {
                      cursorPosition = start + `[${tag}]`.length; // Position inside the tags
                 }
                 break;
        }

        textarea.value = beforeText + replacement + afterText;
        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition); // Set cursor position intelligently
        textarea.dispatchEvent(new Event('input', { bubbles: true })); // Trigger updates
     }


     function getRandomHexColor() {
         // Generate a bright, saturated color usable on a dark background
         const h = Math.floor(Math.random() * 360); // Hue (0-359)
         const s = Math.floor(Math.random() * 30) + 70; // Saturation (70-100%) - high saturation
         const l = Math.floor(Math.random() * 20) + 60; // Lightness (60-80%) - bright but not white

         // Convert HSL to RGB (standard algorithm)
         const c = (1 - Math.abs(2 * l/100 - 1)) * (s/100);
         const x = c * (1 - Math.abs((h / 60) % 2 - 1));
         const m = (l/100) - c/2;
         let r = 0, g = 0, b = 0;
         if (0 <= h && h < 60) { r = c; g = x; b = 0; }
         else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
         else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
         else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
         else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
         else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
         r = Math.round((r + m) * 255);
         g = Math.round((g + m) * 255);
         b = Math.round((b + m) * 255);

         // Convert RGB to Hex
         const toHex = n => n.toString(16).padStart(2, '0');
         return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
     }

     function applyRandomLineColors() {
         const textarea = modalContentInput;
         const lines = textarea.value.split('\n');
         const coloredLines = lines.map(line => {
             const trimmedLine = line.trim();
             if (trimmedLine === '') return line; // Keep empty lines as is
             // Avoid re-coloring lines that already seem to have a color tag
             if (/^\[color=#[0-9a-f]{6}\].*\[\/color\]$/i.test(trimmedLine)) return line;
             // Remove existing color tags if they aren't wrapping the whole line
             const lineWithoutColor = trimmedLine.replace(/\[color=#[0-9a-f]{6}\](.*?)\[\/color\]/gi, '$1');
             return `[color=${getRandomHexColor()}]${lineWithoutColor}[/color]`;
         });
         textarea.value = coloredLines.join('\n');
         textarea.focus();
         updateGlobalStyleUI(); // Update UI in case global styles were affected
         textarea.dispatchEvent(new Event('input', { bubbles: true }));
     }


    function applyGlobalStyle(styleType, value = null) {
        const textarea = modalContentInput;
        if (!textarea) return;

        let currentContent = textarea.value;
        let needsUpdate = false;

        // Trim BOM if present
        if (currentContent.charCodeAt(0) === 0xFEFF) {
            currentContent = currentContent.substring(1);
        }

        let cleanedContent = currentContent.trim(); // Work with trimmed content initially
        let prefix = currentContent.match(/^\s*/)?.[0] || ''; // Preserve leading whitespace
        let suffix = currentContent.match(/\s*$/)?.[0] || ''; // Preserve trailing whitespace

        let regex, tag;
        let wasWrapped = false;

        if (styleType === 'font') {
            regex = /^\[font=([^\]]+)\]([\s\S]*)\[\/font\]$/i;
            const match = cleanedContent.match(regex);
            if (match) {
                cleanedContent = match[2] || ''; // Content inside
                wasWrapped = true; // Was wrapped
            }
            // Apply new font if selected, otherwise leave cleaned content
            if (value && value !== '') {
                cleanedContent = `[font=${value}]${cleanedContent}[/font]`;
                needsUpdate = true;
            } else if (wasWrapped) { // Font is removed (value='') and it was previously applied
                needsUpdate = true;
            }
        } else if (['b', 'i', 'u'].includes(styleType)) {
            tag = styleType;
            regex = new RegExp(`^\\[${tag}\\]([\\s\\S]*)\\[\\/${tag}\\]$`, 'i');
            const match = cleanedContent.match(regex);
            if (match) { // Is wrapped, so unwrap
                cleanedContent = match[1] || '';
                wasWrapped = true;
                needsUpdate = true;
            } else { // Not wrapped, so apply wrap
                cleanedContent = `[${tag}]${cleanedContent}[/${tag}]`;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
             // Re-apply prefix/suffix
            textarea.value = prefix + cleanedContent + suffix;
            updateGlobalStyleUI(); // Update UI controls
             textarea.focus();
             // Move cursor to end after applying style
             textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
             textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function updateGlobalStyleUI() {
        const content = modalContentInput?.value.trim() || ''; // Check trimmed content for styles

        // Font
        const fontSelect = document.getElementById('sig-helper-global-font');
        if (fontSelect) {
            const fontMatch = content.match(/^\[font=([^\]]+)\]/i);
            let currentFont = fontMatch ? fontMatch[1].trim() : '';
            // Find the option matching the current font (case-insensitive)
            const option = Array.from(fontSelect.options).find(opt => opt.value.toLowerCase() === currentFont.toLowerCase());
            fontSelect.value = option ? option.value : ''; // Set to found or "По умолчанию"
        }

        // B/I/U buttons
        ['b', 'i', 'u'].forEach(tag => {
            const button = document.getElementById(`sig-helper-global-${tag}`);
            if (button) {
                // Check if the content starts with [tag] and ends with [/tag] (case-insensitive)
                const styleRegex = new RegExp(`^\\[${tag}\\][\\s\\S]*\\[\\/${tag}\\]$`, 'i');
                button.classList.toggle('active', styleRegex.test(content));
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const context = this; // Capture context
            const later = () => {
                timeout = null; // Clear timeout ID
                func.apply(context, args); // Execute function with original context and args
            };
            clearTimeout(timeout); // Clear the previous timeout
            timeout = setTimeout(later, wait); // Set a new timeout
        };
    }


    function handleModalListClick(event) {
        const target = event.target;
        const actionButton = target.closest('button[data-action]');
        const listItem = target.closest('li[data-index]');

        if (!listItem) return; // Click wasn't on a list item or its contents

        const indexStr = listItem.dataset.index;
        if (!indexStr) return; // No index found

        const index = parseInt(indexStr, 10);
        if (isNaN(index) || index < 0 || index >= appData.signatures.length) {
            console.warn('Invalid index clicked:', indexStr);
            return; // Invalid index
        }

        if (actionButton) {
            // Handle button clicks (Edit, Delete, Duplicate)
            const action = actionButton.dataset.action;
            event.stopPropagation(); // Prevent triggering other actions if nested
            if (action === 'edit') showModalForm(index);
            else if (action === 'delete') deleteSignature(index);
            else if (action === 'duplicate') duplicateSignature(index);
        } else {
            // Optional: Handle click on the list item itself (e.g., select for editing?)
            // Currently, only buttons have actions.
        }
    }


     function populateCategoryFilter() {
         if (!modalCategoryFilter) return;
         const currentFilterValue = modalCategoryFilter.value; // Remember current selection
         modalCategoryFilter.innerHTML = ''; // Clear old options

         // Add default options
         const allOption = document.createElement('option'); allOption.value = 'all'; allOption.textContent = 'Все категории'; modalCategoryFilter.appendChild(allOption);
         const noCategoryOption = document.createElement('option'); noCategoryOption.value = ''; noCategoryOption.textContent = 'Без категории'; modalCategoryFilter.appendChild(noCategoryOption);

         // Get unique, sorted categories from signatures
         const categories = [...new Set(appData.signatures.map(sig => sig.category?.trim()).filter(Boolean))] // Filter out empty/null, trim
                           .sort((a, b) => a.localeCompare(b, 'ru'));

         // Add options for each category
         categories.forEach(cat => {
              const option = document.createElement('option');
              option.value = cat;
              option.textContent = cat;
              modalCategoryFilter.appendChild(option); });

         // Restore previous selection if possible, otherwise default to 'all'
         modalCategoryFilter.value = currentFilterValue && modalCategoryFilter.querySelector(`option[value="${CSS.escape(currentFilterValue)}"]`) ? currentFilterValue : 'all';
         currentFilterCategory = modalCategoryFilter.value; // Update state variable
     }


     function updateCategoryDatalist() {
         const datalist = document.getElementById('sig-helper-categories'); if (!datalist) return;
         datalist.innerHTML = ''; // Clear old suggestions
         // Get unique, non-empty, sorted categories
         const categories = [...new Set(appData.signatures.map(sig => sig.category?.trim()).filter(Boolean))]
                           .sort((a, b) => a.localeCompare(b, 'ru'));
         categories.forEach(cat => { const option = document.createElement('option'); option.value = cat; datalist.appendChild(option); });
     }

    function renderModalList() {
        if (!modalListElement) return;
        modalListElement.innerHTML = ''; // Clear previous list

        // Filter signatures based on the selected category
        let filteredSignatures = appData.signatures.filter(sig => {
            const sigCategory = sig.category?.trim() || '';
            return currentFilterCategory === 'all' || sigCategory === currentFilterCategory;
        });

        // Sort the filtered signatures
        filteredSignatures.sort((a, b) => {
            // Helper for safe number comparison (treat null/undefined as 0)
            const safeNum = (n) => n || 0;
            // Helper for safe string comparison
            const safeStr = (s) => s || '';

            switch (currentSortType) {
                case 'name_asc': return safeStr(a.name).localeCompare(safeStr(b.name), 'ru');
                case 'name_desc': return safeStr(b.name).localeCompare(safeStr(a.name), 'ru');
                case 'usage_desc': return safeNum(b.usageCount) - safeNum(a.usageCount);
                case 'usage_asc': return safeNum(a.usageCount) - safeNum(b.usageCount);
                case 'date_desc': return safeNum(b.dateAdded) - safeNum(a.dateAdded);
                case 'date_asc': return safeNum(a.dateAdded) - safeNum(b.dateAdded);
                case 'lastused_desc': return safeNum(b.lastUsed) - safeNum(a.lastUsed); // Nulls (never used) will be last
                case 'lastused_asc': return safeNum(a.lastUsed) - safeNum(b.lastUsed); // Nulls (never used) will be first
                default: return 0;
            }
        });

        if (filteredSignatures.length === 0) {
            modalListElement.innerHTML = '<li class="sig-helper-list-empty">Нет подписей, соответствующих фильтру.</li>';
            return;
        }

        // Create list items for filtered and sorted signatures
        filteredSignatures.forEach(sig => {
            // Find the original index in the main appData array
            const originalIndex = appData.signatures.findIndex(original => original === sig);
             if (originalIndex === -1) return; // Should not happen, but safety check

            const li = document.createElement('li');
            li.dataset.index = originalIndex; // Store the original index

            const mainInfoDiv = document.createElement('div');
            mainInfoDiv.className = 'sig-helper-list-main';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'sig-helper-list-name';
            nameSpan.textContent = sig.name || 'Без имени';
            mainInfoDiv.appendChild(nameSpan);

            const categorySpan = document.createElement('span');
            categorySpan.className = 'sig-helper-list-category';
            categorySpan.textContent = sig.category?.trim() || 'Без категории';
            mainInfoDiv.appendChild(categorySpan);

            const usageSpan = document.createElement('span');
            usageSpan.className = 'sig-helper-list-usage';
            usageSpan.textContent = `[${sig.usageCount || 0}]`;
            usageSpan.title = `Использовано: ${sig.usageCount || 0} раз`;
            mainInfoDiv.appendChild(usageSpan);


            const extraInfoDiv = document.createElement('div');
            extraInfoDiv.className = 'sig-helper-list-extra';
            const dateAdded = sig.dateAdded ? new Date(sig.dateAdded).toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'2-digit' }) : 'N/A';
            const lastUsed = sig.lastUsed ? new Date(sig.lastUsed).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' }) : 'Никогда';
            extraInfoDiv.textContent = `Добавлено: ${dateAdded} | Последний раз: ${lastUsed}`;
            // Tooltip for the extra info could show full content or be removed if redundant
            const preview = sig.content.substring(0, 150) + (sig.content.length > 150 ? '...' : '');
            extraInfoDiv.title = `Содержание:\n${preview}`;


            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'sig-helper-list-actions';
            buttonDiv.append(
                createModalButton('✏️', 'Редактировать', 'edit'),
                createModalButton('📋', 'Дублировать', 'duplicate'),
                createModalButton('❌', 'Удалить', 'delete', true) // isDanger = true
            );

            li.append(mainInfoDiv, extraInfoDiv, buttonDiv);
            modalListElement.appendChild(li);
        });
    }


    function createModalButton(text, title, action, isDanger = false) {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = text; // Use innerHTML for emoji icons
        button.title = title;
        button.className = `button button--small ${isDanger ? 'button--danger' : ''}`;
        button.dataset.action = action; // Store action in data attribute
        return button;
    }

    function showModalForm(index) {
        editingIndex = index; // Store index being edited (null for new)
        modalFormElement.style.display = 'flex'; // Show the form section
        updateCategoryDatalist(); // Update category suggestions

        const formTitle = modalFormElement.querySelector('#sig-helper-form-title');
        const isEditing = index !== null && index >= 0 && index < appData.signatures.length;

        if (isEditing) {
            const sig = appData.signatures[index];
            formTitle.textContent = 'Редактировать подпись';
            modalNameInput.value = sig.name;
            modalContentInput.value = sig.content;
            modalCategoryInput.value = sig.category || '';
            modalSaveButton.textContent = 'Сохранить изменения';
            modalSaveAndNewButton.style.display = 'none'; // Hide "Save & New" when editing
            // Focus last element or content area for editing flow
            modalContentInput.focus();
            // Optionally move cursor to end of content
            modalContentInput.setSelectionRange(modalContentInput.value.length, modalContentInput.value.length);
        } else {
            // Adding a new signature
            formTitle.textContent = 'Добавить подпись';
            modalSaveButton.textContent = 'Добавить подпись';
            modalSaveAndNewButton.style.display = 'inline-block'; // Show "Save & New"
             // Clear form only if it wasn't just populated by 'duplicate'
             if (modalNameInput.value.endsWith(' (Копия)') === false) {
                 modalNameInput.value = '';
                 modalContentInput.value = '';
                 modalCategoryInput.value = '';
             }
            modalNameInput.focus(); // Focus name field for new signature
        }

        updateGlobalStyleUI(); // Update B/I/U/Font buttons based on content
        // Scroll the form into view if it's outside the viewport
        modalFormElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }


    function hideModalForm() {
        modalFormElement.style.display = 'none'; // Hide the form section
        editingIndex = null; // Reset editing state

        // Optionally clear fields on cancel, or leave them if user might reopen
        // modalNameInput.value = '';
        // modalContentInput.value = '';
        // modalCategoryInput.value = '';

        // Reset global style UI state visually
        const fontSelect = document.getElementById('sig-helper-global-font'); if (fontSelect) fontSelect.value = '';
        ['b', 'i', 'u'].forEach(tag => { const btn = document.getElementById(`sig-helper-global-${tag}`); if (btn) btn.classList.remove('active'); });
    }


    function handleModalSave(keepFormOpen = false) {
        const name = modalNameInput.value;
        const content = modalContentInput.value;
        const category = modalCategoryInput.value;

        // Basic validation
        if (!name?.trim()) {
             alert('Название подписи не может быть пустым.');
             modalNameInput.focus();
             return;
        }
         if (!content) { // Allow empty content? For now, require something.
             alert('Содержание подписи не может быть пустым.');
             modalContentInput.focus();
             return;
        }


        let success = false;
        const isEditing = editingIndex !== null && editingIndex >= 0;

        if (isEditing) {
            success = updateSignature(editingIndex, name, content, category);
        } else {
            success = addSignature(name, content, category);
        }

        if (success) {
            saveData(); // Persist changes
            populateCategoryFilter(); // Update filter dropdown
            renderModalList(); // Refresh the list view
            populateSignatureSelect(); // Update main UI dropdown

            if (!isEditing && keepFormOpen) {
                // Clear form for next entry
                modalNameInput.value = '';
                modalContentInput.value = '';
                modalCategoryInput.value = ''; // Keep category maybe? No, clear all.
                editingIndex = null; // Ensure we are adding next time
                const formTitle = modalFormElement.querySelector('#sig-helper-form-title');
                if (formTitle) formTitle.textContent = 'Добавить подпись';
                updateGlobalStyleUI(); // Reset style buttons for empty form
                modalNameInput.focus(); // Focus name for next entry
            } else {
                hideModalForm(); // Close form on successful save/edit unless "Save & New"
            }
        }
        // No 'else' needed, validation alerts handle failure cases
    }


    function openManageModal() {
        if (!modalElement) createManageModal(); // Create modal if it doesn't exist

        // Ensure UI elements reflect current state *before* showing
        populateCategoryFilter();
        renderModalList(); // Render list based on current filter/sort
        modalSettingsSeparatorInput.value = appData.settings.separator;
        modalSettingsDateTimeSelect.value = appData.settings.dateTimePreset;
        modalSettingsAutoSendCheckbox.checked = appData.settings.autoSendAfterInsert;

        // Ensure form is hidden when modal opens initially
        hideModalForm();

        modalElement.style.display = 'flex'; // Show the modal
        // Focus filter or sort as a starting point
        modalCategoryFilter.focus();
         // Add class to body to prevent background scroll when modal is open
        document.body.classList.add('sig-helper-modal-open');
    }

    function closeManageModal() {
        if (modalElement) {
            hideModalForm(); // Ensure form is hidden if user closes modal while form is open
            modalElement.style.display = 'none'; // Hide the modal
            // Remove class from body to allow background scroll again
             document.body.classList.remove('sig-helper-modal-open');
        }
    }


    function addStyles() {
        GM_addStyle(`
            /* Prevent background scroll when modal is open */
            body.sig-helper-modal-open { overflow: hidden; }

            /* Переменные */
            .sig-helper-dark {
                --bg-color: #2d2d2d; --text-color: #e0e0e0; --border-color: #555;
                --input-bg: #3a3a3a; --input-text: #e0e0e0; --button-bg: #4a4a4a;
                --button-text: #e0e0e0; --button-hover-bg: #5a5a5a;
                --button-primary-bg: #007bff; --button-primary-hover-bg: #0056b3;
                --button-danger-bg: #dc3545; --button-danger-hover-bg: #c82333;
                --button-cta-bg: #28a745; --button-cta-hover-bg: #218838;
                --modal-list-hover-bg: #3f3f3f; --modal-list-extra-color: #aaa;
                --scrollbar-track-bg: #333; --scrollbar-thumb-bg: #666; --scrollbar-thumb-hover-bg: #888;
                --global-style-active-bg: var(--button-primary-bg);
                --global-style-active-text: white;
            }
            /* Основной UI */
            .sig-helper-main-ui { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 10px 0; padding: 8px 10px; background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); }
            .sig-helper-main-ui select { padding: 5px 8px; border: 1px solid var(--border-color); border-radius: 3px; min-width: 150px; max-width: 250px; background-color: var(--input-bg); color: var(--input-text); cursor: pointer; flex-grow: 1; }
            .sig-helper-main-ui button { padding: 5px 10px; font-size: 1em; line-height: 1.2; background-color: var(--button-bg); color: var(--button-text); border: 1px solid var(--border-color); border-radius: 3px; cursor: pointer; white-space: nowrap; transition: background-color 0.2s ease; }
            .sig-helper-main-ui button:hover:not(:disabled) { background-color: var(--button-hover-bg); }
            .sig-helper-main-ui select:disabled, .sig-helper-main-ui button:disabled { opacity: 0.6; cursor: not-allowed; }
            .sig-helper-main-ui .button--cta { background-color: var(--button-cta-bg); border-color: var(--button-cta-bg); color: white; }
            .sig-helper-main-ui .button--cta:hover:not(:disabled) { background-color: var(--button-cta-hover-bg); border-color: var(--button-cta-hover-bg); }
            .sig-helper-main-ui select optgroup { font-style: italic; font-weight: bold; color: #ccc; background-color: var(--input-bg); }
            .sig-helper-main-ui select option { color: var(--input-text); background-color: var(--input-bg); padding-left: 10px; }

            /* Модальное окно */
            .sig-helper-modal { display: none; position: fixed; z-index: 10001; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.75); justify-content: center; align-items: center; backdrop-filter: blur(2px); }
            .sig-helper-modal-content { background-color: var(--bg-color); color: var(--text-color); padding: 0; border-radius: 6px; border: 1px solid var(--border-color); max-width: 850px; width: 95%; max-height: 90vh; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; /* overflow: hidden; */ position: relative; } /* Removed overflow hidden from main content */
            .sig-helper-modal-close { position: absolute; top: 10px; right: 12px; font-size: 28px; font-weight: bold; z-index: 10; border: none; background: none; cursor: pointer; padding: 0; line-height: 1; color: #aaa; transition: color 0.2s ease; }
            .sig-helper-modal-close:hover { color: #fff; }
            .sig-helper-modal-content h2 { color: var(--text-color); margin: 0; padding: 15px 25px; text-align: center; font-size: 1.3em; border-bottom: 1px solid var(--border-color); flex-shrink: 0; } /* Title fixed top */

            /* Main scrollable area for list/settings */
            .sig-helper-modal-main-area { display: flex; flex-direction: column; flex-grow: 1; overflow-y: auto; /* Primary scroll here */ overflow-x: hidden; /* Prevent horizontal scroll */ scrollbar-color: var(--scrollbar-thumb-bg) transparent; scrollbar-width: thin; }
            .sig-helper-modal-main-area::-webkit-scrollbar { width: 8px; }
            .sig-helper-modal-main-area::-webkit-scrollbar-track { background: transparent; }
            .sig-helper-modal-main-area::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb-bg); border-radius: 4px;}
            .sig-helper-modal-main-area::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover-bg); }

            /* Controls, List, Add Button, Settings inside the main area */
            .sig-helper-modal-controls { display: flex; gap: 10px; padding: 10px 20px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; background-color: var(--input-bg); }
            .sig-helper-modal-controls select { padding: 5px 8px; border: 1px solid var(--border-color); border-radius: 3px; background-color: var(--bg-color); color: var(--input-text); cursor: pointer; }
            .sig-helper-modal-list { list-style: none; padding: 0; margin: 10px 20px; flex-shrink: 1; /* Allow list to shrink if needed, but main area grows */ border: 1px solid var(--border-color); border-radius: 4px; min-height: 150px; } /* Removed flex-grow from list itself */
            .sig-helper-add-button { margin: 0 20px 15px 20px; align-self: flex-start; flex-shrink: 0; }
            .sig-helper-modal-settings { padding: 10px 20px 15px 20px; border-top: 1px solid var(--border-color); background-color: var(--input-bg); flex-shrink: 0; margin-top: auto; /* Push settings towards bottom of main area */ }

            /* List Item Styling */
            .sig-helper-modal-list li { padding: 8px 12px; border-bottom: 1px solid var(--border-color); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; transition: background-color 0.2s ease; gap: 10px; }
            .sig-helper-modal-list li:last-child { border-bottom: none; }
            .sig-helper-modal-list li:hover { background-color: var(--modal-list-hover-bg); }
            .sig-helper-list-main { display: flex; align-items: baseline; gap: 8px; flex-grow: 1; min-width: 200px; flex-wrap: nowrap; overflow: hidden; }
            .sig-helper-list-name { font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 1; }
            .sig-helper-list-category { font-size: 0.85em; color: #ccc; background-color: #444; padding: 1px 5px; border-radius: 3px; white-space: nowrap; margin-left: 4px; flex-shrink: 0; }
            .sig-helper-list-usage { font-size: 0.85em; color: var(--button-primary-bg); font-weight: bold; margin-left: auto; padding-left: 10px; flex-shrink: 0; }
            .sig-helper-list-extra { font-size: 0.8em; color: var(--modal-list-extra-color); width: 100%; margin-top: 3px; cursor: default; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .sig-helper-list-actions { display: flex; gap: 6px; flex-shrink: 0; }
            .sig-helper-modal-list li.sig-helper-list-empty { padding: 15px; text-align: center; color: #aaa; font-style: italic; border: none; justify-content: center; }

             /* Settings Content */
             .sig-helper-modal-settings h3 { margin: 0 0 10px 0; font-size: 1.1em; color: #ccc; }
             .sig-helper-modal-settings label:not(.sig-helper-settings-label-checkbox) { display: block; margin-bottom: 3px; font-size: 0.9em; color: #ccc; }
             .sig-helper-settings-input { width: 100%; padding: 6px 8px; margin-bottom: 8px; border: 1px solid var(--border-color); border-radius: 3px; background-color: var(--bg-color); color: var(--input-text); font-size: 1em; font-family: inherit; box-sizing: border-box; }
             .sig-helper-modal-settings textarea.sig-helper-settings-input { resize: vertical; min-height: 40px; }
             .sig-helper-settings-label-checkbox { display: flex; align-items: center; margin-top: 5px; font-size: 0.95em; cursor: pointer; }
             .sig-helper-settings-label-checkbox input[type="checkbox"] { margin-right: 8px; cursor: pointer; }

             /* Form Styling (Appears below main area) */
             .sig-helper-modal-form {
                display: none; /* Initially hidden */
                flex-direction: column;
                gap: 10px;
                padding: 15px 20px;
                border-top: 1px solid var(--border-color);
                background-color: var(--bg-color); /* Same as modal content */
                /* max-height: 60%; /* Limit form height */
                overflow-y: auto; /* Scroll form content if needed */
                flex-shrink: 0; /* Prevent form from shrinking */
                box-shadow: 0 -5px 15px rgba(0,0,0,0.3); /* Visual separation */
                z-index: 5; /* Ensure form is above main area if overlap occurs (shouldn't) */
                scrollbar-color: var(--scrollbar-thumb-bg) var(--scrollbar-track-bg);
                scrollbar-width: thin;
             }
             .sig-helper-modal-form::-webkit-scrollbar { width: 8px; }
             .sig-helper-modal-form::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb-bg); border-radius: 4px;}
             .sig-helper-modal-form h3 { margin-top: 0; margin-bottom: 10px; }
             .sig-helper-modal-form label { display: block; margin-bottom: 3px; font-weight: bold; color: #ccc; font-size: 0.9em; }
             .sig-helper-modal-form input[type="text"],
             .sig-helper-modal-form input[list], /* Style datalist input */
             .sig-helper-modal-form textarea { width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 3px; background-color: var(--input-bg); color: var(--input-text); font-size: 1em; font-family: inherit; box-sizing: border-box; }
             .sig-helper-modal-form textarea { resize: vertical; min-height: 100px; }

             /* Global Styles Controls */
             .sig-helper-global-style-controls { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; flex-wrap: wrap; background-color: var(--input-bg); padding: 8px; border-radius: 3px; }
             .sig-helper-global-style-controls label { margin-bottom: 0; display: flex; align-items: center; gap: 5px; font-size: 0.85em; }
             .sig-helper-global-style-controls select { padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 3px; background-color: var(--bg-color); color: var(--input-text); cursor: pointer; font-size: 0.9em; max-width: 180px; }
             .sig-helper-global-style-buttons { display: flex; gap: 5px; }
             .sig-helper-global-style-button { font-weight: bold; }
             .sig-helper-global-style-button.active { background-color: var(--global-style-active-bg); color: var(--global-style-active-text); border-color: var(--global-style-active-bg); }

             /* BBCode Toolbar */
             .sig-helper-toolbar-container { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
             .sig-helper-bbcode-toolbar { display: flex; gap: 5px; flex-wrap: wrap; align-items: center; flex-grow: 1; }
             .sig-helper-bbcode-control { padding: 2px 4px; border: 1px solid var(--border-color); background-color: var(--input-bg); color: var(--input-text); border-radius: 3px; height: 26px; vertical-align: middle; }
             .sig-helper-bbcode-colorpicker { padding: 1px; width: 30px; cursor: pointer; border: none; background: none; height: 24px; width: 24px; }
              .sig-helper-toolbar-actions { display: flex; gap: 5px; flex-shrink: 0; /* Prevent action buttons wrapping unnecessarily */ }
             .sig-helper-bbcode-toolbar button, .sig-helper-toolbar-actions button { background-color: var(--button-bg); color: var(--button-text); border: 1px solid var(--border-color); }
             .sig-helper-bbcode-toolbar button:hover, .sig-helper-toolbar-actions button:hover { background-color: var(--button-hover-bg); }

             /* Form Buttons */
             .sig-helper-form-buttons { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; padding-top: 10px; border-top: 1px solid var(--border-color);} /* Add separator */
             .sig-helper-modal-form .sig-helper-form-buttons > button { padding: 8px 15px; }

            /* Common Button Styles (Small, Danger, Primary, CTA) */
            .button--small { padding: 2px 6px !important; font-size: 0.9em !important; line-height: 1.4 !important; vertical-align: middle; } /* Adjusted line-height */
            .button--danger { background-color: var(--button-danger-bg) !important; color: white !important; border-color: var(--button-danger-bg) !important; }
            .button--danger:hover { background-color: var(--button-danger-hover-bg) !important; border-color: var(--button-danger-hover-bg) !important; }
            .sig-helper-modal .button--primary { background-color: var(--button-primary-bg); border-color: var(--button-primary-bg); color: white; }
            .sig-helper-modal .button--primary:hover { background-color: var(--button-primary-hover-bg); border-color: var(--button-primary-hover-bg); }
            .sig-helper-modal .button--cta { background-color: var(--button-cta-bg); border-color: var(--button-cta-bg); color: white; }
            .sig-helper-modal .button--cta:hover { background-color: var(--button-cta-hover-bg); border-color: var(--button-cta-hover-bg); }
        `);
    }

    function initialize() {
        loadData();
        getUsername(); // Get username early if possible
        addStyles(); // Inject CSS

        let attempts = 0;
        const checkInterval = setInterval(() => {
            const currentEditor = findEditorElement();
            if (currentEditor) {
                clearInterval(checkInterval);
                editorElement = currentEditor;
                createMainUI(editorElement); // Create main UI below editor
                console.log(`Signature Helper v${CURRENT_VERSION}: Инициализация завершена.`);
            } else {
                attempts++;
                if (attempts >= MAX_EDITOR_FIND_ATTEMPTS) {
                    clearInterval(checkInterval);
                    console.warn(`Signature Helper v${CURRENT_VERSION}: Редактор не найден после ${MAX_EDITOR_FIND_ATTEMPTS} попыток.`);
                }
            }
        }, EDITOR_FIND_INTERVAL);
    }

    // Wait for the page to be fully loaded or interactive before initializing
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initialize, 350); // Small delay to ensure dynamic elements load
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 350));
    }

})();
