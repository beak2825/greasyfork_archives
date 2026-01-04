// ==UserScript==
// @name         Отчеты Сироты
// @version      0.1
// @description  Иногда я задаюсь вопросом, зачем я это делаю
// @author       Roshik
// @copyright    Wilhelm Birkner [https://vk.com/washclown]
// @match        *://catwar.net/*
// @grant        none
// @namespace  https://catwar.net/cat1390991
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523508/%D0%9E%D1%82%D1%87%D0%B5%D1%82%D1%8B%20%D0%A1%D0%B8%D1%80%D0%BE%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523508/%D0%9E%D1%82%D1%87%D0%B5%D1%82%D1%8B%20%D0%A1%D0%B8%D1%80%D0%BE%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили для элементов шаблона
    const style = document.createElement('style');
    style.innerHTML = `
        .template-field {
          margin-top: 10px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .template-field input {
          margin: 0 5px;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }

        .template-field .label-text {
          margin-right: 5px;
        }

        #copyButton {
          margin-top: 5px;
          padding: 5px 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        #copyButton:hover {
          background-color: #3e8e41;
        }

        #templateSelect {
          margin-top: 5px;
          margin-bottom: 5px;
        }

        #dateOffset {
          width: 50px;
        }
    `;
    document.head.appendChild(style);

    // Шаблоны для разных блогов ( ব্লগ ID : [шаблоны] )
    const templates = {
         // Руферы
    'blog696447': [
        {
            name: 'Передача предмета',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], передал(а) дому ["{count}"] предмет ["{item_name}"], ["{points}"], [url="{screenshot}"]Скриншот из истории[/url].'
        },
        {
            name: 'Очередь на перо',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], хочу встать в очередь на получение ({color_select}) пера, {date}.'
        },
        {
            name: 'Выкуп перьев',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], хочу выкупить ({count}) ({color}) перьев, {date}.'
        }
    ],
         // Содружество любителей вод
    'blog424137': [
        {
            name: 'Поднятие ПУ',
            template: '[[n]\`l\`[/n]ink"{id}"] поднял(а) уровень ПУ на [{number}] единиц , {date}, [{screenshot}]'
        },
        {
            name: 'Достижение уровня ПУ',
            template: '[[n]\`l\`[/n]ink"{id}"] достиг(ла) [{level}] уровня ПУ, подняв навык на [{number}] единиц ПУ, {date}, [{screenshot}]'
        },
        {
            name: 'Оставление предмета',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], оставил(а) себе [{count}] предмет [{item_name}], [{points}], [url="{screenshot1}"]Скриншот из истории[/url], [url="{screenshot2}"]ракушка[/url].'
        },
        {
            name: 'Передача ракушек',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], передал(а) дому [{count}] ракушек [{shell_type}], [{points}], [url="{screenshot}"]Скриншот из истории[/url].'
        }
    ],
         // Вылазки и дозоры
    'blog364639': [
        {
            name: 'Вылазка',
            template: '{timeOfDay} от {date}\n Ведущий: [[n]\`l\`[/n]ink"{id_leader}"] \nУчастники: [[n]\`l\`[/n]ink"{id_participant1}"], [[n]\`l\`[/n]ink"{id_participant2}"], [[n]\`l\`[/n]ink"{id_participant3}"]\nСобранные ресурсы: —\nОбнаруженные нарушители: —'
        },
        {
            name: 'Дозор',
            template: 'Дозор от {date}\nДозорящий: [[n]\`l\`[/n]ink"{id}"]\nВремя дозора: {time_start}-{time_end}\nЗа весь день (часы и минуты в сумме)\nОбнаруженные нарушители: —'
        }
    ],
         // Кормильцы
    'blog378288': [
        {
            name: 'Пополнение кучи (корм/огрызки)',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], пополнил(а) кучу на [{count}] единиц корма/огрызков, {date}.'
        },
        {
            name: 'Пополнение кучи (дичь)',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], пополнил(а) кучу на [{count}] единиц дичи, {date}.'
        },
        {
            name: 'Пополнение кучи (мох)',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], пополнил(а) кучу на [{count}] единиц питьевого мха, {date}.'
        },
        {
            name: 'Обмен корма/огрызков',
               template: 'Я, [[n]\`l\`[/n]ink"{id}"], совершил(а) обмен [{count1}] корма/огрызков на [{count2}] корма/огрызков, {date}.'
        },
        {
            name: 'Порядок в кладовой',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], навел(а) порядок в Кладовой ({screenshot}), {date}'
        }
    ],
         // Хранители и уборщики
    'blog374643': [
        {
            name: 'Охрана курочки',
            template: 'Охрана Курочки\nДата: {date}\nОхранник: [[n]\`l\`[/n]ink"{id}"]\nВремя: {time_start}-{time_end}\nСобранные ресурсы: {resources}'
        },
        {
            name: 'Сбор ресурсов от Курочки',
            template: 'Сбор ресурсов от Курочки\nДата: {date}\nСборщик: [[n]\`l\`[/n]ink"{id}"]\nСобранные ресурсы: {resources}'
        },
        {
            name: 'Раздача поделок',
            template: 'Раздача поделок\nДата: {date}\nРаздающий: [[n]\`l\`[/n]ink"{id1}"]\nПолучивший: [[n]\`l\`[/n]ink"{id2}"]'
        },
        {
            name: 'Передача ресурсов дому',
            template: 'Передача дому ресурсов\nЯ, [[n]\`l\`[/n]ink"{id}"], передал дому {count} предмет [{item_name}].'
        },
        {
            name: 'Чистка в доме',
            template: 'Чистка в доме:\nДата: {date}\nВид деятельности: {activity}\nУборщик: [[n]\`l\`[/n]ink"{id}"]\nДоказательство: {proof}'
        },
        {
            name: 'Чистка вне дома',
            template: 'Чистка вне дома:\nДата: {date}\nВид деятельности: {activity}\nУборщик: [[n]\`l\`[/n]ink"{id}"]\nДоказательство: {proof}'
        }
    ],
         // Умельцы
    'blog387897': [
        {
            name: 'Оставление предмета',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], оставил(а) себе ({count}) предмет [{item_name}], [{points}].'
        },
        {
            name: 'Передача предмета',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], передал(а) дому ({count}) предмет [{item_name}], [{points}].'
        },
        {
            name: 'Дозор',
            template: 'Участники: [[n]\`l\`[/n]ink"{id}"]\nВремя дозора[мск]: {time_start}-{time_end}\nЗа весь день (часы и минуты в сумме)'
        }
    ],
         // АБИ
    'blog586100': [
        {
            name: 'Совместная тренировка',
            template: 'Отчёт о совместной тренировке\nВедущий: [[n]\`l\`[/n]ink"{id_leader}"]\nТренирующиеся: [[n]\`l\`[/n]ink"{id1}"], [[n]\`l\`[/n]ink"{id2}"], [[n]\`l\`[/n]ink"{id3}"]\nДата:{date}'
        },
        {
            name: 'Убийство птиц/крыс',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], убил(а) [{count}] птиц/крыс [{screenshot}] и получил(а) [{points}] баллов.'
        },
        {
            name: 'Повышение БУ',
            template: 'Я, [[n]\`l\`[/n]ink"{id}"], повысил(а) БУ на [{count}] единиц, [{screenshot1}], [{screenshot2}], и получил(а) [{points}] баллов.'
        },
        {
            name: 'Груша',
            template: 'Грушующий: [[n]\`l\`[/n]ink"{id}"], [{time}], [{bu_level}]'
        }

    ],
         // Бпин
    'blog444252': [
        {
            name: 'Нарушение',
                        template: 'Отписывающий: [[n]\`l\`[/n]ink"{id_reporter}"]\nНарушитель: [[n]\`l\`[/n]ink"{id_violator}"]\nСемья нарушителя:\nНарушение:\nДоказательство:\nДата нарушения:{date}'
        }
    ]
};

    // Формат даты
    const dateFormat = 'ГГГГ-ММ-ДД'; //  Можешь изменить на нужный формат

    // Ищем основное textarea на странице (можно изменить селектор)
    const myTextarea = document.querySelector('textarea');

    // Если textarea найдена, добавляем шаблон
    if (myTextarea) {
        // Определяем ID блога
        const blogId = getBlogId();
        const availableTemplates = templates[blogId] || [];

        // Создаем контейнер для шаблона
        const templateContainer = document.createElement('div');
        templateContainer.id = 'template-container';
        myTextarea.parentNode.insertBefore(templateContainer, myTextarea.nextSibling);

        // Создаем выпадающий список для выбора шаблона
        const templateSelect = document.createElement('select');
        templateSelect.id = 'templateSelect';
                availableTemplates.forEach((template, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.text = template.name;
            templateSelect.appendChild(option);
        });
        templateContainer.appendChild(templateSelect);

        // Создаем поле для ввода смещения даты
        const dateOffsetLabel = document.createElement('label');
        dateOffsetLabel.textContent = 'Смещение даты:';
        dateOffsetLabel.htmlFor = 'dateOffset';
        templateContainer.appendChild(dateOffsetLabel);

        const dateOffsetInput = document.createElement('input');
        dateOffsetInput.type = 'number';
        dateOffsetInput.id = 'dateOffset';
        dateOffsetInput.value = 0; // Смещение по умолчанию (сегодня)
        templateContainer.appendChild(dateOffsetInput);

        // Добавляем обработчик изменений в `select`
        templateSelect.addEventListener('change', () => {
            renderTemplate(availableTemplates[templateSelect.value].template);
        });

        // Добавляем обработчик изменений в `dateOffsetInput`
        dateOffsetInput.addEventListener('input', () => {
          const template = availableTemplates[templateSelect.value].template;
          if (template.includes('{date}')) {
            renderTemplate(template);
          }
        });

        // Функция для отрисовки шаблона
        function renderTemplate(template) {
            // Очищаем предыдущие поля
            const prevTemplateField = templateContainer.querySelector('.template-field');
            if (prevTemplateField) {
                prevTemplateField.remove();
            }
            const prevCopyButton = templateContainer.querySelector('#copyButton');
            if (prevCopyButton) {
                prevCopyButton.remove();
            }

            // Разбираем шаблон на части
            const templateParts = template.split(/(\{[a-z_]+\})/);

            // Создаем поля ввода для переменных
            const inputFields = {};
            const templateField = document.createElement('div');
            templateField.classList.add('template-field');
            templateParts.forEach((part) => {
    if (part.startsWith('{')) {
        const variableName = part.slice(1, -1);
        if (variableName === 'color_select') {
            // Создаем select для выбора цвета
            const select = document.createElement('select');
            select.id = variableName;
            const colors = ['красное', 'синее', 'черное']; // Здесь добавь нужные цвета
            colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.text = color;
                select.appendChild(option);
            });
            inputFields[variableName] = select;
            templateField.appendChild(select);
        } else if (variableName === 'shell_type_select') {
            // Создаем select для выбора типа ракушки
            const select = document.createElement('select');
            select.id = variableName;
            const shellTypes = ['обычная', 'блестящая', 'редкая']; // Здесь добавь нужные типы ракушек
            shellTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.text = type;
                select.appendChild(option);
            });
            inputFields[variableName] = select;
            templateField.appendChild(select);
                    }
                } else {
                    const label = document.createElement('span');
                    label.classList.add('label-text');
                    // Экранируем спецсимволы HTML
                    label.textContent = part.replace(/\[\[n\]\\`l\\`\[\/n\]/g, '[n]\`l\`[/n]');
                    templateField.appendChild(label);
                }
            });
            templateContainer.appendChild(templateField);
            // Обновляем значение метки даты
            updateDateLabel();

            // Создаем кнопку для копирования
            const copyButton = document.createElement('button');
            copyButton.id = 'copyButton';
            copyButton.textContent = 'Копировать в буфер';
            templateContainer.appendChild(copyButton);

            // Функция для форматирования даты
            function formatDate(date, format) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');

                return format.replace('ГГГГ', year).replace('ММ', month).replace('ДД', day);
            }

            // Функция для получения даты с учетом смещения
            function getOffsetDate(offset) {
                const today = new Date();
                const offsetDate = new Date(today);
                offsetDate.setDate(today.getDate() + offset);
                return offsetDate;
            }

            // Функция для обновления значения метки даты
            function updateDateLabel() {
                const dateLabel = templateContainer.querySelector('#dateLabel');
                if (dateLabel) {
                  const offset = parseInt(dateOffsetInput.value) || 0;
                  const offsetDate = getOffsetDate(offset);
                  dateLabel.textContent = `Дата: ${formatDate(offsetDate, dateFormat)}`;
                }
            }

            // Функция для заполнения и копирования текста
            function fillAndCopyText() {
                const data = {};
                for (const variableName in inputFields) {
                    data[variableName] = inputFields[variableName].value;
                }
                data['timeOfDay'] = getTimeOfDay();
                data['date'] = formatDate(getOffsetDate(parseInt(dateOffsetInput.value) || 0), dateFormat);
                let text = '';
                templateParts.forEach(part => {
                    if (part.startsWith('{')) {
                        const variableName = part.slice(1, -1);
                        text += data[variableName] || '';
                    } else {
                        text += part;
                    }
                });

                // Заполняем основное текстовое поле
                myTextarea.value = text;

                // Копируем текст в буфер обмена
                navigator.clipboard.writeText(text).then(function() {
                    console.log('Текст скопирован в буфер обмена!');
                    copyButton.textContent = 'Скопировано!';
                    setTimeout(() => {
                        copyButton.textContent = 'Копировать в буфер';
                    }, 2000);
                }).catch(function(err) {
                    console.error('Ошибка при копировании: ', err);
                });
            }

            // Слушаем изменения в полях ввода
            Object.values(inputFields).forEach(input => {
                input.addEventListener('input', () => {
                    const data = {};
                    for (const variableName in inputFields) {
                        data[variableName] = inputFields[variableName].value;
                    }
                    data['timeOfDay'] = getTimeOfDay();
                    data['date'] = formatDate(getOffsetDate(parseInt(dateOffsetInput.value) || 0), dateFormat);
                    let text = '';
                    templateParts.forEach(part => {
                        if (part.startsWith('{')) {
                            const variableName = part.slice(1, -1);
                            text += data[variableName] || '';
                        } else {
                            text += part;
                        }
                    });
                    myTextarea.value = text;
                });
            });

            // Слушаем клик по кнопке
            copyButton.addEventListener('click', fillAndCopyText);
        }

        // Вызываем функцию, чтобы отобразить шаблон по умолчанию
        if (availableTemplates.length > 0) {
            renderTemplate(availableTemplates[0].template);
        }

        // Функция для определения времени суток
        function getTimeOfDay() {
            const hour = new Date().getHours();
            if (hour >= 8 && hour < 13) {
                return 'утренняя вылазка';
            } else if (hour >= 13 && hour < 18) {
                return 'дневная вылазка';
            } else if (hour >= 18 && hour < 21) {
                return 'вечерняя вылазка';
         } else if (hour >= 21 && hour < 8) {
                return 'вечерняя вылазка';
            }
        }

        // Функция для извлечения ID блога из URL
        function getBlogId() {
            const match = window.location.pathname.match(/\/blog(\d+)/);
            if (match) {
                return 'blog' + match[1];
            }
            return null;
        }
    }
})();