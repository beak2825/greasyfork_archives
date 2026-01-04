// ==UserScript==
// @name         カラーとサイズ以外リマインダー
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  項目名をカラーとサイズ以外にした場合、登録後に通知を表示
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @match        *://plus-nao.com/forests/*/sku_check/*
// @match        *://plus-nao.com/forests/*/contents
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/505278/%E3%82%AB%E3%83%A9%E3%83%BC%E3%81%A8%E3%82%B5%E3%82%A4%E3%82%BA%E4%BB%A5%E5%A4%96%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/505278/%E3%82%AB%E3%83%A9%E3%83%BC%E3%81%A8%E3%82%B5%E3%82%A4%E3%82%BA%E4%BB%A5%E5%A4%96%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targets = ['TbMainproduct縦軸項目名', 'TbMainproduct横軸項目名'];
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1lLqUNM6SidsgvMvzn9Do6f7CFBuuYcZW7S18y4ubUFY/edit?pli=1&gid=1996423860';
    const storageKeyPrefix = 'NotColorSizeInputQueue_';
    const initialValuesKeyPrefix = 'InitialInputValues_';
    const savedTextKeyPrefix = 'SavedHeaderText_';

    function getStorageKey(pageUrl, keyPrefix) {
        return `${keyPrefix}${encodeURIComponent(pageUrl)}`;
    }

    function getInitialValues(pageUrl) {
        try {
            const initialValues = localStorage.getItem(getStorageKey(pageUrl, initialValuesKeyPrefix));
            return initialValues ? JSON.parse(initialValues) : {};
        } catch (error) {
            return {};
        }
    }

    function getSavedHeaderText() {
        try {
            const savedText = localStorage.getItem(savedTextKeyPrefix) || '';
            return savedText;
        } catch (error) {
            return '';
        }
    }

    function saveInputAndHeader(value) {
        const pageUrl = window.location.href;
        const inputQueueKey = getStorageKey(pageUrl, storageKeyPrefix);
        const headerText = document.querySelector('h2').textContent;
        const match = headerText.match(/\[(.*?)\]/);
        const extractedText = match ? match[1] : 'ID無し';

        let inputQueue = JSON.parse(localStorage.getItem(inputQueueKey)) || [];
        inputQueue.push({ header: extractedText, input: value });
        if (inputQueue.length > 10) {
            inputQueue.shift();
        }

        try {
            localStorage.setItem(inputQueueKey, JSON.stringify(inputQueue));
            const savedHeaderText = getSavedHeaderText();
            const newHeaderText = savedHeaderText ? `${savedHeaderText}, ${extractedText}` : extractedText;
            localStorage.setItem(savedTextKeyPrefix, newHeaderText);
        } catch (error) {
        }
    }

    function showNotificationIfNeeded() {
        const savedHeaderText = getSavedHeaderText();

        if (savedHeaderText) {
            const uniqueHeaders = [...new Set(savedHeaderText.split(', ').filter(header => header))];
            const headersText = uniqueHeaders
                .map(header => `<span style="font-family: Verdana; font-size: 10pt; color: #000000;">${header}</span>`)
                .join('<br>');

            const message = `
                ${headersText}<br>
                <span style="font-family: Verdana;">項目名にカラーとサイズ以外が入力されました</span>
            `;

            showCustomNotification(message);
        }
    }

    function showCustomNotification(message) {
        let existingNotification = document.getElementById('custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'custom-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.padding = '12px';
        notification.style.backgroundColor = '#e3f2fd';
        notification.style.color = '#0d47a1';
        notification.style.border = '1px solid #90caf9';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = 10001;
        notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        notification.style.lineHeight = '1.5';

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '2px';
        closeButton.style.right = '2px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = '#0d47a1';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = '40px';
        closeButton.style.height = '40px';
        closeButton.style.lineHeight = '40px';
        closeButton.style.textAlign = 'center';
        closeButton.style.padding = '0';
        closeButton.addEventListener('click', () => {
            notification.remove();
            try {
                localStorage.removeItem(savedTextKeyPrefix);
            } catch (error) {
            }
        });

        notification.innerHTML = `
            <p style="margin: 0; font-family: Verdana;">${message}</p>
            <a href="${sheetUrl}" target="_blank" style="color: #1e88e5;">「カラーとサイズ以外にした場合」</a>を新しく開く
        `;
        notification.appendChild(closeButton);
        document.body.appendChild(notification);
    }

    function checkInput(changedFields) {
        const pageUrl = window.location.href;
        let foundInput = false;

        if (!Array.isArray(changedFields)) {
            changedFields = [];
        }

        changedFields.forEach(id => {
            const inputField = document.getElementById(id);
            if (inputField) {
                const value = inputField.value.trim();

                if (value !== 'カラー' && value !== 'サイズ' && value !== '-' && value !== '--' && value.trim() !== '') {
                    saveInputAndHeader(value);
                    foundInput = true;
                }
            }
        });

        if (foundInput) {
            showNotificationIfNeeded();
        }
    }

    function initializeInitialValues() {
        const pageUrl = window.location.href;
        let initialValues = getInitialValues(pageUrl);

        targets.forEach(targetId => {
            const inputElement = document.getElementById(targetId);
            if (inputElement) {
                initialValues[targetId] = inputElement.value.trim();
            }
        });

        try {
            localStorage.setItem(getStorageKey(pageUrl, initialValuesKeyPrefix), JSON.stringify(initialValues));
        } catch (error) {
        }
    }

    function handleButtonClick(buttonId, isSaveAndSkuStock) {
        const pageUrl = window.location.href;
        const initialValues = getInitialValues(pageUrl);

        let changedFields = [];
        targets.forEach(targetId => {
            const inputElement = document.getElementById(targetId);
            if (inputElement) {
                const value = inputElement.value.trim();
                const initialValue = initialValues[targetId] || '';

                if (isSaveAndSkuStock) {
                    changedFields.push(targetId);
                } else if (value !== initialValue) {
                    changedFields.push(targetId);
                }
            }
        });

        checkInput(changedFields);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initializeInitialValues();

        const registeredSaveButton = document.getElementById('registeredSaveButton');
        const registeredSaveAndSkuStock = document.getElementById('registeredSaveAndSkuStock');
        const saveAndSkuStock = document.getElementById('saveAndSkuStock');

        if (registeredSaveButton) {
            registeredSaveButton.addEventListener('click', () => handleButtonClick('registeredSaveButton', false));
        }

        if (registeredSaveAndSkuStock) {
            registeredSaveAndSkuStock.addEventListener('click', () => handleButtonClick('registeredSaveAndSkuStock', false));
        }

        if (saveAndSkuStock) {
            saveAndSkuStock.addEventListener('click', () => handleButtonClick('saveAndSkuStock', true));
        }

        showNotificationIfNeeded();
    });
})();
