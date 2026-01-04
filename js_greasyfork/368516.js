// ==UserScript==
// @name         Bunpro: Example Sentence Audio
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Adds Google Translate audio to all the sentences that do not yet have audio.
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974366
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368516/Bunpro%3A%20Example%20Sentence%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/368516/Bunpro%3A%20Example%20Sentence%20Audio.meta.js
// ==/UserScript==

(function($, wfs) {
	// Need to remove the referrer; otherwise returns 404s
	var remRef = document.createElement('meta');
	remRef.name = 'referrer';
	remRef.content = 'same-origin';
	document.querySelector('head').append(remRef);

	// CSS stuff
	$('head').append('<style>audio.TTS {margin-top: 6px; border: 1px solid white !important; border-radius: 28px !important;}</style>');

	// The player element
	var first = "<div class=\"audio-holder\">" +
		"    <audio class=TTS controls >" +
		"        <source src=\"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=";
	var last =  "            &tl=ja&total=1&idx=0?\" type=\"audio/mpeg\">" +
		"    </audio>" +
		"</div>";

	// Detect context sentences
	wfs.wait('.japanese-example-sentence', function(e) {
		// Do nothing if there is already audio provided
		if (e[0].nextElementSibling.className != "audio-holder" || e[0].nextElementSibling.innerText.includes('coming soon')) {
			// Get sentence in plain text and add the player
			var sentence = parseSentence(e[0]);
			e.after(first + sentence + last);
		}
	});

	// Extract the sentence from the element
	function parseSentence(sentenceElem) {
		var sentence = "";
		sentenceElem.childNodes.forEach(function(elem) {
			// find the text in each kind of element and append it to the sentence string
			var name = elem.nodeName;
			if (name == "#text") {
				sentence += elem.data;
			}
			else if (name == "STRONG" || name == "SPAN") {
				if (name == "STRONG" && elem.children.length) {
					sentence += elem.children[0].childNodes[0].data;       // with kanji in url
					//sentence += elem.children[0].children[1].innerText;     // with kana in url
				}
				else {
					sentence += elem.innerText;
				}
			}
			else if (name == "RUBY") {
				sentence += elem.childNodes[0].data;       // with kanji in url
				//sentence += elem.children[1].innerText;     // with kana in url
			}
		});
		return sentence;
	}
})(window.jQuery, window.wfs);