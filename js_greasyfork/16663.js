// ==UserScript==
// @name       Grabar
// @version    0.1
// @description  Grabar la pantalla
// @match      http://www.taringa.net/*
// @include    http*://www.taringa.net/*
// @copyright  @Cazador4ever
// @namespace  http://www.taringa.net/Cazador4ever
// @downloadURL https://update.greasyfork.org/scripts/16663/Grabar.user.js
// @updateURL https://update.greasyfork.org/scripts/16663/Grabar.meta.js
// ==/UserScript==

(function() {
    var clima = $('<center><div class="start-screen-recording recording-style-black"><div><div class="rec-dot"></div><span>Iniciar</span></div></div><script src="http://eu.cdn.apowersoft.com/api/screen-recorder.php?lang=es" defer></script></center>');
    $('#sidebar').prepend(clima);
})();