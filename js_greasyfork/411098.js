// ==UserScript==
// @name        wh-observer.de/add/dewpoint
// @namespace   martin.sluka.de
// @description Display dew point on wh-observer.de
// @version     1.3
// @include     https://wh-observer.de/devices
// @downloadURL https://update.greasyfork.org/scripts/411098/wh-observerdeadddewpoint.user.js
// @updateURL https://update.greasyfork.org/scripts/411098/wh-observerdeadddewpoint.meta.js
// ==/UserScript==

var a = 7.5, b = 237.3, c = 6.1078;

function SDD (T) {
  return c * Math.pow(10, a*T/(b+T));
}

function DD (r, T) {
  return r / 100 * SDD(T);
}

function TD (r, T) {
  var v = Math.log10(DD(r, T) / c);
  return b * v / (a-v);
}

var cards = document.getElementsByClassName("card 14");
for (var i = cards.length; i--; ) {
  if (!cards[i].getElementsByClassName("DewPoint").length) {
    var vals = cards[i].getElementsByClassName("value");
    var temperatur = vals[0].innerText.match(/(-?\d+),(\d)/),
        luftfeuchte = vals[1].innerText.match(/\d+/);
    var dewpoint = TD(luftfeuchte, parseInt(temperatur[1]) + parseInt(temperatur[2])/10).toString().match(/^(-?\d+)(\.(\d))?/);
    var icons = cards[i].getElementsByClassName("icons");
    icons[0].outerHTML = '<div class="sensor NoAlert" style="color:green"><h5 class="DewPoint"><span class="value" title="Taupunkt">' +
                         dewpoint[1] + ',' + (dewpoint[3] || 0) + ' °C' +
                         '</span></h5></div>' +
                         icons[0].outerHTML;
  }
}