// ==UserScript==
// @name         BagList copy
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Copy relevant URLs to the clipboard with buttons
// @author       SokoliukYevhen
// @match        https://tngadmin.triplenext.net/Admin/CompareBag/BagList*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/486263/BagList%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/486263/BagList%20copy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const buttonStyles = {
        position: 'fixed',
        zIndex: '9999',
        backgroundColor: '#3daae9',
        width: '100px',
        height: '26px',
        border: '1px solid #ffffff',
        color: 'white',
        fontFamily: 'Telex, sans-serif',
    };

    const positionStyles = {
        'top-left': { top: '0px', left: '0px' },
        'top-right': { top: '0px', left: '200px'},
        'bottom-left': { top: '0px', left: '100px' },
        'bottom-right': { bottom: '10px', right: '10px' },
        'ID': { top: '25px', left: '200px' },
    };

    const alertStyles = {
        position: 'fixed',
        zIndex: '10000',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#ffffff',
        padding: '10px',
        border: '1px solid #000000',
    };

    function copyToClipboard(text) {
        GM_setClipboard(text, 'text');
    }

    function trimURLParameters(url) {
        return url.split('?')[0];
    }

    function trimIDPrefix(url) {
        const prefix = 'https://tngadmin.triplenext.net/Admin/CompareBag/EditBag/';
        return url.startsWith(prefix) ? url.substring(prefix.length) : url;
    }

    function createNotification(message) {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = message;
        Object.assign(alertDiv.style, alertStyles);
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 1000);
    }

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

        document.body.appendChild(button);
    }

    function createAllButton() {
        const allButton = document.createElement('button');
        allButton.innerHTML = 'ALL';
        Object.assign(allButton.style, buttonStyles, { top: '25px', left: '100px', width: '100px', height: '26px' });

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

        document.body.appendChild(allButton);
    }

    const messages = {
        admin: 'Ссылки на Admin скопированы',
        url: 'Ссылки на URL скопированы',
        widget: 'Ссылки на WIDGET скопированы.',
        all: 'Скопировано',
        sku: 'Скопированы SKU',
        id: 'Скопированы ID',
    };

    // Создание оригинальной кнопки Admin
    createButton('Admin', 'a[href*="EditBag/"]', 'top-left', true, messages.admin, 'adminButton');

    // Создание дубликата кнопки Admin
    createButton('ID', 'a[href*="EditBag/"]', 'ID', true, messages.id, 'IdButton');
    createButton('Url', 'a[href*="https://"]:not([href*="yrulerwidget-westus"]):not([href*="cdn.tangiblee.com"]), a[href$=".html"]:not([href*="yrulerwidget-westus"]):not([href*="cdn.tangiblee.com"])', 'top-right', false, messages.url, 'urlButton');
    createButton('Widget', 'a[href*="cdn.tangiblee.com"]', 'bottom-left', false, messages.widget, 'widgetButton');

    createAllButton();

    // Добавляем новое событие для кнопки ID
    document.getElementById('IdButton').addEventListener('click', (event) => {
    const urls = document.querySelectorAll('a[href*="EditBag/"]');
    const urlArray = Array.from(urls).map(url => trimURLParameters(trimIDPrefix(url.href)));

    const separator = event.ctrlKey ? ',' : (event.altKey ? ' ' : ', ');
    copyToClipboard(urlArray.join(separator));
    createNotification(messages.id);
});


    function createSkuButton() {
        const skuButton = document.createElement('button');
        skuButton.innerHTML = 'SKU';
        Object.assign(skuButton.style, buttonStyles, { top: '25px', left: '0px' });

        skuButton.addEventListener('click', (event) => {
            const skuElements = document.querySelectorAll('body > div.container.notification > table:nth-child(5) > tbody td:nth-child(3)');
            const skuArray = Array.from(skuElements).map(skuElement => skuElement.textContent.trim());

            const separator = event.ctrlKey ? ',' : (event.altKey ? ' ' : ', ');
            copyToClipboard(skuArray.join(separator));
            createNotification(messages.sku);
        });

        document.body.appendChild(skuButton);
    }

    createSkuButton();
})();
