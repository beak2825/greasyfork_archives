// ==UserScript==
// @name         SteamDiscoveryQueue
// @version      0.1
// @description  null
// @author       null
// @include      http*://store.steampowered.com/app/*
// @include      http*://store.steampowered.com/explore*
// @grant        none
// @namespace https://greasyfork.org/users/50805
// @downloadURL https://update.greasyfork.org/scripts/20891/SteamDiscoveryQueue.user.js
// @updateURL https://update.greasyfork.org/scripts/20891/SteamDiscoveryQueue.meta.js
// ==/UserScript==
console.log(2222)
var discoveryQueueWinterSaleCardsHeaderSubText = document.getElementsByClassName('subtext');
var refreshQueueBtn = document.getElementById('refresh_queue_btn');
if (refreshQueueBtn != null && discoveryQueueWinterSaleCardsHeaderSubText.length > 0 && /^.+\s\d\s.+$/.test(discoveryQueueWinterSaleCardsHeaderSubText[0].innerHTML))
    document.body.onload = function($){ refreshQueueBtn.children[0].click(); };

var nextInQueueForm = document.getElementById('next_in_queue_form');
if (nextInQueueForm != null)
    nextInQueueForm.submit();

var ageYear = document.getElementById('ageYear');
if (ageYear != null) {
    ageYear.selectedIndex = 0;
    DoAgeGateSubmit();
}
