// ==UserScript==
// @name         Last action in faction page
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds last action status in faction pages
// @author       You
// @match        https://www.torn.com/factions.php?step=profile&*ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/491268/Last%20action%20in%20faction%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/491268/Last%20action%20in%20faction%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        GM_registerMenuCommand('Set Api Key', function() { requestApiKey(); });
    } catch (error) {}

    function requestApiKey() {
        let apiKey = prompt("Please provide a PUBLIC api key");
        if(apiKey !== null && apiKey.length == 16){
            localStorage.setItem("la-fp-apikey", apiKey);
        }
    }

    function getApiKey() {
        return localStorage.getItem("la-fp-apikey");
    }

    if(!getApiKey()){
        requestApiKey();
    }


    let watchInterval = window.setInterval(function(){

        if($('.members-list .table-body .table-row .tt-member-index').length > 0){

            const timestamp = Math.floor(Date.now() / 1000);

            let targetFactionId = '';
            if(window.location.href.match(/\&ID=([0-9]+)/)){
                targetFactionId = window.location.href.match(/\&ID=([0-9]+)/)[1];
            }

            let requestUrl = 'https://api.torn.com/faction/'+targetFactionId+'?selections=basic&key=' + getApiKey();

            window.clearInterval(watchInterval);


            fetch(requestUrl)
                .then(response => response.json())
                .then(data => {

                for(const userid in data.members){

                    const memberdata = data.members[userid];

                    let color = 'green';

                    if(timestamp - memberdata.last_action.timestamp > 3600){
                        color = 'yellow';
                    }

                    if(timestamp - memberdata.last_action.timestamp > 3600 * 3){
                        color = 'red';
                    }

                    $('a[href^=\'/profiles.php?XID=' + userid + '\']').closest('.table-row').find('.position .ellipsis').prepend('<span style="color:'+color+'">' + memberdata.last_action.relative + '</span><br>');

                }

                });

        }

        console.log('recheck');

    }, 200);

})();