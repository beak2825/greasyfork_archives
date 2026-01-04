// ==UserScript==
// @name         CMB - Custom Mpp Buttons by gtnntg
// @name:ru      КПМ - Настраиваемые кнопки Mpp от gtnntg
// @version      0.1.3
// @devversion   0.6.3
// @description  Custom buttons for Multiplayer Piano with panel navigation
// @description:ru Настраиваемые кнопки для Multiplayer Piano с системой навигации по панелям
// @author       gtnntg
// @remixauthor  /
// @license      MIT
// @namespace    https://vscode.dev/?connectTo=tampermonkey
// @match        *://multiplayerpiano.org/*
// @match        *://multiplayerpiano.net/*
// @match        *://piano.ourworldofpixels.com/*
// @match        *://playground-mpp.hyye.tk/*
// @match        *://rgbmpp.qwerty0301.repl.co/*
// @match        *://mpp.hyye.tk/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486707/CMB%20-%20Custom%20Mpp%20Buttons%20by%20gtnntg.user.js
// @updateURL https://update.greasyfork.org/scripts/486707/CMB%20-%20Custom%20Mpp%20Buttons%20by%20gtnntg.meta.js
// ==/UserScript==
/* globals MPP */
/*---------[Author info]-------------
 [discord: gtnntg]
 [e-mail: developer.georgiyshvedov@mail.ru]
 [github: https://github.com/zeroxel]
--------------------------------------*/
/*---------[Remix Author info]-------------
 If you would like to modify the script or change it in any way. 
 Please fill in your information
 You can use author as an example
--------------------------------------*/
/*---------[RU:info]------------
настоящая версия скрипта: 0.6.0

Лицензия и авторское право:
Copyright (C) 2024  Georgiy Shvedov (developer.georgiyshvedov@mail.ru)

Эта программа является свободным программным обеспечением: вы можете распространять ее и/или модифицировать
ее в соответствии с условиями MIT License.

Эта программа распространяется в надежде, что она будет полезной,
но БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ; даже без подразумеваемой гарантии
ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ. См.
MIT License для получения более подробных сведений.

Вы должны были получить копию MIT License
вместе с этой программой. Если нет, см.
<https://opensource.org/licenses/MIT>.
-----------------------------*/

/*---------[EN:info]------------
Current script version: 0.6.0

License and Copyright:
Copyright (C) 2024 Georgiy Shvedov (developer.georgiyshvedov@mail.ru)

This program is free software: you can redistribute it and/or modify
it under the terms of the MIT License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
MIT License for more details.

You should have received a copy of the MIT License
along with this program. If not, see <https://opensource.org/licenses/MIT>.
-----------------------------*/

//-------script-----------
(function() {
    'use strict';

    // CSS для панелей и кнопок
    const CSS = `
    :root {
        --panel-bg-color: rgba(255, 255, 255, 0.9);
        --panel-header-color: rgba(51, 51, 51, 0.9);
        --panel-header-text-color: #ffffff;
        --button-bg-color: rgba(0, 123, 255, 0.9);
        --button-text-color: #ffffff;
        --category-bg-color: rgba(255, 255, 255, 0.5); /* Прозрачный фон для подзаголовков */
        --border-radius: 5px; /* Закругление краев */
    }

    .custom-panel {
        position: fixed;
        top: 20px;
        left: 0;
        width: 250px;
        background-color: var(--panel-bg-color);
        border: 1px solid #ccc;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: none;
        overflow: hidden;
        border-radius: var(--border-radius);
    }

    .panel-header {
        background-color: var(--panel-header-color);
        color: var(--panel-header-text-color);
        padding: 10px;
        font-weight: bold;
        cursor: move;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .custom-button {
        background-color: var(--button-bg-color);
        color: var(--button-text-color);
        border: none;
        padding: 10px;
        margin: 5px;
        cursor: pointer;
        border-radius: var(--border-radius);
        display: block;
        width: calc(100% - 20px);
        box-sizing: border-box;
    }

    .panel-category {
        background-color: var(--category-bg-color); /* Прозрачный фон */
        padding: 10px;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        margin-bottom: 5px;
        border-radius: var(--border-radius); /* Закругленные углы */
    }

    .panel-content {
        padding: 10px;
    }

    .slide-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: 100%;
        background: var(--panel-bg-color);
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        overflow: hidden;
        z-index: 1001;
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius);
    }

    .slide-panel.open {
        transform: translateX(0);
    }

    .close-button {
        background: red;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 50%;
        z-index: 1002;
    }

    .toggle-button {
        position: fixed;
        top: 20px;
        left: 20px;
        background: var(--panel-header-color);
        color: var(--panel-header-text-color);
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: var(--border-radius);
        z-index: 1002;
    }

    .style-customizer {
        margin: 20px;
        padding: 10px;
        background: var(--panel-bg-color);
        border: 1px solid #ccc;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        border-radius: var(--border-radius);
    }

    .style-section {
        margin-bottom: 15px;
    }

    .field-container {
        margin-bottom: 10px;
    }

    .field-container label {
        display: block;
        margin-bottom: 5px;
    }

    .field-container input[type="color"],
    .field-container input[type="range"] {
        width: 100%;
    }
    `;

    // Добавление стилей в документ
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = CSS;
    document.head.appendChild(styleSheet);

    // Переменные для настроек стилей
    const DEFAULT_STYLES = {
        panelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        panelHeaderColor: 'rgba(51, 51, 51, 0.9)',
        panelHeaderTextColor: '#ffffff',
        buttonBackgroundColor: 'rgba(0, 123, 255, 0.9)',
        buttonTextColor: '#ffffff',
        categoryBackgroundColor: 'rgba(255, 255, 255, 0.5)', /* Прозрачный фон для подзаголовков */
        borderRadius: '5px'
    };

    // Проверка активности скрипта
    const SCRIPT_ACTIVE_KEY = 'scriptActive';
    function isScriptActive() {
        return GM_getValue(SCRIPT_ACTIVE_KEY, true);
    }

    // Функция для активации/деактивации скрипта
    function setScriptActive(state) {
        GM_setValue(SCRIPT_ACTIVE_KEY, state);
        if (state) {
            showPanels();
            createSlidePanel();
        } else {
            hidePanels();
        }
    }

    // Получение и сохранение стилей
    function getStyles() {
        return GM_getValue('panelStyles', DEFAULT_STYLES);
    }

    function setStyles(styles) {
        GM_setValue('panelStyles', styles);
        applyStyles();
    }

    // Применение стилей
    function applyStyles() {
        const styles = getStyles();
        document.documentElement.style.setProperty('--panel-bg-color', styles.panelBackgroundColor);
        document.documentElement.style.setProperty('--panel-header-color', styles.panelHeaderColor);
        document.documentElement.style.setProperty('--panel-header-text-color', styles.panelHeaderTextColor);
        document.documentElement.style.setProperty('--button-bg-color', styles.buttonBackgroundColor);
        document.documentElement.style.setProperty('--button-text-color', styles.buttonTextColor);
        document.documentElement.style.setProperty('--category-bg-color', styles.categoryBackgroundColor); /* Прозрачный фон для подзаголовков */
        document.documentElement.style.setProperty('--border-radius', styles.borderRadius);
    }

    // Создание панели
    function createPanel(title, id, categories) {
        const panel = document.createElement('div');
        panel.id = id;
        panel.className = 'custom-panel';

        const header = document.createElement('div');
        header.className = 'panel-header';
        header.textContent = title;
        panel.appendChild(header);

        // Создание контента для панелей
        const panelContent = document.createElement('div');
        panelContent.className = 'panel-content';
        categories.forEach(category => {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'panel-category';
            categoryHeader.textContent = category.title;
            panelContent.appendChild(categoryHeader);

            category.buttons.forEach(button => {
                const btn = createButton(button.text, button.action);
                panelContent.appendChild(btn);
            });
        });

        panel.appendChild(panelContent);
        document.body.appendChild(panel);
        makeElementDraggable(panel, header);

        return panel;
    }

    // Функция для создания кнопок
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'custom-button';
        button.onclick = onClick;
        return button;
    }

    // Создание и отображение панелей
    function showPanels() {
        const panelsConfig = [
            {
                title: 'Panel 1',
                id: 'custom-panel-1',
                categories: [
                    {
                        title: 'Category 1',
                        buttons: [
                            { text: 'Button 1', action: () => alert('Button 1 clicked') },
                            { text: 'Button 2', action: () => alert('Button 2 clicked') }
                        ]
                    },
                    {
                        title: 'Category 2',
                        buttons: [
                            { text: 'Button 3', action: () => alert('Button 3 clicked') },
                            { text: 'Button 4', action: () => alert('Button 4 clicked') }
                        ]
                    }
                ]
            },
            {
                title: 'Panel 2',
                id: 'custom-panel-2',
                categories: [
                    {
                        title: 'General',
                        buttons: [
                            { text: 'General 1', action: () => alert('General 1 clicked') },
                            { text: 'General 2', action: () => alert('General 2 clicked') }
                        ]
                    }
                ]
            }
        ];

        panelsConfig.forEach(config => {
            const panel = createPanel(config.title, config.id, config.categories);
            panel.style.display = 'block';
        });

        applyStyles();
    }

    // Скрытие панелей
    function hidePanels() {
        const panels = document.querySelectorAll('.custom-panel');
        panels.forEach(panel => panel.style.display = 'none');
    }

    // Функция для создания выдвижной панели
    function createSlidePanel() {
        const slidePanel = document.createElement('div');
        slidePanel.id = 'slide-panel';
        slidePanel.className = 'slide-panel';
        document.body.appendChild(slidePanel);

        const closeButton = document.createElement('button');
        closeButton.id = 'close-slide-panel';
        closeButton.className = 'close-button';
        closeButton.textContent = '✖';
        closeButton.onclick = () => {
            slidePanel.classList.remove('open');
            document.getElementById('toggle-slide-panel').style.display = 'block';
        };
        slidePanel.appendChild(closeButton);

        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-slide-panel';
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = '☰';
        toggleButton.onclick = () => {
            slidePanel.classList.toggle('open');
            toggleButton.style.display = 'none';
            closeButton.style.display = 'block';
        };
        document.body.appendChild(toggleButton);

        const panelButtons = document.createElement('div');
        panelButtons.className = 'panel-buttons';
        slidePanel.appendChild(panelButtons);

        const panel1Button = createButton('Show Panel 1', () => togglePanel('custom-panel-1'));
        const panel2Button = createButton('Show Panel 2', () => togglePanel('custom-panel-2'));
        panelButtons.appendChild(panel1Button);
        panelButtons.appendChild(panel2Button);

        createStyleCustomizer(slidePanel);
    }

    // Функция для переключения видимости панелей
    function togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    }

    // Функция для создания кастомизатора стилей
    function createStyleCustomizer(parentElement) {
        const customizer = document.createElement('div');
        customizer.className = 'style-customizer';
        parentElement.appendChild(customizer);

        const styleSections = [
            { name: 'Panel Background Color', key: 'panelBackgroundColor', type: 'color' },
            { name: 'Panel Header Color', key: 'panelHeaderColor', type: 'color' },
            { name: 'Panel Header Text Color', key: 'panelHeaderTextColor', type: 'color' },
            { name: 'Button Background Color', key: 'buttonBackgroundColor', type: 'color' },
            { name: 'Button Text Color', key: 'buttonTextColor', type: 'color' },
            { name: 'Category Background Color', key: 'categoryBackgroundColor', type: 'color' }, /* Новый параметр */
            { name: 'Border Radius', key: 'borderRadius', type: 'range', min: 0, max: 50, step: 1 }
        ];

        styleSections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'style-section';

            const label = document.createElement('label');
            label.textContent = section.name;
            sectionDiv.appendChild(label);

            const input = document.createElement('input');
            input.type = section.type;
            input.value = getStyles()[section.key];
            if (section.type === 'range') {
                input.min = section.min;
                input.max = section.max;
                input.step = section.step;
            }
            input.onchange = (e) => {
                const newStyles = getStyles();
                newStyles[section.key] = section.type === 'range' ? `${e.target.value}px` : e.target.value;
                setStyles(newStyles);
            };
            sectionDiv.appendChild(input);

            customizer.appendChild(sectionDiv);
        });
    }

    // Функция для перемещения элементов
    function makeElementDraggable(element, handle) {
        handle.onmousedown = function(e) {
            e.preventDefault();
            let shiftX = e.clientX - element.getBoundingClientRect().left;
            let shiftY = e.clientY - element.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                element.style.left = pageX - shiftX + 'px';
                element.style.top = pageY - shiftY + 'px';
            }

            moveAt(e.pageX, e.pageY);

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            handle.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                handle.onmouseup = null;
            };
        };

        handle.ondragstart = function() {
            return false;
        };
    }

    // Запуск скрипта
    setScriptActive(isScriptActive());
})();
