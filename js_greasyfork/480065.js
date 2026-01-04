// ==UserScript==
// @name         tab
// @namespace    sputnik
// @version      777
// @description  $$$
// @author       You
// @match        https://lis-skins.ru/market/csgo/*/
// @exclude      https://lis-skins.ru/market/csgo/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480065/tab.user.js
// @updateURL https://update.greasyfork.org/scripts/480065/tab.meta.js
// ==/UserScript==

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let carts,
    prices,
    price_discount,
    array,
    price,
    discount,
    maxPrice;

async function load()
{
    await delay(250);
    carts = document.getElementsByClassName('to-cart'); // получаем список всех кнопок КОРЗИНА
    prices = document.getElementsByClassName('price'); // получаем цены всех скинов на странице
    price_discount = document.getElementsByClassName('min-price-value'); // получаем строку ЦЕНА-СКИДКА

    array = [...prices]; // преобразовываем коллекцию ЦЕН в массив ЦЕН

    [price, discount] = price_discount[0].outerText.split('  '); // разделяем строку на ЦЕНА и СКИДКА
    price = price.replace(' ', ''); // превращаем строку ЦЕНА в целочисленное число
    discount = Math.abs(+discount.slice(0, -1)); // превращаем строку СКИДКА в число

    maxPrice = price*1.2; // 20%

    if (discount > 74) {
        for (let i = 0; i != array.length; i++) {
            if (array[i].innerText.replace(' ', '') < maxPrice) {
                carts[i].click();
                await delay(250);
            }
        }
        $('.cart-button').click();
        await delay(100);
        $('.buy-button').click();
    }
    await delay(100000);
    window.close()
}

load();