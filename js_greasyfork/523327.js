// ==UserScript==
// @name         Ozon wannaDiscount
// @namespace    http://tampermonkey.net/
// @version      2025.01.08
// @description  добавление кнопок 10% 15% 20% 25% 30% 35% и соотв. цен в форму запроса скидки 
// @author       k-dmitriy
// @match        https://www.ozon.ru/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/523327/Ozon%20wannaDiscount.user.js
// @updateURL https://update.greasyfork.org/scripts/523327/Ozon%20wannaDiscount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=%2Fmodal%2Fwanna-discount%3Fsku%3D1678475755%26page_changed%3Dtrue

    document.arrive('div[data-widget="wannaDiscount"]', {onceOnly: true}, function () {
        let price = this.querySelector('div[style*="price-strikethrough"]').innerText.split('\n');
        price = Number(price[1].replace(/\D/g, ''));
        let inpt = this.querySelector('input');
        let buttonContainer = this.querySelector('button').parentElement.parentElement.parentElement;
        let buttons = new Array();
        for (let i = 2; i <= 7; i++) {
            buttons.push(document.createElement('input'));
            buttons.at(-1).type = 'button'; buttons.at(-1).value = '-'+ i*5 +'%\n'+Math.floor(price*(1-i*5/100));
            buttons.at(-1).addEventListener('click', () => {
//                navigator.clipboard.writeText(Math.floor(price*(1-i*5/100)));
                inpt.dispatchEvent(new Event('input'));
                inpt.value = Math.floor(price*(1-i*5/100));
                inpt.focus();
                inpt.dispatchEvent(new Event('input'));
            });
            buttonContainer.append(buttons.at(-1));
        }
    });
})();