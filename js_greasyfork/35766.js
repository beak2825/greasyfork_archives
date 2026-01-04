// ==UserScript==
// @name         Ocultar - Voxed
// @namespace    Ocultar - Voxed
// @version      0.1
// @description  Oculta comentarios que contengan determinado texto.
// @author       Leayre
// @match        http*://www.voxed.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35766/Ocultar%20-%20Voxed.user.js
// @updateURL https://update.greasyfork.org/scripts/35766/Ocultar%20-%20Voxed.meta.js
// ==/UserScript==

var nop = ["culobi", "lo que quieras lo ponés acá", "o acá también", ];
$(".content").each(function(i){
	for(var xd = 0; xd !== nop.length; ) {
		if ( $(this).text().toLowerCase().indexOf(nop[xd].toLowerCase()) !== -1) {
			$(this).closest('div').remove();
			console.log($(this).text());
			break;
		}
		xd++;
	}
});