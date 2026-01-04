// ==UserScript==
// @name         MooMoo.io Items Marker
// @description  Draws markers on items
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js
// @run-at       document-start
// @grant		 unsafeWindow
// @license      MIT
// @version      0.4.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/479185/MooMooio%20Items%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/479185/MooMooio%20Items%20Marker.meta.js
// ==/UserScript==

// This script was originally made by Murka007
// https://greasyfork.org/en/scripts/447475
/*
	Original Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/sG9cyfGPj5
    Greasyfork: https://greasyfork.org/en/users/919633
    MooMooForge: https://github.com/MooMooForge
*/

;(async () => {
	const MARKER_COLOUR = {
		MY_PLAYER: {
			render: true,
			colour: "#a7f060"
		},
		TEAMMATE: {
			render: true,
			colour: "#fceb65"
		},
		ENEMY: {
			render: true,
			colour: "#f76363"
		}
	}
	const MARKER_SIZE = 10

	function getItemColour(sid) {
		if (sid === myPlayerSID) return MARKER_COLOUR.MY_PLAYER
		if (teammates.includes(sid)) return MARKER_COLOUR.TEAMMATE
		return MARKER_COLOUR.ENEMY
	}

	var myPlayerSID = null
	var teammates = []

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
							myPlayerSID = data[0]
							break
						case PACKETCODE.RECEIVE.setPlayerTeam:
							if (data[0] == null) {
								teammates = []
							}
							break
						case PACKETCODE.RECEIVE.setAlliancePlayers:
							teammates = []
							for (let i = 0; i < data[0].length; i += 2) {
								const [sid, name] = data[0].slice(i, i + 2)
								teammates.push(sid)
							}
							break
					}
				})
			}
			resolve(this)
		}
	})

	let item = null
	const symbol = Symbol("isItem")
	Object.defineProperty(Object.prototype, "isItem", {
		get() {
			if (this[symbol] === true) {
				item = this
			}
			return this[symbol]
		},
		set(value) {
			this[symbol] = value
		},
		configurable: true
	})

	function drawMarker(ctx) {
		if (!item || !item.owner || myPlayerSID === null) return
		const type = getItemColour(item.owner.sid)

		if (!type.render) return

		ctx.fillStyle = type.colour
		ctx.beginPath()
		ctx.arc(0, 0, MARKER_SIZE, 0, 2 * Math.PI)
		ctx.fill()
		item = null
	}

	// This method is called when item was drawn
	CanvasRenderingContext2D.prototype.restore = new Proxy(CanvasRenderingContext2D.prototype.restore, {
		apply(target, _this, args) {
			drawMarker(_this)
			return target.apply(_this, args)
		}
	})
})()
