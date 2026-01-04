// ==UserScript==
// @name        GG Losowanko (faceci)
// @namespace   gmCreative
// @version     1.0
// @description Automatyczne losowanie na GG, co 25 sekund.
// @author      DemOn.
// @match       https://www.gg.pl*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/489714/GG%20Losowanko%20%28faceci%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489714/GG%20Losowanko%20%28faceci%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        location.reload();
    }, 1 * 60 * 60 * 1000);

    setTimeout(function(){
        triggerFetchRequest();
    }, 10000);


    var csrf_token = '';
    var numer_gg = '';

    // Function to trigger fetch request
    function triggerFetchRequest() {
        setInterval(function()
                    {
            var source = document.documentElement.innerHTML;
            var tokenRegex = /"csrf_token":"([^"]+)"/;
            var match = source.match(tokenRegex);
            if (match) {
                csrf_token = match[1];
                console.log(csrf_token);
            }
            else
            {
                location.reload();
            }

            var numerRegex = /"uin":"([^"]+)"/;
            var match_nr = source.match(numerRegex);
            if (match_nr) {
                numer_gg = match_nr[1];
                console.log(numer_gg);
            }
            else
            {
                location.reload();
            }

            if(csrf_token != "")
            {
                // Perform fetch request
                fetch("https://www.gg.pl/api/roulettes/gg/pl:" + numer_gg + ".json", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Language": "pl",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    "referrer": "https://www.gg.pl/",
                    "body": "age_ranges%5B%5D=16%2C120&gender=2&csrf_token=" + csrf_token,
                    "method": "POST",
                    "mode": "cors"
                });
            }
        },25000);
    }
})();