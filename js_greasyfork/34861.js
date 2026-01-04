// ==UserScript==
// @name          WaniKani Review Audio Tweak 2
// @namespace     https://www.wanikani.com
// @description   Allow audio to be played after review meaning questions, when reading has been previously answered correctly. Also includes setting for enabling autoplay when answer is incorrect (default: off). Originally by Takuya Kobayashi.
// @author        seanblue
// @version       1.0.2
// @include       https://www.wanikani.com/review/session*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/34861/WaniKani%20Review%20Audio%20Tweak%202.user.js
// @updateURL https://update.greasyfork.org/scripts/34861/WaniKani%20Review%20Audio%20Tweak%202.meta.js
// ==/UserScript==

// Original version by Takuya Kobayashi: https://greasyfork.org/en/scripts/10184-wanikani-review-audio-tweak
// This version is a reupload with the new URL for audio files.

(function ($) {
	'use strict';
	// BEGIN SETTINGS //
	const enableAutoPlayWhenIncorrect = false; // change to 'true' to enable
	// END SETTINGS //

	function itemStat(item) {
		let itemStatKey = (item.voc ? 'v' : item.kan ? 'k' : 'r') + item.id;
		return ($.jStorage.get(itemStatKey) || {});
	}

	window.additionalContent.audio = function (audioAutoplay) {
		let currentItem = $.jStorage.get('currentItem');
		let questionType = $.jStorage.get('questionType');

		$('audio').remove();

		if (currentItem.aud && (questionType === 'reading' || itemStat(currentItem).rc >= 1)) {
			let liElem = $('#option-audio');
			let buttonElem = liElem.find('button');

			if (!enableAutoPlayWhenIncorrect && !$('#answer-form fieldset').hasClass('correct')) {
				audioAutoplay = false;
			}

			buttonElem.removeAttr('disabled');
			let audioElem = $('<audio></audio>', { autoplay: audioAutoplay }).appendTo(liElem.removeClass('disabled').children('span'));

			for (let i = 0; i < currentItem.aud.length; i++) {
				let audio = currentItem.aud[i];

				if (audio.voice_actor_id == WaniKani.default_voice_actor_id) {
					$('<source></source>', {
						src: audio.url,
						type: audio.content_type
					}).appendTo(audioElem);
				}
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
					$('audio.preferred').trigger('play');
				}
			});
		}
	};
}(window.jQuery));