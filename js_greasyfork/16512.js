// ==UserScript==
// @name           Links
// @version 0.1
// @namespace      
// @description    Link para perfil de t!
// @include        http://*www.taringa.net*
// @match *://www.taringa.net/*
//@icon            
// @downloadURL https://update.greasyfork.org/scripts/16512/Links.user.js
// @updateURL https://update.greasyfork.org/scripts/16512/Links.meta.js
// ==/UserScript==

$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><HR size="2" width="1"></HR></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/mod-history" target=_blank>>Mod History</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/comunidades/denuncias-t/" target=_blank>>Denuncias T!</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/envivo/" target=_blank>>T! en vivo</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/protocolo/" target=_blank>>Protocolo</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/posts/taringa/18172368/Uso-adecuado-de-las-Categorias-Oficial.html" target=_blank>>Categorias</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://www.taringa.net/Cazador4ever/fotos" target=_blank>>Fotos</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="www.taringa.net/comunidades/-cazadores-/agregar/" target=_blank>>CazaComu</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><a href="http://ayuda.itaringa.net/" target=_blank>>Ayuda Taringa</a></li>');
$('div#tool-profile > ul > li:nth-child(1)').append('<li class=""><HR size="2" width="1"></HR></li>');