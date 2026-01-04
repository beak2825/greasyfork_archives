// ==UserScript==
// @name        Lalafo Context Menu Enhancer
// @namespace   Violentmonkey Scripts
// @match       https://lalafo.creatio.com/*
// @grant       none
// @version     1.8
// @description 14.08.2024, 14:39:26
// @downloadURL https://update.greasyfork.org/scripts/501171/Lalafo%20Context%20Menu%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/501171/Lalafo%20Context%20Menu%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LinkModule = (() => {
        const showLinks = (userId, x, y) => {
            const existingElement = document.getElementById('link-popup');
            if (existingElement) {
                existingElement.remove();
            }

            const linkPopup = document.createElement('div');
            linkPopup.id = 'link-popup';
            linkPopup.style.position = 'absolute';
            linkPopup.style.top = `${y}px`;
            linkPopup.style.left = `${x}px`;
            linkPopup.style.zIndex = '10000';

            const shadow = linkPopup.attachShadow({mode: 'open'});

            const style = document.createElement('style');
            style.textContent = `
            @import url('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
            .popup-content {
                background-color: white;
                border: 1px solid black;
                padding: 15px;
                box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
                border-radius: 8px;
                width: 300px;
                position: relative;
            }
            .btn-close {
                position: absolute;
                top: 5px;
                right: 5px;
                background: transparent;
                border: none;
                font-size: 24px;
                cursor: pointer;
                line-height: 1;
            }
            .link-title {
                display: block;
                padding: 10px 15px;
                margin: 10px 0;
                background-color: #007bff;
                color: white;
                text-align: center;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s;
            }
            .link-title:hover {
                background-color: #0056b3;
                color: white;
            }
            `;
            shadow.appendChild(style);

            const container = document.createElement('div');
            container.className = 'popup-content';

            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.className = 'btn-close';
            closeButton.addEventListener('click', () => {
                linkPopup.remove();
            });
            container.appendChild(closeButton);

            const links = [
                {title: 'Категории', url: `https://admin.lalafo.com/user-micromarket/index?user_id=${userId}`},
                {title: 'Перейти в профиль', url: `https://admin.lalafo.com/user/login-to-account?user_id=${userId}`},
                {title: 'Кошелек', url: 'https://admin.lalafo.com/account-v0/hand-replenishment'},
                {title: 'Снятие', url: 'https://admin.lalafo.com/account-v0/manual-withdraw'},
                {title: 'Пополнение клиента', url: 'https://admin.lalafo.com/purchase-v0/replenishment'},
                {title: 'Пополнение в офисе', url: 'https://admin.lalafo.com/purchase-v0/manually'}
            ];

            links.forEach(link => {
                const linkTitle = document.createElement('a');
                linkTitle.className = 'link-title';
                linkTitle.textContent = link.title;
                linkTitle.href = link.url;
                linkTitle.target = '_blank';
                container.appendChild(linkTitle);
            });

            shadow.appendChild(container);
            document.body.appendChild(linkPopup);
        };

        return {
            showLinks
        };
    })();

    const CopyModule = (() => {
        let userIdIndex = -1;

        const createCopyIcon = (userIdSpan) => {
            const copyIcon = document.createElement('img');
            copyIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTYgMUg0YTIgMiAwIDAgMC0yIDJ2MTRoMnYtMTRoMTJ2LTEuOTk5OTloLS4wMDAwMXptNSA0SDhhMiAyIDAgMCAwLTIgMnYxNGgyYTEgMSAwIDAgMCAxLTF2LTEyaDEydjE0YTIgMiAwIDAgMCAyLTJWN2EyIDIgMCAwIDAtMi0yem0wIDE2SDhWN2gxM3YxNHoiLz48L3N2Zz4K';
            copyIcon.classList.add('copy-icon');
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.marginLeft = '5px';
            copyIcon.addEventListener('click', async (event) => {
                const {top, left} = userIdSpan.getBoundingClientRect();
                try {
                    await navigator.clipboard.writeText(userIdSpan.textContent);
                    console.log('User ID copied to clipboard:', userIdSpan.textContent);
                } catch (err) {
                    console.error('Failed to copy text:', err);
                }
                LinkModule.showLinks(userIdSpan.textContent, left, top);
            });
            return copyIcon;
        };

        const addCopyIcon = (parentElement) => {
            console.log('Метод addCopyIcon вызван.');
            const gridCaptions = parentElement.querySelector('.grid-captions');
            if (!gridCaptions) {
                console.log('Grid captions не найдены. Переход к addCopyIconV2.');
                return addCopyIconV2(parentElement);
            }

            if (userIdIndex === -1) {
                const headers = Array.from(gridCaptions.querySelectorAll('div'));
                userIdIndex = headers.findIndex(header => header.getAttribute('data-item-marker') === 'user_id');
                if (userIdIndex === -1) {
                    console.log('Столбец user_id не найден. Переход к addCopyIconV2.');
                    return addCopyIconV2(parentElement);
                }
            }

            const rows = parentElement.getElementsByClassName('grid-listed-row');
            let addedCount = 0;
            let foundElementsInFirstLoop = false; // Флаг для отслеживания нахождения элементов

            // Первый цикл: поиск по определённому столбцу user_id и проверка, что содержимое — число
            Array.from(rows).forEach(row => {
                const cells = row.childNodes;
                const userIdCell = cells[userIdIndex];
                const userIdSpan = userIdCell.querySelector('span[grid-data-type="text"]');
                if (userIdSpan) {
                    const userIdText = userIdSpan.textContent.trim();
                    if (/^\d+$/.test(userIdText)) { // Проверка, что текст содержит только цифры
                        if (!userIdCell.querySelector('.copy-icon')) {
                            foundElementsInFirstLoop = true; // Элемент найден
                            const copyIcon = createCopyIcon(userIdSpan);
                            userIdCell.appendChild(copyIcon);
                            console.log(`addCopyIcon: Иконка копирования добавлена для user_id: ${userIdText}`);
                        }
                    } else {
                        console.log(`addCopyIcon: user_id не является числом: "${userIdText}". Иконка не добавлена.`);
                    }
                }
            });

            if (!foundElementsInFirstLoop) {
                console.log('Первый цикл не нашёл ни одного элемента с user_id. Переход ко второму циклу.');
                let secondAddedCount = 0;

                Array.from(rows).forEach(row => {
                    const spans = row.querySelectorAll('span[grid-data-type="text"]');
                    spans.forEach(span => {
                        const spanText = span.textContent.trim();
                        if (/^\d+$/.test(spanText)) { // Проверка, что текст содержит только цифры
                            if (!span.parentElement.querySelector('.copy-icon')) {
                                const copyIcon = createCopyIcon(span);
                                span.parentElement.appendChild(copyIcon);
                                secondAddedCount++;
                                console.log(`addCopyIconV2: Иконка копирования добавлена для user_id: ${spanText}`);
                            }
                        }
                    });
                });

                if (secondAddedCount > 0) {
                    console.log(`addCopyIconV2: Добавлено ${secondAddedCount} иконок копирования во втором цикле.`);
                } else {
                    console.log('Второй цикл не добавил ни одной иконки.');
                }
            }

            if (addedCount > 0) {
                console.log(`addCopyIcon: Добавлено ${addedCount} иконок копирования.`);
            }
        };

        const addCopyIconV2 = (parentElement) => {
            console.log('Метод addCopyIconV2 вызван.');
            const userIdDivs = parentElement.querySelectorAll('div.grid-cols-4');
            let addedCount = 0;
            userIdDivs.forEach(div => {
                const labelSpan = div.querySelector('span.grid-label');
                const valueSpan = div.querySelector('span[grid-data-type="text"]');

                if (labelSpan && labelSpan.textContent.trim() === 'user_id' &&
                    valueSpan && !isNaN(valueSpan.textContent.trim())) {
                    if (!div.querySelector('.copy-icon')) {
                        const copyIcon = createCopyIcon(valueSpan);
                        div.appendChild(copyIcon);
                        addedCount++;
                    }
                }
            });
            if (addedCount > 0) {
                console.log(`addCopyIconV2: Добавлено ${addedCount} иконок копирования.`);
            }
        };

        const addCopyIconV3 = (parentElement) => {
            console.log('Метод addCopyIconV3 вызван.');
            const labelElement = Array.from(parentElement.querySelectorAll('label')).find(label => label.textContent.trim() === 'user_id');
            if (!labelElement) {
                console.log('Элемент label с текстом "user_id" не найден.');
                return;
            }

            const labelWrap = labelElement.closest('.label-wrap');
            if (!labelWrap) {
                console.log('Элемент label-wrap не найден.');
                return;
            }

            const controlWrap = labelWrap.nextElementSibling;
            if (controlWrap && controlWrap.classList.contains('control-wrap')) {
                const inputElement = controlWrap.querySelector('input');
                if (inputElement && !controlWrap.querySelector('.copy-icon')) {
                    const copyIcon = createCopyIcon(inputElement);
                    controlWrap.appendChild(copyIcon);
                    console.log('addCopyIconV3: Иконка копирования добавлена.');
                }
            } else {
                console.log('Элемент control-wrap не найден или не содержит ожидаемого класса.');
            }
        };

        return {
            addCopyIcon,
            addCopyIconV2,
            addCopyIconV3
        };
    })();

    const MainModule = (() => {
        const initialize = () => {
            const checkAndAddCopyIcon = () => {
                let parentElement = document.getElementById('AccountContactsDetailV2DetailControlGroup');
                if (parentElement) {
                    CopyModule.addCopyIcon(parentElement);
                } else {
                    parentElement = document.getElementById('ContactPageV2ContactGeneralInfoBlockGridLayout');
                    if (parentElement) {
                        CopyModule.addCopyIconV3(parentElement);
                    } else {
                        console.log('Элементы "AccountContactsDetailV2DetailControlGroup" и "ContactPageV2ContactGeneralInfoBlockGridLayout" не найдены.');
                    }
                }
            }

            setInterval(checkAndAddCopyIcon, 2000);
        };

        return {
            initialize
        };
    })();

    MainModule.initialize();
})();