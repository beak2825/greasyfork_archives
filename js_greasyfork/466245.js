// ==UserScript==
// @name         MooMoo.io Show FPS
// @description  Display FPS
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.4
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/466245/MooMooio%20Show%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/466245/MooMooio%20Show%20FPS.meta.js
// ==/UserScript==

;(() => {
	unsafeWindow.showFPS = true

	let pingDisplay = null
	const fps = document.createElement("div")
	unsafeWindow.addEventListener("DOMContentLoaded", () => {
		const style = document.createElement("style")
		style.innerHTML = `
		#pingAndFPSContainer {
			position: absolute;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			color: white;
		}
		#pingDisplay {
			position: initial !important;
			transform: none !important;
			margin-right: 10px;
		}`
		document.head.appendChild(style)

		pingDisplay = document.getElementById("pingDisplay")

		const container = document.createElement("div")
		container.id = "pingAndFPSContainer"
		container.appendChild(pingDisplay)

		fps.id = "fps"
		container.appendChild(fps)
		document.body.appendChild(container)
	})

	function update() {
		const updateDelay = 500
		let lastFpsUpdate = 0
		let frames = 0
		function updateFPS() {
			let now = Date.now()
			let elapsed = now - lastFpsUpdate
			if (elapsed < updateDelay) {
				++frames
			} else {
				fps.innerText = `Fps: ${Math.round(frames / (elapsed / 1000))}`
				frames = 0
				lastFpsUpdate = now
			}
			unsafeWindow.requestAnimationFrame(updateFPS)
		}
		lastFpsUpdate = Date.now()
		unsafeWindow.requestAnimationFrame(updateFPS)
	}
	update()
})()
