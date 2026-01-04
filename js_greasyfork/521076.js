// ==UserScript==
// @name         Mute Peacock Ads
// @namespace    mute-peacock-ads
// @description  Mutes ads on Peacock
// @version      1.0
// @license      MIT
// @match        https://www.peacocktv.com/*
// @icon         https://www.google.com/s2/favicons?domain=peacocktv.com
// @downloadURL https://update.greasyfork.org/scripts/521076/Mute%20Peacock%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/521076/Mute%20Peacock%20Ads.meta.js
// ==/UserScript==

let inAd = false

setInterval(function(){
       var muteButton = document.querySelector('button[data-testid="playback-mute-volume"]')
       var remainingTimeElement = document.querySelector('.countdown__remaining-time.ad-countdown__remaining-time');
       var remainingTime = remainingTimeElement ? remainingTimeElement.textContent : null;


    if(remainingTimeElement != null & !inAd){
        muteButton.click()
        inAd = true
    }
    if(remainingTimeElement == null & inAd){
        muteButton.click()
        inAd = false
   }
}, 1000)

