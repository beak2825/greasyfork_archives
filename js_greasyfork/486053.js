// ==UserScript==
// @name         Full MOPS
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  ввод параметров
// @author       ZV
// @match        *://mops-dafuc0a6ftbqguhy.z01.azurefd.net/*
// @match        *://tng-mops-portal.azurewebsites.net/*
// @match        *://mops-portal.azurewebsites.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486053/Full%20MOPS.user.js
// @updateURL https://update.greasyfork.org/scripts/486053/Full%20MOPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initialize() {
        // Найти все радио-кнопки
        var radioButtons = document.querySelectorAll('input[type="radio"]');
        var textField = document.querySelector('input.flex-grow-1');

        if (radioButtons.length > 0 && textField) {
            clearInterval(intervalId); // Останавливаем интервал, когда элементы найдены

            radioButtons.forEach(function(radio) {
                radio.addEventListener("change", function() {
                    if (radio.checked) {
                        var radioValue = radio.value;
                        var textMappings = {
                            "Complex": "",
                            "Custom": optionsCustom[0],  // Устанавливаем значение как первую опцию из выпадающего списка
                            "PreFilterPictures": "40/40",
                            "ImageChoice": "30/30",
                            "ImageBackgroundRemoval": options[0],  // Устанавливаем значение как первую опцию из выпадающего списка
                            "ProductModeration": "5/5",
                            "DoubtfulModeration": "12/12",
                            "ProductApproval": "8/8",
                            "UpdatePictureFilter": "40/40",
                            "ImageUpdate": "5/5",
                            "ProductUpdate": "10/10"
                        };

                        // Скрываем выпадающий список
                        hideDropdown();

                        // Если выбрана кнопка "ImageBackgroundRemoval", показываем выпадающий список и устанавливаем первую опцию
                        if (radioValue === "ImageBackgroundRemoval") {
                            showDropdown(textField, options);
                            textField.value = options[0];
                            textField.dispatchEvent(new Event('change'));
                        }
                        // Если выбрана кнопка "Custom", показываем выпадающий список и устанавливаем первую опцию
                        else if (radioValue === "Custom") {
                            showDropdown(textField, optionsCustom);
                            textField.value = optionsCustom[0];
                            textField.dispatchEvent(new Event('change'));
                        }
                        // Для других кнопок просто устанавливаем значение в поле ввода
                        else {
                            textField.value = textMappings[radioValue] || "";
                            textField.dispatchEvent(new Event('change'));
                        }
                    }
                });
            });
        }
    }

    function hideDropdown() {
        var dropdown = document.querySelector('select');
        if (dropdown) {
            dropdown.parentNode.removeChild(dropdown); // Удаляем выпадающий список
        }
    }

    function showDropdown(textField, options) {
        var dropdown = document.createElement('select');

        options.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            dropdown.add(optionElement);
        });

        // Устанавливаем ширину выпадающего списка равной ширине поля ввода
        dropdown.style.width = textField.offsetWidth + 'px';

        // Обработчик изменения значения в выпадающем списке
        dropdown.addEventListener('change', function() {
            textField.value = this.value;
            textField.dispatchEvent(new Event('change'));
        });

        // Показываем выпадающий список
        textField.parentNode.insertBefore(dropdown, textField.nextSibling);
        dropdown.focus();
    }

    // Варианты ответов для ImageBackgroundRemoval
    var options = ["5/5", "4/5", "3/5", "2/5", "1/5", "5/5 завис",  "4/5 завис", "3/5 завис", "2/5 завис", "1/5 завис", "4/5 сложные картинки", "3/5 сложные картинки", "2/5 сложные картинки", "1/5 сложные картинки"];

    // Варианты ответов для Custom
    var optionsCustom = ["нет тасков", "завис админ"];

    // Инициализация через setInterval для проверки, когда элементы будут доступны
    var intervalId = setInterval(function() {
        initialize();
    }, 1000);

})();
