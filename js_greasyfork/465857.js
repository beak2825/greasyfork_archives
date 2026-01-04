// ==UserScript==
// @name         Wanikani Vertical Review Progress Bar (Levels)
// @namespace    Wanikani Vertical Review Progress Bar (Levels)
// @version      1.3
// @description  bar
// @author       KT313 (Base code ConfusionGuesser by Sinyaven)
// @license      idk
// @match        https://www.wanikani.com/subjects/review
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1181453
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465857/Wanikani%20Vertical%20Review%20Progress%20Bar%20%28Levels%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465857/Wanikani%20Vertical%20Review%20Progress%20Bar%20%28Levels%29.meta.js
// ==/UserScript==

(async function() {



    const apiToken = 'your api key here owo';
























    if(apiToken == 'your api key here owo'){
        alert("please enter your api token at the top of the script 'Vertical Review Progress Bar' code, otherwise the script doesn't work!");
    }






	"use strict";
	/* global wkof */
    /* eslint no-multi-spaces: "off" */

	if (!window.wkof) {
		alert("Script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.");
		window.location.href = "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
		return;
	}

	wkof.include("ItemData,Menu,Settings");
	await wkof.ready("document,ItemData,Menu,Settings");

	const PROBABILITY_SCALING_RENDAKU_ = 0.3;
	const PROBABILITY_SCALING_GEMINATION_ = 0.5;
	const MIN_KANJI_SIMILARITY_ = 0.5;
	const LEVENSHTEIN_TRANSPOSITION_COST_ = 0.5;
  
	let startTime = new Date().getTime();
  
	let linearGradient = "";
  
	// Assuming there are 60 levels
	let levels = Array.from({ length: 60 }, () => []);

	
	const levelColors = [];
const minBlueValue = 20; // Adjust this to change the minimum blue value
const maxBlueValue = 235; // Adjust this to change the maximum blue value


const inlevel_init = new Array(60).fill(0);
const inlevel_new = new Array(60).fill(0);
  
  

  let init_radicalCount = 0;
	let init_kanjiCount = 0;
	let init_vocabCount = 0;
  let all = 0;
  let new_radicalCount = 0;
	let new_kanjiCount = 0;
	let new_vocabCount = 0;
  let radicalCount_percent = "";
	let kanjiCount_percent = "";
	let vocabCount_percent = "";
  let restCount_percent = "";


  let radical_colour = "#80E7FF";
  let kanji_colour = "#FDA6F4";
  let vocab_colour = "#B834F7";
  let rest_colour = "#A0A0A0";



    const requestHeaders = new Headers({
  'Wanikani-Revision': '20170710',
  Authorization: 'Bearer ' + apiToken,
});

   let dummyCurrentItem = {
    data: {
        readings: [
            {
                accepted_answer: true,
                reading: "dummy_reading"
            }
        ],
        characters: "dummy_characters"
    }
};

   let dummyGuess = {
    item: {
        id: 0,
        data: {
            characters: "dummy_characters",
            meanings: [
                {
                    meaning: "dummy_meaning",
                    accepted_answer: true
                }
            ],
            readings: [
                {
                    reading: "dummy_reading",
                    accepted_answer: true
                }
            ]
        }
    },
    reading: "dummy_reading",
    probability: 1,
    show: true,
    type: "dummy"
};



	const defaultColors_ = {
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

	const idsEqualities_ = {
		囗: "口",
		厶: "ム",
		亻: "ｲ"
	}

	// approximate mappings
	const radicalIdToChar_ = {
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

	const jokeMeaningFilter_ = {
		3237: ["The Answer"],
		5633: ["Nic Cage"]
	}

	const typeDescription_ = {
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

	let similarityCache_ = {};
	let oldSettings_ = {};

	// true if in alternative mode: show guesses even though answer was CORRECT
	let correctAnswer_ = true;

	// variables that will be initialized by settingsChanged_()
	let idsHash_ = {};
	let byId_ = {};
	let byReading_ = {};
	let byCharacters_ = {};
	let byMeaning_ = {};
	let srs_ = [];

	let dOverlay_ = null;
	let dCollapsible_ = null;
	let bExpand_ = null;
	let fobserver_Target_ = null;
	let iUserInput_ = null;
	let iShowLess_ = null;
	let hotkeyEntry_ = null;
	let hotkeyKey_ = null;

	document.addEventListener("turbo:before-render", async e => {
		let observer_ = new MutationObserver(m => {
			if (m[0].target.childElementCount > 0) return;
			observer_.disconnect();
			observer_ = null;
			init_();
		});
		observer_.observe(e.detail.newBody, {childList: true});
	});
	init_();
  
  //await update();
  //await showGuesses_();

	function init_() {
    console.log("init_();");
		if (!document.URL.endsWith("wanikani.com/subjects/review")) return;

		// inject the overlay into the DOM
		let fFooter__ = document.querySelector("#reviews footer, footer.quiz-footer");
		dOverlay_ = document.createElement("div");
		dCollapsible_ = document.createElement("div");
		//bExpand_ = document.createElement("button_");
		//bExpand_.title = "Show ConfusionGuesser list";
		//bExpand_.addEventListener("click", showGuesses);
		dCollapsible_.classList.add("collapsed");
		dOverlay_.id = "confusionGuesserOverlay_";
		dOverlay_.appendChild(dCollapsible_);
		fFooter__.parentElement.insertBefore(dOverlay_, fFooter__);

		iShowLess_ = null;
		document.addEventListener("keydown", ev => {
			if ((ev.target.nodeName === "INPUT" && ev.target.getAttribute("enabled") !== "false") || ev.key.toLowerCase() !== wkof.settings.confusionguesser.hotkeyExpand || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey) return;
			let collapsed = dCollapsible_.classList.contains("collapsed");
			if (iShowLess_ && !collapsed) iShowLess_.checked = !iShowLess_.checked;
			if (collapsed && fobserver_Target_.getAttribute("correct") !== null) showGuesses_();
		});

		// add entry to hotkey list
		hotkeyEntry_ = document.createElement("div");
		hotkeyKey_ = document.createElement("div");
		let hotkeyKey_Display = document.createElement("div");
		let hotkeyDescription = document.createElement("div");
		hotkeyEntry_.classList.add("hotkeys-menu__entry");
		hotkeyKey_.classList.add("hotkeys-menu__key");
		hotkeyKey_Display.classList.add("hotkeys-menu__keys");
		hotkeyDescription.classList.add("hotkeys-menu__description");
		hotkeyDescription.textContent = "Expand/collapse guesses";
		hotkeyKey_Display.appendChild(hotkeyKey_);
		hotkeyEntry_.appendChild(hotkeyKey_Display);
		hotkeyEntry_.appendChild(hotkeyDescription);
		document.querySelector(".hotkeys-menu__content").appendChild(hotkeyEntry_);



		installCss_();
	  setupMenu_();
    showGuesses_();


		// create observer_ to react to wrong answers
		iUserInput_ = document.getElementById("user-response");
		fobserver_Target_ = document.querySelector("#answer-form fieldset, .quiz-input__input-container");
		let observer_ = new MutationObserver(m => m.forEach(handleMutation_));
		observer_.observe(fobserver_Target_, {attributes: true, attributeFilter: ["class", "correct"]});
	}



	function handleMutation_(mutation) {
    console.log("handleMutation_();");
		let action = mutation.attributeName === "correct" ?
			(mutation.target.getAttribute("correct") === "false" ? wkof.settings.confusionguesser.incorrectAction : (mutation.target.getAttribute("correct") === "true" ? wkof.settings.confusionguesser.correctAction : "hide")) :
			(mutation.target.classList.contains("incorrect") ? wkof.settings.confusionguesser.incorrectAction : (mutation.target.classList.contains("correct") ? wkof.settings.confusionguesser.correctAction : "hide"));
		if (action === "show") {
			showGuesses_();
		} else if (action === "showThreshold") {
			showGuesses_(parseFloat(wkof.settings.confusionguesser.showThreshold));
		} else {
			hideGuesses_();
			//if (action === "arrow")  dOverlay_.insertBefore(bExpand_, dCollapsible_);
		}
    //update();
    installCss_();
    console.log(`${all}, ${new_radicalCount}, ${new_kanjiCount}, ${new_vocabCount}`);
	}

	async function showGuesses_(threshold = -1) {
    console.log("showGuesses_();");
		//bExpand_.remove();
		//correctAnswer_ = false;

		// clear cache
		similarityCache_ = {};



		let guesses_ = [];
		/*let currentId = parseInt(document.querySelector(`[data-subject-id]`).dataset.subjectId);
		let currentItem = dummyCurrentItem//byId_[currentId];
		let expectedReading = currentItem.data.readings?.filter(r => r.accepted_answer).map(r => r.reading);
		let question = radicalIdToChar_[currentId] || currentItem.data.characters;

		// ensure that idsFile finished loading
		idsHash_ = await idsHash_;

		switch (document.querySelector(`[for=user-response]`).dataset.questionType) {
			case "reading": guesses = guessForReading(iUserInput_.value, expectedReading, question); break;
			case "meaning": guesses = guessForMeaning(iUserInput_.value, question); break;
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
    */
    if (guesses_.length === 0) {
    guesses_.push(dummyGuess);
}
		console.log(`guesses_ content: ${guesses_}, length ${guesses_.length}`);

		// remove old guesses
		while (dCollapsible_.firstChild) {
			dCollapsible_.removeChild(dCollapsible_.firstChild);
		}
		if (guesses_.length === 0) return;
		// show only arrow if all guesses below threshold
		if (guesses_[0].probability < threshold) {
			//dOverlay_.insertBefore(bExpand_, dCollapsible_);
			//return;
      console.log("guesses_[0].probability < threshold");
		}
		// display new guesses_
		let dguesses_ = document.createElement("div");
		//addShowMoreOption_(dCollapsible_);
		dguesses_.appendChild(spoilerbutton__(guesses_[0])); dguesses_.appendChild(guessToDiv_(guesses_[0]));
		dguesses_.id = "guesses_";
		dCollapsible_.appendChild(dguesses_);
		dCollapsible_.classList.toggle("collapsed", false);
	}

	function hideGuesses_() {
		dCollapsible_.classList.toggle("collapsed", false);
		//bExpand_.remove();
	}

	function guessForMeaning(answer, question) {
		answer = answer.toLowerCase();
		let result = searchbyMeaning_(answer).map(item => ({type: "visuallySimilar", item, probability: rateSimilarity(item, question)}));
		if (correctAnswer_) result = result.filter(r => !question.includes(r.item.data.characters));
		// for each guess, select the meaning that is closest to the answer, and also adapt its probability by the meaning similarity
		result.forEach(r => {let best = meaningsOfItem(r.item).reduce((best, m) => {let rating = rateSimilarity(m.toLowerCase(), answer); return rating > best.rating ? {rating, meaning: m} : best}, {rating: -1}); r.meaning = best.meaning; r.probability *= best.rating});
		result.sort((a, b) => b.probability - a.probability);
		if (result.length > 0) result[0].show = true;
		return result;
	}

	function guessForReading(answer, expected, question) {
		expected = ensureArray(expected);
		let guesses_ = expected.flatMap(e => guessForReading_splitByOkurigana(answer, e, question));
		return guesses_.concat(guessForReading_wholeVocab(answer, question));
	}

	function guessForReading_wholeVocab(answer, question) {
		let result = searchbyReading_(answer).filter(item => item.object === "vocabulary").map(item => ({type: "visuallySimilar", item, reading: answer, probability: rateSimilarity(item, question)}));
		if (correctAnswer_) result = result.filter(r => r.item.data.characters !== question);
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
		// if okurigana does not match answer return no guesses_
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
		// try to split the expected reading to on/kun of each kanji; if not successful then return no guesses_
		let kanjiReadings = splitExpected.filter(s => s.every((part, idx) => validReading(question[idx], part))).pop();
		// if it was not possible to validate the reading for every kanji, try to find a split where at least every second kanji has a validated reading
		kanjiReadings = kanjiReadings || splitExpected.filter(s => s.reduce((state, part, idx) => state === 2 ? 2 : (validReading(question[idx], part) ? 0 : ++state), 0) !== 2).pop();
		// if there was still no solution found, give up
		if (!kanjiReadings) return [];

		// for each split (of the answer entered by the user), guess for each part => array of arrays of arrays
		let guesses_ = splitAnswer.map(s => s.map((part, idx) => guessForReading_singleKanji(part, kanjiReadings[idx], question[idx])));
		// remove splits where at least one part resulted in no guesses_
		guesses_ = guesses_.filter(forSplit => forSplit.every(forPart => forPart.length > 0));
		// calculate probability of each guess
		guesses_.forEach(forSplit => forSplit.forEach((forPart, idx) => forPart.forEach(guess => {guess.probability *= calculateGuessProbability(guess, question[idx])})));
		// sort guesses_ for each part descending by probability
		guesses_.forEach(forSplit => forSplit.forEach(forPart => forPart.sort((a, b) => b.probability - a.probability)));
		// calculate probability of each split by multiplying the highest probability of each part together
		let splitProbability = guesses_.map(forSplit => forSplit.reduce((totalProb, forPart) => totalProb * forPart.reduce((highestProb, guess) => Math.max(highestProb, guess.probability), 0), 1));
		// scale the probability of each guess with the highest probabilities for the other parts in the split (overall split probability, but instead of the best guess for the current part, take the current guess)
		guesses_.forEach((forSplit, idx) => forSplit.forEach(forPart => forPart.forEach((guess, i) => {if (i !== 0) guess.probability *= splitProbability[idx] / forPart[0].probability})));
		guesses_.forEach((forSplit, idx) => forSplit.forEach(forPart => {forPart[0].probability = splitProbability[idx]}));
		// find the split with the highest probability
		let idx = splitProbability.reduce((best, probability, idx) => probability <= best.probability ? best : {probability, idx}, {probability: 0}).idx;
		// mark the best guess (sorted, therefore at index 0) for each part of the best split with "show"
		(guesses_[idx] || []).forEach(forPart => {forPart[0].show = true});
		return guesses_.flat(2);
	}

	function guessForReading_singleKanji(answer, expected, question) {
		let reading = answer;
		if (answer === expected && !correctAnswer_) return [{type: "correct", item: getItem(question), reading, probability: 1}];

		let                                  guesses_ =                searchbyReading_(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: 1}));
		reading = removeRendaku1(answer);    guesses_ = guesses_.concat(searchbyReading_(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_RENDAKU_})));
		reading = removeRendaku2(answer);    guesses_ = guesses_.concat(searchbyReading_(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_RENDAKU_})));
		reading = removeGemination1(answer); guesses_ = guesses_.concat(searchbyReading_(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION_})));
		reading = removeGemination2(answer); guesses_ = guesses_.concat(searchbyReading_(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION_})));
		reading = removeGemination3(answer); guesses_ = guesses_.concat(searchbyReading_(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION_})));
		reading = removeGemination4(answer); guesses_ = guesses_.concat(searchbyReading_(reading).filter(s => s.object === "kanji").map(item => ({type: "visuallySimilar", item, reading, probability: PROBABILITY_SCALING_GEMINATION_})));

		if (answer === expected) {
			guesses_ = guesses_.filter(g => g.item.data.characters !== question);
			return guesses_.length === 0 ? [{type: "correct", item: getItem(question), reading, probability: 1}] : guesses_;
		}
		// change the type to onyomionyomi, onyomikunyomi etc. where applicable
		guesses_.filter(g => g.item.data.characters === question).forEach(g => {g.type = validReading(question, answer) + validReading(question, expected)});
		return guesses_;
	}

	function calculateGuessProbability(guess, question) {
		switch (guess.type) {
			case "visuallySimilar": return rateSimilarity(guess.item, question);
			case "correct":         return 1;
			default:                return 1; // onyomikunyomi etc.
		}
	}

	function getItem(characters, preferred = ["kanji", "vocabulary", "radical"]) {
		return (byCharacters_[characters] || []).reduce((result, item) => result ? (preferred.indexOf(item.object) < preferred.indexOf(result.object) ? item : result) : item, undefined);
	}

	function ensureArray(listOrEntry) {
		return Array.isArray(listOrEntry) ? listOrEntry : (listOrEntry === undefined ? [] : [listOrEntry]);
	}

	function searchbyReading_(reading) {
		return byReading_[reading] || [];
	}

	function searchbyMeaning_(meaning) {
		return byMeaning_.get(meaning);
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
		let line = idsHash_[kanji];
		if (!line) return [kanji];
		// get all decomposition variations that apply to the Japanese character appearance (I think that's what [J] in ids.txt means)
		let variations = line.split("\t").filter(v => !v.match(/\[[^J\]]+\]/));
		if (variations.length === 0) variations = [line.split("\t")[0]]; // fix for lines such as "U+225BB	𢖻	⿱心夂[G]	⿱心夊[T]" - TODO: research what the letters in [] mean
		return variations.map(v => v === kanji ? (idsEqualities_[v] || v) : parseIds(v[Symbol.iterator]()));
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
		let text1 = typeof itemOrText1 === "string" ? itemOrText1 : (itemOrText1.data.characters || radicalIdToChar_[itemOrText1.id]);
		let text2 = typeof itemOrText2 === "string" ? itemOrText2 : (itemOrText2.data.characters || radicalIdToChar_[itemOrText2.id]);
		if (!text1 || !text2) return 0;
		let cacheId1 = text1 + "§" + text2;
		let cacheId2 = text2 + "§" + text1;
		if (similarityCache_[cacheId1]) return similarityCache_[cacheId1];
		if (similarityCache_[cacheId2]) return similarityCache_[cacheId2];
		let chars1 = Array.from(text1);
		let chars2 = Array.from(text2);

		if (chars1.length > 1 || chars2.length > 1) {
			let dist = levenshteinDistance(chars1, chars2, (char1, char2) => 1 - rateSimilarity(char1, char2));
			// normalize distance to [0;1] and invert it so that 0 is complete mismatch
			return (similarityCache_[cacheId1] = 1 - dist / Math.max(chars1.length, chars2.length));
		}

		let item1 = typeof itemOrText1 === "string" ? getItem(itemOrText1) : itemOrText1;
		let item2 = typeof itemOrText2 === "string" ? getItem(itemOrText2) : itemOrText2;

		let similarity = item1 && item2 ? MIN_KANJI_SIMILARITY_ : 0;
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
		return (similarityCache_[cacheId1] = similarity);
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
			                   i > 1 && j > 1 ? d[i - 2][j - 2] + LEVENSHTEIN_TRANSPOSITION_COST_ + elementDistanceFunction(array1[i - 2], array2[j - 1]) + elementDistanceFunction(array1[i - 1], array2[j - 2]) : Number.MAX_SAFE_INTEGER);
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

	async function loadidsHash_() {
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

	function hashGrams_(wkItems, gramSizes = [4, 3]) {
		let result = {};
		wkItems.forEach(item => meaningsOfItem(item).forEach((m, mNr) => {let entry = {item, mNr}; toGrams_(m, gramSizes).flat().forEach(g => {result[g] = (result[g] || []).concat(entry)})}));
		result.get = (text, gramSizes = [4, 3]) => gramSizes.reduce((prevResult, size) => prevResult.length > 0 ? prevResult : highestBins(histogram(toGrams_(text, [size])[0].flatMap(gram => result[gram] || [])), 10, text.length / 2).map(h => h[0].item), []);
		return result;
	}

	function toGrams_(text, gramSizes = [4, 3]) {
		text = "§" + text.toLowerCase() + "§";
		return gramSizes.map(size => Array.from(new Array(text.length - size + 1), (val, idx) => text.substr(idx, size)));
	}

	function meaningsOfItem(item) {
		let meanings = jokeMeaningFilter_[item.id] ? item.data.meanings.filter(m => !jokeMeaningFilter_[item.id].includes(m.meaning)) : item.data.meanings;
		return meanings.concat(wkof.settings.confusionguesser.includeWhitelist ? item.data.auxiliary_meanings.filter(m => m.type === "whitelist") : []).map(m => m.meaning).concat(wkof.settings.confusionguesser.includeUserSynonyms && item.study_materials ? item.study_materials.meaning_synonyms : []);
	}

	// ---DOM STUFF--- //

	function addShowMoreOption_(div) {
    /*
		iShowLess_ = document.createElement("input");
		let lShowMore = document.createElement("label");
		let lShowLess = document.createElement("label");
		iShowLess_.id = "showLess";
		iShowLess_.type = "checkbox";
		iShowLess_.checked = !wkof.settings.confusionguesser.showAllByDefault;
		lShowMore.htmlFor = "showLess";
		lShowLess.htmlFor = "showLess";
		//lShowMore.textContent = "+";
		//lShowLess.textContent = "-";
		div.appendChild(lShowMore);
		div.appendChild(iShowLess_);
		div.appendChild(lShowLess);
    */
	}

	function guessToDiv_(guess) {

		let a = document.createElement("a");

		let sJapanese = document.createElement("span");
		let sEnglish = document.createElement("span");
		let sProbability = document.createElement("span");
		let rJapanese = document.createElement("ruby");
		a.href = guess.item.data.document_url;
		a.target = "_blank";
		a.title = typeDescription_[guess.type];
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
		//a.appendChild(sJapanese);
		//a.appendChild(sEnglish);
		//a.appendChild(sProbability);
		return a;

	}

	async function appendSvgChild(character_images, element) {
		try {
			element.innerHTML += await wkof.load_file(character_images.find(c => c.content_type === "image/svg+xml" && !c.metadata.inline_styles).url);
		} catch(e) {
			let iSvg = document.createElement("img");
			iSvg.src = character_images.find(c => c.content_type === "image/svg+xml" && c.metadata.inline_styles).url;
			element.appendChild(iSvg);
		}
	}

	function spoilerbutton__(guess) {
		let b = document.createElement("button_");
		//b.textContent = "Show spoiler";
		if (guess.show) b.classList.add("show");
		b.addEventListener("click", (e) => e.target.parentElement.removeChild(e.target));
		return b;
	}

	function isSpoiler(guess) {
		if (wkof.settings.confusionguesser.spoilerHandling === "none" || !guess.item.assignments || !guess.item.assignments.available_at) return false;
		let nextReview = new Date(guess.item.assignments.available_at);
		let remainingTimeInMs = nextReview - new Date();
		let stage = srs_[guess.item.data.spaced_repetition_system_id].data.stages[guess.item.assignments.srs_stage];
		if (!stage) return false; // should not happen
		return remainingTimeInMs < srs_StageIntervalInMs(stage) * parseInt(wkof.settings.confusionguesser.spoilerHandling) / 100;
	}

	function srs_StageIntervalInMs(stage) {
		let result = stage.interval;
		if (stage.interval_unit === "milliseconds") return result; result *= 1000;
		if (stage.interval_unit ===      "seconds") return result; result *= 60;
		if (stage.interval_unit ===      "minutes") return result; result *= 60;
		if (stage.interval_unit ===        "hours") return result; result *= 24;
		if (stage.interval_unit ===         "days") return result; result *= 7;
		if (stage.interval_unit ===        "weeks") return result;
		return null;
	}

	function frombutton_Color() {
		let button_ = document.querySelector("#option-kana-chart > span > i");
		let textColor = button_ ? getComputedStyle(button_).color : "rgb(0, 0, 0)";
		let color = "rgb(255, 255, 255)";
		while (button_ && getComputedStyle(button_).backgroundColor.match(/rgba\(.*0\)/)) button_ = button_.parentElement;
		color = rbgToHex(button_ ? getComputedStyle(button_).backgroundColor : color);
		let result = Object.assign({}, defaultColors_);
		Object.keys(result).forEach(k => (result[k] = color));
		result.textColor = rbgToHex(textColor);
		return result;
	}

	function rbgToHex(rgbString) {
		let rgb = rgbString.match(/\( *([^,]*), *([^,]*), *([^,\)]*)/);
		return rgb.slice(1, 4).reduce((result, c) => result + parseInt(c).toString(16).padStart(2, "0"), "#");
	}

	// ---SETTINGS STUFF--- //

	function prepareDialog_(dialog) {
    /*
		let iThreshold = document.getElementbyId_("confusionguesser_showThreshold");
		iThreshold.min = 0;
		iThreshold.max = 1;
		iThreshold.step = 0.01;
		iThreshold.addEventListener("input", thresholdChange);
		let showX = wkof.settings.confusionguesser.correctAction === "showThreshold" || wkof.settings.confusionguesser.incorrectAction === "showThreshold";
    */
		//let lThreshold = document.createElement("label");
		//lThreshold.for = "confusionguesser_showThreshold";
		//lThreshold.textContent = parseFloat(wkof.settings.confusionguesser.showThreshold).toFixed(2);
		//iThreshold.insertAdjacentElement("afterend", lThreshold);
		//iThreshold.parentElement.parentElement.classList.toggle("hidden", !showX);
	}

	function actionChange() {
		let showX = true;
		document.getElementbyId_("confusionguesser_showThreshold").parentElement.parentElement.classList.toggle("hidden", !showX);
	}

	function thresholdChange() {
		let iThreshold = document.getElementbyId_("confusionguesser_showThreshold");
		iThreshold.nextElementSibling.textContent = parseFloat(iThreshold.value).toFixed(2);
	}

	async function settingsChanged_(settings) {
		// find changed settings
		let changes = Object.keys(settings).filter(key => oldSettings_[key] !== settings[key]);
		let refetchItems = false;

		changes.forEach(key => {
			switch(key) {
				case "useIds":
					idsHash_ = settings.useIds ? loadidsHash_() : {};
					if (!settings.useIds) wkof.file_cache.delete("ideographicDescriptionSequences");
					return;
				case "spoilerHandling":
					if (oldSettings_.guessOnlyLearnedItems || oldSettings_.spoilerHandling !== "none") return; // else fallthrough
				case "guessOnlyLearnedItems":
				case "useFuzzySearch":
				case "includeWhitelist":
				case "includeUserSynonyms":
					refetchItems = true;
					return;
				case "showAsOverlay":
					dOverlay_.classList.toggle("noOverlay", !settings.showAsOverlay);
					return;
				case "showTypes":
					dOverlay_.classList.toggle("hideTypes", !settings.showTypes);
					return;
				case "showRatings":
					dOverlay_.classList.toggle("hideRatings", !settings.showRatings);
					return;
				case "highContrast":
					dCollapsible_.classList.toggle("highContrast", settings.highContrast);
					return;
				case "fontSize":
					dOverlay_.style.setProperty("font-size", settings[key]);
					return;
				case "hotkeyExpand":
					hotkeyEntry_.classList.toggle("disabled", settings.hotkeyExpand === "");
					hotkeyKey_.textContent = settings.hotkeyExpand.toUpperCase();
					return;
				default:
					if (key.endsWith("Color")) dOverlay_.style.setProperty("--" + key.substr(0, key.length - 5), settings[key]);
					return;
			}
		});

		if (refetchItems) {
			let config = {wk_items: {options: {study_materials: settings.includeUserSynonyms, assignments: settings.spoilerHandling !== "none"}}};
			if (settings.guessOnlyLearnedItems) config.wk_items.filters = {srs: {value: ["lock", "init"], invert: true}};
			let items = await wkof.ItemData.get_items(config);
			byId_ = wkof.ItemData.get_index(items, "subject_id");
			byReading_ = wkof.ItemData.get_index(items, "reading");
			byCharacters_ = items.reduce((result, i) => { result[i.data.characters] = (result[i.data.characters] || []).concat([i]); return result; }, {});
			byMeaning_ = settings.useFuzzySearch ? hashGrams_(items) : {get: text => {text = text.toLowerCase(); let result = items.filter(item => meaningsOfItem(item).some(m => m.toLowerCase().startsWith(text))); if (result.length > 16) result = items.filter(item => meaningsOfItem(item).some(m => m.toLowerCase() === text)); return result;}};
		}

		// srs_ stage durations are needed if spoiler handling is activated
		if (settings.spoilerHandling !== "none" && srs_.length === 0) {
			if (!wkof.file_cache.dir["Apiv2.spaced_repetition_systems"] || new Date() - new Date(wkof.file_cache.dir["Apiv2.spaced_repetition_systems"].added) > 604800000) {
				srs_ = await wkof.Apiv2.get_endpoint("spaced_repetition_systems");
			} else {
				srs_ = (await wkof.file_cache.load("Apiv2.spaced_repetition_systems")).data;
			}
		}

		Object.assign(oldSettings_, settings);
	}

	function setupMenu_() {
		wkof.Menu.insert_script_link({name: "confusionguesser", submenu: "Settings", title: "ConfusionGuesser", on_click: openSettings});

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
			hotkeyExpand: "e"
		}
		Object.assign(defaults, defaultColors_);
		return wkof.Settings.load("confusionguesser", defaults).then(settingsChanged_);
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
		spoilerHandlingOptions["10"] = "If sooner than 10% of the srs_ interval";
		spoilerHandlingOptions["20"] = "If sooner than 20% of the srs_ interval";
		spoilerHandlingOptions["30"] = "If sooner than 30% of the srs_ interval";
		spoilerHandlingOptions["50"] = "If sooner than 50% of the srs_ interval";
		spoilerHandlingOptions["75"] = "If sooner than 75% of the srs_ interval";
		let actionOptions = {};
		actionOptions["hide"] = "Show nothing";
		actionOptions["arrow"] = "Minimized ‒ show arrow";
		actionOptions["showThreshold"] = "Minimized if all ratings < X";
		actionOptions["show"] = "Show list";
		let dialog = new wkof.Settings({
			script_id: "confusionguesser",
			title: "ConfusionGuesser Settings",
			pre_open: prepareDialog_,
			on_save: settingsChanged_,
			content: {
				tabFunctionality:            {type: "page",     label: "Functionality",                content: {
					guessOnlyLearnedItems:   {type: "checkbox", label: "Guess only learned items",     hover_tip: "When enabled, the guess list will only contain items that you have already learned on WaniKani."},
					spoilerHandling:         {type: "dropdown", label: "Hide spoiler guesses_",         hover_tip: "Select if guesses_ for WK items that will soon come up for review should be hidden.", content: spoilerHandlingOptions},
					grpMeaningguesses_:       {type: "group",    label: "Meaning guesses_",              content: {
						useFuzzySearch:      {type: "checkbox", label: "Use fuzzy search",             hover_tip: "When enabled, guesses_ for a wrong meaning also contain non-exact matches. Might increase loading time of the review page."},
						includeWhitelist:    {type: "checkbox", label: "Include hidden whitelist",     hover_tip: "When enabled, guesses_ for a wrong meaning also consider the hidden whitelist (for example 'boob grave')."},
						includeUserSynonyms: {type: "checkbox", label: "Include user synonyms",        hover_tip: "When enabled, guesses_ for a wrong meaning also consider your entered synonyms."},
					}},
					grpSimilarityRating:     {type: "group",    label: "Kanji similarity rating",      content: {
						useWkRadicals:       {type: "checkbox", label: "Use WK radicals",              hover_tip: "With this, kanji are considered similar if they share some WK radicals."},
						useWkSimilarity:     {type: "checkbox", label: "Use WK visually similar list", hover_tip: "With this, kanji are considered similar if WK has them listed as visually similar."},
						useIds:              {type: "checkbox", label: "Use IDS",                      hover_tip: "When enabled, a 2MB text file with ideographic description sequences will be downloaded and stored locally to improve kanji similarity ratings."}
					}}
				}},
				tabInterface:                {type: "page",     label: "Interface",                    content: {
					showAsOverlay:           {type: "checkbox", label: "Show as overlay",              hover_tip: "Display the guess list as an overlay to the right of the question or at the bottom of the page. On narrow displays, the list is always at the bottom."},
					showAllByDefault:        {type: "checkbox", label: "Show all guesses_ by default",  hover_tip: "When enabled, the guess list will be expanded by default."},
					showTypes:               {type: "checkbox", label: "Show guess types",             hover_tip: "Show 丸⬄九 for guesses_ based on visual similarity, on⬄kun if you used on'yomi but needed kun'yomi, etc."},
					showRatings:             {type: "checkbox", label: "Show ratings",                 hover_tip: "When enabled, a number between 0 and 1 to the right of each guess shows the rating of that guess."},
					highContrast:            {type: "checkbox", label: "High contrast mode",           hover_tip: "When enabled, the overlay will have a dark background. Always active if the guesses_ are displayed at the bottom of the page."},
					fontSize:                {type: "dropdown", label: "Font size",                    hover_tip: "Select the font size for the guesses_.", content: fontSizeOptions},
					correctAction:           {type: "dropdown", label: "When answer correct",          hover_tip: "Specify if the list of guesses_ should be displayed after a correct answer. The hotkey will open the list regardless of this setting.", content: actionOptions, on_change: actionChange},
					incorrectAction:         {type: "dropdown", label: "When answer incorrect",        hover_tip: "Specify if the list of guesses_ should be displayed after a wrong answer. The hotkey will open the list regardless of this setting.", content: actionOptions, on_change: actionChange},
					showThreshold:           {type: "input",    label: "X (rating threshold)",         hover_tip: "If all guesses_ have a rating below this threshold, do not show the list.", subtype: "range"},
					hotkeyExpand:            {type: "text",     label: "Hotkey expand guesses_",        hover_tip: "Choose a hotkey to expand/collapse the list of guesses_.", match: /^.?$/}
				}},
				tabGuessColors:              {type: "page",     label: "Guess colors",                 content: {
					vissimColor:             {type: "color",    label: "丸⬄九",                        hover_tip: typeDescription_.visuallySimilar},
					ononColor:               {type: "color",    label: "on⬄on",                       hover_tip: typeDescription_.onyomionyomi},
					onkunColor:              {type: "color",    label: "on⬄kun",                      hover_tip: typeDescription_.onyomikunyomi},
					kunonColor:              {type: "color",    label: "kun⬄on",                      hover_tip: typeDescription_.kunyomionyomi},
					kunkunColor:             {type: "color",    label: "kun⬄kun",                     hover_tip: typeDescription_.kunyomikunyomi},
					naonColor:               {type: "color",    label: "na⬄on",                       hover_tip: typeDescription_.nanorionyomi},
					nakunColor:              {type: "color",    label: "na⬄kun",                      hover_tip: typeDescription_.nanorikunyomi},
					onnaColor:               {type: "color",    label: "on⬄na",                       hover_tip: typeDescription_.onyominanori},
					kunnaColor:              {type: "color",    label: "kun⬄na",                      hover_tip: typeDescription_.kunyominanori},
					nanaColor:               {type: "color",    label: "na⬄na",                       hover_tip: typeDescription_.nanorinanori},
					specialColor:            {type: "color",    label: "Special",                      hover_tip: "Reading exception / WK does not list this reading"},
					textColor:               {type: "color",    label: "Text",                         hover_tip: "Text color"},
					resetColor:              {type: "button_",   label: "Reset colors to default", text: "Reset", on_click: (name, config, on_change) => {Object.assign(wkof.settings.confusionguesser, defaultColors_); dialog.refresh();}},
					button_Color:             {type: "button_",   label: "From button_ color", text: "Load", on_click: (name, config, on_change) => {Object.assign(wkof.settings.confusionguesser, frombutton_Color()); dialog.refresh();}, hover_tip: "Use the colors of the button_s below the input box. Useful for dark mode users."}
				}}
			}
		});
		dialog.open();
		document.getElementbyId_("confusionguesser_hotkeyExpand").addEventListener("keydown", e => { if (e.key === "Backspace") e.stopPropagation(); });
	}







  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}










  async function calc_percent(){

   let rad = Math.round((new_radicalCount/all) * 100);

   let kan = Math.round((new_kanjiCount/all) * 100);

   let voc = Math.round((new_vocabCount/all) * 100);

    let rest = Math.round(((100-rad-kan-voc)/all) * 100);
    radicalCount_percent = (rad+rest).toString() + "%";
    kanjiCount_percent = (kan+rad).toString() + "%";
    vocabCount_percent = (voc+kan).toString() + "%";
    restCount_percent = rest.toString() + "%";
  }





  function updateLevelCounts(subjectId) {
  // Get the subject's level and type
  const subject = allSubjects.find((s) => s.id === subjectId);
  const level = subject.data.level;

  // Update the level counts for inLevel_new
  if (level >= 1 && level <= 60) {
    inLevel_new[level - 1]--;
  }

  // You may also want to save inLevel_new to local storage or another persistent storage
}


  
  

async function fetchAllSubjects(url = 'https://api.wanikani.com/v2/subjects', subjects = []) {
  const response = await fetch(url, { method: 'GET', headers: requestHeaders });
  const responseBody = await response.json();
  const currentPageSubjects = responseBody.data;
  subjects.push(...currentPageSubjects);

  if (responseBody.pages.next_url) {
    return fetchAllSubjects(responseBody.pages.next_url, subjects);
  } else {
    return subjects;
  }
}

  
  
  
  
  
  
async function init_fetchReviews(url = 'https://api.wanikani.com/v2/assignments?immediately_available_for_review=true') {
  const response = await fetch(url, { method: 'GET', headers: requestHeaders });
  const responseBody = await response.json();
  
  const currentPageReviews = responseBody.data.map(assignment => assignment);
  allReviews.push(...currentPageReviews);

  if (responseBody.pages.next_url) {
    return init_fetchReviews(responseBody.pages.next_url, allReviews);
  } else {
    const subject_ids = allReviews.map(review => review.data.subject_id);
    const allSubjects = await fetchAllSubjects();

    const filteredSubjects = allSubjects.filter(subject => subject_ids.includes(subject.id));

    filteredSubjects.forEach(subject => {
      const level = subject.data.level;
      const subjectId = subject.id;

      // Check if the level is within the valid range (1-60)
      if (level >= 1 && level <= 60) {
        // Push the subject ID into the corresponding level array
        levels[level - 1].push(subjectId);
      }
    });

    if (all === 0) {
      all = allReviews.length;
    }
  }
  
  //log 
  
  console.log(`init_fetchReviews() ended, here is levelsarray lengths:`);
  let logMessage = "Lengths of all 60 levels: ";

	levels.forEach((levelArray, index) => {
		logMessage += `Level ${index + 1}: ${levelArray.length}, `;
	});

	// Remove the last comma and space
	logMessage = logMessage.slice(0, -2);

console.log(logMessage);
}



function generateLinearGradient() {
	console.log("start creating linear gradient");
	let levellenghts = [];
	levels.forEach((levelArray, index) => {
		levellenghts.push(levelArray.length);
	});
  let totalReviews = all;
  let gradientStops = [];
  let currentPercentage = 0;
  
  console.log('level lengths:', levellenghts);
	console.log('totalReviews:', totalReviews);

	let startPercentage;
  let endPercentage;
  
  for (let i = levellenghts.length - 1; i >= 0; i--) {
    if(levellenghts[i] == 0){
      continue;
    }
    let levelPercentage = (levellenghts[i] / totalReviews) * 100;
    console.log(levellenghts[i]);
    console.log((levellenghts[i] / totalReviews));
    console.log((levellenghts[i] / totalReviews) * 100);
    startPercentage = currentPercentage;
    endPercentage = currentPercentage + levelPercentage;
    console.log(levelPercentage, startPercentage, endPercentage);
    
    startPercentage = Math.round(startPercentage);
    endPercentage = Math.round(endPercentage);

    gradientStops.push(`${levelColors[i]} ${startPercentage}%, ${levelColors[i]} ${endPercentage}%`);
    console.log(`${levelColors[i]} ${startPercentage}%, ${levelColors[i]} ${endPercentage}%`);

    if (i == levellenghts.length - 1) {
      //gradientStops.push(`#A0A0A0 ${endPercentage}%, #A0A0A0 100%`);
    }

    currentPercentage = endPercentage;
  }
	//gradientStops.push(`#A0A0A0 ${endPercentage}%, #A0A0A0 100%`);
  //return `linear-gradient(to bottom, ${gradientStops.join(', ')})`;
  //let rest = 100 - endPercentage;
  let a = gradientStops.join(', ') + `, rgba(173, 173, 173, 0.8) ${endPercentage}%, rgba(173, 173, 173, 0.8) 100%`;
  linearGradient = `linear-gradient(to top, ${a})`;
  console.log("linear gradient done:");
  console.log(`${linearGradient}`);
}


  async function update(){
    await new_fetchReviews();
    await calc_percent();
  }
  
  function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}




// Helper function to convert HSL to HEX
function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}



function fillcolour() {
  let zeros = [];
  let zeroCount = levels.reduce((count, levelArray) => {
    if (levelArray.length === 0) {
      zeros.push(0);
      return count + 1;
    } else {
      zeros.push(1);
    }
    return count;
  }, 0);

  console.log(`zerocount: ${zeroCount}`);
	let merker = 0;
  for (let i = 0; i < 60; i++) {
    if (zeros[i] == 0) {
      levelColors.push("#000000");
      continue;
    }
    const hue = Math.floor(360 / (59 - zeroCount) * merker);
    const colorHex = hslToHex(hue, 95, 40);
    levelColors.push(colorHex);
    merker++;
    //console.log(`colour: ${colorHex}`);
  }
  console.log("fillcolour() done:");
  //console.log(`${levelColors}`);
}








  
  





	function installCss_() {
		generateLinearGradient();
    console.log("installCss_();");
    let colour_setup = `#guesses_ > a.show > *, #guesses_ > a.show::before, #guesses_ > button_.show { font-size: 1.35em; text-shadow: 2px 2px 3px rgba(0,0,0,0.4); background-image: ${linearGradient}; box-shadow: 0.5rem 0.2rem 0.2rem #0000001b; }`
    //console.log(colour_setup);


		let cssA = ":root { --radical-colour: #80E7FF; --kanji-colour: #FDA6F4; --vocab-colour: #B834F7; --rest-colour: #A0A0A0; --calc-rest-percentage: ${restCount_percent}; --calc-radical-percentage: ${radicalCount_percent}; --calc-kanji-percentage: ${kanjiCount_percent}; --calc-vocab-percentage: ${vocabCount_percent};}" +
 "#confusionGuesserOverlay_ { position: absolute; top: 1.5rem; left: 1.5rem; padding-top: 1.0rem; z-index: 100; overflow-x: hidden; pointer-events: none; min-height: 15rem; max-height: 15rem; min-width: 1.5rem; max-width: 2.5rem;}" +
			"#confusionGuesserOverlay_.noOverlay { position: relative; top: 0; margin-top: 3rem; min-height: initial; }" +
			//"#confusionGuesserOverlay_ > div { border-style: solid none; border-width: medium; background: linear-gradient(to right, rgba(0,0,0,0.2), transparent 100%, transparent); border-image: linear-gradient(to right, rgba(255,255,255,0.8), transparent 100%, transparent) 1; transition: transform 0.2s; pointer-events: initial; }" +
			"#confusionGuesserOverlay_ > div.highContrast, #confusionGuesserOverlay_.noOverlay > div { background-color: rgba(0, 0, 0, 0.4); padding-left: 0.7rem; }" +
			"#confusionGuesserOverlay_ > div.collapsed { transform: translateX(100%); }" +
			"#guesses_ { margin: 0.4rem 0; padding: 0 60px 0.6rem 0; max-height: 8.5rem; min-height: 8.5rem; max-width: 2rem; min-width: 1rem; overflow-x: hidden; overflow-y: hidden; display: grid; grid-template-columns: auto auto 1fr auto; grid-row-gap: 0.2rem; }" +
			"#confusionGuesserOverlay_.noOverlay #guesses_ { max-height: initial; overflow-y: hidden; }" +
			"#confusionGuesserOverlay_.hideRatings #guesses_ > a > *:last-child { display: none; }" +
			"#confusionGuesserOverlay_.hideTypes #guesses_ > a::before { display: none; }" +
			"#confusionGuesserOverlay_.hideTypes #guesses_ > a > *:first-child { border-radius: 0.5rem 0 0 0.5rem; }" +
			"#guesses_ { margin: 0.6rem 0; padding: 0 60px 0.6rem 0; max-height: 8rem; overflow-x: hidden; overflow-y: auto; display: grid; grid-template-columns: auto auto 1fr auto; grid-row-gap: 0.2rem; }" +
			"#confusionGuesserOverlay_.noOverlay #guesses_ { max-height: initial; overflow-y: auto; }" +
			"#confusionGuesserOverlay_.hideRatings #guesses_ > a > *:last-child { display: none; }" +
			"#confusionGuesserOverlay_.hideTypes #guesses_ > a::before { display: none; }" +
			"#confusionGuesserOverlay_.hideTypes #guesses_ > a > *:first-child { border-radius: 0.5rem 0 0 0.5rem; }" +
			"#guesses_ > a { display: contents; color: var(--text); text-decoration: none; --type: '?' }" +
			"#guesses_ > a.onyomionyomi     { --gc: var(--onon); --type: 'on⬄on' }" +
			"#guesses_ > a.onyomikunyomi    { --gc: var(--onkun); --type: 'on⬄kun' }" +
			"#guesses_ > a.kunyomionyomi    { --gc: var(--kunon); --type: 'kun⬄on' }" +
			"#guesses_ > a.kunyomikunyomi   { --gc: var(--kunkun); --type: 'kun⬄kun' }" +
			"#guesses_ > a.nanorionyomi     { --gc: var(--naon); --type: 'na⬄on' }" +
			"#guesses_ > a.nanorikunyomi    { --gc: var(--nakun); --type: 'na⬄kun' }" +
			"#guesses_ > a.onyominanori     { --gc: var(--onna); --type: 'on⬄na' }" +
			"#guesses_ > a.kunyominanori    { --gc: var(--kunna); --type: 'kun⬄na' }" +
			"#guesses_ > a.nanorinanori     { --gc: var(--nana); --type: 'na⬄na' }" +
			"#guesses_ > a.onyomiundefined  { --gc: var(--special); --type: 'on⬄special' }" +
			"#guesses_ > a.kunyomiundefined { --gc: var(--special); --type: 'kun⬄special' }" +
			"#guesses_ > a.nanoriundefined  { --gc: var(--special); --type: 'na⬄special' }" +
			"#guesses_ > a.visuallySimilar  { --gc: var(--vissim); --type: '丸⬄九' }" +
			"#guesses_ > a.radical          { --ic: var(--radical-color, #00AAFF); }" +
			"#guesses_ > a.kanji            { --ic: var(--kanji-color, #FF00AA); }" +
			"#guesses_ > a.vocabulary       { --ic: var(--vocabulary-color, #AA00FF); }" +
			"#guesses_ > a > *, #guesses_ > a::before { display: flex; align-items: center; padding: 0.2rem 0.5rem; }" +
			"#guesses_ > a > *:first-child { display: initial; grid-column: 2; }" +
			"#guesses_ > a::before { content: var(--type); border-radius: 0.5rem 0 0 0.5rem; color: rgba(255, 255, 255, 0.3); grid-column: 1; }" +
			"#guesses_ > a > *:last-child, #confusionGuesserOverlay_.hideRatings #guesses_ > a > *:nth-last-child(2) { border-radius: 0 0.5rem 0.5rem 0; justify-content: flex-end; border-right: solid var(--ic); }" +
			"#guesses_ svg, #guesses_ ruby img { width: 1em; fill: none; stroke: currentColor; stroke-width: 85; stroke-linecap: square; stroke-miterlimit: 2; transform: translateY(0.15em); }" +
			"#guesses_ > a.show svg, #guesses_ > a.show ruby img { filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.4)); }" +
			colour_setup +
			"#guesses_ > button_ { grid-column: 1 / -1; padding: 0.5rem; color: rgba(255, 255, 255, 0.3); background: none; border: thin dashed rgba(255, 255, 255, 0.3); border-radius: 0.2rem; --gc: var(--vissim); }" +
			"#guesses_ > button_.show { border: none; }" +
			"#guesses_ > button_ + a { display: none; }" +
			"#confusionGuesserOverlay_ > div > input { display: none; }" +
			"#confusionGuesserOverlay_ > div > label { position: absolute; top: 0; right: 25px; background-color: var(--page-background, white); width: 1.4rem; line-height: 1.4rem; text-align: center; border-radius: 0.3rem; font-weight: bold; cursor: pointer; font-size: large; }" +
			"#confusionGuesserOverlay_.noOverlay > div > label { border: solid thin rgba(0, 0, 0, 0.4); }" +
			"#confusionGuesserOverlay_ > div > :checked + label { display: none }" +
			"#confusionGuesserOverlay_ > div > :checked ~ #guesses_ > a:not(.show) > *, :checked ~ #guesses_ > a:not(.show)::before, #confusionGuesserOverlay_ > div > :checked ~ #guesses_ > button_:not(.show) { display: none; }" +
			"#confusionGuesserOverlay_ > button_ { position: absolute; right: 0; top: 2rem; width: 20px; height: 8rem; background: linear-gradient(to left, rgba(0,0,0,0.2), transparent); border: none; color: var(--text); pointer-events: initial; overflow: hidden; }" +
			"#confusionGuesserOverlay_ > button_::before { content: ''; position: absolute; right: 6px; width: 0; height: 0; border: 8px solid transparent; border-right-color: var(--text); }" +
			"#confusionGuesserOverlay_.noOverlay > div.collapsed { display: none; }" +
			"#confusionGuesserOverlay_.noOverlay > button_ { position: relative; top: 0; width: 100%; height: 20px; background: none; }" +
			"#confusionGuesserOverlay_.noOverlay > button_::before { top: 7px; right: initial; border-right-color: transparent; border-top-color: var(--text-color, #a2a2a2); }" +
			"#hotkeys tr.disabled { display: none; }" +
			"#confusionguesser_showThreshold#confusionguesser_showThreshold { width: calc(100% - 3em); }" +                                                  // double id selector for higher specificity
			"#confusionguesser_showThreshold#confusionguesser_showThreshold + label { width: 3em; line-height: 2em; float: right; text-align: right; }" +    // to win against default styling
			"#wkofs_confusionguesser .hidden { display: none; }" +
			"@media (max-width: 767px) {" +
			" #confusionGuesserOverlay_ { position: relative; top: 0; margin-top: 3rem; min-height: initial; }" +
			" #confusionGuesserOverlay_ > div { background-color: rgba(0, 0, 0, 0.4); padding-left: 0.7rem; }" +
			" #confusionGuesserOverlay_ #guesses_ { max-height: initial; overflow-y: auto; }" +
			" #confusionGuesserOverlay_ > div > label { border: solid thin rgba(0, 0, 0, 0.4); }" +
			" #confusionGuesserOverlay_ > div.collapsed { display: none; }" +
			" #confusionGuesserOverlay_ > button_ { position: relative; top: 0; width: 100%; height: 20px; background: none; }" +
			" #confusionGuesserOverlay_ > button_::before { top: 7px; right: initial; border-right-color: transparent; border-top-color: var(--text-color, #a2a2a2); }" +
			"}" +
			// firefox workaround (otherwise shrinks grid width when scrollbar appears, leading to line breaks in the cells)
			"@-moz-document url-prefix() { #guesses_ { overflow-y: scroll; } }";
    let styleElement_ = document.getElementById("style_");
    if(!styleElement_){
      console.log("creating new styleElement_");
      let sCss_ = document.createElement("style");
      let tCss_ = document.createTextNode(cssA);
      sCss_.appendChild(tCss_);
      sCss_.id = "style_";
      document.head.appendChild(sCss_);
  	} else {
      console.log("editing existing styleElement_");
      styleElement_.innerHTML = cssA;
    }
	}
	
	
	function removeidfromarray(id){
		let targetId = id;

		for (let i = 0; i < levels.length; i++) {
		  for (let j = 0; j < levels[i].length; j++) {
			if (levels[i][j] === targetId) {
			  // Remove the target ID from the inner array
			  levels[i].splice(j, 1);
			  // Break out of both loops
			  i = levels.length;
			  break;
			}
		  }
		}

		console.log(`removed id ${id} from array, new array:`);
		let logMessage = "Lengths of all 60 levels: ";

	levels.forEach((levelArray, index) => {
		logMessage += `Level ${index + 1}: ${levelArray.length}, `;
	});

	// Remove the last comma and space
	logMessage = logMessage.slice(0, -2);

console.log(logMessage);
	}
	
  
  async function dothing(id = -1){
  	allReviews = [];
    //levels.fill(0);
    //console.log(`inlevel_init should be 0: ${levels}`);
	if(id == -1){
		console.log("init_fetchReviews now (await)");
		await init_fetchReviews();
	} else {
		console.log(`removeid (${id}) now (await)`);
		await removeidfromarray(id);
	}
    console.log(`inlevel_init: ${inlevel_init}`);
    console.log(`all: ${all}`);
    console.log(`new all: ${allReviews.length}`);
  	await fillcolour();
    await sleep(1000);
  	await installCss_();
  }
  
  //Start
  
  console.log("dothing now (await)");
  await dothing();
  console.log("fillcolour now (await)");
  await fillcolour();
  
  //Mid

window.addEventListener('didCompleteSubject', e => dothing(e.detail.subjectWithStats.subject.id));
  
  /*
window.addEventListener('didCompleteSubject', (event) => {
    window.wkItemInfo.notify((id) => {
        //const currentTime = new Date().getTime();
        //const timeDifference = currentTime - startTime;

        // Convert the time difference from milliseconds to seconds
        //const timeDifferenceInSeconds = timeDifference / 1000;

        //if (timeDifferenceInSeconds > 20) {
            //console.log('More than 20 seconds have passed, continuing.');
            //const subjectId = event.detail.subjectId;
            //updateLevelCounts(subjectId);
            console.log("eventListener");
            console.log("dothing now");
            dothing(id.id);
            console.log(event, id);
            startTime = new Date().getTime();
        //} else {
        //    console.log('Less than 20 seconds have passed.');
        //}
        //dothething(event, id); // can use both id and event here
    });
});*/


})();

