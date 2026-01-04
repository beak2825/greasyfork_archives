// ==UserScript==
// @name         ConfusionGuesser
// @namespace    confusionguesser
// @version      1.23
// @description  If you give a wrong answer during reviews, it tries to guess which other WaniKani item you confused it with.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @homepageURL  https://community.wanikani.com/t/38432
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388692/ConfusionGuesser.user.js
// @updateURL https://update.greasyfork.org/scripts/388692/ConfusionGuesser.meta.js
// ==/UserScript==

(async function() {
	"use strict";
	/* global wkof */
    /* eslint no-multi-spaces: "off" */

	if (!window.wkof) {
		alert("ConfusionGuesser script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.");
		window.location.href = "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
		return;
	}

	wkof.include("ItemData,Menu,Settings");
	await wkof.ready("document,ItemData,Menu,Settings");

	const PROBABILITY_SCALING_RENDAKU = 0.4;
	const PROBABILITY_SCALING_GEMINATION = 0.4;
	const MIN_KANJI_SIMILARITY = 0.1;
	const LEVENSHTEIN_TRANSPOSITION_COST = 0.3;

	const defaultColors = {
		vissimColor: "#FFD700",
		ononColor: "#00AAFF",
		onkunColor: "#00AAFF",
		kunonColor: "#5571E2",
		kunkunColor: "#5571E2",
		naonColor: "#FFA500",
		nakunColor: "#FFA500",
		onnaColor: "#FFA500",
		kunnaColor: "#FFA500",
		nanaColor: "#FFA500",
		specialColor: "#555555",
		textColor: "#FFFFFF"
	}

	const idsEqualities = {
		囗: "口",
		厶: "ム",
		亻: "ｲ"
	}

	// approximate mappings
	const radicalIdToChar = {
		8761: "丨",  // stick
		8762: "𠂉",  // gun
		8763: "丆",  // leaf
		8764: "人",  // hat === person
		8765: "⺌",  // triceratops
		8766: "丂",  // beggar
		8767: "丷",  // horns
		8788: "丷",  // explosion === horns
		8768: "业",  // spikes
		8770: "𧘇",  // kick
		8771: "之",  // hills
		8772: "爫",  // cleat
		8773: "𥃭",  // pope, only in 盾
		8774: "𦰩",  // chinese
		8775: "龷",  // blackjack
		8776: "𠫓",  // trash
		8777: "𠂤",  // bear, 㠯 is only in 官
		8779: "𡗗",  // spring
		8780: "𠃌",  // cape
		8781: "𠮛",  // creeper
		8782: "㦮",  // bar
		8784: "袁",  // zombie
		8785: "㑒",  // squid
		8787: "廿",  // yurt, more distinctive part
		8790: "俞",  // death-star
		8793: "𠦝",  // morning
		8794: "丞",  // coral
		8797: "鬯",  // psychopath, more distinctive part
		8798: "𠙻",  // satellite, more distinctive part
		8799: "耳",  // elf === ear
		8819: "龹",  // gladiator
		8783: "𭕄",  // grass
		8769: "𭕄",  // viking === grass
//		8778: "④",  // tofu
//		8792: "⑤",  // comb
//		8796: "⑥",  // cactus
	}

	const jokeMeaningFilter = {
		3237: ["The Answer"],
		5633: ["Nic Cage"]
	}

	const typeDescription = {
		onyomionyomi     : "Wrong on'yomi",
		onyomikunyomi    : "Used on'yomi but needed kun'yomi",
		kunyomionyomi    : "Used kun'yomi but needed on'yomi",
		kunyomikunyomi   : "Wrong kun'yomi",
		nanorionyomi     : "Used nanori but needed on'yomi",
		nanorikunyomi    : "Used nanori but needed kun'yomi",
		onyominanori     : "Used on'yomi but needed nanori",
		kunyominanori    : "Used kun'yomi but needed nanori",
		nanorinanori     : "Wrong nanori",
		onyomiundefined  : "Used on'yomi but needed special reading",
		kunyomiundefined : "Used kun'yomi but needed special reading",
		nanoriundefined  : "Used nanori but needed special reading",
		visuallySimilar  : "Visually similar"
	}

	let similarityCache = {};
	let oldSettings = {};

	// true if in alternative mode: show guesses even though answer was CORRECT
	let correctAnswer = false;

	// variables that will be initialized by settingsChanged()
	let idsHash = {};
	let byId = {};
	let byReading = {};
	let byCharacters = {};
	let byMeaning = {};
	let srs = [];

	let dOverlay = null;
	let dCollapsible = null;
	let bExpand = null;
	let fObserverTarget = null;
	let iUserInput = null;
	let iShowLess = null;
	let hotkeyEntry = null;
	let hotkeyKey = null;

	// it seems like Turbo does not move the SVG and the .wk-modal element into document.body, so let's ignore it
	function relevantRootElementChildren(rootElement) {
		return [...rootElement?.children ?? []].filter(c => c.tagName !== `svg` && !c.classList.contains(`wk-modal`));
	}

	document.addEventListener("turbo:before-render", async e => {
		let observer = new MutationObserver(m => {
			if (relevantRootElementChildren(m[0].target).length > 0) return;
			observer.disconnect();
			observer = null;
			init();
		});
		observer.observe(e.detail.newBody, {childList: true});
	});
	init();

	function init() {
		if (!document.URL.endsWith("wanikani.com/subjects/review") && !document.URL.includes("wanikani.com/subjects/extra_study") && !/wanikani.com\/recent-mistakes\/.*quiz/.test(document.URL)) return;

		// inject the overlay into the DOM
		let fFooter = document.querySelector("#reviews footer, footer.quiz-footer");
		dOverlay = document.createElement("div");
		dCollapsible = document.createElement("div");
		bExpand = document.createElement("button");
		bExpand.title = "Show ConfusionGuesser list";
		bExpand.addEventListener("click", showGuesses);
		dCollapsible.classList.add("collapsed");
		dOverlay.id = "confusionGuesserOverlay";
		dOverlay.appendChild(dCollapsible);
		fFooter.parentElement.insertBefore(dOverlay, fFooter);

		iShowLess = null;
		document.removeEventListener("keydown", keydown);
		document.addEventListener("keydown", keydown);

		// add entry to hotkey list
		hotkeyEntry = document.createElement("div");
		hotkeyKey = document.createElement("div");
		let hotkeyKeyDisplay = document.createElement("div");
		let hotkeyDescription = document.createElement("div");
		hotkeyEntry.classList.add("hotkeys-menu__entry");
		hotkeyKey.classList.add("hotkeys-menu__key");
		hotkeyKeyDisplay.classList.add("hotkeys-menu__keys");
		hotkeyDescription.classList.add("hotkeys-menu__description");
		hotkeyDescription.textContent = "Expand/collapse guesses";
		hotkeyKeyDisplay.appendChild(hotkeyKey);
		hotkeyEntry.appendChild(hotkeyKeyDisplay);
		hotkeyEntry.appendChild(hotkeyDescription);
		document.querySelector(".hotkeys-menu__content").appendChild(hotkeyEntry);

		installCss();
		setupMenu();

		// create observer to react to wrong answers
		iUserInput = document.getElementById("user-response");
		fObserverTarget = document.querySelector("#answer-form fieldset, .quiz-input__input-container");
		let observer = new MutationObserver(m => m.forEach(handleMutation));
		observer.observe(fObserverTarget, {attributes: true, attributeFilter: ["class", "correct"]});
	}

	function keydown(ev) {
		if ((ev.target.nodeName === "INPUT" && ev.target.getAttribute("enabled") !== "false") || ev.key.toLowerCase() !== wkof.settings.confusionguesser.hotkeyExpand || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey) return;
		let collapsed = dCollapsible.classList.contains("collapsed");
		if (iShowLess && !collapsed) iShowLess.checked = !iShowLess.checked;
		if (collapsed && fObserverTarget.getAttribute("correct") !== null) showGuesses();
	}

	function handleMutation(mutation) {
		let action = mutation.attributeName === "correct" ?
			(mutation.target.getAttribute("correct") === "false" ? wkof.settings.confusionguesser.incorrectAction : (mutation.target.getAttribute("correct") === "true" ? wkof.settings.confusionguesser.correctAction : "hide")) :
			(mutation.target.classList.contains("incorrect") ? wkof.settings.confusionguesser.incorrectAction : (mutation.target.classList.contains("correct") ? wkof.settings.confusionguesser.correctAction : "hide"));
		if (action === "show") {
			showGuesses();
		} else if (action === "showThreshold") {
			showGuesses(parseFloat(wkof.settings.confusionguesser.showThreshold));
		} else {
			hideGuesses();
			if (action === "arrow") dOverlay.insertBefore(bExpand, dCollapsible);
		}
	}

	async function showGuesses(threshold = -1) {
		bExpand.remove();
		correctAnswer = fObserverTarget.getAttribute("correct") == "true";

		// clear cache
		similarityCache = {};

		let guesses = [];
		let currentId = parseInt(document.querySelector(`[data-subject-id]`).dataset.subjectId);
		let currentItem = byId[currentId];
		let expectedReading = currentItem.data.readings?.filter(r => r.accepted_answer).map(r => r.reading);
		let question = radicalIdToChar[currentId] || currentItem.data.characters;

		// ensure that idsFile finished loading
		idsHash = await idsHash;

		switch (document.querySelector(`[for=user-response]`).dataset.questionType) {
			case "reading": guesses = guessForReading(iUserInput.value, expectedReading, question); break;
			case "meaning": guesses = guessForMeaning(iUserInput.value, question); break;
		}

		// for each item-reading combination find the guess with the highest rating
		let itemIdBestGuess = {};
		guesses.forEach((g, i) => {let id = g.item.id + (g.reading || ""); itemIdBestGuess[id] = (itemIdBestGuess[id] !== undefined && g.probability <= guesses[itemIdBestGuess[id]].probability) ? itemIdBestGuess[id] : i});
		//  pass on "show" property to this item's guess with the highest rating
		guesses.forEach(g => {if (g.show) guesses[itemIdBestGuess[g.item.id + (g.reading || "")]].show = true});
		// remove duplicate guesses suggesting the same WK item with the same reading (only keep the guess with highest probability)
		guesses = guesses.filter((g, i) => itemIdBestGuess[g.item.id + (g.reading || "")] === i);
		// if the list is long, remove guesses with probability 0
		// remove the guesses for kanji that the user got correct
		guesses = guesses.filter(g => g.type !== "correct");
		// sort descending by probability; also put guesses that are to be shown to the front
		guesses.sort((g1, g2) => g1.show === g2.show ? g2.probability - g1.probability : (g1.show ? -1 : 1));

		// remove old guesses
		while (dCollapsible.firstChild) {
			dCollapsible.removeChild(dCollapsible.firstChild);
		}
		if (guesses.length === 0) return;
		// show only arrow if all guesses below threshold
		if (guesses[0].probability < threshold) {
			dOverlay.insertBefore(bExpand, dCollapsible);
			return;
		}
		// display new guesses
		let dGuesses = document.createElement("div");
		if (guesses.some(g => !g.show)) addShowMoreOption(dCollapsible);
		guesses.forEach(g => { if (isSpoiler(g)) dGuesses.appendChild(spoilerButton(g)); dGuesses.appendChild(guessToDiv(g)); });
		dGuesses.id = "guesses";
		dCollapsible.appendChild(dGuesses);
		dCollapsible.classList.toggle("collapsed", false);
	}

	function hideGuesses() {
		dCollapsible.classList.toggle("collapsed", true);
		bExpand.remove();
	}

	function guessForMeaning(answer, question) {
		answer = answer.toLowerCase();
		let result = searchByMeaning(answer).map(item => ({type: "visuallySimilar", item, probability: rateSimilarity(item, question)}));
		if (correctAnswer) result = result.filter(r => !question.includes(r.item.data.characters));
		// for each guess, select the meaning that is closest to the answer, and also adapt its probability by the meaning similarity
		result.forEach(r => {let best = meaningsOfItem(r.item).reduce((best, m) => {let rating = rateSimilarity(m.toLowerCase(), answer); return rating > best.rating ? {rating, meaning: m} : best}, {rating: -1}); r.meaning = best.meaning; r.probability *= best.rating});
		result.sort((a, b) => b.probability - a.probability);
		if (result.length > 0) result[0].show = true;
		return result;
	}

	function guessForReading(answer, expected, question) {
		expected = ensureArray(expected);
		let guesses = expected.flatMap(e => guessForReading_splitByOkurigana(answer, e, question));
		return guesses.concat(guessForReading_wholeVocab(answer, question));
	}

	function guessForReading_wholeVocab(answer, question) {
		let result = searchByReading(answer).filter(item => item.object === "vocabulary").map(item => ({type: "visuallySimilar", item, reading: answer, probability: rateSimilarity(item, question)}));
		if (correctAnswer) result = result.filter(r => r.item.data.characters !== question);
		result.sort((a, b) => b.probability - a.probability);
		if (result.length > 0) result[0].show = true;
		return result;
	}

	function guessForReading_splitByOkurigana(answer, expected, question) {
		question = replaceDecimalWithJapanese(question);
		let parts = question.split(/([\u301c\u3041-\u309f\u30a0-\u30ff]+)/);
		if (parts.length === 1) return guessForReading_splitByKanji(answer, expected, question);

		// if question contains okurigana, separate at these positions using regexp (assumption: can be done unambiguously - seems to work for every WK vocab's correct reading)
		let regex = new RegExp("^" + parts.map((p, idx) => idx & 1 ? p : (p ? "(.+)" : "()")).join("") + "$");
		answer = answer.match(regex);
		expected = expected.match(regex);
		// if okurigana does not match answer return no guesses
		if (!answer) return [];

		answer.shift();
		expected.shift();
		return answer.flatMap((a, idx) => guessForReading_splitByKanji(a, expected[idx], parts[idx * 2]));
	}

	function guessForReading_splitByKanji(answer, expected, question) {
		if (!question) return [];
		question = question.replace(/(.)々/g, "$1$1");
		let splitAnswer = possibleSplits(answer, question.length);
		let splitExpected = possibleSplits(expected, question.length);
		// try to split the expected reading to on/kun of each kanji; if not successful then return no guesses
		let kanjiReadings = splitExpected.filter(s => s.every((part, idx) => validReading(question[idx], part))).pop();
		// if it was not possible to validate the reading for every kanji, try to find a split where at least every second kanji has a validated reading
		kanjiReadings = kanjiReadings || splitExpected.filter(s => s.reduce((state, part, idx) => state === 2 ? 2 : (validReading(question[idx], part) ? 0 : ++state), 0) !== 2).pop();
		// if there was still no solution found, give up
		if (!kanjiReadings) return [];

		// for each split (of the answer entered by the user), guess for each part => array of arrays of arrays
		let guesses = splitAnswer.map(s => s.map((part, idx) => guessForReading_singleKanji(part, kanjiReadings[idx], question[idx])));
		// remove splits where at least one part resulted in no guesses
		guesses = guesses.filter(forSplit => forSplit.every(forPart => forPart.length > 0));
		// calculate probability of each guess
		guesses.forEach(forSplit => forSplit.forEach((forPart, idx) => forPart.forEach(guess => {guess.probability *= calculateGuessProbability(guess, question[idx])})));
		// sort guesses for each part descending by probability
		guesses.forEach(forSplit => forSplit.forEach(forPart => forPart.sort((a, b) => b.probability - a.probability)));
		// calculate probability of each split by multiplying the highest probability of each part together
		let splitProbability = guesses.map(forSplit => forSplit.reduce((totalProb, forPart) => totalProb * forPart.reduce((highestProb, guess) => Math.max(highestProb, guess.probability), 0), 1));
		// scale the probability of each guess with the highest probabilities for the other parts in the split (overall split probability, but instead of the best guess for the current part, take the current guess)
		guesses.forEach((forSplit, idx) => forSplit.forEach(forPart => forPart.forEach((guess, i) => {if (i !== 0) guess.probability *= splitProbability[idx] / forPart[0].probability})));
		guesses.forEach((forSplit, idx) => forSplit.forEach(forPart => {forPart[0].probability = splitProbability[idx]}));
		// find the split with the highest probability
		let idx = splitProbability.reduce((best, probability, idx) => probability <= best.probability ? best : {probability, idx}, {probability: 0}).idx;
		// mark the best guess (sorted, therefore at index 0) for each part of the best split with "show"
		(guesses[idx] || []).forEach(forPart => {forPart[0].show = true});
		return guesses.flat(2);
	}

	function guessForReading_singleKanji(answer, expected, question) {
		let reading = answer;
		if (answer === expected && !correctAnswer) return [{type: "correct", item: getItem(question), reading, probability: 1}];

		let                                  guesses =                searchByReading(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: 1}));
		reading = removeRendaku1(answer);    guesses = guesses.concat(searchByReading(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_RENDAKU})));
		reading = removeRendaku2(answer);    guesses = guesses.concat(searchByReading(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_RENDAKU})));
		reading = removeGemination1(answer); guesses = guesses.concat(searchByReading(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION})));
		reading = removeGemination2(answer); guesses = guesses.concat(searchByReading(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION})));
		reading = removeGemination3(answer); guesses = guesses.concat(searchByReading(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION})));
		reading = removeGemination4(answer); guesses = guesses.concat(searchByReading(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION})));

		if (answer === expected) {
			guesses = guesses.filter(g => g.item.data.characters !== question);
			return guesses.length === 0 ? [{type: "correct", item: getItem(question), reading, probability: 1}] : guesses;
		}
		// change the type to onyomionyomi, onyomikunyomi etc. where applicable
		guesses.filter(g => g.item.data.characters === question).forEach(g => {g.type = validReading(question, answer) + validReading(question, expected)});
		return guesses;
	}

	function calculateGuessProbability(guess, question) {
		switch (guess.type) {
			case "visuallySimilar": return rateSimilarity(guess.item, question);
			case "correct":         return 1;
			default:                return 1; // onyomikunyomi etc.
		}
	}

	function getItem(characters, preferred = ["kanji", "vocabulary", "radical"]) {
		return (byCharacters[characters] || []).reduce((result, item) => result ? (preferred.indexOf(item.object) < preferred.indexOf(result.object) ? item : result) : item, undefined);
	}

	function ensureArray(listOrEntry) {
		return Array.isArray(listOrEntry) ? listOrEntry : (listOrEntry === undefined ? [] : [listOrEntry]);
	}

	function searchByReading(reading) {
		return byReading[reading] || [];
	}

	function searchByMeaning(meaning) {
		return byMeaning.get(meaning);
	}

	function possibleSplits(reading, partCount) {
		if (partCount === 1) return [[reading]];

		let result = Array.from({length: reading.length - partCount + 1}, (val, idx) => ({start: reading.substr(0, idx + 1), end: reading.substr(idx + 1)}));
		result = result.flatMap(r => possibleSplits(r.end, partCount - 1).map(s => [r.start].concat(s)));
		result = result.filter(r => r.every(part => !"ぁぃぅぇぉっゃゅょゎん".includes(part[0])));
		return result;
	}

	function validReading(kanji, reading) {
		let item = getItem(kanji);
		return item.data.readings.reduce((type, r) => type || (r.reading === reading || applyRendaku1(r.reading) === reading || applyRendaku2(r.reading) === reading || applyGemination(r.reading) === reading ? r.type : undefined), undefined);
	}

	function applyRendaku1(reading) {
		let idx = "かきくけこさしすせそたちつてとはひふへほ".indexOf(reading[0]);
		return idx >= 0 ? "がぎぐげござじずぜぞだぢづでどばびぶべぼ"[idx] + reading.substr(1) : undefined;
	}

	function applyRendaku2(reading) {
		let idx = "はひふへほち".indexOf(reading[0]);
		return idx >= 0 ? "ぱぴぷぺぽじ"[idx] + reading.substr(1) : undefined;
	}

	function applyGemination(reading) {
		// definitely not based on any grammar rules, but it works good enough for WK vocab
		let replacementGemination = "ちつくき".includes(reading.substr(-1));
		return replacementGemination ? reading.substr(0, reading.length - 1) + "っ" : reading + "っ";
	}

	function removeRendaku1(reading) {
		let idx = "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ".indexOf(reading[0]);
		return idx >= 0 ? "かきくけこさしすせそたちつてとはひふへほはひふへほ"[idx] + reading.substr(1) : undefined;
	}

	function removeRendaku2(reading) {
		return reading[0] === "じ" ? "ち" + reading.substr(1) : undefined;
	}

	function removeGemination1(reading) {
		return reading.substr(-1) === "っ" ? reading.substr(0, reading.length - 1) : undefined;
	}

	function removeGemination2(reading) {
		return reading.substr(-1) === "っ" ? reading.substr(0, reading.length - 1) + "ち" : undefined;
	}

	function removeGemination3(reading) {
		return reading.substr(-1) === "っ" ? reading.substr(0, reading.length - 1) + "つ" : undefined;
	}

	function removeGemination4(reading) {
		return reading.substr(-1) === "っ" ? reading.substr(0, reading.length - 1) + "く" : undefined;
	}

	// where is removeGemination5() with き? I don't know. I'm also dumbfounded.
	// (dumbfounded 呆気 seems to be the only WK vocab which turns き into っ, so whatever)

	// ---IDEOGRAPHIC DESCRIPTION SEQUENCE STUFF--- //

	// turns IDS into tree structure
	function getKanjiComponents(kanji) {
		let line = idsHash[kanji];
		if (!line) return [kanji];
		// get all decomposition variations that apply to the Japanese character appearance (I think that's what [J] in ids.txt means)
		let variations = line.split("\t").filter(v => !v.match(/\[[^J\]]+\]/));
		if (variations.length === 0) variations = [line.split("\t")[0]]; // fix for lines such as "U+225BB	𢖻	⿱心夂[G]	⿱心夊[T]" - TODO: research what the letters in [] mean
		return variations.map(v => v === kanji ? (idsEqualities[v] || v) : parseIds(v[Symbol.iterator]()));
	}

	function parseIds(iter) {
		let idc = iter.next().value;
		if (!"⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻".includes(idc)) return getKanjiComponents(idc)[0];
		let node = {idc, parts: []};
		node.parts[0] = parseIds(iter);
		node.parts[1] = parseIds(iter);
		if (!"⿲⿳".includes(idc)) return node;
		node.parts[2] = parseIds(iter);
		return node;
	}

	// turns tree structure to path list
	function componentTreeToPathList(components) {
		return components.parts ? components.parts.flatMap((part, partIdx) => componentTreeToPathList(part).map(path => components.idc + partIdx + path)) : [components];
	}

	function ratePathSimilarity(path1, path2) {
		let array1 = path1.match(/[⿰-⿻][0-9]/g) || [];
		let array2 = path2.match(/[⿰-⿻][0-9]/g) || [];
		if (array1.length === 0 && array2.length === 0) return 1;
		let dist = levenshteinDistance(array1, array2, (node1, node2) => node1[0] !== node2[0] ? 1 : (node1[1] === node2[1] ? 0 : 0.5));
		// both paths lead to the same component, therefore they are always a little similar => array.length + 1
		return (1 - dist / (Math.max(array1.length, array2.length) + 1)) / array1.reduce((total, a) => total * ("⿲⿳".includes(a[0]) ? 3 : 2), 1);
	}

	function rateComponentSimilarity(components1, components2) {
		let pathList1 = componentTreeToPathList(components1);
		let pathList2 = componentTreeToPathList(components2);
		let paths1 = {};
		let paths2 = {};
		// using Array.from(p).slice(-1) instead of e.g. p.substr(-1) to maintain surrogate pairs
		pathList1.forEach(p => {let char = Array.from(p).slice(-1)[0]; paths1[char] = (paths1[char] || []).concat([p])});
		pathList2.forEach(p => {let char = Array.from(p).slice(-1)[0]; paths2[char] = (paths2[char] || []).concat([p])});
		let similarity = pathList1.reduce((total, p1) => total + (paths2[Array.from(p1).slice(-1)] || []).reduce((best, p2) => Math.max(best, ratePathSimilarity(p1, p2)), 0), 0);
		similarity    += pathList2.reduce((total, p2) => total + (paths1[Array.from(p2).slice(-1)] || []).reduce((best, p1) => Math.max(best, ratePathSimilarity(p2, p1)), 0), 0);
		return similarity / 2;
	}

	function rateKanjiSimilarityUsingIds(kanji1, kanji2) {
		let components1 = getKanjiComponents(kanji1);
		let components2 = getKanjiComponents(kanji2);
		// choose the pair with the best similarity rating
		return components1.flatMap(c1 => components2.map(c2 => [c1, c2])).reduce((best, pair) => Math.max(best, rateComponentSimilarity(pair[0], pair[1])), 0);
	}

	function rateSimilarity(itemOrText1, itemOrText2) {
		if (itemOrText1 === itemOrText2) return 1;
		let text1 = typeof itemOrText1 === "string" ? itemOrText1 : (itemOrText1.data.characters || radicalIdToChar[itemOrText1.id]);
		let text2 = typeof itemOrText2 === "string" ? itemOrText2 : (itemOrText2.data.characters || radicalIdToChar[itemOrText2.id]);
		if (!text1 || !text2) return 0;
		let cacheId1 = text1 + "§" + text2;
		let cacheId2 = text2 + "§" + text1;
		if (similarityCache[cacheId1]) return similarityCache[cacheId1];
		if (similarityCache[cacheId2]) return similarityCache[cacheId2];
		let chars1 = Array.from(text1);
		let chars2 = Array.from(text2);

		if (chars1.length > 1 || chars2.length > 1) {
			let dist = levenshteinDistance(chars1, chars2, (char1, char2) => 1 - rateSimilarity(char1, char2));
			// normalize distance to [0;1] and invert it so that 0 is complete mismatch
			return (similarityCache[cacheId1] = 1 - dist / Math.max(chars1.length, chars2.length));
		}

		let item1 = typeof itemOrText1 === "string" ? getItem(itemOrText1) : itemOrText1;
		let item2 = typeof itemOrText2 === "string" ? getItem(itemOrText2) : itemOrText2;

		let similarity = item1 && item2 ? MIN_KANJI_SIMILARITY : 0;
		if (wkof.settings.confusionguesser.useWkRadicals && item1 && item2) {
			let radicals1 = item1.data.component_subject_ids || [item1.id];
			let radicals2 = item2.data.component_subject_ids || [item2.id];
			let matchCount = radicals1.reduce((matchCount, radicalId) => matchCount + (radicals2.includes(radicalId) ? 1 : 0), 0);
			similarity = Math.max(2 * matchCount / (radicals1.length + radicals2.length), similarity);
		}
		if (wkof.settings.confusionguesser.useWkSimilarity && item1 && item2) {
			if ((item1.data.visually_similar_subject_ids || []).includes(item2.id) || (item2.data.visually_similar_subject_ids || []).includes(item1.id)) similarity = Math.max(similarity, 0.5);
		}
		if (wkof.settings.confusionguesser.useIds) {
			similarity = Math.max(similarity, rateKanjiSimilarityUsingIds(text1, text2));
		}
		return (similarityCache[cacheId1] = similarity);
	}

	// levenshtein distance with restricted transposition of two adjacent characters (so in fact it's not levenshtein distance but optimal string alignment distance)
	function levenshteinDistance(array1, array2, elementDistanceFunction = (e1, e2) => e1 === e2 ? 0 : 1) {
		// initialize distance matrix
		let d = [];
		for (let i = 0; i <= array1.length; i++) d[i] = [i];
		for (let j = 0; j <= array2.length; j++) d[0][j] = j;
		// fill distance matrix from top left to bottom right
		for (let i = 1; i <= array1.length; i++) for (let j = 1; j <= array2.length; j++) {
			d[i][j] = Math.min(d[i - 1][j] + 1,
			                   d[i][j - 1] + 1,
			                   d[i - 1][j - 1] + elementDistanceFunction(array1[i - 1], array2[j - 1]),
			                   i > 1 && j > 1 ? d[i - 2][j - 2] + LEVENSHTEIN_TRANSPOSITION_COST + elementDistanceFunction(array1[i - 2], array2[j - 1]) + elementDistanceFunction(array1[i - 1], array2[j - 2]) : Number.MAX_SAFE_INTEGER);
		}
		// result is in the bottom right of the matrix
		return d[array1.length][array2.length];
	}

	// ---DECIMAL TO JAPANESE STUFF--- //

	function replaceDecimalWithJapanese(text) {
		let parts = text.split(/([０１２３４５６７８９]+)/g);
		return parts.map((p, i) => i & 1 ? decimalToJapanese(p) : p).join("");
	}

	function decimalToJapanese(decimal, zero = "零") {
		let groups = Array.from(decimal).reverse().reduce((result, digit, idx) => {result[Math.floor(idx / 4)] = (result[Math.floor(idx / 4)] || []).concat([digit]); return result;}, []);
		let japanese = groups.reduce((result, group, i) => { group = decimalToJapanese_4block(group); return !group ? result : (group + " 万億兆"[i] + result); }, "").replace(" ", "");
		return japanese || zero;
	}

	function decimalToJapanese_4block(array) {
		return array.reduce((result, digit, i) => { digit = decimalToJapanese_digit(digit); return !digit ? result : ((i > 0 && digit === "一" ? "" : digit) + " 十百千"[i] + result); }, "").replace(" ", "");
	}

	function decimalToJapanese_digit(digit) {
		return " 一二三四五六七八九"["０１２３４５６７８９".indexOf(digit)].replace(" ", "");
	}

	async function loadIdsHash() {
		if (wkof.file_cache.dir.ideographicDescriptionSequences) return wkof.file_cache.load("ideographicDescriptionSequences");

		let result = {};
		let idsFile = await wkof.load_file("https://raw.githubusercontent.com/cjkvi/cjkvi-ids/master/ids.txt");
		let lines = idsFile.matchAll(/U\+\S+\t(\S+)\t(.+)/g);
		for (let line of lines) {
			result[line[1]] = line[2];
		}
		wkof.file_cache.save("ideographicDescriptionSequences", result);
		return result;
	}

	// ---FUZZY SEARCH STUFF (N-GRAM)--- //

	function histogram(array) {
		return [...array.reduce((result, element) => result.set(element, (result.get(element) || 0) + 1), new Map())];
	}

	function highestBins(histogram, nrOfBins, minBinHeight) {
		return histogram.sort((a, b) => b[1] - a[1]).filter((h, idx) => idx < nrOfBins && h[1] >= minBinHeight);
	}

	function hashGrams(wkItems, gramSizes = [4, 3]) {
		let result = {};
		wkItems.forEach(item => meaningsOfItem(item).forEach((m, mNr) => {let entry = {item, mNr}; toGrams(m, gramSizes).flat().forEach(g => {result[g] = (result[g] || []).concat(entry)})}));
		result.get = (text, gramSizes = [4, 3]) => gramSizes.reduce((prevResult, size) => prevResult.length > 0 ? prevResult : highestBins(histogram(toGrams(text, [size])[0].flatMap(gram => result[gram] || [])), 10, text.length / 2).map(h => h[0].item), []);
		return result;
	}

	function toGrams(text, gramSizes = [4, 3]) {
		text = "§" + text.toLowerCase() + "§";
		return gramSizes.map(size => Array.from(new Array(Math.max(0, text.length - size + 1)), (val, idx) => text.substr(idx, size)));
	}

	function meaningsOfItem(item) {
		let meanings = jokeMeaningFilter[item.id] ? item.data.meanings.filter(m => !jokeMeaningFilter[item.id].includes(m.meaning)) : item.data.meanings;
		return meanings.concat(wkof.settings.confusionguesser.includeWhitelist ? item.data.auxiliary_meanings.filter(m => m.type === "whitelist") : []).map(m => m.meaning).concat(wkof.settings.confusionguesser.includeUserSynonyms && item.study_materials ? item.study_materials.meaning_synonyms : []);
	}

	// ---DOM STUFF--- //

	function addShowMoreOption(div) {
		iShowLess = document.createElement("input");
		let lShowMore = document.createElement("label");
		let lShowLess = document.createElement("label");
		iShowLess.id = "showLess";
		iShowLess.type = "checkbox";
		iShowLess.checked = !wkof.settings.confusionguesser.showAllByDefault;
		lShowMore.htmlFor = "showLess";
		lShowLess.htmlFor = "showLess";
		lShowMore.textContent = "+";
		lShowLess.textContent = "-";
		div.appendChild(lShowMore);
		div.appendChild(iShowLess);
		div.appendChild(lShowLess);
	}

	function guessToDiv(guess) {
		let a = document.createElement("a");
		let sJapanese = document.createElement("span");
		let sEnglish = document.createElement("span");
		let sProbability = document.createElement("span");
		let rJapanese = document.createElement("ruby");
		a.href = guess.item.data.document_url;
		a.target = "_blank";
		a.title = typeDescription[guess.type];
		a.classList.add(guess.type);
		a.classList.add(guess.item.object);
		if (guess.show) a.classList.add("show");
		rJapanese.lang = "ja-JP";
		rJapanese.textContent = guess.item.data.characters || "";
		sEnglish.textContent = guess.meaning || guess.item.data.meanings[0].meaning;
		sProbability.textContent = guess.probability.toFixed(2);

		if (!guess.item.data.characters) {
			appendSvgChild(guess.item.data.character_images, rJapanese);
		}
		if (guess.item.data.readings) {
			let rFurigana = document.createElement("rt");
			rFurigana.textContent = guess.reading || guess.item.data.readings[0].reading;
			rJapanese.appendChild(rFurigana);
		}

		sJapanese.appendChild(rJapanese);
		a.appendChild(sJapanese);
		a.appendChild(sEnglish);
		a.appendChild(sProbability);
		return a;
	}

	async function appendSvgChild(character_images, element) {
		try {
			element.innerHTML += `<wk-character-image src="${character_images.find(c => c.content_type === "image/svg+xml" && c.metadata.inline_styles).url}" />`;
		} catch(e) {
			let iSvg = document.createElement("img");
			iSvg.src = character_images.find(c => c.content_type === "image/svg+xml" && c.metadata.inline_styles).url;
			element.appendChild(iSvg);
		}
	}

	function spoilerButton(guess) {
		let b = document.createElement("button");
		b.textContent = "Show spoiler";
		if (guess.show) b.classList.add("show");
		b.addEventListener("click", (e) => e.target.parentElement.removeChild(e.target));
		return b;
	}

	function isSpoiler(guess) {
		if (wkof.settings.confusionguesser.spoilerHandling === "none" || !guess.item.assignments || !guess.item.assignments.available_at) return false;
		let nextReview = new Date(guess.item.assignments.available_at);
		let remainingTimeInMs = nextReview - new Date();
		let stage = srs[guess.item.data.spaced_repetition_system_id].data.stages[guess.item.assignments.srs_stage];
		if (!stage) return false; // should not happen
		return remainingTimeInMs < srsStageIntervalInMs(stage) * parseInt(wkof.settings.confusionguesser.spoilerHandling) / 100;
	}

	function srsStageIntervalInMs(stage) {
		let result = stage.interval;
		if (stage.interval_unit === "milliseconds") return result; result *= 1000;
		if (stage.interval_unit ===      "seconds") return result; result *= 60;
		if (stage.interval_unit ===      "minutes") return result; result *= 60;
		if (stage.interval_unit ===        "hours") return result; result *= 24;
		if (stage.interval_unit ===         "days") return result; result *= 7;
		if (stage.interval_unit ===        "weeks") return result;
		return null;
	}

	function fromButtonColor() {
		let button = document.querySelector("#option-kana-chart > span > i");
		let textColor = button ? getComputedStyle(button).color : "rgb(0, 0, 0)";
		let color = "rgb(255, 255, 255)";
		while (button && getComputedStyle(button).backgroundColor.match(/rgba\(.*0\)/)) button = button.parentElement;
		color = rbgToHex(button ? getComputedStyle(button).backgroundColor : color);
		let result = Object.assign({}, defaultColors);
		Object.keys(result).forEach(k => (result[k] = color));
		result.textColor = rbgToHex(textColor);
		return result;
	}

	function rbgToHex(rgbString) {
		let rgb = rgbString.match(/\( *([^,]*), *([^,]*), *([^,\)]*)/);
		return rgb.slice(1, 4).reduce((result, c) => result + parseInt(c).toString(16).padStart(2, "0"), "#");
	}

	// ---SETTINGS STUFF--- //

	function prepareDialog(dialog) {
		let iThreshold = document.getElementById("confusionguesser_showThreshold");
		iThreshold.min = 0;
		iThreshold.max = 1;
		iThreshold.step = 0.01;
		iThreshold.addEventListener("input", thresholdChange);
		let showX = wkof.settings.confusionguesser.correctAction === "showThreshold" || wkof.settings.confusionguesser.incorrectAction === "showThreshold";
		let lThreshold = document.createElement("label");
		lThreshold.for = "confusionguesser_showThreshold";
		lThreshold.textContent = parseFloat(wkof.settings.confusionguesser.showThreshold).toFixed(2);
		iThreshold.insertAdjacentElement("afterend", lThreshold);
		iThreshold.parentElement.parentElement.classList.toggle("hidden", !showX);
	}

	function actionChange() {
		let showX = false;
		showX = showX || document.getElementById("confusionguesser_correctAction"  ).value === "Minimized if all ratings < X";
		showX = showX || document.getElementById("confusionguesser_incorrectAction").value === "Minimized if all ratings < X";
		document.getElementById("confusionguesser_showThreshold").parentElement.parentElement.classList.toggle("hidden", !showX);
	}

	function thresholdChange() {
		let iThreshold = document.getElementById("confusionguesser_showThreshold");
		iThreshold.nextElementSibling.textContent = parseFloat(iThreshold.value).toFixed(2);
	}

	async function settingsChanged(settings) {
		// find changed settings
		let changes = Object.keys(settings).filter(key => oldSettings[key] !== settings[key]);
		let refetchItems = false;

		changes.forEach(key => {
			switch(key) {
				case "useIds":
					idsHash = settings.useIds ? loadIdsHash() : {};
					if (!settings.useIds) wkof.file_cache.delete("ideographicDescriptionSequences");
					return;
				case "spoilerHandling":
					if (oldSettings.guessOnlyLearnedItems || oldSettings.spoilerHandling !== "none") return; // else fallthrough
				case "guessOnlyLearnedItems":
				case "useFuzzySearch":
				case "includeWhitelist":
				case "includeUserSynonyms":
					refetchItems = true;
					return;
				case "showAsOverlay":
					dOverlay.classList.toggle("noOverlay", !settings.showAsOverlay);
					return;
				case "showTypes":
					dOverlay.classList.toggle("hideTypes", !settings.showTypes);
					return;
				case "showRatings":
					dOverlay.classList.toggle("hideRatings", !settings.showRatings);
					return;
				case "highContrast":
					dCollapsible.classList.toggle("highContrast", settings.highContrast);
					return;
				case "fontSize":
					dOverlay.style.setProperty("font-size", settings[key]);
					return;
				case "hotkeyExpand":
					hotkeyEntry.classList.toggle("disabled", settings.hotkeyExpand === "");
					hotkeyKey.textContent = settings.hotkeyExpand.toUpperCase();
					return;
				default:
					if (key.endsWith("Color")) dOverlay.style.setProperty("--" + key.substr(0, key.length - 5), settings[key]);
					return;
			}
		});

		if (refetchItems) {
			let config = {wk_items: {options: {study_materials: settings.includeUserSynonyms, assignments: settings.spoilerHandling !== "none"}}};
			if (settings.guessOnlyLearnedItems) config.wk_items.filters = {srs: {value: ["lock", "init"], invert: true}};
			let items = await wkof.ItemData.get_items(config);
			byId = wkof.ItemData.get_index(items, "subject_id");
			byReading = wkof.ItemData.get_index(items, "reading");
			byCharacters = items.reduce((result, i) => { result[i.data.characters] = (result[i.data.characters] || []).concat([i]); return result; }, {});
			byMeaning = settings.useFuzzySearch ? hashGrams(items) : {get: text => {text = text.toLowerCase(); let result = items.filter(item => meaningsOfItem(item).some(m => m.toLowerCase().startsWith(text))); if (result.length > 16) result = items.filter(item => meaningsOfItem(item).some(m => m.toLowerCase() === text)); return result;}};
		}

		// SRS stage durations are needed if spoiler handling is activated
		if (settings.spoilerHandling !== "none" && srs.length === 0) {
			if (!wkof.file_cache.dir["Apiv2.spaced_repetition_systems"] || new Date() - new Date(wkof.file_cache.dir["Apiv2.spaced_repetition_systems"].added) > 604800000) {
				srs = await wkof.Apiv2.get_endpoint("spaced_repetition_systems");
			} else {
				srs = (await wkof.file_cache.load("Apiv2.spaced_repetition_systems")).data;
			}
		}

		Object.assign(oldSettings, settings);
	}

	function setupMenu() {
		wkof.Menu.insert_script_link({name: "confusionguesser", submenu: "Settings", title: "ConfusionGuesser", on_click: openSettings});

		oldSettings = {};
		let defaults = {
			guessOnlyLearnedItems: true,
			spoilerHandling: "none",
			includeWhitelist: false,
			includeUserSynonyms: false,
			useFuzzySearch: true,
			useWkRadicals: true,
			useWkSimilarity: true,
			useIds: false,
			showAsOverlay: true,
			showAllByDefault: false,
			showTypes: true,
			showRatings: false,
			highContrast: false,
			fontSize: "1.12rem",
			correctAction: "arrow",
			incorrectAction: "show",
			showThreshold: "0.3",
			hotkeyExpand: "w"
		}
		Object.assign(defaults, defaultColors);
		return wkof.Settings.load("confusionguesser", defaults).then(settingsChanged);
	}

	function openSettings() {
		let fontSizeOptions = {};
		fontSizeOptions["0.8rem"] = "Small";
		fontSizeOptions["1.12rem"] = "Medium";
		fontSizeOptions["1.5rem"] = "Large";
		fontSizeOptions["2rem"] = "Probably too large";
		fontSizeOptions["3rem"] = "Certainly too large";
		let spoilerHandlingOptions = {};
		spoilerHandlingOptions["none"] = "Never";
		spoilerHandlingOptions["0"] = "If in this batch";
		spoilerHandlingOptions["10"] = "If sooner than 10% of the SRS interval";
		spoilerHandlingOptions["20"] = "If sooner than 20% of the SRS interval";
		spoilerHandlingOptions["30"] = "If sooner than 30% of the SRS interval";
		spoilerHandlingOptions["50"] = "If sooner than 50% of the SRS interval";
		spoilerHandlingOptions["75"] = "If sooner than 75% of the SRS interval";
		let actionOptions = {};
		actionOptions["hide"] = "Show nothing";
		actionOptions["arrow"] = "Minimized ‒ show arrow";
		actionOptions["showThreshold"] = "Minimized if all ratings < X";
		actionOptions["show"] = "Show list";
		let dialog = new wkof.Settings({
			script_id: "confusionguesser",
			title: "ConfusionGuesser Settings",
			pre_open: prepareDialog,
			on_save: settingsChanged,
			content: {
				tabFunctionality:            {type: "page",     label: "Functionality",                content: {
					guessOnlyLearnedItems:   {type: "checkbox", label: "Guess only learned items",     hover_tip: "When enabled, the guess list will only contain items that you have already learned on WaniKani."},
					spoilerHandling:         {type: "dropdown", label: "Hide spoiler guesses",         hover_tip: "Select if guesses for WK items that will soon come up for review should be hidden.", content: spoilerHandlingOptions},
					grpMeaningGuesses:       {type: "group",    label: "Meaning guesses",              content: {
						useFuzzySearch:      {type: "checkbox", label: "Use fuzzy search",             hover_tip: "When enabled, guesses for a wrong meaning also contain non-exact matches. Might increase loading time of the review page."},
						includeWhitelist:    {type: "checkbox", label: "Include hidden whitelist",     hover_tip: "When enabled, guesses for a wrong meaning also consider the hidden whitelist (for example 'boob grave')."},
						includeUserSynonyms: {type: "checkbox", label: "Include user synonyms",        hover_tip: "When enabled, guesses for a wrong meaning also consider your entered synonyms."},
					}},
					grpSimilarityRating:     {type: "group",    label: "Kanji similarity rating",      content: {
						useWkRadicals:       {type: "checkbox", label: "Use WK radicals",              hover_tip: "With this, kanji are considered similar if they share some WK radicals."},
						useWkSimilarity:     {type: "checkbox", label: "Use WK visually similar list", hover_tip: "With this, kanji are considered similar if WK has them listed as visually similar."},
						useIds:              {type: "checkbox", label: "Use IDS",                      hover_tip: "When enabled, a 2MB text file with ideographic description sequences will be downloaded and stored locally to improve kanji similarity ratings."}
					}}
				}},
				tabInterface:                {type: "page",     label: "Interface",                    content: {
					showAsOverlay:           {type: "checkbox", label: "Show as overlay",              hover_tip: "Display the guess list as an overlay to the right of the question or at the bottom of the page. On narrow displays, the list is always at the bottom."},
					showAllByDefault:        {type: "checkbox", label: "Show all guesses by default",  hover_tip: "When enabled, the guess list will be expanded by default."},
					showTypes:               {type: "checkbox", label: "Show guess types",             hover_tip: "Show 丸⬄九 for guesses based on visual similarity, on⬄kun if you used on'yomi but needed kun'yomi, etc."},
					showRatings:             {type: "checkbox", label: "Show ratings",                 hover_tip: "When enabled, a number between 0 and 1 to the right of each guess shows the rating of that guess."},
					highContrast:            {type: "checkbox", label: "High contrast mode",           hover_tip: "When enabled, the overlay will have a dark background. Always active if the guesses are displayed at the bottom of the page."},
					fontSize:                {type: "dropdown", label: "Font size",                    hover_tip: "Select the font size for the guesses.", content: fontSizeOptions},
					correctAction:           {type: "dropdown", label: "When answer correct",          hover_tip: "Specify if the list of guesses should be displayed after a correct answer. The hotkey will open the list regardless of this setting.", content: actionOptions, on_change: actionChange},
					incorrectAction:         {type: "dropdown", label: "When answer incorrect",        hover_tip: "Specify if the list of guesses should be displayed after a wrong answer. The hotkey will open the list regardless of this setting.", content: actionOptions, on_change: actionChange},
					showThreshold:           {type: "input",    label: "X (rating threshold)",         hover_tip: "If all guesses have a rating below this threshold, do not show the list.", subtype: "range"},
					hotkeyExpand:            {type: "text",     label: "Hotkey expand guesses",        hover_tip: "Choose a hotkey to expand/collapse the list of guesses.", match: /^.?$/}
				}},
				tabGuessColors:              {type: "page",     label: "Guess colors",                 content: {
					vissimColor:             {type: "color",    label: "丸⬄九",                        hover_tip: typeDescription.visuallySimilar},
					ononColor:               {type: "color",    label: "on⬄on",                       hover_tip: typeDescription.onyomionyomi},
					onkunColor:              {type: "color",    label: "on⬄kun",                      hover_tip: typeDescription.onyomikunyomi},
					kunonColor:              {type: "color",    label: "kun⬄on",                      hover_tip: typeDescription.kunyomionyomi},
					kunkunColor:             {type: "color",    label: "kun⬄kun",                     hover_tip: typeDescription.kunyomikunyomi},
					naonColor:               {type: "color",    label: "na⬄on",                       hover_tip: typeDescription.nanorionyomi},
					nakunColor:              {type: "color",    label: "na⬄kun",                      hover_tip: typeDescription.nanorikunyomi},
					onnaColor:               {type: "color",    label: "on⬄na",                       hover_tip: typeDescription.onyominanori},
					kunnaColor:              {type: "color",    label: "kun⬄na",                      hover_tip: typeDescription.kunyominanori},
					nanaColor:               {type: "color",    label: "na⬄na",                       hover_tip: typeDescription.nanorinanori},
					specialColor:            {type: "color",    label: "Special",                      hover_tip: "Reading exception / WK does not list this reading"},
					textColor:               {type: "color",    label: "Text",                         hover_tip: "Text color"},
					resetColor:              {type: "button",   label: "Reset colors to default", text: "Reset", on_click: (name, config, on_change) => {Object.assign(wkof.settings.confusionguesser, defaultColors); dialog.refresh();}},
					buttonColor:             {type: "button",   label: "From button color", text: "Load", on_click: (name, config, on_change) => {Object.assign(wkof.settings.confusionguesser, fromButtonColor()); dialog.refresh();}, hover_tip: "Use the colors of the buttons below the input box. Useful for dark mode users."}
				}}
			}
		});
		dialog.open();
		document.getElementById("confusionguesser_hotkeyExpand").addEventListener("keydown", e => { if (e.key === "Backspace") e.stopPropagation(); });
	}

	function installCss() {
		if (document.getElementById("confusion-guesser-css")) return;

		let css = "#confusionGuesserOverlay { position: absolute; top: 3rem; right: 0; padding-top: 0.6rem; z-index: 100; overflow-x: hidden; pointer-events: none; min-height: 15rem; min-width: 2em; }" +
			"#confusionGuesserOverlay.noOverlay { position: relative; top: 0; margin-top: 3rem; min-height: initial; }" +
			"#confusionGuesserOverlay > div { border-style: solid none; border-width: medium; background: linear-gradient(to left, rgba(0,0,0,0.2), transparent 50%, transparent); border-image: linear-gradient(to left, rgba(255,255,255,0.8), transparent 65%, transparent) 1; transition: transform 0.2s; pointer-events: initial; }" +
			"#confusionGuesserOverlay > div.highContrast, #confusionGuesserOverlay.noOverlay > div { background-color: rgba(0, 0, 0, 0.4); padding-left: 0.7rem; }" +
			"#confusionGuesserOverlay > div.collapsed { transform: translateX(100%); }" +
			"#guesses { margin: 0.6rem 0; padding: 0 60px 0.6rem 0; max-height: 8rem; overflow-x: hidden; overflow-y: auto; display: grid; grid-template-columns: auto auto 1fr auto; grid-row-gap: 0.2rem; }" +
			"#confusionGuesserOverlay.noOverlay #guesses { max-height: initial; overflow-y: auto; }" +
			"#confusionGuesserOverlay.hideRatings #guesses > a > *:last-child { display: none; }" +
			"#confusionGuesserOverlay.hideTypes #guesses > a::before { display: none; }" +
			"#confusionGuesserOverlay.hideTypes #guesses > a > *:first-child { border-radius: 0.5rem 0 0 0.5rem; }" +
			"#guesses > a { display: contents; color: var(--text); text-decoration: none; --type: '?' }" +
			"#guesses > a.onyomionyomi     { --gc: var(--onon); --type: 'on⬄on' }" +
			"#guesses > a.onyomikunyomi    { --gc: var(--onkun); --type: 'on⬄kun' }" +
			"#guesses > a.kunyomionyomi    { --gc: var(--kunon); --type: 'kun⬄on' }" +
			"#guesses > a.kunyomikunyomi   { --gc: var(--kunkun); --type: 'kun⬄kun' }" +
			"#guesses > a.nanorionyomi     { --gc: var(--naon); --type: 'na⬄on' }" +
			"#guesses > a.nanorikunyomi    { --gc: var(--nakun); --type: 'na⬄kun' }" +
			"#guesses > a.onyominanori     { --gc: var(--onna); --type: 'on⬄na' }" +
			"#guesses > a.kunyominanori    { --gc: var(--kunna); --type: 'kun⬄na' }" +
			"#guesses > a.nanorinanori     { --gc: var(--nana); --type: 'na⬄na' }" +
			"#guesses > a.onyomiundefined  { --gc: var(--special); --type: 'on⬄special' }" +
			"#guesses > a.kunyomiundefined { --gc: var(--special); --type: 'kun⬄special' }" +
			"#guesses > a.nanoriundefined  { --gc: var(--special); --type: 'na⬄special' }" +
			"#guesses > a.visuallySimilar  { --gc: var(--vissim); --type: '丸⬄九' }" +
			"#guesses > a.radical          { --ic: var(--color-radical, #00AAFF); }" +
			"#guesses > a.kanji            { --ic: var(--color-kanji, #FF00AA); }" +
			"#guesses > a.vocabulary       { --ic: var(--color-vocabulary, #AA00FF); }" +
			"#guesses > a > *, #guesses > a::before { display: flex; align-items: center; padding: 0.2rem 0.5rem; }" +
			"#guesses > a > *:first-child { display: initial; grid-column: 2; }" +
			"#guesses > a::before { content: var(--type); border-radius: 0.5rem 0 0 0.5rem; color: rgba(255, 255, 255, 0.3); grid-column: 1; }" +
			"#guesses > a > *:last-child, #confusionGuesserOverlay.hideRatings #guesses > a > *:nth-last-child(2) { border-radius: 0 0.5rem 0.5rem 0; justify-content: flex-end; border-right: solid var(--ic); }" +
			"#guesses wk-character-image, #guesses ruby img { display: inline-block; --color-text: currentColor; width: 1em; transform: translateY(0.15em); }" +
			"#guesses > a.show wk-character-image, #guesses > a.show ruby img { filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.4)); }" +
			"#guesses > a.show > *, #guesses > a.show::before, #guesses > button.show { font-size: 1.35em; text-shadow: 2px 2px 3px rgba(0,0,0,0.4); background-color: var(--gc); box-shadow: 0.5rem 0.2rem 0.2rem #0000002b; }" +
			"#guesses > button { grid-column: 1 / -1; padding: 0.5rem; color: rgba(255, 255, 255, 0.3); background: none; border: thin dashed rgba(255, 255, 255, 0.3); border-radius: 0.5rem; --gc: var(--vissim); cursor: pointer; }" +
			"#guesses > button.show { border: none; }" +
			"#guesses > button + a { display: none; }" +
			"#confusionGuesserOverlay > div > input { display: none; }" +
			"#confusionGuesserOverlay > div > label { position: absolute; top: 0; right: 25px; background-color: var(--color-wk-panel-content-background, white); width: 1.4rem; line-height: 1.4rem; text-align: center; border-radius: 0.3rem; font-weight: bold; cursor: pointer; font-size: large; }" +
			"#confusionGuesserOverlay.noOverlay > div > label { border: solid thin rgba(0, 0, 0, 0.4); }" +
			"#confusionGuesserOverlay > div > :checked + label { display: none }" +
			"#confusionGuesserOverlay > div > :checked ~ #guesses > a:not(.show) > *, :checked ~ #guesses > a:not(.show)::before, #confusionGuesserOverlay > div > :checked ~ #guesses > button:not(.show) { display: none; }" +
			"#confusionGuesserOverlay > button { position: absolute; right: 0; top: 2rem; width: 20px; height: 8rem; background: linear-gradient(to left, rgba(0,0,0,0.2), transparent); border: none; color: var(--text); pointer-events: initial; cursor: pointer; overflow: hidden; }" +
			"#confusionGuesserOverlay > button::before { content: ''; position: absolute; right: 6px; width: 0; height: 0; border: 8px solid transparent; border-right-color: var(--text); }" +
			"#confusionGuesserOverlay.noOverlay > div.collapsed { display: none; }" +
			"#confusionGuesserOverlay.noOverlay > button { position: relative; top: 0; width: 100%; height: 20px; background: none; }" +
			"#confusionGuesserOverlay.noOverlay > button::before { top: 7px; right: initial; border-right-color: transparent; border-top-color: var(--color-button-frameless-text, #999); }" +
			"#hotkeys tr.disabled { display: none; }" +
			"#confusionguesser_showThreshold#confusionguesser_showThreshold { width: calc(100% - 3em); }" +                                                  // double id selector for higher specificity
			"#confusionguesser_showThreshold#confusionguesser_showThreshold + label { width: 3em; line-height: 2em; float: right; text-align: right; }" +    // to win against default styling
			"#wkofs_confusionguesser .hidden { display: none; }" +
			"@media (max-width: 767px) {" +
			" #confusionGuesserOverlay { position: relative; top: 0; margin-top: 3rem; min-height: initial; }" +
			" #confusionGuesserOverlay > div { background-color: rgba(0, 0, 0, 0.4); padding-left: 0.7rem; }" +
			" #confusionGuesserOverlay #guesses { max-height: initial; overflow-y: auto; }" +
			" #confusionGuesserOverlay > div > label { border: solid thin rgba(0, 0, 0, 0.4); }" +
			" #confusionGuesserOverlay > div.collapsed { display: none; }" +
			" #confusionGuesserOverlay > button { position: relative; top: 0; width: 100%; height: 20px; background: none; }" +
			" #confusionGuesserOverlay > button::before { top: 7px; right: initial; border-right-color: transparent; border-top-color: var(--color-button-frameless-text, #999); }" +
			"}" +
			// firefox workaround (otherwise shrinks grid width when scrollbar appears, leading to line breaks in the cells)
			"@-moz-document url-prefix() { #guesses { overflow-y: scroll; } }";
		let sCss = document.createElement("style");
		let tCss = document.createTextNode(css);
		sCss.id = "confusion-guesser-css";
		sCss.appendChild(tCss);
		document.head.appendChild(sCss);
	}
})();
