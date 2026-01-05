// ==UserScript==
// @name         Ver shout borrado
// @namespace    Fabi
// @version      0.1
// @description  La wea chingadera
// @author       Fabi
// @include        http*://www.taringa.net/*/mi/*

// @downloadURL https://update.greasyfork.org/scripts/17666/Ver%20shout%20borrado.user.js
// @updateURL https://update.greasyfork.org/scripts/17666/Ver%20shout%20borrado.meta.js
// ==/UserScript==


if($('#error-ng .message').html() !== null){
	$('body').show();
	$('#page').hide();
	$('body').append('<div id="page" style="text-align:center;margin: 0 auto;width: 500px;position: static;margin-top: 12%;"><img src="//archive.taringo.xyz/static/img/logo.png" style="width: 157px;"><h3>Cargando</h3><p>Shout Eliminado</p></div>');
	
	var regStr=/http.*:\/\/.*\.taringa\.net\/.*\/mi\/([a-z0-9]*[^\/?#])/ig;

	var res = regStr.exec(document.location.href);	
	
	document.location.href="https://archive.taringo.xyz/shout/"+res[1];
}