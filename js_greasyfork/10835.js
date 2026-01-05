// ==UserScript==
// @name AmeliorationTchatActionAuto
// @namespace InGame
// @author Odul
// @date 05/12/2013
// @version 1.0
// @description Ameliore l'utilisation des balises /me combinée aux couleurs. Adaptation du script de Gideon pour la version de l'interface précédente. Fourni avec un exemple d'action RP auto.
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include http://www.dreadcast.net/Main
// @compat Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/10835/AmeliorationTchatActionAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/10835/AmeliorationTchatActionAuto.meta.js
// ==/UserScript==

	var ameliorInput = function(e) { 
		if (e.keyCode==13) {
		     value = $("#chatForm .text_chat").val();
						console.log(value);

		     value = value.replace(/\*([^\*]+)\*/gi, "[couleur=7BEEFF][i]$1[/i][/couleur]");
		
           value = value.replace(/\*([^\*]+)\*/gi, "[couleur=7BEEFF][i]$1[/i][/couleur]");

           value = value.replace(/(^\/mea1.+?)([^\"]+)/gi, "/me l'achève d'un coup de lame dans la tête");

           value = value.replace(/(^\/mean1.+?)([^\"]+)/gi, "/me achève $2 d'un coup de lame dans la tête");

	      
		    $("#chatForm .text_chat").val(value);
			console.log(value);

		do {
			$("#chatForm .text_chat").val($("#chatForm .text_chat").val().replace(/(^\/me.+?)"([^\"]+)"/gi, "$1[couleur=FFFFFF]$2[/couleur]"));
		}while (/(^\/me.+?)"([^\"]+)"/i.test($("#chatForm .text_chat").val()));

		}
	}

	document.addEventListener('keypress', ameliorInput, false);
	
	
	

    