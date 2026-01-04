// ==UserScript==
// @name         Prevent HBO Max Autoplay
// @namespace    prevent-hbo-max-autoplay
// @description  Automatically clicks the cancel button to prevent HBO Max from automatically playing the next episode.
// @version      0.4
// @match        https://play.hbomax.com/*
// @icon         https://www.google.com/s2/favicons?domain=hbomax.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446586/Prevent%20HBO%20Max%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/446586/Prevent%20HBO%20Max%20Autoplay.meta.js
// ==/UserScript==

setInterval(function(){
    const videos = document.querySelectorAll('video')
    if(videos.length !== 1){
        return
    }

    const cancelButton = document.querySelector('[data-testid=UpNextDismissButton]')
    if(cancelButton){
        cancelButton.click()
    }
}, 1000)