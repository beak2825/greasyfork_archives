// ==UserScript==
// @name         Сортировка по очкам в ивенте [RUS]
// @version      0.3
// @author       Arekino
// @match        https://www.heroeswm.ru/clan_info.php*
// @grant        none
// @namespace https://greasyfork.org/users/239593
// @description Перевод на русский язык скрипта Arekino.
// @downloadURL https://update.greasyfork.org/scripts/424836/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BF%D0%BE%20%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%20%D0%B2%20%D0%B8%D0%B2%D0%B5%D0%BD%D1%82%D0%B5%20%5BRUS%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/424836/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BF%D0%BE%20%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%20%D0%B2%20%D0%B8%D0%B2%D0%B5%D0%BD%D1%82%D0%B5%20%5BRUS%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
     let i = document.createElement("div");

     i.setAttribute('style', 'text-align: center;background-color: #ce2e5a;color: #e2b77d;border: 0;border-radius: 5px;width: 250px;padding: 10px;margin: 10px auto;box-shadow: inset 0 0 0 1px #e2b77d, inset 0 0 4px rgb(0 0 0 / 50%), inset 0 -25px 10px rgb(0 0 0 / 50%), 0 1px 7px rgb(0 0 0 / 70%);');
     i.setAttribute('class', 'sort-btn');

     let css = '.sort-btn:hover{ cursor: pointer; -webkit-filter: brightness(1.3) drop-shadow(0 1px 3px #ffcf7e); filter: brightness(130%) drop-shadow(0 1px 3px #ffcf7e); }';
     let style = document.createElement('style');

     if (style.styleSheet) {
          style.styleSheet.cssText = css;
     } else {
          style.appendChild(document.createTextNode(css));
     }

     document.getElementsByTagName('head')[0].appendChild(style);

     i.innerText = "Сортировать по очкам в ивенте";
     i.onclick = () => {
        [...document.querySelectorAll("#table-content > tr")].sort((x, y) => Number(y.lastElementChild.innerText) - Number(x.lastElementChild.innerText)).forEach((x, i) => {
              x.parentElement.appendChild(x);
              x.firstElementChild.innerText = `${i+1}.`
           })
     }
     document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1)").after(i)
    // Your code here...
})();