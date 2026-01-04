// ==UserScript==
// @name Testing survey
// @description:ru Заполнение больших таблиц
// @namespace http://www.maronline.ru
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include *.maronline.ru/*
// @version 0.0.2
// @description Заполнение больших таблиц
// @downloadURL https://update.greasyfork.org/scripts/31826/Testing%20survey.user.js
// @updateURL https://update.greasyfork.org/scripts/31826/Testing%20survey.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var checkbox = document.createElement('input');
    $(checkbox).attr('type', 'checkbox').addClass('testing');
    $('body').append('<font color=red>&nbsp;События не отслеживаются!</font><br>').append(checkbox);
    $(checkbox).after('<label for="testing_checkbox_radio" id="testing_checkbox_radio_label">&nbsp;Отметить все чекбоксы и радио кнопки</label>');

    var input = document.createElement('input');
    $(input).attr('type', 'text').addClass('testing').attr('size', '10');
    $('#testing_checkbox_radio_label').after(input).after('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    $(input).after('<span id="testing_input_textarea_span">&nbsp;Ввести во все инпуты</span>');

    var select = document.createElement('input');
    $(select).attr('type', 'text').addClass('testing').attr('size', '5');
    $('#testing_input_textarea_span').after(select).after('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    $(select).after('&nbsp;Выбрать во всех селектах');

    $(checkbox).on('click', function(){
        if ($(this).prop('checked')){
            $('[type="checkbox"],[type="radio"]:visible').not('.testing').prop('checked', true);
        }else{
            $('[type="checkbox"],[type="radio"]:visible').not('.testing').prop('checked', false);
        }
    });

    $(input).on('keyup', function(){
        if ($(this).val() != ''){
            $('[type="text"]:visible, textarea:visible').not('.testing').val($(this).val());
        }else{
            $('[type="text"]:visible, textarea:visible').not('.testing').val('');
        }
    });

    $(select).on('keyup', function(){
        if ($(this).val() != ''){
            $('select:visible').val(+$(this).val());
        }else{
            $('select:visible').val('');
        }
    });
})();