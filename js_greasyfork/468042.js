// ==UserScript==
// @name         MooMoo.io Private Chat Room
// @description  Chat with your friends privately
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.4.7/peerjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @license      MIT
// @version      0.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/468042/MooMooio%20Private%20Chat%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/468042/MooMooio%20Private%20Chat%20Room.meta.js
// ==/UserScript==

/*
1) To get started, press "Shift" + "Enter"
2) Now you should be able to see 4 buttons:
- Join Room (Join a room via room ID)
- Create Room (Create a room)
- Show/Hide (Show or hide the chat container)
- Open/Close Editor (Edit the position of the chat container by dragging it around / Change the size of the chat container at the bottom right of the chat container)
3) After you have joined or created a room, press "Shift" + "Enter" to activate the private chat input message holder.
4) Once you have finished typing your message, press "Enter" to send the message to the chat room
5) If you want to clear the chat, type "/clear" and then press "Enter"
*/

;(() => {
	let myID = null
	let conn = null
	let peer = null
	let connected = false
	let editing = false

	const gameUI = document.getElementById("gameUI")
	const gameCanvas = document.getElementById("gameCanvas")

	const style = document.createElement("style")
	style.innerHTML = /*css*/ `
        #chatContainer {
			background-color: rgba(0, 0, 0, 0.1);
            position: absolute;
			padding: 10px;
			pointer-events: all;
			word-break: break-word;
			overflow-x: hidden;
        }
		#chatContainer::-webkit-scrollbar {
			width: 0.6em;
		}
		#chatContainer::-webkit-scrollbar-thumb {
			background-color: white;
		}
		#chatContainer::-webkit-scrollbar-track {
			background-color: none !important;
		}
        #roomChatSettingsContainer {
            width: 100%;
            position: fixed;
            text-align: center;
            top: 50%;
            transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            -moz-transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            -o-transform: translateY(-50%);
        }
        .roomChatSettingButton {
            margin: 10px;
        }
        #roomChatBoxInput {
            padding: 6px;
            font-size: 20px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.25);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            pointer-events: all;
            border: 0;
        }
        #roomChatBoxInput:focus {
            outline: none;
        }
		#popupContainer {
			width: 100%;
            position: fixed;
            text-align: center;
            top: 50%;
            transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            -moz-transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            -o-transform: translateY(-50%);
		}
		#popupContainerInput {
			padding: 10px;
            font-size: 26px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.25);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            pointer-events: all;
            border: 0;
		}
		#popupContainerInput:focus {
			outline: none;
		}
		.chatmsgholder {
			width: 100%;
			color: white;
			font-size: 22px;
		}
		.systemmsgholder {
			width: 100%;
			color: #fadadc;
			font-size: 22px;
		}
    	`
	document.head.appendChild(style)
	const style2 = document.createElement("link")
	style2.rel = "stylesheet"
	style2.href = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/themes/le-frog/jquery-ui.min.css"
	document.head.appendChild(style2)

	const chatContainer = document.createElement("div")
	chatContainer.id = "chatContainer"
	chatContainer.style.overflowY = "auto"
	chatContainer.style.width = localStorage.getItem("room_chat_width") ? localStorage.getItem("room_chat_width") : "15%"
	chatContainer.style.height = localStorage.getItem("room_chat_height") ? localStorage.getItem("room_chat_height") : "30%"
	chatContainer.style.top = localStorage.getItem("room_chat_top") ? localStorage.getItem("room_chat_top") : "0%"
	chatContainer.style.left = localStorage.getItem("room_chat_left") ? localStorage.getItem("room_chat_left") : "0%"
	chatContainer.style.display = "none"
	gameUI.appendChild(chatContainer)

	const roomChatSettingsContainer = document.createElement("div")
	roomChatSettingsContainer.style.display = "none"
	roomChatSettingsContainer.id = "roomChatSettingsContainer"

	const joinRoomButton = document.createElement("div")
	joinRoomButton.className = "roomChatSettingButton storeTab"
	joinRoomButton.textContent = "Join Room"
	roomChatSettingsContainer.appendChild(joinRoomButton)

	const createRoomButton = document.createElement("div")
	createRoomButton.className = "roomChatSettingButton storeTab"
	createRoomButton.textContent = "Create Room"
	roomChatSettingsContainer.appendChild(createRoomButton)

	const copyRoomIDButton = document.createElement("div")
	copyRoomIDButton.className = "roomChatSettingButton storeTab"
	copyRoomIDButton.textContent = "Copy Room ID"
	copyRoomIDButton.style.display = "none"
	roomChatSettingsContainer.appendChild(copyRoomIDButton)

	const leaveRoomButton = document.createElement("div")
	leaveRoomButton.className = "roomChatSettingButton storeTab"
	leaveRoomButton.textContent = "Leave Room"
	leaveRoomButton.style.display = "none"
	roomChatSettingsContainer.appendChild(leaveRoomButton)

	const deleteRoomButton = document.createElement("div")
	deleteRoomButton.className = "roomChatSettingButton storeTab"
	deleteRoomButton.textContent = "Delete Room"
	deleteRoomButton.style.display = "none"
	roomChatSettingsContainer.appendChild(deleteRoomButton)

	const toggleHideButton = document.createElement("div")
	toggleHideButton.className = "roomChatSettingButton storeTab"
	toggleHideButton.textContent = "Show"
	roomChatSettingsContainer.appendChild(toggleHideButton)

	const editStyleButton = document.createElement("div")
	editStyleButton.className = "roomChatSettingButton storeTab"
	editStyleButton.textContent = "Open Editor"
	roomChatSettingsContainer.appendChild(editStyleButton)

	function mousedown(event) {
		gameCanvas.dispatchEvent(
			new MouseEvent("mousedown", {
				button: event.button
			})
		)
	}
	function mouseup(event) {
		gameCanvas.dispatchEvent(
			new MouseEvent("mouseup", {
				button: event.button
			})
		)
	}
	function mousemove(event) {
		gameCanvas.dispatchEvent(
			new MouseEvent("mousemove", {
				clientX: event.clientX,
				clientY: event.clientY
			})
		)
	}
	chatContainer.onmousedown = mousedown
	chatContainer.onmouseup = mouseup
	chatContainer.onmousemove = mousemove
	editStyleButton.onclick = function () {
		if (editing) {
			editing = false
			editStyleButton.textContent = "Open Editor"
			chatContainer.style.overflowY = "auto"
			$("#chatContainer").resizable("destroy")
			$("#chatContainer").draggable("destroy")
			chatContainer.onmousedown = mousedown
			chatContainer.onmouseup = mouseup
			chatContainer.onmousemove = mousemove
			gameCanvas.style.pointerEvents = "auto"
		} else {
			editing = true
			editStyleButton.textContent = "Close Editor"
			chatContainer.style.overflowY = "hidden"
			if (chatContainer.style.display == "none") {
				chatContainer.style.display = "block"
				toggleHideButton.textContent = "Hide"
			}
			chatContainer.onmousedown = null
			chatContainer.onmouseup = null
			chatContainer.onmousemove = null
			gameCanvas.style.pointerEvents = "none"
			$("#chatContainer").resizable({
				containment: "#gameUI",
				stop: function (event, ui) {
					const width = (ui.size.width / window.innerWidth) * 100 + "%"
					const height = (ui.size.height / window.innerHeight) * 100 + "%"
					localStorage.setItem("room_chat_width", width)
					localStorage.setItem("room_chat_height", height)
					chatContainer.style.width = width
					chatContainer.style.height = height
				}
			})
			$("#chatContainer").draggable({
				containment: "#gameUI",
				stop: function (event, ui) {
					const top = (ui.position.top / window.innerHeight) * 100 + "%"
					const left = (ui.position.left / window.innerWidth) * 100 + "%"
					localStorage.setItem("room_chat_top", top)
					localStorage.setItem("room_chat_left", left)
					chatContainer.style.top = top
					chatContainer.style.left = left
				}
			})
		}
	}
	toggleHideButton.onclick = function () {
		if (chatContainer.style.display == "none") {
			chatContainer.style.display = "block"
			toggleHideButton.textContent = "Hide"
		} else {
			chatContainer.style.display = "none"
			toggleHideButton.textContent = "Show"
			if (editing) {
				editing = false
				editStyleButton.textContent = "Open Editor"
				chatContainer.style.overflowY = "auto"
				$("#chatContainer").resizable("destroy")
				$("#chatContainer").draggable("destroy")
				chatContainer.onmousedown = mousedown
				chatContainer.onmouseup = mouseup
				chatContainer.onmousemove = mousemove
				gameCanvas.style.pointerEvents = "auto"
			}
		}
	}
	document.getElementById("chatHolder").appendChild(roomChatSettingsContainer)

	const roomChatBoxInput = document.createElement("input")
	roomChatBoxInput.setAttribute("autocomplete", "off")
	roomChatBoxInput.setAttribute("aria-autocomplete", "none")
	roomChatBoxInput.id = "roomChatBoxInput"
	roomChatBoxInput.type = "text"
	roomChatBoxInput.placeholder = "Enter Private Message"
	roomChatBoxInput.maxLength = 50
	roomChatBoxInput.style.display = "none"
	document.getElementById("chatHolder").appendChild(roomChatBoxInput)

	const popupContainer = document.createElement("div")
	popupContainer.id = "popupContainer"
	popupContainer.style.display = "none"

	const popupContainerInput = document.createElement("input")
	popupContainerInput.setAttribute("autocomplete", "off")
	popupContainerInput.setAttribute("aria-autocomplete", "none")
	popupContainerInput.id = "popupContainerInput"
	popupContainerInput.className = "roomChatSettingButton"
	popupContainerInput.type = "text"
	popupContainerInput.placeholder = "Enter username"
	popupContainer.appendChild(popupContainerInput)

	const popupContainerokButton = document.createElement("div")
	popupContainerokButton.className = "roomChatSettingButton storeTab"
	popupContainerokButton.textContent = "OK"
	popupContainer.appendChild(popupContainerokButton)

	const popupContainercancelButton = document.createElement("div")
	popupContainercancelButton.className = "roomChatSettingButton storeTab"
	popupContainercancelButton.textContent = "Cancel"
	popupContainercancelButton.onclick = function () {
		popupContainer.style.display = "none"
		if (document.getElementById("chatHolder").style.display != "none") {
			roomChatSettingsContainer.style.display = "block"
		}
	}
	popupContainer.appendChild(popupContainercancelButton)
	document.getElementById("chatHolder").appendChild(popupContainer)

	new MutationObserver((mutations) => {
		mutations.forEach((mutationRecord) => {
			if (document.getElementById("chatHolder").style.display != "block") {
				popupContainer.style.display = "none"
				document.getElementById("chatBox").hidden = false
				roomChatBoxInput.style.display = "none"
				roomChatBoxInput.value = ""
				if (editing) {
					editing = false
					editStyleButton.textContent = "Open Editor"
					chatContainer.style.overflowY = "auto"
					$("#chatContainer").resizable("destroy")
					$("#chatContainer").draggable("destroy")
					chatContainer.onmousedown = mousedown
					chatContainer.onmouseup = mouseup
					chatContainer.onmousemove = mousemove
					gameCanvas.style.pointerEvents = "auto"
				}
			}
		})
	}).observe(document.getElementById("chatHolder"), {
		attributes: true,
		attributeFilter: ["style"]
	})

	let sendMessage = () => {}
	window.addEventListener("keydown", (event) => {
		if (event.code != "Enter") return

		if (event.shiftKey) {
			roomChatSettingsContainer.style.display = "block"
			document.getElementById("chatBox").hidden = true
			if (connected) {
				roomChatBoxInput.style.display = "inline-block"
				const interval = setInterval(() => {
					roomChatBoxInput.focus()
					if (document.activeElement == roomChatBoxInput) {
						clearInterval(interval)
					}
				}, 10)
			}
		} else {
			roomChatSettingsContainer.style.display = "none"
			if (document.getElementById("chatBox").hidden && roomChatBoxInput.value != "") {
				if (connected) {
					sendMessage(roomChatBoxInput.value)
				}
				roomChatBoxInput.value = ""
				document.getElementById("chatBox").hidden = false
				roomChatBoxInput.style.display = "none"
			}
		}
	})

	function copy(text) {
		var input = document.createElement("textarea")
		input.innerHTML = text
		document.body.appendChild(input)
		input.select()
		var result = document.execCommand("copy")
		document.body.removeChild(input)
		return result
	}

	function showSystemMessage(msg) {
		const needToScroll = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 5
		const container = document.createElement("div")
		container.className = "systemmsgholder"
		const systemmsgholder = document.createElement("span")
		systemmsgholder.innerText = "* " + msg
		container.appendChild(systemmsgholder)
		chatContainer.appendChild(container)
		if (chatContainer.childElementCount > 250) {
			chatContainer.removeChild(chatContainer.firstChild)
		}
		if (needToScroll) {
			chatContainer.scrollTop = chatContainer.scrollHeight
		}
	}

	function showChatMessage(owner, msg) {
		const needToScroll = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 5
		const container = document.createElement("div")
		container.className = "chatmsgholder"
		const nameholder = document.createElement("span")
		nameholder.innerText = owner + ": "
		container.appendChild(nameholder)
		const chatmsgholder = document.createElement("span")
		chatmsgholder.innerText = msg.substring(0, 50)
		chatmsgholder.style.color = "rgba(255, 255, 255, 0.6)"
		container.appendChild(chatmsgholder)
		chatContainer.appendChild(container)
		if (chatContainer.childElementCount > 250) {
			chatContainer.removeChild(chatContainer.firstChild)
		}
		if (needToScroll) {
			chatContainer.scrollTop = chatContainer.scrollHeight
		}
	}

	let myselfLeft = false
	joinRoomButton.addEventListener("click", () => {
		peer = new Peer()
		peer.on("open", async (id) => {
			myID = id
			if (myID == null) return

			popupContainerInput.value = ""
			popupContainerInput.placeholder = "Enter Room ID"
			popupContainer.style.display = "block"
			roomChatSettingsContainer.style.display = "none"
			popupContainerInput.focus()
			popupContainerokButton.onclick = function () {
				const roomID = popupContainerInput.value
				if (roomID == null || roomID == "") {
					document.getElementById("chatButton").click()
					return
				}

				popupContainerInput.value = ""
				popupContainerInput.placeholder = "Enter Username"
				popupContainer.style.display = "block"
				roomChatSettingsContainer.style.display = "none"
				popupContainerInput.focus()
				popupContainerokButton.onclick = function () {
					document.getElementById("chatButton").click()
					const name = popupContainerInput.value
					if (name == null || name == "") return

					conn = peer.connect(roomID)
					conn.on("open", () => {
						connected = true
						chatContainer.innerHTML = ""
						chatContainer.style.display = "block"
						toggleHideButton.textContent = "Hide"
						conn.on("data", (data) => {
							if (data.type === 0) {
								conn.send({
									name: name,
									peerID: myID,
									type: 0
								})
							} else if (data.type === 1) {
								// SYSTEM MESSAGE
								showSystemMessage(data.msg)
							} else if (data.type === 2) {
								// SOMEONE SEND MESSAGE
								showChatMessage(data.owner, data.msg)
							}
						})
					})

					myselfLeft = false
					conn.on("close", () => {
						document.getElementById("chatButton").click()
						connected = false
						joinRoomButton.style.display = "inline-block"
						createRoomButton.style.display = "inline-block"
						copyRoomIDButton.style.display = "none"
						leaveRoomButton.style.display = "none"
						if (!myselfLeft) {
							showSystemMessage("You left the chat room due to either a lost connection or the chat room being closed")
						}
					})

					sendMessage = (msg) => {
						if (msg == "/clear") {
							chatContainer.innerHTML = ""
							return
						}
						conn.send({
							type: 1,
							peerID: myID,
							msg: msg
						})
					}

					joinRoomButton.style.display = "none"
					createRoomButton.style.display = "none"
					copyRoomIDButton.onclick = function () {
						copy(roomID)
					}
					copyRoomIDButton.style.display = "inline-block"
					leaveRoomButton.style.display = "inline-block"
					leaveRoomButton.onclick = function () {
						document.getElementById("chatButton").click()
						myselfLeft = true
						conn.close()
						peer.destroy()
						connected = false
						joinRoomButton.style.display = "inline-block"
						createRoomButton.style.display = "inline-block"
						copyRoomIDButton.style.display = "none"
						leaveRoomButton.style.display = "none"
						showSystemMessage("You left the chat room")
					}
				}
			}
		})
	})

	createRoomButton.addEventListener("click", () => {
		peer = new Peer()
		peer.on("open", (id) => {
			myID = id
			if (myID == null) return

			popupContainerInput.value = ""
			popupContainerInput.placeholder = "Enter Username"
			popupContainer.style.display = "block"
			roomChatSettingsContainer.style.display = "none"
			popupContainerInput.focus()
			popupContainerokButton.onclick = function () {
				document.getElementById("chatButton").click()
				const name = popupContainerInput.value
				if (name == null || name == "") return

				connected = true
				chatContainer.innerHTML = ""
				chatContainer.style.display = "block"
				toggleHideButton.textContent = "Hide"
				let allConnections = [
					{
						name: name + "[1]",
						peerID: myID,
						conn: null
					}
				]
				let usernameCounter = 1
				showSystemMessage("Room created")
				copy(myID)
				showSystemMessage("Room ID copied")
				peer.on("connection", (connection) => {
					connection.on("open", () => {
						connection.on("data", (data) => {
							if (data.type === 0) {
								// RECEIVED JOIN DATA (peerID, name, type)
								usernameCounter++
								allConnections.push({
									name: `${data.name}[${usernameCounter}]`,
									peerID: data.peerID,
									conn: connection
								})
								allConnections.forEach((e) => {
									if (e.conn == null) return

									e.conn.send({
										type: 1,
										peerID: data.peerID,
										msg: `${data.name}[${usernameCounter}] has joined the chat room`
									})
								})
								showSystemMessage(`${data.name}[${usernameCounter}] has joined the chat room`)
							} else if (data.type === 1) {
								// RECEIVE SEND MESSAGE (peerID, type, msg)
								for (let index = 0; index < allConnections.length; index++) {
									if (allConnections[index].peerID == data.peerID) {
										allConnections.forEach((e) => {
											if (e.conn == null) return
											e.conn.send({
												type: 2,
												owner: allConnections[index].name,
												msg: data.msg
											})
										})
										showChatMessage(allConnections[index].name, data.msg)
										break
									}
								}
							}
						})
						connection.send({ type: 0 })
					})

					const otherpeerID = connection.peer
					connection.on("close", () => {
						for (let index = 0; index < allConnections.length; index++) {
							if (allConnections[index].peerID == otherpeerID) {
								const name = allConnections[index].name
								allConnections.splice(index, 1)
								allConnections.forEach((e) => {
									if (e.conn == null) return
									e.conn.send({
										type: 1,
										peerID: otherpeerID,
										msg: `${name} has left the chat room`
									})
								})
								showSystemMessage(`${name} has left the chat room`)
								break
							}
						}
					})
				})

				sendMessage = (msg) => {
					if (msg == "/clear") {
						chatContainer.innerHTML = ""
						return
					}
					allConnections.forEach((e) => {
						if (e.conn == null) return
						e.conn.send({
							type: 2,
							owner: name + "[1]",
							msg: msg
						})
					})
					showChatMessage(name + "[1]", msg)
				}

				joinRoomButton.style.display = "none"
				createRoomButton.style.display = "none"
				copyRoomIDButton.onclick = function () {
					copy(myID)
					showSystemMessage("Room ID copied")
				}
				copyRoomIDButton.style.display = "inline-block"
				deleteRoomButton.style.display = "inline-block"
				deleteRoomButton.onclick = function () {
					document.getElementById("chatButton").click()
					peer.destroy()
					connected = false
					joinRoomButton.style.display = "inline-block"
					createRoomButton.style.display = "inline-block"
					copyRoomIDButton.style.display = "none"
					deleteRoomButton.style.display = "none"
				}
			}
		})
	})
})()
