// ==UserScript==
// @name DCTChecker
// @namespace DCTchecker
// @description Проверка ДКТ
// @match https://lk.mango-office.ru/*/widgets/*/settings
// @grant none
// @version 0.0.1.20190726104919
// @downloadURL https://update.greasyfork.org/scripts/387897/DCTChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/387897/DCTChecker.meta.js
// ==/UserScript==

$( window ).on( "load", function() {
    console.log( "DCTChecker готов!" );


});

  function checkMetrika() {
  var accid = location.href.split('/')[5];
  var widid = location.href.split('/')[7];
  var url = "https://lk.mango-office.ru/ics/api/"+accid+"/calltracking/widgets/"+widid;
  var quans, MetLogin, MetToken, MetCreated, MetLast;
  var quset = $.get(url, function(data) {
    console.log( "DCTChecker отправляет запрос!" );
    quans = data;//JSON.parse(data);
    MetLogin = quans.integrations.metrika.account;
    MetToken = quans.integrations.metrika.params.token;
    MetCreated = quans.integrations.metrika.params.token_created;
    MetLast = quans.integrations.metrika.params.synced;
    
    var url_DB = 'http://192.168.2.153/dashboard/logi_metriki?login='+MetLogin+'&token='+MetToken;
    var apch = '<br><br><a href="'+url_DB+'" target="_blank">ЛОГИ МЕТРИКИ</a><br>Интеграция подключена: '+MetCreated+'<br>Последняя отправка: '+MetLast;
    $('.ct-metrika-logo').append(apch);
    
    ;});
  }

 function runOnKeys(func) {
        var codes = [].slice.call(arguments, 1);

        var pressed = {};

        document.onkeydown = function(e) {
          e = e || window.event;

          pressed[e.keyCode] = true;

          for (var i = 0; i < codes.length; i++) { // проверить, все ли клавиши нажаты
            if (!pressed[codes[i]]) {
              return;
            }
          }

          // во время показа alert, если посетитель отпустит клавиши - не возникнет keyup
          // при этом JavaScript "пропустит" факт отпускания клавиш, а pressed[keyCode] останется true
          // чтобы избежать "залипания" клавиши -- обнуляем статус всех клавиш, пусть нажимает всё заново
          pressed = {};

          func();

        };

        document.onkeyup = function(e) {
          e = e || window.event;

          delete pressed[e.keyCode];
        };

      }

      runOnKeys(
        function() {
          checkMetrika();
        },
        "Q".charCodeAt(0),
        "W".charCodeAt(0)
      );