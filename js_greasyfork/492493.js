// ==UserScript==
// @name         Кнопка копирования
// @namespace    https://lzt.market/
// @version      0.6
// @description  Копировать на lolzmarket
// @author       Wi33y
// @match        https://lzt.market/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492493/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/492493/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Стили для кнопки
    var buttonStyles = {
        background: 'rgb(39, 39, 39)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        margin: '5px',
        cursor: 'pointer'
    };

    // "bold" внутри "marketItemView--mainInfoContainer"
    jQuery('.marketItemView--mainInfoContainer .bold').each(function() {
        var elementText = jQuery(this).text(); // Получаем текст
        var copyButton = jQuery('<button>Копировать</button>').css(buttonStyles).click(function() {
            navigator.clipboard.writeText(elementText).then(function() {
                console.log('Текст скопирован: ' + elementText);
            }, function(err) {
                console.error('Ошибка при копировании текста: ', err);
            });
        });
        // Добавляем кнопку к текущему элементу
        jQuery(this).parent().append(copyButton);
    });
})();