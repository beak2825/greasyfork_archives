// ==UserScript==
// @name         MooMoo.io Reload Timer
// @description  Helps you determine the reload time of your weapon(s)
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.4.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/462089/MooMooio%20Reload%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/462089/MooMooio%20Reload%20Timer.meta.js
// ==/UserScript==

;(async () => {
	unsafeWindow.reloadTimer = true

	let weaponSpeed = [300, 400, 400, 300, 300, 700, 300, 100, 400, 600, 400, 0, 700, 230, 700, 1500]
	let weaponSrc = [
		"hammer_1",
		"axe_1",
		"great_axe_1",
		"sword_1",
		"samurai_1",
		"spear_1",
		"bat_1",
		"dagger_1",
		"stick_1",
		"bow_1",
		"great_hammer_1",
		"shield_1",
		"crossbow_1",
		"crossbow_2",
		"grab_1",
		"musket_1"
	]
	var myPlayer,
		mySID,
		inGame = false,
		reloads = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	var now, delta, lastUpdate
	const reloadTimer1 = document.createElement("div")
	reloadTimer1.id = "reloadTimer1"
	reloadTimer1.className = "resourceDisplay"
	reloadTimer1.innerText = "0"

	const reloadTimer2 = document.createElement("div")
	reloadTimer2.id = "reloadTimer2"
	reloadTimer2.className = "resourceDisplay"
	reloadTimer2.innerText = "-"

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
							inGame = true
							mySID = data[0]
							break
						case PACKETCODE.RECEIVE.killPlayer:
							inGame = false
							reloads = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
							break
						case PACKETCODE.RECEIVE.gatherAnimation:
							if (data[0] == mySID) reloads[data[2]] = weaponSpeed[data[2]]
							break
						case PACKETCODE.RECEIVE.addProjectile:
							if ([1000, 1200, 1400].includes(data[3])) {
								let projectileID
								switch (data[5]) {
									case 0:
										projectileID = 9
										break
									case 2:
										projectileID = 12
										break
									case 3:
										projectileID = 13
										break
									case 5:
										projectileID = 15
										break
									default:
										projectileID = null
								}
								let x = data[0] - Math.cos(data[2]) * 35
								let y = data[1] - Math.sin(data[2]) * 35
								if (Math.sqrt((x -= myPlayer.x) * x + (y -= myPlayer.y) * y) <= 70) reloads[projectileID] = weaponSpeed[projectileID]
							}
							break
					}
				})
			}

			resolve(this)
		}
	})

	function updateReload() {
		now = Date.now()
		delta = now - lastUpdate
		lastUpdate = now
		if (inGame && myPlayer) {
			if (myPlayer.buildIndex == -1) {
				reloads[myPlayer.weaponIndex] = Math.max(0, reloads[myPlayer.weaponIndex] - delta)
			}
			if (myPlayer.weapons[0] != null) {
				reloadTimer1.style.backgroundImage = `url(../img/weapons/${weaponSrc[myPlayer.weapons[0]]}.png)`
				reloadTimer1.innerText = reloads[myPlayer.weapons[0]]
			}
			if (myPlayer.weapons[1] != null) {
				reloadTimer2.style.backgroundImage = `url(../img/weapons/${weaponSrc[myPlayer.weapons[1]]}.png)`
				reloadTimer2.style.backgroundColor = "rgba(0, 0, 0, 0.25)"
				reloadTimer2.innerText = reloads[myPlayer.weapons[1]]
			} else {
				reloadTimer2.style.backgroundImage = null
				reloadTimer2.style.backgroundColor = null
				reloadTimer2.innerText = "-"
			}
		}
		unsafeWindow.requestAnimationFrame(updateReload)
	}
	lastUpdate = Date.now()
	unsafeWindow.requestAnimationFrame(updateReload)

	function waitForElm(selector) {
		return new Promise((resolve) => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector))
			}

			const observer = new MutationObserver((mutations) => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector))
					observer.disconnect()
				}
			})

			observer.observe(document.body, {
				childList: true,
				subtree: true
			})
		})
	}

	const symbol = Symbol("minimapCounter")
	Object.defineProperty(Object.prototype, "minimapCounter", {
		get() {
			return this[symbol]
		},
		set(value) {
			this[symbol] = value
			if (this.isPlayer === true && this.sid === mySID) {
				myPlayer = this
			}
		},
		configurable: true
	})

	waitForElm("#topInfoHolder").then((topInfoHolder) => {
		const style = document.createElement("style")
		style.innerHTML = `
        #reloadTimer1 {
            right: 0px;
            margin-top: 65px;
            color: #fff;
            font-size: 28px;
            background-color: rgba(0, 0, 0, 0.25);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }

        #reloadTimer2 {
            right: 0px;
            margin-top: 120px;
            color: #fff;
            font-size: 28px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
        `
		document.head.appendChild(style)

		topInfoHolder.appendChild(reloadTimer1)
		topInfoHolder.appendChild(reloadTimer2)
	})
})()
