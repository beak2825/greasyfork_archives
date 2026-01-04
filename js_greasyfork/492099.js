// ==UserScript==
// @name         Open all links1
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Открытие ссылок в окне таска
// @author       You
// @match        *://*/Admin/MyCurrentTask/Active
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492099/Open%20all%20links1.user.js
// @updateURL https://update.greasyfork.org/scripts/492099/Open%20all%20links1.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
 // Найдите элемент <td> с текстом "Retailer"
let retailerTD = Array.from(document.querySelectorAll('td')).find(td => td.textContent.trim() === 'Retailer');
 
// Создайте кнопку "Open all links"
let openAllLinksButton = document.createElement('input');
openAllLinksButton.type = 'button';
openAllLinksButton.value = 'Open all links';
openAllLinksButton.className = 'btn';
 
// Создайте элемент для переноса строки
let br = document.createElement('br');
 
// Добавьте кнопку и перенос строки внутри <td>Retailer</td>
retailerTD.appendChild(openAllLinksButton);
retailerTD.appendChild(br);
 
// Добавьте обработчик события для кнопки
openAllLinksButton.addEventListener('click', function() {
    // Получите все элементы <td> с ссылками
    let tdWithLinks = document.querySelectorAll('td a');
 
    // Откройте все ссылки в новых вкладках
    tdWithLinks.forEach(function(link) {
        window.open(link.href, '_blank');
    });
});
 
    // Добавьте кнопку внутри <td> после текста "Retailer"
    retailerTD.appendChild(openAllLinksButton);
})();