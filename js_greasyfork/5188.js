// ==UserScript==
// @name        Batoto Language Fastswich
// @namespace   http://bato.to/scripts
// @version     2-beta
// @description Adds language switching buttons to comic page
// @include     http://*bato.to/comic/_/comics/*
// @grant       none
// @copyright   2014+, Gendalph
// @licence     MIT
// @downloadURL https://update.greasyfork.org/scripts/5188/Batoto%20Language%20Fastswich.user.js
// @updateURL https://update.greasyfork.org/scripts/5188/Batoto%20Language%20Fastswich.meta.js
// ==/UserScript==

// 
// FIXME!
// ADD BUTTONS
// MAKE INTO USERSCRIPT
// 

(function() {
	"use strict";
	if (document.cookie.match(/lang_option=[\w%]+/)) {
		console.error('[Batoto Language Fastswich] This script works only if language filter is disabled');
		return;
	}

	// list of supported languages
	var languages = [".lang_English", ".lang_Spanish", ".lang_French", ".lang_German", ".lang_Portuguese",
		".lang_Turkish",
		".lang_Indonesian", ".lang_Greek", ".lang_Filipino", ".lang_Italian", ".lang_Polish", ".lang_Thai", ".lang_Malay",
		".lang_Hungarian", ".lang_Romanian", ".lang_Arabic", ".lang_Hebrew", ".lang_Russian", ".lang_Vietnamese",
		".lang_Dutch"
	];

	var langBtnCssClass = [
		'.topic_buttons li > input[type="checkbox"] { display: none; }',

		'div .flag-icon {',
		'	background-image: url("http://bato.to/images/all_flags.png");',
		'	width: 16px;',
		'	height: 12px;',
		'	display: inline-block;',
		'	margin-left: 3px;',
		'	vertical-align: middle;',
		'}',

		'.topic_buttons li > input[type="checkbox"]:checked + label div {',
		'	border-left: solid green 3px;',
		'	margin-left: 0px;',
		'}',

		'#btn_English + label > div { background-position: -284px -173px; }',
		'#btn_Spanish + label > div { background-position: -4px -173px; }',
		'#btn_French + label > div { background-position: -228px -173px; }',
		'#btn_German + label > div { background-position: -284px -117px; }',
		'#btn_Portuguese + label > div { background-position: -4px -453px; }',
		'#btn_Turkish + label > div { background-position: -116px -537px; }',
		'#btn_Indonesian + label > div { background-position: -256px -229px; }',
		'#btn_Greek + label > div { background-position: -256px -201px; }',
		'#btn_Filipino + label > div { background-position: -116px -425px; }',
		'#btn_Italian + label > div { background-position: -172px -257px; }',
		'#btn_Polish + label > div { background-position: -172px -425px; }',
		'#btn_Thai + label > div { background-position: -228px -509px; }',
		'#btn_Malay + label > div { background-position: -200px -369px; }',
		'#btn_Hungarian + label > div { background-position: -228px -229px; }',
		'#btn_Romanian + label > div { background-position: -144px -509px; }',
		'#btn_Arabic + label > div { background-position: -200px -453px; }',
		'#btn_Hebrew + label > div { background-position: -4px -257px; }',
		'#btn_Russian + label > div { background-position: -144px -453px; }',
		'#btn_Vietnamese + label > div { background-position: -256px -565px; }',
		'#btn_Dutch + label > div { background-position: -200px -313px; }'
	].join('\n');

	//
	// End of initialization
	//

	addStyles(langBtnCssClass);
	addButtons();
	addClearBtn();

	// generates and adds language select buttons to DOM
	function addButtons() {
		var buttons = "",
			buttonsDiv = btnDivSelector();
		for (var i = languages.length - 1; i >= 0; i--) {
			buttons += generateFlagBtnHTML(languages[i]);
		}

		buttonsDiv.insertAdjacentHTML('beforeend', buttons);

		buttons = document.querySelectorAll('.topic_buttons li > input[type="checkbox"]');
		for (var j = buttons.length - 1; j >= 0; j--) {
			buttons[j].onclick = cbOnClick;
		}
	}

	function addClearBtn() {
		var buttonsDiv = btnDivSelector(),
			HTML = '<li><a id="js-btn-clear">Clear Filter</a></li>';

		buttonsDiv.insertAdjacentHTML('beforeend', HTML);
		document.querySelector('#js-btn-clear').onclick = function(e) {
			var buttons = document.querySelectorAll('ul.topic_buttons > li > input:checked');

			for (var i = buttons.length - 1; i >= 0; i--) {
				buttons[i].checked = false;
			}
			applyFilter([]);
		};
	}

	function generateFlagBtnHTML(langClass) {
		var lang = toHumanLang(langClass),
			HTML = '<li><input type="checkbox" id="btn_' + lang + '"><label for="btn_' + lang +
			'"><div class="flag-icon">&nbsp;</div></label></li>';

		return HTML;
	}

	// if user is not logged in, usual selector through div.clear will return null,
	// we need to use other selector
	function btnDivSelector() {
		var btnDiv = document.querySelector('div.clear > ul.topic_buttons');

		if (btnDiv !== null) {
			return btnDiv;
		} else {
			return document.querySelector('ul.topic_buttons > li.disabled').parentElement;
		}
	}

	// used as language button OnClick event
	function cbOnClick(e) {
		var cbChecked = document.querySelectorAll('.topic_buttons li > input[type="checkbox"]:checked'),
			enabledLangs = [];

		for (var i = cbChecked.length - 1; i >= 0; i--) {
			enabledLangs.push(toClassLang(cbChecked[i].id.substr(4)));
		}

		if (enabledLangs.length > 0) {
			applyFilter(getDisabledLangs(enabledLangs));
		} else {
			applyFilter([]);
		}
	}

	function toHumanLang(lang) {
		if ((typeof lang === "string") && (lang.match(/^\.lang_(\w+)/))) {
			return lang.substr(6);
		} else {
			console.error('Bad language string passed to toHumanLang: %s', lang);
			return false;
		}
	}

	function toClassLang(lang) {
		if (typeof lang === "string") {
			var result = '.lang_' + lang;
			if (languages.indexOf(result) >= 0) {
				return result;
			} else {
				console.error('Unknown language passed to toClassLang: %s', lang);
				return false;
			}
		}
	}

	function addStyles(rules) {
		var style = document.createElement('style');
		style.type = 'text/css';

		style.innerHTML = rules;
		document.querySelector('head').appendChild(style);
	}

	// returns array of languages without langs supplied in arguments
	function getDisabledLangs(langs) {
		var langStr = languages.join(';');

		for (var i = langs.length - 1; i >= 0; i--) {
			langStr = langStr.replace(RegExp(';?' + langs[i]), '');
		}

		// if languages[0] is removed, result[0] will be empty, we should remove it;
		var result = langStr.split(';');
		if (result[0] === "") {
			result.shift();
		}
		return result;
	}

	// accepts an array of language classes
	function applyFilter(langs) {
		var rows = document.querySelectorAll('.chapter_row');

		for (var i = rows.length - 1; i >= 0; i--) {
			rows[i].show();
		}
		rows = [];

		for (var i = langs.length - 1; i >= 0; i--) {
			rows = document.querySelectorAll(langs[i]);
			for (var j = rows.length - 1; j >= 0; j--) {
				rows[j].hide();
			}
		}
	}
})();