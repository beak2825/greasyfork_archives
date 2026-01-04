// ==UserScript==
// @name     Disable Youtube Annotations
// @version  1
// @match    https://www.youtube.com/*
// @description Automatically disable annotations on youtube every second. Annotations may still be manually enabled, but that only lasts for that tab/ until page reload.
// @namespace https://greasyfork.org/users/396494
// @downloadURL https://update.greasyfork.org/scripts/392194/Disable%20Youtube%20Annotations.user.js
// @updateURL https://update.greasyfork.org/scripts/392194/Disable%20Youtube%20Annotations.meta.js
// ==/UserScript==

var settingsButton
var annotations
var disableAnnotations
var syntheticClick

setInterval(() => {
    if (settingsButton) {
        return
    }
	settingsButton = document.getElementsByClassName('ytp-settings-button')[0]
    if (!settingsButton) {
        return
    }
    settingsButton.click()
    settingsButton.click()

    annotations = document.getElementsByClassName('ytp-menuitem')[1]
    disableAnnotations = true
    syntheticClick = false

    annotations.onclick = () => {
        if (syntheticClick) {
            syntheticClick = false
            return
        }
        disableAnnotations ^= true
    }
}, 1000)

setInterval(() => {
	if (disableAnnotations && annotations.getAttribute('aria-checked') === 'true') {
		syntheticClick = true
		annotations.click()
	}
}, 1000)