// ==UserScript==
// @name         MooMoo.io Show Keys & Mouse
// @description  Display your keyboard keys, mouse, and CPS
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.5.2
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/463400/MooMooio%20Show%20Keys%20%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/463400/MooMooio%20Show%20Keys%20%20Mouse.meta.js
// ==/UserScript==

// Press "\" to open menu

// This script was originally made by GG Gamer Br
// https://greasyfork.org/en/scripts/424547-moomoo-io-keys

;(() => {
	unsafeWindow.showKeys = true

	let storage = JSON.parse(localStorage.getItem("showKeys&Mouse"))
	if (storage == null) {
		storage = {
			keys: ["Q", "F", "V", "1", "2", "3"],
			cps: true,
			maxCps: true,
			mouse: 100,
			space: 7,
			container: 270
		}
		localStorage.setItem("showKeys&Mouse", JSON.stringify(storage))
	}
	unsafeWindow.addEventListener("DOMContentLoaded", () => {
		const DIV = `
            <style>
				#show_key_menu {
					background-color: rgba(0, 0, 0, 0.25);
					width: fit-content;
					height: fit-content;
					pointer-events: all;
					color: white;
					padding: 20px;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
				.show_key_inputs {
					width: 100%;
					display: flex;
					flex-direction: row;
					align-items: flex-end;
					margin-bottom: 10px;
				}
				.show_key_inputs > * {
					font-size: 24px;
				}
				.show_key_inputs > input[type="number"], .show_key_inputs > input[type="text"] {
					width: 100px;
					padding: 6px;
					border: none;
					outline: none;
					box-sizing: border-box;
					color: #4A4A4A;
					background-color: #e5e3e3;
					-webkit-border-radius: 4px;
					-moz-border-radius: 4px;
					border-radius: 4px;
					text-transform: uppercase;
				}
				.show_key_inputs > input[type="checkbox"] {
					align-self: center;
				}
				.show_key_inputs > label {
					margin-left: 10px;
				}
				.show_key_inputs > div {
					margin-left: 10px;
					text-align: center;
					padding: 6px 10px;
					box-sizing: border-box;
					width: fit-content;
					-webkit-border-radius: 4px;
					-moz-border-radius: 4px;
					border-radius: 4px;
					cursor: pointer;
				}
				#add_key {
					background-color: #8ecc51;
				}
				#remove_key {
					background-color: #cc5151;
				}
				#add_key:hover {
					background-color: #6a983f;
				}
				#remove_key:hover {
					background-color: #983f3f;
				}
				#show_key_container {
					position: absolute;
					left: 15px;
					bottom: 210px;
				}
    			.keys {
					width: 50px;
    				height: 45px;
    				margin: 5px;
    				padding: 2px 10px;
    				border: 2px solid white;
    				color: white;
    				text-align: center;
    				font-size: 25px;
    				top: 50%;
    				line-height: 45px;
    			}
    			.keys.active {
    				color: black;
    				background: white;
    			}
    			#keys {
    				display: flex;
    				flex-wrap: wrap;
    				align-content: start;
    				width: 300px;
    			}
    			#fast {
    				display: flex;
					margin-bottom: 10px;
					margin-left: 5px;
					align-items: center;
    			}
				#mouseContainer {
					width: 65px;
					height: 94px;
				}
    			#mouse {
    				display: flex;
					width: 65px;
					justify-content: space-between;
					flex-wrap: wrap;
					transform-origin: 0 0;
    			}
    			#mouse_0 {
    				flex-basis: 24px;
    				height: 50px;
					border-radius: 100px 10px 10px 10px;
    				border: 2px solid white;
    			}
    			#mouse_1 {	
    				flex-basis: 4px;
    				height: 50px;
					border-radius: 10px;
    				border: 2px solid white;
    			}
    			#mouse_2 {
    				flex-basis: 24px;
    				height: 50px;
					border-radius: 10px 100px 10px 10px;
    				border: 2px solid white;
    			}
    			#mouse_bottom {
    				margin-top: 1px;
					flex-basis: 100%;
    				height: 34px;
					border-radius: 10px 10px 100px 100px;
    				border: 2px solid white;
    			}
				.active2 {
					background: white;
				}
				#cpsDisplay, #maxCpsDisplay {
					position: initial;
					padding-right: 10px;
					width: fit-content;
					height: fit-content;
					text-align: left;
					margin-bottom: 10px;
					margin-left: 5px;
				}
    		</style>
			<div id="show_key_menu" style="display: none">
				<div class="show_key_inputs">
					<input id="mouse_size" type="number" value="${storage.mouse}" min="0" onchange="changeShowKeyMouseProperty('mouse', parseFloat(this.value))">
					<label for="mouse_size">Mouse Size</label>
				</div>
				<div class="show_key_inputs">
					<input id="spacebar_size" type="number" value="${
			storage.space
		}" oninput="this.value = Math.round(this.value)" onchange="changeShowKeyMouseProperty('space', parseInt(this.value))" max="20" min="0">
					<label for="spacebar_size">Spacebar Size</label>
				</div>
				<div class="show_key_inputs">
					<input id="container_size" type="number" value="${
			storage.container
		}" min="0" onchange="changeShowKeyMouseProperty('container', parseFloat(this.value))">
					<label for="container_size">Container Size</label>
				</div>
				<div class="show_key_inputs">
					<input id="show_cps" type="checkbox" ${storage.cps ? "checked" : ""} onchange="changeShowKeyMouseProperty('cps', this.checked)">
					<label for="show_cps">CPS</label>
				</div>
				<div class="show_key_inputs">
					<input id="show_maxcps" type="checkbox" ${storage.maxCps ? "checked" : ""} onchange="changeShowKeyMouseProperty('maxCps', this.checked)">
					<label for="show_maxcps">MAX CPS</label>
				</div>
				<div class="show_key_inputs">
					<input id="enter_key" type="text" maxlength="1" placeholder="Enter Key" style="width: 200px; text-align: center;">
					<div id="add_key" onclick="addKey_ShowKeyMouse()"><span>Add</span></div>
					<div id="remove_key" onclick="removeKey_ShowKeyMouse()"><span>Remove</span></div>
				</div>
			</div>
            <div id="show_key_container">
    			<div id="fast">
					<div id="mouseContainer" style="display: ${storage.mouse > 0 ? "block" : "none"}; width: ${65 * (storage.mouse / 100)}px; height: ${
			94 * (storage.mouse / 100)
		}px">
    					<div id="mouse" style="transform: scale(${storage.mouse}%)">
    						<div id="mouse_0"></div>
    						<div id="mouse_1"></div>
    						<div id="mouse_2"></div>
							<div id="mouse_bottom"></div>
    					</div>
					</div>
    				<div class="keys" id="key_Space" style="margin-left: ${storage.mouse > 0 ? 10 : 0}px; width: fit-content; display: ${
			storage.space > 0 ? "block" : "none"
		}">_______</div>
    			</div>
				<div id="cpsDisplay" class="resourceDisplay" style="display: ${storage.cps ? "block" : "none"}">CPS: 0</div>
				<div id="maxCpsDisplay" class="resourceDisplay" style="display: ${storage.maxCps ? "block" : "none"}">MAX CPS: 0</div>
				<div id="keys" style="display: ${storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex"}; width: ${storage.container}px"></div>
    		</div>
        `
		const container = document.createElement("div")
		container.innerHTML = DIV
		document.getElementById("gameUI").appendChild(container)
		storage.keys.forEach((key) => {
			const element = document.createElement("div")
			element.id = `key_${key}`
			element.className = "keys"
			element.textContent = key
			document.getElementById("keys").appendChild(element)
		})
		document.getElementById("keys").style.display = storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex"

		unsafeWindow.changeShowKeyMouseProperty = (id, value) => {
			storage[id] = value
			localStorage.setItem("showKeys&Mouse", JSON.stringify(storage))
			document.getElementById("mouseContainer").style.width = `${65 * (storage.mouse / 100)}px`
			document.getElementById("mouseContainer").style.height = `${94 * (storage.mouse / 100)}px`
			document.getElementById("mouseContainer").style.display = storage.mouse > 0 ? "block" : "none"
			document.getElementById("key_Space").style.marginLeft = `${storage.mouse > 0 ? 10 : 0}px`
			document.getElementById("mouse").style.transform = `scale(${storage.mouse}%)`
			document.getElementById("key_Space").textContent = "_".repeat(storage.space)
			document.getElementById("key_Space").style.display = storage.space > 0 ? "block" : "none"
			document.getElementById("cpsDisplay").style.display = storage.cps ? "block" : "none"
			document.getElementById("maxCpsDisplay").style.display = storage.maxCps ? "block" : "none"
			document.getElementById("keys").style.display = storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex"
			document.getElementById("keys").style.width = `${storage.container}px`
		}

		unsafeWindow.addKey_ShowKeyMouse = () => {
			const key = document.getElementById("enter_key").value.toUpperCase()
			let element = document.getElementById(`key_${key}`)
			if (element == null) {
				element = document.createElement("div")
				element.id = `key_${key}`
				element.className = "keys"
				element.textContent = key
				document.getElementById("keys").appendChild(element)
				storage.keys.push(key)
				localStorage.setItem("showKeys&Mouse", JSON.stringify(storage))
			}
		}

		unsafeWindow.removeKey_ShowKeyMouse = async () => {
			const key = document.getElementById("enter_key").value.toUpperCase()
			const element = document.getElementById(`key_${key}`)
			if (element != null) {
				element.remove()
				const index = storage.keys.indexOf(key)
				if (index > -1) {
					await storage.keys.splice(index, 1)
					localStorage.setItem("showKeys&Mouse", JSON.stringify(storage))
				}
				document.getElementById("keys").style.display = storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex"
			}
		}

		var currentCps = 0
		var maxCps = 0
		var spaceDown = false

		function addCPS() {
			currentCps++
			document.getElementById("cpsDisplay").innerText = `CPS: ${currentCps}`
			if (currentCps > maxCps) {
				maxCps = currentCps
				document.getElementById("maxCpsDisplay").innerText = `MAX CPS: ${maxCps}`
			}
			setTimeout(() => {
				currentCps--
				document.getElementById("cpsDisplay").innerText = `CPS: ${currentCps}`
			}, 1000)
		}

		function keysActive() {
			let returnValue
			returnValue = document.getElementById("allianceMenu").style.display != "block" && document.getElementById("chatHolder").style.display != "block"
			return returnValue
		}

		unsafeWindow.addEventListener("keydown", (event) => {
			if (keysActive()) {
				if (event.code == "Backslash") {
					document.getElementById("show_key_menu").style.display = document.getElementById("show_key_menu").style.display == "block" ? "none" : "block"
				} else if (event.code == "Space") {
					if (!spaceDown) {
						spaceDown = true
						const keyDiv = document.getElementById(`key_Space`)
						if (keyDiv && !keyDiv.classList.contains("active")) {
							keyDiv.classList.add("active")
						}
						addCPS()
					}
				} else {
					const keyDiv = document.getElementById(`key_${event.key.toUpperCase()}`)
					if (keyDiv && !keyDiv.classList.contains("active")) {
						keyDiv.classList.add("active")
					}
				}
			}
		})

		unsafeWindow.addEventListener("keyup", (event) => {
			if (event.code == "Space") {
				spaceDown = false
				const keyDiv = document.getElementById(`key_Space`)
				if (keyDiv && keyDiv.classList.contains("active")) {
					keyDiv.classList.remove("active")
				}
			} else {
				const keyDiv = document.getElementById(`key_${event.key.toUpperCase()}`)
				if (keyDiv && keyDiv.classList.contains("active")) {
					keyDiv.classList.remove("active")
				}
			}
		})

		document.getElementById("touch-controls-fullscreen").addEventListener("mousedown", (event) => {
			if ([0, 1, 2].includes(event.button)) {
				addCPS()
			}
			let mouseDiv = document.getElementById(`mouse_${event.button}`)
			if (mouseDiv && !mouseDiv.classList.contains("active2")) {
				mouseDiv.classList.add("active2")
			}
		})

		document.getElementById("touch-controls-fullscreen").addEventListener("mouseup", (event) => {
			let mouseDiv = document.getElementById(`mouse_${event.button}`)
			if (mouseDiv && mouseDiv.classList.contains("active2")) {
				mouseDiv.classList.remove("active2")
			}
		})
	})
})()
