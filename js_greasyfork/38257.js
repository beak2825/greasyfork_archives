// ==UserScript==
// @name       AGR Helper
// @version      0.1.1
// @description  Хелпер для "Aliexpress Google reminder" - устанавливает дефолтовое мыло
// @author       skirda
// @include    https://trade.aliexpress.com/order_list*
// @include    https://trade.aliexpress.com/orderList*
// @include    https://trade.aliexpress.com/order_detail*
// @include    https://*.aliexpress.com/store/*
// @include    https://*.aliexpress.com/item/*
// @include    https://*.aliexpress.com/shopcart/*
// @include    https://*.aliexpress.com/wishlist/*
// @include    https://trade.aliexpress.ru/order_list*
// @include    https://trade.aliexpress.ru/orderList*
// @include    https://trade.aliexpress.ru/order_detail*
// @include    https://*.aliexpress.ru/store/*
// @include    https://*.aliexpress.ru/item/*
// @include    https://*.aliexpress.ru/shopcart/*
// @include    https://*.aliexpress.ru/wishlist/*
// @grant        none
// @namespace https://greasyfork.org/users/5363
// @downloadURL https://update.greasyfork.org/scripts/38257/AGR%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/38257/AGR%20Helper.meta.js
// ==/UserScript==

document.AGR_DefaultEmail=""; // <== здесь твоё мыло. И да, этот скрипт должен стартовать первым.
document.AGR_DefaultCalendar=""; // <== здесь нужный календарь - ИД_НУЖНОГО_КАЛЕНДАРЯ@group.calendar.google.com
console.log("AGR Helper",document.AGR_DefaultEmail);
console.log("AGR Helper",document.AGR_DefaultCalendar);