// ==UserScript==
// @name Нова Пошта + TurboSMS
// @description Упрощает рассылку накладных через turbosms.ua
// @author Bogdan Gerasymenko
// @license MIT
// @version 1.11
// @include https://turbosms.ua/single/add.html
// @namespace novaposhtavip
// @downloadURL https://update.greasyfork.org/scripts/396359/%D0%9D%D0%BE%D0%B2%D0%B0%20%D0%9F%D0%BE%D1%88%D1%82%D0%B0%20%2B%20TurboSMS.user.js
// @updateURL https://update.greasyfork.org/scripts/396359/%D0%9D%D0%BE%D0%B2%D0%B0%20%D0%9F%D0%BE%D1%88%D1%82%D0%B0%20%2B%20TurboSMS.meta.js
// ==/UserScript==

(function (window, undefined) {
  // Note, jQ replaces $ to avoid conflicts.
  // Нормализация окна
    var w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    // Не запускать во фреймах
    if (w.self != w.top) {
        return;
    }
    // Дополнительная проверка наряду с @include
    if (/https:\/\/turbosms.ua/.test(w.location.href)) {
        // Шаблон SMS-рассылки
        document.getElementById("single_text").value = '5169330518439044\n5168755439915741\nFOP Golota V.V\nSuma:  grn\nZakaz \n0662013546\n0962951915';
    }
})(window);