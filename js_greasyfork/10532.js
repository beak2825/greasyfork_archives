// ==UserScript==
// @name        iks:virtonomica минимальный заказ
// @namespace   virtonomica
// @description Разрывает заказы которые менее указного
// @include     http*://*virtonomic*.*/*/main/unit/view/*/sale*
// @version     1.11
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10532/iks%3Avirtonomica%20%D0%BC%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/10532/iks%3Avirtonomica%20%D0%BC%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7.meta.js
// ==/UserScript==

var run = function() {
  $('form[name="consumerListForm"]').each(function() {
    var idUnit = location.href.split('/')[7],
        o = {},
        idZakaz = $(this).find( '#consumerListDiv > table.list.salelist td.title' );
    $( idZakaz ).append('<div style="float:right">Минимальный заказ: <input type="text" value="0" id="inputMin" style="width: 70px; text-align:right"/></div>');
    var nameZakaz = $( idZakaz ).find(' img').attr('src').replace(/\/img\/products\//, '').replace(/.gif/, '');
    if( window.localStorage.getItem('iksMinZakaz') ) {
      o = JSON.parse( window.localStorage.getItem('iksMinZakaz') );
      if(!o[idUnit]) o[idUnit] = {};
    } else o[idUnit] = {};
    $( idZakaz ).find('#inputMin').val( o[idUnit][nameZakaz] | 0 );
    $(this).find('#inputMin').bind("change keyup input click", function() {
      var num = parseInt( $(this).val().replace(/[^0-9]/g, '') ) | 0;
      $(this).val( num );
      o[idUnit][nameZakaz] = num;
      window.localStorage.setItem('iksMinZakaz', JSON.stringify( o ))
    });
  
    var p = false;
    $(this).find('#consumerListDiv > table.list.salelist tr').each(function() {
      if( $(this).hasClass('odd') || $(this).hasClass('even') ) {
        if( parseInt( $(this).find('td:nth-child(7)').html().replace(/\s+/g, '') ) < parseInt( $('#inputMin').val() ) ) {
          $(this).find('input[type="checkbox"]').prop('checked','checked');
          p = true;
        }
      }
    });
    if(p) $(this).find('input[value="Разорвать контракт"]').click();
  });
}

if(window.top == window)
{
  $( '<script/>', { text: '(' + run.toString() + ')()' } ).appendTo('head');
}