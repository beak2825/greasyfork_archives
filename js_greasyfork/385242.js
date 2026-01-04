// ==UserScript==
// @name           hwm_shestidyryj
// @namespace      https://greasyfork.org/users/12821
// @description    Шестидырый молдован
// @author         Kleshnerukij
// @version        1.00
// @include        http://www.heroeswm.ru/search.php*
// @include        http://qrator.heroeswm.ru/search.php*
// @include        http://178.248.235.15/search.php*
// @include        http://www.lordswm.com/search.php*
// @include        https://www.heroeswm.ru/search.php*
// @include        https://qrator.heroeswm.ru/search.php*
// @include        https://178.248.235.15/search.php*
// @include        https://www.lordswm.com/search.php*
// @downloadURL https://update.greasyfork.org/scripts/385242/hwm_shestidyryj.user.js
// @updateURL https://update.greasyfork.org/scripts/385242/hwm_shestidyryj.meta.js
// ==/UserScript==

(function () {

var search_input = document.getElementsByTagName('form')[0].getElementsByTagName('input')[0];
var search_button = document.getElementsByTagName('form')[0].getElementsByTagName('input')[1];

document.addEventListener(`keydown`, event => {
  if (event.keyCode == 13) {
    if(search_input.value == 'Шестидырый' || search_input.value == 'Шестидырочный' || search_input.value == 'Шестидырчатый' || search_input.value == 'Дырявый') {
        search_input.value = 'Ooo-ooO';
    }
    console.log(`йо`); // some code
  }
}, false);

search_button.addEventListener(`mouseup`, event => {
    if(search_input.value == 'Шестидырый' || search_input.value == 'Шестидырочный' || search_input.value == 'Шестидырчатый' || search_input.value == 'Дырявый') {
        search_input.value = 'Ooo-ooO';
    }
    console.log(`йо`); // some code
}, false);

})();