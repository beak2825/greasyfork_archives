// ==UserScript==
// @name        Market Watcher
// @description Watches preset arts at the market
// @match       https://www.lordswm.com/home.php
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @version 0.0.1.20210714185531
// @namespace https://greasyfork.org/users/774353
// @downloadURL https://update.greasyfork.org/scripts/427943/Market%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/427943/Market%20Watcher.meta.js
// ==/UserScript==

const marketURL = window.location.origin + '/auction.php' ;
let temp = document.querySelector('.global_container_block_header') ;
const teamMates = ['fisher_09','KIR555','sworder', 'Господин7','незаметная','Angel of Death','Slash67','Naturef','Death Envoy','Сафарт','герой-феникса'] ;
const playerNick = $('a[href^="pl_info"]')[0].textContent
const blackList = ['RedFox','seropai','GermesTot'] ;
const highProfitValue = 2000 ; 


if(temp)
{
    console.log("You are travelling at the moment") ;
    return ; 
} 

var tableBody = document.querySelectorAll('.wbwhite')[0];
var watcherContainer = document.createElement('td') ; 

watcherContainer.id = 'watcherContainer' ; 
tableBody.appendChild(document.createElement('hr')) ; 
tableBody.appendChild(watcherContainer) ;
watcherContainer.appendChild(createHeading()) ;
watcherContainer.appendChild(createTable()) ;
makeButtons(watcherContainer) ; 
initList() ; 
var artMap = loadArts() ; 
document.body.appendChild(createDataList()) ; 
addLotPoster(tableBody) ; 
getMarketStats() ;

async function addLotPoster(tableBody)
{
    const newLotURL = 'https://www.lordswm.com/auction_new_lot.php' ; 
    var lotPage = await request(newLotURL) ;
    lotPage = new DOMParser().parseFromString(lotPage, "text/html") ; 
    var form = lotPage.querySelector('form[name="f"]') ;
    cleanNode(form) ;
    form = $(form) ; 
    let lotPoster = $('<td id="LotPoster"></td>') ; 
    var heading = $('<div align="center"><b>Lot Poster</b></div>') ;
    tableBody.appendChild(lotPoster[0]) ;
    lotPoster.append(heading) ; 
    lotPoster.append(form) ; 
    
    form.submit(function(event) {
        event.preventDefault();
        var url = form.attr('action');
        var posting = $.post(url, form.serialize());
        posting.done(function(data) {
            var newPage = $(data) ;
            var newForm = newPage.find('form[name="f"]') ; 
            cleanNode(newForm[0]) ;
            lotPoster.empty() ;
            lotPoster.append(heading) ; 
            lotPoster.append(newForm[0]) ;
            var btn = newForm.find('input[value="Cancel"]') ;
            btn.click(cancelLot) ;
        });
    });
}

function cancelLot()
{
    location.reload() ; 
    return false ; 
}

function cleanNode(node)
{ 
  for(var n = 0; n < node.childNodes.length; n ++)
  {
    var child = node.childNodes[n];
    if(
        child.nodeName == 'BR' || 
        (child.nodeName == '#text' && child.textContent.trim() == "") ||
        (child.textContent.includes('Market') || child.textContent.includes('charge you a tax') || child.textContent.includes('Post a lot'))
    )
    {
      node.removeChild(child);
      n --;
    }
    
    if(child.nodeName == '#text' && child.textContent.includes('Amount'))
    {
        child.textContent = ' Amount: ' ; 
    }
  }
    
    for(n = 0 ; n < node.childNodes.length ; n++)
    {
        var child = node.childNodes[n] ; 
        if(child.nodeName == 'SELECT' || child.nodeName == 'INPUT')
        {
            node.insertBefore(document.createElement('br'),child.nextSibling) ; 
        }
    }
}

function initList()
{
    var saved = localStorage.getItem("MarketWatcher_artList");
    if (saved === null) {
        addArt();
    }
    else {
        saved = saved.split('#') ;
        for (let i = 0 ; i < saved.length ; i++) {
            addArt(saved[i]);
        }
    }
}

function createHeading()
{
    var tr = document.createElement('div') ; 
    // tr.setAttribute('width','680px');
    tr.setAttribute('style','font-size: 12px') ;
    tr.setAttribute('align','center') ;
    tr.innerHTML = '<b>Market Watcher</b>' ;
    return tr ; 
}

function createTable()
{
    var tab = $("<table style='width:500px' align='center'><tbody id='marketWatch'></tbody></table>") ; 
    return tab[0] ; 
}

function makeButtons(watcherContainer)
{
    var myDiv = $('<div align="center"></div>') ; 
    var addBtn = $('<button>Add Artifact</button>') ; 
    var saveBtn = $('<button>Save</button>') ; 
    var refreshBtn = $('<button>Refresh</button>') ; 
    addBtn.click(function(){addArt();}) ; 
    saveBtn.click(function(){saveArts() ; window.location.reload();}) ; 
    refreshBtn.click(function(){getMarketStats();}) ; 
    myDiv.append(addBtn) ; 
    myDiv.append(saveBtn) ;
    myDiv.append(refreshBtn) ; 
    watcherContainer.appendChild(myDiv[0]) ; 
}

function createDataList()
{
    var allArtsList = [] ; 
 
    for(var art in artMap)
    {
        allArtsList.push(art) ; 
    }

    var dl = document.createElement('datalist') ; 
    dl.id = 'allArts' ; 

    for(let i = 0 ; i < allArtsList.length ; i++)
    {
        var x = $("<option value='"+ allArtsList[i] +"'>") ;
        dl.append(x[0]) ; 
    }
    
    return dl ; 
}
            
function addArt(value)
{
    if(value == undefined) value = ""
    
    let tr = $('<tr width="80%" style="font-size: 11px"></tr>') ; 
    let controlPrice = $("<input type='text' list='allArts' value='" + value + "' style='width: auto'>") ;
    var removeLink = $('<a href="#" title="Delete" style="margin: 0 10px;">(x)</a>');
    removeLink.click(function() { tr.remove(); saveArts(); });
    controlPrice.change(function(){ controlPrice[0].setAttribute('value',controlPrice.val()) ; saveArts() ; }) ; 
    tr.append(removeLink) ; 
    tr.append(controlPrice) ; 
    document.querySelector('#marketWatch').appendChild(tr[0]) ; 
}

function saveArts()
{
    let allArts = document.querySelector('#marketWatch').querySelectorAll('input[type="text"]') ;
    var artString = '' ; 
    for(let i = 0 ; i < allArts.length ; i++)
    {
        var art = allArts[i] ; 
        let artName = art.getAttribute('value') ; 
        artString += artName ; 
        if(i != allArts.length - 1) artString += '#' ; 
    }
    localStorage.setItem('MarketWatcher_artList',artString) ;  
}

function copyPrice(price)
{
    var marketPriceCol = document.querySelector('input[name="price"]') ; 
    if(!marketPriceCol) return ;
    marketPriceCol.setAttribute('value',price) ; 
}

async function getMarketStats()
{
    let allArts = document.querySelector('#marketWatch').querySelectorAll('input[type="text"]') ;
    var originalPrices = artCosts() ; 
    for(let i = 0 ; i < allArts.length ; i++)
    {
        let art = allArts[i] ; 
        let tr = art.parentNode ; 
        if(art.nextSibling)
        {
            tr.removeChild(art.nextSibling) ;
        }
        let artName = art.getAttribute('value') ;
        if(!artMap[artName])
        { 
            var td = $("<td>-- No Lots</td>") ;
            art.parentNode.appendChild(td[0]) ;
            continue ; 
        } 
        let artCat = artMap[artName][0];
        let artID = artMap[artName][1];
        let marketLink = getMarketLink(artCat,artID) ;
        getLotDetails(marketLink).then(function (val)
        {
            let price = Number(val[0]) ; 
            let seller = val[2] ; 
            if(price == -1)
            {
                var td = $("<td>&nbsp--&nbsp<a href='"+ marketLink +"'> No Lots</a></td>") ;
                art.parentNode.appendChild(td[0]) ;
                return ;
            }
            
            let timeRemaining = val[1] ;
            var td = document.createElement('td') ;
            
            // td.innerHTML += '&nbsp--&nbsp<a style="font-size: 13px" href='+ marketLink +'> '+ price + '</a>'; 
            td.innerHTML += '&nbsp--&nbsp<font style="font-size: 12px" id="elemPrice">' + price + '</font>';
            $(td,"#elemPrice").click(function(){
                let copiedPrice = (teamMates.includes(seller) ? price : price - 1) ; 
                copyPrice(copiedPrice) ; 
            }) ;
            
            if(originalPrices[artName])
            {
               let costPrice = originalPrices[artName] ;
               let profit = (price * 0.99) - (costPrice) ;
               let myC = profit > 0 ? 'green' : 'red' ;
                
               if(blackList.includes(seller))
               {
                   myC = 'brown' ; 
               }
               else if(seller == playerNick)
               {
                   myC = 'green' ; 
               }
               else if(teamMates.includes(seller))
                   myC = 'blue' ;
               else
                   myC = 'orange' ; 
               
               if(!teamMates.includes(seller) && profit > highProfitValue)
                {
                    myC = '#fc03fc' ; 
                }
                   
                
               if(profit < 0)
                   myC = 'red' ; 
                
               td.innerHTML += ('&nbsp--&nbsp<a href="'+ marketLink +'"><font title="'+ seller +'" color='+ myC +'>' + profit.toLocaleString() + '</font></a>') ; 
            }
            
            td.innerHTML += '&nbsp--&nbsp'+ timeRemaining ;
            tr.appendChild(td) ;
        }) ; 
        
    }
    
}

async function getLotDetails(link)
{
    var el = document.createElement('html');
    el.innerHTML = await request(link);
    var b = el.querySelectorAll("tr[class='wb']");
    if(!b || b.length == 0) return [-1,"INF", "None",undefined] ;

    var lowestPrice = 999999999999;
    for(let i = 0 ; i < b.length ; i++)
    {
        var row = b[i];
        let font = row.querySelector('font') ; 
        if(font && font.getAttribute('color') == 'red')
            continue ; 
        lowestPrice = Math.min(lowestPrice, getPrice(row)) ; 
        let timeRemaining = row.childNodes[3].textContent ;
        let seller = row.querySelector('form').querySelector('a').textContent ;
        let form = row.querySelector('form') ;
        return [lowestPrice, timeRemaining, seller,form] ; 
    }
}

function getPrice(row)
{
    var price = Number(row.childNodes[2].textContent.replaceAll(',', '').match(/\d+/)[0]);
    return price ;
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

function getMarketLink(cat, artID)
{
    var linkToMarket = marketURL + '?cat=' + cat + '&sort=0&art_type=' + artID + '&snew=1&sbn=1&sau=0';
    return linkToMarket ;
}



function artCosts()
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
    "Bow of midnight still": 10154,
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

// [Art Name: [ArtCategory, ArtID]};
function loadArts()
{
  return {
  "Adventurer`s armour": [
    "cuirass",
    "adv_armor1"
  ],
  "Adventurer`s boots": [
    "boots",
    "adv_boot1"
  ],
  "Adventurer`s bow": [
    "weapon",
    "adv_longbow1"
  ],
  "Adventurer`s dagger": [
    "weapon",
    "a_dagger1"
  ],
  "Adventurer`s helmet": [
    "helm",
    "adv_hm1"
  ],
  "Aegis of suppression": [
    "shield",
    "sshield17"
  ],
  "Amphibian cloak": [
    "relict",
    "amf_cl"
  ],
  "Amphibian faceguard": [
    "relict",
    "amf_helm"
  ],
  "Amphibian garment": [
    "relict",
    "amf_body"
  ],
  "Amphibian greatstaff": [
    "relict",
    "amf_weap"
  ],
  "Amphibian greaves": [
    "relict",
    "amf_boot"
  ],
  "Amphibian spellscroll": [
    "relict",
    "amf_scroll"
  ],
  "Amulet of dungeons": [
    "necklace",
    "dun_amul2"
  ],
  "Amulet of fortune": [
    "necklace",
    "samul14"
  ],
  "Amulet of infinity": [
    "necklace",
    "8amul_inf"
  ],
  "Amulet of luck": [
    "necklace",
    "amulet_of_luck"
  ],
  "Amulet of nine": [
    "necklace",
    "9amu_let"
  ],
  "Amulet of unity": [
    "necklace",
    "smamul17"
  ],
  "Amulet of zeal": [
    "necklace",
    "amulet19"
  ],
  "Ancient compass": [
    "other",
    "compass"
  ],
  "Apprentice necromancer hood": [
    "relict",
    "necr_helm"
  ],
  "Armor of dungeons": [
    "cuirass",
    "dun_armor2"
  ],
  "Armour of twilight": [
    "cuirass",
    "marmor17"
  ],
  "Band of incessancy": [
    "ring",
    "mring19"
  ],
  "Barbarian Talisman": [
    "backpack",
    "znak5"
  ],
  "Barbarian warrior club": [
    "relict",
    "barb_club"
  ],
  "Barbarian warrior shield": [
    "relict",
    "barb_shield"
  ],
  "Battlemagus guise": [
    "cloack",
    "battlem_cape"
  ],
  "Battleplate of sun": [
    "cuirass",
    "sun_armor"
  ],
  "Bear Figurine": [
    "backpack",
    "bear_statue"
  ],
  "Beastbane armor": [
    "cuirass",
    "sh_armor"
  ],
  "Beastbane arrows": [
    "other",
    "sh_4arrows"
  ],
  "Beastbane band": [
    "ring",
    "sh_ring2"
  ],
  "Beastbane blade": [
    "weapon",
    "sh_sword"
  ],
  "Beastbane boots": [
    "boots",
    "sh_boots"
  ],
  "Beastbane bow": [
    "weapon",
    "sh_bow"
  ],
  "Beastbane charm": [
    "necklace",
    "sh_amulet2"
  ],
  "Beastbane helmet": [
    "helm",
    "sh_helmet"
  ],
  "Beastbane maskrobe": [
    "cloack",
    "sh_cloak"
  ],
  "Beastbane shield": [
    "shield",
    "sh_shield"
  ],
  "Beastbane signet": [
    "ring",
    "sh_ring1"
  ],
  "Beastbane spear": [
    "weapon",
    "sh_spear"
  ],
  "Black dog Figurine": [
    "backpack",
    "dog_statue"
  ],
  "Black knight`s ring": [
    "ring",
    "blackring"
  ],
  "Blade of rebirth": [
    "weapon",
    "firsword15"
  ],
  "Blade of revelation": [
    "weapon",
    "sunart4"
  ],
  "Blade of winds": [
    "weapon",
    "windsword"
  ],
  "Book of knowledge": [
    "backpack",
    "kniga"
  ],
  "Book of skills": [
    "backpack",
    "skill_book11"
  ],
  "Boots of dawn": [
    "boots",
    "boots17"
  ],
  "Boots of dungeons": [
    "boots",
    "dun_boots2"
  ],
  "Boots of grace": [
    "boots",
    "sboots16"
  ],
  "Boots of sun": [
    "boots",
    "sun_boots"
  ],
  "Bow of light": [
    "weapon",
    "lbow"
  ],
  "Bow of midnight still": [
    "weapon",
    "bow14"
  ],
  "Breastplate of grace": [
    "cuirass",
    "sarmor16"
  ],
  "Cape of arcane protection": [
    "cloack",
    "antimagic_cape"
  ],
  "Cape of magical power": [
    "cloack",
    "powercape"
  ],
  "Cape of spirits": [
    "cloack",
    "soul_cape"
  ],
  "Cape of winds": [
    "cloack",
    "antiair_cape"
  ],
  "Cave crystal": [
    "backpack",
    "crystal"
  ],
  "Centaur bow": [
    "weapon",
    "centaurbow"
  ],
  "Chain helmet": [
    "helm",
    "chain_coif"
  ],
  "Charm": [
    "backpack",
    "obereg"
  ],
  "Charm of captured souls ": [
    "necklace",
    "mmzamulet16"
  ],
  "Charmed gear": [
    "backpack",
    "mgear"
  ],
  "Cloak of sun": [
    "cloack",
    "finecl"
  ],
  "Clover of fortune": [
    "necklace",
    "clover_amul"
  ],
  "Combat staff": [
    "weapon",
    "staff"
  ],
  "Commemorative Coin": [
    "backpack",
    "13coin"
  ],
  "Commemorative Watches": [
    "backpack",
    "12hron"
  ],
  "Composite bow": [
    "weapon",
    "composite_bow"
  ],
  "Conqueror`s Order 1st grade": [
    "necklace",
    "eg_order1"
  ],
  "Conqueror`s Order 2nd grade": [
    "necklace",
    "eg_order2"
  ],
  "Conqueror`s Order 3rd grade": [
    "necklace",
    "eg_order3"
  ],
  "Coupling ring": [
    "ring",
    "dring21"
  ],
  "Crown of Dragontooth": [
    "helm",
    "dragon_crown"
  ],
  "Crusader gonfalon": [
    "backpack",
    "krest2"
  ],
  "Cube of Destiny": [
    "backpack",
    "cubeg"
  ],
  "Cube of Equality": [
    "backpack",
    "bal_cube"
  ],
  "Cube of Strength": [
    "backpack",
    "cubes"
  ],
  "Cube of Vitality": [
    "backpack",
    "cubed"
  ],
  "Cuirass of dawn": [
    "cuirass",
    "armor17"
  ],
  "Dagger of dexterity": [
    "weapon",
    "dagger_dex"
  ],
  "Dagger of twilight": [
    "weapon",
    "dagger20"
  ],
  "Dark Elf Talisman": [
    "backpack",
    "znak6"
  ],
  "Defender shield": [
    "shield",
    "defender_shield"
  ],
  "Demon Talisman": [
    "backpack",
    "znak7"
  ],
  "Demonic soldier armor": [
    "relict",
    "dem_armor"
  ],
  "Devil axe": [
    "weapon",
    "dem_dtopor"
  ],
  "Dragon shield": [
    "shield",
    "dragon_shield"
  ],
  "Dragon stone": [
    "backpack",
    "dragonstone"
  ],
  "Dragon`s eye": [
    "ring",
    "warring13"
  ],
  "Dragongrin charm": [
    "necklace",
    "samul17"
  ],
  "Dragongrip ring": [
    "ring",
    "sring17"
  ],
  "Dragonscale shield": [
    "shield",
    "sshield14"
  ],
  "Dragonwing cloak": [
    "cloack",
    "scloack16"
  ],
  "Druid bolero": [
    "relict",
    "druid_cloack"
  ],
  "Druid boots": [
    "relict",
    "druid_boots"
  ],
  "Druid charm": [
    "relict",
    "druid_amulet"
  ],
  "Dungeon crossbow": [
    "weapon",
    "dun_bow2"
  ],
  "Dungeon dagger": [
    "weapon",
    "dun_dagger2"
  ],
  "Dungeon ring": [
    "relict",
    "dering"
  ],
  "Dungeon signet-ring": [
    "ring",
    "dun_ring2"
  ],
  "Elven scout shirt": [
    "relict",
    "elfshirt"
  ],
  "Elves dagger": [
    "relict",
    "elfdagger"
  ],
  "Enchanted khopesh": [
    "weapon",
    "hopesh1"
  ],
  "Equilibrium blade": [
    "weapon",
    "broad_sword"
  ],
  "Fifth anniversary star": [
    "necklace",
    "5years_star"
  ],
  "Firebender crown": [
    "helm",
    "xymhelmet15"
  ],
  "Firebender mantle": [
    "cloack",
    "cloackwz15"
  ],
  "Firebender robe": [
    "cuirass",
    "robewz15"
  ],
  "Firebender staff": [
    "weapon",
    "ffstaff15"
  ],
  "Flame Dagger": [
    "weapon",
    "super_dagger"
  ],
  "Flame boots": [
    "boots",
    "boots15"
  ],
  "Flame helmet": [
    "helm",
    "myhelmet15"
  ],
  "Flame plate": [
    "cuirass",
    "armor15"
  ],
  "Flame shield": [
    "shield",
    "shield16"
  ],
  "Flask of Health": [
    "backpack",
    "flyaga"
  ],
  "Flute satire": [
    "necklace",
    "dudka"
  ],
  "Forest blade": [
    "weapon",
    "forest_blade"
  ],
  "Forest boots": [
    "boots",
    "forest_boots"
  ],
  "Forest bow": [
    "weapon",
    "forest_bow"
  ],
  "Forest charm": [
    "necklace",
    "neut_amulet"
  ],
  "Forest dagger": [
    "weapon",
    "forest_dagger"
  ],
  "Forest helmet": [
    "helm",
    "forest_helm"
  ],
  "Four-Leaved Clover": [
    "necklace",
    "4year_klever"
  ],
  "Fullmithril armor": [
    "cuirass",
    "miff_plate"
  ],
  "Galoshes of battle": [
    "boots",
    "boots2"
  ],
  "General`s ring": [
    "ring",
    "gring"
  ],
  "General`s signet-ring": [
    "ring",
    "gringd"
  ],
  "Gladiator axe": [
    "weapon",
    "taskaxe"
  ],
  "Gladius of presage": [
    "weapon",
    "sword18"
  ],
  "Gold survilurg ring": [
    "ring",
    "surv_wring2o"
  ],
  "Golden ankh": [
    "backpack",
    "ankh1"
  ],
  "Great dungeon dagger": [
    "weapon",
    "dun_dagger1"
  ],
  "Great dungeon signet-ring": [
    "ring",
    "dun_ring1"
  ],
  "Great helmet of dungeons": [
    "helm",
    "hm2"
  ],
  "Great hunter amulet": [
    "necklace",
    "gm_amul"
  ],
  "Great hunter armor": [
    "cuirass",
    "gm_arm"
  ],
  "Great hunter arrows": [
    "other",
    "gm_3arrows"
  ],
  "Great hunter boots": [
    "boots",
    "gm_spdb"
  ],
  "Great hunter bow": [
    "weapon",
    "gm_abow"
  ],
  "Great hunter helmet": [
    "helm",
    "gm_hat"
  ],
  "Great hunter knuckleduster": [
    "weapon",
    "gm_kastet"
  ],
  "Great hunter maskrobe": [
    "cloack",
    "gm_protect"
  ],
  "Great hunter ring of charm": [
    "ring",
    "gm_rring"
  ],
  "Great hunter ring of dexterity": [
    "ring",
    "gm_sring"
  ],
  "Great hunter shield": [
    "shield",
    "gm_defence"
  ],
  "Great hunter sword": [
    "weapon",
    "gm_sword"
  ],
  "Great leader sword": [
    "weapon",
    "polk_sword1"
  ],
  "Great magic temporal helmet": [
    "helm",
    "mhelmv1"
  ],
  "Great ocean amulet": [
    "necklace",
    "m_amul1"
  ],
  "Great ocean armor": [
    "cuirass",
    "m_armor1"
  ],
  "Great ocean boots": [
    "boots",
    "ocean_boots1"
  ],
  "Great ocean dagger": [
    "weapon",
    "ocean_dgr1"
  ],
  "Great ocean helmet": [
    "helm",
    "ocean_hlm1"
  ],
  "Great ocean shield": [
    "shield",
    "ocean_m_shield1"
  ],
  "Great ring of unity": [
    "ring",
    "ed_ring1"
  ],
  "Great temporal axe": [
    "weapon",
    "vtmaxe1"
  ],
  "Great temporal bow": [
    "weapon",
    "vbow1"
  ],
  "Great temporal cloak": [
    "cloack",
    "vtjcloak1"
  ],
  "Great temporal mantle": [
    "cloack",
    "mtcloak1"
  ],
  "Great temporal robe": [
    "cuirass",
    "tmarmor1"
  ],
  "Great temporal scroll": [
    "weapon",
    "vscroll-1"
  ],
  "Great temporal shoes": [
    "boots",
    "tj_mtuf1"
  ],
  "Great temporal sphere": [
    "backpack",
    "sph1"
  ],
  "Great temporal staff": [
    "weapon",
    "staff_v1"
  ],
  "Great temporal sword": [
    "weapon",
    "vtmsword1"
  ],
  "Great worldwalker sword": [
    "weapon",
    "mh_sword1"
  ],
  "Greater amulet of dungeons": [
    "necklace",
    "dun_amul1"
  ],
  "Greater armor of dungeons": [
    "cuirass",
    "dun_armor1"
  ],
  "Greater boots of dungeons": [
    "boots",
    "dun_boots1"
  ],
  "Greater crossbow of dungeons": [
    "weapon",
    "dun_bow1"
  ],
  "Greater shield of dungeons": [
    "shield",
    "dun_shield1"
  ],
  "Greater sword of dungeons": [
    "weapon",
    "dun_sword1"
  ],
  "Greater temporal amulet": [
    "necklace",
    "tj_magam1"
  ],
  "Greater temporal dagger": [
    "weapon",
    "vrdagger1"
  ],
  "Greater temporal magic ring": [
    "ring",
    "vmring1"
  ],
  "Greater temporal pendant": [
    "necklace",
    "tjam1"
  ],
  "Greater temporal ring": [
    "ring",
    "v-ring1"
  ],
  "Greater temporal signet-ring": [
    "ring",
    "vbolt1"
  ],
  "Greater worldwalker amulet": [
    "necklace",
    "mir_am1"
  ],
  "Guardian ring": [
    "ring",
    "dring9"
  ],
  "Guardian`s Potion": [
    "other",
    "potion06"
  ],
  "Hat of knowledge": [
    "helm",
    "knowledge_hat"
  ],
  "Hauberk": [
    "cuirass",
    "hauberk"
  ],
  "Hawk lord bulwark": [
    "shield",
    "sshield11"
  ],
  "Heavy leader boots": [
    "boots",
    "polkboots1"
  ],
  "Heavy leader helmet": [
    "helm",
    "polk__helm1"
  ],
  "Heavy leader сuirass": [
    "cuirass",
    "polk_armor1"
  ],
  "Heavy leader`s shield": [
    "shield",
    "bshield1"
  ],
  "Heavy mithril boots": [
    "boots",
    "mif_hboots"
  ],
  "Heavy mithril coif": [
    "helm",
    "mif_hhelmet"
  ],
  "Heavy temporal armour": [
    "cuirass",
    "tjarmor1"
  ],
  "Heavy temporal boots": [
    "boots",
    "tj_vboots1"
  ],
  "Heavy temporal helmet": [
    "helm",
    "tj_helmet1"
  ],
  "Heavy temporal shield": [
    "shield",
    "tj-shield1"
  ],
  "Heavy worldwalker armour": [
    "cuirass",
    "mir_armor1"
  ],
  "Helmet of courage": [
    "helm",
    "shelm8"
  ],
  "Helmet of dawn": [
    "helm",
    "helmet17"
  ],
  "Helmet of dungeons": [
    "helm",
    "hm1"
  ],
  "Helmet of grace": [
    "helm",
    "shelm16"
  ],
  "Helmet of sun": [
    "helm",
    "sun_helm"
  ],
  "Helmet of twilight": [
    "helm",
    "mhelmet17"
  ],
  "Hunter boots": [
    "boots",
    "hunter_boots1"
  ],
  "Hunter bow": [
    "weapon",
    "hunter_bow1"
  ],
  "Hunter broadsword": [
    "weapon",
    "hunter_sword1"
  ],
  "Hunter glove": [
    "other",
    "hunter_gloves1"
  ],
  "Hunter hat": [
    "helm",
    "hunter_hat1"
  ],
  "Hunter pendant": [
    "necklace",
    "hunter_pendant1"
  ],
  "Hunter shield": [
    "shield",
    "hunter_shield1"
  ],
  "Hunter shirt": [
    "cuirass",
    "hunter_jacket1"
  ],
  "Imperial award 7th grade": [
    "medals",
    "gnomewar7"
  ],
  "Imperial medal 2nd grade": [
    "medals",
    "kwar2"
  ],
  "Imperial medal 6th grade": [
    "medals",
    "kwar6"
  ],
  "Imperial order 1st grade": [
    "medals",
    "bwar1"
  ],
  "Imperial order 2nd grade": [
    "medals",
    "bwar2"
  ],
  "Imperial order 5th grade": [
    "medals",
    "bwar5"
  ],
  "Imperial order 6th grade": [
    "medals",
    "bwar6"
  ],
  "Imperial order 7th grade": [
    "medals",
    "bwar7"
  ],
  "Inquisitor boots": [
    "relict",
    "inq_boot"
  ],
  "Inquisitor chestguard": [
    "relict",
    "inq_body"
  ],
  "Inquisitor helm": [
    "relict",
    "inq_helm"
  ],
  "Inquisitor mantlet": [
    "relict",
    "inq_cl"
  ],
  "Inquisitor rod": [
    "relict",
    "inq_weap"
  ],
  "Invader flail": [
    "weapon",
    "bludgeon"
  ],
  "Jackal-warrior`s shield": [
    "shield",
    "e_shield1"
  ],
  "Jackal`s shield": [
    "shield",
    "e_shield2"
  ],
  "Jackboots of twilight": [
    "boots",
    "mboots17"
  ],
  "Knight Talisman": [
    "backpack",
    "znak1"
  ],
  "Large tribal totem": [
    "backpack",
    "totem1"
  ],
  "Leader helmet": [
    "helm",
    "polk__helm2"
  ],
  "Leader sword": [
    "weapon",
    "polk_sword2"
  ],
  "Leader сuirass": [
    "cuirass",
    "polk_armor2"
  ],
  "Leader`s shield": [
    "shield",
    "bshield2"
  ],
  "Leather armor": [
    "cuirass",
    "leather_shiled"
  ],
  "Leather boots": [
    "boots",
    "hunter_boots"
  ],
  "Leather harness": [
    "cuirass",
    "leatherplate"
  ],
  "Leather helmet": [
    "helm",
    "leather_helm"
  ],
  "Leather jackboots": [
    "boots",
    "leatherboots"
  ],
  "Legacy shield": [
    "shield",
    "shield_14y"
  ],
  "Lesser temporal ring": [
    "ring",
    "v-ring3"
  ],
  "Lesser temporal signet-ring": [
    "ring",
    "vbolt3"
  ],
  "Lich crown": [
    "helm",
    "necrohelm2"
  ],
  "Light  robber`s shield": [
    "shield",
    "rshield2"
  ],
  "Light adventurer`s armour": [
    "cuirass",
    "adv_armor2"
  ],
  "Light adventurer`s boots": [
    "boots",
    "adv_boot2"
  ],
  "Light adventurer`s bow": [
    "weapon",
    "adv_longbow2"
  ],
  "Light adventurer`s dagger": [
    "weapon",
    "a_dagger2"
  ],
  "Light adventurer`s helmet": [
    "helm",
    "adv_hm2"
  ],
  "Light armor of dungeons": [
    "cuirass",
    "dun_armor3"
  ],
  "Light axe": [
    "weapon",
    "gnome_hammer"
  ],
  "Light crossbow of dungeons": [
    "weapon",
    "dun_bow3"
  ],
  "Light dungeon dagger": [
    "weapon",
    "dun_dagger3"
  ],
  "Light leader helmet": [
    "helm",
    "polk__helm3"
  ],
  "Light leader sword": [
    "weapon",
    "polk_sword3"
  ],
  "Light leader сuirass": [
    "cuirass",
    "polk_armor3"
  ],
  "Light leader`s shield": [
    "shield",
    "bshield3"
  ],
  "Light magic temporal helmet": [
    "helm",
    "mhelmv3"
  ],
  "Light mithril boots": [
    "boots",
    "mif_lboots"
  ],
  "Light mithril coif": [
    "helm",
    "mif_lhelmet"
  ],
  "Light mithril cuirass": [
    "cuirass",
    "mif_light"
  ],
  "Light ocean dagger": [
    "weapon",
    "ocean_dgr3"
  ],
  "Light ocean helmet": [
    "helm",
    "ocean_hlm3"
  ],
  "Light ocean shield": [
    "shield",
    "ocean_m_shield3"
  ],
  "Light robber`s armour": [
    "cuirass",
    "rarmor2"
  ],
  "Light robber`s boots": [
    "boots",
    "rboots2"
  ],
  "Light robber`s helmet": [
    "helm",
    "rhelm2"
  ],
  "Light shield of dungeons": [
    "shield",
    "dun_shield3"
  ],
  "Light temporal boots": [
    "boots",
    "tj_vboots3"
  ],
  "Light temporal bow": [
    "weapon",
    "vbow3"
  ],
  "Light temporal cloak": [
    "cloack",
    "vtjcloak3"
  ],
  "Light temporal dagger": [
    "weapon",
    "vrdagger3"
  ],
  "Light temporal helmet": [
    "helm",
    "tj_helmet3"
  ],
  "Light temporal mantle": [
    "cloack",
    "mtcloak3"
  ],
  "Light temporal shield": [
    "shield",
    "tj-shield3"
  ],
  "Light temporal staff": [
    "weapon",
    "staff_v3"
  ],
  "Light worldwalker armour": [
    "cuirass",
    "mir_armor3"
  ],
  "Light worldwalker sword": [
    "weapon",
    "mh_sword3"
  ],
  "Locket of crystallized tears": [
    "necklace",
    "magic_amulet"
  ],
  "Lodestone golem shell": [
    "cuirass",
    "magneticarmor"
  ],
  "Longbow": [
    "weapon",
    "long_bow"
  ],
  "Lucky horseshoe": [
    "necklace",
    "samul8"
  ],
  "Lumberjack axe": [
    "weapon",
    "topor_drov"
  ],
  "Mage disciple Scroll": [
    "relict",
    "mage_scroll"
  ],
  "Mage disciple cape": [
    "relict",
    "mage_cape"
  ],
  "Mage disciple robe": [
    "relict",
    "mage_robe"
  ],
  "Mage instructor cloak": [
    "relict",
    "gmage_cloack"
  ],
  "Mage instructor overshoes": [
    "relict",
    "gmage_boots"
  ],
  "Mage instructor scroll": [
    "relict",
    "gmage_scroll"
  ],
  "Mage instructor staff": [
    "relict",
    "gmage_staff"
  ],
  "Magical ball": [
    "necklace",
    "sharik"
  ],
  "Mantle of eternity": [
    "cloack",
    "cloack17"
  ],
  "Manuscript of focus": [
    "weapon",
    "scroll18"
  ],
  "Manuscript of history": [
    "backpack",
    "10scroll"
  ],
  "Maskrobe": [
    "cloack",
    "scloack8"
  ],
  "Master hunter amulet": [
    "necklace",
    "hunter_amulet1"
  ],
  "Master hunter armor": [
    "cuirass",
    "hunter_armor1"
  ],
  "Master hunter arrows": [
    "other",
    "hunter_arrows1"
  ],
  "Master hunter bone helmet": [
    "helm",
    "hunter_roga1"
  ],
  "Master hunter boots": [
    "boots",
    "hunter_boots3"
  ],
  "Master hunter bow": [
    "weapon",
    "hunter_bow2"
  ],
  "Master hunter cutlass": [
    "weapon",
    "huntersword2"
  ],
  "Master hunter dagger": [
    "weapon",
    "hunterdagger"
  ],
  "Master hunter helmet": [
    "helm",
    "hunter_helm"
  ],
  "Master hunter jackboots": [
    "boots",
    "hunter_boots2"
  ],
  "Master hunter maskrobe": [
    "cloack",
    "hunter_mask1"
  ],
  "Master hunter ring of dexterity": [
    "ring",
    "hunter_ring2"
  ],
  "Master hunter ring of flight": [
    "ring",
    "hunter_ring1"
  ],
  "Master hunter sabre": [
    "weapon",
    "hunterdsword"
  ],
  "Master hunter shield": [
    "shield",
    "huntershield2"
  ],
  "Medal of bravery": [
    "necklace",
    "bravery_medal"
  ],
  "Mercenary armor": [
    "relict",
    "merc_armor"
  ],
  "Mercenary boots": [
    "relict",
    "merc_boots"
  ],
  "Merchant’s Boots": [
    "boots",
    "torg_boots"
  ],
  "Militant boots": [
    "relict",
    "knightboots"
  ],
  "Miner`s pickaxe": [
    "weapon",
    "tunnel_kirka"
  ],
  "Minor dungeon signet-ring": [
    "ring",
    "dun_ring3"
  ],
  "Minor pirate compass": [
    "backpack",
    "p_compas3"
  ],
  "Minor pirate dagger": [
    "weapon",
    "p_dag3"
  ],
  "Minor pirate handgun": [
    "weapon",
    "p_pistol3"
  ],
  "Minor pirate magic ring": [
    "ring",
    "pn_ring3"
  ],
  "Minor pirate ring": [
    "ring",
    "piring3"
  ],
  "Minor ring of unity": [
    "ring",
    "ed_ring3"
  ],
  "Minor robber`s necklace": [
    "necklace",
    "ramul2"
  ],
  "Minor robber`s ring": [
    "ring",
    "rogring2"
  ],
  "Minor worldwalker amulet": [
    "necklace",
    "mir_am3"
  ],
  "Mirror of change": [
    "backpack",
    "mirror"
  ],
  "Mithril dagger": [
    "weapon",
    "dagger_myf"
  ],
  "Mithril longsword": [
    "weapon",
    "mif_sword"
  ],
  "Mithril mail armour": [
    "cuirass",
    "sarmor9"
  ],
  "Mithril ring": [
    "ring",
    "dring12"
  ],
  "Mithril staff": [
    "weapon",
    "mif_staff"
  ],
  "Mystical amulet": [
    "necklace",
    "mmzamulet13"
  ],
  "Necklace of ultimate truth": [
    "necklace",
    "mamulet19"
  ],
  "Obsidian armour": [
    "cuirass",
    "sarmor13"
  ],
  "Obsidian baton": [
    "weapon",
    "mstaff13"
  ],
  "Obsidian boots": [
    "boots",
    "boots13"
  ],
  "Obsidian helmet": [
    "helm",
    "zxhelmet13"
  ],
  "Obsidian shield": [
    "shield",
    "shield13"
  ],
  "Obsidian sword": [
    "weapon",
    "ssword13"
  ],
  "Ocean amulet": [
    "necklace",
    "m_amul2"
  ],
  "Ocean armor": [
    "cuirass",
    "m_armor2"
  ],
  "Ocean dagger": [
    "weapon",
    "ocean_dgr2"
  ],
  "Ocean helmet": [
    "helm",
    "ocean_hlm2"
  ],
  "Ocean shield": [
    "shield",
    "ocean_m_shield2"
  ],
  "Ogre trophy club": [
    "weapon",
    "ogre_bum"
  ],
  "Orc tyrant helmet": [
    "helm",
    "orc_hat"
  ],
  "Order of Dark": [
    "necklace",
    "ord_dark"
  ],
  "Order of Endurance": [
    "medals",
    "bwar_stoj"
  ],
  "Order of Fearlessness": [
    "necklace",
    "castle_orden"
  ],
  "Order of Freedom 1st grade": [
    "medals",
    "demwar1"
  ],
  "Order of Freedom 4th grade": [
    "medals",
    "demwar4"
  ],
  "Order of Griffin": [
    "necklace",
    "order_griffin"
  ],
  "Order of Light": [
    "necklace",
    "ord_light"
  ],
  "Order of Manticore": [
    "necklace",
    "order_manticore"
  ],
  "Paladin battleplate": [
    "relict",
    "paladin_armor"
  ],
  "Paladin crossbow": [
    "relict",
    "paladin_bow"
  ],
  "Paladin headplate": [
    "relict",
    "paladin_helmet"
  ],
  "Pendant of Buffalo": [
    "necklace",
    "quest_pendant1"
  ],
  "Pendant of despair": [
    "necklace",
    "power_pendant"
  ],
  "Pendant of trinity": [
    "necklace",
    "trinitypendant"
  ],
  "Pendant of wrath": [
    "necklace",
    "wzzamulet13"
  ],
  "Penumbral ring": [
    "ring",
    "darkring"
  ],
  "Phoenix dagger": [
    "weapon",
    "dagger16"
  ],
  "Pirate bandana": [
    "helm",
    "piratehat3"
  ],
  "Pirate blade": [
    "weapon",
    "p_sword3"
  ],
  "Pirate boots": [
    "boots",
    "p_boots2"
  ],
  "Pirate cloak": [
    "cloack",
    "p_cloak2"
  ],
  "Pirate compass": [
    "backpack",
    "p_compas2"
  ],
  "Pirate frock": [
    "cuirass",
    "pir_armor2"
  ],
  "Pirate handgun": [
    "weapon",
    "p_pistol2"
  ],
  "Pirate hat": [
    "helm",
    "piratehat2"
  ],
  "Pirate magic ring": [
    "ring",
    "pn_ring2"
  ],
  "Pirate pendant": [
    "necklace",
    "p_amulet2"
  ],
  "Pirate ring": [
    "ring",
    "piring2"
  ],
  "Pirate sabre": [
    "weapon",
    "p_sword2"
  ],
  "Pirate shoes": [
    "boots",
    "p_boots3"
  ],
  "Pirate-captain boots": [
    "boots",
    "p_boots1"
  ],
  "Pirate-captain cloak": [
    "cloack",
    "p_cloak1"
  ],
  "Pirate-captain coat": [
    "cuirass",
    "pir_armor1"
  ],
  "Pirate-captain compass": [
    "backpack",
    "p_compas1"
  ],
  "Pirate-captain dagger": [
    "weapon",
    "p_dag1"
  ],
  "Pirate-captain handgun": [
    "weapon",
    "p_pistol1"
  ],
  "Pirate-captain hat": [
    "helm",
    "piratehat1"
  ],
  "Pirate-captain magic ring": [
    "ring",
    "pn_ring1"
  ],
  "Pirate-captain pendant": [
    "necklace",
    "p_amulet1"
  ],
  "Pirate-captain ring": [
    "ring",
    "piring1"
  ],
  "Pirate-captain sword": [
    "weapon",
    "p_sword1"
  ],
  "Platemail": [
    "cuirass",
    "full_plate"
  ],
  "Plunderer boots": [
    "thief",
    "tm_boots"
  ],
  "Plunderer cape": [
    "thief",
    "tm_cape"
  ],
  "Plunderer crossbow": [
    "thief",
    "tm_arb"
  ],
  "Plunderer harness": [
    "thief",
    "tm_armor"
  ],
  "Plunderer mask": [
    "thief",
    "tm_msk"
  ],
  "Plunderer necklace": [
    "thief",
    "tm_amulet"
  ],
  "Plunderer ring of sorcery": [
    "thief",
    "tm_mring"
  ],
  "Plunderer ring of swiftness": [
    "thief",
    "tm_wring"
  ],
  "Plunderer shiv": [
    "thief",
    "tm_knife"
  ],
  "Potion of art": [
    "other",
    "potion08"
  ],
  "Potion of dexterity": [
    "other",
    "potion03"
  ],
  "Potion of knowledge": [
    "other",
    "potion05"
  ],
  "Potion of protection": [
    "other",
    "potion02"
  ],
  "Potion of spells": [
    "other",
    "potion04"
  ],
  "Potion of strength": [
    "other",
    "potion01"
  ],
  "Prophet ring": [
    "ring",
    "powerring"
  ],
  "Ranger amulet": [
    "relict",
    "r_warriorsamulet"
  ],
  "Ranger bow": [
    "relict",
    "r_bow"
  ],
  "Ranger cap": [
    "relict",
    "r_helmb"
  ],
  "Ranger cloak": [
    "relict",
    "r_clck"
  ],
  "Ranger dagger": [
    "relict",
    "r_dagger"
  ],
  "Ranger scroll": [
    "relict",
    "r_goodscroll"
  ],
  "Recruit`s mail": [
    "cuirass",
    "student_armor"
  ],
  "Recruiter armour": [
    "verb",
    "v_1armor"
  ],
  "Recruiter boots": [
    "verb",
    "verbboots"
  ],
  "Recruiter helmet": [
    "verb",
    "ve_helm"
  ],
  "Recruiter shield": [
    "verb",
    "vrb_shild"
  ],
  "Recruiter sword": [
    "verb",
    "verb11_sword"
  ],
  "Reprisal sword": [
    "weapon",
    "def_sword"
  ],
  "Ring of abdication": [
    "ring",
    "circ_ring"
  ],
  "Ring of ambition": [
    "ring",
    "sring4"
  ],
  "Ring of balance": [
    "ring",
    "ttring"
  ],
  "Ring of cold": [
    "ring",
    "coldring_n"
  ],
  "Ring of contradictions": [
    "ring",
    "bring14"
  ],
  "Ring of dexterity": [
    "ring",
    "i_ring"
  ],
  "Ring of doubts": [
    "ring",
    "doubt_ring"
  ],
  "Ring of faith": [
    "ring",
    "dring5"
  ],
  "Ring of fiery gaze": [
    "ring",
    "dring15"
  ],
  "Ring of hope": [
    "ring",
    "dring18"
  ],
  "Ring of impetuosity": [
    "ring",
    "rashness_ring"
  ],
  "Ring of inspiration": [
    "ring",
    "verve_ring"
  ],
  "Ring of intrepidity": [
    "ring",
    "ring19"
  ],
  "Ring of sun": [
    "ring",
    "sun_ring"
  ],
  "Ring of thorns": [
    "ring",
    "sring10"
  ],
  "Ring of torment": [
    "ring",
    "wwwring16"
  ],
  "Ring of unity": [
    "ring",
    "ed_ring2"
  ],
  "Robber`s armour": [
    "cuirass",
    "rarmor1"
  ],
  "Robber`s axe": [
    "weapon",
    "raxe1"
  ],
  "Robber`s bag": [
    "backpack",
    "sumka"
  ],
  "Robber`s boots": [
    "boots",
    "rboots1"
  ],
  "Robber`s bow": [
    "weapon",
    "rbow1"
  ],
  "Robber`s cloak": [
    "cloack",
    "rcloak1"
  ],
  "Robber`s dagger": [
    "weapon",
    "rdagger1"
  ],
  "Robber`s helmet": [
    "helm",
    "rhelm1"
  ],
  "Robber`s light axe": [
    "weapon",
    "raxe2"
  ],
  "Robber`s light sword": [
    "weapon",
    "rsword2"
  ],
  "Robber`s necklace": [
    "necklace",
    "ramul1"
  ],
  "Robber`s pouch": [
    "backpack",
    "pouch"
  ],
  "Robber`s ring": [
    "ring",
    "rogring1"
  ],
  "Robber`s shield": [
    "shield",
    "rshield1"
  ],
  "Robber`s simple bow": [
    "weapon",
    "rbow2"
  ],
  "Robber`s simple dagger": [
    "weapon",
    "rdagger2"
  ],
  "Robber`s sword": [
    "weapon",
    "rsword1"
  ],
  "RuNet figurine 2009": [
    "shield",
    "ru_statue"
  ],
  "Ruby boots": [
    "boots",
    "sboots12"
  ],
  "Ruby gladius": [
    "weapon",
    "mm_sword"
  ],
  "Ruby helmet": [
    "helm",
    "shelm12"
  ],
  "Ruby quarterstaff": [
    "weapon",
    "mm_staff"
  ],
  "Runestone": [
    "backpack",
    "runkam"
  ],
  "Sacred crusader gonfalon": [
    "backpack",
    "krest1"
  ],
  "Sandglass": [
    "backpack",
    "sandglass"
  ],
  "Scout`s cape": [
    "cloack",
    "scoutcloack"
  ],
  "Scroll of energy": [
    "weapon",
    "energy_scroll"
  ],
  "Sentinel spear": [
    "weapon",
    "sunart1"
  ],
  "Servant of Darkness cloak": [
    "relict",
    "darkelfcloack"
  ],
  "Servant of Darkness cuirass": [
    "relict",
    "darkelfciras"
  ],
  "Shard of darkness": [
    "necklace",
    "smamul14"
  ],
  "Shield of cold": [
    "shield",
    "cold_shieldn"
  ],
  "Shield of dawn": [
    "shield",
    "shield19"
  ],
  "Shield of dungeons": [
    "shield",
    "dun_shield2"
  ],
  "Shield of glory": [
    "shield",
    "sshield5"
  ],
  "Shoes of aspiration": [
    "boots",
    "shoe_of_initiative"
  ],
  "Shortbow": [
    "weapon",
    "shortbow"
  ],
  "Sign of seven": [
    "necklace",
    "7ka"
  ],
  "Signet-ring of might": [
    "ring",
    "warriorring"
  ],
  "Signet-ring of unity": [
    "ring",
    "smring17"
  ],
  "Silver ankh": [
    "backpack",
    "ankh2"
  ],
  "Small tribal totem": [
    "backpack",
    "totem3"
  ],
  "Smoldering hammer": [
    "weapon",
    "firehammer"
  ],
  "Snake coil ring": [
    "ring",
    "ring2013"
  ],
  "Soldier boots": [
    "boots",
    "sboots9"
  ],
  "Sorcerer cape": [
    "cloack",
    "wiz_cape"
  ],
  "Sorcerer robe": [
    "cuirass",
    "wiz_robe"
  ],
  "Sorcerer sandals": [
    "boots",
    "wiz_boots"
  ],
  "Sorcerer signet": [
    "ring",
    "magring13"
  ],
  "Sphere of Mysteries": [
    "backpack",
    "msphere"
  ],
  "Staff of eclipse": [
    "weapon",
    "staff18"
  ],
  "Staff of oblivion": [
    "weapon",
    "smstaff16"
  ],
  "Staff of power": [
    "weapon",
    "sor_staff"
  ],
  "Staff of shadows": [
    "weapon",
    "mstaff10"
  ],
  "Staff of youth": [
    "weapon",
    "mstaff8"
  ],
  "Stalker cloak": [
    "cloack",
    "stalkercl"
  ],
  "Statue of kappa": [
    "backpack",
    "nefrit3"
  ],
  "Statue of myrmidon": [
    "backpack",
    "nefrit1"
  ],
  "Statue of priestess": [
    "backpack",
    "nefrit2"
  ],
  "Steel blade": [
    "weapon",
    "steel_blade"
  ],
  "Steel boots": [
    "boots",
    "steel_boots"
  ],
  "Steel buckler": [
    "shield",
    "s_shield"
  ],
  "Steel cuirass": [
    "cuirass",
    "ciras"
  ],
  "Steel helmet": [
    "helm",
    "steel_helmet"
  ],
  "Stellar ring": [
    "ring",
    "mmmring16"
  ],
  "Survilurg armour": [
    "cuirass",
    "surv_armorsu"
  ],
  "Survilurg blade": [
    "weapon",
    "surv_sword2sd"
  ],
  "Survilurg boots": [
    "boots",
    "surv_bootsurv"
  ],
  "Survilurg crossbow": [
    "weapon",
    "surv_crossbowsurv"
  ],
  "Survilurg dagger": [
    "weapon",
    "surv_daggermd"
  ],
  "Survilurg halberd ": [
    "weapon",
    "surv_halberdzg"
  ],
  "Survilurg magical armour": [
    "cuirass",
    "surv_marmoroz"
  ],
  "Survilurg magical boots": [
    "boots",
    "surv_mbootsbb"
  ],
  "Survilurg magical pendant": [
    "necklace",
    "surv_mamulka"
  ],
  "Survilurg magical ring": [
    "ring",
    "surv_mring1fd"
  ],
  "Survilurg mantle": [
    "cloack",
    "surv_mcloacksv"
  ],
  "Survilurg pendant": [
    "necklace",
    "surv_wamuletik"
  ],
  "Survilurg scroll": [
    "weapon",
    "surv_scrollcd"
  ],
  "Survilurg shield": [
    "shield",
    "surv_shieldvv"
  ],
  "Survilurg staff": [
    "weapon",
    "surv_staffik"
  ],
  "Survilurg sword": [
    "weapon",
    "surv_sword_surv"
  ],
  "Sword of cold": [
    "weapon",
    "cold_sword2014"
  ],
  "Sword of courage": [
    "weapon",
    "ssword10"
  ],
  "Sword of dungeons": [
    "weapon",
    "dun_sword2"
  ],
  "Sword of harmony": [
    "weapon",
    "ssword16"
  ],
  "Sword of might": [
    "weapon",
    "power_sword"
  ],
  "Sword of retribution": [
    "weapon",
    "requital_sword"
  ],
  "Sword of stiffness": [
    "weapon",
    "ssword8"
  ],
  "Tactician armor": [
    "tactic",
    "tactcv1_armor"
  ],
  "Tactician band of force": [
    "tactic",
    "tactwww_wring"
  ],
  "Tactician baton": [
    "tactic",
    "tactmag_staff"
  ],
  "Tactician bow": [
    "tactic",
    "tact765_bow"
  ],
  "Tactician charm": [
    "tactic",
    "tactms1_mamulet"
  ],
  "Tactician cloak": [
    "tactic",
    "tactpow_cloack"
  ],
  "Tactician dagger": [
    "tactic",
    "tactsm0_dagger"
  ],
  "Tactician hatchet": [
    "tactic",
    "tactaz_axe"
  ],
  "Tactician helmet": [
    "tactic",
    "tacthapp_helmet"
  ],
  "Tactician jackboots": [
    "tactic",
    "tactzl4_boots"
  ],
  "Tactician ring of wisdom": [
    "tactic",
    "tactspw_mring"
  ],
  "Tactician shield": [
    "tactic",
    "tactdff_shield"
  ],
  "Tactician war pendant": [
    "tactic",
    "tact1w1_wamulet"
  ],
  "Talisman of wardance": [
    "necklace",
    "wzzamulet16"
  ],
  "Templar crest": [
    "relict",
    "kn_helm"
  ],
  "Templar platemail": [
    "relict",
    "kn_body"
  ],
  "Temporal armour": [
    "cuirass",
    "tjarmor2"
  ],
  "Temporal boots": [
    "boots",
    "tj_vboots2"
  ],
  "Temporal bow": [
    "weapon",
    "vbow2"
  ],
  "Temporal cloak": [
    "cloack",
    "vtjcloak2"
  ],
  "Temporal dagger": [
    "weapon",
    "vrdagger2"
  ],
  "Temporal helmet": [
    "helm",
    "tj_helmet2"
  ],
  "Temporal magic ring": [
    "ring",
    "vmring2"
  ],
  "Temporal mantle": [
    "cloack",
    "mtcloak2"
  ],
  "Temporal pendant": [
    "necklace",
    "tjam2"
  ],
  "Temporal ring": [
    "ring",
    "v-ring2"
  ],
  "Temporal robe": [
    "cuirass",
    "tmarmor2"
  ],
  "Temporal scroll": [
    "weapon",
    "vscroll-2"
  ],
  "Temporal shield": [
    "shield",
    "tj-shield2"
  ],
  "Temporal shoes": [
    "boots",
    "tj_mtuf2"
  ],
  "Temporal signet-ring": [
    "ring",
    "vbolt2"
  ],
  "Temporal sphere": [
    "backpack",
    "sph2"
  ],
  "Temporal sword": [
    "weapon",
    "vtmsword2"
  ],
  "Thief amulet": [
    "thief",
    "thief_neckl"
  ],
  "Thief armor": [
    "thief",
    "thief_goodarmor"
  ],
  "Thief boots": [
    "thief",
    "thief_fastboots"
  ],
  "Thief cloak": [
    "thief",
    "thief_cape"
  ],
  "Thief crossbow": [
    "thief",
    "thief_arb"
  ],
  "Thief dagger": [
    "thief",
    "thief_ml_dagger"
  ],
  "Thief invitation": [
    "other",
    "thief_paper"
  ],
  "Thief mask": [
    "thief",
    "thief_msk"
  ],
  "Thief ring": [
    "thief",
    "ring_of_thief"
  ],
  "Tower shield": [
    "shield",
    "large_shield"
  ],
  "Tribal Talisman": [
    "backpack",
    "znak9"
  ],
  "Tribal aegis": [
    "relict",
    "sv_shield"
  ],
  "Tribal stompers": [
    "relict",
    "sv_boot"
  ],
  "Tribal totem": [
    "backpack",
    "totem2"
  ],
  "Triforce charm": [
    "necklace",
    "bafamulet15"
  ],
  "Troglodyte spear": [
    "weapon",
    "trogloditkop"
  ],
  "Twilight piercer": [
    "weapon",
    "bow17"
  ],
  "Unholy blackshard": [
    "weapon",
    "blacksword"
  ],
  "Unholy knight helmet": [
    "helm",
    "necrohelm3"
  ],
  "Unruly barbarian greatsword": [
    "relict",
    "nv_weap"
  ],
  "Unruly barbarian harness": [
    "relict",
    "nv_body"
  ],
  "Unruly barbarian helmet": [
    "relict",
    "nv_helm"
  ],
  "Unruly barbarian nonagon targe": [
    "relict",
    "nv_shield"
  ],
  "Warlock crown": [
    "helm",
    "mhelmetzh13"
  ],
  "Warlock jackboots": [
    "boots",
    "mboots14"
  ],
  "Warrior elf shield": [
    "relict",
    "welfshield"
  ],
  "Warrior pendant": [
    "necklace",
    "warrior_pendant"
  ],
  "Warrior`s potion": [
    "other",
    "potion07"
  ],
  "Wizard Talisman": [
    "backpack",
    "znak3"
  ],
  "Wizard attire": [
    "cuirass",
    "mage_armor"
  ],
  "Wizard cap": [
    "helm",
    "wizard_cap"
  ],
  "Wizard helmet": [
    "helm",
    "mage_helm"
  ],
  "Wooden sword": [
    "weapon",
    "wood_sword"
  ],
  "Worldwalker amulet": [
    "necklace",
    "mir_am2"
  ],
  "Worldwalker armour": [
    "cuirass",
    "mir_armor2"
  ],
  "Worldwalker sword": [
    "weapon",
    "mh_sword2"
  ]
} ;

}