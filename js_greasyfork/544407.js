// ==UserScript==
// @name         Auto Click Button on Adblock in Aternos.org
// @name:ru      Авто нажатие на кнопку AdBLock в Aternos.org
// @version      1.1
// @description  Clicks and deletes the button with adblock on aternos.org (for languages: RU and EN!!!!)
// @description:ru Нажатие и удаление кнопки Adblock на aternos.org
// @match        https://aternos.org/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1500918
// @downloadURL https://update.greasyfork.org/scripts/544407/Auto%20Click%20Button%20on%20Adblock%20in%20Aternosorg.user.js
// @updateURL https://update.greasyfork.org/scripts/544407/Auto%20Click%20Button%20on%20Adblock%20in%20Aternosorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textsToFind = [
        'продолжить с блокировщиком рекламы',
        'continue with adblocker anyway'
    ];

    setInterval(() => {
        const buttons = document.querySelectorAll('div.btn.btn-white');
        for (const btn of buttons) {
            const text = btn.textContent.toLowerCase();
            if (textsToFind.some(t => text.includes(t))) {
                btn.click();
                btn.remove(); // delete button to prevent looping
                console.log('Button is pressed and deleted!');
                break;
            }
        }
    }, 1000);

})();
