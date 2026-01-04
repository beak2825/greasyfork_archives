// ==UserScript==
// @name         Stock selling script
// @namespace    http://tampermonkey.net/
// @version      2024-11-29.01
// @description  Sell stocks without needing a PHD in math
// @author       LePluB
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518215/Stock%20selling%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/518215/Stock%20selling%20script.meta.js
// ==/UserScript==

const FEE_PERCENT = 0.1
const obsOptions = { attributes: false, childList: true, subtree: true};
const moneyRe = /d(\d+)\$/;
const altmoneyRe = /([a-zA-Z])([0-9]+\.{0,1}\d*)([kmb]{1})*([a-zA-Z\$])/;

function onMoneyInput(e) {

    const amountRequested = this.value.match(altmoneyRe);
    if (amountRequested) {

        if (amountRequested[1] == amountRequested[amountRequested.length - 1] || amountRequested[amountRequested.length - 1] == "$") {

            let amountFloat = parseFloat(amountRequested[2]);

            // Handle k, m, b
            if (amountRequested[3]) {

                switch (amountRequested[3]) {
                    case "k":
                        amountFloat *= 1000;
                        break;
                    case "m":
                        amountFloat *= 1000000;
                        break;
                    case "b":
                        amountFloat *= 1000000000;
                        break;
                }
            }
            const currentPrice = getCurrentPrice(this);
            console.log(amountFloat);

            this.value = Math.ceil(parseFloat(amountFloat) / currentPrice);

            // Dispatching a new input event to let torn handle the new number
            this.dispatchEvent(new Event("input"));
        }
        console.log("Skipping");
            return
    }
}

function spansToFloat(nodes) {

    // Takes the individual span elements and returns a properly formatted float

    let numberStr = "";
    nodes.forEach(function (node) {

        numberStr += node.innerText;

    });

    return parseFloat(numberStr);
}

function getCurrentPrice(node) {
    // Gets the current stock price from the given input node

    const stockLine = node.closest("div#panel-ownedTab").previousSibling;
    // Can't use the screen reader label as it's not precise enough
    const labels = stockLine.querySelectorAll("span[class^=number__]");

     return spansToFloat(labels);


}


const onMoneyFieldAppearcallback = (mutationList, observer) => {
    const moneyInputs = document.querySelectorAll("input.input-money");
    moneyInputs.forEach(function (e) {
        e.addEventListener("input", onMoneyInput);
    })

}

const moneyInputObserver = new MutationObserver(onMoneyFieldAppearcallback);

(function() {
    'use strict';

    const stocksWrapperInterval = setInterval(function() {

        let stockMarket = document.querySelector("div#stockmarketroot");

        if (stockMarket !== null) {

            console.log("Starting observing");
            moneyInputObserver.observe(stockMarket, obsOptions);
            clearInterval(stocksWrapperInterval);
        }
    }, 250);

})();