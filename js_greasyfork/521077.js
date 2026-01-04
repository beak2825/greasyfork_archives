// ==UserScript==
// @name         Prevent Peacock Autoplay
// @namespace    prevent-peacock-autoplay
// @description  Automatically clicks the pause button to prevent Peacock from automatically playing the next episode.
// @version      1.0
// @license MIT
// @match        https://www.peacocktv.com/*
// @icon         https://www.google.com/s2/favicons?domain=peacocktv.com
// @downloadURL https://update.greasyfork.org/scripts/521077/Prevent%20Peacock%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/521077/Prevent%20Peacock%20Autoplay.meta.js
// ==/UserScript==

function isElementVisible(element) { if (!element) { return false; // The element doesn't exist
                                                       }
                                        const rect = element.getBoundingClientRect();
                                        return ( rect.top > 0 &&
                                                 rect.left > 0 &&
                                                 rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                                                 rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                                                 window.getComputedStyle(element).visibility !== 'hidden' &&
                                                 window.getComputedStyle(element).display !== 'none'
                                               );
                                       }

setInterval(function(){
    var cancelButton = document.querySelector('button[data-test-id="autobinge-cancel"]');
    var isVisible = isElementVisible(cancelButton)
    if(isVisible){
        var pauseButton = document.querySelector('button.play-pause[aria-label=Pause]')
        if(pauseButton !== null){
            pauseButton.click()
        }
    }
}, 5000)