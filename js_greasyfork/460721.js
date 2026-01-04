// ==UserScript==
// @name         *Nitrotype Ad Blocker
// @namespace    ginfio.com
// @version      1.0
// @description  This script blocks all ads on nitro type on all pages.
// @author       Ginfio
// @match        https://www.nitrotype.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460721/%2ANitrotype%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/460721/%2ANitrotype%20Ad%20Blocker.meta.js
// ==/UserScript==

var ads = document.getElementsByClassName("structure-leaderboard por");
while (ads.length > 0) ads[0].remove();


document.querySelector(".profile--grid--aside").remove()
var x=document.getElementsByClassName(".structure-leaderboard por")

for (var i =0; i < x.length; i++){
x[i].remove()
}

var y = document.getElementsByClassName(".ad ad--side")

for (var j =0; j < x.length; j++){
y[j].remove()
}

