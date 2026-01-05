// ==UserScript==
// @name         LA Times Paywall Liberator
// @namespace    http://null
// @version      1.0
// @description  Disables paywall for the LA Times
// @author       Avrak
// @match        http*://*.latimes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22937/LA%20Times%20Paywall%20Liberator.user.js
// @updateURL https://update.greasyfork.org/scripts/22937/LA%20Times%20Paywall%20Liberator.meta.js
// ==/UserScript==


/* 
   A simple script to remove the paywall limitations for the LA Times. Enjoy!
*/

localStorage.removeItem('trb.metering.userData');

// Non-working script to attempt to remove the annoying banner popup. WIP!
window.setTimeout(removeNotify('met-prompt'), 700);

function removeNotify(mainElement)
{
    var list = document.getElementsByClassName(mainElement);
    for(var i = list.length - 1; 0 <= i; i--)
        if(list[i] && list[i].parentElement)
            list[i].parentElement.removeChild(list[i]);
}