// ==UserScript==
// @name         IS PF - Adresy - Mapa
// @version      1.9.17
// @description  Zobrazování mapy u adres, označování input polí při editaci IP adresy
// @copyright    2023, EngyCZ
// @author       EngyCZ@gmail.com
// @license MIT
// @include      http*://is.pilsfree.*/adresy/*
// @include      http*://is.pilsfree.*/uzivatele/*
// @include      http*://is.pilsfree.*/zajemci/*
// @include      http*://is.pilsfree.*/zarizeni/*/edit*
// @require      http://cdn.jsdelivr.net/npm/sweetalert2@9
// @require      http://hosting.pilsfree.net/engy/jtsk.js#md5=549da053e4b27590de84430cd6ed97a6
// @icon
// @namespace https://greasyfork.org/users/1132330
// @downloadURL https://update.greasyfork.org/scripts/471361/IS%20PF%20-%20Adresy%20-%20Mapa.user.js
// @updateURL https://update.greasyfork.org/scripts/471361/IS%20PF%20-%20Adresy%20-%20Mapa.meta.js
// ==/UserScript==
var last_lat;
var last_lon;

function mapySrc(lat, lon) {
//  return 'https://frame.mapy.cz/zakladni?x=' + lon + '&y=' + lat + '&z=17&source=coor&id=' + lon + '%2C' + lat;
  return 'https://hosting.pilsfree.net/engy/mapa/?x=' + lon + '&y=' + lat + '&z=17';
}

(function () {
  'use strict';
  //debugger;

  // zobrazeni adresy
  if (/.*adresy\/\d+\/?#?$/g.test(window.location.href)) {
    // Zjisteni souradnic z /edit stranky
    $.ajax({
      url: window.location.href.replace('#', '') + '/edit'
    }).done(function (data) {
      var lat = $(data).find('#lat').val();
      var lon = $(data).find('#lnt').val();

      var tbody = $('#tabs_item_adresy_detail_tabs_detail table:first-child tbody:first-child');

      var tbodyChild = tbody.children();
      var id = tbodyChild[0].children[1].childNodes[0].nodeValue;
      var tbodyLine = tbodyChild[tbodyChild.length - 1].children[1].children[0];
      var coord = JTSK().WGS84toJTSK(lat, lon);
      var urlKatastr = 'http://nahlizenidokn.cuzk.cz/MapaIdentifikace.aspx?l=KN&x=-' + Math.round(coord.y) + '&y=-' + Math.round(coord.x);
      var katastrWindow = undefined;

      $(tbodyLine).append('<a id="vlastnici" class="btn btn-pilsfree-small" title="Vlastníci"><span class="glyphicon glyphicon-user"></span> Vlastníci</a>');
      $(tbodyLine).append('<a id="ruianizace" class="btn btn-pilsfree-small" title="Ruianizace" href="/ruianizace/' + id + '" target="_blank"><span class="glyphicon glyphicon-home"></span> Ruianizace</a>');

      $('#vlastnici').click(function() {
        if (typeof katastrWindow != 'undefined') {
          katastrWindow.close();
        }
        katastrWindow = window.open(urlKatastr, 'Katastr', 'width=600,height=700,status=yes,scrollbars=yes,resizable=yes');
      });

      // Reverzni geocode mapy.cz
/*      tbody.append($('<tr>')
        .append('<td>Co je na souřadnicích ?</td>')
        .append($('<td id=what_is_here>'))
      );*/

      // Zobrazení mapy až při aktivaci záložky
      $(document).on('shown.bs.tab', 'a[href="#tabs_item_adresy_detail_tabs_detail"]a[data-toggle="tab"]', function (e) {
        if (!$('#mapa').length) {
          $('#tabs_item_adresy_detail_tabs_detail')
            .append($('<iframe id="mapa">')
              .attr('src', mapySrc(lat, lon))
              .attr('style', 'width:100%; height:300px;')
            );
        }
      });

      // Pokud je záložka s informacemi aktivní, přidám mapu hned
      if ($('#tabs_item_adresy_detail_tabs_detail').hasClass('active')) {
        // Mapa
        $('#tabs_item_adresy_detail_tabs_detail')
          .append($('<iframe id="mapa">')
            .attr('src', mapySrc(lat, lon))
            .attr('style', 'width:100%; height:300px;')
          );
      }

/*      $.ajax({
        url: 'https://api.mapy.cz/rgeocode?lon=' + lon + '&lat=' + lat + '&count=1'
      }).done(function (data) {
        $('#what_is_here').html(data.documentElement.getAttribute('label'));
      });*/
    });
  } else {
    console.log('Nic')
  }

  //debugger;
  var tel = $("a[href^='tel:']");
  tel.after(function(){
    return ' <a href="https://wa.me/' + this.text.replaceAll('\xA0','').replaceAll('+', '') + '" target="_blank"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/180px-WhatsApp.svg.png" height=20> WhatsApp App</a><br>';
  });
  tel.after(function(){
    return ' <a href="https://web.whatsapp.com/send/?phone=' + this.text.replaceAll('\xA0','').replaceAll('+', '') + '&text&type=phone_number&app_absent=0" target="_blank"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/180px-WhatsApp.svg.png" height=20> WhatsApp WEB</a>';
  });
})();
