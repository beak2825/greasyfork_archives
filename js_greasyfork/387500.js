// ==UserScript==
// @name         The Meaning of 六 is roku
// @namespace    wkmeaningisroku
// @version      0.1
// @description  Entering the reading when asked for the meaning results in a shake, allowing you to retry.
// @author       Sinyaven
// @include      http*://www.wanikani.com/review/session*
// @include      http*://www.wanikani.com/lesson/session*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387500/The%20Meaning%20of%20%E5%85%AD%20is%20roku.user.js
// @updateURL https://update.greasyfork.org/scripts/387500/The%20Meaning%20of%20%E5%85%AD%20is%20roku.meta.js
// ==/UserScript==

// code is based on https://greasyfork.org/de/scripts/7478-wk-but-no-cigar

(function() {
	'use strict';

	let alertText = "Please enter the meaning!";
	let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	function modifyNextAnswerExceptionPopup() {
		let observer = new MutationObserver(function (mutations) {
			// iterate over mutations..
			mutations.forEach(function (mutation) {
				if (mutation.addedNodes.length > 0) {
					if (mutation.addedNodes.item(0).classList) {
						if (mutation.addedNodes.item(0).classList.contains("answer-exception-form")) {
							mutation.addedNodes.item(0).innerHTML=mutation.addedNodes.item(0).innerHTML.replace(/WaniKani is looking for the [a-zA-Z']+ reading/, alertText);
							observer.disconnect();
						}
					}
				}
			});

			let highLanders = document.querySelectorAll("#answer-exception");
			if (highLanders.length > 1) { // There can be only one!!!
				for (let hL = 1; hL < highLanders.length; hL++) {
					highLanders[hL].parentNode.removeChild(highLanders[hL]);
				}
			}
		});
		observer.observe(document.body, {childList: true, subtree: true, attributes: false, characterData: false});
	}

	function injectAdditionalCheckIntoAnswerChecker() {
		let oldEvaluate = answerChecker.evaluate;

		//stops the code from submitting the answer
		answerChecker.evaluate = function(e, t) {
			let result = oldEvaluate(e, t);
			document.querySelectorAll("#answer-exception").forEach(e => e.parentNode.removeChild(e));
			if (result.passed === false && e === "meaning") {
				let currentSubject = $.jStorage.get("currentItem");
				let readingList = [].concat(currentSubject.kana).concat(currentSubject.on).concat(currentSubject.kun).concat(currentSubject.nanori);
				if (readingList.indexOf(wanakana.toKana(t)) >= 0) {
					result.exception = true;
					modifyNextAnswerExceptionPopup();
				}
			}
			return result;
		};
	}

	// Run injectAdditionalCheckIntoAnswerChecker() after window.onload event.
	if (document.readyState === 'complete') {
		injectAdditionalCheckIntoAnswerChecker();
	} else {
		window.addEventListener("load", injectAdditionalCheckIntoAnswerChecker, false);
	}
})();
