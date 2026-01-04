// ==UserScript==
// @license MIT 
// @name         Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Автологін для MHE
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527644/Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/527644/Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const USERNAME = 'login';      // 🔑 Ваш логін
    const PASSWORD = 'password';   // 🔒 Ваш пароль
    const DEBUG = true;            // Увімкнути чи вимкнути відлагодження

    // Функція для логування з умовою
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[AutoLogin]', ...args);
        }
    }

    // Функція для чекання елемента з таймаутом
    function waitForElement(selector, timeout = 20000) {
        debugLog(`Чекаємо на елемент: "${selector}"`);
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                debugLog(`Елемент "${selector}" вже присутній`);
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver((mutations) => {
                const element = document.querySelector(selector);
                if (element) {
                    debugLog(`Елемент "${selector}" знайдено`);
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
                debugLog(`Таймаут для елемента "${selector}"`);
                reject(new Error(`Елемент не знайдено протягом ${timeout}ms: ${selector}`));
            }, timeout);
        });
    }

    // Функція для затримки виконання
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 🔍 Перевірка, чи користувач залогований
    async function isLoggedIn() {
        debugLog('Перевіряємо, чи користувач залогований...');
        
        // Чекаємо достатньо довго, щоб сторінка повністю завантажилася
        await delay(2000);
        
        try {
            // Шукаємо кнопку логіну різними можливими селекторами
            const loginButton = document.querySelector('.btn-danger') || 
                               document.querySelector('button.login-button') ||
                               Array.from(document.querySelectorAll('button')).find(btn => 
                                  btn.textContent.includes('Login') || 
                                  btn.textContent.includes('Sign in') ||
                                  btn.textContent.includes('Увійти'));
            
            // Якщо кнопка не знайдена, вважаємо, що користувач вже залогований
            const isLogged = !loginButton;
            debugLog(`Статус логіну: ${isLogged ? 'залогований' : 'не залогований'}`);
            
            // Зберігаємо знайдену кнопку для подальшого використання
            window.foundLoginButton = loginButton;
            
            return isLogged;
        } catch (error) {
            debugLog('Помилка при перевірці статусу логіну:', error);
            return false;
        }
    }
    
    // Перевірка та натискання на кнопку Domain User залежно від напису
    async function checkAndClickDomainButton() {
        debugLog('Перевіряємо кнопки Domain User...');
        
        try {
            // Шукаємо всі кнопки на формі
            const buttons = Array.from(document.querySelectorAll('button'));
            
            // Шукаємо кнопку з написом True
            const trueButton = buttons.find(btn => 
                btn.textContent.includes('True'));
                
            // Шукаємо кнопку з написом False
            const falseButton = buttons.find(btn => 
                btn.textContent.includes('False'));
                
            if (trueButton) {
                debugLog('Знайдено кнопку з написом True, натискаємо...');
                trueButton.click();
                await delay(500); // Чекаємо після натискання
                return true;
            } else if (falseButton) {
                debugLog('Знайдено кнопку з написом False, пропускаємо її натискання');
                // Нічого не робимо з кнопкою False - просто продовжуємо далі
                return true;
            } else {
                debugLog('Кнопок True/False не знайдено!');
                return false;
            }
        } catch (error) {
            debugLog('Помилка при перевірці кнопок Domain User:', error);
            return false;
        }
    }
    
    // Безпосереднє введення тексту в поле
    async function typeIntoField(field, text) {
        if (!field) {
            debugLog('Поле не знайдено для введення тексту');
            return false;
        }
        
        try {
            // Метод 1: Пряма вставка + тригер подій
            field.value = text;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Метод 2: Використання execCommand для натурального введення тексту
            field.focus();
            field.select();
            document.execCommand('insertText', false, text);
            
            // Перевірка, чи вдалося встановити значення
            debugLog(`Введено текст у поле: ${field.value === text ? 'успішно' : 'невдало'}`);
            await delay(300);
            
            return true;
        } catch (error) {
            debugLog('Помилка при введенні тексту:', error);
            return false;
        }
    }
    
    // Функція заповнення форми логіну
    async function fillLoginForm() {
        debugLog('Заповнюємо форму логіну...');
        
        try {
            // Чекаємо на появу полів вводу
            const usernameInput = await waitForElement('input[placeholder="Username"]');
            await delay(500); // Додаткова затримка перед введенням
            
            // Вводимо логін
            debugLog('Вводимо логін...');
            await typeIntoField(usernameInput, USERNAME);
            
            // Знаходимо поле паролю і вводимо пароль
            const passwordInput = await waitForElement('input[placeholder="Password"]');
            debugLog('Вводимо пароль...');
            await typeIntoField(passwordInput, PASSWORD);
            
            // Знаходимо кнопку підтвердження і натискаємо
            const submitButton = await waitForElement('.btn-sm');
            debugLog('Натискаємо кнопку логіну...');
            submitButton.click();
            
            return true;
        } catch (error) {
            debugLog('Помилка при заповненні форми:', error);
            return false;
        }
    }

    // Знаходження кнопки логіну різними способами
    async function findLoginButton() {
        debugLog('Шукаємо кнопку логіну...');
        
        try {
            // Спробуємо знайти кнопку за різними критеріями
            let loginButton = null;
            
            // Спосіб 1: За класом
            loginButton = document.querySelector('.btn-danger');
            if (loginButton) {
                debugLog('Знайдено кнопку логіну за класом .btn-danger');
                return loginButton;
            }
            
            // Спосіб 2: За текстом на кнопках
            const allButtons = Array.from(document.querySelectorAll('button'));
            loginButton = allButtons.find(btn => 
                btn.textContent.includes('Login') || 
                btn.textContent.includes('Sign in') ||
                btn.textContent.includes('Увійти') ||
                btn.textContent.includes('Log In'));
                
            if (loginButton) {
                debugLog('Знайдено кнопку логіну за текстом');
                return loginButton;
            }
            
            // Спосіб 3: За атрибутами
            loginButton = document.querySelector('[type="submit"]') || 
                         document.querySelector('[role="button"]') ||
                         document.querySelector('a.login');
                         
            if (loginButton) {
                debugLog('Знайдено кнопку логіну за атрибутами');
                return loginButton;
            }
            
            // Не знайдено жодної кнопки
            debugLog('УВАГА! Кнопку логіну не знайдено жодним способом');
            return null;
        } catch (error) {
            debugLog('Помилка при пошуку кнопки логіну:', error);
            return null;
        }
    }
    
    // Головна функція автологіну
    async function autoLogin() {
        debugLog('Починаємо процес автологіну...');
        
        // Чекаємо, щоб сторінка точно завантажилась
        await delay(3000);
        
        // Перевіряємо, чи користувач не залогований
        const logged = await isLoggedIn();
        if (logged) {
            debugLog('Користувач вже залогований, завершуємо роботу.');
            return;
        }
        
        try {
            // Знаходимо кнопку логіну
            let loginButton = window.foundLoginButton || await findLoginButton();
            
            if (!loginButton) {
                throw new Error('Не вдалося знайти кнопку логіну.');
            }
            
            debugLog('Відкриваємо форму логіну...');
            loginButton.click();
            
            // Чекаємо, поки форма відкриється
            await delay(1500);
            
            // Перевіряємо кнопки True/False і діємо відповідно
            await checkAndClickDomainButton();
            
            // Заповнюємо форму логіну
            await fillLoginForm();
            
            debugLog('Процес логіну завершено.');
        } catch (error) {
            debugLog('Критична помилка в процесі автологіну:', error);
            console.error(error);
        }
    }

    // Запускаємо автологін через значну затримку, щоб сторінка точно завантажилася
    setTimeout(autoLogin, 5000);
    
    // Додаємо можливість ручного запуску через консоль
    window.triggerAutoLogin = autoLogin;
    
    debugLog('Скрипт автологіну завантажено. Чекаємо на повне завантаження сторінки...');
})();