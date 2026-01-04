// ==UserScript==
// @license MIT 
// @name         Auto Login 2
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Автологін для MHE
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528106/Auto%20Login%202.user.js
// @updateURL https://update.greasyfork.org/scripts/528106/Auto%20Login%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const USERNAME = 'login';      // 🔑 Ваш логін
    const PASSWORD = 'password';   // 🔒 Ваш пароль

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Очікування елемента з таймаутом
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
                reject(new Error(`⏳ Елемент не знайдено: ${selector}`));
            }, timeout);
        });
    }

    // Пошук кнопки за текстом
    function findButtonByText(text) {
        return Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.trim().toLowerCase() === text.toLowerCase()
        );
    }

    // Функція введення тексту, що імітує реальне введення
async function typeIntoField(field, text) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    // Очищаємо поле перед введенням
    field.focus();
    field.select();
    nativeInputValueSetter.call(field, ''); 
    field.dispatchEvent(new Event('input', { bubbles: true }));

    // Введення тексту посимвольно (імітація реального введення)
    for (const char of text) {
        nativeInputValueSetter.call(field, field.value + char); // Задаємо символ
        field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: char }));
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: char }));
        await delay(50); // Затримка між введенням символів
    }

    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.blur(); // Втрата фокусу, щоб тригернути валідацію (як при ручному введенні)
    await delay(100); // Додаткова затримка
}
  

    // Перевірка, чи користувач залогований
    function isLoggedIn() {
        const logoutButton = document.querySelector('.btn-danger'); // 🔒 Змінити селектор, якщо інший елемент свідчить про логін
        return logoutButton && logoutButton.textContent.trim().length > 0;
    }

    // Обробка кнопок "True Domain..." або "False Domain..."
    async function handleDomainButton() {
        const domainButton = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.startsWith('True') || btn.textContent.startsWith('False')
        );

        if (domainButton && domainButton.textContent.startsWith('True')) {
            domainButton.click(); // 🔄 Перемикаємо на False
            await delay(500);     // ⏳ Чекаємо після кліку
        }
    }

// Імітація натискання Enter, яку сприйме React
async function pressEnter(field) {
    field.focus(); // Фокус на полі
    await delay(50); // Затримка для природності

    const eventOptions = {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13
    };

    // Послідовність подій як при реальному натисканні Enter
    field.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
    field.dispatchEvent(new KeyboardEvent('keypress', eventOptions));
    await delay(20); // Коротка пауза
    field.dispatchEvent(new KeyboardEvent('keyup', eventOptions));

    await delay(100); // Затримка після Enter

    // Додатковий тригер форми, якщо вона існує
    const form = field.closest('form');
    if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await delay(100); // Чекаємо на можливу обробку submit
    }
}

    // Заповнення форми логіну
async function fillLoginForm() {
    const usernameInput = await waitForElement('input[placeholder="Username"]');
    await typeIntoField(usernameInput, USERNAME); // Введення логіну

    await delay(300); // Затримка між полями

    const passwordInput = await waitForElement('input[placeholder="Password"]');
    await typeIntoField(passwordInput, PASSWORD); // Введення пароля

    console.log('🔑 Пароль введено. Спроба натиснути Enter...');
    await pressEnter(passwordInput); // Імітація натискання Enter

    await delay(500); // Чекаємо реакції форми

    // Якщо Enter не спрацював - резервний варіант: клік по кнопці Login
    try {
        const loginButton = findButtonByText('Login');
        if (loginButton && !loginButton.disabled) {
            loginButton.click();
            console.log('✅ Клік по кнопці "Login" успішний (резервний варіант)');
        } else {
            console.warn('⚠️ Кнопка "Login" залишилась неактивною.');
        }
    } catch (err) {
        console.warn(`⚠️ Помилка при натисканні кнопки: ${err.message}`);
    }
}
    // Основний цикл автологіну
    async function autoLoginLoop() {
        while (true) {
            await delay(5000); // ⏳ Затримка перед кожною спробою

            if (isLoggedIn()) {
                continue; // ✅ Якщо залогований - пропускаємо
            }

            try {
                const loginTriggerButton = await waitForElement('.btn-danger'); // Кнопка для виклику форми логіну
                loginTriggerButton.click();
                await delay(500); // Чекаємо відкриття форми

                await handleDomainButton(); // 🔄 Перемикаємо True -> False, якщо потрібно
                await fillLoginForm();      // 📝 Заповнюємо форму логіну
            } catch (error) {
                console.error('❌ Помилка у циклі логіну:', error);
            }
        }
    }

    // 🚀 Запуск циклу
    autoLoginLoop();

})();