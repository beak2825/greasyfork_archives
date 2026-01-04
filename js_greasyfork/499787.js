// ==UserScript==
// @name         IdlePixel Slap Chop Select Monster Addon
// @version      1.1.0
// @description  Slap Chop select monster addon
// @author       Dounford
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @namespace https://greasyfork.org/users/1175326
// @downloadURL https://update.greasyfork.org/scripts/499787/IdlePixel%20Slap%20Chop%20Select%20Monster%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/499787/IdlePixel%20Slap%20Chop%20Select%20Monster%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';
	

    class SelectMonsterPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("selectMonster", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
        }

        onLogin() {
            IdlePixelPlus.plugins.selectMonster.tryInit();
        }
		

		init() {
			Object.values(IdlePixelPlus.info.combatZones).forEach((zone) => {
				document.querySelector(`#slapchop-quickfight-${zone.id} button`).setAttribute('onclick',`Globals.last_area_fight='${zone.id}';sCCombat().quickFight('${zone.id}')`)
			})
			console.log('Slap Chop Addon initiated')
		}

		tryInit() {
			if (document.getElementById('slapchop-quickfight')) {
				IdlePixelPlus.plugins.selectMonster.init();
			} else {
				setTimeout(function(){IdlePixelPlus.plugins.selectMonster.tryInit()},5000)
				console.log('Slap Chop not found')
			}
		}
		
    }

    const plugin = new SelectMonsterPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();