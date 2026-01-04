// ==UserScript==
// @name         YouTube REMOVE CAPS FROM VIDEOS TITLES
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.3.2
// @description  Removes THE SCREAMING TEXT from videos titles if ((the {MinCapsPercent}% of words are CAPSED) {or/and} (CAPSED word contains at least {MinCapsLetters}))
// @author       Титан
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=198809
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445780/YouTube%20REMOVE%20CAPS%20FROM%20VIDEOS%20TITLES.user.js
// @updateURL https://update.greasyfork.org/scripts/445780/YouTube%20REMOVE%20CAPS%20FROM%20VIDEOS%20TITLES.meta.js
// ==/UserScript==

(function() {
	'use strict';

	/*↓ SETTINGS ↓*/
	let MinCapsPercent = .50; // How many % of the word should be capsed for triggering uncaps func. Set 0 to make this check always pass and 1.00 to always fall
	let MinCapsLetters = 5; // Set 0 to make this check always pass and -1 to always fall
	let OR = true; // set false for AND

	// DEV (not for users)
	let debug = false // send all titles changes to the console
	let debugColorize = false // colorize changed text
	/*↑ SETTINGS ↑*/

	document.arrive("#video-title", {fireOnAttributesModification: true},
		titleElement => removeCapsFromElement(titleElement, "preview")
	)

	document.arrive("#container > h1 > yt-formatted-string", {fireOnAttributesModification: true},
		currentVideoTitle => {
			removeCapsFromElement(currentVideoTitle, "current video");
			setTimeout(() => handleTitleChange(), 1000)
		}
	)

	// all of them executes before full page load
//	window.addEventListener('load', handleTitleChange("load"));
//	window.addEventListener('load', () => window.requestAnimationFrame(handleTitleChange.bind(null, "requestAnimationFrame")));
//	window.addEventListener('title', handleTitleChange("title"));

	function handleTitleChange(event = "") {
			let newText = removeCapsFromText(document.title) //can be optimized for not doublecheck
		if (newText === document.title) {

			return
		}

		if (debug) console.log(`PAGE NAME (${event}): ${document.title} → ${newText}`)
		document.title = newText
	}

	function removeCapsFromElement(element, debugText) {
		if (isNullOrEmpty(element.textContent)) return
		let newText = removeCapsFromText(element.textContent)
		let pervText = element.textContent
				if (debug) {
					let eq = newText === pervText;
					console.log(`${debugText}: ${pervText} → ${eq? "UNCHANGED" : newText}`)
				}
				if (debugColorize)
					element.innerHTML = colorizeChanges(newText, pervText)
				else
		element.textContent = newText
	}

	/**
	 * Removes caps from text.
	 * @param {string} str - input text
	 * @return {boolean} - returns a string in which all words, except for certain ones, are written in lowercase, and the first letter of each sentence is uppercase
	 */

	function tooMuchCaps(words) {
		let wordsCount = words.length
		let caps = 0;
		for(let word of words) {
			if(word === word.toUpperCase())
				if (word === word.toLowerCase()) // Not a word
					wordsCount--;
				else
				caps++;

		}
		return caps/wordsCount >= MinCapsPercent;
	}

	/**
	 * Removes caps from text.
	 * @param {string} str - input text
	 * @return {string} - returns a string in which all words, except for certain ones, are written in lowercase, and the first letter of each sentence is uppercase
	 */

	function removeCapsFromText(str) {
		let words = str.split(' ');
		let muchCaps = tooMuchCaps(words)
		if ((!muchCaps && !OR)) return str; // if tooMuchCaps is false and operator is "and", no sense to check other conditions
 		let newWords = [];
		for(let word of words) {
			if((word == word.toUpperCase() && OR? enoughLetters(word) || muchCaps : enoughLetters(word) && muchCaps) )

				newWords.push(word.toLowerCase());
			else newWords.push(word);
		}
		newWords = newWords.join(' ');
		return toUpperAfterDot(newWords);
	}

	const enoughLetters = (word) => (letterCount(word) >= MinCapsLetters || OR);

	function toUpperAfterDot(str, upFirstLetter = true) {
		let dotFound = upFirstLetter;
		let newStr = "";
		for(let letter of str) {
			if(dotFound) {
				let upLetter = letter.toUpperCase();
				if (upLetter!=letter.toLowerCase())  { // is letter check
					newStr += upLetter;
					dotFound = false
					continue;
				}
			}
			else if (letter == '.') dotFound = true;
			newStr+=letter;
		}
		return newStr;
	}

	function isLetter(letter) {
		return letter.toLowerCase() !== letter.toUpperCase();
	}

	function letterCount(word) {
		return [...word].reduce((acc, letter) => isLetter(letter) ? acc + 1 : acc, 0);
	}

	function colorizeChanges(str1, str2, color = 'red') {
		let output = '';
		for (let i = 0; i < str1.length || i < str2.length; i++) {
			if (str1[i] !== str2[i]) {
				output += `<span style="color:${color}">${str1[i] || ''}</span>`;
			} else {
				output += str1[i] || '';
			}
		}
		return output;
	}

	function isNullOrEmpty(str) {
		return !str || str.trim().length === 0;
	}
})();