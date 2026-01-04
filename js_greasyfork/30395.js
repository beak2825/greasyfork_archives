// ==UserScript==
// @name           Virtonomica: заменяет загрузку с code.jquery.com на другие cdn
// @version        1.2
// @include        http*://*virtonomic*.*/*/main/*
// @description    Заменяет загрузку с code.jquery.com на другие cdn
// @author         cobra3125
// @namespace      virtonomica
// @downloadURL https://update.greasyfork.org/scripts/30395/Virtonomica%3A%20%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D1%82%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D1%83%20%D1%81%20codejquerycom%20%D0%BD%D0%B0%20%D0%B4%D1%80%D1%83%D0%B3%D0%B8%D0%B5%20cdn.user.js
// @updateURL https://update.greasyfork.org/scripts/30395/Virtonomica%3A%20%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D1%82%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D1%83%20%D1%81%20codejquerycom%20%D0%BD%D0%B0%20%D0%B4%D1%80%D1%83%D0%B3%D0%B8%D0%B5%20cdn.meta.js
// ==/UserScript==

function addJS(spSrc) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", spSrc);
  document.body.appendChild(script);
}
function removeJS(spOldSrc, spNewSrc) {
  var x = document.getElementsByTagName("script");
  var i;
  for (i = 0; i < x.length; i++) {
    if (x[i].src == spOldSrc) {
      x[i].remove();
      addJS(spNewSrc);
      break;
    }
  }
}
removeJS('https://code.jquery.com/jquery-1.11.1.min.js'   , "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js");
removeJS('https://code.jquery.com/jquery-migrate-1.4.1.js', "https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.min.js");
