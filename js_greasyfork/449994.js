// ==UserScript==
// @name         SilverScripts - Custom Browser Version
// @namespace    http://tampermonkey.net/
// @version      6.3.2
// @description  Find out prices of items in your inventory by hovering over them while at the Marketplace, in the Inner City, or whilst browsing your Inventory in the Outpost, automatically use services, and more!
// @author       SilverBeam
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @match        *fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/449994/SilverScripts%20-%20Custom%20Browser%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/449994/SilverScripts%20-%20Custom%20Browser%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //////////////////////////////
    //  Variables Declaration   //
    /////////////////////////////

    var userVars = unsafeWindow.userVars;
    var globalData = unsafeWindow.globalData;
    var infoBox = unsafeWindow.infoBox;
    var itemsDataBank = {};
    var servicesDataBank = {};
    var inventoryArray = [];
    var userData = {};
    var userSettings = {"hoverPrices":true,"autoService":true,"autoMarketWithdraw":true};//Default Settings

    var pendingRequests = {
        "requestsNeeded": 0,
        "requestsCompleted": 0,
        "requesting": false,
        "requestsCooldownPeriod": 500, //Minimum time before another refresh is issued again after an inventory change
        "requestsCoolingDown": false
    };

    var lastSlotHovered = -1;
    var tooltipDisplaying = false;
    var helpWindow = unsafeWindow.prompt;

    var helpWindowStructure = {
        "home": {
            "data":
                [
                    ["span","Welcome to SilverScripts Help and Settings!"],
                    ["p"," "],
                    ["button","AutoService Help",openHelpWindowPage,["autoService"]],
                    ["button","AutoService not working?",openHelpWindowPage,["serviceReadme"]],
                    ["button","MarketWithdraw Help",openHelpWindowPage,["marketWithdraw"]],
                    ["button","Settings",openHelpWindowPage,["settings"]],
                    ["button","Close",closeHelpWindowPage,[]]
                ],
            "style":
                [
                    ["height","145px"]
                ]
        },
        "serviceReadme": {
            "data":
                [
                    ["span","Warning!Prices are updated only when something in the inventory changes. If you are unable to purchase a service, move an item in the inventory around to refresh services data!"],
                    ["button","Back",openHelpWindowPage,["home"]],
                    ["button","Close",closeHelpWindowPage,[]]
                ],
            "style":
                [
                    ["height","150px"]
                ]
        },
        "autoService": {
            "data":
                [
                    ["span","If you hold the <span style='color: #ff0000;'>[ALT]</span> key while hovering on a serviceable item, a prompt will appear. By ALT+Clicking, the relevant service for that item will be automatically bought from the market."],
                    ["p",""],
                    ["button","Back",openHelpWindowPage,["home"]],
                    ["button","Close",closeHelpWindowPage,[]]
                ],
            "style":
                [
                    ["height","175px"]
                ]
        },
        "marketWithdraw": {
            "data":
                [
                    ["span","If you don't have enough cash to buy an item, the <span style='color: #ff0000;'>buy</span> button is replaced by a <span style='color: #ff0000;'>withdraw</span> button. By pressing it, the necessary cash will be withdrawn from your bank. The button is disabled if the bank doesn't have enough cash. This function can be disabled in the settings."],
                    ["button","Back",openHelpWindowPage,["home"]],
                    ["button","Close",closeHelpWindowPage,[]]
                ],
            "style":
                [
                    ["height","190px"]
                ]
        },
        "settings": {
            "data":
                [
                    ["button","Disable HoverPrices",flipSetting,["hoverPrices",0]],
                    ["button","Disable AutoService",flipSetting,["autoService",1]],
                    ["button","Disable AutoMarketWithdraw",flipSetting,["autoMarketWithdraw",2]],
                    ["p"," "],
                    ["button","Back",openHelpWindowPage,["home"]],
                    ["button","Close",closeHelpWindowPage,[]]
                ],
            "style":
                [
                    ["height","110px"]
                ]
        }
    }


    //////////////////////////
    //  Utility Functions   //
    /////////////////////////

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function flipSetting(settingName,settingIndex){
        var oldValue = userSettings[settingName];
        if(oldValue == true){
            userSettings[settingName] = false;
            helpWindowStructure["settings"]["data"][settingIndex][1] = "Enable "+capitalizeFirstLetter(settingName);
        }else{
            userSettings[settingName] = true;
            helpWindowStructure["settings"]["data"][settingIndex][1] = "Disable "+capitalizeFirstLetter(settingName);
        }
        GM_setValue("userSettings",JSON.stringify(userSettings));
        //Trick to refresh the menu
        openHelpWindowPage("settings");
    }

    function refreshMarketSearch(){
        var itemDisplay = document.getElementById("itemDisplay");
        itemDisplay.scrollTop = 0;
        itemDisplay.scrollLeft = 0;
        unsafeWindow.search();
    }

    //////////////////////
    //  Init Functions  //
    /////////////////////

    function initUserData(){
        userData.tradeZone = '4';   //Hardcode the "Outpost" tradezone
        userData.maxInvSlots = parseInt(userVars.DFSTATS_df_invslots);
        userData.password = userVars["password"];
    }

    function initInventoryArray(){
        var itemGlobData = {};
        var category = "";

        inventoryArray = [];

        for(var i=1;i<=userData.maxInvSlots;i++){
            //Init a new inventory item
            var item = {};
            item.id = userVars["DFSTATS_df_inv" + i + "_type"];
            item.extraInfo = "";
            item.type = "";

            //Check if slot isn't empty
            if(item.id != "" && item.id != undefined){
                //Detect extra data such as cooked/dye color
                if(item.id.indexOf("_") != -1){
                    item.extraInfo = capitalizeFirstLetter(item.id.split("_")[1]);
                    item.id = item.id.split("_")[0];
                }

                itemGlobData = globalData[item.id];

                //Set shared data across all item types
                item.name = itemGlobData.name;
                item.quantity = parseInt(userVars["DFSTATS_df_inv" + i + "_quantity"]);
                item.quantity = item.quantity < 1? 1:item.quantity;
                item.type = capitalizeFirstLetter(itemGlobData.itemcat);
                item.notTransferable = itemGlobData.no_transfer == 1;

                if(item.type == "Armour"){
                    //Quantity is current armor HP
                    item.maxHP = parseInt(itemGlobData.hp); //Max armor hp
                    item.level = itemGlobData.shop_level;
                    item.profession = "Engineer";
                    item.serviceAction = "buyrepair";
                    item.serviceSound = "repair";
                    item.serviceTooltip = "Repair";
                }
                
                if(item.type == "Weapon"){
                    item.scrapValue = unsafeWindow.scrapValue(item.id,1);
                }

                if(item.type == "Item"){
                    //Add level to the item if it has one
                    if(itemGlobData.level != undefined){
                        item.level = itemGlobData.level;
                    }
                    
                    //Add scrap value if this is a cosmetic
                    if(itemGlobData.clothingtype != undefined){
                        item.scrapValue = unsafeWindow.scrapValue(item.id,1);
                    }

                    //Find if the item has a profession associated and/or is cookable and add it
                    //to the databank for a market request
                    if(itemGlobData.needcook == "1" && item.extraInfo != "Cooked"){
                        item.type = "Cookable";
                        item.profession = "Chef";
                        item.serviceAction = "buycook";
                        item.serviceSound = "cook";
                        item.serviceTooltip = "Cook";
                        //Add Cooked item info to the Databank
                        //If this is the first time this item has been found in the inventory,
                        //register its Cooked info into the itemsDataBank
                        if(itemsDataBank[item.id+"_cooked"] == null){
                            var cookedItem = {};
                            cookedItem.id = item.id+"_cooked";
                            cookedItem.extraInfo = "Cooked";
                            cookedItem.name = "Cooked "+item.name;
                            cookedItem.quantity = 1;
                            cookedItem.type = "Item";
                            itemsDataBank[cookedItem.id] = cookedItem;
                        }
                    }else if(itemGlobData.needdoctor == "1"){
                        item.type = "Medical";
                        item.profession = "Doctor";
                        item.serviceAction = "buyadminister";
                        item.serviceSound = "heal";
                        item.serviceTooltip = "Administer";
                    }
                }

                //Fix for cooked items detection
                if(item.extraInfo == "Cooked"){
                    item.id = item.id + "_cooked";
                    item.name = "Cooked " + item.name;
                }

                //Add profession level required to service the item.
                //If item isn't serviceable this is ignored.
                if(item.level != undefined){
                    item.professionLevel = item.level - 5;
                }

                //If this is the first time this item has been found in the inventory,
                //register its info into the itemsDataBank
                if(itemsDataBank[item.id] == null){
                    itemsDataBank[item.id] = item;
                }
            }else{
                item.name = "";
                item.quantity = 0;
            }

            inventoryArray.push(item);
        }
    }

    function loadStoredSettings(){
        //We stringify the default object as fallback
        userSettings = JSON.parse(GM_getValue("userSettings",JSON.stringify(userSettings)));
        if(userSettings.hoverPrices == false){
            helpWindowStructure["settings"]["data"][0][1] = "Enable HoverPrices";
        }
        if(userSettings.autoService == false){
            helpWindowStructure["settings"]["data"][1][1] = "Enable AutoService";
        }
        if(userSettings.autoMarketWithdraw == false){
            helpWindowStructure["settings"]["data"][2][1] = "Enable AutoMarketWithdraw";
        }
    }


    //////////////////////////////
    //  Item Price Functions    //
    /////////////////////////////

    function requestDataBankItemsMarketInfo(){
        pendingRequests.requestsNeeded += Object.keys(itemsDataBank).length;
        pendingRequests.requesting = true;

        for(var itemName in itemsDataBank){
            if(itemsDataBank[itemName].name != ""){
                requestItem(itemsDataBank[itemName]);
            }else{
                itemsDataBank[itemName].rawServerResponse = "";
            }
        }
    }

    function requestItem(dataBankItem){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                dataBankItem.rawServerResponse = this.responseText;
                filterItemResponseText(dataBankItem);
                updateInventoryItemPrices(dataBankItem);
                pendingRequests.requestsCompleted += 1;
                if(pendingRequests.requestsCompleted >= pendingRequests.requestsNeeded){
                    pendingRequests.requestsNeeded = 0;
                    pendingRequests.requestsCompleted = 0;
                    pendingRequests.requesting = false;
                }
            }
        };

        xhttp.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("hash=&pagetime=&tradezone="+userData.tradeZone+"&searchname="+encodeURI(dataBankItem.name.substring(0,15))+"&category=&profession=&memID=&searchtype=buyinglistitemname&search=trades");
    }

    function filterItemResponseText(dataBankItem){
        var itemRawResponse = dataBankItem.rawServerResponse;
        if(itemRawResponse != ""){
            var maxTrades = ((itemRawResponse || '').match(/tradelist_[0-9]+_id_member=/g) || []).length;
            var firstOccurence;
            if(itemRawResponse.indexOf("tradelist_maxresults=0") == -1){
                if(dataBankItem.extraInfo != ""){
                    firstOccurence = parseInt(itemRawResponse.match(new RegExp("tradelist_[0-9]+_item="+dataBankItem.id))[0].split("=")[0].match(/[0-9]+/)[0]);
                }else{
                    firstOccurence = parseInt(itemRawResponse.match(new RegExp("tradelist_[0-9]+_item="+dataBankItem.id+"&"))[0].split("=")[0].match(/[0-9]+/)[0]);
                }
            }else{
                firstOccurence = 0;
            }
            var availableTrades = maxTrades - firstOccurence;
            var avgPrice = 0;
            var examinedTrades = 0;

            for(;(examinedTrades<availableTrades)&&(examinedTrades<10);examinedTrades++){
                var pricePerUnit;
                var quantity;
                if(dataBankItem.type == "Armour"){
                    pricePerUnit = parseInt(itemRawResponse.match(new RegExp("tradelist_"+(firstOccurence+examinedTrades)+"_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                }else{
                    //Fix for implants that are somehow listed in the market as having 0 quantity
                    quantity = parseInt(itemRawResponse.match(new RegExp("tradelist_"+(firstOccurence+examinedTrades)+"_quantity=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                    quantity = quantity < 1? 1:quantity;
                    pricePerUnit = parseInt(itemRawResponse.match(new RegExp("tradelist_"+(firstOccurence+examinedTrades)+"_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]) /
                                   quantity;
                }
                avgPrice += pricePerUnit;
                if(examinedTrades == 0){
                    dataBankItem.bestPricePerUnit = pricePerUnit;
                }
            }
            
            if(examinedTrades == 0){
                dataBankItem.averagePricePerUnit = 0;
                dataBankItem.bestPricePerUnit = 0;
            }else{
                dataBankItem.averagePricePerUnit = avgPrice / examinedTrades;
            }
            //Fix undefined data
            if(dataBankItem.averagePricePerUnit == undefined){
                dataBankItem.averagePricePerUnit = 0;
            }
            if(dataBankItem.bestPricePerUnit == undefined){
                dataBankItem.bestPricePerUnit = 0;
            }
        }
    }

    function updateInventoryItemPrices(dataBankItem){
        for(var x in inventoryArray){
            if(inventoryArray[x].id == dataBankItem.id){
                inventoryArray[x].bestPricePerUnit = dataBankItem.bestPricePerUnit;
                inventoryArray[x].averagePricePerUnit = dataBankItem.averagePricePerUnit;
            }
        }
    }

    /////////////////////////////////
    //  Service Price Functions    //
    /////////////////////////////////

    //Delete and request new service price info
    function refreshServicesDataBank(){
        servicesDataBank = {"Chef":{name:"Chef"},"Doctor":{name:"Doctor"},"Engineer":{name:"Engineer"}};
        requestServicesMarketInfo();
    }

    //Request info for every service in servicesDataBank
    function requestServicesMarketInfo(){
        pendingRequests.requestsNeeded += Object.keys(servicesDataBank).length;
        pendingRequests.requesting = true;

        for(var serviceName in servicesDataBank){
            requestService(servicesDataBank[serviceName]);
        }
    }

    function requestService(dataBankService){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                dataBankService.rawServerResponse = this.responseText;
                filterServiceResponseText(dataBankService);
                pendingRequests.requestsCompleted += 1;
                if(pendingRequests.requestsCompleted >= pendingRequests.requestsNeeded){
                    pendingRequests.requestsNeeded = 0;
                    pendingRequests.requestsCompleted = 0;
                    pendingRequests.requesting = false;
                }
            }
        };

        xhttp.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("hash=&pagetime=&tradezone="+userVars["DFSTATS_df_tradezone"]+"&searchname=&category=&profession="+encodeURI(dataBankService.name.substring(0,15))+"&memID=&searchtype=buyinglist&search=services");
    }

    function filterServiceResponseText(dataBankService){
        //Get length of response list
        var rawServerResponse = dataBankService.rawServerResponse;
        var responseLength = ((rawServerResponse || '').match(/tradelist_[0-9]+_id_member=/g) || []).length
        if(rawServerResponse != ""){
            for(var i=0;i<responseLength;i++){
                //If we don't already have price for this level, fetch the lowest
                var serviceLevel = parseInt(rawServerResponse.match(new RegExp("tradelist_"+i+"_level=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                if(dataBankService[serviceLevel] == undefined){
                    dataBankService[serviceLevel] = {};
                    dataBankService[serviceLevel]["userID"] = parseInt(rawServerResponse.match(new RegExp("tradelist_"+i+"_id_member=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                    dataBankService[serviceLevel]["price"] = parseInt(rawServerResponse.match(new RegExp("tradelist_"+i+"_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                }
            }
        }
    }

    //Buy service for a specified item
    function buyService(slotNumber){
        var targetInventoryItem = inventoryArray[slotNumber-1];
        var payload = null;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //Update the inventory from the new data, according to the original source code
                unsafeWindow.updateIntoArr(unsafeWindow.flshToArr(this.responseText, "DFSTATS_"), unsafeWindow.userVars);
                unsafeWindow.populateInventory();
                unsafeWindow.populateCharacterInventory();
                unsafeWindow.updateAllFields();
            }
        };

        var serviceBuynum, servicePrice;

        //We make sure that the item has an associated service
        if(targetInventoryItem.profession == null){
            return;
        }

        //Get the listing info and play the corresponding profession sound
        serviceBuynum = servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel]["userID"];
        servicePrice = servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel]["price"];
        unsafeWindow.playSound(targetInventoryItem.serviceSound);

        if(serviceBuynum != null){
            payload = "pagetime="+userVars["pagetime"]+"&templateID=0&sc="+userVars["sc"]+"&creditsnum=0&buynum="+serviceBuynum+
                    "&renameto=undefined`undefined&expected_itemprice="+servicePrice+
                    "&expected_itemtype2=&expected_itemtype=&itemnum2=0&itemnum="+slotNumber+
                    "&price=0&action="+targetInventoryItem.serviceAction+"&userID="+userVars["userID"]+"&password="+userData.password;
        }

        if(payload != null){
            xhttp.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
            payload =  "hash=" + unsafeWindow.hash(payload) + "&" + payload;
            xhttp.send(payload);
        }
    }

    function autoServiceHelper(targetInventoryItem,action){
        //Show custom box if a slot is hovered whilst the ALT is pressed
        var mousePos = unsafeWindow.mousePos;
        var playerCash = userVars["DFSTATS_df_cash"];
        //Make sure the slot is occupied and not locked
        if(targetInventoryItem.id != "" && unsafeWindow.lockedSlots.indexOf(lastSlotHovered) == -1){
            //Cookable OR damaged Armor OR Medical and health below max
            if( (targetInventoryItem.type == "Cookable")||
                (targetInventoryItem.type == "Armour" && targetInventoryItem.quantity<targetInventoryItem.maxHP)||
                (targetInventoryItem.type == "Medical" && userVars["DFSTATS_df_hpcurrent"] < userVars["DFSTATS_df_hpmax"])
            ){

                var servicePrice = servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel]["price"];

                if(servicePrice <= playerCash){
                    if(action == "UpdateTooltip"){
                        unsafeWindow.displayPlacementMessage(targetInventoryItem.serviceTooltip,mousePos[0]+10,mousePos[1]+10,"ACTION");
                        tooltipDisplaying = true;
                    }else if(action == "BuyService"){
                        buyService(lastSlotHovered);
                    }
                }else{
                    //If action is "BuyService" and the player doesn't have enough cash,
                    //don't fo anything
                    if(action == "UpdateTooltip"){
                        unsafeWindow.displayPlacementMessage("You don't have enough cash to use this service!",mousePos[0]+10,mousePos[1]+10,"ERROR");
                        tooltipDisplaying = true;
                    }
                }
            }
        }
    }

    //////////////////////////
    //  Cash Functions     //
    /////////////////////////

    function withdrawCash(amount){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                unsafeWindow.playSound("bank");
                //We must filter out the new cash amounts and update the existing ones
                var cashFields = this.responseText.split('&');
                var newBankCash = cashFields[1].split('=')[1];
                var newHeldCash = cashFields[2].split('=')[1];
                userVars["DFSTATS_df_cash"] = newHeldCash;
                userVars['DFSTATS_df_bankcash'] = newBankCash;
                var cash = "Cash: $" + unsafeWindow.nf.format(userVars["DFSTATS_df_cash"]);
                var heldCash = document.getElementsByClassName("heldCash")[0];
                heldCash.setAttribute("data-cash",heldCash);
                unsafeWindow.updateAllFields();
                refreshMarketSearch();
            }
        };

        xhttp.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/bank.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("withdraw="+amount+"&sc="+userVars["sc"]+"&userID="+userVars["userID"]+"&password="+userData.password);
    }

    //////////////////////////////
    //  DOM Event Listeners     //
    //////////////////////////////


    function registerEventListeners(){
        //Ugly syntax to make the script work on custom browser
        var inventorySlots = document.getElementsByClassName("validSlot");
        inventorySlots = [].slice.call(inventorySlots, 0);
        inventorySlots = inventorySlots.filter(function(node){return node.parentNode.parentNode.id == "inventory"});
        for(var slot in inventorySlots){
            inventorySlots[slot].addEventListener("mouseenter",mouseEnterSlotHandler);
            inventorySlots[slot].addEventListener("mouseleave",mouseLeaveSlotHandler);
            inventorySlots[slot].addEventListener("mousemove",showTooltipHandler);
            inventorySlots[slot].addEventListener("mouseup",mouseUpSlotHandler,true);
        }
        var inventoryTable = document.getElementById("inventory");
        inventoryTable.addEventListener("mouseenter",mouseEnterInventoryHandler);
        inventoryTable.addEventListener("mouseleave",mouseLeaveInventoryHandler);

        window.addEventListener("keydown",showTooltipHandler);
        window.addEventListener("keyup",windowKeyUpHandler);

        //Marketplace
        if(window.location.href == "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"){
            registerTabSwitchHandlers();
        }
    }

    //Register handlers to move menu depending on market tab
    function registerTabSwitchHandlers(){
        var marketBuyingTab = document.getElementById("loadBuying");
        var marketSellingTab = document.getElementById("loadSelling");
        var marketPrivateTab = document.getElementById("loadPrivate");
        var marketTradingTab = document.getElementById("loadItemForItem");

        //Return if we are in a submenu, like the ones in the item-for-item tab
        if(marketBuyingTab == null){
            return;
        }

        marketBuyingTab.addEventListener("click",exitTradingClickHandler);
        marketBuyingTab.addEventListener("click",registerMarketListObserver);
        marketSellingTab.addEventListener("click",exitTradingClickHandler);
        marketPrivateTab.addEventListener("click",enterTradingClickHandler);
        marketTradingTab.addEventListener("click",enterTradingClickHandler);
    }

    //Detect which slot has been entered
    function mouseEnterSlotHandler(e){
        var slot = e.target.dataset.slot;
        if(lastSlotHovered != slot){
            lastSlotHovered = slot;
        }
    }

    //Fix hoverbox popping when DOM is injected by only showing hoverBox after
    //content is injected
    function mouseLeaveSlotHandler(e){
        infoBox.style.opacity = 0;
        if(tooltipDisplaying){
            unsafeWindow.cleanPlacementMessage();
            tooltipDisplaying = false;
        }
    }

    function mouseUpSlotHandler(e){
        //This service should only be available in the market
        if(window.location.href != "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"){
            return;
        }
        //Check if autoService isn't disabled
        if(e.altKey && lastSlotHovered != -1 && userSettings.autoService){
            var targetInventoryItem = inventoryArray[lastSlotHovered-1];
            if(!pendingRequests.requesting){
                autoServiceHelper(targetInventoryItem,"BuyService");
            }
        }
    }

    //Slot hover handler used to update tooltip location
    function showTooltipHandler(e){
        //This service should only be available in the market
        if(window.location.href != "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"){
            return;
        }
        //Check if autoService isn't disabled
        if(e.altKey && lastSlotHovered != -1 && userSettings.autoService){
            var targetInventoryItem = inventoryArray[lastSlotHovered-1];
            if(!pendingRequests.requesting){
                autoServiceHelper(targetInventoryItem,"UpdateTooltip");
            }
        }
    }

    //Make hoverBox invisible untill DOM is injected to prevent popping
    function mouseEnterInventoryHandler(e){
        infoBox.style.opacity = 0;
    }

    function mouseLeaveInventoryHandler(e){
        //Reset hoverBox visibility on exit
        infoBox.style.opacity = 1;
        //Reset hovered slot index when the inventory table is exited
        lastSlotHovered = -1;
    }

    //Check and eventually clean the tooltip
    function windowKeyUpHandler(e){
        //This service should only be available in the market
        if(window.location.href != "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"){
            return;
        }
        //Check if autoService isn't disabled
        if(e.key == "Alt" && !userSettings.autoService){
            e.preventDefault(); //We don't want the browser to focus out of the window
            if(tooltipDisplaying){
                unsafeWindow.cleanPlacementMessage();
                tooltipDisplaying = false;
            }
        }
    }

    function helpMenuClickHandler(e){
        openHelpWindowPage("home");
    }

    //Move the menu button in the item-for-item page
    function enterTradingClickHandler(e){
        document.getElementById("silverscriptsMenuButton").style.right = "100px";
    }

    //Move the menu button after exiting the item-for-item page
    function exitTradingClickHandler(e){
        document.getElementById("silverscriptsMenuButton").style.right = "20px";
    }

    //////////////////////
    //  DOM Observers   //
    /////////////////////

    function registerDOMObservers(){
        registerHoverBoxObserver();
        registerInventoryObserver();
        registerMarketObserver();
        registerMarketListObserver();
    }

    function registerHoverBoxObserver(){
        var observerTargetNode = unsafeWindow.infoBox;
        var mutationConfig = { childList: true, subtree: true };

        var hoverBoxMutationCallback = function(mutationList, observer) {
            //Only listen for childList mutations
            for(var mutation in mutationList) {
                if (mutationList[mutation].type === 'childList') {
                    //Detect the class of the children. If any has "itemName", then this is a vanilla js mutation
                    var addedNodes = Object.keys(mutationList[mutation].addedNodes).map(function(e) {
                        return mutationList[mutation].addedNodes[e]
                    }).filter(function(node){return node !== parseInt(node, 10)});
                    var isVanillaMutation = false;
                    for(var i=0;i<addedNodes.length;i++){
                        if(addedNodes[i].className == "itemName"){
                            isVanillaMutation = true;
                            break;
                        }
                    }
                    //var isVanillaMutation = addedNodes.some(function(node){node.className == "itemName"});
                    if(isVanillaMutation && lastSlotHovered != -1){
                        //We are already catching the current slot number via the mouseEnter eventListener,
                        //which always fires before the vanilla mutation occurs
                        fillHoverBox();
                        break;
                    }
                }
            }
        };

        var hoverBoxObserver = new MutationObserver(hoverBoxMutationCallback);
        hoverBoxObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerInventoryObserver(){
        var observerTargetNode = document.getElementById("inventory");
        var mutationConfig = { childList: true, subtree: true };

        var inventoryMutationCallback = function(mutationList, observer) {
            //Update inventory and databank info only if inventory mutated,
            //and only if mutation happened at least pendingRequests.requestsCooldownPeriod milliseconds
            //after the last one
            //We must wait until all the mutations have occured onto the inventory before updating,
            //thus 500ms are waited before fetching new data
            setTimeout(function(){
                if(!pendingRequests.requestsCoolingDown){
                    initInventoryArray();
                    requestDataBankItemsMarketInfo();
                    refreshServicesDataBank();
                    pendingRequests.requestsCoolingDown = true;
                    setTimeout(function(){pendingRequests.requestsCoolingDown = false;},pendingRequests.requestsCooldownPeriod);
                }
            },500);
        };

        var inventoryObserver = new MutationObserver(inventoryMutationCallback);
        inventoryObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerMarketObserver(){
        //This service should only be available in the market
        if(window.location.href != "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"){
            return;
        }
        var observerTargetNode = document.getElementById("marketplace");
        var mutationConfig = { childList: true, subtree: true };

        var marketMutationCallback = function(mutationList, observer) {
            //It seems that whenever a tab is switched, all listeners get unregistered. Register them again.
            //The menu needs to be fixed only in the market
            if(window.location.href == "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"){
                registerTabSwitchHandlers();
            }
        };

        var marketObserver = new MutationObserver(marketMutationCallback);
        marketObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerMarketListObserver(){
        //This service should only be available in the market
        if(window.location.href != "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"){
            return;
        }
        var observerTargetNode = document.getElementById("itemDisplay");
        var mutationConfig = { childList: true, subtree: true };

        var marketListMutationCallback = function(mutationList, observer) {
            //Check if the service is enabled
            if(!userSettings.autoMarketWithdraw){
                return;
            }
            //Check if the user is in the "buy" market tab
            if(unsafeWindow.marketScreen == "buy"){
                for(var mutation in mutationList){
                    if(mutationList[mutation].addedNodes.length > 0){
                        //We filter out our own changes
                        if(mutationList[mutation].addedNodes[0].tagName != "BUTTON" && mutationList[mutation].target.tagName != "BUTTON"){
                            injectAutoMarketWithdrawButton(mutationList[mutation].addedNodes[0]);
                        }
                    }
                }
            }
        };

        var marketListObserver = new MutationObserver(marketListMutationCallback);
        marketListObserver.observe(observerTargetNode, mutationConfig);
    }

    //////////////////////////
    //  UI Update Functions //
    //////////////////////////

    //Fix hoverbox pointer events
    function removeHoverBoxPointerEvents(){
        //Remove pointer events from injected UI and the hoverBox itself
        //Style tag injection is needed because on Chrome the only 2 stylesheets
        //available in the inner city inventory page are read-write protected
        var sheet = document.createElement("style");
        sheet.innerText = ".silverStats { pointer-events: none; }";
        document.head.appendChild(sheet)
        infoBox.style.pointerEvents = "none";
        //The fake grabbed item sometimes confuses the browser.
        var grabbedItem = document.getElementById("fakeGrabbedItem");
        grabbedItem.style.pointerEvents = "none";
    }

    //Add help text prompt
    function addHelpButton(){
        var inventoryHolder = document.getElementById("inventoryholder");
        var helpButton = document.createElement("button");
        helpButton.textContent = "SilverScripts Menu";
        helpButton.id = "silverscriptsMenuButton";
        helpButton.className = "opElem";
        helpButton.style.bottom = "86px";
        helpButton.style.right = "20px";
        helpButton.addEventListener("click",helpMenuClickHandler)
        inventoryHolder.appendChild(helpButton);
    }

    function fillHoverBox(){
        //Don't do anything if hoverPrices got disabled
        if(!userSettings.hoverPrices){
            infoBox.style.opacity = 1;
            return;
        }

        var targetInventoryItem = inventoryArray[lastSlotHovered-1];

        //Don't do anything if slot is empty
        if(targetInventoryItem.id == ""){
            return;
        }

        //Don't do anything is item is non-tradeable
        if(targetInventoryItem.notTransferable){
            infoBox.style.opacity = 1;
            return;
        }

        var blank = document.createElement("div");
        blank.className = "itemData silverStats";
        blank.innerHTML = "Silver Stats";
        blank.style.opacity = 0;
        infoBox.appendChild(blank);

        var bpu = document.createElement("div");
        bpu.className = "itemData silverStats";
        bpu.innerHTML = "Best price per unit: " + targetInventoryItem.bestPricePerUnit.toFixed(2);
        infoBox.appendChild(bpu);

        //Save a text line if item quantity 1
        if(targetInventoryItem.quantity != 1 && targetInventoryItem.type != "Armour"){
            var bps = document.createElement("div");
            bps.className = "itemData silverStats";
            bps.innerHTML = "Best price this stack: " + (targetInventoryItem.bestPricePerUnit*targetInventoryItem.quantity).toFixed(2);
            infoBox.appendChild(bps);
        }

        var apu = document.createElement("div");
        apu.className = "itemData silverStats";
        apu.innerHTML = "Average price per unit: " + targetInventoryItem.averagePricePerUnit.toFixed(2);
        infoBox.appendChild(apu);

        //Save a text if item quantity 1
        if(targetInventoryItem.quantity != 1 && targetInventoryItem.type != "Armour"){
            var aps = document.createElement("div");
            aps.className = "itemData silverStats";
            aps.innerHTML = "Average price this stack: " + (targetInventoryItem.averagePricePerUnit*targetInventoryItem.quantity).toFixed(2);
            infoBox.appendChild(aps);
        }

        //Check if a service is needed to use the item
        var serv = document.createElement("div");
        serv.className = "itemData silverStats";
        if(targetInventoryItem.type == "Cookable"){
            serv.innerHTML = "Price to cook: " + (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel]["price"]);
            infoBox.appendChild(serv);
            //If an item is cookable, insert info about its cooked counterpart
            var cookedItemId = targetInventoryItem.id + "_cooked";
            var cookedItem = itemsDataBank[cookedItemId];
            if(cookedItem != null){
                var cookedBestPrice = document.createElement("div");
                cookedBestPrice.className = "itemData silverStats";
                cookedBestPrice.innerHTML = "Best price cooked: " + cookedItem.bestPricePerUnit.toFixed(2);
                infoBox.appendChild(cookedBestPrice);
                var cookedAveragePrice = document.createElement("div");
                cookedAveragePrice.className = "itemData silverStats";
                cookedAveragePrice.innerHTML = "Average price cooked: " + cookedItem.averagePricePerUnit.toFixed(2);
                infoBox.appendChild(cookedAveragePrice);
                var lowestCookingEarnings = document.createElement("div");
                lowestCookingEarnings.className = "itemData silverStats";
                lowestCookingEarnings.innerHTML = "Lowest earnings after cooking: " + (cookedItem.bestPricePerUnit - targetInventoryItem.bestPricePerUnit - servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel]["price"]).toFixed(2);
                infoBox.appendChild(lowestCookingEarnings);
            }
        }else if(targetInventoryItem.type == "Armour"){
            serv.innerHTML = "Price to repair: " + (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel]["price"]);
            infoBox.appendChild(serv);
        }else if(targetInventoryItem.type == "Medical"){
            serv.innerHTML = "Price to administer: " + (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel]["price"]);
            infoBox.appendChild(serv);
        }
        
        //Show an armor, weapon, or cosmetic scrap value
        if(targetInventoryItem.scrapValue != undefined){
            var scrapValue = document.createElement("div");
            scrapValue.className = "itemData silverStats";
            scrapValue.innerHTML = "Scrap value: " + targetInventoryItem.scrapValue;
            infoBox.appendChild(scrapValue);
        }

        //Make hoverBox visible when all its content is updated
        setTimeout(function(){infoBox.style.opacity = 1;},10);
    }

    function openHelpWindowPage(pageName){

        unsafeWindow.pageLock = true;
        helpWindow.innerHTML = "";

        for(var windowStyleData of helpWindowStructure[pageName]["style"]){
            var styleCategory = windowStyleData[0];
            var styleValue = windowStyleData[1];
            helpWindow.style[styleCategory] = styleValue;
        }

        for(var windowElementData of helpWindowStructure[pageName]["data"]){
            var elementType = windowElementData[0];
            var elementText = windowElementData[1];
            var newElement = document.createElement(elementType);
            newElement.innerHTML = elementText;
            if(elementType == "button"){
                var buttonFunction = windowElementData[2];
                var buttonFunctionArgs = windowElementData[3];
                newElement.addEventListener("click",buttonFunction.bind.apply(buttonFunction, [null].concat(buttonFunctionArgs)));
            }
            helpWindow.appendChild(newElement);
            var breakline = document.createElement("br");
            helpWindow.appendChild(breakline);
        }

        helpWindow.parentNode.style.display = "block";
        helpWindow.focus();

    }

    function closeHelpWindowPage(){
        helpWindow.parentNode.style.display = "none";
        helpWindow.innerHTML = "";
        helpWindow.style.height = "";
        unsafeWindow.pageLock = false;
    }

    function injectAutoMarketWithdrawButton(marketRow){
        //We must check if the player doesn't have enough money
        //Remove dollar sign and commas
        var itemPrice = parseInt(marketRow.getElementsByClassName("salePrice")[0].innerHTML.replace(/\$/g, '').replace(/,/g, ''));
        if(itemPrice <= userVars["DFSTATS_df_cash"]){
            return;
        }
        //We use the clone node trick to remove the click listeners
        var buyButton = marketRow.getElementsByTagName('button')[0];
        var withdrawButton = buyButton.cloneNode(true);
        marketRow.replaceChild(withdrawButton,buyButton);
        withdrawButton.innerHTML = "withdraw";
        withdrawButton.style.left = "576px";
        //We must check if the player has enough banked money
        if(userVars['DFSTATS_df_bankcash'] > itemPrice){
            withdrawButton.disabled = false;
        }else{
            withdrawButton.disabled = true;
        }
        withdrawButton.addEventListener("click",withdrawCash.bind(null,itemPrice));
    }

    ////////////////////
    //  Script Start  //
    ///////////////////

    function startScript(){

        initUserData();
        loadStoredSettings();
        initInventoryArray();
        requestDataBankItemsMarketInfo();
        refreshServicesDataBank();
        registerEventListeners();
        registerDOMObservers();
        removeHoverBoxPointerEvents();
        addHelpButton();

    }

    //Give enough time to the vanilla js to complete initialisation.
    setTimeout(function(){startScript();},500);
})();