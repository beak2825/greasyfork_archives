// ==UserScript==
// @name Skin Changer After Patch
// @namespace Fantasy
// @grant none
// @description A skin changer for the web game agario
// @version 1.1.0
// @match agar.io
// @downloadURL https://update.greasyfork.org/scripts/24853/Skin%20Changer%20After%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/24853/Skin%20Changer%20After%20Patch.meta.js
// ==/UserScript==
/////////////////////////*Options*///////////////////////// 
var skinChanger = true; /* Turn Changer on or off */////
var switchTime = 0; /*Time between skin switch change*/
//////////////////////////////////////////////////////

if (switchTime === 0) { // Restrict 0 for less lag
   switchTime = 1
}

if (skinChanger === true) { // Start skin change process
			Array.prototype.random = function() {
				return this[Math.floor((Math.random() *
					this.length))];
			}
			skins = ['alien1', 'alien2',
				'alien3', 'apple', 'appleface',
				'aprilfool', 'army', 'astronaut',
				'badger', 'blackhole', 'dragon',
				'grey', 'nuclear', 'cia',
			]

// Loop 
			var loop = setInterval(function() {
                // Set nickname and spawn
				MC.setNick(skins.random()); 
// Load skins

				core.registerSkin('alien1', null,
					'http://agarfantasy.esy.es/skins/Alien2_Gamma.png',
					1, null);

				core.registerSkin('alien2', null,
					'http://agarfantasy.esy.es/skins/Alien2_Neila.png',
					1, null);

				core.registerSkin('alien3', null,
					'http://agarfantasy.esy.es/skins/Alien2_Omicron.png',
					1, null);

				core.registerSkin('apple', null,
					'http://agarfantasy.esy.es/skins/Apple.png',
					1, null);

				core.registerSkin('appleface',
					null,
					'http://agarfantasy.esy.es/skins/Apple_Face.png',
					1, null);

				core.registerSkin('aprilfool',
					null,
					'http://agarfantasy.esy.es/skins/AprilFool.png',
					1, null);

				core.registerSkin('army', null,
					'http://agarfantasy.esy.es/skins/Army.png',
					1, null);

				core.registerSkin('astronaut',
					null,
					'http://agarfantasy.esy.es/skins/Astronaut.png',
					1, null);
				core.registerSkin('badger', null,
					'http://agarfantasy.esy.es/skins/Autumn_Badger.png',
					1, null);
				core.registerSkin('bannana', null,
					'http://agarfantasy.esy.es/skins/Banana.png',
					1, null);
				core.registerSkin('blackhole',
					null,
					'http://agarfantasy.esy.es/skins/Blackhole.png',
					1, null);
				core.registerSkin('dragon', null,
					'http://agarfantasy.esy.es/skins/Dragon.png',
					1, null);
				core.registerSkin('grey', null,
					'http://agarfantasy.esy.es/skins/Grey.png',
					1, null);
				core.registerSkin('nuclear', null,
					'http://agarfantasy.esy.es/skins/Nuclear.png',
					1, null);
				core.registerSkin('cia', null,
					'http://agarfantasy.esy.es/skins/birthday_cia.png',
					1, null);
				core.registerSkin('doge', null,
					'http://agarfantasy.esy.es/skins/birthday_doge.png',
					1, null);
			}, switchTime * 1000) // Get switchTime multiply by 1000
}	
