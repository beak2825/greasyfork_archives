// ==UserScript==
// @name        Filter flights Azair.eu
// @namespace   https://github.com/brincowale
// @include     http://www.azair.eu/azfin.php*
// @include     http://www.azair.cz/azfin.php*
// @version     1
// @grant       none
// @description Filter airlines results and exclude flights with high prices. Edit script for modify CONFIGURATION.
// @downloadURL https://update.greasyfork.org/scripts/17874/Filter%20flights%20Azaireu.user.js
// @updateURL https://update.greasyfork.org/scripts/17874/Filter%20flights%20Azaireu.meta.js
// ==/UserScript==

// ##################### //
//     CONFIGURATION     //
// ##################### //

// filter airlines by iata id http://www.iata.org/publications/Pages/code-search.aspx
var HIDE_AIRLINES = ["iataU2", "iataW6"]; // iataU2 > Easyjet / iataW6 > Wizzair
var HIDE_DIRECT_FLIGHTS = false;
var MAXIMUM_PRICE_TO_PAY_EACH_FLIGHT = 30;

// ##################### //
//         SCRIPT        //
// ##################### //

$( document ).ready(function() {
  $("div.result ").each(function () {
    if (HIDE_DIRECT_FLIGHTS){
      $(this).find("div > p").each(function () {
        stopover = $(this).find('span.durcha').text();
        // remove direct flights
        if (stopover.contains('no change'))
          $(this).parent().remove();
      });
    }
    // filter expensive flights and airlines
    $(this).find("div > div.detail > p").each(function () {
      price = $(this).find('span.legPrice').text();
      // remove expensive flights
      if ( parseFloat(price.replace('€', '')) > MAXIMUM_PRICE_TO_PAY_EACH_FLIGHT )
        $(this).parent().parent().remove();
      // remove airlines
      for (var i = 0; i < HIDE_AIRLINES.length; i++) {
        if ( $(this).find('span.airline.' + HIDE_AIRLINES[i]).length > 0){
          $(this).parent().parent().remove();
        }
      }
    });
  });
});
