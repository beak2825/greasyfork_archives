// ==UserScript==
// @name        MH - Raistlin - Add PX button to PM
// @namespace   MH
// @description Ajout d'un bouton "Don de PX" dans les PM
// @include     */Messagerie/ViewMessage.php*
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     2.0
// @grant       none
// @require     https://update.greasyfork.org/scripts/23602/Tout_MZ.user.js
// @downloadURL https://update.greasyfork.org/scripts/23815/MH%20-%20Raistlin%20-%20Add%20PX%20button%20to%20PM.user.js
// @updateURL https://update.greasyfork.org/scripts/23815/MH%20-%20Raistlin%20-%20Add%20PX%20button%20to%20PM.meta.js
// ==/UserScript==

// Récupération de la liste des destinataires + émetteur
function getPersoList() {
	var persoList = new Array();

	// Tous les liens sont des émetteurs ou des destinataires
	var listeBrute = document.getElementsByClassName("AllLinks");

	// Pour chaque lien, on récupère le premier nombre du lien : c'est le numéro de trõll
	// Pour rappel, le lien est du style : javascript:EnterPJView(61214,750,550)
	for (var i = 0 ; i < listeBrute.length ; i++) {
		tmpVar = listeBrute[i].toString().match(/\d+/);
		persoList[i] = tmpVar[0];
	}

	return persoList.join(',');
}

// Fonction utilisée quand on clique sur le bouton pour envoyer sur la page du don
function sendPX() {
	var urlCible = "/mountyhall/MH_Play/Play_a_Action.php?type=A&id=9&dest=";
	var persoList = getPersoList();
	urlCible += persoList;
	if (window.opener !== null) {
		window.opener.location = urlCible;
	} else {
		window.open(urlCible);
	}
	window.close();
}

// Ajout du bouton de don de PX avant le bouton Fermer
function addButton() {
	var insertPoint = document.getElementsByName('bAnswer')[0];

	// On ajoute le bouton de don de PX
	insertButton(insertPoint, 'Donner des PX', sendPX);

	// On ajoute un espace avant le bouton Fermer
	insertText(insertPoint, '        ');
}

if (isPage("Messagerie/ViewMessage.php")) {
	addButton();
}