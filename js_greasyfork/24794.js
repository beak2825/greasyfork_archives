// ==UserScript==
// @name           Virtonomica: быстрая отмена строительства
// @description    Позволяет быстро отменять строительство подразделения без дополнительных окон
// @namespace      virtonomica
// @version        1.0
// @include        http*://*virtonomic*.*/*/main/company/view/*/unit_list/building
// @downloadURL https://update.greasyfork.org/scripts/24794/Virtonomica%3A%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D0%BE%D1%82%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/24794/Virtonomica%3A%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D0%BE%D1%82%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  var confirmed = false;
  $("table[class^='unit-list-'] > tbody > tr > td[class] > a").each( function() {
    var row = $(this).parent().parent();
    var link = $(this);
    var delBtn = $('<a href="#"><img width=16 height=16 alt="Отменить быстро" src="/img/del.gif"/></a>');

    delBtn.click(function() {
      if(!confirmed && !confirm('Отменить строительство подразделения?')) {
        return false;
      }
      confirmed = true;

      var svPostUrl = link.attr('href').replace("main/unit/view","main/unit/close");
      var data = {};
      data['unit_cancel_build'] = '1';
      //console.log("data = " + JSON.stringify(data));
      //console.log("svPostUrl = " + svPostUrl);
      $.post( svPostUrl, data )
        .done(function() {
        console.log( "success" );
        row.hide();
        //window.location = window.location.href;
      })
        .fail(function() {
        console.log( "error" );
      });
      //$.post( href3, { close_unit: "Закрыть предприятие" } );
      return false;
    });
    $(this).append(delBtn);
  });

}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);