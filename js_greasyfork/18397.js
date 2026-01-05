// ==UserScript==
// @name         Скрыть посты игнорированных на forum.tiguans.ru
// @description  Скрипт полностью скрывает посты игнорированных пользователей, которые по умолчанию просто свёрнуты
// @match        http://forum.tiguans.ru/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/36351
// @version 0.0.1.20160331143757
// @downloadURL https://update.greasyfork.org/scripts/18397/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BF%D0%BE%D1%81%D1%82%D1%8B%20%D0%B8%D0%B3%D0%BD%D0%BE%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D0%BD%D0%B0%20forumtiguansru.user.js
// @updateURL https://update.greasyfork.org/scripts/18397/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BF%D0%BE%D1%81%D1%82%D1%8B%20%D0%B8%D0%B3%D0%BD%D0%BE%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D0%BD%D0%B0%20forumtiguansru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery("a:contains('Удалить пользователя из списка игнорирования')")
        .closest('div.page')
        .parent()
        .remove();
    
    jQuery("td.alt1 b:contains('списке игнорирования')")
        .closest('tr')
        .each(function() {
            $(this).prev().remove();
            $(this).remove();
        });
    
})();