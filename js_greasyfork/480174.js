// ==UserScript==
// @name         SilverTrader
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Trading and scrapping utilities.
// @author       SilverBeam
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24*
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35*
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/480174/SilverTrader.user.js
// @updateURL https://update.greasyfork.org/scripts/480174/SilverTrader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var itemsToScrap = ["sledge","battle","grinder","slx","katana","wakizashi","nodachi","exterminator","usan","xt800","rx-2","falcon-","alpha","vss","dragon","k-50","sw","m60"];
    var categoriesToScrap = ["armour","weapon_melee","weapon_pistol","weapon_rifle","weapon_shotgun","weapon_lightmachinegun","weapon_heavymachinegun","weapon_grenadelauncher","clothing_basic","clothing_coat","clothing_headwear"]

    var messageLabel;

    var locations = {
        "inventories": [
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50",
            "fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31",
        ],
        "marketplace" : ["https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"],
        "yard" : ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24"],
        "storage" : ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50"],
        "ICInventory" : ["fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31"],
        "forum" : ["fairview.deadfrontier.com/onlinezombiemmo/index.php?board=","fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum","fairview.deadfrontier.com/onlinezombiemmo/index.php?topic="],
        "revive" : ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=18"],
        "failureReload" : ["&silverTraderReason=failureReload"],
        "restartAction" : ["&silverTraderReason=restartAction"],
        "aio" : ["&silverTraderAio"]
    };

    ////////////////////
    // Util Functions //
    ////////////////////

    function isAtLocation(location){
        //Make an exception check for the homepage as its address is contained in each one
        if(location == "home"){
            if(window.location.href.split("fairview.deadfrontier.com/onlinezombiemmo/index.php")[1] == ""){
                return true;
            }else{
                return false;
            }
        }
        //Check if location name exists first
        if(locations[location] != undefined){
            for(var i=0;i<locations[location].length;i++){
                if(window.location.href.indexOf(locations[location][i]) != -1){
                   return true;
                }
            }
        }
        return false;
    }

    function updateLabelAndLog(text){
        if(messageLabel != null){
            messageLabel.textContent = text;
        }
        console.log(text);
    }

    function serializeObject(obj) {
        var pairs = [];
        for (var prop in obj) {
            if (!obj.hasOwnProperty(prop)) {
                continue;
            }
            pairs.push(prop + '=' + obj[prop]);
        }
        return pairs.join('&');
    }

    function makeRequest(requestUrl,requestParams,callbackFunc,callBackParams){
        let params = {};

        params["pagetime"] = unsafeWindow.userVars["pagetime"];
        params["templateID"] = "0";
        params["sc"] = unsafeWindow.userVars["sc"];
        params = Object.assign(params,requestParams);
        params["gv"] = 42;
        params["userID"] = unsafeWindow.userVars["userID"];
        params["password"] = unsafeWindow.userVars["password"];
        
        return new Promise((resolve) => {
            var xhttp = new XMLHttpRequest();
            var payload = null;
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //Invoke the callback with the request response text and some parameters, if any were supplied
                    //then resolve the Promise with the callback's reponse 
                    let callbackResponse = null;
                    if(callbackFunc != null){
                        callbackResponse = callbackFunc(this.responseText,callBackParams);
                    }
                    if(callbackResponse == null){
                        callbackResponse = true;
                    }
                    resolve(callbackResponse);
                }
            };

            payload = serializeObject(params);

            xhttp.open("POST", requestUrl, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("x-requested-with", "SilverScriptRequest");
            payload = "hash=" + unsafeWindow.hash(payload) + "&" + payload;
            xhttp.send(payload);
        });
    }

    function updateInventoryData(inventoryData){
        unsafeWindow.updateIntoArr(unsafeWindow.flshToArr(inventoryData, "DFSTATS_"), unsafeWindow.userVars);
        unsafeWindow.populateInventory();
        unsafeWindow.populateCharacterInventory();
        unsafeWindow.updateAllFields();
    }

    function getInventoryData(){
        let inventoryItems = [];
        for(var i = 1; i <= unsafeWindow.userVars["DFSTATS_df_invslots"]; i++){
		    let itemData = {};
            itemData["slotNum"] = i;
            itemData["itemType"] = unsafeWindow.userVars["DFSTATS_df_inv" + i + "_type"];
            if(itemData["itemType"] !== ""){
                let item = itemData["itemType"].split("_")[0];
                itemData["itemGlobalData"] = unsafeWindow.globalData[item];
            }
            if(unsafeWindow.lockedSlots.includes(String(i))){
                itemData["isLocked"] = true;
            }else{
                itemData["isLocked"] = false;
            }
            inventoryItems.push(itemData);
	    }
        return inventoryItems;
    }

    function countFreeInvSlots(){
        let freeSlots = 0;
	    for(var i = unsafeWindow.userVars["DFSTATS_df_invslots"]; i >= 1; i--){
		    if(unsafeWindow.userVars["DFSTATS_df_inv" + i + "_type"] === ""){
		    	freeSlots += 1;
		    }
	    }
	    return freeSlots;
    }

    function findLastEmptyInventorySlot(){
	    for(var i = unsafeWindow.userVars["DFSTATS_df_invslots"]; i >= 1; i--){
		    if(unsafeWindow.userVars["DFSTATS_df_inv" + i + "_type"] === ""){
		    	return i;
		    }
	    }
	    return false;
    }

    function findFirstEmptyInventorySlot(){
	    for(var i = 1; i <= unsafeWindow.userVars["DFSTATS_df_invslots"]; i++){
		    if(unsafeWindow.userVars["DFSTATS_df_inv" + i + "_type"] === ""){
		    	return i;
		    }
	    }
	    return false;
    }

    function findLastEmptyStorageSlot(){
    	for(var i = unsafeWindow.userVars["DFSTATS_df_storage_slots"]; i >= 1; i--){
    		if(typeof unsafeWindow.storageBox["df_store" + i + "_type"] === "undefined"){
    			return i;
    		}
    	}
    	return false;
    }

    function getItemListing(searchTerm){
        let dataArray = {};

	    dataArray["tradezone"] = unsafeWindow.userVars["DFSTATS_df_tradezone"];
	    dataArray["searchname"] = searchTerm;
        dataArray["profession"] = "";
		dataArray["category"] = "";
		dataArray["search"] = "trades";
        dataArray["searchtype"] = "buyinglistitemname";

	    dataArray["memID"] = "";

        let requestCallback = function(responseText) {
            return unsafeWindow.flshToArr(responseText);
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php",dataArray,requestCallback,null);
    }

    function getCategoryListing(itemCategory){
        let dataArray = {};

	    dataArray["tradezone"] = unsafeWindow.userVars["DFSTATS_df_tradezone"];
	    dataArray["searchname"] = "";
        dataArray["profession"] = "";
		dataArray["category"] = itemCategory;
		dataArray["search"] = "trades";
        dataArray["searchtype"] = "buyinglistcategory";

	    dataArray["memID"] = "";

        let requestCallback = function(responseText) {
            return unsafeWindow.flshToArr(responseText);
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php",dataArray,requestCallback,null);
    }

    function formatItemListing(itemListingArr,maxResults=100){
        let listingLen = itemListingArr["tradelist_maxresults"];
        var formattedListings = [];

        for(let i=0;i<listingLen;i++){
            let listing = {};
            listing["item"] = itemListingArr["tradelist_"+i+"_item"];
            listing["itemName"] = itemListingArr["tradelist_"+i+"_itemname"];
            listing["tradeID"] = itemListingArr["tradelist_"+i+"_trade_id"];
            listing["price"] = parseInt(itemListingArr["tradelist_"+i+"_price"]);
            listing["scrapValue"] = parseInt(unsafeWindow.scrapValue(listing["item"],1));
            listing["profit"] = listing["scrapValue"] - listing['price'];
            formattedListings.push(listing);
        }

        formattedListings.sort(function(a,b){
            return b["profit"] - a["profit"]
        });

        return formattedListings.slice(0,maxResults)
    }

    async function getAllScrapListingsSorted(){
        let listingsArray = [];

        //for (let itemName of itemsToScrap){
        for (let itemCat of categoriesToScrap){
            //Sleep to reduce server spam
            await new Promise(r => setTimeout(r, 1000));
            //let itemData = await getItemListing(itemName);
            let itemData = await getCategoryListing(itemCat);
            let formattedArray = formatItemListing(itemData);
            listingsArray = listingsArray.concat(formattedArray);
        }

        listingsArray.sort(function(a,b){
            return b["profit"] - a["profit"]
        });

        console.log(listingsArray)
        return listingsArray;
    }

    //Buy an item that was previously registered into the databank
    function buyItem(item){
        //Get the listing info 
        var itemBuynum = item["tradeID"];
        var itemPrice = item["price"];

        //Check that the item is tradeable/seeded into the market
        if(itemBuynum == null){
            return false;
        }

        let requestParams = {};
        requestParams["searchtype"] = "buyinglistitemname";
        requestParams["creditsnum"] = "undefined";
        requestParams["buynum"] = itemBuynum;
        requestParams["renameto"] = "undefined`undefined";
        requestParams["expected_itemprice"] = itemPrice;
        requestParams["expected_itemtype2"] = "";
        requestParams["expected_itemtype"] = "";
        requestParams["itemnum2"] = "0";
        requestParams["itemnum"] = "0";
        requestParams["price"] = "0";
        requestParams["action"] = "newbuy";

        let requestCallback = function(responseText) {
            //Check that the request didn't fail.
            if(responseText.length < 32){
                updateLabelAndLog("Item buy failed. Not enough cash or item already bought");
                return false;
            }else{
                unsafeWindow.playSound("buysell");
                //Update the inventory from the new data
                updateInventoryData(responseText);
            }
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php",requestParams,requestCallback,null);
    }

    async function fillInvWithScrap(sortedListingsArray,profitThreshold=2800){
        let freeInvSlots = countFreeInvSlots();
        let totalProfit = 0;
        for(let i=0;i<freeInvSlots&&i<sortedListingsArray.length;i++){
            let listedItem = sortedListingsArray[i];

            //Set a limit to nnot buy worthless items
            if(listedItem["profit"] < profitThreshold){
                break;
            }
            let buyResult = await buyItem(listedItem);
            if(buyResult){
                updateLabelAndLog("Buying: "+listedItem["itemName"]+" Profit: "+listedItem["profit"]);
                totalProfit += listedItem["profit"];
            }else if(parseInt(unsafeWindow.userVars['DFSTATS_df_cash']) >= listedItem["price"]){
                restartAfterFailure("buyScrap");
                return;
            }
            //Sleep to reduce server spam
            await new Promise(r => setTimeout(r, 1000));
        }
        updateLabelAndLog("Total round profit: "+totalProfit);
    }

    async function buyScrap(profitThreshold=2800){
        updateLabelAndLog("Issuing requests, please wait...");
        let sortedListingsArray = await getAllScrapListingsSorted();
        await fillInvWithScrap(sortedListingsArray,profitThreshold);
    }
    unsafeWindow.silverBuyScrap = buyScrap

    function scrapItem(item){

        //Check that the item is tradeable/seeded into the market
        if(item['itemType'] == ''){
            return false;
        }

        let requestParams = {};
        requestParams["creditsnum"] = "0";
        requestParams["buynum"] = "0";
        requestParams["renameto"] = "";
        requestParams["expected_itemprice"] = "-1";
        requestParams["expected_itemtype2"] = "";
        requestParams["expected_itemtype"] = item["itemType"];
        requestParams["itemnum2"] = "0";
        requestParams["itemnum"] = item["slotNum"];
        requestParams["price"] = unsafeWindow.scrapValue(item["itemType"],1);
        requestParams["action"] = "scrap";

        let requestCallback = function(responseText) {
            //Check that the request didn't fail.
            if(responseText.length < 32){
                updateLabelAndLog("Item scrap failed.");
                return false;
            }else{
                unsafeWindow.playSound("buysell");
                //Update the inventory from the new data
                updateInventoryData(responseText);
            }
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php",requestParams,requestCallback,null);
    }

    async function scrapInventory(){
        updateLabelAndLog("Scrapping inventory...");
        let inventory = getInventoryData();
        for(let item of inventory){
            if(item["itemType"] != "" && !item["isLocked"] && (
                item["itemGlobalData"]["itemcat"] == 'weapon' ||
                item["itemGlobalData"]["itemcat"] == 'armour' ||
                (item["itemGlobalData"]["itemcat"] == 'item' && item["itemGlobalData"]["clothingtype"] != undefined)
            )){
                let response = await scrapItem(item);
                if(!response){
                    restartAfterFailure("scrapInventory");
                    return;
                }
                //Sleep to reduce server spam
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        updateLabelAndLog("Inventory done scrapping");
        //Check if the all in one is active
        let isAio = window.location.href.includes('&silverTraderAio');
        if(isAio){
            //If the aio is active, go to storage with it active
            aioRetrieveFromStorage();
        }
    }
    unsafeWindow.silverScrapInventory = scrapInventory

    async function updateInventory(itemSlots){
        if(itemSlots[0][2] === "storage") {
	    	itemSlots[0][0] += 40;
	    }else if(itemSlots[0][2] === "implants"){
	    	itemSlots[0][0] += 1000;
	    }

	    if(itemSlots[1][2] === "storage"){
	    	itemSlots[1][0] += 40;
	    }else if(itemSlots[1][2] === "implants"){
	    	itemSlots[1][0] += 1000;
	    }

	    var dataArr = {};
	    dataArr["creditsnum"] = unsafeWindow.userVars["DFSTATS_df_credits"];
	    dataArr["buynum"] = "0";
	    dataArr["renameto"] = "undefined`undefined";
	    dataArr["expected_itemprice"] = "-1";
	    dataArr["expected_itemtype2"] = itemSlots[1][1];
	    dataArr["expected_itemtype"] = itemSlots[0][1];
	    dataArr["itemnum2"] = itemSlots[1][0];
	    dataArr["itemnum"] = itemSlots[0][0];
	    dataArr["price"] = unsafeWindow.getUpgradePrice();

        let requestCallback = function(responseText) {
            //Check that the request didn't fail.
            if(responseText.length < 32){
                updateLabelAndLog("Storage request failed.");
                return false;
            }else{
                unsafeWindow.playSound("swap");
                //Update the storage and inventory from the new data
                reloadStorageData(responseText);
            }
        };

        if(itemSlots[0][2] === "inventory" && itemSlots[1][2] === "storage"){
	    	dataArr["action"] = "store";
	    }else if(itemSlots[0][2] === "storage" && itemSlots[1][2] === "inventory"){
            dataArr["action"] = "take";
        }

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php",dataArr,requestCallback,null);
	
    }

    async function shiftWithStorage(slotNum,itemType,toStorage){
        var itemData,extraData;
        if(toStorage){
            itemData = [slotNum, itemType, "inventory"];
	        extraData = [itemData];
            extraData[1] = [unsafeWindow.findFirstEmptyStorageSlot(), "", "storage"];
        }else{
            itemData = [slotNum, itemType, "storage"];
	        extraData = [itemData];
            extraData[1] = [findFirstEmptyInventorySlot(), "", "inventory"];
        }
        return updateInventory(extraData);
    }

    async function sendInventoryToStorage(){
        updateLabelAndLog("Storing inventory...");
        let inventory = getInventoryData();
        for(let item of inventory){
            if(item["itemType"] != "" && !item["isLocked"] && unsafeWindow.findFirstEmptyStorageSlot()){
                let response = await shiftWithStorage(item["slotNum"],item["itemType"],true);
                if(!response){
                    restartAfterFailure("sendInventoryToStorage");
                    return;
                }
                //Sleep to reduce server spam
                await new Promise(r => setTimeout(r, 800));
            }
        }
        updateLabelAndLog("Inventory done storing");
    }
    unsafeWindow.silverSendInventoryToStorage = sendInventoryToStorage

    async function retrieveInventoryFromStorage(startingSlot=96){
        updateLabelAndLog("Retrieving inventory...");
        for(let i=startingSlot;i<=unsafeWindow.userVars["DFSTATS_df_storage_slots"] && findFirstEmptyInventorySlot();i++){
            if(unsafeWindow.storageBox["df_store"+i+"_type"] != undefined){
                let response = await shiftWithStorage(i,unsafeWindow.storageBox["df_store"+i+"_type"],false);
                if(!response){
                    restartAfterFailure("retrieveInventoryFromStorage");
                    return;
                }
                //Sleep to reduce server spam
                await new Promise(r => setTimeout(r, 800));
            }
        }
        if(messageLabel != null){
            messageLabel.textContent = "";
        }
        updateLabelAndLog("Inventory done retrieving");
        //Check if the all in one is active
        let isAio = window.location.href.includes('&silverTraderAio');
        if(isAio){
            aioScrapInventory();
        }
    }
    unsafeWindow.silverRetrieveInventoryFromStorage = retrieveInventoryFromStorage

    function restartAfterFailure(actionToRestart){
        let url = window.location.href.split('&silverTraderReason=')[0];
        let aio = "";
        let isAio = window.location.href.includes('&silverTraderAio');
        if(isAio){
            aio = "&silverTraderAio";
        }
        window.open(url+"&silverTraderReason=failureReload&silverTraderAction="+actionToRestart+aio,"_self")
    }

    function restartAction(url,actionToRestart,isAio=false){
        let aio = "";
        if(isAio){
            aio = "&silverTraderAio";
        }
        window.open(url+"&silverTraderReason=restartAction&silverTraderAction="+actionToRestart+aio,"_self");
    }

    function checkForRestart(){
        if(isAtLocation("failureReload")){
            let url = window.location.href.split('&silverTraderReason=')[0];
            let actionToRestart = window.location.href.split('&silverTraderAction=')[1].split('&')[0];
            let isAio = window.location.href.includes('&silverTraderAio');
            restartAction(url,actionToRestart,isAio);
        }else if(isAtLocation("restartAction")){
            let action = window.location.href.split('&silverTraderAction=')[1].split('&')[0];
            switch(action){
                case "buyScrap":
                    buyScrap();
                    break;
                case "scrapInventory":
                    scrapInventory();
                    break;
                case "sendInventoryToStorage":
                    sendInventoryToStorage();
                    break;
                case "retrieveInventoryFromStorage":
                    retrieveInventoryFromStorage();
                    break;
                default:
                    console.log("No action to perform!");
                    break;
            }
        }
    }

    function aioRetrieveFromStorage(){
        let url = "https://"+locations["storage"][0];
        restartAction(url,"retrieveInventoryFromStorage",true);
    }

    function aioScrapInventory(){
        let url = "https://"+locations["yard"][0];
        //Check if the storage is empty. This happens if there is space left in the inventory.
        if(findFirstEmptyInventorySlot()){
            restartAction(url,"scrapInventory",false);
        }else{
            restartAction(url,"scrapInventory",true);
        }
    }

    function addUI(){
        let buttonList = [];
        if(isAtLocation("marketplace")){
            buttonList = [["Buy Scrap",buyScrap]]
        }else if(isAtLocation("yard")){
            buttonList = [["Scrap Inventory",scrapInventory],["Scrap Storage & Inventory",aioRetrieveFromStorage]]
        }else if(isAtLocation("storage")){
            buttonList = [["Store Inventory",sendInventoryToStorage],["Retrieve Inventory",retrieveInventoryFromStorage]]
        }
        buttonList.push(["## Log ##",null])
        let mainSelect = document.body;
        let cluster = document.createElement("div");
        cluster.id = "silverTraderCluster";
        cluster.style.display = "grid";
        cluster.style.rowGap = "5px";
        cluster.style.position = "fixed";
        cluster.style.top = "18px";
        cluster.style.right = "2px";
        cluster.style.zIndex = "20";
        for(let buttonDef of buttonList){
            let container = document.createElement("div");
            container.style.height = "max-content";
            container.style.width = "max-content";
            container.style.minWidth = "41px";
            container.style.justifySelf = "end";
            container.style.padding = "5px";
            container.style.border = "2px solid rgb(100, 0, 0";
            container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            container.style.backdropFilter = "blur(5px)";
            let button = document.createElement("button");
            button.textContent = buttonDef[0];
            button.id = "silverTrader" + buttonDef[0].replaceAll(' ','');
            button.style.height = "max-content";
            button.addEventListener("click", function(){buttonDef[1]()});

            container.appendChild(button);
            cluster.appendChild(container);
        }
        mainSelect.appendChild(cluster);
        messageLabel = document.getElementById("silverTrader##Log##")
    }

    setTimeout(function(){
        addUI();
        checkForRestart();
    },1500);

})();