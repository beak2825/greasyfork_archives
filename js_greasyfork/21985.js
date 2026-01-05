// ==UserScript==
// @name        MH - Marmotte - MZ no CSS
// @namespace   MH
// @description Gestion de la CSS pour MZ
// @include     */View/PJView*
// @include     */View/AllianceView.php*
// @include     */View/AllianceView_Membres.php*
// @include     */View/AllianceView_Affinite.php*
// @include     */MH_Play/Options/Play_o_css.php
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     1.6
// @grant       none
// @require     https://greasyfork.org/scripts/23602-tout-mz?version=892175&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/21985/MH%20-%20Marmotte%20-%20MZ%20no%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/21985/MH%20-%20Marmotte%20-%20MZ%20no%20CSS.meta.js
// ==/UserScript==

/*
 * Script MZ : Affiche un aperçu lors de l'écriture des MP
 * Auteur : Bandedrubor (93138)
 */

var defaultBaseCss = 'https://games.mountyhall.com/mountyhall/MH_PageUtils/MH_Style_ProfilSimple.css';
var defaultSimpleCss = 'https://games.mountyhall.com/MH_Packs/packMH_parchemin/css/MH_Style_Play.css';
var defaultAdvancedCss = 'https://games.mountyhall.com/mountyhall/MH_PageUtils/MH_Style_ProfilAvance.css';
var defaultGuildCss = 'https://games.mountyhall.com/MH_Packs/packMH_parchemin/css/MH_Style_Play.css';

/* Effectue le changement de CSS */
function replace() {
	if (customCss) {
		// Profil avec une CSS personnalisée
		if (window.localStorage['nocss_replace']) {
			customStylesheet.href = defaultCss;
		} else {
			customStylesheet.href = customCss;
		}
	} else {
		// Profil sans personnalisation
		if (window.localStorage['nocss_replace']) {
			baseStylesheet.href = defaultBaseCss;
			customStylesheet.disabled = false;
		} else {
			baseStylesheet.href = baseCss;
			customStylesheet.disabled = true;
		}
	}
}

/* Change l'option de CSS */
function changeCss() {
	window.localStorage['nocss_replace'] = !window.localStorage['nocss_replace'];
	replace();
}

// URL des CSS à utiliser
var baseCss = customCss = defaultCss = '';

// Elément à modifier pour effectuer le changement de CSS
var baseStylesheet = customStylesheet = null;

if (window.self.location.toString().indexOf("View/PJView") !== -1) {
	// Partie du script exécutée sur le profil public des trolls
	if (document.getElementById('pjLinks')) {
		// Profil avancé
		customStylesheet = document.getElementsByTagName('link')[1];
		if (customStylesheet) {
			customCss = customStylesheet.href;
			defaultCss = window.localStorage['nocss_advancedcss'];
		}
	} else {
		// Profil simple
		customStylesheet = document.getElementsByTagName('link')[2];
		if (customStylesheet) {
			customCss = customStylesheet.href;
			defaultCss = window.localStorage['nocss_simplecss'];
		} else {
			baseStylesheet = document.getElementsByTagName('link')[1];
			baseCss = baseStylesheet.href;

			customStylesheet = document.createElement('link');
			customStylesheet.setAttribute('rel', 'stylesheet');
			customStylesheet.setAttribute('type', 'text/css');
			customStylesheet.setAttribute('href', window.localStorage['nocss_simplecss']);
			document.getElementsByTagName('head')[0].appendChild(customStylesheet);
		}
	}
} else if (window.self.location.toString().indexOf("View/AllianceView.php") !== -1 || window.self.location.toString().indexOf("View/AllianceView_Membres.php") !== -1 || window.self.location.toString().indexOf("View/AllianceView_Affinite.php") !== -1) {
	// Partie du script exécutée sur le profil public des trolls
	customStylesheet = document.getElementsByTagName('link')[2];
	if (!customStylesheet) {
		customStylesheet = document.getElementsByTagName('link')[1];
	}
	if (customStylesheet) {
		customCss = customStylesheet.href;
		defaultCss = window.localStorage['nocss_guildcss'];
	}
} else if (window.self.location.toString().indexOf("MH_Play/Options/Play_o_css.php") !== -1) {
	// Options du script, affichées dans la page d'apparence du profil
	/* Ajoute une ligne d'options dans le tableau */
	function addOption(caption, name, type, defaultValue) {
		var optionsRow = document.createElement('tr');
		var optionsTitle = document.createElement('td');
		optionsTitle.setAttribute('style', 'padding:2px;text-align:right;width:250px;font-weight:bold;');
		var optionsLabel = document.createElement('label');
		optionsLabel.setAttribute('for', name);
		optionsLabel.appendChild(document.createTextNode(caption));
		optionsTitle.appendChild(optionsLabel);
		optionsRow.appendChild(optionsTitle);
		var optionsContent = document.createElement('td');
		optionsContent.setAttribute('style', 'padding:2px;');
		var optionsInput = document.createElement('input');
		optionsInput.setAttribute('class', 'TextboxV2');
		optionsInput.setAttribute('type', type);
		optionsInput.setAttribute('size', 75);
		optionsInput.setAttribute('id', name);
		if (type == 'checkbox' && window.localStorage[name]) {
			optionsInput.setAttribute('checked', true);
		}
		if (window.localStorage[name] && window.localStorage[name] != '') {
			optionsInput.setAttribute('value', window.localStorage[name]);
		} else if (defaultValue) {
			optionsInput.setAttribute('value', defaultValue);
		}
		optionsContent.appendChild(optionsInput);
		optionsRow.appendChild(optionsContent);
		optionsTable.appendChild(optionsRow);

		// Ajout de l'option dans le tableau des options modifiables
		optionsArray[name] = new Array();
		optionsArray[name]['type'] = type;
		if (defaultValue) {
			optionsArray[name]['defaultValue'] = defaultValue;
		}
	}

	/* Modifie la valeur d'une option */
	function saveOptions() {
		for (var name in optionsArray) {
			var type = optionsArray[name]['type'];
			var defaultValue = optionsArray[name]['defaultValue'];
			var value = document.getElementById(name).value;
			if (defaultValue && (!value || value == '')) {
				value = defaultValue;
				document.getElementById(name).value = value;
			}
			if (type == 'checkbox') {
				value = document.getElementById(name).checked;
			}
			window.localStorage[name] = value;
		}
	}

	// Tableau des options d'affichage de CSS
	var optionsArray = new Array();
	var optionsTable = document.createElement('table');
	optionsTable.setAttribute('class', 'mh_tdtitre');
	optionsTable.setAttribute('cellspacing', '0');
	optionsTable.setAttribute('cellpadding', '0');
	optionsTable.setAttribute('style', 'width:98%;border:1px solid black;');

	// Ligne d'en tête
	var optionsHeaderRow = document.createElement('tr');
	var optionsHeaderContent = document.createElement('th');
	optionsHeaderContent.setAttribute('colspan', '2');
	optionsHeaderContent.appendChild(document.createTextNode('Affichage des profils publics'));
	optionsHeaderRow.appendChild(optionsHeaderContent);
	optionsTable.appendChild(optionsHeaderRow);

	// Ligne d'options
	addOption('Remplacer la CSS', 'nocss_replace', 'checkbox');
	addOption('Afficher un bouton dans le profil public', 'nocss_displaybutton', 'checkbox');
	addOption('CSS de remplacement Simple', 'nocss_simplecss', 'text', defaultSimpleCss);
	addOption('CSS de remplacement Avancée', 'nocss_advancedcss', 'text', defaultAdvancedCss);
	addOption('CSS de remplacement Guilde', 'nocss_guildcss', 'text', defaultGuildCss);

	// Bouton de validation
	var optionsFooter = document.createElement('tr');
	optionsFooter.appendChild(document.createElement('td'));
	var optionsFooterContent = document.createElement('td');
	var optionsSaveButton = document.createElement('input');
	optionsSaveButton.setAttribute('class', 'mh_form_submit');
	optionsSaveButton.setAttribute('type', 'button');
	optionsSaveButton.setAttribute('Value', 'Sauvegarder');
	optionsSaveButton.addEventListener('click', saveOptions, true);
	optionsFooterContent.appendChild(optionsSaveButton);
	optionsFooter.appendChild(optionsFooterContent);
	optionsTable.appendChild(optionsFooter);

	optionsTable.appendChild(document.createElement('br'));

	// Affichage du tableau d'options
	var bottom = document.getElementsByTagName('table')[9];
	bottom.parentNode.insertBefore(optionsTable, bottom.nextSibling);
	bottom.parentNode.insertBefore(document.createElement('hr'), bottom.nextSibling);
}

if (customStylesheet) {
	// Affichage du bouton si demandé
	if (window.localStorage['nocss_displaybutton']) {
		var changeButton = document.createElement('input');
		changeButton.setAttribute('type', 'button');
		changeButton.setAttribute('value', 'Changer de CSS');
		changeButton.setAttribute('style', 'background:white!important;color:black!important;padding:0px!important;margin:0px!important;border:1px solid black!important;font-size:10pt!important;font-family:Verdana!important;font-weight:normal!important;width:113px!important;height:18px!important;-moz-border-radius:0px!important;');
		changeButton.addEventListener('click', changeCss, true);

		var changeDiv = document.createElement('div');
		changeDiv.setAttribute('style', 'position:fixed!important;top:0px!important;left:0px!important;padding:0px!important;margin:0px!important;width:15px!important;height:15px!important;');
		document.body.appendChild(changeDiv);

		changeDiv.addEventListener('mouseover', function() { changeDiv.appendChild(changeButton); }, true);
		changeDiv.addEventListener('mouseout', function() { changeDiv.innerHTML = ''; }, true);
		changeButton.addEventListener('mouseover', function() { changeDiv.appendChild(changeButton); }, true);
		changeButton.addEventListener('mouseout', function() { changeDiv.innerHTML = ''; }, true);
	}
	// Remplacement de la CSS si nécessaire
	replace();
}