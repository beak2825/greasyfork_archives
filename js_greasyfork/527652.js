// ==UserScript==
// @name         Naurok Auto Copy & Notify (Enhanced Version)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Оптимизированное автокопирование вопросов и ответов с изображениями
// @author       ENDERVANO
// @license MIT
// @match        *://naurok.com.ua/test/testing/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/527652/Naurok%20Auto%20Copy%20%20Notify%20%28Enhanced%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527652/Naurok%20Auto%20Copy%20%20Notify%20%28Enhanced%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentQuestionId = null;
    let darkMode = false;

    function getCurrentQuestionId() {
        const questionElem = document.querySelector('.test-content-text-inner');
        if (!questionElem) return null;
        const imageUrl = document.querySelector('.test-content-image img')?.src || '';
        return questionElem.innerText.trim() + imageUrl;
    }

    function formatQuestion() {
        let questionElem = document.querySelector('.test-content-text-inner');
        let question = questionElem ? questionElem.innerText.trim() : "Вопрос не найден";

        // Улучшенная проверка наличия изображения
        let imageElem = document.querySelector('.test-content-image img');
        let imageText = "";
        if (imageElem && imageElem.src && !imageElem.src.endsWith('/')) {
            imageText = `\n[Изображение вопроса: ${imageElem.src}]`;
        }

        let answerElems = document.querySelectorAll('.question-option-inner');
        let answers = [];
        let correctAnswers = [];

        answerElems.forEach((el, index) => {
            let textElem = el.querySelector('.question-option-inner-content');
            let imageElem = el.querySelector('.question-option-image');

            let text = textElem ? textElem.innerText.trim() : "";

            // Улучшенная проверка наличия изображения в ответе
            let answerImage = "";
            if (imageElem && imageElem.style.backgroundImage &&
                imageElem.style.backgroundImage !== 'none' &&
                !imageElem.style.backgroundImage.includes('url("")')) {
                answerImage = ` [Изображение ответа: ${imageElem.style.backgroundImage.replace(/url\(["']?(.*?)["']?\)/, '$1')}]`;
            }

            let answerText = `${index + 1}) ${text}${answerImage}`;
            if (text.trim()) {
                answers.push(answerText);
                if (el.classList.contains('correct')) {
                    correctAnswers.push(answerText);
                }
            }
        });

        return {
            question: question,
            imageText: imageText,
            answers: answers,
            correctAnswers: correctAnswers
        };
    }

    function addCopyButton() {
        const newQuestionId = getCurrentQuestionId();
        if (!newQuestionId) return;

        if (newQuestionId === currentQuestionId && document.querySelector("#copyQuestionButton")) return;

        currentQuestionId = newQuestionId;

        let questionContainer = document.querySelector('.test-content-text') ||
                              document.querySelector('.test-content') ||
                              document.querySelector('.question-container');

        if (!questionContainer) return;

        let oldButton = document.querySelector("#copyQuestionButton");
        if (oldButton) oldButton.remove();

        let oldControls = document.querySelector("#questionControls");
        if (oldControls) oldControls.remove();

        const formattedContent = formatQuestion();
        if (!formattedContent.question || formattedContent.answers.length === 0) return;

        let copyText = `❓ Вопрос: ${formattedContent.question}${formattedContent.imageText}\n\n` +
                      `🔹 Варианты ответов:\n${formattedContent.answers.join("\n")}`;

        if (formattedContent.correctAnswers.length > 0) {
            copyText += `\n\n✅ Правильные ответы:\n${formattedContent.correctAnswers.join("\n")}`;
        }

        // Create controls container
        let controls = document.createElement("div");
        controls.id = "questionControls";
        controls.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 15px;
            width: 100%;
        `;

        // Create copy button
        let copyButton = document.createElement("button");
        copyButton.id = "copyQuestionButton";
        copyButton.innerHTML = "📋 Скопировать вопрос";
        copyButton.style.cssText = `
            flex: 1;
            padding: 12px 20px;
            background: ${darkMode ? '#2c3e50' : '#007BFF'};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            transition: all 0.3s ease-in-out;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        `;

        // Create theme toggle button
        let themeButton = document.createElement("button");
        themeButton.innerHTML = darkMode ? "☀️" : "🌙";
        themeButton.style.cssText = `
            padding: 12px 20px;
            background: ${darkMode ? '#2c3e50' : '#007BFF'};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease-in-out;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        `;

        copyButton.onmouseover = () => copyButton.style.background = darkMode ? '#34495e' : '#0056b3';
        copyButton.onmouseout = () => copyButton.style.background = darkMode ? '#2c3e50' : '#007BFF';

        copyButton.onclick = function () {
            GM_setClipboard(copyText, "text");
            showNotification("Скопировано!", formattedContent.imageText ? document.querySelector('.test-content-image img')?.src : null);
        };

        themeButton.onclick = function () {
            darkMode = !darkMode;
            themeButton.innerHTML = darkMode ? "☀️" : "🌙";
            copyButton.style.background = darkMode ? '#2c3e50' : '#007BFF';
            themeButton.style.background = darkMode ? '#2c3e50' : '#007BFF';
        };

        controls.appendChild(copyButton);
        controls.appendChild(themeButton);
        questionContainer.appendChild(controls);
    }

    function showNotification(message, imageUrl) {
        let existingNotification = document.querySelector("#copyNotification");
        if (existingNotification) existingNotification.remove();

        let notification = document.createElement("div");
        notification.id = "copyNotification";
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${darkMode ? '#2c3e50' : 'white'};
            color: ${darkMode ? 'white' : 'black'};
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
            z-index: 9999;
            opacity: 0;
            transform: translateX(50px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;

        let icon = document.createElement("img");
        icon.src = "https://cdn-icons-png.flaticon.com/512/190/190411.png";
        icon.style.cssText = "width: 30px; height: 30px; margin-right: 10px;";

        let text = document.createElement("span");
        text.innerText = message;

        notification.appendChild(icon);
        notification.appendChild(text);

        if (imageUrl && !imageUrl.endsWith('/')) {
            let image = document.createElement("img");
            image.src = imageUrl;
            image.style.cssText = "width: 40px; height: 40px; margin-left: 10px; border-radius: 5px;";
            notification.appendChild(image);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateX(0)";
        }, 50);

        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateX(50px)";
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList' ||
                    (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
                    addCopyButton();
                    break;
                }
            }
        });

        const container = document.querySelector('.question-container') || document.body;
        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    function init() {
        addCopyButton();
        observeChanges();
        setTimeout(addCopyButton, 1000);
        setTimeout(addCopyButton, 2000);
        setTimeout(addCopyButton, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();