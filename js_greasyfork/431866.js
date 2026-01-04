// ==UserScript==
// @name         Advanced Context Sentence 2
// @namespace    advancedContextSentence
// @version      2.26
// @description  Enhance the context sentence section, highlighting kanji and adding audio
// @author       Sinyaven
// @license      MIT
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://unpkg.com/@popperjs/core@2.5.4/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@6.2.7/dist/tippy-bundle.umd.min.js
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1673042
// @require      https://greasyfork.org/scripts/489759-wk-custom-icons/code/CustomIcons.js?version=1417568
// @supportURL   https://community.wanikani.com/t/55837
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431866/Advanced%20Context%20Sentence%202.user.js
// @updateURL https://update.greasyfork.org/scripts/431866/Advanced%20Context%20Sentence%202.meta.js
// ==/UserScript==

// Original script by abdullahalt (https://openuserjs.org/users/abdullahalt)

(() => {
	"use strict";
	/* global wkItemInfo, Icons, tippy */
	/* eslint no-multi-spaces: off */

	//--------------------------------------------------------------------------------------------------------------//
	//-----------------------------------------------INITIALIZATION-------------------------------------------------//
	//--------------------------------------------------------------------------------------------------------------//
	const wkof = window.wkof;

	const cssNamespace = "advanced-context-sentence";
	const scriptId = "AdvancedContextSentence";
	const scriptName = "Advanced Context Sentence";
	const recognizedSelector = `.${cssNamespace} a.recognized`;
	const unrecognizedSelector = `.${cssNamespace} a.unrecognized`;

	let state = {
		settings: {
			recognizedKanjiColor: "#f100a1",
			unrecognizedKanjiColor: "#888888",
			recognitionLevel: "5",
			tooltip: {
				show: true,
				delay: 0,
				position: "top"
			},
			voice: "browser",
			soundVolume: 100,
			ttsHighlightWord: true,
			showSentenceLink: true,
			sentenceLink: "https://ichi.moe/cl/qr/?q=%s&r=kana"
		},
		kanjis: [],
		jiff: false // JLPT, Joyo and Frequency Filters
	};

	window.speechSynthesis?.getVoices(); // should initiate loading of voices in Chromium so that once the button is clicked, speechSynthesis.getVoices() actually returns the complete list of available voices

	// Application start Point
	main();

	async function main() {
		await init();
		wkItemInfo.forType("vocabulary", "kanaVocabulary").under("examples").notifyWhenVisible(evolveContextSentence);
	}

	async function init() {
		createReferrer();
		createStyle();

		if (wkof) {
			wkof.include("ItemData,Settings");
			await wkof
				.ready("ItemData,Settings")
				.then(loadSettings)
				.then(proccessLoadedSettings)
				.then(getKanji)
				.then(extractKanjiFromResponse);
		} else {
			console.warn(
				`${scriptName}: You are not using Wanikani Open Framework. Some functionality will be unavailable: 1. Highlighting of learned kanji, 2. Settings dialog`
			);
		}
	}

	function evolveContextSentence() {
		let sentences = document.querySelectorAll(".subject-section__text--grouped, .subject-section__content > .context-sentences");
		let patternSentences = document.querySelectorAll(".subject-collocations .context-sentences");
		let allSentences = [...sentences, ...patternSentences];

		if (wkof) evolveHeader(sentences[0].previousElementSibling || sentences[0].parentElement.previousElementSibling);

		allSentences.forEach(s => s.classList.add(cssNamespace));
		allSentences.forEach(sentence => {
			const japaneseSentence = sentence.querySelector('p[lang="ja"]');
			const sentenceText = japaneseSentence.textContent;
			const sentenceLink = createSentenceLink(sentenceText);
			const audioButton = createAudioButton(sentenceText);
			const chars = [...sentenceText];
			const newNodes = chars.map(char => tagAndLinkKanji(char));
			japaneseSentence.replaceChildren(...newNodes, sentenceLink, audioButton);
		});

		highlightKanji();
	}

	function evolveHeader(header) {
		if (header.querySelector(".wk-icon")) return;

		const settings = Icons.customIcon("settings");
		settings.style = "font-size: 14px; cursor: pointer; margin-left: 10px;";
		settings.onclick = openSettings;

		header.append(settings);
	}

	function createSentenceLink(sentence) {
		let result = document.createElement("a");
		let icon = Icons.customIcon("srs-up");
		icon.style = "transform: rotate(45deg);";
		result.classList.add("sentence-link");
		result.href = state.settings.sentenceLink.replace("%s", sentence);
		result.target = "_blank";
		result.append(icon);
		return result;
	}

	function updateSentenceLinks() {
		document.body.classList.toggle("advanced-context-sentence-hide-sentence-link", !state.settings.showSentenceLink);
		document.querySelectorAll(`.${cssNamespace} .sentence-link`).forEach(l => {
			l.href = state.settings.sentenceLink.replace("%s", l.parentElement.textContent);
		});
	}

	function recreateAudioButtons() {
		document.querySelectorAll(`.${cssNamespace} > p > span:last-child, .${cssNamespace} > p > button:last-child`).forEach(audioButton => audioButton.remove());
		const sentences = document.querySelectorAll(`.${cssNamespace}`);
		sentences.forEach(sentence => {
			const japaneseSentence = sentence.querySelector('p[lang="ja"]');
			const sentenceText = japaneseSentence.textContent;
			const audioButton = createAudioButton(sentenceText);
			japaneseSentence.append(audioButton);
		});
	}

	function createAudioButton(sentence) {
		if (state.settings.voice === "google") {
			return createAudioButtonGoogleTL(sentence);
		} else {
			return createAudioButtonSpeechSynthesis(sentence);
		}
	}

	/**
	 * To fix a weird issue that occurs in the session pages (where all audios play
	 * if the audio for reading the word is clicked),
	 * we have to create the audio element only for the time of palying the audio
	 * and remove it afterward
	 * @param {*} sentence
	 */
	function createAudioButtonGoogleTL(sentence) {
		const audioIdleClass = "sound-off";
		const audioPlayClass = "sound-on";

		// contains audio and button as sibiling elements
		const audioContainer = document.createElement("span");

		const mpegSource = createSource("audio/mpeg", sentence);
		const oogSource = createSource("audio/oog", sentence);

		const button = document.createElement("button");
		const soundOn = Icons.customIcon("sound-on");
		const soundOff = Icons.customIcon("sound-off");
		button.classList.add("audio-btn", audioIdleClass);
		button.append(soundOn, soundOff);

		button.onclick = () => {
			if (audioContainer.childElementCount > 1) {
				const audio = audioContainer.querySelector("audio");
				audio.pause();
				button.classList.replace(audioPlayClass, audioIdleClass);
				audio.remove();
				return;
			}

			const audio = document.createElement("audio");
			audio.append(mpegSource, oogSource);
			audio.volume = state.settings.soundVolume / 100;

			audio.onplay = () => {
				button.classList.replace(audioIdleClass, audioPlayClass);
			};

			audio.onended = () => {
				button.classList.replace(audioPlayClass, audioIdleClass);
				audio.remove();
			};

			audioContainer.append(audio);
			audio.play();
		};

		audioContainer.append(button);
		return audioContainer;
	}

	function createAudioButtonSpeechSynthesis(sentence) {
		if (!window.SpeechSynthesisUtterance) {
			console.warn(`${scriptName}: your browser does not support SpeechSynthesisUtterance. Switch to Google Translate, update your browser, or use a different one if you want that feature`);
			return null;
		}
		const audioIdleClass = "sound-off";
		const audioPlayClass = "sound-on";

		const button = document.createElement("button");
		const soundOn = Icons.customIcon("sound-on");
		const soundOff = Icons.customIcon("sound-off");
		button.classList.add("audio-btn", audioIdleClass);
		button.append(soundOn, soundOff);

		let msg = null;

		button.onclick = () => {
			if (!msg) {
				msg = new SpeechSynthesisUtterance(sentence);
				let voice = selectVoice(state.settings.voice);
				if (voice) {
					msg.voice = voice;
				}else {
					msg.lang = "ja-JP";
				}
				msg.volume = state.settings.soundVolume / 100;

				msg.onstart = () =>   button.classList.replace(audioIdleClass, audioPlayClass);
				msg.onend   = () => { button.classList.replace(audioPlayClass, audioIdleClass); highlightSection(button.parentElement, 0, 0); };
				if (state.settings.ttsHighlightWord) msg.onboundary = e => highlightSection(button.parentElement, e.charIndex, e.charIndex + e.charLength);
			}
			window.speechSynthesis.speak(msg);
		};

		return button;
	}

	function getVoiceList() {
		let voices = window.speechSynthesis?.getVoices() || [];
		voices = [voices.filter(v => v.lang.startsWith("ja-")), voices].find(a => a.length > 0) || [];
		voices = voices.map(v => [v.name, simplifyVoiceName(v.name, v.localService)]);
		// fall back to original name if the simplification leads to duplicates
		voices.forEach(v0 => {
			if (v0[1].trim() === "" || voices.reduce((sum, v1) => sum + (v0[1] === v1[1] ? 1 : 0), 0) > 1) {
				v0[1] = v0[0];
			}
		});
		if (voices.length === 0) voices = [["browser", "Web Browser (no Japanese voice detected)"]];
		return voices;
	}

	function selectVoice(name) {
		let voices = window.speechSynthesis?.getVoices() || [];
		voices = [voices.filter(v => v.lang.startsWith("ja-")), voices].find(a => a.length > 0) || [];
		voices = [voices.filter(v => v.name === name         ), voices].find(a => a.length > 0) || [];
		return voices[0];
	}

	function simplifyVoiceName(name, localService) {
		return (localService ? "[local] " : "[online] ") + name.replace(/\bjapan(?:ese)?\b|\bnatural\b|\bonline\b/gi, "").replace(/[\s()-]+$|^[\s()-]+/g, "");
	}

	//--------------------------------------------------------------------------------------------------------------//
	//----------------------------------------------SETTINGS--------------------------------------------------------//
	//--------------------------------------------------------------------------------------------------------------//

	function loadSettings() {
		return wkof.Settings.load(scriptId, state.settings);
	}

	function proccessLoadedSettings() {
		state.settings = wkof.settings[scriptId];
		document.body.classList.toggle("advanced-context-sentence-hide-sentence-link", !state.settings.showSentenceLink);
	}

	function openSettings() {
		const voiceList = Object.fromEntries([...getVoiceList(), ["google", "[online] Google Translate"]]);
		var config = {
			script_id: scriptId,
			title: scriptName,
			pre_open: updateDialog,
			on_save: updateSettings,
			content: {
				highlightColors: {
					type: "section",
					label: "Highlights"
				},
				recognizedKanjiColor: {
					type: "color",
					label: "Recognized Kanji",
					hover_tip:
						"Kanji you should be able to recognize will be highlighted using this color",
					default: state.settings.recognizedKanjiColor
				},
				unrecognizedKanjiColor: {
					type: "color",
					label: "Unrecognized Kanji",
					hover_tip:
						"Kanji you shouldn't be able to recognize will be highlighted using this color",
					default: state.settings.unrecognizedKanjiColor
				},
				recognitionLevel: {
					type: "dropdown",
					label: "Recognition Level",
					hover_tip:
						"Any kanji with this SRS level or higher will be highlighted with the 'Recognized Kanji' color",
					default: state.settings.recognitionLevel,
					content: {
						1: stringifySrs(1),
						2: stringifySrs(2),
						3: stringifySrs(3),
						4: stringifySrs(4),
						5: stringifySrs(5),
						6: stringifySrs(6),
						7: stringifySrs(7),
						8: stringifySrs(8),
						9: stringifySrs(9)
					}
				},
				tooltip: {
					type: "section",
					label: "Tooltip"
				},
				show: {
					type: "checkbox",
					label: "Show Tooltip",
					hover_tip:
						"When hovering over kanji, show a tooltip that will display some of its properties",
					default: state.settings.tooltip.show,
					path: "@tooltip.show"
				},
				delay: {
					type: "number",
					label: "Delay",
					hover_tip: "Delay in milliseconds before the tooltip is shown",
					default: state.settings.tooltip.delay,
					path: "@tooltip.delay"
				},
				position: {
					type: "dropdown",
					label: "Position",
					hover_tip: "The placement of the tooltip",
					default: state.settings.tooltip.position,
					path: "@tooltip.position",
					content: {
						top: "Top",
						bottom: "Bottom",
						right: "Right",
						left: "Left"
					}
				},
				voiceSection: {
					type: "section",
					label: "Voice"
				},
				voice: {
					type: "dropdown",
					label: "Voice",
					hover_tip: "Select the machine voice that reads the sentence aloud",
					default: state.settings.voice,
					content: voiceList,
					on_change: updateDialog
				},
				soundVolume: {
					type: "input",
					subtype: "range",
					label: "Volume",
					hover_tip: "Select how loud the text-to-speech output should be",
					default: state.settings.soundVolume
				},
				ttsHighlightWord: {
					type: "checkbox",
					label: "Highlight word",
					hover_tip: "Highlight the section of the sentence that the synthetic voice is currently reading. Not available for the Google Translate voice"
				},
				sentenceLinkSection: {
					type: "section",
					label: "Weblink"
				},
				showSentenceLink: {
					type: "checkbox",
					label: "Show weblink",
					hover_tip: "Show a weblink after the sentence"
				},
				sentenceLink: {
					type: "text",
					label: "Weblink",
					hover_tip: "An URL with %s as a placeholder for the japanese sentence."
				}
			}
		};
		var dialog = new wkof.Settings(config);
		dialog.open();
	}

	function updateDialog() {
		document.getElementById("AdvancedContextSentence_ttsHighlightWord").disabled = wkof.settings.AdvancedContextSentence.voice === "google";
	}

	// Called when the user clicks the Save button on the Settings dialog.
	function updateSettings() {
		state.settings = wkof.settings[scriptId];
		highlightKanji();
		recreateAudioButtons();
		updateSentenceLinks();
	}

	//---------------------------------------------------------------------------------------------------------------//
	//-------------------------------------------HELPER FUNCTIONS----------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------//

	function tagAndLinkKanji(char) {
		return isKanji(char) ? wrapInAnchor(char) : wrapInSpan(char);
	}

	/**
	 * Determine if the character is a Kanji, inspired by https://stackoverflow.com/a/15034560
	 */
	function isKanji(char) {
		return isCommonOrUncommonKanji(char) || isRareKanji(char);
	}

	function isCommonOrUncommonKanji(char) {
		return char >= "\u4e00" && char <= "\u9faf";
	}

	function isRareKanji(char) {
		return char >= "\u3400" && char <= "\u4dbf";
	}

	/**
	 * Renders the link for the kanji
	 * Kanji pages always use https://www.wanikani.com/kanji/{kanji} where {kanji} is the kanji character
	 */
	function wrapInAnchor(char) {
		const anchor = document.createElement("a");
		anchor.target = "_blank";
		anchor.classList.add("recognized");

		if (!wkof) {
			anchor.href = `https://www.wanikani.com/kanji/${char}`;
			anchor.textContent = char;
			return anchor;
		}

		const kanji = state.kanjis.find(item => item.char == char);

		anchor.dataset.srs = kanji ? kanji.srs : -1;
		anchor.dataset.kanji = char;
		anchor.href = kanji ? kanji.url : `https://jisho.org/search/${char}`;

		anchor.textContent = char;
		return anchor;
	}

	function wrapInSpan(char) {
		const span = document.createElement("span");
		span.textContent = char;
		return span;
	}

	function highlightSection(sentenceContainer, start, end) {
		[...sentenceContainer.children].forEach((element, i) => {
			element.classList.toggle("tts-focus", i >= start && i < end);
		});
	}

	function createTooltip(kanji) {
		if (!wkof) {
			const container = document.createElement("span");
			return container;
		}

		const container = document.createElement("div");
		container.classList.add("acs-tooltip");

		if (!kanji) {
			const span = document.createElement("span");
			span.textContent = "Wanikani doesn't have this kanji! :(";
			container.append(span);
			return container;
		}

		const onyomi  = kanji.readings.filter(r => r.type ===  "onyomi").map(r => r.reading).join(", ");
		const kunyomi = kanji.readings.filter(r => r.type === "kunyomi").map(r => r.reading).join(", ");
		const meaning = kanji.meanings                                  .map(m => m.meaning).join(", ");

		container.append(generateInfo("LV", kanji.level));

		container.append(generateInfo("EN", meaning));

		if ( onyomi !== "None" &&  onyomi !== "") container.append(generateInfo("ON",  onyomi));
		if (kunyomi !== "None" && kunyomi !== "") container.append(generateInfo("KN", kunyomi));
		container.append(generateInfo("SRS", stringifySrs(kanji.srs)));

		if (state.jiff) {
			container.append(generateInfo("JOYO", kanji.joyo));
			container.append(generateInfo("JLPT", kanji.jlpt));
			container.append(generateInfo("FREQ", kanji.frequency));
		}
		return container;
	}

	function stringifySrs(srs) {
		switch (srs) {
			case -1:
				return "Locked";
			case 0:
				return "Ready To Learn";
			case 1:
				return "Apprentice 1";
			case 2:
				return "Apprentice 2";
			case 3:
				return "Apprentice 3";
			case 4:
				return "Apprentice 4";
			case 5:
				return "Guru 1";
			case 6:
				return "Guru 2";
			case 7:
				return "Master";
			case 8:
				return "Enlightened";
			case 9:
				return "Burned";
			default:
				return "";
		}
	}

	function generateInfo(title, info) {
		const container = document.createElement("div");
		const key = document.createElement("span");
		key.classList.add("acs-tooltip-header");
		const value = document.createElement("span");
		key.textContent = title;
		value.textContent = info;
		container.append(key, " ", value);
		return container;
	}

	function getKanji() {
		const filters = {
			item_type: ["kan"]
		};

		if (wkof.get_state("JJFFilters") === "ready") {
			state.jiff = true;
			filters.include_frequency_data = true;
			filters.include_jlpt_data = true;
			filters.include_joyo_data = true;
		} else {
			console.warn(
				`${scriptName}: You don't have Open Framework JLPT Joyo and Frequency Filters by @Kumirei installed (version 0.1.4 or later). Install the script if you want to get more information while hovering over kanji in context sentences. Script URL: https://community.wanikani.com/t/35096`
			);
		}

		return wkof.ItemData.get_items({
			wk_items: {
				options: {
					assignments: true
				},
				filters
			}
		});
	}

	function extractKanjiFromResponse(items) {
		state.kanjis = items.map(item => ({
				char: item.data.characters,
				readings: item.data.readings,
				level: item.data.level,
				meanings: item.data.meanings,
				url: item.data.document_url,
				srs: item.assignments ? item.assignments.srs_stage : -1,
				jlpt: item.jlpt_level,
				joyo: item.joyo_grade,
				frequency: item.frequency
			})
		);
	}

	function createSource(type, sentence) {
		const source = document.createElement("source");
		source.type = type;
		source.src = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ja&total=1&idx=0&q=${encodeURIComponent(sentence)}`;
		return source;
	}

	let tippys = new Set();
	function highlightKanji() {
		const rules = document.querySelector("#acs-style").sheet.cssRules;
		rules[0].style.color = state.settings.recognizedKanjiColor;
		rules[1].style.color = state.settings.unrecognizedKanjiColor;

		if (!wkof) return;

		tippys.forEach(t => t.destroy());
		tippys = new Set();

		const anchors = document.querySelectorAll(`.${cssNamespace} a:not(.sentence-link)`);
		anchors.forEach(anchor => {
			const srs = anchor.getAttribute("data-srs");
			const char = anchor.getAttribute("data-kanji");

			anchor.classList.remove("recognized", "unrecognized");
			if (srs >= state.settings.recognitionLevel) {
				anchor.classList.add("recognized");
			} else {
				anchor.classList.add("unrecognized");
			}

			if (state.settings.tooltip.show) {
				const kanji = state.kanjis.find(item => item.char == char);
				const tooltip = createTooltip(kanji);

				tippy(anchor, {
					content: tooltip,
					size: "small",
					arrow: true,
					placement: state.settings.tooltip.position,
					delay: [state.settings.tooltip.delay, 20]
				});
				tippys.add(anchor._tippy);
			}
		});
	}

	// Necessary in order for audio to work
	function createReferrer() {
		const remRef = document.createElement("meta");
		remRef.name = "referrer";
		remRef.content = "same-origin";
		document.head.append(remRef);
	}

	// Styles
	function createStyle() {
		const style = document.createElement("style");
		style.id = "acs-style";
		style.textContent = `

			/* Kanji */
			/* It's important for this one to be the first rule*/
			${recognizedSelector} {

			}
			/* It's important for this one to be the second rule*/
			${unrecognizedSelector} {

			}

			.${cssNamespace} p a, .${cssNamespace} p a:hover {
				text-decoration: none;
			}

			.${cssNamespace} .sentence-link {
				color: #a2a2a2;
			}

			body.advanced-context-sentence-hide-sentence-link .${cssNamespace} a.sentence-link {
				display: none;
			}

			.${cssNamespace} .audio-btn {
				cursor: pointer;
				margin-left: 0.2em;
				background: none;
			}

			.${cssNamespace} .audio-btn.sound-off svg:first-of-type, .${cssNamespace} .audio-btn.sound-on svg:last-of-type {
				display: none;
			}

			.${cssNamespace} .tts-focus {
				color: var(--inverted-text-color, white);
				background-color: var(--text-color, #333);
			}

			.acs-tooltip {
				text-align: left;
			}

			.acs-tooltip-header {
				color: #929292;
			}

		`;

		document.head.append(style);
	}
})();
