// ==UserScript==
// @name         Genesis Mining - Prepare "MY PAYOUTS"-table for Excel including algorithm
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Creates a MS Excel friendly representation of the "MY PAYOUTS"-table of Genesis Mining including the algorithm for each payout.
// If u like my work maybe you want donate some satoshi, litoshi, wei or dash!
// BTC: 32VtovnQAKY5GXLUrb6c82Tm38pUeVc2NS
// LTC: MMLC3UgT8QtcM351k6Xtoi9G4SkvzXPgtn
// ETH: 0x671Ac4695d411669F737E46D2f2814B7e06981d3
// DASH: XtRa8i94Ae9MP9sGHn32qxmJ3hUKEe6oCw
// @author       bassface
// @match        https://www.genesis-mining.com/transactions*
// @match        https://www.genesis-mining.com/payouts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38375/Genesis%20Mining%20-%20Prepare%20%22MY%20PAYOUTS%22-table%20for%20Excel%20including%20algorithm.user.js
// @updateURL https://update.greasyfork.org/scripts/38375/Genesis%20Mining%20-%20Prepare%20%22MY%20PAYOUTS%22-table%20for%20Excel%20including%20algorithm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add new Element for the output
    addOutputElement();

    // Init output value
    document.getElementById('txtInfo').innerHTML = "";

    // Get the tabel and do some stuff with the content
    var myTab = document.getElementsByTagName('table')[0];
    for (var i = 1; i < myTab.rows.length - 1; i++) {
        var objCells = myTab.rows.item(i).cells;
        for (var j = 0; j < objCells.length; j++) {
            // check if we are in the "net payout" column
            var algo = getAlgo(objCells.item(j));
            if (algo !== "") {
                // if we are in the "net payout" column extract the amount and the algorithm
                addCoinsAndAlgo(txtInfo, objCells.item(j), algo);
            // check if we are in the "transaction hash" column
            } else if ((objCells.item(j).innerHTML.includes("Bitte beachten Sie") || objCells.item(j).innerHTML.includes("Please note"))) {
                // checks if something was transfered. In this case add a value to the output
                if ((objCells.item(j).innerHTML.includes("Bitte beachten Sie") || objCells.item(j).innerHTML.includes("Please note")) && (objCells.item(j).innerHTML.includes("Transaktion ansehen") || objCells.item(j).innerHTML.includes("View Transaction"))) {
                    txtInfo.innerHTML = txtInfo.innerHTML + "Transaction";
                }
            // in all other cases extract the column value and delete the none breaking space
            } else {
                txtInfo.innerHTML = txtInfo.innerHTML + objCells.item(j).innerHTML.replace(/&nbsp;/g, '').trim() + "\t";
            }
        }
        txtInfo.innerHTML = txtInfo.innerHTML + "\n";     // add a line break.

    }
})();

// Adds the element for the output to the main-container
function addOutputElement(){
    var div = document.getElementById("main-container");
    var input = document.createElement("textarea");
    input.id = "txtInfo";
    input.rows = "21";
    input.style= "margin: 0 65px; width: 90%;";
    div.appendChild(input);
}

// extracts the amount an algorithm values and adds them to the output
function addCoinsAndAlgo(infoObj, cellItem, algorithm) {
    infoObj.innerHTML = infoObj.innerHTML +cellItem.innerHTML.substr(cellItem.innerHTML.indexOf('.')-5, 15).trim().replace(".", ",") + "\t" + algorithm +"\t";
}

// Identifies the used algorith for the output
function getAlgo(cellItem) {
    ALGO_ZCASH = "equihash";
    NAME_ZCASH = "zec mining";
    ALGO_ETHER = "dagger-hashimoto";
    NAME_ETHER = "eth mining";
    ALGO_MONERO = "cryptonight";
    NAME_MONERO = "etn mining";
    ALGO_BITCOIN = "sha-256";
    NAME_BITCOIN = "btc mining";
    ALGO_LITECOIN = "scrypt";
    NAME_LITECOIN = "ltc mining";
    ALGO_DASH = "x11";
    NAME_DASH = "dash mining";
    var result = "";

    if (cellItem.innerHTML.toLowerCase().includes(ALGO_ZCASH) || cellItem.innerHTML.toLowerCase().includes(NAME_ZCASH)) {
        result = ALGO_ZCASH;
    } else if (cellItem.innerHTML.toLowerCase().includes(ALGO_ETHER) || cellItem.innerHTML.toLowerCase().includes(NAME_ETHER)) {
        result = ALGO_ETHER;
    } else if (cellItem.innerHTML.toLowerCase().includes(ALGO_MONERO) || cellItem.innerHTML.toLowerCase().includes(NAME_MONERO)) {
        result = ALGO_MONERO;
    } else if (cellItem.innerHTML.toLowerCase().includes(ALGO_BITCOIN) || cellItem.innerHTML.toLowerCase().includes(NAME_BITCOIN)) {
        result = ALGO_BITCOIN;
    } else if (cellItem.innerHTML.toLowerCase().includes(ALGO_LITECOIN) || cellItem.innerHTML.toLowerCase().includes(NAME_LITECOIN)) {
        result = ALGO_LITECOIN;
    } else if (cellItem.innerHTML.toLowerCase().includes(ALGO_DASH) || cellItem.innerHTML.toLowerCase().includes(NAME_DASH)) {
        result = ALGO_DASH;
    }
    return result;
}
