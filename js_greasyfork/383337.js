// ==UserScript==
// @name SvPO vormgeving aanpassen
// @namespace http://www.jaron.nl/
// @description Past de vormgeving aan van woordjes leren voor SvPO
// @match           http://svpo.nl/*
// @match           https://svpo.nl/*
// @match           http://www.svpo.nl/*
// @match           https://www.svpo.nl/*
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/383337/SvPO%20vormgeving%20aanpassen.user.js
// @updateURL https://update.greasyfork.org/scripts/383337/SvPO%20vormgeving%20aanpassen.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {

const vocabularyButton = document.querySelector(`[name="VolgendeWoord"]`);
const sentencesButton = document.querySelector(`[name="VolgendeVraag"]`);
const isVocabularyPage = vocabularyButton ? true : false;
const isSentencesPage = sentencesButton ? true : false;

const css = `

	:root {
		--grey-light: #ccc;
		--color-primary: #194a8d;/* https://htmlcolors.com/hex/194a8d */
		--color-primary-lighter: #6298e3;
		
		--color-success: hsl(120, 70%, 85%);
		--color-success-border: hsl(120, 70%, 25%);
		--color-success-text: hsl(120, 70%, 25%);
		--color-notice: hsl(206, 70%, 95%);
		--color-notice-border: hsl(206, 70%, 60%);
		--color-notice-text: hsl(206, 70%, 60%);
		--color-warning: hsl(40, 91%, 90%);
		--color-warning-border: hsl(40, 91%, 60%);
		--color-warning-text: hsl(40, 91%, 30%);
		--color-footnote: hsl(0, 0%, 50%);

		--color-del-background: hsl(0, 70%, 95%);
		--color-del-border: hsl(0, 70%, 40%);
		--color-ins-background: hsl(120, 70%, 95%);
		--color-ins-border: hsl(120, 70%, 40%);

		--fs-main-input: 1.6rem;
	}

	html {
		font-size: 62.5%;/* 10px */
	}

	body {
		font-family: arial, helvetica, sans-serif;
		line-height: 1.4;
	}

	h1, h2, h3, h4, table, th, td, input, select, textarea {
		font-family: inherit;
	}

	table,
	td {
		border: 0;
		font-family: inherit;
		line-height: inherit;
	}

	form > table {
		margin: 0 auto;
	}

	h1,
	h2 {
		color: var(--color-primary);
	}

	a {
		color: var(--color-primary);
	}

	button {
		padding: 0.5em 1em;
		border: 1px solid transparent;
	}

	button:hover,
	button:focus {
		box-shadow: 0 0 5px rgba(0,0,0,0.6);
	}

	input,
	select,
	textarea {
		border: 1px solid var(--grey-light);
		padding: 0.5em;
	}

	input {
		padding-left: 0;
		border-top: none;
		border-left: none;
		border-right: none;
	}

	/* zowel zichtbaar als (oorspr) password */
	.InpShow,
	.InpField {
		font-family: arial;
		font-size: var(--fs-main-input);
	}

	/* password-input */
	.InpField {
		margin-bottom: 0.5em;
		border-bottom: 1px solid var(--color-primary-lighter);
		color: var(--color-primary);
		background: white;
	}

	.InpField:focus {
	}

	/* zichtbare input */
	/* willen we verbergen, want we tonen altijd het normale input-field */
	/* maar eerst uitzoeken hoe we dan wel kunnen laten zien bij antwoord voor zinnen */
	input.InpShow {
		margin-bottom: 1em;
		border: none;
		background: white;
	}

	input.InpShow--is-correct {
	}

	/* correctie */
	.InpCorrect {
		background: var(--color-warning);
		font-family: inherit;
	}

	button[name="VolgendeWoord"],
	button[name="VolgendeVraag"] {
		padding: 0.5em 1em;
		background: var(--color-primary);
		color: white;
		cursor: pointer;
	}

	/*-- Start speciaal voor vocabulaire-pagina's -------------- --*/

		.pg-vocabulary h1,
		.pg-vocabulary h2 {
			font-weight: normal;
		}

		.pg-vocabulary h2 {
			/* naam */
			color: var(--color-footnote);
		}

		.pg-vocabulary tr[id^="c1"] td {
			/* vraag */
			font-size: 2.4rem;
			font-family: "comic sans ms", verdana, sans-serif;
		}

		.pg-vocabulary .InpShow {
			display: none;
		}

		.pg-vocabulary button.InpShow {
			display: initial;
		}

		select[name="TeBereikenNiveau"] {
			background: transparent;
			border-bottom: 2px solid var(--color-primary);
		}

		/* special characters */
		button.InpShow {
			background: var(--color-notice);
		}

		.klein {
			font-size: 1.2rem;
			font-family: inherit;
			color: var(--color-footnote);
		}

	/*-- End speciaal voor vocabulaire-pagina's -------------- --*/


	/*-- Start speciaal voor zinnen-pagina's -------------- --*/

		.sentence-question {
			padding-top: 0.5em;
			margin-bottom: 3em;
		}

		.sentence-question--is-correct,
		.sentence-question--is-wrong,
		.sentence-question--was-wrong {
			position: relative;
			padding-left: 4.8rem;
		}

		.sentence-question--is-correct::before,
		.sentence-question--is-wrong::before,
		.sentence-question--was-wrong::before {
			position: absolute;
			content: '✔';
			display: block;
			top: 0;
			left: 0;
			background: var(--color-success);
			border-right: 2px solid currentColor;
			width: 3.2rem;
			height: 100%;
			text-align: center;
			color: var(--color-success-border);
			font-size: 1.5em;
		}

		.sentence-question--is-wrong::before {
			content: '⚠';
			background: var(--color-warning);
			color: var(--color-warning-text);
			border-color: var(--color-warning-border);
		}

		.sentence-question--was-wrong::before {
			content: '⚠';
			background: var(--color-notice);
			color: var(--color-notice-text);
			border-color: var(--color-notice-border);
		}

		.sentence-question .InpField {
			/* position on top of password field */
			position: relative;
			top: -50px;
			margin-bottom: -40px;
		}


		/* foutmelding "antwoord niet volledig", of juiste antwoord */
		.uitwerking {
			margin-bottom: 0;
		}

		.uitwerking--warning {
			border-radius: 5px;
			color: var(--color-warning-text);
		}

		.uitwerking--warning::before {
			content: '⚠';
			display: inline-block;
			margin-right: 0.5em;
		}

		.difference {
			font-size: var(--fs-main-input);
		}

		.difference ins {
			background: var(--color-ins-background);
			text-decoration-color: var(--color-ins-border);
		}

		.difference del {
			background: var(--color-del-background);
			text-decoration-color: var(--color-del-border);
		}

		/* juiste antwoord */
		.pg-sentences--final-sumbit .uitwerking {
			font-size: var(--fs-main-input);
			color: var(--color-success-text);
		}

		.pg-sentences--final-sumbit .uitwerking::before,
		.pg-sentences--final-sumbit .uitwerking::after,
		.difference::before {
			display: block;
			content: 'juiste antwoord:';
			font-size: 1.2rem;
			color: var(--color-footnote);
		}
		
		.pg-sentences--final-sumbit .uitwerking::before {
			margin-bottom: 0.5rem;
		}

		.pg-sentences--final-sumbit .uitwerking::after {
			margin-top: 0.5rem;
			content: 'jouw antwoord:';
		}

		.difference::before {
			content: 'verschillen:';
		}

		.pg-sentences--final-sumbit .uitwerking ~ br {
			display: none;
		}

		.pg-sentences--final-sumbit .InpShow {
			margin-bottom: 0;
		}

		/* in questions, hide <br> used for spacing */
		.sentence-question .InpField + br,
		.sentence-question .InpField + br + br {
			display: none;
		}

	/*-- End speciaal voor zinnen-pagina's -------------- --*/

`;


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
* add css styles
* @returns {undefined}
*/
const addStyles = function() {
	const styles = document.createElement('style');
	styles.innerHTML = css;
	document.querySelector('head').appendChild(styles);
};


/**
* bepaal welk pagina type het is en voeg class toe aan body
* @returns {undefined}
*/
const setPageType = function() {
	let bodyClass;
	if (isSentencesPage) {
		bodyClass = 'pg-sentences';
	} else if (isVocabularyPage) {
		bodyClass = 'pg-vocabulary';
	}

	if (bodyClass) {
		document.body.classList.add(bodyClass);
	}
};



/**
* initialize all functionality
* @returns {undefined}
*/
const init = function() {
	setPageType();
	addStyles();
	unmaskPasswordField();
};

init();


})();