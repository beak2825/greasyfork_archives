// ==UserScript==
// @name           poe.trade QoL
// @namespace      herpderp
// @include        http://poe.trade/search/*
// @version        20180107.2
// @grant          none
// @description:en Makes poe.trade have stuff it should already have
// @description Makes poe.trade have stuff it should already have
// @downloadURL https://update.greasyfork.org/scripts/36923/poetrade%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/36923/poetrade%20QoL.meta.js
// ==/UserScript==
// HTML and CSS to add the new buttons
var currency = document.createElement('p');
currency.id = 'currencyP';
currency.innerHTML += '<input type="button" class="qolbutton button small right secondary" id="alchnuke" value="Remove Alchs"><br/><input type="button" class="qolbutton button small right secondary" id="chiselnuke" value="Remove Chisels"><br/><input type="button" class="qolbutton button small right secondary" id="chaosnuke" value="Remove Chaos"><br/><input type="button" class="qolbutton button small right secondary" id="chaosonly" value="Show Only Chaos"><br/><input type="button" class="qolbutton button small right secondary" id="exaltedonly" value="Show Only Exalted"><br/><input type="button" class="qolbutton button small right secondary" id="afknuke" value="Remove AFK"><br/><input type="button" class="qolbutton button small right secondary" id="fixprices" value="Use Real Prices">';
document.body.insertBefore(currency, document.body.firstChild);
document.getElementById('alchnuke').addEventListener('click', function () {
  remove('Alchemy', '.currency-alchemy');
}, false);
document.getElementById('chiselnuke').addEventListener('click', function () {
  remove('Chisels', '.currency-chisel');
}, false);
document.getElementById('chaosnuke').addEventListener('click', function () {
  remove('Chaos', '.currency-chaos');
}, false);
document.getElementById('chaosonly').addEventListener('click', function () {
  only('Chaos', '.currency-chaos');
}, false);
document.getElementById('exaltedonly').addEventListener('click', function () {
  only('Exalted', '.currency-exalted');
}, false);
document.getElementById('afknuke').addEventListener('click', remove_afk, false);
document.getElementById('fixprices').addEventListener('click', fix_shitty_pricing, false);
$('#currencyP').css({
  'margin-top': '5px',
  'margin-right': '30px',
  'bottom': '0',
  'right': '0',
  'position': 'fixed'
});
$('.qolbutton').css({
  'width': '152px',
  'padding': '4px',
  'margin': '4px'
});
// remove a currency type
function remove(name, currency) {
  if (confirm('Hide all results priced in ' + name + '?'))
  {
    $('.has-tip.currency' + currency).parent().parent().parent().parent().parent().parent().parent().hide();
    $('.centered').hide();
  } else
  {
  }
} // show only currency type

function only(name, currency) {
  if (confirm('Hide all results except those priced in ' + name + '?'))
  {
    $('.has-tip.currency:not(' + currency).parent().parent().parent().parent().parent().parent().parent().hide();
    $('.centered').hide();
  } else
  {
  }
} // remove anyone with an afk label

function remove_afk() {
  if (confirm('Hide all results with AFK status?'))
  {
    $('.label-afk.label').parent().parent().parent().parent().parent().parent().hide();
  } else
  {
  }
} // get existing data-value, multiply them and add them to tbody to be lazy

function price_fix(currency, multiplier) {
  $('.has-tip.currency' + currency).each(function () {
    var priceText = Math.abs($(this).parent().attr('data-value') * multiplier).toFixed(1);
    var price = $(this).parent().attr('data-value') * multiplier;
    var text = $(this).text();
    if (currency != '.currency-chaos') {
      $(this).text(priceText + 'c / ' + text);
    }
    $(this).parent().parent().parent().parent().parent().parent().parent().attr('data-value', price);
  });
} // set multipliers, price fix each type and then sort all the tbody into the first table  

function fix_shitty_pricing() {
  if (confirm('Show real prices and fix price sorting?'))
  {
    // Hardcoded multipliers from poe.ninja on 07/01/2018
    var chiselmult = 1;
    var alchmult = 1;
    var fusingmult = 1;
    var regalmult = 1;
    var exaltedmult = 1;
    var scourmult = 1;
    var gcpmult = 1;
    // League Check
    var league = $('.league.chosen').val();
    if (league == 'Abyss') {
      chiselmult = 1.68351851851852;
      alchmult = 1.06976744186047;
      fusingmult = 0.945173913043478;
      scourmult = 1.28205128205128;
      regalmult = 1.04651162790698;
      exaltedmult = 1.01574135130318;
      gcpmult = 0.999001098901099;
    } else if (league == 'Hardcore Abyss') {
      chiselmult = 1.08695652173913;
      alchmult = 1.0604347826087;
      fusingmult = 0.986205128205128;
      scourmult = 1.08225108225108;
      regalmult = 1.01877066718537;
      exaltedmult = 0.964754716981132;
      gcpmult = 1.07758620689655;
    } else {
    }
    price_fix('.currency-alchemy', alchmult);
    price_fix('.currency-exalted', exaltedmult);
    price_fix('.currency-chisel', chiselmult);
    price_fix('.currency-fusing', fusingmult);
    price_fix('.currency-scouring', scourmult);
    price_fix('.currency-regal', regalmult);
    price_fix('.currency-gcp', gcpmult);
    price_fix('.currency-chaos', '1');
    // sort all item results into first table based on new data-value 
    var $wrapper = $('#search-results-first');
    var $sortables = $('[id*="search-results"]');
    $sortables.find('.item').sort(function (b, a) {
      return + a.getAttribute('data-value') - + b.getAttribute('data-value');
    }).appendTo($wrapper);
  } else
  {
  }
}
