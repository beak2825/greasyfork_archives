// ==UserScript==
// @name         MooMoo.io Custom Store
// @description  Customize store
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.10.2/Sortable.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      1.1.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/461745/MooMooio%20Custom%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/461745/MooMooio%20Custom%20Store.meta.js
// ==/UserScript==
/*
- Right-click the Store Button to access the editing options
- Press "B" to toggle store menu
- To change the order of your hats and accessories, simply drag and drop them to the desired position
- Add a blank space to give your collection some extra style
- Don't need a particular hat or accessory? Delete it with just a click
- Export your changes or import customizations
*/

;(async () => {
	unsafeWindow.customStore = true
	const elementID = (id) => {
		return document.getElementById(id)
	}
	const myPlayer = {
		sid: null,
		tails: {},
		skins: {},
		tailIndex: 0,
		skinIndex: 0,
		team: null
	}
	var inGame = false
	var alliances = []
	var alliancePlayers = []
	var totalAllianceEle = 0
	var currentAllianceEle = 0
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
						case PACKETCODE.RECEIVE.updateStoreItems:
							if (data[2]) {
								if (!data[0]) {
									myPlayer.tails[data[1]] = 1
								} else {
									myPlayer.tailIndex = data[1]
								}
							} else {
								if (!data[0]) {
									myPlayer.skins[data[1]] = 1
								} else {
									myPlayer.skinIndex = data[1]
								}
							}
							if (elementID("storeMenu").style.display == "block") {
								generateStoreList()
							}
							break
						case PACKETCODE.RECEIVE.setupGame:
							myPlayer.sid = data[0]
							inGame = true
							break
						case PACKETCODE.RECEIVE.killPlayer:
							inGame = false
							break
						case PACKETCODE.RECEIVE.addAlliance:
							alliances.push(data[0])
							totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length
							currentAllianceEle = Math.min(totalAllianceEle - 5, currentAllianceEle + 5)
							if (elementID("allianceMenu").style.display == "block") {
								showAllianceMenu()
							}
							break
						case PACKETCODE.RECEIVE.setPlayerTeam:
							myPlayer.team = data[0]
							myPlayer.isOwner = data[1]
							currentAllianceEle = 0
							totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length
							if (elementID("allianceMenu").style.display == "block") {
								showAllianceMenu()
							}
							break
						case PACKETCODE.RECEIVE.setAlliancePlayers:
							alliancePlayers = data[0]
							totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length
							currentAllianceEle = Math.min(totalAllianceEle - 5, currentAllianceEle + 5)
							if (elementID("allianceMenu").style.display == "block") {
								showAllianceMenu()
							}
							break
						case PACKETCODE.RECEIVE.deleteAlliance:
							for (var i = alliances.length - 1; i >= 0; i--) {
								if (alliances[i].sid == data[0]) {
									alliances.splice(i, 1)
									break
								}
							}
							totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length
							currentAllianceEle = Math.min(totalAllianceEle - 5, currentAllianceEle + 5)
							if (elementID("allianceMenu").style.display == "block") {
								showAllianceMenu()
							}
							break
						case PACKETCODE.RECEIVE.setInitData:
							alliances = data[0].teams
							totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length
							break
					}
				})
			}
			resolve(this)
		}
	})

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

	const customStoreHolder = document.createElement("div")
	customStoreHolder.id = "customStoreHolder"
	const customStoreScrollBar = document.createElement("div")
	customStoreScrollBar.id = "customStoreScrollBar"
	waitForElm("#storeHolder").then((storeHolder) => {
		const style = document.createElement("style")
		style.innerHTML = `
            #customStoreHolder {
                pointer-events: all;
                width: 400px;
                display: inline-block;
                background-color: rgba(0, 0, 0, 0.25);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                color: #fff;
                padding: 10px;
                height: 200px;
                max-height: calc(100vh - 200px);
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch;
            }
			.storeItem {
				font-size: 24px;
			}
			.hatPreview {
				width: 45px;
				height: 45px;
			}
			.joinAlBtn {
				font-size: 24px;
			}
			.itemPrice {
				font-size: 24px;
			}
			#customStoreScrollBar {
				display: none;
				position: absolute;
				width: 3px;
				background: white;
				left: calc(50% + 210px - 3px);
				border-radius: 10px;
			}
        `
		document.head.appendChild(style)
		storeHolder.parentNode.insertBefore(customStoreHolder, storeHolder.nextSibling)
		storeHolder.parentNode.insertBefore(customStoreScrollBar, storeHolder.nextSibling)
		storeHolder.style.display = "none"
	})

	var currentStoreIndex = 0
	var store = {
		hats: [
			{
				id: 51,
				name: "Moo Cap",
				price: 0,
				scale: 120,
				desc: "coolest mooer around"
			},
			{
				id: 50,
				name: "Apple Cap",
				price: 0,
				scale: 120,
				desc: "apple farms remembers"
			},
			{
				id: 28,
				name: "Moo Head",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 29,
				name: "Pig Head",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 30,
				name: "Fluff Head",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 36,
				name: "Pandou Head",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 37,
				name: "Bear Head",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 38,
				name: "Monkey Head",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 44,
				name: "Polar Head",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 35,
				name: "Fez Hat",
				price: 0,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 42,
				name: "Enigma Hat",
				price: 0,
				scale: 120,
				desc: "join the enigma army"
			},
			{
				id: 43,
				name: "Blitz Hat",
				price: 0,
				scale: 120,
				desc: "hey everybody i'm blitz"
			},
			{
				id: 49,
				name: "Bob XIII Hat",
				price: 0,
				scale: 120,
				desc: "like and subscribe"
			},
			{
				id: 57,
				name: "Pumpkin",
				price: 50,
				scale: 120,
				desc: "Spooooky"
			},
			{
				id: 8,
				name: "Bummle Hat",
				price: 100,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 2,
				name: "Straw Hat",
				price: 500,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 15,
				name: "Winter Cap",
				price: 600,
				scale: 120,
				desc: "allows you to move at normal speed in snow",
				coldM: 1
			},
			{
				id: 5,
				name: "Cowboy Hat",
				price: 1000,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 4,
				name: "Ranger Hat",
				price: 2000,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 18,
				name: "Explorer Hat",
				price: 2000,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 31,
				name: "Flipper Hat",
				price: 2500,
				scale: 120,
				desc: "have more control while in water",
				watrImm: true
			},
			{
				id: 1,
				name: "Marksman Cap",
				price: 3000,
				scale: 120,
				desc: "increases arrow speed and range",
				aMlt: 1.3
			},
			{
				id: 10,
				name: "Bush Gear",
				price: 3000,
				scale: 160,
				desc: "allows you to disguise yourself as a bush"
			},
			{
				id: 48,
				name: "Halo",
				price: 3000,
				scale: 120,
				desc: "no effect"
			},
			{
				id: 6,
				name: "Soldier Helmet",
				price: 4000,
				scale: 120,
				desc: "reduces damage taken but slows movement",
				spdMult: 0.94,
				dmgMult: 0.75
			},
			{
				id: 23,
				name: "Anti Venom Gear",
				price: 4000,
				scale: 120,
				desc: "makes you immune to poison",
				poisonRes: 1
			},
			{
				id: 13,
				name: "Medic Gear",
				price: 5000,
				scale: 110,
				desc: "slowly regenerates health over time",
				healthRegen: 3
			},
			{
				id: 9,
				name: "Miners Helmet",
				price: 5000,
				scale: 120,
				desc: "earn 1 extra gold per resource",
				extraGold: 1
			},
			{
				id: 32,
				name: "Musketeer Hat",
				price: 5000,
				scale: 120,
				desc: "reduces cost of projectiles",
				projCost: 0.5
			},
			{
				id: 7,
				name: "Bull Helmet",
				price: 6000,
				scale: 120,
				desc: "increases damage done but drains health",
				healthRegen: -5,
				dmgMultO: 1.5,
				spdMult: 0.96
			},
			{
				id: 22,
				name: "Emp Helmet",
				price: 6000,
				scale: 120,
				desc: "turrets won't attack but you move slower",
				antiTurret: 1,
				spdMult: 0.7
			},
			{
				id: 12,
				name: "Booster Hat",
				price: 6000,
				scale: 120,
				desc: "increases your movement speed",
				spdMult: 1.16
			},
			{
				id: 26,
				name: "Barbarian Armor",
				price: 8000,
				scale: 120,
				desc: "knocks back enemies that attack you",
				dmgK: 0.6
			},
			{
				id: 21,
				name: "Plague Mask",
				price: 10000,
				scale: 120,
				desc: "melee attacks deal poison damage",
				poisonDmg: 5,
				poisonTime: 6
			},
			{
				id: 46,
				name: "Bull Mask",
				price: 10000,
				scale: 120,
				desc: "bulls won't target you unless you attack them",
				bullRepel: 1
			},
			{
				id: 14,
				name: "Windmill Hat",
				topSprite: true,
				price: 10000,
				scale: 120,
				desc: "generates points while worn",
				pps: 1.5
			},
			{
				id: 11,
				name: "Spike Gear",
				topSprite: true,
				price: 10000,
				scale: 120,
				desc: "deal damage to players that damage you",
				dmg: 0.45
			},
			{
				id: 53,
				name: "Turret Gear",
				topSprite: true,
				price: 10000,
				scale: 120,
				desc: "you become a walking turret",
				turret: {
					proj: 1,
					range: 700,
					rate: 2500
				},
				spdMult: 0.7
			},
			{
				id: 20,
				name: "Samurai Armor",
				price: 12000,
				scale: 120,
				desc: "increased attack speed and fire rate",
				atkSpd: 0.78
			},
			{
				id: 58,
				name: "Dark Knight",
				price: 12000,
				scale: 120,
				desc: "restores health when you deal damage",
				healD: 0.4
			},
			{
				id: 27,
				name: "Scavenger Gear",
				price: 15000,
				scale: 120,
				desc: "earn double points for each kill",
				kScrM: 2
			},
			{
				id: 40,
				name: "Tank Gear",
				price: 15000,
				scale: 120,
				desc: "increased damage to buildings but slower movement",
				spdMult: 0.3,
				bDmg: 3.3
			},
			{
				id: 52,
				name: "Thief Gear",
				price: 15000,
				scale: 120,
				desc: "steal half of a players gold when you kill them",
				goldSteal: 0.5
			},
			{
				id: 55,
				name: "Bloodthirster",
				price: 20000,
				scale: 120,
				desc: "Restore Health when dealing damage. And increased damage",
				healD: 0.25,
				dmgMultO: 1.2
			},
			{
				id: 56,
				name: "Assassin Gear",
				price: 20000,
				scale: 120,
				desc: "Go invisible when not moving. Can't eat. Increased speed",
				noEat: true,
				spdMult: 1.1,
				invisTimer: 1000
			}
		],
		accessories: [
			{
				id: 12,
				name: "Snowball",
				price: 1000,
				scale: 105,
				xOff: 18,
				desc: "no effect"
			},
			{
				id: 9,
				name: "Tree Cape",
				price: 1000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 10,
				name: "Stone Cape",
				price: 1000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 3,
				name: "Cookie Cape",
				price: 1500,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 8,
				name: "Cow Cape",
				price: 2000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 11,
				name: "Monkey Tail",
				price: 2000,
				scale: 97,
				xOff: 25,
				desc: "Super speed but reduced damage",
				spdMult: 1.35,
				dmgMultO: 0.2
			},
			{
				id: 17,
				name: "Apple Basket",
				price: 3000,
				scale: 80,
				xOff: 12,
				desc: "slowly regenerates health over time",
				healthRegen: 1
			},
			{
				id: 6,
				name: "Winter Cape",
				price: 3000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 4,
				name: "Skull Cape",
				price: 4000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 5,
				name: "Dash Cape",
				price: 5000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 2,
				name: "Dragon Cape",
				price: 6000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 1,
				name: "Super Cape",
				price: 8000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 7,
				name: "Troll Cape",
				price: 8000,
				scale: 90,
				desc: "no effect"
			},
			{
				id: 14,
				name: "Thorns",
				price: 10000,
				scale: 115,
				xOff: 20,
				desc: "no effect"
			},
			{
				id: 15,
				name: "Blockades",
				price: 10000,
				scale: 95,
				xOff: 15,
				desc: "no effect"
			},
			{
				id: 20,
				name: "Devils Tail",
				price: 10000,
				scale: 95,
				xOff: 20,
				desc: "no effect"
			},
			{
				id: 16,
				name: "Sawblade",
				price: 12000,
				scale: 90,
				spin: true,
				xOff: 0,
				desc: "deal damage to players that damage you",
				dmg: 0.15
			},
			{
				id: 13,
				name: "Angel Wings",
				price: 15000,
				scale: 138,
				xOff: 22,
				desc: "slowly regenerates health over time",
				healthRegen: 3
			},
			{
				id: 19,
				name: "Shadow Wings",
				price: 15000,
				scale: 138,
				xOff: 22,
				desc: "increased movement speed",
				spdMult: 1.1
			},
			{
				id: 18,
				name: "Blood Wings",
				price: 20000,
				scale: 178,
				xOff: 26,
				desc: "restores health when you deal damage",
				healD: 0.2
			},
			{
				id: 21,
				name: "Corrupt X Wings",
				price: 20000,
				scale: 178,
				xOff: 26,
				desc: "deal damage to players that damage you",
				dmg: 0.25
			}
		]
	}
	for (let i = 0; i < store.hats.length; ++i) {
		if (store.hats[i].price <= 0) {
			myPlayer.skins[store.hats[i].id] = 1
		}
	}
	for (let i = 0; i < store.accessories.length; ++i) {
		if (store.accessories[i].price <= 0) {
			myPlayer.tails[store.accessories[i].id] = 1
		}
	}
	var checkRealStore = JSON.parse(localStorage.getItem("realStore"))
	if (checkRealStore == null) {
		localStorage.setItem("realStore", JSON.stringify(store))
	}
	var customStore = JSON.parse(localStorage.getItem("customStore"))
	if (customStore == null) {
		customStore = store
		localStorage.setItem("customStore", JSON.stringify(store))
	}

	var totalShopEle = customStore.hats.length
	var currentShopEle = 0
	function updateScroll() {
		if (customStoreButton.style.background == "red") return
		const elements = document.querySelectorAll("#customStoreHolder > .storeItem")
		const storeArray = []
		for (let i = 0; i < elements.length; i++) {
			if (currentShopEle <= i && i < currentShopEle + 4) {
				elements[i].style.display = null
				storeArray.push(tmpArray[i].blank ? "blank" : tmpArray[i].id)
			} else {
				elements[i].style.display = "none"
			}
		}

		const elementHeight = 220 / elements.length
		customStoreScrollBar.style.height = `${elementHeight * 4}px`
		customStoreScrollBar.style.marginTop = `${elementHeight * currentShopEle}px`
		customStoreScrollBar.style.display = elements.length <= 4 ? "none" : "block"
		if (unsafeWindow.recorder) {
			unsafeWindow.updateStoreData = [currentStoreIndex, storeArray, elements.length, currentShopEle]
			unsafeWindow.sendToLocal("addData", [
				Date.now().toString(),
				{ type: "updateStore", data: [currentStoreIndex, storeArray, elements.length, currentShopEle] }
			])
		}
	}
	customStoreHolder.addEventListener("wheel", (event) => {
		if (event.wheelDelta > 0) {
			currentShopEle = Math.max(0, currentShopEle - 4)
		} else {
			currentShopEle = Math.min(totalShopEle - 4, currentShopEle + 4)
		}
		updateScroll()
	})

	var sortable = null,
		tmpArray
	function generateStoreList() {
		if (inGame) {
			while (customStoreHolder.hasChildNodes()) {
				customStoreHolder.removeChild(customStoreHolder.lastChild)
			}
			var index = currentStoreIndex
			tmpArray = index ? customStore.accessories : customStore.hats
			totalShopEle = tmpArray.length
			addEdit.style.display = customStoreButton.style.background == "red" ? null : "none"
			reloadEdit.style.display = customStoreButton.style.background == "red" ? null : "none"
			importBut.style.display = customStoreButton.style.background == "red" ? null : "none"
			exportBut.style.display = customStoreButton.style.background == "red" ? null : "none"
			customStoreHolder.style.overflowY = customStoreButton.style.background == "red" ? null : "hidden"
			Array.from(tmpArray).forEach((ele) => {
				let tmp = document.createElement("div")
				tmp.id = "storeDisplay" + ele.id
				tmp.className = "storeItem"
				customStoreHolder.appendChild(tmp)

				let childtmp
				if (!ele.blank) {
					tmp.onmouseout = () => {
						unsafeWindow.showItemInfo()
					}
					tmp.onmouseover = () => {
						unsafeWindow.showItemInfo(ele, false, true)
					}

					childtmp = document.createElement("img")
					childtmp.className = "hatPreview"
					childtmp.src = "../img/" + (index ? "accessories/access_" : "hats/hat_") + ele.id + (ele.topSprite ? "_p" : "") + ".png"
					tmp.appendChild(childtmp)

					childtmp = document.createElement("span")
					childtmp.textContent = ele.name
					tmp.appendChild(childtmp)
				} else {
					childtmp = document.createElement("div")
					childtmp.className = "hatPreview"
					tmp.appendChild(childtmp)
				}

				if (customStoreButton.style.background == "red") {
					childtmp = document.createElement("div")
					childtmp.className = "joinAlBtn"
					childtmp.style = "margin-top: 5px"
					childtmp.textContent = "Delete"
					tmp.appendChild(childtmp)
					childtmp.onclick = () => {
						let arr = index ? customStore.accessories : customStore.hats
						const objWithIdIndex = arr.findIndex((obj) => obj.id === ele.id)
						if (objWithIdIndex > -1) {
							arr.splice(objWithIdIndex, 1)
						}
						localStorage.setItem("customStore", JSON.stringify(customStore))
						generateStoreList()
					}
				} else if (!ele.blank) {
					if (index ? !myPlayer.tails[ele.id] : !myPlayer.skins[ele.id]) {
						childtmp = document.createElement("div")
						childtmp.className = "joinAlBtn"
						childtmp.style = "margin-top: 5px"
						childtmp.textContent = "Buy"
						childtmp.onclick = () => {
							unsafeWindow.storeBuy(ele.id, index)
						}
						tmp.appendChild(childtmp)

						childtmp = document.createElement("span")
						childtmp.className = "itemPrice"
						childtmp.textContent = ele.price
						tmp.appendChild(childtmp)
					} else if ((index ? myPlayer.tailIndex : myPlayer.skinIndex) == ele.id) {
						childtmp = document.createElement("div")
						childtmp.className = "joinAlBtn"
						childtmp.style = "margin-top: 5px"
						childtmp.textContent = "Unequip"
						childtmp.onclick = () => {
							unsafeWindow.storeEquip(0, index)
						}
						tmp.appendChild(childtmp)
					} else {
						childtmp = document.createElement("div")
						childtmp.className = "joinAlBtn"
						childtmp.style = "margin-top: 5px"
						childtmp.textContent = "Equip"
						childtmp.onclick = () => {
							unsafeWindow.storeEquip(ele.id, index)
						}
						tmp.appendChild(childtmp)
					}
				}
			})
			updateScroll()
			if (customStoreButton.style.background == "red") {
				if (sortable != null) {
					sortable.destroy()
				}
				sortable = new Sortable.create(customStoreHolder, {
					animation: 150,
					onUpdate: (event) => {
						let arr = index ? customStore.accessories : customStore.hats
						if (event.newIndex >= arr.length) {
							var k = event.newIndex - arr.length + 1
							while (k--) {
								arr.push(undefined)
							}
						}
						arr.splice(event.newIndex, 0, arr.splice(event.oldIndex, 1)[0])
						localStorage.setItem("customStore", JSON.stringify(customStore))
					}
				})
			} else {
				if (sortable != null) {
					sortable.destroy()
					sortable = null
				}
			}
		}
	}

	const customStoreButton = document.createElement("div")
	customStoreButton.id = "customStoreButton"
	customStoreButton.className = "uiElement gameButton"
	customStoreButton.innerHTML = `<i class="material-icons" style="font-size:40px; vertical-align:middle"></i>`
	customStoreButton.onclick = () => {
		if (elementID("storeMenu").style.display != "block") {
			elementID("storeMenu").style.display = "block"
			elementID("allianceMenu").style.display = "none"
			elementID("chatBox").value = ""
			elementID("chatHolder").style.display = "none"
			generateStoreList()
		} else {
			elementID("storeMenu").style.display = "none"
			customStoreButton.style.background = null
		}
	}
	customStoreButton.oncontextmenu = (event) => {
		event.preventDefault()
		if (elementID("storeMenu").style.display != "block") {
			elementID("storeMenu").style.display = "block"
			elementID("allianceMenu").style.display = "none"
			elementID("chatBox").value = ""
			elementID("chatHolder").style.display = "none"
			if (customStoreButton.style.background != "red") {
				customStoreButton.style.background = "red"
			}
			generateStoreList()
		} else {
			elementID("storeMenu").style.display = "none"
			customStoreButton.style.background = null
		}
	}

	waitForElm("#storeButton").then((storeButton) => {
		const style = document.createElement("style")
		style.innerHTML = `
            #customStoreButton {
                right: 330px;
            }
            @media only screen and (max-width: 896px) {
                #customStoreButton {
                    top: inherit;
                    right: 60px;
                }
            }
        `
		document.head.appendChild(style)
		storeButton.parentNode.insertBefore(customStoreButton, storeButton.nextSibling)
		storeButton.hidden = true
	})

	waitForElm("#storeMenu > div:nth-child(1) > div:nth-child(1)").then((storeTab1) => {
		storeTab1.addEventListener("click", () => {
			currentStoreIndex = 0
			currentShopEle = 0
			generateStoreList()
		})
	})
	const addEdit = document.createElement("div")
	addEdit.className = "storeTab"
	addEdit.textContent = "Add Blank"
	addEdit.style.display = "none"
	addEdit.style.marginLeft = "10px"
	const reloadEdit = document.createElement("div")
	reloadEdit.className = "storeTab"
	reloadEdit.textContent = "Reload"
	reloadEdit.style.display = "none"
	reloadEdit.style.marginLeft = "10px"
	const importBut = document.createElement("div")
	importBut.className = "storeTab"
	importBut.textContent = "Import"
	importBut.style.marginLeft = "10px"
	const exportBut = document.createElement("div")
	exportBut.className = "storeTab"
	exportBut.textContent = "Export"
	exportBut.style.marginLeft = "10px"
	waitForElm("#storeMenu > div:nth-child(1) > div:nth-child(2)").then((storeTab2) => {
		storeTab2.addEventListener("click", () => {
			currentStoreIndex = 1
			currentShopEle = 0
			generateStoreList()
		})

		storeTab2.parentNode.appendChild(addEdit)
		addEdit.onclick = () => {
			let arr = currentStoreIndex ? customStore.accessories : customStore.hats
			let id = Math.max(...arr.map((el) => el.id)) + 1001

			let min = customStoreHolder.getBoundingClientRect().top + 10
			let top,
				index = 0
			let childrens = customStoreHolder.childNodes
			for (var i = 0; i < childrens.length; i++) {
				top = Math.abs(childrens[i].getBoundingClientRect().top)
				if (top <= min) {
					index = i + 1
				}
			}
			arr.splice(index, 0, { id: id, blank: true })
			localStorage.setItem("customStore", JSON.stringify(customStore))
			generateStoreList()
		}

		storeTab2.parentNode.appendChild(reloadEdit)
		reloadEdit.onclick = () => {
			let realStore = JSON.parse(localStorage.getItem("realStore"))
			currentStoreIndex ? (customStore.accessories = realStore.accessories) : (customStore.hats = realStore.hats)
			localStorage.setItem("customStore", JSON.stringify(customStore))
			currentShopEle = 0
			generateStoreList()
		}

		storeTab2.parentNode.appendChild(importBut)
		importBut.onclick = () => {
			const tmpEle = document.createElement("input")
			tmpEle.type = "file"
			tmpEle.style.display = "none"
			document.body.appendChild(tmpEle)
			tmpEle.addEventListener("change", async () => {
				let data = await new Response(tmpEle.files[0]).json()
				customStore = data
				localStorage.setItem("customStore", JSON.stringify(data))
				tmpEle.remove()
				currentShopEle = 0
				generateStoreList()
			})
			tmpEle.click()
		}

		storeTab2.parentNode.appendChild(exportBut)
		exportBut.onclick = () => {
			let dataStr = JSON.stringify(customStore)
			let dataUri = "data:application/jsoncharset=utf-8," + encodeURIComponent(dataStr)

			let exportFileDefaultName = `customStore_${Date.now()}.json`

			let linkElement = document.createElement("a")
			linkElement.setAttribute("href", dataUri)
			linkElement.setAttribute("download", exportFileDefaultName)
			linkElement.click()
		}
	})

	unsafeWindow.addEventListener("keydown", (event) => {
		if (event.code == "Escape") {
			customStoreButton.style.background = null
		} else if (event.code == "KeyB" && document.activeElement.tagName != "INPUT" && inGame) {
			if (elementID("storeMenu").style.display != "block") {
				elementID("storeMenu").style.display = "block"
				elementID("allianceMenu").style.display = "none"
				elementID("chatBox").value = ""
				elementID("chatHolder").style.display = "none"
				generateStoreList()
			} else {
				elementID("storeMenu").style.display = "none"
				customStoreButton.style.background = null
			}
		}
	})

	const customAllianceHolder = document.createElement("div")
	customAllianceHolder.id = "customAllianceHolder"
	const customAllianceScrollBar = document.createElement("div")
	customAllianceScrollBar.id = "customAllianceScrollBar"
	waitForElm("#allianceHolder").then((allianceHolder) => {
		const style = document.createElement("style")
		style.innerHTML = `
            #customAllianceHolder {
                pointer-events: all;
				height: 200px;
				max-height: calc(100vh - 260px);
				overflow-y: hidden;
				-webkit-overflow-scrolling: touch;
				width: 350px;
				display: inline-block;
				text-align: left;
				padding: 10px;
				background-color: rgba(0, 0, 0, 0.25);
				-webkit-border-radius: 4px;
				-moz-border-radius: 4px;
				border-radius: 4px;
            }
			.allianceItem {
				height: 30px;
				font-size: 24px;
			}
			#allianceNoTribe {
				height: 30px;
				font-size: 24px;
				padding: 5px;
				color: #fff;
			}
			#customAllianceScrollBar {
				display: none;
				position: absolute;
				width: 3px;
				background: white;
				left: calc(50% + 185px - 3px);
				border-radius: 10px;
			}
        `
		document.head.appendChild(style)
		allianceHolder.parentNode.insertBefore(customAllianceHolder, allianceHolder.nextSibling)
		allianceHolder.parentNode.insertBefore(customAllianceScrollBar, allianceHolder.nextSibling)
		allianceHolder.style.display = "none"
	})

	customAllianceHolder.addEventListener("wheel", (event) => {
		if (event.wheelDelta > 0) {
			currentAllianceEle = Math.max(0, currentAllianceEle - 5)
		} else {
			currentAllianceEle = Math.min(totalAllianceEle - 5, currentAllianceEle + 5)
		}
		updateAllianceScroll()
	})
	function updateAllianceScroll() {
		const elements = document.querySelectorAll("#customAllianceHolder > .allianceItem")
		const allianceArray = []
		var tmpi = 0
		for (let i = 0; i < elements.length; i++) {
			if (currentAllianceEle <= i && i < currentAllianceEle + 5) {
				elements[i].style.display = null
				allianceArray.push({
					sid: myPlayer.team ? alliancePlayers[tmpi] : null,
					text: myPlayer.team ? alliancePlayers[tmpi + 1] : alliances[i]
				})
			} else {
				elements[i].style.display = "none"
			}

			tmpi += 2
		}

		if (allianceArray.length <= 0 && document.getElementById("allianceNoTribe") == null) {
			let tmp = document.createElement("div")
			tmp.id = "allianceNoTribe"
			tmp.textContent = "No Tribes Yet"
			customAllianceHolder.appendChild(tmp)
		}

		const elementHeight = 220 / elements.length
		customAllianceScrollBar.style.height = `${elementHeight * 5}px`
		customAllianceScrollBar.style.marginTop = `${elementHeight * currentAllianceEle}px`
		customAllianceScrollBar.style.display = elements.length <= 5 ? "none" : "block"

		if (unsafeWindow.recorder) {
			unsafeWindow.updateAllianceData = [myPlayer.team, allianceArray, elements.length, currentAllianceEle]
			unsafeWindow.sendToLocal("addData", [
				Date.now().toString(),
				{ type: "updateAlliance", data: [myPlayer.team, allianceArray, elements.length, currentAllianceEle] }
			])
		}
	}

	waitForElm("#allianceButton").then((ele) => {
		ele.addEventListener("click", () => {
			showAllianceMenu()
		})
	})

	function showAllianceMenu() {
		if (inGame) {
			if (unsafeWindow.recorder) {
				unsafeWindow.sendToLocal("addData", [Date.now().toString(), { type: "changeInputText", data: ["allianceInput", ""] }])
			}
			while (customAllianceHolder.hasChildNodes()) {
				customAllianceHolder.removeChild(customAllianceHolder.lastChild)
			}
			if (myPlayer.team) {
				for (let i = 0; i < alliancePlayers.length; i += 2) {
					let tmp = document.createElement("div")
					tmp.id = "allianceItem" + alliancePlayers[i]
					tmp.className = "allianceItem"
					tmp.style = "color:" + (alliancePlayers[i] == myPlayer.sid ? "#fff" : "rgba(255,255,255,0.6)")
					let tmp2 = document.createElement("span")
					tmp2.innerText = alliancePlayers[i + 1]
					tmp2.style.position = "absolute"
					tmp.appendChild(tmp2)
					customAllianceHolder.appendChild(tmp)

					if (myPlayer.isOwner && alliancePlayers[i] != myPlayer.sid) {
						let alliancePlayersArray = alliancePlayers
						let childtmp = document.createElement("div")
						childtmp.className = "joinAlBtn"
						childtmp.textContent = "Kick"
						childtmp.onclick = function () {
							unsafeWindow.kickFromClan(alliancePlayersArray[i])
						}
						tmp.appendChild(childtmp)
					}
				}
			} else if (alliances.length) {
				for (let i = 0; i < alliances.length; ++i) {
					let tmp = document.createElement("div")
					tmp.id = "allianceItem" + alliances[i].owner
					tmp.className = "allianceItem"
					tmp.style = "color:" + (alliances[i].sid == myPlayer.team ? "#fff" : "rgba(255,255,255,0.6)")
					let tmp2 = document.createElement("span")
					tmp2.innerText = alliances[i].sid
					tmp2.style.position = "absolute"
					tmp.appendChild(tmp2)
					customAllianceHolder.appendChild(tmp)

					let childtmp = document.createElement("div")
					childtmp.className = "joinAlBtn"
					childtmp.textContent = "Join"
					childtmp.onclick = function () {
						unsafeWindow.sendJoin(i)
					}
					tmp.appendChild(childtmp)
				}
			}
			updateAllianceScroll()
		}
	}
})()
