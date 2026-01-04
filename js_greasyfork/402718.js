// ==UserScript==
// @name		Текст ответа для Розетки
// @namespace	sellerrozetka
// @description	Вставляет шаблон ответа покупателю в переписку.
// @author		Bogdan Gerasymenko
// @license		MIT
// @version		1.12
// @include		https://seller.rozetka.com.ua/main/messages/orders/chat/*
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402718/%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%BE%D0%B7%D0%B5%D1%82%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/402718/%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%BE%D0%B7%D0%B5%D1%82%D0%BA%D0%B8.meta.js
// ==/UserScript==

GM_addStyle ( `
    .rz_panel {
        position: fixed;
        bottom: 0;
        left: 0;
        background: #ffffffeb;
        z-index: 1;
        width: 100%;
        padding: 30px;
    }
    #ins {
        background: #00a046;
        color: white;
        padding: 10px 20px;
        display: inline-block;
        text-decoration: none;
        cursor: pointer;
    }
` );

(function () {
    'use strict';

    var message = "Добрий день!\n\nМи не змогли дозвонитися Вам. Будь-ласка, зв'яжіться з нами для уточнення деталей замовлення::\n\n+38 066 201-35-46 (Viber)\n+38 097 273-65-51\n\nЧекаємо на Вашу відповідь у робочий час з 9:00 до 18:00 (Пн-Сб).";
    var panel = '<div class="rz_panel"><a id="ins">Перезвоните</a></div>';

    $( "body" ).append(panel);
    $( "#ins" ).on( "click", function() {
        $( ".rz-sellermessage-showmessage-form-texarea-messages" ).val(message);
    });

})();