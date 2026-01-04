// ==UserScript==
// @name         VirtuDreams
// @namespace    https://virtu.pet/userlookup/?user=aviivix
// @version      0.1.9
// @description  The VirtuPets Dream Database!
// @author       Aviivix
// @match        https://virtu.pet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtu.pet
// @grant        GM_xmlhttpRequest
// @connect      virtudreams-default-rtdb.firebaseio.com
// @connect      console.firebase.google.com
// @downloadURL https://update.greasyfork.org/scripts/466866/VirtuDreams.user.js
// @updateURL https://update.greasyfork.org/scripts/466866/VirtuDreams.meta.js
// ==/UserScript==

'use strict';

//================================================================================
// Initialization
//================================================================================

// Fetch Username
var user = document.getElementsByClassName("username sf")[0].textContent

// TODO: Add some clause for if the user is "guest" because I see a lot of dummy database entries when people go to the dashboard when not logged in.

// Initializing the items and users variables...
var users
var items

// Initializing the useful desired items array, to be populated with names of items desired by at least one person
var desired_items = []

// Shop names and icons for UI purposes.
var shops = [{"name": "Fresh Foods", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/4353.gif"}, {"name": "Kauvara's Magic Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/14998.gif"}, {"name": "Toy Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/2944.gif"}, {"name": "Uni's Clothing Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/8494.gif"}, {"name": "Grooming Parlour", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/8721.gif"}, {"name": "", "ic": ""}, {"name": "Magical Bookshop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/11262.gif"}, {"name": "Wizards Trading Card Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/trading_card/malevolent_sentient_poogle_plushie__tcg_.gif"}, {"name": "Battle Magic", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/8966.gif"}, {"name": "Defence Magic", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/7286.gif"}, {"name": "", "ic": ""}, {"name": "Neopian Garden Centre", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/34038.gif"}, {"name": "Neopian Pharmacy", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/1405.gif"}, {"name": "Chocolate Factory", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/353.gif"}, {"name": "Bakery", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/27228.gif"}, {"name": "Health Foods", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/491.gif"}, {"name": "Neopian Gift Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/887.gif"}, {"name": "Smoothie Store", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/367.gif"}, {"name": "", "ic": ""}, {"name": "Tropical Food", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/19609.gif"}, {"name": "Tiki Tack", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/island_merchandise/tombola_keyring.gif"}, {"name": "Grundos Cafe", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/18817.gif"}, {"name": "Space Weaponry", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/10765.gif"}, {"name": "Space Armour", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/5661.gif"}, {"name": "Neopian Petpet Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/424.gif"}, {"name": "Robo-Petpet Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/3748.gif"}, {"name": "The Rock Pool", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/3514.gif"}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "Spooky Food", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/19679.gif"}, {"name": "Spooky Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/212.gif"}, {"name": "The Apothecary", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/mystic_mushroom/ugly_mushroom.gif"}, {"name": "", "ic": ""}, {"name": "The Coffee Cove", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/20059.gif"}, {"name": "Slushie Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/22728.gif"}, {"name": "Ice Crystal Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/316.gif"}, {"name": "Super Happy Icy Fun Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/18566.gif"}, {"name": "Faerieland Bookshop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/3698.gif"}, {"name": "Faerie Foods", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/573.gif"}, {"name": "Faerieland Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/19000.gif"}, {"name": "Neopian Furniture", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/18416.gif"}, {"name": "Tyrannian Foods", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/3569.gif"}, {"name": "Tyrannian Furniture", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/24123.gif"}, {"name": "Tyrannian Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/15605.gif"}, {"name": "Tyrannian Weaponry", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/21410.gif"}, {"name": "Hubert's Hot Dogs", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/22843.gif"}, {"name": "Pizzaroo", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/5300.gif"}, {"name": "Usukiland", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/2782.gif"}, {"name": "Lost Desert Foods", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/653.gif"}, {"name": "Peopatra's Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/13969.gif"}, {"name": "Sutek's Scrolls", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/4643.gif"}, {"name": "", "ic": ""}, {"name": "Neopian School Supplies", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/26953.gif"}, {"name": "Sakhmet Battle Supplies", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/610.gif"}, {"name": "Osiri's Pottery", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/33582.gif"}, {"name": "Merifoods", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/9929.gif"}, {"name": "Ye Olde Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/13356.gif"}, {"name": "Neopian Post Office", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/9233.gif"}, {"name": "Haunted Weaponry", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/9263.gif"}, {"name": "Spooky Furniture", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/2680.gif"}, {"name": "Wintery petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/15845.gif"}, {"name": "Jelly Foods", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/1745.gif"}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "Kiko Lake Treats", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/2798.gif"}, {"name": "Kiko Lake Carpentry", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/16287.gif"}, {"name": "Collectable Coins", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/14168.gif"}, {"name": "Petpet Supplies", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/37530.gif"}, {"name": "Booktastic Books", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/237.gif"}, {"name": "Kreludan Homes", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/943.gif"}, {"name": "Cafe Kreludor", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/15486.gif"}, {"name": "Kayla's Potion Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/2557.gif"}, {"name": "Darigan Toys", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/26285.gif"}, {"name": "Faerie Furniture", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/16538.gif"}, {"name": "Roo Island Souvenirs", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/34429.gif"}, {"name": "Brightvale Books", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/21710.gif"}, {"name": "The Scrollery", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/4511.gif"}, {"name": "Brightvale Glaziers", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/3139.gif"}, {"name": "Brightvale Armoury", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/5519.gif"}, {"name": "Brightvale Fruits", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/2518.gif"}, {"name": "Brightvale Motery", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/617.gif"}, {"name": "Royal Potionery", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/9397.gif"}, {"name": "Neopian Music Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/9141.gif"}, {"name": "Lost Desert Medicine", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/4661.gif"}, {"name": "Collectable Sea Shells", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/7147.gif"}, {"name": "Maractite Marvels", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/8999.gif"}, {"name": "Maraquan Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/8537.gif"}, {"name": "Geraptiku Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/8125.gif"}, {"name": "Qasalan Delights", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/4333.gif"}, {"name": "Desert Arms", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/1266.gif"}, {"name": "Words of Antiquity", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/21769.gif"}, {"name": "Faerie Weapon Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/10681.gif"}, {"name": "Illustrious Armoury", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/5355.gif"}, {"name": "Exquisite Ambrosia", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/5338.gif"}, {"name": "Magical Marvels", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/888.gif"}, {"name": "Legendary Petpets", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/977.gif"}, {"name": "Plushie Palace", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/11478.gif"}, {"name": "", "ic": ""}, {"name": "Wonderous Weaponry", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/14718.gif"}, {"name": "Shenkuu Farm Market", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/14504.gif"}, {"name": "Remarkable Restoratives", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/14524.gif"}, {"name": "Fanciful Fauna", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/26561.gif"}, {"name": "Chesterdrawers' Antiques", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/21016.gif"}, {"name": "The Crumpet Monger", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/8338.gif"}, {"name": "Neovian Printing Press", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/22275.gif"}, {"name": "Prigpants & Swolthy, Tailors", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/21010.gif"}, {"name": "Collectable Card Shop", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/4640.gif"}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "Springy Things", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/misc/shops_dir/5743.gif"}, {"name": "Shosple Colupis' Scrupulous Solutions", "ic": "https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/magic_item/yuletide_zafara_morphing_potion.gif"}, {"name": "", "ic": ""}, {"name": "", "ic": ""}, {"name": "", "ic": ""}]
var special_shops = {"Krawk Island Nippers": ["https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/pirate_petpet/swabby.gif", "/krawkisland/petpets"], "The Hidden Tower": ["https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/toy/faerie_queen_doll.gif", "/faerieland/hiddentower938"], "The Virtu.Pet Mall": ["https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/special/one_use_robotification_zappermajig.gif", "/space/vpmall"]}

// Initializing the variable to check if we failed to connect to VirtuDreams.
var load_fail = false

// Fetching items if you're on a page that needs it. These have to run before anything else and initiate the loading sequence.
if (document.URL.startsWith("https://virtu.pet/searc") || document.URL.startsWith("https://virtu.pet/viewsho") || document.URL.startsWith("https://virtu.pet/aviivix/~scrip") || document.URL.startsWith("https://virtu.pet/inventor") || document.URL.startsWith("https://virtu.pet/safetydeposi")) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://virtudreams-default-rtdb.firebaseio.com/items.json",
        onload: function(response) {
            items = JSON.parse(response.responseText)
            loaded()
        }
    })

    // Fetching users...
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://virtudreams-default-rtdb.firebaseio.com/users.json",
        onload: function(response) {
            users = JSON.parse(response.responseText)
            loaded()
        }
    });
}


//================================================================================
// Generic Functions
//================================================================================


// BOOL - Check if user wants an item
function dreamerWantsItem(item, dreamer) {
    // Item not in database at all.
    if (!items.hasOwnProperty(item)) { return false }
    // Item was in database, but no longer has any users searching for it.
    if (!items[item].hasOwnProperty('users')) { return false }
    // User is searching for item.
    if (items[item].users.hasOwnProperty(dreamer)) { return true }
    // User is not searching for item.
    return false
}


// ARRAY - List users who want an item
function item_dreamers(item) {
    // Item not in database at all.
    if (!items.hasOwnProperty(item)) { return [] }
    // Item was in database, but no longer has any users searching for it.
    if (!items[item].hasOwnProperty('users')) { return [] }
    // Item has users searching for it.
    return Object.keys(items[item].users)
}


// OBJECT - Information on items a dreamer wants
function dreamer_items(dreamer) {
    let dreamed_items = {}
    for (let item in items) {
        if (dreamerWantsItem(item, dreamer)) { dreamed_items[item] = items[item].users[dreamer] }
    }
    return dreamed_items
}


// STRING - Lowercase and replace special characters with _ (mainly for ids and vp image urls)
function vpify(item) {
    const underscore_regex = /[ ()<>!+.,\-#:]/g;
    const removal_regex = /'/g;
    return item.replace(underscore_regex, '_').replace(removal_regex, '').toLowerCase()
}


//================================================================================
// Page Detection and Load Sequence
//================================================================================
function loaded() {
    // Initialize miscellaneous variables
    for (let item in items) {
        if (item_dreamers(item) == 0) { continue }
        desired_items.push(item)
    }

    if (items === undefined || users === undefined) {
        // This should happen once, but if it happens twice then it means the load failed.
        if (load_fail) { console.log('Failed to connect to VirtuDreams.') } else { load_fail = true }
        return
    }
    if (document.URL.startsWith("https://virtu.pet/search/?")) {
        // Does nothing if you're on a search list... will highlight desired items later.
        return
    } else if (document.URL.startsWith("https://virtu.pet/search/")) {
        // Item information page.
        search_header()
        item_lookup_debug()
    } else if (document.URL.startsWith("https://virtu.pet/inventor")) {
        // Inventory highlighter.
        inventory()
    } else if (document.URL.startsWith("https://virtu.pet/safetydeposi")) {
        // SDB highlighter.
        deposit()
    } else if (document.URL.startsWith("https://virtu.pet/viewshop")) {
        // Shop highlighter.
        shop()
    } else if (document.URL.startsWith("https://virtu.pet/aviivix/~scrip")) {
        // Dashboard
        dashboard()
    }
}




//================================================================================
// Pages
//================================================================================


///// Inventory /////
//--------------------------------------------------------------------------------
function inventory() {
    let inv_items = document.getElementsByClassName("inventory-grid")[0].children
    console.log(inv_items)
    for (let x = 0; x < inv_items.length; x++) {
        let item = inv_items[x].children[1].innerHTML
        if (item_dreamers(item).length > 0) {
            inv_items[x].style.backgroundColor = "#ffff88"
            inv_items[x].innerHTML += `<div class="sf">${item_dreamers(item).length} seeking!</div>`
        }
    }
}


///// Safety Deposit Box /////
//--------------------------------------------------------------------------------
function deposit() {
    let inv_items = document.getElementsByClassName("striped-table")[0].children[1].children
    console.log(inv_items)
    for (let x = 0; x < inv_items.length; x++) {
        let item = inv_items[x].children[1].firstChild.textContent.trim()
        console.log(item)
        if (item_dreamers(item).length > 0) {
            inv_items[x].style.backgroundColor = "#ffff88"
            inv_items[x].children[1].innerHTML += `<br><div class="sf">${item_dreamers(item).length} seeking!</div>`
        }
    }
}


///// Shops /////
//--------------------------------------------------------------------------------
function shop() {
    let inv_items = document.getElementsByClassName("shop-grid-item")
    var names = document.getElementsByClassName("item-name");
    console.log(inv_items)
    for (let x = 0; x < inv_items.length; x++) {
        let item = names[x].children[0].textContent
        console.log(item)
        if (item_dreamers(item).length > 0) {
            inv_items[x].style.backgroundColor = "#ffff88"
            inv_items[x].children[1].innerHTML += `<div class="sf">${item_dreamers(item).length} seeking!</div>`
        }
    }
}


///// Item Lookup /////
//--------------------------------------------------------------------------------
function search_header() {
    let pteri = document.createElement("div");
    pteri.innerHTML = `<div id="new_dream_button"><input type="image" src="https://cdn.discordapp.com/attachments/709603171449700373/1106795982835957870/pixiepteri1.png" name="newDream" id="newDream" /></div>`
    let banner = document.getElementsByClassName("site-banner")[0]
    banner.appendChild(pteri)
    let main_content = document.getElementsByClassName("main-content")[0]
    let item_info = document.getElementsByClassName("item-info")[0].children[1].children
    let itemname = item_info[0].children[0].innerText
    let dreamers = item_dreamers(itemname)
    if (dreamers.length > 0) {
        let html = `<br><br><table width="515px" style="margin-top:15px;" class="qstable" align="center"><tbody><tr><th style="background-color:#efedc0; width:150px; height:25px; font-size:10pt; padding-bottom:2px; padding-top:2px;">Dreamer</th><th style="background-color: #efedc0; font-size: 10pt; padding-bottom: 2px; padding-top:2px;">Details</th><th style="background-color: #efedc0; font-size: 10pt; padding-bottom: 2px; padding-top:2px; width:75px;">Qty</th></tr>`
        for (let x = 0; x < dreamers.length; x++) {
            html += `<tr height="30" align="center"><td align="center"><b><a href="/userlookup/?user=${dreamers[x]}">${dreamers[x]}</a></b></td><td align="center">${items[itemname].users[dreamers[x]].desc}</td><td align="center">${items[itemname].users[dreamers[x]].qty}</td></tr>`
        }
        html += `</tbody></table>`
        main_content.innerHTML += html
    }
    let new_dream_button = document.querySelector ("#new_dream_button");
    if (new_dream_button) {
        new_dream_button.addEventListener ("click", add_dream , false);
    }
}


// Add Dream Button
function add_dream(zEvent) {
    let new_dream_form = document.createElement("div");
    let main_content = document.getElementsByClassName("main-content")[0]
    let content = document.getElementsByClassName("content")[0]
    main_content.appendChild(new_dream_form)
    main_content.insertBefore(new_dream_form, content)
    if (!users.hasOwnProperty(user)) {
        new_dream_form.innerHTML = `<p align="center">Woah, hold on! You haven't given us <a href="https://virtu.pet/aviivix/~script#panel"><b>permission</b></a> to store this information yet!</p>`
        main_content.appendChild(new_dream_form)
        main_content.insertBefore(new_dream_form, content)
        return
    }

    // Basic dream item info
    let dream = { "category": null, "icon": null, "id": document.URL.substring(25), "rarity": null, "shop": "None"}

    // Basic item info from the top half of the info panel... self-explanitory
    let item_info = document.getElementsByClassName("item-info")[0].children[1].children
    let itemname = item_info[0].children[0].innerText
    dream.rarity = parseInt(item_info[1].children[0].innerText)
    dream.category = item_info[2].children[0].innerText

    // Finding the shop info
    let shop_name = "None"
    // The first element in the item sources grid, will either be the shop the item stocks at or SW search link
    let shop_container_element = document.getElementsByClassName("flex-wrap")[0].children[0].children[1]
    // Shop text start with "This item" (Hidden Tower/VP Mall items switch "stocks at" with "is for sale at")
    if (shop_container_element.innerText.startsWith("This item ")) {
        let shop_a_element = shop_container_element.children[shop_container_element.children.length - 1]
        if ( shop_a_element.innerText.startsWith("Hidden Tower") ) {
            shop_name = "The Hidden Tower"
        } else if ( shop_a_element.innerText.startsWith("Krawk Island Nippers") ) {
            shop_name = "Krawk Island Nippers"
        } else if ( shop_a_element.innerText.startsWith("VP Mall") ) {
            shop_name = "The Virtu.Pet Mall"
        } else {
            // Just the id of the shop found in the link
            shop_name = shop_a_element.href.substring(27)
        }
    }
    dream.shop = shop_name

    // Finding the item icon
    let icon_element = document.getElementsByClassName("item-image")[0].children[0]
    let icon = "https://cdn.discordapp.com/attachments/709603171449700373/1114605717727477941/image.png"
    if (icon_element.nodeName == "IMG") {
        icon = icon_element.src
    } else {
        // afaik TCGs should be the only items that fuck this up so this should fix them
        icon = `https://virtupetsbucket.s3.us-east-2.amazonaws.com/images/items/trading_card/${vpify(itemname)}.gif`
    }
    dream.icon = icon

    // Dream form itself
    new_dream_form.innerHTML = `<div id="new_dream_form" align="center"><p><b>How many of this item do you wish for?</b></p><p><input type="text" id="qty" maxlength="10" size="6"></p><p><b>Any info, like what you want it for or what you'd offer for it?</b></p><p><input type="text" id="desc" maxlength="255" size="80"></p><p><input type="submit" value="Add Dream!" id="add_dream_button"></p></div>`
    let add_dream_button = document.querySelector ("#add_dream_button");
    if (add_dream_button) {
        add_dream_button.addEventListener ("click", function(){
            console.log(JSON.stringify(dream))
            let qty = document.querySelector ("#qty").value
            let desc = document.querySelector ("#desc").value
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `https://virtudreams-default-rtdb.firebaseio.com/items/${itemname}/users/${user}.json`,
                data: `{ "desc": "${desc}", "qty": "${qty}" }`,
                onload: function(response) {
                    new_dream_form.innerHTML = `<p align="center">Your Dream has been added! To view, edit or remove this Dream, visit your <a href="/aviivix/~script#panel"><b>Dashboard</b></a>.</p>`
                }
            });
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `https://virtudreams-default-rtdb.firebaseio.com/items/${itemname}/data.json`,
                data: JSON.stringify(dream),
                onload: function(response) {
                    new_dream_form.innerHTML = `<p align="center">Your Dream has been added! To view, edit or remove this Dream, visit your <a href="/aviivix/~script#panel"><b>Dashboard</b></a>.</p>`
                }
            });
        } , false);
    }
}


function item_lookup_debug() {
}


///// Dashboard /////
//--------------------------------------------------------------------------------
function dashboard() {
    // ---- Telling the database that you're still alive (only if youve given permission) ----
    if (users.hasOwnProperty(user)) {
        GM_xmlhttpRequest({
            method: "PATCH",
            url: `https://virtudreams-default-rtdb.firebaseio.com/users.json`,
            data: `{ "${user}": "${Date.now()}" }`
        });
    }
    // ---- Initializing Elements ----
    var content = document.getElementsByClassName("settings")[0]
    // Removing the VirtuScript dummy text if VirtuDreams is the first script to trigger.
    if (content.textContent == "Whoops! You don't seem to have any VirtuScripts installed that use the Dashboard.") {
        content.textContent = ""
    }
    // Header
    var divHeader = document.createElement("div");
    divHeader.innerHTML = `<p><b>VirtuDreams</b></p>`
    content.appendChild(divHeader)
    // VirtuDreams Connection Message
    var divContent = document.createElement("div");
    divContent.innerHTML = `<p><img src="https://cdn.discordapp.com/emojis/905527527655735349.gif?size=96&quality=lossless" height=15> Connecting to the Dream Database...</p>`
    content.appendChild(divContent)
    // VirtuDreams Main
    var divMain = document.createElement("div");
    divMain.innerHTML = dream_main()
    content.appendChild(divMain)
    // Dream Browser
    var browser_page = 0
    var divBrowser = document.createElement("div");
    var divBrowserItems = document.createElement("div");
    var divBrowserButtons = document.createElement("div");
    divBrowserItems.innerHTML = dream_browser(browser_page);
    divBrowserButtons.innerHTML = `<button style="font-family: verdana; background: none; border: none; font-weight: bold; cursor: pointer; color: #000099" id="browser_previous" value="Previous">« Previous</button> | <button style="font-family: verdana; background: none; border: none; font-weight: bold; cursor: pointer; color: #000099" id="browser_next" value="Next">Next »</button>`
    divBrowserButtons.align = "center";
    divBrowser.appendChild(divBrowserItems)
    divBrowser.appendChild(divBrowserButtons)
    content.appendChild(divBrowser)
    divBrowser.style.display = "none"
    // Your Dreams
    var divDreams = document.createElement("div");
    dream_list(divDreams)
    content.appendChild(divDreams)
    divDreams.style.display = "none"
    // Divider
    var divider = document.createElement("div");
    divider.innerHTML = `<hr align="center" noshade="" size="1" style="margin-top: 20px; margin-bottom: 20px;">`
    content.appendChild(divider)
    // ---- Setting Welcome Message ----
    // Welcome Message
    if (users.hasOwnProperty(user)) {
        // Dreamer Welcome Message
        divContent.innerHTML = `<p>Welcome back to VirtuDreams, <b>${user}</b>.</p><p align="center"><button style="font-family: verdana; background: none; border: none; font-weight: bold; cursor: text;" id="main_toggle" value="Main">Main</button> | <button style="font-family: verdana; color: #000099; background: none; border: none; font-weight: bold; cursor: pointer;" id="browser_toggle" value="Dream Browser">Dream Browser</button> | <button style="font-family: verdana; color: #000099; background: none; border: none; font-weight: bold; cursor: pointer;" id="dreams_toggle" value="Your Dreams">Your Dreams</button></p>`
    } else {
        // Non-Dreamer Welcome Message
        divContent.innerHTML = `<p>Welcome to VirtuDreams, <b>${user}</b>! It looks like you've never listed a Dream before. Don't worry, you can still browse Dreams without adding your own. But if you want to list your own Dreams, we want to make sure you know that the data (your username and the items you add) will be stored on an <i>external</i> database that is not affiliated with VirtuPets.<br><br>Also, to avoid items being highlighted when their dreamer is inactive, you will need to visit this page at least once every 30 days just to let the database know you're still around. (As such, we have to privately store the timestamp of your last visit.)</p><p align="center">You cool with that?<br><br><input type="submit" value="Sounds good!" id="agree_button"></p>`
        var agree_button = document.querySelector ("#agree_button");
        if (agree_button) {
            agree_button.addEventListener ("click", function() {
                GM_xmlhttpRequest({
                    method: "PATCH",
                    url: `https://virtudreams-default-rtdb.firebaseio.com/users.json`,
                    data: `{ "${user}": "${Date.now()}" }`,
                    onload: function(response) {
                        divContent.innerHTML = `<p>Awesome! Welcome to VirtuDreams, <b>${user}</b>! You can click on the Faerie Pteri on item search pages to add them to your Dreams.</p>`
                    }
                });
            } , false);
        }
    }
    // ---- Listeners ----
    // Rmv Buttons for your Dreamlist
    for (let item in dreamer_items(user)) {
        let item_id = vpify(item)
        let rmv_button = document.getElementById(`rmv_${item_id}`);
        rmv_button.addEventListener ("click", function(){
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `https://virtudreams-default-rtdb.firebaseio.com/items/${item}/users.json`,
                data: `{ "${user}": null }`,
                onload: function(response) {
                    location.reload();
                }
            });
        } , false);
    }

    // Browser Pagination Buttons
    let browser_previous = document.getElementById(`browser_previous`);
    let browser_next = document.getElementById(`browser_next`);

    browser_previous.addEventListener ("click", function(){
        if (browser_page == 0) { return }
        browser_page += -1
        divBrowserItems.innerHTML = dream_browser(browser_page)
    } , false)

    browser_next.addEventListener ("click", function(){
        if (browser_page == (Math.ceil(desired_items.length / 52) - 1)) { return }
        browser_page += 1
        divBrowserItems.innerHTML = dream_browser(browser_page)
    } , false)

    // TODO: Make this prettier and not just redundant (right now it gets the job done)
    let main_toggle = document.getElementById(`main_toggle`);
    let browser_toggle = document.getElementById(`browser_toggle`);
    let dreams_toggle = document.getElementById(`dreams_toggle`);

    main_toggle.addEventListener ("click", function(){
        divMain.style.display = "inline"
        divBrowser.style.display = "none"
        divDreams.style.display = "none"
        main_toggle.style.color = "#000000"
        browser_toggle.style.color = "#000099"
        dreams_toggle.style.color = "#000099"
        main_toggle.style.cursor = "text"
        browser_toggle.style.cursor = "pointer"
        dreams_toggle.style.cursor = "pointer"
    } , false)

    browser_toggle.addEventListener ("click", function(){
        divMain.style.display = "none"
        divBrowser.style.display = "inline"
        divDreams.style.display = "none"
        main_toggle.style.color = "#000099"
        browser_toggle.style.color = "#000000"
        dreams_toggle.style.color = "#000099"
        main_toggle.style.cursor = "pointer"
        browser_toggle.style.cursor = "text"
        dreams_toggle.style.cursor = "pointer"
    } , false)

    dreams_toggle.addEventListener ("click", function(){
        divMain.style.display = "none"
        divBrowser.style.display = "none"
        divDreams.style.display = "inline"
        main_toggle.style.color = "#000099"
        browser_toggle.style.color = "#000099"
        dreams_toggle.style.color = "#000000"
        main_toggle.style.cursor = "pointer"
        browser_toggle.style.cursor = "pointer"
        dreams_toggle.style.cursor = "text"
    } , false)
}


// VirtuDreams Main Page
function dream_main() {
    // Dreamiest Shops
    let dreamiest_shops = {}
    // Top Items
    let top_items = []
    // Simple Dreams
    let simple_dreams = []
    for (let item in items) {
        // Ignore items with no dreamers
        if (item_dreamers(item).length == 0) { continue }
        // Simple Dream check
        if (items[item].data.rarity < 80 && items[item].data.shop != "None") { simple_dreams.push(item) }
        // Dreamy Shop counting as long as the shop is not None
        if (items[item].data.shop !== "None") {
            if (dreamiest_shops.hasOwnProperty(items[item].data.shop)) { dreamiest_shops[items[item].data.shop] += 1 } else { dreamiest_shops[items[item].data.shop] = 1 }
        }
        // Top items counting
        top_items.push([item, item_dreamers(item).length])
    }
    // i lost track of the sorting code here i think part of this is based on stackoverflow bc i dont usually use anonymous functions like this
    let t_ar = []
    for (let shop in dreamiest_shops) { t_ar.push([shop, dreamiest_shops[shop]]) }
    t_ar.sort(function(a, b) {return a[1] - b[1];})
    t_ar.reverse()
    top_items.sort(function(a, b) {return a[1] - b[1];})
    top_items.reverse()
    // HTML for the stuff
    let html = `<p><b>Dreamiest Shops</b></p><p>These shops stock many sought-after items!</p><div class="item-grid">`
    let limit
    if ( t_ar.length <= 16 ) { limit = t_ar.length } else { limit = 16 }
    for (let x = 0; x < limit; x++) {
        // ["Shop ID", "People who want items here"]
        let shop = t_ar[x]
        // Link, Icon, Name, Amount of Items Dreamed For
        let shop_data = []
        if (isNaN(parseInt(shop[0]))) {
            shop_data = [
                special_shops[shop[0]][1],
                special_shops[shop[0]][0],
                shop[0],
                shop[1]
            ]
        } else {
            shop_data = [
                `/viewshop/${shop[0]}`,
                shops[shop[0]-1].ic,
                shops[shop[0]-1].name,
                shop[1]
            ]
        }
        html += `<div class="item-grid-item"><a href="${shop_data[0]}"><img src="${shop_data[1]}" class="border" style="margin-bottom:4px;"></a><br><b>${shop_data[2]}</b><br>${shop_data[3]} dream items!</div>`
    }
    html += `</div><br><p><b>Dreamiest Items</b></p><p>These are the most dreamed-of items in our database!</p><div class="item-grid">`
    if ( top_items.length <= 16 ) { limit = top_items.length } else { limit = 16 }
    for (let x = 0; x < limit; x++) {
        let item_data = top_items[x]
        let item = item_data[0]
        if (item_dreamers(item) == 0) { continue }
        html += `<div class="item-grid-item"><a href="/search/${items[item].data.id}"><img src="${items[item].data.icon}" class="border" style="margin-bottom:4px;"></a><br><b>${item}</b><br>${item_dreamers(item).length} seeking!</div>`
    }
    html += `</div><br><p><b>Simple Dreams</b></p><p>These dream items restock pretty regularly at their respective shops!</p><div class="item-grid">`
    if ( simple_dreams.length <= 16 ) { limit = simple_dreams.length } else { limit = 16 }
    for (let x = 0; x < limit; x++) {
        let item = simple_dreams[x]
        if (item_dreamers(item) == 0) { continue }
        html += `<div class="item-grid-item"><a href="/search/${items[item].data.id}"><img src="${items[item].data.icon}" class="border" style="margin-bottom:4px;"></a><br><b>${item}</b><br>${item_dreamers(item).length} seeking!</div>`
    }
    html += `</div>`
    return html
}


// VirtuDreams Dream Browser Page
function dream_browser(page) {
    let html = `<div class="item-grid">`
    for (let x = page * 52; x < desired_items.length && x < (page + 1) * 52 ; x++) {
        let item = desired_items[x]
        html += `<div class="item-grid-item"><a href="/search/${items[item].data.id}"><img src="${items[item].data.icon}" class="border" style="margin-bottom:4px;"></a><br><b>${item}</b><br>${item_dreamers(item).length} seeking!</div>`
    }
    html += `</div>`
    return html
}

// VirtuDreams Your Dreams Page
function dream_list(div) {
    let dream_table = document.createElement("div")
    let html = `<table class="table-auto striped-table my-3" cellspacing="0" cellpadding="0"><thead style="background-color:#dedf73"><tr height="25"><th>Icon</th><th>Item Info</th><th width="40%">Dream Description</th><th style="width: 50px;">Qty</th><th style="width: 50px;">Rm</th></tr></thead><tbody>`
    for (let item in dreamer_items(user)) {
        let item_id = vpify(item)
        html += `<tr><td><div class="p-2"><img class="border border-black border-solid" src="${items[item].data.icon}" alt="${item}"></div></td><td class="font-black table-item-name px-2">${item}<br><span class="sf">${items[item].data.category}</span><br><span class="sf">r${items[item].data.rarity}</span></td><td><i>${items[item].users[user].desc}</i></td><td class="font-black text-center">${items[item].users[user].qty}</td><td class="text-center"><button type="submit" id="rmv_${item_id}" value="${item}">Rm</button></td></tr>`
    }
    dream_table.innerHTML = html
    div.appendChild(dream_table)
}
