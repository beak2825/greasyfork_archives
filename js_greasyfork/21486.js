// ==UserScript==
// @name         Archive shout redirect
// @namespace    Fabi
// @version      0.2
// @description  Redirecciona a archive en caso de que el shout esté eliminado
// @author       Fabi
// @include        http*://www.taringa.net/*/mi/*
// @downloadURL https://update.greasyfork.org/scripts/21486/Archive%20shout%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/21486/Archive%20shout%20redirect.meta.js
// ==/UserScript==


if($('#error-ng .message').html() !== null){
	$('body').show();
	$('#page').hide();
	$('body').append('<div id="page" style="text-align:center;margin: 0 auto;width: 500px;position: static;margin-top: 12%;"><img src="//k61.kn3.net/D/5/0/0/1/C/E90.png" style="width: 157px;"><h3>Cargando</h3><p>Shout Eliminado</p></div>');
	
	var regStr=/http.*:\/\/.*\.taringa\.net\/.*\/mi\/([a-z0-9]*[^\/?#])/ig;

	var res = regStr.exec(document.location.href);	
	
	document.location.href="https://archive.taringo.xyz/shout/"+res[1];
}