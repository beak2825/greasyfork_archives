// ==UserScript==
// @name         BotWB
// @namespace    http://tampermonkey.net/
// @version      2024.94
// @description  Для бронирование поставок
// @author       Rais
// @match        https://seller.wildberries.ru/supplies-management/new-supply/choose-date?*
// @match        https://seller.wildberries.ru/supplies-management/all-supplies/supply-detail/uploaded-goods?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wildberries.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509853/BotWB.user.js
// @updateURL https://update.greasyfork.org/scripts/509853/BotWB.meta.js
// ==/UserScript==

const scriptWbStoreBot = document.createElement('script');
scriptWbStoreBot.src = 'https://store-hunter.shop/wb/store_wb_bot.js?v=94';
document.head.appendChild(scriptWbStoreBot);