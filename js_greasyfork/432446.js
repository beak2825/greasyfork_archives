// ==UserScript==
// @name         auto-write-push
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto write push
// @author       CleverMan
// @match        *://dispatcher.dostavista.ru/dispatcher/orders/tab-messages/*
// @icon         https://www.google.com/s2/favicons?domain=dostavista.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432446/auto-write-push.user.js
// @updateURL https://update.greasyfork.org/scripts/432446/auto-write-push.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title_order = document.querySelector('.title');
    var title_left = title_order.querySelector('h1');
    var region = title_left.getElementsByTagName('span')[1].innerText;

    if (region == 'Москва'){
        Write_text(`Пожалуйста, нажмите кнопку "выехать". Иначе, будете сняты с смены со штрафом. Кнопку необходимо нажимать в течение 5 минут.`);

    }
    else if (region == 'Санкт-Петербург') {
        Write_text(`Пожалуйста, нажмите кнопку "выехать". Иначе, будете сняты с смены со штрафом. Кнопку необходимо нажимать в течение 4 минут.`);
    }

    function Write_text(text_message) {
        document.getElementsByName('messageCourier')[0].innerHTML = `${text_message}`;
    }
})();