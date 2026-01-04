// ==UserScript==
// @name         MooMoo.io Insta Helper
// @description  Helps you to get a better aim
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      1.1.2
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/461750/MooMooio%20Insta%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/461750/MooMooio%20Insta%20Helper.meta.js
// ==/UserScript==

/*
- To activate or deactivate the helper, simply click the middle mouse button
- Adjust your position with precision by pressing the "Z" key and using your mouse as a guide
- The helper will display a circle around you, representing the maximum range of the turret gear bullet
- If you need to switch up your range, press the "." key to toggle the circle distance to half the maximum range
*/

;(() => {
	unsafeWindow.bowInstaHelper = true

	let mouse = {
		x: null,
		y: null
	}
	let toggle = false
	let inGame = false
	let distance = 700
	let init = false

	const originalSend = WebSocket.prototype.send
	WebSocket.prototype.send = function (...x) {
		originalSend.apply(this, x)
		this.send = originalSend
		if (!init) {
			init = true
			this.addEventListener("message", (e) => {
				if (!e.origin.includes("moomoo.io") && !unsafeWindow.privateServer) return
				const [packet, data] = msgpack.decode(new Uint8Array(e.data))
				if (packet === PACKETCODE.RECEIVE.setupGame) {
					inGame = true
				} else if (packet === PACKETCODE.RECEIVE.killPlayer) {
					inGame = false
					if (toggle) {
						let storeMenu = document.getElementById("storeMenu")
						let upgradeHolder = document.getElementById("upgradeHolder")
						toggle = false

						storeMenu.style.transform = null
						storeMenu.style.left = null
						storeMenu.style.top = null

						upgradeHolder.style.transform = null
						upgradeHolder.style.left = null
						upgradeHolder.style.top = null

						if (unsafeWindow.recorder) {
							unsafeWindow.updatePosition = [storeMenu.style.left, storeMenu.style.top, upgradeHolder.style.left, upgradeHolder.style.top]
							unsafeWindow.sendToLocal("addData", [Date.now().toString(), { type: "updatePosition", data: [unsafeWindow.updatePosition] }])
						}
					}
				}
			})
		}
	}

	unsafeWindow.canvasRender = unsafeWindow.canvasRender || []
	unsafeWindow.canvasRender.push(() => {
		if (toggle) {
			let ctx = document.getElementById("gameCanvas").getContext("2d")
			let maxScreenWidth = unsafeWindow.config.maxScreenWidth
			let maxScreenHeight = unsafeWindow.config.maxScreenHeight
			ctx.beginPath()
			ctx.arc(maxScreenWidth / 2, maxScreenHeight / 2, distance, 0, 2 * Math.PI, false)
			ctx.fillStyle = "rgb(0, 0, 0, 0.1)"
			ctx.fill()
		}
	})

	const originalClearRect = CanvasRenderingContext2D.prototype.clearRect
	CanvasRenderingContext2D.prototype.clearRect = function () {
		originalClearRect.apply(this, arguments)
		unsafeWindow.canvasRender.forEach((e) => {
			e()
		})
	}

	unsafeWindow.addEventListener("DOMContentLoaded", () => {
		let upgradeHolder = document.getElementById("upgradeHolder")

		unsafeWindow.addEventListener("keydown", (event) => {
			if (
				inGame &&
				toggle &&
				document.getElementById("allianceMenu").style.display != "block" &&
				document.getElementById("chatHolder").style.display != "block"
			) {
				if (event.code == "KeyZ") {
					let storeMenu = document.getElementById("storeMenu")
					storeMenu.style.transform = "translateX(calc(-50% + 200px))"
					storeMenu.style.left = mouse.x - 370 + "px"
					storeMenu.style.top = mouse.y - 100 + "px"

					upgradeHolder.style.transform = "translateX(-50%)"
					upgradeHolder.style.left = mouse.x + "px"
					upgradeHolder.style.top = mouse.y - 33 + "px"

					if (unsafeWindow.recorder) {
						unsafeWindow.updatePosition = [storeMenu.style.left, storeMenu.style.top, upgradeHolder.style.left, upgradeHolder.style.top]
						unsafeWindow.sendToLocal("addData", [Date.now().toString(), { type: "updatePosition", data: [unsafeWindow.updatePosition] }])
					}
				} else if (event.code == "Period") {
					distance = distance == 700 ? 700 / 2 : 700
				}
			}
		})

		unsafeWindow.addEventListener("mousedown", (event) => {
			if (
				inGame &&
				event.button == 1 &&
				document.getElementById("allianceMenu").style.display != "block" &&
				document.getElementById("chatHolder").style.display != "block"
			) {
				let storeMenu = document.getElementById("storeMenu")
				if (toggle) {
					toggle = false

					storeMenu.style.transform = null
					storeMenu.style.left = null
					storeMenu.style.top = null

					upgradeHolder.style.transform = null
					upgradeHolder.style.left = null
					upgradeHolder.style.top = null
				} else {
					toggle = true

					storeMenu.style.transform = "translateX(calc(-50% + 200px))"
					storeMenu.style.left = mouse.x - 370 + "px"
					storeMenu.style.top = mouse.y - 100 + "px"

					upgradeHolder.style.transform = "translateX(-50%)"
					upgradeHolder.style.left = mouse.x + "px"
					upgradeHolder.style.top = mouse.y - 33 + "px"
				}

				if (unsafeWindow.recorder) {
					unsafeWindow.updatePosition = [storeMenu.style.left, storeMenu.style.top, upgradeHolder.style.left, upgradeHolder.style.top]
					unsafeWindow.sendToLocal("addData", [Date.now().toString(), { type: "updatePosition", data: [unsafeWindow.updatePosition] }])
				}
			}
		})

		document.getElementById("touch-controls-fullscreen").addEventListener("mousemove", (event) => {
			mouse.x = event.clientX
			mouse.y = event.clientY
		})
	})
})()
