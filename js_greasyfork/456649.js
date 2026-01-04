// ==UserScript==
// @name         BazaarTrick 2022 Edition
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Detects if items are overpriced
// @original_author       Funkydunk [728391]
// @secondary_author      BetaTester704 [2769914]
// @match        http://www.torn.com/bazaar.php*
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456649/BazaarTrick%202022%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/456649/BazaarTrick%202022%20Edition.meta.js
// ==/UserScript==


// Your API Key
var apiKey = "YOUR_API_KEY_HERE";
var highpriced = "";
var isoverpriced = 0;
var lowpriced = "";
var isunderpriced = 0;
var percentunder = 0;
var percentover = 0;
//update to set your basetrigger% for underpriced items -- NOT IMPLEMENTED YET
var percentunder_action = 110;
//update to set your basetrigger% for overpriced items
var percentover_action = 110;

(function() {

    // Your code here...
    'use strict';
    console.log("API Key: " + apiKey);
    if (apiKey == "YOUR_API_KEY_HERE")
        {
            window.alert("ApiKey is set at the Default Value, Replace and Reload the Page");
        }

    // get the ID of the bazaar you are currently viewing
    // remove spaces from window object reference below --- w i n d o w . l o c a t i o n .h r e f
    let currentPage = window.location.href;
    let urlElements = currentPage.split('=');
    let PlayerID = urlElements[1].split("&");

    // Get the information from the API for this bazaar
    let url = 'https://api.torn.com/user/' + PlayerID[0] + '?selections=bazaar&key=' + apiKey;
    fetch(url)
        .then(res => res.json())
        .then((out) => {
        for(let i = 0; i < out.bazaar.length; i++)
        {
            //if price is greater than market
            if (out.bazaar[i].price > out.bazaar[i].market_price)

            {
                //get % over market price
                percentover = ((out.bazaar[i].price / out.bazaar[i].market_price) * 100);
                if (percentover >= percentover_action)
                {
                    // Add up the worth of the items
                    //highpriced = highpriced + " " + out.bazaar[i].name + " -- ";
                    highpriced = highpriced + " " + out.bazaar[i].name + " --- MP:- $" + out.bazaar[i].market_price + ", LP:- $" + out.bazaar[i].price + ", %OVER:- " + percentover.toFixed(2) + "%\n";
                    //highpriced = highpriced + " " + out.bazaar[i].name + " --- MP:- $" + String.format("%,d", out.bazaar[i].market_price) + ", LP:- $" + out.bazaar[i].price + ", %OVER:- " + percentover.toFixed(2) + "%\n";
                    isoverpriced = 1;
                }
                percentover=0;
            }
        }
        if (isoverpriced == 1)
        {
            // Display the results
            window.alert("There are overpriced items \n\n\n" + highpriced.toLocaleString(undefined));
        }
    })
    .catch(err => console.error(err));
})();