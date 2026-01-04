// ==UserScript==
// @name         Bonk Panel
// @version      0.4.2
// @author       KOOKY WARIROR
// @description  Have a better UI interface!
// @match        https://bonk.io/gameframe-release.html
// @icon		 https://bonk.io/graphics/tt/favicon-32x32.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.5/split.min.js
// @license      MIT
// @namespace    https://greasyfork.org/users/999838
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467892/Bonk%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/467892/Bonk%20Panel.meta.js
// ==/UserScript==

/*
Features
---------------------
- Command Helper (type "/" and it will show up)
- Show scores and rounds to win when in game
- Show system chat in game
- Show players in game
- Import skin
- Image overlay
- Choose Hex Colour (Skin Editor)

And more...
(discover it urself🕵️‍♀️)
*/

// SKINS
class BYTEBUFFER {
	constructor() {
		this.index = 0
		this.buffer = new ArrayBuffer(102400)
		this.view = new DataView(this.buffer)
		this.implicitClassAliasArray = []
		this.implicitStringArray = []
		this.bodgeCaptureZoneDataIdentifierArray = []
	}
	readByte() {
		let returnval = this.view.getUint8(this.index)
		this.index += 1
		return returnval
	}
	writeByte(val) {
		this.view.setUint8(this.index, val)
		this.index += 1
	}
	readInt() {
		let returnval = this.view.getInt32(this.index)
		this.index += 4
		return returnval
	}
	writeInt(val) {
		this.view.setInt32(this.index, val)
		this.index += 4
	}
	readShort() {
		let returnval = this.view.getInt16(this.index)
		this.index += 2
		return returnval
	}
	writeShort(val) {
		this.view.setInt16(this.index, val)
		this.index += 2
	}
	readBoolean() {
		return this.readByte() == 1
	}
	writeBoolean(val) {
		if (val) {
			this.writeByte(1)
		} else {
			this.writeByte(0)
		}
	}
	readFloat() {
		let returnval = this.view.getFloat32(this.index)
		this.index += 4
		return returnval
	}
	writeFloat(val) {
		this.view.setFloat32(this.index, val)
		this.index += 4
	}
	toBase64() {
		let tmpstring = ""
		let tmparray = new Uint8Array(this.buffer)
		for (let i = 0; i < this.index; i++) {
			tmpstring += String.fromCharCode(tmparray[i])
		}
		return window.btoa(tmpstring)
	}
	fromBase64(val1, val2) {
		let tmpatob = window.atob(val1)
		let tmplength = tmpatob.length
		let tmparray = new Uint8Array(tmplength)
		for (let i = 0; i < tmplength; i++) {
			tmparray[i] = tmpatob.charCodeAt(i)
		}
		if (val2 === true) {
			tmparray = window.pako.inflate(tmparray)
		}
		this.buffer = tmparray.buffer.slice(tmparray.byteOffset, tmparray.byteLength + tmparray.byteOffset)
		this.view = new DataView(this.buffer)
		this.index = 0
	}
}
class AVATAR {
	constructor() {
		this.layers = []
		this.bc = 4492031
	}
	randomBC(val) {
		this.bc = val.colors[Math.floor(Math.random() * val.colors.length)]
	}
	makeSafe() {
		if (!(this.bc >= 0 && this.bc <= 16777215)) {
			this.bc = 4492031
		}
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i]
			if (layer) {
				if (!(layer.id >= 1 && layer.id <= 115)) {
					layer.id = 1
				}
				if (!(layer.x >= -99999 && layer.x <= 99999)) {
					layer.x = 0
				}
				if (!(layer.y >= -99999 && layer.y <= 99999)) {
					layer.y = 0
				}
				if (!(layer.scale >= -10 && layer.scale <= 10)) {
					layer.scale = 0.25
				}
				if (!(layer.angle >= -9999 && layer.angle <= 9999)) {
					layer.angle = 0
				}
				if (typeof layer.flipX != "boolean") {
					layer.flipX = false
				}
				if (typeof layer.flipY != "boolean") {
					layer.flipY = false
				}
				if (!(layer.color >= 0 && layer.color <= 16777215)) {
					layer.color = 0
				}
			}
		}
		for (let i = 0; i < this.layers.length; i++) {
			if (this.layers[i] == null) {
				this.layers.splice(i, 1)
				i--
			}
		}
	}
	fromObject(val) {
		if (val) {
			if (val.layers && typeof val.layers == "object" && val.layers.length >= 0 && val.layers.length <= 16) {
				this.layers = val.layers
			}
			this.bc = val.bc
		}
		this.makeSafe()
	}
	toString() {
		let tmpbuffer = new BYTEBUFFER()
		tmpbuffer.writeByte(10)
		tmpbuffer.writeByte(7)
		tmpbuffer.writeByte(3)
		tmpbuffer.writeByte(97)
		tmpbuffer.writeShort(2)
		tmpbuffer.writeByte(9)
		tmpbuffer.writeByte(this.layers.length * 2 + 1)
		tmpbuffer.writeByte(1)
		for (let i = 0; i < this.layers.length; i++) {
			let layer = this.layers[i]
			tmpbuffer.writeByte(10)
			if (i == 0) {
				tmpbuffer.writeByte(7)
				tmpbuffer.writeByte(5)
				tmpbuffer.writeByte(97)
				tmpbuffer.writeByte(108)
			} else {
				tmpbuffer.writeByte(5)
			}
			tmpbuffer.writeShort(1)
			tmpbuffer.writeShort(layer.id)
			tmpbuffer.writeFloat(layer.scale)
			tmpbuffer.writeFloat(layer.angle)
			tmpbuffer.writeFloat(layer.x)
			tmpbuffer.writeFloat(layer.y)
			tmpbuffer.writeBoolean(layer.flipX)
			tmpbuffer.writeBoolean(layer.flipY)
			tmpbuffer.writeInt(layer.color)
		}
		tmpbuffer.writeInt(this.bc)
		return encodeURIComponent(tmpbuffer.toBase64())
	}
	fromString(val) {
		if (val == "") {
			return
		}
		try {
			let tmpdecoded = decodeURIComponent(val)
			let tmpbuffer = new BYTEBUFFER()
			tmpbuffer.fromBase64(tmpdecoded)
			function tmpfunction(functionval) {
				var P5t = [arguments]
				let tmpobj = {}
				if (functionval.readByte().toString(16) == "a") {
					if (functionval.readByte() == 7) {
						functionval.readByte()
						functionval.readByte()
						functionval.readByte()
					} else {
					}
					P5t[3] = functionval.readShort()
					tmpobj.id = functionval.readShort()
					tmpobj.scale = functionval.readFloat()
					tmpobj.angle = functionval.readFloat()
					tmpobj.x = functionval.readFloat()
					tmpobj.y = functionval.readFloat()
					tmpobj.flipX = functionval.readBoolean()
					tmpobj.flipY = functionval.readBoolean()
					tmpobj.color = functionval.readInt()
				} else {
					tmpobj = null
				}
				return tmpobj
			}
			let tmpbyte = tmpbuffer.readByte()
			let tmpbyte2 = tmpbuffer.readByte()
			let tmpbyte3 = tmpbuffer.readByte()
			let tmpbyte4 = tmpbuffer.readByte()
			let tmpbyte5 = tmpbuffer.readByte()
			let tmpbyteover2 = (tmpbuffer.readByte() - 1) / 2
			let tmpbyte6 = tmpbuffer.readByte()
			while (tmpbyte6 != 1) {
				let tmpnumber = 0
				if (tmpbyte6 == 3) {
					tmpnumber = tmpbuffer.readByte() - 48
				} else {
					if (tmpbyte6 == 5) {
						tmpnumber = (tmpbuffer.readByte() - 48) * 10 + (tmpbuffer.readByte() - 48)
					}
				}
				this.layers[tmpnumber] = tmpfunction(tmpbuffer)
				tmpbyte6 = tmpbuffer.readByte()
			}
			for (let i = 0; i < tmpbyteover2; i++) {
				this.layers[i] = tmpfunction(tmpbuffer)
			}
			if (tmpbuffer.readShort() >= 2) {
				this.bc = tmpbuffer.readInt()
			}
			this.makeSafe()
		} catch (M8n) {
			this.layers = []
			this.bc = 4492031
		}
	}
}
fetch("https://raw.githubusercontent.com/kookywarrior/bonkio-skins/main/skins.js")
	.then((response) => response.text())
	.then((response) => {
		eval(response)
	})
	.catch((err) => console.log(err))

// REMOVE ANNOYING STUFF
function removeEleByID(id) {
	let e = window.top.document.getElementById(id)
	if (e !== null) e.remove()
}
removeEleByID("descriptioncontainer")
removeEleByID("bonk_d_1")
removeEleByID("bonk_d_2")
window.top.document.body.getElementsByTagName("style")[0].innerHTML += `
#maingameframe { margin: 0 !important; margin-top: 0 !important; }
#adboxverticalleftCurse { display: none !important; }
#adboxverticalCurse { display: none !important; }
#bonkioheader { display: none !important; }
body { overflow: hidden !important; }`

// FIX CHAT STUFF
function hideEleByID(id) {
	let e = document.getElementById(id)
	if (e !== null) e.hidden = true
}
hideEleByID("newbonklobby_chat_lowerline")
hideEleByID("newbonklobby_chat_lowerinstruction")
hideEleByID("ingamechatbox")
hideEleByID("newbonklobby_chat_content")
document.getElementById("newbonklobby_chat_content").style.height = "calc(100% - 36px)"
document.body.appendChild(document.getElementById("newbonklobby_chat_input"))
document.body.appendChild(document.getElementById("ingamechatinputtext"))
document.getElementById("newbonklobby_chatbox").getElementsByClassName("newbonklobby_boxtop newbonklobby_boxtop_classic")[0].textContent =
	"More Coming Soon..."

// APPEND FPS TO TOP BAR
const FPS = document.createElement("div")
FPS.innerText = 0
FPS.style = `color: var(--bonk_theme_top_bar_text, #ffffff8f) !important;font-family:"futurept_b1";line-height:35px;display:inline-block;padding-left:15px;padding-right:15px;`
FPS.className = "niceborderright"
document.getElementById("pretty_top_bar").appendChild(FPS)
function fpsUpdate() {
	const updateDelay = 500
	let lastFpsUpdate = 0
	let frames = 0
	function updateFPS() {
		let now = Date.now()
		let elapsed = now - lastFpsUpdate
		if (elapsed < updateDelay) {
			++frames
		} else {
			FPS.innerText = `${Math.round(frames / (elapsed / 1000))} FPS`
			frames = 0
			lastFpsUpdate = now
		}
		window.requestAnimationFrame(updateFPS)
	}
	lastFpsUpdate = Date.now()
	window.requestAnimationFrame(updateFPS)
}
fpsUpdate()

// ADD MAIN CONTAINER
const container = document.createElement("div")
container.id = "bonkpanelcontainer"
document.getElementById("pagecontainer").insertBefore(container, document.getElementById("xpbarcontainer"))
container.appendChild(document.getElementById("bonkiocontainer"))

// ADD PANEL CONTAINER
const panelLeft = document.createElement("div")
panelLeft.style.visibility = "hidden"
panelLeft.className = "panelcontainer"
container.insertBefore(panelLeft, document.getElementById("bonkiocontainer"))
const panelRight = document.createElement("div")
panelRight.style.visibility = "hidden"
panelRight.className = "panelcontainer"
container.appendChild(panelRight)

// ADD PANELS
for (let index = 1; index < 5; index++) {
	const panel = document.createElement("div")
	panel.id = `panel${index}`
	panel.className = "panel"
	const injectTO = index % 2 == 0 ? panelRight : panelLeft
	injectTO.appendChild(panel)
}
let leftSize = localStorage.getItem("panel-left-size") ? JSON.parse(localStorage.getItem("panel-left-size")) : [40, 60]
let rightSize = localStorage.getItem("panel-right-size") ? JSON.parse(localStorage.getItem("panel-right-size")) : [40, 60]
let leftSplit, rightSplit
setTimeout(() => {
	leftSplit = Split(["#panel1", "#panel3"], {
		sizes: leftSize,
		direction: "vertical",
		gutterSize: 15,
		snapOffset: 0,
		onDragEnd: function (e) {
			localStorage.setItem("panel-left-size", JSON.stringify(e))
		}
	})
	rightSplit = Split(["#panel2", "#panel4"], {
		sizes: rightSize,
		direction: "vertical",
		gutterSize: 15,
		snapOffset: 0,
		onDragEnd: function (e) {
			localStorage.setItem("panel-right-size", JSON.stringify(e))
		}
	})
}, 0)

// ADD COMMAND PANEL
let haveWS = false
const commandContainer = document.createElement("div")
commandContainer.id = "commandcontainer"
commandContainer.style.display = "none"
const commandBackground = document.createElement("div")
commandBackground.id = "commandbackground"
commandContainer.appendChild(commandBackground)
const commandWindow = document.createElement("div")
commandWindow.id = "commandpanel"
commandWindow.classList.add("windowShadow")
const commandTopBar = document.createElement("div")
commandTopBar.className = "newbonklobby_boxtop newbonklobby_boxtop_classic"
commandTopBar.textContent = "Command Helper"
commandWindow.appendChild(commandTopBar)
const commandListContainer = document.createElement("div")
commandListContainer.id = "commandlistcontainer"
commandListContainer.className = "chatcontainer"
commandWindow.appendChild(commandListContainer)
commandContainer.appendChild(commandWindow)
document.getElementById("bonkiocontainer").appendChild(commandContainer)
let COMMANDS = {
	kick: (id) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		id = parseInt(id)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID == id) {
			FUNCTIONS.showSystemMessage("Failed, you can't use this command to yourself", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		iosend([
			9,
			{
				banshortid: id,
				kickonly: true
			}
		])
	},
	ban: (id) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		id = parseInt(id)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID == id) {
			FUNCTIONS.showSystemMessage("Failed, you can't use this command to yourself", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		iosend([
			9,
			{
				banshortid: id,
				kickonly: false
			}
		])
	},
	mute: (id) => {
		id = parseInt(id)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID == id) {
			FUNCTIONS.showSystemMessage("Failed, you can't use this command to yourself", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		ROOM_VAR.players[id].mute = true
		PROCESSCOMMAND(`/mute '${ROOM_VAR.players[id].userName}'`)
	},
	unmute: (id) => {
		id = parseInt(id)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID == id) {
			FUNCTIONS.showSystemMessage("Failed, you can't use this command to yourself", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		ROOM_VAR.players[id].mute = false
		PROCESSCOMMAND(`/unmute '${ROOM_VAR.players[id].userName}'`)
	},
	balance: (id, size) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		id = parseInt(id)
		size = parseInt(size)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (size == null || typeof size != "number") {
			FUNCTIONS.showSystemMessage("Failed, size not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		if (size < -100 || size > 100) {
			FUNCTIONS.showSystemMessage("Failed, size must be between -100 and 100", "#b53030")
			return
		}
		iosend([
			29,
			{
				sid: id,
				bal: size
			}
		])
	},
	balanceall: (size) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		size = parseInt(size)
		if (size == null || typeof size != "number") {
			FUNCTIONS.showSystemMessage("Failed, size not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		if (size < -100 || size > 100) {
			FUNCTIONS.showSystemMessage("Failed, size must be between -100 and 100", "#b53030")
			return
		}
		for (let i = 0; i < ROOM_VAR.players.length; i++) {
			const element = ROOM_VAR.players[i]
			if (element == null) continue
			iosend([
				29,
				{
					sid: i,
					bal: size
				}
			])
		}
	},
	roomname: (name) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		if (!name) {
			FUNCTIONS.showSystemMessage("Failed, name not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([
			52,
			{
				newName: name
			}
		])
	},
	roompass: (password) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		if (!password) {
			FUNCTIONS.showSystemMessage("Failed, password not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([
			53,
			{
				newPass: password
			}
		])
	},
	clearroompass: () => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([
			53,
			{
				newPass: ""
			}
		])
	},
	move: (id, teamid) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		id = parseInt(id)
		teamid = parseInt(teamid)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (teamid == null || typeof teamid != "number") {
			FUNCTIONS.showSystemMessage("Failed, teamID not found", "#b53030")
			return
		}
		if (![0, 1, 2, 3, 4, 5].includes(teamid)) {
			FUNCTIONS.showSystemMessage("Failed, team not found", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		if (id == ROOM_VAR.myID) {
			iosend([
				6,
				{
					targetTeam: teamid
				}
			])
		} else if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		} else {
			iosend([
				26,
				{
					targetID: id,
					targetTeam: teamid
				}
			])
		}
		if (ROOM_VAR.myID == ROOM_VAR.hostID) {
			if (teamid < 0) {
				ROOM_VAR.stateFunction.hostHandlePlayerJoined(id, ROOM_VAR.players.length, teamid)
			} else {
				ROOM_VAR.stateFunction.hostHandlePlayerLeft(id)
			}
		}
	},
	moveall: (teamid) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		teamid = parseInt(teamid)
		if (teamid == null || typeof teamid != "number") {
			FUNCTIONS.showSystemMessage("Failed, teamID not found", "#b53030")
			return
		}
		if (![0, 1, 2, 3, 4, 5].includes(teamid)) {
			FUNCTIONS.showSystemMessage("Failed, team not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		for (let i = 0; i < ROOM_VAR.players.length; i++) {
			const element = ROOM_VAR.players[i]
			if (element == null) continue
			if (i == ROOM_VAR.myID) {
				iosend([
					6,
					{
						targetTeam: teamid
					}
				])
			} else {
				iosend([
					26,
					{
						targetID: i,
						targetTeam: teamid
					}
				])
			}
			if (teamid < 0) {
				ROOM_VAR.stateFunction.hostHandlePlayerJoined(i, ROOM_VAR.players.length, teamid)
			} else {
				ROOM_VAR.stateFunction.hostHandlePlayerLeft(i)
			}
		}
	},
	mode: (modeid) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		modeid = modeid.replace(" ", "")
		if (!modeid) {
			FUNCTIONS.showSystemMessage("Failed, modeID not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([
			20,
			{
				ga: modeid == "f" ? "f" : "b",
				mo: modeid
			}
		])
	},
	team: (option) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		option = option.replace(" ", "")
		if (!option) {
			FUNCTIONS.showSystemMessage("Failed, option not found", "#b53030")
			return
		}
		if (!["on", "off"].includes(option)) {
			FUNCTIONS.showSystemMessage("Failed, invalid option", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([
			32,
			{
				t: option == "on" ? true : false
			}
		])
	},
	lock: (option) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		option = option.replace(" ", "")
		if (!option) {
			FUNCTIONS.showSystemMessage("Failed, option not found", "#b53030")
			return
		}
		if (!["on", "off"].includes(option)) {
			FUNCTIONS.showSystemMessage("Failed, invalid option", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([
			7,
			{
				teamLock: option == "on" ? true : false
			}
		])
	},
	skin: (id) => {
		id = parseInt(id)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		const a = document.createElement("a")
		const file = new Blob([JSON.stringify(ROOM_VAR.players[id].avatar)], { type: "text/plain" })
		a.href = URL.createObjectURL(file)
		a.download = `avatar_${ROOM_VAR.players[id].userName}_${Date.now()}`
		a.click()
	},
	link: () => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		document.getElementById("newbonklobby_linkbutton").click()
	},
	start: () => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		STARTGAME()
	},
	round: (number) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		number = parseInt(number)
		if (number == null || typeof number != "number") {
			FUNCTIONS.showSystemMessage("Failed, invalid number", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([
			21,
			{
				w: number
			}
		])
	},
	clear: () => {
		document.getElementById("messagecontainer").innerHTML = ""
	},
	clearsys: () => {
		document.getElementById("systemcontainer").innerHTML = ""
	},
	size: (option, topsize, bottomsize) => {
		option = option.replace(" ", "")
		topsize = parseInt(topsize)
		bottomsize = parseInt(bottomsize)
		if (!["left", "right"].includes(option)) {
			FUNCTIONS.showSystemMessage("Failed, invalid option", "#b53030")
			return
		}
		if (topsize == null || typeof topsize != "number" || bottomsize == null || typeof bottomsize != "number") {
			FUNCTIONS.showSystemMessage("Failed, invalid number", "#b53030")
			return
		}
		if (topsize + bottomsize != 100) {
			FUNCTIONS.showSystemMessage("Failed, the sum of top and bottom size must be 100", "#b53030")
			return
		}
		let sizes = [topsize, bottomsize]
		if (option == "left") {
			leftSplit.setSizes(sizes)
			localStorage.setItem("panel-left-size", JSON.stringify(sizes))
		} else {
			rightSplit.setSizes(sizes)
			localStorage.setItem("panel-right-size", JSON.stringify(sizes))
		}
	},
	fav: () => {
		PROCESSCOMMAND("/fav")
	},
	unfav: () => {
		PROCESSCOMMAND("/unfav")
	},
	givehost: (id) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		id = parseInt(id)
		if (id == null || typeof id != "number") {
			FUNCTIONS.showSystemMessage("Failed, playerID not found", "#b53030")
			return
		}
		if (ROOM_VAR.myID == id) {
			FUNCTIONS.showSystemMessage("Failed, you can't use this command to yourself", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		if (ROOM_VAR.players[id] == null) {
			FUNCTIONS.showSystemMessage("Failed, player not found in this room", "#b53030")
			return
		}
		iosend([
			34,
			{
				id: id
			}
		])
	},
	countdown: (option) => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		option = option.replace(" ", "")
		if (!["1", "2", "3"].includes(option)) {
			FUNCTIONS.showSystemMessage("Failed, invalid option", "#b53030")
			return
		}
		iosend([36, { num: parseInt(option) }])
	},
	abort: () => {
		if (ROOM_VAR.quick) {
			FUNCTIONS.showSystemMessage("Failed, unavailable in quick play", "#b53030")
			return
		}
		if (ROOM_VAR.myID != ROOM_VAR.hostID) {
			FUNCTIONS.showSystemMessage("Failed, you must be room host", "#b53030")
			return
		}
		iosend([37])
	},
	xp: () => {
		FUNCTIONS.showSystemMessage(`${ROOM_VAR.xpEarned}xp earned`, "#0955c7")
	},
	earnxp: () => {
		iosend([38])
	},
	ready: (option) => {
		option = option.replace(" ", "")
		if (!["true", "false"].includes(option)) {
			FUNCTIONS.showSystemMessage("Failed, invalid option", "#b53030")
			return
		}
		iosend([16, { ready: option === "true" }])
	},
	zoom: (number) => {
		number = parseFloat(number)
		if (number == null || typeof number != "number") {
			FUNCTIONS.showSystemMessage("Failed, invalid number", "#b53030")
			return
		}
		scaler = number
		RESCALESTAGE()
	}
}
let SEARCH = {
	addInput: (addText = "", setInstead = false) => {
		if (addText == "") return
		if (setInstead) {
			document.getElementById("bonkpanelchatinput").value = addText
		} else {
			document.getElementById("bonkpanelchatinput").value += addText
		}
		FUNCTIONS.showCommandHelper(document.getElementById("bonkpanelchatinput").value)
	},
	remove: () => {
		commandListContainer.innerHTML = ""
	},
	commands: (filterText = "") => {
		SEARCH.remove()
		COMMANDLIST.forEach((e) => {
			if (!e.name.startsWith(filterText)) return
			if (ROOM_VAR.hostID != ROOM_VAR.myID && e.host) return
			if (ROOM_VAR.quick && e.noQuick) return

			let params = ""
			e.param.forEach((a) => {
				params += ` <${a}>`
			})

			const card = document.createElement("div")
			card.className = "windowShadow commandscardcontainer"
			card.addEventListener("click", () => {
				SEARCH.addInput("/" + e.name + " ", true)
				document.getElementById("bonkpanelchatinput").focus()
			})
			if (document.getElementById("bonkpanelchatinput").onkeydown == null) {
				document.getElementById("bonkpanelchatinput").onkeydown = function (event) {
					if (event.code == "Tab") {
						event.preventDefault()
						document.getElementById("bonkpanelchatinput").onkeydown = null
						SEARCH.addInput("/" + e.name + " ", true)
						document.getElementById("bonkpanelchatinput").focus()
					}
				}
			}

			const title = document.createElement("div")
			title.className = "commandscardtitle"
			title.textContent = e.name + params
			card.appendChild(title)

			const description = document.createElement("div")
			description.className = "commandscarddescription"
			description.textContent = e.des
			card.appendChild(description)

			commandListContainer.appendChild(card)
		})
	},
	players: (command) => {
		SEARCH.remove()

		for (let i = 0; i < ROOM_VAR.players.length; i++) {
			if (command.withoutMe && i == ROOM_VAR.myID) continue
			if (command.checkHost && ROOM_VAR.myID != ROOM_VAR.hostID && i != ROOM_VAR.myID) continue

			const element = ROOM_VAR.players[i]
			if (element == null) continue

			const card = document.createElement("div")
			card.className = "windowShadow commandscardcontainer"
			card.style.flexDirection = "row"
			card.addEventListener("click", () => {
				SEARCH.addInput(i.toString() + " ")
				document.getElementById("bonkpanelchatinput").focus()
			})
			if (document.getElementById("bonkpanelchatinput").onkeydown == null) {
				document.getElementById("bonkpanelchatinput").onkeydown = function (event) {
					if (event.code == "Tab") {
						event.preventDefault()
						document.getElementById("bonkpanelchatinput").onkeydown = null
						SEARCH.addInput(i.toString() + " ")
						document.getElementById("bonkpanelchatinput").focus()
					}
				}
			}

			const img = document.createElement("div")
			img.classList.add("commandplayerimgcontainer")
			card.appendChild(img)

			const textcontainer = document.createElement("div")
			textcontainer.style = `width: calc(100% - 100px); display: flex; flex-direction: column; justify-content: space-evenly`
			const name = document.createElement("div")
			name.className = "commandscardtitle"
			name.textContent = element.userName
			textcontainer.appendChild(name)
			const id = document.createElement("div")
			id.style.marginBottom = "0"
			id.className = "commandscarddescription"
			id.textContent = `ID: ${i.toString()}`
			textcontainer.appendChild(id)
			const levelorguest = document.createElement("div")
			levelorguest.className = "commandscarddescription"
			levelorguest.textContent = element.guest ? "Guest" : `Level ${element.level}`
			textcontainer.appendChild(levelorguest)
			card.appendChild(textcontainer)
			commandListContainer.appendChild(card)
			if (ROOM_VAR.commandAvatarCache[element.userName] && ROOM_VAR.commandAvatarCache[element.userName][1]) {
				img.appendChild(ROOM_VAR.commandAvatarCache[element.userName][1].cloneNode(true))
			} else {
				try {
					FUNCTIONS.createAvatarImage(element.avatar, 1, img, "newbonklobby_chat_msg_avatar", 100, 100, ROOM_VAR.commandAvatarCache, i, 1, 1, 0.25)
				} catch (error) {
					console.error(error)
				}
			}
		}
	},
	teams: () => {
		SEARCH.remove()

		Array.from([
			["Spectate", 0],
			["Free for all", 1],
			["Red", 2],
			["Blue", 3],
			["Green", 4],
			["Yellow", 5]
		]).forEach((e) => {
			const card = document.createElement("div")
			card.className = "windowShadow commandscardcontainer"
			card.addEventListener("click", () => {
				SEARCH.addInput(e[1].toString() + " ")
				document.getElementById("bonkpanelchatinput").focus()
			})
			if (document.getElementById("bonkpanelchatinput").onkeydown == null) {
				document.getElementById("bonkpanelchatinput").onkeydown = function (event) {
					if (event.code == "Tab") {
						event.preventDefault()
						document.getElementById("bonkpanelchatinput").onkeydown = null
						SEARCH.addInput(e[1].toString() + " ")
						document.getElementById("bonkpanelchatinput").focus()
					}
				}
			}
			const title = document.createElement("div")
			title.className = "commandscardtitle"
			title.textContent = e[0]
			card.appendChild(title)
			const id = document.createElement("div")
			id.className = "commandscarddescription"
			id.textContent = "ID: " + e[1].toString()
			card.appendChild(id)
			commandListContainer.appendChild(card)
		})
	},
	modes: () => {
		SEARCH.remove()

		Array.from([
			["Classic", "b"],
			["Arrows", "ar"],
			["Death arrows", "ard"],
			["Grapple", "sp"],
			["Football", "f"],
			["VTOL", "v"]
		]).forEach((e) => {
			const card = document.createElement("div")
			card.className = "windowShadow commandscardcontainer"
			card.addEventListener("click", () => {
				SEARCH.addInput(e[1].toString() + " ")
				document.getElementById("bonkpanelchatinput").focus()
			})
			if (document.getElementById("bonkpanelchatinput").onkeydown == null) {
				document.getElementById("bonkpanelchatinput").onkeydown = function (event) {
					if (event.code == "Tab") {
						event.preventDefault()
						document.getElementById("bonkpanelchatinput").onkeydown = null
						SEARCH.addInput(e[1].toString() + " ")
						document.getElementById("bonkpanelchatinput").focus()
					}
				}
			}
			const title = document.createElement("div")
			title.className = "commandscardtitle"
			title.textContent = e[0]
			card.appendChild(title)
			const id = document.createElement("div")
			id.className = "commandscarddescription"
			id.textContent = "ID: " + e[1].toString()
			card.appendChild(id)
			commandListContainer.appendChild(card)
		})
	},
	option: (command) => {
		SEARCH.remove()

		Array.from(command.option).forEach((e) => {
			const card = document.createElement("div")
			card.className = "windowShadow commandscardcontainer"
			card.addEventListener("click", () => {
				SEARCH.addInput(e + " ")
				document.getElementById("bonkpanelchatinput").focus()
			})
			if (document.getElementById("bonkpanelchatinput").onkeydown == null) {
				document.getElementById("bonkpanelchatinput").onkeydown = function (event) {
					if (event.code == "Tab") {
						event.preventDefault()
						document.getElementById("bonkpanelchatinput").onkeydown = null
						SEARCH.addInput(e + " ")
						document.getElementById("bonkpanelchatinput").focus()
					}
				}
			}
			const title = document.createElement("div")
			title.style.paddingBottom = "8px"
			title.className = "commandscardtitle"
			title.textContent = e
			card.appendChild(title)
			commandListContainer.appendChild(card)
		})
	},
	nothing: () => {
		SEARCH.remove()
	}
}
let COMMANDLIST = [
	{
		name: "kick",
		des: "Removes a player from the game",
		param: ["player:ID"],
		func: ["players"],
		withoutMe: true,
		host: true,
		noQuick: true
	},
	{
		name: "ban",
		des: "Removes and prevents a player from joining the game",
		param: ["player:ID"],
		func: ["players"],
		withoutMe: true,
		host: true,
		noQuick: true
	},
	{
		name: "mute",
		des: "Prevents the chat messages of a player from registering on your screen",
		param: ["player:ID"],
		func: ["players"],
		withoutMe: true,
		host: false
	},
	{
		name: "unmute",
		des: "Allows for future chat messages of a player to register on your screen again",
		param: ["player:ID"],
		func: ["players"],
		withoutMe: true,
		host: false
	},
	{
		name: "balance",
		des: "Changes the size of a player",
		param: ["player:ID", "size:number"],
		func: ["players", "nothing"],
		host: true,
		noQuick: true
	},
	{
		name: "balanceall",
		des: "Change the size of all players",
		param: ["size:number"],
		func: ["nothing"],
		host: true,
		noQuick: true
	},
	{
		name: "roomname",
		des: "Changes the name of the room",
		param: ["name:string"],
		func: ["nothing"],
		host: true,
		noQuick: true
	},
	{
		name: "roompass",
		des: "Changes the password of the room",
		param: ["name:string"],
		func: ["nothing"],
		host: true,
		noQuick: true
	},
	{
		name: "clearroompass",
		des: "The room no longer need a password to join",
		param: [],
		func: [],
		host: true,
		noQuick: true
	},
	{
		name: "move",
		des: "Move a player to another team",
		param: ["player:ID", "team:ID"],
		func: ["players", "teams"],
		checkHost: true,
		host: false,
		noQuick: true
	},
	{
		name: "moveall",
		des: "Move all players to a team",
		param: ["team:ID"],
		func: ["teams"],
		host: true,
		noQuick: true
	},
	{
		name: "mode",
		des: "Changes the game mode of the room",
		param: ["mode:ID"],
		func: ["modes"],
		host: true,
		noQuick: true
	},
	{
		name: "team",
		des: "Enable or disable teams",
		param: ["teams:option"],
		func: ["option"],
		option: ["on", "off"],
		host: true,
		noQuick: true
	},
	{
		name: "lock",
		des: "Allow or prevent players from moving themselves",
		param: ["lock:option"],
		func: ["option"],
		option: ["on", "off"],
		host: true,
		noQuick: true
	},
	{
		name: "link",
		des: "Copy the auto join link to your clipboard",
		param: [],
		func: [],
		host: false,
		noQuick: true
	},
	{
		name: "skin",
		des: "Download the skin of a player",
		param: ["player:ID"],
		func: ["players"],
		host: false
	},
	{
		name: "start",
		des: "Instantly start the game without countdown",
		param: [],
		func: [],
		host: true,
		noQuick: true
	},
	{
		name: "round",
		des: "Set the rounds to win",
		param: ["rounds:number"],
		func: ["nothing"],
		host: true,
		noQuick: true
	},
	{
		name: "clear",
		des: "Clears the chat",
		param: [],
		func: [],
		host: false
	},
	{
		name: "clearsys",
		des: "Clears the system chat",
		param: [],
		func: [],
		host: false
	},
	{
		name: "size",
		des: ["Set the size of the panels"],
		param: ["panel:option", "topsize:number", "bottomsize:number"],
		func: ["option", "nothing", "nothing"],
		option: ["left", "right"],
		host: false
	},
	{
		name: "fav",
		des: ["Adds the current map to your favourites list"],
		param: [],
		func: [],
		host: false
	},
	{
		name: "unfav",
		des: ["Removes the current map from your favourites list"],
		param: [],
		func: [],
		host: false
	},
	{
		name: "givehost",
		des: ["Gives host to a player"],
		param: ["player:id"],
		func: ["players"],
		withoutMe: true,
		host: true,
		noQuick: true
	},
	{
		name: "countdown",
		des: ["Sends a countdown message"],
		param: ["countdown:option"],
		func: ["option"],
		option: ["1", "2", "3"],
		host: true,
		noQuick: true
	},
	{
		name: "abort",
		des: ["Sends an abort countdown message"],
		param: [],
		func: [],
		host: true,
		noQuick: true
	},
	{
		name: "xp",
		des: ["Tells you how much xp you earned in this room"],
		param: [],
		func: [],
		host: false
	},
	{
		name: "earnxp",
		des: ["Instantly gain xp"],
		param: [],
		func: [],
		host: false
	},
	{
		name: "ready",
		des: ["Change your ready state"],
		param: ["state:option"],
		func: ["option"],
		option: ["true", "false"],
		host: false
	},
	{
		name: "zoom",
		des: "Set the scale of the stage",
		param: ["scale:number"],
		func: ["nothing"],
		host: false
	}
]

// SCENE
let ROOM_VAR = {
	xpEarned: 0,
	myID: 0,
	hostID: 0,
	autoJoinID: null,
	autoJoinPassBypass: null,
	players: [],
	quick: false,
	bal: [],
	tmpImgTextPing: [],
	state: null,
	stateFunction: null,
	chatAvatarCache: [],
	commandAvatarCache: [],
	playersAvatarCache: []
}
let FUNCTIONS = {
	showCommandHelper: (value = "") => {
		if (value == "" || !value.startsWith("/") || value.startsWith("/ ")) {
			commandContainer.style.display = "none"
			return
		}
		const stage = value.split(" ")
		if (stage.length == 1) {
			commandContainer.style.display = "flex"
			commandTopBar.textContent = stage[0].substring(1) || "Command Helper"
			SEARCH.commands(stage[0].substring(1))
		} else {
			let index = COMMANDLIST.findIndex((z) => z.name === stage[0].substring(1))
			if (index == -1) {
				commandContainer.style.display = "none"
			} else {
				commandContainer.style.display = "flex"
				let command = COMMANDLIST[index]
				let params = ""
				for (let i = 0; i < stage.length - 1; i++) {
					if (command.param[i]) {
						params += ` <${command.param[i]}>`
					}
				}
				if (params == "") {
					SEARCH["nothing"]()
				} else if (command.func[stage.length - 2]) {
					SEARCH[command.func[stage.length - 2]](command)
				} else {
					SEARCH["nothing"]()
				}
				commandTopBar.textContent = command.name + params
			}
		}
	},
	processCommand: (value = "") => {
		if (value == "/" || value.startsWith("/ ")) {
			FUNCTIONS.showSystemMessage("Failed, invalid command", "#b53030")
			commandContainer.style.display = "none"
			return
		}
		const stage = value.substring(1).split(" ")
		if (COMMANDS[stage[0]] == null) {
			FUNCTIONS.showSystemMessage("Failed, invalid command", "#b53030")
			commandContainer.style.display = "none"
			return
		}
		if (stage.length == 1) {
			COMMANDS[stage[0]]()
		} else {
			let index = COMMANDLIST.findIndex((z) => z.name === stage[0])
			if (index == -1) {
				FUNCTIONS.showSystemMessage("Failed, invalid command", "#b53030")
			} else {
				let command = COMMANDLIST[index]
				if (command.param.length == 0) {
					COMMANDS[stage[0]]()
				} else {
					function splitWithTail(str, delim, count) {
						var parts = str.split(delim)
						var tail = parts.slice(count).join(delim)
						var result = parts.slice(0, count)
						result.push(tail)
						return result
					}
					let val = splitWithTail(value, " ", command.param.length)
					val.shift()
					COMMANDS[stage[0]](...val)
				}
			}
		}
		commandContainer.style.display = "none"
	},
	createAvatarImage: (
		avatar,
		team_number,
		appendlocation,
		classList,
		image_width,
		image_height,
		cache_storage,
		cache_id,
		cache_team,
		shadow_thickness,
		opacity
	) => {
		const hexToHSL = (hex) => {
			// Convert hex string to RGB values
			let r = parseInt(hex.slice(1, 3), 16)
			let g = parseInt(hex.slice(3, 5), 16)
			let b = parseInt(hex.slice(5, 7), 16)

			// Normalize RGB values
			r /= 255
			g /= 255
			b /= 255

			// Find the minimum and maximum RGB values
			let min = Math.min(r, g, b)
			let max = Math.max(r, g, b)
			let diff = max - min

			// Initialize HSL values
			let h, s, l

			// Calculate hue
			if (diff === 0) {
				h = 0
			} else if (max === r) {
				h = ((g - b) / diff) % 6
			} else if (max === g) {
				h = (b - r) / diff + 2
			} else {
				h = (r - g) / diff + 4
			}
			h = Math.round(60 * h)
			if (h < 0) {
				h += 360
			}

			// Calculate lightness
			l = (min + max) / 2

			// Calculate saturation
			s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1))
			s = +(s * 100).toFixed(1)
			l = +(l * 100).toFixed(1)

			// Return HSL values as an object
			return { h, s, l }
		}
		const HSLtoHex = (hue, saturation, lightness) => {
			saturation /= 100
			lightness /= 100
			let s = (1 - Math.abs(2 * lightness - 1)) * saturation,
				h = s * (1 - Math["abs"](((hue / 60) % 2) - 1)),
				l = lightness - s / 2,
				red = 0,
				green = 0,
				blue = 0
			if (0 <= hue && hue < 60) {
				red = s
				green = h
				blue = 0
			} else if (60 <= hue && hue < 120) {
				red = h
				green = s
				blue = 0
			} else if (120 <= hue && hue < 180) {
				red = 0
				green = s
				blue = h
			} else if (180 <= hue && hue < 240) {
				red = 0
				green = h
				blue = s
			} else if (240 <= hue && hue < 300) {
				red = h
				green = 0
				blue = s
			} else if (300 <= hue && hue < 360) {
				red = s
				green = 0
				blue = h
			}
			red = Math.round((red + l) * 255)
			green = Math.round((green + l) * 255)
			blue = Math.round((blue + l) * 255)
			const rgbToHex = (r, g, b) =>
				"#" +
				[r, g, b]
					.map((x) => {
						const hex = x.toString(16)
						return hex.length === 1 ? "0" + hex : hex
					})
					.join("")
			return rgbToHex(red, green, blue)
		}
		const hueify = (hexcolour, hue_value) => {
			let hsl = hexToHSL("#" + hexcolour.toString(16)["padStart"](6, "0"))
			hsl.h = hue_value
			return HSLtoHex(hsl.h, hsl.s, hsl.l)
		}
		const teamify = (colour) => {
			if (team_number == 2) {
				return hueify(colour, 4)
			} else if (team_number == 3) {
				return hueify(colour, 207)
			} else if (team_number == 4) {
				return hueify(colour, 122)
			} else if (team_number == 5) {
				return hueify(colour, 54)
			}
			return "#" + colour.toString(16)["padStart"](6, "0")
		}
		let svgcode = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="36" height="36">
<clipPath id="clipCircle"><circle cx="18" cy="18" r="15"/></clipPath>`
		if (shadow_thickness > 0) {
			svgcode += `<circle fill="#000000" fill-opacity="${opacity}" cx="${18 + shadow_thickness}" cy="${18 + shadow_thickness}" r="15"/>`
		}
		svgcode += `
<circle fill="${teamify(avatar.bc)}" cx="18" cy="18" r="15"/>
<g id="base" clip-path="url(#clipCircle)">`
		avatar.layers
			.slice()
			.reverse()
			.forEach((layer) => {
				svgcode += window.bonkpanel_skins[layer.id - 1]
					.match(/<g.+<\/g>/gs)[0]
					.replace(/fill=".+?"/, `fill="${teamify(layer.color)}"`)
					.replace(
						/transform=".+?"/,
						`
			transform="matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
			translate(${layer.x + 18}, ${layer.y + 18})
			rotate(${layer.angle})
			scale(${layer.scale})
			scale(${layer.flipX ? -1 : 1}, ${layer.flipY ? -1 : 1})"
			`
					)
			})
		svgcode += "</g>"
		if (team_number >= 2 && team_number <= 5) {
			svgcode += `<circle clip-path="url(#clipCircle)" fill="none" cx="18" cy="18" r="15" stroke-width="1.8" stroke="#`
			if (team_number == 2) {
				svgcode += `f44336"/>`
			} else if (team_number == 3) {
				svgcode += `2196f3"/>`
			} else if (team_number == 4) {
				svgcode += `4caf50"/>`
			} else if (team_number == 5) {
				svgcode += `ffeb3b"/>`
			}
		}
		svgcode += "</svg>"
		const image = document.createElement("img")
		image.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgcode)))}`
		image.style.width = image_width + "px"
		image.style.height = image_height + "px"
		if (document.body.contains(appendlocation)) {
			while (appendlocation.firstChild) {
				appendlocation.removeChild(appendlocation.firstChild)
			}
			appendlocation.appendChild(image)
			if (classList != "") {
				image.classList.add(classList)
			}
		}
		if (cache_storage) {
			if (!cache_storage[cache_id]) {
				cache_storage[cache_id] = []
			}
			cache_storage[cache_id][cache_team] = image
		}
		return image
	},
	urlify: (text) => {
		let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
		return text.replace(urlRegex, function (url, b, c) {
			let url2 = c == "www." ? "https://" + url : url
			return '<a href="' + url2 + '" target="_blank">' + url + "</a>"
		})
	},
	showSystemMessage: (message, colour, inChat = false) => {
		const systemcontainer = inChat ? document.getElementById("messagecontainer") : document.getElementById("systemcontainer")
		if (systemcontainer == null) return

		const needToScroll = systemcontainer.scrollTop + systemcontainer.clientHeight >= systemcontainer.scrollHeight - 5
		const msgcontainer = document.createElement("div")
		const msg = document.createElement("span")
		msg.style.color = colour
		msg.classList.add("newbonklobby_chat_status")
		msg.appendChild(document.createTextNode("* " + message))
		msgcontainer.appendChild(msg)
		systemcontainer.appendChild(msgcontainer)
		if (systemcontainer.childElementCount > 250) {
			systemcontainer.removeChild(systemcontainer.firstChild)
		}
		if (needToScroll) {
			systemcontainer.scrollTop = systemcontainer.scrollHeight
		}
	},
	showChatMessage: (message, ID) => {
		const messagecontainer = document.getElementById("messagecontainer")
		if (messagecontainer == null) return

		const messager = ROOM_VAR.players[ID]
		if (messager == null) return
		if (messager.mute) return

		const needToScroll = messagecontainer.scrollTop + messagecontainer.clientHeight >= messagecontainer.scrollHeight - 5
		const messageholder = document.createElement("div")
		messagecontainer.appendChild(messageholder)

		const colourbox = document.createElement("div")
		colourbox.classList.add("newbonklobby_chat_msg_colorbox")
		messageholder.appendChild(colourbox)

		if (ROOM_VAR.chatAvatarCache[messager.userName] && ROOM_VAR.chatAvatarCache[messager.userName][1]) {
			colourbox.appendChild(ROOM_VAR.chatAvatarCache[messager.userName][1].cloneNode(true))
		} else {
			try {
				FUNCTIONS.createAvatarImage(messager.avatar, 1, colourbox, "newbonklobby_chat_msg_avatar", 12, 12, ROOM_VAR.chatAvatarCache, ID, 1, 2, 0.1)
			} catch (error) {
				console.error(error)
			}
		}

		const name = document.createElement("span")
		name.classList.add("newbonklobby_chat_msg_name")
		name.innerText = `${messager.userName}: `
		messageholder.append(name)

		const msg = document.createElement("span")
		msg.classList.add("newbonklobby_chat_msg_txt")
		msg.innerHTML = FUNCTIONS.urlify(message)
		messageholder.appendChild(msg)

		if (needToScroll.childElementCount > 300) {
			needToScroll.removeChild(needToScroll.firstChild)
		}
		if (needToScroll) {
			messagecontainer.scrollTop = messagecontainer.scrollHeight
		}
	}
}
let SCENES = {
	system: (panelID = "panel1") => {
		document.getElementById(panelID).innerHTML = ""

		const container = document.createElement("div")
		container.id = "systemcontainer"
		container.className = "chatcontainer"
		document.getElementById(panelID).appendChild(container)
	},
	chat: (panelID = "panel3") => {
		document.getElementById(panelID).innerHTML = ""

		const container = document.createElement("div")
		container.id = "messagecontainer"
		container.className = "chatcontainer"
		container.style.height = "calc(100% - 26px)"
		document.getElementById(panelID).appendChild(container)

		const lowerline = document.createElement("div")
		lowerline.id = "bonkpanellowerline"
		document.getElementById(panelID).appendChild(lowerline)

		const lowerinstruction = document.createElement("div")
		lowerinstruction.id = "bonkpanellowerinstruction"
		lowerinstruction.innerText = "Press enter to send a message"
		lowerinstruction.style.display = "block"
		document.getElementById(panelID).appendChild(lowerinstruction)

		const input = document.createElement("input")
		input.id = "bonkpanelchatinput"
		input.type = "text"
		input.setAttribute("autocomplete", "off")
		input.setAttribute("aria-autocomplete", "none")
		input.style.pointerEvents = "none"
		input.addEventListener("input", (e) => {
			input.onkeydown = null
			FUNCTIONS.showCommandHelper(e.target.value)
		})
		document.getElementById(panelID).appendChild(input)
	},
	leaderboard: (panelID = "panel2") => {
		document.getElementById(panelID).innerHTML = ""
		const container = document.createElement("div")
		container.style = "width: 100%; height: 100%; display: flex; flex-direction: column; scroll-y: auto; font-family: futurept_b1;"

		if (inLobby || ROOM_VAR.state == null || ROOM_VAR.state[4]?.wl == null) return
		const div = document.createElement("div")
		div.style = "font-size: 17px; padding: 5px 5px 0px; overflow: hidden;"
		div.textContent = "Rounds to win: " + ROOM_VAR.state[4]?.wl
		container.appendChild(div)

		if (ROOM_VAR.state[0].scores.length <= 0) return
		let leaderboardData = []
		for (let i = 0; i < ROOM_VAR.state[0].scores.length; i++) {
			const score = ROOM_VAR.state[0].scores[i]
			if (score == null) continue
			let scoreOwner = ""
			if (ROOM_VAR.state[4].tea) {
				switch (i) {
					case 2:
						scoreOwner = "Red Team"
						break
					case 3:
						scoreOwner = "Blue Team"
						break
					case 4:
						scoreOwner = "Green Team"
						break
					case 5:
						scoreOwner = "Yellow Team"
						break
				}
			} else if (ROOM_VAR.players[i]?.userName) {
				scoreOwner = ROOM_VAR.players[i].userName
			}
			if (scoreOwner.length == 0) continue
			leaderboardData.push({
				owner: scoreOwner,
				score: score
			})
		}
		leaderboardData.sort((a, b) => b.score - a.score)
		leaderboardData.forEach((e) => {
			const div = document.createElement("div")
			div.style = "font-size: 17px; padding: 5px 5px 0px; overflow: hidden;"
			div.textContent = e.owner + ": " + e.score
			container.appendChild(div)
		})

		document.getElementById(panelID).appendChild(container)
	},
	players: (panelID = "panel4") => {
		document.getElementById(panelID).innerHTML = ""

		const container = document.createElement("div")
		container.id = "playerscontainer"
		container.style = "width: 100%; height: 100%; display: flex; flex-direction: column; scroll-y: auto;"

		ROOM_VAR.tmpImgTextPing = []
		for (let i = 0; i < ROOM_VAR.players.length; i++) {
			const player = ROOM_VAR.players[i]
			if (player == null) continue

			const playerContainer = document.createElement("div")
			playerContainer.className = "newbonklobby_playerentry"
			playerContainer.style =
				"border-left: 4px solid var(--bonk_theme_primary_background, #e2e2e2) !important; border-right: 4px solid var(--bonk_theme_primary_background, #e2e2e2) !important; border-top: 4px solid var(--bonk_theme_primary_background, #e2e2e2) !important; background-color: var(--bonk_theme_primary_background, #e2e2e2); cursor: auto;"

			const avatar = document.createElement("div")
			avatar.className = "newbonklobby_playerentry_avatar"
			avatar.style = `opacity: ${player.team === 0 ? "0.5" : "1"};`
			if (ROOM_VAR.playersAvatarCache?.[player.userName]?.[player.team]) {
				avatar.innerHTML = ROOM_VAR.commandAvatarCache[player.userName][player.team]
			} else {
				try {
					avatar.innerHTML = FUNCTIONS.createAvatarImage(
						player.avatar,
						player.team,
						null,
						"",
						36,
						36,
						ROOM_VAR.playersAvatarCache,
						i,
						player.team,
						1.1,
						0.3
					).outerHTML
				} catch (error) {
					console.error(error)
				}
			}
			playerContainer.appendChild(avatar)

			const name = document.createElement("div")
			name.className = "newbonklobby_playerentry_name"
			name.textContent = player.userName
			playerContainer.appendChild(name)

			const level = document.createElement("div")
			level.className = "newbonklobby_playerentry_level"
			level.textContent = player.guest ? "Guest" : `Level ${player.level}`
			playerContainer.appendChild(level)

			const size = document.createElement("div")
			let sizeclass = ""
			let sizetext = ""
			if (ROOM_VAR.bal[i] && ROOM_VAR.bal[i] != 0) {
				if (ROOM_VAR.bal[i] > 0) {
					sizeclass = " newbonklobby_playerentry_balance_buff"
					sizetext = "+" + ROOM_VAR.bal[i] + "%"
				} else {
					sizeclass = " newbonklobby_playerentry_balance_nerf"
					sizetext = ROOM_VAR.bal[i] + "%"
				}
			}
			size.className = "newbonklobby_playerentry_balance" + sizeclass
			size.textContent = sizetext
			playerContainer.appendChild(size)

			const pingImg = document.createElement("img")
			pingImg.src = "graphics/ping_5.png"
			pingImg.className = "newbonklobby_playerentry_ping"
			playerContainer.appendChild(pingImg)

			const pingText = document.createElement("div")
			pingText.className = "newbonklobby_playerentry_pingtext"
			playerContainer.appendChild(pingText)

			const hostImg = document.createElement("img")
			hostImg.src = "graphics/host_0.png"
			hostImg.className = "newbonklobby_playerentry_host"
			playerContainer.appendChild(hostImg)

			ROOM_VAR.tmpImgTextPing[i] = {
				img: pingImg,
				text: pingText,
				host: hostImg
			}

			if (player.ready) {
				const ready = document.createElement("img")
				ready.className = "newbonklobby_playerentry_ready"
				ready.src = "graphics/readytick.png"
				playerContainer.appendChild(ready)
			}

			container.appendChild(playerContainer)
		}
		SCENES.updatePlayersPing()

		document.getElementById(panelID).appendChild(container)
	},
	updatePlayersPing: () => {
		for (let i = 0; i < ROOM_VAR.players.length; i++) {
			const player = ROOM_VAR.players[i]
			const element = ROOM_VAR.tmpImgTextPing[i]
			if (element == null || player == null) continue

			let imgSrc = 1
			if (player.ping <= 100) {
				imgSrc = 5
			}
			if (player.ping > 100 && player.ping <= 200) {
				imgSrc = 4
			}
			if (player.ping > 200 && player.ping <= 300) {
				imgSrc = 3
			}
			if (player.ping > 300 && player.ping <= 400) {
				imgSrc = 2
			}
			if (player.ping > 400) {
				imgSrc = 1
			}
			if (player.tabbed) {
				imgSrc = "tab"
			}

			if (element.lastSet != imgSrc) {
				element.lastSet = imgSrc
				element.img.src = "graphics/ping_" + imgSrc + ".png"
			}
			if (imgSrc == "tab") {
				element.text.textContent = "Tab"
			} else if (player.ping === undefined) {
				element.text.textContent = "-ms"
			} else {
				element.text.textContent = player.ping + "ms"
			}
			if (ROOM_VAR.hostID == i) {
				if (element.hostLastSet != imgSrc) {
					element.hostLastSet = imgSrc
					element.host.src = "graphics/host_" + imgSrc + ".png"
				}
			} else {
				if (element.hostLastSet !== 0) {
					element.hostLastSet = 0
					element.host.src = "graphics/host_0.png"
				}
			}
		}
	}
}
let inLobby = true

// ADD STYLE
const style = document.createElement("style")
style.innerHTML += /*css*/ `
	*:focus {
		outline: none;
	}
	.newbonklobby_chat_msg_colorbox {
		user-select: none;
	}
	#bonkiocontainer {
		margin: 10px !important;
		flex: 0 0 auto;
	}
	#bonkpanelcontainer {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	#newbonklobby_chat_input {
		width: 0px !important;
		height: 0px !important;
	}
	#ingamechatinputtext {
		width: 0px !important;
		height: 0px !important;
	}
	#skinColourPickerContainerButton {
		display: flex;
		justify-content: space-between;
	}
	#skinColourPickerContainerButton > div {
		padding: 0 10;
		width: inherit;
		margin-top: 7px;
		margin-bottom: 2px;
		display: inline-block;
		height: 25px;
		line-height: 25px;
	}
	#imageOverlayContainer {
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		top: 55px;
		width: 245px;
		height: 245px;
		cursor: grab;
		pointer-events: none;
		overflow: hidden;
	}
	#imageOverlay {
		width: 100%;
		aspect-ratio: 1;
		position: absolute;
		top: 0;
		left: 0;
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
		background-image: none;
		transform: scale(100%);
		opacity: 50%;
	}
	.panelcontainer {
		flex: 1;
		height: 100%;
		background-color: var(--bonk_theme_primary_background, #e2e2e2) !important;
		color: var(--bonk_theme_primary_text, #000000) !important;
	}
	.gutter {
		background-color: var(--bonk_theme_window_color, #009688) !important;
		background-repeat: no-repeat;
		background-position: 50%;
	}
	.gutter.gutter-vertical {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
		cursor: row-resize;
	}
	.panel {
		position: relative;
	}
	#commandcontainer {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: "futurept_b1";
	}
	#commandbackground {
		width: 100%;
		height: 100%;
		background-color: black;
		opacity: 0.6;
	}
	#commandpanel {
		position: absolute;
		background-color: var(--greyWindowBGColor);
		width: 80%;
		height: 70%;
		border-radius: 7px;
	}
	#commandtoptext {
		font-family: "futurept_b1";
		color: #ffffff;
		text-align: center;
		font-size: 20px;
		line-height: 32px;
		padding: 0px;
		margin: 0px;
	}
	#commandlistcontainer {
		height: calc(100% - 36px) !important;
	}
	.commandscardcontainer {
		background-color: #eeeeee;
		color: #222222;
		border-radius: 5px;
		user-select: none;
		margin: 10px;
		display: flex;
		flex-direction: column;
		cursor: pointer;
	}
	.commandscardtitle {
		display: block;
		text-align: left;
		font-size: 20px;
		padding-left: 10px;
		padding-top: 8px;
	}
	.commandscarddescription {
		display: block;
		text-align: left;
		font-size: 15px;
		padding-left: 10px;
		padding-right: 10px;
		line-height: 20px;
		white-space: pre-wrap;
		margin-bottom: 5px;
	}
	.commandplayerimgcontainer {
		width: 100px;
		height: 100px;
	}
	.chatcontainer {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		margin: auto;
		overflow-y: scroll;
		overflow-x: hidden;
		word-break: break-word;
		user-select: text;
		padding: 4px;
	}
	.chatcontainer::-webkit-scrollbar {width: 0.6em;}
	.chatcontainer::-webkit-scrollbar-thumb {background-color: var(--bonk_theme_scrollbar_thumb, #757575) !important;}
	.chatcontainer::-webkit-scrollbar-track {background-color: var(--bonk_theme_scrollbar_background) !important;}
	#bonkpanellowerline {
		background-color: #a5acb0;
		width: 97%;
		height: 1px;
	}
	#bonkpanellowerinstruction {
		width: 97%;
		height: 24px;
		margin: auto;
		color: #656565;
		font-size: 16px;
		font-family: "futurept_b1";
		pointer-events: none;
	}
	#bonkpanelchatinput {
		width: 97%;
		height: 24px;
		margin: auto;
		border: 0px solid;
		background: none;
		font-family: "futurept_b1";
		font-size: 16px;
		color: #171717;
		pointer-events: none;
	}
`
document.body.appendChild(style)

// MONKEY PATCH SHAKE TWEEN OBJECT
var canvasStage = null
const symbolshakeTweenObject = Symbol("shakeTweenObject")
Object.defineProperty(Object.prototype, "shakeTweenObject", {
	get() {
		return this[symbolshakeTweenObject]
	},
	set(value) {
		canvasStage = this
		const original = this.createGradientBackground
		this.createGradientBackground = function () {
			original.call(this, arguments)
			RESCALESTAGE()
		}
		this[symbolshakeTweenObject] = value
	},
	configurable: true
})
var scaler = 1
function RESCALESTAGE() {
	if (canvasStage == null || canvasStage.stage == null) return
	canvasStage.stage.scale.x = scaler
	canvasStage.stage.scale.y = scaler

	var tmpWidth = 730 * canvasStage.scaleRatio
	var tmpHeight = 500 * canvasStage.scaleRatio
	canvasStage.stage.x = tmpWidth / 2 - (tmpWidth * scaler) / 2
	canvasStage.stage.y = tmpHeight / 2 - (tmpHeight * scaler) / 2

	var superWidth = (780 * canvasStage.scaleRatio) / scaler
	var superHeight = (550 * canvasStage.scaleRatio) / scaler

	canvasStage.bgGradient.beginFill(0x3b536b)
	canvasStage.bgGradient.drawRect(0, 0, superWidth, superHeight)
	canvasStage.bgGradient.x = -(superWidth - tmpWidth) / 2
	canvasStage.bgGradient.y = -(superHeight - tmpHeight) / 2
}

// MONKEY PATCH AVATAR SHOW
let showFunction = () => {}
const symbolShow = Symbol("show")
Object.defineProperty(Object.prototype, "show", {
	get() {
		return this[symbolShow]
	},
	set(value) {
		if (typeof value == "function") {
			const original = value
			value = function () {
				if (arguments[0]?.bc) {
					showFunction = original
				}
				return original.apply(this, arguments)
			}
		}

		this[symbolShow] = value
	},
	configurable: true
})

// MONKEY PATCH showColorPicker
var showColorPicker = null
var showColorPickerArguments = []
const symbolshowColorPicker = Symbol("showColorPicker")
Object.defineProperty(Object.prototype, "showColorPicker", {
	get() {
		return this[symbolshowColorPicker]
	},
	set(value) {
		if (typeof value == "function") {
			const original = value
			value = function () {
				showColorPicker = original
				showColorPickerArguments = arguments
				return original.apply(this, arguments)
			}
		}
		this[symbolshowColorPicker] = value
	}
})

// MONKEY PATCH hostHandlePlayerJoined
const symbolhostHandlePlayerJoined = Symbol("hostHandlePlayerJoined")
Object.defineProperty(Object.prototype, "hostHandlePlayerJoined", {
	get() {
		return this[symbolStep]
	},
	set(value) {
		ROOM_VAR.stateFunction = this
		this[symbolStep] = value
	},
	configurable: true
})

// MONKEY PATCH STEP
const symbolStep = Symbol("step")
Object.defineProperty(Object.prototype, "step", {
	get() {
		return this[symbolStep]
	},
	set(value) {
		if (typeof value == "function") {
			const original = value
			value = function () {
				if (arguments[0]?.scores) {
					if (ws) {
						ROOM_VAR.state = arguments
					}
				}
				return original.apply(this, arguments)
			}
		}
		this[symbolStep] = value
	},
	configurable: true
})

// MONKEY PATCH APPEND CHILD
let originalAppendChild = Element.prototype.appendChild
Element.prototype.appendChild = function () {
	if (this == document.getElementById("newbonklobby_chat_content") || this == document.getElementById("ingamechatcontent")) {
		if (
			(arguments[0].firstChild?.className == "newbonklobby_chat_status" && inLobby) ||
			(arguments[0].firstChild?.className == "ingamechatstatus" && !inLobby)
		) {
			let text = arguments[0].textContent
			if (text.startsWith("* Map added to favourites")) {
				FUNCTIONS.showSystemMessage("Map added to favourites", "#b53030")
			} else if (text.startsWith("* Couldn't favourite map because it isn't public")) {
				FUNCTIONS.showSystemMessage("Failed, couldn't favourite map because it isn't public", "#b53030")
			} else if (text.startsWith("* This map is already in your favourites!")) {
				FUNCTIONS.showSystemMessage("This map is already in your favourites", "#b53030")
			} else if (text.startsWith("* Couldn't favourite, something went wrong")) {
				FUNCTIONS.showSystemMessage("Failed, something went wrong", "#b53030")
			} else if (text.startsWith("* You must be logged in and the map must be a Bonk 2 map")) {
				FUNCTIONS.showSystemMessage("Failed, you must be logged in and the map must be a Bonk 2 map", "#b53030")
			} else if (text.startsWith("* Map removed from favourites")) {
				FUNCTIONS.showSystemMessage("Map removed from favourites", "#b53030")
			} else if (text.startsWith("* Couldn't unfavourite map because it isn't public")) {
				FUNCTIONS.showSystemMessage("Failed, couldn't unfavourite map because it isn't public", "#b53030")
			} else if (text.startsWith("* This map isn't in your favourites!")) {
				FUNCTIONS.showSystemMessage("This map isn't in your favourites", "#b53030")
			} else if (text.startsWith("* Couldn't unfavourite, something went wrong")) {
				FUNCTIONS.showSystemMessage("Failed, something went wrong", "#b53030")
			} else if (text.startsWith("* No replays in Football mode")) {
				FUNCTIONS.showSystemMessage("Failed, no replays in football mode", "#b53030")
			} else if (text.startsWith("* Please wait at least")) {
				FUNCTIONS.showSystemMessage(text.substring(2).replace("Please", "Failed,"), "#b53030")
			} else if (text.startsWith("* Recording failed")) {
				FUNCTIONS.showSystemMessage("Failed, something went wrong", "#b53030")
			} else if (text.startsWith("* Replay must be at least")) {
				FUNCTIONS.showSystemMessage(text.substring(2).replace("Replay", "Failed, replay"), "#b53030")
			} else if (text.startsWith("* The last")) {
				FUNCTIONS.showSystemMessage(text.substring(2), "#b53030")
			} else if (text.startsWith("* You and")) {
				FUNCTIONS.showSystemMessage(text.substring(2), "#00675d")
			} else if (text.endsWith("accepted your friend request ")) {
				FUNCTIONS.showSystemMessage(text.substring(2), "#00675d")
			} else if (text.startsWith("* Your clipboard has been set to:")) {
				FUNCTIONS.showSystemMessage(`Link copied`, "#0955c7")
			}
		} else if (arguments[0].firstChild?.className == "newbonklobby_chat_status") {
			let text = arguments[0].textContent
			if (text.startsWith("* You and")) {
				FUNCTIONS.showSystemMessage(text.substring(2), "#00675d")
			} else if (text.endsWith("accepted your friend request ")) {
				FUNCTIONS.showSystemMessage(text.substring(2), "#00675d")
			} else if (text.startsWith("* Your clipboard has been set to:")) {
				FUNCTIONS.showSystemMessage(`Link copied`, "#0955c7")
			}
		}
		if (this == document.getElementById("newbonklobby_chat_content") && arguments[0].firstChild?.className == "newbonklobby_chat_msg_name") {
			const systemcontainer = document.getElementById("systemcontainer")
			if (systemcontainer) {
				const needToScroll = systemcontainer.scrollTop + systemcontainer.clientHeight >= systemcontainer.scrollHeight - 5
				systemcontainer.appendChild(arguments[0])
				if (systemcontainer.childElementCount > 250) {
					systemcontainer.removeChild(systemcontainer.firstChild)
				}
				if (needToScroll) {
					systemcontainer.scrollTop = systemcontainer.scrollHeight
				}
				return
			}
		}
		if (this == document.getElementById("newbonklobby_chat_content") && arguments[0].lastChild?.textContent == "[Accept]") {
			const systemcontainer = document.getElementById("systemcontainer")
			if (systemcontainer) {
				const needToScroll = systemcontainer.scrollTop + systemcontainer.clientHeight >= systemcontainer.scrollHeight - 5
				systemcontainer.appendChild(arguments[0])
				if (systemcontainer.childElementCount > 250) {
					systemcontainer.removeChild(systemcontainer.firstChild)
				}
				if (needToScroll) {
					systemcontainer.scrollTop = systemcontainer.scrollHeight
				}
				return
			}
		}
	} else if (
		(arguments[0].textContent == "Unmute" || arguments[0].textContent == "Mute") &&
		(arguments[0].className == "newbonklobby_playerentry_menu_button brownButton buttonShadow newbonklobby_playerentry_menu_button_warn" ||
			arguments[0].className == "newbonklobby_playerentry_menu_button brownButton buttonShadow brownButton_classic")
	) {
		arguments[0].addEventListener("click", () => {
			const tmpelement = document.getElementsByClassName("newbonklobby_playerentry_menuhighlighted")[0]
			if (tmpelement) {
				const tmpname = tmpelement.getElementsByClassName("newbonklobby_playerentry_name")[0].textContent
				for (let i = 0; i < ROOM_VAR.players.length; i++) {
					if (ROOM_VAR.players[i].userName === tmpname) {
						ROOM_VAR.players[i].mute = !ROOM_VAR.players[i].mute
						break
					}
				}
			}
		})
	} else if (this == document.body && arguments[0].tagName == "DIV") {
		return
	}

	return originalAppendChild.apply(this, arguments)
}

// MONKEY PATCH ARRAY PUSH
let STARTGAME = null
let PROCESSCOMMAND = null
let originalArrayPush = Array.prototype.push
Array.prototype.push = function () {
	if (arguments[0]?.eventName === "startGame") {
		STARTGAME = arguments[0].callback
	} else if (arguments[0]?.eventName === "processCommand") {
		PROCESSCOMMAND = arguments[0].callback
	}
	originalArrayPush.apply(this, arguments)
}

// MONKEY PATCH EVENT LISTENER
let lockKeyboard = true
let _listeners = []
let originalAddEventListener = EventTarget.prototype.addEventListener
EventTarget.prototype.addEventListener = function (type, listener, useCapture) {
	if (this == window && type == "keydown") {
		let originalListener = listener
		lockKeyboard = document.activeElement !== document.getElementById("bonkpanelchatinput")
		listener = function () {
			if (lockKeyboard) {
				originalListener.apply(null, arguments)
			}
		}
	}
	_listeners.push({ type: type, listener: listener })
	originalAddEventListener.apply(this, [type, listener, useCapture])
}
let originalRemoveEventListener = EventTarget.prototype.removeEventListener
EventTarget.prototype.removeEventListener = function (type, listener) {
	if (this == window && type == "keydown") {
		_listeners.forEach((e) => {
			if (e.type == type) {
				originalRemoveEventListener.apply(window, [type, e.listener])
			}
		})
		_listeners = []
	}
	originalRemoveEventListener.apply(this, [type, listener])
}
let chatInputEvent = null
setTimeout(() => {
	let originalOn = $.fn.on
	$.fn.on = function (types, func) {
		if (ws && types == "keydown") {
			chatInputEvent = func
			return false
		} else {
			return originalOn.apply(this, arguments)
		}
	}
}, 0)

// CUSTOM EVENT LISTENER
document.addEventListener("keydown", (e) => {
	if (ws == null) return
	if (e.code != "Enter") return
	let chatinput = document.getElementById("bonkpanelchatinput")
	let instruction = document.getElementById("bonkpanellowerinstruction")
	if (inLobby) {
		if (document.activeElement == document.getElementById("maploadwindowsearchinput")) {
			document.getElementById("maploadwindowsearchbutton").click()
		} else if (document.activeElement == chatinput) {
			if (chatinput.value.startsWith("/")) {
				FUNCTIONS.processCommand(chatinput.value)
			} else if (chatinput.value != "") {
				iosend([10, { message: chatinput.value }])
			}
			chatinput.value = ""
			chatinput.blur()
			instruction.style.display = "block"
			chatinput.style.pointerEvents = "none"
		} else {
			chatinput.focus()
			instruction.style.display = "none"
			chatinput.style.pointerEvents = "auto"
		}
	} else {
		if (document.activeElement == chatinput) {
			if (chatinput.value.startsWith("/")) {
				FUNCTIONS.processCommand(chatinput.value)
			} else if (chatinput.value != "") {
				iosend([10, { message: chatinput.value }])
			}
			chatinput.value = ""
			chatinput.blur()
			instruction.style.display = "block"
			chatinput.style.pointerEvents = "none"
			lockKeyboard = true
		} else {
			chatinput.focus()
			instruction.style.display = "none"
			chatinput.style.pointerEvents = "auto"
			lockKeyboard = false
		}
	}
})
document.addEventListener("mouseup", (e) => {
	if (ws && !inLobby) {
		if (commandContainer.style.display != "none") {
			lockKeyboard = false
		} else if (typeof window.getSelection != "undefined" && window.getSelection().toString() != "") {
			lockKeyboard = false
		} else if (e.target.tagName == "INPUT") {
			lockKeyboard = false
		} else {
			lockKeyboard = true
		}
	}
})
document.addEventListener("mousedown", (e) => {
	if (ws && !inLobby) {
		if (commandContainer.style.display != "none") {
			lockKeyboard = false
		} else if (e.target == document.getElementById("bonkpanelcontainer") || e.target == document.querySelector("#gamerenderer > canvas")) {
			lockKeyboard = true
		} else if (e.target.tagName == "INPUT") {
			lockKeyboard = false
		}
	}
})

// ADD SKIN BUTTONS
const skinButtonsContainer = document.createElement("div")
skinButtonsContainer.style = "width: 100%; height: 30px; bottom: 15px; position: absolute; display: flex; justify-content: space-around;"
document.getElementById("skineditor_previewbox").appendChild(skinButtonsContainer)
const tmpEle = document.createElement("input")
tmpEle.type = "file"
tmpEle.style.display = "none"
tmpEle.addEventListener("change", () => {
	let fr = new FileReader()
	fr.onload = function () {
		const result = JSON.parse(fr.result)
		const tmpAvatar = new AVATAR()
		tmpAvatar.bc = result.bc
		tmpAvatar.layers = result.layers
		showFunction(tmpAvatar)
	}
	fr.readAsText(tmpEle.files[0])
})
document.body.appendChild(tmpEle)

var overlayEditing = false
var pos1 = 0,
	pos2 = 0,
	pos3 = 0,
	pos4 = 0,
	overlayScale = 100,
	overlayOpacity = 50
const tmpEle2 = document.createElement("input")
tmpEle2.type = "file"
tmpEle2.style.display = "none"
tmpEle2.addEventListener("change", () => {
	let fr = new FileReader()
	fr.onload = function () {
		importImageOverlay.style.backgroundImage =
			"url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iNDhweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTkgMTYuMTdMNC44MyAxMmwtMS40MiAxLjQxTDkgMTkgMjEgN2wtMS40MS0xLjQxTDkgMTYuMTd6Ii8+PC9zdmc+)"
		imageOverlayContainer.style.pointerEvents = "auto"
		imageOverlay.style.backgroundImage = `url(${fr.result})`
		imageOverlay.style.top = "0px"
		imageOverlay.style.left = "0px"
		overlayScale = 100
		overlayOpacity = 50
		imageOverlay.style.transform = `scale(${overlayScale}%)`
		imageOverlay.style.opacity = `${overlayOpacity}%`
		imageOverlayContainer.onmousedown = function (event) {
			pos3 = event.clientX
			pos4 = event.clientY
			window.onmousemove = function (e) {
				pos1 = pos3 - e.clientX
				pos2 = pos4 - e.clientY
				pos3 = e.clientX
				pos4 = e.clientY
				imageOverlay.style.top = imageOverlay.offsetTop - pos2 + "px"
				imageOverlay.style.left = imageOverlay.offsetLeft - pos1 + "px"
			}
			window.onmouseup = () => {
				window.onmousemove = null
				window.onmouseup = null
			}
		}
		imageOverlayContainer.onwheel = function (event) {
			if (event.shiftKey) {
				if (event.deltaY < 0) {
					overlayOpacity = Math.min(overlayOpacity + 1, 100)
				} else {
					overlayOpacity = Math.max(overlayOpacity - 1, 0)
				}
				imageOverlay.style.opacity = `${overlayOpacity}%`
			} else {
				if (event.deltaY < 0) {
					overlayScale += 1
				} else {
					overlayScale -= 1
				}
				imageOverlay.style.transform = `scale(${overlayScale}%)`
			}
		}
		document.getElementById("skineditor_previewbox_skincontainer").style.pointerEvents = "none"
		overlayEditing = true
	}
	fr.readAsDataURL(tmpEle2.files[0])
})
const importSkin = document.createElement("div")
importSkin.className = "brownButton brownButton_classic"
importSkin.style.width = "30px"
importSkin.style.height = "30px"
importSkin.addEventListener("click", () => {
	tmpEle.click()
})
importSkin.style.backgroundImage =
	"url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNy4zLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDggNDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMSw0MGMtMC44LDAtMS41LTAuMy0yLjEtMC45QzguMywzOC41LDgsMzcuOCw4LDM3di03LjFoM1YzN2gyNnYtNy4xaDNWMzdjMCwwLjgtMC4zLDEuNS0wLjksMi4xDQoJQzM4LjUsMzkuNywzNy44LDQwLDM3LDQwSDExeiBNMjIuNSwzMi4zVjEzLjhsLTYsNmwtMi4xLTIuMUwyNCw4bDkuNyw5LjZsLTIuMiwyLjFsLTYtNnYxOC41SDIyLjV6Ii8+DQo8L3N2Zz4NCg==)"
const importImageOverlay = document.createElement("div")
importImageOverlay.className = "brownButton brownButton_classic"
importImageOverlay.style.width = "30px"
importImageOverlay.style.height = "30px"
importImageOverlay.style.backgroundSize = "80%"
importImageOverlay.style.backgroundPosition = "center"
importImageOverlay.style.backgroundRepeat = "no-repeat"
importImageOverlay.style.backgroundImage =
	"url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iNDhweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTIyIDE4VjJINnYxNmgxNnptLTExLTZsMi4wMyAyLjcxTDE2IDExbDQgNUg4bDMtNHpNMiA2djE2aDE2di0ySDRWNkgyeiIvPjwvc3ZnPg==)"
importImageOverlay.addEventListener("click", () => {
	if (overlayEditing) {
		importImageOverlay.style.backgroundImage =
			"url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iNDhweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTIyIDE4VjJINnYxNmgxNnptLTExLTZsMi4wMyAyLjcxTDE2IDExbDQgNUg4bDMtNHpNMiA2djE2aDE2di0ySDRWNkgyeiIvPjwvc3ZnPg==)"
		imageOverlayContainer.style.pointerEvents = null
		document.getElementById("skineditor_previewbox_skincontainer").style.pointerEvents = null
		overlayEditing = false
	} else {
		imageOverlay.style.backgroundImage = null
		tmpEle2.click()
	}
})
document.getElementById("skineditor_cancelbutton").style.position = "initial"
document.getElementById("skineditor_savebutton").style.position = "initial"
skinButtonsContainer.appendChild(document.getElementById("skineditor_cancelbutton"))
skinButtonsContainer.appendChild(document.getElementById("skineditor_savebutton"))
skinButtonsContainer.appendChild(importImageOverlay)
skinButtonsContainer.appendChild(importSkin)

const skinColourPickerContainerButton = document.createElement("div")
skinColourPickerContainerButton.id = "skinColourPickerContainerButton"
const skinHexColourPicker = document.createElement("div")
skinHexColourPicker.className = "brownButton brownButton_classic buttonShadow"
skinHexColourPicker.innerText = "#"
skinHexColourPicker.onclick = () => {
	const hexCode = window.prompt("Hex Code", "#")
	try {
		showColorPickerArguments[0] = parseInt(hexCode.replace("#", ""), 16)
		showColorPicker(...showColorPickerArguments)
	} catch (error) {}
}
skinColourPickerContainerButton.appendChild(skinHexColourPicker)
skinColourPickerContainerButton.appendChild(document.getElementById("skineditor_colorpicker_cancelbutton"))
skinColourPickerContainerButton.appendChild(document.getElementById("skineditor_colorpicker_savebutton"))
document.getElementById("skineditor_colorpicker").appendChild(skinColourPickerContainerButton)

// SKIN IMAGE OVERLAY
const imageOverlayContainer = document.createElement("div")
imageOverlayContainer.id = "imageOverlayContainer"
const imageOverlay = document.createElement("div")
imageOverlay.id = "imageOverlay"
imageOverlayContainer.appendChild(imageOverlay)
document.getElementById("skineditor_previewbox").appendChild(imageOverlayContainer)

// WS SENDER AND RECEIVER
let wsextra = []
let ws = null
let originalSend = window.WebSocket.prototype.send
window.WebSocket.prototype.send = function (args) {
	if (this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=")) {
		if (typeof args == "string" && !wsextra.includes(this)) {
			if (!ws) {
				ws = this
			}
			try {
				if (args.startsWith("42[")) {
					let data = JSON.parse(/42(.*)/.exec(args)[1])
					handleOwnData(data, this)
				}
			} catch (error) {
				console.log(args)
				console.log(error)
			}
		}
	} else if (args.includes("rport")) {
		return
	}
	if (this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=") && !this.injected) {
		this.injected = true

		let originaReceiveMessage = this.onmessage
		this.onmessage = (e) => {
			if (!wsextra.includes(this)) {
				if (typeof e.data == "string") {
					try {
						if (e.data.startsWith("42[")) {
							handleData(JSON.parse(/42(.*)/.exec(e.data)[1]), this)
						}
					} catch (error) {
						console.log(e.data)
						console.log(error)
					}
				}
			}
			return originaReceiveMessage.call(this, e)
		}

		let originalClose = this.onclose
		this.onclose = function () {
			if (wsextra.includes(this)) {
				wsextra.splice(wsextra.indexOf(this), 1)
			} else {
				ws = null
				panelLeft.style.visibility = "hidden"
				panelRight.style.visibility = "hidden"
			}
			return originalClose.call(this)
		}
	}
	return originalSend.call(this, args)
}
function iosend(data) {
	if (ws == null) return
	ws.send(`42${JSON.stringify(data)}`)
}
function ioreceive(data) {
	if (ws == null) return
	ws.onmessage({ data: `42${JSON.stringify(data)}` })
}

// HANDLE DATA
function handleData(data, websocket) {
	switch (data[0]) {
		case 1:
			// got ping data
			originalSend.call(websocket, `42[1,{"id":${data[1]}}]`)
			for (const id in data[1]) {
				if (ROOM_VAR.players[id]) {
					ROOM_VAR.players[id].ping = data[1][id]
				}
			}
			SCENES.updatePlayersPing()
			break
		case 2:
			// room Created
			inLobby = true
			ROOM_VAR.quick = false
			ROOM_VAR.bal = []
			ROOM_VAR.chatAvatarCache = []
			ROOM_VAR.commandAvatarCache = []
			ROOM_VAR.playersAvatarCache = []
			ROOM_VAR.xpEarned = 0
			SCENES.system()
			SCENES.chat()
			SCENES.players()
			SCENES.leaderboard()
			break
		case 3:
			// joined Room
			panelLeft.style.visibility = "visible"
			panelRight.style.visibility = "visible"
			ROOM_VAR.players = data[3]
			ROOM_VAR.hostID = data[2]
			ROOM_VAR.quick = false
			ROOM_VAR.xpEarned = 0
			ROOM_VAR.chatAvatarCache = []
			ROOM_VAR.commandAvatarCache = []
			ROOM_VAR.playersAvatarCache = []
			SCENES.system()
			SCENES.chat()
			SCENES.players()
			if (ROOM_VAR.players[data[1]].userName == document.getElementById("pretty_top_name").textContent) {
				ROOM_VAR.myID = data[1]
				ws = websocket
			} else {
				wsextra.push(websocket)
			}
			break
		case 4:
			// new player joined
			FUNCTIONS.showSystemMessage(data[3] + " has joined the game", "#b53030", true)
			ROOM_VAR.players[data[1]] = {
				peerID: data[2],
				userName: data[3],
				guest: data[4],
				level: data[5],
				team: data[6],
				avatar: data[7]
			}
			SCENES.players()
			break
		case 5:
			// someone left
			FUNCTIONS.showSystemMessage(ROOM_VAR.players[data[1]].userName + " has left the game", "#b53030", true)
			ROOM_VAR.players[data[1]] = null
			SCENES.players()
			break
		case 6:
			// host left
			ROOM_VAR.hostID = data[2]
			if (data[2] == -1) {
				FUNCTIONS.showSystemMessage(`${ROOM_VAR.players[data[1]].userName} has left the game and closed the room`, "#b53030", true)
			} else {
				FUNCTIONS.showSystemMessage(
					`${ROOM_VAR.players[data[1]].userName} has left the game and ${ROOM_VAR.players[data[2]].userName} is now the game host`,
					"#b53030",
					true
				)
			}
			if (data[2] == ROOM_VAR.myID) {
				FUNCTIONS.showSystemMessage("You are now the host of this game", "#800d6e")
			}
			ROOM_VAR.players[data[1]] = null
			SCENES.players()
			break
		case 8:
			// ready change
			ROOM_VAR.players[data[1]].ready = data[2]
			SCENES.players()
			break
		case 13:
			// return to lobby
			inLobby = true
			SCENES.leaderboard()
			break
		case 15:
			// game started
			inLobby = false
			SCENES.leaderboard()
			break
		case 16:
			// status (something like chat rate limited)
			if (["rate_limit_ready", "chat_rate_limit"].includes(data[1])) {
				FUNCTIONS.showSystemMessage("You're doing that too much!", "#cc4444")
			} else if (data[1] == "teams_locked") {
				FUNCTIONS.showSystemMessage("Failed, teams have been locked, only the host can assign teams", "#cc4444")
			}
			break
		case 18:
			// team changed
			ROOM_VAR.players[data[1]].team = data[2]
			SCENES.players()
			break
		case 19:
			// team lock changed
			if (data[1]) {
				FUNCTIONS.showSystemMessage("Teams have been locked, only the host can assign teams", "#b53030")
			} else {
				FUNCTIONS.showSystemMessage("Teams have been unlocked", "#b53030")
			}
			break
		case 20:
			// chat messages
			FUNCTIONS.showChatMessage(data[2], data[1])
			break
		case 21:
			// game settings first load
			inLobby = true
			SCENES.leaderboard()
			ROOM_VAR.bal = data[1].bal
			break
		case 24:
			// kicked
			FUNCTIONS.showSystemMessage(`${ROOM_VAR.players[data[1]].userName} was ${data[2] ? "kicked" : "banned"}!`, "#b53030")
			break
		case 26:
			// change gamo
			let mode = "Classic"
			switch (data[2]) {
				case "b":
					mode = "Classic"
					break
				case "ar":
					mode = "Arrows"
					break
				case "ard":
					mode = "Death Arrows"
					break
				case "sp":
					mode = "Grapple"
					break
				case "f":
					mode = "Football"
					break
				case "v":
					mode = "VTOL"
					break
			}
			FUNCTIONS.showSystemMessage("Game mode changed to: " + mode, "#800d6e")
			break
		case 27:
			// change win lose
			FUNCTIONS.showSystemMessage("Rounds to win changed to: " + data[1], "#800d6e")
			break
		case 32:
			// afk warn
			FUNCTIONS.showSystemMessage("STOP AFK, WAKE UP!!!", "#b53030")
			break
		case 36:
			// balance
			ROOM_VAR.bal[data[1]] = data[2]
			SCENES.players()
			break
		case 39:
			// team settings change
			let onoroff = data[1] ? "on" : "off"
			FUNCTIONS.showSystemMessage(`Teams ${onoroff}`, "#800d6e")
			break
		case 40:
			// arm record
			if (data[1] != ROOM_VAR.myID) {
				FUNCTIONS.showSystemMessage(`${ROOM_VAR.players[data[1]].userName} requests record gameplay`, "#b53030")
			}
			break
		case 41:
			// host changed
			FUNCTIONS.showSystemMessage(
				ROOM_VAR.players[data[1].oldHost].userName +
					" has given host privileges to " +
					ROOM_VAR.players[data[1].newHost].userName +
					", who is now the game host",
				"#b53030"
			)
			if (data[1].newHost == ROOM_VAR.myID) {
				FUNCTIONS.showSystemMessage("You are now the host of this game", "#800d6e")
			}
			ROOM_VAR.hostID = data[1].newHost
			SCENES.players()
			break
		case 43:
			// countdown
			FUNCTIONS.showSystemMessage("Game starting in " + data[1], "#0955c7")
			break
		case 44:
			// countdown aborted
			FUNCTIONS.showSystemMessage("Countdown aborted!", "#0955c7")
			break
		case 45:
			// player leveled up
			ROOM_VAR.players[data[1].sid].level = data[1].lv
			SCENES.players()
			break
		case 46:
			// gained xp
			ROOM_VAR.xpEarned += 100
			break
		case 48:
			// show in game data if just joined
			inLobby = false
			SCENES.leaderboard()
			ROOM_VAR.bal = data[1].gs.bal
			ROOM_VAR.quick = data[1].gs.q
			break
		case 49:
			// autojoin
			ROOM_VAR.autoJoinID = data[1]
			ROOM_VAR.autoJoinPassBypass = data[2]
			break
		case 52:
			// tabbed update
			ROOM_VAR.players[data[1]].tabbed = data[2]
			SCENES.updatePlayersPing()
			break
		case 58:
			// room name changed
			FUNCTIONS.showSystemMessage("Room name changed to: " + data[1], "#800d6e")
			break
		case 59:
			// room password changed
			if (data[1]) {
				FUNCTIONS.showSystemMessage("A new password has been set for this room", "#800d6e")
			} else {
				FUNCTIONS.showSystemMessage("This room no longer requires a password to join.", "#800d6e")
			}
			break
	}
}

// HANDLE OWN DATA
function handleOwnData(data, websocket) {
	switch (data[0]) {
		case 5:
			ROOM_VAR.quick = data[1].gs.q
			break
		case 14:
			// Own quit game
			inLobby = true
			SCENES.leaderboard()
			break
		case 12:
			// Created room
			ROOM_VAR.myID = 0
			ROOM_VAR.hostID = 0
			ws = websocket
			panelLeft.style.visibility = "visible"
			panelRight.style.visibility = "visible"
			ROOM_VAR.players = []
			let tmpdata = data[1]
			tmpdata.userName = document.getElementById("pretty_top_name").innerText
			if (!data[1].guest) {
				tmpdata.level = parseInt(document.getElementById("pretty_top_level").innerText.substring(3))
			}
			ROOM_VAR.players.push(tmpdata)
			break
		case 20:
			// Change GAMO
			ioreceive([26, data[1].ga, data[1].mo])
			break
		case 21:
			// Change win lose
			ioreceive([27, data[1].w])
			break
		case 32:
			// Change teamchain
			ioreceive([39, data[1].t])
			break
		case 29:
			// Change balance
			ioreceive([36, data[1].sid, data[1].bal])
			break
	}
}

setInterval(() => {
	SCENES.leaderboard()
}, 1000)
