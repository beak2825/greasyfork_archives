// ==UserScript==
// @name         FunPay: Подсветка сообщений в чате / FunPay: Highlighting messages in chat
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  Подсвечивает сообщения от администраторов, подтверждения заказов от покупателей и отзывы покупателей в чате FunPay / Highlights messages from admins, buyers confirming orders, and buyer reviews in the FunPay chat.
// @author       z1zod, BALCETUL
// @match        https://funpay.com/chat/*
// @match        https://funpay.com/en/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=funpay.com
// @grant        none
// @license      MIT
// @locale       en, ru
// @downloadURL https://update.greasyfork.org/scripts/509974/FunPay%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5%20%20FunPay%3A%20Highlighting%20messages%20in%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/509974/FunPay%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%B2%20%D1%87%D0%B0%D1%82%D0%B5%20%20FunPay%3A%20Highlighting%20messages%20in%20chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultAdminColor = 'rgba(0, 0, 0, 0)';
    const defaultBuyerColor = 'rgba(0, 0, 0, 0)';
    const defaultReviewColor = 'rgba(0, 0, 0, 0)';

    let adminHighlightColor = localStorage.getItem('adminMessageColor') || 'rgb(80, 30, 29)';
    let buyerHighlightColor = localStorage.getItem('buyerMessageColor') || 'rgb(0, 0, 255)';
    let reviewHighlightColor = localStorage.getItem('reviewMessageColor') || 'rgb(0, 128, 0)';

    let adminColorReset = adminHighlightColor === defaultAdminColor;
    let buyerColorReset = buyerHighlightColor === defaultBuyerColor;
    let reviewColorReset = reviewHighlightColor === defaultReviewColor;

    let currentLanguage = localStorage.getItem('language') || 'ru'; // По умолчанию русский

    function highlightMessages() {
        const messages = document.querySelectorAll('.contact-item');

        messages.forEach(message => {
            const messageText = message.querySelector('.contact-item-message').textContent;

            const isAdminMessage = messageText.includes('Администратор') || messageText.includes('The administrator');
            const isBuyerConfirmed = messageText.includes('Покупатель') && messageText.includes('подтвердил успешное') ||
                                     messageText.includes('The buyer') && messageText.includes('has confirmed that order');
            const isBuyerReview = messageText.includes('Покупатель') && messageText.includes('написал отзыв к заказу') ||
                                  messageText.includes('The buyer') && messageText.includes('has given feedback to the order');

            if (isAdminMessage) {
                message.style.backgroundColor = adminColorReset ? defaultAdminColor : adminHighlightColor;
            } else if (isBuyerConfirmed) {
                message.style.backgroundColor = buyerColorReset ? defaultBuyerColor : buyerHighlightColor;
            } else if (isBuyerReview) {
                message.style.backgroundColor = reviewColorReset ? defaultReviewColor : reviewHighlightColor;
            } else {
                message.style.backgroundColor = defaultBuyerColor;
            }
        });
    }

    function createSettingsMenu() {
        if (document.getElementById('settingsMenu')) return;

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'settingsMenu';
        settingsDiv.style.position = 'fixed';
        settingsDiv.style.top = '50%';
        settingsDiv.style.left = '50%';
        settingsDiv.style.transform = 'translate(-50%, -50%)';
        settingsDiv.style.backgroundColor = '#222';
        settingsDiv.style.color = '#fff';
        settingsDiv.style.border = '1px solid #444';
        settingsDiv.style.padding = '20px';
        settingsDiv.style.zIndex = 1000;
        settingsDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        settingsDiv.style.borderRadius = '8px';
        settingsDiv.innerHTML = `
            <h3>${getTranslation('settingsTitle')}</h3>
            <label for="languageSelector">${getTranslation('languageLabel')}</label>
            <select id="languageSelector">
                <option value="ru" ${currentLanguage === 'ru' ? 'selected' : ''}>Русский</option>
                <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
            </select>
            <br><br>
            <label for="adminColorPicker">${getTranslation('adminColorLabel')}</label>
            <input type="color" id="adminColorPicker" value="${rgbToHex(adminHighlightColor)}">
            <br><br>
            <label for="buyerColorPicker">${getTranslation('buyerColorLabel')}</label>
            <input type="color" id="buyerColorPicker" value="${rgbToHex(buyerHighlightColor)}">
            <br><br>
            <label for="reviewColorPicker">${getTranslation('reviewColorLabel')}</label>
            <input type="color" id="reviewColorPicker" value="${rgbToHex(reviewHighlightColor)}">
            <br><br>
            <button id="saveColors">${getTranslation('saveButton')}</button>
            <button id="resetColors">${getTranslation('resetButton')}</button>
            <button id="closeSettings">${getTranslation('closeButton')}</button>
            <div id="notification" style="margin-top: 10px; color: limegreen;"></div>
        `;

        document.body.appendChild(settingsDiv);

        const buttons = settingsDiv.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.backgroundColor = '#444';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.padding = '10px';
            button.style.marginRight = '5px';
            button.style.cursor = 'pointer';

            button.onmouseover = function () {
                button.style.backgroundColor = '#555';
            };
            button.onmouseout = function () {
                button.style.backgroundColor = '#444';
            };
        });

        // События для изменения цвета при выборе
        document.getElementById('adminColorPicker').oninput = function () {
            adminHighlightColor = this.value; // Обновляем значение цвета
            updateMessageHighlights(); // Применяем изменения немедленно
        };

        document.getElementById('buyerColorPicker').oninput = function () {
            buyerHighlightColor = this.value; // Обновляем значение цвета
            updateMessageHighlights(); // Применяем изменения немедленно
        };

        document.getElementById('reviewColorPicker').oninput = function () {
            reviewHighlightColor = this.value; // Обновляем значение цвета
            updateMessageHighlights(); // Применяем изменения немедленно
        };

        document.getElementById('saveColors').onclick = function () {
            localStorage.setItem('adminMessageColor', adminHighlightColor);
            localStorage.setItem('buyerMessageColor', buyerHighlightColor);
            localStorage.setItem('reviewMessageColor', reviewHighlightColor);

            adminColorReset = false;
            buyerColorReset = false;
            reviewColorReset = false;

            highlightMessages();

            document.getElementById('notification').innerText = getTranslation('colorsSaved');
        };

        document.getElementById('resetColors').onclick = function () {
            adminColorReset = true;
            buyerColorReset = true;
            reviewColorReset = true;

            adminHighlightColor = defaultAdminColor;
            buyerHighlightColor = defaultBuyerColor;
            reviewHighlightColor = defaultReviewColor;

            localStorage.setItem('adminMessageColor', adminHighlightColor);
            localStorage.setItem('buyerMessageColor', buyerHighlightColor);
            localStorage.setItem('reviewMessageColor', reviewHighlightColor);

            const messages = document.querySelectorAll('.contact-item');
            messages.forEach(message => {
                const messageText = message.querySelector('.contact-item-message').textContent;
                if (messageText.includes('Администратор') || messageText.includes('The administrator')) {
                    message.style.backgroundColor = defaultAdminColor;
                } else if (messageText.includes('Покупатель') && messageText.includes('подтвердил успешное') ||
                           messageText.includes('The buyer') && messageText.includes('has confirmed that order')) {
                    message.style.backgroundColor = defaultBuyerColor;
                } else if (messageText.includes('Покупатель') && messageText.includes('написал отзыв к заказу') ||
                           messageText.includes('The buyer') && messageText.includes('has given feedback to the order')) {
                    message.style.backgroundColor = defaultReviewColor;
                }
            });

            document.getElementById('notification').innerText = getTranslation('colorsReset');
        };

        document.getElementById('closeSettings').onclick = function () {
            document.body.removeChild(settingsDiv);
        };

        document.getElementById('languageSelector').onchange = function () {
            currentLanguage = this.value;
            localStorage.setItem('language', currentLanguage);
            updateSettingsMenu();
        };
    }

    function updateSettingsMenu() {
        const settingsDiv = document.getElementById('settingsMenu');
        settingsDiv.querySelector('h3').innerText = getTranslation('settingsTitle');
        settingsDiv.querySelector('label[for="languageSelector"]').innerText = getTranslation('languageLabel');
        settingsDiv.querySelector('label[for="adminColorPicker"]').innerText = getTranslation('adminColorLabel');
        settingsDiv.querySelector('label[for="buyerColorPicker"]').innerText = getTranslation('buyerColorLabel');
        settingsDiv.querySelector('label[for="reviewColorPicker"]').innerText = getTranslation('reviewColorLabel');
        settingsDiv.querySelector('#saveColors').innerText = getTranslation('saveButton');
        settingsDiv.querySelector('#resetColors').innerText = getTranslation('resetButton');
        settingsDiv.querySelector('#closeSettings').innerText = getTranslation('closeButton');
        settingsDiv.querySelector('#notification').innerText = '';
        // Обновляем текст кнопки "Настройки"
        settingsButton.innerText = currentLanguage === 'ru' ? 'Настройки' : 'Settings';
    }

    function getTranslation(key) {
        const translations = {
            ru: {
                settingsTitle: 'Настройки',
                languageLabel: 'Выберите язык:',
                adminColorLabel: 'Цвет сообщения от администратора:',
                buyerColorLabel: 'Цвет "Покупатель подтвердил успешное":',
                reviewColorLabel: 'Цвет "Покупатель написал отзыв к заказу":',
                saveButton: 'Сохранить',
                resetButton: 'Сбросить к стандартному',
                closeButton: 'Закрыть',
                colorsSaved: 'Цвета сохранены!',
                colorsReset: 'Цвета сброшены!',
            },
            en: {
                settingsTitle: 'Settings',
                languageLabel: 'Select Language:',
                adminColorLabel: 'Admin Message Color:',
                buyerColorLabel: '"Buyer Confirmed" Color:',
                reviewColorLabel: '"Buyer Review" Color:',
                saveButton: 'Save',
                resetButton: 'Reset to Default',
                closeButton: 'Close',
                colorsSaved: 'Colors saved!',
                colorsReset: 'Colors reset!',
            }
        };
        return translations[currentLanguage][key];
    }

    function rgbToHex(rgb) {
        const rgbArr = rgb.match(/\d+/g);
        return `#${((1 << 24) + (rgbArr[0] << 16) + (rgbArr[1] << 8) + +rgbArr[2]).toString(16).slice(1)}`;
    }

    function updateMessageHighlights() {
        const messages = document.querySelectorAll('.contact-item');

        messages.forEach(message => {
            const isAdminMessage = message.querySelector('.contact-item-message').textContent.includes('Администратор') ||
                                   message.querySelector('.contact-item-message').textContent.includes('The administrator');
            const isBuyerConfirmed = message.querySelector('.contact-item-message').textContent.includes('Покупатель') &&
                                     message.querySelector('.contact-item-message').textContent.includes('подтвердил успешное') ||
                                     message.querySelector('.contact-item-message').textContent.includes('The buyer') &&
                                     message.querySelector('.contact-item-message').textContent.includes('has confirmed that order');
            const isBuyerReview = message.querySelector('.contact-item-message').textContent.includes('Покупатель') &&
                                  message.querySelector('.contact-item-message').textContent.includes('написал отзыв к заказу') ||
                                  message.querySelector('.contact-item-message').textContent.includes('The buyer') &&
                                  message.querySelector('.contact-item-message').textContent.includes('has given feedback to the order');

            if (isAdminMessage) {
                message.style.backgroundColor = adminHighlightColor;
            } else if (isBuyerConfirmed) {
                message.style.backgroundColor = buyerHighlightColor;
            } else if (isBuyerReview) {
                message.style.backgroundColor = reviewHighlightColor;
            } else {
                message.style.backgroundColor = defaultBuyerColor;
            }
        });
    }

    const settingsButton = document.createElement('button');
    settingsButton.innerText = currentLanguage === 'ru' ? 'Настройки' : 'Settings';
    settingsButton.style.position = 'fixed';
    settingsButton.style.top = '10px';
    settingsButton.style.right = '10px';
    settingsButton.style.backgroundColor = '#444';
    settingsButton.style.color = '#fff';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '5px';
    settingsButton.style.padding = '10px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.zIndex = '1000';
    document.body.appendChild(settingsButton);

    settingsButton.onmouseover = function () {
        settingsButton.style.backgroundColor = '#555';
    };
    settingsButton.onmouseout = function () {
        settingsButton.style.backgroundColor = '#444';
    };

    settingsButton.onclick = createSettingsMenu;

    // Начальный запуск функции выделения сообщений
    highlightMessages();

})();
