// ==UserScript==
// @name          tororadar remove email nag
// @namespace     danalec
// @description	  :)
// @include       https://app.tororadar.com.br/*
// @grant         none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version       10.04.2018
// @downloadURL https://update.greasyfork.org/scripts/372853/tororadar%20remove%20email%20nag.user.js
// @updateURL https://update.greasyfork.org/scripts/372853/tororadar%20remove%20email%20nag.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(function() {
  $(document).bind('DOMNodeInserted',function(){
    $("#modalCadastroAnalises").hide();
    $(".modal-backdrop").hide();
  })
})();