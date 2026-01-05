// ==UserScript==
// @name        GoogleCenzor Pinterest
// @include     http*://*google.*
// @description Цензура результатов pinterest.com в гугле
// @grant       none
// @run-at      document-end
// @namespace https://greasyfork.org/users/7568
// @version 0.0.1.20160314173402
// @downloadURL https://update.greasyfork.org/scripts/17971/GoogleCenzor%20Pinterest.user.js
// @updateURL https://update.greasyfork.org/scripts/17971/GoogleCenzor%20Pinterest.meta.js
// ==/UserScript==

var timer = 3, // секунды задержки
    swtch = 1, // нужно ли обкавычить
    string = "-pinimg", // что вставить
    area = document.getElementById('lst-ib'), // где вставить
    st = document.getElementsByClassName('lsb')[0]; // кнопка поиска
if ((!area.value.match(string))&&(area.value != "")) { // защита от повторных срабатываний
 if (swtch) {
  area.value = area.value.replace(/ /g,'" "').replace(/^(.*)$/g,'"$1"'); // обкавычить
 }
 area.value = string + ' ' + area.value; // как вставить
 st.click(); // поиск!
};