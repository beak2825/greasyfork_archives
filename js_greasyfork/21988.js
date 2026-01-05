// ==UserScript==
// @name        MH - Raistlin - Keyboard shortcuts
// @namespace   MH
// @description Raccourcis clavier pour les compétences et sortilèges
// @include     *://games.mountyhall.com/*
// @include     *://mh2.mh.raistlin.fr/*
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.5
// @grant       none
// @require     https://greasyfork.org/scripts/23602-tout-mz?version=892175&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/21988/MH%20-%20Raistlin%20-%20Keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/21988/MH%20-%20Raistlin%20-%20Keyboard%20shortcuts.meta.js
// ==/UserScript==

// La liste des keyCodes est trouvable par exemple ici :
//      http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx
// La liste des constantes JS correspondante est trouvable par exemple ici :
//      http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants

/****************************************************************************************
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 *     UTILS                                                                            *
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 ****************************************************************************************/
function array_flip(trans) {
	var key, tmp_ar = {};
	for (key in trans) {
		if (trans.hasOwnProperty(key)) {
			tmp_ar[trans[key]] = key;
		}
	}
	return tmp_ar;
}

function getShortCutsArray() {
	// Tableau contenant la liste des raccourcis sous la forme C => 124
	var localShortCutsArray = new Array();
	var shortCutsList = window.localStorage['shortcutsList'];
	if ((shortCutsList == null) || (shortCutsList == undefined) || (shortCutsList == 'undefined')) {
		return new Array();
	}
	var firstArray = shortCutsList.split(';');
	for (var i = 0 ; i < firstArray.length - 1 ; i++) {
		secondArray = firstArray[i].split(':');
		if (secondArray[0].length > 0) {
			localShortCutsArray[secondArray[0]] = secondArray[1];
		}
	}
	return localShortCutsArray;
}

function insertBefore(next, el) {
	next.parentNode.insertBefore(el, next);
}

function insertTd(next) {
	var td = document.createElement('td');
	insertBefore(next, td);
	return td;
}

function appendText(paren, text, bold) {
	if (bold) {
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
	} else {
		paren.appendChild(document.createTextNode(text));
	}
}

function appendTextbox(paren, type, nam, size, maxlength, value) {
	var input = document.createElement('input');
	input.className = 'TextboxV2';
	input.type = type;
	input.name = nam;
	input.id = nam;
	input.size = size;
	input.maxLength = maxlength;
	if(value) input.value = value;
	paren.appendChild(input);
	return input;
}

function appendButton(paren, value, onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
}

/****************************************************************************************
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 *     GESTION DE LA PAGE PROFIL                                                        *
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 ****************************************************************************************/

/***********************************************************************
 * Ajout d'un th entre le nom et le niveau de maitrise d'une comp/sort *
 ***********************************************************************/
function addThToTr(tr) {
	// On ajoute le th
	var th = document.createElement('th');
	insertBefore(tr.childNodes[5], th);

	// Un peu de mise en page
	th.width = '65px';
	th.align = 'center';
}

/***********************************************************************
 * Ajout d'un td entre le nom et le niveau de maitrise d'une comp/sort *
 ***********************************************************************/
function addTdToTr(tr, talName) {
	var talNameString = '' + talName;
	if (talNameString.length < 2) {
		talName = '0' + talName;
	}

	// On ajoute le td
	var td = insertTd(tr.childNodes[5]);

	// On ajoute le texte
	appendText(td, 'AltGr+');

	// On ajoute la textbox
	tb = appendTextbox(td, 'text', talName, 1, 1, '');

	// On met a jour la valeur de la textbox si le cookie existe
	var reverseShortCutsArray = array_flip(shortCutsArray);
	tb.value = reverseShortCutsArray[talName];

	// Si c'est pas un caractere, on vide (c'est moche, mais c'est pour eviter les "undefined")
	if (tb.value.length > 1) {
		tb.value = '';
	}
}

/***********************************************************************
 * Sauvegarde des raccourcis dans le localStorage                      *
 ***********************************************************************/
function shortCutUpdate() {
	// La chaine qui stockera la liste des raccourcis non vides
	var shortCutsList = '';

	// Un tableau juste pour verifier l'absence de doublons
	var localShortCutsArray = new Array();

	for (var i = 0 ; i < talIds.length ; i++) {
		// On recupere la liste des inputs rajoutes par le script pour les comps et les sorts
		var snapShotInputs = document.evaluate('./tbody/tr/td/input[@class="TextboxV2"]', document.getElementById(talIds[i]), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		// On parcourt la liste des textbox des comps et des sorts
		for (var cpt = 0 ; cpt < snapShotInputs.snapshotLength ; cpt++) {
			// On recupere la textbox courante
			var currentInput = snapShotInputs.snapshotItem(cpt);

			// On sauve la valeur du raccourci pour l'affichage ulterieur
			if (currentInput.value.length > 0) {
				shortCutsList += currentInput.value + ':' + currentInput.name + ';';
				// Si on tombe sur un doublon, on arrete la sauvegarde
				if (currentInput.value in localShortCutsArray) {
					window.alert('Erreur : doublons dans les raccourcis');
					return;
				}
				localShortCutsArray[currentInput.value] = currentInput.name;
			}
		}
	}

	// On sauve la liste et on previent le joueur
	window.localStorage['shortcutsList'] = shortCutsList;

	// On met a jour les 2 frames (gauche et haut-droite) pour que les raccourcis soient immediatement pris en compte
	window.parent.parent.Sommaire.location.reload();
	window.parent.parent.Main.Contenu.location.reload();

	window.alert('Raccourcis sauvegard\u00E9s');
}

function mainProfil() {
	// Si on est sur le profil, on rajoute les champs dans les comps/sorts pour rajouter le raccourcis
	// Le champ est initialise avec la valeur du localStorage si elle existe
	for (var i = 0 ; i < talIds.length ; i++) {
		// On recupere la liste des lignes de competences et sorts
		var listeTal = document.getElementById(talIds[i]);

		// Pour chaque competence et sort, on rajoute un champ "input" de 1 caractere entre la comp et le %
		x_tals = listeTal.getElementsByTagName('tr');
		addThToTr(x_tals[0]);
		for (var cpt = 1 ; cpt < x_tals.length ; cpt++) {
			var talTarget = document.evaluate('./td/a[@target="Action"]', x_tals[cpt], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).getAttribute('href').match(/\d+/);

			// Le nom de la textbox est l'id
			addTdToTr(x_tals[cpt], talTarget);
		}
	}

	// On rajoute un tr/td sous la table pour rajouter le bouton save
	var footer2 = document.getElementById('footer2');
	saveDiv = document.createElement('div');
	insertBefore(footer2, saveDiv);

	// On rajoute un bouton pour sauvegarder dans le localStorage
	saveButton = appendButton(saveDiv, 'Mise a jour des raccourcis', shortCutUpdate);
}

/****************************************************************************************
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 *     GESTION DES RACCOURCIS                                                           *
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 ****************************************************************************************/
// Ajout des keyhandlers
function keyHandler(e) {
	// Recuperation du keyCode correspondant a la touche pressee
	var keyPressedCode = (e.keyCode ? e.keyCode : e.which);

	// Recuperation du caractere correspondant
	var talent = shortCutsArray[String.fromCharCode(keyPressedCode)];

	// On lance le raccourci, sauf si on est en train de remplir un champ texte (input ou textarea)
	if ((e.ctrlKey && e.altKey) && (document.activeElement.nodeName != 'INPUT') && (document.activeElement.nodeName != 'TEXTAREA')) {
		window.parent.parent.Main.Action.location = '?ai_ToDo=' + talent;
	}
}

/****************************************************************************************
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 *     MAIN                                                                             *
 *++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*
 ****************************************************************************************/
// Tableau contenant les raccourcis : en variable globale (beuh)
shortCutsArray = getShortCutsArray();

var talIds = ['competences', 'sortileges'];

// Ajout des champs sur le profil
if (window.self.location.toString().indexOf('MH_Play/Play_profil2.php') !== -1) {
	mainProfil();
}

// Si on n'est pas sur le profil, on peut declencher les raccourcis (c'est pour eviter de lancer des raccourcis existants quand on essaye d'en mettre d'autres)
if (window.self.location.toString().indexOf('') !== -1) {
	document.addEventListener('keypress', keyHandler, true);
}