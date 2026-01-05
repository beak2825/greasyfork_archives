// ==UserScript==
// @name         AWS Hourly to Monthly price converter
// @namespace    http://github.com/
// @version      0.1
// @description  github link to come
// @author       Scellow
// @match        http://aws.amazon.com/ec2/pricing/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11026/AWS%20Hourly%20to%20Monthly%20price%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/11026/AWS%20Hourly%20to%20Monthly%20price%20converter.meta.js
// ==/UserScript==

DEBUG = false;

HOURS_IN_ONE_MONTH = 720;
DECIMAL_TO_DISPLAY = 2;

PRICE_NON_AVAILABLE = "N/A*";
CURRENCY = "$";
PRODUCTS = ["linux","rhel","sles","mswin","mswinSQL","mswinSQLWeb","mswinSQLEnterprise"];


window.onload = function ()
{
    debugLog("INFO: Document loaded!");

    var rates = [];

    //get rates
    for(var i = 0; i < PRODUCTS.length; i++)
    {
        var product = PRODUCTS[i];
        var rate = document.getElementsByClassName(product);
        debugLog("INFO: "+product+" has "+ rate.length + " elements");
        for(var j = 0; j < rate.length; j++)
        {
            var element = rate[j];
            rates.push(element);
        }
    }

    debugLog('INFO: Found:'+ rates.length + ' price');

    for(var i = 0; i < rates.length; i++)
    {
        var element = rates[i];
        var content = rates[i].innerHTML;
        if(content != PRICE_NON_AVAILABLE)
        {
            var pph = content;
            pph = pph.replace(CURRENCY, "");
            pph = pph.replace(" per Hour", "");

            var ppm = (pph * HOURS_IN_ONE_MONTH).toFixed(DECIMAL_TO_DISPLAY);

            rates[i].innerHTML = content + '</br>$' + ppm + ' per Month';
        }
    }
}

$(document).ready(function() {
    debugLog("INFO: Debug mode enabled!");
    debugLog("INFO: Document Ready!");
});

function debugLog(message)
{
    if(!DEBUG) return;

    console.log(message);
}