// ==UserScript==
// @name         BagList copy
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Copy relevant URLs to the clipboard with buttons
// @author       SokoliukYevhen
// @match        https://tngadmin.triplenext.net/Admin/CompareBag/BagList*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486688/BagList%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/486688/BagList%20copy.meta.js
// ==/UserScript==


    // Контейнер для кнопок
    const containerStyles = {
        position: 'fixed',
        zIndex: '9999',
        top: '50%',
        left: '45%',
        transform: 'translate(-50%, -50%)',
        display: 'none', // скрывать при запуске
    };
    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, containerStyles);
    document.body.appendChild(buttonContainer);
    // Стили кнопок
    const buttonStyles = {
        backgroundColor: '#3daae9',
        width: '150px',
        height: '50px',
        border: '5px solid #1A30D9f',
        color: 'white',
        fontFamily: 'Telex, sans-serif',
        margin: '5px',
        position: 'absolute',
        opacity: '0.8',
        fontSize: '21px',
};
    // Горячая клавиша для появления контейнера
    function toggleContainerVisibility() {
        buttonContainer.style.display = buttonContainer.style.display === 'none' ? 'block' : 'none';
    }
    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.code === 'KeyZ') {
            toggleContainerVisibility();
        }
    });
    document.addEventListener('click', (event) => {
        // Если клик был вне контейнера, скрываем его
        if (!buttonContainer.contains(event.target)) {
            buttonContainer.style.display = 'none';
        }
    });
    buttonContainer.addEventListener('click', (event) => {
        // Закрываем контейнер при нажатии на кнопки внутри него
        if (event.target.tagName === 'BUTTON') {
            buttonContainer.style.display = 'none';
        }
    });
(function () {
    'use strict';

    // Стили позиции для каждой категории
    const positionStyles = {
        'Admin': { top: '0', left: '-150px' },
        'ID': { top: '50px', left: '-150px' },
        'Url': { top: '0px', left: '150px' },
        'Widget': { top: '0px', left: '0px' },
    };
    // Стили для уведомлений
    const alertStyles = {
        position: 'fixed',
        zIndex: '10000',
        top: '50%',
        left: '45%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff',
        padding: '10px',
        border: '1px solid #000000',

    };
    // Функция копирования текста в буфер обмена
    function copyToClipboard(text) {
        GM_setClipboard(text, 'text');
    }
    // Обрезает параметры URL
    function trimURLParameters(url) {
        return url.split('?')[0];
    }
    // Обрезает префикс ID
    function trimIDPrefix(url) {
        const prefix = 'https://tngadmin.triplenext.net/Admin/CompareBag/EditBag/';
        return url.startsWith(prefix) ? url.substring(prefix.length) : url;
    }
    // Создает уведомление
    function createNotification(message) {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = message;
        Object.assign(alertDiv.style, alertStyles);
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 1000);

    }
    // Создает кнопку
    function createButton(buttonText, urlSelector, position, trimParameters, alertMessage, id) {
        const button = document.createElement('button');
        button.innerHTML = buttonText;
        Object.assign(button.style, buttonStyles, positionStyles[position]);
        button.id = id;
        button.addEventListener('click', () => {
            const urls = document.querySelectorAll(urlSelector);
            const urlArray = Array.from(urls).map(url => trimParameters && urlSelector.includes('EditBag/') ? trimURLParameters(url.href) : url.href);
            copyToClipboard(urlArray.join('\n'));
            createNotification(alertMessage);
        });
        buttonContainer.appendChild(button);
    }
    // Создает кнопку "ALL"
    function createAllButton() {
        const allButton = document.createElement('button');
        allButton.innerHTML = 'ALL';
        Object.assign(allButton.style, buttonStyles, { top: '50px', left: '0px' });
        allButton.addEventListener('click', () => {
            const categories = [
                { selector: 'body > div.container.notification > table:nth-child(5) > tbody td:nth-child(7)', trim: false },
                { selector: 'body > div.container.notification > table:nth-child(5) > tbody td:nth-child(3)', trim: false },
                { selector: 'body > div.container.notification > table:nth-child(5) > tbody td:nth-child(5)', trim: false },
                { selector: 'body > div.container.notification > table:nth-child(5) > tbody td:nth-child(6)', trim: false },
                { selector: 'a[href*="EditBag/"]', trim: true },
                { selector: 'a[href*="https://"]:not([href*="yrulerwidget-westus"]):not([href*="cdn.tangiblee.com"]), a[href$=".html"]:not([href*="yrulerwidget-westus"]):not([href*="cdn.tangiblee.com"])', trim: false },
                { selector: 'a[href*="cdn.tangiblee.com"]', trim: false },
            ];
            const allUrlArray = categories.map(category => {
                const elements = document.querySelectorAll(category.selector);
                return Array.from(elements).map(element => category.trim ? trimURLParameters(element.href || element.textContent.trim()) : element.href || element.textContent.trim());
            });
            const transposedUrlArray = allUrlArray[0].map((_, colIndex) => allUrlArray.map(row => row[colIndex]));
            copyToClipboard(transposedUrlArray.map(row => row.join('\t')).join('\n'));
            createNotification(messages.all);
        });
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.code === 'KeyC') {
                allButton.click();
            }
        });
        buttonContainer.appendChild(allButton);
    }
    // Сообщения для уведомлений
    const messages = {
        admin: 'Ссылки на Admin скопированы',
        url: 'Ссылки на URL скопированы',
        widget: 'Ссылки на WIDGET скопированы.',
        all: 'Все данные скопированы',
        sku: 'Скопированы SKU',
        id: 'Скопированы ID',
    };
    // Создание кнопки Admin
    createButton('Admin', 'a[href*="EditBag/"]', 'Admin', true, messages.admin, 'adminButton');
    // Создание кнопок для ID, URL и Widget
    createButton('ID', 'a[href*="EditBag/"]', 'ID', true, messages.id, 'IdButton');
    createButton('Url', 'a[href*="https://"]:not([href*="yrulerwidget-westus"]):not([href*="cdn.tangiblee.com"]), a[href$=".html"]:not([href*="yrulerwidget-westus"]):not([href*="cdn.tangiblee.com"])', 'Url', false, messages.url, 'urlButton');
    createButton('Widget', 'a[href*="cdn.tangiblee.com"]', 'Widget', false, messages.widget, 'widgetButton');
    // Создание кнопки "ALL"
    createAllButton();
    // Добавляем новое событие для кнопки ID
    document.getElementById('IdButton').addEventListener('click', (event) => {
        const urls = document.querySelectorAll('a[href*="EditBag/"]');
        const urlArray = Array.from(urls).map(url => trimURLParameters(trimIDPrefix(url.href)));

        const separator = event.ctrlKey ? ',' : (event.altKey ? ' ' : ', ');
        copyToClipboard(urlArray.join(separator));
        createNotification(messages.id);
    });
    // Создание кнопки SKU
    function createSkuButton() {
        const skuButton = document.createElement('button');
        skuButton.innerHTML = 'SKU';
        Object.assign(skuButton.style, buttonStyles, { top: '50px', left: '150px' });
        skuButton.addEventListener('click', (event) => {
            const skuElements = document.querySelectorAll('body > div.container.notification > table:nth-child(5) > tbody td:nth-child(3)');
            const skuArray = Array.from(skuElements).map(skuElement => skuElement.textContent.trim());
            const separator = event.ctrlKey ? ',' : (event.altKey ? ' ' : ', ');
            copyToClipboard(skuArray.join(separator));
            createNotification(messages.sku);
        });
        buttonContainer.appendChild(skuButton);
    }
    createSkuButton();
})();


