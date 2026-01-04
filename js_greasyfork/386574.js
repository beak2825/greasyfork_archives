// ==UserScript==
// @name         Marketplace Hover Prices - Edge version
// @namespace    http://tampermonkey.net/
// @version      1.61
// @description  Find out prices of items in your inventory by hovering over them while at the Marketplace
// @author       SilverBeam
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35

// @downloadURL https://update.greasyfork.org/scripts/386574/Marketplace%20Hover%20Prices%20-%20Edge%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/386574/Marketplace%20Hover%20Prices%20-%20Edge%20version.meta.js
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

    function filterParams(txt){
        let tmp = {};
        tmp.tradeZone = txt.match(/df_tradezone=\d*/)[0].split("=")[1];
        tmp.slotNum = parseInt(txt.match(/df_invslots=\d*/)[0].split("=")[1]);
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
            //item.id = baseItemId;
            //console.log(item.id);

            if(item.id != ""){

                if(item.id.indexOf("ammo") != -1){
                    item.code = "";
                    item.name = parseAmmo(item.id);
                    item.quantity = parseInt(txt.match(new RegExp("df_inv" + i + "_quantity=[0-9]+"))[0].split("=")[1]);
                    item.type = "Ammo";
                }else if(txt.match(new RegExp("GLOBALDATA_armour[0-9]+_code="+item.id+"&")) != null){ //Check the item is an armor
                    item.code = txt.match(new RegExp("GLOBALDATA_armour[0-9]+_code="+item.id))[0].split("=")[0].match(/[0-9]+/)[0];
                    item.name = txt.match(new RegExp("GLOBALDATA_armour"+item.code+"_name=*[^&]*"))[0].split("=")[1];
                    item.quantity = 1;
                    item.type = "Armor";
                }else if(txt.match(new RegExp("GLOBALDATA_weapon[0-9]+_code="+item.id+"&")) != null){ //Check if the item is a weapon
                    if(item.id.indexOf("_") != -1){
                        item.id = item.id.split[0];
                    }
                    item.code = txt.match(new RegExp("GLOBALDATA_weapon[0-9]*_code="+item.id+"[^&]*"))[0].split("=")[0].match(/[0-9]+/)[0];
                    item.name = txt.match(new RegExp("GLOBALDATA_weapon"+item.code+"_name=*[^&]*"))[0].split("=")[1];
                    item.quantity = parseInt(txt.match(new RegExp("df_inv" + i + "_quantity=[0-9]+"))[0].split("=")[1]);
                    item.type = "Weapon";
                }else{ //Default to item or implant
                    item.code = txt.match(new RegExp("GLOBALDATA_item[0-9]+_code="+item.id))[0].split("=")[0].match(/[0-9]+/)[0];
                    item.name = txt.match(new RegExp("GLOBALDATA_item"+item.code+"_name=*[^&]*"))[0].split("=")[1];
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

        return tmp;
    }

    function removeInvItem(index){
        //console.log("Deleting index "+index+" in ");
        //console.log(params);
        params.invArr[index].id = "";
        params.invArr[index].extraInfo = "";
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
                //console.log("Logging item: "+data.name);
                //console.log(data);
                filterResponseText(data);
                updateParams(data,items);
                requestsCompleted += 1;
                //console.log(requestsCompleted);
                if(requestsCompleted >= requestsNum){console.log(dataBank);console.log(items);requestsAllDone = 1;}
                //console.log(calculateAvailableOffers(this.responseText));
            }
        };
        xhttp.open("POST", "trade_search.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("hash=16cc837c932e96f694b012566cddec40&pagetime=1558282908&tradezone="+tradezone+"&searchname="+encodeURI(data.name.substring(0,15))+"&category=&profession=&memID=&searchtype=buyinglistitemname&search=trades");
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

        return params.invArr[cellNum-1].name + "\nQuantity: " + params.invArr[cellNum-1].quantity +
               "\nBest price per unit: " + params.invArr[cellNum-1].bestPricePerUnit.toFixed(2) + "\nBest price this stack: " + (params.invArr[cellNum-1].bestPricePerUnit*params.invArr[cellNum-1].quantity).toFixed(2) +
               "\nAverage price per unit: " + params.invArr[cellNum-1].averagePricePerUnit.toFixed(2) + "\nAverage price this stack: " + (params.invArr[cellNum-1].averagePricePerUnit*params.invArr[cellNum-1].quantity).toFixed(2);

    }

    function checkHover(event){

        let bodyRect = document.body.getBoundingClientRect();
        let adjustX;
        if(((flashNode.parentNode.getBoundingClientRect().width - flashRect.width) - ((flashRect.width / 685) * 16)) != 0){
            adjustX = (flashRect.width / 685) * 38;
        }else{
            adjustX = 0;
        }
        let adjustY = document.getElementById("block13").children[0].children[0].children[0].getBoundingClientRect().height - 25;

        if(requestsAllDone == 1 && event.clientX-bodyRect.left-adjustX > invLeft && event.clientX-bodyRect.left-adjustX <= invLeft+invWidth && event.clientY-bodyRect.top-adjustY > invTop && event.clientY-bodyRect.top-adjustY <= invTop+invHeight){
            let cellNum = parseInt(((event.clientX-bodyRect.left-adjustX - invLeft)/cellSize))*2 + parseInt((((event.clientY-bodyRect.top-adjustY - invTop)/cellSize)+1));
            if(params.invArr[cellNum-1].name != ""){
                hoverText.textContent = fillHoverBox(cellNum);
                hoverContainer.style.left = event.clientX - bodyRect.left + 20 + "px";
                hoverContainer.style.top = event.clientY - bodyRect.top + 20 + "px";
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
        let adjustY = document.getElementById("block13").children[0].children[0].children[0].getBoundingClientRect().height - 25;

        if(requestsAllDone == 1 && event.clientX-bodyRect.left > invLeft && event.clientX-bodyRect.left <= invLeft+invWidth && event.clientY-bodyRect.top-adjustY > invTop && event.clientY-bodyRect.top-adjustY <= invTop+invHeight){
            let cellNum = parseInt(((event.clientX-bodyRect.left - invLeft)/cellSize))*2 + parseInt((((event.clientY-bodyRect.top-adjustY - invTop)/cellSize)+1));
            if(params.invArr[cellNum-1].name != ""){
                holdStartCell = cellNum;
            }else{
                holdStartCell = -1;
            }
        }else if(event.clientX-bodyRect.left > marketTabLeft1 && event.clientX-bodyRect.left <= marketTabLeft1+marketTabWidth && event.clientY-bodyRect.top-adjustY > marketTabTop && event.clientY-bodyRect.top-adjustY <= marketTabTop+marketTabHeight){
            currentMarketTab = 0;
            holdStartCell = -1;
        }else if(event.clientX-bodyRect.left > marketTabLeft2 && event.clientX-bodyRect.left <= marketTabLeft2+marketTabWidth && event.clientY-bodyRect.top-adjustY > marketTabTop && event.clientY-bodyRect.top-adjustY <= marketTabTop+marketTabHeight){
            currentMarketTab = 1;
            holdStartCell = -1;
        }else if(event.clientX-bodyRect.left > marketTabLeft3 && event.clientX-bodyRect.left <= marketTabLeft3+marketTabWidth && event.clientY-bodyRect.top-adjustY > marketTabTop && event.clientY-bodyRect.top-adjustY <= marketTabTop+marketTabHeight){
            currentMarketTab = 2;
            holdStartCell = -1;
        }else if(transactionStatus == 0){
            holdStartCell = -1;
        }
    }

    function checkUp(event){
        let bodyRect = document.body.getBoundingClientRect();
        let adjustY = document.getElementById("block13").children[0].children[0].children[0].getBoundingClientRect().height - 25;

        if(event.clientX-bodyRect.left > invLeft && event.clientX-bodyRect.left <= invLeft+invWidth && event.clientY-bodyRect.top-adjustY > invTop && event.clientY-bodyRect.top-adjustY <= invTop+invHeight){
            let cellNum = parseInt(((event.clientX-bodyRect.left - invLeft)/cellSize))*2 + parseInt((((event.clientY-bodyRect.top-adjustY - invTop)/cellSize)+1));
            if(holdStartCell != -1 && cellNum != holdStartCell){
                //console.log("Swap detected from "+holdStartCell+" to "+cellNum);
                swapInvSlots(holdStartCell-1,cellNum-1);
            }
            holdStartCell = -1;
        }else if(transactionStatus == 0 && holdStartCell != -1 && currentMarketTab == 1 && event.clientX-bodyRect.left > marketWindowLeft && event.clientX-bodyRect.left <= marketWindowLeft+marketWindowWidth && event.clientY-bodyRect.top-adjustY > marketWindowTop && event.clientY-bodyRect.top-adjustY <= marketWindowTop+marketWindowHeight){
            //console.log("Detected attempt to sell "+params.invArr[holdStartCell-1].name+" from inventory slot "+holdStartCell);
            //console.log("Transaction initiated");
            transactionStatus = 1;
        }else if(transactionStatus == 1 && event.clientX-bodyRect.left > okLeft && event.clientX-bodyRect.left <= okLeft+okWidth && event.clientY-bodyRect.top-adjustY > okTop && event.clientY-bodyRect.top-adjustY <= okTop+okHeight){
            //console.log("Transaction OK");
            transactionStatus = 2;
        }else if(transactionStatus == 1 && event.clientX-bodyRect.left > cancelLeft && event.clientX-bodyRect.left <= cancelLeft+okWidth && event.clientY-bodyRect.top-adjustY > okTop && event.clientY-bodyRect.top-adjustY <= okTop+okHeight){
            //console.log("Transaction Cancel");
            transactionStatus = 0;
            holdStartCell = -1;
        }else if(transactionStatus == 2 && event.clientX-bodyRect.left > yesLeft && event.clientX-bodyRect.left <= yesLeft+okWidth && event.clientY-bodyRect.top-adjustY > yesTop && event.clientY-bodyRect.top-adjustY <= yesTop+okHeight){
            //console.log("Transaction Yes");
            removeInvItem(holdStartCell-1);
            transactionStatus = 0;
            holdStartCell = -1;
        }else if(transactionStatus == 2 && event.clientX-bodyRect.left > noLeft && event.clientX-bodyRect.left <= noLeft+okWidth && event.clientY-bodyRect.top-adjustY > yesTop && event.clientY-bodyRect.top-adjustY <= yesTop+okHeight){
            //console.log("Transaction No");
            transactionStatus = 0;
            holdStartCell = -1;
        }
    }

    function checkKey(event){

        if(event.code == "Enter" || event.code == "NumpadEnter"){
            if(transactionStatus == 1){
                transactionStatus = 2;
                //console.log("Transaction OK");
                //console.log(holdStartCell);
            }else if(transactionStatus == 2){
                //console.log("Transaction Yes");
                //console.log(holdStartCell);
                removeInvItem(holdStartCell-1);
                transactionStatus = 0;
                holdStartCell = -1;
            }
        }
    }

    function swapInvSlots(from,to){
        let tmp = params.invArr[to];
        params.invArr[to] = params.invArr[from];
        params.invArr[from] = tmp;
    }

    function adjustButtonY(){
        let flashRect = document.getElementById("flashMain1").getBoundingClientRect();
        let bodyRect = document.body.getBoundingClientRect();
        let adjustY = document.getElementById("block13").children[0].children[0].children[0].getBoundingClientRect().height - 25;
        enableButton.style.top = flashRect.top + flashRect.height - bodyRect.top - 120 + "px";


        if(wInputFix === false && document.getElementById("wInput") != null){
            document.getElementById("wInput").addEventListener("keydown",function(){if(event.code == "Enter" || event.code == "NumpadEnter"){document.getElementById("wInput").parentNode.children[2].click()}});
            wInputFix = true;
        }

        if(dInputFix === false && document.getElementById("dInput") != null){
            document.getElementById("dInput").addEventListener("keydown",function(){if(event.code == "Enter" || event.code == "NumpadEnter"){document.getElementById("dInput").parentNode.children[2].click()}});
            dInputFix = true;
        }
    }

    function startScript(){
        requestInvItems(params,dataBank);
        flashNode.addEventListener("mousemove",checkHover,true);
        document.addEventListener("mouseup",checkUp,true);
        flashNode.addEventListener("keydown",checkKey,true);
        enableButton.style.display = "none";
        clearInterval(interval);
    }

    var flashNode = document.getElementById("flashMain1");
    var flashParamsNode = flashNode.children[0];
    var flashRect = flashNode.getBoundingClientRect();
    var rawParams = flashParamsNode.value;
    var dataBank = [];
    var params = filterParams(rawParams);
    var requestsNum = 0;
    var requestsCompleted = 0;
    var requestsAllDone = 0;

    //requestInvItems(params,dataBank);


    var cellSize = (flashRect.height / 520) * 44;
    var invHeight = (cellSize * 2);
    var invWidth = cellSize * (params.slotNum/2);
    var invLeft = ((flashRect.width / 685) * (12.5 + (660 - invWidth)/2)) + flashRect.left - document.body.getBoundingClientRect().left;
    var invTop = ((flashRect.height / 520) * 425.5) + flashRect.top - document.body.getBoundingClientRect().top;
    var marketTabHeight = (flashRect.height / 520) * 20;
    var marketTabWidth = (flashRect.width / 685) * 85;
    var marketTabLeft1 = ((flashRect.width / 685) * 207) + flashRect.left - document.body.getBoundingClientRect().left;
    var marketTabLeft2 = ((flashRect.width / 685) * 302) + flashRect.left - document.body.getBoundingClientRect().left;
    var marketTabLeft3 = ((flashRect.width / 685) * 397) + flashRect.left - document.body.getBoundingClientRect().left;
    var marketTabTop = ((flashRect.height / 520) * 45) + flashRect.top - document.body.getBoundingClientRect().top;
    var marketWindowHeight = (flashRect.height / 520) * 240;
    var marketWindowWidth = (flashRect.width / 685) * 535;
    var marketWindowLeft = ((flashRect.width / 685) * 57) + flashRect.left - document.body.getBoundingClientRect().left;
    var marketWindowTop = ((flashRect.height / 520) * 85) + flashRect.top - document.body.getBoundingClientRect().top;
    var okHeight = (flashRect.height / 520) * 20;
    var okWidth = (flashRect.width / 685) * 65;
    var okLeft = ((flashRect.width / 685) * 270) + flashRect.left - document.body.getBoundingClientRect().left;
    var okTop = ((flashRect.height / 520) * 265) + flashRect.top - document.body.getBoundingClientRect().top;
    var cancelLeft = ((flashRect.width / 685) * 340) + flashRect.left - document.body.getBoundingClientRect().left;
    var yesLeft = ((flashRect.width / 685) * 277) + flashRect.left - document.body.getBoundingClientRect().left;
    var yesTop = ((flashRect.height / 520) * 267) + flashRect.top - document.body.getBoundingClientRect().top;
    var noLeft = ((flashRect.width / 685) * 347) + flashRect.left - document.body.getBoundingClientRect().left;
    var adjustTop = document.getElementById("block13").children[0].children[0].children[0].getBoundingClientRect().height - 25;

    var hoverContainer = document.createElement("div");
    hoverContainer.style.position = "absolute";
    hoverContainer.style.backgroundColor = "white";
    hoverContainer.style.display = "none";
    hoverContainer.style.height = "120px";
    hoverContainer.style.width = "200px";
    var hoverText = document.createElement("p");
    hoverText.style.color = "black";
    hoverText.style.whiteSpace = "pre";
    hoverContainer.appendChild(hoverText);
    document.getElementsByTagName("body")[0].appendChild(hoverContainer);

    var enableButton = document.createElement("button");
    enableButton.style.position = "absolute";
    enableButton.style.height = "18px";
    enableButton.style.fontSize = "12px";
    enableButton.innerHTML = "Enable hover box";
    enableButton.style.left = flashRect.left + 15 + "px";
    enableButton.addEventListener("click",startScript,true);

    var marketDetector = document.createElement("div");
    marketDetector.style.position = "absolute";
    marketDetector.style.backgroundColor = "red";
    marketDetector.style.height = "20px";
    marketDetector.style.width = "65px";
    marketDetector.style.left = flashRect.left + 347 + "px";
    marketDetector.style.top = flashRect.top + 302 + "px";
    //document.getElementsByTagName("body")[0].appendChild(marketDetector);

    var holdStartCell = -1;
    var currentMarketTab = 0;
    var transactionStatus = 0;

    var wInputFix = false;
    var dInputFix = false;
    var interval = setInterval(adjustButtonY,20);
    document.addEventListener("mousedown",checkDown,true);
    document.getElementsByTagName("body")[0].appendChild(enableButton);


})();