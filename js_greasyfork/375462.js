// ==UserScript==
// @name         [olymptrade.com] Горячие клавиши
// @namespace    olymptrade.com.hotkeys
// @version      0.2
// @description  Горячие клавиши
// @author       tuxuuman<vk.com/tuxuuman, tuxuuman@gmail.com>
// @match        https://olymptrade.com/platform*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375462/%5Bolymptradecom%5D%20%D0%93%D0%BE%D1%80%D1%8F%D1%87%D0%B8%D0%B5%20%D0%BA%D0%BB%D0%B0%D0%B2%D0%B8%D1%88%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/375462/%5Bolymptradecom%5D%20%D0%93%D0%BE%D1%80%D1%8F%D1%87%D0%B8%D0%B5%20%D0%BA%D0%BB%D0%B0%D0%B2%D0%B8%D1%88%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).on('keyup', function(e) {
        
        switch(e.keyCode) {
            /*
            тут цифрами указаны коды клавиш. посмотреть все коды можно тут http://filesd.net/kibor/codekeys.php. 
            нужен десятичный числовой код. он указан в среднем столбике таблицы
            */
            case 103: // уменьшить время
                $('button[data-test="deal-select-duration-down"]').click();
                break;
                
            case 105: // увеличить время
                $('button[data-test="deal-select-duration-up"]').click();
                break;
                
                
            case 100: // уменьшить сумму
                $('button[data-test="deal-select-amount-down"]').click();
                break;
                
            case 102: // увеличить сумму
                $('button[data-test="deal-select-amount-up"]').click();
                break;
                
                
            case 97: // сделка вверх
                $('button[data-test="deal-button-down"]').click();
                break;

            case 99: // сделка вниз
                $('button[data-test="deal-button-up"]').click();
                break; 
                
            case 104: // продать верхний актив
                $('.time-deals span.user-deals-table__cell-content form div.btn').first().click();
                break;
                
            case 98: // продать нижний актив
                $('.time-deals span.user-deals-table__cell-content form div.btn').last().click();
                break;
        }
        
    });
})();