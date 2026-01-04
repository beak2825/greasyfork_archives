// ==UserScript==
// @name        Verbal memory bot - humanbenchmark.com
// @namespace   https://reddit.com/u/AliFurkanY
// @match       https://humanbenchmark.com/tests/verbal-memory
// @grant       none
// @version     1.1
// @author      alifurkany
// @description Plays the "verbal memory" game for you on humanbenchmark.com
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/446913/Verbal%20memory%20bot%20-%20humanbenchmarkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/446913/Verbal%20memory%20bot%20-%20humanbenchmarkcom.meta.js
// ==/UserScript==

// Speed
let INTERVAL = 0;

let botbtn = document.createElement("button");
let startbtn = document.querySelector("button.css-de05nr.e19owgy710");
let settingsdiv = document.createElement("div");
let btndiv = startbtn.parentElement;
botbtn.className = startbtn.className;
botbtn.innerText = "Start Bot";
settingsdiv.className = btndiv.className;
let intervalinput = document.createElement("input");
intervalinput.className = ".css-1gr1qbh";
intervalinput.type = "number";
intervalinput.min = 0;
intervalinput.onchange = () => (INTERVAL = parseInt(intervalinput.value));
intervalinput.value = INTERVAL;
intervalinput.style.color = "black";
intervalinput.placeholder = 0;
settingsdiv.append("Click interval (ms): ");
settingsdiv.append(intervalinput);
let fullnav = document.querySelector("div.full-nav");

function appendStuff() {
	btndiv.append(" ");
	btndiv.append(botbtn);
	btndiv.parentElement.append(settingsdiv);
}

let dict = [];

botbtn.onclick = () => {
	startbtn.click();
	setImmediate(() => {
		let worddiv = document.querySelector("div.word");
		let [seenbtn, newbtn] = document.querySelectorAll(
			"button.css-de05nr.e19owgy710"
		);
		let stopped = false;
		let stopbtn = document.createElement("button");
		stopbtn.className = startbtn.className;
		stopbtn.innerText = "Stop";
		stopbtn.onclick = () => {
			console.log("Stopped");
			stopped = true;
			stopbtn.remove();
		};
		fullnav.append(stopbtn);
		let interval = setInterval(() => {
			if (document.querySelector(".css-0")) {
				console.log("Game ended");
				document
					.querySelector("button.secondary.css-qm6rs9.e19owgy710")
					.addEventListener("click", () =>
						setImmediate(() => {
							dict = [];
							startbtn = document.querySelector(
								"button.css-de05nr.e19owgy710"
							);
							btndiv = startbtn.parentElement;
							appendStuff();
						})
					);
				stopbtn.remove();
				clearInterval(interval);
			} else if (!stopped) {
				let word = worddiv.innerText.trim();
				console.log(word);
				if (dict.includes(word)) seenbtn.click();
				else {
					dict.push(word);
					newbtn.click();
				}
			}
		}, INTERVAL);
	});
};

appendStuff();
