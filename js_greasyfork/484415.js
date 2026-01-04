// ==UserScript==
// @name         Cортировка инвентаря по ОА
// @namespace    isnt
// @version      0.1.1
// @description  Сортирует артефакты в инвентаре по ОА
// @author       isnt
// @include        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/inventory.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/484415/C%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8F%20%D0%BF%D0%BE%20%D0%9E%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/484415/C%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8F%20%D0%BF%D0%BE%20%D0%9E%D0%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

     let sorting_key = 1;
     const sortArts = () => {
          if(sorting_key == 1) {
               arts.sort((a,b) => b.art_oa - a.art_oa);
               sorting_key = 0;
          } else {
               arts.sort((a,b) => a.art_oa - b.art_oa);
               sorting_key = 1;
          }
          show_arts_in_category();
          hide_hwm_hint(this, true);
     }
     let i = document.createElement("div");

     i.setAttribute('class', 'divs_inline_right_24 btn_hover show_hint');
     i.title = 'Cортировка инвентаря по ОА';
     i.setAttribute('style', 'right: 252px;');
     i.innerHTML = `<img src="https://i.imgur.com/Af5HMCT.png" class="inv_100mwmh">`;

     i.addEventListener("click", function (e) {
          sortArts();
     });
     document.querySelector("#inv_art_amount > div:nth-child(3)").after(i);
})();