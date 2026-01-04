// ==UserScript==
// @name         Theme & Font Changer
// @namespace    https://logs.blackrussia.online/
// @version      0.4.1.0
// @description  Theme Changer + Font Changer for Black Logs
// @author       Lukky
// @match        https://logs.blackrussia.online/gslogs/*
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @license      Lukky
// @downloadURL https://update.greasyfork.org/scripts/479106/Theme%20%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/479106/Theme%20%20Font%20Changer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    scriptInit();

    const styleButton = createStyleButton('div.container-fluid span.badge.bg-success');
    const styleContainerBg = createStyleContainerBg('main');

    function replaceTableHeading() {
        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        const tableHeading = document.querySelector('#log-table-heading');
        if (titleElement && tableHeading) {
            tableHeading.textContent += ' - ' + titleElement.textContent;
        };
    }

    function createStyleButton(element) {

        const fontStyles = document.createElement('style');
        fontStyles.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bad+Script&family=Comfortaa&family=Fira+Sans&family=Marmelad&family=Montserrat&family=Neucha&family=Play&family=Roboto:ital@1&family=Sofia+Sans&family=Ubuntu&display=swap');`;
        document.head.appendChild(fontStyles);

        const styleToggle = document.createElement('button');
        styleToggle.className = 'style-button';
        styleToggle.id = 'style-modal-toggle';
        styleToggle.href = '#!';
        styleToggle.tabIndex = '0';
        styleToggle.dataset.bsToggle = 'modal';
        styleToggle.dataset.bsTarget = '#container-background';
        styleToggle.textContent = 'STYLE';
        styleToggle.style.color = '#ffffff';
        styleToggle.style.background = 'transparent';
        styleToggle.style.border = '3px solid #ffffff';
        styleToggle.style.borderRadius = '10px';
        styleToggle.style.boxShadow = '0px 0px 10px #ffffff';
        styleToggle.style.width = '10%';

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

        const styleTitle = document.createElement('h5');
        styleTitle.className = 'style-title';
        styleContHead.appendChild(styleTitle);

        const styleTitleText = document.createElement('span');
        styleTitleText.className = 'badge bg-success';
        styleTitleText.textContent = 'STYLE';
        styleTitle.appendChild(styleTitleText);
        styleTitle.insertAdjacentText('beforeend', '-Переключатель Тем-');

        const styleClose = document.createElement('button');
        styleClose.type = 'button';
        styleClose.className = 'btn-close';
        styleClose.dataset.bsDismiss = 'modal';
        styleClose.ariaLabel = 'Close';
        styleContHead.appendChild(styleClose);

        const switchStyleElement = document.createElement('label');
        switchStyleElement.className = 'switch';
        switchStyleElement.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px; box-shadow: 0px 0px 5px #fff"></span>
            <span class="addingText" style="display: block; width: max-content; margin: 5px; padding-left: 50px"> Включить Переливание Текста </span>
        `;
        styleContBody.appendChild(switchStyleElement);

        var styleToggleCheck = document.getElementById('styleToggleCheck');
        if (localStorage.getItem('styleThemeEnabled') === 'true') {
            styleToggleCheck.checked = true;
            applyTextGradient();
        }
        styleToggleCheck.addEventListener('change', function() {
            if (styleToggleCheck.checked) {
                applyTextGradient();
                localStorage.setItem('styleThemeEnabled', 'true');
            } else {
                removeTextGradient();
                localStorage.setItem('styleThemeEnabled', 'false');
            }
        });
        function applyTextGradient() {
            const textGradient = document.createElement('style');
            textGradient.id = 'text-gradient';
            textGradient.textContent = `.td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
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
@keyframes gradientCategory {
    0% {background-position: 0% 100%;}
    100% {background-position: 1200% 100%;}
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
}`;
            document.head.appendChild(textGradient);
        }
        function removeTextGradient() {
            var textGradient = document.querySelector('#text-gradient');
            document.head.removeChild(textGradient);
        }

        const fontSelectorBlock = document.createElement('label');
        fontSelectorBlock.className = 'font-selector-block';
        styleContBody.appendChild(fontSelectorBlock);

        const fontSelector = document.createElement('select');
        fontSelector.id = 'font-selector';
        fontSelector.style.width = '40%';
        fontSelector.style.borderRadius = '20px';
        fontSelector.style.border = '1px solid #fff';
        fontSelector.style.background = '#222';
        fontSelector.style.color = '#fff';
        fontSelector.style.fontSize = '18px';
        fontSelector.style.textAlign = 'center';
        fontSelector.style.padding = '4px';
        fontSelector.style.marginTop = '25px';
        fontSelector.style.marginRight = '10px';
        fontSelector.style.boxShadow = '0px 0px 5px #fff';
        fontSelector.style.cursor = 'pointer';
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
        fontSelector.addEventListener('change', function() {
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
        colorSelector.id = 'color-selector';
        colorSelector.style.width = '40%';
        colorSelector.style.borderRadius = '20px';
        colorSelector.style.border = '1px solid #fff';
        colorSelector.style.background = '#222';
        colorSelector.style.color = '#fff';
        colorSelector.style.fontSize = '18px';
        colorSelector.style.textAlign = 'center';
        colorSelector.style.padding = '4px';
        colorSelector.style.marginTop = '25px';
        colorSelector.style.marginRight = '10px';
        colorSelector.style.boxShadow = '0px 0px 5px #fff';
        colorSelector.style.cursor = 'pointer';
        const storedColor = localStorage.getItem('selectedColor') || 'WHITE';
        const colors = ['WHITE', 'PINK', 'CYAN', 'KHAKI', 'SKYBLUE', 'PALEGREEN'];
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            if (color === storedColor) {
                option.selected = true;
                applySelectedStyle(color);
            }
            colorSelector.appendChild(option);
        });
        colorSelector.addEventListener('change', function() {
            const selectedColor = this.value;
            localStorage.setItem('selectedColor', selectedColor);
            applySelectedStyle(selectedColor);
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
        brightnessSlider.style.marginTop = '25px';
        brightnessSlider.style.marginRight = '10px';
        brightnessSlider.value = storedBright;
        brightnessSlider.addEventListener('input', function() {
            const brightnessValue = this.value;
            localStorage.setItem('savedBrightness', brightnessValue);
            htmlContent.style.filter = `brightness(${brightnessValue}%)`;
        });
        const filterHeading = document.querySelector('#log-filter-heading');
        if (filterHeading) {
            filterHeading.parentNode.insertBefore(brightnessSlider, filterHeading.nextSibling);
        }
        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `input[type=range]  {width: 40%; border-radius: 10px; -webkit-appearance: none; -moz-appearance: none; appearance: none; box-shadow: 0px 0px 5px #fff;}
                                   input[type=range]::-webkit-slider-runnable-track {border-radius: 10px; height: 15px; border: 2px solid #fff; background-color: #222;}
                                   input[type=range]::-webkit-slider-thumb {background: #444; border: 1px solid #fff; box-shadow: 0px 0px 2px #fff; border-radius: 25px; cursor: pointer; width: 15px; height: 30px; -webkit-appearance: none; margin-top: -8px;}
                                   input[type=range]::-moz-range-track {border-radius: 10px/100%; height: 5px; border: 1px solid cyan; background-color: #fff;}
                                   input[type=range]::-moz-range-thumb {background: #ecf0f1; border: 1px solid cyan; border-radius: 10px/100%; cursor: pointer;}`;
        document.head.appendChild(sliderStyle);
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
        colorNickElement.type = 'color';
        colorNickElement.style.marginTop = '20px';
        colorNickElement.style.marginRight = '10px';
        colorNickElement.style.width = '40%';
        colorNickElement.value = nickColor;
        colorNickElement.addEventListener('input', function() {
            const selectedColor = colorNickElement.value;
            const tdElements = document.querySelectorAll('td.td-player-name[data-v-2d76ca92=""]');
            localStorage.setItem('playerNameColor', selectedColor);
            tdElements.forEach(function(td) {
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
        colorCategoryElement.type = 'color';
        colorCategoryElement.style.marginTop = '20px';
        colorCategoryElement.style.marginRight = '10px';
        colorCategoryElement.style.width = '40%';
        colorCategoryElement.value = categoryColor;
        colorCategoryElement.addEventListener('input', function() {
            const selectedColor = colorCategoryElement.value;
            const tdElements = document.querySelectorAll('td.td-category[data-v-2d76ca92=""]');
            localStorage.setItem('categoryColor', selectedColor);
            tdElements.forEach(function(td) {
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
    }

    function applySavedColors() {
        const savedNick = localStorage.getItem('playerNameColor');
        const savedCategory = localStorage.getItem('categoryColor');
        const savedColors = document.createElement('style');
        savedColors.textContent = `.td-player-name[data-v-2d76ca92] a[data-v-2d76ca92] {
        color: ${savedNick};
        text-shadow: 0px 0px 1px ${savedNick};
        }
        .td-category[data-v-2d76ca92] a[data-v-2d76ca92] {
        color: ${savedCategory};
        text-shadow: 0px 0px 1px ${savedCategory};
        }`
        document.head.appendChild(savedColors);
    }

    function applySelectedStyle(color) {
    const currentStyleElement = document.getElementById('customStyle');
    if (currentStyleElement) {
        currentStyleElement.remove();
    }
    const styleElement = document.createElement('style');
    styleElement.id = 'customStyle';
    styleElement.textContent = `h1, h2, h3, h4, h5, h6 { color: ${color.toLowerCase()} !important; filter: contrast(0.8); text-shadow: 0px 0px 10px ${color.toLowerCase()} !important;}
    #log-filter[data-v-2d76ca92] .form-label[data-v-2d76ca92] {color: ${color.toLowerCase()} !important; filter: contrast(0.8); text-shadow: 0px 0px 2px ${color.toLowerCase()} !important;}
    #log-filter-section[data-v-2d76ca92] {border: 1px solid ${color.toLowerCase()} !important;}
    .navbar-dark .navbar-nav .nav-link {color: ${color.toLowerCase()} !important; filter: contrast(0.8); text-shadow: 0px 0px 2px ${color.toLowerCase()} !important;}
    #log-table[data-v-2d76ca92]>:not(:last-child)>:last-child>*, .table>:not(:last-child)>:last-child>* {color: ${color.toLowerCase()} !important; border-bottom: 1px solid ${color.toLowerCase()} !important;}
    #log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {color: ${color.toLowerCase()} !important; text-shadow: 0px 0px 2px ${color.toLowerCase()} !important;}
    #log-table[data-v-2d76ca92]>:not(caption)>*>*, .table-borderless>:not(caption)>*>* {border-bottom: 1px solid ${color.toLowerCase()} !important;}
    #log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92] td[data-v-2d76ca92] {color: ${color.toLowerCase()} !important; text-shadow: 0px 0px 2px ${color.toLowerCase()} !important;}
    .form-control {color: ${color.toLowerCase()} !important; border: 1px solid ${color.toLowerCase()} !important;}
    .input-group.has-validation>.dropdown-toggle:nth-last-child(n+4), .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu), .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {color: ${color.toLowerCase()} !important; border: 1px solid ${color.toLowerCase()} !important;}
    .autoComplete_wrapper>input {border: 1px solid ${color.toLowerCase()} !important;}
    .dp__input{border: 1px solid ${color.toLowerCase()} !important;};
    ` ;
    document.head.appendChild(styleElement);
    }

    function applySwitchStyle() {
    const switchStyle = document.createElement('style');
    switchStyle.textContent = `
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
            background-color: #ccc;
            transition: all .4s ease;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: all .4s ease;
        }
        input:checked + .slider {
            background-color: #222;
        }
        input:focus + .slider {
            box-shadow: 0 0 1px #222;
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
    `;
    document.head.appendChild(switchStyle);};

    function applyBodyStyle() {
        const bodyStyle = document.createElement('style');
        bodyStyle.textContent = `
        .bg-dark {
    bs-bg-opacity: 0;
    background: #000 !important;
}
.modal-header {
    border-top-left-radius: 25px !important;
    border-top-right-radius: 25px !important;
}
.modal-body {
    border-bottom-left-radius: 25px !important;
    border-bottom-right-radius: 25px !important;
}
.modal-content {
    border-radius: 25px;
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
.addingText {
    font-size: 20px;
    font-style: italic;
    font-weight: 800;
}
h1, h2, h3, h4, h5, h6 {
    color: #fff;
    text-shadow: 0px 0px 10px #fff;
}
#game-logs-app {
  background: #000;
}
body {
    background-color: #000;
    background-size: 100%;
}
.navbar-dark .navbar-brand, .navbar-dark .navbar-brand:focus, .navbar-dark .navbar-brand:hover {
    color: #fff;
    font-weight: 900;
}
@keyframes textGradient {
    0% { background-position: 0% 50%; }
    100% { background-position: 1200% 50%; }
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
#log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92] td[data-v-2d76ca92] {
    padding: 0.5rem 0.5rem 0.5rem 1.5rem;
    background: #000;
    color: #fff;
    text-shadow: 0px 0px 2px #fff;
}
.td-index[data-v-2d76ca92] {
    background: linear-gradient(90deg, rgba(51,51,51,1) 0%, rgba(17,17,17,1) 100%) !important;
    color: #fff;
}
#log-table[data-v-2d76ca92]>:not(caption)>*>*, .table-borderless>:not(caption)>*>* {
    border: 1px solid rgba(0,0,0,0);
    border-bottom: 1px solid #fff;
}
.bi-sort-down::before {
    color: #f90;
    text-shadow: 0px 0px 2px #f90;
}
.bi-sort-up::before {
    color: #f90;
    text-shadow: 0px 0px 2px #f90;
}
#log-table[data-v-2d76ca92] .first-row[data-v-2d76ca92] td[data-v-2d76ca92] {
    border: 1px solid rgba(0,0,0,0);
    text-align: center;
}
#log-filter-section[data-v-2d76ca92] {
    background: #000;
    border: 1px solid #fff;
    border-radius: 25px;
    height: 830px;
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
.btn-outline-danger {
    border: 3px solid #f00;
    color: #f00;
    border-radius: 10px;
}
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
.form-control {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-clip: padding-box;
    background-color: #fff;
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
    background-color: #fff;
    border-color: #fff;
    box-shadow: 0px 0px 10px #fff;
    color: #212529;
    outline: 0;
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
#placeholder-pic[data-v-9c1e68e2] {
    display: block;
    opacity: 0;
    margin: auto;
    max-height: 20rem;
}
#content-placeholder[data-v-9c1e68e2] {
    background-image: url(https://snipboard.io/8kBudo.jpg);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}
.bi-question-circle-fill::before {
    color: #666;
    text-shadow: 0px 0px 10px #000;
}
.modal-header {
    background: #000;
    border: 1px solid #fff;
    align-items: center;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
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
}
.fade {
    transition: opacity .15s linear;
    backdrop-filter: blur(5px);
}
.show-filter-btn[data-v-2d76ca92] {
    background: #328;
    border-bottom-left-radius: 10px;
    border: 0;
    height: 44px;
    opacity: 1;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1059;
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
input#playerNameInput::placeholder {
  color: #a60;
}
.multiselect.is-open.is-active {
box-shadow: 0px 0px 10px #fff;
}
.autoComplete_wrapper>input:hover {
    color: #a60;
    transition: all .3s ease;
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
    background: #328;
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
    background: #328;
    color: #fff;
    transition: all .3s ease-in-out;
  }
.dp__today {
    border: 1px solid #fff;
  }
.btn-outline-danger:hover {
    background-color: #900;
    border-color: #fff;
    color: #fff;
    transition: all .2s ease-in-out;
  }
.btn-primary:hover, .submit-btn:hover {
    background-color: #033;
    border-color: #fff;
    color: #fff;
    transition: all .2s ease-in-out;
  }
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
.lookup-comment[data-v-2d76ca92] {
    color: #fff;
    font-size: .9rem;
    font-weight: 400;
}
.accessible-servers .page-intro {
    color: #0ff;
    font-size: 1.15rem;
    font-weight: 300;
    text-align: center;
    text-shadow: 0px 0px 10px #fff;
}
a {
    color: #faf;
    text-decoration: none;
}
.dropdown-item:focus, .dropdown-item:hover {
    background-color: #444;
    color: #1e2125;
}
.dropdown-menu {
    background-color: #222;
}
.accessible-servers .game-logs-link {
    font-size: 1.5rem;
    text-shadow: 0px 0px 10px #f0f;
}
a:hover {
    color: #f0f;
}
#placeholder-msg[data-v-9c1e68e2] {
    color: #0aa;
    font-size: 1.25rem;
    padding: 1rem;
    text-align: center;
}
strong {
    color: #0ff;
}
.modal [type=button], .modal [type=submit] {
    margin-left: 0.5rem;
    filter: invert(1);
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
.dropdown-menu show {
    position: absolute;
    inset: 0px auto auto 0px;
    margin: 0px;
    transform: translate(-1px, 40px);
    background: #328;
}
.alert-danger, .alert-modal.failure .modal-content, .default-error-page .exception {
    background-color: #000;
    border: 5px solid #f11;
    border-radius: 50px;
    color: #fff;
}
    `;
        document.head.appendChild(bodyStyle);};

    function applyColorPickerStyle() {
        const colorPickerStyle = document.createElement('style');
        colorPickerStyle.textContent = `
        input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 2px;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 20px;
}
input[type="color"] {
  -webkit-appearance: none;
  border: 2px solid #fff;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  outline: none;
  cursor: pointer;
  box-shadow: 0px 0px 5px #fff;
}`;
        document.head.appendChild(colorPickerStyle);
    }

    function replaceSpinnerImage() {
        const spinnerElement = document.querySelector('div.spinner.spinner-border[data-v-173ec149=""]');
        if (spinnerElement) {
            const gifImageUrl = 'https://rb.ru/media/upload_tmp/2018/d1.gif';
            const gifImage = document.createElement('img');
            gifImage.src = gifImageUrl;
            gifImage.style.width = '160px';
            gifImage.style.height = '120px';
            gifImage.style.filter = 'saturate(0)';
            spinnerElement.replaceWith(gifImage);
        }
    }

    function addListener() {
        const inputNameElement = document.querySelector('#playerNameInput');
        const transactionData = document.querySelector('#log-filter-form__transaction-desc');
        inputNameElement.addEventListener('keydown', function(event) {
            if (event.keyCode === 13) {
                const otherElement = document.querySelector('.btn.btn-primary');
                otherElement.click();
            }
        });
        transactionData.addEventListener('keydown', function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                const otherElement = document.querySelector('.btn.btn-primary');
                otherElement.click();
            }
        });
    }

    function setPageTitle() {
        const titleElement = document.querySelector('div.container-fluid span.badge.bg-success');
        document.title += ' - ' + titleElement.textContent;
    }

    function scriptInit() {
        applySwitchStyle();

        applyBodyStyle();

        applyColorPickerStyle();

        replaceTableHeading();

        replaceSpinnerImage();

        addListener()

        applySavedColors();

        setPageTitle();
    }
})();