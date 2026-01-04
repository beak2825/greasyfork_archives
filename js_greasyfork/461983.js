// ==UserScript==
// @name         MooMoo.io Click Through Store
// @description  Click Through Store
// @author       KOOKY WARRIOR
// @icon         https://moomoo.io/img/favicon.png?v=1
// @match        *://*.moomoo.io/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      0.5
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/461983/MooMooio%20Click%20Through%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/461983/MooMooio%20Click%20Through%20Store.meta.js
// ==/UserScript==

;(() => {
	unsafeWindow.clickThroughStore = true

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

	unsafeWindow.addEventListener("DOMContentLoaded", () => {
		unsafeWindow.addEventListener("contextmenu", (e) => e.preventDefault())

		unsafeWindow.addEventListener("mousedown", (event) => {
			if (
				event.target?.className == "storeItem" ||
				(event.target?.className != "joinAlBtn" &&
					event.target?.parentElement?.className == "storeItem")
			) {
				document.getElementById("touch-controls-fullscreen").dispatchEvent(
					new MouseEvent("mousedown", {
						button: event.button
					})
				)
			}
		})

		unsafeWindow.addEventListener("mouseup", (event) => {
			if (
				event.target?.className == "storeItem" ||
				event.target?.parentElement?.className == "storeItem"
			) {
				document.getElementById("touch-controls-fullscreen").dispatchEvent(
					new MouseEvent("mouseup", {
						button: event.button
					})
				)
			}
		})

		unsafeWindow.addEventListener("mousemove", (event) => {
			document.getElementById("touch-controls-fullscreen").dispatchEvent(
				new MouseEvent("mousemove", {
					clientX: event.clientX,
					clientY: event.clientY
				})
			)
		})
	})
})()
