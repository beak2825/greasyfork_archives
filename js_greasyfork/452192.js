// ==UserScript==
// @name        Universal Emoji & Kaomoji
// @namespace   https://github.com/lmssieh/universal-emoji
// @match       *://*/*
// @grant       none
// @version     0.1
// @author      lmssieh
// @description quickly insert emojis or kaomojis when writing in any textarea/input
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452192/Universal%20Emoji%20%20Kaomoji.user.js
// @updateURL https://update.greasyfork.org/scripts/452192/Universal%20Emoji%20%20Kaomoji.meta.js
// ==/UserScript==

(function () {
	let emojis = {};
	let kaomojis = {};

	let urls = [
		"https://raw.githubusercontent.com/lmssieh/universal-emoji/main/assets/emojis.json",
		"https://raw.githubusercontent.com/lmssieh/universal-emoji/main/assets/kaomojis.json",
	];
	let promiseUrls = urls.map((url) => fetch(url));

	Promise.all(promiseUrls)
		.then((responses) => Promise.all(responses.map((r) => r.json())))
		.then((data) => {
			emojis = { ...data[0] };
			kaomojis = data[1];
			console.log(emojis, kaomojis);
		})
		.then(main);

	function main() {
		function replaceText(str) {
			console.log(str);
			let newStr = str;
			// emoji regex, find anything inside colons, ex: :rooster:
			const regex = /(\:[\w\s]+\:)/g;
			let m;
			while ((m = regex.exec(str)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (m.index === regex.lastIndex) {
					regex.lastIndex++;
				}

				// The result can be accessed through the `m`-variable.
				m.forEach((match, groupIndex) => {
					const formateEmojiName = match.substr(1, match.length - 2);
					console.log(formateEmojiName, emojis[formateEmojiName]);
					if (!emojis[formateEmojiName]) return;
					const emoji = emojis[formateEmojiName].emoji;
					newStr = newStr.replace(match, `${emoji}`);
				});
			}

			// kaomoji regex, find a word after /slash, ex: /dab
			const kregex = /(\/[^ \/]+)/g;
			let mk;

			while ((mk = kregex.exec(str)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (mk.index === kregex.lastIndex) {
					kregex.lastIndex++;
				}

				// The result can be accessed through the `m`-variable.
				mk.forEach((match, groupIndex) => {
					const formatedKaomoji = match
						.substr(1, match.length - 1)
						.split("_")
						.join(" ");
					const kaomoji = kaomojis[formatedKaomoji];
					if (!kaomoji) return;
					newStr = newStr.replace(match, `${kaomoji}`);
				});
			}
			return newStr;
		}

		let debounce = null;
		document.addEventListener("keyup", ({ target }) => {
			if (
				target.tagName === "TEXTAREA" ||
				(target.tagName === "INPUT" && target.type === "text")
			) {
				clearTimeout(debounce);
				debounce = setTimeout(() => {
					target.value = replaceText(target.value);
				}, 100);
			}
		});
	}
})();