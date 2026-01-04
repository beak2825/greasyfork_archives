// ==UserScript==
// @name         God's Execution Solution
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Using a little input box to put your execution percentage, display an extra health value to show when you can use execution.
// @author       _God_
// @match        https://www.torn.com/loader.php?sid=attack&*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490197/God%27s%20Execution%20Solution.user.js
// @updateURL https://update.greasyfork.org/scripts/490197/God%27s%20Execution%20Solution.meta.js
// ==/UserScript==
 
// @kw--note changed the match pattern to only include the attack page, so the script doesn't run on any other pages
 
(function () {
	"use strict";
 
	// Retrieve exec percentage from localStorage or default to 18
	let execPercentage = getExecuteValueFromStorage();
 
	function addStyles() {
		const styles = `
		/* @kw--note Most of these are rules are pinched directly from TORN, including the variables */
		input#_god_exec_input {
			background: var(--input-background-color, #FFF);
			color: var(--input-color);
			border: 1px solid var(--input-border-color, #ccc);
			border-radius: 5px;
			box-sizing: border-box;
			line-height: 22px;
			text-align: center;
			width: 63px;
			padding: 0 15px;
		}
 
		div#_god_exec_container {
			color: var(--appheader-links-color, #777)
		}
 
		span#_god_exec_element {
			padding: 0 5px;
			color: red;
		}
 
		span#_god_exec_element.ready {
			color: green;
			animation: flashRedGreen 1s linear infinite;
		}
 
		@keyframes flashRedGreen {
			0% { color: red; }
			50% { color: green; }
			100% { color: red; }
		}
	`;
 
		const styleSheet = document.createElement("style");
		styleSheet.type = "text/css";
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);
	}
 
	// @kw--note await health element, does not need to be async as it returns a promise
	function waitForHealthElement() {
		// @kw--note Promises are fancy ways of writing async callbacks. `resolve` is fairly similar to return, but it's used to return a value from a promise.
		return new Promise((resolve, reject) => {
			let elem;
			// @kw--note this line is a little confusing, but assigning a value also returns the value in inline functions.
			// This is the same as writing `if (getHealthElement())` except we can use the result more than once.
			// Remember DOM elements are truthy, so if the element exists, it will be assigned to `elem` and the if statement will pass.
			// If the query selector fails, then the value of `elem` will be `null` and the if statement will fail (null is falsy).
			if ((elem = getHealthElement())) resolve(elem);
			const observer = new MutationObserver((muts) => {
				if (muts.some((m) => m.type === "childList" || m.type === "characterData")) {
					if ((elem = getHealthElement())) {
						// @kw--note disconnect the mutation observer, we don't need it anymore. Leaving it running is what we call memory leaks
						observer.disconnect();
						resolve(elem);
					}
				}
			});
			observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
		});
	}
 
	function getHealthElement() {
        // @kw--note 785px is the width where TORN switches from mobile to PC layouts.
		if (window.innerWidth >= 785) {
			// @kw--note PC layout, with two seperate attack windows
			// looks for div#defender then the span with the health value. `[id*=player-health-value_]` is a
			// CSS attribute selector that looks for an element with an id that contains `player-health-value_`\
			// (the rest is the other player's name, and is dynamic)
			return document.querySelector("div#defender span[id*=player-health-value_]");
		} else {
			// @kw--note mobile layout, with one attack window.
			// Looks for the attacker window (there's only one window) then finds the div with the class starting with `rose_`
			// (this is the red one, which is the other player). Then finds the span with the health value.
			return document.querySelector("div#attacker > div[class*=rose_] span[id*=player-health-value_]");
		}
	}
 
	function insertExecuteHelper(healthElement) {
		// @kw--note here just in case, sometimes javascript does weird things...
		if (!healthElement) throw new Error("Missing health element!");
		const executeElement = document.createElement("span");
		// @kw--note something unique that TORN or other scripts definitely won't use, to avoid conflicts
		executeElement.id = "_god_exec_element";
        // @kw--note "beforebegin" means just before the element starts (same parent, but before the given element)
		healthElement.insertAdjacentElement("beforebegin", executeElement);
        // @kw--note return the element so we can use it in other functions
		return executeElement;
	}
 
	function updateExecuteHelper(executeElement, healthElement) {
		if (!executeElement || !healthElement) throw new Error("Missing execute or health element!");
		const [currentHealth, maxHealth] = healthElement.textContent
			.split(" / ")
			.map((v) => parseInt(v.replace(/,/g, "")));
		// @kw--note also here just in case, make sure your script doesn't show any weird, unexpected errors or start showing NaN execute values
		if (isNaN(currentHealth) || isNaN(maxHealth))
			throw new Error(`Invalid health values ${currentHealth} / ${maxHealth}`);
		const execValue = Math.ceil((execPercentage / 100) * maxHealth);
		executeElement.textContent = `Exec: ${execValue.toLocaleString()}`;
		if (currentHealth <= execValue) {
			executeElement.classList.add("ready");
		} else {
			executeElement.classList.remove("ready");
		}
	}
 
	function addExecutePercentInput() {
		const input = document.createElement("input");
		input.type = "number";
		input.value = execPercentage;
		input.id = "_god_exec_input";
		input.addEventListener("input", function () {
			// @kw--note `this` here refers to the input element, and `this.value` is the value of the input
			setExecuteValueToStorage(parseInt(this.value));
			updateExecuteHelper(document.getElementById("_god_exec_element"), getHealthElement());
		});
		const container = document.createElement("div");
		container.innerText = "Execute %: ";
		container.appendChild(input);
		container.id = "_god_exec_container";
		document
			.querySelector("div[class*=linksContainer_]")
			.insertBefore(container, document.querySelector("div[class*=linksContainer_] > *"));
	}
 
	function getExecuteValueFromStorage() {
		return parseInt(localStorage.getItem("_god_exec_value")) || 18;
	}
 
	function setExecuteValueToStorage(value) {
		execPercentage = value || 18;
		localStorage.setItem("_god_exec_value", value || 18);
	}
 
	// @kw--note call the functions altogether - doesn't matter if it's the top or bottom of the page,
	// just neater to bunch the declarations and the actual function calls together
	addStyles();
	// @kw--note this is a promise chain, the first function returns a promise, and the second function takes the result of the first promise as an argument
	waitForHealthElement()
		// @kw--note this looks weird, but we still need healthElement in the next function, so we return an array with the healthElement and the result of the next function (the execute element)
		.then((healthElement) => [healthElement, insertExecuteHelper(healthElement)])
		.then(([healthElement, executeElement]) => {
			// @kw--note update immediately to fill out values
			updateExecuteHelper(executeElement, healthElement);
			addExecutePercentInput();
			const observer = new MutationObserver((muts) => {
				if (!muts.some((m) => m.target.id === healthElement.id)) return;
				updateExecuteHelper(executeElement, healthElement);
			});
			// @kw--note this may need fixing, I can't test this as I'm stacking currently.
			// We can't observe healthElement directly as it gets removed from the DOM (thanks React), but I believe this does the trick.
			// This one we leave running until we leave the page.
			observer.observe(healthElement.parentElement, { childList: true, subtree: true });
		});
})();