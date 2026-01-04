// ==UserScript==
// @name         Anti Peony Defense
// @namespace    http://tampermonkey.net/
// @version      2025-08-21
// @description  Adds (Peony) to Peonys new name
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531793/Anti%20Peony%20Defense.user.js
// @updateURL https://update.greasyfork.org/scripts/531793/Anti%20Peony%20Defense.meta.js
// ==/UserScript==

(function() {
	const observers = {};
	function setObserver (selector, handler) {
		function checkSelector() {
			const el = document.querySelector(selector);
			if (el && (!observers[selector] || el != observers[selector].el)) {
				const observer = new MutationObserver(() => handler(el));
				observer.observe(el, { childList: true, subtree: true });
				if (!observers[selector]) {
					console.log(`Set observer for ` + selector);
					handler(el);
				} else {
					console.log(`Reset observer for ` + selector);
				}
				observers[selector] = { el, observer };
			}
			setTimeout(checkSelector, 1000);
		};

		checkSelector();
	}

	function renamePeony (el) {
		el.querySelectorAll(".Chat_chat__3DQkj .CharacterName_name__1amXp").forEach((el) => {
			if (el.textContent == currentName) {
				el.textContent = currentName + postfix;
			}
		})
	}

	setObserver(".Chat_chat__3DQkj .TabsComponent_tabPanelsContainer__26mzo .TabPanel_tabPanel__tXMJF", renamePeony);

	const peonyCharacterID = 114747;
	const postfix = "(Peony)"
	let currentName = "KaiseI";

	function handle (message) {
		if (message.type == "init_character_data") {
			//console.log(`Anti Peony Defense`, message);
			const peony = Object.entries(message.guildSharableCharacterMap).find(([characterID, g]) => characterID == peonyCharacterID);
            //console.log(peony);
			if (peony) {
				currentName = peony[1].name;
				console.log(`Anti Peony Defense: Peonys new name is "${currentName}"`);
			} else {
                console.log(`Anti Peony Defense: Can't find Peonys new name!`);
            }
		}
	}

	const OriginalWebSocket = window.WebSocket;
	const WrappedWebSocket = function (...args) {
		const ws = new OriginalWebSocket(...args)

		ws.addEventListener("message", function listener(e) {
			const message = JSON.parse(e.data);
			handle(message);

			// Once
			ws.removeEventListener("message", listener);
		});

		return ws;
	};
	window.WebSocket = WrappedWebSocket;
	console.log("Anti Peony Defense: wrapped window.WebSocket");
})();


