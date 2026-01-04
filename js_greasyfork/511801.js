// ==UserScript==
// @name         Category
// @namespace    http://tampermonkey.net/
// @version      2024-10-20
// @description  try to take over the world!
// @author       You
// @match        *://tngadmin.triplenext.net/Admin/Configuration/Complex*
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/BagList/*
// @match        *://*/Admin/ContextModes/Edit/*
// @match        https://tngadmin.triplenext.net/Admin/CompareBag/BagList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511801/Category.user.js
// @updateURL https://update.greasyfork.org/scripts/511801/Category.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Создаем кнопку
        const toggleButton = document.createElement('img');
        toggleButton.src = 'https://img.icons8.com/fluency/96/tap.png'; // Замените на путь к вашему изображению
        toggleButton.alt = 'Toggle'; // Альтернативный текст
        toggleButton.style.position = 'fixed'; // Используем абсолютное позиционирование
        toggleButton.style.right = '1%'; // Привязываем к правому краю
        toggleButton.style.top = '-3px'; // Привязываем к правому краю
        toggleButton.style.width = '96px'; // Устанавливаем нужный размер
        toggleButton.style.height = '96px'; // Устанавливаем нужный размер
        toggleButton.style.cursor = 'pointer'; // Меняем курсор на указатель
        toggleButton.style.zIndex = '9999'; // Помещаем кнопку поверх других элементов
        toggleButton.style.border = 'none'; // Убираем границу, если нужно



        document.body.appendChild(toggleButton); // Добавляем кнопку на страницу
    // Функция для извлечения категорий из селектора
    function extractCategoriesFromSelect(selectId) {
        const selectElement = document.getElementById(selectId); // Получаем элемент селектора по ID
        const options = Array.from(selectElement.options); // Превращаем опции в массив

        // Возвращаем массив объектов с данными о категориях
        return options.map(option => ({
            name: option.text,
            value: option.value,
            parentId: option.getAttribute('data-parentid'),
            isActive: option.getAttribute('isactivecategory') === "True",
            isSelected: option.selected // Добавляем свойство isSelected

        }));
    }

    // Функция для построения иерархической структуры категорий
    function buildHierarchy(categories) {
        const categoryMap = {}; // Карта для хранения категорий
        const result = []; // Результирующий массив

        // Заполняем карту категориями
        categories.forEach(category => {
            categoryMap[category.value] = { ...category, subcategories: [] };
        });

        // Строим иерархию
        categories.forEach(category => {
            if (category.parentId) {
                categoryMap[category.parentId].subcategories.push(categoryMap[category.value]); // Добавляем подкатегорию
            } else {
                result.push(categoryMap[category.value]); // Главная категория
            }
        });

        return result; // Возвращаем иерархию
    }

    function createModal(hierarchy) {
    const modal = document.createElement('div'); // Создаем модальное окно
    modal.style.display = 'none'; // Скрываем по умолчанию
    modal.style.position = 'fixed'; // Фиксированное положение
    modal.style.zIndex = '9999'; // Уровень наложения
    modal.style.right = '5px';
    modal.style.bottom = '5px';
    modal.style.maxWidth = 'auto'; // Максимальная ширина
    modal.style.height = 'auto'; // Автоматическая высота
    modal.style.overflow = 'hidden'; // Скрытие прокрутки

    const modalContent = document.createElement('div'); // Контент модального окна
    modalContent.style.margin = '10px'; // Отступы
    modalContent.style.padding = '10px';
    modalContent.style.border = '1px solid #ccc';
    modalContent.style.maxHeight = '550px';
    modalContent.style.overflowY = 'auto';
    modalContent.style.backgroundColor = '#f9f9f9'; // Белый фон
    modalContent.style.borderRadius = '5px';
    modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    modal.appendChild(modalContent); // Добавляем контент в модал
    document.body.appendChild(modal); // Добавляем модал в тело документа

        // Функция для рендеринга категорий в модальном окне
        function renderCategories(categories, parentElement, level = 0) {
            const subcategoryList = document.createElement('div'); // Список подкатегорий
            categories.forEach(category => {
                const categoryWrapper = document.createElement('div'); // Обертка для категории
                categoryWrapper.style.position = 'relative';
                categoryWrapper.style.margin = '5px 0';
                categoryWrapper.style.textAlign = 'left';
                categoryWrapper.style.paddingLeft = '30px';

                // Кнопка для раскрытия/сокрытия подкатегорий
                if (category.subcategories.length > 0) {
                    const toggleButton = document.createElement('button');
                    toggleButton.textContent = '▼';
                    toggleButton.style.marginRight = '5px';
                    toggleButton.style.cursor = 'pointer';
                    toggleButton.style.border = 'none';
                    toggleButton.style.background = 'none';
                    toggleButton.style.position = 'absolute';
                    toggleButton.style.left = '0';
                    toggleButton.style.top = '50%';
                    toggleButton.style.transform = 'translateY(-50%)';
                    toggleButton.style.color = 'red';

                    let isOpen = true;
                    toggleButton.onclick = function() {
                        nestedList.style.display = (nestedList.style.display === 'none') ? 'block' : 'none'; // Переключение отображения
                        toggleButton.textContent = (nestedList.style.display === 'none') ? '▶' : '▼'; // Изменение текста
                        toggleButton.style.color = (nestedList.style.display === 'none') ? 'green' : 'red'; // Изменение цвета
                        isOpen = !isOpen;
                    };

                    categoryWrapper.appendChild(toggleButton); // Добавляем кнопку раскрытия
                }

                // Кнопка для категории
                const categoryButton = document.createElement('button');
                categoryButton.textContent = category.name; // Название категории
                categoryButton.style.display = 'inline-block';
                categoryButton.style.flexGrow = '1';
                categoryButton.style.height = 'auto';
                categoryButton.style.border = '1px solid #ddd';
                categoryButton.style.cursor = 'pointer';
                // Изменение бордера при наведении
                categoryButton.addEventListener('mouseenter', function() {
                    categoryButton.style.border = '1px solid #007BFF'; // Синий цвет при наведении
                });

                categoryButton.addEventListener('mouseleave', function() {
                    categoryButton.style.border = '1px solid #ddd'; // Возвращение к исходному цвету
                });
              // Попробуем получить текст из первого селектора
                let retailerText = '';
                // Получаем текст из элемента по селектору
                const retailerElement = document.querySelector('#RetailerId_chosen > a > span');
                const retailersDropdownElement = document.querySelector('#retailersDropdown_chosen > a > span');

                if (retailerElement) {
                    retailerText = retailerElement.textContent.trim();
                } else if (retailersDropdownElement) {
                    retailerText = retailersDropdownElement.textContent.trim();
                }

                // Устанавливаем текст для кнопки категории
                categoryButton.textContent = category.name.trim() === '' ? retailerText : category.name;

               // Проверяем значение свойства isSelected
                if (category.isSelected) {
                    categoryButton.style.backgroundColor = 'lightgreen'; // Зеленый фон, если isSelected === true
                } else {
                    categoryButton.style.backgroundColor = category.isActive ? getColorByLevel(level) : '#d3d3d3'; // Серый фон, если isActive === false
}
                categoryButton.style.fontSize = `${15 - (level * 0)}px`; // Размер шрифта в зависимости от уровня
                categoryButton.style.padding = '5px';

                // Обработчик нажатия на кнопку категории
                categoryButton.addEventListener('click', (event) => {
                    let currentUrl = window.location.href; // Текущий URL
                    const editBagPattern = /https:\/\/tngadmin\.triplenext\.net\/Admin\/CompareBag\/EditBag\/\d+/;

                    // Логика для формирования нового URL на основе категории
                    if (editBagPattern.test(currentUrl)) {
                        const retailerId = document.querySelector('#retailersDropdown option:checked')?.value;
                        currentUrl = `https://tngadmin.triplenext.net/Admin/Configuration/Complex?RetailerId=${retailerId}&CategoryId=${category.value}`;
                    } else if (currentUrl.includes('Configuration/Complex')) {
                        const retailerIdElement = document.querySelector('body > div.container.notification > div.row-fluid.head-forms > form:nth-child(2) > a.btn.btn-basic');
                        const retailerId = retailerIdElement ? new URLSearchParams(new URL(retailerIdElement.href).search).get('retailerId') : null;
                        if (retailerId) {
                            currentUrl = `https://tngadmin.triplenext.net/Admin/Configuration/Complex?RetailerId=${retailerId}&CategoryId=${category.value}`;
                        }
                    } else {
                        currentUrl = currentUrl.replace(/&TagId=[^&]*/, ''); // Удаляем TagId из URL
                        if (currentUrl.includes('CategoryId=')) {
                            currentUrl = currentUrl.replace(/CategoryId=[^&]*/, `CategoryId=${category.value}`); // Обновляем CategoryId
                        } else {
                            currentUrl += `&CategoryId=${category.value}`; // Добавляем CategoryId
                        }
                    }

                    // Логика для открытия URL в новом окне в зависимости от нажатых клавиш
                    if (event.ctrlKey) {
                        window.open(currentUrl, '_blank');
                    } else if (event.altKey) {
                        const retailerId = document.querySelector('#retailersDropdown option:checked')?.value ||
                                           new URLSearchParams(new URL(document.querySelector('body > div.container.notification > div.row-fluid.head-forms > form:nth-child(2) > a.btn.btn-basic')?.href).search).get('retailerId') ||
                                           null;

                        let newUrl = `https://tngadmin.triplenext.net/Admin/CompareBag/BagList?page=1&pageSize=100&retailers=${retailerId}&categories=${category.value}`;
                        if (category.name.trim() === '') {
                            newUrl = newUrl.replace(/&categories=[^&]*/, '');
                        }
                        window.open(newUrl, '_blank');
                    } else {
                        window.open(currentUrl, '_blank');
                    }
                });

                // Кнопка для редактирования категории
                const smallButton = document.createElement('button');
                smallButton.textContent = '📃';
                smallButton.style.marginLeft = '5px';
                smallButton.addEventListener('click', () => {
                    const url = `https://tngadmin.triplenext.net/Admin/Category/Edit/${category.value}`; // URL для редактирования
                    window.open(url, '_blank');
                });

                // Создание кнопок W, M, U
                const buttonU = createActionButton('U', 4, category.value);
                const buttonM = createActionButton('M', 1, category.value);
                const buttonW = createActionButton('W', 2, category.value);
                buttonW.style.marginLeft = '10px';
                buttonM.style.marginLeft = '5px';
                buttonU.style.marginLeft = '5px';
                const buttons = [buttonW, buttonM, buttonU,smallButton];
                buttons.forEach(button => {
                    button.style.float = 'right';
                    button.style.height = '32px';
                    button.style.width = '32px';
                    button.style.border = '1px solid #ddd';
                    // Изменение бордера при наведении
                    button.addEventListener('mouseenter', function() {
                    button.style.border = '1px solid #007BFF'; // Синий цвет при наведении
                    });

                    button.addEventListener('mouseleave', function() {
                        button.style.border = '1px solid #ddd'; // Возвращение к исходному цвету
                    });
                });

                categoryWrapper.appendChild(categoryButton); // Добавляем кнопку категории
                categoryWrapper.appendChild(smallButton); // Добавляем кнопку редактирования
                categoryWrapper.appendChild(buttonU);
                categoryWrapper.appendChild(buttonM);
                categoryWrapper.appendChild(buttonW);


                subcategoryList.appendChild(categoryWrapper); // Добавляем обертку с категориями

                const nestedList = document.createElement('div'); // Список подкатегорий
                nestedList.style.display = 'block'; // Скрыто по умолчанию
                nestedList.style.marginLeft = '40px';

                renderCategories(category.subcategories, nestedList, level + 1); // Рендерим подкатегории
                subcategoryList.appendChild(nestedList); // Добавляем подкатегории
            });
            parentElement.appendChild(subcategoryList); // Добавляем подкатегории в родительский элемент
        }

        // Функция для создания кнопок действия
        function createActionButton(text, tagId, categoryValue) {
            const button = document.createElement('button');
            button.innerText = text; // Устанавливаем текст кнопки
            button.addEventListener('click', (event) => {
                handleButtonClick(tagId, categoryValue, event.altKey); // Обработчик нажатия
            });
            return button; // Возвращаем кнопку
        }

        // Обработчик для кнопок действия
        function handleButtonClick(tagId, categoryValue, isAltPressed = false) {
            let currentUrl = window.location.href; // Текущий URL
            const editBagPattern = /https:\/\/tngadmin\.triplenext\.net\/Admin\/CompareBag\/EditBag\/\d+/;

            // Логика для формирования нового URL
            if (editBagPattern.test(currentUrl)) {
                const retailerId = document.querySelector('#retailersDropdown option:checked')?.value;
                currentUrl = `https://tngadmin.triplenext.net/Admin/Configuration/Complex?RetailerId=${retailerId}&CategoryId=${categoryValue}`;
            } else if (currentUrl.includes('Configuration/Complex')) {
                const retailerIdElement = document.querySelector('body > div.container.notification > div.row-fluid.head-forms > form:nth-child(2) > a.btn.btn-basic');
                const retailerId = retailerIdElement ? new URLSearchParams(new URL(retailerIdElement.href).search).get('retailerId') : null;
                if (retailerId) {
                    currentUrl = `https://tngadmin.triplenext.net/Admin/Configuration/Complex?RetailerId=${retailerId}&CategoryId=${categoryValue}`;
                }
            } else {
                currentUrl = updateOrAddQueryParam(currentUrl, 'CategoryId', categoryValue); // Обновляем или добавляем CategoryId
            }

            currentUrl = updateOrAddQueryParam(currentUrl, 'TagId', tagId); // Обновляем TagId

            // Логика для открытия URL в новом окне в зависимости от нажатых клавиш
            if (isAltPressed) {
                const retailerId = document.querySelector('#retailersDropdown option:checked')?.value ||
                                   new URLSearchParams(new URL(document.querySelector('body > div.container.notification > div.row-fluid.head-forms > form:nth-child(2) > a.btn.btn-basic')?.href).search).get('retailerId') ||
                                   null;

                let newUrl = `https://tngadmin.triplenext.net/Admin/CompareBag/BagList?page=1&pageSize=100&retailers=${retailerId}&categories=${categoryValue}&gender=${tagId}`;
                if (categoryValue.trim() === '') {
                    newUrl = newUrl.replace(/&categories=[^&]*/, ''); // Удаляем категории
                }
                window.open(newUrl, '_blank'); // Открываем новый URL
            } else {
                window.open(currentUrl, '_blank'); // Открываем текущий URL
            }
        }

        // Функция для обновления или добавления параметра в URL
        function updateOrAddQueryParam(url, param, value) {
            const regex = new RegExp(`[?&]${param}=([^&#]*)`); // Регулярное выражение для поиска параметра
            if (regex.test(url)) {
                return url.replace(regex, `$1=${value}`); // Обновляем параметр
            } else {
                const separator = url.includes('?') ? '&' : '?';
                return `${url}${separator}${param}=${value}`; // Добавляем новый параметр
            }
        }

        // Функция для получения цвета в зависимости от уровня
        function getColorByLevel(level) {
            const colors = ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'];
            return colors[level] || '#000000'; // Возвращаем цвет
        }

        renderCategories(hierarchy, modalContent); // Рендерим категории в модале

// Обработчик для открытия/закрытия модального окна
toggleButton.onclick = () => {
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block'; // Показываем модал
        localStorage.setItem('modalOpen', 'true'); // Сохраняем состояние
    } else {
        modal.style.display = 'none'; // Скрываем модал
        localStorage.setItem('modalOpen', 'false'); // Сохраняем состояние
    }
};
// Восстанавливаем состояние модального окна
    const isOpen = localStorage.getItem('modalOpen') === 'true';
    if (isOpen) {
        modal.style.display = 'block'; // Показываем модал, если он был открыт
    }

    }
// Проверяем текущий URL
const currentUrl = window.location.href;

if (currentUrl.includes('Admin/CompareBag/BagList')) {

    // Создаем новое модальное окно для CompareBag
const modal = document.createElement('div');
modal.style.display = 'none'; // Изначально скрыто
document.body.appendChild(modal);

// Обработчик для горячих клавиш
window.addEventListener('keydown', (event) => {
    // Если нажата комбинация Ctrl + Z
    if (event.ctrlKey && event.code === 'KeyZ') {
        // Переключаем видимость модального окна
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    }
});
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.left = '50%'; // Центрируем по горизонтали
    modal.style.top = '50%'; // Центрируем по вертикали
    modal.style.transform = 'translate(-50%, -50%)'; // Центрируем с помощью трансформации
    modal.style.maxWidth = '600px'; // Максимальная ширина
    modal.style.height = 'auto'; // Автоматическая высота
    modal.style.overflow = 'hidden';
    const modalContent = document.createElement('div'); // Контент модального окна
    modalContent.style.margin = '10px'; // Отступы
    modalContent.style.padding = '10px';
    modalContent.style.border = '1px solid #ccc';
    modalContent.style.maxHeight = '550px';
    modalContent.style.overflowY = 'auto';
    modalContent.style.backgroundColor = '#f9f9f9'; // Белый фон
    modalContent.style.borderRadius = '5px';
    modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    const CheckboxContainer = document.createElement('div'); // Создаем новое модальное окно для CompareBag
    CheckboxContainer.style.display = 'none';
    CheckboxContainer.style.position = 'fixed';
    CheckboxContainer.style.zIndex = '9999';
    CheckboxContainer.style.left = '50%'; // Центрируем по горизонтали
    CheckboxContainer.style.top = '50%'; // Центрируем по вертикали
    CheckboxContainer.style.transform = 'translate(-50%, -50%)'; // Центрируем с помощью трансформации
    CheckboxContainer.style.maxWidth = '600px'; // Максимальная ширина
    CheckboxContainer.style.height = 'auto'; // Автоматическая высота
    CheckboxContainer.style.overflow = 'hidden';
    const CheckboxContainerContent = document.createElement('div'); // Контент модального окна
    CheckboxContainerContent.style.margin = '10px'; // Отступы
    CheckboxContainerContent.style.padding = '10px';
    CheckboxContainerContent.style.border = '1px solid #ccc';
    CheckboxContainerContent.style.maxHeight = '550px';
    CheckboxContainerContent.style.overflowY = 'auto';
    CheckboxContainerContent.style.backgroundColor = '#f9f9f9'; // Белый фон
    CheckboxContainerContent.style.borderRadius = '5px';
    CheckboxContainerContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';


    modal.appendChild(modalContent); // Добавляем контент в модал
    CheckboxContainer.appendChild(CheckboxContainerContent); // Добавляем контент в модал
    document.body.appendChild(modal); // Добавляем модал в тело документа
    document.body.appendChild(CheckboxContainer); // Добавляем модал в тело документа
    // Создаем контейнер для кнопок
    const buttonContainerTop = document.createElement('div');
    const buttonContainerBottom = document.createElement('div');

  // Массив заголовков для чекбоксов
const headers = [
  "Name", "Admin Link", "URL Link", "Widget Link", "SKU", "Size", "Category",
  "Gender", "Retailer", "Created", "Updated", "Status", "Edited By", "Note"
];

// Функция для создания чекбоксов на основе массива заголовков
const addCheckboxes = (labels) => {
    labels.forEach(labelText => {
        const checkboxWrapper = document.createElement('div'); // Обертка для чекбокса и текста

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = labelText; // Уникальный id для каждого чекбокса

        // Проверка сохраненного состояния в localStorage
        let savedState = localStorage.getItem(labelText);

        // Если данных в localStorage нет, устанавливаем чекбокс в true и сохраняем его
        if (savedState === null) {
            checkbox.checked = true;
            localStorage.setItem(labelText, 'true');
        } else {
            // Иначе устанавливаем сохраненное состояние
            checkbox.checked = savedState === 'true';
        }

        // Обработка изменений состояния чекбокса и сохранение в localStorage
        checkbox.addEventListener('change', () => {
            localStorage.setItem(labelText, checkbox.checked);
        });

        const label = document.createElement('label');
        label.htmlFor = checkbox.id; // Привязываем метку к чекбоксу через id
        label.textContent = labelText;

        checkboxWrapper.appendChild(checkbox); // Добавляем чекбокс в обертку
        checkboxWrapper.appendChild(label); // Добавляем метку в обертку
        checkboxWrapper.style.marginBottom = '8px'; // Отступ между чекбоксами

        CheckboxContainerContent.appendChild(checkboxWrapper); // Добавляем обертку в контейнер контента
    });
};

// Инициализация чекбоксов
addCheckboxes(headers);
// Создаем текстовое поле для ввода горячих клавиш
const inputField = document.createElement('input');
inputField.type = 'text';
inputField.placeholder = 'Введите комбинации клавиш...';
inputField.style.width = '100%'; // Задаем ширину 100%
inputField.style.marginTop = '10px'; // Отступ сверху

// Проверка сохраненного значения в localStorage
const savedHotkey = localStorage.getItem('BagListhotkeys');
if (savedHotkey) {
    inputField.value = savedHotkey; // Устанавливаем сохраненное значение
}

// Обработка событий нажатия клавиш
CheckboxContainerContent.addEventListener("keydown", function(event) {
    event.stopPropagation(); // Остановка всплытия события
    event.preventDefault(); // Предотвращаем стандартное поведение

    if (document.activeElement === inputField) { // Проверяем, что фокус на текстовом поле
        if (event.key === "Delete") {
            inputField.value = ""; // Очистка поля
            return;
        }

        let combination = "";
        if (event.ctrlKey) combination += "Ctrl+";
        if (event.shiftKey) combination += "Shift+";
        if (event.altKey) combination += "Alt+";
        if (event.metaKey) combination += "Command +";
        combination += event.code; // Формируем строку комбинации клавиш
        inputField.value = combination; // Записываем комбинацию клавиш
    }
});

// Сохранение введенных комбинаций клавиш в локальное хранилище при потере фокуса
inputField.addEventListener('blur', () => {
    localStorage.setItem('BagListhotkeys', inputField.value);
});

// Сохранение введенных комбинаций клавиш в локальное хранилище при закрытии окна
const saveHotkeyOnClose = () => {
    localStorage.setItem('BagListhotkeys', inputField.value);
};

// Обработчик события для скрытия модального окна и сохранения данных
CheckboxContainer.addEventListener('transitionend', () => {
    if (CheckboxContainer.style.display === 'none') {
        saveHotkeyOnClose(); // Сохраняем значение перед скрытием
    }
});

// Добавляем текстовое поле в контейнер контента
CheckboxContainerContent.appendChild(inputField);



// Добавляем контент в основное модальное окно
CheckboxContainer.appendChild(CheckboxContainerContent);

// Добавляем CheckboxContainer на страницу
document.body.appendChild(CheckboxContainer);


    // Объект с сообщениями
    const messages = {
        admin: 'Ссылки на Admin скопированы',
        url: 'Ссылки на URL скопированы',
        widget: 'Ссылки на WIDGET скопированы.',
        allin: 'Все данные скопированы',
        sku: 'Скопированы SKU',
        id: 'Скопированы ID',
    };

    // Функция для отображения уведомлений
    const createNotification = (message) => {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.top = '75px';
        notification.style.right = '800px';
        notification.style.backgroundColor = '#4CAF50'; // Зеленый цвет
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1000); // Удаляем уведомление через 3 секунды
    };

// Функция для копирования текста в буфер обмена
const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
};
// Общие стили для кнопок
const buttonStyle = `
    background-color: #45aeea; /* Зеленый фон */
    color: white; /* Белый текст */
    border: none; /* Без границы */
    padding: 10px 10px; /* Отступы */
    text-align: center; /* Центрирование текста */
    text-decoration: none; /* Без подчеркивания */
    display: inline-block; /* Отображение в строку */
    font-size: 16px; /* Размер шрифта */
    margin: 4px 2px; /* Отступы */
    cursor: pointer; /* Курсор в виде руки при наведении */
    border-radius: 5px; /* Закругленные углы */
    transition: background-color 0.3s; /* Плавный переход для фона */
    width: 150px; /* Ширина кнопки */
    height: 50px; /* Высота кнопки */
`;

// Функция для применения стиля к кнопкам
const applyButtonStyles = (button) => {
    button.style.cssText = buttonStyle;
    button.onmouseover = () => {
        button.style.backgroundColor = '#45a049'; // Цвет при наведении
    };
    button.onmouseout = () => {
        button.style.backgroundColor = '#45aeea'; // Цвет по умолчанию
    };
};


// Кнопка ADMIN
const admin = document.createElement('button');
admin.innerText = 'ADMIN';
applyButtonStyles(admin);
admin.onclick = () => {
    createNotification(messages.admin);
    // Получаем все ссылки по указанному селектору
    const links = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) > span:nth-child(1) > a');
    // Собираем ссылки в строку, разделяя их новой строкой
    const linkArray = Array.from(links).map(link => link.href); // или link.innerText, если нужно текст ссылки
    // Создаем строку с текстом "ADMIN URL" и ссылками
    const linkString = `ADMIN URL\n${linkArray.join('\n')}`; // Создаем строку с переносами
    // Копируем ссылки в буфер обмена
    copyToClipboard(linkString);
};
buttonContainerTop.appendChild(admin);




    // Кнопка url
    const url = document.createElement('button');
    url.innerText = 'URL';
    applyButtonStyles(url);
    url.onclick = () => {
        createNotification(messages.url);
        // Получаем все ссылки по указанному селектору
    const links = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) > span:nth-child(4) > a');
    // Собираем ссылки в строку, разделяя их новой строкой
    const linkArray = Array.from(links).map(link => link.href); // или link.innerText, если нужно текст ссылки
    const linkString = `URL\n${linkArray.join('\n')}`; // Создаем строку с переносами
    copyToClipboard(linkString);
    };
    buttonContainerTop.appendChild(url);



    // Кнопка widget
    const widget = document.createElement('button');
    widget.innerText = 'WIDGET';
applyButtonStyles(widget);
    widget.onclick = () => {
        createNotification(messages.widget);
        // Получаем все ссылки по указанному селектору
    const links = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) >  span:nth-child(6) > a');
    // Собираем ссылки в строку, разделяя их новой строкой
    const linkArray = Array.from(links).map(link => link.href); // или link.innerText, если нужно текст ссылки
   const linkString = `widget URL\n${linkArray.join('\n')}`; // Создаем строку с переносами
    // Копируем ссылки в буфер обмена
    copyToClipboard(linkString);
    };
    buttonContainerTop.appendChild(widget);



// Кнопка id
const id = document.createElement('button');
id.innerText = 'ID';
applyButtonStyles(id);
id.onclick = (event) => {
    createNotification(messages.id);

    // Получаем все ссылки по указанному селектору
    const links = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) > span:nth-child(1) > a');

    // Собираем ссылки в строку, оставляя только часть после "EditBag/"
    const linkArray = Array.from(links).map(link => {
        const href = link.href;
        const parts = href.split('EditBag/'); // Разделяем по "EditBag/"
        return parts.length > 1 ? parts[1] : href; // Возвращаем строку после "EditBag/"
    });

    let textString;

    // Проверяем, зажат ли Alt, Ctrl или Shift
    if (event.altKey) {
        // Копируем значения через пробел, без добавления "ID"
        textString = linkArray.join(' '); // Создаем строку через пробел
    } else if (event.ctrlKey) {
        // Копируем значения через запятую, без добавления "ID"
        textString = linkArray.join(','); // Создаем строку через запятую
    } else if (event.shiftKey) {
        // Копируем значения через запятую с пробелом, без добавления "ID"
        textString = linkArray.join(', '); // Создаем строку через запятую с пробелом
    } else {
        // Обычное поведение: добавляем "ID" в начало и копируем в столбик
        textString = ['ID', ...linkArray].join('\n'); // Добавляем "ID" и создаем строку с переносами
    }

    // Копируем текст в буфер обмена
    copyToClipboard(textString);
};

// Добавляем кнопку на контейнер
buttonContainerBottom.appendChild(id);
// Кнопка all
const allin = document.createElement('button');
allin.innerText = 'ALL';
applyButtonStyles(allin);
allin.onclick = () => {
    createNotification(messages.allin);

    // Получаем все ссылки для ADMIN
    const adminLinks = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) > span:nth-child(1) > a');

    // Получаем все ссылки для URL
    const urlLinks = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) > span:nth-child(4) > a');

    // Получаем все ссылки для widget
    const widgetLinks = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) > span:nth-child(6) > a');

    // Получаем значения Name
    const nameLinks = document.querySelectorAll('#root > div > div.ant-layout.css-lyp1mu > main > div > main > div > div:nth-child(4) > div > div.ant-table-wrapper.css-lyp1mu > div > div > div > div > div.ant-table-body > table > tbody > tr > td:nth-child(2) > span:nth-child(1) > a');
    const nameArray = Array.from(nameLinks).map(link => link.innerText); // Получаем текст из Name

    // Получаем текст из столбцов
    const skuArray = Array.from(document.querySelectorAll('td:nth-child(3)')).slice(1).map(td => td.innerText);
    const sizeArray = Array.from(document.querySelectorAll('td:nth-child(4)')).slice(1).map(td => td.innerText);
    const categoryArray = Array.from(document.querySelectorAll('td:nth-child(5)')).slice(1).map(td => td.innerText);
    const genderArray = Array.from(document.querySelectorAll('td:nth-child(6)')).slice(1).map(td => td.innerText);
    const retailerArray = Array.from(document.querySelectorAll('td:nth-child(7)')).slice(1).map(td => td.innerText);
    const createdArray = Array.from(document.querySelectorAll('td:nth-child(8)')).slice(1).map(td => td.innerText);
    const updatedArray = Array.from(document.querySelectorAll('td:nth-child(9)')).slice(1).map(td => td.innerText);
    const statusArray = Array.from(document.querySelectorAll('td:nth-child(10)')).slice(1).map(td => {
        const span = td.querySelector('span.ant-select-selection-item');
        return span ? span.textContent.trim() : td.innerText;
    });
    const editedByArray = Array.from(document.querySelectorAll('td:nth-child(11)')).slice(1).map(td => td.innerText);
    const noteArray = Array.from(document.querySelectorAll('td:nth-child(12)')).slice(1).map(td => td.innerText);

    // Собираем ссылки в массивы
    const adminLinkArray = Array.from(adminLinks).map(link => link.href);
    const urlLinkArray = Array.from(urlLinks).map(link => link.href);
    const widgetLinkArray = Array.from(widgetLinks).map(link => link.href);

    // Определяем максимальную длину, чтобы правильно выровнять строки
    const maxLength = Math.max(adminLinkArray.length, urlLinkArray.length, widgetLinkArray.length, skuArray.length, nameArray.length);

    // Создаем массив строк
    const rows = []; // Начинаем с пустого массива строк
    const headers = []; // Массив для заголовков, которые будут добавлены

    // Внутри цикла для создания строк
    for (let i = 0; i < maxLength; i++) {
        const valuesToAdd = [];

        // Проверяем состояние заголовков в localStorage и добавляем соответствующие значения
        if (localStorage.getItem('Name') === 'true') {
            if (!headers.includes("Name")) headers.push("Name"); // Добавляем заголовок, если его еще нет
            valuesToAdd.push(nameArray[i] || '');
        }
        if (localStorage.getItem('Admin Link') === 'true') {
            if (!headers.includes("Admin Link")) headers.push("Admin Link");
            valuesToAdd.push(adminLinkArray[i] || '');
        }
        if (localStorage.getItem('URL Link') === 'true') {
            if (!headers.includes("URL Link")) headers.push("URL Link");
            valuesToAdd.push(urlLinkArray[i] || '');
        }
        if (localStorage.getItem('Widget Link') === 'true') {
            if (!headers.includes("Widget Link")) headers.push("Widget Link");
            valuesToAdd.push(widgetLinkArray[i] || '');
        }
        if (localStorage.getItem('SKU') === 'true') {
            if (!headers.includes("SKU")) headers.push("SKU");
            valuesToAdd.push(skuArray[i] || '');
        }
        if (localStorage.getItem('Size') === 'true') {
            if (!headers.includes("Size")) headers.push("Size");
            valuesToAdd.push(sizeArray[i] || '');
        }
        if (localStorage.getItem('Category') === 'true') {
            if (!headers.includes("Category")) headers.push("Category");
            valuesToAdd.push(categoryArray[i] || '');
        }
        if (localStorage.getItem('Gender') === 'true') {
            if (!headers.includes("Gender")) headers.push("Gender");
            valuesToAdd.push(genderArray[i] || '');
        }
        if (localStorage.getItem('Retailer') === 'true') {
            if (!headers.includes("Retailer")) headers.push("Retailer");
            valuesToAdd.push(retailerArray[i] || '');
        }
        if (localStorage.getItem('Created') === 'true') {
            if (!headers.includes("Created")) headers.push("Created");
            valuesToAdd.push(createdArray[i] || '');
        }
        if (localStorage.getItem('Updated') === 'true') {
            if (!headers.includes("Updated")) headers.push("Updated");
            valuesToAdd.push(updatedArray[i] || '');
        }
        if (localStorage.getItem('Status') === 'true') {
            if (!headers.includes("Status")) headers.push("Status");
            valuesToAdd.push(statusArray[i] || '');
        }
        if (localStorage.getItem('Edited By') === 'true') {
            if (!headers.includes("Edited By")) headers.push("Edited By");
            valuesToAdd.push(editedByArray[i] || '');
        }
        if (localStorage.getItem('Note') === 'true') {
            if (!headers.includes("Note")) headers.push("Note");
            valuesToAdd.push(noteArray[i] || '');
        }

        // Если есть значения для добавления, добавляем их в массив строк
        if (valuesToAdd.length > 0) {
            rows.push(valuesToAdd.join('\t')); // Добавляем строку значений
        }
    }

    // Объединяем строки с переносами
    const linkString = rows.join('\n');

    // Если есть заголовки, добавляем их к строкам
    if (headers.length > 0) {
        const headerRow = headers.join('\t'); // Создаем строку заголовков
        const finalString = headerRow + '\n' + linkString; // Объединяем заголовки и строки данных
        copyToClipboard(finalString); // Копируем в буфер обмена
    } else {
        copyToClipboard(linkString); // Если нет заголовков, просто копируем данные
    }
};

buttonContainerBottom.appendChild(allin);



// Кнопка SKU
const sku = document.createElement('button');
sku.innerText = 'SKU';
applyButtonStyles(sku);
sku.onclick = (event) => {
    createNotification(messages.sku);

    // Получаем все ячейки третьего столбца по указанному селектору
    const cells = document.querySelectorAll('td:nth-child(3)');
    const textArray = Array.from(cells).map(cell => cell.innerText); // Получаем текст ячейки

    // Проверяем, зажат ли Alt, Ctrl или Shift
    if (event.altKey) {
        // Удаляем первое значение из массива и копируем через пробел
        if (textArray.length > 0) {
            textArray.shift(); // Удаляем первое значение
        }
        // Копируем через пробел
        const textString = textArray.join(' '); // Создаем строку через пробел
        copyToClipboard(textString);
    } else if (event.ctrlKey) {
        // Удаляем первое значение из массива и копируем через запятую
        if (textArray.length > 0) {
            textArray.shift(); // Удаляем первое значение
        }
        // Копируем через запятую
        const textString = textArray.join(','); // Создаем строку через запятую
        copyToClipboard(textString);
    } else if (event.shiftKey) {
        // Удаляем первое значение из массива и копируем через запятую с пробелом
        if (textArray.length > 0) {
            textArray.shift(); // Удаляем первое значение
        }
        // Копируем через запятую с пробелом
        const textString = textArray.join(', '); // Создаем строку через запятую с пробелом
        copyToClipboard(textString);
    } else {
        // Обычное поведение: заменяем первое значение на "SKU" и копируем в столбик
        if (textArray.length > 0) {
            textArray[0] = 'SKU'; // Заменяем первое значение на "SKU"
        }
        const textString = textArray.join('\n'); // Создаем строку с переносами для копирования в столбик
        copyToClipboard(textString);


    }

};

buttonContainerBottom.appendChild(sku);

    // Добавляем контейнеры для кнопок в модальное окно
    modalContent.appendChild(buttonContainerTop);
    modalContent.appendChild(buttonContainerBottom);


   // Обработчик для открытия/закрытия модального окна
toggleButton.onclick = (event) => {
    // Проверяем, зажата ли клавиша Alt
    if (event.altKey) {
        // Переключаем видимость modal1
        CheckboxContainer.style.display = (CheckboxContainer.style.display === 'none' || CheckboxContainer.style.display === '') ? 'block' : 'none';

        // Закрываем modal, если он открыт
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    } else {
        // Переключаем видимость основного modal
        modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
    }

    // Обработчик для закрытия modal при клике вне его
    document.addEventListener('click', (event) => {
        if (modal.style.display === 'block' && !modal.contains(event.target) && event.target !== toggleButton) {
            modal.style.display = 'none';
        }

        if (CheckboxContainer.style.display === 'block' && !CheckboxContainer.contains(event.target) && event.target !== toggleButton) {
            CheckboxContainer.style.display = 'none';


// Добавляем обработчик события нажатия клавиш
var currentIndex = 0; // Глобальная переменная для хранения индекса текущей кнопки
function handleHotkeys(event) {// Проверяем, находится ли фокус в текстовом поле
        if ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') || event.target.closest('#doubtful-comment-modal')) {
        return; // Если фокус в текстовом поле или внутри #doubtful-comment-modal, прерываем выполнение скрипта
    }

    var hotkeys = JSON.parse(localStorage.getItem("hotkeys"));
    if (hotkeys && hotkeys.length >= 1) { // Проверяем, существует ли hotkeys и есть ли хотя бы два элемента
        var combination = "";
        if (event.ctrlKey) combination += "Ctrl+";
        if (event.shiftKey) combination += "Shift+";
        if (event.altKey) combination += "Alt+";
        if (event.metaKey) combination += "Command +";
        combination += event.code; // Формируем строку комбинации клавиш
        if (hotkeys[0] === combination) { // Проверяем первое значение

            var buttonSelectors = [
                'body > img',

            ];
            var button = document.querySelector(buttonSelectors[currentIndex]);
            // Проверяем, существует ли кнопка
            if (button) {
                // Имитируем клик по кнопке
                button.click();

            }
        }
    }
}
    // Добавляем обработчик события нажатия клавиш
    document.addEventListener("keydown", handleHotkeys);


        }
    });
};



} else if (currentUrl.includes('Admin/ContextModes/Edit/')) {

// Находим кнопку toggleButton и скрываем её
// Удаляем элемент <img> из <body>
const imgElement = document.querySelector('body > img');
if (imgElement) {
    imgElement.remove();
}


   // Получаем все элементы span внутри селектора #SelectedRetailerIds_chosen > ul
    const spans = document.querySelectorAll('#SelectedRetailerIds_chosen > ul span');

    // Получаем все option элементы из #retailersInfo и #categoriesInfo
    const options = Array.from(document.querySelectorAll('#retailersInfo option'));
    const categoryOptions = Array.from(document.querySelectorAll('#categoriesInfo option'));

    // Разделяем текст из #categoriesNames на части
    const categoriesText = document.querySelector('#categoriesNames')?.textContent.trim();
    const categoryNames = categoriesText ? categoriesText.split(',').map(name => name.trim()) : [];

    // Функция для создания модального окна
    function createModal(content, onClose) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.style.transition = 'opacity 0.3s ease';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '15px';
        modalContent.style.borderRadius = '12px';
        modalContent.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        modalContent.style.maxWidth = '200px';
        modalContent.style.textAlign = 'center';
        modalContent.style.transition = 'transform 0.3s ease-in-out';
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';

        modalContent.innerHTML = content;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Анимация появления окна
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10);

        // Закрытие модального окна при клике на фон
        modal.addEventListener('click', function(e) {
            if (e.target === modal) { // Если клик на фоне (не на контенте)
                modal.remove();
                if (onClose) onClose();
            }
        });

        // Закрытие модального окна при клике на любую кнопку внутри модала
        const buttons = modalContent.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                modal.remove();
                if (onClose) onClose();
            });
        });
    }

    // Открытие новой вкладки с указанным URL
    function openInNewTab(url) {
        const newWindow = window.open(url, '_blank');
        newWindow.focus();
    }

    // Функция для создания второго модального окна с тегами
    function createTagModal(url) {
        const tagContent = `
            <button class="tag-button">Female</button>
            <button class="tag-button">Male</button>
            <button class="tag-button">Unisex</button>
            <button class="tag-button">Без тега</button>
        `;
        createModal(tagContent, () => {}); // Закрытие модального окна с тегами

        // Добавляем обработчики для кнопок
        document.querySelectorAll('.tag-button').forEach((button, index) => {
            button.addEventListener('click', () => {
                const tagId = [2, 1, 4, ''][index]; // TagId для каждой кнопки
                openInNewTab(`${url}&TagId=${tagId}`);
            });
        });
    }

    // Функция для создания первого модального окна с категориями
    function createCategoryModal(retailerId) {
        let content = '';

        // Создаем кнопки для каждой категории из #categoriesNames
        categoryNames.forEach(categoryName => {
            const categoryOption = categoryOptions.find(opt => opt.textContent.trim() === categoryName.trim());
            if (categoryOption) {
                const categoryId = categoryOption.value;
                // Формируем правильную ссылку с retailerId и categoryId
                const categoryLink = `https://tngadmin.triplenext.net/Admin/Configuration/Complex?RetailerId=${retailerId}&CategoryId=${categoryId}`;
                content += `<button class="category-button" data-link="${categoryLink}">${categoryName}</button><br>`;
            }
        });

        // Открываем модальное окно с категориями
        createModal(content, () => {});

        // Добавляем обработчики для кнопок
        document.querySelectorAll('.category-button').forEach(button => {
            button.addEventListener('click', () => {
                const categoryLink = button.getAttribute('data-link'); // Получаем правильную ссылку для категории
                createTagModal(categoryLink); // Открываем модальное окно с тегами
            });
        });
    }

    // Проходим по всем span элементам
    spans.forEach(span => {
        // Получаем текст из span
        const text = span.textContent || span.innerText;

        // Находим соответствующий option с таким же текстом из #retailersInfo
        const option = options.find(opt => opt.textContent.trim() === text.trim());

        if (option) {
            // Извлекаем RetailerId из value атрибута option
            const retailerId = option.value.split('|')[0];

            // Создаем новый элемент <a>
            const link = document.createElement('a');
            link.href = `#`;
            link.textContent = text;
            link.style.fontSize = '12px';
            link.style.color = '#2196F3';
            link.style.cursor = 'pointer';
            link.style.textDecoration = 'none';

            // Добавляем обработчик для модального окна с категориями
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Отменяем стандартное поведение (переход по ссылке)

                // Открываем первое модальное окно с категориями
                createCategoryModal(retailerId);
            });

            // Заменяем span на новый элемент <a>
            span.replaceWith(link);
        }
    });

    // Стили для кнопок
    const styles = document.createElement('style');
    styles.innerHTML = `
        .category-button, .tag-button {
            padding: 6px 10px;
            font-size: 15px;
            color: white;
            background-color: #2fa3e6;
            border: none;
            border-radius: 8px;
            margin: 2px 0;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s, transform 0.2s ease;
        }

        .category-button:hover, .tag-button:hover {
            background-color: #2376a6;
            transform: translateY(-2px);
        }

        .category-button:active, .tag-button:active {
            background-color: #388e3c;
            transform: translateY(2px);
        }
    `;
    document.head.appendChild(styles);


    } else {

    const categories = extractCategoriesFromSelect('CategoryId'); // Извлекаем категории
    const hierarchy = buildHierarchy(categories); // Строим иерархию
    createModal(hierarchy); // Создаем модальное окно
}
})();

