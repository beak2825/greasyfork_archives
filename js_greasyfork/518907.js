// ==UserScript==
// @name         Auto Checkbox ID
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto Checkbox, скрипт для создания кнопки с выбором ID в панели управления, внизу правый угол
// @author       Retsu and ChatGPT
// @match        *://manager.univer.goldapple.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518907/Auto%20Checkbox%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/518907/Auto%20Checkbox%20ID.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Хранение сохраненных отборов
    let savedFilters = JSON.parse(localStorage.getItem('savedFilters')) || [];

    // Функция для создания всплывающего окна
    function createModal() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.padding = '20px';
        modal.style.zIndex = '10000';
        modal.style.borderRadius = '8px';
        modal.style.fontFamily = 'inherit';
        modal.style.textAlign = 'center';

        const title = document.createElement('h3');
        title.textContent = 'Введите ID через запятую';
        title.style.marginBottom = '20px';
        modal.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Например: 33934, 33935, 34233';
        input.style.width = '90%';
        input.style.marginBottom = '20px';
        input.style.padding = '8px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.fontSize = '14px';
        modal.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Выбрать чекбоксы';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.marginRight = '15px';
        button.style.fontSize = '14px';
        button.style.fontFamily = 'inherit';
        button.addEventListener('mouseover', () => button.style.backgroundColor = '#0056b3');
        button.addEventListener('mouseout', () => button.style.backgroundColor = '#007bff');
        modal.appendChild(button);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#00a8a5';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontFamily = 'inherit';
        closeButton.addEventListener('click', () => document.body.removeChild(modal));
        closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = '#0a918c');
        closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = '#00a8a5');
        modal.appendChild(closeButton);

        button.addEventListener('click', () => {
            const ids = input.value.split(',').map(id => parseInt(id.trim(), 10));
            const rows = document.querySelectorAll('tr.ek-table-row');

            rows.forEach(row => {
                const idColumn = row.querySelector('td:nth-child(2) .ek-truncate__text');
                const checkbox = row.querySelector('input[type="checkbox"]');

                if (idColumn && checkbox && ids.includes(parseInt(idColumn.textContent.trim(), 10))) {
                    checkbox.click();
                    console.log(`Выбран чекбокс для ID: "${idColumn.textContent.trim()}"`);
                }
            });

            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    }

    // Функция для создания окна с сохраненными отбороми
    function createSavedFiltersModal() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.width = '320px';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.padding = '20px';
        modal.style.zIndex = '10000';
        modal.style.borderRadius = '8px';
        modal.style.fontFamily = 'inherit';
        modal.style.textAlign = 'center';

        const title = document.createElement('h3');
        title.textContent = 'Сохраненные отборы';
        modal.appendChild(title);

        const list = document.createElement('div');
        list.style.maxHeight = '300px';
        list.style.overflowY = 'scroll';
        modal.appendChild(list);

        savedFilters.forEach((filter, index) => {
            const filterDiv = document.createElement('div');
            filterDiv.style.marginBottom = '10px';
            filterDiv.style.textAllign = 'left';
            filterDiv.style.paddingpLeft = '20px';
            filterDiv.textContent = `${index + 1}. ${filter.name}`;

            const selectButton = document.createElement('button');
            selectButton.innerHTML = '&#x2705;';
            selectButton.style.marginLeft = '10px';
            selectButton.addEventListener('click', () => {
                // Применение фильтра
                const rows = document.querySelectorAll('tr.ek-table-row');
                rows.forEach(row => {
                    const idColumn = row.querySelector('td:nth-child(2) .ek-truncate__text');
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    if (idColumn && checkbox && filter.ids.includes(parseInt(idColumn.textContent.trim(), 10))) {
                        checkbox.click();
                    }
                });
                document.body.removeChild(modal);
            });

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&#128465;';
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', () => {
                savedFilters.splice(index, 1);
                localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
                list.removeChild(filterDiv);
            });

            filterDiv.appendChild(selectButton);
            filterDiv.appendChild(deleteButton);
            list.appendChild(filterDiv);
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Добавить отбор';
        addButton.style.padding = '10px 20px';
        addButton.style.backgroundColor = '#007bff';
        addButton.style.color = '#fff';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '4px';
        addButton.style.cursor = 'pointer';
        addButton.style.marginRight = '15px';
        addButton.style.fontSize = '14px';
        addButton.style.fontFamily = 'inherit';
        addButton.addEventListener('click', () => {
            // Открытие окна для добавления нового отбора
            const addFilterModal = document.createElement('div');
            addFilterModal.style.position = 'fixed';
            addFilterModal.style.top = '50%';
            addFilterModal.style.left = '50%';
            addFilterModal.style.transform = 'translate(-50%, -50%)';
            addFilterModal.style.backgroundColor = '#fff';
            addFilterModal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            addFilterModal.style.padding = '20px';
            addFilterModal.style.zIndex = '10000';
            addFilterModal.style.borderRadius = '8px';
            addFilterModal.style.fontFamily = 'inherit';
            addFilterModal.style.textAlign = 'center';

            const addTitle = document.createElement('h3');
            addTitle.textContent = 'Добавить новый отбор';
            addFilterModal.appendChild(addTitle);

            const idInput = document.createElement('input');
            idInput.type = 'text';
            idInput.placeholder = 'Введите ID через запятую';
            addFilterModal.appendChild(idInput);

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Введите название отбора';
            addFilterModal.appendChild(nameInput);

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Сохранить';
            saveButton.style.marginTop = '10px';
            saveButton.addEventListener('click', () => {
                const ids = idInput.value.split(',').map(id => parseInt(id.trim(), 10));
                const name = nameInput.value.trim();
                if (ids.length > 0 && name) {
                    savedFilters.push({ name, ids });
                    localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
                    document.body.removeChild(addFilterModal);
                    document.body.removeChild(modal);
                    createSavedFiltersModal(); // обновление списка отборов
                }
            });

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Отмена';
            cancelButton.style.marginLeft = '10px';
            cancelButton.addEventListener('click', () => document.body.removeChild(addFilterModal));

            addFilterModal.appendChild(saveButton);
            addFilterModal.appendChild(cancelButton);

            document.body.appendChild(addFilterModal);
        });

        const closeButton = document.createElement('button');
        closeButton.style.marginTop = '10px';
        closeButton.textContent = 'Закрыть';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#00a8a5';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontFamily = 'inherit';
        closeButton.addEventListener('click', () => document.body.removeChild(modal));
        closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = '#0a918c');
        closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = '#00a8a5');
        closeButton.addEventListener('click', () => document.body.removeChild(modal));

        modal.appendChild(addButton);
        modal.appendChild(closeButton);
        document.body.appendChild(modal);
    }

    // Добавление кнопок на страницу
    const triggerButton = document.createElement('button');
    triggerButton.textContent = 'Открыть меню выбора чекбоксов';
    triggerButton.style.position = 'fixed';
    triggerButton.style.bottom = '20px';
    triggerButton.style.right = '150px';
    triggerButton.style.padding = '10px 20px';
    triggerButton.style.backgroundColor = '#28a745';
    triggerButton.style.color = '#fff';
    triggerButton.style.border = 'none';
    triggerButton.style.borderRadius = '4px';
    triggerButton.style.cursor = 'pointer';
    triggerButton.style.zIndex = '10000';
    triggerButton.style.fontFamily = 'inherit';
    triggerButton.addEventListener('mouseover', () => triggerButton.style.backgroundColor = '#218838');
    triggerButton.addEventListener('mouseout', () => triggerButton.style.backgroundColor = '#28a745');
    triggerButton.addEventListener('click', createModal);

    const settingsButton = document.createElement('button');
    settingsButton.style.position = 'fixed';
    settingsButton.style.bottom = '20px';
    settingsButton.style.right = '100px';
    settingsButton.style.padding = '8px 13px';
    settingsButton.style.backgroundColor = '#00a8a5';
    settingsButton.style.fontSize = '15px';
    settingsButton.style.color = '#fff';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '4px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.zIndex = '10000';
    settingsButton.innerHTML = '&#9881;'; // Иконка гаечного ключа
    settingsButton.addEventListener('click', createSavedFiltersModal);

    document.body.appendChild(triggerButton);
    document.body.appendChild(settingsButton);
})();

