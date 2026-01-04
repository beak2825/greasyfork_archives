// ==UserScript==
// @name            YouTube - Spadające Płatki Śniegu
// @name:en         YouTube - SnowFlakes
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Powoduje, że na playerze YouTube spadają płatki śniegu, można edytować zmienne klawiszami "q", "a", "w", "s". Backpace służy włanczaniem i wyłanczaniem animacji. Miłej zabawy :)
// @description:en  The script generates cool Snowflakes that fall down in your YouTube player. Editing varables: "q", "a", "w", "s". Backpace is for toggling the animation. Have Fun! :)
// @author          Krzysztof Jarończyk
// @match           https://www.youtube.com/*
// @grant           none
// @icon            https://raw.githubusercontent.com/KrzysztofJaronczyk/YouTube-SnowFlakes/main/snowflake.webp
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/486867/YouTube%20-%20Spadaj%C4%85ce%20P%C5%82atki%20%C5%9Aniegu.user.js
// @updateURL https://update.greasyfork.org/scripts/486867/YouTube%20-%20Spadaj%C4%85ce%20P%C5%82atki%20%C5%9Aniegu.meta.js
// ==/UserScript==

(function () {
	'use strict'

	let fontLink = document.createElement('link')
	fontLink.href = 'https://fonts.googleapis.com/css?family=Montserrat:400,700'
	fontLink.rel = 'stylesheet'
	document.head.appendChild(fontLink)

	let player = document.getElementById('movie_player')

	let isEnabled =
		localStorage.getItem('snowflakesEnabled') === null ? true : localStorage.getItem('snowflakesEnabled') === 'true'

	let fallSpeed = 5 // Initial falling speed
	const minSpeed = 1 // Minimum falling speed
	const maxSpeed = 10 // Maximum falling speed
	let respawnTime = 500
	const minRespawnTime = 100 // Minimum respawn time
	const maxRespawnTime = 12000 // Maximum respawn time

	if (player) {
		let snowflakeInterval = setInterval(createSnowflake, respawnTime)

		function createSnowflake(x, y, isBig = false) {
			if (!isEnabled) return

			let snowflake = document.createElement('div')
			snowflake.innerHTML = '&#10052;'
			snowflake.style.position = 'absolute'
			snowflake.style.pointerEvents = 'none'
			snowflake.style.zIndex = '100000'
			let size = isBig ? 100 : Math.random() * 24 + 10
			snowflake.style.fontSize = `${size}px`
			let opacity = isBig ? 1 : Math.random()
			if (!isBig && opacity < 0.2) return
			snowflake.style.opacity = opacity.toString()
			let grayShade = Math.floor(Math.random() * 256)
			snowflake.style.color = `rgb(${grayShade}, ${grayShade}, ${grayShade})`

			let playerRect = player.getBoundingClientRect()
			snowflake.style.left = `${x ?? playerRect.left + Math.random() * playerRect.width}px`
			snowflake.style.top = `${y ?? 0}px`

			player.appendChild(snowflake)

			let windDirection = Math.random() > 0.5 ? 1 : -1
			let windStrength = Math.random() * 2
			let fall = setInterval(() => {
				if (!isEnabled) {
					clearInterval(fall)
					snowflake.remove()
					return
				}

				let currentTop = parseInt(snowflake.style.top, 10)
				if (currentTop < playerRect.height) {
					snowflake.style.top = `${currentTop + fallSpeed}px`
					snowflake.style.left = `${parseFloat(snowflake.style.left) + windDirection * windStrength}px`
				} else {
					clearInterval(fall)
					snowflake.remove()
				}
			}, 50)
		}

		setInterval(() => {
			if (!isEnabled) return
			createSnowflake()
		}, respawnTime)

		document.addEventListener('keydown', event => {
			if (event.code === 'Space') {
				event.preventDefault()
				let numberOfFlakes = Math.floor(Math.random() * 4) + 1
				for (let i = 0; i < numberOfFlakes; i++) {
					let offsetX = Math.random() * 100 - 50
					let offsetY = Math.random() * 100 - 50
					let centerX = player.offsetLeft + player.offsetWidth / 2 + offsetX
					let centerY = player.offsetTop + player.offsetHeight / 2 + offsetY
					createSnowflake(centerX, centerY)
				}
			}
		})

		let currentMessageContainer = null

		function showStatusMessage(message) {
			if (currentMessageContainer) {
				currentMessageContainer.remove()
			}

			let messageContainer = document.createElement('div')
			messageContainer.style.position = 'absolute'
			messageContainer.style.top = '0'
			messageContainer.style.left = '0'
			messageContainer.style.width = '100%'
			messageContainer.style.height = '100%'
			messageContainer.style.display = 'flex'
			messageContainer.style.justifyContent = 'center'
			messageContainer.style.alignItems = 'center'
			messageContainer.style.pointerEvents = 'none'

			let statusMessage = document.createElement('h3')
			statusMessage.innerHTML = message
			statusMessage.style.fontFamily = 'Montserrat, sans-serif'
			statusMessage.style.fontSize = '24px'
			statusMessage.style.color = 'white'
			statusMessage.style.zIndex = '100001'
			statusMessage.style.backgroundColor = 'rgba(0,0,0,0.7)'
			statusMessage.style.padding = '10px'
			statusMessage.style.borderRadius = '8px'
			statusMessage.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)'

			messageContainer.appendChild(statusMessage)
			player.appendChild(messageContainer)

			currentMessageContainer = messageContainer

			setTimeout(() => {
				messageContainer.remove()
				if (currentMessageContainer === messageContainer) {
					currentMessageContainer = null
				}
			}, 1500)
		}

		function adjustRespawnTime(newTime) {
			respawnTime = Math.max(minRespawnTime, Math.min(newTime, maxRespawnTime))
			clearInterval(snowflakeInterval)
			snowflakeInterval = setInterval(createSnowflake, respawnTime)
		}

		document.addEventListener('keydown', event => {
			if (event.code === 'Backspace') {
				event.preventDefault()
				isEnabled = !isEnabled
				localStorage.setItem('snowflakesEnabled', isEnabled)
				showStatusMessage(
					isEnabled ? '<span>&#10052;</span> Snowflakes enabled' : '<span>&#10052;</span> Snowflakes disabled'
				)
			}

			if (!isEnabled) return

			if (event.code === 'Space') {
				event.preventDefault()
				createSnowflake(player.offsetWidth / 2, 0)
			} else if (event.code === 'KeyQ') {
				fallSpeed = Math.min(fallSpeed + 1, maxSpeed)
				showStatusMessage(`Falling speed: ${fallSpeed}`)
			} else if (event.code === 'KeyA') {
				fallSpeed = Math.max(fallSpeed - 1, minSpeed)
				showStatusMessage(`Falling speed: ${fallSpeed}`)
			} else if (event.code === 'KeyF') {
				let centerX = player.offsetLeft + player.offsetWidth / 2
				createSnowflake(centerX, 0, true)
			} else if (event.code === 'KeyW') {
				adjustRespawnTime(respawnTime + 100)
				showStatusMessage(`Respawn rate: ${respawnTime}ms`)
			} else if (event.code === 'KeyS') {
				adjustRespawnTime(respawnTime - 100)
				showStatusMessage(`Respawn rate: ${respawnTime}ms`)
			}
		})

		if (!isEnabled) {
			showStatusMessage('<span>&#10052;</span> Snowflakes disabled')
		}
	}

	if (!localStorage.getItem('scriptWelcomeShown6')) {
		isEnabled = false

		var modal = document.createElement('div')
		modal.style.position = 'fixed'
		modal.style.left = '0'
		modal.style.top = '0'
		modal.style.width = '100%'
		modal.style.height = '100vh'
		modal.style.backgroundColor = 'rgba(0,0,0,0.5)'
		modal.style.display = 'flex'
		modal.style.justifyContent = 'center'
		modal.style.alignItems = 'center'
		modal.style.zIndex = '10000'

		var modalContent = document.createElement('div')
		modalContent.style.backgroundColor = '#fff'
		modalContent.style.padding = '20px'
		modalContent.style.fontFamily = 'Montserrat, sans-serif'
		modalContent.style.fontSize = '24px'
		modalContent.style.borderRadius = '5px'
		modalContent.style.textAlign = 'center'

		modalContent.innerHTML =
			'Welcome to <b>YouTube Snowflakes</b>! This is one time message. <br/>For control instructions, visit: <a href="https://github.com/KrzysztofJaronczyk/YouTube-SnowFlakes/blob/main/README.md" target="_blank">this link</a>.<br><br><button onclick="closeModal()">Close</button>'

		modal.appendChild(modalContent)

		document.body.appendChild(modal)

		window.closeModal = function () {
			modal.style.display = 'none'
			localStorage.setItem('scriptWelcomeShown6', 'true')
			isEnabled = true
		}
	}
})()
