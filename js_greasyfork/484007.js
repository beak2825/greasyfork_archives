// ==UserScript==
// @name         Lastrium Spoiler Expander
// @version      0.3
// @description  Expands spoilers on lastrium.com
// @match        https://lastrium.com/*
// @grant        none
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/484007/Lastrium%20Spoiler%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/484007/Lastrium%20Spoiler%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Подключаем jQuery (убедитесь, что jQuery доступен на странице)
    // Мы предполагаем, что jQuery уже загружен на сайте.
    // Если нет, вы можете добавить ссылку на jQuery перед этим скриптом.

    // Ваш путь к jQuery, если необходимо заменить.
    var jQueryPath = 'https://code.jquery.com/jquery-3.6.4.min.js';

    // Проверяем, есть ли jQuery на странице, и, если нет, добавляем его.
    if (typeof window.jQuery === 'undefined') {
        var script = document.createElement('script');
        script.src = jQueryPath;
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    // Ждем, пока jQuery загрузится, и затем выполняем наш код.
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        } else {
            setTimeout(function() {
                checkReady(callback);
            }, 100);
        }
    };

    // Ждем завершения загрузки страницы.
    $(document).ready(function() {
        checkReady(function($) {
            // Ваш код для раскрытия спойлера.
            // В данном случае, мы эмулируем нажатие на спойлер.

            // Обрабатываем каждый спойлер на странице.
            $('.ipsSpoiler_header.ipsSpoiler_closed').each(function() {
                // Эмулируем нажатие на элемент, чтобы вызвать событие открытия спойлера.
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                this.dispatchEvent(event);
            });

            // Дополнительные действия могут потребоваться в зависимости от реальной структуры страницы.
        });
    });
})();
