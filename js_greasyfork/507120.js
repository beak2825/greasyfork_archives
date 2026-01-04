// ==UserScript==
// @name         ［テスト用］カラーとサイズ以外リマインダー
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  項目名をカラーとサイズ以外にした場合、登録後に通知を表示
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @match        *://plus-nao.com/forests/*/sku_check/*
// @match        *://plus-nao.com/forests/*/sku_edit/*
// @match        *://plus-nao.com/forests/*/contents
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/507120/%EF%BC%BB%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%EF%BC%BD%E3%82%AB%E3%83%A9%E3%83%BC%E3%81%A8%E3%82%B5%E3%82%A4%E3%82%BA%E4%BB%A5%E5%A4%96%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/507120/%EF%BC%BB%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%EF%BC%BD%E3%82%AB%E3%83%A9%E3%83%BC%E3%81%A8%E3%82%B5%E3%82%A4%E3%82%BA%E4%BB%A5%E5%A4%96%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targets = ['TbMainproduct縦軸項目名', 'TbMainproduct横軸項目名'];
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1lLqUNM6SidsgvMvzn9Do6f7CFBuuYcZW7S18y4ubUFY/edit?pli=1&gid=1996423860';
    const dbName = 'reminderDB';
    const storageKeyPrefix = 'NotColorSizeInputQueue_';
    const initialValuesKeyPrefix = 'InitialInputValues_';
    const savedTextKeyPrefix = 'SavedHeaderText_';

    /** ======= IndexedDBのセットアップ ======= **/
    let db;
    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onerror = (event) => reject(event);
            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('inputs')) {
                    db.createObjectStore('inputs', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('savedText')) {
                    db.createObjectStore('savedText', { keyPath: 'id' });
                }
            };
        });
    };

    const saveToDB = (storeName, data) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event);
        });
    };

    const getFromDB = (storeName, key) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event);
        });
    };

    /** ======= データ管理 ======= **/
    const StorageManager = {
        async getInitialValues(pageUrl) {
            try {
                const key = `${initialValuesKeyPrefix}${encodeURIComponent(pageUrl)}`;
                const result = await getFromDB('inputs', key);
                return result ? result.values : {};
            } catch (error) {
                console.error("Failed to get initial values:", error);
                return {};
            }
        },
        async getSavedHeaderText() {
            try {
                const result = await getFromDB('savedText', 'headerText');
                return result ? result.text : '';
            } catch (error) {
                console.error("Failed to get saved header text:", error);
                return '';
            }
        },
        async saveInputAndHeader(value, extractedText) {
            const pageUrl = window.location.href;
            const key = `${storageKeyPrefix}${encodeURIComponent(pageUrl)}`;
            let inputQueue = await getFromDB('inputs', key) || { values: [] };

            inputQueue.values.push({ header: extractedText, input: value });
            if (inputQueue.values.length > 10) inputQueue.values.shift();

            try {
                await saveToDB('inputs', { id: key, values: inputQueue.values });

                const savedHeaderText = await this.getSavedHeaderText();
                const newHeaderText = savedHeaderText ? `${savedHeaderText}, ${extractedText}` : extractedText;
                await saveToDB('savedText', { id: 'headerText', text: newHeaderText });
            } catch (error) {
                console.error("Failed to save input and header:", error);
            }
        },
        async clearInitialValues(pageUrl) {
        try {
            const key = `${initialValuesKeyPrefix}${encodeURIComponent(pageUrl)}`;
            const transaction = db.transaction('inputs', 'readwrite');
            const store = transaction.objectStore('inputs');
            const request = store.delete(key);

            await new Promise((resolve, reject) => {
                request.onsuccess = resolve;
                request.onerror = reject;
            });

            console.log("Initial values cleared from IndexedDB for page:", pageUrl);
        } catch (error) {
            console.error("Failed to clear initial values:", error);
        }
    },

        getStorageKey(pageUrl, prefix) {
            return `${prefix}${encodeURIComponent(pageUrl)}`;
        },
    };

    /** ======= 通知管理 ======= **/
    const NotificationManager = {
        async showNotificationIfNeeded() {
            try {
                const savedHeaderText = await StorageManager.getSavedHeaderText();
                if (savedHeaderText && typeof savedHeaderText === 'string') {
                    const uniqueHeaders = [...new Set(savedHeaderText.split(', ').filter(header => header))];
                    const headersText = uniqueHeaders.map(header => `<span style="font-family: Verdana; font-size: 10pt; color: #000000;">${header}</span>`).join('<br>');

                    const message = `
                ${headersText}<br>
                <span style="font-family: Verdana;">項目名にカラーとサイズ以外が入力されました</span>
            `;
                    this.showCustomNotification(message);
                }
            } catch (error) {
                console.error("Error displaying notification:", error);
            }
        },

        showCustomNotification(message) {
            let existingNotification = document.getElementById('custom-notification');
            if (existingNotification) existingNotification.remove();

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
            closeButton.addEventListener('click', async () => {
                notification.remove();
                await clearNotificationData();
            });

            notification.innerHTML = `
            <p style="margin: 0; font-family: Verdana;">${message}</p>
            <a href="${sheetUrl}" target="_blank" style="color: #1e88e5;">「カラーとサイズ以外にした場合」</a>を新しく開く
        `;
            notification.appendChild(closeButton);
            document.body.appendChild(notification);
        }
    };


    async function clearNotificationData() {
        const transaction = db.transaction(['inputs', 'savedText'], 'readwrite');
        try {
            const inputsStore = transaction.objectStore('inputs');
            const savedTextStore = transaction.objectStore('savedText');
            await Promise.all([
                inputsStore.clear(),
                savedTextStore.clear()
            ]);
            console.log("Notification data cleared from IndexedDB");
        } catch (error) {
            console.error("Failed to clear notification data:", error);
        }
    }

    /** ======= イベント管理 ======= **/
const EventManager = {
    async handleButtonClick(isSaveAndSkuStock) {
        const pageUrl = window.location.href;
        const initialValues = await StorageManager.getInitialValues(pageUrl);

        let changedFields = [];
        targets.forEach(targetId => {
            const inputElement = document.getElementById(targetId);
            if (inputElement) {
                const value = inputElement.value.trim();
                const initialValue = initialValues[targetId] || '';

                if (isSaveAndSkuStock || value !== initialValue) {
                    changedFields.push(targetId);
                }
            }
        });

        if (changedFields.length === 0) {
            console.log("No changes detected. Skipping processing.");
            return;
        }

        await this.checkInput(changedFields, isSaveAndSkuStock);

        await StorageManager.clearInitialValues(pageUrl);
    },

    async checkInput(changedFields, isSaveAndSkuStock) {
        let foundInput = false;
        for (const id of changedFields) {
            const inputField = document.getElementById(id);
            if (inputField) {
                const value = inputField.value.trim();
                if (value !== 'カラー' && value !== 'サイズ' && value !== '-' && value !== '--' && value.trim() !== '') {
                    const headerText = document.querySelector('h2').textContent;
                    const match = headerText.match(/\[(.*?)\]/);
                    const extractedText = match ? match[1] : 'ID無し';
                    await StorageManager.saveInputAndHeader(value, extractedText);
                    foundInput = true;
                }
            }
        }

        if (foundInput) {
            await NotificationManager.showNotificationIfNeeded();
        }
    }
};


    /** ======= メイン処理 ======= **/
    const App = {
        async initializeInitialValues() {
            const pageUrl = window.location.href;
            let initialValues = await StorageManager.getInitialValues(pageUrl);

            targets.forEach(targetId => {
                const inputElement = document.getElementById(targetId);
                if (inputElement) initialValues[targetId] = inputElement.value.trim();
            });

            const storageKey = StorageManager.getStorageKey(pageUrl, initialValuesKeyPrefix);
            await saveToDB('inputs', { id: storageKey, values: initialValues });
        },

        async init() {
            await openDB();
            await this.initializeInitialValues();

            const buttons = [
                { id: 'registeredSaveButton', isSaveAndSkuStock: false },
                { id: 'registeredSaveAndSkuStock', isSaveAndSkuStock: false },
                { id: 'saveAndSkuStock', isSaveAndSkuStock: true }
            ];

            buttons.forEach(button => {
                const element = document.getElementById(button.id);
                if (element) {
                    element.addEventListener('click', () => EventManager.handleButtonClick(button.isSaveAndSkuStock));
                }
            });
            NotificationManager.showNotificationIfNeeded();
        }
    };

    window.addEventListener('DOMContentLoaded', async () => {
        await openDB();
        App.init();
    });
})();
