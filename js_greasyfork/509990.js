// ==UserScript==
// @name           Copy Wardle Guesses
// @namespace      https://github.com/w4tchdoge
// @version        1.0.1-20250616_022536
// @description    Copies a list of your Wardle guesses (spoilered for Discord) to your clipboard
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://wardlegame.com/*
// @grant          GM_setClipboard
// @grant          GM.setClipboard
// @grant          GM_registerMenuCommand
// @grant          GM.registerMenuCommand
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license        AGPL-3.0-or-later
// @history        1.0.0 — Add button to the share widget that lets you copy your guesses spoilered for discord. Attempt to make the script more compatible with the Single Page Application-ness of Wardle
// @history        0.0.3 — cleanup/redo guesses_arr and guesses_spoilers
// @history        0.0.2 — Initial git commit
// @downloadURL https://update.greasyfork.org/scripts/509990/Copy%20Wardle%20Guesses.user.js
// @updateURL https://update.greasyfork.org/scripts/509990/Copy%20Wardle%20Guesses.meta.js
// ==/UserScript==

(async function () {
	`use strict`;

	// modified from https://stackoverflow.com/a/61511955/11750206
	function waitForElmXPATH(xpathstr) {
		return new Promise(resolve => {
			if (document.evaluate(xpathstr, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
				return resolve(document.evaluate(xpathstr, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
			}

			const observer = new MutationObserver(mutations => {
				if (document.evaluate(xpathstr, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
					observer.disconnect();
					resolve(document.evaluate(xpathstr, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
				}
			});

			// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		});
	}

	function MAINfunk() {
		const guess_table = (() => {

			const elm_xp = `.//div[contains(concat(" ",normalize-space(@class)," ")," mb-2 ")]/parent::div[contains(concat(" ",normalize-space(@class)," ")," mt-2 ")][contains(@class,"w-11/12")]`;
			const elm = document.evaluate(elm_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			return elm;

		})();

		// guess_table;

		// let names_elm_arr = Array.from(guess_table.querySelectorAll(`div.vehicle-name`)).reverse();
		const names_txt_arr = Array.from(guess_table.querySelectorAll(`div[tooltip-data]:has(img[alt="Guessed vehicle"])`), elm => elm.getAttribute(`tooltip-data`).trim()).reverse();

		const nations_txt_arr = (() => {

			let txt_arr = [];
			const elm_arr = Array.from(guess_table.querySelectorAll(`span[class^="fi"]`)).reverse();

			elm_arr.forEach((elm, index, arr) => {

				const nation_code = elm.classList[1].slice(3);
				let nation_name;

				// ISO 3166-1 alpha3 codes from https://en.wikipedia.org/wiki/ISO_3166-1
				switch (nation_code) {
					case `it`:
						nation_name = `ITY`;
						break;

					case `jp`:
						nation_name = `JPN`;
						break;

					case `gb`:
						nation_name = `GBR`;
						break;

					case `de`:
						nation_name = `DEU`;
						break;

					case `se`:
						nation_name = `SWE`;
						break;

					case `us`:
						nation_name = `USA`;
						break;

					case `fr`:
						nation_name = `FRA`;
						break;

					case `ru`:
						nation_name = `RUS`;
						break;

					case `cn`:
						nation_name = `CHN`;
						break;

					case `il`:
						nation_name = `ISR`;
						break;

					default:
						throw new Error("ERROR: Unknown Nation Code!");
				}

				txt_arr.push(nation_name);

			});

			return txt_arr;

		})();

		if (names_txt_arr.length != nations_txt_arr.length) {
			throw new Error("ERROR: Size of nations array and names array do not match!");
		}

		// console.log(`Names arr length: ${names_txt_arr.length}\nNations arr length: ${nations_txt_arr.length}`);

		const guesses_arr = (() => {

			let output_arr = [];

			[...Array(names_txt_arr.length)].forEach((_, index) => {

				const input_obj = { guess_no: (index + 1), name: names_txt_arr.at(index), nation: nations_txt_arr.at(index) };
				output_arr.push(input_obj);

			});

			return output_arr;

		})();

		return guesses_arr;

	}

	function DiscordSpoilerGuessesToClipboard() {

		const guesses_arr = MAINfunk();
		const guesses_spoilers = (() => {

			let output_arr = [];

			guesses_arr.forEach((elm, index, arr) => {

				const spoiler_text = `${elm.guess_no}. ||${elm.name} **(${elm.nation})**||`;
				output_arr.push(spoiler_text);

			});

			return output_arr;

		})();
		const cliptext = `My guesses:\n${guesses_spoilers.join(`\n`)}`;
		GM.setClipboard(cliptext);
		console.log(`
Wardle Guesses have been copied to clipboard!
Guesses were copied in the Discord Spoilers format.
Clipboard should now be:

${cliptext}`);

	}

	const share_row = await waitForElmXPATH(`.//div[contains(concat(" ",normalize-space(@class)," ")," shareWidget ")]/div[contains(@class,"flex-row")][count(.//p[contains(concat(" ",normalize-space(@class)," ")," font-bold ")][contains(normalize-space(),SHARE)]) > 0]`);

	const userscript_share_row = Object.assign(share_row.cloneNode(false), {
		innerHTML: `<button class="flex flex-row items-center justify-center rounded-2xl bg-secondary-background p-3 text-text-color transition delay-100 duration-300 ease-in-out hover:scale-110 hover:bg-blue-600 md:p-4"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="mr-3 h-6 w-6 md:h-9 md:w-9 iconify iconify--mdi" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M7 7h10V5h2v14H5V5h2z"></path></svg><p class="font-bold tracking-wider md:text-lg">COPY GUESSES\n(DISCORD)</p></button>`
	});
	userscript_share_row.addEventListener(`click`, DiscordSpoilerGuessesToClipboard);

	share_row.after(userscript_share_row);

	GM.registerMenuCommand(`Copy Guesses to Clipboard`, DiscordSpoilerGuessesToClipboard);

})();
