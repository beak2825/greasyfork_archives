// ==UserScript==
// @name       TaringaIRC
// @namespace  http://www.taringa.net/lvdota
// @version    1.2.1
// @description  Chat de Taringa en el Mi
// @match      http://*.taringa.net/mi
// @copyright  2014, lvdota
// @downloadURL https://update.greasyfork.org/scripts/4984/TaringaIRC.user.js
// @updateURL https://update.greasyfork.org/scripts/4984/TaringaIRC.meta.js
// ==/UserScript==

(function() {
    var ircChat = $('<div class="box"><div class="title clearfix"><a href="#" id="alternar-panel-oculto"><h2>Taringa IRC (ocultar)</h2></a></div><div id="coindesk-widget" data-size="mpu"></div><div id="panel-oculto" class="list recomendados"><iframe src="https://kiwiirc.com/client/irctaringa.net/?nick=usuario|?&theme=basic#taringa" style="border:0; width:100%; height:450px;"></iframe></div></div>');
    $('#sidebar').prepend(ircChat);

    $('#alternar-panel-oculto').toggle(
        function(e){ 
            $('#panel-oculto').slideUp();
            $('#alternar-panel-oculto h2').html('Taringa IRC (mostrar)');
            e.preventDefault();
        },
        function(e){ 
            $('#panel-oculto').slideDown();
            $('#alternar-panel-oculto h2').html('Taringa IRC (ocultar)');
            e.preventDefault();
        }
 
    );

})();