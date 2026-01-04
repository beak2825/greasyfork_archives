// ==UserScript==
// @name           Virtonomica.инфо: групповые операции
// @description    Позволяет устанавливать параметры сбыта для группы предприятий
// @namespace      virtonomica
// @version        2.14
// @grant          none
// @include        *virtonomic*.*/*/main/company/view/*/unit_list
// @include        *virtonomic*.*/*/main/unit/view/*/trading_hall
// @include        *virtonomic*.*/*/main/unit/view/*/sale
// @include        *virtonomic*.*/*/main/unit/view/*/
// @include        *virtonomic*.*/*/window/unit/upgrade/*
// @include        *virtonomic*.*/*/window/unit/produce_change/*
// @include        *virtonomic*.*/*/window/unit/close/*
// @include        *virtonomic*.*/*/window/unit/market/sale/*
// @include        *virtonomic*.*/*/window/unit/view/*/virtasement
// @include        *virtonomic*.*/*/window/unit/changename/*
// @include        *virtonomic*.*/*/window/unit/view/*/project_create
// @include        *virtonomic*.*/*/window/unit/view/*/project_continue
// @include        *virtonomic*.*/*/window/unit/view/*/investigation
// @include        *virtonomic*.*/*/window/unit/view/*/set_experemental_unit
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
// @require        https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/34928/Virtonomica%D0%B8%D0%BD%D1%84%D0%BE%3A%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/34928/Virtonomica%D0%B8%D0%BD%D1%84%D0%BE%3A%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

var run = function(type) {

    var arr = [];
    if (type != 'main' && !isGroup()) {return;}
    var realm = readCookie('last_realm');
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
    }

    function isGroup() {
        var a = readCookie('units');
        setCookie('units', 0, -1);
        if (a === null) return false;
        arr = a.split(',');
        if (arr.length === 0) return false;
        return true;
    }

    function serialize() {
        arr.length = 0;
        $('.ui-selected > .info > a').each(function() {arr.push(/\d+$/.exec($(this).attr('href'))[0]);});

        if (arr.length === 0) {return;}

        setCookie('units', arr.join(','));
        return arr[0];
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
        setCookie('last_url', location.href);
        var sci_level = -1;
        function get_sci(){return sci_level;}

        var style = document.createElement("style");
        style.type = 'text/css';
        style.textContent = '.ui-selected td { background-color: #fbec88 !important; } .ui-selecting td { background-color: #fef7e2 !important;  }';
        document.getElementsByTagName("head")[0].appendChild(style);

        var path = /\/(.+?)\//.exec(location.pathname);
        var artButton =  $('<button class="group-button" disabled value="/'+path[1]+'/main/unit/view/%id%/">Инновации</button>').click(redirect);
        var specButton = $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/produce_change/%id%">Специализация</button>').click(redirect);
        var saleButton = $('<button class="group-button" disabled value="/'+path[1]+'/main/unit/view/%id%/sale">Параметры сбыта</button>').click(redirect);
        var sizeButton = $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/upgrade/%id%">Размер</button>').click(redirect);
        var boomButton = $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/close/%id%">Ликвидация предприятий</button>').click(redirect);
        var mrktButton = $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/market/sale/%id%">Продать</button>').click(redirect);
        var advButton =  $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/view/%id%/virtasement">Реклама</button>').click(redirect);
        var renButton =  $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/changename/%id%">Переименовать</button>').click(redirect);
        var sciButton =  $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/view/%id%/%fn%">Исследования</button>').click(redirect);
        var stopButton = $('<button class="group-button" disabled value="/'+path[1]+'/window/unit/view/%id%/project_current_stop">Остановить исследования</button>').click(sci_stop);

        var panel = $('<fieldset><legend>Групповые операции</legend></fieldset>');
        panel.append(artButton).append(specButton).append(saleButton).append(sizeButton).append(boomButton).append(mrktButton).append(advButton).append(renButton).append(sciButton).append(stopButton);
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
                    //console.log('sci[1]='+sci[1]+';sci[2]='+sci[2]+';sci[3]='+sci[3]+';sci[4]='+sci[4]);
                    sci_level = (typeof(sci[3]) != 'undefined')?sci[3]:'0';
                }
            },

            unselected: function(event, ui) {
                if ($('.ui-selected').length === 0) {$('.group-button').attr('disabled', true);}
                if ($('.info.i-lab',ui.selected).length !== 0){ // Для лабораторий
                    //console.log(ui.unselected);
                }
            }
        });

        $('table.unit-list-2014 ' + selector).dblclick(function() {
            var t = $($('td', this)[1]).attr('title');
            $('table.unit-list-2014 tr:has(td[title="' + t + '"]):visible').addClass('ui-selected');
            return false;
        });

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

    function doit(params, url, data) {
        if (data === undefined) data = '';

        try {

            $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
            $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-curr"></span>/' + arr.length + '</div>').width($(window).width()).prependTo('body');

            var num = 0, handle = function() {
                if (num >= arr.length) {
                    $('#js-progress').remove();
                    $('#js-wall').remove();
                    var back_url = readCookie('last_url');
                    console.log(back_url);
                    alert('Операция выполнена для предприятий: ' + num);
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
        var button = $('input[value="Сохранить изменения"]');
        button.unbind().click(function() {
            var name = button.attr('name');
            var val = button.attr('value');
            var save = '';
            if (name !== undefined) save = '&'+name+'='+val;
            var data = button.parents('form').serialize()+save;
            doit({type: 'POST'}, '/' + realm + '/main/unit/view/%id%/sale', data);
            return false;
        });
    }

    function art() {
        window.attachArtefact = function(artefact_id, slot_id, N) {
            N = unescape(N);
            if (confirm(N + "\n\nВнимание! Артефакт будет установлен на предприятий! Вы хотите продолжить?")) {
                doit({dataType: 'json', cache: false},
                     '/' + realm + '/ajax/unit/artefact/attach/', //https://virtonomica.ru
                     'unit_id=%id%&artefact_id=' + artefact_id + '&slot_id=' + slot_id);
            }
            return false;
        };
    }

    function size() {
        $('form:first').submit(function() {
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/upgrade/%id%', data);
            return false;
        });
    }

    function specialty() {
        $('form:first').submit(function() {
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/produce_change/%id%', data);
            return false;
        });
    }

    function boom() {
        $('form:first').attr('onsubmit', '');
        $('form:first').unbind().submit(function() {
            if (confirm("Внимание! Будет взорвано предприятий! Вы хотите продолжить?")) {
                doit({type: 'POST'}, '/' + realm + '/window/unit/close/%id%', {close_unit: 'Закрыть предприятие'});
            }
            return false;
        });
    }

    function market() {
        $('form:first').submit(function() {
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/market/sale/%id%', data);
            return false;
        });
    }

    function adv() {
        //        $('form:first').submit(function() {
        $('.button250').unbind().click(function(){
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/view/%id%/virtasement', data+"&"+$('.button250').attr('name')+"="+$('.button250').attr('value'));
            return false;
        });
        $('.button280').unbind().click(function(){
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/view/%id%/virtasement', data+"&"+$('.button280').attr('name')+"="+$('.button280').attr('value'));
            return false;
        });
    }

    function ren() {
        $('form:first').submit(function() {
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/changename/%id%', data);
            return false;
        });
    }

    function sci() {
        $('form').each(function(){$(this).submit(function() {
            var action = $(this).attr('action');
            var button = $('input[type="submit"]',this);
            var name = button.attr('name');
            var val = button.attr('value');
            var save = (name !== undefined)?'&'+name+'='+val:'';
            var data = $(this).serialize()+ save;
            doit({type: 'POST'}, action, data);
            return false;
        });});
    }

    function sci_stop(){
        serialize();
        var url = $(this).attr('value');
        console.log('l='+arr.length+'; url='+url);
        doit({type: 'POST'}, url);
        return false;
    }
};

var handlers = [
    {regex: /main\/company\/view\/(\d+)\/unit_list$/, handler: 'main'},
    {regex: /main\/unit\/view\/\d+\/sale$/, handler: 'sale'},
    {regex: /main\/unit\/view\/\d+\/$/, handler: 'art'},
    {regex: /window\/unit\/upgrade\/\d+$/, handler: 'size'},
    {regex: /window\/unit\/produce_change\/\d+$/, handler: 'specialty'},
    {regex: /window\/unit\/close\/\d+$/, handler: 'boom'},
    {regex: /window\/unit\/market\/sale\/\d+$/, handler: 'market'},
    {regex: /window\/unit\/view\/\d+\/virtasement$/, handler: 'adv'},
    {regex: /window\/unit\/changename\/\d+$/, handler: 'ren'},
    {regex: /window\/unit\/view\/\d+\/project_create$/, handler: 'sci'},
    {regex: /window\/unit\/view\/\d+\/investigation$/, handler: 'sci'},
    {regex: /window\/unit\/view\/\d+\/set_experemental_unit$/, handler: 'sci'}
];

for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].regex.test(location.href)) {

        // Хак, что бы получить полноценный доступ к DOM >:]
        var script = document.createElement("script");
        script.textContent = '(' + run.toString() + ')("' + handlers[i].handler + '");';
        document.getElementsByTagName("head")[0].appendChild(script);
        break;
    }
}
