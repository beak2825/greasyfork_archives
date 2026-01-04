// ==UserScript==
// @name         [Mountyhall] Sauvegarde Message
// @namespace    Mountyhall
// @description  Suvegarde locale du message en cas de déconnexion serveur
// @author       Dabihul
// @version      0.0.3.0
// @include      */mountyhall/Messagerie/MH_Messagerie.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407064/%5BMountyhall%5D%20Sauvegarde%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/407064/%5BMountyhall%5D%20Sauvegarde%20Message.meta.js
// ==/UserScript==

// Châïné âccéntùéé põùr fõrcér l'UTF-8

window.console.debug('[Sauvegarde message] ON!');

function getMessage() {
	let node = document.getElementsByName('Message')[0];
	if (!node) {
		window.alert('[Sauvegarde message] Emplacement du message non trouvé');
		return '';
	}
	window.console.debug('[Sauvegarde message] Message sauvegardé:\n', node.value);
	return node.value;
}

function saveMessage(event) {
	window.localStorage['mountyhall.message'] = getMessage();
}

function recallMessage() {
	let message = window.localStorage.getItem('mountyhall.message');
	if (!message) {
		window.alert('[Sauvegarde message] Aucun message trouvé');
		return;
	}
	let node = document.getElementsByName('Message')[0];
	node.value = message;
}

function alterForm() {
	let form = document.evaluate(
		'//form[@name="ComposeMsgForm"]',
		document, null, 9, null
	).singleNodeValue;
	if (!form) {
		window.alert('[Sauvegarde message] Formulaire de messagerie non trouvé');
		return;
	}
	form.addEventListener('submit', saveMessage, true);
}

function addBoutonRappel() {
	let messageTd = document.evaluate(
		'//label[@for="Message"]/..',
		document, null, 9, null
	).singleNodeValue;
	if (!messageTd) {
		window.alert('[Sauvegarde message] TD "Message" non trouvé');
		return;
	}
	let bouton = document.createElement('input');
	bouton.type = 'button';
	bouton.value = 'Rappeler';
	bouton.style = 'display:block;';
	bouton.className = 'mh_form_submit';
	bouton.onclick = recallMessage;
	messageTd.appendChild(bouton);
}

const UrlParams = new URLSearchParams(window.location.search);
if (UrlParams.get('cat') && UrlParams.get('cat') == 3) {
	alterForm();
	addBoutonRappel();
}

window.console.debug('[Sauvegarde message] OFF!');
