// ==UserScript==
// @name         GC Search Helper v.1
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  A script to help search for items more quickly on GC!
// @author       alexa, rowan
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448645/GC%20Search%20Helper%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/448645/GC%20Search%20Helper%20v1.meta.js
// ==/UserScript==

//
//█▀ █▀▀ █▀█ █ █▀█ ▀█▀   █▀█ █▀█ ▀█▀ █ █▀█ █▄░█ █▀ ▀
//▄█ █▄▄ █▀▄ █ █▀▀ ░█░   █▄█ █▀▀ ░█░ █ █▄█ █░▀█ ▄█ ▄

// To toggle Search Helper ON for a location, change its value to true
// To toggle Search Helper OFF for a location, change its value to false
const search = {
    Auctions: true,
    EmploymentAgency: true,
    Esophagor: true,
    FaerieQuests: true,
    Inventory: true,
    Kadoatery: true,
    MysteryIslandTrainingSchool: true,
    SafetyDepositBox: true,
    Shops: true,
    ShopStock: true,
    SnowFaerieQuests: true,
    Tarla: true,
    TradingPost: true,
    UserShops: true,
};

//  Last Updated 8/8/22

// Unless you want to try modding the script, don't edit anything below this point!
// <3 alexa


//Function to add search links to items
function makeLinks(parentDiv, item, shop = false) {

    //div to hold all the other link divs. (Links are in divs so I can more easily add event listeners to them)
    var linksDiv = document.createElement("div");
    linksDiv.id = item;

    //sw
    var swDiv = document.createElement("swDiv");
    swDiv.innerHTML = `<a style='font-size:20px;font-weight:100;z-index:900'><img width="20px" id="${item}"src="https://raw.githubusercontent.com/kreotsai/npcShopTools/main/shopwiz.gif"> </a>`;
    swDiv.addEventListener("click", function(e) {
        openSW(item);
    })
    linksDiv.appendChild(swDiv);

    //user shop
    if (shop == true) {
        var shopDiv = document.createElement("shopDiv");
        shopDiv.innerHTML = `<a target="_blank" href="https://www.grundos.cafe/market/?sort=None&page=1&query=${item}"style='font-size:20px;font-weight:100'><img width="20px" src="https://raw.githubusercontent.com/kreotsai/npcShopTools/main/shop.gif"> </a>`;
        linksDiv.appendChild(shopDiv);
    }

    //sdb
    var sdbDiv = document.createElement("sdbDiv");
    sdbDiv.innerHTML = `<a target="_blank" href="https://www.grundos.cafe/safetydeposit/?page=1&query=${item}"style='font-size:20px;font-weight:100'><img width="20px" src="https://raw.githubusercontent.com/kreotsai/npcShopTools/main/emptydepositbox.gif"> </a>`;
    linksDiv.appendChild(sdbDiv);

    //tp
    var tpDiv = document.createElement("tpDiv");
    tpDiv.innerHTML = `<a style='font-size:20px;font-weight:100'><img width="20px" id="${item}"src="https://raw.githubusercontent.com/kreotsai/npcShopTools/main/trade_offer.png"> </a>`;
    tpDiv.addEventListener("click", function(e) {
        openTP(item);
    })
    linksDiv.appendChild(tpDiv);


    //append div

    parentDiv.appendChild(linksDiv);
    return linksDiv
}




//Opens tp, sets query to item name, sets search option to 'identical to my phrase'
function openTP(id) {
    if (id.includes("%27")) {
        id = id.replace("%27", "'");
    }

    console.log("Item: " + id);
    id = id.replace("%27", "'");
    var tp = window.open("https://www.grundos.cafe/island/tradingpost/browse/");
    tp.addEventListener('load', () => {
        console.log('tp opened');
        tp.document.getElementsByName("query")[0].value = id;
        tp.document.getElementsByName("category")[0].selectedIndex = 1;

    }, false);

}



//Opens shop wiz, sets query to item name, sets search option to 'identical to my phrase'
function openSW(id) {
    if (id.includes("%27")) {
        id = id.replace("%27", "'");
    }

    console.log("Item: " + id);
    id = id.replace("%27", "'");
    var wiz = window.open("https://www.grundos.cafe/market/wizard/");
    wiz.addEventListener('load', () => {
        console.log('wiz opened');

        //Check if there's a quest
        if (wiz.document.body.innerText.includes("Oh dear, you're working for a faerie.")) {
            console.log("on a quest, can't use SW");

        }
        //No quest, do the search stuff
        else {
            wiz.document.getElementsByName("query")[0].value = id;
            wiz.document.getElementsByName("search_method")[0].selectedIndex = 1;
        }
    }, false);

}

//Checks user shop for an item
function checkUserShop(item) {
    //remove any newlines
    item = item.replace(/(\r\n|\n|\r)/gm, "");

    console.log("Item: " + item);

    var shop = window.open("https://www.grundos.cafe/market/");
    shop.addEventListener('load', () => {
        console.log('shop opened');
        let shopItems = getShopItems(shop);

        if (shopItems !== undefined) {
            console.log("shop here, continue");

            for (var i = 0, listItem; listItem = shopItems[i]; i++) {

                if (listItem.innerText.includes(item)) {
                    console.log("[" + item + "] was FOUND in row [" + listItem.innerText + "] , centering it on screen");
                    //console.log(listItem);
                    listItem.scrollIntoView({
                        block: "center"
                    });
                    return listItem
                } else {
                    console.log("[" + item + "] was NOT found in row [" + listItem.innerText + "]");
                }
            }

        } else {
            console.log("didnt find a shop");
        }



        //end event listener
    }, false);

    //end openUserShop
}



function getShopItems(shop) {
    if (shop.document.body.innerText.includes("You don't have your own shop yet!")) {
        console.log("no shop")
    } else {
        var itemList = [];
        var shopTable = shop.document.getElementsByClassName("sdbtablebody");
        shopTable = shopTable[0];

        for (var i = 0, row; row = shopTable.rows[i]; i++) {
            var cellHTML = row;


            cellHTML = cellHTML.getElementsByTagName("td");


            cellHTML = cellHTML[0];


            var itemText = cellHTML.innerText;

            if (itemText !== null) {
                if (!cellHTML.innerHTML.includes(`value="Update`)) {
                    itemList.push(cellHTML);
                }
            }

        }
        return itemList

    }
}



function getKadItems() {
    //2004 theme
    var kadTable = document.querySelector("body > table:nth-child(5) > tbody > tr > td:nth-child(3) > div > table > tbody");

    if (kadTable === null) {
        console.log("null kadtable, checking again");
        //standard themes
        kadTable = document.querySelector("body > table:nth-child(4) > tbody > tr > td:nth-child(3) > div > table")
    }

    if (kadTable === null) {
        console.log("null kadtable after 2nd check, returning");
        return
    } else {


        for (let row of kadTable.rows) {
            for (let cell of row.cells) {
                let food = cell.innerText;

                if (food.includes("You should give it")) {
                    food = food.split("sad.\n\n\nYou should give it\n")
                    food = food[1];

                    //console.log(food);

                    makeLinks(cell, food, true)

                }
            }
        }
    }
}

////////////////////////////////////////////////////****   FEA   **** //////////////////////////////////////

if (window.location.href.includes("https://www.grundos.cafe/faerieland/employ/employment/") && search.EmploymentAgency == true) {

    //Get the table where the items for sale are listed, store as var 'itemTable'
    var itemTable = document.getElementsByClassName("content")[0];
    itemTable = itemTable.getElementsByTagName("tbody")[0];


    for (var i = 0, row; row = itemTable.rows[i]; i++) {

        if (row.innerHTML.indexOf("img src") !== -1) {
            var itemPic = row.getElementsByTagName("img")[0].getAttribute("src");
        }
        if (row.innerHTML.indexOf("Base Reward") !== -1) {
            //Parse out job info from itemTable
            var item = row.getElementsByTagName("td")[0];

            item = row.innerHTML.split("of:</b> ");
            item = item[1].split("          <br><br>")[0];
            item = item.replace(/\r?\n|\r/g, "");
            console.log(item);




            makeLinks(row, item, true);



        }

    }
}

/////////////////////////////////////////****   KADS   **** //////////////////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/games/kadoatery/") && search.Kadoatery == true) {
    getKadItems();
}

/////////////////////////////////////////****   FAERIE QUESTS   **** //////////////////////////////////////
var fqRE = document.getElementsByClassName("faerie_quest")[0]
if (!fqRE === undefined && search.FaerieQuests == true) {
    if (fqRE.innerHTML.indexOf("<b>'") !== -1) {
        var questItem = fqRE.getElementsByTagName("b")[1].innerText;
        questItem = questItem.replace("'", "");
        questItem = questItem.replace("'", "");
        console.log(questItem);

        makeLinks(fqRE, questItem, true);
    }
}

//quest page
if (window.location.href.includes("https://www.grundos.cafe/faerieland/quests/") && search.FaerieQuests == true) {
    var ps = document.getElementsByTagName("p");
    for (var j = 0, p; p = ps[j]; j++) {
        if (ps[j].innerHTML.indexOf("You are currently on a quest!") !== -1) {
            questItem = ps[j + 1].innerText;
            questItem = questItem.split("my ")[1];
            questItem = questItem.split(",")[0];
            questItem = questItem.split("?")[0];
            questItem = questItem.split("!")[0];
            questItem = questItem.split("...")[0];
            makeLinks(ps[j + 1], questItem)
        }
    }
}

/////////////////// **** SHOP STOCK **** /////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/market") && search.ShopStock == true) {
    var shop = window;
    var shopItems = getShopItems(shop)
    if (shopItems !== undefined) {
        for (var k = 0, listItem; listItem = shopItems[k]; k++) {
            var itemText = listItem.innerText
            itemText = itemText.split("(")[0];
            makeLinks(listItem, itemText);
            console.log(itemText)
        }
    }
}

/////////////////// **** SDB **** /////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/safetydeposit/") && search.SafetyDepositBox == true) {
    var sdb = window;
    var sdbItems = getShopItems(sdb)
    if (sdbItems !== undefined) {
        for (var l = 0, sdbItem; sdbItem = sdbItems[l]; l++) {
            var sdbText = sdbItem.innerText
            sdbText = sdbText.split("(")[0];
            makeLinks(sdbItem, sdbText);
        }
    }
}


/////////////////// **** INVENTORY **** /////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/inventory/") && search.Inventory == true) {
    var inv = window;
    var invItems = inv.document.getElementsByClassName("inventoryitem")
    if (invItems !== undefined) {
        for (var m = 0, invItem; invItem = invItems[m]; m++) {
            var invText = invItem.innerText
            invText = invText.split("(")[0];
            makeLinks(invItem, invText);
        }
    }
}


/////////////////// **** MYSTERY ISLAND SCHOOL **** /////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/island/training/?type=status") && search.MysteryIslandTrainingSchool == true) {
    var codestones = document.getElementsByTagName("b")
    for (var c = 0, codestone; codestone = codestones[c]; c++) {
        if (codestone.innerText.includes("Codestone")) {
            var csName = codestone.innerText
            makeLinks(codestone, csName);
        }
    }
}



/////////////////// **** AUCTIONS **** /////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/auctions/view/?auction_id=") && search.Auctions == true) {
    var auctionItem = document.querySelector("body > table:nth-child(5) > tbody > tr > td:nth-child(3) > div.content > div:nth-child(4) > p:nth-child(4) > b");
    if (auctionItem === null) {
        //standard themes
        auctionItem = document.querySelector("body > table:nth-child(4) > tbody > tr > td:nth-child(3) > div.content > div:nth-child(4) > p:nth-child(4) > b");
    }
    if (auctionItem === null) {
        console.log("auction item after 2nd check, returning");
        return
    } else {
        var aucName = auctionItem.innerText.split(" (owned by")[0];
        makeLinks(auctionItem, aucName, true);
    }
}



/////////////////// **** TRADING POST **** /////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/island/tradingpost/browse/") && search.TradingPost == true) {
    var tpItems = document.getElementsByClassName("tradingPostTable");
    tpItems = tpItems[0].getElementsByTagName("td");
    for (var tpi = 0, tpItem; tpItem = tpItems[tpi]; tpi++) {
        if (tpItem.innerHTML.includes(`<img src="/items/`)) {
            var tpName = tpItem.innerText;
            if (tpName[0] == " ") {
                tpName = tpName.substring(1);
            }
            var tpLinksDiv = makeLinks(tpItem, tpName);
            tpLinksDiv.style = "float:right;"
        }
    }
}

/////////////////////////////////////////****   Esophagor   **** //////////////////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/halloween/esophagor/") && search.Esophagor == true) {
    var tbl = document.querySelector("body > table:nth-child(5) > tbody > tr > td:nth-child(3) > div > table > tbody");
    if (tbl === null) {
        //standard themes
        tbl = document.querySelector("body > table:nth-child(4) > tbody > tr > td:nth-child(3) > div > table")
    }
    if (tbl === null) {
        return;
    } else {
        for (let row of tbl.rows) {
            for (let cell of row.cells) {
                let food = cell.innerText;
                if (food.includes(" :")) {
                    food = food.split(" :")[0]
                }
                makeLinks(cell, food, true)
            }
        }
    }
}


////////////////////////////////////////////////////****   The Snow Faerie's Quest   **** //////////////////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/winter/snowfaerie/") && search.SnowFaerieQuests == true) {
    if (window.location.href.includes("winter/snowfaerie/complete")) {
        var sfitems = document.querySelector("body > table:nth-child(4) > tbody > tr > td:nth-child(3) > div.content > table > tbody");
        //2004
        if (sfitems === null) {
            sfitems = document.querySelector("body > table:nth-child(5) > tbody > tr > td:nth-child(3) > div.content > table > tbody")
        }
        if (sfitems === null) {
            return;
        } else {
            sfitems = sfitems.getElementsByTagName("b");
            for (let v in sfitems) {
                var n = sfitems[v].innerText
                if (n != undefined && n != "NO" && n != "YES") {
                    var idiv = sfitems[v].parentElement;
                    makeLinks(idiv, n, true)
                }
            }
            return
        }
    }

    if (window.location.href.includes("winter/snowfaerie/accept")) {
        //2004 theme
        var snfa = document.querySelector("body > table:nth-child(5) > tbody > tr > td:nth-child(3) > div.content > table > tbody > tr");

        //default theme
        if (snfa === null) {
            snfa = document.querySelector("body > table:nth-child(4) > tbody > tr > td:nth-child(3) > div.content > table > tbody > tr")
        }

        if (snfa === null) {
            return
        }
        var snfitems = snfa.getElementsByTagName("b");
        console.log(snfitems);

        for (let ii in snfitems) {
            if (snfitems[ii].innerText != undefined) {
                n = snfitems[ii].innerText;
                idiv = snfitems[ii].parentElement;
                makeLinks(idiv, n, true)
            }
        }

        return
    } else { ///winter/snowfaerie

        sfitems = document.querySelector("body > table:nth-child(5) > tbody > tr > td:nth-child(3) > div > table > tbody");
        if (sfitems === null) {
            //standard themes
            sfitems = document.querySelector("body > table:nth-child(4) > tbody > tr > td:nth-child(3) > div > table")
        }
        if (sfitems === null) {
            return;
        } else {
            var itemcell = sfitems.rows[1].cells[1];
            itemcell = itemcell.getElementsByTagName("b");
            for (let item in itemcell) {
                if (itemcell[item].innerText != undefined) {
                    n = itemcell[item].innerText;
                    idiv = itemcell[item].parentElement;
                    makeLinks(idiv, n, true)

                }
            }
        }
    }
}


/////////// tarla /////////////////
if (window.location.href.includes("https://www.grundos.cafe/winter/shopofmystery/purchase/") && search.Tarla == true) {
    var tarla = document.querySelector("body > table:nth-child(4) > tbody > tr > td:nth-child(3) > div.content")

    if (tarla === null) {
        tarla = document.querySelector("body > table:nth-child(5) > tbody > tr > td:nth-child(3) > div.content");
    }

    if (tarla === undefined || tarla.innerText.includes("Other people are ") || tarla.innerText.includes("Awww, looks like I sold")) {
        return
    } else {
        tarla = tarla.getElementsByTagName("b")[1];
        makeLinks(tarla, tarla.innerText);

    }

    if (tarla === null) {

        return;
    }

}

/////////////////////////////////////////**   NEO-SHOPS   ** /////////////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/viewshop/?shop_id") && search.Shops == true) {
    //Get the table where the items for sale are listed, store as var 'shopItemTable'
    var shopItemTable = document.getElementsByClassName("content")[0];
    shopItemTable = shopItemTable.getElementsByTagName("tbody")[0];
    for (var s = 0, shopRow; shopRow = shopItemTable.rows[s]; s++) {
        for (var t = 0, shopItem; shopItem = shopRow.cells[t]; t++) {
            var shopItem2 = shopItem.getElementsByTagName("b")[0].innerText;
            console.log(shopItem2);
            makeLinks(shopItem, shopItem2);
        }
    }
}


/////////////////////////////////////////**   USER-SHOPS   ** /////////////////////////////////
if (window.location.href.includes("https://www.grundos.cafe/market/browseshop/?owner=") && search.UserShops == true) {
    //Get the table where the items for sale are listed, store as var 'shopItemTable'
    shopItemTable = document.getElementsByClassName("content")[0];
    shopItemTable = shopItemTable.getElementsByTagName("tbody")[0];

    for (s = 0, shopRow; shopRow = shopItemTable.rows[s]; s++) {
        for (t = 0, shopItem; shopItem = shopRow.cells[t]; t++) {
            shopItem2 = shopItem.getElementsByTagName("b")[0].innerText;
            console.log(shopItem2);
            makeLinks(shopItem, shopItem2);
        }
    }
}
