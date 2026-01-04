// ==UserScript==
// @name         Open Chat on the Same Page with Custom Icon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open chat on the same page with a custom icon
// @author       You
// @grant        none
// @match        https://lzt.market/*
// @downloadURL https://update.greasyfork.org/scripts/487189/Open%20Chat%20on%20the%20Same%20Page%20with%20Custom%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/487189/Open%20Chat%20on%20the%20Same%20Page%20with%20Custom%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Общий стиль для кнопок
    var buttonStyle = {
        position: 'fixed',
        bottom: '85px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        textAlign: 'center',
        cursor: 'pointer',
        zIndex: '9999',
        transition: 'opacity 0.1s ease-in-out',
    };

    // Стили кастомного значка
    var customIconStyle = Object.assign({}, buttonStyle, {
        right: '15px',
        backgroundColor: '#8E8FFA', // Цвет круга
    });

    // Создание кастомного значка
    var customIcon = createButton('chat2-button chat2-button-open lztng-1a57w7i custom-icon', 'Открыть чат', customIconStyle);

    // Удаление элемента .mobileMenuButton
    var mobileMenuButton = document.querySelector('.mobileMenuButton');
    if (mobileMenuButton) {
        mobileMenuButton.remove();
    }

    // Добавление кастомного значка в body
    document.body.appendChild(customIcon);

    // Создание iframe для загрузки чата
    var chatIframe = createIframe('https://lzt.market/conversations/', '885px', '570px');

    // Добавление iframe в body
    document.body.appendChild(chatIframe);

    // Стили крестика
    var closeButtonStyle = Object.assign({}, buttonStyle, {
        display: 'none',
        opacity: '0',
        backgroundColor: '#FF6969', // Цвет креста
    });

    // Создание крестика
    var closeButton = createButton('chat2-button chat2-button-close lztng-1a57w7i close-icon', 'Закрыть чат', closeButtonStyle);

    // Добавление крестика в body
    document.body.appendChild(closeButton);

    // Обработка клика на кастомном значке
    customIcon.addEventListener('click', function() {
        // Отображение/скрытие iframe чата
        toggleChat();
    });

    // Обработка клика на крестике
    closeButton.addEventListener('click', function() {
        // Закрытие чата и отображение кастомного значка
        closeChat();
    });

    // Функция для создания кнопок
    function createButton(className, title, style) {
        var button = document.createElement('div');
        button.className = className;
        button.title = title;
        Object.assign(button.style, style);
        return button;
    }

    // Функция для создания iframe
    function createIframe(src, width, height) {
        var iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.style.position = 'fixed';
        iframe.style.bottom = '0';
        iframe.style.right = '0';
        iframe.style.width = width;
        iframe.style.height = height;
        iframe.style.border = 'none';
        iframe.style.display = 'none';
        iframe.style.zIndex = '9998';
        return iframe;
    }

    // Функция для отображения/скрытия iframe чата
    function toggleChat() {
        chatIframe.style.display = (chatIframe.style.display === 'none') ? 'block' : 'none';
        customIcon.style.opacity = '0';
        setTimeout(function() {
            customIcon.style.display = 'none';
            closeButton.style.display = 'block';
            closeButton.style.opacity = '1';
        }, 100);
    }

    // Функция для закрытия чата и отображения кастомного значка
    function closeChat() {
        closeButton.style.opacity = '0';
        setTimeout(function() {
            closeButton.style.display = 'none';
            customIcon.style.display = 'block';
            customIcon.style.opacity = '1';
        }, 500);
        chatIframe.style.display = 'none';
    }

    // Добавление функции в глобальную область видимости (чтобы можно было вызвать из iframe)
    window.closeChat = closeChat;

})();
