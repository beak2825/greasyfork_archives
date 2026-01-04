// ==UserScript==
// @name         Тык! | Шмель
// @namespace    Violentmonkey Scripts
// @version      1
// @description  Вместо открытия заказа в настоящей вкладке открывает её в другой
// @author       Семён
// @match        https://a24.biz/my/notifications
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/495661/%D0%A2%D1%8B%D0%BA%21%20%7C%20%D0%A8%D0%BC%D0%B5%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/495661/%D0%A2%D1%8B%D0%BA%21%20%7C%20%D0%A8%D0%BC%D0%B5%D0%BB%D1%8C.meta.js
// ==/UserScript==


(function() {


    // Функция для проверки URL и выполнения действий
    var checkURL = function() {
        // Проверяем текущий URL
        if (window.location.href !== 'https://a24.biz/my/notifications') {
            // Если URL не соответствует ожидаемому и перенаправление не выполняется,
            // устанавливаем флаг перенаправления и выполняем действия

            var currentURL = window.location.href;
            // Регулярное выражение для извлечения основной части ссылки на заказ
            var regex = /https:\/\/a24\.biz\/order\/1\d{7}/;
            // Извлекаем основную часть ссылки на заказ из URL
            var match = currentURL.match(regex);
            var orderLink = match[0];
            var duplicateWindow = openURL(orderLink, 2);
            window.focus();
            window.history.back();
            if (window.location.href !== 'https://a24.biz/my/notifications') {
            return;
            }
        }
    };

    // Устанавливаем интервал для проверки URL каждые 100 миллисекунд
    setInterval(checkURL, 1000);
})();

function openURL(url, opt){
    if (opt == 0){ // текущее окно
        window.location = url;
    } else if (opt == 1){ // новое окно
        window.open(url);
    } else if (opt == 2){ // фоновое окно
        window.open(url); self.focus();
    }
}
