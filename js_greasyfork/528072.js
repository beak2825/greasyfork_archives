// ==UserScript==
// @license MIT 
// @name         Auto Login MHE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автологін для MHE
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528072/Auto%20Login%20MHE.user.js
// @updateURL https://update.greasyfork.org/scripts/528072/Auto%20Login%20MHE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const USERNAME = 'login';      // 🔑
    const PASSWORD = 'password';   // 🔒

    // Затримка у мілісекундах
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Очікування на елемент з таймаутом
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    observer.disconnect();
                    resolve(found);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(` Елемент не знайдено: ${selector}`));
            }, timeout);
        });
    }

    // Введення тексту в поле інпуту
    async function typeIntoField(field, text) {
        field.value = text;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(300);
    }

    // Перевірка чи користувач залогований (кнопка .btn-danger містить текст)
    function isLoggedIn() {
        const loginButton = document.querySelector('.btn-danger');
        return loginButton && loginButton.textContent.trim().length > 0;
    }

    // Обробка кнопки "True Domain..." або "False Domain..."
    async function handleDomainButton() {
        const domainButton = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.startsWith('True') || btn.textContent.startsWith('False')
        );

        if (domainButton) {
            if (domainButton.textContent.startsWith('True')) {
                domainButton.click(); // Переключаємо на False
                await delay(500);     // Чекаємо після кліку
            }
        }
    }

    // Заповнення форми логіну
    async function fillLoginForm() {
        const usernameInput = await waitForElement('input[placeholder="Username"]');
        await typeIntoField(usernameInput, USERNAME);

        const passwordInput = await waitForElement('input[placeholder="Password"]');
        await typeIntoField(passwordInput, PASSWORD);

        const submitButton = await waitForElement('.btn-sm');
        submitButton.click();
    }

    // Основний цикл автологіну
    async function autoLoginLoop() {
        while (true) {
            await delay(5000); //  Затримка перед кожною спробою

            if (isLoggedIn()) {
                continue; // Користувач залогований — наступний цикл
            }

            try {
                const loginButton = await waitForElement('.btn-danger');
                loginButton.click();
                await delay(500); // Чекаємо відкриття форми

                await handleDomainButton(); // Обробка кнопки True/False Domain
                await fillLoginForm();      // Заповнюємо логін і пароль
            } catch (error) {
                // Пропускаємо помилки та продовжуємо цикл
            }
        }
    }

    // Запуск циклу
    autoLoginLoop();
})();
