// ==UserScript==
// @name         Расписание ПВГУС
// @namespace    https://github.com/Faffcomo/TamperMonkey-TT-U-E
// @version      0.2
// @description  Изменяет дефолтное значение расписание ПВГУС-а на СППИ20
// @author       You
// @match        https://www.tolgas.ru/services/raspisanie/?id=0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475268/%D0%A0%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%9F%D0%92%D0%93%D0%A3%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/475268/%D0%A0%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%9F%D0%92%D0%93%D0%A3%D0%A1.meta.js
// ==/UserScript==
    document.body.innerHTML= document.body.innerHTML.replace('selected="selected">АИВТЭ20</option>','>АИВТЭ20</option>');
    document.body.innerHTML= document.body.innerHTML.replace('>СППИ20</option>','selected="selected">СППИ20</option>');