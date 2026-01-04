// ==UserScript==
// @name        ThunderFit: virtonomica оптовое строительство
// @namespace   virtonomica
// @description Автоматический запуск постройки нескольких подразделений одного типа, кроме офисов (Обновление с переключением интерфейса)
// @include     http*://*virtonomic*.*/*/main/unit/create/*
// @include     http*://*virtonomic*.*/*/main/unit/view/*
// @include     http*://*virtonomic*.*/*/main/company/view/*/*
// @version     0.02
// @author      ThunderFit / iks
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/394633/ThunderFit%3A%20virtonomica%20%D0%BE%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/394633/ThunderFit%3A%20virtonomica%20%D0%BE%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.meta.js
// ==/UserScript==

var cookie = function() {
  return ({
    // Установить куки
    'setCookie': function(name, val) {
      var expires = new Date(); // получаем текущую дату
      expires.setTime(expires.getTime() + (60 * 60 * 1000)); // срок - 1 час, но его можно изменить
      document.cookie = name + "=" + val + "; expires=" + expires.toGMTString() +  "; path=/";
    },

    // Получить куки
    'getCookie': function(name) {
      var cookie_name = name + "=";
      var cookie_length = document.cookie.length;
      var cookie_begin = 0;

      while (cookie_begin < cookie_length) {
        value_begin = cookie_begin + cookie_name.length;
        if (document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
          var value_end = document.cookie.indexOf (";", value_begin);
          if (value_end == -1) {
            value_end = cookie_length;
          }
          return unescape(document.cookie.substring(value_begin, value_end));
        }
        cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
        if (cookie_begin == 0) {
          break;
        }
      }
      return false;
    },

    // Удалить куки
    'deleteCookie': function(name) {
      document.cookie = name + "=" + "; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    }
  });
}

/**************************************************/
var run = function() {
    $(document).keydown(function(e) {
        if( e.keyCode === 27 ) {
            cookie.deleteCookie("createUnit");
            cookie.deleteCookie("newUnit");
        }
    });

    var go = function (element, timeUpClik) {
        if(timeUpClik > 0) {
            setTimeout( element.click(), timeUpClik);
        } else {
            element.click();
        }
    }

    var cookie = iksCookie,
        cooki = cookie.getCookie("createUnit"),
        o = {};

    if (cooki) {

        o = JSON.parse(cooki);

        var n = parseInt(o["numUnit"]);
        var timeUpClik = parseInt(o["timeUpClik"]) * 1000;

        if ($('a.tbeta').length && $('a.tbeta').text().trim() === 'old') {
            go($('a.tbeta').children().first(), timeUpClik);
        } else if(n > 0) {
            var prov = 1;
            $("input:radio").each( function() {

                if ( o[ $(this).attr('name') ] ) {
                    if ( $(this).val() == o[ $(this).attr('name') ] ) {
                        prov = 0;
                        $.when(this).then(function(id){
                            $(id).prop('checked','checked');
                        }).then(function(id){
                            go($('input.button250[value="Продолжить >"]'), timeUpClik);
                        });
                    }
                } else if( window.location.href.indexOf('/main/unit/create/') + 1 ) {
                    //cookie.deleteCookie("createUnit");
                }
            });

            $('input.button250[value="Создать подразделение"]').each( function() {
                prov = 0;
                o["numUnit"] = n - 1;
                cookie.setCookie("createUnit", JSON.stringify( o ));
                $("div#mainContent > table > tbody > tr > td > form > table.list").append('<th>Количество подразделений</th><td style="color:blue">&nbsp;<b>' + n + '</b></td>');
                // если вы хотите подтверждать вручную создание подразделений
                // при последней стадии то заблокируйте строку ниже;
                // поставив перед ней две косые //
                go($(this), timeUpClik);
            });

            $('a:contains("Создать")').each(function() {
                prov = 0;
                go(this, timeUpClik);
            });

            if ( prov > 0 ) {
                $('a:contains("Предприятия")').each(function() {
                    go(this, timeUpClik);
                });
            }

        } else {
            cookie.deleteCookie("createUnit");
            $('a:contains("Строящиеся")').each(function() {
                go($(this), timeUpClik);
            });
        }
    } else {
        //скрываем чтобы не возникало вопросов по правильному выбору
        if (/\/\w+\/main\/unit\/create\/\d+\/step1-type-select/.test(window.location)) {
            $('#product-all').hide();
            $('ul[class="category_select"]').hide();
            $('div[class="new_down"]').hide();
            $('div[class="hr_boldest"]').hide();
            //убираем автопереход
            $('input[id^="utp-"], ul[id="product-all"] > li').attr('onclick','');
        }
        // Запомним параметры создаваемых подразделений
        cooki = cookie.getCookie("newUnit");
        if (cooki) {
            o = JSON.parse(cooki);
        }

        $("td:contains('образованности')").next().each(function() {
            $('div#mainContent > table > tbody > tr > td > form > table.list > tbody > tr').each(function() {
                if( $(this).find('td > input:radio') ) {
                    var n = parseFloat( $(this).find('td:nth-child(4)').html() );
                    if(n > 0){
                        var n1 = $(this).find('td:nth-child(5)').html().replace(/\s+/g, '').replace(/\$/g, '');
                        n1 = parseFloat( n1 );
                        $(this).find('td:nth-child(4)').append('&nbsp;&nbsp;<span title="цена за единицу образованости" style="font-size:x-small; color:blue">(1<span style="color:#000">/$</span>'+(n1/n).toFixed(2)+')</span>');
                    }
                }
            });
        });

        $("input:radio").click( function() {
            $('table.list > tbody:nth-child(1) > tr:nth-child(1):contains("Технология")').each( function() {
                if( parseFloat( $("input:radio:checked").parent().next().next().text().replace(/\s+/g, '').replace(/\$/, '') ) > 0) {
                    alert('Вы хотите купить не изученную вами технологию.');
                }
            });
            if( $(this).attr('name') == "unitCreateData[unit_class]" ) {
                o = {};
            }
        });

        // Установим количество создаваемых подразделений
        $('input.button250[value="Создать подразделение"]').each( function() {
            if (o["unitCreateData[unit_class]"] != "1815") {
                var n = 1;
                if (o["numUnit"] ) {
                    n = parseInt(o["numUnit"]);
                } else {
                    o["numUnit"] = n;
                }
                $("div#mainContent > table > tbody > tr > td > form > table.list").append('<tr><th>Количество подразделений</th><td><input type="text" value="' + n + '" id="impNumUnit" style="width: 100%"></input></td>'
                                                                                          +'<tr><th>Задержка сек. клика при переходах</th><td><input type="text" value="0" id="impTimeUpClik" style="width: 100%"></input></td>');
            }
        });
        // Пропускаем только цифры
        var numVal = function(v, v1) {
            var num = $(v).val().replace(/[^0-9]/g, '');
            $(v).val( num );
            o[v1] = num;
        };
        $('#impNumUnit').bind("change keyup input click", function() { numVal(this, "numUnit") });
        $('#impTimeUpClik').bind("change keyup input click", function() { numVal(this, "timeUpClik") });

        //
        $("input.button250").click( function() {
            if ($(this).val() == "Продолжить >") {
                $("input:radio:checked").each( function() {
                    o[ $(this).attr('name') ] = $(this).val();
                });
                cookie.setCookie("newUnit", JSON.stringify( o ));
            } else
                if ($(this).val() == "Создать подразделение") {
                    o["numUnit"] = parseInt(o["numUnit"]) - 1;
                    cookie.deleteCookie("newUnit");
                    cookie.setCookie("createUnit", JSON.stringify( o ));
                    if (o["numUnit"] && o["numUnit"] > 0) {
                        alert('Для отмены работы скрипта нажмите клавишу Esc');
                    }
                }
        });
    }
}

if(window.top == window && ( cookie().getCookie('createUnit') || window.location.href.indexOf('main/unit/create') + 1 ) ) {
    var script = document.createElement('script');
    script.textContent = 'var iksCookie = (' + cookie.toString() + ')();'
                        +' (' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}