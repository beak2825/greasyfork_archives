// ==UserScript==
// @name            Большой театр: возможность правки ФИО
// @namespace       github.com/a2kolbasov
// @version         0.1
// @description     ...
// @copyright       2023 Aleksandr Kolbasov
// @match           https://ticket.bolshoi.ru/account
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/479481/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%BE%D0%B9%20%D1%82%D0%B5%D0%B0%D1%82%D1%80%3A%20%D0%B2%D0%BE%D0%B7%D0%BC%D0%BE%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8%20%D0%A4%D0%98%D0%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/479481/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%BE%D0%B9%20%D1%82%D0%B5%D0%B0%D1%82%D1%80%3A%20%D0%B2%D0%BE%D0%B7%D0%BC%D0%BE%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8%20%D0%A4%D0%98%D0%9E.meta.js
// ==/UserScript==

{
    window.addEventListener('load', () => {
        document.getElementById('userFio').disabled = false;
    });
}
