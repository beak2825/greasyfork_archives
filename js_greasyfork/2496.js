// ==UserScript==
// @name           BvS Jutsu Success Probability
// @namespace      TheSpy
// @description    Odds of Jutsu success in missions and quests
// @version        1.11
// @history        1.11 Now GM4 compatible (Updated by Takumi)
// @history        1.10 Now https compatible (Updated by Channel28)
// @history        1.09 Added grant permissions (Updated by Channel28)
// @history        1.08 Added Spiral Subroutine 1.1/1.2/1.3 (credits: Conster)
// @history        1.07 Fixed a bug with rolling challenge missions (credits: Charl)
// @history        1.06 Fixed a bug with rolling challenge missions (credits: North)
// @history        1.05 Added a hotkey to toggle "save height" on or off (hotkey: T)
// @history        1.04 Added a few missing jutsus (again), changed updating
// @history        1.03 Added a few missing jutsus, added jutsu ID display
// @history        1.02 Replace regual expressions with a static jutsu 'table'
// @history        1.01 Initial release
// @include        http*://*animecubed.com/billy/bvs/*mission*
// @include        http*://*animecubed.com/billy/bvs/*quests*
// @include        http*://*animecubed.com/billy/bvs/*questattempt*
// @include        http*://*animecubedgaming.com/billy/bvs/*mission*
// @include        http*://*animecubedgaming.com/billy/bvs/*quests*
// @include        http*://*animecubedgaming.com/billy/bvs/*questattempt*
// @downloadURL https://update.greasyfork.org/scripts/2496/BvS%20Jutsu%20Success%20Probability.user.js
// @updateURL https://update.greasyfork.org/scripts/2496/BvS%20Jutsu%20Success%20Probability.meta.js
// ==/UserScript==

// append style
// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = "font.gen {color: rgb(0%, 33%, 0%); font-weight: bold;} font.nin {color: rgb(33%, 0%, 0%); font-weight: bold;} font.tai {color: rgb(0%, 0%, 33%); font-weight: bold;} font.dou {color: rgb(33%, 33%, 0%); font-weight: bold;}";
document.getElementsByTagName('head')[0].appendChild(style);

// current URL
var workingURL = location.href;

// bonusAbility
function bonusAbility(a1, a2, a3, a4)
{
	this.lvl = a1;
	this.str = a2;
	this.rng = a3;
	this.suc = a4;
}

// bonusNinja
function bonusNinja(g1, g2, g3, g4, n1, n2, n3, n4, t1, t2, t3, t4, d1, d2, d3, d4)
{
	this.gen = new bonusAbility(g1, g2, g3, g4);
	this.nin = new bonusAbility(n1, n2, n3, n4);
	this.tai = new bonusAbility(t1, t2, t3, t4);
	this.dou = new bonusAbility(d1, d2, d3, d4);
}

// no strength in wasteland
var noStr = false;

// jutsu database
var jutsuData = {
	// None
	0: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Clone Jutsu
	368: new bonusNinja(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
	// Rich Man's World
	369: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Disguise Jutsu
	370: new bonusNinja(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Exploding Tags: Activate
	371: new bonusNinja(0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Projectile Weapons: Shuriken
	372: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
	// Projectile Weapons: Kunai
	373: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0),
	// Escape Jutsu
	374: new bonusNinja(-999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999, -999),
	// Sexy Jutsu
	375: new bonusNinja(2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Fire Style: Fireball Jutsu
	376: new bonusNinja(0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Human Juggernaut
	377: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0),
	// Puppet: Salamander
	378: new bonusNinja(2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Puppet: Crow
	379: new bonusNinja(0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Puppet: Black Ant
	380: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0),
	// Dust Wind Technique
	381: new bonusNinja(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Wind Release: Severing Pressure
	382: new bonusNinja(0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Great Wind Scythe Jutsu
	383: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
	// Shadow Shuriken Technique
	384: new bonusNinja(3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Blizzard Jutsu
	385: new bonusNinja(0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Twin Rising Dragons
	386: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
	// Windmill Triple Attack
	387: new bonusNinja(3, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0),
	// All Fours Jutsu
	388: new bonusNinja(-1, 0, 0, 0, 3, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0),
	// Leaf Hurricane
	389: new bonusNinja(-1, 0, 0, 0, -1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
	// Shadow Imitation Technique
	390: new bonusNinja(0, 1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0),
	// Fire Style: Phoenix Flower Jutsu
	391: new bonusNinja(0, -1, 0, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0),
	// Primary Lotus
	392: new bonusNinja(0, -1, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
	// Mind Body Switch Technique
	393: new bonusNinja(0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Piercing Fang
	394: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0),
	// Leaf Whirlwind
	395: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0),
	// Shadow Clone Jutsu
	396: new bonusNinja(2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0),
	// Eight Trigrams Whirlwind
	397: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0),
	// Gentle Fist
	398: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0),
	// Water Style: Giant Vortex Jutsu
	399: new bonusNinja(0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Wind Scythe Jutsu
	400: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0),
	// Killer Kancho
	401: new bonusNinja(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	// Earth Style: Groundhog Technique Decapitation
	402: new bonusNinja(0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
	// Demonic Illusion: Tree Bind Death
	403: new bonusNinja(4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Water Style: Water Dragon Missile
	404: new bonusNinja(0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Human Needle Boulder
	405: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0),
	// Welcome to Good Burger
	406: new bonusNinja(0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0),
	// Thousand Flying Water Needles of Death
	407: new bonusNinja(0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Fire Style: Dragon Flame Jutsu
	408: new bonusNinja(0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Hidden Lotus
	409: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0),
	// Multiple Shadow Clone Jutsu
	410: new bonusNinja(3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
	// Fire Release: Ash Product Burning
	411: new bonusNinja(3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0),
	// Water Clone Technique
	412: new bonusNinja(0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0),
	// Water Prison Technique
	413: new bonusNinja(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	// Prepared Needle Shot
	414: new bonusNinja(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	// Twin Snake Sacrifice Jutsu
	415: new bonusNinja(0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0),
	// Pinky Style: Pervert-Destroying Punch
	416: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0),
	// Eight Trigrams One Million Palms
	417: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0),
	// Stalker Style: Freaking Laser Beams
	418: new bonusNinja(2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0),
	// Flock of Seagulls
	419: new bonusNinja(0, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0),
	// Can of Whoopass
	420: new bonusNinja(2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0),
	// Epic Dog Urination Technique
	421: new bonusNinja(-2, -2, 0, 0, -2, -2, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0),
	// Morning Peacock
	422: new bonusNinja(5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Ninja Art: Poison Fog
	423: new bonusNinja(0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Flying Swallow
	424: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0),
	// Dark Swamp
	425: new bonusNinja(0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Bring Down the House Jutsu
	426: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0),
	// Ninja Art: Needle Demon
	427: new bonusNinja(0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Super Heel Drop
	428: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0),
	// Attack on the Nervous System
	429: new bonusNinja(0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0),
	// Dance of the Crescent Moon
	430: new bonusNinja(0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Get In My Belly
	431: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0),
	// Crunk Fu
	432: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0),
	// Hidden Mouth Needles
	433: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0),
	// Shadow Strangulation
	434: new bonusNinja(0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Mind Destruction
	435: new bonusNinja(2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Great Expansion
	436: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0),
	// Striking Snake Technique
	437: new bonusNinja(8, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0),
	// The Gates
	438: new bonusNinja(0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 0, 0, 0),
	// Second Face Jutsu
	439: new bonusNinja(0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Eight Trigrams Eleventy Billion Palms
	440: new bonusNinja(0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0),
	// Emosuke Style: Helping Hands
	441: new bonusNinja(0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0),
	// Emosuke Style: Right in the Eye
	442: new bonusNinja(0, 0, 3, 1, 0, 0, 3, 1, 0, 0, 3, 1, 0, 0, 0, 0),
	// Billy Style: Earth, Wind, and Fire
	443: new bonusNinja(0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 0),
	// Billy Style: This is Sparta
	444: new bonusNinja(0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0),
	// The Shocker
	445: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0),
	// Kaleidoscope Eye
	446: new bonusNinja(0, 0, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Ninja Art: Hottie Regeneration
	447: new bonusNinja(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
	// Flying Thunder God Technique
	448: new bonusNinja(999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999),
	// Kido: Slayer
	449: new bonusNinja(0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0),
	// Kido: Iron Maiden
	450: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0),
	// Kido: Metalocalypse
	451: new bonusNinja(0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Robogirl Style: Leek Spin
	452: new bonusNinja(4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Sense Weakness
	453: new bonusNinja(0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Lucha Libre Style: Back Brain Kick
	454: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0),
	// Archer Style: Blind Guardian
	455: new bonusNinja(0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Archer Style: Kamelot
	456: new bonusNinja(0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Archer Style: Dragonforce
	457: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0),
	// Archer Style: Fire and Flames
	458: new bonusNinja(0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Cry of the Brave
	459: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 10, -4, 0, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Fury of the Storm
	460: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, -8, 0, 0, 5, 0, 0, 0, 0),
	// Kido: Nightfall
	461: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 10, 0, 0, 0, 0, 0),
	// Emosuke Style: Get In The Bucket
	462: new bonusNinja(0, 10, 10, 0, 0, 10, 10, 0, 0, 10, 10, 0, 0, 0, 0, 0),
	// The Ninja-Mas Spirit
	463: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Grim Prediction
	464: new bonusNinja(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
	// Dark Consolidation
	465: new bonusNinja(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
	// Obsessive Insight
	466: new bonusNinja(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
	// Coup de Grace
	467: new bonusNinja(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
	// Saving Grace
	468: new bonusNinja(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0),
	// This Hand of Mine
	469: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// The Thrill of Victory
	470: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// The Agony of Defeat
	471: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Turn the Page
	472: new bonusNinja(0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0),
	// Running Man
	473: new bonusNinja(0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0),
	// Perfect Girl Evolution: Goth Goth
	474: new bonusNinja(0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0),
	// Perfect Girl Evolution: Loli Loli
	475: new bonusNinja(0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0),
	// Kido: Harder Better
	476: new bonusNinja(0, 3, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Lucha Libre Style: Faster Stronger
	477: new bonusNinja(0, 0, 0, 0, 0, 3, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Have a Nice Day
	478: new bonusNinja(-15, -5, 15, 0, -15, -5, 15, 0, -15, -5, 15, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Can't Touch This
	479: new bonusNinja(4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Imperishable Night
	480: new bonusNinja(8, 2, 0, 0, 8, 2, 0, 0, 8, 2, 0, 0, 0, 0, 0, 0),
	// Lucha Libre Style: Pity the Fool
	481: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Blood Ocean
	482: new bonusNinja(0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0),
	// Soul Reaper Style: Ice Ice Baby
	483: new bonusNinja(0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0),
	// Kido: I Can Has Cheezburger
	484: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Diagnosis
	485: new bonusNinja(0, -5, 0, 0, 0, -5, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0),
	// Inner Monologue
	486: new bonusNinja(0, -3, 3, 0, 0, -3, 3, 0, 0, -3, 3, 0, 0, 0, 0, 0),
	// Rock On: Baby Got Back
	487: new bonusNinja(0, -5, 0, 0, 0, -5, 0, 0, 0, -5, 5, 0, 0, 0, 0, 0),
	// Rock On: Wide Load
	488: new bonusNinja(0, -5, 0, 0, 0, -5, 0, 0, 0, -5, 0, 5, 0, 0, 0, 0),
	// Rock On: Band Camp
	489: new bonusNinja(0, -5, 5, 0, 0, -5, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0),
	// Rock On: Mouth Organ
	490: new bonusNinja(0, -5, 0, 5, 0, -5, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0),
	// Rock On: Double Mint
	491: new bonusNinja(3, -5, 0, 0, 3, -5, 0, 0, 3, -5, 0, 0, 0, 0, 0, 0),
	// Rock On: Double Trouble
	492: new bonusNinja(6, -5, 0, 0, 6, -5, 0, 0, 6, -5, 0, 0, 0, 0, 0, 0),
	// Rock On: Spider Man
	493: new bonusNinja(0, -5, 0, 0, 0, -5, 5, 0, 0, -5, 0, 0, 0, 0, 0, 0),
	// Rock On: Webslinger
	494: new bonusNinja(0, -5, 0, 0, 0, -5, 0, 5, 0, -5, 0, 0, 0, 0, 0, 0),
	// Rock On: Spinal Tap
	495: new bonusNinja(0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0),
	// Sand Coffin
	496: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// I Need This
	497: new bonusNinja(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0),
	// Value Meal
	498: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0),
	// Soul Reaper Style: <insert call>, <insert name>
	499: new bonusNinja(-2, 0, 0, 2, -2, 0, 0, 2, -2, 0, 0, 2, 0, 0, 0, 0),
	// Advanced RedEye
	500: new bonusNinja(0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
	// Advanced WhiteEye
	501: new bonusNinja(2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0),
	// RedEye
	502: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// WhiteEye
	503: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Kitsune Bakudan
	504: new bonusNinja(0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Delivery Art: Stuffed Crust
	505: new bonusNinja(0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0),
	// Delivery Art: 30 Minutes or Less
	506: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0),
	// Delivery Art: Deep Dish
	507: new bonusNinja(5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0),
	// Delivery Art: Better Ingredients
	508: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Delivery Art: Pizza Pizza
	509: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0),
	// FIGHTO Article 1: King of Hearts
	511: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// This Fist of Mine
	513: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0),
	// FIGHTO Article 2: Jack of Diamonds
	515: new bonusNinja(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	// Spiral Subroutine 1.1
	517: new bonusNinja(0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0),
	// Spiral Subroutine 1.2
	518: new bonusNinja(0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0),
	// Spiral Subroutine 1.3
	519: new bonusNinja(10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0),
};

// store bonuses
var bonuses = new Array();

// jutsu types
var jutsuTypes = {
	gen: "Genjutsu",
	nin: "Ninjutsu",
	tai: "Taijutsu",
	dou: "Doujutsu",
};

// ability
function Ability()
{
	this.lvl = 0;
	this.str = 0;
	this.rng = 0;
	this.suc = 0;
}

// ninja
function Ninja()
{
	this.gen = new Ability();
	this.nin = new Ability();
	this.tai = new Ability();
	this.dou = new Ability();
}

// challenge
function Challenge()
{
	this.dif = 0;
	this.suc = 0;
}

// mission
function Mission()
{
	this.gen = new Challenge();
	this.nin = new Challenge();
	this.tai = new Challenge();
	this.dou = new Challenge();
	this.order = [];
	this.crank = 0;
}

// math stuff below
function binomialCoefficient(n, k)
{
	// n!/[k!(n-k)!]
	if (k > n || k < 0)
		return 0;
	k = Math.max(k, n - k);
	var i = 1;
	var j = k + 1;
	var c = 1;
	// i = 1 ... n-k => (n-k)!
	// j = k+1 ... n => n!/k!
	while (j <= n)
		c *= j++ / i++;
	return c;
}

function binomdist(k, n, p, cumulative)
{
	// cumulative distribution, k or less successes in n trials
	if (cumulative) {
		var sum = 0;
		for (var i = 0; i <= k; i++)
			sum += binomdist(i, n, p, false);
		return sum;
	}
	// exactly k successes in n trials with probability p
	return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// success change
function successChance(challenge, ability)
{
	var req = challenge.suc - ability.suc;
	if (req <= 0)
		return 1;

	if (challenge.dif > ability.rng)
		return 0;

	if (req > ability.lvl)
		return 0;

	var prob = (ability.str + ability.rng - challenge.dif + 1) / ability.rng;

	if (prob >= 1)
		return 1;

	return Math.min(0.9999, 1 - binomdist(req - 1, ability.lvl, prob, true));
}

// get expected successes & amount
function expectedSuccesses(challenge, ability)
{
	if (challenge.dif > ability.rng)
		return ability.suc;

	var prob = (ability.str + ability.rng - challenge.dif + 1) / ability.rng;

	if (prob >= 1)
		return ability.suc + ability.lvl;

	return ability.suc + prob * ability.lvl;
}

// remove leading and trailing whitespace
function strip(str)
{
	str = str.replace(/^\s+/, "");
	str = str.replace(/\s+$/, "");
	str = str.replace(/\s+/g, " ");
	return str;
}

// concatenate textnodes
function textCat(xpath)
{
	var txtdoc = "";
	var txtSnap = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var txt;
	for (var i = 0; txt = txtSnap.snapshotItem(i); i++) {
		var str = strip(txt.textContent);
		if (str == "")
			continue; // ignore whitespace/empty nodes
		txtdoc += str + "|";
	}
	return txtdoc;
}

// parsing stuff
function parseAbilities(jutsu, text)
{
	text = text.replace(/\|/g, " ");
	// e.g. "Taijutsu: 29 (+22) +12 Str 1-31 R 2 Suc"
	var re = new RegExp(jutsu + ": (\\d+)( \\(([+-]\\d+)\\))?( ([+-]\\d+) Str)? 1-(\\d+) R( (\\d+) Suc)?");
	var match = text.match(re);

	if (match) {
		var lvl = parseInt(match[1]) || 0;
		lvl += parseInt(match[3]) || 0;
		return {
			lvl: lvl,
			str: parseInt(match[5]) || 0,
			rng: parseInt(match[6]) || 0,
			suc: parseInt(match[8]) || 0
		};
	}

	return null;
}

// parse the mission
function parseMission(xpath)
{
	var mission = new Mission();

	var txtdoc = textCat(xpath);
	var splut = txtdoc.split(/Ability #\d+:\s+/);

	// find crank level if any
	var crank = splut[0].match(/Crank Level: (\d+)/);
	if (crank)
		mission.crank = parseInt(crank[1]);

	// match primary stat and mission title
	var match = splut[0].match(/(\w+)jutsu\|([^|]*)\|([^|]*)\|.*Difficulty (\d+) Successes (\d+)/);
	if (match) {
		var c = new Challenge();
		c.dif = parseInt(match[4]);
		c.suc = parseInt(match[5]);
		var type = match[1].toLowerCase();
		mission[type] = c;
		mission.order.push(type);
	} else {
		// rolling challenge?
		match = splut[0].match(/(\w+)jutsu\|([^|]*)\|([^|]*)\|.*Difficulty (\d+) Successes Remaining (\d+)/);
		if (match) {
			var c = new Challenge();
			c.dif = parseInt(match[4]);
			c.suc = parseInt(match[5]);
			var type = match[1].toLowerCase();
			mission[type] = c;
			mission.order.push(type);
			mission.rolling = true;
		} else
			return null;
	}
	// match any additional stats
	for (var i = 1; i < splut.length; i++) {
		var match = splut[i].match(/(\w+)jutsu.*Difficulty (\d+) Successes (\d+)/);
		if (match) {
			var c = new Challenge();
			c.dif = parseInt(match[2]);
			c.suc = parseInt(match[3]);
			var type = match[1].toLowerCase();
			mission[type] = c;
			mission.order.push(type);
		}
	}

	return mission;
}

// parse ninja
function parseNinja()
{
	// convert sidebar to text
	var txtdoc = textCat("//center/table/tbody/tr/td[2]/table/tbody/tr//text()");

	// parse jutsu abilities
	var ninja = new Ninja();
	for (var t in jutsuTypes)
		ninja[t] = parseAbilities(jutsuTypes[t], txtdoc);

	return ninja;
}

// adjust ninja stats
function modifyNinja(jutsuId, ninja)
{
	if(jutsuData[jutsuId] == null)
		return false;

	try {
		for(var ninja_i in ninja) {
			for(var ninja_j in ninja[ninja_i]) {
				if(noStr == true && ninja_j == "str" && jutsuId != 495) {
					continue;
				}
				var bonus = jutsuData[jutsuId][ninja_i][ninja_j]
				ninja[ninja_i][ninja_j] += bonus;
				if(bonus >= 999) {
					if(bonuses.length < 1) {
						bonuses.push("Autowin!");
					}
					continue;
				}
				if(bonus <= -999) {
					if(bonuses.length < 1) {
						bonuses.push("Autolose!");
					}
					continue;
				}
				if(bonus != 0) {
					var type1 = "";
					var type2 = "";
					switch(ninja_i) {
						case "gen": type1 = "Genjutsu"; break;
						case "nin": type1 = "Ninjutsu"; break;
						case "tai": type1 = "Taijutsu"; break;
						case "dou": type1 = "Doujutsu"; break;
						default: type1 = ninja_i + "jutsu?"; break;
					}
					switch(ninja_j) {
						case "lvl": type2 = "Level" + (bonus > 1 ? "s" : ""); break;
						case "str": type2 = "Strength"; break;
						case "rng": type2 = "Range"; break;
						case "suc": type2 = "Success" + (bonus > 1 ? "es" : ""); break;
						default: type2 = ninja_j + "?"; break;
					}
					bonuses.push((bonus > 0 ? "+" : "") + bonus + " " + type1 + " " + type2);
				}
			}
		}
	}
	catch(e) {
		return false;
	}
	return true;
}

// output
function percent(n)
{
	if (n == 1.0)
		return "100%";
	else if (n == 0.0)
		return "0%";
	var p = Math.round(n * 1000) / 10;
	if (p > 99.9)
		return ">99.9%";
	else if (p < 0.1)
		return "<0.1%";
	return p + "%";
}

// needed to keep a main, non jutsu using ninja
function cloneObject(what) {
	for (item in what) {
		if (typeof what[item] == "object") {
			this[item] = new cloneObject(what[item]);
		}
		else {
			this[item] = what[item];
		}
	}
}

// main function
function main() {
	try {
		// prepare everything
		var text = "";
		var ninja = parseNinja();
		var mission;
		if(workingURL.match(/billy.bvs.missions.mission1/))
			mission = parseMission("//div[@class='miscontainer']//text()");
		else if(workingURL.match(/billy.bvs.questattempt/))
			mission = parseMission("//center/table[@width='388']//text()");

		// get mission limits (no strength in wasteland)
		var blackWarning = textCat("//table[@class='bbbj']/tbody/tr/td/center");
		if(blackWarning != null) {
			if(blackWarning.match(/No Strength/i)) {
				noStr = true;
			}
		}

		// get jutsu buttons
		var input = document.evaluate("//tr/td/input[@name='usejutsu']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var x = 0; x < input.snapshotLength; x++)
		{
			// jutsu ID
			var jutsuId = parseInt(input.snapshotItem(x).value) || 0;

			// clone the original, non jutsu ninja; if the bonus can't be applied ship the jutsu
			var ninjaWithJutsu = new cloneObject(ninja);
			bonuses = new Array();
			if(!modifyNinja(jutsuId, ninjaWithJutsu)) {
				continue;
			}
			if(bonuses.length <= 0) {
				bonuses.push("No effect!");
			}

			// create and append the layer used to display percents
			var div = document.createElement("div");
			div.setAttribute("style", "float: right; font-size: 10px; text-align: right;");
			div.innerHTML = "";
			var type = 0;
			try {
				type = localStorage.getItem("BvSJutsuSucProb.type", 0);
				if(type == null)
					type = 0;
			} catch(e) { }
			if(type == 0) {
				input.snapshotItem(x).parentNode.parentNode.getElementsByTagName("td")[2].appendChild(div);
			}
			else {
				var tmpParent = input.snapshotItem(x).parentNode.parentNode.getElementsByTagName("td")[2];
				tmpParent.insertBefore(div, tmpParent.firstChild);
			}
			var parts = Array();

			try
			{
				var expect;
				var attempts;
				var ptot = 1.0;
				// mission
				if(workingURL.match(/billy.bvs.missions.mission1/))
				{
					for (var j in mission.order) {
						var type = mission.order[j];
						if (mission[type].dif > 0) {
							var p;
							p = successChance(mission[type], ninjaWithJutsu[type]);
							parts.push("<font class=\"" + type + "\">" + percent(p) + "</font>");
							ptot *= p;
						}
					}
				}
				// quest
				else if(workingURL.match(/billy.bvs.questattempt/))
				{
					// rolling challenge
					if (mission.rolling) {
						for (var j in mission.order) {
							var type = mission.order[j];
							expect = expectedSuccesses(mission[type], ninjaWithJutsu[type]);
							attempts = mission[type].suc / expect;
							expect = Math.round(expect * 10) / 10;
						}
					// normal mission
					} else {
						for (var j in mission.order) {
							var type = mission.order[j];
							if (mission[type].dif > 0) {
								var p;
								p = successChance(mission[type], ninjaWithJutsu[type]);
								parts.push("<font class=\"" + type + "\">" + percent(p) + "</font>");
								ptot *= p;
							}
						}
					}
				}

				// select the correct color
				var color = "#FF0000";
				if(ptot > 0.3 && ptot <= 0.5)
					color = "#BF3F00";
				else if(ptot > 0.5 && ptot <= 0.75)
					color = "#7F7F00";
				else if(ptot > 0.75 && ptot <= 0.9)
					color = "#3FBF00";
				else if(ptot > 0.9)
					color = "#007F00";

				// append the final percents and partial percents
				if(mission.rolling)
					div.innerHTML += "<span title=\"header=[Jutsu Bonuses] body=[" + bonuses.join("<br/>") + "] offsetx=[-310] offsety=[10] greenswitch=[1]\" style=\"color:" + color + "; font-weight:bold;\">" + expect + " successes,  " + (Math.round(attempts * 10) / 10) + " times</span>";
				else
					div.innerHTML += "(" + parts.join(", ") + ")<br/><span title=\"header=[Jutsu Bonuses] body=[" + bonuses.join("<br/>") + "] offsetx=[-310] offsety=[10] greenswitch=[1]\" style=\"color:" + color + "; font-weight:bold;\">" + percent(ptot) + "</span>";
			}
			catch(e) {
				alert(e);
			}
		}
	}
	catch(e) {
		alert(e);
	}
}

// call main function
main();

function ProcessKeyClick(event) {
	if(event.keyCode == 84) {
		var type = localStorage.getItem("BvSJutsuSucProb.type") != null ? localStorage.getItem("BvSJutsuSucProb.type") : 0;
		if(confirm(" -- Save height -- \n\nIf you turn on this feature make sure that any scripts that parse jutsus are ABOVE this script.\n\nCurrently turned " + (type == 0 ? "OFF" : "ON") + ".")) {
			localStorage.setItem("BvSJutsuSucProb.type", type == 0 ? 1 : 0);
		}
	}
}

window.addEventListener("keyup", ProcessKeyClick, false);