// ==UserScript==
// @name         VK Message Automation (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Автоматизация отправки сообщений в VK с модальным окном и выбором сообщений
// @author       V.Sokol
// @match        https://vk.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/517932/VK%20Message%20Automation%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517932/VK%20Message%20Automation%20%28Enhanced%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция создания кнопки "Ебень"
    const createButton = () => {
        const customButton = document.createElement("button");
        customButton.textContent = "Ебень";
        customButton.style.position = "fixed";
        customButton.style.top = "50%";
        customButton.style.right = "20px";
        customButton.style.transform = "translateY(-50%)"; // Center vertically
        customButton.style.zIndex = "1000";
        customButton.style.padding = "20px 40px";
        customButton.style.background = "linear-gradient(45deg, #6e7fef, #4d63e0)";
        customButton.style.color = "#fff";
        customButton.style.border = "none";
        customButton.style.borderRadius = "12px";
        customButton.style.cursor = "pointer";
        customButton.style.fontSize = "36px"; // Enlarged text
        customButton.style.transition = "transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease";
        customButton.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";

        // Добавление эффекта при наведении
        customButton.addEventListener("mouseenter", () => {
            customButton.style.transform = "scale(1.1)";
            customButton.style.background = "linear-gradient(45deg, #5c6ef8, #4b53db)";
            customButton.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.4)";
        });

        customButton.addEventListener("mouseleave", () => {
            customButton.style.transform = "scale(1)";
            customButton.style.background = "linear-gradient(45deg, #6e7fef, #4d63e0)";
            customButton.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
        });

        // Добавляем кнопку в тело документа
        document.body.appendChild(customButton);

        // Обработчик клика по кнопке
        customButton.addEventListener("click", openModal);
    };

    // Открытие модального окна с выбором сообщений
    const openModal = () => {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        modal.style.zIndex = '1001';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';

        // Создаем контейнер для контента модального окна
        const modalContent = document.createElement('div');
        modalContent.style.background = "linear-gradient(45deg, #3f3f3f, #222222)";
        modalContent.style.padding = '50px';
        modalContent.style.borderRadius = '12px';
        modalContent.style.maxWidth = '800px';
        modalContent.style.maxHeight = '80%';
        modalContent.style.overflowY = 'auto';
        modalContent.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.4)';
        modalContent.style.color = "#fff";

        // Заголовок модального окна
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Выберите сообщение:';
        modalTitle.style.fontSize = '80px'; // Enlarged text
        modalTitle.style.marginBottom = '40px';
        modalContent.appendChild(modalTitle);

        // Создаем кнопки с готовыми сообщениями
        const messages = [
            "Привет, как дела?",
            "Что вас беспокоит?",
            "Как я могу помочь?",
            "Здравствуйте, чем могу помочь?",
            "Приятного дня!",
            "До свидания, всего хорошего!",
            "Как ваш день прошел?",
            "Что вас интересует?",
            "Как вам наша служба поддержки?",
            "Спасибо за обратную связь!",
            "Приятно познакомиться!",
            "Надеюсь, я смог вам помочь.",
            "Как можем улучшить наш сервис?",
            "Спасибо за ваше время!",
            "Как мы можем быть полезными?",
            "Рады видеть вас снова!",
            "Обращайтесь, если возникнут вопросы.",
            "С радостью помогу вам!",
            "Наши лучшие предложения для вас!",
            "Пожалуйста, уточните ваш запрос.",
            "Как вам наш сервис?",
            "Есть какие-либо предложения?",
            "Как можно улучшить взаимодействие?",
            "С чем могу помочь прямо сейчас?"
        ];

        messages.forEach(message => {
            const button = document.createElement('button');
            button.textContent = message;
            button.style.display = 'block';
            button.style.width = '100%';
            button.style.padding = '18px';
            button.style.marginBottom = '20px';
            button.style.backgroundColor = '#4a4a4a';
            button.style.border = '1px solid #333';
            button.style.borderRadius = '8px';
            button.style.cursor = 'pointer';
            button.style.transition = 'background-color 0.3s, transform 0.3s ease-in-out';

            // Изменение цвета при наведении
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#626262';
                button.style.transform = 'scale(1.05)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#4a4a4a';
                button.style.transform = 'scale(1)';
            });

            // Обработчик клика по кнопке
            button.addEventListener('click', () => {
                simulateTypingAndSend(message);
                document.body.removeChild(modal); // Закрытие модального окна
            });

            modalContent.appendChild(button);
        });

        // Создаем кнопку для закрытия модального окна
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Закрыть';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '20px';
        closeButton.style.right = '20px';
        closeButton.style.padding = '14px 28px';
        closeButton.style.backgroundColor = '#ff5722';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '8px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal); // Закрытие модального окна
        });

        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    };

    // Функция для эмуляции ввода текста и отправки
    const simulateTypingAndSend = (text) => {
        const inputField = document.querySelector('span[contenteditable="true"].ComposerInput__input');
        if (inputField) {
            inputField.click();
            setTimeout(() => {
                inputField.focus();
                simulateTyping(inputField, text);
                setTimeout(() => {
                    const sendButton = document.querySelector('.ConvoComposer__button.ConvoComposer__sendButton--submit');
                    if (sendButton) sendButton.click();
                }, 800);
            }, 500);
        }
    };

    // Эмуляция ввода текста
    const simulateTyping = (element, text) => {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const keyDownEvent = new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: char,
                code: `Key${char.toUpperCase()}`,
            });
            const keyPressEvent = new KeyboardEvent("keypress", {
                bubbles: true,
                cancelable: true,
                key: char,
                code: `Key${char.toUpperCase()}`,
            });
            const keyUpEvent = new KeyboardEvent("keyup", {
                bubbles: true,
                cancelable: true,
                key: char,
                code: `Key${char.toUpperCase()}`,
            });

            element.dispatchEvent(keyDownEvent);
            element.dispatchEvent(keyPressEvent);
            element.textContent += char;
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(keyUpEvent);
        }
    };

    // Инициализация
    createButton();
})();
