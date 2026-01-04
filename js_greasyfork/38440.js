// ==UserScript==
// @name         ocultar a Sentido_almeriense
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       baldboy
// @description ocultar posts de Sentido_almeriense
// @match        http://udalmeriasad.mforos.com/*
// @downloadURL https://update.greasyfork.org/scripts/38440/ocultar%20a%20Sentido_almeriense.user.js
// @updateURL https://update.greasyfork.org/scripts/38440/ocultar%20a%20Sentido_almeriense.meta.js
// ==/UserScript==


$(document).ready(function() {
  if ( $( "table#ForoMensajes" ) ) {
    var busca = $("a:contains('Sentido_almeriense')");
    var padre = $(busca).parent();
    $(padre).parent().css("display","none");
  }
});