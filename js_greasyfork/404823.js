// ==UserScript==
// @name         AcceptCardGame
// @namespace    https://greasyfork.org/ru/scripts/404823-acceptcardgame
// @version      0.6
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/tavern\.php/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @downloadURL https://update.greasyfork.org/scripts/404823/AcceptCardGame.user.js
// @updateURL https://update.greasyfork.org/scripts/404823/AcceptCardGame.meta.js
// ==/UserScript==

(function (window, undefined) {
	let w;
	if (typeof unsafeWindow !== undefined) {
		w = unsafeWindow;
	} else {
		w = window;
	}
	if (w.self !== w.top) {
		return;
	}

	if (!unsafeWindow.setListOfNumbers) {
		unsafeWindow.setListOfNumbers = setListOfNumbers;
	}
	if (!unsafeWindow.reload) {
		unsafeWindow.reload = reload;
	}

	var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

	let listOfNumbers = localStorage.getItem('listOfNumbers');
	listOfNumbers = listOfNumbers == null ? "" : listOfNumbers;
	addSetList();

	function addSetList() {
		document.querySelector("body > center > table > tbody > tr > td > center > table > tbody > tr > td").insertAdjacentHTML("beforeend",
			`<br><textarea style="width: 75%" id="listOfNumbers"></textarea><br><button onclick="setListOfNumbers()">Set Numbers</button>`);
		document.getElementById("listOfNumbers").value = localStorage.getItem('listOfNumbers') == null ? null : localStorage.getItem('listOfNumbers')

	}

	function setListOfNumbers() {
		localStorage.setItem('listOfNumbers', document.getElementById("listOfNumbers").value);
		reload()
	}

	function reload() {
		document.location = document.location;
	}


	let tr = document.querySelector("body > center > table > tbody > tr > td > center > table > tbody > tr > td > table.wb > tbody > tr:nth-child(1)");
	if (/С Вами хочет сыграть/.test(tr.textContent)) {
		let hero_link = tr.querySelector("td > b > a").href;
		let hero_id = "https://www.heroeswm.ru/pl_info.php?id=7197821".match(/\d{1,10}/)[0];
		if (listOfNumbers.includes(hero_id)) {
			doGet("https://www.heroeswm.ru/cancel_card_game.php?action=retreat");
			console.log("fake")
		}
		var ret = GM_xmlhttpRequest({
			method: "GET",
			url: hero_link,
			// overrideMimeType: "text/xml; charset=windows-1251",
			ignoreCache: true,
			redirectionLimit: 0, // this is equivalent to 'failOnRedirect: true'
			onload: function (res) {
				let hero_info = res.responseText;
				let doc = new DOMParser().parseFromString(hero_info, "text/html");
				let won;
				let lost;
				let possible_td = doc.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td:nth-child(2)");
				if (possible_td) {
					won = doc.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td:nth-child(2)").innerHTML.replace(/,/g, "") - 0;
					lost = doc.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(4) > table > tbody > tr > td:nth-child(2)").innerHTML.replace(/,/g, "") - 0;

				} else {
					won = doc.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td:nth-child(2)").innerHTML.replace(/,/g, "") - 0;
					lost = doc.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(4) > table > tbody > tr > td:nth-child(2)").innerHTML.replace(/,/g, "") - 0;
				}
				if (won / lost < 0.91) {
					beep({duration: 1000, callback: () => doGet(tr.querySelector("td > a:nth-child(2)").href)});
				} else {
					doGet("https://www.heroeswm.ru/cancel_card_game.php?action=retreat")
				}
				console.log("ololo")

			},
			onerror: function (res) {
				GM_log("Error!");
			}
		});
	}

	function doGet(url) {
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			overrideMimeType: "text/xml; charset=windows-1251",
			onload: function (res) {
				window.location = window.location
			}
		});
	}

	//All arguments are optional:

	//duration of the tone in milliseconds. Default is 500
	//frequency of the tone in hertz. default is 440
	//volume of the tone. Default is 1, off is 0.
	//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
	//callback to use on end of tone
	function beep({duration, frequency, volume, type, callback} = {}) {
		var oscillator = audioCtx.createOscillator();
		var gainNode = audioCtx.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		if (volume) {
			gainNode.gain.value = volume;
		}
		if (frequency) {
			oscillator.frequency.value = frequency;
		}
		if (type) {
			oscillator.type = type;
		}
		if (callback) {
			oscillator.onended = callback;
		}

		oscillator.start(audioCtx.currentTime);
		oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
	}
})(window);

