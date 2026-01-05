// ==UserScript==
// @name        Fontz Quiz Timer & Keyboard Shortcuts
// @namespace   http://idlewords.net
// @description Adds stopwatch to quiz pages; use Ctrl+S to submit and continue on quiz and quiz answer pages
// @include     http://50.116.7.11:9998/learningQuizController_turk/quiz
// @include     http://50.116.7.11:9998/learningQuizController_turk/quiz_answer
// @include     http://50.116.7.11:9998/learningQuizController_turk/main_menu
// @version     0.4
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/12377-timecircles/code/TimeCircles.js?version=73868
// @resource    customCSS http://git.wimbarelds.nl/TimeCircles/inc/TimeCircles.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/12378/Fontz%20Quiz%20Timer%20%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/12378/Fontz%20Quiz%20Timer%20%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var keycode = 83; // 83 = S. Change this to a valid code from http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes to change the keyboard shortcut

var newCSS = GM_getResourceText ("customCSS");
GM_addStyle (newCSS);

$(document).ready(function() {
	if (document.location.href == 'http://50.116.7.11:9998/learningQuizController_turk/quiz_answer') {
		$(document).keydown(function(event) {
			if (event.which == keycode && event.ctrlKey) {
				event.preventDefault();
				$("input[name='Continue']").click();
			}
		});
		$("form[class='nobox']").after("<p>Questions Completed: " + localStorage.getItem('questions') + "</p>")
	}
});

$(window).load(function() {
	if (document.location.href == 'http://50.116.7.11:9998/learningQuizController_turk/quiz') {
		$("div[align='right']").append("<span>" + localStorage.getItem('questions') + "</span>").before(
			$("<div></div>")
				.css({'height': '200px', 'width': '500', 'align': 'left'})
				.addClass('timer')
		);
		$(".timer").TimeCircles({
			time: {
			    Days: { show: false },
			    Hours: { show: false },
			    Minutes: { color: "#BBFFBB" },
			    Seconds: { color: "#FF9999" }
			}
		});
		$(document).keydown(function(event) {
			if (event.which == keycode && event.ctrlKey) {
				event.preventDefault();
				$(".timer").TimeCircles().stop();
				localStorage.setItem('questions', parseInt(localStorage.getItem('questions')) + 1);
				$("#submitButton").click();
			} else if (event.which == 89 || event.which == 49 || event.which == 97) {
				event.preventDefault();
				$("#deformfield1-0").prop('checked', true);
			} else if (event.which == 78 || event.which == 50 || event.which == 98) {
				event.preventDefault();
				$("#deformfield1-1").prop('checked', true);
			}
		});
	} else if (document.location.href == 'http://50.116.7.11:9998/learningQuizController_turk/main_menu') {
		setTimeout(function(){$('div#bodycontainer p').eq(0).before('Questions Answered: ' + $('circle').length);},1000);
		if (localStorage.getItem('questions') === null) {
			localStorage.setItem('questions', $('circle').length);
		}
	}
});