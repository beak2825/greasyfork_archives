// ==UserScript==
// @name          WaniKani Lesson Examples Audio
// @namespace     https://www.wanikani.com
// @description   Allows you to play audio for example vocab during kanji lessons.
// @author        seanblue
// @version       1.0.2
// @include       *://www.wanikani.com/lesson/session*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/370373/WaniKani%20Lesson%20Examples%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/370373/WaniKani%20Lesson%20Examples%20Audio.meta.js
// ==/UserScript==

const eventPrefix = 'seanblue.example_audio.';

(function($) {$.each(['show'], function(i, ev) { var el = $.fn[ev]; $.fn[ev] = function() { this.trigger(eventPrefix + ev); return el.apply(this, arguments); }; }); })(jQuery);

(function() {
	'use strict';

	if (!wkof) {
		var response = confirm('WaniKani Lesson Examples Audio requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}

	wkof.include('ItemData');
	wkof.ready('ItemData').then(initialize);

	var subjectLoadingInitiated = false;
	var subjectsLoadedPromise = promise();
	var subjectToAudioMap;

	var config = {
		wk_items: {
			filters: {
				item_type: 'voc'
			}
		}
	};

	function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}

	function initialize() {
		$('#supplement-kan-related-vocabulary').on(eventPrefix + 'show', function(e) {
			loadSubjects();

			subjectsLoadedPromise.then(function() {
				let listElements = $(e.currentTarget).find('li');

				for (let i = 0; i < listElements.length; i++) {
					setUpAudio($(listElements[i]));
				}
			});
		});
	}

	function loadSubjects() {
		if (!subjectLoadingInitiated) {
			subjectLoadingInitiated = true;
			wkof.ItemData.get_items(config).then(processSubjects);
		}

		return subjectsLoadedPromise;
	}

	function processSubjects(items) {
		subjectToAudioMap = items.reduce(function(map, obj) {
			map[obj.data.characters] = getAudioUrl(obj);
			return map;
		}, {});

		subjectsLoadedPromise.resolve();
	}

	function getAudioUrl(item) {
		var mp3Audios = item.data.pronunciation_audios.filter(a => a.content_type === 'audio/mpeg');
		var preferredAudios = mp3Audios.filter(a => a.metadata.voice_actor_id === WaniKani.default_voice_actor_id);

		if (preferredAudios.length > 0) {
			return preferredAudios[0].url;
		}

		if (mp3Audios.length > 0) {
			return mp3Audios[0].url;
		}

		return '';
	}

	function setUpAudio(el) {
		let existingAudioButton = el.find('button.audio-btn');

		if (existingAudioButton.length > 0) {
			return;
		}

		let characters = el.find('span.vocabulary').text();
		let audioUrl = subjectToAudioMap[characters];

		if (audioUrl === '') {
			return;
		}

		let audioButtonElem = getAudioButtonElement().appendTo(el);
		let audioElem = getAudioElement(audioUrl);

		setUpAudioEvents(audioButtonElem, audioElem);
	}

	function getAudioButtonElement() {
		return $('<button type="button" title="Play pronunciation audio" class="audio-btn audio-idle"></button>');
	}

	function getAudioElement(audioUrl) {
		let audioElem = $('<audio></audio>');

		$('<source></source>', {
			src: audioUrl,
			type: 'audio/mpeg'
		}).appendTo(audioElem);

		return audioElem;
	}

	function setUpAudioEvents(audioButtonElem, audioElem) {
		audioElem[0].addEventListener('play', function () {
			audioButtonElem.removeClass('audio-idle').addClass('audio-play');
		});

		audioElem[0].addEventListener('ended', function () {
			audioButtonElem.removeClass('audio-play').addClass('audio-idle');
		});

		audioButtonElem.on('click', function() {
			audioElem[0].play();
		});

	}
})();