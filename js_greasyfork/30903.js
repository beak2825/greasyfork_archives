// ==UserScript==
// @name         Wanikani Lessons Anki Mode (kustom)
// @namespace    mempo
// @version      1.6mod6
// @description  Anki mode for Wanikani lessons
// @author       Mempo
// @match        https://www.wanikani.com/lesson/session*
// @match        http://www.wanikani.com/lesson/session*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/30903/Wanikani%20Lessons%20Anki%20Mode%20%28kustom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30903/Wanikani%20Lessons%20Anki%20Mode%20%28kustom%29.meta.js
// ==/UserScript==

//Original author: Oleg Grishin <og402@nyu.edu>

console.log('/// Start of Wanikani Lessons Anki Mode');

$("#question-type > h1").before("<div id='fillAnswerButton' style='position:absolute;z-index:20;right:0px;line-height:1.88em;font-size:3em;-moz-user-select: none;'>ã€€ðŸ¡·ã€€</div>");

$("#fillAnswerButton").click(function() {
	fillAnswer();
});

function fillAnswer() {
	if ($("#user-response").val() == "") {
		var questionType = $.jStorage.get("l/questionType");
		var currentQuizItem = $.jStorage.get("l/currentQuizItem");
		
		if (questionType == "reading") {
			if (currentQuizItem.voc)
				$("#user-response").val(currentQuizItem.kana[0]);
			if (currentQuizItem.emph == "kunyomi")
				$("#user-response").val(currentQuizItem.kun[0])
			if (currentQuizItem.emph == "onyomi")
				$("#user-response").val(currentQuizItem.on[0])
		} else if (questionType == "meaning") {
				$("#user-response").val(currentQuizItem.en[0])
		}
		$(".icon-chevron-right").click();
	} else //if ($("#user-response").val() != "")
		$(".icon-chevron-right").click();
}

var bindHotkeys = function () {
	$(document).on("keydown.reviewScreen", function (event) {
		switch (event.keyCode) {
			case 32:// right arrow
				event.stopPropagation();
				event.preventDefault();
				fillAnswer();

				return;
				break;
		}
	});
};

bindHotkeys();