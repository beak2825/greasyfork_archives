// ==UserScript==
// @name           HV Utils
// @namespace      HVUT
// @version        2.7.1
// @date           2019-09-14
// @description    este
// @author         sssss2
// @include        https://hentaiverse.org/*
// @include        http://hentaiverse.org/*
// @include        http://alt.hentaiverse.org/*
// @include        https://e-hentai.org/*
// @connect        e-hentai.org
// @exclude        https://hentaiverse.org/?s=Battle
// @exclude        http://hentaiverse.org/?s=Battle
// @exclude        http://alt.hentaiverse.org/?s=Battle
// @exclude        https://hentaiverse.org/equip/*
// @exclude        http://hentaiverse.org/equip/*
// @exclude        http://alt.hentaiverse.org/equip/*
// @exclude        https://hentaiverse.org/pages/showequip*
// @exclude        http://hentaiverse.org/pages/showequip*
// @exclude        http://alt.hentaiverse.org/pages/showequip*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_setClipboard
// @grant          unsafeWindow
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/390818/HV%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/390818/HV%20Utils.meta.js
// ==/UserScript==

var settings = {

// [GLOBAL]
max_conn : 3, // limit the maximum number of connections; set to 1 or 2 if you see the "state lock limiter in effect" message

randomEncounter : true, // Random Encounter Notification
reGallery : true, // use it on the gallery
reGalleryAlt : false, // open RE links to alt.hentaiverse.org on the gallery
reBeep : {volume:0.2, frequency:500, time:0.5, delay:1}, // beep when a RE is ready; set volume to 0 to disable
//reBeepTest : setTimeout(()=>play_beep(settings.reBeep),100), // you can test the beep by removing slashes in front of this line

topMenuAlign : "left", // "left", "center", "right" (set to "flex-end" in Google Chrome), or "space-between", "space-around", "space-evenly"
topMenuIntegrate : true, // integrate menus into one button
topMenuLinks : ["Character", "Equipment", "Item Inventory", "Equip Inventory", "Equipment Shop", "Item Shop", "Monster Lab", "The Shrine", "MoogleMail", "The Arena", "Ring of Blood", "GrindFest", "Item World"],
topMenuWriteMM : false,
confirmStaminaRestorative : true,

showCredits : false, // show your credits balance on all pages
showEquipSlots : 1, // show Equip Inventory Slots; 0:disable, 1:battle pages only, 2:always
showLottery : true, // show weapon and armor that are currently in the lottery

equipSort : true, // sort equipment list, order by category
equipColor : true, // set background colors for equipment; Default colors: peerless red, legendary orange, magnificent blue, exquisite green

equipmentKeyFunctions : true, // support some keyboard actions when mouse over the equipment
                              // "V": open equipment links in a new tab, instead of in a popup
                              // "L": show link code [url=...]...[/url]
                              // "K": copy link code into the clipboard


// [CHARACTER]
character : true,
	characterExpCalculator : true, // Level/Exp/Proficiency Calculator
	characterExpandStatsByDefault : false,
equipment : true,
	equipmentStatsAnalyzer : true, // calculate magic score, proficiency, resist chance of monsters and expected damage
abilities : true, // show current and maximum level of every ability, and set ability to the required level in one click
training : true, // calculate costs
	trainingTimer : true, // plan training to a preset level and start training automatically
itemInventory : true, // WTS forum code generator
	itemInventoryCrystalExchange : true, // show Crystal Exchange Button
equipInventory : true, // WTS forum code generator
	equipInventoryIntegration : true, // integrate all equip types on the default inventory page
	equipInventoryPrice : true, // show price input boxes
	equipInventoryNote : true, // show note input boxes
	equipCode : "[{$_eid}] [url={$url}]{$bbcode}[/url] ({$level}){$price: @ $price}{$note: ($note)}",
	// {$bbcode} {$url} {$price} {$note}
	// {$name} {$level} {$tier} {$eid} {$_eid} {$key}
settings : true,

// [BAZAAR]
equipmentShop : true, // sell and salvage equipment at once
	equipmentShopIntegration : true, // integrate all equip types on the default shop page
	equipmentShopAutoLock : true, // automatically lock equipment
	equipmentShopConfirm : 1, // 0:no, 1:confirm 'unwise' actions (e.g. selling mag cotton or salvaging shade), 2:confirm all actions
	equipmentShopProtect : [ // prevent YOUR valuable equipment from being selected by "Select All" button
		"Peerless",
		"Legendary",
		"Magnificent && Rapier && Slaughter",
		"Magnificent && (Force Shield || Buckler && Barrier)",
		"Magnificent && Fiery && Redwood && (Destruction || Elementalist || Surtr)",
		"Magnificent && Arctic && Redwood && (Destruction || Elementalist || Niflheim)",
		"Magnificent && Shocking && (Willow || Redwood) && (Destruction || Elementalist || Mjolnir)",
		"Magnificent && Tempestuous && (Willow || Redwood) && (Destruction || Elementalist || Freyr)",
		"Magnificent && Hallowed && (Oak || Katalox) && (Destruction || Heaven-sent || Heimdall)",
		"Magnificent && Demonic && (Willow || Katalox) && (Destruction || Demon-fiend || Fenrir)",
		"Magnificent && (Radiant || Charged) && Phase",
		"Magnificent && Charged && (Elementalist || Heaven-sent || Demon-fiend)",
		"Magnificent && (Savage || Agile) && Shadowdancer",
		"Magnificent && Power && Slaughter",
	],
	equipmentShopBazaar : [ // check valuable equipment in BAZZAR, then hide all other trash
		"Peerless",
		"Legendary",
		"Magnificent && Rapier && Slaughter",
		"Magnificent && (Force Shield || Buckler && Barrier)",
		"Magnificent && Fiery && Redwood && (Destruction || Elementalist || Surtr)",
		"Magnificent && Arctic && Redwood && (Destruction || Elementalist || Niflheim)",
		"Magnificent && Shocking && (Willow || Redwood) && (Destruction || Elementalist || Mjolnir)",
		"Magnificent && Tempestuous && (Willow || Redwood) && (Destruction || Elementalist || Freyr)",
		"Magnificent && Hallowed && (Oak || Katalox) && (Destruction || Heaven-sent || Heimdall)",
		"Magnificent && Demonic && (Willow || Katalox) && (Destruction || Demon-fiend || Fenrir)",
		"Magnificent && (Radiant || Charged) && Phase",
		"Magnificent && Charged && (Elementalist || Heaven-sent || Demon-fiend)",
		"Magnificent && (Savage || Agile) && Shadowdancer",
		"Magnificent && Power && Slaughter",
		// "(Magnificent||Exquisite) && (Rapier||Shortsword||Wakizashi) && (Eth||Fie||Arc||Shoc||Tem||Hal||Dem)", // 1H weapons for low level players
		// "(Magnificent||Exquisite) && (Force Shield || Buckler&&Barrier || Kite Shield)", // shields for low level players
		// "Magnificent && Power", // heavy armors for low level players
		// "Exquisite && Power && Slaughter",
		// "Magnificent && Plate && !Breast",
	],

itemShop : true,
	itemShopHideInventory : ["Energy Drink", "Caffeinated Candy", "Infusion of", "Scroll of", "Flower Vase", "Bubble-Gum", "Precursor Artifact", "ManBearPig Tail", "Holy Hand Grenade of Antioch", "Mithra's Flower", "Dalek Voicebox", "Lock of Blue Hair", "Bunny-Girl Costume", "Hinamatsuri Doll", "Broken Glasses", "Black T-Shirt", "Sapling", "Unicorn Horn", "Noodly Appendage", "Soul Fragment", "Crystal of", "Monster Chow", "Monster Edibles", "Monster Cuisine", "Happy Pills", "-Grade", "Crystallized Phazon", "Shade Fragment", "Repurposed Actuator", "Defense Matrix Modulator", "Binding of", "Shard", "Figurine"],
	// hide items, Inventory side
	itemShopHideStore : ["Crystal of", "Monster Chow", "Monster Edibles", "Monster Cuisine", "Happy Pills", "-Grade", "Shard"],
	// hide items, Store side

itemShopBot : true, // show all current Item Shop Bot bids
monsterLab : true, // record gifts, and feed crystals or chaos tokens to monsters
	monsterLabMorale : 12000, // morale threshold (max 24000)
	monsterLabHunger : 18000, // hunger threshold (max 24000)
shrine : true, // record rewards
	shrineHideItems : ["Figurine", "Coupon"],
	shrineTrackEquip : {"Peerless":true, "Legendary":true, "Magnificent":true, "Exquisite":false, "Superior":false, "Average":false}, // track high quality equipment only
moogleMail : true, // Advanced MoogleMail-Sender and MoogleMail-Box
	moogleMailSender : true,
	moogleMailBox : true,
	moogleMailCouponClipper : false, // if the subject of MoogleMail contains "Coupon Clipper" or "Item Shop", take credits, buy requested items, then send them back.
	moogleMailDarkDescent : false, // if the subject of MoogleMail contains "Dark Descent" or "reforge", take equipment, reforge, then send it back.
	moogleMailTemplate : {
		//"WTS": {"to":"", "subject":"", "body":""},
		//"WTB": {"to":"", "subject":"", "body":""},
		//"Free": {"to":"", "subject":"Free Potions", "body":"500 x Health Draught\n500 x Mana Draught\n200 x Spirit Draught\n100 x Health Potion\n100 x Mana Potion\n50 x Spirit Potion", attach:true},
	},

lottery : true,
	lotteryCheck : [
		"Rapier && Slaughter",
		"(Ethereal || Hallowed || Demonic) && (Rapier || Wakizashi) && (Balance || Nimble)",
		"Ethereal && (Axe || Club || Estoc || Katana || Longsword || Mace) && Slaughter",
		"Force Shield || Buckler && Barrier",
		"Fiery && Redwood && (Destruction || Elementalist || Surtr)",
		"Arctic && Redwood && (Destruction || Elementalist || Niflheim)",
		"Shocking && (Willow || Redwood) && (Destruction || Elementalist || Mjolnir)",
		"Tempestuous && (Willow || Redwood) && (Destruction || Elementalist || Freyr)",
		"Hallowed && (Oak || Katalox) && (Destruction || Heaven-sent || Heimdall)",
		"Demonic && (Willow || Katalox) && (Destruction || Demon-fiend || Fenrir)",
		"(Radiant || Charged) && Phase",
		"Charged && (Elementalist || Heaven-sent || Demon-fiend)",
		"(Savage || Agile) && (Shadowdancer || Fleet)",
		"Power && Slaughter",
	],

// [BATTLE]
equipEnchant : true, // Equipment Enchant and Repair Pane
	equipEnchantLeftUI : false, // move pane to the left side
	equipEnchantCloseByDefault : false, // close (minimize) the pane by default
	equipEnchantWeapon : 4, // number of enchantments for your weapon
	equipEnchantArmor : 3, // number of enchantments for armors
	equipEnchantRepairThreshold : 55, // if the value is between 0 and 1, it means the condition % of the equipment (e.g., 0.6 = 60%). else if the value is larger than 1, it means a margin to 50% condition. in this case, the recommended value for grindfest is 55.
	equipEnchantInventory : [100, "Health Draught","Mana Draught","Spirit Draught", "Health Potion", "Mana Potion", "Spirit Potion"],

arena : true, // integrate page 1 and 2
itemWorld : true, // calculate pxp gain and potency level

// [FORGE]
upgrade : true, // calculate materials and costs
salvage : true, // warn before salvaging an equipment


// [Item BBCode Generator]
itemCodeTemplate :
`
// set BBCode = {$zero:[color=transparent]$zero[/color]}{$count} x {$name} @ {$price}
// set unpricedCode = {$zero:[color=transparent]$zero[/color]}{$count} x {$name}
// set unpricedCode = 0
// set stockoutCode = [color=#ccc][s]{$zero}{$count} x {$name}{$price: @ $price}[/s][/color]
// set padCountWithZero = 0
// set keepStock = 0

[size=3][color=#00B000][Consumables][/color][/size]

{Health Draught}
{Mana Draught}
{Spirit Draught}

{Health Potion}
{Mana Potion}
{Spirit Potion}

{Health Elixir}
{Mana Elixir}
{Spirit Elixir}
{Last Elixir}

{Energy Drink}
{Flower Vase}
{Bubble-Gum}

{Infusion of Flames}
{Infusion of Frost}
{Infusion of Lightning}
{Infusion of Storms}
{Infusion of Divinity}
{Infusion of Darkness}

{Scroll of Swiftness}
{Scroll of Protection}
{Scroll of the Avatar}
{Scroll of Absorption}
{Scroll of Shadows}
{Scroll of Life}
{Scroll of the Gods}


[size=3][color=#BA05B4][Crystals][/color][/size]

{Crystal Pack}

// set keepStock = min( Crystal of Vigor, Crystal of Finesse, Crystal of Swiftness, Crystal of Fortitude, Crystal of Cunning, Crystal of Knowledge )
{Crystal of Vigor}
{Crystal of Finesse}
{Crystal of Swiftness}
{Crystal of Fortitude}
{Crystal of Cunning}
{Crystal of Knowledge}

// set keepStock = min( Crystal of Flames, Crystal of Frost, Crystal of Lightning, Crystal of Tempest, Crystal of Devotion, Crystal of Corruption )
{Crystal of Flames}
{Crystal of Frost}
{Crystal of Lightning}
{Crystal of Tempest}
{Crystal of Devotion}
{Crystal of Corruption}
// set keepStock = 0


[size=3][color=#489EFF][Monster Foods][/color][/size]

{Monster Chow}
{Monster Edibles}
{Monster Cuisine}
{Happy Pills}


[size=3][color=#f00][Shards][/color][/size]

{Voidseeker Shard}
{Aether Shard}
{Featherweight Shard}
{Amnesia Shard}


// set padCountWithZero = 4
[size=3][color=#f00][Materials][/color][/size]

{Scrap Cloth}
{Scrap Leather}
{Scrap Metal}
{Scrap Wood}

{Low-Grade Cloth}
{Mid-Grade Cloth}
{High-Grade Cloth}

{Low-Grade Leather}
{Mid-Grade Leather}
{High-Grade Leather}

{Low-Grade Metals}
{Mid-Grade Metals}
{High-Grade Metals}

{Low-Grade Wood}
{Mid-Grade Wood}
{High-Grade Wood}

// set padCountWithZero = 3
{Crystallized Phazon}
{Shade Fragment}
{Repurposed Actuator}
{Defense Matrix Modulator}


// set padCountWithZero = 3
[size=3][color=#f00][Bindings][/color][/size]

{Binding of Slaughter}
{Binding of Balance}
{Binding of Isaac}
{Binding of Destruction}
{Binding of Focus}
{Binding of Friendship}

{Binding of Protection}
{Binding of Warding}
{Binding of the Fleet}
{Binding of the Barrier}
{Binding of the Nimble}
{Binding of Negation}

{Binding of the Ox}
{Binding of the Raccoon}
{Binding of the Cheetah}
{Binding of the Turtle}
{Binding of the Fox}
{Binding of the Owl}

{Binding of the Elementalist}
{Binding of the Heaven-sent}
{Binding of the Demon-fiend}
{Binding of the Curse-weaver}
{Binding of the Earth-walker}

{Binding of Surtr}
{Binding of Niflheim}
{Binding of Mjolnir}
{Binding of Freyr}
{Binding of Heimdall}
{Binding of Fenrir}

{Binding of Dampening}
{Binding of Stoneskin}
{Binding of Deflection}

{Binding of the Fire-eater}
{Binding of the Frost-born}
{Binding of the Thunder-child}
{Binding of the Wind-waker}
{Binding of the Thrice-blessed}
{Binding of the Spirit-ward}


// set padCountWithZero = 2
// set keepStock = 1
[size=3][color=#0000FF][Figurines][/color][/size]

{Twilight Sparkle Figurine}
{Rainbow Dash Figurine}
{Applejack Figurine}
{Fluttershy Figurine}
{Pinkie Pie Figurine}
{Rarity Figurine}
{Trixie Figurine}
{Princess Celestia Figurine}
{Princess Luna Figurine}
{Apple Bloom Figurine}
{Scootaloo Figurine}
{Sweetie Belle Figurine}
{Big Macintosh Figurine}
{Spitfire Figurine}
{Derpy Hooves Figurine}
{Lyra Heartstrings Figurine}
{Octavia Figurine}
{Zecora Figurine}
{Cheerilee Figurine}
{Vinyl Scratch Figurine}
{Daring Do Figurine}
{Doctor Whooves Figurine}
{Berry Punch Figurine}
{Bon-Bon Figurine}
{Fluffle Puff Figurine}
{Angel Bunny Figurine}
{Gummy Figurine}

// set padCountWithZero = 0
// set keepStock = 0
`,


// [ITEM PRICE], are used in Equipment Shop, Item Shop, Moogle Mail and Upgrade
itemPrice : {

	"WTS" : { // WTS price
		"Health Draught": 23,
		"Mana Draught": 45,
		"Spirit Draught": 450,

		"Health Potion": 45,
		"Mana Potion": 90,
		"Spirit Potion": 900,

		"Health Elixir": 45,
		"Mana Elixir": 90,
		"Spirit Elixir": 900,

		"Crystal Pack": 20000,
	},

	"WTB" : { // MoogleMail CoD calculation
		"Health Potion": 45,
		"Mana Potion": 90,
		"Spirit Potion": 90,

		"Scrap Cloth": 90,
		"Scrap Leather": 90,
		"Scrap Metal": 90,
		"Scrap Wood": 90,
		"Energy Cell": 180,

		"Energy Drink": 82500,
		"Precursor Artifact": 18000,

		"ManBearPig Tail": 700,
		"Holy Hand Grenade of Antioch": 700,
		"Mithra's Flower": 700,
		"Dalek Voicebox": 700,
		"Lock of Blue Hair": 1050,
		"Bunny-Girl Costume": 1300,
		"Hinamatsuri Doll": 1300,
		"Broken Glasses": 1300,
		"Black T-Shirt": 6000,
		"Sapling": 6000,
		"Unicorn Horn": 8000,
	},

	"Salvage" : { // Equipment Shop calculation
		"Scrap Cloth": 90,
		"Scrap Leather": 0,
		"Scrap Metal": 90,
		"Scrap Wood": 90,
		"Energy Cell": 180,

		"Low-Grade Cloth": 50,
		"Mid-Grade Cloth": 300,
		"High-Grade Cloth": 12000,

		"Low-Grade Leather": 50,
		"Mid-Grade Leather": 100,
		"High-Grade Leather": 200,

		"Low-Grade Metals": 50,
		"Mid-Grade Metals": 200,
		"High-Grade Metals": 500,

		"Low-Grade Wood": 50,
		"Mid-Grade Wood": 300,
		"High-Grade Wood": 4000,
	},

	"Upgrade" : { // Upgrade cost calculation
		"Wispy Catalyst": 90,
		"Diluted Catalyst": 450,
		"Regular Catalyst": 900,
		"Robust Catalyst": 2250,
		"Vibrant Catalyst": 4500,
		"Coruscating Catalyst": 9000,

		"Crystallized Phazon": 190000,
		"Shade Fragment": 5000,
		"Repurposed Actuator": 60000,
		"Defense Matrix Modulator": 5000,

		"Low-Grade Cloth": 50,
		"Mid-Grade Cloth": 300,
		"High-Grade Cloth": 12000,

		"Low-Grade Leather": 50,
		"Mid-Grade Leather": 100,
		"High-Grade Leather": 200,

		"Low-Grade Metals": 50,
		"Mid-Grade Metals": 200,
		"High-Grade Metals": 500,

		"Low-Grade Wood": 50,
		"Mid-Grade Wood": 300,
		"High-Grade Wood": 4000,

		"Binding of Slaughter": 100000,
		"Binding of Balance": 1000,
		"Binding of Isaac": 3000,
		"Binding of Destruction": 60000,
		"Binding of Focus": 500,
		"Binding of Friendship": 500,

		"Binding of Protection": 30000,
		"Binding of Warding": 1000,
		"Binding of the Fleet": 10000,
		"Binding of the Barrier": 3000,
		"Binding of the Nimble": 3000,
		"Binding of Negation": 500,

		"Binding of the Ox": 10000,
		"Binding of the Raccoon": 10000,
		"Binding of the Cheetah": 30000,
		"Binding of the Turtle": 3000,
		"Binding of the Fox": 15000,
		"Binding of the Owl": 15000,

		"Binding of the Elementalist": 1000,
		"Binding of the Heaven-sent": 1000,
		"Binding of the Demon-fiend": 1000,
		"Binding of the Curse-weaver": 500,
		"Binding of the Earth-walker": 500,

		"Binding of Surtr": 1000,
		"Binding of Niflheim": 1000,
		"Binding of Mjolnir": 1000,
		"Binding of Freyr": 1000,
		"Binding of Heimdall": 1000,
		"Binding of Fenrir": 1000,

		"Binding of Dampening": 1000,
		"Binding of Stoneskin": 500,
		"Binding of Deflection": 500,
		"Binding of the Fire-eater": 500,
		"Binding of the Frost-born": 500,
		"Binding of the Thunder-child": 500,
		"Binding of the Wind-waker": 500,
		"Binding of the Thrice-blessed": 500,
		"Binding of the Spirit-ward": 500,
	},

	"Trophies" : { // WTB price
		"ManBearPig Tail": 700,
		"Holy Hand Grenade of Antioch": 700,
		"Mithra's Flower": 700,
		"Dalek Voicebox": 700,
		"Lock of Blue Hair": 1050,
		"Bunny-Girl Costume": 1300,
		"Hinamatsuri Doll": 1300,
		"Broken Glasses": 1300,
		"Black T-Shirt": 6000,
		"Sapling": 6000,
		"Unicorn Horn": 8000,
		//"Noodly Appendage": 10000,
	},

	"Crystals" : { // 12 types of Crystals
		"Crystal of Vigor": 0,
		"Crystal of Finesse": 0,
		"Crystal of Swiftness": 0,
		"Crystal of Fortitude": 0,
		"Crystal of Cunning": 0,
		"Crystal of Knowledge": 0,
		"Crystal of Flames": 0,
		"Crystal of Frost": 0,
		"Crystal of Lightning": 0,
		"Crystal of Tempest": 0,
		"Crystal of Devotion": 0,
		"Crystal of Corruption": 0,
	},

	// add any list if needed

}

};

// END OF SETTINGS


function $id(id,d){return (d||document).getElementById(id);}
function $qs(q,d){return (d||document).querySelector(q);}
function $qsa(q,d){return Array.from((d||document).querySelectorAll(q));}
function $element(t,p,a,f){var e;if(!t){if(arguments.length>1){e=document.createTextNode(a);a=null;}else{return document.createDocumentFragment();}}else{e=document.createElement(t);}if(a!==null&&a!==undefined){switch(a.constructor){case Number:e.textContent=a;break;case String:e.textContent=a;break;case Array:a.forEach(function(aa){var a0=({" ":"textContent","#":"id",".":"className","!":"style","/":"innerHTML"})[aa[0]];if(a0){e[a0]=aa.substr(1);}});break;case Object:var ai,av,es,esi;for(ai in a){av=a[ai];if(av&&av.constructor===Object){if(ai in e){es=e[ai];}else{es=e[ai]={};}for(esi in av){es[esi]=av[esi];}}else{if(ai==="style"){e.style.cssText=av;}else if(ai in e){e[ai]=av;}else{e.setAttribute(ai,av);}}}break;}}if(f){if(f.constructor===Function){e.addEventListener("click",f,false);}else if(f.constructor===Object){var fi;for(fi in f){e.addEventListener(fi,f[fi],false);}}}if(p){var p0,p1;if(p.nodeType===1||p.nodeType===11){p0=p;p1=null;}else if(p.constructor===Array){p0=p[0];p1=p[1];if(!isNaN(p1)){p1=p0.childNodes[parseInt(p1)];}}p0.insertBefore(e,p1);}return e;}
function time_format(t,o){t=Math.floor(t/1000);var h=Math.floor(t/3600).toString().padStart(2,"0"),m=Math.floor(t%3600/60).toString().padStart(2,"0"),s=(t%60).toString().padStart(2,"0");return !o?h+":"+m+":"+s:o===1?h+":"+m:o===2?m+":"+s:"";}
function object_sort(o,x=[]){var keys=Object.keys(o),index_object={};x.forEach((e,i)=>{index_object[e]=i+1;});keys.sort((a,b)=>{var _a=index_object[a]||x.length+1,_b=index_object[b]||x.length+1;return _a-_b||(a<b?-1:1);});keys.forEach(e=>{var v=o[e];delete o[e];o[e]=v;});}
function substring(t,s,e,d){var si=0,ei=0,so=0,eo=0;if(typeof s!=="string"){so=s[1];if(s[2]){si=t.indexOf(s[2]);}s=s[0];so=so===true?s.length:so;}si=t.indexOf(s,si);if(typeof e!=="string"){eo=e[1];if(e[2]){ei=t.indexOf(e[2]);}e=e[0];eo=eo===true?e.length:eo;}ei=e?t.indexOf(e,si>ei?si:ei):t.length;if(si===-1||ei===-1){return null;}t=t.substring(si+so,ei+eo);if(d){d=document.createElement("template");d.innerHTML=t;t=d.content;}return t;}
function scrollIntoView(e,p=e.parentNode){p.scrollTop+=e.getBoundingClientRect().top-p.getBoundingClientRect().top;}
function confirm_event(n,e,m,c,f){if(!n){return;}var a=n.getAttribute("on"+e);n.removeAttribute("on"+e);n.addEventListener(e,function(e){if(!c||c()){if(confirm(m)){if(f){f();}}else{e.preventDefault();e.stopImmediatePropagation();}}},true);n.setAttribute("on"+e,a);}
function play_beep(s={volume:0.2,frequency:500,time:0.5,delay:1}){if(!s.volume){return;}var c=new window.AudioContext(),o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=s.frequency;g.gain.value=s.volume;o.connect(g);g.connect(c.destination);o.start(s.delay);o.stop(s.delay+s.time);}
function popup(t,s){var r=function(e){e.stopImmediatePropagation();e.preventDefault();if(e.which===1||e.which===13||e.which===27||e.which===32){w.remove();document.removeEventListener("keydown",r);}},w=$element("div",document.body,["!position:fixed;top:0;left:0;width:1236px;height:702px;padding:3px 100% 100% 3px;background-color:rgba(0,0,0,.6);z-index:1001;display:flex;justify-content:center;align-items:center"]),d=$element("div",w,["/"+t,"!min-width:400px;min-height:100px;max-width:100%;max-height:100%;padding:10px;background-color:#fff;border:1px solid #333;cursor:pointer;display:flex;flex-direction:column;justify-content:center;font-size:10pt;color:#000;"+(s||"")],r);document.addEventListener("keydown",r);return d;}
function popup_text(m,s,b=[]){var v,l;if(typeof m==="string"){v=m;l=m.split("\n").length;}else{v=m.join("\n");l=m.length;}var w=$element("div",document.body,["!position:fixed;top:0;left:0;width:1236px;height:702px;padding:3px 100% 100% 3px;background-color:rgba(0,0,0,.6);z-index:1001;display:flex;justify-content:center;align-items:center"]),d=$element("div",w,["!border:1px solid #333;padding:5px;background-color:#fff"]),t=$element("textarea",d,{value:v,spellcheck:false,style:"display:block;margin:0 0 5px;font-size:9pt;line-height:1.5em;height:"+(l*1.5+1)+"em;"+(s||"")});b.forEach(o=>{$element("input",d,{type:"button",value:o.v},()=>o.f(w,t));});$element("input",d,{type:"button",value:"Close"},function(){w.remove();});return w;}

function getValue(k,d,p="hvut_"){var v=localStorage.getItem(p+k);return v===null?d:JSON.parse(v);}
function setValue(k,v,p="hvut_"){localStorage.setItem(p+k,JSON.stringify(v));}
function deleteValue(k,p="hvut_"){localStorage.removeItem(p+k);}

var _query = {};
if(location.search){location.search.substr(1).split("&").forEach(function(q){q=q.split("=",2);_query[q[0]]=decodeURIComponent(q[1].replace(/\+/g," "));});}

var _window = typeof unsafeWindow==="undefined"?window:unsafeWindow;


/***** [MODULE] ajax *****/
var $ajax = {

max_conn : settings.max_conn || 3,
index : 0,
conn : 0,
queue : [],

send : function(method,url,data,onload,onerror,headers={}) {
	if(method) {
		if(data && typeof data !== "string") {
			data = method==="JSON" ? JSON.stringify(data) : Object.keys(data).map(k=>encodeURIComponent(k)+"="+encodeURIComponent(data[k])).join("&");
		}
		if(!data) {
			method = "GET";
			data = "";
		} else if(method === "JSON") {
			method = "POST";
			headers["Content-Type"] = "application/json";
		} else {
			method = "POST";
			headers["Content-Type"] = "application/x-www-form-urlencoded";
		}
		$ajax.queue.push({method:method,url:url,data:data,headers:headers,onload:$ajax.onload,onerror:$ajax.onerror,context:{onload:onload,onerror:onerror}});
	}

	var current = $ajax.queue[$ajax.index];
	if(current && $ajax.conn<$ajax.max_conn && !$ajax.error) {
		$ajax.index++;
		$ajax.conn++;
		GM_xmlhttpRequest(current);
	}
},

onload : function(r) {
	$ajax.conn--;
	var text = r.responseText.trim();
	if(text === "state lock limiter in effect") {
		if($ajax.error !== text) {
			popup("<span style='color:#f00;font-weight:bold'>"+text+"</span><br /><span>Your connection speed is so fast that <br />you have reached the maximum connection limit.</span><br /><span>Set <span style='font-weight:bold'>settings.max_conn</span> to a number lower than the current value.</span>");
		}
		$ajax.error = text;
		if(r.context.onerror) {
			r.context.onerror(r);
		}
	} else {
		if(r.context.onload) {
			r.context.onload(r);
		}
		$ajax.send();
	}
},
onerror : function(r) {
	$ajax.conn--;
	if(r.context.onerror) {
		r.context.onerror(r);
	}
	$ajax.send();
}

};
/***** [MODULE] ajax *****/


/***** [MODULE] Random Encounter *****/
var $re = {

	init : function(){
		if($re.inited) {
			return;
		}
		$re.inited = true;
		$re.type = location.hostname==="e-hentai.org"?0 : $id("navbar")?1 : $id("battle_top")?2 : false;
		$re.get();
	},

	get : function() {
		$re.json = getValue("re",{date:0,key:"",count:0,clear:true},"hvut_");
		var gm_json = JSON.parse(GM_getValue("re",null)) || {date:-1};
		if($re.json.date === gm_json.date) {
			if($re.json.clear !== gm_json.clear) {
				$re.json.clear = true;
				$re.set();
			}
		} else {
			if($re.json.date < gm_json.date) {
				$re.json = gm_json;
			}
			$re.set();
		}
	},

	set : function() {
		setValue("re",$re.json,"hvut_");
		GM_setValue("re",JSON.stringify($re.json));
	},

	reset : function(){
		$re.json.date = Date.now();
		$re.json.count = 0;
		$re.json.clear = true;
		$re.set();
		$re.start();
	},

	check : function(){
		$re.init();
		if(/\?s=Battle&ss=ba&encounter=([A-Za-z0-9=]+)(?:&date=(\d+))?/.test(location.search)) {
			var key = RegExp.$1,
				date = parseInt(RegExp.$2),
				now = Date.now();
			if($re.json.key === key) {
				if(!$re.json.clear) {
					$re.json.clear = true;
					$re.set();
				}
			} else if(date) {
				if($re.json.date < date) {
					$re.json.date = date;
					$re.json.key = key;
					$re.json.count++;
					$re.json.clear = true;
					$re.set();
				}
			} else if($re.json.date + 1800000 < now) {
				$re.json.date = now;
				$re.json.key = key;
				$re.json.count++;
				$re.json.clear = true;
				$re.set();
			}
		}
	},

	clock : function(button){
		$re.init();
		$re.button = button;
		if($re.type === 2) { // battle
			$re.button.addEventListener("click",function(){$re.load();});
		} else if($re.type === 1) { // hv
			$re.button.addEventListener("click",function(e){if(!$re.json.clear||e.ctrlKey){$re.engage();}else{$re.load(true);}});
		} else if($re.type === 0) { // gallery
			$re.button.addEventListener("click",function(e){if(!$re.json.clear||e.ctrlKey){$re.engage();}else{$re.load(true);}});
		}

		var date = new Date($re.json.date),
			now = new Date();
		if(date.getUTCDate()!==now.getUTCDate() || date.getUTCMonth()!==now.getUTCMonth() || date.getUTCFullYear()!==now.getUTCFullYear()) {
			$re.reset();
			$re.load();
		}
		$re.check();
		$re.start();
	},

	refresh : function(){
		var remain = $re.json.date + 1800000 - Date.now();
		if(remain > 0) {
			$re.button.textContent = time_format(remain,2) + " ["+$re.json.count+"]";
			$re.beep = true;
		} else {
			$re.button.textContent = (!$re.json.clear?"Expired":"Ready") + " ["+$re.json.count+"]";
			if($re.beep) {
				$re.beep = false;
				play_beep(settings.reBeep);
			}
			$re.stop();
		}
	},

	load : function(engage){
		$re.stop();
		$re.get();
		$re.button.textContent = "Loading...";

		$ajax.send("GET","https://e-hentai.org/news.php",null,function(r){
			var html = r.responseText,
				doc = (new DOMParser()).parseFromString(r.responseText,"text/html"),
				eventpane = $id("eventpane",doc);

			if(eventpane && /\?s=Battle&amp;ss=ba&amp;encounter=([A-Za-z0-9=]+)/.test(eventpane.innerHTML)) {
				$re.json.date = Date.now();
				$re.json.key = RegExp.$1;
				$re.json.count++;
				$re.json.clear = false;
				$re.set();
				if(engage) {
					$re.engage();
					return;
				}

			} else if(eventpane && /It is the dawn of a new day/.test(eventpane.innerHTML)) {
				popup(eventpane.innerHTML);
				$re.reset();

			} else {
				popup("Failed to get a new Random Encounter key");
			}
			$re.start();

		},function(){
			popup("Failed to read the news page");
			$re.start();
		});
	},

	engage : function(){
		if(!$re.json.key) {
			return;
		}
		var href = "/?s=Battle&ss=ba&encounter="+$re.json.key+"&date="+$re.json.date;
		if($re.type === 2) {
			return;
		} else if($re.type === 1) {
			location.href = href;
		} else if($re.type === 0) {
			window.open((settings.reGalleryAlt?"http://alt.hentaiverse.org":"https://hentaiverse.org")+href,"_hentaiverse");
			$re.json.clear = true;
			$re.start();
		}
	},

	start : function(){
		$re.stop();
		if(!$re.json.clear) {
			$re.button.style.color = "#e00";
		} else {
			$re.button.style.color = "";
		}
		$re.tid = setInterval($re.refresh,1000);
		$re.refresh();
	},

	stop : function(){
		if($re.tid) {
			clearInterval($re.tid);
			$re.tid = 0;
		}
	},

};
/***** [MODULE] Random Encounter *****/


/***** [START] *****/
if($id("navbar")) {

// Init
var _ch = {},
	_eq = {},
	_ab = {},
	_tr = {},
	_it = {},
	_in = {},
	_se = {},

	_es = {},
	_is = {},
	_ib = {},
	_ml = {},
	_ss = {},
	_mm = {},
	_lt = {},
	_la = {},

	_ar = {},
	_rb = {},
	_gr = {},
	_iw = {},

	_re = {},
	_up = {},
	_en = {},
	_sa = {},
	_fo = {},
	_fu = {},

	_top = {},
	_bottom = {};


/***** [MODULE] Equip Parser *****/
var $equip = {};

$equip.basename = getValue("equip_name",{});

$equip.dynjs_equip = _window.dynjs_equip || {}; // equipment inventory (player, all, cache)
$equip.dynjs_eqstore = _window.dynjs_eqstore || {}; // equipment storage (player, category) OR store inventory (shop, category)
$equip.dynjs_loaded = {};
$equip.eqvalue = _window.eqvalue || {};
$equip.alias = {"1handed":"One-handed Weapon","2handed":"Two-handed Weapon","staff":"Staff","shield":"Shield","acloth":"Cloth Armor","alight":"Light Armor","aheavy":"Heavy Armor"};

$equip.filter = function(name,filter) {
	if(!filter) {
		return false;
	}
	var n = name.toLowerCase();
	return filter.some(function(f){
		var c = f.toLowerCase().replace(/[a-z\- ]+/g,function(s){s=s.trim();return !s?"":n.includes(s);});
		try {
			return eval(c);
		} catch(e) {
			popup("Invalid Equip Filter: "+f);
			return false;
		}
	});
};

$equip.sort = {
	category: {"One-handed Weapon":1,"Two-handed Weapon":2,"Staff":3,"Shield":4,"Cloth Armor":5,"Light Armor":6,"Heavy Armor":7,"Obsolete":99},
	type: {
		"Rapier":1,"Club":2,"Axe":3,"Wakizashi":4,"Shortsword":5,"Dagger":6,"Sword Chucks":7,
		"Estoc":1,"Mace":2,"Katana":3,"Longsword":4,"Scythe":5,
		"Oak Staff":1,"Willow Staff":2,"Katalox Staff":3,"Redwood Staff":4,"Ebony Staff":5,
		"Force Shield":1,"Buckler":2,"Kite Shield":3,"Tower Shield":4,
		"Phase":1,"Cotton":2,"Gossamer":3,"Silk":4,
		"Shade":1,"Leather":2,"Kevlar":3,"Dragon Hide":4,
		"Power":1,"Plate":2,"Shield":3,"Chainmail":4,
		},
	quality: {"Peerless":1,"Legendary":2,"Magnificent":3,"Exquisite":4,"Superior":5,"Fine":6,"Average":7,"Fair":8,"Crude":9,"Flimsy":10},
	prefix: {
		"Ethereal":1,"Fiery":2,"Arctic":3,"Shocking":4,"Tempestuous":5,"Hallowed":6,"Demonic":7,
		"Radiant":1,"Charged":2,"Frugal":3,"Mystic":4,
		"Savage":1,"Agile":2,"Reinforced":3,"Shielding":4,"Mithril":5,
		"Ruby":11,"Cobalt":12,"Amber":13,"Jade":14,"Zircon":15,"Onyx":16
		},
	slot: {
		"Cap":1,"Robe":2,"Gloves":3,"Pants":4,"Shoes":5,
		"Helmet":1,"Breastplate":2,"Cuirass":2,"Armor":2,"Gauntlets":3,"Greaves":4,"Leggings":4,"Sabatons":5,"Boots":5
		},
	suffix: {
		"Slaughter":1,"Balance":2,"Swiftness":3,"the Barrier":4,"the Nimble":5,"the Battlecaster":6,"the Vampire":7,"the Illithid":8,"the Banshee":9,
		"Destruction":1,"Surtr":2,"Niflheim":3,"Mjolnir":4,"Freyr":5,"Heimdall":6,"Fenrir":7,"the Elementalist":8,"the Heaven-sent":9,"the Demon-fiend":10,"the Earth-walker":11,"the Curse-weaver":12,"Focus":13,
		"the Shadowdancer":1,"the Fleet":2,"the Arcanist":3,"Negation":4,
		"Protection":21,"Warding":22,"Dampening":23,"Stoneskin":24,"Deflection":25
		},
};

$equip.reg = {
	quality : "Flimsy|Crude|Fair|Average|Fine|Superior|Exquisite|Magnificent|Legendary|Peerless",
	prefix : "Ethereal|Fiery|Arctic|Shocking|Tempestuous|Hallowed|Demonic|Ruby|Cobalt|Amber|Jade|Zircon|Onyx|Charged|Frugal|Radiant|Mystic|Agile|Reinforced|Savage|Shielding|Mithril",
	slot : "Cap|Robe|Gloves|Pants|Shoes|Helmet|Breastplate|Gauntlets|Leggings|Boots|Cuirass|Armor|Greaves|Sabatons|Coif|Hauberk|Mitons|Chausses|Boots",
	OneHanded : "Axe|Club|Rapier|Shortsword|Wakizashi|Dagger|Sword Chucks",
	TwoHanded : "Estoc|Longsword|Mace|Katana|Scythe",
	Staff : "Oak Staff|Willow Staff|Katalox Staff|Redwood Staff|Ebony Staff",
	Shield : "Buckler|Kite Shield|Force Shield|Tower Shield",
	Cloth : "Cotton|Phase|Gossamer|Silk",
	Light : "Leather|Shade|Kevlar|Dragon Hide",
	Heavy : "Plate|Power|Shield|Chainmail",
};

$equip.reg.name = new RegExp("^("+$equip.reg.quality+")(?: (?:("+$equip.reg.prefix+")|(.+?)))? (?:("+$equip.reg.OneHanded+")|("+$equip.reg.TwoHanded+")|("+$equip.reg.Staff+")|("+$equip.reg.Shield+")|(?:(?:("+$equip.reg.Cloth+")|("+$equip.reg.Light+")|("+$equip.reg.Heavy+")) ("+$equip.reg.slot+")))(?: of (.+))?$","i");
$equip.reg.html = /<div>(.+?) &nbsp; &nbsp; (?:Level (\d+|Unassigned) )?&nbsp; &nbsp; <span>(Tradeable|Untradeable|Soulbound)<\/span><\/div><div>Condition: (\d+) \/ (\d+) \(\d+%\) &nbsp; &nbsp; Potency Tier: (\d+) \((?:(\d+) \/ (\d+)|MAX)\)/;


$equip.stats = {

scale : {
	"Attack Damage" : 50/3,
	"Attack Accuracy" : 5000,
	"Attack Crit Chance" : 2000,
	"Magic Damage" : 250/11,
	"Magic Accuracy" : 5000,
	"Magic Crit Chance" : 2000,
	"Physical Mitigation" : 2000,
	"Magical Mitigation" : 2000,
	"Evade Chance" : 2000,
	"Block Chance" : 2000,
	"Parry Chance" : 2000,
	"Resist Chance" : 2000,
	"Spell Damage" : 200,
	"Proficiency" : 250/7,
	"Primary Attributes" : 250/7
},

fluc : {
	"Attack Damage" : 0.0854,
	"Attack Speed" : 0.0481,
	"Attack Accuracy" : 0.06069,
	"Attack Crit Chance" : 0.0105,
	"Attack Crit Damage" : 0.01,
	"Magic Damage" : 0.082969,
	"Casting Speed" : 0.0489,
	"Magic Accuracy" : 0.0491,
	"Magic Crit Chance" : 0.0114,
	"Spell Crit Damage" : 0.01,
	"Physical Mitigation" : 0.021,
	"Magical Mitigation" : 0.0201,
	"Evade Chance" : 0.025,
	"Block Chance" : 0.0998,
	"Parry Chance" : 0.0894,
	"Resist Chance" : 0.0804,
	"Spell Damage" : 0.0804,
	"Proficiency" : 0.0306,
	"_Crushing" : 0.0155,
	"_Slashing" : 0.0153,
	"_Piercing" : 0.015,
	"_Elemental" : 0.1,
	"Primary Attributes" : 0.03,
},

upgrade : {
	"Physical Damage" : "Attack Damage",
	"Physical Hit Chance" : "Attack Accuracy",
	"Physical Crit Chance" : "Attack Crit Chance",
	"Magical Damage" : "Magic Damage",
	"Magical Hit Chance" : "Magic Accuracy",
	"Magical Crit Chance" : "Magic Crit Chance",
	"Physical Defense" : "Physical Mitigation",
	"Magical Defense" : "Magical Mitigation",
	"Evade Chance" : "Evade Chance",
	"Block Chance" : "Block Chance",
	"Parry Chance" : "Parry Chance",
	"Resist Chance" : "Resist Chance",
	"Elemental Proficiency" : "Elemental",
	"Divine Proficiency" : "Divine",
	"Forbidden Proficiency" : "Forbidden",
	"Supportive Proficiency" : "Supportive",
	"Deprecating Proficiency" : "Deprecating",
	"Fire Spell Damage" : "Fire",
	"Cold Spell Damage" : "Cold",
	"Elec Spell Damage" : "Elec",
	"Wind Spell Damage" : "Wind",
	"Holy Spell Damage" : "Holy",
	"Dark Spell Damage" : "Dark",
	"Crushing Mitigation" : "_Crushing",
	"Slashing Mitigation" : "_Slashing",
	"Piercing Mitigation" : "_Piercing",
	"Fire Mitigation" : "_Fire",
	"Cold Mitigation" : "_Cold",
	"Elec Mitigation" : "_Elec",
	"Wind Mitigation" : "_Wind",
	"Holy Mitigation" : "_Holy",
	"Dark Mitigation" : "_Dark",
	"Strength Bonus" : "Strength",
	"Dexterity Bonus" : "Dexterity",
	"Agility Bonus" : "Agility",
	"Endurance Bonus" : "Endurance",
	"Intelligence Bonus" : "Intelligence",
	"Wisdom Bonus" : "Wisdom"
},

prefix : {
	"Ethereal" : [],
	"Fiery" : ["Fire"],
	"Arctic" : ["Cold"],
	"Shocking" : ["Elec"],
	"Tempestuous" : ["Wind"],
	"Hallowed" : ["Holy"],
	"Demonic" : ["Dark"],
	"Ruby" : ["_Fire"],
	"Cobalt" : ["_Cold"],
	"Amber" : ["_Elec"],
	"Jade" : ["_Wind"],
	"Zircon" : ["_Holy"],
	"Onyx" : ["_Dark"],
	"Charged" : ["Casting Speed"],
	"Frugal" : ["Mana Conservation"],
	"Radiant" : ["Magic Damage"],
	"Mystic" : ["Spell Crit Damage"],
	"Agile" : ["Attack Speed"],
	"Reinforced" : ["_Crushing","_Slashing","_Piercing"],
	"Savage" : ["Attack Crit Damage"],
	"Shielding" : ["Block Chance"],
	"Mithril" : ["Burden"]
},

suffix : {
	"Slaughter" : ["Attack Damage"],
	"Balance" : ["Attack Accuracy","Attack Crit Chance"],
	"Swiftness" : ["Attack Speed"],
	"the Barrier" : ["Block Chance"],
	"the Nimble" : ["Parry Chance"],
	"the Battlecaster" : ["Magic Accuracy","Mana Conservation"],
	"the Vampire" : [],
	"the Illithid" : [],
	"the Banshee" : [],
	"Destruction" : ["Magic Damage"],
	"Surtr" : ["Fire"],
	"Niflheim" : ["Cold"],
	"Mjolnir" : ["Elec"],
	"Freyr" : ["Wind"],
	"Heimdall" : ["Holy"],
	"Fenrir" : ["Dark"],
	"the Elementalist" : ["Elemental"],
	"the Heaven-sent" : ["Divine"],
	"the Demon-fiend" : ["Forbidden"],
	"the Earth-walker" : ["Supportive"],
	"the Curse-weaver" : ["Deprecating"],
	"Focus" : ["Magic Accuracy","Magic Crit Chance","Mana Conservation"],
	"the Shadowdancer" : ["Attack Crit Chance","Evade Chance"],
	"the Fleet" : ["Evade Chance"],
	"the Arcanist" : ["Magic Accuracy","Interference","Intelligence","Wisdom"],
	"Negation" : ["Resist Chance"],
	"Protection" : ["Physical Mitigation"],
	"Warding" : ["Magical Mitigation"],
	"Dampening" : ["_Crushing"],
	"Stoneskin" : ["_Slashing"],
	"Deflection" : ["_Piercing"]
},

pmax : {
	"Axe" : {"Attack Damage":[59.87,75.92],"Attack Accuracy":[12.81],"Attack Crit Chance":[5.37],"Burden":[14],"Interference":[3.5],"Spell Damage":[0,11.34],"Strength":[6.33],"Dexterity":[4.08],"Agility":[3.33]},
	"Club" : {"Attack Damage":[53.04,67.72],"Attack Accuracy":[12.81,31.02],"Attack Crit Chance":[5.37,10.41],"Magic Accuracy":[0,7.91],"Mana Conservation":[0,16.11],"Parry Chance":[0,9.04],"Burden":[9.8],"Interference":[3.5],"Spell Damage":[0,11.34],"Strength":[6.33],"Dexterity":[4.08],"Agility":[4.08]},
	"Rapier" : {"Attack Damage":[39.38,51.33],"Attack Accuracy":[21.92,44.68],"Attack Crit Chance":[5.37,10.41],"Magic Accuracy":[0,7.91],"Mana Conservation":[0,16.11],"Parry Chance":[18.89,26.94],"Burden":[6.3],"Interference":[3.5],"Spell Damage":[0,11.34],"Strength":[4.08],"Dexterity":[6.33],"Agility":[4.08]},
	"Shortsword" : {"Attack Damage":[47.92,61.58],"Attack Speed":[0,6.54],"Attack Accuracy":[27.99,53.79],"Attack Crit Chance":[5.37,10.41],"Magic Accuracy":[0,7.91],"Mana Conservation":[0,16.11],"Parry Chance":[18.89],"Burden":[5.25],"Interference":[3.5],"Spell Damage":[0,11.34],"Strength":[6.33],"Dexterity":[6.33],"Agility":[6.33]},
	"Wakizashi" : {"Attack Damage":[35.11,46.21],"Attack Speed":[12.56,18.57],"Attack Accuracy":[24.95,49.24],"Attack Crit Chance":[5.37,10.41],"Magic Accuracy":[0,7.91],"Mana Conservation":[0,16.12],"Parry Chance":[22.47,30.53],"Burden":[2.8],"Interference":[3.5],"Spell Damage":[0,11.34],"Strength":[3.33],"Dexterity":[7.83],"Agility":[7.83]},

	"Estoc" : {"Attack Damage":[64.99,82.07],"Attack Accuracy":[9.77,26.47],"Attack Crit Chance":[7.99,13.56],"Magic Accuracy":[0,12.82],"Mana Conservation":[0,26.11],"Burden":[14],"Interference":[7],"Spell Damage":[0,11.34],"Strength":[11.58],"Dexterity":[6.03],"Agility":[3.93]},
	"Longsword" : {"Attack Damage":[78.66,98.47],"Attack Accuracy":[12.81,31.02],"Attack Crit Chance":[8.52,14.19],"Magic Accuracy":[0,12.81],"Mana Conservation":[0,26.11],"Burden":[21],"Interference":[10.5],"Spell Damage":[0,11.34],"Strength":[12.33],"Dexterity":[9.33],"Agility":[4.83]},
	"Mace" : {"Attack Damage":[64.99,82.07],"Attack Accuracy":[12.2,30.11],"Attack Crit Chance":[7.99,13.56],"Magic Accuracy":[0,12.82],"Mana Conservation":[0,26.11],"Burden":[14],"Interference":[7],"Spell Damage":[0,11.34],"Strength":[11.73],"Dexterity":[7.83],"Agility":[4.08]},
	"Katana" : {"Attack Damage":[64.99,82.07],"Attack Accuracy":[27.98,53.78],"Attack Crit Chance":[8.52,14.19],"Burden":[14],"Interference":[7],"Spell Damage":[0,11.34],"Strength":[12.33],"Dexterity":[9.33],"Agility":[4.83]},

	"Katalox Staff" : {"Attack Damage":[34.22],"Magic Damage":[32.39,52.2],"Magic Accuracy":[19.18,38.34],"Magic Crit Chance":[7.3,12.39],"Mana Conservation":[0,33.08],"Burden":[7],"Spell Damage A":[11.31,21.76,27.39,37.84],"Spell Damage C":[0,11.31],"Divine":[8.28,16.24],"Forbidden":[8.28,16.24],"Deprecating":[6.14],"Intelligence":[7.22],"Wisdom":[4.82]},
	"Oak Staff" : {"Attack Damage":[34.23],"Magic Damage":[31.98],"Magic Accuracy":[18.94,38],"Magic Crit Chance":[5.82,10.61],"Mana Conservation":[0,33.09],"Counter-Resist":[13.58],"Burden":[4.9],"Spell Damage A":[16.14,26.6,32.22,42.68],"Spell Damage B":[8.1,18.56],"Spell Damage C":[0,11.32],"Elemental":[6.45],"Divine":[6.45],"Supportive":[11.81,19.76],"Intelligence":[4.82],"Wisdom":[7.22]},
	"Redwood Staff" : {"Attack Damage":[34.23],"Magic Damage":[31.98,51.71],"Magic Accuracy":[18.94,38],"Magic Crit Chance":[5.82,10.61],"Mana Conservation":[0,33.09],"Burden":[4.9],"Spell Damage A":[11.32,21.77,27.4,37.85],"Spell Damage C":[0,11.32],"Elemental":[8.29,16.24],"Supportive":[4.31],"Deprecating":[4.31],"Intelligence":[6.32],"Wisdom":[6.32]},
	"Willow Staff" : {"Attack Damage":[34.23],"Magic Damage":[31.98,51.71],"Magic Accuracy":[18.94,38],"Magic Crit Chance":[5.82,10.61],"Mana Conservation":[0,33.09],"Counter-Resist":[13.58],"Burden":[4.9],"Spell Damage A":[16.14,26.6],"Spell Damage B":[8.1,18.56],"Spell Damage C":[0,11.32],"Elemental":[6.14],"Forbidden":[6.14],"Deprecating":[11.81,19.76],"Intelligence":[4.82],"Wisdom":[7.22]},

	"Buckler" : {"Attack Speed":[0,3.65],"Magic Accuracy":[0,12.82],"Mana Conservation":[0,26.1],"Physical Mitigation":[2.33,4.22],"Magical Mitigation":[2.23,6.65],"Block Chance":[31.03,37.52],"Parry Chance":[0,9.04],"Burden":[2.8,2.1],"Interference":[1.4],"_Crushing":[0,3.27],"_Slashing":[0,3.23],"_Piercing":[0,3.16],"Strength":[6.33],"Dexterity":[6.33],"Endurance":[6.33],"Agility":[6.33]},
	"Force Shield" : {"Physical Mitigation":[3.38,5.48],"Magical Mitigation":[3.24,7.86],"Block Chance":[38.52],"Burden":[2.8],"Interference":[28],"_Crushing":[0,7.14],"_Slashing":[0,7.05],"_Piercing":[0,6.91],"_Elemental":[0,26.1],"Strength":[6.33],"Dexterity":[6.33],"Endurance":[6.33],"Agility":[6.33]},
	"Kite Shield" : {"Attack Speed":[0,3.65],"Physical Mitigation":[3.38,5.48],"Magical Mitigation":[3.24,7.86],"Block Chance":[36.02],"Burden":[10.5,7.91],"Interference":[10.5],"_Crushing":[0,7.14,3.27,10.24],"_Slashing":[0,7.05,3.23,10.11],"_Piercing":[0,6.91,3.16,9.91],"Strength":[6.33],"Dexterity":[6.33],"Endurance":[6.33],"Agility":[6.33]},

	"Phase Cap" : {"Attack Accuracy":[4.62],"Magic Damage":[0,4.23],"Casting Speed":[0,3.47],"Magic Accuracy":[5.45],"Spell Crit Damage":[0,3.91],"Mana Conservation":[0,3.61],"Physical Mitigation":[3.38],"Magical Mitigation":[4.24],"Evade Chance":[5.28],"Resist Chance":[6.52],"Spell Damage":[0,16.97],"_Crushing":[2.5],"_Elemental":[0,26.11],"Agility":[6.03],"Intelligence":[7.08],"Wisdom":[7.08]},
	"Phase Robe" : {"Attack Accuracy":[5.41],"Magic Damage":[0,4.9],"Casting Speed":[0,4.06],"Magic Accuracy":[6.43],"Spell Crit Damage":[0,4.67],"Mana Conservation":[0,4.11],"Physical Mitigation":[4.01],"Magical Mitigation":[5.05],"Evade Chance":[6.28],"Resist Chance":[7.64],"Spell Damage":[0,20.18],"_Crushing":[2.96],"_Elemental":[0,31.11],"Agility":[7.17],"Intelligence":[8.43],"Wisdom":[8.43]},
	"Phase Gloves" : {"Attack Accuracy":[4.25],"Magic Damage":[0,3.9],"Casting Speed":[0,3.18],"Magic Accuracy":[4.96],"Spell Crit Damage":[0,3.53],"Mana Conservation":[0,3.41],"Physical Mitigation":[3.07],"Magical Mitigation":[3.84],"Evade Chance":[4.78],"Resist Chance":[5.95],"Spell Damage":[0,15.36],"_Crushing":[2.26],"_Elemental":[0,23.61],"Agility":[5.46],"Intelligence":[6.42],"Wisdom":[6.42]},
	"Phase Pants" : {"Attack Accuracy":[5.04],"Magic Damage":[0,4.56],"Casting Speed":[0,3.77],"Magic Accuracy":[5.94],"Spell Crit Damage":[0,4.29],"Mana Conservation":[0,3.91],"Physical Mitigation":[3.7],"Magical Mitigation":[4.64],"Evade Chance":[5.78],"Resist Chance":[7.08],"Spell Damage":[0,18.58],"_Crushing":[2.73],"_Elemental":[0,28.61],"Agility":[6.6],"Intelligence":[7.77],"Wisdom":[7.77]},
	"Phase Shoes" : {"Attack Accuracy":[3.83],"Magic Damage":[0,3.57],"Casting Speed":[0,2.89],"Magic Accuracy":[4.47],"Spell Crit Damage":[0,3.15],"Mana Conservation":[0,3.11],"Physical Mitigation":[2.75],"Magical Mitigation":[3.44],"Evade Chance":[4.28],"Resist Chance":[5.39],"Spell Damage":[0,13.75],"_Crushing":[2.03],"_Elemental":[0,21.11],"Agility":[4.89],"Intelligence":[5.73],"Wisdom":[5.73]},

	"Cotton Cap" : {"Attack Accuracy":[4.62],"Casting Speed":[0,3.47],"Magic Accuracy":[4.23],"Mana Conservation":[0,3.61],"Physical Mitigation":[4.43,6.74],"Magical Mitigation":[4.24,9.07],"Evade Chance":[4.03],"Resist Chance":[6.11],"Proficiency":[0,8.29],"_Crushing":[3.27],"_Elemental":[0,26.11],"Agility":[4.83],"Intelligence":[6.33],"Wisdom":[6.33]},
	"Cotton Robe" : {"Attack Accuracy":[5.41],"Casting Speed":[0,4.06],"Magic Accuracy":[4.96],"Mana Conservation":[0,4.11],"Physical Mitigation":[5.27,8.04],"Magical Mitigation":[5.05,10.83],"Evade Chance":[4.78],"Resist Chance":[7.16],"Proficiency":[0,9.89],"_Crushing":[3.89],"_Elemental":[0,31.11],"Agility":[5.73],"Intelligence":[7.53],"Wisdom":[7.53]},
	"Cotton Gloves" : {"Attack Accuracy":[4.25],"Casting Speed":[0,3.18],"Magic Accuracy":[3.88],"Mana Conservation":[0,3.41],"Physical Mitigation":[4.01,6.09],"Magical Mitigation":[3.84,8.18],"Evade Chance":[3.65],"Resist Chance":[5.63],"Proficiency":[0,7.5],"_Crushing":[2.96],"_Elemental":[0,23.61],"Agility":[4.38],"Intelligence":[5.73],"Wisdom":[5.73]},
	"Cotton Pants" : {"Attack Accuracy":[5.04],"Casting Speed":[0,3.77],"Magic Accuracy":[4.62],"Mana Conservation":[0,3.91],"Physical Mitigation":[4.85,7.39],"Magical Mitigation":[4.64,9.95],"Evade Chance":[4.4],"Resist Chance":[6.68],"Proficiency":[0,9.09],"_Crushing":[3.58],"_Elemental":[0,28.61],"Agility":[5.28],"Intelligence":[6.93],"Wisdom":[6.93]},
	"Cotton Shoes" : {"Attack Accuracy":[3.83],"Casting Speed":[0,2.89],"Magic Accuracy":[3.49],"Mana Conservation":[0,3.11],"Physical Mitigation":[3.59,5.44],"Magical Mitigation":[3.44,7.3],"Evade Chance":[3.28],"Resist Chance":[5.07],"Proficiency":[0,6.7],"_Crushing":[2.65],"_Elemental":[0,21.11],"Agility":[3.93],"Intelligence":[5.13],"Wisdom":[5.13]},

	"Shade Helmet" : {"Attack Damage":[11.25],"Attack Speed":[0,3.69],"Attack Accuracy":[6.78],"Attack Crit Chance":[0,2.75],"Attack Crit Damage":[0,3.12],"Magic Accuracy":[0,7.01],"Physical Mitigation":[6.97],"Magical Mitigation":[5.26],"Evade Chance":[4.42,6.67],"Resist Chance":[14.21,21.44],"Interference":[8.4,2.1],"_Crushing":[5.99],"_Slashing":[5.92],"_Elemental":[0,26.17],"Strength":[4.1],"Dexterity":[4.85],"Endurance":[4.1],"Agility":[4.85],"Intelligence":[0,3.38],"Wisdom":[0,3.38]},
	"Shade Breastplate" : {"Attack Damage":[13.3],"Attack Speed":[0,4.31],"Attack Accuracy":[7.99],"Attack Crit Chance":[0,3.27],"Attack Crit Damage":[0,3.72],"Magic Accuracy":[0,8.29],"Physical Mitigation":[8.31],"Magical Mitigation":[6.27],"Evade Chance":[5.24,7.94],"Resist Chance":[16.86,25.54],"Interference":[10.08,2.52],"_Crushing":[7.16],"_Slashing":[7.06],"_Elemental":[0,31.17],"Strength":[4.85],"Dexterity":[5.75],"Endurance":[4.85],"Agility":[5.75],"Intelligence":[0,3.98],"Wisdom":[0,3.98]},
	"Shade Gauntlets" : {"Attack Damage":[10.22],"Attack Speed":[0,3.4],"Attack Accuracy":[6.17],"Attack Crit Chance":[0,2.49],"Attack Crit Damage":[0,2.82],"Magic Accuracy":[0,6.37],"Physical Mitigation":[6.29],"Magical Mitigation":[4.76],"Evade Chance":[4.02,6.04],"Resist Chance":[12.92,19.43],"Interference":[7.56,1.89],"_Crushing":[5.42],"_Slashing":[5.35],"_Elemental":[0,23.67],"Strength":[3.74],"Dexterity":[4.4],"Endurance":[3.74],"Agility":[4.4],"Intelligence":[0,3.08],"Wisdom":[0,3.08]},
	"Shade Leggings" : {"Attack Damage":[12.27],"Attack Speed":[0,4.03],"Attack Accuracy":[7.39],"Attack Crit Chance":[0,3.01],"Attack Crit Damage":[0,3.42],"Magic Accuracy":[0,7.65],"Physical Mitigation":[7.64],"Magical Mitigation":[5.76],"Evade Chance":[4.84,7.32],"Resist Chance":[15.57,23.53],"Interference":[9.24,2.31],"_Crushing":[6.58],"_Slashing":[6.5],"_Elemental":[0,28.67],"Strength":[4.49],"Dexterity":[5.3],"Endurance":[4.49],"Agility":[5.3],"Intelligence":[0,3.68],"Wisdom":[0,3.68]},
	"Shade Boots" : {"Attack Damage":[9.2],"Attack Speed":[0,3.06],"Attack Accuracy":[5.57],"Attack Crit Chance":[0,2.22],"Attack Crit Damage":[0,2.52],"Magic Accuracy":[0,5.73],"Physical Mitigation":[5.62],"Magical Mitigation":[4.26],"Evade Chance":[3.59,5.39],"Resist Chance":[11.55,17.34],"Interference":[6.72,1.68],"_Crushing":[4.83],"_Slashing":[4.77],"_Elemental":[0,21.17],"Strength":[3.35],"Dexterity":[3.95],"Endurance":[3.35],"Agility":[3.95],"Intelligence":[0,2.78],"Wisdom":[0,2.78]},

	// Reinforced Leather Breastplate of Deflection [_Piercing]
	// Reinforced Leather Gauntlets of Dampening [_Crushing]
	// Reinforced Leather Gauntlets of Deflection [_Piercing]
	// Reinforced Leather Leggings of Deflection [_Piercing]
	// Reinforced Leather Boots of Stoneskin [_Slashing]
	"Leather Helmet" : {"Attack Speed":[0,3.69],"Physical Mitigation":[8.12,11.17],"Magical Mitigation":[6.67,11.97],"Evade Chance":[2.54],"Resist Chance":[10.59],"Burden":[3.5],"Interference":[7],"_Crushing":[7.93,14.91,11.03,18.01],"_Slashing":[7.83,14.71,10.89,17.77],"_Piercing":[3.93,10.68,6.93,13.68],"_Elemental":[0,26.17],"Strength":[4.85],"Dexterity":[4.85],"Endurance":[4.1],"Agility":[4.1]},
	"Leather Breastplate" : {"Attack Speed":[0,4.31],"Physical Mitigation":[9.7,13.35],"Magical Mitigation":[7.95,14.33],"Evade Chance":[2.99],"Resist Chance":[12.52],"Burden":[4.2],"Interference":[8.4],"_Crushing":[9.48,17.85,13.2,21.57],"_Slashing":[9.36,17.62,13.03,21.29],"_Piercing":[4.68,12.78,8.28,"16.38"],"_Elemental":[0,31.17],"Strength":[5.75],"Dexterity":[5.75],"Endurance":[4.85],"Agility":[4.85]},
	"Leather Gauntlets" : {"Attack Speed":[0,3.4],"Physical Mitigation":[7.34,10.09],"Magical Mitigation":[6.02,10.81],"Evade Chance":[2.32],"Resist Chance":[9.62],"Burden":[3.15],"Interference":[6.3],"_Crushing":[7.16,13.43,9.95,"16.22"],"_Slashing":[7.06,13.26,9.82,16.01],"_Piercing":[3.55,9.63,6.25,"12.33"],"_Elemental":[0,23.67],"Strength":[4.4],"Dexterity":[4.4],"Endurance":[3.74],"Agility":[3.74]},
	"Leather Leggings" : {"Attack Speed":[0,4.03],"Physical Mitigation":[8.92,12.28],"Magical Mitigation":[7.31,13.14],"Evade Chance":[2.77],"Resist Chance":[11.55],"Burden":[3.85],"Interference":[7.7],"_Crushing":[8.71,16.38,12.12,19.79],"_Slashing":[8.59,16.17,11.96,19.53],"_Piercing":[4.3,11.73,7.6,"15.03"],"_Elemental":[0,28.67],"Strength":[5.3],"Dexterity":[5.3],"Endurance":[4.49],"Agility":[4.49]},
	"Leather Boots" : {"Attack Speed":[0,3.06],"Physical Mitigation":[6.55,8.98],"Magical Mitigation":[5.38,9.62],"Evade Chance":[2.09],"Resist Chance":[8.66],"Burden":[2.8],"Interference":[5.6],"_Crushing":[6.38,11.96,8.86,14.44],"_Slashing":[6.3,11.81,8.75,"14.25"],"_Piercing":[3.18,8.58,5.58,10.98],"_Elemental":[0,21.17],"Strength":[3.95],"Dexterity":[3.95],"Endurance":[3.35],"Agility":[3.35]},

	"Power Helmet" : {"Attack Damage":[18.04,25.73],"Attack Accuracy":[6.15,21.02],"Attack Crit Chance":[1.43,5.68],"Attack Crit Damage":[1.36,4.36],"Physical Mitigation":[8.11,11.16],"Magical Mitigation":[6.26,11.48],"Burden":[10.5,7.91],"Interference":[17.5],"_Crushing":[4.82],"_Slashing":[7.82],"_Piercing":[7.67],"_Elemental":[0,26.13],"Strength":[7.09],"Dexterity":[6.34],"Endurance":[4.84]},
	"Power Armor" : {"Attack Damage":[21.46,30.68],"Attack Accuracy":[7.24,25.09],"Attack Crit Chance":[1.69,6.8],"Attack Crit Damage":[1.61,5.21],"Physical Mitigation":[9.69,13.34],"Magical Mitigation":[7.46,13.73],"Burden":[12.6,9.45],"Interference":[21],"_Crushing":[5.75],"_Slashing":[9.35],"_Piercing":[9.17],"_Elemental":[0,31.13],"Strength":[8.44],"Dexterity":[7.54],"Endurance":[5.74]},
	"Power Gauntlets" : {"Attack Damage":[16.33,23.25],"Attack Accuracy":[5.6,19.02],"Attack Crit Chance":[1.3,5.14],"Attack Crit Damage":[1.24,3.94],"Physical Mitigation":[7.33,10.09],"Magical Mitigation":[5.65,10.36],"Burden":[9.45,7.07],"Interference":[15.75],"_Crushing":[4.36],"_Slashing":[7.06],"_Piercing":[6.92],"_Elemental":[0,23.63],"Strength":[6.43],"Dexterity":[5.74],"Endurance":[4.39]},
	"Power Leggings" : {"Attack Damage":[19.75,28.20],"Attack Accuracy":[6.69,23.08],"Attack Crit Chance":[1.57,6.25],"Attack Crit Damage":[1.49,4.79],"Physical Mitigation":[8.91,12.27],"Magical Mitigation":[6.86,12.61],"Burden":[11.55,8.68],"Interference":[19.25],"_Crushing":[5.29],"_Slashing":[8.59],"_Piercing":[8.42],"_Elemental":[0,28.63],"Strength":[7.78],"Dexterity":[6.94],"Endurance":[5.29]},
	"Power Boots" : {"Attack Damage":[14.62,20.77],"Attack Accuracy":[5.05,16.95],"Attack Crit Chance":[1.17,4.57],"Attack Crit Damage":[1.11,3.51],"Physical Mitigation":[6.54,8.97],"Magical Mitigation":[5.05,9.23],"Burden":[8.4,6.3],"Interference":[14],"_Crushing":[3.89],"_Slashing":[6.29],"_Piercing":[6.17],"_Elemental":[0,21.13],"Strength":[5.74],"Dexterity":[5.14],"Endurance":[3.94]},

	"Plate Helmet" : {"Physical Mitigation":[10.73,14.3],"Magical Mitigation":[7.76,13.29],"Block Chance":[0,6.09],"Burden":[14,10.5],"Interference":[14],"_Crushing":[5.98,12.96],"_Slashing":[9.73,16.62],"_Piercing":[9.54,16.29],"_Elemental":[0,26.11],"Strength":[4.83],"Dexterity":[4.83],"Endurance":[6.33]},
	"Plate Cuirass" : {"Physical Mitigation":[12.83,17.12],"Magical Mitigation":[9.27,15.9],"Block Chance":[0,7.09],"Burden":[16.8,12.6],"Interference":[16.8],"_Crushing":[7.15,15.52],"_Slashing":[11.64,19.91],"_Piercing":[11.42,19.52],"_Elemental":[0,31.11],"Strength":[5.73],"Dexterity":[5.73],"Endurance":[7.53]},
	"Plate Gauntlets" : {"Physical Mitigation":[9.68,12.9],"Magical Mitigation":[7.02,12],"Block Chance":[0,5.59],"Burden":[12.6,9.45],"Interference":[12.6],"_Crushing":[5.41,11.69],"_Slashing":[8.78,14.98],"_Piercing":[8.61,14.69],"_Elemental":[0,23.61],"Strength":[4.38],"Dexterity":[4.38],"Endurance":[5.73]},
	"Plate Greaves" : {"Physical Mitigation":[11.78,15.71],"Magical Mitigation":[8.52,14.61],"Block Chance":[0,6.59],"Burden":[15.4,11.55],"Interference":[15.4],"_Crushing":[6.57,14.25],"_Slashing":[10.7,18.27],"_Piercing":[10.49,17.91],"_Elemental":[0,28.61],"Strength":[5.28],"Dexterity":[5.28],"Endurance":[6.93]},
	"Plate Sabatons" : {"Physical Mitigation":[8.63,11.49],"Magical Mitigation":[6.25,10.67],"Block Chance":[0,5.09],"Burden":[11.2,8.4],"Interference":[11.2],"_Crushing":[4.82,10.4],"_Slashing":[7.82,13.33],"_Piercing":[7.67,13.07],"_Elemental":[0,21.11],"Strength":[3.93],"Dexterity":[3.93],"Endurance":[5.13]}
}

};


$equip.parse = {

name : function(name,eq) {
	eq = eq || {info:{},data:{},node:{}};
	if(!eq.info.name) {
		eq.info.name = name;
	}

	var exec = $equip.reg.name.exec(name);
	if(exec) {
		if(!eq.info.category) {
			eq.info.category = exec[4]?"One-handed Weapon" : exec[5]?"Two-handed Weapon" : exec[6]?"Staff" : exec[7]?"Shield" : exec[8]?"Cloth Armor" : exec[9]?"Light Armor" : exec[10]?"Heavy Armor" : "Obsolete";
		}
		eq.info.quality = exec[1];
		eq.info.prefix = exec[2] || exec[3];
		eq.info.type = exec[4] || exec[5] || exec[6] || exec[7] || exec[8] || exec[9] || exec[10];
		eq.info.slot = exec[11];
		eq.info.suffix = exec[12];

	} else if(!eq.info.category) {
		eq.info.category = "Obsolete";
	}

	return eq;
},

div : function(div) {
	var eid = /equips\.set\((\d+),/.test(div.getAttribute("onmouseover")) && RegExp.$1,
		data = $equip.dynjs_equip[eid] || $equip.dynjs_eqstore[eid] || $equip.dynjs_loaded[eid];
	if(!data) {
		return {error:"no data"};
	}
	var exec = $equip.reg.html.exec(data.d);
	if(!exec) {
		return {error:"parse error"};
	}

	var eq = {
		info : {
			name : data.t,
			basename : $equip.basename[eid],
			category : exec[1],
			level : parseInt(exec[2])||0,
			tradeable : exec[3]==="Tradeable",
			soulbound : exec[3]==="Soulbound",
			cdt : exec[4]/exec[5],
			condition : parseInt(exec[4]),
			durability : parseInt(exec[5]),
			tier : parseInt(exec[6]),
			pxp1 : parseInt(exec[7]),
			pxp2 : parseInt(exec[8]),
			eid : eid,
			key : data.k
		},
		data : {
			html : data.d,
			value : $equip.eqvalue[eid]
		},
		node : {
			div : div
		}
	};
	$equip.parse.name(eq.info.basename||eq.info.name,eq);
	div.dataset.eid = eq.info.eid;
	div.dataset.key = eq.info.key;
	return eq;
},

layer : function(extended) {
	var stats_div = extended.children[0],
		exec = $equip.reg.html.exec( stats_div.children[0].outerHTML+stats_div.children[1].outerHTML );

	var eq = {
		info:{
			category : exec[1],
			level : parseInt(exec[2])||0,
			tradeable : exec[3]==="Tradeable",
			soulbound : exec[3]==="Soulbound",
			cdt : exec[4]/exec[5],
			condition : parseInt(exec[4]),
			durability : parseInt(exec[5]),
			tier : parseInt(exec[6]),
			pxp1 : parseInt(exec[7]),
			pxp2 : parseInt(exec[8]),
		},
		data:{
		},
		node:{
			stats : stats_div
		}
	};

	var name_div = extended;
	while( (name_div=name_div.previousElementSibling) ) {
		if(name_div.textContent.trim()) {
			break;
		}
	}
	eq.info.name = Array.from(name_div.firstElementChild.children).map(d=>d.textContent||" ").join("").replace(/\b(Of|The)\b/,s=>s.toLowerCase());
	$equip.parse.name(eq.info.name,eq);

	return eq;
},

pxp : function(eq) {
	function sign(x) {return Number(x > 0) - Number(x < 0);}
	function calcPXP(tier,lv1PXP) {return lv1PXP * Math.pow(1 + lv1PXP / 1000,tier - 1);}

	var tier = eq.info.tier,
		nextPXP = eq.info.pxp2,
		lv1PXP;

	if(tier === 0) {
		lv1PXP = nextPXP - 0.5;
	} else if(tier === 10) {
		lv1PXP = 100; // min pxp

	} else {
		tier++;
		var prevLv1PXP = 350,
			step = 32,
			diff, //difference
			prevDiff = nextPXP - calcPXP(tier,prevLv1PXP);
		while (Math.abs(prevDiff) >= 0.1) { //error margin
			lv1PXP = prevLv1PXP + step * sign(prevDiff);
			diff = nextPXP - calcPXP(tier,lv1PXP);
			if (Math.abs(diff) > Math.abs(prevDiff)) step /= 2;
			else {
				if (sign(diff) !== sign(prevDiff)) step /= 2;
				prevLv1PXP = lv1PXP;
				prevDiff = diff;
			}
		}
	}

	eq.info.pxp = lv1PXP;
	eq.info.round = Math.round(Math.pow((eq.info.pxp-100)/250,3)*75);
	if(eq.info.round > 100) {
		eq.info.round = 100;
	} else if(eq.info.round < 20) {
		eq.info.round = 20;
	}
},

stats : function(eq) {
	var stats = eq.stats = {},
		base = eq.base = {},
		pmax = eq.pmax = {},
		_pmax = eq.info.slot ? $equip.stats.pmax[eq.info.type+" "+eq.info.slot] : $equip.stats.pmax[eq.info.type];
	if(!_pmax) {
		//return;
		_pmax = {};
	}

	if(!eq.node.stats) {
		if(!eq.data.html) {
			console.log("NO HTML");
			return;
		}
		eq.node.stats = $element("template",null,["/"+eq.data.html]).content.firstElementChild;
	}

	var _offset = {};
	if($equip.stats.prefix[eq.info.prefix]) {
		$equip.stats.prefix[eq.info.prefix].forEach(function(e){
			if(!_offset[e]) {
				_offset[e] = 0;
			}
			_offset[e]++;
		});
	}
	if($equip.stats.suffix[eq.info.suffix]) {
		$equip.stats.suffix[eq.info.suffix].forEach(function(e){
			if(!_offset[e]) {
				_offset[e] = 0;
			}
			_offset[e]++;
		});
	}

	if(eq.info.prefix === "Reinforced" && (eq.info.type==="Leather"||eq.info.type==="Kite Shield")) {
		$equip.stats.prefix[eq.info.prefix].forEach(function(e){
			_offset[e]++;
		});
	}
	if(eq.info.category === "Staff") {
		var _type = ({"Redwood Staff":"AAAACC","Katalox Staff":"CCCCAA","Oak Staff":"BBCCAC","Willow Staff":"CCBBCA"})[eq.info.type];
		["Fire","Cold","Elec","Wind","Holy","Dark"].forEach(function(e,i){
			_pmax[e] = _pmax["Spell Damage "+_type[i]];
		});
		if( ({"Surtr":"Fire","Niflheim":"Cold","Mjolnir":"Elec","Freyr":"Wind","Heimdall":"Holy","Fenrir":"Dark"})[eq.info.suffix] ) {
			$equip.stats.suffix[eq.info.suffix].forEach(function(e){
				_offset[e]++;
			});
		}
	}
	if(eq.info.prefix) {
		var _prefix;
		if( (_prefix=({"Ruby":"_Fire","Cobalt":"_Cold","Amber":"_Elec","Jade":"_Wind","Zircon":"_Holy","Onyx":"_Dark"})[eq.info.prefix]) ) {
			_pmax[_prefix] = _pmax["_Elemental"];
		} else if( eq.info.category!=="Staff" && (_prefix=({"Fiery":"Fire","Arctic":"Cold","Shocking":"Elec","Tempestuous":"Wind","Hallowed":"Holy","Demonic":"Dark"})[eq.info.prefix]) ) {
			_pmax[_prefix] = _pmax["Spell Damage"];
		}
	}
	if(eq.info.suffix) {
		var _suffix;
		if( eq.info.type==="Phase" && (_suffix=({"Surtr":"Fire","Niflheim":"Cold","Mjolnir":"Elec","Freyr":"Wind","Heimdall":"Holy","Fenrir":"Dark"})[eq.info.suffix]) ) {
			_pmax[_suffix] = _pmax["Spell Damage"];
		} else if( eq.info.type==="Cotton" && (_suffix=({"the Elementalist":"Elemental","the Heaven-sent":"Divine","the Demon-fiend":"Forbidden","the Earth-walker":"Supportive","the Curse-weaver":"Deprecating"})[eq.info.suffix]) ) {
			_pmax[_suffix] = _pmax["Proficiency"];
		}
	}

	var level = eq.info.level || _player.level;
	Array.from(eq.node.stats.children).forEach(function(child){
		if(child.classList.contains("ex")) {
			Array.from(child.children).forEach(function(target) {
				if(!target.textContent) {
					return;
				}
				var text = target.firstElementChild.textContent,
					number = parseFloat(target.children[1].firstElementChild.textContent),
					scale = $equip.stats.scale[text];
				stats[text] = number;
				base[text] = scale ? number / (1 + level/scale) : number;
				pmax[text] = _pmax[text] ? _pmax[text][_offset[text]||0] : null;
			});

		} else if(child.classList.contains("ep")) {
			var type = child.firstElementChild.textContent,
				p = type==="Damage Mitigations"?"_":"";

			var scale = $equip.stats.scale[type];
			Array.from(child.children).forEach(function(target,i){
				if(!i) {
					return;
				}
				var text = p + target.firstChild.nodeValue.slice(0,-2),
					number = parseFloat(target.firstElementChild.textContent);
				stats[text] = number;
				base[text] = scale ? number / (1 + level/scale) : number;
				pmax[text] = _pmax[text] ? _pmax[text][_offset[text]||0] : null;
			});

		} else if(/\+(\d+) (.+) Damage/.test(child.textContent)) {
			var text = "Attack Damage",
				number = parseFloat(RegExp.$1),
				scale = $equip.stats.scale[text];
			stats[text] = number;
			base[text] = number / (1 + level/scale);
			pmax[text] = _pmax[text] ? _pmax[text][_offset[text]||0] : null;
		}
	});

	["Strength","Dexterity","Endurance","Agility","Intelligence","Wisdom"].forEach(function(pa){
		if(pmax[pa] || !_pmax[pa]) {
			return;
		}
		var base = _pmax[pa][_offset[pa]||0];
		if(!base) {
			return;
		}
		pmax[pa] = base;
	});
},

percentile : function(eq) {
	if(!eq.base) {
		$equip.parse.stats(eq);
	}
	if(!eq.percentile) {
		eq.percentile = {};
	}

	$equip.parse.percentile_config.forEach(function(config){
		if(!config[1].test(eq.info.name.toLowerCase())) {
			return;
		}
		var base,
			pmax,
			base_sum = 0,
			pmax_sum = 0;
		for(let s in config[2]) {
			base = eq.base[s] || 0;
			pmax = eq.pmax[s] || 0;
			base_sum += base * config[2][s];
			pmax_sum += pmax * config[2][s];
		}
		eq.percentile[config[0]] = base_sum/pmax_sum;
	});
},

percentile_config : [
	//["Holy/Oak", /hallowed.+oak.+heimdall/, {"Magic Damage":1, "Holy":0.933, "Divine":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	["Holy/Oak/R", /hallowed.+oak.+heimdall/, {"Magic Damage":1, "Holy":1.030, "Divine":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	//["Holy/Oak/1C", /hallowed.+oak.+heimdall/, {"Magic Damage":1, "Holy":0.871, "Divine":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	//["Holy/Oak/1C/R", /hallowed.+oak.+heimdall/, {"Magic Damage":1, "Holy":0.977, "Divine":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	//["Dark/Willow", /demonic.+willow.+destruction/, {"Magic Damage":1, "Dark":1.269, "Forbidden":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	["Dark/Willow/R", /demonic.+willow.+destruction/, {"Magic Damage":1, "Dark":1.380, "Forbidden":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	//["Dark/Willow/1C", /demonic.+willow.+destruction/, {"Magic Damage":1, "Dark":1.170, "Forbidden":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	//["Dark/Willow/1C/R", /demonic.+willow.+destruction/, {"Magic Damage":1, "Dark":1.292, "Forbidden":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	["Holy/Katalox/R", /hallowed.+katalox.+(destruction|heaven-sent|heimdall)/, {"Magic Damage":1, "Holy":1.233, "Divine":0, "Intelligence":0.5, "Wisdom":0.3}],
	["Dark/Katalox/R", /demonic.+katalox.+(destruction|demon-fiend|fenrir)/, {"Magic Damage":1, "Dark":1.233, "Forbidden":0, "Intelligence":0.5, "Wisdom":0.3}],

	["Wind/Willow", /tempestuous.+willow.+destruction/, {"Magic Damage":1, "Wind":1.189, "Elemental":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	["Elec/Willow", /shocking.+willow.+destruction/, {"Magic Damage":1, "Elec":1.189, "Elemental":0, "Intelligence":0.5, "Wisdom":0.3, "Counter-Resist":0.4}],
	["Cold/Redwood", /arctic.+redwood.+(destruction|elementalist|niflheim)/, {"Magic Damage":1, "Cold":1.160, "Elemental":0, "Intelligence":0.5, "Wisdom":0.3}],
	["Fire/Redwood", /fiery.+redwood.+(destruction|elementalist|surtr)/, {"Magic Damage":1, "Fire":1.160, "Elemental":0, "Intelligence":0.5, "Wisdom":0.3}],

	["Phase", /phase.+heimdall/, {"Magic Damage":0.843, "Holy":0.933, "Intelligence":0.5, "Wisdom":0.3}], // Oak
	["Phase", /phase.+fenrir/, {"Magic Damage":0.843, "Dark":1.269, "Intelligence":0.5, "Wisdom":0.3}], // Willow
	["Phase", /phase.+freyr/, {"Magic Damage":0.843, "Wind":1.189, "Intelligence":0.5, "Wisdom":0.3}], // Willow
	["Phase", /phase.+mjolnir/, {"Magic Damage":0.843, "Elec":1.189, "Intelligence":0.5, "Wisdom":0.3}], // Willow
	["Phase", /phase.+niflheim/, {"Magic Damage":0.843, "Cold":1.160, "Intelligence":0.5, "Wisdom":0.3}], // Redwood
	["Phase", /phase.+surtr/, {"Magic Damage":0.843, "Fire":1.160, "Intelligence":0.5, "Wisdom":0.3}], // Redwood

	["Radiant", /radiant.+phase.+heimdall/, {"Magic Damage":0.843, "Holy":1.030, "Intelligence":0.5, "Wisdom":0.3}],
	["Radiant", /radiant.+phase.+fenrir/, {"Magic Damage":0.843, "Dark":1.380, "Intelligence":0.5, "Wisdom":0.3}],
	["Radiant", /radiant.+phase.+freyr/, {"Magic Damage":0.843, "Wind":1.323, "Intelligence":0.5, "Wisdom":0.3}],
	["Radiant", /radiant.+phase.+mjolnir/, {"Magic Damage":0.843, "Elec":1.323, "Intelligence":0.5, "Wisdom":0.3}],
	["Radiant", /radiant.+phase.+niflheim/, {"Magic Damage":0.843, "Cold":1.290, "Intelligence":0.5, "Wisdom":0.3}],
	["Radiant", /radiant.+phase.+surtr/, {"Magic Damage":0.843, "Fire":1.290, "Intelligence":0.5, "Wisdom":0.3}],
],

};

$equip.list = function(node,sort,append) {

if(!node) {
	return;
}

var list = Array.from($qsa("div[onmouseover*='equips.set']",node)).map(function(div){
	var eq = $equip.parse.div(div);
	eq.node.wrapper = div.parentNode;

	if(eq.info.basename && eq.info.basename!==eq.info.name) {
		div.classList.add("hvut-eq-name");
		div.addEventListener("mouseenter",function(){div.textContent=eq.info.basename;});
		div.addEventListener("mouseleave",function(){div.textContent=eq.info.name;});
	}
	div.classList.add("hvut-eq-"+eq.info.quality);

	return eq;
});

if(settings.equipSort && sort) {

	list.sort(function(a,b){
		var sorter = $equip.sort;
		if(a.info.category !== b.info.category) {
			return sorter.category[a.info.category] - sorter.category[b.info.category];
		} else if(a.info.category === "Obsolete") {
			return a.info.name>b.info.name?1 : a.info.name<b.info.name?-1 : 0;
		} else if(a.info.type !== b.info.type) {
			return (sorter.type[a.info.type]||99) - (sorter.type[b.info.type]||99);
		}

		var sortkey =
			(a.info.category==="One-handed Weapon" || a.info.category==="Two-handed Weapon") ? ["suffix","quality","prefix"] :
			a.info.category==="Staff" ? ["prefix","suffix","quality"] :
			a.info.category==="Shield" ? ["quality","suffix","prefix"] :
			//a.info.type==="Phase" ? ["suffix","slot","quality","prefix"] :
			//a.info.type==="Cotton" ? ["suffix","slot","quality","prefix"] :
			//					["slot","quality","suffix","prefix"];
								["suffix","slot","quality","prefix"];

		var r = 0;
		sortkey.some(function(e){
			if(sorter.hasOwnProperty(e)) {
				r = (sorter[e][a.info[e]]||99) - (sorter[e][b.info[e]]||99);
			} else {
				r = a.info[e]>b.info[e]?1 : a.info[e]<b.info[e]?-1 : 0;
			}

			if(r) {
				return true;
			} else {
				return false;
			}
		});

		return r || (b.info.eid-a.info.eid);
	});

	var frag = $element();
	list.forEach(function(e,i,a){
		var p = a[i-1] || {info:{}};
		if(e.info.category !== p.info.category && sort === 2) {
			$element("h4",frag,[" "+e.info.category,".hvut-eq-category"]);
		}

		switch(e.info.category) {

		case "Obsolete":
			break;

		case "One-handed Weapon":
		case "Two-handed Weapon":
			if(e.info.type !== p.info.type) {
				$element("h5",frag,[" "+(e.info.type||"??"),".hvut-eq-h5"]);
			} else if(e.info.suffix !== p.info.suffix) {
				e.node.wrapper.classList.add("hvut-eq-border");
			}
			break;

		case "Staff":
			if(e.info.type !== p.info.type) {
				$element("h5",frag,[" "+(e.info.type||"??"),".hvut-eq-h5"]);
			} else if(e.info.prefix !== p.info.prefix) {
				e.node.wrapper.classList.add("hvut-eq-border");
			}
			break;

		case "Shield":
			if(e.info.type !== p.info.type) {
				$element("h5",frag,[" "+(e.info.type||"??"),".hvut-eq-h5"]);
			}
			break;

		default: // armors
			if(e.info.type!==p.info.type || e.info.suffix!==p.info.suffix) {
				$element("h5",frag,[" "+(e.info.suffix||"??"),".hvut-eq-h5"]);
			} else if(e.info.slot !== p.info.slot) {
				e.node.wrapper.classList.add("hvut-eq-border");
			}

		}

		frag.appendChild(e.node.wrapper);
	});

	if(!append) {
		append = node;
		if(!append.classList.contains("equiplist")) {
			append = $qs(".equiplist",append);
		}
	}
	append.innerHTML = "";
	append.appendChild(frag);
}

return list;

};

$equip.bbcode = function(eq) {
	function rainbow(text) {
		var c = ["#f00","#f90","#fc0","#0c0","#09f","#00c","#c0f"], l = c.length;
		return text.split("").map((t,i)=>"[color="+c[i%l]+"]"+t+"[/color]").join("");
	}

	var all = {},
		quality = {code:eq.info.quality},
		prefix = {code:eq.info.prefix},
		type = {code:eq.info.type},
		slot = {code:eq.info.slot},
		suffix = {code:eq.info.suffix},
		color1 = "#f00",
		color2 = "#f90";

	switch(eq.info.category) {

	case "One-handed Weapon":
		if(eq.info.type==="Rapier" && eq.info.suffix==="Slaughter") {
			prefix.color = ({"Ethereal":color1,"Hallowed":color1,"Demonic":color1})[eq.info.prefix];
			type.bold = true;
			suffix.bold = true;
		} else if((eq.info.type==="Rapier" || eq.info.type==="Wakizashi") && (eq.info.suffix==="the Nimble" || eq.info.suffix==="Balance")) {
			prefix.color = ({"Ethereal":color1,"Hallowed":color1,"Demonic":color1})[eq.info.prefix];
			type.bold = true;
		} else if((eq.info.type==="Club" || eq.info.type==="Axe") && eq.info.suffix==="Slaughter") {
			prefix.color = ({"Ethereal":color1})[eq.info.prefix];
			type.bold = true;
			suffix.bold = true;
		}
		break;

	case "Two-handed Weapon":
		if(eq.info.suffix==="Slaughter") {
			prefix.color = ({"Ethereal":color1})[eq.info.prefix];
			type.bold = true;
			suffix.bold = true;
		}
		break;

	case "Staff":

		switch(eq.info.type) {

		case "Oak Staff":
			if(eq.info.prefix==="Hallowed" && eq.info.suffix==="Heimdall") {
				prefix.bold = true;
				type.bold = true;
				suffix.bold = true;
			}
			break;

		case "Willow Staff":
			if(["Shocking","Tempestuous","Demonic"].includes(eq.info.prefix) && eq.info.suffix==="Destruction") {
				prefix.bold = true;
				type.bold = true;
				suffix.bold = true;
			}
			break;

		case "Katalox Staff": {
			let _prefix = ({"Hallowed":5,"Demonic":6})[eq.info.prefix],
				_suffix = ({"Destruction":-1,"Heimdall":5,"Fenrir":6,"the Heaven-sent":8,"the Demon-fiend":9})[eq.info.suffix];
			if(_prefix && _suffix) {
				if(_suffix === -1) {
					prefix.bold = true;
					type.bold = true;
					suffix.bold = true;
				} else if(_suffix === _prefix) {
					prefix.bold = true;
					type.bold = true;
				} else if(_suffix === _prefix+3) {
					prefix.bold = true;
					type.bold = true;
				}
			}
			break;
		}
		case "Redwood Staff": {
			let _prefix = ({"Fiery":1,"Arctic":2,"Shocking":3,"Tempestuous":4})[eq.info.prefix],
				_suffix = ({"Destruction":-1,"Surtr":1,"Niflheim":2,"Mjolnir":3,"Freyr":4,"the Elementalist":7})[eq.info.suffix];
			if(_prefix && _suffix) {
				if(_suffix === -1) {
					prefix.bold = true;
					type.bold = true;
					suffix.bold = true;
				} else if(_suffix === _prefix) {
					prefix.bold = true;
					type.bold = true;
				} else if(_suffix === 7) {
					prefix.bold = true;
					type.bold = true;
				}
			}
			break;
		}

		}

		break;

	case "Shield":
		if(eq.info.type === "Force Shield") {
			type.bold = true;
			suffix.bold = ["Protection","Dampening","Deflection"].includes(eq.info.suffix);
		} else if(eq.info.type==="Buckler" && ["the Barrier","the Battlecaster"].includes(eq.info.suffix)) {
			prefix.color = ({"Reinforced":color1})[eq.info.prefix];
			type.bold = true;
			suffix.bold = true;
		}
		break;

	case "Cloth Armor":
		if(eq.info.type === "Phase") {
			prefix.color = ({"Radiant":color1,"Charged":color1,"Mystic":color2,"Frugal":color2})[eq.info.prefix];
			type.bold = true;
		} else if(eq.info.type === "Cotton" && ["the Elementalist","the Heaven-sent","the Demon-fiend"].includes(eq.info.suffix)) {
			prefix.color = ({"Charged":color1,"Frugal":color2})[eq.info.prefix];
			suffix.bold = true;
		}
		break;

	case "Light Armor":
		if(eq.info.type === "Shade") {
			prefix.color = ({"Savage":color1,"Agile":color2})[eq.info.prefix];
			type.bold = true;
			suffix.bold = eq.info.suffix === "the Shadowdancer";
		} else if(eq.info.type === "Leather") {
			prefix.color = ({"Reinforced":color1})[eq.info.prefix];
		}
		break;

	case "Heavy Armor":
		if(eq.info.type === "Power") {
			prefix.color = ({"Savage":color1})[eq.info.prefix];
			type.bold = true;
			suffix.bold = eq.info.suffix === "Slaughter";
		} else if(eq.info.type==="Plate") {
			prefix.color = ({"Shielding":color1})[eq.info.prefix];
			suffix.bold = eq.info.suffix === "Protection";
		}
		break;

	default:
		all.code = eq.info.name;

	}

	if(eq.info.quality === "Peerless") {quality.code = rainbow(quality.code);quality.bold = true;}
	else if(eq.info.quality === "Legendary") {quality.bold = true;}

	if(quality.color) {quality.code = "[color="+quality.color+"]"+quality.code+"[/color]";}
	if(quality.bold) {quality.code = "[b]"+quality.code+"[/b]";}

	if(prefix.color) {prefix.code = "[color="+prefix.color+"]"+prefix.code+"[/color]";}
	if(prefix.bold) {prefix.code = "[b]"+prefix.code+"[/b]";}

	if(type.color) {type.code = "[color="+type.color+"]"+type.code+"[/color]";}
	if(type.bold) {type.code = "[b]"+type.code+"[/b]";}

	if(slot.color) {slot.code = "[color="+slot.color+"]"+slot.code+"[/color]";}
	if(slot.bold) {slot.code = "[b]"+slot.code+"[/b]";}

	if(suffix.color) {suffix.code = "[color="+suffix.color+"]"+suffix.code+"[/color]";}
	if(suffix.bold) {suffix.code = "[b]"+suffix.code+"[/b]";}

	all.code = all.code || quality.code + (prefix.code?" "+prefix.code:"") + " " + type.code + (slot.code?" "+slot.code:"") + (suffix.code?" of "+suffix.code:"");

	if(all.color) {all.code = "[color="+all.color+"]"+all.code+"[/color]";}
	if(all.bold) {all.code = "[b]"+all.code+"[/b]";}

	return all.code;
};
/***** [MODULE] Equip Parser *****/


/***** Item Price *****/
var $prices = {
	json : null,
	desc : {
		"WTS": " price is used for calculating the CoD when sending through [MoogleMail]",
		"WTB": " price is used for calculating the CoD on [MoogleMail] that you receive",
		"Salvage": " price is used for calculating what salvaging in [Equipment Shop] is worth",
		"Upgrade": " price is used for calculating the total cost of upgrading equipment in [Upgrade]",
	},
	init : function() {
		if($prices.json) {
			return;
		}
		$prices.json = getValue("prices") || JSON.parse(JSON.stringify(settings.itemPrice));
	},
	get : function(tag) {
		$prices.init();
		return $prices.json[tag] || {};
	},
	set : function(tag,json) {
		$prices.init();
		$prices.json[tag] = json;
		setValue("prices",$prices.json);
	},
	reset : function() {
		deleteValue("prices");
		$prices.json = null;
		$prices.init();
	},
	str2json : function(str) {
		var json = {};
		str.split("\n").some(function(s,i){
			s = s.trim();
			if(!s || s.startsWith("//")) {
				return;
			}
			if(/^(.+?)\s*@\s*(\d+)$/.exec(s)) {
				json[RegExp.$1] = parseInt(RegExp.$2);
			} else {
				json["//ERROR"] = "#"+(i+1)+": "+s;
				return true;
			}
		});
		return json;
	},
	json2str : function(tag) {
		var json = $prices.get(tag),
			a = [];
		a.push("// ["+tag+"]"+($prices.desc[tag]||"")+"\n");
		for(let i in json) {
			a.push(i+" @ "+json[i]);
		}
		return a.join("\n");
	}
};
/***** Item Price *****/


// Player Data
var _player = {
	stamina : /Stamina: (\d+)/.test($id("stamina_readout").textContent) && parseInt(RegExp.$1),
	dfct : /^(.+) Lv\.(\d+)/.test($id("level_readout").textContent.trim()) && RegExp.$1,
	level : parseInt(RegExp.$2),
	repair : $id("stamina_restore").textContent.includes("Repair "),
};

if(isNaN(_player.level)) { // check font settings
	alert("To use HVUT, You need to set [Custom Font].");
	if(_query.ss === "se") {
		scrollIntoView($id("settings_cfont").parentNode,$id("settings_outer"));

		_se.form = $qs("#settings_outer form");
		_se.form.fontlocal.required = true;
		_se.form.fontface.required = true;
		_se.form.fontsize.required = true;
		_se.form.fontface.placeholder = "Tahoma, Arial";
		_se.form.fontsize.placeholder = "10";
		_se.form.fontoff.placeholder = "0";

	} else {
		location.href = "/?s=Character&ss=se";
	}
	return;
}


// Basic CSS
GM_addStyle(`
	#mainpane {width:auto}
	.csps {visibility:hidden}
	.cspp {overflow-y:auto}
	.fc2, .fc4 {display:inline}
	.hvut-none {display:none}
	.hvut-hide-on .hvut-hide {display:none}

	.eqp > div:last-child {line-height:18px; padding:2px 4px}
	.equiplist {color:#000; font-weight:normal}
	.equiplist > div {margin:3px 5px}
	.hvut-eq-name::before {content:'[ '}
	.hvut-eq-name::after {content:' ]'}

	.hvut-it-Consumable {color:#00B000}
	.hvut-it-Artifact {color:#0000FF}
	.hvut-it-Trophy {color:#461B7E}
	.hvut-it-Token {color:#254117}
	.hvut-it-Crystal {color:#BA05B4}
	.hvut-it-Monster_Food {color:#489EFF}
	.hvut-it-Material {color:#f00}
	.hvut-it-Collectable {color:#0000FF}
`);

if(settings.equipColor) {
	GM_addStyle(`
		.eqp > div:last-child:not([onclick]) {color:#966}
		.hvut-eq-Exquisite {background-color:#ce9}
		.hvut-eq-Magnificent {background-color:#bdf}
		.hvut-eq-Legendary {background-color:#fd8}
		.hvut-eq-Peerless {background-color:#fbb; box-shadow:0 0 0 1px #930 inset; font-weight:bold}
	`);
}

if(settings.equipSort) {
	GM_addStyle(`
		.hvut-eq-category {margin:10px 0 5px; padding:2px 5px; border:1px solid #333; background-color:#333; color:#fff; font-size:11pt; text-align:left}
		.hvut-eq-h5 {margin:10px 5px 5px; padding:2px 5px; border:1px solid #333; color:#000; font-size:10pt}
		.hvut-eq-border {margin-top:3px !important; padding-top:3px; border-top:2px dotted #333}
		.hvut-eq-h5 + .hvut-eq-border {border-top:none}
		.hvut-eq-border > div {margin-top:3px}
	`);
}

if($id("stats_pane")) {
	GM_addStyle(`
		#stats_header, #eqch_stats .csps {display:none}
		#stats_pane {height:650px !important; white-space:nowrap}
		.stats_page .spc {width:auto; padding:10px 0 0 10px}
		.stats_page .spc > .fal > div {font-weight:bold}
		.stats_page .far {color:#c00}
		.stats_page .st2 > div:nth-child(2n) {width:100px}
		.hvut-stats #eqch_left {width:660px}
		.hvut-stats #eqch_stats {width:560px}
		.hvut-stats #stats_pane {overflow:hidden !important}
		.hvut-stats .stats_page {float:left; height:100%}
		.hvut-stats .stats_page:nth-of-type(1) {width:250px; border-right:1px dotted}
		.hvut-stats .stats_page:nth-of-type(2) {width:300px; margin-left:3px}
		.hvut-stats .st1 > div:nth-child(2n+1) {width:45px; padding-left:5px; clear:left}
		.hvut-stats .st1 > div:nth-child(2n) {width:200px}
		.hvut-stats .st2 > div:nth-child(2n+1) {width:45px; padding-left:5px}
		.hvut-stats .st2 > div:nth-child(2n) {width:100px}
		.hvut-stats .st3 > div:nth-child(2n+1) {width:45px; padding-left:5px}
		.hvut-stats .st3 > div:nth-child(2n) {width:200px}
	`);

	_ch.expand = function() {
		$id("eqch_outer").classList.toggle("hvut-stats");
		if(_ch.expand.inited) {
			return;
		}
		_ch.expand.inited = true;
		$qsa("#stats_pane > div:first-of-type > div:nth-last-of-type(-n+2)").forEach(function(d,i){var p=$qs("#stats_pane > div:last-of-type");p.insertBefore(d,p.children[i]);});
	};

	$element("input",$id("stats_pane"),{type:"button",value:"Expand",style:"position:absolute;top:10px;right:20px"},_ch.expand);
	if(settings.characterExpandStatsByDefault) {
		_ch.expand();
	}
}


// Equipment Key Functions
if(settings.equipmentKeyFunctions) {
	document.addEventListener("keydown",function(e){
		if(e.target.nodeName==="INPUT" || e.target.nodeName==="TEXTAREA") {
			return;
		}
		var eq_div = $qs("div[data-eid]:hover");
		if(eq_div) {
			if(e.which === 81) { // Q
				GM_setClipboard("[url="+location.origin+"/equip/"+eq_div.dataset.eid+"/"+eq_div.dataset.key+"]"+eq_div.textContent+"[/url]","text");
			} else if(e.which === 76) { // L
				prompt("Forum Link:","[url="+location.origin+"/equip/"+eq_div.dataset.eid+"/"+eq_div.dataset.key+"]"+eq_div.textContent+"[/url]");
			} else if(e.which === 86) { // V
				window.open("/equip/"+eq_div.dataset.eid+"/"+eq_div.dataset.key,"_blank");
			}
		}
	});
}


/***** Top Menu *****/
GM_addStyle(`
	#navbar {display:none}

	#hvut-top {display:flex; justify-content:${settings.topMenuAlign}; position:relative; height:22px; padding:2px 0; border-bottom:1px solid #5C0D11; font-size:10pt; line-height:22px; font-weight:bold; z-index:10; white-space:nowrap; cursor:default}
	#hvut-top > div {position:relative; height:22px; margin:0 5px}
	#hvut-top a {text-decoration:none}

	.hvut-top-warn {background-color:#fd9}
	.hvut-top-warn2 {background-color:#f96}
	.hvut-top-warn-button > span {color:#e00}

	.hvut-top-sub {display:none; position:absolute; top:22px; left:0; width:max-content; width:-moz-max-content; padding:3px; border-style:solid; border-width:0 1px 1px; background-color:#EDEBDF; opacity:0.95}
	#hvut-top div:hover > .hvut-top-sub {display:block}
	.hvut-top-sub select {display:block}
	.hvut-top-sub option {margin:0; border:0}

	.hvut-menu > div {float:left; position:relative; margin:0 5px}
	.hvut-menu span {font-family:Arial; font-size:13pt; color:#930}
	.hvut-menu ul {float:left; margin:0 2px; padding:0; list-style:none; text-align:left; line-height:18px}
	.hvut-menu a {display:block; margin:5px 0; padding:0 5px}
	.hvut-menu a:hover {background-color:#fff}
	.hvut-menu-s {padding:0 5px; font-weight:normal; background-color:#630; color:#fff}

	.hvut-quick {margin:0 15px !important}
	.hvut-quick > a {display:inline-block; position:relative; margin:0 1px; width:28px; font-family:Arial; font-size:12pt; border-radius:2px}
	.hvut-quick > a:hover {background-color:#fff}
	.hvut-quick > a::after {content:attr(data-text); display:none; position:absolute; top:100%; left:0; margin-top:2px; margin-left:0; line-height:1.6em; padding:1px 4px; background-color:#fff; color:#930; border:1px solid; font-size:10pt; font-weight:normal}
	.hvut-quick > a:hover::after {display:block}
`);

_top.menu = {
	"Character" : {s:"Character",ss:"ch"},
	"Equipment" : {s:"Character",ss:"eq"},
	"Abilities" : {s:"Character",ss:"ab"},
	"Training" : {s:"Character",ss:"tr"},
	"Item Inventory" : {s:"Character",ss:"it"},
	"Equip Inventory" : {s:"Character",ss:"in"},
	"Settings" : {s:"Character",ss:"se"},

	"Equipment Shop" : {s:"Bazaar",ss:"es"},
	"Item Shop" : {s:"Bazaar",ss:"is"},
	"Item Shop Bot" : {s:"Bazaar",ss:"ib"},
	"Monster Lab" : {s:"Bazaar",ss:"ml"},
	"The Shrine" : {s:"Bazaar",ss:"ss"},
	"MoogleMail" : {s:"Bazaar",ss:"mm"},
	"Weapon Lottery" : {s:"Bazaar",ss:"lt"},
	"Armor Lottery" : {s:"Bazaar",ss:"la"},

	"The Arena" : {s:"Battle",ss:"ar"},
	"Ring of Blood" : {s:"Battle",ss:"rb"},
	"GrindFest" : {s:"Battle",ss:"gr"},
	"Item World" : {s:"Battle",ss:"iw"},

	"Repair" : {s:"Forge",ss:"re"},
	"Upgrade" : {s:"Forge",ss:"up"},
	"Enchant" : {s:"Forge",ss:"en"},
	"Salvage" : {s:"Forge",ss:"sa"},
	"Reforge" : {s:"Forge",ss:"fo"},
	"Soulfuse" : {s:"Forge",ss:"fu"},
};

_top.init = function() {
	if(_top.inited) {
		return;
	}
	_top.inited = true;

	var menu_ul = {};
	if(settings.topMenuIntegrate) {
		let sub = $element("div",_top.node.menu_div["MENU"],[".hvut-top-sub"]);
		["Character","Bazaar","Battle","Forge"].forEach(function(m){
			menu_ul[m] = $element("ul",sub);
			$element("li",menu_ul[m],[" "+m,".hvut-menu-s"]);
		});
	} else {
		["Character","Bazaar","Battle","Forge"].forEach(function(m){
			let sub = $element("div",_top.node.menu_div[m],[".hvut-top-sub"]);
			menu_ul[m] = $element("ul",sub);
		});
	}
	for(let i in _top.menu) {
		let j = _top.menu[i];
		$element("a", $element("li",menu_ul[j.s]), {textContent:i,href:"/?s="+j.s+"&ss="+j.ss});
	}
	/* monsterbation */
	if($id("mbsettings")) {
		$element("li",menu_ul["Character"]).appendChild($id("mbsettings"));
		GM_addStyle(`
			#mbsettings {position:relative}
			#mbslink {padding:0 5px; font-size:inherit}
			#mbprofile {top:100%; left:0; min-width:100%; box-sizing:border-box; font-weight:normal}
		`);
	}
	/* monsterbation */

	if(_player.stamina < 85) {
		let sub = $element("div",_top.node.stamina,[".hvut-top-sub"]);
		$element("form",sub,{method:"POST"},{submit:function(e){if(settings.confirmStaminaRestorative&&!confirm("Are you sure you want to use a Caffeinated Candy or Energy Drink?")){e.preventDefault();}}}).append(
			$element("input",null,{type:"hidden",name:"recover",value:"stamina"}),
			$element("input",null,{type:"submit",value:"USE RESTORATIVE",style:"font-size:10pt;font-weight:bold;height:auto;padding:3px 15px"})
		);
		_top.node.stamina.addEventListener("mouseenter",function init(){
			if(init.inited) {
				return;
			}
			init.inited = true;
			let span = $element("div",sub,"Loading...");
			let inventory = {};
			$ajax.send("GET","/?s=Character&ss=it",null,function(r){
				Array.from( substring(r.responseText,'<table class="nosel itemlist">',["</table>",true],true).firstElementChild.rows ).forEach(function(tr){
					inventory[ tr.cells[0].textContent.trim() ] = parseInt(tr.cells[1].textContent);
				});
				if( ["Caffeinated Candy","Energy Drink"].reduce((p,c)=>{var n=inventory[c]||0;if(n){$element("div",sub,c+" ("+n+")");}return p+n;},0) ) {
					span.remove();
				} else {
					span.textContent = "No items available";
				}
			});
		});
	}

	if(_player.level !== 500) {
		let exp = {};
		exp.exec = /([0-9,]+) \/ ([0-9,]+)\s*Next: ([0-9,]+)/.exec($id("level_details").textContent);
		exp.now = parseInt(exp.exec[1].replace(/,/g,""));
		exp.up = parseInt(exp.exec[2].replace(/,/g,""));
		exp.next = parseInt(exp.exec[3].replace(/,/g,""));
		exp.bottom = Math.round(Math.pow(_player.level+3, Math.pow(2.850263212287058, (1+_player.level/1000))));
		exp.level_up = exp.up - exp.bottom;
		exp.level_now = exp.now - exp.bottom;
		exp.p = Math.floor(exp.level_now/exp.level_up*100);

		let sub = $element("div",_top.node.level,[".hvut-top-sub"]);
		$element("div",sub,"Total: "+exp.now.toLocaleString()+" / "+exp.up.toLocaleString());
		$element("div",sub,"Next: "+exp.next.toLocaleString());
		$element("div",sub,"Level: "+exp.level_now.toLocaleString()+" / "+exp.level_up.toLocaleString()+" ("+exp.p+"%)");
		$element("div",sub,["!width:299px;height:8px;margin:0 auto; border:1px solid;background-color:#ffc;background-image:linear-gradient(to right, #930 0, transparent 1px),linear-gradient(to right, #9cf, #9cf);background-position:-1px 0, 0 0;background-size:30px, "+exp.p+"%;background-repeat:repeat, no-repeat"]);
	}
};


_top.node = {};
_top.node.div = $element("div",null,["#hvut-top"],{mouseenter:_top.init});

_top.node.menu = $element("div",_top.node.div,[".hvut-menu"]);
_top.node.quick = $element("div",_top.node.div,[".hvut-quick"]);

_top.node.menu_div = {};
if(settings.topMenuIntegrate) {
	_top.node.menu_div["MENU"] = $element("div",_top.node.menu,["!width:62px","/<span>"+"MENU"+"</span>"]);
} else {
	["Character","Bazaar","Battle","Forge"].forEach(function(m){
		_top.node.menu_div[m] = $element("div",_top.node.menu,["!width:"+m.length*12+"px","/<span>"+m.toUpperCase()+"</span>"]);
	});
}

_top.mm = $id("nav_mail") && $id("nav_mail").textContent.trim();
if(_top.mm && !settings.topMenuLinks.includes("MoogleMail")) {
	settings.topMenuLinks.push("MoogleMail");
}
settings.topMenuLinks.forEach(function(m){
	var d = _top.menu[m];
	if(!d) {
		return;
	}
	var text = d.ss.toUpperCase(),
		href = "/?s="+d.s+"&ss="+d.ss;
	if(d.s==="Bazaar" && d.ss==="mm") {
		if(_top.mm) {
			text = "["+_top.mm+"]";
			GM_addStyle(`
				a[data-text=MoogleMail] {color:transparent}
				a[data-text=MoogleMail]:hover {color:#e00}
				a[data-text=MoogleMail]::before {content:""; position:absolute; top:0; left:0; width:100%; height:100%; background:url("/y/mmail/ygm.png") no-repeat center center; animation:MoogleMail 0.5s ease-in-out 10 alternate; filter:brightness(200%)}
				a[data-text=MoogleMail]:hover::before {visibility:hidden}
				@keyframes MoogleMail { from {opacity:1} to {opacity:0.3} }
			`);
		} else if(settings.topMenuWriteMM) {
			href += "&filter=new";
		}
	}
	$element("a",_top.node.quick,{textContent:text,dataset:{text:m},href:href});
});

//$element("div",_top.node.div,["!margin:0 auto"]); // spaceholder

_top.node.stamina = $element("div",_top.node.div,["!width:30px","/<span>["+_player.stamina+"]</span>"]);
_top.node.level = $element("div",_top.node.div,["!width:50px","/<span>Lv." + _player.level+"</span>"]);
_top.node.dfct = $element("div",_top.node.div,["!width:70px","/<span>"+_player.dfct+"</span>"]);
_top.node.persona = $element("div",_top.node.div,["!width:80px","/<span>Persona</span>"]);

if(_player.stamina < 10) {
	_top.node.div.classList.add("hvut-top-warn2");
	_top.node.stamina.classList.add("hvut-top-warn-button");
} else if(_player.stamina < 31) {
	_top.node.div.classList.add("hvut-top-warn");
	_top.node.stamina.classList.add("hvut-top-warn-button");
} else if(_player.stamina >= 80) {
	_top.node.stamina.firstChild.style.color = "#090";
}

if(_player.repair) {
	_top.node.div.classList.add("hvut-top-warn");
	_top.node.persona.classList.add("hvut-top-warn-button");
}

if(settings.randomEncounter) {
	_top.node.re = $element("div",_top.node.div,["!width:80px;cursor:pointer"]);
	$re.clock(_top.node.re);
}

$id("csp").insertBefore(_top.node.div,$id("mainpane"));


// Difficulty
var $dfct = {};
$dfct.list = ["Normal","Hard","Nightmare","Hell","Nintendo","IWBTH","PFUDOR"];

$dfct.hover = function(){
	if(!$dfct.sub) {
		$dfct.sub = $element("div",$dfct.div,[".hvut-top-sub"]);

		$dfct.selector = $element("select",$dfct.sub,{size:$dfct.list.length,style:"width:80px"},{change:function(){
			$dfct.selector.disabled = true;
			$dfct.change($dfct.selector.value);
		}});
		$dfct.list.forEach(function(d,i){$element("option",[$dfct.selector,0],{value:i+1,text:d,selected:d===_player.dfct});});
	}
};

$dfct.change = function(value){
	$dfct.button.textContent = "(D1...)";

	$ajax.send("GET","/?s=Character&ss=se",null,function(r){
		$dfct.button.textContent = "(D2...)";
		var doc = substring(r.responseText,"<body",["</body>",true],true),
			input = $qs("input[name='difflevel'][value='"+value+"ch']",doc);
		if(input) {
			input.checked = true;
			var post = {};
			Array.from(input.form.elements).forEach(function(e){
				if(e.disabled || (e.type==="checkbox"||e.type==="radio") && !e.checked) {
					return;
				}
				post[e.name] = e.value;
			});
			$ajax.send("POST","/?s=Character&ss=se",post,function(r){var doc=substring(r.responseText,"<body",["</body>",true],true);$dfct.set_button(doc);},function(){$dfct.button.textContent="(D:ERROR)";});

		} else {
			$dfct.button.textContent = "(D:ERROR)";
		}
	});
};

$dfct.set_button = function(doc) {
	var value = /^(.+) Lv\.(\d+)/.test($id("level_readout",doc).textContent.trim()) && RegExp.$1;
	if(!value) {
		$dfct.button.textContent = "(D:ERROR)";
		return;
	}

	_player.dfct = value;
	$dfct.button.textContent = value;
	if($dfct.selector) {
		$dfct.selector.value = $dfct.list.indexOf(value) + 1;
		$dfct.selector.disabled = false;
	}

	var ch_style = getValue("ch_style",{});
	ch_style.difficulty = value;
	setValue("ch_style",ch_style);
};

$dfct.button = _top.node.dfct.firstChild;
$dfct.div = $dfct.button.parentNode;
$dfct.div.addEventListener("mouseenter",$dfct.hover);


// Persona
var $persona = {};

$persona.check_p = function(doc) {
	var changed;
	Array.from($qs("select[name=persona_set]",doc).options).forEach(function(o){
		var pidx = parseInt(o.value);
		if(!$persona.json.plist[pidx]) {
			$persona.json.plist[pidx] = {elist:[null]};
		}
		if($persona.json.plist[pidx].name !== o.text) {
			$persona.json.plist[pidx].name = o.text;
			changed = true;
		}
	});
	if(changed) {
		$persona.set_value();
	}
};

$persona.check_e = function(length) {
	var json = $persona.json,
		p = json.plist[json.pidx];
	if(p.elist.length !== length) {
		var l = length + 1 - p.elist.length;
		while(l-- > 0) {
			p.elist.push({});
		}
		p.elist.length = length + 1;
	}
};

$persona.change_p = function(pidx) {
	$persona.button.textContent = "(P1...)";
	$dfct.button.textContent = "(D...)";
	$ajax.send("POST","/?s=Character&ss=ch",pidx?"persona_set="+pidx:null,function(r){
		var doc = substring(r.responseText,"<body",["</body>",true],true);
		$persona.set_p(doc);
	});
};

$persona.set_p = function(doc) {
	$persona.button.textContent = "(P2...)";
	$persona.check_p(doc);
	$persona.set_value("j","pidx",parseInt($qs("select[name=persona_set]",doc).value));

	if($persona.selector_p) {
		$persona.selector_p.value = $persona.json.pidx;
		$persona.selector_p.disabled = false;
	}
	$persona.change_e();
	$dfct.set_button(doc);
};

$persona.change_e = function(eidx) {
	$persona.button.textContent = "(E1...)";
	$ajax.send("POST","/?s=Character&ss=eq",eidx?"equip_set="+eidx:null,function(r){
		var doc = substring(r.responseText,"<body",["</body>",true],true);
		$persona.set_e(doc);
	});
};

$persona.set_e = function(doc) {
	$persona.button.textContent = "(E2...)";
	$persona.check_e($qsa("#eqsl>div",doc).length);
	$persona.set_value("j","eidx",parseInt($qs("img[src$='_on.png']",doc).getAttribute("src").substr(-8).charAt(0)));

	var json = $persona.json;
	if($persona.selector_e) {
		$persona.selector_e.innerHTML = "";
		json.plist[json.pidx].elist.forEach(function(e,i){if(!i){return;}$element("option",$persona.selector_e,{value:i,text:e.name||"Set "+i});});
		$persona.selector_e.value = json.eidx;
		$persona.selector_e.disabled = false;
	}

	$ajax.send("GET",$qs("script[src^='/dynjs/']",doc).getAttribute("src"),null,function(r){
		$equip.dynjs_loaded = JSON.parse(substring(r.responseText,"{",["",-1]));
		$persona.parse_stats_pane(doc);
		$persona.set_button();
		setValue("eq_set", $equip.list(doc).map(eq=>({category:eq.info.category, slot:eq.node.div.previousElementSibling.textContent, eid:eq.info.eid, key:eq.info.key, name:eq.info.name})));
		if(_query.s === "Battle") {
			$battle.init();
		} else if(["eq","ab","it","se"].includes(_query.ss)) {
			location.href = location.href;
		}
	});
};

$persona.parse_stats_pane = function(doc) {
	var stats_pane = {};
	$qsa("#stats_pane .st1 > div:nth-child(2n+1), #stats_pane .st2 > div:nth-child(2n+1)",doc).forEach(function(div){
		var type = div.parentNode.previousElementSibling.textContent,
			s = div.nextElementSibling.textContent.trim(),
			p;
		if(s.startsWith("% ")) {
			s = s.substr(2);
		}
		if(s === "hit chance") {
			p = type==="Physical Attack"?"Attack " : type==="Magical Attack"?"Magic " : "";
			s = p + s;
		} else if(s.indexOf("crit chance") === 0) {
			p = type==="Physical Attack"?"Attack " : type==="Magical Attack"?"Magic " : "";
			var exec = /(crit chance) \/ \+([0-9.]+) % (damage)/.exec(s);
			stats_pane[p+"crit damage"] = parseFloat(exec[2]);
			s = (type==="Physical Attack"?"Attack " : type==="Magical Attack"?"Magic " : "") + exec[1];
		}
		s = s.charAt(0).toUpperCase() + s.substr(1);
		if(type === "Specific Mitigation") {
			s = "_" + s;
		}
		stats_pane[s] = parseFloat(div.textContent);
	});

	var fighting_style = /(Unarmed|One-Handed|Two-Handed|Dualwield|Niten Ichiryu|Staff)/.test($qs(".spn",doc).textContent) && RegExp.$1,
		spell_type = ["Fire","Cold","Elec","Wind","Holy","Dark"].sort((a,b)=>stats_pane[b]-stats_pane[a])[0],
		spell_damage = stats_pane[spell_type],
		prof_factor = Math.max(0, Math.min(1, stats_pane[({"Holy":"Divine","Dark":"Forbidden"})[spell_type]||"Elemental"]/_player.level-1)),
		ch_style = {difficulty:_player.dfct};

	stats_pane["Fighting Style"] = fighting_style;
	ch_style["Fighting Style"] = fighting_style;
	if(fighting_style === "Staff" || spell_damage>=100) {
		stats_pane["Spell Type"] = spell_type;
		stats_pane["Proficiency Factor"] = prof_factor;
		ch_style["Spell Type"] = spell_type;
		ch_style["Proficiency Factor"] = Math.round(prof_factor*1000)/1000;
	}
	setValue("ch_style",ch_style);

	return stats_pane;
};

$persona.set_button = function() {
	$persona.button.textContent = ($persona.json.plist[$persona.json.pidx].name||"Persona").substr(0,8).trim() + " ["+$persona.json.eidx+"]";
};

$persona.set_value = function(type,name,value) {
	var json = $persona.json,
		p = json.plist[json.pidx],
		e = p && p.elist[json.eidx];
	if(type === "j") {
		json[name] = value;
	} else if(type === "p") {
		p[name] = value;
	} else if(type === "e") {
		e[name] = value;
	}
	setValue("persona",$persona.json);
};

$persona.get_value = function(type,name) {
	var json = $persona.json,
		p = json.plist[json.pidx],
		e = p && p.elist[json.eidx];
	if(type === "j") {
		return json[name];
	} else if(type === "p") {
		return p[name];
	} else if(type === "e") {
		return e[name];
	}
};

$persona.hover = function(){
	var json = $persona.json;
	if(!json.pidx || !json.eidx) {
		return;
	}
	if(!$persona.sub) {
		$persona.sub = $element("div",$persona.div,[".hvut-top-sub"]);

		$persona.selector_p = $element("select",$persona.sub,{size:json.plist.length-1,style:"width:100px"},{change:function(){$persona.selector_p.disabled=true;$persona.change_p($persona.selector_p.value);}});
		json.plist.forEach(function(p,i){if(!i){return;}$element("option",$persona.selector_p,{value:i,text:p.name});});
		$persona.selector_p.value = json.pidx;

		$persona.selector_e = $element("select",$persona.sub,{size:json.plist[json.pidx].elist.length-1,style:"width:100px"},{change:function(){$persona.selector_e.disabled=true;$persona.change_e($persona.selector_e.value);}});
		json.plist[json.pidx].elist.forEach(function(e,i){if(!i){return;}$element("option",$persona.selector_e,{value:i,text:e.name||"Set "+i});});
		$persona.selector_e.value = json.eidx;
	}
};

$persona.json = getValue("persona");
if(!$persona.json || !$persona.json.pidx) {
	$persona.json = {pidx:0, eidx:0, plist:[]};
}
$persona.button = _top.node.persona.firstChild;
$persona.div = $persona.button.parentNode;
$persona.div.addEventListener("mouseenter",$persona.hover);


if($id("persona_form")) {
	$persona.check_p();
	if($qs("select[name=persona_set]").value != $persona.json.pidx) {
		$persona.set_p();
	} else {
		$persona.set_button();
	}
} else if(!$persona.json.pidx || !$persona.json.eidx) {
	$persona.change_p();
} else {
	$persona.set_button();
}


// Check Equipment
if(settings.equipment && _query.s==="Character" && _query.ss==="eq" && !_query.equip_slot && $persona.json.pidx) {
	$persona.check_e($qsa("#eqsl>div").length);
	$persona.set_value("j","eidx",parseInt($qs("img[src$='_on.png']").src.substr(-8).charAt(0)));

	$persona.name_header = $element("div",[$id("eqch_left"),0],["!position:absolute;width:100%;top:10px"]);
	$persona.name_input = $element("input",$persona.name_header,{value:$persona.json.plist[$persona.json.pidx].elist[$persona.json.eidx].name||"",style:"text-align:center"});
	$element("input",$persona.name_header,{type:"button",value:"Set"},function(){$persona.set_value("e","name",$persona.name_input.value);});
}
/***** Top Menu *****/



/***** Bottom Menu *****/

GM_addStyle(`
	#hvut-bottom {position:absolute; top:100%; left:-1px; width:100%; border:1px solid #5C0D11; font-size:10pt; line-height:20px}
	#hvut-bottom:empty {display:none}
	#hvut-bottom::after {content:''; display:block; clear:both}
	#hvut-bottom > div {float:left; position:relative; margin:-1px 0 -1px -1px; padding:0 5px; min-width:170px; border:1px solid #5C0D11}
`);

_bottom.div = $element("div",$id("csp"),["#hvut-bottom"]);


// Credits Counter
if(settings.showCredits) {
	_bottom.credits_div = $element("div",_bottom.div);
	if($id("networth")) {
		$id("networth").style.display = "none";
		_bottom.credits_div.textContent = $id("networth").textContent;

	} else {
		_bottom.credits_div.textContent = "Loading...";
		$ajax.send("GET","/?s=Character&ss=tr",null,function(r){
			_bottom.credits_div.textContent = substring(r.responseText,["<div>Credits: ",5],"</div>") || "Failed to load";
		});
	}
}

// Equip Counter
if(settings.showEquipSlots===2 || settings.showEquipSlots===1 && _query.s==="Battle") {
	_bottom.equip_div = $element("div",null,"Loading...");
	if(settings.showEquipSlots===2) {
		_bottom.div.appendChild(_bottom.equip_div);
	} else {
		_bottom.equip_div.style.cssText = "position:absolute;bottom:-1px;left:-1px;width:180px;border:1px solid #5C0D11;font-size:10pt;line-height:20px;white-space:nowrap";
		$id("csp").appendChild(_bottom.equip_div);
	}

	$ajax.send("GET","/?s=Character&ss=in",null,function(r){
		var exec = /Equip Slots: (\d+)(?: \+ (\d+))? \/ (\d+)/.exec(substring(r.responseText,"<div>Equip Slots: ","</div>")),
			c = parseInt(exec[3]) - parseInt(exec[1]) - (parseInt(exec[2])||0);
		_bottom.equip_div.textContent = "Equip Slots: "+exec[1]+(exec[2]?" + "+exec[2]:"")+" / "+exec[3];
		if(c < 150) {
			_bottom.equip_div.style.color = "#ff0";
			_bottom.equip_div.style.backgroundColor = "#c33";
		} else if(c < 500) {
			_bottom.equip_div.style.color = "#c00";
		}
	});
}

// Lottery
if(settings.showLottery) {
	GM_addStyle(`
		.hvut-lt-div {float:right !important; margin:-1px -1px -1px 0 !important}
		.hvut-lt-check {background-color:#fd9}
		.hvut-lt-draw {background-color:#5C0D11; color:#fc0}
		.hvut-lt-draw > a {color:#fff}
		.hvut-lt-div > span:nth-child(2) {display:inline-block; width:40px}
		.hvut-lt-div > span:nth-child(3) {display:none; width:40px; color:#c00; cursor:pointer}
		.hvut-lt-div:hover > span:nth-child(2) {display:none}
		.hvut-lt-div:hover > span:nth-child(3) {display:inline-block}
		.hvut-lt-div > a {margin-right:5px}
	`);

	["lt","la"].forEach(function(ss){
		if(_query.ss === ss) {
			return;
		}
		var json = getValue(ss+"_show",{}),
			now = Date.now();

		if(json.date > now && json.hide) {
			return;
		}

		var div = $element("div",_bottom.div,[".hvut-lt-div"]),
			equip_span = $element("a",div,{textContent:"Loading...",href:"/?s=Bazaar&ss="+ss}),
			time_span = $element("span",div,"--:--"),
			hide_span = $element("span",div,"close",function(){json.hide=true;setValue(ss+"_show",json);div.remove();});

		if(json.date > now) {
			if(json.date-now < 3600000) {
				div.classList.add("hvut-lt-draw");
			}
			if(json.check) {
				div.classList.add("hvut-lt-check");
			}
			equip_span.textContent = json.equip;
			time_span.textContent = time_format(json.date-now,1);
			return;
		}

		div.classList.add("hvut-lt-draw");

		$ajax.send("GET","/?s=Bazaar&ss="+ss,null,function(r){
			var html = r.responseText,
				id = /&amp;lottery=(\d+)/.test(html) && parseInt(RegExp.$1)+1;
			if(!id || id===json.id) {
				return;
			}

			var date = Date.now(),
				margin = 0;
			if(/Today&#039;s drawing is in (?:(\d+) hours?)?(?: and )?(?:(\d+) minutes?)?/.test(html)) {
				date += (60*parseInt(RegExp.$1||0) + parseInt(RegExp.$2||0)) * 60000;
				margin = 2;
			} else if(html.includes("Today&#039;s ticket sale is closed")) {
				margin = 10;
			} else {
				date = null;
			}
			var m = (new Date(date)).getUTCMinutes();
			if(date && (m<1 || 60-m<=margin)) {
				date = Math.round(date/3600000)*3600000;
			}

			json.id = id;
			json.date = date;
			json.hide = !settings.showLottery;
			json.equip = /<div id="lottery_eqname">(.+?)<\/div>/.test(html) && RegExp.$1;
			json.check = $equip.filter(json.equip,settings.lotteryCheck);
			setValue(ss+"_show",json);

			equip_span.textContent = json.equip;
			time_span.textContent = time_format(json.date-now,1);

			if(json.check) {
				popup("<span>"+(/(Grand Prize for .+?:)/.test(html) && RegExp.$1)+"</span><br /><span style='color:#f00;font-weight:bold'>"+json.equip+"</span>");
			}
		});
	});
}
/***** Bottom Menu *****/


//* [0] Training Timer
if(settings.trainingTimer) {

_tr.clock = function() {
	var remain = _tr.json.current_end - Date.now();
	if(remain > 0) {
		_tr.timer.node.clock.textContent = time_format(remain);
		setTimeout(_tr.clock,1000);

	} else {
		_tr.timer.node.link.textContent = "Loading...";
		_tr.timer.node.clock.textContent = "";
		$ajax.send("GET","/?s=Character&ss=tr",null,_tr.parse,function(){setTimeout(_tr.clock,10000);});
	}
};

_tr.parse = function(r) {
	var html = r.responseText;
	if(!html.includes('<div id="train_outer">')) {
		_tr.timer.node.link.textContent = "Waiting...";
		setTimeout(_tr.clock,60000);
		return;
	}

	var level = {};
	Array.from( substring(html,'<table id="train_table">',['</table>',true],true).firstElementChild.rows ).forEach(function(tr,i){
		if(i === 0) {
			return;
		}
		level[tr.cells[0].textContent] = parseInt(tr.cells[4].textContent);
	});
	_tr.json.error = "";

	if(html.includes('<div id="train_progress">')) {
		_tr.json.current_name = /<div>Training <strong>(.+?)<\/strong>/.test(html) && RegExp.$1;
		_tr.json.current_level = level[_tr.json.current_name];
		_tr.json.current_end = /var end_time = (\d+);/.test(html) && parseInt(RegExp.$1)*1000;

		_tr.timer.node.link.textContent = _tr.json.current_name + " ["+(_tr.json.current_level+1)+"]";
		_tr.clock();

	} else if(_tr.json.next_name) {
		if(html.includes('<div id="messagebox"')) {
			_tr.json.error = substring(html,'<div id="messagebox"','<div id="mainpane">',true).firstElementChild.lastElementChild.textContent.trim();
			_tr.timer.node.link.textContent = _tr.json.error;
			setTimeout(_tr.clock,60000);

		} else if(level[_tr.json.next_name] < _tr.json.next_level) {
			if(html.includes('onclick="training.start_training('+_tr.json.next_id+')"')) {
				$ajax.send("POST","/?s=Character&ss=tr","start_train="+_tr.json.next_id,_tr.parse,function(){setTimeout(_tr.clock,10000);});
			} else {
				_tr.json.error = "Can't start Training";
				_tr.timer.node.link.textContent = _tr.json.error;
				setTimeout(_tr.clock,60000);
			}

		} else {
			_tr.timer.node.link.textContent = "Training completed!";
		}

	} else {
		_tr.timer.node.link.textContent = "Training completed!";
	}

	setValue("tr_save",_tr.json);
};

_tr.json = getValue("tr_save",{});
if(_tr.json.current_name || _tr.json.next_name || _tr.json.error) {
	_tr.timer = {node:{}};
	_tr.timer.node.div = $element("div",_bottom.div);
	_tr.timer.node.link = $element("a",_tr.timer.node.div,{href:"/?s=Character&ss=tr",textContent:"Initializing...",style:"margin-right:5px"});
	_tr.timer.node.clock = $element("span",_tr.timer.node.div,{style:"display:inline-block;width:60px"});
	if(_tr.json.error) {
		_tr.timer.node.link.textContent = _tr.json.error;
	} else if(_tr.json.current_name) {
		_tr.timer.node.link.textContent = _tr.json.current_name + " ["+(_tr.json.current_level+1)+"]";
	}
	_tr.clock();
}

}
// [END 0] Training Timer */


/***** [SUBMENU] *****/

//* [1] Character - Character
if(settings.character && (_query.s==="Character" && _query.ss==="ch" || $id("persona_outer"))) {

if(settings.characterExpCalculator) {

_ch.total_exp = _window.total_exp;
_ch.exp = [null,{total:0}];
_ch.base = {};
_ch.prof = {};
_ch.ass = getValue("tr_level",{})["Assimilator"] || 0;

_ch.calc = function() {
	var level = parseFloat(_ch.node.level.value),
		ass = parseInt(_ch.node.ass.value);
	if(isNaN(level) || level<1 || level>600 || isNaN(ass) || ass<0 || ass>25) {
		return;
	}

	_window.total_exp = _ch.calc_exp(level);
	_window.doovers = 9999;
	_window.update_usable_exp();
	_window.update_display("str","");

	var exp_gain = _window.total_exp - _ch.total_exp;
	//_ch.node.gain.textContent = exp_gain.toLocaleString();

	var prof_exp = exp_gain * 4 * (1+ass*0.1);
	if(prof_exp < 0) {
		prof_exp = 0;
	}

	$qsa("#prof_outer tr").forEach(function(tr){
		var name = tr.cells[0].textContent,
			prof = _ch.prof[name];
		if(!prof) {
			prof = _ch.prof[name] = {};
			prof.level = _ch.base[name];
			prof.exp = _ch.calc_exp(prof.level);

			tr.cells[1].textContent = tr.cells[1].textContent;
			$element("td",tr);
			$element("td",tr);
		}
		var up = _ch.calc_level(prof.exp+prof_exp,prof.level);
		tr.cells[2].textContent = "+" + (up-prof.level).toFixed(3);
		tr.cells[3].textContent = up.toFixed(3);
	});
};

_ch.calc_exp = function(level) {
	var num = parseInt(level),
		dec = level%1;
	if(!_ch.exp[num]) {
		_ch.exp[num] = {total:Math.round(Math.pow(num+3, Math.pow(2.850263212287058, (1+num/1000))))};
	}
	var exp = _ch.exp[num].total;
	if(dec) {
		if(!_ch.exp[num].next) {
			_ch.exp[num].next = _ch.calc_exp(num+1) - exp;
		}
		exp += Math.round(_ch.exp[num].next * dec);
	}
	return exp;
};

_ch.calc_level = function(exp,level) {
	level = parseInt(level) || 1;
	while(exp >= _ch.exp[level].total) {
		level++;
		if(!_ch.exp[level]) {
			_ch.exp[level] = {total:_ch.calc_exp(level)};
		}
	}
	level--;
	if(!_ch.exp[level].next) {
		_ch.exp[level].next = _ch.exp[level+1].total - _ch.exp[level].total;
	}
	return level + (exp-_ch.exp[level].total) / _ch.exp[level].next;
};

GM_addStyle(`
	#attr_table tr:last-child > td {padding-top:20px !important}
	.hvut-ch-div {position:absolute; width:370px; height:0; margin:-25px 0 0 40px; text-align:right}
	.hvut-ch-div label {margin:0 5px; font-size:10pt}
	.hvut-ch-div label input {margin:0 5px; text-align:right}
	.hvut-ch-prof {width:624px !important}
	.hvut-ch-prof > div {width:300px !important; margin:0 5px}
	.hvut-ch-prof td:nth-child(1) {width:110px !important}
	.hvut-ch-prof td:nth-child(2) {width:60px !important; font-size:10pt}
	.hvut-ch-prof td:nth-child(3) {width:65px; font-size:10pt; color:#c00}
	.hvut-ch-prof td:nth-child(4) {width:60px; font-size:10pt; font-weight:bold}
`);

_ch.node = {};
_ch.node.div = $element("div",$id("attr_outer"),[".hvut-ch-div"]);
$element("input",_ch.node.div,{type:"button",value:"Simulate",style:"float:left"},function(){$qs("img[onclick*='do_attr_post']").style.visibility="hidden";_ch.node.sub.classList.toggle("hvut-none");$id("prof_outer").classList.add("hvut-ch-prof");_ch.calc();});
_ch.node.sub = $element("div",_ch.node.div,[".hvut-none"]);
_ch.node.ass = $element("input",$element("label",_ch.node.sub,"Assimilator"),{type:"number",value:_ch.ass,min:0,max:25,style:"width:40px"},{input:_ch.calc});
_ch.node.level = $element("input",$element("label",_ch.node.sub,"Level"),{type:"number",value:_player.level,min:1,max:600,style:"width:70px"},{input:_ch.calc});
//$element("input",_ch.node.sub,{type:"button",value:"Run"},_ch.calc);
//_ch.node.gain = $element("span",_ch.node.sub,["!display:inline-block;width:170px;margin-right:2px;font-size:12pt"]);

Array.from($id("attr_table").rows).forEach(function(tr,i){
	if(i > 5) {
		return;
	}
	_ch.base[tr.cells[0].textContent] = parseInt(tr.cells[1].textContent) + parseInt(tr.cells[2].textContent);
});
$qsa("#prof_outer tr").forEach(function(tr){
	_ch.base[tr.cells[0].textContent] = parseFloat(tr.cells[1].textContent);
});

_window.common.get_dynamic_digit_string = function(n){return '<div class="fc4 far fcb"><div>'+n.toLocaleString()+'</div></div>';};

}

$persona.parse_stats_pane();

} else
// [END 1] Character - Character */


//* [2] Character - Equipment
if(settings.equipment && _query.s==="Character" && _query.ss==="eq") {

_eq.mage_stats = function() {
	// to get exact numbers
	var stats_pane = _eq.stats_pane,
		stats_equip = {},
		stats_multi = ["Attack Speed","Attack Crit Chance","Magic Crit Chance","Mana Conservation","Physical Mitigation","Magical Mitigation","Evade Chance","Block Chance","Parry Chance","Resist Chance"];

	_eq.list.forEach(function(eq){
		$equip.parse.stats(eq);
		for(let s in eq.stats) {
			if(stats_multi.includes(s)) {
				if(!stats_equip[s]) {
					stats_equip[s] = 1;
				}
				stats_equip[s] *= 1 - eq.stats[s]/100;

			} else {
				if(!stats_equip[s]) {
					stats_equip[s] = 0;
				}
				stats_equip[s] += eq.stats[s];
			}
		}
	});
	stats_multi.forEach(function(s){
		if(stats_equip[s]) {
			stats_equip[s] = 1 - stats_equip[s];
		}
	});

	var md = stats_pane["Magic base damage"],
		spell_type = stats_pane["Spell Type"],
		prof_factor = stats_pane["Proficiency Factor"],
		edb_infusion = $persona.get_value("e","infusion") ? 0.25 : 0,
		edb = stats_pane[spell_type]/100 + edb_infusion,
		crit_chance = stats_pane["Magic crit chance"],
		crit_bonus = 50 + (stats_equip["Spell Crit Damage"]||0),
		magic_score = md * (1 + edb) * (1 + crit_chance/100 * crit_bonus/100),
		arcane_score = md*1.25 * (1 + edb) * (1 + (1-(1-crit_chance/100)*(1-0.1)) * (crit_bonus/100+(_player.level>=405?0.15 : _player.level>=365?0.14 : _player.level>=325?0.12 : _player.level>=285?0.10 : _player.level>=245?0.08 : _player.level>=205?0.06 : _player.level>=175?0.03 : 0 )));

	var cr_staff = stats_equip["Counter-Resist"]||0,
		cr_spell = prof_factor/2 + cr_staff/100,
		prof_dep = Math.max(0, Math.min(1, stats_pane["Deprecating"] / _player.level - 1)),
		cr_dep = prof_dep/2 + cr_staff/100,
		prof_sup = Math.min(1, stats_pane["Supportive"] / _player.level - 1),
		cure_bonus = prof_sup / (prof_sup>0?2:5),
		mit_imperil = $persona.get_value("e","imperil") ? (spell_type==="Holy"||spell_type==="Dark"? 0.25 : 0.4) : 0,
		mit_reduce = Math.pow(prof_factor,1.5)*0.5 + mit_imperil,
		resist_dfct = _player.dfct==="PFUDOR" ? 0.1 : 0;

	var wrapper = $id("hvut-eq-wrapper") || $element("div",$id("eqch_left"),["#hvut-eq-wrapper"]);
	wrapper.innerHTML = "";
	var div = $element("div",wrapper,[".hvut-eq-chart"]),
		ul;

	ul = $element("div",div,[".hvut-eq-option"]);
	$element("label",ul).append($element("input",null,{type:"checkbox",checked:edb_infusion},function(){$persona.set_value("e","infusion",this.checked);_eq.mage_stats();}), "Infusion");
	$element("label",ul).append($element("input",null,{type:"checkbox",checked:mit_imperil},function(){$persona.set_value("e","imperil",this.checked);_eq.mage_stats();}), "Imperil");
	$element("label",ul).append($element("input",null,{type:"checkbox",checked:resist_dfct,disabled:true}), "PFUDOR");

	ul = $element("ul",div,[".hvut-eq-stats"]);
	$element("li",ul,"Mage Statistics");
	$element("li",ul).append(
		$element("span",null,magic_score.toLocaleString(navigator.languages,{maximumFractionDigits:0})),
		$element("span",null,"Magic Score")
	);
	$element("li",ul).append(
		$element("span",null,arcane_score.toLocaleString(navigator.languages,{maximumFractionDigits:0})),
		$element("span",null,"Arcane Score")
	);
	$element("li",ul).append(
		$element("span",null,prof_factor.toLocaleString(navigator.languages,{maximumFractionDigits:3,minimumFractionDigits:3})),
		$element("span",null,"Proficiency Factor")
	);
	$element("li",ul).append(
		$element("span",null,mit_reduce.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2})),
		$element("span",null,"Mitigation Reduction")
	);
	$element("li",ul).append(
		$element("span",null,(cr_staff/100).toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2})),
		$element("span",null,"Base Counter-Resist")
	);
	$element("li",ul).append(
		$element("span",null,cr_spell.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2})),
		$element("span",null,spell_type+" CR")
	);
	$element("li",ul).append(
		$element("span",null,cr_dep.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2})),
		$element("span",null,"Deprecating CR")
	);
	$element("li",ul).append(
		$element("span",null,cure_bonus.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2})),
		$element("span",null,"Cure Bonus")
	);

	ul = $element("ul",div,[".hvut-eq-monster"]);
	$element("li",ul,{textContent:"Monster Resist [?]",title:"Stats Resist + Token Resist"+(resist_dfct?" + PFUDOR Resist":"")});

	$element("li",ul,"Base Resist");
	$element("li",ul,{textContent:"Deprecating Resist",title:"Base Resist * (1 - Deprecating CR)"});
	$element("li",ul,{textContent:spell_type+" Resist",title:"Base Resist * (1 - "+spell_type+" CR)"});
	$element("li",ul,{textContent:"Damage Reduction",title:"https://ehwiki.org/wiki/Damage#Resist_Mechanics"},function(){window.open("https://ehwiki.org/wiki/Damage#Resist_Mechanics");});

	$element("li",ul,"Mitigation 50%");
	$element("li",ul,"Mitigation 60%");
	$element("li",ul,"Mitigation 70%");
	$element("li",ul,"Mitigation 75%");

	[{n:"Minimum",s:4,t:0},{n:"Average",s:7,t:5},{n:"Maximum",s:10,t:10}].forEach(function(r){
		var rb = 1 - (1-r.s/100) * (1-r.t/100) * (1-resist_dfct), // base resist
			rs = rb * (1-cr_spell), // spell resist
			rd = 0.15*rs*rs*rs - 0.75*rs*rs + 1.5*rs, // damage resist
							//Math.pow(rs,1) * Math.pow(1-rs,2) * 3 * 0.5 +
							//Math.pow(rs,2) * Math.pow(1-rs,1) * 3 * 0.75 +
							//Math.pow(rs,3) * 1 * 0.9;
			r_dep = rb * (1-cr_dep);

		var ul = $element("ul",div,[".hvut-eq-damage"]);

		$element("li",ul,{textContent:r.n,title:r.s+"%+"+r.t+"%"+(resist_dfct?"+"+resist_dfct*100+"%":"")});
		$element("li",ul,rb.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2}));
		$element("li",ul,r_dep.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2}));
		$element("li",ul,rs.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2}));
		$element("li",ul,rd.toLocaleString(navigator.languages,{style:"percent",maximumFractionDigits:2,minimumFractionDigits:2}));

		[0.5,0.6,0.7,0.75].forEach(function(mit){
			$element("li",ul,(arcane_score * (1 - Math.max(mit<0?mit:0,mit-mit_reduce)) * (1 - rd)).toLocaleString(navigator.languages,{maximumFractionDigits:0}));
		});
	});
};


if(_query.equip_slot) {
	GM_addStyle(`
		.eqb {padding:0; height:auto; font-size:10pt; line-height:19px; text-align:center; overflow:hidden}
	`);

	$equip.list($id("equip_pane"),1);

} else {
	GM_addStyle(`
		#popup_box {margin-top:10px}
		#eqsh {visibility:hidden; margin-bottom:10px}
		.eqb {padding:0; height:auto; font-size:10pt; line-height:19px; text-align:center; overflow:hidden}

		.hvut-eq-Peerless {box-shadow:none}
		.hvut-eq-info {position:absolute; top:0; right:0; font-size:9pt}
		.hvut-eq-info > span {display:inline-block; margin:0 3px}
		.hvut-eq-info > span:nth-child(2) {width:35px}
		.hvut-eq-info > span:nth-child(3) {width:35px}

		#hvut-eq-wrapper {position:absolute; bottom:-9px; left:0; width:100%}
		.hvut-eq-chart {position:relative; width:600px; min-width:max-content; min-width:-moz-max-content; margin:0 auto; padding:10px 25px; overflow:hidden; border:1px solid; font-size:10pt; text-align:left; white-space:nowrap}
		.hvut-eq-chart > ul {list-style:none; margin:0; padding:0; float:left}
		.hvut-eq-chart li {padding:0 10px; line-height:1.5em}
		.hvut-eq-chart li:first-child {font-weight:bold; margin-bottom:3px}
		.hvut-eq-chart li[title] {cursor:help}
		.hvut-eq-chart span:first-child {display:inline-block; width:50px; text-align:right; margin-right:5px}
		.hvut-eq-stats {margin-right:20px !important}
		.hvut-eq-option {margin-bottom:5px; padding-bottom:5px; border-bottom:1px solid}
		.hvut-eq-option > label {margin-right:10px}
		.hvut-eq-monster {text-align:right}
		.hvut-eq-damage {text-align:right}
		.hvut-eq-stats > li:nth-child(4), .hvut-eq-stats > li:nth-child(6), .hvut-eq-monster > li:nth-child(4), .hvut-eq-monster > li:nth-child(6), .hvut-eq-damage > li:nth-child(4), .hvut-eq-damage > li:nth-child(6) {border-top:1px dotted}
	`);

	_eq.stats_pane = $persona.parse_stats_pane();
	_eq.list = $equip.list($id("eqch_left"));
	_eq.set = _eq.list.map(eq=>({category:eq.info.category, slot:eq.node.div.previousElementSibling.textContent, eid:eq.info.eid, key:eq.info.key, name:eq.info.name}));
	setValue("eq_set",_eq.set);

	_eq.list.forEach(function(eq){
		eq.node.div.textContent = eq.node.div.textContent;
		$element("div",eq.node.wrapper.firstElementChild,[".hvut-eq-info"]).append(
			$element("span",null,[" "+(eq.info.soulbound?"Soulbound":"Lv."+eq.info.level),(eq.info.soulbound||!eq.info.tradeable?"!color:#c00":"")])," : ",
			$element("span",null,"IW "+eq.info.tier)," : ",
			$element("span",null,[" "+Math.ceil(eq.info.cdt*100)+"%","!"+(eq.info.cdt<=0.5?"color:#fff;background-color:#c00":eq.info.cdt<=0.6?"color:#c00":"")])
		);
	});

	if(settings.equipmentStatsAnalyzer && _eq.stats_pane["Spell Type"]) {
		_eq.mage_stats();
	}

	$ajax.send("GET","/?s=Character&ss=ch",null,function(r){
		var base = {};
		$qsa("#attr_table tr, #prof_outer tr",substring(r.responseText,"<body",["</body>",true],true)).forEach(function(tr){
			base[tr.children[0].textContent.toLowerCase()] = tr.children[1].textContent;
		});
		delete base[""];

		var stats = ["strength","dexterity","agility","endurance","intelligence","wisdom", "elemental","divine","forbidden","deprecating","supportive"];
		$qsa(".st2:nth-last-child(-n+3) .fal > div").forEach(function(d){ // :nth-last-child(-n+3)
			var s = d.textContent.trim();
			if(stats.includes(s)) {
				d.innerHTML = "&nbsp;["+Math.round(base[s])+"]"+ d.textContent;
			}
		});
	});

	$persona.set_button();
}

} else
// [END 2] Character - Equipment */


//* [3] Character - Abilities
if(settings.abilities && _query.s==="Character" && _query.ss==="ab") {

_ab.data = {
	"HP Tank": {"category":"General","img":"3.png","pos":0,"tier":[0,25,50,75,100,120,150,200,250,300],"point":[1,2,3,3,4,4,4,5,5,5]},
	"MP Tank": {"category":"General","img":"3.png","pos":-34,"tier":[0,30,60,90,120,160,210,260,310,350],"point":[1,2,3,3,4,4,4,5,5,5]},
	"SP Tank": {"category":"General","img":"3.png","pos":-68,"tier":[0,40,80,120,170,220,270,330,390,450],"point":[1,2,3,3,4,4,4,5,5,5]},
	"Better Health Pots": {"category":"General","img":"1.png","pos":0,"tier":[0,100,200,300,400],"point":[1,2,3,4,5]},
	"Better Mana Pots": {"category":"General","img":"1.png","pos":-34,"tier":[0,80,140,220,380],"point":[2,3,5,7,9]},
	"Better Spirit Pots": {"category":"General","img":"1.png","pos":-68,"tier":[0,90,160,240,400],"point":[2,3,5,7,9]},

	"1H Damage": {"category":"One-handed","img":"e.png","pos":-68,"tier":[0,100,200],"point":[2,3,5]},
	"1H Accuracy": {"category":"One-handed","img":"e.png","pos":-34,"tier":[50,150],"point":[1,2]},
	"1H Block": {"category":"One-handed","img":"e.png","pos":0,"tier":[250],"point":[3]},

	"2H Damage": {"category":"Two-handed","img":"k.png","pos":-34,"tier":[0,100,200],"point":[2,3,5]},
	"2H Accuracy": {"category":"Two-handed","img":"k.png","pos":0,"tier":[50,150],"point":[1,2]},
	"2H Parry": {"category":"Two-handed","img":"e.png","pos":-102,"tier":[250],"point":[3]},

	"DW Damage": {"category":"Dual-wielding","img":"j.png","pos":0,"tier":[0,100,200],"point":[2,3,5]},
	"DW Accuracy": {"category":"Dual-wielding","img":"k.png","pos":-68,"tier":[50,150],"point":[1,2]},
	"DW Crit": {"category":"Dual-wielding","img":"k.png","pos":-102,"tier":[250],"point":[3]},

	"Staff Spell Damage": {"category":"Staff","img":"9.png","pos":-68,"tier":[0,100,200],"point":[2,3,5]},
	"Staff Accuracy": {"category":"Staff","img":"v.png","pos":0,"tier":[50,150],"point":[1,2]},
	"Staff Damage": {"category":"Staff","img":"k.png","pos":-136,"tier":[0],"point":[3]},

	"Cloth Spellacc": {"category":"Cloth Armor","img":"5.png","pos":0,"tier":[120],"point":[5]},
	"Cloth Spellcrit": {"category":"Cloth Armor","img":"5.png","pos":-34,"tier":[0,40,90,130,190],"point":[1,2,3,5,7]},
	"Cloth Castspeed": {"category":"Cloth Armor","img":"5.png","pos":-68,"tier":[150,250],"point":[2,5]},
	"Cloth MP": {"category":"Cloth Armor","img":"u.png","pos":-136,"tier":[0,60,110,170,230,290,350],"point":[1,2,3,3,4,4,5]},

	"Light Acc": {"category":"Light Armor","img":"7.png","pos":-34,"tier":[0],"point":[3]},
	"Light Crit": {"category":"Light Armor","img":"7.png","pos":0,"tier":[0,40,90,130,190],"point":[1,2,3,5,7]},
	"Light Speed": {"category":"Light Armor","img":"6.png","pos":-68,"tier":[150,250],"point":[2,5]},
	"Light HP/MP": {"category":"Light Armor","img":"5.png","pos":-102,"tier":[0,60,110,170,230,290,350],"point":[1,2,3,3,4,4,5]},

	"Heavy Crush": {"category":"Heavy Armor","img":"j.png","pos":-34,"tier":[0,75,150],"point":[3,5,7]},
	"Heavy Prcg": {"category":"Heavy Armor","img":"a.png","pos":-102,"tier":[0,75,150],"point":[3,5,7]},
	"Heavy Slsh": {"category":"Heavy Armor","img":"j.png","pos":-68,"tier":[0,75,150],"point":[3,5,7]},
	"Heavy HP": {"category":"Heavy Armor","img":"u.png","pos":-102,"tier":[0,60,110,170,230,290,350],"point":[1,2,3,3,4,4,5]},

	"Better Weaken": {"category":"Deprecating 1","img":"4.png","pos":0,"tier":[70,100,130,190,250],"point":[1,2,3,5,7]},
	"Faster Weaken": {"category":"Deprecating 1","img":"b.png","pos":-68,"tier":[80,165,250],"point":[3,5,7]},
	"Better Imperil": {"category":"Deprecating 1","img":"a.png","pos":-68,"tier":[130,175,230,285,330],"point":[1,2,3,4,5]},
	"Faster Imperil": {"category":"Deprecating 1","img":"r.png","pos":0,"tier":[140,225,310],"point":[3,5,7]},
	"Better Blind": {"category":"Deprecating 1","img":"r.png","pos":-34,"tier":[110,130,160,190,220],"point":[1,2,3,4,5]},
	"Faster Blind": {"category":"Deprecating 1","img":"9.png","pos":-102,"tier":[120,215,275],"point":[1,2,3]},
	"Mind Control": {"category":"Deprecating 1","img":"9.png","pos":-136,"tier":[80,130,170],"point":[1,3,5]},

	"Better Silence": {"category":"Deprecating 2","img":"c.png","pos":-170,"tier":[120,170,215],"point":[3,5,7]},
	"Better MagNet": {"category":"Deprecating 2","img":"u.png","pos":0,"tier":[250,295,340,370,400],"point":[1,2,3,4,5]},
	"Better Slow": {"category":"Deprecating 2","img":"c.png","pos":0,"tier":[30,50,75,105,135],"point":[1,2,3,4,5]},
	"Better Drain": {"category":"Deprecating 2","img":"2.png","pos":0,"tier":[20,50,90],"point":[2,3,5]},
	"Faster Drain": {"category":"Deprecating 2","img":"n.png","pos":0,"tier":[30,70,110,150,200],"point":[1,2,3,4,5]},
	"Ether Theft": {"category":"Deprecating 2","img":"2.png","pos":-34,"tier":[150],"point":[5]},
	"Spirit Theft": {"category":"Deprecating 2","img":"2.png","pos":-68,"tier":[150],"point":[5]},

	"Better Haste": {"category":"Supportive 1","img":"9.png","pos":-34,"tier":[60,75,90,110,130],"point":[1,2,3,4,5]},
	"Better Shadow Veil": {"category":"Supportive 1","img":"6.png","pos":-34,"tier":[90,105,120,135,155],"point":[1,2,3,5,7]},
	"Better Absorb": {"category":"Supportive 1","img":"c.png","pos":-34,"tier":[40,60,80],"point":[1,2,3]},
	"Stronger Spirit": {"category":"Supportive 1","img":"a.png","pos":0,"tier":[200,220,240,265,285],"point":[1,2,3,4,5]},
	"Better Heartseeker": {"category":"Supportive 1","img":"6.png","pos":0,"tier":[140,185,225,265,305,345,385],"point":[1,2,3,4,5,6,7]},
	"Better Arcane Focus": {"category":"Supportive 1","img":"q.png","pos":0,"tier":[175,205,245,285,325,365,405],"point":[1,2,3,4,5,6,7]},
	"Better Regen": {"category":"Supportive 1","img":"b.png","pos":-34,"tier":[50,70,95,145,195,245,295,375,445,500],"point":[1,2,3,4,5,6,7,8,9,10]},
	"Better Cure": {"category":"Supportive 1","img":"i.png","pos":-102,"tier":[0,35,65],"point":[2,3,5]},

	"Better Spark": {"category":"Supportive 2","img":"q.png","pos":-170,"tier":[100,125,150],"point":[2,3,5]},
	"Better Protection": {"category":"Supportive 2","img":"o.png","pos":0,"tier":[40,55,75,95,120],"point":[1,2,3,4,5]},
	"Flame Spike Shield": {"category":"Supportive 2","img":"s.png","pos":0,"tier":[10,65,140,220,300],"point":[3,1,2,3,4]},
	"Frost Spike Shield": {"category":"Supportive 2","img":"p.png","pos":0,"tier":[10,65,140,220,300],"point":[3,1,2,3,4]},
	"Shock Spike Shield": {"category":"Supportive 2","img":"g.png","pos":0,"tier":[10,65,140,220,300],"point":[3,1,2,3,4]},
	"Storm Spike Shield": {"category":"Supportive 2","img":"a.png","pos":-34,"tier":[10,65,140,220,300],"point":[3,1,2,3,4]},

	"Conflagration": {"category":"Elemental","img":"h.png","pos":0,"tier":[50,100,150,200,250,300,400],"point":[3,4,5,6,8,10,12]},
	"Cryomancy": {"category":"Elemental","img":"i.png","pos":-34,"tier":[50,100,150,200,250,300,400],"point":[3,4,5,6,8,10,12]},
	"Havoc": {"category":"Elemental","img":"9.png","pos":0,"tier":[50,100,150,200,250,300,400],"point":[3,4,5,6,8,10,12]},
	"Tempest": {"category":"Elemental","img":"i.png","pos":-68,"tier":[50,100,150,200,250,300,400],"point":[3,4,5,6,8,10,12]},
	"Sorcery": {"category":"Elemental","img":"c.png","pos":-68,"tier":[70,140,210,280,350],"point":[1,2,3,4,5]},
	"Elementalism": {"category":"Elemental","img":"c.png","pos":-136,"tier":[85,170,255,340,425],"point":[2,3,5,7,9]},
	"Archmage": {"category":"Elemental","img":"i.png","pos":0,"tier":[90,180,270,360,450],"point":[5,7,9,12,15]},

	"Better Corruption": {"category":"Forbidden","img":"t.png","pos":0,"tier":[75,150],"point":[3,5]},
	"Better Disintegrate": {"category":"Forbidden","img":"t.png","pos":-34,"tier":[175,250],"point":[5,7]},
	"Better Ragnarok": {"category":"Forbidden","img":"u.png","pos":-68,"tier":[250,325,400],"point":[7,9,12]},
	"Ripened Soul": {"category":"Forbidden","img":"u.png","pos":-34,"tier":[150,300,450],"point":[7,10,15]},
	"Dark Imperil": {"category":"Forbidden","img":"t.png","pos":-68,"tier":[175,225,275,325,375],"point":[2,3,5,7,9]},

	"Better Smite": {"category":"Divine","img":"q.png","pos":-136,"tier":[75,150],"point":[3,5]},
	"Better Banish": {"category":"Divine","img":"q.png","pos":-34,"tier":[175,250],"point":[5,7]},
	"Better Paradise": {"category":"Divine","img":"q.png","pos":-68,"tier":[250,325,400],"point":[7,9,12]},
	"Soul Fire": {"category":"Divine","img":"l.png","pos":0,"tier":[150,300,450],"point":[7,10,15]},
	"Holy Imperil": {"category":"Divine","img":"v.png","pos":-34,"tier":[175,225,275,325,375],"point":[2,3,5,7,9]},
};

_ab.preset = {
	"CURRENT": [],
	"One-handed": ["HP Tank","MP Tank","SP Tank","Better Health Pots","Better Mana Pots","Better Spirit Pots","1H Damage","1H Accuracy","1H Block","Heavy Crush","Heavy Prcg","Heavy Slsh","Heavy HP","Better Haste","Better Shadow Veil","Stronger Spirit","Better Heartseeker","Better Regen","Better Cure","Better Spark","Better Protection","Flame Spike Shield"],
	"Two-handed": ["HP Tank","MP Tank","SP Tank","Better Health Pots","Better Mana Pots","Better Spirit Pots","2H Damage","2H Accuracy","2H Parry","Light Acc","Light Crit","Light Speed","Light HP/MP","Better Haste","Better Shadow Veil","Stronger Spirit","Better Heartseeker","Better Regen","Better Cure","Better Spark","Better Protection","Flame Spike Shield"],
	"Dual-wielding": ["HP Tank","MP Tank","SP Tank","Better Health Pots","Better Mana Pots","Better Spirit Pots","DW Damage","DW Accuracy","DW Crit","Light Acc","Light Crit","Light Speed","Light HP/MP","Better Haste","Better Shadow Veil","Stronger Spirit","Better Heartseeker","Better Regen","Better Cure","Better Spark","Better Protection","Flame Spike Shield"],
	"Niten Ichiryu": ["HP Tank","MP Tank","SP Tank","Better Health Pots","Better Mana Pots","Better Spirit Pots","2H Damage","2H Parry","DW Accuracy","DW Crit","Light Acc","Light Crit","Light Speed","Light HP/MP","Better Haste","Better Shadow Veil","Stronger Spirit","Better Heartseeker","Better Regen","Better Cure","Better Spark","Better Protection","Flame Spike Shield"],
	"Elemental mage": ["HP Tank","MP Tank","SP Tank","Better Health Pots","Better Mana Pots","Better Spirit Pots","Staff Spell Damage","Staff Accuracy","Cloth Spellacc","Cloth Spellcrit","Cloth Castspeed","Cloth MP","Better Imperil","Faster Imperil","Better MagNet","Better Haste","Better Shadow Veil","Stronger Spirit","Better Arcane Focus","Better Regen","Better Cure","Better Spark","Better Protection","Flame Spike Shield","Conflagration","Sorcery","Elementalism","Archmage"],
	"Dark mage": ["HP Tank","MP Tank","SP Tank","Better Health Pots","Better Mana Pots","Better Spirit Pots","Staff Spell Damage","Staff Accuracy","Cloth Spellacc","Cloth Spellcrit","Cloth Castspeed","Cloth MP","Better Imperil","Faster Imperil","Better MagNet","Better Haste","Better Shadow Veil","Stronger Spirit","Better Arcane Focus","Better Regen","Better Cure","Better Spark","Better Protection","Flame Spike Shield","Better Corruption","Better Disintegrate","Better Ragnarok","Ripened Soul","Dark Imperil"],
	"Holy mage": ["HP Tank","MP Tank","SP Tank","Better Health Pots","Better Mana Pots","Better Spirit Pots","Staff Spell Damage","Staff Accuracy","Cloth Spellacc","Cloth Spellcrit","Cloth Castspeed","Cloth MP","Better Imperil","Faster Imperil","Better MagNet","Better Haste","Better Shadow Veil","Stronger Spirit","Better Arcane Focus","Better Regen","Better Cure","Better Spark","Better Protection","Flame Spike Shield","Better Smite","Better Banish","Better Paradise","Soul Fire","Holy Imperil"],
};

_ab.point = /Ability Points: (\d+)/.test($id("ability_top").children[3].textContent) && parseInt(RegExp.$1);
_ab.level = {};


_ab.unlock = function(ab,to) {
	var level = ab._level,
		i = to - level;
	while(i-- > 0){
		$ajax.send("POST",location.href,"unlock_ability="+ab.id,function(){
			level++;
			var button = ab.div.children[2].children[level-1];
			button.style.opacity = 0.5;
			button.style.backgroundImage = button.style.backgroundImage.replace("u.png","f.png");
			if(level === to) {
				location.href = location.href;
			}
		});
	}
};

_ab.calc = {

node : {},
array : [],
list : [],
reverse : false,

init : function() {
	if(_ab.calc.inited) {
		return;
	}
	_ab.calc.inited = true;

	GM_addStyle(`
		.hvut-ab-calc {position:absolute; top:27px; left:0; width:100%; height:675px; background-color:rgba(0,0,0,0.6); z-index:9; text-align:left; color:#333}
		.hvut-ab-calc > div {float:left; margin:4px 0 0 20px; padding:10px; border:1px solid #333; background-color:#fff}

		.hvut-ab-buttons input {display:block; margin:5px; width:120px; padding:3px 5px; white-space:normal}

		.hvut-ab-icon {display:inline-block; position:relative; width:30px; margin:3px; height:32px; vertical-align:middle; background-position-y:-2px; user-select:none; -moz-user-select:none; cursor:default}
		.hvut-ab-off {filter:grayscale(100%); box-shadow:0 0 0 20px rgba(255,255,255,0.6) inset}
		.hvut-ab-off:hover {filter:none} /* grayscale(0) */
		.hvut-ab-point {position:absolute; top:0; right:0; width:14px; padding:1px; text-align:center; background-color:rgba(0,0,0,0.8); color:#fff; font-size:8pt}
		.hvut-ab-tooltip {display:none; position:absolute; bottom:34px; left:0; padding:0 3px; border:1px solid; background-color:#fff; color:#333; font-size:9pt; line-height:16px; z-index:1; white-space:nowrap}
		.hvut-ab-icon:hover > .hvut-ab-tooltip {display:inline-block}

		.hvut-ab-ul {width:450px; margin:0; padding:0; list-style:none}
		.hvut-ab-ul > li {padding:2px; border-bottom:1px solid #999}
		.hvut-ab-category {display:inline-block; width:130px; padding-left:10px; font-size:11pt; font-weight:bold}
		.hvut-ab-ul .hvut-ab-icon {cursor:pointer}

		.hvut-ab-table {table-layout:fixed; border-collapse:collapse; position:relative; font-size:10pt; text-align:right}
		.hvut-ab-table tr:first-child {background-color:#ccc; font-weight:bold; line-height:20px; white-space:nowrap; cursor:pointer}
		.hvut-ab-table td[data-desc] {position:relative}
		.hvut-ab-table td[data-desc]::after {content:attr(data-desc); display:none; position:absolute; top:20px; left:-1px; padding:1px 3px; border:1px solid; background-color:#fff; white-space:nowrap; z-index:1}
		.hvut-ab-table td[data-desc]:hover::after {display:block}
		.hvut-ab-table td {border:1px solid #999; padding:0 5px}
		.hvut-ab-table td:nth-child(1) {width:30px}
		.hvut-ab-table td:nth-child(2) {width:30px}
		.hvut-ab-table td:nth-child(3) {width:30px}
		.hvut-ab-table td:nth-child(4) {width:220px; text-align:left}
	`);

	var node = _ab.calc.node;
	node.div = $element("div",null,[".hvut-ab-calc"]);

	node.buttons = $element("div",node.div,[".hvut-ab-buttons"]);
	$element("input",node.buttons,{type:"button",value:"[CLOSE]",style:"margin-bottom:20px"},function(){node.div.remove();});
	for(let i in _ab.preset) {
		$element("input",node.buttons,{type:"button",value:i},function(){_ab.calc.run(_ab.preset[i]);});
	}

	node.ul = $element("ul",$element("div",node.div),[".hvut-ab-ul"],_ab.calc.toggle);
	var category,li;
	for(let ab in _ab.data) {
		let d = _ab.data[ab];
		if(category !== d.category) {
			category = d.category;
			li = $element("li",node.ul);
			$element("span",li,[" "+category,".hvut-ab-category"]);
		}
		node[ab] = $element("div",li,[".hvut-ab-icon hvut-ab-off","!background-image:url('/y/t/"+d.img+"');background-position-x:"+(d.pos-2)+"px"]);
		node[ab].dataset.ab = ab;
		$element("span",node[ab],[" "+ab,".hvut-ab-tooltip"]);
	}
	node.table = $element("table",$element("div",$element("div",node.div),["!height:645px;overflow:hidden scroll"]),[".hvut-ab-table"]);

	var array = _ab.calc.array,
		data = _ab.data,
		index = 0;
	for(let a in data){
		let d = data[a],
			t = d.tier,
			p = d.point;
		t.forEach(function(l,i){
			array.push({index:index,ability:a,level:l,tier:i+1,point:p[i]});
		});
		index++;
	}
	array.sort((a,b)=>a.level-b.level||a.index-b.index);
},

table : function() {
	var array = _ab.calc.array,
		list = _ab.calc.list,
		reverse = _ab.calc.reverse,
		filter = [],
		current = {level:-1,sum:0};

	array.forEach(function(d){
		if(!list.includes(d.ability)) {
			return;
		}
		if(current.level !== d.level) {
			filter.push( (current={level:d.level,sum:current.sum,ability:[]}) );
		}
		current.sum += d.point;
		current.ab = current.sum - current.level;
		current.ability.push(d);
	});
	if(reverse) {
		filter.reverse();
	}

	var frag = $element();
	$element("tr",frag,["/<td data-desc='Player Level'>"+(reverse?"&#x25BC;":"&#x25B2;")+" Lv</td><td data-desc='Required Ability Point'>AP</td><td data-desc='Required Ability Boost (AP - Lv)'>AB</td><td>Abilities</td>"],function(){_ab.calc.reverse=!reverse;_ab.calc.table();});
	filter.forEach(function(d){
		var tr = $element("tr",frag,[_player.level<d.level?"!background-color:#ffc":""]);
		$element("td",tr,d.level);
		$element("td",tr,d.sum);
		$element("td",tr,[" "+d.ab,d.ab<=0?"!color:#999":""]);
		var td = $element("td",tr);
		d.ability.forEach(function(ab){
			var data = _ab.data[ab.ability];
			$element("div",td,[".hvut-ab-icon","!background-image:url('/y/t/"+data.img+"');background-position-x:"+(data.pos-2)+"px"]).append(
				$element("span",null,[" "+ab.point,".hvut-ab-point"]),
				$element("span",null,[" "+ab.ability+" Lv."+ab.tier,".hvut-ab-tooltip"])
			);
		});
	});
	var table = _ab.calc.node.table;
	table.innerHTML = "";
	table.appendChild(frag);
},

run : function(list=_ab.preset.CURRENT) {
	_ab.calc.init();
	var node = _ab.calc.node;
	if(!node.div.parentNode) {
		$id("mainpane").appendChild(node.div);
	}

	_ab.calc.list.forEach(function(e){
		node[e].classList.add("hvut-ab-off");
	});
	list.forEach(function(e){
		node[e].classList.remove("hvut-ab-off");
	});
	_ab.calc.list = list.slice();

	_ab.calc.table();
},

toggle : function(e) {
	var btn = e.target,
		ab = btn.dataset.ab,
		list = _ab.calc.list;
	if(!ab) {
		return;
	}
	if(list.includes(ab)) {
		list.splice(list.indexOf(ab),1);
	} else {
		list.push(ab);
	}
	btn.classList.toggle("hvut-ab-off");

	_ab.calc.table();
},

};


GM_addStyle(`
	.hvut-ab-slot {position:absolute; bottom:-5px; left:2px; width:30px; color:#fff}
	.hvut-ab-max {background-color:rgba(0,0,102,.8)}
	.hvut-ab-limit {background-color:rgba(0,51,204,.8)}
	.hvut-ab-not {background-color:rgba(102,0,0,.8)}
	.hvut-ab-up {background-color:rgba(0,102,0,.8)}

	.hvut-ab-bar {line-height:30px; font-size:10pt}
	.hvut-ab-bu {color:#000; display:block}
	.hvut-ab-bux {color:#999; display:block; cursor:not-allowed}
	.hvut-ab-bx {color:#999}

	.hvut-ab-unset {color:#f00}
`);

$qsa("#ability_top div[onmouseover*=overability]").forEach(function(div){
	var exec = /overability\(\d+, '([^']+)'.+?(?:(Not Acquired)|Requires <strong>Level (\d+))/.exec(div.getAttribute("onmouseover")),
		name = exec[1],
		ab = _ab.data[name];

	ab.level = exec[2] ? 0 : ab.tier.indexOf(parseInt(exec[3])) + 1;
	ab.max = ab.tier.length;
	ab.limit = ab.tier.findIndex(e=>e>_player.level);

	_ab.preset.CURRENT.push(name);
	if(ab.level) {
		_ab.level[name] = ab.level;
	}

	var span = $element("span",div,[".hvut-ab-slot"]);
	if(ab.level === ab.max) {
		span.textContent = "max";
		span.classList.add("hvut-ab-max");
	} else if(ab.level === ab.limit) {
		span.textContent = ab.level+"/"+ab.max;
		span.classList.add("hvut-ab-limit");
	} else if(ab.level === 0) {
		span.textContent = ab.level+"/"+ab.max;
		span.classList.add("hvut-ab-not");
	} else {
		span.textContent = ab.level+"/"+ab.max;
		span.classList.add("hvut-ab-up");
	}
});
setValue("ab_level",_ab.level);

$qsa("#ability_treepane > div").forEach(function(div){
	var name = div.firstElementChild.textContent,
		ab = _ab.data[name],
		point = _ab.point;

	ab.div = div;
	ab.id = /do_unlock_ability\((\d+)\)/.test(div.children[2].getAttribute("onclick")||"") && RegExp.$1;
	ab._level = 0;

	Array.from(div.children[2].children).forEach(function(button,i){
		var type = /(.)\.png/.test(button.style.backgroundImage) && RegExp.$1;
		if(!type) {
			return;
		}
		button.classList.add("hvut-ab-bar");

		if(type === "f") {
			ab._level++;
		} else if(type === "u") {
			point -= ab.point[i];
			if(point < 0) {
				$element("span",button,[".hvut-ab-bux"," "+ab.point[i]]);
			} else {
				$element("span",button,[".hvut-ab-bu"," "+ab.point[i]]);
				button.addEventListener("click",function(e){e.stopPropagation();_ab.unlock(ab,i+1);},true);
			}
		} else if(type === "x") {
			$element("span",button,[".hvut-ab-bx"," "+ab.point[i]+" ("+ab.tier[i]+")"]);
		}
	});

	if(ab._level && !ab.level) {
		div.firstElementChild.firstElementChild.classList.add("hvut-ab-unset");
	}
});

$element("input",$id("mainpane"),{type:"button",value:"Ability Point Calculator",style:"position:absolute;top:55px;left:10px;width:80px;padding:5px;white-space:normal"},function(){_ab.calc.run();});

} else
// [END 3] Character - Abilities */


//* [4] Character - Training
if(settings.training && _query.s==="Character" && _query.ss==="tr") {

_tr.data = {
	"Adept Learner":{id:50,b:100,l:50,e:0.000417446},
	"Assimilator":{id:51,b:50000,l:50000,e:0.0057969565},
	"Ability Boost":{id:80,b:100,l:100,e:0.0005548607},
	"Manifest Destiny":{id:81,b:1000000,l:1000000,e:0},
	"Scavenger":{id:70,b:500,l:500,e:0.0088310825},
	"Luck of the Draw":{id:71,b:2000,l:2000,e:0.0168750623},
	"Quartermaster":{id:72,b:5000,l:5000,e:0.017883894},
	"Archaeologist":{id:73,b:25000,l:25000,e:0.030981982},
	"Metabolism":{id:84,b:1000000,l:1000000,e:0},
	"Inspiration":{id:85,b:2000000,l:2000000,e:0},
	"Scholar of War":{id:90,b:30000,l:10000,e:0,disabled:true},
	"Tincture":{id:91,b:30000,l:10000,e:0,disabled:true},
	"Pack Rat":{id:98,b:10000,l:10000,e:0,disabled:true},
	"Dissociation":{id:88,b:1000000,l:1000000,e:0},
	"Set Collector":{id:96,b:12500,l:12500,e:0}
};

_tr.change = function(name,level) {
	var data = _tr.data[name];
	if(!data || data.disabled) {
		_tr.node.select.value = "";
		_tr.node.level.value = "";
		_tr.node.level.disabled = true;
		_tr.node.cost.value = "";
		return;
	}
	if(!level) {
		level = data.level;
	}
	_tr.node.select.value = name;
	_tr.node.level.value = level;
	_tr.node.level.min = data.level;
	_tr.node.level.max = data.max;
	_tr.node.level.disabled = false;
	_tr.calc();
};

_tr.calc = function() {
	var name = _tr.node.select.value,
		to = parseInt(_tr.node.level.value);
	if(!name || !to) {
		return;
	}

	var data = _tr.data[name],
		level = data.level,
		b = data.b,
		l = data.l,
		e = data.e,
		c = 0;

	if(name === _tr.current) {
		level++;
	}

	while(level < to) {
		c += Math.round(Math.pow(b+l*level,1+e*level));
		level++;
	}

	_tr.node.cost.value = c.toLocaleString();
};

_tr.set = function(reload) {
	if(_tr.node.select.value) {
		_tr.json.next_name = _tr.node.select.value;
		_tr.json.next_level = parseInt(_tr.node.level.value);
		_tr.json.next_id = _tr.data[_tr.node.select.value].id;
	} else {
		_tr.json.next_name = "";
		_tr.json.next_level = 0;
		_tr.json.next_id = 0;
	}
	setValue("tr_save",_tr.json);

	if(reload) {
		location.href = location.href;
	}
};

_tr.cancel = function(reload) {
	_tr.node.select.value = "";
	_tr.set(reload);
};

GM_addStyle(`
	#train_table > tbody > tr > td:nth-child(9) {width:100px; padding:0 10px; font-size:12pt; text-align:right}
`);

_tr.node = {};
_tr.node.div = $element("div",[$id("train_outer"),0],["!margin:5px"+(settings.trainingTimer?"":";display:none")]);
_tr.node.select = $element("select",_tr.node.div,null,{change:function(){_tr.change(this.value);}});
_tr.node.level = $element("input",_tr.node.div,{type:"number",disabled:true,style:"width:50px;text-align:right"},{input:_tr.calc});
$element("input",_tr.node.div,{type:"button",value:"Set"},function(){_tr.set(true);});
_tr.node.cost = $element("input",_tr.node.div,{readOnly:true,style:"width:80px;text-align:right;margin:0 20px"});
$element("input",_tr.node.div,{type:"button",value:"Cancel Reservation"},function(){_tr.cancel(true);});

_tr.json = getValue("tr_save",{});
_tr.current = $id("train_progress") && $qs("#train_progress > div:nth-child(2) > :first-child").textContent;
_tr.level = {};
_tr.spent = 0;

$element("option",_tr.node.select,{text:"-- RESERVE TRAINING --",value:""});

if($id("train_progress")) {
	confirm_event($qs("img[src$='/canceltrain.png']"),"click","Are you sure you want to cancel the current training?",null,function(){_tr.cancel();});
}

Array.from($id("train_table").rows).forEach(function(tr,i){
	if(!i) {
		$element("th",tr);
		$element("th",tr,[" Spent Credits","!font-size:10pt;text-align:center"]);
		return;
	}
	var cells = tr.cells,
		name = cells[0].textContent.trim(),
		level = parseInt(cells[4].textContent),
		max = parseInt(cells[6].textContent),
		td = $element("td",tr);

	_tr.level[name] = level;

	var data = _tr.data[name];
	if(!data) {
		return;
	}
	data.level = level;
	data.max = max;
	if(!data.disabled) {
		$element("option",_tr.node.select,{text:name,value:name});
		cells[0].firstElementChild.firstElementChild.style.cursor = "pointer";
		cells[0].firstElementChild.firstElementChild.addEventListener("click",function(){_tr.change(name);});
	}

	var spent = 0;
	while(level--) {
		spent += Math.round(Math.pow(data.b+data.l*level,1+data.e*level));
	}
	_tr.spent += spent;
	td.textContent = spent.toLocaleString();
});
setValue("tr_level",_tr.level);
$element("td",$element("tr",$id("train_table")),{textContent:"Total "+_tr.spent.toLocaleString(),style:"padding:5px 10px;font-size:12pt;font-weight:bold;text-align:right",colSpan:9});

if(_tr.current && _tr.data[_tr.current]) {
	_tr.json.current_name = _tr.current;
	_tr.json.current_level = _tr.data[_tr.current].level;
	_tr.json.current_end = _window.end_time*1000;
} else {
	_tr.json.current_name = "";
	_tr.json.current_level = 0;
	_tr.json.current_end = 0;
}
if(_tr.json.next_name) {
	if(_tr.data[_tr.json.next_name].level < _tr.json.next_level) {
		_tr.change(_tr.json.next_name,_tr.json.next_level);
	} else {
		_tr.json.next_name = "";
		_tr.json.next_level = 0;
		_tr.json.next_id = 0;
	}
}
_tr.json.error = "";
setValue("tr_save",_tr.json);

} else
// [END 4] Character - Training */


//* [5] Character - Item Inventory
if(settings.itemInventory && _query.s==="Character" && _query.ss==="it") {

_it.inventory = {};
_it.node = {};
_it.template = getValue("it_template",settings.itemCodeTemplate);

_it.edit_price = function(tag) {
	if(tag === "//") {
		return;
	} else if(tag === "//RESET") {
		if(confirm("Are you sure you want to reset prices of items?")) {
			$prices.reset();
		}
		return;
	}
	_it.node.selector.value = tag;
	_it.node.selector.blur();

	popup_text($prices.json2str(tag),"width:300px;min-height:300px;max-height:500px",
	[{v:"Save",f:function(w,t){
		var json = $prices.str2json(t.value),
			error = json["//ERROR"];
		if(error) {
			alert("!!! ERROR\n\n"+error);
			return;
		}
		$prices.set(tag,json);
		w.remove();
	}}]);
};

_it.edit_template = function() {
	popup_text(_it.template,"width:500px;height:500px;white-space:pre",
	[{v:"Save Template",f:function(w,t){
		_it.template = t.value || settings.itemCodeTemplate;
		setValue("it_template",_it.template);
		w.remove();
		_it.node.wts.remove();
		_it.wts();
	}}]);
};

_it.wts = function() {
	var prices = $prices.get("WTS"),
		code = [],
		option = {
			"BBCode": "{$zero:[color=transparent]$zero[/color]}{$count} x {$name}{$price: @ $price}",
			"unpricedCode": "{$zero}{$count} x {$name} (offer)",
			"stockoutCode": "[color=#ccc][s]{$zero}{$count} x {$name}{$price: @ $price}[/s][/color]",
		};

	_it.template.split("\n").forEach(function(str){
		if(str.startsWith("//")) {
			str = str.substr(2);
			if(/^\s*set (\w+)\s*=\s*([^;]*)/.test(str)) {
				var o = RegExp.$1,
					v = RegExp.$2;
				if(o === "keepStock" && /^min\((.+)\)/.test(v)) {
					v = Math.min(...RegExp.$1.split(",").map(c=>{c=_it.inventory[c.trim()];return c?c.count:0;}));
				}
				option[o] = v&&!isNaN(v) ? Number(v) : v;
			}
			return;
		}

		if(/\{([^{}]+)\}/.test(str)) {
			var name = RegExp.$1,
				item = _it.inventory[name] || {},
				count = item.count || 0,
				zero,
				price = prices[name];

			if(option.keepStock) {
				count = Math.max(0,count-option.keepStock);
			}
			if(!option.unpricedCode && !prices.hasOwnProperty(name) || !option.stockoutCode && !count) {
				code.push("__SKIP__");
				return;
			}
			if((zero=option.padCountWithZero-count.toString().length) > 0) {
				zero = "0".repeat(zero);
			} else {
				zero = undefined;
			}
			if(price >= 1000000) {
				price = price/1000000 + "m";
			} else if(price >= 1000) {
				price = price/1000 + "k";
			}

			var replace = {name:name,count:count,zero:zero,price:price},
				bbcode = !count?option.stockoutCode: !prices.hasOwnProperty(name)?option.unpricedCode: option.BBCode,
				text = bbcode.toString().replace(/\{\$(\w+)(?::(.*?))?\}/g,function(s,a,b){var r=replace[a];return r===undefined?"" : b===undefined?r : b.replace(/\$(\w+)/g,(s,a)=>{var r=replace[a];return r===undefined?"":r;});}).trim();
			code.push(str.replace("{"+name+"}",text));

		} else {
			code.push(str);
		}
	});
	code = code.join("\n").replace(/(?:__SKIP__|\n)+/g,s=>s.split("__SKIP__").sort().pop());

	_it.node.wts = popup_text(code,"width:500px;height:500px;white-space:pre",[{v:"Edit Template",f:function(){_it.edit_template();}}]);
};

_it.crystal = function() {
	var pa = ["Vigor","Finesse","Swiftness","Fortitude","Cunning","Knowledge"],
		er = ["Flames","Frost","Lightning","Tempest","Devotion","Corruption"],
		stock = {};
	[].concat(pa,er).forEach(function(c){stock[c]=(_it.inventory["Crystal of "+c]||{count:0}).count;});

	var pa_avg = Math.round(pa.reduce((p,c)=>p+stock[c],0)/pa.length),
		er_avg = Math.round(er.reduce((p,c)=>p+stock[c],0)/er.length),
		pa_surplus = [],
		er_surplus = [],
		pa_shortage = [],
		er_shortage = [];

	pa.forEach(function(c){
		var m = stock[c] - pa_avg;
		if(m > 0) {
			pa_surplus.push((m)+" x Crystal of "+c);
		} else if(m < 0) {
			pa_shortage.push((-m)+" x Crystal of "+c);
		}
	});

	er.forEach(function(c){
		var m = stock[c] - er_avg;
		if(m > 0) {
			er_surplus.push((m)+" x Crystal of "+c);
		} else if(m < 0) {
			er_shortage.push((-m)+" x Crystal of "+c);
		}
	});

	popup_text([
		"[Primary attributes]","",
		"[I have]",
		...pa_surplus,"",
		"[I want]",
		...pa_shortage,"","",
		"[Elemental mitigation]","",
		"[I have]",
		...er_surplus,"",
		"[I want]",
		...er_shortage
	],"width:300px;max-height:500px;white-space:pre");
};


GM_addStyle(`
	.nosel {user-select:auto !important; -webkit-user-select:auto !important; -moz-user-select:auto !important}
	#item_left {width:410px}
	#item_right {width:605px}
	#item_slots {height:550px; margin-top:70px}
	#item_slots > div {width:300px}
	.sa {height:30px}
	.sa > div:first-child {padding:5px 20px}
	.sa > div:last-child {height:30px}
	.sa > div:last-child > div {padding:5px}
`);

$qsa("#inv_item .itemlist tr").forEach(function(tr){
	var name = tr.cells[0].firstElementChild,
		type = /'([^']+)'\)/.test(name.getAttribute("onmouseover")) && RegExp.$1.replace(/\W/g,"_") || "Consumable",
		count = parseInt(tr.cells[1].textContent);
	name = name.textContent.trim();

	_it.inventory[name] = {count:count,type:type};
	tr.classList.add("hvut-it-"+type);
});
_it.inventory["Crystal Pack"] = {type:"Crystal",count:Math.floor(Math.min(...["Vigor","Finesse","Swiftness","Fortitude","Cunning","Knowledge","Flames","Frost","Lightning","Tempest","Devotion","Corruption"].map(c=>{c=_it.inventory["Crystal of "+c];return c?c.count:0;}))/1000)};


_it.node.buttons = $element("div",$id("item_right"),["!position:absolute;top:30px;left:0px;width:680px;text-align:left"]);

_it.node.selector = $element("select",_it.node.buttons,null,{change:function(){_it.edit_price(_it.node.selector.value);}});
$element("option",_it.node.selector,{text:"-- EDIT PRICE --",value:"//"});
$prices.init();
for(let i in $prices.json) {
	$element("option",_it.node.selector,{text:i,value:i});
}
$element("option",_it.node.selector,{text:"-- RESET --",value:"//RESET"});

$element("input",_it.node.buttons,{type:"button",value:"WTS Code"},_it.wts);

if(settings.itemInventoryCrystalExchange) {
	$element("input",_it.node.buttons,{type:"button",value:"Crystal Distribution"},_it.crystal);
}

} else
// [END 5] Character - Item Inventory */


//* [6] Character - Equip Inventory
if(settings.equipInventory && _query.s==="Character" && _query.ss==="in") {

_in.filter = _query.filter || "1handed";
_in.simple_token = _window.simple_token;
_in.uid = _window.uid;
_in.json = getValue("in_json",{});
_in.group = {"1handed":{},"2handed":{},"staff":{},"shield":{},"acloth":{},"alight":{},"aheavy":{}};
_in.node = {};

_in.list = function(outer,filter) {
	var list = $equip.list(outer,1,_in.group[filter].div);
	_in.check_name(list);

	list.forEach(function(eq){
		eq.json = _in.json[eq.info.eid] || {};
		eq.node.sub = $element("div",[eq.node.wrapper,0],[".hvut-in-sub"+(eq.info.tradeable?"":" hvut-in-untrade")]);
		eq.node.eid = $element("span",eq.node.sub,[" "+eq.info.eid,".hvut-in-eid"]);
		eq.node.check = $element("input",eq.node.sub,{type:"checkbox",checked:eq.json.checked});
		eq.node.price = $element("input",eq.node.sub,{className:"hvut-in-price",placeholder:"price",value:eq.json.price||""});
		eq.node.note = $element("input",eq.node.sub,{className:"hvut-in-note",placeholder:"note",value:eq.json.note||""});
		//$equip.parse.percentile(eq);
		//console.log(eq.info.name,eq);
	});
	return list;
};

_in.bbcode = function() {
	var list = [],
		code = "";

	for(let g in _in.group) {
		list = list.concat(_in.group[g].list.filter(e=>e.node.check.checked));
	}

	list.sort(function(a,b){
		var sorter = $equip.sort;
		if(a.info.category !== b.info.category) {
			return sorter.category[a.info.category] - sorter.category[b.info.category];
		} else if(a.info.category === "Obsolete") {
			return a.info.name>b.info.name?1 : a.info.name<b.info.name?-1 : 0;
		} else if(a.info.type !== b.info.type) {
			return sorter.type[a.info.type] - sorter.type[b.info.type];
		}

		var sortkey =
			(a.info.category==="One-handed Weapon" || a.info.category==="Two-handed Weapon") ? ["suffix","quality","prefix"] :
			a.info.category==="Staff" ? ["prefix","suffix","quality"] :
			a.info.category==="Shield" ? ["quality","suffix","prefix"] :
								["suffix","slot","quality","prefix"];

		var r = 0;
		sortkey.some(function(e){
			if(sorter.hasOwnProperty(e)) {
				r = (sorter[e][a.info[e]]||99) - (sorter[e][b.info[e]]||99);
			} else {
				r = a.info[e]>b.info[e]?1 : a.info[e]<b.info[e]?-1 : 0;
			}

			if(r) {
				return true;
			} else {
				return false;
			}
		});

		return r || (b.info.eid-a.info.eid);
	});

	list.forEach(function(eq,i,a){
		var p = a[i-1] || {info:{}};
		if(eq.info.category !== p.info.category) {
			code += "\n\n\n[size=3][b][" + eq.info.category + "][/b][/size]\n";
		}

		switch(eq.info.category) {

		case "Obsolete":
			break;

		case "One-handed Weapon":
		case "Two-handed Weapon":
			if(eq.info.type !== p.info.type) {
				code += "\n\n[size=2][b][" + eq.info.type + "][/b][/size]\n\n";
			} else if(eq.info.suffix !== p.info.suffix) {
				code += "\n";
			}
			break;

		case "Staff":
			if(eq.info.type !== p.info.type) {
				code += "\n\n[size=2][b][" + eq.info.type + "][/b][/size]\n\n";
			} else if(eq.info.prefix !== p.info.prefix) {
				code += "\n";
			}
			break;

		case "Shield":
			if(eq.info.type !== p.info.type) {
				code += "\n\n[size=2][b][" + eq.info.type + "][/b][/size]\n\n";
			}
			break;

		default: // armors
			if(eq.info.type!==p.info.type || eq.info.suffix!==p.info.suffix) {
				code += "\n\n[size=2][b][" + eq.info.suffix + "][/b][/size]\n\n";
			} else if(eq.info.slot !== p.info.slot) {
				//code += "\n";
			}

		}

		if(!eq.data.bbcode) {
			var eid_pad = 9 - eq.info.eid.toString().length;
			eq.data._eid = (eid_pad>0?"[color=transparent]"+"_".repeat(eid_pad)+"[/color]":"") + eq.info.eid;
			eq.data.url = "https://hentaiverse.org/equip/"+eq.info.eid+"/"+eq.info.key;
			eq.data.bbcode = $equip.bbcode(eq);
		}

		code += settings.equipCode.replace(/\{\$(\w+)(?::(.*?))?\}/g,function(s,a,b){var r=eq.info.hasOwnProperty(a)?eq.info[a]:eq.data.hasOwnProperty(a)?eq.data[a]:eq.node[a]?eq.node[a].value||undefined:undefined;return r===undefined?"" : b===undefined?r : b.replace(/\$(\w+)/g,(s,a)=>{var r=eq.info.hasOwnProperty(a)?eq.info[a]:eq.data.hasOwnProperty(a)?eq.data[a]:eq.node[a]?eq.node[a].value||undefined:undefined;return r===undefined?"":r;});}).trim() + "\n";
	});

	popup_text(code.trim()||"No equipment selected.","width:1000px;max-height:500px;white-space:pre");
};

_in.save = function() {
	var json = {};
	for(let g in _in.group) {
		_in.group[g].list.forEach(function(eq){
			json[eq.info.eid] = {checked:eq.node.check.checked,price:eq.node.price.value,note:eq.node.note.value};
		});
	}
	_in.json = json;
	setValue("in_json",json);
};

_in.revert = function() {
	for(let g in _in.group) {
		_in.group[g].list.forEach(function(eq){
			var j = _in.json[eq.info.eid] || {};
			eq.node.check.checked = j.checked;
			eq.node.price.value = j.price || "";
			eq.node.note.value = j.note || "";
		});
	}
};

_in.sort = function(key) {
	var func =
		key==="name" ? function(a,b){return ($equip.sort.quality[a.info.quality]-$equip.sort.quality[b.info.quality]) || (a.info.name>b.info.name?1:a.info.name<b.info.name?-1:b.info.eid-a.info.eid);} :
		key==="eid" ? function(a,b){return b.info.eid-a.info.eid;} :
		null;
	Object.keys(_in.group).forEach(function(f){
		var div = _in.group[f].div;
		div.style.display = "none";
		div.innerHTML = "";
		_in.group[f].list.sort(func);
		_in.group[f].list.forEach(function(eq){
			eq.node.wrapper.classList.remove("hvut-eq-border");
			div.appendChild(eq.node.wrapper);
		});
		div.style.display = "";
	});
};

_in.check_name = function(list) {
	var count = list.length;
	list.forEach(function(eq){
		if(eq.info.tier < 10 || eq.info.basename) {
			count--;
		} else {
			$ajax.send("GET","/equip/"+eq.info.eid+"/"+eq.info.key,null,function(r){
				var basename = Array.from( substring(r.responseText,"<div><div",'<div id="equip_extended">',true).lastElementChild.firstElementChild.children ).map(e=>e.textContent).join(" ").replace(/\s+/g," ").replace(/\b(?:The|Of)\b/g,e=>e.toLowerCase());

				$equip.basename[eq.info.eid] = eq.info.name = basename;

				if(!--count) {
					setValue("equip_name",$equip.basename);
				}
			});
		}
	});
};


if(settings.equipInventoryIntegration) {
	GM_addStyle(`
		#filterbar > div {width:125px !important}
	`);
	let filterbar = $id("filterbar");
	$element("div",[filterbar,0],[" All","!font-size:10pt;cursor:pointer"],function(){location.href="/?s=Character&ss=in";});
	if(_query.filter) {
		filterbar.children[0].classList.add("cfb");
	} else {
		filterbar.children[0].classList.add("cfbs");
		filterbar.children[1].classList.add("cfb");
		filterbar.children[1].classList.remove("cfbs");
	}
}

if(_query.filter || !settings.equipInventoryIntegration) {
	$equip.list($id("inv_equip"),1);
	$equip.list($id("inv_eqstor"),1);

} else {

	GM_addStyle(`
		#eqinv_outer {width:1140px; margin:0 0 0 80px}
		.eqinv_pane {margin:0 10px}
		.eqinv_pane > div:first-child {display:none}
		.cspp {margin-top:15px}
		.equiplist {margin:0 5px}
		.eqp {width:auto}
		#popup_box {left:285px !important; top:200px !important}
		#popup_box.hvut-in-popup {left:625px !important; top:200px !important}
		.hvut-in-side {position:absolute; top:95px; left:10px; width:70px; text-align:left}
		.hvut-in-side > input {width:100%; padding:3px; white-space:normal}
		.hvut-in-side > label {color:#000; white-space:nowrap}
		.hvut-in-top {position:absolute; top:5px; left:0; width:100%; height:19px; text-align:center; font-size:10pt}
		.hvut-in-top > span {margin:10px; padding:0 5px; border:1px solid; cursor:pointer; font-weight:bold}
		.hvut-in-top > span:hover {background-color:#fff}
		.hvut-in-sub {position:absolute; right:0; margin:0 !important; z-index:1}
		.hvut-in-sub > * {vertical-align:top}
		.hvut-in-untrade > * {color:#c00}
		.hvut-in-untrade > input::placeholder {color:#c99; opacity:1}
		.hvut-in-eid {display:none; padding:0 3px; border:1px solid; line-height:20px; background-color:#fff}
		.equiplist > div:hover .hvut-in-eid {display:inline-block}
		.hvut-in-price {width:40px; text-align:right}
		.hvut-in-note {width:70px}` +
		(settings.equipInventoryPrice?"":".hvut-in-price {display:none}") +
		(settings.equipInventoryNote?"":".hvut-in-note {display:none}")
	);

	$id("inv_equip").addEventListener("mouseenter",function(){$id("popup_box").classList.add("hvut-in-popup");});
	$id("inv_eqstor").addEventListener("mouseenter",function(){$id("popup_box").classList.remove("hvut-in-popup");});

	_in.node.inven_top = $element("div",[$id("inv_equip").parentNode,0],[".hvut-in-top"]);
	_in.node.storage_top = $element("div",[$id("inv_eqstor").parentNode,0],[".hvut-in-top"]);

	_in.group["1handed"].scroll = $element("span",_in.node.inven_top,$equip.alias["1handed"],function(){scrollIntoView(_in.group["1handed"].header);});
	_in.group["1handed"].header = $element("h4",$id("inv_equip"),[" "+$equip.alias["1handed"],".hvut-eq-category"]);
	_in.group["1handed"].div = $element("div",$id("inv_equip"),[".equiplist"]);

	["2handed","staff","shield"].forEach(function(f){
		_in.group[f].scroll = $element("span",_in.node.inven_top,$equip.alias[f],function(){scrollIntoView(_in.group[f].header);});
		_in.group[f].header = $element("h4",$id("inv_equip"),[" "+$equip.alias[f]+": LOADING",".hvut-eq-category"]);
		_in.group[f].div = $element("div",$id("inv_equip"),[".equiplist"]);
	});

	["acloth","alight","aheavy"].forEach(function(f){
		_in.group[f].scroll = $element("span",_in.node.storage_top,$equip.alias[f],function(){scrollIntoView(_in.group[f].header);});
		_in.group[f].header = $element("h4",$id("inv_eqstor"),[" "+$equip.alias[f]+": LOADING",".hvut-eq-category"]);
		_in.group[f].div = $element("div",$id("inv_eqstor"),[".equiplist"]);
	});

	_in.tab_loaded = 1;

	_in.group["1handed"].list = _in.list($id("eqinv_outer"),"1handed");
	["2handed","staff","shield","acloth","alight","aheavy"].forEach(function(f){
		$ajax.send("GET","/?s=Character&ss=in&filter="+f,null,
			function(r){
				var html = r.responseText;

				Object.assign($equip.dynjs_eqstore, JSON.parse( substring(html,["var dynjs_eqstore = ",true],";\n") ));
				_in.group[f].list = _in.list( substring(html,'<div class="eqinv_pane">','<div id="eqinv_bot">',true), f);
				_in.group[f].header.textContent = $equip.alias[f];

				if(++_in.tab_loaded === 7) {
					//if(navigator.userAgent.includes("Firefox")) {// unsafeWindow
					//	window.eval("dynjs_eqstore="+JSON.stringify($equip.dynjs_eqstore));
					//}

					_in.node.side = $element("div",$id("eqinv_outer"),[".hvut-in-side"]);

					$element("input",_in.node.side,{type:"button",value:"sort by category"},function(){Object.keys(_in.group).forEach(function(f){$equip.list(_in.group[f].div,1);});});
					$element("input",_in.node.side,{type:"button",value:"sort by name"},function(){_in.sort("name");});
					$element("input",_in.node.side,{type:"button",value:"sort by eid"},function(){_in.sort("eid");});
					$element("br",_in.node.side);
					$element("br",_in.node.side);
					$element("input",_in.node.side,{type:"button",value:"WTS Code"},_in.bbcode);
					$element("br",_in.node.side);
					$element("input", [$element("label",_in.node.side,"All"),0] , {type:"checkbox"}, function(){
						var c = this.checked;
						for(let g in _in.group) {
							_in.group[g].list.forEach(function(eq){eq.node.check.checked=c;});
						}
					});
					$element("br",_in.node.side);
					$element("input", [$element("label",_in.node.side,"Tradeables"),0] , {type:"checkbox"}, function(){
						var c = this.checked;
						for(let g in _in.group) {
							_in.group[g].list.forEach(function(eq){if(eq.info.tradeable){eq.node.check.checked=c;}});
						}
					});
					$element("br",_in.node.side);
					$element("input", [$element("label",_in.node.side,"Reverse"),0] , {type:"checkbox"}, function(){
						for(let g in _in.group) {
							_in.group[g].list.forEach(function(eq){eq.node.check.checked=!eq.node.check.checked;});
						}
					});
					$element("br",_in.node.side);
					$element("input",_in.node.side,{type:"button",value:"Save"},_in.save);
					$element("br",_in.node.side);
					$element("input",_in.node.side,{type:"button",value:"Revert"},_in.revert);
				}
			},
			function(){_in.group[f].header.textContent = $equip.alias[f] + ": ERROR";}
		);
	});
}

} else
// [END 6] Character - Equip Inventory */


//* [7] Character - Settings
if(settings.settings && _query.s==="Character" && _query.ss==="se") {

_se.form = $qs("#settings_outer form");
_se.elements = Array.from(_se.form.elements);
_se.data = getValue("se_data",{});
_se.node = {};

_se.save = function() {
	var name = prompt("Enter the title of settings");
	if(!name || !name.trim()) {
		return;
	}

	var json = {};
	_se.elements.forEach(function(e){
		if(e.disabled || e.type==="button" || e.type==="reset" || e.type==="image" || e.type==="submit") {
			return;
		}

		var value = e.value;
		if(e.type === "checkbox") {
			if(!e.checked) {
				return;
			}
			value = e.checked;

		} else if(e.type === "radio") {
			if(!e.checked) {
				return;
			}
		}

		json[e.name] = value;
	});

	_se.data[name.trim()] = json;
	setValue("se_data",_se.data);
	_se.add(name);
};
_se.change = function() {
	var name = this.dataset.se,
		json = _se.data[name];
	_se.elements.forEach(function(e){
		if(e.type==="button" || e.type==="reset" || e.type==="image" || e.type==="submit") {
			return;
		}
		if(e.type === "checkbox") {
			e.checked = json[e.name];
		} else if(e.type === "radio") {
			e.checked = json[e.name] === e.value;
		} else {
			e.value = json[e.name];
		}
	});
};
_se.add = function(name) {
	_se.node[name] = $element("input",_se.div,{type:"button",value:name,dataset:{se:name},className:"hvut-se-button"},_se.change);
	$element("input",_se.div,{type:"button",value:"X",dataset:{se:name},className:"hvut-se-remove"},_se.remove);
};
_se.remove = function() {
	var name = this.dataset.se;
	delete _se.data[name];
	setValue("se_data",_se.data);
	_se.node[name].nextElementSibling.remove();
	_se.node[name].remove();
};


GM_addStyle(`
	.hvut-se-div {margin-top:20px; padding:20px 0; border-top:3px double; text-align:left}
	.hvut-se-div input {line-height:15pt}
	.hvut-se-button {margin-left:20px}
	.hvut-se-remove {visibility:hidden; margin-left:-1px}
	.hvut-se-button:hover + .hvut-se-remove, .hvut-se-remove:hover {visibility:visible}
`);

_se.div = $element("div",_se.form,[".hvut-se-div"]);
$element("input",_se.div,{type:"button",value:"Save current settings",style:"font-weight:bold;margin-right:50px"},_se.save);

Object.keys(_se.data).forEach(function(p){
	_se.add(p);
});

_se.elements.forEach(function(e){
	if(e.nodeName === "SELECT") {
		var value = e.value,
			options = Array.from(e.options),
			frag = $element();
		options.sort((a,b)=>a.value-b.value);
		options.forEach(function(o){
			frag.appendChild(o);
		});
		e.appendChild(frag);
		e.value = value;
	}
});


_se.form.fontlocal.required = true;
_se.form.fontface.required = true;
_se.form.fontsize.required = true;
_se.form.fontface.placeholder = "Tahoma, Arial";
_se.form.fontsize.placeholder = "10";
_se.form.fontoff.placeholder = "0";

} else
// [END 7] Character - Settings */


//* [8] Bazaar - Equipment Shop
if(settings.equipmentShop && _query.s==="Bazaar" && _query.ss==="es") {

_es.filter = _query.filter || "1handed";
_es.mat_type = {"1handed":"Metal","2handed":"Metal","staff":"Wood","shield":"Wood","acloth":"Cloth","alight":"Leather","aheavy":"Metal"};
_es.quality = {"Flimsy":1,"Crude":2,"Fair":3,"Average":4,"Fine":5,"Superior":6,"Exquisite":7,"Magnificent":8,"Legendary":9,"Peerless":10};

_es.item_pane = [];
_es.shop_pane = [];
_es.group = {};

_es.uid = _window.uid;
_es.simple_token = _window.simple_token;
_es.storetoken = $id("shopform").elements.storetoken.value;

_es.showequip = function(eq) {
	var box = $id("popup_box");
	box.innerHTML = "";
	box.style.top = "100px";
	box.style.left = "230px";
	box.style.width = "380px";
	box.style.height = "510px";
	box.style.visibility = "visible";
	$element("iframe",box,{src:"/equip/"+eq.info.eid+"/"+eq.info.key,style:"border:0; width:100%; height:100%; overflow:hidden"});
};

_es.transfer = function(eq,equipgroup="inv_equip") {
	if(eq.data.sold) {
		return;
	}
	eq.data.sold = true;
	eq.node.check.checked = false;
	eq.node.check.disabled = true;
	eq.node.div.classList.add("hvut-es-disabled");
	eq.node.sub.classList.add("hvut-es-disabled");
	// "inv_equip": to storage, "inv_eqstor": to inventory
	$ajax.send("POST","/?s=Character&ss=in","equiplist="+eq.info.eid+"&equipgroup="+equipgroup,function(){eq.node.wrapper.remove();});
};


_es.sell = function(eq,skip) {
	if(eq.data.sold) {
		return;
	}
	if(eq.node.div.dataset.locked != "0") {
		alert("This item is locked.");
		return;
	}
	if(!skip && (settings.equipmentShopConfirm===2 || settings.equipmentShopConfirm===1&&eq.data.need_salvage || settings.equipmentShopConfirm>0&&eq.data.valuable) && !confirm("Are you sure you want to sell this for "+eq.data.value.toLocaleString()+" credits?\n\n["+eq.info.name+"]"+(eq.data.need_salvage?"\n\nSalvage would give you more credit value.":""))) {
		return;
	}
	eq.data.sold = true;
	eq.node.check.checked = false;
	eq.node.check.disabled = true;
	eq.node.div.classList.add("hvut-es-disabled");
	eq.node.sub.classList.add("hvut-es-disabled");
	$ajax.send("POST","/?s=Bazaar&ss=es","storetoken="+_es.storetoken+"&select_group=item_pane&select_eids="+eq.info.eid,function(){eq.node.wrapper.remove();});
};

_es.salvage = function(eq,skip) {
	if(eq.data.sold) {
		return;
	}
	if(eq.node.div.dataset.locked != "0") {
		alert("This item is locked.");
		return;
	}
	if(!skip && (settings.equipmentShopConfirm===2 || settings.equipmentShopConfirm===1&&!eq.data.need_salvage || settings.equipmentShopConfirm>0&&eq.data.valuable) && !confirm("Are you sure you want to salvage this?\n\n["+eq.info.name+"]"+(!eq.data.need_salvage?"\n\nSell would give you more credit value.":""))) {
		return;
	}
	eq.data.sold = true;
	eq.node.check.checked = false;
	eq.node.check.disabled = true;
	eq.node.div.classList.add("hvut-es-disabled");
	eq.node.sub.classList.add("hvut-es-disabled");
	$ajax.send("POST","/?s=Forge&ss=sa&filter="+eq.data.filter,"select_item="+eq.info.eid,function(){eq.node.wrapper.remove();});
};

_es.sell_all = function() {
	var selected = [],
		valuable = [],
		salvage = [],
		sum = 0;

	_es.item_pane.forEach(function(eq){
		if(eq.data.sold || !eq.node.check.checked || eq.node.div.dataset.locked != "0") {
			return;
		}
		selected.push(eq);
		if(eq.data.valuable) {
			valuable.push(eq.info.name);
		} else if(eq.data.need_salvage) {
			salvage.push(eq.info.name);
		}
		sum += eq.data.value;
	});

	if(!selected.length || (settings.equipmentShopConfirm===2 || settings.equipmentShopConfirm===1&&salvage.length || valuable.length) && !confirm("Are you sure you wish to sell "+selected.length+" equipment piece"+(selected.length>1?"s":"")+" for "+(sum.toLocaleString())+" credits?"+(valuable.length?"\n\n[Possible valuable equimpent]\n\n"+valuable.join("\n"):"")+(salvage.length?"\n\n[Better to Salvage]\n"+salvage.join("\n"):""))) {
		return;
	}

	$ajax.send("POST","/?s=Bazaar&ss=es","storetoken="+_es.storetoken+"&select_group=item_pane&select_eids="+selected.map(eq=>eq.info.eid).join(","),function(){location.href=location.href;});
};

_es.salvage_all = function() {
	var selected = [],
		valuable = [],
		sell = [];

	_es.item_pane.forEach(function(eq){
		if(eq.data.sold || !eq.node.check.checked || eq.node.div.dataset.locked != "0") {
			return;
		}
		selected.push(eq);
		if(eq.data.valuable) {
			valuable.push(eq.info.name);
		} else if(!eq.data.need_salvage) {
			sell.push(eq.info.name);
		}
	});

	if(!selected.length || (settings.equipmentShopConfirm===2 || settings.equipmentShopConfirm===1&&sell.length || valuable.length) && !confirm("Are you sure you wish to salvage "+selected.length+" equipment piece"+(selected.length>1?"s":"")+"?"+(valuable.length?"\n\n[Possible valuable equimpent]\n\n"+valuable.join("\n"):"")+(sell.length?"\n\n[Better to Sell]\n"+sell.join("\n"):""))) {
		return;
	}

	selected.forEach(function(eq){
		_es.salvage(eq,true);
	});
};

_es.salvage_calc = function(eq,d) {
	var q = _es.quality[eq.info.quality],
		t = _es.mat_type[eq.data.filter],
		s = 0,
		g = "",
		e = 0,
		v = 0,
		value = eq.data.value,
		prices = $prices.get("Salvage");

	if(d) {
		value = Math.ceil(value/d);
	}

	if(!q) { // obsolete
	} else if(q < 6) {
		s = Math.ceil(value/100);
	} else {
		s = Math.ceil(value/500);
		g = q===6?"Low" : q===7?"Mid" : "High";
		v += (prices[g+"-Grade "+t.replace("Metal","Metals")] || 0);
	}
	s = Math.min(s,10);
	v += s * (prices["Scrap "+t] || 0);

	if(["Force Shield","Phase","Shade","Power"].includes(eq.info.type)) {
		e = s * 0.5;
		v += e * (prices["Energy Cell"] || 0);
	}

	eq.data.salvage = {t:t,s:s,g:g,e:e,value:v};
};


_es.shop_buy = function(eq,skip) {
	if(eq.data.sold || !skip && !confirm('Are you sure you wish to buy "'+eq.info.name+'" for '+eq.data.value.toLocaleString()+' credits?')) {
		return;
	}
	eq.data.sold = true;
	$ajax.send("POST","/?s=Bazaar&ss=es","storetoken="+_es.storetoken+"&select_group=shop_pane&select_eids="+eq.info.eid,function(){eq.node.wrapper.remove();});
};

_es.shop_salvage = function(eq,skip) {
	if(eq.data.sold || !skip && !confirm('Are you sure you wish to buy "'+eq.info.name+'" and then salvage it?')) {
		return;
	}
	eq.data.sold = true;
	eq.node.div.classList.add("hvut-es-disabled");
	eq.node.sub.classList.add("hvut-es-disabled");

	$ajax.send("POST","/?s=Bazaar&ss=es","storetoken="+_es.storetoken+"&select_group=shop_pane&select_eids="+eq.info.eid,
		function(){
			$ajax.send("JSON","/json",{type:"simple",method:"lockequip",uid:_es.uid,token:_es.simple_token,eid:eq.info.eid,lock:0},
				function(){
					$ajax.send("POST","/?s=Forge&ss=sa&filter="+eq.data.filter,"select_item="+eq.info.eid,
						function(){eq.node.wrapper.remove();},
						function(){alert("Failed to salvage the item");}
					);
				},
				function(){alert("Failed to unlock the item");}
			);
		},
		function(){alert("Failed to purchase the item");}
	);
};

_es.get_item_pane = function(pane,filter,append) {
	var list = $equip.list(pane);
	list.forEach(function(eq){
		eq.data.filter = filter;
		eq.data.valuable = $equip.filter(eq.info.name,settings.equipmentShopProtect);
		_es.salvage_calc(eq);

		eq.node.wrapper.classList.add("hvut-es-wrapper");
		eq.node.sub = $element("div",[eq.node.wrapper,0],[".hvut-es-sub"]);
		eq.node.check = $element("input",eq.node.sub,{type:"checkbox"});
		eq.node.sell = $element("span",eq.node.sub,"Sell "+eq.data.value,function(){_es.sell(eq);});
		eq.node.salvage = $element("span",eq.node.sub,"Salvage "+eq.data.salvage.value,function(){_es.salvage(eq);});

		if(eq.info.tier) {
			eq.data.valuable = true;
			$element("span",eq.node.sub,[" Level "+eq.info.tier,".hvut-es-tier"]);
		}
		if(eq.data.salvage.value > eq.data.value) {
			eq.data.need_salvage = true;
			eq.node.div.classList.add("hvut-es-salvage");
			eq.node.salvage.classList.add("hvut-es-bold");
		} else {
			eq.node.sell.classList.add("hvut-es-bold");
		}

		if(eq.data.valuable) {
			$element("span",[eq.node.sub,3],[" Transfer to Storage","!font-weight:bold"],function(){_es.transfer(eq);});
			_es.group["valuable"].item_div.appendChild(eq.node.wrapper);
			if(settings.equipmentShopAutoLock && eq.node.div.dataset.locked==="0") {
				eq.node.div.previousElementSibling.onclick();
			}
		} else if(append) {
			append.appendChild(eq.node.wrapper);
		}
	});
	_es.item_pane = _es.item_pane.concat(list);
};

_es.get_shop_pane = function(pane,filter,append) {
	$equip.list(pane).forEach(function(eq){
		eq.data.filter = filter;
		eq.node.sub = $element("div",null,[".hvut-es-sub"]);
		_es.salvage_calc(eq,5);

		var display;
		if($equip.filter(eq.info.name,settings.equipmentShopBazaar)) {
			display = true;
		}
		if(!eq.info.tradeable) {
			display = false;
		}
		if(eq.info.tier) {
			display = true;
			$element("span",eq.node.sub,[" Level "+eq.info.tier,".hvut-es-tier"],function(){_es.showequip(eq);});
		}
		if(eq.data.salvage.value > eq.data.value) {
			display = true;
			$element("span",eq.node.sub,[" Salvage "+eq.data.salvage.value,".hvut-es-salvage2"],function(){_es.shop_salvage(eq);});
		}

		if(display) {
			_es.shop_pane.push(eq);
			$element("span",[eq.node.sub,0],"Buy "+eq.data.value,function(){_es.shop_buy(eq);});
			eq.node.wrapper.insertBefore(eq.node.sub,eq.node.wrapper.firstChild);
			eq.node.wrapper.classList.add("hvut-es-wrapper");
			if(append) {
				append.appendChild(eq.node.wrapper);
			}
		} else {
			eq.node.wrapper.classList.add("hvut-hide");
		}
	});
};


GM_addStyle(`
	.eqshop_pane > div:first-child {display:none}
	.cspp {margin-top:15px}
	#eqshop_sellall {display:none}
	.hvut-es-select {position:absolute; top:5px; left:10px; z-index:1}
	.hvut-es-select > input {margin:0 5px}

	.hvut-es-tab {margin:10px; padding:10px 0 0; border-top:1px dashed; font-size:12pt; text-align:left}
	.hvut-es-status {margin-left:10px; font-weight:normal; font-size:8pt; color:#c00}
	.hvut-es-salvage {text-decoration:line-through}
	.hvut-es-valuable {margin:5px; padding:5px; border:1px solid; overflow:hidden}
	.hvut-es-valuable:empty {display:none}

	.equiplist > div:hover {background-color:#ddd}
	.hvut-es-wrapper {height:40px; margin:5px !important}
	.hvut-es-sub {position:absolute; top:22px; font-size:8pt}
	#shop_pane .hvut-es-sub {margin-left:30px}
	.hvut-es-sub > input {vertical-align:sub; margin-right:10px}
	.hvut-es-sub > span {margin:5px; cursor:pointer}
	.hvut-es-sub > span:hover {text-decoration:underline}
	.hvut-es-bold {font-weight:bold; color:#c00}
	.hvut-es-tier {font-weight:bold; color:#00c}
	.hvut-es-disabled {text-decoration:line-through}
	.hvut-es-salvage2 {font-weight:bold; color:#090; cursor:pointer}
`);

_es.div = $element("div",[$id("item_pane").parentNode,0],[".hvut-es-select"]);
$element("input",_es.div,{type:"button",value:"Select: Sell"},function(){_es.item_pane.forEach(function(eq){eq.node.check.checked=(eq.node.div.dataset.locked=="0"&&!eq.data.valuable&&!eq.data.need_salvage);});});
$element("input",_es.div,{type:"button",value:"Sell"},_es.sell_all);
$element("input",_es.div,{type:"button",value:"Select: Salvage"},function(){_es.item_pane.forEach(function(eq){eq.node.check.checked=(eq.node.div.dataset.locked=="0"&&!eq.data.valuable&&eq.data.need_salvage);});});
$element("input",_es.div,{type:"button",value:"Salvage"},_es.salvage_all);

_es.group["valuable"] = {};
_es.group["valuable"].item_div = $element("div",[$id("item_pane"),0],[".hvut-es-valuable"]);

if(settings.equipmentShopIntegration) {
	GM_addStyle(`
		#filterbar > div {width:125px !important}
	`);
	let filterbar = $id("filterbar");
	$element("div",[filterbar,0],[" All","!font-size:10pt;cursor:pointer"],function(){location.href="/?s=Bazaar&ss=es";});
	if(_query.filter) {
		filterbar.children[0].classList.add("cfb");
	} else {
		filterbar.children[0].classList.add("cfbs");
		filterbar.children[1].classList.add("cfb");
		filterbar.children[1].classList.remove("cfbs");
	}
}

$id("csp").classList.add("hvut-hide-on");

if(_query.filter || !settings.equipmentShopIntegration) {
	_es.get_item_pane($id("item_pane"),_es.filter);
	_es.get_shop_pane($id("shop_pane"),_es.filter);
	$element("input",_es.div,{type:"button",value:"Show Equipment",style:"position:absolute;left:560px;width:125px"},function(){if($id("csp").classList.contains("hvut-hide-on")){$id("csp").classList.remove("hvut-hide-on");this.value="Hide Equipment";}else{$id("csp").classList.add("hvut-hide-on");this.value="Show Equipment";}});

} else {

	_es.group["1handed"] = {};
	_es.group["1handed"].item_tab = $element("h4",$id("item_pane"),[" "+$equip.alias["1handed"],".hvut-es-tab"]);
	_es.group["1handed"].item_status = $element("span",_es.group["1handed"].item_tab,[".hvut-es-status"]);
	_es.group["1handed"].item_div = $element("div",$id("item_pane"),[".equiplist"]);

	_es.group["1handed"].shop_tab = $element("h4",$id("shop_pane"),[" "+$equip.alias["1handed"],".hvut-es-tab"]);
	_es.group["1handed"].shop_status = $element("span",_es.group["1handed"].shop_tab,[".hvut-es-status"]);
	_es.group["1handed"].shop_div = $element("div",$id("shop_pane"),[".equiplist"]);

	_es.get_item_pane($id("item_pane"),"1handed",_es.group["1handed"].item_div);
	_es.get_shop_pane($id("shop_pane"),"1handed",_es.group["1handed"].shop_div);

	_es.tab_loaded = 1;

	["2handed","staff","shield","acloth","alight","aheavy"].forEach(function(filter){
		var tab = _es.group[filter] = {};

		tab.item_tab = $element("h4",$id("item_pane"),[" "+$equip.alias[filter],".hvut-es-tab"]);
		tab.item_status = $element("span",tab.item_tab,[" LOADING...",".hvut-es-status"]);
		tab.item_div = $element("div",$id("item_pane"),[".equiplist"]);

		tab.shop_tab = $element("h4",$id("shop_pane"),[" "+$equip.alias[filter],".hvut-es-tab"]);
		tab.shop_status = $element("span",tab.shop_tab,[" LOADING...",".hvut-es-status"]);
		tab.shop_div = $element("div",$id("shop_pane"),[".equiplist"]);

		$ajax.send("GET","/?s=Bazaar&ss=es&filter="+filter,null,
			function(r){
				var html = r.responseText;

				Object.assign($equip.dynjs_eqstore, JSON.parse( substring(html,["var dynjs_eqstore = ",true],";\n") ));
				Object.assign($equip.eqvalue, JSON.parse( substring(html,["var eqvalue = ",true],";\n") ));

				var doc = substring(html,'<div class="eqshop_pane">','<div id="eqshop_transact">',true);

				tab.item_status.textContent = "";
				tab.item_div.innerHTML = "";
				_es.get_item_pane($qs("#item_pane",doc),filter,tab.item_div);

				tab.shop_status.textContent = "";
				tab.shop_div.innerHTML = "";
				_es.get_shop_pane($qs("#shop_pane",doc),filter,tab.shop_div);

				//if(++_es.tab_loaded===7 && navigator.userAgent.includes("Firefox")) {// unsafeWindow
				//	window.eval("dynjs_eqstore="+JSON.stringify($equip.dynjs_eqstore));
				//}
			},
			function(){tab.item_status.textContent=tab.shop_status.textContent="ERROR";}
		);

	});
}

_es.group["valuable"].item_div.classList.add("equiplist");

} else
// [END 8] Bazaar - Equipment Shop */


//* [9] Bazaar - Item Shop
if(settings.itemShop && _query.s==="Bazaar" && _query.ss==="is") {

_is.item = {};
_is.shop = {};

$qsa("#item_pane .itemlist tr").forEach(function(tr){
	var div = tr.cells[0].firstElementChild,
		name = div.textContent.trim(),
		type = /'([^']+)'\)/.test(div.getAttribute("onmouseover")) && RegExp.$1.replace(/\W/g,"_") || "Consumable",
		exec = /itemshop\.set_item\('item_pane',(\d+),(\d+),(\d+)/.exec(div.getAttribute("onclick")),
		id = exec[1],
		price = parseInt(exec[3]),
		stock = parseInt(tr.cells[1].textContent);

	_is.item[id] = {tr:tr,id:id,name:name,price:price,stock:stock};

	//$element("td",tr);
	//$element("td",tr);
	tr.classList.add("hvut-it-"+type);
	if( settings.itemShopHideInventory.some(h=>name.includes(h)) ) {
		tr.classList.add("hvut-hide");
	}
});

$qsa("#shop_pane .itemlist tr").forEach(function(tr){
	var div = tr.cells[0].firstElementChild,
		name = div.textContent.trim(),
		type = /'([^']+)'\)/.test(div.getAttribute("onmouseover")) && RegExp.$1.replace(/\W/g,"_") || "Consumable",
		exec = /itemshop\.set_item\('shop_pane',(\d+),(\d+),(\d+)/.exec(div.getAttribute("onclick")),
		id = exec[1],
		price = parseInt(exec[3]),
		stock = tr.cells[1] ? parseInt(tr.cells[1].textContent) : Infinity;

	_is.shop[id] = {tr:tr,id:id,name:name,price:price,stock:stock};

	tr.classList.add("hvut-it-"+type);
	if( settings.itemShopHideStore.some(h=>name.includes(h)) ) {
		tr.classList.add("hvut-hide");
	}
});

/*
$ajax.send("GET","/?s=Bazaar&ss=ib",null,function(r){
	_is.biddata = JSON.parse( substring(r.responseText,["var biddata = ",true],";\n") );

	for(let id in _is.biddata) {
		if(_is.item[id]) {
			let tr = _is.item[id].tr,
				bid = _is.biddata[id];
			if(bid.cb) {
				tr.cells[2].textContent = bid.cb;
				if(bid.cb === bid.hb) {
					tr.cells[2].classList.add("hvut-is-cb");
				} else {
					tr.cells[3].classList.add("hvut-is-hb");
				}
			}
			if(bid.hb) {
				tr.cells[3].textContent = bid.hb;
			}
		}
	}
});
//*/

GM_addStyle(`
	.cspp {margin-top:20px}
	#item_pane .itemlist td:nth-child(3) {width:75px; color:#666}
	#item_pane .itemlist td:nth-child(4) {width:75px; color:#666}
	.hvut-is-cb {color:#00c !important}
	.hvut-is-hb {color:#c00 !important}
`);

$id("csp").classList.add("hvut-hide-on");
$element("input",$id("itshop_outer"),{type:"button",value:"Show Items",style:"position:absolute;top:75px;right:220px;width:90px;z-index:3"},function(){if($id("csp").classList.contains("hvut-hide-on")){$id("csp").classList.remove("hvut-hide-on");this.value="Hide Items";}else{$id("csp").classList.add("hvut-hide-on");this.value="Show Items";}});

} else
// [END 9] Bazaar - Item Shop */


//* [10] Bazaar - Item Shop Bot
if(settings.itemShopBot && _query.s==="Bazaar" && _query.ss==="ib") {

_ib.dynjs_itemc = _window.dynjs_itemc;
_ib.biddata = _window.biddata;

GM_addStyle(`
	#itembot_outer {margin:0; left:750px}
	#itembot_left {float:none; padding-top:0; height:240px; border-bottom:3px double}
	#itembot_left > div:first-child, #itembot_right > div:first-child {display:none}
	#itembot_left > table {padding-top:10px}
	#active_pane {height:400px !important}
	#active_pane .itemlist td:nth-child(1) {width:250px !important}
	#active_pane .itemlist td:nth-child(2) {width:50px}
	#active_pane .itemlist td:nth-child(3) {width:75px}
	#active_pane .itemlist td:nth-child(4) {width:75px}

	.hvut-ib-bot {display:flex; flex-flow:column wrap; position:absolute; top:50px; left:50px; height:620px; margin:0; padding:0; list-style:none; font-size:9pt; line-height:16px}
	.hvut-ib-bot > li {margin-right:20px; border-width:1px; border-color:#966; border-bottom-style:solid; cursor:default}
	.hvut-ib-bot > li:hover {background-color:#fff}
	.hvut-ib-category {margin-top:10px; border-style:solid; font-weight:bold; background-color:#fff}
	.hvut-ib-margin {margin-top:1px; border-top-style:solid}
	.hvut-ib-break {page-break-after:always; break-after:always}
	.hvut-ib-break + li {margin-top:10px}
	.hvut-ib-bot > li > span:first-child {float:left; width:50px; padding-right:5px; text-align:right; border-right:1px dotted}
	.hvut-ib-bot > li > span:last-child {float:right; width:150px; padding-left:5px; text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
	.hvut-ib-cb {color:#00c}
	.hvut-ib-hb {color:#c00}
`);

_ib.ul = $element("ul",$id("mainpane"),[".hvut-ib-bot"]);
_ib.selector = $id("bot_item");

Array.from(_ib.selector.options).forEach(function(o){
	if(!Number(o.value)){return;}
	var bid = _ib.biddata[o.value], // cc, cb, mb, hb
		name = o.text,
		category = !o.previousElementSibling && o.parentNode.label;

	if(category) {
		$element("li",_ib.ul,[" "+category,".hvut-ib-category"]);
	}

	var li = $element("li",_ib.ul,[!bid.cb?"" : bid.cb===bid.hb?".hvut-ib-cb" : ".hvut-ib-hb"],function(){_window.itembot.set_item(o.value);});
	$element("span",li,bid.hb||bid.cb||"");
	$element("span",li,name);

	if(category || ["Infusion of Flames","Scroll of Swiftness","Crystallized Phazon","Binding of Slaughter","Binding of Protection","Binding of the Elementalist","Binding of Surtr","Binding of Dampening","Binding of the Fire-eater","Binding of the Ox","Binding of Warding","Voidseeker Shard"].includes(name)) {
		li.classList.add("hvut-ib-margin");
	}

	if(name==="Precursor Artifact" || name==="Binding of the Earth-walker") {
		li.classList.add("hvut-ib-break");
		$element("li",_ib.ul,[".hvut-ib-break","!width:0;height:100%;margin:0"]); // fix for Google Chrome that doesn't support 'page-break'.
	}
});

$qsa("#active_pane .itemlist tr").forEach(function(tr){
	var bid = _ib.biddata[ /itembot\.set_item\((\d+)\)/.test(tr.cells[0].firstElementChild.getAttribute("onclick")) && RegExp.$1 ];
	$element("td",tr,[" "+bid.cb,bid.cb===bid.hb?".hvut-ib-cb":""]);
	//$element("td",tr,[" "+(bid.hb||""),bid.cb<bid.hb?".hvut-ib-hb":""]);
});

if($qs("#active_pane .itemlist")) {
	$element("tr",[$qs("#active_pane .itemlist").tBodies[0],0],["/<td></td><td>count</td><td>your bid</td>"]); // <td>highest</td>
}

} else
// [END 10] Bazaar - Item Shop Bot */


//* [11] Bazaar - Monster Lab
if(settings.monsterLab && _query.s==="Bazaar" && _query.ss==="ml") {

if(_query.slot) {
	if(_query.pane === "skills") {
		_ml.prev_button = $qs("img[src$='/monster/prev.png']");
		_ml.prev_button.setAttribute("onclick",_ml.prev_button.getAttribute("onclick").replace("ss=ml","ss=ml&pane=skills"));
		_ml.next_button = $qs("img[src$='/monster/next.png']");
		_ml.next_button.setAttribute("onclick",_ml.next_button.getAttribute("onclick").replace("ss=ml","ss=ml&pane=skills"));
	}

} else {

GM_addStyle(`
	#monster_outer {font-weight:normal}
	.cspp {margin-top:15px}
	#slot_pane {line-height:26px}
	#slot_pane > div {position:relative; clear:both}
	#slot_pane > div > div {padding:0}
	#slot_pane .fc4 {font-size:10pt}
	#slot_pane > div > div:nth-child(1) {width:20px; margin:0 10px}
	#slot_pane > div > div:nth-child(2) {width:215px; white-space:nowrap; overflow:hidden}
	#slot_pane > div > div:nth-child(3) {width:40px; position:absolute; left:335px; text-align:right}
	#slot_pane > div > div:nth-child(4) {width:70px; position:absolute; left:255px}

	.hvut-ml-header {position:absolute; top:5px; left:0; white-space:nowrap; z-index:3}
	#monster_actions {width:auto}
	.hvut-ml-buttons {width:130px !important}
	.hvut-ml-buttons > input {width:100%; margin:2px 0}

	#slot_pane .hvut-ml-feed {position:absolute; top:7px; left:62px; width:124px; height:12px; font-size:8pt; line-height:12px; text-align:center; background:none}
	#slot_pane .hvut-ml-feed:hover {background-color:rgba(255,255,255,.6)}

	.hvut-ml-win {position:absolute; top:3px; left:390px; width:100px; height:26px; line-height:20px}
	.hvut-ml-count {position:absolute; top:3px; left:530px; width:60px; height:26px; line-height:20px}
	.hvut-ml-failed {background-color:#900; color:#fff}

	.hvut-ml-new {background-color:#edb}
	.hvut-ml-new > .hvut-ml-count {color:#630; font-weight:bold}
	.hvut-ml-new > .hvut-ml-count > span:nth-child(2) {position:absolute; left:-30px; width:30px; border-radius:2px; background-color:#630; color:#fff}

	.hvut-ml-gift {display:none; position:absolute; top:2px; right:500px; margin:0; padding:5px 10px; border:1px solid; list-style:none; font-size:9pt; line-height:1.6em; white-space:nowrap; background-color:#fff; z-index:1}
	.hvut-ml-gift > li {margin:0; padding:0}
	#slot_pane > div:nth-of-type(n+15):nth-last-of-type(-n+5) > .hvut-ml-gift {top:auto; bottom:2px}
	.hvut-ml-count:hover + .hvut-ml-gift {display:block}

	.hvut-ml-results {position:absolute; top:24px; left:10px; max-height:560px; min-width:250px; margin:0; padding:10px; overflow:auto; border:1px solid; list-style:none; background-color:#fff; text-align:left; white-space:nowrap; font-size:10pt; line-height:1.6em; cursor:default}
	.hvut-ml-results:empty {display:none}
	.hvut-ml-results span:first-child {display:inline-block; min-width:25px; text-align:right}
	.hvut-ml-log {display:flex; flex-flow:column wrap; position:absolute; list-style:none; top:0; left:625px; margin:0; padding:40px 10px 10px; width:460px; height:510px; border:1px solid; background-color:#fff; font-size:9pt; line-height:16px; text-align:left}
	.hvut-ml-log > li:first-child {position:absolute; top:10px; font-weight:bold}
	.hvut-ml-log > li {margin:0 5px; padding:0; width:220px}
	.hvut-ml-margin {margin-top:16px !important}
	.hvut-ml-break {page-break-after:always; break-after:always}
`);

_ml.materials = ["Low-Grade Cloth","Mid-Grade Cloth","High-Grade Cloth","Low-Grade Leather","Mid-Grade Leather","High-Grade Leather","Low-Grade Metals","Mid-Grade Metals","High-Grade Metals","Low-Grade Wood","Mid-Grade Wood","High-Grade Wood","Crystallized Phazon","Shade Fragment","Repurposed Actuator","Defense Matrix Modulator","Binding of Slaughter","Binding of Balance","Binding of Isaac","Binding of Destruction","Binding of Focus","Binding of Friendship","Binding of Protection","Binding of Warding","Binding of the Fleet","Binding of the Barrier","Binding of the Nimble","Binding of Negation","Binding of the Ox","Binding of the Raccoon","Binding of the Cheetah","Binding of the Turtle","Binding of the Fox","Binding of the Owl","Binding of Surtr","Binding of Niflheim","Binding of Mjolnir","Binding of Freyr","Binding of Heimdall","Binding of Fenrir","Binding of the Elementalist","Binding of the Heaven-sent","Binding of the Demon-fiend","Binding of the Curse-weaver","Binding of the Earth-walker","Binding of Dampening","Binding of Stoneskin","Binding of Deflection","Binding of the Fire-eater","Binding of the Frost-born","Binding of the Thunder-child","Binding of the Wind-waker","Binding of the Thrice-blessed","Binding of the Spirit-ward"];

_ml.mobs = [];
_ml.names = {};
_ml.gift = {};
_ml.now = Date.now();
_ml.json = {date:_ml.now,total:0};
_ml.log = getValue("ml_log",[]);

_ml.parse = function(mob,html) {

	mob.pl = mob.log.pl = /<div>Lvl (\d+)<\/div>/.test(html) && parseInt(RegExp.$1);

	var reg1 = /width:(\d+)px/g;
	reg1.lastIndex = html.indexOf('<div class="msn">');
	mob.hunger = parseInt(reg1.test(html) && RegExp.$1) * 200;
	mob.morale = parseInt(reg1.test(html) && RegExp.$1) * 200;

	var reg2 = /<div>(\d+)<\/div>/g;
	reg2.lastIndex = html.indexOf("Battles Won");
	mob.win = parseInt(reg2.test(html) && RegExp.$1);
	reg2.lastIndex = html.indexOf("Killing Blows");
	mob.kill = parseInt(reg2.test(html) && RegExp.$1);

	var reg3 = /<div>\+(\d+)<\/div>/g,
		exec;

	var pa = [],
		er;
	while( (exec=reg3.exec(html)) ) {
		pa.push( parseInt(exec[1]) );
	}
	er = pa.splice(6,6);

	mob.pa.forEach(function(e,i){
		e.value = mob.log.pa[i].value = pa[i];
	});
	mob.er.forEach(function(e,i){
		e.value = mob.log.er[i].value = er[i];
	});

	var table = substring(html,'<table id="chaosupg">',["</table>",true],true).firstElementChild;
	$qsa("td:nth-child(2)",table).forEach(function(td,i){
		mob.ct[i].value = mob.log.ct[i].value = $qsa(".mcu2",td).length;
		mob.ct[i].max = mob.log.ct[i].max = 20 - $qsa(".mcu0",td).length;
	});
};


_ml.main = {

feed : function(mob,t) {
	if(!mob.status) {
		return;
	}
	mob.status = 0;
	mob.node.win.textContent = "...";
	$ajax.send("POST","/?s=Bazaar&ss=ml&slot="+mob.index,t?"food_action="+t:"",function(r){_ml.main.update(mob,r.responseText);},function(){_ml.main.update(mob,false);});
},

update : function(mob,html) {
	if(html) {
		if(html !== true) {
			_ml.parse(mob,html);
		}

		mob.status = 1;

		mob.node.win.classList.remove("hvut-ml-failed");
		mob.node.win.textContent = mob.win + " / " + mob.kill;
		mob.node.hunger.textContent = mob.hunger;
		mob.node.hungerbar.style.width = (mob.hunger/200)+"px";
		mob.node.morale.textContent = mob.morale;
		mob.node.moralebar.style.width = (mob.morale/200)+"px";

	} else {
		mob.status = -1;
		mob.node.win.classList.add("hvut-ml-failed");
		mob.node.win.textContent = "failed";
	}
},

view_log : function(mob) {
	if(!mob.node.log) {
		mob.node.log = $element("ul",null,[".hvut-ml-log"]);
		var date = mob.log.date,
			elapsed = Math.round((Date.now() - date) / (1000*60*60));
		$element("li",mob.node.log,mob.log.gift.reduce((p,c)=>p+c)+" gifts for "+Math.floor(elapsed/24)+" days "+(elapsed%24)+" hours / since "+(new Date(date)).toLocaleString());

		_ml.materials.forEach(function(mat,i){
			var li = $element("li",mob.node.log,mob.log.gift[i]+" x "+mat);
			if(i===12 || i===16 || i===22 || i===28 || i===34 || i===40 || i===45 || i===48) {
				li.classList.add("hvut-ml-margin");
			}
			if(i===27) {
				li.classList.add("hvut-ml-break");
				$element("li",mob.node.log,[".hvut-ml-break","!width:0;height:100%;margin:0"]); // fix for Google Chrome that doesn't support 'page-break'.
			}
		});
	}

	_ml.main.header.appendChild(mob.node.log);
}

};

$id("monster_outer").classList.toggle("hvut-none");
$qsa("#slot_pane > div").forEach(function(div,i){
	var index = i + 1;

	if(div.getAttribute("onclick").includes("&create=new")) {
		_ml.log[index] = null;
		return;
	}

	var log = _ml.log[index];
	if(!log) {
		log = _ml.log[index] = {date:_ml.now,pl:null,selected:true,pa:[],er:[],ct:[],gift:[]};

		for(let i=0; i<6; i++) {
			log.pa[i] = {};
			log.er[i] = {};
		}
		for(let i=0; i<12; i++) {
			log.ct[i] = {};
		}
		for(let i=0; i<54; i++) {
			log.gift[i] = 0;
		}
	}

	var mob = _ml.mobs[index] = {index:index,status:-1,gift:[],pa:[],er:[],ct:[],log:_ml.log[index],node:{}};

	mob.name = div.children[1].textContent;
	mob.pl = div.children[2].textContent = parseInt(div.children[2].textContent.substr(4));
	mob.mclass = div.children[3].textContent;

	mob.visible = true;
	mob.selected = true;
	mob.node.div = div;

	for(let i=0; i<6; i++) {
		mob.pa[i] = {value:log.pa[i].value};
		mob.er[i] = {value:log.er[i].value};
	}
	for(let i=0; i<12; i++) {
		mob.ct[i] = {value:log.ct[i].value,max:log.ct[i].max};
	}

	_ml.names[mob.name] = index;

	var hunger_div = div.children[4],
		hungerbar = mob.node.hungerbar = hunger_div.firstElementChild.firstElementChild,
		morale_div = div.children[5],
		moralebar = mob.node.moralebar = morale_div.firstElementChild.firstElementChild;

	mob.hunger = parseInt(hungerbar.style.width) * 200;
	mob.morale = parseInt(moralebar.style.width) * 200;

	mob.node.hunger = $element("div",hunger_div,[" "+mob.hunger,".hvut-ml-feed"],function(e){_ml.main.feed(mob,"food");e.stopPropagation();});
	mob.node.morale = $element("div",morale_div,[" "+mob.morale,".hvut-ml-feed"],function(e){_ml.main.feed(mob,"drugs");e.stopPropagation();});

	mob.node.win = $element("div",div,[".hvut-ml-win"," -"],function(e){_ml.main.feed(mob);e.stopPropagation();});
	mob.node.count = $element("div",div,[".hvut-ml-count"],{mouseenter:function(){_ml.main.view_log(mob);},mouseleave:function(){mob.node.log.remove();}});

	if(mob.pl !== mob.log.pl) {
		mob.need_update = true;
	}
});
$id("monster_outer").classList.toggle("hvut-none");

if($id("messagebox")) {
	Array.from($id("messagebox").lastElementChild.children).forEach(function(d){
		var text = d.textContent.trim(),
			mob;

		if(!text) {
			return;

		} else if(/^(.+) brought you (?:a gift|some gifts)!$/.test(text)) {
			_ml.current = _ml.names[RegExp.$1];
			mob = _ml.mobs[_ml.current];
			mob.node.gift = $element("ul",mob.node.div,[".hvut-ml-gift"]);
			_ml.json[mob.index] = [];

		} else {
			text = /^Received (?:a|some) (.+)$/.test(text) && RegExp.$1 || text;

			mob = _ml.mobs[_ml.current];
			mob.gift.push(text);

			_ml.json.total++;
			_ml.json[mob.index].push(text);

			if(!_ml.gift.hasOwnProperty(text)) {
				_ml.gift[text] = 0;
			}
			_ml.gift[text]++;

			mob.log.gift[_ml.materials.indexOf(text)]++;

			$element("li",mob.node.gift,text);
		}
	});
}

_ml.main.header = $element("div",[$id("slot_pane").parentNode,0],[".hvut-ml-header"],function(e){e.stopPropagation();});
$element("input",_ml.main.header,{type:"button",value:(_ml.json.total||"No")+" gift"+(_ml.json.total>1?"s":""),style:"margin-left:70px"},function(){_ml.main.results.classList.toggle("hvut-none");});
$element("input",_ml.main.header,{type:"button",value:"Wins/Kills",style:"margin-left:310px"},function(){_ml.mobs.forEach(function(mob){_ml.main.feed(mob);});});
$element("input",_ml.main.header,{type:"button",value:"Log",style:"margin-left:55px"},function(){if(_ml.log.sum.node.log && _ml.log.sum.node.log.parentNode){_ml.log.sum.node.log.remove();}else{_ml.main.view_log(_ml.log.sum);}});
$element("input",_ml.main.header,{type:"button",value:"Drug All",style:"margin-left:40px"},function(){_ml.mobs.forEach(function(mob){_ml.main.feed(mob,mob.morale<24000?"drugs":"");});});
$element("input",_ml.main.header,{type:"button",value:"Under "+settings.monsterLabMorale},function(){_ml.mobs.forEach(function(mob){_ml.main.feed(mob,mob.morale<=settings.monsterLabMorale?"drugs":"");});});
$element("input",_ml.main.header,{type:"button",value:"Feed All",style:"margin-left:50px"},function(){_ml.mobs.forEach(function(mob){_ml.main.feed(mob,mob.hunger<24000?"food":"");});});
$element("input",_ml.main.header,{type:"button",value:"Under "+settings.monsterLabHunger},function(){_ml.mobs.forEach(function(mob){_ml.main.feed(mob,mob.hunger<=settings.monsterLabHunger?"food":"");});});

_ml.main.buttons = $element("div",$id("monster_actions"),[".hvut-ml-buttons"]);

_ml.main.results = $element("ul",_ml.main.header,[".hvut-ml-results"]);

_ml.materials.forEach(function(mat){
	if(mat in _ml.gift) {
		$element("li",_ml.main.results).append(
			$element("span",null,_ml.gift[mat]),
			" x ",
			$element("span",null,mat)
		);
	}
});

_ml.log.sum = {log:{},node:{}};
_ml.log.sum.log.date = Date.now();
_ml.log.sum.log.gift = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

_ml.mobs.forEach(function(mob){
	if(mob.log.date < _ml.log.sum.log.date) {
		_ml.log.sum.log.date = mob.log.date;
	}
	for(let i=0,l=_ml.log.sum.log.gift.length; i<l; i++) {
		_ml.log.sum.log.gift[i] += mob.log.gift[i];
	}
	$element("span",mob.node.count,mob.log.gift.reduce((p,c)=>p+c,0));
	if(mob.gift.length) {
		mob.node.div.classList.add("hvut-ml-new");
		$element("span",mob.node.count,"+"+mob.gift.length);
	}
});

setValue("ml_log",_ml.log);


// Monster Upgrader

_ml.upgrade = {

pa : [
	{query:"pa_str",text:"STR",crystal:"Crystal of Vigor"},
	{query:"pa_dex",text:"DEX",crystal:"Crystal of Finesse"},
	{query:"pa_agi",text:"AGI",crystal:"Crystal of Swiftness"},
	{query:"pa_end",text:"END",crystal:"Crystal of Fortitude"},
	{query:"pa_int",text:"INT",crystal:"Crystal of Cunning"},
	{query:"pa_wis",text:"WIS",crystal:"Crystal of Knowledge"}
],
er : [
	{query:"er_fire",text:"FIRE",crystal:"Crystal of Flames"},
	{query:"er_cold",text:"COLD",crystal:"Crystal of Frost"},
	{query:"er_elec",text:"ELEC",crystal:"Crystal of Lightning"},
	{query:"er_wind",text:"WIND",crystal:"Crystal of Tempest"},
	{query:"er_holy",text:"HOLY",crystal:"Crystal of Devotion"},
	{query:"er_dark",text:"DARK",crystal:"Crystal of Corruption"}
],
ct : [
	{query:"affect",text:"Scavenging",desc:"Increases the gift factor by 2.5%"},
	{query:"health",text:"Fortitude",desc:"Increases monster health by 5%"},
	{query:"damage",text:"Brutality",desc:"Increases monster damage by 2.5%"},
	{query:"accur",text:"Accuracy",desc:"Increases monster accuracy by 5%"},
	{query:"cevbl",text:"Precision",desc:"Decreases effective target evade/block by 1%"},
	{query:"cpare",text:"Overpower",desc:"Decreases effective target parry/resist by 1%"},
	{query:"parry",text:"Interception",desc:"Increases monster parry by 0.5%"},
	{query:"resist",text:"Dissipation",desc:"Increases monster resist by 0.5%"},
	{query:"evade",text:"Evasion",desc:"Increases monster evade by 0.5%"},
	{query:"phymit",text:"Defense",desc:"Increases monster physical mitigation by 1%"},
	{query:"magmit",text:"Warding",desc:"Increases monster magical mitigation by 1%"},
	{query:"atkspd",text:"Swiftness",desc:"Increases monster attack speed by 2.5%"}
],

pa_pl : [0],
er_pl : [0],

pa_cost : [],
er_cost : [],

node : {},

status : 0, // 0:inactive, 1:init_updating, 2:init_updated, 3:ok, 4:working

init : function() {
	if(_ml.upgrade.status === 0) {
		_ml.upgrade.status = 1;
		_ml.upgrade.update();
		return;

	} else if(_ml.upgrade.status === 2){ // do process

	} else {
		return;
	}

	_ml.upgrade.status = 3;

	GM_addStyle(`
		#hvut-ml-fd-div {position:absolute; top:27px; left:0; width:100%; height:675px; z-index:9; background-color:#EDEBDF; text-align:left}

		.hvut-ml-fd-header {margin:10px; padding:3px 8px; border:1px solid; user-select:none; -moz-user-select:none}

		.hvut-ml-fd-ol {height:462px; margin:10px; padding:0; overflow:auto; font-size:10pt; line-height:1.2em; list-style:none; user-select:none; -moz-user-select:none}
		.hvut-ml-fd-ol > li {margin:3px; padding:3px 5px; border:1px solid #999; color:#999}
		.hvut-ml-fd-ol > li:hover {background-color:#fff}
		.hvut-ml-fd-selected {background-color:#edb; color:#5C0D11 !important}

		.hvut-ml-fd-select {cursor:pointer}
		.hvut-ml-fd-select > span {display:inline-block; margin:0 3px}
		.hvut-ml-fd-index {width:25px; text-align:center}
		.hvut-ml-fd-selected .hvut-ml-fd-index {color:#c33}
		.hvut-ml-fd-name {width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; vertical-align:bottom}
		.hvut-ml-fd-mclass {width:70px}
		.hvut-ml-fd-pl {width:35px; text-align:right}

		.hvut-ml-fd-reset {display:inline-block; width:15px; margin:0 10px; text-align:center; border-radius:2px; cursor:pointer}
		.hvut-ml-fd-reset:hover {background-color:#c33; color:#fff}

		.hvut-ml-fd-span {border-left:1px solid; padding:0 2px; position:relative}
		.hvut-ml-fd-span > span {display:inline-block; margin:0 2px; width:21px; text-align:center; cursor:pointer; border-radius:2px}
		.hvut-ml-fd-span > span:hover {background-color:#edb}
		.hvut-ml-fd-span > span[data-desc]::after {content:attr(data-desc); position:absolute; width:100%; left:-3px; white-space:nowrap; padding:2px 3px; background-color:#fff; border:1px solid; z-index:1; display:none}
		.hvut-ml-fd-span > span[data-desc]:hover::after {display:block}

		.hvut-ml-fd-pane {margin:10px; font-size:9pt}
		.hvut-ml-fd-pane > ul {float:left; margin:0 5px; padding:5px; list-style:none; border:1px solid}
		.hvut-ml-fd-pane li {margin:5px}
		.hvut-ml-fd-pane li::after {content:''; display:block; clear:both}
		.hvut-ml-fd-pane li.hvut-ml-fd-nostock {color:#c00}
		.hvut-ml-fd-pane li > span {float:left; text-align:right}

		.hvut-ml-fd-crystal span:nth-child(1) {width:70px}
		.hvut-ml-fd-crystal span:nth-child(2) {width:90px}
		.hvut-ml-fd-crystal span:nth-child(3) {width:100px}
		.hvut-ml-fd-crystal span:nth-child(4) {width:80px}
		.hvut-ml-fd-token span:nth-child(1) {width:60px}
		.hvut-ml-fd-token span:nth-child(2) {width:60px}

		.hvut-ml-fd-btn {float:right}
		.hvut-ml-fd-btn > input {width:80px; margin:3px}
	`);

	_ml.upgrade.node.div = $element("div",$id("mainpane"),["#hvut-ml-fd-div"]);

	var header = $element("div",_ml.upgrade.node.div,[".hvut-ml-fd-header"],{mousedown:_ml.upgrade.mousedown,contextmenu:function(e){e.preventDefault();}}),
		span;

	span = $element("span",header,[".hvut-ml-fd-select"]);

	_ml.upgrade.node.check = $element("span",span,[".hvut-ml-fd-index"]).appendChild( $element("input",null,{type:"checkbox",checked:true,style:"vertical-align:middle",dataset:{index:"all",type:"select"}}) );

	_ml.upgrade.node.name = $element("span",span,[".hvut-ml-fd-name","!font-size:9pt;vertical-align:middle;text-align:right"]);

	_ml.upgrade.node.mclass = $element("span",span,[".hvut-ml-fd-mclass"]).appendChild( $element("select",null,{style:"width:65px;margin:0;padding:0;vertical-align:middle"},{change:_ml.upgrade.filter}) );

	$element("option",_ml.upgrade.node.mclass,{text:"All",value:""});
	["Arthropod","Avion","Beast","Celestial","Daimon","Dragonkin","Elemental","Giant","Humanoid","Mechanoid","Reptilian","Sprite","Undead"].forEach(function(c){
		$element("option",_ml.upgrade.node.mclass,{text:c,value:c});
	});

	_ml.upgrade.node.pl = $element("span",span,[".hvut-ml-fd-pl"]).appendChild( $element("input",null,{placeholder:"500+",style:"width:35px;vertical-align:middle"},{change:_ml.upgrade.filter}) );

	_ml.upgrade.node.reset = $element("span",header,{textContent:"*",className:"hvut-ml-fd-reset",dataset:{index:"selected",type:"reset"}});

	span = $element("span",header,[".hvut-ml-fd-span"]);
	$element("span",span,{textContent:"+",dataset:{index:"selected",type:"pa",item:"all"}});
	_ml.upgrade.pa.forEach(function(pa,i){
		$element("span",span,{textContent:pa.text.toLowerCase(),dataset:{index:"selected",type:"pa",item:i,desc:pa.crystal}});
	});

	span = $element("span",header,[".hvut-ml-fd-span"]);
	$element("span",span,{textContent:"+",dataset:{index:"selected",type:"er",item:"all"}});
	_ml.upgrade.er.forEach(function(er,i){
		$element("span",span,{textContent:er.text.toLowerCase(),dataset:{index:"selected",type:"er",item:i,desc:er.crystal}});
	});

	span = $element("span",header,[".hvut-ml-fd-span"]);
	$element("span",span,{textContent:"+",dataset:{index:"selected",type:"ct",item:"all"}});
	_ml.upgrade.ct.forEach(function(ct,i){
		$element("span",span,{textContent:ct.text.substr(0,3).toLowerCase(),dataset:{index:"selected",type:"ct",item:i,desc:ct.text+" : "+ct.desc}});
	});

	// create mob list (ol) first
	_ml.upgrade.node.ol = $element("ol",_ml.upgrade.node.div,[".hvut-ml-fd-ol"],{mousedown:_ml.upgrade.mousedown,contextmenu:function(e){e.preventDefault();}});

	// create pane
	var pane = _ml.upgrade.node.pane = $element("div",_ml.upgrade.node.div,[".hvut-ml-fd-pane"]),
		ul;

	ul = $element("ul",pane,[".hvut-ml-fd-crystal"]);
	_ml.upgrade.pa.forEach(function(e){
		e.li = $element("li",ul);
	});

	ul = $element("ul",pane,[".hvut-ml-fd-crystal"]);
	_ml.upgrade.er.forEach(function(e){
		e.li = $element("li",ul);
	});

	_ml.upgrade.ct.ul = $element("ul",pane,[".hvut-ml-fd-token"]);

	var btn_pane = $element("div",pane,[".hvut-ml-fd-btn"]);
	$element("input",btn_pane,{type:"button",value:"Save"},_ml.upgrade.save);
	$element("input",btn_pane,{type:"button",value:"Load"},_ml.upgrade.load);
	$element("input",btn_pane,{type:"button",value:"Update"},_ml.upgrade.force_update);
	$element("br",btn_pane);
	_ml.upgrade.node.btn_run = $element("input",btn_pane,{type:"button",value:"Run"},_ml.upgrade.run);
	$element("input",btn_pane,{type:"button",value:"",style:"visibility:hidden"});
	$element("input",btn_pane,{type:"button",value:"Close"},_ml.upgrade.toggle);

	for(let i=0;i<25;i++) {
		_ml.upgrade.pa_cost[i] = Math.round(50 * Math.pow(1.555079154,i));
		_ml.upgrade.pa_pl[i+1] = _ml.upgrade.pa_pl[i] + (3+i*0.5);
	}
	for(let i=0;i<50;i++) {
		_ml.upgrade.er_cost[i] = Math.round(10 * Math.pow(1.26485522,i));
		_ml.upgrade.er_pl[i+1] = _ml.upgrade.er_pl[i] + Math.floor(1+i*0.1);
	}
	_ml.upgrade.pa.forEach(function(e){e.used=0;e.require=0;});
	_ml.upgrade.er.forEach(function(e){e.used=0;e.require=0;});

	var ct_slot = $qsa("#slot_pane > div.msl").length,
		ct_gs = false,
		ct_next = /Cost: (\d+) Chaos Token/.test($id("monster_actions").textContent) && parseInt(RegExp.$1);
	if(ct_next === Math.ceil(1+Math.pow(ct_slot,1.2))) {
	} else if(ct_next === Math.ceil(1+Math.pow(ct_slot/2,1.2))) {
		ct_slot = ct_slot/2;
		ct_gs = true;
	} else {
		ct_slot = 0;
	}

	_ml.upgrade.ct.slot = ct_slot;
	_ml.upgrade.ct.gs = ct_gs;
	_ml.upgrade.ct.unlock = 0;
	while(ct_slot--) {
		_ml.upgrade.ct.unlock += Math.ceil(1+Math.pow(ct_slot,1.2));
	}
	_ml.upgrade.ct.used = 0;
	_ml.upgrade.ct.require = 0;

	// create mob item (li) now
	_ml.mobs.forEach(function(mob){
		var li = mob.node.li = $element("li",_ml.upgrade.node.ol,[".hvut-ml-fd-selected"]),
			span;

		span = $element("span",li,{className:"hvut-ml-fd-select",dataset:{index:mob.index,type:"select"}});

		$element("span",span,[" "+mob.index,".hvut-ml-fd-index"]);
		$element("span",span,[" "+mob.name,".hvut-ml-fd-name"]);
		$element("span",span,[" "+mob.mclass,".hvut-ml-fd-mclass"]);
		mob.node.pl = $element("span",span,[" "+mob.pl,".hvut-ml-fd-pl"]);
		$element("span",li,{textContent:"*",className:"hvut-ml-fd-reset",dataset:{index:mob.index,type:"reset"}});

		span = $element("span",li,[".hvut-ml-fd-span"]);
		$element("span",span,{textContent:"+",dataset:{index:mob.index,type:"pa",item:"all"}});
		mob.pa.forEach(function(e,i){
			e.node = $element("span",span,{textContent:e.value,dataset:{index:mob.index,type:"pa",item:i}});
			e.to = e.value;
			e.used = _ml.upgrade.pa_cost.slice(0,e.value).reduce((p,c)=>p+c,0);
			_ml.upgrade.pa[i].used += e.used;
			e.require = 0;
		});

		span = $element("span",li,[".hvut-ml-fd-span"]);
		$element("span",span,{textContent:"+",dataset:{index:mob.index,type:"er",item:"all"}});
		mob.er.forEach(function(e,i){
			e.node = $element("span",span,{textContent:e.value,dataset:{index:mob.index,type:"er",item:i}});
			e.to = e.value;
			e.used = _ml.upgrade.er_cost.slice(0,e.value).reduce((p,c)=>p+c,0);
			_ml.upgrade.er[i].used += e.used;
			e.require = 0;
		});

		mob.ct.used = 0;
		mob.ct.require = 0;
		span = $element("span",li,[".hvut-ml-fd-span"]);
		$element("span",span,{textContent:"+",dataset:{index:mob.index,type:"ct",item:"all"}});
		mob.ct.forEach(function(e,i){
			e.node = $element("span",span,{textContent:e.value,dataset:{index:mob.index,type:"ct",item:i}});
			e.to = e.value;
			mob.ct.used += (1+e.value) * e.value/2;
		});
		_ml.upgrade.ct.used += mob.ct.used;
	});

	_ml.upgrade.sum(true);
},

update : function() {
	if(_ml.upgrade.status !== 1 && _ml.upgrade.status !== 3) {
		return;
	}

	var total = 0,
		count = 0;

	_ml.mobs.forEach(function(mob){
		if(mob.need_update) {
			total++;
			$ajax.send("GET","/?s=Bazaar&ss=ml&slot="+mob.index,null,
				function(r){
					count++;
					mob.need_update = false;
					_ml.parse(mob,r.responseText);
					_ml.upgrade.node.btn_open.value = "Update... ("+count+"/"+total+")";

					var status = _ml.upgrade.status;
					if(status === 1) {

					} else if(status === 4) {
						_ml.upgrade.node.btn_run.value = count+" / "+total;
					}

					if(total === count) {
						setValue("ml_log",_ml.log);
						_ml.upgrade.node.btn_open.disabled = false;
						_ml.upgrade.node.btn_open.value = "Monster Upgrader";

						if(status === 1) {
							_ml.upgrade.status = 2;
							_ml.upgrade.init();

						} else if(status === 4) {
							// _ml.upgrade.status = 3; // should refresh the page after feed
							_ml.upgrade.node.btn_run.value = "Completed";
						}
					}
				},
				function(){
					popup("<span>Failed to Update #"+mob.index+" <span style='font-weight:bold'>"+mob.name+"</span></span><br /><span>Try again</span>");
					mob.log.pl = -1;
					setValue("ml_log",_ml.log);
				}
			);
		}
	});

	if(!total) {
		if(_ml.upgrade.status === 1) {
			_ml.upgrade.status = 2;
			_ml.upgrade.init();

		} else if(_ml.upgrade.status === 3) {
		}
		return;
	}

	_ml.upgrade.node.btn_open.disabled = true;
	_ml.upgrade.node.btn_open.value = "Update...";

	if(_ml.upgrade.status === 1) {

	} else if(_ml.upgrade.status === 3) { // status 3 -> 4
		_ml.upgrade.status = 4;
		_ml.upgrade.node.btn_run.disabled = true;
		_ml.upgrade.node.btn_run.value = "Update...";
	}
},

force_update : function() {
	if(_ml.upgrade.status !== 3) {
		alert("Wait a second...");
		return;
	}
	_ml.mobs.forEach(function(mob){
		mob.log.pl = -1;
	});
	setValue("ml_log",_ml.log);
	location.href = location.href;
},

toggle : function() {
	if($id("messagebox")) {
		$id("messagebox").remove();
	}

	if(!_ml.upgrade.status) {
		_ml.upgrade.init();
		return;
	}

	_ml.upgrade.node.div.classList.toggle("hvut-none");
},

mousedown : function(e) {
	var target = e.target;
	while(!target.dataset.type) {
		if(target === e.currentTarget) {
			return;
		} else {
			target = target.parentNode;
		}
	}

	var dataset = target.dataset,
		index = dataset.index,
		type = dataset.type,
		item = dataset.item,
		param = e.which===1?1 : e.which===3?-1 : 0;

	if(type==="select" && index!=="all") {
		if(!e.shiftKey) {
			_ml.upgrade.mousedown.selectIndex = parseInt(index);
			_ml.upgrade.mousedown.selectValue = !_ml.mobs[index].selected;
		} else if(_ml.upgrade.mousedown.selectIndex) {
			var from = _ml.upgrade.mousedown.selectIndex,
				to = parseInt(index),
				inc = from<to?1:-1;
			index = [to];
			for(;from!==to;from+=inc) {
				index.push(from);
			}
			param = _ml.upgrade.mousedown.selectValue;
		}
	}

	_ml.upgrade.exec(index,type,item,param);
},

exec : function(index,type,item,param) {
	if(_ml.upgrade.status !== 3) {
		return;
	}

	var mobs = _ml.mobs;
	if(!isNaN(index)) {
		mobs = [mobs[index]];
	} else if(Array.isArray(index)) {
		mobs = mobs.filter(mob=>index.includes(mob.index));
	} else if(index === "selected") {
		mobs = mobs.filter(mob=>mob.visible&&mob.selected);
	} else if(index === "all") {
	}

	// type : select, reset, pa, er, ct
	if(type === "select") {

		var selected;
		if(index === "all") {
			// "checked" on "mousedown" event is reversed
			selected = !_ml.upgrade.node.check.checked;
		} else if(typeof param === "boolean") {
			selected = param;
		} else {
			selected = !_ml.mobs[index].selected;
		}

		mobs.forEach(function(mob){
			if(mob.visible) {
				mob.selected = selected;
				mob.node.li.classList[selected?"add":"remove"]("hvut-ml-fd-selected");
			}
		});

	} else if(type === "reset") {

		mobs.forEach(function(mob){
			mob.pa.forEach(function(e){
				e.to = e.value;
			});
			mob.er.forEach(function(e){
				e.to = e.value;
			});
			mob.ct.forEach(function(e){
				e.to = e.value;
			});

			_ml.upgrade.exec(mob.index,"pa","all",0);
			_ml.upgrade.exec(mob.index,"er","all",0);
			_ml.upgrade.exec(mob.index,"ct","all",0);

			_ml.upgrade.exec_calc(mob);
		});

	} else if(type==="pa" || type==="er" || type==="ct") {

		var items = item==="all"?_ml.upgrade[type].map((e,i)=>i) : [item];

		mobs.forEach(function(mob){
			items.forEach(function(i){
				var data = mob[type][i],
					value = data.value,
					to = data.to + param,
					max = type==="pa"?25 : type==="er"?50 : type==="ct"?data.max : 0;

				if(to < value) {
					to = value;
				} else if(to > max) {
					to = max;
				}
				data.to = to;
				data.node.textContent = to;
				data.node.style.color = to>value?"#f00":"";
			});
			_ml.upgrade.exec_calc(mob);

			mob.node.pl.textContent = mob.pl_to;
			mob.node.pl.style.color = mob.pl===mob.pl_to?"":"#c33";
		});
	}

	_ml.upgrade.sum();
},

exec_calc : function(mob) {
	mob.pa.forEach(function(e){
		e.require = _ml.upgrade.pa_cost.slice(e.value,e.to).reduce((p,c)=>p+c,0);
	});
	mob.er.forEach(function(e){
		e.require = _ml.upgrade.er_cost.slice(e.value,e.to).reduce((p,c)=>p+c,0);
	});

	mob.ct.require = mob.ct.reduce((p,c)=>p+(c.value+1+c.to)*(c.to-c.value)/2,0);

	mob.pl_to = mob.pa.reduce((p,c)=>p+_ml.upgrade.pa_pl[c.to],0) + mob.er.reduce((p,c)=>p+_ml.upgrade.er_pl[c.to],0);
},

sum : function(skip) {
	if(!skip) {
		_ml.upgrade.pa.forEach(function(e){e.require=0;});
		_ml.upgrade.er.forEach(function(e){e.require=0;});
		_ml.upgrade.ct.require = 0;

		_ml.mobs.forEach(function(mob){
			if(!mob.visible || !mob.selected) {
				return;
			}

			mob.pa.forEach(function(e,i){
				_ml.upgrade.pa[i].require += e.require;
			});
			mob.er.forEach(function(e,i){
				_ml.upgrade.er[i].require += e.require;
			});
			_ml.upgrade.ct.require += mob.ct.require;
		});
	}

	var stock = true;

	_ml.upgrade.pa.forEach(function(e){
		var li = e.li;
		li.innerHTML = "";

		$element("span",li,e.crystal.substr(11));
		$element("span",li,e.used.toLocaleString());
		$element("span",li,"+"+e.require.toLocaleString());
		$element("span",li,"("+e.stock.toLocaleString()+")");

		if(e.require > e.stock) {
			stock = false;
			li.classList.add("hvut-ml-fd-nostock");
		} else {
			li.classList.remove("hvut-ml-fd-nostock");
		}
	});

	_ml.upgrade.er.forEach(function(e){
		var li = e.li;
		li.innerHTML = "";

		$element("span",li,e.crystal.substr(11));
		$element("span",li,e.used.toLocaleString());
		$element("span",li,"+ "+e.require.toLocaleString());
		$element("span",li,"("+e.stock.toLocaleString()+")");

		if(e.require > e.stock) {
			stock = false;
			li.classList.add("hvut-ml-fd-nostock");
		} else {
			li.classList.remove("hvut-ml-fd-nostock");
		}
	});

	var ul = _ml.upgrade.ct.ul,
		li;

	ul.innerHTML = "";

	li = $element("li",ul,"Chaos Tokens");
	li = $element("li",ul);
	$element("span",li,"Slots");
	$element("span",li,_ml.upgrade.ct.slot.toLocaleString()+(_ml.upgrade.ct.gs?" * 2":""));
	li = $element("li",ul);
	$element("span",li,"Unlocked");
	$element("span",li,_ml.upgrade.ct.unlock.toLocaleString());
	li = $element("li",ul);
	$element("span",li,"Upgraded");
	$element("span",li,_ml.upgrade.ct.used.toLocaleString());
	li = $element("li",ul);
	$element("span",li,"Requires");
	$element("span",li,_ml.upgrade.ct.require.toLocaleString());
	li = $element("li",ul);
	$element("span",li,"Stock");
	$element("span",li,_ml.upgrade.ct.stock.toLocaleString());

	if(_ml.upgrade.ct.require > _ml.upgrade.ct.stock) {
		stock = false;
		li.classList.add("hvut-ml-fd-nostock");
	} else {
		li.classList.remove("hvut-ml-fd-nostock");
	}

	_ml.upgrade.stock = stock;
	_ml.upgrade.node.btn_run.disabled = !stock;
},

filter : function() {

	var mclass = _ml.upgrade.node.mclass.value,
		pl = _ml.upgrade.node.pl.value.trim(),
		pl_n,pl_c;

	if( (pl=/^(\d+)(\+|-)?$/.exec(pl)) ) {
		pl_n = parseInt(pl[1]);
		pl_c = pl[2];
	}

	var filtered = 0;

	_ml.mobs.forEach(function(mob){
		if( (!mclass || mclass===mob.mclass) && (!pl || (!pl_c?mob.pl===pl_n : pl_c==="+"?mob.pl>=pl_n : pl_c==="-"?mob.pl<=pl_n : false)) ) {
			mob.visible = true;
			mob.node.li.classList.remove("hvut-none");
			filtered++;

		} else {
			mob.visible = false;
			mob.node.li.classList.add("hvut-none");
		}
	});

	_ml.upgrade.node.name.textContent = filtered;

	_ml.upgrade.sum();
},

run : function() {
	if(!_ml.upgrade.stock) {
		alert("Not enough Crystals or Chaos Tokens");
		return;
	}
	if(_ml.upgrade.status !== 3) {
		return false;
	}

	if(!confirm("Are you sure you wish to upgrade monsters?")) {
		return;
	}

	_ml.upgrade.status = 4;
	_ml.upgrade.succeeded = 0;
	_ml.upgrade.failed = 0;
	_ml.upgrade.node.btn_run.disabled = true;
	_ml.upgrade.node.ol.style.opacity = 0.5;

	var requests = 0;

	_ml.mobs.forEach(function(mob){
		if(!mob.visible || !mob.selected) {
			return;
		}
		var need_update;

		mob.pa.forEach(function(e,i){
			var r = e.to - e.value;
			if(r < 1) {
				return;
			}
			need_update = true;
			requests += r;
			while(r--) {
				$ajax.send("POST","/?s=Bazaar&ss=ml&slot="+mob.index,"crystal_upgrade="+_ml.upgrade.pa[i].query,_ml.upgrade.feed_succeed,_ml.upgrade.feed_error);
			}
		});

		mob.er.forEach(function(e,i){
			var r = e.to - e.value;
			if(r < 1) {
				return;
			}
			need_update = true;
			requests += r;
			while(r--) {
				$ajax.send("POST","/?s=Bazaar&ss=ml&slot="+mob.index,"crystal_upgrade="+_ml.upgrade.er[i].query,_ml.upgrade.feed_succeed,_ml.upgrade.feed_error);
			}
		});

		mob.ct.forEach(function(e,i){
			var r = e.to - e.value;
			if(r < 1) {
				return;
			}
			need_update = true;
			requests += r;
			while(r--) {
				$ajax.send("POST","/?s=Bazaar&ss=ml&slot="+mob.index,"chaos_upgrade="+_ml.upgrade.ct[i].query,_ml.upgrade.feed_succeed,_ml.upgrade.feed_error);
			}
		});

		if(need_update) {
			mob.need_update = true;
			mob.log.pl = -1;
		}
	});

	_ml.upgrade.requests = requests;
	setValue("ml_log",_ml.log);
},

feed_succeed : function() {
	_ml.upgrade.succeeded++;
	if(!_ml.upgrade.requests) {
		return;
	}

	var completed = _ml.upgrade.succeeded + _ml.upgrade.failed;
	_ml.upgrade.node.btn_run.value = completed + " / " + _ml.upgrade.requests;

	if(completed === _ml.upgrade.requests) {
		_ml.upgrade.status = 3;
		_ml.upgrade.update();
	}
},

feed_error : function() {
	if($ajax.error && !_ml.upgrade.error) {
		_ml.upgrade.error = $ajax.error;
		return;
	}

	_ml.upgrade.failed++;
	if(!_ml.upgrade.requests) {
		return;
	}

	var completed = _ml.upgrade.succeeded + _ml.upgrade.failed;
	_ml.upgrade.node.btn_run.value = completed + " / " + _ml.upgrade.requests;

	if(completed === _ml.upgrade.requests) {
		_ml.upgrade.status = 3;
		_ml.upgrade.update();
	}
},

save : function() {
	_ml.mobs.forEach(function(mob){
		var log = mob.log;
		log.selected = mob.visible && mob.selected;

		log.pa.forEach(function(e,i){
			e.to = mob.pa[i].to;
		});
		log.er.forEach(function(e,i){
			e.to = mob.er[i].to;
		});
		log.ct.forEach(function(e,i){
			e.to = mob.ct[i].to;
		});
	});

	setValue("ml_log",_ml.log);
},

load : function() {
	_ml.mobs.forEach(function(mob,i){
		mob.visible = true;
		mob.node.li.classList.remove("hvut-none");

		if(mob.selected !== mob.log.selected) {
			_ml.upgrade.exec(i,"select");
		}

		mob.pa.forEach(function(e,j){
			e.to = mob.log.pa[j].to || e.value;
		});
		mob.er.forEach(function(e,j){
			e.to = mob.log.er[j].to || e.value;
		});
		mob.ct.forEach(function(e,j){
			e.to = mob.log.ct[j].to || e.value;
		});
	});

	_ml.upgrade.exec("all","pa","all",0);
	_ml.upgrade.exec("all","er","all",0);
	_ml.upgrade.exec("all","ct","all",0);
}

};

_ml.upgrade.node.btn_open = $element("input",_ml.main.buttons,{type:"button",value:"Monster Upgrader",disabled:true},_ml.upgrade.toggle);

_ml.inventory = {};
$ajax.send("GET","/?s=Character&ss=it",null,function(r){
	Array.from( substring(r.responseText,'<table class="nosel itemlist">',["</table>",true],true).firstElementChild.rows ).forEach(function(tr){
		_ml.inventory[ tr.cells[0].textContent.trim() ] = parseInt(tr.cells[1].textContent);
	});

	_ml.upgrade.pa.forEach(function(e){
		e.stock = _ml.inventory[e.crystal] || 0;
	});

	_ml.upgrade.er.forEach(function(e){
		e.stock = _ml.inventory[e.crystal] || 0;
	});

	_ml.upgrade.ct.stock = _ml.inventory["Chaos Token"] || 0;

	_ml.upgrade.node.btn_open.disabled = false;
});


// PL-Crystal Calculator
_ml.lab = {

preset : {
	"250": {count:1, pa_lv:6, pa_num:-2, er_lv:14, er_num:0},
	"500": {count:1, pa_lv:9, pa_num:3, er_lv:22, er_num:-2},
	"750": {count:1, pa_lv:12, pa_num:3, er_lv:27, er_num:1},
	"1000": {count:1, pa_lv:15, pa_num:1, er_lv:32, er_num:0},
	"1250": {count:1, pa_lv:17, pa_num:2, er_lv:36, er_num:3},
	"1500": {count:1, pa_lv:19, pa_num:3, er_lv:40, er_num:2},
	"1750": {count:1, pa_lv:21, pa_num:2, er_lv:44, er_num:-1},
	"2250": {count:1, pa_lv:25, pa_num:0, er_lv:50, er_num:0},
},
data : {
	pa_cost: [],
	pa_sum: [0],
	pa_pl: [0],
	er_cost: [],
	er_sum: [0],
	er_pl: [0],
},
list : [],
node : {},

init : function() {
	if(_ml.lab.inited) {
		return;
	}
	_ml.lab.inited = true;

	GM_addStyle(`
		#hvut-ml-lab-pane {position:absolute; top:27px; left:0; width:100%; height:675px; z-index:9; background-color:#EDEBDF; font-size:10pt; color:#000; text-align:left; white-space:nowrap}
		.hvut-ml-lab-side {position:absolute; left:650px; margin:10px}
		.hvut-ml-lab-table {top:300px; width:480px; border-collapse:collapse; background-color:#fff}
		.hvut-ml-lab-table th, .hvut-ml-lab-table td {border:1px solid #999; padding:2px 5px}
		.hvut-ml-lab-table td:first-child {text-align:right}
		.hvut-ml-lab-total {display:flex; width:516px; margin:10px 0 0 100px; padding:5px 0; border:1px solid #999; justify-content:space-evenly; line-height:25px; background-color:#ccc}
		.hvut-ml-lab-total > div:first-child {width:60px}
		.hvut-ml-lab-total > div {width:200px; padding:5px; border:1px solid #999; background-color:#fff}
		.hvut-ml-lab-scroll {width:540px; height:575px; margin:10px 0 0 100px; overflow:auto}
		.hvut-ml-lab-scroll > div {display:flex; position:relative; width:516px; margin:5px 0; padding:5px 0; border:1px solid #999; justify-content:space-evenly; line-height:25px; background-color:#fff}
		.hvut-ml-lab-scroll > div > div:first-child {width:60px}
		.hvut-ml-lab-scroll > div > div {width:200px; padding:5px; border:1px solid #999}
		.hvut-ml-lab-border {border-bottom:1px solid #999; margin:5px -3px}
		.hvut-ml-lab-crystal {float:right; text-align:right}
		.hvut-ml-lab-diff {float:right; text-align:right; width:100px}
		.hvut-ml-lab-sum {float:right; text-align:right; width:100px}
		.hvut-ml-lab-trans {color:#666; opacity:0.5}

		#hvut-ml-lab-pane input[type=number] {width:40px; margin-right:5px; text-align:right}
		#hvut-ml-lab-pane input[type=button] {padding:0}
		.hvut-ml-lab-scroll input[type=button] {width:25px}
		.hvut-ml-lab-scroll input:nth-child(1) {float:right; width:20px; margin:2px}
		.hvut-ml-lab-scroll input:nth-of-type(5) {position:absolute; height:35px; margin:-23px 0 0 5px}
		.hvut-ml-lab-scroll input:nth-of-type(6) {position:absolute; height:35px; margin: 13px 0 0 5px}
	`);

	var data = _ml.lab.data;
	for(let i=0;i<25;i++) {
		data.pa_cost[i] = Math.round(50 * Math.pow(1.555079154,i));
		data.pa_sum[i+1] = data.pa_sum[i] + data.pa_cost[i];
		data.pa_pl[i+1] = data.pa_pl[i] + (3+i*0.5);
	}
	for(let i=0;i<50;i++) {
		data.er_cost[i] = Math.round(10 * Math.pow(1.26485522,i));
		data.er_sum[i+1] = data.er_sum[i] + data.er_cost[i];
		data.er_pl[i+1] = data.er_pl[i] + Math.floor(1+i*0.1);
	}

	var node = _ml.lab.node;
	node.pane = $element("div",$id("mainpane"),["#hvut-ml-lab-pane"]);

	var side = $element("div",node.pane,[".hvut-ml-lab-side"]);
	$element("input",side,{type:"button",value:"Save",style:"width:60px"},function(){_ml.lab.save();});
	$element("input",side,{type:"button",value:"Revert",style:"width:60px"},function(){_ml.lab.load();});
	$element("input",side,{type:"button",value:"Close",style:"width:60px"},function(){_ml.lab.close();});
	$element("br",side);
	$element("br",side);
	$element("input",side,{type:"button",value:"Add Monster",style:"width:180px"},function(){_ml.lab.add();});
	Object.keys(_ml.lab.preset).forEach((e,i)=>{
		if(!(i%4)) {
			$element("br",side);
		}
		$element("input",side,{type:"button",value:e,style:"width:45px"},function(){_ml.lab.add(_ml.lab.preset[e]);});
	});
	$element("br",side);
	$element("br",side);

	$element("table",side,[".hvut-ml-lab-table","/"+
		`<tbody>
		<tr><th>Power<br> Level</th><th>Effects</th></tr>
		<tr><td>25</td><td>Unlocks naming and becomes active in battles once named</td></tr>
		<tr><td>200</td><td>Unlocks second Skill Attack</td></tr>
		<tr><td>250</td><td>Can no longer be deleted<br>Morale drain reduced by 2x</td></tr>
		<tr><td>251</td><td>Requires Monster Edibles instead of Monster Chow as Food</td></tr>
		<tr><td>400</td><td>Unlocks Spirit Attack</td></tr>
		<tr><td>499</td><td>Gifts may now include High-Grade materials</td></tr>
		<tr><td>750</td><td>Morale drain reduced by 3x<br>Low-Grade materials can no longer be gifts</td></tr>
		<tr><td>751</td><td>Requires Monster Cuisine instead of Monster Edibles as Food</td></tr>
		<tr><td>1000</td><td>Will never be deactivated</td></tr>
		<tr><td>1005</td><td>All Chaos Upgrades are available</td></tr>
		<tr><td>1250</td><td>Morale drain reduced by 4x</td></tr>
		<tr><td>1499</td><td>Mid-Grade materials can no longer be gifts (100% are High-Grade)</td></tr>
		<tr><td>1750</td><td>Morale drain reduced by 5x</td></tr>
		<tr><td>2250</td><td>Power Level cap reached<br>Morale drain reduced by 6x</td></tr>
		</tbody>`]);

	var total = $element("div",node.pane,[".hvut-ml-lab-total"]);
	$element("div",total).append(
		$element("span",null,"Monsters"),$element("br"),
		node.count = $element("input",null,{type:"number",readOnly:true,style:"width:50px"})
	);
	$element("div",total).append(
		$element("span",null,"Primary Attribute Crystals"),$element("br"),
		node.pa_total = $element("span",null,[".hvut-ml-lab-sum"]),
		node.pa_total_diff = $element("span",null,[".hvut-ml-lab-diff"])
	);
	$element("div",total).append(
		$element("span",null,"Elemental Mitigation Crystals"),$element("br"),
		node.er_total = $element("span",null,[".hvut-ml-lab-sum"]),
		node.er_total_diff = $element("span",null,[".hvut-ml-lab-diff"])
	);

	node.scroll = $element("div",node.pane,[".hvut-ml-lab-scroll"]);

	_ml.lab.load();
},

save : function() {
	setValue("ml_lab",_ml.lab.list.map(m=>m.json));
},
load : function() {
	_ml.lab.list.forEach(m=>m.node.div.remove());
	_ml.lab.list.length = 0;
	getValue("ml_lab",[_ml.lab.preset["250"]]).forEach(function(m){
		_ml.lab.add(m);
	});
},
open : function() {
	_ml.lab.init();
	_ml.lab.node.pane.classList.remove("hvut-none");
},
close : function() {
	_ml.lab.node.pane.classList.add("hvut-none");
},
remove : function(m) {
	if(m) {
		m.node.div.remove();
		_ml.lab.list.splice(_ml.lab.list.indexOf(m),1);
		_ml.lab.list.forEach(function(m,i){m.node.index.textContent="#"+(i+1);});
	}
	_ml.lab.calc();
},
select : function() {
	this.select();
},

add : function(j) {
	var m = {json:{count:1,pa_lv:0,pa_num:0,er_lv:0,er_num:0},node:{}};
	if(j) {
		Object.assign(m.json,j);
	}
	m.node.div = $element("div",_ml.lab.node.scroll);
	var sub;

	sub = $element("div",m.node.div);
	$element("input",sub,{type:"button",value:"X"},function(){_ml.lab.remove(m);});
	m.node.index = $element("span",sub,"#"+(_ml.lab.list.length+1));
	$element("br",sub);
	m.node.pl = $element("span",sub);
	$element("br",sub);
	m.node.count = $element("input",sub,{type:"number",min:0,max:200,step:1,style:"width:50px"},{input:function(){_ml.lab.change(m,"count");},focus:_ml.lab.select});
	$element("br",sub);
	$element("br",sub);
	$element("div",sub,[".hvut-ml-lab-border"]);
	$element("span",sub,"Average");
	$element("br",sub);
	$element("span",sub,"Total");

	sub = $element("div",m.node.div);
	$element("span",sub,"Primary Attribute Crystals");
	$element("br",sub);
	m.node.pa1_lv = $element("input",sub,{type:"number",disabled:true});
	m.node.pa1_num = $element("input",sub,{type:"button"},function(){_ml.lab.change(m,"pa_num","+");});
	m.node.pa1_crystal = $element("span",sub,[".hvut-ml-lab-crystal"]);
	$element("br",sub);
	m.node.pa_lv = $element("input",sub,{type:"number",value:0,min:0,max:25,step:1},{input:function(){_ml.lab.change(m,"pa_lv");},focus:_ml.lab.select});
	m.node.pa_num = $element("input",sub,{type:"button"},function(){_ml.lab.change(m,"pa_num","*");});
	m.node.pa_num_dec = $element("input",sub,{type:"button",value:"+"},function(){_ml.lab.change(m,"pa_lv","+");});
	m.node.pa_num_inc = $element("input",sub,{type:"button",value:"-"},function(){_ml.lab.change(m,"pa_lv","-");});
	m.node.pa_crystal = $element("span",sub,[".hvut-ml-lab-crystal"]);
	$element("br",sub);
	m.node.pa2_lv = $element("input",sub,{type:"number",disabled:true});
	m.node.pa2_num = $element("input",sub,{type:"button"},function(){_ml.lab.change(m,"pa_num","-");});
	m.node.pa2_crystal = $element("span",sub,[".hvut-ml-lab-crystal"]);
	$element("br",sub);
	$element("div",sub,[".hvut-ml-lab-border"]);
	m.node.pa_avg = $element("span",sub,[".hvut-ml-lab-sum"]);
	m.node.pa_avg_diff = $element("span",sub,[".hvut-ml-lab-diff"]);
	$element("br",sub);
	m.node.pa_total = $element("span",sub,[".hvut-ml-lab-sum"]);
	m.node.pa_total_diff = $element("span",sub,[".hvut-ml-lab-diff"]);

	sub = $element("div",m.node.div);
	$element("span",sub,"Elemental Mitigation Crystals");
	$element("br",sub);
	m.node.er1_lv = $element("input",sub,{type:"number",disabled:true});
	m.node.er1_num = $element("input",sub,{type:"button"},function(){_ml.lab.change(m,"er_num","+");});
	m.node.er1_crystal = $element("span",sub,[".hvut-ml-lab-crystal"]);
	$element("br",sub);
	m.node.er_lv = $element("input",sub,{type:"number",value:0,min:0,max:50,step:1},{input:function(){_ml.lab.change(m,"er_lv");},focus:_ml.lab.select});
	m.node.er_num = $element("input",sub,{type:"button"},function(){_ml.lab.change(m,"er_num","*");});
	m.node.er_num_dec = $element("input",sub,{type:"button",value:"+"},function(){_ml.lab.change(m,"er_lv","+");});
	m.node.er_num_inc = $element("input",sub,{type:"button",value:"-"},function(){_ml.lab.change(m,"er_lv","-");});
	m.node.er_crystal = $element("span",sub,[".hvut-ml-lab-crystal"]);
	$element("br",sub);
	m.node.er2_lv = $element("input",sub,{type:"number",disabled:true});
	m.node.er2_num = $element("input",sub,{type:"button"},function(){_ml.lab.change(m,"er_num","-");});
	m.node.er2_crystal = $element("span",sub,[".hvut-ml-lab-crystal"]);
	$element("br",sub);
	$element("div",sub,[".hvut-ml-lab-border"]);
	m.node.er_avg = $element("span",sub,[".hvut-ml-lab-sum"]);
	m.node.er_avg_diff = $element("span",sub,[".hvut-ml-lab-diff"]);
	$element("br",sub);
	m.node.er_total = $element("span",sub,[".hvut-ml-lab-sum"]);
	m.node.er_total_diff = $element("span",sub,[".hvut-ml-lab-diff"]);

	_ml.lab.list.push(m);
	_ml.lab.calc(m);
},

change : function(m,p,v) {
	switch(p) {

	case "count":
		if(!isNaN(v)) {
			m.json[p] = parseInt(v);
		} else if(v === undefined) {
			m.json[p] = parseInt(m.node[p].value);
		}
		break;

	case "pa_lv":
	case "er_lv": {
		let p_num = p.substr(0,2)+"_num";
		if(v === "+") {
			if(m.json[p_num] >= 0) {
				m.json[p]++;
			}
		} else if(v === "-") {
			if(m.json[p_num] <= 0) {
				m.json[p]--;
			}
		} else if(!isNaN(v)) {
			m.json[p] = parseInt(v);
		} else if(v === undefined) {
			m.json[p] = parseInt(m.node[p].value);
		}
		m.json[p_num] = 0;
		break;
	}

	case "pa_num":
	case "er_num": {
		if(v === "*") {
			v = m.json[p]<0?"+" : m.json[p]>0?"-" : 0;
		}
		if(v === "+") {
			m.json[p]++;
		} else if(v === "-") {
			m.json[p]--;
		} else if(!isNaN(v)) {
			m.json[p] = parseInt(v);
		}
		break;
	}

	}

	var type = p.substr(0,2),
		lv = m.json[type+"_lv"],
		num = m.json[type+"_num"],
		max = type==="pa"?25:type==="er"?50:0;
	if(!max) {
		_ml.lab.calc(m);
		return;
	}

	if(num > 6) {
		lv++;
		num = 0;
	} else if(num < -6) {
		lv--;
		num = 0;
	}
	if(lv > max) {
		lv = max;
		num = 0;
	} else if(lv===max && num>0) {
		num = 0;
	}
	if(lv < 0) {
		lv = 0;
		num = 0;
	} else if(lv===0 && num<0) {
		num = 0;
	}
	m.json[type+"_lv"] = lv;
	m.json[type+"_num"] = num;

	_ml.lab.calc(m);
},

calc : function(m) {
	if(m) {
		if(m.node.count.validity.valid && m.node.pa_lv.validity.valid && m.node.er_lv.validity.valid) {
			var data = _ml.lab.data,
				count = m.json.count,
				pa_lv = m.json.pa_lv,
				pa1_lv = pa_lv<25?pa_lv+1:25,
				pa2_lv = pa_lv>0?pa_lv-1:0,
				pa_num = m.json.pa_num,
				pa1_num = pa_num>0?pa_num:0,
				pa2_num = pa_num<0?pa_num*-1:0,
				pa_num = 6 - Math.abs(pa_num),
				er_lv = m.json.er_lv,
				er1_lv = er_lv<50?er_lv+1:50,
				er2_lv = er_lv>0?er_lv-1:0,
				er_num = m.json.er_num,
				er1_num = er_num>0?er_num:0,
				er2_num = er_num<0?er_num*-1:0,
				er_num = 6 - Math.abs(er_num),
				pa_crystal = data.pa_sum[pa_lv],
				pa1_crystal = data.pa_sum[pa1_lv],
				pa2_crystal = data.pa_sum[pa2_lv],
				er_crystal = data.er_sum[er_lv],
				er1_crystal = data.er_sum[er1_lv],
				er2_crystal = data.er_sum[er2_lv],
				pa_avg = (pa_crystal*pa_num + pa1_crystal*pa1_num + pa2_crystal*pa2_num) / 6,
				pa_total = pa_avg * count,
				er_avg = (er_crystal*er_num + er1_crystal*er1_num + er2_crystal*er2_num) / 6,
				er_total = er_avg * count,
				pa_avg_diff = pa_avg - er_avg,
				pa_total_diff = pa_avg_diff * count,
				er_avg_diff = er_avg - pa_avg,
				er_total_diff = er_avg_diff * count,
				pl = data.pa_pl[pa_lv]*pa_num + data.pa_pl[pa1_lv]*pa1_num + data.pa_pl[pa2_lv]*pa2_num + data.er_pl[er_lv]*er_num + data.er_pl[er1_lv]*er1_num + data.er_pl[er2_lv]*er2_num;

			m.pl = pl;
			m.count = count;
			m.pa_avg = pa_avg;
			m.er_avg = er_avg;
			m.pa_total = pa_total;
			m.er_total = er_total;

			m.node.pl.textContent = "PL "+pl;
			if(m.node.count.value != count) {
				m.node.count.value = count;
			}
			if(m.node.pa_lv.value != pa_lv) {
				m.node.pa_lv.value = pa_lv;
			}
			if(m.node.er_lv.value != er_lv) {
				m.node.er_lv.value = er_lv;
			}
			m.node.pa1_num.classList[pa1_num?"remove":"add"]("hvut-ml-lab-trans");
			m.node.pa2_num.classList[pa2_num?"remove":"add"]("hvut-ml-lab-trans");
			m.node.er1_num.classList[er1_num?"remove":"add"]("hvut-ml-lab-trans");
			m.node.er2_num.classList[er2_num?"remove":"add"]("hvut-ml-lab-trans");

			m.node.pa1_lv.value = pa1_lv;
			m.node.pa2_lv.value = pa2_lv;
			m.node.pa_num.value = pa_num;
			m.node.pa1_num.value = pa1_num;
			m.node.pa2_num.value = pa2_num;
			m.node.er1_lv.value = er1_lv;
			m.node.er2_lv.value = er2_lv;
			m.node.er_num.value = er_num;
			m.node.er1_num.value = er1_num;
			m.node.er2_num.value = er2_num;
			m.node.pa_crystal.textContent = pa_crystal.toLocaleString();
			m.node.pa1_crystal.textContent = pa1_crystal.toLocaleString();
			m.node.pa2_crystal.textContent = pa2_crystal.toLocaleString();
			m.node.er_crystal.textContent = er_crystal.toLocaleString();
			m.node.er1_crystal.textContent = er1_crystal.toLocaleString();
			m.node.er2_crystal.textContent = er2_crystal.toLocaleString();
			m.node.pa_avg.textContent = Math.round(pa_avg).toLocaleString();
			m.node.pa_avg_diff.textContent = pa_avg_diff>0?"(+"+Math.round(pa_avg_diff).toLocaleString()+")":"-";
			m.node.pa_total.textContent = Math.round(pa_total).toLocaleString();
			m.node.pa_total_diff.textContent = pa_total_diff>0?"(+"+Math.round(pa_total_diff).toLocaleString()+")":"-";
			m.node.er_avg.textContent = Math.round(er_avg).toLocaleString();
			m.node.er_avg_diff.textContent = er_avg_diff>0?"(+"+Math.round(er_avg_diff).toLocaleString()+")":"-";
			m.node.er_total.textContent = Math.round(er_total).toLocaleString();
			m.node.er_total_diff.textContent = er_total_diff>0?"(+"+Math.round(er_total_diff).toLocaleString()+")":"-";

			m.valid = true;
		} else {
			m.valid = false;
		}
	}

	var total_count=0, total_pa=0, total_er=0, total_diff;
	_ml.lab.list.forEach(m=>{
		if(!m.valid) {
			return;
		}
		total_count += m.count;
		total_pa += m.pa_total;
		total_er += m.er_total;
	});
	total_diff = total_pa - total_er;

	_ml.lab.node.count.value = total_count;
	_ml.lab.node.pa_total.textContent = Math.round(total_pa).toLocaleString();
	_ml.lab.node.pa_total_diff.textContent = total_diff>0?"(+"+Math.round(total_diff).toLocaleString()+")":"-";
	_ml.lab.node.er_total.textContent = Math.round(total_er).toLocaleString();
	_ml.lab.node.er_total_diff.textContent = total_diff<0?"(+"+Math.round(-total_diff).toLocaleString()+")":"-";
},

};

$element("input",_ml.main.buttons,{type:"button",value:"PL Calculator"},_ml.lab.open);

$element("input",_ml.main.buttons,{type:"button",value:"Reset Log"},function(){if(confirm("Monster gift log will be deleted.\n\nContinue?")){deleteValue("ml_log");location.href=location.href;}});

}

} else
// [END 11] Bazaar - Monster Lab */


//* [12] Bazaar - The Shrine
if(settings.shrine && _query.s==="Bazaar" && _query.ss==="ss") {

_ss.inventory = {};
_ss.node = {};
_ss.log = getValue("ss_log",{});
_ss.queue = {capacity:0,current:0,request:0,received:0};
_ss.values = {
	"ManBearPig Tail": 500,
	"Holy Hand Grenade of Antioch": 500,
	"Mithra's Flower": 500,
	"Dalek Voicebox": 500,
	"Lock of Blue Hair": 750,
	"Bunny-Girl Costume": 1000,
	"Hinamatsuri Doll": 1000,
	"Broken Glasses": 1000,
	"Black T-Shirt": 5000,
	"Sapling": 5000,
	"Unicorn Horn": 5000,
	"Noodly Appendage": 5000,
};
_ss.index_items = [
	"Precursor Artifact",
	"ManBearPig Tail","Holy Hand Grenade of Antioch","Mithra's Flower","Dalek Voicebox","Lock of Blue Hair","Bunny-Girl Costume","Hinamatsuri Doll","Broken Glasses","Black T-Shirt","Sapling","Unicorn Horn","Noodly Appendage","Stocking Stuffers","Tenbora's Box",
	"Mysterious Box","Solstice Gift","Shimmering Present","Potato Battery","RealPervert Badge","Raptor Jesus","Rainbow Egg","Colored Egg","Gift Pony","Faux Rainbow Mane Cap","Pegasopolis Emblem","Fire Keeper Soul","Crystalline Galanthus","Sense of Self-Satisfaction","Six-Lock Box","Golden One-Bit Coin","USB ASIC Miner","Reindeer Antlers","Ancient Porn Stash","VPS Hosting Coupon","Heart Locket","Holographic Rainbow Projector","Pot of Gold","Dinosaur Egg","Precursor Smoothie Blender","Rainbow Smoothie","Mysterious Tooth",
	"Platinum Coupon","Golden Coupon","Silver Coupon","Bronze Coupon",
];
_ss.index_rewards = [
	"Energy Drink","2 Hath","1 Hath","Last Elixir","1000x Crystal","1000x Crystal of Vigor","1000x Crystal of Finesse","1000x Crystal of Swiftness","1000x Crystal of Fortitude","1000x Crystal of Cunning","1000x Crystal of Knowledge","1000x Crystal of Flames","1000x Crystal of Frost","1000x Crystal of Lightning","1000x Crystal of Tempest","1000x Crystal of Devotion","1000x Crystal of Corruption","Primary Attributes Bonus","Your strength has increased by one","Your dexterity has increased by one","Your agility has increased by one","Your endurance has increased by one","Your intelligence has increased by one","Your wisdom has increased by one",
	"3x High-Grade Material","3x High-Grade Cloth","3x High-Grade Leather","3x High-Grade Metals","3x High-Grade Wood","2x High-Grade Material","2x High-Grade Cloth","2x High-Grade Leather","2x High-Grade Metals","2x High-Grade Wood","1x High-Grade Material","1x High-Grade Cloth","1x High-Grade Leather","1x High-Grade Metals","1x High-Grade Wood","Binding",
	"Peerless","Legendary","Magnificent","Exquisite","Superior","Average","Fair","Crude",
];
_ss.group_items = [
	{includes:"1000x Crystal of",tag:"1000x Crystal"},
	{includes:"has increased by one",tag:"Primary Attributes Bonus"},
	{includes:"3x High-Grade",tag:"3x High-Grade Material"},
	{includes:"1x High-Grade",tag:"2x High-Grade Material"},
	{includes:"1x High-Grade",tag:"1x High-Grade Material"},
	{includes:"Binding of",tag:"Binding"},
];

_ss.offer = function(name,count) {
	var item = _ss.inventory[name];
	if(count > item.stock) {
		count = item.stock;
	}
	if(!count) {
		return;
	}

	var select_reward;
	if(item.type==="Artifact" || item.type==="Collectable") {
		select_reward = "0";
	} else {
		var select_img = $qs("img[src$='_on.png']",$id("shrine_trophy"));
		if(select_img) {
			select_reward = select_img.id.substr(7);
		} else {
			popup("Select the major class of the item");
			return;
		}
		if(_ss.queue.current+_ss.queue.request+count > _ss.queue.capacity) {
			alert("Not enough storage capacity in Equip Inventory");
			return;
		}
		_ss.queue.request += count;
	}

	if(!_ss.node.results) {
		_ss.node.results = $element("div",$id("shrine_outer"),[".hvut-ss-rewards"]);
	}
	if(!item.rewards) {
		item.rewards = {};

		if(!_ss.log[name]) {
			_ss.log[name] = {};
		}
		item.log = _ss.log[name];

		item.node.header = $element("h4",_ss.node.results,[" "+name,".hvut-ss-h4"]);
		item.node.ul = $element("ul",_ss.node.results,[".hvut-ss-ul"]);
		scrollIntoView(item.node.ul);
	}

	item.stock -= count;
	item.request += count;
	item.node.stock.textContent = item.stock;

	var reg = /Received (.+)|(Your .+ has increased by one)|((?:Crude|Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless) .+)/;

	while(count--) {
		$ajax.send("POST","/?s=Bazaar&ss=ss","select_item="+item.id+"&select_reward="+select_reward,function(r){
			var rewards = [], fos;
			Array.from( substring(r.responseText,'<div id="messagebox"','<div id="mainpane">',true).firstElementChild.lastElementChild.children ).forEach(function(e){
				e = e.textContent.trim();
				if(!e || e==="Snowflake has blessed you with some of her power!" || e==="Snowflake has blessed you with an item!" || e==="Received:" || e==="Hit Space Bar to offer another item like this.") {
					return;
				}
				if(reg.test(e)) {
					if(fos) {
						popup("<span>Follower peerless granted!</span><br /><span style='color:#f00;font-weight:bold'>"+RegExp.$3+"</span>");
					} else {
						rewards.push(RegExp.$1||RegExp.$2||RegExp.$3);
					}
				} else if(e === "Follower peerless granted!") {
					fos = true;
				} else if(e === "Your equipment inventory is full") {
					if(!$ajax.error) {
						popup(e);
					}
					$ajax.error = e;
				} else {
					rewards.push(e);
				}
			});

			item.count++;
			item.node.header.textContent = name + " ("+item.count+"/"+item.request+")";

			rewards.forEach(function(r){
				var group = _ss.group_items.find(g=>r.includes(g.includes));
				if(group) {
					var tag = group.tag;
					group = item.rewards[tag];
					if(!group) {
						group = item.rewards[tag] = {count:0,group:"group",node:{}};

						var insert = _ss.index_rewards.indexOf(tag);
						insert = insert!==-1 && _ss.index_rewards.find((e,i)=>i>insert&&item.rewards[e]);
						insert = insert?item.rewards[insert].node.li:null;
						group.node.li = $element("li",[item.node.ul,insert],[".hvut-ss-group"]);
						group.node.percentage = $element("span",group.node.li);
						group.node.count = $element("span",group.node.li);
						group.node.name = $element("span",group.node.li,tag);
					}
					group.count++;
				}

				var key = item.type==="Trophy"?r.split(" ")[0]:r,
					data = item.rewards[key];
				if(!data) {
					data = item.rewards[key] = {count:0,group:group?"groupitem":"item",node:{}};

					var insert = _ss.index_rewards.indexOf(key);
					insert = insert!==-1 && _ss.index_rewards.find((e,i)=>i>insert&&item.rewards[e]);
					insert = insert?item.rewards[insert].node.li:null;
					data.node.li = $element("li",[item.node.ul,insert],[group?".hvut-ss-groupitem":".hvut-ss-item"]);
					data.node.percentage = $element("span",data.node.li);
					data.node.count = $element("span",data.node.li);
					data.node.name = $element("span",data.node.li,key);
				}
				data.count++;

				for(let r in item.rewards) {
					let d = item.rewards[r];
					d.node.percentage.textContent = (d.count*100/item.count).toFixed(1)+" %";
					d.node.count.textContent = " ["+d.count+"] ";
				}

				if(!item.log[key]) {
					item.log[key] = 0;
				}
				item.log[key]++;

				if(item.type === "Trophy") {
					if(settings.shrineTrackEquip[key]) {
						$element("li",[item.node.ul,data.node.li.nextSibling],[" "+r,".hvut-ss-equip"]);
					}
					_ss.queue.received++;
					_ss.queue.node.value = "Equip Slots: "+(_ss.queue.current+_ss.queue.request)+" / "+_ss.queue.capacity;
				}
			});

			if(item.count%10===0 || item.count===item.request || $ajax.error) {
				setValue("ss_log",_ss.log);
			}
		});
	}

	_ss.node.results.classList.remove("hvut-none");
};

_ss.view_log = function() {
	if(!_ss.node.log) {
		_ss.node.log = $element("div",null,[".hvut-ss-log"]);
	}

	var div = _ss.node.log;
	div.innerHTML = "";
	if(div.parentNode) {
		div.remove();
		return;
	}

	object_sort(_ss.log,_ss.index_items);
	for(let item in _ss.log) {
		let rewards = {},
			total = 0;
		for(let name in _ss.log[item]) {
			let count = _ss.log[item][name];
			total += count;
			rewards[name] = {count:count,group:"item"};

			let group = _ss.group_items.find(g=>name.includes(g.includes));
			if(group) {
				rewards[name].group = "groupitem";
				let tag = group.tag;
				group = rewards[tag];
				if(!group) {
					group = rewards[tag] = {count:0,group:"group"};
				}
				group.count += count;
			}
		}
		object_sort(rewards,_ss.index_rewards);

		$element("h4",div,[" "+item+" ("+total+")",".hvut-ss-h4"]);
		let ul = $element("ul",div,[".hvut-ss-ul"]);
		for(let r in rewards) {
			let data = rewards[r];
			$element("li",ul,[".hvut-ss-"+data.group]).append(
				$element("span",null,(data.count*100/total).toFixed(1)+" %"),
				$element("span",null," ["+data.count+"] "),
				$element("span",null,r)
			);
		}
	}

	$element("input", $element("div",div,["!margin-top:20px;padding:10px;border-top:1px solid #999"]), {type:"button",value:"Reset Log"},function(){if(confirm("Shrine reward log will be deleted.\n\nContinue?")){deleteValue("ss_log");location.href=location.href;}});

	$id("shrine_outer").appendChild(div);
};

_ss.calc_inventory = function(p) {
	var text = [],
		total = 0;
	for(let name in _ss.inventory) {
		let item = _ss.inventory[name];
		if(item.value) {
			total += item.stock * item.value;
			text.push(item.stock.toLocaleString()+" x "+name+" @ "+item.value.toLocaleString()+" = "+(item.stock*item.value).toLocaleString());
		}
	}
	var sum = "You have "+total.toLocaleString()+" credits worth of trophies in the inventory.";
	_ss.node.inventory.value = sum;

	if(p) {
		text.push("",sum);
		popup_text(text,"width:500px;max-height:500px;white-space:pre");
	}
};

GM_addStyle(`
	#shrine_outer {position:relative}
	#shrine_left > div:first-child {display:none}
	#shrine_right > div:first-child {height:350px}
	.cspp {margin-top:30px}

	#item_pane .itemlist td:nth-child(1) {width:175px !important}
	#item_pane .itemlist td:nth-child(2) {width:50px}
	#item_pane .itemlist td:nth-child(3) {width:140px; text-align:left}

	.hvut-ss-buttons {position:absolute; top:15px; left:0; width:404px; white-space:nowrap}
	.hvut-ss-buttons > input {margin:0 5px}

	.hvut-ss-offer {width:40px; text-align:right}
	.hvut-ss-log {position:absolute; top:52px; left:0; width:383px; height:552px; margin:0; padding:10px; border:1px solid #999; text-align:left; overflow:auto; background-color:#fff}
	.hvut-ss-rewards {position:absolute; top:52px; left:424px; width:464px; height:552px; margin:0; padding:10px; border:1px solid #999; text-align:left; overflow:auto; background-color:#fff}
	.hvut-ss-h4 {margin:10px 5px 5px; font-size:12pt}
	.hvut-ss-ul {margin:10px; padding:0; list-style:none; font-size:10pt}

	.hvut-ss-ul span:first-child {display:inline-block; width:60px; text-align:right; color:#930}
	.hvut-ss-ul span:last-child {font-weight:bold}
	.hvut-ss-groupitem {color:#999}
	.hvut-ss-groupitem > span:first-child {visibility:hidden}
	.hvut-ss-equip {margin-left:65px; color:#930}
	.hvut-ss-equip + .hvut-ss-item {margin-top:5px}
`);

_ss.node.buttons = $element("div",[$id("item_pane").parentNode,0],[".hvut-ss-buttons"]);

_ss.queue.node = $element("input",_ss.node.buttons,{type:"button",value:"Equip Slots: ? / ?",style:"width:175px"});

$id("csp").classList.add("hvut-hide-on");
$element("input",_ss.node.buttons,{type:"button",value:"Show Items",style:"width:90px"},function(){if($id("csp").classList.contains("hvut-hide-on")){$id("csp").classList.remove("hvut-hide-on");this.value="Hide Items";}else{$id("csp").classList.add("hvut-hide-on");this.value="Show Items";}});

$element("input",_ss.node.buttons,{type:"button",value:"Log"},_ss.view_log);
$element("input",_ss.node.buttons,{type:"button",value:"Results"},function(){if(_ss.node.results){_ss.node.results.classList.toggle("hvut-none");}});

$ajax.send("GET","/?s=Character&ss=in",null,function(r){
	var exec = /(\d+)(?: \+ (\d+))? \/ (\d+)/.exec( substring(r.responseText,"<div>Equip Slots: ","</div>") );
	_ss.queue.current = parseInt(exec[1]) + parseInt(exec[2]||0);
	_ss.queue.capacity = parseInt(exec[3]);
	_ss.queue.node.value = "Equip Slots: "+_ss.queue.current+" / "+_ss.queue.capacity;
});

$qsa("#item_pane .itemlist tr").forEach(function(tr){
	var div = tr.cells[0].firstElementChild,
		name = div.textContent,
		id = /snowflake\.set_shrine_item\((\w+),'(.+?)'\);/.test(div.getAttribute("onclick")) && RegExp.$1,
		type = /'([^']+)'\)/.test(div.getAttribute("onmouseover")) && RegExp.$1.replace(/\W/g,"_") || "Consumable",
		stock = parseInt(tr.cells[1].textContent),
		item = {id:id,type:type,stock:stock,value:_ss.values[name],request:0,count:0,node:{}};

	_ss.inventory[name] = item;

	var td = $element("td",tr);
	item.node.stock = tr.cells[1];
	item.node.count = $element("input",td,[".hvut-ss-offer"]);
	item.node.button = $element("input",td,{type:"button",value:"Offer"},function(){_ss.offer(name,Number(item.node.count.value));});

	if(item.type === "Trophy") {
		$element("input",td,{type:"button",value:"All"},function(){_ss.offer(name,item.stock);});
	}
	if( settings.shrineHideItems.some(h=>name.includes(h)) ) {
		tr.classList.add("hvut-hide");
	}
});

_ss.node.inventory = $element("input",[$id("shrine_trophy"),6],{type:"button",value:"Calculate Inventory",style:"margin:10px 0"},function(){_ss.calc_inventory(true);});
_ss.calc_inventory();

} else
// [END 12] Bazaar - The Shrine */


//* [13] Bazaar - MoogleMail
if(settings.moogleMail && _query.s==="Bazaar" && _query.ss==="mm") {

_mm.node = {};

// MM SEND
_mm.send = function(queue) {
	var s = _mm.send,
		b;
	if(queue) {
		if(!queue.length) {
			return;
		}
		if(s.error) {
			return;
		}
		if(s.batch) {
			alert("Now sending other mail");
			return;
		}
		if(!_mm.node.to_name.value) {
			alert("No recipient");
			return;
		}

		s.index = 0;
		s.batch = [];

		b = null;
		queue.forEach(function(c,i){ // c={mail:{pane,to_name,subject,body,count,cod,price,atext},info:{name,eid,iid},node:{}}
			if(!b || c.mail.to_name && c.mail.to_name!==b.to_name || b.length >= _mm.max || !c.mail.pane) { // next batch
				b = null;
			}
			if(!b) {
				b = [];
				b.count = 0;
				b.cod = 0;
				b.atext = "";
				b.to_name = c.mail.to_name || _mm.node.to_name.value;
				b.subject = c.mail.subject || _mm.node.subject.value;
				b.body = _mm.node.body.value + (c.mail.body?"\n\n"+c.mail.body:"");
				s.batch.push(b);
			}
			b.push(c);

			c.mail.index = i;
			if(c.mail.pane) { // attach
				if(c.mail.cod) {
					b.cod += c.mail.cod;
				}
				if(c.mail.atext) {
					b.atext += c.mail.atext + "\n";
				}
			} else { // no attachment
				b.status = 5;
				b = null;
			}
		});

		_mm.node.to_name.disabled = true;
		_mm.node.subject.disabled = true;
		_mm.node.body.disabled = true;
		if(_mm.node.item_field) {
			_mm.node.item_field.disabled = true;
			_mm.node.equip_field.disabled = true;
			_mm.node.credits_field.disabled = true;
		}
		_mm.log("\n========== SENDING ==========");
	}

	b = s.batch[s.index];
	// status : 1=attaching 2=attached 3=setting cod 4=done 5=no attachment 6=no cod 7=sending 8=done
	if(!b.status) { // attach
		b.status = 1;
		_mm.log("#"+(s.index+1)+": PREPARE");
		b.forEach(function(c){
			$ajax.send("POST","/?s=Bazaar&ss=mm&filter=new","mmtoken="+_mm.mmtoken+"&action=attach_add&select_item="+(c.info.eid||c.info.iid||"0")+"&select_count="+(c.mail.count||"1")+"&select_pane="+c.mail.pane,function(r){
				if(_mm.check(r.responseText)) {
					return;
				}
				b.count++;
				_mm.log("#"+(s.index+1)+": ATTACH ["+b.count+"/"+b.length+"]");
				if(b.count === b.length) {
					b.status = 2;
					_mm.send();
				}
			});
		});

	} else if(b.status === 2) {
		if(b.cod) { // cod
			b.status = 3;
			_mm.log("#"+(s.index+1)+": SET COD");
			$ajax.send("POST","/?s=Bazaar&ss=mm&filter=new","mmtoken="+_mm.mmtoken+"&action=attach_cod&action_value="+b.cod,function(r){
				if(_mm.check(r.responseText)) {
					return;
				}
				b.status = 4;
				_mm.send();
			});

		} else { // no cod
			b.status = 6;
			_mm.send();
		}

	} else if(b.status === 4 || b.status === 5 || b.status === 6) { // send
		b.status = 7;
		_mm.log("#"+(s.index+1)+": SEND");

		var to_name = b.to_name,
			subject = b.subject || !b.count&&"(no subject)" || (b[0].mail.count?b[0].mail.count.toLocaleString()+" x ":"")+b[0].info.name+(b.count>1?" and "+(b.count-1)+" item"+(b.count>2?"s":""):""),
			body = b.body + (b.atext?"\n\n========== Attachment ==========\n\n"+b.atext+(b.cod&&b.count>1?"\nTotal CoD: "+b.cod.toLocaleString()+" Credits\n":""):"");

		$ajax.send("POST","/?s=Bazaar&ss=mm&filter=new","mmtoken="+_mm.mmtoken+"&action=send&message_to_name="+encodeURIComponent(to_name)+"&message_subject="+encodeURIComponent(subject)+"&message_body="+encodeURIComponent(body),function(r){
			if(_mm.check(r.responseText)) {
				b.status = -1;
				return;
			}
			b.status = 8;
			_mm.log("#"+(s.index+1)+": COMPLETED");
			s.index++;
			if(s.batch[s.index]) {
				_mm.send();
			} else {
				_mm.log("REDIRECTING...");
				location.href = "/?s=Bazaar&ss=mm&filter=sent";
			}
		});
	}
};

_mm.pack = function(e) {
	var queue;
	if(e && e.mail) {
		e.mail.atext = _mm.atext(e);
		queue = [e];
	} else if(Array.isArray(e)) {
		queue = e;
	} else {
		queue = [].concat( _mm.equip_selected, _mm.item_selected, _mm.credits_selected ).filter(e=>e);
	}

	if( queue.some(e=>e.mail.pane==="equip"&&e.node.div&&e.node.div.dataset.locked==1) ) {
		alert("Some equipment are locked.");
		return;
	}

	if(!queue.length) { // no attachment
		queue.push({mail:{pane:null}});
	}

	_mm.send(queue);
};

_mm.check = function(html) {
	var error;
	if(html.includes('<div id="messagebox"')) {
		error = substring(html,'<div id="messagebox"','<div id="mainpane">',true).firstElementChild.lastElementChild.textContent.trim();
		_mm.send.error = error;
		_mm.log("!!! ERROR: "+error);
		$ajax.send("POST","/?s=Bazaar&ss=mm&filter=new","mmtoken="+_mm.mmtoken+"&action=discard&action_value=0");
	}
	return error;
};

_mm.atext = function(item) {
	if(item.mail.pane === "equip") {
		return "["+item.info.eid+"] " + item.info.name + (item.mail.cod?" @ "+item.mail.cod.toLocaleString()+"c":"");
	} else {
		return item.mail.count.toLocaleString() + " x " + item.info.name + (item.mail.cod?" @ "+item.mail.price.toLocaleString()+"c = "+item.mail.cod.toLocaleString()+"c":"");
	}
};


// MM WRITE
if(settings.moogleMailSender && _query.filter === "new" && _query.hvut !== "disabled") {

if($id("mmail_attachremove")) {
	alert("Remove attached items.");
	location.href = location.href + "&hvut=disabled";
	return;
}

_mm.log = function(text,clear) {
	if(clear) {
		_mm.node.log.value = "";
	}
	_mm.node.log.value += text+"\n";
	_mm.node.log.scrollTop = _mm.node.log.scrollHeight;
};

_mm.calc = function() {
	var queue = [].concat( _mm.equip_selected, _mm.item_selected, _mm.credits_selected ),
		atext="", cod=0;
	queue.forEach(function(e){
		atext += e.mail.atext + "\n";
		cod += e.mail.cod;
	});
	atext += (cod&&queue.length>1?"\nTotal: "+cod.toLocaleString()+" Credits":"");
	_mm.log(atext,true);
};

_mm.search = function(pane,value,set) {
	value = value.trim();
	var preset;
	if(/^\[(.+)\]$/.test(value)) {
		preset = RegExp.$1;
	} else {
		value = value.toLowerCase().replace(/\s+/g," ");
	}

	if(value === _mm.search.value) {
		return;
	}
	_mm.search.value = value;
	if(set) {
		_mm.node[pane+"_search"].value = value;
	}

	if(pane==="item" && preset) {
		if(!settings.itemPrice.hasOwnProperty(preset)) {
			return;
		}
		var prices = $prices.get(preset);
		_mm[pane].forEach(function(e){
			if(prices.hasOwnProperty(e.info.name)) {
				_mm[pane+"_set"](e,e.mail.count,prices[e.info.name]);
				e.node.wrapper.classList.remove("hvut-none");
			} else if(!e.node.check.checked) {
				e.node.wrapper.classList.add("hvut-none");
			}
		});
		_mm[pane+"_calc"]();

	} else if(value) {
		value = value.split(" ").map(e=>(e.charAt(0)==="-")?{s:e.substr(1),m:false}:{s:e,m:true});
		_mm[pane].forEach(function(e){
			var lowercase = e.info.name.toLowerCase();
			if( value.every(v=>!v.s||lowercase.includes(v.s)===v.m||e.info.eid&&e.info.eid.toString().includes(v.s)===v.m) ) {
				e.node.wrapper.classList.remove("hvut-none");
			} else if(!e.node.check.checked) {
				e.node.wrapper.classList.add("hvut-none");
			}
		});

	} else {
		_mm[pane].forEach(function(e){
			e.node.wrapper.classList.remove("hvut-none");
		});
	}

	if(pane === "equip") {
		let h5,h4;
		Array.from(_mm.node.equip_list.children).forEach(function(n){
			if(n.nodeName === "DIV") {
				if(!n.classList.contains("hvut-none")) {
					h5 = false;
					h4 = false;
				}
			} else if(n.nodeName === "H5") {
				n.classList.remove("hvut-none");
				if(h5) {
					h5.classList.add("hvut-none");
				}
				h5 = n;
			} else if(n.nodeName === "H4") {
				n.classList.remove("hvut-none");
				if(h4) {
					h4.classList.add("hvut-none");
				}
				h4 = n;
			}
		});
		if(h5) {
			h5.classList.add("hvut-none");
		}
		if(h4) {
			h4.classList.add("hvut-none");
		}
	}
};

_mm.parse = function(type) {
	var text = _mm.node.body.value.split("\n"),
		textdata = {};
	text.forEach(function(t){
		var exec,name,lowercase,count,price,unit,cod;
		if( (exec=/([A-Za-z0-9\-' ]+)(?:\s*@\s*([0-9,.]+)([ckm])?)?(?:\s+[x*\uff0a]?\s*[\[(]?([0-9,]+)[\])]?)/i.exec(t)) ) {
			name = exec[1];
			count = exec[4];
			price = exec[2];
			unit = exec[3];
		} else if( (exec=/(?:[\[(]?([0-9,]+)[\])]?\s*[x*\uff0a]?\s*)([A-Za-z0-9\-' ]+)(?:\s*@\s*([0-9,.]+)([ckm])?)?/i.exec(t)) ) {
			name = exec[2];
			count = exec[1];
			price = exec[3];
			unit = exec[4];
		} else {
			return;
		}

		name = name.trim();
		lowercase = name.toLowerCase().replace(/[^A-Za-z0-9]/g,"");
		count = parseInt(count.replace(/,/g,""));
		if(price) {
			unit = (unit||"").toLowerCase();
			price = price.replace(/,/g,"") * (unit==="k"?1000:unit==="m"?1000000:1);
			cod = Math.ceil(count*price);
		} else {
			price = 0;
		}
		textdata[lowercase] = {info:{name:name},mail:{pane:"item",count:count,price:price,cod:cod}};
	});

	if(type) {
		_mm.item.forEach(function(it){
			var lowercase = it.info.lowercase;
			if(textdata.hasOwnProperty(lowercase)) {
				_mm.item_set(it,textdata[lowercase].mail.count,type===2?textdata[lowercase].mail.price:0);
				it.node.check.checked = true;
				it.node.wrapper.classList.remove("hvut-none");
				delete textdata[lowercase];
			} else {
				it.node.check.checked = false;
				it.node.wrapper.classList.add("hvut-none");
			}
		});
		_mm.search.value = "\n";
		_mm.item_calc();

	} else {
		var attach = "",
			lowercase,
			count = 0,
			cod = 0;
		for(lowercase in textdata) {
			attach += _mm.atext(textdata[lowercase]) + "\n";
			count++;
			cod += textdata[lowercase].mail.cod || 0;
		}
		_mm.log(attach+(cod&&count>1?"\nTotal: "+cod.toLocaleString()+" Credits":""),true);
	}
};

_mm.toggle = function(type) {
	if(type === _mm.toggle.current) {
		return;
	}
	_mm.node[_mm.toggle.current+"_div"].classList.add("hvut-none");
	_mm.toggle.current = type;
	_mm.node[_mm.toggle.current+"_div"].classList.remove("hvut-none");
};
_mm.toggle.current = "item";


_mm.max = 10;
_mm.form = $id("mailform");
_mm.mmtoken = _mm.form.elements.mmtoken.value;


GM_addStyle(`
	#mailform, #mmail_left, #mmail_right {display:none}
	#mmail_outer {text-align:left}

	#hvut-mm-left {float:left; margin-left:20px; width:600px; height:600px; padding-top:20px}
	#hvut-mm-right {float:right; margin-right:20px; width:550px; height:620px; font-size:10pt}

	#hvut-mm-left span {clear:left; float:left; margin:2px; padding:2px; width:60px; font-size:10pt; line-height:17px; text-align:right}
	#hvut-mm-left input[type=text] {float:left; margin:2px; padding:2px; width:450px; font-size:10pt; line-height:17px; font-weight:bold}
	#hvut-mm-left textarea {font-size:10pt}
	.hvut-mm-left-menu {float:right; width:80px}
	.hvut-mm-left-menu > input {width:100%}
	.hvut-mm-toggle > input:nth-child(n+2) {display:none}

	.hvut-mm-right-menu {margin:5px 0; padding:10px 0; border-bottom:3px double; text-align:center}
	.hvut-mm-right-menu > input {margin:0 15px; padding:2px 10px; font-weight:bold}

	.hvut-mm-field {margin:0; padding:0; border:none; height:490px; overflow-y:scroll}
	.hvut-mm-field input:invalid {color:#f30}

	.hvut-mm-attach-menu {margin:5px 0; white-space:nowrap; line-height:30px}
	.hvut-mm-attach-menu input {margin-top:0; font-size:10pt; font-weight:normal; vertical-align:middle}
	.hvut-mm-attach-menu > span {margin:0 10px; padding:2px 5px; border:1px solid; cursor:pointer}

	#hvut-mm-item .itemlist {width:100%}
	#hvut-mm-item .itemlist td:nth-child(1) {width:170px !important}
	#hvut-mm-item .itemlist td:nth-child(2) {width:70px}
	#hvut-mm-item .itemlist td:nth-child(3) {width:auto}

	#hvut-mm-right .hvut-mm-sub > input {font-weight:normal}
	#hvut-mm-right .hvut-mm-check {width:auto}
	#hvut-mm-right .hvut-mm-count {width:50px; text-align:right}
	#hvut-mm-right .hvut-mm-price {width:50px; text-align:right}
	#hvut-mm-right .hvut-mm-cod {width:80px; text-align:right}
	#hvut-mm-right .hvut-mm-send {width:50px}

	.eqp {width:auto}
	.eqp > div:last-child {max-width:340px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
	.equiplist .hvut-mm-sub {position:absolute; right:0; margin:0 !important; z-index:1}
	.hvut-mm-eid {display:none; position:absolute; right:155px; padding:0 3px; border:1px solid; line-height:20px; background-color:#fff}
	.equiplist > div:hover .hvut-mm-eid {display:block}

	#hvut-mm-credits > fieldset > div {margin:20px}
	#hvut-mm-credits > fieldset > div > span {display:inline-block; margin-right:10px; font-weight:bold; text-align:right}
`);

_mm.node.frag = $element();

_mm.node.left = $element("div",_mm.node.frag,["#hvut-mm-left"]);

$element("input",_mm.node.left,{type:"button",value:"SEND",tabIndex:4,style:"float:right;margin:2px;padding:2px 10px;width:60px;height:50px;font-weight:bold"},_mm.pack);
$element("span",_mm.node.left,"To:");
_mm.node.to_name = $element("input",_mm.node.left,{type:"text",value:_mm.form.message_to_name.value||"",tabIndex:1});
$element("span",_mm.node.left,"Subject:");
_mm.node.subject = $element("input",_mm.node.left,{type:"text",value:_mm.form.message_subject.value||"",tabIndex:1});

_mm.node.template = $element("div",_mm.node.left,["!float:left;clear:left;margin-top:5px;padding-left:70px"]);
for(let i in settings.moogleMailTemplate) {
	$element("input",_mm.node.template,{type:"button",value:i,style:"margin-right:10px"},function(){var t=settings.moogleMailTemplate[i];if(t.to){_mm.node.to_name.value=t.to;}if(t.subject){_mm.node.subject.value=t.subject;}if(t.body){_mm.node.body.value=t.body;}if(t.attach){_mm.parse(2);}});
}

_mm.node.body = $element("textarea",_mm.node.left,{value:_mm.form.message_body.value||"",tabIndex:3,spellcheck:false,style:"clear:left;float:left;width:592px;height:250px;margin:10px 0"});
_mm.node.log = $element("textarea",_mm.node.left,{readOnly:true,spellcheck:false,style:"clear:left;float:left;width:500px;height:220px;margin:0"});

_mm.node.left_menu = $element("div",_mm.node.left,[".hvut-mm-left-menu hvut-mm-toggle"]);
$element("input",_mm.node.left_menu,{type:"button",value:"ATTACH from TEXT",style:"white-space:normal"},function(){_mm.node.left_menu.classList.toggle("hvut-mm-toggle");});
$element("input",_mm.node.left_menu,{type:"button",value:"available format",style:"white-space:normal"},function(){popup_text("100x Health Potion @10\n(200) Mana Potion @90\nSpirit Potion @90 x300\nVibrant Catalyst @4.5k (100)","width:300px;white-space:pre");});
$element("input",_mm.node.left_menu,{type:"button",value:"CALC"},function(){_mm.parse();});
$element("input",_mm.node.left_menu,{type:"button",value:"ATTACH"},function(){_mm.parse(1);});
$element("input",_mm.node.left_menu,{type:"button",value:"COD"},function(){_mm.parse(2);});
$element("input",_mm.node.left_menu,{type:"button",value:"RESET"},function(){_mm.search("item","",true);});

_mm.node.right = $element("div",_mm.node.frag,["#hvut-mm-right"]);
_mm.node.right_menu = $element("div",_mm.node.right,[".hvut-mm-right-menu"]);
$element("input",_mm.node.right_menu,{type:"button",value:"Item"},function(){_mm.toggle("item");});
$element("input",_mm.node.right_menu,{type:"button",value:"Equipment"},function(){_mm.toggle("equip");});
$element("input",_mm.node.right_menu,{type:"button",value:"Credits / Hath"},function(){_mm.toggle("credits");});
$element("input",_mm.node.right_menu,{type:"button",value:"Default",style:"margin-left:100px"},function(){location.href=location.href+"&hvut=disabled";});

_mm.node.item_div = $element("div",_mm.node.right,["#hvut-mm-item"]);
_mm.node.equip_div = $element("div",_mm.node.right,["#hvut-mm-equip",".hvut-none"]);
_mm.node.credits_div = $element("div",_mm.node.right,["#hvut-mm-credits",".hvut-none"]);


// MM item
_mm.item_change = function(e) {
	if(e && e.target && e.target.item) {
		var it = e.target.item,
			count = Number(it.node.count.validity.valid && it.node.count.value),
			price = Number(it.node.price.validity.valid && /(\d+)(\.\d+)?([km])?/.test(it.node.price.value.toLowerCase())) && ( parseFloat(RegExp.$1+(RegExp.$2||"")) * (({k:1000,m:1000000})[RegExp.$3]||1) );
		it.mail.count = count;
		it.mail.price = price;
		it.mail.cod = Math.ceil(count*price);
		it.node.cod.value = it.mail.cod || "";
	}
	_mm.item_calc();
};
_mm.item_calc = function() {
	_mm.item_selected.length = 0;
	_mm.item.forEach(function(it){
		if(it.node.check.checked && it.mail.count) {
			it.mail.atext = _mm.atext(it);
			_mm.item_selected.push(it);
		}
	});
	_mm.calc();
};
_mm.item_set = function(it,count,price) {
	count = parseInt(count);
	price = parseFloat(price);
	if(!isNaN(count)) {
		it.mail.count = Math.min(it.data.stock, Math.max(count,0));
		it.node.count.value = it.mail.count || "";
		it.node.count.style.color = it.mail.count>=it.data.stock?"#f30":"";
	}
	if(!isNaN(price)) {
		it.mail.price = Math.max(price,0);
		it.node.price.value = it.mail.price || "";
	}
	it.mail.cod = Math.ceil(it.mail.count*it.mail.price);
	it.node.cod.value = it.mail.cod || "";
};
_mm.item_count = function(num,type) {
	num = parseInt(num);
	if(!Number.isInteger(num)) {
		return;
	}
	_mm.item.forEach(function(it){
		if(it.node.check.checked) {
			_mm.item_set(it, type==="all"?it.data.stock:type==="add"?(it.mail.count+num):num);
		}
	});
	_mm.item_calc();
};
_mm.item_all = function() {
	var checked = this.checked;
	_mm.item.forEach(function(it){
		if(!it.node.wrapper.classList.contains("hvut-none")) {
			it.node.check.checked = checked;
		}
	});
	_mm.item_calc();
};

_mm.node.item_menu = $element("div",_mm.node.item_div,[".hvut-mm-attach-menu"]);
_mm.node.item_search = $element("input",_mm.node.item_menu,{type:"text",placeholder:"search",style:"width:180px"},{keyup:function(e){if(e.keyCode===27){_mm.search("item","",true);}else{_mm.search("item",this.value);}}});
$element("input",_mm.node.item_menu,{type:"button",value:"Clear"},function(){_mm.search("item","",true);});
$element("input",_mm.node.item_menu,{type:"checkbox",style:"margin-left:20px;margin-right:20px"},_mm.item_all);
$element("input",_mm.node.item_menu,{type:"text",placeholder:"count",style:"width:50px;text-align:right"},{keyup:function(){_mm.item_count(this.value);}});
$element("input",_mm.node.item_menu,{type:"button",value:"All"},function(){_mm.item_count(0,"all");});
$element("input",_mm.node.item_menu,{type:"button",value:"0"},function(){_mm.item_count(0);});
$element("input",_mm.node.item_menu,{type:"button",value:"+1k"},function(){_mm.item_count(1000,"add");});
$element("input",_mm.node.item_menu,{type:"button",value:"+10k"},function(){_mm.item_count(10000,"add");});
$element("br",_mm.node.item_menu);

Object.keys(settings.itemPrice).forEach(function(p){
	if(["WTB","Salvage","Upgrade"].includes(p)) {
		return;
	}
	$element("input",_mm.node.item_menu,{type:"button",value:p,style:"margin-right:10px"},function(){_mm.search("item","["+p+"]",true);});
});

_mm.node.item_list = $qs(".itemlist");
_mm.node.item_field = $element("fieldset",null,["#item",".hvut-mm-field"],{change:_mm.item_change});
_mm.node.item_field.appendChild(_mm.node.item_list);

_mm.item = Array.from(_mm.node.item_list.rows).map(function(tr){
	var td = tr.cells[0].firstElementChild,
		name = td.textContent,
		lowercase = name.toLowerCase().replace(/[^A-Za-z0-9]/g,""),
		iid = /mooglemail\.set_mooglemail_item\((\d+),this\)/.test(td.getAttribute("onclick")) && RegExp.$1,
		type = /'([^']+)'\)/.test(td.getAttribute("onmouseover")) && RegExp.$1.replace(/\W/g,"_") || "Consumable";
	return ({info:{name:name,lowercase:lowercase,iid:iid,type:type},data:{stock:parseInt(tr.cells[1].textContent)},node:{wrapper:tr}});
});
_mm.item.forEach(function(it){
	it.mail = {pane:"item",count:0,price:0,cod:0};
	it.node.wrapper.classList.add("hvut-it-"+it.info.type);
	it.node.td = $element("td",null,[".hvut-mm-sub"]);
	it.node.check = $element("input",it.node.td,{type:"checkbox",className:"hvut-mm-check"});
	it.node.check.item = it;
	it.node.count = $element("input",it.node.td,{className:"hvut-mm-count",placeholder:"count",pattern:"\\d+",max:it.data.stock});
	it.node.count.item = it;
	it.node.price = $element("input",it.node.td,{className:"hvut-mm-price",placeholder:"price",pattern:"\\d+(\\.\\d+)?[KMkm]?"});
	it.node.price.item = it;
	it.node.cod = $element("input",it.node.td,{className:"hvut-mm-cod",placeholder:"cod",readOnly:true});
	it.node.send = $element("input",it.node.td,{type:"button",value:"send",className:"hvut-mm-send"},function(){_mm.pack(it);});
	it.node.wrapper.appendChild(it.node.td);
});
_mm.item_selected = [];

_mm.node.item_div.appendChild(_mm.node.item_field);


// MM equip
_mm.equip_change = function(e) {
	if(e && e.target && e.target.equip) {
		var eq = e.target.equip,
			cod = Number(eq.node.cod.validity.valid && /(\d+)(\.\d+)?([km])?/.test(eq.node.cod.value.toLowerCase())) && ( parseFloat(RegExp.$1+(RegExp.$2||"")) * (({k:1000,m:1000000})[RegExp.$3]||1) );
		eq.mail.cod = Math.ceil(cod);
	}
	_mm.equip_calc();
};
_mm.equip_calc = function() {
	_mm.equip_selected.length = 0;
	_mm.equip.forEach(function(eq){
		if(eq.node.check.checked) {
			eq.mail.atext = _mm.atext(eq);
			_mm.equip_selected.push(eq);
		}
	});
	_mm.calc();
};
_mm.equip_all = function() {
	var checked = this.checked;
	_mm.equip.forEach(function(eq){
		if(!eq.node.wrapper.classList.contains("hvut-none")) {
			eq.node.check.checked = checked;
		}
	});
	_mm.equip_calc();
};

_mm.node.equip_menu = $element("div",_mm.node.equip_div,[".hvut-mm-attach-menu"]);
_mm.node.equip_search = $element("input",_mm.node.equip_menu,{type:"text",placeholder:"search",style:"width:400px"},{keyup:function(e){if(e.keyCode===27){_mm.search("equip","",true);}else{_mm.search("equip",this.value);}}});
$element("input",_mm.node.equip_menu,{type:"button",value:"Reset"},function(){_mm.search("equip","",true);});
$element("input",_mm.node.equip_menu,{type:"checkbox",style:"margin-right:20px"},_mm.equip_all);
$element("br",_mm.node.equip_menu);

_mm.node.equip_list = $qs(".equiplist");
_mm.node.equip_field = $element("fieldset",null,["#equip",".hvut-mm-field"],{change:_mm.equip_change});
_mm.node.equip_field.appendChild(_mm.node.equip_list);

_mm.equip_json = getValue("in_json",{});
_mm.equip = $equip.list(_mm.node.equip_list,2);
_mm.equip.forEach(function(eq){
	eq.mail = {pane:"equip",cod:0};
	eq.node.div.removeAttribute("onclick");
	eq.node.sub = $element("div",null,[".hvut-mm-sub"]);
	eq.node.eid = $element("span",eq.node.sub,[" "+eq.info.eid,".hvut-mm-eid"]);
	eq.node.check = $element("input",eq.node.sub,{type:"checkbox",className:"hvut-mm-check"});
	eq.node.check.equip = eq;
	eq.node.cod = $element("input",eq.node.sub,{className:"hvut-mm-cod",placeholder:"cod",pattern:"\\d+(\\.\\d+)?[KMkm]?"});
	eq.node.cod.equip = eq;
	eq.node.send = $element("input",eq.node.sub,{type:"button",value:"send",className:"hvut-mm-send"},function(){_mm.pack(eq);});

	var json = _mm.equip_json[eq.info.eid];
	if(json && /^(\d+)(\.\d+)?([km])?$/.test(json.price.toLowerCase())) {
		eq.node.cod.value = json.price;
		eq.mail.cod = parseFloat(RegExp.$1+(RegExp.$2||"")) * (({k:1000,m:1000000})[RegExp.$3]||1);
	}
	eq.node.wrapper.insertBefore(eq.node.sub,eq.node.wrapper.firstChild);
});
_mm.equip_selected = [];

_mm.node.equip_div.appendChild(_mm.node.equip_field);

$qsa(".equiplist > h4").forEach(function(h4){
	$element("span",_mm.node.equip_menu,h4.textContent.split(" ")[0],function(){scrollIntoView(h4,_mm.node.equip_field);});
});


// MM credits
_mm.credits_calc = function() {
	_mm.credits_selected.length = 0;

	var credits,
		c_check = _mm.node.credits_check.checked,
		c_count = parseFloat(_mm.node.credits_count.value||0);

	if(c_check && Number.isInteger(c_count) && c_count>0) {
		if(c_count > _mm.credits_funds) {
			_mm.node.credits_count.style.color = "#f30";
		} else {
			_mm.node.credits_count.style.color = "";
			credits = {mail:{pane:"credits",count:c_count,cod:0},info:{name:"Credits"}};
			credits.mail.atext = _mm.atext(credits);
			_mm.credits_selected.push(credits);
		}
	}

	var hath,
		h_check = _mm.node.hath_check.checked,
		h_count = parseFloat(_mm.node.hath_count.value||0),
		h_price = parseFloat(_mm.node.hath_price.value||0),
		h_cod;

	if(h_check && Number.isInteger(h_count) && h_count>0 && !isNaN(h_price)) {
		if(h_count > _mm.hath_funds) {
			_mm.node.hath_count.style.color = "#f30";
		} else {
			_mm.node.hath_count.style.color = "";
			h_cod = Math.ceil(h_count * h_price);
			_mm.node.hath_cod.value = h_cod || "";

			hath = {mail:{pane:"hath",count:h_count,price:h_price,cod:h_cod},info:{name:"Hath"}};
			hath.mail.atext = _mm.atext(hath);
			_mm.credits_selected.push(hath);
		}
	}

	_mm.calc();
};

_mm.credits_funds = /Current Funds: ([0-9,]+) Credits/.test($id("mmail_attachcredits").textContent) && parseInt(RegExp.$1.replace(/,/g,""));
_mm.hath_funds = /Current Funds: ([0-9,]+) Hath/.test($id("mmail_attachhath").textContent) && parseInt(RegExp.$1.replace(/,/g,""));


_mm.node.credits_field = $element("fieldset",_mm.node.credits_div,["!border:none"],{change:_mm.credits_calc});

_mm.node.credits_sub = $element("div",_mm.node.credits_field);
$element("span",_mm.node.credits_sub,[" Credits","!width:75px"]);
$element("span",_mm.node.credits_sub,[" "+_mm.credits_funds.toLocaleString(),"!width:100px"]);
_mm.node.credits_check = $element("input",_mm.node.credits_sub,{type:"checkbox"});
_mm.node.credits_count = $element("input",_mm.node.credits_sub,{placeholder:"count",className:"hvut-mm-count",style:"width:75px"});

_mm.node.hath_sub = $element("div",_mm.node.credits_field);
$element("span",_mm.node.hath_sub,[" Hath","!width:75px"]);
$element("span",_mm.node.hath_sub,[" "+_mm.hath_funds.toLocaleString(),"!width:100px"]);
_mm.node.hath_check = $element("input",_mm.node.hath_sub,{type:"checkbox"});
_mm.node.hath_count = $element("input",_mm.node.hath_sub,{placeholder:"count",className:"hvut-mm-count",style:"width:75px"});
_mm.node.hath_price = $element("input",_mm.node.hath_sub,{placeholder:"price",className:"hvut-mm-price",style:"width:50px"});
_mm.node.hath_cod = $element("input",_mm.node.hath_sub,{placeholder:"cod",className:"hvut-mm-cod",style:"width:100px",readOnly:true});

_mm.credits_selected = [];


_mm.multi_send = function() {
	var reg = /^([^;]+);([0-9,.]+)([ckmh])(;[^;]*)?(;.*)?$/i,
		exec,
		queue = [],
		error = [];

	_mm.node.multi_text.value.split("\n").forEach(function(t,i){
		if(!t) {
			return;
		}
		if( (exec=reg.exec(t)) ) {
			var c = parseFloat(exec[2].replace(/,/g,"")),
				u = exec[3].toLowerCase();
			if(c) {
				var d = {mail:{pane:u==="h"?"hath":"credits",count:c*(u==="k"?1000:u==="m"?1000000:1),price:0,cod:0,to_name:exec[1],subject:exec[4]?exec[4].substr(1):"",body:exec[5]?exec[5].substr(1).replace(/\|/g,"\n"):""},info:{name:u==="h"?"Hath":"Credits"}};
				d.mail.atext = _mm.atext(d);
				queue.push(d);
			} else {
				error.push("line#"+(i+1)+" is invalid: " + t);
			}
		} else {
			error.push("line#"+(i+1)+" is invalid: " + t);
		}
	});
	if(error.length) {
		popup(error.join("<br />"));
		return;
	}
	if(!_mm.node.to_name.value) {
		_mm.node.to_name.value = " ";
	}

	_mm.send(queue);
};

_mm.node.multi_sub = $element("div",_mm.node.credits_div,["!margin-top:75px;text-align:center"]);

$element("input",_mm.node.multi_sub,{type:"button",value:"Multi-Send",style:"width:150px;text-align:center;font-weight:bold"},_mm.multi_send);
$element("br",_mm.node.multi_sub);
_mm.node.multi_text = $element("textarea",_mm.node.multi_sub,{readOnly:true,spellcheck:false,value:"/* user;credits;subject;text(|=new line)\nex)\nsssss2;10m\nsssss3;500k;WTB;hi|I want to buy...\nTenboro;500c\nMoogleMail;1000h;Thanks\n*/",style:"width:86%;height:300px;padding:1% 2%;font-size:12pt;line-height:1.5em"},function(){if(this.readOnly){this.readOnly=false;this.value="";}});


// insert nodes
$id("mmail_outer").insertBefore(_mm.node.frag,$id("mailform"));
_mm.node.to_name.focus();


// MM LIST
} else if(settings.moogleMailBox && $id("mmail_list")) {

_mm.filter = _query.filter || "inbox";
_mm.page = parseInt(_query.page) || 0;
_mm.page_new = _mm.page;
_mm.page_old = _mm.page;

_mm.data = {};
_mm.table = {};

_mm.db = {};
_mm.db.version = 1;

_mm.db.open = function(callback) {
	var request = indexedDB.open("hvut",_mm.db.version);
	request.onsuccess = function(e){
		_mm.db.obj = e.target.result;
		if(callback) {
			callback();
		}
	};
	request.onupgradeneeded = function(e){
		var db = e.target.result;
		if(!db.objectStoreNames.contains("mm")) {
			db.createObjectStore("mm", {keyPath:"mid"});
		}
	};
	request.onerror = function(e){
		console.log("open db: error",e);
	};
};

_mm.db.conn = function(mode,oncomplete) {
	var transaction = _mm.db.obj.transaction("mm",mode||"readonly");
	if(oncomplete) {
		transaction.oncomplete = oncomplete;
	}
	transaction.onerror = function(e){
		console.log("transaction: error",e);
	};
	return transaction.objectStore("mm");
};


_mm.load_page = function(p) {
	if(p==="new"&&_mm.page_new===false || p==="old"&&_mm.page_old===false) {
		return;
	}
	var page = p==="new"?_mm.page_new-1 : p==="old"?_mm.page_old+1 : p;
	if(_mm.table[page]) {
		return;
	}

	var table = _mm.table[page] = $element("table",[$id("mmail_outerlist"),_mm.table[page+1]],[".hvut-mm-list"]);
	$element("td",$element("tr",table),"Loading "+page+" Page");
	scrollIntoView(table);

	$ajax.send("GET","/?s=Bazaar&ss=mm&filter="+_mm.filter+"&page="+page,null,function(r){
		var frag = substring(r.responseText,'<table id="mmail_list">',["</table>",true],true);
		_mm.kill_asshole(frag);
		_mm.create_page(frag.firstElementChild,page);
		scrollIntoView(table);
	});
};

_mm.create_page = function(frag,page) {
	var table = _mm.table[page],
		tbody = $element("tbody"),
		tr = $element("tr",tbody);
	$element("td",tr,({"read":"From","sent":"To"})[_mm.filter]||"Inbox");
	$element("td",tr,page+" Page");
	$element("td",tr,"Attached");
	$element("td",tr,"CoD");
	$element("td",tr,"Sent");
	$element("td",tr,"Read");

	var conn = _mm.db.conn(),
		loaded = frag.rows.length-1;
	Array.from(frag.rows).forEach(function(row,i){
		if(!i) {
			return;
		} else if(row.cells[0].id === "mmail_nnm") {
			$element("td",$element("tr",tbody),{textContent:"No New Mail",colSpan:6});
			return;
		}
		var mid = /mid=(\d+)/.test(row.getAttribute("onclick")) && parseInt(RegExp.$1),
			user = row.cells[0].textContent,
			subject = row.cells[1].textContent,
			sent = Date.parse(row.cells[2].textContent+":00.000Z")/1000,
			read = row.cells[3].textContent;
		read = read==="Never"?null : Date.parse(read+":00.000Z")/1000;

		if(!_mm.data[mid]) {
			_mm.data[mid] = {};
		}
		var data = _mm.data[mid];
		if(data.page) {
			return;
		}
		data.page = {mid:mid,filter:_mm.filter,user:user,returned:user==="MoogleMail",subject:subject,sent:sent,read:read,tr:$element("tr",tbody)};

		$element("td",data.page.tr,mid); // user
		$element("a",$element("td",data.page.tr),{href:"/?s=Bazaar&ss=mm&filter="+_mm.filter+"&mid="+mid+"&page="+page},function(e){e.preventDefault();_mm.load_mail(mid,true);});
		$element("td",data.page.tr); // attach
		$element("td",data.page.tr); // cod
		$element("td",data.page.tr); // sent
		$element("td",data.page.tr); // read

		conn.get(mid).onsuccess = function(e) {
			data.db = e.target.result || null;
			if(!data.db || data.db.filter!==_mm.filter || !data.page.returned&&data.db.user.indexOf(data.page.user)!==0 || data.db.sent!==data.page.sent || data.db.read!==data.page.read) {
				if(_mm.filter !== "inbox") {
					_mm.load_mail(mid);
				}
			}
			_mm.modify_mail(mid);
			if(!--loaded) {
				scrollIntoView(table);
			}
		};
	});
	table.innerHTML = "";
	table.appendChild(tbody);

	if(page < _mm.page_new) {
		_mm.page_new = page;
	}
	if(page > _mm.page_old) {
		_mm.page_old = page;
	}
	if(page <= 0) {
		_mm.page_new = false;
		_mm.node.page_new.disabled = true;
	}
	if(frag.rows.length < 21) {
		_mm.page_old = false;
		_mm.node.page_old.disabled = true;
	}
};

_mm.load_mail = function(mid,view,post,callback) {
	var data = _mm.data[mid];
	if(view) {
		if(!_mm.view_mail.div) {
			_mm.view_mail.div = $element("div",null,["#hvut-mm-view"]);
		}
		if(_mm.current===mid && !post) {
			_mm.close_mail();
			return;
		}
		_mm.close_mail();
		_mm.current = mid;
		$element("div",_mm.view_mail.div,[" Loading...","!padding:20px;font-weight:bold;color:#c00"]);
		$id("mmail_outer").appendChild(_mm.view_mail.div);

		if(data.page) {
			data.page.tr.classList.add("hvut-mm-view");
		}
		if(data.search) {
			data.search.tr.classList.add("hvut-mm-view");
		}
	}

	$ajax.send("POST","/?s=Bazaar&ss=mm&mid="+mid,post,function(r){
		var html = r.responseText;

		if(html.includes('<div id="mmail_outer">')) {
			var content = substring(html,'<div id="mmail_outer">','<script type="text/javascript">\nvar send_cost',true),
				form = $id("mailform",content);

			var mail = data.mail = {
				mmtoken : form.elements.mmtoken.value,
				to : form.elements[3].value,
				from : form.elements[4].value,
				subject : form.elements[5].value,
				text : form.elements[6].value,
				attach : [],

				_return : $qs("#mmail_showbuttons > img[src*='returnmail.png']",content) ? true : false,
				_recall : $qs("#mmail_showbuttons > img[src*='recallmail.png']",content) ? true : false,
				_reply : $qs("#mmail_showbuttons > img[src*='reply.png']",content) ? true : false,
				_take : $qs("#mmail_attachremove > img[src*='attach_takeall.png']",content) ? true : false
			};

			if(mail.from === "MoogleMail") {
				mail.returned = /This message was returned from (.+), kupo!|This mail was sent to (.+), but was returned, kupo!/.test(mail.text.split("\n").reverse().join("\n")) && (RegExp.$1 || RegExp.$2);
			}
			if(mail._take) {
				mail.filter = "inbox";
				mail.user = mail.returned || mail.from;
			} else if(mail._reply) {
				mail.filter = "read";
				mail.user = mail.from;
			} else if(mail.from === "MoogleMail") {
				mail.filter = "read";
				mail.user = mail.returned;
			} else {
				mail.filter = "sent";
				mail.user = mail.to;
			}
			mail.read = mail.filter==="read" || mail.filter==="sent"&&!mail._recall;

			if($id("mmail_attachlist",content)) {
				var dynjs = JSON.parse( substring(html,["var dynjs_eqstore = ",true],";\n") ) || {};
				Object.assign($equip.dynjs_eqstore,dynjs);

				Array.from($id("mmail_attachlist",content).children).forEach(function(div){
					var sub = div.firstElementChild.firstElementChild,
						exec;
					if(sub && sub.hasAttribute("onmouseover") && (exec=/equips\.set\((\d+)/.exec(sub.getAttribute("onmouseover")))) {
						var eid = parseInt(exec[1]),
							key = dynjs[eid].k,
							name = dynjs[eid].t;
						mail.attach.push({t:"e",n:name,e:eid,k:key});

					} else if((exec=/^([0-9,]+)x? (.+)$/.exec(div.textContent))) {
						var count = parseInt(exec[1].replace(/,/g,"")),
							name = exec[2],
							type = name==="Hath"?"h":name==="Credits"?"c":"i";
						mail.attach.push({t:type,n:name,c:count});
					} else {
						console.log(div.textContent.trim());
					}
				});

				if($id("mmail_currentcod",content)) {
					mail.cod = /Requested Payment on Delivery: ([0-9,]+) credits/.test($id("mmail_currentcod",content).textContent) && parseInt(RegExp.$1.replace(/,/g,""));
				}

			} else {
				var split = mail.text.split("\n\n").reverse(),
					attach;

				attach = split[0].split("\n").every(function(e){
					var exec = /^Removed attachment: (?:([0-9,]+)x? (.+)|(.+))$/.exec(e);
					if(!exec) {
						return false;
					}
					if(exec[3]) {
						mail.attach.unshift({t:"e",n:exec[3]});
					} else {
						var count = parseInt(exec[1].replace(/,/g,"")),
							name = exec[2],
							type = name==="Hath"?"h":name==="Credits"?"c":"i";
						mail.attach.unshift({t:type,n:name,c:count});
					}
					return true;
				});
				if(attach) {
					mail.cod = /^CoD Paid: ([0-9,]+) Credits$/.test(split[1]) && parseInt(RegExp.$1.replace(/,/g,""));
				}

				// pre 0.85
				if( (attach=/^Attached item removed: (?:([0-9,]+)x? (.+)|(.+)) \(type=([chie]) id=(\d+), CoD was ([0-9]+)C\)$/.exec(split[0])) ) {
					var type = attach[4];
					if(type === "e") {
						mail.attach.push({t:type,n:attach[3],e:attach[5]});
					} else {
						mail.attach.push({t:type,n:attach[2],c:parseInt(attach[1].replace(/,/g,""))});
					}
					mail.cod = parseInt(attach[6].replace(/,/g,""));
				}
			}

			if(callback) {
				callback();
			}

		} else if(html.includes('<div id="messagebox"')) {
			var error = substring(html,'<div id="messagebox"','<div id="mainpane">',true).firstElementChild.lastElementChild.textContent.trim();
			data.mail = {error:error};

		} else {
			data.mail = {error:"ERROR"};
		}

		_mm.update_mail(mid,view);
	});
};

_mm.update_mail = function(mid,view) {
	var data = _mm.data[mid],
		mail = data.mail;

	if(data.db === undefined) {
		_mm.db.conn().get(mid).onsuccess = function(e) {
			data.db = e.target.result || null;
			_mm.update_mail(mid,view);
		};
		return;
	}

	if(data.db) {
		var db = data.db;
		if(mail.error) {
			if(db.error !== mail.error) {
				db.error = mail.error;
				_mm.db.conn("readwrite").put(db);
			}

		} else {
			var sent = data.page&&data.page.sent || db.sent,
				read = !mail.read?null : data.page&&data.page.read || db.read || -1;
			if(db.filter!==mail.filter || db.user!==mail.user || db.subject!==mail.subject || db.text!==mail.text || db.sent!==sent || db.read!==read || db.error) {
				db.filter = mail.filter;
				db.user = mail.user;
				db.subject = mail.subject;
				db.text = mail.text;
				db.sent = sent;
				db.read = read;
				if(mail.returned) {
					db.returned = 1;
					delete db.cod;
				}
				delete db.error;
				_mm.db.conn("readwrite").put(db);
			}
		}

	} else if(data.page && !mail.error) {
		data.db = {mid:mid,filter:mail.filter,user:mail.user,subject:mail.subject,text:mail.text,sent:data.page.sent,read:data.page.read};
		if(mail.returned) {
			data.db.returned = 1;
		}
		if(mail.attach.length) {
			data.db.attach = mail.attach;
		}
		if(mail.cod) {
			data.db.cod = mail.cod;
		}
		_mm.db.conn("readwrite").add(data.db);
	}

	_mm.modify_mail(mid);
	if(view) {
		_mm.view_mail(mid);
	}
};

_mm.modify_mail = function(mid,search) {
	var data = _mm.data[mid],
		tr,cells;

	if(data.page && !search) {
		tr = data.page.tr;
		cells = tr.cells;
		cells[0].textContent = (data.db||data.page).user;
		cells[1].firstChild.textContent = (data.db||data.page).subject;
		cells[2].innerHTML = "";
		cells[3].innerHTML = "";

		if(data.db && data.db.attach) {
			data.db.attach.forEach(function(e){
				var span = $element("span",cells[2],[".hvut-mm-attach-"+e.t]);
				if(e.t === "e") {
					if(e.e && e.k) {
						$element("a",span,{textContent:e.n,href:"/equip/"+e.e+"/"+e.k,target:"_blank"});
					} else {
						span.textContent = e.n;
					}
				} else {
					span.textContent = e.c.toLocaleString()+" x "+e.n;
				}
			});
			if(data.db.cod) {
				cells[3].textContent = data.db.cod.toLocaleString();
			}
		}
		cells[4].textContent = _mm.dts(data.page.sent);
		cells[5].textContent = data.page.read?_mm.dts(data.page.read):"";

		tr.classList[data.db?"remove":"add"]("hvut-mm-nodb");
		tr.classList[data.page.read?"remove":"add"]("hvut-mm-unread");
		tr.classList[(data.db||data.page).returned?"add":"remove"]("hvut-mm-returned");
		tr.classList[(data.db||data.page).filter!==_mm.filter?"add":"remove"]("hvut-mm-removed");
	}

	if(data.search) {
		tr = data.search.tr;
		cells = tr.cells;
		cells[0].innerHTML = "";
		$element("span",cells[0],({"inbox":"Inbox","read":"From","sent":"To"})[data.db.filter]);
		$element("",cells[0]," "+data.db.user);
		cells[1].firstChild.textContent = data.db.subject;
		cells[2].innerHTML = "";
		cells[3].innerHTML = "";

		if(data.db.attach) {
			data.db.attach.forEach(function(e){
				var span = $element("span",cells[2],[".hvut-mm-attach-"+e.t]);
				if(e.t === "e") {
					if(e.e && e.k) {
						$element("a",span,{textContent:e.n,href:"/equip/"+e.e+"/"+e.k,target:"_blank"});
					} else {
						span.textContent = e.n;
					}
				} else {
					span.textContent = e.c.toLocaleString()+" x "+e.n;
				}
			});
			if(data.db.cod) {
				cells[3].textContent = data.db.cod.toLocaleString();
			}
		}
		cells[4].textContent = _mm.dts(data.db.sent);
		cells[5].textContent = data.db.read?_mm.dts(data.db.read):"";

		tr.classList[data.db.error?"add":"remove"]("hvut-mm-error");
		tr.classList[data.db.read?"remove":"add"]("hvut-mm-unread");
		tr.classList[data.db.returned?"add":"remove"]("hvut-mm-returned");
	}
};

_mm.view_mail = function(mid) {
	if(_mm.current !== mid) {
		return;
	}

	var data = _mm.data[mid],
		mail = data.mail,
		db = data.db;

	var div = _mm.view_mail.div;
	div.innerHTML = "";

	$element("dl",$element("div",div)).append(
		$element("dt",null,db.filter==="sent"?"To":"From"),
		$element("dd",null,[" "+db.user,db.returned?".hvut-mm-rts":""]),
		$element("dt",null,"Sent"),
		$element("dd",null,_mm.dts(db.sent,4)),
		$element("dt",null,"Subject"),
		$element("dd",null,db.subject),
		$element("dt",null,"Read"),
		$element("dd",null,db.read===null?"-" : db.read===-1?"????-??-??" : _mm.dts(db.read,4))
	);

	var textarea = $element("textarea",$element("div",div),{value:db.text,spellcheck:false,readOnly:true});

	var buttons = $element("div",div,[".hvut-mm-btns"]);
	$element("span",buttons,"Close",_mm.close_mail);
	if(mail._reply) {
		$element("span",buttons,"Reply",function(){location.href="/?s=Bazaar&ss=mm&filter=new&reply="+mid;});
	}
	if(mail._take) {
		$element("span",buttons,"Take all",function(){
			if(mail.cod && !confirm("Removing the attachments will deduct "+mail.cod.toLocaleString()+" Credits from your account, kupo! Are you sure?")) {
				return;
			}
			_mm.load_mail(mid,true,"action=attach_remove&mmtoken="+mail.mmtoken+"&action_value=0");
		});
	}
	if(mail._return) {
		$element("span",buttons,"Return",function(){
			if(!confirm("This will return the message to the sender, kupo! Are you sure?")) {
				return;
			}
			_mm.load_mail(mid,true,"action=return_message&mmtoken="+mail.mmtoken);
		});
	}
	if(mail._recall) {
		$element("span",buttons,"Recall",function(){
			if(!confirm("This will return the message to the sender, kupo! Are you sure?")) {
				return;
			}
			_mm.load_mail(mid,true,"action=return_message&mmtoken="+mail.mmtoken);
		});
	}
	if(db.error) {
		$element("span",buttons,db.error);
		div.classList.add("hvut-mm-failed");
	} else {
		div.classList.remove("hvut-mm-failed");
	}


	if(mail._take && !db.returned && settings.moogleMailCouponClipper && /Coupon Clipper|Item Shop/i.test(db.subject+"\n"+db.text)) {
		textarea.readOnly = false;
		textarea.addEventListener("input",function(){_mm.itemshop_parse(textarea.value);});
		$element("span",buttons,"Coupon Clipper",function(){
			var items = _mm.itemshop_parse(textarea.value),
				credits = (db.attach.find(e=>e.t==="c")||{c:0}).c;
			if(!items.length) {
				alert("Invalid Request");
				return;
			}
			if(items.cost===credits||confirm("The total price of requested materials is "+items.cost.toLocaleString()+" credits, but the amount of attached credits is "+credits.toLocaleString()+".\n\nContinue?")) {
				_mm.itemshop(mid,items);
			}
		});
		_mm.itemshop_parse(textarea.value);
	}

	if(mail._take && !db.returned && settings.moogleMailDarkDescent && /Dark Descent|reforge/i.test(db.subject+"\n"+db.text)) {
		var equips = db.attach.filter(e=>e.t==="e").map(function(dbeq){
			var eid = dbeq.e,
				data = $equip.dynjs_eqstore[eid],
				exec = $equip.reg.html.exec(data.d),
				eq = {
					info : {name:data.t, category:exec[1], tier:parseInt(exec[6]), eid:eid, key:data.k},
					data : {html:data.d},
					mail : {pane:"equip"},
					node : {}
				};
			$equip.parse.name(eq.info.name,eq);
			return eq;
		});
		$element("span",buttons,"Dark Descent [Level "+equips.map(eq=>eq.info.tier).join("/")+"]",function(){
			var a = db.attach.find(e=>e.n==="Amnesia Shard"),
				c = equips.reduce((p,c)=>p+Math.ceil(c.info.tier/2),0);
			if(!equips.find(eq=>eq.info.tier)) {
				alert("Cannot reforge level zero items.");
				return;
			}
			if(!a?confirm("This costs "+c+" Amnesia Shard"+(c>1?"s":"")+", but nothing attached.\n\nContinue?"):a.c!==c?confirm("This costs "+c+" Amnesia Shard"+(c>1?"s":"")+", but "+a.c+" attached.\n\nContinue?"):confirm("Are you sure you want to reforge this item and send back?")) {
				_mm.reforge(mid,equips);
			}
		});
	}

	data.attach = [];
	if(db && db.attach) {
		var attach_div = $element("div",div,[".hvut-mm-attachs"+(db.returned?" hvut-mm-none":"")]),
			field = $element("fieldset",attach_div,null,{change:_mm.calc_attach}),
			ul = $element("ul",field),
			li = $element("li",ul,"CoD: "+(db.cod?db.cod.toLocaleString()+(db.read?" (Paid)":""):"Not set"));
		data.attach.node_cod = $element("input",li,{className:"hvut-mm-cod",readOnly:true});
		data.attach.node_price = $element("input",li,{className:"hvut-mm-price",readOnly:true,value:db.filter==="sent"?"WTS":"WTB",style:"background-color:transparent;text-align:center"});
		db.attach.forEach(function(e){
			var li = $element("li",ul,[".hvut-mm-attach-"+e.t]);
			if(e.t === "e") {
				if(e.e && e.k) {
					$element("a",li,{textContent:e.n,href:"/equip/"+e.e+"/"+e.k,target:"_blank"});
				} else {
					li.textContent = e.n;
				}
			} else {
				li.textContent = e.c.toLocaleString()+" x "+e.n;
				if(e.t==="i" || e.t==="h") {
					data.attach.push( {t:e.t,n:e.n,c:e.c,node_cod:$element("input",li,{className:"hvut-mm-cod",readOnly:true}),node_price:$element("input",li,{value:$prices.get(db.filter==="sent"?"WTS":"WTB")[e.n]||"",className:"hvut-mm-price"})} );
				}
			}
		});
		_mm.calc_attach();
	}

	$id("mmail_outer").appendChild(div);
};

_mm.calc_attach = function() {
	var data = _mm.data[_mm.current];
	if(!data) {
		return;
	}

	var db = data.db,
		attach = data.attach,
		sum = 0;

	attach.forEach(function(e){
		var p = e.node_price.value.trim() || 0;
		if(isNaN(p)) {
			e.node_price.classList.add("hvut-mm-invalid");
			e.node_cod.classList.add("hvut-mm-invalid");
			return;
		}
		e.node_price.classList.remove("hvut-mm-invalid");
		e.node_cod.classList.remove("hvut-mm-invalid");

		var cod = p * e.c;
		e.node_cod.value = cod ? cod.toLocaleString() : "";
		sum += cod;
	});

	attach.node_cod.value = sum ? sum.toLocaleString() : "";
	if(db && db.cod) {
		attach.node_price.value = !sum?(db.filter==="sent"?"WTS":"WTB") : db.cod===sum?"=" : db.cod>sum?">": "<";
		attach.node_price.style.color = db.cod===sum?"#06f" : "#c00";
		attach.node_cod.style.color = db.cod===sum?"#06f" : "#c00";
	}
};

_mm.close_mail = function() {
	if(_mm.current) {
		var data = _mm.data[_mm.current];
		if(data.page) {
			data.page.tr.classList.remove("hvut-mm-view");
		}
		if(data.search) {
			data.search.tr.classList.remove("hvut-mm-view");
		}
	}
	_mm.current = null;
	if(_mm.view_mail.div) {
		_mm.view_mail.div.remove();
		_mm.view_mail.div.innerHTML = "";
		_mm.log("",3);
	}
};

_mm.search = function() {
	_mm.close_mail();
	if(!_mm.search.div) {
		_mm.search.div = $element("div",null,[".hvut-mm-search"]);
	}
	_mm.search.div.innerHTML = "";
	$element("div",_mm.search.div,[" SEARCHING...","!width:1170px;margin:10px;font-size:12pt"]);
	$id("mmail_outer").appendChild(_mm.search.div);

	var filter = _mm.node.search_filter.value,
		name = _mm.node.search_name.value.trim().toLowerCase(),
		subject = _mm.node.search_subject.value.trim().toLowerCase(),
		text = _mm.node.search_text.value.trim().toLowerCase(),
		attach = _mm.node.search_attach.value.trim(),
		eid,
		cod = _mm.node.search_cod.value.replace(/\s/g,"").toLowerCase(),
		cod_exec,
		cod_min,
		cod_max;

	if(attach) {
		if(isNaN(attach)) {
			attach = attach.toLowerCase().replace(/\s+/g," ").split(" ");
		} else {
			eid = parseInt(attach);
		}
	}
	if( (cod_exec=/^([0-9.]+)([ckm]?)$/.exec(cod)) ) {
		cod = cod_exec[1] * (cod_exec[2]==="k"?1000 : cod_exec[2]==="m"?1000000 : 1);
	} else if( (cod_exec=/^(?:([0-9.]+)([ckm]?))?[\-~](?:([0-9.]+)([ckm]?))?$/.exec(cod)) ) {
		cod_min = cod_exec[1] && cod_exec[1]*(cod_exec[2]==="k"?1000 : cod_exec[2]==="m"?1000000 : 1);
		cod_max = cod_exec[3] && cod_exec[3]*(cod_exec[4]==="k"?1000 : cod_exec[4]==="m"?1000000 : 1);
		cod = 0;
	}

	var list = [];
	_mm.db.conn().openCursor().onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
			var db = cursor.value;
			if(!_mm.data[db.mid]) {
				_mm.data[db.mid] = {};
			}
			var data = _mm.data[db.mid];
			data.db = db;
			if(!data.search) {
				data.search = {};
			}

			var check =
				filter!=="all" && filter!==db.filter ||
				name && !db.user.toLowerCase().includes(name) ||
				subject && !db.subject.toLowerCase().includes(subject) ||
				text && !db.text.toLowerCase().includes(text) ||
				cod && cod!==db.cod || cod_min && (!db.cod || cod_min>db.cod) || cod_max && cod_max<db.cod ||
				attach && !(db.attach && db.attach.some(e=>{if(eid){return e.t==="e"&&e.e===eid;}else{var n=e.n.toLowerCase();return attach.every(a=>n.includes(a));}}));

			if(!check) {
				list.push(data);
			}
			cursor.continue();

		} else {
			var table = $element("table",null,[".hvut-mm-list"]),
				tbody = $element("tbody",table),
				tr = $element("tr",tbody);
				$element("td",tr,"Search");
				$element("td",tr,list.length+" mail(s)");
				$element("td",tr,"Attached");
				$element("td",tr,"CoD");
				$element("td",tr,"Sent");
				$element("td",tr,"Read");

			list.reverse();
			list.forEach(function(mm){
				var db = mm.db,
					tr = mm.search.tr = $element("tr",tbody);
				$element("td",tr);
				$element("a",$element("td",tr),{href:"/?s=Bazaar&ss=mm&filter="+db.filter+"&mid="+db.mid},function(e){e.preventDefault();_mm.load_mail(db.mid,true);});
				$element("td",tr);
				$element("td",tr);
				$element("td",tr);
				$element("td",tr);
				_mm.modify_mail(db.mid,filter);
			});

			_mm.search.div.innerHTML = "";
			_mm.search.div.appendChild(table);
		}
	};
};

_mm.dts = function(date,year=2) {//date_to_string
	date = new Date(date*1000);
	var Y = date.getFullYear().toString().substr(4-year),
		M = (date.getMonth()+101).toString().substr(1),
		D = (date.getDate()+100).toString().substr(1),
		h = (date.getHours()+100).toString().substr(1),
		m = (date.getMinutes()+100).toString().substr(1);
	return Y+"-"+M+"-"+D+" "+h+":"+m;
};

_mm.kill_asshole = function(obj) {
	function h(e,t,r,a) {
		for(r='',a='0x'+e.substr(t,2)|0,t+=2;t<e.length;t+=2) {
			r += String.fromCharCode('0x' + e.substr(t,2) ^ a);
		}
		return r;
	}

	$qsa(".__cf_email__",obj).forEach(function(a){
		a.parentNode.replaceChild(document.createTextNode(h(a.dataset.cfemail,0)),a);
	});
	return obj;
};

_mm.log = function(text,clear) {
	if(clear === 1) { // init
		_mm.node.log.value = "";
		_mm.node.log.parentNode.classList.remove("hvut-none");
	} else if(clear === 2) { // clear
		_mm.node.log.value = "";
	} else if(clear === 3) { // close
		_mm.node.log.parentNode.classList.add("hvut-none");
	}
	_mm.node.log.value += text+"\n";
	_mm.node.log.scrollTop = _mm.node.log.scrollHeight;
};

_mm.itemshop_data = {
	"health draught": {id:11191,price:23},
	"health potion": {id:11195,price:45},
	"health elixir": {id:11199,price:450},
	"mana draught": {id:11291,price:45},
	"mana potion": {id:11295,price:90},
	"mana elixir": {id:11299,price:900},
	"spirit draught": {id:11391,price:45},
	"spirit potion": {id:11395,price:90},
	"spirit elixir": {id:11399,price:900},
	//"soul fragment": {id:48001,price:900},
	"crystal of vigor": {id:50001,price:9},
	"crystal of finesse": {id:50002,price:9},
	"crystal of swiftness": {id:50003,price:9},
	"crystal of fortitude": {id:50004,price:9},
	"crystal of cunning": {id:50005,price:9},
	"crystal of knowledge": {id:50006,price:9},
	"crystal of flames": {id:50011,price:9},
	"crystal of frost": {id:50012,price:9},
	"crystal of lightning": {id:50013,price:9},
	"crystal of tempest": {id:50014,price:9},
	"crystal of devotion": {id:50015,price:9},
	"crystal of corruption": {id:50016,price:9},
	"monster chow": {id:51001,price:14},
	"monster edibles": {id:51002,price:27},
	"monster cuisine": {id:51003,price:45},
	"happy pills": {id:51011,price:1800},
	"scrap cloth": {id:60051,price:90},
	"scrap leather": {id:60052,price:90},
	"scrap metal": {id:60053,price:90},
	"scrap wood": {id:60054,price:90},
	"energy cell": {id:60071,price:180},
	"wispy catalyst": {id:60301,price:90},
	"diluted catalyst": {id:60302,price:450},
	"regular catalyst": {id:60303,price:900},
	"robust catalyst": {id:60304,price:2250},
	"vibrant catalyst": {id:60305,price:4500},
	"coruscating catalyst": {id:60306,price:9000},
};

_mm.itemshop_parse = function(text) {
	var items = [];
	items.cost = 0;
	_mm.log("[Item Shop Request]",1);
	text.split("\n").forEach(function(t){
		var exec,name,lowercase,count,id,price;
		if(t.startsWith("> ")) {
			return;
		} else if( (exec=/([A-Za-z0-9\-' ]+)(?:\s*@\s*([0-9,.]+)([ckm])?)?(?:\s+[x*\uff0a]?\s*[\[(]?([0-9,]+)[\])]?)/i.exec(t)) ) {
			name = exec[1];
			count = exec[4];
		} else if( (exec=/(?:[\[(]?([0-9,]+)[\])]?\s*[x*\uff0a]?\s*)([A-Za-z0-9\-' ]+)(?:\s*@\s*([0-9,.]+)([ckm])?)?/i.exec(t)) ) {
			name = exec[2];
			count = exec[1];
		} else {
			return;
		}
		name = name.trim();
		lowercase = name.toLowerCase();
		count = parseInt(count.replace(/,/g,""));
		if(_mm.itemshop_data.hasOwnProperty(lowercase) && count) {
			id = _mm.itemshop_data[lowercase].id;
			price = _mm.itemshop_data[lowercase].price;
			items.push({info:{name:name,lowercase:lowercase,iid:id},mail:{pane:"item",count:count}});
			items.cost += count * price;
			_mm.log("- "+count.toLocaleString()+" x "+name+" @ "+price.toLocaleString());
		}
	});
	_mm.log("# Total Cost: "+items.cost.toLocaleString()+"c");
	return items;
};

_mm.itemshop = function(mid,items) {
	if(items) {
		if(_mm.itemshop.mid) {
			return;
		}
		_mm.itemshop.mid = mid;
		_mm.itemshop.items = items;
		_mm.data[mid].itemshop = {};
	}
	mid = _mm.itemshop.mid;
	items = _mm.itemshop.items;
	var data = _mm.data[mid],
		status = data.itemshop;

	if(!status.taken) {
		_mm.load_mail(mid,true,"action=attach_remove&mmtoken="+data.mail.mmtoken+"&action_value=0",function(){status.taken=true;_mm.itemshop();});
		_mm.log("[Item Shop Request]",1);
		_mm.log("Receiving...");

	} else if(!status.storetoken) {
		_mm.log("...");
		$ajax.send("GET","/?s=Bazaar&ss=is",null,function(r){
			var html = r.responseText;
			if(/<input type="hidden" name="storetoken" value="(\w+)"/.test(html)) {
				status.storetoken = RegExp.$1;
				_mm.itemshop();
			} else {
				_mm.log("!!! Error...");
			}
		});

	} else if(!status.bought) {
		_mm.log("Buying...");
		status.bought = 0;
		items.forEach(function(item){
			$ajax.send("POST","/?s=Bazaar&ss=is","storetoken="+status.storetoken+"&select_mode=shop_pane&select_item="+item.info.iid+"&select_count="+item.mail.count,function(){
				status.bought++;
				_mm.log(status.bought+"/"+items.length);
				if(status.bought === items.length) {
					_mm.itemshop();
				}
			});
		});

	} else if(!status.sent) {
		_mm.log("...");
		$ajax.send("GET","/?s=Bazaar&ss=mm&filter=new&reply="+mid,null,function(r){
			var html = r.responseText;
			if(html.includes('<div id="mmail_outer">')) {
				var content = substring(html,'<div id="mmail_outer">','<script type="text/javascript">\nvar send_cost',true),
					form = $id("mailform",content);

				if($id("mmail_attachremove",content)) {
					_mm.log("...");
					$ajax.send("POST","/?s=Bazaar&ss=mm&filter=new","mmtoken="+form.elements.mmtoken.value+"&action=discard&action_value=0",function(){_mm.itemshop();});

				} else {
					status.sent = true;
					_mm.mmtoken = form.elements.mmtoken.value;
					_mm.node.to_name = form.elements.message_to_name;
					_mm.node.subject = form.elements.message_subject;
					_mm.node.body = form.elements.message_body;
					_mm.node.body.value += "\n\n[Item Shop Service]";
					_mm.send(items);
				}
			}
		});
	}
};

_mm.reforge = function(mid,equips) {
	if(equips) {
		if(_mm.reforge.mid) {
			return;
		}
		_mm.reforge.mid = mid;
		_mm.reforge.equips = equips;
		_mm.data[mid].reforge = {};
	}
	mid = _mm.reforge.mid;
	equips = _mm.reforge.equips;
	var data = _mm.data[mid],
		status = data.reforge;

	if(!status.taken) {
		_mm.load_mail(mid,true,"action=attach_remove&mmtoken="+data.mail.mmtoken+"&action_value=0",function(){status.taken=true;_mm.reforge();});
		_mm.log("[Reforge Request]",1);
		_mm.log("Receiving...");

	} else if(!status.reforged) {
		_mm.log("Reforging...");
		status.reforged = 0;
		equips.forEach(function(eq){
			if(!eq.info.tier) {
				status.reforged++;
				_mm.log(status.reforged+" / "+equips.length+": skip level zero item");
				return;
			}
			$ajax.send("POST","/?s=Forge&ss=fo&filter="+({"One-handed Weapon":"1handed","Two-handed Weapon":"2handed","Staff":"staff","Shield":"shield","Cloth Armor":"acloth","Light Armor":"alight","Heavy Armor":"aheavy"})[eq.info.category],"select_item="+eq.info.eid,function(r){
				status.reforged++;
				var html = r.responseText;
				if(html.includes('<div id="messagebox"')) {
					_mm.log(status.reforged+" / "+equips.length+": "+substring(html,'<div id="messagebox"','<div id="mainpane">',true).firstElementChild.lastElementChild.textContent.trim());
					status.error = true;
					return;
				}
				_mm.log(status.reforged+" / "+equips.length);
				if(status.reforged === equips.length && !status.error) {
					_mm.reforge();
				}
			});
		});

	} else if(!status.sent) {
		_mm.log("...");
		$ajax.send("GET","/?s=Bazaar&ss=mm&filter=new&reply="+mid,null,function(r){
			var html = r.responseText;
			if(html.includes('<div id="mmail_outer">')) {
				var content = substring(html,'<div id="mmail_outer">','<script type="text/javascript">\nvar send_cost',true),
					form = $id("mailform",content);

				if($id("mmail_attachremove",content)) {
					_mm.log("...");
					$ajax.send("POST","/?s=Bazaar&ss=mm&filter=new","mmtoken="+form.elements.mmtoken.value+"&action=discard&action_value=0",function(){_mm.reforge();});

				} else {
					status.sent = true;
					_mm.mmtoken = form.elements.mmtoken.value;
					_mm.node.to_name = form.elements.message_to_name;
					_mm.node.subject = form.elements.message_subject;
					_mm.node.body = form.elements.message_body;
					_mm.node.body.value += "\n\n[Reforge Service]";
					_mm.send(equips);
				}
			}
		});
	}
};


GM_addStyle(`
	#mmail_outerlist {clear:both; overflow:auto; margin:20px 10px 10px}
	#mmail_list {display:none}
	#mmail_pager {position:absolute; right:0; bottom:0; padding:5px; height:25px; width:auto}

	.hvut-mm-list {table-layout:fixed; border-collapse:collapse; margin:10px; width:1170px; font-size:10pt; line-height:1.6em; text-align:left; white-space:nowrap}
	.hvut-mm-list tr:hover {background-color:#fff}
	.hvut-mm-list tr > td:hover {background-color:#ffc}
	.hvut-mm-list tr:first-child > td {border-top:1px solid #630; background-color:#edb; color:#000; font-weight:bold; text-align:center}
	.hvut-mm-list td {padding:2px 5px; border-bottom:1px solid #630; overflow:hidden; text-overflow:ellipsis}
	.hvut-mm-list td:nth-child(1) {width:150px}
	.hvut-mm-list td:nth-child(1) > span {padding:1px 3px; border:1px solid; font-weight:bold}
	.hvut-mm-list td:nth-child(2) {width:400px}
	.hvut-mm-list td:nth-child(3) {width:300px}
	.hvut-mm-list td:nth-child(4) {width:80px; color:#00c; text-align:right}
	.hvut-mm-list td:nth-child(5) {width:90px; font-size:9pt}
	.hvut-mm-list td:nth-child(6) {width:90px; font-size:9pt}

	.hvut-mm-list td:nth-child(2) > a {display:block; text-decoration:none}
	.hvut-mm-list tr:hover > td:nth-child(2) > a {text-decoration:underline}

	.hvut-mm-list td:nth-child(3) > span {display:block}
	.hvut-mm-attach-e {color:#c00}
	.hvut-mm-attach-e > a {color:inherit}
	.hvut-mm-attach-c {color:#03f}
	.hvut-mm-attach-h {color:#c0c}
	.hvut-mm-attach-i {color:#090}

	.hvut-mm-view {background-color:#edb !important}
	.hvut-mm-returned {background-color:#ddd}
	.hvut-mm-returned * {color:#666 !important}
	.hvut-mm-unread {background-color:#fcc}
	.hvut-mm-nodb {background-color:#fcc}
	.hvut-mm-removed {background-color:#eee; text-decoration:line-through}
	.hvut-mm-error {background-color:#ddd}
	.hvut-mm-error * {color:#666 !important}

	.hvut-mm-search {position:absolute; top:80px; left:17px; height:580px; border:1px solid; background-color:#fff; z-index:1; overflow-y:scroll}

	#hvut-mm-view {position:absolute; top:80px; left:598px; width:600px; border:1px solid; background-color:#fff; z-index:2; color:#000; font-size:10pt; text-align:left}
	.hvut-mm-failed {background-color:#eee !important}
	#hvut-mm-view > div {margin:12px 20px}
	#hvut-mm-view dl {list-style:none; margin:0; padding:0}
	#hvut-mm-view dl::after {content:''; display:block; clear:both}
	#hvut-mm-view dt {float:left; margin:2px 0; padding:2px 5px; width:30px; border:1px solid #666}
	#hvut-mm-view dt:nth-of-type(2n+1) {clear:left; width:45px}
	#hvut-mm-view dd {float:left; margin:2px 10px 2px 5px; padding:2px 5px; width:110px; border-bottom:1px solid}
	#hvut-mm-view dd:nth-of-type(2n+1) {width:300px}
	.hvut-mm-rts::before {content:'[MoogleMail]'; color:#999; margin-right:5px}
	#hvut-mm-view textarea {width:538px; height:180px; margin:0; padding:10px; font-size:9pt}
	.hvut-mm-btns > span {margin:5px; padding:2px 5px; border:1px solid #666; cursor:pointer}
	.hvut-mm-btns > span:hover {background-color:#666; color:#fff}
	#hvut-mm-view fieldset {margin:0; padding:0; border:none}
	#hvut-mm-view ul {list-style:none; margin:0; padding:0; line-height:1.5em}
	.hvut-mm-attachs {border:1px solid; padding:5px 10px}
	.hvut-mm-attachs li:first-child {margin-top:0; padding:0 0 0 5px; border:1px solid; background-color:#eee; font-weight:bold}
	.hvut-mm-attachs li {clear:both; margin-top:2px; padding-right:1px}
	.hvut-mm-attachs input {float:right; margin-left:5px; padding:0 3px; border:1px solid; line-height:18px; text-align:right; background-color:transparent}
	.hvut-mm-price {color:#000; width:60px}
	.hvut-mm-cod {color:#666; width:75px}
	.hvut-mm-invalid {color:#c00}
	.hvut-mm-none input {display:none}
`);


_mm.node.search_div = $element("div",$id("mmail_outer"),["!position:absolute;left:0;bottom:0;padding:5px;height:25px"]);
$element("input",_mm.node.search_div,{type:"button",value:"Clear Records",style:"margin-right:60px"},function(){if(confirm("All MoogleMail records in this browser will be deleted.\n\nAre you sure?")){_mm.db.conn("readwrite",function(){location.href=location.href;}).clear();}});
_mm.node.search_filter = $element("select",_mm.node.search_div,{innerHTML:"<option value='all'>All</option><option value='inbox'>Inbox</option><option value='read'>Read</option><option value='sent'>Sent</option>",style:"width:70px;margin:0;padding:0"});
_mm.node.search_name = $element("input",_mm.node.search_div,{placeholder:"User",style:"width:100px"},{keypress:function(e){if(e.keyCode===13){_mm.search();}}});
_mm.node.search_subject = $element("input",_mm.node.search_div,{placeholder:"Subject",style:"width:150px"},{keypress:function(e){if(e.keyCode===13){_mm.search();}}});
_mm.node.search_text = $element("input",_mm.node.search_div,{placeholder:"Text",style:"width:150px"},{keypress:function(e){if(e.keyCode===13){_mm.search();}}});
_mm.node.search_attach = $element("input",_mm.node.search_div,{placeholder:"Attachment",style:"width:150px"},{keypress:function(e){if(e.keyCode===13){_mm.search();}}});
_mm.node.search_cod = $element("input",_mm.node.search_div,{placeholder:"CoD",style:"width:70px;text-align:right;cursor:help",title:"min-max"},{keypress:function(e){if(e.keyCode===13){_mm.search();}}});
$element("input",_mm.node.search_div,{type:"button",value:"Search"},function(){_mm.search();});
$element("input",_mm.node.search_div,{type:"button",value:"Close"},function(){if(_mm.search.div){_mm.search.div.remove();_mm.search.div.innerHTML="";}});

$id("mmail_pager").innerHTML = "";
_mm.node.page_go = $element("input",$id("mmail_pager"),{value:_mm.page,style:"width:30px;text-align:right"});
$element("input",$id("mmail_pager"),{type:"button",value:"GO"},function(){location.href=location.href.replace(/&page=\d+/,"")+"&page="+_mm.node.page_go.value;});
_mm.node.page_new = $element("input",$id("mmail_pager"),{type:"button",value:"Prev"},function(){_mm.load_page("new");});
_mm.node.page_old = $element("input",$id("mmail_pager"),{type:"button",value:"Next"},function(){_mm.load_page("old");});

_mm.node.log = $element("textarea",$element("div",$id("mmail_outer"),[".hvut-none","!position:absolute;top:80px;right:650px;border:1px solid;background-color:#fff"]),{readOnly:true,spellcheck:false,style:"width:300px;height:300px;margin:10px;font-size:9pt"});

_mm.table[_mm.page] = $element("table",$id("mmail_outerlist"),[".hvut-mm-list"]);

_mm.db.open(function(){_mm.create_page($id("mmail_list"),_mm.page);$id("mmail_list").remove();});

}

} else
// [END 13] Bazaar - MoogleMail */


//* [14] Bazaar - Lottery
if(settings.lottery && _query.s==="Bazaar" && (_query.ss==="lt" || _query.ss==="la")) {

if(settings.showLottery && $qs("img[src$='lottery_next_d.png']")) {
	_lt.json = getValue(_query.ss+"_show",{});
	_lt.div = $element("div",$id("rightpane"),["!margin:20px;color:#c00"]);
	_lt.label = $element("label",_lt.div);
	$element("input",_lt.label,{type:"checkbox",checked:!_lt.json.hide,style:"vertical-align:middle;top:0"},{change:function(){_lt.json.hide=!this.checked;setValue(_query.ss+"_show",_lt.json);}});
	$element("",_lt.label,"Show this lottery on every page");
}

confirm_event($qs("img[src$='/lottery_golden_a.png']"),"click","Are you sure you wish to spend a Golden Lottery Ticket?");

} else
// [END 14] Bazaar - Lottery */


// Battle
if(_query.s==="Battle" && $id("initform")) {

//* [16] Battle - Arena
if(settings.arena && _query.ss==="ar") {

if(!_query.page) {
	GM_addStyle(`
		#arena_pages {display:none}
		#arena_list > tbody > tr > td {height:24px}
		#arena_list > tbody > tr > td > img {position:static}
		#arena_list > tbody > tr > td > img:nth-last-child(n+2) {display:none}
	`);

	$ajax.send("GET","/?s=Battle&ss=ar&page=2",null,
		function(r){
			var tbody = substring(r.responseText,['<table id="arena_list">',true],"</table>",true);
			tbody.firstElementChild.remove();
			$id("arena_list").tBodies[0].appendChild(tbody);
		},
		function(){alert("Failed to load page 2");}
	);
}

} else
// [END 16] Battle - Arena */


//* [19] Battle - Item World
if(settings.itemWorld && _query.ss==="iw") {

GM_addStyle(`
	#itemworld_right > div:first-child {display:none}
	#itemworld_right > div:last-child {margin-top:200px}
	#csp > .hvut-bt-div {left:786px}
	.equiplist > div {width:586px; height:50px}
	.equiplist > div:hover {background-color:#ddd}
	.hvut-iw-sub {position:absolute; top:28px; left:25px; font-size:8pt; white-space:nowrap}
	.hvut-iw-tier {color:#00c; font-weight:bold}
	.hvut-iw-up {color:#c00}
	.hvut-iw-pxp {margin-left:3px}
	.hvut-iw-gain {color:#090; margin:0 5px; cursor:pointer}
	.hvut-iw-reforge {color:#c00; font-weight:bold; margin-left:10px; cursor:pointer}
	.hvut-iw-potency > span {margin-left:5px}
`);


_iw.calcPXP = function(eq,round) {
	round = parseInt(round);
	if(!round) {
		round = eq.info.round;
	}

	var exp = Math.ceil(round * ({"Normal":2,"Hard":2,"Nightmare":4,"Hell":7,"Nintendo":10,"IWBTH":15,"PFUDOR":20})[_player.dfct]);
	if(eq.info.soulbound) {
		exp *= 2;
	}

	var tier = eq.info.tier,
		pxp2 = eq.info.pxp2,
		pxp1 = eq.info.pxp1 + exp;

	while(tier<10 && pxp1>=pxp2) {
		tier++;
		pxp1 -= pxp2;
		pxp2 = Math.ceil(eq.info.pxp * Math.pow(1+eq.info.pxp/1000,tier));
	}

	eq.node.calc.innerHTML = "";
	$element("span",eq.node.calc,[" +"+exp+" ("+round+") =",".hvut-iw-gain"],function(){_iw.calcPXP(eq,prompt("Enter the number of Rounds"));});
	$element("span",eq.node.calc,[" Level "+tier,".hvut-iw-tier"+(tier!==eq.info.tier?" hvut-iw-up":"")]);
	$element("span",eq.node.calc,[" "+(tier<10?"("+pxp1+ " / "+pxp2+")":"MAX"),".hvut-iw-pxp"]);
};

_iw.reforge = function(eq) {
	if(!eq.node.div.previousElementSibling.classList.contains("iu")) {
		alert("Unlock before reforge.");
		return;
	}
	if(!confirm("["+eq.info.name+"]\n\nAre you sure you want to reforge this item?\n\nThis will remove all potencies and reset its level to zero.")) {
		return;
	}

	$ajax.send("POST","/?s=Forge&ss=fo&filter="+_iw.filter,"select_item="+eq.info.eid,
		function(r){
			var html = r.responseText;
			if(html.includes('<div id="messagebox"')) {
				alert(substring(html,'<div id="messagebox"','<div id="mainpane">',true).firstElementChild.lastElementChild.textContent.trim());
			}
			location.href = location.href;
		},
		function(){
			alert("Error!");
			location.href = location.href;
		}
	);
};

_iw.show_potency = function(eq) {
	if(!eq.node.calc) {
		$equip.parse.pxp(eq);
		eq.node.calc = $element("span",eq.node.sub,[".hvut-iw-calc"]);
	}
	_iw.calcPXP(eq);

	if(eq.data.checked) {
		return;
	}
	eq.data.checked = true;
	if(!eq.info.tier) {
		return;
	}

	$ajax.send("GET","/equip/"+eq.info.eid+"/"+eq.info.key,null,function(r){
		var doc = substring(r.responseText,"<div","</body>",true);
		$element("span",eq.node.sub,[" Reforge",".hvut-iw-reforge"],function(){_iw.reforge(eq);});
		var potency_span = $element("span",eq.node.sub,[".hvut-iw-potency"]);
		$qsa("#ep",doc).forEach(function(p){
			$element("span",potency_span,[" "+p.textContent]);
		});
	});
};

$equip.list($id("item_pane"),1).forEach(function(eq){
	eq.node.div.addEventListener("click",function(){_iw.json[_iw.filter]=eq.info.eid;setValue("iw_json",_iw.json);_iw.show_potency(eq);});
	eq.node.sub = $element("div",[eq.node.wrapper,0],[".hvut-iw-sub"]);
	$element("span",eq.node.sub,[" Level "+eq.info.tier,(eq.info.tier?".hvut-iw-tier":"")]);
	$element("span",eq.node.sub,[" ("+eq.info.pxp1+" / "+eq.info.pxp2+")",".hvut-iw-pxp"]);
});

_iw.json = getValue("iw_json",{});
_iw.filter = _query.filter || "1handed";
if( (_iw.latest=$id("e"+_iw.json[_iw.filter])) ) {
	_iw.latest.parentNode.style.cssText = "background-color:#ffc;border:1px solid";
	$qs("#item_pane > .equiplist").insertBefore(_iw.latest.parentNode,$qs("#item_pane > .equiplist").firstChild);
}

} else
// [END 19] Battle - Item World */

{} // END OF [else if]; DO NOT REMOVE THIS LINE!


var $battle = {};

//* [0] Battle - Equipment Enchant and Repair
if(settings.equipEnchant) {

$battle.inventory = {};

$battle.view = function(eq) {
	if(!eq) {
		return;
	}
	if($battle.current) {
		$battle.current.node.li.classList.remove("hvut-bt-hover");
	}

	$battle.current = eq;
	eq.node.li.classList.add("hvut-bt-hover");

	$battle.item_ul.innerHTML = "";
	var li = $element("li",$battle.item_ul,[" "+eq.info.name,".hvut-bt-eqname"]),
		basename = $equip.basename[eq.info.eid];
	if(basename && basename !== eq.info.name) {
		$element("span",li,"[ "+basename+" ]");
	}

	var type = eq.info._type,
		day = (new Date()).getUTCDay();
	for(let name in $battle.enchant_data) {
		let item = $battle.enchant_data[name];
		if(item[type]) {
			let li = $element("li",$battle.item_ul),
				count = parseInt((type==="weapon" && name.includes("Infusion of ")) ? settings.equipEnchantWeapon : settings.equipEnchantArmor) || 1,
				stock = $battle.inventory[name] || 0;
			if(!stock) {
				li.classList.add("hvut-bt-nostock");
			}
			$element("span",li,[" "+stock,".hvut-bt-stock"]);
			$element("span",li,[" [+"+count+"]",".hvut-bt-imbue"],function(){$battle.enchant(eq,name,count);});
			$element("span",li,[" "+item.effect,".hvut-bt-shard"+(type==="weapon"&&item.day===day?" hvut-bt-day":"")],function(){$battle.enchant(eq,name,1);});
		}
	}
};

$battle.load = function(eq) {
	eq.node.ect.textContent = "Loading";

	$ajax.send("GET","/equip/"+eq.info.eid+"/"+eq.info.key,null,function(r){
		var html = r.responseText;
		$battle.parse(eq,html);
	});
};

$battle.parse = function(eq,html) {
	var div = substring(html,'<div id="equip_extended">',["</div>\n</div>",true],true).firstElementChild;

	var exec = /Condition: (\d+) \/ (\d+) \((\d+)%\)/.exec($qs(".eq",div).children[1].textContent);
	eq.info.condition = exec[1];
	eq.info.durability = exec[2];
	eq.info.cdt = eq.info.condition/eq.info.durability;

	var thld = settings.equipEnchantRepairThreshold;
	if(thld < 1) {
		thld = eq.info.cdt <= thld;
	} else {
		thld = eq.info.condition <= eq.info.durability*0.5 + thld;
	}

	eq.node.cdt.textContent = eq.info.condition+" / "+eq.info.durability+" ("+(eq.info.cdt*100).toFixed(1)+"%)";
	eq.node.cdt.style.cssText = eq.info.cdt<=0.5?"color:#fff;background-color:#c00" : thld?"color:#f00" : eq.info.cdt<=0.6?"color:#f60" : "";

	eq.node.ect.innerHTML = "";
	$qsa("#ee > span",div).forEach(function(e){
		$element("span",eq.node.ect,e.textContent);
	});
	if(!eq.node.ect.children.length) {
		eq.node.ect.textContent = "No Enchantments";
	}
};

$battle.enchant = function(eq,name,count) {
	var item = $battle.enchant_data[name],
		stock = $battle.inventory[name] || 0;
	if(count > stock) {
		count = stock;
	}
	if(count < 1) {
		return;
	}
	var c = count;
	eq.node.ect.textContent = "Loading";
	while(count--) {
		$ajax.send("POST","/?s=Forge&ss=en","select_item="+eq.info.eid+"&enchantment="+item[eq.info._type],function(r){
			var html = r.responseText;
			$battle.parse(eq,html);
			if(!--c) {
				$battle.load_inventory();
			}
		});
	}
};

$battle.repair = function(eq) {
	if(eq && eq.info && eq.info.cdt===1) {
		return;
	}
	$battle.repair_div.innerHTML = "<span>[ Loading ]</span><span>...</span>";

	$ajax.send("POST","/?s=Forge&ss=re", eq==="all"?"repair_all=1" : eq?"select_item="+eq.info.eid : null, function(r){
		var html = r.responseText;

		if(html.includes('<div id="messagebox"')) {
			var error = substring(html,'<div id="messagebox"','<div id="mainpane">',true).firstElementChild.lastElementChild.textContent.trim();
			if(eq==="all") {
				//$battle.repair_div.innerHTML = error;
				popup(error);
			} else if(eq) {
				//eq.node.rpr.textContent = "ERROR";
				popup(error);
			} else {
				popup(error);
			}
			$battle.load_inventory();
			return;
		}

		var repair_html = substring(html,'<div class="nosel equiplist">','</table>'),
			repair_list = {},
			repairall = false,
			reg = /forge\.set_forge_cost\((\d+),'Requires: (\d+)x (Scrap (?:Cloth|Leather|Metal|Wood))(?:, (\d+)x (Energy Cell))?'\)/g,
			exec;

		while( (exec=reg.exec(repair_html)) ) {
			repair_list[exec[1]] = {[exec[3]]:parseInt(exec[2]),"Energy Cell":parseInt(exec[4]||0)};
			repairall = true;
		}

		if(repairall) {
			$battle.repairall = {"Scrap Cloth":0,"Scrap Leather":0,"Scrap Metal":0,"Scrap Wood":0,"Energy Cell":0};
		} else {
			$battle.repairall = false;// "Everything is fully repaired."
		}

		$battle.equip.forEach(function(_eq){
			_eq.node.rpr.innerHTML = "";
			var rpr = repair_list[_eq.info.eid];
			if(rpr) {
				_eq.data.repair = rpr;
				for(let r in rpr) {
					if(rpr[r]) {
						$battle.repairall[r] += rpr[r];
						$element("div",_eq.node.rpr,r.replace(/crap |nergy /,".")+" ("+rpr[r]+")");
					}
				}
			} else {
				_eq.data.repair = false;
				_eq.node.rpr.innerHTML = "-";
			}
			if(eq==="all" || eq===_eq) {
				$battle.load(_eq);
			}
		});

		$battle.load_inventory();
	});
};

$battle.load_inventory = function() {
	$battle.inventory = {};
	$ajax.send("GET","/?s=Character&ss=it",null,function(r){
		Array.from( substring(r.responseText,'<table class="nosel itemlist">',["</table>",true],true).firstElementChild.rows ).forEach(function(tr){
			$battle.inventory[ tr.cells[0].textContent.trim() ] = parseInt(tr.cells[1].textContent);
		});

		$battle.repair_div.innerHTML = "";
		$element("span",$battle.repair_div,[" [ Repair All ]","!cursor:pointer"],function(){$battle.repair("all");});
		if($battle.repairall) {
			for(let e in $battle.repairall) {
				if($battle.repairall[e]) {
					let c = $battle.inventory[e] || 0;
					$element("span",$battle.repair_div,[" "+e+" ("+$battle.repairall[e]+" / "+c+")",c<$battle.repairall[e]?".hvut-bt-warn":""]);
				}
			}
		} else {
			$element("span",$battle.repair_div,"Everything is fully repaired.");
		}

		$battle.inventory_div.innerHTML = "";
		settings.equipEnchantInventory.forEach(function(e,i){
			if(!i) {
				return;
			}
			var c = $battle.inventory[e] || 0;
			$element("span",$battle.inventory_div,[" "+e+" ("+c+")",c<settings.equipEnchantInventory[0]?".hvut-bt-warn":""]);
		});

		$battle.item_ul.innerHTML = "<li class='hvut-bt-eqname'>Enchantments</li>";
		$battle.view($battle.current);
	});
};

$battle.enchant_data = {
	"Voidseeker Shard":{effect:"Voidseeker's Blessing",weapon:"vseek"},
	"Aether Shard":{effect:"Suffused Aether",weapon:"ether"},
	"Featherweight Shard":{effect:"Featherweight Charm",weapon:"feath",armor:"feath"},
	"Infusion of Flames":{effect:"Infused Flames",weapon:"sfire",armor:"pfire",day:2},
	"Infusion of Frost":{effect:"Infused Frost",weapon:"scold",armor:"pcold",day:3},
	"Infusion of Lightning":{effect:"Infused Lightning",weapon:"selec",armor:"pelec",day:6},
	"Infusion of Storms":{effect:"Infused Storm",weapon:"swind",armor:"pwind",day:4},
	"Infusion of Divinity":{effect:"Infused Divinity",weapon:"sholy",armor:"pholy",day:0},
	"Infusion of Darkness":{effect:"Infused Darkness",weapon:"sdark",armor:"pdark",day:1}
};

$battle.init = function() {
	$battle.equip_ul.innerHTML = "";

	$battle.equip = getValue("eq_set",[]).map(function(info){
		var eq = {info:info,data:{},node:{}};
		eq.info._type = (eq.info.category==="One-handed Weapon" || eq.info.category==="Two-handed Weapon" || eq.info.category==="Staff") ? "weapon" : "armor";

		var li = eq.node.li = $element("li",$battle.equip_ul,null,{mouseenter:function(){$battle.view(eq);}});
		eq.node.cdt = $element("div",li,[" ...",".hvut-bt-cdt"]);
		eq.node.rpr = $element("div",li,[" ...",".hvut-bt-rpr"],function(){$battle.repair(eq);});
		eq.node.name = $element("a",li,{textContent:eq.info.name,className:"hvut-bt-name",target:"hvut-bt-equip",href:"/equip/"+eq.info.eid+"/"+eq.info.key});
		eq.node.ect = $element("div",li,[".hvut-bt-enc"]);
		$battle.load(eq);

		return eq;
	});

	if($battle.equip[0]) {
		$battle.view($battle.equip[0]);
		$battle.repair();
	}
};


GM_addStyle(`
	#grindfest {margin-top:100px}
	.hvut-bt-div {position:absolute; bottom:0; left:180px; width:450px; color:#000; z-index:1}

	.hvut-bt-repair {border-top:1px solid; padding-left:10px; background-color:#edb; font-size:9pt; line-height:16px; text-align:left}
	.hvut-bt-repair > span {display:inline-block; margin-right:10px}
	.hvut-bt-repair > span:first-child {display:block; font-weight:bold}
	.hvut-bt-inventory {border-top:1px solid; border-bottom:1px solid; margin-bottom:1px; padding-left:10px; background-color:#edb; font-size:9pt; line-height:16px; text-align:left}
	.hvut-bt-inventory > span {display:inline-block; margin-right:10px}
	.hvut-bt-warn {font-weight:bold; color:#f00}

	.hvut-bt-equip {margin:0; padding:0; list-style:none; background-color:#fff; font-size:10pt; line-height:16px}
	.hvut-bt-equip > li {position:relative; padding-left:70px; border-top:1px solid}
	.hvut-bt-equip > li.hvut-bt-hover {background-color:#ffc}
	.hvut-bt-cdt, .hvut-bt-rpr {position:absolute; left:0; width:70px; height:100%; font-size:8pt; cursor:pointer}
	.hvut-bt-cdt {font-weight:bold}
	.hvut-bt-rpr {display:none; background-color:inherit}
	.hvut-bt-cdt:hover + .hvut-bt-rpr, .hvut-bt-rpr:hover {display:block}
	.hvut-bt-name {display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:bold; text-decoration:none}
	.hvut-bt-enc {display:block; font-size:8pt}
	.hvut-bt-enc > span {display:inline-block; margin:0 5px; color:#f00}

	.hvut-bt-items {position:absolute; display:flex; flex-direction:column; justify-content:center; left:-180px; bottom:20px; box-sizing:border-box; width:180px; height:198px; margin:0; padding:0; border-bottom:1px solid; list-style:none; font-size:9pt; line-height:16px; background-color:#fff; text-align:left; white-space:nowrap}
	.hvut-bt-items > li {margin:2px 5px; overflow:hidden; text-overflow:ellipsis}
	.hvut-bt-stock {display:inline-block; width:35px; color:#000; text-align:right}
	.hvut-bt-imbue {margin-left:3px; color:#06f; cursor:pointer}
	.hvut-bt-shard {margin-left:3px; color:#00c; cursor:pointer}
	.hvut-bt-day {color:#009; font-weight:bold}
	.hvut-bt-imbue:hover, .hvut-bt-shard:hover {color:#c00; text-decoration:underline}
	.hvut-bt-nostock > span {color:#999 !important; cursor:default}
	.hvut-bt-eqname {position:absolute; bottom:100%; left:0; box-sizing:border-box; width:100%; margin:0 !important; padding:10px; border-top:1px solid; background-color:#ffc; color:#5C0D11; font-weight:bold; text-align:center; white-space:normal}
	.hvut-bt-eqname > span {display:block; margin-top:6px; font-weight:normal}

	.hvut-bt-min > * {display:none}
	.hvut-bt-toggle {display:block !important; background-color:#5C0D11; color:#fff; font-size:9pt; line-height:21px; cursor:pointer}
`);


$battle.div = $element("div",$id("csp"),[".hvut-bt-div"+(settings.equipEnchantCloseByDefault?" hvut-bt-min":"")]);
$battle.repair_div = $element("div",$battle.div,[".hvut-bt-repair","/<span>[ Loading ]</span><span>...</span>"]);
$battle.inventory_div = $element("div",$battle.div,[".hvut-bt-inventory"," ..."]);
$battle.equip_ul = $element("ul",$battle.div,[".hvut-bt-equip"]);
$battle.item_ul = $element("ul",$battle.div,[".hvut-bt-items"]);
$element("div",$battle.div,[".hvut-bt-toggle"," OPEN / CLOSE"],function(){$battle.div.classList.toggle("hvut-bt-min");});

$battle.init();

}
// [END 0] Battle - Equipment Enchant and Repair */


//* [0] Battle - Modify UI
if(settings.equipEnchantLeftUI) {
	GM_addStyle(
		_query.ss==="ar"?
			`#arena_list {width:350px; margin:20px}
			#arena_list tr:first-child, #arena_list td:nth-child(2), #arena_list td:nth-child(5), #arena_list td:nth-child(6), #arena_list td:nth-last-child(2) {display:none}` :
		_query.ss==="rb"?
			`#arena_list {width:350px; margin:20px}
			#arena_list tr:first-child, #arena_list td:nth-child(2), #arena_list td:nth-child(4), #arena_list td:nth-child(5), #arena_list td:nth-last-child(2) {display:none}` :
		_query.ss==="gr"?
			`#grindfest {margin:100px 0}` :
		_query.ss==="iw"?
			`#itemworld_left {margin-top:40px}
			#itemworld_right > div:last-child {position:absolute; margin-top:10px; left:250px}
			.hvut-bt-div {left:180px !important}` :
		""
	);

	if(_query.ss==="ar" || _query.ss==="iw") {
		$battle.div.classList.add("hvut-bt-min");
	}
	if(_query.ss==="rb") {
		$qsa("#arena_list td[colspan='2']").forEach(function(td){
			$element("td",[td.parentNode,td],"Cooldown");
		});
	}
}
// [END 0] Battle - Modify UI */


} else
// Battle


//* [21] Forge - Upgrade
if(settings.upgrade && _query.s==="Forge" && _query.ss==="up" && $id("equip_extended")) {

_up.exp = {"Low":1,"Mid":5,"High":20,"Wispy":3,"Diluted":13,"Regular":25,"Robust":63,"Vibrant":125,"Coruscating":250};

_up.material = {
"Legendary":[
[0,6,0,"Robust"],[0,6,0,"Robust"],[0,6,0,"Robust"],[0,6,0,"Robust"],[0,6,0,"Robust"],
[0,5,1,"Robust"],[0,5,1,"Robust"],[0,5,1,"Robust"],[0,4,2,"Robust"],[0,4,2,"Robust"],
[0,4,2,"Robust"],[0,4,2,"Robust"],[0,3,3,"Robust"],[0,3,3,"Vibrant"],[0,3,3,"Vibrant"],
[0,3,3,"Vibrant"],[0,2,4,"Vibrant"],[0,2,4,"Vibrant"],[0,2,4,"Vibrant"],[0,2,4,"Vibrant"],
[0,1,5,"Vibrant"],[0,1,5,"Vibrant"],[0,1,5,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],
[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],
[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],
[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],
[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],
[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"],[0,0,6,"Coruscating"]
],
"Legendary_100":{12:8,20:12,28:17,36:21,42:23
},
"Magnificent":[
[2,4,0,"Regular"],[2,4,0,"Regular"],[2,4,0,"Regular"],[2,4,0,"Regular"],[2,4,0,"Regular"],
[1,5,0,"Regular"],[1,5,0,"Regular"],[1,5,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],
[0,6,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Robust"],[0,6,0,"Robust"],
[0,5,1,"Robust"],[0,5,1,"Robust"],[0,5,1,"Robust"],[0,4,2,"Robust"],[0,4,2,"Robust"],
[0,4,2,"Robust"],[0,4,2,"Robust"],[0,3,3,"Robust"],[0,3,3,"Robust"],[0,3,3,"Robust"],
[0,3,3,"Vibrant"],[0,2,4,"Vibrant"],[0,2,4,"Vibrant"],[0,2,4,"Vibrant"],[0,2,4,"Vibrant"],
[0,1,5,"Vibrant"],[0,1,5,"Vibrant"],[0,1,5,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],
[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],
[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],
[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"],[0,0,6,"Vibrant"]
],
"Magnificent_100":{12:8,26:16,32:18,40:22,48:27,56:31,62:33
},
"Exquisite":[
[4,2,0,"Diluted"],[4,2,0,"Diluted"],[4,2,0,"Diluted"],[4,2,0,"Diluted"],[4,2,0,"Diluted"],
[3,3,0,"Diluted"],[3,3,0,"Diluted"],[3,3,0,"Diluted"],[2,4,0,"Diluted"],[2,4,0,"Diluted"],
[2,4,0,"Diluted"],[2,4,0,"Diluted"],[1,5,0,"Diluted"],[1,5,0,"Regular"],[1,5,0,"Regular"],
[1,5,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],
[0,6,0,"Regular"],[0,6,0,"Regular"],[0,5,1,"Regular"],[0,5,1,"Regular"],[0,5,1,"Regular"],
[0,5,1,"Robust"],[0,4,2,"Robust"],[0,4,2,"Robust"],[0,4,2,"Robust"],[0,4,2,"Robust"],
[0,3,3,"Robust"],[0,3,3,"Robust"],[0,3,3,"Robust"],[0,2,4,"Robust"],[0,2,4,"Robust"],
[0,2,4,"Robust"],[0,2,4,"Robust"],[0,1,5,"Robust"],[0,1,5,"Robust"],[0,1,5,"Robust"],
[0,1,5,"Robust"],[0,0,6,"Robust"],[0,0,6,"Robust"],[0,0,6,"Robust"],[0,0,6,"Robust"],
[0,0,6,"Robust"],[0,0,6,"Robust"],[0,0,6,"Robust"],[0,0,6,"Robust"],[0,0,6,"Robust"]
],
"Exquisite_100":{
},
"Superior":[
[6,0,0,"Wispy"],[6,0,0,"Wispy"],[6,0,0,"Wispy"],[6,0,0,"Wispy"],[6,0,0,"Wispy"],
[5,1,0,"Wispy"],[5,1,0,"Wispy"],[5,1,0,"Wispy"],[4,2,0,"Wispy"],[4,2,0,"Wispy"],
[4,2,0,"Wispy"],[4,2,0,"Wispy"],[3,3,0,"Wispy"],[3,3,0,"Diluted"],[3,3,0,"Diluted"],
[3,3,0,"Diluted"],[2,4,0,"Diluted"],[2,4,0,"Diluted"],[2,4,0,"Diluted"],[2,4,0,"Diluted"],
[1,5,0,"Diluted"],[1,5,0,"Diluted"],[1,5,0,"Diluted"],[0,6,0,"Diluted"],[0,6,0,"Diluted"],
[0,6,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],[0,6,0,"Regular"],
[0,5,1,"Regular"],[0,5,1,"Regular"],[0,5,1,"Regular"],[0,4,2,"Regular"],[0,4,2,"Regular"],
[0,4,2,"Regular"],[0,4,2,"Regular"],[0,3,3,"Regular"],[0,3,3,"Regular"],[0,3,3,"Regular"],
[0,3,3,"Regular"],[0,2,4,"Regular"],[0,2,4,"Regular"],[0,2,4,"Regular"],[0,2,4,"Regular"],
[0,1,5,"Regular"],[0,1,5,"Regular"],[0,1,5,"Regular"],[0,0,6,"Regular"],[0,0,6,"Regular"]
],
"Superior_100":{
}
};

_up.binding = {
"Physical Damage":"Slaughter",
"Physical Hit Chance":"Balance",
"Physical Crit Chance":"Isaac",
"Magical Damage":"Destruction",
"Magical Hit Chance":"Focus",
"Magical Crit Chance":"Friendship",
"Physical Defense":"Protection",
"Magical Defense":"Warding",
"Evade Chance":"the Fleet",
"Block Chance":"the Barrier",
"Parry Chance":"the Nimble",
"Resist Chance":"Negation",
"Elemental Proficiency":"the Elementalist",
"Divine Proficiency":"the Heaven-sent",
"Forbidden Proficiency":"the Demon-fiend",
"Deprecating Proficiency":"the Curse-weaver",
"Supportive Proficiency":"the Earth-walker",
"Fire Spell Damage":"Surtr",
"Cold Spell Damage":"Niflheim",
"Elec Spell Damage":"Mjolnir",
"Wind Spell Damage":"Freyr",
"Holy Spell Damage":"Heimdall",
"Dark Spell Damage":"Fenrir",
"Crushing Mitigation":"Dampening",
"Slashing Mitigation":"Stoneskin",
"Piercing Mitigation":"Deflection",
"Fire Mitigation":"the Fire-eater",
"Cold Mitigation":"the Frost-born",
"Elec Mitigation":"the Thunder-child",
"Wind Mitigation":"the Wind-waker",
"Holy Mitigation":"the Thrice-blessed",
"Dark Mitigation":"the Spirit-ward",
"Strength Bonus":"the Ox",
"Dexterity Bonus":"the Raccoon",
"Agility Bonus":"the Cheetah",
"Endurance Bonus":"the Turtle",
"Intelligence Bonus":"the Fox",
"Wisdom Bonus":"the Owl",
};


_up.calc = function(data,bg) {
	if(data) {
		data.catalyst = {"Wispy":0,"Diluted":0,"Regular":0,"Robust":0,"Vibrant":0,"Coruscating":0};
		data.material = [0,0,0];
		data.forge_exp = 0;
		data.gear_exp = 0;
		data.ul.innerHTML = "";

		if(data.input.validity.valid) {
			data.to = parseInt(data.input.value);
			data.binding = data.to>5 ? data.to-Math.max(5,data.level) : 0;

			var _mat = _up.material[_up.quality],
				to = data.to,
				lv,c,exp;

			while(to > data.level) {
				if(data.max === 100) {
					lv = ( _up.material[_up.quality+"_100"][to] || Math.min( Math.ceil((to-5)/2) +5, 50 ) ) - 1;
					c = to>50?25 : to>25?13 : 0;
				} else {
					lv = to - 1;
					c = lv;
				}

				data.catalyst[_mat[c][3]]++;
				data.material[0] += _mat[lv][0];
				data.material[1] += _mat[lv][1];
				data.material[2] += _mat[lv][2];

				exp = _up.exp[_mat[c][3]] + _up.exp["Low"]*_mat[lv][0] + _up.exp["Mid"]*_mat[lv][1] + _up.exp["High"]*_mat[lv][2];
				data.forge_exp += exp;
				data.gear_exp += Math.ceil(exp/10);

				to--;
			}

			var item,count,stock;

			for(let c in data.catalyst) {
				if(data.catalyst[c]) {
					item = c + " Catalyst";
					count = data.catalyst[c];
					stock = _up.inventory[item] || 0;
					$element("li",data.ul,count>stock?[".hvut-up-nostock"]:null).append(
						$element("span",null,item),
						$element("span",null,count),
						$element("span",null,"("+stock+")")
					);
				}
			}

			["Low","Mid","High"].forEach(function(g,i){
				if(data.material[i]) {
					item = g + "-Grade " + _up.type;
					count = data.material[i];
					stock = _up.inventory[item] || 0;
					$element("li",data.ul,count>stock?[".hvut-up-nostock"]:null).append(
						$element("span",null,item),
						$element("span",null,count),
						$element("span",null,"("+stock+")")
					);
				}
			});

			if(_up.rare && data.to>_up.max) {
				count = data.to - _up.max;
				stock = _up.inventory[_up.rare] || 0;
				$element("li",data.ul,count>stock?[".hvut-up-nostock"]:null).append(
					$element("span",null,_up.rare),
					$element("span",null,count),
					$element("span",null,"("+stock+")")
				);
			}

			if(data.binding) {
				item = "Binding of " + data.binding_type;
				count = data.binding;
				stock = _up.inventory[item] || 0;
				$element("li",data.ul,count>stock?[".hvut-up-nostock"]:null).append(
					$element("span",null," B. "+data.binding_type),
					$element("span",null,count),
					$element("span",null,"("+stock+")")
				);
			}

			data.valid = true;

		} else {
			data.valid = false;
		}
	}
	if(bg) {
		return;
	}

	var catalyst = {"Wispy":0,"Diluted":0,"Regular":0,"Robust":0,"Vibrant":0,"Coruscating":0},
		material = [0,0,0],
		binding = {},
		max = 0,
		forge_exp = 0,
		gear_exp = 0,
		cost = 0,
		valid = true,
		prices = $prices.get("Upgrade");
	_up.require = {catalyst,material,binding};

	_up.list.forEach(function(data){
		if(!data.to || data.to===data.level) {
			return;
		}
		if(!data.valid) {
			valid = false;
			return;
		}

		for(let c in catalyst) {
			catalyst[c] += data.catalyst[c];
		}

		material[0] += data.material[0];
		material[1] += data.material[1];
		material[2] += data.material[2];

		if(data.binding) {
			binding[data.binding_type] = data.binding;
		}

		if(max < data.to) {
			max = data.to;
		}

		forge_exp += data.forge_exp;
		gear_exp += data.gear_exp;
	});

	var eq = _up.equip;
	if(eq.info.soulbound) {
		gear_exp *= 2;
	}
	var tier = eq.info.tier,
		pxp2 = eq.info.pxp2,
		pxp1 = eq.info.pxp1 + gear_exp;
	while(tier<10 && pxp1>=pxp2) {
		tier++;
		pxp1 -= pxp2;
		pxp2 = Math.ceil(eq.info.pxp * Math.pow(1+eq.info.pxp/1000,tier));
	}

	var frag = $element(),
		item,count,stock,price;

	$element("li",frag,["!font-weight:bold"]).append(
		$element("span",null,"item"),
		$element("span",null,"	required"),
		$element("span",null,"	stock"),
		$element("span",null,"	price")
	);

	for(let c in catalyst) {
		if(catalyst[c]) {
			item = c + " Catalyst";
			count = catalyst[c];
			stock = _up.inventory[item] || 0;
			price = prices[item] || 0;
			cost += count * price;
			$element("li",frag,count>stock?[".hvut-up-nostock"]:null).append(
				$element("span",null,item),
				$element("span",null,"	"+count),
				$element("span",null,"	("+stock+")"),
				$element("span",null,"	"+price)
			);
		}
	}

	["Low","Mid","High"].forEach(function(g,i){
		if(material[i]) {
			item = g + "-Grade " + _up.type;
			count = material[i];
			stock = _up.inventory[item] || 0;
			price = prices[item] || 0;
			cost += count * price;
			$element("li",frag,count>stock?[".hvut-up-nostock"]:null).append(
				$element("span",null,item),
				$element("span",null,"	"+count),
				$element("span",null,"	("+stock+")"),
				$element("span",null,"	"+price)
			);
		}
	});

	if(_up.rare && max>_up.max) {
		item = _up.rare;
		count = max - _up.max;
		stock = _up.inventory[item] || 0;
		price = prices[item] || 0;
		cost += count * price;
		$element("li",frag,count>stock?[".hvut-up-nostock"]:null).append(
			$element("span",null,item),
			$element("span",null,"	"+count),
			$element("span",null,"	("+stock+")"),
			$element("span",null,"	"+price)
		);
	}

	for(let b in binding) {
		item = "Binding of " + b;
		count = binding[b];
		stock = _up.inventory[item] || 0;
		price = prices[item] || 0;
		cost += count * price;
		$element("li",frag,count>stock?[".hvut-up-nostock"]:null).append(
			$element("span",null,"B. "+b),
			$element("span",null,"	"+count),
			$element("span",null,"	("+stock+")"),
			$element("span",null,"	"+price)
		);
	}

	_up.node.ul.innerHTML = "";

	$element("li",_up.node.ul).append(
		$element("span",null,"Forge EXP"),
		$element("span",null,forge_exp.toLocaleString())
	);

	$element("li",_up.node.ul,[".hvut-up-right"]).append(
		$element("span",null,"Gear Potency"),
		$element("span",null,gear_exp.toLocaleString()),
		$element("span",null,tier+(tier<10?" ("+pxp1+ " / "+pxp2+")":" (MAX)"))
	);

	$element("li",_up.node.ul,[".hvut-up-right","!border-bottom:1px solid;margin-bottom:3px;padding-bottom:3px"]).append(
		$element("span",null,"Total Cost"),
		$element("span",null,cost.toLocaleString())
	);

	_up.node.ul.appendChild(frag);

	if($qs(".hvut-up-nostock",_up.node.ul)) {
		valid = false;
	}
	_up.node.upgrade.disabled = !valid;

	return valid;
};

_up.upgrade = function() {
	if(!_up.calc() || !confirm("Are you sure you wish to upgrade this equipment?")) {
		return;
	}
	_up.node.upgrade.disabled = true;

	var total = 0,
		done = 0;

	_up.list.forEach(function(data){
		if(!data.to) {
			return;
		}
		total += (data.to - data.level);
		for(let level=data.level;level<data.to;level++) {
			$ajax.send("POST",location.href,"select_item="+_up.equip.info.eid+"&upgrade_stat="+data.id,function(){_up.node.upgrade.value=++done+" / "+total;if(done===total){alert("Completed!\n\nReload the page.");}});
		}
	});
	_up.node.upgrade.value = "0 / " + total;
};

_up.catalyst = function() {
	var list = {},
		buy_count = 0;
	for(let c in _up.require.catalyst) {
		let item = c + " Catalyst",
			count = _up.require.catalyst[c] - (_up.inventory[item]||0);
		if(count > 0) {
			list[item] = {count};
			buy_count++;
		}
	}
	if(!buy_count || !confirm("Are you sure you wish to purchase Catalysts?")) {
		return;
	}

	_up.node.catalyst.disabled = true;
	$ajax.send("GET","/?s=Bazaar&ss=is",null,function(r){
		var html = r.responseText,
			storetoken = /<input type="hidden" name="storetoken" value="(\w+)"/.test(html) && RegExp.$1,
			credits = /var current_credits = (\d+)/.test(html) && parseInt(RegExp.$1),
			reg = /itemshop\.set_item\('shop_pane',(\d+),(\d+),(\d+)/,
			sum = 0;

		Array.from( substring(html,["<table",0,'<div id="shop_pane"'],["</table>",true],true).firstElementChild.rows ).forEach(function(tr){
			var exec = reg.exec(tr.cells[0].firstElementChild.getAttribute("onclick")),
				item = tr.cells[0].textContent.trim(),
				id = exec[1],
				price = parseInt(exec[3]);

			if(list[item]) {
				list[item].id = id;
				list[item].price = price;
				sum += list[item].count * price;
			}
		});
		if(sum > credits) {
			alert("You do not have enough credits.");
			_up.node.catalyst.disabled = false;
			return;
		}

		for(let i in list) {
			$ajax.send("POST","/?s=Bazaar&ss=is","storetoken="+storetoken+"&select_mode=shop_pane&select_item="+list[i].id+"&select_count="+list[i].count,function(){
				if(!--buy_count) {
					_up.load_inventory();
				}
			});
		}
	});
};

_up.load_inventory = function() {
	_up.inventory = {};
	$ajax.send("GET","/?s=Character&ss=it",null,function(r){
		Array.from( substring(r.responseText,'<table class="nosel itemlist">',["</table>",true],true).firstElementChild.rows ).forEach(function(tr){
			_up.inventory[ tr.cells[0].textContent.trim() ] = parseInt(tr.cells[1].textContent);
		});
		_up.node.catalyst.disabled = false;
		_up.list.forEach(e=>_up.calc(e,true));
		_up.calc();
	});
};


GM_addStyle(`
	#leftpane {width:380px !important}
	#forge_outer + div > a[href*='?s=Forge&ss=up&filter='] {margin-right:646px}
	#leftpane > div:not(#equip_extended), #leftpane > div:not(#equip_extended) div {width:auto !important}
	.hvut-up-div {position:absolute; top:200px; left:400px; width:325px; border-top:3px double}
	.hvut-up-ul {margin:0; padding:0; width:345px; height:390px; overflow:auto; list-style:none; font-size:10pt; text-align:right}
	.hvut-up-input {width:50px; text-align:right}
	.hvut-up-input:invalid {box-shadow:0 0 2px 1px #f00}
	.hvut-up-sub {display:none; position:absolute; top:40px; left:400px}
	.hvut-up-table {border-spacing:0}
	.hvut-up-table tr:hover {background-color:#ffc}
	.hvut-up-table tr:hover .hvut-up-sub {display:block}
	.hvut-up-table td:first-child {width:150px !important}
	.hvut-up-ul > li {width:320px}
	.hvut-up-ul > li::after {content:''; display:block; clear:both}
	.hvut-up-nostock {color:#c00}
	.hvut-up-ul span:nth-child(1) {float:left; width:140px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
	.hvut-up-ul span:nth-child(2) {float:left; width:60px}
	.hvut-up-ul span:nth-child(3) {float:left; width:60px}
	.hvut-up-ul span:nth-child(4) {float:left; width:60px; color:#900}
	.hvut-up-ul .hvut-up-right > span:last-child {float:right; width:auto}
`);

_up.node = {};
_up.node.table = $id("rightpane").children[1].firstElementChild;
_up.node.table.classList.add("hvut-up-table");
_up.node.div = $element("div",$id("rightpane"),[".hvut-up-div"]);
_up.node.upgrade = $element("input",_up.node.div,{type:"button",value:"Upgrade ALL",tabIndex:-1,style:"margin:5px 25px"},_up.upgrade);
_up.node.catalyst = $element("input",_up.node.div,{type:"button",value:"Buy Catalysts",tabIndex:-1,style:"margin:5px 25px"},_up.catalyst);
_up.node.ul = $element("ul",_up.node.div,[".hvut-up-ul"]);

_up.equip = $equip.parse.layer($id("equip_extended"));
_up.equip.info.eid = $qs("input[name=select_item]").value;
$equip.parse.pxp(_up.equip);

_up.max = 0;
_up.type = ({"One-handed Weapon":"Metals","Two-handed Weapon":"Metals","Staff":"Wood","Shield":"Wood","Cloth Armor":"Cloth","Light Armor":"Leather","Heavy Armor":"Metals"})[_up.equip.info.category];
_up.rare = ({"Phase":"Crystallized Phazon","Shade":"Shade Fragment","Power":"Repurposed Actuator","Force Shield":"Defense Matrix Modulator"})[_up.equip.info.type];

_up.list = Array.from(_up.node.table.rows).map(function(tr){
	var data = {
		name : tr.cells[0].textContent,
		level : parseInt(tr.cells[1].textContent),
	};
	data.binding_type = _up.binding[data.name];
	data.td = $element("td",tr);
	data.input = $element("input",data.td,{type:"number",className:"hvut-up-input",value:data.level||"",min:data.level},{change:function(){_up.calc(data);}});
	data.ul = $element("ul",data.td,[".hvut-up-sub hvut-up-ul"]);

	if(_up.max < data.level) {
		_up.max = data.level;
	}

	data.id = (/'costpane_(\w+)'/).test(tr.getAttribute("onmouseout")) && RegExp.$1;
	data.max = (data.name==="Physical Damage" || data.name==="Magical Damage") ? 100 : 50;
	data.input.max = data.max;

	var costpane = $id("costpane_"+data.id);
	if(costpane.children[1]) {
		$qsa("tr",costpane.children[1]).forEach(function(tr_){
			var exec = /^(?:(.+) Catalyst|Binding of (.+)|(?:High|Mid|Low)-Grade (.+)|(Crystallized Phazon|Shade Fragment|Repurposed Actuator|Defense Matrix Modulator))  x$/.exec(tr_.cells[0].textContent.trim());

			if(!_up.quality && exec[1]) {
				var quality;
				if(data.max === 100) {
					quality = data.level<25 ? {"Wispy":"Superior","Diluted":"Exquisite","Regular":"Magnificent","Robust":"Legendary"} : data.level<50 ? {"Diluted":"Superior","Regular":"Exquisite","Robust":"Magnificent","Vibrant":"Legendary"} : {"Regular":"Superior","Robust":"Exquisite","Vibrant":"Magnificent","Coruscating":"Legendary"};
				} else {
					quality = data.level<13 ? {"Wispy":"Superior","Diluted":"Exquisite","Regular":"Magnificent","Robust":"Legendary"} : data.level<25 ? {"Diluted":"Superior","Regular":"Exquisite","Robust":"Magnificent","Vibrant":"Legendary"} : {"Regular":"Superior","Robust":"Exquisite","Vibrant":"Magnificent","Coruscating":"Legendary"};
				}
				_up.quality = quality[exec[1]];
			}
		});
	}

	return data;
});

_up.load_inventory();

} else
// [END 21] Forge - Upgrade */


//* [23] Forge - Salvage
if(settings.salvage && _query.s==="Forge" && _query.ss==="sa") {

$element("div",$id("rightpane"),[" This will permanently destroy the item","!margin-top:30px;font-size:12pt;font-weight:bold;color:#c00"]);

if($id("salvage_button")) {
	confirm_event($id("salvage_button").parentNode,"click","Are you sure you want to salvage this item?",()=>$id("salvage_button").src.match(/salvage\.png$/));
}

} else
// [END 23] Forge - Salvage */

{} // END OF [else if]; DO NOT REMOVE THIS LINE!


/***** [SUBMENU] *****/


// Sort Equipment List
if(_query.s==="Forge" && $id("item_pane")) {
	$equip.list($id("item_pane"), (_query.ss==="re"||_query.ss==="up"||_query.ss==="en")&&(_query.filter==="equipped"||!_query.filter)?0:1 );
}


/***** [END] *****/


/***** [BATTLE] *****/
} else if($id("battle_top")) {

	if(settings.randomEncounter) {
		if($id("textlog").tBodies[0].lastElementChild.textContent === "Initializing random encounter ...") {
			$re.check();
		}
	}
	setValue("url",location.href);

	location.href = "/?s=Battle";
	//window.history.pushState(null,null,"/?s=Battle");

} else if($id("riddleform")) {
	setValue("url",location.href);

	location.href = "/?s=Battle";
	//window.history.pushState(null,null,"/?s=Battle");


/***** [GALLERY] *****/
} else if(location.hostname === "e-hentai.org") {

	if(settings.randomEncounter) {
		$re.init();

		let link,onclick;
		if((link=$qs("#eventpane a")) && (onclick=link.getAttribute("onclick")) && (/\?s=Battle&ss=ba&encounter=([A-Za-z0-9=]+)/).test(onclick)) {
			$re.json.date = Date.now();
			$re.json.key = RegExp.$1;
			$re.json.count++;
			$re.json.clear = false;
			$re.set();
			if(settings.reGalleryAlt) {
				onclick = onclick.replace("https://hentaiverse.org","http://alt.hentaiverse.org");
			}
			onclick = onclick.replace("','_hentaiverse'","&date="+$re.json.date+"','_hentaiverse'");
			link.setAttribute("onclick",onclick);
		}
		if(settings.reGallery && $id("nb")) {
			$re.clock( $element("a",$element("div",$id("nb")),["!display:inline-block;width:70px;text-align:left;cursor:pointer"]) );
		}
	}

}


// END

