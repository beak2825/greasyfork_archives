// ==UserScript==
// @name         CloudyMod
// @namespace    -
// @version      99
// @description  Autohat and trap placer

// @author       Steven Y
// @match        *://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @grant        none
// @require      https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js

// @downloadURL https://update.greasyfork.org/scripts/374274/CloudyMod.user.js
// @updateURL https://update.greasyfork.org/scripts/374274/CloudyMod.meta.js
// ==/UserScript==

var autoHealSpeed = 9000; //Bigger number = SLOWER autoheal; fastest is 0.
var DEFAULT_HAT = 7;
var DEFAULT_WINGS = 18;
var instaKillKey = 114;
var spikeKey = 118;
var trapKey = 102;
var removeMonkeyTail = true;
var askMeAgain = true; //set this to false if the user doesnt want to be asked about hat switching again

try {
document.getElementById("moomooio_728x90_home").style.display = "none"; //Remove sidney's ads
    $("#moomooio_728x90_home").parent().css({display: "none"});
} catch (e) {
  console.log("error removing ad");
}



var accessories = [{
		id: 12,
		name: "Snowball",
		price: 1e3,
		scale: 105,
		xOff: 18,
		desc: "no effect"
	}, {
		id: 9,
		name: "Tree Cape",
		price: 1e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 10,
		name: "Stone Cape",
		price: 1e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 3,
		name: "Cookie Cape",
		price: 1500,
		scale: 90,
		desc: "no effect"
	}, {
		id: 8,
		name: "Cow Cape",
		price: 2e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 11,
		name: "Monkey Tail",
		price: 2e3,
		scale: 97,
		xOff: 25,
		desc: "Super speed but reduced damage",
		spdMult: 1.35,
		dmgMultO: .2
	}, {
		id: 17,
		name: "Apple Basket",
		price: 3e3,
		scale: 80,
		xOff: 12,
		desc: "slowly regenerates health over time",
		healthRegen: 1
	}, {
		id: 6,
		name: "Winter Cape",
		price: 3e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 4,
		name: "Skull Cape",
		price: 4e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 5,
		name: "Dash Cape",
		price: 5e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 2,
		name: "Dragon Cape",
		price: 6e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 1,
		name: "Super Cape",
		price: 8e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 7,
		name: "Troll Cape",
		price: 8e3,
		scale: 90,
		desc: "no effect"
	}, {
		id: 14,
		name: "Thorns",
		price: 1e4,
		scale: 115,
		xOff: 20,
		desc: "no effect"
	}, {
		id: 15,
		name: "Blockades",
		price: 1e4,
		scale: 95,
		xOff: 15,
		desc: "no effect"
	}, {
		id: 20,
		name: "Devils Tail",
		price: 1e4,
		scale: 95,
		xOff: 20,
		desc: "no effect"
	}, {
		id: 16,
		name: "Sawblade",
		price: 12e3,
		scale: 90,
		spin: !0,
		xOff: 0,
		desc: "deal damage to players that damage you",
		dmg: .15
	}, {
		id: 13,
		name: "Angel Wings",
		price: 15e3,
		scale: 138,
		xOff: 22,
		desc: "slowly regenerates health over time",
		healthRegen: 3
	}, {
		id: 19,
		name: "Shadow Wings",
		price: 15e3,
		scale: 138,
		xOff: 22,
		desc: "increased movement speed",
		spdMult: 1.1
	}, {
		id: 18,
		name: "Blood Wings",
		price: 2e4,
		scale: 178,
		xOff: 26,
		desc: "restores health when you deal damage",
		healD: .2
	}, {
		id: 21,
		name: "Corrupt X Wings",
		price: 2e4,
		scale: 178,
		xOff: 26,
		desc: "deal damage to players that damage you",
		dmg: .25
	}]


var hats = hats = [{
		id: 45,
		name: "Shame!",
		dontSell: !0,
		price: 0,
		scale: 120,
		desc: "hacks are for losers"
	}, {
		id: 51,
		name: "Moo Cap",
		price: 0,
		scale: 120,
		desc: "coolest mooer around"
	}, {
		id: 50,
		name: "Apple Cap",
		price: 0,
		scale: 120,
		desc: "apple farms remembers"
	}, {
		id: 28,
		name: "Moo Head",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 29,
		name: "Pig Head",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 30,
		name: "Fluff Head",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 36,
		name: "Pandou Head",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 37,
		name: "Bear Head",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 38,
		name: "Monkey Head",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 44,
		name: "Polar Head",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 35,
		name: "Fez Hat",
		price: 0,
		scale: 120,
		desc: "no effect"
	}, {
		id: 42,
		name: "Enigma Hat",
		price: 0,
		scale: 120,
		desc: "join the enigma army"
	}, {
		id: 43,
		name: "Blitz Hat",
		price: 0,
		scale: 120,
		desc: "hey everybody i'm blitz"
	}, {
		id: 49,
		name: "Bob XIII Hat",
		price: 0,
		scale: 120,
		desc: "like and subscribe"
	}, {
		id: 8,
		name: "Bummle Hat",
		price: 100,
		scale: 120,
		desc: "no effect"
	}, {
		id: 2,
		name: "Straw Hat",
		price: 500,
		scale: 120,
		desc: "no effect"
	}, {
		id: 15,
		name: "Winter Cap",
		price: 600,
		scale: 120,
		desc: "allows you to move at normal speed in snow",
		coldM: 1
	}, {
		id: 5,
		name: "Cowboy Hat",
		price: 1e3,
		scale: 120,
		desc: "no effect"
	}, {
		id: 4,
		name: "Ranger Hat",
		price: 2e3,
		scale: 120,
		desc: "no effect"
	}, {
		id: 18,
		name: "Explorer Hat",
		price: 2e3,
		scale: 120,
		desc: "no effect"
	}, {
		id: 31,
		name: "Flipper Hat",
		price: 2500,
		scale: 120,
		desc: "have more control while in water",
		watrImm: !0
	}, {
		id: 1,
		name: "Marksman Cap",
		price: 3e3,
		scale: 120,
		desc: "increases arrow speed and range",
		aMlt: 1.3
	}, {
		id: 10,
		name: "Bush Gear",
		price: 3e3,
		scale: 160,
		desc: "allows you to disguise yourself as a bush"
	}, {
		id: 48,
		name: "Halo",
		price: 3e3,
		scale: 120,
		desc: "no effect"
	}, {
		id: 6,
		name: "Soldier Helmet",
		price: 4e3,
		scale: 120,
		desc: "reduces damage taken but slows movement",
		spdMult: .94,
		dmgMult: .75
	}, {
		id: 23,
		name: "Anti Venom Gear",
		price: 4e3,
		scale: 120,
		desc: "makes you immune to poison",
		poisonRes: 1
	}, {
		id: 13,
		name: "Medic Gear",
		price: 5e3,
		scale: 110,
		desc: "slowly regenerates health over time",
		healthRegen: 3
	}, {
		id: 9,
		name: "Miners Helmet",
		price: 5e3,
		scale: 120,
		desc: "earn 1 extra gold per resource",
		extraGold: 1
	}, {
		id: 32,
		name: "Musketeer Hat",
		price: 5e3,
		scale: 120,
		desc: "reduces cost of projectiles",
		projCost: .5
	}, {
		id: 7,
		name: "Bull Helmet",
		price: 6e3,
		scale: 120,
		desc: "increases damage done but drains health",
		healthRegen: -5,
		dmgMultO: 1.5,
		spdMult: .96
	}, {
		id: 22,
		name: "Emp Helmet",
		price: 6e3,
		scale: 120,
		desc: "turrets won't attack but you move slower",
		antiTurret: 1,
		spdMult: .7
	}, {
		id: 12,
		name: "Booster Hat",
		price: 6e3,
		scale: 120,
		desc: "increases your movement speed",
		spdMult: 1.16
	}, {
		id: 26,
		name: "Barbarian Armor",
		price: 8e3,
		scale: 120,
		desc: "knocks back enemies that attack you",
		dmgK: .6
	}, {
		id: 21,
		name: "Plague Mask",
		price: 1e4,
		scale: 120,
		desc: "melee attacks deal poison damage",
		poisonDmg: 5,
		poisonTime: 6
	}, {
		id: 46,
		name: "Bull Mask",
		price: 1e4,
		scale: 120,
		desc: "bulls won't target you unless you attack them",
		bullRepel: 1
	}, {
		id: 14,
		name: "Windmill Hat",
		topSprite: !0,
		price: 1e4,
		scale: 120,
		desc: "generates points while worn",
		pps: 1.5
	}, {
		id: 11,
		name: "Spike Gear",
		topSprite: !0,
		price: 1e4,
		scale: 120,
		desc: "deal damage to players that damage you",
		dmg: .45
	}, {
		id: 53,
		name: "Turret Gear",
		topSprite: !0,
		price: 1e4,
		scale: 120,
		desc: "you become a walking turret",
		turret: {
			proj: 1,
			range: 700,
			rate: 2500
		},
		spdMult: .5
	}, {
		id: 20,
		name: "Samurai Armor",
		price: 12e3,
		scale: 120,
		desc: "increased attack speed and fire rate",
		atkSpd: .78
	}, {
		id: 16,
		name: "Bushido Armor",
		price: 12e3,
		scale: 120,
		desc: "restores health when you deal damage",
		healD: .4
	}, {
		id: 27,
		name: "Scavenger Gear",
		price: 15e3,
		scale: 120,
		desc: "earn double points for each kill",
		kScrM: 2
	}, {
		id: 40,
		name: "Tank Gear",
		price: 15e3,
		scale: 120,
		desc: "increased damage to buildings but slower movement",
		spdMult: .3,
		bDmg: 3.3
	}, {
		id: 52,
		name: "Thief Gear",
		price: 15e3,
		scale: 120,
		desc: "steal half of a players gold when you kill them",
		goldSteal: .5
	}]


var objects = [{
		id: 0,
		name: "food",
		layer: 0
	}, {
		id: 1,
		name: "walls",
		place: !0,
		limit: 30,
		layer: 0
	}, {
		id: 2,
		name: "spikes",
		place: !0,
		limit: 15,
		layer: 0
	}, {
		id: 3,
		name: "mill",
		place: !0,
		limit: 7,
		layer: 1
	}, {
		id: 4,
		name: "mine",
		place: !0,
		limit: 1,
		layer: 0
	}, {
		id: 5,
		name: "trap",
		place: !0,
		limit: 6,
		layer: -1
	}, {
		id: 6,
		name: "booster",
		place: !0,
		limit: 12,
		layer: -1
	}, {
		id: 7,
		name: "turret",
		place: !0,
		limit: 2,
		layer: 1
	}, {
		id: 8,
		name: "watchtower",
		place: !0,
		limit: 12,
		layer: 1
	}, {
		id: 9,
		name: "buff",
		place: !0,
		limit: 4,
		layer: -1
	}, {
		id: 10,
		name: "spawn",
		place: !0,
		limit: 1,
		layer: -1
	}, {
		id: 11,
		name: "sapling",
		place: !0,
		limit: 2,
		layer: 0
	}, {
		id: 12,
		name: "blocker",
		place: !0,
		limit: 3,
		layer: -1
	}, {
		id: 13,
		name: "teleporter",
		place: !0,
		limit: 1,
		layer: -1
	}]

    var weapons = [{
		id: 0,
		type: 0,
		name: "tool hammer",
		desc: "tool for gathering all resources",
		src: "hammer_1",
		length: 140,
		width: 140,
		xOff: -3,
		yOff: 18,
		dmg: 25,
		range: 65,
		gather: 1,
		speed: 300
	}, {
		id: 1,
		type: 0,
		age: 2,
		name: "hand axe",
		desc: "gathers resources at a higher rate",
		src: "axe_1",
		length: 140,
		width: 140,
		xOff: 3,
		yOff: 24,
		dmg: 30,
		spdMult: 1,
		range: 70,
		gather: 2,
		speed: 400
	}, {
		id: 2,
		type: 0,
		age: 8,
		pre: 1,
		name: "great axe",
		desc: "deal more damage and gather more resources",
		src: "great_axe_1",
		length: 140,
		width: 140,
		xOff: -8,
		yOff: 25,
		dmg: 35,
		spdMult: 1,
		range: 75,
		gather: 4,
		speed: 400
	}, {
		id: 3,
		type: 0,
		age: 2,
		name: "short sword",
		desc: "increased attack power but slower move speed",
		src: "sword_1",
		iPad: 1.3,
		length: 130,
		width: 210,
		xOff: -8,
		yOff: 46,
		dmg: 35,
		spdMult: .85,
		range: 110,
		gather: 1,
		speed: 300
	}, {
		id: 4,
		type: 0,
		age: 8,
		pre: 3,
		name: "katana",
		desc: "greater range and damage",
		src: "samurai_1",
		iPad: 1.3,
		length: 130,
		width: 210,
		xOff: -8,
		yOff: 59,
		dmg: 40,
		spdMult: .8,
		range: 118,
		gather: 1,
		speed: 300
	}, {
		id: 5,
		type: 0,
		age: 2,
		name: "polearm",
		desc: "long range melee weapon",
		src: "spear_1",
		iPad: 1.3,
		length: 130,
		width: 210,
		xOff: -8,
		yOff: 53,
		dmg: 45,
		knock: .2,
		spdMult: .82,
		range: 142,
		gather: 1,
		speed: 700
	}, {
		id: 6,
		type: 0,
		age: 2,
		name: "bat",
		desc: "fast long range melee weapon",
		src: "bat_1",
		iPad: 1.3,
		length: 110,
		width: 180,
		xOff: -8,
		yOff: 53,
		dmg: 20,
		knock: .7,
		range: 110,
		gather: 1,
		speed: 300
	}, {
		id: 7,
		type: 0,
		age: 2,
		name: "daggers",
		desc: "really fast short range weapon",
		src: "dagger_1",
		iPad: .8,
		length: 110,
		width: 110,
		xOff: 18,
		yOff: 0,
		dmg: 20,
		knock: .1,
		range: 65,
		gather: 1,
		hitSlow: .1,
		spdMult: 1.13,
		speed: 100
	}, {
		id: 8,
		type: 0,
		age: 2,
		name: "stick",
		desc: "great for gathering but very weak",
		src: "stick_1",
		length: 140,
		width: 140,
		xOff: 3,
		yOff: 24,
		dmg: 1,
		spdMult: 1,
		range: 70,
		gather: 7,
		speed: 400
	}, {
		id: 9,
		type: 1,
		age: 6,
		name: "hunting bow",
		desc: "bow used for ranged combat and hunting",
		src: "bow_1",
		req: ["wood", 4],
		length: 120,
		width: 120,
		xOff: -6,
		yOff: 0,
		projectile: 0,
		spdMult: .75,
		speed: 600
	}, {
		id: 10,
		type: 1,
		age: 6,
		name: "great hammer",
		desc: "hammer used for destroying structures",
		src: "great_hammer_1",
		length: 140,
		width: 140,
		xOff: -9,
		yOff: 25,
		dmg: 10,
		spdMult: .88,
		range: 75,
		sDmg: 7.5,
		gather: 1,
		speed: 400
	}, {
		id: 11,
		type: 1,
		age: 6,
		name: "wooden shield",
		desc: "blocks projectiles and reduces melee damage",
		src: "shield_1",
		length: 120,
		width: 120,
		shield: .2,
		xOff: 6,
		yOff: 0,
		spdMult: .7
	}, {
		id: 12,
		type: 1,
		age: 8,
		pre: 9,
		name: "crossbow",
		desc: "deals more damage and has greater range",
		src: "crossbow_1",
		req: ["wood", 5],
		aboveHand: !0,
		armS: .75,
		length: 120,
		width: 120,
		xOff: -4,
		yOff: 0,
		projectile: 2,
		spdMult: .7,
		speed: 700
	}, {
		id: 13,
		type: 1,
		age: 9,
		pre: 12,
		name: "repeater crossbow",
		desc: "high firerate crossbow with reduced damage",
		src: "crossbow_2",
		req: ["wood", 10],
		aboveHand: !0,
		armS: .75,
		length: 120,
		width: 120,
		xOff: -4,
		yOff: 0,
		projectile: 3,
		spdMult: .7,
		speed: 300
	}, {
		id: 14,
		type: 1,
		age: 6,
		name: "mc grabby",
		desc: "steals resources from enemies",
		src: "grab_1",
		length: 130,
		width: 210,
		xOff: -8,
		yOff: 53,
		dmg: 0,
		steal: 250,
		knock: .2,
		spdMult: 1.05,
		range: 125,
		gather: 0,
		speed: 700
	}, {
		id: 15,
		type: 1,
		age: 9,
		pre: 12,
		name: "musket",
		desc: "slow firerate but high damage and range",
		src: "musket_1",
		req: ["stone", 10],
		aboveHand: !0,
		rec: .35,
		armS: .6,
		hndS: .3,
		hndD: 1.6,
		length: 205,
		width: 205,
		xOff: 25,
		yOff: 0,
		projectile: 5,
		hideProjectile: !0,
		spdMult: .6,
		speed: 1500
	}]

var activeObjects = [{
		name: "apple",
		desc: "restores 20 health when consumed",
		req: ["food", 10],
		consume: function (e) {
			return e.changeHealth(20, e)
		},
		scale: 22,
		holdOffset: 15
	}, {
		age: 3,
		name: "cookie",
		desc: "restores 40 health when consumed",
		req: ["food", 15],
		consume: function (e) {
			return e.changeHealth(40, e)
		},
		scale: 27,
		holdOffset: 15
	}, {
		age: 7,
		name: "pizza",
		desc: "restores 30 health and another 50 over 5 seconds",
		req: ["food", 30],
		consume: function (e) {
			return !!(e.changeHealth(30, e) || e.health < 100) && (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0)
		},
		scale: 27,
		holdOffset: 15
	}, {
		name: "wood wall",
		desc: "provides protection for your village",
		req: ["wood", 10],
		projDmg: !0,
		health: 380,
		scale: 50,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 3,
		name: "stone wall",
		desc: "provides improved protection for your village",
		req: ["stone", 25],
		health: 900,
		scale: 50,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 7,
		pre: 1,
		name: "castle wall",
		desc: "provides powerful protection for your village",
		req: ["stone", 35],
		health: 1500,
		scale: 52,
		holdOffset: 20,
		placeOffset: -5
	}, {
		name: "spikes",
		desc: "damages enemies when they touch them",
		req: ["wood", 20, "stone", 5],
		health: 400,
		dmg: 20,
		scale: 49,
		spritePadding: -23,
		holdOffset: 8,
		placeOffset: -5
	}, {
		age: 5,
		name: "greater spikes",
		desc: "damages enemies when they touch them",
		req: ["wood", 30, "stone", 10],
		health: 500,
		dmg: 35,
		scale: 52,
		spritePadding: -23,
		holdOffset: 8,
		placeOffset: -5
	}, {
		age: 9,
		pre: 1,
		name: "poison spikes",
		desc: "poisons enemies when they touch them",
		req: ["wood", 35, "stone", 15],
		health: 600,
		dmg: 30,
		pDmg: 5,
		scale: 52,
		spritePadding: -23,
		holdOffset: 8,
		placeOffset: -5
	}, {
		age: 9,
		pre: 2,
		name: "spinning spikes",
		desc: "damages enemies when they touch them",
		req: ["wood", 30, "stone", 20],
		health: 500,
		dmg: 45,
		turnSpeed: .003,
		scale: 52,
		spritePadding: -23,
		holdOffset: 8,
		placeOffset: -5
	}, {
		name: "windmill",
		desc: "generates gold over time",
		req: ["wood", 50, "stone", 10],
		health: 400,
		pps: 1,
		turnSpeed: .0016,
		spritePadding: 25,
		iconLineMult: 12,
		scale: 45,
		holdOffset: 20,
		placeOffset: 5
	}, {
		age: 5,
		pre: 1,
		name: "faster windmill",
		desc: "generates more gold over time",
		req: ["wood", 60, "stone", 20],
		health: 500,
		pps: 1.5,
		turnSpeed: .0025,
		spritePadding: 25,
		iconLineMult: 12,
		scale: 47,
		holdOffset: 20,
		placeOffset: 5
	}, {
		age: 8,
		pre: 1,
		name: "power mill",
		desc: "generates more gold over time",
		req: ["wood", 100, "stone", 50],
		health: 800,
		pps: 2,
		turnSpeed: .005,
		spritePadding: 25,
		iconLineMult: 12,
		scale: 47,
		holdOffset: 20,
		placeOffset: 5
	}, {
		age: 5,
		type: 2,
		name: "mine",
		desc: "allows you to mine stone",
		req: ["wood", 20, "stone", 100],
		iconLineMult: 12,
		scale: 65,
		holdOffset: 20,
		placeOffset: 0
	}, {
		age: 5,
		type: 0,
		name: "sapling",
		desc: "allows you to farm wood",
		req: ["wood", 150],
		iconLineMult: 12,
		colDiv: .5,
		scale: 110,
		holdOffset: 50,
		placeOffset: -15
	}, {
		age: 4,
		name: "pit trap",
		desc: "pit that traps enemies if they walk over it",
		req: ["wood", 30, "stone", 30],
		trap: !0,
		ignoreCollision: !0,
		hideFromEnemy: !0,
		health: 500,
		colDiv: .2,
		scale: 50,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 4,
		name: "boost pad",
		desc: "provides boost when stepped on",
		req: ["stone", 20, "wood", 5],
		ignoreCollision: !0,
		boostSpeed: 1.5,
		health: 150,
		colDiv: .7,
		scale: 45,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 7,
		doUpdate: !0,
		name: "turret",
		desc: "defensive structure that shoots at enemies",
		req: ["wood", 200, "stone", 150],
		health: 800,
		projectile: 1,
		shootRange: 700,
		shootRate: 2200,
		scale: 43,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 7,
		name: "platform",
		desc: "platform to shoot over walls and cross over water",
		req: ["wood", 20],
		ignoreCollision: !0,
		zIndex: 1,
		health: 300,
		scale: 43,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 7,
		name: "healing pad",
		desc: "standing on it will slowly heal you",
		req: ["wood", 30, "food", 10],
		ignoreCollision: !0,
		healCol: 15,
		health: 400,
		colDiv: .7,
		scale: 45,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 9,
		name: "spawn pad",
		desc: "you will spawn here when you die but it will dissapear",
		req: ["wood", 100, "stone", 100],
		health: 400,
		ignoreCollision: !0,
		spawnPoint: !0,
		scale: 45,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 7,
		name: "blocker",
		desc: "blocks building in radius",
		req: ["wood", 30, "stone", 25],
		ignoreCollision: !0,
		blocker: 300,
		health: 400,
		colDiv: .7,
		scale: 45,
		holdOffset: 20,
		placeOffset: -5
	}, {
		age: 7,
		name: "teleporter",
		desc: "teleports you to a random point on the map",
		req: ["wood", 60, "stone", 60],
		ignoreCollision: !0,
		teleport: !0,
		health: 200,
		colDiv: .7,
		scale: 45,
		holdOffset: 20,
		placeOffset: -5
	}];

var allContainers = [accessories, hats, objects, weapons, activeObjects];
function obs(objName){
    for (let container of allContainers){
       for (let obj of container){
           if (obj.name.toLowerCase() == objName.toLowerCase()){
             return obj.id;
           }
       }
    }

    return -1;

}

var switchToHat = obs("bull helmet");
var switchToAccessory = obs("blood wings");
var switchToWep = obs("polearm");
var switchToRange = obs("crossbow");
var bullHelm = obs("bull helmet");
var monkeyTail = obs("monkey tail");

var invalidHats = [obs("shame!")]
console.log(invalidHats);



const START_SSWX =  [146, 161, 99, 146, 1, 192]
const END_SSWX =  [146, 161, 99, 146, 0, 192];
const TAKEOUT = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 15, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];
const APPLE = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 0, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];
const COOKIE = [4, 132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 1, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47];
const PIZZA =  [97, 117, 116, 111, 115, 112, 101, 101, 100]
var currentHat = 0;
var currentAccessory = 0;
var IN_PROCESS = false;
var justDied = false;
var recentHealth = 100;
var ws;
var MYID;
var hasApple = true;
var foodInHand = false;
var autoheal = true;
var autobull = true;
var STATE = 0;
var msgpack5 = msgpack;
var inInstaProcess = false;
var autoattack = false;
var allMooMooObjects = {};
var bowWorked = false;
var hasWinter = false;
var hasFlipper = false;
var myCLAN = null;
var goodData;
var myPlayer;
var nearestPlayerAngle = 0;
var MYANGLE = 0;
let coregood = [212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112];
var targets = [false, false];


let badreplace = [130, 166, 98, 117, 102, 102, 101, 114, 130, 164, 116, 121, 112, 101, 166, 66, 117, 102, 102, 101, 114, 164, 100, 97, 116, 97, 145, 0, 164, 116, 121, 112, 101, 0]
document.msgpack = msgpack;
function n(){
     this.buffer = new Uint8Array([0]);
     this.buffer.__proto__ = new Uint8Array;
     this.type = 0;
}

var nval = msgpack5.decode([132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 146, 161, 51, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47]).data[1];
document.n = nval;
document.timeTween = 130;

function replaceFromArray(oldp, newp, array){
  return array.join(",").replace(oldp.join(","), newp.join(",")).split(",").map(x => parseInt(x))

}

var playersNear = [];

var player = function(id, x, y, clan){
    this.id = id;
    this.x = x;
    this.y = y;
    this.clan = clan;
}


var styleSheetObj = document.createElement("link");
styleSheetObj.rel = "stylesheet";
styleSheetObj.href = "https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.css"
document.head.appendChild(styleSheetObj);

var settingsDiv = document.createElement('div');
var settingsSlider = document.createElement('input');
var itemTitle = document.createElement("h1");
var currentSpeed = document.createElement("h2");
var speedContain = document.createElement("div");
settingsSlider.type = "range";
settingsSlider.min = "12";
settingsSlider.max = "99";
settingsSlider.value = "50";
settingsSlider.id = "healSlider";
itemTitle.innerText = "AutoHeal Speed";
currentSpeed.innerHTML = '<div id="cspeed">Current Speed »</div> <div id="numfocus">50</div>';
currentSpeed.id = "currentSpeed";
speedContain.id = "speedContain";
itemTitle.id = "itemTitle";
settingsDiv.appendChild(settingsSlider);
speedContain.appendChild(currentSpeed);
document.querySelector("#setupCard").appendChild(itemTitle);
document.querySelector("#setupCard").appendChild(settingsDiv);
document.querySelector("#setupCard").appendChild(speedContain);
$("#healSlider").css({width: "100%", marginTop: 10});
$("#itemTitle").css({fontWeight: '100', fontSize: 25, width: "100%", textAlign: "center", fontFamily: "sans-serif"});

var targetbtn = document.createElement("img");
targetbtn.src = "https://i.imgur.com/gWzcwQR.png";
targetbtn.id = "tbtn";
document.body.prepend(targetbtn);

$("#healSlider").change((event, ui) => {
   let coreVal = parseInt($("#healSlider").val());
    autoHealSpeed = 150 - coreVal;
    currentSpeed.innerHTML = `<div id="cspeed">Current Speed »</div> <div id="numfocus">${coreVal}</div>`;
})

function generateHatHTML(name, id){
	return `<div id="flextop"><img id="hatimgmain" src="http://moomoo.io/img/hats/hat_${id}.png">
			<h1 id="changeAlert">Biome Hat Changed!</h1></div>
			<h3 id="typealert">Your hat was automatically changed to the <span id="hatname">${name}</span></h3>

			<div id="flexlow">
			<button id="sback">Switch Back!</button> <button id="okbtn">OK</button>
			</div>`
}

var menuChange = document.createElement("div");
menuChange.className = "menuCard";
menuChange.id = "mainSettings";
menuChange.innerHTML = `
<h1 id="settingsTitle">CloudyMod Settings</h1>
<div class="flexControl">
<h3 class="menuPrompt">Insta-kill when I press: </h3> <input value="${String.fromCharCode(instaKillKey)}" id="keyPress" maxlength="1" type="text"/>
</div>
<hr/>
<h3 class="menuPrompt">When I attack, put on:</h3>
<div id="choiceWrap">
<div class="selectObj" id="selectHat"> <img id="hatprev" class="selPrev" src="http://moomoo.io/img/hats/hat_${DEFAULT_HAT}.png"/> </div>
<img id="middlePlus" src="https://i.imgur.com/Sya0CZr.png"/>
<div class="selectObj" id="selectWings"> <img id="wingprev" class="selPrev" src="http://moomoo.io/img/accessories/access_${DEFAULT_WINGS}.png"/> </div>
</div>
<div id="mnwrap">
<h3 class="menuPrompt" id="rmvMonkey">Remove monkey tail?</h3> <input id="removeMonkey" maxlength="1" ${removeMonkeyTail ? "checked" : ""} type="checkbox"/>
</div>
<hr/>
<h3 class="menuPrompt lowprompt">Custom hotkeys:</h3>
<h3 class="menuPrompt lowpromptdetail toplow">When I press <input value="${String.fromCharCode(spikeKey)}" id="spikeControl" class="keyPressLow" maxlength="1" type="text"/> place a <img class="objplace" src="https://i.imgur.com/0wiUP4V.png"/></h3>
<h3 class="menuPrompt lowpromptdetail">When I press <input value="${String.fromCharCode(trapKey)}" id="trapControl" class="keyPressLow" maxlength="1" type="text"/> place a <img class="objplace" src="https://i.imgur.com/mHWrRQV.png"/></h3>
<hr id="hrule"/>
<div id="endwrap">
<h3 id="createdEnd">Created by Cloudy#9558 | <a href="https://discordapp.com/invite/s4F4wZh">Join My Discord</a></h3>
</div>
`
document.querySelector("#menuCardHolder").prepend(menuChange);

var hatChangeAlert = document.createElement("div");
hatChangeAlert.id = "hatChangeAlert";
document.body.prepend(hatChangeAlert);

$("#selectHat").click( () => {
    let allHats = [];
    for (var i=0;i<hats.length;i++){
          if (invalidHats.includes(hats[i].id)) continue;
         allHats.push(`<div  objid=${hats[i].id} class="selectObjAlert ${hats[i].id == switchToHat ? "chosenhat" : ""} inalertHat"> <img class="selPrev" src="http://moomoo.io/img/hats/hat_${hats[i].id}.png"/> </div>`);
    }
    $.alert({
        title: "Choose Your Hat!",
        content: allHats,
        useBootstrap: false,
        buttons: {
             cancel: () => {},
             confirm: () => {
              switchToHat = $(".chosenhat").attr("objid");
              $("#hatprev").attr("src", `http://moomoo.io/img/hats/hat_${switchToHat}.png`)
             },
        }

    });
});

$("#selectWings").click( () => {
       let allHats = [];
    for (var i=0;i<accessories.length;i++){
         allHats.push(`<div  objid=${accessories[i].id}  class="selectObjAlert ${accessories[i].id == switchToAccessory ? "chosenwing" : ""} inalertWing"> <img class="selPrev" src="http://moomoo.io/img/accessories/access_${accessories[i].id}.png"/> </div>`);
    }
    $.alert({
        title: "Choose Your Accessory!",
        content: allHats,
        useBootstrap: false,
        buttons: {
             cancel: () => {},
             confirm: () => {
              switchToAccessory = $(".chosenwing").attr("objid");
              $("#wingprev").attr("src", `http://moomoo.io/img/accessories/access_${switchToAccessory}.png`)

             },
        }

    });
});


$("#spikeControl").on("input", () => {
   var cval = $("#spikeControl").val();
    if (cval){
       spikeKey = cval.charCodeAt(0);
    }
});

$("#trapControl").on("input", () => {
   var cval = $("#trapControl").val();
    if (cval){
       trapKey = cval.charCodeAt(0);
    }
});

$("#keyPress").on("input", () => {
    var cval = $("#keyPress").val();
    if (cval){
      instaKillKey = cval.charCodeAt(0);
    }
})

$(document).on("click", ".inalertHat", (e) => {
    $(".chosenhat").removeClass("chosenhat");
    $(e.target.tagName == "DIV" ? e.target : $(e.target).parent()).addClass("chosenhat");
});

$(document).on("click", ".inalertWing", (e) => {
    $(".chosenwing").removeClass("chosenwing");
    $(e.target.tagName == "DIV" ? e.target : $(e.target).parent()).addClass("chosenwing");
});


$("#removeMonkey").click( () => {
    removeMonkeyTail = !removeMonkeyTail;
});


var botSpan;

$(document).on("click", "#okbtn", () => {
	$("#hatChangeAlert").animate({opacity: 0, top: -300});

});

$(document).on("click", "#sback", () => {
	document.dns(["13c", [0, currentHat, 0]]);
	$("#hatChangeAlert").animate({opacity: 0, top: -300});
});




var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`

	#sback, #okbtn {
		font-family: sans-serif;
		font-weight: 300;
		border: none;
		outline: none;
		font-size: 15px;

	}

	#sback {

		border-radius: 5px;
		padding: 9px;
		cursor: pointer;
		margin-top: -1.5px;
		background-color: #d85858;
		color: white;


	}

	#okbtn {

		border-radius: 5px;
		padding: 9px;
		cursor: pointer;
		margin-top: -1.5px;
		background-color: #7399d6;
		color: white;

	}

	#flexlow {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		width: 100%;

	}

	#changeAlert {
		font-family: sans-serif;
		font-weight: 200;
		font-size: 23px;


	}

	#typealert {
		font-family: sans-serif;
		font-weight: 200;
		font-size: 17px;
		width: 95%;
		margin-left: 2.5%;
		text-align: center;
		margin-top: 5.5px;
	}

#hatChangeAlert {
    position: absolute;
    padding: 5px;
    top: -300px;
    opacity: 0;
    left: 20px;
    width: 300px;
    height: 165px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);



}

#changeAlert {
 display: inline-block;

}

#hatimgmain {
 	width: 50px;
 	height: 50px;
 	display: inline-block;


}

#flextop {
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	align-items: center;

}

#tbtn {
 position: absolute;
 left: 0;
 top: 0;
 width: 80px;
 height: 80px;
 opacity: 0;

}

.chosenhat {
  border: 1px solid #7daaf2;
}

.chosenwing {
  border: 1px solid #7daaf2;
}

.inalertHat {
     margin-left: 30px !important;
     margin-top: 10px !important;
}

.inalertWing {
     margin-left: 30px !important;
     margin-top: 10px !important;
}

option {
  border-radius: 0px;
}

#hrule {
  margin-top: 20px;
}

#endwrap {
 margin-top: 15px;
 width: 100%;
text-align: center;
margin-bottom: -15px;
}

#createEnd {
width: 100%;
text-align: center;
margin: 0 auto;

}

.lowprompt {
margin-bottom: -100px !important;

}


.lowpromptdetail {
margin-left: 25px;
color: #4c4c4c !important;
margin-top: 20px !important;
margin-bottom: 0 !important;

}

.toplow {
  margin-top: 10px !important;
}


.objplace {
   width: 45px;
   height: 45px;
   margin-bottom: -17px;
   border: 0.5px solid #f2f2f2;
   border-radius: 10px;
   margin-left: 5px;
   cursor: pointer;
}

.selPrev {
width: 80px;
height: 80px;
display: block;
margin: auto;
margin-top: 10px;

}

#choiceWrap {
display: flex;
justify-content: space-evenly;
align-items: center;


}

#middlePlus {
display: inline-block;
width: 50px;
height: 50px;
font-weight: 100;
font-family: sans-serif;
color: #4A4A4A;
opacity: 0.8;

}

.selectObj {
cursor: pointer;
 width: 100px;
height: 100px;
background-color: #fcfcfc;
display: inline-block;
border-radius: 10px;
 box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);

}


.selectObjAlert {
 cursor: pointer;
 width: 100px;
 height: 100px;
 background-color: #fcfcfc;
 display: inline-block;
 border-radius: 10px;
 box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);

}

#mnwrap {
  width: 100%;
text-align: center;
margin-bottom: -7px;
margin-top: 8px;
}

#flexControl {


}

#keyPress {
   margin-left: 20px;
   height: 20px;
   width: 50px;
   background-color: #e5e3e3;
   border-radius: 7.5px;
font-size: 16px;
border: none;
text-align: center;
color: #4A4A4A;

}

.keyPressLow {
margin-left: 8px;
font-size: 16px;
margin-right: 8px;
   height: 25px;
   width: 50px;
   background-color: #fcfcfc;
   border-radius: 3.5px;
border: none;
text-align: center;
color: #4A4A4A;
   border: 0.5px solid #f2f2f2;


}

#keyPress:focus {
border: none;
outline: none;
}

.keyPressLow:focus{

outline: none;
}

input[type=range] {
  -webkit-appearance: none;
  margin-top: 0px;
  width: 100%;
}
input[type=range]:focus {
  outline: none;
}
#healSlider::-webkit-slider-runnable-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  background: #dddddd;
  border-radius: 5px;
}
#healSlider::-webkit-slider-thumb {
  width: 25px;
height: 25px;
background: rgb(142, 210, 101);
border-radius: 12.5px;
margin-top: -6.25px;
  -webkit-appearance: none;

}


#speedContain {
width: 80%;
height: 40px;
background-color: #75d679;
border-radius: 20px;
margin-left: 10%;
box-shadow: 1px 1px 4px gray;
}

#currentSpeed {
height: 40px;
width: 100%;
text-align: center;

color: white;
font-weight: 400 !important;
font-family: sans-serif;
font-size: 20px;
}

#numfocus {
  background-color: white;
color: #75d679;
border-radius: 20px;
margin-right: -24%;
padding: 10px;
display: inline-block;
font-size: 20px;
font-weight: 400;
font-family: sans-serif;

}

#cspeed {
      display: inline-block;
      height: 300px;
margin-top: 0px;
margin-left: -10px;
color: white;
font-weight: 400 !important;
font-family: sans-serif;
font-size: 20px;

}



.menuPrompt {
font-size: 18px;
font-family: 'Hammersmith One';
color: #4A4A4A;
flex: 0.2;
text-align: center;
margin-top: 10px;
display: inline-block;

}

#mainSettings {
   width: 400px;
   height: 375px;
overflow-y: scroll;

}

#settingsTitle {
font-size: 32px;
font-family: 'Hammersmith One';
color: #4A4A4A;
width: 100%;
text-align: center;
margin-top: 10px;

}

#rmvMonkey {
   font-size: 16.5px;
   opacity: 0.9;

}



#infoDiv {
  position: absolute;
  left: -25%;
  right: 0%;
  text-align: center;
  background-color: rgba(252, 252, 252, 0.5);
  display: inline-block;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08), 0 2px 10px 0 rgba(0, 0, 0, 0.06);

}

#autotitle {
  font-family: sans-serif;
  font-size: 30px;
  font-weight: 200;
}

#arrivalest {
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 200;
}

#timeest {

}

#cancelTrip {
  background-color: rgb(203, 68, 74);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 17px;
  font-family: sans-serif;
  cursor: pointer;
  outline: none;
  font-weight: 300;
  margin-bottom: 18px;
  width: 112px;
  height: 33.6px;

}

#spotDiv {
position: absolute;
width: 10px;
height: 10px;
marginLeft: -5px;
marginTop: -5px;
opacity: 1;
background-color: rgb(203, 68, 74);
left: 0;
right: 0;
border-radius: 5px;
z-index: 1000;

}

@media only screen and (max-width: 765px){
#numfocus {
margin-right: -13%;
}
}

#botText {
color: #5aed57;
font-size: 20px;
font-family: sans-serif;
font-weight: 300;
}

`))
document.head.appendChild(styleItem);

$("#adCard").css({display: "none"});






function healthFunction(t, a) {
  return Math.abs(((t + a/2) % a) - a/2);
}

function encodeSEND(json){
    let OC = msgpack5.encode(json);
    var aAdd =  Array.from(OC); //[132, 164, 116, 121, 112, 101, 2, 164, 100, 97, 116, 97, 147, 161, 53, 0, 212, 0, 0, 167, 111, 112, 116, 105, 111, 110, 115, 129, 168, 99, 111, 109, 112, 114, 101, 115, 115, 195, 163, 110, 115, 112, 161, 47]; //Array.from(OC);
    return new Uint8Array(aAdd).buffer;
}


var previousZone;


function bullHelmet2(status){
    console.info(status);
    var dataTemplate = {"data":[], "options":{"compress":true}, "nsp": "/", "type": 2};
    if (!status.includes("m")){
        if (!status.includes(`a`)){
        dataTemplate["data"] = ["13c", [0, status == "on" ? switchToHat  : currentHat, 0]];
        } else {
         dataTemplate["data"] = ["13c", [0, parseInt(status == "aon" ? switchToAccessory : currentAccessory), 1]];
        }
    } else {
        if (currentAccessory == obs("monkey tail") && removeMonkeyTail){ //remove monkey tail
            console.info("HERE2");
            dataTemplate["data"] = ["13c", [0, status == "mOn" ? obs("monkey tail") : 0, 1]];
        } else {
             console.info("HERE");
             dataTemplate["data"] = ["13c", [0, currentAccessory, 1]];
        }
    }
    console.info(dataTemplate["data"]);
    let encoded = encodeSEND(dataTemplate["data"]);
    return encoded;
}


WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    //console.info(new Uint8Array(m));

    if (targets.every(x=>x==false)){
        for (let elementDiv of document.getElementsByClassName("spotDiv")){
            document.body.removeChild(elementDiv);
        }

    }

    if (!ws){
        document.ws = this;

        ws = this;
        console.info("WS SET");
        socketFound(this);
    }


      if (inInstaProcess){
           this.oldSend(m);
           console.log("here");
           return;
        }
    let x = new Uint8Array(m);
    let y = Array.from(x);
    let j = [146, 161, 50, 145, 203];
    if (y.every((x,i) => j[i]==x)){
       console.log(y);
    }
    this.oldSend(m);

    //console.info(x);
    let x_arr_SSX = Array.from(x);
    //console.log(x_arr_SSX);
    if (x_arr_SSX.length === 6 && autobull){
         if (x_arr_SSX.every( (num, idx) => START_SSWX[idx]==num )){
             console.info("started swing");
             IN_PROCESS = true;
             this.oldSend(bullHelmet2("on"));
             this.oldSend(bullHelmet2("mOff"));
             document.dns(["13c", [0, switchToAccessory, 1]])
         } else if (x_arr_SSX.every( (num, idx) => END_SSWX[idx]==num ) ){
             console.info("ended swing");
             this.oldSend(bullHelmet2("off"));
             this.oldSend(bullHelmet2("mOn"));
             document.dns(["13c", [0, currentAccessory, 1]])
             IN_PROCESS = false;
         }
    }


    /*let usageArray = Array.from(new Uint8Array(m));
    if (usageArray.length == 45){
        if (usageArray[16] == 0 || usageArray[16] == 1) foodInHand = false;
        console.info(`Food in hand: null{foodInHand}`);

    };*/

    let realData = {}
    let realInfo = msgpack5.decode(x);
    if (realInfo[1] instanceof Array){
    realData.data = [realInfo[0], ...realInfo[1]]
    } else {
        realData.data = realInfo
    }
    //console.log(realData)
    //console.info("sent");
    //console.info(realData.data);
     if(realData.data[0]!="2")  {
         console.info("HERE3");
       console.info(realData.data[0])
      console.info(realData.data);
         console.log(x);
    if (realData.data[0]=="3"){
         //console.info(realData.data[1]);
         /*console.info(new Uint8Array(m));
         if(typeof realData.data[1] != "number" && !nval){
             nval = realData.data[1];
             document.n = nval;
             console.info("SET NVAL to");
             console.info(nval);


         }*/
        /*console.info(typeof realData.data[2]);
        console.info(realData.data[2].buffer);
        goodData = realData.data;
        console.info(goodData);
        console.info(["5", 0, nval]);
        document.n = goodData[2];
        document.nval = nval*/
    }
     }
    //console.info(new Date().getTime());
    console.log(realData.data[0]);
    if (realData.data[0]=="s"){
      console.info("user respawned");
       for (var elem of Object.values(allMooMooObjects)){
           console.info(elem);
          elem.style.opacity = 1;
        }
       justDied = false;
    } else if (realData.data[0]=="13c"){
        console.info("In Hat Part");
        console.info(realData);
        console.info(IN_PROCESS);
        console.info(realData.data.length == 4)
        console.info("test");
        if (!IN_PROCESS && realData.data.length == 4 && realData.data[3]==0 &&realData.data[1]==0){
            currentHat = realData.data[2];
            console.info("Changed hat to " + currentHat);

        } else if (!IN_PROCESS && realData.data.length == 4 && realData.data[3]==1 &&realData.data[1]==0){
            currentAccessory = realData.data[2];
            console.info("Changed accessory to " + currentAccessory);
        } else if (realData.data.length == 4 && realData.data[3] == 0 && realData.data[1]==1){
        	let hatID = realData.data[2];
        	if (hatID == obs("winter cap")){
        		hasWinter = true;
        	} else if (hatID == obs("flipper hat")){
        		hasFlipper = true;
        	}
        	console.log("BOUGHT HAT");
        }

    } else if (realData.data[0]=="2"){
      MYANGLE = realData.data[1];
        //console.log("ANGLE");

    } else if (realData.data[0]=="5") {
       //console.info("hai");
        //console.info(new Uint8Array(m));
        //console.info(realData.data);
    }
};


function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

function isElementVisible(e) {
    return (e.offsetParent !== null);
}

function aim(x, y){
     var cvs = document.getElementById("gameCanvas");
     cvs.dispatchEvent(new MouseEvent("mousemove", {
         clientX: x,
         clientY: y

     }));

}


function triggerAlert(name, id){
		hatChangeAlert.innerHTML = generateHatHTML(name, id);
		$("#hatChangeAlert").animate({opacity: 1, top: '20px'});
		setTimeout( () => {
			$("#hatChangeAlert").animate({opacity: 0, top: -300});
		}, 5000);
}



/*
function heal(){
    console.log(hasApple);
    console.log("healing");
    if (recentHealth>=100) return;
    console.info(recentHealth);
    console.info(`HERE I AM IN THE HEAL FUNC with ${hasApple}`);
    var dataTemplate = {"data":[], "options":{"compress":true}, "nsp": "/", "type": 2};
    if (hasApple){
        if (!haveApple()){
            heal();
            return;
        }
        else { //User has apple
            var data2 = dataTemplate;
            data2['data'] = goodData != undefined ? goodData : ["5", [0, null]];
            ws.send(encodeSEND(data2['data']));

        }
    }
    else { //User has cookie
        console.info('user has cookie');
            var data3 = dataTemplate;
            data3['data'] = ["5", [1, null]];
            ws.send(encodeSEND(data3['data']));
    }
    var datasave = dataTemplate;
    dataTemplate["data"]=["c", [1, null]];
    let encoded = encodeSEND(dataTemplate['data']);
    setTimeout( () => {
    ws.send(encoded);
    }, 0);

    datasave["data"]=["c", [0, null]];
    let encodedsave = encodeSEND(datasave['data']);
    setTimeout( () => {
    ws.send(encodedsave);
    }, 100);
    recentHealth += hasApple ? 20 : 40;

}
*/

function handleMessage(m){
    let td = new Uint8Array(m.data);
//      console.info(td);
    //console.info(td);
    //console.info(td.slice(98,-1));
    var infotest = msgpack5.decode(td);
    var info;
    if(infotest.length > 1) {
        info = [infotest[0], ...infotest[1]];
        if (info[1] instanceof Array){
             info = info;
        }
    } else {
        info = infotest;
    }
//    console.log(info);
   //console.info("received");
    //console.info(new Date().getTime());
    if(!info) return;
    //if(!["c","5", "3"].includes(info[0])) console.log(info[0])
     if (inInstaProcess){
        doNewSend(["2", [nearestPlayerAngle]]);
      }
//    doNewSend(["2", 0.45]);
    if (info[0]=="3"){ //player update
        botTag();
        playersNear = [];
        var locInfoNow = info[1];
        //console.log(locInfoNow)
        //console.info(locInfoNow);
        for (var i=0;i<locInfoNow.length/13;i++){
            var playerData = locInfoNow.slice(13*i, 13*i+13);
            if (playerData[0]==MYID){
                myCLAN = playerData[7];
                myPlayer = new player(playerData[0], playerData[1], playerData[2], playerData[7]);
                if (myPlayer.y < 2400 && hasWinter){
                	if (previousZone != "winter"){
                		previousZone = "winter";
                		IN_PROCESS = true;
                		document.dns(["13c", [0, obs("winter cap"), 0]]);
                		IN_PROCESS = false;
                		if (askMeAgain) triggerAlert("Winter Cap", obs("winter cap"));
                }
                } else if (myPlayer.y > 6850 && myPlayer.y < 7550 && hasFlipper){
                	if (previousZone != "river"){
                		previousZone = "river";
                		IN_PROCESS = true;
                  		document.dns(["13c", [0, obs("flipper hat") , 0]]);
                  		IN_PROCESS = false;
                	   if (askMeAgain) triggerAlert("Flipper Hat", obs("flipper hat"));
               }
                } else {
                	if (previousZone != "normal"){
                	previousZone = "normal";
                	$("#hatChangeAlert").animate({opacity: 0, top: -300});
                    if (askMeAgain) document.dns(["13c", [0, currentHat, 0]]);

                }
                }
                if (!targets.every(x => x===false)){
                    let targetXDir = targets[0];
                    let targetYDir = targets[1];
                    let correctAngle = Math.atan2(targetYDir-myPlayer.y, targetXDir-myPlayer.x);
                    document.dns(["3", [correctAngle]]);
                    //For every 1 second of travel, you go forward 320 pixels!
                    let totalDist = Math.sqrt( (targetXDir-myPlayer.x)**2  + (targetYDir-myPlayer.y)**2 );
                    let totalTime = Math.ceil(totalDist/319.2);
                    document.getElementById("timeest").innerHTML = `${totalTime} seconds...`

                    if (totalDist < 100){
                     targets = [false, false];
                     document.dns(["3", [null]]);
                     $("#infoDiv").animate({opacity: 0});
                    }

                }
                continue
            }
            if (playerData[7]===null || playerData[7] != myCLAN){
                 var locPlayer = new player(playerData[0], playerData[1], playerData[2], playerData[7]);
                 playersNear.push(locPlayer);
            }

        }
         var nearestPlayerPosition = playersNear.sort( (a,b) => pdist(a, myPlayer) - pdist(b, myPlayer) );
           var nearestPlayer = nearestPlayerPosition[0];
           if (nearestPlayer){
               nearestPlayerAngle = Math.atan2( nearestPlayer.y-myPlayer.y, nearestPlayer.x-myPlayer.x);
               if (autoattack){
               doNewSend(["3", [nearestPlayerAngle]]);
               aim(nearestPlayer.x-myPlayer.x+window.innerWidth/2, nearestPlayer.y-myPlayer.y+window.innerHeight/2);

               $("#tbtn").css({opacity: 1, marginLeft: nearestPlayer.x-myPlayer.x+window.innerWidth/2-20, marginTop: nearestPlayer.y-myPlayer.y+window.innerHeight/2-20});
               } else {

                   //$("#tbtn").animate({opacity: 0.5});
               }
           } else {
             // $("#tbtn").animate({opacity: 0.5});
           }

    }

   if (info[0]=="6"){
        var locInfo = info[1];
        if (locInfo[locInfo.length-1].toString() == MYID){ //Object created
        if (window.innerWidth >= 770){
            console.log(locInfo);
            var itemID = `actionBarItem${locInfo[locInfo.length-2]+16}`;
            var imgURL = document.getElementById(itemID).style.backgroundImage.toString().match(/url\("(.+)?(?=")/)[1];
            console.info(imgURL);
            let mapDisplay = document.getElementById("mapDisplay").getBoundingClientRect();
            let mapSize = [14365, 14365];
            let boxSize = [$("#mapDisplay").width(), $("#mapDisplay").height()];
            let targets = [locInfo[1], locInfo[2]].map(item => (130*item)/14365);
            let x = mapDisplay.x + targets[0] - 6;
            let y = mapDisplay.y + targets[1] - 6;
            let newTarget = document.createElement("div");
            newTarget.rawX = targets[0];
            newTarget.rawY = targets[1];
            newTarget.rimgURL = imgURL;
            newTarget.style = `background-image: url("${imgURL}"); background-size: 12px 12px; width:12px; height:12px; position:absolute; left: ${x}px; top:${y}px; opacity:0; z-index:100; cursor: pointer;`;
            newTarget.className = "mapTarget";
            document.getElementsByTagName("body")[0].appendChild(newTarget);
            $(newTarget).animate({opacity: 1});
            allMooMooObjects[locInfo[0]] = newTarget;

        }
    }
    }

    if (info[0]=="12"){
       if (Object.keys(allMooMooObjects).includes(info[1].toString())){
            allMooMooObjects[info[1]].remove();
      }
    }

//    console.info("-------------")
    if (info[0] == "1" && !MYID){
        MYID =  info[1];
    }


    if (info[0] == "18" && info[4]=="1200") {
        console.info(info);
      bowWorked = true;
    }

    if (info[0] == "10" && info[1] == MYID && autoheal){
          console.info("doing stuff");
        console.info(info);
        if (info[2] < 100 && info[2] > 0){
       recentHealth = info[2];
       console.info("RECEIVED:");
        console.info(info);
        //recentHealth += hasApple ? 20 : 40;
       console.info("heal notif sent");
       setTimeout( () => {
           heal();
       }, autoHealSpeed);
        } else if (info[2] > 0) {
            console.info("done healing");
            recentHealth = 100;
            if (foodInHand){
               console.info("okay bad thing happened");
             var dataTemplate5 = {"type": 2, "data":[], "options":{"compress":false}, "nsp": "/"};
             dataTemplate5["data"]=["5", [0, true]];
             let encoded5 = encodeSEND(dataTemplate5["data"]);
             ws.send(encoded5);
                console.info("corrected bad thing");
            }

        } else {
            hasApple = true; //You've died tragically in combat; back to the apple for you!
            console.info("Setting has apple to true from here");
        }
    }
    else if(info[0] == "11"){
        console.info("doing death");
        for (var elem of Object.values(allMooMooObjects)){
           console.info(elem);
          elem.style.opacity = 0;
        }
        hasApple = true;
        justDied = true;
        recentHealth = 100;

    }

}

function pdist(player1, player2){
      return Math.sqrt( Math.pow((player2.y-player1.y), 2) + Math.pow((player2.x-player1.x), 2) );
}

function haveApple(){
    console.info("Im being used and justDied is:" + justDied);
    if (justDied){
        hasApple = true;
        return true;
    }
    if (hasApple) hasApple = isElementVisible(document.getElementById("actionBarItem16"));
    return hasApple;
}

function havePoison(){
    let hasPoison = true;
    if (hasPoison) hasPoison = isElementVisible(document.getElementById("actionBarItem24"));
    return hasPoison;
}

/*$(window).resize( () => {
     for (var elem of Object.values(allMooMooObjects)){
        let mapDisplay = document.getElementById("mapDisplay").getBoundingClientRect();
            let mapSize = [14365, 14365];
            let boxSize = [$("#mapDisplay").width(), $("#mapDisplay").height()];
            let x = mapDisplay.x + parseInt(elem.rawX) - 6;
            let y = mapDisplay.y + parseInt(elem.rawY) - 6;
            console.log(x, y);
            elem.style = `background-image: url("${elem.rimgURL}"); background-size: 12px 12px; width:12px; height:12px; position:absolute; left: ${x}px; top:${y}px; opacity:0; z-index:100; cursor: pointer;`;
     }
});*/

function haveGreat(){
    let hasGreat = true;
    if (hasGreat) hasGreat = isElementVisible(document.getElementById("actionBarItem23"));
    return hasGreat;
}

function haveSpinning(){
    let hasSpinning = true;
    if (hasSpinning) hasSpinning = isElementVisible(document.getElementById("actionBarItem25"));
    return hasSpinning;
}

function doNewSend(sender){
    ws.send(encodeSEND(sender));
}

function placeSpike(item){
  ws.send(encodeSEND( ["5", [item, null]]));
  ws.send(encodeSEND([
  "c",
  [
    1,
    null
  ]
]));

  ws.send(encodeSEND([
  "c",
  [
    0,
    null
  ]
])); //spike function by
}

$("#mapDisplay").on("click", (event) => {
    if (!targets.every(x=>x===false)) return;

     $("#spotDiv").css({zIndex: 10000});
    var xpos = event.pageX - $("#mapDisplay").offset().left;
    var ypos = event.pageY - $("#mapDisplay").offset().top;
    var mapWidth = $("#mapDisplay").width();
    var mapHeight = $("#mapDisplay").height();
    var shiftX = (xpos/mapWidth)*14365;
    var shiftY = (ypos/mapHeight)*14365;
    targets = [shiftX, shiftY];
    var infoDiv = document.createElement("div");
    infoDiv.innerHTML = `<h1 id="autotitle">You are currently in CloudyMod auto-pilot.</h1>
     <h3 id="arrivalest">You will arrive in <span id="timeest">30 seconds...</span></h3>

     <button type="button" id="cancelTrip">Cancel</button>`;
    infoDiv.id = "infoDiv";
    document.body.prepend(infoDiv);

   let spotDiv = document.createElement("div");
   spotDiv.id = "spotDiv";
   spotDiv.className = "spotDiv";
   document.body.prepend(spotDiv);
   $("#spotDiv").css({left: event.pageX, top: event.pageY});
   $("#spotDiv").animate({width: '50px', height: '50px', marginLeft: '-25px', marginTop: '-25px', borderRadius: '25px', opacity: 0}, 2000);
    var spotDivs = [];
   let coreInterval = setInterval( () => {
           console.log('looping');
           if (targets.every(x=>x===false)){
             clearInterval(coreInterval);
               console.log('clearing');
             for (let elementDiv of document.getElementsByClassName("spotDiv")){
                   document.body.removeChild(elementDiv);
             }

           } else {
           let spotDiv = document.createElement("div");
           spotDiv.id = "spotDiv";
               spotDiv.className = "spotDiv";
           document.body.prepend(spotDiv);
           $("#spotDiv").css({left: event.pageX, top: event.pageY});
           $("#spotDiv").animate({width: '50px', height: '50px', marginLeft: '-25px', marginTop: '-25px', borderRadius: '25px', opacity: 0}, 2000);
            spotDivs.push(spotDiv);
           }
    }, 700);

})

document.dns = doNewSend;


function botTag(){
  if (!botSpan || !isElementVisible(botSpan)){
            botSpan = document.createElement("span");
            botSpan.id = "botText";
            var ageDiv = document.getElementById("ageText");
             ageDiv.prepend(botSpan);
          }

          if (autoattack){
             botSpan.innerHTML = "BOT "
             console.log(botSpan);
              console.log(botSpan.id)
              console.log(botSpan.innerHTML)
          } else {
             $("#tbtn").animate({opacity: 0});
             botSpan.innerHTML = "";
          }
}

$(document).on("click", "#cancelTrip", () => {
           targets = [false, false];
           document.dns(["3", [null]]);
           $("#infoDiv").animate({opacity: 0});
})

document.title="CloudyMod: Autoheal ON"

document.addEventListener('keypress', (e)=>{

   if (e.keyCode == 116 && document.activeElement.id.toLowerCase() !== 'chatbox'){
       STATE+=1;
       let coreIndex = STATE%2; //STATE%4;
       //let truthArray = [ [1,2].includes(coreIndex), [0,1].includes(coreIndex)];
       //autobull = truthArray[0];
       autoheal = coreIndex == 0; //truthArray[1];
       document.title = document.title=`CloudyMod: Autoheal ${autoheal ? "ON" : "OFF"}` //"Heal " + (autoheal ? "ON" : "OFF") + " / Bull Hat " + (autobull ? "ON" : "OFF");
   } else if (e.keyCode == trapKey && document.activeElement.id.toLowerCase() !== 'chatbox') { //Place a trap
       console.log("UH OH")
        var dataTemplate = {"data":[], "options":{"compress":true}, "nsp": "/", "type": 2};
        var data50 = dataTemplate;
        data50["data"]=["5", [15, 0]];
        ws.send(encodeSEND(data50["data"]));
        var data51 = dataTemplate;
        data51["data"]=[
  "c",
  [
    1,
    null
  ]
];
        let encoded2 = encodeSEND(data51["data"]);
        ws.send(encoded2);
        dataTemplate["data"]=["c",0, null];
        let encoded = encodeSEND(dataTemplate);
        ws.send(encoded);

      } else if (e.keyCode == 112 && document.activeElement.id.toLowerCase() !== 'chatbox'){
         autoattack = !autoattack
         botTag();

    } else if (e.keyCode == spikeKey && document.activeElement.id.toLowerCase() !== 'chatbox') { //Place a spike
           if (havePoison()) {
             placeSpike(8);
           } else if (haveGreat()){
             placeSpike(7);
           } else if (haveSpinning()){
             placeSpike(9);
           } else {
             placeSpike(6);
         }

   } else if (e.keyCode == instaKillKey && document.activeElement.id.toLowerCase() !== 'chatbox') {
       console.info(currentAccessory);
       var ctime = new Date().getTime();
       console.info(inInstaProcess)
       if (!inInstaProcess){
       console.info("got in");
       inInstaProcess = true
        IN_PROCESS = true;

       doNewSend(["13c", [0, bullHelm, 0]]);
          if (currentAccessory == monkeyTail){
               doNewSend(["13c", [0, 0, 1]]);
           }
       doNewSend(["5", [switchToWep, true]]);
       console.info("Starting at 0");

      //after bad


       setTimeout( () => {
           doNewSend(["2", [nearestPlayerAngle]]);
           doNewSend([
  "c",
  [
    1,
    null
  ]
]); //If we're perfect, we only send this once
           console.info(`Sending swing at ${new Date().getTime() - ctime}`);
           ctime = new Date().getTime();
       }, 20);



       setTimeout( () => {
           doNewSend(["2", [nearestPlayerAngle]]);
           doNewSend(["5", [switchToRange, true]]);
           console.info(`Changed weapon at ${new Date().getTime() - ctime}`);
           ctime = new Date().getTime();
       }, document.timeTween); //120-140?




       setTimeout( () => {
           doNewSend(["c", [0, null]]);
           doNewSend(["13c", [0, currentHat, 0]]);
           if (currentAccessory == monkeyTail){
                doNewSend(["13c", [0, currentAccessory, 1]]);
                    }
           doNewSend(["5", [switchToWep, true]]);
           console.info(`Finished at  ${new Date().getTime() - ctime}`);
           ctime = new Date().getTime();
       }, 600);

        setTimeout( () => {
          if (bowWorked){
          doNewSend(["5", [switchToRange, true]]);
        }
       }, 730);

        setTimeout( () => {
          if (bowWorked){
          doNewSend([
  "c",
  [
    1,
    null
  ]
]);
        }
       }, 840);

      setTimeout( () => {
           if (bowWorked){
          doNewSend(["c", [0, null]]);
        }
       }, 950);

      setTimeout( () => {
          inInstaProcess = false;
          if (bowWorked){
         doNewSend(["5",  [switchToWep, true]]);
              setTimeout( () => {
         doNewSend(["c", [0, null]]);
              }, 300);
         bowWorked = false;
         IN_PROCESS = false;
       }
        IN_PROCESS = false;
       }, 1060);

    //if it worked, fire, if it didn't dont fire
       }

//IT WORKS ON AND OFF
//    WTF ??!?p!?

   } else if (document.activeElement.id.toLowerCase() !== 'chatbox' ){
       if (e.keyCode == 108){ //use pressed "l"; spikes
           let spikeVal;
           if (havePoison()) {
             spikeVal = 8;
           } else if (haveGreat()){
             spikeVal = 7;
           } else if (haveSpinning()){
             spikeVal = 9;
           } else {
             spikeVal = 6;
         }

         for (var i=0;i<4;i++){
             let angle = (Math.PI/2)*i;
             /*let x = Math.cos(angle)*50;
             let y = Math.sin(angle)*50;
             console.log(x, y);
             aim(x, y);*/
             document.dns(["2", [angle]]);
             placeSpike(spikeVal);

         }


       } else if (e.keyCode == 111){ //user pressed "i"; traps
           for (var j=0;j<4;j++){
              document.dns(["2", [(Math.PI/2)*j]]);
              document.dns(["5", [15, 0]]);
              document.dns(["c", [1, null]]);
              document.dns(["c", [0, null]]);
           }
           
       }
  }
});