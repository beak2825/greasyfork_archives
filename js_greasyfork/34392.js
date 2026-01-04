// ==UserScript==
// @name        balane_OnUnitsList
// @namespace   virtonomica
// @include     *virtonomic*.*/*/main/company/view/*/unit_list
// @description shows direct link to supply from the unit list page
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34392/balane_OnUnitsList.user.js
// @updateURL https://update.greasyfork.org/scripts/34392/balane_OnUnitsList.meta.js
// ==/UserScript==
var run = function () {
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  var warehouse = $('<img style="cursor:pointer;vertical-align:middle;" width="32" src="/img/artefact/icons/color/warehouse.gif" title="складские остатки">').click(function () {balance();});
//  $('table.unit-top tr:eq(1)>td:eq(1)').prepend(warehouse);
  $('img[src="/img/icon/unit_build.png"]').parents('td').prepend(warehouse);

  function balance() {
    var realm = readCookie('last_realm');
    $('.unit-list-2014>tbody td[class^=info]').each(function () {
      UnitType = $(this).prop('class');
      if (UnitType == 'info i-warehouse') {
        var id = $(this).parent().find($('.unit_id')).text();
        if (id == '') return;
        var url = '/%realm%/main/unit/view/%id%'.replace('%realm%', realm).replace('%id%', id);
        var bal = 11;
        $.ajax({
          type: 'GET',
          url: url,
          success: function (data) {
            $('tr.even, tr.odd', data).each(function () {
              var cells = $('td', this);
              var total = parseInt($(cells[1]).text().replace(/\s+/g, '')); // всего на складе
              var kont = parseInt($(cells[5]).text().replace(/\s+/g, '')); // отгрузки по контракту
              var zak = parseInt($(cells[7]).text().replace(/\s+/g, '')); // закуплено
              var otgr = parseInt($(cells[8]).text().replace(/\s+/g, '')); // отгружено
              if (kont > zak) {
                var days = Math.floor((total - kont) / (kont - zak));
                if (days < 0) days = 0;
                bal = Math.min(bal, days);
              }
            });
          },
          async: false
        });
        var b = $('<span style="color: black; font-weight: bold; font-size: 16px;"> ' + bal + '</span>');
        if (bal < 10) {
          $(this).parent().find('.alerts').append(b);
        } //вывод сведений об остатках менее чем на 10 дней
      }
    }); //each function
  }
};
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
