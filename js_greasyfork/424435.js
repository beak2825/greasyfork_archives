// ==UserScript==
// @name         WaniKani Hint Button
// @namespace    wk-showhint
// @version      1.0
// @description  Button that shows a part of the answer when hovered and shows more when clicked.
// @author       Jiftoo
// @include      http://www.wanikani.com/review/session*
// @include      https://www.wanikani.com/review/session*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/424435/WaniKani%20Hint%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/424435/WaniKani%20Hint%20Button.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
	"use strict";

	const $ = unsafeWindow.$;
	if (!$) {
		throw new Error("jquеry's $ is not defined. Hint button is disabled.");
	}
	if (!CSS.supports("display", "flex")) {
		throw new Error("Flexbox is not supported. Hint button is disabled.");
	}

	const buttonList = document.querySelector("#additional-content > ul");

	const textSpan = document.createElement("span");
	textSpan.id = "hint-option-span";
	textSpan.innerText = "Hover for hint";
	textSpan.title = "pog";
	const setHint = (str) => {
		textSpan.title = str;
	};

	const templateItem = buttonList.children[0].cloneNode();
	templateItem.id = "option-hint";
	templateItem.appendChild(textSpan);
	const hintCallback = (ev) => {
		// 'text-span' doesn't work; currentTarget only works when called as callback.
		const hintEl = textSpan; //document.getElementById("hint-option-span");

		const advanceHint = (hint) => {
			// Increment hint advance by one or set it to one
			// Attribute converted to number using +(...)
			// 'data-adv' can't be null because it's set to '0' in 'resetHintSpan'
			console.assert(hintEl.getAttribute("data-adv") !== null);
			const nextAdv = +hintEl.getAttribute("data-adv") + 1;
			hintEl.setAttribute("data-adv", nextAdv);

			const hintSlice = hint.slice(0, nextAdv);
			setHint(`${hintSlice}${hintSlice.length !== hint.length ? "..." : ""}`);
		};
		// Wanikani uses it internally.
		const {rad, kan, voc, en, kana, emph, on, kun} = $.jStorage.get("currentItem");
		const firstEn = en[0];
		const type = $.jStorage.get("questionType");
		if (type === "reading") {
			if (rad) {
				advanceHint(rad);
			} else if (kan) {
				if (emph === "onyomi") {
					advanceHint(on[0]);
				} else {
					// kunyomi
					advanceHint(kun[0]);
				}
			} else if (voc) {
				advanceHint(kana[0]);
			}
		} else {
			// It must be 'meaning'
			advanceHint(firstEn);
		}
	};
	const resetHintSpan = () => {
		textSpan.setAttribute("data-adv", 0);
		hintCallback();
	};

	templateItem.onclick = hintCallback;
	buttonList.appendChild(templateItem);

	// Reset hint when submitting
	// Set a small timeout to let the old item update before getting values for hint
	const resetCallback = (ev) => {
		if (ev === undefined || ev.key === "Enter") {
			setTimeout(() => resetHintSpan(), 50);
		}
	};
	const keyListenerFix = ({code}) => {
		if (code === "Enter") {
			resetCallback();
		}
	};
	document.querySelector("#user-response ~ button").addEventListener(
		"click",
		() => {
			resetCallback();
		},
		true
	);
	$(document).on("keydown.reviewScreen", resetCallback);

	GM_addStyle(`#additional-content ul {display: flex; justify-content: space-around;}`);
	GM_addStyle(`#additional-content ul li {width: 0 !important; flex-grow: 1;}`);

	// Observe loading screen style to detect loading
	let loadingScreen = document.getElementById("loading");
	let observer = new MutationObserver((mutations) => {
		for (let mutation of mutations) {
			if (mutation.type == "attributes" && mutation.target.style.display === "none") {
				console.log("finished loading!");

				// Initialise first hint.
				resetHintSpan();

				observer.disconnect();
				observer = undefined;
				break;
			}
		}
	});
	observer.observe(loadingScreen, {
		attributes: true,
	});
})();
