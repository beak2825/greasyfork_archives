// ==UserScript==
// @name           T!
// @namespace      _SeRiAlKiLLeR_
// @version        0.2
// @description    Accesos rapidos
// @include        *://*.taringa.net*
// @downloadURL https://update.greasyfork.org/scripts/14846/T%21.user.js
// @updateURL https://update.greasyfork.org/scripts/14846/T%21.meta.js
// ==/UserScript==

//modificar url en href//eliminar target=_blank en caso que no quieras que se abra una nuev pestaña//

$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/comunidades/denunciascolectivas/" target=_blank>»Denuncias-Colectivas</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/comunidades/equipo-d/" target=_blank>»Equipo-D</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/comunidades/moderadores-t/" target=_blank>»Moderadores-T</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/comunidades/denunciadores-en-t/" target=_blank>»Denunciadores-en-t</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/comunidades/denunciatron/" target=_blank>»Denunciatron</a></li>');

$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/mod-history.php" target=_blank>•Mod-History</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/protocolo/" target=_blank>•Protocolo</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://ayuda.itaringa.net/" target=_blank>•Ayuda</a></li>');
