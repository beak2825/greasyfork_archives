// ==UserScript==
// @name         Для ЗП
// @description  Помощь с трекером
// @namespace    idk, idc
// @version      1.06
// @author       Yevhenii Sirenko
// @match        https://tracker.redpilotstudio.com/time/create*
// @match        https://tracker.redpilotstudio.com/time/update*
// @run-at       document-start
// @license      All Rights Reserved
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464909/%D0%94%D0%BB%D1%8F%20%D0%97%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/464909/%D0%94%D0%BB%D1%8F%20%D0%97%D0%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Создание кнопки для отображения date picker
    let datePickerButton = document.createElement('button');
    datePickerButton.textContent = 'Выбрать дату';
    datePickerButton.style.position = 'fixed';
    datePickerButton.style.top = '10px';
    datePickerButton.style.right = '180px';
    datePickerButton.style.zIndex = '9999';
    document.body.appendChild(datePickerButton);
    
    // Создание элемента date picker
    let datePicker = document.createElement('input');
    datePicker.type = 'date';
    datePicker.style.display = 'none';
    datePicker.style.position = 'fixed';
    datePicker.style.top = '40px';
    datePicker.style.right = '150px';
    datePicker.style.zIndex = '9999';
    document.body.appendChild(datePicker);
    
    // Функция обработки выбранной даты
    function handleDateChange() {
        let selectedDate = datePicker.value;
        console.log('Выбранная дата:', selectedDate);
        // Здесь добавьте код для обработки выбранной даты, например, обновление данных на странице
        
        document.getElementsByClassName("form-control datetimepicker-input")[0].value = selectedDate;
        
        datePicker.style.display = 'none';
    }
    
    // Обработчик события нажатия на кнопку вызова date picker
    datePickerButton.onclick = function () {
        datePicker.style.display = 'block';
        datePicker.focus();
    };
    
    // Обработчик события изменения значения date picker
    datePicker.onchange = handleDateChange;
    
    // Обработчик события потери фокуса date picker
    datePicker.onblur = function () {
        datePicker.style.display = 'none';
    };
    
    // Флаги для проверки состояния нажатых клавиш
    let shiftPressed = false;
    
    // Обработчик события нажатия клавиши
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && event.altKey && (event.key === 'W' || event.key === 'Ц')) {
            // Если комбинация клавиш Ctrl+Shift+Alt+W нажата, показываем кнопку
            datePickerButton.style.display = 'block';
        }
    });
    
    // Обработчик события отпускания клавиши
    document.addEventListener('keyup', function (event) {
        if (event.key === 'Shift') {
            shiftPressed = false;
        }
    });
    
    // Скрываем кнопку "Выбрать дату" по умолчанию
    datePickerButton.style.display = 'none';
    })();