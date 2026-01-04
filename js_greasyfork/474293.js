// ==UserScript==
// @name         Storable Convar
// @namespace    https://github.com/No-Eul
// @version      1.0
// @description  Save and automatically apply the options what you set in Diep.io console
// @author       NoEul
// @license      MIT License - https://github.com/No-Eul/scripts/raw/master/LICENSE.txt
// @source       https://github.com/No-Eul/scripts
// @supportURL   https://github.com/No-Eul/scripts/issues
// @match        *://diep.io/*
// @icon         https://diep.io/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/474293/Storable%20Convar.user.js
// @updateURL https://update.greasyfork.org/scripts/474293/Storable%20Convar.meta.js
// ==/UserScript==

function getInputObject() {
	return new Promise(resolve => {
		if (unsafeWindow.input) resolve(unsafeWindow.input);

		let interval = setInterval(() => {
			if (unsafeWindow.input) {
				clearInterval(interval);
				resolve(unsafeWindow.input);
			}
		});
	});
}

function modifyStoringConvar() {
	document.getElementById("textInput")
		.addEventListener("change", event => {
			let pair = event.target.value.split(/\s+/g);
			if (unsafeWindow.input.get_convar(pair[0]))
				GM_setValue(pair[0], pair[1]);
		});

	let set_convar = unsafeWindow.input.set_convar;
	unsafeWindow.input.set_convar = function (key, value) {
		if (unsafeWindow.input.get_convar(key))
			GM_setValue(key, value);
		set_convar.apply(unsafeWindow.input, arguments);
	}

	let execute = unsafeWindow.input.execute;
	unsafeWindow.input.execute = function (command) {
		let pair = command.split(/\s+/g);
		if (unsafeWindow.input.get_convar(pair[0]))
			GM_setValue(pair[0], pair[1]);
		execute.apply(unsafeWindow.input, arguments);
	}
}

(function init() {
	getInputObject()
		.then(modifyStoringConvar)
		.then(() => GM_listValues().forEach(key => unsafeWindow.input.set_convar(key, GM_getValue(key))));
})();
