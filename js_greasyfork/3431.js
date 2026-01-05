// ==UserScript==
// @name           [Japanese] Memrise Kana Detection
// @description    Warns whether to answer in Hiragana or Katakana on Japanese kana tests
// @author         Kai Krause <kaikrause95@gmail.com>
// @match          http://*.memrise.com/*
// @match          https://*.memrise.com/*
// @version        1.5
// @grant          none
// @run-at         document-end
// @namespace      https://greasyfork.org/users/3656
// @downloadURL https://update.greasyfork.org/scripts/3431/%5BJapanese%5D%20Memrise%20Kana%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/3431/%5BJapanese%5D%20Memrise%20Kana%20Detection.meta.js
// ==/UserScript==

var onLoad = function() {
	// Get all questions and answers in the queue
	var questionsAnswers = MEMRISE.garden.screens;
	var getCurrentItem = function(displayedQuestion) {
		for (var id in questionsAnswers) {
			var expectedQuestion = questionsAnswers[id].typing.prompt.text.value.trim();
			if (displayedQuestion === expectedQuestion) {
				var expectedAnswer = questionsAnswers[id].typing.answer.value;
				if (expectedQuestion && expectedAnswer) {
					return {
						question : expectedQuestion,
						answer   : expectedAnswer
					};
				}
			}
		}
	};

	var displayError = function(msg) {
		var kanaError = document.getElementById('kanaError');
		if (kanaError && !msg) {
			kanaError.parentNode.removeChild(kanaError);
			return;
		}

		if (!kanaError) {
			var elem = document.createElement("div");
			elem.id = "kanaError";
			elem.align = "center";
			elem.style = "font-weight: bold; font-size:34px; color:#FF0000;";
			elem.textContent = msg;
			document.body.append(elem);
		}
	};

	var enterKeyDisabler = function(event){
		var keycode = event.which || event.keycode;
		var kanaError = document.getElementById('kanaError');
		if (kanaError && keycode == 13) {
			event.preventDefault();
		}
	};
	window.addEventListener("keypress", enterKeyDisabler);

	var isAnswerHiragana = false;
	var isAnswerKatakana = false;
	var calculateKanaType = function(answer) {
		for (var i = 0; i < answer.length; ++i) {
			//Hiragana check
			if (answer.charCodeAt(i) >= 12353 && answer.charCodeAt(i) <= 12435 ) {
				isAnswerHiragana = true;
			}
			//Katakana check
			else if (answer.charCodeAt(i) >= 12443 && answer.charCodeAt(i) <= 12532 ) {
				isAnswerKatakana = true;
			}
		}
	};

	var compareAnswer = function(given) {
		var givenhiragana = 0;
		var givenkatakana = 0;
		var givenenglish = 0;

		if (!given || given.length === 0) return;

		for (var i = 0; i < given.length; ++i) {
			//Calculate user's answer for Kana type
			if (given.charCodeAt(i) >= 12353 && given.charCodeAt(i) <= 12435) {
				++givenhiragana;
			}
			else if (given.charCodeAt(i) >= 12443 && given.charCodeAt(i) <= 12532 ) {
				++givenkatakana;
			}
			//Actual English || Kana inputted English
			else if (given.charCodeAt(i) >= 65 && given.charCodeAt(i) <= 122 || given.charCodeAt(i) >= 65346 && given.charCodeAt(i) <= 65370) {
				++givenenglish;
			}

			//Compare our two kana types, the expected answer and the user's
			if (isAnswerHiragana && isAnswerKatakana){
				if (givenhiragana === 0 || givenkatakana === 0 || givenenglish > 0){
					displayError("Hiragana & Katakana!");
				}
				else if (givenhiragana > 0 && givenkatakana > 0 && givenenglish === 0){
					displayError("");
				}
			}
			else if (isAnswerHiragana){
				if (givenhiragana === 0 || givenkatakana > 0 || givenenglish > 0){
					displayError("Hiragana!");
				}
				else if (givenhiragana > 0 && givenkatakana === 0 && givenenglish === 0){
					displayError("");
				}
			}
			else if (isAnswerKatakana){
				if (givenkatakana === 0 || givenhiragana > 0 || givenenglish > 0){
					displayError("Katakana!");
				}
				else if (givenkatakana > 0 && givenhiragana === 0 && givenenglish === 0){
					displayError("");
				}
			}
		}
	};

	var cachedQuestion = "";
	var checkAnswer = function() {
		var displayedQuestion = document.getElementsByClassName("qquestion")[0].childNodes[0].nodeValue.trim();
		var givenAnswer = document.getElementsByClassName("typing-type-here")[0].value;
		var expectedAnswer = getCurrentItem(displayedQuestion).answer;

		//Evaluate kana type of the expectedAnswer
		if (displayedQuestion != cachedQuestion) {
			cachedQuestion = displayedQuestion;
			calculateKanaType(expectedAnswer);
		}

		if (givenAnswer) {
			compareAnswer(givenAnswer);
		}
	};
	window.addEventListener("keyup", checkAnswer);
};

window.addEventListener('load',
function() {
	onLoad();
}, false);