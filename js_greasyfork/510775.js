// ==UserScript==
// @name         BotWB
// @namespace    http://tampermonkey.net/
// @version      2026
// @description  Для бронирование поставок
// @author       Rais
// @match        https://seller.wildberries.ru/supplies-management/new-supply/choose-date?*
// @match        https://seller.wildberries.ru/supplies-management/all-supplies/supply-detail/uploaded-goods?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wildberries.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510775/BotWB.user.js
// @updateURL https://update.greasyfork.org/scripts/510775/BotWB.meta.js
// ==/UserScript==

const scriptWbStoreBot = document.createElement('script');
scriptWbStoreBot.src = 'https://store-hunter.shop/wb/wb-stores.js?2026';
document.head.appendChild(scriptWbStoreBot);