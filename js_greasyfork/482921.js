// ==UserScript==
// @name         IdlePixel+ Clammy Vock
// @namespace    lbtechnology.info
// @version      1.0.1
// @description  Replaces the word Clammy with a randomly generated name when sending chat messages.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/482921/IdlePixel%2B%20Clammy%20Vock.user.js
// @updateURL https://update.greasyfork.org/scripts/482921/IdlePixel%2B%20Clammy%20Vock.meta.js
// ==/UserScript==

(function() {
	'use strict';

	class ClammyPlugin extends IdlePixelPlusPlugin {
		constructor() {
			super("clammy", {
				about: {
					name: GM_info.script.name,
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description
				}
			});
			this.previous = "";
		}

		onLogin() {
			this.firstNames = ["Cabin", "Cable", "Calendar", "Camera", "Cancel", "Candle", "Canvas", "Captain", "Capture", "Carbon", "Carpeted", "Carriage", "Carrot", "Cinema", "Circular", "Citizen", "Compacted", "Company", "Complete", "Compound", "Computer", "Comprehensive", "Concept", "Concrete", "Conductor", "Confined", "Conflict", "Copper", "Costume", "Cottage", "Cotton", "Council", "Counter", "Country", "Couple", "Courtesy", "Curtsy", "Coverage", "Cassette", "Castle", "Casualty", "Category", "Cathederal", "Cemetery", "Censorship", "Century", "Cereal", "Ceremony", "Champion", "Character", "Ceiling", "Charity", "Climate", "Coincide", "Collapsed", "Collected", "Colourful", "Combination", "Comedic", "Comfortable", "Confused", "Constructed", "Constitutional", "Contradictory", "Crosswalk", "Chauvinist", "Cylidrical", "Covfefe", "Caustic"]
			this.lastNames = ["Block", "Caulk", "Chalk", "Croc", "Dock", "Frock", "Gawk", "Hawk", "Jock", "Lock", "Mock", "Schlock", "Sock", "Stock", "Stonk", "Wok", "Vock", "Tock", "Knock"]
			
			$("#game-chat .m-2 .m-2 button:not(.btn-chat-configure)").attr("onClick", "IdlePixelPlus.plugins.clammy.sendChat()")
		}
	
		choose(inArray){
			return inArray[Math.floor((Math.random()*inArray.length))];
		}
	
		sendChat(){
			const fullName = `${this.choose(this.firstNames)} ${this.choose(this.lastNames)}`
			
			document.getElementById("chat-area-input").value = document.getElementById("chat-area-input").value.replace("Clammy", fullName).replace("clammy", fullName);
			Chat.send()
		}
	}

	const plugin = new ClammyPlugin();
	IdlePixelPlus.registerPlugin(plugin);

})();
