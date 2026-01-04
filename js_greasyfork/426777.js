// ==UserScript==
// @name         CPB Set
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Naturef
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      https://www.lordswm.com/pl_info.php?*
// @require      https://code.jquery.com/jquery-3.3.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/426777/CPB%20Set.user.js
// @updateURL https://update.greasyfork.org/scripts/426777/CPB%20Set.meta.js
// ==/UserScript==


var marketURL = window.location.origin + '/auction.php' ;
var smithEffi=90;
var smithCharge=101;
let debug = 1

async function main()
{
    var myTotalCPB= 0;
    var availableArts = getArts() ; 
    var availablePrices = getPricesArts() ; 
    
    var marketHTML ;
    try
    {
        marketHTML = await request(marketURL) ;
        if(marketHTML.search("During the journey you have access to the") != -1) throw "You are travelling at the moment" ;
    }
    catch(e)
    {
        console.log("Market not accessible at the moment");
        console.log(e);
        return ;
    }
    
    var allArts = document.querySelectorAll("a[href^='art_info.php?']") ;
    console.log(allArts) ; 

    for(var i = 0 ; i < allArts.length ; i++)
    {
        var art = allArts[i] ;
        var artID = getArtID(art) ; 
        var artMarketLink = findMarketLink(artID,marketHTML);
        if(!artMarketLink) continue ;
        var cpb = 0 ; 
        if(!availableArts[artID])
        {
            console.log("Made a market call") ;
            cpb = await getMarketPrices(artMarketLink, art.href)
        }
        else
        {
            var row = availableArts[artID] ; 
            cpb = cpb_calc(row[1], row[1], availablePrices[row[2]], row[0])[0] ; 
            // console.log(cpb) ; 
        }
        var updatedTitle = art.childNodes[0].getAttribute("title") + '\nCPB: ' + cpb ;
        art.childNodes[1].title = updatedTitle;
        myTotalCPB += cpb ;
    }

    var statsTable = document.querySelector("img[title='Initiative']").parentElement.parentElement.parentElement;
    // console.log(statsTable);
    var tr = document.createElement('tr');
    myTotalCPB = myTotalCPB.toFixed(2);
    let cpbIndicator = '<td><img alt="" src="https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65" border="0" width="24" height="24" title="CPB"></td><td align="center"><b>&nbsp;'+ myTotalCPB + '</b>' ;
    tr.innerHTML = cpbIndicator;
    statsTable.appendChild(tr);
    console.log("Total CPB: " + myTotalCPB);
}

function cpb_calc(currDura, maxDura, iniCost, repCost)
{
    var tempMaxDura, tempDura, totDura, optDura, optFights;
    var se, sc;
    var totCostTillNow, costPerBattle = 0, minCPB;
    var i;
    var repCount = 1;

    se = smithEffi / 100;
    sc = smithCharge / 100;
    tempMaxDura = maxDura;
    tempDura = currDura;
    totDura = tempDura;
    totCostTillNow = iniCost;
    costPerBattle = totCostTillNow / totDura;
    minCPB = costPerBattle;
    optDura = tempMaxDura;
    optFights = totDura;


    for(i=1; i<=maxDura; i++)
    {
        totCostTillNow += parseFloat(repCost * sc);
        tempDura = parseInt(tempMaxDura * se);
        totDura += tempDura;
        costPerBattle = (totCostTillNow / parseFloat(totDura));
        tempMaxDura -= 1;
        if ( minCPB >=  costPerBattle )
        {
            minCPB = costPerBattle;
            optDura = tempMaxDura;
            optFights = totDura;
        }
    }

    var optOut = [eval(minCPB.toFixed(2)), optDura, optFights];
    return optOut;
}

function getArtID(art)
{
    var link = art.getAttribute("href") ;
    var pattern = /[?]id=([a-zA-Z0-9_]+)[&]*/i;
    var match = link.match(pattern);
    if(!match) return;
    var artID = match[1];
    return artID ; 
}

function findMarketLink(artID, marketHTML)
{
    pattern = new RegExp("value=[\"\']([a-zA-Z0-9_]+)#" + artID + "[\"\']");
    match = marketHTML.match(pattern);
    if(!match) return;
    var cat = match[1];
    // console.log(cat);
    var linkToMarket = marketURL + '?cat=' + cat + '&sort=0&art_type=' + artID + '&snew=0&sbn=1&sau=0';
    return linkToMarket ;
}

async function getMarketPrices(link, artLink)
{
    var el = document.createElement('html');
    el.innerHTML = await request(link);
    var artInfoPage = await request(artLink);
    var repairCost = getRepairCost(artInfoPage);
    var b = el.querySelectorAll("tr[class='wb']");
    var minCPB = 0 ;
    for(var i = 0 ; i < b.length ; i++)
    {
        var row = b[i];
        var cpb = parse_table(row, repairCost);
        if(minCPB == 0) minCPB=cpb;
        minCPB = Math.min(minCPB,cpb);
    }
    return minCPB;
}

function getRepairCost(text)
{
    return Number(text.split("Repairing")[1].replace(',', '').split('<td>')[2].split('</td>')[0]);
}

function parse_table(row, repairCost)
{
    var arts = new Set();
    var art_name = row.childNodes[0].textContent.split('-')[1].split('[')[0].trim();
    var durability = row.childNodes[0].textContent.split("Durability: ")[1];
    if (durability.includes("pcs")) durability = durability.substring(0, durability.length-6)
    var dura_cur = Number(durability.split('/')[0]);
    var dura_max = Number(durability.split('/')[1].split(" ")[0].match(/\d+/)[0]);
    var price = Number(row.childNodes[2].textContent.replaceAll(',', '').match(/\d+/)[0]);
    // get_repair_cost(i);
    return cpb_calc(dura_cur,dura_max,price,repairCost)[0] ;
}



async function request(url)
{
    return new Promise(function(resolve, reject)
                       {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout')
        }
        xhr.open('get', url, true)
        xhr.send()
    });
}

main() ; 

// artName: Price
function getPricesArts()
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

// artID: [repairCost, maxdura, name]
function getArts()
{
    return {
    "wood_sword": [
     133,
     7,
     "Wooden sword"
    ],
    "gnome_hammer": [
     294,
     25,
     "Light axe"
    ],
    "shortbow": [
     342,
     20,
     "Shortbow"
    ],
    "dagger_dex": [
     3230,
     40,
     "Dagger of dexterity"
    ],
    "staff": [
     2527,
     40,
     "Combat staff"
    ],
    "long_bow": [
     6317,
     50,
     "Longbow"
    ],
    "sor_staff": [
     6118,
     50,
     "Staff of power"
    ],
    "mstaff8": [
     2888,
     30,
     "Staff of youth"
    ],
    "mif_staff": [
     16387,
     70,
     "Mithril staff"
    ],
    "mstaff10": [
     3781,
     35,
     "Staff of shadows"
    ],
    "dagger_myf": [
     8626,
     60,
     "Mithril dagger"
    ],
    "energy_scroll": [
     9044,
     70,
     "Scroll of energy"
    ],
    "composite_bow": [
     8246,
     55,
     "Composite bow"
    ],
    "mm_staff": [
     16986,
     70,
     "Ruby quarterstaff"
    ],
    "mstaff13": [
     4797,
     40,
     "Obsidian baton"
    ],
    "ffstaff15": [
     17679,
     70,
     "Firebender staff"
    ],
    "smstaff16": [
     4883,
     37,
     "Staff of oblivion"
    ],
    "staff18": [
     17746,
     70,
     "Staff of eclipse"
    ],
    "scroll18": [
     10307,
     70,
     "Manuscript of focus"
    ],
    "dagger20": [
     9291,
     60,
     "Dagger of twilight"
    ],
    "knowledge_hat": [
     978,
     25,
     "Hat of knowledge"
    ],
    "wizard_cap": [
     1596,
     35,
     "Wizard cap"
    ],
    "mage_helm": [
     3277,
     50,
     "Wizard helmet"
    ],
    "mif_lhelmet": [
     5244,
     70,
     "Light mithril coif"
    ],
    "mhelmetzh13": [
     6384,
     70,
     "Warlock crown"
    ],
    "xymhelmet15": [
     6612,
     70,
     "Firebender crown"
    ],
    "mhelmet17": [
     7239,
     70,
     "Helmet of twilight"
    ],
    "magic_amulet": [
     8379,
     50,
     "Locket of crystallized tears"
    ],
    "mmzamulet13": [
     9975,
     60,
     "Mystical amulet"
    ],
    "smamul14": [
     4370,
     30,
     "Shard of darkness"
    ],
    "bafamulet15": [
     10811,
     65,
     "Triforce charm"
    ],
    "mmzamulet16": [
     10972,
     65,
     "Charm of captured souls "
    ],
    "smamul17": [
     4389,
     30,
     "Amulet of unity"
    ],
    "mamulet19": [
     11039,
     65,
     "Necklace of ultimate truth"
    ],
    "scoutcloack": [
     304,
     20,
     "Scout`s cape"
    ],
    "antiair_cape": [
     2926,
     60,
     "Cape of winds"
    ],
    "powercape": [
     5339,
     40,
     "Cape of magical power"
    ],
    "antimagic_cape": [
     4949,
     50,
     "Cape of arcane protection"
    ],
    "wiz_cape": [
     8711,
     60,
     "Sorcerer cape"
    ],
    "cloackwz15": [
     9614,
     65,
     "Firebender mantle"
    ],
    "cloack17": [
     9975,
     65,
     "Mantle of eternity"
    ],
    "mage_armor": [
     4465,
     50,
     "Wizard attire"
    ],
    "mif_light": [
     6251,
     70,
     "Light mithril cuirass"
    ],
    "wiz_robe": [
     9376,
     70,
     "Sorcerer robe"
    ],
    "robewz15": [
     9310,
     70,
     "Firebender robe"
    ],
    "marmor17": [
     9310,
     70,
     "Armour of twilight"
    ],
    "sshield17": [
     4018,
     35,
     "Aegis of suppression"
    ],
    "hunter_boots": [
     912,
     30,
     "Leather boots"
    ],
    "shoe_of_initiative": [
     2384,
     40,
     "Shoes of aspiration"
    ],
    "wiz_boots": [
     8008,
     65,
     "Sorcerer sandals"
    ],
    "mboots14": [
     8825,
     70,
     "Warlock jackboots"
    ],
    "mboots17": [
     8683,
     70,
     "Jackboots of twilight"
    ],
    "i_ring": [
     171,
     10,
     "Ring of dexterity"
    ],
    "rashness_ring": [
     1928,
     30,
     "Ring of impetuosity"
    ],
    "circ_ring": [
     6507,
     50,
     "Ring of abdication"
    ],
    "powerring": [
     5187,
     40,
     "Prophet ring"
    ],
    "darkring": [
     8379,
     50,
     "Penumbral ring"
    ],
    "magring13": [
     10279,
     60,
     "Sorcerer signet"
    ],
    "bring14": [
     10374,
     60,
     "Ring of contradictions"
    ],
    "mmmring16": [
     11238,
     65,
     "Stellar ring"
    ],
    "smring17": [
     2907,
     30,
     "Signet-ring of unity"
    ],
    "ring19": [
     11305,
     65,
     "Ring of intrepidity"
    ],
    "mring19": [
     11390,
     65,
     "Band of incessancy"
    ],
    "samul14": [
     4370,
     30,
     "Amulet of fortune"
    ],
    "amulet_of_luck": [
     959,
     25,
     "Amulet of luck"
    ],
    "amulet19": [
     11039,
     65,
     "Amulet of zeal"
    ],
    "firsword15": [
     17670,
     70,
     "Blade of rebirth"
    ],
    "boots17": [
     8683,
     70,
     "Boots of dawn"
    ],
    "sboots16": [
     3239,
     30,
     "Boots of grace"
    ],
    "bow14": [
     9946,
     65,
     "Bow of midnight still"
    ],
    "sarmor16": [
     4351,
     44,
     "Breastplate of grace"
    ],
    "soul_cape": [
     1197,
     30,
     "Cape of spirits"
    ],
    "chain_coif": [
     1539,
     40,
     "Chain helmet"
    ],
    "dring21": [
     15104,
     70,
     "Coupling ring"
    ],
    "armor17": [
     9490,
     70,
     "Cuirass of dawn"
    ],
    "defender_shield": [
     1130,
     40,
     "Defender shield"
    ],
    "dragon_shield": [
     8778,
     70,
     "Dragon shield"
    ],
    "samul17": [
     4389,
     30,
     "Dragongrin charm"
    ],
    "sring17": [
     2907,
     30,
     "Dragongrip ring"
    ],
    "sshield14": [
     3923,
     38,
     "Dragonscale shield"
    ],
    "scloack16": [
     3192,
     30,
     "Dragonwing cloak"
    ],
    "warring13": [
     10279,
     60,
     "Dragon`s eye"
    ],
    "broad_sword": [
     4721,
     60,
     "Equilibrium blade"
    ],
    "boots15": [
     8559,
     70,
     "Flame boots"
    ],
    "myhelmet15": [
     6583,
     70,
     "Flame helmet"
    ],
    "armor15": [
     9310,
     70,
     "Flame plate"
    ],
    "shield16": [
     10298,
     70,
     "Flame shield"
    ],
    "miff_plate": [
     9842,
     75,
     "Fullmithril armor"
    ],
    "boots2": [
     1026,
     35,
     "Galoshes of battle"
    ],
    "sword18": [
     17755,
     70,
     "Gladius of presage"
    ],
    "dring9": [
     10032,
     50,
     "Guardian ring"
    ],
    "hauberk": [
     2289,
     40,
     "Hauberk"
    ],
    "sshield11": [
     3876,
     40,
     "Hawk lord bulwark"
    ],
    "mif_hboots": [
     7752,
     65,
     "Heavy mithril boots"
    ],
    "mif_hhelmet": [
     6298,
     70,
     "Heavy mithril coif"
    ],
    "shelm8": [
     1197,
     30,
     "Helmet of courage"
    ],
    "helmet17": [
     7239,
     70,
     "Helmet of dawn"
    ],
    "shelm16": [
     2774,
     40,
     "Helmet of grace"
    ],
    "leather_shiled": [
     266,
     18,
     "Leather armor"
    ],
    "leatherplate": [
     1358,
     30,
     "Leather harness"
    ],
    "leather_helm": [
     627,
     30,
     "Leather helmet"
    ],
    "leatherboots": [
     199,
     14,
     "Leather jackboots"
    ],
    "mif_lboots": [
     7153,
     55,
     "Light mithril boots"
    ],
    "samul8": [
     3391,
     30,
     "Lucky horseshoe"
    ],
    "scloack8": [
     2052,
     30,
     "Maskrobe"
    ],
    "bravery_medal": [
     560,
     25,
     "Medal of bravery"
    ],
    "mif_sword": [
     16957,
     70,
     "Mithril longsword"
    ],
    "sarmor9": [
     2479,
     40,
     "Mithril mail armour"
    ],
    "dring12": [
     13356,
     65,
     "Mithril ring"
    ],
    "sarmor13": [
     4322,
     50,
     "Obsidian armour"
    ],
    "boots13": [
     8502,
     70,
     "Obsidian boots"
    ],
    "zxhelmet13": [
     6384,
     70,
     "Obsidian helmet"
    ],
    "shield13": [
     10174,
     70,
     "Obsidian shield"
    ],
    "ssword13": [
     5985,
     50,
     "Obsidian sword"
    ],
    "power_pendant": [
     7381,
     60,
     "Pendant of despair"
    ],
    "wzzamulet13": [
     9975,
     60,
     "Pendant of wrath"
    ],
    "dagger16": [
     9120,
     60,
     "Phoenix dagger"
    ],
    "full_plate": [
     9243,
     75,
     "Platemail"
    ],
    "def_sword": [
     1292,
     40,
     "Reprisal sword"
    ],
    "sring4": [
     579,
     15,
     "Ring of ambition"
    ],
    "doubt_ring": [
     1064,
     12,
     "Ring of doubts"
    ],
    "dring5": [
     3496,
     40,
     "Ring of faith"
    ],
    "dring15": [
     14534,
     70,
     "Ring of fiery gaze"
    ],
    "dring18": [
     14820,
     70,
     "Ring of hope"
    ],
    "verve_ring": [
     1577,
     18,
     "Ring of inspiration"
    ],
    "sring10": [
     2859,
     30,
     "Ring of thorns"
    ],
    "wwwring16": [
     11238,
     65,
     "Ring of torment"
    ],
    "sboots12": [
     2992,
     35,
     "Ruby boots"
    ],
    "mm_sword": [
     17195,
     70,
     "Ruby gladius"
    ],
    "shelm12": [
     2660,
     40,
     "Ruby helmet"
    ],
    "shield19": [
     10469,
     70,
     "Shield of dawn"
    ],
    "sshield5": [
     2888,
     40,
     "Shield of glory"
    ],
    "warriorring": [
     6697,
     40,
     "Signet-ring of might"
    ],
    "sboots9": [
     2137,
     30,
     "Soldier boots"
    ],
    "steel_blade": [
     465,
     30,
     "Steel blade"
    ],
    "steel_boots": [
     5785,
     70,
     "Steel boots"
    ],
    "s_shield": [
     266,
     15,
     "Steel buckler"
    ],
    "ciras": [
     4455,
     70,
     "Steel cuirass"
    ],
    "steel_helmet": [
     3676,
     70,
     "Steel helmet"
    ],
    "ssword10": [
     4854,
     45,
     "Sword of courage"
    ],
    "ssword16": [
     6051,
     46,
     "Sword of harmony"
    ],
    "power_sword": [
     9775,
     80,
     "Sword of might"
    ],
    "requital_sword": [
     2527,
     40,
     "Sword of retribution"
    ],
    "ssword8": [
     3838,
     40,
     "Sword of stiffness"
    ],
    "wzzamulet16": [
     10972,
     65,
     "Talisman of wardance"
    ],
    "large_shield": [
     9576,
     70,
     "Tower shield"
    ],
    "bow17": [
     10108,
     65,
     "Twilight piercer"
    ],
    "warrior_pendant": [
     8046,
     50,
     "Warrior pendant"
    ]
   } ; 
}

