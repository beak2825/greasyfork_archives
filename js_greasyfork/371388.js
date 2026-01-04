// ==UserScript==
// @name         Bunpro: Mistake Delay
// @namespace    http://tampermonkey.net/
// @version      0.2.8
// @description  Prevents premature wrong answer submission.
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371388/Bunpro%3A%20Mistake%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/371388/Bunpro%3A%20Mistake%20Delay.meta.js
// ==/UserScript==

(function() {
	// Seconds of delay
	const delay = 2;

	// Wait until we're reviewing
	$('HTML')[0].addEventListener('quiz-page', function() {
		// Add the standard styling to the disabled button
		addCSS();

		// Do stuff when we press enter or backspace
		$('#study-answer-input').on('keydown', function(event) {
			var elem = $('#study-answer-input');
			// Initiate delate when we press enter, get the answer wrong, and no delay is already active
			var bkg = elem[0].style.background;
			if (bkg != "") {
				var bkg_lst = bkg.slice(5, bkg.length-1).split(', ');
				if (event.which == 13 && Number(bkg_lst[0]) > Number(bkg_lst[1]) + Number(bkg_lst[2]) && !$('#submit-study-answer-disabled').length) {
					enableDelay();
					setTimeout(disableDelay, delay*1000);
				}
			}
		});
		$('body').on('keydown', function(event) {
			// Cancel delay if we press backspace after getting an answer wrong
			if (event.which == 8 && $('#submit-study-answer-disabled').length) disableDelay();
		});
	});

	// Makes user unable to continue to the next item
	function enableDelay() {
		$('#study-answer-input')[0].blur();
		$('#submit-study-answer').attr('id', 'submit-study-answer-disabled');
	}

	// Makes user able to continue to the next item again
	function disableDelay() {
		$('#submit-study-answer-disabled').attr('id', 'submit-study-answer');
	}

	// Adds the needed CSS
	function addCSS() {
		$('head').append('<style>#submit-study-answer-disabled {' +
						 'width: 15%;' +
						 'right: 0;' +
						 'text-align: center;' +
						 'position: absolute;' +
						 'font-weight: 400;' +
						 'font-size: 20px;' +
						 'z-index: 100;' +
						 'border-radius: 0;' +
						 'color: white;' +
						 'background: transparent;' +
						 '}' +
						 '@media (max-width: 480px) #submit-study-answer-disabled {font-size: 12px !important;}</style>')
	}
})();
