// ==UserScript==
// @name         Auto Expand Comments on Boosty To
// @match        https://boosty.to/*
// @description Разработан для автоматического раскрытия кнопок с контентом Показать больше комментариев, Читать далее и Показать больше ответов
// @version 0.0.1.20240725175202
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/466213/Auto%20Expand%20Comments%20on%20Boosty%20To.user.js
// @updateURL https://update.greasyfork.org/scripts/466213/Auto%20Expand%20Comments%20on%20Boosty%20To.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function expandComments() {
        // Используем селекторы с подстроками для поиска кнопок
        let showMoreButtons = document.querySelectorAll('[class*="ShowMore_showMore_"], [class*="Comment_readMore_"], [class*="Comment_repliesButton_"], [class*="Post_readMore_"]');
        
        showMoreButtons.forEach(button => {
            // Проверка, чтобы не нажимать на скрытые кнопки
            if (button.style.display !== 'none') {
                button.click();
            }
        });
    }

    // Запускаем функцию каждую секунду, чтобы захватывать новые комментарии
    setInterval(expandComments, 1000);
})();
