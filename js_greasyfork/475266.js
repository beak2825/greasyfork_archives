// ==UserScript==
// @name         Theme & Font Changer (TEST)
// @namespace    https://logs.blackrussia.online/**
// @version      0.1.0.4
// @description  Theme Changer + Font Changer for Black Logs
// @author       Lukky
// @match        https://logs.blackrussia.online/gslogs/*
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Lukky
// @downloadURL https://update.greasyfork.org/scripts/475266/Theme%20%20Font%20Changer%20%28TEST%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475266/Theme%20%20Font%20Changer%20%28TEST%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // script initialization
    scriptInit();

    // create Style Menu Button Function // using in scriptInit(element creation)
    function createStyleButton(element) {

        const styleToggle = document.createElement('button'); // create styles Button
        styleToggle.className = 'style-button'; // applies className
        styleToggle.id = 'style-modal-toggle'; //applies id
        styleToggle.href = '#!';
        styleToggle.tabIndex = '0';
        styleToggle.dataset.bsToggle = 'modal';
        styleToggle.dataset.bsTarget = '#container-background';
        styleToggle.textContent = 'STYLE'; // button text

        const replaceElement = document.querySelector(element); // replacing element with button
        replaceElement.replaceWith(styleToggle); //replacing element with button
    }

    // create Style Menu Function (includes all elements) // using in scriptInit(element creation)
    function createStyleContainerBg(element) {

        const containerBg = document.createElement('div'); // create parent element for menu
        containerBg.className = 'modal fade'; // parent element className
        containerBg.id = 'container-background'; // parent element id
        containerBg.tabIndex = '-1';
        containerBg.style.dispaly = 'none'; // parent element style.display
        containerBg.ariaHidden = 'true';

        const parentElement = document.querySelector(element); // parent element pasting
        parentElement.parentNode.insertBefore(containerBg, parentElement); // parent element pasting

        const containerContent = document.createElement('div'); // create main (full-page) container
        containerContent.className = 'modal-dialog modal-dialog-centered'; // container className
        containerContent.id = 'style-container-content'; // container id
        containerBg.appendChild(containerContent); // append child for parent element

        const styleContainer = document.createElement('div'); // create container
        styleContainer.className = 'modal-content'; // container className
        containerContent.appendChild(styleContainer); // append child for main container

        const styleContHead = document.createElement('div'); // create Head of container
        const styleContBody = document.createElement('div'); // create Body of container
        styleContHead.className = 'modal-header'; // container' head className
        styleContBody.className = 'modal-body'; // container' body className
        styleContBody.style.display = 'flex'; // container' body type of display
        styleContBody.style.flexDirection = 'column'; // container' body type of display' direction
        styleContainer.appendChild(styleContHead); // append Head in cointainer
        styleContainer.appendChild(styleContBody); // append Body in container

        const styleTitleBadge = document.createElement('span'); // create Title badge
        styleTitleBadge.className = 'badge bg-success'; // Title badge classname
        styleTitleBadge.textContent = 'STYLE'; // Title badge content
        styleTitleBadge.style.fontSize = '16px'; // Title badge font size
        styleContHead.appendChild(styleTitleBadge); // append Title badge

        const styleTitleText = document.createElement('span'); // create Title text
        styleTitleText.className = 'style-title-text'; // Title text classname
        styleTitleText.textContent = 'Переключатель Тем'; // Title text textContent
        styleContHead.appendChild(styleTitleText); // append Title Badge

        const styleClose = document.createElement('button'); // create 'close' button
        styleClose.type = 'button'; // 'close' button type
        styleClose.className = 'btn-close'; // 'close' button className
        styleClose.dataset.bsDismiss = 'modal'; // 'close' button dataSet
        styleClose.ariaLabel = 'Close'; // 'close' button label
        styleContHead.appendChild(styleClose); // append 'close' button

        const switchStyleBlock = document.createElement('label'); // create first switch block (text gradient)
        switchStyleBlock.className = 'switch'; // switch block className
        switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Переливание Текста
            <span class="tooltip-style-text">Добавляет анимированный градиент на некоторые элементы (повышается нагрузка)</span></div>
            </span>
        `; // switch block HTML content
        styleContBody.appendChild(switchStyleBlock); //append switch block (text gradient)

        const styleToggleCheck = document.getElementById('styleToggleCheck'); // find first switch (text gradient)
        if (localStorage.getItem('styleThemeEnabled') === 'true') { // check local storage item
            styleToggleCheck.checked = true; // enable switch if item found
            applyTextGradient(); // apply style if item found
        }
        styleToggleCheck.addEventListener('change', function() { // add listener for change
            if (styleToggleCheck.checked) {
                applyTextGradient(); // apply style if checked
                localStorage.setItem('styleThemeEnabled', 'true'); // set local storage item if checked
            } else {
                removeTextGradient(); // remove style if not checked
                localStorage.setItem('styleThemeEnabled', 'false'); // set local storage item if not checked
            }
        });

        const switchNumsBlock = document.createElement('label'); // create second switch block (separate numbers)
        switchNumsBlock.className = 'switch'; // switch block className
        switchNumsBlock.innerHTML = `
            <input type="checkbox" id="switchNumsCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Разряды Чисел
            <span class="tooltip-style-text">Переключает способ отображения чисел (1000 => 1 000)</span><img src='https://cdn-icons-png.flaticon.com/512/25/25429.png' style='width: 15px; height: 15px; filter: invert(1)'></img></div>
            </span>
        `; // switch block HTML content
        switchNumsBlock.style.marginTop = '20px'; // switch block top margin
        styleContBody.appendChild(switchNumsBlock); // append second switch block

        const switchNumsCheck = document.getElementById('switchNumsCheck'); // create second switch (separate numbers)
        if (localStorage.getItem('numsSeparateEnabled') === 'true') { // check local storage for item
            switchNumsCheck.checked = true; // enable switch if item found
            applyNumsSeparate(); // enable function if item found
        }
        switchNumsCheck.addEventListener('change', function() { // add listener for change
            if (switchNumsCheck.checked) {
                applyNumsSeparate(); // enable function if checked
                localStorage.setItem('numsSeparateEnabled', 'true'); // set local storage item if checked
                location.reload(); // reload the page (to apply changes)
            } else {
                localStorage.setItem('numsSeparateEnabled', 'false'); // set local storage item if not checked
                location.reload(); // reload the page (to apply changes)
            }
        });

        const switchCopyBankBlock = document.createElement('label'); // create second switch block (separate numbers)
        switchCopyBankBlock.className = 'switch'; // switch block className
        switchCopyBankBlock.innerHTML = `
            <input type="checkbox" id="switchBankCopyCheck">
            <span class="slider round" style="padding-right: 20px;"></span>
            <div class="addingText tooltip-style" style="display: block; width: max-content; margin: 5px; margin-left: 50px">Включить Режим Доказательств
            <span class="tooltip-style-text">Копирование описания транзакций Банка без sqlid (для форума)</span><img src='https://cdn-icons-png.flaticon.com/512/25/25429.png' style='width: 15px; height: 15px; filter: invert(1)'></img></div>
            </span>
        `; // switch block HTML content
        switchCopyBankBlock.style.marginTop = '20px'; // switch block top margin
        styleContBody.appendChild(switchCopyBankBlock); // append second switch block

        const switchCopyBank = document.getElementById('switchBankCopyCheck'); // create second switch (separate numbers)
        if (localStorage.getItem('bankCheckEnabled') === 'true') { // check local storage for item
            switchCopyBank.checked = true; // enable switch if item found
            applyCopyBank(); // enable function if item found
        }
        switchCopyBank.addEventListener('change', function() { // add listener for change
            if (switchCopyBank.checked) {
                applyCopyBank(); // enable function if checked
                localStorage.setItem('bankCheckEnabled', 'true'); // set local storage item if checked
                location.reload(); // reload the page (to apply changes)
            } else {
                localStorage.setItem('bankCheckEnabled', 'false'); // set local storage item if not checked
                location.reload(); // reload the page (to apply changes)
            }
        });

        const fontSelectorBlock = document.createElement('label'); // create first selector block (font selector)
        fontSelectorBlock.className = 'font-selector-block'; // selector className
        styleContBody.appendChild(fontSelectorBlock); // append first selector block

        const fontSelector = document.createElement('select'); // create first selector element (font selector)
        fontSelector.className = 'selector'; // first selector className
        fontSelector.id = 'font-selector'; // first selector id
        const storedFont = localStorage.getItem('selectedFont') || 'Roboto'; // check local storage item
        const fonts = ['Bad Script', 'Comfortaa', 'Fira Sans', 'Marmelad', 'Montserrat', 'Neucha', 'Play', 'Roboto', 'Sofia Sans', 'Ubuntu']; // font selector content
        fonts.forEach(font => {
            const option = document.createElement('option'); // create option for every content' element
            option.value = font; // apply every element
            option.textContent = font; // apply every element
            if (font === storedFont) { // check local storage item and selected font
                option.selected = true; // select option if stored in local storage
                document.body.style.fontFamily = font; // append font to the page
            }
            fontSelector.appendChild(option); // append every element
        });
        fontSelector.addEventListener('change', function() { // add listener for change
            const selectedFont = this.value; // apply new constant (for convenience)
            document.body.style.fontFamily = selectedFont; // append font to the page
            localStorage.setItem('selectedFont', selectedFont); // set local storage item
        });
        fontSelectorBlock.appendChild(fontSelector); // append first selector

        const fontSelectorText = document.createElement('span'); // create first selector adding text
        fontSelectorText.className = 'addingText'; // adding text className
        fontSelectorText.textContent = 'Выбор Шрифта'; // adding text textContent
        fontSelectorBlock.appendChild(fontSelectorText); // append first selector adding text

        const colorSelectorBlock = document.createElement('label'); // create second selector block (color selector)
        colorSelectorBlock.className = 'color-selector-block'; // second selector className
        styleContBody.appendChild(colorSelectorBlock); // append second selector block

        const colorSelector = document.createElement('select'); // create second selector (color selector)
        colorSelector.className = 'selector'; // second selector className
        colorSelector.id = 'color-selector'; // second selector id
        const storedColor = localStorage.getItem('selectedColor') || 'WHITE'; // check local storage item
        const colors = ['-------МЯГКИЕ-------', 'PINK', 'KHAKI', 'SKYBLUE', 'PALEGREEN', '', '-------ЯРКИЕ-------', 'RED', 'LIME', 'CYAN', 'WHITE', 'YELLOW', 'MAGENTA', 'DEEPPINK',]; // color selector content
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
        }; // color list with hex codes
        colors.forEach(color => {
            const option = document.createElement('option'); // create option for every content' element
            option.value = color; // apply every element
            option.textContent = color; // apply every element
            if (color === storedColor) { // check local storage item and selected color
                option.selected = true; // select option if stored in local storage
                applySelectedStyle(colorCodes[color]); // apply selected color to the page
            }
            colorSelector.appendChild(option); // append every option
        });
        colorSelector.addEventListener('change', function() { // add listener for change
            if (this.value !== '-------МЯГКИЕ-------' && this.value !== '' && this.value !== '-------ЯРКИЕ-------') { // filter selected values
                const selectedColor = this.value; // create new constant (for convenience)
                localStorage.setItem('selectedColor', selectedColor); // set local storage item
                applySelectedStyle(colorCodes[selectedColor]); // apply style with selected color
            }
        });
        colorSelectorBlock.appendChild(colorSelector); // append second selector (color selector)

        const colorSelectorText = document.createElement('span'); // create second selector adding text
        colorSelectorText.className = 'addingText'; // adding text className
        colorSelectorText.textContent = 'Выбор Цвета'; // adding text textContent
        colorSelectorBlock.appendChild(colorSelectorText); // append second selector adding text

        const brightnessSliderBlock = document.createElement('label'); // create slider block
        brightnessSliderBlock.className = 'brightness-slider-block'; // slider block className
        styleContBody.appendChild(brightnessSliderBlock); // append slider block

        const storedBright = localStorage.getItem('savedBrightness') || '100'; // check local storage item
        const htmlContent = document.querySelector('html'); // find HTML main element
        const brightnessSlider = document.createElement('input'); // create input (slider)
        htmlContent.style.filter = `brightness(${storedBright}%)` // apply HTMl style if stored in local storage
        brightnessSlider.id = 'brightness-slider'; // input id
        brightnessSlider.type = 'range'; // input type
        brightnessSlider.min = '30'; // minimum range value
        brightnessSlider.max = '100'; // maximum range value
        brightnessSlider.style.marginTop = '30px'; // input top margin
        brightnessSlider.style.marginRight = '10px'; // input right margin
        brightnessSlider.value = storedBright; // set input value if stored in local storage
        brightnessSlider.addEventListener('input', function() { // add listener for change
            const brightnessValue = this.value; // create new constant (gor convenience)
            localStorage.setItem('savedBrightness', brightnessValue); // set local storage item
            htmlContent.style.filter = `brightness(${brightnessValue}%)`; // apply HTML filter with selected value
        });
        brightnessSliderBlock.appendChild(brightnessSlider); // append slider in block (brightness slider)

        const brightnessSliderText = document.createElement('span'); // create slider adding text
        brightnessSliderText.className = 'addingText'; // adding text className
        brightnessSliderText.textContent = 'Выбор Яркости'; // adding text textContent
        brightnessSliderBlock.appendChild(brightnessSliderText); // append adding text

        const nickColorBlock = document.createElement('label'); // create first color picker block (nickname)
        nickColorBlock.className = 'color-picker-nickname'; // first color picker block className
        styleContBody.appendChild(nickColorBlock); // append first color picker block

        const colorNickElement = document.createElement('input'); // create input (color picker)
        const nickColor = localStorage.getItem('playerNameColor') || '#ff8800'; // check local storage item
        colorNickElement.className = 'color-picker';
        colorNickElement.type = 'color'; // input type
        colorNickElement.value = nickColor; // input value if stored in local storage
        colorNickElement.addEventListener('input', function() { // add listener for change
            const selectedColor = colorNickElement.value; // create new constant (for convenience)
            const tdElements = document.querySelectorAll('td.td-player-name[data-v-2d76ca92=""]'); // set target element
            localStorage.setItem('playerNameColor', selectedColor); // set local storage item
            tdElements.forEach(function(td) {
                const playerNick = td.querySelector('a'); // set target element
                if (playerNick) { // check element
                    playerNick.style.color = selectedColor; // change target element color
                    playerNick.style.textShadow = '0px 0px 1px' + selectedColor; // change target element text shadow
                }
            });
        });
        nickColorBlock.appendChild(colorNickElement); // append input in block (color picker)

        const colorNickText = document.createElement('span'); // create first color picker adding text
        colorNickText.className = 'addingText'; // adding text className
        colorNickText.textContent = 'Цвет Никнеймов'; // adding text textContent
        nickColorBlock.appendChild(colorNickText); // append first color picker adding text

        const categoryColorBlock = document.createElement('label'); // create second color picker block (category)
        nickColorBlock.className = 'color-picker-category'; // second color picker block className
        styleContBody.appendChild(categoryColorBlock); // append second color picker block

        const colorCategoryElement = document.createElement('input'); // create input (color picker)
        const categoryColor = localStorage.getItem('categoryColor') || '#0088ff'; // check local storage item
        colorCategoryElement.className = 'color-picker';
        colorCategoryElement.type = 'color'; // input type
        colorCategoryElement.value = categoryColor; // input value if stored in local storage
        colorCategoryElement.addEventListener('input', function() { // add listener for change
            const selectedColor = colorCategoryElement.value; // create new constant (for convenience)
            const tdElements = document.querySelectorAll('td.td-category[data-v-2d76ca92=""]'); // set target element
            localStorage.setItem('categoryColor', selectedColor); // set local storage item
            tdElements.forEach(function(td) {
                const category = td.querySelector('a'); // set target element
                if (category) { // check target element
                    category.style.color = selectedColor; // change target element color
                    category.style.textShadow = '0px 0px 1px' + selectedColor; // change target element text shadow
                }
            });
        });
        categoryColorBlock.appendChild(colorCategoryElement); // append second input (category)

        const colorCategoryText = document.createElement('span'); // create second input adding text
        colorCategoryText.className = 'addingText'; // adding text className
        colorCategoryText.textContent = 'Цвет Категорий'; // adding text textContent
        categoryColorBlock.appendChild(colorCategoryText); // append adding text

        const bugReportBlock = document.createElement('label'); // create bug report block
        bugReportBlock.className = 'bug-report-block'; // bug report className
        styleContBody.appendChild(bugReportBlock); // append bug report

        const bugReportTG = document.createElement('a'); // create telegram report button
        bugReportTG.href = 'https://t.me/solukky' // telegram button link
        bugReportTG.target = '_blank'; // telegram button target (open new tab)
        bugReportTG.innerHTML = `<img class="bug-report-button" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"></img>`; // create button image
        bugReportBlock.appendChild(bugReportTG); // append telegram report button

        const bugReportVK = document.createElement('a'); // create VK report button
        bugReportVK.href = 'https://vk.me/solukky' // VK button link
        bugReportVK.target = '_blank'; // VK button target (open new tab)
        bugReportVK.innerHTML = `<img class="bug-report-button" src="https://cdn-icons-png.flaticon.com/512/145/145813.png"></img>`; // create button image
        bugReportBlock.appendChild(bugReportVK); // append VK report button

        const bugReportGF = document.createElement('a'); // create GreasyFork report button
        bugReportGF.href = 'https://greasyfork.org/ru/scripts/475162-theme-font-changer/feedback' // GF button link
        bugReportGF.target = '_blank'; // GF button target (open new tab)
        bugReportGF.innerHTML = `<img class="bug-report-button" src="https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png"></img>`; // create button image
        bugReportBlock.appendChild(bugReportGF); // append GreasyFork button

        const bugReportText = document.createElement('span'); // create bug report text
        bugReportText.className = 'addingText'; // bug report text className
        bugReportText.textContent = 'Баг / Предложение'; // bug report text textContent
        bugReportBlock.appendChild(bugReportText); // append bug report text

    }

    // script for Numbers Separating (transaction amount & balance after) // using in createStyleContainerBg(script)
    function applyNumsSeparate() {

        function formatNumbersInTable() {

            const tableCells = document.querySelectorAll('td.td-transaction-amount, td.td-balance-after'); // set target elements
            tableCells.forEach(cell => {
                const text = cell.textContent.trim(); // trim target elements text
                if (!isNaN(text.replace(/,/g, ''))) { // made an exception to NaN (Not a Number)
                    const originalValue = parseInt(text.replace(/,/g, '')); // parsing integer values
                    const formattedValue = originalValue.toLocaleString('ru'); // format original value to inernational format (thousands/millions/billions)
                    cell.textContent = formattedValue.toString(); // replace original value
                    cell.addEventListener('copy', function(event) { // add listener to "copy" (Ctrl + C)
                        event.clipboardData.setData('text/plain', formattedValue.replace(/\s/g, '')); // replace text in clipboard to original value
                        event.preventDefault(); // delete default "copy" action
                    });
                }
            });
        }

        window.onload = function() {
            formatNumbersInTable(); // apply function on loading page
        };

        const observer = new MutationObserver(function(mutationsList) {
            formatNumbersInTable(); // apply function on every change on the page
        });

        const config = {
            childList: true, // include childList changes
            subtree: true // include subtree changes
        };

        observer.observe(document.body, config); // enable observer (to detect changes)

    }

    // script to replace clipboardData while copying "Transaction Description" in "Bank" category // using in createStyleContainerBg(script)
    function applyCopyBank() {

        function formatTransactionsInTable() {

            const tableRows = document.querySelectorAll('tr.second-row'); // set target elements
            tableRows.forEach(row => {
                const transactionCell = row.querySelector('.td-transaction-desc');
                const categoryName = row.previousSibling.querySelector('.td-category a').textContent;
                const playerName = row.previousSibling.querySelector('.td-player-name a').textContent;
                const transactionAmount = row.previousSibling.querySelector('.td-transaction-amount').textContent;
                transactionCell.addEventListener('copy', function(event) {
                    const originalText = transactionCell.textContent;
                    const transformedText = originalText.replace(/- Перевел на счет \[banksql:\d+\], владелец (\w+) .*/, `[${categoryName}] ${playerName} - Перевел ${transactionAmount} рублей на банковский счет, владелец $1`);
                    event.clipboardData.setData('text/plain', transformedText);
                    event.preventDefault();
                });
            });
        }

        window.onload = function() {
            formatTransactionsInTable(); // apply function on loading page
        };

        const observer = new MutationObserver(function(mutationsList) {
            formatTransactionsInTable(); // apply function on every change on the page
        });

        const config = {
            childList: true, // include childList changes
            subtree: true // include subtree changes
        };

        observer.observe(document.body, config); // enable observer (to detect changes)

    }

    // append CSS for the page using Color Choosing Element // using in createStyleContainerBg(style)
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

        const currentStyleElement = document.getElementById('customStyle'); // find existing customStyle
        if (currentStyleElement) {
            currentStyleElement.remove(); // remove exiting customStyle (if found)
        }

        const styleElement = document.createElement('style'); // create new style element
        styleElement.id = 'customStyle'; // style element className
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
    border-left: 1px solid ${color} !important;
    background-color: ${darkColor80} !important;
}
body::-webkit-scrollbar-thumb {
    background-color: ${color} !important;
    border: 1px solid ${color} !important;
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
    ` ; // style element textContent (replace selected colors)
        document.head.appendChild(styleElement); // append new customStyle

    }

    // append CSS for the page using Text Gradient Checkbox // using in createStyleContainerBg(style)
    function applyTextGradient() {
        const textGradient = document.createElement('style'); // create style element
        textGradient.id = 'text-gradient'; // style element id
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
        `; // style content (includes animation settings)
        document.head.appendChild(textGradient); // append style to Head of document
    }

    // remove CSS from the page using Text Gradient Checkbox // using in createStyleContainerBg(style removing)
    function removeTextGradient() {
        var textGradient = document.querySelector('#text-gradient'); // find style of text gradient
        document.head.removeChild(textGradient); // remove style from head of document
    }

    // append CSS & Pseudo Classes for Style Menu Elements // using in scriptInit(style)
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
    padding: 5px 0;
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

    // append CSS for Saved Colors (Nicknames & Categories) // using in scriptInit(style)
    function applySavedColors() {

        const savedNick = localStorage.getItem('playerNameColor'); // get nickname color values from local storage
        const savedCategory = localStorage.getItem('categoryColor'); // get category color values from local storage
        const savedColors = document.createElement('style'); // create new style element
        savedColors.id = 'stored-NickCategory-Colors'; // style element id
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
        `; // apply colors to nicknames & categories
        document.head.appendChild(savedColors); // append style to document head

    }

    // append Main CSS for the page // using in scriptInit(style)
    function applyBodyStyle() {

        const bodyStyle = document.createElement('style'); // create new style element
        bodyStyle.id = 'main-body-theme'; // style element id
        bodyStyle.textContent = `
/* Main Page Stylesheet */

/* Page Heading */
h1, h2, h3, h4, h5, h6 {
	color: #fff;
	text-shadow: 0px 0px 10px #fff;
}
.navbar-dark .navbar-brand, .navbar-dark .navbar-brand:focus, .navbar-dark .navbar-brand:hover {
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
	display: inline-block;
	font-size: .75em;
	font-weight: 500;
	line-height: 1;
	padding: 0.35em 0.65em;
	text-align: center;
	vertical-align: baseline;
	white-space: nowrap;
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
	border: 0;
	height: 44px;
	opacity: 1;
	position: fixed;
	right: 0;
	top: 0;
	z-index: 1059;
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
    border-left: 1px solid #fff;
}
body::-webkit-scrollbar-thumb {
    background-color: #fff;
    border-radius: 20px;
    border: 1px solid #222;
}
.accessible-servers .page-intro {
	color: #0ff;
	font-size: 1.15rem;
	font-weight: 300;
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

/* Page Bottom */
#next-page-btn[data-v-2d76ca92], .btn-secondary, .close-btn, .icon-btn, .show-filter-btn {
	background-color: #222;
	border-color: #fff;
	color: #fff;
}
#next-page-btn[data-v-2d76ca92]:hover, .btn-secondary:hover, .close-btn:hover, .icon-btn:hover, .show-filter-btn:hover {
	background-color: #444;
	border-color: #aaa;
	color: #fff;
}
#prev-page-btn[data-v-2d76ca92], .btn-outline-secondary {
	border-color: #fff;
	color: #fff;
}
#prev-page-btn[data-v-2d76ca92]:hover, .btn-outline-secondary:hover {
	background-color: #444;
	border-color: #aaa;
	color: #fff;
}

/* Logs Table - Main */
#log-table[data-v-2d76ca92]>:not(:last-child)>:last-child>*, .table>:not(:last-child)>:last-child>* {
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
#log-table[data-v-2d76ca92]>:not(caption)>*>*, .table-borderless>:not(caption)>*>* {
	border: 1px solid rgba(0,0,0,0);
	border-bottom: 1px solid #fff;
}
#log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
	border: 1px solid rgba(0,0,0,0);
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
	background: linear-gradient(90deg, rgba(51,51,51,1) 0%, rgba(17,17,17,1) 100%) !important;
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
	margin-left: 1rem;
	min-width: 20rem;
	overflow-y: auto;
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
.btn-primary, .submit-btn {
	background-color: #000;
	border: 3px solid #0af;
	border-radius: 10px;
	color: #0ff;
}
.btn-primary:hover, .submit-btn:hover {
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
.input-group.has-validation>.dropdown-toggle:nth-last-child(n+4), .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu), .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {
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
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	background: #000;
	border: 0;
	border-radius: var(--ms-radius,4px);
	bottom: 0;
	box-sizing: border-box;
	color: #fff;
	font-family: inherit;
	font-size: inherit;
	left: 0;
	outline: none;
	padding-left: var(--ms-px,.875rem);
	position: absolute;
	right: 0;
	top: 0;
	width: 100%;
}
.multiselect-option {
	align-items: center;
	box-sizing: border-box;
	cursor: pointer;
	background: #000;
	display: flex;
	font-size: var(--ms-option-font-size,1rem);
	justify-content: flex-start;
	line-height: var(--ms-option-line-height,1.375);
	padding: var(--ms-option-py,.5rem) var(--ms-option-px,.75rem);
	text-align: left;
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
.dropdown-item:focus, .dropdown-item:hover {
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
	font-size: 1rem;
	height: 2.45rem;
	margin: 0;
	outline: none;
	padding: 0 1rem;
	text-overflow: ellipsis;
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
	font-size: 1rem;
	margin: 0;
	overflow: hidden;
	padding: 0.3rem 0.5rem;
	text-align: left;
	text-overflow: ellipsis;
	transition: all .2s ease;
	white-space: nowrap;
}
.autoComplete_wrapper>ul>li:hover, .autoComplete_wrapper>ul>li[aria-selected=true] {
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
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	background-clip: padding-box;
	background-color: #000;
	border: 1px solid #fff;
	border-radius: 0.25rem;
	color: #fff;
	display: block;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	padding: 0.375rem 0.75rem;
	transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	width: 100%;
}
.form-control:focus {
	background-color: #000;
	border-color: #fff;
	box-shadow: 0px 0px 10px #fff;
	color: #fff;
	outline: 0;
}
textarea.form-control {
    min-height: 230px;
}
.lookup-symbol[data-v-2d76ca92] {
	color: #fff;
	font-size: 1.125rem;
	font-weight: 500;
	width: 1.75rem;
	text-shadow: 0px 0px 10px #fff;
}
.lookup-comment[data-v-2d76ca92] {
	color: #fff;
	font-size: .9rem;
	font-weight: 400;
	text-shadow: 0px 0px 10px #fff;
}
.dp__input {
	background-color: #111;
	border: 1px solid #fff;
	border-radius: 5px;
	box-sizing: border-box;
	color: #fff;
	font-family: -apple-system,blinkmacsystemfont,Segoe UI,roboto,oxygen,ubuntu,cantarell,Open Sans,Helvetica Neue,sans-serif;
	font-size: 1rem;
	line-height: 1.5rem;
	outline: none;
	padding: 6px 30px;
	transition: border-color .2s cubic-bezier(.645,.045,.355,1);
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
.dp__calendar_header, .dp__calendar_wrap {
	background: #111;
  }
.dp__calendar_header_item {
	color: #fff;
  }
.dp__cell_inner {
	color: #fff;
  }
.dp__active_date, .dp__range_end, .dp__range_start {
	background: #666;
	color: #fff;
  }
.dp__date_hover:hover, .dp__date_hover_end:hover, .dp__date_hover_start:hover {
	background: #444;
	color: #fff;
		transition: all .5s ease-in-out;
  }
.dp__cell_disabled, .dp__cell_offset {
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
.dp__overlay_cell, .dp__overlay_cell_active {
	background: #444;
  }
.dp__overlay_container {
	background: #000;
  }
.dp__overlay_cell_disabled, .dp__overlay_cell_disabled:hover {
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
.dp__cell_in_between, .dp__overlay_cell:hover {
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
	font-size: 2rem;
	font-weight: 500;
	letter-spacing: 1px;
	padding: 1rem;
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
	align-items: center;
	display: flex;
	flex-direction: column;
	background-color: #000;
	height: 100%;
	justify-content: center;
	width: 100%;
}

/* Modal Dialog */
.modal [type=button], .modal [type=submit] {
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
	display: flex;
	flex-shrink: 0;
	justify-content: space-between;
	padding: 1rem;
}
.modal-body {
	background: #000;
	border: 1px solid #fff;
	color: #fff;
	flex: 1 1 auto;
	padding: 1rem;
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
.alert-danger, .alert-modal.failure .modal-content, .default-error-page .exception {
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
	0% { background-position: 0% 50%; }
	100% { background-position: 1200% 50%; }
}
#placeholder-pic[data-v-9c1e68e2] {
	display: block;
	opacity: 0;
	margin: auto;
	max-height: 20rem;
}
#placeholder-msg[data-v-9c1e68e2] {
	color: #0aa;
	font-size: 1.25rem;
	padding: 1rem;
	text-align: center;
}
#content-placeholder[data-v-9c1e68e2] {
	background-image: url(https://snipboard.io/8kBudo.jpg);
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
}
    `; // apply changes to elements' css code
        document.head.appendChild(bodyStyle); // append style to document head

    }

    // append @import for Fonts // using in scriptInit(style)
    function applyNewFonts() {
        const fontStyles = document.createElement('style'); // create style for Fonts
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
        document.head.appendChild(fontStyles); // append style in Head of document
    }

    // add Logs Table Heading Server Name & Number // using in scriptInit(script)
    function replaceTableHeading() {

        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success'); // find title element (server name & number)
        const tableHeading = document.querySelector('#log-table-heading'); // find table heading (logs heading)
        if (titleElement && tableHeading) { // check if both elements are available
            tableHeading.textContent += ' - ' + titleElement.textContent; // add server name & number to table heading
        };

    }

    // replace default Loading Spinner Image // using in scriptInit(script)
    function replaceSpinnerImage() {

        const spinnerElement = document.querySelector('div.spinner.spinner-border[data-v-173ec149=""]'); // find target element (loading spinner)
        if (spinnerElement) { // check if element available
            const gifImageUrl = 'https://rb.ru/media/upload_tmp/2018/d1.gif'; // set new gif's url
            const gifImage = document.createElement('img'); // create new image element
            gifImage.id = 'replaced-loading-image'; // image element id
            gifImage.src = gifImageUrl; // image element source
            gifImage.style.width = '160px'; // image element width
            gifImage.style.height = '120px'; // image element height
            gifImage.style.filter = 'saturate(0)'; // image element saturation
            spinnerElement.replaceWith(gifImage); // replace loading spinner with new gif
        }

    }

    // add eventListener on Enter & Tab for every Logs Filter Stroke // using in scriptInit(script)
    function addListeners() {

        const inputNameElement = document.querySelector('#playerNameInput'); // find Nickname input element
        const transactionData = document.querySelector('#log-filter-form__transaction-desc'); // find Transaction description element
        const inputIdElement = document.querySelector('#log-filter-form__player-id'); // find Player' ID input element
        const inputIpElement = document.querySelector('#log-filter-form__player-ip'); // find Player' IP input element
        const inputTransactionAmount = document.querySelector('#log-filter-form__transaction-amount'); // find Transaction Amount input element
        const inputBalanceAfter = document.querySelector('#log-filter-form__balance-after'); // find Balance After input element
        const otherElement = document.querySelector('.btn.btn-primary'); // find "Apply" button
        inputNameElement.addEventListener('keydown', function(event) { // add listener for keydown Enter and Tab to Nickname input
            if (event.key === 'Enter' || event.key === 'Tab') {
                const otherElement = document.querySelector('.btn.btn-primary'); // find "Apply" button
                otherElement.click(); // simulate "Apply" button click
            }
        });
        transactionData.addEventListener('keydown', function(event) { // add listener for keydown Enter and Tab to Transatcion description input
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault(); // delete default action
                otherElement.click(); // simulate "Apply" button click
            };
        });
        inputIdElement.addEventListener('keydown', function(event) { // add listener for keydown Enter and Tab to Player' ID input
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault(); // delete default action
                otherElement.click(); // simulate "Apply" button click
            };
        });
        inputIpElement.addEventListener('keydown', function(event) { // add listener for keydown Enter and Tab to Player' IP input
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault(); // delete default action
                otherElement.click(); // simulate "Apply" button click
            };
        });
        inputTransactionAmount.addEventListener('keydown', function(event) { // add listener for keydown Enter and Tab to Transaction Amount input
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault(); // delete default action
                otherElement.click(); // simulate "Apply" button click
            };
        });
        inputBalanceAfter.addEventListener('keydown', function(event) { // add listener for keydown Enter and Tab to Balance After input
            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault(); // delete default action
                otherElement.click(); // simulate "Apply" button click
            };
        });

    }

    // add Server Name & Number to page title (example: Black Log - RED (01)) // using in scriptInit(script)
    function setPageTitle() {

        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success'); // find title element (server name & number)
        document.title += ' - ' + titleElement.textContent; // add server name & number to page' title

    }

    // script initialization function (contains previuos functions)
    function scriptInit() {

        setPageTitle(); // set new page title (add server name & number), HIGH PRIORITY

        replaceTableHeading(); // replace Table/Log heading with server name & number, HIGH PRIORITY

        applyNewFonts(); // applies new fonts to the page, HIGH PRIORITY

        applyBodyStyle(); // apply style for Body, HIGH PRIORITY

        replaceSpinnerImage(); // replace loading spinner with new gif file, HIGH PRIORITY

        applySavedColors(); // apply saved colors for Nicknames and Categories (log table), HIGH PRIORITY

        const styleButton = createStyleButton('div.container-fluid span.badge.bg-success'); // create StyleMenu button

        const styleContainerBg = createStyleContainerBg('main'); // create StyleMenu container and other elements

        applyMenuStyles(); // apply all style menu elements styles

        addListeners(); // add eventListeners on Tab and Enter keys

    }

})();