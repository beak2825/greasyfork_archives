// ==UserScript==
// @name SvPO woordjes leren
// @namespace http://www.jaron.nl/misc/
// @description Past de vormgeving aan van woordjes leren voor SvPO
// @match           http://svpo.nl/*
// @match           https://svpo.nl/*
// @run-at          document-start
// @version 0.3.1
// @downloadURL https://update.greasyfork.org/scripts/371757/SvPO%20woordjes%20leren.user.js
// @updateURL https://update.greasyfork.org/scripts/371757/SvPO%20woordjes%20leren.meta.js
// ==/UserScript==      

(function() {

	const styles = `
		:root {
			--blue: #3489d6;
			--blue-l: #686969;
		}

		body {
			background: #fff;
		}

		h1,
		h2 {
			color: var(--blue);
		}

		a {
			color: var(--blue);
		}

		a:hover,
		a:focus {
			text-decoration: none;
		}

		table,
		td {
			border: 0;
		}

		td {
		}

		input,
		button {
			border: 0;
			padding: 0.5em;
		}

		.lineB,
		.Inp,
		.InpShow {
			background: var(--blue-l);
		}

		.lineB span {
			text-decoration: none !important;
		}

		.InpCorrect[style^="background-color:#FFFFFF"] {
			background-color: transparent !important;
			color: var(--blue);
		}

		.InpShow {
			margin-bottom: 0.5em;
		}

		button.InpShow:hover {
			background: var(--blue);
			color: white;
		}
	`;

	/**
	* check if this is a vocabulary page
	* since the markup is really shitty, there are no id's etc to check
	* so it's a best guess
	* @returns {undefined}
	*/
	const isVocabularyPage = function() {
		let isPage = false;
		const readonlyField = document.querySelector('h1 ~ input[readonly]');
		// readonly field has name starting with "teller" on vocabulary page
		if (readonlyField && readonlyField.getAttribute('name').indexOf('teller') === 0) {
			isPage = true;
		}

		return isPage;
	};

	/**
	* 
	* @returns {undefined}
	*/
	const addStyleCorrections = function() {
		const styleElm = document.createElement('style');
		styleElm.setAttribute('rel', 'stylesheet');
		styleElm.textContent = styles;
		document.querySelector('head').appendChild(styleElm);
	};

	/**
	* unmask the input field that somehow is set to password
	* @returns {undefined}
	*/
	const unmaskPasswordField = function() {
		// there are actually rows for every question and answer
		const inputFields = document.querySelectorAll('.InpField[type="password"]');
		inputFields.forEach((fld) => {
			fld.type = 'text';
		});
	};
	
	
	

	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var init = function() {
		if (isVocabularyPage()) {
			addStyleCorrections();
			unmaskPasswordField();
		};
	};

	

	document.addEventListener('DOMContentLoaded', init);

})();
