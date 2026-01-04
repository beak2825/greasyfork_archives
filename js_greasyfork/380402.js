// ==UserScript==
// @name         Random generator
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Change random number
// @author       You
// @match        https://randstuff.ru/number/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380402/Random%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/380402/Random%20generator.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    $('#button.number').unbind('click');
    // Сгенерировать число
    $('#button.number').click(function() {




         /*************************************
         **************************************
         * Вот здесь вписать необхдимое число после равно ("var my_number = ....")
         *     ||
         *    \\//
         *     \/

        *////////////////////////////////////
        var my_number = 10 ;               /*
        /////////////////////////////////////

         *     /\
         *    //\\
         *     ||
         * Затем нажать "Файл"->"сохранить". После закрыть эту страницу и загрузить по новой сайт https://randstuff.ru/number/
        *************************************
        *************************************/




        var caption = $('#caption');
        var container = $('#number');
        var save = $('#number-save');

        var count = ($('#slider').length) ? $('#slider').slider('value') : 1;
        var from = $('#number-from input[name="from"]:checked').val();
        var start = $('#number-start').val();
        var end = $('#number-end').val();
        var list = $('#number-list').val();
        var unique = $('#number-unique input').is(':checked') ? 1 : 0;
        var tz = new Date().getTimezoneOffset();
        var data = {number:my_number};
        //console.dir([data, caption.data('txt')]);
        caption.text(caption.data('txt'));
        container.attr('class', 'single');

        var number = String(data.number);
        number.split('');

        var html = '<span class="new">';
        for (let i = 0; i < number.length; i ++) {
            html += '<span>' + number.charAt(i) + '</span>';
        }
        html += '</span>';

        container.find('.new').attr('class', 'cur');
        container.find('.cur').remove();
        container.append(html);

        let i = 1;
        container.find('.new span').each(function() {
            $(this)
                .delay(parseInt(200/number.length)*(i ++))
                .animate({'bottom': 0}, 200, 'easeOutQuint');
        });

        save.html('<span>' + save.data('txt') + '</span>');
        $('#pay-dialog').find('.save-link')
            .attr('href', 'https://randstuff.ru/number/' + data.save + '/')
            .text('https://randstuff.ru/number/' + data.save + '/');

        $('#pay-dialog').find('form').attr('action', '/number/' + data.save + '/');

    });

    // Your code here...
})(jQuery);