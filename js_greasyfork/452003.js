// ==UserScript==
// @name         SilverScrapper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  An automated solution to automatically create receipts from scrapping services
// @author       SilverBeam
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=27*
// @grant        GM.setValue
// @grant        GM.getValue

// @downloadURL https://update.greasyfork.org/scripts/452003/SilverScrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/452003/SilverScrapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //////////////////////////////
    //  Variables Declaration   //
    /////////////////////////////

    var userVars = unsafeWindow.userVars;
    var globalData = unsafeWindow.globalData;
    var transactionHistory = {"transactions":{},"amountTotal":0,"cashTotal":0,"cashEarned":0};

    var vendorCut = 3000;

    var receiptButton = null;

    //////////////////////////
    //  Utility Functions   //
    /////////////////////////

    //Code from https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
    function downloadReceipt(filename, data) {
        const blob = new Blob([data], {type: 'text/plain;charset=utf-8;'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }else{
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob,{oneTimeOnly: true});
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    //////////////////////
    //  Init Functions  //
    /////////////////////

     async function loadStoredTransactions(){
         //We stringify the default object as fallback
         transactionHistory = JSON.parse(await GM.getValue("transactionHistory",JSON.stringify(transactionHistory)));
         console.log(transactionHistory);
    }

    /////////////////////////
    // Scrapper Calculator //
    ////////////////////////

    function makeTransaction(){
        var transaction = fillTransactionData();
        var receiptText = formatReceipt(transaction);
        console.log(receiptText);
        //Get i4i id
        var transactionId = document.getElementById("marketplace").childNodes[1].childNodes[0].dataset.trade;
        //Update history values
        transactionHistory.cashTotal += transaction.scrapValue;
        transactionHistory.cashEarned += transaction.profit;
        //Check if we are updating an already registered transaction
        if(transactionHistory[transactionId] == null){
            transactionHistory.amountTotal += 1;
        }else{
            transactionHistory.cashTotal -= transactionHistory[transactionId].scrapValue;
            transactionHistory.cashEarned -= transactionHistory[transactionId].profit;
        }
        //Add transaction to history and save it
        transactionHistory[transactionId] = transaction;
        GM.setValue("transactionHistory",JSON.stringify(transactionHistory));
        //Download receipt
        downloadReceipt("receipt_"+transaction.date+"_"+transaction.customer+".txt",receiptText);
        //Add required cash to the transaction
        var cashInput = document.getElementsByClassName('cashLabels')[1];
        cashInput.value = transaction.scrapValuePostTax;
        //Notify that we changed the cash value
        var event = new Event('change');
        cashInput.dispatchEvent(event);
    }

    function fillTransactionData(){
        var transaction = {"items":{},"quantity":0,"MCQuantity":0,"scrapValue":0};
        var scrapList = document.getElementsByClassName("theirItems")[0].childNodes;
        //Obtain info on the items to be scrapped
        for(let scrap of scrapList){
            var scrapPrice = unsafeWindow.scrapValue(scrap.dataset.type,scrap.dataset.quantity);
            var scrapName = scrap.dataset.type.split("_")[0];
            var isMC = (scrap.dataset.type.split("_stats")[1] != undefined)?1:0;
            var nonMCQuantity = 1-isMC;
            if(transaction["items"][scrapName] == null){
                transaction["items"][scrapName] = {"item":unsafeWindow.globalData[scrapName].name,"quantity":nonMCQuantity,"MCQuantity":isMC,"scrapValue":isMC?scrapPrice/2:scrapPrice,"MCScrapValue":scrapPrice*isMC,"totalScrapValue":scrapPrice};
            }else{
                transaction["items"][scrapName].quantity += nonMCQuantity;
                transaction["items"][scrapName].MCQuantity += isMC;
                if(isMC){
                    transaction["items"][scrapName].MCScrapValue = scrapPrice;
                }
                transaction["items"][scrapName].totalScrapValue += scrapPrice;
            }
            transaction.quantity++;
            transaction.MCQuantity += isMC;
            transaction.scrapValue += scrapPrice;
        }
        //Add misc info
        transaction.customer = document.getElementById("pageLogo").innerText.split(" - ")[1];
        transaction.tax = vendorCut;
        transaction.profit = transaction.quantity*vendorCut;
        transaction.scrapValuePostTax = transaction.scrapValue - transaction.profit;
        transaction.date = new Date().toLocaleDateString("sv");
        console.log(transaction);

        return transaction;
    }

    function formatReceipt(transaction){
        var receipt = "";
        //Formatter used to convert to dollar notation
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        });
        //Print item list
        for(var item of Object.values(transaction["items"])){
            receipt += "===== "+item.item+" =====";
            if(item.quantity > 0){
                receipt += "\nPrice Per Unit: "+formatter.format(item.scrapValue);
            }
            if(item.MCQuantity > 0){
                receipt += "\nPrice Per MC Unit: "+formatter.format(item.MCScrapValue);
            }
            receipt += "\nNumber of Non-MCs: "+item.quantity;
            receipt += "\nNumber of MCs: "+item.MCQuantity;
            receipt += "\nScrap Value: "+formatter.format(item.totalScrapValue)+"\n\n";
        }
        //Print transaction info
        receipt += "Customer: "+transaction.customer;
        receipt += "\nTotal Number of Items Scrapped: "+transaction.quantity;
        receipt += "\nNumber of MC Items: "+transaction.MCQuantity;
        receipt += "\nTotal Scrap Value: "+formatter.format(transaction.scrapValue);
        receipt += "\nService Charge: "+formatter.format(transaction.tax);
        receipt += "\nTotal Amount Paid to Customer: "+formatter.format(transaction.scrapValuePostTax);
        receipt += "\nScrapper Profit: "+formatter.format(transaction.profit);
        receipt += "\n\nThis receipt was automatically generated by SilverScrapper.\nMade by SilverBeam.\nPM me if you find any bugs or have any inquiries";
        return receipt;
    }

    //////////////////////////////
    //  DOM Event Listeners     //
    //////////////////////////////

    //Wait until the i4i window loads to display the receipt button
    function registeri4iObserver(){
        var observerTargetNode = document.getElementById("marketplace");
        var mutationConfig = { childList: true, subtree: true };

        var i4iMutationCallback = function(mutationList, observer) {
            var isi4iOpen = false;
            for(var mutation of mutationList) {
                if (mutation.type === 'childList') {
                    //Check if the i4i window has been opened
                    isi4iOpen = Object.values(mutation.addedNodes).some(node => node.innerText === "Your Items");
                    if(isi4iOpen){
                        break;
                    }
                }
            }
            if(isi4iOpen){
                receiptButton.style.display = "block";
            }else{
                receiptButton.style.display = "none";
            }
        };

        var i4iObserver = new MutationObserver(i4iMutationCallback);
        i4iObserver.observe(observerTargetNode, mutationConfig);
    }


    //////////////////////////
    //  UI Update Functions //
    //////////////////////////

    function addReceiptButton(){
        var invController = document.getElementById("invController");
        receiptButton = document.createElement("button");
        receiptButton.textContent = "Print Receipt";
        receiptButton.id = "silverscrapperReceiptButton";
        receiptButton.className = "opElem";
        receiptButton.style.top = "76px";
        receiptButton.style.left = "110px";
        receiptButton.style.display = "none";
        receiptButton.addEventListener("click",makeTransaction)
        invController.appendChild(receiptButton);
    }

    ////////////////////
    //  Script Start  //
    ///////////////////

    function startScript(){
        loadStoredTransactions();
        registeri4iObserver();
        addReceiptButton();
    }

    //Give enough time to the vanilla js to complete initialisation.
    setTimeout(async function(){startScript();},500);



})();