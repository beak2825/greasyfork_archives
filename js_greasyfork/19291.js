// ==UserScript==
// @name        seasons by ctsigma
// @namespace   virtonomica
// @include     https://*virtonomic*.*/*/main/company/view/*/unit_list
// @description shows cultures that will appear next month on unit list
// @version     1.04
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19291/seasons%20by%20ctsigma.user.js
// @updateURL https://update.greasyfork.org/scripts/19291/seasons%20by%20ctsigma.meta.js
// ==/UserScript==
var run = function () {
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  var agro = $('<img style="cursor:pointer;vertical-align:middle;" width="32" src="/img/artefact/icons/color/agriculture.gif" title="сезонность">').click(function () {seasons()});
//  $('table.unit-top tr:eq(1)>td:eq(1)').prepend(agro);  //конфликтовало
  $('img[src="/img/icon/unit_build.png"]').parents('td').prepend(agro);
  
  function seasons() {
    var realm = readCookie('last_realm');
    const week = 604800000; // неделя в ms
    var srv_date = $('.date_time').text().trim();
    var months = {'янв':0,'фев':1,'мар':2,'апр':3,'май':4,'мая':4,'июн':5,'июл':6,'авг':7,'сен':8,'окт':9,'ноя':10,'дек':11};
    var yy = (/([0-9]+)\s([^0-9\s]+)\s([0-9]+)/.exec(srv_date)) [3];
    var mm = months[(/([0-9]+)\s([^0-9\s]+)\s([0-9]+)/.exec(srv_date)) [2].substr(0, 3)];
    var dd = (/([0-9]+)\s([^0-9\s]+)\s([0-9]+)/.exec(srv_date)) [1];
    var srvDate = new Date(yy, mm, dd);
    $('.unit-list-2014>tbody td[class^=info]').each(function () {
      UnitType = $(this).prop('class');
      if (UnitType == 'info i-farm' || UnitType == 'info i-orchard') {
        var id = $(this).parent().find($('.unit_id')).text();
        if (id == '') return;
        var url = '/%realm%/window/unit/produce_change/%id%'.replace('%realm%', realm).replace('%id%', id);
        var prod = '';
        $.ajax({
          type: 'GET',
          url: url,
          success: function (data) {
            $('.list tr[class]', data).each(function () {
              var season = months[$(this).find('>td:eq(4)').find('[title*=", уборка урожая"]:eq(0)').attr('title').replace(', уборка урожая', '').toLowerCase().substr(0, 3)];
              var yyy = parseInt(yy);
              if (season < mm) {
                yyy = 1 + yyy
              }
              var ssnDate = new Date(yyy, season, '01');
              var weeks = Math.ceil((ssnDate - srvDate) / week);
//              console.log(weeks);
              if (weeks < 6) {
                prod = prod + $(this).find('>td:eq(3) a').html().replace(RegExp('/img/products/24/', 'g'), '/img/products/16/') + '(' + weeks + ')</img>';
              }
            });
          },
          async: false
        });
        var b = $(prod);
        b.each(function () {
          b.attr('align', '');
        })
        $(this).parent().find('.alerts').prepend(b);
      }
    }) //each function
  }
}
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
