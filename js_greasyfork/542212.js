// ==UserScript==
// @name         AS Notebook
// @namespace    https://animestars.org
// @version      2.8
// @description  Записная книжка с группами, ссылками, поиском и встроенными кнопками. Сохраняет состояние окна, групп и скролла.
// @author       Sandr
// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @match        https://as2.asstars.tv/*
// @match        https://asstars.online/*
// @noframes
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542212/AS%20Notebook.user.js
// @updateURL https://update.greasyfork.org/scripts/542212/AS%20Notebook.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DATA_STORAGE_KEY = 'notebookData';
    const STATE_STORAGE_KEY = 'notebookState'; // Ключ для хранения состояния (окно, группы, скролл)

    let data = GM_getValue(DATA_STORAGE_KEY, {});

    // --- Управление состоянием интерфейса ---
    // Получаем состояние из sessionStorage (сбрасывается при закрытии вкладки)
    function getNotebookState() {
        try {
            const state = JSON.parse(sessionStorage.getItem(STATE_STORAGE_KEY));
            return state || { isModalOpen: false, expandedGroups: [], scrollPosition: 0 };
        } catch (e) {
            return { isModalOpen: false, expandedGroups: [], scrollPosition: 0 };
        }
    }

    let notebookState = getNotebookState();

    function saveNotebookState() {
        sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(notebookState));
    }
    // --- Конец управления состоянием ---

    function saveData() {
        GM_setValue(DATA_STORAGE_KEY, data);
    }

    // Функция для задержки выполнения (используется для сохранения скролла)
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }


function addButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '📓';
    btn.id = 'notebookToggleButton'; // <--- ИЗМЕНЕНИЕ 1: Добавлен ID
    btn.title = 'Твой личный архив "А вдруг пригодится?"';
    btn.style = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(52, 152, 219, 0.25);
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(8px);
        font-size: 24px;
        color: white;
        cursor: pointer;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    btn.onclick = () => {
        const existing = document.getElementById('notebookModal');
        if (existing) {
            existing.remove();
            notebookState.isModalOpen = false;
        } else {
            openModal();
            notebookState.isModalOpen = true;
        }
        saveNotebookState();
    };
    document.body.appendChild(btn);

    // ИЗМЕНЕНИЕ 2: Добавлен блок со стилями
    if (!document.getElementById('notebook-fscr-styles')) {
        const style = document.createElement('style');
        style.id = 'notebook-fscr-styles';
        style.textContent = `
            /* Когда у body появляется класс fscr-active, скрываем кнопку блокнота */
            body.fscr-active #notebookToggleButton {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

    function openDialog(options) {
        // ... (Ваша функция openDialog без изменений) ...
        return new Promise((resolve) => {
            const existing = document.getElementById('dialogModal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'dialogModal';
            modal.style = `
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000000;
                font-family: Arial, sans-serif;
            `;

            const box = document.createElement('div');
            box.style = `
                background: #222831;
                padding: 20px;
                border-radius: 10px;
                width: 320px;
                color: white;
                box-shadow: 0 8px 24px rgba(0,0,0,0.8);
            `;

            if (options.title) {
                const title = document.createElement('div');
                title.textContent = options.title;
                title.style = 'font-weight: bold; font-size: 18px; margin-bottom: 12px;';
                box.appendChild(title);
            }

            const form = document.createElement('form');
            form.style = 'display: flex; flex-direction: column; gap: 12px;';

            const inputs = {};

            if (options.fields && options.fields.length) {
                options.fields.forEach(f => {
                    const label = document.createElement('label');
                    label.style = 'display: flex; flex-direction: column; font-size: 14px;';
                    label.textContent = f.label;
                    const input = document.createElement(f.type === 'textarea' ? 'textarea' : 'input');
                    input.type = f.type || 'text';
                    input.value = f.value || '';
                    input.style = `
                        margin-top: 6px;
                        padding: 6px;
                        border-radius: 5px;
                        border: none;
                        font-size: 14px;
                        resize: vertical;
                    `;
                    if (f.type === 'textarea') {
                        input.rows = 2;
                    }
                    label.appendChild(input);
                    form.appendChild(label);
                    inputs[f.label] = input;
                });
            } else if (options.message) {
                const msg = document.createElement('div');
                msg.textContent = options.message;
                msg.style = 'margin-bottom: 20px; font-size: 15px;';
                box.appendChild(msg);
            }

            const buttonsDiv = document.createElement('div');
            buttonsDiv.style = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;';

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Отмена';
            cancelBtn.style = `
                background: #b33939;
                border: none;
                padding: 6px 14px;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                font-weight: bold;
            `;
            cancelBtn.onclick = () => {
                modal.remove();
                resolve(null);
            };

            const okBtn = document.createElement('button');
            okBtn.type = 'submit';
            okBtn.textContent = options.confirmText || 'OK';
            okBtn.style = `
                background: #00b894;
                border: none;
                padding: 6px 14px;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                font-weight: bold;
            `;

            buttonsDiv.appendChild(cancelBtn);
            buttonsDiv.appendChild(okBtn);

            form.appendChild(buttonsDiv);

            form.onsubmit = (e) => {
                e.preventDefault();
                const results = {};
                if (options.fields && options.fields.length) {
                    for (const f of options.fields) {
                        const val = inputs[f.label].value.trim();
                        if (f.required && !val) {
                            alert(`Пожалуйста, заполните поле "${f.label}"`);
                            return;
                        }
                        results[f.label] = val;
                    }
                    modal.remove();
                    resolve(results);
                } else {
                    modal.remove();
                    resolve(true);
                }
            };

            box.appendChild(form);
            modal.appendChild(box);
            document.body.appendChild(modal);

            if (options.fields && options.fields.length) {
                inputs[options.fields[0].label].focus();
            }
        });
    }

    function showMessage(message, title = 'Сообщение') {
        return openDialog({title, message, confirmText: 'Закрыть'});
    }

    function openModal() {
        const modal = document.createElement('div');
        modal.id = 'notebookModal';
        modal.style = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 320px;
            height: 90vh;
            background: rgba(25,25,35,0.75);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            color: #fff;
            z-index: 1000000;
        `;
        modal.innerHTML = `
            <div style="padding: 10px; display:flex; align-items:center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span style="font-weight:bold">Блокнот 3000</span>
                <button id="addGroupBtn" title="Добавить новую группу" style="background:#3498db; border:none; border-radius:4px; padding:2px 8px; color:#fff; cursor:pointer; margin-right:10px;">+ Группа</button>
                <button id="nbClose" title="Закрыть окно" style="background:none;border:none;color:white;cursor:pointer;font-size:18px">✖️</button>
            </div>
            <div id="groupsList" style="flex:1; overflow-y:auto; padding: 10px;"></div>
            <div style="padding:10px; border-top:1px solid rgba(255,255,255,0.1);">
                <input id="searchInput" type="text" placeholder="Поиск..." style="width:100%; padding:6px; border-radius:6px; border:none; background:#2c3e50; color:#fff;">
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('nbClose').onclick = () => {
            modal.remove();
            notebookState.isModalOpen = false;
            saveNotebookState();
        };
        document.getElementById('searchInput').oninput = renderGroups;

        // Сохраняем позицию скролла с небольшой задержкой, чтобы не нагружать систему
        const groupsList = document.getElementById('groupsList');
        groupsList.onscroll = debounce(() => {
            notebookState.scrollPosition = groupsList.scrollTop;
            saveNotebookState();
        }, 250);

       const importBtn = document.createElement('button');
       importBtn.textContent = '📂 Импорт';
       importBtn.title = 'Загрузить группу из файла';
       importBtn.style = 'background:#8e44ad; border:none; border-radius:4px; padding:2px 8px; color:#fff; cursor:pointer;';

       importBtn.onclick = () => {
           const input = document.createElement('input');
           input.type = 'file';
           input.accept = 'application/json';
           input.onchange = async (e) => {
               const file = e.target.files[0];
               if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            if (!parsed.items || !Array.isArray(parsed.items)) {
                await showMessage('Файл не содержит корректных данных.', 'Ошибка');
                return;
            }

            const defaultName = file.name.replace(/^notebook-/, '').replace(/\.json$/i, '');

            let groupName = defaultName;
            let counter = 1;
            while (data[groupName]) {
                groupName = `${defaultName} (${counter++})`;
            }

            data[groupName] = parsed.items;
            saveData();
            renderGroups();

        } catch (err) {
            await showMessage('Ошибка при чтении файла.', 'Ошибка');
        }
    };
    input.click();
};

        document.getElementById('addGroupBtn').after(importBtn);

        document.getElementById('addGroupBtn').onclick = async () => {
            const result = await openDialog({
                title: 'Добавить новую группу',
                fields: [{label: 'Название группы:', type: 'text', required: true}],
                confirmText: 'Добавить'
            });
            if (result) {
                const groupName = result['Название группы:'];
                if (data[groupName]) {
                    await showMessage('Группа с таким именем уже существует.', 'Ошибка');
                } else {
                    data[groupName] = [];
                    saveData();
                    renderGroups();
                }
            }
        };

        renderGroups();

        // Восстанавливаем скролл после рендера
        setTimeout(() => {
            if (groupsList && notebookState.scrollPosition) {
                groupsList.scrollTop = notebookState.scrollPosition;
            }
        }, 0);
    }

    async function renderGroups() {
        const container = document.getElementById('groupsList');
        if (!container) return; // Выходим, если контейнер не найден

        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        container.innerHTML = '';

        for (const [group, items] of Object.entries(data)) {
            const matches = query ? items.some(i => i.title.toLowerCase().includes(query)) : true;
            if (!matches) continue;

            const wrapper = document.createElement('div');
            wrapper.style = 'margin-bottom:10px;';

            const groupHeader = document.createElement('div');
            groupHeader.style = 'display: flex; justify-content: space-between; align-items:center; background:#34495e; padding:6px; border-radius:6px; cursor: pointer;'; // Добавлен cursor:pointer

            const title = document.createElement('span');
            title.textContent = group;
            title.style = 'font-weight:bold; flex-grow: 1; pointer-events: none;'; // pointer-events: none чтобы клик проходил на родителя

            const buttons = document.createElement('div');
            buttons.style = 'display:flex; gap:4px;';

            const addBtn = document.createElement('button');
            addBtn.textContent = '+';
            addBtn.title = 'Добавить запись';
            addBtn.style = 'background:#27ae60;border:none;border-radius:4px;padding:2px 11px;cursor:pointer;color:#fff;';
            addBtn.onclick = async (e) => {
                e.stopPropagation();
                const result = await openDialog({
                    title: `Добавить запись в группу "${group}"`,
                    fields: [
                        {label: 'Название записи:', type: 'text', required: true},
                        {label: 'Ссылка:', type: 'text', value: window.location.href, required: true}
                    ],
                    confirmText: 'Добавить'
                });
                if (result) {
                    data[group] = data[group] || [];
                    data[group].push({title: result['Название записи:'], url: result['Ссылка:']});
                    saveData();
                    renderGroups();
                }
            };

            const delBtn = document.createElement('button');
                  const editGroupBtn = document.createElement('button');
        editGroupBtn.textContent = '✏️';
        editGroupBtn.title = 'Переименовать группу';
        editGroupBtn.style = 'background:#f39c12;border:none;border-radius:4px;padding:2px 6px;cursor:pointer;color:#fff;';
        editGroupBtn.onclick = async (e) => {
            e.stopPropagation(); // Не даем группе свернуться при клике
            const result = await openDialog({
                title: `Переименовать группу`,
                fields: [{label: 'Новое название:', type: 'text', value: group, required: true}],
                confirmText: 'Сохранить'
            });

            if (result) {
                const newGroupName = result['Новое название:'];
                if (data[newGroupName] && newGroupName !== group) {
                    await showMessage('Группа с таким именем уже существует.', 'Ошибка');
                    return;
                }

                // Переименовываем ключ в объекте data
                if (newGroupName !== group) {
                    data[newGroupName] = data[group];
                    delete data[group];

                    // Обновляем состояние развернутых групп
                    const expandedIndex = notebookState.expandedGroups.indexOf(group);
                    if (expandedIndex > -1) {
                        notebookState.expandedGroups[expandedIndex] = newGroupName;
                        saveNotebookState();
                    }

                    saveData();
                    renderGroups();
                }
            }
        };
            delBtn.textContent = '🗑️';
            delBtn.title = 'Удалить группу';
            delBtn.style = 'background:#e74c3c;border:none;border-radius:4px;padding:2px 6px;cursor:pointer;color:#fff;';
            delBtn.onclick = async (e) => {
                e.stopPropagation();
                const result = await openDialog({
                    title: `Подтверждение удаления группы "${group}"`,
                    message: `Введите название группы для подтверждения удаления:`,
                    fields: [{label: 'Название группы:', type: 'text', required: true}],
                    confirmText: 'Удалить'
                });
                if (result) {
                    if (result['Название группы:'] === group) {
                        delete data[group];
                        // Удаляем группу из списка развернутых, если она там была
                        const index = notebookState.expandedGroups.indexOf(group);
                        if (index > -1) {
                            notebookState.expandedGroups.splice(index, 1);
                            saveNotebookState();
                        }
                        saveData();
                        renderGroups();
                    } else {
                        await showMessage('Название не совпадает. Отмена.', 'Ошибка');
                    }
                }
            };

        buttons.appendChild(addBtn);
        buttons.appendChild(editGroupBtn);
        buttons.appendChild(delBtn);

            groupHeader.appendChild(title);
            groupHeader.appendChild(buttons);

            const listDiv = document.createElement('div');
            listDiv.style.marginTop = '5px';

            // ПУНКТ 2: Замена DIV на A для стандартного поведения ссылок
            items.forEach((entry, index) => {
                if (query && !entry.title.toLowerCase().includes(query)) return;

                const row = document.createElement('a'); // Используем тег <a>
                try {
                const url = new URL(entry.url);
                  row.href = location.origin + url.pathname + url.search + url.hash;
                } catch (e) {
                  row.href = entry.url; // fallback, если ссылка некорректная
               }
                row.style = `
                    padding: 6px 8px;
                    margin-bottom: 4px;
                    background: #16a085;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white; /* Убираем стандартный синий цвет ссылки */
                    text-decoration: none; /* Убираем подчеркивание */
                `;

                const titleSpan = document.createElement('span');
                titleSpan.textContent = entry.title;
                titleSpan.style.flexGrow = '1';
                // titleSpan.onclick удален, т.к. теперь это делает тег <a>

                const delEntryBtn = document.createElement('button');
                          const editEntryBtn = document.createElement('button');
            editEntryBtn.textContent = '✏️';
            editEntryBtn.title = 'Редактировать запись';
            editEntryBtn.style = 'background:#f39c12; border:none; border-radius:4px; padding:2px 6px; cursor:pointer; color:#fff; margin-left:8px;';
            editEntryBtn.onclick = async (e) => {
                e.preventDefault(); // Обязательно, т.к. кнопка внутри ссылки <a>
                e.stopPropagation();

                const result = await openDialog({
                    title: 'Редактировать запись',
                    fields: [
                        {label: 'Название записи:', type: 'text', value: entry.title, required: true},
                        {label: 'Ссылка:', type: 'text', value: entry.url, required: true}
                    ],
                    confirmText: 'Сохранить'
                });

                if (result) {
                    // Находим и обновляем нужную запись
                    data[group][index].title = result['Название записи:'];
                    data[group][index].url = result['Ссылка:'];
                    saveData();
                    renderGroups();
                }
            };
                delEntryBtn.textContent = '🗑️';
                delEntryBtn.title = 'Удалить запись';
                delEntryBtn.style = 'background:#e74c3c; border:none; border-radius:4px; padding:2px 6px; cursor:pointer; color:#fff; margin-left:8px;';
                delEntryBtn.onclick = async (e) => {
                    e.preventDefault(); // <-- ВАЖНО: Предотвращает переход по ссылке родителя (<a>)
                    e.stopPropagation();
                    const result = await openDialog({
                        title: `Подтверждение удаления записи`,
                        message: `Удалить запись "${entry.title}"?`,
                        confirmText: 'Удалить'
                    });
                    if (result) {
                        data[group].splice(index, 1);
                        saveData();
                        renderGroups();
                    }
                };

        row.appendChild(titleSpan);
        row.appendChild(editEntryBtn);
        row.appendChild(delEntryBtn);
                listDiv.appendChild(row);
            });

            // Логика разворачивания: группа развернута, если (1) пользователь ее развернул вручную
            // ИЛИ (2) идет активный поиск и в этой группе есть совпадения.
            const userHasExpanded = notebookState.expandedGroups.includes(group);
            const searchForcesExpand = query && matches; // 'query' - текст поиска, 'matches' - флаг, что в этой группе есть совпадения

            let isExpanded = userHasExpanded || searchForcesExpand;
            listDiv.style.display = isExpanded ? 'block' : 'none';

            groupHeader.oncontextmenu = async (e) => {
                e.preventDefault();

                const result = await openDialog({
                    title: 'Сохранить группу?',
                    message: `Скачать группу "${group}" как файл?`,
                    confirmText: 'Скачать'
                });

                if (!result) return;

                const blob = new Blob([JSON.stringify({ items: data[group] }, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `notebook-${group}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            };

            groupHeader.onclick = (e) => {
                // Игнорируем клики по кнопкам внутри заголовка
                if (e.target.closest('button')) {
                    return;
                }

                isExpanded = !isExpanded;
                listDiv.style.display = isExpanded ? 'block' : 'none';

                // Обновляем состояние
                const index = notebookState.expandedGroups.indexOf(group);
                if (isExpanded && index === -1) {
                    notebookState.expandedGroups.push(group);
                } else if (!isExpanded && index > -1) {
                    notebookState.expandedGroups.splice(index, 1);
                }
                saveNotebookState();
            };

            wrapper.appendChild(groupHeader);
            wrapper.appendChild(listDiv);
            container.appendChild(wrapper);
        }
    }

    addButton();

    // ПУНКТ 3: Открываем окно, если оно было открыто при перезагрузке
    if (notebookState.isModalOpen) {
        openModal();
    }


    // --- Синхронизация между вкладками ---
    window.addEventListener('focus', () => {
        const latestData = GM_getValue(DATA_STORAGE_KEY, {});
        data = latestData;
        const latestState = getNotebookState();
        notebookState = latestState;

        const modalOpen = document.getElementById('notebookModal');
        if (modalOpen) {
            renderGroups();
            // Восстанавливаем скролл после обновления данных
            const list = document.getElementById('groupsList');
            if (list) list.scrollTop = notebookState.scrollPosition;
        }
    });

    if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener(DATA_STORAGE_KEY, (name, oldValue, newValue, remote) => {
            if (remote) {
                data = newValue;
                const modalOpen = document.getElementById('notebookModal');
                if (modalOpen) renderGroups();
            }
        });
    }
// === API через message для получения данных ===
window.addEventListener("message", (ev) => {
    if (ev.data?.type === "AS_NOTEBOOK_GET_DATA") {
        const notebook = GM_getValue("notebookData", {});
        window.postMessage({
            type: "AS_NOTEBOOK_DATA_RESPONSE",
            payload: notebook
        }, "*");
    }
});
})();