// ==UserScript==
// @name         Скрипт для руководства адм.
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Скрипт для автоматического ответа на жалобы на форуме Widerussia
// @author       ecl1pse
// @license      MIT
// @match        https://widerussia.hgweb.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546832/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%B0%D0%B4%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/546832/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%B0%D0%B4%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Функция для получения имени автора темы
    function getAuthorName() {
        const authorLinks = [
            document.querySelector('.username--style1'),
            document.querySelector('.username'),
            document.querySelector('.message-name a'),
            document.querySelector('.message-userDetails a'),
            document.querySelector('.p-title-value')
        ].filter(Boolean);
        
        return authorLinks.length > 0 ? authorLinks[0].textContent : 'автор';
    }
    
    // Функция для добавления кнопок
    function addResponseButtons() {
        // Проверяем, находимся ли мы на странице темы
        if (!window.location.href.includes('threads/')) {
            return;
        }
        
        // Проверяем, не добавлены ли уже наши кнопки
        if (document.getElementById('widerussiaAutoResponse')) {
            return;
        }
        
        // Ищем форму быстрого ответа
        const replyForm = document.querySelector('form.js-quickReply');
        if (!replyForm) {
            return;
        }
        
        // Ищем контейнер для кнопок (на основе скриншота)
        let buttonContainer = replyForm.querySelector('.block-row');
        
        // Если нет контейнера, создаем его
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'block-row';
            buttonContainer.style.margin = '8px 0';
            buttonContainer.style.padding = '8px';
            buttonContainer.style.backgroundColor = 'green';
            buttonContainer.style.borderRadius = '4px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '6px';
            buttonContainer.style.flexWrap = 'wrap';
            
            // Вставляем перед полем ввода сообщения
            const messageField = replyForm.querySelector('textarea');
            if (messageField) {
                messageField.parentNode.insertBefore(buttonContainer, messageField);
            } else {
                replyForm.insertBefore(buttonContainer, replyForm.firstChild);
            }
        }
        
        // Массив с данными кнопок
        const buttonsData = [
            {
                id: 'widerussiaAutoResponse',
                text: 'На рассмотрении',
                responseText: `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый(-ая) [/COLOR]{authorName}

Ваша жалоба на администратора [COLOR=rgb(251, 160, 38)]взята на рассмотрение[/COLOR].
[U][SIZE=4]Просьба не создавать дубликаты данной темы, чтобы не получить блокировку форумного аккаунта.[/SIZE][/U]

[COLOR=rgb(255, 0, 0)]Ожидайте ответа[/COLOR].[/FONT][/CENTER]`
            },
            {
                id: 'widerussiaAutoResponseGA',
                text: 'жб га',
                responseText: `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый[/COLOR] {authorName}.

Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Главному администратору[/COLOR] для дальнейшего [COLOR=rgb(251, 160, 38)]рассмотрения[/COLOR].

[COLOR=rgb(255, 0, 0)]Ожидайте ответа[/COLOR].[/FONT][/CENTER]`
            },
            {
                id: 'widerussiaAutoResponseRejectForm',
                text: 'Жб отказ (не по форме)',
                responseText: `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый[/COLOR] {authorName}.

Ваша жалоба получает статус «[COLOR=#ff0000]Отказано[/COLOR]»
[COLOR=#ffff00]Жалоба написана не по форме, пожалуйста, ознакомьтесь с закреплённой темой в данном разделе[/COLOR]

[COLOR=#ff0000]Закрыто[/COLOR].[/FONT][/CENTER]`
            },
            {
                id: 'widerussiaAutoResponseRejectNoViolation',
                text: 'жб отказ (нарушений нет)',
                responseText: `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый[/COLOR] {authorName}.

Ваша жалоба получает статус «[COLOR=rgb(255, 0, 0)]Отказано[/COLOR]»
[COLOR=#ffff00]Со стороны администратора нарушения отсутствуют.[/COLOR]

[COLOR=#ff0000]Закрыто[/COLOR].[/FONT][/CENTER]`
            },
            {
                id: 'widerussiaAutoResponseApproved',
                text: 'жб одобрено (без снятия наказан.)',
                responseText: `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый[/COLOR] {authorName}.

Ваша жалоба получает статус «[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR]»
[COLOR=rgb(255, 255, 0)]К администратору будут приняты необходимые меры[/COLOR].

[COLOR=#ff0000]Закрыто[/COLOR].[/FONT][/CENTER]`
            },
            {
                id: 'widerussiaAutoResponseSpecial',
                text: 'жб спецам',
                responseText: `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]Здравствуйте, уважаемый[/COLOR] {authorName}.

Ваша жалоба передана [COLOR=#ff0000]Специальному администратору[/COLOR] для дальнейшего [COLOR=rgb(251, 160, 38)]рассмотрения[/COLOR].

[COLOR=rgb(255, 0, 0)]Ожидайте ответа[/COLOR].[/FONT][/CENTER]`
            }
        ];
        
        // Создаем кнопки
        buttonsData.forEach(buttonData => {
            const button = document.createElement('button');
            button.id = buttonData.id;
            button.textContent = buttonData.text;
            button.style.cssText = `
                background: black;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-weight: bold;
                font-size: 11px;
                min-width: 110px;
                margin: 2px;
            `;
            
            // Добавляем обработчик события
            button.addEventListener('click', function() {
                const authorName = getAuthorName();
                const responseText = buttonData.responseText.replace(/{authorName}/g, authorName);
                insertResponseText(responseText, replyForm);
            });
            
            // Добавляем кнопку в контейнер
            buttonContainer.appendChild(button);
        });
    }
    
    // Функция для вставки текста ответа
    function insertResponseText(responseText, replyForm) {
        // Ищем текстовое поле для ответа
        const messageField = replyForm.querySelector('textarea[name="message"]');
        if (messageField) {
            // Устанавливаем значение и активируем события
            messageField.value = responseText;
            
            // Создаем события для активации поля
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            
            messageField.dispatchEvent(inputEvent);
            messageField.dispatchEvent(changeEvent);
            
            // Фокусируемся на поле
            messageField.focus();
        } else {
            // Пробуем найти редактор с contenteditable
            const editableDiv = replyForm.querySelector('[contenteditable="true"]');
            if (editableDiv) {
                editableDiv.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, responseText);
            }
        }
    }
    
    // Функция для проверки и добавления кнопок
    function init() {
        // Проверяем, находимся ли мы на нужной странице
        if (!window.location.href.includes('threads/')) {
            return;
        }
        
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                // Даем время на загрузку всех элементов
                setTimeout(addResponseButtons, 1000);
            });
        } else {
            setTimeout(addResponseButtons, 1000);
        }
    }
    
    // Запускаем инициализацию
    init();
    
    // Также добавляем кнопки при изменении контента
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // Проверяем, была ли добавлена форма ответа
                const addedForms = Array.from(mutation.addedNodes).filter(node => 
                    node.nodeType === 1 && node.querySelector && node.querySelector('form.js-quickReply')
                );
                
                if (addedForms.length > 0) {
                    setTimeout(addResponseButtons, 500);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();