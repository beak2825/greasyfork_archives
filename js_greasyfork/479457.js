var hats = [{
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
        id: 57,
        name: "Pumpkin",
        price: 50,
        scale: 120,
        desc: "Spooooky"
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
        spdMult: .7
    }, {
        id: 20,
        name: "Samurai Armor",
        price: 12e3,
        scale: 120,
        desc: "increased attack speed and fire rate",
        atkSpd: .78
    }, {
        id: 58,
        name: "Dark Knight",
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
    }, {
        id: 55,
        name: "Bloodthirster",
        price: 2e4,
        scale: 120,
        desc: "Restore Health when dealing damage. And increased damage",
        healD: .25,
        dmgMultO: 1.2
    }, {
        id: 56,
        name: "Assassin Gear",
        price: 2e4,
        scale: 120,
        desc: "Go invisible when not moving. Can't eat. Increased speed",
        noEat: !0,
        spdMult: 1.1,
        invisTimer: 1e3
    }];
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
    }];
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