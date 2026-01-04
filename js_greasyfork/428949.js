// ==UserScript==
// @name         Mute Peacock Ads
// @namespace    mute-peacock-ads
// @description  Mutes ads on Peacock
// @version      0.2
// @match        https://www.peacocktv.com/*
// @icon         https://www.google.com/s2/favicons?domain=peacocktv.com
// @downloadURL https://update.greasyfork.org/scripts/428949/Mute%20Peacock%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/428949/Mute%20Peacock%20Ads.meta.js
// ==/UserScript==

setInterval(function(){
    var adCountdown = document.querySelector('.ad-countdown__remaining-time')
    var muteButton = document.querySelector('button.playback-button[aria-label="Mute Sound"]')
    var unmuteButton = document.querySelector('button.playback-button[aria-label="Unmute Sound"]')

    if(adCountdown === null & unmuteButton != null){
        unmuteButton.click()
    }
    if(adCountdown != null & muteButton != null){
        muteButton.click()
    }
}, 1000)