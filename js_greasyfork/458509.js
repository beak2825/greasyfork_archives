// ==UserScript==
// @name        Rodar primos com twitter
// @autor       Hader Araujo
// @namespace   http://tampermonkey.net/
// @description Script para rodar primos com twitter
// @include     http://38.242.159.68:5000/?*
// @include     http://localhost:5000/?*
 
// @license     MIT
// @version     0.48
// @grant       GM_openInTab
// @grant       window.close
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/458509/Rodar%20primos%20com%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/458509/Rodar%20primos%20com%20twitter.meta.js
// ==/UserScript==
 
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
 
(async function () {
    'use strict';
 
    console.log("inicio");
    await sleep(1000);

    while(true) {
        var xmlhttp = new XMLHttpRequest();
    
        var url = 'http://38.242.159.68:5000/link' + window.location.search;
        // var url = 'http://localhost:5000/link' + window.location.search;
        xmlhttp.onreadystatechange = myfunction;
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);

        await sleep(randomIntFromInterval(1000, 3000));

        var url = 'http://38.242.159.68:5000/twitter' + window.location.search;
        // var url = 'http://localhost:5000/twitter' + window.location.search;
        xmlhttp.onreadystatechange = myfunction;
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);

        await sleep(randomIntFromInterval(3000, 6000));
        
    }

       async function myfunction() {
         if (xmlhttp.readyState == 4) {
             var link = JSON.parse(xmlhttp.responseText)['result']
             console.log(link);

             if (link) {
                GM_openInTab (link, { active: true, insert: true });

                var tweet_to_be_written = JSON.parse(xmlhttp.responseText)['tweet_to_be_written']
                console.log(tweet_to_be_written);

               if (tweet_to_be_written) {
                   GM_openInTab (tweet_to_be_written, { active: true, insert: true });
               }

               await sleep(10000);

            }
         }
     }

 
})();