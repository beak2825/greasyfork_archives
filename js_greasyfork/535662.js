// ==UserScript==
// @name         Сколько лечат травы
// @namespace    github.com/openstyles/stylus
// @version      1.3
// @description  Заменяет стандартные иконки предметов в Kinwoods на кастомные
// @author       Шумелка (ID 347). ВК - https://vk.com/oleg_rennege
// @license      CC BY-NC-ND 4.0
// @grant        GM_addStyle
// @run-at       document-start
// @match        *://*.kinwoods.com/*
// @match        *://kinwoods.com/*
// @downloadURL https://update.greasyfork.org/scripts/535662/%D0%A1%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%BB%D0%B5%D1%87%D0%B0%D1%82%20%D1%82%D1%80%D0%B0%D0%B2%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535662/%D0%A1%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%BB%D0%B5%D1%87%D0%B0%D1%82%20%D1%82%D1%80%D0%B0%D0%B2%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let css = `
        /* Багульник */
        img[src="pics/items/75.png"],
        .slot-item-image[alt="it:75"] {
            content: url('http://d.zaix.ru/N992.png') !important;
        }

        /* Лунная лилия */
        img[src="pics/items/122.png"],
        .slot-item-image[alt="it:122"] {
            content: url('http://d.zaix.ru/N99H.png') !important;
        }

        /* Лунная лилия НОВАЯ*/
        img[src="pics/items/121.png"],
        .slot-item-image[alt="it:121"] {
            content: url('http://d.zaix.ru/QnCB.png') !important;
        }

        /* Целебный букет */
        img[src="pics/items/77.png"],
        .slot-item-image[alt="it:77"] {
            content: url('http://d.zaix.ru/N99M.png') !important;
        }

        /* Лаванда */
        img[src="pics/items/76.png"],
        .slot-item-image[alt="it:76"] {
            content: url('http://d.zaix.ru/N9ap.png') !important;
        }

        /* Ягоды */
        img[src="pics/items/145.png"],
        .slot-item-image[alt="it:145"] {
            content: url('http://d.zaix.ru/N9at.png') !important;
        }

         /* Ягоды */
        img[src="pics/items/146.png"],
        .slot-item-image[alt="it:146"] {
            content: url('http://d.zaix.ru/N9at.png') !important;
        }

        /* Трава ХЛ */
        img[src="pics/items/14.png"],
        .slot-item-image[alt="it:14"] {
            content: url('http://d.zaix.ru/N9aB.png') !important;
        }

         /* Слеза огнерога 1 тир */
        img[src="pics/items/13.png"],
        .slot-item-image[alt="it:13"] {
            content: url('http://d.zaix.ru/Nc5h.png') !important;
        }

         /* Слеза огнерога 4 тир */
        img[src="pics/items/129.png"],
        .slot-item-image[alt="it:129"] {
            content: url('http://d.zaix.ru/N9aP.png') !important;
        }

         /* Слеза огнерога 2 тир новая */
        img[src="pics/items/127.png"],
        .slot-item-image[alt="it:127"] {
            content: url('http://d.zaix.ru/QnzP.png') !important;
        }

         /* Донник */
        img[src="pics/items/357.png"],
        .slot-item-image[alt="it:357"] {
            content: url('http://d.zaix.ru/P7NF.png') !important;
        }

         /* Арника */
        img[src="pics/items/283.png"],
        .slot-item-image[alt="it:283"] {
            content: url('http://d.zaix.ru/QnnL.png') !important;
        }

         /* Змееголовник */
        img[src="pics/items/458.png"],
        .slot-item-image[alt="it:458"] {
            content: url('http://d.zaix.ru/QnyU.png') !important;
        }
    `;

    // Добавляем стили в DOM
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }


})();