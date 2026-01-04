// ==UserScript==
// @name          Rasul's BRP Logs Customizer
// @namespace     https://logs.blackrussia.online/
// @version       1.1.0
// @description   Advanced customization tool for BlackRussia logs with theme engine and Rasul's modifications
// @author        Rasul
// @match         https://logs.blackrussia.online/gslogs/*
// @icon         https://i.postimg.cc/YCbhXXMH/562-E0-EDD-181-B-494-D-B689-6-A25-A1-D1-C641.png
// @license       MIT
// @grant         GM_addStyle
// @supportURL   https://t.me/therasuI
// @downloadURL https://update.greasyfork.org/scripts/538021/Rasul%27s%20BRP%20Logs%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/538021/Rasul%27s%20BRP%20Logs%20Customizer.meta.js
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

  styleToggle.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    ">
      <span>STYLE</span>
      <span style="
        font-size: 0.8em;
        margin-left: 5px;
        color: #ff8800;
        text-shadow: 0 0 3px #ff8800;
      ">Rasul</span>
    </div>
  `;

  const replaceElement = document.querySelector(element);
  if (replaceElement) {
    replaceElement.replaceWith(styleToggle);
  }
}

    function createStyleContainerBg(element) {
        const containerBg = document.createElement('div');
        containerBg.className = 'modal fade';
        containerBg.id = 'container-background';
        containerBg.tabIndex = '-1';
        containerBg.style.display = 'none';
        containerBg.ariaHidden = 'true';

        const parentElement = document.querySelector(element);
        if (parentElement) {
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
            styleTitleText.textContent = 'Переключатель Тем | by Rasul';
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
            const colors = ['-------МЯГКИЕ-------', 'PINK', 'KHAKI', 'SKYBLUE', 'PALEGREEN', '', '-------ЯРКИЕ-------', 'RED', 'LIME', 'CYAN', 'WHITE', 'YELLOW', 'MAGENTA', 'DEEPPINK'];
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
            htmlContent.style.filter = `brightness(${storedBright}%)`;
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
            categoryColorBlock.className = 'color-picker-category';
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
            bugReportTG.href = 'https://t.me/therasuI';
            bugReportTG.target = '_blank';
            bugReportTG.innerHTML = `<img class="bug-report-button" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png" alt="Telegram">`;
            bugReportBlock.appendChild(bugReportTG);

            const bugReportVK = document.createElement('a');
            bugReportVK.href = 'https://vk.com/id838357478';
            bugReportVK.target = '_blank';
            bugReportVK.innerHTML = `<img class="bug-report-button" src="https://cdn-icons-png.flaticon.com/512/145/145813.png" alt="VK">`;
            bugReportBlock.appendChild(bugReportVK);

            const bugReportGF = document.createElement('a');
            bugReportGF.href = '';
            bugReportGF.target = '_blank';
            bugReportGF.innerHTML = `<img class="bug-report-button" src="https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png" alt="Greasy Fork">`;
            bugReportBlock.appendChild(bugReportGF);

            const bugReportText = document.createElement('span');
            bugReportText.className = 'addingText';
            bugReportText.textContent = 'Баг / Предложение';
            bugReportBlock.appendChild(bugReportText);
        }
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


        formatNumbersInTable();


        const observer = new MutationObserver(function (mutationsList) {
            formatNumbersInTable();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function applyCopyDocs() {
        function formatTransactionsInTable() {
            const tableRows = document.querySelectorAll('tr.second-row');
            tableRows.forEach(row => {
                const transactionCell = row.querySelector('.td-transaction-desc');
                if (!transactionCell) return;

                const playerName = row.previousSibling?.querySelector('.td-player-name a')?.textContent || 'Неизвестно';
                const categoryName = row.previousSibling?.querySelector('.td-category a')?.textContent || 'Неизвестно';
                const transactionAmount = row.previousSibling?.querySelector('.td-transaction-amount')?.textContent || '0';
                const transactionDate = row.previousSibling?.querySelector('.td-time')?.textContent?.replace(/\s/g, ' | ') || 'Дата неизвестна';
                const originalText = transactionCell.textContent;

                transactionCell.addEventListener('copy', function (event) {
                    const selection = window.getSelection().toString();
                    if (selection.length >= transactionCell.textContent.length) {
                        function replaceData(expected = '', regex = '') {
                            if (regex !== '') {
                                var final = originalText.replace(new RegExp(regex), expected);
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
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - $1`, /(Получил .+)/);
                            } else if (originalText.includes('+ Выдача')) {
                                replaceData(`[BlackPass | ${transactionDate}] ${playerName} - Получил ${transactionAmount} рублей`);
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


        formatTransactionsInTable();

        const observer = new MutationObserver(function (mutationsList) {
            formatTransactionsInTable();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
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

            var result = '#' + (r < 16 ? '0' : '') + r.toString(16) +
                        (g < 16 ? '0' : '') + g.toString(16) +
                        (b < 16 ? '0' : '') + b.toString(16);

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

            .input-group.has-validation>.dropdown-toggle:nth-last-child(n+4),
            .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu),
            .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3),
            .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {
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
                color: ${color} !important;
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

            input[type=range] {
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

            .slider:hover {
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
        `;
        document.head.appendChild(styleElement);
    }

    function applyTextGradient() {
        const textGradient = document.createElement('style');
        textGradient.id = 'text-gradient';
        textGradient.textContent = `



            @keyframes gradientCategory {
                0% { background-position: 0% 100%; }
                100% { background-position: 1200% 100%; }
            }


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
        const textGradient = document.getElementById('text-gradient');
        if (textGradient) {
            document.head.removeChild(textGradient);
        }
    }

    function applyMenuStyles() {
        const pseudoClasses = document.createElement('style');
        pseudoClasses.id = 'elements-pseudo-classes';
        pseudoClasses.textContent = `

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


            .style-title-text {
                font-size: 24px;
                color: #fff;
                font-weight: 600;
            }


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

            .slider:hover {
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

            .selector option {
                background: #222222;
            }


            input[type=range] {
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

            .addingText {
                font-size: 20px;
                font-style: italic;
                font-weight: 800;
                vertical-align: middle;
            }


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
        const savedNick = localStorage.getItem('playerNameColor') || '#ff8800';
        const savedCategory = localStorage.getItem('categoryColor') || '#0088ff';

        const savedColors = document.createElement('style');
        savedColors.id = 'stored-NickCategory-Colors';
        savedColors.textContent = `

            .td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
                color: ${savedNick};
                text-shadow: 0px 0px 1px ${savedNick};
            }


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

            h1, h2, h3, h4, h5, h6 {
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

            @import url('https://fonts.googleapis.com/css2?family=Bad+Script&family=Comfortaa&family=Fira+Sans&family=Marmelad&family=Montserrat&family=Neucha&family=Play&family=Roboto:ital@1&family=Sofia+Sans&family=Ubuntu&display=swap');
        `;
        document.head.appendChild(fontStyles);
    }

    function replaceTableHeading() {
        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        const tableHeading = document.querySelector('#log-table-heading');
        if (titleElement && tableHeading) {
            tableHeading.textContent += ' - ' + titleElement.textContent;
        }
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

        if (inputNameElement) {
            inputNameElement.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === 'Tab') {
                    if (otherElement) otherElement.click();
                }
            });
        }

        if (transactionData) {
            transactionData.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === 'Tab') {
                    event.preventDefault();
                    if (otherElement) otherElement.click();
                }
            });
        }

        if (playerIdElement) playerIdElement.setAttribute('autocomplete', 'off');
        if (playerIpElement) playerIpElement.setAttribute('autocomplete', 'off');
        if (transactionAmountElement) transactionAmountElement.setAttribute('autocomplete', 'off');
        if (transactionAfterElement) transactionAfterElement.setAttribute('autocomplete', 'off');
    }

    function setPageTitle() {
        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        if (titleElement) {
            document.title += ' - ' + titleElement.textContent;
        }
    }

    function scriptInit() {
        setPageTitle();
        replaceTableHeading();
        applyNewFonts();
        applyBodyStyle();
        replaceSpinnerImage();
        applySavedColors();
        createStyleButton('div.container-fluid span.badge.bg-success');
        createStyleContainerBg('main');
        applyMenuStyles();
        addListenersAttributes();


        const savedColor = localStorage.getItem('selectedColor');
        const colorCodes = {
            'PINK': '#FFC0CB',
            'KHAKI': '#F0E68C',
            'SKYBLUE': '#87CEEB',
            'PALEGREEN': '#98FB98',
            'RED': '#FA8072',
            'LIME': '#00FF00',
            'CYAN': '#00FFFF',
            'WHITE': '#FFFFFF',
            'YELLOW': '#FFFF00',
            'MAGENTA': '#FF00FF',
            'DEEPPINK': '#FF1493'
        };
        if (savedColor && colorCodes[savedColor]) {
            applySelectedStyle(colorCodes[savedColor]);
        }


        const savedFont = localStorage.getItem('selectedFont');
        if (savedFont) {
            document.body.style.fontFamily = savedFont;
        }


        const savedBrightness = localStorage.getItem('savedBrightness');
        if (savedBrightness) {
            document.querySelector('html').style.filter = `brightness(${savedBrightness}%)`;
        }
    }
})();