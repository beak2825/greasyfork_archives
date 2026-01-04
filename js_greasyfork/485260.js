// ==UserScript==
// @name         Theme & Font Changer
// @namespace    https://logs.blackrussia.online/
// @version      0.4.3.3
// @description  Theme Changer + Font Changer for Black Logs
// @author       Lukky
// @match        https://logs.blackrussia.online/gslogs/*
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @license      Lukky
// @downloadURL https://update.greasyfork.org/scripts/485260/Theme%20%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/485260/Theme%20%20Font%20Changer.meta.js
// ==/UserScript==
(function () {
    'use strict';

    scriptInit();

    function createStyleButton(element) {

        const styleToggle = document.createElement('button');
        styleToggle.className = 'style-button';
        styleToggle.id = 'style-modal-toggle';
        styleToggle.href = '#!';
        styleToggle.tabIndex = '0';
        styleToggle.dataset.bsToggle = 'modal';
        styleToggle.dataset.bsTarget = '#container-background';
        styleToggle.textContent = 'STYLE';

        const replaceElement = document.querySelector(element);
        replaceElement.replaceWith(styleToggle);
    }

    function createStyleContainerBg(element) {

        const containerBg = document.createElement('div');
        containerBg.className = 'modal fade';
        containerBg.id = 'container-background';
        containerBg.tabIndex = '-1';
        containerBg.style.dispaly = 'none';
        containerBg.ariaHidden = 'true';

        const parentElement = document.querySelector(element);
        parentElement.parentNode.insertBefore(containerBg, parentElement);

        const containerContent = document.createElement('div');
        containerContent.className = 'modal-dialog modal-dialog-centered';
        containerContent.id = 'style-container-content';
        containerBg.appendChild(containerContent);

        const styleContainer = document.createElement('div');
        styleContainer.className = 'modal-content';
        containerContent.appendChild(styleContainer);

        const styleContHead = document.createElement('div');
        const styleContBody = document.createElement('div');
        styleContHead.className = 'modal-header';
        styleContBody.className = 'modal-body';
        styleContBody.style.display = 'flex';
        styleContBody.style.flexDirection = 'column';
        styleContainer.appendChild(styleContHead);
        styleContainer.appendChild(styleContBody);

        const styleTitleBadge = document.createElement('span');
        styleTitleBadge.className = 'badge bg-success';
        styleTitleBadge.textContent = 'STYLE';
        styleTitleBadge.style.fontSize = '16px';
        styleContHead.appendChild(styleTitleBadge);

        const styleTitleText = document.createElement('span');
        styleTitleText.className = 'style-title-text';
        styleTitleText.textContent = 'Переключатель Тем';
        styleContHead.appendChild(styleTitleText);

        const styleClose = document.createElement('button');
        styleClose.type = 'button';
        styleClose.className = 'btn-close';
        styleClose.dataset.bsDismiss = 'modal';
        styleClose.ariaLabel = 'Close';
        styleContHead.appendChild(styleClose);

        const switchStyleBlock = document.createElement('label');
        switchStyleBlock.className = 'switch';
        switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Переливание Текста
            <span class="tooltip-style-text">Добавляет анимированный градиент на некоторые элементы (повышается нагрузка)</span></div>
            </span>
        `;
        styleContBody.appendChild(switchStyleBlock);

        const styleToggleCheck = document.getElementById('styleToggleCheck');
        if (localStorage.getItem('styleThemeEnabled') === 'true') {
            styleToggleCheck.checked = true;
            applyTextGradient();
        }
        styleToggleCheck.addEventListener('change', function () {
            if (styleToggleCheck.checked) {
                applyTextGradient();
                localStorage.setItem('styleThemeEnabled', 'true');
            } else {
                removeTextGradient();
                localStorage.setItem('styleThemeEnabled', 'false');
            }
        });

        const switchNumsBlock = document.createElement('label');
        switchNumsBlock.className = 'switch';
        switchNumsBlock.innerHTML = `
            <input type="checkbox" id="switchNumsCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Разряды Чисел
            <span class="tooltip-style-text">Переключает способ отображения чисел (1000 => 1 000)<br>Требуется Перезагрузка</span><img src='https://cdn-icons-png.flaticon.com/512/25/25429.png' style='width: 15px; height: 15px; filter: invert(1)'></img></div>
            </span>
        `;
        switchNumsBlock.style.marginTop = '20px';
        styleContBody.appendChild(switchNumsBlock);

        const switchNumsCheck = document.getElementById('switchNumsCheck');
        if (localStorage.getItem('numsSeparateEnabled') === 'true') {
            switchNumsCheck.checked = true;
            applyNumsSeparate();
        }
        switchNumsCheck.addEventListener('change', function () {
            if (switchNumsCheck.checked) {
                applyNumsSeparate();
                localStorage.setItem('numsSeparateEnabled', 'true');
                location.reload();
            } else {
                localStorage.setItem('numsSeparateEnabled', 'false');
                location.reload();
            }
        });

        const switchCopyBankBlock = document.createElement('label');
        switchCopyBankBlock.className = 'switch';
        switchCopyBankBlock.innerHTML = `
            <input type="checkbox" id="switchBankCopyCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Режим Доказательств
            <span class="tooltip-style-text">Копирование описания транзакций всех категорий (кроме Бизнесы/Фракции) в без системной информации<br>Требуется перезагрузка</span><img src='https://cdn-icons-png.flaticon.com/512/25/25429.png' style='width: 15px; height: 15px; filter: invert(1)'></img></div>
            </span>
        `;
        switchCopyBankBlock.style.marginTop = '20px';
        styleContBody.appendChild(switchCopyBankBlock);

        const switchCopyBank = document.getElementById('switchBankCopyCheck');
        if (localStorage.getItem('bankCheckEnabled') === 'true') {
            switchCopyBank.checked = true;
            applyCopyDocs();
        }
        switchCopyBank.addEventListener('change', function () {
            if (switchCopyBank.checked) {
                applyCopyDocs();
                localStorage.setItem('bankCheckEnabled', 'true');
                location.reload();
            } else {
                localStorage.setItem('bankCheckEnabled', 'false');
                location.reload();
            }
        });

        const fontSelectorBlock = document.createElement('label');
        fontSelectorBlock.className = 'font-selector-block';
        styleContBody.appendChild(fontSelectorBlock);

        const fontSelector = document.createElement('select');
        fontSelector.className = 'selector';
        fontSelector.id = 'font-selector';
        const storedFont = localStorage.getItem('selectedFont') || 'Roboto';
        const fonts = ['Bad Script', 'Comfortaa', 'Fira Sans', 'Marmelad', 'Montserrat', 'Neucha', 'Play', 'Roboto', 'Sofia Sans', 'Ubuntu'];
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            if (font === storedFont) {
                option.selected = true;
                document.body.style.fontFamily = font;
            }
            fontSelector.appendChild(option);
        });
        fontSelector.addEventListener('change', function () {
            const selectedFont = this.value;
            document.body.style.fontFamily = selectedFont;
            localStorage.setItem('selectedFont', selectedFont);
        });
        fontSelectorBlock.appendChild(fontSelector);

        const fontSelectorText = document.createElement('span');
        fontSelectorText.className = 'addingText';
        fontSelectorText.textContent = 'Выбор Шрифта';
        fontSelectorBlock.appendChild(fontSelectorText);

        const colorSelectorBlock = document.createElement('label');
        colorSelectorBlock.className = 'color-selector-block';
        styleContBody.appendChild(colorSelectorBlock);

        const colorSelector = document.createElement('select');
        colorSelector.className = 'selector';
        colorSelector.id = 'color-selector';
        const storedColor = localStorage.getItem('selectedColor') || 'WHITE';
        const colors = ['-------МЯГКИЕ-------', 'PINK', 'KHAKI', 'SKYBLUE', 'PALEGREEN', '', '-------ЯРКИЕ-------', 'RED', 'LIME', 'CYAN', 'WHITE', 'YELLOW', 'MAGENTA', 'DEEPPINK',];
        const colorCodes = {
            'PINK': '#FFC0CB',
            'KHAKI': '#F0E68C',
            'SKYBLUE': '#87CEEB',
            'PALEGREEN': '#98FB98',
            'RED': '#FF0000',
            'LIME': '#00FF00',
            'CYAN': '#00FFFF',
            'WHITE': '#FFFFFF',
            'YELLOW': '#FFFF00',
            'MAGENTA': '#FF00FF',
            'DEEPPINK': '#FF1493'
        };
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            if (color === storedColor) {
                option.selected = true;
                applySelectedStyle(colorCodes[color]);
            }
            colorSelector.appendChild(option);
        });
        colorSelector.addEventListener('change', function () {
            if (this.value !== '-------МЯГКИЕ-------' && this.value !== '' && this.value !== '-------ЯРКИЕ-------') {
                const selectedColor = this.value;
                localStorage.setItem('selectedColor', selectedColor);
                applySelectedStyle(colorCodes[selectedColor]);
            }
        });
        colorSelectorBlock.appendChild(colorSelector);

        const colorSelectorText = document.createElement('span');
        colorSelectorText.className = 'addingText';
        colorSelectorText.textContent = 'Выбор Цвета';
        colorSelectorBlock.appendChild(colorSelectorText);

        const brightnessSliderBlock = document.createElement('label');
        brightnessSliderBlock.className = 'brightness-slider-block';
        styleContBody.appendChild(brightnessSliderBlock);

        const storedBright = localStorage.getItem('savedBrightness') || '100';
        const htmlContent = document.querySelector('html');
        const brightnessSlider = document.createElement('input');
        htmlContent.style.filter = `brightness(${storedBright}%)`
        brightnessSlider.id = 'brightness-slider';
        brightnessSlider.type = 'range';
        brightnessSlider.min = '30';
        brightnessSlider.max = '100';
        brightnessSlider.style.marginTop = '30px';
        brightnessSlider.style.marginRight = '10px';
        brightnessSlider.value = storedBright;
        brightnessSlider.addEventListener('input', function () {
            const brightnessValue = this.value;
            localStorage.setItem('savedBrightness', brightnessValue);
            htmlContent.style.filter = `brightness(${brightnessValue}%)`;
        });
        brightnessSliderBlock.appendChild(brightnessSlider);

        const brightnessSliderText = document.createElement('span');
        brightnessSliderText.className = 'addingText';
        brightnessSliderText.textContent = 'Выбор Яркости';
        brightnessSliderBlock.appendChild(brightnessSliderText);

        const nickColorBlock = document.createElement('label');
        nickColorBlock.className = 'color-picker-nickname';
        styleContBody.appendChild(nickColorBlock);

        const colorNickElement = document.createElement('input');
        const nickColor = localStorage.getItem('playerNameColor') || '#ff8800';
        colorNickElement.className = 'color-picker';
        colorNickElement.type = 'color';
        colorNickElement.value = nickColor;
        colorNickElement.addEventListener('input', function () {
            const selectedColor = colorNickElement.value;
            const tdElements = document.querySelectorAll('td.td-player-name[data-v-2d76ca92=""]');
            localStorage.setItem('playerNameColor', selectedColor);
            tdElements.forEach(function (td) {
                const playerNick = td.querySelector('a');
                if (playerNick) {
                    playerNick.style.color = selectedColor;
                    playerNick.style.textShadow = '0px 0px 1px' + selectedColor;
                }
            });
        });
        nickColorBlock.appendChild(colorNickElement);

        const colorNickText = document.createElement('span');
        colorNickText.className = 'addingText';
        colorNickText.textContent = 'Цвет Никнеймов';
        nickColorBlock.appendChild(colorNickText);

        const categoryColorBlock = document.createElement('label');
        nickColorBlock.className = 'color-picker-category';
        styleContBody.appendChild(categoryColorBlock);

        const colorCategoryElement = document.createElement('input');
        const categoryColor = localStorage.getItem('categoryColor') || '#0088ff';
        colorCategoryElement.className = 'color-picker';
        colorCategoryElement.type = 'color';
        colorCategoryElement.value = categoryColor;
        colorCategoryElement.addEventListener('input', function () {
            const selectedColor = colorCategoryElement.value;
            const tdElements = document.querySelectorAll('td.td-category[data-v-2d76ca92=""]');
            localStorage.setItem('categoryColor', selectedColor);
            tdElements.forEach(function (td) {
                const category = td.querySelector('a');
                if (category) {
                    category.style.color = selectedColor;
                    category.style.textShadow = '0px 0px 1px' + selectedColor;
                }
            });
        });
        categoryColorBlock.appendChild(colorCategoryElement);

        const colorCategoryText = document.createElement('span');
        colorCategoryText.className = 'addingText';
        colorCategoryText.textContent = 'Цвет Категорий';
        categoryColorBlock.appendChild(colorCategoryText);

        const bugReportBlock = document.createElement('label');
        bugReportBlock.className = 'bug-report-block';
        styleContBody.appendChild(bugReportBlock);

        const bugReportTG = document.createElement('a');
        bugReportTG.href = 'https://t.me/solukky'
        bugReportTG.target = '_blank';
        bugReportTG.innerHTML = `<img class="bug-report-button" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"></img>`;
        bugReportBlock.appendChild(bugReportTG);

        const bugReportVK = document.createElement('a');
        bugReportVK.href = 'https://vk.me/solukky'
        bugReportVK.target = '_blank';
        bugReportVK.innerHTML = `<img class="bug-report-button" src="https://cdn-icons-png.flaticon.com/512/145/145813.png"></img>`;
        bugReportBlock.appendChild(bugReportVK);

        const bugReportGF = document.createElement('a');
        bugReportGF.href = 'https://greasyfork.org/ru/scripts/475162-theme-font-changer/feedback'
        bugReportGF.target = '_blank';
        bugReportGF.innerHTML = `<img class="bug-report-button" src="https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png"></img>`;
        bugReportBlock.appendChild(bugReportGF);

        const bugReportText = document.createElement('span');
        bugReportText.className = 'addingText';
        bugReportText.textContent = 'Баг / Предложение';
        bugReportBlock.appendChild(bugReportText);

    }

    function applyNumsSeparate() {

        function formatNumbersInTable() {

            const tableCells = document.querySelectorAll('td.td-transaction-amount, td.td-balance-after');
            tableCells.forEach(cell => {
                const text = cell.textContent.trim();
                if (!isNaN(text.replace(/,/g, ''))) {
                    const originalValue = parseInt(text.replace(/,/g, ''));
                    const formattedValue = originalValue.toLocaleString('ru');
                    cell.textContent = formattedValue.toString();
                    cell.addEventListener('copy', function (event) {
                        event.clipboardData.setData('text/plain', formattedValue.replace(/\s/g, ''));
                        event.preventDefault();
                    });
                }
            });
        }

        window.onload = function () {
            formatNumbersInTable();
        };

        const observer = new MutationObserver(function (mutationsList) {
            formatNumbersInTable();
        });

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(document.body, config);

    }

    function applyCopyDocs() {

        function formatTransactionsInTable() {

            const tableRows = document.querySelectorAll('tr.second-row');
            tableRows.forEach(row => {
                const transactionCell = row.querySelector('.td-transaction-desc');
                const playerName = row.previousSibling.querySelector('.td-player-name a').textContent;
                const categoryName = row.previousSibling.querySelector('.td-category a').textContent;
                const transactionAmount = row.previousSibling.querySelector('.td-transaction-amount').textContent;
                const transactionDate = row.previousSibling.querySelector('.td-time').textContent.replace(/\s/g, ' | ');
                const originalText = transactionCell.textContent;

                transactionCell.addEventListener('copy', function (event) {
                    const selection = window.getSelection().toString();
                    if (selection.length >= transactionCell.textContent.length) {


                        function replaceData(expected = '', regex = '') {
                            if (regex != '') {
                                var final = originalText.replace(regex, expected);
                            } else {
                                var final = expected;
                            }
                            event.clipboardData.setData('text/plain', final);
                            event.preventDefault();
                        }


                        function notSupported() {
                            alert('Данная строка не поддерживается скриптом, отправьте эту строку автору скрипта');
                            event.clipboardData.setData('text/plain', originalText);
                            event.preventDefault();
                        }

                        if (categoryName === 'BlackPass') {
                            if (originalText.includes('Получил')) {
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - $1`, /(Получил .+)/,);
                            } else if (originalText.includes('+ Выдача')) {
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей`);
                            }
                        } else if (categoryName === 'Helper чат') {
                            if (originalText) {
                                replaceData(`[Helper чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'NonRP чат') {
                            if (originalText) {
                                replaceData(`[NonRP чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'RP чат') {
                            if (originalText) {
                                replaceData(`[RP чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'VIP чат') {
                            if (originalText) {
                                replaceData(`[VIP чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-блокировки') {
                            if (originalText) {
                                replaceData(`[Админ-блокировки | ${transactionDate}] ${playerName} - "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-действия') {
                            if (originalText) {
                                replaceData(`[Админ-действия | ${transactionDate}] ${playerName} - "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-общий-чат') {
                            if (originalText) {
                                replaceData(`[Глобальный чат (/msg) | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-супердействия') {
                            if (originalText) {
                                replaceData(`[Админ-супердействия | ${transactionDate}] ${playerName} - "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Админ-чат') {
                            if (originalText) {
                                replaceData(`[Админ-чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Аккаунт игрока') {
                            if (originalText.includes('законопослушности')) {
                                replaceData(`[Законопослушность | ${transactionDate}] ${playerName} - Изменение законопослушности, итог: $1. Причина: $2`, /^.*значение: (.*). Причина: (.*)/);
                            } else if (originalText.includes('уровень')) {
                                replaceData(`[Уровень игрока | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Сменил пароль')) {
                                replaceData(`[Пароль | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('EXP:')) {
                                replaceData(`[Опыт (EXP) | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Привязал аккаунт')) {
                                replaceData(`[Аккаунт | ${transactionDate}] ${playerName} - $1`, /^\+ (.*)$/);
                            }
                        } else if (categoryName == 'Античит') {
                            if (originalText) {
                                replaceData(`[Античит | ${transactionDate}] ${playerName} - Подозрение на чит: $1`, /^.*: (.*) \|.*$/);
                            }
                        } else if (categoryName == 'Аренда транспорта') {
                            if (originalText) {
                                replaceData(`[Аренда Транспорта | ${transactionDate}] ${playerName} $1 за ${transactionAmount.replace('-', '')} рублей`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Аукцион') {
                            if (originalText.includes('Выставил')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - $1 рублей`, /^(.*)$/);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Продал')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - Продал $1 и получил ${transactionAmount} рублей`, /^.*аукционе (.*) \(возвращено.*$/);
                            } else if (originalText.includes('Вернул')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            } else if (originalText.includes('Ставка')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} $1, сумма: ${transactionAmount.replace('-', '')} рублей`, /^(.*)$/);
                            } else if (originalText.includes('Возвращена')) {
                                replaceData(`[Аукцион | ${transactionDate}] ${playerName} - Возвращена ставка, сумма: ${transactionAmount} рублей`);
                            }
                        } else if (categoryName == 'Банковская система') {
                            if (originalText.includes('Пополнил счет')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Пополнил свой счет на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Пополнил банк. счет')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Пополнил свой дополнительный счет на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('руб в банкомате')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Снял ${transactionAmount} рублей в банкомате`);
                            } else if (originalText.includes('Продлил аренду')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Продлил аренду имущества на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Перевел на счет')) {
                                replaceData(`[Банк | ${transactionDate}] ${playerName} - Перевел ${transactionAmount} рублей на банковский счет, владелец $1`, /^.*владелец (.*) \[sql:.*$/);
                            }
                        } else if (categoryName == 'Взаимодействие с игроками') {
                            if (originalText.includes('Получение денег')) {
                                replaceData(`[Передача денег | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей от игрока $1`, /^.*от (.*) \(.*$/);
                            } else if (originalText.includes('Передача денег')) {
                                replaceData(`[Передача денег | ${transactionDate}] ${playerName} - Передал ${transactionAmount.replace('-', '')} рублей игроку $1`, /^.*игроку (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Взаимодействие с казино') {
                            if (originalText.includes('Вышел из казино')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Вышел из казино и получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Сделал ставку в казино')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Поставил ${transactionAmount.replace('-', '')} рублей на игру "Кости"`);
                            } else if (originalText.includes('Проиграл в казино (пред. ставка)')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Проиграл поставленную на игру "Кости" ставку`);
                            } else if (originalText.includes('Получил выигрыш в казино набрав')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в игре "Кости"`);
                            } else if (originalText.includes('Получил процент')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Получил процент в размере ${transactionAmount} рублей в качестве Крупье`);
                            } else if (originalText.includes('Блекджек (ставка')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Поставил ${transactionAmount.replace('-', '')} рублей на игру "BlackJack"`);
                            } else if (originalText.includes('Победил Блекджек')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в игре "BlackJack"`);
                            } else if (originalText.includes('Ничья Блекджек')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Вернул ${transactionAmount} рублей из-за Ничьи в игре "BlackJack"`);
                            } else if (originalText.includes('Ставка на миниигру')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Поставил ${transactionAmount.replace('-', '')} рублей на игру "Дурак"`);
                            } else if (originalText.includes('Проиграл в казино дурак')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Проиграл поставленную ставку на игру "Дурак"`);
                            } else if (originalText.includes('Выиграл в казино дурак')) {
                                replaceData(`[Казино | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в игре "Дурак"`);
                            }
                        } else if (categoryName == 'Восстановления') {
                            if (originalText) {
                                replaceData(`[Восстановление | ${transactionDate}] ${playerName} - Восстановил $2 игроку $1`, /^игроку (.*) \[.*\] (.*)$/);
                            }
                        } else if (categoryName == 'Донат') {
                            if (originalText.includes('Конвертировал')) {
                                replaceData(`[Донат | ${transactionDate}] ${playerName} - Конвертировал Black Coins в игровую валюту и получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Донат | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей при открытии кейса`);
                            }
                        } else if (categoryName == 'Жалобы/Вопросы') {
                            if (originalText.includes('Жалоба от')) {
                                replaceData(`[Репорт | ${transactionDate}] ${playerName} - Ответил на жалобу игрока $1; "$2"`, /^Жалоба от (.*) \[.*\]\: (.*)$/);
                            } else if (originalText.includes('Вопрос от')) {
                                replaceData(`[Вопрос | ${transactionDate}] ${playerName} - Ответил игроку $2; Вопрос: "$1", Ответ: "$3"`, /^Вопрос (.*)\[.*\].*игроку (.*)\[.*\] ответ (.*)$/);
                            }
                        } else if (categoryName == 'Имущество игрока') {
                            if (originalText.includes('Получил из промокода')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - $1`, /^(.*?)$/);
                            } else if (originalText.includes('Приобрел улучшение для дома')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Приобрел улучшение для своего дома за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Приобрел дом')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Приобрел дом за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Приобрел подвальное помещение')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Приобрел подвал для своего дома за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Продажа своего дома')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Продал свой дом государству за $1 рублей`, /^.*итого: (.*) рублей.*$/);
                            } else if (originalText.includes('Продажа дома')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Продал дом игроку $1 за ${transactionAmount}`, /^.*игроку (.*)$/);
                            } else if (originalText.includes('Слетел дом')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Дом слетел и игрок получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Слетел гараж')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Гараж слетел и игрок получил ${transactionAmount} рублей`);
                            } else if (originalText.includes('Продажа гаража')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Продал свой гараж государству за ${transactionAmount} рублей`);
                            } else if (originalText.includes('Покупка гаража')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Купил гараж за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Улучшение гаража')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Купил улучшение для гаража за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Купил гараж')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Купил гараж за ${transactionAmount.replace('-', '')} рублей у игрока $1`, /^игрока (.*). .*$/);
                            } else if (originalText.includes('Продал гараж')) {
                                replaceData(`[Гараж | ${transactionDate}] ${playerName} - Продал гараж за ${transactionAmount} рублей игроку $1`, /^.*игроку (.*). .*$/);
                            } else if (originalText.includes('Приобрел улучшение для подвала')) {
                                replaceData(`[Дом | ${transactionDate}] ${playerName} - Улучшил подвал своего дома за ${transactionAmount.replace('-', '')} рублей`);
                            }
                        } else if (categoryName == 'Квесты') {
                            if (originalText) {
                                replaceData(`[Квесты | ${transactionDate}] ${playerName} - Выполнил $1 квест и получил ${transactionAmount}`, /^\+ Выполнение (.*) квеста$/);
                            }
                        } else if (categoryName == 'Контейнеры') {
                            if (originalText.includes('Продал содержимое')) {
                                replaceData(`[Контейнеры | ${transactionDate}] ${playerName} - Продал содержимое контейнера $1 и получил ${transactionAmount} рублей`, /^.*содержимое (.*) контейнера.*$/);
                            } else if (originalText.includes('Победа в торгах')) {
                                replaceData(`[Контейнеры | ${transactionDate}] ${playerName} - Выиграл торги за контейнер за ${transactionAmount.replace('-', '')}`);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Контейнеры | ${transactionDate}] ${playerName} - Получил $1 ($2) после победы на торгах за контейнер`, /^Выиграл (.*) в .*: (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Купоны') {
                            if (originalText) {
                                replaceData(`[Купон | ${transactionDate}] ${playerName} - Получил купон: ID $1`, /^.*ID (.*)$/);
                            }
                        } else if (categoryName == 'Лицензии') {
                            if (originalText.includes('Оплата экзамена')) {
                                replaceData(`[Лицензии | ${transactionDate}] ${playerName} $1 за ${transactionAmount.replace('-', '')} рублей`, /^(.*?)$/);
                            } else if (originalText.includes('Приобрел в правительстве')) {
                                replaceData(`[Лицензии | ${transactionDate}] ${playerName} $1 за ${transactionAmount.replace('-', '')} рублей`, /^(.*?)$/);
                            } else if (originalText.includes('Лицензия анулирована')) {
                                replaceData(`[Лицензии | ${transactionDate}] ${playerName} - $1`, /^(.*?)$/);
                            }
                        } else if (categoryName == 'Личное транспортное средство') {
                            if (originalText.includes('Купил изменение')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил изменение "$1" на автомобиль $2 за ${transactionAmount.replace('-', '')} рублей`, /^.*изменение "(.*)" на авто (.*) \[.*$/);
                            } else if (originalText.includes('Купил деталь')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил деталь "$1" на автомобиль $2 за ${transactionAmount.replace('-', '')} рублей`, /^.*деталь "(.*)".* на авто (.*) \[.*$/);
                            } else if (originalText.includes('Установил номерные')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Установил номер $1 на свой автомобиль`, /^.*знаки (.*) \(.*$/);
                            } else if (originalText.includes('Снял номерные')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Снял номер $1 со своего автомобиля`, /^.*знаки (.*) \(.*$/);
                            } else if (originalText.includes('Отметил свое')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Отметил свой автомобиль по GPS`);
                            } else if (originalText.includes('Продажа транспорта')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Продал автомобиль $1 игроку $2 за ${transactionAmount} рублей`, /^.* транспорта (.*) \(.*\) для игрока (.*) \[.*$/);
                            } else if (originalText.includes('Продал транспортное')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Продал автомобиль $1 государству за ${transactionAmount} рублей`, /^.*средство (.*) \(.*\)$/);
                            } else if (originalText.includes('Покупка транспорта') && originalText.includes('у игрока')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил автомобиль $1 у игрока $2 за ${transactionAmount.replace('-', '')} рублей`, /^.* Покупка транспорта (.*) \(.*$/);
                            } else if (originalText.includes('Покупка транспорта') && originalText.includes('в автосалоне')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Купил автомобиль $1 в автосалоне за ${transactionAmount.replace('-', '')} рублей`, /^.* Покупка транспорта (.*) \(.*$/);
                            } else if (originalText.includes('Обменялся')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Обменял свой автомобиль $3 на автомобиль $2 игрока $1 без доплаты`, /^Обменялся с (.*) \(Авто (.*) \(.*\) на Авто (.*) \(.*$/);
                            } else if (originalText.includes('+ Доплата за обмен')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Обменял свой автомобиль $3 на автомобиль $2 игрока $1 с доплатой ${transactionAmount.replace('-', '')}`, /^.*обмен от (.*) \(Авто (.*) \(.*\) на Авто (.*) \(.*$/);
                            } else if (originalText.includes('- Доплата за обмен')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Обменял свой автомобиль $3 на автомобиль $2 игрока $1 с доплатой ${transactionAmount.replace('-', '')}`, /^.*игроку (.*) \(Авто (.*) \(.*\) на Авто (.*) \(.*$/);
                            } else if (originalText.includes('Выиграл')) {
                                replaceData(`[Транспорт | ${transactionDate}] ${playerName} - Выиграл автомобиль $1 в BlackPass`, /^.*blackpass: (.*) \[.*$/);
                            }
                        } else if (categoryName == 'Лотерея') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Лотерея | ${transactionDate}] ${playerName} - Приобрел лотерейный билет, число $1`, /^.*число: (.*)$/);
                            } else if (originalText.includes('Выигрыш')) {
                                replaceData(`[Лотерея | ${transactionDate}] ${playerName} - Выиграл ${transactionAmount} рублей в лотерею, $1`, /^.*совпали (.*)$/);;
                            }
                        } else if (categoryName == 'Мероприятия') {
                            if (originalText.includes('Выдача денег')) {
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей из BlackPass`);
                            } else if (originalText.includes('Аренда лодки')) {
                                replaceData(`[Аренда | ${transactionDate}] ${playerName} - Арендовал лодку за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('За отметку')) {
                                replaceData(`[GPS | ${transactionDate}] ${playerName} - Отметил дом на GPS за ${transactionAmount.replace('-', '')} рублей`);
                            }
                        } else if (categoryName == 'Мобильный телефон') {
                            if (originalText.includes('Пополнил')) {
                                replaceData(`[Телефон | ${transactionDate}] ${playerName} - Пополнил счет телефона на ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Приобрел смену')) {
                                replaceData(`[Телефон | ${transactionDate}] ${playerName} - Сменил номер за ${transactionAmount.replace('-', '')} рублей. Новый номер: $1`, /^.*Новый номер: (.*)$/);
                            }
                        } else if (categoryName == 'Начальные работы') {
                            if (originalText.includes('кладо')) {
                                replaceData(`[Кладоискатель | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей, затраченное время: $1`, /^.*выполнил за (.*)\)$/);
                            } else if (originalText.includes('электрик')) {
                                replaceData(`[Электрик | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за выполнение вызова`);
                            } else if (originalText.includes('капитану')) {
                                replaceData(`[Водолаз | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за продажу предмета`);
                            } else if (originalText.includes('заказа инкассатор')) {
                                replaceData(`[Инкассация | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за выполнение заказа`);
                            } else if (originalText.includes('транспорта инкассатор')) {
                                replaceData(`[Инкассатор | ${transactionDate}] ${playerName} - Арендовал рабочий транспорт за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Арендовал прицеп')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Арендовал прицеп`);
                            } else if (originalText.includes('Выполнил заказ за')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Выполнил заказ за $1 секунд и получил ${transactionAmount} рублей`, /^.*заказ за (\d+) секунд.$/);
                            } else if (originalText.includes('[ТК] Аренда Т/О')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Арендовал фуру за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Загрузил груз')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Загрузил груз в прицеп`);
                            } else if (originalText.includes('Дошел к разгрузке')) {
                                replaceData(`[Транспортная Компания | ${transactionDate}] ${playerName} - Дошел к разгрузке за $1 секунд`, /^.*разгрузке за (.*) секунд$/);
                            } else if (originalText.includes('+ Механик, починка')) {
                                replaceData(`[Механик | ${transactionDate}] ${playerName} - Починил автомобиль игроку $1 за ${transactionAmount} рублей`, /^.*игроку (.*)$/);
                            } else if (originalText.includes('- Починка')) {
                                replaceData(`[Механик | ${transactionDate}] ${playerName} - Починил автомобиль у игрока $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*механика (.*)$/);
                            } else if (originalText.includes('Зарплата водителем автобуса')) {
                                replaceData(`[Автобус | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за маршрут`);
                            } else if (originalText.includes('Аредовал автобус')) {
                                replaceData(`[Автобус | ${transactionDate}] ${playerName} - Арендовал автобус за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('шахтер')) {
                                replaceData(`[Шахта | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за смену`);
                            } else if (originalText.includes('в МЧС')) {
                                replaceData(`[МЧС | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за задание`);
                            } else if (originalText.includes('курьера')) {
                                replaceData(`[Курьер | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за заказ`);;
                            } else if (originalText.includes('газовика')) {
                                replaceData(`[Газовик | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за заказ`);
                            } else if (originalText.includes('такси')) {
                                replaceData(`[Такси | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за заказ`);
                            } else if (originalText.includes('завод')) {
                                replaceData(`[Завод | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за смену`);
                            }
                        } else if (categoryName == 'Номера') {
                            if (originalText.includes('Купил')) {
                                replaceData(`[Номер | ${transactionDate}] ${playerName} - Купил номер $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*транспорта (.*) \(.*$/);
                            } else if (originalText.includes('Обновил')) {
                                replaceData(`[Номер | ${transactionDate}] ${playerName} - Обновил номер при покупке за ${transactionAmount.replace('-', '')}`);
                            }
                        } else if (categoryName == 'Обмен баллов') {
                            if (originalText.includes('+')) {
                                replaceData(`[E-Points | ${transactionDate}] ${playerName} - $1`, /^\+ (.*).$/);
                            }
                        } else if (categoryName == 'Объявления') {
                            if (originalText.includes('Отправил')) {
                                replaceData(`[СМИ | ${transactionDate}] ${playerName} - Отправил объявление "$1" за ${transactionAmount.replace('-', '')} рублей`, /^.*объявление: (.*)$/)
                            } else if (originalText.includes('Отредактировал')) {
                                replaceData(`[СМИ | ${transactionDate}] ${playerName} - Отредактировал объявление игрока $1 за ${transactionAmount} рублей, текст: "$2"`, /^.*объявление (\w+): (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Остальное') {
                            if (originalText.includes('Переместил')) {
                                replaceData(`[Инвентарь | ${transactionDate}] ${playerName} - $1`, /^(.*)$/);
                            }
                        } else if (categoryName == 'Охота') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Охота | ${transactionDate}] ${playerName} - $1 за ${transactionAmount.replace('-', '')} рублей`, /^- (.*)$/);
                            } else if (originalText.includes('Получил за продажу')) {
                                replaceData(`[Охота | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за продажу животного`);
                            } else if (originalText.includes('вознаграждение')) {
                                replaceData(`[Охота | ${transactionDate}] ${playerName} - Получил вознаграждение: $1`, /^.*\((.*)\)$/);
                            }
                        } else if (categoryName == 'Подключения/Отключания') {
                            if (originalText.includes('подключился')) {
                                replaceData(`[Сервер | ${transactionDate}] ${playerName} - Подключился к серверу, ID: ${transactionAmount}`);
                            } else if (originalText.includes('отключился')) {
                                replaceData(`[Сервер | ${transactionDate}] ${playerName} - Отключился от сервера, ID: ${transactionAmount}`);
                            }
                        } else if (categoryName == 'Пожертвования') {
                            if (originalText.includes('Пожертвовал')) {
                                replaceData(`[Пожертвования | ${transactionDate}] ${playerName} - Пожертвовал ${transactionAmount.replace('-', '')} рублей в банке`);
                            }
                        } else if (categoryName == 'Покупка кустов с наркотиками') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Покупка кустов | ${transactionDate}] ${playerName} - Купил $1 кустов за ${transactionAmount.replace('-', '')} рублей`, /^.*. \((.*).\)$/);
                            }
                        } else if (categoryName == 'Покупка предметов в магазине') {
                            if (originalText.includes('Приобрел')) {
                                replaceData(`[Покупка в магазине | ${transactionDate}] ${playerName} - Купил $1 за ${transactionAmount.replace('-', '')} рублей`, /^- Приобрел (.*) в бизнесе .*$/);
                            }
                        } else if (categoryName == 'Попрошайничество') {
                            if (originalText.includes('Получил')) {
                                replaceData(`[Попрошайничество | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за попрошайничество`);
                            }
                        } else if (categoryName == 'Промокоды') {
                            if (originalText.includes('Получил за введенный')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за введенный промокод "$1"`, /^.*\((.*)\)$/);
                            } else if (originalText.includes('Получил за введенные')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за введенные промокоды (/checkpromo)`);
                            } else if (originalText.includes('Создал')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Создал промокод "$1" за ${transactionAmount.replace('-', '')} рублей`, /^.*промокод (.*)$/);
                            }
                        } else if (categoryName == 'Реклама') {
                            if (originalText.includes('Получил')) {
                                replaceData(`[Реклама | ${transactionDate}] ${playerName} - Получил мут за повторение сообщения "$1"`, /^.*Текст: (.*)$/);
                            } else if (originalText.includes('подозревается')) {
                                replaceData(`[Промо | ${transactionDate}] ${playerName} - Подозревается в рекламе. Текст: "$1"`, /^.*рекламе! \[(.*)\]$/);
                            }
                        } else if (categoryName == 'Реферальная система') {
                            if (originalText.includes('Получил вознаграждение')) {
                                replaceData(`[Рефералы | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за реферера (пригласившего)`);
                            } else if (originalText.includes('Получил деньги')) {
                                replaceData(`[Реферала | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за реферала (приглашенного)`);
                            }
                        } else if (categoryName == 'Рулетка') {
                            if (originalText.includes('Забрал')) {
                                replaceData(`[Рулетка | ${transactionDate}] ${playerName} - Забрал выигрыш из рулетки: $1`, /^.*выигрыш: (.*)$/);
                            }
                        } else if (categoryName == 'Рыболовство') {
                            if (originalText.includes('Продал')) {
                                replaceData(`[Рыболовство | ${transactionDate}] ${playerName} - Продал рыбу в рыболовном магазине`);
                            }
                        } else if (categoryName == 'Свадьба') {
                            if (originalText.includes('Покупка')) {
                                replaceData(`[Свадьба | ${transactionDate}] ${playerName} - Купил обручальные кольца за ${transactionAmount.replace('-', '')} рублей`);
                            } else if (originalText.includes('Арендовал')) {
                                replaceData(`[Свадьба | ${transactionDate}] ${playerName} - Арендовал свадебный $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*средство: (.*)$/);
                            }
                        } else if (categoryName == 'Семейный чат') {
                            if (originalText) {
                                replaceData(`[Семейный чат | ${transactionDate}] ${playerName} - Написал "$1"`, /^.*\]: (.*)$/);
                            }
                        } else if (categoryName == 'Семьи') {
                            if (originalText.includes('Взял') || originalText.includes('Положил в сейф') || originalText.includes('Выдал') || originalText.includes('Выгнал') || originalText.includes('Принял')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - $1`, /^.*\)\] (.*)$/);
                            } else if (originalText.includes('Покинул')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - Покинул свою семью`);
                            } else if (originalText.includes('Снял')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - Снял ${transactionAmount} рублей со счета семьи`);
                            } else if (originalText.includes('Положил')) {
                                replaceData(`[Семьи | ${transactionDate}] ${playerName} - Положил ${transactionAmount.replace('-', '')} рублей на счет семьи`);
                            }
                        } else if (categoryName == 'Склад фракции') {
                            if (originalText.includes('Положил')) {
                                replaceData(`[Склад фракции | ${transactionDate}] ${playerName} - Положил ${transactionAmount.replace('-', '')} рублей на склад фракции`);
                            } else if (originalText.includes('Взял')) {
                                replaceData(`[Склад фракции | ${transactionDate}] ${playerName} - Взял ${transactionAmount} рублей со склада фракции`);
                            }
                        } else if (categoryName == 'Смена имени') {
                            if (originalText) {
                                replaceData(`[Смена имени | ${transactionDate}] ${playerName} - Сменил имя на $1`, /^.*на (.*) \(.*$/);
                            }
                        } else if (categoryName == 'Сообщения') {
                            if (originalText) {
                                replaceData(`[SMS | ${transactionDate}] ${playerName} - Написал игроку $1: "$2"`, /^Для (.*)\[.*\]: (.*)$/);
                            }
                        } else if (categoryName == 'Телефонные звонки') {
                            if (originalText) {
                                replaceData(`[Звонок | ${transactionDate}] ${playerName} - Написал игроку $1: "$2"`, /^.* > (.*)\[.*\]: (.*)$/);
                            }
                        } else if (categoryName == 'Трейды') {
                            if (originalText.includes('начат')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Начал трейд`);
                            } else if (originalText.includes('не завершился')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Обмен отменен`);
                            } else if (originalText.includes('успешно закончен')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Обмен завершен`);
                            } else if (originalText.includes('добавил предмет')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Добавил предмет $1 в обмен`, /^.*предмет (.*) \(.*$/);
                            } else if (originalText.includes('добавил') && originalText.includes('рублей')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Добавил $1 рублей в обмен`, /^.*добавил (.*) рублей$/);
                            } else if (originalText.includes('написал')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Написал "$1" в чате обмена`, /^.*написал: (.*)$/);
                            } else if (originalText.includes('+ Доплата')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей после обмена с игроком $1`, /^.*с игроком (.*) \[.*$/);
                            } else if (originalText.includes('- Доплата')) {
                                replaceData(`[Трейды | ${transactionDate}] ${playerName} - Доплатил ${transactionAmount.replace('-', '')} рублей за обмен с игроком $1`, /^.*с игроком (.*) \[.*$/);
                            }
                        } else if (categoryName == 'Ферма') {
                            if (originalText.includes('Арендовал на ферме')) {
                                replaceData(`[Ферма | ${transactionDate}] ${playerName} - Арендовал $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*: (.*)$/);
                            } else if (originalText.includes('Арендовал') && originalText.includes('минут')) {
                                replaceData(`[Ферма | ${transactionDate}] ${playerName} - Арендовал $1 за ${transactionAmount.replace('-', '')} рублей`, /^.*Арендовал (.*)$/);
                            } else if (originalText.includes('Получил')) {
                                replaceData(`[Ферма | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей за работу на ферме`);
                            }
                        } else if (categoryName == 'Штрафы') {
                            if (originalText.includes('Оплатил')) {
                                replaceData(`[Штрафы | ${transactionDate}] ${playerName} - Оплатил штраф(-ы) на сумму ${transactionAmount.replace('-', '')} рублей`);
                            }
                        }
                        else {
                            event.clipboardData.setData('text/plain', originalText);
                            event.preventDefault();
                        }
                    }
                });
            });
        }

        window.onload = function () {
            formatTransactionsInTable();
        };

        const observer = new MutationObserver(function (mutationsList) {
            formatTransactionsInTable();
        });

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(document.body, config);

    }

    function applySelectedStyle(color) {

        function darkenColor(hexCode, percent) {

            percent = Math.max(0, Math.min(100, percent));


            var r = parseInt(hexCode.substring(1, 3), 16);
            var g = parseInt(hexCode.substring(3, 5), 16);
            var b = parseInt(hexCode.substring(5, 7), 16);


            r = Math.round(r * (100 - percent) / 100);
            g = Math.round(g * (100 - percent) / 100);
            b = Math.round(b * (100 - percent) / 100);


            var result = '#' + (r < 16 ? '0' : '') + r.toString(16)
                + (g < 16 ? '0' : '') + g.toString(16)
                + (b < 16 ? '0' : '') + b.toString(16);

            return result;
        }


        const darkColor80 = darkenColor(color, 80);
        const darkColor50 = darkenColor(color, 50);
        const darkColor20 = darkenColor(color, 20);

        const currentStyleElement = document.getElementById('customStyle');
        if (currentStyleElement) {
            currentStyleElement.remove();
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'customStyle';
        styleElement.textContent = `
                        /* Selected Font Accent Stylesheet */
                        /* In development */

                        h1, h2, h3, h4, h5, h6 {
                            color: ${color} !important;
                            text-shadow: 0px 0px 10px ${color} !important;
                        }
                        #log-filter[data-v-2d76ca92] .form-label[data-v-2d76ca92] {
                            color: ${color} !important;
                            text-shadow: 0px 0px 2px ${color} !important;
                        }
                        #log-filter-section[data-v-2d76ca92] {
                            border: 1px solid ${color} !important;
                        }
                        .navbar-dark .navbar-nav .nav-link {
                            color: ${color} !important;
                            text-shadow: 0px 0px 2px ${color} !important;
                        }
                        #log-table[data-v-2d76ca92]>:not(:last-child)>:last-child>*, .table>:not(:last-child)>:last-child>* {
                            color: ${color} !important;
                        border-bottom: 1px solid ${color} !important;
                    }
                    #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
                        color: ${color} !important;
                        text-shadow: 0px 0px 2px ${color} !important;
                    }
                    #log-table[data-v-2d76ca92]>:not(caption)>*>*, .table-borderless>:not(caption)>*>* {
                        border-bottom: 1px solid ${color} !important;
                }
                                                 #log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92] td[data-v-2d76ca92] {
                    color: ${color} !important;
                    text-shadow: 0px 0px 2px ${color} !important;
                }
                .form-control {
                    color: ${color} !important;
                    border: 1px solid ${color} !important;
                }
                .form-control:focus {
                    box-shadow: 0px 0px 10px ${color} !important;
                }
                .multiselect.is-open.is-active {
                    box-shadow: 0px 0px 10px ${color} !important;
                }
                .input-group.has-validation>.dropdown-toggle:nth-last-child(n+4), .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu), .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {
                    color: ${color} !important;
                    border: 1px solid ${color} !important;
                    background: ${darkColor80} !important;
                }
                .autoComplete_wrapper>input {
                    border: 1px solid ${color} !important;
                }
                .dp__input {
                    border: 1px solid ${color} !important;
                    color: ${color} !important;
                }
                .dp__calendar_header_item {
                    color: ${color} !important;
                }
                .dp__month_year_row {
                    color: ${color} !important;
                }
                .dp__overlay_cell_pad {
                    color: ${color} !important;;
                }
                body::-webkit-scrollbar-track {
                    background: ${darkColor80} !important;
                }
                body::-webkit-scrollbar-thumb {
                    background: linear-gradient(${darkColor80}, ${color}, ${darkColor80}) !important;
                }
                .style-button {
                    box-shadow: 0px 0px 10px ${darkColor20} !important;
                    border-color: ${darkColor20} !important;
                    color: ${darkColor20} !important;
                }
                .style-button:hover {
                    background: ${darkColor80} !important;
                    box-shadow: 0px 0px 10px ${color} !important;
                    border-color: ${color} !important;
                    color: ${color} !important;
                }
                .modal-content {
                    box-shadow: 0 0 10px ${color} !important;
                }
                .modal-header {
                    border: 1px solid ${color} !important;
                }
                .modal-body {
                    border: 1px solid ${color} !important;
                    color: ${color} !important;
                }
                .style-title-text {
                    color: ${color} !important;
                }
                .bg-success {
                    border: 1px solid ${color} !important;
                    box-shadow: 0px 0px 10px ${color} !important;
                    color: ${color} !important;
                }
                .bug-report-block {
                    border: 2px solid ${color} !important;
                    box-shadow: 0 0 5px ${color} !important;
                }
                .bug-report-button {
                    border: 2px solid ${color} !important;
                    box-shadow: 0 0 5px ${color} !important;
                }
                .bi-funnel {
                    color: ${color} !important;
                }
                .selector {
                    border: 1px solid ${color} !important;
                    box-shadow: 0 0 5px ${color} !important;
                    color: ${color} !important;
                    background: ${darkColor80} !important;
                }
                .selector:hover {
                    background: ${darkColor50} !important;
                }
                .selector option {
                    background: ${darkColor80} !important;
                }
                input[type=range]  {
                    box-shadow: 0px 0px 5px ${color} !important;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    border: 2px solid ${color} !important;
                    background-color: ${darkColor80} !important;
                }
                input[type=range]::-webkit-slider-runnable-track:hover {
                    background-color: ${darkColor50} !important;
                }
                input[type=range]::-webkit-slider-thumb {
                    background: ${darkColor80} !important;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    background: ${darkColor50} !important;
                }
                input[type="color"] {
                    border: 2px solid ${color} !important;
                    box-shadow: 0px 0px 5px ${color} !important;
                }
                input[type="color"]:hover {
                    box-shadow: 0px 0px 10px 2px ${color} !important;
                }
                .show-filter-btn[data-v-2d76ca92] {
                    background: ${darkColor80} !important;
                }
                .navbar-brand {
                    color: ${darkColor20} !important;
                }
                .navbar-brand:hover {
                    color: ${color} !important;
                }
                .bi-arrow-bar-right {
                    color: ${color} !important;
                }
                #next-page-btn[data-v-2d76ca92], .btn-secondary, .close-btn, .icon-btn, .show-filter-btn {
                    border-color: ${color} !important;
                    color: ${color} !important;
                }
                #prev-page-btn[data-v-2d76ca92], .btn-outline-secondary {
                    border-color: ${color} !important;
                    color: ${color} !important;
                }
                .bi-sort-down::before {
                    color: ${color} !important;
                    text-shadow: 0px 0px 2px ${color} !important;
                }
                .slider {
                    background-color: ${darkColor20} !important;
                    box-shadow: 0 0 5px ${darkColor20} !important;
                    transition: all .4s ease;
                }
                .slider:hover{
                    background-color: ${darkColor50} !important;
                }
                .slider:before {
                    background-color: ${color} !important;
                }
                input:checked + .slider {
                    background-color: ${darkColor80} !important;
                }
                input:checked + .slider:hover {
                    background-color: ${darkColor50} !important;
                }
                ` ;
        document.head.appendChild(styleElement);

    }

    function applyTextGradient() {
        const textGradient = document.createElement('style');
        textGradient.id = 'text-gradient';
        textGradient.textContent = `
                /* Text Gradient Stylesheet */

                /* Gradient Keyframes (Animation) */
                    @keyframes gradientCategory {
                        0% {background-position: 0% 100%;}
                        100% {background-position: 1200% 100%;}
                    }

                /* Table Nickname & Category Gradient */
                .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
                    background: linear-gradient(45deg, #00ffff, #0045ff, #00ffff);
                    background-size: 150% 150%;
                    animation: gradientCategory 5s linear infinite;
                    color: transparent !important;
                    -webkit-background-clip: text;
                    font-style: italic;
                    font-weight: 700;
                    text-decoration: none;
                    text-shadow: 0px 0px 10px #08f;
                    padding-right: 3px;
                }
                .td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
                    background: linear-gradient(45deg, #ffff00, #ff4400, #ffff00);
                    background-size: 150% 150%;
                    animation: gradientCategory 5s linear infinite;
                    color: transparent !important;
                    -webkit-background-clip: text;
                    font-style: italic;
                    font-weight: 700;
                    text-decoration: none;
                    text-shadow: 0px 0px 10px #f80;
                    padding-right: 3px;
                }

                /* "Black Logs" Gradient */
                .navbar-brand {
                    background: linear-gradient(45deg, #00ccff, #ff4400, #00ccff);
                    background-size: 150% 150%;
                    animation: gradientCategory 5s linear infinite;
                    color: transparent !important;
                    -webkit-background-clip: text;
                    font-style: italic;
                    font-weight: 700;
                    text-decoration: none;
                    text-shadow: 0px 0px 10px #888;
                    padding-right: 3px;
                }
                `;
        document.head.appendChild(textGradient);
    }

    function removeTextGradient() {
        var textGradient = document.querySelector('#text-gradient');
        document.head.removeChild(textGradient);
    }

    function applyMenuStyles() {

        const pseudoClasses = document.createElement('style');
        pseudoClasses.id = 'elements-pseudo-classes';
        pseudoClasses.textContent = `
                /* Style Menu Elements Stylesheet */

                /* Style Button CSS + Pseudo Classes */
                    .style-button {
                        color: #ffffff;
                        background: transparent;
                        border: 3px solid #ffffff;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px #ffffff;
                        width: 10%;
                        transition-duration: 0.5s;
                    }
                .style-button:hover {
                    background: #222;
                    box-shadow: 0px 0px 10px #aaaaff;
                    border-color: #aaaaff;
                    color: #aaaaff;
                }

                /* Style Title Text CSS */
                .style-title-text {
                    font-size: 24px;
                    color: #fff;
                    font-weight: 600;
                }

                /* Switch CSS + Pseudo Classes */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 34px;
                    padding-left: 20px;
                }
                .switch input { display: none; }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #aaaaaa;
                    box-shadow: 0 0 5px #aaaaaa;
                    transition: all .4s ease;
                }
                .slider:hover{
                    background-color: #666666;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 26px;
                    width: 26px;
                    left: 4px;
                    bottom: 4px;
                    background-color: #cccccc;
                    box-shadow: 0 0 5px #000000;
                    transition: all .4s ease;
                }
                input:checked + .slider {
                    background-color: #222222;
                }
                input:checked + .slider:hover {
                    background-color: #666666;
                }
                input:focus + .slider {
                    box-shadow: 0 0 5px #222222;
                    background-color: #444444;
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }

                /* Tooltip CSS */
                .tooltip-style {
                    position: relative;
                    display: inline-block;
                    border-bottom: 1px dotted;
                }
                .tooltip-style .tooltip-style-text {
                    visibility: hidden;
                    background-color: #222222;
                    color: #fff;
                    text-align: center;
                    border-radius: 6px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    width: 300px;
                    bottom: 100%;
                    left: 50%;
                    margin-left: -150px;
                    margin-bottom: 10px;
                    transition: opacity 0.3s;
                    opacity: 0;
                    font-size: 16px;
                }
                .tooltip-style:hover .tooltip-style-text {
                    visibility: visible;
                    opacity: 0.95;
                }

                /* Selector CSS + Pseudo Classes */
                .selector {
                    background: #222222;
                    border: 1px solid #cccccc;
                    border-radius: 20px;
                    box-shadow: 0 0 5px #cccccc;
                    color: #cccccc;
                    cursor: pointer;
                    font-size: 18px;
                    margin-right: 10px;
                    margin-top: 25px;
                    padding: 4px;
                    text-align: center;
                    width: 40%;
                    transition-duration: 0.5s;
                }
                .selector:hover {
                    background: #444444;
                    color: #ffffff;
                    box-shadow: 0 0 5px #ffffff;
                }
                .selector option{
                    background: #222222;
                }

                /* Slider CSS + Pseudo Classes */
                input[type=range]  {
                    width: 40%;
                    border-radius: 10px;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    box-shadow: 0px 0px 5px #cccccc;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    border-radius: 10px;
                    height: 10px;
                    border: 2px solid #cccccc;
                    background-color: #222222;
                    transition-duration: 0.5s;
                }
                input[type=range]::-webkit-slider-runnable-track:hover {
                    border-radius: 10px;
                    height: 10px;
                    border: 2px solid #cccccc;
                    background-color: #444444;
                }
                input[type=range]::-webkit-slider-thumb {
                    background: #222222;
                    border: 1px solid #cccccc;
                    box-shadow: 0px 0px 2px #cccccc;
                    border-radius: 25px;
                    cursor: pointer;
                    width: 15px;
                    height: 30px;
                    -webkit-appearance: none;
                    margin-top: -10px;
                    transition-duration: 0.5s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    background: #444444;
                    border: 1px solid #ffffff;
                    box-shadow: 0px 0px 2px #000000;
                    border-radius: 25px;
                    cursor: pointer;
                    width: 20px;
                    height: 40px;
                    -webkit-appearance: none;
                    margin-top: -15px;
                }
                input[type=range]::-moz-range-track {
                    border-radius: 10px/100%;
                    height: 5px;
                    border: 1px solid cyan;
                    background-color: #fff;
                }
                input[type=range]::-moz-range-thumb {
                    background: #ecf0f1;
                    border: 1px solid cyan;
                    border-radius: 10px/100%;
                    cursor: pointer;
                }

                /* Color Pickers CSS + Pseudo Classes */
                .color-picker {
                    margin-top: 25px;
                    margin-right: 10px;
                    width: 40%;
                    vertical-align: bottom;
                }
                input[type="color"]::-webkit-color-swatch-wrapper {
                    padding: 2px;
                }
                input[type="color"]::-webkit-color-swatch {
                    border: none;
                    border-radius: 20px;
                }
                input[type="color"] {
                    -webkit-appearance: none;
                    border: 2px solid #ffffff;
                    background: #000;
                    border-radius: 20px;
                    overflow: hidden;
                    outline: none;
                    cursor: pointer;
                    box-shadow: 0px 0px 5px #ffffff;
                    transition-duration: 0.5s;
                }
                input[type="color"]:hover {
                    -webkit-appearance: none;
                    border: 2px solid #ffffff;
                    background: #444444;
                    border-radius: 20px;
                    overflow: hidden;
                    outline: none;
                    cursor: pointer;
                    box-shadow: 0px 0px 10px 2px #ffffff;
                }

                /* Adding Text CSS */
                .addingText {
                    font-size: 20px;
                    font-style: italic;
                    font-weight: 800;
                    vertical-align: middle;
                }

                /* Bug Report CSS */
                .bug-report-block {
                    margin-top: 25px;
                    margin-bottom: 5px;
                    padding: 10px;
                    border: 2px solid #fff;
                    border-radius: 20px;
                    box-shadow: 0 0 5px #fff;
                }
                .bug-report-button {
                    width: 7%;
                    margin-right: 5%;
                    transition-duration: 0.5s;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 5px #fff;
                }
                .bug-report-button:hover {
                    filter: brightness(0.5);
                }
                `;
        document.head.appendChild(pseudoClasses);
    }

    function applySavedColors() {

        const savedNick = localStorage.getItem('playerNameColor');
        const savedCategory = localStorage.getItem('categoryColor');
        const savedColors = document.createElement('style');
        savedColors.id = 'stored-NickCategory-Colors';
        savedColors.textContent = `
                /* Saved Nickname & Category Stylesheet */

                /* Nickname */
                    .td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
                        color: ${savedNick};
                        text-shadow: 0px 0px 1px ${savedNick};
                    }

                /* Category */
                .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
                    color: ${savedCategory};
                    text-shadow: 0px 0px 1px ${savedCategory};
                }
                `;
        document.head.appendChild(savedColors);

    }

    function applyBodyStyle() {

        const bodyStyle = document.createElement('style');
        bodyStyle.id = 'main-body-theme';
        bodyStyle.textContent = `
        /* Main Page Stylesheet */

        /* Page Heading */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            color: #fff;
            text-shadow: 0px 0px 10px #fff;
        }

        .navbar-dark .navbar-brand,
        .navbar-dark .navbar-brand:focus,
        .navbar-dark .navbar-brand:hover {
            color: #fff;
            font-weight: 900;
            transition-duration: 0.5s;
        }

        .bg-success {
            background: #000 !important;
            border: 1px solid #fff;
            box-shadow: 0px 0px 10px #fff;
        }

        .badge {
            border-radius: 7px;
            color: #fff;
            font-weight: 500;
        }

        .navbar-dark .navbar-nav .nav-link {
            color: #fff;
            text-shadow: 0px 0px 10px #fff;
        }

        .bi-arrow-left::before {
            color: #fff;
        }

        .show-filter-btn[data-v-2d76ca92] {
            background: #333;
            border-bottom-left-radius: 10px;
        }

        .alert[data-v-0c0e47d2] {
            border-radius: 20px;
            box-shadow: 0 0 10px 2px #f00;
        }

        /* Page Body */
        .bg-dark {
            bs-bg-opacity: 0;
            background: #000 !important;
        }

        #game-logs-app {
            background: #000;
        }

        body {
            background-color: #000;
            background-size: 100%;
        }

        body::-webkit-scrollbar {
            width: 16px;
        }

        body::-webkit-scrollbar-track {
            background: #222;
        }

        body::-webkit-scrollbar-thumb {
            background: #fff;
        }

        .accessible-servers .page-intro {
            color: #0ff;
            text-align: center;
            text-shadow: 0px 0px 10px #fff;
        }

        .accessible-servers .game-logs-link {
            font-size: 1.5rem;
            text-shadow: 0px 0px 10px #f0f;
            transition-duration: 0.5s;
        }

        a {
            color: #faf;
            text-decoration: none;
        }

        a:hover {
            color: #f0f;
        }

        /* Page Footer */
        #next-page-btn[data-v-2d76ca92],
        .btn-secondary,
        .close-btn,
        .icon-btn,
        .show-filter-btn {
            background-color: #222;
            border-color: #fff;
            color: #fff;
        }

        #next-page-btn[data-v-2d76ca92]:hover,
        .btn-secondary:hover,
        .close-btn:hover,
        .icon-btn:hover,
        .show-filter-btn:hover {
            background-color: #444;
            border-color: #aaa;
            color: #fff;
        }

        #prev-page-btn[data-v-2d76ca92],
        .btn-outline-secondary {
            border-color: #fff;
            color: #fff;
        }

        #prev-page-btn[data-v-2d76ca92]:hover,
        .btn-outline-secondary:hover {
            background-color: #444;
            border-color: #aaa;
            color: #fff;
        }

        /* Logs Table - Main */
        #log-table[data-v-2d76ca92]>:not(:last-child)>:last-child>*,
        .table>:not(:last-child)>:last-child>* {
            border: 1px solid #111;
            border-bottom: 1px solid #fff;
            background: #111;
            color: #fff;
        }

        #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
            text-align: center;
            background: #111;
            color: #fff;
            text-shadow: 0px 0px 2px #fff;
        }

        #log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92] td[data-v-2d76ca92] {
            padding: 0.5rem 0.5rem 0.5rem 1.5rem;
            background: #000;
            color: #fff;
            text-shadow: 0px 0px 2px #fff;
        }

        #log-table[data-v-2d76ca92]>:not(caption)>*>*,
        .table-borderless>:not(caption)>*>* {
            border: 1px solid rgba(0, 0, 0, 0);
            border-bottom: 1px solid #fff;
        }

        #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
            border: 1px solid rgba(0, 0, 0, 0);
            text-align: center;
        }

        /* Logs Table - Strokes */
        .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
            color: #08f;
            -webkit-background-clip: text;
            font-style: italic;
            font-weight: 700;
            text-decoration: none;
            text-shadow: 0px 0px 1px #08f;
            padding-right: 3px;
        }

        .td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
            color: #f80;
            -webkit-background-clip: text;
            font-style: italic;
            font-weight: 700;
            text-decoration: none;
            text-shadow: 0px 0px 1px #f80;
            padding-right: 3px;
        }

        .td-index[data-v-2d76ca92] {
            background: linear-gradient(90deg, rgba(51, 51, 51, 1) 0%, rgba(17, 17, 17, 1) 100%) !important;
            color: #fff;
        }

        .bi-sort-down::before {
            color: #f90;
            text-shadow: 0px 0px 2px #f90;
        }

        .bi-sort-up::before {
            color: #f90;
            text-shadow: 0px 0px 2px #f90;
        }

        /* Logs Filter - Main */
        #log-filter-section[data-v-2d76ca92] {
            background: #000;
            border: 1px solid #fff;
            border-radius: 25px;
            height: 1000px;
        }

        #log-filter[data-v-2d76ca92] .form-label[data-v-2d76ca92] {
            color: #fff;
            font-weight: 500;
        }

        #log-filter[data-v-2d76ca92] .close-btn[data-v-2d76ca92] {
            height: 41px;
            background: #000;
            border-bottom-left-radius: 10px;
            border: 1px solid #000;
        }

        .btn-primary,
        .submit-btn {
            background-color: #000;
            border: 3px solid #0af;
            border-radius: 10px;
            color: #0ff;
        }

        .btn-primary:hover,
        .submit-btn:hover {
            background-color: #033;
            border-color: #fff;
            color: #fff;
            transition: all .2s ease-in-out;
        }

        .btn-outline-danger {
            border: 3px solid #f00;
            color: #f00;
            border-radius: 10px;
        }

        .btn-outline-danger:hover {
            background-color: #900;
            border-color: #fff;
            color: #fff;
            transition: all .2s ease-in-out;
        }

        .bi-question-circle-fill::before {
            color: #666;
            text-shadow: 0px 0px 10px #000;
        }

        strong {
            color: #0ff;
        }

        /* Logs Filter - Strokes */
        .input-group.has-validation>.dropdown-toggle:nth-last-child(n+4),
        .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu),
        .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3),
        .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
            background: #111;
            color: #fff;
            border: 1px solid #fff;
        }

        .input-group>:not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback):not(.field-error) {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
            margin-left: -1px;
            background: #000;
            color: #fff;
        }

        .multiselect-search {
            background: #000;
            border: 0;
            bottom: 0;
            box-sizing: border-box;
            color: #fff;
            left: 0;
            outline: none;
            width: 100%;
        }

        .multiselect-option {
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            background: #000;
            text-decoration: none;
        }

        .multiselect .multiselect-option.is-pointed {
            background-color: #222;
            color: #fff;
        }

        .multiselect .multiselect-option.is-pointed.is-selected {
            background-color: #666;
            color: #fff;
        }

        .multiselect .multiselect-option.is-selected {
            background-color: #444;
            color: #fff;
        }

        .multiselect-dropdown::-webkit-scrollbar {
            width: 12px;
        }

        .multiselect-dropdown::-webkit-scrollbar-track {
            background: #222;
            border-left: 1px solid #fff;
        }

        .multiselect-dropdown::-webkit-scrollbar-thumb {
            background-color: #fff;
            border-radius: 20px;
            border: 1px solid #222;
        }

        .multiselect.is-open.is-active {
            box-shadow: 0px 0px 10px #fff;
        }

        .dropdown-menu {
            background-color: #222;
        }

        .dropdown-menu show {
            position: absolute;
            inset: 0px auto auto 0px;
            margin: 0px;
            transform: translate(-1px, 40px);
            background: #333;
        }

        .dropdown-item:focus,
        .dropdown-item:hover {
            background-color: #444;
            color: #1e2125;
        }

        .autoComplete_wrapper>input {
            background-color: #000;
            background-origin: border-box;
            background-position: left 1.05rem top 0.8rem;
            background-repeat: no-repeat;
            background-size: 1.4rem;
            border: 1px solid #fff;
            border-radius: 4px;
            box-sizing: border-box;
            color: #f90;
            outline: none;
            transition: all .4s ease;
            width: 100%;
        }

        .autoComplete_wrapper>input:focus {
            border: 1px solid #f90;
            color: #f90;
        }

        .autoComplete_wrapper>input:hover {
            color: #a60;
            transition: all .3s ease;
        }

        .autoComplete_wrapper>ul>li {
            background-color: #000;
            color: #fff;
            transition: all .2s ease;
        }

        .autoComplete_wrapper>ul>li:hover,
        .autoComplete_wrapper>ul>li[aria-selected=true] {
            background-color: #222;
        }

        .autoComplete_wrapper>ul>li mark {
            background-color: transparent;
            color: #f90;
            font-weight: 700;
        }

        .autoComplete_wrapper>ul::-webkit-scrollbar {
            width: 12px;
        }

        .autoComplete_wrapper>ul::-webkit-scrollbar-track {
            background: #222;
            border-left: 1px solid #fff;
        }

        .autoComplete_wrapper>ul::-webkit-scrollbar-thumb {
            background-color: #fff;
            border-radius: 20px;
            border: 1px solid #222;
        }

        .form-control {
            background-color: #000;
            border: 1px solid #fff;
            color: #fff;
            font-weight: 400;
            transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            width: 100%;
        }

        .form-control:focus {
            background-color: #000;
            border-color: #fff;
            box-shadow: 0px 0px 10px #fff;
            color: #fff;
        }

        textarea.form-control {
            min-height: 100px;
            resize: none;
        }

        .lookup-symbol[data-v-2d76ca92] {
            color: #fff;
            font-weight: 500;
            text-shadow: 0px 0px 10px #fff;
        }

        .lookup-comment[data-v-2d76ca92] {
            color: #fff;
            font-weight: 400;
            text-shadow: 0px 0px 10px #fff;
        }

        .dp__input {
            background-color: #111;
            border: 1px solid #fff;
            border-radius: 5px;
            color: #fff;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;
        }

        .dp__input_icons {
            color: #0ff;
        }

        .dp__month_year_row {
            background: #111;
            color: #fff;
        }

        .dp__inner_nav svg {
            color: #0ff;
        }

        .dp__calendar_header,
        .dp__calendar_wrap {
            background: #111;
        }

        .dp__calendar_header_item {
            color: #fff;
        }

        .dp__cell_inner {
            color: #fff;
        }

        .dp__active_date,
        .dp__range_end,
        .dp__range_start {
            background: #666;
            color: #fff;
        }

        .dp__date_hover:hover,
        .dp__date_hover_end:hover,
        .dp__date_hover_start:hover {
            background: #444;
            color: #fff;
            transition: all .5s ease-in-out;
        }

        .dp__cell_disabled,
        .dp__cell_offset {
            color: #444;
        }

        .dp__button {
            background: #222;
        }

        .dp__button_bottom {
            background: #222;
            color: #0ff;
        }

        .dp__button:hover {
            background: #333;
            color: #077;
            transition: all .5s ease-in-out;
        }

        .dp__month_year_select:hover {
            background: #222;
            color: #fff;
            transition: all .5s ease-in-out;
        }

        .dp__overlay_cell,
        .dp__overlay_cell_active {
            background: #444;
        }

        .dp__overlay_container {
            background: #000;
        }

        .dp__overlay_cell_disabled,
        .dp__overlay_cell_disabled:hover {
            background: #111;
            color: #444;
        }

        .dp__time_display {
            color: #aaa;
        }

        .dp__time_display:hover {
            background: #111;
            color: #fff;
            transition: all .3s ease-in-out;
        }

        .dp__inc_dec_button:hover {
            background: #222;
            color: #0ff;
            transition: all .3s ease-in-out;
        }

        .dp__cell_in_between,
        .dp__overlay_cell:hover {
            background: #666;
            color: #fff;
            transition: all .3s ease-in-out;
        }

        .dp__overlay_cell_pad {
            padding: 10px 0;
            color: #999;
        }

        .dp__inner_nav:hover {
            background: #333;
            color: #fff;
            transition: all .3s ease-in-out;
        }

        .dp__today {
            border: 1px solid #fff;
        }

        #playerNameInput::placeholder {
            color: #a60;
        }

        /* Loading Overlay */
        #loading-overlay[data-v-173ec149] {
            height: 100%;
            width: 100%;
        }

        #loading-overlay-heading[data-v-173ec149] {
            font-weight: 500;
            letter-spacing: 1px;
            text-align: center;
            text-transform: uppercase;
            background: linear-gradient(90deg, #ffffff, #444444, #ffffff);
            background-size: 150% 150%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent !important;
            filter: saturate(0);
            animation: textGradient 5s linear infinite;
            text-shadow: none !important;
        }

        #loading-overlay[data-v-173ec149] .spinner[data-v-173ec149] {
            border-width: 0.375rem;
            color: #fff;
            height: 4rem;
            width: 4rem;
        }

        #loading-overlay-container[data-v-173ec149] {
            background-color: #000;
            height: 100%;
            justify-content: center;
            width: 100%;
        }

        /* Modal Dialog */
        .modal [type=button],
        .modal [type=submit] {
            margin-left: 0.5rem;
            filter: invert(1);
        }

        .modal-header {
            background: #000;
            border: 1px solid #fff;
            align-items: center;
            border-bottom: 1px solid #dee2e6;
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;
        }

        .modal-body {
            background: #000;
            border: 1px solid #fff;
            color: #fff;
            position: relative;
            border-bottom-left-radius: 25px;
            border-bottom-right-radius: 25px;
        }

        .modal-content {
            border-radius: 25px;
            box-shadow: 0 0 10px #fff;
        }

        .modal-open {
            padding-right: 0px !important;
        }

        .modal-backdrop {
            height: 100%;
            width: 100%;
        }

        .modal.fade.show {
            padding-right: 80px !important;
            padding-left: 80px !important;
        }

        .alert-danger,
        .alert-modal.failure .modal-content,
        .default-error-page .exception {
            background-color: #000;
            border: 5px solid #f11;
            border-radius: 50px;
            color: #fff;
        }

        .fade {
            transition: opacity .15s linear;
            backdrop-filter: blur(5px);
        }

        /* Media & Gradient */
        @keyframes textGradient {
            0% {
                background-position: 0% 50%;
            }

            100% {
                background-position: 1200% 50%;
            }
        }

        #placeholder-pic[data-v-9c1e68e2] {
            display: block;
            opacity: 0;
            margin: auto;
        }

        #placeholder-msg[data-v-9c1e68e2] {
            color: #0aa;
            text-align: center;
        }

        #content-placeholder[data-v-9c1e68e2] {
            background-image: url(https://snipboard.io/8kBudo.jpg);
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }

        `;
        document.head.appendChild(bodyStyle);

    }

    function applyNewFonts() {
        const fontStyles = document.createElement('style');
        fontStyles.id = 'import-fonts';
        fontStyles.textContent = `
            /* Import Fonts Stylesheet */

            /* Imported Fonts:
--- Bad Script ---
--- Comfortaa ---
--- Fira Sans ---
--- Marmelad ---
--- Montserrat ---
--- Neucha ---
--- Play ---
--- Roboto ---
--- Sofia Sans ---
--- Ububntu --- */

            /* Powered by Google Fonts API */

                @import url('https://fonts.googleapis.com/css2?family=Bad+Script&family=Comfortaa&family=Fira+Sans&family=Marmelad&family=Montserrat&family=Neucha&family=Play&family=Roboto:ital@1&family=Sofia+Sans&family=Ubuntu&display=swap');`;
        document.head.appendChild(fontStyles);
    }

    function replaceTableHeading() {

        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        const tableHeading = document.querySelector('#log-table-heading');
        if (titleElement && tableHeading) {
            tableHeading.textContent += ' - ' + titleElement.textContent;
        };

    }

    function replaceSpinnerImage() {

        const spinnerElement = document.querySelector('div.spinner.spinner-border[data-v-173ec149=""]');
        if (spinnerElement) {
            const gifImageUrl = 'https://rb.ru/media/upload_tmp/2018/d1.gif';
            const gifImage = document.createElement('img');
            gifImage.id = 'replaced-loading-image';
            gifImage.src = gifImageUrl;
            gifImage.style.width = '160px';
            gifImage.style.height = '120px';
            gifImage.style.filter = 'saturate(0)';
            spinnerElement.replaceWith(gifImage);
        }

    }

    function addListenersAttributes() {

        const inputNameElement = document.querySelector('#playerNameInput');
        const transactionData = document.querySelector('#log-filter-form__transaction-desc');
        const playerIdElement = document.querySelector('#log-filter-form__player-id');
        const playerIpElement = document.querySelector('#log-filter-form__player-ip');
        const transactionAmountElement = document.querySelector('#log-filter-form__transaction-amount');
        const transactionAfterElement = document.querySelector('#log-filter-form__balance-after');
        const otherElement = document.querySelector('.btn.btn-primary');
        inputNameElement.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === 'Tab') {
                const otherElement = document.querySelector('.btn.btn-primary');
                otherElement.click();
            }
        });
        transactionData.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault();
                otherElement.click();
            };
        });
        playerIdElement.setAttribute('autocomplete', 'off');
        playerIpElement.setAttribute('autocomplete', 'off');
        transactionAmountElement.setAttribute('autocomplete', 'off');
        transactionAfterElement.setAttribute('autocomplete', 'off');

    }

    function setPageTitle() {

        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        document.title += ' - ' + titleElement.textContent;

    }

    function scriptInit() {

        setPageTitle();

        replaceTableHeading();

        applyNewFonts();

        applyBodyStyle();

        replaceSpinnerImage();

        applySavedColors();

        const styleButton = createStyleButton('div.container-fluid span.badge.bg-success');

        const styleContainerBg = createStyleContainerBg('main');

        applyMenuStyles();

        addListenersAttributes();

    }

})();