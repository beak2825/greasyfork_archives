// ==UserScript==
// @license MIT 
// @name         Alternative Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автологін для MHE
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528073/Alternative%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/528073/Alternative%20Auto%20Login.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const USERNAME = 'login';      // 🔑 Ваш логін
    const PASSWORD = 'password';   // 🔒 Ваш пароль
 
    // Функція для чекання елемента з таймаутом
    function waitForElement(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
 
            const observer = new MutationObserver((mutations) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
 
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
 
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Елемент не знайдено протягом ${timeout}ms: ${selector}`));
            }, timeout);
        });
    }
 
    // Функція для затримки виконання
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
 
    // Безпосереднє введення тексту в поле
    async function typeIntoField(field, text) {
        if (!field) {
            return false;
        }
        
        try {
            // Пряма вставка + тригер подій
            field.value = text;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Використання execCommand для натурального введення тексту
            field.focus();
            field.select();
            document.execCommand('insertText', false, text);
            
            await delay(300);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Перевірка та натискання на кнопку True/False Domain User
    async function handleDomainButton() {
        try {
            // Шукаємо кнопку по тексту True або False
            const allButtons = Array.from(document.querySelectorAll('button'));
            const domainButton = allButtons.find(btn => 
                btn.textContent.includes('True Domain') || btn.textContent.includes('False Domain'));
                
            if (!domainButton) {
                return false;
            }
            
            // Перевіряємо стан кнопки
            const isTrueDomain = domainButton.textContent.includes('True Domain');
            
            // Якщо "True Domain", треба переключити на "False Domain"
            if (isTrueDomain) {
                domainButton.click();
                await delay(500);
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Функція заповнення форми логіну
    async function fillLoginForm() {
        try {
            // Чекаємо на появу полів вводу
            const usernameInput = await waitForElement('input[placeholder="Username"]');
            await delay(500);
            
            // Вводимо логін
            await typeIntoField(usernameInput, USERNAME);
            
            // Знаходимо поле паролю і вводимо пароль
            const passwordInput = await waitForElement('input[placeholder="Password"]');
            await typeIntoField(passwordInput, PASSWORD);
            
            // Знаходимо кнопку підтвердження і натискаємо
            const submitButton = await waitForElement('.btn-sm');
            submitButton.click();
            
            return true;
        } catch (error) {
            return false;
        }
    }
 
    // Головна функція автологіну в циклі
    async function runLoginCycle() {
        while (true) {
            try {
                // Чекаємо 5 секунд на початку кожної ітерації
                await delay(5000);
                
                // Перевіряємо, чи є кнопка .btn-danger та чи містить текст
                const loginButton = document.querySelector('.btn-danger');
                
                if (loginButton && loginButton.textContent.trim().length > 0) {
                    // Користувач залогований, починаємо новий цикл
                    continue;
                }
                
                // Користувач не залогований, натискаємо на кнопку логіну
                if (loginButton) {
                    loginButton.click();
                    await delay(1000);
                    
                    // Обробляємо кнопку True/False Domain
                    await handleDomainButton();
                    
                    // Заповнюємо форму логіну
                    await fillLoginForm();
                }
                
                // Чекаємо перед наступною перевіркою
                await delay(3000);
                
            } catch (error) {
                // Якщо виникла помилка, продовжуємо цикл
                await delay(5000);
            }
        }
    }
 
    // Запускаємо цикл автологіну через 5 секунд
    setTimeout(runLoginCycle, 5000);
})();