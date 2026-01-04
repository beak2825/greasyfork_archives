// ==UserScript==
// @name         Скидка на egrp365.ru
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Генератор промокода -90р.
// @author       DiamondGlaz
// @match        https://egrp365.ru/reestr?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=egrp365.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514692/%D0%A1%D0%BA%D0%B8%D0%B4%D0%BA%D0%B0%20%D0%BD%D0%B0%20egrp365ru.user.js
// @updateURL https://update.greasyfork.org/scripts/514692/%D0%A1%D0%BA%D0%B8%D0%B4%D0%BA%D0%B0%20%D0%BD%D0%B0%20egrp365ru.meta.js
// ==/UserScript==

async function sendRequest() {
    try {
        const response = await fetch('https://egrp365.ru/add_coupon.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: 90 })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const { promocode } = await response.json();
        const inputElement = document.querySelector('input[name="promocode"]');
        if (inputElement) inputElement.value = promocode;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}

sendRequest();