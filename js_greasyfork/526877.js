// ==UserScript==
// @name         Furaffinity Open Selected
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.3
// @description  Adds a button for open all selected submissiuns
// @author       Титан
// @match        https://www.furaffinity.net/msg/submissions/*
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526877/Furaffinity%20Open%20Selected.user.js
// @updateURL https://update.greasyfork.org/scripts/526877/Furaffinity%20Open%20Selected.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let openDelay; // increase timeout to get less often 503 error. Or set to 0 and install "503 reload" script
	let coloredButtons;
    const css = `
button[class="standard remove-checked"] {
	background-color:#ff000021
}
button[class="standard invert-selection"] {
	filter: invert(1) hue-rotate(180deg);
}
button[class="standard open-selected"] {
	background-color:#0803
}
`

	var arriveOptions = {
		fireOnAttributesModification: false,
		onceOnly: true,
		existing: true
	};

	document.arrive(".section-options.actions", arriveOptions, function (newElem) {CreateButton(newElem)});
	let menuCommand_ColoredButtons;
	let menuCommand_OpenDelay;
	RegisterMenuCommands().then(() => {
		ApplyColoredButtons();
	});
	

	async function RegisterMenuCommands() {
		coloredButtons = await GM.getValue('coloredButtons', true)
		openDelay = await GM.getValue('openDelay', 30);
		menuCommand_ColoredButtons = GM_registerMenuCommand( `Colored Buttons ${(coloredButtons? "✅":"❎")}`, async () => {
			coloredButtons = !coloredButtons;
			await GM.setValue('coloredButtons', coloredButtons);
			ApplyColoredButtons()
			ReInitializeMenuCommands();
		});
		menuCommand_OpenDelay = GM_registerMenuCommand( `Change Open Delay [${openDelay} ms]`, async () => {
			
			let delay = prompt("Set Open Delay (ms)", await openDelay);
			if (delay) {
				delay = parseInt(delay);
				if (isNaN(delay)) {
					alert("Invalid input. Please enter a valid number.");
					return;
				}
				openDelay = delay;
				await GM.setValue('openDelay', openDelay);
			}

			ReInitializeMenuCommands();
		});
	}

	function ApplyColoredButtons() {
		if (coloredButtons)
			ApplyCss();
		else
			RemoveCss();
	}

	function ReInitializeMenuCommands() {
		GM_unregisterMenuCommand(menuCommand_ColoredButtons);
		GM_unregisterMenuCommand(menuCommand_OpenDelay);
		RegisterMenuCommands();
	}

	function ApplyCss() {
		const style = document.createElement("style");
		style.textContent = css;
		style.id = "coloredButtons";
		document.head.appendChild(style);
	}
	function RemoveCss() {
		let style = document.getElementById("coloredButtons");
		if (style) {
			style.remove();
		}
	}

	openDelay = GM.getValue('openDelay', 30);

	

	function CreateButton(Panel) {
			let galleries = document.querySelectorAll(".gallery");
			if(galleries) {
				let newButton = document.createElement('button');
				newButton.classList.add('standard');
                newButton.classList.add('open-checked');
				newButton.setAttribute('type','button');
				newButton.onclick = function() {
					let i = 0;
					for(let gallery of galleries) {
						for (let figure of gallery.children) {
							if (figure.classList.contains('checked')) {
								setTimeout(function () {
									window.open(figure.firstElementChild.firstElementChild.firstElementChild.href)
								}, openDelay * i++);
							}
						}
					}
					window.focus();
				}
				newButton.append(document.createTextNode("Open Selected"));
				newButton.className = "standard open-selected";
				Panel.lastElementChild.previousSibling.previousSibling.before(newButton)
			}
	}


})();