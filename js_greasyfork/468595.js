// ==UserScript==
// @name         MooMoo.io Move Camera
// @description  Move the x-offset and y-offset of your canvas to match a player's position
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.3.2
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/468595/MooMooio%20Move%20Camera.user.js
// @updateURL https://update.greasyfork.org/scripts/468595/MooMooio%20Move%20Camera.meta.js
// ==/UserScript==

/*
In the chatbox:
- Type "/moveto sid" to move the x-offset and y-offset of your canvas to the position of a player
- To show players' sid, type "/showsid"
- To hide players' sid, type "/hidesid"
- If you wish to return to the normal x-offset and y-offset of your canvas, type "/stop"
*/

;(async () => {
	unsafeWindow.movecamera = true

	let mySID = null
	let showSID = false
	let camera = false
	let follow = {
		exist: false,
		sid: null,
		x: null,
		y: null,
		x1: null,
		x2: null,
		y1: null,
		y2: null,
		dt: 0
	}

	let now, delta, lastUpdate
	function update() {
		now = Date.now()
		if (lastUpdate == null) {
			lastUpdate = now
		}
		delta = now - lastUpdate
		lastUpdate = now

		if (camera && follow.sid != null && follow.exist === true) {
			follow.dt += delta
			let tmpRate = Math.min(1.7, follow.dt / 170)
			let xdiff = follow.x2 - follow.x1
			let ydiff = follow.y2 - follow.y1
			follow.x = follow.x1 + xdiff * tmpRate
			follow.y = follow.y1 + ydiff * tmpRate
		}
		unsafeWindow.requestAnimationFrame(update)
	}
	update()

	let init = false
	await new Promise(async (resolve) => {
		let { send } = WebSocket.prototype

		WebSocket.prototype.send = function (...x) {
			send.apply(this, x)
			this.send = send
			if (!init) {
				init = true
				this.addEventListener("message", (e) => {
					if (!e.origin.includes("moomoo.io") && !unsafeWindow.privateServer) return
					const [packet, data] = msgpack.decode(new Uint8Array(e.data))
					switch (packet) {
						case PACKETCODE.RECEIVE.setupGame:
							mySID = data[0]
							break
						case PACKETCODE.RECEIVE.updatePlayers:
							if (follow.sid != null && camera) {
								follow.exist = false
								for (let i = 0; i < data[0].length; i += 13) {
									if (data[0][i] === follow.sid) {
										follow.exist = true
										follow.x1 = follow.x || data[0][i + 1]
										follow.y1 = follow.y || data[0][i + 2]
										follow.x2 = data[0][i + 1]
										follow.y2 = data[0][i + 2]
										follow.dt = 0
										break
									}
								}
							}
							break
						case PACKETCODE.RECEIVE.receiveChat:
							if (data[0] === mySID) {
								if (data[1] == "/showsid") {
									showSID = true
								} else if (data[1] == "/hidesid") {
									showSID = false
								} else if (data[1].startsWith("/moveto")) {
									let e = data[1].split(" ")
									if (e[1] != null && Number(e[1]) != NaN) {
										follow.sid = Number(e[1])
									}
									camera = true
								} else if (data[1] == "/stop") {
									camera = false
									follow = {
										exist: false,
										sid: null,
										x: null,
										y: null,
										x1: null,
										x2: null,
										y1: null,
										y2: null,
										dt: 0
									}
								}
							}
							break
					}
				})
			}
			resolve(this)
		}
	})

	const symbol = Symbol("PositionX")
	Object.defineProperty(Object.prototype, "x", {
		get() {
			if (this.isPlayer === true && this.sid === mySID && camera && follow.sid != null && follow.exist === true) {
				return follow.x
			}
			return this[symbol]
		},
		set(value) {
			this[symbol] = value
		},
		configurable: true
	})

	const symbol2 = Symbol("PositionY")
	Object.defineProperty(Object.prototype, "y", {
		get() {
			if (this.isPlayer === true && this.sid === mySID && camera && follow.sid != null && follow.exist === true) {
				this.visible = false
				return follow.y
			}
			return this[symbol2]
		},
		set(value) {
			this[symbol2] = value
		},
		configurable: true
	})

	const symbol3 = Symbol("MooMooName")
	Object.defineProperty(Object.prototype, "name", {
		get() {
			if (this.isPlayer === true && showSID) {
				return this[symbol3] + ` [${this.sid}]`
			} else {
				return this[symbol3]
			}
		},
		set(value) {
			this[symbol3] = value
		},
		configurable: true
	})
})()
