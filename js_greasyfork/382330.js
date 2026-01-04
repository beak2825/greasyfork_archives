// ==UserScript==
// @name         El País PayWall Buster
// @namespace    http://abda.io
// @version      0.1
// @description  Quita el paywall de El País si usas un bloqueador de anuncios: Elimina el mensaje "Para poder seguir navegando, permite que se te muestren anuncios o, si lo prefieres, suscríbete."
// @author       @aberouch
// @match        https://elpais.*/*
// @include      https://elpais.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382330/El%20Pa%C3%ADs%20PayWall%20Buster.user.js
// @updateURL https://update.greasyfork.org/scripts/382330/El%20Pa%C3%ADs%20PayWall%20Buster.meta.js
// ==/UserScript==

(function() {
  "use strict";
  $(document).ready(function() {
    function antiwall() {
      $(".fc-dialog-container").fadeOut();
      $(".fc-dialog-overlay").fadeOut();
      $(".fc-whitelist-root").remove();
      $(".fc-ab-root").remove();
      $(".salida_articulo").css("overflow", "visible");
    }
    setTimeout(antiwall, 1400);
  });
})();
