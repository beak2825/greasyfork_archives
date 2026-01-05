// ==UserScript==
// @name        MH - Marmotte - Messagerie
// @namespace   MH
// @description Aperçu des MPs et Gestion des "Re"
// @include     */Messagerie/MH_Messagerie.php?cat=3*
// @include     */Messagerie/ViewMessage.php?answer=1*
// @exclude     *trolls.ratibus.net*
// @exclude     *it.mh.raistlin.fr*
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.10
// @grant       none
// @require     https://greasyfork.org/scripts/23602-tout-mz?version=892175&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/21984/MH%20-%20Marmotte%20-%20Messagerie.user.js
// @updateURL https://update.greasyfork.org/scripts/21984/MH%20-%20Marmotte%20-%20Messagerie.meta.js
// ==/UserScript==

// vérif UTF-8 éê

/*
 * Script MZ : Affiche un aperçu lors de l'écriture des MP / Blocs Html
 *             Gère les 'Re :' multiples dans les titres
 * Auteurs :   Bandedrubor (93138) / Kassbinette (95429) / disciple (62333) / Accaorrillia (71876)
 * V1.2 Rouletabille (91305) 27/03/2016, adaptation Fx 45 (détection de la page, localStorage)
 * V1.2.1 Rouletabille 	simplification de l'entête GM (include) + passage à greasyfork
 * V1.2.2 Rouletabille 	exclusion du site Bricoll'Troll
 */

/* Lancement du script selon la page chargée */

// Roule : isPage() n'est plus utilisable
var lien = window.self.location.toString();
if (lien.indexOf("Messagerie/MH_Messagerie.php?cat=3") != -1) {
	// Ajout d'un bouton après le bouton "Envoyer"
	function addButton(caption, clickFunction) {
		var sendButton = document.getElementsByName('bsSend')[0];
		var newButton = document.createElement('input');
		newButton.setAttribute('type', 'button');
		newButton.setAttribute('class', 'mh_form_submit');
		newButton.setAttribute('value', caption);
		newButton.addEventListener('click', clickFunction, true);
		sendButton.parentNode.appendChild(document.createTextNode(' '));
		sendButton.parentNode.appendChild(newButton);
	};

	function wordWrap(str, width, brk, cut) {
		brk = brk || '\n';
		width = width || 75;
		cut = cut || false;
		if (!str) {
			return str;
		}
		var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
		return str.match(RegExp(regex, 'g')).join(brk);
	}

	// Affichage de l'aperçu
	function display() {
		tdPreview.innerHTML = "<div style='white-space: pre-line;'>" + wordWrap(messageArea.value) + "</div>";
	};

	// Sauvegarde du MP
	function save() {
		if (titleInput.value != '') {
			MY_setValue('lastMPTitle', titleInput.value);
		}
		if (messageArea.value != '') {
			MY_setValue('lastMP', messageArea.value);
		}
	};

	// Restauration du MP sauvegardé
	function restore() {
		if (MY_getValue('lastMPTitle')) {
			titleInput.value = MY_getValue('lastMPTitle');
		}
		if (MY_getValue('lastMP')) {
			messageArea.value = MY_getValue('lastMP');
		}
		display();
	};

	// Restauration du MP sauvegardé
	function reply() {
		if (MY_getValue('lastReply')) {
			messageArea.value = MY_getValue('lastReply');
		}
		display();
	};

	/* Ajout de disciple (62333) */
	//-- Trõlldûctéûr --
	function trollducteur() {
		messageArea.value = messageArea.value
			.replace(/°*y°*/g, '°y°')
			.replace(/a/g, 'à')
			.replace(/e/g, 'é')
			.replace(/i/g, 'ï')
			.replace(/o/g, 'õ')
			.replace(/u/g, 'û')
			.replace(/A/g, 'À')
			.replace(/E/g, 'É')
			.replace(/I/g, 'Ï')
			.replace(/O/g, 'Õ')
			.replace(/U/g, 'Û');
		display();
	};

	//-- ajout string mettant un bloc 'quote' --
	function addQuote()      { addTagToSelectedText("<fieldset><legend></legend>", "</fieldset>"); };
	function addBold()       { addTagToSelectedText("<b>", "</b>"); };
	function addItalic()     { addTagToSelectedText("<i>", "</i>"); };
	function addUnderscore() { addTagToSelectedText("<u>", "</u>"); };

	function addTagToSelectedText(startTag, endTag) {
		var len = messageArea.value.length;
		var start = messageArea.selectionStart;
		var end = messageArea.selectionEnd;
		var sel = messageArea.value.substring(start, end);
		if (sel == "" || sel == null) {
			sel = "Copier le texte ici";
		}

		// This is the selected text and alert it
		var replace = startTag + sel + endTag;

		// Here we are replacing the selected text with this one
		messageArea.value = messageArea.value.substring(0, start) + replace + messageArea.value.substring(end, len);
	}

	// Titre du MP - Remplace les "Re:" ou "Re(n):" par un simple 'Re(n):"
	var titleInput = document.getElementsByName('Titre')[0];
	if (titleInput && titleInput.value != '') {
		myarray = titleInput.value.match(/(Re\s+:)/g);
		var myarray2 = titleInput.value.match(/Re\(\d+\)\s+:/g); // Extract the Re(n) to an array like [Re(n),Re(o),Re(p)...]
		if (myarray2 == null) {
			titleInput.value = titleInput.value.replace(/^(Re\s+:\s+)*/, "Re(" + myarray.length + ") : ");
		} else {
			var ctr = 0;
			myarray2 = myarray2.join();		// Transform the array to a string in order to be able to use the match function
			myarray2 = myarray2.match(/\d+/g);	// Extract the numbers only in an array
			for (var i = 0 ; i < myarray2.length ; i++) {
				// La multiplication par 1 est pour transformer la string en number
				ctr = ctr + (myarray2[i] * 1);
			}
			titleInput.value = titleInput.value.replace(/^Re(.*)\s+:\s+/, "Re(" + (myarray.length + ctr) + ") : ");
		}
	}

	// Case de texte du MP
	var messageArea = document.getElementsByName('Message')[0];

	// Aperçu à la frappe
	messageArea.addEventListener('change', display, true);
	messageArea.addEventListener('keyup', display, true);

	// Ajout de la ligne d'affichage de l'aperçu
	var trPreview = document.createElement('tr');
	trPreview.setAttribute('class', 'mh_tdpage');
	var tdPreview = document.createElement('td');
	tdPreview.setAttribute('colspan', 4);
	trPreview.appendChild(tdPreview);
	document.getElementsByName('bsSend')[0].parentNode.parentNode.parentNode.appendChild(trPreview);

	// Enregistrement du message à l'envoi
	document.getElementsByName('bsSend')[0].addEventListener('click', save, true);

	// Ajout du bouton d'aperçu
	addButton('Aperçu', display);

	// Ajout du bouton de sauvegarde
	addButton('Sauvegarder', save);

	// Ajout du bouton de restauration
	addButton('Rappeler le dernier message', restore);

	// Ajout du bouton de citation
	addButton('Citer en réponse', reply);

	// Ajout du bouton du trollducteur
	addButton('Trõlldûctéûr', trollducteur);

	addButton('B', addBold);
	addButton('I', addItalic);
	addButton('S', addUnderscore);
	addButton('Quote', addQuote);
} else if (lien.indexOf("Messagerie/ViewMessage.php?answer=1") != -1) {
	/* Ajout de disciple (62333) */
	function reply(e) {
		var reply = document.evaluate("//table/tbody/tr[5]/td", document, null, XPathResult.ANY_TYPE, null).iterateNext().innerHTML;
		//reply = wordWrap(reply, 73);
		reply = '> ' + reply.replace(/<br>/gm, '\n> ');
		MY_setValue('lastReply', reply + '\n\n');
	};

	document.getElementsByName('bAnswer')[0].addEventListener('click', reply, true);
	document.getElementsByName('bAnswerToAll')[0].addEventListener('click', reply, true);
}