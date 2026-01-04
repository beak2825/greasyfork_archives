// ==UserScript==
// @name SvPO check submit
// @namespace http://www.jaron.nl/
// @description Checkt of SvPO module gesubmit wordt; stuurt answercorrect of answerfalse event
// @match           http://svpo.nl/*
// @match           https://svpo.nl/*
// @match           http://www.svpo.nl/*
// @match           https://www.svpo.nl/*
// @version 0.0.7
// @downloadURL https://update.greasyfork.org/scripts/383338/SvPO%20check%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/383338/SvPO%20check%20submit.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {

let lastAnswerWasCorrect = null;

const vocabularyButton = document.querySelector(`[name="VolgendeWoord"]`);
const sentencesButton = document.querySelector(`[name="VolgendeVraag"]`);
const isVocabularyPage = vocabularyButton ? true : false;
const isSentencesPage = sentencesButton ? true : false;

let isSentenceFirstSubmit = false;
let isSentenceFinalSubmit = false;

const cookieName = 'jbWrongAnswers';



//-- Start helper functions --
const Diff = (function () {

	/*
	 * Javascript Diff Algorithm
	 *  By John Resig (http://ejohn.org/)
	 *  Modified by Chu Alan "sprite"
	 *
	 * Released under the MIT license.
	 *
	 * More Info:
	 *  http://ejohn.org/projects/javascript-diff-algorithm/
	 */

	function escape(s) {
		var n = s;
		n = n.replace(/&/g, "&amp;");
		n = n.replace(/</g, "&lt;");
		n = n.replace(/>/g, "&gt;");
		n = n.replace(/"/g, "&quot;");

		return n;
	}

	function diffString(o, n) {
		o = o.replace(/\s+$/, '');
		n = n.replace(/\s+$/, '');

		var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
		var str = "";

		var oSpace = o.match(/\s+/g);
		if (oSpace == null) {
			oSpace = ["\n"];
		} else {
			oSpace.push("\n");
		}
		var nSpace = n.match(/\s+/g);
		if (nSpace == null) {
			nSpace = ["\n"];
		} else {
			nSpace.push("\n");
		}

		if (out.n.length == 0) {
			for (var i = 0; i < out.o.length; i++) {
				str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
			}
		} else {
			if (out.n[0].text == null) {
				for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
					str += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
				}
			}

			for (var i = 0; i < out.n.length; i++) {
				if (out.n[i].text == null) {
					str += '<ins>' + escape(out.n[i]) + nSpace[i] + "</ins>";
				} else {
					var pre = "";

					for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
						pre += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
					}
					str += " " + out.n[i].text + nSpace[i] + pre;
				}
			}
		}

		return str;
	}

	function diff(o, n) {
		var ns = new Object();
		var os = new Object();

		for (var i = 0; i < n.length; i++) {
			if (ns[n[i]] == null)
				ns[n[i]] = {
					rows: new Array(),
					o: null
				};
			ns[n[i]].rows.push(i);
		}

		for (var i = 0; i < o.length; i++) {
			if (os[o[i]] == null)
				os[o[i]] = {
					rows: new Array(),
					n: null
				};
			os[o[i]].rows.push(i);
		}

		for (var i in ns) {
			if (ns[i].rows.length == 1 && typeof (os[i]) != "undefined" && os[i].rows.length == 1) {
				n[ns[i].rows[0]] = {
					text: n[ns[i].rows[0]],
					row: os[i].rows[0]
				};
				o[os[i].rows[0]] = {
					text: o[os[i].rows[0]],
					row: ns[i].rows[0]
				};
			}
		}

		for (var i = 0; i < n.length - 1; i++) {
			if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
				n[i + 1] == o[n[i].row + 1]) {
				n[i + 1] = {
					text: n[i + 1],
					row: n[i].row + 1
				};
				o[n[i].row + 1] = {
					text: o[n[i].row + 1],
					row: i + 1
				};
			}
		}

		for (var i = n.length - 1; i > 0; i--) {
			if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
				n[i - 1] == o[n[i].row - 1]) {
				n[i - 1] = {
					text: n[i - 1],
					row: n[i].row - 1
				};
				o[n[i].row - 1] = {
					text: o[n[i].row - 1],
					row: i - 1
				};
			}
		}

		return {
			o: o,
			n: n
		};
	}

	const publicFunctions = {
		diffString
	}
	return publicFunctions;

})();

//-- End helper functions --

/**
* answer was submitted by clicking button
* function volgende woord has already run
* @returns {undefined}
*/
var submitByClickHandler = function() {
	checkAnswer();
};


/**
* check of antwoord goed was
* @returns {undefined}
*/
var checkAnswer = function() {
	if (lastAnswerWasCorrect || lastAnswerWasCorrect === null) {
		const wordNum = getWordNumber();
		let answerElm = document.getElementById(`c2${wordNum}`);
		lastAnswerWasCorrect = answerElm.style.display === 'none';

		if (lastAnswerWasCorrect) {
			document.body.dispatchEvent(new CustomEvent('answercorrect'));
		} else {

			document.body.dispatchEvent(new CustomEvent('answerfalse'));
		}
	} else {
		// last answer was false, so we're submitting to get new question
		lastAnswerWasCorrect = null;
	}
};

/**
* check of alle velden zijn ingevuld
* @returns {undefined}
*/
const allFieldsFilledIn = function() {
	let allFilledIn = true;
	const fields = Array.from(document.querySelectorAll('.InpField'));
	fields.forEach((field) => {
		if (!field.value) {
			allFilledIn = false;
		}
	});
	return allFilledIn;
};




/**
* wrapper om stopRKey - doe eerst extra checks, daarna oorspronkelijke functie aanroepen
* @returns {undefined}
*/
var stopRKeyWrapper = function(evt) {
	const tgt = evt.target;
	if (evt.keyCode === 13 &&  tgt.classList.contains('InpField')) {// enter in input veld
		if (isSentencesPage) {
			if (!allFieldsFilledIn()) {
				if (confirm('Het lijkt erop dat je niet alle vragen hebt ingevuld.\nWil je je antwoorden toch versturen?')) {
				} else {
					return false;
				}
			}
		}
		setTimeout(checkAnswer, 100);
	}

	// voer nu oorspronkelijke keydown functie uit
	return stopRKey(evt);
};




/**
* add listeners
* @returns {undefined}
*/
var addEventListeners = function() {

	if (vocabularyButton) {
		vocabularyButton.addEventListener('click', submitByClickHandler);
	}

	if (sentencesButton) {
		sentencesButton.addEventListener('click', submitByClickHandler);
	}

	// wrap stopRKey in extra functie om dingen af te kunnen vangen
	document.onkeydown = stopRKeyWrapper;
};


/**
* check current word numer
* @returns {String} the word number as string
*/
const getWordNumber = function() {
	return z.woordnr.value;
};


function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length === 2) return parts.pop().split(";").shift();
}



/**
* voeg na 1e submit feedback toe of antwoord correct was
* @returns {undefined}
*/
const addFirstSubmitFeedback = function() {
	if (isSentenceFirstSubmit) {
		const questions = document.querySelectorAll('.sentence-question');
		questions.forEach((question) => {
			if (question.querySelector('.uitwerking')) {
				// als .uitwerking aanwezig is, is vraag fout
				question.classList.add('sentence-question--is-wrong');
			} else {
				question.classList.add('sentence-question--is-correct');
			}
		});
	}
};


/**
* voeg na final submit feedback toe
* @returns {undefined}
*/
const addFinalSubmitFeedback = function() {
	if (isSentenceFinalSubmit) {
		const cookieValue = getCookie(cookieName);
		const wrongAnswers = cookieValue ? cookieValue.split(',') : [];
		// console.log(wrongAnswers);
		const questions = document.querySelectorAll('.sentence-question');
		questions.forEach((question, i) => {
			// elke vraag heeft nu een .uitwerking, die bevat het juiste antwoord
			const correctAnswer = question.querySelector('.uitwerking').textContent;
			const studentAnswer = question.querySelector('.InpShow').value;

			// mogelijkheden:
			// 1. antwoord is precies gelijk
			// 2. antwoord is niet helemaal gelijk, maar wel al goedgerekend bij first submit
			// 3. antwoord was 1e x niet correct, en is niet exact gelijk

			if (studentAnswer === correctAnswer) {
				// antwoord is exact gelijk
				question.classList.add('sentence-question--is-correct');
			} else if (wrongAnswers.includes(i.toString()) || !cookieValue) {
				// antwoord is niet exact gelijk; 1e x fout gerekend
				question.classList.add('sentence-question--was-wrong');
			} else {
				// antwoord is niet exact gelijk, maar 1e x wel goed gerekend
				question.classList.add('sentence-question--is-correct');
			}

			const diffDiv = document.createElement('div');
			diffDiv.classList.add('difference');
			diffDiv.innerHTML = Diff.diffString(studentAnswer, correctAnswer);
			question.appendChild(diffDiv);
		});
	}
};



/**
* for every question, get nodes after the number node
* @returns {undefined}
*/
const getAllQuestionNodes = function(numberNodes) {
	// nu nodes verzamelen tot aan volgende node
	questions = [];// array of question nodes arrays
	numberNodes.forEach((node, i) => {
		const endNode = (i < numberNodes.length-1) ? numberNodes[i+1] : sentencesButton;// node die niet meer bij deze vraag hoort
		const questionNodes = [node];// alle nodes in deze vraag

		let nextNode = node.nextSibling;
		let fallbackCounter = 0;
		while (nextNode !== endNode && fallbackCounter < 1000) {
			questionNodes.push(nextNode);
			nextNode = nextNode.nextSibling;
			fallbackCounter++;
		}
		questions.push(questionNodes);
	});

	return questions;
};

/**
* 
* @returns {undefined}
*/
const addWrapperPerQuestion = function(questions) {
	const parentNode = sentencesButton.parentNode;// we inserten alles before sentencesButton
	questions.forEach((questions) => {
		const wrapperElm = document.createElement('div');
		wrapperElm.classList.add('sentence-question');

		questions.forEach((node) => {
			wrapperElm.appendChild(node);
		})

		// now add node to body
		parentNode.insertBefore(wrapperElm, sentencesButton);
	});
};


/**
* wrap questions in a heading element
* @returns {undefined}
*/
const wrapQuestionsInHeading = function(questionElm) {
	
};


/**
* geef aan of uitwerking warning of antwoord is
* en set 
* @returns {undefined}
*/
const classifyUitwerking = function() {
	const allQuestions = document.querySelectorAll(`.sentence-question`);
	const wrongAnswers = [];
	let hasUitwerkingen = false;
	allQuestions.forEach((question, i) => {
		const uitwerking = question.querySelector('.uitwerking');
		if (uitwerking) {
			hasUitwerkingen = true;
			if (uitwerking.textContent.indexOf('Je antwoord is niet volledig') > -1) {
				uitwerking.classList.add('uitwerking--warning');
				isSentenceFirstSubmit = true;
				document.body.classList.add('pg-sentences--first-sumbit');
				wrongAnswers.push(i);
			} else {
				uitwerking.classList.add('uitwerking--answer');
				document.body.classList.add('pg-sentences--final-sumbit');
			}
		}
	});

	if (isSentenceFirstSubmit) {
		// set cookie met foute antwoord nummers
		const wrongAnswersCookie = `${cookieName}=${wrongAnswers.join(',')};`;
		document.cookie = wrongAnswersCookie;
	} else if (hasUitwerkingen && !isSentenceFirstSubmit) {
		isSentenceFinalSubmit = true;
	} else {
		// verwijder evt answer cookie
		const wrongAnswersCookie = `${cookieName}=; expires=0`;
		document.cookie = wrongAnswersCookie;
	}

	// console.log('first:', isSentenceFirstSubmit);
	// console.log('final:', isSentenceFinalSubmit);
};



/**
* add structure to markup so we have entity for every question
* @returns {undefined}
*/
const addMarkupStructure = function() {
	const h1 = document.querySelector('h1');
	if (h1) {
		const wrapper = h1.parentElement;
		const numberNodes = [];
		wrapper.childNodes.forEach((node) => {
			if (node.nodeType === 3 && node.nodeValue.match(/\d+\./)) {
				// it's text node die nummer met . bevat
				numberNodes.push(node);
			}
		});

		const questions = getAllQuestionNodes(numberNodes);
		addWrapperPerQuestion(questions);
		wrapQuestionsInHeading(questions);
		classifyUitwerking();
	}
};


/**
* 
* @returns {undefined}
*/
var init = function() {
	if (isVocabularyPage || isSentencesPage) {
		addEventListeners();
	}

	if (isSentencesPage) {
		addMarkupStructure();
		addFirstSubmitFeedback();
		addFinalSubmitFeedback()
	}
};

init();


})();