// ==UserScript==
// @name         Google Forms Auto-Close Simplified
// @namespace    https://t.me/zycck
// @version      1.6
// @description  Закрывает вкладку через 3 сек после отправки Google Forms (formResponse).
// @match        https://docs.google.com/forms/u/0/d/e/*/formResponse*
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534358/Google%20Forms%20Auto-Close%20Simplified.user.js
// @updateURL https://update.greasyfork.org/scripts/534358/Google%20Forms%20Auto-Close%20Simplified.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Регулярка для проверки URL
    const pattern = /^https:\/\/docs\.google\.com\/forms\/u\/0\/d\/e\/.+\/formResponse.*$/;

    // Время в миллисекундах, соответствующее 5000 секундам
    const timeoutMs = 3000;

    // Запомним изначальный URL и время
    let lastUrl = location.href;
    let lastChangeTime = Date.now();

    // Функция, закрывающая вкладку (с обходом для браузеров, не давших разрешения)
    function closeTab() {
        // Попытка стандартного close()
        window.close();
        // Если не сработало (Chrome), пробуем хак:
        window.open('', '_self');
        window.close();
    }

    setInterval(() => {

        const currentUrl = location.href;
        console.log(pattern.test(currentUrl),(Date.now() - lastChangeTime) > timeoutMs)
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            lastChangeTime = Date.now();
        }
        if (pattern.test(currentUrl) && (Date.now() - lastChangeTime) > timeoutMs) {
            closeTab();
        }
    }, 1000);

})();