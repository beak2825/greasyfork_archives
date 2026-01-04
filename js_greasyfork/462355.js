// ==UserScript==
// @name         Disable Roku Autoplay
// @namespace    disable-roku-autoplay
// @version      0.2
// @description  Disables Roku autoplay
// @match        https://therokuchannel.roku.com/*
// @downloadURL https://update.greasyfork.org/scripts/462355/Disable%20Roku%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/462355/Disable%20Roku%20Autoplay.meta.js
// ==/UserScript==

(new MutationObserver(function(mutations_list) {
    if(document.querySelector('.countdown-timer') !== null){
        document.querySelector('video').pause()
    }
})).observe(document, { subtree: true, childList: true })