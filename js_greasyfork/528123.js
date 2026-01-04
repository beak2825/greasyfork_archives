// ==UserScript==
// @name         Form Field Saver and Validator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Сохраняет значения полей формы в localStorage, восстанавливает их при загрузке страницы, проверяет обязательные поля перед отправкой и визуально обновляет состояние кнопок.
// @author       YourName
// @match        https://payform.ru/*
// @match        https://*.payform.ru/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
 // @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/528123/Form%20Field%20Saver%20and%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/528123/Form%20Field%20Saver%20and%20Validator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        // Экранирование квадратных скобок в селекторах для input-ов
        const requiredFields = [
            'textarea[name="paid_content"]',
            'input[name="customer_email"]',
            'input[name="products\\[cur_1\\]\\[price\\]"]',
            'input[name="products\\[cur_1\\]\\[name\\]"]'
        ];

        function restoreFields() {
            requiredFields.forEach(selector => {
                const $field = $(selector);
                const fieldName = $field.attr('name');
                const savedValue = localStorage.getItem(fieldName);

                if (savedValue !== null && $field.length) {
                    $field.val(savedValue);
                }
            });
        }

        function saveField($field) {
            const fieldName = $field.attr('name');
            const fieldValue = $field.val();
            localStorage.setItem(fieldName, fieldValue);
        }

        function findEmptyField() {
            let emptyField = null;

            for (let selector of requiredFields) {
                let $field = $(selector);

                // Если поле находится в скрытом контейнере, пропускаем его проверку
                if ($field.closest('.paygoods-product-row.hidden').length) {
                    console.log('Пропускаем поле:', selector, 'так как его родитель скрыт');
                    continue;
                }

                console.log('Проверяем поле:', selector, 'Найдено:', $field.length, 'Значение:', $field.val());

                if ($field.length && !$field.val().trim()) {
                    console.log('Найдено незаполненное поле:', selector);
                    return $field;
                }
            }
            return null;
        }

        function scrollTo($element) {
            if (!$element || !$element.length) return;

            console.log('Скроллим к:', $element[0].name || $element[0].id);

            let offset = $element.offset().top;
            console.log('Отступ элемента:', offset);

            $('html, body').animate({
                scrollTop: offset - 100  // корректируйте смещение при необходимости
            }, {
                duration: 800,
                complete: function() {
                    $element.focus();
                    $element
                        .css('background-color', '#ffe6e6')
                        .delay(200)
                        .queue(function(next) {
                            $(this).css('background-color', '');
                            next();
                        });
                }
            });
        }

        // Обработчик для всех кнопок
        $('#btnPay-wrapper button, .dropdown-menu button').on('click', function(e) {
            console.log('Кнопка нажата');

            let emptyField = findEmptyField();
            console.log('Найдено незаполненное поле:', emptyField ? emptyField[0].name : 'нет');

            if (emptyField) {
                e.preventDefault();
                e.stopPropagation();
                scrollTo(emptyField);
                return false;
            }
            // Если незаполненных полей нет – форма отправляется как задумано
        });

        function updateButtonState() {
            let hasEmptyFields = findEmptyField() !== null;

            // Обновляем внешний вид кнопок, не блокируя их кликабельность
            $('#btnPay-wrapper button, .dropdown-menu button').each(function() {
                $(this).toggleClass('btn-disabled', hasEmptyFields);
                // Не отключаем кнопки:
                // $(this).prop('disabled', hasEmptyFields);
            });
        }

        // Сохраняем значения при вводе
        $(requiredFields.join(',')).on('input change', function() {
            saveField($(this));
            updateButtonState();
        });

        // Восстанавливаем значения при загрузке страницы
        restoreFields();

        // Начальное состояние кнопок
        updateButtonState();

        // Очистка localStorage при успешной отправке формы
        $('form').on('submit', function() {
            requiredFields.forEach(selector => {
                const $field = $(selector);
                const fieldName = $field.attr('name');
                localStorage.removeItem(fieldName);
            });
        });

        // Внедрение стилей
        const styles = `
            .btn-disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .btn-inactive {
                opacity: 0.7;
                cursor: not-allowed !important;
            }

            .highlight-field {
                animation: highlight-pulse 2s ease-in-out;
            }

            @keyframes highlight-pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
            }

            body {
                font-family: 'Manrope', Roboto !important;
            }

            #table-instruction {
                background: #555CFF !important;
                color: #fff !important;
            }

            #table-instruction a {
                color: #fff !important;
                text-underline-offset: 3px !important;
                text-decoration-thickness: 1px !important;
            }

            h1 .editor-pane-line {
                color: #fff;
                line-height: 1.3
            }

            .hint-text {
                opacity: 1 !important;
            }

            form > :nth-child(9) span {
                display: none !important;
            }

            form .input-group-addon {
                display: none !important;
            }

            form .col-xs-6 .h-45,
            input[type="text"],
            select,
            .jq-selectbox__select,
            .form-control{
                border-radius: 6px !important;
                border-color: #aaa!important;
                border-width: 1px !important;
            }

            .btn.btn-sm {
                padding: 10px 20px !important;
                height: auto !important;
                margin: auto !important;
                border: none !important;
                transition: all .3s;
            }

            .btn.btn-sm * {
                transition: .3s all;
            }

            .btn.btn-sm:hover {
                background-color: rgb(219, 219, 219) !important;
                color: #fff !important;
                opacity: 1 !important;
            }

            .btn.btn-sm:hover span,
            .btn.btn-sm:hover i {
                color: #222 !important;
            }

            .paygoods-product-row {
                border: 1px solid #eee !important;
                padding: 20px !important;
                border-radius: 6px !important;
            }

            .paygoods-product-add,
            .paygoods-product-delete {
                top: -10px !important;
                padding: 10px !important;
                height: 20px !important;
                right: -10px;
            }

            .paygoods-product-delete {
                background-color: rgb(255, 81, 81) !important;
                color: #fff !important;
            }

            .paygoods-product-delete i {
                color: #fff !important;
            }

            .price-box {
                background-color: #f0f0ff !important;
                color: #555CFF !important;
                font-size: 20px !important;
                font-weight: bold;
            }

            button[type="submit"] {
                color: #fff !important;
                background-color: #555CFF !important;
                border: none !important;
                margin-bottom: 30px !important;
            }

            .dropup-payform {
                width: 100% !important;
            }

            .dropdown-menu {
                position: relative !important;
                display: flex !important;
                border: none !important;
                background: none !important;
                box-shadow: none !important;
                justify-content: space-between !important;
                width: 100% !important;
                gap: 10px;
            }

            #dropdownMenu2 {
                display: none !important;
            }

            .dropup.dropup-payform .dropdown-menu:after,
            .dropup.dropup-payform .dropdown-menu:before {
                display: none !important;
            }

            .dropdown-menu li {
                width: 100%;
            }

            .dropdown-menu li button {
                width: 100%;
                border-radius: 6px !important;
                text-align: center !important;
                background-color: #f1f1f1 !important;
                color: #222 !important;
            }

            #btnPay-wrapper button{
                width: 100% !important;
            }
        `;

        // Добавление стилей в head
        $('head').append(`<style>${styles}</style>`);
    });
})();