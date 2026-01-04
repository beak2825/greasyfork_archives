// ==UserScript==
// @name userTaskQSOFTJS
// @description crossbrowser userscript
// @author spaik713
// @license MIT
// @version 2.0
// @include http://www.corp.qsoft.ru/bitrix/admin/oper_day.php*
// @resource    jqueryJS https://code.jquery.com/jquery-3.2.1.js
// @resource    bootstrapJS https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
// @resource    buttonCSS https://raw.githubusercontent.com/necolas/css3-github-buttons/master/gh-buttons.css
// @resource    bootstrapCSS https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @namespace https://greasyfork.org/ru/scripts/372565-usertaskqsoftjs
// @downloadURL https://update.greasyfork.org/scripts/372565/userTaskQSOFTJS.user.js
// @updateURL https://update.greasyfork.org/scripts/372565/userTaskQSOFTJS.meta.js
// ==/UserScript==

(function (window, undefined) {

    var w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }

    if (w.self != w.top) {
        return;
    }

    $("head").append("<script>" + GM_getResourceText("jqueryJS") + "</script>");
    $("head").append("<script>" + GM_getResourceText("bootstrapJS") + "</script>");
    $("head").append("<style>" + GM_getResourceText("bootstrapCSS") + "</style>");
    $('table').addClass('table');
    $('.stars').css({'font-weight': 'bold'});

    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute('type') === 'button' || inputs[i].getAttribute('type') === 'submit') {
            $(inputs[i]).addClass('btn');
            $(inputs[i]).css( 'cursor', 'pointer' );
        }
    }

    $(function () {
        var start, dinner, end;
        var date = new Date();
        var tasks = $('.curDayTable_input_box nobr');
        var additional = $(document.querySelectorAll('input[name^="additional_hour"]')).parent();
        $.each($('.curDayTable'), function ()
               {
            var input = $(this).children().children();

            if (input.attr('name') === 'start_hour') {
                start = $(input.parent()[0]);
            }

            if (input.attr('name') === 'dinner_hour') {
                dinner = $(input.parent()[0]);
            }

            if (input.attr('name') === 'end_hour') {
                end = $(input.parent()[0]);
            }
        });

        w.endTimeCalculation = function endTimeCalculation()
        {
            var additional = $(document.querySelectorAll('input[name^="additional_hour"]')).parent();
            date.setHours(0);
            date.setMinutes(0);

            date.setHours(
                isNaN(
                    parseInt($(start.children()[0]).val())
                )? 0 : parseInt($(start.children()[0]).val())
            );

            date.setMinutes(
                isNaN(
                    parseInt($(start.children()[1]).val())
                )? 0 : parseInt($(start.children()[1]).val())
            );

            $.each(additional, function () {
                var additionalHours = isNaN(
                    parseInt($($(this).children()[0]).val())
                )? 0 : parseInt($($(this).children()[0]).val());

                var additionalMinutes = isNaN(
                    parseInt($($(this).children()[1]).val())
                )? 0 : parseInt($($(this).children()[1]).val());

                date.setHours(
                    date.getHours() + additionalHours
                );
                date.setMinutes(
                    date.getMinutes() + additionalMinutes
                );
            });

            $.each(tasks, function () {
                var taskHours = isNaN(
                    parseInt($($(this).children()[0]).val())
                )? 0 : parseInt($($(this).children()[0]).val());

                var taskMinutes = isNaN(
                    parseInt($($(this).children()[1]).val())
                )? 0 : parseInt($($(this).children()[1]).val());

                date.setHours(
                    date.getHours() + taskHours
                );
                date.setMinutes(
                    date.getMinutes() + taskMinutes
                );
            });

            var dinnerHours = isNaN(
                parseInt($(dinner.children()[0]).val())
            )? 0 : parseInt($(dinner.children()[0]).val());

            var dinnerMinutes = isNaN(
                parseInt($(dinner.children()[1]).val())
            )? 0 : parseInt($(dinner.children()[1]).val());


            var startTime = new Date();
            startTime.setHours(date.getHours() - $(document.querySelectorAll('input[name^="start_hour"]')).val() * 1);
            startTime.setMinutes(date.getMinutes() - $(document.querySelectorAll('input[name^="start_minute"]')).val() * 1);
            startTime.setSeconds(0);

            var end_day = $('.qsoft_row_itog .end_day_curDay');
            end_day.text(startTime.getHours() + ':' + ((startTime.getMinutes() < 10) ? 0 : '') + startTime.getMinutes());


            date.setHours(
                date.getHours() + dinnerHours
            );
            date.setMinutes(
                date.getMinutes() + dinnerMinutes
            );

            $(end.children()[0]).attr('placeholder', date.getHours());
            var minutesStr = (date.getMinutes().toString().length === 1)? '0'+date.getMinutes() : date.getMinutes();
            $(end.children()[1]).attr('placeholder', minutesStr);

            $($('.end_day_curDay').next()[$('.end_day_curDay').next().length -1]).html();
        };

        function setOnChange()
        {
            $.each(start.children(), function(){
                $(this).attr('onkeyup', 'endTimeCalculation()');
            });

            $.each(dinner.children(), function(){
                $(this).attr('onkeyup', 'endTimeCalculation()');
            });

            $.each(tasks, function(){
                $.each($(this).children(), function() {
                    $(this).attr('onkeyup', 'endTimeCalculation()');
                });
            });

            $.each(additional, function(){
                $.each($(this).children(), function() {
                    $(this).attr('onkeyup', 'endTimeCalculation()');
                });
            });

            $('.additionTable.addNewRow input').attr('onmouseup', 'endTimeCalculation()');
        }

        endTimeCalculation();
        setOnChange();
        if(location.href.indexOf('group_by_sla') !== -1) {
            $('.qsoft_tmpl_work_area_oper_day form').attr('action', '/bitrix/admin/oper_day.php?group_by_sla');
        }

        //if ($('.qsoft_operday_error_box.qsoft_cmp_base_mr form').length === 0){
        //    $('.qsoft_cmp_base_mr.table').after('<div class="qsoft_operday_error_box qsoft_cmp_base_mr"><form action="/bitrix/admin/oper_day.php" method="POST"> Для продолжения работы с технической поддержкой необходимо открыть текущий операционный день, закрыв предыдущий открытый <input type="hidden" value="continue_work" name="action"><input type="submit" name="continue_work" value="Открыть доступ на 15 минут" class="btn" style="cursor: pointer;"></form></div>');
        //}

        $('#TASK_TABLE').parent('form').submit(function(e){
            var status = $('.qsoft_status_selector');
            status.each(function(id, el){
                 if($(el).text().trim() == 'Не установлен'){
                     if($('#qsoft_error_status').length <= 0){
                        $(document.querySelectorAll('input[name^="action"]')).parent().append('<p id="qsoft_error_status" class="qsoft_operday_error_box">Установите все статусы</p>');
                     }

                     e.preventDefault();
                     return;
                 }
            });

        });

    });
})(window);;
