// ==UserScript==
// @name           Virtonomica: Групповые операции V2
// @description    Позволяет устанавливать параметры сбыта для группы предприятий
// @namespace      virtonomica
// @version        2.14
// @grant          none
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list*
// @include        http*://virtonomic*.*/*/main/unit/view/*/trading_hall*
// @include        http*://virtonomic*.*/*/main/unit/view/*/sale
// @include        http*://virtonomic*.*/*/main/unit/view/*/
// @include        http*://virtonomic*.*/*/window/unit/upgrade/*
// @include        http*://virtonomic*.*/*/window/unit/produce_change/*
// @include        http*://virtonomic*.*/*/window/unit/close/*
// @include        http*://virtonomic*.*/*/window/unit/market/sale/*
// @include        http*://virtonomic*.*/*/window/unit/market/buy/*
// @include        http*://virtonomic*.*/*/window/unit/view/*/virtasement*
// @include        http*://virtonomic*.*/*/window/unit/changename/*
// @downloadURL https://update.greasyfork.org/scripts/29621/Virtonomica%3A%20%D0%93%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/29621/Virtonomica%3A%20%D0%93%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20V2.meta.js
// ==/UserScript==

var run = function(type) {

    var total = null;

    var clone = function(o) {
        if (!o || 'object' !== typeof o) {
            return o;
        }
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
    };

    var realm = readCookie('last_realm');

    var main = function() {

        var onLoad = function() {
            var first = true;
            var type = null;
            var selector = 'tr:has(.unit_id):visible';
            $('table.unit-list-2014>tbody').selectable({
                filter: selector,
                tolerance: 'touch',
                cancel: ':input,option,a',
                selected: function(event, ui) {
                        $('.js-multisale-button').removeAttr('disabled');
                    if (first) {
                        first = false;
                        $('.js-multisale-button').removeAttr('disabled');
                        return false;
                    }
                },

                unselected: function(event, ui) {
                    if ($('.ui-selected').length == 0) {
                        first = true;
                        $('.js-multisale-button').attr('disabled', true);
                    }
                }
            }
            );


           $('table.unit-list-2014 ' + selector).dblclick(function() {
            console.log('try to attach event to units');
//            $('table.unit-list-2014').dblclick(function() {
                var t = $($('td', this)[1]).attr('title');
                $('table.unit-list-2014 tr:has(td[title="' + t + '"]):visible').addClass('ui-selected');
                return false;
            });

            var serialize = function() {
                var arr = new Array();
                $('.ui-selected > .info > a').each(function() {
                    arr.push(/\d+$/.exec($(this).attr('href'))[0]);
                });

                if (arr.length == 0) {
                    return;
                }

                setCookie('units', arr.join(','));
                return arr[0];
            };

            var redirect = function() {

                try {
                    var id = serialize();
                    var url = $(this).val().replace('%id%', id);
                    url = url.replace('%realm%', realm);

                    window.location = url;

                } catch (ex) {
                    alert('Error: ' + ex);
                }

                return false;
            };

            var artButton = $('<button value="/%realm%/main/unit/view/%id%/" class="js-multisale-button" disabled>Инновации</button>').click(redirect);
            var specialtyButton = $('<button value="/%realm%/window/unit/produce_change/%id%" class="js-multisale-button" disabled>Специализация</button>').click(redirect);
            var saleButton = $('<button value="/%realm%/main/unit/view/%id%/sale" class="js-multisale-button" disabled>Параметры сбыта</button>').click(redirect);
            var magButton = $('<button value="/%realm%/main/unit/view/%id%/trading_hall" class="js-multisale-button" disabled>Цены в магазине</button>').click(redirect);
            var sizeButton = $('<button value="/%realm%/window/unit/upgrade/%id%" class="js-multisale-button" disabled>Размер</button>').click(redirect);
            var boomButton = $('<button value="/%realm%/window/unit/close/%id%" class="js-multisale-button" disabled>Снести</button>').click(redirect);
            var marketButton = $('<button value="/%realm%/window/unit/market/sale/%id%" class="js-multisale-button" disabled>Продать</button>').click(redirect);
            var buyButton = $('<button value="/%realm%/window/unit/market/buy/%id%" class="js-multisale-button" disabled>Купить</button>').click(redirect);
            var advButton = $('<button value="/%realm%/window/unit/view/%id%/virtasement?old" class="js-multisale-button" disabled>Реклама</button>').click(redirect);
            var renButton = $('<button value="/%realm%/window/unit/changename/%id%" class="js-multisale-button" disabled>Переименовать</button>').click(redirect);

            var panel = $('<fieldset><legend>Групповые операции</legend></fieldset>');

            panel.append(artButton).append(specialtyButton).append(saleButton);
//            append(magButton)
            panel.append(sizeButton).append(boomButton).append(marketButton).append(buyButton).append(advButton).append(renButton);
            $('.unit-list-2014').wrap($('<form id="js-multisale-form" />')).after(panel);
        };

        var script = document.createElement("script");
        script.src = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js';
        script.onload = onLoad;
        document.getElementsByTagName("head")[0].appendChild(script);
        var style = document.createElement("style");
        style.type = 'text/css';
        style.textContent = '.ui-selected td { background-color: #fbec88 !important; } .ui-selecting td { background-color: #fef7e2 !important;  }';
        document.getElementsByTagName("head")[0].appendChild(style);

    };

    var isGroup = function() {
        var arr = readCookie('units');

        if (arr == null) {
            return false;
        }

        arr = arr.split(',');
        total = arr.length;
        if (total == 0) {
            return false;
        }

        return arr;
    };

    var doit = function(params, url, data) {

        var arr = isGroup();

        if (data == undefined) {
            data = '';
        }

        try {

            $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
            $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-curr"></span>/' + arr.length + '</div>').width($(window).width()).prependTo('body');

            var num = 0, handle = function() {
                if (num >= arr.length) {
                    $('#js-progress').remove();
                    $('#js-wall').remove();
                    alert('Операция выполнена для предприятий: ' + num);
                    history.back();
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

            setCookie('units', 0, -1);
            handle();

        } catch(ex) {
            alert(ex);
        }

    };

    var sale = function() {
        var button = $('input[value="Сохранить изменения"]');
        button.unbind().click(function() {
            var name = button.attr('name');
            var val = button.attr('value');
            var save = '';
            if (name != undefined) {save = '&'+name+'='+val}
            var data = button.parents('form').serialize()+save;
            doit({type: 'POST'}, '/' + realm + '/main/unit/view/%id%/sale', data);
            return false;
        });
    };


    var mag = function() {
        var button = $('input[value="Установить цены"]');
        button.unbind().click(function() {
            var name = button.attr('name');
            var val = button.attr('value');
            var save = '';
            if (name != undefined) {save = '&'+name+'='+val}
            var data = button.parents('form').serialize()+save;
            doit({type: 'POST'}, '/' + realm + '/main/unit/view/%id%/trading_hall', data);
            return false;
        });
    };

    var art = function() {
        window.attachArtefact = function(artefact_id, slot_id, N) {
            N = unescape(N);
            if (confirm(N + "\n\nВнимание! Артефакт будет установлен на " + total + " предприятий! Вы хотите продолжить?")) {
                doit({dataType: 'json', cache: false},
                        '/' + realm + '/ajax/unit/artefact/attach/', //https://virtonomica.ru
                        'unit_id=%id%&artefact_id=' + artefact_id + '&slot_id=' + slot_id);
            }
            return false;
        };
    };

    var size = function() {
        $('form').submit(function() {
            var data = $('form').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/upgrade/%id%', data);
            return false;
        });
    };

    var specialty = function() {
        $('form:first').submit(function() {
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/produce_change/%id%', data);
            return false;
        });
    };

    var boom = function() {
        $('form:first').attr('onsubmit', '');
        $('form:first').unbind().submit(function() {
            if (confirm("Внимание! Будет взорвано " + total + " предприятий! Вы хотите продолжить?")) {
                doit({type: 'POST'}, '/' + realm + '/window/unit/close/%id%', {close_unit: 'Закрыть предприятие'});
            }
            return false;
        });
    };

    var market = function() {
        $('form:first').submit(function() {
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/market/sale/%id%', data);
            return false;
        });
    };

    var buy = function() {
        $('form:first').submit(function() {
//            var data = $('form:first').serialize();
            var data = {buy : "Купить подразделение"};
            doit({type: 'POST'}, '/' + realm + '/window/unit/market/buy/%id%', data);
            return false;
        });
    };


    var adv = function() {
//        $('form:first').submit(function() {
            $('.button250').unbind().click(function(){
                var data = $('form:first').serialize();
                doit({type: 'POST'}, '/' + realm + '/window/unit/view/%id%/virtasement?old', data+"&"+$('.button250').attr('name')+"="+$('.button250').attr('value'));
               return false;
            });
            $('.button280').unbind().click(function(){
                var data = $('form:first').serialize();
                doit({type: 'POST'}, '/' + realm + '/window/unit/view/%id%/virtasement?old', data+"&"+$('.button280').attr('name')+"="+$('.button280').attr('value'));
               return false;
            });

//        });
    };

    var ren = function() {
        $('form:first').submit(function() {
            var data = $('form:first').serialize();
            doit({type: 'POST'}, '/' + realm + '/window/unit/changename/%id%', data);
            return false;
        });
    };

    if (type != 'main' && !isGroup()) {
        return;
    }

    switch (type) {
        case 'main': main(); break;
        case 'sale': sale(); break;
        case 'buy': buy(); break;
//        case 'mag': mag(); break;
        case 'art': art(); break;
        case 'size': size(); break;
        case 'specialty': specialty(); break;
        case 'boom': boom(); break;
        case 'market': market(); break;
        case 'adv' : adv(); break;
        case 'ren' : ren();break;
    }

};

var handlers = [
    {regex: /main\/company\/view\/(\d+)\/unit_list$/, handler: 'main'},
    {regex: /main\/company\/view\/(\d+)\/unit_list\?old$/, handler: 'main'},
    {regex: /main\/unit\/view\/\d+\/sale$/, handler: 'sale'},
    {regex: /main\/unit\/view\/\d+\/trading_hall$/, handler: 'mag'},
    {regex: /main\/unit\/view\/\d+\/$/, handler: 'art'},
    {regex: /window\/unit\/upgrade\/\d+$/, handler: 'size'},
    {regex: /window\/unit\/produce_change\/\d+$/, handler: 'specialty'},
    {regex: /window\/unit\/close\/\d+$/, handler: 'boom'},
    {regex: /window\/unit\/market\/sale\/\d+$/, handler: 'market'},
    {regex: /window\/unit\/market\/buy\/\d+$/, handler: 'buy'},
    {regex: /window\/unit\/view\/\d+\/virtasement\?old$/, handler: 'adv'},
    {regex: /window\/unit\/view\/\d+\/virtasement$/, handler: 'adv'},
    {regex: /window\/unit\/changename\/\d+$/, handler: 'ren'}
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
