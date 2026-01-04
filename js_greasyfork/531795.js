// ==UserScript==
// @name        	DC - Logicielle Chat Enhancer
// @namespace   	DreadCast
// @include     	https://www.dreadcast.net/Main
// @author 	        Logicielle
// @date 		    04/04/2025
// @version 		1.0
// @description 	Amélioration du chat du jeu. Idée originale par Odul, ici un peu améliorée. Texte entre étoiles de la même couleur que les actions pour les toutes les commandes du chat. Doit être placé en premier (ou du moins plus haut que DCCE, ou autre script modifiant le chat que vous utilisez) dans votre liste de scripts dans Tampermonkey. Ne fonctionne pas si les modes chuchotement et cri (natifs au jeu) sont activés.
// @compat 	        Firefox, Chrome
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531795/DC%20-%20Logicielle%20Chat%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/531795/DC%20-%20Logicielle%20Chat%20Enhancer.meta.js
// ==/UserScript==


$(document).ready(function() {

	//Couleurs dans le chat:
	var chatBox = $('#chatForm .text_chat').eq(0);
	chatBox.keypress(function(event) {
		 if ( event.which == 13 ) {
			var text = chatBox.val();
			if(text.substr(0,3) == '/me'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}if(text.substr(0,2) == '/w'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=999999][i]$1[/i][/couleur]");
			}if(text.substr(0,4) == '/wme'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}if(text.substr(0,2) == '/y'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=D32929][i]$1[/i][/couleur]");
			}if(text.substr(0,4) == '/yme'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}else{
                text = text.replace(/\$R([^\*]+)\$R/gi, "[couleur=FF0000]$1[/couleur]");
			    text = text.replace(/\$V([^\*]+)\$V/gi, "[couleur=09A323]$1[/couleur]");
			    text = text.replace(/\$B([^\*]+)\$B/gi, "[couleur=0000FF]$1[/couleur]");
			    text = text.replace(/\$J([^\*]+)\$J/gi, "[couleur=FFFF00]$1[/couleur]");
				text = text.replace(/\$I([^\*]+)\$I/gi, "[i]$1[/i]");
                text = text.replace(/\$G([^\*]+)\$G/gi, "[b]$1[/b]");
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=58DCF9][i]$1[/i][/couleur]");
			}
			chatBox.val(text);
		}
	});
});