// ==UserScript==
// @name         MooMoo.io Key Rebinder
// @description  F -> Hold Trap/Boost Pad  /  R -> Hold Spike
// @author       Kooky Warrior
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.5
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/469365/MooMooio%20Key%20Rebinder.user.js
// @updateURL https://update.greasyfork.org/scripts/469365/MooMooio%20Key%20Rebinder.meta.js
// ==/UserScript==
 
;(async () => {
	unsafeWindow.keyRebinder = true
 
	let items = [],
		weapons = [],
		inGame = false,
		keys = {},
		ws = await new Promise(async (resolve) => {
			let { send } = WebSocket.prototype
 
			WebSocket.prototype.send = function (...x) {
				send.apply(this, x)
				this.send = send
				this.iosend = function (...datas) {
					const [packet, ...data] = datas
					this.send(new Uint8Array(Array.from(msgpack.encode([packet, data]))))
				}
				this.addEventListener("message", (e) => {
					if (!e.origin.includes("moomoo.io")) return
					const [packet, data] = msgpack.decode(new Uint8Array(e.data))
					switch (packet) {
						case "1":
							inGame = true
							items = [0, 3, 6, 10]
							weapons = [0]
							break
						case "11":
							inGame = false
							break
						case "17":
							if (data[0]) {
								if (data[1]) weapons = data[0]
								else items = data[0]
							}
							break
					}
				})
				resolve(this)
			}
		})
 
	var observer = new MutationObserver((mutations) => {
		mutations.forEach((mutationRecord) => {
			if (
				document.getElementById("allianceMenu").style.display == "block" ||
				document.getElementById("chatHolder").style.display == "block"
			) {
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
				ws.iosend("5", items[4])
			} else if (event.code == "KeyR") {
				ws.iosend("5", items[2])
			} else if (event.code === "Digit0" && items[58 - 49 - weapons.length] === 20) {
				ws.iosend("5", 20)
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