// ==UserScript==
// @name           Virtonomica: всегда старый интерфейс
// @version        1.0.3
// @namespace      Virtonomica Always Old Interface
// @description    Всегда перенаправляет на старый интерфейс
// @include        http*://*virtonomic*.*/*/main*
// @include        http*://*virtonomic*.*/*/window*
// @exclude        http*://*virtonomic*.*/*/main/unit/create*
// @exclude        http*://*virtonomic*.*/*/main/user/privat/persondata/message*
// @downloadURL https://update.greasyfork.org/scripts/404699/Virtonomica%3A%20%D0%B2%D1%81%D0%B5%D0%B3%D0%B4%D0%B0%20%D1%81%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/404699/Virtonomica%3A%20%D0%B2%D1%81%D0%B5%D0%B3%D0%B4%D0%B0%20%D1%81%D1%82%D0%B0%D1%80%D1%8B%D0%B9%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Слоган скрипта повторяет очень актуальный мем:
    // "Вы кто такие? Я вас не звал. Идите нах*й". Новый дизайн, это к тебе относится. И к тебе, новый дизайнер.


    // Общая структура скрипта
    // Ищем кнопку "old" о возврате в старый интерфейс
    // Если находим - заменяем урл пользователя и отправляем на версию страницы с ?old
    // НЕАКТУАЛЬНО Дополнительно ищем все ссылки на странице и прибавляем к ним ?old


    let old_interface_url_addition = '?old';// что надо добавить к урлу для получения старого интерфейса
        //hard_version = 0;// включить hard версию скрипта. НЕ ИСПОЛЬЗУЕТСЯ


    // Ищем кнопку с надписью "old"
    // Дополнительно перепроверяем на наличие кнопки new_interface для избежания багов
    // (Господи, разрабы Вирты, как вы даже кнопки интерфейсов делаете багованными? Где учат так плохо всё делать? Как можно плохо делать плохое?)
    if ($('a.tbeta').text().includes('old') && ($('div.unit_box-container').length == 0) && $('div.spec').length == 0) {
        let page_url = window.location.href.replace('?new', '');// получаем текущий урл за вычетом постфикса нового интерфейса

        // Меняем урл
        window.location.replace(page_url + old_interface_url_addition);
    }


    // Проходим по всем ссылкам, ищем ссылки на снабжение и меняем урлы
    // $('a[href*="supply"]').each(function() {
    //     let current_url = $(this).attr('href').replace('?new', '');// текущий урл
    //
    //     // Меняем ссылку на ?old
    //     $(this).attr('href', current_url + old_interface_url_addition);
    // })


})(window);