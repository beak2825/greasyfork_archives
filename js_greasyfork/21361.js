// ==UserScript==
// @name        Proxer-OnlyImportantHosters
// @author      Dravorle
// @namespace   proxer.me
// @include     http://proxer.me/uploadstream?id=*&e=*&l=*
// @include     https://proxer.me/uploadstream?id=*&e=*&l=*
// @version     1.1
// @grant       document-end
// @description Duuh
// @downloadURL https://update.greasyfork.org/scripts/21361/Proxer-OnlyImportantHosters.user.js
// @updateURL https://update.greasyfork.org/scripts/21361/Proxer-OnlyImportantHosters.meta.js
// ==/UserScript==

start();

function start() {
    $(window).on("ajaxProxer", function() {
        start();
    });
    $(document).ajaxSuccess (function () {
        start();
    });

  $("#uploadstream_hoster").contents().filter(function(){
    return (this.nodeType == 3);
  }).remove();

  $("#uploadstream_hoster").find("a:contains('Hilfe')").remove();
  $("#uploadstream_hoster").find("input.uploadstream_hoster").each( function(index) {
    if( $(this).val() != "aod" &&
      $(this).val() != "crunchyroll_de" &&
      $(this).val() != "crunchyroll_en") {
      $(this).hide();

      var linkNumber1 = index;

      $("#uploadstream_hoster").find("a:eq("+linkNumber1+")").hide();
      $("#uploadstream_hoster").find("hr:eq("+linkNumber1+")").hide();
    }
  });

};