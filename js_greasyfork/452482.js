// ==UserScript==
// @name        VaporNodes estimated daily income and price fixes
// @description        Fixes VaporNodes price and estimated daily income issues
// @version        1.0.2
// @author        theimperious1
// @grant        GM_xmlhttpRequest
// @match        https://app.vapornodes.finance/nodes
// @match        https://app.vapornodes.finance/calculator
// @namespace supreme-one.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452482/VaporNodes%20estimated%20daily%20income%20and%20price%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/452482/VaporNodes%20estimated%20daily%20income%20and%20price%20fixes.meta.js
// ==/UserScript==
/* Warning:  Using @match versus @include can kill the Cross-domain ability of
    GM_xmlhttpRequest! Bug?
*/
function injectCode($) {

    //--- This next value could be from the page's or the injected-code's JS.
    var fetchURL = "https://coinmarketcap.com/currencies/vapornodes/";

    //--- Tag the message, in case there's more than one type flying about...
    var messageTxt = JSON.stringify(["fetchURL", fetchURL])
    window.postMessage(messageTxt, "*");
}

withPages_jQuery(injectCode);
console.log("VaporNode price fixer is running...");

//--- This code listens for the right kind of message and calls GM_xmlhttpRequest.
window.addEventListener("message", receiveMessage, false);

function updateUI(price, element, extra) {
    if (extra !== null) {
        var estimatedIncome = (extra / 100) * price
        element.innerHTML = "$" + estimatedIncome.toFixed(2)
    } else {
        element.innerHTML = "$" + price
    }
}

function receiveMessage(event) {
    var messageJSON;
    try {
        messageJSON = JSON.parse(event.data);
    } catch (zError) {
        // Do nothing
    }

    if (!messageJSON) return; //-- Message is not for us.
    if (messageJSON[0] == "fetchURL") {
        var fetchURL = messageJSON[1];


        if (window.location.href === 'https://app.vapornodes.finance/calculator') {
            var target = document.querySelector(".css-2py4ol")
            if (target.innerHTML === "$0.00" || target.innerHTML === "$NaN") {
                getPrice(fetchURL, target, null)
            }
        } else if (window.location.href === 'https://app.vapornodes.finance/nodes') {
            var elements = document.querySelectorAll(".css-srjkl9")
            var nodeSizeElement = elements[1]
            var nodeSizeString = nodeSizeElement.innerHTML
            var nodeSize = parseInt(nodeSizeString.replaceAll(',', ''))
            var estimatedElement = elements[2]

            if (estimatedElement.innerHTML === "$0.00" || estimatedElement.innerHTML === "$NaN") {
                getPrice(fetchURL, estimatedElement, nodeSize)
            }
        }
    }
}

function getPrice(fetchURL, element, extra) {
    var instance = this
    GM_xmlhttpRequest({
        method: 'GET',
        url: fetchURL,
        onload: function(responseDetails) {
            // DO ALL RESPONSE PROCESSING HERE...
            var r = responseDetails.responseText
            var startIndex = r.indexOf('<div class="priceValue "><span>') + 32
            var endIndex = startIndex + 8
            var price = r.substring(startIndex, endIndex)
            updateUI(price, element, extra)
        }
    });
}

function withPages_jQuery(NAMED_FunctionToRun) {
    //--- Use named functions for clarity and debugging...
    var funcText = NAMED_FunctionToRun.toString();
    var funcName = funcText.replace(/^function\s+(\w+)\s*\((.|\n|\r)+$/, "$1");
    var script = document.createElement("script");
    script.textContent = funcText + "\n\n";
    script.textContent += 'window.onload = function() { setInterval(function(data) {' + funcName + '(); }, 5000);};';
    document.body.appendChild(script);
};