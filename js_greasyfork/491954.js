// ==UserScript==
// @name         IdlePixel Smitty Fight
// @version      1.0.0
// @description  Adds Smitty as a boss
// @author       Dounford
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @require      https://update.greasyfork.org/scripts/491625/1356376/Pixel%20Combat%2B.js
// @namespace https://greasyfork.org/users/1175326
// @downloadURL https://update.greasyfork.org/scripts/491954/IdlePixel%20Smitty%20Fight.user.js
// @updateURL https://update.greasyfork.org/scripts/491954/IdlePixel%20Smitty%20Fight.meta.js
// ==/UserScript==
(function() {
    'use strict';

	let bloodSmitty = {
		name: "Smitty, The Dark Emperor of Virtuality",
		image:"https://static.wikia.nocookie.net/diamondhunt3/images/6/6e/BloodSmitty.png",
		hp:500,
		maxHp:500,
		accuracy:-1,
		damage:500,
		speed:4,
		defence:0,
		multiPhase: false,
		nextPhase:'',
		arrowImunity:true,
		magicImunity:false,
		needsLight:true,
		defender: true,
		weakToFire:true,
		weakToIce:false,
		ghost: false,
		fish: false,
		lootTable: [
			{item:'Congratulations! You defeated Smitty at his own game.',
			image:'https://d1xsc8x7nc5q8t.cloudfront.net/images/skeleton_shield.png',
			min:0,
			max:0,
			chance:1}
		],
		lootFunction: function(){},
		winFunction: "",
		abilities: [
			{type: 'damage', limit: -1, chance: 1, cooldown: 1, min:1,max:1, cd:5},
			{type: 'invisibility', limit: -1, chance: 1, min:3, max: 3, cooldown: 21, cd:21},
			{type: 'damageHeal', limit: -1, chance: 0.5, cooldown: 15, min:5,max:15, cd:8},
			{type: 'chargeDamage', limit: -1, chance: 1, cooldown: 50, min:33,max:33, cd:50}
		]
	};
	let smitty = {
		name:'Smitty, The DH Guy',
		image:"https://static.wikia.nocookie.net/diamondhunt3/images/e/e5/SmittyFaceReveal.png.jpg",
		hp:300,
		maxHp:300,
		accuracy:35,
		damage:5,
		speed:1,
		defence:0,
		multiPhase: true,
		nextPhase: bloodSmitty,
		arrowImunity: false,
		magicImunity: true,
		needsLight: true,
		defender: false,
		weakToFire: false,
		weakToIce: true,
		ghost: false,
		fish: false,
		lootTable: "",
		lootFunction: "",
		winFunction: "",
		abilities: [
			{type: 'kamikaze', chance: 1, cd: 300},
			{type: 'reflect', limit: 1, chance: 1, cd:15}
		]
	}

    class SmittyBossPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("smittyBoss", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
        }
		
		onLogin() {
			let fButton = `<div id="startFightButton" class="hover hover-menu-bar-item left-menu-item">
			<table class="game-menu-bar-left-table-btn left-menu-item-other" style="width: 100%;">
				<tbody>
					<tr>
						<td style="width: 30px;"><img id="menu-bar-idlepixelplus-icon" src= "https://d1xsc8x7nc5q8t.cloudfront.net/images/skeleton_sword.png" class="w20"></td>
						<td>FIGHT SMITTY</td>
					</tr>
				</tbody>
			</table>
		</div>`;
		document.getElementById('menu-bar-buttons').insertAdjacentHTML('beforeend', fButton);
		document.getElementById('startFightButton').addEventListener("click", function(){PixelCombatPlus.startFight(smitty)});
        }
	}
	
    const plugin = new SmittyBossPlugin();
    IdlePixelPlus.registerPlugin(plugin);
})();