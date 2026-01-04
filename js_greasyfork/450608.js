// ==UserScript==
// @name         Schedule for dangkyhoc
// @namespace    https://github.com/duongoku
// @version      0.1
// @description  Change period column to time
// @author       duongoku
// @match        http://dangkyhoc.vnu.edu.vn/xem-va-in-ket-qua-dang-ky-hoc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450608/Schedule%20for%20dangkyhoc.user.js
// @updateURL https://update.greasyfork.org/scripts/450608/Schedule%20for%20dangkyhoc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.querySelectorAll(`table`)[2].querySelectorAll(`tr`))
            .slice(1, -1)
            .forEach((e) => {
                let x = e.querySelectorAll(`td`)[8];
                let t = x.innerText;
                t = t.split(`-`);
                let st = t[0].trim();
                let en = t[1].trim();
                x.innerText = `${parseInt(st) + 6}h - ${parseInt(en) + 7}h`;
            });
})();