// ==UserScript==
// @name         Trade Chat Timer
// @namespace    https://www.torn.com/profiles.php?XID=1936821
// @version      2.0
// @description  Show a timer that shows the time left to post next message.
// @author       TheFoxMan
// @owner        Phillip_J_Fry [2184575]
// @license      Apache License 2.0 
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482247/Trade%20Chat%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/482247/Trade%20Chat%20Timer.meta.js
// ==/UserScript==

const STORAGE_KEY = "localStorage__Trade_Chat_Timer__Do_Not_Edit";

if (!Document.prototype.find)
	Object.defineProperties(Document.prototype, {
		find: {
			value(selector) {
				return document.querySelector(selector);
			},
			enumerable: false
		},
		findAll: {
			value(selector) {
				return document.querySelectorAll(selector);
			},
			enumerable: false
		}
	});

if (!Element.prototype.find)
	Object.defineProperties(Element.prototype, {
		find: {
			value(selector) {
				return this.querySelector(selector);
			},
			enumerable: false
		},
		findAll: {
			value(selector) {
				return this.querySelectorAll(selector);
			},
			enumerable: false
		}
	});

async function waitFor(sel, parent = document) {
	return new Promise((resolve) => {
		const intervalID = setInterval(() => {
			const el = parent.find(sel);
			if (el) {
				resolve(el);
				clearInterval(intervalID);
			}
		}, 500);
	});
}

(async () => {
	await waitFor("head style");

	document.head.insertAdjacentHTML("beforeend", `<style>
	#chatRoot [class*="minimized-menu-item__"][title="Trade"]::after,
	#chatRoot [class*='minimized-menus__mobile-wrapper__']::after {
		content: "NL";
		background-color: yellow;
		padding: 5px;
		position: absolute;
		top: 5px;
		color: white;
	}

	#chatRoot [class*="minimized-menu-item__"][title="Trade"].time-left::after,
	#chatRoot [class*='minimized-menus__mobile-wrapper__'].time-left::after {
		content: attr(data-time-left);
		background-color: red;
	}

	#chatRoot [class*="minimized-menu-item__"][title="Trade"].time-complete::after,
	#chatRoot [class*='minimized-menus__mobile-wrapper__'].time-complete::after {
		content: "OK";
		background-color: green;
	}
	</style>`);

	let mobile = false;
	let tradeChatButton = await waitFor("#chatRoot [class*='minimized-menu-item__'][title='Trade']");
	let mobileTradeButton = document.find("#chatRoot [class*='minimized-menus__mobile-wrapper__']");
	if (mobileTradeButton.computedStyleMap().get("display").value !== "none")
		mobile = true;
	// let tradeChatIcon = tradeChatButton.find("svg");

	let tradeChat;

	if (tradeChatButton.className.includes("minimized-menu-item--open__")) {
		tradeChat = await getTradeChat();
		tradeChat.find("textarea").addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				window.localStorage.setItem(STORAGE_KEY, Date.now());
			}
		});
	}

	(mobile ? mobileTradeButton : tradeChatButton).addEventListener("click", async () => {
		if (!tradeChatButton.className.includes("minimized-menu-item--open__"))
			tradeChat = await getTradeChat();
		if (!tradeChat) return;

		tradeChat.find("textarea").addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				window.localStorage.setItem(STORAGE_KEY, Date.now());
			}
		});
	});

	func();
	setInterval(func, 1000);

	/*tradeChatButton.addEventListener("click", async (e) => {
		if (!e.target.matches("#chatRoot [class*='_trade_1pskg_'] [class*='_chat-box-head_']")) return;

		tradeChatButton = await waitFor("#chatRoot [class*='_trade_1pskg_'] [class*='_chat-box-head_']");
		tradeChatIcon = tradeChatButton.find("i[class*='_icon_']");

		chatParent = tradeChatButton.closest("#chatRoot [class*='_chat-box_'][class*='_trade_']");
	});*/

	function func() {
		if (!window.localStorage.getItem(STORAGE_KEY))
			window.localStorage.setItem(STORAGE_KEY, Date.now());

		const timestamp = parseInt(window.localStorage.getItem(STORAGE_KEY));
		if (timestamp > 0) {
			const timeLeft = Math.floor(60 - ((Date.now() - timestamp) / 1000));
			const button = mobile ? mobileTradeButton : tradeChatButton;
			if (timeLeft > 0) {
				button.classList.remove("time-complete");
				button.classList.add("time-left");
				button.setAttribute("data-time-left", timeLeft);
			} else {
				button.classList.add("time-complete");
				button.classList.remove("time-left");
				button.setAttribute("data-time-left", 0);
			}
		}
	}
})();

async function getTradeChat() {
	await waitFor("#chatRoot [class*='chat-box-header__']");

	return [...document.findAll("#chatRoot [class*='chat-box-header__']")]
			.filter(x => x.textContent === "Trade")
			.map(x => x.closest("[class*='chat-box__']"))?.[0];
}