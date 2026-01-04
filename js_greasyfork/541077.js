// ==UserScript==
// @name        Admins Response Templates (Forum LIVE RUSSIA)
// @namespace   https://forum.liverussia.online
// @version      4.3.4
// @description  Расширенные настройки: сортировка, редактирование, автоотправка, автоочистка и др. Автор: HELLIX
// @author       HELLIX
// @match        https://forum.liverussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541077/Admins%20Response%20Templates%20%28Forum%20LIVE%20RUSSIA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541077/Admins%20Response%20Templates%20%28Forum%20LIVE%20RUSSIA%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const STORAGE_KEY = 'lr_admin_templates_categorized';
    const THEME_STORAGE_KEY = 'lr_admin_theme';
    const AUTO_SUBMIT_STORAGE_KEY = 'lr_admin_auto_submit';
    const SHOW_SWIPE_BUTTONS_STORAGE_KEY = 'lr_admin_show_swipe_buttons';
    const DEFAULT_TEMPLATES = {
        'Основные': [
            { name: 'Приветствие', text: 'Всем привет!' },
            { name: 'Спасибо', text: 'Спасибо за сообщение!' }
        ]
    };

    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    const buttonStyle = `
        .lr-admin-button {
            background-color: #5cb85c;
            color: white;
            border: 1px solid #4cae4c;
            padding: 8px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            line-height: 1.42857143;
            display: inline-block;

            width: 120px;
            height: 34px;
            box-sizing: border-box;
            text-align: center;

            margin: 0;
            transition: background-color 0.2s, border-color 0.2s;
        }

        .lr-admin-button:hover {
            background-color: #449d44;
            border-color: #398439;
        }

        .lr-admin-button-highlight {
            background-color: #337ab7;
            border-color: #2e6da4;
        }

        .lr-admin-button-highlight:hover {
            background-color: #286090;
            border-color: #204d74;
        }

        .lr-admin-button-danger {
            background-color: #d9534f;
            border-color: #d43f3a;
        }

        .lr-admin-button-danger:hover {
            background-color: #c9302c;
            border-color: #ac2925;
        }

        .lr-dropdown-menu {
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 6px 10px;
            min-width: 260px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-size: 14px;
            font-family: Arial, sans-serif;
            color: #222;
        }

        .lr-dropdown-menu.dark {
            background-color: #333;
            border-color: #555;
            color: #eee;
        }

        .lr-dropdown-menu .item {
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .lr-dropdown-menu .item:hover {
            background-color: #eee;
        }

        .lr-dropdown-menu.dark .item:hover {
            background-color: #555;
        }

        .lr-toggle {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 24px;
        }

        .lr-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .lr-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }

        .lr-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .lr-slider {
            background-color: #2196F3;
        }

        input:focus + .lr-slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .lr-slider:before {
            transform: translateX(36px);
        }

        .lr-slider.round {
            border-radius: 34px;
        }

        .lr-slider.round:before {
            border-radius: 50%;
        }

        .lr-template-textarea {
            font-family: monospace;
        }

        .lr-admin-button-small {
            padding: 4px 8px;
            font-size: 12px;
            width: auto;
            height: 26px;
            box-sizing: border-box;
            text-align: center;
            line-height: 18px;
            cursor: pointer;
            border: 1px solid transparent;
            background-color: transparent;
            color: inherit;
            transition: background-color 0.2s, color 0.2s;
        }

        .lr-admin-button-small:hover {
            background-color: rgba(0, 0, 0, 0.1);
            color: inherit;
        }

        .lr-draggable {
            cursor: move;
            position: relative;
        }

        .lr-drag-handle {
            cursor: grab;
            margin-right: 5px;
        }

        .lr-draggable:hover .lr-admin-button-small,
        .lr-draggable.active .lr-admin-button-small {
            opacity: 1;
        }

        .lr-template-container {
            position: relative;
            margin-bottom: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 6px 10px;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            gap: 6px;
            overflow: hidden;
        }

        .lr-template-container.dragging {
            cursor: grabbing;
        }

        .lr-template-buttons {
            position: absolute;
            top: 0;
            right: -160px;
            width: 160px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-around;
            background-color: rgba(255, 255, 255, 0.8);
            transition: right 0.3s ease-in-out;
            z-index: 2;
        }

        .lr-template-container:hover .lr-template-buttons,
        .lr-template-container.dragging .lr-template-buttons {
            right: 0;
        }
    `;
    addGlobalStyle(buttonStyle);

    function createButton(text, title, className) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        btn.title = title;
        btn.className = `lr-admin-button ${className || ''}`;
        return btn;
    }

    function insertText(editor, text) {
        if (!editor) return;
        editor.focus();
        try {
            if (editor.tagName === 'TEXTAREA') {
                const start = editor.selectionStart || 0;
                const end = editor.selectionEnd || 0;
                const val = editor.value;
                editor.value = val.substring(0, start) + text + val.substring(end);
                editor.selectionStart = editor.selectionEnd = start + text.length;
                editor.dispatchEvent(new InputEvent('input', { bubbles: true }));
            } else if (editor.isContentEditable) {
                document.execCommand('insertText', false, text);
            }
        } catch (error) {
            console.error('Error inserting text:', error);
        }
    }

    function getTemplates() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    }

    function setTemplates(templates) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    }

    function isDarkMode() {
        const setting = localStorage.getItem(THEME_STORAGE_KEY) || 'auto';
        if (setting === 'dark') return true;
        if (setting === 'light') return false;
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    }

    function showAlert(message) {
        alert(message);
    }

    function openManageDialog() {
        const templates = getTemplates();
        const dark = isDarkMode();

        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
            position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
            padding: '20px', zIndex: 2000,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)', borderRadius: '8px',
            maxWidth: '90%', maxHeight: '70%', overflowY: 'auto',
            backgroundColor: dark ? '#222' : '#fff', color: dark ? '#fff' : '#000',
            fontFamily: 'Arial, sans-serif', display: 'flex', gap: '20px', minWidth: '600px'
        });

        const catPanel = document.createElement('div');
        catPanel.style.minWidth = '180px';
        catPanel.style.borderRight = dark ? '1px solid #555' : '1px solid #ccc';
        catPanel.style.paddingRight = '10px';

        const catTitle = document.createElement('h3');
        catTitle.textContent = 'Категории';
        catPanel.appendChild(catTitle);

        const catList = document.createElement('ul');
        catList.style.listStyle = 'none';
        catList.style.padding = '0';
        catList.style.margin = '0';

        const addCategoryBtn = createButton('+ Категория', 'Добавить новую категорию');
        addCategoryBtn.style.margin = '10px 0';
        catPanel.appendChild(catList);
        catPanel.appendChild(addCategoryBtn);

        const tmplPanel = document.createElement('div');
        tmplPanel.style.flexGrow = '1';
        tmplPanel.style.paddingLeft = '10px';

        const tmplTitle = document.createElement('h3');
        tmplPanel.appendChild(tmplTitle);

        const tmplList = document.createElement('div');
        tmplPanel.appendChild(tmplList);

        const addTemplateBtn = createButton('+ Шаблон', 'Добавить новый шаблон');
        addTemplateBtn.style.marginTop = '10px';
        tmplPanel.appendChild(addTemplateBtn);

        let selectedCategory = null;

        function dragStart(event) {
            event.dataTransfer.setData('text', event.target.dataset.category);
        }

        function dragOver(event) {
            event.preventDefault();
        }

        function drop(event) {
            event.preventDefault();
            const fromCategory = event.dataTransfer.getData('text');
            const toCategory = event.target.dataset.category;

            if (fromCategory === toCategory) return;

            const temp = {};
            Object.keys(templates).forEach(cat => {
                if (cat === toCategory) {
                    temp[fromCategory] = templates[fromCategory];
                }
                if (cat !== fromCategory) {
                    temp[cat] = templates[cat];
                }
            });

            if (!temp[fromCategory]) {
                temp[fromCategory] = templates[fromCategory];
            }

            setTemplates(temp);
            rebuildCategoryList();
            selectCategory(fromCategory);
        }

        function rebuildCategoryList() {
            catList.innerHTML = '';
            Object.keys(templates).forEach(cat => {
                const li = document.createElement('li');
                li.textContent = cat;
                li.style.padding = '6px 10px';
                li.style.cursor = 'pointer';
                li.style.borderRadius = '4px';
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.classList.add('lr-draggable');
                li.draggable = true;
                li.dataset.category = cat;
                li.addEventListener('dragstart', dragStart);
                li.addEventListener('dragover', dragOver);
                li.addEventListener('drop', drop);

                const dragHandle = document.createElement('span');
                dragHandle.innerHTML = '&#9776;';
                dragHandle.className = 'lr-drag-handle';
                li.prepend(dragHandle);

                const renameBtn = createButton('Переименовать', 'Переименовать категорию', 'lr-admin-button-small');
                renameBtn.onclick = (e) => {
                    e.stopPropagation();
                    const newName = prompt('Введите новое название категории', cat);
                    if (newName && newName !== cat && !templates[newName]) {
                        templates[newName] = templates[cat];
                        delete templates[cat];
                        setTemplates(templates);
                        selectedCategory = newName;
                        rebuildCategoryList();
                        selectCategory(newName);
                    }
                };
                li.appendChild(renameBtn);

                const delBtn = createButton('Удалить', 'Удалить категорию', 'lr-admin-button-danger lr-admin-button-small');
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
                        delete templates[cat];
                        setTemplates(templates);
                        selectedCategory = null;
                        rebuildCategoryList();
                        tmplList.innerHTML = '';
                    }
                };
                li.appendChild(delBtn);

                li.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    document.querySelectorAll('.lr-draggable').forEach(el => {
                        el.classList.remove('active');
                    });

                    this.classList.add('active');

                    selectCategory(cat);
                });

                if (cat === selectedCategory) li.style.backgroundColor = dark ? '#555' : '#eee';

                catList.appendChild(li);
            });
        }

        function selectCategory(category) {
            selectedCategory = category;
            tmplTitle.textContent = `Шаблоны категории: ${category}`;
            rebuildCategoryList();
            tmplList.innerHTML = '';
            const showSwipeButtons = localStorage.getItem(SHOW_SWIPE_BUTTONS_STORAGE_KEY) === 'true';
            (templates[category] || []).forEach((template, idx) => {
                const container = document.createElement('div');
                container.classList.add('lr-template-container');
                container.style.cssText = `margin-bottom:12px;border:1px solid ${dark ? '#444' : '#ccc'};border-radius:6px;padding:6px 10px;background:${dark ? '#333' : '#f9f9f9'};display:flex;flex-direction:column;gap:6px;position:relative; overflow: hidden;`;

                const nameInput = document.createElement('input');
                nameInput.addEventListener('input', () => {
                templates[category][idx].name = nameInput.value;
                setTemplates(templates);
                });
                nameInput.value = template.name;
                nameInput.placeholder = 'Название шаблона';
                nameInput.style.marginBottom = '5px';

                const textArea = document.createElement('textarea');
                textArea.addEventListener('input', () => {
                templates[category][idx].text = textArea.value;
                setTemplates(templates);
});
                textArea.value = template.text;
                textArea.rows = 4;
                textArea.className = 'lr-template-textarea';
                textArea.placeholder = 'Текст шаблона';

                const buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('lr-template-buttons');
                buttonsDiv.style.cssText = 'position: absolute; top: 0; right: -160px; width: 160px; height: 100%; display: flex; align-items: center; justify-content: space-around; background-color: rgba(255, 255, 255, 0.8); transition: right 0.3s ease-in-out;';

                const renameBtn = createButton('Переименовать', 'Переименовать шаблон', 'lr-admin-button-small');
                const delBtn = createButton('Удалить', 'Удалить шаблон', 'lr-admin-button-danger lr-admin-button-small');
                delBtn.style.width = 'auto';
                renameBtn.style.width = 'auto';

                renameBtn.onclick = () => {
                    const newName = prompt('Введите новое название шаблона', template.name);
                    if (newName) {
                        templates[category][idx].name = newName;
                        setTemplates(templates);
                        selectCategory(category);
                    }
                };
                delBtn.onclick = () => {
                    if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
                        templates[category].splice(idx, 1);
                        setTemplates(templates);
                        selectCategory(category);
                    }
                };
                if (showSwipeButtons) {
                buttonsDiv.append(renameBtn, delBtn);
                }
                container.append(nameInput, textArea, buttonsDiv);
                tmplList.appendChild(container);
            });
        }

        addCategoryBtn.onclick = () => {
            const name = prompt('Введите название новой категории');
            if (!name || templates[name]) return;
            templates[name] = [];
            setTemplates(templates);
            rebuildCategoryList();
            selectCategory(name);
        };

        addTemplateBtn.onclick = () => {
            if (!selectedCategory) return alert('Выберите категорию');
            const name = prompt('Введите название шаблона');
            if (!name) return;
            templates[selectedCategory].push({ name, text: '' });
            setTemplates(templates);
            selectCategory(selectedCategory);
        };

        const closeBtn = createButton('Закрыть', 'Закрыть');
        closeBtn.style.backgroundColor = dark ? '#444' : '#ccc';
        closeBtn.onclick = () => document.body.removeChild(wrapper);

        wrapper.append(catPanel, tmplPanel, closeBtn);
        rebuildCategoryList();

        if (selectedCategory) {
            selectCategory(selectedCategory);
        } else if (Object.keys(templates).length > 0) {
            selectCategory(Object.keys(templates)[0]);
        }
        document.body.appendChild(wrapper);
    }

    function openSettingsDialog() {
        const dark = isDarkMode();

        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
            position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
            padding: '20px', zIndex: 2000,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)', borderRadius: '8px',
            maxWidth: '90%', maxHeight: '70%', overflowY: 'auto',
            backgroundColor: dark ? '#222' : '#fff', color: dark ? '#fff' : '#000',
            fontFamily: 'Arial, sans-serif', display: 'flex', gap: '20px', minWidth: '600px'
        });

        const catPanel = document.createElement('div');
        catPanel.style.minWidth = '180px';
        catPanel.style.borderRight = dark ? '1px solid #555' : '1px solid #ccc';
        catPanel.style.paddingRight = '10px';

        const catTitle = document.createElement('h3');
        catTitle.textContent = 'Настройки';
        catPanel.appendChild(catTitle);

        const infoDiv = document.createElement('div');
        infoDiv.style.marginBottom = '20px';
        infoDiv.innerHTML = `
            <strong>О скрипте:</strong><br>
            Версия: <code>4.3.4</code><br>
            Автор: <a href="https://forum.liverussia.online/index.php?members/lucifer_hellix.11771/" target="_blank">HELLIX</a><br>
            Назначение: Упрощение вставки шаблонных ответов администраторами форума.<br>
        `;
        catPanel.appendChild(infoDiv);

        const tmplPanel = document.createElement('div');
        tmplPanel.style.flexGrow = '1';
        tmplPanel.style.paddingLeft = '10px';

        const tmplTitle = document.createElement('h3');
        tmplTitle.textContent = 'Параметры:';
        tmplPanel.appendChild(tmplTitle);

        const tmplList = document.createElement('div');
        tmplList.style.display = 'flex';
        tmplList.style.flexDirection = 'column';
        tmplList.style.gap = '20px';
        tmplPanel.appendChild(tmplList);

        const autoSubmitDiv = document.createElement('div');
        autoSubmitDiv.style.display = 'flex';
        autoSubmitDiv.style.alignItems = 'center';
        autoSubmitDiv.style.justifyContent = 'space-between';

        const autoSubmitLabel = document.createElement('label');
        autoSubmitLabel.textContent = 'Автоотправка:';
        autoSubmitLabel.style.marginRight = '10';

        const autoSubmitToggle = document.createElement('label');
        autoSubmitToggle.classList.add('lr-toggle');
        const autoSubmitInput = document.createElement('input');
        autoSubmitInput.type = 'checkbox';
        autoSubmitInput.checked = localStorage.getItem(AUTO_SUBMIT_STORAGE_KEY) === 'true';
        autoSubmitInput.onchange = () => {
            localStorage.setItem(AUTO_SUBMIT_STORAGE_KEY, autoSubmitInput.checked);
        };
        const autoSubmitSlider = document.createElement('span');
        autoSubmitSlider.classList.add('lr-slider', 'round');
        autoSubmitToggle.appendChild(autoSubmitInput);
        autoSubmitToggle.appendChild(autoSubmitSlider);

        autoSubmitDiv.appendChild(autoSubmitLabel);
        autoSubmitDiv.appendChild(autoSubmitToggle);
        tmplList.appendChild(autoSubmitDiv);

  const showSwipeButtonsDiv = document.createElement('div');
        showSwipeButtonsDiv.style.display = 'flex';
        showSwipeButtonsDiv.style.alignItems = 'center';
        showSwipeButtonsDiv.style.justifyContent = 'space-between';

        const showSwipeButtonsLabel = document.createElement('label');
        showSwipeButtonsLabel.textContent = 'переименовать/удалить:';
        showSwipeButtonsLabel.style.marginRight = '5px';

        const showSwipeButtonsToggle = document.createElement('label');
        showSwipeButtonsToggle.classList.add('lr-toggle');

        const showSwipeButtonsInput = document.createElement('input');
        showSwipeButtonsInput.type = 'checkbox';
        showSwipeButtonsInput.checked = localStorage.getItem(SHOW_SWIPE_BUTTONS_STORAGE_KEY) === 'true';
        showSwipeButtonsInput.onchange = () => {
            localStorage.setItem(SHOW_SWIPE_BUTTONS_STORAGE_KEY, showSwipeButtonsInput.checked);

           selectCategory(selectedCategory);
        };
        const showSwipeButtonsSlider = document.createElement('span');
        showSwipeButtonsSlider.classList.add('lr-slider', 'round');


        showSwipeButtonsToggle.appendChild(showSwipeButtonsInput);
        showSwipeButtonsToggle.appendChild(showSwipeButtonsSlider);

        showSwipeButtonsDiv.appendChild(showSwipeButtonsLabel);
        showSwipeButtonsDiv.appendChild(showSwipeButtonsToggle);
        tmplList.appendChild(showSwipeButtonsDiv);


        const themeDiv = document.createElement('div');
        themeDiv.style.display = 'flex';
        themeDiv.style.flexDirection = 'column';
        themeDiv.style.alignItems = 'flex-start';
        themeDiv.style.gap = '4px';
        themeDiv.style.marginTop = '10px';


        const themeLabel = document.createElement('label');
        themeLabel.textContent = 'Тема:';
        themeLabel.style.marginRight = '5px';

        const themeSelect = document.createElement('select');
        themeSelect.style.padding = '6px 12px';
        themeSelect.style.borderRadius = '6px';
        themeSelect.style.border = '1px solid #ccc';
        themeSelect.style.minWidth = '140px';
        themeSelect.style.maxWidth = '200px';
        themeSelect.style.marginLeft = '10px';
        themeSelect.style.marginTop = '4px';
        themeSelect.style.backgroundColor = dark ? '#444' : '#fff';
        themeSelect.style.color = dark ? '#eee' : '#222';
        themeSelect.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
        themeSelect.style.fontSize = '14px';
        themeSelect.innerHTML = `
            <option value="auto" ${localStorage.getItem(THEME_STORAGE_KEY) === 'auto' ? 'selected' : ''}>Авто</option>
            <option value="light" ${localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'selected' : ''}>Светлая</option>
            <option value="dark" ${localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'selected' : ''}>Тёмная</option>`;
        themeSelect.onchange = () => {
            localStorage.setItem(THEME_STORAGE_KEY, themeSelect.value);
            location.reload();
        };

        themeDiv.appendChild(themeLabel);
        themeDiv.appendChild(themeSelect);
        tmplList.appendChild(themeDiv);

        const exportImportDiv = document.createElement('div');
        exportImportDiv.style.display = 'flex';
        exportImportDiv.style.flexDirection = 'row';
        exportImportDiv.style.gap = '10px';

        const exportBtn = createButton('Экспорт', 'Экспорт шаблонов в JSON файл');
        exportBtn.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getTemplates()));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "admin_templates.json");
            dlAnchorElem.click();
        };

        const importBtn = createButton('Импорт', 'Импорт шаблонов из JSON файла');
        importBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const json = JSON.parse(event.target.result);
                        if (typeof json === 'object' && json !== null) {
                            if (confirm('Вы уверены, что хотите заменить текущие шаблоны на импортированные?')) {
                                setTemplates(json);
                                alert('Шаблоны успешно импортированы');
                                location.reload();
                            }
                        } else {
                            alert('Неверный формат файла. Ожидается JSON объект.');
                        }
                    } catch (error) {
                        alert('Ошибка при чтении файла: ' + error.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        };

        exportImportDiv.appendChild(exportBtn);
        exportImportDiv.appendChild(importBtn);
        tmplList.appendChild(exportImportDiv);

        const saveBtn = createButton('Сохранить', 'Сохранить изменения');
        Object.assign(saveBtn.style, {
            marginTop: '20px',
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 32px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            border: 'none',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(0, 123, 255, 0.4)',
            transition: 'background-color 0.3s ease',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            minWidth: '140px',
            textAlign: 'center'
        });


        saveBtn.onmouseenter = () => saveBtn.style.backgroundColor = '#0069d9';
        saveBtn.onmouseleave = () => saveBtn.style.backgroundColor = '#007bff';
        saveBtn.onclick = () => {
            alert('Настройки сохранены');
        };
        tmplList.appendChild(saveBtn);


        const closeBtn = createButton('Закрыть', 'Закрыть');
        closeBtn.style.backgroundColor = dark ? '#444' : '#ccc';
        closeBtn.onclick = () => document.body.removeChild(wrapper);

        wrapper.append(catPanel, tmplPanel, closeBtn);
        document.body.appendChild(wrapper);
    }

    function main() {
        const editor = document.querySelector('textarea[name="message"], .fr-element[contenteditable="true"]');
        if (!editor) return;

        const replyButton = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ответить'));
        if (!replyButton) return;

        let container = document.querySelector('#lr_template_buttons_container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'lr_template_buttons_container';
            container.style.display = 'flex';
            container.style.gap = '12px';
            container.style.alignItems = 'center';
            container.style.marginLeft = '10px';
            replyButton.parentNode.insertBefore(container, replyButton);
        }

        const buttonWidth = replyButton.offsetWidth + 'px';

        const btnSettings = createButton('Настройки', 'Изменить тему и автоотправку', 'lr-admin-button-highlight');
        btnSettings.style.minWidth = buttonWidth;

        const btnManage = createButton('Управление', 'Управление шаблонами и категориями');
        btnManage.style.minWidth = buttonWidth;

        const btnCategories = createButton('Категории', 'Выбрать шаблон из категории');
        btnCategories.style.minWidth = buttonWidth;

        let currentDropdown = null;
        let settingsMenuOpen = false;

        btnSettings.onclick = e => {
            e.stopPropagation();
            closeDropdown();
            openSettingsDialog();
        };

        const closeDropdown = () => {
            const existing = document.getElementById('lr_category_menu');
            if (existing) existing.remove();
            currentDropdown = null;
        }

        const createCategoryDropdown = () => {
            const dropdown = document.createElement('div');
            dropdown.id = 'lr_category_menu';
            dropdown.className = `lr-dropdown-menu ${isDarkMode() ? 'dark' : ''}`;

            Object.entries(getTemplates()).forEach(([category, templates]) => {
                const catHeader = document.createElement('div');
                catHeader.textContent = category;
                catHeader.style.fontWeight = 'bold';
                catHeader.style.marginTop = '10px';
                catHeader.style.marginBottom = '4px';
                dropdown.appendChild(catHeader);

                templates.forEach(tmpl => {
                    const item = document.createElement('div');
                    item.textContent = tmpl.name;
                    item.className = 'item';
                    item.onclick = () => {
                        insertText(editor, tmpl.text);
                        if (localStorage.getItem(AUTO_SUBMIT_STORAGE_KEY) === 'true') {
                            const submit = editor.closest('form')?.querySelector('[type="submit"]');
                            if (submit) setTimeout(() => submit.click(), 100);
                        }
                        closeDropdown();
                    };
                    dropdown.appendChild(item);
                });
            });

            return dropdown;
        }

        btnManage.onclick = () => {
            closeDropdown();
            openManageDialog();
        };

        btnCategories.onclick = e => {
            e.stopPropagation();

            if (currentDropdown) {
                closeDropdown();
                return;
            }

            const dropdown = createCategoryDropdown();
            currentDropdown = dropdown;
            container.appendChild(dropdown);
        };

        document.addEventListener('click', () => {
            closeDropdown();
        });

        [btnSettings, btnManage, btnCategories].forEach(btn => container.appendChild(btn));
    }

    setTimeout(main, 1000);
})();