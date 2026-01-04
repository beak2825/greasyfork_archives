// ==UserScript==
// @name Dark Theme for Dreadcast
// @namespace github.com/openstyles/stylus
// @version 1.4.3
// @description Dreadcast sans violence pour les yeux.
// @author Victoire, Tex
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Main
// @downloadURL https://update.greasyfork.org/scripts/448317/Dark%20Theme%20for%20Dreadcast.user.js
// @updateURL https://update.greasyfork.org/scripts/448317/Dark%20Theme%20for%20Dreadcast.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Fond zone gauche */
	#zone_gauche_inventaire {
		background: none 0 0 no-repeat;
	}
	#zone_gauche {
		width: 100%;
		background-image: url(https://i.imgur.com/jmipu1D.png);
		background-size: 100%;
	}

	.grid_head_travail_logement .btn.link.infoAide {
		background-color: #fff0;
		color: rgb(0 204 255 / .5);
	}
	#statsInventaire, #statsInventaire, #statsInventaire, #stockInventaire, #stockInventaire, #stockInventaire {
		color: rgb(0 204 255 / .5);
		background: #fff0;
		text-shadow: 1px 1px 1px #000;
		border: 1px solid rgb(0 204 255 / .5);
	}
	#ciseauxInventaire.hover, #ciseauxInventaire.selected, #ciseauxInventaire:hover, #poubelleInventaire.hover, #poubelleInventaire.selected, #poubelleInventaire:hover, #statsInventaire.hover, #statsInventaire.selected, #statsInventaire:hover, #stockInventaire.hover, #stockInventaire.selected, #stockInventaire:hover {
		color: rgb(0 204 255 / .5);
		background: #fff0;
		text-shadow: 1px 1px 1px #000;
		border: 1px solid rgb(0 204 255 / .5);
	}

	/* Fonds sacs */
	.zone_conteneurs_displayed .conteneur .conteneur_content,
	#infoBox,
	.infoBoxFixed,
	#interface_achat.colorize {
		background-color: rgba(0, 0, 0, .75);
	}
	.dataBox .content {
		background-color: rgba(0, 0, 0, .75);
	}
	.case_objet.linkBox::before,
	.case_objet.linkBox::after {
		display: none;
	}

	/* Accomplissements */
	#acc_carte {
		background: #0000007d;
		box-shadow: 0 0 10px -1px #000;
	}
	#acc_carte_content {
		box-shadow: 15px 15px 75px inset #28282673, -15px -15px 75px inset #000000a1;
		background: #28282680;
	}

	/* Fond des cases meuble */
	.meuble_inventaire .case_objet.linkBox_vide {
		background-image: none;
	}
	span.couleur0 {
		color: #7f7f7f
	}

	/* Fond zone droite */
	#zone_droite {
		background-image: url(https://i.imgur.com/C4yZ5hm.png);
		background-size: 100%;
	}

	#zone_gauche_inventaire,
	#zone_droite > .grid > .grid.top,
	#zone_chat_bg {
		background: none;
		box-shadow: none;
	}

	#zone_chat #onglets_chat li.selected {
		color: #c0cad2;
		background: #4a4343;
	}
	#zone_chat #onglets_chat li {
		color: #c0cad2;
	}

	/* Fond chat */
	#zone_chat_bg {
		background: rgba(255, 0, 0, 0);
		box-shadow: 0 0 15px -5px inset rgba(255, 238, 0, .03);
	}
	.hologram img {
		width: 0%;
	}

	/* Messagerie */
	div[id^="db_message_"] {
		background: rgba(23, 64, 89, .32);
	}
	.avatar {
		width: 70px;
		height: 70px;
	}
	ul {
		background: #f000;
	}
	.dataBox .message {
		left: -2%;
	}
	.message .zone_reponse #nm_texte textarea {
		background: #ffffffab;
	}

	.dataBox .head {
			background: linear-gradient(to bottom,rgb(0, 0, 0) 0,#000000bf 100%);
	}
	.dataBox .message .contenu {
		background: rgba(43, 50, 51, .3);
	}

	.dataBox .close, .dataBox .reduce, .btnTxt, #zone_carnet .btn, #zone_carnet .btnTxt, #zone_messagerie .btnTxt {
		box-shadow: 0 2rem 1rem 0.5rem inset #282e2f;
		background-color: #fff0;
		color: rgba(255, 255, 255, .97);
		border: 1px solid #777f84
	}

	.dataBox .close:hover, .dataBox .reduce:hover, .btnTxt:hover {
		background-color: #455155;
		box-shadow: 0 2rem 1rem 0.5rem inset #4a5253;
	}

	#liste_adresses .header .btnTxt, #liste_contacts .content .btnTxt, #liste_contacts .header .btnTxt, #liste_messages .header .btnTxt {
		color: rgba(255, 255, 255, .97);
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
