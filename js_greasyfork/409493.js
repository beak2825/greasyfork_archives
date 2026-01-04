// ==UserScript==
// @name        HatLIfo0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       NoOBody
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409493/HatLIfo0.user.js
// @updateURL https://update.greasyfork.org/scripts/409493/HatLIfo0.meta.js
// ==/UserScript==
window.hats = {'hats':[{
       id: 45,
       name: "Shame!",
       dontSell: !0,
       price: 0,
       scale: 120,
       desc: "hacks are for losers"
   }, {
       id: 51,
       name: "Moo_Cap",
       price: 0,
       scale: 120,
       desc: "coolest mooer around"
   }, {
       id: 50,
       name: "Apple_Cap",
       price: 0,
       scale: 120,
       desc: "apple farms remembers"
   }, {
       id: 28,
       name: "Moo_Head",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 29,
       name: "Pig_Head",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 30,
       name: "Fluff_Head",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 36,
       name: "Pandou_Head",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 37,
       name: "Bear_Head",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 38,
       name: "Monkey_Head",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 44,
       name: "Polar_Head",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 35,
       name: "Fez_Hat",
       price: 0,
       scale: 120,
       desc: "no effect"
   }, {
       id: 42,
       name: "Enigma_Hat",
       price: 0,
       scale: 120,
       desc: "join the enigma army"
   }, {
       id: 43,
       name: "Blitz_Hat",
       price: 0,
       scale: 120,
       desc: "hey everybody i'm blitz"
   }, {
       id: 49,
       name: "Bob_XIII_Hat",
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
       name: "Bummle_Hat",
       price: 100,
       scale: 120,
       desc: "no effect"
   }, {
       id: 2,
       name: "Straw_Hat",
       price: 500,
       scale: 120,
       desc: "no effect"
   }, {
       id: 15,
       name: "Winter_Cap",
       price: 600,
       scale: 120,
       desc: "allows you to move at normal speed in snow",
       coldM: 1
   }, {
       id: 5,
       name: "Cowboy_Hat",
       price: 1e3,
       scale: 120,
       desc: "no effect"
   }, {
       id: 4,
       name: "Ranger_Hat",
       price: 2e3,
       scale: 120,
       desc: "no effect"
   }, {
       id: 18,
       name: "Explorer_Hat",
       price: 2e3,
       scale: 120,
       desc: "no effect"
   }, {
       id: 31,
       name: "Flipper_Hat",
       price: 2500,
       scale: 120,
       desc: "have more control while in water",
       watrImm: !0
   }, {
       id: 1,
       name: "Marksman_Cap",
       price: 3e3,
       scale: 120,
       desc: "increases arrow speed and range",
       aMlt: 1.3
   }, {
       id: 10,
       name: "Bush_Gear",
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
       name: "Soldier_Helmet",
       price: 4e3,
       scale: 120,
       desc: "reduces damage taken but slows movement",
       spdMult: .94,
       dmgMult: .75
   }, {
       id: 23,
       name: "Anti_Venom_Gear",
       price: 4e3,
       scale: 120,
       desc: "makes you immune to poison",
       poisonRes: 1
   }, {
       id: 13,
       name: "Medic_Gear",
       price: 5e3,
       scale: 110,
       desc: "slowly regenerates health over time",
       healthRegen: 3
   }, {
       id: 9,
       name: "Miners_Helmet",
       price: 5e3,
       scale: 120,
       desc: "earn 1 extra gold per resource",
       extraGold: 1
   }, {
       id: 32,
       name: "Musketeer_Hat",
       price: 5e3,
       scale: 120,
       desc: "reduces cost of projectiles",
       projCost: .5
   }, {
       id: 7,
       name: "Bull_Helmet",
       price: 6e3,
       scale: 120,
       desc: "increases damage done but drains health",
       healthRegen: -5,
       dmgMultO: 1.5,
       spdMult: .96
   }, {
       id: 22,
       name: "Emp_Helmet",
       price: 6e3,
       scale: 120,
       desc: "turrets won't attack but you move slower",
       antiTurret: 1,
       spdMult: .7
   }, {
       id: 12,
       name: "Booster_Hat",
       price: 6e3,
       scale: 120,
       desc: "increases your movement speed",
       spdMult: 1.16
   }, {
       id: 26,
       name: "Barbarian_Armor",
       price: 8e3,
       scale: 120,
       desc: "knocks back enemies that attack you",
       dmgK: .6
   }, {
       id: 21,
       name: "Plague_Mask",
       price: 1e4,
       scale: 120,
       desc: "melee attacks deal poison damage",
       poisonDmg: 5,
       poisonTime: 6
   }, {
       id: 46,
       name: "Bull_Mask",
       price: 1e4,
       scale: 120,
       desc: "bulls won't target you unless you attack them",
       bullRepel: 1
   }, {
       id: 14,
       name: "Windmill_Hat",
       topSprite: !0,
       price: 1e4,
       scale: 120,
       desc: "generates points while worn",
       pps: 1.5
   }, {
       id: 11,
       name: "Spike_Gear",
       topSprite: !0,
       price: 1e4,
       scale: 120,
       desc: "deal damage to players that damage you",
       dmg: .45
   }, {
       id: 53,
       name: "Turret_Gear",
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
       name: "Samurai_Armor",
       price: 12e3,
       scale: 120,
       desc: "increased attack speed and fire rate",
       atkSpd: .78
   }, {
       id: 58,
       name: "Dark_Knight",
       price: 12e3,
       scale: 120,
       desc: "restores health when you deal damage",
       healD: .4
   }, {
       id: 27,
       name: "Scavenger_Gear",
       price: 15e3,
       scale: 120,
       desc: "earn double points for each kill",
       kScrM: 2
   }, {
       id: 40,
       name: "Tank_Gear",
       price: 15e3,
       scale: 120,
       desc: "increased damage to buildings but slower movement",
       spdMult: .3,
       bDmg: 3.3
   }, {
       id: 52,
       name: "Thief_Gear",
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
       name: "Assassin_Gear",
       price: 2e4,
       scale: 120,
       desc: "Go invisible when not moving. Can't eat. Increased speed",
       noEat: !0,
       spdMult: 1.1,
       invisTimer: 1e3
   }]}
