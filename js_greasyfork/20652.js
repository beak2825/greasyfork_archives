// ==UserScript==
// @name          Redimensionar Comentarios Taringa
// @namespace     http://www.taringa.net/otakuposer
// @author		  @otakuposer
// @description   Redimensiona las imagenes en los comentarios de taringa
// @match ://www.taringa.net/*
// @include      http*://www.taringa.net/*
// @version 0.0.1.20160617010007
// @downloadURL https://update.greasyfork.org/scripts/20652/Redimensionar%20Comentarios%20Taringa.user.js
// @updateURL https://update.greasyfork.org/scripts/20652/Redimensionar%20Comentarios%20Taringa.meta.js
// ==/UserScript==

$('div.comment-content img.imagen').css("cssText", "max-width: 100px !important;");
$('div.comment-content img.imagen').click(function() {
	if($(this).width() == 100){
		$(this).removeAttr('style');
	} else {
    $(this).css("cssText", "max-width: 100px !important;");
	}
})


