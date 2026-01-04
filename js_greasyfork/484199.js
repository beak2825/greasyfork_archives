// ==UserScript==
// @name         cityline retry button (full page reload)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cityline retry (full page reload)
// @author       You
// @match        https://msg.cityline.com/*
// @exclude      https://venue.cityline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msg.cityline.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484199/cityline%20retry%20button%20%28full%20page%20reload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484199/cityline%20retry%20button%20%28full%20page%20reload%29.meta.js
// ==/UserScript==

// Load the script
var scriptForDesktop = document.createElement("SCRIPT");
scriptForDesktop.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
scriptForDesktop.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(scriptForDesktop);


var loopCheckStart = setInterval(checkReadyForSales,1);

function checkReadyForSales(){
    //var retryButton = jQuery('.poster-container .btn_cta');
    const retryButton = document.querySelector("#btn-retry-en-1");
    if( retryButton.disabled == false && retryButton.style.display != 'none' ){
        console.log('click');
        retryButton.click();
        retryButton.disabled = true ;
    }
}
