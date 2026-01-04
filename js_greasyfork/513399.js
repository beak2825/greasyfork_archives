// ==UserScript==
// @name         TIPS
// @version      0.2
// @description TIPS admin
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1257769
// @downloadURL https://update.greasyfork.org/scripts/513399/TIPS.user.js
// @updateURL https://update.greasyfork.org/scripts/513399/TIPS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Получаем текущий URL и извлекаем ID
    const currentUrl = window.location.href;
    const id = currentUrl.split('/').pop();
    const newUrl = `https://tngadmin.triplenext.net/Admin/Audit/Product/${id}`;

    // Создаем div элемент
    function createDiv(styles) {
        const div = document.createElement('div');
        Object.assign(div.style, styles);
        document.body.appendChild(div);
        return div;
    }

    // Загружаем новую страницу
    fetch(newUrl)
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const allText = doc.body.innerHTML;

            // Регулярные выражения для поиска тегов и категории
            const regexTagChanged = /Tag changed from(.*?)<br>/m;
            const regexAddedTag = /Added Tag:(.*?)<br>/m;
            const regexRemovedTag = / Removed Tag:(.*?)<br>/m;
            const regexCategory = /Category:(.*?)<br>/m;

            const matchTagChanged = allText.match(regexTagChanged);
            const matchAddedTag = allText.match(regexAddedTag);
            const matchRemovedTag = allText.match(regexRemovedTag);
            const matchCategory = allText.match(regexCategory);

            // Создаем и настраиваем div для тегов
            const tagDiv = createDiv({
                position: 'absolute',
              //  zIndex: '1000',
                color: '#317eac',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
               // top: '200px', // Установите нужное значение для top
              //  left: '20px' // Установите нужное значение для left
            });
let categorySlot1 = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(1)');
// Функция для обновления позиции div
function updateDivPosition() {
    let categorySlotRect1 = categorySlot1.getBoundingClientRect();
    tagDiv.style.top = `${window.scrollY + categorySlotRect1.top + 35}px`; // Сдвигаем вниз на 20px
    tagDiv.style.left = `${window.scrollX + categorySlotRect1.left}px`; // Позиционируем по координатам
}

// Инициализируем позицию при загрузке
updateDivPosition();

// Обновляем позицию при прокрутке и изменении масштаба
window.addEventListener('scroll', updateDivPosition);
window.addEventListener('resize', updateDivPosition);


// Проверяем и выводим первое найденное значение
            if (matchRemovedTag) {
                tagDiv.textContent = `Тег ${matchRemovedTag[1].replace(/<[^>]*>/g, '').trim()} удален`;
            } else if (matchTagChanged) {
                tagDiv.textContent = matchTagChanged[1].replace(/<[^>]*>/g, '').trim().replace(/to/g, ' на ');
            } else if (matchAddedTag) {
                tagDiv.textContent = `Добавлен тег ${matchAddedTag[1].replace(/<[^>]*>/g, '').trim()}`;
            } else {
                tagDiv.textContent = "Зашло с этим тегом";
            }

            // Создаем и настраиваем div для категории
            const categoryDiv = createDiv({
                position: 'absolute',
                //zIndex: '1000',
                color: '#317eac',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          //      top: '250px', // Установите нужное значение для top
         //       left: '20px' // Установите нужное значение для left
            });

            // Получаем элемент категории
            let categorySlot = document.querySelector('#CategoryId_chosen');

            // Функция для обновления позиции div
        function updateCategoryDivPosition() {
            let categorySlotRect = categorySlot.getBoundingClientRect();
            categoryDiv.style.top = `${window.scrollY + categorySlotRect.top - 25}px`; // Сдвигаем вверх на 35px
            categoryDiv.style.left = `${window.scrollX + categorySlotRect.left}px`; // Позиционируем по координатам
}

        // Инициализируем позицию при загрузке
updateCategoryDivPosition();

        // Обновляем позицию при прокрутке и изменении масштаба
        window.addEventListener('scroll', updateCategoryDivPosition);
        window.addEventListener('resize', updateCategoryDivPosition);


            // Заполняем categoryDiv в зависимости от найденного текста
            if (matchCategory) {
                categoryDiv.textContent = matchCategory[1].replace(/<[^>]*>/g, '').trim().replace(/-&gt;/g, 'на').replace(/&amp;/g, '&');
            } else {
                categoryDiv.textContent = "Категорию не меняли";
            }






// Функция для поиска и создания div из уникальных значений третьего и четвертого столбца
function addUniqueDivsForColumns() {
    // Находим все строки в thead таблицы
    const rows = Array.from(document.querySelectorAll('#RejectForm > thead > tr'));

    // Создаём основной div для всех значений
    const infoDiv = createDiv({
        position: 'fixed',
       // zIndex: '9999',
        color: '#317eac',
        fontSize: '13px',
        fontWeight: 'bold',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        whiteSpace: 'pre-line',
        textAlign: 'left',
        top: '7%',
        left: '1%'
    });

    // Используем Set для хранения уникальных значений из третьего столбца
    const uniqueValues = new Set();

    // Проходим по строкам с конца, начиная со второй строки (индекс 1)
    for (let i = rows.length - 1; i >= 1; i--) { // Начинаем с последней строки, исключая первую
        const tds = rows[i].querySelectorAll('td'); // Находим все столбцы в строке

        // Проверяем, что строка имеет хотя бы 4 столбца
        if (tds.length >= 4) {
            const firstTdContent = tds[2].textContent.trim(); // Третий столбец (индекс 2)
            const textContent = tds[3].textContent.trim(); // Четвертый столбец (индекс 3)

            // Проверяем, является ли значение уникальным
            if (!uniqueValues.has(firstTdContent)) {
                uniqueValues.add(firstTdContent); // Добавляем уникальное значение в Set

                // Создаем новый div для отображения значений
const div = document.createElement('div');
div.innerHTML = `<span style="color: red;">${firstTdContent}</span>: ${textContent}`; // Замените 'red' на желаемый цвет
div.style.cursor = 'pointer'; // Изменяем курсор на указатель


                // Передаем данные в обработчик клика
                div.addEventListener('click', (event) => {
                    // Проверяем, зажата ли клавиша Ctrl
                    if (event.ctrlKey) {
                        // Устанавливаем обработчик для отпускания клавиши Ctrl
                        const releaseHandler = (releaseEvent) => {
                            if (!releaseEvent.ctrlKey) { // Если Ctrl отпущен
                                handleClick(firstTdContent, textContent);
                                document.removeEventListener('keyup', releaseHandler); // Убираем обработчик
                            }
                        };
                        document.addEventListener('keyup', releaseHandler); // Добавляем обработчик отпускания клавиши
                    } else {
                        handleClick(firstTdContent, textContent); // Обрабатываем клик, если Ctrl не зажат
                    }
                });

                infoDiv.appendChild(div); // Добавляем новый div в infoDiv
            }
        }
    }

    // Добавляем infoDiv на страницу
    document.body.appendChild(infoDiv);
}

// Функция, которая будет вызываться при клике
function handleClick(firstTdText, searchText) {
    const button = document.querySelector('#form-save > div.bag-details-wrapper.left-col > div.buttons > div:nth-child(6) > button.btn.btn-danger');
    if (button) {
        button.click(); // Кликаем по кнопке

        // После клика на кнопку ищем текст в заголовке таблицы
        const rows = Array.from(document.querySelectorAll('#RejectForm > thead > tr'));
        for (const row of rows) {
            const tds = row.querySelectorAll('td');
            if (Array.from(tds).some(td => td.textContent.trim() === firstTdText)) { // Проверяем наличие firstTdText
                // Проверяем наличие searchText в той же строке
                const containsSearchText = Array.from(tds).some(td => td.textContent.trim() === searchText);
                if (containsSearchText) {
                    const input = row.querySelector('td input'); // Находим input в первой td
                    if (input) {
                        input.click(); // Кликаем по input

                        // Теперь находим input в седьмой td и устанавливаем на него фокус
                        const seventhTdInput = row.querySelectorAll('td')[6].querySelector('input'); // Находим input в седьмой td (индекс 6)
                        if (seventhTdInput) {
                            seventhTdInput.focus(); // Устанавливаем фокус на input в седьмой td
                        } else {
                            console.error('Input не найден в седьмой td');
                        }
                    } else {
                        console.error('Input не найден в первой td');
                    }
                }
            }
        }
    } else {
        console.error('Кнопка не найдена'); // Сообщение об ошибке, если кнопка не найдена
    }
}

// Вызываем функцию для создания уникальных div из значений третьего и четвертого столбцов, начиная с последней строки и исключая первую
addUniqueDivsForColumns();








         });
    })
();
