// ==UserScript==
// @name         Auction House Tracker
// @namespace    INDO
// @version      1.1
// @description  Track items in AH and see their end price & buck value
// @author       Indochine
// @match        https://www.torn.com/amarket.php*
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://www.torn.com/js/script/lib/jquery-1.8.2.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/js/jquery.dataTables.min.js
// @resource css https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/css/jquery.dataTables.min.css

// @downloadURL https://update.greasyfork.org/scripts/488319/Auction%20House%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/488319/Auction%20House%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;
    const buck_price = 7; //the number of millio0ns per buck - E.G. 7 = 7,000,000
    const CELLPHONE_MODE = $("#auction-house-tabs").width() < 500;
    GM_addStyle(GM_getResourceText("css"));

    const WEAPONS = {
        "9mm Uzi": {category: "Primary", type: "SMG", lowest_stat: 108},
        "AK-47": {category: "Primary", type: "Rifle", lowest_stat: 108},
        "AK74U": {category: "Primary", type: "SMG", lowest_stat: 87},
        "ArmaLite M-15A4": {category: "Primary", type: "Rifle", lowest_stat: 125},
        "Benelli M1 Tactical": {category: "Primary", type: "Shotgun", lowest_stat: 104},
        "Benelli M4 Super": {category: "Primary", type: "Shotgun", lowest_stat: 114},
        "Bushmaster Carbon 15": {category: "Primary", type: "SMG", lowest_stat: 107},
        "Dual Bushmasters": {category: "Primary", type: "SMG", lowest_stat: 123}, //??
        "Dual MP5s": {category: "Primary", type: "SMG", lowest_stat: 124}, //??
        "Dual P90s": {category: "Primary", type: "SMG", lowest_stat: 122}, //??
        "Dual TMPs": {category: "Primary", type: "SMG", lowest_stat: 119}, //??
        "Dual Uzis": {category: "Primary", type: "SMG", lowest_stat: 116}, //??
        "Egg Propelled Launcher": {category: "Primary", type: "Heavy Artillery", lowest_stat: 88}, //??
        "Enfield SA-80": {category: "Primary", type: "Rifle", lowest_stat: 118},
        "Gold Plated AK-47": {category: "Primary", type: "Rifle", lowest_stat: 137},
        "Heckler & Koch SL8": {category: "Primary", type: "Rifle", lowest_stat: 106},
        "Ithaca 37": {category: "Primary", type: "Shotgun", lowest_stat: 111},
        "Jackhammer": {category: "Primary", type: "Shotgun", lowest_stat: 121},
        "M16 A2 Rifle": {category: "Primary", type: "Rifle", lowest_stat: 108},
        "M249 SAW": {category: "Primary", type: "Machine Gun", lowest_stat: 108},
        "M4A1 Colt Carbine": {category: "Primary", type: "Rifle", lowest_stat: 102},
        "Mag 7": {category: "Primary", type: "Shotgun", lowest_stat: 118},
        "Minigun": {category: "Primary", type: "Machine Gun", lowest_stat: 100},
        "MP 40": {category: "Primary", type: "SMG", lowest_stat: 78},
        "MP5 Navy": {category: "Primary", type: "SMG", lowest_stat: 96},
        "MP5k": {category: "Primary", type: "SMG", lowest_stat: 94},
        "Negev NG-5": {category: "Primary", type: "Machine Gun", lowest_stat: 104},
        "Neutrilux 2000": {category: "Primary", type: "Machine Gun", lowest_stat: 84},
        "Nock Gun": {category: "Primary", type: "Shotgun", lowest_stat: 140},
        "P90": {category: "Primary", type: "SMG", lowest_stat: 99},
        "Pink Mac-10": {category: "Primary", type: "SMG", lowest_stat: 119}, //??
        "PKM": {category: "Primary", type: "Machine Gun", lowest_stat: 115},
        "Prototype": {category: "Primary", type: "Machine Gun", lowest_stat: 104}, //??
        "Rheinmetall MG 3": {category: "Primary", type: "Machine Gun", lowest_stat: 102},
        "Sawed-Off Shotgun": {category: "Primary", type: "Shotgun", lowest_stat: 104},
        "SIG 550": {category: "Primary", type: "Rifle", lowest_stat: 112},
        "SIG 552": {category: "Primary", type: "Rifle", lowest_stat: 119},
        "Skorpion": {category: "Primary", type: "SMG", lowest_stat: 94},
        "SKS Carbine": {category: "Primary", type: "Rifle", lowest_stat: 93},
        "Snow Cannon": {category: "Primary", type: "Heavy Artillery", lowest_stat: 76},
        "Steyr AUG": {category: "Primary", type: "Rifle", lowest_stat: 109},
        "Stoner 96": {category: "Primary", type: "Machine Gun", lowest_stat: 118},
        "Tavor TAR-21": {category: "Primary", type: "Rifle", lowest_stat: 117},
        "Thompson": {category: "Primary", type: "SMG", lowest_stat: 82},
        "TMP": {category: "Primary", type: "SMG", lowest_stat: 83},
        "Vektor CR-21": {category: "Primary", type: "Rifle", lowest_stat: 98},
        "XM8 Rifle": {category: "Primary", type: "Rifle", lowest_stat: 106},

        "Beretta 92FS": {category: "Secondary", type: "Pistol", lowest_stat: 99},
        "Beretta M9": {category: "Secondary", type: "Pistol", lowest_stat: 90},
        "Beretta Pico": {category: "Secondary", type: "Pistol", lowest_stat: 107},
        "Blowgun": {category: "Secondary", type: "Piercing", lowest_stat: 54},
        "Blunderbuss": {category: "Secondary", type: "Shotgun", lowest_stat: 70},
        "BT MP9": {category: "Secondary", type: "SMG", lowest_stat: 116},
        "China Lake": {category: "Secondary", type: "Heavy Artillery", lowest_stat: 118},
        "Cobra Derringer": {category: "Secondary", type: "Pistol", lowest_stat: 114},
        "Crossbow": {category: "Secondary", type: "Piercing", lowest_stat: 98},
        "Desert Eagle": {category: "Secondary", type: "Pistol", lowest_stat: 95},
        "Dual 92G Berettas": {category: "Secondary", type: "Pistol", lowest_stat: 94},
        "Fiveseven": {category: "Secondary", type: "Pistol", lowest_stat: 101},
        "Flamethrower": {category: "Secondary", type: "Heavy Artillery", lowest_stat: 106},
        "Flare Gun": {category: "Secondary", type: "Pistol", lowest_stat: 40},
        "Glock 17": {category: "Secondary", type: "Pistol", lowest_stat: 81},
        "Harpoon": {category: "Secondary", type: "Piercing", lowest_stat: 110},
        "Homemade Pocket Shotgun": {category: "Shotgun", type: "Clubbing", lowest_stat: 123},
        "Lorcin 380": {category: "Secondary", type: "Pistol", lowest_stat: 68},
        "Luger": {category: "Secondary", type: "Pistol", lowest_stat: 83},
        "Magnum": {category: "Secondary", type: "Pistol", lowest_stat: 93},
        "Milkor MGL": {category: "Secondary", type: "Heavy Artillery", lowest_stat: 113},
        "Qsz-92": {category: "Secondary", type: "Pistol", lowest_stat: 115},
        "Raven MP25": {category: "Secondary", type: "Pistol", lowest_stat: 81},
        "RPG Launcher": {category: "Secondary", type: "Heavy Artillery", lowest_stat: 116},
        "Ruger 57": {category: "Secondary", type: "Pistol", lowest_stat: 88},
        "S&W M29": {category: "Secondary", type: "Pistol", lowest_stat: 99},
        "S&W Revolver": {category: "Secondary", type: "Pistol", lowest_stat: 96},
        "Slingshot": {category: "Secondary", type: "Clubbing", lowest_stat: 79},
        "SMAW Launcher": {category: "Secondary", type: "Heavy Artillery", lowest_stat: 118},
        "Springfield 1911": {category: "Secondary", type: "Pistol", lowest_stat: 90},
        "Taser": {category: "Secondary", type: "Mechanical", lowest_stat: 55},
        "Taurus": {category: "Secondary", type: "Pistol", lowest_stat: 87},
        "Type 98 Anti Tank": {category: "Secondary", type: "Heavy Artillery", lowest_stat: 103},
        "USP": {category: "Secondary", type: "Pistol", lowest_stat: 102},

        "Axe": {category: "Melee", type: "Clubbing", lowest_stat: 86},
        "Baseball Bat": {category: "Melee", type: "Clubbing", lowest_stat: 73},
        "Blood Spattered Sickle": {category: "Melee", type: "Slashing", lowest_stat: 91},
        "Bo Staff": {category: "Melee", type: "Clubbing", lowest_stat: 68},
        "Bone Saw": {category: "Melee", type: "Slashing", lowest_stat: 106},
        "Bread Knife": {category: "Melee", type: "Slashing", lowest_stat: 106},
        "Bug Swatter": {category: "Melee", type: "Slashing", lowest_stat: 64},//??
        "Butterfly Knife": {category: "Melee", type: "Piercing", lowest_stat: 79},
        "Cattle Prod": {category: "Melee", type: "Mechanical", lowest_stat: 60},
        "Chain Whip": {category: "Melee", type: "Slashing", lowest_stat: 83},
        "Chainsaw": {category: "Melee", type: "Mechanical", lowest_stat: 84},
        "Claymore Sword": {category: "Melee", type: "Slashing", lowest_stat: 106},
        "Cleaver": {category: "Melee", type: "Slashing", lowest_stat: 107},
        "Cricket Bat": {category: "Melee", type: "Clubbing", lowest_stat: 60},
        "Crowbar": {category: "Melee", type: "Clubbing", lowest_stat: 72},
        "Dagger": {category: "Melee", type: "Piercing", lowest_stat: 88},
        "Devil's Pitchfork": {category: "Melee", type: "Piercing", lowest_stat: 102},
        "Diamond Bladed Knife": {category: "Melee", type: "Piercing", lowest_stat: 122},
        "Diamond Icicle": {category: "Melee", type: "Piercing", lowest_stat: 93},
        "Dual Axes": {category: "Melee", type: "Clubbing", lowest_stat: 124},//??
        "Dual Hammers": {category: "Melee", type: "Clubbing", lowest_stat: 124},//??
        "Dual Samurai Swords": {category: "Melee", type: "Slashing", lowest_stat: 124},//??
        "Dual Scimitars": {category: "Melee", type: "Slashing", lowest_stat: 124},//??
        "Duke's Hammer": {category: "Melee", type: "Clubbing", lowest_stat: 73},//??
        "Fine Chisel": {category: "Melee", type: "Piercing", lowest_stat: 66},
        "Flail": {category: "Melee", type: "Clubbing", lowest_stat: 99},
        "Frying Pan": {category: "Melee", type: "Clubbing", lowest_stat: 62},
        "Golden Broomstick": {category: "Melee", type: "Clubbing", lowest_stat: 108},
        "Guandao": {category: "Melee", type: "Slashing", lowest_stat: 98},
        "Hammer": {category: "Melee", type: "Clubbing", lowest_stat: 72},
        "Handbag": {category: "Melee", type: "Clubbing", lowest_stat: 130},//??
        "Ice Pick": {category: "Melee", type: "Piercing", lowest_stat: 111},
        "Ivory Walking Cane": {category: "Melee", type: "Clubbing", lowest_stat: 110},
        "Kama": {category: "Melee", type: "Slashing", lowest_stat: 90},
        "Katana": {category: "Melee", type: "Slashing", lowest_stat: 107},
        "Kitchen Knife": {category: "Melee", type: "Piercing", lowest_stat: 80},
        "Knuckle Dusters": {category: "Melee", type: "Clubbing", lowest_stat: 73},
        "Kodachi": {category: "Melee", type: "Slashing", lowest_stat: 118},
        "Lead Pipe": {category: "Melee", type: "Clubbing", lowest_stat: 59},
        "Leather Bullwhip": {category: "Melee", type: "Slashing", lowest_stat: 79},
        "Macana": {category: "Melee", type: "Piercing", lowest_stat: 122},
        "Madball": {category: "Melee", type: "Clubbing", lowest_stat: 105},
        "Meat Hook": {category: "Melee", type: "Piercing", lowest_stat: 101},
        "Metal Nunchaku": {category: "Melee", type: "Clubbing", lowest_stat: 121},
        "Naval Cutlass": {category: "Melee", type: "Slashing", lowest_stat: 116},
        "Ninja Claws": {category: "Melee", type: "Piercing", lowest_stat: 90},
        "Pair of High Heels": {category: "Melee", type: "Piercing", lowest_stat: 103},
        "Pair of Ice Skates": {category: "Melee", type: "Slashing", lowest_stat: 88},
        "Pen Knife": {category: "Melee", type: "Piercing", lowest_stat: 66},
        "Penelope": {category: "Melee", type: "Clubbing", lowest_stat: 74},//??
        "Petrified Humerus": {category: "Melee", type: "Clubbing", lowest_stat: 96},
        "Pillow": {category: "Melee", type: "Clubbing", lowest_stat: 66},
        "Plastic Sword": {category: "Melee", type: "Clubbing", lowest_stat: 34},
        "Poison Umbrella": {category: "Melee", type: "Piercing", lowest_stat: 84},
        "Riding Crop": {category: "Melee", type: "Slashing", lowest_stat: 75},
        "Rusty Sword": {category: "Melee", type: "Slashing", lowest_stat: 37},
        "Sai": {category: "Melee", type: "Piercing", lowest_stat: 81},
        "Samurai Sword": {category: "Melee", type: "Slashing", lowest_stat: 110},
        "Scalpel": {category: "Melee", type: "Piercing", lowest_stat: 103},//??
        "Scimitar": {category: "Melee", type: "Slashing", lowest_stat: 98},
        "Sledgehammer": {category: "Melee", type: "Clubbing", lowest_stat: 108},
        "Spear": {category: "Melee", type: "Piercing", lowest_stat: 86},
        "Swiss Army Knife": {category: "Melee", type: "Piercing", lowest_stat: 75},
        "Twin Tiger Hooks": {category: "Melee", type: "Piercing", lowest_stat: 103},
        "Wand of Destruction": {category: "Melee", type: "Piercing", lowest_stat: 103},
        "Wooden Nunchaku": {category: "Melee", type: "Clubbing", lowest_stat: 81},
        "Wushu Double Axes": {category: "Melee", type: "Clubbing", lowest_stat: 104},
        "Yasukuni Sword": {category: "Melee", type: "Slashing", lowest_stat: 114},
    };
    const ARMOR_QUALITY = {
        "Assault Boots": 46,
        "Assault Gloves": 46,
        "Assault Helmet": 46,
        "Assault Pants": 46,
        "Assault Body": 46,
        "Bulletproof Vest": 34,
        "Chain Mail": 23,
        "Combat Boots": 38,
        "Combat Gloves": 38,
        "Combat Helmet": 38,
        "Combat Pants": 38,
        "Combat Vest": 38,
        "Delta Boots": 49,
        "Delta Gloves": 49,
        "Delta Gas Mask": 49,
        "Delta Pants": 49,
        "Delta Body": 49,
        "Dune Boots": 44,
        "Dune Gloves": 44,
        "Dune Helmet": 44,
        "Dune Pants": 44,
        "Dune Vest": 44,
        "Construction Helmet": 30,
        "EOD Boots": 55,
        "EOD Gloves": 55,
        "EOD Helmet": 55,
        "EOD Pants": 55,
        "EOD Apron": 55,
        "Flak Jacket": 30,
        "Flexible Body Armor": 42,
        "Full Body Armor": 31,
        "Hazmat Suit": 10,
        "Hiking Boots": 24,
        "Kevlar Gloves": 32,
        "Leather Boots": 20,
        "Leather Gloves": 20,
        "Leather Helmet": 20,
        "Leather Pants": 20,
        "Leather Vest": 20,
        "Liquid Body Armor": 40,
        "Marauder Boots": 52,
        "Marauder Gloves": 52,
        "Marauder Face Mask": 40,
        "Marauder Pants": 52,
        "Marauder Body": 52,
        "Medieval Helmet": 25,
        "Motorcycle Helmet": 30,
        "Outer Tactical Vest": 36,
        "Police Vest": 32,
        "Riot Boots": 45,
        "Riot Gloves": 45,
        "Riot Helmet": 35,
        "Riot Pants": 45,
        "Riot Body": 45,
        "Safety Boots": 30,
        "Sentinel Helmet": 53,
        "Sentinel Apron": 53,
        "Sentinel Pants": 53,
        "Sentinel Gloves": 53,
        "Sentinel Boots": 53,
        "Welding Helmet": 34,
        "WWII Helmet": 34,
        "Vanguard Respirator": 48,
        "Vanguard Body": 48,
        "Vanguard Pants": 48,
        "Vanguard Gloves": 48,
        "Vanguard Boots": 48,
    };
    const BONUS_RANGE = {
        "Demoralized": { "floor": 20, "ceiling": 23 },
        "Freeze": { "floor": 20, "ceiling": 26 },
        "Blindfire": { "floor": 15, "ceiling": 20 },
        "Poisoned": { "floor": 85, "ceiling": 100 },
        "Burning": { "floor": 30, "ceiling": 50 },
        "Lacerate": { "floor": 36, "ceiling": 45 },
        "Severe Burning": { "floor": 100, "ceiling": 100 },
        "Spray": { "floor": 20, "ceiling": 24 },
        "Emasculate": { "floor": 15, "ceiling": 16 },
        "Hazardous": { "floor": 20, "ceiling": 31 },
        "Toxin": { "floor": 30, "ceiling": 39 },

        "Achilles": { "floor": 50, "ceiling": 142 },
        "Assassinate": { "floor": 50, "ceiling": 141 },
        "Backstab": { "floor": 30, "ceiling": 90 },
        "Berserk": { "floor": 20, "ceiling": 60 },
        "Bleed": { "floor": 20, "ceiling": 67 },
        "Blindside": { "floor": 25, "ceiling": 87 },
        "Bloodlust": { "floor": 10, "ceiling": 17 },
        "Comeback": { "floor": 50, "ceiling": 127 },
        "Conserve": { "floor": 25, "ceiling": 49 },
        "Cripple": { "floor": 20, "ceiling": 58 },

        "Crusher": { "floor": 50, "ceiling": 160 },
        "Cupid": { "floor": 50, "ceiling": 160 },
        "Deadeye": { "floor": 25, "ceiling": 118 },
        "Deadly": { "floor": 2, "ceiling": 9 },
        "Disarm": { "floor": 3, "ceiling": 15 },
        "Double Tap": { "floor": 15, "ceiling": 40 },
        "Double-edged": { "floor": 10, "ceiling": 32 },
        "Empower": { "floor": 50, "ceiling": 206 },
        "Eviscerate": { "floor": 15, "ceiling": 32 },
        "Execute": { "floor": 15, "ceiling": 30 },

        "Expose": { "floor": 7, "ceiling": 18 },
        "Finale": { "floor": 10, "ceiling": 13 },
        "Focus": { "floor": 15, "ceiling": 32 },
        "Frenzy": { "floor": 5, "ceiling": 12 },
        "Fury": { "floor": 10, "ceiling": 34 },
        "Grace": { "floor": 20, "ceiling": 60 },
        "Home run": { "floor": 50, "ceiling": 71 },
        "Motivation": { "floor": 15, "ceiling": 35 },
        "Paralyze": { "floor": 5, "ceiling": 10 },

        "Parry": { "floor": 50, "ceiling": 92 },
        "Penetrate": { "floor": 25, "ceiling": 49 },
        "Plunder": { "floor": 20, "ceiling": 49 },
        "Powerful": { "floor": 15, "ceiling": 41 },
        "Proficience": { "floor": 20, "ceiling": 59 },
        "Puncture": { "floor": 20, "ceiling": 51 },
        "Quicken": { "floor": 50, "ceiling": 219 },
        "Rage": { "floor": 4, "ceiling": 16 },
        "Revitalize": { "floor": 10, "ceiling": 24 },
        "Roshambo": { "floor": 50, "ceiling": 132 },

        "Slow": { "floor": 20, "ceiling": 61 },
        "Smurf": { "floor": 1, "ceiling": 4 },
        "Specialist": { "floor": 20, "ceiling": 59 },
        "Stricken": { "floor": 31, "ceiling": 85 },
        "Stun": { "floor": 10, "ceiling": 40 },
        "Suppress": { "floor": 25, "ceiling": 34 },
        "Sure Shot": { "floor": 3, "ceiling": 11 },
        "Throttle": { "floor": 50, "ceiling": 170 },
        "Warlord": { "floor": 15, "ceiling": 37 },
        "Weaken": { "floor": 20, "ceiling": 63 },

        "Wind-up": { "floor": 125, "ceiling": 221 },
        "Wither": { "floor": 20, "ceiling": 57 },
        "Impregnable": { "floor": 20, "ceiling": 27 },
        "Impenetrable": { "floor": 20, "ceiling": 29 },
        "Insurmountable": { "floor": 30, "ceiling": 36 },
        "Invulnerable": { "floor": 4, "ceiling": 14 },
        "Imperviable": { "floor": 2, "ceiling": 9 },
        "Immutable": { "floor": 15, "ceiling": 43 },
        "Impassable": { "floor": 20, "ceiling": 27 },
        "Irrepressible": { "floor": 15, "ceiling": 43 }
    };
    const colorObj = {
        "glow-yellow": {
            "factor": 1,
            "text": "var(--default-yellow-color)",
            "text_bg": "#757947"
        },
        "glow-orange": {
            "factor": 3,
            "text": "#ff6400",
            "text_bg": "#df8400"
        },
        "glow-red": {
            "factor": 9,
            "text": "#d83500",
            "text_bg": "#b85500"
        }
    }
    const statusBtn = {
        "Track": {
            "text": "Track",
            "color": "var(--default-gray-9-color)"},
        "Winning": {
            "text": "Winning",
            "color": "var(--default-green-color)"},
        "Outbid": {
            "text": "Outbid",
            "color": "var(--default-red-color)"},
        "Mine": {
            "text": "Mine",
            "color": "var(--default-blue-color)"},
         "Pinned": {
             "text": "Pinned",
             "color": "var(--default-yellow-color)"}
    }

    const AuctionHouseInterval = setInterval(updateAuctionHouse, 500);
    const WatchListInterval = setInterval(updateWatchList, 500);

    function getItemInfoFromNode($node) {
        const itemObj = {};
        itemObj.auction_id = $node.attr("id");
        itemObj.bg_color = $node.attr("class").replace("tt-hidden", "");
        itemObj.rarity_color = $node.find(".item-cont-wrap .img-wrap .item-plate").attr("class").replace("item-plate", "").trim();
        const $item_hover_node = $node.find(".item-cont-wrap .img-wrap .item-hover");
        itemObj.item_id = $item_hover_node.attr("item");
        itemObj.armoury_id = $item_hover_node.attr("armoury");
        const text = $item_hover_node.children().attr("aria-label");
        const text_arr = text.split(".");
        itemObj.name = text_arr[0].split("(")[0].trim();
        itemObj.end_time = text_arr[text_arr.length - 2].replace("Ends on", "").trim();
        itemObj.timestamp = datestr2ts(itemObj.end_time);
        itemObj.highest_price = text_arr[text_arr.length - 3].trim();
        itemObj.bid_times = text_arr[text_arr.length - 4].replace("bids", "").trim();
        itemObj.high_bidder = text_arr[text_arr.length - 5].replace("High bidder:", "").trim();
        itemObj.item_seller = text_arr[text_arr.length - 6].replace("Item seller:", "").trim();
        itemObj.bonus_text = [];
        itemObj.bonus_name = [];
        itemObj.bonus_value = [];
        itemObj.bonus_value_str = [];
        itemObj.bonus_value_name = [];
        const $bonus_node = $node.find(".item-cont-wrap .item-bonuses .iconsbonuses .bonus-attachment-icons");
        $bonus_node.each(function() {
            const bonus_text = $(this).attr("title");
            // <b>Weaken</b><br/>31% chance to Weaken opponent reducing Defense by 25% (x3)
            // <b>Execute</b><br/>Instantly defeats a target if they're below 16% life
            // <b>Penetrate</b><br/>Ignores 25% of armor mitigation
            // <b>Eviscerate</b><br/>Eviscerates opponent causing them 16% extra damage on further hits
            // <b>Grace</b><br/>23% increased hit chance but 11.5% reduced damage
            // <b>Irradiate</b><br/>Applies radiation sickness upon finishing hit
            const bonus_name = bonus_text.split('>')[1].split('<')[0];
            let bonus_value = "";
            let bonus_value_str = "";
            let bonus_value_name = "";
            if (/\d/.test(bonus_text)) {
                if (bonus_name == "Disarm") { // <b>Disarm</b><br/>Disables an opponent's weapon upon a hand or arm hit for 3 turns
                    bonus_value = bonus_text.split(" turns")[0].split("for ")[1];
                    bonus_value_str = bonus_value + "T";
                    bonus_value_name = bonus_value + "T " + bonus_name;
                }
                else if (/\d+%/.test(bonus_text)) {
                    bonus_value_str = /\d+%/.exec(bonus_text)[0];
                    bonus_value = bonus_value_str.replace("%", "");
                    bonus_value_name = bonus_value_str + bonus_name;
                }            //if (bonus_name == "Irradiate" || bonus_name == "Smash") {
            }
            else {
                bonus_value_name = bonus_name;
            }
            itemObj.bonus_text.push(bonus_text);
            itemObj.bonus_name.push(bonus_name);
            itemObj.bonus_value.push(bonus_value);
            itemObj.bonus_value_str.push(bonus_value_str);
            itemObj.bonus_value_name.push(bonus_value_name);
        });
        if (text.indexOf("Damage:") >= 0) { // weapon
            itemObj.is_weapon = 1;
            itemObj.damage = text_arr[1].replace("Damage:", "").trim() + "." + text_arr[2].trim();
            itemObj.accuracy = text_arr[3].replace("Accuracy:", "").trim() + "." + text_arr[4].trim();
            [itemObj.category, itemObj.type, itemObj.quality_value] = getWeaponInfo(itemObj.name, itemObj.damage, itemObj.accuracy);
        }
        else { // armor
            itemObj.is_weapon = 0;
            itemObj.defence = text_arr[1].replace("Defence:", "").trim() + "." + text_arr[2].trim();
            [itemObj.category, itemObj.type, itemObj.quality_value] = getArmorInfo(itemObj.name, itemObj.defence);
        }

        // 0 Bushmaster Carbon 15 (Common 92873).
        // 1 Damage: 64.
        // 2 32.
        // 3 Accuracy: 66.
        // 4 40.
        // 5 Throttle: 142% increased Throat damage.
        // 6 Conserve: 35% increased ammo conservation.
        // 7 Item seller: Akenomics.
        // 8 High bidder: Vernunzio.
        // 9 7 bids.
        // 10 $756,000,001.
        // 11 Ends on 00:49:33 - 06/11/23.
        // 12
        return itemObj;
    }
    function updateAuctionHouse() {
        const $target_nodes = $("#types-tab-1,#types-tab-2").children(".items-list-wrap").children(".items-list").children("[id]");
        if ($target_nodes.length > 0) {
            $target_nodes.each(function(index, value) {
                if ($(this).attr("detected") != "yes") {
                    $(this).attr("detected", "yes");
                    // create item object
                    const itemObj = getItemInfoFromNode($(this));
                    const auction_id = itemObj.auction_id;
                    // get a single history record from localstorage
                    const AUCTION_HOUSE = getLocalStorage("AUCTION_HOUSE", auction_id);
                    // check if new
                    if (!AUCTION_HOUSE) {
                        $(this).find(".item-cont-wrap .title").children(":first").after(`<span class="bold" style="color:var(--default-base-purple-color); margin-left:3px;">New!</div>`);
                    }
                    // show status button text & color // statusBtn object
                    let item_status = "Track";
                    const item_bg_color = itemObj.bg_color;
                    if (item_bg_color.indexOf("bg-green") >= 0) {
                        item_status = "Winning"
                    } else if (item_bg_color.indexOf("bg-red") >= 0) {
                        item_status = "Outbid"
                    } else if (item_bg_color.indexOf("bg-blue") >= 0) {
                        item_status = "Mine"
                    } else if (AUCTION_HOUSE && AUCTION_HOUSE.status_text == "Pinned") {
                        item_status = "Pinned"
                    }
                    $(this).find(".item-cont-wrap .img-wrap").append(`<div id="${auction_id}-btn" style="cursor:pointer; position:absolute; z-index:1; top:-8px; left:191px; width:37px; height:13px;background:var(--default-bg-panel-active-color) 0% 0% no-repeat padding-box; box-shadow:0 1px 0 #00000026;border-radius:7px; color:${statusBtn[item_status]["color"]}; padding:2px; margin-right:1px; margin-left:3px; line-height:14px;" status="${item_status}">${item_status}</div>`);
                    // get item order of all the auction lists
                    const item_order = getListsAheadFromUrl(window.location.href) + index + 1;
                    // order expire
                    const current_timestamp = parseInt(new Date().getTime() / 1000);
                    let order_expire_timestamp = current_timestamp + 3600;
                    if (itemObj.timestamp - current_timestamp <= 3 * 86400) {
                        order_expire_timestamp = current_timestamp + 17 * 86400;
                    }
                    // update cache in localstorage
                    itemObj.order = item_order;
                    itemObj.order_expire_timestamp = order_expire_timestamp;
                    itemObj.status_text = item_status;
                    updateLocalStorage("AUCTION_HOUSE", auction_id, itemObj);
                    // show quality
                    $(this).find(".item-cont-wrap .img-wrap").append(`<div class="item-quality" style="position:absolute; z-index:1; top:-8px; left:-1px; width:40px; height:13px; background:var(--default-bg-panel-active-color) 0% 0% no-repeat padding-box; box-shadow:0 1px 0 #00000026; border-radius:7px; color:var(--default-color); padding:2px; margin-right:1px; margin-left:3px; line-height:14px;">${itemObj.quality_value}%</div>`);
                    // show bonus text & color
                    const bonus_arr = itemObj.bonus_text;
                    if (bonus_arr.length > 0) {
                        const $rarity_node = $(this).find(".item-cont-wrap .title p");
                        $rarity_node.text("");
                        //show bonus text
                        $.each(bonus_arr, function(index, value) {
                            const bonus_range = getBonusRange(itemObj.bonus_name[index], itemObj.bonus_value[index]);
                            if (CELLPHONE_MODE) { 
                                $rarity_node.append(`<span class="border-round" style="color:#eee; padding:1px 2px; border:1px solid var(--default-color); margin-right:2px;" title="${value}<br/><b>Range</b> ${bonus_range}">${itemObj.bonus_value_name[index]}</span>`);
                            } else { 
                                $rarity_node.append(`<span class="border-round" style="color:#eee; padding:1px 2px; border:1px solid var(--default-color); margin-right:2px; line-height:20px;" title="${value}<br/><b>Range</b> ${bonus_range}">${itemObj.bonus_value_name[index]}<br/></span>`);
                            }
                        });
                        // show bonus color
                        const color_factor = colorObj[itemObj.rarity_color]["factor"];
                        const text_color = colorObj[itemObj.rarity_color]["text"];
                        const text_bg_color = colorObj[itemObj.rarity_color]["text_bg"];
                        $(this).find(".item-cont-wrap .title > span").removeClass("t-blue").css("color", text_color);
                        $(this).find(".item-cont-wrap .item-bonuses .infobonuses .bonus-attachment > span").css("color", text_color);
                        $(this).find(".item-cont-wrap .img-wrap .item-quality").css("color", text_color);
                        $rarity_node.children().css("background-color", text_bg_color);
                        // show exchanging bucks
                        const item_exchanging_pricing = getExchangePricing(itemObj.category, itemObj.type, color_factor, bonus_arr.length);
                        $(this).find(".item-cont-wrap .img-wrap").append(`<div class="item-exchanging-pricing" style="position:absolute; z-index:1; top:-8px; left:50px; width:30px; height:13px; background:var(--default-bg-panel-active-color) 0% 0% no-repeat padding-box; box-shadow:0 1px 0 #00000026;border-radius:7px; color:${text_color}; padding:2px; margin-right:1px; margin-left:3px; line-height:14px; text-align:center;">${item_exchanging_pricing}BB</div>`);
                        // show exchanging pricing
                        if (CELLPHONE_MODE) { 
                            const item_bid_wrap = $(this).find(".mob-wrap").find(".top-bid-mob-wrap");
                            const bidding_price = formatMoney(item_bid_wrap.text().replace("Bid: ", ""));
                            item_bid_wrap.append(isWorthyRecycle(bidding_price, item_exchanging_pricing));
                        } else { 
                            const item_bid_wrap = $(this).find(".c-bid-wrap");
                            const bidding_price = formatMoney(item_bid_wrap.text());
                            item_bid_wrap.append(isWorthyRecycle(bidding_price, item_exchanging_pricing));
                        }
                    }

                    // click status button
                    $("#" + auction_id + "-btn").click(function() {
                        if ($(this).attr("status") == "Track") {
                            $(this).attr("status", "Pinned").css("color", "var(--default-yellow-color)").text("Pinned");
                            instantRefreshItemStatus(auction_id, "Pinned");
                            instantRefreshWatchList();
                        } else if ($(this).attr("status") == "Pinned") {
                            $(this).attr("status", "Track").css("color", "var(--default-gray-9-color)").text("Track");
                            instantRefreshItemStatus(auction_id, "Track");
                            instantRefreshWatchList();
                        }
                    });
                    // run once at the last node
                    //console.log(index, $target_nodes.length - 1);
                    if (index == $target_nodes.length - 1) { // 10th
                        console.log("cacheWashing... instantRefreshTable...")
                        cacheWashing();
                        instantRefreshTable();
                    }
                }
            });
        }
    }
    function updateWatchList() {
        const target_node = $("#auction-house-tabs");
        if (target_node.length > 0 && $("#ahhelper-watch-list").length < 1) {
            const AUCTION_HOUSE = getLocalStorageRootNode("AUCTION_HOUSE");
            if (AUCTION_HOUSE) {
                $("#auction-house-tabs").before(`<div id="ahhelper-watch-list" style="width:inherit;background:var(--default-bg-panel-active-color) 0% 0% no-repeat padding-box; box-shadow:0 1px 0 #00000026;border-radius:7px; padding:2px; margin: 10px 3px 0px 1px; line-height:14px; overflow:hidden;">`);
                let watch_list_arr = [];
                $.each(AUCTION_HOUSE, function(index, value) {
                    if (value.status_text !== "Track") {
                        watch_list_arr.push(value);
                    }
                });
                watch_list_arr.sort(function(a, b) { return (a.timestamp - b.timestamp) });
                $.each(watch_list_arr, function(index, value) {
                    console.log(value);
                    const title_text = `<b>${value.name}</b><br/>${(value.bonus_text).toString()}<br/>Q:${value.quality_value}<br/>Pin price:${value.highest_price}<br/>${value.status_text}`;
                    $("#ahhelper-watch-list").append(`<div class="${value.bg_color} ahhelper-item" data-id="${value.auction_id}" data-timestamp="${value.timestamp}"style="float:left;width:64px; height:48px; margin:5px; padding:2px; color:var(--default-color);${value.status_text === "Ended" ? "background: darkgray;" : ""}border: 1px solid var(--default-color); text-align:center;" title="${title_text}" data-title="${title_text}"><img style="margin: 0px 13px;" src="/images/items/${value.item_id}/small.png">${value.end_time}</div>`);
                });
                $(".ahhelper-item").click(function() {
                    if (parseInt($(this).attr("data-timestamp")) > parseInt(new Date().getTime() / 1000)) {
                        return;
                    }
                    $(".ahhelper-ended-item").remove();
                    const auction_id = $(this).attr("data-id");
                    $("#types-tab-1,#types-tab-2").children(".items-list-wrap").children(".items-list").prepend(`
                        <li id="${auction_id}" class="ahhelper-ended-item" detected="yes">
                            <div style="float: left; padding: 10px; display: grid; grid-gap: 10px">
                                <img src="${$(this).children("img").attr("src")}"></img>
                                <button class="torn-btn ahhelper-remove">Remove</button>
                            </div>
                            <div style="float: left; padding: 10px">
                                <span class>${$(this).attr("data-title")}</span>
                            </div>
                            <div class="bid-wrap">
                                <a class="bid-icon" style="width: auto; padding-left: 24px; line-height: 20px" href="#">View final price</a>
                                <span class="bid-btn btn-wrap silver"><span class="bid btn"><button class="torn-btn">Final</button></span></span>
                            </div>
                            <div class="confirm p10"><span class="ajax-preloader m-top10 m-bottom10"></span></div>
                            <div class="clear"></div>
                        </li>
                    `);
                    $(".ahhelper-remove").click(function() {
                        instantRefreshItemStatus(auction_id, "Track");
                        $(".ahhelper-ended-item").remove();
                        instantRefreshWatchList();
                    });
                });
            }
        }
    }
    function cacheWashing() {
        const current_timestamp = parseInt(new Date().getTime() / 1000);
        const AUCTION_HOUSE = getLocalStorageRootNode("AUCTION_HOUSE");
        if (AUCTION_HOUSE) {
            let weapon_deserted = 0;
            let armor_deserted = 0;
            let weapon_tempkeep = 0;
            let armor_tempkeep = 0;
            let tempkeep = [];
            let reserved = [];
            $.each(AUCTION_HOUSE, function(index, value) {
                if (value.is_weapon == 1) {
                    if (current_timestamp - value.timestamp >= 7 * 86400) { // 1
                        weapon_deserted ++;
                    }
                    else if (current_timestamp - value.timestamp >= 0) {
                        if (value.status_text === "Track") { // 1
                            weapon_deserted ++;
                        }
                        else { // 2
                            if (value.status_text != "Ended") {
                                weapon_tempkeep ++;
                            }
                            value.status_text = "Ended";
                            value.order = 0;
                            tempkeep.push(value);
                        }
                    }
                    else { // 3
                        reserved.push(value);
                    }
                }
                else {
                    if (current_timestamp - value.timestamp >= 7 * 86400) { // 1
                        armor_deserted ++;
                    }
                    else if (current_timestamp - value.timestamp >= 0) {
                        if (value.status_text === "Track") { // 1
                            armor_deserted ++;
                        }
                        else { // 2
                            if (value.status_text != "Ended") {
                                armor_tempkeep ++;
                            }
                            value.status_text = "Ended";
                            value.order = 0;
                            tempkeep.push(value);
                        }
                    }
                    else { // 3
                        reserved.push(value);
                    }
                }
            });
            const weapon_expired = weapon_deserted + weapon_tempkeep;
            const armor_expired = armor_deserted + armor_tempkeep;
            $.each(reserved, function(index, value) {
                if (value.is_weapon == 1) {
                    const weapon_order = value.order - weapon_expired;
                    if (weapon_order > 0) {
                        value.order = weapon_order;
                    }
                    else {
                        value.order = 0;
                    }
                }
                else {
                    const armor_order = value.order - armor_expired;
                    if (armor_order > 0) {
                        value.order = armor_order;
                    }
                    else {
                        value.order = 0;
                    }
                }
                if (current_timestamp - value.order_expire_timestamp >= 0) { //expired
                    value.order = 99999;
                }
            });
            let valid_items = {};
            $.each(reserved, function(index, value) {
                const auction_id = value.auction_id;
                valid_items[auction_id] = value;
            });
            $.each(tempkeep, function(index, value) {
                const auction_id = value.auction_id;
                valid_items[auction_id] = value;
            });
            updateLocalStorageRootNode("AUCTION_HOUSE", valid_items);
        }
    }
    function renderTable() {
        $("#auction-house-tabs").children(".tabContainer").after(`<table id="ahhelper-history-table" class="display" cellspacing="0" width="100%">`);
        const AUCTION_HOUSE = getLocalStorageRootNode("AUCTION_HOUSE");
        if (AUCTION_HOUSE) {
            let data_set = [];
            $.each(AUCTION_HOUSE, function(index, value) {
                data_set.push([
                    value.name,
                    value.type,
                    value.bonus_name.toString().replace(",", "+"),
                    value.bonus_value_str.toString().replace(",", "+"),
                    value.rarity_color.replace("glow-", ""),
                    ts2timestr(value.timestamp),
                    value.highest_price,
                    getDescriptionFromItemOrder(value.order),
                ]);
            });

            $('#ahhelper-history-table').dataTable( {
                "data": data_set,
                "columns": [
                    {"title": "Name"},
                    {"title": "Type"},
                    {"title": "Bonus"},
                    {"title": "Value"},
                    {"title": "Color"},
                    {"title": "End"},
                    {"title": "Bid"},
                    {"title": "Location"}
                ],
                "order": [[ 5, "asc" ]],
                "createdRow": function ( row, data, index ) {
                    if ( data[4] == "yellow" ) {
                        $('td', row).eq(0).css('font-weight',"bold").css("color",colorObj["glow-yellow"]["text"]);
                    }
                    else if ( data[4] == "orange" ) {
                        $('td', row).eq(0).css('font-weight',"bold").css("color",colorObj["glow-orange"]["text"]);
                    }
                    else if ( data[4] == "red" ) {
                        $('td', row).eq(0).css('font-weight',"bold").css("color",colorObj["glow-red"]["text"]);
                    }
                },
                "stateSave": true,
                "scrollX": true,
            });

            $("#ahhelper-history-table_wrapper").css("margin-top", "20px").css("padding", "10px").css("border", "solid 1px var(--default-color)");

        }
    }
    function instantRefreshWatchList() {
        $("#ahhelper-watch-list").remove();
        updateWatchList();
    }
    function instantRefreshItemStatus(auction_id, status) {
        let json = getLocalStorage("AUCTION_HOUSE", auction_id);
        if (json) {
            json["status_text"] = status;
            updateLocalStorage("AUCTION_HOUSE", auction_id, json);
        }
    }
    function instantRefreshTable() {
        $("#ahhelper-history-table_wrapper").remove();
        renderTable();
    }

    function datestr2ts(dateStr) {
        const date = new Date('20' + dateStr.substring(17, 19),
                             parseInt(dateStr.substring(14, 16)) - 1,
                             dateStr.substring(11, 13),
                             dateStr.substring(0, 2),
                             dateStr.substring(3, 5),
                             dateStr.substring(6, 8));

        return parseInt((date.getTime() + 8 * 60 * 60 * 1000) / 1000);
    }
    function ts2timestr(ts) {
        return new Date(ts * 1000).toLocaleString('en-GB');

    }
    function formatMoney(num) {
        if (num.toString().indexOf('$') >= 0) {
            return Number(num.replace(/\$|,/g, ''));
        } else if (!Number.isNaN(Number(num))) {
            return num.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) { return s + "," }).replace(/^[^\$]\S+/, function(s) { return "$" + s });
        } else {
            return 0;
        }
    }

    function getLocalStorageRootNode(key1) {
        if (window.localStorage === undefined) {
            return undefined;
        } else if (window.localStorage.getItem(key1) === null) {
            return null;
        } else {
            const json = JSON.parse(window.localStorage.getItem(key1));
            return json;
        }
    }
    function getLocalStorage(key1, key2) {
        const json = getLocalStorageRootNode(key1);
        if (json === undefined) {
            return undefined;
        } else if (json === null) {
            return null;
        } else {
            if (json[key2] === undefined) {
                return undefined;
            } else {
                return json[key2];
            }
        }
    }
    function updateLocalStorage(key1, key2, value) {
        if (window.localStorage === undefined) {
            return undefined;
        } else if (window.localStorage.getItem(key1) === null) {
            let json = {};
            json[key2] = value;
            window.localStorage.setItem(key1, JSON.stringify(json));
        } else {
            let json = JSON.parse(window.localStorage.getItem(key1));
            json[key2] = value;
            window.localStorage.setItem(key1, JSON.stringify(json));
        }
    }
    function updateLocalStorageRootNode(key1, value) {
        if (window.localStorage === undefined) {
            return undefined;
        } else {
            window.localStorage.setItem(key1, JSON.stringify(value));
        }
    }

    function getWeaponInfo(weapon_name, weapon_damage, weapon_accuracy) {
        if (WEAPONS.hasOwnProperty(weapon_name)) {
            const weapon_category = WEAPONS[weapon_name].category;
            const weapon_type = WEAPONS[weapon_name].type;
            const weapon_quality = ((parseFloat(weapon_damage) + parseFloat(weapon_accuracy) - WEAPONS[weapon_name]["lowest_stat"]) * 10).toFixed(1);
            return [weapon_category, weapon_type, weapon_quality];
        }
        else {
            console.log(weapon_name + " not in the list.")
            return ["", "", ""]
        }
    }
    function getArmorInfo(armor_name, armor_defence) {
        if (ARMOR_QUALITY.hasOwnProperty(armor_name)) {
            const armor_category = "Armor";
            const armor_type = armor_name.split(" ")[0];
            const armor_quality = ((armor_defence - ARMOR_QUALITY[armor_name]) * 20).toFixed(1);
            return [armor_category, armor_type, armor_quality];
        }
        else {
            console.log(armor_name + " not in the list.")
            return ["", "", ""]
        }
    }
    function getBonusRange(bonus_name, bonus_value) {
        let range = "";
        const value = parseInt(bonus_value);
        if (BONUS_RANGE.hasOwnProperty(bonus_name)) {
            const floor = BONUS_RANGE[bonus_name]["floor"];
            const ceiling = BONUS_RANGE[bonus_name]["ceiling"];
            range = `${floor} - ${ceiling}`;
            if (value > parseInt(ceiling) || value < parseInt(floor)) {
                console.log(bonus_name + " is out of range.")
            }
        } else {
            console.log(bonus_name + " bonus not in the list.")
        }
        return range;
    }
    function getExchangePricing(category, type, color_factor, bonus_amount) {
        let bucks = 0;
        const bonus_factor = bonus_amount - (bonus_amount - 1) * 0.5;
        if (category == "Armor") {
            bucks = 12 * color_factor * bonus_factor;
        }
        else if (category == "Melee") {
            bucks = 6 * color_factor * bonus_factor;
        }
        else {
            if (type == "Pistol" || type == "SMG") {
                bucks = 4 * color_factor * bonus_factor;
            }
            else if (type == "Shotgun" || type == "Rifle") {
                bucks = 10 * color_factor * bonus_factor;
            }
            else {//Machine Gun || Heavy Artillery
                bucks = 14 * color_factor * bonus_factor;
            }
        }
        return bucks;
    }
    function isWorthyRecycle(bidding_price, item_exchanging_pricing) {
        if (bidding_price == 0) {
            return;
        }
        const recycling_price = item_exchanging_pricing * buck_price;
        if (bidding_price >= recycling_price * 1e6) {
            const percent = parseInt((bidding_price - recycling_price * 1e6) / (recycling_price * 1e4));
            return `<div class="t-red" style="margin-top:5px;">${recycling_price}M (↑${percent}%)</div>`;
        }
        else {
            const percent = parseInt((recycling_price * 1e6 - bidding_price) / (recycling_price * 1e4));
            return `<div class="t-green" style="margin-top:5px;">${recycling_price}M (↓${percent}%)</div>`;
        }
    }
    function bonusTextConvert(str) {
        if (str == "None") {
            return;
        }
        //  Throttle: 142% increased Throat damage.
        //  Conserve: 35% increased ammo conservation.
        const name = str.split(":")[0].trim();
        if (!/\d/.test(str)) { //if (name == "Irradiate" || name == "Smash") {
            return [name, "", "", name];
        } else if (name == "Disarm") { // Disarm: Disables an opponent's weapon upon a hand or arm hit for 4 turns.
            const res = /\d+/.exec(str);
            const value = res ? res[0] : "";
            return [name, value, value + "T", value + "T " + name];
        } else {
            const res = /\d+%/.exec(str);
            const percent = res ? res[0] : "";
            const value = percent.replace("%", "");
            return [name, value, percent, percent + name];
        }
    }
    function getListsAheadFromUrl(url) {
        // https://www.torn.com/amarket.php#itemtab=weapons&start=0
        // https://www.torn.com/amarket.php#itemtab=weapons&start=10
        // https://www.torn.com/amarket.php#itemtab=weapons
        // https://www.torn.com/amarket.php#itemtab=armor&start=0
        const url_arr = url.split("=");
        if (url_arr.length == 3) {
            return parseInt(url_arr[2]);
        }
        else if (url_arr.length == 2) {
            return 0;
        }
        else {
            return 0;
        }
    }
    function getDescriptionFromItemOrder(order) {
        if (order > 9999) {
            return "Unknown";
        }
        else if (order > 0) {
            return `P${parseInt((order - 1) / 10) + 1}-${parseInt((order - 1) % 10) + 1}`
        }
        else {
            return "Sold";
        }
    }
})();