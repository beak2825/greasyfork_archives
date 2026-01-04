// ==UserScript==
// @name         🥗Salad Mod🥗
// @namespace    idk, idc
// @version      ALPHA 0.01
// @description  im a croissant. (controls are in the description)
// @author       :/-laura-:/
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js
// @license      Copyright © NKFLA/GA, Ltd.
// @downloadURL https://update.greasyfork.org/scripts/519403/%F0%9F%A5%97Salad%20Mod%F0%9F%A5%97.user.js
// @updateURL https://update.greasyfork.org/scripts/519403/%F0%9F%A5%97Salad%20Mod%F0%9F%A5%97.meta.js
// ==/UserScript==

alert('You are using a mod that is currently in its alpha state.');
alert('Occasional bugs may occur.');
alert('Enjoy anyways!');



    document.title = ('🥗ALPHA 0.01🥗');

document.getElementById('linksContainer2').innerHTML = ' Salad Mod is in Development ' ;
document.getElementById('gameName').innerHTML = '🥗Salad Mod🥗';
document.getElementById('diedText').innerHTML = 'Salads are Healthy!';
document.getElementById("enterGame").innerText = " → Go Touch Grass Nub ←";
document.getElementById('diedText').style.color = '#90EE90';
document.getElementById('gameName').style.color = '#90EE90';
document.getElementById('leaderboard').style.color = '#90EE90';
document.getElementById('loadingText').innerHTML = 'salad with chicken nuggets in the salad is better than a regular salad';

document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"
$('#leaderboard').append('ALPHA 0.01');

document.getElementById('ageText').style.color = '#90EE90';

localStorage.moofoll = !0;

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



