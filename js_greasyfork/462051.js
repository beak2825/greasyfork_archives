// ==UserScript==
// @name         MooMoo.io Key Rebinder
// @description  F -> Hold Trap/Boost Pad  /  V -> Hold Spike / N -> Hold Windmill
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://update.greasyfork.org/scripts/478839/MooMooio%20Packet%20Code.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.7.2
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/462051/MooMooio%20Key%20Rebinder.user.js
// @updateURL https://update.greasyfork.org/scripts/462051/MooMooio%20Key%20Rebinder.meta.js
// ==/UserScript==

;(async () => {
	unsafeWindow.keyRebinder = true

	let items = [],
		weapons = [],
		inGame = false,
		keys = {},
		init = false,
		ws = await new Promise(async (resolve) => {
			let { send } = WebSocket.prototype

			WebSocket.prototype.send = function (...x) {
				send.apply(this, x)
				this.send = send
				this.iosend = function (...datas) {
					const [packet, data] = datas
					this.send(msgpack.encode([packet, data]))
				}
				if (!init) {
					init = true
					this.addEventListener("message", (e) => {
						if (!e.origin.includes("moomoo.io") && !unsafeWindow.privateServer) return
						const [packet, data] = msgpack.decode(new Uint8Array(e.data))
						switch (packet) {
							case PACKETCODE.RECEIVE.setupGame:
								inGame = true
								items = [0, 3, 6, 10]
								weapons = [0]
								break
							case PACKETCODE.RECEIVE.killPlayer:
								inGame = false
								break
							case PACKETCODE.RECEIVE.updateItems:
								if (data[0]) {
									if (data[1]) weapons = data[0]
									else items = data[0]
								}
								break
						}
					})
				}
				resolve(this)
			}
		})

	var observer = new MutationObserver((mutations) => {
		mutations.forEach((mutationRecord) => {
			if (document.getElementById("allianceMenu").style.display == "block" || document.getElementById("chatHolder").style.display == "block") {
				keys = {}
			}
		})
	})
	observer.observe(document.getElementById("allianceMenu"), {
		attributes: true,
		attributeFilter: ["style"]
	})
	observer.observe(document.getElementById("chatHolder"), {
		attributes: true,
		attributeFilter: ["style"]
	})

	unsafeWindow.addEventListener("keydown", (event) => {
		if (
			inGame &&
			!keys[event.code] &&
			document.getElementById("allianceMenu").style.display != "block" &&
			document.getElementById("chatHolder").style.display != "block"
		) {
			keys[event.code] = true
			if (event.code == "KeyF" && items[4]) {
				ws.iosend(PACKETCODE.SEND.selectToBuild, [items[4], null])
			} else if (event.code == "KeyV") {
				ws.iosend(PACKETCODE.SEND.selectToBuild, [items[2], null])
			} else if (event.code == "KeyN") {
				ws.iosend(PACKETCODE.SEND.selectToBuild, [items[3], null])
			}
		}
	})

	unsafeWindow.addEventListener("keyup", (event) => {
		if (
			inGame &&
			keys[event.code] &&
			document.getElementById("allianceMenu").style.display != "block" &&
			document.getElementById("chatHolder").style.display != "block"
		) {
			keys[event.code] = false
		}
	})
})()
