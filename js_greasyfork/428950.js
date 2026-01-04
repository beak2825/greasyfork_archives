// ==UserScript==
// @name         Prevent Peacock Autoplay
// @namespace    prevent-peacock-autoplay
// @description  Automatically clicks the cancel button to prevent Peacock from automatically playing the next episode.
// @version      0.2
// @license MI
// @match        https://www.peacocktv.com/*
// @icon         https://www.google.com/s2/favicons?domain=peacocktv.com
// @downloadURL https://update.greasyfork.org/scripts/428950/Prevent%20Peacock%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/428950/Prevent%20Peacock%20Autoplay.meta.js
// ==/UserScript==

setInterval(function(){
    var cancelButton = document.querySelector('button.playback-binge__cancel-button')
    if(cancelButton !== null){
        var pauseButton = document.querySelector('button.play-pause[aria-label=Pause]')
        if(pauseButton !== null){
            pauseButton.click()
        }
    }
}, 1000)