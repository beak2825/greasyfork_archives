// ==UserScript==
// @name         Mathway spammer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  spams your equation on mathway >:)
// @author       Kur0
// @match        https://www.mathway.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathway.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450923/Mathway%20spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/450923/Mathway%20spammer.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var waitingTime = 1000;
	var mybutton = document.createElement("button");
	document.querySelector("#top-menu > div > div.left-side").appendChild(mybutton);
	var myinput = document.createElement("input");
	document.querySelector("#top-menu > div > div.left-side").appendChild(myinput);
	myinput.size = "1";
	myinput.value = "1";
	myinput.style.textAlign = "center";
	myinput.onclick = function() {
		event.stopPropagation();
	};
	mybutton.textContent = "GO!";

	function waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				} else if (document.querySelector('#topics-inner')) {
					document.querySelector("body > div.popup-container.popup-style-collapse.popup-no-padding.popup-on > div > div.popup-title > div.popup-close").click();
					document.querySelector("#editor-outer > div.editor-buttons > button.enabled").click();
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	function waitForBtn(selector) {
		return new Promise(resolve => {

			const observer = new MutationObserver(mutations => {
				for (var i = 0; i < mutations.length; ++i) {
					for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
						if (mutations[i].addedNodes[j].className == 'ch-bubble rendered') {
							var children = mutations[i].addedNodes[j].children;
							for (var k = 0; k < children.length; ++k) {
								if (children[k].className == 'ch-bubble-remote') {
									if (children[k].querySelector(".ch-bubble-border > .ch-bubble-action") != null) {
										console.log("yes bubbl-action");
										resolve(children[k].querySelector(".ch-bubble-border > .ch-bubble-action"));
									} else {
										console.log("not bubbl-action");
									}
								}
							}
						}
					}
				}
			});

			observer.observe(document.querySelector(selector), {
				childList: true,
				subtree: false,
			});
		});
	}

	function theLoop() {
		var clickables = document.querySelectorAll("#chat-inner > div > div.ch-bubble-local > div.clickable");
		var clickable = clickables[clickables.length - 1];
		clickable.click();
		document.querySelector("#editor-outer > div.editor-buttons > button.enabled").click();
		waitForElm('#topics-inner > div > div:nth-child(2)').then((elm) => {
			document.querySelector(`#topics-inner > div > div:nth-child(${myinput.value})`).click();
		});
		waitForBtn('#chat-inner').then((elm) => {
			try {
				console.log(`elm is...`);
				console.log(elm);
				if (elm.textContent == 'Tap to view FREE steps...') {
					console.log("FREEEEEEEEEEEEE");
				} else {
					console.log("not free :(");
					setTimeout(theLoop, waitingTime);
				}
			} catch (err) {
				console.log(err.message);
			}
		});
	}

	mybutton.onclick = function() {
		theLoop();
		event.stopPropagation();
	};
})();