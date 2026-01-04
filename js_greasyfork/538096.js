// ==UserScript==
// @name         Select Specific Approval Branches & Custom City Sets
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Adds buttons to select predefined test branches or a custom set of cities (case-insensitive), with multi-line error reporting for unactivated/unfound cities.
// @author       Your Name
// @match        https://dodopizza.design-terminal.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538096/Select%20Specific%20Approval%20Branches%20%20Custom%20City%20Sets.user.js
// @updateURL https://update.greasyfork.org/scripts/538096/Select%20Specific%20Approval%20Branches%20%20Custom%20City%20Sets.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const branchNames = [
        '.Branch All Global RU',
        '.Branch – b. Группа СПБ',
        '.Branch – a. Группа Москва'
    ];

    function addButton() {
        const summaryElements = document.querySelectorAll('summary');
        let targetSummary = null;

        summaryElements.forEach(summary => {
            if (summary.textContent.trim().startsWith('Russia 🇷🇺')) {
                targetSummary = summary;
            }
        });

        if (!targetSummary) {
            return;
        }

        // --- Первая кнопка: Выбрать только тестовые города ---
        const testCitiesButtonId = 'select-specific-branches-button';
        const defaultTestCitiesButtonText = 'Select test cities only';

        if (!document.querySelector(`#${testCitiesButtonId}`)) {
            const button = document.createElement('button');
            button.id = testCitiesButtonId;
            button.textContent = defaultTestCitiesButtonText;
            button.style.marginLeft = '0.4em';

            button.addEventListener('click', () => {
                button.disabled = true;
                button.textContent = 'Processing...';

                setTimeout(() => {
                    const checkboxes = document.querySelectorAll('label > input[type="checkbox"][name="branchIds"]');
                    if (checkboxes.length === 0) {
                        button.textContent = 'Checkboxes not found';
                        button.disabled = false;
                        setTimeout(() => { button.textContent = defaultTestCitiesButtonText; }, 1000);
                        return;
                    }

                    checkboxes.forEach(checkbox => {
                        if (checkbox.checked) checkbox.click();
                    });

                    let successfullySelectedCount = 0;
                    checkboxes.forEach(checkbox => {
                        const labelElement = checkbox.parentElement;
                        if (labelElement) {
                            const labelText = labelElement.textContent.trim();
                            if (branchNames.includes(labelText)) {
                                if (!checkbox.checked) checkbox.click();
                                if (checkbox.checked) successfullySelectedCount++;
                            }
                        }
                    });

                    if (successfullySelectedCount === branchNames.length) {
                        button.textContent = `Selected: ${successfullySelectedCount} (all)`;
                    } else {
                        button.textContent = `Selected: ${successfullySelectedCount} of ${branchNames.length}`;
                    }
                    button.disabled = false;
                    setTimeout(() => { button.textContent = defaultTestCitiesButtonText; }, 1000);
                }, 20); // 20ms delay
            });
            targetSummary.appendChild(button);
        }

        // --- Вторая кнопка: Выбрать набор городов и связанные элементы ---
        const selectCustomSetButtonId = 'select-custom-set-button';
        const customCitiesContainerId = 'custom-cities-input-container';
        const citiesTextareaId = 'custom-cities-textarea';
        const enableCustomCitiesButtonId = 'enable-custom-cities-button';
        const customCitiesErrorLogId = 'custom-cities-error-log'; // ID для элемента ошибок
        const defaultEnableCustomCitiesButtonText = 'Включить эти города';

        if (!document.querySelector(`#${selectCustomSetButtonId}`)) {
            const selectCustomSetButton = document.createElement('button');
            selectCustomSetButton.id = selectCustomSetButtonId;
            selectCustomSetButton.textContent = 'Select a set of cities';
            selectCustomSetButton.style.marginLeft = '0.4em';
            selectCustomSetButton.style.marginTop = '0.2em';

            const customCitiesContainer = document.createElement('div');
            customCitiesContainer.id = customCitiesContainerId;
            customCitiesContainer.style.display = 'none';
            customCitiesContainer.style.marginTop = '0.5em';
            customCitiesContainer.style.padding = '0.5em';
            customCitiesContainer.style.border = '1px solid #ccc';
            customCitiesContainer.style.borderRadius = '4px';

            const textareaLabel = document.createElement('div');
            textareaLabel.innerHTML = 'Поместите сюда список городов (один город на строку), скопированный из таблицы.';
            textareaLabel.style.marginBottom = '0.5em';

            const citiesTextarea = document.createElement('textarea');
            citiesTextarea.id = citiesTextareaId;
            citiesTextarea.rows = 5;
            citiesTextarea.placeholder = 'Город1-1\nГород2-1\nГород2-2...';
            citiesTextarea.style.width = 'calc(100% - 12px)'; // -12px to account for padding/border of parent
            citiesTextarea.style.marginBottom = '0.5em';

            const enableCustomCitiesButton = document.createElement('button');
            enableCustomCitiesButton.id = enableCustomCitiesButtonId;
            enableCustomCitiesButton.textContent = defaultEnableCustomCitiesButtonText;

            // Элемент для вывода ошибок
            const errorLogElement = document.createElement('div');
            errorLogElement.id = customCitiesErrorLogId;
            errorLogElement.style.color = 'red';
            errorLogElement.style.marginTop = '0.5em';
            errorLogElement.style.display = 'none'; // Изначально скрыт

            customCitiesContainer.appendChild(textareaLabel);
            customCitiesContainer.appendChild(citiesTextarea);
            customCitiesContainer.appendChild(enableCustomCitiesButton);
            customCitiesContainer.appendChild(errorLogElement); // Добавляем элемент ошибок в контейнер

            selectCustomSetButton.addEventListener('click', () => {
                const checkboxes = document.querySelectorAll('label > input[type="checkbox"][name="branchIds"]');
                checkboxes.forEach(checkbox => {
                    const labelElement = checkbox.parentElement;
                    if (labelElement) {
                        const labelText = labelElement.textContent.trim();
                        if (checkbox.checked && !branchNames.includes(labelText)) {
                            checkbox.click();
                        }
                    }
                });
                customCitiesContainer.style.display = (customCitiesContainer.style.display === 'none' ? 'block' : 'none');
            });

            enableCustomCitiesButton.addEventListener('click', function() {
                const buttonElement = this;
                buttonElement.disabled = true;
                buttonElement.textContent = 'Processing...';
                errorLogElement.textContent = ''; // Очищаем предыдущие ошибки
                errorLogElement.style.display = 'none'; // Скрываем область ошибок

                setTimeout(() => {
                    const cityListText = citiesTextarea.value;
                    const citiesToEnableInput = cityListText.split('\n')
                                               .map(name => name.trim())
                                               .filter(name => name.length > 0);
                    
                    // Обрабатываем уникальные города, сохраняя оригинал и версию в нижнем регистре
                    const cityMap = new Map(); // Для уникальности по нижнему регистру, сохраняя первый оригинал
                    citiesToEnableInput.forEach(name => {
                        const lowerName = name.toLowerCase();
                        if (!cityMap.has(lowerName)) {
                            cityMap.set(lowerName, { original: name, lower: lowerName });
                        }
                    });
                    const uniqueCitiesToProcess = Array.from(cityMap.values());

                    if (uniqueCitiesToProcess.length === 0) {
                        buttonElement.textContent = 'Список пуст';
                        buttonElement.disabled = false;
                        setTimeout(() => { buttonElement.textContent = defaultEnableCustomCitiesButtonText; }, 1500);
                        return;
                    }

                    const allCheckboxes = document.querySelectorAll('label > input[type="checkbox"][name="branchIds"]');
                    
                    // Шаг 1: Попытаться активировать все города из списка (сравнение без учета регистра)
                    uniqueCitiesToProcess.forEach(cityObj => {
                        allCheckboxes.forEach(checkbox => {
                            const labelElement = checkbox.parentElement;
                            if (labelElement) {
                                const labelTextLower = labelElement.textContent.trim().toLowerCase();
                                if (labelTextLower === cityObj.lower) {
                                    if (!checkbox.checked) {
                                        checkbox.click();
                                    }
                                }
                            }
                        });
                    });

                    // Шаг 2: Проверить, какие города из *уникального* списка действительно включены (сравнение без учета регистра)
                    let successfullyEnabledCount = 0;
                    const notFoundOrNotEnabledCities = [];

                    uniqueCitiesToProcess.forEach(cityObjFromList => {
                        let foundAndEnabledThisTime = false;
                        allCheckboxes.forEach(checkbox => {
                            if (checkbox.checked) {
                                const labelElement = checkbox.parentElement;
                                if (labelElement) {
                                    const labelTextLower = labelElement.textContent.trim().toLowerCase();
                                    if (labelTextLower === cityObjFromList.lower) {
                                        foundAndEnabledThisTime = true;
                                    }
                                }
                            }
                        });
                        if (foundAndEnabledThisTime) {
                            successfullyEnabledCount++;
                        } else {
                            let checkboxExists = false;
                            allCheckboxes.forEach(cb => {
                                const lbl = cb.parentElement;
                                if (lbl && lbl.textContent.trim().toLowerCase() === cityObjFromList.lower) {
                                    checkboxExists = true;
                                }
                            });
                            notFoundOrNotEnabledCities.push(cityObjFromList.original + (checkboxExists ? " (не вкл.)" : " (не найден)"));
                        }
                    });

                    buttonElement.textContent = `Включено: ${successfullyEnabledCount} из ${uniqueCitiesToProcess.length}`;

                    if (notFoundOrNotEnabledCities.length > 0) {
                        errorLogElement.innerHTML = `Эти рестораны из списка не были включены:<br>${notFoundOrNotEnabledCities.join('<br>')}`;
                        errorLogElement.style.display = 'block'; // Показываем ошибки
                    } else {
                        errorLogElement.textContent = ''; // На всякий случай, если что-то осталось
                        errorLogElement.style.display = 'none';
                    }

                    buttonElement.disabled = false;
                    setTimeout(() => {
                        buttonElement.textContent = defaultEnableCustomCitiesButtonText;
                        // Ошибки больше не скрываем и не очищаем здесь, они остаются до следующего нажатия
                    }, 2500);
                }, 50); // 50ms delay
            });
            
            const firstButton = document.querySelector(`#${testCitiesButtonId}`);
            if (firstButton && firstButton.parentNode === targetSummary) {
                firstButton.insertAdjacentElement('afterend', selectCustomSetButton);
                selectCustomSetButton.insertAdjacentElement('afterend', customCitiesContainer);
            } else {
                 targetSummary.appendChild(selectCustomSetButton);
                 targetSummary.appendChild(customCitiesContainer);
            }
        }

        if (document.querySelector(`#${testCitiesButtonId}`) && document.querySelector(`#${selectCustomSetButtonId}`)) {
            clearInterval(interval);
            console.log('Tampermonkey: All city selection buttons added successfully.');
        }
    }

    const interval = setInterval(addButton, 500);
})();
