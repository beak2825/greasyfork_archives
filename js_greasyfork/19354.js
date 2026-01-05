// ==UserScript==
// @name Нова Пошта + VipSMS
// @description Упрощает рассылку накладных через VipSMS.net
// @author Bogdan Gerasymenko
// @license MIT
// @version 1.11
// @include https://vipsms.net/*
// @namespace novaposhtavip
// @downloadURL https://update.greasyfork.org/scripts/19354/%D0%9D%D0%BE%D0%B2%D0%B0%20%D0%9F%D0%BE%D1%88%D1%82%D0%B0%20%2B%20VipSMS.user.js
// @updateURL https://update.greasyfork.org/scripts/19354/%D0%9D%D0%BE%D0%B2%D0%B0%20%D0%9F%D0%BE%D1%88%D1%82%D0%B0%20%2B%20VipSMS.meta.js
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
    if (/https:\/\/vipsms.net/.test(w.location.href)) {
        // Шаблон SMS-рассылки
        document.getElementById("SmsEntry_message").value = 'Ваше замовлення надіслано!\nНомер накладної:\n';
    }
})(window);