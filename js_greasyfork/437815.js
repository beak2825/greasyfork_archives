// ==UserScript==
// @name         Nitro - MOTD Offensive Filter Reason
// @version      1.2.0
// @description  Displays the possibly offensive word on MOTD using a dictionary of banned words.
// @author       Toonidy
// @match        *://*.nitrotype.com/team/*
// @match        *://*.nitromath.com/team/*
// @icon         https://i.ibb.co/YRs06pc/toonidy-userscript.png
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/858426
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1-beta.2/dexie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.1/papaparse.min.js
// @downloadURL https://update.greasyfork.org/scripts/437815/Nitro%20-%20MOTD%20Offensive%20Filter%20Reason.user.js
// @updateURL https://update.greasyfork.org/scripts/437815/Nitro%20-%20MOTD%20Offensive%20Filter%20Reason.meta.js
// ==/UserScript==

/* globals Dexie Papa */

let currentUser, authToken
try {
	currentUser = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user)
	authToken = localStorage.getItem("player_token")
} catch {
	console.error("Failed to parse NT User data")
	return
}

const canMOTD =
	currentUser?.tag &&
	["captain", "officer"].includes(currentUser.teamRole) &&
	window.location.pathname === `/team/${currentUser.tag}`
if (!canMOTD) {
	console.error("MOTD not available on team page")
	return
}

const DICTIONARY_URL =
	"https://docs.google.com/spreadsheets/d/1AiRty-2WFOPJiN1hp017g64_0u6-YhnPdxa6a3Enbak/export?gid=0&format=csv&id=1AiRty-2WFOPJiN1hp017g64_0u6-YhnPdxa6a3Enbak"

// Dictionary storage
const db = new Dexie("NTMOTDFilterTool")
db.version(1).stores({
	badWords: "word, userDefined",
})
db.open().catch(function (e) {
	console.error("Failed to open up the MOTD Filter database")
})

/////////////
//  Utils  //
/////////////

// https://github.com/dotcypress/runes#readme

const HIGH_SURROGATE_START = 0xd800
const HIGH_SURROGATE_END = 0xdbff

const LOW_SURROGATE_START = 0xdc00

const REGIONAL_INDICATOR_START = 0x1f1e6
const REGIONAL_INDICATOR_END = 0x1f1ff

const FITZPATRICK_MODIFIER_START = 0x1f3fb
const FITZPATRICK_MODIFIER_END = 0x1f3ff

const VARIATION_MODIFIER_START = 0xfe00
const VARIATION_MODIFIER_END = 0xfe0f

const DIACRITICAL_MARKS_START = 0x20d0
const DIACRITICAL_MARKS_END = 0x20ff

const ZWJ = 0x200d

const GRAPHEMS = [
	0x0308, // ( ◌̈ ) COMBINING DIAERESIS
	0x0937, // ( ष ) DEVANAGARI LETTER SSA
	0x0937, // ( ष ) DEVANAGARI LETTER SSA
	0x093f, // ( ि ) DEVANAGARI VOWEL SIGN I
	0x093f, // ( ि ) DEVANAGARI VOWEL SIGN I
	0x0ba8, // ( ந ) TAMIL LETTER NA
	0x0bbf, // ( ி ) TAMIL VOWEL SIGN I
	0x0bcd, // ( ◌்) TAMIL SIGN VIRAMA
	0x0e31, // ( ◌ั ) THAI CHARACTER MAI HAN-AKAT
	0x0e33, // ( ำ ) THAI CHARACTER SARA AM
	0x0e40, // ( เ ) THAI CHARACTER SARA E
	0x0e49, // ( เ ) THAI CHARACTER MAI THO
	0x1100, // ( ᄀ ) HANGUL CHOSEONG KIYEOK
	0x1161, // ( ᅡ ) HANGUL JUNGSEONG A
	0x11a8, // ( ᆨ ) HANGUL JONGSEONG KIYEOK
]

function runes(string) {
	if (typeof string !== "string") {
		throw new Error("string cannot be undefined or null")
	}
	const result = []
	let i = 0
	let increment = 0
	while (i < string.length) {
		increment += nextUnits(i + increment, string)
		if (isGraphem(string[i + increment])) {
			increment++
		}
		if (isVariationSelector(string[i + increment])) {
			increment++
		}
		if (isDiacriticalMark(string[i + increment])) {
			increment++
		}
		if (isZeroWidthJoiner(string[i + increment])) {
			increment++
			continue
		}
		result.push(string.substring(i, i + increment))
		i += increment
		increment = 0
	}
	return result
}

// Decide how many code units make up the current character.
// BMP characters: 1 code unit
// Non-BMP characters (represented by surrogate pairs): 2 code units
// Emoji with skin-tone modifiers: 4 code units (2 code points)
// Country flags: 4 code units (2 code points)
// Variations: 2 code units
function nextUnits(i, string) {
	const current = string[i]
	// If we don't have a value that is part of a surrogate pair, or we're at
	// the end, only take the value at i
	if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
		return 1
	}

	const currentPair = current + string[i + 1]
	let nextPair = string.substring(i + 2, i + 5)

	// Country flags are comprised of two regional indicator symbols,
	// each represented by a surrogate pair.
	// See http://emojipedia.org/flags/
	// If both pairs are regional indicator symbols, take 4
	if (isRegionalIndicator(currentPair) && isRegionalIndicator(nextPair)) {
		return 4
	}

	// If the next pair make a Fitzpatrick skin tone
	// modifier, take 4
	// See http://emojipedia.org/modifiers/
	// Technically, only some code points are meant to be
	// combined with the skin tone modifiers. This function
	// does not check the current pair to see if it is
	// one of them.
	if (isFitzpatrickModifier(nextPair)) {
		return 4
	}
	return 2
}

function isFirstOfSurrogatePair(string) {
	return string && betweenInclusive(string[0].charCodeAt(0), HIGH_SURROGATE_START, HIGH_SURROGATE_END)
}

function isRegionalIndicator(string) {
	return betweenInclusive(codePointFromSurrogatePair(string), REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END)
}

function isFitzpatrickModifier(string) {
	return betweenInclusive(codePointFromSurrogatePair(string), FITZPATRICK_MODIFIER_START, FITZPATRICK_MODIFIER_END)
}

function isVariationSelector(string) {
	return (
		typeof string === "string" &&
		betweenInclusive(string.charCodeAt(0), VARIATION_MODIFIER_START, VARIATION_MODIFIER_END)
	)
}

function isDiacriticalMark(string) {
	return (
		typeof string === "string" &&
		betweenInclusive(string.charCodeAt(0), DIACRITICAL_MARKS_START, DIACRITICAL_MARKS_END)
	)
}

function isGraphem(string) {
	return typeof string === "string" && GRAPHEMS.indexOf(string.charCodeAt(0)) !== -1
}

function isZeroWidthJoiner(string) {
	return typeof string === "string" && string.charCodeAt(0) === ZWJ
}

function codePointFromSurrogatePair(pair) {
	const highOffset = pair.charCodeAt(0) - HIGH_SURROGATE_START
	const lowOffset = pair.charCodeAt(1) - LOW_SURROGATE_START
	return (highOffset << 10) + lowOffset + 0x10000
}

function betweenInclusive(value, lower, upper) {
	return value >= lower && value <= upper
}

const multibyteLength = (text) => {
	return new TextEncoder().encode(text).length
}

//////////////////
//  Components  //
//////////////////

/** Styles for the following components. */
const style = document.createElement("style")
style.appendChild(
	document.createTextNode(`
.nt-motd-reason {
    margin-top: 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    padding: 10px;
    background-color: #333;
}
.nt-motd-reason.empty {
    display: none;
}
.nt-motd-reason-body {
    display: flex;
    flex-flow: row wrap;
	padding: 1rem;
    background-color: white;
    border-radius: 5px;
	font-family: "Roboto Mono", "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
    font-size: 12px;
}
.nt-motd-reason-word {
    display: flex;
    margin-right: 1ch;
}
.nt-motd-reason.disabled .nt-motd-reason-letter {
    cursor: default;
}
.nt-motd-reason .nt-motd-reason-letter {
    color: rgba(0, 0, 0, 0.3);
}
.nt-motd-reason-letter.offensive {
    color: #e00;
    font-weight: 600;
}
.nt-motd-reason-helper {
    color: #acacac;
}
.nt-motd-reason-submit {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
.nt-motd-reason-errors {
    border: 1px solid #D62F3A;
    border-radius: 5px;
    padding: 10px;
    background-color: rgba(214, 47, 58, 0.5);
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    font-style: italic;
}
.nt-motd-reason-error-validation {
    margin-bottom: 0;
}
.nt-motd-reason-error-bad-words {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}
.nt-motd-reason-error-bad-words ul {
    margin-bottom: 0;
}
.nt-motd-reason-error-bad-words.has-invalid-form {
    margin-top: 20px;
}`)
)
document.head.appendChild(style)

/** Offensive Word Dictionary. */
const OffensiveWordDictionary = ((dictionaryURL) => {
	let loadError = null,
		loading = false,
		badWords = []

	/** Grabs list of offensive words from the dictionary. */
	const load = (init) => {
		// Load dictionary
		if (dictionaryURL) {
			loading = true
			return fetch(dictionaryURL)
				.then((resp) => {
					if (!resp.ok) {
						throw new Error("invalid response from dictionary url")
					}
					return resp.text()
				})
				.then((resp) => {
					const parsedCSV = Papa.parse(resp)
					if (parsedCSV.data.length > 1) {
						badWords = parsedCSV.data
							.slice(1)
							.filter((row) => !!row[0])
							.map((row) => row[0])
					}
					if (badWords.length > 0) {
						db.badWords
							.bulkPut(badWords.map((word) => ({ word, userDefined: false })))
							.then(() => console.info("MOTD Offensive Dictionary updated"))
					}
				})
				.catch((err) => {
					console.error("Unable to fetch dictionary (fallback offline)", err)
					loadError = err
					if (init) {
						return db.badWords.each((badWord) => {
							badWords = badWords.concat(badWord.word)
						})
					}
				})
				.finally(() => {
					loading = false
				})
		}

		// No dictionary? why?
		loadError = "Offensive Word Dictionary is required, please provide URL to listed words in CSV format."
		console.warn(loadError)
		if (init) {
			return db.badWords.each((badWord) => {
				badWords = badWords.concat(badWord.word)
			})
		}
	}
	load(true)

	/** Gets list of offensive words found in dictionary. */
	const findBadWords = (textRunes) => {
		let outputBadWords = [],
			outputBadLetters = []
		badWords.forEach((word) => {
			const wordChunks = runes(word)
			for (let i = 0; i < textRunes.length; i++) {
				if (textRunes[i].toLowerCase() === wordChunks[0].toLowerCase()) {
					let matched = [i],
						wordIndex = 1,
						j = i + 1
					for (; j < textRunes.length && wordIndex < wordChunks.length; j++) {
						const checkLetter = textRunes[j].toLowerCase(),
							offensiveLetter = wordChunks[wordIndex].toLowerCase()
						if (checkLetter === offensiveLetter) {
							matched = matched.concat(j)
							wordIndex++
							continue
						}
						if (
							checkLetter === null ||
							(/[0-9]/.test(checkLetter) && !/^[0-9]+$/.test(word)) ||
							(!/[a-z0-9]/i.test(checkLetter) &&
								!/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(
									checkLetter
								))
						) {
							// Ignore punctuation, spacing or unmatched numbers
							// Examples:
							// std = past 7 days
							// g00k = pog 100k
							continue
						}
						matched = []
						break
					}
					if (matched.length === wordChunks.length) {
						if (!outputBadWords.includes(word)) {
							outputBadWords = outputBadWords.concat(word)
						}
						for (const c of matched) {
							if (!outputBadLetters.includes(c)) {
								outputBadLetters = outputBadLetters.concat(c)
							}
						}
					}
				}
			}
		})
		return [outputBadWords, outputBadLetters]
	}

	return {
		loading,
		loadError,
		badWords,
		findBadWords,
		load,
	}
})(DICTIONARY_URL)

/** UI Interface that allows users to select a fragment of the MOTD to check for offensive words. */
const MOTDReviewUI = ((dictionary) => {
	const root = document.createElement("div"),
		textReview = document.createElement("div"),
		validationError = document.createElement("div"),
		badWordsError = document.createElement("div"),
		submitContainer = document.createElement("div")
	root.classList.add("nt-motd-reason", "empty")

	validationError.classList.add("nt-motd-reason-errors", "nt-motd-reason-error-validation")
	validationError.style.display = "none"
	validationError.innerHTML = `You must at select at least one text.`

	badWordsError.classList.add("nt-motd-reason-errors", "nt-motd-reason-error-bad-words")
	badWordsError.style.display = "none"
	badWordsError.innerHTML = `<p>The following words are possibly offensive:</p><ul></ul>`

	submitContainer.classList.add("nt-motd-reason-submit")
	submitContainer.innerHTML = `<small class="nt-motd-reason-helper">This script only has a limited set of offensive words.</small>
     <div><button class="btn btn--compact2 btn--xs btn--secondary" type="button" title="Refresh Dictionary">Refresh Dictionary</button></div>`

	const badWordsContainer = badWordsError.querySelector(".nt-motd-reason-error-bad-words ul"),
		refreshDictionaryButton = submitContainer.querySelector("button")

	let letters = [],
		letterNodes = [],
		badWords = []

	const reloadButtonClickHandler = () => {
		refreshDictionaryButton.disabled = true
		dictionary.load().then(() => {
			refreshDictionaryButton.disabled = false

			const [foundBadWords, badLetters] = dictionary.findBadWords(letters)
			textReview.querySelectorAll(".nt-motd-reason-letter").forEach((node) => {
				node.classList.remove("offensive")
			})
			badWords = foundBadWords
			badLetters.forEach((i) => {
				if (letterNodes[i]) {
					letterNodes[i].classList.add("offensive")
				}
			})
			refreshErrors(false)
		})
	}
	refreshDictionaryButton.addEventListener("click", reloadButtonClickHandler)

	// Output
	textReview.classList.add("nt-motd-reason-body")

	const refreshErrors = (invalidForm) => {
		if (!invalidForm && badWords.length === 0) {
			validationError.style.display = "none"
			badWordsError.style.display = "none"
			return
		}
		validationError.style.display = invalidForm ? "" : "none"
		badWordsError.style.display = badWords.length > 0 ? "" : "none"

		if (invalidForm) {
			badWordsError.classList.add("has-invalid-form")
		} else {
			badWordsError.classList.remove("has-invalid-form")
		}

		const badWordListTemplate = document.createElement("li"),
			fragment = document.createDocumentFragment()
		badWordListTemplate.classList.add("nt-motd-reason-error-item")
		while (badWordsContainer.firstChild) {
			badWordsContainer.removeChild(badWordsContainer.firstChild)
		}
		badWords.forEach((word) => {
			const node = badWordListTemplate.cloneNode()
			node.textContent = word
			fragment.append(node)
		})
		badWordsContainer.append(fragment)
	}

	const reset = (message) => {
		while (textReview.firstChild) {
			textReview.removeChild(textReview.firstChild)
		}
		if (!message) {
			root.classList.add("empty")
			return
		}

		badWords = []
		letterNodes = []
		letters = runes(message)
		refreshErrors(false)

		const [foundBadWords, badLetters] = dictionary.findBadWords(letters)
		badWords = foundBadWords

		const rootFragment = document.createDocumentFragment(),
			wordNodeTemplate = document.createElement("div"),
			letterNodeTemplate = document.createElement("div")
		wordNodeTemplate.classList.add("nt-motd-reason-word")
		letterNodeTemplate.classList.add("nt-motd-reason-letter")

		let wordFragment = document.createDocumentFragment(),
			wordFragmentEmpty = false

		for (let i = 0; i < letters.length; i++) {
			const char = letters[i]
			if (char === " ") {
				const wordRoot = wordNodeTemplate.cloneNode()
				wordRoot.append(wordFragment)
				rootFragment.append(wordRoot)
				wordFragment = document.createDocumentFragment()
				wordFragmentEmpty = true
				letterNodes = letterNodes.concat(null)
				continue
			}
			const letterNode = letterNodeTemplate.cloneNode()
			letterNode.textContent = char
			letterNode.dataset.letterindex = i
			if (badLetters.includes(i)) {
				letterNode.classList.add("offensive")
			}

			letterNodes = letterNodes.concat(letterNode)
			wordFragment.append(letterNode)
			wordFragmentEmpty = false
		}
		if (!wordFragmentEmpty) {
			const wordRoot = wordNodeTemplate.cloneNode()
			wordRoot.append(wordFragment)
			rootFragment.append(wordRoot)
		}
		refreshErrors(false)
		textReview.append(rootFragment)
		root.classList.remove("empty")
	}
	root.append(textReview, submitContainer, validationError, badWordsError)

	return {
		root,
		reset,
	}
})(OffensiveWordDictionary)

///////////////
//  Backend  //
///////////////

const errorObserver = new MutationObserver(([mutation]) => {
	if (mutation.addedNodes.length === 0) {
		return
	}

	const motd = document.querySelector(".modal textarea.input-field")
	if (!motd) {
		console.warn("Could not find MOTD input")
		return
	}

	const errorTextNode = mutation.addedNodes[0]
	if (!errorTextNode.textContent.startsWith("This contains words that are possibly offensive.")) {
		return
	}
	errorTextNode.textContent = "Message contains content that is possibly offensive. Let's review."
	MOTDReviewUI.reset(motd.value)
})

const modalObserver = new MutationObserver(([mutation]) => {
	for (const node of mutation.addedNodes) {
		if (node.classList?.contains("modal")) {
			errorObserver.observe(node.querySelector(".input-alert .bucket-content"), { childList: true })
			const form = node.querySelector("form"),
				target = node.querySelector("p.tss.tc-ts")
			if (!form || !target) {
				console.error("Failed to attach Word Reviewer")
				return
			}
			MOTDReviewUI.reset()
			form.insertBefore(MOTDReviewUI.root, target)
			break
		}
	}
})

modalObserver.observe(document.body, { childList: true })
