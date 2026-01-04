// ==UserScript==
// @name         MooMoo.io Change Resolution
// @description  Change the resolution of canvas to boost your FPS
// @author       WEIRD
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.1.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/462998/MooMooio%20Change%20Resolution.user.js
// @updateURL https://update.greasyfork.org/scripts/462998/MooMooio%20Change%20Resolution.meta.js
// ==/UserScript==

;(() => {
	unsafeWindow.changeResolution = true

	const checkTrustedSymbol = Symbol("checkTrusted")
	Object.defineProperty(Object.prototype, "checkTrusted", {
		get() {
			return this[checkTrustedSymbol]
		},
		set() {
			delete Object.prototype.checkTrusted
			this.checkTrusted = (e) => e
		},
		configurable: true
	})

	var resolutionValue = localStorage.getItem("resolutionValue")
	if (resolutionValue == null) {
		resolutionValue = 0.9
		localStorage.setItem("resolutionValue", resolutionValue)
	}

	unsafeWindow.addEventListener("DOMContentLoaded", () => {
		const parent =
			document.getElementsByClassName("settingRadio")[0]
		parent.childNodes[1].textContent = " Change Resolution"
		unsafeWindow.devicePixelRatio = resolutionValue
		document.getElementById("nativeResolution").dispatchEvent(
			new Event("change")
		)

		const container = document.createElement("div")
		container.className = "settingRadio"
		const numInput = document.createElement("input")
		numInput.type = "number"
		numInput.step = "0.1"
		numInput.min = "0.1"
		numInput.max = "3"
		numInput.value = resolutionValue
		numInput.addEventListener("change", (event) => {
            if (event.target.value < event.target.min) {
                event.target.value = event.target.min
            } else if (event.target.value > event.target.max) {
                event.target.value = event.target.max
            } else if (event.target.value == null) {
                event.target.value = 0.9
            }
			resolutionValue = unsafeWindow.devicePixelRatio = event.target.value
			localStorage.setItem("resolutionValue", resolutionValue)
			document.getElementById(
				"nativeResolution"
			).dispatchEvent(new Event("change"))
		})
		container.appendChild(numInput)
		parent.parentNode.insertBefore(container, parent.nextSibling)
	})
})()
