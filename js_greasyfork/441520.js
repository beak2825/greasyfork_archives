// ==UserScript==
// @name         Extra Study: Audio Quiz
// @namespace    extraStudyAudioQuiz
// @version      2.7
// @description  Adds the option to change the WK extra study to audio => meaning questions.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1386112
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441520/Extra%20Study%3A%20Audio%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/441520/Extra%20Study%3A%20Audio%20Quiz.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global wkQueue */
	/* eslint no-multi-spaces: off */

	let onlyVocab = null;
	let onlyMeaning = null;

	document.addEventListener("turbo:before-render", async e => {
		let observer = new MutationObserver(m => {
			if (m[0].target.childElementCount > 0) return;
			observer.disconnect();
			observer = null;
			initPerPage();
		});
		observer.observe(e.detail.newBody, {childList: true});
	});

	handleActiveChange();
	initPerPage();
	addStudyCss();
	addDashboardCss();
	addAudioHotkey();

	function handleActiveChange() {
		if (isActive()) {
			//onlyVocabQuestions();
			onlyMeaningQuestions();
		} else {
			onlyVocab?.remove();
			onlyMeaning?.remove();
			onlyVocab = null;
			onlyMeaning = null;
		}
	}

	function onExtraStudy() {
		return document.URL.startsWith("https://www.wanikani.com/subjects/extra_study") || /wanikani.com\/recent-mistakes\/.*quiz/.test(document.URL);
	}

	function initPerPage() {
		if (onExtraStudy() && isActive()) {
			turnAllIntoAudioQuestions();
		}
		if (document.URL == "https://www.wanikani.com/" || document.URL == "https://www.wanikani.com/dashboard") {
			addToggle();
		}
	}

	function isActive() {
		return localStorage.getItem("extraStudyAudioQuiz") === "true";
	}

	function onlyVocabQuestions() {
		onlyVocab = onlyVocab ?? wkQueue.on("extraStudy").addFilter(q => q.filter(i => i.subject.subject_category === "Vocabulary"), {subject: true});
	}

	function onlyMeaningQuestions() {
		onlyMeaning = onlyMeaning ?? wkQueue.on("extraStudy").addPostprocessing(q => q.forEach(i => {
			if (i.subject.subject_category === "Vocabulary") {
				i.subject.type = "KanaVocabulary";
			}
		}));
	}

	async function turnAllIntoAudioQuestions() {
		document.body.classList.add("audio-quiz-active");
		const character = document.querySelector(".character-header__characters");
		const icon = document.createElement("i");
		icon.classList.add("fa", "fa-volume-up", "audio-quiz-speaker");
		character.after(icon);
		character.parentElement.addEventListener("click", playAudio);

		new MutationObserver(m => {
			const answered = m[0].target.getAttribute("correct") !== null;
			document.body.classList.toggle("answered", answered);
			if (!answered) playAudio();
		}).observe(document.querySelector(".quiz-input__input-container"), {attributes: true, attributeFilter: ["correct"], attributeOldValue: true});
	}

	async function addToggle() {
		const [input, label] = createSwitch("audio-quiz-switch", "Audio Quiz");
		input.checked = isActive();
		input.addEventListener("change", e => { localStorage.setItem("extraStudyAudioQuiz", e.target.checked); handleActiveChange(); });
		document.querySelector(".wk-panel--extra-study").append(input, label);
	}

	function createSwitch(id, text) {
		const input = document.createElement("input");
		const label = document.createElement("label");
		input.type = "checkbox";
		input.id = id;
		label.htmlFor = id;
		label.textContent = text;
		label.classList.add("switch");
		input.classList.add("switch");
		return [input, label];
	}

	function addAudioHotkey() {
		document.addEventListener("keydown", e => {
			if (!onExtraStudy() || !isActive()) return;
			if ((e.ctrlKey || e.altKey) && e.key === "j") {
				e.preventDefault();
				e.stopPropagation();
				playAudio();
			}
		});
	}

	async function playAudio() {
		if (!document.getElementsByClassName("character-header--vocabulary").length) return;
		let currentId = parseInt(document.querySelector("[data-subject-id]").dataset.subjectId);
		let audioUrl = (await wkQueue.currentReviewQueue()).find(q => q.id === currentId).subject.readings?.[0].pronunciations[0].sources[0].url;
		if (audioUrl)
		{
			new Audio(audioUrl).play();
			return;
		}

		const text = document.querySelector(".character-header__characters").textContent;
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = /^[\w\s]+$/.test(text) ? "en" : "ja-JP";
		speechSynthesis.speak(utterance);
	}

	function addDashboardCss() {
		const style = document.createElement("style");
		style.textContent = `
		.wk-panel--extra-study {
			position: relative;
		}

		input.switch {
			display: none;
		}

		.wk-panel--extra-study label.switch {
			position: absolute;
			right: 12px;
			top: 16px;
		}

		label.switch {
			padding-right: 2.1em;
		}

		label.switch::before {
			content: "";
			position: absolute;
			right: 0;
			width: 1.7em;
			height: 1em;
			border-radius: 1em;
			background-color: #bdbdbd;
			transition: .2s;
		}

		label.switch::after {
			content: "";
			position: absolute;
			right: 0;
			width: 1em;
			height: 1em;
			border-radius: 50%;
			background-color: white;
			transition: .2s;
			transform: translateX(-0.7em) scale(0.8);
		}

		input.switch:checked + label::before {
			background-color: #59c274;
		}

		input.switch:checked + label::after {
			transform: scale(0.8);
		}

		.es-mover label.switch {
			right: 36px;
		}

		.es-mover-minimal label.switch {
			top: auto;
			right: 12px;
			bottom: 0;
		}`;
		document.head.appendChild(style);
	}

	function addStudyCss() {
		const style = document.createElement("style");
		style.textContent = `
		body.audio-quiz-active .character-header--vocabulary .character-header__content {
			cursor: pointer;
		}

		body.audio-quiz-active .character-header--vocabulary .character-header__characters {
			display: none;
		}

		body.audio-quiz-active .character-header--vocabulary .audio-quiz-speaker {
			display: initial;
		}

		.audio-quiz-speaker {
			display: none;
			font-size: 100px;
			line-height: 1.2;
			margin-bottom: var(--spacing-normal);
		}

		body.audio-quiz-active.answered .character-header--vocabulary .audio-quiz-speaker {
			display: none;
		}

		body.audio-quiz-active.answered .character-header--vocabulary .character-header__characters {
			display: initial;
		}`;
		document.head.appendChild(style);
	}
})();
