// ==UserScript==
// @name         WaniKani English audio
// @namespace    wkenglishaudio
// @version      0.2
// @description  Uses speech synthesis to provide audio for the English meanings.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/extra_study/session*
// @match        https://preview.wanikani.com/review/session
// @match        https://preview.wanikani.com/extra_study/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417526/WaniKani%20English%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/417526/WaniKani%20English%20audio.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global $ */
	/* eslint no-multi-spaces: "off" */

	if (!speechSynthesis) return;

	let ssu = new SpeechSynthesisUtterance();
	speechSynthesis.addEventListener("voiceschanged", updateVoice);
	updateVoice();

	function updateVoice() {
		let voices = speechSynthesis.getVoices() || [];
		voices = [voices.filter(v => v.lang.startsWith("en-")), voices].find(a => a.length > 0) || [];
		voices = [voices.filter(v => v.localService          ), voices].find(a => a.length > 0) || [];
		voices = [voices.filter(v => v.lang === "en-US"      ), voices].find(a => a.length > 0) || [];
		ssu.voice = voices[0];
	}

	function speak(text) {
		ssu.text = text;
		speechSynthesis.speak(ssu);
	}

	let fObserverTarget = document.querySelector("#answer-form fieldset");
	let observer = new MutationObserver(m => m.forEach(handleMutation));
	observer.observe(fObserverTarget, {attributes: true, attributeFilter: ["class"]});

	document.addEventListener("keydown", ev => {
		if (ev.target.nodeName === "INPUT" || ev.key.toLowerCase() !== "j" || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey) return;
		activate();
	});

	function handleMutation(mutation) {
		if (mutation.target.classList.contains("correct")) activate();
	}

	function activate() {
		let currentItem = $.jStorage.get("currentItem");
		if ($.jStorage.get("questionType") === "meaning") {
			speak(currentItem.en[0]);
		}
	}
})();
