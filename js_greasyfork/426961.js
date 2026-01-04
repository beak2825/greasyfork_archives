// ==UserScript==
// @name         Profit Calculator Transfer Log
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Naturef
// @match        https://www.lordswm.com/pl_transfers.php*
// @icon         https://www.google.com/s2/favicons?domain=lordswm.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/426961/Profit%20Calculator%20Transfer%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/426961/Profit%20Calculator%20Transfer%20Log.meta.js
// ==/UserScript==

async function main()
{
    let x = document.querySelector('a[href^="pl_info"]') ;
    var availableArts = getArts() ;
    let playerNick = x.textContent.trim() ;
    var foundin = Array.from(document.querySelectorAll('.global_a_hover')[1].childNodes) ;
    foundin = foundin.filter(function (node){ return node.nodeName == '#text' && node.textContent.includes('Sold item:')});
    var totalProfit = 0 ;

    for(let i = 0 ; i < foundin.length ; i++)
    {
        let node = foundin[i];
        let buyer = node.nextSibling.textContent.trim() ;
        let artName = node.textContent.split('"')[1]
        let sellPrice = node.textContent.match(/for (\d+) gold to/)[1];
        let dura = node.textContent.match(/\[(\d+)\/(\d+)\]/);
        if(!dura || dura[1] != dura[2]) continue ;
        let quantity = node.textContent.match(/(\d+) pcs[.]/) ;
        if(!quantity) quantity = 1 ;
        else quantity = Number(quantity[1]);

        if(availableArts[artName])
        {
            let buyPrice = availableArts[artName] ;
            let profit = Number(sellPrice) - quantity * Number(buyPrice);
            if(buyer == playerNick) profit = 0 ; 
            let commission = node.nextSibling.nextSibling.nextSibling.nextSibling.textContent.trim('.').split(':')[1].trim();
            profit -= Number(commission);
            node.nextSibling.nextSibling.nextSibling.nextSibling.textContent ='. Profit: ' + profit ;
            totalProfit += profit ;
            continue ;
        }
    }

    x.parentNode.innerHTML += '<br>Total Profit = ' + totalProfit.toLocaleString() ;
}

main();

function getArts()
{
    return {
    "Wooden sword": 140,
    "Light axe": 310,
    "Dagger of vengeance": 960,
    "Shortbow": 360,
    "Dagger of dexterity": 4840,
    "Combat staff": 2660,
    "Longbow": 6650,
    "Staff of power": 6440,
    "Staff of youth": 3040,
    "Mithril staff": 17250,
    "Staff of shadows": 3980,
    "Mithril dagger": 9080,
    "Scroll of energy": 9520,
    "Composite bow": 8680,
    "Ruby quarterstaff": 17880,
    "Obsidian baton": 5050,
    "Firebender staff": 18610,
    "Staff of oblivion": 5140,
    "Staff of eclipse": 18680,
    "Manuscript of focus": 10850,
    "Dagger of twilight": 9780,
    "Leather hat": 180,
    "Hat of knowledge": 1030,
    "Wizard cap": 1680,
    "Wizard helmet": 3450,
    "Light mithril coif": 5520,
    "Warlock crown": 6720,
    "Firebender crown": 6960,
    "Helmet of twilight": 7620,
    "Locket of crystallized tears": 8820,
    "Mystical amulet": 10500,
    "Shard of darkness": 4600,
    "Triforce charm": 11380,
    "Charm of captured souls ": 11550,
    "Amulet of unity": 4620,
    "Necklace of ultimate truth": 11620,
    "Scout`s cape": 320,
    "Cape of winds": 3080,
    "Cape of magical power": 5620,
    "Cape of arcane protection": 5210,
    "Sorcerer cape": 9170,
    "Firebender mantle": 10120,
    "Mantle of eternity": 10500,
    "Wizard attire": 4700,
    "Light mithril cuirass": 6580,
    "Sorcerer robe": 9870,
    "Firebender robe": 9800,
    "Armour of twilight": 9800,
    "Round shield": 110,
    "Aegis of suppression": 4230,
    "Leather boots": 960,
    "Shoes of aspiration": 2510,
    "Sorcerer sandals": 8430,
    "Warlock jackboots": 9290,
    "Jackboots of twilight": 9140,
    "Ring of dexterity": 180,
    "Ring of impetuosity": 2030,
    "Ring of abdication": 6850,
    "Prophet ring": 5460,
    "Ring of thunder": 3010,
    "Penumbral ring": 8820,
    "Sorcerer signet": 10820,
    "Ring of contradictions": 10920,
    "Stellar ring": 11830,
    "Signet-ring of unity": 3060,
    "Ring of intrepidity": 11900,
    "Band of incessancy": 11990,
    /* Map Art Start  */
    "Amulet of fortune": 4461,
    "Amulet of luck": 1010,
    "Amulet of zeal": 11270,
    "Blade of rebirth": 17888,
    "Boots of dawn": 8668,
    "Boots of grace": 3306,
    "Bow of midnight still": 10078,
    "Breastplate of grace": 4441,
    "Cape of spirits": 1222,
    "Chain helmet": 1571,
    "Coupling ring": 15404,
    "Cuirass of dawn": 9689,
    "Defender shield": 1153,
    "Dragon shield": 8962,
    "Dragongrin charm": 4480,
    "Dragongrip ring": 2946,
    "Dragonscale shield": 4005,
    "Dragonwing cloak": 3360,
    "Dragon`s eye": 10394,
    "Equilibrium blade": 4820,
    "Flame boots": 8738,
    "Flame helmet": 6616,
    "Flame plate": 9428,
    "Flame shield": 10513,
    "Fullmithril armor": 9917,
    "Galoshes of battle": 1046,
    "Gladius of presage": 18128,
    "Guardian ring": 10242,
    "Hauberk": 2336,
    "Hawk lord bulwark": 3956,
    "Heavy mithril boots": 7914,
    "Heavy mithril coif": 6430,
    "Helmet of courage": 1221,
    "Helmet of dawn": 7295,
    "Helmet of grace": 2831,
    "Leather armor": 271,
    "Leather harness": 1387,
    "Leather helmet": 640,
    "Leather jackboots": 203,
    "Light mithril boots": 7304,
    "Lucky horseshoe": 3461,
    "Maskrobe": 2094,
    "Medal of bravery": 571,
    "Mithril longsword": 17314,
    "Mithril mail armour": 2531,
    "Mithril ring": 13522,
    "Obsidian armour": 4412,
    "Obsidian boots": 8680,
    "Obsidian helmet": 6517,
    "Obsidian shield": 10218,
    "Obsidian sword": 6110,
    "Pendant of despair": 7536,
    "Pendant of wrath": 10184,
    "Phoenix dagger": 9311,
    "Platemail": 9437,
    "Reprisal sword": 1318,
    "Ring of ambition": 590,
    "Ring of doubts": 1086,
    "Ring of faith": 3568,
    "Ring of fiery gaze": 14840,
    "Ring of hope": 14990,
    "Ring of inspiration": 1610,
    "Ring of thorns": 2918,
    "Ring of torment": 11474,
    "Ruby boots": 3054,
    "Ruby gladius": 17556,
    "Ruby helmet": 2683,
    "Shield of dawn": 10431,
    "Shield of glory": 2947,
    "Signet-ring of might": 6837,
    "Soldier boots": 2181,
    "Steel blade": 475,
    "Steel boots": 5907,
    "Steel buckler": 271,
    "Steel cuirass": 4549,
    "Steel helmet": 3753,
    "Sword of courage": 4929,
    "Sword of harmony": 6141,
    "Sword of might": 9902,
    "Sword of retribution": 2579,
    "Sword of stiffness": 3917,
    "Talisman of wardance": 11202,
    "Tower shield": 9776,
    "Twilight piercer": 10319,
    "Warrior pendant": 8214
   } ;
}