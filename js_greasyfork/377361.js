// ==UserScript==
// @name          WaniKani Review Audio Tweak 3
// @namespace     https://www.wanikani.com
// @description   Allows audio to always be played, regardless of whether reading or meaning, regardless of correctness of answers.
// @author        purajunyakara
// @version       1.0.1
// @include       http*://www.wanikani.com/review/session*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/377361/WaniKani%20Review%20Audio%20Tweak%203.user.js
// @updateURL https://update.greasyfork.org/scripts/377361/WaniKani%20Review%20Audio%20Tweak%203.meta.js
// ==/UserScript==

// Just a more-permissive version of WaniKani Review Audio Tweak 2 (including July 2019 update 1.0.1), by seanblue.
// Recommended Usage #1: Disable "Autoplay audio in reviews" and play audio with "J" only when desired.
// Recommended Usage #2: Enable "Autoplay audio in reviews", police yourself on practicing pronunciation out loud before submitting answers, and hear audio twice as often.
// Wish:
//    If I could, I'd make it the default behavior to respect the "Autoplay audio in reviews" setting for readings but override with "No" for meanings.
//    I.e., then would allow preferred Recommended Usage #3: Enable "Autoplay audio in reviews", hear audio automatically for correct readings, but also be able to trigger audio on-demand for both meanings (and incorrect readings, as always).
//    See note "WHY DOESN'T THIS WORK?" below.

(function ($) {
	'use strict';

	window.additionalContent.audio = function (audioAutoplay) {
		let currentItem = $.jStorage.get('currentItem');
		let questionType = $.jStorage.get('questionType');

		$('audio').remove();

		if (currentItem.aud) {
			let liElem = $('#option-audio');
			let buttonElem = liElem.find('button');

//		if (questionType === "meaning") {  // WHY DOESN'T THIS WORK?
//			let audioAutoplay = false;
//		}

            buttonElem.removeAttr('disabled');
			let audioElem = $('<audio></audio>', { autoplay: audioAutoplay }).appendTo(liElem.removeClass('disabled').children('span'));

			for (let i = 0; i < currentItem.aud.length; i++) {
				let audio = currentItem.aud[i];

				$('<source></source>', {
					src: audio.url,
					type: audio.content_type
				}).appendTo(audioElem);
			}

			audioElem[0].addEventListener('play', function () {
				buttonElem.removeClass('audio-idle').addClass('audio-play');
			});

			audioElem[0].addEventListener('ended', function () {
				buttonElem.removeClass('audio-play').addClass('audio-idle');
			});

			buttonElem.off('click');
			buttonElem.on('click', function () {
				audioElem[0].play();
			});

			liElem.off('click');
			liElem.on('click', function () {
				if ($('#user-response').is(':disabled')) {
					$('audio').trigger('play');
				}
			});
		}
	};
}(window.jQuery));