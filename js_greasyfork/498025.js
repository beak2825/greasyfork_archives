// ==UserScript==
// @name         GGn Equipment Repair
// @namespace    https://greasyfork.org/
// @version      0.3
// @license      MIT
// @description  Repair broken equipment on GGn
// @author       drlivog
// @match        https://gazellegames.net/user.php?action=equipment*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498025/GGn%20Equipment%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/498025/GGn%20Equipment%20Repair.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

//API_KEY needs Item Permission
let API_KEY = '';
const LOG_DEBUG = GM_getValue('debug', false);
const CRITICAL_PERIOD = GM_getValue('critical', 7*24*60*60);

const API_TIME_PERIOD = 10; //time over which API calls are reset (in seconds)
const API_CALL_LIMIT = 5; //number of calls allowed per period

//<------ DO NOT EDIT BELOW THIS LINE ------>

//Global variables to hold items updated by async API calls
let equipped, equippable, inventory;

//Global variable to hold apicall time log for rate limiter
let apicalls = [];

//sleep function to wait for api calls to load
const sleep = ms => new Promise(r => setTimeout(r, ms));

// prettier-ignore
//Taken from FinalDoom Quick Crafter, thank you for making such a nice looking list.
var INGREDIENTS = {
    46: { name: 'Obsidian Plate Armor', image: 'static/common/items/Cover/Armor/2_black.png', category: 'Equipment', gold: 600, infStock: true },
    66: { name: 'Upload Potion Sampler', image: 'static/common/items/Items/Potions/sample_green.png', category: 'Stat potions', gold: 2500, infStock: true },
    72: { name: 'IRC Voice (2 Weeks)', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 10000, infStock: true },
    98: { name: 'Small Upload Potion', image: 'static/common/items/Items/Potions/small_green.png', category: 'Stat potions', gold: 5000, infStock: true },
    99: { name: 'Upload Potion', image: 'static/common/items/Items/Potions/green.png', category: 'Stat potions', gold: 10000, infStock: true },
    100: { name: 'Large Upload Potion', image: 'static/common/items/Items/Potions/large_green.png', category: 'Stat potions', gold: 25000, infStock: true },
    104: { name: 'Download-Reduction Potion Sampler', image: 'static/common/items/Items/Potions/sample_red.png', category: 'Stat potions', gold: 3000, infStock: true },
    105: { name: 'Small Download-Reduction Potion', image: 'static/common/items/Items/Potions/small_red.png', category: 'Stat potions', gold: 6000, infStock: true },
    106: { name: 'Download-Reduction Potion', image: 'static/common/items/Items/Potions/red.png', category: 'Stat potions', gold: 12000, infStock: true },
    107: { name: 'Large Download-Reduction Potion', image: 'static/common/items/Items/Potions/large_red.png', category: 'Stat potions', gold: 30000, infStock: true },
    111: { name: 'Purple Angelica Flowers', image: 'static/common/items/Items/Plants/angelica_flowers.png', category: 'Crafting Materials', gold: 2000, infStock: true },
    112: { name: 'Head of Garlic', image: 'static/common/items/Items/Plants/garlic.png', category: 'Crafting Materials', gold: 1000, infStock: false },
    113: { name: 'Yellow Hellebore Flower', image: 'static/common/items/Items/Plants/hellebore_flower.png', category: 'Crafting Materials', gold: 2500, infStock: true },
    114: { name: 'Black Elderberries', image: 'static/common/items/Items/Plants/black_elder_berries.png', category: 'Crafting Materials', gold: 2000, infStock: true },
    115: { name: 'Black Elder Leaves', image: 'static/common/items/Items/Plants/black_elder_leaves.png', category: 'Crafting Materials', gold: 1600, infStock: true },
    116: { name: 'Emerald', image: 'static/common/items/Items/Gems/emerald.png', category: 'Crafting Materials', gold: 10000, infStock: true },
    120: { name: 'Green Onyx Gem', image: 'static/common/items/Items/Gems/green_onyx.png', category: 'Crafting Materials', gold: 20000, infStock: true },
    121: { name: 'Flawless Amethyst', image: 'static/common/items/Items/Gems/flawless_amethyst.png', category: 'Crafting Materials', gold: 200000, infStock: true },
    124: { name: 'Vial', image: 'static/common/items/Items/Vials/vial.png', category: 'Crafting Materials', gold: 1000, infStock: true },
    125: { name: 'Test Tube', image: 'static/common/items/Items/Vials/test_tube.png', category: 'Crafting Materials', gold: 400, infStock: true },
    126: { name: 'Bowl', image: 'static/common/items/Items/Vials/bowl.png', category: 'Crafting Materials', gold: 1500, infStock: true },
    127: { name: 'Garlic Tincture', image: 'static/common/items/Items/Plants/garlic_tincture.png', category: 'Crafting Materials', gold: 2000, infStock: true },
    175: { name: 'IRC Voice (2 Weeks) - Low Cost Option', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 5000, infStock: true },
    1987: { name: 'Pile of Sand', image: 'static/common/items/Items/Vials/sand.png', category: 'Crafting Materials', gold: 250, infStock: true },
    1988: { name: 'Glass Shards', image: 'static/common/items/Items/Vials/shards.png', category: 'Crafting Materials', gold: 275, infStock: true },
    2130: { name: "Monarch's Crown", image: 'static/common/items/Cover/Helmet/Helmet__Style_11_Yellow.png', category: 'Equipment', gold: 1500, infStock: true },
    2135: { name: "Lucky Deity's Wings", image: 'static/common/items/Cover/Wings/White_Angel_Wings.png', category: 'Equipment', gold: 2000, infStock: true },
    2153: { name: "Farore's Flame", image: 'static/common/items/Items/Bling/flame_green.png', category: 'Crafting Materials', gold: 150000, infStock: false },
    2154: { name: "Nayru's Flame", image: 'static/common/items/Items/Bling/flame_blue.png', category: 'Crafting Materials', gold: 150000, infStock: false },
    2155: { name: "Din's Flame", image: 'static/common/items/Items/Bling/flame_red.png', category: 'Crafting Materials', gold: 150000, infStock: false },
    2212: { name: 'IRC Voice (8 Weeks)', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 20000, infStock: true },
    2225: { name: 'Bronze Alloy Mix', image: 'static/common/items/Items/Ore/bronze.png', category: 'Crafting Materials', gold: 1000, infStock: false },
    2226: { name: 'Iron Ore', image: 'static/common/items/Items/Ore/iron.png', category: 'Crafting Materials', gold: 2000, infStock: false },
    2227: { name: 'Gold Ore', image: 'static/common/items/Items/Ore/gold.png', category: 'Crafting Materials', gold: 3500, infStock: false },
    2228: { name: 'Mithril Ore', image: 'static/common/items/Items/Ore/mithril.png', category: 'Crafting Materials', gold: 5500, infStock: false },
    2229: { name: 'Adamantium Ore', image: 'static/common/items/Items/Ore/adamantium.png', category: 'Crafting Materials', gold: 16000, infStock: false },
    2230: { name: 'Quartz Dust', image: 'static/common/items/Items/Ore/quartz.png', category: 'Crafting Materials', gold: 1250, infStock: false },
    2231: { name: 'Jade Dust', image: 'static/common/items/Items/Ore/jade.png', category: 'Crafting Materials', gold: 2500, infStock: false },
    2232: { name: 'Amethyst Dust', image: 'static/common/items/Items/Ore/amethyst.png', category: 'Crafting Materials', gold: 8000, infStock: false },
    2233: { name: 'Lump of Coal', image: 'static/common/items/Items/Ore/coal.png', category: 'Crafting Materials', gold: 1250, infStock: true },
    2234: { name: 'Lump of Clay', image: 'static/common/items/Items/Ore/clay.png', category: 'Crafting Materials', gold: 150, infStock: true },
    2235: { name: 'Bronze Bar', image: 'static/common/items/Items/Ore/bronze_bar.png', category: 'Crafting Materials', gold: 2000, infStock: false },
    2236: { name: 'Impure Bronze Bar', image: 'static/common/items/Items/Ore/impure_bronze_bar.png', category: 'Crafting Materials', gold: 1150, infStock: false },
    2237: { name: 'Iron Bar', image: 'static/common/items/Items/Ore/iron_bar.png', category: 'Crafting Materials', gold: 4000, infStock: false },
    2238: { name: 'Steel Bar', image: 'static/common/items/Items/Ore/steel_bar.png', category: 'Crafting Materials', gold: 4500, infStock: false },
    2239: { name: 'Gold Bar', image: 'static/common/items/Items/Ore/gold_bar.png', category: 'Crafting Materials', gold: 7000, infStock: false },
    2240: { name: 'Mithril Bar', image: 'static/common/items/Items/Ore/mithril_bar.png', category: 'Crafting Materials', gold: 11000, infStock: false },
    2241: { name: 'Adamantium Bar', image: 'static/common/items/Items/Ore/adamantium_bar.png', category: 'Crafting Materials', gold: 32000, infStock: false },
    2242: { name: 'Quartz Bar', image: 'static/common/items/Items/Ore/quartz_bar.png', category: 'Crafting Materials', gold: 2500, infStock: false },
    2243: { name: 'Jade Bar', image: 'static/common/items/Items/Ore/jade_bar.png', category: 'Crafting Materials', gold: 5000, infStock: false },
    2244: { name: 'Amethyst Bar', image: 'static/common/items/Items/Ore/amethyst_bar.png', category: 'Crafting Materials', gold: 16000, infStock: false },
    2261: { name: 'Impure Bronze Cuirass', image: 'static/common/items/Cover/Body Armor/Impure_Bronze_Cuirass.png', category: 'Equipment', gold: 2300, infStock: false, equipLife: 2592000 },
    2262: { name: 'Bronze Cuirass', image: 'https://ptpimg.me/3mf3lw.png', category: 'Equipment', gold: 4000, infStock: false, equipLife: 2592000 },
    2263: { name: 'Iron Cuirass', image: 'static/common/items/Cover/Body Armor/Iron_Cuirass.png', category: 'Equipment', gold: 16000, infStock: false, equipLife: 2592000 },
    2264: { name: 'Steel Cuirass', image: 'static/common/items/Cover/Body Armor/Steel_Cuirass.png', category: 'Equipment', gold: 18000, infStock: false, equipLife: 2592000 },
    2265: { name: 'Gold Cuirass', image: 'static/common/items/Cover/Body Armor/Gold_Cuirass.png', category: 'Equipment', gold: 28000, infStock: false, equipLife: 2592000 },
    2266: { name: 'Mithril Cuirass', image: 'static/common/items/Cover/Body Armor/Mithril_Cuirass.png', category: 'Equipment', gold: 55000, infStock: false, equipLife: 2592000 },
    2267: { name: 'Adamantium Cuirass', image: 'static/common/items/Cover/Body Armor/Adamantium_Cuirass.png', category: 'Equipment', gold: 160000, infStock: false, equipLife: 2592000 },
    2268: { name: 'Quartz Chainmail', image: 'static/common/items/Cover/Body Armor/Quartz_Chainmail.png', category: 'Equipment', gold: 5000, infStock: false, equipLife: 2592000 },
    2269: { name: 'Jade Chainmail', image: 'static/common/items/Cover/Body Armor/Jade_Chainmail.png', category: 'Equipment', gold: 20000, infStock: false, equipLife: 2592000 },
    2270: { name: 'Amethyst Chainmail', image: 'static/common/items/Cover/Body Armor/Amethyst_Chainmail.png', category: 'Equipment', gold: 80000, infStock: false, equipLife: 2592000 },
    2295: { name: 'Pile of Snow', image: 'static/common/items/Items/Christmas/snow.png', category: 'Crafting Materials', gold: 700, infStock: true },
    2296: { name: 'Snowball', image: 'static/common/items/Items/Christmas/snowball_small.png', category: 'Crafting Materials', gold: 1400, infStock: false },
    2297: { name: 'Candy Cane', image: 'static/common/items/Items/Christmas/candycane.png', category: 'Crafting Materials', gold: 1000, infStock: true },
    2298: { name: 'Hot Chocolate', image: 'static/common/items/Items/Christmas/hotchoc.png', category: 'Stat potions', gold: 5500, infStock: false },
    2299: { name: 'Peppermint Hot Chocolate', image: 'static/common/items/Items/Christmas/peremint_hotchoc.png', category: 'Stat potions', gold: 6500, infStock: false },
    2300: { name: 'Pile of Charcoal', image: 'static/common/items/Items/Christmas/charcoal.png', category: 'Crafting Materials', gold: 5000, infStock: true },
    2303: { name: 'Hyper Realistic Eggnog', image: 'static/common/items/Items/Christmas/eggnog.png', category: 'Stat potions', gold: 5500, infStock: false },
    2305: { name: 'Large Snowball', image: 'static/common/items/Items/Christmas/snowball.png', category: 'Crafting Materials', gold: 4200, infStock: false },
    2306: { name: 'Carrot', image: 'static/common/items/Items/Christmas/carrot.png', category: 'Crafting Materials', gold: 3500, infStock: true },
    2307: { name: 'Snowman', image: 'static/common/items/Items/Christmas/snowman.png', category: 'Stat potions', gold: 27500, infStock: false },
    2321: { name: 'Gold Power Gloves', image: 'static/common/items/Cover/Gloves/Power_Gloves.png', category: 'Equipment', gold: 105000, infStock: true, equipLife: 2592000 },
    2323: { name: 'Ruby', image: 'static/common/items/Items/Gems/ruby.png', category: 'Crafting Materials', gold: 25000, infStock: true },
    2333: { name: 'Gazelle Pet', image: 'static/common/items/Cover/Pets/gazelle.png', category: 'Equipment', gold: 12000, infStock: false },
    2357: { name: 'The Golden Daedy', image: 'static/common/items/Items/Card/Staff_The_Golden_Daedy.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2358: { name: 'A Wild Artifaxx', image: 'static/common/items/Items/Card/Staff_A_Wild_Artifaxx.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2359: { name: 'A Red Hot Flamed', image: 'static/common/items/Items/Card/Staff_A_Red_Hot_Flamed.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2361: { name: 'Alpaca Out of Nowhere!', image: 'static/common/items/Items/Card/Staff_Alpaca_Out_of_Nowhere.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2364: { name: "thewhale's Kiss", image: 'static/common/items/Items/Card/Staff_thewhales_Kiss.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2365: { name: "Stump's Banhammer", image: 'static/common/items/Items/Card/Staff_Stumps_Banhammer.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2366: { name: "Neo's Ratio Cheats", image: 'static/common/items/Items/Card/Staff_Neos_Ratio_Cheats.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2367: { name: "Niko's Transformation", image: 'static/common/items/Items/Card/Staff_Nikos_Transformation.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2368: { name: 'lepik le prick', image: 'static/common/items/Items/Card/Staff_lepik_le_prick.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2369: { name: 'The Golden Throne', image: 'static/common/items/Items/Card/Staff_The_Golden_Throne.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2370: { name: 'The Biggest Banhammer', image: 'static/common/items/Items/Card/Staff_The_Biggest_Banhammer.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2371: { name: 'The Staff Beauty Parlor', image: 'static/common/items/Items/Card/Staff_The_Staff_Beauty_Parlor.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2372: { name: 'The Realm of Staff', image: 'static/common/items/Items/Card/Staff_The_Realm_of_Staff.png', category: 'Trading Cards', gold: 35000, infStock: false },
    2373: { name: 'Cake', image: 'static/common/items/Items/Card/Portal_Cake.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2374: { name: 'GLaDOS', image: 'static/common/items/Items/Card/Portal_GLaDOS.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2375: { name: 'Companion Cube', image: 'static/common/items/Items/Card/Portal_Companion_Cube.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2376: { name: 'Portal Gun', image: 'static/common/items/Items/Card/Portal_Portal_Gun.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2377: { name: 'A Scared Morty', image: 'static/common/items/Items/Card/Portal_A_Scared_Morty.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2378: { name: 'Rick Sanchez', image: 'static/common/items/Items/Card/Portal_Rick_Sanchez.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2379: { name: 'Mr. Poopy Butthole', image: 'static/common/items/Items/Card/Portal_Mr_Poopy_Butthole.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2380: { name: "Rick's Portal Gun", image: 'static/common/items/Items/Card/Portal_Ricks_Portal_Gun.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2381: { name: 'Nyx class Supercarrier', image: 'static/common/items/Items/Card/Portal_Nyx_class_Supercarrier.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2382: { name: 'Chimera Schematic', image: 'static/common/items/Items/Card/Portal_Chimera_Schematic.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2383: { name: 'Covetor Mining Ship', image: 'static/common/items/Items/Card/Portal_Covetor_Mining_Ship.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2384: { name: 'Space Wormhole', image: 'static/common/items/Items/Card/Portal_Space_Wormhole.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2385: { name: 'Interdimensional Portal', image: 'static/common/items/Items/Card/Portal_Interdimensional_Portal.png', category: 'Trading Cards', gold: 35000, infStock: false },
    2388: { name: "MuffledSilence's Headphones", image: 'static/common/items/Items/Card/Staff_MuffledSilences_Headphones.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2390: { name: 'Mario', image: 'static/common/items/Items/Card/Mario_Mario.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2391: { name: 'Luigi', image: 'static/common/items/Items/Card/Mario_Luigi.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2392: { name: 'Princess Peach', image: 'static/common/items/Items/Card/Mario_Princess_Peach.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2393: { name: 'Toad', image: 'static/common/items/Items/Card/Mario_Toad.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2394: { name: 'Yoshi', image: 'static/common/items/Items/Card/Mario_Yoshi.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2395: { name: 'Bowser', image: 'static/common/items/Items/Card/Mario_Bowser.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2396: { name: 'Goomba', image: 'static/common/items/Items/Card/Mario_Goomba.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2397: { name: 'Koopa Troopa', image: 'static/common/items/Items/Card/Mario_Koopa_Troopa.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2398: { name: 'Wario', image: 'static/common/items/Items/Card/Mario_Wario.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2400: { name: 'LinkinsRepeater Bone Hard Card', image: 'static/common/items/Items/Card/Staff_LinkinsRepeater_Bone_Hard_Card.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2401: { name: 'Super Mushroom', image: 'static/common/items/Items/Card/Mario_Super_Mushroom.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2402: { name: 'Fire Flower', image: 'static/common/items/Items/Card/Mario_Fire_Flower.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2403: { name: 'Penguin Suit', image: 'static/common/items/Items/Card/Mario_Penguin_Suit.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2404: { name: 'Goal Pole', image: 'static/common/items/Items/Card/Mario_Goal_Pole.png', category: 'Trading Cards', gold: 35000, infStock: false },
    2410: { name: 'Zé do Caixão Coffin Joe Card', image: 'static/common/items/Items/Card/Staff_Ze_do_Caixao_Coffin_Joe_Card.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2421: { name: "Din's Lootbox", image: 'static/common/items/Items/Pack/Dins_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
    2433: { name: 'Small Luck Potion', image: 'static/common/items/Items/Potions/small_purple.png', category: 'Buffs', gold: 5000, infStock: false },
    2434: { name: 'Large Luck Potion', image: 'static/common/items/Items/Potions/large_purple.png', category: 'Buffs', gold: 14000, infStock: false },
    2436: { name: 'Glass Shards x2', image: 'static/common/items/Items/Vials/shards.png', category: 'Crafting Materials', gold: 550, infStock: true },
    2437: { name: 'Glass Shards x3', image: 'static/common/items/Items/Vials/shards.png', category: 'Crafting Materials', gold: 825, infStock: true },
    2438: { name: 'Random Lvl2 Staff Card', image: 'static/common/items/Items/Pack/Random_Lvl2_Staff_Card.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2465: { name: "Farore's Lootbox", image: 'static/common/items/Items/Pack/Farores_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
    2466: { name: "Nayru's Lootbox", image: 'static/common/items/Items/Pack/Nayrus_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
    2468: { name: 'Random Lootbox (Din, Farore, or Nayru)', image: 'static/common/items/Items/Pack/Random_Lootbox.png', category: 'Special Items', gold: 150000, infStock: false },
    2508: { name: 'Dwarven Gem', image: 'static/common/items/Items/Gems/dwarven_gem.png', category: 'Crafting Materials', gold: 100000, infStock: false },
    2509: { name: 'Bronze Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_bronze.png', category: 'Equipment', gold: 35000, infStock: true },
    2510: { name: 'Iron Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_iron.png', category: 'Equipment', gold: 70000, infStock: false },
    2511: { name: 'Gold Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_gold.png', category: 'Equipment', gold: 122500, infStock: false },
    2512: { name: 'Sand Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_sand.png', category: 'Equipment', gold: 10000, infStock: true },
    2513: { name: 'Mithril Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_mithril.png', category: 'Equipment', gold: 192500, infStock: false },
    2515: { name: 'Adamantium Dwarf Companion', image: 'static/common/items/Cover/Pets/dwarf_adamantium.png', category: 'Equipment', gold: 560000, infStock: false },
    2524: { name: 'Green IRC Slime Pet', image: 'static/common/items/Cover/Pets/slime_green.png', category: 'Equipment', gold: 50000, infStock: true },
    2525: { name: 'Blue IRC Slime Pet', image: 'static/common/items/Cover/Pets/slime_blue.png', category: 'Equipment', gold: 25000, infStock: true },
    2537: { name: 'Carbon-Crystalline Quartz', image: 'static/common/items/Items/Gems/carbonquartz.png', category: 'Crafting Materials', gold: 3750, infStock: false },
    2538: { name: 'Carbon-Crystalline Quartz Necklace', image: 'static/common/items/Cover/Jewelry/crystalline.png', category: 'Equipment', gold: 4000, infStock: false },
    2539: { name: 'Silver Ring of Gazellia', image: 'static/common/items/Cover/Jewelry/silvering.png', category: 'Equipment', gold: 1000, infStock: true },
    2540: { name: 'Quartz Loop of Luck', image: 'static/common/items/Cover/Jewelry/quartzringluck.png', category: 'Equipment', gold: 4100, infStock: false },
    2541: { name: 'Jade Loop of Luck', image: 'static/common/items/Cover/Jewelry/jaderingluck.png', category: 'Equipment', gold: 17000, infStock: false },
    2542: { name: 'Amethyst Loop of Luck', image: 'static/common/items/Cover/Jewelry/amethystringluck.png', category: 'Equipment', gold: 67000, infStock: false },
    2543: { name: 'Quartz Loop of Aggression', image: 'static/common/items/Cover/Jewelry/quartzringaggression.png', category: 'Equipment', gold: 4500, infStock: false },
    2544: { name: 'Jade Loop of Aggression', image: 'static/common/items/Cover/Jewelry/jaderingaggression.png', category: 'Equipment', gold: 21000, infStock: false },
    2545: { name: 'Amethyst Loop of Aggression', image: 'static/common/items/Cover/Jewelry/amethystringaggression.png', category: 'Equipment', gold: 79000, infStock: false },
    2546: { name: 'Quartz Loop of Fortune', image: 'static/common/items/Cover/Jewelry/quartzringfortune.png', category: 'Equipment', gold: 6000, infStock: false },
    2547: { name: 'Jade Loop of Fortune', image: 'static/common/items/Cover/Jewelry/jaderingfortune.png', category: 'Equipment', gold: 36000, infStock: false },
    2548: { name: 'Amethyst Loop of Fortune', image: 'static/common/items/Cover/Jewelry/amethystringfortune.png', category: 'Equipment', gold: 124000, infStock: false },
    2549: { name: 'Sapphire', image: 'static/common/items/Items/Gems/sapphire.png', category: 'Crafting Materials', gold: 6000, infStock: true },
    2550: { name: 'Ruby Chip', image: 'static/common/items/Items/Gems/chip_ruby.png', category: 'Crafting Materials', gold: 2500, infStock: true },
    2551: { name: 'Emerald Chip', image: 'static/common/items/Items/Gems/chip_emerald.png', category: 'Crafting Materials', gold: 1000, infStock: true },
    2552: { name: 'Sapphire Chip', image: 'static/common/items/Items/Gems/chip_sapphire.png', category: 'Crafting Materials', gold: 600, infStock: true },
    2554: { name: 'Unity Flame Necklet', image: 'static/common/items/Cover/Jewelry/unityneck.png', category: 'Equipment', gold: 1000000, infStock: false },
    2555: { name: 'Gods Pennant', image: 'static/common/items/Cover/Back/gods_pennant.png', category: 'Equipment', gold: 1000000, infStock: false },
    2556: { name: 'Gods Cradle', image: 'static/common/items/Cover/Helmet/gods_cradle.png', category: 'Equipment', gold: 1000000, infStock: false },
    2563: { name: 'Exquisite Constellation of Rubies', image: 'static/common/items/Items/Jewelry/constellation_ruby.png', category: 'Crafting Materials', gold: 120000, infStock: false },
    2564: { name: 'Exquisite Constellation of Sapphires', image: 'static/common/items/Items/Jewelry/constellation_sapphire.png', category: 'Crafting Materials', gold: 44000, infStock: false },
    2565: { name: 'Exquisite Constellation of Emeralds', image: 'static/common/items/Items/Jewelry/constellation_emerald.png', category: 'Crafting Materials', gold: 60000, infStock: false },
    2566: { name: 'Quartz Prism of Aggression', image: 'static/common/items/Cover/Jewelry/quartzneckaggression.png', category: 'Equipment', gold: 13400, infStock: false },
    2567: { name: 'Quartz Prism of Luck', image: 'static/common/items/Cover/Jewelry/quartzneckluck.png', category: 'Equipment', gold: 11000, infStock: false },
    2568: { name: 'Quartz Prism of Fortune', image: 'static/common/items/Cover/Jewelry/quartzneckfortune.png', category: 'Equipment', gold: 22400, infStock: false },
    2569: { name: 'Jade Trifocal of Aggression', image: 'static/common/items/Cover/Jewelry/jadeneckaggression.png', category: 'Equipment', gold: 40750, infStock: false },
    2570: { name: 'Jade Trifocal of Luck', image: 'static/common/items/Cover/Jewelry/jadeneckluck.png', category: 'Equipment', gold: 32750, infStock: false },
    2571: { name: 'Jade Trifocal of Fortune', image: 'static/common/items/Cover/Jewelry/jadeneckfortune.png', category: 'Equipment', gold: 70750, infStock: false },
    2572: { name: 'Amethyst Totality of Aggression', image: 'static/common/items/Cover/Jewelry/amethystneckaggression.png', category: 'Equipment', gold: 150750, infStock: false },
    2573: { name: 'Amethyst Totality of Luck', image: 'static/common/items/Cover/Jewelry/amethystneckluck.png', category: 'Equipment', gold: 126750, infStock: false },
    2574: { name: 'Amethyst Totality of Fortune', image: 'static/common/items/Cover/Jewelry/amethystneckfortune.png', category: 'Equipment', gold: 240750, infStock: false },
    2579: { name: 'Ruby-Flecked Wheat', image: 'static/common/items/Items/Food/wheat_ruby.png', category: 'Crafting Materials', gold: 1200, infStock: false },
    2580: { name: 'Ruby-Grained Baguette', image: 'static/common/items/Items/Food/baguette_ruby.png', category: 'Buffs', gold: 2400, infStock: false },
    2581: { name: 'Garlic Ruby-Baguette', image: 'static/common/items/Items/Food/garlic_ruby.png', category: 'Buffs', gold: 4500, infStock: false },
    2582: { name: 'Artisan Ruby-Baguette', image: 'static/common/items/Items/Food/artisan_ruby.png', category: 'Buffs', gold: 9500, infStock: false },
    2584: { name: 'Unity Flame Band', image: 'static/common/items/Cover/Jewelry/unityring.png', category: 'Equipment', gold: 850000, infStock: false },
    2585: { name: 'Amethyst', image: 'static/common/items/Items/Gems/amethyst.png', category: 'Crafting Materials', gold: 30000, infStock: true },
    2589: { name: 'Ripe Pumpkin', image: 'static/common/items/Items/Card/Halloween_Ripe_Pumpkin.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2590: { name: 'Rotting Pumpkin', image: 'static/common/items/Items/Card/Halloween_Rotting_Pumpkin.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2591: { name: 'Carved Pumpkin', image: 'static/common/items/Items/Card/Halloween_Carved_Pumpkin.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2592: { name: 'Stormrage Pumpkin', image: 'static/common/items/Items/Card/Halloween_Stormrage_Pumpkin.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2593: { name: 'Russian Pumpkin', image: 'static/common/items/Items/Card/Halloween_Russian_Pumpkin.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2594: { name: 'Green Mario Pumpkin', image: 'static/common/items/Items/Card/Halloween_Green_Mario_Pumpkin.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2595: { name: 'Lame Pumpkin Trio', image: 'static/common/items/Items/Card/Halloween_Lame_Pumpkin_Trio.png', category: 'Trading Cards', gold: 35000, infStock: false },
    2598: { name: 'Ghost Billie', image: 'static/common/items/Cover/Pets/ghost_white.png', category: 'Equipment', gold: 12000, infStock: false },
    2599: { name: 'Ghost Billy', image: 'static/common/items/Cover/Pets/ghost_yellow.png', category: 'Equipment', gold: 120000, infStock: false },
    2600: { name: 'Pumpkin Badge Bits', image: 'static/common/items/Items/Halloween/pumpkin_bits.png', category: 'Stat potions', gold: 2250, infStock: false },
    2601: { name: 'Halloween Pumpkin Badge', image: 'static/common/items/Items/Badges/Halloween_Pumpkin_Badge.png', category: 'User badges', gold: 13500, infStock: false },
    2627: { name: 'Blacksmith Tongs', image: 'static/common/items/Items/Recast/blacksmith_tongs.png', category: 'Crafting Materials', gold: 50, infStock: true },
    2639: { name: 'Dwarven Disco Ball', image: 'static/common/items/Cover/Clothing/disco_ball.png', category: 'Equipment', gold: 900000, infStock: false },
    2641: { name: 'Impure Bronze Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Impure_Bronze_Claymore.png', category: 'Equipment', gold: 2300, infStock: false, equipLife: 2592000 },
    2642: { name: 'Bronze Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Bronze_Claymore.png', category: 'Equipment', gold: 4000, infStock: false, equipLife: 2592000 },
    2643: { name: 'Iron Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Iron_Claymore.png', category: 'Equipment', gold: 16000, infStock: false, equipLife: 2592000 },
    2644: { name: 'Steel Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Steel_Claymore.png', category: 'Equipment', gold: 18000, infStock: false, equipLife: 2592000 },
    2645: { name: 'Gold Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Gold_Claymore.png', category: 'Equipment', gold: 28000, infStock: false, equipLife: 2592000 },
    2646: { name: 'Mithril Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Mithril_Claymore.png', category: 'Equipment', gold: 55000, infStock: false, equipLife: 2592000 },
    2647: { name: 'Adamantium Claymore', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Adamantium_Claymore.png', category: 'Equipment', gold: 160000, infStock: false, equipLife: 2592000 },
    2648: { name: 'Quartz Khopesh', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Quartz_Khopesh.png', category: 'Equipment', gold: 5000, infStock: false, equipLife: 2592000 },
    2649: { name: 'Jade Khopesh', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Jade_Khopesh.png', category: 'Equipment', gold: 20000, infStock: false, equipLife: 2592000 },
    2650: { name: 'Amethyst Khopesh', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Amethyst_Khopesh.png', category: 'Equipment', gold: 80000, infStock: false, equipLife: 2592000 },
    2653: { name: 'Flux', image: 'static/common/items/Items/Recast/flux.png', category: 'Crafting Materials', gold: 50, infStock: true },
    2656: { name: 'Impure Bronze Bar x2', image: 'static/common/items/Items/Ore/impure_bronze_bar.png', category: 'Crafting Materials', gold: 2500, infStock: false },
    2657: { name: 'Iron Bar x2', image: 'static/common/items/Items/Ore/iron_bar.png', category: 'Crafting Materials', gold: 8000, infStock: false },
    2658: { name: 'Steel Bar x2', image: 'static/common/items/Items/Ore/steel_bar.png', category: 'Crafting Materials', gold: 9000, infStock: false },
    2659: { name: 'Gold Bar x2', image: 'static/common/items/Items/Ore/gold_bar.png', category: 'Crafting Materials', gold: 14000, infStock: false },
    2661: { name: 'Mithril Bar x2', image: 'static/common/items/Items/Ore/mithril_bar.png', category: 'Crafting Materials', gold: 22000, infStock: false },
    2662: { name: 'Adamantium Bar x2', image: 'static/common/items/Items/Ore/adamantium_bar.png', category: 'Crafting Materials', gold: 64000, infStock: false },
    2664: { name: 'Jade Bar x2', image: 'static/common/items/Items/Ore/jade_bar.png', category: 'Crafting Materials', gold: 10000, infStock: false },
    2665: { name: 'Amethyst Bar x2', image: 'static/common/items/Items/Ore/amethyst_bar.png', category: 'Crafting Materials', gold: 32000, infStock: false },
    2666: { name: 'Bronze Alloy Mix x2', image: 'static/common/items/Items/Ore/bronze.png', category: 'Crafting Materials', gold: 2000, infStock: false },
    2668: { name: 'Iron Ore x2', image: 'static/common/items/Items/Ore/iron.png', category: 'Crafting Materials', gold: 4000, infStock: false },
    2670: { name: 'Gold Ore x2', image: 'static/common/items/Items/Ore/gold.png', category: 'Crafting Materials', gold: 7000, infStock: false },
    2671: { name: 'Mithril Ore x2', image: 'static/common/items/Items/Ore/mithril.png', category: 'Crafting Materials', gold: 11000, infStock: false },
    2672: { name: 'Adamantium Ore x2', image: 'static/common/items/Items/Ore/adamantium.png', category: 'Crafting Materials', gold: 32000, infStock: false },
    2673: { name: 'Quartz Dust x2', image: 'static/common/items/Items/Ore/quartz.png', category: 'Crafting Materials', gold: 2000, infStock: false },
    2675: { name: 'Jade Dust x2', image: 'static/common/items/Items/Ore/jade.png', category: 'Crafting Materials', gold: 4000, infStock: false },
    2676: { name: 'Amethyst Dust x2', image: 'static/common/items/Items/Ore/amethyst.png', category: 'Crafting Materials', gold: 16000, infStock: false },
    2688: { name: 'Christmas Spices', image: 'static/common/items/Items/Christmas/spices.png', category: 'Crafting Materials', gold: 2600, infStock: true },
    2689: { name: 'Old Scarf & Hat', image: 'static/common/items/Items/Christmas/hatscarf.png', category: 'Crafting Materials', gold: 2500, infStock: true },
    2690: { name: 'Umaro', image: 'static/common/items/Cover/Pets/umaro_white.png', category: 'Equipment', gold: 12000, infStock: false },
    2691: { name: 'Golden Umaro', image: 'static/common/items/Cover/Pets/umaro_yellow.png', category: 'Equipment', gold: 120000, infStock: false },
    2698: { name: 'Perfect Snowball', image: 'static/common/items/Items/Card/Christmas_Perfect_Snowball.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2699: { name: 'Mistletoe', image: 'static/common/items/Items/Card/Christmas_Mistletoe.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2700: { name: 'Santa Suit', image: 'static/common/items/Items/Card/Christmas_Santa_Suit.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2701: { name: 'Abominable Santa', image: 'static/common/items/Items/Card/Christmas_Abominable_Santa.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2702: { name: 'Icy Kisses', image: 'static/common/items/Items/Card/Christmas_Icy_Kisses.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2703: { name: 'Sexy Santa', image: 'static/common/items/Items/Card/Christmas_Sexy_Santa.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2704: { name: 'Christmas Cheer', image: 'static/common/items/Items/Card/Christmas_Christmas_Cheer.png', category: 'Trading Cards', gold: 35000, infStock: false },
    2711: { name: 'Jazz Pants', image: 'static/common/items/Cover/Leg Armor/Jazz_Pants.png', category: 'Equipment', gold: 11000, infStock: true },
    2712: { name: 'Jazzier Pants', image: 'static/common/items/Cover/Leg Armor/Jazzier_Pants.png', category: 'Equipment', gold: 22000, infStock: false },
    2713: { name: 'Disco Pants', image: 'static/common/items/Cover/Leg Armor/Disco_Pants.png', category: 'Equipment', gold: 800000, infStock: false },
    2714: { name: "Devil's Pantaloons", image: 'static/common/items/Cover/Leg Armor/Devils_Pants.png', category: 'Equipment', gold: 1600000, infStock: false },
    2717: { name: 'Emerald-Flecked Wheat', image: 'static/common/items/Items/Food/wheat_emerald.png', category: 'Crafting Materials', gold: 600, infStock: false },
    2718: { name: 'Emerald-Grained Baguette', image: 'static/common/items/Items/Food/bagette_emerald.png', category: 'Buffs', gold: 1200, infStock: false },
    2719: { name: 'Garlic Emerald-Baguette', image: 'static/common/items/Items/Food/garlic_emerald.png', category: 'Buffs', gold: 2500, infStock: false },
    2720: { name: 'Artisan Emerald-Baguette', image: 'static/common/items/Items/Food/artisan_emerald.png', category: 'Buffs', gold: 6000, infStock: false },
    2721: { name: 'Gazellian Emerald-Baguette', image: 'static/common/items/Items/Food/gazellian_emerald.png', category: 'Buffs', gold: 8000, infStock: false },
    2729: { name: 'Empowered Quartz Loop of Luck', image: 'static/common/items/Cover/Jewelry/empoweredquartzringluck.png', category: 'Equipment', gold: 6600, infStock: false, equipLife: 7776000 },
    2730: { name: 'Empowered Jade Loop of Luck', image: 'static/common/items/Cover/Jewelry/empoweredjaderingluck.png', category: 'Equipment', gold: 27000, infStock: false, equipLife: 7776000 },
    2731: { name: 'Empowered Amethyst Loop of Luck', image: 'static/common/items/Cover/Jewelry/empoweredamethystringluck.png', category: 'Equipment', gold: 115000, infStock: false, equipLife: 7776000 },
    2732: { name: 'Empowered Quartz Loop of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredquartzringaggression.png', category: 'Equipment', gold: 7000, infStock: false, equipLife: 7776000 },
    2733: { name: 'Empowered Jade Loop of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredjaderingaggression.png', category: 'Equipment', gold: 31000, infStock: false, equipLife: 7776000 },
    2734: { name: 'Empowered Amethyst Loop of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredamethystringaggression.png', category: 'Equipment', gold: 127000, infStock: false, equipLife: 7776000 },
    2735: { name: 'Empowered Quartz Loop of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredquartzringfortune.png', category: 'Equipment', gold: 8500, infStock: false, equipLife: 7776000 },
    2736: { name: 'Empowered Jade Loop of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredjaderingfortune.png', category: 'Equipment', gold: 46000, infStock: false, equipLife: 7776000 },
    2737: { name: 'Empowered Amethyst Loop of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredamethystringfortune.png', category: 'Equipment', gold: 172000, infStock: false, equipLife: 7776000 },
    2738: { name: 'Empowered Quartz Prism of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredquartzneckaggression.png', category: 'Equipment', gold: 18400, infStock: false, equipLife: 7776000 },
    2739: { name: 'Empowered Quartz Prism of Luck', image: 'static/common/items/Cover/Jewelry/empoweredquartzneckluck.png', category: 'Equipment', gold: 16000, infStock: false, equipLife: 7776000 },
    2740: { name: 'Empowered Quartz Prism of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredquartzneckfortune.png', category: 'Equipment', gold: 27400, infStock: false, equipLife: 7776000 },
    2741: { name: 'Empowered Jade Trifocal of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredjadeneckaggression.png', category: 'Equipment', gold: 55750, infStock: false, equipLife: 7776000 },
    2742: { name: 'Empowered Jade Trifocal of Luck', image: 'static/common/items/Cover/Jewelry/empoweredjadeneckluck.png', category: 'Equipment', gold: 47750, infStock: false, equipLife: 7776000 },
    2743: { name: 'Empowered Jade Trifocal of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredjadeneckfortune.png', category: 'Equipment', gold: 85750, infStock: false, equipLife: 7776000 },
    2744: { name: 'Empowered Amethyst Totality of Aggression', image: 'static/common/items/Cover/Jewelry/empoweredamethystneckaggression.png', category: 'Equipment', gold: 230750, infStock: false, equipLife: 7776000 },
    2745: { name: 'Empowered Amethyst Totality of Luck', image: 'static/common/items/Cover/Jewelry/empoweredamethystneckluck.png', category: 'Equipment', gold: 206750, infStock: false, equipLife: 7776000 },
    2746: { name: 'Empowered Amethyst Totality of Fortune', image: 'static/common/items/Cover/Jewelry/empoweredamethystneckfortune.png', category: 'Equipment', gold: 320750, infStock: false, equipLife: 7776000 },
    2760: { name: 'Dwarven Disco Plate', image: 'static/common/items/Cover/Body Armor/Disco_Plate.png', category: 'Equipment', gold: 800000, infStock: false },
    2761: { name: 'Impure Bronze Segmentata', image: 'static/common/items/Cover/Body Armor/Impure_Bronze_Segmentata.png', category: 'Equipment', gold: 1150, infStock: false },
    2762: { name: 'Bronze Segmentata', image: 'static/common/items/Cover/Body Armor/Bronze_Segmentata.png', category: 'Equipment', gold: 2000, infStock: false },
    2763: { name: 'Iron Segmentata', image: 'static/common/items/Cover/Body Armor/Iron_Segmentata.png', category: 'Equipment', gold: 8000, infStock: false },
    2764: { name: 'Steel Segmentata', image: 'static/common/items/Cover/Body Armor/Steel_Segmentata.png', category: 'Equipment', gold: 9000, infStock: false },
    2765: { name: 'Gold Segmentata', image: 'static/common/items/Cover/Body Armor/Gold_Segmentata.png', category: 'Equipment', gold: 14000, infStock: false },
    2766: { name: 'Mithril Segmentata', image: 'static/common/items/Cover/Body Armor/Mithril_Segmentata.png', category: 'Equipment', gold: 22000, infStock: false },
    2767: { name: 'Adamantium Segmentata', image: 'static/common/items/Cover/Body Armor/Adamantium_Segmentata.png', category: 'Equipment', gold: 64000, infStock: false },
    2772: { name: 'Regenerate', image: 'static/common/items/Items/AdventureClub/attack_meditation.png', category: 'Attacks', gold: 200, infStock: false },
    2774: { name: 'Hypnosis', image: 'static/common/items/Items/AdventureClub/attack_hypnosis.png', category: 'Attacks', gold: 250, infStock: false },
    2775: { name: 'Muddle', image: 'static/common/items/Items/AdventureClub/attack_muddle.png', category: 'Attacks', gold: 250, infStock: false },
    2776: { name: 'Parasite', image: 'static/common/items/Items/AdventureClub/attack_parasite.png', category: 'Attacks', gold: 800, infStock: false },
    2801: { name: '3 Backpack Slots', image: 'static/common/items/Items/AdventureClub/backpack_3.png', category: 'Backpack (IRC)', gold: 300, infStock: false },
    2802: { name: '4 Backpack Slots', image: 'static/common/items/Items/AdventureClub/backpack_4.png', category: 'Backpack (IRC)', gold: 400, infStock: false },
    2803: { name: '6 Backpack Slots', image: 'static/common/items/Items/AdventureClub/backpack_6.png', category: 'Backpack (IRC)', gold: 600, infStock: false },
    2813: { name: 'Scrap', image: 'static/common/items/Items/AdventureClub/craft_scrap.png', category: 'Items', gold: 500, infStock: false },
    2814: { name: 'Cloth', image: 'static/common/items/Items/AdventureClub/craft_cloth.png', category: 'Items', gold: 500, infStock: false },
    2816: { name: 'Hide', image: 'static/common/items/Items/AdventureClub/craft_hide.png', category: 'Items', gold: 500, infStock: false },
    2822: { name: "Can't Believe This Is Cherry", image: 'static/common/items/Items/Birthday/chakefhake.png', category: 'Buffs', gold: 8000, infStock: false },
    2825: { name: '9th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/9th_Birthday_Badge.png', category: 'User badges', gold: 13500, infStock: false },
    2826: { name: 'Lick Badge Bits', image: 'static/common/items/Items/Birthday/licks_bits.png', category: 'Stat potions', gold: 2250, infStock: false },
    2827: { name: '[Au]zelle Pet', image: 'static/common/items/Cover/Pets/gazelle_yellow.png', category: 'Equipment', gold: 120000, infStock: false },
    2829: { name: 'Ripped Gazelle', image: 'static/common/items/Items/Card/Birthday_Ripped_Gazelle.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2830: { name: 'Fancy Gazelle', image: 'static/common/items/Items/Card/Birthday_Fancy_Gazelle.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2831: { name: 'Gamer Gazelle', image: 'static/common/items/Items/Card/Birthday_Gamer_Gazelle.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2833: { name: 'Future Gazelle', image: 'static/common/items/Items/Card/Birthday_Future_Gazelle.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2834: { name: 'Alien Gazelle', image: 'static/common/items/Items/Card/Birthday_Alien_Gazelle.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2835: { name: 'Lucky Gazelle', image: 'static/common/items/Items/Card/Birthday_Lucky_Gazelle.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2836: { name: 'Supreme Gazelle', image: 'static/common/items/Items/Card/Birthday_Supreme_Gazelle.png', category: 'Trading Cards', gold: 35000, infStock: false },
    2841: { name: 'Condensed Light', image: 'static/common/items/Items/AdventureClub/craft_light.png', category: 'Items', gold: 500, infStock: false },
    2842: { name: 'Bottled Ghost', image: 'static/common/items/Items/AdventureClub/craft_bottle_ghost.png.png', category: 'Items', gold: 500, infStock: false },
    2844: { name: 'Glowing Leaves', image: 'static/common/items/Items/AdventureClub/craft_glowing_leaves.png.png', category: 'Items', gold: 50, infStock: false },
    2845: { name: 'Dark Orb', image: 'static/common/items/Items/AdventureClub/attack_darkorb.png', category: 'Attacks', gold: 5000, infStock: false },
    2846: { name: 'Burst of Light', image: 'static/common/items/Items/AdventureClub/attack_burstlight.png', category: 'Attacks', gold: 5000, infStock: false },
    2847: { name: 'Scrappy Gauntlets', image: 'static/common/items/Cover/AdventureClub/scrappy_gauntlets.png', category: 'Items', gold: 2500, infStock: false },
    2849: { name: 'Quartz Lamellar', image: 'static/common/items/Cover/Body Armor/Quartz_Lamellar.png', category: 'Equipment', gold: 2500, infStock: false },
    2850: { name: 'Jade Lamellar', image: 'static/common/items/Cover/Body Armor/Jade_Lamellar.png', category: 'Equipment', gold: 10000, infStock: false },
    2851: { name: 'Amethyst Lamellar', image: 'static/common/items/Cover/Body Armor/Amethyst_Lamellar.png', category: 'Equipment', gold: 32000, infStock: false },
    2852: { name: 'Impure Bronze Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Impure_Bronze_Billhook.png', category: 'Equipment', gold: 1150, infStock: false },
    2853: { name: 'Bronze Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Bronze_Billhook.png', category: 'Equipment', gold: 2000, infStock: false },
    2854: { name: 'Iron Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Iron_Billhook.png', category: 'Equipment', gold: 8000, infStock: false },
    2855: { name: 'Steel Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Steel_Billhook.png', category: 'Equipment', gold: 9000, infStock: false },
    2856: { name: 'Gold Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Gold_Billhook.png', category: 'Equipment', gold: 14000, infStock: false },
    2857: { name: 'Mithril Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Mithril_Billhook.png', category: 'Equipment', gold: 22000, infStock: false },
    2858: { name: 'Adamantium Billhook', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Adamantium_Billhook.png', category: 'Equipment', gold: 64000, infStock: false },
    2859: { name: 'Quartz Guandao', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Quartz_Guandao.png', category: 'Equipment', gold: 2500, infStock: false },
    2860: { name: 'Jade Guandao', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Jade_Guandao.png', category: 'Equipment', gold: 10000, infStock: false },
    2861: { name: 'Amethyst Guandao', image: 'static/common/items/Cover/Two-Handed Melee Weapon/Amethyst_Guandao.png', category: 'Equipment', gold: 32000, infStock: false },
    2862: { name: 'Impure Bronze Armguards', image: 'static/common/items/Cover/Arm Armor/Impure_Bronze_Armguards.png', category: 'Equipment', gold: 1250, infStock: false },
    2863: { name: 'Bronze Armguards', image: 'static/common/items/Cover/Arm Armor/Bronze_Armguards.png', category: 'Equipment', gold: 3250, infStock: false },
    2864: { name: 'Iron Armguards', image: 'static/common/items/Cover/Arm Armor/Iron_Armguards.png', category: 'Equipment', gold: 7250, infStock: false },
    2865: { name: 'Steel Armguards', image: 'static/common/items/Cover/Arm Armor/Steel_Armguards.png', category: 'Equipment', gold: 11750, infStock: false },
    2866: { name: 'Gold Armguards', image: 'static/common/items/Cover/Arm Armor/Gold_Armguards.png', category: 'Equipment', gold: 18750, infStock: false },
    2867: { name: 'Mithril Armguards', image: 'static/common/items/Cover/Arm Armor/Mithril_Armguards.png', category: 'Equipment', gold: 29750, infStock: false, equipLife: 7776000 },
    2868: { name: 'Adamantium Armguards', image: 'static/common/items/Cover/Arm Armor/Adamantium_Armguards.png', category: 'Equipment', gold: 61750, infStock: false, equipLife: 7776000 },
    2892: { name: 'Glowing Ash', image: 'https://ptpimg.me/3i2xd1.png', category: 'Items', gold: 50, infStock: false },
    2893: { name: 'Troll Tooth', image: 'https://ptpimg.me/mrr24x.png', category: 'Items', gold: 50, infStock: false },
    2894: { name: 'Advanced Hide', image: 'https://ptpimg.me/1d6926.png', category: 'Items', gold: 50, infStock: false },
    2900: { name: 'Burning Ash Cloud', image: 'https://ptpimg.me/n7900m.png', category: 'Attacks', gold: 7500, infStock: false },
    2901: { name: 'Troll Tooth Necklace', image: 'https://ptpimg.me/480516.png', category: 'Items', gold: 3500, infStock: false },
    2902: { name: 'Mithril Power Gloves', image: 'https://ptpimg.me/xiq9n9.png', category: 'Equipment', gold: 190000, infStock: false, equipLife: 2592000 },
    2903: { name: 'Adamantium Power Gloves', image: 'https://ptpimg.me/850f5v.png', category: 'Equipment', gold: 305000, infStock: false, equipLife: 2592000 },
    2905: { name: 'Steel Power Gloves', image: 'https://ptpimg.me/oqwww2.png', category: 'Equipment', gold: 37000, infStock: false },
    2906: { name: 'Iron Power Gloves', image: 'https://ptpimg.me/999ex6.png', category: 'Equipment', gold: 22500, infStock: false },
    2907: { name: 'Bronze Power Gloves', image: 'https://ptpimg.me/v98n53.png', category: 'Equipment', gold: 11000, infStock: false },
    2908: { name: 'Impure Bronze Power Gloves', image: 'https://ptpimg.me/9d1e15.png', category: 'Equipment', gold: 4000, infStock: false },
    2915: { name: 'Flame Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Flame_Badge.png', category: 'User badges', gold: 1000000, infStock: false },
    2927: { name: 'Amethyst Dust Dwarf Companion', image: 'https://ptpimg.me/8n1o75.png', category: 'Equipment', gold: 280000, infStock: false },
    2928: { name: 'Jade Dust Dwarf Companion', image: 'https://ptpimg.me/803l8j.png', category: 'Equipment', gold: 87500, infStock: false },
    2929: { name: 'Quartz Dust Dwarf Companion', image: 'https://ptpimg.me/6zl54e.png', category: 'Equipment', gold: 43750, infStock: true },
    2930: { name: "Nayru's Username", image: 'static/common/items/Items/Username/Nayru.png', category: 'Username customizations', gold: 270000, infStock: false },
    2931: { name: "Farore's Username", image: 'static/common/items/Items/Username/Farore.png', category: 'Username customizations', gold: 270000, infStock: false },
    2932: { name: "Din's Username", image: 'static/common/items/Items/Username/Din.png', category: 'Username customizations', gold: 270000, infStock: false },
    2945: { name: 'Bloody Mario', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Bloody_Mario.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2946: { name: "Mommy's Recipe", image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Mommys_Recipe.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2947: { name: 'Memory Boost', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Memory_Boost.png', category: 'Trading Cards', gold: 6660, infStock: false },
    2948: { name: 'Link was here!', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Link_was_here.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2949: { name: 'Gohma Sees You', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Gohma_sees_you.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2950: { name: 'Skultilla the Cake Guard', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Skultilla_the_cake_guard.png', category: 'Trading Cards', gold: 6660, infStock: false },
    2951: { name: 'Who eats whom?', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Who_eats_whom.png', category: 'Trading Cards', gold: 15000, infStock: false },
    2952: { name: 'Cupcake Crumbles', image: 'https://ptpimg.me/ckw9ad.png', category: 'Crafting Materials', gold: 2250, infStock: false },
    2953: { name: 'Halloween Cupcake Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Halloween_Cupcake_Badge.png', category: 'User badges', gold: 13500, infStock: false },
    2969: { name: 'Gingerbread Kitana', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Kitana.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2970: { name: 'Gingerbread Marston', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Marston.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2972: { name: 'Gingerbread Doomslayer', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Doomslayer.png', category: 'Trading Cards', gold: 6500, infStock: false },
    2973: { name: 'Millenium Falcon Gingerbread', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_Millenium_Falcon.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2974: { name: 'Gingerbread AT Walker', image: 'static/common/items/Items/Card/9th_Christmas_Gingerbread_AT_Walker.png', category: 'Trading Cards', gold: 3000, infStock: false },
    2975: { name: 'Mario Christmas', image: 'static/common/items/Items/Card/9th_Christmas_Mario_Christmas.png', category: 'Trading Cards', gold: 6500, infStock: false },
    2976: { name: 'Baby Yoda with Gingerbread', image: 'static/common/items/Items/Card/9th_Christmas_Baby_Yoda.png', category: 'Trading Cards', gold: 14000, infStock: false },
    2986: { name: 'Sonic and Amy', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Sonic_and_Amy.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2987: { name: 'Yoshi and Birdo', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Yoshi_and_Birdo.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2988: { name: 'Kirlia and Meloetta', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Kirlia_and_Meloetta.png', category: 'Trading Cards', gold: 4500, infStock: false },
    2989: { name: 'Aerith and Cloud', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Aerith_and_Cloud.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2990: { name: 'Master Chief and Cortana', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Master_Chief_and_Cortana.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2991: { name: 'Dom and Maria', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Master_Dom_and_Maria.png', category: 'Trading Cards', gold: 4500, infStock: false },
    2992: { name: 'Mr. and Mrs. Pac Man', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Master_Mr_and_Mrs_Pac_Man.png', category: 'Trading Cards', gold: 10000, infStock: false },
    2993: { name: 'Chainsaw Chess', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Chainsaw_Chess.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2994: { name: 'Chainsaw Wizard', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Chainsaw_Wizard.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2995: { name: 'Angelise Reiter', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Angelise_Reiter.png', category: 'Trading Cards', gold: 4500, infStock: false },
    2996: { name: 'Ivy Valentine', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Ivy_Valentine.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2997: { name: 'Jill Valentine', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Jill_Valentine.png', category: 'Trading Cards', gold: 2000, infStock: false },
    2998: { name: 'Sophitia', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Sophitia.png', category: 'Trading Cards', gold: 4500, infStock: false },
    2999: { name: 'Yennefer', image: 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Yennefer.png', category: 'Trading Cards', gold: 10000, infStock: false },
    3000: { name: 'Valentine Sugar Heart', image: 'https://ptpimg.me/82osc2.png', category: 'Stat potions', gold: 500, infStock: false },
    3001: { name: 'Valentine Chocolate Heart', image: 'https://ptpimg.me/gg9293.png', category: 'Stat potions', gold: 500, infStock: false },
    3002: { name: 'Valentine Rose', image: 'https://ptpimg.me/o6mt84.png', category: 'Buffs', gold: 5000, infStock: false },
    3004: { name: 'Special Box', image: 'static/common/items/Items/Valentine2022/special_box.png', category: 'Special Items', gold: 300000, infStock: false },
    3023: { name: 'Exodus Truce', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Exodus_Truce.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3024: { name: 'Gazelle Breaking Bad', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Gazelle_Breaking_Bad.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3025: { name: 'A Fair Fight', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_A_Fair_Fight.png', category: 'Trading Cards', gold: 6500, infStock: false },
    3026: { name: 'Home Sweet Home', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Home_Sweet_Home.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3027: { name: 'Birthday Battle Kart', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_Birthday_Battle_Kart.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3028: { name: 'What an Adventure', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_What_an_Adventure.png', category: 'Trading Cards', gold: 6500, infStock: false },
    3029: { name: 'After Party', image: 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_After_Party.png', category: 'Trading Cards', gold: 15000, infStock: false },
    3031: { name: 'Birthday Leaves (10th)', image: 'https://ptpimg.me/744jj8.png', category: 'Stat potions', gold: 2250, infStock: false },
    3032: { name: '10th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/10th_Birthday_Badge.png', category: 'User badges', gold: 13500, infStock: false },
    3105: { name: 'Cyberpunk 2077', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Cyberpunk_2077.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3106: { name: 'Watch Dogs Legion', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Watch_Dogs_Legion.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3107: { name: 'Dirt 5', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Dirt_5.png', category: 'Trading Cards', gold: 6000, infStock: false },
    3108: { name: 'Genshin Impact', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Genshin_Impact.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3109: { name: 'Animal Crossing', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Animal_Crossing.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3110: { name: 'Gazelle', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Gazelle.png', category: 'Trading Cards', gold: 6000, infStock: false },
    3111: { name: 'Mafia', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2020_Mafia.png', category: 'Trading Cards', gold: 15000, infStock: false },
    3112: { name: 'Christmas Bauble Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Bauble_Badge.png', category: 'User badges', gold: 8000, infStock: false },
    3113: { name: 'Red Crewmate Bauble', image: 'https://ptpimg.me/43o3rh.png', category: 'Crafting Materials', gold: 5000, infStock: false },
    3114: { name: 'Green Crewmate Bauble', image: 'https://ptpimg.me/sm003l.png', category: 'Crafting Materials', gold: 5001, infStock: false },
    3115: { name: 'Cyan Crewmate Bauble', image: 'https://ptpimg.me/r85pwu.png', category: 'Crafting Materials', gold: 5000, infStock: false },
    3117: { name: 'Christmas Impostor Bauble?', image: 'https://ptpimg.me/455r6g.png', category: 'Special Items', gold: 10000, infStock: false },
    3119: { name: 'Broken Bauble Fragment', image: 'https://ptpimg.me/w3544e.png', category: 'Crafting Materials', gold: 2250, infStock: false },
    3120: { name: 'Wilted Four-Leaves Holly', image: 'https://ptpimg.me/nsth09.png', category: 'Crafting Materials', gold: 2250, infStock: false },
    3121: { name: 'Lucky Four-Leaves Holly', image: 'https://ptpimg.me/136074.png', category: 'Buffs', gold: 8000, infStock: false },
    3136: { name: "Cupid's Winged Boots", image: 'https://ptpimg.me/vlk630.png', category: 'Equipment', gold: 160000, infStock: false },
    3143: { name: 'Symbol of Love', image: 'https://ptpimg.me/cf9vfc.png', category: 'Crafting Materials', gold: 100000, infStock: false },
    3144: { name: 'Old Worn Boots', image: 'https://ptpimg.me/66unrh.png', category: 'Crafting Materials', gold: 10000, infStock: true },
    3145: { name: "Cupid's Magical Feather", image: 'https://ptpimg.me/004ho6.png', category: 'Crafting Materials', gold: 21500, infStock: false },
    3146: { name: "Cupid's Winged Boots of Luck", image: 'https://ptpimg.me/1bx3k2.png', category: 'Equipment', gold: 200000, infStock: false, equipLife: 5184000 },
    3147: { name: "Cupid's Winged Boots of Aggression", image: 'https://ptpimg.me/3983q6.png', category: 'Equipment', gold: 200000, infStock: false, equipLife: 5184000 },
    3148: { name: "Cupid's Winged Boots of Fortune", image: 'https://ptpimg.me/mopf18.png', category: 'Equipment', gold: 200000, infStock: false, equipLife: 5184000 },
    3151: { name: 'Bill Rizer', image: 'static/common/items/Items/Card/11th_Birthday_Bill_Rizer.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3152: { name: 'Donkey Kong', image: 'static/common/items/Items/Card/11th_Birthday_Donkey_Kong.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3153: { name: 'Duck Hunt Dog', image: 'static/common/items/Items/Card/11th_Birthday_Duck_Hunt_Dog.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3154: { name: 'Dr. Mario', image: 'static/common/items/Items/Card/11th_Birthday_Dr_Mario.png', category: 'Trading Cards', gold: 10000, infStock: false },
    3155: { name: 'Pit', image: 'static/common/items/Items/Card/11th_Birthday_Pit.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3156: { name: 'Little Mac', image: 'static/common/items/Items/Card/11th_Birthday_Little_Mac.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3157: { name: 'Mega Man', image: 'static/common/items/Items/Card/11th_Birthday_Mega_Man.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3158: { name: 'Link', image: 'static/common/items/Items/Card/11th_Birthday_Link.png', category: 'Trading Cards', gold: 10000, infStock: false },
    3159: { name: 'Pac-Man', image: 'static/common/items/Items/Card/11th_Birthday_Pac_Man.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3160: { name: 'Samus Aran', image: 'static/common/items/Items/Card/11th_Birthday_Samus_Aran.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3161: { name: 'Simon Belmont', image: 'static/common/items/Items/Card/11th_Birthday_Simon_Belmont.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3162: { name: 'Kirby', image: 'static/common/items/Items/Card/11th_Birthday_Kirby.png', category: 'Trading Cards', gold: 10000, infStock: false },
    3163: { name: 'Black Mage', image: 'static/common/items/Items/Card/11th_Birthday_Black_Mage.png', category: 'Trading Cards', gold: 35000, infStock: false },
    3165: { name: '11th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/11th_Birthday_Badge.png', category: 'User badges', gold: 13500, infStock: false },
    3166: { name: 'Party Pipe Badge Bit', image: 'https://ptpimg.me/r6vdr3.png', category: 'Crafting Materials', gold: 2250, infStock: false },
    3218: { name: 'Milk', image: 'https://ptpimg.me/raa068.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3219: { name: 'Cherries', image: 'https://ptpimg.me/x02af9.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3220: { name: 'Grapes', image: 'https://ptpimg.me/351721.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3221: { name: 'Coconuts', image: 'https://ptpimg.me/9c121y.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3222: { name: 'Marshmallows', image: 'https://ptpimg.me/6tl43k.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3223: { name: 'Cocoa beans', image: 'https://ptpimg.me/8h05tu.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3224: { name: 'Vanilla Pods', image: 'https://ptpimg.me/7c4us8.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3225: { name: 'Strawberries', image: 'https://ptpimg.me/gp622c.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3226: { name: '"Grape" Milkshake', image: 'static/common/items/Items/Birthday/grapeshake.png', category: 'Buffs', gold: 0, infStock: false },
    3227: { name: 'Coco-Cooler Milkshake', image: 'static/common/items/Items/Birthday/coconutshake.png', category: 'Buffs', gold: 8000, infStock: false },
    3228: { name: 'Cinnamon Milkshake', image: 'https://ptpimg.me/kl097r.png', category: 'Buffs', gold: 8000, infStock: false },
    3229: { name: 'Rocky Road Milkshake', image: 'https://ptpimg.me/q8634k.png', category: 'Buffs', gold: 11000, infStock: false },
    3230: { name: 'Neapolitan Milkshake', image: 'https://ptpimg.me/fr7433.png', category: 'Buffs', gold: 14000, infStock: false },
    3237: { name: 'Rainbow IRC Slime Pet', image: 'https://ptpimg.me/kh1c5k.png', category: 'Equipment', gold: 100000, infStock: true },
    3241: { name: 'Cinnamon', image: 'https://ptpimg.me/tol70u.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3263: { name: 'Blinky', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Blinky.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3264: { name: 'Halloween Tombstone Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/Halloween2021_Thombstone_Badge.png', category: 'User badges', gold: 15000, infStock: false },
    3265: { name: 'Clyde', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Clyde.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3266: { name: 'Pinky', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Pinky.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3267: { name: 'Inky', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Inky.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3268: { name: 'Ghostbusters', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Ghostbusters.png', category: 'Trading Cards', gold: 6500, infStock: false },
    3269: { name: 'Boo', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_Boo.png', category: 'Trading Cards', gold: 6500, infStock: false },
    3270: { name: 'King Boo', image: 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_King_Boo.png', category: 'Trading Cards', gold: 15000, infStock: false },
    3281: { name: 'Haunted Tombstone Shard', image: 'https://gazellegames.net/static/common/items/Items/Halloween2021/Haunted_Tombstone_Shard.png', category: 'Special Items', gold: 2500, infStock: false },
    3313: { name: 'Snowman Cookie', image: 'static/common/items/Items/Christmas2021/Christmas2021_Snowman_Cookie.png', category: 'Stat potions', gold: 650, infStock: false },
    3322: { name: 'Young Snowman', image: 'static/common/items/Items/Christmas2021/Christmas2021_Young_Snowman.png', category: 'Equipment', gold: 35000, infStock: false },
    3323: { name: 'Frosty Snowman', image: 'static/common/items/Items/Christmas2021/Christmas2021_Frosty_Snowman.png', category: 'Equipment', gold: 70000, infStock: false },
    3324: { name: 'Happy Snowman', image: 'static/common/items/Items/Christmas2021/Christmas2021_Happy_Snowman.png', category: 'Equipment', gold: 170000, infStock: false },
    3325: { name: 'Snowflake', image: 'static/common/items/Items/Christmas2021/Christmas2021_Snowflake.png', category: 'Stat potions', gold: 825, infStock: false },
    3326: { name: 'Penguin Snowglobe', image: 'static/common/items/Items/Christmas2021/Christmas2021_Penguin_Snowglobe.png', category: 'Stat potions', gold: 1375, infStock: false },
    3327: { name: 'Owl Snowglobe', image: 'static/common/items/Items/Christmas2021/Christmas2021_Owl_Snowglobe.png', category: 'Stat potions', gold: 1625, infStock: false },
    3328: { name: 'Santa Claus Is Out There', image: 'static/common/items/Items/Card/Christmas2021_Santa_Claus_Is_Out_There.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3329: { name: 'Back to the Future', image: 'static/common/items/Items/Card/Christmas2021_Back_to_the_Future.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3330: { name: 'Big Lebowski', image: 'static/common/items/Items/Card/Christmas2021_Big_Lebowski.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3331: { name: 'Picard', image: 'static/common/items/Items/Card/Christmas2021_Picard.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3332: { name: 'Braveheart', image: 'static/common/items/Items/Card/Christmas2021_Braveheart.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3333: { name: 'Indy', image: 'static/common/items/Items/Card/Christmas2021_Indy.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3334: { name: 'Gremlins', image: 'static/common/items/Items/Card/Christmas2021_Gremlins.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3335: { name: 'Die Hard', image: 'static/common/items/Items/Card/Christmas2021_Die_Hard.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3336: { name: 'Jurassic Park', image: 'static/common/items/Items/Card/Christmas2021_Jurassic_Park.png', category: 'Trading Cards', gold: 3000, infStock: false },
    3338: { name: 'Mando', image: 'static/common/items/Items/Card/Christmas2021_Mando.png', category: 'Trading Cards', gold: 10000, infStock: false },
    3339: { name: 'Doomguy', image: 'static/common/items/Items/Card/Christmas2021_Doomguy.png', category: 'Trading Cards', gold: 10000, infStock: false },
    3340: { name: 'Grievous', image: 'static/common/items/Items/Card/Christmas2021_Grievous.png', category: 'Trading Cards', gold: 10000, infStock: false },
    3341: { name: 'Have a Breathtaking Christmas', image: 'https://gazellegames.net/static/common/items/Items/Card/Christmas2021_Have_a_Breathtaking_Christmas.png', category: 'Trading Cards', gold: 35000, infStock: false },
    3348: { name: "Cupid's Wings", image: 'static/common/items/Items/Valentine2022/cupids_wings_avatar.png', category: 'Equipment', gold: 10000, infStock: true, equipLife: 7776000 },
    3349: { name: "Cupid's Gold Wings", image: 'static/common/items/Items/Valentine2022/cupids_gold_wings_avatar.png', category: 'Equipment', gold: 36000, infStock: false, equipLife: 7776000 },
    3352: { name: "Cupid's Mithril Wings", image: 'static/common/items/Items/Valentine2022/cupids_mithril_wings_avatar.png', category: 'Equipment', gold: 87000, infStock: false, equipLife: 7776000 },
    3353: { name: "Cupid's Adamantium Wings", image: 'static/common/items/Items/Valentine2022/cupids_adamantium_wings_avatar.png', category: 'Equipment', gold: 239000, infStock: false, equipLife: 7776000 },
    3358: { name: "Valentine's Day 2022 Badge", image: 'static/common/items/Items/Valentine2022/valentines_badge_shop.png', category: 'User badges', gold: 15000, infStock: false },
    3359: { name: 'Rose Petals', image: 'static/common/items/Items/Valentine2022/rose_petals.png', category: 'Crafting Materials', gold: 3750, infStock: false },
    3360: { name: "Cupid's Tiara", image: 'static/common/items/Items/Valentine2022/cupids_tiara.png', category: 'Equipment', gold: 30000, infStock: false },
    3361: { name: "Cupid's Cradle", image: 'static/common/items/Items/Valentine2022/cupids_cradle_avatar.png', category: 'Equipment', gold: 1030000, infStock: false },
    3362: { name: 'Disassembled Adamantium Wings', image: 'static/common/items/Items/Valentine2022/cupids_mithril_wings_avatar.png', category: 'Crafting Materials', gold: 189000, infStock: false },
    3363: { name: 'Disassembled Mithril Wings', image: 'static/common/items/Items/Valentine2022/cupids_gold_wings_avatar.png', category: 'Crafting Materials', gold: 64000, infStock: false },
    3364: { name: 'Disassembled Gold Wings', image: 'static/common/items/Items/Valentine2022/cupids_wings_avatar.png', category: 'Crafting Materials', gold: 23000, infStock: false },
    3365: { name: "Disassembled Cupid's Cradle", image: 'https://ptpimg.me/7itno5.png', category: 'Crafting Materials', gold: 1030000, infStock: false },
    3368: { name: 'IRC Voice (1 Year)', image: 'static/common/items/Items/Buff/irc_voice_cheap.png', category: 'IRC customizations', gold: 130000, infStock: true },
    3369: { name: 'Red Dragon', image: 'https://ptpimg.me/01y295.png', category: 'Equipment', gold: 500000, infStock: false },
    3370: { name: 'Blue Dragon', image: 'https://ptpimg.me/g1t9wq.png', category: 'Equipment', gold: 500000, infStock: false },
    3371: { name: 'Green Dragon', image: 'https://ptpimg.me/eb6p8q.png', category: 'Equipment', gold: 500000, infStock: false },
    3373: { name: 'Gold Dragon', image: 'https://ptpimg.me/39xam3.png', category: 'Equipment', gold: 1000000, infStock: false },
    3378: { name: '12th Birthday Badge', image: 'https://gazellegames.net/static/common/items/Items/Badges/12th_Birthday_Badge.png', category: 'User badges', gold: 15000, infStock: false },
    3379: { name: 'Slice of Birthday Cake', image: 'https://ptpimg.me/880dpt.png', category: 'Crafting Materials', gold: 3000, infStock: false },
    3384: { name: 'Golden Egg', image: 'https://ptpimg.me/vg48o6.png', category: 'Crafting Materials', gold: 1000000, infStock: true },
};

const RECIPES = {
    //Armor
    2261: { name: "Impure Bronze Cuirass", recipe: "EEEEEEEEEEEEEEE0223602261EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2262: { name: "Bronze Cuirass", recipe: "EEEEEEEEEEEEEEE0223502262EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2263: { name: "Iron Cuirass", recipe: "02237EEEEEEEEEE0223702263EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2264: { name: "Steel Cuirass", recipe: "02238EEEEEEEEEE0223802264EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2265: { name: "Gold Cuirass", recipe: "02239EEEEEEEEEE0223902265EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2266: { name: "Mithril Cuirass", recipe: "02240EEEEEEEEEE0224002266EEEEE02240EEEEEEEEEE", requirement: "1" },
    2267: { name: "Adamantium Cuirass", recipe: "02241EEEEEEEEEE0224102267EEEEE02241EEEEEEEEEE", requirement: "1" },
    2268: { name: "Quartz Chainmail", recipe: "EEEEEEEEEEEEEEE0224202268EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2269: { name: "Jade Chainmail", recipe: "02243EEEEEEEEEE0224302269EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2270: { name: "Amethyst Chainmail", recipe: "02244EEEEEEEEEE0224402270EEEEE02244EEEEEEEEEE", requirement: "1" },
    2867: { name: "Mithril Armguards", recipe: "EEEEE02240EEEEEEEEEE02867EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2868: { name: "Adamantium Armguards", recipe: "EEEEE02241EEEEEEEEEE02868EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2321: { name: "Gold Power Gloves", recipe: "EEEEE02323EEEEEEEEEE02321EEEEEEEEEE02239EEEEE", requirement: "1" },
    2902: { name: "Mithril Power Gloves", recipe: "EEEEE02323EEEEEEEEEE02902EEEEEEEEEE02240EEEEE", requirement: "1" },
    2903: { name: "Adamantium Power Gloves", recipe: "EEEEE02323EEEEEEEEEE02903EEEEEEEEEE02241EEEEE", requirement: "1" },
    //Weapons
    2641: { name: "Impure Bronze Claymore", recipe: "EEEEEEEEEEEEEEE0223602641EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2642: { name: "Bronze Claymore", recipe: "EEEEEEEEEEEEEEE0223502642EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2643: { name: "Iron Claymore", recipe: "02237EEEEEEEEEE0223702643EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2644: { name: "Steel Claymore", recipe: "02238EEEEEEEEEE0223802644EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2645: { name: "Gold Claymore", recipe: "02239EEEEEEEEEE0223902645EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2646: { name: "Mithril Claymore", recipe: "02240EEEEEEEEEE0224002646EEEEE02240EEEEEEEEEE", requirement: "1" },
    2647: { name: "Adamantium Claymore", recipe: "02241EEEEEEEEEE0224102647EEEEE02241EEEEEEEEEE", requirement: "1" },
    2648: { name: "Quartz Khopesh", recipe: "EEEEEEEEEEEEEEE0224202648EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2649: { name: "Jade Khopesh", recipe: "02243EEEEEEEEEE0224302649EEEEEEEEEEEEEEEEEEEE", requirement: "1" },
    2650: { name: "Amethyst Khopesh", recipe: "02244EEEEEEEEEE0224402650EEEEE02244EEEEEEEEEE", requirement: "1" },
    //Jewelery
    2543: { name: "Quartz Loop of Aggression", recipe: "EEEEEEEEEEEEEEEEEEEE02732EEEEEEEEEE02242EEEEE", requirement: "2" },
    2546: { name: "Quartz Loop of Fortune", recipe: "EEEEEEEEEEEEEEEEEEEE02735EEEEEEEEEE02242EEEEE", requirement: "2" },
    2540: { name: "Quartz Loop of Luck", recipe: "EEEEEEEEEEEEEEEEEEEE02729EEEEEEEEEE02242EEEEE", requirement: "2" },
    2544: { name: "Jade Loop of Aggression", recipe: "EEEEE02243EEEEEEEEEE02733EEEEEEEEEE02243EEEEE", requirement: "2" },
    2547: { name: "Jade Loop of Fortune", recipe: "EEEEE02243EEEEEEEEEE02736EEEEEEEEEE02243EEEEE", requirement: "2" },
    2541: { name: "Jade Loop of Luck", recipe: "EEEEE02243EEEEEEEEEE02730EEEEEEEEEE02243EEEEE", requirement: "2" },
    2545: { name: "Amethyst Loop of Aggression", recipe: "EEEEE02244EEEEEEEEEE0273402244EEEEE02244EEEEE", requirement: "2" },
    2548: { name: "Amethyst Loop of Fortune", recipe: "EEEEE02244EEEEEEEEEE0273702244EEEEE02244EEEEE", requirement: "2" },
    2542: { name: "Amethyst Loop of Luck", recipe: "EEEEE02244EEEEEEEEEE0273102244EEEEE02244EEEEE", requirement: "2" },
    2566: { name: "Quartz Prism of Aggression", recipe: "EEEEEEEEEEEEEEE022420273802242EEEEEEEEEEEEEEE", requirement: "2" },
    2568: { name: "Quartz Prism of Fortune", recipe: "EEEEEEEEEEEEEEE022420274002242EEEEEEEEEEEEEEE", requirement: "2" },
    2567: { name: "Quartz Prism of Luck", recipe: "EEEEEEEEEEEEEEE022420273902242EEEEEEEEEEEEEEE", requirement: "2" },
    2569: { name: "Jade Trifocal of Aggression", recipe: "EEEEE02243EEEEE022430274102243EEEEEEEEEEEEEEE", requirement: "2" },
    2571: { name: "Jade Trifocal of Fortune", recipe: "EEEEE02243EEEEE022430274302243EEEEEEEEEEEEEEE", requirement: "2" },
    2570: { name: "Jade Trifocal of Luck", recipe: "EEEEE02243EEEEE022430274202243EEEEEEEEEEEEEEE", requirement: "2" },
    2572: { name: "Amethyst Totality of Aggression", recipe: "022440224402244022440274402244EEEEEEEEEEEEEEE", requirement: "2" },
    2574: { name: "Amethyst Totality of Fortune", recipe: "022440224402244022440274602244EEEEEEEEEEEEEEE", requirement: "2" },
    2573: { name: "Amethyst Totality of Luck", recipe: "022440224402244022440274502244EEEEEEEEEEEEEEE", requirement: "2" },
    //Empower
    //2735: { name: "Empowered Quartz Loop of Fortune", recipe: "EEEEEEEEEEEEEEEEEEEE02546EEEEEEEEEE02242EEEEE", requirement: "2" },
    //2732: { name: "Empowered Quartz Loop of Aggression", recipe: "EEEEEEEEEEEEEEEEEEEE02543EEEEEEEEEE02242EEEEE", requirement: "2" },
    //2729: { name: "Empowered Quartz Loop of Luck", recipe: "EEEEEEEEEEEEEEEEEEEE02540EEEEEEEEEE02242EEEEE", requirement: "2" },
    2735: { name: "Empowered Quartz Loop of Fortune", recipe: "EEEEEEEEEEEEEEEEEEEE02735EEEEEEEEEE02242EEEEE", requirement: "2" },
    2732: { name: "Empowered Quartz Loop of Aggression", recipe: "EEEEEEEEEEEEEEEEEEEE02732EEEEEEEEEE02242EEEEE", requirement: "2" },
    2729: { name: "Empowered Quartz Loop of Luck", recipe: "EEEEEEEEEEEEEEEEEEEE02729EEEEEEEEEE02242EEEEE", requirement: "2" },
    //2736: { name: "Empowered Jade Loop of Fortune", recipe: "EEEEE02243EEEEEEEEEE02547EEEEEEEEEE02243EEEEE", requirement: "2" },
    //2733: { name: "Empowered Jade Loop of Aggression", recipe: "EEEEE02243EEEEEEEEEE02544EEEEEEEEEE02243EEEEE", requirement: "2" },
    //2730: { name: "Empowered Jade Loop of Luck", recipe: "EEEEE02243EEEEEEEEEE02541EEEEEEEEEE02243EEEEE", requirement: "2" },
    2736: { name: "Empowered Jade Loop of Fortune", recipe: "EEEEE02243EEEEEEEEEE02736EEEEEEEEEE02243EEEEE", requirement: "2" },
    2733: { name: "Empowered Jade Loop of Aggression", recipe: "EEEEE02243EEEEEEEEEE02733EEEEEEEEEE02243EEEEE", requirement: "2" },
    2730: { name: "Empowered Jade Loop of Luck", recipe: "EEEEE02243EEEEEEEEEE02730EEEEEEEEEE02243EEEEE", requirement: "2" },
    //2737: { name: "Empowered Amethyst Loop of Fortune", recipe: "EEEEE02244EEEEEEEEEE0254802244EEEEE02244EEEEE", requirement: "2" },
    //2734: { name: "Empowered Amethyst Loop of Aggression", recipe: "EEEEE02244EEEEEEEEEE0254502244EEEEE02244EEEEE", requirement: "2" },
    //2731: { name: "Empowered Amethyst Loop of Luck", recipe: "EEEEE02244EEEEEEEEEE0254202244EEEEE02244EEEEE", requirement: "2" },
    2737: { name: "Empowered Amethyst Loop of Fortune", recipe: "EEEEE02244EEEEEEEEEE0273702244EEEEE02244EEEEE", requirement: "2" },
    2734: { name: "Empowered Amethyst Loop of Aggression", recipe: "EEEEE02244EEEEEEEEEE02273402244EEEEE02244EEEEE", requirement: "2" },
    2731: { name: "Empowered Amethyst Loop of Luck", recipe: "EEEEE02244EEEEEEEEEE0273102244EEEEE02244EEEEE", requirement: "2" },
    //2740: { name: "Empowered Quartz Prism of Fortune", recipe: "EEEEEEEEEEEEEEE022420256802242EEEEEEEEEEEEEEE", requirement: "2" },
    //2738: { name: "Empowered Quartz Prism of Aggression", recipe: "EEEEEEEEEEEEEEE022420256602242EEEEEEEEEEEEEEE", requirement: "2" },
    //2739: { name: "Empowered Quartz Prism of Luck", recipe: "EEEEEEEEEEEEEEE022420256702242EEEEEEEEEEEEEEE", requirement: "2" },
    2740: { name: "Empowered Quartz Prism of Fortune", recipe: "EEEEEEEEEEEEEEE022420274002242EEEEEEEEEEEEEEE", requirement: "2" },
    2738: { name: "Empowered Quartz Prism of Aggression", recipe: "EEEEEEEEEEEEEEE022420273802242EEEEEEEEEEEEEEE", requirement: "2" },
    2739: { name: "Empowered Quartz Prism of Luck", recipe: "EEEEEEEEEEEEEEE022420273902242EEEEEEEEEEEEEEE", requirement: "2" },
    //2743: { name: "Empowered Jade Trifocal of Fortune", recipe: "EEEEE02243EEEEE022430257102243EEEEEEEEEEEEEEE", requirement: "2" },
    //2741: { name: "Empowered Jade Trifocal of Aggression", recipe: "EEEEE02243EEEEE022430256902243EEEEEEEEEEEEEEE", requirement: "2" },
    //2742: { name: "Empowered Jade Trifocal of Luck", recipe: "EEEEE02243EEEEE022430257002243EEEEEEEEEEEEEEE", requirement: "2" },
    2743: { name: "Empowered Jade Trifocal of Fortune", recipe: "EEEEE02243EEEEE022430274302243EEEEEEEEEEEEEEE", requirement: "2" },
    2741: { name: "Empowered Jade Trifocal of Aggression", recipe: "EEEEE02243EEEEE022430274102243EEEEEEEEEEEEEEE", requirement: "2" },
    2742: { name: "Empowered Jade Trifocal of Luck", recipe: "EEEEE02243EEEEE022430274202243EEEEEEEEEEEEEEE", requirement: "2" },
    //2746: { name: "Empowered Amethyst Totality of Fortune", recipe: "022440224402244022440257402244EEEEEEEEEEEEEEE", requirement: "2" },
    //2744: { name: "Empowered Amethyst Totality of Aggression", recipe: "022440224402244022440257202244EEEEEEEEEEEEEEE", requirement: "2" },
    //2745: { name: "Empowered Amethyst Totality of Luck", recipe: "022440224402244022440257302244EEEEEEEEEEEEEEE", requirement: "2" }
    2746: { name: "Empowered Amethyst Totality of Fortune", recipe: "022440224402244022440274602244EEEEEEEEEEEEEEE", requirement: "2" },
    2744: { name: "Empowered Amethyst Totality of Aggression", recipe: "022440224402244022440274402244EEEEEEEEEEEEEEE", requirement: "2" },
    2745: { name: "Empowered Amethyst Totality of Luck", recipe: "022440224402244022440274502244EEEEEEEEEEEEEEE", requirement: "2" },
    //Valentines
    3348: { name: "Cupid's Wings", recipe: 'EEEEE02549EEEEEEEEEE03348EEEEEEEEEEEEEEEEEEEE', requirement: 2 },
    3349: { name: "Cupid's Gold Wings", recipe: 'EEEEE02549EEEEEEEEEE03349EEEEEEEEEE02239EEEEE', requirement: 2 },
    3352: { name: "Cupid's Mithril Wings", recipe: '02549EEEEE02549EEEEE03352EEEEEEEEEE02240EEEEE', requirement: 2 },
    3353: { name: "Cupid's Adamantium Wings", recipe: '025490254902549EEEEE03353EEEEEEEEEE02241EEEEE', requirement: 2 },
    //Boots
    3147: { name: "Cupid's Winged Boots of Aggression", recipe: 'EEEEE02551EEEEEEEEEE03147EEEEEEEEEE03145EEEEE', requirement: 2 },
    3148: { name: "Cupid's Winged Boots of Fortune", recipe: 'EEEEE02550EEEEEEEEEE03148EEEEEEEEEE03145EEEEE', requirement: 2 },
    3146: { name: "Cupid's Winged Boots of Luck", recipe: 'EEEEE02552EEEEEEEEEE03146EEEEEEEEEE03145EEEEE', requirement: 2 },
};

(function() {
    'use strict';
    if (GM_getValue('debug', null) === null) GM_setValue('debug', false);
    if (GM_getValue('critical', null) === null) GM_setValue('critical', 7*24*60*60);
    createUI(true);
})();

async function createUI() {
    let node = document.getElementById('equipRepair');
    if (node) node.remove();
    const spacer = document.createElement('br');
    node = document.createElement('div');
    node.id = 'equipRepair';
    node.style='position: relative; align: center; margin-top: 30px; margin-left: auto; margin-right: auto; text-align: center; vertical-align: top; background-color: rgba(19,9,0,.7); max-width: 800px; min-width: 200px; padding: 5px;';
    let expand = document.createElement('span');
    expand.textContent = "⊕";
    expand.title = "Expand";
    expand.style = "float: right; top: 10px; right: 10px; cursor: pointer; font-size: 18px;";
    expand.addEventListener('click', (event) => {
        if (expand.textContent.includes('\u2295')) {
            if (!checkAPIKey()) {
                unsafeWindow.noty({type: 'error', text: "API Key not set properly"});
            }
            populateEquipment(true);
            expand.textContent = "⊖";
            expand.title = "Close";
        } else {
            createUI();
        }
    });
    expand.addEventListener('mouseover', (event) => {
        expand.style = "float: right; top: 10px; right: 10px; font-size: 18px; font-weight: bold; cursor: pointer; text-shadow: -1px -1px 0px black; text-shadow: 1px -1px 0px black; text-shadow: -1px 1px 0px black; text-shadow: 1px 1px 0px black;";
    });
    expand.addEventListener('mouseleave', (event) => {
        expand.style = "float: right; top: 10px; right: 10px; font-size: 18px; cursor: pointer";
    });
    node.append(expand);
    let header = document.createElement('h2');
    header.textContent = "Equipment Repair";
    node.append(header);
    const content = document.querySelector('div#content');
    //content.append(spacer);
    //content.append(spacer.cloneNode());
    content.append(node);
}

const populateEquipment = async () => {
    refreshEquipped(true);
    refreshEquippable(true);
    refreshInventory();

    let count=0;
    while(equipped?.status != 'success' || equippable?.status !='success') {
        await sleep(100);
        count++;
        if (count > 50) {
            debug("This taking too long");
            unsafeWindow.noty({type: 'error', text: "Failed to get Equipment!"});
            return;
        }
    }
    const node = document.getElementById('equipRepair');
    const subnode1 = document.createElement('div');
    const spacer = document.createElement('br');
    subnode1.id = "equipRepairSelect";
    subnode1.style='position: static; vertical-align: top; display: inline-block; height: 100%; width: 50%; top: 0px;';
    //requests were successful, filter items
    let e1 = getEquipmentRepairable2(equippable.response); //Array of Objects
    let e2 = getEquippedRepairable2(equipped.response); //Array of Objects
    debug(e1);
    debug(e2);
    //First Equipped Items
    //subnode1.append(spacer.cloneNode());
    let header = document.createElement('h3');
    header.textContent = "Equipped";
    subnode1.append(header);
    let repairs = [];
    for (let i=0; i<e2.length; i++) {
        if (e2[i].breakTime === "NULL") continue;
        if (repairs.includes(e2[i].equipid)) continue; //avoid duplicate items that take up multiple slots
        let button = document.createElement('button');
        button.style = 'margin: 5px; height: 25px;';
        button.dataset.equipid = e2[i].equipid;
        button.dataset.itemid = e2[i].itemid;
        button.dataset.timeUntilBreak = timeDiff(e2[i].breakTime);
        button.dataset.equipTime = timeDiff(e2[i].equipTime);
        button.dataset.name = e2[i].item.name;
        button.textContent = (e2[i].timeUntilBreak < CRITICAL_PERIOD ? '*':'' ) + decodeHtml(e2[i].item.name).replace("Adamantium", "Ada").replace("Empowered","Emp").replace("Impure","Imp").replace("Aggression", "Agg");
        button.addEventListener('click', displayCraftButton);
        button.title = secondsToDuration(button.dataset.timeUntilBreak);
        //let time = document.createElement('p');
        //time.textContent = " "+secondsToDuration(button.dataset.timeUntilBreak);
        subnode1.append(button);
        //subnode1.append(time);
        //subnode1.append(spacer.cloneNode());
        repairs.push(e2[i].equipid);
    }

    header = document.createElement('h3');
    header.textContent = "Unequipped";
    subnode1.append(header);
    const select = document.createElement('select');
    select.id='equiprepair-unequipped';
    let option = document.createElement('option');
    option.value = "";
    option.disabled = true;
    option.selected = true;
    option.textContent = "Please select Equipment";
    select.append(option);
    for (let j=0; j<e1.length; j++) {
        if (e1[j].timeUntilBreak === "Null") continue;
        option = document.createElement('option');
        option.id='equiprepair-'+e1[j].id;
        option.dataset.equipid = e1[j].id;
        option.dataset.itemid = e1[j].itemid;
        option.dataset.timeUntilBreak = e1[j].timeUntilBreak;
        option.dataset.name = e1[j].item.name;
        option.textContent = (e1[j].timeUntilBreak < CRITICAL_PERIOD ? '*':'' ) + decodeHtml(e1[j].item.name);
        option.value = e1[j].id;
        //let time = document.createElement('p');
        //time.textContent = " "+secondsToDuration(equipment[j].timeUntilBreak);
        select.append(option);
        //node.append(time);
        //node.append(spacer.cloneNode());
    }
    select.addEventListener('change', displayCraftSelect);
    subnode1.append(select);
    subnode1.append(spacer.cloneNode());
    subnode1.append(spacer.cloneNode());
    node.append(subnode1);

    let subnode2 = document.createElement('div');
    subnode2.id = 'equipRepairCraft';
    subnode2.style = 'psoition: relative; display: inline-block; width: 50%; font-size: 15px';

    node.append(subnode2);
};

const displayCraftButton = (event) => {
    const data = event.target.dataset;
    const node = document.getElementById('equipRepairCraft');
    node.replaceChildren();
    let header = document.createElement('h3');
    header.textContent = decodeHtml(data.name);
    node.append(header);
    let btime = document.createElement('p');
    btime.textContent = "Time Left: " + secondsToDuration(data.timeUntilBreak);
    let etime = document.createElement('p');
    if (data.equipTime < 4*60*60) etime.style = 'color: yellow;'; //If equipped for less than 4 hours then set warning color
    etime.textContent = "Equipped for: " + secondsToDuration(data.equipTime);
    node.append(btime);
    node.append(etime);
    let items = unique(recipeToArray(RECIPES[Number(data.itemid)].recipe));
    let canRepair = true;
    for (const [key, value] of Object.entries(items)) {
        let p = document.createElement('p');
        let ing = INGREDIENTS[key];
        if (inventory?.status === 'success') {
            const invAmount = inventoryAmount(key);
            if (invAmount >= value) {
                p.style = "color: green; font-weight: bold;";
            } else {
                p.style = "color: red; font-weight: bold;";
                canRepair = false;
            }
            p.textContent = `${ing.name}: (${invAmount}/${value})`;
        } else {
            p.textContent = `${ing.name}: (${value})`;
        }
        node.append(p);
    }
    let unequip = document.createElement('button');
    unequip.style = "margin: 5px;";
    unequip.textContent = "Unequip";
    unequip.addEventListener('click', (event) => {
        debug('Unequip clicked!');
        if (data.equipTime < 4*60*60) {
            if (!confirm("Equipment has been equipped for less than 4 hours! If unequipped now then 4 hours will be subtracted from equipment time.\nClick OK to confirm unequipping item.")) {
                return false;
            }
        }
        unequip.disabled = true;
        unequipItem(data.equipid)
            .then(x => {
            debug(x);
            unequip.disable = false;
            if (x?.status === 'success') {
                unsafeWindow.noty({ type: 'success', text: `${data.name} was unequipped.` });
                unequip.style.display = 'none';
                repair.style.display = 'inline-block';
                equip.style.display = 'inline-block';
            } else {
                unsafeWindow.noty({ type: 'error', text: `Error unequpping item.` });
            }
        });
    });
    let repair = document.createElement('button');
    repair.style = "margin: 5px;";
    repair.textContent = "Repair";
    repair.style.display = 'none';
    repair.addEventListener('click', (event) => {
        repair.disable = true;
        let recipe = RECIPES[Number(data.itemid)].recipe.replace(data.itemid, `${data.itemid}z${data.equipid}x`);
        getCraftingResult('take', recipe)
            .then( x => {
            debug(x);
            repair.disable = false;
            if (x?.status === 'success') {
                data.equipid = x.response.EquipID; //after repair there will be a new EquipID
                unsafeWindow.noty({ type: 'success', text: `${RECIPES[Number(data.itemid)].name} was crafted successfully.` });
                repair.style.display = 'none';
            } else {
                unsafeWindow.noty({ type: 'error', text: `${RECIPES[Number(data.itemid)].name} crafting failed.` });
            }
        });
    });
    let equip = document.createElement('button');
    equip.style = "margin: 5px;";
    equip.textContent = "Equip";
    equip.style.display = 'none';
    equip.addEventListener('click', (event) => {
        equip.disable = true;
        equipItem(data.equipid).then(x => {
            equip.disable = false;
            if (x?.status === 'success') {
                unsafeWindow.noty({ type: 'success', text: `${data.name} was equipped.` });
                unequip.style.display = 'block';
                repair.style.display = 'none';
                equip.style.display = 'none';
            } else {
                unsafeWindow.noty({ type: 'error', text: `Error equpping item.` });
            }
        });
    });
    node.append(unequip);
    node.append(repair);
    node.append(equip);
    node.append(document.createElement('br'));
    node.append(document.createElement('br'));
    return false;
};

const displayCraftSelect = (event) => {
    const data = document.getElementById('equiprepair-' + event.target.value)?.dataset;
    const node = document.getElementById('equipRepairCraft');
    node.replaceChildren();
    let header = document.createElement('h3');
    header.textContent = decodeHtml(data.name);
    node.append(header);
    let time = document.createElement('p');
    time.textContent = "Time Left: " + secondsToDuration(data.timeUntilBreak);
    node.append(time);
    let items = unique(recipeToArray(RECIPES[Number(data.itemid)].recipe));
    let canRepair = true;
    for (const [key, value] of Object.entries(items)) {
        let p = document.createElement('p');
        let ing = INGREDIENTS[key];
        if (inventory?.status === 'success') {
            const invAmount = inventoryAmount(key);
            if (invAmount >= value) {
                p.style = "color: green; font-weight: bold;";
            } else {
                p.style = "color: red; font-weight: bold;";
                canRepair = false;
            }
            p.textContent = `${ing.name}: (${invAmount}/${value})`;
        } else {
            p.textContent = `${ing.name}: (${value})`;
        }
        node.append(p);
    }
    let repair = document.createElement('button');
    repair.textContent = "Repair";
    repair.dataset.itemid = data.itemid;
    //const craftName = RECIPES[Number(event.target.dataset.itemid)].name;
    repair.addEventListener('click', (event) => {
        repair.disable = true;
        let recipe = RECIPES[Number(data.itemid)].recipe.replace(data.itemid, `${data.itemid}z${data.equipid}x`);
        getCraftingResult('take', recipe)
            .then( x => {
            debug(x);
            repair.disable = false;
            if (x?.status === 'success') {
                unsafeWindow.noty({ type: 'success', text: `${RECIPES[Number(data.itemid)].name} was crafted successfully.` });
                let select = document.getElementById("equiprepair-unequipped");
                select.remove(select.selectedIndex);
                select.selectedIndex = 0;
                node.replaceChildren();
            } else {
                unsafeWindow.noty({ type: 'error', text: `${RECIPES[Number(data.itemid)].name} crafting failed.` });
            }
        });
    });
    node.append(repair);
    node.append(document.createElement('br'));
    node.append(document.createElement('br'));
    return false;
};

function timeDiff(t1, t2=null) {
    const d1 = new Date(t1);
    const d2 = t2 === null ? new Date() : new Date(t2);
    let diff = Math.abs(d1 - d2) / 1000;
    return diff;
}

function secondsToDuration(secs, short=false) {
    const months = Math.floor(secs/(30*24*60*60));
    let timestr = [];
    if (months >= 1) {
        secs -= months*30*24*60*60;
        timestr.push(months + (short ? "mo" : (months>1 ? " months":" month")));
    }
    const weeks = Math.floor(secs/(7*24*60*60));
    if (weeks >= 1) {
        secs -= weeks*7*24*60*60;
        timestr.push(weeks + (short ? "w" : (weeks>1 ? " weeks":" week")));
    }
    const days = Math.floor(secs/(24*60*60));
    if (days >= 1) {
        secs -= days*24*60*60;
        timestr.push(days + (short ? "d" : (days>1 ? " days":" day")));
    }
    const hours = Math.floor(secs/(60*60));
    if (hours >= 1) {
        secs -= hours*60*60;
        timestr.push(hours + (short ? "h" : (hours>1 ? " hours":" hour")));
    }
    const mins = Math.floor(secs/60);
    if (mins >= 1) {
        secs -= mins*60;
        timestr.push(mins + (short ? "mins" : (mins>1 ? " minutes":" minute")));
    }
    secs = Math.floor(secs);
    if (!short && secs >= 1) {
        //timestr.push(secs + (secs>1 ? " seconds":" second"));
    }
    return timestr.join(", ");
}

function getEquipmentRepairable(eqs) {
    const null_value = "Null";
    eqs.sort( function (a,b) { return (b.timeUntilBreak===null_value)-(a.timeUntilBreak===null_value) || a.timeUntilBreak - b.timeUntilBreak; } );
    //const lind = eqs.findLastIndex( (el) => { return el.timeUntilBreak === "0" || el.timeUntilBreak === "Null" } ); //if not found, returns -1. We add +1 to result which will do slice(0) and return full array
    const lind=-1;
    return eqs.slice(lind+1);
}

function getEquipmentRepairable2(eqs) {
    let repairable = [];
    const null_value = "Null";
    eqs.forEach( (el) => {
        if (el.itemid in RECIPES) repairable.push(el);
    });
    return repairable.sort( function (a,b) { return (b.timeUntilBreak===null_value)-(a.timeUntilBreak===null_value) || a.timeUntilBreak - b.timeUntilBreak; } );
}

function getEquippedRepairable(eqs) {
    const null_value = "0000-00-00 00:00:00";
    eqs.sort( function (a,b) { return (b.breakTime===null_value)-(a.breakTime===null_value) || a.breakTime - b.breakTime; } );
    const lind = eqs.findLastIndex( (el) => { return el.breakTime === null_value; } ); //if not found, returns -1. We add +1 to result which will do slice(0) and return full array
    return eqs.slice(lind+1);
}

function getEquippedRepairable2(eqs) {
    let repairable = [];
    const null_value = "0000-00-00 00:00:00";
    eqs.forEach( (el) => {
        if (el.itemid in RECIPES) repairable.push(el);
    });
    return repairable.sort( function (a,b) { return (b.breakTime===null_value)-(a.breakTime===null_value) || a.breakTime - b.breakTime; } );
}

function recipeToArray(recipe) {
    let slots = [];
    for (let i=0; 5*i<recipe.length; i++) {
        //debug(recipe.substring(5*i, 5*(i+1)));
        if (recipe[5*i] === 'E' || recipe[5*i] === 'P') {
            continue;
        }
        slots[i] = Number(recipe.substring(5*i, 5*(i+1)));
    }
    return slots;
}

function inInventory(itemid, amount=1) {
    if (inventory.status != 'success') return null;
    for (let i of inventory.response) {
        if (Number(i.itemid) === Number(itemid)) {
            return Number(i.amount) >= Number(amount);
        }
    }
    return false;
}

function inventoryAmount(itemid) {
    if (inventory.status != 'success') return null;
    for (let i=0; i<inventory.response.length; i++) {
        let item = inventory.response[i];
        if (Number(item.itemid) === Number(itemid)) {
            return Number(item.amount);
        }
    }
    return 0;
}

//Return Object with counts of each unique item.
function unique(arr) {
    var counts = {};
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === undefined || arr[i] === null) continue;
        counts[arr[i]] = 1 + (counts[arr[i]] || 0);
    }
    return counts;
}

//GGn API Functions below
async function getEquippable(includeInfo=false) {
    return apiCall('api.php?request=items&type=users_equippable', {include_info: includeInfo});
}

//helper function to update global variable after api call
async function refreshEquippable(includeInfo=false) {
    equippable = null;
    getEquippable(includeInfo).then( x=> { equippable = x; } );
}

async function getEquipped(includeInfo=false) {
    return apiCall('api.php?request=items&type=users_equipped', {include_info: includeInfo});
}

//helper function to update global variable after api call
async function refreshEquipped(includeInfo=false) {
    equipped = null;
    getEquipped(includeInfo).then( x=> { equipped = x; } );
}

async function getInventory(includeInfo=false, userid=null) {
    return apiCall('api.php?request=items&type=inventory', {include_info: includeInfo, userid: userid});
}

//helper function to update global variable after api call
async function refreshInventory(includeInfo=false, userid=null) {
    inventory = null;
    getInventory(includeInfo, userid).then( x=> { inventory = x; } );
}

async function equipItem(id) {
    return apiCall('api.php?request=items&type=equip', {equipid: id});
}

async function unequipItem(id) {
    return apiCall('api.php?request=items&type=unequip', {equipid: id});
}

async function getCraftingResult(action, recipe) {
    return apiCall('api.php?request=items&type=crafting_result', {action: action, recipe: recipe});
}

//api is the api call to append to base url
//then is the function to call when page loaded, should process json data
//function has rate-limiter built in, will return error if under rate limit
//data should be an object with key, value pairs
async function apiCall(api, data=null) {
    debug(Date.now());
    debug(apicalls);
    if (apicalls.length > 0 && (apicalls[apicalls.length-1] + (API_TIME_PERIOD * 1000)) < Date.now()) {
        apicalls.pop();
    }
    if (apicalls.length >= API_CALL_LIMIT) {
        console.log("[ERROR] Rate Limit");
        unsafeWindow.noty({ type: 'error', text: "Rate Limited Request" });
        return null; //add rate_limit error code here
    }
    apicalls.unshift(Date.now());
    while (apicalls.length > API_CALL_LIMIT || apicalls[apicalls.length-1] + API_TIME_PERIOD * 1000 < Date.now()) {
        apicalls.pop();
    }
    data = (data===null) ? null : new URLSearchParams(data);
    if (data) api+='&' + data.toString();
    debug(api);
    return fetch('https://gazellegames.net/'+ api, {
        method: data ? 'POST':'GET',
        headers: {
            "X-API-Key": API_KEY
        }
    }).then(response=>response.json());
}

function checkAPIKey() {
    if (API_KEY=="" || API_KEY==null) {
        if (GM_getValue("API_KEY")) {
            API_KEY = GM_getValue("API_KEY");
            return true;
        } else {
            const input = window.prompt(`Please input your GGn API key.
    If you don't have one, please generate one from your Edit Profile page: https://gazellegames.net/user.php?action=edit.
    The API key must have "items" permission.`);
            const trimmed = input.trim();
            if (/[a-f0-9]{64}/.test(trimmed)) {
                GM_setValue("API_KEY", trimmed);
                API_KEY = trimmed;
                return true;
            }
            else {
                debug('API key entered is not valid. It must be 64 hex characters 0-9a-f.');
                throw 'No API key found.';
                //return false;
            }
        }
    }
    else if (/[a-f0-9]{64}/.test(API_KEY)) {
        return true;
    } else {
        return false;
    }
}

function debug(s) {
    if (LOG_DEBUG) console.log(s);
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}