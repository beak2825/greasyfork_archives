// ==UserScript==
// @name         HWM Pointer
// @namespace    https://greasyfork.org/ru/scripts/424028-hwm-pointer
// @version      0.4
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator|my)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/war\.php.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/424028/HWM%20Pointer.user.js
// @updateURL https://update.greasyfork.org/scripts/424028/HWM%20Pointer.meta.js
// ==/UserScript==

(function (window, undefined) {
	//TODO add message processing queue
	let w;
	if (typeof unsafeWindow !== undefined) {
		w = unsafeWindow;
	} else {
		w = window;
	}
	if (w.self !== w.top) {
		return;
	}
	let allPlayers = getPlayers()
	let coordsData = ""
	let isPressed = false
	let allMessages = getAllMessages()

	let isSettingsOpened = false;
	let defaultSettings = getDefaultSettings()
	let settings = {}
	loadSettings()

	setInterval(checkChatForCoords, 300)

	function checkChatForCoords() {
		let newMessages = getAllMessages();
		if (newMessages.length > allMessages.length) {
			allMessages = newMessages
			checkMessageForCoords(allMessages.slice(-1)[0])
		}
	}

	function checkMessageForCoords(msg) {
		if (msg.includes("!")) {
			let coords = findAll(/\|(\d{1,2}):(\d{1,2})/, msg)
			if (coords.length > 0) {
				setChatCoordsListener(coords)
				highlightCoords(coords)
			}
		}
	}

	function setChatCoordsListener(coords) {
		let msgWithCoords = Array.from(getChat().getElementsByTagName("b")).slice(-1)[0]
		msgWithCoords.id = "coords" + allMessages.length
		$(`coords${allMessages.length}`).addEventListener('mouseover', () => showCoordsMouse(coords))
		$(`coords${allMessages.length}`).addEventListener('mouseout', () => hideCoordsMouse(coords))
	}

	function showCoordsMouse(coords) {
		coords.forEach(coordinate => {
			showCoords(coordinate)
		})
	}

	function hideCoordsMouse(coords) {
		coords.forEach(coordinate => {
			hideCoords(coordinate)
		})
	}

	function highlightCoords(coords) {
		coords.forEach(coordinate => {
			showCoords(coordinate)
			setTimeout(() => {
				hideCoords(coordinate)
			}, settings.duration)
		})
	}

	function showCoords(coordinate) {
		shado[(coordinate[1] - 0) + (coordinate[2] - 0) * defxn].stroke(settings.color);
		shado[(coordinate[1] - 0) + (coordinate[2] - 0) * defxn].fill(settings.color);
		set_visible(shado[(coordinate[1] - 0) + (coordinate[2] - 0) * defxn], 1);
	}

	function hideCoords(coordinate) {
		shado[(coordinate[1] - 0) + (coordinate[2] - 0) * defxn].stroke('red');
		shado[(coordinate[1] - 0) + (coordinate[2] - 0) * defxn].fill(null);
		set_visible(shado[(coordinate[1] - 0) + (coordinate[2] - 0) * defxn], 0);
	}

	window.addEventListener("keydown", e => {
		if ((document.querySelector("#chattext") !== document.activeElement) && (document.querySelector("#chattext_classic") !== document.activeElement)) {
			if (!isSettingsOpened && e.shiftKey && ["f", "F", "а", "А"].includes(e.key)) {
				isSettingsOpened = true;
				openSettings()
				e.preventDefault()
				return
			}
			if (!isSettingsOpened && ["f", "F", "а", "А"].includes(e.key)) {
				if (!isPressed) {
					coordsData = "";
					coordsData += "|" + xr_last + ":" + yr_last
					isPressed = true
				}
			}
		}
	})

	window.addEventListener("keyup", e => {
		if ((document.querySelector("#chattext") !== document.activeElement) && (document.querySelector("#chattext_classic") !== document.activeElement)) {
			if (!isSettingsOpened && ["f", "F", "а", "А"].includes(e.key)) {
				let newCoords = "|" + xr_last + ":" + yr_last
				if (newCoords !== coordsData) {
					coordsData += " " + newCoords
				}
				isPressed = false
				createAndSendMessage();
			}
		}
	})

	function openSettings() {
		showEmptyBackground();
		document.body.insertAdjacentHTML('beforeend', getSettingsTemplate())
		fillSettings()
	}

	function showEmptyBackground() {
		document.body.insertAdjacentHTML('beforeend', getEmptyBackgroundTemplate());
		$('empty_background').addEventListener('click', handleOnBackgroundClick);
	}

	function hideEmptyBackground() {
		removeElement($('empty_background'))
	}

	function fillSettings() {
		$('coords-color').addEventListener('input', () => {
			handleChangeColor()
		})
		$('coords-duration-btn').addEventListener('click', () => {
			handleChangeDuration()
		})
		$('coords-duration').addEventListener('keyup', e => {
			if (e.key === 'Enter' || e.keyCode === 13) {
				handleChangeDuration()
			}
		})
	}

	function handleChangeDuration() {
		let inputValue = $('coords-duration').value - 0
		if (!isNaN(inputValue) && inputValue !== 0) {
			settings.duration = inputValue
			handleSettingsChange()
		}
	}

	function handleChangeColor() {
		settings.color = $('coords-color').value
		handleSettingsChange()
	}

	function handleSettingsChange() {
		set('hwm_pointer_settings', settings)
	}

	function hideSettings() {
		removeElement($('hwm_pointer_settings'))
	}

	function handleOnBackgroundClick() {
		isSettingsOpened = false;
		hideEmptyBackground();
		hideSettings();
	}

	function getEmptyBackgroundTemplate() {
		return `
        <div id="empty_background" style="
            position: fixed; 
            left: 0; 
            top: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            opacity: 0.5;
            z-index: 11000001;
        "></div>
        `
	}

	function getSettingsTemplate() {
		return `
        <div id="hwm_pointer_settings" style="
            position: fixed;
            left: ${(getClientWidth() - 300) / 2}px;
            top: ${window.pageYOffset + 155}px;
            width: 300px;
            background: #F6F3EA;
            z-index: 11000002;
            padding: 20px;">
            <label for="coords-color">Select your favorite color:</label>
  			<input type="color" id="coords-color" name="coords-color" value="${settings.color}">
  			<br>
  			<span>Duration in ms <input id="coords-duration" type="text" style="width: 40px" value="${settings.duration}">
  			<button id="coords-duration-btn">OK</button></span>
        </div>
        `
	}


	function createAndSendMessage() {
		if (allPlayers.includes(player.toString())) {
			coordsData = "!" + coordsData
		}
		sentCoords(coordsData)
	}

	function getPlayers() {
		let battleData = unsafeWindow.run_all.toString()
		let battlePlayers = findAll(/plid\d\|(\d{1,10})/, battleData)
		return battlePlayers.map(player => player[1])
	}

	function getAllMessages() {
		return getChat().innerHTML.split("<br>").slice(0, -1)
	}

	function getChat() {
		if (isVisible(document.querySelector("#chat_inside"))) {
			return document.querySelector("#chat_inside")
		} else {
			return document.querySelector("#chat_classic_inside")
		}
	}

	function isVisible(element) {
		return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	}

	function sentCoords(msg) {
		chatloader.loading = true;
		let formData = new FormData();
		formData.append("warid", warid)
		formData.append("chat", 1)
		let pl_id = player;
		if (player2 > 0) {
			pl_id = player2;
		}

		formData.append("pl_id", pl_id)
		formData.append("mess", encodeURIComponent(getunicode(msg)))
		formData.append("lastturn", lastturn)
		formData.append("lastmess", lastmess)
		formData.append("lastmess2", lastmess2)

		if (crclink != 0) {
			formData.append("show_for_all", crclink)
		}
		const str = [...formData.entries()]
			.map(x => `${x[0]}=${x[1]}`)
			.join('&')

		chatloader_load(str);
		window.scrollTo(0, 0);
	}

	function findAll(regexPattern, sourceString) {
		let output = []
		let match
		let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
		while (match = regexPatternWithGlobal.exec(sourceString)) {
			delete match.input
			output.push(match)
		}
		return output
	}

	function removeElement(element) {
		element.parentNode.removeChild(element)
	}

	function $(id, where = document) {
		return where.querySelector(`#${id}`);
	}

	function get(key, def) {
		let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
		return result == null ? def : result;

	}

	function set(key, val) {
		localStorage[key] = JSON.stringify(val);
	}

	function getClientWidth() {
		return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
	}

	function getDefaultSettings() {
		return {
			"color": "#FF0000",
			"duration": 2000
		}
	}

	function loadSettings() {
		settings = get('hwm_pointer_settings', defaultSettings)
		for (const [key, value] of Object.entries(defaultSettings)) {
			if (settings[key] === undefined) {
				settings[key] = value
			}
		}
	}
})(window);