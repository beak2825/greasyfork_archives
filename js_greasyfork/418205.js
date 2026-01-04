// ==UserScript==
// @name			Promoted pins remover
// @name:fr			Supprime les épingles sponsorisées
// @name:es			Removedor de alfileres promocionado
// @name:it			Promosso pin remover
// @name:de			Promoted Pins Entferner
// @namespace		https://github.com/amlette/greasy
// @version			1.1
// @description		Remove promoted pins on Pinterest
// @description:fr	Supprime les épingles sponsorisées sur Pinterest
// @description:es	Eliminar pines promocionados en Pinterest
// @description:it	Rimuovi i pin promossi su Pinterest
// @description:de	Entfernen Sie gesponserte Pins auf Pinterest
// @author			amlette
// @require			https://code.jquery.com/jquery-3.5.1.min.js
// @include			https://*.pinterest.*/*
// @downloadURL https://update.greasyfork.org/scripts/418205/Promoted%20pins%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/418205/Promoted%20pins%20remover.meta.js
// ==/UserScript==
$(document).ready(function() {
	var titleByLanguage = {
		en: "Sponsored",
		fr: "Sponsorisé",
		es: "Patrocinados",
		it: "Sponsorizzato",
		de: "Gesponsert"
	};
	var lang = $("html").attr("lang");
	var sponsorKeyword 	= titleByLanguage[lang];

	setInterval(function() {
		var node = $("div[title='"+sponsorKeyword+"']");
		for (var i = node.length - 1; i >= 0; i--) {
			var parent = $(node[i]).closest("div[data-grid-item]");
			$(parent).hide();
		}
	}, 1000);
});