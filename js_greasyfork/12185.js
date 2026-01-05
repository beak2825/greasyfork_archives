// ==UserScript==
// @name        	DC - Chat Enhancer
// @namespace   	DreadCast
// @author 	        Logicielle
// @date 		    03/09/2015
// @version 		1.0
// @description 	Amélioration du chat du jeu. Idée originale par Odul, adapté par Ianouf, puis ici un peu améliorée. Texte entre étoiles de la même couleur que les lignes de /me. Ajout des mêmes fonctionnalités (étoiles et guillemets) pour les commandes /w, /wme, /we, /weme, /wi, /wime, /y, /yme, /ye, /yeme, /yi, et /yime. Ne fonctionne pas si les modes chuchotement et cri (natifs au jeu) sont activés.
// @license         WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include     	http://www.dreadcast.net/Main
// @compat 	        Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/12185/DC%20-%20Chat%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/12185/DC%20-%20Chat%20Enhancer.meta.js
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
			}if(text.substr(0,3) == '/we'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=999999][i]$1[/i][/couleur]");
			}if(text.substr(0,3) == '/wi'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=999999][i]$1[/i][/couleur]");
			}if(text.substr(0,4) == '/wme'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}if(text.substr(0,5) == '/weme'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}if(text.substr(0,5) == '/wime'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}if(text.substr(0,2) == '/y'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=D32929][i]$1[/i][/couleur]");
			}if(text.substr(0,3) == '/ye'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=D32929][i]$1[/i][/couleur]");
			}if(text.substr(0,3) == '/yi'){
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=D32929][i]$1[/i][/couleur]");
			}if(text.substr(0,4) == '/yme'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}if(text.substr(0,5) == '/yeme'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}if(text.substr(0,5) == '/yime'){
				text = text.replace(/\"([^\*]+)\"/gi, "[couleur=FFFFFF]$1[/couleur]");
			}else{
                text = text.replace(/\*R([^\*]+)\*R/gi, "[couleur=FF0000]$1[/couleur]");
			    text = text.replace(/\*V([^\*]+)\*V/gi, "[couleur=09A323]$1[/couleur]");
			    text = text.replace(/\*B([^\*]+)\*B/gi, "[couleur=0000FF]$1[/couleur]");
			    text = text.replace(/\*J([^\*]+)\*J/gi, "[couleur=FFFF00]$1[/couleur]");
				text = text.replace(/\*I([^\*]+)\*I/gi, "[i]$1[/i]");
                text = text.replace(/\*G([^\*]+)\*G/gi, "[b]$1[/b]");
				text = text.replace(/\*([^\*]+)\*/gi, "[couleur=58DCF9][i]$1[/i][/couleur]");
			}
			chatBox.val(text);
		}
	});
});
