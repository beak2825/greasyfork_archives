// ==UserScript==
// @name          Hinnavaatluse foorumi ignoreeritud kasutaja posti peitmine
// @name:et       Hinnavaatluse foorumi ignoreeritud kasutaja posti peitmine
// @namespace     https://foorum.hinnavaatlus.ee/profile.php?mode=viewprofile&u=ufo56
// @description   Teeme HVF'i ignoreeritud kasutaja postituse nähtamatuks (ka tsitaadid)
// @description:et Teeme HVF'i ignoreeritud kasutaja postituse nähtamatuks (ka tsitaadid)
// @include       https://foorum.hinnavaatlus.ee/viewtopic.php?*
// @require       http://code.jquery.com/jquery-2.0.3.min.js
// @locale        et
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/528169/Hinnavaatluse%20foorumi%20ignoreeritud%20kasutaja%20posti%20peitmine.user.js
// @updateURL https://update.greasyfork.org/scripts/528169/Hinnavaatluse%20foorumi%20ignoreeritud%20kasutaja%20posti%20peitmine.meta.js
// ==/UserScript==

$(document).ready(function() {
  $("span.postbody:contains('Sa oled lisanud selle isiku ignoreeritavate nimekirja. Kirja lugemiseks vajuta')")
    .each(function() {
      var td1 = $(this).parent().parent().parent().parent().parent().parent();
      var td2 = td1.next();
      var td3 = td2.next();
      td3.remove();
      td2.remove();
      td1.remove();
    });

  $("td.quote:contains('Sa oled lisanud selle isiku ignoreeritavate nimekirja. Kirja lugemiseks vajuta')")
    .each(function() {
      $(this).remove();
    });
});
