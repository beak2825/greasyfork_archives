// ==UserScript==
// @name         Pixel Combat+
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Makes it easier to create new custom enemies for Idle Pixel
// @author       Dounford
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// ==/UserScript==

//Default Enemy
let defaultEnemy = {
	name:'Black Cat',
	image:"https://raw.githubusercontent.com/Dounford-Felipe/DHP-Pets/main/images/whiteCatMonster.png",
	hp:100,
	maxHp:100,
	accuracy:3,
	damage:2,
	speed:3,
	defence:5,
	multiPhase: false,
	nextPhase:'',
	arrowImunity:false,
	magicImunity:false,
	needsLight:false,
	weakToFire:false,
	weakToIce:false,
	poisoned: false,
	ghost: false,
	fish: false,
	defender: false,
	lootTable:"",
	lootFunction: "",
	winFunction: "",
	abilities:[]
};
/*abilities: [
	{type: 'heal', limit: -1, chance: 1, cooldown: 3, min:5,max:20, cd:10},
	{type: 'poison', chance: 1, poison:5, cd:5},
	{type: 'damage', limit: -1, chance: 0.25, cooldown: 3, min:5,max:20, cd:3},
	{type: 'kamikaze', chance: 1, cd: 120},
	{type: 'invisibility', limit: -1, chance: 1, cooldown: 30, cd:30},
	{type: 'reflect', limit: -1, chance: 1, cooldown: 15, cd:15}
]*/
//[{item:'',image:'',min:1,max:10,chance:'1/x'}]
//Ranged Weapons
const ranged = ['wooden_bow','long_bow','haunted_bow','balista'];
if (!document.getElementById('panel-customCombat')) {
(function PixelCombatPlus() {
    'use strict';
	const PixelCombatPlus = {
		initialize: function () {
			PixelCombatPlus.newFightPanel();
			PixelCombatPlus.newModals();
			if (IdlePixelPlus) {
				IdlePixelPlus.panels.customCombat = {id:'customCombat',title:'',content:''}
			} else {
				const og_switch_panels = window.switch_panels;
				window.switch_panels = function(id) {
					document.getElementById('panel-customCombat').style.display = "none";
					og_switch_panels.apply(this, arguments);
				}
			}
        },
		//Fighting toggle
		fight: false,
		//Hitsplat Maps
		hitSplatHero: {},
		hitSplatEnemy: {},
		//Timer until fight starts
		startsIn:0,
		//Interval called each second
		ticking:0,
		ticks: 0,
		//Enemy Stats
		enemy: {
			name:'Test',
			image:"",
			hp:10,
			maxHp:10,
			accuracy:3,
			damage:2,
			speed:3,
			defence:5,
			multiPhase: false,
			nextPhase:'',
			arrowImunity:false,
			magicImunity:false,
			needsLight:false,
			weakToFire:false,
			weakToIce:false,
			poisoned: false,
			ghost: false,
			fish: false,
			defender: false,
			lootTable: "",
			lootFunction: "",
			winFunction: "",
		},
		//Hero Stats
		hero: {
			hp:0,
			mana:0,
			revive:0,
			isReflecting:false,
			poisoned: false
		},
		//Spells Cooldown
		healCooldown: 0,
		fireCooldown: 0,
		reflectCooldown: 0,
		invisibilityCooldown: 0,
		heroIsInvisible: 0,
		enemyIsInvisible: 0,
		enemyIsCharging: 0,
		
		testFight: function() {
			PixelCombatPlus.startFight(defaultEnemy)
		},
		
		newModals: function() {
			let lootDiv = `<div style="width: 100%; height: 100%; position: absolute;top:0px; display: none;" id="customCombatModalParent">
				<div style="background-color: black;opacity: 0.7;width: 100%;height: 100%;position: absolute;" onclick="document.getElementById('customCombatModalParent').style.display='none'"></div>
				<div class="modal-content" id="customCombatModal" style="z-index: 11;position: sticky;right: 0px;left: 0px;margin-right: auto;margin-left: auto;width: 35%;border-radius: 5px;top: 100px;">
					<div class="modal-header">
						<h5 class="modal-title text-secondary">LOOT</h5>
						<button type="button" class="btn-close" onclick="document.getElementById('customCombatModalParent').style.display = 'none'"></button>
					</div>
					<div class="modal-body">
						<div id="modal-custom-loot-body">
						</div>
					</div>
					<div class="modal-footer">
						<button onclick="document.getElementById('customCombatModalParent').style.display = 'none'" id="modal-custom-loot-collect-button" class="background-primary"><span class="font-pixel hover">Collect Loot</span></button>
					</div>
				</div>
			</div>`
			document.getElementById('content').insertAdjacentHTML('beforeend', lootDiv);
		},
		
		//Adds the new combat scene
		newFightPanel: function () {
			let customCombatTab = `<div id="panel-customCombat" style="display:none">
				<button onclick="switch_panels('panel-combat')">BACK</button>
				<center>
					<table>
						<tbody>
							<tr>
								<td class="fight-right-border">
								</td>
								<td style="padding-top:20px;" class="canvas-fighting-td fight-top-border">
									<center>
										<span class="hp-progress-bar">
											<span id="custom-hero-progress-bar-hp" class="hp-progress-bar-inner" style="width: 100%;"></span>
											<div class="progress-bar-label">
												<span id="custom_combat_hp">0/0</span>
											</div>
										</span>
										<br>
										<span class="mana-progress-bar">
											<span id="custom-hero-progress-bar-mana" class="mana-progress-bar-inner" style="width: 100%;"></span>
											<div class="progress-bar-label color-cyan">
												<span id="custom_combat_mana">0/0</span>
											</div>
										</span>
									</center>
								</td>
								<td style="padding-bottom:20px;" class="canvas-fighting-td fight-top-border">
									<center>
										<span class="hp-progress-bar">
											<span id="custom-monster-progress-bar-hp" class="hp-progress-bar-inner" style="width: 100%;"></span>
											<div class="progress-bar-label">
												<span id="custom_combat_monster_hp">0/0</span>
											</div>
										</span>
										<br>
									</center>
								</td>
								<td class="fight-left-border">
								</td>
							</tr>
							<tr>
								<td style="vertical-align:top;" class="fight-right-border">
									<div class="fighting-hero-stats-area hover shadow" style="border-right:none;">
										<span id="custom-fighting-hero-label">Player</span>
									</div>
									<div class="td-combat-bottom-panel shadow">
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/accuracy_white.png" title="accuracy_white"> 
											<span style="color:white">Accuracy:</span>
											<span id="custom_combat_hero_accuracy">0</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/melee_damage_white.png" title="melee_damage_white"> 
											<span style="color:white">Damage:</span>
											<span id="custom_combat_hero_melee_damage">0</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/arrow_damage_white.png" title="arrow_damage_white"> 
											<span style="color:white">Damage:</span>
											<span id="custom_combat_hero_arrow_damage">0</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/magic_damage_white.png" title="magic_damage_white"> 
											<span style="color:white">Magic:</span>
											<span id="custom_combat_hero_magic_bonus">0</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/speed_white.png" title="speed_white"> 
											<span style="color:white">Speed:</span>
											<span id="custom_combat_hero_speed">0</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/defence_white.png" title="defence_white"> 
											<span style="color:white">Defence:</span>
											<span id="custom_combat_hero_defence">0</span>
										</div>
									</div>
									<div style="" id="custom-fighting-spell-heal" onclick="PixelCombatPlus.spell('heal')" class="fighting-spell-area-heal hover shadow">
										<img id="custom-image-heal_spell_icon" src="https://idlepixel.s3.us-east-2.amazonaws.com/images/heal_spell_icon.png" title="heal_spell_icon">
										<span id="custom-fighting-spell-label-heal" style="color: white;">Heal <span class="color-grey" style="color: rgb(128, 128, 128);">(Q)</span></span>
									</div>
									<div style="" id="custom-fighting-spell-fire" onclick="PixelCombatPlus.spell('fire')" class="fighting-spell-area-fire hover shadow">
										<img id="custom-image-fire_spell_icon" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/fire_spell_icon.png" title="fire_spell_icon" class="">
										<span id="custom-fighting-spell-label-fire" style="color: white;">Fire <span class="color-grey" style="color: rgb(128, 128, 128);">(E)</span></span>
									</div>
									<div style="" id="custom-fighting-spell-reflect" onclick="PixelCombatPlus.spell('reflect')" class="fighting-spell-area-fire hover shadow">
										<img id="custom-image-reflect_spell_icon" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/reflect_spell_icon.png" title="reflect_spell_icon" class="">
										<span id="custom-fighting-spell-label-reflect" style="color: white;">Reflect <span class="color-grey" style="color: rgb(128, 128, 128);">(E)</span></span>
									</div>
									<div style="" id="custom-fighting-spell-invisibility" onclick="PixelCombatPlus.spell('invisibility')" class="fighting-spell-area-invisibility hover shadow">
										<img id="custom-image-invisibility_spell_icon" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/invisibility_spell_icon.png" title="invisibility_spell_icon" class="">
										<span id="custom-fighting-spell-label-invisibility" style="color: white;">Invisibility <span class="color-grey" style="color: rgb(128, 128, 128);">(R)</span></span>
									</div>
								</td>
								<td class="canvas-fighting-td fight-bottom-border">
									<div style="display: none;" class="fighting-countdown">FIGHT IN <span id="custom-fighting-countdown">5</span></div>
									<canvas class="canvas-fighting" style="margin-left:100px;margin-right:100px" id="custom-combat-canvas-hero" width="300px" height="600px" original-width="300px" original-height="600px">
									</canvas>
								</td>
								<td class="canvas-fighting-td fight-bottom-border">
									<canvas class="canvas-fighting" id="custom-combat-canvas-monster" width="500px" height="600px" original-width="500px" original-height="600px" style="">
									</canvas>
								</td>
								<td style="vertical-align:top;" class="fight-left-border">
									<div class="fighting-monster-stats-area hover shadow">
										<span id="custom-fighting-monster-label">Enemy Name</span>
									</div>
									<div class="td-combat-bottom-panel shadow" style="border-left:none;">
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/accuracy_white.png" title="accuracy_white"> 
											<span style="color:white">Accuracy:</span>
											<span id="custom_combat_monster_accuracy">0</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/melee_damage_white.png" title="melee_damage_white"> 
											<span style="color:white">Damage:</span>
											<span id="custom_combat_monster_attack">0</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/speed_white.png" title="speed_white"> 
											<span style="color:white">Speed:</span>
											<span id="custom_combat_monster_speed">3</span>
										</div>
										<div class="td-combat-stat-entry">
											<img class="img-15" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/defence_white.png" title="defence_white"> 
											<span style="color:white">Defence:</span>
											<span id="custom_combat_monster_defence">0</span>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td></td>
								<td>
									<center>
										<!-- presets -->
										<div id="custom-combat-presets-area" style="" class="combat-presets-area shadow center">
											<img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/combat_presets.png" class="w20" title="combat_presets"> <u class="color-silver">Presets</u><br><br>
											<img data-tooltip="combat-preset-1" id="custom-in-combat-presets-icon-1" onclick="websocket.send('PRESET_LOAD=1~1')" class="combat-presets-combat-icon hover w30" src="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="" data-bs-original-title="<span class='color-primary'>PRESETS</span><br /><br />Press 1 to quickload." aria-label="<span class='color-primary'>PRESETS</span><br /><br />Press 1 to quickload." style="background-color: rgb(219, 255, 220);">
											<img data-tooltip="combat-preset-2" id="custom-in-combat-presets-icon-2" onclick="websocket.send('PRESET_LOAD=2~1')" class="combat-presets-combat-icon hover w30" src="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="" data-bs-original-title="<span class='color-primary'>PRESETS</span><br /><br />Press 2 to quickload." aria-label="<span class='color-primary'>PRESETS</span><br /><br />Press 2 to quickload." style="background-color: rgb(117, 126, 255);">
											<img data-tooltip="combat-preset-3" id="custom-in-combat-presets-icon-3" onclick="websocket.send('PRESET_LOAD=3~1')" class="combat-presets-combat-icon hover w30" src="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="" data-bs-original-title="<span class='color-primary'>PRESETS</span><br /><br />Press 3 to quickload." aria-label="<span class='color-primary'>PRESETS</span><br /><br />Press 3 to quickload." style="background-color: rgb(219, 255, 220);">
											<img data-tooltip="combat-preset-4" id="custom-in-combat-presets-icon-4" onclick="websocket.send('PRESET_LOAD=4~1')" class="combat-presets-combat-icon hover w30" src="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="" data-bs-original-title="<span class='color-primary'>PRESETS</span><br /><br />Press 4 to quickload." aria-label="<span class='color-primary'>PRESETS</span><br /><br />Press 4 to quickload." style="background-color: rgb(255, 87, 87);">
											<img data-tooltip="combat-preset-5" id="custom-in-combat-presets-icon-5" onclick="websocket.send('PRESET_LOAD=5~1')" class="combat-presets-combat-icon hover w30" src="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="" data-bs-original-title="<span class='color-primary'>PRESETS</span><br /><br />Press 5 to quickload." aria-label="<span class='color-primary'>PRESETS</span><br /><br />Press 5 to quickload." style="background-color: rgb(219, 255, 220);">
										</div>
									</center>
									<!-- end presets -->
								</td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</center>
			</div>`
			document.getElementById('panels').insertAdjacentHTML('beforeend', customCombatTab);
			let combatNot = `<div id="notification-custom-combat" style="display: none;" onclick="switch_panels('panel-customCombat');document.getElementById('menu-bar').style.display = 'none';" class="notification hover">
			  <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/fight.png" class="w20" title="fight"> 
			  <span style="color:red">IN COMBAT!</span>
			  <span style="color:grey">(Click to resume)</span>
			  <span class="color-white" id="notification-combat"></span>
			</div>`
			document.getElementById('notification-combat').insertAdjacentHTML('afterend', combatNot);
			PixelCombatPlus.heroCanvas = document.getElementById("custom-combat-canvas-hero");
			PixelCombatPlus.heroContext = document.getElementById("custom-combat-canvas-hero").getContext("2d");
			PixelCombatPlus.enemyCanvas = document.getElementById("custom-combat-canvas-monster");
			PixelCombatPlus.enemyContext = document.getElementById("custom-combat-canvas-monster").getContext("2d");
			PixelCombatPlus.enemyImage = new Image();
			document.addEventListener('keydown', function(e) {
				const chatInput = document.getElementById('chat-area-input');
				const customCombatPanel = document.getElementById('panel-customCombat');
				if (!chatInput.matches(':focus') && customCombatPanel.style.display !== "none") {
					switch (e.keyCode) {
						//Presets
						case 49: websocket.send('PRESET_LOAD=1~1'); break;
						case 50: websocket.send('PRESET_LOAD=2~1'); break;
						case 51: websocket.send('PRESET_LOAD=3~1'); break;
						case 52: websocket.send('PRESET_LOAD=4~1'); break;
						case 53: websocket.send('PRESET_LOAD=5~1'); break;
						//Spells
						case 81: PixelCombatPlus.spell('heal'); break;
						case 87: PixelCombatPlus.spell('fire'); break;
						case 69: PixelCombatPlus.spell('reflect'); break;
						case 82: PixelCombatPlus.spell('invisibility'); break;
					}
				}
			});
		},
		
		//Refresh the presets on the custom combat
		refreshPresetIcons: function()  {
			for(let i = 1; i < 6 ; i++)	{
				document.getElementById("custom-in-combat-presets-icon-" + i).src = get_image("images/" + Items.getItem("combat_preset_icon_" + i));
				document.getElementById("custom-in-combat-presets-icon-" + i).style.backgroundColor = Items.getItemString("combat_preset_color_" + i);
			}
		},
		
		//Cooldown function
		cooldown: function(variable,time,id,defaultText) {
			PixelCombatPlus[variable] = time;
			if (typeof id == 'string') {
				document.getElementById(id).innerHTML = time;
				document.getElementById(id).parentNode.style.display = "";
			};
			if (time > 0) {
				setTimeout(function(){
					PixelCombatPlus.cooldown(variable,time-1,id,defaultText);
				},1000)
			} else if (typeof defaultText == 'string') {
				if (defaultText == "hide") {
					document.getElementById(id).parentNode.style.display = "none";
				} else {
					document.getElementById(id).innerHTML = defaultText;
				}
			};
		},
		
		//Cooldown function
		cooldownAbility: function(index,time) {
			if (PixelCombatPlus.fight == false) {PixelCombatPlus.enemy.abilities = []};
			if (PixelCombatPlus.enemy.abilities[index] == undefined) {return};
			PixelCombatPlus.enemy.abilities[index].cd = time;
			if (time > 0) {
				setTimeout(function(){
					PixelCombatPlus.cooldownAbility(index,time-1);
				},1000)
			}
		},
		
		//Spell Casting Function
		spell: function(spellName) {
			if (PixelCombatPlus[spellName+'Cooldown'] == 0) {
				switch (spellName) {
					case "heal":
						if (PixelCombatPlus.hero.mana >= 2) {
							PixelCombatPlus.hero.mana -= 2;
							PixelCombatPlus.hero.hp += 3;
							PixelCombatPlus.hero.hp = Math.min(PixelCombatPlus.hero.hp,var_max_hp);
							PixelCombatPlus.updateStatsBars();
							PixelCombatPlus.addHitSplat("3", 'images/heal_spell.png', 'lime', 'rgba(0,255,0,0.4)', 'blue', 'Hero');
							PixelCombatPlus.cooldown('healCooldown',5,'custom-fighting-spell-label-heal','Heal <span class="color-grey" style="color: rgb(128, 128, 128);">(Q)</span>');
						}
					break;
					case "fire":
						if (PixelCombatPlus.hero.mana >= 3) {
							PixelCombatPlus.hero.mana -= 3;
							let fireDamage = Math.floor(Math.random() * 6) + parseInt(var_magic_bonus);
							if (PixelCombatPlus.enemy.weakToFire == true) {
								fireDamage *= 2
							};
							if (PixelCombatPlus.enemy.magicImunity == false) {
								PixelCombatPlus.enemy.hp -= fireDamage;
								PixelCombatPlus.addHitSplat(fireDamage, 'images/fire_icon.png', 'white', 'rgba(255,0,0,0.4)', 'blue', 'Enemy');
							} else {
								PixelCombatPlus.addHitSplat('IMMUNE', 'images/fire_icon.png', 'white', 'rgba(255,0,0,0.4)', 'blue', 'Enemy');
							};
							PixelCombatPlus.updateStatsBars();
							PixelCombatPlus.cooldown('fireCooldown',5,'custom-fighting-spell-label-fire','Fire <span class="color-grey" style="color: rgb(128, 128, 128);">(W)</span>');
						}
					break;
					case "reflect":
						if (PixelCombatPlus.hero.mana >= 1 && PixelCombatPlus.hero.isReflecting == false) {
							PixelCombatPlus.hero.mana -= 1;
							PixelCombatPlus.hero.isReflecting = true;
							PixelCombatPlus.updateStatsBars();
							PixelCombatPlus.cooldown('reflectCooldown',30,'custom-fighting-spell-label-reflect','Reflect <span class="color-grey" style="color: rgb(128, 128, 128);">(E)</span>');
						}
					break;
					case "invisibility":
						if (PixelCombatPlus.hero.mana >= 2) {
							PixelCombatPlus.hero.mana -= 2;
							PixelCombatPlus.updateStatsBars();
							PixelCombatPlus.cooldown('heroIsInvisible',4);
							PixelCombatPlus.cooldown('invisibilityCooldown',30,'custom-fighting-spell-label-invisibility','Invisibility <span class="color-grey" style="color: rgb(128, 128, 128);">(R)</span>');
						}
					break;
				};
			}
		},
		
		poison: function(receiver,poisonDamage) {
			PixelCombatPlus[receiver].hp -= poisonDamage;
			PixelCombatPlus.addHitSplat(poisonDamage, 'images/poison.png', 'green', 'rgba(255,0,0,0.4)', 'blue', receiver.charAt(0).toLocaleUpperCase() + receiver.slice(1));
			PixelCombatPlus.updateStatsBars();
			if (PixelCombatPlus.hero.hp > 0 && PixelCombatPlus.enemy.hp > 0) {setTimeout(function(){PixelCombatPlus.poison(receiver,poisonDamage)},4000)};
		},
		
		//Enemy Special Attack
		specialAttack: function() {
			if (typeof PixelCombatPlus.enemy.abilities == 'object') {
				PixelCombatPlus.enemy.abilities.forEach(function(ability,index) {
					if (ability.limit == 0 || ability.cd > 0) {
					  return;
					};
					const randomChance = Math.random();
					if (ability.chance > randomChance)  {
						switch (ability.type) {
							case 'heal':
								let healAmount = Math.floor(Math.random() * (ability.max - ability.min + 1) + ability.min)
								PixelCombatPlus.enemy.hp += healAmount;
								PixelCombatPlus.enemy.hp = Math.min(PixelCombatPlus.enemy.hp,PixelCombatPlus.enemy.maxHp);
								PixelCombatPlus.updateStatsBars();
								PixelCombatPlus.addHitSplat(healAmount, 'images/heal_spell.png', 'lime', 'rgba(0,255,0,0.4)', 'blue', 'Enemy');
							break;
							case 'poison':
								if (PixelCombatPlus.hero.poisoned == true) {return}
								PixelCombatPlus.hero.poisoned = true;
								const poisonDamage = ability.poison || 5
								PixelCombatPlus.poison('hero',poisonDamage)
							break;
							case 'damage':
								if (PixelCombatPlus.heroIsInvisible > 0) {
									PixelCombatPlus.addHitSplat("MISSED","images/ghost_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
								} else {
									let damageDone = Math.floor(Math.random() * (ability.max - ability.min + 1) + ability.min);
									if (PixelCombatPlus.hero.isReflecting == true && damageDone > 0) {
										PixelCombatPlus.enemy.hp -= damageDone;
										PixelCombatPlus.hero.isReflecting = false;
										PixelCombatPlus.addHitSplat(damageDone, "images/reflect_spell.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Enemy');
									} else {
										PixelCombatPlus.hero.hp -= damageDone;
										PixelCombatPlus.addHitSplat(damageDone,"images/sword_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
									}
									PixelCombatPlus.updateStatsBars();
								}
							break;
							case 'chargeDamage':
								if (PixelCombatPlus.enemyIsCharging > 0) {return};
								PixelCombatPlus.cooldown('enemyIsCharging',4);
								setTimeout(function() {
									if (PixelCombatPlus.heroIsInvisible > 0) {
										PixelCombatPlus.addHitSplat("MISSED","images/ghost_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
									} else {
										let damageDone = Math.floor(Math.random() * (ability.max - ability.min + 1) + ability.min);
										if (PixelCombatPlus.hero.isReflecting == true && damageDone > 0) {
											PixelCombatPlus.enemy.hp -= damageDone;
											PixelCombatPlus.hero.isReflecting = false;
											PixelCombatPlus.addHitSplat(damageDone, "images/reflect_spell.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Enemy');
										} else {
											PixelCombatPlus.hero.hp -= damageDone;
											PixelCombatPlus.addHitSplat(damageDone,"images/sword_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
										}
										PixelCombatPlus.updateStatsBars();
									}
								},4000);
							break;
							case 'lifeSteal':
								if (PixelCombatPlus.heroIsInvisible > 0) {
									PixelCombatPlus.addHitSplat("MISSED","images/ghost_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
								} else {
									let damageDone = Math.floor(Math.random() * (ability.max - ability.min + 1) + ability.min);
									if (PixelCombatPlus.hero.isReflecting == true && damageDone > 0) {
										PixelCombatPlus.enemy.hp -= damageDone;
										PixelCombatPlus.hero.isReflecting = false;
										PixelCombatPlus.addHitSplat(damageDone, "images/reflect_spell.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Enemy');
									} else {
										PixelCombatPlus.hero.hp -= damageDone;
										PixelCombatPlus.enemy.hp += damageDone;
										PixelCombatPlus.enemy.hp = Math.min(PixelCombatPlus.enemy.hp,PixelCombatPlus.enemy.maxHp);
										PixelCombatPlus.addHitSplat(damageDone,"images/sword_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
										PixelCombatPlus.addHitSplat(damageDone, 'images/heal_spell.png', 'lime', 'rgba(0,255,0,0.4)', 'blue', 'Enemy');
									}
									PixelCombatPlus.updateStatsBars();
								};
							break;
							case 'kamikaze':
								PixelCombatPlus.hero.hp = 0;
								PixelCombatPlus.endFight();
							break;
							case "invisibility":
								if (PixelCombatPlus.enemyIsInvisible > 0) {return}
								let invisibleTime = Math.floor(Math.random() * (ability.max - ability.min + 1) + ability.min);
								PixelCombatPlus.cooldown('enemyIsInvisible',invisibleTime);
							break;
							case "reflect":
								if (PixelCombatPlus.enemy.isReflecting == true) {return};
								PixelCombatPlus.enemy.isReflecting = true;
							break;
							case "fullRestorePlayer":
								PixelCombatPlus.hero.hp = var_max_hp; //Set the current hero hp to max
								PixelCombatPlus.hero.mana = var_max_mana; //Set the current hero mana to max
								PixelCombatPlus.updateStatsBars();
							break;
							case "restorePlayerHP":
								let healAmounts = Math.floor(Math.random() * (ability.max - ability.min + 1) + ability.min)
								PixelCombatPlus.hero.hp += healAmounts;
								PixelCombatPlus.hero.hp = Math.min(PixelCombatPlus.hero.hp,var_max_hp);
								PixelCombatPlus.updateStatsBars();
								PixelCombatPlus.addHitSplat(healAmounts, 'images/heal_spell.png', 'lime', 'rgba(0,255,0,0.4)', 'blue', 'Hero');
							break;
							case "restorePlayerMana":
								let manaAmount = Math.floor(Math.random() * (ability.max - ability.min + 1) + ability.min)
								PixelCombatPlus.hero.mana += manaAmount;
								PixelCombatPlus.hero.mana = Math.min(PixelCombatPlus.hero.mana,var_max_mana);
								PixelCombatPlus.updateStatsBars();
							break;
						};
						if (ability.limit != -1) {
							ability.limit--;
						};
						if (ability.cooldown > 0) {
							PixelCombatPlus.cooldownAbility(index,ability.cooldown)
						};
					};
				});
			}
		},

		//Update the stats bar on combat scene
		updateStatsBars: function() {
			//Hero
			document.getElementById("custom_combat_hp").innerHTML = Math.max(0,PixelCombatPlus.hero.hp) + "/" + var_max_hp; //Set the number on the hero hp bar
			let heroHpPercentage = PixelCombatPlus.hero.hp / var_max_hp * 100;
			document.getElementById("custom-hero-progress-bar-hp").style.width = heroHpPercentage.toFixed() + "%"; // Set the hero hp bar background
			//Mana
			document.getElementById("custom_combat_mana").innerHTML = Math.max(0,PixelCombatPlus.hero.mana) + "/" + var_max_mana; //Set the number on the hero mana bar
			let heroManaPercentage = PixelCombatPlus.hero.mana / var_max_mana * 100;
			document.getElementById("custom-hero-progress-bar-mana").style.width = heroManaPercentage.toFixed() + "%"; // Set the mana hp bar background
			
			//Enemy
			document.getElementById("custom_combat_monster_hp").innerHTML = Math.max(0,PixelCombatPlus.enemy.hp) + "/" + PixelCombatPlus.enemy.maxHp; //Set the number on the enemy hp bar
			let EnemyHpPercentage = PixelCombatPlus.enemy.hp / PixelCombatPlus.enemy.maxHp * 100;
			document.getElementById("custom-monster-progress-bar-hp").style.width = EnemyHpPercentage.toFixed() + "%"; // Set the enemy hp bar background
		},
		
		//Update the enemy stats mid fight, can be used for pvp
		updateEnemyStats: function(foe) {
			PixelCombatPlus.enemyImage.src = foe.image;
			PixelCombatPlus.enemy.abilities = [];
			for (const key in foe) {
				PixelCombatPlus.enemy[key] = foe[key];
			};
			PixelCombatPlus.updateStatsBars();
			PixelCombatPlus.enemy.abilities.forEach(function(ability,index) {if (ability.cd > 0){PixelCombatPlus.cooldownAbility(index,ability.cd)}});
			document.getElementById("custom-fighting-monster-label").innerText = PixelCombatPlus.enemy.name;
			document.getElementById("custom_combat_monster_accuracy").innerText = PixelCombatPlus.enemy.accuracy == -1 ? 1 : PixelCombatPlus.enemy.accuracy;
			document.getElementById("custom_combat_monster_attack").innerText = PixelCombatPlus.enemy.damage;
			document.getElementById("custom_combat_monster_speed").innerText = PixelCombatPlus.enemy.speed;
			document.getElementById("custom_combat_monster_defence").innerText = PixelCombatPlus.enemy.defence;
		},
		
		//Define the enemy image
		setEnemyImage: function(foe) {
			try {
				PixelCombatPlus.enemyImage.src = foe;
			} catch (error) {
				setTimeout(function() {
					try {
						PixelCombatPlus.enemyImage.src = foe;
					} catch (error) {
						PixelCombatPlus.setEnemyImage(foe)
					}
				}, 1000);
			}
		},
		
		//Starts the fight
		startFight: function(foe) {
		if (PixelCombatPlus.fight == false) {
			//Make sure that there is nothing remaining from the last fight
			PixelCombatPlus.enemy.poisoned = false;
			PixelCombatPlus.hero.poisoned = false;
			PixelCombatPlus.hero.isReflecting = false;
			PixelCombatPlus.hitSplatHero = {};
			PixelCombatPlus.hitSplatEnemy = {};
			PixelCombatPlus.hero.revive = 0;
			//Stats Update
			PixelCombatPlus.hero.hp = var_max_hp; //Set the current hero hp to max
			PixelCombatPlus.hero.mana = var_max_mana; //Set the current hero mana to max
			PixelCombatPlus.setEnemyImage(foe.image) //Set the enemy image
			for (const key in foe) {PixelCombatPlus.enemy[key] = foe[key]}; //Set the current enemy
			PixelCombatPlus.enemy.poisoned = false; //Removes poison
			if (PixelCombatPlus.enemy.speed > 6) {PixelCombatPlus.enemy.speed = 6}; // 6 is the max speed
			if (PixelCombatPlus.enemy.hp > PixelCombatPlus.enemy.maxHp) {PixelCombatPlus.enemy.hp = PixelCombatPlus.enemy.maxHp}; // Enemy can't have more than max hp
			
			//UI Update
			PixelCombatPlus.refreshPresetIcons(); //Load the preset icon and color
			PixelCombatPlus.updateStatsBars(); //Updates all stats on UI
			//Hero Stats
			document.getElementById("custom-fighting-hero-label").innerText = var_username;
			document.getElementById("custom_combat_hero_accuracy").innerText = var_accuracy;
			document.getElementById("custom_combat_hero_melee_damage").innerText = var_melee_damage;
			document.getElementById("custom_combat_hero_arrow_damage").innerText = var_arrow_damage;
			document.getElementById("custom_combat_hero_magic_bonus").innerText = var_magic_bonus;
			document.getElementById("custom_combat_hero_speed").innerText = var_speed;
			document.getElementById("custom_combat_hero_defence").innerText = var_defence;
			//Enemy Stats
			document.getElementById("custom-fighting-monster-label").innerText = PixelCombatPlus.enemy.name;
			document.getElementById("custom_combat_monster_accuracy").innerText = PixelCombatPlus.enemy.accuracy == -1 ? 1 : PixelCombatPlus.enemy.accuracy;
			document.getElementById("custom_combat_monster_attack").innerText = PixelCombatPlus.enemy.damage;
			document.getElementById("custom_combat_monster_speed").innerText = PixelCombatPlus.enemy.speed;
			document.getElementById("custom_combat_monster_defence").innerText = PixelCombatPlus.enemy.defence;
			
			switch_panels('panel-customCombat'); //Go to the fight scene
			document.getElementById('menu-bar').style.display = "none"; //Hides lateral bar
			document.getElementById('notification-custom-combat').style.display = "" //Shows the combat notification
			document.getElementById('notification-custom-combat').style.display = "" //Shows the combat notification
			PixelCombatPlus.fight = true; //Starts the fight

			PixelCombatPlus.cooldown('startsIn',5,'custom-fighting-countdown','hide'); //Start the timer to fight
			PixelCombatPlus.ticking = setInterval(function() {
				PixelCombatPlus.tick()
			}, 1000 / 60);
			setTimeout(function(){
				PixelCombatPlus.attack("hero");
				PixelCombatPlus.attack("enemy");
				PixelCombatPlus.enemy.abilities.forEach(function(ability,index) {if (ability.cd > 0){PixelCombatPlus.cooldownAbility(index,ability.cd)}});
			}, 6000);
			
		}
		},
		
		//Hit function
		hitRate: function(defence,accuracy) {
			if (accuracy == -1) {return false};
			let hitRandom = Math.random();
			let hitChance = 0;
			if (((defence / 2) - accuracy) > 4) {
				hitChance = 1 / (Math.max(1, ((defence / 2) - accuracy)) + 1);
			} else if (((defence / 2) - accuracy) <= 0) {
				hitChance = 1;
			} else {
				hitChance = 1 - (((defence / 2) - accuracy) * 2 / 10);
			};
			if (PixelCombatPlus.enemy.needsLight == true && !(var_ring_of_light_equipped == 1 || var_shield == 'lantern')) {hitChance = 0.5};
			return hitRandom <= hitChance
		},
		
		//Attack function 
		attack: function(attacker){
			if (PixelCombatPlus.fight == true) {
			if (attacker == "hero") {
				//Poison
				if (PixelCombatPlus.enemy.poisoned == false && var_weapon.includes('poison')) {
					PixelCombatPlus.enemy.poisoned = true;
					PixelCombatPlus.poison('enemy',5);
				};
				//If hit succeed 
				if (PixelCombatPlus.hitRate(PixelCombatPlus.enemy.defence,var_accuracy)) {
					if (PixelCombatPlus.enemyIsInvisible > 0) {
						PixelCombatPlus.addHitSplat("MISSED","images/ghost_icon.png","white","rgba(255,0,0,0.6)","blue","Enemy");
					} else {
						if (ranged.includes(var_weapon)) {
							if (PixelCombatPlus.enemy.arrowImunity == true) {
								PixelCombatPlus.addHitSplat('IMMUNE', 'images/blocked.png', 'white', 'rgba(255,0,0,0.4)', 'blue', 'Enemy');
							} else {
								let damageDone = Math.floor(Math.random() * parseInt(var_arrow_damage));
								if ((PixelCombatPlus.enemy.weakToFire == true && var_arrows == 'fire_arrows') || (PixelCombatPlus.enemy.weakToIce == true && var_arrows == 'ice_arrows')) {
									damageDone *= 2;
								}
								if (PixelCombatPlus.enemy.isReflecting == true && damageDone > 0) {
									PixelCombatPlus.hero.hp -= damageDone;
									PixelCombatPlus.enemy.isReflecting = false;
									PixelCombatPlus.addHitSplat(damageDone, "images/reflect_spell.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Hero');
								} else {
									PixelCombatPlus.enemy.hp -= damageDone;
									PixelCombatPlus.addHitSplat(damageDone, "images/" + Items.getItemString('weapon')+".png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Enemy');
								}
							};
						} else {
							let damageDone = Math.floor(Math.random() * parseInt(var_melee_damage))
							if (PixelCombatPlus.enemy.ghost == true) {
								if (var_weapon == 'scythe') {damageDone *= 2};
								if (var_weapon == 'double_scythe') {damageDone *= 4};
							} else if (PixelCombatPlus.enemy.fish == true) {
								if (var_weapon.includes('trident')) {damageDone *= 2};
							};
							if (PixelCombatPlus.enemy.isReflecting == true && damageDone > 0) {
								PixelCombatPlus.hero.hp -= damageDone;
								PixelCombatPlus.enemy.isReflecting = false;
								PixelCombatPlus.addHitSplat(damageDone, "images/reflect_spell.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Hero');
							} else {
								PixelCombatPlus.enemy.hp -= damageDone;
								PixelCombatPlus.addHitSplat(damageDone, "images/" + Items.getItemString('weapon')+".png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Enemy');
								if (PixelCombatPlus.enemy.defender == true) {
									PixelCombatPlus.hero.hp -= 1;
									PixelCombatPlus.addHitSplat(1, "images/" + Items.getItemString('weapon')+".png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Hero');
								};
							};
						};
					}
				} else {
					PixelCombatPlus.addHitSplat("0", "images/blocked.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Enemy');
				};
				//Hero attack again
				setTimeout(function(){PixelCombatPlus.attack("hero")},(7-var_speed)*1000)
			} else {
				if (PixelCombatPlus.hitRate(var_defence,PixelCombatPlus.enemy.accuracy)) {
					if (PixelCombatPlus.heroIsInvisible > 0) {
						PixelCombatPlus.addHitSplat("MISSED","images/ghost_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
					} else {
						let damageDone = Math.floor(Math.random() * PixelCombatPlus.enemy.damage);
						if (PixelCombatPlus.hero.isReflecting == true && damageDone > 0) {
							PixelCombatPlus.enemy.hp -= damageDone;
							PixelCombatPlus.hero.isReflecting = false;
							PixelCombatPlus.addHitSplat(damageDone, "images/reflect_spell.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Enemy');
						} else {
							PixelCombatPlus.hero.hp -= damageDone;
							PixelCombatPlus.addHitSplat(damageDone,"images/sword_icon.png","white","rgba(255,0,0,0.6)","blue","Hero");
						}
					}
				} else {
					PixelCombatPlus.addHitSplat("0", "images/blocked.png", 'white', 'rgba(255,0,0,0.6)', 'blue', 'Hero');
				};
				//Enemy attack again
				setTimeout(function(){PixelCombatPlus.attack("enemy")},(7-PixelCombatPlus.enemy.speed)*1000)
			}
			//Update hps
			PixelCombatPlus.updateStatsBars();
			}
		},
		
		//HitSplat Generator
		addHitSplat: function(label, icon, label_color, background_color, border_color, source) {
			let splatX = source == "Hero" ? 150 : 200
			let splatY = source == 450
			let splat = new HitSplat(label, icon, label_color, background_color, border_color, splatX, 450);

			let random_key = rand(1,500000);
			PixelCombatPlus['hitSplat'+source][random_key] = splat;

			setTimeout(
				function(){
					delete PixelCombatPlus['hitSplat'+source][random_key];
				}
			,1000)
		},
		
		//Evething that should be called each second
		tick: function() {
			//UI
			//Hero Stats
			document.getElementById("custom_combat_hero_accuracy").innerText = var_accuracy;
			document.getElementById("custom_combat_hero_melee_damage").innerText = var_melee_damage;
			document.getElementById("custom_combat_hero_arrow_damage").innerText = var_arrow_damage;
			document.getElementById("custom_combat_hero_magic_bonus").innerText = var_magic_bonus;
			document.getElementById("custom_combat_hero_speed").innerText = var_speed;
			document.getElementById("custom_combat_hero_defence").innerText = var_defence;
			PixelCombatPlus.tickCanvas();
			PixelCombatPlus.manageHitplats();
			
			PixelCombatPlus.ticks++
			if (PixelCombatPlus.ticks == 60) {
				if (PixelCombatPlus.enemy.hp <= 0) {
					if (PixelCombatPlus.enemy.multiPhase) {
						PixelCombatPlus.updateEnemyStats(PixelCombatPlus.enemy.nextPhase)
					} else {
						PixelCombatPlus.endFight();
					}
				};
				if (PixelCombatPlus.hero.hp <= 0) {
					if (var_badge_death_1_hp == 1 && PixelCombatPlus.hero.revive == 0) {
						PixelCombatPlus.hero.hp = 1;
						PixelCombatPlus.hero.revive = 1;
						PixelCombatPlus.updateStatsBars();
					} else {
						PixelCombatPlus.endFight();
					}
				};
				if(PixelCombatPlus.startsIn <= 0) {PixelCombatPlus.specialAttack()}
				PixelCombatPlus.ticks = 0;
			};
		},
		
		tickCanvas: function() {
			PixelCombatPlus.heroContext.clearRect(0, 0, PixelCombatPlus.heroCanvas.width, PixelCombatPlus.heroCanvas.height);
			PixelCombatPlus.enemyContext.clearRect(0, 0, PixelCombatPlus.enemyCanvas.width, PixelCombatPlus.enemyCanvas.height);
			if (PixelCombatPlus.heroIsInvisible > 0) {
				PixelCombatPlus.heroContext.fillStyle = "white";
				PixelCombatPlus.heroContext.globalAlpha = 0.1;
				PixelCombatPlus.heroContext.fillRect(155, 20, 50, 50);
				PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/ghost_icon.png","hero_invisible"), 155, 20);
			} else {
				PixelCombatPlus.heroContext.globalAlpha = 1.0;
			};
			if (PixelCombatPlus.enemyIsInvisible > 0) {
				PixelCombatPlus.enemyContext.fillStyle = "white";
				PixelCombatPlus.enemyContext.globalAlpha = 0.1;
				PixelCombatPlus.enemyContext.fillRect(280, 20, 50, 50);
				PixelCombatPlus.enemyContext.drawImage(Cache.getImage("images/ghost_icon.png","hero_invisible"), 280, 20);
			} else {
				PixelCombatPlus.enemyContext.globalAlpha = 1.0;
			};
			if (PixelCombatPlus.hero.isReflecting == true) {
				PixelCombatPlus.heroContext.fillStyle = "white";
				PixelCombatPlus.heroContext.fillRect(95, 20, 50, 50);
				PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/reflect_spell.png","hero_reflecting"), 95, 20);
			};
			if (PixelCombatPlus.enemy.isReflecting == true) {
				PixelCombatPlus.enemyContext.fillStyle = "white";
				PixelCombatPlus.enemyContext.fillRect(170, 20, 50, 50);
				PixelCombatPlus.enemyContext.drawImage(Cache.getImage("images/reflect_spell.png","hero_reflecting"), 170, 20);
			};
			if (PixelCombatPlus.enemyIsCharging > 0) {
				PixelCombatPlus.enemyContext.fillStyle = "white";
				PixelCombatPlus.enemyContext.fillRect(225, 20, 50, 50);
				PixelCombatPlus.enemyContext.fillStyle = "black";
				PixelCombatPlus.enemyContext.font = "50px serif";
				PixelCombatPlus.enemyContext.fillText(PixelCombatPlus.enemyIsCharging, 238, 60);
			};
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_head_" + Items.getItemString('head')+".png","hero_fighting_head"), 0, 300);
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_body_" + Items.getItemString('body')+".png","hero_fighting_body"), 0, 300);
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_gloves_" + Items.getItemString('gloves')+".png","hero_fighting_gloves"), 0, 300);
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_legs_" + Items.getItemString('legs')+".png","hero_fighting_legs"), 0, 300);
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_boots_" + Items.getItemString('boots')+".png","hero_fighting_boots"), 0, 300);
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_amulet_" + Items.getItemString('amulet')+".png","hero_fighting_amulet"), 0, 300);
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_shield_" + Items.getItemString('shield')+".png","hero_fighting_shield"), 0, 300);
			PixelCombatPlus.heroContext.drawImage(Cache.getImage("images/hero_weapon_" + Items.getItemString('weapon')+".png","hero_fighting_weapon"), 0, 300);
			if (PixelCombatPlus.enemyImage.height !== 600) {
				let newWidth = 200 / (PixelCombatPlus.enemyImage.height / PixelCombatPlus.enemyImage.width)
				PixelCombatPlus.enemyContext.drawImage(PixelCombatPlus.enemyImage,(500-newWidth)/2,375,newWidth,200);
			} else {
				PixelCombatPlus.enemyContext.drawImage(PixelCombatPlus.enemyImage,0,0);
			}; //Enemy Image
		},
		
		manageHitplats: function() {
			for (let key in PixelCombatPlus.hitSplatHero) {
				PixelCombatPlus.hitSplatHero[key].draw(PixelCombatPlus.heroContext);
			};
			for (let key in PixelCombatPlus.hitSplatEnemy) {
				PixelCombatPlus.hitSplatEnemy[key].draw(PixelCombatPlus.enemyContext);
			};
		},
		
		looting: function() {
			let lootedItems = [];
			let lootedItemsHTML = '';
			document.getElementById('modal-custom-loot-body').innerHTML = ''
			PixelCombatPlus.enemy.lootTable.forEach(function(loot){
				let dropChance = Math.random() * (loot.chance - 1) + 1;
				if (loot.chance == dropChance) {
					let dropAmount = Math.random() * (loot.max - loot.min) + loot.min;
					if (dropAmount == 0) {dropAmount = ''};
					lootedItemsHTML += `<div class="loot" style="background-color:#cce6ff">
						<img src="${loot.image}" class="w50 me-3">${dropAmount} ${loot.item}
					</div>`;
					lootedItems.push({item:loot.item,amount:dropAmount});
				};
			});
			document.getElementById('modal-custom-loot-body').insertAdjacentHTML('beforeend', lootedItemsHTML);
			document.getElementById('customCombatModalParent').style.display = "";
			return lootedItems;
		},
		
		endFight: function() {
			PixelCombatPlus.fight = false;
			clearInterval(PixelCombatPlus.ticking);
			PixelCombatPlus.enemy.poisoned = false;
			PixelCombatPlus.hero.poisoned = false;
			PixelCombatPlus.hero.isReflecting = false;
			PixelCombatPlus.hitSplatHero = {};
			PixelCombatPlus.hitSplatEnemy = {};
			PixelCombatPlus.healCooldown = 0;
			PixelCombatPlus.fireCooldown = 0;
			PixelCombatPlus.reflectCooldown = 0;
			PixelCombatPlus.invisibilityCooldown = 0;
			PixelCombatPlus.heroIsInvisible = 0;
			PixelCombatPlus.hero.revive = 0;
			if (PixelCombatPlus.enemy.hp <= 0) {
				if (typeof PixelCombatPlus.enemy.lootTable == 'object') {
					PixelCombatPlus.enemy.lootFunction(PixelCombatPlus.looting());
				};
				if (typeof PixelCombatPlus.enemy.winFunction == 'function') {
					PixelCombatPlus.enemy.winFunction();
				};
			} else if (PixelCombatPlus.hero.hp <= 0) {
				console.log('loser');
			}
			for (const key in defaultEnemy) {
				PixelCombatPlus.enemy[key] = defaultEnemy[key];
			};
			switch_panels('panel-combat');
			document.getElementById('notification-custom-combat').style.display = "none" //Hide the combat notification
		}
	};
	window.PixelCombatPlus = PixelCombatPlus;
	PixelCombatPlus.initialize();
})()
}