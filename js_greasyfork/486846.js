// ==UserScript==
// @name         Your live status in trade
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Raffy
// @description  Shows your active status in trade page
// @license      MIT
// @match        https://www.torn.com/trade.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/486846/Your%20live%20status%20in%20trade.user.js
// @updateURL https://update.greasyfork.org/scripts/486846/Your%20live%20status%20in%20trade.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        GM_registerMenuCommand('Set Api Key', function() { requestApiKey(); });
    } catch (error) {}

    function requestApiKey() {
        let apiKey = prompt("Please provide a PUBLIC api key");
        if(apiKey !== null && apiKey.length == 16){
            localStorage.setItem("trade-ys-apikey", apiKey);
        }
    }

    function getApiKey() {
        return localStorage.getItem("trade-ys-apikey");
    }

    function updateStatus(){
        let apiKey = getApiKey();

        if(!apiKey){
            return;
        }

        let requestUrl = 'https://api.torn.com/user/?selections=&key=' + getApiKey();

        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            jQuery('#skip-to-content').html('Trade [' + data.last_action.status + ' - ' + data.last_action.relative + ']');
        });
    }

    if(!getApiKey()){
        requestApiKey();
    }

    const observerTarget = jQuery(".content-wrapper")[0];

    const observer = new MutationObserver(function(mutations) {
        let mutation = mutations[0].target;
        if (mutation.id == 'trade-container') {
            window.setInterval(updateStatus, 5000);
            updateStatus();
            observer.disconnect();
        }
    });
    observer.observe(observerTarget, { attributes: false, childList: true, characterData: false, subtree: true });

})();