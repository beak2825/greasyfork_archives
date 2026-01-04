// ==UserScript==
// @name         Выделение последнего списания
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Выделяет последнее списание цветом. Если статус списания "Успешно", то выделение будет зеленым цветом, если "Ошибка", то красным
// @author       HYDRA
// @match        https://svoi-ludi.ru/manager/recurring?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=svoi-ludi.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502106/%D0%92%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B5%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502106/%D0%92%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B5%D0%B3%D0%BE%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        let table = document.querySelector(".kv-grid-table");
        let firstRow = table.children[1].children[0];
        let status = firstRow.children[1].firstChild.text;

        if (status === "Ошибка" || status === "Успешно") {
            firstRow.style.color = "#fff";
        }

        if (status === "Успешно") {
            firstRow.style.backgroundColor = "#7AB733";
        } else if (status === "Ошибка"){
            firstRow.style.backgroundColor = "#d7382c";
        }
    },100);
})();