// ==UserScript==
// @name         VK Chat Parser with Google Sheets Integration
// @namespace    http://tampermonkey.net/
// @version      0.36
// @description  Parse lists from all messages (both types in one message) and update Google Sheets
// @author       Grok
// @match        https://web.vk.me/convo/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530325/VK%20Chat%20Parser%20with%20Google%20Sheets%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/530325/VK%20Chat%20Parser%20with%20Google%20Sheets%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalList = [
        "Асеева Алиса", "Базарсадаева Айлана", "Бальжинимаев Лубсан", "Беина Маргарита",
        "Белоусова Виктория", "Белоусова Ольга", "Буянтуева Номин", "Воробьев Алексей",
        "Воробьева Светлана", "Воронов Артур", "Вторушин Константин", "Геращенко Ангелина",
        "Дашадоржиев Сандан", "Жамбалов Доржо", "Жигжитова Виктория", "Зиновьев Геннадий",
        "Иванов Роман", "Константинова Татьяна", "Лаухин Сергей", "Попов Роман",
        "Раднаева Ольга", "Распопова Мирослава", "Самбуева Сарана", "Сергеев Марк",
        "Славко Валентина", "Степанова Ангелина", "Цыжипова Баярма"
    ];

    const monthNames = [
        "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", "Январь",
        "Февраль", "Март", "Апрель", "Май"
    ];

    function initializeButton() {
        if (document.querySelector('button#parseButton') || !document.body) return;

        const button = document.createElement('button');
        button.id = 'parseButton';
        button.textContent = 'Отправить';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '150px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            button.disabled = true;
            button.style.backgroundColor = '#f44336';
            button.textContent = 'Найдено 0';
            parseAndUpdate(button).finally(() => {
                button.disabled = false;
                button.style.backgroundColor = '#4CAF50';
                button.textContent = 'Отправить';
            });
        });
        console.log('Кнопка инициализирована');
    }

    document.addEventListener('DOMContentLoaded', initializeButton);
    setInterval(() => {
        if (!document.querySelector('button#parseButton') && document.body) {
            console.log('Периодическая инициализация кнопки');
            initializeButton();
        }
    }, 1000);

    function findClosestMatch(inputName) {
        const inputLower = inputName.toLowerCase().replace(/\.\s*/g, ' ').trim();
        const inputParts = inputLower.split(' ');
        const inputSurname = inputParts[0];
        const inputInitial = inputParts[1] ? inputParts[1][0] : '';

        return originalList.find(original => {
            const originalLower = original.toLowerCase().replace(/\s+/g, ' ');
            const originalParts = originalLower.split(' ');
            const originalSurname = originalParts[0];
            const originalInitial = originalParts[1] ? originalParts[1][0] : '';

            if (originalSurname === 'воробьев' || originalSurname === 'воробьева' ||
                originalSurname === 'белоусова') {
                return originalSurname === inputSurname && originalInitial === inputInitial;
            } else {
                return originalSurname === inputSurname;
            }
        }) || inputName;
    }

    function parseMessageText(htmlContent) {
        const text = htmlContent.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length < 2) return { absent: [], notEating: [] };

        let absentLines = [];
        let notEatingLines = [];
        let currentList = null;

        lines.forEach((line, index) => {
            const lowerLine = line.toLowerCase();

            if (lowerLine.match(/^\d+\/\d+$/) && index === 0) {
                return;
            } else if (lowerLine.includes('нет')) {
                currentList = 'absent';
            } else if (lowerLine.includes('не кушают')) {
                currentList = 'notEating';
            } else if (currentList && line.trim()) {
                const matchedName = findClosestMatch(line);
                if (currentList === 'absent') {
                    absentLines.push(matchedName);
                } else if (currentList === 'notEating') {
                    notEatingLines.push(matchedName);
                }
            }
        });

        return {
            absent: absentLines,
            notEating: notEatingLines,
            absentList: absentLines.length ? '\n' + absentLines.join('\n') : '',
            notEatingList: notEatingLines.length ? '\n' + notEatingLines.join('\n') : ''
        };
    }

    function getDateFromLabel(label, currentDate) {
        const normalizedLabel = label.toLowerCase().trim();
        const date = new Date(currentDate);

        if (normalizedLabel === 'сегодня') {
            // Используем текущую дату
        } else if (normalizedLabel === 'вчера') {
            date.setDate(date.getDate() - 1);
        } else {
            const [dayStr, monthStr] = normalizedLabel.split(' ');
            const day = parseInt(dayStr, 10);
            const monthMap = {
                'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3,
                'мая': 4, 'июня': 5, 'июля': 6, 'августа': 7,
                'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
            };
            const month = monthMap[monthStr];
            if (day && month !== undefined) {
                date.setDate(day);
                date.setMonth(month);
                if (month > date.getMonth()) {
                    date.setFullYear(date.getFullYear() - 1);
                }
            }
        }

        const dayStr = String(date.getDate()).padStart(2, '0');
        const monthStr = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${dayStr}.${monthStr}.${year}`;
    }

    function updateGoogleSheets(absentList, notEatingList, dateString, sheetName) {
        return new Promise((resolve, reject) => {
            const payload = JSON.stringify({
                sheetName: sheetName,
                absent: absentList,
                notEating: notEatingList,
                date: dateString
            });

            console.log(`Отправляемые данные для ${dateString}:`, payload);

            const apiUrl = 'https://script.google.com/macros/s/AKfycbzSjufiH1WUjKPSLq_k3Un6Q-FB_n6R_dVCrzDlz4Hxg2HOkVg4llng_c-cP7gOmPeO/exec';
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: { 'Content-Type': 'application/json' },
                    data: payload,
                    onload: response => {
                        console.log(`Ответ от API для ${dateString}:`, response.responseText);
                        resolve();
                    },
                    onerror: error => {
                        console.error(`Ошибка GM_xmlhttpRequest для ${dateString}:`, error);
                        reject(error);
                    }
                });
            } else {
                console.warn('GM_xmlhttpRequest не доступен, используем fetch');
                fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    mode: 'no-cors'
                })
                .then(() => {
                    console.log(`Данные отправлены через fetch для ${dateString} (no-cors)`);
                    resolve();
                })
                .catch(error => {
                    console.error(`Ошибка fetch для ${dateString}:`, error);
                    reject(error);
                });
            }
        });
    }

    async function parseAndUpdate(button) {
        const currentDate = new Date(); // Фиксируем дату для примера
        const dateSeparators = document.querySelectorAll('.DateSeparator');
        let hasLists = false;

        if (!dateSeparators.length) {
            console.log('Блоки дат не найдены');
            button.textContent = 'Ошибка';
            button.style.backgroundColor = '#f44336';
            await new Promise(resolve => setTimeout(resolve, 3000)); // Ждём 3 секунды
            return;
        }

        const dataByDate = {};

        dateSeparators.forEach(separator => {
            const label = separator.textContent.trim();
            const dateString = getDateFromLabel(label, currentDate);
            const dateStack = separator.closest('.ConvoHistory__dateStack');
            if (!dateStack) return;

            const convoStacks = dateStack.querySelectorAll('.ConvoStack');
            let absentList = [];
            let notEatingList = [];

            convoStacks.forEach(stack => {
                const messages = stack.querySelectorAll('.ConvoMessage');
                messages.forEach(message => {
                    const content = message.querySelector('.ConvoMessage__text');
                    if (content) {
                        const messageHtml = content.innerHTML;
                        const result = parseMessageText(messageHtml);

                        if (result.absent.length && absentList.length === 0) {
                            absentList = result.absent;
                            console.log(`Отсутствующие (${label}):`, result.absentList);
                        }
                        if (result.notEating.length && notEatingList.length === 0) {
                            notEatingList = result.notEating;
                            console.log(`Не кушают (${label}):`, result.notEatingList);
                        }
                    }

                    const forwardedContainer = message.querySelector('.ConvoMessage__forwardedMessages');
                    if (forwardedContainer) {
                        const forwardedMessages = forwardedContainer.querySelectorAll('.ForwardedMessageNew__text');
                        forwardedMessages.forEach(fwdText => {
                            const fwdHtml = fwdText.innerHTML;
                            const fwdResult = parseMessageText(fwdHtml);

                            if (fwdResult.absent.length && absentList.length === 0) {
                                absentList = fwdResult.absent;
                                console.log(`Отсутствующие (пересылаемое, ${label}):`, fwdResult.absentList);
                            }
                            if (fwdResult.notEating.length && notEatingList.length === 0) {
                                notEatingList = fwdResult.notEating;
                                console.log(`Не кушают (пересылаемое, ${label}):`, fwdResult.notEatingList);
                            }
                        });
                    }
                });
            });

            if (absentList.length || notEatingList.length) {
                dataByDate[dateString] = { absentList, notEatingList };
                hasLists = true;
            }
        });

        const listCount = Object.keys(dataByDate).length; // Количество дней с данными

        if (!hasLists) {
            console.log('Списки не найдены');
            button.textContent = 'Ошибка';
            button.style.backgroundColor = '#f44336';
            await new Promise(resolve => setTimeout(resolve, 3000)); // Ждём 3 секунды
        } else {
            button.textContent = `Найдено ${listCount}`;
            const promises = Object.entries(dataByDate).map(([dateString, { absentList, notEatingList }]) => {
                const date = new Date(dateString.split('.').reverse().join('-'));
                const monthIndex = date.getMonth();
                const adjustedIndex = (monthIndex + 4) % 12; // Сдвиг для учебного года
                const sheetName = monthNames[adjustedIndex];

                console.log(`=== Результаты для ${dateString} ===`);
                console.log('Отсутствующие:', absentList.length ? '\n' + absentList.join('\n') : 'Список не найден');
                console.log('Не кушают:', notEatingList.length ? '\n' + notEatingList.join('\n') : 'Список не найден');

                return updateGoogleSheets(absentList, notEatingList, dateString, sheetName);
            });

            await Promise.all(promises);
        }
    }

    initializeButton();
})();