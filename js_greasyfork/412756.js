// ==UserScript==
// @name         Twitch Prime Loot Claim All Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Embeds a button into the twitch prime loot element to automatically claim all of the offers automatically without having to scroll through all of the million items you may/may not have.
// @author       eM-Krow / Stop! You Violated The Law! (Same Person)
// @match        *://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412756/Twitch%20Prime%20Loot%20Claim%20All%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/412756/Twitch%20Prime%20Loot%20Claim%20All%20Button.meta.js
// ==/UserScript==

let o = new MutationObserver((m) => {
    let script = document.createElement("script");
    script.innerHTML = 'const claimAll=()=>{let aTags=document.getElementsByTagName("div"),searchText="Claim Offer";for(var i=0;i<aTags.length;i++)aTags[i].textContent==searchText&&aTags[i].parentElement.parentElement.click();};';
    document.getElementById("PrimeOfferPopover-header").innerHTML = "";
    document.getElementById("PrimeOfferPopover-header").appendChild(script);
    document.getElementById("PrimeOfferPopover-header").innerHTML += "<input type='button' style='border: none;' class='tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-full-width tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative' value='Claim All' onclick='claimAll();'>";
});

o.observe(document.body, {childList: true});