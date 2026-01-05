// ==UserScript==
// @name         DH1 Fixed
// @namespace    FileFace
// @description  Improve Diamond Hunt 1 and fix some inconsistencies
// @version      1.36.0
// @author       Zorbing
// @license      ISC; http://opensource.org/licenses/ISC
// @grant        none
// @run-at       document-start
// @include      http://www.diamondhunt.co/DH1/game.php
// @downloadURL https://update.greasyfork.org/scripts/26219/DH1%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/26219/DH1%20Fixed.meta.js
// ==/UserScript==

/**
 * ISC License (ISC)
 * 
 * Copyright (c) 2017, Martin Boekhoff
 * 
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
 * granted, provided that the above copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
 * AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 * 
 * Source: http://opensource.org/licenses/ISC
 */

(function ()
{
'use strict';

const settings = {
	reorderFarming: {
		title: 'Set seed orders coherent'
		, defaultValue: true
		, requiresReload: true
	}
	, applyNewItemStyle: {
		title: 'Apply a new item style'
		, defaultValue: true
		, requiresReload: true
	}
	, applyNewKeyItemStyle: {
		title: 'Apply a new key item and machinery style'
		, defaultValue: true
		, requiresReload: true
	}
	, improveDialogBtns: {
		title: 'Improve button captions in dialogs'
		, defaultValue: true
	}
	, improveMachineryDialog: {
		title: 'Improve the machinery dialog'
		, defaultValue: true
		, requiresReload: true
	}
	, hideSomeCraftRecipes: {
		title: 'Hide some crafting recipes'
		, defaultValue: true
	}
	, hideMaxRecipes: {
		title: 'Hide recipes of maxed machines'
		, defaultValue: true
	}
	, expandEquipment: {
		title: 'Expand crafting recipes of equipment'
		, defaultValue: true
		, requiresReload: true
	}
	, hideEquipment: {
		title: 'Hide inferiour equipment (only up to gold)'
		, defaultValue: true
	}
	, hideUnnecessaryPrice: {
		title: 'Hide "0 coins"-prices'
		, defaultValue: true
	}
	, useFastLevelCalculation: {
		title: 'Use fast level calculation'
		, defaultValue: true
	}
	, showNotifications: {
		title: 'Show notifications for events'
		, defaultValue: true
	}
	, useNewChat: {
		title: 'Use the new chat with pm tabs'
		, defaultValue: true
		, requiresReload: true
	}
	, addSubTabs: {
		title: 'Add sub tabs'
		, defaultValue: true
	}
};
let fullyLoaded = false;
function notify(title, options)
{
	if (!getSetting('showNotifications'))
	{
		// notifications disabled: return stub notification
		return Promise.resolve({
			close: () => {}
		});
	}
	if (!("Notification" in window) ||
		Notification.permission === 'denied')
	{
		return Promise.reject('Notification permission denied');
	}

	if (Notification.permission === 'granted')
	{
		return Promise.resolve(new Notification(title, options));
	}
	return Notification.requestPermission().then(() => notify(title, options));
};



/**
 * global constants
 */

const maxLevel = 100;
const maxLevelVirtual = 1000;
const furnaceLevels = ['', 'stone', 'bronze', 'iron', 'silver', 'gold', 'ancient', 'promethium', 'runite', 'dragon'];
const ovenLevels = ['bronze', 'iron', 'silver', 'gold', 'ancient', 'promethium', 'runite', 'dragon'];
const barTypes = ['bronze', 'iron', 'silver', 'gold', 'promethium', 'runite'];
const oilConsumption = {
	'drill': 1
	, 'crusher': 15
	, 'giantDrill': 30
	, 'roadHeader': 50
	, 'bucketWheelExcavator': 150
	, 'giantBWE': 500
	, 'sandCollector': 5
};
const machineNames = {
	'drill': 'Mining Drill'
	, 'crusher': 'Crusher'
	, 'giantDrill': 'Giant Drill'
	, 'roadHeader': 'Road Header'
	, 'bucketWheelExcavator': 'Excavator'
	, 'giantBWE': 'Mega Excavator'
	, 'sandCollector': 'Sand Collector'
};



/**
 * observer stuff
 */

let observedKeys = new Map();
/**
 * Observes the given key for change
 * 
 * @param {string} key	The name of the variable
 * @param {Function} fn	The function which is called on change
 */
function observe(key, fn)
{
	if (key instanceof Array)
	{
		for (let k of key)
		{
			observe(k, fn);
		}
	}
	else
	{
		if (!observedKeys.has(key))
		{
			observedKeys.set(key, new Set());
		}
		observedKeys.get(key).add(fn);
	}
	return fn;
}
function unobserve(key, fn)
{
	if (key instanceof Array)
	{
		let ret = [];
		for (let k of key)
		{
			ret.push(unobserve(k, fn));
		}
		return ret;
	}
	if (!observedKeys.has(key))
	{
		return false;
	}
	return observedKeys.get(key).delete(fn);
}
function initObservable()
{
	const oldLoadGlobals = window.loadGlobals;
	window.loadGlobals = (key, newValue) =>
	{
		if (key === undefined)
		{
			return;
		}

		const oldValue = window[key];
		const ret = oldLoadGlobals(key, newValue);
		if (oldValue !== newValue)
		{
			(observedKeys.get(key) || []).forEach(fn => fn(key, oldValue, newValue));
		}
		return ret;
	};
}



/**
 * global misc functions
 */

const itemInfo = {
	oil: {
		name: 'Oil'
		, plural: false
		, img: 'oil.png'
	}
	, sand: {
		name: 'Sand'
		, plural: false
		, img: 'minerals/sand.png'
	}
	, stone: {
		name: 'Stone'
		, plural: false
		, img: 'stone.png'
	}
	, copper: {
		name: 'Copper'
		, plural: false
		, img: 'minerals/copper.png'
	}
	, tin: {
		name: 'Tin'
		, plural: false
		, img: 'minerals/tin.png'
	}
	, iron: {
		name: 'Iron'
		, plural: false
		, img: 'minerals/iron.png'
	}
	, silver: {
		name: 'Silver'
		, plural: false
		, img: 'minerals/silver.png'
	}
	, gold: {
		name: 'Gold'
		, plural: false
		, img: 'minerals/gold.png'
	}
	, marble: {
		name: 'Marble'
		, plural: false
		, img: 'minerals/marble.png'
	}
	, drill: {
		name: 'Mining Drill'
		, img: 'shop/mining-drill.png'
	}
	, superstardustpotion: {
		name: 'Super Stardust Potion'
		, img: 'brewing/superstardustpotion.png'
	}
	, sandcollector: {
		name: 'Sand Collector'
		, img: 'crafting/sandcollector.png'
	}
	, titanium: {
		name: 'Titanium'
		, plural: false
		, img: 'minerals/titanium.png'
	}
	, promethium: {
		name: 'Promethium'
		, plural: false
		, img: 'minerals/promethium.png'
	}
	, sapphire: {
		name: 'Sapphire'
		, img: 'minerals/sapphire.png'
	}
	, emerald: {
		name: 'Emerald'
		, img: 'minerals/emerald.png'
	}
	, ruby: {
		name: 'Ruby'
		, img: 'minerals/ruby.png'
	}
	, diamond: {
		name: 'Diamond'
		, img: 'minerals/diamond.png'
	}
	, bronzebar: {
		name: 'Bronze Bar'
		, img: 'minerals/bronzebar.png'
	}
	, ironbar: {
		name: 'Iron Bar'
		, img: 'minerals/ironbar.png'
	}
	, silverbar: {
		name: 'Silver Bar'
		, img: 'minerals/silverbar.png'
	}
	, goldbar: {
		name: 'Gold Bar'
		, img: 'minerals/goldbar.png'
	}
	, bronzenails: {
		name: 'Bronze Nail'
		, img: 'crafting/bronzenails.png'
	}
	, ironnails: {
		name: 'Iron Nail'
		, img: 'crafting/ironnails.png'
	}
	, silvernails: {
		name: 'Silver Nail'
		, img: 'crafting/silvernails.png'
	}
	, goldnails: {
		name: 'Gold Nail'
		, img: 'crafting/goldnails.png'
	}
	, quartz: {
		name: 'Quartz'
		, plural: false
		, img: 'minerals/quartz.png'
	}
	, flint: {
		name: 'Flint'
		, plural: false
		, img: 'minerals/flint.png'
	}
	, dottedgreenleafseeds: {
		name: 'Dotted Green Leaf Seed'
		, img: 'farming/spotted-green-leaf-seed.png'
	}
	, greenleafseeds: {
		name: 'Green Leaf Seed'
		, img: 'farming/greenleafseed.png'
	}
	, limeleafseeds: {
		name: 'Lime Leaf Seed'
		, img: 'farming/limeleafseed.png'
	}
	, goldleafseeds: {
		name: 'Gold Leaf Seed'
		, img: 'farming/goldleafseed.png'
	}
	, blewitmushroomtreeseeds: {
		name: 'Blewit Mushroom Tree Seed'
		, img: 'farming/blewitmushroomtreeseeds.png'
	}
	, crystalleafseeds: {
		name: 'Crystal Leaf Seed'
		, img: 'farming/crystalleafseed.png'
	}
	, redmushroom: {
		name: 'Red Mushroom'
		, img: 'brewing/redmushroom.png'
	}
	, snapegrass: {
		name: 'Snape Grass'
		, plural: false
		, img: 'brewing/snapegrass.png'
	}
	, redmushroomseeds: {
		name: 'Red Mushroom Seed'
		, img: 'farming/redmushroomseed.png'
	}
	, blewitmushroomseeds: {
		name: 'Snape Grass Seed'
		, img: 'farming/snapegrassseed.png'
	}
	, snapegrassseeds: {
		name: 'Snape Grass Seed'
		, img: 'farming/snapegrassseed.png'
	}
	, stardustseeds: {
		name: 'Stardust Seed'
		, img: 'farming/stardustseed.png'
	}
	, ancientfurnace: {
		name: 'Ancient Furnace'
		, img: 'crafting/ancientfurnace.gif'
	}
	, goldfurnace: {
		name: 'Gold Furnace'
		, img: 'crafting/goldfurnace.gif'
	}
	, promethiumfurnace: {
		name: 'Promethium Furnace'
		, img: 'crafting/promethiumfurnace.gif'
	}
	, silverfurnace: {
		name: 'Silver Furnace'
		, img: 'crafting/silverfurnace.gif'
	}
	, vial: {
		name: 'Vial of Water'
		, plural: false
		, img: 'brewing/vialofwater.png'
	}
	, stardustpotion: {
		name: 'Stardust Potion'
		, img: 'brewing/stardustpotion.png'
	}
	, stardust: {
		name: 'Stardust'
		, plural: false
		, img: 'minerals/stardust.png'
	}
	, coins: {
		name: 'Coin'
		, img: 'pic_coin_bigstack.png'
	}
	, donorcoins: {
		name: 'Donor Coin'
		, img: 'donor_coin.png'
	}
	, unbounddonorcoins: {
		name: 'Donor Coin'
		, img: 'donor_coin.png'
	}
	, pumpjack: {
		name: 'Pumpjack'
		, img: 'shop/pumpjack.png'
	}
	, oilpipe: {
		name: 'Oil Pipe'
		, img: 'shop/oil-pipe.png'
	}
	, treasurechestkey: {
		name: 'Treasure Key'
		, img: 'misc-items/treasureKey.png'
	}
	, sapphirekey: {
		name: 'Sapphire Key'
		, img: 'misc-items/sapphireKey.png'
	}
	, emeraldkey: {
		name: 'Emerald Key'
		, img: 'misc-items/emeraldKey.png'
	}
	, rubykey: {
		name: 'Ruby Key'
		, img: 'misc-items/rubyKey.png'
	}
	, dragonkey: {
		name: 'Dragon Key'
		, img: 'misc-items/dragonKey.png'
	}
	, roadheader: {
		name: 'Road Header'
		, img: 'shop/vip/roadheader.png'
	}
	, giantdrill: {
		name: 'Giant Drill'
		, img: 'shop/vip/giantdrill.png'
	}
	, crusher: {
		name: 'Crusher'
		, img: 'shop/crusher.gif'
	}
	, dottedgreenleaf: {
		name: 'Dotted Green Leaf'
		, img: 'brewing/dottedgreenleaf.png'
	}
	, oilbarrel: {
		name: 'Oil Barrel'
		, img: 'crafting/oilbarrel.png'
	}
	, greenleaf: {
		name: 'Green Leaf'
		, img: 'brewing/greenleaf.png'
	}
	, limeleaf: {
		name: 'Lime Leaf'
		, img: 'brewing/limeleaf.png'
	}
	, goldleaf: {
		name: 'Gold Leaf'
		, img: 'brewing/goldleaf.png'
	}
	, crystalleaf: {
		name: 'Crystal Leaf'
		, img: 'brewing/crystalleaf.png'
	}
	, blewitmushroom: {
		name: 'Blewit Mushroom'
		, img: 'brewing/blewitmushroom.png'
	}
	, trowel: {
		name: 'Trowel'
		, img: 'farming/trowel.png'
	}
	, upgradeoilpipe: {
		name: 'Oil Pipe Upgrade Orb'
		, img: 'crafting/upgradeoilpipe.png'
	}
	, upgradeenchantedhammer: {
		name: 'Enchanted Hammer Upgrade Orb'
		, img: 'crafting/upgradeenchantedhammer.png'
	}
	, upgradefurnaceorb: {
		name: 'Furnace Upgrade Orb'
		, img: 'crafting/upgradefurnaceorb.png'
	}
	, upgradeenchantedrake: {
		name: 'Enchanted Rake Upgrade Orb'
		, img: 'farming/upgradeenchantedrake.png'
	}
	, redmushroomtreeseeds: {
		name: 'Red Mushroom Tree Seed'
		, img: 'farming/redmushroomtreeseeds.png'
	}
	, stardusttreeseeds: {
		name: 'Stardust Tree Seed'
		, img: 'farming/stardusttreeseed.png'
	}
	, rocket: {
		name: 'Rocket'
		, img: 'crafting/rocket.png'
	}
	, promethiumbar: {
		name: 'Promethium Bar'
		, img: 'minerals/promethiumbar.png'
	}
	, upgradepumpjackorb: {
		name: 'Blue Pumpjack Upgrade Orb'
		, img: 'crafting/upgradepumpjackorb.png'
	}
	, upgradewrenchorb: {
		name: 'Wrench Upgrade Orb'
		, img: 'crafting/upgradewrenchorb.png'
	}
	, oilfactory: {
		name: 'Oil Factory'
		, img: 'shop/oilfactory.png'
	}
	, orboftransformation: {
		name: 'Orb of Transformation'
		, plural: 'Orbs of Transformation'
		, img: 'minerals/orb.png'
	}
	, emptyblueorb: {
		name: 'Empty Blue Orb'
		, img: 'crafting/anyorb.png'
	}
	, emptygreenorb: {
		name: 'Empty Green Orb'
		, img: 'crafting/anyorb2.png'
	}
	, diamondminers: {
		name: 'Diamond Pickaxe'
		, img: 'pickaxes/diamond_pickaxe.png'
	}
	, stripedleafseeds: {
		name: 'Striped Leaf Seed'
		, img: 'farming/stripedleafseed.png'
	}
	, stripedleaf: {
		name: 'Striped Leaf'
		, img: 'brewing/stripedleaf.png'
	}
	, stripedcrystalleafseeds: {
		name: 'Striped Crystal Leaf Seed'
		, img: 'farming/stripedcrystalleafseed.png'
	}
	, stripedcrystalleaf: {
		name: 'Striped Crystal Leaf'
		, img: 'brewing/stripedcrystalleaf.png'
	}
	, bucketwheelexcavator: {
		name: 'Bucket-wheel Excavator'
		, img: 'shop/excavators.png'
	}
	, brewingkit: {
		name: 'Brewing Kit'
		, img: 'brewing/brewingkit.png'
	}
	, supercompostpotion: {
		name: 'Super Compost Potion'
		, img: 'brewing/supercompostpotion.png'
	}
	, megastardustpotion: {
		name: 'Mega Stardust Potion'
		, img: 'brewing/megastardustpotion.png'
	}
	, robot: {
		name: 'Robot'
		, img: 'crafting/robot.png'
	}
	, greenpumpjackorb: {
		name: 'Green Pumpjack Upgrade Orb'
		, img: 'crafting/greenpumpjackorb.png'
	}
	, greenwizardorb: {
		name: 'Green Wizard Upgrade Orb'
		, img: 'crafting/greenwizardorb.png'
	}
	, redbrewingkitorb: {
		name: 'Red Brewing Kit Upgrade Orb'
		, img: 'crafting/redbrewingkitorb.png'
	}
	, runite: {
		name: 'Runite'
		, img: 'minerals/runite.png'
	}
	, runitebar: {
		name: 'Runite Bar'
		, img: 'minerals/runitebar.png'
	}
	, potato: {
		name: 'Potato'
		, plural: 'Potatoes'
		, img: 'exploring/potato.png'
	}
	, wheat: {
		name: 'Wheat'
		, plural: false
		, img: 'exploring/wheat.png'
	}
	, strawberry: {
		name: 'Strawberry'
		, img: 'exploring/strawberry.png'
	}
	, strawberrypie: {
		name: 'Strawberry Pie'
		, img: 'exploring/strawberrypie.png'
	}
	, greenmushroom: {
		name: 'Green Mushroom'
		, img: 'exploring/greenmushroom.png'
	}
	, mashedpotatoes: {
		name: 'Mashed Potatoes'
		, plural: false
		, img: 'exploring/mashedpotatoes.png'
	}
	, silveroven: {
		name: 'Silver Oven'
		, img: 'exploring/silveroven.png'
	}
	, goldoven: {
		name: 'Gold Oven'
		, img: 'exploring/goldoven.png'
	}
	, promethiumoven: {
		name: 'Promethium Oven'
		, img: 'exploring/promethiumoven.png'
	}
	, runiteoven: {
		name: 'Runite Oven'
		, img: 'exploring/runiteoven.png'
	}
	, flour: {
		name: 'Flour'
		, plural: false
		, img: 'exploring/flour.png'
	}
	, rocketfuelorb: {
		name: 'Rocket Fuel Orb'
		, img: 'crafting/rocketfuelorb.png'
	}
	, superchestpotion: {
		name: 'Super Chest Potion'
		, img: 'brewing/superchestpotion.png'
	}
	, chestpotion: {
		name: 'Chest Potion'
		, img: 'brewing/chestpotion.png'
	}
	, bread: {
		name: 'Bread'
		, img: 'exploring/bread.png'
	}
	, shrimp: {
		name: 'Shrimp'
		, img: 'exploring/shrimp.png'
	}
	, sardine: {
		name: 'Sardine'
		, img: 'exploring/sardine.png'
	}
	, tuna: {
		name: 'Tuna'
		, img: 'exploring/tuna.png'
	}
	, swordfish: {
		name: 'Swordfish'
		, plural: false
		, img: 'exploring/swordfish.png'
	}
	, shark: {
		name: 'Shark'
		, img: 'exploring/shark.png'
	}
	, lava: {
		name: 'Lava'
		, plural: false
		, img: 'exploring/lava.png'
	}
	, explorerspotion: {
		name: 'Exploring Potion'
		, img: 'brewing/explorerspotion.png'
	}
	, whale: {
		name: 'Whale'
		, img: 'exploring/whale.png'
	}
	, strangeleaf: {
		name: 'Strange Leaf'
		, img: 'exploring/strangeleaf.png'
	}
	, fishingpotion: {
		name: 'Fishing Potion'
		, img: 'brewing/fishingpotion.png'
	}
	, superorboftransformation: {
		name: 'Super Orb of Transformation'
		, plural: 'Super Orbs of Transformation'
		, img: 'minerals/upgradedorb.png'
	}
	, moonstone: {
		name: 'Moonstone'
		, img: 'minerals/moonstone.png'
	}
	, purewaterpotion: {
		name: 'Pure Water'
		, plural: false
		, img: 'exploring/purewater.png'
	}
	, amuletofthesea: {
		name: 'Amulet of the Sea'
		, plural: 'Amulets of the Sea'
		, img: 'exploring/equipement/amuletofthesea.png'
	}
	, appletreeseeds: {
		name: 'Apple Tree Seed'
		, img: 'farming/appletreeseed.png'
	}
	, apple: {
		name: 'Apple'
		, img: 'exploring/apple.png'
	}
	, ironsword: {
		name: 'Iron Sword'
		, img: 'exploring/equipement/ironsword.png'
	}
	, goldbody: {
		name: 'Gold Body'
		, img: 'exploring/equipement/goldbody.png'
	}
	, ironbody: {
		name: 'Iron Body'
		, img: 'exploring/equipement/ironbody.png'
	}
	, runitehelmet: {
		name: 'Runite Helmet'
		, img: 'exploring/equipement/runitehelmet.png'
	}
	, promethiumbody: {
		name: 'Promethium Body'
		, img: 'exploring/equipement/promethiumbody.png'
	}
	, rawshrimp: {
		name: 'Raw Shrimp'
		, img: 'exploring/rawshrimp.png'
	}
	, rawshark: {
		name: 'Raw Shark'
		, img: 'exploring/rawshark.png'
	}
	, rawbread: {
		name: 'Raw Bread'
		, img: 'exploring/rawbread.png'
	}
	, frozenhorn: {
		name: 'Horn'
		, img: 'exploring/horn.png'
	}
	, pumpkinsigil: {
		name: 'Halloween 2015 Sigil'
		, img: 'sigils/halloween2015.png'
	}
	, treesigil: {
		name: 'Christmas 2016 Sigil'
		, img: 'sigils/christmas2016.png'
	}
	, santahatsigil: {
		name: 'Christmas 2015 Sigil'
		, img: 'sigils/christmas2015.png'
	}
	, exploringorb: {
		name: 'Exploring Upgrade Orb'
		, img: 'crafting/exploringorb.png'
	}
	, whaletooth: {
		name: 'Whale Tooth'
		, plural: 'Whale Teeth'
		, img: 'exploring/whaletooth.png'
	}
	, cactuswater: {
		name: 'Cactus Water'
		, plural: false
		, img: 'exploring/cactuswater.png'
	}
	, swampwater: {
		name: 'Swamp Water'
		, plural: false
		, img: 'exploring/swampwater.png'
	}
	, tnt: {
		name: 'TNT'
		, plural: false
		, img: 'crafting/tnt.png'
	}
	, emptyessence: {
		name: 'Empty Essence'
		, img: 'magic/emptyessence.png'
	}
	, chargedmineralessence: {
		name: 'Charged Mineral Essence'
		, img: 'magic/chargedmineralessence.png'
	}
	, chargedmetallicessence: {
		name: 'Charged Metallic Essence'
		, img: 'magic/chargedmetallicessence.png'
	}
	, chargedoilessence: {
		name: 'Charged Oil Essence'
		, img: 'magic/chargedoilessence.png'
	}
	, chargedenergyessence: {
		name: 'Charged Energy Essence'
		, img: 'magic/chargedenergyessence.png'
	}
	, chargednatureessence: {
		name: 'Charged Nature Essence'
		, img: 'magic/chargednatureessence.png'
	}
	, chargedorbessence: {
		name: 'Charged Orb Essence'
		, img: 'magic/chargedorbessence.png'
	}
	, chargedgemessence: {
		name: 'Charged Gem Essence'
		, img: 'magic/chargedgemessence.png'
	}
	, magicpage1: {
		name: '1st Magic Page'
		, img: 'magic/magicpage1.png'
	}
	, magicpage2: {
		name: '2nd Magic Page'
		, img: 'magic/magicpage2.png'
	}
	, magicpage3: {
		name: '3rd Magic Page'
		, img: 'magic/magicpage3.png'
	}
	, magicpage4: {
		name: '4th Magic Page'
		, img: 'magic/magicpage4.png'
	}
	, magicpage5: {
		name: '5th Magic Page'
		, img: 'magic/magicpage5.png'
	}
	, magicpage6: {
		name: '6th Magic Page'
		, img: 'magic/magicpage6.png'
	}
	, dottedgreenroots: {
		name: 'Dotted Green Root'
		, img: 'farming/dottedgreenroots.png'
	}
	, greenroots: {
		name: 'Green Root'
		, img: 'farming/greenroots.png'
	}
	, limeroots: {
		name: 'Lime Root'
		, img: 'farming/limeroots.png'
	}
	, goldroots: {
		name: 'Gold Root'
		, img: 'farming/goldroots.png'
	}
	, stripedgoldroots: {
		name: 'Striped Gold Root'
		, img: 'farming/stripedgoldroots.png'
	}
	, crystalroots: {
		name: 'Crystal Root'
		, img: 'farming/crystalroots.png'
	}
	, stripedcrystalroots: {
		name: 'Striped Crystal Root'
		, img: 'farming/stripedcrystalroots.png'
	}
	, purewaterring: {
		name: 'Pure Water Ring'
		, img: 'exploring/equipement/purewaterring.png'
	}
	, coinring: {
		name: 'Coin Ring'
		, img: 'exploring/equipement/coinring.png'
	}
	, lavaring: {
		name: 'Lava Ring'
		, img: 'exploring/equipement/lavaring.png'
	}
	, promethiumhelmet: {
		name: 'Promethium Helmet'
		, img: 'exploring/equipement/promethiumhelmet.png'
	}
	, promethiumlegs: {
		name: 'Promethium Legs'
		, img: 'exploring/equipement/promethiumlegs.png'
	}
	, promethiumsword: {
		name: 'Promethium Sword'
		, img: 'exploring/equipement/promethiumsword.png'
	}
	, a: {
		name: 'Runite Helmet'
		, img: 'exploring/equipement/runitehelmet.png'
	}
	, runitebody: {
		name: 'Runite Body'
		, img: 'exploring/equipement/runitebody.png'
	}
	, runitelegs: {
		name: 'Runite Legs'
		, img: 'exploring/equipement/runitelegs.png'
	}
	, runitesword: {
		name: 'Runite Sword'
		, img: 'exploring/equipement/runitesword.png'
	}
	, ancientshield: {
		name: 'Ancient Shield'
		, img: 'exploring/equipement/ancientshield.png'
	}
	, redpumpjack: {
		name: 'Red Pumpjack Upgrade'
		, img: 'crafting/redpumpjack.png'
	}
	, essenceseeds: {
		name: 'Essence Seed'
		, img: 'farming/essenceseed.png'
	}
	, giantbwe: {
		name: 'Giant Bucket-wheel Excavator'
		, img: 'crafting/giantbwe.png'
	}
	, redfactoryorb: {
		name: 'Red Factory Upgrade Orb'
		, img: 'crafting/redfactoryorb.png'
	}
	, essencetreeseeds: {
		name: 'Essence Tree Seed'
		, img: 'farming/essencetreeseed.png'
	}
	, vendorrerollscroll: {
		name: 'Vendor Reroll Scroll'
		, img: 'exploring/vendorrerollscroll.png'
	}
	, goldstaff: {
		name: 'Gold Staff'
		, img: 'magic/goldstaff.png'
	}
	, promethiumstaff: {
		name: 'Promethium Staff'
		, img: 'magic/promethiumstaff.png'
	}
	, runitestaff: {
		name: 'Runite Staff'
		, img: 'magic/runitestaff.png'
	}
	, goldwand: {
		name: 'Gold Wand'
		, img: 'magic/goldwand.png'
	}
	, promethiumwand: {
		name: 'Promethium Wand'
		, img: 'magic/promethiumwand.png'
	}
	, runitewand: {
		name: 'Runite Wand'
		, img: 'magic/runitewand.png'
	}
	, ancientbar: {
		name: 'Ancient Bar'
		, img: 'minerals/ancientbar.png'
	}
	, ancientcrystal: {
		name: 'Ancient Crystal'
		, img: 'exploring/ancientcrystal.png'
	}
	, ancientoven: {
		name: 'Ancient Oven'
		, img: 'exploring/ancientoven.png'
	}
	, dragonstone: {
		name: 'Dragonstone'
		, img: 'minerals/dragonstone.png'
	}
	, dragonsword: {
		name: 'Dragon Sword'
		, img: 'exploring/equipement/dragonsword.png'
	}
	, dragonhelmet: {
		name: 'Dragon Helmet'
		, img: 'exploring/equipement/dragonhelmet.png'
	}
	, superrobot: {
		name: 'Super Robot'
		, img: 'crafting/superrobot.png'
	}
	, promethiumwrench: {
		name: 'Promethium Wrench'
		, pluarl: 'Promethium Wrenches'
		, img: 'crafting/promethiumwrench.png'
	}
	, dragonchest: {
		name: 'Dragon Chest'
		, img: 'misc-items/dragonChest.png'
	}
	, dragonaxe: {
		name: 'Dragon Axe'
		, img: 'dragonsquest/dragonaxe.png'
	}
	, dragonfishingrod: {
		name: 'Dragon Fishing Rod'
		, img: 'dragonsquest/dragonfishingrod.png'
	}
	, dragonpickaxe: {
		name: 'Dragon Pickaxe'
		, img: 'dragonsquest/dragonpickaxe.png'
	}
	, dragonpumpjacks: {
		name: 'Dragon Pumpjack'
		, img: 'dragonsquest/dragonpumpjacks.png'
	}
	, dragonstaff: {
		name: 'Dragon Staff'
		, img: 'dragonsquest/dragonstaff.png'
	}
	, dragonwand: {
		name: 'Dragon Wand'
		, img: 'dragonsquest/dragonwand.png'
	}
	, eel: {
		name: 'Eel'
		, img: 'exploring/eel.png'
	}
	, eastereggsigil: {
		name: 'Easter 2016 Sigil'
		, img: 'sigils/easter2016.png'
	}
	, rawsardine: {
		name: 'Raw Sardine'
		, img: 'exploring/rawsardine.png'
	}
	, rawtuna: {
		name: 'Raw Tuna'
		, img: 'exploring/rawtuna.png'
	}
	, rawswordfish: {
		name: 'Raw Swordfish'
		, plural: false
		, img: 'exploring/rawswordfish.png'
	}
	, raweel: {
		name: 'Raw Eel'
		, img: 'exploring/raweel.png'
	}
	, rawwhale: {
		name: 'Raw Whale'
		, img: 'exploring/rawwhale.png'
	}
	, rawrainbowfish: {
		name: 'Raw Rainbow Fish'
		, img: 'exploring/rawrainbowfish.png'
	}
	, tunacooker: {
		name: 'Tuna Cooker'
		, img: 'exploring/tunacooker.png'
	}
	, swordfishcooker: {
		name: 'Swordfish Cooker'
		, img: 'exploring/swordfishcooker.png'
	}
	, sharkcooker: {
		name: 'Shark Cooker'
		, img: 'exploring/sharkcooker.png'
	}
	, whalecooker: {
		name: 'Whale Cooker'
		, img: 'exploring/whalecooker.png'
	}
	, rainbowfishcooker: {
		name: 'Rainbow Fish Cooker'
		, img: 'exploring/rainbowfishcooker.png'
	}
	, fishingnet: {
		name: 'Fishing Net'
		, img: 'exploring/fishingnet.png'
	}
	, mapofthesea: {
		name: 'Map of the Sea'
		, plural: 'Maps of the Sea'
		, img: 'exploring/mapofthesea.png'
	}
	, dragonamulet: {
		name: 'Dragon Amulet'
		, img: 'exploring/equipement/dragonamulet.png'
	}
	, dragonbody: {
		name: 'Dragon Body'
		, img: 'exploring/equipement/dragonbody.png'
	}
	, treasurechestkey2: {
		name: 'Ghost Key'
		, img: 'misc-items/ghostKey.png'
	}
	, ghostsigil: {
		name: 'Halloween 2016 Sigil'
		, img: 'sigils/halloween2016.png'
	}
	, ghostpipe1: {
		name: '1st Ghost Pipe'
		, img: 'crafting/ghostpipe1.png'
	}
	, ghostpipe2: {
		name: '2nd Ghost Pipe'
		, img: 'crafting/ghostpipe2.png'
	}
	, ghostpipe3: {
		name: '3rd Ghost Pipe'
		, img: 'crafting/ghostpipe3.png'
	}
	, ghostpipe4: {
		name: '4th Ghost Pipe'
		, img: 'crafting/ghostpipe4.png'
	}
	, ghostpipe5: {
		name: '5th Ghost Pipe'
		, img: 'crafting/ghostpipe5.png'
	}
	, ghostpipe6: {
		name: '6th Ghost Pipe'
		, img: 'crafting/ghostpipe6.png'
	}
	, ghostpipesheet: {
		name: 'Ghost Pipe Sheet'
		, img: 'crafting/ghostpipesheet.png'
	}
	, dragonoven: {
		name: 'Dragon Oven'
		, img: 'exploring/dragonoven.png'
	}
	, dragonfurnace: {
		name: 'Dragon Furnace'
		, img: 'crafting/dragonfurnace.gif'
	}
	, grouptasktokens: {
		name: 'Group Task Token'
		, img: 'icons/grouptasktokens.png'
	}
	, arrowhead: {
		name: 'Arrowhead'
		, img: 'exploring/arrowhead.png'
	}
	, beetlefossil: {
		name: 'Beetle Fossil'
		, img: 'exploring/beetleFossil.png'
	}
	, goldbranch: {
		name: 'Gold Branch'
		, img: 'exploring/goldBranch.png'
	}
	, seashell: {
		name: 'Seashell'
		, img: 'exploring/seashell.png'
	}
	, seaweed: {
		name: 'Seaweed'
		, img: 'exploring/seaweed.png'
	}
	, sharkfin: {
		name: 'Shark\'s Fin'
		, img: 'exploring/sharkfin.png'
	}
	, redsand: {
		name: 'Red Sand'
		, img: 'exploring/redsand.png'
	}
	, swamptar: {
		name: 'Swamp Tar'
		, img: 'exploring/swamptar.png'
	}
	, seedpotion: {
		name: 'Seed Potion'
		, img: 'brewing/seedPotion.png'
	}
	, reddirt: {
		name: 'Red Dirt'
		, img: 'exploring/redDirt.png'
	}
	, carvedtreebark: {
		name: 'Carved Tree Bark'
		, img: 'exploring/carvedTreeBark.png'
	}
};
function createTemplateWrapper(str)
{
	const tmp = document.createElement('templateWrapper');
	tmp.innerHTML = str;
	return tmp;
}
function formatNumber(num)
{
	// return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parseFloat(num).toLocaleString('en');
}
function formatNumbersInText(text)
{
	return text.replace(/\d(?:[\d',\.]*\d)?/g, (numStr) =>
	{
		return formatNumber(parseInt(numStr.replace(/\D/g, ''), 10));
	});
}
function imgSrc2Info(str)
{
	const match = str.match(/(?:^|")images\/(.+?([^\/]+)\.(?:png|gif|jpe?g))(?:"|$)/);
	if (match)
	{
		const keyFromImg = match[2].toLowerCase();
		if (itemInfo.hasOwnProperty(keyFromImg))
		{
			return itemInfo[keyFromImg];
		}
		const imgLowerCase = match[1].toLowerCase();
		for (let key in itemInfo)
		{
			if (itemInfo[key].img == imgLowerCase)
			{
				return itemInfo[key];
			}
		}
		console.warn('unknown image key:', str, match);
		return {
			name: match[2].replace(/-|_/g, ' ')
				.replace(/([a-z])([A-Z])/g, (wholeMatch, m1, m2) =>
				{
					return m1 + ' ' + m2.toLowerCase();
				})
			, img: match[1].toLowerCase()
		};
	}
	return {};
}
function imgSrc2Name(str)
{
	return imgSrc2Info(str).name || null;
}
function imgSrc2NamePlural(str, num)
{
	const info = imgSrc2Info(str);
	if (!info.hasOwnProperty('name'))
	{
		return null;
	}
	if (num == 1 || info.plural === false)
	{
		return info.name;
	}
	if (!info.hasOwnProperty('plural'))
	{
		return info.name.replace(/([^aeiou])y$/, '$1ie') + 's';
	}
	if (typeof info.plural === 'function')
	{
		return info.plural(num);
	}
	return info.plural;
}



/**
 * settings
 */

function getSettingName(key)
{
	return 'setting.' + key;
}
const observedSettings = new Map();
function observeSetting(key, fn)
{
	if (!observedSettings.has(key))
	{
		observedSettings.set(key, new Set());
	}
	observedSettings.get(key).add(fn);
}
function unobserveSetting(key, fn)
{
	if (!observedKeys.has(key))
	{
		return false;
	}
	return observedKeys.get(key).delete(fn);
}
function getSetting(key)
{
	if (!settings.hasOwnProperty(key))
	{
		return;
	}
	const name = getSettingName(key);
	return localStorage.hasOwnProperty(name) ? JSON.parse(localStorage.getItem(name)) : settings[key].defaultValue;
}
function setSetting(key, newValue)
{
	if (!settings.hasOwnProperty(key))
	{
		return;
	}
	const oldValue = getSetting(key);
	localStorage.setItem(getSettingName(key), JSON.stringify(newValue));
	if (oldValue !== newValue)
	{
		(observedSettings.get(key) || []).forEach(fn => fn(key, oldValue, newValue));
	}
}
function initSettings()
{
	if (!localStorage.hasOwnProperty('setSoundToggleDefault'))
	{
		const defaultSound = 'off';
		localStorage.setItem('soundToggle', defaultSound);
		localStorage.setItem('setSoundToggleDefault', true);
		document.getElementById('sound-toggle').innerHTML = defaultSound;
	}

	const settingStyle = document.createElement('style');
	settingStyle.innerHTML = `
#settings-tab td.setting
{
	color: pink;
}
#settings-tab td.setting label
{
	cursor: pointer;
}
#settings-tab td.setting label:hover
{
	color: red;
}
#settings-tab td.setting.reload::after
{
	color: orange;
	content: '*';
	float: right;
	margin: 0 3px;
}
	`;
	document.head.appendChild(settingStyle);

	const table = document.getElementById('settings-tab').querySelector('table');
	if (!table)
	{
		return;
	}
	const headerRow = table.insertRow(-1);
	headerRow.innerHTML = `<th style="background-color:black;color:orange">
		Userscript "DH1 Fixed"<br>
		<span style="font-size: 0.9rem;">(* changes require reloading the tab)</span>
	</th>`;

	for (let key in settings)
	{
		const row = table.insertRow(-1);
		row.innerHTML = `<td class="setting ${settings[key].requiresReload ? 'reload' : ''}">
			<input type="checkbox" id="userscript-${key}" ${getSetting(key) ? 'checked="checked"' : ''}>
			<label for="userscript-${key}">
				${settings[key].title}
			</label>
		</td>`;
		const checkbox = document.getElementById('userscript-' + key);
		checkbox.addEventListener('change', () =>
		{
			setSetting(key, checkbox.checked);
		});
	}

	const settingLink = document.querySelector('.top-menu td[onclick^="openTab"]');
	settingLink.addEventListener('click', function ()
	{
		const activeTab = document.querySelector('#tab-tr td[style^="background: linear-gradient(rgb"]');
		if (activeTab)
		{
			activeTab.style.background = 'linear-gradient(black, grey)';
		}
	});
}



/**
 * fix key items
 */

const oilKeyItems = {
	'handheldOilPump': {
		oilPerSecond: () => 1 * parseInt(window.miners, 10)
		, observeList: [
			'miners'
		]
	}
	, 'bindedOilPipe': {
		oilPerSecond: () => [100, 200, 300][window.bindedUpgradeOilPipe]
		, observeList: [
			'bindedUpgradeOilPipe'
		]
	}
	, 'bindedPumpJack': {
		oilPerSecond: () =>
		{
			const pumpjackProduction = 30
				+ (window.bindedRedPumpJack > 0 ? 15 : 0)
				+ (window.bindedDragonPumpjacks > 0 ? 15 : 0);
			return pumpjackProduction * parseInt(window.bindedPumpJack, 10);
		}
		, observeList: [
			'bindedRedPumpJack'
			, 'bindedDragonPumpjacks'
		]
	}
	, 'bindedOilFactory': {
		oilPerSecond: () => 2 * parseInt(window.oilFactoryWorkers, 10)
		, observeList: [
			'oilFactoryWorkers'
		]
	}
	, 'bindedOilRefinery': {
		oilPerSecond: () => Math.min(5e-6 * parseInt(window.oil, 10), 500)
		, observeList: [
			'oil'
		]
	}
	, 'bindedGhostPipeSheet': {
		oilPerSecond: () =>
		{
			let ghostPipes = 0;
			for (let i = 1; i <= 6; i++)
			{
				if (window['bindedGhostPipe' + i] > 0)
				{
					ghostPipes++;
				}
			}
			return ghostPipes == 6 ? 200 * 6 : 100 * ghostPipes;
		}
		, observeList: [
			'bindedGhostPipe1'
			, 'bindedGhostPipe2'
			, 'bindedGhostPipe3'
			, 'bindedGhostPipe4'
			, 'bindedGhostPipe5'
			, 'bindedGhostPipe6'
		]
	}
};
function fixKeyItems()
{
	// remove unnecessary br element
	const oilPump = document.getElementById('key-item-handheldOilPump-box');
	let br = oilPump && oilPump.nextElementSibling;
	if (!br)
	{
		br = document.createElement('br');
	}

	// add br element after img in oil pipe element
	const oilPipe = document.getElementById('key-item-bindedOilPipe-box');
	let img = oilPipe && oilPipe.children[0];
	img = img && img.children[0];
	img.parentNode.insertBefore(br, img.nextSibling);

	// add display for oil per second
	const oilStyle = document.createElement('style');
	oilStyle.innerHTML = `
.oil-production-wrapper
{
	color: black;
	display: block;
	font-size: 14px;
}
.oil-production-wrapper::before
{
	content: '+';
}
.oil-production-wrapper::after
{
	content: '/s';
}
#key-item-bindedOilRefinery-box > .text-wrapper,
#key-item-bindedGhostPipeSheet-box > .text-wrapper
{
	display: none;
}
	`;
	document.head.appendChild(oilStyle);

	function updateOilProduction(key, el)
	{
		if (window[key] > 0)
		{
			const oilProd = Math.floor(oilKeyItems[key].oilPerSecond() * 10) / 10;
			el.textContent = formatNumber(oilProd);
		}
	}
	const oilImages = document.querySelectorAll('.item-box-title img[src="images/oil.png"]');
	for (let i = 0; i < oilImages.length; i++)
	{
		const img = oilImages[i];
		const boxTitle = img.parentElement;
		const key = boxTitle.parentElement.id.replace(/^key-item-(.+)-box$/, '$1');
		if (oilKeyItems.hasOwnProperty(key))
		{
			const info = oilKeyItems[key];
			const oilWrapper = document.createElement('span');
			oilWrapper.className = 'oil-production-wrapper';
			const oilProduction = document.createElement('span');
			oilProduction.className = 'oil-production';
			oilWrapper.appendChild(oilProduction);
			boxTitle.insertBefore(oilWrapper, img);
			oilWrapper.appendChild(img);
			updateOilProduction(key, oilProduction);

			info.observeList.unshift(key);
			observe(info.observeList, () => updateOilProduction(key, oilProduction));
		}
	}

	const oldOpenBindedOilFactoryDialogue = window.openBindedOilFactoryDialogue;
	window.openBindedOilFactoryDialogue = () =>
	{
		const maxWorkers = window.bindedRedFactoryOrb > 0 ? 300 : 100;
		window.miscMultipleInput(
			'How many factory workers do you wish to hire?<br>You can hire up to ' + maxWorkers + '.<br><br>'
				+ 'Costs: 1<img src="images/pic_coin2.png" width="20px" height="20px" style="vertical-align: middle"> per worker'
			, 'oilFactoryWorkers'
			, '0'
			, 'MISC_MULTIPLE='
		);
	}
}



/**
 * fix farming
 */

const seedOrder = ['bloodLeafSeeds', 'redMushroomSeeds', 'dottedGreenLeafSeeds', 'potatoSeeds', 'strawberrySeeds', 'greenLeafSeeds', 'redMushroomTreeSeeds', 'wheatSeeds', 'blewitMushroomSeeds', 'limeLeafSeeds', 'blewitMushroomTreeSeeds', 'snapeGrassSeeds', 'starDustSeeds', 'appleTreeSeeds', 'iceBerrySeeds', 'goldLeafSeeds', 'starDustTreeSeeds', 'stripedLeafSeeds', 'essenceSeeds', 'crystalLeafSeeds', 'megaDottedGreenLeafSeeds', 'megaRedMushroomSeeds', 'essenceTreeSeeds', 'megaGreenLeafSeeds', 'stripedCrystalLeafSeeds', 'megaBlewitMushroomSeeds', 'megaLimeLeafSeeds'];
const seeds = {
	bloodLeafSeeds: {
		title: 'Blood Leaf Seed'
		, level: 1
		, diesUntil: 0
		, time: 5
		, xp: 1e6
	}
	, redMushroomSeeds: {
		title: 'Red Mushroom Seed'
		, level: 1
		, diesUntil: 0
		, time: 15
		, xp: 100
	}
	, dottedGreenLeafSeeds: {
		title: 'Green Dotted Leaf Seed'
		, level: 1
		, diesUntil: 15
		, time: 30
		, xp: 250
	}
	, potatoSeeds: {
		title: 'Potato'
		, level: 5
		, diesUntil: 0
		, time: 15
		, xp: 35
	}
	, strawberrySeeds: {
		title: 'Strawberry Seed'
		, level: 10
		, diesUntil: 0
		, time: 30
		, xp: 85
	}
	, greenLeafSeeds: {
		title: 'Green Leaf Seed'
		, level: 10
		, diesUntil: 25
		, time: 60
		, xp: 500
	}
	, redMushroomTreeSeeds: {
		title: 'Red Mushroom Tree Seed'
		, level: 10
		, diesUntil: 30
		, time: 8*60
		, xp: 2e3
	}
	, wheatSeeds: {
		title: 'Wheat Seed'
		, level: 15
		, diesUntil: 0
		, time: 15
		, xp: 95
	}
	, blewitMushroomSeeds: {
		title: 'Blewit Mushroom Seed'
		, level: 15
		, diesUntil: 0
		, time: 20
		, xp: 200
	}
	, limeLeafSeeds: {
		title: 'Lime Leaf Seed'
		, level: 20
		, diesUntil: 40
		, time: 1.5*60
		, xp: 1500
	}
	, blewitMushroomTreeSeeds: {
		title: 'Blewit Mushroom Tree Seed'
		, level: 20
		, diesUntil: 40
		, time: 10*60
		, xp: 4e3
	}
	, snapeGrassSeeds: {
		title: 'Snape Grass Seed'
		, level: 25
		, diesUntil: 0
		, time: 30
		, xp: 300
	}
	, starDustSeeds: {
		title: 'Stardust Seed'
		, level: 30
		, diesUntil: 0
		, time: 30
		, xp: 750
	}
	, appleTreeSeeds: {
		title: 'Apple Tree Seed'
		, level: 30
		, diesUntil: 45
		, time: 8*60
		, xp: 5e3
	}
	, iceBerrySeeds: {
		title: 'Ice Berry Seed'
		, level: 35
		, diesUntil: 0
		, time: 60
		, xp: 450
	}
	, goldLeafSeeds: {
		title: 'Gold Leaf Seed'
		, level: 40
		, diesUntil: 55
		, time: 4*60
		, xp: 10e3
	}
	, starDustTreeSeeds: {
		title: 'Stardust Tree Seed'
		, level: 40
		, diesUntil: 55
		, time: 5*60
		, xp: 15e3
	}
	, stripedLeafSeeds: {
		title: 'Striped Gold Leaf Seed'
		, level: 55
		, diesUntil: 70
		, time: 7*60
		, xp: 25e3
	}
	, essenceSeeds: {
		title: 'Essence Seed'
		, level: 60
		, diesUntil: 0
		, time: 3*60
		, xp: 30e3
	}
	, crystalLeafSeeds: {
		title: 'Crystal Leaf Seed'
		, level: 70
		, diesUntil: 85
		, time: 10*60
		, xp: 40e3
	}
	, megaDottedGreenLeafSeeds: {
		title: 'Mega Dotted Green Leaf Seed'
		, level: 70
		, diesUntil: 0
		, time: 16*60
		, xp: 12500
	}
	, megaRedMushroomSeeds: {
		title: 'Mega Red Mushroom Seed'
		, level: 70
		, diesUntil: 0
		, time: 16*60
		, xp: 20500
	}
	, essenceTreeSeeds: {
		title: 'Essence Tree Seed'
		, level: 80
		, diesUntil: 90
		, time: 12*60
		, xp: 50500
	}
	, megaGreenLeafSeeds: {
		title: 'Mega Green Leaf Seed'
		, level: 80
		, diesUntil: 0
		, time: 20*60
		, xp: 21e3
	}
	, stripedCrystalLeafSeeds: {
		title: 'Striped Crystal Leaf Seed'
		, level: 85
		, diesUntil: 95
		, time: 15*60
		, xp: 90e3
	}
	, megaBlewitMushroomSeeds: {
		title: 'Mega Blewit Mushroom Seed'
		, level: 85
		, diesUntil: 0
		, time: 20*60
		, xp: 21500
	}
	, megaLimeLeafSeeds: {
		title: 'Mega Lime Leaf Seed'
		, level: 85
		, diesUntil: 0
		, time: 23*60
		, xp: 32e3
	}
};
function fixFarming()
{
	const inputs = document.querySelectorAll('#dialog-planter input[type="image"]');
	for (let i = inputs.length-1; i >= 0; i--)
	{
		const input = inputs[i];
		const key = input.id.replace('planter-input-img-', '');
		const seed = seeds[key];
		input.title = seed.title;
	}

	if (!getSetting('reorderFarming'))
	{
		return;
	}

	let planterEl = inputs[0];
	const planterParent = planterEl.parentNode;
	let boxEl = document.querySelector('#farming-tab .inventory-item-box-farming').parentNode;
	const boxParent = boxEl.parentNode;
	const btnParent = document.getElementById('seed-menu-popup');
	let btnEl = btnParent.firstElementChild;
	for (let i = seedOrder.length-1; i >= 0; i--)
	{
		const key = seedOrder[i];
		const input = document.getElementById('planter-input-img-' + key);
		if (input)
		{
			planterParent.insertBefore(input, planterEl);
			planterParent.insertBefore(document.createTextNode(' '), planterEl);
			planterEl = input;
		}
		const box = document.getElementById('item-' + key + '-box');
		if (box)
		{
			boxParent.insertBefore(box.parentNode, boxEl);
			boxParent.insertBefore(document.createTextNode(' '), boxEl);
			boxEl = box.parentNode;
		}
		const btn = document.getElementById('btn-' + key);
		if (btn)
		{
			if (key.startsWith('mega'))
			{
				const title = {
					'megaDottedGreenLeafSeeds': 'Mega Dotted Green Leaf Seed (Stops dying at level 85)'
					, 'megaGreenLeafSeeds': 'Mega Green Leaf Seed (Stops dying at level 95)'
					, 'megaLimeLeafSeeds': 'Mega Lime Leaf Seed (Stops dying at level 95)'
				}[key];
				if (title)
				{
					btn.title = title;
				}
			}
			else
			{
				btn.title = btn.title.replace('dieing', 'dying');
			}
			btnParent.insertBefore(btn, btnEl);
			btnParent.insertBefore(document.createTextNode(' '), btnEl);
			btnEl = btn;
		}
	}

	const oldSelectSeedForPlanter = window.selectSeedForPlanter;
	window.selectSeedForPlanter = (seedChosen) =>
	{
		oldSelectSeedForPlanter(seedChosen);
		localStorage.setItem('farming.plantingSeed', seedChosen);
	}
	const seed = localStorage.getItem('farming.plantingSeed');
	if (window.bindedPlanter >= 1 && seed != null)
	{
		window.selectSeedForPlanter(seed);
	}
}



/**
 * fix server message
 */

function fixServerMsg()
{
	const serverMsgEl = document.querySelector('#server-inner-msg');
	if (!serverMsgEl)
	{
		return;
	}

	const serverMsg = serverMsgEl.textContent;
	const close = document.querySelector('#server-top-msg > *:last-child');
	if (localStorage.getItem('closedServerMsg') == serverMsg)
	{
		close.click();
		return;
	}

	close.addEventListener('click', function ()
	{
		localStorage.setItem('closedServerMsg', serverMsg);
	});
}



/**
 * highlight requirements
 */

const highlightBgColor = 'hsla(0, 100%, 90%, 1)';
const imgSrc2Key = {
	'bronzebar': 'bronzeBar'
	, 'ironbar': 'ironBar'
	, 'silverbar': 'silverBar'
	, 'goldbar': 'goldBar'
	, 'stonefurnace': 'stoneFurnace'
	, 'bronzefurnace': 'bronzeFurnace'
	, 'ironfurnace': 'ironFurnace'
	, 'silverfurnace': 'silverFurnace'
	, 'goldfurnace': 'goldFurnace'
	, 'pic_coin': 'coins'
	, 'stardust': 'starDust'
	, 'treasureKey': 'treasureChestKey'
	, 'dottedgreenleaf': 'dottedGreenLeaf'
	, 'redmushroom': 'redMushroom'
	, 'greenleaf': 'greenLeaf'
	, 'limeleaf': 'limeLeaf'
	, 'blewitmushroom': 'blewitMushroom'
	, 'goldleaf': 'goldLeaf'
	, 'pureWater': 'pureWaterPotion'
	, 'snapegrass': 'snapeGrass'
	, 'crystalleaf': 'crystalLeaf'
	, 'starDustConverter': 'starGemPotion'
	, 'superStargemPotion': 'superStarGemPotion'
	, 'superoilpotion': 'superOilPotion'
	, 'wooden_slave': 'miners'
	, 'fishingRodFarmer': 'fishingRod'
	, 'goldenStriper': 'goldenStriperPotion'
	, 'orb': 'orbOfTransformation'
	, 'anyorb': 'emptyBlueOrb'
	, 'anyorb2': 'emptyGreenOrb'
	, 'upgradedOrb': 'superOrbOfTransformation'
};
const imgSrc2LevelKey = {
	'watering-can': 'merchanting'
	, 'cookingskill': 'cooking'
	, 'archaeology': 'exploring'
	, 'wizardHatIcon': 'magic'
};
function amount2Int(str)
{
	return parseInt(str.replace(/M/i, '000000').replace(/B/i, '000000000').replace(/\D/g, ''), 10);
}
function checkRequirements(row, xpKey, init = true)
{
	const isRed = row.style.backgroundColor == 'rgb(255, 128, 128)';
	let everythingFulfilled = true;
	let keys2Observe = [];

	const levelEl = row.cells[2];
	const neededLevel = parseInt(levelEl.textContent, 10);
	const levelHighEnough = neededLevel <= window.getLevel(window[xpKey]);
	levelEl.style.color = levelHighEnough ? '' : 'red';
	everythingFulfilled = everythingFulfilled && levelHighEnough;
	keys2Observe.push(xpKey);

	const reqEl = row.cells[3];
	const children = reqEl.children;
	// check for each requirement if it is fulfilled
	for (let i = 0; i < children.length; i++)
	{
		const el = children[i];
		if (el.tagName != 'IMG')
		{
			continue;
		}
		const imgKey = el.src.replace(/^.+images\/.*?([^\/]+)\..+$/, '$1');
		const key = imgSrc2Key[imgKey] || imgKey;
		// wrap the amount with a span element
		let valueSpan = el.nextSibling;
		if (valueSpan.nodeType == Node.TEXT_NODE)
		{
			const valueTextNode = valueSpan;
			valueSpan = document.createElement('span');
			valueTextNode.parentNode.insertBefore(valueSpan, valueTextNode);
			valueSpan.appendChild(valueTextNode);
			valueTextNode.textContent = ' ' + formatNumbersInText(valueTextNode.textContent.trim());
		}

		const amount = amount2Int(valueSpan.textContent);
		const has = parseInt(window[key] || '0', 10);
		const isSkill = imgSrc2LevelKey.hasOwnProperty(key);
		let fulfilled = has >= amount;
		if (isSkill)
		{
			const xpKey = imgSrc2LevelKey[key] + 'Xp';
			fulfilled = window.getLevel(window[xpKey]) >= amount;
			keys2Observe.push(xpKey);
		}
		else if (key == 'gem')
		{
			fulfilled = window.sapphire >= amount || window.emerald >= amount || window.ruby >= amount || window.diamond >= amount;
			keys2Observe.push('sapphire', 'emerald', 'ruby', 'diamond');
		}
		else if (/furnace/i.test(key))
		{
			const furnaceLevel = furnaceLevels.indexOf(key.replace(/furnace/i, ''));
			fulfilled = fulfilled || parseInt(window.bindedFurnaceLevel, 10) >= furnaceLevel;
			keys2Observe.push(key, 'bindedFurnaceLevel');
		}
		else if (key == 'anybar')
		{
			const amountArray = valueSpan.parentNode.getAttribute('tooltip').replace(/\D*$/, '').split('/')
				.map(str => amount2Int(str));
			fulfilled = false;
			for (let i = 0; i < barTypes.length; i++)
			{
				const bar = barTypes[i];
				fulfilled = fulfilled || window[bar + 'Bar'] >= amountArray[i];
				keys2Observe.push(bar);
			}
		}
		else if (/(?:wand|staff)$/i.test(key))
		{
			const bindedKey = 'binded' + key[0].toUpperCase() + key.substr(1);
			fulfilled = fulfilled || window[bindedKey] > 0;
			keys2Observe.push(key, bindedKey);
		}
		else
		{
			if (!window.hasOwnProperty(imgKey) && !imgSrc2Key.hasOwnProperty(imgKey))
			{
				console.debug('missing key handling:', key, el);
			}
			keys2Observe.push(key);
		}
		valueSpan.style.color = fulfilled ? '' : 'red';
		everythingFulfilled = everythingFulfilled && (isSkill || fulfilled);
	}
	levelEl.style.backgroundColor = everythingFulfilled ? '' : highlightBgColor;
	reqEl.style.backgroundColor = everythingFulfilled ? '' : highlightBgColor;
	row.style.backgroundColor = everythingFulfilled ? 'rgb(194, 255, 133)' : 'rgb(255, 128, 128)';

	if (init)
	{
		observe(keys2Observe, () => checkRequirements(row, xpKey, false));
	}
}

function highlightRequirements()
{
	const craftingTables = {
		'crafting': {
			tabId: 'crafting'
			, xp: 'crafting'
		}
		, 'brewing': {
			tabId: 'brewing'
			, xp: 'brewing'
		}
		, 'achCraft': {
			tabId: 'archaeology-crafting'
			, xp: 'crafting'
		}
		, 'cooking': {
			tabId: 'cooking'
			, xp: 'cooking'
		}
		, 'magicCraft': {
			tabId: 'magiccrafting'
			, xp: 'crafting'
		}
		, 'spellbook': {
			tabId: 'spellbook'
			, xp: 'magic'
		}
	};
	for (let key in craftingTables)
	{
		const info = craftingTables[key];
		const xpName = info.xp + 'Xp';
		const table = document.querySelector('#' + info.tabId + '-tab table.table-stats');
		const rows = table.rows;
		for (let i = 0; i < rows.length; i++)
		{
			const row = rows[i];
			if (row.getElementsByTagName('th').length > 0 || row.id == 'craft-ghostKey')
			{
				continue;
			}

			checkRequirements(row, xpName, true);
		}
	}

	// hightlight mining level for mining table
	function imageSrc2BindedMachineVar(src)
	{
		return {
			'wooden_slave': 'miners'
			, 'rocket': 'bindedRocket'
			, 'mining-drill': 'bindedDrill'
			, 'crusher': 'bindedCrusher'
			, 'giantDrill': 'bindedGiantDrill'
			, 'roadHeader': 'bindedRoadHeader'
			, 'excavators': 'bindedBucketWheelExcavator'
			, 'diamond_pickaxe': 'bindedDiamondMiners'
			, 'giantBWE': 'bindedGiantBWE'
		}[src.replace(/^(?:.*\/)?([^\/]+)\.[^\.\/]+$/, '$1')];
	}
	const redColor = 'hsla(0, 100%, 75%, 1)';
	const lightRedColor = 'hsla(0, 100%, 90%, 1)';
	function highlightMiningLevel()
	{
		const miningLevel = window.getLevel(window.miningXp);
		const table = document.querySelector('#mining-tab table.table-stats');
		const rows = table.rows;
		for (let i = 2; i < rows.length; i++)
		{
			const row = rows[i];
			const level = parseInt(row.cells[2].textContent, 10);
			const highEnough = level <= miningLevel;
			const machineImg = row.cells[3].querySelector('img');
			const machineVar = imageSrc2BindedMachineVar(machineImg.src);
			const hasMachine = window[machineVar] > 0;
			const fulfilled = highEnough && hasMachine;
			row.cells[2].style.color = highEnough ? '' : 'red';
			machineImg.style.border = hasMachine ? '' : '2px solid red';
			row.cells[2].style.backgroundColor = fulfilled ? '' : lightRedColor;
			row.cells[3].style.backgroundColor = fulfilled ? '' : lightRedColor;
			row.style.backgroundColor = fulfilled ? '' : redColor;
		}
	}
	highlightMiningLevel();
	observe('miningXp', () => highlightMiningLevel());

	const oldLoadGhostPirates = window.loadGhostPirates;
	const ghostKeyRow = document.getElementById('craft-ghostKey');
	window.loadGhostPirates = () =>
	{
		oldLoadGhostPirates();
		if (ghostEssenceTimer > 0)
		{
			// this method is called once per second, so there is no need for observing any values
			checkRequirements(ghostKeyRow, 'craftingXp', false);
		}
	};

	function highlightFarmingLevel()
	{
		const farmingLevel = window.getLevel(window.merchantingXp);
		const seedBtns = document.querySelectorAll('#seed-menu-popup > div.dialogue-seed-btn');
		for (let i = 0; i < seedBtns.length; i++)
		{
			const seedBtn = seedBtns[i];
			const table = seedBtn.firstElementChild;
			const levelCell = table.rows[0].cells[1];
			const level = parseInt(levelCell.textContent.replace(/\D/g, ''), 10);
			const tooLow = level > farmingLevel;
			seedBtn.style.backgroundColor = tooLow ? 'hsla(0, 50%, 75%, 1)' : '';
			levelCell.style.color = tooLow ? 'red' : '';
			levelCell.style.textShadow = tooLow ? '0 0 5px white' : '';
		}
	}
	highlightFarmingLevel();
	observe('merchantingXp', () => highlightFarmingLevel());

	// achievement upgrades
	function highlightAchievementUpgrades()
	{
		const points = parseInt(window.achPoints, 10);
		const spans = document.querySelectorAll('span[id^="cost-ach-"][id$="AchUpgrade"]');
		for (let i = 0; i < spans.length; i++)
		{
			const span = spans[i];
			const notEnough = parseInt(span.textContent, 10) > points;
			span.style.setProperty('color', notEnough ? 'red' : '', 'important');
			span.style.fontWeight  = notEnough ? 'bold' : '';
		}
	}
	highlightAchievementUpgrades();
	observe('achPoints', () => highlightAchievementUpgrades());
}



/**
 * fix market
 */

function filterMarket(category, text)
{
	const tableAlone = document.getElementById('market-buy-table');
	const itemRows = tableAlone.rows;
	const dataBox = document.getElementById('market-data-box');

	for (let i = 1; i < itemRows.length; i++)
	{
		const row = itemRows[i];
		const itemType = row.getAttribute('item-type');
		const showCategory = category == 'all' || category == itemType;
		const itemTitle = row.title.toLowerCase();
		const showText = itemTitle.includes(text.toLowerCase());
		row.style.display = (showCategory && showText) ? '' : 'none';
	}

	dataBox.style.display = 'none';
	if (category == 'data')
	{
		document.getElementById('globals-taxes').textContent = formatNumber(window.globalTaxes);
		dataBox.style.display = 'inline-block';
	}
}
const itemCategories = {
	minerals: {
		title: 'Minerals'
		, items: [
			'stone'
			, 'copper'
			, 'tin'
			, 'iron'
			, 'silver'
			, 'gold'
			, 'quartz'
			, 'flint'
			, 'marble'
			, 'titanium'
			, 'moonStone'
			, 'promethium'
			, 'runite'
			, 'sapphire'
			, 'emerald'
			, 'ruby'
			, 'diamond'
			, 'dragonPickaxe'
		]
	}
	, bindables: {
		title: 'Crafting/Machinery + bars'
		, items: [
			'oil'
			, 'oilBarrel'
			, 'oilPipe'
			, 'pumpJack'
			, 'redPumpJack'
			, 'dragonPumpjacks'
			, 'oilFactory'
			, 'ghostPipeSheet'
			, 'ghostPipe1'
			, 'ghostPipe2'
			, 'ghostPipe3'
			, 'ghostPipe4'
			, 'ghostPipe5'
			, 'ghostPipe6'
			, 'trowel'
			, 'brewingKit'
			, 'silverFurnace'
			, 'goldFurnace'
			, 'ancientFurnace'
			, 'promethiumFurnace'
			, 'dragonFurnace'
			, 'promethiumWrench'
			, 'drill'
			, 'crusher'
			, 'giantDrill'
			, 'roadHeader'
			, 'bucketWheelExcavator'
			, 'sandCollector'
			, 'rocket'
			, 'robot'
			, 'bronzeBar'
			, 'ironBar'
			, 'silverBar'
			, 'goldBar'
			, 'promethiumBar'
			, 'runiteBar'
		]
	}
	, seeds: {
		title: 'Seeds'
		, items: [
			'redMushroomSeeds'
			, 'dottedGreenLeafSeeds'
			, 'greenLeafSeeds'
			, 'redMushroomTreeSeeds'
			, 'blewitMushroomSeeds'
			, 'limeLeafSeeds'
			, 'blewitMushroomTreeSeeds'
			, 'snapeGrassSeeds'
			, 'starDustSeeds'
			, 'appleTreeSeeds'
			, 'goldLeafSeeds'
			, 'starDustTreeSeeds'
			, 'stripedLeafSeeds'
			, 'essenceSeeds'
			, 'crystalLeafSeeds'
			, 'essenceTreeSeeds'
			, 'stripedCrystalLeafSeeds'
		]
	}
	, brewing: {
		title: 'Leafs + Brewing'
		, items: [
			'dottedGreenLeaf'
			, 'greenLeaf'
			, 'limeLeaf'
			, 'goldLeaf'
			, 'stripedLeaf'
			, 'crystalLeaf'
			, 'stripedCrystalLeaf'
			, 'redMushroom'
			, 'blewitMushroom'
			, 'greenMushroom'
			, 'snapeGrass'
			, 'strangeLeaf'
			, 'whaleTooth'
			, 'vial'
			, 'pureWaterPotion'
			, 'cactusWater'
			, 'swampWater'
			, 'starDustPotion'
			, 'superStarDustPotion'
			, 'megaStarDustPotion'
			, 'superCompostPotion'
			, 'explorersPotion'
			, 'chestPotion'
			, 'superChestPotion'
		]
	}
	, exploring: {
		title: 'Exploring'
		, items: [
			'silverOven'
			, 'goldOven'
			, 'promethiumOven'
			, 'runiteOven'
			, 'ancientOven'
			, 'dragonOven'
			, 'potato'
			, 'strawberry'
			, 'wheat'
			, 'apple'
			, 'strawberryPie'
			, 'rawShrimp'
			, 'shrimp'
			, 'rawSardine'
			, 'sardine'
			, 'rawTuna'
			, 'tuna'
			, 'tunaCooker'
			, 'rawSwordfish'
			, 'swordfish'
			, 'swordfishCooker'
			, 'rawShark'
			, 'shark'
			, 'sharkCooker'
			, 'rawWhale'
			, 'whale'
			, 'whaleCooker'
			, 'rawEel'
			, 'eel'
			, 'rawRainbowFish'
			, 'rainbowFishCooker'
			, 'dragonFishingRod'
			, 'fishingNet'
		]
	}
	, equipement: {
		title: 'Equipement'
		, items: [
			'promethiumHelmet'
			, 'runiteHelmet'
			, 'dragonHelmet'
			, 'promethiumBody'
			, 'runiteBody'
			, 'dragonBody'
			, 'promethiumLegs'
			, 'runiteLegs'
			, 'promethiumSword'
			, 'runiteSword'
			, 'dragonSword'
			, 'ancientShield'
			, 'amuletOfTheSea'
			, 'dragonAmulet'
			, 'coinRing'
			, 'lavaRing'
			, 'pureWaterRing'
		]
	}
	, magic: {
		title: 'Magic'
		, items: [
			'goldStaff'
			, 'promethiumStaff'
			, 'runiteStaff'
			, 'dragonStaff'
			, 'goldWand'
			, 'promethiumWand'
			, 'runiteWand'
			, 'dragonWand'
			, 'emptyEssence'
			, 'chargedMineralEssence'
			, 'chargedMetallicEssence'
			, 'chargedOilEssence'
			, 'chargedEnergyEssence'
			, 'chargedNatureEssence'
			, 'chargedOrbEssence'
			, 'chargedGemEssence'
			, 'dottedGreenRoots'
			, 'greenRoots'
			, 'limeRoots'
			, 'goldRoots'
			, 'stripedGoldRoots'
			, 'crystalRoots'
			, 'stripedCrystalRoots'
		]
	}
	, orbs: {
		title: 'Orbs'
		, items: [
			'orbOfTransformation'
			, 'superOrbOfTransformation'
			, 'upgradeEnchantedRake'
			, 'upgradeWrenchOrb'
			, 'upgradeOilPipe'
			, 'exploringOrb'
			, 'upgradeFurnaceOrb'
			, 'upgradePumpJackOrb'
			, 'upgradeEnchantedHammer'
			, 'greenPumpjackOrb'
			, 'greenWizardOrb'
			, 'rocketFuelOrb'
			, 'redBrewingKitOrb'
			, 'redFactoryOrb'
		]
	}
	, misc: {
		title: 'Misc'
		, items: [
			'starDust'
			, 'unboundDonorCoins'
			, 'pumpkinSigil'
			, 'santaHatSigil'
			, 'easterEggSigil'
			, 'ghostSigil'
			, 'treeSigil'
			, 'lava'
			, 'sapphireKey'
			, 'emeraldKey'
			, 'rubyKey'
			, 'treasureChestKey'
			, 'dragonKey'
			, 'treasureChestKey2'
			, 'tnt'
			, 'vendorRerollScroll'
			, 'ancientCrystal'
			, 'dragonAxe'
		]
	}
};
function fixMarket()
{
	// fix loading icons
	const loadingImgs = document.querySelectorAll('[src="images/loading_statique.png"]');
	for (var i = 0; i < loadingImgs.length; i++)
	{
		loadingImgs[i].src = 'images/loading.gif';
	}

	const oldLoadTradableTable = window.loadTradableTable;
	window.loadTradableTable = () =>
	{
		const tradableTable = document.getElementById('selling-tradable-table');
		while (tradableTable.childNodes.length > 0)
		{
			tradableTable.removeChild(tradableTable.firstChild);
		}

		window.platinumTradables = [];
		const itemList = window.tradableItems;
		const itemPrefix = 'tradable-item-';
		for (let i = 0; i < itemList.length; i++)
		{
			const item = itemList[i];
			const tradableData = item.split('~');
			const itemVarName = tradableData[0];
			const lowerLimit = tradableData[1];
			const upperLimit = tradableData[2];
			const isPlatinum = tradableData[3];

			if (document.getElementById(itemPrefix + itemVarName) != null)
			{
				continue;
			}

			const isPlat = parseInt(isPlatinum, 10) == 1;
			if (isPlat)
			{
				window.platinumTradables.push(itemVarName);
			}

			const inputEl = document.createElement('input');
			inputEl.type = 'image';
			inputEl.title = itemVarName;
			inputEl.src = window.getImagePath(itemVarName);
			inputEl.id = itemPrefix + itemVarName;
			inputEl.addEventListener('click', () =>
			{
				window.setItemNameToTradeInSlot(itemVarName, lowerLimit + '-' + upperLimit, (isPlat ? '1' : '0'));
			});
			inputEl.addEventListener('contextmenu', () =>
			{
				window.setItemNameToTradeInSlotLimits(itemVarName, lowerLimit + '-' + upperLimit, (isPlat ? '1' : '0'));
			});
			tradableTable.appendChild(inputEl);
		}

		// add categories for market items
		const tmp = document.createElement('div');
		tradableTable.insertBefore(tmp, tradableTable.firstChild);
		for (let key in itemCategories)
		{
			const category = itemCategories[key];
			const h3 = document.createElement('h3');
			h3.textContent = category.title;
			tradableTable.insertBefore(h3, tmp);

			for (let item of category.items)
			{
				const el = document.getElementById('tradable-item-' + item);
				if (el)
				{
					tradableTable.insertBefore(el, tmp);
				}
			}
		}
		tradableTable.removeChild(tmp);
	};
	if (window.hasOwnProperty('tradableItems'))
	{
		window.loadTradableTable();
	}

	// add style for category tabs
	const style = document.createElement('style');
	style.innerHTML = `
#selling-tradable-table h3
{
	margin-bottom: .25rem;
	margin-top: .75rem;
}
#selling-tradable-table input[type="image"]
{
	margin-right: .5rem;
	height: 50px;
	width: 50px;
}
#selling-tradable-table #tradable-item-trowel
{
	height: 16.7px;
	width: 50px;
}
#selling-tradable-table #tradable-item-orbOfTransformation,
#selling-tradable-table #tradable-item-superOrbOfTransformation
{
	margin-left: -12.5px;
	margin-right: calc(.5rem - 12.5px);
	width: 65px;
}
#selling-tradable-table #tradable-item-upgradeEnchantedHammer
{
	margin-left: -4px;
	margin-right: calc(.5rem - 4px);
	width: 58px;
}
#td-filter-market.selected
{
	background: -webkit-linear-gradient(#800000, #390000);
	background: -o-linear-gradient(#800000, #390000);
	background: -moz-linear-gradient(#800000, #390000);
	background: linear-gradient(#800000, #390000);
}
	`;
	document.head.appendChild(style);

	let lastFilterText = '';
	let lastFilterCategory = 'all';
	window.filterBuyables = (text) =>
	{
		lastFilterText = text;
		filterMarket(lastFilterCategory, lastFilterText);
	};
	window.setFilterTable = (itemFilter) =>
	{
		const row = document.querySelector('.market-filter-tbl-button');
		const oldBtn = row.querySelector('td.selected');
		if (oldBtn)
		{
			oldBtn.classList.remove('selected');
		}
		const filterBtn = row.querySelector(`td[onclick^="setFilterTable('${itemFilter}')"]`);
		if (filterBtn)
		{
			filterBtn.classList.add('selected');
		}
		lastFilterCategory = window.itemFilterGlobal = itemFilter;
	};
	window.filterTable = () =>
	{
		filterMarket(lastFilterCategory, lastFilterText);
	};
	const oldApplyToBuyingTable = window.applyToBuyingTable;
	window.applyToBuyingTable = (...args) =>
	{
		const ret = oldApplyToBuyingTable(...args);
		filterMarket(lastFilterCategory, lastFilterText);
		return ret;
	};
	window.setFilterTable(lastFilterCategory);

	// add "clear search"-button
	const searchInput = document.querySelector('input[onkeyup^="filterBuyables"]');
	searchInput.id = 'market-search';
	const tmpWrapper = createTemplateWrapper(`<input type="button" value="Clear search" style="float: left; margin-left: 10px;" onclick="$('#market-search').val('').keyup()">`);
	const parent = searchInput.parentNode;
	const el = searchInput.nextSibling;
	const childNodes = tmpWrapper.childNodes;
	for (let i = 0; i < childNodes.length; i++)
	{
		parent.insertBefore(childNodes[i], el);
	}

	// fix icon paths
	const oldGetImagePath = window.getImagePath;
	window.getImagePath = (itemVar) =>
	{
		if (itemVar == 'dragonFurnace')
		{
			return 'images/crafting/dragonFurnace.gif';
		}
		return oldGetImagePath(itemVar);
	};

	// auto focus the search input
	const oldSelectItemToTradeDialog = window.selectItemToTradeDialog;
	window.selectItemToTradeDialog = (sellOrBuy, slot) =>
	{
		oldSelectItemToTradeDialog(sellOrBuy, slot);
		window.$('#id_search').focus();
	};
}



/**
 * improve level calculation
 */

let levelXp = new Array(maxLevelVirtual+1);
function calcLevelXp(level)
{
	return level > 0 ? Math.round(Math.pow((level-1), 3 + ((level-1) / 200))) : 0;
}
function getLevelXp(level)
{
	return levelXp[level-1] || calcLevelXp(level);
}
const getDynamicLevel = (function ()
{
	const size = Math.pow(2, Math.ceil(Math.log2(maxLevel)));
	let xpTree = new Array(size);
	let levelTree = new Array(size);
	const sizeVirtual = Math.pow(2, Math.ceil(Math.log2(maxLevelVirtual)));
	let xpTreeVirtual = new Array(sizeVirtual);
	let levelTreeVirtual = new Array(sizeVirtual);
	createNode(xpTree, levelTree, 1, maxLevel, 0);
	createNode(xpTreeVirtual, levelTreeVirtual, 1, maxLevelVirtual, 0);

	function createNode(xpArray, levelArray, start, end, i)
	{
		const current = start + Math.pow(2, Math.floor(Math.log2(end - start + 1))) - 1;
		xpArray[i] = getLevelXp(current);
		levelArray[i] = current;

		if (current - start > 0)
		{
			createNode(xpArray, levelArray, start, current-1, 2*i + 1);
		}
		if (end - current > 0)
		{
			createNode(xpArray, levelArray, current+1, end, 2*i + 2);
		}
	}

	function getDynamicLevel(playerXP, useVirtual = false)
	{
		const isVirtual = window.virtualLevelsOn !== 0 && useVirtual === true;
		const xpArray = isVirtual ? xpTreeVirtual : xpTree;
		const levelArray = isVirtual ? levelTreeVirtual : levelTree;
		let i = 0;
		let level = 0;
		while (xpArray[i] != null)
		{
			if (playerXP == xpArray[i])
			{
				return levelArray[i];
			}
			else if (playerXP < xpArray[i])
			{
				i = 2*i+1;
			}
			else if (playerXP > xpArray[i])
			{
				level = levelArray[i];
				i = 2*i+2;
			}
		}
		return level;
	}

	return getDynamicLevel;
})();
function getLevel(playerXP)
{
	return getDynamicLevel(playerXP, false);
}
function getVirtualLevel(playerXP)
{
	return getDynamicLevel(playerXP, true);
}

function getGlobalLevel()
{
	return getDynamicGlobalLevel(false);
}
function getDynamicGlobalLevel(useVirtual = false)
{
	return Math.floor(getDynamicLevel(parseInt(window.miningXp, 10), useVirtual))
		+ Math.floor(getDynamicLevel(parseInt(window.craftingXp, 10), useVirtual))
		+ Math.floor(getDynamicLevel(parseInt(window.brewingXp, 10), useVirtual))
		+ Math.floor(getDynamicLevel(parseInt(window.merchantingXp, 10), useVirtual))
		+ Math.floor(getDynamicLevel(parseInt(window.exploringXp, 10), useVirtual))
		+ Math.floor(getDynamicLevel(parseInt(window.cookingXp, 10), useVirtual))
		+ Math.floor(getDynamicLevel(parseInt(window.magicXp, 10), useVirtual))
	;
}
function improveLevelCalculation()
{
	for (var i = 1; i < maxLevelVirtual; i++)
	{
		levelXp[i-1] = calcLevelXp(i);
	}

	const oldFns = {
		getLevel: window.getLevel
		, getVirtualLevel: window.getVirtualLevel
		, getGlobalLevel: window.getGlobalLevel
	};
	const newFns = {
		getLevel: getLevel
		, getVirtualLevel: getVirtualLevel
		, getGlobalLevel: getGlobalLevel
	};
	function switch2FastLevelCalculation()
	{
		const fns = getSetting('useFastLevelCalculation') ? newFns : oldFns;
		window.getLevel = fns.getLevel;
		window.getVirtualLevel = fns.getVirtualLevel;
		window.getGlobalLevel = fns.getGlobalLevel;
	}
	switch2FastLevelCalculation();
	observeSetting('useFastLevelCalculation', () => switch2FastLevelCalculation());
}



/**
 * fix inventory
 */

function fixInventory()
{
	const tab = document.getElementById('gatherings-tab');
	const coinImgs = tab.querySelectorAll('span[id^="item-"][id$="-box"] img[src="images/pic_coin.png"]');
	for (let i = 0; i < coinImgs.length; i++)
	{
		const coinImg = coinImgs[i];
		const price = coinImg.nextSibling;
		if (price.nodeType == Node.TEXT_NODE && !/\d/.test(price.textContent))
		{
			const parent = coinImg.parentNode;
			parent.removeChild(coinImg);
			parent.removeChild(price);
		}
	}
}



/**
 * fix machinery
 */

function getMachineCount(machine)
{
	return window['binded' + machine[0].toUpperCase() + machine.substr(1)];
}
function getOilValueFromMachine(machine)
{
	return (oilConsumption[machine] || 0) * getMachineCount(machine);
}
function updateRepairCost(machine)
{
	const input = document.getElementById('machineryChosenPopup');
	const repairCost = document.getElementById('repair-price-dialog');
	if (!input || !repairCost)
	{
		return;
	}

	machine = machine || input.value;
	const percent = window[machine + 'Repair'];
	const cost = window.getRepairCost(machine, percent);
	repairCost.textContent = formatNumber(cost);
}
function openOilDialogue(varname)
{
	const gearOnPath = 'images/spinning-gear.gif';
	const gearOffPath = 'images/spinning-gear-off.gif';
	const oilArea = document.getElementById('oilUsage-area');
	const oilValue = document.getElementById('oilUsage-value');
	const repairArea = document.getElementById('machinery-repair-area');

	let machine = varname.replace(/key-item-binded([^-]+)-box/, '$1');
	machine = machine[0].toLowerCase() + machine.substr(1);

	// machine name + count
	const name = machineNames[machine];
	const count = getMachineCount(machine);
	const max = 10; // don't know if there is a machine with a different limit...
	let title = document.getElementById('machinery-name');
	if (!title)
	{
		title = document.createElement('h3');
		title.style.marginTop = 0;
		title.id = 'machinery-name';
		const parent = document.getElementById('machinery-dialog');
		parent.insertBefore(title, parent.firstChild);
	}
	title.innerHTML = `${name} <span style="float: right;font-size: 1.2rem;">${count}<span style="font-weight: normal;">/${max}</span><span></span></span>`;

	// PROGRESS BAR
	var hasRepair = window.bindedPromethiumWrench > 0;
	if (machine == 'sandCollector')
	{
		// hide repair part (ensure, it is hidden)
		repairArea.setAttribute('style', 'padding: 0; width: 0px; height: 0px; overflow: hidden; border: 0;');
	}
	else
	{
		// show repair part if available
		repairArea.setAttribute('style', 'display: ' + (hasRepair ? 'block' : 'none') + ';');

		const progressBar = document.getElementById('progress-bar-repair-opened');
		const percent = window[machine + 'Repair'];
		const bgColor = percent < 20 ? 'yellow' : (percent >= 50 ? 'lime' : 'yellow');
		progressBar.style.backgroundColor = bgColor;
		progressBar.style.width = percent + '%';

		let repairButton = document.getElementById('repair-current-machine');
		if (!repairButton)
		{
			repairButton = document.createElement('button');
			repairButton.id = 'repair-current-machine';
			repairButton.style.lineHeight = '24px';
			repairButton.style.margin = '10px 5% 0';
			repairButton.style.width = '90%';
			repairButton.style.position = 'relative';
			repairButton.innerHTML = `<img id="bindedPromethiumWrenchOrb-img" src="images/crafting/promethiumWrench.png" alt="workers" width="23px" height="23px" style="position: absolute; top: 3px; left: 13px;">Repair for <span id="repair-price-dialog"></span><img src="images/pic_coin.png" width="25px" height="25px" style="vertical-align: middle;">`;
			repairButton.onclick = () =>
			{
				const machine = document.getElementById('machineryChosenPopup').value;
				window.send('REPAIR_MACHINERY=' + machine);
			};
			const parent = document.getElementById('machinery-repair-area');
			parent.appendChild(repairButton);
		}
		updateRepairCost(machine);
	}
	// END PROGRESS BAR

	oilValue.innerHTML = window.getOilValueFromMachine(machine);
	document.getElementById('machineryChosenPopup').value = machine;
	const isOn = window[machine + 'AreOn'] == 1;
	document.getElementById('myonoffswitch').checked = isOn;
	document.getElementById('myonoffswitch-gear').src = isOn ? gearOnPath : gearOffPath;
	oilArea.style.display = isOn ? '' : 'none';

	window.$('#machinery-dialog').dialog(
	{
		width: 400
	});
}
const smeltingBarRequirements = {
	glass: {
		oil: 12
		, ores: ['sand']
	}
	, bronze: {
		oil: 1
		, ores: ['copper', 'tin']
	}
	, iron: {
		oil: 50
		, ores: ['iron']
	}
	, silver: {
		oil: 150
		, ores: ['silver']
	}
	, gold: {
		oil: 500
		, ores: ['gold']
	}
	, promethium: {
		oil: 10e3
		, ores: ['promethium']
	}
};
function fixMachinery()
{
	const oldSetSmeltingBarAgain = window.setSmeltingBarAgain;
	let smeltingValue = null;
	window.setSmeltingBarAgain = (barType, amountElement) =>
	{
		// update max amount of ore
		const requirements = smeltingBarRequirements[barType] || { oil: 1, ores: [] };
		const value = parseInt(amountElement.value, 10);
		const furnaceMax = window.getFurnaceCapacityAgain(window.bindedFurnaceLevel);
		const maxOil = parseInt(window.oil, 10) / requirements.oil;
		const maxResource = requirements.ores
			.map((name) => parseInt(window[name], 10))
			.reduce((p, c) => Math.min(p, c), Number.MAX_SAFE_INTEGER)
		;
		const max = Math.min(furnaceMax, maxOil, maxResource);
		amountElement.max = max;
		if (max < value)
		{
			smeltingValue = value;
			amountElement.value = max;
		}
		else if (smeltingValue != null)
		{
			amountElement.value = smeltingValue;
		}

		oldSetSmeltingBarAgain(barType, amountElement);
		localStorage.setItem('smelting.bar', barType);
		localStorage.setItem('smelting.amount', window.amountToSmeltGlobal);
	};
	if (localStorage.getItem('smelting.bar') != null)
	{
		window.barTypeSelectedToSmeltGlobal = localStorage.getItem('smelting.bar');
	}
	if (localStorage.getItem('smelting.amount') != null)
	{
		window.amountToSmeltGlobal = localStorage.getItem('smelting.amount');
	}
	const oldChangeSmeltingValue = window.changeSmeltingValue;
	window.changeSmeltingValue = () =>
	{
		smeltingValue = null;
		window.setSmeltingBarAgain(
			window.barTypeSelectedToSmeltGlobal
			, document.getElementById('smeltingAmountRequested')
		);
	};
	const oldOpenFurnaceDialogue = window.openFurnaceDialogue;
	window.openFurnaceDialogue = () =>
	{
		const ret = oldOpenFurnaceDialogue();
		if (furnacePerc == 0)
		{
			const amountInput = document.getElementById('smeltingAmountRequested');
			if (amountInput.type != 'number')
			{
				amountInput.type = 'number';
				amountInput.style.width = '69px';
				amountInput.min = '0';
				amountInput.addEventListener('mouseup', (event) => window.changeSmeltingValue());
			}
			amountInput.max = window.getFurnaceCapacityAgain(window.bindedFurnaceLevel);
			window.changeSmeltingValue();
		}
		return ret;
	};

	const oldRapairMachinery = window.rapairMachinery;
	window.rapairMachinery = () =>
	{
		oldRapairMachinery();
		document.getElementById('perc-all-cost').innerHTML = formatNumber(window.getRepairCost('all', 0));
	};

	const furnaceCapacaties = [0, 10, 30, 75, 150, 300, 500, 750, 1000, 1250];
	function upgradeFurnaceOrb()
	{
		if (window.bindedUpgradeFurnaceOrb != 1)
		{
			return;
		}

		for (let i = 1; i < furnaceLevels.length; i++)
		{
			let furnaceType = furnaceLevels[i];
			furnaceType = furnaceType[0].toUpperCase() + furnaceType.substr(1);
			const capacity = 1.5 * furnaceCapacaties[i];
			const box = document.getElementById('key-item-binded' + furnaceType + 'Furnace-box');
			let textNode = box.lastChild;
			if (textNode.nodeType !== Node.TEXT_NODE)
			{
				textNode = textNode.lastChild;
			}
			textNode.textContent = ' ' + formatNumber(capacity);
		}
	}
	upgradeFurnaceOrb();
	observe('bindedUpgradeFurnaceOrb', () => upgradeFurnaceOrb());

	if (!getSetting('improveMachineryDialog'))
	{
		return;
	}

	window.getOilValueFromMachine = getOilValueFromMachine;
	window.openOilDialogue = openOilDialogue;

	observe(['drillRepair', 'crusherRepair', 'giantDrillRepair', 'roadHeaderRepair', 'bucketWheelExcavatorRepair', 'giantBWERepair'], () => updateRepairCost());
}



/**
 * fix brewing
 */

const potionRequirements = {
	'seedPotion': {
		level: 5
		, dottedGreenLeaf: 5
		, redMushroom: 100
		, greenLeaf: 1
	}
	, 'miningPotion': {
		level: 20
		, limeLeaf: 5
		, dottedGreenLeaf: 20
		, blewitMushroom: 50
	}
};
let oldCanBrewItem;
function canBrewItem(command)
{
	var requirements = potionRequirements[command];
	if (!requirements)
	{
		return oldCanBrewItem(command);
	}

	for (var key in requirements)
	{
		if (key == 'level')
		{
			if (getLevel(brewingXp) < requirements.level)
			{
				return false;
			}
		}
		else if (window[key] < requirements[key])
		{
			return false;
		}
	}
	return true;
}
function fixBrewing()
{
	oldCanBrewItem = window.canBrewItem;
	window.canBrewItem = canBrewItem;

	// fix alignment of brewing items
	const style = document.createElement('style');
	style.innerHTML = `
#brewing-tab center > .item-box-spot
{
	text-align: left;
}
	`;
	document.head.appendChild(style);

	const marginFix = '5px 20px';
	const potionItems = document.querySelectorAll('#brewing-tab [id$="Potion-box"] img.item-box-img');
	for (let i = 0; i < potionItems.length; i++)
	{
		potionItems[i].style.margin = marginFix;
	}
	const smallImgItems = ['vial','enchantedVial','compost'];
	for (let item of smallImgItems)
	{
		document.querySelector('#item-' + item + '-box img.item-box-img').style.margin = marginFix;
	}
}



/**
 * fix tabs
 */

const tabs2Fix = {
	repair: {
		name: 'Machinery'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/machinery'
	}
	, store: {
		name: 'Market'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/market'
	}
	, 'npc-store': {
		name: 'Game Shop'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/market/game'
	}
	, 'donor-store': {
		name: 'Donor Shop'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/market/donor'
	}
	, 'player-store': {
		name: 'Player Market'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/market/player'
	}
	, stats: {
		name: 'Leaderboards'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/stats'
	}
	, coop: {
		name: 'Group Tasks'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/coop'
	}
	, collectables: {
		name: 'Collectables'
	}
	, miningEngineer: {
		name: 'Mining Engineer'
	}
	, 'ach-explore': {
		name: 'Exploring — Equipment'
		, url: 'https://www.reddit.com/r/DiamondHunt/wiki/online/tabs/exploration#wiki_equipment'
	}
};
function tabTitleLink2Span(title)
{
	const span = title.parentNode;
	span.appendChild(title.firstChild);
	span.removeChild(title);
	span.setAttribute('tooltip', '');
	span.style.color = 'gold';
	span.style.fontSize = '24pt';
}
function fixTabs()
{
	function removeElement(el)
	{
		el.parentNode.removeChild(el);
	}
	/**
	 * some special treatment
	 */

	const achievementTitle = document.querySelector('#ach-tab a');
	tabTitleLink2Span(achievementTitle);

	const npcH1 = document.querySelector('#npc-store-tab h1');
	removeElement(npcH1);

	const vendorBr = document.querySelector('#vendor-tab > br:first-child');
	removeElement(vendorBr);
	const vendorTitle = document.querySelector('#vendor-tab a');
	tabTitleLink2Span(vendorTitle);

	const wizardBr = document.querySelector('#wizard-tab > br:first-child');
	removeElement(wizardBr);

	const achTitle = document.querySelector('#archaeology-tab a');
	achTitle.title = '';
	const achCraftTitle = document.querySelector('#archaeology-crafting-tab a');
	achCraftTitle.textContent = 'Exploring — Crafting'.toUpperCase();
	tabTitleLink2Span(achCraftTitle);
	const cookingTitle = document.querySelector('#cooking-tab a');
	cookingTitle.textContent = 'Exploring — Cooking'.toUpperCase();
	cookingTitle.title = '';
	cookingTitle.parentNode.setAttribute('tooltip', 'Open Wiki');

	const magicSpellbookTitle = document.querySelector('#spellbook-tab a');
	magicSpellbookTitle.textContent = 'Magic — spellbook'.toUpperCase();
	const magicCraftTitle = document.querySelector('#magiccrafting-tab a');
	magicCraftTitle.textContent = 'Magic — Crafting'.toUpperCase();
	tabTitleLink2Span(magicCraftTitle);

	removeElement(document.querySelector('#repair-tab > br:last-child'));
	removeElement(document.querySelector('#repair-tab > br:last-child'));
	removeElement(document.querySelector('#miningEngineer-tab br'));
	removeElement(document.querySelector('#brewing-tab br'));
	removeElement(document.querySelector('#archaeology-tab br'));
	removeElement(document.querySelector('#ach-explore-tab br'));
	removeElement(document.querySelector('#ach-explore-tab br'));
	const archCraftBr = document.querySelector('#archaeology-crafting-tab br');
	archCraftBr.parentNode.insertBefore(document.createElement('br'), archCraftBr);
	removeElement(document.querySelector('#cooking-tab br'));
	removeElement(document.querySelector('#cooking-tab br'));
	removeElement(document.querySelector('#cooking-tab br'));
	removeElement(document.querySelector('#magic-tab br'));
	removeElement(document.querySelector('#magiccrafting-tab br'));
	removeElement(document.querySelector('#magiccrafting-tab br'));
	for (let i = 0; i < 10; i++)
	{
		removeElement(document.querySelector('#magiccrafting-tab > span + br'));
	}
	removeElement(document.querySelector('#store-tab br'));
	removeElement(document.querySelector('#player-store-tab br'));
	removeElement(document.querySelector('#stats-tab br'));
	removeElement(document.querySelector('#stats-tab br'));
	removeElement(document.querySelector('#grouptasks-createorjoin br'));
	removeElement(document.querySelector('#grouptasks-notstarted br'));
	removeElement(document.querySelector('#grouptasks-notstarted br'));
	removeElement(document.querySelector('#grouptasks-started br'));


	for (let key in tabs2Fix)
	{
		const tab = tabs2Fix[key];
		const tabEl = document.getElementById(key + '-tab');
		let html = '<center>';
		if (tab.url)
		{
			html += `<span class="activate-tooltip">
				<a class="title-link" href="${tab.url}" target="_blank" title="Open Wiki">${tab.name.toUpperCase()}</a>
			</span>`;
		}
		else
		{
			html += `<span class="activate-tooltip" style="color: gold; font-size: 24pt;">
				${tab.name.toUpperCase()}
			</span>`;
		}
		html += '</center><br>';
		const tmpEl = createTemplateWrapper(html);
		let el = tabEl.firstElementChild;
		for (let i = tmpEl.children.length-1; i >= 0; i--)
		{
			const child = tmpEl.children[i];
			tabEl.insertBefore(child, el);
			el = child;
		}
	}
}



/**
 * hide crafting recipes
 */

const recipes = {
	shovel: ['shovel']
	, promethiumWrench: ['promethiumWrench', 'bindedPromethiumWrench']
	, glassBlowingPipe: ['glassBlowingPipe', 'bindedGlassBlowingPipe']
	, oilPipe: ['oilPipe', 'bindedOilPipe']
	, planter: ['planter', 'bindedPlanter']
	, trowel: ['trowel', 'bindedTrowel']
	, shootingStarCrystal: ['shootingStarCrystal', 'bindedShootingStarCrystal']
	, brewingKit: ['brewingKit', 'brewingKitBinded']
	, rocket: ['rocket', 'bindedRocket']
	, redPumpJack: ['redPumpJack', 'bindedRedPumpJack']
	, explorersBrush: ['explorersBrush', 'bindedExplorersBrush']
	, oilFactory: ['oilFactory', 'bindedOilFactory']
	, diamondMiners: ['diamondMiners', 'bindedDiamondMiners']
	, robot: ['robot', 'bindedRobot']
	, oilRefinery: ['oilRefinery', 'bindedOilRefinery']
	, superRobot: ['superRobot', 'bindedSuperRobot']
	, superTNT: ['superTNT', 'dragonFlagBlewUpWall']
	// , fishingRod: ['bronzeRod', 'ironRod', 'goldRod', 'promethiumRod', 'fishingRod', 'dragonFishingRod', 'bindedDragonFishingRod']
	, fishingRod: ['fishingRod', 'dragonFishingRod', 'bindedDragonFishingRod']
	, fishingBoat: ['fishingBoat', 'bindedFishingBoat']
	, largeFishingBoat: ['largeFishingBoat', 'bindedLargeFishingBoat']
};
function hideCraftingRecipes()
{
	(function hideFurnaceRecipes(init = false)
	{
		let maxFurnaceLevel = parseInt(window.bindedFurnaceLevel, 10);
		let keys2Observe = ['bindedFurnaceLevel'];
		for (let i = furnaceLevels.length-1; i >= 0; i--)
		{
			const varName = furnaceLevels[i] + 'Furnace';
			if (window[varName] > 0)
			{
				maxFurnaceLevel = Math.max(maxFurnaceLevel, i);
			}

			const row = document.getElementById('craft-' + furnaceLevels[i] + 'Furnace');
			if (row)
			{
				const hide = getSetting('hideSomeCraftRecipes') && i <= maxFurnaceLevel;
				row.style.display = hide ? 'none' : '';
				keys2Observe.push(varName);
			}
		}

		if (init)
		{
			observe(keys2Observe, () => hideFurnaceRecipes(false));
			observeSetting('hideSomeCraftRecipes', () => hideFurnaceRecipes(false));
		}
	})(true);

	function hideRecipe(key, nameList, init = false)
	{
		const hide = getSetting('hideSomeCraftRecipes') && nameList.some(name => window[name] != 0);
		document.getElementById('craft-' + key).style.display = hide ? 'none' : '';

		if (init)
		{
			observe(nameList, () => hideRecipe(key, nameList, false));
			observeSetting('hideSomeCraftRecipes', () => hideRecipe(key, nameList, false));
		}
	}
	for (let key in recipes)
	{
		hideRecipe(key, recipes[key], true);
	}

	// exploring - crafting
	(function hideOvenRecipes(init = false)
	{
		let maxOvenLevel = -1;
		let keys2Observe = [];
		for (let i = ovenLevels.length-1; i >= 0; i--)
		{
			const type = ovenLevels[i];
			const ovenName = type + 'Oven';
			const bindedOvenName = 'binded' + ovenName[0].toUpperCase() + ovenName.substr(1);
			if (window[ovenName] > 0 || window[bindedOvenName] > 0)
			{
				maxOvenLevel = Math.max(maxOvenLevel, i);
			}
			const row = document.getElementById('craft-' + type + 'Oven');
			if (row)
			{
				const hide = getSetting('hideSomeCraftRecipes') && maxOvenLevel >= i;
				row.style.display = hide ? 'none' : '';
				keys2Observe.push(ovenName, bindedOvenName);
			}
		}

		if (init)
		{
			observe(keys2Observe, () => hideOvenRecipes(false));
			observeSetting('hideSomeCraftRecipes', () => hideOvenRecipes(false));
		}
	})(true);

	// exploring - equipment
	function hideEquipmentRecipe(key, type, init = false)
	{
		let highestLevel = parseInt(window[key + 'SlotId'], 10) - 1;
		for (let i = barTypes.length-1; i >= 0; i--)
		{
			const bar = barTypes[i];
			if (window[bar + type] > 0)
			{
				highestLevel = Math.max(highestLevel, i);
			}
			const row = document.getElementById('craft-' + bar + type);
			if (row)
			{
				const hide = getSetting('hideSomeCraftRecipes') && highestLevel >= i;
				row.style.display = hide ? 'none' : '';
			}
		}

		if (init)
		{
			observe(key + 'SlotId', () => hideEquipmentRecipe(key, type, false));
			for (let i = barTypes.length-1; i >= 0; i--)
			{
				const bar = barTypes[i];
				observe(bar + type, () => hideEquipmentRecipe(key, type, false));
			}
			observeSetting('hideSomeCraftRecipes', () => hideEquipmentRecipe(key, type, false));
		}
	}
	const equipmentTypes = {
		'weapon': 'Sword'
		, 'helmet': 'Helmet'
		, 'body': 'Body'
		, 'leg': 'Legs'
	};
	for (let key in equipmentTypes)
	{
		hideEquipmentRecipe(key, equipmentTypes[key], true);
	}

	// magic - crafting
	const magicRodTypes = ['gold', 'promethium', 'runite', 'dragon'];
	(function hideWandRecipe(init = false)
	{
		let maxWandLevel = -1;
		let keys2Observe = [];
		for (let i = magicRodTypes.length-1; i >= 0; i--)
		{
			const type = magicRodTypes[i];
			const wandName = type + 'Wand';
			const bindedWandName = 'binded' + wandName[0].toUpperCase() + wandName.substr(1);
			if (window[wandName] > 0 || window[bindedWandName] > 0)
			{
				maxWandLevel = Math.max(maxWandLevel, i);
			}
			const wandRow = document.getElementById('craft-' + type + 'Wand');
			if (wandRow)
			{
				const hide = getSetting('hideSomeCraftRecipes') && maxWandLevel >= i;
				wandRow.style.display = hide ? 'none' : '';
				keys2Observe.push(wandName, bindedWandName);
			}
		}

		if (init)
		{
			observe(keys2Observe, () => hideWandRecipe(false));
			observeSetting('hideSomeCraftRecipes', () => hideWandRecipe(false));
		}
	})(true);
	(function hideStaffRecipe(init = false)
	{
		let maxStaffLevel = -1;
		let keys2Observe = [];
		for (let i = magicRodTypes.length-1; i >= 0; i--)
		{
			const type = magicRodTypes[i];
			const staffName = type + 'Staff';
			const bindedStaffName = 'binded' + staffName[0].toUpperCase() + staffName.substr(1);
			if (window[staffName] > 0 || window[bindedStaffName] > 0)
			{
				maxStaffLevel = Math.max(maxStaffLevel, i);
			}
			const staffRow = document.getElementById('craft-' + type + 'Staff');
			if (staffRow)
			{
				const hide = getSetting('hideSomeCraftRecipes') && maxStaffLevel >= i;
				staffRow.style.display = hide ? 'none' : '';
				keys2Observe.push(staffName, bindedStaffName);
			}
		}

		if (init)
		{
			observe(keys2Observe, () => hideStaffRecipe(false));
			observeSetting('hideSomeCraftRecipes', () => hideStaffRecipe(false));
		}
	})(true);
}



/**
 * hide equipment
 */

const equipmentId2Type = {
	general: ['', 'Bronze', 'Iron', 'Silver', 'Gold', 'Promethium', 'Runite', 'Dragon']
	, amulet: ['', 'Amulet of the Sea', 'Moonstone Amulet'/*??? TBD*/, 'Enchanted Amulet of the Sea', 'Dragon Amulet']
	, shield: ['', 'Ancient Shield']
	, ring: ['', 'Coin Ring', 'Pure Water Ring', 'Lava Ring']
	, secondRing: ['', 'Looting Gloves']
};
const equipmentTypes = {
	'weapon': 'Sword'
	, 'helmet': 'Helmet'
	, 'body': 'Body'
	, 'leg': 'Legs'
};
const equipmentTypeList = ['helmet', 'amulet', 'weapon', 'body', 'shield', 'ring', 'leg', 'secondRing'];
const equipmentLevels = ['bronze', 'iron', 'silver', 'gold', 'promethium', 'runite', 'dragon'];
const equipmentType2Name = {
	'weapon': 'sword'
	, 'leg': 'legs'
};
function setEquippedList(listCell, init)
{
	let keys2Observe = [];
	let list = [];
	for (let type of equipmentTypeList)
	{
		const id = parseInt(window[type + 'SlotId'], 10);
		keys2Observe.push(type + 'SlotId');
		type = equipmentType2Name[type] || type;
		if (!equipmentId2Type.hasOwnProperty(type))
		{
			list.push(equipmentId2Type.general[id] + ' ' + type[0].toUpperCase() + type.substr(1));
		}
		else
		{
			list.push(equipmentId2Type[type][id]);
		}
	}
	listCell.textContent = list.filter(str => str != '').join(', ');

	if (init)
	{
		for (let key of keys2Observe)
		{
			observe(key, () => setEquippedList(listCell, false));
		}
	}
}
function examineEquipmentRecipes(key, type, init = false)
{
	const currentLevel = parseInt(window[key + 'SlotId'], 10);
	// hide not more than gold equipment
	for (let i = 0; i < equipmentLevels.length; i++)
	{
		const el = document.getElementById('item-' + equipmentLevels[i] + type + '-box');
		if (el)
		{
			const hide = getSetting('hideEquipment') && i < 4 && i < currentLevel;
			el.parentNode.style.display = hide ? 'none' : '';
		}
	}

	if (init)
	{
		observe(key + 'SlotId', () => examineEquipmentRecipes(key, type, false));
		observeSetting('hideEquipment', () => examineEquipmentRecipes(key, type, false));
	}
}
function hideEquipment()
{
	const table = document.querySelector('#ach-explore-tab table.equipement-area-table');
	const row = table.insertRow(-1);
	row.style.borderTop = '1px dashed';
	const nameCell = row.insertCell(-1);
	nameCell.style.verticalAlign = 'top';
	nameCell.textContent = 'Equipped:';
	const listCell = row.insertCell(-1);
	listCell.colSpan = 2;
	listCell.textContent = '';
	setEquippedList(listCell, true);

	for (let key in equipmentTypes)
	{
		examineEquipmentRecipes(key, equipmentTypes[key], true);
	}
}



/**
 * improve dialog buttons
 */

function improveDialogBtns()
{
	function isOnlyMessageBox(yesButtonVal)
	{
		return getSetting('improveDialogBtns') && (yesButtonVal == null || yesButtonVal == '');
	}

	const oldOpenDialogue = window.openDialogue;
	window.openDialogue = (title, message, yesButtonVal) =>
	{
		const [okBtn, cancelBtn] = document.querySelectorAll('#dialog #buttonCommandYes ~ input[type="button"]');
		// restore default state
		const empty = isOnlyMessageBox(yesButtonVal);
		okBtn.style.display = empty ? 'none' : '';
		okBtn.value = 'OK';
		cancelBtn.value = empty ? 'Close' : 'Cancel';
		if (getSetting('improveDialogBtns'))
		{
			if (/stardust/i.test(title))
			{
				okBtn.value = 'Smash it';
			}
			else if (/bind/i.test(title))
			{
				okBtn.value = 'Bind';
			}
			else if (/drink/i.test(title))
			{
				okBtn.value = 'Drink';
			}
			else if (/^EXPLORE/.test(yesButtonVal))
			{
				okBtn.value = 'Start expedition';
			}
			else if (/^OPEN_LOOT=/.test(yesButtonVal))
			{
				okBtn.value = 'Open';
			}
		}

		return oldOpenDialogue(title, message, yesButtonVal);
	};

	const oldOpenDialogueWidth = window.openDialogueWidth;
	window.openDialogueWidth = (title, message, yesButtonVal, widthWanted) =>
	{
		const [okBtn, cancelBtn] = document.querySelectorAll('#dialog #buttonCommandYes ~ input[type="button"]');
		// restore default state
		const empty = isOnlyMessageBox(yesButtonVal);
		okBtn.style.display = empty ? 'none' : '';
		okBtn.value = 'OK';
		cancelBtn.value = empty ? 'Close' : 'Cancel';
		return oldOpenDialogueWidth(title, message, yesButtonVal, widthWanted);
	};

	const oldClicksKeyItem = window.clicksKeyItem;
	window.clicksKeyItem = (varname) =>
 	{
		oldClicksKeyItem(varname);
		if (getSetting('improveDialogBtns') && varname == 'key-item-bindedRocket-box' && window.rocketTimer == 0)
		{
			const [okBtn, cancelBtn] = document.querySelectorAll('#dialog #buttonCommandYes ~ input[type="button"]');
			okBtn.value = 'Start rocket';
			const textEl = document.querySelector('#dialog #dialog-text');
			textEl.removeChild(textEl.lastChild);
			textEl.removeChild(textEl.lastChild);
			textEl.removeChild(textEl.lastChild);
		}
	};

	const oldOpenFurnaceDialogue = window.openFurnaceDialogue;
	window.openFurnaceDialogue = () =>
	{
		oldOpenFurnaceDialogue();
		if (getSetting('improveDialogBtns') && window.furnacePerc > 0)
		{
			const [okBtn, cancelBtn] = document.querySelectorAll('#dialog #buttonCommandYes ~ input[type="button"]');
			okBtn.value = 'Cancel smelting';
			cancelBtn.value = 'Close';
		}
	};

	const oldOpenAreaDialogue = window.openAreaDialogue;
	window.openAreaDialogue = () =>
	{
		oldOpenAreaDialogue();
		if (getSetting('improveDialogBtns') && window.exploringTimer > 0)
		{
			const [okBtn, cancelBtn] = document.querySelectorAll('#dialog #buttonCommandYes ~ input[type="button"]');
			okBtn.value = 'Cancel trip';
			cancelBtn.value = 'Close';
		}
	};
}



/**
 * expand equipment
 */

function expandEquipment()
{
	if (!getSetting('expandEquipment'))
	{
		return;
	}

	const equipmentRows = document.querySelectorAll('tr[onclick^="openCraftSwordDialogue"]');
	const rowParent = equipmentRows[0].parentNode;
	let newRows = [];
	for (let i = 0; i < equipmentRows.length; i++)
	{
		const row = equipmentRows[i];
		const type = row.getAttribute('onclick').replace(/openCraftSwordDialogue\('([^']+)'\);/, '$1');
		const levels = row.cells[2].textContent.split('/');
		const barCosts = row.cells[3].getAttribute('tooltip').replace(/\D*$/, '').split('/');
		for (let i = 0; i < barTypes.length; i++)
		{
			const bar = barTypes[i];
			const newRow = row.cloneNode(true);
			newRow.id = 'craft-' + bar + type;
			newRow.setAttribute('onclick', '');
			newRow.cells[0].textContent = bar[0].toUpperCase() + bar.substr(1) + ' ' + type;
			newRow.cells[1].firstElementChild.src = 'images/exploring/equipement/' + bar + type + '.png';
			newRow.cells[2].textContent = levels[i];
			newRow.cells[3].firstElementChild.src = 'images/minerals/' + bar + 'Bar.png';
			newRow.cells[3].lastChild.textContent = ' ' + barCosts[i];
			((item) =>
			{
				newRow.addEventListener('click', () => window.craftItem(item));
			})(bar + type);
			newRows.push({
				level: parseInt(levels[i], 10)
				, row: newRow
			});
		}
		rowParent.removeChild(row);
	}
	newRows = newRows.sort((a, b) => a.level - b.level);

	// insert new rows into table
	const rows = rowParent.rows;
	let idx = 0;
	for (let i = 0; i < rows.length && idx < newRows.length; i++)
	{
		const row = rows[i];
		if (row.getElementsByTagName('th').length > 0)
		{
			continue;
		}

		const thisLevel = parseInt(row.cells[2].textContent, 10);
		while (newRows[idx] && newRows[idx].level < thisLevel)
		{
			rowParent.insertBefore(newRows[idx].row, row);
			idx++;
		}
	}
	for (; idx < newRows.length; idx++)
	{
		rowParent.appendChild(newRows[idx].row);
	}
}



/**
 * apply new item style
 */

function applyNewItemStyle()
{
	if (!getSetting('applyNewItemStyle'))
	{
		return;
	}

	// change how the items are styled
	const style = document.createElement('style');
	style.innerHTML = `
span[class^="inventory-item-box"],
#vendor-tab span.shop-box,
#ach-tab span.shop-box-ach,
div[id$="-store-tab"] span.shop-box,
span.shop-box-ach
{
	position: relative;
}
span[class^="inventory-item-box"] img.item-box-img,
#vendor-tab img[id^="vendor-item-img"],
#ach-tab span.shop-box-ach img:first-of-type,
div[id$="-store-tab"] span.shop-box img:first-of-type,
#grp-shop-tab span.shop-box-ach img:first-of-type,
div[id^="miningEngineer-"][id$="-tab"] span.shop-box-ach > img:first-of-type
{
	position: absolute;
	margin: 0 !important;
}
img.item-box-img[height="30px"]  { top: 52.5px; }
img.item-box-img[height="55px"]  { top: 40px; }
img.item-box-img[height="60px"]  { top: 37.5px; }
img.item-box-img[height="70px"]  { top: 32.5px; }
img.item-box-img[height="75px"]  { top: 30px; }
img.item-box-img[height="80px"]  { top: 27.5px; }
img.item-box-img[height="85px"]  { top: 25px; }
img.item-box-img[height="90px"]  { top: 20px; }
img.item-box-img[height="100px"] { top: 9px; }
span[id^="item-binded"] > img.item-box-img[height="100px"]  { top: 17.5px; }
img.item-box-img[height="110px"] { top: 12.5px; }
img.item-box-img[width="55px"]  { left: 42.5px; }
img.item-box-img[width="60px"]  { left: 40px; }
img.item-box-img[width="70px"]  { left: 35px; }
img.item-box-img[width="75px"]  { left: 32.5px; }
img.item-box-img[width="80px"]  { left: 30px; }
img.item-box-img[width="90px"]  { left: 25px; }
img.item-box-img[width="100px"] { left: 20px; }
img.item-box-img[width="110px"] { left: 15px; }
img.item-box-img[width="120px"] { left: 10px; }
span[class^="inventory-item-box"] img.item-box-img[height="60px"][width="60px"] { transform: scale(1.2); }
span[class^="inventory-item-box"] img.item-box-img[height="70px"][width="80px"] { transform: scale(1.2); }
/* this is a special case (converting items into stardust) */
#wizard-tab img.item-box-img[height="50px"] { top: 22px; }
#wizard-tab img.item-box-img[width="50px"] { left: 45px; }

#vendor-tab img[id^="vendor-item-img"]
{
	transform: scale(1.1);
}
/* height: 155px */
img[id^="vendor-item-img"][height="85x"]  { top: 35px; }
/* width: 150px (110px + 40px) */
img[id^="vendor-item-img"][width="80px"]  { left: 35px; }

span[class^="inventory-item-box"] span[id$="mount"],
#ancientCrystalChargesSpan,
#vendor-tab span.box-title,
#ach-tab span[id^="cost-ach-"][id$="AchUpgrade"],
div[id$="-store-tab"] span[id$="-cost"],
#grp-shop-tab span[id$="-cost"],
div[id^="miningEngineer-"][id$="-tab"] span.shop-box-ach span[id^="perk"],
#magicBookPages,
#item-treasureMap-box > span:last-child,
#item-treasureMap2-box > span:last-child,
#item-ghostSpawned1-box > span:last-child
{
	background-color: black;
	border-top: 1px solid rgba(255, 255, 255, 0.5);
	color: white !important;
	font-weight: normal;
	margin: 0 !important;
	padding: 3px;
	text-align: center;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}
span[class^="inventory-item-box"] span[id$="mount"]:not(#energy-amount),
#vendor-tab span.box-title
{
	padding-right: 9px;
}
span[class^="inventory-item-box"] span[id$="mount"]:not(#energy-amount)::before,
#vendor-tab span.box-title::before
{
	content: '${String.fromCharCode(215)}';
	margin-right: 3px;
}
#fishfarmer-img
{
	top: 18px;
}
#fishingRodAmount
{
	display: none;
}
#hasMapOfTheSea-fishermen
{
	position: absolute;
	bottom: 3px;
	left: calc(50% - 10px);
}
span[class^="inventory-item-box"] span[id$="-price"],
#vendor-tab span[id^="vendor-item-cost"]
{
	font-weight: normal;
	padding-left: 20px;
	position: relative;
	top: 1px;
}
#vendor-tab span[id^="vendor-item-cost"]
{
	font-size: inherit !important;
}
body.hide-zero-price span[class^="inventory-item-box"] span[id$="-price"]:empty,
body.hide-zero-price #sandstone-price,
body.hide-zero-price #moonStone-price,
body.hide-zero-price #glass-price,
body.hide-zero-price #promethiumBar-price,
body.hide-zero-price #runiteBar-price,
body.hide-zero-price #ancientBar-price,
body.hide-zero-price #lava-price,
body.hide-zero-price #brewingKitBinded-price,
body.hide-zero-price #stripedLeaf-price,
body.hide-zero-price #stripedCrystalLeaf-price,
body.hide-zero-price #greenMushroom-price,
body.hide-zero-price #whaleTooth-price,
body.hide-zero-price #snapeGrass-price,
body.hide-zero-price #strangeLeaf-price,
body.hide-zero-price #pureWaterPotion-price,
body.hide-zero-price #cactusWater-price,
body.hide-zero-price #swampWater-price,
body.hide-zero-price #ghostEssence-price,
body.hide-zero-price #ghostRemains-price,
body.hide-zero-price span[id$="Potion-price"]
{
	visibility: hidden;
}
span[class^="inventory-item-box"] span[id$="-price"]::before,
#vendor-tab span[id^="vendor-item-cost"]::before,
div[id$="-store-tab"] span[id$="-cost"]::before,
#grp-shop-tab span[id$="-cost"]::before
{
	content: '';
	display: inline-block;
	width: 20px;
	height: 20px;
	position: absolute;
	left: 0;
	background-image: url('images/pic_coin.png');
	background-size: 20px 20px;
}
#shop-ghostPirates-cost::before
{
	background-image: url('images/pic_coin2.png');
}
#grp-shop-tab span[id$="-cost"]::before
{
	background-image: url('images/icons/groupTaskTokens.png');
}
#grp-shop-tab #grp-chests-badge-cost::before
{
	background-image: url('images/icons/groupTaskBadge4.png');
}
span[class^="inventory-item-box"]:not(.inventory-item-box-smaller) img[src="images/pic_coin.png"],
#vendor-tab img[src="images/pic_coin.png"],
#npc-store-tab img[src^="images/pic_coin"],
#npc-store-tab img[src="images/icons/stats.png"],
#npc-store-tab img[src="images/crafting/anyOrb.png"],
#npc-store-tab img[src="images/spinning-gear-off.gif"],
#donor-store-tab img ~ img[src="images/donor_coin.png"],
#donor-store-tab span[id$="-cost"] img[src="images/donor_coin.png"],
#grp-shop-tab img[src^="images/icons/groupTask"][id^="group-"],
#grp-shop-tab #grp-shop-badge-price-img
{
	display: none;
}
#ach-tab span[id^="cost-ach-"][id$="AchUpgrade"]::before
{
	content: '';
	display: inline-block;
	width: 20px;
	height: 20px;
	position: absolute;
	top: 2px;
	left: 4px;
	background-image: url('images/shop/ach.png');
	background-size: 20px 20px;
}
#ach-tab span.box-title,
div[id^="miningEngineer-"][id$="-tab"] span.box-title
{
	font-size: 14pt;
	font-weight: normal;
	position: relative;
	top: 4px;
}
#ach-tab span.shop-box-ach img:first-of-type[height="60px"] { top: 47.5px; }
#ach-tab span.shop-box-ach img:first-of-type[height="80px"] { top: 37.5px; }
#ach-tab span.shop-box-ach img:first-of-type[width="55px"] { left: 47.5px; }
#ach-tab span.shop-box-ach img:first-of-type[width="80px"] { left: 35px; }
#ach-tab span.shop-box-ach img[src="images/shop/ach.png"]
{
	display: none;
}
#ach-tab span.shop-box-ach img[src="images/division/check.png"],
#grp-shop-tab img[src="images/division/check.png"]
{
	position: absolute;
	bottom: 5px;
	left: calc(50% - 10px);
}

#npc-store-tab span.box-title,
#donor-store-tab span.box-title,
#grp-shop-tab span.box-title
{
	font-size: 1.1rem;
	font-weight: bold;
	margin: 0;
	padding: 4px;
	position: absolute;
	left: 0;
	right: 0;
}
#donor-store-tab span.box-title
{
	font-size: 1.02rem;
}
#shop-coop-level-cost,
#shop-miningEngineer-machines-cost,
#grp-shop-tab #grp-chests-badge-cost
{
	bottom: 26px;
}
#shop-coop-level-cost::before
{
	background-image: url('images/icons/stats.png');
	left: 1px;
}
#shop-wizard-cost::before
{
	background-image: url('images/crafting/anyOrb.png');
}
#shop-miningEngineer-machines-cost::before
{
	background-color: white;
	background-image: url('images/spinning-gear-off.gif');
}
#npc-store-tab img:first-of-type[height="60px"] { top: 47.5px; }
#npc-store-tab img:first-of-type[height="65px"] { top: 45px; }
#npc-store-tab img:first-of-type[height="70px"] { top: 42.5px; }
#npc-store-tab img:first-of-type[height="80px"] { top: 37.5px; }
#npc-store-tab img:first-of-type[height="85x"] { top: 35px; }
#npc-store-tab img:first-of-type[height="100x"] { top: 27.5px; }
#npc-store-tab img:first-of-type[width="60px"] { left: 45px; }
#npc-store-tab img:first-of-type[width="65px"] { left: 42.5px; }
#npc-store-tab img:first-of-type[width="80px"] { left: 35px; }
#npc-store-tab img:first-of-type[width="100px"] { left: 25px; }

#donor-store-tab img:first-of-type[height="80px"] { top: 37.5px; }
#donor-store-tab img:first-of-type[width="80px"] { left: 35px; }
#donor-store-tab span[id$="-cost"]::before
{
	background-image: url('images/donor_coin.png');
}

#grp-shop-tab img[id^="grp-shop-"][height="80px"] { top: 37.5px; }
#grp-shop-tab img[id^="grp-shop-"][width="80px"] { left: 35px; }
#grp-shop-tab img[id^="grp-shop-"][width="90px"] { left: 30px; }
#grp-shop-tab img[src="images/division/check.png"] + span
{
	display: none;
}

img[src^="images/perks/"][height="80px"] { top: 45px; }
img[src^="images/perks/"][width="80px"] { left: 36px; }
span.shop-box-ach span[id^="perk"] > img[src="images/spinning-gear-off.gif"]
{
	background-color: white;
	position: absolute;
	left: 3px;
}
span.shop-box-ach span[id^="perk"] > img[src^="images/division/"]
{
	position: absolute;
	right: 3px;
}
	`;
	document.head.appendChild(style);
	// remove line breaks
	const brs = document.querySelectorAll(
		'[class^="inventory-item-box"] br'
		+ ', span.shop-box br'
		+ ', #ach-tab span.shop-box-ach br'
		+ ', #grp-shop-tab span.shop-box-ach br'
		+ ', div[id^="miningEngineer-"][id$="-tab"] span.shop-box-ach br'
	);
	let i = 0;
	while (brs[i] != null)
	{
		if (!brs[i].parentNode)
		{
			i++;
			continue;
		}
		brs[i].parentNode.removeChild(brs[i]);
	}
	// give the emerald image the correct class name
	const emeraldAmount = document.getElementById('emeraldAmount');
	const previous = emeraldAmount && emeraldAmount.previousElementSibling;
	previous && previous.classList.add('item-box-img');

	// wrap some requirements in npc-shop
	const shopBoxes = document.querySelectorAll('div[id$="-store-tab"] span.shop-box');
	for (let i = 0; i < shopBoxes.length; i++)
	{
		const box = shopBoxes[i];
		if (box.id && box.id.startsWith('shop-enchanted'))
		{
			const boxTitle = box.querySelector('.box-title');
			boxTitle.firstChild.textContent += ' ';
		}
		const children = box.childNodes;
		let foundImg = false;
		let wrapper;
		const idList = {
			'shop-coopUnlocked-box': ['shop-coop-cost', 'shop-coop-level-cost']
			, 'shop-hasVendor-box': ['shop-vendor-cost']
			, 'shop-wizard-box': ['shop-wizard-cost']
			, 'shop-achShop-box': ['shop-achShop-cost']
			, 'shop-miningEngineer-box': ['shop-miningEngineer-cost', 'shop-miningEngineer-machines-cost']
			, 'donor-shop-hasExtraOfflineTimer-box': ['shop-extraOfflineTimer-cost']
			, '': ['shop-offlineTimer-cost']
		}[box.id] || [];
		for (let j = 0; j < children.length; j++)
		{
			const child = children[j];
			if (!foundImg && child.tagName == 'IMG')
			{
				foundImg = true;
			}
			else if (foundImg && child.nodeType == Node.TEXT_NODE)
			{
				wrapper = document.createElement('span');
				wrapper.id = idList.shift() || '';
				box.insertBefore(wrapper, child);
				wrapper.appendChild(child);
			}
			else if (foundImg && wrapper != null)
			{
				wrapper.appendChild(child);
				j--;
			}
		}
	}

	// wrap some requirements in group shop
	const grpBoxes = document.querySelectorAll('#grp-shop-tab span.shop-box-ach');
	const idList = ['grp-badge-cost', 'grp-more-points-cost', 'grp-eels-cost', 'grp-promethium-cost', 'grp-chests-cost', 'grp-chests-badge-cost', 'grp-gloves-cost'];
	for (let i = 0; i < grpBoxes.length; i++)
	{
		const box = grpBoxes[i];
		const children = box.childNodes;
		let foundImg = false;
		let wrapper;
		for (let j = 0; j < children.length; j++)
		{
			const child = children[j];
			if (!foundImg && child.tagName == 'IMG')
			{
				foundImg = true;
			}
			else if (foundImg && wrapper == null)
			{
				wrapper = document.createElement('span');
				wrapper.id = idList.shift();
				box.insertBefore(wrapper, child);
				wrapper.appendChild(child);
			}
			else if (foundImg && wrapper != null)
			{
				if (child.nodeName == 'IMG')
				{
					box.insertBefore(child, wrapper);
					wrapper = null;
				}
				else
				{
					wrapper.appendChild(child);
					j--;
				}
			}
		}
	}

	// add wrapper elements for the perk-levels in mining engineer tab
	const perks = document.querySelectorAll('div[id^="miningEngineer-"][id$="-tab"] span.shop-box-ach');
	for (let i = 0; i < perks.length; i++)
	{
		const perk = perks[i];
		const childNodes = perk.childNodes;
		let foundImg = false;
		let wrapperInserted = false;
		let wrapper = document.createElement('span');
		wrapper.id = perk.getAttribute('onclick')
			.replace(/send\('([^']+)'\)/, '$1')
			.replace(/[=~]/g, '-')
			.toLowerCase()
		;
		for (let j = 0; j < childNodes.length; j++)
		{
			const child = childNodes[j];
			if (!foundImg && child.tagName == 'IMG')
			{
				foundImg = true;
			}
			else if (foundImg)
			{
				if (!wrapperInserted)
				{
					perk.insertBefore(wrapper, child);
					j++;
					wrapperInserted = true;
				}
				wrapper.appendChild(child);
				j--;
			}
		}
	}
	// fix tooltip
	const perkEl = document.querySelector(`span.activate-tooltip[tooltip="Giants drills mine 40% more quartz."]`);
	perkEl.setAttribute('tooltip', 'Giants drills mine 40% more iron.');

	function setVisibilityOfUnnecessaryPrices()
	{
		const hide = getSetting('hideUnnecessaryPrice');
		document.body.classList[hide ? 'add' : 'remove']('hide-zero-price');
	}
	setVisibilityOfUnnecessaryPrices();
	observeSetting('hideUnnecessaryPrice', () => setVisibilityOfUnnecessaryPrices());
}



/**
 * apply new key item style
 */

function applyNewKeyItemStyle()
{
	if (!getSetting('applyNewKeyItemStyle'))
	{
		return;
	}

	// change how key items and machinery is styled
	const style = document.createElement('style');
	style.innerHTML = `
span[class$="-inventory-item-box"]
{
	position: relative;
}
span.item-box-title
{
	color: blue;
	font-weight: bold;
	padding: 4px 8px;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1;
}
.tooltip
{
	z-index: 10;
}
span.item-box-title > img[src="images/oil.png"]
{
	display: block;
	margin: 0 auto;
}
span.item-box-title > img[src^="images/spinning-gear"]
{
	margin-right: 3px;
	margin-left: -10px;
}
span[class$="-inventory-item-box"] > img
{
	position: absolute;
}
/* heights */
span[class$="-inventory-item-box"] > img[height="80px"]  { top: 60px; }
span[class$="-inventory-item-box"] > img[height="90px"]  { top: 55px; }
span[class$="-inventory-item-box"] > img[height="100px"]  { top: 50px; }
span[class$="-inventory-item-box"] > img[height="110px"]  { top: 45px; }
span[class$="-inventory-item-box"] > img[height="120px"]  { top: 40px; }
span[class$="-inventory-item-box"] > img[height="130px"]  { top: 35px; }
span[class$="-inventory-item-box"] > img[height="140px"]  { top: 30px; }
/* widths */
span[class$="-inventory-item-box"] > img[width="70px"]  { left: 35px; }
span[class$="-inventory-item-box"] > img[width="80px"]  { left: 30px; }
span[class$="-inventory-item-box"] > img[width="90px"]  { left: 25px; }
span[class$="-inventory-item-box"] > img[width="100px"]  { left: 20px; }
span[class$="-inventory-item-box"] > img[width="110px"]  { left: 15px; }
span[class$="-inventory-item-box"] > img[width="120px"]  { left: 10px; }
#key-item-bindedGlassBlowingPipe-box img
{
	top: 75px;
}
span.ghostPipe-wrapper
{
	display: flex;
	flex-wrap: wrap;
	position: absolute;
	top: 66px;
	left: 19px;
	width: 102px;
}
span.ghostPipe-wrapper > img
{
	box-shadow: 0 0 2px black;
	margin: 2px;
}
span.text-wrapper
{
	background-color: black;
	border-top: 1px solid rgba(255, 255, 255, 0.5);
	color: white;
	font-weight: normal;
	line-height: 22px;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}
span.text-wrapper span[id$="Amount"],
#level-global-4
{
	font-weight: bold;
}
#key-item-handheldOilPump-box span.text-wrapper
{
	display: none;
}
span.text-wrapper img
{
	margin-right: 3px;
}
span.text-wrapper .small-perc-bar
{
	background-color: black;
	border: 0;
	margin: 0;
	padding: 0;
	position: absolute;
	top: -11px;
	left: 0;
	right: 0;
	width: auto;
}
span.text-wrapper .small-perc-bar-inner
{
	background-color: rgba(0, 210, 0, 1) !important;
}
span.text-wrapper .small-perc-bar-inner[style*="background-color: yellow;"]
{
	background-color: rgba(255, 255, 0, 1) !important;
}
span.text-wrapper .small-perc-bar-inner[style*="background-color: red;"]
{
	background-color: rgba(255, 0, 0, 1) !important;
}
	`;
	document.head.appendChild(style);

	const brs = document.querySelectorAll('span[class$="-inventory-item-box"] br');
	let i = 0;
	while (brs[i] != null)
	{
		const br = brs[i];
		const parent = br.parentNode;
		if (!parent)
		{
			i++;
			continue;
		}
		if (parent.classList.contains('item-box-title'))
		{
			parent.insertBefore(document.createTextNode(' '), br);
		}
		parent.removeChild(br);
	}

	const spans = document.querySelectorAll('span[class$="-inventory-item-box"]');
	let ghostWrapper;
	for (let i = 0; i < spans.length; i++)
	{
		const span = spans[i];
		const childs = span.childNodes;
		let wrapper;
		let foundImg = false;
		for (let j = 0; j < childs.length; j++)
		{
			const child = childs[j];
			if (!foundImg && child.tagName == 'IMG')
			{
				if (/ghostPipeHolder/.test(child.id))
				{
					if (!ghostWrapper)
					{
						ghostWrapper = document.createElement('span');
						ghostWrapper.className = 'ghostPipe-wrapper';
						child.parentNode.insertBefore(ghostWrapper, child);
						j++;
					}
					ghostWrapper.appendChild(child);
					j--;

					if (child.id == 'ghostPipeHolder6')
					{
						foundImg = true;
					}
				}
				else
				{
					foundImg = true;
				}
			}
			else if (foundImg)
			{
				if (!wrapper)
				{
					wrapper = document.createElement('span');
					wrapper.className = 'text-wrapper';
					span.insertBefore(wrapper, child);
					j++;
				}
				wrapper.appendChild(child);
				j--;
			}
		}
		if (wrapper && wrapper.textContent == '')
		{
			wrapper.parentNode.removeChild(wrapper);
		}
	}
}



/**
 * hide recipes of maxed machinery
 */

function hideMachineRecipe(key, max, init)
{
	const bindedKey = 'binded' + key[0].toUpperCase() + key.substr(1);
	const row = document.getElementById('craft-' + key);
	if (row)
	{
		const amount = parseInt(window[key], 10) + parseInt(window[bindedKey], 10);
		const hide = getSetting('hideMaxRecipes') && amount >= max();
		row.style.display = hide ? 'none' : '';
		if (init)
		{
			observe(key, () => hideMachineRecipe(key, max, false));
			observe(bindedKey, () => hideMachineRecipe(key, max, false));
			observeSetting('hideMaxRecipes', () => hideMachineRecipe(key, max, false));
		}
	}
}
function defaultMaxFn()
{
	return 10;
}
function calcPumpjackMax()
{
	let maxPumpjacks = 10;
	if (window.bindedUpgradePumpJackOrb == 1)
	{
		maxPumpjacks += 5;
	}
	if (window.bindedGreenPumpjackOrb == 1)
	{
		maxPumpjacks += 10;
	}
	return maxPumpjacks;
}
function hideMaxRecipes()
{
	const machinery = ['drill', 'crusher', 'giantDrill', 'sandCollector', 'roadHeader', 'bucketWheelExcavator', 'giantBWE'];
	for (let key of machinery)
	{
		hideMachineRecipe(key, defaultMaxFn, true);
	}

	// handle pump jacks with its upgrades
	hideMachineRecipe('pumpJack', calcPumpjackMax, true);
	observe('bindedUpgradePumpJackOrb', () => hideMachineRecipe('pumpJack', calcPumpjackMax, false));
	observe('bindedGreenPumpjackOrb', () => hideMachineRecipe('pumpJack', calcPumpjackMax, false));
}



/**
 * fix magic
 */

const essenceMultiplier = {
	mineral: {
		stone: 20e6
		, copper: 10e6
		, tin: 10e6
		, iron: 5e6
		, silver: 2e6
		, gold: 1e6
		, quartz: 100e3
		, flint: 50e3
		, marble: 10e3
		, titanium: 5e3
		, promethium: 100
		, runite: 2
	}
	, oil: {
		oil: 5e7
		, rocketFuel: 1
	}
	, nature: {
		dottedGreenRoots: 18
		, greenRoots: 13
		, limeRoots: 6
		, goldRoots: 3
		, stripedGoldRoots: 1
		, crystalRoots: v => parseInt(v / 2) + 1
		, stripedCrystalRoots: v => parseInt(v / 4) + 1
	}
	, metallic: {
		bronzeBar: 1000
		, ironBar: 700
		, silverBar: 500
		, goldBar: 300
		, promethiumBar: 25
		, runiteBar: 1
	}
	, energy: {
		shrimp: 50
		, sardine: 20
		, tuna: 4
		, swordfish: 1
		, shark: v => parseInt(v / 3) + 1
		, whale: v => parseInt(v / 6) + 1
	}
	, orb: {
		blue: 3
		, green: 1
		, red: v => parseInt(v / 3) + 1
	}
	, gem: {
		sapphire: 8
		, emerald: 3
		, ruby: 1
		, diamond: v => parseInt(v / 5) + 1
	}
};
const essenceObserver = new Map();
function essenceCellStyle(cell, fulfilled)
{
	cell.style.backgroundColor = fulfilled ? '' : 'red';
	cell.style.color = fulfilled ? '' : 'white';
}
function essenceSetFulfilled(key, value, el)
{
	const fulfilled = window[key] >= value;
	essenceCellStyle(el.previousElementSibling, fulfilled);
	essenceCellStyle(el, fulfilled);
	essenceCellStyle(el.nextElementSibling, fulfilled);
}
// thanks /u/Vomera for suggesting this
function essenceRequirements(amount, type)
{
	if (essenceObserver.has(type))
	{
		essenceObserver.get(type).forEach((fn, key) =>
		{
			unobserve(key, fn);
		});
	}

	const observerMap = new Map();
	const makeString = 'make' + type[0].toUpperCase() + type.substr(1) + 'Essence';
	for (let key in essenceMultiplier[type])
	{
		const elId = makeString + key[0].toUpperCase() + key.substr(1) + '-needed';
		const el = document.getElementById(elId);
		const mult = essenceMultiplier[type][key];
		const value = amount == 0 ? 0 : (typeof mult === 'function' ? mult(amount) : amount * mult);
		el.textContent = formatNumber(value);

		const windowKey = type == 'orb' ? 'empty' + key[0].toUpperCase() + key.substr(1) + 'Orb' : key;
		essenceSetFulfilled(windowKey, value, el);
		const observeFn = observe(windowKey, () => essenceSetFulfilled(windowKey, value, el));
		observerMap.set(windowKey, observeFn);
	}
	essenceObserver.set(type, observerMap);
}
function fixMagic()
{
	// move roots to magic panel
	const parent = document.getElementById('magic-tab');
	const roots = document.querySelectorAll('[id$="Roots-box"]');
	for (let i = 0; i < roots.length; i++)
	{
		const el = roots[i].parentNode;
		el.setAttribute('tooltip', el.getAttribute('tooltip').replace(/ \(Used in the magic skill\)$/, ''));
		parent.appendChild(el);
	}
	const style = document.createElement('style');
	style.innerHTML = `
#magic-tab .inventory-item-box-farming
{
	float: left;
}
	`;
	document.head.appendChild(style);

	// add wrapper for collected number of magic book pages
	const magicBookBox = document.getElementById('item-magicBook-box');
	const magicBookChildren = magicBookBox.childNodes;
	const magicPagesWrapper = document.createElement('span');
	magicPagesWrapper.id = 'magicBookPages';
	let foundImg = false;
	for (let i = 0; i < magicBookChildren.length; i++)
	{
		const child = magicBookChildren[i];
		if (!foundImg && child.tagName == 'IMG')
		{
			foundImg = true;
		}
		else if (foundImg)
		{
			magicPagesWrapper.appendChild(child);
			i--;
		}
	}
	magicBookBox.appendChild(magicPagesWrapper);

	// improve tooltip of spell book
	const magicBook = magicBookBox.parentNode;
	function updateTooltip()
	{
		const pages = [];
		for (let i = 1; i <= 6; i++)
		{
			if (window['bindedMagicPage' + i] == '1')
			{
				pages.push(i);
			}
		}
		const pagesString = pages.length === 0 ? '-' : pages.join(', ');
		magicBook.setAttribute('tooltip', `Spell Book (binded pages: ${pagesString})`);
	}
	updateTooltip();
	observe([
		'bindedMagicPage1'
		, 'bindedMagicPage2'
		, 'bindedMagicPage3'
		, 'bindedMagicPage4'
		, 'bindedMagicPage5'
		, 'bindedMagicPage6'
	], () => updateTooltip());

	const oldEmptyEssenceDialogue2 = window.emptyEssenceDialogue2;
	window.emptyEssenceDialogue2 = (type) =>
	{
		oldEmptyEssenceDialogue2(type);
		if (type == 'nature')
		{
			const input = document.querySelector(
				'#emptyEssence2-dialog-nature table.table-stats tr:last-child > td:last-child input'
			);
			if (input && input.style.display != 'none')
			{
				input.style.display = 'none';
				const inputCell = input.parentNode;
				inputCell.style.border = 0;
				const neededCell = inputCell.previousElementSibling;
				neededCell.style.border = 0;
				const imgCell = neededCell.previousElementSibling;
				imgCell.style.border = 0;
			}
		}
	};
	window.refreshOresValuesWhenMakingEssences = (amount) =>
	{
		essenceRequirements(amount, 'mineral');
	};
	window.refreshOilValuesWhenMakingEssences = (amount) =>
	{
		essenceRequirements(amount, 'oil');
	};
	window.refreshSeedsValuesWhenMakingEssences = (amount) =>
	{
		essenceRequirements(amount, 'nature');
	};
	window.refreshBarValuesWhenMakingEssences = (amount) =>
	{
		essenceRequirements(amount, 'metallic');
	};
	window.refreshFoodValuesWhenMakingEssences = (amount) =>
	{
		essenceRequirements(amount, 'energy');
	};
	window.refreshOrbValuesWhenMakingEssences = (amount) =>
	{
		essenceRequirements(amount, 'orb');
	};
	window.refreshGemValuesWhenMakingEssences = (amount) =>
	{
		essenceRequirements(amount, 'gem');
	};
}



/**
 * fix number format
 */

function fixNumberFormat()
{
	// fix achievements
	const achievementFixes = {
		'achABiggerWall': 'Sell excactly ' + formatNumber(1e7) + ' stone to the shop.'
		, 'ach1000Potions': 'Drink a total of ' + formatNumber(1e3) + ' potions. '
		, 'achMaxInt': 'Have a total of ' + formatNumber(Math.pow(2, 31)-1) + ' ores in your inventory. '
		, 'achSmelter': 'Smelt a total of ' + formatNumber(5e5) + ' bars. '
	};
	for (let id in achievementFixes)
	{
		const row = document.getElementById(id);
		row.cells[1].firstChild.textContent = achievementFixes[id];
	}
	const oldLoadAchievements = window.loadAchievements;
	window.loadAchievements = () =>
	{
		oldLoadAchievements();
		document.getElementById('total-potions-drank').innerHTML = formatNumber(window.totalPotionsDrank) + ' potions drank';
		document.getElementById('total-bars-smelted').innerHTML = formatNumber(window.totalBarsSmelted) + ' bars smelted';
		document.getElementById('statVendor2').innerHTML = formatNumber(window.statVendor);
		document.getElementById('total-spellsCasted-ach').innerHTML = formatNumber(window.spellsCasted);
	};

	function checkAchievementRow(row)
	{
		if (window[row.id] != 1)
		{
			return false;
		}
		const pinkSpan = row.cells[1].children[0];
		if (pinkSpan)
		{
			pinkSpan.style.color = 'blue';
		}
		return true;
	}
	const table = document.querySelector('#ach-tab table.table-stats');
	const rows = table.rows;
	for (let i = 0; i < rows.length; i++)
	{
		const row = rows[i];
		if (row.id && !checkAchievementRow(row))
		{
			observe(row.id, () => checkAchievementRow(row));
		}
	}

	// fix explorers energy
	const oldExplorerTick = window.explorerTick;
	window.explorerTick = () =>
	{
		oldExplorerTick();
		const energyElement = document.getElementById('energy-amount');
		energyElement.innerHTML = 'Energy: ' + formatNumber(window.energy);
	};
	let startingText = new Map();
	function updateEnergy()
	{
		const exploringEls = document.querySelectorAll(
				'.inventory-item-box-exploring'
			+ ', .inventory-item-box-exploring-artifact'
		);
		for (let i = 0; i < exploringEls.length; i++)
		{
			const el = exploringEls[i];
			const firstChild = el.firstChild;
			if (firstChild.nodeType != Node.TEXT_NODE)
			{
				continue;
			}

			const id = el.id.replace(/^item-(.+)-box$/, '$1');
			if (!startingText.has(id))
			{
				startingText.set(id, firstChild.textContent);
			}
			let text = startingText.get(id);
			if (['shrimp', 'sardine', 'tuna', 'swordfish', 'eel', 'shark', 'whale', 'rainbowFish'].includes(id) &&
				/\+\d(?:[\d',\.]*\d[kK]?)?\s*E(?:nergy)?/.test(text))
			{
				// TODO: is amuletSlotId == 2 for enchantedAmuletOfTheSea?
				const mult = window.amuletSlotId == 1 ? 1.1 : window.amuletSlotId == 2 ? 1.15 : 1;
				text = text.replace(/\d(?:[\d',\.]*\d)?/, (numStr) =>
				{
					return Math.floor(parseInt(numStr.replace(/\D/g, ''), 10) * mult);
				});
			}
			firstChild.textContent = formatNumbersInText(text);
		}
	}
	updateEnergy();
	observe('amuletSlotId', () => updateEnergy());
	
	// fix energy format in cooking table
	const cookingTable = document.querySelector('#cooking-tab table.table-stats');
	const cookingRows = cookingTable.rows;
	for (let i = 0; i < cookingRows.length; i++)
	{
		const row = cookingRows[i];
		const descriptionCell = row.cells[row.cells.length - 2];
		descriptionCell.textContent = formatNumbersInText(descriptionCell.textContent);
	}

	// fix leveling up in crafting
	window.setConvertBarToXpOnKeyDown = (amount) =>
	{
		var starDustCounter = window.bindedUpgradeEnchantedHammer >= 1 ? 10 : 13;
		document.getElementById('enchantedHammer-XP-hint-box').style.display = 'block';
		document.getElementById('enchantedHammer-XP-earned').innerHTML = '+'
			+ formatNumber(getXPEarnedWhenConvertingBar(barToConvertToXpType) * amount.value);

		document.getElementById('enchantedHammer-XP-total-stardust-cost').innerHTML = '-'
			+ formatNumber(getXPEarnedWhenConvertingBar(barToConvertToXpType) * amount.value * starDustCounter);
	};

	// fix blue coins
	const oldLoadCoins = window.loadCoins;
	window.loadCoins = () =>
	{
		oldLoadCoins();
		document.getElementById('platinumCoinsAmount-statusbar').innerHTML = formatNumber(window.platinumCoins);
	};

	// fix xp in "select a seed" dialog
	const seedButtons = document.querySelectorAll('#seed-menu-popup > div[id^="btn-"]');
	for (let i = 0; i < seedButtons.length; i++)
	{
		const cells = seedButtons[i].children[0].rows[0].cells;
		const xpNode = cells[cells.length-1].lastChild;
		xpNode.textContent = formatNumbersInText(xpNode.textContent);
	}

	// fix oil
	const oldLoadMiscVariables = window.loadMiscVariables;
	window.loadMiscVariables = () =>
	{
		oldLoadMiscVariables();
		document.getElementById('span-oilPerSecond').innerHTML = formatNumber(window.oilPerSeconds);
		document.getElementById('span-oilLosePerSecond').innerHTML = '-' + formatNumber(oilLosePerSeconds);
	};

	// fix artifact star dust calculation
	const artifactInput = document.getElementById('amount-to-convert-artifact');
	artifactInput.onkeyup = function ()
	{
		const xpRate = document.getElementById('artifact-xp-rate').value;
		const sdRate = window.bindedExploringOrb == 1 ? 22 : 26;
		document.getElementById('artifact-xp-earned').innerHTML = formatNumber(xpRate * this.value);
		document.getElementById('artifact-stardust-needed').innerHTML = formatNumber(xpRate * this.value * 22);
	};
	const oldOpenArtifactDialogue = window.openArtifactDialogue;
	window.openArtifactDialogue = (artifact, xp) =>
	{
		oldOpenArtifactDialogue(artifact, xp);
		artifactInput.onkeyup(null);
	};

	// fix xp-numbers in crafting tables
	function fixNumbersInCraftingTables(tabName)
	{
		const table = document.querySelector('#' + tabName + '-tab table.table-stats');
		const rows = table.rows;
		for (let i = 0; i < rows.length; i++)
		{
			const row = rows[i];
			if (row.cells.length <= 1 || row.querySelector(':scope > th') != null)
			{
				continue;
			}

			const lastCell = row.cells[row.cells.length-1];
			lastCell.textContent = formatNumbersInText(lastCell.textContent);
		}
	}
	fixNumbersInCraftingTables('brewing');
	fixNumbersInCraftingTables('cooking');
	fixNumbersInCraftingTables('spellbook');

 	// fix cost numbers in game shop
	function fixNumersInNpcShop()
	{
		const costEls = document.querySelectorAll('#npc-store-tab span[id^="shop-"][id$="-cost"]');
		for (let i = 0; i < costEls.length; i++)
		{
			const costEl = costEls[i].firstChild;
			costEl.textContent = formatNumbersInText(costEl.textContent);
		}
	}
	const oldLoadNpcShop = window.loadNpcShop;
	window.loadNpcShop = () =>
	{
		oldLoadNpcShop();
		fixNumersInNpcShop();
	};

	// fix stardust numbers of wizard tab
	const wizardBoxes = document.querySelectorAll('#wizard-tab .inventory-item-box');
	for (let i = 0; i < wizardBoxes.length; i++)
	{
		const secondChild = wizardBoxes[i].childNodes[1];
		if (secondChild.nodeType != Node.TEXT_NODE)
		{
			continue;
		}
		
		secondChild.textContent = formatNumbersInText(secondChild.textContent);
	}

	const globalLevelEl3 = document.getElementById('level-global-3');
	if (globalLevelEl3)
	{
		const rankNode = globalLevelEl3.parentNode.firstChild;
		rankNode.textContent = formatNumbersInText(rankNode.textContent);
	}

	// fix group task shop
	const oldLoadGroupTaskShop = window.loadGroupTaskShop;
	function fixElementsTextContent(el)
	{
		const num = parseInt(el.textContent, 10);
		if (!isNaN(num))
		{
			el.textContent = formatNumber(num);
		}
	}
	window.loadGroupTaskShop = () =>
	{
		oldLoadGroupTaskShop();

		fixElementsTextContent(document.getElementById('group-task-tokens-value'));
		fixElementsTextContent(document.getElementById('grp-shop-badge-price'));
	};
}



/**
 * initialize notifications
 * 
 * thanks /u/Vomera for the idea
 */

function observeTimer(k, onComplete, zero = 0)
{
	observe(k, (key, oldValue, newValue) =>
	{
		if (oldValue > zero && newValue == zero)
		{
			onComplete(key);
		}
	});
}
function notifyClickable(title, options)
{
	return notify(title, options).then((n) =>
	{
		n.onclick = (...args) =>
		{
			window.focus();
			n.close();
		};
		return n;
	});
}
// use notification2Tab on tab change (window.openTab)
const notification2Tab = new Map();
const notificationMap = new Map();
function notifyTabClickable(title, options, tabName)
{
	if (notificationMap.has(title))
	{
		notificationMap.get(title).close();
	}

	return notifyClickable(title, options).then((n) =>
	{
		if (!notification2Tab.has(tabName))
		{
			notification2Tab.set(tabName, new Set());
		}
		const closeObj = {
			close: () =>
			{
				n.close();
				if (notificationMap.get(title) == closeObj)
				{
					notificationMap.delete(title);
				}
				notification2Tab.get(tabName).delete(closeObj);
			}
		};
		notificationMap.set(title, closeObj);
		notification2Tab.get(tabName).add(closeObj);

		const oldOnclick = n.onclick;
		n.onclick = () =>
		{
			oldOnclick();
			window.openTab(tabName);
		};
		return n;
	});
}
function hideNotificationsFromTab(tabName)
{
	if (notification2Tab.has(tabName))
	{
		notification2Tab.get(tabName).forEach((n) => n.close());
	}
}
function notifyCoop(msg)
{
	window.send('OPEN_TAB=COOP');
	return notifyTabClickable('Group Task', {
		body: msg.replace(/!$/, '.')
		, icon: 'images/icons/coop.png'
	}, 'coop');
}
function notifyVendor()
{
	/*
"I have changed my items, come check them out."<br><br><img src="images/shop/vendor.png" width="120px" height="140px">
	*/
	return notifyTabClickable('Vendor', {
		body: 'The vendor changed his items.'
		, icon: 'images/shop/vendor.png'
	}, 'vendor');
}
function notifyBoat(msg)
{
	/*
<b>Your boat brings back:</b><br><br><span class="exploring-norm-loot"><img class="small-img" src="images/exploring/rawSardine.png"> 2</span> <span class="exploring-norm-loot"><img class="small-img" src="images/exploring/rawTuna.png"> 1</span> 
	*/
	const tmp = document.createElement('templateWrapper');
	tmp.innerHTML = msg;
	const loot = [];
	const lootEls = tmp.querySelectorAll('.exploring-norm-loot');
	for (let i = 0; i < lootEls.length; i++)
	{
		const el = lootEls[i];
		const num = parseInt(el.textContent, 10);
		const itemName = imgSrc2NamePlural(el.innerHTML, num);
		if (itemName)
		{
			loot.push(formatNumber(num) + ' ' + itemName);
		}
		else
		{
			loot.push(el.innerHTML);
		}
	}
	return notifyTabClickable('Fishing boat returns', {
		body: 'Your boat brings back: ' + loot.join(', ')
		, icon: 'images/exploring/fishingBoat.png'
	}, 'archaeology');
}
function notifyRobot(msg)
{
	/*
<b>Your robot brings back:</b><br /><br />9,000,000 stone<br />2,250,000 copper<br />2,250,000 tin<br />675,000 iron<br />450,000 silver<br />180,000 gold<br />22,500 flint<br />4,500 marble<br />1,800 titanium<br />45 promethium<br />
	*/
	return notifyTabClickable('Robot returns', {
		body: msg
			.replace('<br /><br />', ' ')
			.replace(/<br\s*\/?>(?=.)/g, ', ')
			.replace(/<[^>]+>/g, '')
		, icon: 'images/crafting/robot.png'
	}, 'repair');
}
function notifyAchievement()
{
	/*
You have completed an achievement
	*/
	return notifyTabClickable('Achievement got', {
		body: 'You have completed an achievement.'
		, icon: 'images/shop/ach.png'
	}, 'ach');
}
function notifyMsg(msg)
{
	if (msg === 'You have completed your group task!' ||
		/ has completed his group task\.$/.test(msg))
	{
		return notifyCoop(msg);
	}
	else if (/I have changed my items, come check them out/.test(msg))
	{
		return notifyVendor();
	}
	else if (/Your boat brings back:/.test(msg))
	{
		notifyBoat(msg);
	}
	else if (/Your robot brings back:/.test(msg))
	{
		notifyRobot(msg);
	}
	else if (msg === 'You have completed an achievement')
	{
		notifyAchievement();
	}
	else if (document.hidden || !document.hasFocus())
	{
		notifyClickable('Message from server', {
			body: msg
			// , icon: 'images/minerals/diamond.png'
		});
	}
	return Promise.reject();
}
function initNotifications()
{
	function requestNotificationPermission()
	{
		if (!getSetting('showNotifications') ||
			Notification.permission !== 'default')
		{
			return;
		}

		Notification.requestPermission().then(function (result)
		{
			if (result == 'denied')
			{
				console.error('Permission to show notifications has been denied by the user.');
			}
		});
	}
	requestNotificationPermission();
	observeSetting('showNotifications', () => requestNotificationPermission());

	// don't send TAB_OFF when notifications have to be shown
	window.checkIfTabIsOpen = () =>
	{
		if (!document.hidden || getSetting('showNotifications')) //open
		{
			if (tabOn == 0)
			{
				send('TAB_ON');
				tabOn = 1;
			}
		}
		else //minimized
		{
			if (tabOn == 1)
			{
				send('TAB_OFF');
				tabOn = 0;
			}
		}

		window.setTimeout(window.checkIfTabIsOpen, 500);
	};

	let lastFarmingNotification;
	observeTimer(['farmingPatchTimer1', 'farmingPatchTimer2', 'farmingPatchTimer3', 'farmingPatchTimer4', 'farmingPatchTimer5', 'farmingPatchTimer6'], (key) =>
	{
		const now = (new Date).getTime();
		const timeDiff = now - (lastFarmingNotification || 0);
		if (timeDiff < 10e3)
		{
			return;
		}

		lastFarmingNotification = now;
		notifyTabClickable('Harvest', {
			body: 'One or more of your crops is ready for harvest.'
			, icon: 'images/icons/watering-can.png'
		}, 'farming');
	}, 1);
	observeTimer('exploringTimer', (key) =>
	{
		notifyTabClickable('Explorer ready', {
			body: 'Your explorer is back.'
			, icon: 'images/icons/archaeology.png'
		}, 'archaeology');
	});
	observeTimer('furnaceCurrentTimer', (key) =>
	{
		notifyTabClickable('Furnace ready', {
			body: 'Your smelting has finished.'
			, icon: 'images/crafting/' + furnaceLevels[window.bindedFurnaceLevel] + 'Furnace.gif'
		}, 'repair');
	});
	observeTimer('rocketTimer', (key) =>
	{
		notifyTabClickable('Rocket ready', {
			body: 'You landed on the moon.'
			, icon: 'images/crafting/rocket.png'
		}, 'repair');
	});
	observeTimer('robotTimer', (key) =>
	{
		notifyTabClickable('Robot ready', {
			body: 'Your robot is back.'
			, icon: 'images/crafting/robot.png'
		}, 'repair');
	});
	observeTimer('fishingBoatTimer', (key) =>
	{
		notifyTabClickable('Fishing boat ready', {
			body: 'Your fishing boat is back.'
			, icon: 'images/exploring/fishingBoat.png'
		}, 'archaeology');
	});
	observeTimer('largeFishingBoatTimer', (key) =>
	{
		notifyTabClickable('Large fishing boat ready', {
			body: 'Your large fishing boat is back.'
			, icon: 'images/exploring/largeFishingBoat.png'
		}, 'archaeology');
	});
	/*
	// potions
	'starDustPotionTimer'
	'coinPotionTimer'
	'seedPotionTimer'
	'smeltingPotionTimer'
	'oilPotionTimer'
	'miningPotionTimer'
	'superStarDustPotionTimer'
	'fastFurnacePotionTimer'
	'superCompostPotionTimer'
	'megaStarDustPotionTimer'
	'superOilPotionTimer'
	'whaleFishingPotionTimer'
	'fishingPotionTimer'
	'essencePotionTimer'
	'megaOilPotionTimer'
	'superEssencePotionTimer'
	'sparklingCompostPotionTimer'
	'engineeringPotionTimer'

	// magic effects
	'superDrillsTimer'
	'superGemFinderTimer'
	'smallSipsTimer'
	'superPirateTimer'
	'superCrushersTimer'
	'superGiantDrillsTimer'
	'fastVendorTimer'
	'superRoadHeadersTimer'
	'animatedAxeTimer'
	'superExcavatorsTimer'

	// ?
	'compostTimer'
	'eatingTimer'
	'exploringTimeReductionPerc'
	'ghostEssenceTimer'
	*/
}



/**
 * fix level bar
 */

function fixLevelBar()
{
	// size changing: 1267x65 -> 1256x105
	document.getElementById('level-status-up').style.lineHeight = '102px';

	const style = document.createElement('style');
	style.innerHTML = `
.top-status-bar td.no-borders[width="27%"]
{
	position: relative;
}
#span-oil ~ span
{
	position: absolute;
	margin-left: 10px;
	top: 29px;
}
#span-oil + span
{
	top: 5px;
}
tr[id^="level-status-row"] > td > img:first-child[width="40px"]
{
	margin: 0 5px;
}
#level-status-row2 > td > img:first-child
{
	height: 50px;
}
.unlock-skill-btn
{
	margin-left: 5px;
}
span[id^="progress-percentage-"][id$="-small"]
{
	height: calc(90% + 2px);
	margin: 0;
}

.notification-timer-box
{
	line-height: 52px;
}
#fishingBoat-timer > img:first-child
{
	height: 40px;
	width: 53px;
}
#largeFishingBoat-timer > img:first-child
{
	padding: 5px 5px 8px 0px !important;
	height: 40px;
	width: 56px;
}
	`;
	document.head.appendChild(style);

	const oilPerSecond = document.getElementById('span-oilPerSecond');
	oilPerSecond.previousSibling.textContent = '+';
	oilPerSecond.nextSibling.textContent = '';
	const oilLosePerSecond = document.getElementById('span-oilLosePerSecond');
	oilLosePerSecond.previousSibling.textContent = '';
	oilLosePerSecond.nextSibling.textContent = '';
}



/**
 * fix message box
 */

function fixMsgBox()
{
	const oldDialogFn = window.$.fn.dialog;
	window.$.fn.dialog = function (...args)
	{
		if (args[0] != 'close')
		{
			$('.ui-widget-header').show();
		}
		return oldDialogFn.apply(this, args);
	};

	const oldMessageBox = window.messageBox;
	let timeout;
	window.messageBox = (msg) =>
	{
		const $el = $('#dialog-timer');
		if ($el.hasClass('ui-dialog-content'))
		{
			$el.dialog('destroy');
		}

		document.getElementById('dialog-text-timer').innerHTML = msg;

		$el.dialog(
		{
			create: function (event, ui)
			{
				$('.ui-widget-header').hide();
			}
			, width: 550
			, height: 100
			, show:
			{
				effect: 'fade'
				, duration: 50
			}
			, hide:
			{
				effect: 'fade'
				, delay: 1000
				, duration: 1000
			}
		}).dialog('close');
	};
}



/**
 * add a notification box (like the harvest one) for coop events
 */

function addCoopNotificationBox()
{
	const notifBox = document.createElement('span');
	notifBox.id = 'coop-notif';
	notifBox.classList.add('notification-timer-box');
	notifBox.style.width = 'auto';
	notifBox.style.cursor = 'pointer';
	notifBox.style.display = 'none';
	notifBox.style.padding = '0 10px';
	notifBox.onclick = () =>
	{
		window.openTab('coop');
		window.send('OPEN_TAB=COOP');
	};
	notifBox.innerHTML = `<span class="activate-tooltip" title="Group task is finished">
		<img width="46px" height="40px" style="vertical-align: middle; padding: 5px 0px 5px 0px;" src="images/icons/coop.png">
		<span class="progress"></span>
	</span>`;
	document.getElementById('farming-notif').parentNode.appendChild(notifBox);

	const oldLoadCoop = window.loadCoop;
	window.loadCoop = (data) =>
	{
		/**
		 * There are some userscripts (DH QoL *cough*) which uses setting the innerHTML of the notification box parent
		 * to add elements.
		 * So the reference to the created element (above) isn't valid anymore and has to be refreshed after this
		 * addition to the innerHTML.
		 * This functions "appendChild" and "insertBefore" aren't there for no reason... :(
		 * This error took me more than 4 hours to find and is just stupid (because someone is too lazy to create clean
		 * and considerate software).
		 * 
		 * Edit:
		 * I don't know if anybody care to read my code, but I want to apologize for the comment above.
		 * I love DHQoL (I didn't even spell it correctly - shame on me) and was more annoyed by my own incompetence
		 * than by any behaviour of DHQoL.
		 * Sorry for that unnecessary salty comment.
		 */
		const notifBox = document.getElementById('coop-notif');
		const coopProgress = notifBox.querySelector('span.progress');
		const dataArray = data == 'none' ? [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] : data.split('~');
		const player = [
			dataArray[0]
			, dataArray[1]
			, dataArray[2]
			, dataArray[3]
		];
		const task_id = [
			dataArray[4]
			, dataArray[5]
			, dataArray[6]
			, dataArray[7]
		];
		const task_value = [
			dataArray[8]
			, dataArray[9]
			, dataArray[10]
			, dataArray[11]
		];
		const task_neededValue = [
			dataArray[12]
			, dataArray[13]
			, dataArray[14]
			, dataArray[15]
		];

		function isPlayer(i)
		{
			return player[i] !== 'none' && player[i] !== 'claimed';
		}
		const started = task_id.every((id, i) => !isPlayer(i) || id != 0);
		const totalNum = player.filter((name, i) => isPlayer(i)).length;
		const finishedNum = task_value.filter((value, i) => isPlayer(i) && value == task_neededValue[i]).length;
		const showBox = started && finishedNum > 0;
		notifBox.style.display = showBox ? '' : 'none';
		coopProgress.textContent = finishedNum == totalNum ? '' : finishedNum + '/' + totalNum;

		const i = player.indexOf(window.username);
		const thisFinished = started && task_value[i] == task_neededValue[i];
		coopProgress.style.color = thisFinished ? 'lime' : '';

		for (let j = 1; j <= 4; j++)
		{
			const row = document.getElementById('started-row-p' + j);
			if (row)
			{
				row.style.backgroundColor = j == (i+1) ? 'lightblue' : '';
			}
		}

		return oldLoadCoop(data);
	};
	window.send('OPEN_TAB=COOP');
}



/**
 * fix chat
 */

const chatHistoryKey = 'chatHistory';
const maxChatHistoryLength = 100;
const reloadedChatData = {
	timestamp: 0
	, username: ''
	, userlevel: 0
	, sigil: 0
	, tag: 0
	, type: -1
	, msg: '[...]'
};
let chatHistory = [];
function add2ChatHistory(data)
{
	const splitArray = data.split('~');
	data = {
		timestamp: (new Date()).getTime()
		, username: splitArray[0]
		, userlevel: parseInt(splitArray[1], 10)
		, sigil: parseInt(splitArray[3], 10)
		, tag: parseInt(splitArray[2], 10)
		, type: parseInt(splitArray[5], 10)
		, msg: splitArray[4]
	};
	if (data.type == 2)
	{
		data.userlevel = window.getGlobalLevel();
	}

	chatHistory.push(data);
	chatHistory = chatHistory.slice(-maxChatHistoryLength);
	localStorage.setItem(chatHistoryKey, JSON.stringify(chatHistory));
	return data;
}
function getChatTab(username)
{
	const chatTabs = document.getElementById('chat-tabs');
	let tab = chatTabs.querySelector('div.chat-tab[data-username="' + username + '"]');
	if (!tab)
	{
		tab = document.createElement('div');
		tab.className = 'chat-tab';
		tab.dataset.username = username;
		tab.dataset.new = 0;
		const filler = chatTabs.querySelector('.filler');
		if (filler)
		{
			chatTabs.insertBefore(tab, filler);
		}
		else
		{
			chatTabs.appendChild(tab);
		}
	}
	return tab;
}
function getChatDiv(username)
{
	const id = 'chat-' + (username == '' ? 'area-div' : 'pm-' + username);
	let div = document.getElementById(id);
	if (!div)
	{
		div = document.createElement('div');
		div.setAttribute('disabled', 'disabled');
		div.id = 'chat-pm-' + username;
		div.className = 'chat-area-div';

		const height = document.getElementById('chat-area-div').style.height;
		div.style.height = height;

		const generalChat = document.getElementById('chat-area-div');
		generalChat.parentNode.insertBefore(div, generalChat);
	}
	return div;
}
function changeChatTab(oldTab, newTab)
{
	const oldChatDiv = getChatDiv(oldTab.dataset.username);
	oldChatDiv.classList.remove('selected');
	const newChatDiv = getChatDiv(newTab.dataset.username);
	newChatDiv.classList.add('selected');

	const toUsername = newTab.dataset.username;
	const newTextPlaceholder = toUsername == '' ? window.username + ':' : 'PM to ' + toUsername + ':';
	document.getElementById('textbox-chat').placeholder = newTextPlaceholder;

	if (window.isAutoScrolling)
	{
		setTimeout(() => newChatDiv.scrollTop = newChatDiv.scrollHeight);
	}
}
const chatSigils = [
	null
	, { key: 'maxLevel',		title: 'Maxed Skills' }
	, { key: 'maxMining',		title: 'Master in Mining' }
	, { key: 'maxCrafting',		title: 'Master in Crafting' }
	, { key: 'maxBrewing',		title: 'Master in Brewing' }
	, { key: 'maxFarming',		title: 'Master in Farming' }
	, { key: 'hardcore',		title: 'Hardcore Account' }
	, { key: 'halloween2015',	title: 'Halloween 2015' }
	, { key: 'maxExploring',	title: 'Master in Exploring' }
	, { key: 'christmas2015',	title: 'Chirstmas 2015' }
	, { key: 'maxMagic',		title: 'Master in Magic' }
	, { key: 'easter2016',		title: 'Holiday' }
	, { key: 'coop',			title: 'COOP' }
	, { key: 'maxCooking',		title: 'Master in Cooking' }
	, { key: 'halloween2016',	title: 'Halloween 2016' }
	, { key: 'christmas2016',	title: 'Chirstmas 2016' }
];
const chatTags = [
	null
	, { key: 'donor', name: '' }
	, { key: 'contributor', name: 'Contributor' }
	, null
	, { key: 'mod', name: 'Moderator' }
	, { key: 'dev', name: 'Dev' }
];
const linkParseRegex = /(^|\s)(https?:\/\/\S+|\S*www\.|\S+\.(?:com|ca|co|net|us))(\s|$)/;
function isPM(data)
{
	return data.type == 1 || data.type == 2;
}
const locale = 'en-US';
const localeOptions = {
	hour12: false
	, year: 'numeric'
	, month: 'long'
	, day: 'numeric'
	, hour: '2-digit'
	, minute: '2-digit'
	, second: '2-digit'
};
function newRefreshChat(data)
{
	// username is 3-12 characters long
	let chatbox = document.getElementById('chat-area-div');

	if (mutedPeople.some((name) => name == data.username))
	{
		return;
	}

	const isThisPm = isPM(data);
	const msgUsername = data.type == 2 ? window.username : data.username;

	const historyIndex = chatHistory.indexOf(data);
	const historyPart = historyIndex == -1 ? [] : chatHistory.slice(0, historyIndex).reverse();
	const msgBeforeUser = historyPart.find(d => isThisPm && isPM(d) || !isThisPm && !isPM(d));
	const msgBeforeTime = historyPart.find(d => isThisPm && isPM(d) || !isThisPm && !isPM(d) && d.type != -1);
	let isSameUser = false;
	let isSameTime = false;
	if (msgBeforeUser)
	{
		const beforeUsername = msgBeforeUser.type == 2 ? window.username : msgBeforeUser.username;
		isSameUser = beforeUsername === msgUsername;
	}
	if (msgBeforeTime)
	{
		isSameTime = Math.floor(data.timestamp / 1000 / 60) - Math.floor(msgBeforeTime.timestamp / 1000 / 60) === 0;
	}

	const d = new Date(data.timestamp);
	const hour = (d.getHours() < 10 ? '0' : '') +  d.getHours();
	const minute = (d.getMinutes() < 10 ? '0' : '') +  d.getMinutes();
	const sigil = chatSigils[data.sigil] || { key: '', title: '' };
	const tag = chatTags[data.tag] || { key: '', name: '' };
	const formattedMsg = data.msg.replace(new RegExp(linkParseRegex, 'g'), (wholeMatch, before, link, after) =>
	{
		if (/%22|%27|%3E|%3C|&#62|&#60;|;|~|\\"|<|>|javascript:|window|document|cookie/.test(link))
		{
			return wholeMatch;
		}
		link = (link.startsWith('http') ? '' : 'http://') + link;
		return before + `<a href="${link}" target="_blank">${link}</a>` + after;
	});

	const msgTitle = data.type == -1 ? 'Chat loaded on ' + d.toLocaleString(locale, localeOptions) : '';
	let chatSegment = `<span class="chat-msg" data-type="${data.type}" data-tag="${tag.key}">`
		+ `<span
			class="timestamp"
			data-hour="${hour}"
			data-minute="${minute}"
			title="${d.toLocaleString(locale, localeOptions)}"
			data-same-time="${isSameTime}"></span>`
		+ `<span class="user" data-name="${msgUsername}" data-same-user="${isSameUser}">`
			+ `<span class="sigil ${sigil.key}" title="${sigil.title}"></span>`
			+ `<span class="tag chat-tag-${tag.key}">${tag.name}</span>`
			+ `<span
				class="name"
				data-level="${data.userlevel}"
				oncontextmenu="searchPlayerHicores('${msgUsername}');return false;"
				onclick="preparePM('${msgUsername}')">${msgUsername}</span>`
		+ `</span>`
		+ `<span class="msg" title="${msgTitle}">${formattedMsg}</span>`
	+ `</span>`;

	const chatTab = getChatTab(isThisPm ? data.username : '');
	if (!chatTab.classList.contains('selected'))
	{
		chatTab.dataset.new = parseInt(chatTab.dataset.new, 10) + 1;
	}
	if (isThisPm)
	{
		window.lastPMFrom = data.username;
		chatbox = getChatDiv(data.username);
	}

	const tmp = document.createElement('templateWrapper');
	tmp.innerHTML = chatSegment;
	while (tmp.childNodes.length > 0)
	{
		chatbox.appendChild(tmp.childNodes[0]);
	}

	if (window.isAutoScrolling)
	{
		setTimeout(() => chatbox.scrollTop = chatbox.scrollHeight);
	}
}
function applyChatStyle()
{
	const style = document.createElement('style');
	style.innerHTML = `
span.chat-msg
{
	display: flex;
	margin-bottom: 1px;
}
.chat-msg[data-type="-1"]
{
	font-size: 0.8rem;
}
.chat-msg .timestamp::before
{
	color: hsla(0, 0%, 50%, 1);
	font-size: .9rem;
}
.chat-msg .timestamp[data-same-time="true"]::before
{
}
#chat-toggle-timestamps:checked ~ div[id^="chat-"] .chat-msg:not([data-type="-1"]) .timestamp::before
{
	content: attr(data-hour) ':' attr(data-minute);
	display: inline-block;
	margin: 0 5px;
	width: 2.5rem;
}

.chat-msg[data-type="1"] { color: purple; }
.chat-msg[data-type="2"] { color: purple; }
.chat-msg[data-type="3"] { color: blue; }
.chat-msg[data-tag="contributor"] { color: green; }
.chat-msg[data-tag="mod"] { color: #669999; }
.chat-msg[data-tag="dev"] { color: #666600; }
.chat-msg .user
{
	margin-right: 5px;
	white-space: nowrap;
}
.chat-msg .user[data-same-user="true"]:not([data-name="none"])
{
	opacity: .3;
}
.chat-msg .user .name:not([data-level=""])::after
{
	content: ' (' attr(data-level) '):';
}

.chat-msg .user .sigil:not([class$=" "])::before
{
	background-size: 20px 20px;
	content: '';
	display: inline-block;
	margin-right: 1px;
	width: 20px;
	height: 20px;
	vertical-align: middle;
}
.chat-msg .user .sigil.maxLevel::before { background-image: url('images/icons/stats.png'); }
.chat-msg .user .sigil.maxCrafting::before { background-image: url('images/icons/anvil.png'); }
.chat-msg .user .sigil.maxMining::before { background-image: url('images/icons/pickaxe.png'); }
.chat-msg .user .sigil.maxBrewing::before { background-image: url('images/brewing/vialofwater_chat.png'); }
.chat-msg .user .sigil.maxFarming::before { background-image: url('images/icons/watering-can.png'); }
.chat-msg .user .sigil.maxExploring::before { background-image: url('images/icons/archaeology.png'); }
.chat-msg .user .sigil.maxCooking::before { background-image: url('images/icons/cookingskill.png'); }
.chat-msg .user .sigil.maxMagic::before { background-image: url('images/magic/wizardHatIcon.png'); }
.chat-msg .user .sigil.hardcore::before { background-image: url('images/icons/hardcoreIcon.png'); }
.chat-msg .user .sigil.coop::before { background-image: url('images/icons/groupTaskBadge5.png'); }
.chat-msg .user .sigil.halloween2015::before { background-image: url('images/icons/halloween2015.png'); }
.chat-msg .user .sigil.christmas2015::before { background-image: url('images/sigils/christmas2015.png'); }
.chat-msg .user .sigil.easter2016::before { background-image: url('images/sigils/easter2016.png'); }
.chat-msg .user .sigil.halloween2016::before { background-image: url('images/sigils/halloween2016.png'); }
.chat-msg .user .sigil.christmas2016::before { background-image: url('images/sigils/christmas2016.png'); }

.chat-msg .user .tag
{
	margin-right: 3px;
}
.chat-msg .user .tag.chat-tag-
{
	display: none;
}
.chat-msg .user .tag.chat-tag-donor::before
{
	background-image: url('images/icons/donor-icon.gif');
	background-size: 20px 20px;
	content: '';
	display: inline-block;
	height: 20px;
	width: 20px;
	vertical-align: middle;
}

.chat-msg .user .name
{
	color: rgba(0, 0, 0, 0.7);
}
.chat-msg[data-type="-1"] .user > *,
.chat-msg[data-type="1"] .user > .sigil,
.chat-msg[data-type="1"] .user > .tag,
.chat-msg[data-type="2"] .user > .sigil,
.chat-msg[data-type="2"] .user > .tag,
.chat-msg[data-type="3"] .user > *
{
	display: none;
}
.chat-msg[data-type="3"] .user::before
{
	background: -webkit-linear-gradient(#004747, #00FFFF);
	background: -o-linear-gradient(#004747, #00FFFF);
	background: -moz-linear-gradient(#004747, #00FFFF);
	background: linear-gradient(#004747, #00FFFF);
	border: 1px solid black;
	color: white;
	content: 'Server Message';
	font-family: Comic Sans MS, "Times New Roman", Georgia, Serif;
	font-size: 9pt;
	padding: 0px 5px 2px 5px;
}

.chat-msg .msg
{
	word-wrap: break-word;
	min-width: 0;
}

#chat-box-area .chat-area-div
{
	width: 100%;
	height: 130px;
	display: none;
}
#chat-box-area .chat-area-div.selected
{
	display: block;
}
#chat-tabs
{
	background-color: hsla(0, 0%, 90%, 1);
	display: flex;
	margin: 10px -10px -10px;
	flex-wrap: wrap;
}
#chat-tabs .chat-tab
{
	background-color: gray;
	border-top: 1px solid black;
	border-right: 1px solid black;
	cursor: pointer;
	display: inline-block;
	font-weight: normal;
	padding: 0.3rem .6rem;
}
#chat-tabs .chat-tab.selected
{
	background-color: silver;
	border-top-color: silver;
}
#chat-tabs .chat-tab.filler
{
	background-color: transparent;
	border-right: 0;
	box-shadow: inset 5px 5px 5px -5px rgba(0, 0, 0, 0.5);
	color: transparent;
	cursor: default;
	flex-grow: 1;
}
#chat-tabs .chat-tab::before
{
	content: attr(data-username);
}
#chat-tabs .chat-tab:not(.filler)[data-username=""]::before
{
	content: 'Server';
}
#chat-tabs .chat-tab::after
{
	content: '(' attr(data-new) ')';
	font-size: .9rem;
	font-weight: bold;
	margin-left: .4rem;
}
#chat-tabs .chat-tab[data-new="0"]::after
{
	font-weight: normal;
}
	`;
	document.head.appendChild(style);
}
function fixChat()
{
	if (!getSetting('useNewChat'))
	{
		return;
	}

	const chatBoxArea = document.getElementById('chat-box-area');

	const toggles = chatBoxArea.querySelectorAll('input[value^="Toggle"]');
	function getChatValue(key)
	{
		if (key == 'autoscroll' || key == 'timestamps')
		{
			return JSON.parse(localStorage.getItem('chat.' + key) || 'true');
		}
		return false;
	}
	function setChatValue(key, value)
	{
		if (key == 'autoscroll' || key == 'timestamps')
		{
			localStorage.setItem('chat.' + key, JSON.stringify(value));
			if (key == 'autoscroll')
			{
				window.isAutoScrolling = value;
			}
			else if (key == 'timestamps')
			{
				window.showTimestamps = value;
			}
			return true;
		}
		return false;
	}
	for (let i = 0; i < toggles.length; i++)
	{
		const toggle = toggles[i];
		const parent = toggle.parentNode;
		const toggleWhat = toggle.value.replace('Toggle ', '');
		const toggleKey = toggleWhat.toLowerCase();
		const id = 'chat-toggle-' + toggleKey;
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = id;
		checkbox.value = toggleKey;
		const checkedValue = getChatValue(toggleKey);
		setChatValue(toggleKey, checkedValue);
		checkbox.checked = checkedValue;
		parent.insertBefore(checkbox, toggle);
		const label = document.createElement('label');
		label.htmlFor = id;
		label.textContent = toggleWhat;
		parent.insertBefore(label, toggle);
		toggle.style.display = 'none';

		checkbox.addEventListener('change', () =>
		{
			if (!setChatValue(checkbox.value, checkbox.checked))
			{
				toggle.click();
			}
		});
	}

	// add chat tabs
	const chatTabs = document.createElement('div');
	chatTabs.id = 'chat-tabs';
	chatTabs.addEventListener('click', (event) =>
	{
		const newTab = event.target;
		if (!newTab.classList.contains('chat-tab') || newTab.classList.contains('filler'))
		{
			return;
		}

		const oldTab = chatTabs.querySelector('.chat-tab.selected');
		if (newTab == oldTab)
		{
			return;
		}
		oldTab.classList.remove('selected');
		newTab.classList.add('selected');
		newTab.dataset.new = 0;

		changeChatTab(oldTab, newTab);
	});
	chatBoxArea.appendChild(chatTabs);

	const generalTab = getChatTab('');
	generalTab.classList.add('selected');
	const generalChatDiv = getChatDiv('');
	generalChatDiv.classList.add('selected');
	// works only if username length of 1 isn't allowed
	const fillerTab = getChatTab('f');
	fillerTab.classList.add('filler');

	const oldSendChat = window.sendChat;
	window.sendChat = (msg) =>
	{
		const selectedTab = document.querySelector('.chat-tab.selected');
		if (selectedTab.dataset.username != '')
		{
			msg = '/pm ' + selectedTab.dataset.username + ' ' + msg;
		}
		oldSendChat(msg);
	};

	const oldChatBoxZoom = window.chatBoxZoom;
	function setChatBoxHeight(height)
	{
		document.getElementById('chat-area-div').style.height = height;
		const chatDivs = chatBoxArea.querySelectorAll('div[id^="chat-pm-"]');
		for (let i = 0; i < chatDivs.length; i++)
		{
			chatDivs[i].style.height = height;
		}
	}
	window.chatBoxZoom = (zoom) =>
	{
		oldChatBoxZoom(zoom);

		const height = document.getElementById('chat-area-div').style.height;
		localStorage.setItem('chat.height', height);
		setChatBoxHeight(height);
	};
	setChatBoxHeight(localStorage.getItem('chat.height'));

	chatHistory = JSON.parse(localStorage.getItem(chatHistoryKey) || JSON.stringify(chatHistory));
	const lastNotPM = chatHistory.slice(0).reverse().find((d) =>
	{
		return d.type != 1 && d.type != 2;
	});
	if (lastNotPM && lastNotPM.type != -1)
	{
		reloadedChatData.timestamp = (new Date()).getTime();
		chatHistory.push(reloadedChatData);
	}
	chatHistory.forEach(d => newRefreshChat(d));
	// reset the new counter for all tabs
	const tabs = document.querySelectorAll('.chat-tab');
	for (let i = 0; i < tabs.length; i++)
	{
		tabs[i].dataset.new = 0;
	}
	applyChatStyle();

	const oldRefreshChat = window.refreshChat;
	window.refreshChat = (data) =>
	{
		data = add2ChatHistory(data);
		return newRefreshChat(data);
	};
}



/**
 * fix crafting
 */

function fixCrafting()
{
	// show selection for the bar type
	const oldSetConvertBarToXpAgain = window.setConvertBarToXpAgain;
	window.setConvertBarToXpAgain = (barType, amount) =>
	{
		oldSetConvertBarToXpAgain(barType, amount);

		const selector = (bar = '') => `#enchanted-hammer-boxes input[type="image"][src$="${bar}bar.png"]`;
		const barImages = document.querySelectorAll(selector());
		for (let i = 0; i < barImages.length; i++)
		{
			barImages[i].style.backgroundColor = '';
		}
		const img = document.querySelector(selector(barType));
		img.style.backgroundColor = 'red';
	};
}



/**
 * activity log
 * 
 * thanks /u/Vomera
 */

const activityLogKey = 'activityLog';
const maxActivityLogLength = 200;
let activityLog = [];
const explorerReturns = 'Your explorer brings back:';
const explorerReturnsWithoutArtifacts = 'You find 0 artifacts (+0 xp)';
// unused atm
function processExplorerMessage(msg)
{
	const tmp = createTemplateWrapper(
		msg
			.replace(explorerReturns, '')
			.replace(explorerReturnsWithoutArtifacts, '')
			.replace(/<br\s*\/?>/g, '')
			.trim()
	);

	// handle used artifact potion
	const artifactPotionEl = tmp.querySelector('center > img[src$="artifactPotion.png"]');
	let artifactPotion = '';
	if (artifactPotionEl)
	{
		artifactPotion = tmp.firstElementChild.textContent.trim().replace(/used/i, 'One artifact potion used');
		tmp.removeChild(tmp.firstElementChild);
	}

	// handle loot bags and received artifacts
	const lootEls = tmp.querySelectorAll('span[class^="exploring-norm-loot"]');
	const loot = [];
	const artifacts = [];
	for (let i = 0; i < lootEls.length; i++)
	{
		const el = lootEls[i];
		const quantityStr = el.textContent.trim();
		const num = parseInt(quantityStr, 10);
		const isArtifact = quantityStr.includes('xp');
		const itemName = isArtifact ? imgSrc2Name(el.innerHTML) : imgSrc2NamePlural(el.innerHTML, num);
		if (itemName)
		{
			if (isArtifact)
			{
				artifacts.push(itemName + ' (' + quantityStr.replace(num.toString(), formatNumber(num)) + ')');
			}
			else
			{
				loot.push(formatNumber(num) + ' ' + itemName);
			}
		}
		else
		{
			loot.push(el.innerHTML);
		}
		el.parentNode.removeChild(el);
	}

	const noArtifacts = msg.includes(explorerReturnsWithoutArtifacts);
	let newMsg = '';
	if (tmp.textContent.trim() != '')
	{
		const regex = /<([^>\s]+)[^>]*>\s*<\/\1>/;
		let html = tmp.innerHTML;
		while (regex.test(html))
		{
			html = html.replace(regex, '');
		}
		newMsg += html + '. ';
	}
	if (artifactPotion != '')
	{
		newMsg += artifactPotion + '. ';
	}
	newMsg += explorerReturns + ' ' + loot.concat(artifacts).join(', ');
	if (noArtifacts)
	{
		newMsg += '. ' + explorerReturnsWithoutArtifacts;
	}
	return newMsg;
}
// unused atm
function processGroupMessage(msg)
{
	const tmp = createTemplateWrapper(msg);
	const tokenEl = tmp.querySelector('.basic-smallbox');
	const tokenNum = parseInt(tokenEl.textContent, 10);
	let newMsg = tokenEl.textContent.trim() + ' ' + imgSrc2NamePlural(tokenEl.innerHTML, tokenNum);
	const infoSpan = tmp.querySelector(':scope > span');
	if (infoSpan)
	{
		newMsg += ' - ' + infoSpan.textContent;
	}
	return newMsg;
}
/*
<span style='color:green;'>1 products cooked</span><br /><br /><img src='images/icons/cookingskill.png' width='20px' height='20px' style='vertical-align:middle'> +630 xp
<span style='color:green;'>1 products cooked</span><br /><br /><img src='images/icons/cookingskill.png' width='20px' height='20px' style='vertical-align:middle'> +720 xp
<span style='color:green;'>5 products cooked</span><br /><br /><img src='images/icons/cookingskill.png' width='20px' height='20px' style='vertical-align:middle'> +180 xp
<span style='color:green;'>3 products cooked</span><br /><br /><img src='images/icons/cookingskill.png' width='20px' height='20px' style='vertical-align:middle'> +1680 xp
<span style='color:green;'>3 products cooked</span><br /><br /><img src='images/icons/cookingskill.png' width='20px' height='20px' style='vertical-align:middle'> +84 xp
<span style='color:green;'>1 products cooked</span><br /><br /><img src='images/icons/cookingskill.png' width='20px' height='20px' style='vertical-align:middle'> +560 xp
<span style='color:green;'>0 products cooked</span><br /><br /><span style='color:red;'>1 products burnt</span><br /><br /><img src='images/icons/cookingskill.png' width='20px' height='20px' style='vertical-align:middle'> +0 xp
*/
// unused atm
function processCookingMessage(msg)
{
	const tmp = createTemplateWrapper(msg);
	const products = [];
	const spans = tmp.querySelectorAll(':scope > span');
	for (let i = 0; i < spans.length; i++)
	{
		products.push(spans[i].textContent.trim());
	}
	products.push(tmp.lastChild.textContent);
	return products.join(', ');
}
/*
<center><img width='150px' height='150px' src='images/misc-items/openChest.png'></center><br /><br /><span class='inventory-item-box-smaller'><img class='small-img' src='images/brewing/blewitmushroom.png'> Blewit Mushrooms (400)</span><br />

<center><img width='150px' height='150px' src='images/misc-items/openChest.png'></center><br /><br /><span class='inventory-item-box-smaller'><img class='small-img' src='images/minerals/goldbar.png'> Gold Bars (500)</span><br /><span class='inventory-item-box-smaller'><img class='small-img' src='images/crafting/upgradeFurnaceOrb.png'> Furnace Orb</span>
*/
// unused atm
function processChestMessage(msg)
{
	const tmp = createTemplateWrapper(msg);
	const lootEls = tmp.querySelectorAll('.inventory-item-box-smaller');
	const loot = [];
	for (let i = 0; i < lootEls.length; i++)
	{
		const el = lootEls[i];
		const match = el.textContent.match(/(.+) \((\d+)\)/);
		let num = 1;
		if (match)
		{
			num = parseInt(match[2]);
		}
		const itemName = imgSrc2Name(el.innerHTML, num);
		if (itemName)
		{
			loot.push(num + ' ' + itemName);
		}
		else
		{
			loot.push(el.textContent.trim());
		}
	}
	return 'Opened Chest and got: ' + loot.join(', ');
}
/*
"I have changed my items, come check them out."<br /><br /><img src='images/shop/vendor.png' width='120px' height='140px' />
*/
const vendorChangedText = 'I have changed my items, come check them out.';
// unused atm
function processVendorMessage(msg)
{
	return 'The vendor has changed his items.';
}
/*
== collection of some messages: ==
You mix 1 potions.
You mix 1 (+0) potions.
You mix 1 (+1) potions.
You have completed your group task!
x has completed his group task.
Machinery upgraded to level: 6
Your fix all your machinery
You also use your glass blowing pipe.
You do not have enough stardust
+15000 stardust.
Your upgraded rake shines as you harvest.
You dont have this seed.
New food item added.
1 artifact potions activated.
You have completed an achievement
You pour lava over your runite ore.
Your account has been running for 5 Minutes
You craft a key
You craft a gold oven
You craft a Brewing Kit
<img src='images/icons/cookingskill.png' width='50px' height='50px'/><br /><br /> You need a skilling level of 40 to bind this.
<span style='color:green;'>Item succesfully added to the market.</span>
The wizard takes your orb and extracts its energy.<br /><br /><img height='200px' width='250px' src='images/shop/wizard2.png'><br /><br /><b>'I still need more power!'</b>
The wizard takes your orb and extracts its energy.<br /><br /><img height='200px' width='250px' src='images/shop/wizard2.png'><br /><br /><b>'You may now use me to convert seeds into mega seeds!'</b>
*/
// unused atm
function processMessage(msg)
{
	if (msg.includes(explorerReturns))
	{
		return processExplorerMessage(msg);
	}
	else if (msg.includes('icons/groupTaskTokens.png'))
	{
		return processGroupMessage(msg);
	}
	else if (msg.includes('products cooked'))
	{
		return processCookingMessage(msg);
	}
	else if (msg.includes('images/misc-items/openChest.png'))
	{
		return processChestMessage(msg);
	}
	else if (msg.includes(vendorChangedText))
	{
		return processVendorMessage(msg);
	}
	return msg;
}
const autoreadMsgList = [
	'You also use your glass blowing pipe.'
	, 'New food item added.'
	, 'Your upgraded rake shines as you harvest.'
	, 'Your fix all your machinery'
	, 'Perk unlocked.'
	, 'You pour lava over your runite ore.'
	, 'You fill transform your oil into 1 container of rocket fuel.'
	, 'Item succesfully added to the market.'
	, 'products cooked'
	, 'Items purchased.'
	, 'You craft '
	, 'Your account has been running for'
	, 'You don\'t have this seed.'
	, 'You gain some mining experience.'
	, 'You do not have enough stardust'
	, 'Your robot starts his journey.'
];
function add2ActivityLog(cmd)
{
	const data = {
		type: cmd.type
		, time: (new Date()).getTime()
		// , msg: processMessage(msg)
		, msg: cmd.msg
	};

	activityLog.push(data);
	activityLog = activityLog.slice(-maxActivityLogLength);
	localStorage.setItem(activityLogKey, JSON.stringify(activityLog));
	return data;
}
const activityLogInputId = 'show-activity-log';
function updateActivity(data, triesLeft = 50)
{
	const inputEl = document.getElementById(activityLogInputId);
	const activityLogLabel = document.getElementById('activity-log-label');
	// delay this function call until the dom is fully loaded
	if (!activityLogLabel || !inputEl)
	{
		if (triesLeft > 0)
		{
			setTimeout(() => updateActivity(data, triesLeft-1), 100);
		}
		return;
	}
	const read = autoreadMsgList.some((str) => data.msg.indexOf(str) > -1);
	if (!inputEl.checked && !read)
	{
		activityLogLabel.dataset.new = parseInt(activityLogLabel.dataset.new, 10) + 1;
	}

	// add an entry for the given data to the activity list (DOM)
	const activityLogList = document.getElementById('activity-log');
	const listItem = document.createElement('li');
	listItem.dataset.time = (new Date(data.time)).toLocaleString();
	listItem.innerHTML = data.msg;
	const before = activityLogList.firstElementChild;
	if (before)
	{
		activityLogList.insertBefore(listItem, before);
	}
	else
	{
		activityLogList.appendChild(listItem);
	}
}
function initActivityLog()
{
	const gameScreen = document.getElementById('game-screen');
	const table = document.querySelector('div.top-menu > table');
	const row = table.rows[0];
	// change text to reduce used size
	const onlineCell = row.cells[row.cells.length-2];
	onlineCell.firstChild.textContent = 'Currently online: ';
	onlineCell.removeChild(onlineCell.lastChild);
	// insert activity log cell
	const cell = row.insertCell(-1);
	cell.classList.add('table-top');

	// creat input and label
	const inputEl = document.createElement('input');
	inputEl.id = activityLogInputId;
	inputEl.type = 'checkbox';
	inputEl.style.display = 'none';
	inputEl.addEventListener('change', function ()
	{
		if (inputEl.checked)
		{
			logEl.dataset.new = 0;
		}
	});
	document.body.insertBefore(inputEl, gameScreen);
	// create clickable text
	const logEl = document.createElement('label');
	logEl.id = 'activity-log-label';
	logEl.htmlFor = activityLogInputId;
	logEl.dataset.new = 0;
	logEl.textContent = 'Activity Log';
	cell.appendChild(logEl);

	// add a container for the entry listing
	const logOverlay = document.createElement('label');
	logOverlay.id = 'activity-log-overlay';
	logOverlay.htmlFor = activityLogInputId;
	document.body.appendChild(logOverlay);
	const log = document.createElement('ul');
	log.id = 'activity-log';
	document.body.appendChild(log);

	const style = document.createElement('style');
	style.innerHTML = `
#${activityLogInputId}
{
	display: none;
}
body
{
	overflow-y: scroll;
}
/*
#game-screen
{
	overflow: auto;
	position: absolute;
	bottom: 0;
	left: 0;
	top: 0;
	right: 0;
}
#${activityLogInputId}:checked + #game-screen
{
	overflow: hidden;
}
*/
#activity-log-label
{
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
#activity-log-label::after
{
	content: ' (' attr(data-new) ')';
	color: lime;
}
#activity-log-label[data-new="0"]::after
{
	color: white;
}
#activity-log-overlay
{
	background-color: transparent;
	color: transparent;
	pointer-events: none;
	position: fixed;
	bottom: 0;
	left: 0;
	top: 0;
	right: 0;
	transition: background-color .3s ease-out;
	z-index: 1000;
}
#${activityLogInputId}:checked ~ #activity-log-overlay
{
	background-color: rgba(0, 0, 0, 0.4);
	pointer-events: all;
}
#activity-log
{
	background-color: white;
	color: black;
	list-style: none;
	margin: 0;
	overflow-y: scroll;
	padding: .4rem .8rem;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	transform: translateX(100%);
	transition: transform .3s ease-out;
	min-width: 15rem;
	width: 40%;
	max-width: 30rem;
	z-index: 1000;
}
#${activityLogInputId}:checked ~ #activity-log
{
	transform: translateX(0%);
}
#activity-log::before
{
	content: 'Activity Log';
	display: block;
	font-size: 1rem;
	font-weight: bold;
	margin-bottom: 0.8rem;
}
#activity-log:empty::after
{
	content: 'Activities will be listed here.';
}
#activity-log li
{
	border: 1px solid gray;
	border-radius: .2rem;
	margin: .2rem 0;
	padding: .4rem .8rem;
}
#activity-log li::before
{
	color: gray;
	content: attr(data-time);
	display: block;
	font-size: 0.8rem;
	margin: -4px 0 4px -4px;
}
	`;
	document.head.appendChild(style);

	activityLog = JSON.parse(localStorage.getItem(activityLogKey) || JSON.stringify(activityLog));
	activityLog.forEach(d => updateActivity(d));
	logEl.dataset.new = 0;
}



/**
 * improve tabs
 */

function highlightTab(tabName)
{
	const tabKey = {
		'gatherings': 'ores'
		, 'shop': 'market'
		, 'stats': 'skills'
	}[tabName] || tabName;
	const oldTab = document.querySelector('td[id^="table-tab-"].selected');
	if (oldTab)
	{
		oldTab.classList.remove('selected');
	}
	const newTab = document.getElementById('table-tab-' + tabKey);
	if (newTab)
	{
		newTab.classList.add('selected');
	}

	const oldSubTabs = document.querySelector('#sub-tabs > .sub-tab-container.show');
	if (oldSubTabs)
	{
		oldSubTabs.classList.remove('show');
	}
	const subTabs = document.getElementById('sub-tabs-' + tabName);
	if (subTabs)
	{
		subTabs.classList.add('show');
		// tidy up old sub tabs
		const oldSubTab = document.querySelector('.sub-tab-container > .selected');
		if (oldSubTab)
		{
			oldSubTab.classList.remove('selected');
		}
		subTabs.firstElementChild.classList.add('selected');
	}
}
function highlightSubTab(tabName)
{
	const oldSubTab = document.querySelector('.sub-tab-container > .selected');
	if (oldSubTab)
	{
		oldSubTab.classList.remove('selected');
	}
	document.getElementById('table-tab-' + tabName).classList.add('selected');
}
const mainTabList = ['gatherings', 'key-items', 'repair', 'mining', 'crafting', 'farming', 'brewing', 'archaeology', 'magic', 'shop', 'stats', 'coop', 'settings'];
const subTab2MainTab = {
	'collectables': 'key-items'
	, 'ach': 'key-items'
	, 'vendor': 'key-items'
	, 'wizard': 'key-items'
	, 'dragon': 'key-items'
	, 'miningEngineer': 'repair'
	, 'ach-explore': 'archaeology'
	, 'archaeology-crafting': 'archaeology'
	, 'cooking': 'archaeology'
	, 'spellbook': 'magic'
	, 'magiccrafting': 'magic'
	, 'npc-store': 'shop'
	, 'donor-store': 'shop'
	, 'player-store': 'shop'
};
function newOpenTab(tabName)
{
	if (tabName == 'player-store')
	{
		window.marketRefreshOn = 1;
		window.send('OPEN_MARKET');
	}
	else if (window.marketRefreshOn == 1)
	{
		window.send('CLOSE_MARKET');
		window.marketRefreshOn = 0;
	}

	if (tabName == 'coop' && window.getGlobalLevel() < 100)
	{
		window.openDialogue('Global Level', 'You need a global level of at least 100 to start the CO-OP adventure!', '');
		return;
	}
	else if (tabName == 'cooking' && window.cookingUnlocked == 0)
	{
		window.openDialogue('Skill Missing', 'You must unlock the cooking skill to cook food.', '');
		return;
	}
	if (tabName == 'spellbook' && window.bindedMagicPage1 == 0 && window.bindedMagicPage2 == 0 && window.bindedMagicPage3 == 0 && window.bindedMagicPage4 == 0 && window.bindedMagicPage5 == 0)
	{
		window.openDialogue('Spellbook', 'You do not have any pages in your spellbook yet.', '');
		return;
	}

	window.hideAllTabs();

	const panelName = {
		'shop': 'store'
	}[tabName] || tabName;
	const panelEl = document.getElementById(panelName + '-tab');
	if (panelEl)
	{
		panelEl.style.display = 'block';
	}
	if (mainTabList.includes(tabName))
	{
		highlightTab(tabName);
	}
	if (subTab2MainTab.hasOwnProperty(tabName))
	{
		// highlight the main tab (if the openTab call if from notification)
		const mainTabName = subTab2MainTab[tabName];
		highlightTab(mainTabName);
		highlightSubTab(tabName);
		hideNotificationsFromTab(mainTabName);
	}
	hideNotificationsFromTab(tabName);

	if (tabName == 'itemStats')
	{
		window.loadAllStats();
	}
	else if (tabName == 'archaeology' && mapOfTheSea > 0)
	{
		document.getElementById('hasMapOfTheSea-fishermen').style.display = '';
	}
	else if (tabName == 'mining' && enchantedPickaxeStarDust > 0)
	{
		document.getElementById('charge-pickaxe-box').style.display = '';
	}
	else if (tabName == 'crafting' && enchantedHammerStarDust > 0)
	{
		document.getElementById('uncharge-hammer-box').style.display = '';
	}
	else if (tabName == 'collectables')
	{
		window.loadCollectables();
	}
	else if (tabName == 'vendor')
	{
		if (vendorChangedFlag > 0)
		{
			window.send('RESET_VENDOR_CHANGED_FLAG');
		}

		if (window.getLevel(craftingXp) >= 100 ||
			window.getLevel(miningXp) >= 100 ||
			window.getLevel(merchantingXp) >= 100 ||
			window.getLevel(exploringXp) >= 100 ||
			window.getLevel(brewingXp) >= 100 ||
			window.getLevel(magicXp) >= 100)
		{
			if (window.dragonOrb == 0)
			{
				document.getElementById('vendor-item-box-quest').style.display = 'block';
				window.openDialogue('Vendor', '<center><img src="images/shop/vendor.png" width="100px" height="200px" /><br /><br /> "I have something very special for you."</center>', '');
			}
		}
	}
	else if (tabName == 'repair')
	{
		window.refreshRepairTab();
	}
	else if (tabName == 'dragon')
	{
		if (window.dragonOrb == 0)
		{
			document.getElementById('dragon-tab').style.display = 'block';
			return;
		}
		window.loadDragonTab();
	}
}
function applyNewTabStyle()
{
	const style = document.createElement('style');
	style.innerHTML = `
#tab-tr > td,
.sub-tab-container > span
{
	background: -webkit-linear-gradient(black, grey);
	background: -o-linear-gradient(black, grey);
	background: -moz-linear-gradient(black, grey);
	background: linear-gradient(black, grey);
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
#tab-tr > td:hover,
.sub-tab-container > span:hover
{
	background: -webkit-linear-gradient(red, grey);
	background: -o-linear-gradient(red, grey);
	background: -moz-linear-gradient(red, grey);
	background: linear-gradient(red, grey);
}
#tab-tr > td.selected,
.sub-tab-container > span.selected,
#table-tab-ach.selected
{
	background: -webkit-linear-gradient(#800000, #390000);
	background: -o-linear-gradient(#800000, #390000);
	background: -moz-linear-gradient(#800000, #390000);
	background: linear-gradient(#800000, #390000);
}
#sub-tabs
{
	font-size: 10pt;
	height: 43px;
}
body.hide-sub-tabs #sub-tabs
{
	display: none;
}
.sub-tab-container
{
	display: none;
}
.sub-tab-container.show
{
	display: inline-block;
}
.sub-tab-container > span,
#table-tab-ach
{
	border: 0 solid #aaa;
	border-right-width: 1px;
	color: white;
	cursor: pointer;
	display: inline-block;
	line-height: 27px;
	padding: 8px 10px;
}
.sub-tab-container > span:first-child
{
	border-left-width: 1px;
}
.sub-tab-container > span:not(:first-child)::before
{
	background-repeat: no-repeat;
	background-size: 25px 25px;
	content: '';
	display: inline-block;
	margin-right: .4rem;
	height: 25px;
	width: 25px;
	vertical-align: middle;
}
#sub-tabs.hide-tab-text .sub-tab-container > span:not(:first-child)::before
{
	margin-right: 0;
}
.sub-tab-container > span::after
{
	content: attr(data-tab-text);
}
#sub-tabs.hide-tab-text .sub-tab-container > span:not(:first-child)::after
{
	display: none;
}
#sub-tabs-shop > span:not(:first-child)::before
{
	display: none;
}
#table-tab-collectables::before
{
	background-image: url('images/icons/collectables.png');
	background-size: 32px 25px;
	width: 32px;
}
#table-tab-ach::before
{
	background-image: url('images/shop/ach.png');
}
#table-tab-vendor::before
{
	background-image: url('images/shop/vendor.png');
}
#table-tab-wizard::before
{
	background-image: url('images/shop/superWizard.png');
	background-size: 13px 25px;
	width: 13px;
}
#table-tab-dragon::before
{
	background-image: url('images/crafting/dragonOrb.png');
}
#table-tab-miningEngineer::before
{
	background-image: url('images/shop/miningEngineer.png');
	background-size: 19px 25px;
	width: 19px;
}
#table-tab-ach-explore::before
{
	background-image: url('images/exploring/equipement/silverBody.png');
}
#table-tab-archaeology-crafting::before,
#table-tab-magiccrafting::before
{
	background-image: url('images/icons/anvil.png');
	background-size: 28px 25px;
	width: 28px;
}
#table-tab-cooking::before
{
	background-image: url('images/icons/cookingskill_baw.png');
	background-size: 17px 25px;
	width: 17px;
}
#table-tab-spellbook::before
{
	background-image: url('images/magic/magicBook.png');
	background-size: 32px 25px;
	width: 32px;
}
#sub-tabs.hide-tab-text .sub-tab-container > span#table-tab-npc-store::after,
#sub-tabs.hide-tab-text .sub-tab-container > span#table-tab-donor-store::after,
#sub-tabs.hide-tab-text .sub-tab-container > span#table-tab-player-store::after
{
	display: initial;
}
	`;
	document.head.appendChild(style);

	const subTabContainer = document.createElement('div');
	subTabContainer.id = 'sub-tabs';

	// add all sub-tabs
	function addSubContainer(parentKey, content)
	{
		const subContainer = document.createElement('div');
		subContainer.className = 'sub-tab-container';
		subContainer.id = 'sub-tabs-' + parentKey;
		subContainer.innerHTML = '<span>Overview</span>' + content;
		subTabContainer.appendChild(subContainer);
	}
	addSubContainer(
		'key-items'
		, `<span id="table-tab-collectables" data-tab-text="Collectables"></span>`
		+ `<span id="table-tab-ach" data-tab-text="Achievements"></span>`
		+ `<span id="table-tab-vendor" data-tab-text="Vendor"></span>`
		+ `<span id="table-tab-wizard" data-tab-text="Wizard"></span>`
		+ `<span id="table-tab-dragon" data-tab-text="Dragon's Lair"></span>`
	);
	addSubContainer(
		'repair'
		, `<span id="table-tab-miningEngineer" data-tab-text="Mining Engineer"></span>`
	);
	addSubContainer(
		'archaeology'
		, `<span id="table-tab-ach-explore" data-tab-text="Equipment"></span>`
		+ `<span id="table-tab-archaeology-crafting" data-tab-text="Craft"></span>`
		+ `<span id="table-tab-cooking" data-tab-text="Cooking"></span>`
	);
	addSubContainer(
		'magic'
		, `<span id="table-tab-spellbook" data-tab-text="Cast Spell"></span>`
		+ `<span id="table-tab-magiccrafting" data-tab-text="Craft"></span>`
	);
	addSubContainer(
		'shop'
		, `<span id="table-tab-npc-store" data-tab-text="Game Shop"></span>`
		+ `<span id="table-tab-donor-store" data-tab-text="Donor Shop"></span>`
		+ `<span id="table-tab-player-store" data-tab-text="Player Market"></span>`
	);

	subTabContainer.addEventListener('click', (event) =>
	{
		const target = event.target;
		const parent = target.parentNode;
		if (parent.classList.contains('sub-tab-container'))
		{
			const newTabName = (target.id ? target : parent).id
				.replace('table-tab-', '')
				.replace('sub-tabs-', '')
			;
			if (newTabName != '')
			{
				window.openTab(newTabName);
			}
		}
	});
	document.getElementById('tab-container').appendChild(subTabContainer);
	function handleTabTextVisibility()
	{
		const isOn = window.tabTextOff > 0;
		subTabContainer.classList[isOn ? 'add' : 'remove']('hide-tab-text');
	}
	handleTabTextVisibility();
	observe('tabTextOff', () => handleTabTextVisibility());

	// fix on click handler
	const craftExploringBtn = document.querySelector('[onclick^="switchToCraftingExploringTab"]');
	craftExploringBtn.setAttribute('onclick', "openTab('archaeology-crafting')");
}
function checkSubTab(tabKey, windowKeys, init)
{
	const fulfilled = windowKeys.some(key => window[key] > 0);
	document.getElementById('table-tab-' + tabKey).style.display = fulfilled ? '' : 'none';

	if (init)
	{
		for (let key of windowKeys)
		{
			observe(key, () => checkSubTab(tabKey, windowKeys, false));
		}
	}
}
function improveTabs()
{
	applyNewTabStyle();
	window.openTab = newOpenTab;
	newOpenTab('gatherings');

	// observe some values to show sub tabs as soon as they are accessible
	checkSubTab('ach', ['achShop'], true);
	checkSubTab('vendor', ['hasVendor'], true);
	checkSubTab('wizard', ['wizard'], true);
	checkSubTab('dragon', ['dragonOrb'], true);
	checkSubTab('miningEngineer', ['miningEngineer'], true);
	checkSubTab('cooking', ['cookingUnlocked'], true);
	checkSubTab('spellbook', [
		'bindedMagicPage1'
		, 'bindedMagicPage2'
		, 'bindedMagicPage3'
		, 'bindedMagicPage4'
		, 'bindedMagicPage5'
		, 'bindedMagicPage6'
	], true);

	function setVisibilityOfSubTabs()
	{
		const hide = !getSetting('addSubTabs');
		document.body.classList[hide ? 'add' : 'remove']('hide-sub-tabs');
	}
	setVisibilityOfSubTabs();
	observeSetting('addSubTabs', () => setVisibilityOfSubTabs());
}



/**
 * improve exploring dialog
 */

function improveExploringDialog()
{
	const style = document.createElement('style');
	style.innerHTML = `
div#dialog-explore-areas tr > td:nth-child(2) img
{
	height: 38px;
	width: 63px;
}
	`;
	document.head.appendChild(style);

	const table = document.querySelector('#dialog-explore-areas table.table-stats');
	const rows = table.rows;
	for (let i = 0; i < rows.length; i++)
	{
		const row = rows[i];
		if (i == 0)
		{
			const refCell = row.cells[2];

			const levelTh = document.createElement('th');
			levelTh.innerHTML = 'Level';
			row.insertBefore(levelTh, refCell);

			const energyTh = document.createElement('th');
			energyTh.innerHTML = 'Energy/XP Cost';
			row.insertBefore(energyTh, refCell);

			refCell.textContent = 'Lair';
		}
		else
		{
			const reqCell = row.cells[2];
			const levelCell = row.insertCell(2);
			const img = reqCell.firstElementChild;
			const levelChild = img.nextSibling;
			const level = parseInt(levelChild.textContent.replace(/\D*(?=\d)/, ''), 10);
			const xpMatch = levelChild.textContent.match(/\((.+) XP\)/);
			levelCell.textContent = formatNumber(level);
			reqCell.removeChild(img);
			reqCell.removeChild(levelChild);
			if (levelChild.textContent.trim() == '')
			{
				reqCell.removeChild(levelChild.nextElementSibling);
			}

			const energyCell = row.insertCell(3);
			const energyText = reqCell.lastChild.textContent.replace(/\D*(?=\d)/, '');
			const energy = parseInt(energyText, 10) * (/\d\s*M(\W|$)/.test(energyText) ? 1e6 : 1);
			const energyFactor = 1 - parseInt(window.exploringEnergyReductionPerc, 10) / 100;
			energyCell.textContent = formatNumber(Math.floor(energyFactor * energy));
			if (xpMatch)
			{
				const xp = parseInt(xpMatch[1], 10) * (/\d\s*M(\W|$)/.test(xpMatch[1]) ? 1e6 : 1);
				energyCell.innerHTML += '<br>' + formatNumber(xp) + ' XP';
			}
			reqCell.removeChild(reqCell.lastChild);

			if (reqCell.textContent.indexOf('Access to lair') != -1)
			{
				const br = reqCell.lastElementChild;
				const lairText = br.previousSibling;
				reqCell.removeChild(br);
				reqCell.removeChild(lairText);
			}

			const timeCell = row.cells[row.cells.length-1];
			const timeMatch = timeCell.textContent.match(/(\d+)(?::(\d+))?\s*(min|h)\./);
			if (timeMatch)
			{
				const num1 = parseInt(timeMatch[1], 10);
				const num2 = parseInt(timeMatch[2] || '0', 10);
				const factor = {
					'min': 60
					, 'h': 3600
				}[timeMatch[3]] || 1;
				const timeFactor = 1 - parseInt(window.exploringTimeReductionPerc, 10) / 100;
				const totalSeconds = Math.floor((num1 * factor + num2 * (factor / 60)) * timeFactor);
				const hours = Math.floor(totalSeconds / 3600);
				const minutes = Math.floor(totalSeconds / 60) % 60;
				const seconds = totalSeconds % 60;
				timeCell.textContent = (hours < 10 ? '0' : '') + hours
					+ ':' + (minutes < 10 ? '0' : '') + minutes
					+ ':' + (seconds < 10 ? '0' : '') + seconds
				;
			}
		}
	}
}



/**
 * fix DH1 links
 */

function fixDH1Links()
{
	const links = document.querySelectorAll('a[href]');
	for (let i = 0; i < links.length; i++)
	{
		const link = links[i];
		if (/^https?:\/\/(?:www\.)?diamondhunt\.co\/(?!DH1\/)/.test(link.href))
		{
			link.href = link.href.replace(/(diamondhunt\.co\/)/, '$1DH1/');
		}
	}
}



/**
 * init
 */

function init()
{
	console.info('[%s] "DH1 Fixed" up and running!', (new Date).toLocaleTimeString());

	initObservable();
	initSettings();
	initActivityLog();
	initNotifications();

	fixKeyItems();
	fixFarming();
	fixServerMsg();
	applyNewItemStyle();
	applyNewKeyItemStyle();

	expandEquipment();
	highlightRequirements();
	fixMarket();
	improveLevelCalculation();
	fixInventory();
	fixMachinery();
	fixBrewing();
	fixTabs();
	hideCraftingRecipes();
	hideEquipment();
	improveDialogBtns();
	hideMaxRecipes();
	fixMagic();
	fixNumberFormat();
	fixLevelBar();
	fixMsgBox();
	fixChat();
	addCoopNotificationBox();
	fixCrafting();
	improveTabs();
	improveExploringDialog();

	fixDH1Links();
}
class Command
{
	static isMsg(type)
	{
		return type === 'QUESTION' || type === 'MESSAGE' || type === 'MSG_BOX';
	}

	constructor(cmd)
	{
		this.type = cmd.replace(/=.+$/, '');
		const restCmd = cmd.substr(this.type.length + 1);
		this.params = restCmd.split('~');
		this.isMsg = Command.isMsg(this.type);
		this._msg = '';
		if (this.isMsg)
		{
			this.msg = formatNumbersInText(this.params[0].trim());
		}
	}

	get msg()
	{
		return this._msg;
	}
	set msg(newMsg)
	{
		this.params[0] = this._msg = newMsg;
	}

	prepare()
	{
		if (!this.isMsg)
		{
			return;
		}
		if (this.msg === 'You dont have this seed.')
		{
			this.type = 'MSG_BOX';
			this.msg = `You don't have this seed.`;
		}
		else if (/Your account has been running for/.test(this.msg))
		{
			/*
Your account has been running for 234 Minutes
=> convert minutes into better readable format (hours and minutes)
			*/
			this.msg = this.msg.replace(/(\d+) Minutes/, (str, min) =>
			{
				min = parseInt(min, 10);
				const hours = Math.floor(min / 60);
				min = min % 60;
				return (hours > 0 ? hours + ' hour' + (hours == 1 ? '' : 's') + ' and ' : '')
					+ min + ' minute' + (min == 1 ? '' : 's');
			});
		}
		else
		{
			this.msg = this.msg.replace(
				`<img class='small-img' src='images/brewing/pic_coin.png'>`
				, `<img class='small-img' src='images/pic_coin_bigstack.png'>`
			);
		}
	}
	toString()
	{
		return this.type + '=' + this.params.join('~');
	}
}
document.addEventListener('DOMContentLoaded', () =>
{
	const oldLoadCommand = window.loadCommand;
	window.loadCommand = (cmdString) =>
	{
		const cmd = new Command(cmdString);
		if (!fullyLoaded && cmd.type == 'ITEMS_DATA')
		{
			const ret = oldLoadCommand(cmdString);
			fullyLoaded = true;
			init();
			return ret;
		}

		cmd.prepare();
		// add message to activity log
		if (cmd.isMsg)
		{
			const data = add2ActivityLog(cmd);
			updateActivity(data);
		}
		if (cmd.msg === 'You have completed an achievement')
		{
			notifyMsg(cmd.msg)
				.catch(() => oldLoadCommand(cmd.toString()))
			;
			return;
		}
		else if (cmd.type === 'MESSAGE')
		{
			notifyMsg(cmd.msg)
				.catch(() => oldLoadCommand(cmd.toString()))
			;
			return;
		}
		return oldLoadCommand(cmd.toString());
	};
});



/**
 * fix annoying errors in console caused by web socket events when DOM still loading
 */

function addMessageListenerFix()
{
	const newScript = document.createElement('script');
	newScript.textContent = `
if (window.webSocket != null)
{
	const messageQueue = [];
	const oldOnMessage = webSocket.onmessage;
 	webSocket.onmessage = (event) => messageQueue.push(event);
	document.addEventListener('DOMContentLoaded', () =>
	{
		messageQueue.forEach(event => onMessage(event));
		webSocket.onmessage = oldOnMessage;
	});
}
	`;
	document.head.appendChild(newScript);
}
function isWebSocketScript(script)
{
	return script.textContent.includes('webSocket.onmessage');
}
function fixWebSocketScript()
{
	if (!document.head)
	{
		return;
	}

	const scripts = document.head.querySelectorAll('script');
	let found = false;
	for (let i = 0; i < scripts.length; i++)
	{
		if (isWebSocketScript(scripts[i]))
		{
			addMessageListenerFix();
			return;
		}
	}

	// create an observer instance
	const mutationObserver = new MutationObserver((mutationList) =>
	{
		mutationList.forEach((mutation) =>
		{
			if (mutation.addedNodes.length === 0)
			{
				return;
			}

			for (let i = 0; i < mutation.addedNodes.length; i++)
			{
				const node = mutation.addedNodes[i];
				if (node.tagName == 'SCRIPT' && isWebSocketScript(node))
				{
					mutationObserver.disconnect();
					setTimeout(() => addMessageListenerFix());
					return;
				}
			}
		});
	});
	mutationObserver.observe(document.head, {
		childList: true
	});
}
fixWebSocketScript();

})();
