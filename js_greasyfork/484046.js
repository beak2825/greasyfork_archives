// ==UserScript==
// @name         IdlePixel+ Custom Handling
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Library for parsing custom messages.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// ==/UserScript==

(function() {
	if(window.Customs) {
		// already loaded
		return;
	}

	class Customs {
		sendBasicCustom(recipient, pluginValue, command, data){
			const content = `${pluginValue}:${command}:${data}`

			const payload = {
				content: content,
				onResponse: function(player, content, callbackId) {
					return true;
					},
				onOffline: function(player, content) {
					console.log(content)
				},
				timeout: 2000 // callback expires after 2 seconds
			}

			IdlePixelPlus.sendCustomMessage(recipient, payload)
		}
	
		parseCustom(player, content, callbackId){
			const customData = {
				player: player,
				callbackId: callbackId,
				anwinFormatted: false
			}
			const splitPayload = content.split(":")
			if(splitPayload.length >= 3){
				customData.anwinFormatted = true
				customData.plugin = splitPayload[0]
				customData.command = splitPayload[1]
				customData.payload = splitPayload.slice(2).join(":")
			} else {
				customData.anwinFormatted = false
				customData.plugin = "unknown"
				customData.command = "unknown"
				customData.payload = content
			}

			return customData
		}
	}

	// Add to window and init
	window.Customs = new Customs();

})();