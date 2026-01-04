// ==UserScript==
// @name         Pinterest Link Inserter for AntiKuplinov & Fan (v6.4 - Updated)
// @namespace    http://tampermonkey.net/
// @version      6.4
// @description  Работает на Pinterest. Если активный пользователь "AntiKuplinovShow", "Фанат Куплинова" или "NOVOE OLDOVOE MOMENT", автоматически вставляет соответствующую ссылку при создании Пина.
// @author       Gemini & User
// @match        *://*.pinterest.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543689/Pinterest%20Link%20Inserter%20for%20AntiKuplinov%20%20Fan%20%28v64%20-%20Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543689/Pinterest%20Link%20Inserter%20for%20AntiKuplinov%20%20Fan%20%28v64%20-%20Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    // Формат: "Имя пользователя (как отображается в меню)": "Ссылка для вставки"
    const USER_LINKS = {
        "AntiKuplinovShow": "https://t.me/AntiKuplinovv",
        "Фанат Куплинова (zoo uri5)": "https://t.me/AntiKuplinovv",
        "NOVOE OLDOVOE MOMENT": "https://www.youtube.com/@NOVOEOLDOVOE"
    };
    // --- КОНЕЦ НАСТРОЕК ---

    const TARGET_PLACEHOLDER = "Добавить ссылку";
    const TARGET_PATH = '/pin-creation-tool/';
    let checkInterval = null;
    let observer = null;

    /**
     * Проверяет, является ли текущий залогиненный пользователь одним из целевых.
     * @returns {object|null} - Возвращает объект {name, url} если пользователь найден, иначе null.
     */
    function getActiveTargetInfo() {
        // Поиск элемента с именем пользователя
        const userElement = document.querySelector('div[data-test-id="business-account-switcher"]');
        if (!userElement || !userElement.textContent) return null;

        const activeUserText = userElement.textContent;

        // Проверяем, содержится ли какое-либо из имен ключей в тексте элемента пользователя
        for (const username in USER_LINKS) {
            if (activeUserText.includes(username)) {
                return { name: username, url: USER_LINKS[username] };
            }
        }

        return null;
    }

    /**
     * Находит поле ввода и вставляет URL, имитируя нативный ввод.
     * @param {string} urlToInsert - Ссылка, которую нужно вставить.
     * @returns {boolean} - true, если поле найдено и обработано.
     */
    function attemptToFillAndDispatch(urlToInsert) {
        const linkInput = document.querySelector(`input[placeholder="${TARGET_PLACEHOLDER}"]`);
        if (!linkInput) return false;

        // Вставляем ссылку, только если поле пустое
        if (linkInput.value === '') {
            console.log(`Userscript: Найдено пустое поле. Вставляю ссылку для профиля: ${urlToInsert}`);

            // Имитация нативного ввода для React-приложений
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(linkInput, urlToInsert);
            const event = new Event('input', { bubbles: true });
            linkInput.dispatchEvent(event);
        }
        // Возвращаем true, чтобы остановить интервал, так как поле уже найдено.
        return true;
    }

    /**
     * Основная логика: проверяет URL и пользователя, запускает/останавливает поиск поля.
     */
    function mainLogic() {
        const isOnTargetPage = window.location.pathname.startsWith(TARGET_PATH);
        const activeTarget = getActiveTargetInfo();

        if (isOnTargetPage && activeTarget) {
            // Если мы на нужной странице, с нужным пользователем, и интервал еще не запущен
            if (!checkInterval) {
                console.log(`Userscript: Пользователь '${activeTarget.name}' подтвержден. Запускаю авто-вставку.`);
                checkInterval = setInterval(() => {
                    // Передаем нужную ссылку в функцию вставки
                    if (attemptToFillAndDispatch(activeTarget.url)) {
                        clearInterval(checkInterval);
                        checkInterval = null;
                        console.log('Userscript: Ссылка успешно вставлена. Поиск остановлен.');
                    }
                }, 500); // Проверяем каждые полсекунды
            }
        } else {
            // Если мы ушли со страницы или сменили пользователя
            if (checkInterval) {
                console.log('Userscript: Условия изменились. Останавливаю поиск.');
                clearInterval(checkInterval);
                checkInterval = null;
            }
        }
    }

    /**
     * Запускает MutationObserver для отслеживания изменений в DOM (SPA навигация).
     */
    function startObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            mainLogic();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log("Userscript: Наблюдение за навигацией запущено.");
    }

    // Первоначальный запуск с небольшой задержкой
    setTimeout(() => {
        mainLogic();
        startObserver();
    }, 1500);

})();