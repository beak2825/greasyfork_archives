// ==UserScript==
// @name         Настройки Своего Курсора
// @namespace    https://greasyfork.org/ru/scripts/by-site/cursors.uvias.com
// @version      0.1
// @description  Теперь Вы Можете Настраивать Сколько Будет Кликов В Минуту И Проходить Сквоздь Стенки Или Нет
// @author       You
// @match        https://cursors.uvias.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cursors.uvias.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455233/%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8%20%D0%A1%D0%B2%D0%BE%D0%B5%D0%B3%D0%BE%20%D0%9A%D1%83%D1%80%D1%81%D0%BE%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455233/%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8%20%D0%A1%D0%B2%D0%BE%D0%B5%D0%B3%D0%BE%20%D0%9A%D1%83%D1%80%D1%81%D0%BE%D1%80%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
let number = prompt("Сколько Будет Кликов В Секунду?")
clicktimes = number
let boss = confirm("Дать Супер Способность Или нет?")
wallhack = boss
alert(""+number+" кликов в секудку!")
alert("супер способность в состояние "+boss+"")
    // Your code here...
})();