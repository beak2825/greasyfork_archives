// ==UserScript==
// @name         HWM Auction sell last view
// @description  продавать товар из последнего посмотренного раздела
// @version      2
// @author       Kam
// @include      https://www.heroeswm.ru/auction_new_lot.php
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/485699/HWM%20Auction%20sell%20last%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/485699/HWM%20Auction%20sell%20last%20view.meta.js
// ==/UserScript==

(function (undefined) {

  // Получаем значение параметра art_type из предыдущей страницы
  const artType = document.referrer.match(/art_type=([^&]+)/)[1];

  // Ищем select по заданному ID
  const select = document.querySelector('select#sel');

  // Проходимся по всем options в select
  for (const option of select.options) {
    // Если значение option начинается с art_type, то выбираем его
      console.log(option.value);
    if (option.value.startsWith(artType)) {
      option.selected = true;
      break;
    }
  }

}());
