// ==UserScript==
// @name         UserAPI Link Redirector
// @version      0.6
// @description  Redirect UserAPI links to a formatted version (single redirect)
// @match        https://*.userapi.com/*
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/483815/UserAPI%20Link%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/483815/UserAPI%20Link%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для форматирования и переадресации ссылки
    function redirectUserAPILink(link) {
        // Регулярное выражение для извлечения нужных параметров из ссылки
        var regex = /https:\/\/.*?\/impg\/(.*?)(?:\/(.*?))?\?.*$/;
        var matches = link.match(regex);

        if (matches && matches.length >= 2) {
            // Формирование новой ссылки
            var newLink = 'https://pp.userapi.com/' + matches[1];
            if (matches[2]) {
                newLink += '/' + matches[2];
            }
            console.log('Redirecting to:', newLink);

            // Проверяем, была ли уже выполнена переадресация
            if (!window.location.redirected) {
                window.location.replace(newLink);
                // Устанавливаем флаг, чтобы избежать повторной переадресации
                window.location.redirected = true;
            }
        } else {
            console.log('Unable to format link:', link);
        }
    }

    // Переадресуем текущую страницу, если она соответствует фильтру
    redirectUserAPILink(window.location.href);
})();
