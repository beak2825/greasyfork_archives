// ==UserScript==
// @name         Inventory Hover Prices
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  Find out prices of items in your inventory by hovering over them while in the Inner City
// @author       SilverBeam
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/384228/Inventory%20Hover%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/384228/Inventory%20Hover%20Prices.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseAmmo(ammo){
        let resp = "";
        switch(ammo){

                case '32ammo': resp = '.32 Handgun Bullets'; break;
                case '35ammo': resp = '9 mm Handgun Bullets'; break;
                case '38ammo': resp = '.38 Handgun Bullets'; break;
                case '40ammo': resp = '.40 Handgun Bullets'; break;
                case '357ammo': resp = '.357 Handgun Bullets'; break;
                case '45ammo': resp = '.45 Handgun Bullets'; break;
                case '50ammo': resp = '.50 Handgun Bullets'; break;
                case '55ammo': resp = '.55 Handgun Bullets'; break;
                case '55rifleammo': resp = '5.5mm Rifle Bullets'; break;
                case '75rifleammo': resp = '7.5mm Rifle Bullets'; break;
                case '9rifleammo': resp = '9mm Rifle Bullets'; break;
                case '127rifleammo': resp = '12.7mm Rifle Bullets'; break;
                case '14rifleammo': resp = '14mm Rifle Bullets'; break;
                case '12gaugeammo': resp = '12 Gauge Shells'; break;
                case '16gaugeammo': resp = '16 Gauge Shells'; break;
                case '20gaugeammo': resp = '20 Gauge Shells'; break;
                case '10gaugeammo': resp = '10 Gauge Shells'; break;
                case 'heavygrenadeammo': resp = 'Heavy Grenades'; break;
                case 'grenadeammo': resp = 'Grenades'; break;
                default: resp = 'Sum Ting Wong';

        }
        return resp;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function fillDataBank(id,extraInfo,name,type){
       let found = false;
       //console.log("Entering dataBank fill with: "+dataBank);

       for(let x of dataBank){
           if(x.id == id){
               found = true;
               break;
           }
       }

       if(!found){
           let item = {};
           item.id = id;
           item.extraInfo = extraInfo;
           item.name = name;
           item.type = type;
           dataBank.push(item);
       }
    }

    function filterParams(txt,dataBase){
        let tmp = {};
        if(params == null){
            tmp.userId = txt.match(/userID=\d+/)[0].split("=")[1];
            tmp.sc = txt.match(/sc=*[^&]*/)[0].split("=")[1];
            tmp.password = GM_getValue('password','');
            tmp.tradeZone = txt.match(/df_tradezone=\d*/)[0].split("=")[1];
            tmp.slotNum = parseInt(txt.match(/df_invslots=\d*/)[0].split("=")[1]);
        }else{
            tmp.userId = params.userId;
            tmp.sc = params.sc;
            tmp.password = params.password;
            tmp.tradeZone = params.tradeZone;
            tmp.slotNum = params.slotNum;
        }
        //console.log(txt);
        tmp.invArr = [];

        for(let i=1;i<=tmp.slotNum;i++){
            let item = {};
            let baseItemId;
            item.id = txt.match(new RegExp("df_inv" + i + "_type=*[^&]*"))[0].split("=")[1];
            item.extraInfo = "";
            item.type = "";

            if(item.id.indexOf("_") != -1){
                item.extraInfo = capitalizeFirstLetter(item.id.split("_")[1]);
                item.id = item.id.split("_")[0];
            }
            if(item.id != ""){
                //console.log(item.id);
                if(item.id.indexOf("ammo") != -1){
                    item.code = "";
                    item.name = parseAmmo(item.id);
                    item.type = "Ammo";
                    item.quantity = parseInt(txt.match(new RegExp("df_inv" + i + "_quantity=[0-9]+"))[0].split("=")[1]);
                }else if(item.id.split("_")[0] != null && dataBase.match(new RegExp("GLOBALDATA_armour[0-9]+_code="+item.id.split("_")[0])) != null){ //Check the item is an armor
                    item.code = dataBase.match(new RegExp("GLOBALDATA_armour[0-9]+_code="+item.id.split("_")[0]))[0].split("=")[0].match(/[0-9]+/)[0];
                    item.name = dataBase.match(new RegExp("GLOBALDATA_armour"+item.code+"_name=*[^&]*"))[0].split("=")[1];
                    item.quantity = 1;
                    item.type = "Armor";
                }else if(dataBase.match(new RegExp("GLOBALDATA_weapon[0-9]+_code="+item.id)) != null){ //Check if the item is a weapon
                    item.code = dataBase.match(new RegExp("GLOBALDATA_weapon[0-9]*_code="+item.id))[0].split("=")[0].match(/[0-9]+/)[0];
                    item.name = dataBase.match(new RegExp("GLOBALDATA_weapon"+item.code+"_name=*[^&]*"))[0].split("=")[1];
                    item.quantity = parseInt(txt.match(new RegExp("df_inv" + i + "_quantity=[0-9]+"))[0].split("=")[1]);
                    item.type = "Weapon";
                }else{ //Default to item or implant
                    item.code = dataBase.match(new RegExp("GLOBALDATA_item[0-9]+_code="+item.id))[0].split("=")[0].match(/[0-9]+/)[0];
                    item.name = dataBase.match(new RegExp("GLOBALDATA_item"+item.code+"_name=*[^&]*"))[0].split("=")[1];
                    if(item.extraInfo){
                        item.name = item.extraInfo + " " + item.name;
                    }
                    item.quantity = parseInt(txt.match(new RegExp("df_inv" + i + "_quantity=[0-9]+"))[0].split("=")[1]);
                    item.type = "Item";
                }
                fillDataBank(item.id,item.extraInfo,item.name,item.type);
            }else{
                item.code = "";
                item.name = "";
                item.quantity = 0;
            }

            //console.log(item);
            tmp.invArr.push(item);

        }

        //console.log(tmp);
        return tmp;
    }

    function removeInvItem(index){
        //console.log("Deleting index "+index+" in ");
        //console.log(params);
        params.invArr[index].id = "";
        params.invArr[index].code = "";
        params.invArr[index].name = "";
        delete params.invArr[index].bestPricePerUnit;
        delete params.invArr[index].averagePricePerUnit;
    }

    function requestItem(tradezone,data,items){

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data.rawServerResponse = this.responseText;
                filterResponseText(data);
                updateParams(data,items);
                requestsCompleted += 1;
                //console.log(requestsCompleted);
                if(requestsCompleted >= requestsNum){console.log(dataBank);console.log(items);requestsAllDone = 1;}
                //console.log(calculateAvailableOffers(this.responseText));
            }
        };

        let itemName = data.name;
        if(data.extraInfo.indexOf("Colour") != -1){
            itemName = itemName.split(" ")[1];
        }

        xhttp.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //console.log(data.name);
        xhttp.send("hash=16cc837c932e96f694b012566cddec40&pagetime=1558282908&tradezone="+tradezone+"&searchname="+encodeURI(itemName.substring(0,15))+"&category=&profession=&memID=&searchtype=buyinglistitemname&search=trades");
        //console.log("hash=16cc837c932e96f694b012566cddec40&pagetime=1558282908&tradezone="+tradezone+"&searchname="+encodeURI(item.name)+"&category=&profession=&memID=&searchtype=buyinglistitemname&search=trades");

    }

    function requestInvItems(items,databank){

        requestsNum = databank.length;

        for(let i=0;i<databank.length;i++){
            if(databank[i].name != ""){
                requestItem(items.tradeZone,databank[i],items);
            }else{
                databank[i].rawServerResponse = "";
            }
        }

    }

    function requestInvInfo(){

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                params = filterParams(this.responseText,rawParams);
                invRequestable = false;
                for(let x of dataBank){
                    updateParams(x,params);
                }
                setTimeout(function(){ invRequestable = true; }, 3000);
            }
        };
        xhttp.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/get_values.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("templateID=undefined&sc="+params.sc+"&userID="+params.userId+"&password="+params.password);

    }

    function calculateAvailableOffers(resp){
        let matches = resp.match(/tradelist_[0-9]+_trade_id=/g);
        if(matches != null){
            return matches.length;
        }else{
            return 0;
        }
    }

    function filterResponseText(item){
            let itemRawResponse = item.rawServerResponse;
            if(itemRawResponse != ""){
                let maxTrades = calculateAvailableOffers(itemRawResponse);
                let firstOccurence;
                if(itemRawResponse.indexOf("tradelist_maxresults=0") == -1){
                    if(item.extraInfo != ""){
                        firstOccurence = parseInt(itemRawResponse.match(new RegExp("tradelist_[0-9]+_item="+item.id))[0].split("=")[0].match(/[0-9]+/)[0]);
                    }else{
                        firstOccurence = parseInt(itemRawResponse.match(new RegExp("tradelist_[0-9]+_item="+item.id+"&"))[0].split("=")[0].match(/[0-9]+/)[0]);
                    }
                }else{
                    firstOccurence = 1;
                }
                let availableTrades = maxTrades - firstOccurence + 1;
                let avgPrice = 0;
                let examinedTrades = 0;

                for(;(examinedTrades<availableTrades)&&(examinedTrades<10);examinedTrades++){
                    //console.log("Examination "+examinedTrades);
                    let pricePerUnit;
                    if(item.type == "Armor"){
                        pricePerUnit = parseInt(itemRawResponse.match(new RegExp("tradelist_"+(firstOccurence+examinedTrades)+"_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                    }else{
                        pricePerUnit = parseInt(itemRawResponse.match(new RegExp("tradelist_"+(firstOccurence+examinedTrades)+"_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]) /
                                       parseInt(itemRawResponse.match(new RegExp("tradelist_"+(firstOccurence+examinedTrades)+"_quantity=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                    }
                    avgPrice += pricePerUnit;
                    if(examinedTrades == 0){
                        item.bestPricePerUnit = pricePerUnit;
                    }
                }
                item.averagePricePerUnit = avgPrice / examinedTrades;
                if(avgPrice == 0 && examinedTrades == 0){
                    item.averagePricePerUnit = 0;
                    item.bestPricePerUnit = 0;
                }
                //console.log(item.id +": "+item.averagePricePerUnit+" "+item.bestPricePerUnit);
            }
    }

    function updateParams(data,params){
        for(let x of params.invArr){
            if(x.id == data.id){
                x.bestPricePerUnit = data.bestPricePerUnit;
                x.averagePricePerUnit = data.averagePricePerUnit;
            }
        }
    }



    function fillHoverBox(cellNum){

        console.log(typeof params.invArr[cellNum-1].bestPricePerUnit);
        return params.invArr[cellNum-1].name +
               "\nQuantity: " + params.invArr[cellNum-1].quantity +
               "\nBest price per unit: " + ((typeof params.invArr[cellNum-1].bestPricePerUnit !== 'undefined')? params.invArr[cellNum-1].bestPricePerUnit.toFixed(2):"Not Detected") +
               "\nBest price this stack: " + ((typeof params.invArr[cellNum-1].bestPricePerUnit !== 'undefined')? (params.invArr[cellNum-1].bestPricePerUnit*params.invArr[cellNum-1].quantity).toFixed(2):"Not Detected") +
               "\nAverage price per unit: " + ((typeof params.invArr[cellNum-1].averagePricePerUnit !== 'undefined')? params.invArr[cellNum-1].averagePricePerUnit.toFixed(2):"Not Detected") +
               "\nAverage price this stack: " + ((typeof params.invArr[cellNum-1].averagePricePerUnit !== 'undefined')? (params.invArr[cellNum-1].averagePricePerUnit*params.invArr[cellNum-1].quantity).toFixed(2):"Not Detected");

    }

    function checkHover(event){

        let bodyRect = document.body.getBoundingClientRect();

        if(requestsAllDone == 1 && event.clientX-bodyRect.x > invLeft && event.clientX-bodyRect.x <= invLeft+invWidth && event.clientY-bodyRect.y > invTop && event.clientY-bodyRect.y <= invTop+invHeight){
            let cellNum = parseInt(((event.clientX-bodyRect.x - invLeft)/cellSize))*2 + parseInt((((event.clientY-bodyRect.y - invTop)/cellSize)+1));
            if(params.invArr[cellNum-1].name != ""){
                hoverText.textContent = fillHoverBox(cellNum);
                hoverContainer.style.left = event.clientX - bodyRect.x + 20 + "px";
                hoverContainer.style.top = event.clientY - bodyRect.y + 20 + "px";
                hoverContainer.style.display = "block";
            }else{
                hoverContainer.style.display = "none";
            }
        }else{
            hoverContainer.style.display = "none";
        }

    }

    function checkDown(event){
        let bodyRect = document.body.getBoundingClientRect();

        if(requestsAllDone == 1 && event.clientX-bodyRect.x > invLeft && event.clientX-bodyRect.x <= invLeft+invWidth && event.clientY-bodyRect.y > invTop && event.clientY-bodyRect.y <= invTop+invHeight){
            let cellNum = parseInt(((event.clientX-bodyRect.x - invLeft)/cellSize))*2 + parseInt((((event.clientY-bodyRect.y - invTop)/cellSize)+1));
            if(params.invArr[cellNum-1].name != ""){
                holdStartCell = cellNum;
            }else{
                holdStartCell = -1;
            }
        }
    }

    function checkUp(event){
        if(invRequestable == true && holdStartCell != -1 && params.invArr[holdStartCell-1].name != ""){
            setTimeout(requestInvInfo,400);
        }
        holdStartCell = -1;
    }

    function saveSessionData(event){
        GM_setValue('dataBank', dataBank);
        GM_setValue('lastPageLoad', new Date().getTime());
    }

    function startScript(){
        let lastPageLoad = GM_getValue('lastPageLoad',-1);
        let now = new Date();
        //console.log(lastPageLoad);
        //console.log("Time diff: "+(now.getTime()-lastPageLoad)/1000);
        if(lastPageLoad != -1 && ((now.getTime()-lastPageLoad)/1000) <= 5){
            dataBank = GM_getValue('dataBank',[]);
            //console.log("databank loaded from memory");
            for(let x of dataBank){
                updateParams(x,params);
            }
            requestsAllDone = 1;
            console.log("Content loaded from stored DataBank");
            console.log(dataBank);
            console.log(params);
        }else{
            requestInvItems(params,dataBank);
        }
        flashNode.addEventListener("mousemove",checkHover,true);
        document.addEventListener("mouseup",checkUp,true);
        enableButton.style.display = "none";
    }

    var flashNode = document.getElementById("flashMain1");
    var flashParamsNode = flashNode.children[0];
    var flashRect = flashNode.getBoundingClientRect();
    var rawParams = flashParamsNode.value;
    var dataBank = [];
    var params = null;
    if(window.location.href == "https://fairview.deadfrontier.com/onlinezombiemmo/index.php"){
        let tmpPassword = rawParams.match(/password=*[^&]*/)[0].split("=")[1];
        GM_setValue('password', tmpPassword);
        //console.log("Stored: "+GM_getValue('password',''));
    }else{
        params = filterParams(rawParams,rawParams);
    }
    var requestsNum = 0;
    var requestsCompleted = 0;
    var requestsAllDone = 0;

    //requestInvItems(params,dataBank);


    var cellSize = (flashRect.height / 520) * 44;
    var invHeight = (cellSize * 2);
    var invWidth = 0;
    if(window.location.href != "https://fairview.deadfrontier.com/onlinezombiemmo/index.php"){
        invWidth = cellSize * (params.slotNum/2);
    }
    var invLeft = ((flashRect.width / 685) * (12.5 + (660 - invWidth)/2)) + flashRect.left - document.body.getBoundingClientRect().x;
    var invTop = ((flashRect.height / 520) * 425.5) + flashRect.top - document.body.getBoundingClientRect().y;
    var marketTabHeight = (flashRect.height / 520) * 20;
    var marketTabWidth = (flashRect.width / 685) * 85;
    var marketTabLeft1 = ((flashRect.width / 685) * 207) + flashRect.left - document.body.getBoundingClientRect().x;
    var marketTabLeft2 = ((flashRect.width / 685) * 302) + flashRect.left - document.body.getBoundingClientRect().x;
    var marketTabLeft3 = ((flashRect.width / 685) * 397) + flashRect.left - document.body.getBoundingClientRect().x;
    var marketTabTop = ((flashRect.height / 520) * 45) + flashRect.top - document.body.getBoundingClientRect().y;
    var marketWindowHeight = (flashRect.height / 520) * 240;
    var marketWindowWidth = (flashRect.width / 685) * 535;
    var marketWindowLeft = ((flashRect.width / 685) * 57) + flashRect.left - document.body.getBoundingClientRect().x;
    var marketWindowTop = ((flashRect.height / 520) * 85) + flashRect.top - document.body.getBoundingClientRect().y;
    var okHeight = (flashRect.height / 520) * 20;
    var okWidth = (flashRect.width / 685) * 65;
    var okLeft = ((flashRect.width / 685) * 270) + flashRect.left - document.body.getBoundingClientRect().x;
    var okTop = ((flashRect.height / 520) * 265) + flashRect.top - document.body.getBoundingClientRect().y;
    var cancelLeft = ((flashRect.width / 685) * 340) + flashRect.left - document.body.getBoundingClientRect().x;
    var yesLeft = ((flashRect.width / 685) * 277) + flashRect.left - document.body.getBoundingClientRect().x;
    var yesTop = ((flashRect.height / 520) * 267) + flashRect.top - document.body.getBoundingClientRect().y;
    var noLeft = ((flashRect.width / 685) * 347) + flashRect.left - document.body.getBoundingClientRect().x;

    var hoverContainer = document.createElement("div");
    hoverContainer.style.position = "absolute";
    hoverContainer.style.backgroundColor = "white";
    hoverContainer.style.display = "none";
    hoverContainer.style.height = "120px";
    hoverContainer.style.width = "200px";
    hoverContainer.style.zIndex = "2";
    var hoverText = document.createElement("p");
    hoverText.style.color = "black";
    hoverText.style.whiteSpace = "pre";
    hoverText.style.fontSize = "14px";
    hoverContainer.appendChild(hoverText);
    document.getElementsByTagName("body")[0].appendChild(hoverContainer);

    var enableButton = document.createElement("button");
    enableButton.style.position = "absolute";
    enableButton.style.height = "18px";
    enableButton.style.fontSize = "12px";
    enableButton.innerHTML = "Enable hover box";
    enableButton.style.left = flashRect.left + 15 + "px";
    enableButton.addEventListener("click",startScript,true);

    var holdStartCell = -1;
    var invRequestable = true;

    document.addEventListener("mousedown",checkDown,true);
    setInterval(saveSessionData,2000);

    if(window.location.href != "https://fairview.deadfrontier.com/onlinezombiemmo/index.php"){
        startScript();
    }


})();