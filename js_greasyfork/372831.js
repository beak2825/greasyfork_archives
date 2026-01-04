// ==UserScript==
// @name         Calculadora Litro Cerveja ( Emporio )
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Calcula o litro da cerveja ( contém alguns erros, porém poucos, facil de identificar )
// @author       Toshiuk
// @match        https://www.emporiodacerveja.com.br/
// @license MIT
// @copyright 2018, Toshiuk
// @include      http*://www.emporiodacerveja.com.br/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/372831/Calculadora%20Litro%20Cerveja%20%28%20Emporio%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372831/Calculadora%20Litro%20Cerveja%20%28%20Emporio%20%29.meta.js
// ==/UserScript==

var $ = window.jQuery;
$(document).ready(function () {
  writepriceperlitre();
});
$(document).on('click', function () {
  setTimeout(function () {
    writepriceperlitre();
  }, 3000);
});

function writepriceperlitre() {
  $('.x-product').each(function () {
    let ml = $(this).find('.x-product-name').text().match(/[0-9]*ml/g) ? $(this).find('.x-product-name').text().match(/[0-9]*ml/g)[0] : "0";
    let mlnum = parseFloat(ml);
    let price = $(this).find('.x-bestPrice').text().match(/[0-9]*,[0-9]*/g) ? $(this).find('.x-bestPrice').text().match(/[0-9]*,[0-9]*/g)[0] : "0";
    let pricenum = parseFloat(price.replace(",", "."));
    let priceperlitre;
    let pack = $(this).find('.x-product-name').text().match(/[0-9]* packs/g) ? $(this).find('.x-product-name').text().match(/[0-9]* packs/g)[0] : "1";
    let packnum = parseFloat(pack);
    let unit = $(this).find('.x-product-name').text().toLowerCase().match(/[[0-9]* unidades|[0-9]* garrafas|[0-9]* latas|caixa com [0-9]*]/g) ? $(this).find('.x-product-name').text().toLowerCase().match(/[[0-9]* unidades|[0-9]* garrafas|[0-9]* latas|caixa com [0-9]*]/g)[0] : "0";
    let unitnum = parseFloat(unit);
    if (unitnum) {
      priceperlitre = (1000 / mlnum) * (pricenum / (unitnum * packnum));
    }
    else {
      priceperlitre = (1000 / mlnum) * pricenum;
    }

    $(this).find('.priceplitre').remove();
    $(this).find('.x-buy').after('<div class="subscriptionPrice priceplitre" style="top:0px;pointer-events: none;"><a href="/clubes" tabindex="0">Preço por litro: <span class="price-clubs">R$' + priceperlitre.toFixed(2) + '</span></a></div>');

  });
}
