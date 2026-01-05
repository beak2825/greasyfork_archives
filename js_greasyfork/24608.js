// ==UserScript==
// @name           Virtonomica: отправка в отпуск и возвращение из отпуска через групповые операции
// @version        1.1
// @include        http*://*virtonomic*.*/*/main/company/view/*
// @description    Плагин для https://greasyfork.org/ru/scripts/2843-virtonomica-%D0%B8%D0%BD%D1%84%D0%BE-%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5-%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8
// @author         cobra3125
// @namespace      virtonomica
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/24608/Virtonomica%3A%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%B2%20%D0%BE%D1%82%D0%BF%D1%83%D1%81%D0%BA%20%D0%B8%20%D0%B2%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%B7%20%D0%BE%D1%82%D0%BF%D1%83%D1%81%D0%BA%D0%B0%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/24608/Virtonomica%3A%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%B2%20%D0%BE%D1%82%D0%BF%D1%83%D1%81%D0%BA%20%D0%B8%20%D0%B2%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%B7%20%D0%BE%D1%82%D0%BF%D1%83%D1%81%D0%BA%D0%B0%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  function set(unitLink, toHoliday) {
    var svUrl = unitLink.attr('href');
    if(toHoliday){
      svUrl += '/holiday_set'; 
    } else {
      svUrl += '/holiday_unset'; 
    }
    $.get( svUrl , function() {
      console.log( "success" );
      var prodCell = $('td.prod', unitLink.parent().parent());
      if (toHoliday){
        prodCell.append('<img src="/img/unit_indicator/workers_in_holiday.gif" title="Персонал предприятия в отпуске">');
      } else {
        $('img[src="/img/unit_indicator/workers_in_holiday.gif"]', prodCell).remove();
      }
    })
      .fail(function() {
      console.log( "error" );
    });
  }
	
  function add() {
    var panel = $('legend:contains("Групповые операции")');
    if(panel.length == 1) {
      //console.log( "1" );
      var setHoliday = $('<button class="js-multisale-button">Отправить в отпуск</button>');
      setHoliday.click(function() {
        var selectedRows = $('tr[class~="ui-selected"]');
        if (selectedRows.length == 0) {
          alert('Сначала выберите одно или несколько подразделений');
        } else {
          if (!confirm('Отправить в отпуск ' + selectedRows.length + ' подразделений?')) {
            return false;
          }
          selectedRows.each(function() {
            var row = $(this);
            var unitLink = $('> td.info > a', row).first();
            set(unitLink, true);
          });	
        }
        return false;
      });
      var unSetHoliday = $('<button class="js-multisale-button">Вернуть из отпуска</button>');
      unSetHoliday.click(function() {
        var selectedRows = $('tr[class~="ui-selected"]');
        if (selectedRows.length == 0) {
          alert('Сначала выберите одно или несколько подразделений');
        } else {
          if (!confirm('Вернуть из отпуска ' + selectedRows.length + ' подразделений?')) {
            return false;
          }
          selectedRows.each(function() {
            var row = $(this);
            var unitLink = $('> td.info > a', row).first();
            set(unitLink, false);
          });	
        }
        return false;
      });
      //
      panel.after(setHoliday);
      panel.after(unSetHoliday);
    }
  }
	
  function waitfor(msec, count) {
    var panel = $('legend:contains("Групповые операции")');
    // Check if condition met. If not, re-check later (msec).
    while (panel.length != 1) {
      count++;
      setTimeout(function() {
        waitfor(msec, count);
      }, msec);
      return;
    }
    // Condition finally met. callback() can be executed.
    //console.log("count = " + count);
    add();
  }

  // Wait until idle (busy must be false)
  waitfor(100, 0);
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}