// ==UserScript==
// @name           Virtonomica.инфо: групповые операции
// @description    Позволяет устанавливать параметры сбыта для группы предприятий, patched after new interface
// @namespace      virtonomica
// @version        2.24
// @grant          none
// @include        *virtonomic*.*/*/main/company/view/*/unit_list*
// @include        *virtonomic*.*/*/main/unit/view/*/trading_hall
// @include        *virtonomic*.*/*/main/unit/view/*/sale
// @include        *virtonomic*.*/*/main/unit/view/*/
// @include        *virtonomic*.*/*/window/unit/upgrade/*
// @include        *virtonomic*.*/*/window/unit/produce_change/*
// @include        *virtonomic*.*/*/window/unit/close/*
// @include        *virtonomic*.*/*/window/unit/market/sale/*
// @include        *virtonomic*.*/*/window/unit/market/cansel_sale/*
// @include        *virtonomic*.*/*/window/unit/view/*/virtasement
// @include        *virtonomic*.*/*/window/unit/changename/*
// @include        *virtonomic*.*/*/window/unit/view/*/project_create
// @include        *virtonomic*.*/*/window/unit/view/*/project_continue
// @include        *virtonomic*.*/*/window/unit/view/*/investigation
// @include        *virtonomic*.*/*/window/unit/view/*/set_experemental_unit
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require        https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @author         ctsigma
// @downloadURL https://update.greasyfork.org/scripts/387589/Virtonomica%D0%B8%D0%BD%D1%84%D0%BE%3A%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/387589/Virtonomica%D0%B8%D0%BD%D1%84%D0%BE%3A%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

var run = function(type) {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    var arr = [];
    if (type != 'main' && !isGroup()) {return;}
    switch (type) {
        case 'main': main(); break;
        case 'sale': sale(); break;
        case 'art': art(); break;
        case 'size': size(); break;
        case 'specialty': specialty(); break;
        case 'boom': boom(); break;
        case 'market': market(); break;
        case 'adv' : adv(); break;
        case 'ren' : ren();break;
        case 'sci' : sci();break;
        case 'sci_inv' : sci_inv();break;
    }

    function isGroup() {
        //var a = readCookie('units');
        //setCookie('units', 0, -1);
        var a = sessionStorage.getItem('units');
        if (a === null) return false;
        arr = a.split(',');
        if (arr.length === 0) return false;
        return true;
    }

    function serialize() {
        arr.length = 0;
        $('.ui-selected > .info > a').each(function() {
            //arr.push(/\d+$/.exec($(this).attr('href'))[0]);
            arr.push(/(\d+)(\?old)?$/.exec($(this).attr('href'))[1]);
        });

        if (arr.length === 0) {return;}

        //setCookie('units', arr.join(','));
        sessionStorage.setItem('units', arr.join(','));
        return arr[0];
    }

    function on_holidays(){
        var sel_on_holidays = $('.ui-selected .prod img[src*="workers_in_holiday"]').length;
        var sel_total = $('.ui-selected .prod').length;
        return (sel_on_holidays != 0 && sel_total != 0)?true:false;
    }

    function clone (o) {
        if (!o || 'object' !== typeof o) {return o;}
        var c = 'function' === typeof o.pop ? [] : {};
        var p, v;
        for (p in o) {
            if (o.hasOwnProperty(p)) {
                v = o[p];
                if (v && 'object' === typeof v) {
                    c[p] = clone(v);
                }
                else {
                    c[p] = v;
                }
            }
        }
        return c;
    }

    function main() {
        sessionStorage.setItem('last_url', location.href);
        var sci_level = -1;
        function get_sci(){return sci_level;}

        var style = document.createElement("style");
        style.type = 'text/css';
        style.textContent = '.ui-selected td { background-color: #fbec88 !important; } .ui-selecting td { background-color: #fef7e2 !important;  }';
        document.getElementsByTagName("head")[0].appendChild(style);

        var path = /\/(.+?)\//.exec(location.pathname);
        var artButton =  $('<button id = "artf" class="group-button" disabled value="/'+path[1]+'/main/unit/view/%id%/">Инновации</button>').click(redirect);
        var specButton = $('<button id = "spec" class="group-button" disabled value="/'+path[1]+'/window/unit/produce_change/%id%">Специализация</button>').click(redirect);
        var saleButton = $('<button id = "sale" class="group-button" disabled value="/'+path[1]+'/main/unit/view/%id%/sale">Параметры сбыта</button>').click(redirect);
        var sizeButton = $('<button id = "size" class="group-button" disabled value="/'+path[1]+'/window/unit/upgrade/%id%">Размер</button>').click(redirect);
        var boomButton = $('<button id = "boom" class="group-button" disabled value="/'+path[1]+'/window/unit/close/%id%">Ликвидация предприятий</button>').click(redirect);
        var mrktButton = $('<button id = "mrkt" class="group-button" disabled value="/'+path[1]+'/window/unit/market/sale/%id%">Продать</button>').click(redirect);
        var cnslButton = $('<button id = "mrkt" class="group-button" disabled value="/'+path[1]+'/main/unit/market/cancel_sale/%id%">Отменить продажу</button>').click(cansel_market);
        var advButton =  $('<button id = "advr" class="group-button" disabled value="/'+path[1]+'/window/unit/view/%id%/virtasement">Реклама</button>').click(redirect);
        var renButton =  $('<button id = "renm" class="group-button" disabled value="/'+path[1]+'/window/unit/changename/%id%">Переименовать</button>').click(redirect);
        var sciButton =  $('<button id = "scis" class="group-button" disabled value="/'+path[1]+'/window/unit/view/%id%/%fn%">Исследования</button>').click(redirect);
        var stopButton = $('<button id = "stop" class="group-button" disabled value="/'+path[1]+'/window/unit/view/%id%/%fn%">Остановить исследования</button>').click(sci_stop);
        var vctnButton = $('<button id = "vctn" class="group-button" disabled value="/'+path[1]+'/window/unit/view/%id%/%fn%">Отправить в отпуск</button>').click(vacations);

        var panel = $('<fieldset><legend>Групповые операции</legend></fieldset>');
        panel.append(artButton).append(specButton).append(saleButton).append(sizeButton).append(boomButton).append(mrktButton).append(cnslButton).append(advButton).append(renButton).append(sciButton).append(stopButton).append(vctnButton);
        $('.unit-list-2014').after(panel);

        var selector = 'tr:has(.unit_id):visible';
        $('table.unit-list-2014>tbody').selectable({
            filter: selector,
            tolerance: 'touch',
            cancel: ':input,option,a',
            selected: function(event, ui) {
                $('.group-button').removeAttr('disabled');
                if ($('.info.i-lab',ui.selected).length !== 0){ // Для лабораторий
                    var sci = /(\d+\.*\d*)%\s?(\d+)?\.?(\d+)?\s?(.+)?/.exec($('td[class="spec"]',ui.selected).text().trim());
                    sci_level = (typeof(sci[3]) != 'undefined')?sci[3]:'0';
                }
                $('#vctn').text( (on_holidays() === true)?'Вернуть из отпуска':'Отправить в отпуск' );
            },

            unselected: function(event, ui) {
                if ($('.ui-selected').length === 0) {$('.group-button').attr('disabled', true);}
                if ($('.info.i-lab',ui.selected).length !== 0){ // Для лабораторий
                }
                $('#vctn').text( (on_holidays() === true)?'Вернуть из отпуска':'Отправить в отпуск' );
            }
        });

        var func = function(o){
            var t = $('.geo', $(o).parent()).attr('title');
            $('table.unit-list-2014>tbody .geo[title="' + t + '"]:visible').parent().addClass('ui-selected');
            return false;
        };

        $('table.unit-list-2014 ' + selector + ' td').each(function(){$(this).dblclick(function() {func(this);});});

        var func_spec = function(o){
            var lab = false;
            $('.info.i-lab', $(o).parent()).each(function(){lab = true;});
            if (!lab) {func(o);return false;}
            var sci = /(\d+\.*\d*)%\s?(\d+)?\.?(\d+)?\s?(.+)?/.exec($(o).text().trim());
            var l = '';
            $('table.unit-list-2014>tbody .spec:visible').each(function(){
                l = /(\d+\.*\d*)%\s?(\d+)?\.?(\d+)?\s?(.+)?/.exec($(this).text().trim());
                if (l[1]==sci[1]&&l[3]==sci[3]) $(this).parent().addClass('ui-selected'); // сверка по %% завершения и стадии исследования
            });
            return false;
        };
        $('table.unit-list-2014 ' + selector + ' .spec').each(function(){$(this).unbind('dblclick').dblclick(function() {func_spec(this);});});

        var func_size = function(o){
            var t = $(o).text().replace(/\s+/g,'');
            var l = '';
            $('table.unit-list-2014>tbody .unitsize:visible').each(function(){
                l = $(this).text().replace(/\s+/g,'');
                if (l==t) $(this).parent().addClass('ui-selected');
            })
            return false;
        }
        $('table.unit-list-2014 ' + selector + ' .spec').prev().each(function(){$(this).attr('class','unitsize').unbind('dblclick').dblclick(function() {func_size(this);});});

        function redirect() {
            try {
                var fn = '';
                switch(get_sci()){
                    case '0':fn='project_create';break; //project_continue
                    case '1':fn='investigation';break;
                    case '2':fn='investigation';break;
                    case '3':fn='set_experemental_unit';break;
                }
                var url = $(this).val().replace('%id%', serialize()).replace('%fn%',fn);
                window.location = url;

            }
            catch (ex) {alert('Error: ' + ex);}
            return false;
        }

    }

    function doit(params, url, data, text, transformation) {
        if (data === undefined) data = '';
        if (text === undefined) text = '';

        try {
            $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
            $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-curr"></span>/' + arr.length + '</div>').width($(window).width()).prependTo('body');

            var num = 0, handle = function() {
                if (num >= arr.length) {
                    $('#js-progress').remove();
                    $('#js-wall').remove();
                    var back_url = sessionStorage.getItem('last_url');
                    alert('Операция '+text+'выполнена для предприятий: ' + num);
                    if (back_url === null) history.back();
                    else window.location.replace(back_url);
                    return;
                }

                $('#js-curr').text(num);

                var id = arr[num];
                var ajax = clone(params);
                ajax.url = url.replace('%id%', id);
                if (typeof data == 'string') {
                    ajax.data = data.replace('%id%', id);
                } else {
                    ajax.data = data;
                }
                if (typeof transformation === 'function') ajax.data = transformation(ajax.data,ajax.url);
                ajax.success = handle;
                ajax.error = function() {
                    alert('Ошибка!');
                    $('#js-progress').remove();
                    $('#js-wall').remove();
                };
                num++;
                $.ajax(ajax);
            };

            handle();

        } catch(ex) {
            alert(ex);
        }

    }

    function sale() {
        $('form').each(function(){
            $(this).unbind().submit(function() {
                var action = $(this).attr('action').replace(/\d+/,'%id%');
                var button = $('input[type="submit"]',this);
                var name = button.attr('name');
                var val = button.attr('value');
                var save = (name !== undefined)?'&'+name+'='+val:'';
                var data = $(this).serialize()+ save;
                doit({type: 'POST'}, action, data);
                return false;
            });
        });
    }

    function art() {
        window.attachArtefact = function(artefact_id, slot_id, N) {
            N = unescape(N);
            if (confirm(N + "\n\nВнимание! Артефакт будет установлен на " + arr.length + " предприятий! Вы хотите продолжить?")) {
                var realm = readCookie('last_realm');
                doit({dataType: 'json', cache: false},
                     '/' + realm + '/ajax/unit/artefact/attach/', //https://virtonomica.ru
                     'unit_id=%id%&artefact_id=' + artefact_id + '&slot_id=' + slot_id);
            }
            return false;
        };
        window.removeArtefact = function(artefact_id, slot_id) {
            if (confirm("\n\nВнимание! Артефакт будет отключен на " + arr.length + " предприятий! Вы хотите продолжить?")) {
                var realm = readCookie('last_realm');
                doit({dataType: 'json', cache: false},
                     '/' + realm + '/ajax/unit/artefact/remove/', //https://virtonomica.ru
                     'unit_id=%id%&artefact_id=' + artefact_id + '&slot_id=' + slot_id);
            }
            return false;
        };
    }

    function size() {
        $('form').each(function(){
            $(this).unbind().submit(function() {
                var action = $(this).attr('action').replace(/\d+/,'%id%');
                var button = $('input[type="submit"]',this);
                var name = button.attr('name');
                var val = button.attr('value');
                var save = (name !== undefined)?'&'+name+'='+val:'';
                var data = $(this).serialize()+ save;
                doit({type: 'POST'}, action, data);
                return false;
            });
        });
    }

    function specialty() {
        $('form').each(function(){
            $(this).unbind().submit(function() {
                var action = $(this).attr('action').replace(/\d+/,'%id%');
                var button = $('input[type="submit"]',this);
                var name = button.attr('name');
                var val = button.attr('value');
                var save = (name !== undefined)?'&'+name+'='+val:'';
                var data = $(this).serialize()+ save;
                doit({type: 'POST'}, action, data);
                return false;
            });
        });
    }

    function boom() {
        $('form').each(function(){
            $(this).attr('onsubmit', '');
            $(this).unbind().submit(function() {
                var action = $(this).attr('action').replace(/\d+/,'%id%');
                var button = $('input[type="submit"]',this);
                var name = button.attr('name');
                var val = button.attr('value');
                var save = (name !== undefined)?'&'+name+'='+val:'';
                var data = $(this).serialize()+ save;
                if (confirm("Внимание! Будет взорвано " + arr.length + " предприятий! Вы хотите продолжить?")) {
                    doit({type: 'POST'}, action, data);
                }
                return false;
            });
        });
    }

    function market() {
        $('form').each(function(){
            $(this).unbind().submit(function() {
                var action = $(this).attr('action').replace(/\d+/,'%id%');
                var button = $('input[type="submit"]',this);
                var name = button.attr('name');
                var val = button.attr('value');
                var save = (name !== undefined)?'&'+name+'='+val:'';
                var data = $(this).serialize()+ save;
                doit({type: 'POST'}, action, data);
                return false;
            });
        });
    }

    function cansel_market() {
        serialize();
        var url = $(this).attr('value');
        doit({type: 'GET'}, url,'','"Отменить продажу предприятий" ');
        return false;
    }

    function adv() {
        $('form').each(function(){
            var form = $(this);
            var action = form.attr('action').replace(/\d+/,'%id%');
            form.unbind().submit(function() {return false;});
            $('input[type="submit"]',form).each(function(){
                var button = $(this);
                button.unbind().click(function(){
                    var name = button.attr('name');
                    var val = button.attr('value');
                    var save = (name !== undefined)?'&'+name+'='+val:'';
                    var data = form.serialize()+ save;
                    doit({type: 'POST'}, action, data);
                    return false;
                });
            });
        });
    }

    function ren() {
        $('form').each(function(){
            $(this).unbind().submit(function() {
                var action = $(this).attr('action').replace(/\d+/,'%id%');
                var button = $('input[type="submit"]',this);
                var name = button.attr('name');
                var val = button.attr('value');
                var save = (name !== undefined)?'&'+name+'='+val:'';
                var data = $(this).serialize()+ save;
                doit({type: 'POST'}, action, data);
                return false;
            });
        });
    }

    function sci() {
        $('form').each(function(){$(this).unbind().submit(function() {
            var action = $(this).attr('action').replace(/\d+/,'%id%');
            var button = $('input[type="submit"]',this);
            var name = button.attr('name');
            var val = button.attr('value');
            var save = (name !== undefined)?'&'+name+'='+val:'';
            var data = $(this).serialize()+ save;
            doit({type: 'POST'}, action, data);
            return false;
        });});
    }

    function sci_inv() {
        $('form').each(function(){$(this).unbind().submit(function() {
            var action = $(this).attr('action').replace(/\d+/,'%id%');
            var button = $('input[type="submit"]',this);
            var name = button.attr('name');
            var val = button.attr('value');
            var save = (name !== undefined)?'&'+name+'='+val:'';
            var data = $(this).serialize()+ save;
            var i=0;
            $('tr input[name="selectedHypotesis"]',this).each(function(){
                if ($(this).prop('checked')) return false;
                i++;
            });
            var fn = function(data,url){
                var hypotesis = '';
                $.ajax({
                    type:"GET",
                    async: false,
                    url:url,
                    success:function(data){
                        hypotesis = $('form[action="'+url+'"] input[name="selectedHypotesis"]:eq('+i+')',data).val();
                    }
                });
                if (hypotesis.length > 0) data = data.replace(/\d+/,hypotesis);
                return data;
            };
            doit({type: 'POST'}, action, data,'',fn);
            return false;
        });});
    }

    function sci_stop(){
        serialize();
        var url = $(this).attr('value').replace('%fn%','project_current_stop');
        doit({type: 'POST'}, url,'','"остановка исследования" ');
        url = $(this).attr('value').replace('%fn%','holiday_set');
        doit({type: 'GET'}, url,'','"отпуск" ');
        return false;
    }

    function vacations(){
        serialize();
        var url = $(this).attr('value').replace('%fn%',(on_holidays() === true)?'holiday_unset':'holiday_set');
        doit({type: 'POST'}, url);
    }
};

var handlers = [
    {regex: /main\/company\/view\/(\d+)\/unit_list(.*)$/, handler: 'main'},
    {regex: /main\/unit\/view\/\d+\/sale$/, handler: 'sale'},
    {regex: /main\/unit\/view\/\d+\/$/, handler: 'art'},
    {regex: /window\/unit\/upgrade\/\d+$/, handler: 'size'},
    {regex: /window\/unit\/produce_change\/\d+$/, handler: 'specialty'},
    {regex: /window\/unit\/close\/\d+$/, handler: 'boom'},
    {regex: /window\/unit\/market\/sale\/\d+$/, handler: 'market'},
    {regex: /window\/unit\/market\/cancel_sale\/\d+$/, handler: 'cansel_market'},
    {regex: /window\/unit\/view\/\d+\/virtasement$/, handler: 'adv'},
    {regex: /window\/unit\/changename\/\d+$/, handler: 'ren'},
    {regex: /window\/unit\/view\/\d+\/project_create$/, handler: 'sci'},
    {regex: /window\/unit\/view\/\d+\/investigation$/, handler: 'sci_inv'},
    {regex: /window\/unit\/view\/\d+\/set_experemental_unit$/, handler: 'sci'}
];
for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].regex.test(location.href)) {
        // Хак, что бы получить полноценный доступ к DOM >:]
        var script = document.createElement("script");
        script.textContent = '(' + run.toString() + ')("' + handlers[i].handler + '");';
        document.getElementsByTagName("body")[0].appendChild(script);
        break;
    }
}
